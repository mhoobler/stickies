import "../styles/style.scss";
import {
  getStickies,
  addSticky,
  updateSticky,
  deleteSticky,
} from "./indexedDB.js";

const App = document.getElementById("App");
const colorSelect = document.getElementById("color-select");
const colorOptions = document.getElementById("color-options");
const stickyContainer = document.getElementById("sticky-container");
const trash = document.getElementById("trash");
const trashPath = document.getElementById("trash").querySelector("path");
const hidden = document.getElementById("hidden");

function* inf() {
  let index = 0;
  while (true) {
    yield index++;
  }
}

var getZ = inf();

const STATE = {
  selectedColor: () => colorSelect.getAttribute("data-color"),
  showingOptions: () => !colorOptions.classList.contains("hidden"),
  zIndex: () => getZ.next().value,
  getOffset: (target) => {
    var { top, left } = target.style;
    top = parseInt(top.slice(0, -2));
    left = parseInt(left.slice(0, -2));
    return { top, left };
  },
  dragging: null,
};

function createElm(obj) {
  const { tag, classList, id, value, style, dataset } = obj;
  const elm = document.createElement(tag);
  if (classList) {
    elm.classList = classList;
  }
  if (id) {
    elm.id = id;
  }
  if (value) {
    elm.value = value;
  }
  if (style) {
    for (let k of Object.keys(style)) {
      elm.style[k] = style[k];
    }
  }
  if (dataset) {
    for (let k of Object.keys(dataset)) {
      elm.dataset[k] = dataset[k];
    }
  }
  return elm;
}

const debounce = (func, time = 1000) => {
  let timeout;
  return (args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(args);
    }, time);
  };
};

function createSticky(id, pageY, pageX, color = null, value = null) {
  const wrapper = createElm({
    tag: "div",
    classList: "sticky-wrapper",
    style: {
      zIndex: STATE.zIndex(),
      top: typeof pageY === "string" ? pageY : pageY + "px",
      left: typeof pageX === "string" ? pageX : pageX + "px",
      color: color || STATE.selectedColor(),
    },
    dataset: {
      id,
    },
  });
  const newSticky = createElm({
    tag: "div",
    classList: "sticky",
    dataset: {
      color: color || STATE.selectedColor(),
    },
  });
  const handle = createElm({
    tag: "div",
  });
  const textarea = createElm({
    tag: "textarea",
    value: value,
  });

  textarea.onkeydown = debounce((e) => {
    const { top, left } = wrapper.style;
    const { id } = wrapper.dataset;
    const { color } = newSticky.dataset;
    const { value } = e.target;

    updateSticky({
      id: parseInt(id),
      top,
      left,
      color,
      message: value,
    });
  });

  wrapper.appendChild(newSticky);
  newSticky.appendChild(handle);
  newSticky.appendChild(textarea);

  newSticky.addEventListener("touchstart", stickyTouchStart);
  newSticky.addEventListener("mousedown", stickyMouseDown);

  return wrapper;
}

function stickyTouchStart(e) {
  e.currentTarget.parentElement.style.zIndex = STATE.zIndex();
  if (e.target.tagName !== "TEXTAREA") {
    const current = e.currentTarget;
    const parent = current.parentElement;
    STATE.dragging = parent;
    const { top, left } = STATE.getOffset(parent);
    const xOffset = left - e.targetTouches[0].pageX;
    const yOffset = top - e.targetTouches[0].pageY;

    const trashRect = trashPath.getBoundingClientRect();
    trashRect.x = Math.floor(trashRect.x);
    trashRect.y = Math.floor(trashRect.y);
    var pageX, pageY;

    function touchMove(e) {
      pageX = e.targetTouches[0].pageX;
      pageY = e.targetTouches[0].pageY;
      const { x, y, width, height } = trashRect;

      if (pageX > x && pageX < x + width && pageY > y && pageY < y + height) {
        trashPath.style.fill = "#f33";
      } else {
        trashPath.style.fill = "";
      }

      parent.style.top = yOffset + pageY + "px";
      parent.style.left = xOffset + pageX + "px";
    }

    function touchEnd(e) {
      const { x, y, width, height } = trashRect;

      const message = current.querySelector("textarea").value;
      const { top, left } = parent.style;
      const { id } = parent.dataset;
      const { color } = current.dataset;

      if (pageX > x && pageX < x + width && pageY > y && pageY < y + height) {
        trashPath.style.fill = "#F33";
        deleteDragging();
        return;
      } else {
        updateSticky({
          id: parseInt(id),
          top,
          left,
          message,
          color,
        });
      }

      STATE.dragging = null;
      current.removeEventListener("touchmove", touchMove);
      current.removeEventListener("touchend", touchEnd);
      current.addEventListener("touchstart", stickyTouchStart);
    }

    current.addEventListener("touchmove", touchMove);
    current.addEventListener("touchend", touchEnd);
    current.removeEventListener("touchstart", stickyTouchStart);
  }
}

function stickyMouseDown(e) {
  e.currentTarget.parentElement.style.zIndex = STATE.zIndex();
  if (e.target.tagName !== "TEXTAREA") {
    const current = e.currentTarget;
    const parent = e.currentTarget.parentElement;
    STATE.dragging = parent;
    const { top, left } = STATE.getOffset(parent);
    const xOffset = left - e.pageX;
    const yOffset = top - e.pageY;

    const trashRect = trashPath.getBoundingClientRect();
    trashRect.x = Math.floor(trashRect.x);
    trashRect.y = Math.floor(trashRect.y);
    const { x, y, width, height } = trashRect;
    var pageX, pageY;

    function mouseMove(e) {
      pageX = e.pageX;
      pageY = e.pageY;

      if (pageX > x && pageX < x + width && pageY > y && pageY < y + height) {
        trashPath.style.fill = "#f33";
      } else {
        trashPath.style.fill = "";
      }

      parent.style.top = yOffset + e.pageY + "px";
      parent.style.left = xOffset + e.pageX + "px";
    }

    function mouseUp(e) {
      const message = current.querySelector("textarea").value;
      const { top, left } = parent.style;
      const { id } = parent.dataset;
      const { color } = current.dataset;

      if (pageX > x && pageX < x + width && pageY > y && pageY < y + height) {
        trashPath.style.fill = "#F33";
        deleteDragging();

        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
      } else {
        updateSticky({
          id: parseInt(id),
          top,
          left,
          message,
          color,
        });
      }

      STATE.dragging = null;
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    }

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  }
}

// Color Select Events --- START
// Note: We're handling events differently
colorSelect.addEventListener("mousedown", colorSelectMouseDown);
colorSelect.addEventListener("touchstart", colorSelectTouchStart);
colorSelect.addEventListener("touchend", colorSelectClick);
colorSelect.addEventListener("mouseup", colorSelectClick);

// This timeout is used to differentiate between a click and a drag
// DragEvents were a huge performance hit compared to MouseEvents
// Seems like something to do with long idle frames,
// but can't pin down exactly why DragEvents are so slow
var timeout;

function colorSelectMouseDown(e) {
  timeout = setTimeout(() => {
    const newSticky = createSticky(0, e.pageY, e.pageX);
    stickyContainer.appendChild(newSticky);
    STATE.dragging = newSticky;

    // handle drag
    function mouseMove(e) {
      newSticky.style.top = e.pageY + "px";
      newSticky.style.left = e.pageX + "px";
    }

    // handle end of drag
    function mouseUp(e) {
      STATE.dragging = null;
      addSticky(
        {
          top: e.pageY,
          left: e.pageX,
          color: STATE.selectedColor(),
        },
        (id) => (newSticky.dataset.id = id)
      );

      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    }

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  }, 200);
}

function colorSelectTouchStart(e) {
  // TouchEvents can initiate MouseEvents, but not the other way around
  colorSelect.removeEventListener("mouseup", colorSelectClick);
  colorSelect.removeEventListener("mousedown", colorSelectMouseDown);

  timeout = setTimeout(() => {
    const newSticky = createSticky(
      0,
      e.targetTouches[0].pageY,
      e.targetTouches[0].pageX
    );
    stickyContainer.appendChild(newSticky);

    // Handle drag
    function touchMove(e) {
      newSticky.style.top = e.targetTouches[0].pageY + "px";
      newSticky.style.left = e.targetTouches[0].pageX + "px";
      colorSelect.removeEventListener("touchend", colorSelectTouchEnd);
    }

    // Handle end of drag
    function touchEnd(e) {
      timeout = null;
      addSticky(
        {
          top: newSticky.style.top,
          left: newSticky.style.left,
          color: STATE.selectedColor(),
        },
        (id) => (newSticky.dataset.id = id)
      );
      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("touchend", touchEnd);
      colorSelect.removeEventListener("touchend", colorSelectTouchEnd);
      colorSelect.addEventListener("touchend", colorSelectTouchEnd);
    }

    document.addEventListener("touchmove", touchMove);
    document.addEventListener("touchend", touchEnd);
  }, 200);
}

// This fires when the user "clicks"
function colorSelectClick(e) {
  if (timeout) {
    clearTimeout(timeout);
  }
  const targetValue = e.target.dataset.color;
  e.currentTarget.setAttribute("data-color", targetValue);

  colorOptions.classList.toggle("hidden");
}

// Color Select Events --- END

function deleteDragging() {
  if (STATE.dragging) {
    let confirm = window.confirm("Are you sure you want to delete this?");
    if (confirm) {
      deleteSticky({ id: STATE.dragging.dataset.id });

      STATE.dragging.remove();
      STATE.dragging = null;
      trashPath.style.fill = "";
    }
  }
}

// Organizers
function organize(str) {
  const colorsArr = ["#FD1", "#FAA", "#AAF"];

  //reset zIndex generator
  getZ = inf();

  for (let dy = 0; dy < colorsArr.length; dy++) {
    const stickies = [
      ...document.querySelectorAll(`.sticky[data-color="${colorsArr[dy]}"]`),
    ];

    switch (str) {
      case "diagonal": {
        for (let dx = 0; dx < stickies.length; dx++) {
          let wrapper = stickies[dx].parentElement;
          let textarea = stickies[dx].querySelector("textarea");
          wrapper.style.top = 35 * dx + 50 + "px";
          wrapper.style.left = 20 * dx + 250 * dy + 50 + "px";
          wrapper.style.zIndex = dx * colorsArr.length + dy;
          wrapper.style.transition = "top 0.5s, left 0.5s";
          textarea.style.width = 100 + "px";
          textarea.style.height = 100 + "px";

          // call zIndex generator to keep it updated
          // ...hate this loop, but it's pretty fast
          while (dx * colorsArr.length + dy > getZ.next().value) {
            getZ.next().value;
          }
        }
        break;
      }

      case "horizontal": {
        for (let dx = 0; dx < stickies.length; dx++) {
          let wrapper = stickies[dx].parentElement;
          let textarea = stickies[dx].querySelector("textarea");
          wrapper.style.top = dy * 200 + 50 + "px";
          wrapper.style.left = dx * 50 + 50 + "px";
          wrapper.style.zIndex = getZ.next().value;
          wrapper.style.transition = "top 0.5s, left 0.5s";
          textarea.style.width = 100 + "px";
          textarea.style.height = 100 + "px";
        }
        break;
      }

      case "vertical": {
        for (let dx = 0; dx < stickies.length; dx++) {
          let wrapper = stickies[dx].parentElement;
          let textarea = stickies[dx].querySelector("textarea");
          wrapper.style.left = dy * 200 + 50 + "px";
          wrapper.style.top = dx * 50 + 50 + "px";
          wrapper.style.zIndex = getZ.next().value;
          wrapper.style.transition = "top 0.5s, left 0.5s";
          textarea.style.width = 100 + "px";
          textarea.style.height = 100 + "px";
        }
        break;
      }
      default:
        break;
    }
  }

  setTimeout(() => {
    const wrappers = [...document.querySelectorAll(".sticky-wrapper")];

    for (let w of wrappers) {
      w.style.transition = "";
    }
  }, 520);
}

document.getElementById("diagonal").onclick = () => organize("diagonal");
document.getElementById("horizontal").onclick = () => organize("horizontal");
document.getElementById("vertical").onclick = () => organize("vertical");

// fetch Stickies on first render
getStickies((stickies) => {
  for (let s of stickies) {
    let newSticky = createSticky(s.id, s.top, s.left, s.color, s.message);
    stickyContainer.appendChild(newSticky);
  }
});

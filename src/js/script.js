import "../styles/style.scss";
import initDB from "./indexedDB.js";

const App = document.getElementById("App");
const colorSelect = document.getElementById("color-select");
const colorOptions = document.getElementById("color-options");
const stickyContainer = document.getElementById("sticky-container");
const trash = document.getElementById("trash");
const trashPath = document.getElementById("trash").querySelector("path");
const hidden = document.getElementById("hidden");

function getStickies() {
  initDB()
    .then((res) => {
      const request = res.store.getAll();
      request.onsuccess = (evt) => {
        const stickies = evt.target.result;
        for (let s of stickies) {
          let newSticky = createSticky(s.id, s.top, s.left, s.color, s.message);
          stickyContainer.appendChild(newSticky);
        }
      };
      request.onerror = (evt) => {
        console.log(evt);
      };
    })
    .catch((err) => console.error(err));
}

function addSticky({ color, top, left }, elm) {
  initDB()
    .then((res) => {
      const request = res.store.add({ color, top, left, message: "" });
      request.onsuccess = (evt) => {
        console.log("add sticky: ", evt.target.result);
        elm.dataset.id = evt.target.result;
      };
      request.onerror = (evt) => {
        console.log(evt);
      };
    })
    .catch((err) => console.error(err));
}

function updateSticky({ id, color, top, left, message }) {
  initDB()
    .then((res) => {
      const request = res.store.put({ id, color, top, left, message });
      request.onsuccess = (evt) => {
        console.log(evt.target.result);
      };
      request.onerror = (evt) => {
        console.log(evt);
      };
    })
    .catch((err) => console.error(err));
}

function deleteSticky(id) {
  initDB()
    .then((res) => {
      const request = res.store.delete(parseInt(id));
      request.onsuccess = (evt) => {
        console.log(evt.target.result);
      };
      request.onerror = (evt) => {
        console.log(evt);
      };
    })
    .catch((err) => console.error(err));
}

const removeChildren = (query) => {
  const remove = [...document.querySelectorAll(query)];
  for (let elm of remove) {
    document.body.removeChild(elm);
  }
};

const removeChild = document.body.removeChild;

function* inf() {
  let index = 0;
  while (true) {
    yield index++;
  }
}

var gen = inf();

const STATE = {
  selectedColor: () => colorSelect.getAttribute("data-color"),
  showingOptions: () => !colorOptions.classList.contains("hidden"),
  zIndex: () => gen.next().value,
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
    STATE.dragging = current;
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
        trashPath.style.fill = "#F33";
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
        trashUp();
        return;
      }

      STATE.dragging = null;

      updateSticky({
        id: parseInt(id),
        top,
        left,
        message,
        color,
      });

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
  const { height, width } = App.getBoundingClientRect();
  if (e.target.tagName !== "TEXTAREA") {
    const current = e.currentTarget;
    const parent = e.currentTarget.parentElement;
    STATE.dragging = current;
    const { top, left } = STATE.getOffset(parent);
    const xOffset = left - e.pageX;
    const yOffset = top - e.pageY;

    function mouseMove(e) {
      parent.style.top = yOffset + e.pageY + "px";
      parent.style.left = xOffset + e.pageX + "px";
    }

    function mouseUp(e) {
      STATE.dragging = null;
      const message = current.querySelector("textarea").value;
      const { top, left } = parent.style;
      const { id } = parent.dataset;
      const { color } = current.dataset;

      updateSticky({
        id: parseInt(id),
        top,
        left,
        message,
        color,
      });

      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    }

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  }
}

// Color Select Events --- START
colorSelect.addEventListener("mouseup", colorSelectClick);
colorSelect.addEventListener("mousedown", colorSelectMouseDown);
//colorSelect.addEventListener("dragstart", colorSelectDragStart);
//colorSelect.addEventListener("dragend", colorSelectDragEnd);

// touch events
colorSelect.addEventListener("touchstart", colorSelectTouchStart);
colorSelect.addEventListener("touchend", colorSelectTouchEnd);

var timeout;

function colorSelectMouseDown(e) {
  timeout = setTimeout(() => {
    const newSticky = createSticky(0, e.pageY, e.pageX);
    stickyContainer.appendChild(newSticky);
    STATE.dragging = newSticky;

    function mouseMove(e) {
      newSticky.style.top = e.pageY + "px";
      newSticky.style.left = e.pageX + "px";
    }

    function mouseUp(e) {
      STATE.dragging = null;
      addSticky(
        {
          top: e.pageY,
          left: e.pageX,
          color: STATE.selectedColor(),
        },
        newSticky
      );

      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    }

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  }, 200);
}

function colorSelectTouchStart(e) {
  colorSelect.removeEventListener("mouseup", colorSelectClick);
  colorSelect.removeEventListener("mousedown", colorSelectMouseDown);

  timeout = setTimeout(() => {
    const newSticky = createSticky(
      0,
      e.targetTouches[0].pageY,
      e.targetTouches[0].pageX
    );
    stickyContainer.appendChild(newSticky);

    function touchMove(e) {
      newSticky.style.top = e.targetTouches[0].pageY + "px";
      newSticky.style.left = e.targetTouches[0].pageX + "px";
      colorSelect.removeEventListener("touchend", colorSelectTouchEnd);
    }

    function touchEnd(e) {
      timeout = null;
      addSticky(
        {
          top: newSticky.style.top,
          left: newSticky.style.left,
          color: STATE.selectedColor(),
        },
        newSticky
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

function colorSelectTouchEnd(e) {
  if (timeout) {
    clearTimeout(timeout);
  }
  const targetValue = e.target.dataset.color;
  e.currentTarget.setAttribute("data-color", targetValue);

  colorOptions.classList.toggle("hidden");
}

function colorSelectClick(e) {
  if (timeout) {
    clearTimeout(timeout);
  }
  const targetValue = e.target.dataset.color;

  e.currentTarget.setAttribute("data-color", targetValue);
  colorOptions.classList.toggle("hidden");
}

// Color Select Events --- END

function stickyTouchEnd(e) {
  if (e.target.tagName !== "TEXTAREA") {
    const parent = e.currentTarget;
    const message = parent.querySelector("textarea").value;
    const { top, left } = parent.style;
    const { id, color } = parent.dataset;

    updateSticky({
      id: parseInt(id),
      top,
      left,
      message,
      color,
    });
  }
}

function trashLeave(e) {
  trashPath.style.fill = "";
}

function trashUp() {
  if (STATE.dragging) {
    let confirm = window.confirm("Are you sure you want to delete this?");
    if (confirm) {
      deleteSticky(STATE.dragging.dataset.id);

      STATE.dragging.remove();
      STATE.dragging = null;
      trashPath.style.fill = "";
    }
  }
}

function trashEnter(e) {
  if (STATE.dragging) {
    trashPath.style.fill = "#F33";
  }
}

trash.addEventListener("mouseenter", trashEnter);
trash.addEventListener("mouseleave", trashLeave);
trash.addEventListener("mouseup", trashUp);

trash.addEventListener("touchstart", (e) => {
  trashPath.style.fill = "#F33";
});

trash.addEventListener("touchend", (e) => {
  trashPath.style.fill = "";
});

// Organizers

function organize(str) {
  const colorsArr = ["#FD1", "#FAA", "#AAF"];

  //reset zIndex generator
  gen = inf();

  const stickies = colorsArr.map((e) => [
    ...document.querySelectorAll(`.sticky[data-color="${e}"]`),
  ]);

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
          textarea.style.width = 100 + "px";
          textarea.style.height = 100 + "px";

          // call zIndex generator to keep it updated
          // ...hate this loop, but it's pretty fast
          while (dx * colorsArr.length + dy > gen.next().value) {
            gen.next().value;
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
          wrapper.style.zIndex = gen.next().value;
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
          wrapper.style.zIndex = gen.next().value;
          textarea.style.width = 100 + "px";
          textarea.style.height = 100 + "px";
        }
        break;
      }
      default:
        break;
    }
  }
}

document.getElementById("diagonal").onclick = () => organize("diagonal");
document.getElementById("horizontal").onclick = () => organize("horizontal");
document.getElementById("vertical").onclick = () => organize("vertical");

// fetch Stickies on first render
getStickies();

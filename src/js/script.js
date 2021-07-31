import "../styles/style.scss";
import initDB from "./indexedDB.js";

const colorSelect = document.getElementById("color-select");
const colorOptions = document.getElementById("color-options");
const stickyContainer = document.getElementById("sticky-container");
const trash = document.getElementById("trash");
const trashPath = document.getElementById("trash-path");
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

function addSticky({ color, top, left }) {
  initDB()
    .then((res) => {
      const request = res.store.add({ color, top, left, message: "" });
      request.onsuccess = (evt) => {
        console.log(evt.target.result);
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

document.getElementById("reset").addEventListener("click", () => {
  const stickies = [...document.querySelectorAll(".sticky")];
  for (let s of stickies) {
    s.style.zIndex = 0;
  }
  gen = inf();
});

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
  const newSticky = createElm({
    tag: "div",
    classList: "sticky",
    style: {
      top: typeof pageY === "string" ? pageY : pageY + "px",
      left: typeof pageX === "string" ? pageX : pageX + "px",
      zIndex: STATE.zIndex(),
    },
    dataset: {
      id,
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
    const parent = e.target.parentElement;
    const { top, left } = parent.style;
    const { id, color } = parent.dataset;
    const { value } = e.target;

    updateSticky({
      id: parseInt(id),
      top,
      left,
      color,
      message: value,
    });
  });

  newSticky.appendChild(handle);
  newSticky.appendChild(textarea);
  newSticky.draggable;
  //newSticky.addEventListener("dragstart", stickyDragStart);
  //newSticky.addEventListener("dragend", stickyDragEnd);
  newSticky.addEventListener("touchmove", stickyTouchMove);
  newSticky.addEventListener("mousedown", stickyMouseDown);

  return newSticky;
}

function stickyMouseDown(e) {
  e.currentTarget.style.zIndex = STATE.zIndex();
  if (e.target.tagName !== "TEXTAREA") {
    const current = e.currentTarget;
    STATE.dragging = current;
    const { top, left } = STATE.getOffset(current);
    const xOffset = left - e.pageX;
    const yOffset = top - e.pageY;

    function mouseMove(e) {
      current.style.top = yOffset + e.pageY + "px";
      current.style.left = xOffset + e.pageX + "px";
    }

    function mouseUp(e) {
      STATE.dragging = null;
      const message = e.currentTarget.querySelector("textarea").value;
      const { top, left } = e.currentTarget.style;
      const { id, color } = e.currentTarget.dataset;

      updateSticky({
        id: parseInt(id),
        top,
        left,
        message,
        color,
      });

      current.removeEventListener("mousemove", mouseMove);
      current.removeEventListener("mouseup", mouseUp);
    }

    current.addEventListener("mousemove", mouseMove);
    current.addEventListener("mouseup", mouseUp);
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
    const newSticky = createSticky(e.pageY, e.pageX);
    stickyContainer.appendChild(newSticky);
    STATE.dragging = newSticky;

    function mouseMove(e) {
      newSticky.style.top = e.pageY + "px";
      newSticky.style.left = e.pageX + "px";
    }

    function mouseUp(e) {
      STATE.dragging = null;
      addSticky({
        top: e.pageY,
        left: e.pageX,
        color: STATE.selectedColor(),
      });

      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    }

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  }, 200);
}

var evtFunc;

function colorSelectTouchStart(e) {
  const newSticky = createSticky(0, 0);
  console.log(newSticky);
  evtFunc = (e) => colorSelectTouchMove(e, newSticky);
  colorSelect.addEventListener("touchmove", evtFunc);
  stickyContainer.appendChild(newSticky);
}

function colorSelectTouchMove(e, sticky) {
  sticky.style.top = e.targetTouches[0].pageY + "px";
  sticky.style.left = e.targetTouches[0].pageX + "px";
}

function colorSelectTouchEnd(e) {
  console.log(e);
  colorSelect.removeEventListener("touchmove", evtFunc);
}

function colorSelectClick(e) {
  console.log("c");
  if (timeout) {
    clearTimeout(timeout);
  }
  const targetValue = e.target.dataset.color;

  e.currentTarget.setAttribute("data-color", targetValue);
  colorOptions.classList.toggle("hidden");
}

// Color Select Events --- END

function stickyTouchMove(e) {
  STATE.dragged = e.currentTarget;
  e.currentTarget.style.top = e.targetTouches[0].pageY + "px";
  e.currentTarget.style.left = e.targetTouches[0].pageX + "px";

  touchTarget = e;
}

function trashDrop(e) {
  console.log(e);
  trashLeave(e);
}

function trashEnter(e) {
  if (STATE.dragging) {
    trashPath.style.fill = "#F33";
  }
}

function trashLeave(e) {
  trashPath.style.fill = "";
}

function trashUp(e) {
  if (STATE.dragging) {
    let confirm = window.confirm("Are you sure you want to delete this?");
    console.log(confirm);
    if (confirm) {
      deleteSticky(STATE.dragging.dataset.id);

      STATE.dragging.remove();
      STATE.dragging = null;
      trashPath.style.fill = "";
    }
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

// fetch Stickies on first render
getStickies();

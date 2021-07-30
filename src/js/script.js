import "../styles/style.scss";

if (module.hot) {
  module.hot.accept();
}

const colorSelect = document.getElementById("color-select");
const colorOptions = document.getElementById("color-options");
const stickyContainer = document.getElementById("sticky-container");
const hidden = document.getElementById("hidden");

const removeChildren = (query) => {
  const remove = [...document.querySelectorAll(query)];
  console.log(remove);
  for (let elm of remove) {
    document.body.removeChild(elm);
  }
};

const removeChild = document.body.removeChild;

const STATE = {
  selectedColor: () => colorSelect.getAttribute("value"),
  showingOptions: () => !colorOptions.classList.contains("hidden"),
};

const createElm = (obj) => {
  const { tag, classList, id, value, style, dataset } = obj;
  const elm = document.createElement(tag);
  elm.classList = classList;
  if (id) {
    elm.id = id;
  }
  if (value) {
    elm.setAttribute("value", value);
  }
  if (style) {
    for (let k of Object.keys(style)) {
      elm.style[k] = style[k];
    }
  }
  return elm;
};

colorSelect.onclick = (e) => {
  const targetValue = e.target.getAttribute("value");

  e.currentTarget.setAttribute("value", targetValue);
  colorOptions.classList.toggle("hidden");
};

colorSelect.addEventListener("dragstart", (e) => {
  const newSticky = createElm({
    tag: "div",
    classList: "sticky remove",
    style: {
      width: "100px",
      height: "100px",
      backgroundColor: STATE.selectedColor(),
    },
  });
  document.body.appendChild(newSticky);
  e.dataTransfer.setDragImage(newSticky, 0, 0);
});

colorSelect.addEventListener("dragend", (e) => {
  removeChildren(".sticky.remove");
  const newSticky = createElm({
    tag: "div",
    classList: "sticky",
    style: {
      top: e.pageY + "px",
      left: e.pageX + "px",
      backgroundColor: STATE.selectedColor(),
    },
  });

  newSticky.draggable = true;
  newSticky.addEventListener("dragstart", stickyDragStart);
  newSticky.addEventListener("dragend", stickyDragEnd);

  stickyContainer.appendChild(newSticky);
});

const stickyDragStart = (e) => {
  e.currentTarget.style.display = "hidden";
};

const stickyDragEnd = (e) => {
  console.log(e);
  e.currentTarget.style.top = e.pageY + "px";
  e.currentTarget.style.left = e.pageX + "px";
};

const x = document.querySelector("body");
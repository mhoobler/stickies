export const colorSelectOnClick = (e) => {
  const targetValue = e.target.getAttribute("value");

  e.currentTarget.setAttribute("value", targetValue);
  colorOptions.classList.toggle("hidden");
};

export const colorSelectDragStart = (e) => {
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
};

export const colorSelectDragEnd = (e) => {
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
};

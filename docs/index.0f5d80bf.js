!function(){const e=document.getElementById("color-select"),t=document.getElementById("color-options"),d=document.getElementById("sticky-container"),o=(document.getElementById("hidden"),document.body.removeChild,()=>e.getAttribute("value")),n=e=>{const{tag:t,classList:d,id:o,value:n,style:r,dataset:s}=e,a=document.createElement(t);if(a.classList=d,o&&(a.id=o),n&&a.setAttribute("value",n),r)for(let e of Object.keys(r))a.style[e]=r[e];return a};e.onclick=e=>{const d=e.target.getAttribute("value");e.currentTarget.setAttribute("value",d),t.classList.toggle("hidden")},e.addEventListener("dragstart",(e=>{const t=n({tag:"div",classList:"sticky remove",style:{width:"100px",height:"100px",backgroundColor:o()}});document.body.appendChild(t),e.dataTransfer.setDragImage(t,0,0)})),e.addEventListener("dragend",(e=>{(e=>{const t=[...document.querySelectorAll(e)];console.log(t);for(let e of t)document.body.removeChild(e)})(".sticky.remove");const t=n({tag:"div",classList:"sticky",style:{top:e.pageY+"px",left:e.pageX+"px",backgroundColor:o()}});t.draggable=!0,t.addEventListener("dragstart",r),t.addEventListener("dragend",s),d.appendChild(t)}));const r=e=>{e.currentTarget.style.display="hidden"},s=e=>{console.log(e),e.currentTarget.style.top=e.pageY+"px",e.currentTarget.style.left=e.pageX+"px"};document.querySelector("body")}();
//# sourceMappingURL=index.0f5d80bf.js.map
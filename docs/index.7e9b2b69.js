!function(){const e=async()=>new Promise(((e,t)=>{var o,n=indexedDB.open("stickiesDB",1);n.onerror=e=>{console.error("IndexedDB error"),t("Error with creating request")},n.onsuccess=async t=>{console.log(t),(o=t.target.result).onerror=e=>{console.error("Database error: "+e.target.errorCode)};try{const t=(await(async e=>new Promise(((t,o)=>{var n=e.transaction(["stickies"],"readwrite");n.oncomplete=e=>{console.log("transaction success",e)},n.onerror=e=>{console.error("transaction error",e)},n?t(n):o("Error with creating transaction")})))(o)).objectStore("stickies");e({store:t})}catch(e){console.log(e)}},n.onupgradeneeded=e=>{var t=e.target.result.createObjectStore("stickies",{autoIncrement:!0,keyPath:"id"});t.createIndex("id","id",{unique:!0}),t.createIndex("message","message",{unique:!1}),t.createIndex("color","color",{unique:!1}),t.createIndex("left","left",{unique:!1}),t.createIndex("top","top",{unique:!1})}})),t=document.getElementById("App"),o=document.getElementById("color-select"),n=document.getElementById("color-options"),r=document.getElementById("sticky-container"),s=(document.getElementById("trash"),document.getElementById("trash").querySelector("path"));document.getElementById("hidden");function l({color:t,top:o,left:n},r){e().then((e=>{const s=e.store.add({color:t,top:o,left:n,message:""});s.onsuccess=e=>{console.log("add sticky: ",e.target.result),r.dataset.id=e.target.result},s.onerror=e=>{console.log(e)}})).catch((e=>console.error(e)))}function a({id:t,color:o,top:n,left:r,message:s}){e().then((e=>{const l=e.store.put({id:t,color:o,top:n,left:r,message:s});l.onsuccess=e=>{console.log(e.target.result)},l.onerror=e=>{console.log(e)}})).catch((e=>console.error(e)))}document.body.removeChild;function*c(){let e=0;for(;;)yield e++}var d=c();const i={selectedColor:()=>o.getAttribute("data-color"),showingOptions:()=>!n.classList.contains("hidden"),zIndex:()=>d.next().value,getOffset:e=>{var{top:t,left:o}=e.style;return{top:t=parseInt(t.slice(0,-2)),left:o=parseInt(o.slice(0,-2))}},dragging:null};function u(e){const{tag:t,classList:o,id:n,value:r,style:s,dataset:l}=e,a=document.createElement(t);if(o&&(a.classList=o),n&&(a.id=n),r&&(a.value=r),s)for(let e of Object.keys(s))a.style[e]=s[e];if(l)for(let e of Object.keys(l))a.dataset[e]=l[e];return a}function g(e,t,o,n=null,r=null){const s=u({tag:"div",classList:"sticky-wrapper",style:{zIndex:i.zIndex(),top:"string"==typeof t?t:t+"px",left:"string"==typeof o?o:o+"px",color:n||i.selectedColor()},dataset:{id:e}}),l=u({tag:"div",classList:"sticky",dataset:{color:n||i.selectedColor()}}),c=u({tag:"div"}),d=u({tag:"textarea",value:r});return d.onkeydown=((e,t=1e3)=>{let o;return n=>{clearTimeout(o),o=setTimeout((()=>{e(n)}),t)}})((e=>{const{top:t,left:o}=s.style,{id:n}=s.dataset,{color:r}=l.dataset,{value:c}=e.target;a({id:parseInt(n),top:t,left:o,color:r,message:c})})),s.appendChild(l),l.appendChild(c),l.appendChild(d),l.addEventListener("touchstart",p),l.addEventListener("mousedown",m),s}function p(e){if(e.currentTarget.parentElement.style.zIndex=i.zIndex(),"TEXTAREA"!==e.target.tagName){const r=e.currentTarget,l=r.parentElement;i.dragging=l;const{top:c,left:d}=i.getOffset(l),u=d-e.targetTouches[0].pageX,g=c-e.targetTouches[0].pageY,m=s.getBoundingClientRect();var t,o;function n(e){t=e.targetTouches[0].pageX,o=e.targetTouches[0].pageY;const{x:n,y:r,width:a,height:c}=m;s.style.fill=t>n&&t<n+a&&o>r&&o<r+c?"#f33":"",l.style.top=g+o+"px",l.style.left=u+t+"px"}m.x=Math.floor(m.x),m.y=Math.floor(m.y),r.addEventListener("touchmove",n),r.addEventListener("touchend",(function e(c){const{x:d,y:u,width:g,height:f}=m,h=r.querySelector("textarea").value,{top:v,left:y}=l.style,{id:E}=l.dataset,{color:L}=r.dataset;if(t>d&&t<d+g&&o>u&&o<u+f)return s.style.fill="#F33",void x();a({id:parseInt(E),top:v,left:y,message:h,color:L}),i.dragging=null,r.removeEventListener("touchmove",n),r.removeEventListener("touchend",e),r.addEventListener("touchstart",p)})),r.removeEventListener("touchstart",p)}}function m(e){e.currentTarget.parentElement.style.zIndex=i.zIndex();const{height:o,width:n}=t.getBoundingClientRect();if("TEXTAREA"!==e.target.tagName){const t=e.currentTarget,o=e.currentTarget.parentElement;i.dragging=o;const{top:n,left:d}=i.getOffset(o),u=d-e.pageX,g=n-e.pageY,p=s.getBoundingClientRect();p.x=Math.floor(p.x),p.y=Math.floor(p.y);const{x:m,y:f,width:h,height:v}=p;var r,l;function c(e){r=e.pageX,l=e.pageY,s.style.fill=r>m&&r<m+h&&l>f&&l<f+v?"#f33":"",o.style.top=g+e.pageY+"px",o.style.left=u+e.pageX+"px"}document.addEventListener("mousemove",c),document.addEventListener("mouseup",(function e(n){const d=t.querySelector("textarea").value,{top:u,left:g}=o.style,{id:p}=o.dataset,{color:y}=t.dataset;r>m&&r<m+h&&l>f&&l<f+v?(s.style.fill="#F33",x(),document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",e)):a({id:parseInt(p),top:u,left:g,message:d,color:y}),i.dragging=null,document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",e)}))}}var f;function h(e){f=setTimeout((()=>{const t=g(0,e.pageY,e.pageX);function o(e){t.style.top=e.pageY+"px",t.style.left=e.pageX+"px"}r.appendChild(t),i.dragging=t,document.addEventListener("mousemove",o),document.addEventListener("mouseup",(function e(n){i.dragging=null,l({top:n.pageY,left:n.pageX,color:i.selectedColor()},t),document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",e)}))}),200)}function v(e){f&&clearTimeout(f);const t=e.target.dataset.color;e.currentTarget.setAttribute("data-color",t),n.classList.toggle("hidden")}function y(e){f&&clearTimeout(f);const t=e.target.dataset.color;e.currentTarget.setAttribute("data-color",t),n.classList.toggle("hidden")}function x(){if(console.log(i.dragging),i.dragging){window.confirm("Are you sure you want to delete this?")&&(console.log(i.dragging),t=i.dragging.dataset.id,e().then((e=>{const o=e.store.delete(parseInt(t));o.onsuccess=e=>{console.log(e.target.result)},o.onerror=e=>{console.log(e)}})).catch((e=>console.error(e))),i.dragging.remove(),i.dragging=null,s.style.fill="")}var t}function E(e){const t=["#FD1","#FAA","#AAF"];d=c();t.map((e=>[...document.querySelectorAll(`.sticky[data-color="${e}"]`)]));for(let o=0;o<t.length;o++){const n=[...document.querySelectorAll(`.sticky[data-color="${t[o]}"]`)];switch(e){case"diagonal":for(let e=0;e<n.length;e++){let r=n[e].parentElement,s=n[e].querySelector("textarea");for(r.style.top=35*e+50+"px",r.style.left=20*e+250*o+50+"px",r.style.zIndex=e*t.length+o,s.style.width="100px",s.style.height="100px";e*t.length+o>d.next().value;)d.next().value}break;case"horizontal":for(let e=0;e<n.length;e++){let t=n[e].parentElement,r=n[e].querySelector("textarea");t.style.top=200*o+50+"px",t.style.left=50*e+50+"px",t.style.zIndex=d.next().value,r.style.width="100px",r.style.height="100px"}break;case"vertical":for(let e=0;e<n.length;e++){let t=n[e].parentElement,r=n[e].querySelector("textarea");t.style.left=200*o+50+"px",t.style.top=50*e+50+"px",t.style.zIndex=d.next().value,r.style.width="100px",r.style.height="100px"}}}}o.addEventListener("mouseup",y),o.addEventListener("mousedown",h),o.addEventListener("touchstart",(function(e){o.removeEventListener("mouseup",y),o.removeEventListener("mousedown",h),f=setTimeout((()=>{const t=g(0,e.targetTouches[0].pageY,e.targetTouches[0].pageX);function n(e){t.style.top=e.targetTouches[0].pageY+"px",t.style.left=e.targetTouches[0].pageX+"px",o.removeEventListener("touchend",v)}r.appendChild(t),document.addEventListener("touchmove",n),document.addEventListener("touchend",(function e(r){f=null,l({top:t.style.top,left:t.style.left,color:i.selectedColor()},t),document.removeEventListener("touchmove",n),document.removeEventListener("touchend",e),o.removeEventListener("touchend",v),o.addEventListener("touchend",v)}))}),200)})),o.addEventListener("touchend",v),document.getElementById("diagonal").onclick=()=>E("diagonal"),document.getElementById("horizontal").onclick=()=>E("horizontal"),document.getElementById("vertical").onclick=()=>E("vertical"),e().then((e=>{const t=e.store.getAll();t.onsuccess=e=>{const t=e.target.result;for(let e of t){let t=g(e.id,e.top,e.left,e.color,e.message);r.appendChild(t)}},t.onerror=e=>{console.log(e)}})).catch((e=>console.error(e)))}();
//# sourceMappingURL=index.7e9b2b69.js.map

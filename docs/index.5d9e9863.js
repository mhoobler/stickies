!function(){const e=async()=>new Promise(((e,t)=>{var o,n=indexedDB.open("stickiesDB",1);n.onerror=e=>{console.error("IndexedDB error"),t("Error with creating request")},n.onsuccess=async t=>{console.log(t),(o=t.target.result).onerror=e=>{console.error("Database error: "+e.target.errorCode)};try{const t=(await(async e=>new Promise(((t,o)=>{var n=e.transaction(["stickies"],"readwrite");n.oncomplete=e=>{console.log("transaction success",e)},n.onerror=e=>{console.error("transaction error",e)},n?t(n):o("Error with creating transaction")})))(o)).objectStore("stickies");e({store:t})}catch(e){console.log(e)}},n.onupgradeneeded=e=>{var t=e.target.result.createObjectStore("stickies",{autoIncrement:!0,keyPath:"id"});t.createIndex("id","id",{unique:!0}),t.createIndex("message","message",{unique:!1}),t.createIndex("color","color",{unique:!1}),t.createIndex("left","left",{unique:!1}),t.createIndex("top","top",{unique:!1})}})),t=document.getElementById("App"),o=document.getElementById("color-select"),n=document.getElementById("color-options"),r=document.getElementById("sticky-container"),s=document.getElementById("trash"),l=document.getElementById("trash").querySelector("path");document.getElementById("hidden");function a({color:t,top:o,left:n},r){e().then((e=>{const s=e.store.add({color:t,top:o,left:n,message:""});s.onsuccess=e=>{console.log("add sticky: ",e.target.result),r.dataset.id=e.target.result},s.onerror=e=>{console.log(e)}})).catch((e=>console.error(e)))}function c({id:t,color:o,top:n,left:r,message:s}){e().then((e=>{const l=e.store.put({id:t,color:o,top:n,left:r,message:s});l.onsuccess=e=>{console.log(e.target.result)},l.onerror=e=>{console.log(e)}})).catch((e=>console.error(e)))}document.body.removeChild;function*d(){let e=0;for(;;)yield e++}var i=d();const u={selectedColor:()=>o.getAttribute("data-color"),showingOptions:()=>!n.classList.contains("hidden"),zIndex:()=>i.next().value,getOffset:e=>{var{top:t,left:o}=e.style;return{top:t=parseInt(t.slice(0,-2)),left:o=parseInt(o.slice(0,-2))}},dragging:null};function g(e){const{tag:t,classList:o,id:n,value:r,style:s,dataset:l}=e,a=document.createElement(t);if(o&&(a.classList=o),n&&(a.id=n),r&&(a.value=r),s)for(let e of Object.keys(s))a.style[e]=s[e];if(l)for(let e of Object.keys(l))a.dataset[e]=l[e];return a}function p(e,t,o,n=null,r=null){const s=g({tag:"div",classList:"sticky-wrapper",style:{zIndex:u.zIndex(),top:"string"==typeof t?t:t+"px",left:"string"==typeof o?o:o+"px",color:n||u.selectedColor()},dataset:{id:e}}),l=g({tag:"div",classList:"sticky",dataset:{color:n||u.selectedColor()}}),a=g({tag:"div"}),d=g({tag:"textarea",value:r});return d.onkeydown=((e,t=1e3)=>{let o;return n=>{clearTimeout(o),o=setTimeout((()=>{e(n)}),t)}})((e=>{const{top:t,left:o}=s.style,{id:n}=s.dataset,{color:r}=l.dataset,{value:a}=e.target;c({id:parseInt(n),top:t,left:o,color:r,message:a})})),s.appendChild(l),l.appendChild(a),l.appendChild(d),l.addEventListener("touchstart",m),l.addEventListener("mousedown",f),s}function m(e){if(e.currentTarget.parentElement.style.zIndex=u.zIndex(),"TEXTAREA"!==e.target.tagName){const r=e.currentTarget,s=r.parentElement;u.dragging=r;const{top:a,left:d}=u.getOffset(s),i=d-e.targetTouches[0].pageX,g=a-e.targetTouches[0].pageY,p=l.getBoundingClientRect();var t,o;function n(e){t=e.targetTouches[0].pageX,o=e.targetTouches[0].pageY;const{x:n,y:r,width:a,height:c}=p;l.style.fill=t>n&&t<n+a&&o>r&&o<r+c?"#F33":"",s.style.top=g+o+"px",s.style.left=i+t+"px"}p.x=Math.floor(p.x),p.y=Math.floor(p.y),r.addEventListener("touchmove",n),r.addEventListener("touchend",(function e(a){const{x:d,y:i,width:g,height:f}=p,h=r.querySelector("textarea").value,{top:v,left:y}=s.style,{id:E}=s.dataset,{color:L}=r.dataset;if(t>d&&t<d+g&&o>i&&o<i+f)return l.style.fill="#F33",void x();u.dragging=null,c({id:parseInt(E),top:v,left:y,message:h,color:L}),r.removeEventListener("touchmove",n),r.removeEventListener("touchend",e),r.addEventListener("touchstart",m)})),r.removeEventListener("touchstart",m)}}function f(e){e.currentTarget.parentElement.style.zIndex=u.zIndex();const{height:o,width:n}=t.getBoundingClientRect();if("TEXTAREA"!==e.target.tagName){const t=e.currentTarget,o=e.currentTarget.parentElement;u.dragging=t;const{top:n,left:s}=u.getOffset(o),l=s-e.pageX,a=n-e.pageY;function r(e){o.style.top=a+e.pageY+"px",o.style.left=l+e.pageX+"px"}document.addEventListener("mousemove",r),document.addEventListener("mouseup",(function e(n){u.dragging=null;const s=t.querySelector("textarea").value,{top:l,left:a}=o.style,{id:d}=o.dataset,{color:i}=t.dataset;c({id:parseInt(d),top:l,left:a,message:s,color:i}),document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",e)}))}}var h;function v(e){h=setTimeout((()=>{const t=p(0,e.pageY,e.pageX);function o(e){t.style.top=e.pageY+"px",t.style.left=e.pageX+"px"}r.appendChild(t),u.dragging=t,document.addEventListener("mousemove",o),document.addEventListener("mouseup",(function e(n){u.dragging=null,a({top:n.pageY,left:n.pageX,color:u.selectedColor()},t),document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",e)}))}),200)}function y(e){h&&clearTimeout(h);const t=e.target.dataset.color;e.currentTarget.setAttribute("data-color",t),n.classList.toggle("hidden")}function E(e){h&&clearTimeout(h);const t=e.target.dataset.color;e.currentTarget.setAttribute("data-color",t),n.classList.toggle("hidden")}function x(){if(u.dragging){window.confirm("Are you sure you want to delete this?")&&(t=u.dragging.dataset.id,e().then((e=>{const o=e.store.delete(parseInt(t));o.onsuccess=e=>{console.log(e.target.result)},o.onerror=e=>{console.log(e)}})).catch((e=>console.error(e))),u.dragging.remove(),u.dragging=null,l.style.fill="")}var t}function L(e){const t=["#FD1","#FAA","#AAF"];i=d();t.map((e=>[...document.querySelectorAll(`.sticky[data-color="${e}"]`)]));for(let o=0;o<t.length;o++){const n=[...document.querySelectorAll(`.sticky[data-color="${t[o]}"]`)];switch(e){case"diagonal":for(let e=0;e<n.length;e++){let r=n[e].parentElement,s=n[e].querySelector("textarea");for(r.style.top=35*e+50+"px",r.style.left=20*e+250*o+50+"px",r.style.zIndex=e*t.length+o,s.style.width="100px",s.style.height="100px";e*t.length+o>i.next().value;)i.next().value}break;case"horizontal":for(let e=0;e<n.length;e++){let t=n[e].parentElement,r=n[e].querySelector("textarea");t.style.top=200*o+50+"px",t.style.left=50*e+50+"px",t.style.zIndex=i.next().value,r.style.width="100px",r.style.height="100px"}break;case"vertical":for(let e=0;e<n.length;e++){let t=n[e].parentElement,r=n[e].querySelector("textarea");t.style.left=200*o+50+"px",t.style.top=50*e+50+"px",t.style.zIndex=i.next().value,r.style.width="100px",r.style.height="100px"}}}}o.addEventListener("mouseup",E),o.addEventListener("mousedown",v),o.addEventListener("touchstart",(function(e){o.removeEventListener("mouseup",E),o.removeEventListener("mousedown",v),h=setTimeout((()=>{const t=p(0,e.targetTouches[0].pageY,e.targetTouches[0].pageX);function n(e){t.style.top=e.targetTouches[0].pageY+"px",t.style.left=e.targetTouches[0].pageX+"px",o.removeEventListener("touchend",y)}r.appendChild(t),document.addEventListener("touchmove",n),document.addEventListener("touchend",(function e(r){h=null,a({top:t.style.top,left:t.style.left,color:u.selectedColor()},t),document.removeEventListener("touchmove",n),document.removeEventListener("touchend",e),o.removeEventListener("touchend",y),o.addEventListener("touchend",y)}))}),200)})),o.addEventListener("touchend",y),s.addEventListener("mouseenter",(function(e){u.dragging&&(l.style.fill="#F33")})),s.addEventListener("mouseleave",(function(e){l.style.fill=""})),s.addEventListener("mouseup",x),s.addEventListener("touchstart",(e=>{l.style.fill="#F33"})),s.addEventListener("touchend",(e=>{l.style.fill=""})),document.getElementById("diagonal").onclick=()=>L("diagonal"),document.getElementById("horizontal").onclick=()=>L("horizontal"),document.getElementById("vertical").onclick=()=>L("vertical"),e().then((e=>{const t=e.store.getAll();t.onsuccess=e=>{const t=e.target.result;for(let e of t){let t=p(e.id,e.top,e.left,e.color,e.message);r.appendChild(t)}},t.onerror=e=>{console.log(e)}})).catch((e=>console.error(e)))}();
//# sourceMappingURL=index.5d9e9863.js.map

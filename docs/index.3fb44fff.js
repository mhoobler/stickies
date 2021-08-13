!function(){const e=async()=>new Promise(((e,t)=>{var o,n=indexedDB.open("stickiesDB",1);n.onerror=e=>{console.error("IndexedDB error"),t("Error with creating request")},n.onsuccess=async t=>{(o=t.target.result).onerror=e=>{console.error("Database error: "+e.target.errorCode)};try{const t=(await(async e=>new Promise(((t,o)=>{var n=e.transaction(["stickies"],"readwrite");n.onerror=e=>{console.error("transaction error",e)},n?t(n):o("Error with creating transaction")})))(o)).objectStore("stickies");e({store:t})}catch(e){console.error(e)}},n.onupgradeneeded=e=>{var t=e.target.result.createObjectStore("stickies",{autoIncrement:!0,keyPath:"id"});t.createIndex("id","id",{unique:!0}),t.createIndex("message","message",{unique:!1}),t.createIndex("color","color",{unique:!1}),t.createIndex("left","left",{unique:!1}),t.createIndex("top","top",{unique:!1})}}));function t(t,o){const{color:n,top:r,left:s}=t;e().then((e=>{const t=e.store.add({color:n,top:r,left:s,message:""});t.onsuccess=e=>{o(e.target.result)},t.onerror=e=>{console.log(e)}})).catch((e=>console.error(e)))}function o(t,o=(()=>{})){const{id:n,color:r,top:s,left:l,message:a}=t;e().then((e=>{const t=e.store.put({id:n,color:r,top:s,left:l,message:a});t.onsuccess=e=>{o(e.target.result)},t.onerror=e=>{console.log(e)}})).catch((e=>console.error(e)))}document.getElementById("App");const n=document.getElementById("color-select"),r=document.getElementById("color-options"),s=document.getElementById("sticky-container"),l=(document.getElementById("trash"),document.getElementById("trash").querySelector("path"));document.getElementById("hidden");function*a(){let e=0;for(;;)yield e++}var c=a();const i={selectedColor:()=>n.getAttribute("data-color"),showingOptions:()=>!r.classList.contains("hidden"),zIndex:()=>c.next().value,getOffset:e=>{var{top:t,left:o}=e.style;return{top:t=parseInt(t.slice(0,-2)),left:o=parseInt(o.slice(0,-2))}},dragging:null};function d(e){const{tag:t,classList:o,id:n,value:r,style:s,dataset:l}=e,a=document.createElement(t);if(o&&(a.classList=o),n&&(a.id=n),r&&(a.value=r),s)for(let e of Object.keys(s))a.style[e]=s[e];if(l)for(let e of Object.keys(l))a.dataset[e]=l[e];return a}function u(e,t,n,r=null,s=null){const l=d({tag:"div",classList:"sticky-wrapper",style:{zIndex:i.zIndex(),top:"string"==typeof t?t:t+"px",left:"string"==typeof n?n:n+"px",color:r||i.selectedColor()},dataset:{id:e}}),a=d({tag:"div",classList:"sticky",dataset:{color:r||i.selectedColor()}}),c=d({tag:"div"}),u=d({tag:"textarea",value:s});return u.onkeydown=((e,t=1e3)=>{let o;return n=>{clearTimeout(o),o=setTimeout((()=>{e(n)}),t)}})((e=>{const{top:t,left:n}=l.style,{id:r}=l.dataset,{color:s}=a.dataset,{value:c}=e.target;o({id:parseInt(r),top:t,left:n,color:s,message:c})})),l.appendChild(a),a.appendChild(c),a.appendChild(u),a.addEventListener("touchstart",g),a.addEventListener("mousedown",p),l}function g(e){if(e.currentTarget.parentElement.style.zIndex=i.zIndex(),"TEXTAREA"!==e.target.tagName){const s=e.currentTarget,a=s.parentElement;i.dragging=a;const{top:c,left:d}=i.getOffset(a),u=d-e.targetTouches[0].pageX,p=c-e.targetTouches[0].pageY,m=l.getBoundingClientRect();var t,n;function r(e){t=e.targetTouches[0].pageX,n=e.targetTouches[0].pageY;const{x:o,y:r,width:s,height:c}=m;l.style.fill=t>o&&t<o+s&&n>r&&n<r+c?"#f33":"",a.style.top=p+n+"px",a.style.left=u+t+"px"}m.x=Math.floor(m.x),m.y=Math.floor(m.y),s.addEventListener("touchmove",r),s.addEventListener("touchend",(function e(c){const{x:d,y:u,width:p,height:f}=m,y=s.querySelector("textarea").value,{top:h,left:E}=a.style,{id:x}=a.dataset,{color:L}=s.dataset;if(t>d&&t<d+p&&n>u&&n<u+f)return l.style.fill="#F33",void v();o({id:parseInt(x),top:h,left:E,message:y,color:L}),i.dragging=null,s.removeEventListener("touchmove",r),s.removeEventListener("touchend",e),s.addEventListener("touchstart",g)})),s.removeEventListener("touchstart",g)}}function p(e){if(e.currentTarget.parentElement.style.zIndex=i.zIndex(),"TEXTAREA"!==e.target.tagName){const s=e.currentTarget,a=e.currentTarget.parentElement;i.dragging=a;const{top:c,left:d}=i.getOffset(a),u=d-e.pageX,g=c-e.pageY,p=l.getBoundingClientRect();p.x=Math.floor(p.x),p.y=Math.floor(p.y);const{x:m,y:f,width:y,height:h}=p;var t,n;function r(e){t=e.pageX,n=e.pageY,l.style.fill=t>m&&t<m+y&&n>f&&n<f+h?"#f33":"",a.style.top=g+e.pageY+"px",a.style.left=u+e.pageX+"px"}document.addEventListener("mousemove",r),document.addEventListener("mouseup",(function e(c){const d=s.querySelector("textarea").value,{top:u,left:g}=a.style,{id:p}=a.dataset,{color:E}=s.dataset;t>m&&t<m+y&&n>f&&n<f+h?(l.style.fill="#F33",v(),document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",e)):o({id:parseInt(p),top:u,left:g,message:d,color:E}),i.dragging=null,document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",e)}))}}var m,f;function y(e){m=setTimeout((()=>{const o=u(0,e.pageY,e.pageX);function n(e){o.style.top=e.pageY+"px",o.style.left=e.pageX+"px"}s.appendChild(o),i.dragging=o,document.addEventListener("mousemove",n),document.addEventListener("mouseup",(function e(r){i.dragging=null,t({top:r.pageY,left:r.pageX,color:i.selectedColor()},(e=>o.dataset.id=e)),document.removeEventListener("mousemove",n),document.removeEventListener("mouseup",e)}))}),200)}function h(e){m&&clearTimeout(m);const t=e.target.dataset.color;e.currentTarget.setAttribute("data-color",t),r.classList.toggle("hidden")}function v(){if(i.dragging){window.confirm("Are you sure you want to delete this?")&&(!function(t,o=(()=>{})){const{id:n}=t;e().then((e=>{const t=e.store.delete(parseInt(n));t.onsuccess=e=>{o(e.target.result)},t.onerror=e=>{console.log(e)}})).catch((e=>console.error(e)))}({id:i.dragging.dataset.id}),i.dragging.remove(),i.dragging=null,l.style.fill="")}}function E(e){const t=["#FD1","#FAA","#AAF"];c=a();for(let o=0;o<t.length;o++){const n=[...document.querySelectorAll(`.sticky[data-color="${t[o]}"]`)];switch(e){case"diagonal":for(let e=0;e<n.length;e++){let r=n[e].parentElement,s=n[e].querySelector("textarea");for(r.style.top=35*e+50+"px",r.style.left=20*e+250*o+50+"px",r.style.zIndex=e*t.length+o,r.style.transition="top 0.5s, left 0.5s",s.style.width="100px",s.style.height="100px";e*t.length+o>c.next().value;)c.next().value}break;case"horizontal":for(let e=0;e<n.length;e++){let t=n[e].parentElement,r=n[e].querySelector("textarea");t.style.top=200*o+50+"px",t.style.left=50*e+50+"px",t.style.zIndex=c.next().value,t.style.transition="top 0.5s, left 0.5s",r.style.width="100px",r.style.height="100px"}break;case"vertical":for(let e=0;e<n.length;e++){let t=n[e].parentElement,r=n[e].querySelector("textarea");t.style.left=200*o+50+"px",t.style.top=50*e+50+"px",t.style.zIndex=c.next().value,t.style.transition="top 0.5s, left 0.5s",r.style.width="100px",r.style.height="100px"}}}setTimeout((()=>{const e=[...document.querySelectorAll(".sticky-wrapper")];for(let t of e)t.style.transition=""}),520)}n.addEventListener("mousedown",y),n.addEventListener("touchstart",(function(e){n.removeEventListener("mouseup",h),n.removeEventListener("mousedown",y),m=setTimeout((()=>{const o=u(0,e.targetTouches[0].pageY,e.targetTouches[0].pageX);function r(e){o.style.top=e.targetTouches[0].pageY+"px",o.style.left=e.targetTouches[0].pageX+"px",n.removeEventListener("touchend",colorSelectTouchEnd)}s.appendChild(o),document.addEventListener("touchmove",r),document.addEventListener("touchend",(function e(s){m=null,t({top:o.style.top,left:o.style.left,color:i.selectedColor()},(e=>o.dataset.id=e)),document.removeEventListener("touchmove",r),document.removeEventListener("touchend",e),n.removeEventListener("touchend",colorSelectTouchEnd),n.addEventListener("touchend",colorSelectTouchEnd)}))}),200)})),n.addEventListener("touchend",h),n.addEventListener("mouseup",h),document.getElementById("diagonal").onclick=()=>E("diagonal"),document.getElementById("horizontal").onclick=()=>E("horizontal"),document.getElementById("vertical").onclick=()=>E("vertical"),f=e=>{for(let t of e){let e=u(t.id,t.top,t.left,t.color,t.message);s.appendChild(e)}},e().then((e=>{const t=e.store.getAll();t.onsuccess=e=>{const t=e.target.result;f(t)},t.onerror=e=>{console.log(e)}})).catch((e=>console.error(e)))}();
//# sourceMappingURL=index.3fb44fff.js.map
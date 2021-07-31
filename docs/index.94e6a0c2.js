// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"6ijR0":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "78f45bcc58e0f2f4bb3f826394e6a0c2";
// @flow
/*global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE*/
/*::
import type {
HMRAsset,
HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
(string): mixed;
cache: {|[string]: ParcelModule|};
hotData: mixed;
Module: any;
parent: ?ParcelRequire;
isParcelRequire: true;
modules: {|[string]: [Function, {|[string]: string|}]|};
HMR_BUNDLE_ID: string;
root: ParcelRequire;
}
interface ParcelModule {
hot: {|
data: mixed,
accept(cb: (Function) => void): void,
dispose(cb: (mixed) => void): void,
// accept(deps: Array<string> | string, cb: (Function) => void): void,
// decline(): void,
_acceptCallbacks: Array<(Function) => void>,
_disposeCallbacks: Array<(mixed) => void>,
|};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || (function () {}));
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept;
function getHostname() {
  return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
  return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = getHostname();
  var port = getPort();
  var protocol = HMR_SECURE || location.protocol == 'https:' && !(/localhost|127.0.0.1|0.0.0.0/).test(hostname) ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
  // $FlowFixMe
  ws.onmessage = function (event) {
    checkedAssets = {
      /*: {|[string]: boolean|}*/
    };
    acceptedAssets = {
      /*: {|[string]: boolean|}*/
    };
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH);
      // Handle HMR Update
      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        if (didAccept) {
          handled = true;
        }
      });
      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(module.bundle.root, asset);
        });
        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];
          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }
    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      }
      // Render the fancy html overlay
      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      // $FlowFixMe
      document.body.appendChild(overlay);
    }
  };
  ws.onerror = function (e) {
    console.error(e.message);
  };
  ws.onclose = function (e) {
    if (undefined !== 'test') {
      console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}
function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }
  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]>*/
{
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    if (link.parentNode !== null) {
      // $FlowFixMe
      link.parentNode.removeChild(link);
    }
  };
  newLink.setAttribute('href', // $FlowFixMe
  link.getAttribute('href').split('?')[0] + '?' + Date.now());
  // $FlowFixMe
  link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }
  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      // $FlowFixMe[incompatible-type]
      var href = links[i].getAttribute('href');
      var hostname = getHostname();
      var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
      var absolute = (/^https?:\/\//i).test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
      if (!absolute) {
        updateLink(links[i]);
      }
    }
    cssTimeout = null;
  }, 50);
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (asset.type === 'css') {
    reloadCSS();
    return;
  }
  let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
  if (deps) {
    var fn = new Function('require', 'module', 'exports', asset.output);
    modules[asset.id] = [fn, deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
    // If we reached the root bundle without finding where the asset should go,
    // there's nothing to do. Mark as "accepted" so we don't reload the page.
    if (!bundle.parent) {
      return true;
    }
    return hmrAcceptCheck(bundle.parent, id, depsByBundle);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(module.bundle.root, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1], null);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(module.bundle.root, id);
      });
      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }
  acceptedAssets[id] = true;
}

},{}],"3GZMZ":[function(require,module,exports) {
require("../styles/style.scss");
const colorSelect = document.getElementById("color-select");
const colorOptions = document.getElementById("color-options");
const stickyContainer = document.getElementById("sticky-container");
const trash = document.getElementById("trash");
const trashPath = document.getElementById("trash-path");
const hidden = document.getElementById("hidden");
const removeChildren = query => {
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
  getOffset: target => {
    var {top, left} = target.style;
    top = parseInt(top.slice(0, -2));
    left = parseInt(left.slice(0, -2));
    return {
      top,
      left
    };
  },
  dragging: null
};
const createElm = obj => {
  const {tag, classList, id, value, style, dataset} = obj;
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
  if (dataset) {
    for (let k of Object.keys(dataset)) {
      elm.dataset[k] = dataset[k];
    }
  }
  return elm;
};
function createSticky(pageY, pageX) {
  const newSticky = createElm({
    tag: "div",
    classList: "sticky",
    style: {
      top: pageY + "px",
      left: pageX + "px",
      zIndex: STATE.zIndex()
    },
    dataset: {
      color: STATE.selectedColor()
    }
  });
  const handle = createElm({
    tag: "div"
  });
  const textarea = createElm({
    tag: "textarea"
  });
  newSticky.appendChild(handle);
  newSticky.appendChild(textarea);
  newSticky.draggable;
  // newSticky.addEventListener("dragstart", stickyDragStart);
  // newSticky.addEventListener("dragend", stickyDragEnd);
  newSticky.addEventListener("touchmove", stickyTouchMove);
  newSticky.addEventListener("mousedown", stickyMouseDown);
  return newSticky;
}
function stickyMouseDown(e) {
  e.currentTarget.style.zIndex = STATE.zIndex();
  if (e.target.tagName !== "TEXTAREA") {
    const current = e.currentTarget;
    STATE.dragging = current;
    const {top, left} = STATE.getOffset(current);
    const xOffset = left - e.pageX;
    const yOffset = top - e.pageY;
    function mouseMove(e) {
      current.style.top = yOffset + e.pageY + "px";
      current.style.left = xOffset + e.pageX + "px";
    }
    function mouseUp(e) {
      STATE.dragging = null;
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
// colorSelect.addEventListener("dragstart", colorSelectDragStart);
// colorSelect.addEventListener("dragend", colorSelectDragEnd);
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
  evtFunc = e => colorSelectTouchMove(e, newSticky);
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
function colorSelectDragStart(e) {
  const newSticky = createElm({
    tag: "div",
    classList: "sticky remove",
    dataset: {
      color: STATE.selectedColor()
    }
  });
  document.body.appendChild(newSticky);
  e.dataTransfer.setDragImage(newSticky, 0, 0);
}
function colorSelectDragEnd(e) {
  const newSticky = createSticky(e.pageY, e.pageX);
  removeChildren(".sticky.remove");
  stickyContainer.appendChild(newSticky);
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
      console.log(STATE.dragging);
      STATE.dragging.remove();
      STATE.dragging = null;
      trashPath.style.fill = "";
    }
  }
}
trash.addEventListener("mouseenter", trashEnter);
trash.addEventListener("mouseleave", trashLeave);
trash.addEventListener("mouseup", trashUp);
trash.addEventListener("touchstart", e => {
  trashPath.style.fill = "#F33";
});
trash.addEventListener("touchend", e => {
  trashPath.style.fill = "";
});
const x = document.querySelector("body");

},{"../styles/style.scss":"2zgbc"}],"2zgbc":[function() {},{}]},["6ijR0","3GZMZ"], "3GZMZ", "parcelRequiree548")

//# sourceMappingURL=index.94e6a0c2.js.map

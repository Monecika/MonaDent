import {
  Emitter,
  EventImpl,
  addDays,
  addDurations,
  addMs,
  applyStyle,
  asRoughDays,
  asRoughMs,
  buildEventRangeKey,
  buildEventRangeTimeText,
  buildRangeEdgeOutput,
  classNames,
  combineEventUis,
  computeClippedClientRect,
  computeElIsRtl,
  computeEventRangeDraggable,
  computeViewBorderless,
  computeVisibleDayRange,
  constrainMarkerToRange,
  createAriaClickAttrs,
  createDuration,
  createEmptyEventStore,
  createFormatter,
  diffDays,
  diffWholeDays,
  diffWholeWeeks,
  expandRecurring,
  fabricateEventRange,
  flatArray,
  flatMapArray,
  formatDayString,
  formatIsoTimeString,
  formatWithOrdinals,
  getAppendableRoot,
  getEventRangeMeta,
  getEventTagAndAttrs,
  getEventTargetViaRoot,
  getUnequalProps,
  greatestDurationDenominator,
  guid,
  hasBgRendering,
  intersectRanges,
  isArraysEqual,
  isPropsEqualShallow,
  isPropsEqualWithMap,
  joinDateTimeFormatParts,
  mapHash,
  mergeMaybePropsDepth1,
  multiplyDuration,
  parseRange,
  rangeContainsMarker,
  rangesIntersect,
  refineClassName,
  setElEventRange,
  sliceEventStore,
  sortEventSegs,
  startOfDay,
  wholeDivideDurations
} from "./chunk-RQ4HGFPN.js";
import {
  C,
  F,
  M,
  R,
  S,
  X,
  k,
  l,
  u
} from "./chunk-GOSSR2CB.js";
import {
  fracToCssDim,
  joinClassNames
} from "./chunk-RHF36VR4.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/fullcalendar/chunks/167cc14f.js
var classNamesRe = /(^c|C)lass(Name)?$/;
var contentRe = /Content$/;
var lifecycleRe = /(DidMount|WillUnmount)$/;
var handlerRe = /^on[A-Z]/;
var customMergeFuncs = {
  buttons: mergeMaybePropsDepth1
};
function mergeViewOptionsMap(...hashes) {
  const merged = {};
  for (const hash of hashes) {
    for (const viewName in hash) {
      const viewOptions = hash[viewName];
      if (!merged[viewName]) {
        merged[viewName] = viewOptions;
      } else {
        merged[viewName] = mergeCalendarOptions(merged[viewName], viewOptions);
      }
    }
  }
  return merged;
}
function mergeCalendarOptions(...optionSets) {
  let dest = {};
  for (const options of optionSets) {
    for (let name in options) {
      if (name in dest) {
        const mergeFunc = customMergeFuncs[name] || (classNamesRe.test(name) ? joinFuncishClassNames : contentRe.test(name) ? mergeContentInjectors : lifecycleRe.test(name) ? mergeLifecycleCallbacks : void 0);
        dest[name] = mergeFunc ? mergeFunc(dest[name], options[name], name) : options[name];
      } else {
        dest[name] = options[name];
      }
    }
  }
  return dest;
}
function joinFuncishClassNames(input0, input1, optionName) {
  const isFunc0 = typeof input0 === "function";
  const isFunc1 = typeof input1 === "function";
  if (isFunc0 || isFunc1) {
    const combinedFunc = (info) => {
      return joinClassNames(refineClassName(isFunc0 ? input0(info) : input0, optionName), refineClassName(isFunc1 ? input1(info) : input1, optionName));
    };
    combinedFunc.parts = [input0, input1];
    return combinedFunc;
  }
  return joinClassNames(refineClassName(input0, optionName), refineClassName(input1, optionName));
}
function mergeContentInjectors(contentGenerator0, contentGenerator1) {
  if (typeof contentGenerator1 === "function") {
    const combinedFunc = (renderProps) => {
      const res = contentGenerator1(renderProps);
      if (res === true) {
        if (typeof contentGenerator0 === "function") {
          return contentGenerator0(renderProps);
        }
        return contentGenerator0;
      }
      return res;
    };
    combinedFunc.parts = [contentGenerator0, contentGenerator1];
    return combinedFunc;
  }
  if (contentGenerator1 != null) {
    return contentGenerator1;
  }
  return contentGenerator0;
}
function mergeLifecycleCallbacks(fn0, fn1) {
  if (fn0 && fn1) {
    const combinedFunc = (...args) => {
      fn0(...args);
      fn1(...args);
    };
    combinedFunc.parts = [fn0, fn1];
    return combinedFunc;
  }
  return fn0 || fn1;
}
function isNonHandlerPropsEqual(obj0, obj1) {
  const keys = getUnequalProps(obj0, obj1);
  for (let key of keys) {
    if (!handlerRe.test(key)) {
      return false;
    }
  }
  return true;
}
function isMergedPropsEqual(val0, val1) {
  const parts0 = val0 && val0.parts;
  const parts1 = val1 && val1.parts;
  if (parts0 && parts1) {
    const count0 = parts0.length;
    const count1 = parts1.length;
    if (count0 !== count1) {
      return false;
    }
    for (let i2 = 0; i2 < count0; i2++) {
      if (!(parts0[i2] === parts1[i2] || isMergedPropsEqual(parts0[i2], parts1[i2]))) {
        return false;
      }
    }
    return true;
  }
  return false;
}

// node_modules/preact/hooks/dist/hooks.module.js
var t;
var r;
var u2;
var i;
var f = [];
var c = l;
var e = c.__b;
var a = c.__r;
var v = c.diffed;
var l2 = c.__c;
var m = c.unmount;
var p = c.__;
function j() {
  for (var n; n = f.shift(); ) {
    var t2 = n.__H;
    if (n.__P && t2) try {
      t2.__h.some(z), t2.__h.some(B), t2.__h = [];
    } catch (r2) {
      t2.__h = [], c.__e(r2, n.__v);
    }
  }
}
c.__b = function(n) {
  r = null, e && e(n);
}, c.__ = function(n, t2) {
  n && t2.__k && t2.__k.__m && (n.__m = t2.__k.__m), p && p(n, t2);
}, c.__r = function(n) {
  a && a(n), t = 0;
  var i2 = (r = n.__c).__H;
  i2 && (u2 === r ? (i2.__h = [], r.__h = [], i2.__.some(function(n2) {
    n2.__N && (n2.__ = n2.__N), n2.u = n2.__N = void 0;
  })) : (i2.__h.some(z), i2.__h.some(B), i2.__h = [], t = 0)), u2 = r;
}, c.diffed = function(n) {
  v && v(n);
  var t2 = n.__c;
  t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w)(j)), t2.__H.__.some(function(n2) {
    n2.u && (n2.__H = n2.u, n2.u = void 0);
  })), u2 = r = null;
}, c.__c = function(n, t2) {
  t2.some(function(n2) {
    try {
      n2.__h.some(z), n2.__h = n2.__h.filter(function(n3) {
        return !n3.__ || B(n3);
      });
    } catch (r2) {
      t2.some(function(n3) {
        n3.__h && (n3.__h = []);
      }), t2 = [], c.__e(r2, n2.__v);
    }
  }), l2 && l2(n, t2);
}, c.unmount = function(n) {
  m && m(n);
  var t2, r2 = n.__c;
  r2 && r2.__H && (r2.__H.__.some(function(n2) {
    try {
      z(n2);
    } catch (n3) {
      t2 = n3;
    }
  }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w(n) {
  var t2, r2 = function() {
    clearTimeout(u3), k2 && cancelAnimationFrame(t2), setTimeout(n);
  }, u3 = setTimeout(r2, 35);
  k2 && (t2 = requestAnimationFrame(r2));
}
function z(n) {
  var t2 = r, u3 = n.__c;
  "function" == typeof u3 && (n.__c = void 0, u3()), r = t2;
}
function B(n) {
  var t2 = r;
  n.__c = n.__(), r = t2;
}

// node_modules/preact/compat/dist/compat.module.js
function g2(n, t2) {
  for (var e2 in t2) n[e2] = t2[e2];
  return n;
}
function E(n, t2) {
  for (var e2 in n) if ("__source" !== e2 && !(e2 in t2)) return true;
  for (var r2 in t2) if ("__source" !== r2 && n[r2] !== t2[r2]) return true;
  return false;
}
function M2(n, t2) {
  this.props = n, this.context = t2;
}
(M2.prototype = new C()).isPureReactComponent = true, M2.prototype.shouldComponentUpdate = function(n, t2) {
  return E(this.props, n) || E(this.state, t2);
};
var T2 = l.__b;
l.__b = function(n) {
  n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), T2 && T2(n);
};
var A2 = "undefined" != typeof Symbol && Symbol.for && /* @__PURE__ */ Symbol.for("react.forward_ref") || 3911;
var O = l.__e;
l.__e = function(n, t2, e2, r2) {
  if (n.then) {
    for (var u3, o = t2; o = o.__; ) if ((u3 = o.__c) && u3.__c) return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k || []), u3.__c(n, t2);
  }
  O(n, t2, e2, r2);
};
var U2 = l.unmount;
function V(n, t2, e2) {
  return n && (n.__c && n.__c.__H && (n.__c.__H.__.forEach(function(n2) {
    "function" == typeof n2.__c && n2.__c();
  }), n.__c.__H = null), null != (n = g2({}, n)).__c && (n.__c.__P === e2 && (n.__c.__P = t2), n.__c.__e = true, n.__c = null), n.__k = n.__k && n.__k.map(function(n2) {
    return V(n2, t2, e2);
  })), n;
}
function W2(n, t2, e2) {
  return n && e2 && (n.__v = null, n.__k = n.__k && n.__k.map(function(n2) {
    return W2(n2, t2, e2);
  }), n.__c && n.__c.__P === t2 && (n.__e && e2.appendChild(n.__e), n.__c.__e = true, n.__c.__P = e2)), n;
}
function P2() {
  this.__u = 0, this.o = null, this.__b = null;
}
function j2(n) {
  var t2 = n.__ && n.__.__c;
  return t2 && t2.__a && t2.__a(n);
}
function B2() {
  this.i = null, this.l = null;
}
l.unmount = function(n) {
  var t2 = n.__c;
  t2 && (t2.__z = true), t2 && t2.__R && t2.__R(), t2 && 32 & n.__u && (n.type = null), U2 && U2(n);
}, (P2.prototype = new C()).__c = function(n, t2) {
  var e2 = t2.__c, r2 = this;
  null == r2.o && (r2.o = []), r2.o.push(e2);
  var u3 = j2(r2.__v), o = false, i2 = function() {
    o || r2.__z || (o = true, e2.__R = null, u3 ? u3(f2) : f2());
  };
  e2.__R = i2;
  var l3 = e2.__P;
  e2.__P = null;
  var f2 = function() {
    if (!--r2.__u) {
      if (r2.state.__a) {
        var n2 = r2.state.__a;
        r2.__v.__k[0] = W2(n2, n2.__c.__P, n2.__c.__O);
      }
      var t3;
      for (r2.setState({ __a: r2.__b = null }); t3 = r2.o.pop(); ) t3.__P = l3, t3.forceUpdate();
    }
  };
  r2.__u++ || 32 & t2.__u || r2.setState({ __a: r2.__b = r2.__v.__k[0] }), n.then(i2, i2);
}, P2.prototype.componentWillUnmount = function() {
  this.o = [];
}, P2.prototype.render = function(n, e2) {
  if (this.__b) {
    if (this.__v.__k) {
      var r2 = document.createElement("div"), o = this.__v.__k[0].__c;
      this.__v.__k[0] = V(this.__b, r2, o.__O = o.__P);
    }
    this.__b = null;
  }
  var i2 = e2.__a && k(S, null, n.fallback);
  return i2 && (i2.__u &= -33), [k(S, null, e2.__a ? null : n.children), i2];
};
var H = function(n, t2, e2) {
  if (++e2[1] === e2[0] && n.l.delete(t2), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.l.size)) for (e2 = n.i; e2; ) {
    for (; e2.length > 3; ) e2.pop()();
    if (e2[1] < e2[0]) break;
    n.i = e2 = e2[2];
  }
};
function Z(n) {
  return this.getChildContext = function() {
    return n.context;
  }, n.children;
}
function Y(n) {
  var e2 = this, r2 = n.h;
  if (e2.componentWillUnmount = function() {
    R(null, e2.v), e2.v = null, e2.h = null;
  }, e2.h && e2.h !== r2 && e2.componentWillUnmount(), !e2.v) {
    for (var u3 = e2.__v; null !== u3 && !u3.__m && null !== u3.__; ) u3 = u3.__;
    e2.h = r2, e2.v = { nodeType: 1, parentNode: r2, childNodes: [], __k: { __m: u3.__m }, contains: function() {
      return true;
    }, namespaceURI: r2.namespaceURI, insertBefore: function(n2, t2) {
      this.childNodes.push(n2), e2.h.insertBefore(n2, t2);
    }, removeChild: function(n2) {
      this.childNodes.splice(this.childNodes.indexOf(n2) >>> 1, 1), e2.h.removeChild(n2);
    } };
  }
  R(k(Z, { context: e2.context }, n.__v), e2.v);
}
function $(n, e2) {
  var r2 = k(Y, { __v: n, h: e2 });
  return r2.containerInfo = e2, r2;
}
(B2.prototype = new C()).__a = function(n) {
  var t2 = this, e2 = j2(t2.__v), r2 = t2.l.get(n);
  return r2[0]++, function(u3) {
    var o = function() {
      t2.props.revealOrder ? (r2.push(u3), H(t2, n, r2)) : u3();
    };
    e2 ? e2(o) : o();
  };
}, B2.prototype.render = function(n) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var t2 = F(n.children);
  n.revealOrder && "b" === n.revealOrder[0] && t2.reverse();
  for (var e2 = t2.length; e2--; ) this.l.set(t2[e2], this.i = [1, 0, this.i]);
  return n.children;
}, B2.prototype.componentDidUpdate = B2.prototype.componentDidMount = function() {
  var n = this;
  this.l.forEach(function(t2, e2) {
    H(n, e2, t2);
  });
};
var q2 = "undefined" != typeof Symbol && Symbol.for && /* @__PURE__ */ Symbol.for("react.element") || 60103;
var G = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
var J = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
var K = /[A-Z0-9]/g;
var Q = "undefined" != typeof document;
var X2 = function(n) {
  return ("undefined" != typeof Symbol && "symbol" == typeof /* @__PURE__ */ Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n);
};
function nn(n, t2, e2) {
  return null == t2.__k && (t2.textContent = ""), R(n, t2), "function" == typeof e2 && e2(), n ? n.__c : null;
}
C.prototype.isReactComponent = true, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t2) {
  Object.defineProperty(C.prototype, t2, { configurable: true, get: function() {
    return this["UNSAFE_" + t2];
  }, set: function(n) {
    Object.defineProperty(this, t2, { configurable: true, writable: true, value: n });
  } });
});
var en = l.event;
l.event = function(n) {
  return en && (n = en(n)), n.persist = function() {
  }, n.isPropagationStopped = function() {
    return this.cancelBubble;
  }, n.isDefaultPrevented = function() {
    return this.defaultPrevented;
  }, n.nativeEvent = n;
};
var rn;
var un = { configurable: true, get: function() {
  return this.class;
} };
var on = l.vnode;
l.vnode = function(n) {
  "string" == typeof n.type && (function(n2) {
    var t2 = n2.props, e2 = n2.type, u3 = {}, o = -1 == e2.indexOf("-");
    for (var i2 in t2) {
      var l3 = t2[i2];
      if (!("value" === i2 && "defaultValue" in t2 && null == l3 || Q && "children" === i2 && "noscript" === e2 || "class" === i2 || "className" === i2)) {
        var f2 = i2.toLowerCase();
        "defaultValue" === i2 && "value" in t2 && null == t2.value ? i2 = "value" : "download" === i2 && true === l3 ? l3 = "" : "translate" === f2 && "no" === l3 ? l3 = false : "o" === f2[0] && "n" === f2[1] ? "ondoubleclick" === f2 ? i2 = "ondblclick" : "onchange" !== f2 || "input" !== e2 && "textarea" !== e2 || X2(t2.type) ? "onfocus" === f2 ? i2 = "onfocusin" : "onblur" === f2 ? i2 = "onfocusout" : J.test(i2) && (i2 = f2) : f2 = i2 = "oninput" : o && G.test(i2) ? i2 = i2.replace(K, "-$&").toLowerCase() : null === l3 && (l3 = void 0), "oninput" === f2 && u3[i2 = f2] && (i2 = "oninputCapture"), u3[i2] = l3;
      }
    }
    "select" == e2 && (u3.multiple && Array.isArray(u3.value) && (u3.value = F(t2.children).forEach(function(n3) {
      n3.props.selected = -1 != u3.value.indexOf(n3.props.value);
    })), null != u3.defaultValue && (u3.value = F(t2.children).forEach(function(n3) {
      n3.props.selected = u3.multiple ? -1 != u3.defaultValue.indexOf(n3.props.value) : u3.defaultValue == n3.props.value;
    }))), t2.class && !t2.className ? (u3.class = t2.class, Object.defineProperty(u3, "className", un)) : t2.className && (u3.class = u3.className = t2.className), n2.props = u3;
  })(n), n.$$typeof = q2, on && on(n);
};
var ln = l.__r;
l.__r = function(n) {
  ln && ln(n), rn = n.__c;
};
var fn = l.diffed;
l.diffed = function(n) {
  fn && fn(n);
  var t2 = n.props, e2 = n.__e;
  null != e2 && "textarea" === n.type && "value" in t2 && t2.value !== e2.value && (e2.value = null == t2.value ? "" : t2.value), rn = null;
};
function hn(n) {
  return !!n && n.$$typeof === q2;
}
function pn(n) {
  return !!n.__k && (R(null, n), true);
}
var bn = function(n, t2) {
  var r2, u3 = l.debounceRendering;
  l.debounceRendering = function(n2) {
    r2 = n2;
  };
  try {
    var o = n(t2);
    return r2 && r2(), o;
  } finally {
    l.debounceRendering = u3;
  }
};

// node_modules/fullcalendar/chunks/2f45deb4.js
function memoize(workerFunc, resEquality, teardownFunc) {
  let currentArgs;
  let currentRes;
  return function(...newArgs) {
    if (!currentArgs) {
      currentRes = workerFunc.apply(this, newArgs);
    } else if (!isArraysEqual(currentArgs, newArgs)) {
      if (teardownFunc) {
        teardownFunc(currentRes);
      }
      let res = workerFunc.apply(this, newArgs);
      if (!resEquality || !resEquality(res, currentRes)) {
        currentRes = res;
      }
    }
    currentArgs = newArgs;
    return currentRes;
  };
}
function memoizeObjArg(workerFunc, resEquality, teardownFunc) {
  let currentArg;
  let currentRes;
  return (newArg) => {
    if (!currentArg) {
      currentRes = workerFunc.call(this, newArg);
    } else if (!isPropsEqualShallow(currentArg, newArg)) {
      if (teardownFunc) {
        teardownFunc(currentRes);
      }
      let res = workerFunc.call(this, newArg);
      if (!resEquality || !resEquality(res, currentRes)) {
        currentRes = res;
      }
    }
    currentArg = newArg;
    return currentRes;
  };
}
var ViewContextType = X({});
function buildViewContext(viewSpec, viewApi, viewOptions, dateProfileGenerator, dateEnv, nowManager, pluginHooks, dispatch, getCurrentData, emitter, calendarApi, baseId, registerInteractiveComponent, unregisterInteractiveComponent) {
  return {
    dateEnv,
    nowManager,
    options: viewOptions,
    pluginHooks,
    emitter,
    dispatch,
    getCurrentData,
    calendarApi,
    viewSpec,
    viewApi,
    dateProfileGenerator,
    baseId,
    registerInteractiveComponent,
    unregisterInteractiveComponent
  };
}
var PureComponent = class extends C {
  // debug: boolean
  shouldComponentUpdate(nextProps, nextState) {
    return !isPropsEqualWithMap(
      this.props,
      nextProps,
      this.propEquality
      /*, this.debug && 'props' */
    ) || !isPropsEqualWithMap(
      this.state,
      nextState,
      this.stateEquality
      /*, this.debug && 'state' */
    );
  }
};
PureComponent.addPropsEquality = addPropsEquality;
PureComponent.addStateEquality = addStateEquality;
PureComponent.contextType = ViewContextType;
PureComponent.prototype.propEquality = {};
PureComponent.prototype.stateEquality = {};
var BaseComponent = class extends PureComponent {
};
BaseComponent.contextType = ViewContextType;
function addPropsEquality(propEquality) {
  let hash = Object.create(this.prototype.propEquality);
  Object.assign(hash, propEquality);
  this.prototype.propEquality = hash;
}
function addStateEquality(stateEquality) {
  let hash = Object.create(this.prototype.stateEquality);
  Object.assign(hash, stateEquality);
  this.prototype.stateEquality = hash;
}
function setRef(ref, current) {
  if (typeof ref === "function") {
    ref(current);
  } else if (ref) {
    ref.current = current;
  }
}
var ContentInjector = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.id = guid();
    this.queuedDomNodes = [];
    this.currentDomNodes = [];
    this.handleEl = (el) => {
      this.el = el;
      if (this.props.elRef) {
        setRef(this.props.elRef, el);
      }
    };
  }
  render() {
    const { props, context } = this;
    const { options } = context;
    const { customGenerator, defaultGenerator, renderProps } = props;
    const attrs = buildElAttrs(props, "", this.handleEl);
    let useDefault = false;
    let innerContent;
    let queuedDomNodes = [];
    let currentGeneratorMeta;
    if (customGenerator != null) {
      const customGeneratorRes = typeof customGenerator === "function" ? customGenerator(renderProps) : customGenerator;
      if (customGeneratorRes === true) {
        useDefault = true;
      } else {
        const isObject = customGeneratorRes && typeof customGeneratorRes === "object";
        if (isObject && "html" in customGeneratorRes) {
          attrs.dangerouslySetInnerHTML = { __html: customGeneratorRes.html };
        } else if (isObject && "domNodes" in customGeneratorRes) {
          queuedDomNodes = Array.prototype.slice.call(customGeneratorRes.domNodes);
        } else if (isObject ? hn(customGeneratorRes) : typeof customGeneratorRes !== "function") {
          innerContent = customGeneratorRes;
        } else {
          currentGeneratorMeta = customGeneratorRes;
        }
      }
    } else {
      useDefault = !hasCustomRenderingHandler(props.generatorName, options);
    }
    if (useDefault && defaultGenerator) {
      innerContent = defaultGenerator(renderProps);
    }
    this.queuedDomNodes = queuedDomNodes;
    this.currentGeneratorMeta = currentGeneratorMeta;
    return k(props.tag, attrs, innerContent);
  }
  componentDidMount() {
    this.applyQueueudDomNodes();
    this.triggerCustomRendering(true);
  }
  componentDidUpdate() {
    this.applyQueueudDomNodes();
    this.triggerCustomRendering(true);
  }
  componentWillUnmount() {
    this.triggerCustomRendering(false);
  }
  triggerCustomRendering(isActive) {
    const { props, context } = this;
    const { handleCustomRendering, customRenderingMetaMap } = context.options;
    if (handleCustomRendering) {
      const generatorMeta = this.currentGeneratorMeta ?? customRenderingMetaMap?.[props.generatorName];
      if (generatorMeta) {
        handleCustomRendering({
          id: this.id,
          isActive,
          containerEl: this.el,
          generatorMeta,
          renderProps: props.renderProps
        });
      }
    }
  }
  applyQueueudDomNodes() {
    const { queuedDomNodes, currentDomNodes } = this;
    const { el } = this;
    if (!isArraysEqual(queuedDomNodes, currentDomNodes)) {
      for (const domNode of currentDomNodes) {
        domNode.remove();
      }
      for (let newNode of queuedDomNodes) {
        el.appendChild(newNode);
      }
      this.currentDomNodes = queuedDomNodes;
    }
  }
};
ContentInjector.addPropsEquality({
  renderProps: isPropsEqualShallow,
  attrs: isNonHandlerPropsEqual,
  style: isPropsEqualShallow
});
function hasCustomRenderingHandler(generatorName, options) {
  return Boolean(options.handleCustomRendering && generatorName && options.customRenderingMetaMap?.[generatorName]);
}
function buildElAttrs(props, className, elRef) {
  const attrs = __spreadProps(__spreadValues({}, props.attrs), { ref: elRef });
  if (props.className || className) {
    attrs.className = joinClassNames(className, props.className, attrs.className);
  }
  if (props.style) {
    attrs.style = props.style;
  }
  return attrs;
}
var RenderId = X(0);
var ContentContainer = class extends C {
  constructor() {
    super(...arguments);
    this.InnerContent = InnerContentInjector.bind(void 0, this);
    this.handleEl = (el) => {
      this.el = el;
      if (this.props.elRef) {
        setRef(this.props.elRef, el);
        if (el && this.didMountMisfire) {
          this.componentDidMount();
        }
      }
    };
  }
  render() {
    const { props } = this;
    const generatedClassName = generateClassName(props.classNameGenerator, props.renderProps);
    if (props.children) {
      const attrs = buildElAttrs(props, generatedClassName, this.handleEl);
      const children = props.children(this.InnerContent, props.renderProps, attrs);
      if (props.tag) {
        return k(props.tag, attrs, children);
      } else {
        return children;
      }
    } else {
      return k(ContentInjector, __spreadProps(__spreadValues({}, props), {
        elRef: this.handleEl,
        tag: props.tag || "div",
        className: joinClassNames(props.className, generatedClassName),
        renderId: this.context
      }));
    }
  }
  componentDidMount() {
    if (this.el) {
      this.props.didMount?.(__spreadProps(__spreadValues({}, this.props.renderProps), {
        el: this.el
      }));
    } else {
      this.didMountMisfire = true;
    }
  }
  componentWillUnmount() {
    this.props.willUnmount?.(__spreadProps(__spreadValues({}, this.props.renderProps), {
      el: this.el
    }));
  }
};
ContentContainer.contextType = RenderId;
function InnerContentInjector(containerComponent, props) {
  const parentProps = containerComponent.props;
  return k(ContentInjector, __spreadValues({
    renderProps: parentProps.renderProps,
    generatorName: parentProps.generatorName,
    customGenerator: parentProps.customGenerator,
    defaultGenerator: parentProps.defaultGenerator,
    renderId: containerComponent.context
  }, props));
}
function generateClassName(classNameGenerator, renderProps) {
  return (typeof classNameGenerator === "function" ? classNameGenerator(renderProps) : classNameGenerator) || "";
}
function renderText(renderProps) {
  return renderProps.text;
}
function getIsHeightAuto(options) {
  return options.height === "auto" || options.contentHeight === "auto";
}
function getTableHeaderSticky(options) {
  let { tableHeaderSticky } = options;
  if (tableHeaderSticky == null || tableHeaderSticky === "auto") {
    tableHeaderSticky = getIsHeightAuto(options);
  }
  return tableHeaderSticky;
}
function getFooterScrollbarSticky(options) {
  const isHeightAuto = getIsHeightAuto(options);
  let { footerScrollbarSticky } = options;
  if (footerScrollbarSticky == null || footerScrollbarSticky === "auto") {
    footerScrollbarSticky = isHeightAuto;
  }
  return Boolean(footerScrollbarSticky) && isHeightAuto;
}
function getScrollerSyncerClass(pluginHooks) {
  const ScrollerSyncer = pluginHooks.scrollerSyncerClass;
  if (!ScrollerSyncer) {
    throw new RangeError("Must import @fullcalendar/scrollgrid");
  }
  return ScrollerSyncer;
}
var NowTimerRunner = class {
  constructor(handleChange) {
    this.handleChange = handleChange;
    this.isMounted = false;
    this.handleRefresh = () => {
      let timing = this.computeTiming();
      if (timing.nowDate.valueOf() !== this.nowDate.valueOf() || timing.nowMs !== this.nowMs) {
        this.nowDate = timing.nowDate;
        this.nowMs = timing.nowMs;
        this.todayRange = timing.todayRange;
        this.handleChange();
      }
      this.clearTimeout();
      this.setTimeout(timing.waitMs);
    };
    this.handleVisibilityChange = () => {
      if (!document.hidden) {
        this.handleRefresh();
      }
    };
  }
  update(input) {
    if (!this.isMounted) {
      this.isMounted = true;
      this.unit = input.unit;
      this.unitValue = input.unitValue;
      this.nowIndicatorSnap = input.nowIndicatorSnap;
      this.nowManager = input.nowManager;
      this.dateEnv = input.dateEnv;
      const timing = this.computeTiming();
      this.nowDate = timing.nowDate;
      this.nowMs = timing.nowMs;
      this.todayRange = timing.todayRange;
      this.setTimeout(timing.waitMs);
      this.nowManager.addResetListener(this.handleRefresh);
      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", this.handleVisibilityChange);
      }
    } else if (input.unit !== this.unit || input.unitValue !== this.unitValue || input.nowIndicatorSnap !== this.nowIndicatorSnap || input.nowManager !== this.nowManager || input.dateEnv !== this.dateEnv) {
      this.unit = input.unit;
      this.unitValue = input.unitValue;
      this.nowIndicatorSnap = input.nowIndicatorSnap;
      this.nowManager = input.nowManager;
      this.dateEnv = input.dateEnv;
      const timing = this.computeTiming();
      this.nowDate = timing.nowDate;
      this.nowMs = timing.nowMs;
      this.todayRange = timing.todayRange;
      this.clearTimeout();
      this.setTimeout(timing.waitMs);
    }
    return {
      nowDate: this.nowDate,
      nowMs: this.nowMs,
      todayRange: this.todayRange
    };
  }
  destroy() {
    if (this.isMounted) {
      this.isMounted = false;
      this.clearTimeout();
      this.nowManager.removeResetListener(this.handleRefresh);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
      }
    }
  }
  computeTiming() {
    let { unit, unitValue, nowIndicatorSnap, dateEnv } = this;
    let unroundedNowMs = this.nowManager.getEpochMs();
    let unroundedNow = dateEnv.timestampToMarker(unroundedNowMs);
    if (nowIndicatorSnap === "auto") {
      nowIndicatorSnap = // large unit?
      /year|month|week|day/.test(unit) || // if slotDuration 30 mins for example, would NOT appear to snap (legacy behavior)
      (unitValue || 1) === 1;
    }
    let nowDate;
    let nowMs;
    let waitMs;
    if (nowIndicatorSnap) {
      nowDate = dateEnv.startOf(unroundedNow, unit);
      nowMs = resolveSnappedInstant(nowDate, unroundedNowMs, dateEnv);
      let nextUnitStart = dateEnv.add(nowDate, createDuration(1, unit));
      waitMs = resolveNextSnappedInstant(nextUnitStart, unroundedNowMs, dateEnv) - unroundedNowMs;
    } else {
      nowDate = unroundedNow;
      nowMs = unroundedNowMs;
      waitMs = 1e3 * 60;
    }
    waitMs = Math.min(1e3 * 60 * 60 * 24, waitMs);
    return {
      nowDate,
      nowMs,
      todayRange: buildDayRange(nowDate),
      waitMs
    };
  }
  setTimeout(waitMs = this.computeTiming().waitMs) {
    this.timeoutId = setTimeout(() => {
      const timing = this.computeTiming();
      this.nowDate = timing.nowDate;
      this.nowMs = timing.nowMs;
      this.todayRange = timing.todayRange;
      this.handleChange();
      this.setTimeout(timing.waitMs);
    }, waitMs);
  }
  clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
};
function resolveSnappedInstant(snappedMarker, rawMs, dateEnv) {
  const offsetMs = dateEnv.timestampToMarker(rawMs).valueOf() - rawMs;
  const candidateMs = snappedMarker.valueOf() - offsetMs;
  if (dateEnv.timestampToMarker(candidateMs).valueOf() === snappedMarker.valueOf()) {
    return candidateMs;
  }
  return dateEnv.toDate(snappedMarker).valueOf();
}
function resolveNextSnappedInstant(nextUnitStart, rawMs, dateEnv) {
  const nextSnappedMs = resolveSnappedInstant(nextUnitStart, rawMs, dateEnv);
  const transitionMs = findNextOffsetTransitionMs(rawMs, dateEnv, Math.min(nextSnappedMs - rawMs, 48 * 60 * 60 * 1e3));
  return transitionMs != null ? Math.min(nextSnappedMs, transitionMs) : nextSnappedMs;
}
function findNextOffsetTransitionMs(rawMs, dateEnv, horizonMs) {
  if (horizonMs <= 0) {
    return void 0;
  }
  const startOffsetMs = offsetAt(rawMs, dateEnv);
  let lowerMs = rawMs;
  let upperMs = rawMs + horizonMs;
  if (offsetAt(upperMs, dateEnv) === startOffsetMs) {
    return void 0;
  }
  while (upperMs - lowerMs > 1) {
    const middleMs = Math.floor((lowerMs + upperMs) / 2);
    if (offsetAt(middleMs, dateEnv) === startOffsetMs) {
      lowerMs = middleMs;
    } else {
      upperMs = middleMs;
    }
  }
  return upperMs > rawMs ? upperMs : void 0;
}
function offsetAt(instantMs, dateEnv) {
  return dateEnv.timestampToMarker(instantMs).valueOf() - instantMs;
}
function buildDayRange(date) {
  let start = startOfDay(date);
  let end = addDays(start, 1);
  return { start, end };
}
function isDimsEqual(v0, v1) {
  return v0 != null && (v0 === v1 || Math.abs(v0 - v1) < 0.01);
}
var nativeBorderBoxEnabled = true;
var configMap = /* @__PURE__ */ new Map();
var afterSizeCallbacks = /* @__PURE__ */ new Set();
var isHandling = false;
var isStalling = false;
var isAcquiringImmediately = false;
function afterSize(callback) {
  afterSizeCallbacks.add(callback);
  if (!isHandling && !isStalling) {
    isStalling = true;
    requestAnimationFrame(() => {
      isStalling = false;
      flushAfterSize();
    });
  }
}
function flushAfterSize() {
  for (const flushedCallback of afterSizeCallbacks.values()) {
    afterSizeCallbacks.delete(flushedCallback);
    flushedCallback();
  }
}
function flushSyncWithSizeBatching(callback) {
  const wasHandling = isHandling;
  isHandling = true;
  isAcquiringImmediately = true;
  try {
    bn(callback);
    if (!wasHandling) {
      bn(() => {
        flushAfterSize();
        isHandling = false;
      });
    }
  } finally {
    isHandling = wasHandling;
    isAcquiringImmediately = false;
  }
}
var globalResizeObserver = typeof ResizeObserver !== "undefined" && new ResizeObserver((entries) => {
  isHandling = true;
  for (let entry of entries) {
    const el = entry.target;
    const config = configMap.get(el);
    let width;
    let height;
    if (entry.borderBoxSize && nativeBorderBoxEnabled) {
      const borderBoxSize = entry.borderBoxSize[0] || entry.borderBoxSize;
      width = borderBoxSize.inlineSize;
      height = borderBoxSize.blockSize;
    } else {
      ({ width, height } = el.getBoundingClientRect());
    }
    let shouldFire = false;
    if (!isDimsEqual(config.width, width)) {
      config.width = width;
      shouldFire = config.watchWidth;
    }
    if (!isDimsEqual(config.height, height)) {
      config.height = height;
      shouldFire || (shouldFire = config.watchHeight);
    }
    if (shouldFire) {
      config.callback(width, height);
    }
  }
  bn(() => {
    flushAfterSize();
    isHandling = false;
  });
});
function watchSize(el, callback, watchWidth2 = true, watchHeight2 = true) {
  const config = { callback, watchWidth: watchWidth2, watchHeight: watchHeight2 };
  configMap.set(el, config);
  if (isAcquiringImmediately) {
    const { width, height } = el.getBoundingClientRect();
    config.width = width;
    config.height = height;
    callback(width, height);
  }
  if (globalResizeObserver) {
    globalResizeObserver.observe(el, {
      box: "border-box"
      // default is 'content-box'
    });
  }
  return () => {
    configMap.delete(el);
    if (globalResizeObserver) {
      globalResizeObserver.unobserve(el);
    }
  };
}
function watchWidth(el, callback) {
  return watchSize(
    el,
    callback,
    /* watchWidth = */
    true
  );
}
function watchHeight(el, callback) {
  return watchSize(
    el,
    (_width, height) => callback(height),
    /* watchWidth = */
    false,
    /* watchHeight = */
    true
  );
}
var NowTimer = class extends C {
  constructor(props, context) {
    super(props, context);
    this.handleChange = () => {
      this.forceUpdate();
    };
    this.runner = new NowTimerRunner(this.handleChange);
  }
  render() {
    const { props, context } = this;
    const { nowDate, nowMs, todayRange } = this.runner.update({
      nowManager: context.nowManager,
      unit: props.unit,
      unitValue: props.unitValue,
      nowIndicatorSnap: context.options.nowIndicatorSnap,
      dateEnv: context.dateEnv
    });
    return props.children(nowDate, todayRange, nowMs);
  }
  componentWillUnmount() {
    this.runner.destroy();
  }
};
NowTimer.contextType = ViewContextType;
var FULL_DATE_FORMAT = createFormatter({ year: "numeric", month: "long", day: "numeric" });
var WEEK_FORMAT = createFormatter({ week: "long" });
var WEEKDAY_ONLY_FORMAT = createFormatter({
  weekday: "long"
});
function findWeekdayText(parts) {
  for (const part of parts) {
    if (part.type === "weekday") {
      return part.value;
    }
  }
  return "";
}
function findDayNumberText(parts) {
  for (const part of parts) {
    if (part.type === "day") {
      return part.value;
    }
  }
  return "";
}
function findMonthText(parts) {
  for (const part of parts) {
    if (part.type === "month") {
      return part.value;
    }
  }
  return "";
}
function buildDateStr(context, dateMarker, viewType = "day") {
  return joinDateTimeFormatParts(context.dateEnv.formatToParts(dateMarker, viewType === "week" ? WEEK_FORMAT : FULL_DATE_FORMAT));
}
function buildNavLinkAttrs(context, dateMarker, viewType = "day", dateStr = buildDateStr(context, dateMarker, viewType), isTabbable = true, omitHint = false) {
  const { dateEnv, options, calendarApi } = context;
  const zonedDate = dateEnv.toDate(dateMarker);
  const handleInteraction = (ev) => {
    let customAction = viewType === "day" ? options.navLinkDayClick : viewType === "week" ? options.navLinkWeekClick : null;
    if (typeof customAction === "function") {
      customAction.call(calendarApi, dateEnv.toDate(dateMarker), ev);
    } else {
      if (typeof customAction === "string") {
        viewType = customAction;
      }
      calendarApi.zoomTo(dateMarker, viewType);
    }
  };
  return __spreadValues({
    "role": "link",
    // TODO
    "aria-label": omitHint ? dateStr : formatWithOrdinals(options.navLinkHint, [dateStr, zonedDate], dateStr),
    "className": joinClassNames(options.navLinkClass, classNames.cursorPointer, classNames.internalNavLink)
  }, isTabbable ? createAriaClickAttrs(handleInteraction) : { onClick: handleInteraction });
}
function getDateMeta(dateMarker, dateEnv, dateProfile, todayRange, nowDate) {
  const isDisabled = Boolean(dateProfile && (!dateProfile.activeRange || !rangeContainsMarker(dateProfile.activeRange, dateMarker)));
  return {
    date: dateEnv.toDate(dateMarker),
    dow: dateMarker.getUTCDay(),
    isDisabled,
    isOther: !isDisabled && Boolean(dateProfile && !rangeContainsMarker(dateProfile.currentRange, dateMarker)),
    isToday: !isDisabled && Boolean(todayRange && rangeContainsMarker(todayRange, dateMarker)),
    isPast: !isDisabled && Boolean(nowDate ? dateMarker < nowDate : todayRange ? dateMarker < todayRange.start : false),
    isFuture: !isDisabled && Boolean(nowDate ? dateMarker > nowDate : todayRange ? dateMarker >= todayRange.end : false)
  };
}
var ViewContainer = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.refineRenderProps = memoizeObjArg(refineRenderProps);
  }
  render() {
    const { props, context } = this;
    const { options, viewSpec } = context;
    const renderProps = this.refineRenderProps(__spreadProps(__spreadValues({}, computeViewBorderless(options)), {
      options: { headerToolbar: options.headerToolbar, footerToolbar: options.footerToolbar },
      isHeightAuto: getIsHeightAuto(options),
      viewApi: context.viewApi
    }));
    return u(ContentContainer, { elRef: props.elRef, tag: props.tag || "div", attrs: props.attrs, style: props.style, className: joinClassNames(
      props.className,
      generateClassName(options.viewClass, renderProps),
      // WORKAROUND for way calendar's className would get merged into view's className
      generateClassName(viewSpec.optionDefaults.class, renderProps),
      generateClassName(viewSpec.optionDefaults.className, renderProps),
      generateClassName(viewSpec.optionOverrides.class, renderProps),
      generateClassName(viewSpec.optionOverrides.className, renderProps)
    ), renderProps, generatorName: void 0, didMount: options.didMount || options.viewDidMount, willUnmount: options.willUnmount || options.viewWillUnmount, children: () => props.children });
  }
};
function refineRenderProps(raw) {
  return {
    view: raw.viewApi,
    borderlessX: raw.borderlessX,
    borderlessTop: raw.borderlessTop,
    borderlessBottom: raw.borderlessBottom,
    options: raw.options,
    isHeightAuto: raw.isHeightAuto
  };
}
var DateComponent = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.uid = guid();
  }
  // Hit System
  // -----------------------------------------------------------------------------------------------------------------
  prepareHits() {
  }
  queryHit(isRtl, positionLeft, positionTop, elWidth, elHeight) {
    return null;
  }
  // Pointer Interaction Utils
  // -----------------------------------------------------------------------------------------------------------------
  isValidSegDownEl(el) {
    return !this.props.eventDrag && // HACK
    !this.props.eventResize && // HACK
    !el.closest(`.${classNames.internalEventMirror}`);
  }
  isValidDateDownEl(el) {
    return !el.closest(`.${classNames.internalEvent}:not(.${classNames.internalBgEvent})`) && !el.closest(`.${classNames.internalMoreLink}`) && !el.closest(`.${classNames.internalNavLink}`) && !el.closest(`.${classNames.internalPopover}`);
  }
};
var DelayedRunner = class {
  constructor(drainedOption) {
    this.drainedOption = drainedOption;
    this.isRunning = false;
    this.isDirty = false;
    this.pauseDepths = {};
    this.timeoutId = 0;
  }
  request(delay) {
    this.isDirty = true;
    if (!this.isPaused()) {
      this.clearTimeout();
      if (delay == null) {
        this.tryDrain();
      } else {
        this.timeoutId = setTimeout(
          // NOT OPTIMAL! TODO: look at debounce
          this.tryDrain.bind(this),
          delay
        );
      }
    }
  }
  pause(scope = "") {
    let { pauseDepths } = this;
    pauseDepths[scope] = (pauseDepths[scope] || 0) + 1;
    this.clearTimeout();
  }
  resume(scope = "", force) {
    let { pauseDepths } = this;
    if (scope in pauseDepths) {
      if (force) {
        delete pauseDepths[scope];
      } else {
        pauseDepths[scope] -= 1;
        let depth = pauseDepths[scope];
        if (depth <= 0) {
          delete pauseDepths[scope];
        }
      }
      this.tryDrain();
    }
  }
  isPaused() {
    return Object.keys(this.pauseDepths).length;
  }
  tryDrain() {
    if (!this.isRunning && !this.isPaused()) {
      this.isRunning = true;
      while (this.isDirty) {
        this.isDirty = false;
        this.drained();
      }
      this.isRunning = false;
    }
  }
  clear() {
    this.clearTimeout();
    this.isDirty = false;
    this.pauseDepths = {};
  }
  clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = 0;
    }
  }
  drained() {
    if (this.drainedOption) {
      this.drainedOption();
    }
  }
};
var ScrollListener = class {
  constructor(el) {
    this.el = el;
    this.emitter = new Emitter();
    this.isScroll = false;
    this.isScrollRecent = false;
    this.isWheelRecent = false;
    this.isMouseDown = false;
    this.isTouchDown = false;
    this.isMouse = false;
    this.isTouch = false;
    this.isWheel = false;
    this.handleScroll = () => {
      this.isScrollRecent = true;
      if (this.isMouseDown) {
        this.isMouse = true;
      }
      if (this.isTouchDown) {
        this.isTouch = true;
      }
      if (this.isWheelRecent) {
        this.isWheel = true;
      }
      this.startScroll();
      this.emitter.trigger("scroll", this.getIsDevice());
      this.scrollWaiter.request(500);
    };
    this.handleScrollWait = () => {
      this.isScrollRecent = false;
      if (!this.isTouchDown) {
        this.endScroll();
      }
    };
    this.handleWheel = () => {
      this.isWheelRecent = true;
      this.wheelWaiter.request(500);
    };
    this.handleWheelWait = () => {
      this.isWheelRecent = false;
    };
    this.handleMouseDown = () => {
      this.isMouseDown = true;
    };
    this.handleMouseUp = () => {
      this.isMouseDown = false;
    };
    this.handleTouchStart = () => {
      this.isTouchDown = true;
    };
    this.handleTouchEnd = () => {
      this.isTouchDown = false;
      if (!this.isScrollRecent) {
        this.endScroll();
      }
    };
    this.wheelWaiter = new DelayedRunner(this.handleWheelWait);
    this.scrollWaiter = new DelayedRunner(this.handleScrollWait);
    el.addEventListener("scroll", this.handleScroll, { passive: true });
    el.addEventListener("wheel", this.handleWheel, { passive: true });
    el.addEventListener("mousedown", this.handleMouseDown);
    el.addEventListener("mouseup", this.handleMouseUp);
    el.addEventListener("touchstart", this.handleTouchStart, { passive: true });
    el.addEventListener("touchend", this.handleTouchEnd);
  }
  destroy() {
    let { el } = this;
    el.removeEventListener("scroll", this.handleScroll, { passive: true });
    el.removeEventListener("wheel", this.handleWheel, { passive: true });
    el.removeEventListener("mousedown", this.handleMouseDown);
    el.removeEventListener("mouseup", this.handleMouseUp);
    el.removeEventListener("touchstart", this.handleTouchStart, { passive: true });
    el.removeEventListener("touchend", this.handleTouchEnd);
  }
  // Start / Stop
  // ----------------------------------------------------------------------------------------------
  startScroll() {
    if (!this.isScroll) {
      this.isScroll = true;
      this.emitter.trigger("scrollStart", this.getIsDevice());
    }
  }
  endScroll() {
    if (this.isScroll) {
      this.scrollWaiter.clear();
      this.wheelWaiter.clear();
      this.isScroll = false;
      this.isWheelRecent = false;
      this.emitter.trigger("scrollEnd", this.getIsDevice());
      this.isMouse = false;
      this.isTouch = false;
      this.isWheel = false;
    }
  }
  getIsDevice() {
    return this.isWheel || this.isMouse || this.isTouch;
  }
};
var Scroller = class extends DateComponent {
  constructor() {
    super(...arguments);
    this.handleEl = (el) => {
      if (this.el) {
        this.el = null;
        this._isUnmounting = true;
        this.listener.destroy();
      }
      if (el) {
        this.el = el;
        this._isUnmounting = false;
        this.listener = new ScrollListener(el);
      }
    };
    this.handleHRuler = (el) => {
      if (this.disconnectHRuler) {
        this.disconnectHRuler();
        this.disconnectHRuler = void 0;
        if (this.clientWidth !== void 0) {
          this.clientWidth = void 0;
          setRef(this.props.clientWidthRef, null);
        }
      }
      if (el) {
        this.disconnectHRuler = watchWidth(el, (clientWidth) => {
          if (this._isUnmounting)
            return;
          if (clientWidth !== this.clientWidth) {
            this.clientWidth = clientWidth;
            setRef(this.props.clientWidthRef, clientWidth);
          }
        });
      }
    };
    this.handleVRuler = (el) => {
      if (this.disconnectVRuler) {
        this.disconnectVRuler();
        this.disconnectVRuler = void 0;
        if (this.clientHeight !== void 0) {
          this.clientHeight = void 0;
          setRef(this.props.clientHeightRef, null);
        }
      }
      if (el) {
        this.disconnectVRuler = watchHeight(el, (clientHeight) => {
          if (this._isUnmounting)
            return;
          if (clientHeight !== this.clientHeight) {
            this.clientHeight = clientHeight;
            setRef(this.props.clientHeightRef, clientHeight);
          }
          const bottomScrollbarWidth = Math.round(this.el.getBoundingClientRect().height - clientHeight);
          if (bottomScrollbarWidth !== this.bottomScrollbarWidth) {
            this.bottomScrollbarWidth = bottomScrollbarWidth;
            setRef(this.props.bottomScrollbarWidthRef, bottomScrollbarWidth);
          }
        });
      }
    };
  }
  render() {
    const { props } = this;
    const fallbackOverflow = props.horizontal || props.vertical ? "hidden" : "";
    return u("div", { ref: this.handleEl, className: joinClassNames(
      props.className,
      classNames.noPadding,
      classNames.rel,
      // for children fillTop/fillStart
      props.hideScrollbars && classNames.noScrollbars,
      classNames.internalScroller
    ), style: __spreadProps(__spreadValues({}, props.style), {
      overflowX: props.horizontal ? "auto" : fallbackOverflow,
      overflowY: props.vertical ? "auto" : fallbackOverflow
    }), children: [props.children, Boolean(props.clientWidthRef) && u("div", { ref: this.handleHRuler, className: classNames.fillTop }), Boolean(props.clientHeightRef || props.bottomScrollbarWidthRef) && u("div", { ref: this.handleVRuler, className: classNames.fillStart })] });
  }
  endScroll() {
    this.listener.endScroll();
  }
  // Public API
  // -----------------------------------------------------------------------------------------------
  get x() {
    const { el } = this;
    return el ? getNormalizedScrollX(el) : 0;
  }
  get y() {
    const { el } = this;
    return el ? el.scrollTop : 0;
  }
  scrollTo({ x: x2, y: y2 }) {
    const { el } = this;
    if (el) {
      if (y2 != null) {
        el.scrollTop = y2;
      }
      if (x2 != null) {
        setNormalizedScrollX(el, x2);
      }
    }
  }
  addScrollStartListener(handler) {
    this.listener.emitter.on("scrollStart", handler);
  }
  removeScrollStartListener(handler) {
    this.listener.emitter.off("scrollStart", handler);
  }
  addScrollEndListener(handler) {
    this.listener.emitter.on("scrollEnd", handler);
  }
  removeScrollEndListener(handler) {
    this.listener.emitter.off("scrollEnd", handler);
  }
};
function getNormalizedScrollX(el) {
  const { scrollLeft } = el;
  const isRtl = computeElIsRtl(el);
  return isRtl ? getNormalizedRtlScrollX(scrollLeft, el) : scrollLeft;
}
function setNormalizedScrollX(el, x2) {
  const isRtl = computeElIsRtl(el);
  el.scrollLeft = isRtl ? getNormalizedRtlScrollLeft(x2, el) : x2;
}
function getNormalizedRtlScrollX(scrollLeft, el) {
  switch (getRtlScrollerSystem()) {
    case "positive":
      return el.scrollWidth - el.clientWidth - scrollLeft;
    case "negative":
      return -scrollLeft;
  }
  return scrollLeft;
}
function getNormalizedRtlScrollLeft(x2, el) {
  switch (getRtlScrollerSystem()) {
    case "positive":
      return el.scrollWidth - el.clientWidth - x2;
    case "negative":
      return -x2;
  }
  return x2;
}
var _rtlScrollerSystem;
function getRtlScrollerSystem() {
  return _rtlScrollerSystem || (_rtlScrollerSystem = detectRtlScrollerSystem());
}
function detectRtlScrollerSystem() {
  let el = document.createElement("div");
  el.style.position = "absolute";
  el.style.top = "-1000px";
  el.style.width = "100px";
  el.style.height = "100px";
  el.style.overflow = "scroll";
  el.style.direction = "rtl";
  let innerEl = document.createElement("div");
  innerEl.style.width = "200px";
  innerEl.style.height = "200px";
  el.appendChild(innerEl);
  document.body.appendChild(el);
  let system;
  if (el.scrollLeft > 0) {
    system = "positive";
  } else {
    el.scrollLeft = 50;
    if (el.scrollLeft > 0) {
      system = "reverse";
    } else {
      system = "negative";
    }
  }
  el.remove();
  return system;
}
var StandardEvent = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.buildPublicEvent = memoize((context, eventDef, eventInstance) => new EventImpl(context, eventDef, eventInstance));
    this.handleEl = (el) => {
      this.el = el;
      setRef(this.props.elRef, el);
      if (el) {
        setElEventRange(el, this.props.eventRange);
      }
    };
  }
  render() {
    const { props, context } = this;
    const { options } = context;
    const { eventRange } = props;
    const eventUi = eventRange.ui;
    const timeFormat = options.eventTimeFormat || props.defaultTimeFormat;
    const timeText = props.forcedTimeText ?? buildEventRangeTimeText(
      timeFormat,
      eventRange,
      // just for def/instance
      props.slicedStart,
      props.slicedEnd,
      props.isStart,
      props.isEnd,
      context,
      props.defaultDisplayEventTime,
      props.defaultDisplayEventEnd
    );
    const [tag, attrs, isInteractive] = getEventTagAndAttrs(eventRange, context);
    const eventApi = this.buildPublicEvent(context, eventRange.def, eventRange.instance);
    const isDraggable = !props.disableDragging && computeEventRangeDraggable(eventRange, context);
    const isBlock = /row|column/.test(props.display);
    const subcontentRenderProps = __spreadProps(__spreadValues({}, props.renderProps), {
      // first, so built-in props take precedence
      event: eventApi,
      isNarrow: props.isNarrow || false,
      isShort: props.isShort || false,
      timeText
    });
    const renderProps = __spreadProps(__spreadValues({}, props.renderProps), {
      // first, so built-in props take precedence
      event: eventApi,
      // make stable. everything else atomic. FYI, eventRange unfortunately gets reconstructed a lot, but def/instance is stable
      view: context.viewApi,
      timeText,
      color: eventUi.color || options.eventColor,
      contrastColor: eventUi.contrastColor || options.eventContrastColor,
      isDraggable,
      isStartResizable: !props.disableResizing && props.isStart && eventUi.durationEditable && options.eventResizableFromStart,
      isEndResizable: !props.disableResizing && props.isEnd && eventUi.durationEditable,
      isMirror: props.isMirror,
      isStart: Boolean(props.isStart),
      isEnd: Boolean(props.isEnd),
      isFirst: Boolean(props.isFirst),
      isLast: Boolean(props.isLast),
      isPast: Boolean(props.isPast),
      // TODO: don't cast. getDateMeta does it
      isFuture: Boolean(props.isFuture),
      // TODO: don't cast. getDateMeta does it
      isToday: Boolean(props.isToday),
      // TODO: don't cast. getDateMeta does it
      isSelected: Boolean(props.isSelected),
      isDragging: Boolean(props.isDragging),
      isResizing: Boolean(props.isResizing),
      isInteractive,
      isNarrow: props.isNarrow || false,
      isShort: props.isShort || false,
      level: props.level || 0,
      timeClass: joinClassNames(generateClassName(options.eventTimeClass, subcontentRenderProps), isBlock && generateClassName(options.blockEventTimeClass, subcontentRenderProps), props.display === "row" && generateClassName(options.rowEventTimeClass, subcontentRenderProps), props.display === "column" && generateClassName(options.columnEventTimeClass, subcontentRenderProps), props.display === "list-item" && generateClassName(options.listItemEventTimeClass, subcontentRenderProps)),
      titleClass: joinClassNames(generateClassName(options.eventTitleClass, subcontentRenderProps), isBlock && generateClassName(options.blockEventTitleClass, subcontentRenderProps), props.display === "row" && generateClassName(options.rowEventTitleClass, subcontentRenderProps), props.display === "column" && generateClassName(options.columnEventTitleClass, subcontentRenderProps), props.display === "list-item" && generateClassName(options.listItemEventTitleClass, subcontentRenderProps), props.display === "row" && options.rowEventTitleSticky && classNames.stickyS, props.display === "column" && options.columnEventTitleSticky && classNames.stickyT),
      options: { eventOverlap: Boolean(options.eventOverlap) }
    });
    const outerClassName = joinClassNames(
      // already includes eventClass below
      isBlock && generateClassName(options.blockEventClass, renderProps),
      props.display === "row" && generateClassName(options.rowEventClass, renderProps),
      props.display === "column" && generateClassName(options.columnEventClass, renderProps),
      props.display === "list-item" && generateClassName(options.listItemEventClass, renderProps),
      eventUi.className,
      props.className,
      props.display === "column" ? classNames.flexCol : classNames.flexRow,
      (eventRange.def.url || isDraggable) && classNames.cursorPointer,
      classNames.internalEvent,
      props.isMirror && classNames.internalEventMirror,
      isDraggable && classNames.internalEventDraggable,
      renderProps.isSelected && classNames.internalEventSelected,
      (renderProps.isStartResizable || renderProps.isEndResizable) && classNames.internalEventResizable
    );
    const beforeClassName = joinClassNames(generateClassName(options.eventBeforeClass, renderProps), isBlock && generateClassName(options.blockEventBeforeClass, renderProps), props.display === "row" && generateClassName(options.rowEventBeforeClass, renderProps), props.display === "column" && generateClassName(options.columnEventBeforeClass, renderProps), props.display === "list-item" && generateClassName(options.listItemEventBeforeClass, renderProps));
    const afterClassName = joinClassNames(generateClassName(options.eventAfterClass, renderProps), isBlock && generateClassName(options.blockEventAfterClass, renderProps), props.display === "row" && generateClassName(options.rowEventAfterClass, renderProps), props.display === "column" && generateClassName(options.columnEventAfterClass, renderProps), props.display === "list-item" && generateClassName(options.listItemEventAfterClass, renderProps));
    const innerClassName = joinClassNames(generateClassName(options.eventInnerClass, renderProps), isBlock && generateClassName(options.blockEventInnerClass, renderProps), props.display === "row" && generateClassName(options.rowEventInnerClass, renderProps), props.display === "column" && generateClassName(options.columnEventInnerClass, renderProps), props.display === "list-item" && generateClassName(options.listItemEventInnerClass, renderProps), !props.disableLiquid && classNames.liquid);
    const beforeContent = props.display === "row" && options.rowEventBeforeContent;
    const afterContent = props.display === "row" && options.rowEventAfterContent;
    return u(ContentContainer, { tag, attrs: __spreadProps(__spreadValues(__spreadValues({}, props.attrs), attrs), {
      // HACK because this event-element gets attached to root during some dragging
      dir: props.isDragging && options.direction === "rtl" ? "rtl" : void 0
    }), className: outerClassName, style: {
      "--fc-event-color": renderProps.color,
      "--fc-event-contrast-color": renderProps.contrastColor
    }, elRef: this.handleEl, renderProps, generatorName: "eventContent", customGenerator: options.eventContent, defaultGenerator: renderInnerContent, classNameGenerator: options.eventClass, didMount: options.eventDidMount, willUnmount: options.eventWillUnmount, children: (InnerContent) => u(S, { children: [Boolean(renderProps.isSelected && isBlock) && u("div", { className: props.display === "column" ? classNames.hitX : classNames.hitY }), (beforeClassName || beforeContent) && u("div", { className: joinClassNames(beforeClassName, !props.disableZindexes && classNames.z1, renderProps.isStartResizable && joinClassNames(
      props.display === "column" ? classNames.cursorResizeT : classNames.cursorResizeS,
      // these classnames required for dnd
      classNames.internalEventResizer,
      classNames.internalEventResizerStart
    )), children: [beforeContent && u(ContentContainer, { tag: "div", style: { display: "contents" }, attrs: { "aria-hidden": true }, renderProps, generatorName: void 0, customGenerator: beforeContent }), Boolean(renderProps.isStartResizable && renderProps.isSelected) && u("div", { className: classNames.hit })] }), u(InnerContent, { tag: "div", className: joinClassNames(innerClassName, !props.disableZindexes && classNames.z0) }), (afterClassName || afterContent) && u("div", { className: joinClassNames(afterClassName, !props.disableZindexes && classNames.z1, renderProps.isEndResizable && joinClassNames(
      props.display === "column" ? classNames.cursorResizeB : classNames.cursorResizeE,
      // these classnames required for dnd
      classNames.internalEventResizer,
      classNames.internalEventResizerEnd
    )), children: [afterContent && u(ContentContainer, { tag: "div", style: { display: "contents" }, attrs: { "aria-hidden": true }, renderProps, generatorName: void 0, customGenerator: afterContent }), Boolean(renderProps.isEndResizable && renderProps.isSelected) && u("div", { className: classNames.hit })] })] }) });
  }
  componentDidUpdate(prevProps) {
    if (this.el && this.props.eventRange !== prevProps.eventRange) {
      setElEventRange(this.el, this.props.eventRange);
    }
  }
};
StandardEvent.addPropsEquality({
  seg: isPropsEqualShallow
});
function renderInnerContent(innerProps) {
  return u(S, { children: [innerProps.timeText && u("div", { className: innerProps.timeClass, children: innerProps.timeText }), u("div", { className: innerProps.titleClass, children: innerProps.event.title || u(S, { children: " " }) })] });
}

// node_modules/fullcalendar/chunks/4ddf07a5.js
var DateProfileGenerator = class {
  constructor(props) {
    this.props = props;
    this.initHiddenDays();
  }
  /* Date Range Computation
  ------------------------------------------------------------------------------------------------------------------*/
  // Builds a structure with info about what the dates/ranges will be for the "prev" view.
  buildPrev(currentDateProfile, currentDate, nowDate, forceToValid) {
    let { dateEnv } = this.props;
    let prevDate = dateEnv.subtract(
      dateEnv.startOf(currentDate, currentDateProfile.currentRangeUnit),
      // important for start-of-month
      currentDateProfile.dateIncrement
    );
    return this.build(prevDate, nowDate, -1, forceToValid);
  }
  // Builds a structure with info about what the dates/ranges will be for the "next" view.
  buildNext(currentDateProfile, currentDate, nowDate, forceToValid) {
    let { dateEnv } = this.props;
    let nextDate = dateEnv.add(
      dateEnv.startOf(currentDate, currentDateProfile.currentRangeUnit),
      // important for start-of-month
      currentDateProfile.dateIncrement
    );
    return this.build(nextDate, nowDate, 1, forceToValid);
  }
  // Builds a structure holding dates/ranges for rendering around the given date.
  // Optional direction param indicates whether the date is being incremented/decremented
  // from its previous value. decremented = -1, incremented = 1 (default).
  build(currentDate, nowDate, direction, forceToValid = true) {
    let { props } = this;
    let validRange;
    let currentInfo;
    let isRangeAllDay;
    let renderRange;
    let activeRange;
    let isValid;
    validRange = this.buildValidRange(nowDate);
    validRange = this.trimHiddenDays(validRange);
    if (forceToValid) {
      currentDate = constrainMarkerToRange(currentDate, validRange);
    }
    currentInfo = this.buildCurrentRangeInfo(currentDate, direction);
    isRangeAllDay = /^(year|month|week|day)$/.test(currentInfo.unit);
    renderRange = this.buildRenderRange(this.trimHiddenDays(currentInfo.range), currentInfo.unit, isRangeAllDay);
    renderRange = this.trimHiddenDays(renderRange);
    activeRange = renderRange;
    if (!props.showNonCurrentDates) {
      activeRange = intersectRanges(activeRange, currentInfo.range);
    }
    activeRange = this.adjustActiveRange(activeRange);
    activeRange = intersectRanges(activeRange, validRange);
    isValid = rangesIntersect(currentInfo.range, validRange);
    if (!rangeContainsMarker(renderRange, currentDate)) {
      currentDate = renderRange.start;
    }
    return {
      currentDate,
      // constraint for where prev/next operations can go and where events can be dragged/resized to.
      // an object with optional start and end properties.
      validRange,
      // range the view is formally responsible for.
      // for example, a month view might have 1st-31st, excluding padded dates
      currentRange: currentInfo.range,
      // name of largest unit being displayed, like "month" or "week"
      currentRangeUnit: currentInfo.unit,
      isRangeAllDay,
      // dates that display events and accept drag-n-drop
      // will be `null` if no dates accept events
      activeRange,
      // date range with a rendered skeleton
      // includes not-active days that need some sort of DOM
      renderRange,
      // Duration object that denotes the first visible time of any given day
      slotMinTime: props.slotMinTime,
      // Duration object that denotes the exclusive visible end time of any given day
      slotMaxTime: props.slotMaxTime,
      isValid,
      // how far the current date will move for a prev/next operation
      dateIncrement: this.buildDateIncrement(currentInfo.duration)
      // pass a fallback (might be null) ^
    };
  }
  // Builds an object with optional start/end properties.
  // Indicates the minimum/maximum dates to display.
  // not responsible for trimming hidden days.
  buildValidRange(nowDate) {
    let input = this.props.validRangeInput;
    let simpleInput = typeof input === "function" ? input.call(this.props.calendarApi, this.props.dateEnv.toDate(nowDate)) : input;
    return this.refineRange(simpleInput) || { start: null, end: null };
  }
  // Builds a structure with info about the "current" range, the range that is
  // highlighted as being the current month for example.
  // See build() for a description of `direction`.
  // Guaranteed to have `range` and `unit` properties. `duration` is optional.
  buildCurrentRangeInfo(date, direction) {
    let { props } = this;
    let duration = null;
    let unit = null;
    let range = null;
    let dayCount;
    if (props.duration) {
      duration = props.duration;
      unit = props.durationUnit;
      range = this.buildRangeFromDuration(date, direction, duration, unit);
    } else if (dayCount = this.props.dayCount) {
      unit = "day";
      range = this.buildRangeFromDayCount(date, direction, dayCount);
    } else if (range = this.buildCustomVisibleRange(date)) {
      unit = props.dateEnv.greatestWholeUnit(range.start, range.end).unit;
    } else {
      duration = this.getFallbackDuration();
      unit = greatestDurationDenominator(duration).unit;
      range = this.buildRangeFromDuration(date, direction, duration, unit);
    }
    return { duration, unit, range };
  }
  getFallbackDuration() {
    return createDuration({ day: 1 });
  }
  // Returns a new activeRange to have time values (un-ambiguate)
  // slotMinTime or slotMaxTime causes the range to expand.
  adjustActiveRange(range) {
    let { dateEnv, usesMinMaxTime, slotMinTime, slotMaxTime } = this.props;
    let { start, end } = range;
    if (usesMinMaxTime) {
      if (asRoughDays(slotMinTime) < 0) {
        start = startOfDay(start);
        start = dateEnv.add(start, slotMinTime);
      }
      if (asRoughDays(slotMaxTime) > 1) {
        end = startOfDay(end);
        end = addDays(end, -1);
        end = dateEnv.add(end, slotMaxTime);
      }
    }
    return { start, end };
  }
  // Builds the "current" range when it is specified as an explicit duration.
  // `unit` is the already-computed greatestDurationDenominator unit of duration.
  buildRangeFromDuration(date, direction, duration, unit) {
    let { dateEnv, dateAlignment } = this.props;
    let start;
    let end;
    let res;
    if (!dateAlignment) {
      let { dateIncrement } = this.props;
      if (dateIncrement) {
        if (asRoughMs(dateIncrement) < asRoughMs(duration)) {
          dateAlignment = greatestDurationDenominator(dateIncrement).unit;
        } else {
          dateAlignment = unit;
        }
      } else {
        dateAlignment = unit;
      }
    }
    if (asRoughDays(duration) <= 1) {
      if (this.isHiddenDay(start)) {
        start = this.skipHiddenDays(start, direction);
        start = startOfDay(start);
      }
    }
    function computeRes() {
      start = dateEnv.startOf(date, dateAlignment);
      end = dateEnv.add(start, duration);
      res = { start, end };
    }
    computeRes();
    if (!this.trimHiddenDays(res)) {
      date = this.skipHiddenDays(date, direction);
      computeRes();
    }
    return res;
  }
  // Builds the "current" range when a dayCount is specified.
  buildRangeFromDayCount(date, direction, dayCount) {
    let { dateEnv, dateAlignment } = this.props;
    let runningCount = 0;
    let start = date;
    let end;
    if (dateAlignment) {
      start = dateEnv.startOf(start, dateAlignment);
    }
    start = startOfDay(start);
    start = this.skipHiddenDays(start, direction);
    end = start;
    do {
      end = addDays(end, 1);
      if (!this.isHiddenDay(end)) {
        runningCount += 1;
      }
    } while (runningCount < dayCount);
    return { start, end };
  }
  // Builds a normalized range object for the "visible" range,
  // which is a way to define the currentRange and activeRange at the same time.
  buildCustomVisibleRange(date) {
    let { props } = this;
    let input = props.visibleRangeInput;
    let simpleInput = typeof input === "function" ? input.call(props.calendarApi, props.dateEnv.toDate(date)) : input;
    let range = this.refineRange(simpleInput);
    if (range && (range.start == null || range.end == null)) {
      return null;
    }
    return range;
  }
  // Computes the range that will represent the element/cells for *rendering*,
  // but which may have voided days/times.
  // not responsible for trimming hidden days.
  buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay) {
    return currentRange;
  }
  // Compute the duration value that should be added/substracted to the current date
  // when a prev/next operation happens.
  buildDateIncrement(fallback) {
    let { dateIncrement } = this.props;
    let customAlignment;
    if (dateIncrement) {
      return dateIncrement;
    }
    if (customAlignment = this.props.dateAlignment) {
      return createDuration(1, customAlignment);
    }
    if (fallback) {
      return fallback;
    }
    return createDuration({ days: 1 });
  }
  refineRange(rangeInput) {
    if (rangeInput) {
      let range = parseRange(rangeInput, this.props.dateEnv);
      if (range) {
        range = computeVisibleDayRange(range);
      }
      return range;
    }
    return null;
  }
  /* Hidden Days
  ------------------------------------------------------------------------------------------------------------------*/
  // Initializes internal variables related to calculating hidden days-of-week
  initHiddenDays() {
    let hiddenDays = this.props.hiddenDays || [];
    let isHiddenDayHash = [];
    let dayCnt = 0;
    let i2;
    if (this.props.weekends === false) {
      hiddenDays = hiddenDays.concat([0, 6]);
    }
    for (i2 = 0; i2 < 7; i2 += 1) {
      if (!(isHiddenDayHash[i2] = hiddenDays.indexOf(i2) !== -1)) {
        dayCnt += 1;
      }
    }
    if (!dayCnt) {
      throw new Error("invalid hiddenDays");
    }
    this.isHiddenDayHash = isHiddenDayHash;
  }
  // Remove days from the beginning and end of the range that are computed as hidden.
  // If the whole range is trimmed off, returns null
  trimHiddenDays(range) {
    let { start, end } = range;
    if (start) {
      start = this.skipHiddenDays(start);
    }
    if (end) {
      end = this.skipHiddenDays(end, -1, true);
    }
    if (start == null || end == null || start < end) {
      return { start, end };
    }
    return null;
  }
  // Is the current day hidden?
  // `day` is a day-of-week index (0-6), or a Date (used for UTC)
  isHiddenDay(day) {
    if (day instanceof Date) {
      day = day.getUTCDay();
    }
    return this.isHiddenDayHash[day];
  }
  // Incrementing the current day until it is no longer a hidden day, returning a copy.
  // DOES NOT CONSIDER validRange!
  // If the initial value of `date` is not a hidden day, don't do anything.
  // Pass `isExclusive` as `true` if you are dealing with an end date.
  // `inc` defaults to `1` (increment one day forward each time)
  skipHiddenDays(date, inc = 1, isExclusive = false) {
    while (this.isHiddenDayHash[(date.getUTCDay() + (isExclusive ? inc : 0) + 7) % 7]) {
      date = addDays(date, inc);
    }
    return date;
  }
};
function computeMajorUnit(dateProfile, dateEnv) {
  const { currentRange } = dateProfile;
  if (dateProfile.currentRangeUnit === "year") {
    if (dateEnv.diffWholeYears(currentRange.start, currentRange.end) > 1) {
      return "year";
    } else {
      return "month";
    }
  } else if (dateProfile.currentRangeUnit === "month") {
    if (dateEnv.diffWholeMonths(currentRange.start, currentRange.end) > 1) {
      return "month";
    }
  } else if (dateProfile.currentRangeUnit === "week") {
    if (diffWholeWeeks(currentRange.start, currentRange.end) > 1) {
      return "week";
    }
  } else if (dateProfile.currentRangeUnit === "day") {
    if (diffWholeDays(currentRange.start, currentRange.end) > 1) {
      return "day";
    }
  }
}
function isMajorUnit(dateMarker, majorUnit, dateEnv) {
  const isStartOfDay = dateMarker.valueOf() === startOfDay(dateMarker).valueOf();
  if (isStartOfDay) {
    if (majorUnit === "year") {
      return !dateEnv.getMonth(dateMarker) && dateEnv.getDay(dateMarker) === 1;
    } else if (majorUnit === "month") {
      return dateEnv.getDay(dateMarker) === 1;
    } else if (majorUnit === "week") {
      return dateMarker.getUTCDay() === dateEnv.weekDow;
    } else if (majorUnit === "day") {
      return true;
    }
  }
  return false;
}

// node_modules/fullcalendar/chunks/20c8a1fa.js
var Slicer = class {
  constructor() {
    this.sliceBusinessHours = memoize(this._sliceBusinessHours);
    this.sliceDateSelection = memoize(this._sliceDateSpan);
    this.sliceEventStore = memoize(this._sliceEventStore);
    this.sliceEventDrag = memoize(this._sliceInteraction);
    this.sliceEventResize = memoize(this._sliceInteraction);
    this.forceDayIfListItem = false;
  }
  intersectDateSpan(dateSpan, activeRange, ...extraArgs) {
    const activeDateSpanRange = intersectRanges(dateSpan.range, activeRange);
    if (activeDateSpanRange) {
      const slicedDateSpan = __spreadProps(__spreadValues({}, dateSpan), { range: activeDateSpanRange });
      if (activeDateSpanRange.start.valueOf() !== dateSpan.range.start.valueOf()) {
        delete slicedDateSpan.instantStartMs;
      }
      if (activeDateSpanRange.end.valueOf() !== dateSpan.range.end.valueOf()) {
        delete slicedDateSpan.instantEndMs;
      }
      return slicedDateSpan;
    }
    return null;
  }
  sliceDateSpan(dateSpan, ...extraArgs) {
    return this.sliceRange(dateSpan.range, ...extraArgs);
  }
  sliceProps(props, dateProfile, nextDayThreshold, context, ...extraArgs) {
    let { eventUiBases } = props;
    let eventSegs = this.sliceEventStore(props.eventStore, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs);
    return {
      dateSelectionSegs: this.sliceDateSelection(props.dateSelection, dateProfile, nextDayThreshold, eventUiBases, context, ...extraArgs),
      businessHourSegs: this.sliceBusinessHours(props.businessHours, dateProfile, nextDayThreshold, context, ...extraArgs),
      fgEventSegs: eventSegs.fg,
      bgEventSegs: eventSegs.bg,
      eventDrag: this.sliceEventDrag(props.eventDrag, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs),
      eventResize: this.sliceEventResize(props.eventResize, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs),
      eventSelection: props.eventSelection
    };
  }
  sliceNowDate(date, dateProfile, nextDayThreshold, context, ...extraArgs) {
    return this._sliceDateSpan(
      { range: { start: date, end: addMs(date, 1) }, allDay: false },
      // add 1 ms, protect against null range
      dateProfile,
      nextDayThreshold,
      {},
      context,
      ...extraArgs
    );
  }
  _sliceBusinessHours(businessHours, dateProfile, nextDayThreshold, context, ...extraArgs) {
    if (!businessHours) {
      return [];
    }
    return this._sliceEventStore(expandRecurring(businessHours, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), context), {}, dateProfile, nextDayThreshold, ...extraArgs).bg;
  }
  _sliceEventStore(eventStore, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs) {
    if (eventStore) {
      let rangeRes = sliceEventStore(eventStore, eventUiBases, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), nextDayThreshold);
      return {
        bg: this.sliceEventRanges(rangeRes.bg, extraArgs),
        fg: this.sliceEventRanges(rangeRes.fg, extraArgs)
      };
    }
    return { bg: [], fg: [] };
  }
  _sliceInteraction(interaction, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs) {
    if (!interaction) {
      return null;
    }
    let rangeRes = sliceEventStore(interaction.mutatedEvents, eventUiBases, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), nextDayThreshold);
    return {
      segs: this.sliceEventRanges(rangeRes.fg, extraArgs),
      affectedInstances: interaction.affectedEvents.instances,
      isEvent: interaction.isEvent
    };
  }
  _sliceDateSpan(dateSpan, dateProfile, nextDayThreshold, eventUiBases, context, ...extraArgs) {
    if (!dateSpan) {
      return [];
    }
    let activeRange = computeActiveRange(dateProfile, Boolean(nextDayThreshold));
    let slicedDateSpan = this.intersectDateSpan(dateSpan, activeRange, ...extraArgs);
    if (slicedDateSpan) {
      dateSpan = slicedDateSpan;
      let eventRange = fabricateEventRange(dateSpan, eventUiBases, context);
      let segs = this.sliceDateSpan(dateSpan, ...extraArgs);
      for (let seg of segs) {
        seg.eventRange = eventRange;
      }
      return segs;
    }
    return [];
  }
  /*
  "complete" seg means it has component and eventRange
  */
  sliceEventRanges(eventRanges, extraArgs) {
    let segs = [];
    for (let eventRange of eventRanges) {
      segs.push(...this.sliceEventRange(eventRange, extraArgs));
    }
    return segs;
  }
  /*
  "complete" seg means it has component and eventRange
  */
  sliceEventRange(eventRange, extraArgs) {
    let dateRange = eventRange.range;
    if (this.forceDayIfListItem && eventRange.ui.display === "list-item") {
      dateRange = {
        start: dateRange.start,
        end: addDays(dateRange.start, 1)
      };
    }
    let segs = this.sliceRange(dateRange, ...extraArgs);
    for (let seg of segs) {
      seg.eventRange = eventRange;
      seg.isStart = eventRange.isStart && seg.isStart;
      seg.isEnd = eventRange.isEnd && seg.isEnd;
    }
    return segs;
  }
};
function computeActiveRange(dateProfile, isComponentAllDay) {
  let range = dateProfile.activeRange;
  if (isComponentAllDay) {
    return range;
  }
  return {
    start: addMs(range.start, dateProfile.slotMinTime.milliseconds),
    end: addMs(range.end, dateProfile.slotMaxTime.milliseconds - 864e5)
    // 864e5 = ms in a day
  };
}
var DayTableModel = class {
  constructor(daySeries, breakOnWeeks, dateEnv, majorUnit = "", activeRange) {
    this.daySeries = daySeries;
    this.dateEnv = dateEnv;
    this.majorUnit = majorUnit;
    this.activeRange = activeRange;
    let { dates } = daySeries;
    let daysPerRow;
    let firstDay;
    let rowCount;
    if (breakOnWeeks) {
      firstDay = dates[0].getUTCDay();
      for (daysPerRow = 1; daysPerRow < dates.length; daysPerRow += 1) {
        if (dates[daysPerRow].getUTCDay() === firstDay) {
          break;
        }
      }
      rowCount = Math.ceil(dates.length / daysPerRow);
    } else {
      rowCount = 1;
      daysPerRow = dates.length;
    }
    this.rowCount = rowCount;
    this.colCount = daysPerRow;
    this.cellRows = this.buildCells();
    this.headerDates = this.buildHeaderDates();
  }
  buildCells() {
    let rows = [];
    for (let row = 0; row < this.rowCount; row += 1) {
      let cells = [];
      for (let col = 0; col < this.colCount; col += 1) {
        cells.push(this.buildCell(row, col));
      }
      rows.push(cells);
    }
    return rows;
  }
  buildCell(row, col) {
    let date = this.daySeries.dates[row * this.colCount + col];
    return {
      key: date.toISOString(),
      date,
      isMajor: this.cellIsMajor(date),
      isDisabled: this.activeRange === null || this.activeRange !== void 0 && !rangeContainsMarker(this.activeRange, date)
    };
  }
  cellIsMajor(dateMarker) {
    return this.majorUnit ? isMajorUnit(dateMarker, this.majorUnit, this.dateEnv) : false;
  }
  buildHeaderDates() {
    let dates = [];
    for (let col = 0; col < this.colCount; col += 1) {
      dates.push(this.cellRows[0][col].date);
    }
    return dates;
  }
};
function buildDayGridRanges(seriesRange, daysPerRow) {
  let ranges = [];
  if (seriesRange) {
    const { start, end } = seriesRange;
    let index = start;
    while (index < end) {
      let row = Math.floor(index / daysPerRow);
      let nextIndex = Math.min((row + 1) * daysPerRow, end);
      ranges.push({
        row,
        start: index % daysPerRow,
        end: (nextIndex - 1) % daysPerRow + 1,
        isStart: seriesRange.isStart && index === start,
        isEnd: seriesRange.isEnd && nextIndex === end
      });
      index = nextIndex;
    }
  }
  return ranges;
}
var DayTableSlicer = class extends Slicer {
  constructor() {
    super(...arguments);
    this.forceDayIfListItem = true;
  }
  sliceRange(dateRange, dayTableModel) {
    return buildDayGridRanges(dayTableModel.daySeries.sliceRange(dateRange), dayTableModel.colCount);
  }
};
var DaySeriesSlicer = class extends Slicer {
  constructor() {
    super(...arguments);
    this.forceDayIfListItem = true;
  }
  sliceRange(dateRange, daySeries) {
    return buildDayGridRanges(daySeries.sliceRange(dateRange), daySeries.cnt);
  }
};
var firstSunday = /* @__PURE__ */ new Date(2592e5);
function buildDateRowConfigs(dates, datesRepDistinctDays, dateProfile, todayRange, dayHeaderFormat, context) {
  const rowConfig = buildDateRowConfig(dates, datesRepDistinctDays, dateProfile, todayRange, dayHeaderFormat, context);
  const majorUnit = computeMajorUnit(dateProfile, context.dateEnv);
  if (datesRepDistinctDays && majorUnit !== "day") {
    for (const dataConfig of rowConfig.dataConfigs) {
      if (isMajorUnit(dataConfig.dateMarker, majorUnit, context.dateEnv)) {
        dataConfig.renderProps.isMajor = true;
      }
    }
  }
  return [rowConfig];
}
function buildDateRowConfig(dateMarkers, datesRepDistinctDays, dateProfile, todayRange, dayHeaderFormat, context, colSpan, isMajorMod, totalDateCnt) {
  return {
    isDateRow: true,
    renderConfig: buildDateRenderConfig(dayHeaderFormat, datesRepDistinctDays, context),
    dataConfigs: buildDateDataConfigs(dateMarkers, datesRepDistinctDays, dateProfile, todayRange, dayHeaderFormat, context, colSpan, void 0, void 0, void 0, void 0, isMajorMod, totalDateCnt)
  };
}
function buildDateRenderConfig(dayHeaderFormat, datesRepDistinctDays, context) {
  const { options } = context;
  return {
    generatorName: "dayHeaderContent",
    customGenerator: options.dayHeaderContent,
    classNameGenerator: options.dayHeaderClass,
    innerClassNameGenerator: options.dayHeaderInnerClass,
    didMount: options.dayHeaderDidMount,
    willUnmount: options.dayHeaderWillUnmount,
    align: options.dayHeaderAlign,
    sticky: options._dayHeaderSticky,
    dayHeaderFormat,
    datesRepDistinctDays
  };
}
var dowDates = [];
for (let dow = 0; dow < 7; dow++) {
  dowDates.push(addDays(/* @__PURE__ */ new Date(2592e5), dow));
}
function buildDateDataConfigs(dateMarkers, datesRepDistinctDays, dateProfile, todayRange, dayHeaderFormat, context, colSpan = 1, keyPrefix = "", extraRenderProps = {}, extraAttrs = {}, className = "", isMajorMod, totalDateCnt = dateMarkers.length) {
  const { dateEnv, viewApi, options } = context;
  return datesRepDistinctDays ? dateMarkers.map((dateMarker, i2) => {
    const dateMeta = getDateMeta(dateMarker, dateEnv, dateProfile, todayRange);
    const isMajor = isMajorMod != null && !(i2 % isMajorMod);
    const hasNavLink = options.navLinks && !dateMeta.isDisabled && totalDateCnt > 1;
    const renderProps = __spreadProps(__spreadValues(__spreadValues({}, dateMeta), extraRenderProps), {
      isMajor,
      isSticky: false,
      // HACK. gets overridden
      inPopover: false,
      hasNavLink,
      view: viewApi
    });
    const fullDateStr = buildDateStr(context, dateMarker);
    return {
      key: keyPrefix + dateMarker.toUTCString(),
      dateMarker,
      renderProps,
      attrs: __spreadValues(__spreadProps(__spreadValues({}, dateMeta.isToday ? { "aria-current": "date" } : {}), {
        // TODO: assign undefined for nonexistent
        "data-date": formatDayString(dateMarker)
      }), extraAttrs),
      // navlink is already labeled. otherwise, a11yText read instead
      innerAttrs: hasNavLink ? buildNavLinkAttrs(
        context,
        dateMarker,
        void 0,
        fullDateStr,
        /* isTabbable = */
        true,
        /* omitHint = */
        true
      ) : void 0,
      a11yText: hasNavLink ? void 0 : fullDateStr,
      colSpan,
      hasNavLink,
      className
    };
  }) : dateMarkers.map((dateMarker, i2) => {
    const dow = dateMarker.getUTCDay();
    const normDate = addDays(firstSunday, dow);
    const dateMeta = {
      date: dateEnv.toDate(dateMarker),
      dow,
      isDisabled: false,
      isFuture: false,
      isPast: false,
      isToday: false,
      isOther: false
    };
    const isMajor = isMajorMod != null && !(i2 % isMajorMod);
    const renderProps = __spreadValues(__spreadProps(__spreadValues({}, dateMeta), {
      date: dowDates[dow],
      isMajor,
      isSticky: false,
      // HACK. gets overridden
      inPopover: false,
      hasNavLink: false,
      view: viewApi
    }), extraRenderProps);
    const fullWeekDayStr = joinDateTimeFormatParts(dateEnv.formatToParts(normDate, WEEKDAY_ONLY_FORMAT));
    return {
      key: keyPrefix + String(dow),
      dateMarker,
      renderProps,
      attrs: extraAttrs,
      // NOT a navlink
      a11yText: fullWeekDayStr,
      colSpan,
      className
    };
  });
}
var RefMap = class {
  constructor(masterCallback, ignoreDeletes = false) {
    this.masterCallback = masterCallback;
    this.ignoreDeletes = ignoreDeletes;
    this.rev = "";
    this.current = /* @__PURE__ */ new Map();
    this.callbacks = /* @__PURE__ */ new Map();
    this.handleValue = (val, key) => {
      let { current, callbacks } = this;
      let priorExists = current.has(key);
      let priorVal = priorExists ? current.get(key) : null;
      let anyChange = false;
      if (val === null) {
        if (priorExists && !this.ignoreDeletes) {
          current.delete(key);
          callbacks.delete(key);
          anyChange = true;
        }
      } else {
        anyChange = priorVal !== val;
        current.set(key, val);
      }
      if (anyChange) {
        this.rev = guid();
        if (this.masterCallback) {
          this.masterCallback(val, key, priorVal);
        }
      }
    };
  }
  createRef(key) {
    let refCallback = this.callbacks.get(key);
    if (!refCallback) {
      refCallback = (val) => {
        this.handleValue(val, key);
      };
      this.callbacks.set(key, refCallback);
    }
    return refCallback;
  }
};
var Ruler = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.elRef = M();
  }
  render() {
    return u("div", { ref: this.elRef });
  }
  componentDidMount() {
    this._isUnmounting = false;
    const { props } = this;
    const el = this.elRef.current;
    this.disconnectWidth = watchWidth(el, (width) => {
      if (this._isUnmounting)
        return;
      setRef(props.widthRef, width);
    });
  }
  componentWillUnmount() {
    this._isUnmounting = true;
    this.disconnectWidth();
    const { props } = this;
    if (props.widthRef) {
      setRef(props.widthRef, null);
    }
  }
};
function getDayGridSegKey(seg) {
  return `${seg.eventRange.instance.instanceId}:${seg.start}`;
}
function splitSegsByRow(segs, rowCount) {
  const byRow = [];
  for (let row = 0; row < rowCount; row++) {
    byRow[row] = [];
  }
  for (const seg of segs) {
    byRow[seg.row].push(seg);
  }
  return byRow;
}
function splitInteractionByRow(ui, rowCount) {
  const byRow = [];
  if (!ui) {
    for (let row = 0; row < rowCount; row++) {
      byRow[row] = null;
    }
  } else {
    for (let row = 0; row < rowCount; row++) {
      byRow[row] = {
        affectedInstances: ui.affectedInstances,
        isEvent: ui.isEvent,
        segs: []
      };
    }
    for (const seg of ui.segs) {
      byRow[seg.row].segs.push(seg);
    }
  }
  return byRow;
}
var BgEvent = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.buildPublicEvent = memoize((context, eventDef, eventInstance) => new EventImpl(context, eventDef, eventInstance));
    this.handleEl = (el) => {
      this.el = el;
      if (el) {
        setElEventRange(el, this.props.eventRange);
      }
    };
  }
  render() {
    const { props, context } = this;
    const { eventRange } = props;
    const { options } = context;
    const eventUi = eventRange.ui;
    const eventApi = this.buildPublicEvent(context, eventRange.def, eventRange.instance);
    const subcontentRenderProps = __spreadProps(__spreadValues({}, props.renderProps), {
      // first, so built-in props take precedence
      event: eventApi,
      timeText: "",
      // never display time
      isNarrow: props.isNarrow || false,
      isShort: props.isShort || false
    });
    const renderProps = __spreadProps(__spreadValues({}, props.renderProps), {
      // first, so built-in props take precedence
      event: eventApi,
      view: context.viewApi,
      timeText: "",
      // never display time
      color: eventUi.color || options.backgroundEventColor,
      contrastColor: eventUi.contrastColor,
      isDraggable: false,
      isStartResizable: false,
      isEndResizable: false,
      isMirror: false,
      isStart: props.isStart,
      isEnd: props.isEnd,
      isFirst: false,
      isLast: false,
      isPast: props.isPast,
      isFuture: props.isFuture,
      isToday: props.isToday,
      isSelected: false,
      isDragging: false,
      isResizing: false,
      isInteractive: false,
      level: 0,
      isNarrow: props.isNarrow || false,
      isShort: props.isShort || false,
      timeClass: "",
      // never display time
      titleClass: generateClassName(options.backgroundEventTitleClass, subcontentRenderProps),
      options: { eventOverlap: Boolean(options.eventOverlap) }
    });
    const outerClassName = joinClassNames(eventUi.className, classNames.fill, classNames.internalEvent, classNames.internalBgEvent, props.isVertical ? classNames.flexCol : classNames.flexRow);
    const innerClassName = joinClassNames(generateClassName(options.backgroundEventInnerClass, renderProps), classNames.liquid);
    return u(ContentContainer, { tag: "div", className: outerClassName, style: {
      "--fc-event-color": renderProps.color,
      "--fc-event-contrast-color": renderProps.contrastColor
    }, defaultGenerator: renderInnerContent2, elRef: this.handleEl, renderProps, generatorName: "backgroundEventContent", customGenerator: options.backgroundEventContent, classNameGenerator: options.backgroundEventClass, didMount: options.backgroundEventDidMount, willUnmount: options.backgroundEventWillUnmount, children: (InnerContent) => u(InnerContent, { tag: "div", className: innerClassName }) });
  }
  componentDidUpdate(prevProps) {
    if (this.el && this.props.eventRange !== prevProps.eventRange) {
      setElEventRange(this.el, this.props.eventRange);
    }
  }
};
function renderInnerContent2(props) {
  let { title } = props.event;
  return title && u("div", { className: props.titleClass, children: props.event.title });
}
function renderFill(fillType, options) {
  return u("div", { className: joinClassNames(fillType === "non-business" ? options.nonBusinessHoursClass : fillType === "highlight" ? options.highlightClass : void 0, classNames.fill) });
}
var COL_BORDER_WIDTH = 1;
var ROW_BORDER_WIDTH = 1;
var SPACE_FROM_VIEWPORT = 10;
var MorePopover = class extends DateComponent {
  constructor() {
    super(...arguments);
    this.getDateMeta = memoize(getDateMeta);
    this.closeRef = M();
    this.focusStartRef = M();
    this.focusEndRef = M();
    this.handleRootEl = (rootEl) => {
      this.rootEl = rootEl;
      if (rootEl) {
        this.context.registerInteractiveComponent(this, {
          el: rootEl,
          useEventCenter: false
        });
      } else {
        this.context.unregisterInteractiveComponent(this);
      }
    };
    this.handleDocumentMouseDown = (ev) => {
      const target = getEventTargetViaRoot(ev);
      if (!this.rootEl.contains(target)) {
        this.handleClose();
      }
    };
    this.handleDocumentKeyDown = (ev) => {
      if (ev.key === "Escape") {
        this.handleClose();
      }
    };
    this.handleClose = () => {
      let { onClose } = this.props;
      if (onClose) {
        onClose();
      }
    };
  }
  render() {
    let { props, context } = this;
    let { options, dateEnv, viewApi } = context;
    let { startDate, todayRange, dateProfile } = props;
    let dateMeta = this.getDateMeta(startDate, dateEnv, dateProfile, todayRange);
    let textParts = dateEnv.formatToParts(startDate, options.popoverFormat);
    let text = joinDateTimeFormatParts(textParts);
    const dayHeaderRenderProps = __spreadProps(__spreadValues(__spreadValues({}, props.renderProps), dateMeta), {
      isMajor: false,
      isNarrow: false,
      isSticky: false,
      inPopover: true,
      level: 0,
      hasNavLink: false,
      text,
      textParts,
      get weekdayText() {
        return findWeekdayText(textParts);
      },
      get dayNumberText() {
        return findDayNumberText(textParts);
      },
      view: viewApi
    });
    const dayCellRenderProps = __spreadProps(__spreadValues(__spreadValues({}, props.renderProps), dateMeta), {
      isMajor: false,
      isNarrow: false,
      inPopover: true,
      hasNavLink: false,
      get weekdayText() {
        return findWeekdayText(textParts);
      },
      get dayNumberText() {
        return findDayNumberText(textParts);
      },
      get monthText() {
        return findMonthText(textParts);
      },
      view: viewApi,
      text: "",
      textParts: [],
      options: { businessHours: Boolean(options.businessHours) }
    });
    const fullDateStr = formatDayString(startDate);
    const { dayHeaderAlign } = options;
    const align = typeof dayHeaderAlign === "function" ? dayHeaderAlign({ level: 0, inPopover: true, isNarrow: false }) : dayHeaderAlign;
    const isRtl = computeElIsRtl(props.alignEl);
    return $(u("div", {
      "data-date": fullDateStr,
      id: props.id,
      role: "dialog",
      "aria-labelledby": props.titleId,
      className: joinClassNames(options.popoverClass, classNames.flexCol, classNames.popoverZ, classNames.abs, classNames.borderBoxRoot, classNames.internalPopover),
      style: {
        // positioning is mutated directly in updateSize, HOWEVER, we don't want popover to start
        // low on screen because might cause unnecessary scrollbars
        top: 0,
        left: 0
      },
      // HACK because of portal
      dir: isRtl ? "rtl" : void 0,
      "data-color-scheme": options.colorScheme || void 0,
      ref: this.handleRootEl,
      children: [u("div", { tabIndex: 0, style: { outline: "none" }, ref: this.focusStartRef }), u("div", { className: joinClassNames(generateClassName(options.dayHeaderClass, dayHeaderRenderProps), classNames.flexCol, classNames.borderlessX, classNames.borderlessTop, align === "center" ? classNames.alignCenter : align === "end" ? classNames.alignEnd : classNames.alignStart), children: [u("div", { children: u(ContentContainer, { tag: "div", attrs: {
        id: props.titleId
        // NOTE: more-popover never has nav-links
      }, generatorName: "dayHeaderContent", renderProps: dayHeaderRenderProps, customGenerator: options.dayHeaderContent, defaultGenerator: renderText2, classNameGenerator: options.dayHeaderInnerClass, didMount: options.dayHeaderDidMount, willUnmount: options.dayHeaderWillUnmount }) }), u(ContentContainer, { tag: "button", attrs: __spreadValues({
        "aria-label": options.closeHint
      }, createAriaClickAttrs(this.handleClose)), elRef: this.closeRef, className: joinClassNames(options.popoverCloseClass, classNames.flexRow, classNames.cursorPointer), renderProps: {}, customGenerator: options.popoverCloseContent, generatorName: "popoverCloseContent" })] }), u("div", { className: joinClassNames(generateClassName(options.dayCellClass, dayCellRenderProps), classNames.flexCol, classNames.borderless), children: u("div", {
        role: "list",
        className: generateClassName(options.dayCellInnerClass, dayCellRenderProps),
        children: props.children
      }) }), u("div", { tabIndex: 0, style: { outline: "none" }, ref: this.focusEndRef })]
    }), getAppendableRoot(props.alignEl));
  }
  queryHit(isRtl, positionLeft, positionTop, elWidth, elHeight) {
    let { rootEl, props } = this;
    if (positionLeft >= 0 && positionLeft < elWidth && positionTop >= 0 && positionTop < elHeight) {
      return {
        dateProfile: props.dateProfile,
        dateSpan: __spreadValues({
          allDay: !props.forceTimed,
          range: {
            start: props.startDate,
            end: props.endDate
          }
        }, props.dateSpanProps),
        getDayEl: () => rootEl,
        rect: {
          left: 0,
          top: 0,
          right: elWidth,
          bottom: elHeight
        },
        layer: 1
        // important when comparing with hits from other components
      };
    }
    return null;
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleDocumentMouseDown);
    document.addEventListener("keydown", this.handleDocumentKeyDown);
    this.focusStartRef.current.addEventListener("focus", this.handleClose);
    this.focusEndRef.current.addEventListener("focus", this.handleClose);
    this.closeRef.current.focus({ preventScroll: true });
    this.updateSize();
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleDocumentMouseDown);
    document.removeEventListener("keydown", this.handleDocumentKeyDown);
    this.focusStartRef.current.removeEventListener("focus", this.handleClose);
    this.focusEndRef.current.removeEventListener("focus", this.handleClose);
  }
  updateSize() {
    let { alignEl, alignParentTop } = this.props;
    let { rootEl: popoverEl } = this;
    const isRtl = computeElIsRtl(alignEl);
    const alignmentRect = computeClippedClientRect(alignEl);
    if (alignmentRect) {
      let popoverDims = popoverEl.getBoundingClientRect();
      let popoverVPTop = alignParentTop ? alignEl.closest(alignParentTop).getBoundingClientRect().top - ROW_BORDER_WIDTH : alignmentRect.top;
      let popoverVPLeft = isRtl ? alignmentRect.right - popoverDims.width : alignmentRect.left;
      popoverVPTop = Math.max(popoverVPTop, SPACE_FROM_VIEWPORT);
      popoverVPLeft = Math.min(popoverVPLeft, document.documentElement.clientWidth - SPACE_FROM_VIEWPORT - popoverDims.width);
      popoverVPLeft = Math.max(popoverVPLeft, SPACE_FROM_VIEWPORT);
      const { offsetParent } = popoverEl;
      let top;
      let left;
      if (!offsetParent || offsetParent === document.body) {
        top = popoverVPTop + window.scrollY;
        left = popoverVPLeft + window.scrollX;
      } else {
        const offsetParentRect = offsetParent.getBoundingClientRect();
        top = popoverVPTop - offsetParentRect.top + offsetParent.scrollTop;
        left = popoverVPLeft - offsetParentRect.left + offsetParent.scrollLeft;
      }
      applyStyle(popoverEl, { top, left });
    }
  }
};
function renderText2(renderProps) {
  return renderProps.text;
}
function computeEarliestStart(segs) {
  return segs.reduce(pickEarliestStart).eventRange.range.start;
}
function computeLatestEnd(segs) {
  return segs.reduce(pickLatestEnd).eventRange.range.end;
}
function pickEarliestStart(r0, r1) {
  return r0.eventRange.range.start < r1.eventRange.range.start ? r0 : r1;
}
function pickLatestEnd(r0, r1) {
  return r0.eventRange.range.end > r1.eventRange.range.end ? r0 : r1;
}
var MoreLinkTrigger = class extends BaseComponent {
  render() {
    const { props, context } = this;
    const { options } = context;
    const renderProps = buildMoreLinkRenderProps(props.num, props.isNarrow, props.isMicro, props.display, props.renderProps, context);
    return u(ContentContainer, { tag: "div", elRef: props.elRef, className: joinClassNames(generateClassName(props.display === "row" ? options.rowMoreLinkClass : options.columnMoreLinkClass, renderProps), props.className, props.display === "row" ? classNames.flexRow : classNames.flexCol, classNames.internalMoreLink, classNames.cursorPointer), style: props.style, attrs: props.attrs, renderProps, generatorName: "moreLinkContent", customGenerator: options.moreLinkContent, defaultGenerator: renderMoreLinkText, classNameGenerator: options.moreLinkClass, didMount: props.didMount, willUnmount: props.willUnmount, children: (InnerContent) => u(InnerContent, { tag: "div", className: joinClassNames(generateClassName(options.moreLinkInnerClass, renderProps), generateClassName(props.display === "row" ? options.rowMoreLinkInnerClass : options.columnMoreLinkInnerClass, renderProps), props.display === "row" ? classNames.stickyS : classNames.stickyT) }) });
  }
};
var MoreLinkContainer = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.state = {
      isPopoverOpen: false
    };
    this.handleLinkEl = (linkEl) => {
      this.linkEl = linkEl;
      if (this.props.elRef) {
        setRef(this.props.elRef, linkEl);
      }
    };
    this.handleClick = (ev) => {
      let { props, context } = this;
      let { dateEnv, options } = context;
      let { moreLinkClick } = options;
      let date = computeRange(props).start;
      function buildPublicSeg(seg) {
        let { def, instance, range } = seg.eventRange;
        const start = buildRangeEdgeOutput(range.start, range.instantStartMs, dateEnv);
        const end = buildRangeEdgeOutput(range.end, range.instantEndMs, dateEnv);
        return {
          event: new EventImpl(context, def, instance),
          start: start.date,
          end: end.date,
          isStart: seg.isStart,
          isEnd: seg.isEnd
        };
      }
      if (typeof moreLinkClick === "function") {
        moreLinkClick = moreLinkClick({
          date: dateEnv.toDate(date),
          allDay: Boolean(props.allDayDate),
          allSegs: props.segs.map(buildPublicSeg),
          hiddenSegs: props.hiddenSegs.map(buildPublicSeg),
          jsEvent: ev,
          view: context.viewApi
        });
      }
      if (!moreLinkClick || moreLinkClick === "popover") {
        this.setState({ isPopoverOpen: true });
      } else if (typeof moreLinkClick === "string") {
        context.calendarApi.zoomTo(date, moreLinkClick);
      }
    };
    this.handlePopoverClose = () => {
      if (this.linkEl) {
        this.linkEl.focus();
      }
      this.setState({ isPopoverOpen: false });
    };
  }
  render() {
    const { props, state, context } = this;
    const { options, baseId } = context;
    const moreCnt = props.hiddenSegs.length;
    const range = computeRange(props);
    const popoverId = baseId + "popover-" + range.start.toISOString();
    const renderProps = buildMoreLinkRenderProps(moreCnt, props.isNarrow, props.isMicro, props.display, props.renderProps, context);
    const hint = formatWithOrdinals(options.moreLinkHint, [moreCnt], renderProps.longText);
    return u(S, { children: [Boolean(moreCnt) && u(MoreLinkTrigger, { num: moreCnt, display: props.display, isNarrow: props.isNarrow, isMicro: props.isMicro, renderProps: props.renderProps, elRef: this.handleLinkEl, className: props.className, style: props.style, attrs: __spreadProps(__spreadValues(__spreadValues({}, props.attrs), createAriaClickAttrs(this.handleClick)), {
      title: hint,
      "role": "button",
      "aria-haspopup": "dialog",
      "aria-expanded": state.isPopoverOpen,
      "aria-controls": state.isPopoverOpen ? popoverId : void 0
    }), didMount: options.moreLinkDidMount, willUnmount: options.moreLinkWillUnmount }), state.isPopoverOpen && u(MorePopover, { id: popoverId, titleId: popoverId + "-title", startDate: range.start, endDate: range.end, dateProfile: props.dateProfile, todayRange: props.todayRange, dateSpanProps: props.dateSpanProps, renderProps: props.renderProps, alignEl: props.alignElRef ? props.alignElRef.current : this.linkEl, alignParentTop: props.alignParentTop, forceTimed: props.forceTimed, onClose: this.handlePopoverClose, children: props.popoverContent() })] });
  }
};
function renderMoreLinkText(props) {
  return props.text;
}
function buildMoreLinkRenderProps(num, isNarrow, isMicro, display, extraRenderProps, context) {
  const { viewApi, options, calendarApi } = context;
  const numericText = `+${num}`;
  const longText = typeof options.moreLinkText === "function" ? options.moreLinkText.call(calendarApi, num) : `${numericText} ${options.moreLinkText}`;
  return __spreadProps(__spreadValues({}, extraRenderProps), {
    // first, so built-in props take precedence
    num,
    numericText,
    longText,
    text: isMicro || display === "column" ? numericText : longText,
    isNarrow,
    view: viewApi
  });
}
function computeRange(props) {
  if (props.allDayDate) {
    return {
      start: props.allDayDate,
      end: addDays(props.allDayDate, 1)
    };
  }
  return {
    start: computeEarliestStart(props.hiddenSegs),
    end: computeLatestEnd(props.hiddenSegs)
  };
}
var DEFAULT_TABLE_EVENT_TIME_FORMAT = createFormatter({
  hour: "numeric",
  minute: "2-digit",
  omitZeroMinute: true,
  meridiem: "narrow"
});
function hasListItemDisplay(range, eventRange) {
  let { display } = eventRange.ui;
  return display === "list-item" || display === "auto" && !eventRange.def.allDay && range.end - range.start === 1 && // single-day
  range.isStart && // "
  range.isEnd;
}
var DAY_GRID_NON_BUSINESS_Z_CLASS = classNames.z1;
var DAY_GRID_BG_EVENT_Z_CLASS = classNames.z2;
var DAY_GRID_HIGHLIGHT_Z_CLASS = classNames.z3;
var DAY_GRID_CELL_CONTENT_Z_CLASS = classNames.z4;
var DAY_GRID_EVENT_Z_CLASS = classNames.z5;
var DAY_GRID_INTERACTION_Z_CLASS = classNames.z1000;
var DayGridMoreLink = class extends BaseComponent {
  render() {
    let { props } = this;
    return u(MoreLinkContainer, { display: "row", className: joinClassNames(props.className, DAY_GRID_CELL_CONTENT_Z_CLASS), isNarrow: props.isNarrow, isMicro: props.isMicro, dateProfile: props.dateProfile, todayRange: props.todayRange, allDayDate: props.allDayDate, segs: props.segs, hiddenSegs: props.hiddenSegs, alignElRef: props.alignElRef, alignParentTop: props.alignParentTop, dateSpanProps: props.dateSpanProps, renderProps: props.renderProps, popoverContent: () => u(S, { children: props.segs.map((seg) => {
      let { eventRange } = seg;
      let { instanceId } = eventRange.instance;
      let isDragging = Boolean(props.eventDrag && props.eventDrag.affectedInstances[instanceId]);
      let isResizing = Boolean(props.eventResize && props.eventResize.affectedInstances[instanceId]);
      let isInvisible = isDragging || isResizing;
      return u("div", { role: "listitem", style: {
        visibility: isInvisible ? "hidden" : void 0
      }, children: u(StandardEvent, __spreadValues({ display: hasListItemDisplay(seg, eventRange) ? "list-item" : "row", eventRange, isStart: seg.isStart, isEnd: seg.isEnd, isDragging, isResizing, isMirror: false, isSelected: instanceId === props.eventSelection, defaultTimeFormat: DEFAULT_TABLE_EVENT_TIME_FORMAT, defaultDisplayEventEnd: false, renderProps: props.renderProps }, getEventRangeMeta(eventRange, props.todayRange))) }, instanceId);
    }) }) });
  }
};
var DayGridCell = class extends DateComponent {
  constructor() {
    super(...arguments);
    this.getDateMeta = memoize(getDayGridCellDateMeta);
    this.refineRenderProps = memoizeObjArg(refineRenderProps2);
    this.rootElRef = M();
    this.handleBodyEl = (bodyEl) => {
      if (this.disconnectBodyHeight) {
        this.disconnectBodyHeight();
        this.disconnectBodyHeight = void 0;
        this.headerHeight = void 0;
        setRef(this.props.headerHeightRef, null);
        setRef(this.props.mainHeightRef, null);
      }
      if (bodyEl && (this.props.headerHeightRef || this.props.mainHeightRef)) {
        this.disconnectBodyHeight = watchSize(bodyEl, (_bodyWidth, bodyHeight) => {
          if (this._isUnmounting) {
            return;
          }
          const { props } = this;
          const rootEl = this.rootElRef.current;
          if (!rootEl) {
            return;
          }
          const mainRect = bodyEl.getBoundingClientRect();
          const rootRect = rootEl.getBoundingClientRect();
          const headerHeight = mainRect.top - rootRect.top;
          if (!isDimsEqual(this.headerHeight, headerHeight)) {
            this.headerHeight = headerHeight;
            setRef(props.headerHeightRef, headerHeight);
          }
          setRef(props.mainHeightRef, bodyHeight);
        });
      }
    };
  }
  render() {
    let { props, context } = this;
    let { options, dateEnv } = context;
    const { tableMode } = props;
    const isMonthStart = props.showDayNumber && shouldDisplayMonthStart(props.date, props.dateProfile.currentRange, dateEnv);
    const dateMeta = this.getDateMeta(props.date, dateEnv, props.dateProfile, props.todayRange, props.isDisabled);
    const baseClassName = joinClassNames(classNames.borderlessTop, classNames.borderlessEnd, !props.borderStart && classNames.borderlessStart, !(tableMode && props.borderBottom) && classNames.borderlessBottom, !tableMode && props.width == null && classNames.liquid, !tableMode && classNames.flexCol, classNames.rel, classNames.noMargin, classNames.noPadding);
    const CellTag = tableMode ? "td" : "div";
    const cellStyle = tableMode ? void 0 : { width: props.width };
    const hasNavLink = options.navLinks;
    const renderProps = this.refineRenderProps({
      date: props.date,
      isMajor: props.isMajor,
      isNarrow: props.isNarrow,
      dateMeta,
      hasLabel: props.showDayNumber,
      hasMonthLabel: isMonthStart,
      hasNavLink,
      renderProps: props.renderProps,
      viewApi: context.viewApi,
      dateEnv: context.dateEnv,
      monthStartFormat: options.monthStartFormat,
      dayCellFormat: options.dayCellFormat,
      businessHours: Boolean(options.businessHours)
    });
    if (dateMeta.isDisabled) {
      return u(CellTag, { role: "cell", "aria-disabled": true, className: joinClassNames(generateClassName(options.dayCellClass, renderProps), props.className, baseClassName), style: cellStyle, children: props.fills });
    }
    const fullDateStr = buildDateStr(context, props.date);
    const hasA11yDateText = props.showDayNumber && !hasNavLink;
    return u(ContentContainer, {
      tag: CellTag,
      elRef: this.rootElRef,
      className: joinClassNames(props.className, baseClassName),
      attrs: __spreadProps(__spreadValues(__spreadProps(__spreadValues({}, props.attrs), {
        role: "cell"
      }), renderProps.isToday ? { "aria-current": "date" } : {}), {
        "data-date": formatDayString(props.date)
      }),
      style: cellStyle,
      renderProps,
      generatorName: "dayCellTopContent",
      customGenerator: options.dayCellTopContent,
      defaultGenerator: renderTopInner,
      classNameGenerator: options.dayCellClass,
      didMount: options.dayCellDidMount,
      willUnmount: options.dayCellWillUnmount,
      children: (InnerContent) => u(S, { children: [props.fills, u("div", {
        // otherwise VoiceOver finds an empty group when there's no day number (ex: TimeGrid all-day).
        // children (srOnly date, day number, custom content) stay readable
        role: "presentation",
        className: joinClassNames(
          classNames.rel,
          // puts it above bg-fills, which are positioned on TOP of this component :|
          DAY_GRID_CELL_CONTENT_Z_CLASS,
          generateClassName(options.dayCellTopClass, renderProps)
        ),
        children: [hasA11yDateText && // a nav link is already labeled
        u("div", { className: classNames.srOnly, children: fullDateStr }), props.showDayNumber && u(
          InnerContent,
          {
            tag: "div",
            attrs: hasNavLink ? buildNavLinkAttrs(context, props.date, void 0, fullDateStr) : { "aria-hidden": true },
            className: generateClassName(options.dayCellTopInnerClass, renderProps)
          }
        )]
      }), u("div", { className: joinClassNames(!tableMode && classNames.flexCol, !tableMode && (props.fgLiquidHeight ? classNames.liquid : classNames.grow), tableMode && classNames.printCellContentMinHeight), ref: this.handleBodyEl, children: [u("div", {
        // without events of its own, it's still sized (space reserved for multi-day events from
        // earlier days), and VoiceOver would find an empty group
        role: props.fgIsList ? "list" : "presentation",
        className: joinClassNames(
          classNames.rel,
          // origin for this cell's foreground event wrappers
          generateClassName(options.dayCellInnerClass, renderProps)
        ),
        style: { minHeight: props.fgHeight },
        children: props.fg
      }), u(DayGridMoreLink, { className: classNames.rel, allDayDate: props.date, segs: props.segs, hiddenSegs: props.hiddenSegs, alignElRef: this.rootElRef, alignParentTop: props.showDayNumber ? "[role=row]" : `.${classNames.internalView}`, dateSpanProps: props.dateSpanProps, renderProps: props.renderProps, dateProfile: props.dateProfile, eventSelection: props.eventSelection, eventDrag: props.eventDrag, eventResize: props.eventResize, todayRange: props.todayRange, isNarrow: props.isNarrow, isMicro: props.isMicro })] }), u("div", {
        role: "presentation",
        className: joinClassNames(
          classNames.rel,
          // puts it above bg-fills
          DAY_GRID_CELL_CONTENT_Z_CLASS,
          generateClassName(options.dayCellBottomClass, renderProps)
        )
      })] })
    });
  }
  componentDidMount() {
    this._isUnmounting = false;
  }
  componentWillUnmount() {
    this._isUnmounting = true;
  }
};
function getDayGridCellDateMeta(date, dateEnv, dateProfile, todayRange, isDisabled) {
  return __spreadProps(__spreadValues({}, getDateMeta(date, dateEnv, dateProfile, todayRange)), {
    isDisabled
  });
}
function renderTopInner(props) {
  return props.text || u(S, { children: " " });
}
function shouldDisplayMonthStart(date, currentRange, dateEnv) {
  const { start: currentStart, end: currentEnd } = currentRange;
  const currentEndIncl = addMs(currentEnd, -1);
  const currentFirstYear = dateEnv.getYear(currentStart);
  const currentFirstMonth = dateEnv.getMonth(currentStart);
  const currentLastYear = dateEnv.getYear(currentEndIncl);
  const currentLastMonth = dateEnv.getMonth(currentEndIncl);
  return !(currentFirstYear === currentLastYear && currentFirstMonth === currentLastMonth) && Boolean(
    // first date in current view?
    date.valueOf() === currentStart.valueOf() || // a month-start that's within the current range?
    dateEnv.getDay(date) === 1 && date.valueOf() < currentEnd.valueOf()
  );
}
function refineRenderProps2(raw) {
  let { date, dateEnv, hasLabel, hasMonthLabel, hasNavLink, businessHours } = raw;
  let textParts = [];
  let text = "";
  if (hasLabel) {
    textParts = dateEnv.formatToParts(date, hasMonthLabel ? raw.monthStartFormat : raw.dayCellFormat);
    text = joinDateTimeFormatParts(textParts);
  }
  return __spreadProps(__spreadValues(__spreadValues({}, raw.dateMeta), raw.renderProps), {
    text,
    textParts,
    isMajor: raw.isMajor,
    isNarrow: raw.isNarrow,
    inPopover: false,
    hasNavLink,
    get weekdayText() {
      return findWeekdayText(textParts);
    },
    get dayNumberText() {
      return findDayNumberText(textParts);
    },
    get monthText() {
      return findMonthText(textParts);
    },
    options: { businessHours },
    view: raw.viewApi
  });
}
var MeasuredHeightHarness = class extends C {
  constructor() {
    super(...arguments);
    this.rootElRef = M();
    this._isUnmounting = false;
  }
  render() {
    const { props } = this;
    return u("div", __spreadProps(__spreadValues({}, props.attrs), { className: props.className, style: props.style, ref: this.rootElRef, children: props.children }));
  }
  componentDidMount() {
    this._isUnmounting = false;
    const rootEl = this.rootElRef.current;
    this.disconnectHeight = watchHeight(rootEl, (height) => {
      if (this._isUnmounting)
        return;
      this.height = height;
      setRef(this.props.heightRef, height);
    });
  }
  /*
  A wrapper can gain or lose measurement responsibility without remounting,
  because a row switches placement routes (screen<->print, for example) while
  reusing the same keyed nodes. The size observer only fires on an actual size
  change, so hand the newly attached ref what was already observed, and release
  the detached one.
  */
  componentDidUpdate(prevProps) {
    const { heightRef } = this.props;
    if (prevProps.heightRef !== heightRef) {
      setRef(prevProps.heightRef, null);
      if (this.height != null) {
        setRef(heightRef, this.height);
      }
    }
  }
  componentWillUnmount() {
    this._isUnmounting = true;
    this.disconnectHeight?.();
    setRef(this.props.heightRef, null);
  }
};
function doSpansIntersect(a2, b) {
  return a2.start < b.end && b.start < a2.end;
}
function intersectSpans(a2, b) {
  const start = Math.max(a2.start, b.start);
  const end = Math.min(a2.end, b.end);
  return start < end ? { start, end } : null;
}
function getSpanLength(span) {
  return span.end - span.start;
}
function findIntersections(entries, span) {
  let index = findLowerBoundByStart(entries, span.start);
  if (index > 0) {
    index--;
  }
  const matches = [];
  for (; index < entries.length; index++) {
    const entry = entries[index];
    if (entry.start >= span.end) {
      break;
    }
    if (doSpansIntersect(entry, span)) {
      matches.push(entry);
    }
  }
  return matches;
}
function subtractCoveredSpans(span, covered) {
  const result = [];
  let cursor = span.start;
  for (const item of covered) {
    if (item.end <= cursor) {
      continue;
    }
    if (item.start >= span.end) {
      break;
    }
    if (item.start > cursor) {
      result.push({ start: cursor, end: Math.min(item.start, span.end) });
    }
    cursor = Math.max(cursor, item.end);
    if (cursor >= span.end) {
      break;
    }
  }
  if (cursor < span.end) {
    result.push({ start: cursor, end: span.end });
  }
  return result;
}
function addToUnion(spans, addition) {
  const result = [];
  let pending = __spreadValues({}, addition);
  let inserted = false;
  for (const span of spans) {
    if (span.end <= pending.start) {
      result.push(span);
    } else if (pending.end <= span.start) {
      if (!inserted) {
        result.push(pending);
        inserted = true;
      }
      result.push(span);
    } else {
      pending = {
        start: Math.min(pending.start, span.start),
        end: Math.max(pending.end, span.end)
      };
    }
  }
  if (!inserted) {
    result.push(pending);
  }
  spans.splice(0, spans.length, ...result);
}
function insertLaterally(entries, entry) {
  entries.splice(findLowerBoundByStart(entries, entry.start), 0, entry);
}
function findLowerBoundByStart(entries, start) {
  let low = 0;
  let high = entries.length;
  while (low < high) {
    const middle = low + high >>> 1;
    if (entries[middle].start < start) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }
  return low;
}
var GEOMETRY_TOLERANCE = 1e-6;
var DEFAULT_UNMEASURED_EVENT_THICKNESS = 20;
function buildLevelLimitedLayout(segs, eventOrderStrict, eventSlicing, maxLevels, moreLinkLevelTax, sliceHeights) {
  const { segLevels, excludedSegs } = buildSegLevels(segs, eventOrderStrict, maxLevels);
  const placement = placeExtraSlicesInLevels(convertSegLevelsToWholeSlices(segLevels), convertSegsToWholeSlices(excludedSegs), eventOrderStrict, eventSlicing, moreLinkLevelTax);
  const resolution = resolveLevelCoords(placement.sliceLevels, sliceHeights);
  return {
    renderSlices: flatArray(placement.sliceLevels),
    hiddenSlices: placement.hiddenSlices,
    sliceLevels: placement.sliceLevels,
    sliceCoords: resolution.sliceCoords,
    isSettled: resolution.isSettled
  };
}
function buildPixelLimitedLayout(segs, eventOrderStrict, eventSlicing, sliceHeights, canvasHeight, levelCapacity, moreLinkHeight) {
  const { segLevels, excludedSegs } = buildSegLevels(segs, eventOrderStrict, levelCapacity);
  const domWholeSliceLevels = convertSegLevelsToWholeSlices(segLevels);
  const domExcludedWholeSlices = convertSegsToWholeSlices(excludedSegs);
  const wholeResolution = resolveLevelCoords(domWholeSliceLevels, sliceHeights, canvasHeight);
  if (canvasHeight == null || moreLinkHeight == null) {
    return {
      renderSlices: flatArray(domWholeSliceLevels),
      hiddenSlices: domExcludedWholeSlices,
      sliceLevels: domWholeSliceLevels,
      sliceCoords: wholeResolution.sliceCoords,
      isSettled: wholeResolution.isSettled
    };
  }
  const excludedWholeSlices = wholeResolution.excludedSlices.concat(domExcludedWholeSlices);
  excludedWholeSlices.sort(compareByEventOrder);
  const placement = placeExtraSlicesInLevels(
    wholeResolution.placementSliceLevels,
    excludedWholeSlices,
    eventOrderStrict,
    eventSlicing,
    /* moreLinkLevelTax = */
    eventSlicing ? 1 : 0,
    /* requiresSlicing = */
    true,
    /* taxDeepestOccupiedLevel = */
    true
  );
  const sliceResolution = resolveLevelCoords(placement.sliceLevels, sliceHeights);
  const moreLinkEventMax = Math.max(0, canvasHeight - moreLinkHeight);
  const pixelPrunedSlices = prunePixelLimitedSliceLevels(placement.sliceLevels, placement.hiddenSlices, sliceResolution.sliceCoords, sliceHeights, canvasHeight, moreLinkEventMax);
  const renderSlices = flatArray(domWholeSliceLevels).concat(placement.addedSlices);
  const isSettled = wholeResolution.isSettled && sliceResolution.isSettled;
  return {
    renderSlices,
    hiddenSlices: pixelPrunedSlices.concat(placement.hiddenSlices),
    sliceLevels: placement.sliceLevels,
    sliceCoords: sliceResolution.sliceCoords,
    isSettled
  };
}
function buildSegLevels(segs, eventOrderStrict, maxLevels = Infinity) {
  const segLevels = [];
  const excludedSegs = [];
  for (const seg of segs) {
    const levelIndex = findPackedLevelIndex(segLevels, seg, eventOrderStrict);
    if (levelIndex >= maxLevels) {
      excludedSegs.push(seg);
    } else {
      while (segLevels.length <= levelIndex) {
        segLevels.push([]);
      }
      insertLaterally(segLevels[levelIndex], seg);
    }
  }
  return { segLevels, excludedSegs };
}
function findPackedLevelIndex(levels, span, orderStrict) {
  let levelIndex = 0;
  if (orderStrict) {
    for (let i2 = 0; i2 < levels.length; i2++) {
      if (findIntersections(levels[i2], span).length) {
        levelIndex = i2 + 1;
      }
    }
  } else {
    while (levelIndex < levels.length && findIntersections(levels[levelIndex], span).length) {
      levelIndex++;
    }
  }
  return levelIndex;
}
function convertSegLevelsToWholeSlices(segLevels) {
  return segLevels.map((level) => convertSegsToWholeSlices(level));
}
function convertSegsToWholeSlices(segs) {
  return segs.map(createWholeSlice);
}
function resolveLevelCoords(sliceLevels, sliceHeights, maxPixels = Infinity) {
  const placementSliceLevels = [];
  const sliceCoords = /* @__PURE__ */ new Map();
  let isSettled = true;
  const excludedSlices = [];
  for (let levelIndex = 0; levelIndex < sliceLevels.length; levelIndex++) {
    for (const slice of sliceLevels[levelIndex]) {
      const sliceHeight = sliceHeights.get(getSliceKey(slice));
      if (sliceHeight === void 0) {
        isSettled = false;
        continue;
      }
      const { bottom: levelCoord, levelIndex: packedLevelIndex } = computeLateralSpanPlacement(placementSliceLevels, slice, sliceCoords, sliceHeights);
      if (levelCoord + sliceHeight <= maxPixels + GEOMETRY_TOLERANCE) {
        while (placementSliceLevels.length <= packedLevelIndex) {
          placementSliceLevels.push([]);
        }
        insertLaterally(placementSliceLevels[packedLevelIndex], slice);
        sliceCoords.set(getSliceKey(slice), levelCoord);
      } else {
        excludedSlices.push(slice);
      }
    }
  }
  return { placementSliceLevels, sliceCoords, isSettled, excludedSlices };
}
function computeLateralSpanPlacement(sliceLevels, span, sliceCoords, sliceHeights) {
  let bottom = 0;
  let levelIndex = 0;
  for (let i2 = 0; i2 < sliceLevels.length; i2++) {
    const level = sliceLevels[i2];
    for (const slice of findIntersections(level, span)) {
      const key = getSliceKey(slice);
      const sliceTop = sliceCoords.get(key);
      const sliceHeight = sliceHeights.get(key);
      if (sliceTop !== void 0 && sliceHeight !== void 0) {
        bottom = Math.max(bottom, sliceTop + sliceHeight);
        levelIndex = i2 + 1;
      }
    }
  }
  return { bottom, levelIndex };
}
function recomputeVisibleCoords(sliceLevels, sliceHeights, sliceCoords) {
  const visibleLevels = sliceLevels.map((level) => level.filter((slice) => sliceCoords.has(getSliceKey(slice))));
  const freshCoords = resolveLevelCoords(visibleLevels, sliceHeights).sliceCoords;
  for (const [key, coord] of freshCoords) {
    sliceCoords.set(key, coord);
  }
}
function getSliceBottom(slice, sliceCoords, sliceHeights) {
  const key = getSliceKey(slice);
  const coord = sliceCoords.get(key);
  const height = sliceHeights.get(key);
  return coord === void 0 || height === void 0 ? void 0 : coord + height;
}
function prunePixelLimitedSliceLevels(sliceLevels, initialHiddenSlices, sliceCoords, sliceHeights, maxPixelHeight, moreLinkMaxPixelHeight) {
  const moreLinkGroups = [];
  const pixelPrunedSlices = [];
  const sliceHideQueue = [];
  let sliceHideIndex = 0;
  for (const hiddenSlice of initialHiddenSlices) {
    addHiddenSliceToGroups(moreLinkGroups, hiddenSlice);
  }
  enqueueViolators();
  while (sliceHideIndex < sliceHideQueue.length) {
    const slice = sliceHideQueue[sliceHideIndex++];
    const sliceBottom = getSliceBottom(slice, sliceCoords, sliceHeights);
    if (sliceBottom === void 0 || !violatesPixelBoundary(slice, sliceBottom)) {
      continue;
    }
    sliceCoords.delete(getSliceKey(slice));
    pixelPrunedSlices.push(slice);
    const newMoreLinkSpans = addHiddenSliceToGroups(moreLinkGroups, slice);
    recomputeVisibleCoords(sliceLevels, sliceHeights, sliceCoords);
    for (const newMoreLinkSpan of newMoreLinkSpans) {
      enqueueViolators(newMoreLinkSpan);
    }
  }
  return pixelPrunedSlices;
  function violatesPixelBoundary(slice, sliceBottom) {
    return sliceBottom > maxPixelHeight + GEOMETRY_TOLERANCE || sliceBottom > moreLinkMaxPixelHeight + GEOMETRY_TOLERANCE && findIntersections(moreLinkGroups, slice).length > 0;
  }
  function enqueueViolators(withinSpan) {
    for (const level of sliceLevels) {
      const candidates = withinSpan ? findIntersections(level, withinSpan) : level;
      for (const slice of candidates) {
        const sliceBottom = getSliceBottom(slice, sliceCoords, sliceHeights);
        if (sliceBottom !== void 0 && violatesPixelBoundary(slice, sliceBottom)) {
          sliceHideQueue.push(slice);
        }
      }
    }
  }
}
function placeExtraSlicesInLevels(sliceLevels, extraSlices, eventOrderStrict, eventSlicing, moreLinkLevelTax, requiresSlicing = false, taxDeepestOccupiedLevel = false) {
  const addedSliceSet = /* @__PURE__ */ new Set();
  const hiddenSlices = [];
  const moreLinkGroups = [];
  const moreLinkReservations = [];
  const placementState = {
    levels: sliceLevels,
    moreLinkReservations,
    eventOrderStrict
  };
  const work = [];
  pushFire(extraSlices, requiresSlicing);
  while (work.length) {
    const item = work.pop();
    if (item.type === "fire") {
      fire(item.slice, item.requiresSlicing);
    } else {
      fireMoreLink(item.span);
    }
  }
  return {
    sliceLevels,
    hiddenSlices,
    addedSlices: [...addedSliceSet]
  };
  function fire(slice, requiresSlicing2) {
    if (!requiresSlicing2) {
      const levelIndex = findInsertionLevel(slice, placementState);
      if (levelIndex !== null) {
        insertLaterally(sliceLevels[levelIndex], slice);
        addedSliceSet.add(slice);
        return;
      }
    }
    if (!eventSlicing) {
      hide(slice);
      return;
    }
    const plan = findBestSlicePlan(slice, placementState, requiresSlicing2);
    if (!plan) {
      hide(slice);
      return;
    }
    for (const visibleSlice of plan.slices) {
      insertLaterally(sliceLevels[plan.levelIndex], visibleSlice);
      addedSliceSet.add(visibleSlice);
    }
    for (const hiddenSlice of subtractSpansFromSlice(slice, plan.slices)) {
      hide(hiddenSlice);
    }
  }
  function hide(slice) {
    hiddenSlices.push(slice);
    const newMoreLinkSpans = addHiddenSliceToGroups(moreLinkGroups, slice);
    if (moreLinkLevelTax) {
      for (let i2 = newMoreLinkSpans.length - 1; i2 >= 0; i2--) {
        work.push({ type: "moreLink", span: newMoreLinkSpans[i2] });
      }
    }
  }
  function fireMoreLink(span) {
    if (!sliceLevels.length) {
      return;
    }
    let taxedLevelIndex = sliceLevels.length - 1;
    let victims = findIntersections(sliceLevels[taxedLevelIndex], span);
    if (taxDeepestOccupiedLevel) {
      while (!victims.length && taxedLevelIndex > 0) {
        taxedLevelIndex--;
        victims = findIntersections(sliceLevels[taxedLevelIndex], span);
      }
    }
    insertLaterally(moreLinkReservations, __spreadProps(__spreadValues({}, span), {
      levelIndex: taxedLevelIndex
    }));
    const taxedLevel = sliceLevels[taxedLevelIndex];
    for (const victim of victims) {
      taxedLevel.splice(taxedLevel.indexOf(victim), 1);
      addedSliceSet.delete(victim);
      if (eventSlicing) {
        hide(intersectSlice(victim, span));
        pushFire(subtractSpansFromSlice(victim, [span]), false);
      } else {
        hide(victim);
      }
    }
  }
  function pushFire(slices, requiresSlicing2) {
    for (let i2 = slices.length - 1; i2 >= 0; i2--) {
      work.push({ type: "fire", slice: slices[i2], requiresSlicing: requiresSlicing2 });
    }
  }
}
function findInsertionLevel(slice, state) {
  const fence = computeLevelFence(slice, state);
  for (let levelIndex = fence.min; levelIndex < fence.maxExclusive; levelIndex++) {
    if (!findIntersections(state.levels[levelIndex], slice).length) {
      return levelIndex;
    }
  }
  return null;
}
function computeLevelFence(slice, state) {
  const { levels } = state;
  let min = 0;
  let maxExclusive = levels.length;
  for (const reservation of findIntersections(state.moreLinkReservations, slice)) {
    maxExclusive = Math.min(maxExclusive, reservation.levelIndex);
  }
  if (state.eventOrderStrict) {
    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
      for (const other of findIntersections(levels[levelIndex], slice)) {
        if (other.sourceSeg.orderIndex < slice.sourceSeg.orderIndex) {
          min = Math.max(min, levelIndex + 1);
        } else if (other.sourceSeg.orderIndex > slice.sourceSeg.orderIndex) {
          maxExclusive = Math.min(maxExclusive, levelIndex);
        }
      }
    }
  }
  return { min, maxExclusive };
}
var MAX_SLICES_PER_PLAN = 3;
var EXTRA_SLICE_PENALTY = 0.15;
function findBestSlicePlan(slice, state, requiresSlicing) {
  let selected = null;
  const sourceLength = getSpanLength(slice);
  for (let levelIndex = 0; levelIndex < state.levels.length; levelIndex++) {
    const blockers = findIntersections(state.levels[levelIndex], slice);
    for (const reservation of state.moreLinkReservations) {
      if (levelIndex >= reservation.levelIndex) {
        addToUnion(blockers, reservation);
      }
    }
    const runs = subtractSpansFromSlice(slice, blockers).filter((run) => isWithinLevelFence(run, levelIndex, state)).sort((a2, b) => getSpanLength(b) - getSpanLength(a2) || a2.start - b.start);
    let visibleLength = 0;
    for (let sliceCount = 1; sliceCount <= Math.min(MAX_SLICES_PER_PLAN, runs.length); sliceCount++) {
      visibleLength += getSpanLength(runs[sliceCount - 1]);
      if (requiresSlicing && visibleLength >= sourceLength - GEOMETRY_TOLERANCE) {
        break;
      }
      const candidate = {
        levelIndex,
        slices: runs.slice(0, sliceCount),
        score: visibleLength / sourceLength - EXTRA_SLICE_PENALTY * (sliceCount - 1)
      };
      if (isBetterSlicePlan(candidate, selected)) {
        selected = candidate;
      }
    }
  }
  if (selected) {
    selected.slices.sort(compareByEventOrder);
  }
  return selected;
}
function isWithinLevelFence(slice, levelIndex, state) {
  const fence = computeLevelFence(slice, state);
  return levelIndex >= fence.min && levelIndex < fence.maxExclusive;
}
function isBetterSlicePlan(candidate, current) {
  if (!current || candidate.score > current.score) {
    return true;
  }
  if (candidate.score < current.score) {
    return false;
  }
  if (candidate.slices.length !== current.slices.length) {
    return candidate.slices.length < current.slices.length;
  }
  return candidate.levelIndex < current.levelIndex;
}
function groupLaterallyIntersecting(hiddenSlices) {
  const groups = [];
  for (const slice of hiddenSlices) {
    addHiddenSliceToGroups(groups, slice);
  }
  return finalizeHiddenGroups(groups);
}
function addHiddenSliceToGroups(groups, slice) {
  const newSpans = subtractCoveredSpans(slice, groups);
  const untouchedGroups = [];
  const mergedSlices = [slice];
  let start = slice.start;
  let end = slice.end;
  for (const group of groups) {
    if (intersectSpans(group, slice)) {
      mergedSlices.push(...group.hiddenSlices);
      start = Math.min(start, group.start);
      end = Math.max(end, group.end);
    } else {
      untouchedGroups.push(group);
    }
  }
  mergedSlices.sort(compareByEventOrder);
  insertLaterally(untouchedGroups, {
    start,
    end,
    hiddenSlices: mergedSlices
  });
  groups.splice(0, groups.length, ...untouchedGroups);
  return newSpans;
}
function finalizeHiddenGroups(groups) {
  return groups.map((group) => {
    const hiddenSlices = mergeAdjacentSlices(group.hiddenSlices);
    return {
      key: getSliceKey(hiddenSlices[0]),
      start: group.start,
      end: group.end,
      hiddenSlices
    };
  });
}
function getSliceKey(slice) {
  if (!isPartialSlice(slice)) {
    return slice.sourceSeg.key;
  }
  return `${slice.sourceSeg.key}:${slice.start}:slice`;
}
function isPartialSlice(slice) {
  return slice.start !== slice.sourceSeg.start || slice.end !== slice.sourceSeg.end;
}
function compareByEventOrder(a2, b) {
  return a2.sourceSeg.orderIndex - b.sourceSeg.orderIndex || a2.start - b.start || b.end - a2.end;
}
function sortByEventOrder(slices) {
  return [...slices].sort(compareByEventOrder);
}
function compareByAxisOrder(a2, b) {
  return a2.start - b.start || a2.sourceSeg.orderIndex - b.sourceSeg.orderIndex;
}
function sortByAxisOrder(items) {
  return [...items].sort(compareByAxisOrder);
}
function mergeAdjacentSlices(slices) {
  const merged = [];
  for (const slice of slices) {
    const previous = merged[merged.length - 1];
    if (previous && previous.sourceSeg === slice.sourceSeg) {
      merged[merged.length - 1] = createNarrowerSlice(createWholeSlice(previous.sourceSeg), previous.start, Math.max(previous.end, slice.end));
    } else {
      merged.push(slice);
    }
  }
  return merged;
}
function subtractSpansFromSlice(slice, covered) {
  return subtractCoveredSpans(slice, covered).map((span) => createNarrowerSlice(slice, span.start, span.end));
}
function intersectSlice(slice, barrier) {
  const intersection = intersectSpans(slice, barrier);
  return intersection ? createNarrowerSlice(slice, intersection.start, intersection.end) : null;
}
function createWholeSlice(sourceSeg) {
  return {
    sourceSeg,
    start: sourceSeg.start,
    end: sourceSeg.end,
    isStart: sourceSeg.isStart,
    isEnd: sourceSeg.isEnd
  };
}
function createNarrowerSlice(parent, start, end) {
  return {
    sourceSeg: parent.sourceSeg,
    start,
    end,
    isStart: parent.isStart && start === parent.start,
    isEnd: parent.isEnd && end === parent.end
  };
}
var DEFAULT_UNMEASURED_EVENT_AREA_HEIGHT = 150;
var DEFAULT_LEVEL_CAPACITY = estimateLevelCapacity(DEFAULT_UNMEASURED_EVENT_AREA_HEIGHT, DEFAULT_UNMEASURED_EVENT_THICKNESS);
function buildDayGridSegSources(eventOrderedSegs) {
  return eventOrderedSegs.map((seg, orderIndex) => __spreadProps(__spreadValues({}, seg), {
    key: getDayGridSegKey(seg),
    orderIndex
  }));
}
function buildDayGridLevelPlacements(eventOrderedSegs, maxLevels, moreLinkLevelTax, orderStrict, eventSlicing, columnCount, sliceHeights) {
  const sourceSegs = buildDayGridSegSources(eventOrderedSegs);
  const layout = buildLevelLimitedLayout(sourceSegs, orderStrict, eventSlicing, maxLevels, moreLinkLevelTax, sliceHeights);
  return buildDayGridPlacementLayout(sourceSegs, layout, sliceHeights, columnCount);
}
function buildDayGridPixelPlacements(eventOrderedSegs, orderStrict, eventSlicing, columnCount, canvasHeight, moreLinkHeight, levelCapacity, sliceHeights) {
  const sourceSegs = buildDayGridSegSources(eventOrderedSegs);
  const layout = buildPixelLimitedLayout(sourceSegs, orderStrict, eventSlicing, sliceHeights, canvasHeight, levelCapacity, moreLinkHeight);
  return buildDayGridPlacementLayout(sourceSegs, layout, sliceHeights, columnCount);
}
function buildDayGridPopoverSegs(eventOrderedSegs, hiddenSlices, column) {
  return {
    segs: flatMapArray(eventOrderedSegs, (source) => cutSegToColumn(source, column) ?? []),
    hiddenSegs: flatMapArray(hiddenSlices, (slice) => cutSegToColumn(slice.sourceSeg, column, slice) ?? [])
  };
}
function cutSegToColumn(source, column, intersectionSpan = source) {
  if (intersectionSpan.start >= column + 1 || column >= intersectionSpan.end)
    return null;
  const _a = source, { key, orderIndex } = _a, seg = __objRest(_a, ["key", "orderIndex"]);
  return __spreadProps(__spreadValues({}, seg), {
    start: column,
    end: column + 1,
    isStart: seg.isStart && source.start === column,
    isEnd: seg.isEnd && source.end - 1 === column
  });
}
function resolveDayGridPlacementMode(dayMaxEvents, dayMaxEventRows) {
  if (dayMaxEvents === true || dayMaxEventRows === true) {
    return "auto";
  }
  if (typeof dayMaxEvents === "number") {
    return "maxEvents";
  }
  if (typeof dayMaxEventRows === "number") {
    return "maxEventRows";
  }
  return "unlimited";
}
function computeDayGridDomCandidateMaxLevels(mode, dayMaxEvents, dayMaxEventRows, maxDomLevels) {
  switch (mode) {
    case "auto":
      return maxDomLevels;
    case "maxEvents":
      return dayMaxEvents;
    case "maxEventRows":
      return dayMaxEventRows;
    default:
      return Infinity;
  }
}
function computeDayGridMoreLinkLevelTax(mode) {
  return mode === "maxEventRows" ? 1 : 0;
}
function buildDayGridPlacementLayout(sourceSegs, layout, sliceHeights, columnCount) {
  const { hiddenSlices, renderSlices, sliceCoords } = layout;
  const eventOrderedHiddenSlices = sortByEventOrder(hiddenSlices);
  const slicesByStart = federateSlicesByStart(renderSlices, columnCount);
  const columns = Array.from({ length: columnCount }, (_2, column) => __spreadValues({
    // Freshly built per column by federateSlicesByStart; owned outright.
    renderSlices: slicesByStart[column],
    contentHeight: 0
  }, buildDayGridPopoverSegs(sourceSegs, eventOrderedHiddenSlices, column)));
  for (const slice of renderSlices) {
    const key = getSliceKey(slice);
    const sliceTop = sliceCoords.get(key);
    if (sliceTop === void 0) {
      continue;
    }
    const sliceBottom = sliceTop + sliceHeights.get(key);
    for (let column = slice.start; column < slice.end; column += 1) {
      columns[column].contentHeight = Math.max(columns[column].contentHeight, sliceBottom);
    }
  }
  return {
    columns,
    sliceCoords
  };
}
function federateSlicesByStart(renderSlices, columnCount) {
  const slicesByStart = Array.from({ length: columnCount }, () => []);
  for (const slice of renderSlices) {
    slicesByStart[slice.start].push(slice);
  }
  for (const slices of slicesByStart) {
    slices.sort(compareByEventOrder);
  }
  return slicesByStart;
}
function estimateLevelCapacity(eventAreaHeight, eventHeight) {
  return Math.max(1, Math.ceil(eventAreaHeight / eventHeight));
}
var DEFAULT_PRINT_MAX_LEVELS = 200;
function planPrintDomCandidates(eventOrderedSegs, eventOrderStrict, eventSlicing) {
  const { segLevels, excludedSegs } = buildSegLevels(eventOrderedSegs, eventOrderStrict, DEFAULT_PRINT_MAX_LEVELS);
  const placement = placeExtraSlicesInLevels(convertSegLevelsToWholeSlices(segLevels), convertSegsToWholeSlices(excludedSegs), eventOrderStrict, eventSlicing, 0);
  return {
    sliceLevels: placement.sliceLevels,
    hiddenSlices: placement.hiddenSlices
  };
}
function buildPrintEventBands(levels, printEventThicknesses, getPrintEventKey = (slice) => slice.sourceSeg.key, defaultPrintEventThickness = DEFAULT_UNMEASURED_EVENT_THICKNESS) {
  const bands = [];
  for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
    const entries = levels[levelIndex];
    if (!entries?.length)
      continue;
    let thickness = 0;
    const slices = entries.map((slice) => {
      thickness = Math.max(thickness, printEventThicknesses.get(getPrintEventKey(slice)) ?? defaultPrintEventThickness);
      return slice;
    });
    bands.push({
      levelIndex,
      slices,
      thickness
    });
  }
  return bands;
}
function buildDayGridPrintPlan(eventOrderedSegs, orderStrict, eventSlicing, columnCount) {
  const sourceSegs = buildDayGridSegSources(eventOrderedSegs);
  const candidatePlan = planPrintDomCandidates(sourceSegs, orderStrict, eventSlicing);
  return __spreadProps(__spreadValues({}, candidatePlan), {
    hiddenSlices: sortByEventOrder(candidatePlan.hiddenSlices),
    sourceSegs,
    columnCount
  });
}
function buildDayGridPrintColumns(plan, printSegHeights) {
  const columns = Array.from({ length: plan.columnCount }, () => []);
  for (const band of buildPrintEventBands(plan.sliceLevels, printSegHeights, getDayGridPrintSliceKey)) {
    const slicesByColumn = Array(plan.columnCount).fill(null);
    for (const slice of band.slices) {
      slicesByColumn[slice.start] = slice;
    }
    for (let column = 0; column < plan.columnCount; column++) {
      columns[column].push({
        levelIndex: band.levelIndex,
        thickness: band.thickness,
        slice: slicesByColumn[column]
      });
    }
  }
  return columns;
}
function getDayGridPrintSliceKey(slice) {
  return `${slice.sourceSeg.key}:${slice.start}:${slice.end}`;
}
var DEFAULT_WEEK_NUM_FORMAT = createFormatter({ week: "narrow" });
var DayGridRow = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.headerHeightRefMap = new RefMap(() => {
      afterSize(this.handleSegPositioning);
    });
    this.mainHeightRefMap = new RefMap(() => {
      const fgLiquidHeight = this.props.dayMaxEvents === true || this.props.dayMaxEventRows === true;
      if (fgLiquidHeight) {
        afterSize(this.handleSegPositioning);
      }
    });
    this.sliceHeightRefMap = new RefMap(() => {
      afterSize(this.handleSegPositioning);
    });
    this.handlePrintSegHeightChange = () => {
      afterSize(this.handlePrintSegHeights);
    };
    this.printSegHeightRefMap = new RefMap(this.handlePrintSegHeightChange);
    this.buildWeekNumberRenderProps = memoize(buildWeekNumberRenderProps);
    this.buildPrintPlan = memoize(buildDayGridPrintPlan);
    this.sortEventSegs = memoize(sortEventSegs);
    this.levelCapacity = DEFAULT_LEVEL_CAPACITY;
    this.handleRootEl = (rootEl) => {
      this.disconnectHeight?.();
      this.disconnectHeight = void 0;
      setRef(this.props.rootElRef, rootEl);
      if (rootEl) {
        this.disconnectHeight = watchHeight(rootEl, (contentHeight) => {
          setRef(this.props.heightRef, contentHeight);
        });
      } else {
        setRef(this.props.heightRef, null);
      }
    };
    this.handleSegPositioning = () => {
      if (this._isUnmounting || this.props.forPrint)
        return;
      this.updateAutoPlacementRatchets();
      this.forceUpdate();
    };
    this.handlePrintSegHeights = () => {
      if (this._isUnmounting || !this.props.forPrint)
        return;
      this.forceUpdate();
    };
  }
  render() {
    const { props, context, headerHeightRefMap, mainHeightRefMap } = this;
    const { cells, tableMode } = props;
    const { options } = context;
    const weekDateMarker = props.cells[0].date;
    const fgEventSegs = this.sortEventSegs(props.fgEventSegs, options.eventOrder);
    const screenFgLiquidHeight = props.dayMaxEvents === true || props.dayMaxEventRows === true;
    let printPlan = null;
    let printColumns = null;
    let screenColumns = null;
    let screenSliceCoords = /* @__PURE__ */ new Map();
    let screenMainOffsetsByCol = [];
    let screenHeightsByCol = [];
    if (props.forPrint) {
      printPlan = this.buildPrintPlan(fgEventSegs, options.eventOrderStrict, options.eventSlicing, cells.length);
      printColumns = buildDayGridPrintColumns(printPlan, this.printSegHeightRefMap.current);
    } else {
      const placementMode = resolveDayGridPlacementMode(props.dayMaxEvents, props.dayMaxEventRows);
      const [maxMainTop, minMainHeight] = this.computeFgDims();
      const screenLayout = placementMode === "auto" ? buildDayGridPixelPlacements(fgEventSegs, options.eventOrderStrict, options.eventSlicing, cells.length, minMainHeight, props.moreLinkHeight, this.levelCapacity, this.sliceHeightRefMap.current) : buildDayGridLevelPlacements(fgEventSegs, computeDayGridDomCandidateMaxLevels(placementMode, props.dayMaxEvents, props.dayMaxEventRows, Infinity), computeDayGridMoreLinkLevelTax(placementMode), options.eventOrderStrict, options.eventSlicing, cells.length, this.sliceHeightRefMap.current);
      screenColumns = screenLayout.columns;
      screenSliceCoords = screenLayout.sliceCoords;
      if (maxMainTop != null) {
        for (let col = 0; col < cells.length; col++) {
          const cellHeaderHeight = headerHeightRefMap.current.get(cells[col].key);
          const mainOffset = cellHeaderHeight != null ? maxMainTop - cellHeaderHeight : void 0;
          screenMainOffsetsByCol.push(mainOffset);
          screenHeightsByCol.push(mainOffset != null ? screenColumns[col].contentHeight + mainOffset : void 0);
        }
      }
    }
    const highlightSegs = this.getHighlightSegs();
    const hasNavLink = options.navLinks;
    const fullWeekStr = buildDateStr(context, weekDateMarker, "week");
    const weekNumberRenderProps = this.buildWeekNumberRenderProps(weekDateMarker, context, props.cellIsNarrow, hasNavLink);
    const fillsByCol = cells.map(() => []);
    const weekNumberNode = props.showWeekNumbers && !props.cellIsMicro ? u(ContentContainer, { tag: "div", attrs: __spreadProps(__spreadValues({}, hasNavLink ? buildNavLinkAttrs(
      context,
      weekDateMarker,
      "week",
      fullWeekStr,
      /* isTabbable = */
      false
    ) : {}), {
      "role": void 0,
      // HACK: a 'link' role can't be child of a 'row' role
      "aria-hidden": true
      // HACK: never part of a11y tree because row already has label and role not allowed
    }), className: DAY_GRID_EVENT_Z_CLASS, renderProps: weekNumberRenderProps, generatorName: "inlineWeekNumberContent", customGenerator: options.inlineWeekNumberContent, defaultGenerator: renderText, classNameGenerator: options.inlineWeekNumberClass, didMount: options.inlineWeekNumberDidMount, willUnmount: options.inlineWeekNumberWillUnmount }) : null;
    if (tableMode && weekNumberNode) {
      fillsByCol[0].push(u("div", { className: joinClassNames(classNames.fillY, classNames.start0, classNames.pointerEventsNone), style: {
        width: this.computeSpanWidth(0, cells.length)
      }, children: weekNumberNode }, "week-number"));
    }
    this.appendFillSegs(fillsByCol, props.businessHourSegs, "non-business", DAY_GRID_NON_BUSINESS_Z_CLASS);
    this.appendFillSegs(fillsByCol, props.bgEventSegs, "bg-event", DAY_GRID_BG_EVENT_Z_CLASS);
    this.appendFillSegs(fillsByCol, highlightSegs, "highlight", DAY_GRID_HIGHLIGHT_Z_CLASS);
    const RowTag = tableMode ? "tr" : "div";
    return u(RowTag, {
      role: props.role,
      "aria-label": props.role === "row" ? fullWeekStr : void 0,
      className: joinClassNames(
        options.dayRowClass,
        props.className,
        tableMode && classNames.borderless,
        !tableMode && classNames.flexRow,
        !tableMode && classNames.rel,
        // origin for the inline week number
        !tableMode && classNames.borderlessX,
        !tableMode && classNames.borderlessTop,
        !tableMode && !props.borderBottom && classNames.borderlessBottom,
        classNames.isolate
      ),
      style: {
        flexBasis: tableMode ? void 0 : props.basis
      },
      ref: this.handleRootEl,
      children: [!tableMode && weekNumberNode, props.cells.map((cell, col) => {
        const printPopover = printPlan ? buildDayGridPopoverSegs(printPlan.sourceSegs, printPlan.hiddenSlices, col) : null;
        const screenRenderSlices = printPlan ? null : screenColumns[col].renderSlices;
        let fg;
        if (printPlan) {
          fg = this.renderPrintBandSlots(printColumns[col]);
        } else {
          fg = [
            ...this.renderLevelFgSegs(screenMainOffsetsByCol[col], screenRenderSlices, screenSliceCoords),
            ...this.renderMirrorFgSegs(col, screenMainOffsetsByCol[col], screenSliceCoords)
          ];
        }
        return u(DayGridCell, {
          dateProfile: props.dateProfile,
          todayRange: props.todayRange,
          date: cell.date,
          isMajor: cell.isMajor,
          isDisabled: cell.isDisabled,
          showDayNumber: props.showDayNumbers,
          isNarrow: props.cellIsNarrow,
          isMicro: props.cellIsMicro,
          borderStart: Boolean(col),
          borderBottom: props.borderBottom,
          tableMode,
          // content
          fills: fillsByCol[col],
          segs: printPopover ? printPopover.segs : screenColumns[col].segs,
          hiddenSegs: printPopover ? printPopover.hiddenSegs : screenColumns[col].hiddenSegs,
          fgLiquidHeight: printPlan ? false : screenFgLiquidHeight,
          fg,
          fgIsList: Boolean(screenRenderSlices?.length),
          eventDrag: printPlan ? null : props.eventDrag,
          eventResize: printPlan ? null : props.eventResize,
          eventSelection: props.eventSelection,
          // render hooks
          renderProps: cell.renderProps,
          dateSpanProps: cell.dateSpanProps,
          attrs: cell.attrs,
          className: cell.className,
          // dimensions
          fgHeight: printPlan ? void 0 : screenHeightsByCol[col],
          width: props.colWidth,
          // refs
          headerHeightRef: printPlan ? void 0 : headerHeightRefMap.createRef(cell.key),
          mainHeightRef: printPlan ? void 0 : mainHeightRefMap.createRef(cell.key)
        }, cell.key);
      })]
    });
  }
  /** Mirrors align with kernel coordinates but bypass admission and measurement. */
  renderMirrorFgSegs(col, mainOffset, sliceCoords) {
    const { props } = this;
    const { eventSelection } = props;
    const nodes = [];
    for (const seg of this.getMirrorSegs()) {
      if (seg.start !== col) {
        continue;
      }
      const key = getDayGridSegKey(seg);
      const { eventRange } = seg;
      const { instanceId } = eventRange.instance;
      const top = mainOffset != null ? mainOffset + (sliceCoords.get(key) ?? 0) : void 0;
      const isDragging = Boolean(props.eventDrag && props.eventDrag.affectedInstances[instanceId]);
      const isResizing = Boolean(props.eventResize && props.eventResize.affectedInstances[instanceId]);
      const isSelected = instanceId === eventSelection;
      nodes.push(u(MeasuredHeightHarness, { attrs: { "aria-hidden": true }, className: joinClassNames(classNames.abs, classNames.start0, DAY_GRID_INTERACTION_Z_CLASS), style: {
        top,
        width: this.computeSpanWidth(seg.start, seg.end)
      }, heightRef: null, children: this.renderEventContent(seg, eventRange, {
        isDragging,
        isResizing,
        isMirror: true,
        isSelected
      }) }, `mirror:${key}`));
    }
    return nodes;
  }
  /** Renders every kernel slice with its own measurement ref. */
  renderLevelFgSegs(mainOffset, slices, sliceCoords) {
    const { props } = this;
    const { eventSelection } = props;
    const nodes = [];
    for (const slice of slices) {
      const key = getSliceKey(slice);
      const sliceTop = sliceCoords.get(key);
      const { eventRange } = slice.sourceSeg;
      const { instanceId } = eventRange.instance;
      const top = mainOffset != null && sliceTop != null ? mainOffset + sliceTop : void 0;
      const isDragging = Boolean(props.eventDrag && props.eventDrag.affectedInstances[instanceId]);
      const isResizing = Boolean(props.eventResize && props.eventResize.affectedInstances[instanceId]);
      const isInvisible = isDragging || isResizing || top == null;
      const isSelected = instanceId === eventSelection;
      nodes.push(u(MeasuredHeightHarness, { attrs: { role: "listitem" }, className: joinClassNames(classNames.abs, classNames.start0, isSelected ? DAY_GRID_INTERACTION_Z_CLASS : DAY_GRID_EVENT_Z_CLASS), style: {
        visibility: isInvisible ? "hidden" : void 0,
        top,
        width: this.computeSpanWidth(slice.start, slice.end)
      }, heightRef: this.sliceHeightRefMap.createRef(key), children: this.renderEventContent(slice, eventRange, {
        isDragging,
        isResizing,
        isSelected
      }) }, key));
    }
    return nodes;
  }
  /**
   * The inner event, identical on both placement routes. Only the wrapper
   * around it differs: the screen route positions it, print lets it sit at the
   * static top of its band slot.
  */
  renderEventContent(range, eventRange, interaction) {
    const { props } = this;
    const isListItem = hasListItemDisplay(range, eventRange);
    const cellRenderProps = props.cells[range.start]?.renderProps;
    return u(StandardEvent, __spreadValues({ display: isListItem ? "list-item" : "row", eventRange, isStart: range.isStart, isEnd: range.isEnd, isDragging: Boolean(interaction.isDragging), isResizing: Boolean(interaction.isResizing), isMirror: Boolean(interaction.isMirror), isSelected: Boolean(interaction.isSelected), isNarrow: props.cellIsNarrow, defaultTimeFormat: DEFAULT_TABLE_EVENT_TIME_FORMAT, defaultDisplayEventEnd: props.cells.length === 1, disableResizing: isListItem, forcedTimeText: props.cellIsMicro ? "" : void 0, renderProps: cellRenderProps }, getEventRangeMeta(eventRange, props.todayRange)));
  }
  /** Renders aligned print slots with in-flow event wrappers that can paginate with their bands. */
  renderPrintBandSlots(slots) {
    const { printSegHeightRefMap } = this;
    return slots.map((slot) => {
      const { slice } = slot;
      let eventNode = null;
      if (slice) {
        const sliceKey = getDayGridPrintSliceKey(slice);
        eventNode = u(MeasuredHeightHarness, { className: joinClassNames(classNames.rel, classNames.flowRoot, DAY_GRID_EVENT_Z_CLASS), style: {
          width: this.computeSpanWidth(slice.start, slice.end)
        }, heightRef: printSegHeightRefMap.createRef(sliceKey), children: this.renderEventContent(slice, slice.sourceSeg.eventRange, {}) }, sliceKey);
      }
      return u("div", { className: classNames.breakInsideAvoid, style: { height: slot.thickness }, children: eventNode }, slot.levelIndex);
    });
  }
  computeSpanWidth(start, end) {
    const span = end - start;
    const percentWidth = `${span * 100}%`;
    const crossedBorderWidth = this.props.tableMode && start === 0 ? 0 : Math.max(0, span - 1) * COL_BORDER_WIDTH;
    return crossedBorderWidth ? `calc(${percentWidth} + ${crossedBorderWidth}px)` : percentWidth;
  }
  /** Places each fill in its first cell while allowing its wrapper to span subsequent cells. */
  appendFillSegs(fillsByCol, segs, fillType, zClassName) {
    const { props, context } = this;
    const { todayRange } = props;
    for (const seg of segs) {
      fillsByCol[seg.start].push(u("div", { "aria-hidden": true, className: joinClassNames(classNames.fillY, classNames.start0, zClassName), style: {
        width: this.computeSpanWidth(seg.start, seg.end)
      }, children: fillType === "bg-event" ? u(BgEvent, __spreadValues({ eventRange: seg.eventRange, isStart: seg.isStart, isEnd: seg.isEnd, isNarrow: props.cellIsNarrow, isVertical: false, renderProps: props.cells[seg.start]?.renderProps }, getEventRangeMeta(seg.eventRange, todayRange))) : renderFill(fillType, context.options) }, `${fillType}:${buildEventRangeKey(seg.eventRange)}:${seg.start}:${seg.end}`));
    }
  }
  // Sizing
  // -----------------------------------------------------------------------------------------------
  componentDidMount() {
    this._isUnmounting = false;
  }
  componentDidUpdate(prevProps) {
    if (prevProps.forPrint && !this.props.forPrint) {
      this.printSegHeightRefMap = new RefMap(this.handlePrintSegHeightChange);
    }
  }
  componentWillUnmount() {
    this._isUnmounting = true;
  }
  computeFgDims() {
    const { cells } = this.props;
    const headerHeightMap = this.headerHeightRefMap.current;
    const mainHeightMap = this.mainHeightRefMap.current;
    let maxMainTop;
    let minMainBottom;
    let isComplete = true;
    for (const cell of cells) {
      if (cell.isDisabled) {
        continue;
      }
      const mainTop = headerHeightMap.get(cell.key);
      const mainHeight = mainHeightMap.get(cell.key);
      if (mainTop == null || mainHeight == null) {
        isComplete = false;
      }
      if (mainTop != null) {
        if (maxMainTop === void 0 || mainTop > maxMainTop) {
          maxMainTop = mainTop;
        }
        if (mainHeight != null) {
          const mainBottom = mainTop + mainHeight;
          if (minMainBottom === void 0 || mainBottom < minMainBottom) {
            minMainBottom = mainBottom;
          }
        }
      }
    }
    return [
      maxMainTop,
      isComplete && minMainBottom != null && maxMainTop != null ? minMainBottom - maxMainTop : void 0
    ];
  }
  /**
   * Grows the row-local DOM candidate frontier from one post-size snapshot.
   * This is the only monotone state auto placement needs: the engine itself
   * consumes exact measurements and never predicts a thickness.
   */
  updateAutoPlacementRatchets() {
    if (resolveDayGridPlacementMode(this.props.dayMaxEvents, this.props.dayMaxEventRows) !== "auto")
      return;
    const [, canvasHeight] = this.computeFgDims();
    if (canvasHeight != null) {
      const smallestSliceHeight = Math.min(...this.sliceHeightRefMap.current.values());
      this.levelCapacity = Math.max(this.levelCapacity, estimateLevelCapacity(canvasHeight, smallestSliceHeight));
    }
  }
  // Internal Utils
  // -----------------------------------------------------------------------------------------------
  getMirrorSegs() {
    let { props } = this;
    if (props.eventResize && props.eventResize.segs.length) {
      return props.eventResize.segs;
    }
    return [];
  }
  getHighlightSegs() {
    let { props } = this;
    if (props.eventDrag && props.eventDrag.segs.length) {
      return props.eventDrag.segs;
    }
    if (props.eventResize && props.eventResize.segs.length) {
      return props.eventResize.segs;
    }
    return props.dateSelectionSegs;
  }
};
function buildWeekNumberRenderProps(weekDateMarker, context, isNarrow, hasNavLink) {
  const { dateEnv, options } = context;
  const weekNum = dateEnv.computeWeekNumber(weekDateMarker);
  const weekNumTextParts = dateEnv.formatToParts(weekDateMarker, options.weekNumberFormat || DEFAULT_WEEK_NUM_FORMAT);
  const weekNumText = joinDateTimeFormatParts(weekNumTextParts);
  const weekDateZoned = dateEnv.toDate(weekDateMarker);
  return {
    num: weekNum,
    text: weekNumText,
    textParts: weekNumTextParts,
    date: weekDateZoned,
    isNarrow,
    hasNavLink
  };
}
var DaySeriesModel = class {
  constructor(range, dateProfileGenerator) {
    let date = range.start;
    let { end } = range;
    let entries = [];
    let dates = [];
    let dayIndex = -1;
    while (date < end) {
      if (dateProfileGenerator.isHiddenDay(date)) {
        entries.push({
          kind: "hidden",
          previousIndex: dayIndex,
          nextIndex: dayIndex + 1
        });
      } else {
        dayIndex += 1;
        entries.push({ kind: "visible", index: dayIndex });
        dates.push(date);
      }
      date = addDays(date, 1);
    }
    this.rangeStart = range.start;
    this.dates = dates;
    this.entries = entries;
    this.cnt = dates.length;
  }
  sliceRange(range) {
    let firstResult = this.getDateIndex(range.start);
    let lastResult = this.getDateIndex(addDays(range.end, -1));
    let firstIndex = getFirstVisibleIndex(firstResult);
    let lastIndex = getLastVisibleIndex(lastResult);
    let clippedFirstIndex = Math.max(0, firstIndex);
    let clippedLastIndex = Math.min(this.cnt - 1, lastIndex);
    if (clippedFirstIndex <= clippedLastIndex) {
      return {
        start: clippedFirstIndex,
        end: clippedLastIndex + 1,
        // make exclusive
        isStart: firstResult.kind === "visible" && firstIndex === clippedFirstIndex,
        isEnd: lastResult.kind === "visible" && lastIndex === clippedLastIndex
      };
    }
    return null;
  }
  getDateIndex(date) {
    let dayOffset = Math.floor(diffDays(this.rangeStart, date));
    if (dayOffset < 0) {
      return { kind: "before", index: -1 };
    }
    if (dayOffset >= this.entries.length) {
      return { kind: "after", index: this.cnt };
    }
    return this.entries[dayOffset];
  }
};
function getFirstVisibleIndex(result) {
  return result.kind === "hidden" ? result.nextIndex : result.index;
}
function getLastVisibleIndex(result) {
  return result.kind === "hidden" ? result.previousIndex : result.index;
}
function buildDayTableModel(dateProfile, dateProfileGenerator, dateEnv) {
  const daySeries = new DaySeriesModel(dateProfile.renderRange, dateProfileGenerator);
  const breakOnWeeks = /year|month|week/.test(dateProfile.currentRangeUnit);
  const majorUnit = !breakOnWeeks && computeMajorUnit(dateProfile, dateEnv);
  return new DayTableModel(daySeries, breakOnWeeks, dateEnv, majorUnit !== "day" ? majorUnit : void 0, dateProfile.activeRange);
}
function computeColWidth(colCount, colMinWidth, viewportWidth) {
  if (viewportWidth == null) {
    return [void 0, void 0];
  }
  const colTempWidth = viewportWidth / colCount;
  if (colTempWidth < colMinWidth) {
    return [colMinWidth * colCount, colMinWidth];
  }
  return [viewportWidth, void 0];
}
function computeTopFromDate(date, cellRows, rowHeightMap) {
  let top = 0;
  for (const cells of cellRows) {
    const key = cells[0].key;
    const start = cells[0].date;
    const end = cells[cells.length - 1].date;
    if (date >= start && date <= end) {
      return top;
    }
    const rowHeight = rowHeightMap.get(key);
    if (rowHeight == null) {
      return;
    }
    top += rowHeight;
  }
  return top;
}
function computeColFromPosition(positionLeft, elWidth, colWidth, colCount, isRtl) {
  const realColWidth = colWidth != null ? colWidth : elWidth / colCount;
  const colFromLeft = Math.floor(positionLeft / realColWidth);
  const col = isRtl ? colCount - colFromLeft - 1 : colFromLeft;
  const left = colFromLeft * realColWidth;
  const right = left + realColWidth;
  return { col, left, right };
}
function computeRowFromPosition(positionTop, cellRows, rowHeightMap) {
  let row = 0;
  let top = 0;
  let bottom = 0;
  for (const cells of cellRows) {
    const key = cells[0].key;
    top = bottom;
    bottom = top + rowHeightMap.get(key);
    if (positionTop < bottom) {
      break;
    }
    row++;
  }
  return { row, top, bottom };
}
function getRowEl(rootEl, row) {
  return rootEl.querySelectorAll("[role=row]")[row];
}
function getCellEl(rowEl, col) {
  return rowEl.querySelectorAll("[role=cell]")[col];
}
var dayMicroWidth = 60;
var dayHeaderMicroFormat = createFormatter({
  weekday: "narrow"
});
function createDayHeaderFormatter(explicitFormat, datesRepDistinctDays, dateCnt) {
  return explicitFormat || computeFallbackHeaderFormat(datesRepDistinctDays, dateCnt);
}
function computeFallbackHeaderFormat(datesRepDistinctDays, dayCnt) {
  if (!datesRepDistinctDays) {
    return createFormatter({ weekday: "short" });
  }
  if (dayCnt > 1) {
    return createFormatter({
      weekday: "short",
      weekdayJustify: "start",
      day: "numeric",
      omitCommas: true,
      omitTrailing: true
    });
  }
  return createFormatter({
    weekday: "long",
    weekdayJustify: "start",
    day: "numeric",
    omitCommas: true,
    omitTrailing: true
  });
}
var DayGridRows = class extends DateComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.splitBusinessHourSegs = memoize(splitSegsByRow);
    this.splitBgEventSegs = memoize(splitAllDaySegsByRow);
    this.splitFgEventSegs = memoize(splitSegsByRow);
    this.splitDateSelectionSegs = memoize(splitSegsByRow);
    this.splitEventDrag = memoize(splitInteractionByRow);
    this.splitEventResize = memoize(splitInteractionByRow);
    this.rowHeightRefMap = new RefMap((height, key) => {
      const { rowHeightRefMap } = this.props;
      if (rowHeightRefMap) {
        rowHeightRefMap.handleValue(height, key);
      }
    });
    this.handleMoreLinkEl = (el) => {
      this.disconnectMoreLinkHeight?.();
      this.disconnectMoreLinkHeight = void 0;
      if (el) {
        this.disconnectMoreLinkHeight = watchHeight(el, (height) => {
          if (this._isUnmounting)
            return;
          this.setState({ moreLinkHeight: height });
        });
      }
    };
    this.handleRootEl = (rootEl) => {
      this.rootEl = rootEl;
      if (rootEl) {
        this.context.registerInteractiveComponent(this, {
          el: rootEl,
          isHitComboAllowed: this.props.isHitComboAllowed
        });
      } else {
        this.context.unregisterInteractiveComponent(this);
      }
    };
  }
  render() {
    let { props, state, context, rowHeightRefMap } = this;
    let { options } = context;
    let { cellRows, tableMode } = props;
    let rowCount = cellRows.length;
    let firstCellKey = cellRows[0]?.[0]?.key || "";
    let fgEventSegsByRow = this.splitFgEventSegs(props.fgEventSegs, rowCount);
    let bgEventSegsByRow = this.splitBgEventSegs(props.bgEventSegs, rowCount);
    let businessHourSegsByRow = this.splitBusinessHourSegs(props.businessHourSegs, rowCount);
    let dateSelectionSegsByRow = this.splitDateSelectionSegs(props.dateSelectionSegs, rowCount);
    let eventDragByRow = this.splitEventDrag(props.eventDrag, rowCount);
    let eventResizeByRow = this.splitEventResize(props.eventResize, rowCount);
    let isHeightAuto = getIsHeightAuto(options);
    let rowHeightsRedistribute = !props.forPrint && !isHeightAuto;
    let rowBasis = computeRowBasis(props.visibleWidth, rowCount, isHeightAuto, options);
    const needsMoreLinkProbe = !props.forPrint && resolveDayGridPlacementMode(props.dayMaxEvents, props.dayMaxEventRows) === "auto";
    const RowsTag = tableMode ? "tbody" : "div";
    return u(S, { children: [u(RowsTag, { role: "rowgroup", className: joinClassNames(
      props.className,
      // HACK for Safari. Can't do break-inside:avoid with flexbox items, likely b/c it's not standard:
      // https://stackoverflow.com/a/60256345
      !tableMode && !props.forPrint && classNames.flexCol
    ), style: tableMode ? void 0 : { width: props.width }, ref: this.handleRootEl, children: cellRows.map((cells, row) => u(DayGridRow, {
      role: "row",
      dateProfile: props.dateProfile,
      todayRange: props.todayRange,
      cells,
      cellIsNarrow: props.cellIsNarrow,
      cellIsMicro: props.cellIsMicro,
      showDayNumbers: rowCount > 1,
      showWeekNumbers: rowCount > 1 && options.weekNumbers,
      forPrint: props.forPrint,
      tableMode,
      borderBottom: row < rowCount - 1,
      // if not auto-height, distribute height of container somewhat evently to rows
      className: rowHeightsRedistribute ? classNames.grow : void 0,
      // content
      fgEventSegs: fgEventSegsByRow[row],
      bgEventSegs: bgEventSegsByRow[row],
      businessHourSegs: businessHourSegsByRow[row],
      dateSelectionSegs: dateSelectionSegsByRow[row],
      eventSelection: props.eventSelection,
      eventDrag: eventDragByRow[row],
      eventResize: eventResizeByRow[row],
      dayMaxEvents: props.dayMaxEvents,
      dayMaxEventRows: props.dayMaxEventRows,
      // dimensions
      colWidth: props.colWidth,
      basis: rowBasis,
      moreLinkHeight: state.moreLinkHeight,
      // refs
      heightRef: rowHeightRefMap.createRef(cells[0].key)
    }, firstCellKey + ":" + cells[0].key)) }), needsMoreLinkProbe && u(MoreLinkTrigger, { num: 1, display: "row", isNarrow: props.cellIsNarrow, isMicro: props.cellIsMicro, elRef: this.handleMoreLinkEl, className: classNames.offscreen, attrs: {
      "aria-hidden": true
      // redundant with .offscreen's visibility, but marks it as a probe
    } })] });
  }
  componentDidMount() {
    this._isUnmounting = false;
  }
  componentWillUnmount() {
    this._isUnmounting = true;
  }
  // Hit System
  // -----------------------------------------------------------------------------------------------
  queryHit(isRtl, positionLeft, positionTop, elWidth) {
    const { props } = this;
    const colCount = props.cellRows[0].length;
    const { col, left, right } = computeColFromPosition(positionLeft, elWidth, props.colWidth, colCount, isRtl);
    const { row, top, bottom } = computeRowFromPosition(positionTop, props.cellRows, this.rowHeightRefMap.current);
    const cell = props.cellRows[row][col];
    if (cell.isInert) {
      return null;
    }
    const cellStartDate = cell.date;
    const cellEndDate = addDays(cellStartDate, 1);
    return {
      dateProfile: props.dateProfile,
      dateSpan: __spreadValues({
        range: {
          start: cellStartDate,
          end: cellEndDate
        },
        allDay: true
      }, cell.dateSpanProps),
      getDayEl: () => getCellEl(getRowEl(this.rootEl, row), col),
      rect: {
        left,
        right,
        top,
        bottom
      },
      layer: 0
    };
  }
};
function isSegAllDay(seg) {
  return seg.eventRange.def.allDay;
}
function splitAllDaySegsByRow(segs, rowCnt) {
  return splitSegsByRow(segs.filter(isSegAllDay), rowCnt);
}
function computeRowBasis(visibleWidth, rowCount, isHeightAuto, options) {
  if (visibleWidth != null) {
    const rowBasis = visibleWidth / options.aspectRatio / 6;
    return rowCount > 6 || isHeightAuto ? rowBasis : 0;
  }
  return 0;
}
var DayGridHeaderCell = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.buildDayHeaderText = memoize(buildDayHeaderText);
    this.handleInnerEl = (innerEl) => {
      if (this.disconnectSize) {
        this.disconnectSize();
        this.disconnectSize = void 0;
      }
      if (innerEl) {
        this.disconnectSize = watchSize(innerEl, (width, height) => {
          if (this._isUnmounting)
            return;
          setRef(this.props.innerHeightRef, height);
          this.setState({ innerWidth: width });
        });
      } else {
        setRef(this.props.innerHeightRef, null);
      }
    };
  }
  render() {
    const { props, state, context } = this;
    const { renderConfig, dataConfig, tableMode } = props;
    const colSpan = dataConfig.colSpan || 1;
    const totalColWidth = props.colWidth != null ? props.colWidth * colSpan : void 0;
    const isLiquid = !tableMode && totalColWidth == null;
    const isSpanning = isLiquid && colSpan > 1;
    const style = tableMode ? void 0 : isSpanning ? {
      flexGrow: colSpan,
      flexBasis: (colSpan - 1) * COL_BORDER_WIDTH + (props.borderStart ? COL_BORDER_WIDTH : 0),
      minWidth: 0
    } : {
      width: totalColWidth
    };
    const CellTag = tableMode ? "th" : "div";
    const baseClassName = joinClassNames(dataConfig.className, classNames.noMargin, classNames.noPadding, !tableMode && classNames.flexCol, classNames.borderlessTop, classNames.borderlessEnd, !props.borderStart && classNames.borderlessStart, !(tableMode && props.borderBottom) && classNames.borderlessBottom, isLiquid && !isSpanning && classNames.liquid);
    if (dataConfig.blank) {
      return u(CellTag, __spreadProps(__spreadValues({
        role: "cell",
        "aria-colspan": dataConfig.colSpan,
        colSpan: tableMode ? colSpan : void 0
      }, dataConfig.attrs), {
        className: joinClassNames(baseClassName, generateClassName(dataConfig.blank.classNameGenerator, __spreadProps(__spreadValues({}, dataConfig.renderProps), {
          isNarrow: props.cellIsNarrow
        }))),
        style
      }));
    }
    const isDisabled = dataConfig.renderProps.isDisabled;
    const finalRenderProps = renderConfig.dayHeaderFormat ? this.buildDayHeaderRenderProps(dataConfig.renderProps, props.cellIsNarrow, props.rowLevel, props.cellIsMicro, dataConfig.dateMarker, renderConfig.dayHeaderFormat, Boolean(renderConfig.datesRepDistinctDays), context.dateEnv) : __spreadProps(__spreadValues({}, dataConfig.renderProps), {
      isNarrow: props.cellIsNarrow,
      level: props.rowLevel
    });
    const alignInput = renderConfig.align;
    const align = (
      // normalized string-enum value
      typeof alignInput === "function" ? alignInput({ level: props.rowLevel, inPopover: dataConfig.renderProps.inPopover, isNarrow: props.cellIsNarrow }) : alignInput
    );
    const stickyInput = renderConfig.sticky;
    const isSticky = !tableMode && props.rowLevel > 0 && stickyInput !== false && // if center-aligned, and wants to be sticky, must be >75% viewport width,
    // to avoid looking awkwardly aligned
    (align !== "center" || totalColWidth != null && props.viewportWidth != null && totalColWidth > props.viewportWidth * 0.75);
    let edgeCoord;
    if (isSticky) {
      if (align === "center") {
        if (state.innerWidth != null) {
          edgeCoord = `calc(50% - ${state.innerWidth / 2}px)`;
        }
      } else {
        edgeCoord = typeof stickyInput === "number" || typeof stickyInput === "string" ? stickyInput : 0;
      }
    }
    const alignClassName = align === "center" ? classNames.alignCenter : align === "end" ? classNames.alignEnd : classNames.alignStart;
    return u(ContentContainer, { tag: CellTag, attrs: __spreadValues({
      role: "columnheader",
      "aria-colspan": dataConfig.colSpan,
      colSpan: tableMode ? colSpan : void 0
    }, dataConfig.attrs), className: joinClassNames(baseClassName, !tableMode && alignClassName, !isSticky && classNames.crop), style, renderProps: finalRenderProps, generatorName: renderConfig.generatorName, customGenerator: renderConfig.customGenerator, defaultGenerator: renderText, classNameGenerator: (
      // don't use custom classNames if disabled
      // TODO: make DRY with DayCellContainer
      isDisabled ? void 0 : renderConfig.classNameGenerator
    ), didMount: renderConfig.didMount, willUnmount: renderConfig.willUnmount, children: (InnerContainer) => u(S, { children: [dataConfig.a11yText && u("div", { className: classNames.srOnly, children: dataConfig.a11yText }), u("div", { "aria-hidden": dataConfig.a11yText ? true : void 0, ref: this.handleInnerEl, className: joinClassNames(classNames.flexCol, classNames.noShrink, classNames.whiteSpaceNoWrap, tableMode && alignClassName, isSticky && classNames.sticky), style: {
      left: edgeCoord,
      right: edgeCoord
    }, children: u(InnerContainer, { tag: "div", attrs: dataConfig.innerAttrs, className: generateClassName(renderConfig.innerClassNameGenerator, finalRenderProps) }) })] }) });
  }
  componentDidMount() {
    this._isUnmounting = false;
  }
  componentWillUnmount() {
    this._isUnmounting = true;
  }
  buildDayHeaderRenderProps(renderProps, cellIsNarrow, rowLevel, cellIsMicro, dateMarker, dayHeaderFormat, datesRepDistinctDays, dateEnv) {
    const baseText = this.buildDayHeaderText(datesRepDistinctDays ? dateMarker : renderProps.date, dayHeaderFormat, datesRepDistinctDays, dateEnv);
    const textData = cellIsMicro ? this.buildDayHeaderText(dateMarker, dayHeaderMicroFormat, false, dateEnv) : baseText;
    return __spreadProps(__spreadValues({}, renderProps), {
      isNarrow: cellIsNarrow,
      level: rowLevel,
      text: textData.text,
      textParts: textData.textParts,
      weekdayText: cellIsMicro ? textData.text : baseText.weekdayText,
      dayNumberText: baseText.dayNumberText
    });
  }
};
function buildDayHeaderText(date, formatter, includeDayNumber, dateEnv) {
  const textParts = dateEnv.formatToParts(date, formatter);
  return {
    text: joinDateTimeFormatParts(textParts),
    textParts,
    weekdayText: findWeekdayText(textParts),
    dayNumberText: includeDayNumber ? findDayNumberText(textParts) : ""
  };
}
var DayGridHeaderRow = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.innerHeightRefMap = new RefMap(() => {
      afterSize(this.handleInnerHeights);
    });
    this.handleInnerHeights = () => {
      if (this._isUnmounting)
        return;
      const innerHeightMap = this.innerHeightRefMap.current;
      let max = 0;
      for (const innerHeight of innerHeightMap.values()) {
        max = Math.max(max, innerHeight);
      }
      if (this.currentInnerHeight !== max) {
        this.currentInnerHeight = max;
        setRef(this.props.innerHeightRef, max);
      }
    };
  }
  render() {
    const { props, context } = this;
    const { tableMode } = props;
    const { options } = context;
    const RowTag = tableMode ? "tr" : "div";
    return u(RowTag, { role: props.role, "aria-rowindex": props.rowIndex != null ? 1 + props.rowIndex : void 0, className: joinClassNames(options.dayHeaderRowClass, props.className, tableMode && classNames.borderless, !tableMode && classNames.flexRow, !tableMode && classNames.contentBox, !tableMode && classNames.borderlessX, !tableMode && classNames.borderlessTop, !tableMode && !props.borderBottom && classNames.borderlessBottom), style: {
      height: props.height
    }, children: props.dataConfigs.map((dataConfig, cellI) => u(DayGridHeaderCell, { renderConfig: props.renderConfig, dataConfig, borderStart: Boolean(cellI), colWidth: props.colWidth, viewportWidth: props.viewportWidth, innerHeightRef: this.innerHeightRefMap.createRef(dataConfig.key), cellIsNarrow: props.cellIsNarrow, cellIsMicro: props.cellIsMicro, rowLevel: props.rowLevel, tableMode, borderBottom: props.borderBottom }, dataConfig.key)) });
  }
  componentDidMount() {
    this._isUnmounting = false;
  }
  componentWillUnmount() {
    this._isUnmounting = true;
    this.currentInnerHeight = void 0;
    setRef(this.props.innerHeightRef, null);
  }
};
var DayGridHeaderRows = class extends BaseComponent {
  render() {
    const { props } = this;
    const { headerTiers, tableMode } = props;
    return headerTiers.map((rowConfig, i2) => k(DayGridHeaderRow, __spreadProps(__spreadValues({}, rowConfig), { key: i2, role: "row", borderBottom: i2 < headerTiers.length - 1, colWidth: props.colWidth, viewportWidth: props.viewportWidth, cellIsNarrow: props.cellIsNarrow, cellIsMicro: props.cellIsMicro, rowLevel: headerTiers.length - i2 - 1, tableMode })));
  }
};
var DayGridLayoutPrint = class extends BaseComponent {
  render() {
    const { props, context } = this;
    const { options } = context;
    const tableDisplayInfo = {
      borderlessX: props.borderlessX,
      borderlessTop: props.borderlessTop,
      borderlessBottom: props.borderlessBottom,
      multiMonthColumns: props.multiMonthColumns
    };
    return u("table", { role: "presentation", className: joinClassNames(generateClassName(options.tableClass, tableDisplayInfo), classNames.printTable), style: props.style, children: [u("colgroup", { children: props.cellRows[0].map((cell) => u("col", {}, cell.key)) }), props.showHeader && u("thead", { ref: props.headerElRef, role: "rowgroup", className: generateClassName(options.tableHeaderClass, __spreadProps(__spreadValues({}, tableDisplayInfo), {
      isSticky: false
    })), children: [u(DayGridHeaderRows, { tableMode: true, headerTiers: props.headerTiers, cellIsNarrow: props.cellIsNarrow, cellIsMicro: props.cellIsMicro }), u("tr", { role: "presentation", children: u("th", { role: "presentation", colSpan: props.cellRows[0].length, className: joinClassNames(classNames.noPadding, generateClassName(options.dayHeaderDividerClass, {
      isSticky: false,
      multiMonthColumns: props.multiMonthColumns,
      options: { allDaySlot: Boolean(options.allDaySlot) }
    })) }) })] }), u(DayGridRows, { dateProfile: props.dateProfile, todayRange: props.todayRange, cellRows: props.cellRows, forPrint: true, tableMode: true, className: generateClassName(options.tableBodyClass, tableDisplayInfo), dayMaxEvents: void 0, dayMaxEventRows: props.dayMaxEventRows, fgEventSegs: props.fgEventSegs, bgEventSegs: props.bgEventSegs, businessHourSegs: props.businessHourSegs, dateSelectionSegs: [], eventDrag: null, eventResize: null, eventSelection: props.eventSelection, visibleWidth: props.visibleWidth, cellIsNarrow: props.cellIsNarrow, cellIsMicro: props.cellIsMicro, rowHeightRefMap: props.rowHeightRefMap })] });
  }
};

// node_modules/fullcalendar/chunks/4cda001f.js
var DayGridHeader = class extends BaseComponent {
  render() {
    const { props } = this;
    return u("div", { role: "rowgroup", className: joinClassNames(props.className, classNames.flexCol, props.width == null && classNames.liquid), style: {
      width: props.width
    }, children: u(DayGridHeaderRows, { headerTiers: props.headerTiers, colWidth: props.colWidth, viewportWidth: props.viewportWidth, cellIsNarrow: props.cellIsNarrow, cellIsMicro: props.cellIsMicro }) });
  }
};
var DayGridLayoutNormal = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.handleScroller = (scroller) => {
      setRef(this.props.scrollerRef, scroller);
    };
    this.handleTotalWidth = (totalWidth) => {
      if (this._isUnmounting)
        return;
      this.setState({ totalWidth });
    };
    this.handleClientWidth = (clientWidth) => {
      if (this._isUnmounting)
        return;
      this.setState({ clientWidth });
    };
  }
  render() {
    const { props, state, context } = this;
    const { options } = context;
    const { borderlessX, borderlessTop, borderlessBottom } = computeViewBorderless(options);
    const { totalWidth, clientWidth } = state;
    let endScrollbarWidth = totalWidth != null && clientWidth != null ? totalWidth - clientWidth : void 0;
    if (endScrollbarWidth < 3) {
      endScrollbarWidth = 0;
    }
    const verticalScrollbars = !props.forPrint && !getIsHeightAuto(options);
    const tableHeaderSticky = !props.forPrint && getTableHeaderSticky(options);
    const colCount = props.cellRows[0].length;
    const measuredColWidth = clientWidth != null ? clientWidth / colCount : void 0;
    const cellIsMicro = measuredColWidth != null && measuredColWidth <= dayMicroWidth;
    const cellIsNarrow = cellIsMicro || measuredColWidth != null && measuredColWidth <= options.dayNarrowWidth;
    if (props.forPrint) {
      return u(DayGridLayoutPrint, { dateProfile: props.dateProfile, todayRange: props.todayRange, cellRows: props.cellRows, headerTiers: props.headerTiers, showHeader: Boolean(options.dayHeaders), fgEventSegs: props.fgEventSegs, bgEventSegs: props.bgEventSegs, businessHourSegs: props.businessHourSegs, eventSelection: props.eventSelection, dayMaxEventRows: options.dayMaxEventRows, borderlessX, borderlessTop, borderlessBottom, multiMonthColumns: 0, visibleWidth: totalWidth, cellIsNarrow, cellIsMicro, rowHeightRefMap: props.rowHeightRefMap });
    }
    return u(S, { children: [options.dayHeaders && u("div", { className: joinClassNames(generateClassName(options.tableHeaderClass, {
      isSticky: tableHeaderSticky,
      borderlessX,
      borderlessTop,
      borderlessBottom,
      multiMonthColumns: 0
    }), classNames.flexCol, tableHeaderSticky && classNames.tableHeaderSticky), children: [u("div", { className: classNames.flexRow, children: [u(DayGridHeader, { headerTiers: props.headerTiers, cellIsNarrow, cellIsMicro }), Boolean(endScrollbarWidth) && u("div", { className: joinClassNames(generateClassName(options.fillerClass, { inTableHeader: true }), classNames.borderlessY, classNames.borderlessEnd), style: { minWidth: endScrollbarWidth } })] }), u("div", { className: generateClassName(options.dayHeaderDividerClass, {
      isSticky: tableHeaderSticky,
      multiMonthColumns: 0,
      options: { allDaySlot: Boolean(options.allDaySlot) }
    }) })] }), u(Scroller, { vertical: verticalScrollbars, className: joinClassNames(
      generateClassName(options.tableBodyClass, {
        borderlessX,
        borderlessTop,
        borderlessBottom,
        multiMonthColumns: 0
      }),
      // HACK for Safari. Can't do break-inside:avoid with flexbox items, likely b/c it's not standard:
      // https://stackoverflow.com/a/60256345
      !props.forPrint && classNames.flexCol,
      verticalScrollbars && classNames.liquid
    ), ref: this.handleScroller, clientWidthRef: this.handleClientWidth, children: u(DayGridRows, {
      dateProfile: props.dateProfile,
      todayRange: props.todayRange,
      cellRows: props.cellRows,
      forPrint: props.forPrint,
      isHitComboAllowed: props.isHitComboAllowed,
      className: classNames.grow,
      dayMaxEvents: props.forPrint ? void 0 : options.dayMaxEvents,
      dayMaxEventRows: options.dayMaxEventRows,
      // content
      fgEventSegs: props.fgEventSegs,
      bgEventSegs: props.bgEventSegs,
      businessHourSegs: props.businessHourSegs,
      dateSelectionSegs: props.dateSelectionSegs,
      eventDrag: props.eventDrag,
      eventResize: props.eventResize,
      eventSelection: props.eventSelection,
      // dimensions
      visibleWidth: totalWidth,
      cellIsNarrow,
      cellIsMicro,
      // refs
      rowHeightRefMap: props.rowHeightRefMap
    }) }), u(Ruler, { widthRef: this.handleTotalWidth })] });
  }
  componentDidMount() {
    this._isUnmounting = false;
  }
  componentWillUnmount() {
    this._isUnmounting = true;
  }
};
var FooterScrollbar = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.rootElRef = M();
  }
  render() {
    const { props } = this;
    return u("div", { ref: this.rootElRef, className: joinClassNames(classNames.footerScrollbar, props.isSticky && classNames.footerScrollbarSticky), children: u(Scroller, { horizontal: true, ref: props.scrollerRef, children: u("div", { style: { minWidth: props.canvasWidth } }) }) });
  }
  componentDidMount() {
    this._isUnmounting = false;
    this.disconnectHeight = watchHeight(this.rootElRef.current, (height) => {
      if (this._isUnmounting)
        return;
      setRef(this.props.scrollbarWidthRef, height);
    });
  }
  componentWillUnmount() {
    this._isUnmounting = true;
    this.disconnectHeight();
    setRef(this.props.scrollbarWidthRef, null);
  }
};
var DayGridLayoutPannable = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.headerScrollerRef = M();
    this.bodyScrollerRef = M();
    this.footerScrollerRef = M();
    this.handleTotalWidth = (totalWidth) => {
      if (this._isUnmounting)
        return;
      this.setState({ totalWidth });
    };
    this.handleClientWidth = (clientWidth) => {
      if (this._isUnmounting)
        return;
      this.setState({ clientWidth });
    };
  }
  render() {
    const { props, state, context } = this;
    const { options } = context;
    const { borderlessX, borderlessTop, borderlessBottom } = computeViewBorderless(options);
    const { totalWidth, clientWidth } = state;
    const endScrollbarWidth = totalWidth != null && clientWidth != null ? totalWidth - clientWidth : void 0;
    const verticalScrollbars = !props.forPrint && !getIsHeightAuto(options);
    const tableHeaderSticky = !props.forPrint && getTableHeaderSticky(options);
    const footerScrollbarSticky = !props.forPrint && getFooterScrollbarSticky(options);
    const colCount = props.cellRows[0].length;
    const [canvasWidth, appliedColWidth] = computeColWidth(colCount, props.dayMinWidth, clientWidth);
    const measuredColWidth = appliedColWidth ?? (clientWidth != null ? clientWidth / colCount : void 0);
    const cellIsMicro = measuredColWidth != null && measuredColWidth <= dayMicroWidth;
    const cellIsNarrow = cellIsMicro || measuredColWidth != null && measuredColWidth <= options.dayNarrowWidth;
    if (props.forPrint) {
      return u(DayGridLayoutPrint, { dateProfile: props.dateProfile, todayRange: props.todayRange, cellRows: props.cellRows, headerTiers: props.headerTiers, showHeader: Boolean(options.dayHeaders), fgEventSegs: props.fgEventSegs, bgEventSegs: props.bgEventSegs, businessHourSegs: props.businessHourSegs, eventSelection: props.eventSelection, dayMaxEventRows: options.dayMaxEventRows, borderlessX, borderlessTop, borderlessBottom, multiMonthColumns: 0, visibleWidth: totalWidth, cellIsNarrow, cellIsMicro, rowHeightRefMap: props.rowHeightRefMap });
    }
    return u(S, { children: [options.dayHeaders && u("div", { className: joinClassNames(generateClassName(options.tableHeaderClass, {
      isSticky: tableHeaderSticky,
      borderlessX,
      borderlessTop,
      borderlessBottom,
      multiMonthColumns: 0
    }), classNames.flexCol, tableHeaderSticky && classNames.tableHeaderSticky), children: [u(Scroller, { horizontal: true, hideScrollbars: true, className: classNames.flexRow, ref: this.headerScrollerRef, children: [u(DayGridHeader, { headerTiers: props.headerTiers, colWidth: appliedColWidth, viewportWidth: clientWidth, width: canvasWidth, cellIsNarrow, cellIsMicro }), Boolean(endScrollbarWidth) && u("div", { className: joinClassNames(generateClassName(options.fillerClass, { inTableHeader: true }), classNames.borderlessY, classNames.borderlessEnd), style: { minWidth: endScrollbarWidth } })] }), u("div", { className: generateClassName(options.dayHeaderDividerClass, {
      isSticky: tableHeaderSticky,
      multiMonthColumns: 0,
      options: { allDaySlot: Boolean(options.allDaySlot) }
    }) })] }), u(Scroller, {
      vertical: verticalScrollbars,
      horizontal: true,
      hideScrollbars: footerScrollbarSticky || props.forPrint,
      className: joinClassNames(
        generateClassName(options.tableBodyClass, {
          borderlessX,
          borderlessTop,
          borderlessBottom,
          multiMonthColumns: 0
        }),
        // HACK for Safari. Can't do break-inside:avoid with flexbox items, likely b/c it's not standard:
        // https://stackoverflow.com/a/60256345
        !props.forPrint && classNames.flexCol,
        verticalScrollbars && classNames.liquid
      ),
      ref: this.bodyScrollerRef,
      clientWidthRef: this.handleClientWidth,
      children: u(DayGridRows, {
        dateProfile: props.dateProfile,
        todayRange: props.todayRange,
        cellRows: props.cellRows,
        forPrint: props.forPrint,
        isHitComboAllowed: props.isHitComboAllowed,
        className: classNames.grow,
        dayMaxEvents: props.forPrint ? void 0 : options.dayMaxEvents,
        dayMaxEventRows: options.dayMaxEventRows,
        // content
        fgEventSegs: props.fgEventSegs,
        bgEventSegs: props.bgEventSegs,
        businessHourSegs: props.businessHourSegs,
        dateSelectionSegs: props.dateSelectionSegs,
        eventDrag: props.eventDrag,
        eventResize: props.eventResize,
        eventSelection: props.eventSelection,
        // dimensions
        colWidth: appliedColWidth,
        width: canvasWidth,
        visibleWidth: totalWidth,
        cellIsNarrow,
        cellIsMicro,
        // refs
        rowHeightRefMap: props.rowHeightRefMap
      })
    }), Boolean(footerScrollbarSticky) && u(FooterScrollbar, { isSticky: true, canvasWidth, scrollerRef: this.footerScrollerRef }), u(Ruler, { widthRef: this.handleTotalWidth })] });
  }
  // Lifecycle
  // -----------------------------------------------------------------------------------------------
  componentDidMount() {
    this._isUnmounting = false;
    const ScrollerSyncer = getScrollerSyncerClass(this.context.pluginHooks);
    this.syncedScroller = new ScrollerSyncer(true);
    setRef(this.props.scrollerRef, this.syncedScroller);
    this.updateSyncedScroller();
  }
  componentDidUpdate() {
    this.updateSyncedScroller();
  }
  componentWillUnmount() {
    this._isUnmounting = true;
    this.syncedScroller.destroy();
  }
  // Scrolling
  // -----------------------------------------------------------------------------------------------
  updateSyncedScroller() {
    this.syncedScroller.handleChildren([
      this.headerScrollerRef.current,
      this.bodyScrollerRef.current,
      this.footerScrollerRef.current
    ]);
  }
};
var DayGridLayout = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.scrollerRef = M();
    this.rowHeightRefMap = new RefMap(() => {
      afterSize(this.updateScrollY);
    });
    this.scrollDate = null;
    this.updateScrollY = () => {
      if (this._isUnmounting)
        return;
      const rowHeightMap = this.rowHeightRefMap.current;
      const scroller = this.scrollerRef.current;
      if (scroller && this.scrollDate) {
        let scrollTop = computeTopFromDate(this.scrollDate, this.props.cellRows, rowHeightMap);
        if (scrollTop != null) {
          if (scrollTop) {
            scrollTop++;
          }
          scroller.scrollTo({ y: scrollTop });
        }
      }
    };
    this.handleScrollEnd = (isDevice) => {
      if (isDevice) {
        this.scrollDate = null;
      }
    };
  }
  render() {
    const { props, context } = this;
    const { options } = context;
    const { borderlessX, borderlessTop, borderlessBottom } = computeViewBorderless(options);
    const dateSelectionSegs = props.forPrint ? [] : props.dateSelectionSegs;
    const eventDrag = props.forPrint ? null : props.eventDrag;
    const eventResize = props.forPrint ? null : props.eventResize;
    const commonLayoutProps = __spreadProps(__spreadValues({}, props), {
      dateSelectionSegs,
      eventDrag,
      eventResize,
      scrollerRef: this.scrollerRef,
      rowHeightRefMap: this.rowHeightRefMap
    });
    return u(ViewContainer, { viewSpec: context.viewSpec, attrs: {
      role: "table",
      "aria-rowcount": props.headerTiers.length + props.cellRows.length,
      "aria-colcount": props.cellRows[0].length,
      "aria-labelledby": props.labelId,
      "aria-label": props.labelStr
    }, className: joinClassNames(props.className, !props.forPrint && classNames.flexCol, !props.forPrint && generateClassName(options.tableClass, {
      borderlessX,
      borderlessTop,
      borderlessBottom,
      multiMonthColumns: 0
    })), children: options.dayMinWidth ? u(DayGridLayoutPannable, __spreadProps(__spreadValues({}, commonLayoutProps), { dayMinWidth: options.dayMinWidth })) : u(DayGridLayoutNormal, __spreadValues({}, commonLayoutProps)) });
  }
  // Lifecycle
  // -----------------------------------------------------------------------------------------------
  componentDidMount() {
    this._isUnmounting = false;
    if (!this.props.forPrint) {
      this.resetScroll();
      this.scrollerRef.current?.addScrollEndListener(this.handleScrollEnd);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.forPrint && !this.props.forPrint) {
      this.scrollerRef.current?.addScrollEndListener(this.handleScrollEnd);
      this.resetScroll();
    }
    if (prevProps.dateProfile !== this.props.dateProfile && this.context.options.scrollTimeReset) {
      this.resetScroll();
    }
  }
  componentWillUnmount() {
    this._isUnmounting = true;
    this.scrollerRef.current?.removeScrollEndListener(this.handleScrollEnd);
  }
  // Scrolling
  // -----------------------------------------------------------------------------------------------
  resetScroll() {
    this.scrollDate = this.props.dateProfile.currentDate;
    this.updateScrollY();
    this.scrollerRef.current?.scrollTo({ x: 0 });
  }
};

// node_modules/fullcalendar/chunks/08b6f884.js
function buildDayColsFromSeries(daySeries, dateEnv, config = {}) {
  const { slotRange, majorUnit = "", activeRange } = config;
  return daySeries.dates.map((date) => ({
    key: date.toISOString(),
    date,
    range: slotRange ? {
      start: dateEnv.add(date, slotRange.slotMinTime),
      end: dateEnv.add(date, slotRange.slotMaxTime)
    } : {
      start: date,
      end: addDays(date, 1)
    },
    isMajor: majorUnit ? isMajorUnit(date, majorUnit, dateEnv) : false,
    isDisabled: activeRange === null || activeRange !== void 0 && !rangeContainsMarker(activeRange, date)
  }));
}
var EMPTY_EVENT_STORE = createEmptyEventStore();
var Splitter = class {
  constructor() {
    this.getKeysForEventDefs = memoize(this._getKeysForEventDefs);
    this.splitDateSelection = memoize(this._splitDateSpan);
    this.splitEventStore = memoize(this._splitEventStore);
    this.splitIndividualUi = memoize(this._splitIndividualUi);
    this.splitEventDrag = memoize(this._splitInteraction);
    this.splitEventResize = memoize(this._splitInteraction);
    this.eventUiBuilders = {};
  }
  splitProps(props) {
    let keyInfos = this.getKeyInfo(props);
    let defKeys = this.getKeysForEventDefs(props.eventStore);
    let dateSelections = this.splitDateSelection(props.dateSelection);
    let individualUi = this.splitIndividualUi(props.eventUiBases, defKeys);
    let eventStores = this.splitEventStore(props.eventStore, defKeys);
    let eventDrags = this.splitEventDrag(props.eventDrag);
    let eventResizes = this.splitEventResize(props.eventResize);
    let splitProps = {};
    this.eventUiBuilders = mapHash(keyInfos, (info, key) => this.eventUiBuilders[key] || memoize(buildEventUiForKey));
    for (let key in keyInfos) {
      let keyInfo = keyInfos[key];
      let eventStore = eventStores[key] || EMPTY_EVENT_STORE;
      let buildEventUi = this.eventUiBuilders[key];
      splitProps[key] = {
        businessHours: keyInfo.businessHours || props.businessHours,
        dateSelection: dateSelections[key] || null,
        eventStore,
        eventUiBases: buildEventUi(props.eventUiBases[""], keyInfo.ui, individualUi[key]),
        eventDrag: eventDrags[key] || null,
        eventResize: eventResizes[key] || null,
        eventSelection: eventStore.instances[props.eventSelection] ? props.eventSelection : ""
      };
    }
    return splitProps;
  }
  _splitDateSpan(dateSpan) {
    let dateSpans = {};
    if (dateSpan) {
      let keys = this.getKeysForDateSpan(dateSpan);
      for (let key of keys) {
        dateSpans[key] = dateSpan;
      }
    }
    return dateSpans;
  }
  _getKeysForEventDefs(eventStore) {
    return mapHash(eventStore.defs, (eventDef) => this.getKeysForEventDef(eventDef));
  }
  _splitEventStore(eventStore, defKeys) {
    let { defs, instances } = eventStore;
    let splitStores = {};
    for (let defId in defs) {
      for (let key of defKeys[defId]) {
        if (!splitStores[key]) {
          splitStores[key] = createEmptyEventStore();
        }
        splitStores[key].defs[defId] = defs[defId];
      }
    }
    for (let instanceId in instances) {
      let instance = instances[instanceId];
      for (let key of defKeys[instance.defId]) {
        if (splitStores[key]) {
          splitStores[key].instances[instanceId] = instance;
        }
      }
    }
    return splitStores;
  }
  _splitIndividualUi(eventUiBases, defKeys) {
    let splitHashes = {};
    for (let defId in eventUiBases) {
      if (defId) {
        for (let key of defKeys[defId]) {
          if (!splitHashes[key]) {
            splitHashes[key] = {};
          }
          splitHashes[key][defId] = eventUiBases[defId];
        }
      }
    }
    return splitHashes;
  }
  _splitInteraction(interaction) {
    let splitStates = {};
    if (interaction) {
      let affectedStores = this._splitEventStore(interaction.affectedEvents, this._getKeysForEventDefs(interaction.affectedEvents));
      let mutatedKeysByDefId = this._getKeysForEventDefs(interaction.mutatedEvents);
      let mutatedStores = this._splitEventStore(interaction.mutatedEvents, mutatedKeysByDefId);
      let populate = (key) => {
        if (!splitStates[key]) {
          splitStates[key] = {
            affectedEvents: affectedStores[key] || EMPTY_EVENT_STORE,
            mutatedEvents: mutatedStores[key] || EMPTY_EVENT_STORE,
            isEvent: interaction.isEvent
          };
        }
      };
      for (let key in affectedStores) {
        populate(key);
      }
      for (let key in mutatedStores) {
        populate(key);
      }
    }
    return splitStates;
  }
};
function buildEventUiForKey(allUi, eventUiForKey, individualUi) {
  let baseParts = [];
  if (allUi) {
    baseParts.push(allUi);
  }
  if (eventUiForKey) {
    baseParts.push(eventUiForKey);
  }
  let stuff = {
    "": combineEventUis(baseParts)
  };
  if (individualUi) {
    Object.assign(stuff, individualUi);
  }
  return stuff;
}
var AllDaySplitter = class extends Splitter {
  getKeyInfo() {
    return {
      allDay: {},
      timed: {}
    };
  }
  getKeysForDateSpan(dateSpan) {
    if (dateSpan.allDay) {
      return ["allDay"];
    }
    return ["timed"];
  }
  getKeysForEventDef(eventDef) {
    if (!eventDef.allDay) {
      return ["timed"];
    }
    if (hasBgRendering(eventDef)) {
      return ["timed", "allDay"];
    }
    return ["allDay"];
  }
};
var DayTimeColsSlicer = class extends Slicer {
  sliceRange(range, dayRanges) {
    let segs = [];
    for (let col = 0; col < dayRanges.length; col += 1) {
      let segRange = intersectRanges(range, dayRanges[col]);
      if (segRange) {
        segs.push({
          startDate: segRange.start,
          endDate: segRange.end,
          isStart: segRange.start.valueOf() === range.start.valueOf(),
          isEnd: segRange.end.valueOf() === range.end.valueOf(),
          col
        });
      }
    }
    return segs;
  }
};
function organizeSegsByCol(segs, colCount) {
  let segsByCol = [];
  let i2;
  for (i2 = 0; i2 < colCount; i2 += 1) {
    segsByCol.push([]);
  }
  if (segs) {
    for (i2 = 0; i2 < segs.length; i2 += 1) {
      segsByCol[segs[i2].col].push(segs[i2]);
    }
  }
  return segsByCol;
}
function splitInteractionByCol(ui, colCount) {
  let byRow = [];
  if (!ui) {
    for (let i2 = 0; i2 < colCount; i2 += 1) {
      byRow[i2] = null;
    }
  } else {
    for (let i2 = 0; i2 < colCount; i2 += 1) {
      byRow[i2] = {
        affectedInstances: ui.affectedInstances,
        isEvent: ui.isEvent,
        segs: []
      };
    }
    for (let seg of ui.segs) {
      byRow[seg.col].segs.push(seg);
    }
  }
  return byRow;
}
var STOCK_SUB_DURATIONS = [
  { hours: 1 },
  { minutes: 30 },
  { minutes: 15 },
  { seconds: 30 },
  { seconds: 15 }
];
function buildSlatMetas(slotMinTime, slotMaxTime, explicitLabelInterval, slotDuration, dateEnv) {
  let dayStart = /* @__PURE__ */ new Date(0);
  let slatTime = slotMinTime;
  let slatIterator = createDuration(0);
  let labelInterval = explicitLabelInterval || computeLabelInterval(slotDuration);
  let metas = [];
  let i2 = 0;
  while (asRoughMs(slatTime) < asRoughMs(slotMaxTime)) {
    let date = dateEnv.add(dayStart, slatTime);
    let isLabeled = wholeDivideDurations(slatIterator, labelInterval) !== null;
    metas.push({
      date,
      time: slatTime,
      key: date.toISOString(),
      // we can't use the isoTimeStr for uniqueness when minTime/maxTime beyone 0h/24h
      isoTimeStr: formatIsoTimeString(date),
      isLabeled,
      isFirst: i2 === 0
    });
    slatTime = addDurations(slatTime, slotDuration);
    slatIterator = addDurations(slatIterator, slotDuration);
    i2 += 1;
  }
  return metas;
}
function computeLabelInterval(slotDuration) {
  let i2;
  let labelInterval;
  let slotsPerLabel;
  for (i2 = STOCK_SUB_DURATIONS.length - 1; i2 >= 0; i2 -= 1) {
    labelInterval = createDuration(STOCK_SUB_DURATIONS[i2]);
    slotsPerLabel = wholeDivideDurations(labelInterval, slotDuration);
    if (slotsPerLabel !== null && slotsPerLabel > 1) {
      return labelInterval;
    }
  }
  return slotDuration;
}
var TimeGridAllDayHeader = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.innerElRef = M();
  }
  render() {
    let { props } = this;
    let { options, viewApi } = this.context;
    let renderProps = {
      text: options.allDayText,
      view: viewApi,
      isNarrow: props.isNarrow
    };
    return u(ContentContainer, { tag: "div", attrs: {
      role: "rowheader"
    }, className: joinClassNames(classNames.flexRow, classNames.noMargin, classNames.noPadding, classNames.contentBox), style: {
      width: props.width
    }, renderProps, generatorName: "allDayHeaderContent", customGenerator: options.allDayHeaderContent, defaultGenerator: renderAllDayInner, classNameGenerator: options.allDayHeaderClass, didMount: options.allDayHeaderDidMount, willUnmount: options.allDayHeaderWillUnmount, children: (InnerContent) => u("div", { className: joinClassNames(classNames.flexRow, classNames.noShrink, classNames.whiteSpacePre), ref: this.innerElRef, children: u(InnerContent, { tag: "div", className: generateClassName(options.allDayHeaderInnerClass, renderProps) }) }) });
  }
  componentDidMount() {
    this._isUnmounting = false;
    const { props } = this;
    const innerEl = this.innerElRef.current;
    this.disconnectInnerWidth = watchWidth(innerEl, (width) => {
      if (this._isUnmounting)
        return;
      setRef(props.innerWidthRef, width);
    });
  }
  componentWillUnmount() {
    this._isUnmounting = true;
    this.disconnectInnerWidth();
    setRef(this.props.innerWidthRef, null);
  }
};
function renderAllDayInner(renderProps) {
  return renderProps.text;
}
var TimeGridAllDayLane = class extends DateComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.heightRef = M();
    this.handleMoreLinkEl = (el) => {
      this.disconnectMoreLinkHeight?.();
      this.disconnectMoreLinkHeight = void 0;
      if (el) {
        this.disconnectMoreLinkHeight = watchHeight(el, (height) => {
          if (this._isUnmounting)
            return;
          this.setState({ moreLinkHeight: height });
        });
      }
    };
    this.handleRootEl = (rootEl) => {
      this.rootEl = rootEl;
      if (rootEl) {
        this.context.registerInteractiveComponent(this, {
          el: rootEl
        });
      } else {
        this.context.unregisterInteractiveComponent(this);
      }
    };
  }
  render() {
    const { props, state } = this;
    const needsMoreLinkProbe = !props.forPrint && resolveDayGridPlacementMode(props.dayMaxEvents, props.dayMaxEventRows) === "auto";
    return u(S, { children: [u(DayGridRow, __spreadProps(__spreadValues({}, props), {
      moreLinkHeight: state.moreLinkHeight,
      /* BAD: these overwrite the props! caller might want to pass them */
      rootElRef: this.handleRootEl,
      heightRef: this.heightRef
    })), needsMoreLinkProbe && u(MoreLinkTrigger, { num: 1, display: "row", isNarrow: props.cellIsNarrow, isMicro: props.cellIsMicro, elRef: this.handleMoreLinkEl, className: classNames.offscreen, attrs: {
      "aria-hidden": true
      // redundant with .offscreen's visibility, but marks it as a probe
    } })] });
  }
  componentDidMount() {
    this._isUnmounting = false;
  }
  componentWillUnmount() {
    this._isUnmounting = true;
  }
  queryHit(isRtl, positionLeft, positionTop, elWidth) {
    const { props, heightRef } = this;
    const colCount = props.cells.length;
    const { col, left, right } = computeColFromPosition(positionLeft, elWidth, props.colWidth, colCount, isRtl);
    const cell = props.cells[col];
    if (cell.isInert) {
      return null;
    }
    const cellStartDate = cell.date;
    const cellEndDate = addDays(cellStartDate, 1);
    return {
      dateProfile: props.dateProfile,
      dateSpan: __spreadValues({
        range: {
          start: cellStartDate,
          end: cellEndDate
        },
        allDay: true
      }, cell.dateSpanProps),
      getDayEl: () => getCellEl(this.rootEl, col),
      rect: {
        left,
        right,
        top: 0,
        bottom: heightRef.current
      },
      layer: 0
    };
  }
};
function computeSlatHeight(expandRows, slatCnt, explicitSlatMinHeight = 0, slatInnerHeight, scrollerHeight) {
  if (!slatInnerHeight || !scrollerHeight) {
    return [void 0, false];
  }
  const slatMinHeight = Math.max(slatInnerHeight + 1, explicitSlatMinHeight);
  const slatLiquidHeight = scrollerHeight / slatCnt;
  let slatLiquid;
  let slatHeight;
  if (expandRows && slatLiquidHeight >= slatMinHeight) {
    slatLiquid = true;
    slatHeight = slatLiquidHeight;
  } else {
    slatLiquid = false;
    slatHeight = slatMinHeight;
  }
  return [slatHeight, slatLiquid];
}
function computeNowIndicatorDayDate(nowDate, nowIndicatorSegsByCol, cells) {
  const nowDayMs = startOfDay(nowDate).valueOf();
  let firstDayDate;
  for (let col = 0; col < cells.length; col++) {
    if (nowIndicatorSegsByCol[col]?.length) {
      const { date } = cells[col];
      if (date.valueOf() === nowDayMs) {
        return date;
      }
      if (!firstDayDate) {
        firstDayDate = date;
      }
    }
  }
  return firstDayDate;
}
function computeDateTopFrac(date, dateProfile, startOfDayDate) {
  if (!startOfDayDate) {
    startOfDayDate = startOfDay(date);
  }
  return computeTimeTopFrac(createDuration(date.valueOf() - startOfDayDate.valueOf()), dateProfile);
}
function computeTimeTopFrac(time, dateProfile) {
  const startMs = asRoughMs(dateProfile.slotMinTime);
  const endMs = asRoughMs(dateProfile.slotMaxTime);
  let frac = (time.milliseconds - startMs) / (endMs - startMs);
  frac = Math.max(0, frac);
  frac = Math.min(1, frac);
  return frac;
}
function computeFgSegVerticals(segs, dateProfile, colDate, slatCnt, slatHeight, eventMinHeight, eventShortHeight) {
  const res = [];
  if (slatHeight != null) {
    const totalHeight = slatHeight * slatCnt;
    for (const seg of segs) {
      const startFrac = computeDateTopFrac(seg.startDate, dateProfile, colDate);
      const endFrac = computeDateTopFrac(seg.endDate, dateProfile, colDate);
      const startCoord = startFrac * totalHeight;
      let endCoord = endFrac * totalHeight;
      let height = endCoord - startCoord;
      if (eventMinHeight != null && height < eventMinHeight) {
        height = eventMinHeight;
        endCoord = startCoord + height;
      }
      res.push({
        start: startCoord,
        end: endCoord,
        size: height,
        isShort: height <= eventShortHeight
      });
    }
  }
  return res;
}
function buildTimeGridSegPlacements(segs, segVerticals, eventOrderStrict, eventMaxStack) {
  const sourceSegs = [];
  const segVerticalBySeg = /* @__PURE__ */ new Map();
  for (let orderIndex = 0; orderIndex < segs.length; orderIndex += 1) {
    const seg = segs[orderIndex];
    const segVertical = segVerticals[orderIndex];
    if (segVertical) {
      const sourceSeg = __spreadProps(__spreadValues({}, seg), {
        key: seg.eventRange.instance.instanceId,
        start: segVertical.start,
        end: segVertical.end,
        orderIndex
      });
      sourceSegs.push(sourceSeg);
      segVerticalBySeg.set(sourceSeg, segVertical);
    }
  }
  const layout = layoutTimeGridColumnByMaxLevel(sourceSegs, eventMaxStack ?? Infinity, { orderStrict: eventOrderStrict ?? false });
  return {
    placements: layout.domOrderedPlacements.map((placement) => {
      const seg = placement.sourceSeg;
      return {
        seg,
        segVertical: segVerticalBySeg.get(seg),
        levelCoord: placement.levelCoord,
        thickness: placement.thickness,
        stackDepth: placement.backwardDepth,
        stackForward: placement.forwardDepth
      };
    }),
    hiddenGroups: layout.moreLinkGroups.map((group) => {
      const groupSegs = group.hiddenSlices.map((slice) => slice.sourceSeg);
      return {
        key: group.key,
        start: group.start,
        end: group.end,
        segs: groupSegs
      };
    })
  };
}
function layoutTimeGridColumnByMaxLevel(eventOrderedSegs, maxLevels, options) {
  const { segLevels, excludedSegs } = buildSegLevels(eventOrderedSegs, options.orderStrict, maxLevels);
  const placements = positionTimeGridPlacements(segLevels);
  const moreLinkGroups = groupLaterallyIntersecting(convertSegsToWholeSlices(excludedSegs));
  return {
    domOrderedPlacements: sortByAxisOrder(placements),
    moreLinkGroups
  };
}
function positionTimeGridPlacements(levels) {
  const placementLevels = levels.map((level, levelIndex) => level.map((sourceSeg) => ({
    sourceSeg,
    start: sourceSeg.start,
    end: sourceSeg.end,
    isStart: sourceSeg.isStart,
    isEnd: sourceSeg.isEnd,
    levelIndex
  })));
  const placements = flatArray(placementLevels);
  const collidersByKey = /* @__PURE__ */ new Map();
  const parentByKey = new Map(placements.map((placement) => [
    placement.sourceSeg.key,
    placement.sourceSeg.key
  ]));
  for (const placement of placements) {
    const colliders = [];
    for (let levelIndex = placement.levelIndex + 1; levelIndex < levels.length; levelIndex += 1) {
      colliders.push(...findIntersections(placementLevels[levelIndex], placement));
    }
    collidersByKey.set(placement.sourceSeg.key, colliders);
    for (const collider of colliders) {
      unionPlacementKeys(parentByKey, placement.sourceSeg.key, collider.sourceSeg.key);
    }
  }
  const maxLevelByRoot = /* @__PURE__ */ new Map();
  for (const placement of placements) {
    const root = findPlacementRoot(parentByKey, placement.sourceSeg.key);
    maxLevelByRoot.set(root, Math.max(maxLevelByRoot.get(root) ?? 0, placement.levelIndex));
  }
  const backwardDepthByKey = new Map(placements.map((placement) => [
    placement.sourceSeg.key,
    0
  ]));
  const forwardDepthByKey = new Map(placements.map((placement) => [
    placement.sourceSeg.key,
    0
  ]));
  for (const placement of placements) {
    const depth = backwardDepthByKey.get(placement.sourceSeg.key) + 1;
    for (const collider of collidersByKey.get(placement.sourceSeg.key)) {
      backwardDepthByKey.set(collider.sourceSeg.key, Math.max(backwardDepthByKey.get(collider.sourceSeg.key), depth));
    }
  }
  for (let index = placements.length - 1; index >= 0; index -= 1) {
    const placement = placements[index];
    let depth = 0;
    for (const collider of collidersByKey.get(placement.sourceSeg.key)) {
      depth = Math.max(depth, forwardDepthByKey.get(collider.sourceSeg.key) + 1);
    }
    forwardDepthByKey.set(placement.sourceSeg.key, depth);
  }
  return placements.map((placement) => {
    const key = placement.sourceSeg.key;
    const levelCount = maxLevelByRoot.get(findPlacementRoot(parentByKey, key)) + 1;
    let farLevel = levelCount;
    for (const collider of collidersByKey.get(key)) {
      farLevel = Math.min(farLevel, collider.levelIndex);
    }
    const levelCoord = placement.levelIndex / levelCount;
    const thickness = (farLevel - placement.levelIndex) / levelCount;
    return __spreadProps(__spreadValues({}, placement), {
      levelCoord,
      thickness,
      levelEndCoord: levelCoord + thickness,
      backwardDepth: backwardDepthByKey.get(key),
      forwardDepth: forwardDepthByKey.get(key)
    });
  });
}
function findPlacementRoot(parentByKey, key) {
  const parent = parentByKey.get(key);
  if (parent === key)
    return key;
  const root = findPlacementRoot(parentByKey, parent);
  parentByKey.set(key, root);
  return root;
}
function unionPlacementKeys(parentByKey, first, second) {
  const firstRoot = findPlacementRoot(parentByKey, first);
  const secondRoot = findPlacementRoot(parentByKey, second);
  if (firstRoot !== secondRoot)
    parentByKey.set(secondRoot, firstRoot);
}
var ESTIMATED_SLAT_HEIGHT = 50;
var isBrowserPrintQuirky = (
  /* true || */
  typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("firefox")
);
function computeTimeGridPrintMode(forPrint, eventPrintLayout) {
  if (!forPrint) {
    return "positioned";
  }
  return eventPrintLayout === "stack" || eventPrintLayout !== "grid" && isBrowserPrintQuirky ? "stack" : "positioned";
}
var DEFAULT_TIME_FORMAT = createFormatter({
  hour: "numeric",
  minute: "2-digit",
  meridiem: false
});
var TimeGridEvent = class extends BaseComponent {
  render() {
    const { props } = this;
    return u(StandardEvent, __spreadProps(__spreadValues({}, props), { display: "column", level: props.level, isNarrow: props.isNarrow, isShort: props.isShort, className: (
      // see note in TimeGridCol on why we use flexbox
      props.isLiquid ? classNames.liquid : ""
    ), disableLiquid: !props.isLiquid, defaultTimeFormat: DEFAULT_TIME_FORMAT }));
  }
};
var TimeGridMoreLink = class extends BaseComponent {
  render() {
    let { props } = this;
    return u("div", { role: "listitem", className: joinClassNames(classNames.abs, classNames.flexCol, classNames.end0, classNames.z9999), style: {
      top: props.top,
      height: props.height
    }, children: u(MoreLinkContainer, { className: classNames.liquid, display: "column", allDayDate: null, segs: props.hiddenSegs, hiddenSegs: props.hiddenSegs, dateSpanProps: props.dateSpanProps, renderProps: props.renderProps, dateProfile: props.dateProfile, todayRange: props.todayRange, popoverContent: () => renderPlainFgSegs(
      props.hiddenSegs,
      props,
      /* isMirror = */
      false
    ), forceTimed: true, isNarrow: props.isNarrow, isMicro: props.isMicro }) });
  }
};
var NowIndicatorDot = (props) => u(ViewContextType.Consumer, { children: (context) => {
  let { options } = context;
  return u("div", { className: joinClassNames(props.className, options.nowIndicatorDotClass), style: props.style });
} });
var NowIndicatorLineContainer = (props) => u(ViewContextType.Consumer, { children: (context) => {
  let { options } = context;
  let renderProps = {
    date: context.dateEnv.toDate(props.date),
    view: context.viewApi
  };
  return u(ContentContainer, { elRef: props.elRef, tag: props.tag || "div", attrs: props.attrs, className: props.className, style: props.style, renderProps, generatorName: "nowIndicatorLineContent", customGenerator: options.nowIndicatorLineContent, classNameGenerator: options.nowIndicatorLineClass, didMount: options.nowIndicatorLineDidMount, willUnmount: options.nowIndicatorLineWillUnmount, children: props.children });
} });
function TimeGridNowIndicatorLine(props) {
  const top = props.totalHeight != null ? props.totalHeight * computeDateTopFrac(props.nowDate, props.dateProfile, props.dayDate) : void 0;
  return u("div", { className: joinClassNames(classNames.fill, classNames.pointerEventsNone, classNames.z2), children: [u(NowIndicatorLineContainer, { className: joinClassNames(classNames.fillX, classNames.noMarginX, classNames.borderlessX), style: { top }, date: props.nowDate }), (props.showDot ?? true) && u(NowIndicatorDot, { className: joinClassNames(classNames.abs, classNames.start0), style: { top } })] });
}
var TimeGridCol = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.sortEventSegs = memoize(sortEventSegs);
    this.getDateMeta = memoize(getDateMeta);
  }
  render() {
    let { props, context } = this;
    let { options, dateEnv } = context;
    let isSelectMirror = options.selectMirror;
    let mirrorSegs = (
      // yuck
      props.eventDrag && props.eventDrag.segs || props.eventResize && props.eventResize.segs || isSelectMirror && props.dateSelectionSegs || []
    );
    let dateMeta = this.getDateMeta(props.date, dateEnv, props.dateProfile, props.todayRange);
    const baseClassName = joinClassNames(
      classNames.borderlessY,
      classNames.borderlessEnd,
      !props.borderStart && classNames.borderlessStart,
      props.width == null && classNames.liquid,
      classNames.rel,
      // origin for abs-positioned children within
      classNames.z1
    );
    const baseStyle = {
      width: props.width
    };
    const isStack = this.getIsStack();
    const renderProps = __spreadProps(__spreadValues(__spreadValues({}, dateMeta), props.renderProps), {
      isStack,
      isNarrow: props.isNarrow,
      isMajor: props.isMajor,
      view: context.viewApi
    });
    if (dateMeta.isDisabled) {
      return u("div", { role: "cell", "aria-disabled": true, className: joinClassNames(generateClassName(options.dayLaneClass, renderProps), baseClassName), style: baseStyle });
    }
    const innerClassName = joinClassNames(generateClassName(options.dayLaneInnerClass, renderProps), !isStack && classNames.fill, classNames.z1);
    const sortedFgSegs = this.sortEventSegs(props.fgEventSegs, options.eventOrder);
    return u(ContentContainer, { tag: "div", attrs: __spreadProps(__spreadValues(__spreadProps(__spreadValues({}, props.attrs), {
      role: "cell"
    }), dateMeta.isToday ? { "aria-current": "date" } : {}), {
      "data-date": formatDayString(props.date)
    }), className: baseClassName, style: baseStyle, renderProps, generatorName: void 0, classNameGenerator: options.dayLaneClass, didMount: options.dayLaneDidMount, willUnmount: options.dayLaneWillUnmount, children: () => u(S, { children: [this.renderFillSegs(props.businessHourSegs, "non-business"), this.renderFillSegs(props.bgEventSegs, "bg-event"), this.renderFillSegs(props.dateSelectionSegs, "highlight"), u("div", {
      // events and more-links are list items
      role: sortedFgSegs.length ? "list" : void 0,
      className: innerClassName,
      children: this.renderFgSegs(
        sortedFgSegs,
        /* isMirror = */
        false
      )
    }), Boolean(mirrorSegs.length) && // but only show it when there are actual mirror events, to avoid blocking clicks
    u("div", { className: innerClassName, children: this.renderFgSegs(
      mirrorSegs,
      /* isMirror = */
      true
    ) }), this.renderNowIndicator(props.nowIndicatorSegs)] }) });
  }
  renderFgSegs(sortedFgSegs, isMirror) {
    const { props } = this;
    if (this.getIsStack()) {
      return renderPlainFgSegs(sortedFgSegs, props, isMirror);
    }
    if (isMirror) {
      return this.renderPositionedMirrorSegs(sortedFgSegs);
    }
    return this.renderPositionedFgSegs(sortedFgSegs);
  }
  renderPositionedFgSegs(segs) {
    let { eventMaxStack, eventOrderStrict } = this.context.options;
    let segVerticals = this.computeSegVerticals(segs);
    let { placements, hiddenGroups } = buildTimeGridSegPlacements(segs, segVerticals, eventOrderStrict, eventMaxStack);
    return u(S, { children: [placements.map((placement) => this.renderPositionedSeg(
      placement.seg,
      placement.segVertical,
      this.computeSegHStyle(placement),
      placement.stackDepth,
      /* isMirror = */
      false
    )), this.renderHiddenGroups(hiddenGroups)] });
  }
  // Mirrors bypass normal-event admission so limits cannot hide them or create more links.
  renderPositionedMirrorSegs(segs) {
    let segVerticals = this.computeSegVerticals(segs);
    return segs.map((seg, index) => this.renderPositionedSeg(
      seg,
      segVerticals[index] || {},
      { left: 0, right: 0, zIndex: 0 },
      // full column width
      /* level = */
      0,
      /* isMirror = */
      true
    ));
  }
  renderPositionedSeg(seg, segVertical, hStyle, level, isMirror) {
    let { props } = this;
    let { eventRange } = seg;
    let { instanceId } = eventRange.instance;
    let isSelected = instanceId === props.eventSelection;
    if (isSelected) {
      hStyle.zIndex += 1e3;
    }
    let isDragging = Boolean(props.eventDrag && props.eventDrag.affectedInstances[instanceId]);
    let isResizing = Boolean(props.eventResize && props.eventResize.affectedInstances[instanceId]);
    let isInvisible = !isMirror && (isDragging || isResizing);
    return u("div", {
      role: isMirror ? void 0 : "listitem",
      // we would have used classNames.fill, but multi-page spanning breaks in Firefox
      // we would have used height:100%, but multi-page spanning breaks in Safari
      className: joinClassNames(classNames.abs, classNames.flexCol),
      style: __spreadValues({
        visibility: isInvisible ? "hidden" : void 0,
        top: segVertical.start,
        height: segVertical.size
      }, hStyle),
      children: u(TimeGridEvent, __spreadValues({ eventRange, slicedStart: seg.startDate, slicedEnd: seg.endDate, isStart: seg.isStart, isEnd: seg.isEnd, isDragging, isResizing, isMirror, isSelected, level, isNarrow: props.isNarrow, isShort: segVertical.isShort || false, isLiquid: true, renderProps: props.renderProps }, getEventRangeMeta(eventRange, props.todayRange, props.nowDate, props.nowMs)))
    }, instanceId);
  }
  /*
  A pixel floor is only meaningful against a real slat height, so it stays off
  while the height is assumed. See ESTIMATED_SLAT_HEIGHT for why, and for what
  the assumed pass does and does not guarantee.
  */
  // TODO: memoize this?
  computeSegVerticals(segs) {
    let { props, context } = this;
    let isMeasured = props.slatHeight != null;
    return computeFgSegVerticals(segs, props.dateProfile, props.date, props.slatCnt, props.slatHeight ?? ESTIMATED_SLAT_HEIGHT, isMeasured ? context.options.eventMinHeight : void 0, context.options.eventShortHeight);
  }
  /*
  NOTE: a group's coordinates come from computeFgSegVerticals, so eventMinHeight
  has already been applied to the segs it was formed from
  */
  renderHiddenGroups(hiddenGroups) {
    let { dateSpanProps, renderProps, dateProfile, todayRange, nowDate, nowMs, eventSelection, eventDrag, eventResize, isNarrow, isMicro } = this.props;
    return u(S, { children: hiddenGroups.map((hiddenGroup) => {
      return u(TimeGridMoreLink, { hiddenSegs: hiddenGroup.segs, top: hiddenGroup.start, height: hiddenGroup.end - hiddenGroup.start, isNarrow, isMicro, dateSpanProps, renderProps, dateProfile, todayRange, nowDate, nowMs, eventSelection, eventDrag, eventResize }, hiddenGroup.key);
    }) });
  }
  renderFillSegs(segs, fillType) {
    let { props, context } = this;
    let segVerticals = this.computeSegVerticals(segs);
    return u(S, { children: segs.map((seg, index) => {
      const { eventRange } = seg;
      const segVertical = segVerticals[index] || {};
      return u("div", { "aria-hidden": true, className: classNames.fillX, style: {
        top: segVertical.start,
        height: segVertical.size,
        // HACK to get bg fills to overlap cell-start border
        // which matches how dayGrid looks,
        // which is important because all-day background events, in TimeGrid,
        // will render on both at the same time
        marginInlineStart: -1
      }, children: fillType === "bg-event" ? u(BgEvent, __spreadValues({ eventRange, isStart: seg.isStart, isEnd: seg.isEnd, isNarrow: props.isNarrow, isShort: segVertical.isShort || false, isVertical: true, renderProps: props.renderProps }, getEventRangeMeta(eventRange, props.todayRange, props.nowDate, props.nowMs))) : renderFill(fillType, context.options) }, buildEventRangeKey(eventRange));
    }) });
  }
  renderNowIndicator(segs) {
    let { props } = this;
    if (props.forPrint || this.getIsStack()) {
      return;
    }
    return segs.map((seg, i2) => u(TimeGridNowIndicatorLine, { nowDate: seg.startDate, dayDate: props.date, dateProfile: props.dateProfile, totalHeight: props.slatHeight != null ? props.slatHeight * props.slatCnt : void 0, showDot: seg.showDot ?? true }, i2));
  }
  /*
  TODO: eventually move to width, not left+right
  */
  computeSegHStyle(segRect) {
    let { options } = this.context;
    let shouldOverlap = options.slotEventOverlap;
    let nearCoord = segRect.levelCoord;
    let farCoord = segRect.levelCoord + segRect.thickness;
    if (shouldOverlap) {
      farCoord = Math.min(1, nearCoord + (farCoord - nearCoord) * 2);
    }
    let props = {
      zIndex: segRect.stackDepth + 1,
      // convert from 0-base to 1-based
      insetInlineStart: fracToCssDim(nearCoord),
      insetInlineEnd: fracToCssDim(1 - farCoord),
      marginInlineEnd: void 0
    };
    if (shouldOverlap && segRect.stackForward) {
      props.marginInlineEnd = 10 * 2;
    }
    return props;
  }
  getIsStack() {
    const { eventPrintLayout } = this.context.options;
    return computeTimeGridPrintMode(this.props.forPrint, eventPrintLayout) === "stack";
  }
};
function renderPlainFgSegs(sortedFgSegs, { todayRange, nowDate, nowMs, eventSelection, eventDrag, eventResize, renderProps }, isMirror) {
  return u(S, { children: sortedFgSegs.map((seg) => {
    let { eventRange } = seg;
    let { instanceId } = eventRange.instance;
    let isDragging = Boolean(eventDrag && eventDrag.affectedInstances[instanceId]);
    let isResizing = Boolean(eventResize && eventResize.affectedInstances[instanceId]);
    let isInvisible = isDragging || isResizing;
    return u("div", { role: isMirror ? void 0 : "listitem", className: classNames.breakInsideAvoid, style: { visibility: isInvisible ? "hidden" : void 0 }, children: u(TimeGridEvent, __spreadValues({ eventRange, slicedStart: seg.startDate, slicedEnd: seg.endDate, isStart: seg.isStart, isEnd: seg.isEnd, isDragging, isResizing, isMirror, isSelected: instanceId === eventSelection, level: 0, isShort: false, isNarrow: false, disableResizing: true, renderProps }, getEventRangeMeta(eventRange, todayRange, nowDate, nowMs))) }, instanceId);
  }) });
}
var TimeGridCols = class extends DateComponent {
  constructor() {
    super(...arguments);
    this.processSlotOptions = memoize(processSlotOptions);
    this.handleRootEl = (el) => {
      this.rootEl = el;
      if (el) {
        this.context.registerInteractiveComponent(this, {
          el,
          isHitComboAllowed: this.props.isHitComboAllowed
        });
      } else {
        this.context.unregisterInteractiveComponent(this);
      }
    };
  }
  render() {
    const { props } = this;
    return u("div", { role: props.role, className: joinClassNames(props.className, classNames.flexRow), ref: this.handleRootEl, children: props.cells.map((cell, col) => u(TimeGridCol, {
      dateProfile: props.dateProfile,
      nowDate: props.nowDate,
      nowMs: props.nowMs,
      todayRange: props.todayRange,
      date: cell.date,
      isMajor: cell.isMajor,
      slatCnt: props.slatCnt,
      renderProps: cell.renderProps,
      attrs: cell.attrs,
      dateSpanProps: cell.dateSpanProps,
      forPrint: props.forPrint,
      borderStart: Boolean(col),
      isNarrow: props.cellIsNarrow,
      isMicro: props.cellIsMicro,
      // content
      fgEventSegs: props.fgEventSegsByCol[col],
      bgEventSegs: props.bgEventSegsByCol[col],
      businessHourSegs: props.businessHourSegsByCol[col],
      nowIndicatorSegs: props.nowIndicatorSegsByCol[col],
      dateSelectionSegs: props.dateSelectionSegsByCol[col],
      eventDrag: props.eventDragByCol[col],
      eventResize: props.eventResizeByCol[col],
      eventSelection: props.eventSelection,
      // dimensions
      width: props.colWidth,
      slatHeight: props.slatHeight
    }, cell.key)) });
  }
  queryHit(isRtl, positionLeft, positionTop, elWidth) {
    const { dateProfile, cells, colWidth, slatHeight } = this.props;
    const { dateEnv, options } = this.context;
    const { snapDuration, snapsPerSlot } = this.processSlotOptions(options.slotDuration, options.snapDuration);
    const colCount = cells.length;
    const { col, left, right } = computeColFromPosition(positionLeft, elWidth, colWidth, colCount, isRtl);
    const cell = cells[col];
    if (cell.isInert) {
      return null;
    }
    const slatIndex = Math.floor(positionTop / slatHeight);
    const slatTop = slatIndex * slatHeight;
    const partial = (positionTop - slatTop) / slatHeight;
    const localSnapIndex = Math.floor(partial * snapsPerSlot);
    const snapIndex = slatIndex * snapsPerSlot + localSnapIndex;
    const time = addDurations(dateProfile.slotMinTime, multiplyDuration(snapDuration, snapIndex));
    const start = dateEnv.add(cell.date, time);
    const end = dateEnv.add(start, snapDuration);
    return {
      dateProfile,
      dateSpan: __spreadValues({
        range: { start, end },
        allDay: false
      }, cell.dateSpanProps),
      getDayEl: () => getCellEl(this.rootEl, col),
      rect: {
        left,
        right,
        top: slatTop,
        bottom: slatTop + slatHeight
      },
      layer: 0
    };
  }
};
TimeGridCols.addPropsEquality({
  style: isPropsEqualShallow
});
function processSlotOptions(slotDuration, snapDurationOverride) {
  let snapDuration = snapDurationOverride || slotDuration;
  let snapsPerSlot = wholeDivideDurations(slotDuration, snapDuration);
  if (snapsPerSlot === null) {
    snapDuration = slotDuration;
    snapsPerSlot = 1;
  }
  return { snapDuration, snapsPerSlot };
}
var NowIndicatorHeaderContainer = (props) => u(ViewContextType.Consumer, { children: (context) => {
  let { options } = context;
  let renderProps = {
    date: context.dateEnv.toDate(props.date),
    view: context.viewApi
  };
  return u(ContentContainer, { elRef: props.elRef, tag: props.tag || "div", attrs: props.attrs, className: props.className, style: props.style, renderProps, generatorName: "nowIndicatorHeaderContent", customGenerator: options.nowIndicatorHeaderContent, classNameGenerator: options.nowIndicatorHeaderClass, didMount: options.nowIndicatorHeaderDidMount, willUnmount: options.nowIndicatorHeaderWillUnmount, children: props.children });
} });
function TimeGridNowIndicatorArrow(props) {
  return u("div", {
    // crop any overflow that the arrow/line might cause
    // TODO: just do this on the entire canvas within the scroller
    className: joinClassNames(classNames.fill, classNames.crop, classNames.pointerEventsNone, classNames.z2),
    children: u(NowIndicatorHeaderContainer, { className: classNames.abs, style: {
      top: props.totalHeight != null ? props.totalHeight * computeDateTopFrac(props.nowDate, props.dateProfile, props.dayDate) : void 0
    }, date: props.nowDate })
  });
}
var DEFAULT_SLAT_LABEL_FORMAT = createFormatter({
  hour: "numeric",
  minute: "2-digit",
  omitZeroMinute: true,
  meridiem: "short"
});
var TimeGridSlatHeader = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.createRenderProps = memoize(createRenderProps);
    this.innerElRef = M();
  }
  render() {
    let { props, context } = this;
    let { options } = context;
    let headerFormat = (
      // TODO: fully pre-parse
      options.slotHeaderFormat == null ? DEFAULT_SLAT_LABEL_FORMAT : Array.isArray(options.slotHeaderFormat) ? createFormatter(options.slotHeaderFormat[0]) : createFormatter(options.slotHeaderFormat)
    );
    let renderProps = this.createRenderProps(props.date, props.time, !props.isLabeled, props.isNarrow, props.isFirst, headerFormat, context);
    let className = joinClassNames(props.liquidHeight && classNames.liquid, classNames.flexRow, classNames.alignStart, classNames.noMargin, classNames.noPadding, classNames.borderlessX, classNames.borderlessBottom, !props.borderTop && classNames.borderlessTop);
    if (!props.isLabeled) {
      return u("div", { className: joinClassNames(generateClassName(options.slotHeaderClass, renderProps), className), style: {
        height: props.height
      } });
    }
    return u(ContentContainer, { tag: "div", attrs: {
      "data-time": props.isoTimeStr
    }, style: {
      height: props.height
    }, className, renderProps, generatorName: "slotHeaderContent", customGenerator: options.slotHeaderContent, defaultGenerator: renderInnerContent3, classNameGenerator: options.slotHeaderClass, didMount: options.slotHeaderDidMount, willUnmount: options.slotHeaderWillUnmount, children: (InnerContent) => u("div", { ref: this.innerElRef, className: joinClassNames(classNames.noShrink, classNames.whiteSpaceNoWrap, classNames.flexRow), children: u(InnerContent, { tag: "div", className: generateClassName(options.slotHeaderInnerClass, renderProps) }) }) });
  }
  componentDidMount() {
    this._isUnmounting = false;
    const { props } = this;
    const innerEl = this.innerElRef.current;
    if (innerEl) {
      this.disconnectInnerSize = watchSize(innerEl, (width, height) => {
        if (this._isUnmounting)
          return;
        setRef(props.innerWidthRef, width);
        setRef(props.innerHeightRef, height);
      });
    }
  }
  componentWillUnmount() {
    const { props } = this;
    this._isUnmounting = true;
    if (this.disconnectInnerSize) {
      this.disconnectInnerSize();
      setRef(props.innerWidthRef, null);
      setRef(props.innerHeightRef, null);
    }
  }
};
function createRenderProps(date, time, isMinor, isNarrow, isFirst, headerFormat, context) {
  return __spreadProps(__spreadValues({}, getDateMeta(date, context.dateEnv)), {
    level: 0,
    // axis level (for when multiple axes)
    text: joinDateTimeFormatParts(context.dateEnv.formatToParts(date, headerFormat)),
    time,
    isMajor: false,
    isMinor,
    isTime: true,
    isNarrow,
    hasNavLink: false,
    isFirst,
    view: context.viewApi
  });
}
function renderInnerContent3(props) {
  return props.text;
}
var TimeGridSlatLane = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.getDateMeta = memoize(getDateMeta);
  }
  render() {
    let { props, context } = this;
    let { options } = context;
    let renderProps = __spreadProps(__spreadValues({}, this.getDateMeta(props.date, context.dateEnv)), {
      time: props.time,
      isMajor: false,
      isMinor: !props.isLabeled,
      view: context.viewApi
    });
    return u(ContentContainer, { tag: "div", attrs: {
      "data-time": props.isoTimeStr
    }, className: joinClassNames(classNames.noMargin, classNames.noPadding, classNames.liquid, classNames.borderlessX, classNames.borderlessBottom, !props.borderTop && classNames.borderlessTop), renderProps, generatorName: void 0, classNameGenerator: options.slotLaneClass, didMount: options.slotLaneDidMount, willUnmount: options.slotLaneWillUnmount });
  }
};
var DEFAULT_WEEK_NUM_FORMAT2 = createFormatter({ week: "short" });
var TimeGridWeekNumber = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.innerElRef = M();
  }
  render() {
    let { props, context } = this;
    let { options, dateEnv } = context;
    let range = props.dateProfile.renderRange;
    let dayCnt = diffDays(range.start, range.end);
    let hasNavLink = dayCnt === 1 && options.navLinks;
    let weekDateMarker = range.start;
    let fullDateStr = buildDateStr(context, weekDateMarker, "week");
    let weekNum = dateEnv.computeWeekNumber(weekDateMarker);
    let weekTextParts = dateEnv.formatToParts(weekDateMarker, options.weekNumberFormat || DEFAULT_WEEK_NUM_FORMAT2);
    let weekText = joinDateTimeFormatParts(weekTextParts);
    let weekDateZoned = dateEnv.toDate(weekDateMarker);
    const weekNumberRenderProps = {
      num: weekNum,
      text: weekText,
      textParts: weekTextParts,
      date: weekDateZoned,
      isNarrow: props.isNarrow,
      hasNavLink,
      options: { dayMinWidth: options.dayMinWidth }
    };
    return u(ContentContainer, { tag: "div", attrs: {
      role: "columnheader"
    }, className: joinClassNames(classNames.flexRow, classNames.noMargin, classNames.noPadding, props.isLiquid ? classNames.liquid : classNames.contentBox), style: {
      width: props.width
    }, renderProps: weekNumberRenderProps, generatorName: "weekNumberHeaderContent", customGenerator: options.weekNumberHeaderContent, defaultGenerator: renderText, classNameGenerator: options.weekNumberHeaderClass, didMount: options.weekNumberHeaderDidMount, willUnmount: options.weekNumberHeaderWillUnmount, children: (InnerContent) => u(S, { children: [!hasNavLink && // navlink is already labeled
    u("div", { className: classNames.srOnly, children: fullDateStr }), u("div", { "aria-hidden": hasNavLink ? void 0 : true, ref: this.innerElRef, className: joinClassNames(classNames.flexRow, classNames.noShrink, classNames.whiteSpaceNoWrap), children: u(InnerContent, { tag: "div", attrs: hasNavLink ? buildNavLinkAttrs(
      context,
      range.start,
      "week",
      fullDateStr,
      /* isTabbable = */
      true,
      /* omitHint = */
      true
    ) : void 0, className: generateClassName(options.weekNumberHeaderInnerClass, weekNumberRenderProps) }) })] }) });
  }
  componentDidMount() {
    this._isUnmounting = false;
    const { props } = this;
    const innerEl = this.innerElRef.current;
    this.disconnectInnerSize = watchSize(innerEl, (width, height) => {
      if (this._isUnmounting)
        return;
      setRef(props.innerWidthRef, width);
      setRef(props.innerHeightRef, height);
    });
  }
  componentWillUnmount() {
    const { props } = this;
    this._isUnmounting = true;
    this.disconnectInnerSize();
    setRef(props.innerWidthRef, null);
    setRef(props.innerHeightRef, null);
  }
};
function TimeGridAxisEmpty(props) {
  return u("div", {
    role: "cell",
    className: props.isLiquid ? classNames.liquid : classNames.contentBox,
    style: { width: props.width }
  });
}
var TimeGridLayoutPannable = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.state = {
      headerTierHeights: []
    };
    this.headerLabelInnerWidthRefMap = new RefMap(() => {
      afterSize(this.handleAxisWidths);
    });
    this.headerLabelInnerHeightRefMap = new RefMap(() => {
      afterSize(this.handleHeaderHeights);
    });
    this.headerMainInnerHeightRefMap = new RefMap(() => {
      afterSize(this.handleHeaderHeights);
    });
    this.handleAllDayLabelInnerWidth = (width) => {
      this.allDayLabelInnerWidth = width;
      afterSize(this.handleAxisWidths);
    };
    this.slatLabelInnerWidthRefMap = new RefMap(() => {
      afterSize(this.handleAxisWidths);
    });
    this.slatLabelInnerHeightRefMap = new RefMap(() => {
      afterSize(this.handleSlatInnerHeights);
    });
    this.headerScrollerRef = M();
    this.allDayScrollerRef = M();
    this.mainScrollerRef = M();
    this.footScrollerRef = M();
    this.axisScrollerRef = M();
    this.handleTotalWidth = (totalWidth) => {
      if (this._isUnmounting)
        return;
      this.setState({ totalWidth });
    };
    this.handleBodyHeight = (bodyHeight) => {
      if (this._isUnmounting)
        return;
      this.setState({ bodyHeight });
    };
    this.handleClientWidth = (clientWidth) => {
      if (this._isUnmounting)
        return;
      this.setState({ clientWidth });
    };
    this.handleClientHeight = (clientHeight) => {
      if (this._isUnmounting)
        return;
      this.setState({ clientHeight });
    };
    this.handleStickyBottomScrollbarWidth = (sticykBottomScrollbarWidth) => {
      if (this._isUnmounting)
        return;
      this.setState({ sticykBottomScrollbarWidth });
    };
    this.handleHeaderHeights = () => {
      if (this._isUnmounting)
        return;
      const headerLabelInnerHeightMap = this.headerLabelInnerHeightRefMap.current;
      const headerMainInnerHeightMap = this.headerMainInnerHeightRefMap.current;
      const heights = [];
      for (const [tierNum, mainHeight] of headerMainInnerHeightMap.entries()) {
        heights[tierNum] = Math.max(headerLabelInnerHeightMap.get(tierNum) || 0, mainHeight);
      }
      this.setState({ headerTierHeights: heights });
    };
    this.handleSlatInnerHeights = () => {
      if (this._isUnmounting)
        return;
      const slatLabelInnerHeightMap = this.slatLabelInnerHeightRefMap.current;
      let max = 0;
      for (const slatLabelInnerHeight of slatLabelInnerHeightMap.values()) {
        max = Math.max(max, slatLabelInnerHeight);
      }
      if (this.state.slatInnerHeight !== max) {
        this.setState({ slatInnerHeight: max });
      }
    };
    this.handleAxisWidths = () => {
      if (this._isUnmounting)
        return;
      const headerLabelInnerWidthMap = this.headerLabelInnerWidthRefMap.current;
      const slatLabelInnerWidthMap = this.slatLabelInnerWidthRefMap.current;
      let max = this.allDayLabelInnerWidth || 0;
      for (const headerLabelInnerWidth of headerLabelInnerWidthMap.values()) {
        max = Math.max(max, headerLabelInnerWidth);
      }
      for (const slatLableInnerWidth of slatLabelInnerWidthMap.values()) {
        max = Math.max(max, slatLableInnerWidth);
      }
      if (this.state.axisWidth !== max) {
        this.setState({ axisWidth: max });
      }
    };
  }
  render() {
    const { props, state, context, headerLabelInnerWidthRefMap, headerLabelInnerHeightRefMap, headerMainInnerHeightRefMap, slatLabelInnerWidthRefMap, slatLabelInnerHeightRefMap } = this;
    const { nowDate, headerTiers, forPrint } = props;
    const nowIndicatorDayDate = !forPrint && context.options.nowIndicator ? computeNowIndicatorDayDate(nowDate, props.nowIndicatorSegsByCol, props.cells) : void 0;
    const { axisWidth, totalWidth, clientWidth, clientHeight, bodyHeight, sticykBottomScrollbarWidth } = state;
    const { options } = context;
    const { borderlessX, borderlessTop, borderlessBottom } = computeViewBorderless(options);
    const endScrollbarWidth = totalWidth != null && clientWidth != null && axisWidth != null ? totalWidth - clientWidth - (axisWidth + 1) : void 0;
    const verticalScrolling = !forPrint && !getIsHeightAuto(options);
    const tableHeaderSticky = !forPrint && getTableHeaderSticky(options);
    const footerScrollbarSticky = !forPrint && getFooterScrollbarSticky(options);
    const printStackEnabled = computeTimeGridPrintMode(forPrint, options.eventPrintLayout) === "stack";
    const absPrint = forPrint && !printStackEnabled;
    const simplePrint = forPrint && printStackEnabled;
    const colCount = props.cells.length;
    const [canvasWidth, appliedColWidth] = computeColWidth(colCount, props.dayMinWidth, clientWidth);
    const measuredColWidth = appliedColWidth ?? (clientWidth != null ? clientWidth / colCount : void 0);
    const cellIsMicro = measuredColWidth != null && measuredColWidth <= dayMicroWidth;
    const cellIsNarrow = cellIsMicro || measuredColWidth != null && measuredColWidth <= options.dayNarrowWidth;
    const slatCnt = props.slatMetas.length;
    const [slatHeight, slatLiquidHeight] = computeSlatHeight(
      // TODO: memo?
      verticalScrolling && options.expandRows,
      slatCnt,
      options.slotMinHeight,
      state.slatInnerHeight,
      clientHeight
    );
    this.slatHeight = slatHeight;
    const totalSlatHeight = (slatHeight || 0) * slatCnt;
    const forcedBodyHeight = absPrint ? totalSlatHeight : void 0;
    const rowsNotExpanding = verticalScrolling && !options.expandRows && clientHeight != null && clientHeight > totalSlatHeight;
    const firstBodyRowIndex = options.dayHeaders ? headerTiers.length + 1 : 1;
    const bottomScrollbarWidth = footerScrollbarSticky ? sticykBottomScrollbarWidth : bodyHeight != null && clientHeight != null ? bodyHeight - clientHeight : void 0;
    return u(S, { children: [options.dayHeaders && u("div", { className: joinClassNames(
      generateClassName(options.tableHeaderClass, {
        isSticky: tableHeaderSticky,
        borderlessX,
        borderlessTop,
        borderlessBottom,
        multiMonthColumns: 0
      }),
      // See the note in TimeGridLayout about why print doesn't use repeating headers.
      classNames.flexCol,
      tableHeaderSticky && classNames.tableHeaderSticky,
      classNames.z1
    ), children: [u("div", { className: classNames.flexRow, children: [u("div", { role: "rowgroup", className: classNames.contentBox, style: { width: axisWidth }, children: headerTiers.map((rowConfig, tierNum) => u("div", { role: "row", "aria-rowindex": tierNum + 1, className: joinClassNames(options.dayHeaderRowClass, classNames.flexRow, classNames.contentBox, classNames.borderlessX, classNames.borderlessTop, tierNum === props.headerTiers.length - 1 && classNames.borderlessBottom), style: {
      height: state.headerTierHeights[tierNum]
    }, children: options.weekNumbers && rowConfig.isDateRow ? u(TimeGridWeekNumber, { dateProfile: props.dateProfile, innerWidthRef: headerLabelInnerWidthRefMap.createRef(tierNum), innerHeightRef: headerLabelInnerHeightRefMap.createRef(tierNum), width: void 0, isLiquid: true, isNarrow: cellIsNarrow }) : u(TimeGridAxisEmpty, { width: void 0, isLiquid: true }) }, tierNum)) }), u("div", { className: generateClassName(options.slotHeaderDividerClass, {
      inTableHeader: true,
      options: { dayMinWidth: options.dayMinWidth }
    }) }), u(Scroller, { horizontal: true, hideScrollbars: true, className: joinClassNames(classNames.flexRow, classNames.liquid), ref: this.headerScrollerRef, children: [u("div", { role: "rowgroup", className: canvasWidth == null ? classNames.liquid : "", style: { width: canvasWidth }, children: props.headerTiers.map((rowConfig, tierNum) => k(DayGridHeaderRow, __spreadProps(__spreadValues({}, rowConfig), { key: tierNum, role: "row", rowIndex: tierNum, borderBottom: tierNum < props.headerTiers.length - 1, height: state.headerTierHeights[tierNum], colWidth: appliedColWidth, viewportWidth: clientWidth, innerHeightRef: headerMainInnerHeightRefMap.createRef(tierNum), cellIsNarrow, cellIsMicro, rowLevel: props.headerTiers.length - tierNum - 1 }))) }), Boolean(endScrollbarWidth) && u("div", { className: joinClassNames(generateClassName(options.fillerClass, { inTableHeader: true }), classNames.borderlessY, classNames.borderlessEnd), style: { minWidth: endScrollbarWidth } })] })] }), u("div", { className: generateClassName(options.dayHeaderDividerClass, {
      isSticky: tableHeaderSticky,
      multiMonthColumns: 0,
      options: { allDaySlot: Boolean(options.allDaySlot) }
    }) })] }), u("div", { role: "rowgroup", className: joinClassNames(generateClassName(options.tableBodyClass, {
      borderlessX,
      borderlessTop,
      borderlessBottom,
      multiMonthColumns: 0
    }), classNames.flexCol, verticalScrolling && classNames.liquid, classNames.isolate, classNames.z0), children: [options.allDaySlot && u(S, { children: [u("div", { role: "row", "aria-rowindex": firstBodyRowIndex, className: joinClassNames(classNames.flexRow, classNames.z1), children: [u(TimeGridAllDayHeader, { width: axisWidth, innerWidthRef: this.handleAllDayLabelInnerWidth, isNarrow: cellIsNarrow }), u("div", { className: generateClassName(options.slotHeaderDividerClass, {
      inTableHeader: false,
      options: { dayMinWidth: options.dayMinWidth }
    }) }), u(Scroller, {
      horizontal: true,
      hideScrollbars: true,
      // fill remaining width
      className: joinClassNames(classNames.flexRow, classNames.liquidX),
      ref: this.allDayScrollerRef,
      children: [u("div", { className: classNames.flexRow, style: { width: canvasWidth }, children: u(TimeGridAllDayLane, {
        dateProfile: props.dateProfile,
        todayRange: props.todayRange,
        cells: props.cells,
        showDayNumbers: false,
        forPrint,
        isHitComboAllowed: props.isHitComboAllowed,
        className: joinClassNames(classNames.borderless, classNames.liquidX),
        cellIsNarrow,
        cellIsMicro,
        // content
        fgEventSegs: props.fgEventSegs,
        bgEventSegs: props.bgEventSegs,
        businessHourSegs: props.businessHourSegs,
        dateSelectionSegs: props.dateSelectionSegs,
        eventSelection: props.eventSelection,
        eventDrag: props.eventDrag,
        eventResize: props.eventResize,
        dayMaxEvents: props.dayMaxEvents,
        dayMaxEventRows: props.dayMaxEventRows,
        // dimensions
        colWidth: appliedColWidth
      }) }), Boolean(endScrollbarWidth) && u("div", { className: joinClassNames(generateClassName(options.fillerClass, { inTableHeader: false }), classNames.borderlessY, classNames.borderlessEnd), style: { minWidth: endScrollbarWidth } })]
    })] }), u("div", { className: joinClassNames(options.allDayDividerClass, classNames.z2) })] }), u("div", { role: "row", "aria-rowindex": firstBodyRowIndex + (options.allDaySlot ? 1 : 0), className: joinClassNames(
      classNames.flexRow,
      classNames.rel,
      // for Ruler.fillStart
      verticalScrolling && classNames.liquid,
      classNames.z0
    ), children: [u(Scroller, { vertical: verticalScrolling, hideScrollbars: true, className: joinClassNames(classNames.flexCol, classNames.contentBox), style: {
      width: axisWidth
    }, ref: this.axisScrollerRef, clientHeightRef: this.handleBodyHeight, children: !simplePrint && u(S, { children: u("div", { role: "rowheader", className: joinClassNames(classNames.flexCol, classNames.grow, classNames.rel), style: {
      height: forcedBodyHeight
    }, children: [u("div", { className: classNames.srOnly, children: options.timedText }), u("div", { "aria-hidden": true, className: joinClassNames(classNames.flexCol, verticalScrolling && options.expandRows && classNames.grow, absPrint && classNames.fillX), children: props.slatMetas.map((slatMeta, slatI) => k(TimeGridSlatHeader, __spreadProps(__spreadValues({}, slatMeta), { key: slatMeta.key, innerWidthRef: slatLabelInnerWidthRefMap.createRef(slatMeta.key), innerHeightRef: slatLabelInnerHeightRefMap.createRef(slatMeta.key), borderTop: Boolean(slatI), isNarrow: cellIsNarrow, height: slatLiquidHeight ? void 0 : slatHeight, liquidHeight: slatLiquidHeight }))) }), nowIndicatorDayDate && u(TimeGridNowIndicatorArrow, { nowDate, dayDate: nowIndicatorDayDate, dateProfile: props.dateProfile, totalHeight: slatHeight != null ? slatHeight * slatCnt : void 0 }), Boolean(rowsNotExpanding || bottomScrollbarWidth) && u("div", { className: joinClassNames(generateClassName(options.fillerClass, { inTableHeader: false }), classNames.borderlessX, classNames.borderlessBottom, rowsNotExpanding && classNames.liquid), style: {
      minHeight: bottomScrollbarWidth
    } })] }) }) }), u("div", { className: generateClassName(options.slotHeaderDividerClass, {
      inTableHeader: false,
      options: { dayMinWidth: options.dayMinWidth }
    }) }), u("div", {
      // we need this div because it's bad for Scroller to have left/right borders,
      // AND because we need to containt the FooterScrollbar
      className: joinClassNames(classNames.flexCol, classNames.liquid),
      children: [u(Scroller, { vertical: verticalScrolling, horizontal: true, hideScrollbars: footerScrollbarSticky || // also means height:auto, so won't need vertical scrollbars anyway
      forPrint, className: joinClassNames(
        classNames.flexCol,
        classNames.rel,
        // for Ruler.fillStart
        verticalScrolling && classNames.liquid
      ), ref: this.mainScrollerRef, clientWidthRef: this.handleClientWidth, clientHeightRef: this.handleClientHeight, children: u("div", { className: joinClassNames(classNames.flexCol, classNames.grow, classNames.rel), style: {
        width: canvasWidth,
        height: forcedBodyHeight
      }, children: [u(TimeGridCols, {
        dateProfile: props.dateProfile,
        nowDate: props.nowDate,
        nowMs: props.nowMs,
        todayRange: props.todayRange,
        cells: props.cells,
        slatCnt,
        forPrint,
        isHitComboAllowed: props.isHitComboAllowed,
        className: simplePrint ? "" : classNames.fill,
        // content
        fgEventSegsByCol: props.fgEventSegsByCol,
        bgEventSegsByCol: props.bgEventSegsByCol,
        businessHourSegsByCol: props.businessHourSegsByCol,
        nowIndicatorSegsByCol: props.nowIndicatorSegsByCol,
        dateSelectionSegsByCol: props.dateSelectionSegsByCol,
        eventDragByCol: props.eventDragByCol,
        eventResizeByCol: props.eventResizeByCol,
        eventSelection: props.eventSelection,
        // dimensions
        colWidth: appliedColWidth,
        slatHeight,
        cellIsNarrow,
        cellIsMicro
      }), !simplePrint && u(S, { children: [u("div", { "aria-hidden": true, className: joinClassNames(classNames.flexCol, verticalScrolling && options.expandRows && classNames.grow, absPrint ? classNames.fillX : classNames.rel), children: props.slatMetas.map((slatMeta, slatI) => u("div", { className: joinClassNames(classNames.flexRow, slatLiquidHeight && classNames.liquid), style: {
        height: slatLiquidHeight ? "" : slatHeight
      }, children: k(TimeGridSlatLane, __spreadProps(__spreadValues({}, slatMeta), { key: slatMeta.key, borderTop: Boolean(slatI) })) }, slatMeta.key)) }), rowsNotExpanding && u("div", { className: joinClassNames(generateClassName(options.fillerClass, { inTableHeader: false }), classNames.borderlessX, classNames.borderlessBottom, classNames.liquid) })] })] }) }), Boolean(footerScrollbarSticky) && u(FooterScrollbar, { isSticky: true, canvasWidth, scrollerRef: this.footScrollerRef, scrollbarWidthRef: this.handleStickyBottomScrollbarWidth })]
    })] })] }), u(Ruler, { widthRef: this.handleTotalWidth })] });
  }
  // Lifecycle
  // -----------------------------------------------------------------------------------------------
  componentDidMount() {
    this._isUnmounting = false;
    this.initScrollers();
    this.updateSlatHeight();
  }
  componentDidUpdate() {
    this.updateScrollers();
    this.updateSlatHeight();
  }
  componentWillUnmount() {
    this._isUnmounting = true;
    this.destroyScrollers();
    this.prevSlatHeight = void 0;
    setRef(this.props.slatHeightRef, null);
  }
  updateSlatHeight() {
    if (this.prevSlatHeight !== this.slatHeight) {
      setRef(this.props.slatHeightRef, this.prevSlatHeight = this.slatHeight);
    }
  }
  // Scrolling
  // -----------------------------------------------------------------------------------------------
  initScrollers() {
    const ScrollerSyncer = getScrollerSyncerClass(this.context.pluginHooks);
    this.dayScroller = new ScrollerSyncer(true);
    this.timeScroller = new ScrollerSyncer();
    setRef(this.props.dayScrollerRef, this.dayScroller);
    setRef(this.props.timeScrollerRef, this.timeScroller);
    this.updateScrollers();
  }
  updateScrollers() {
    this.dayScroller.handleChildren([
      this.headerScrollerRef.current,
      this.allDayScrollerRef.current,
      this.mainScrollerRef.current,
      this.footScrollerRef.current
    ]);
    this.timeScroller.handleChildren([
      this.axisScrollerRef.current,
      this.mainScrollerRef.current
    ]);
  }
  destroyScrollers() {
    setRef(this.props.dayScrollerRef, null);
    setRef(this.props.timeScrollerRef, null);
  }
};
TimeGridLayoutPannable.addPropsEquality({
  headerTierHeights: isArraysEqual
});
var TimeGridLayoutNormal = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.headerLabelInnerWidthRefMap = new RefMap(() => {
      afterSize(this.handleAxisInnerWidths);
    });
    this.handleAllDayLabelInnerWidth = (width) => {
      this.allDayLabelInnerWidth = width;
      afterSize(this.handleAxisInnerWidths);
    };
    this.handleWeekNumberInnerWidth = (width) => {
      this.weekNumberInnerWidth = width;
      afterSize(this.handleAxisInnerWidths);
    };
    this.slatLabelInnerWidthRefMap = new RefMap(() => {
      afterSize(this.handleAxisInnerWidths);
    });
    this.slatLabelInnerHeightRefMap = new RefMap(() => {
      afterSize(this.handleSlatInnerHeights);
    });
    this.handleTotalWidth = (totalWidth) => {
      if (this._isUnmounting)
        return;
      requestAnimationFrame(() => {
        if (this._isUnmounting)
          return;
        this.setState({ totalWidth });
      });
    };
    this.handleClientWidth = (clientWidth) => {
      if (this._isUnmounting)
        return;
      this.setState({ clientWidth });
    };
    this.handleClientHeight = (clientHeight) => {
      if (this._isUnmounting)
        return;
      this.setState({ clientHeight });
    };
    this.handleAxisInnerWidths = () => {
      if (this._isUnmounting)
        return;
      const headerLabelInnerWidthMap = this.headerLabelInnerWidthRefMap.current;
      const slatLabelInnerWidthMap = this.slatLabelInnerWidthRefMap.current;
      let max = Math.max(
        this.weekNumberInnerWidth || 0,
        // might not exist
        this.allDayLabelInnerWidth || 0
        // guard against all-day slot hidden
      );
      for (const headerLabelInnerWidth of headerLabelInnerWidthMap.values()) {
        max = Math.max(max, headerLabelInnerWidth);
      }
      for (const slatLabelInnerWidth of slatLabelInnerWidthMap.values()) {
        max = Math.max(max, slatLabelInnerWidth);
      }
      if (this.state.axisWidth !== max) {
        this.setState({ axisWidth: max });
      }
    };
    this.handleSlatInnerHeights = () => {
      if (this._isUnmounting)
        return;
      const slatLabelInnerHeightMap = this.slatLabelInnerHeightRefMap.current;
      let max = 0;
      for (const slatLabelInnerHeight of slatLabelInnerHeightMap.values()) {
        max = Math.max(max, slatLabelInnerHeight);
      }
      if (this.state.slatInnerHeight !== max) {
        this.setState({ slatInnerHeight: max });
      }
    };
  }
  render() {
    const { props, state, context, slatLabelInnerWidthRefMap, slatLabelInnerHeightRefMap, headerLabelInnerWidthRefMap } = this;
    const { nowDate, forPrint } = props;
    const nowIndicatorDayDate = !forPrint && context.options.nowIndicator ? computeNowIndicatorDayDate(nowDate, props.nowIndicatorSegsByCol, props.cells) : void 0;
    const { axisWidth, clientWidth, totalWidth } = state;
    const { options } = context;
    const { borderlessX, borderlessTop, borderlessBottom } = computeViewBorderless(options);
    const endScrollbarWidth = totalWidth != null && clientWidth != null && !forPrint ? totalWidth - clientWidth : void 0;
    const verticalScrolling = !forPrint && !getIsHeightAuto(options);
    const tableHeaderSticky = !forPrint && getTableHeaderSticky(options);
    const slatCnt = props.slatMetas.length;
    const [slatHeight, slatLiquidHeight] = computeSlatHeight(verticalScrolling && options.expandRows, slatCnt, options.slotMinHeight, state.slatInnerHeight, state.clientHeight);
    this.slatHeight = slatHeight;
    const totalSlatHeight = (slatHeight || 0) * slatCnt;
    const rowsNotExpanding = verticalScrolling && !options.expandRows && state.clientHeight != null && state.clientHeight > totalSlatHeight;
    const printStackEnabled = computeTimeGridPrintMode(forPrint, options.eventPrintLayout) === "stack";
    const absPrint = forPrint && !printStackEnabled;
    const simplePrint = forPrint && printStackEnabled;
    const forcedBodyHeight = absPrint ? totalSlatHeight : void 0;
    const colCount = props.cells.length;
    const measuredColWidth = clientWidth != null ? clientWidth / colCount : void 0;
    const cellIsMicro = measuredColWidth != null && measuredColWidth <= dayMicroWidth;
    const cellIsNarrow = cellIsMicro || measuredColWidth != null && measuredColWidth <= options.dayNarrowWidth;
    return u(S, { children: [options.dayHeaders && u("div", { role: "rowgroup", className: joinClassNames(
      generateClassName(options.tableHeaderClass, {
        isSticky: tableHeaderSticky,
        borderlessX,
        borderlessTop,
        borderlessBottom,
        multiMonthColumns: 0
      }),
      // See the note in TimeGridLayout about why print doesn't use repeating headers.
      classNames.flexCol,
      tableHeaderSticky && classNames.tableHeaderSticky,
      classNames.z1
    ), children: [props.headerTiers.map((rowConfig, tierNum) => u("div", { role: "row", className: classNames.flexRow, children: [u("div", { className: joinClassNames(options.dayHeaderRowClass, classNames.flexRow, classNames.borderlessX, classNames.borderlessTop, tierNum === props.headerTiers.length - 1 && classNames.borderlessBottom), children: options.weekNumbers && rowConfig.isDateRow ? u(TimeGridWeekNumber, { dateProfile: props.dateProfile, innerWidthRef: this.handleWeekNumberInnerWidth, innerHeightRef: headerLabelInnerWidthRefMap.createRef(tierNum), width: axisWidth, isLiquid: false, isNarrow: cellIsNarrow }) : u(TimeGridAxisEmpty, { width: axisWidth, isLiquid: false }) }), u("div", { className: generateClassName(options.slotHeaderDividerClass, {
      inTableHeader: true,
      options: { dayMinWidth: options.dayMinWidth }
    }) }), u(DayGridHeaderRow, __spreadProps(__spreadValues({}, rowConfig), { className: classNames.liquid, borderBottom: tierNum < props.headerTiers.length - 1, viewportWidth: clientWidth, cellIsNarrow, cellIsMicro, rowLevel: props.headerTiers.length - tierNum - 1 })), Boolean(endScrollbarWidth) && u("div", { className: joinClassNames(generateClassName(options.fillerClass, { inTableHeader: true }), classNames.borderlessY, classNames.borderlessEnd), style: { minWidth: endScrollbarWidth } })] }, tierNum)), u("div", { className: generateClassName(options.dayHeaderDividerClass, {
      isSticky: tableHeaderSticky,
      multiMonthColumns: 0,
      options: { allDaySlot: Boolean(options.allDaySlot) }
    }) })] }), u("div", { role: "rowgroup", className: joinClassNames(generateClassName(options.tableBodyClass, {
      borderlessX,
      borderlessTop,
      borderlessBottom,
      multiMonthColumns: 0
    }), classNames.flexCol, verticalScrolling && classNames.liquid, classNames.isolate, classNames.z0), children: [options.allDaySlot && u(S, { children: [u("div", { role: "row", className: joinClassNames(classNames.flexRow, classNames.z1), children: [u(TimeGridAllDayHeader, { width: axisWidth, innerWidthRef: this.handleAllDayLabelInnerWidth, isNarrow: cellIsNarrow }), u("div", { className: generateClassName(options.slotHeaderDividerClass, {
      inTableHeader: false,
      options: { dayMinWidth: options.dayMinWidth }
    }) }), u(TimeGridAllDayLane, {
      dateProfile: props.dateProfile,
      todayRange: props.todayRange,
      cells: props.cells,
      showDayNumbers: false,
      forPrint,
      isHitComboAllowed: props.isHitComboAllowed,
      className: joinClassNames(classNames.liquidX, classNames.borderless),
      cellIsNarrow,
      cellIsMicro,
      // content
      fgEventSegs: props.fgEventSegs,
      bgEventSegs: props.bgEventSegs,
      businessHourSegs: props.businessHourSegs,
      dateSelectionSegs: props.dateSelectionSegs,
      eventDrag: props.eventDrag,
      eventResize: props.eventResize,
      eventSelection: props.eventSelection,
      dayMaxEvents: props.dayMaxEvents,
      dayMaxEventRows: props.dayMaxEventRows
    }), Boolean(endScrollbarWidth) && u("div", { className: joinClassNames(generateClassName(options.fillerClass, { inTableHeader: false }), classNames.borderlessY, classNames.borderlessEnd), style: { minWidth: endScrollbarWidth } })] }), u("div", { className: joinClassNames(options.allDayDividerClass, classNames.z2) })] }), u(Scroller, { vertical: verticalScrolling, className: joinClassNames(
      classNames.flexCol,
      classNames.rel,
      // for Ruler.fillStart
      verticalScrolling && classNames.liquid,
      classNames.z0
    ), ref: props.timeScrollerRef, clientWidthRef: this.handleClientWidth, clientHeightRef: this.handleClientHeight, children: u("div", { className: joinClassNames(classNames.flexCol, classNames.grow, classNames.rel), style: {
      // in print mode, this div creates the height and everything is absolutely positioned within
      // we need to do this so that slats positioning synces with events's positioning
      // otherwise, get out of sync on second page
      height: forcedBodyHeight
    }, children: [u("div", { role: "row", className: joinClassNames(classNames.flexRow, !simplePrint && classNames.fill), children: [u("div", { role: "rowheader", className: classNames.contentBox, style: { width: axisWidth }, children: u("div", { className: classNames.srOnly, children: options.timedText }) }), u("div", { className: generateClassName(options.slotHeaderDividerClass, {
      inTableHeader: false,
      options: { dayMinWidth: options.dayMinWidth }
    }) }), u(TimeGridCols, {
      dateProfile: props.dateProfile,
      nowDate: props.nowDate,
      nowMs: props.nowMs,
      todayRange: props.todayRange,
      cells: props.cells,
      slatCnt,
      forPrint,
      isHitComboAllowed: props.isHitComboAllowed,
      className: classNames.liquid,
      // content
      fgEventSegsByCol: props.fgEventSegsByCol,
      bgEventSegsByCol: props.bgEventSegsByCol,
      businessHourSegsByCol: props.businessHourSegsByCol,
      nowIndicatorSegsByCol: props.nowIndicatorSegsByCol,
      dateSelectionSegsByCol: props.dateSelectionSegsByCol,
      eventDragByCol: props.eventDragByCol,
      eventResizeByCol: props.eventResizeByCol,
      eventSelection: props.eventSelection,
      // dimensions
      slatHeight,
      cellIsNarrow,
      cellIsMicro
    })] }), !simplePrint && u(S, { children: [u("div", { "aria-hidden": true, className: joinClassNames(classNames.flexCol, verticalScrolling && options.expandRows && classNames.grow, absPrint ? classNames.fillX : classNames.rel), children: props.slatMetas.map((slatMeta, slatI) => u("div", { className: joinClassNames(slatLiquidHeight && classNames.liquid, classNames.flexRow), style: {
      height: slatLiquidHeight ? void 0 : slatHeight
    }, children: [u("div", {
      // the pannable version of TimeGrid has axis labels all consecutive in one column
      // simulate this for the non-pannable version
      className: classNames.flexCol,
      style: { width: axisWidth },
      children: k(TimeGridSlatHeader, __spreadProps(__spreadValues({}, slatMeta), { key: slatMeta.key, innerWidthRef: slatLabelInnerWidthRefMap.createRef(slatMeta.key), innerHeightRef: slatLabelInnerHeightRefMap.createRef(slatMeta.key), borderTop: Boolean(slatI), isNarrow: cellIsNarrow }))
    }), u("div", { className: generateClassName(options.slotHeaderDividerClass, {
      inTableHeader: false,
      options: { dayMinWidth: options.dayMinWidth }
    }), style: { visibility: "hidden" } }), k(TimeGridSlatLane, __spreadProps(__spreadValues({}, slatMeta), { key: slatMeta.key, borderTop: Boolean(slatI) }))] }, slatMeta.key)) }), rowsNotExpanding && u("div", { className: joinClassNames(generateClassName(options.fillerClass, { inTableHeader: false }), classNames.borderlessX, classNames.borderlessBottom, classNames.liquid) }), nowIndicatorDayDate && u(TimeGridNowIndicatorArrow, { nowDate, dayDate: nowIndicatorDayDate, dateProfile: props.dateProfile, totalHeight: slatHeight != null ? slatHeight * slatCnt : void 0 })] })] }) })] }), u(Ruler, { widthRef: this.handleTotalWidth })] });
  }
  // Lifecycle
  // -----------------------------------------------------------------------------------------------
  componentDidMount() {
    this._isUnmounting = false;
    this.updateSlatHeight();
  }
  componentDidUpdate() {
    this.updateSlatHeight();
  }
  componentWillUnmount() {
    this._isUnmounting = true;
    this.prevSlatHeight = void 0;
    setRef(this.props.slatHeightRef, null);
  }
  updateSlatHeight() {
    if (this.prevSlatHeight !== this.slatHeight) {
      setRef(this.props.slatHeightRef, this.prevSlatHeight = this.slatHeight);
    }
  }
};
function buildEmptySegCols(segsByCol) {
  return segsByCol.map(() => []);
}
function buildEmptyInteractionCols(interactionsByCol) {
  return interactionsByCol.map(() => null);
}
var TimeGridLayout = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.buildSlatMetas = memoize(buildSlatMetas);
    this.dayScrollerRef = M();
    this.timeScrollerRef = M();
    this.scrollState = {};
    this.handleSlatHeight = (slatHeight) => {
      if (this._isUnmounting)
        return;
      this.slatHeight = slatHeight;
      if (slatHeight != null) {
        afterSize(this.applyTimeScroll);
      }
    };
    this.handleTimeScrollRequest = (scrollTime) => {
      this.scrollState.time = scrollTime;
      this.scrollState.y = void 0;
      this.applyTimeScroll();
    };
    this.handleTimeScrollEnd = (isDevice) => {
      if (isDevice) {
        const y2 = this.timeScrollerRef.current.y;
        if (!this.props.forPrint) {
          this.scrollState.y = y2;
          this.scrollState.time = void 0;
        }
      }
    };
    this.applyTimeScroll = () => {
      const timeScroller = this.timeScrollerRef.current;
      const { slatHeight, scrollState } = this;
      let { y: y2, time } = scrollState;
      if (y2 == null && time && slatHeight != null && // Since applyTimeScroll is called by handleSlatHeight, could be called with null during cleanup,
      // and the timeScroller might not exist
      timeScroller) {
        y2 = computeTimeTopFrac(time, this.props.dateProfile) * (slatHeight * this.currentSlatCnt);
        if (y2) {
          y2++;
        }
        scrollState.y = y2;
      }
      if (y2 != null) {
        timeScroller.scrollTo({ y: y2 });
      }
    };
  }
  render() {
    const { props, context } = this;
    const { dateProfile } = props;
    const { options, dateEnv } = context;
    const { dayMinWidth } = options;
    const { borderlessX, borderlessTop, borderlessBottom } = computeViewBorderless(options);
    const slatMetas = this.buildSlatMetas(dateProfile.slotMinTime, dateProfile.slotMaxTime, options.slotHeaderInterval, options.slotDuration, dateEnv);
    this.currentSlatCnt = slatMetas.length;
    const dateSelectionSegs = props.forPrint ? [] : props.dateSelectionSegs;
    const eventDrag = props.forPrint ? null : props.eventDrag;
    const eventResize = props.forPrint ? null : props.eventResize;
    const dateSelectionSegsByCol = props.forPrint ? buildEmptySegCols(props.dateSelectionSegsByCol) : props.dateSelectionSegsByCol;
    const eventDragByCol = props.forPrint ? buildEmptyInteractionCols(props.eventDragByCol) : props.eventDragByCol;
    const eventResizeByCol = props.forPrint ? buildEmptyInteractionCols(props.eventResizeByCol) : props.eventResizeByCol;
    const commonLayoutProps = __spreadProps(__spreadValues({
      dateProfile,
      nowDate: props.nowDate,
      nowMs: props.nowMs,
      todayRange: props.todayRange,
      cells: props.cells,
      slatMetas,
      forPrint: props.forPrint,
      isHitComboAllowed: props.isHitComboAllowed,
      // header content
      headerTiers: props.headerTiers,
      // all-day content
      fgEventSegs: props.fgEventSegs,
      bgEventSegs: props.bgEventSegs,
      businessHourSegs: props.businessHourSegs,
      dateSelectionSegs,
      eventDrag,
      eventResize
    }, getAllDayMaxEventProps(options)), {
      // timed content
      fgEventSegsByCol: props.fgEventSegsByCol,
      bgEventSegsByCol: props.bgEventSegsByCol,
      businessHourSegsByCol: props.businessHourSegsByCol,
      nowIndicatorSegsByCol: props.nowIndicatorSegsByCol,
      dateSelectionSegsByCol,
      eventDragByCol,
      eventResizeByCol,
      // universal content
      eventSelection: props.eventSelection,
      // refs
      timeScrollerRef: this.timeScrollerRef,
      timeScrollState: this.scrollState,
      slatHeightRef: this.handleSlatHeight,
      borderlessX,
      borderlessBottom
    });
    return u(ViewContainer, { attrs: {
      role: "table",
      "aria-colcount": props.cells.length,
      "aria-labelledby": props.labelId,
      "aria-label": props.labelStr
    }, className: joinClassNames(
      props.className,
      generateClassName(options.tableClass, {
        borderlessX,
        borderlessTop,
        borderlessBottom,
        multiMonthColumns: 0
      }),
      // We don't use the repeating-header print treatment here because it works poorly:
      // - Firefox >85ish CAN have flexboxes within it, but those cannot do absolute positioning
      // - Chrome works okay, but abs-positioned events cover the repeated header
      //   Also, there's weird padding on the last page at bottom of container, which matches
      //   the height of the repeated header
      // - Safari was never able to do repeated headers in the first place
      !props.forPrint && classNames.flexCol,
      classNames.isolate
    ), viewSpec: context.viewSpec, children: dayMinWidth ? u(TimeGridLayoutPannable, __spreadProps(__spreadValues({}, commonLayoutProps), { dayMinWidth, dayScrollerRef: this.dayScrollerRef })) : u(TimeGridLayoutNormal, __spreadValues({}, commonLayoutProps)) });
  }
  // Lifecycle
  // -----------------------------------------------------------------------------------------------
  componentDidMount() {
    this._isUnmounting = false;
    this.resetScroll();
    this.context.emitter.on("_timeScrollRequest", this.handleTimeScrollRequest);
    const timeScroller = this.timeScrollerRef.current;
    if (timeScroller) {
      timeScroller.addScrollEndListener(this.handleTimeScrollEnd);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.dateProfile !== this.props.dateProfile && this.context.options.scrollTimeReset) {
      this.resetScroll();
    } else if (prevProps.forPrint && !this.props.forPrint) {
      this.applyTimeScroll();
    }
  }
  componentWillUnmount() {
    this._isUnmounting = true;
    this.context.emitter.off("_timeScrollRequest", this.handleTimeScrollRequest);
    const timeScroller = this.timeScrollerRef.current;
    if (timeScroller) {
      timeScroller.removeScrollEndListener(this.handleTimeScrollEnd);
    }
  }
  // Scrolling
  // -----------------------------------------------------------------------------------------------
  resetScroll() {
    this.handleTimeScrollRequest(this.context.options.scrollTime);
    const dayScroller = this.dayScrollerRef.current;
    if (dayScroller) {
      dayScroller.scrollTo({ x: 0 });
    }
  }
};
var AUTO_ALL_DAY_MAX_EVENT_ROWS = 5;
function getAllDayMaxEventProps(options) {
  let { dayMaxEvents, dayMaxEventRows } = options;
  if (dayMaxEvents === true || dayMaxEventRows === true) {
    dayMaxEvents = void 0;
    dayMaxEventRows = AUTO_ALL_DAY_MAX_EVENT_ROWS;
  }
  return { dayMaxEvents, dayMaxEventRows };
}

export {
  mergeViewOptionsMap,
  mergeCalendarOptions,
  isMergedPropsEqual,
  nn,
  pn,
  bn,
  memoize,
  memoizeObjArg,
  ViewContextType,
  buildViewContext,
  PureComponent,
  BaseComponent,
  RenderId,
  ContentContainer,
  generateClassName,
  getIsHeightAuto,
  NowTimerRunner,
  flushSyncWithSizeBatching,
  NowTimer,
  DateComponent,
  DelayedRunner,
  DateProfileGenerator,
  DayTableSlicer,
  DaySeriesSlicer,
  buildDateRowConfigs,
  DaySeriesModel,
  buildDayTableModel,
  createDayHeaderFormatter,
  DayGridLayout,
  buildDayColsFromSeries,
  AllDaySplitter,
  DayTimeColsSlicer,
  organizeSegsByCol,
  splitInteractionByCol,
  TimeGridLayout
};
//# sourceMappingURL=chunk-DKOMOQH6.js.map

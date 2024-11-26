var zi = Object.defineProperty;
var Zi = (i, t, e) => t in i ? zi(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var ve = (i, t, e) => Zi(i, typeof t != "symbol" ? t + "" : t, e);
class Bt {
  /**
   * @param {string} type Type.
   */
  constructor(t) {
    this.propagationStopped, this.defaultPrevented, this.type = t, this.target = null;
  }
  /**
   * Prevent default. This means that no emulated `click`, `singleclick` or `doubleclick` events
   * will be fired.
   * @api
   */
  preventDefault() {
    this.defaultPrevented = !0;
  }
  /**
   * Stop event propagation.
   * @api
   */
  stopPropagation() {
    this.propagationStopped = !0;
  }
}
const Yi = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
};
class Qn {
  constructor() {
    this.disposed = !1;
  }
  /**
   * Clean up.
   */
  dispose() {
    this.disposed || (this.disposed = !0, this.disposeInternal());
  }
  /**
   * Extension point for disposable objects.
   * @protected
   */
  disposeInternal() {
  }
}
function Ve(i, t) {
  return i > t ? 1 : i < t ? -1 : 0;
}
function ye(i, t, e) {
  if (i[0] <= t)
    return 0;
  const n = i.length;
  if (t <= i[n - 1])
    return n - 1;
  if (typeof e == "function") {
    for (let s = 1; s < n; ++s) {
      const r = i[s];
      if (r === t)
        return s;
      if (r < t)
        return e(t, i[s - 1], r) > 0 ? s - 1 : s;
    }
    return n - 1;
  }
  if (e > 0) {
    for (let s = 1; s < n; ++s)
      if (i[s] < t)
        return s - 1;
    return n - 1;
  }
  if (e < 0) {
    for (let s = 1; s < n; ++s)
      if (i[s] <= t)
        return s;
    return n - 1;
  }
  for (let s = 1; s < n; ++s) {
    if (i[s] == t)
      return s;
    if (i[s] < t)
      return i[s - 1] - t < t - i[s] ? s - 1 : s;
  }
  return n - 1;
}
function Ui(i, t) {
  const e = Array.isArray(t) ? t : [t], n = e.length;
  for (let s = 0; s < n; s++)
    i[i.length] = e[s];
}
function Jn(i, t) {
  const e = i.length;
  if (e !== t.length)
    return !1;
  for (let n = 0; n < e; n++)
    if (i[n] !== t[n])
      return !1;
  return !0;
}
function ki(i, t, e) {
  const n = t || Ve;
  return i.every(function(s, r) {
    if (r === 0)
      return !0;
    const o = n(i[r - 1], s);
    return !(o > 0 || o === 0);
  });
}
function Ze() {
}
function Wi(i) {
  let t, e, n;
  return function() {
    const s = Array.prototype.slice.call(arguments);
    return (!e || this !== n || !Jn(s, e)) && (n = this, e = s, t = i.apply(this, arguments)), t;
  };
}
function Ki(i) {
  function t() {
    let e;
    try {
      e = i();
    } catch (n) {
      return Promise.reject(n);
    }
    return e instanceof Promise ? e : Promise.resolve(e);
  }
  return t();
}
function ti(i) {
  for (const t in i)
    delete i[t];
}
function Vi(i) {
  let t;
  for (t in i)
    return !1;
  return !t;
}
class He extends Qn {
  /**
   * @param {*} [target] Default event target for dispatched events.
   */
  constructor(t) {
    super(), this.eventTarget_ = t, this.pendingRemovals_ = null, this.dispatching_ = null, this.listeners_ = null;
  }
  /**
   * @param {string} type Type.
   * @param {import("../events.js").Listener} listener Listener.
   */
  addEventListener(t, e) {
    if (!t || !e)
      return;
    const n = this.listeners_ || (this.listeners_ = {}), s = n[t] || (n[t] = []);
    s.includes(e) || s.push(e);
  }
  /**
   * Dispatches an event and calls all listeners listening for events
   * of this type. The event parameter can either be a string or an
   * Object with a `type` property.
   *
   * @param {import("./Event.js").default|string} event Event object.
   * @return {boolean|undefined} `false` if anyone called preventDefault on the
   *     event object or if any of the listeners returned false.
   * @api
   */
  dispatchEvent(t) {
    const e = typeof t == "string", n = e ? t : t.type, s = this.listeners_ && this.listeners_[n];
    if (!s)
      return;
    const r = e ? new Bt(t) : (
      /** @type {Event} */
      t
    );
    r.target || (r.target = this.eventTarget_ || this);
    const o = this.dispatching_ || (this.dispatching_ = {}), a = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    n in o || (o[n] = 0, a[n] = 0), ++o[n];
    let l;
    for (let h = 0, c = s.length; h < c; ++h)
      if ("handleEvent" in s[h] ? l = /** @type {import("../events.js").ListenerObject} */
      s[h].handleEvent(r) : l = /** @type {import("../events.js").ListenerFunction} */
      s[h].call(this, r), l === !1 || r.propagationStopped) {
        l = !1;
        break;
      }
    if (--o[n] === 0) {
      let h = a[n];
      for (delete a[n]; h--; )
        this.removeEventListener(n, Ze);
      delete o[n];
    }
    return l;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.listeners_ && ti(this.listeners_);
  }
  /**
   * Get the listeners for a specified event type. Listeners are returned in the
   * order that they will be called in.
   *
   * @param {string} type Type.
   * @return {Array<import("../events.js").Listener>|undefined} Listeners.
   */
  getListeners(t) {
    return this.listeners_ && this.listeners_[t] || void 0;
  }
  /**
   * @param {string} [type] Type. If not provided,
   *     `true` will be returned if this event target has any listeners.
   * @return {boolean} Has listeners.
   */
  hasListener(t) {
    return this.listeners_ ? t ? t in this.listeners_ : Object.keys(this.listeners_).length > 0 : !1;
  }
  /**
   * @param {string} type Type.
   * @param {import("../events.js").Listener} listener Listener.
   */
  removeEventListener(t, e) {
    if (!this.listeners_)
      return;
    const n = this.listeners_[t];
    if (!n)
      return;
    const s = n.indexOf(e);
    s !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (n[s] = Ze, ++this.pendingRemovals_[t]) : (n.splice(s, 1), n.length === 0 && delete this.listeners_[t]));
  }
}
const B = {
  /**
   * Generic change event. Triggered when the revision counter is increased.
   * @event module:ol/events/Event~BaseEvent#change
   * @api
   */
  CHANGE: "change",
  /**
   * Generic error event. Triggered when an error occurs.
   * @event module:ol/events/Event~BaseEvent#error
   * @api
   */
  ERROR: "error",
  BLUR: "blur",
  CLEAR: "clear",
  CONTEXTMENU: "contextmenu",
  CLICK: "click",
  DBLCLICK: "dblclick",
  DRAGENTER: "dragenter",
  DRAGOVER: "dragover",
  DROP: "drop",
  FOCUS: "focus",
  KEYDOWN: "keydown",
  KEYPRESS: "keypress",
  LOAD: "load",
  RESIZE: "resize",
  TOUCHMOVE: "touchmove",
  WHEEL: "wheel"
};
function ct(i, t, e, n, s) {
  if (s) {
    const o = e;
    e = function() {
      i.removeEventListener(t, e), o.apply(n ?? this, arguments);
    };
  } else n && n !== i && (e = e.bind(n));
  const r = {
    target: i,
    type: t,
    listener: e
  };
  return i.addEventListener(t, e), r;
}
function ce(i, t, e, n) {
  return ct(i, t, e, n, !0);
}
function st(i) {
  i && i.target && (i.target.removeEventListener(i.type, i.listener), ti(i));
}
class $t extends He {
  constructor() {
    super(), this.on = /** @type {ObservableOnSignature<import("./events").EventsKey>} */
    this.onInternal, this.once = /** @type {ObservableOnSignature<import("./events").EventsKey>} */
    this.onceInternal, this.un = /** @type {ObservableOnSignature<void>} */
    this.unInternal, this.revision_ = 0;
  }
  /**
   * Increases the revision counter and dispatches a 'change' event.
   * @api
   */
  changed() {
    ++this.revision_, this.dispatchEvent(B.CHANGE);
  }
  /**
   * Get the version number for this object.  Each time the object is modified,
   * its version number will be incremented.
   * @return {number} Revision.
   * @api
   */
  getRevision() {
    return this.revision_;
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onInternal(t, e) {
    if (Array.isArray(t)) {
      const n = t.length, s = new Array(n);
      for (let r = 0; r < n; ++r)
        s[r] = ct(this, t[r], e);
      return s;
    }
    return ct(
      this,
      /** @type {string} */
      t,
      e
    );
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onceInternal(t, e) {
    let n;
    if (Array.isArray(t)) {
      const s = t.length;
      n = new Array(s);
      for (let r = 0; r < s; ++r)
        n[r] = ce(this, t[r], e);
    } else
      n = ce(
        this,
        /** @type {string} */
        t,
        e
      );
    return e.ol_key = n, n;
  }
  /**
   * Unlisten for a certain type of event.
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @protected
   */
  unInternal(t, e) {
    const n = (
      /** @type {Object} */
      e.ol_key
    );
    if (n)
      Hi(n);
    else if (Array.isArray(t))
      for (let s = 0, r = t.length; s < r; ++s)
        this.removeEventListener(t[s], e);
    else
      this.removeEventListener(t, e);
  }
}
$t.prototype.on;
$t.prototype.once;
$t.prototype.un;
function Hi(i) {
  if (Array.isArray(i))
    for (let t = 0, e = i.length; t < e; ++t)
      st(i[t]);
  else
    st(
      /** @type {import("./events.js").EventsKey} */
      i
    );
}
function X() {
  throw new Error("Unimplemented abstract method.");
}
let qi = 0;
function it(i) {
  return i.ol_uid || (i.ol_uid = String(++qi));
}
class yn extends Bt {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, n) {
    super(t), this.key = e, this.oldValue = n;
  }
}
class Te extends $t {
  /**
   * @param {Object<string, *>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, it(this), this.values_ = null, t !== void 0 && this.setProperties(t);
  }
  /**
   * Gets a value.
   * @param {string} key Key name.
   * @return {*} Value.
   * @api
   */
  get(t) {
    let e;
    return this.values_ && this.values_.hasOwnProperty(t) && (e = this.values_[t]), e;
  }
  /**
   * Get a list of object property names.
   * @return {Array<string>} List of property names.
   * @api
   */
  getKeys() {
    return this.values_ && Object.keys(this.values_) || [];
  }
  /**
   * Get an object of all property names and values.
   * @return {Object<string, *>} Object.
   * @api
   */
  getProperties() {
    return this.values_ && Object.assign({}, this.values_) || {};
  }
  /**
   * Get an object of all property names and values.
   * @return {Object<string, *>?} Object.
   */
  getPropertiesInternal() {
    return this.values_;
  }
  /**
   * @return {boolean} The object has properties.
   */
  hasProperties() {
    return !!this.values_;
  }
  /**
   * @param {string} key Key name.
   * @param {*} oldValue Old value.
   */
  notify(t, e) {
    let n;
    n = `change:${t}`, this.hasListener(n) && this.dispatchEvent(new yn(n, t, e)), n = Yi.PROPERTYCHANGE, this.hasListener(n) && this.dispatchEvent(new yn(n, t, e));
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  addChangeListener(t, e) {
    this.addEventListener(`change:${t}`, e);
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  removeChangeListener(t, e) {
    this.removeEventListener(`change:${t}`, e);
  }
  /**
   * Sets a value.
   * @param {string} key Key name.
   * @param {*} value Value.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  set(t, e, n) {
    const s = this.values_ || (this.values_ = {});
    if (n)
      s[t] = e;
    else {
      const r = s[t];
      s[t] = e, r !== e && this.notify(t, r);
    }
  }
  /**
   * Sets a collection of key-value pairs.  Note that this changes any existing
   * properties and adds new ones (it does not remove any existing properties).
   * @param {Object<string, *>} values Values.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  setProperties(t, e) {
    for (const n in t)
      this.set(n, t[n], e);
  }
  /**
   * Apply any properties from another object without triggering events.
   * @param {BaseObject} source The source object.
   * @protected
   */
  applyProperties(t) {
    t.values_ && Object.assign(this.values_ || (this.values_ = {}), t.values_);
  }
  /**
   * Unsets a property.
   * @param {string} key Key name.
   * @param {boolean} [silent] Unset without triggering an event.
   * @api
   */
  unset(t, e) {
    if (this.values_ && t in this.values_) {
      const n = this.values_[t];
      delete this.values_[t], Vi(this.values_) && (this.values_ = null), e || this.notify(t, n);
    }
  }
}
const S = {
  OPACITY: "opacity",
  VISIBLE: "visible",
  EXTENT: "extent",
  Z_INDEX: "zIndex",
  MAX_RESOLUTION: "maxResolution",
  MIN_RESOLUTION: "minResolution",
  MAX_ZOOM: "maxZoom",
  MIN_ZOOM: "minZoom",
  SOURCE: "source",
  MAP: "map"
};
function Y(i, t) {
  if (!i)
    throw new Error(t);
}
function z(i, t, e) {
  return Math.min(Math.max(i, t), e);
}
function Bi(i, t, e, n, s, r) {
  const o = s - e, a = r - n;
  if (o !== 0 || a !== 0) {
    const l = ((i - e) * o + (t - n) * a) / (o * o + a * a);
    l > 1 ? (e = s, n = r) : l > 0 && (e += o * l, n += a * l);
  }
  return jt(i, t, e, n);
}
function jt(i, t, e, n) {
  const s = e - i, r = n - t;
  return s * s + r * r;
}
function $i(i) {
  const t = i.length;
  for (let n = 0; n < t; n++) {
    let s = n, r = Math.abs(i[n][n]);
    for (let a = n + 1; a < t; a++) {
      const l = Math.abs(i[a][n]);
      l > r && (r = l, s = a);
    }
    if (r === 0)
      return null;
    const o = i[s];
    i[s] = i[n], i[n] = o;
    for (let a = n + 1; a < t; a++) {
      const l = -i[a][n] / i[n][n];
      for (let h = n; h < t + 1; h++)
        n == h ? i[a][h] = 0 : i[a][h] += l * i[n][h];
    }
  }
  const e = new Array(t);
  for (let n = t - 1; n >= 0; n--) {
    e[n] = i[n][t] / i[n][n];
    for (let s = n - 1; s >= 0; s--)
      i[s][t] -= i[s][n] * e[n];
  }
  return e;
}
function ae(i) {
  return i * Math.PI / 180;
}
function Xt(i, t) {
  const e = i % t;
  return e * t < 0 ? e + t : e;
}
function Qi(i, t, e) {
  return i + e * (t - i);
}
function qe(i, t) {
  const e = Math.pow(10, t);
  return Math.round(i * e) / e;
}
function Tn(i, t) {
  return Math.round(qe(i, t));
}
function Gt(i, t) {
  return Math.floor(qe(i, t));
}
function Et(i, t) {
  return Math.ceil(qe(i, t));
}
class Ji extends Te {
  /**
   * @param {Options} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[S.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, Y(
      typeof e[S.OPACITY] == "number",
      "Layer opacity must be a number"
    ), e[S.VISIBLE] = t.visible !== void 0 ? t.visible : !0, e[S.Z_INDEX] = t.zIndex, e[S.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, e[S.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, e[S.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, e[S.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = e.className !== void 0 ? e.className : "ol-layer", delete e.className, this.setProperties(e), this.state_ = null;
  }
  /**
   * Get the background for this layer.
   * @return {BackgroundColor|false} Layer background.
   */
  getBackground() {
    return this.background_;
  }
  /**
   * @return {string} CSS class name.
   */
  getClassName() {
    return this.className_;
  }
  /**
   * This method is not meant to be called by layers or layer renderers because the state
   * is incorrect if the layer is included in a layer group.
   *
   * @param {boolean} [managed] Layer is managed.
   * @return {import("./Layer.js").State} Layer state.
   */
  getLayerState(t) {
    const e = this.state_ || /** @type {?} */
    {
      layer: this,
      managed: t === void 0 ? !0 : t
    }, n = this.getZIndex();
    return e.opacity = z(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = n === void 0 && !e.managed ? 1 / 0 : n, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return X();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return X();
  }
  /**
   * Return the {@link module:ol/extent~Extent extent} of the layer or `undefined` if it
   * will be visible regardless of extent.
   * @return {import("../extent.js").Extent|undefined} The layer extent.
   * @observable
   * @api
   */
  getExtent() {
    return (
      /** @type {import("../extent.js").Extent|undefined} */
      this.get(S.EXTENT)
    );
  }
  /**
   * Return the maximum resolution of the layer. Returns Infinity if
   * the layer has no maximum resolution set.
   * @return {number} The maximum resolution of the layer.
   * @observable
   * @api
   */
  getMaxResolution() {
    return (
      /** @type {number} */
      this.get(S.MAX_RESOLUTION)
    );
  }
  /**
   * Return the minimum resolution of the layer. Returns 0 if
   * the layer has no minimum resolution set.
   * @return {number} The minimum resolution of the layer.
   * @observable
   * @api
   */
  getMinResolution() {
    return (
      /** @type {number} */
      this.get(S.MIN_RESOLUTION)
    );
  }
  /**
   * Return the minimum zoom level of the layer. Returns -Infinity if
   * the layer has no minimum zoom set.
   * @return {number} The minimum zoom level of the layer.
   * @observable
   * @api
   */
  getMinZoom() {
    return (
      /** @type {number} */
      this.get(S.MIN_ZOOM)
    );
  }
  /**
   * Return the maximum zoom level of the layer. Returns Infinity if
   * the layer has no maximum zoom set.
   * @return {number} The maximum zoom level of the layer.
   * @observable
   * @api
   */
  getMaxZoom() {
    return (
      /** @type {number} */
      this.get(S.MAX_ZOOM)
    );
  }
  /**
   * Return the opacity of the layer (between 0 and 1).
   * @return {number} The opacity of the layer.
   * @observable
   * @api
   */
  getOpacity() {
    return (
      /** @type {number} */
      this.get(S.OPACITY)
    );
  }
  /**
   * @abstract
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return X();
  }
  /**
   * Return the value of this layer's `visible` property. To find out whether the layer
   * is visible on a map, use `isVisible()` instead.
   * @return {boolean} The value of the `visible` property of the layer.
   * @observable
   * @api
   */
  getVisible() {
    return (
      /** @type {boolean} */
      this.get(S.VISIBLE)
    );
  }
  /**
   * Return the Z-index of the layer, which is used to order layers before
   * rendering. Returns undefined if the layer is unmanaged.
   * @return {number|undefined} The Z-index of the layer.
   * @observable
   * @api
   */
  getZIndex() {
    return (
      /** @type {number|undefined} */
      this.get(S.Z_INDEX)
    );
  }
  /**
   * Sets the background color.
   * @param {BackgroundColor} [background] Background color.
   */
  setBackground(t) {
    this.background_ = t, this.changed();
  }
  /**
   * Set the extent at which the layer is visible.  If `undefined`, the layer
   * will be visible at all extents.
   * @param {import("../extent.js").Extent|undefined} extent The extent of the layer.
   * @observable
   * @api
   */
  setExtent(t) {
    this.set(S.EXTENT, t);
  }
  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  setMaxResolution(t) {
    this.set(S.MAX_RESOLUTION, t);
  }
  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  setMinResolution(t) {
    this.set(S.MIN_RESOLUTION, t);
  }
  /**
   * Set the maximum zoom (exclusive) at which the layer is visible.
   * Note that the zoom levels for layer visibility are based on the
   * view zoom level, which may be different from a tile source zoom level.
   * @param {number} maxZoom The maximum zoom of the layer.
   * @observable
   * @api
   */
  setMaxZoom(t) {
    this.set(S.MAX_ZOOM, t);
  }
  /**
   * Set the minimum zoom (inclusive) at which the layer is visible.
   * Note that the zoom levels for layer visibility are based on the
   * view zoom level, which may be different from a tile source zoom level.
   * @param {number} minZoom The minimum zoom of the layer.
   * @observable
   * @api
   */
  setMinZoom(t) {
    this.set(S.MIN_ZOOM, t);
  }
  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  setOpacity(t) {
    Y(typeof t == "number", "Layer opacity must be a number"), this.set(S.OPACITY, t);
  }
  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  setVisible(t) {
    this.set(S.VISIBLE, t);
  }
  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  setZIndex(t) {
    this.set(S.Z_INDEX, t);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.state_ && (this.state_.layer = null, this.state_ = null), super.disposeInternal();
  }
}
const kt = {
  /**
   * Triggered before a layer is rendered.
   * @event module:ol/render/Event~RenderEvent#prerender
   * @api
   */
  PRERENDER: "prerender",
  /**
   * Triggered after a layer is rendered.
   * @event module:ol/render/Event~RenderEvent#postrender
   * @api
   */
  POSTRENDER: "postrender",
  /**
   * Triggered before layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: "precompose",
  /**
   * Triggered after layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#postcompose
   * @api
   */
  POSTCOMPOSE: "postcompose",
  /**
   * Triggered when rendering is complete, i.e. all sources and tiles have
   * finished loading for the current viewport, and all tiles are faded in.
   * The event object will not have a `context` set.
   * @event module:ol/render/Event~RenderEvent#rendercomplete
   * @api
   */
  RENDERCOMPLETE: "rendercomplete"
}, ot = {
  ANIMATING: 0,
  INTERACTING: 1
}, et = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
}, ts = 42, Be = 256, $e = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class ei {
  /**
   * @param {Options} options Projection options.
   */
  constructor(t) {
    this.code_ = t.code, this.units_ = /** @type {import("./Units.js").Units} */
    t.units, this.extent_ = t.extent !== void 0 ? t.extent : null, this.worldExtent_ = t.worldExtent !== void 0 ? t.worldExtent : null, this.axisOrientation_ = t.axisOrientation !== void 0 ? t.axisOrientation : "enu", this.global_ = t.global !== void 0 ? t.global : !1, this.canWrapX_ = !!(this.global_ && this.extent_), this.getPointResolutionFunc_ = t.getPointResolution, this.defaultTileGrid_ = null, this.metersPerUnit_ = t.metersPerUnit;
  }
  /**
   * @return {boolean} The projection is suitable for wrapping the x-axis
   */
  canWrapX() {
    return this.canWrapX_;
  }
  /**
   * Get the code for this projection, e.g. 'EPSG:4326'.
   * @return {string} Code.
   * @api
   */
  getCode() {
    return this.code_;
  }
  /**
   * Get the validity extent for this projection.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent() {
    return this.extent_;
  }
  /**
   * Get the units of this projection.
   * @return {import("./Units.js").Units} Units.
   * @api
   */
  getUnits() {
    return this.units_;
  }
  /**
   * Get the amount of meters per unit of this projection.  If the projection is
   * not configured with `metersPerUnit` or a units identifier, the return is
   * `undefined`.
   * @return {number|undefined} Meters.
   * @api
   */
  getMetersPerUnit() {
    return this.metersPerUnit_ || $e[this.units_];
  }
  /**
   * Get the world extent for this projection.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getWorldExtent() {
    return this.worldExtent_;
  }
  /**
   * Get the axis orientation of this projection.
   * Example values are:
   * enu - the default easting, northing, elevation.
   * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
   *     or south orientated transverse mercator.
   * wnu - westing, northing, up - some planetary coordinate systems have
   *     "west positive" coordinate systems
   * @return {string} Axis orientation.
   * @api
   */
  getAxisOrientation() {
    return this.axisOrientation_;
  }
  /**
   * Is this projection a global projection which spans the whole world?
   * @return {boolean} Whether the projection is global.
   * @api
   */
  isGlobal() {
    return this.global_;
  }
  /**
   * Set if the projection is a global projection which spans the whole world
   * @param {boolean} global Whether the projection is global.
   * @api
   */
  setGlobal(t) {
    this.global_ = t, this.canWrapX_ = !!(t && this.extent_);
  }
  /**
   * @return {import("../tilegrid/TileGrid.js").default} The default tile grid.
   */
  getDefaultTileGrid() {
    return this.defaultTileGrid_;
  }
  /**
   * @param {import("../tilegrid/TileGrid.js").default} tileGrid The default tile grid.
   */
  setDefaultTileGrid(t) {
    this.defaultTileGrid_ = t;
  }
  /**
   * Set the validity extent for this projection.
   * @param {import("../extent.js").Extent} extent Extent.
   * @api
   */
  setExtent(t) {
    this.extent_ = t, this.canWrapX_ = !!(this.global_ && t);
  }
  /**
   * Set the world extent for this projection.
   * @param {import("../extent.js").Extent} worldExtent World extent
   *     [minlon, minlat, maxlon, maxlat].
   * @api
   */
  setWorldExtent(t) {
    this.worldExtent_ = t;
  }
  /**
   * Set the getPointResolution function (see {@link module:ol/proj.getPointResolution}
   * for this projection.
   * @param {function(number, import("../coordinate.js").Coordinate):number} func Function
   * @api
   */
  setGetPointResolution(t) {
    this.getPointResolutionFunc_ = t;
  }
  /**
   * Get the custom point resolution function for this projection (if set).
   * @return {function(number, import("../coordinate.js").Coordinate):number|undefined} The custom point
   * resolution function (if set).
   */
  getPointResolutionFunc() {
    return this.getPointResolutionFunc_;
  }
}
const Qt = 6378137, Nt = Math.PI * Qt, es = [-Nt, -Nt, Nt, Nt], ns = [-180, -85, 180, 85], se = Qt * Math.log(Math.tan(Math.PI / 2));
class Pt extends ei {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: es,
      global: !0,
      worldExtent: ns,
      getPointResolution: function(e, n) {
        return e / Math.cosh(n[1] / Qt);
      }
    });
  }
}
const xn = [
  new Pt("EPSG:3857"),
  new Pt("EPSG:102100"),
  new Pt("EPSG:102113"),
  new Pt("EPSG:900913"),
  new Pt("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new Pt("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function is(i, t, e, n) {
  const s = i.length;
  e = e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = i.slice() : t = new Array(s));
  for (let r = 0; r < s; r += n) {
    t[r] = Nt * i[r] / 180;
    let o = Qt * Math.log(Math.tan(Math.PI * (+i[r + 1] + 90) / 360));
    o > se ? o = se : o < -se && (o = -se), t[r + 1] = o;
  }
  return t;
}
function ss(i, t, e, n) {
  const s = i.length;
  e = e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = i.slice() : t = new Array(s));
  for (let r = 0; r < s; r += n)
    t[r] = 180 * i[r] / Nt, t[r + 1] = 360 * Math.atan(Math.exp(i[r + 1] / Qt)) / Math.PI - 90;
  return t;
}
const rs = 6378137, In = [-180, -90, 180, 90], os = Math.PI * rs / 180;
class wt extends ei {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: In,
      axisOrientation: e,
      global: !0,
      metersPerUnit: os,
      worldExtent: In
    });
  }
}
const Cn = [
  new wt("CRS:84"),
  new wt("EPSG:4326", "neu"),
  new wt("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new wt("urn:ogc:def:crs:OGC:2:84"),
  new wt("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new wt("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new wt("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let Ye = {};
function as(i) {
  return Ye[i] || Ye[i.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function ls(i, t) {
  Ye[i] = t;
}
let zt = {};
function ue(i, t, e) {
  const n = i.getCode(), s = t.getCode();
  n in zt || (zt[n] = {}), zt[n][s] = e;
}
function hs(i, t) {
  let e;
  return i in zt && t in zt[i] && (e = zt[i][t]), e;
}
const Z = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function wn(i) {
  const t = St();
  for (let e = 0, n = i.length; e < n; ++e)
    le(t, i[e]);
  return t;
}
function ni(i, t, e) {
  let n, s;
  return t < i[0] ? n = i[0] - t : i[2] < t ? n = t - i[2] : n = 0, e < i[1] ? s = i[1] - e : i[3] < e ? s = e - i[3] : s = 0, n * n + s * s;
}
function xe(i, t) {
  return ii(i, t[0], t[1]);
}
function de(i, t) {
  return i[0] <= t[0] && t[2] <= i[2] && i[1] <= t[1] && t[3] <= i[3];
}
function ii(i, t, e) {
  return i[0] <= t && t <= i[2] && i[1] <= e && e <= i[3];
}
function Mn(i, t) {
  const e = i[0], n = i[1], s = i[2], r = i[3], o = t[0], a = t[1];
  let l = Z.UNKNOWN;
  return o < e ? l = l | Z.LEFT : o > s && (l = l | Z.RIGHT), a < n ? l = l | Z.BELOW : a > r && (l = l | Z.ABOVE), l === Z.UNKNOWN && (l = Z.INTERSECTING), l;
}
function St() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function Jt(i, t, e, n, s) {
  return s ? (s[0] = i, s[1] = t, s[2] = e, s[3] = n, s) : [i, t, e, n];
}
function Qe(i) {
  return Jt(1 / 0, 1 / 0, -1 / 0, -1 / 0, i);
}
function cs(i, t) {
  const e = i[0], n = i[1];
  return Jt(e, n, e, n, t);
}
function us(i, t, e, n, s) {
  const r = Qe(s);
  return ri(r, i, t, e, n);
}
function si(i, t) {
  return i[0] == t[0] && i[2] == t[2] && i[1] == t[1] && i[3] == t[3];
}
function ds(i, t) {
  return t[0] < i[0] && (i[0] = t[0]), t[2] > i[2] && (i[2] = t[2]), t[1] < i[1] && (i[1] = t[1]), t[3] > i[3] && (i[3] = t[3]), i;
}
function le(i, t) {
  t[0] < i[0] && (i[0] = t[0]), t[0] > i[2] && (i[2] = t[0]), t[1] < i[1] && (i[1] = t[1]), t[1] > i[3] && (i[3] = t[1]);
}
function ri(i, t, e, n, s) {
  for (; e < n; e += s)
    gs(i, t[e], t[e + 1]);
  return i;
}
function gs(i, t, e) {
  i[0] = Math.min(i[0], t), i[1] = Math.min(i[1], e), i[2] = Math.max(i[2], t), i[3] = Math.max(i[3], e);
}
function oi(i, t) {
  let e;
  return e = t(Ie(i)), e || (e = t(Ce(i)), e) || (e = t(we(i)), e) || (e = t(At(i)), e) ? e : !1;
}
function Kt(i) {
  let t = 0;
  return te(i) || (t = P(i) * U(i)), t;
}
function Ie(i) {
  return [i[0], i[1]];
}
function Ce(i) {
  return [i[2], i[1]];
}
function Tt(i) {
  return [(i[0] + i[2]) / 2, (i[1] + i[3]) / 2];
}
function fs(i, t) {
  let e;
  if (t === "bottom-left")
    e = Ie(i);
  else if (t === "bottom-right")
    e = Ce(i);
  else if (t === "top-left")
    e = At(i);
  else if (t === "top-right")
    e = we(i);
  else
    throw new Error("Invalid corner");
  return e;
}
function Je(i, t, e, n, s) {
  const [r, o, a, l, h, c, u, d] = _s(
    i,
    t,
    e,
    n
  );
  return Jt(
    Math.min(r, a, h, u),
    Math.min(o, l, c, d),
    Math.max(r, a, h, u),
    Math.max(o, l, c, d),
    s
  );
}
function _s(i, t, e, n) {
  const s = t * n[0] / 2, r = t * n[1] / 2, o = Math.cos(e), a = Math.sin(e), l = s * o, h = s * a, c = r * o, u = r * a, d = i[0], f = i[1];
  return [
    d - l + u,
    f - h - c,
    d - l - u,
    f - h + c,
    d + l - u,
    f + h + c,
    d + l + u,
    f + h - c,
    d - l + u,
    f - h - c
  ];
}
function U(i) {
  return i[3] - i[1];
}
function Q(i, t, e) {
  const n = e || St();
  return Zt(i, t) ? (i[0] > t[0] ? n[0] = i[0] : n[0] = t[0], i[1] > t[1] ? n[1] = i[1] : n[1] = t[1], i[2] < t[2] ? n[2] = i[2] : n[2] = t[2], i[3] < t[3] ? n[3] = i[3] : n[3] = t[3]) : Qe(n), n;
}
function At(i) {
  return [i[0], i[3]];
}
function we(i) {
  return [i[2], i[3]];
}
function P(i) {
  return i[2] - i[0];
}
function Zt(i, t) {
  return i[0] <= t[2] && i[2] >= t[0] && i[1] <= t[3] && i[3] >= t[1];
}
function te(i) {
  return i[2] < i[0] || i[3] < i[1];
}
function ms(i, t) {
  return t ? (t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t) : i;
}
function Rs(i, t, e) {
  let n = !1;
  const s = Mn(i, t), r = Mn(i, e);
  if (s === Z.INTERSECTING || r === Z.INTERSECTING)
    n = !0;
  else {
    const o = i[0], a = i[1], l = i[2], h = i[3], c = t[0], u = t[1], d = e[0], f = e[1], g = (f - u) / (d - c);
    let _, R;
    r & Z.ABOVE && !(s & Z.ABOVE) && (_ = d - (f - h) / g, n = _ >= o && _ <= l), !n && r & Z.RIGHT && !(s & Z.RIGHT) && (R = f - (d - l) * g, n = R >= a && R <= h), !n && r & Z.BELOW && !(s & Z.BELOW) && (_ = d - (f - a) / g, n = _ >= o && _ <= l), !n && r & Z.LEFT && !(s & Z.LEFT) && (R = f - (d - o) * g, n = R >= a && R <= h);
  }
  return n;
}
function Es(i, t) {
  const e = t.getExtent(), n = Tt(i);
  if (t.canWrapX() && (n[0] < e[0] || n[0] >= e[2])) {
    const s = P(e), o = Math.floor(
      (n[0] - e[0]) / s
    ) * s;
    i[0] -= o, i[2] -= o;
  }
  return i;
}
function ai(i, t, e) {
  if (t.canWrapX()) {
    const n = t.getExtent();
    if (!isFinite(i[0]) || !isFinite(i[2]))
      return [[n[0], i[1], n[2], i[3]]];
    Es(i, t);
    const s = P(n);
    if (P(i) > s && !e)
      return [[n[0], i[1], n[2], i[3]]];
    if (i[0] < n[0])
      return [
        [i[0] + s, i[1], n[2], i[3]],
        [n[0], i[1], i[2], i[3]]
      ];
    if (i[2] > n[2])
      return [
        [i[0], i[1], n[2], i[3]],
        [n[0], i[1], i[2] - s, i[3]]
      ];
  }
  return [i];
}
function li(i, t) {
  const e = ("" + i).split("."), n = ("" + t).split(".");
  for (let s = 0; s < Math.max(e.length, n.length); s++) {
    const r = parseInt(e[s] || "0", 10), o = parseInt(n[s] || "0", 10);
    if (r > o)
      return 1;
    if (o > r)
      return -1;
  }
  return 0;
}
function ps(i, t) {
  return i[0] += +t[0], i[1] += +t[1], i;
}
function ge(i, t) {
  let e = !0;
  for (let n = i.length - 1; n >= 0; --n)
    if (i[n] != t[n]) {
      e = !1;
      break;
    }
  return e;
}
function ys(i, t) {
  const e = Math.cos(t), n = Math.sin(t), s = i[0] * e - i[1] * n, r = i[1] * e + i[0] * n;
  return i[0] = s, i[1] = r, i;
}
const Ts = 63710088e-1;
function vn(i, t, e) {
  e = e || Ts;
  const n = ae(i[1]), s = ae(t[1]), r = (s - n) / 2, o = ae(t[0] - i[0]) / 2, a = Math.sin(r) * Math.sin(r) + Math.sin(o) * Math.sin(o) * Math.cos(n) * Math.cos(s);
  return 2 * e * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function xs(...i) {
  console.warn(...i);
}
let Ue = !0;
function Is(i) {
  Ue = !1;
}
function tn(i, t) {
  if (t !== void 0) {
    for (let e = 0, n = i.length; e < n; ++e)
      t[e] = i[e];
    t = t;
  } else
    t = i.slice();
  return t;
}
function hi(i, t) {
  if (t !== void 0 && i !== t) {
    for (let e = 0, n = i.length; e < n; ++e)
      t[e] = i[e];
    i = t;
  }
  return i;
}
function Cs(i) {
  ls(i.getCode(), i), ue(i, i, tn);
}
function ws(i) {
  i.forEach(Cs);
}
function K(i) {
  return typeof i == "string" ? as(
    /** @type {string} */
    i
  ) : (
    /** @type {Projection} */
    i || null
  );
}
function Sn(i, t, e, n) {
  i = K(i);
  let s;
  const r = i.getPointResolutionFunc();
  if (r)
    s = r(t, e);
  else {
    const o = i.getUnits();
    if (o == "degrees" && !n || n == "degrees")
      s = t;
    else {
      const a = nn(
        i,
        K("EPSG:4326")
      );
      if (a === hi && o !== "degrees")
        s = t * i.getMetersPerUnit();
      else {
        let h = [
          e[0] - t / 2,
          e[1],
          e[0] + t / 2,
          e[1],
          e[0],
          e[1] - t / 2,
          e[0],
          e[1] + t / 2
        ];
        h = a(h, h, 2);
        const c = vn(h.slice(0, 2), h.slice(2, 4)), u = vn(h.slice(4, 6), h.slice(6, 8));
        s = (c + u) / 2;
      }
      const l = i.getMetersPerUnit();
      l !== void 0 && (s /= l);
    }
  }
  return s;
}
function An(i) {
  ws(i), i.forEach(function(t) {
    i.forEach(function(e) {
      t !== e && ue(t, e, tn);
    });
  });
}
function Ms(i, t, e, n) {
  i.forEach(function(s) {
    t.forEach(function(r) {
      ue(s, r, e), ue(r, s, n);
    });
  });
}
function en(i, t) {
  return i ? typeof i == "string" ? K(i) : (
    /** @type {Projection} */
    i
  ) : K(t);
}
function Wt(i, t) {
  if (i === t)
    return !0;
  const e = i.getUnits() === t.getUnits();
  return (i.getCode() === t.getCode() || nn(i, t) === tn) && e;
}
function nn(i, t) {
  const e = i.getCode(), n = t.getCode();
  let s = hs(e, n);
  return s || (s = hi), s;
}
function fe(i, t) {
  const e = K(i), n = K(t);
  return nn(e, n);
}
function ci(i, t, e) {
  return fe(t, e)(i, void 0, i.length);
}
function Pn(i, t) {
  return i;
}
function mt(i, t) {
  return Ue && !ge(i, [0, 0]) && i[0] >= -180 && i[0] <= 180 && i[1] >= -90 && i[1] <= 90 && (Ue = !1, xs(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), i;
}
function vs(i, t) {
  return i;
}
function ht(i, t) {
  return i;
}
function Ss() {
  An(xn), An(Cn), Ms(
    Cn,
    xn,
    is,
    ss
  );
}
Ss();
function On(i, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    function(n, s, r, o, a) {
      if (!n)
        return;
      if (!s && !t)
        return n;
      const l = t ? 0 : r[0] * s, h = t ? 0 : r[1] * s, c = a ? a[0] : 0, u = a ? a[1] : 0;
      let d = i[0] + l / 2 + c, f = i[2] - l / 2 + c, g = i[1] + h / 2 + u, _ = i[3] - h / 2 + u;
      d > f && (d = (f + d) / 2, f = d), g > _ && (g = (_ + g) / 2, _ = g);
      let R = z(n[0], d, f), E = z(n[1], g, _);
      if (o && e && s) {
        const m = 30 * s;
        R += -m * Math.log(1 + Math.max(0, d - n[0]) / m) + m * Math.log(1 + Math.max(0, n[0] - f) / m), E += -m * Math.log(1 + Math.max(0, g - n[1]) / m) + m * Math.log(1 + Math.max(0, n[1] - _) / m);
      }
      return [R, E];
    }
  );
}
function As(i) {
  return i;
}
function sn(i, t, e, n) {
  const s = P(t) / e[0], r = U(t) / e[1];
  return n ? Math.min(i, Math.max(s, r)) : Math.min(i, Math.min(s, r));
}
function rn(i, t, e) {
  let n = Math.min(i, t);
  const s = 50;
  return n *= Math.log(1 + s * Math.max(0, i / t - 1)) / s + 1, e && (n = Math.max(n, e), n /= Math.log(1 + s * Math.max(0, e / i - 1)) / s + 1), z(n, e / 2, t * 2);
}
function Ps(i, t, e, n) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(s, r, o, a) {
    if (s !== void 0) {
      const l = i[0], h = i[i.length - 1], c = e ? sn(
        l,
        e,
        o,
        n
      ) : l;
      if (a)
        return t ? rn(
          s,
          c,
          h
        ) : z(s, h, c);
      const u = Math.min(c, s), d = Math.floor(ye(i, u, r));
      return i[d] > c && d < i.length - 1 ? i[d + 1] : i[d];
    }
  };
}
function Os(i, t, e, n, s, r) {
  return n = n !== void 0 ? n : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(o, a, l, h) {
    if (o !== void 0) {
      const c = s ? sn(
        t,
        s,
        l,
        r
      ) : t;
      if (h)
        return n ? rn(
          o,
          c,
          e
        ) : z(o, e, c);
      const u = 1e-9, d = Math.ceil(
        Math.log(t / c) / Math.log(i) - u
      ), f = -a * (0.5 - u) + 0.5, g = Math.min(c, o), _ = Math.floor(
        Math.log(t / g) / Math.log(i) + f
      ), R = Math.max(d, _), E = t / Math.pow(i, R);
      return z(E, e, c);
    }
  };
}
function Ln(i, t, e, n, s) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(r, o, a, l) {
    if (r !== void 0) {
      const h = n ? sn(
        i,
        n,
        a,
        s
      ) : i;
      return !e || !l ? z(r, t, h) : rn(
        r,
        h,
        t
      );
    }
  };
}
function Ls(i) {
  if (i !== void 0)
    return 0;
}
function Fn(i) {
  if (i !== void 0)
    return i;
}
function Fs(i) {
  const t = 2 * Math.PI / i;
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    function(e, n) {
      if (n)
        return e;
      if (e !== void 0)
        return e = Math.floor(e / t + 0.5) * t, e;
    }
  );
}
function bs(i) {
  const t = ae(5);
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    function(e, n) {
      return n || e === void 0 ? e : Math.abs(e) <= t ? 0 : e;
    }
  );
}
function ui(i) {
  return Math.pow(i, 3);
}
function Ds(i) {
  return 1 - ui(1 - i);
}
function Gs(i) {
  return 3 * i * i - 2 * i * i * i;
}
new Array(6);
function he() {
  return [1, 0, 0, 1, 0, 0];
}
function nt(i, t) {
  const e = t[0], n = t[1];
  return t[0] = i[0] * e + i[2] * n + i[4], t[1] = i[1] * e + i[3] * n + i[5], t;
}
function Vt(i, t, e, n, s, r, o, a) {
  const l = Math.sin(r), h = Math.cos(r);
  return i[0] = n * h, i[1] = s * l, i[2] = -n * l, i[3] = s * h, i[4] = o * n * h - a * n * l + t, i[5] = o * s * l + a * s * h + e, i;
}
function Ns(i, t) {
  const e = js(t);
  Y(e !== 0, "Transformation matrix cannot be inverted");
  const n = t[0], s = t[1], r = t[2], o = t[3], a = t[4], l = t[5];
  return i[0] = o / e, i[1] = -s / e, i[2] = -r / e, i[3] = n / e, i[4] = (r * l - o * a) / e, i[5] = -(n * l - s * a) / e, i;
}
function js(i) {
  return i[0] * i[3] - i[1] * i[2];
}
const bn = [1e6, 1e6, 1e6, 1e6, 2, 2];
function Xs(i) {
  return "matrix(" + i.map(
    (e, n) => Math.round(e * bn[n]) / bn[n]
  ).join(", ") + ")";
}
function zs(i, t, e, n, s, r, o) {
  r = r || [], o = o || 2;
  let a = 0;
  for (let l = t; l < e; l += n) {
    const h = i[l], c = i[l + 1];
    r[a++] = s[0] * h + s[2] * c + s[4], r[a++] = s[1] * h + s[3] * c + s[5];
    for (let u = 2; u < o; u++)
      r[a++] = i[l + u];
  }
  return r && r.length != a && (r.length = a), r;
}
function Zs(i, t, e, n, s, r, o) {
  o = o || [];
  const a = Math.cos(s), l = Math.sin(s), h = r[0], c = r[1];
  let u = 0;
  for (let d = t; d < e; d += n) {
    const f = i[d] - h, g = i[d + 1] - c;
    o[u++] = h + f * a - g * l, o[u++] = c + f * l + g * a;
    for (let _ = d + 2; _ < d + n; ++_)
      o[u++] = i[_];
  }
  return o && o.length != u && (o.length = u), o;
}
function Ys(i, t, e, n, s, r, o, a) {
  a = a || [];
  const l = o[0], h = o[1];
  let c = 0;
  for (let u = t; u < e; u += n) {
    const d = i[u] - l, f = i[u + 1] - h;
    a[c++] = l + s * d, a[c++] = h + r * f;
    for (let g = u + 2; g < u + n; ++g)
      a[c++] = i[g];
  }
  return a && a.length != c && (a.length = c), a;
}
function Us(i, t, e, n, s, r, o) {
  o = o || [];
  let a = 0;
  for (let l = t; l < e; l += n) {
    o[a++] = i[l] + s, o[a++] = i[l + 1] + r;
    for (let h = l + 2; h < l + n; ++h)
      o[a++] = i[h];
  }
  return o && o.length != a && (o.length = a), o;
}
const Dn = he();
class ks extends Te {
  constructor() {
    super(), this.extent_ = St(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = Wi(
      (t, e, n) => {
        if (!n)
          return this.getSimplifiedGeometry(e);
        const s = this.clone();
        return s.applyTransform(n), s.getSimplifiedGeometry(e);
      }
    );
  }
  /**
   * Get a transformed and simplified version of the geometry.
   * @abstract
   * @param {number} squaredTolerance Squared tolerance.
   * @param {import("../proj.js").TransformFunction} [transform] Optional transform function.
   * @return {Geometry} Simplified geometry.
   */
  simplifyTransformed(t, e) {
    return this.simplifyTransformedInternal(
      this.getRevision(),
      t,
      e
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @abstract
   * @return {!Geometry} Clone.
   */
  clone() {
    return X();
  }
  /**
   * @abstract
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, e, n, s) {
    return X();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    const n = this.getClosestPoint([t, e]);
    return n[0] === t && n[1] === e;
  }
  /**
   * Return the closest point of the geometry to the passed point as
   * {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} point Point.
   * @param {import("../coordinate.js").Coordinate} [closestPoint] Closest point.
   * @return {import("../coordinate.js").Coordinate} Closest point.
   * @api
   */
  getClosestPoint(t, e) {
    return e = e || [NaN, NaN], this.closestPointXY(t[0], t[1], e, 1 / 0), e;
  }
  /**
   * Returns true if this geometry includes the specified coordinate. If the
   * coordinate is on the boundary of the geometry, returns false.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @return {boolean} Contains coordinate.
   * @api
   */
  intersectsCoordinate(t) {
    return this.containsXY(t[0], t[1]);
  }
  /**
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   */
  computeExtent(t) {
    return X();
  }
  /**
   * Get the extent of the geometry.
   * @param {import("../extent.js").Extent} [extent] Extent.
   * @return {import("../extent.js").Extent} extent Extent.
   * @api
   */
  getExtent(t) {
    if (this.extentRevision_ != this.getRevision()) {
      const e = this.computeExtent(this.extent_);
      (isNaN(e[0]) || isNaN(e[1])) && Qe(e), this.extentRevision_ = this.getRevision();
    }
    return ms(this.extent_, t);
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} angle Rotation angle in radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   */
  rotate(t, e) {
    X();
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   */
  scale(t, e, n) {
    X();
  }
  /**
   * Create a simplified version of this geometry.  For linestrings, this uses
   * the [Douglas Peucker](https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm)
   * algorithm.  For polygons, a quantization-based
   * simplification is used to preserve topology.
   * @param {number} tolerance The tolerance distance for simplification.
   * @return {Geometry} A new, simplified version of the original geometry.
   * @api
   */
  simplify(t) {
    return this.getSimplifiedGeometry(t * t);
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker
   * algorithm.
   * See https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm.
   * @abstract
   * @param {number} squaredTolerance Squared tolerance.
   * @return {Geometry} Simplified geometry.
   */
  getSimplifiedGeometry(t) {
    return X();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return X();
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @abstract
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   */
  applyTransform(t) {
    X();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return X();
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @abstract
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   */
  translate(t, e) {
    X();
  }
  /**
   * Transform each coordinate of the geometry from one coordinate reference
   * system to another. The geometry is modified in place.
   * For example, a line will be transformed to a line and a circle to a circle.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   *
   * @param {import("../proj.js").ProjectionLike} source The current projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @param {import("../proj.js").ProjectionLike} destination The desired projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @return {this} This geometry.  Note that original geometry is
   *     modified in place.
   * @api
   */
  transform(t, e) {
    const n = K(t), s = n.getUnits() == "tile-pixels" ? function(r, o, a) {
      const l = n.getExtent(), h = n.getWorldExtent(), c = U(h) / U(l);
      return Vt(
        Dn,
        h[0],
        h[3],
        c,
        -c,
        0,
        0,
        0
      ), zs(
        r,
        0,
        r.length,
        a,
        Dn,
        o
      ), fe(n, e)(
        r,
        o,
        a
      );
    } : fe(n, e);
    return this.applyTransform(s), this;
  }
}
class on extends ks {
  constructor() {
    super(), this.layout = "XY", this.stride = 2, this.flatCoordinates;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(t) {
    return us(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t
    );
  }
  /**
   * @abstract
   * @return {Array<*> | null} Coordinates.
   */
  getCoordinates() {
    return X();
  }
  /**
   * Return the first coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} First coordinate.
   * @api
   */
  getFirstCoordinate() {
    return this.flatCoordinates.slice(0, this.stride);
  }
  /**
   * @return {Array<number>} Flat coordinates.
   */
  getFlatCoordinates() {
    return this.flatCoordinates;
  }
  /**
   * Return the last coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} Last point.
   * @api
   */
  getLastCoordinate() {
    return this.flatCoordinates.slice(
      this.flatCoordinates.length - this.stride
    );
  }
  /**
   * Return the {@link import("./Geometry.js").GeometryLayout layout} of the geometry.
   * @return {import("./Geometry.js").GeometryLayout} Layout.
   * @api
   */
  getLayout() {
    return this.layout;
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker algorithm.
   * @param {number} squaredTolerance Squared tolerance.
   * @return {SimpleGeometry} Simplified geometry.
   * @override
   */
  getSimplifiedGeometry(t) {
    if (this.simplifiedGeometryRevision !== this.getRevision() && (this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = this.getRevision()), t < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && t <= this.simplifiedGeometryMaxMinSquaredTolerance)
      return this;
    const e = this.getSimplifiedGeometryInternal(t);
    return e.getFlatCoordinates().length < this.flatCoordinates.length ? e : (this.simplifiedGeometryMaxMinSquaredTolerance = t, this);
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {SimpleGeometry} Simplified geometry.
   * @protected
   */
  getSimplifiedGeometryInternal(t) {
    return this;
  }
  /**
   * @return {number} Stride.
   */
  getStride() {
    return this.stride;
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout} layout Layout.
   * @param {Array<number>} flatCoordinates Flat coordinates.
   */
  setFlatCoordinates(t, e) {
    this.stride = Gn(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    X();
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout|undefined} layout Layout.
   * @param {Array<*>} coordinates Coordinates.
   * @param {number} nesting Nesting.
   * @protected
   */
  setLayout(t, e, n) {
    let s;
    if (t)
      s = Gn(t);
    else {
      for (let r = 0; r < n; ++r) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      s = e.length, t = Ws(s);
    }
    this.layout = t, this.stride = s;
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   * @api
   * @override
   */
  applyTransform(t) {
    this.flatCoordinates && (t(
      this.flatCoordinates,
      this.flatCoordinates,
      this.layout.startsWith("XYZ") ? 3 : 2,
      this.stride
    ), this.changed());
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @param {number} angle Rotation angle in counter-clockwise radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   * @override
   */
  rotate(t, e) {
    const n = this.getFlatCoordinates();
    if (n) {
      const s = this.getStride();
      Zs(
        n,
        0,
        n.length,
        s,
        t,
        e,
        n
      ), this.changed();
    }
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   * @override
   */
  scale(t, e, n) {
    e === void 0 && (e = t), n || (n = Tt(this.getExtent()));
    const s = this.getFlatCoordinates();
    if (s) {
      const r = this.getStride();
      Ys(
        s,
        0,
        s.length,
        r,
        t,
        e,
        n,
        s
      ), this.changed();
    }
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   * @override
   */
  translate(t, e) {
    const n = this.getFlatCoordinates();
    if (n) {
      const s = this.getStride();
      Us(
        n,
        0,
        n.length,
        s,
        t,
        e,
        n
      ), this.changed();
    }
  }
}
function Ws(i) {
  let t;
  return i == 2 ? t = "XY" : i == 3 ? t = "XYZ" : i == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function Gn(i) {
  let t;
  return i == "XY" ? t = 2 : i == "XYZ" || i == "XYM" ? t = 3 : i == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function Nn(i, t, e, n, s, r, o) {
  const a = i[t], l = i[t + 1], h = i[e] - a, c = i[e + 1] - l;
  let u;
  if (h === 0 && c === 0)
    u = t;
  else {
    const d = ((s - a) * h + (r - l) * c) / (h * h + c * c);
    if (d > 1)
      u = e;
    else if (d > 0) {
      for (let f = 0; f < n; ++f)
        o[f] = Qi(
          i[t + f],
          i[e + f],
          d
        );
      o.length = n;
      return;
    } else
      u = t;
  }
  for (let d = 0; d < n; ++d)
    o[d] = i[u + d];
  o.length = n;
}
function di(i, t, e, n, s) {
  let r = i[t], o = i[t + 1];
  for (t += n; t < e; t += n) {
    const a = i[t], l = i[t + 1], h = jt(r, o, a, l);
    h > s && (s = h), r = a, o = l;
  }
  return s;
}
function Ks(i, t, e, n, s) {
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r];
    s = di(i, t, a, n, s), t = a;
  }
  return s;
}
function gi(i, t, e, n, s, r, o, a, l, h, c) {
  if (t == e)
    return h;
  let u, d;
  if (s === 0) {
    if (d = jt(
      o,
      a,
      i[t],
      i[t + 1]
    ), d < h) {
      for (u = 0; u < n; ++u)
        l[u] = i[t + u];
      return l.length = n, d;
    }
    return h;
  }
  c = c || [NaN, NaN];
  let f = t + n;
  for (; f < e; )
    if (Nn(
      i,
      f - n,
      f,
      n,
      o,
      a,
      c
    ), d = jt(o, a, c[0], c[1]), d < h) {
      for (h = d, u = 0; u < n; ++u)
        l[u] = c[u];
      l.length = n, f += n;
    } else
      f += n * Math.max(
        (Math.sqrt(d) - Math.sqrt(h)) / s | 0,
        1
      );
  if (Nn(
    i,
    e - n,
    t,
    n,
    o,
    a,
    c
  ), d = jt(o, a, c[0], c[1]), d < h) {
    for (h = d, u = 0; u < n; ++u)
      l[u] = c[u];
    l.length = n;
  }
  return h;
}
function Vs(i, t, e, n, s, r, o, a, l, h, c) {
  c = c || [NaN, NaN];
  for (let u = 0, d = e.length; u < d; ++u) {
    const f = e[u];
    h = gi(
      i,
      t,
      f,
      n,
      s,
      r,
      o,
      a,
      l,
      h,
      c
    ), t = f;
  }
  return h;
}
function Hs(i, t, e, n) {
  for (let s = 0, r = e.length; s < r; ++s)
    i[t++] = e[s];
  return t;
}
function fi(i, t, e, n) {
  for (let s = 0, r = e.length; s < r; ++s) {
    const o = e[s];
    for (let a = 0; a < n; ++a)
      i[t++] = o[a];
  }
  return t;
}
function qs(i, t, e, n, s) {
  s = s || [];
  let r = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = fi(
      i,
      t,
      e[o],
      n
    );
    s[r++] = l, t = l;
  }
  return s.length = r, s;
}
function Bs(i, t, e, n, s, r, o) {
  const a = (e - t) / n;
  if (a < 3) {
    for (; t < e; t += n)
      r[o++] = i[t], r[o++] = i[t + 1];
    return o;
  }
  const l = new Array(a);
  l[0] = 1, l[a - 1] = 1;
  const h = [t, e - n];
  let c = 0;
  for (; h.length > 0; ) {
    const u = h.pop(), d = h.pop();
    let f = 0;
    const g = i[d], _ = i[d + 1], R = i[u], E = i[u + 1];
    for (let m = d + n; m < u; m += n) {
      const y = i[m], T = i[m + 1], p = Bi(y, T, g, _, R, E);
      p > f && (c = m, f = p);
    }
    f > s && (l[(c - t) / n] = 1, d + n < c && h.push(d, c), c + n < u && h.push(c, u));
  }
  for (let u = 0; u < a; ++u)
    l[u] && (r[o++] = i[t + u * n], r[o++] = i[t + u * n + 1]);
  return o;
}
function Ot(i, t) {
  return t * Math.round(i / t);
}
function $s(i, t, e, n, s, r, o) {
  if (t == e)
    return o;
  let a = Ot(i[t], s), l = Ot(i[t + 1], s);
  t += n, r[o++] = a, r[o++] = l;
  let h, c;
  do
    if (h = Ot(i[t], s), c = Ot(i[t + 1], s), t += n, t == e)
      return r[o++] = h, r[o++] = c, o;
  while (h == a && c == l);
  for (; t < e; ) {
    const u = Ot(i[t], s), d = Ot(i[t + 1], s);
    if (t += n, u == h && d == c)
      continue;
    const f = h - a, g = c - l, _ = u - a, R = d - l;
    if (f * R == g * _ && (f < 0 && _ < f || f == _ || f > 0 && _ > f) && (g < 0 && R < g || g == R || g > 0 && R > g)) {
      h = u, c = d;
      continue;
    }
    r[o++] = h, r[o++] = c, a = h, l = c, h = u, c = d;
  }
  return r[o++] = h, r[o++] = c, o;
}
function Qs(i, t, e, n, s, r, o, a) {
  for (let l = 0, h = e.length; l < h; ++l) {
    const c = e[l];
    o = $s(
      i,
      t,
      c,
      n,
      s,
      r,
      o
    ), a.push(o), t = c;
  }
  return o;
}
function _i(i, t, e, n, s) {
  s = s !== void 0 ? s : [];
  let r = 0;
  for (let o = t; o < e; o += n)
    s[r++] = i.slice(o, o + n);
  return s.length = r, s;
}
function Js(i, t, e, n, s) {
  s = s !== void 0 ? s : [];
  let r = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    s[r++] = _i(
      i,
      t,
      l,
      n,
      s[r]
    ), t = l;
  }
  return s.length = r, s;
}
function mi(i, t, e, n) {
  let s = 0;
  const r = i[e - n], o = i[e - n + 1];
  let a = 0, l = 0;
  for (; t < e; t += n) {
    const h = i[t] - r, c = i[t + 1] - o;
    s += l * h - a * c, a = h, l = c;
  }
  return s / 2;
}
function tr(i, t, e, n) {
  let s = 0;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r];
    s += mi(i, t, a, n), t = a;
  }
  return s;
}
class Ht extends on {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, e !== void 0 && !Array.isArray(t[0]) ? this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ) : this.setCoordinates(
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      t,
      e
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LinearRing} Clone.
   * @api
   * @override
   */
  clone() {
    return new Ht(this.flatCoordinates.slice(), this.layout);
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, n, s) {
    return s < ni(this.getExtent(), t, e) ? s : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      di(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), gi(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      n,
      s
    ));
  }
  /**
   * Return the area of the linear ring on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return mi(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * Return the coordinates of the linear ring.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return _i(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {LinearRing} Simplified LinearRing.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [];
    return e.length = Bs(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new Ht(e, "XY");
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "LinearRing";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return !1;
  }
  /**
   * Set the coordinates of the linear ring.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = fi(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class an extends on {
  /**
   * @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.setCoordinates(t, e);
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Point} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new an(this.flatCoordinates.slice(), this.layout);
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, n, s) {
    const r = this.flatCoordinates, o = jt(
      t,
      e,
      r[0],
      r[1]
    );
    if (o < s) {
      const a = this.stride;
      for (let l = 0; l < a; ++l)
        n[l] = r[l];
      return n.length = a, o;
    }
    return s;
  }
  /**
   * Return the coordinate of the point.
   * @return {import("../coordinate.js").Coordinate} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return this.flatCoordinates.slice();
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(t) {
    return cs(this.flatCoordinates, t);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "Point";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return ii(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Hs(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function er(i, t, e, n, s) {
  return !oi(
    s,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(o) {
      return !vt(
        i,
        t,
        e,
        n,
        o[0],
        o[1]
      );
    }
  );
}
function vt(i, t, e, n, s, r) {
  let o = 0, a = i[e - n], l = i[e - n + 1];
  for (; t < e; t += n) {
    const h = i[t], c = i[t + 1];
    l <= r ? c > r && (h - a) * (r - l) - (s - a) * (c - l) > 0 && o++ : c <= r && (h - a) * (r - l) - (s - a) * (c - l) < 0 && o--, a = h, l = c;
  }
  return o !== 0;
}
function Ri(i, t, e, n, s, r) {
  if (e.length === 0 || !vt(i, t, e[0], n, s, r))
    return !1;
  for (let o = 1, a = e.length; o < a; ++o)
    if (vt(i, e[o - 1], e[o], n, s, r))
      return !1;
  return !0;
}
function nr(i, t, e, n, s, r, o) {
  let a, l, h, c, u, d, f;
  const g = s[r + 1], _ = [];
  for (let m = 0, y = e.length; m < y; ++m) {
    const T = e[m];
    for (c = i[T - n], d = i[T - n + 1], a = t; a < T; a += n)
      u = i[a], f = i[a + 1], (g <= d && f <= g || d <= g && g <= f) && (h = (g - d) / (f - d) * (u - c) + c, _.push(h)), c = u, d = f;
  }
  let R = NaN, E = -1 / 0;
  for (_.sort(Ve), c = _[0], a = 1, l = _.length; a < l; ++a) {
    u = _[a];
    const m = Math.abs(u - c);
    m > E && (h = (c + u) / 2, Ri(i, t, e, n, h, g) && (R = h, E = m)), c = u;
  }
  return isNaN(R) && (R = s[r]), [R, g, E];
}
function ir(i, t, e, n, s) {
  let r;
  for (t += n; t < e; t += n)
    if (r = s(
      i.slice(t - n, t),
      i.slice(t, t + n)
    ), r)
      return r;
  return !1;
}
function Ei(i, t, e, n, s) {
  const r = ri(
    St(),
    i,
    t,
    e,
    n
  );
  return Zt(s, r) ? de(s, r) || r[0] >= s[0] && r[2] <= s[2] || r[1] >= s[1] && r[3] <= s[3] ? !0 : ir(
    i,
    t,
    e,
    n,
    /**
     * @param {import("../../coordinate.js").Coordinate} point1 Start point.
     * @param {import("../../coordinate.js").Coordinate} point2 End point.
     * @return {boolean} `true` if the segment and the extent intersect,
     *     `false` otherwise.
     */
    function(o, a) {
      return Rs(s, o, a);
    }
  ) : !1;
}
function pi(i, t, e, n, s) {
  return !!(Ei(i, t, e, n, s) || vt(
    i,
    t,
    e,
    n,
    s[0],
    s[1]
  ) || vt(
    i,
    t,
    e,
    n,
    s[0],
    s[3]
  ) || vt(
    i,
    t,
    e,
    n,
    s[2],
    s[1]
  ) || vt(
    i,
    t,
    e,
    n,
    s[2],
    s[3]
  ));
}
function sr(i, t, e, n, s) {
  if (!pi(i, t, e[0], n, s))
    return !1;
  if (e.length === 1)
    return !0;
  for (let r = 1, o = e.length; r < o; ++r)
    if (er(
      i,
      e[r - 1],
      e[r],
      n,
      s
    ) && !Ei(
      i,
      e[r - 1],
      e[r],
      n,
      s
    ))
      return !1;
  return !0;
}
function rr(i, t, e, n) {
  for (; t < e - n; ) {
    for (let s = 0; s < n; ++s) {
      const r = i[t + s];
      i[t + s] = i[e - n + s], i[e - n + s] = r;
    }
    t += n, e -= n;
  }
}
function yi(i, t, e, n) {
  let s = 0, r = i[e - n], o = i[e - n + 1];
  for (; t < e; t += n) {
    const a = i[t], l = i[t + 1];
    s += (a - r) * (l + o), r = a, o = l;
  }
  return s === 0 ? void 0 : s > 0;
}
function or(i, t, e, n, s) {
  s = s !== void 0 ? s : !1;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r], l = yi(
      i,
      t,
      a,
      n
    );
    if (r === 0) {
      if (s && l || !s && !l)
        return !1;
    } else if (s && !l || !s && l)
      return !1;
    t = a;
  }
  return !0;
}
function jn(i, t, e, n, s) {
  s = s !== void 0 ? s : !1;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r], l = yi(
      i,
      t,
      a,
      n
    );
    (r === 0 ? s && l || !s && !l : s && !l || !s && l) && rr(i, t, a, n), t = a;
  }
  return t;
}
class _e extends on {
  /**
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>|!Array<number>} coordinates
   *     Array of linear rings that define the polygon. The first linear ring of the
   *     array defines the outer-boundary or surface of the polygon. Each subsequent
   *     linear ring defines a hole in the surface of the polygon. A linear ring is
   *     an array of vertices' coordinates where the first coordinate and the last are
   *     equivalent. (For internal use, flat coordinates in combination with
   *     `layout` and `ends` are also accepted.)
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @param {Array<number>} [ends] Ends (for internal use with flat coordinates).
   */
  constructor(t, e, n) {
    super(), this.ends_ = [], this.flatInteriorPointRevision_ = -1, this.flatInteriorPoint_ = null, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, this.orientedRevision_ = -1, this.orientedFlatCoordinates_ = null, e !== void 0 && n ? (this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ), this.ends_ = n) : this.setCoordinates(
      /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */
      t,
      e
    );
  }
  /**
   * Append the passed linear ring to this polygon.
   * @param {LinearRing} linearRing Linear ring.
   * @api
   */
  appendLinearRing(t) {
    this.flatCoordinates ? Ui(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new _e(
      this.flatCoordinates.slice(),
      this.layout,
      this.ends_.slice()
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, n, s) {
    return s < ni(this.getExtent(), t, e) ? s : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Ks(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Vs(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      n,
      s
    ));
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    return Ri(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t,
      e
    );
  }
  /**
   * Return the area of the polygon on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return tr(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride
    );
  }
  /**
   * Get the coordinate array for this geometry.  This array has the structure
   * of a GeoJSON coordinate array for polygons.
   *
   * @param {boolean} [right] Orient coordinates according to the right-hand
   *     rule (counter-clockwise for exterior and clockwise for interior rings).
   *     If `false`, coordinates will be oriented according to the left-hand rule
   *     (clockwise for exterior and counter-clockwise for interior rings).
   *     By default, coordinate orientation will depend on how the geometry was
   *     constructed.
   * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
   * @api
   * @override
   */
  getCoordinates(t) {
    let e;
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), jn(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, Js(e, 0, this.ends_, this.stride);
  }
  /**
   * @return {Array<number>} Ends.
   */
  getEnds() {
    return this.ends_;
  }
  /**
   * @return {Array<number>} Interior point.
   */
  getFlatInteriorPoint() {
    if (this.flatInteriorPointRevision_ != this.getRevision()) {
      const t = Tt(this.getExtent());
      this.flatInteriorPoint_ = nr(
        this.getOrientedFlatCoordinates(),
        0,
        this.ends_,
        this.stride,
        t,
        0
      ), this.flatInteriorPointRevision_ = this.getRevision();
    }
    return (
      /** @type {import("../coordinate.js").Coordinate} */
      this.flatInteriorPoint_
    );
  }
  /**
   * Return an interior point of the polygon.
   * @return {Point} Interior point as XYM coordinate, where M is the
   * length of the horizontal intersection that the point belongs to.
   * @api
   */
  getInteriorPoint() {
    return new an(this.getFlatInteriorPoint(), "XYM");
  }
  /**
   * Return the number of rings of the polygon,  this includes the exterior
   * ring and any interior rings.
   *
   * @return {number} Number of rings.
   * @api
   */
  getLinearRingCount() {
    return this.ends_.length;
  }
  /**
   * Return the Nth linear ring of the polygon geometry. Return `null` if the
   * given index is out of range.
   * The exterior linear ring is available at index `0` and the interior rings
   * at index `1` and beyond.
   *
   * @param {number} index Index.
   * @return {LinearRing|null} Linear ring.
   * @api
   */
  getLinearRing(t) {
    return t < 0 || this.ends_.length <= t ? null : new Ht(
      this.flatCoordinates.slice(
        t === 0 ? 0 : this.ends_[t - 1],
        this.ends_[t]
      ),
      this.layout
    );
  }
  /**
   * Return the linear rings of the polygon.
   * @return {Array<LinearRing>} Linear rings.
   * @api
   */
  getLinearRings() {
    const t = this.layout, e = this.flatCoordinates, n = this.ends_, s = [];
    let r = 0;
    for (let o = 0, a = n.length; o < a; ++o) {
      const l = n[o], h = new Ht(
        e.slice(r, l),
        t
      );
      s.push(h), r = l;
    }
    return s;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      or(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = jn(
        this.orientedFlatCoordinates_,
        0,
        this.ends_,
        this.stride
      )), this.orientedRevision_ = this.getRevision();
    }
    return (
      /** @type {Array<number>} */
      this.orientedFlatCoordinates_
    );
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {Polygon} Simplified Polygon.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [], n = [];
    return e.length = Qs(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      n
    ), new _e(e, "XY", n);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "Polygon";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return sr(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t
    );
  }
  /**
   * Set the coordinates of the polygon.
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 2), this.flatCoordinates || (this.flatCoordinates = []);
    const n = qs(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = n.length === 0 ? 0 : n[n.length - 1], this.changed();
  }
}
function Xn(i) {
  if (te(i))
    throw new Error("Cannot create polygon from empty extent");
  const t = i[0], e = i[1], n = i[2], s = i[3], r = [
    t,
    e,
    t,
    s,
    n,
    s,
    n,
    e,
    t,
    e
  ];
  return new _e(r, "XY", [r.length]);
}
const Se = 0;
class zn extends Te {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = en(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && Is(), t.center && (t.center = mt(t.center, this.projection_)), t.extent && (t.extent = ht(t.extent, this.projection_)), this.applyOptions_(t);
  }
  /**
   * Set up the view with the given options.
   * @param {ViewOptions} options View options.
   */
  applyOptions_(t) {
    const e = Object.assign({}, t);
    for (const a in et)
      delete e[a];
    this.setProperties(e, !0);
    const n = lr(t);
    this.maxResolution_ = n.maxResolution, this.minResolution_ = n.minResolution, this.zoomFactor_ = n.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = n.minZoom;
    const s = ar(t), r = n.constraint, o = hr(t);
    this.constraints_ = {
      center: s,
      resolution: r,
      rotation: o
    }, this.setRotation(t.rotation !== void 0 ? t.rotation : 0), this.setCenterInternal(
      t.center !== void 0 ? t.center : null
    ), t.resolution !== void 0 ? this.setResolution(t.resolution) : t.zoom !== void 0 && this.setZoom(t.zoom);
  }
  /**
   * Padding (in css pixels).
   * If the map viewport is partially covered with other content (overlays) along
   * its edges, this setting allows to shift the center of the viewport away from that
   * content. The order of the values in the array is top, right, bottom, left.
   * The default is no padding, which is equivalent to `[0, 0, 0, 0]`.
   * @type {Array<number>|undefined}
   * @api
   */
  get padding() {
    return this.padding_;
  }
  set padding(t) {
    let e = this.padding_;
    this.padding_ = t;
    const n = this.getCenterInternal();
    if (n) {
      const s = t || [0, 0, 0, 0];
      e = e || [0, 0, 0, 0];
      const r = this.getResolution(), o = r / 2 * (s[3] - e[3] + e[1] - s[1]), a = r / 2 * (s[0] - e[0] + e[2] - s[2]);
      this.setCenterInternal([n[0] + o, n[1] - a]);
    }
  }
  /**
   * Get an updated version of the view options used to construct the view.  The
   * current resolution (or zoom), center, and rotation are applied to any stored
   * options.  The provided options can be used to apply new min/max zoom or
   * resolution limits.
   * @param {ViewOptions} newOptions New options to be applied.
   * @return {ViewOptions} New options updated with the current view state.
   */
  getUpdatedOptions_(t) {
    const e = this.getProperties();
    return e.resolution !== void 0 ? e.resolution = this.getResolution() : e.zoom = this.getZoom(), e.center = this.getCenterInternal(), e.rotation = this.getRotation(), Object.assign({}, e, t);
  }
  /**
   * Animate the view.  The view's center, zoom (or resolution), and rotation
   * can be animated for smooth transitions between view states.  For example,
   * to animate the view to a new zoom level:
   *
   *     view.animate({zoom: view.getZoom() + 1});
   *
   * By default, the animation lasts one second and uses in-and-out easing.  You
   * can customize this behavior by including `duration` (in milliseconds) and
   * `easing` options (see {@link module:ol/easing}).
   *
   * To chain together multiple animations, call the method with multiple
   * animation objects.  For example, to first zoom and then pan:
   *
   *     view.animate({zoom: 10}, {center: [0, 0]});
   *
   * If you provide a function as the last argument to the animate method, it
   * will get called at the end of an animation series.  The callback will be
   * called with `true` if the animation series completed on its own or `false`
   * if it was cancelled.
   *
   * Animations are cancelled by user interactions (e.g. dragging the map) or by
   * calling `view.setCenter()`, `view.setResolution()`, or `view.setRotation()`
   * (or another method that calls one of these).
   *
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation
   *     options.  Multiple animations can be run in series by passing multiple
   *     options objects.  To run multiple animations in parallel, call the method
   *     multiple times.  An optional callback can be provided as a final
   *     argument.  The callback will be called with a boolean indicating whether
   *     the animation completed without being cancelled.
   * @api
   */
  animate(t) {
    this.isDef() && !this.getAnimating() && this.resolveConstraints(0);
    const e = new Array(arguments.length);
    for (let n = 0; n < e.length; ++n) {
      let s = arguments[n];
      s.center && (s = Object.assign({}, s), s.center = mt(
        s.center,
        this.getProjection()
      )), s.anchor && (s = Object.assign({}, s), s.anchor = mt(
        s.anchor,
        this.getProjection()
      )), e[n] = s;
    }
    this.animateInternal.apply(this, e);
  }
  /**
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation options.
   */
  animateInternal(t) {
    let e = arguments.length, n;
    e > 1 && typeof arguments[e - 1] == "function" && (n = arguments[e - 1], --e);
    let s = 0;
    for (; s < e && !this.isDef(); ++s) {
      const c = arguments[s];
      c.center && this.setCenterInternal(c.center), c.zoom !== void 0 ? this.setZoom(c.zoom) : c.resolution && this.setResolution(c.resolution), c.rotation !== void 0 && this.setRotation(c.rotation);
    }
    if (s === e) {
      n && re(n, !0);
      return;
    }
    let r = Date.now(), o = this.targetCenter_.slice(), a = this.targetResolution_, l = this.targetRotation_;
    const h = [];
    for (; s < e; ++s) {
      const c = (
        /** @type {AnimationOptions} */
        arguments[s]
      ), u = {
        start: r,
        complete: !1,
        anchor: c.anchor,
        duration: c.duration !== void 0 ? c.duration : 1e3,
        easing: c.easing || Gs,
        callback: n
      };
      if (c.center && (u.sourceCenter = o, u.targetCenter = c.center.slice(), o = u.targetCenter), c.zoom !== void 0 ? (u.sourceResolution = a, u.targetResolution = this.getResolutionForZoom(c.zoom), a = u.targetResolution) : c.resolution && (u.sourceResolution = a, u.targetResolution = c.resolution, a = u.targetResolution), c.rotation !== void 0) {
        u.sourceRotation = l;
        const d = Xt(c.rotation - l + Math.PI, 2 * Math.PI) - Math.PI;
        u.targetRotation = l + d, l = u.targetRotation;
      }
      cr(u) ? u.complete = !0 : r += u.duration, h.push(u);
    }
    this.animations_.push(h), this.setHint(ot.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[ot.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[ot.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(ot.ANIMATING, -this.hints_[ot.ANIMATING]);
    let t;
    for (let e = 0, n = this.animations_.length; e < n; ++e) {
      const s = this.animations_[e];
      if (s[0].callback && re(s[0].callback, !1), !t)
        for (let r = 0, o = s.length; r < o; ++r) {
          const a = s[r];
          if (!a.complete) {
            t = a.anchor;
            break;
          }
        }
    }
    this.animations_.length = 0, this.cancelAnchor_ = t, this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
  }
  /**
   * Update all animations.
   */
  updateAnimations_() {
    if (this.updateAnimationKey_ !== void 0 && (cancelAnimationFrame(this.updateAnimationKey_), this.updateAnimationKey_ = void 0), !this.getAnimating())
      return;
    const t = Date.now();
    let e = !1;
    for (let n = this.animations_.length - 1; n >= 0; --n) {
      const s = this.animations_[n];
      let r = !0;
      for (let o = 0, a = s.length; o < a; ++o) {
        const l = s[o];
        if (l.complete)
          continue;
        const h = t - l.start;
        let c = l.duration > 0 ? h / l.duration : 1;
        c >= 1 ? (l.complete = !0, c = 1) : r = !1;
        const u = l.easing(c);
        if (l.sourceCenter) {
          const d = l.sourceCenter[0], f = l.sourceCenter[1], g = l.targetCenter[0], _ = l.targetCenter[1];
          this.nextCenter_ = l.targetCenter;
          const R = d + u * (g - d), E = f + u * (_ - f);
          this.targetCenter_ = [R, E];
        }
        if (l.sourceResolution && l.targetResolution) {
          const d = u === 1 ? l.targetResolution : l.sourceResolution + u * (l.targetResolution - l.sourceResolution);
          if (l.anchor) {
            const f = this.getViewportSize_(this.getRotation()), g = this.constraints_.resolution(
              d,
              0,
              f,
              !0
            );
            this.targetCenter_ = this.calculateCenterZoom(
              g,
              l.anchor
            );
          }
          this.nextResolution_ = l.targetResolution, this.targetResolution_ = d, this.applyTargetState_(!0);
        }
        if (l.sourceRotation !== void 0 && l.targetRotation !== void 0) {
          const d = u === 1 ? Xt(l.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : l.sourceRotation + u * (l.targetRotation - l.sourceRotation);
          if (l.anchor) {
            const f = this.constraints_.rotation(
              d,
              !0
            );
            this.targetCenter_ = this.calculateCenterRotate(
              f,
              l.anchor
            );
          }
          this.nextRotation_ = l.targetRotation, this.targetRotation_ = d;
        }
        if (this.applyTargetState_(!0), e = !0, !l.complete)
          break;
      }
      if (r) {
        this.animations_[n] = null, this.setHint(ot.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const o = s[0].callback;
        o && re(o, !0);
      }
    }
    this.animations_ = this.animations_.filter(Boolean), e && this.updateAnimationKey_ === void 0 && (this.updateAnimationKey_ = requestAnimationFrame(
      this.updateAnimations_.bind(this)
    ));
  }
  /**
   * @param {number} rotation Target rotation.
   * @param {import("./coordinate.js").Coordinate} anchor Rotation anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for rotation and anchor.
   */
  calculateCenterRotate(t, e) {
    let n;
    const s = this.getCenterInternal();
    return s !== void 0 && (n = [s[0] - e[0], s[1] - e[1]], ys(n, t - this.getRotation()), ps(n, e)), n;
  }
  /**
   * @param {number} resolution Target resolution.
   * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
   */
  calculateCenterZoom(t, e) {
    let n;
    const s = this.getCenterInternal(), r = this.getResolution();
    if (s !== void 0 && r !== void 0) {
      const o = e[0] - t * (e[0] - s[0]) / r, a = e[1] - t * (e[1] - s[1]) / r;
      n = [o, a];
    }
    return n;
  }
  /**
   * Returns the current viewport size.
   * @private
   * @param {number} [rotation] Take into account the rotation of the viewport when giving the size
   * @return {import("./size.js").Size} Viewport size or `[100, 100]` when no viewport is found.
   */
  getViewportSize_(t) {
    const e = this.viewportSize_;
    if (t) {
      const n = e[0], s = e[1];
      return [
        Math.abs(n * Math.cos(t)) + Math.abs(s * Math.sin(t)),
        Math.abs(n * Math.sin(t)) + Math.abs(s * Math.cos(t))
      ];
    }
    return e;
  }
  /**
   * Stores the viewport size on the view. The viewport size is not read every time from the DOM
   * to avoid performance hit and layout reflow.
   * This should be done on map size change.
   * Note: the constraints are not resolved during an animation to avoid stopping it
   * @param {import("./size.js").Size} [size] Viewport size; if undefined, [100, 100] is assumed
   */
  setViewportSize(t) {
    this.viewportSize_ = Array.isArray(t) ? t.slice() : [100, 100], this.getAnimating() || this.resolveConstraints(0);
  }
  /**
   * Get the view center.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   * @observable
   * @api
   */
  getCenter() {
    const t = this.getCenterInternal();
    return t && Pn(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(et.CENTER)
    );
  }
  /**
   * @return {Constraints} Constraints.
   */
  getConstraints() {
    return this.constraints_;
  }
  /**
   * @return {boolean} Resolution constraint is set
   */
  getConstrainResolution() {
    return this.get("constrainResolution");
  }
  /**
   * @param {Array<number>} [hints] Destination array.
   * @return {Array<number>} Hint.
   */
  getHints(t) {
    return t !== void 0 ? (t[0] = this.hints_[0], t[1] = this.hints_[1], t) : this.hints_.slice();
  }
  /**
   * Calculate the extent for the current view state and the passed box size.
   * @param {import("./size.js").Size} [size] The pixel dimensions of the box
   * into which the calculated extent should fit. Defaults to the size of the
   * map the view is associated with.
   * If no map or multiple maps are connected to the view, provide the desired
   * box size (e.g. `map.getSize()`).
   * @return {import("./extent.js").Extent} Extent.
   * @api
   */
  calculateExtent(t) {
    const e = this.calculateExtentInternal(t);
    return vs(e, this.getProjection());
  }
  /**
   * @param {import("./size.js").Size} [size] Box pixel size. If not provided,
   * the map's last known viewport size will be used.
   * @return {import("./extent.js").Extent} Extent.
   */
  calculateExtentInternal(t) {
    t = t || this.getViewportSizeMinusPadding_();
    const e = (
      /** @type {!import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    Y(e, "The view center is not defined");
    const n = (
      /** @type {!number} */
      this.getResolution()
    );
    Y(n !== void 0, "The view resolution is not defined");
    const s = (
      /** @type {!number} */
      this.getRotation()
    );
    return Y(s !== void 0, "The view rotation is not defined"), Je(e, n, s, t);
  }
  /**
   * Get the maximum resolution of the view.
   * @return {number} The maximum resolution of the view.
   * @api
   */
  getMaxResolution() {
    return this.maxResolution_;
  }
  /**
   * Get the minimum resolution of the view.
   * @return {number} The minimum resolution of the view.
   * @api
   */
  getMinResolution() {
    return this.minResolution_;
  }
  /**
   * Get the maximum zoom level for the view.
   * @return {number} The maximum zoom level.
   * @api
   */
  getMaxZoom() {
    return (
      /** @type {number} */
      this.getZoomForResolution(this.minResolution_)
    );
  }
  /**
   * Set a new maximum zoom level for the view.
   * @param {number} zoom The maximum zoom level.
   * @api
   */
  setMaxZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ maxZoom: t }));
  }
  /**
   * Get the minimum zoom level for the view.
   * @return {number} The minimum zoom level.
   * @api
   */
  getMinZoom() {
    return (
      /** @type {number} */
      this.getZoomForResolution(this.maxResolution_)
    );
  }
  /**
   * Set a new minimum zoom level for the view.
   * @param {number} zoom The minimum zoom level.
   * @api
   */
  setMinZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ minZoom: t }));
  }
  /**
   * Set whether the view should allow intermediary zoom levels.
   * @param {boolean} enabled Whether the resolution is constrained.
   * @api
   */
  setConstrainResolution(t) {
    this.applyOptions_(this.getUpdatedOptions_({ constrainResolution: t }));
  }
  /**
   * Get the view projection.
   * @return {import("./proj/Projection.js").default} The projection of the view.
   * @api
   */
  getProjection() {
    return this.projection_;
  }
  /**
   * Get the view resolution.
   * @return {number|undefined} The resolution of the view.
   * @observable
   * @api
   */
  getResolution() {
    return (
      /** @type {number|undefined} */
      this.get(et.RESOLUTION)
    );
  }
  /**
   * Get the resolutions for the view. This returns the array of resolutions
   * passed to the constructor of the View, or undefined if none were given.
   * @return {Array<number>|undefined} The resolutions of the view.
   * @api
   */
  getResolutions() {
    return this.resolutions_;
  }
  /**
   * Get the resolution for a provided extent (in map units) and size (in pixels).
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {import("./size.js").Size} [size] Box pixel size.
   * @return {number} The resolution at which the provided extent will render at
   *     the given size.
   * @api
   */
  getResolutionForExtent(t, e) {
    return this.getResolutionForExtentInternal(
      ht(t, this.getProjection()),
      e
    );
  }
  /**
   * Get the resolution for a provided extent (in map units) and size (in pixels).
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {import("./size.js").Size} [size] Box pixel size.
   * @return {number} The resolution at which the provided extent will render at
   *     the given size.
   */
  getResolutionForExtentInternal(t, e) {
    e = e || this.getViewportSizeMinusPadding_();
    const n = P(t) / e[0], s = U(t) / e[1];
    return Math.max(n, s);
  }
  /**
   * Return a function that returns a value between 0 and 1 for a
   * resolution. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Resolution for value function.
   */
  getResolutionForValueFunction(t) {
    t = t || 2;
    const e = this.getConstrainedResolution(this.maxResolution_), n = this.minResolution_, s = Math.log(e / n) / Math.log(t);
    return (
      /**
       * @param {number} value Value.
       * @return {number} Resolution.
       */
      function(r) {
        return e / Math.pow(t, r * s);
      }
    );
  }
  /**
   * Get the view rotation.
   * @return {number} The rotation of the view in radians.
   * @observable
   * @api
   */
  getRotation() {
    return (
      /** @type {number} */
      this.get(et.ROTATION)
    );
  }
  /**
   * Return a function that returns a resolution for a value between
   * 0 and 1. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Value for resolution function.
   */
  getValueForResolutionFunction(t) {
    const e = Math.log(t || 2), n = this.getConstrainedResolution(this.maxResolution_), s = this.minResolution_, r = Math.log(n / s) / e;
    return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      function(o) {
        return Math.log(n / o) / e / r;
      }
    );
  }
  /**
   * Returns the size of the viewport minus padding.
   * @private
   * @param {number} [rotation] Take into account the rotation of the viewport when giving the size
   * @return {import("./size.js").Size} Viewport size reduced by the padding.
   */
  getViewportSizeMinusPadding_(t) {
    let e = this.getViewportSize_(t);
    const n = this.padding_;
    return n && (e = [
      e[0] - n[1] - n[3],
      e[1] - n[0] - n[2]
    ]), e;
  }
  /**
   * @return {State} View state.
   */
  getState() {
    const t = this.getProjection(), e = this.getResolution(), n = this.getRotation();
    let s = (
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    const r = this.padding_;
    if (r) {
      const o = this.getViewportSizeMinusPadding_();
      s = Ae(
        s,
        this.getViewportSize_(),
        [o[0] / 2 + r[3], o[1] / 2 + r[0]],
        e,
        n
      );
    }
    return {
      center: s.slice(0),
      projection: t !== void 0 ? t : null,
      resolution: e,
      nextCenter: this.nextCenter_,
      nextResolution: this.nextResolution_,
      nextRotation: this.nextRotation_,
      rotation: n,
      zoom: this.getZoom()
    };
  }
  /**
   * @return {ViewStateLayerStateExtent} Like `FrameState`, but just `viewState` and `extent`.
   */
  getViewStateAndExtent() {
    return {
      viewState: this.getState(),
      extent: this.calculateExtent()
    };
  }
  /**
   * Get the current zoom level. This method may return non-integer zoom levels
   * if the view does not constrain the resolution, or if an interaction or
   * animation is underway.
   * @return {number|undefined} Zoom.
   * @api
   */
  getZoom() {
    let t;
    const e = this.getResolution();
    return e !== void 0 && (t = this.getZoomForResolution(e)), t;
  }
  /**
   * Get the zoom level for a resolution.
   * @param {number} resolution The resolution.
   * @return {number|undefined} The zoom level for the provided resolution.
   * @api
   */
  getZoomForResolution(t) {
    let e = this.minZoom_ || 0, n, s;
    if (this.resolutions_) {
      const r = ye(this.resolutions_, t, 1);
      e = r, n = this.resolutions_[r], r == this.resolutions_.length - 1 ? s = 2 : s = n / this.resolutions_[r + 1];
    } else
      n = this.maxResolution_, s = this.zoomFactor_;
    return e + Math.log(n / t) / Math.log(s);
  }
  /**
   * Get the resolution for a zoom level.
   * @param {number} zoom Zoom level.
   * @return {number} The view resolution for the provided zoom level.
   * @api
   */
  getResolutionForZoom(t) {
    var e;
    if ((e = this.resolutions_) != null && e.length) {
      if (this.resolutions_.length === 1)
        return this.resolutions_[0];
      const n = z(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), s = this.resolutions_[n] / this.resolutions_[n + 1];
      return this.resolutions_[n] / Math.pow(s, z(t - n, 0, 1));
    }
    return this.maxResolution_ / Math.pow(this.zoomFactor_, t - this.minZoom_);
  }
  /**
   * Fit the given geometry or extent based on the given map size and border.
   * The size is pixel dimensions of the box to fit the extent into.
   * In most cases you will want to use the map size, that is `map.getSize()`.
   * Takes care of the map angle.
   * @param {import("./geom/SimpleGeometry.js").default|import("./extent.js").Extent} geometryOrExtent The geometry or
   *     extent to fit the view to.
   * @param {FitOptions} [options] Options.
   * @api
   */
  fit(t, e) {
    let n;
    if (Y(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      Y(
        !te(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const s = ht(t, this.getProjection());
      n = Xn(s);
    } else if (t.getType() === "Circle") {
      const s = ht(
        t.getExtent(),
        this.getProjection()
      );
      n = Xn(s), n.rotate(this.getRotation(), Tt(s));
    } else
      n = t;
    this.fitInternal(n, e);
  }
  /**
   * Calculate rotated extent
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @return {import("./extent").Extent} The rotated extent for the geometry.
   */
  rotatedExtentForGeometry(t) {
    const e = this.getRotation(), n = Math.cos(e), s = Math.sin(-e), r = t.getFlatCoordinates(), o = t.getStride();
    let a = 1 / 0, l = 1 / 0, h = -1 / 0, c = -1 / 0;
    for (let u = 0, d = r.length; u < d; u += o) {
      const f = r[u] * n - r[u + 1] * s, g = r[u] * s + r[u + 1] * n;
      a = Math.min(a, f), l = Math.min(l, g), h = Math.max(h, f), c = Math.max(c, g);
    }
    return [a, l, h, c];
  }
  /**
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @param {FitOptions} [options] Options.
   */
  fitInternal(t, e) {
    e = e || {};
    let n = e.size;
    n || (n = this.getViewportSizeMinusPadding_());
    const s = e.padding !== void 0 ? e.padding : [0, 0, 0, 0], r = e.nearest !== void 0 ? e.nearest : !1;
    let o;
    e.minResolution !== void 0 ? o = e.minResolution : e.maxZoom !== void 0 ? o = this.getResolutionForZoom(e.maxZoom) : o = 0;
    const a = this.rotatedExtentForGeometry(t);
    let l = this.getResolutionForExtentInternal(a, [
      n[0] - s[1] - s[3],
      n[1] - s[0] - s[2]
    ]);
    l = isNaN(l) ? o : Math.max(l, o), l = this.getConstrainedResolution(l, r ? 0 : 1);
    const h = this.getRotation(), c = Math.sin(h), u = Math.cos(h), d = Tt(a);
    d[0] += (s[1] - s[3]) / 2 * l, d[1] += (s[0] - s[2]) / 2 * l;
    const f = d[0] * u - d[1] * c, g = d[1] * u + d[0] * c, _ = this.getConstrainedCenter([f, g], l), R = e.callback ? e.callback : Ze;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: l,
        center: _,
        duration: e.duration,
        easing: e.easing
      },
      R
    ) : (this.targetResolution_ = l, this.targetCenter_ = _, this.applyTargetState_(!1, !0), re(R, !0));
  }
  /**
   * Center on coordinate and view position.
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   * @api
   */
  centerOn(t, e, n) {
    this.centerOnInternal(
      mt(t, this.getProjection()),
      e,
      n
    );
  }
  /**
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   */
  centerOnInternal(t, e, n) {
    this.setCenterInternal(
      Ae(
        t,
        e,
        n,
        this.getResolution(),
        this.getRotation()
      )
    );
  }
  /**
   * Calculates the shift between map and viewport center.
   * @param {import("./coordinate.js").Coordinate} center Center.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {import("./size.js").Size} size Size.
   * @return {Array<number>|undefined} Center shift.
   */
  calculateCenterShift(t, e, n, s) {
    let r;
    const o = this.padding_;
    if (o && t) {
      const a = this.getViewportSizeMinusPadding_(-n), l = Ae(
        t,
        s,
        [a[0] / 2 + o[3], a[1] / 2 + o[0]],
        e,
        n
      );
      r = [
        t[0] - l[0],
        t[1] - l[1]
      ];
    }
    return r;
  }
  /**
   * @return {boolean} Is defined.
   */
  isDef() {
    return !!this.getCenterInternal() && this.getResolution() !== void 0;
  }
  /**
   * Adds relative coordinates to the center of the view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
   * @api
   */
  adjustCenter(t) {
    const e = Pn(this.targetCenter_, this.getProjection());
    this.setCenter([
      e[0] + t[0],
      e[1] + t[1]
    ]);
  }
  /**
   * Adds relative coordinates to the center of the view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
   */
  adjustCenterInternal(t) {
    const e = this.targetCenter_;
    this.setCenterInternal([
      e[0] + t[0],
      e[1] + t[1]
    ]);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustResolution(t, e) {
    e = e && mt(e, this.getProjection()), this.adjustResolutionInternal(t, e);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, e) {
    const n = this.getAnimating() || this.getInteracting(), s = this.getViewportSize_(this.getRotation()), r = this.constraints_.resolution(
      this.targetResolution_ * t,
      0,
      s,
      n
    );
    e && (this.targetCenter_ = this.calculateCenterZoom(r, e)), this.targetResolution_ *= t, this.applyTargetState_();
  }
  /**
   * Adds a value to the view zoom level, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom level.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustZoom(t, e) {
    this.adjustResolution(Math.pow(this.zoomFactor_, -t), e);
  }
  /**
   * Adds a value to the view rotation, optionally using an anchor. Any rotation
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   * @api
   */
  adjustRotation(t, e) {
    e && (e = mt(e, this.getProjection())), this.adjustRotationInternal(t, e);
  }
  /**
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   */
  adjustRotationInternal(t, e) {
    const n = this.getAnimating() || this.getInteracting(), s = this.constraints_.rotation(
      this.targetRotation_ + t,
      n
    );
    e && (this.targetCenter_ = this.calculateCenterRotate(s, e)), this.targetRotation_ += t, this.applyTargetState_();
  }
  /**
   * Set the center of the current view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   * @observable
   * @api
   */
  setCenter(t) {
    this.setCenterInternal(
      t && mt(t, this.getProjection())
    );
  }
  /**
   * Set the center using the view projection (not the user projection).
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   */
  setCenterInternal(t) {
    this.targetCenter_ = t, this.applyTargetState_();
  }
  /**
   * @param {import("./ViewHint.js").default} hint Hint.
   * @param {number} delta Delta.
   * @return {number} New value.
   */
  setHint(t, e) {
    return this.hints_[t] += e, this.changed(), this.hints_[t];
  }
  /**
   * Set the resolution for this view. Any resolution constraint will apply.
   * @param {number|undefined} resolution The resolution of the view.
   * @observable
   * @api
   */
  setResolution(t) {
    this.targetResolution_ = t, this.applyTargetState_();
  }
  /**
   * Set the rotation for this view. Any rotation constraint will apply.
   * @param {number} rotation The rotation of the view in radians.
   * @observable
   * @api
   */
  setRotation(t) {
    this.targetRotation_ = t, this.applyTargetState_();
  }
  /**
   * Zoom to a specific zoom level. Any resolution constrain will apply.
   * @param {number} zoom Zoom level.
   * @api
   */
  setZoom(t) {
    this.setResolution(this.getResolutionForZoom(t));
  }
  /**
   * Recompute rotation/resolution/center based on target values.
   * Note: we have to compute rotation first, then resolution and center considering that
   * parameters can influence one another in case a view extent constraint is present.
   * @param {boolean} [doNotCancelAnims] Do not cancel animations.
   * @param {boolean} [forceMoving] Apply constraints as if the view is moving.
   * @private
   */
  applyTargetState_(t, e) {
    const n = this.getAnimating() || this.getInteracting() || e, s = this.constraints_.rotation(
      this.targetRotation_,
      n
    ), r = this.getViewportSize_(s), o = this.constraints_.resolution(
      this.targetResolution_,
      0,
      r,
      n
    ), a = this.constraints_.center(
      this.targetCenter_,
      o,
      r,
      n,
      this.calculateCenterShift(
        this.targetCenter_,
        o,
        s,
        r
      )
    );
    this.get(et.ROTATION) !== s && this.set(et.ROTATION, s), this.get(et.RESOLUTION) !== o && (this.set(et.RESOLUTION, o), this.set("zoom", this.getZoom(), !0)), (!a || !this.get(et.CENTER) || !ge(this.get(et.CENTER), a)) && this.set(et.CENTER, a), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
  }
  /**
   * If any constraints need to be applied, an animation will be triggered.
   * This is typically done on interaction end.
   * Note: calling this with a duration of 0 will apply the constrained values straight away,
   * without animation.
   * @param {number} [duration] The animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  resolveConstraints(t, e, n) {
    t = t !== void 0 ? t : 200;
    const s = e || 0, r = this.constraints_.rotation(this.targetRotation_), o = this.getViewportSize_(r), a = this.constraints_.resolution(
      this.targetResolution_,
      s,
      o
    ), l = this.constraints_.center(
      this.targetCenter_,
      a,
      o,
      !1,
      this.calculateCenterShift(
        this.targetCenter_,
        a,
        r,
        o
      )
    );
    if (t === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = a, this.targetRotation_ = r, this.targetCenter_ = l, this.applyTargetState_();
      return;
    }
    n = n || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== a || this.getRotation() !== r || !this.getCenterInternal() || !ge(this.getCenterInternal(), l)) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: r,
      center: l,
      resolution: a,
      duration: t,
      easing: Ds,
      anchor: n
    }));
  }
  /**
   * Notify the View that an interaction has started.
   * The view state will be resolved to a stable one if needed
   * (depending on its constraints).
   * @api
   */
  beginInteraction() {
    this.resolveConstraints(0), this.setHint(ot.INTERACTING, 1);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  endInteraction(t, e, n) {
    n = n && mt(n, this.getProjection()), this.endInteractionInternal(t, e, n);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, n) {
    this.getInteracting() && (this.setHint(ot.INTERACTING, -1), this.resolveConstraints(t, e, n));
  }
  /**
   * Get a valid position for the view center according to the current constraints.
   * @param {import("./coordinate.js").Coordinate|undefined} targetCenter Target center position.
   * @param {number} [targetResolution] Target resolution. If not supplied, the current one will be used.
   * This is useful to guess a valid center position at a different zoom level.
   * @return {import("./coordinate.js").Coordinate|undefined} Valid center position.
   */
  getConstrainedCenter(t, e) {
    const n = this.getViewportSize_(this.getRotation());
    return this.constraints_.center(
      t,
      e || this.getResolution(),
      n
    );
  }
  /**
   * Get a valid zoom level according to the current view constraints.
   * @param {number|undefined} targetZoom Target zoom.
   * @param {number} [direction=0] Indicate which resolution should be used
   * by a renderer if the view resolution does not match any resolution of the tile source.
   * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
   * will be used. If -1, the nearest higher resolution will be used.
   * @return {number|undefined} Valid zoom level.
   */
  getConstrainedZoom(t, e) {
    const n = this.getResolutionForZoom(t);
    return this.getZoomForResolution(
      this.getConstrainedResolution(n, e)
    );
  }
  /**
   * Get a valid resolution according to the current view constraints.
   * @param {number|undefined} targetResolution Target resolution.
   * @param {number} [direction=0] Indicate which resolution should be used
   * by a renderer if the view resolution does not match any resolution of the tile source.
   * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
   * will be used. If -1, the nearest higher resolution will be used.
   * @return {number|undefined} Valid resolution.
   */
  getConstrainedResolution(t, e) {
    e = e || 0;
    const n = this.getViewportSize_(this.getRotation());
    return this.constraints_.resolution(t, e, n);
  }
}
function re(i, t) {
  setTimeout(function() {
    i(t);
  }, 0);
}
function ar(i) {
  if (i.extent !== void 0) {
    const e = i.smoothExtentConstraint !== void 0 ? i.smoothExtentConstraint : !0;
    return On(i.extent, i.constrainOnlyCenter, e);
  }
  const t = en(i.projection, "EPSG:3857");
  if (i.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, On(e, !1, !1);
  }
  return As;
}
function lr(i) {
  let t, e, n, o = i.minZoom !== void 0 ? i.minZoom : Se, a = i.maxZoom !== void 0 ? i.maxZoom : 28;
  const l = i.zoomFactor !== void 0 ? i.zoomFactor : 2, h = i.multiWorld !== void 0 ? i.multiWorld : !1, c = i.smoothResolutionConstraint !== void 0 ? i.smoothResolutionConstraint : !0, u = i.showFullExtent !== void 0 ? i.showFullExtent : !1, d = en(i.projection, "EPSG:3857"), f = d.getExtent();
  let g = i.constrainOnlyCenter, _ = i.extent;
  if (!h && !_ && d.isGlobal() && (g = !1, _ = f), i.resolutions !== void 0) {
    const R = i.resolutions;
    e = R[o], n = R[a] !== void 0 ? R[a] : R[R.length - 1], i.constrainResolution ? t = Ps(
      R,
      c,
      !g && _,
      u
    ) : t = Ln(
      e,
      n,
      c,
      !g && _,
      u
    );
  } else {
    const E = (f ? Math.max(P(f), U(f)) : (
      // use an extent that can fit the whole world if need be
      360 * $e.degrees / d.getMetersPerUnit()
    )) / Be / Math.pow(2, Se), m = E / Math.pow(2, 28 - Se);
    e = i.maxResolution, e !== void 0 ? o = 0 : e = E / Math.pow(l, o), n = i.minResolution, n === void 0 && (i.maxZoom !== void 0 ? i.maxResolution !== void 0 ? n = e / Math.pow(l, a) : n = E / Math.pow(l, a) : n = m), a = o + Math.floor(
      Math.log(e / n) / Math.log(l)
    ), n = e / Math.pow(l, a - o), i.constrainResolution ? t = Os(
      l,
      e,
      n,
      c,
      !g && _,
      u
    ) : t = Ln(
      e,
      n,
      c,
      !g && _,
      u
    );
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: n,
    minZoom: o,
    zoomFactor: l
  };
}
function hr(i) {
  if (i.enableRotation !== void 0 ? i.enableRotation : !0) {
    const e = i.constrainRotation;
    return e === void 0 || e === !0 ? bs() : e === !1 ? Fn : typeof e == "number" ? Fs(e) : Fn;
  }
  return Ls;
}
function cr(i) {
  return !(i.sourceCenter && i.targetCenter && !ge(i.sourceCenter, i.targetCenter) || i.sourceResolution !== i.targetResolution || i.sourceRotation !== i.targetRotation);
}
function Ae(i, t, e, n, s) {
  const r = Math.cos(-s);
  let o = Math.sin(-s), a = i[0] * r - i[1] * o, l = i[1] * r + i[0] * o;
  a += (t[0] / 2 - e[0]) * n, l += (e[1] - t[1] / 2) * n, o = -o;
  const h = a * r - l * o, c = l * r + a * o;
  return [h, c];
}
class Ti extends Ji {
  /**
   * @param {Options<SourceType>} options Layer options.
   */
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      S.SOURCE,
      this.handleSourcePropertyChange_
    );
    const n = t.source ? (
      /** @type {SourceType} */
      t.source
    ) : null;
    this.setSource(n);
  }
  /**
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   * @override
   */
  getLayersArray(t) {
    return t = t || [], t.push(this), t;
  }
  /**
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   * @override
   */
  getLayerStatesArray(t) {
    return t = t || [], t.push(this.getLayerState()), t;
  }
  /**
   * Get the layer source.
   * @return {SourceType|null} The layer source (or `null` if not yet set).
   * @observable
   * @api
   */
  getSource() {
    return (
      /** @type {SourceType} */
      this.get(S.SOURCE) || null
    );
  }
  /**
   * @return {SourceType|null} The source being rendered.
   */
  getRenderSource() {
    return this.getSource();
  }
  /**
   * @return {import("../source/Source.js").State} Source state.
   * @override
   */
  getSourceState() {
    const t = this.getSource();
    return t ? t.getState() : "undefined";
  }
  /**
   * @private
   */
  handleSourceChange_() {
    this.changed(), !(this.sourceReady_ || this.getSource().getState() !== "ready") && (this.sourceReady_ = !0, this.dispatchEvent("sourceready"));
  }
  /**
   * @private
   */
  handleSourcePropertyChange_() {
    this.sourceChangeKey_ && (st(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = ct(
      t,
      B.CHANGE,
      this.handleSourceChange_,
      this
    ), t.getState() === "ready" && (this.sourceReady_ = !0, setTimeout(() => {
      this.dispatchEvent("sourceready");
    }, 0))), this.changed();
  }
  /**
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with
   * an array of features.
   */
  getFeatures(t) {
    return this.renderer_ ? this.renderer_.getFeatures(t) : Promise.resolve([]);
  }
  /**
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   */
  getData(t) {
    return !this.renderer_ || !this.rendered ? null : this.renderer_.getData(t);
  }
  /**
   * The layer is visible on the map view, i.e. within its min/max resolution or zoom and
   * extent, not set to `visible: false`, and not inside a layer group that is set
   * to `visible: false`.
   * @param {View|import("../View.js").ViewStateLayerStateExtent} [view] View or {@link import("../Map.js").FrameState}.
   * Only required when the layer is not added to a map.
   * @return {boolean} The layer is visible in the map view.
   * @api
   */
  isVisible(t) {
    let e;
    const n = this.getMapInternal();
    !t && n && (t = n.getView()), t instanceof zn ? e = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : e = t, !e.layerStatesArray && n && (e.layerStatesArray = n.getLayerGroup().getLayerStatesArray());
    let s;
    e.layerStatesArray ? s = e.layerStatesArray.find(
      (o) => o.layer === this
    ) : s = this.getLayerState();
    const r = this.getExtent();
    return ur(s, e.viewState) && (!r || Zt(r, e.extent));
  }
  /**
   * Get the attributions of the source of this layer for the given view.
   * @param {View|import("../View.js").ViewStateLayerStateExtent} [view] View or {@link import("../Map.js").FrameState}.
   * Only required when the layer is not added to a map.
   * @return {Array<string>} Attributions for this layer at the given view.
   * @api
   */
  getAttributions(t) {
    var r;
    if (!this.isVisible(t))
      return [];
    const e = (r = this.getSource()) == null ? void 0 : r.getAttributions();
    if (!e)
      return [];
    const n = t instanceof zn ? t.getViewStateAndExtent() : t;
    let s = e(n);
    return Array.isArray(s) || (s = [s]), s;
  }
  /**
   * In charge to manage the rendering of the layer. One layer type is
   * bounded with one layer renderer.
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target which the renderer may (but need not) use
   * for rendering its content.
   * @return {HTMLElement|null} The rendered element.
   */
  render(t, e) {
    const n = this.getRenderer();
    return n.prepareFrame(t) ? (this.rendered = !0, n.renderFrame(t, e)) : null;
  }
  /**
   * Called when a layer is not visible during a map render.
   */
  unrender() {
    this.rendered = !1;
  }
  /** @return {string} Declutter */
  getDeclutter() {
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {import("../layer/Layer.js").State} layerState Layer state.
   */
  renderDeclutter(t, e) {
  }
  /**
   * When the renderer follows a layout -> render approach, do the final rendering here.
   * @param {import('../Map.js').FrameState} frameState Frame state
   */
  renderDeferred(t) {
    const e = this.getRenderer();
    e && e.renderDeferred(t);
  }
  /**
   * For use inside the library only.
   * @param {import("../Map.js").default|null} map Map.
   */
  setMapInternal(t) {
    t || this.unrender(), this.set(S.MAP, t);
  }
  /**
   * For use inside the library only.
   * @return {import("../Map.js").default|null} Map.
   */
  getMapInternal() {
    return this.get(S.MAP);
  }
  /**
   * Sets the layer to be rendered on top of other layers on a map. The map will
   * not manage this layer in its layers collection. This
   * is useful for temporary layers. To remove an unmanaged layer from the map,
   * use `#setMap(null)`.
   *
   * To add the layer to a map and have it managed by the map, use
   * {@link module:ol/Map~Map#addLayer} instead.
   * @param {import("../Map.js").default|null} map Map.
   * @api
   */
  setMap(t) {
    this.mapPrecomposeKey_ && (st(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (st(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = ct(
      t,
      kt.PRECOMPOSE,
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = ct(this, B.CHANGE, t.render, t), this.changed());
  }
  /**
   * @param {import("../events/Event.js").default} renderEvent Render event
   * @private
   */
  handlePrecompose_(t) {
    const e = (
      /** @type {import("../render/Event.js").default} */
      t.frameState.layerStatesArray
    ), n = this.getLayerState(!1);
    Y(
      !e.some(
        (s) => s.layer === n.layer
      ),
      "A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both."
    ), e.push(n);
  }
  /**
   * Set the layer source.
   * @param {SourceType|null} source The layer source.
   * @observable
   * @api
   */
  setSource(t) {
    this.set(S.SOURCE, t);
  }
  /**
   * Get the renderer for this layer.
   * @return {RendererType|null} The layer renderer.
   */
  getRenderer() {
    return this.renderer_ || (this.renderer_ = this.createRenderer()), this.renderer_;
  }
  /**
   * @return {boolean} The layer has a renderer.
   */
  hasRenderer() {
    return !!this.renderer_;
  }
  /**
   * Create a renderer for this layer.
   * @return {RendererType} A layer renderer.
   * @protected
   */
  createRenderer() {
    return null;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.renderer_ && (this.renderer_.dispose(), delete this.renderer_), this.setSource(null), super.disposeInternal();
  }
}
function ur(i, t) {
  if (!i.visible)
    return !1;
  const e = t.resolution;
  if (e < i.minResolution || e >= i.maxResolution)
    return !1;
  const n = t.zoom;
  return n > i.minZoom && n <= i.maxZoom;
}
class dr extends Ti {
  /**
   * @param {Options<ImageSourceType>} [options] Layer options.
   */
  constructor(t) {
    t = t || {}, super(t);
  }
}
const O = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: 3,
  EMPTY: 4
}, gr = 5;
class fr extends $t {
  /**
   * @param {LayerType} layer Layer.
   */
  constructor(t) {
    super(), this.ready = !0, this.boundHandleImageChange_ = this.handleImageChange_.bind(this), this.layer_ = t, this.staleKeys_ = new Array(), this.maxStaleKeys = gr;
  }
  /**
   * @return {Array<string>} Get the list of stale keys.
   */
  getStaleKeys() {
    return this.staleKeys_;
  }
  /**
   * @param {string} key The new stale key.
   */
  prependStaleKey(t) {
    this.staleKeys_.unshift(t), this.staleKeys_.length > this.maxStaleKeys && (this.staleKeys_.length = this.maxStaleKeys);
  }
  /**
   * Asynchronous layer level hit detection.
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with
   * an array of features.
   */
  getFeatures(t) {
    return X();
  }
  /**
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   */
  getData(t) {
    return null;
  }
  /**
   * Determine whether render should be called.
   * @abstract
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   */
  prepareFrame(t) {
    return X();
  }
  /**
   * Render the layer.
   * @abstract
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement|null} target Target that may be used to render content to.
   * @return {HTMLElement|null} The rendered element.
   */
  renderFrame(t, e) {
    return X();
  }
  /**
   * @abstract
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {import("./vector.js").FeatureCallback<T>} callback Feature callback.
   * @param {Array<import("./Map.js").HitMatch<T>>} matches The hit detected matches with tolerance.
   * @return {T|undefined} Callback result.
   * @template T
   */
  forEachFeatureAtCoordinate(t, e, n, s, r) {
  }
  /**
   * @return {LayerType} Layer.
   */
  getLayer() {
    return this.layer_;
  }
  /**
   * Perform action necessary to get the layer rendered after new fonts have loaded
   * @abstract
   */
  handleFontsChanged() {
  }
  /**
   * Handle changes in image state.
   * @param {import("../events/Event.js").default} event Image change event.
   * @private
   */
  handleImageChange_(t) {
    const e = (
      /** @type {import("../Image.js").default} */
      t.target
    );
    (e.getState() === O.LOADED || e.getState() === O.ERROR) && this.renderIfReadyAndVisible();
  }
  /**
   * Load the image if not already loaded, and register the image change
   * listener if needed.
   * @param {import("../Image.js").default} image Image.
   * @return {boolean} `true` if the image is already loaded, `false` otherwise.
   * @protected
   */
  loadImage(t) {
    let e = t.getState();
    return e != O.LOADED && e != O.ERROR && t.addEventListener(B.CHANGE, this.boundHandleImageChange_), e == O.IDLE && (t.load(), e = t.getState()), e == O.LOADED;
  }
  /**
   * @protected
   */
  renderIfReadyAndVisible() {
    const t = this.getLayer();
    t && t.getVisible() && t.getSourceState() === "ready" && t.changed();
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   */
  renderDeferred(t) {
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    delete this.layer_, super.disposeInternal();
  }
}
class _r extends Bt {
  /**
   * @param {import("./EventType.js").default} type Type.
   * @param {import("../transform.js").Transform} [inversePixelTransform] Transform for
   *     CSS pixels to rendered pixels.
   * @param {import("../Map.js").FrameState} [frameState] Frame state.
   * @param {?(CanvasRenderingContext2D|WebGLRenderingContext)} [context] Context.
   */
  constructor(t, e, n, s) {
    super(t), this.inversePixelTransform = e, this.frameState = n, this.context = s;
  }
}
const xt = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "";
xt.includes("firefox");
const mr = xt.includes("safari") && !xt.includes("chrom");
mr && (xt.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(xt));
xt.includes("webkit") && xt.includes("edge");
xt.includes("macintosh");
const Rr = typeof WorkerGlobalScope < "u" && typeof OffscreenCanvas < "u" && self instanceof WorkerGlobalScope, ln = typeof Image < "u" && Image.prototype.decode, Er = typeof createImageBitmap == "function";
(function() {
  let i = !1;
  try {
    const t = Object.defineProperty({}, "passive", {
      get: function() {
        i = !0;
      }
    });
    window.addEventListener("_", null, t), window.removeEventListener("_", null, t);
  } catch {
  }
  return i;
})();
function at(i, t, e, n) {
  let s;
  return e && e.length ? s = /** @type {HTMLCanvasElement} */
  e.shift() : Rr ? s = new OffscreenCanvas(i || 300, t || 300) : s = document.createElement("canvas"), i && (s.width = i), t && (s.height = t), /** @type {CanvasRenderingContext2D} */
  s.getContext("2d", n);
}
let Pe;
function Zn() {
  return Pe || (Pe = at(1, 1)), Pe;
}
function qt(i) {
  const t = i.canvas;
  t.width = 1, t.height = 1, i.clearRect(0, 0, 1, 1);
}
class pr {
  constructor() {
    /**
     * @private
     * @param {...*} args Args.
     * @return {ZIndexContext} This.
     */
    ve(this, "pushMethodArgs_", (...t) => (this.instructions_[this.zIndex + this.offset_].push(t), this));
    this.instructions_ = [], this.zIndex = 0, this.offset_ = 0, this.context_ = /** @type {ZIndexContextProxy} */
    new Proxy(Zn(), {
      get: (t, e) => {
        if (typeof /** @type {*} */
        Zn()[e] == "function")
          return this.instructions_[this.zIndex + this.offset_] || (this.instructions_[this.zIndex + this.offset_] = []), this.instructions_[this.zIndex + this.offset_].push(e), this.pushMethodArgs_;
      },
      set: (t, e, n) => (this.instructions_[this.zIndex + this.offset_] || (this.instructions_[this.zIndex + this.offset_] = []), this.instructions_[this.zIndex + this.offset_].push(e, n), !0)
    });
  }
  /**
   * Push a function that renders to the context directly.
   * @param {function(CanvasRenderingContext2D): void} render Function.
   */
  pushFunction(t) {
    this.instructions_[this.zIndex + this.offset_].push(t);
  }
  /**
   * Get a proxy for CanvasRenderingContext2D which does not support getting state
   * (e.g. `context.globalAlpha`, which will return `undefined`). To set state, if it relies on a
   * previous state (e.g. `context.globalAlpha = context.globalAlpha / 2`), set a function,
   * e.g. `context.globalAlpha = (context) => context.globalAlpha / 2`.
   * @return {ZIndexContextProxy} Context.
   */
  getContext() {
    return this.context_;
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   */
  draw(t) {
    this.instructions_.forEach((e) => {
      for (let n = 0, s = e.length; n < s; ++n) {
        const r = e[n];
        if (typeof r == "function") {
          r(t);
          continue;
        }
        const o = e[++n];
        if (typeof /** @type {*} */
        t[r] == "function")
          t[r](...o);
        else {
          if (typeof o == "function") {
            t[r] = o(t);
            continue;
          }
          t[r] = o;
        }
      }
    });
  }
  clear() {
    this.instructions_.length = 0, this.zIndex = 0, this.offset_ = 0;
  }
  /**
   * Offsets the zIndex by the highest current zIndex. Useful for rendering multiple worlds or tiles, to
   * avoid conflicting context.clip() or context.save()/restore() calls.
   */
  offset() {
    this.offset_ = this.instructions_.length, this.zIndex = 0;
  }
}
const me = {
  name: "rgb",
  min: [0, 0, 0],
  max: [255, 255, 255],
  channel: ["red", "green", "blue"],
  alias: ["RGB"]
};
var W = {
  name: "xyz",
  min: [0, 0, 0],
  channel: ["X", "Y", "Z"],
  alias: ["XYZ", "ciexyz", "cie1931"]
};
W.whitepoint = {
  //1931 2°
  2: {
    //incadescent
    A: [109.85, 100, 35.585],
    // B:[],
    C: [98.074, 100, 118.232],
    D50: [96.422, 100, 82.521],
    D55: [95.682, 100, 92.149],
    //daylight
    D65: [95.045592705167, 100, 108.9057750759878],
    D75: [94.972, 100, 122.638],
    //flourescent
    // F1: [],
    F2: [99.187, 100, 67.395],
    // F3: [],
    // F4: [],
    // F5: [],
    // F6:[],
    F7: [95.044, 100, 108.755],
    // F8: [],
    // F9: [],
    // F10: [],
    F11: [100.966, 100, 64.37],
    // F12: [],
    E: [100, 100, 100]
  },
  //1964  10°
  10: {
    //incadescent
    A: [111.144, 100, 35.2],
    C: [97.285, 100, 116.145],
    D50: [96.72, 100, 81.427],
    D55: [95.799, 100, 90.926],
    //daylight
    D65: [94.811, 100, 107.304],
    D75: [94.416, 100, 120.641],
    //flourescent
    F2: [103.28, 100, 69.026],
    F7: [95.792, 100, 107.687],
    F11: [103.866, 100, 65.627],
    E: [100, 100, 100]
  }
};
W.max = W.whitepoint[2].D65;
W.rgb = function(i, t) {
  t = t || W.whitepoint[2].E;
  var e = i[0] / t[0], n = i[1] / t[1], s = i[2] / t[2], r, o, a;
  return r = e * 3.240969941904521 + n * -1.537383177570093 + s * -0.498610760293, o = e * -0.96924363628087 + n * 1.87596750150772 + s * 0.041555057407175, a = e * 0.055630079696993 + n * -0.20397695888897 + s * 1.056971514242878, r = r > 31308e-7 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : r = r * 12.92, o = o > 31308e-7 ? 1.055 * Math.pow(o, 1 / 2.4) - 0.055 : o = o * 12.92, a = a > 31308e-7 ? 1.055 * Math.pow(a, 1 / 2.4) - 0.055 : a = a * 12.92, r = Math.min(Math.max(0, r), 1), o = Math.min(Math.max(0, o), 1), a = Math.min(Math.max(0, a), 1), [r * 255, o * 255, a * 255];
};
me.xyz = function(i, t) {
  var e = i[0] / 255, n = i[1] / 255, s = i[2] / 255;
  e = e > 0.04045 ? Math.pow((e + 0.055) / 1.055, 2.4) : e / 12.92, n = n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92, s = s > 0.04045 ? Math.pow((s + 0.055) / 1.055, 2.4) : s / 12.92;
  var r = e * 0.41239079926595 + n * 0.35758433938387 + s * 0.18048078840183, o = e * 0.21263900587151 + n * 0.71516867876775 + s * 0.072192315360733, a = e * 0.019330818715591 + n * 0.11919477979462 + s * 0.95053215224966;
  return t = t || W.whitepoint[2].E, [r * t[0], o * t[1], a * t[2]];
};
const xi = {
  name: "luv",
  //NOTE: luv has no rigidly defined limits
  //easyrgb fails to get proper coords
  //boronine states no rigid limits
  //colorMine refers this ones:
  min: [0, -134, -140],
  max: [100, 224, 122],
  channel: ["lightness", "u", "v"],
  alias: ["LUV", "cieluv", "cie1976"],
  xyz: function(i, t, e) {
    var n, s, r, o, a, l, h, c, u, d, f, g, _;
    if (r = i[0], o = i[1], a = i[2], r === 0) return [0, 0, 0];
    var R = 0.0011070564598794539;
    return t = t || "D65", e = e || 2, u = W.whitepoint[e][t][0], d = W.whitepoint[e][t][1], f = W.whitepoint[e][t][2], g = 4 * u / (u + 15 * d + 3 * f), _ = 9 * d / (u + 15 * d + 3 * f), n = o / (13 * r) + g || 0, s = a / (13 * r) + _ || 0, h = r > 8 ? d * Math.pow((r + 16) / 116, 3) : d * r * R, l = h * 9 * n / (4 * s) || 0, c = h * (12 - 3 * n - 20 * s) / (4 * s) || 0, [l, h, c];
  }
};
W.luv = function(i, t, e) {
  var n, s, r, o, a, l, h, c, u, d, f, g, _, R = 0.008856451679035631, E = 903.2962962962961;
  t = t || "D65", e = e || 2, u = W.whitepoint[e][t][0], d = W.whitepoint[e][t][1], f = W.whitepoint[e][t][2], g = 4 * u / (u + 15 * d + 3 * f), _ = 9 * d / (u + 15 * d + 3 * f), l = i[0], h = i[1], c = i[2], n = 4 * l / (l + 15 * h + 3 * c) || 0, s = 9 * h / (l + 15 * h + 3 * c) || 0;
  var m = h / d;
  return r = m <= R ? E * m : 116 * Math.pow(m, 1 / 3) - 16, o = 13 * r * (n - g), a = 13 * r * (s - _), [r, o, a];
};
xi.lchuv = function(i) {
  var t = i[0], e = i[1], n = i[2], s = Math.sqrt(e * e + n * n), r = Math.atan2(n, e), o = r * 360 / 2 / Math.PI;
  return o < 0 && (o += 360), [t, s, o];
};
W.lchuv = function(i) {
  return xi.lchuv(W.luv(i));
};
const Yn = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};
var Un = {
  red: 0,
  orange: 60,
  yellow: 120,
  green: 180,
  blue: 240,
  purple: 300
};
function yr(i) {
  var c, u;
  var t, e = [], n = 1, s;
  if (typeof i == "number")
    return { space: "rgb", values: [i >>> 16, (i & 65280) >>> 8, i & 255], alpha: 1 };
  if (typeof i == "number") return { space: "rgb", values: [i >>> 16, (i & 65280) >>> 8, i & 255], alpha: 1 };
  if (i = String(i).toLowerCase(), Yn[i])
    e = Yn[i].slice(), s = "rgb";
  else if (i === "transparent")
    n = 0, s = "rgb", e = [0, 0, 0];
  else if (i[0] === "#") {
    var r = i.slice(1), o = r.length, a = o <= 4;
    n = 1, a ? (e = [
      parseInt(r[0] + r[0], 16),
      parseInt(r[1] + r[1], 16),
      parseInt(r[2] + r[2], 16)
    ], o === 4 && (n = parseInt(r[3] + r[3], 16) / 255)) : (e = [
      parseInt(r[0] + r[1], 16),
      parseInt(r[2] + r[3], 16),
      parseInt(r[4] + r[5], 16)
    ], o === 8 && (n = parseInt(r[6] + r[7], 16) / 255)), e[0] || (e[0] = 0), e[1] || (e[1] = 0), e[2] || (e[2] = 0), s = "rgb";
  } else if (t = /^((?:rgba?|hs[lvb]a?|hwba?|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms|oklch|oklab|color))\s*\(([^\)]*)\)/.exec(i)) {
    var l = t[1];
    s = l.replace(/a$/, "");
    var h = s === "cmyk" ? 4 : s === "gray" ? 1 : 3;
    e = t[2].trim().split(/\s*[,\/]\s*|\s+/), s === "color" && (s = e.shift()), e = e.map(function(d, f) {
      if (d[d.length - 1] === "%")
        return d = parseFloat(d) / 100, f === 3 ? d : s === "rgb" ? d * 255 : s[0] === "h" || s[0] === "l" && !f ? d * 100 : s === "lab" ? d * 125 : s === "lch" ? f < 2 ? d * 150 : d * 360 : s[0] === "o" && !f ? d : s === "oklab" ? d * 0.4 : s === "oklch" ? f < 2 ? d * 0.4 : d * 360 : d;
      if (s[f] === "h" || f === 2 && s[s.length - 1] === "h") {
        if (Un[d] !== void 0) return Un[d];
        if (d.endsWith("deg")) return parseFloat(d);
        if (d.endsWith("turn")) return parseFloat(d) * 360;
        if (d.endsWith("grad")) return parseFloat(d) * 360 / 400;
        if (d.endsWith("rad")) return parseFloat(d) * 180 / Math.PI;
      }
      return d === "none" ? 0 : parseFloat(d);
    }), n = e.length > h ? e.pop() : 1;
  } else /[0-9](?:\s|\/|,)/.test(i) && (e = i.match(/([0-9]+)/g).map(function(d) {
    return parseFloat(d);
  }), s = ((u = (c = i.match(/([a-z])/ig)) == null ? void 0 : c.join("")) == null ? void 0 : u.toLowerCase()) || "rgb");
  return {
    space: s,
    values: e,
    alpha: n
  };
}
const Oe = {
  name: "hsl",
  min: [0, 0, 0],
  max: [360, 100, 100],
  channel: ["hue", "saturation", "lightness"],
  alias: ["HSL"],
  rgb: function(i) {
    var t = i[0] / 360, e = i[1] / 100, n = i[2] / 100, s, r, o, a, l, h = 0;
    if (e === 0) return l = n * 255, [l, l, l];
    for (r = n < 0.5 ? n * (1 + e) : n + e - n * e, s = 2 * n - r, a = [0, 0, 0]; h < 3; )
      o = t + 1 / 3 * -(h - 1), o < 0 ? o++ : o > 1 && o--, l = 6 * o < 1 ? s + (r - s) * 6 * o : 2 * o < 1 ? r : 3 * o < 2 ? s + (r - s) * (2 / 3 - o) * 6 : s, a[h++] = l * 255;
    return a;
  }
};
me.hsl = function(i) {
  var t = i[0] / 255, e = i[1] / 255, n = i[2] / 255, s = Math.min(t, e, n), r = Math.max(t, e, n), o = r - s, a, l, h;
  return r === s ? a = 0 : t === r ? a = (e - n) / o : e === r ? a = 2 + (n - t) / o : n === r && (a = 4 + (t - e) / o), a = Math.min(a * 60, 360), a < 0 && (a += 360), h = (s + r) / 2, r === s ? l = 0 : h <= 0.5 ? l = o / (r + s) : l = o / (2 - r - s), [a, l * 100, h * 100];
};
function Tr(i) {
  Array.isArray(i) && i.raw && (i = String.raw(...arguments)), i instanceof Number && (i = +i);
  var t, e = yr(i);
  if (!e.space) return [];
  const n = e.space[0] === "h" ? Oe.min : me.min, s = e.space[0] === "h" ? Oe.max : me.max;
  return t = Array(3), t[0] = Math.min(Math.max(e.values[0], n[0]), s[0]), t[1] = Math.min(Math.max(e.values[1], n[1]), s[1]), t[2] = Math.min(Math.max(e.values[2], n[2]), s[2]), e.space[0] === "h" && (t = Oe.rgb(t)), t.push(Math.min(Math.max(e.alpha, 0), 1)), t;
}
const xr = [NaN, NaN, NaN, 0], Ir = 1024, Ut = {};
let Le = 0;
function Cr(i) {
  if (i === "none")
    return xr;
  if (Ut.hasOwnProperty(i))
    return Ut[i];
  if (Le >= Ir) {
    let e = 0;
    for (const n in Ut)
      e++ & 3 || (delete Ut[n], --Le);
  }
  const t = Tr(i);
  if (t.length !== 4)
    throw new Error('failed to parse "' + i + '" as color');
  for (const e of t)
    if (isNaN(e))
      throw new Error('failed to parse "' + i + '" as color');
  return wr(t), Ut[i] = t, ++Le, t;
}
function kn(i) {
  return Array.isArray(i) ? i : Cr(i);
}
function wr(i) {
  return i[0] = z(i[0] + 0.5 | 0, 0, 255), i[1] = z(i[1] + 0.5 | 0, 0, 255), i[2] = z(i[2] + 0.5 | 0, 0, 255), i[3] = z(i[3], 0, 1), i;
}
let Dt = null;
function Mr() {
  Dt = at(1, 1, void 0, {
    willReadFrequently: !0
  });
}
class Ii extends fr {
  /**
   * @param {LayerType} layer Layer.
   */
  constructor(t) {
    super(t), this.container = null, this.renderedResolution, this.tempTransform = he(), this.pixelTransform = he(), this.inversePixelTransform = he(), this.context = null, this.deferredContext_ = null, this.containerReused = !1, this.frameState = null;
  }
  /**
   * @param {import('../../DataTile.js').ImageLike} image Image.
   * @param {number} col The column index.
   * @param {number} row The row index.
   * @return {Uint8ClampedArray|null} The image data.
   */
  getImageData(t, e, n) {
    Dt || Mr(), Dt.clearRect(0, 0, 1, 1);
    let s;
    try {
      Dt.drawImage(t, e, n, 1, 1, 0, 0, 1, 1), s = Dt.getImageData(0, 0, 1, 1).data;
    } catch {
      return Dt = null, null;
    }
    return s;
  }
  /**
   * @param {import('../../Map.js').FrameState} frameState Frame state.
   * @return {string} Background color.
   */
  getBackground(t) {
    let n = this.getLayer().getBackground();
    return typeof n == "function" && (n = n(t.viewState.resolution)), n || void 0;
  }
  /**
   * Get a rendering container from an existing target, if compatible.
   * @param {HTMLElement} target Potential render target.
   * @param {string} transform CSS Transform.
   * @param {string} [backgroundColor] Background color.
   */
  useContainer(t, e, n) {
    const s = this.getLayer().getClassName();
    let r, o;
    if (t && t.className === s && (!n || t && t.style.backgroundColor && Jn(
      kn(t.style.backgroundColor),
      kn(n)
    ))) {
      const a = t.firstElementChild;
      a instanceof HTMLCanvasElement && (o = a.getContext("2d"));
    }
    if (o && o.canvas.style.transform === e ? (this.container = t, this.context = o, this.containerReused = !0) : this.containerReused ? (this.container = null, this.context = null, this.containerReused = !1) : this.container && (this.container.style.backgroundColor = null), !this.container) {
      r = document.createElement("div"), r.className = s;
      let a = r.style;
      a.position = "absolute", a.width = "100%", a.height = "100%", o = at();
      const l = o.canvas;
      r.appendChild(l), a = l.style, a.position = "absolute", a.left = "0", a.transformOrigin = "top left", this.container = r, this.context = o;
    }
    !this.containerReused && n && !this.container.style.backgroundColor && (this.container.style.backgroundColor = n);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("../../extent.js").Extent} extent Clip extent.
   * @protected
   */
  clipUnrotated(t, e, n) {
    const s = At(n), r = we(n), o = Ce(n), a = Ie(n);
    nt(e.coordinateToPixelTransform, s), nt(e.coordinateToPixelTransform, r), nt(e.coordinateToPixelTransform, o), nt(e.coordinateToPixelTransform, a);
    const l = this.inversePixelTransform;
    nt(l, s), nt(l, r), nt(l, o), nt(l, a), t.save(), t.beginPath(), t.moveTo(Math.round(s[0]), Math.round(s[1])), t.lineTo(Math.round(r[0]), Math.round(r[1])), t.lineTo(Math.round(o[0]), Math.round(o[1])), t.lineTo(Math.round(a[0]), Math.round(a[1])), t.clip();
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @protected
   */
  prepareContainer(t, e) {
    const n = t.extent, s = t.viewState.resolution, r = t.viewState.rotation, o = t.pixelRatio, a = Math.round(P(n) / s * o), l = Math.round(U(n) / s * o);
    Vt(
      this.pixelTransform,
      t.size[0] / 2,
      t.size[1] / 2,
      1 / o,
      1 / o,
      r,
      -a / 2,
      -l / 2
    ), Ns(this.inversePixelTransform, this.pixelTransform);
    const h = Xs(this.pixelTransform);
    if (this.useContainer(e, h, this.getBackground(t)), !this.containerReused) {
      const c = this.context.canvas;
      c.width != a || c.height != l ? (c.width = a, c.height = l) : this.context.clearRect(0, 0, a, l), h !== c.style.transform && (c.style.transform = h);
    }
  }
  /**
   * @param {import("../../render/EventType.js").default} type Event type.
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @private
   */
  dispatchRenderEvent_(t, e, n) {
    const s = this.getLayer();
    if (s.hasListener(t)) {
      const r = new _r(
        t,
        this.inversePixelTransform,
        n,
        e
      );
      s.dispatchEvent(r);
    }
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @protected
   */
  preRender(t, e) {
    this.frameState = e, !e.declutter && this.dispatchRenderEvent_(kt.PRERENDER, t, e);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @protected
   */
  postRender(t, e) {
    e.declutter || this.dispatchRenderEvent_(kt.POSTRENDER, t, e);
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   */
  renderDeferredInternal(t) {
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {import('../../render/canvas/ZIndexContext.js').ZIndexContextProxy} Context.
   */
  getRenderContext(t) {
    return t.declutter && !this.deferredContext_ && (this.deferredContext_ = new pr()), t.declutter ? this.deferredContext_.getContext() : this.context;
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @override
   */
  renderDeferred(t) {
    t.declutter && (this.dispatchRenderEvent_(
      kt.PRERENDER,
      this.context,
      t
    ), t.declutter && this.deferredContext_ && (this.deferredContext_.draw(this.context), this.deferredContext_.clear()), this.renderDeferredInternal(t), this.dispatchRenderEvent_(
      kt.POSTRENDER,
      this.context,
      t
    ));
  }
  /**
   * Creates a transform for rendering to an element that will be rotated after rendering.
   * @param {import("../../coordinate.js").Coordinate} center Center.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {number} pixelRatio Pixel ratio.
   * @param {number} width Width of the rendered element (in pixels).
   * @param {number} height Height of the rendered element (in pixels).
   * @param {number} offsetX Offset on the x-axis in view coordinates.
   * @protected
   * @return {!import("../../transform.js").Transform} Transform.
   */
  getRenderTransform(t, e, n, s, r, o, a) {
    const l = r / 2, h = o / 2, c = s / e, u = -c, d = -t[0] + a, f = -t[1];
    return Vt(
      this.tempTransform,
      l,
      h,
      c,
      u,
      -n,
      d,
      f
    );
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    delete this.frameState, super.disposeInternal();
  }
}
class vr extends Ii {
  /**
   * @param {import("../../layer/Image.js").default} imageLayer Image layer.
   */
  constructor(t) {
    super(t), this.image = null;
  }
  /**
   * @return {import('../../DataTile.js').ImageLike} Image.
   */
  getImage() {
    return this.image ? this.image.getImage() : null;
  }
  /**
   * Determine whether render should be called.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   * @override
   */
  prepareFrame(t) {
    const e = t.layerStatesArray[t.layerIndex], n = t.pixelRatio, s = t.viewState, r = s.resolution, o = this.getLayer().getSource(), a = t.viewHints;
    let l = t.extent;
    if (e.extent !== void 0 && (l = Q(
      l,
      ht(e.extent, s.projection)
    )), !a[ot.ANIMATING] && !a[ot.INTERACTING] && !te(l))
      if (o) {
        const h = s.projection, c = o.getImage(
          l,
          r,
          n,
          h
        );
        c && (this.loadImage(c) ? this.image = c : c.getState() === O.EMPTY && (this.image = null));
      } else
        this.image = null;
    return !!this.image;
  }
  /**
   * @param {import("../../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray} Data at the pixel location.
   * @override
   */
  getData(t) {
    const e = this.frameState;
    if (!e)
      return null;
    const n = this.getLayer(), s = nt(
      e.pixelToCoordinateTransform,
      t.slice()
    ), r = n.getExtent();
    if (r && !xe(r, s))
      return null;
    const o = this.image.getExtent(), a = this.image.getImage(), l = P(o), h = Math.floor(
      a.width * ((s[0] - o[0]) / l)
    );
    if (h < 0 || h >= a.width)
      return null;
    const c = U(o), u = Math.floor(
      a.height * ((o[3] - s[1]) / c)
    );
    return u < 0 || u >= a.height ? null : this.getImageData(a, h, u);
  }
  /**
   * Render the layer.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   * @override
   */
  renderFrame(t, e) {
    const n = this.image, s = n.getExtent(), r = n.getResolution(), [o, a] = Array.isArray(r) ? r : [r, r], l = n.getPixelRatio(), h = t.layerStatesArray[t.layerIndex], c = t.pixelRatio, u = t.viewState, d = u.center, f = u.resolution, g = c * o / (f * l), _ = c * a / (f * l);
    this.prepareContainer(t, e);
    const R = this.context.canvas.width, E = this.context.canvas.height, m = this.getRenderContext(t);
    let y = !1, T = !0;
    if (h.extent) {
      const M = ht(
        h.extent,
        u.projection
      );
      T = Zt(M, t.extent), y = T && !de(M, t.extent), y && this.clipUnrotated(m, t, M);
    }
    const p = n.getImage(), w = Vt(
      this.tempTransform,
      R / 2,
      E / 2,
      g,
      _,
      0,
      l * (s[0] - d[0]) / o,
      l * (d[1] - s[3]) / a
    );
    this.renderedResolution = a * c / l;
    const v = p.width * w[0], I = p.height * w[3];
    if (this.getLayer().getSource().getInterpolate() || (m.imageSmoothingEnabled = !1), this.preRender(m, t), T && v >= 0.5 && I >= 0.5) {
      const M = w[4], D = w[5], L = h.opacity;
      L !== 1 && (m.save(), m.globalAlpha = L), m.drawImage(p, 0, 0, +p.width, +p.height, M, D, v, I), L !== 1 && m.restore();
    }
    return this.postRender(this.context, t), y && m.restore(), m.imageSmoothingEnabled = !0, this.container;
  }
}
class Wn extends dr {
  /**
   * @param {import("./BaseImage.js").Options<ImageSourceType>} [options] Layer options.
   */
  constructor(t) {
    super(t);
  }
  /**
   * @override
   */
  createRenderer() {
    return new vr(this);
  }
  /**
   * Get data for a pixel location.  A four element RGBA array will be returned.  For requests outside the
   * layer extent, `null` will be returned.  Data for an image can only be retrieved if the
   * source's `crossOrigin` property is set.
   *
   * ```js
   * // display layer data on every pointer move
   * map.on('pointermove', (event) => {
   *   console.log(layer.getData(event.pixel));
   * });
   * ```
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   * @api
   * @override
   */
  getData(t) {
    return super.getData(t);
  }
}
const oe = {
  PRELOAD: "preload",
  USE_INTERIM_TILES_ON_ERROR: "useInterimTilesOnError"
};
class Sr extends Ti {
  /**
   * @param {Options<TileSourceType>} [options] Tile layer options.
   */
  constructor(t) {
    t = t || {};
    const e = Object.assign({}, t), n = t.cacheSize;
    delete t.cacheSize, delete e.preload, delete e.useInterimTilesOnError, super(e), this.on, this.once, this.un, this.cacheSize_ = n, this.setPreload(t.preload !== void 0 ? t.preload : 0), this.setUseInterimTilesOnError(
      t.useInterimTilesOnError !== void 0 ? t.useInterimTilesOnError : !0
    );
  }
  /**
   * @return {number|undefined} The suggested cache size
   * @protected
   */
  getCacheSize() {
    return this.cacheSize_;
  }
  /**
   * Return the level as number to which we will preload tiles up to.
   * @return {number} The level to preload tiles up to.
   * @observable
   * @api
   */
  getPreload() {
    return (
      /** @type {number} */
      this.get(oe.PRELOAD)
    );
  }
  /**
   * Set the level as number to which we will preload tiles up to.
   * @param {number} preload The level to preload tiles up to.
   * @observable
   * @api
   */
  setPreload(t) {
    this.set(oe.PRELOAD, t);
  }
  /**
   * Deprecated.  Whether we use interim tiles on error.
   * @return {boolean} Use interim tiles on error.
   * @observable
   * @api
   */
  getUseInterimTilesOnError() {
    return (
      /** @type {boolean} */
      this.get(oe.USE_INTERIM_TILES_ON_ERROR)
    );
  }
  /**
   * Deprecated.  Set whether we use interim tiles on error.
   * @param {boolean} useInterimTilesOnError Use interim tiles on error.
   * @observable
   * @api
   */
  setUseInterimTilesOnError(t) {
    this.set(oe.USE_INTERIM_TILES_ON_ERROR, t);
  }
  /**
   * Get data for a pixel location.  The return type depends on the source data.  For image tiles,
   * a four element RGBA array will be returned.  For data tiles, the array length will match the
   * number of bands in the dataset.  For requests outside the layer extent, `null` will be returned.
   * Data for a image tiles can only be retrieved if the source's `crossOrigin` property is set.
   *
   * ```js
   * // display layer data on every pointer move
   * map.on('pointermove', (event) => {
   *   console.log(layer.getData(event.pixel));
   * });
   * ```
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   * @api
   * @override
   */
  getData(t) {
    return super.getData(t);
  }
}
const x = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  /**
   * Indicates that tile loading failed
   * @type {number}
   */
  ERROR: 3,
  EMPTY: 4
};
class hn extends He {
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("./TileState.js").default} state State.
   * @param {Options} [options] Tile options.
   */
  constructor(t, e, n) {
    super(), n = n || {}, this.tileCoord = t, this.state = e, this.key = "", this.transition_ = n.transition === void 0 ? 250 : n.transition, this.transitionStarts_ = {}, this.interpolate = !!n.interpolate;
  }
  /**
   * @protected
   */
  changed() {
    this.dispatchEvent(B.CHANGE);
  }
  /**
   * Called by the tile cache when the tile is removed from the cache due to expiry
   */
  release() {
    this.state === x.ERROR && this.setState(x.EMPTY);
  }
  /**
   * @return {string} Key.
   */
  getKey() {
    return this.key + "/" + this.tileCoord;
  }
  /**
   * Get the tile coordinate for this tile.
   * @return {import("./tilecoord.js").TileCoord} The tile coordinate.
   * @api
   */
  getTileCoord() {
    return this.tileCoord;
  }
  /**
   * @return {import("./TileState.js").default} State.
   */
  getState() {
    return this.state;
  }
  /**
   * Sets the state of this tile. If you write your own {@link module:ol/Tile~LoadFunction tileLoadFunction} ,
   * it is important to set the state correctly to {@link module:ol/TileState~ERROR}
   * when the tile cannot be loaded. Otherwise the tile cannot be removed from
   * the tile queue and will block other requests.
   * @param {import("./TileState.js").default} state State.
   * @api
   */
  setState(t) {
    if (this.state !== x.ERROR && this.state > t)
      throw new Error("Tile load sequence violation");
    this.state = t, this.changed();
  }
  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   * @abstract
   * @api
   */
  load() {
    X();
  }
  /**
   * Get the alpha value for rendering.
   * @param {string} id An id for the renderer.
   * @param {number} time The render frame time.
   * @return {number} A number between 0 and 1.
   */
  getAlpha(t, e) {
    if (!this.transition_)
      return 1;
    let n = this.transitionStarts_[t];
    if (!n)
      n = e, this.transitionStarts_[t] = n;
    else if (n === -1)
      return 1;
    const s = e - n + 1e3 / 60;
    return s >= this.transition_ ? 1 : ui(s / this.transition_);
  }
  /**
   * Determine if a tile is in an alpha transition.  A tile is considered in
   * transition if tile.getAlpha() has not yet been called or has been called
   * and returned 1.
   * @param {string} id An id for the renderer.
   * @return {boolean} The tile is in transition.
   */
  inTransition(t) {
    return this.transition_ ? this.transitionStarts_[t] !== -1 : !1;
  }
  /**
   * Mark a transition as complete.
   * @param {string} id An id for the renderer.
   */
  endTransition(t) {
    this.transition_ && (this.transitionStarts_[t] = -1);
  }
  /**
   * @override
   */
  disposeInternal() {
    this.release(), super.disposeInternal();
  }
}
function Re(i) {
  return i instanceof Image || i instanceof HTMLCanvasElement || i instanceof HTMLVideoElement || i instanceof ImageBitmap ? i : null;
}
function Ar(i) {
  return i instanceof Uint8Array || i instanceof Uint8ClampedArray || i instanceof Float32Array || i instanceof DataView ? i : null;
}
const Pr = new Error("disposed");
let Lt = null;
function Or(i) {
  Lt || (Lt = at(
    i.width,
    i.height,
    void 0,
    { willReadFrequently: !0 }
  ));
  const t = Lt.canvas, e = i.width;
  t.width !== e && (t.width = e);
  const n = i.height;
  return t.height !== n && (t.height = n), Lt.clearRect(0, 0, e, n), Lt.drawImage(i, 0, 0), Lt.getImageData(0, 0, e, n).data;
}
const Lr = [256, 256];
class ke extends hn {
  /**
   * @param {Options} options Tile options.
   */
  constructor(t) {
    const e = x.IDLE;
    super(t.tileCoord, e, {
      transition: t.transition,
      interpolate: t.interpolate
    }), this.loader_ = t.loader, this.data_ = null, this.error_ = null, this.size_ = t.size || null, this.controller_ = t.controller || null;
  }
  /**
   * Get the tile size.
   * @return {import('./size.js').Size} Tile size.
   */
  getSize() {
    if (this.size_)
      return this.size_;
    const t = Re(this.data_);
    return t ? [t.width, t.height] : Lr;
  }
  /**
   * Get the data for the tile.
   * @return {Data} Tile data.
   * @api
   */
  getData() {
    return this.data_;
  }
  /**
   * Get any loading error.
   * @return {Error} Loading error.
   * @api
   */
  getError() {
    return this.error_;
  }
  /**
   * Load the tile data.
   * @api
   * @override
   */
  load() {
    if (this.state !== x.IDLE && this.state !== x.ERROR)
      return;
    this.state = x.LOADING, this.changed();
    const t = this;
    this.loader_().then(function(e) {
      t.data_ = e, t.state = x.LOADED, t.changed();
    }).catch(function(e) {
      t.error_ = e, t.state = x.ERROR, t.changed();
    });
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.controller_ && (this.controller_.abort(Pr), this.controller_ = null), super.disposeInternal();
  }
}
class Ci extends He {
  /**
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {number|Array<number>|undefined} resolution Resolution. If provided as array, x and y
   * resolution will be assumed.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("./ImageState.js").default|import("./Image.js").Loader} stateOrLoader State.
   */
  constructor(t, e, n, s) {
    super(), this.extent = t, this.pixelRatio_ = n, this.resolution = e, this.state = typeof s == "function" ? O.IDLE : s, this.image_ = null, this.loader = typeof s == "function" ? s : null;
  }
  /**
   * @protected
   */
  changed() {
    this.dispatchEvent(B.CHANGE);
  }
  /**
   * @return {import("./extent.js").Extent} Extent.
   */
  getExtent() {
    return this.extent;
  }
  /**
   * @return {import('./DataTile.js').ImageLike} Image.
   */
  getImage() {
    return this.image_;
  }
  /**
   * @return {number} PixelRatio.
   */
  getPixelRatio() {
    return this.pixelRatio_;
  }
  /**
   * @return {number|Array<number>} Resolution.
   */
  getResolution() {
    return (
      /** @type {number} */
      this.resolution
    );
  }
  /**
   * @return {import("./ImageState.js").default} State.
   */
  getState() {
    return this.state;
  }
  /**
   * Load not yet loaded URI.
   */
  load() {
    if (this.state == O.IDLE && this.loader) {
      this.state = O.LOADING, this.changed();
      const t = this.getResolution(), e = Array.isArray(t) ? t[0] : t;
      Ki(
        () => this.loader(
          this.getExtent(),
          e,
          this.getPixelRatio()
        )
      ).then((n) => {
        "image" in n && (this.image_ = n.image), "extent" in n && (this.extent = n.extent), "resolution" in n && (this.resolution = n.resolution), "pixelRatio" in n && (this.pixelRatio_ = n.pixelRatio), (n instanceof HTMLImageElement || n instanceof ImageBitmap || n instanceof HTMLCanvasElement || n instanceof HTMLVideoElement) && (this.image_ = n), this.state = O.LOADED;
      }).catch((n) => {
        this.state = O.ERROR, console.error(n);
      }).finally(() => this.changed());
    }
  }
  /**
   * @param {import('./DataTile.js').ImageLike} image The image.
   */
  setImage(t) {
    this.image_ = t;
  }
  /**
   * @param {number|Array<number>} resolution Resolution.
   */
  setResolution(t) {
    this.resolution = t;
  }
}
function Fr(i, t, e) {
  const n = (
    /** @type {HTMLImageElement} */
    i
  );
  let s = !0, r = !1, o = !1;
  const a = [
    ce(n, B.LOAD, function() {
      o = !0, r || t();
    })
  ];
  return n.src && ln ? (r = !0, n.decode().then(function() {
    s && t();
  }).catch(function(l) {
    s && (o ? t() : e());
  })) : a.push(ce(n, B.ERROR, e)), function() {
    s = !1, a.forEach(st);
  };
}
function br(i, t) {
  return new Promise((e, n) => {
    function s() {
      o(), e(i);
    }
    function r() {
      o(), n(new Error("Image load error"));
    }
    function o() {
      i.removeEventListener("load", s), i.removeEventListener("error", r);
    }
    i.addEventListener("load", s), i.addEventListener("error", r);
  });
}
function Dr(i, t) {
  return i.src && ln ? new Promise(
    (e, n) => i.decode().then(() => e(i)).catch(
      (s) => i.complete && i.width ? e(i) : n(s)
    )
  ) : br(i);
}
function wi(i, t) {
  return t && (i.src = t), i.src && ln && Er ? i.decode().then(() => createImageBitmap(i)).catch((e) => {
    if (i.complete && i.width)
      return i;
    throw e;
  }) : Dr(i);
}
class Mi extends hn {
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("./TileState.js").default} state State.
   * @param {string} src Image source URI.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("./Tile.js").LoadFunction} tileLoadFunction Tile load function.
   * @param {import("./Tile.js").Options} [options] Tile options.
   */
  constructor(t, e, n, s, r, o) {
    super(t, e, o), this.crossOrigin_ = s, this.src_ = n, this.key = n, this.image_ = new Image(), s !== null && (this.image_.crossOrigin = s), this.unlisten_ = null, this.tileLoadFunction_ = r;
  }
  /**
   * Get the HTML image element for this tile (may be a Canvas, Image, or Video).
   * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
   * @api
   */
  getImage() {
    return this.image_;
  }
  /**
   * Sets an HTML image element for this tile (may be a Canvas or preloaded Image).
   * @param {HTMLCanvasElement|HTMLImageElement} element Element.
   */
  setImage(t) {
    this.image_ = t, this.state = x.LOADED, this.unlistenImage_(), this.changed();
  }
  /**
   * Tracks loading or read errors.
   *
   * @private
   */
  handleImageError_() {
    this.state = x.ERROR, this.unlistenImage_(), this.image_ = Gr(), this.changed();
  }
  /**
   * Tracks successful image load.
   *
   * @private
   */
  handleImageLoad_() {
    const t = (
      /** @type {HTMLImageElement} */
      this.image_
    );
    t.naturalWidth && t.naturalHeight ? this.state = x.LOADED : this.state = x.EMPTY, this.unlistenImage_(), this.changed();
  }
  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   *
   * To retry loading tiles on failed requests, use a custom `tileLoadFunction`
   * that checks for error status codes and reloads only when the status code is
   * 408, 429, 500, 502, 503 and 504, and only when not too many retries have been
   * made already:
   *
   * ```js
   * const retryCodes = [408, 429, 500, 502, 503, 504];
   * const retries = {};
   * source.setTileLoadFunction((tile, src) => {
   *   const image = tile.getImage();
   *   fetch(src)
   *     .then((response) => {
   *       if (retryCodes.includes(response.status)) {
   *         retries[src] = (retries[src] || 0) + 1;
   *         if (retries[src] <= 3) {
   *           setTimeout(() => tile.load(), retries[src] * 1000);
   *         }
   *         return Promise.reject();
   *       }
   *       return response.blob();
   *     })
   *     .then((blob) => {
   *       const imageUrl = URL.createObjectURL(blob);
   *       image.src = imageUrl;
   *       setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);
   *     })
   *     .catch(() => tile.setState(3)); // error
   * });
   * ```
   * @api
   * @override
   */
  load() {
    this.state == x.ERROR && (this.state = x.IDLE, this.image_ = new Image(), this.crossOrigin_ !== null && (this.image_.crossOrigin = this.crossOrigin_)), this.state == x.IDLE && (this.state = x.LOADING, this.changed(), this.tileLoadFunction_(this, this.src_), this.unlisten_ = Fr(
      this.image_,
      this.handleImageLoad_.bind(this),
      this.handleImageError_.bind(this)
    ));
  }
  /**
   * Discards event handlers which listen for load completion or errors.
   *
   * @private
   */
  unlistenImage_() {
    this.unlisten_ && (this.unlisten_(), this.unlisten_ = null);
  }
  /**
   * @override
   */
  disposeInternal() {
    this.unlistenImage_(), this.image_ = null, super.disposeInternal();
  }
}
function Gr() {
  const i = at(1, 1);
  return i.fillStyle = "rgba(0,0,0,0)", i.fillRect(0, 0, 1, 1), i.canvas;
}
class Nr {
  /**
   * @param {number} [highWaterMark] High water mark.
   */
  constructor(t) {
    this.highWaterMark = t !== void 0 ? t : 2048, this.count_ = 0, this.entries_ = {}, this.oldest_ = null, this.newest_ = null;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.highWaterMark > 0 && this.getCount() > this.highWaterMark;
  }
  /**
   * Expire the cache. When the cache entry is a {@link module:ol/Disposable~Disposable},
   * the entry will be disposed.
   * @param {!Object<string, boolean>} [keep] Keys to keep. To be implemented by subclasses.
   */
  expireCache(t) {
    for (; this.canExpireCache(); ) {
      const e = this.pop();
      e instanceof Qn && e.dispose();
    }
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    this.count_ = 0, this.entries_ = {}, this.oldest_ = null, this.newest_ = null;
  }
  /**
   * @param {string} key Key.
   * @return {boolean} Contains key.
   */
  containsKey(t) {
    return this.entries_.hasOwnProperty(t);
  }
  /**
   * @param {function(T, string, LRUCache<T>): ?} f The function
   *     to call for every entry from the oldest to the newer. This function takes
   *     3 arguments (the entry value, the entry key and the LRUCache object).
   *     The return value is ignored.
   */
  forEach(t) {
    let e = this.oldest_;
    for (; e; )
      t(e.value_, e.key_, this), e = e.newer;
  }
  /**
   * @param {string} key Key.
   * @param {*} [options] Options (reserved for subclasses).
   * @return {T} Value.
   */
  get(t, e) {
    const n = this.entries_[t];
    return Y(
      n !== void 0,
      "Tried to get a value for a key that does not exist in the cache"
    ), n === this.newest_ || (n === this.oldest_ ? (this.oldest_ = /** @type {Entry} */
    this.oldest_.newer, this.oldest_.older = null) : (n.newer.older = n.older, n.older.newer = n.newer), n.newer = null, n.older = this.newest_, this.newest_.newer = n, this.newest_ = n), n.value_;
  }
  /**
   * Remove an entry from the cache.
   * @param {string} key The entry key.
   * @return {T} The removed entry.
   */
  remove(t) {
    const e = this.entries_[t];
    return Y(
      e !== void 0,
      "Tried to get a value for a key that does not exist in the cache"
    ), e === this.newest_ ? (this.newest_ = /** @type {Entry} */
    e.older, this.newest_ && (this.newest_.newer = null)) : e === this.oldest_ ? (this.oldest_ = /** @type {Entry} */
    e.newer, this.oldest_ && (this.oldest_.older = null)) : (e.newer.older = e.older, e.older.newer = e.newer), delete this.entries_[t], --this.count_, e.value_;
  }
  /**
   * @return {number} Count.
   */
  getCount() {
    return this.count_;
  }
  /**
   * @return {Array<string>} Keys.
   */
  getKeys() {
    const t = new Array(this.count_);
    let e = 0, n;
    for (n = this.newest_; n; n = n.older)
      t[e++] = n.key_;
    return t;
  }
  /**
   * @return {Array<T>} Values.
   */
  getValues() {
    const t = new Array(this.count_);
    let e = 0, n;
    for (n = this.newest_; n; n = n.older)
      t[e++] = n.value_;
    return t;
  }
  /**
   * @return {T} Last value.
   */
  peekLast() {
    return this.oldest_.value_;
  }
  /**
   * @return {string} Last key.
   */
  peekLastKey() {
    return this.oldest_.key_;
  }
  /**
   * Get the key of the newest item in the cache.  Throws if the cache is empty.
   * @return {string} The newest key.
   */
  peekFirstKey() {
    return this.newest_.key_;
  }
  /**
   * Return an entry without updating least recently used time.
   * @param {string} key Key.
   * @return {T|undefined} Value.
   */
  peek(t) {
    var e;
    return (e = this.entries_[t]) == null ? void 0 : e.value_;
  }
  /**
   * @return {T} value Value.
   */
  pop() {
    const t = this.oldest_;
    return delete this.entries_[t.key_], t.newer && (t.newer.older = null), this.oldest_ = /** @type {Entry} */
    t.newer, this.oldest_ || (this.newest_ = null), --this.count_, t.value_;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  replace(t, e) {
    this.get(t), this.entries_[t].value_ = e;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  set(t, e) {
    Y(
      !(t in this.entries_),
      "Tried to set a value for a key that is used already"
    );
    const n = {
      key_: t,
      newer: null,
      older: this.newest_,
      value_: e
    };
    this.newest_ ? this.newest_.newer = n : this.oldest_ = n, this.newest_ = n, this.entries_[t] = n, ++this.count_;
  }
  /**
   * Set a maximum number of entries for the cache.
   * @param {number} size Cache size.
   * @api
   */
  setSize(t) {
    this.highWaterMark = t;
  }
}
const cn = 0.5, jr = 10, Kn = 0.25;
class un {
  /**
   * @param {import("../proj/Projection.js").default} sourceProj Source projection.
   * @param {import("../proj/Projection.js").default} targetProj Target projection.
   * @param {import("../extent.js").Extent} targetExtent Target extent to triangulate.
   * @param {import("../extent.js").Extent} maxSourceExtent Maximal source extent that can be used.
   * @param {number} errorThreshold Acceptable error (in source units).
   * @param {?number} destinationResolution The (optional) resolution of the destination.
   */
  constructor(t, e, n, s, r, o) {
    this.sourceProj_ = t, this.targetProj_ = e;
    let a = {};
    const l = fe(this.targetProj_, this.sourceProj_);
    this.transformInv_ = function(m) {
      const y = m[0] + "/" + m[1];
      return a[y] || (a[y] = l(m)), a[y];
    }, this.maxSourceExtent_ = s, this.errorThresholdSquared_ = r * r, this.triangles_ = [], this.wrapsXInSource_ = !1, this.canWrapXInSource_ = this.sourceProj_.canWrapX() && !!s && !!this.sourceProj_.getExtent() && P(s) >= P(this.sourceProj_.getExtent()), this.sourceWorldWidth_ = this.sourceProj_.getExtent() ? P(this.sourceProj_.getExtent()) : null, this.targetWorldWidth_ = this.targetProj_.getExtent() ? P(this.targetProj_.getExtent()) : null;
    const h = At(n), c = we(n), u = Ce(n), d = Ie(n), f = this.transformInv_(h), g = this.transformInv_(c), _ = this.transformInv_(u), R = this.transformInv_(d), E = jr + (o ? Math.max(
      0,
      Math.ceil(
        Math.log2(
          Kt(n) / (o * o * 256 * 256)
        )
      )
    ) : 0);
    if (this.addQuad_(
      h,
      c,
      u,
      d,
      f,
      g,
      _,
      R,
      E
    ), this.wrapsXInSource_) {
      let m = 1 / 0;
      this.triangles_.forEach(function(y, T, p) {
        m = Math.min(
          m,
          y.source[0][0],
          y.source[1][0],
          y.source[2][0]
        );
      }), this.triangles_.forEach((y) => {
        if (Math.max(
          y.source[0][0],
          y.source[1][0],
          y.source[2][0]
        ) - m > this.sourceWorldWidth_ / 2) {
          const T = [
            [y.source[0][0], y.source[0][1]],
            [y.source[1][0], y.source[1][1]],
            [y.source[2][0], y.source[2][1]]
          ];
          T[0][0] - m > this.sourceWorldWidth_ / 2 && (T[0][0] -= this.sourceWorldWidth_), T[1][0] - m > this.sourceWorldWidth_ / 2 && (T[1][0] -= this.sourceWorldWidth_), T[2][0] - m > this.sourceWorldWidth_ / 2 && (T[2][0] -= this.sourceWorldWidth_);
          const p = Math.min(
            T[0][0],
            T[1][0],
            T[2][0]
          );
          Math.max(
            T[0][0],
            T[1][0],
            T[2][0]
          ) - p < this.sourceWorldWidth_ / 2 && (y.source = T);
        }
      });
    }
    a = {};
  }
  /**
   * Adds triangle to the triangulation.
   * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
   * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
   * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
   * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
   * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
   * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
   * @private
   */
  addTriangle_(t, e, n, s, r, o) {
    this.triangles_.push({
      source: [s, r, o],
      target: [t, e, n]
    });
  }
  /**
   * Adds quad (points in clock-wise order) to the triangulation
   * (and reprojects the vertices) if valid.
   * Performs quad subdivision if needed to increase precision.
   *
   * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
   * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
   * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
   * @param {import("../coordinate.js").Coordinate} d The target d coordinate.
   * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
   * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
   * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
   * @param {import("../coordinate.js").Coordinate} dSrc The source d coordinate.
   * @param {number} maxSubdivision Maximal allowed subdivision of the quad.
   * @private
   */
  addQuad_(t, e, n, s, r, o, a, l, h) {
    const c = wn([r, o, a, l]), u = this.sourceWorldWidth_ ? P(c) / this.sourceWorldWidth_ : null, d = (
      /** @type {number} */
      this.sourceWorldWidth_
    ), f = this.sourceProj_.canWrapX() && u > 0.5 && u < 1;
    let g = !1;
    if (h > 0) {
      if (this.targetProj_.isGlobal() && this.targetWorldWidth_) {
        const R = wn([t, e, n, s]);
        g = P(R) / this.targetWorldWidth_ > Kn || g;
      }
      !f && this.sourceProj_.isGlobal() && u && (g = u > Kn || g);
    }
    if (!g && this.maxSourceExtent_ && isFinite(c[0]) && isFinite(c[1]) && isFinite(c[2]) && isFinite(c[3]) && !Zt(c, this.maxSourceExtent_))
      return;
    let _ = 0;
    if (!g && (!isFinite(r[0]) || !isFinite(r[1]) || !isFinite(o[0]) || !isFinite(o[1]) || !isFinite(a[0]) || !isFinite(a[1]) || !isFinite(l[0]) || !isFinite(l[1]))) {
      if (h > 0)
        g = !0;
      else if (_ = (!isFinite(r[0]) || !isFinite(r[1]) ? 8 : 0) + (!isFinite(o[0]) || !isFinite(o[1]) ? 4 : 0) + (!isFinite(a[0]) || !isFinite(a[1]) ? 2 : 0) + (!isFinite(l[0]) || !isFinite(l[1]) ? 1 : 0), _ != 1 && _ != 2 && _ != 4 && _ != 8)
        return;
    }
    if (h > 0) {
      if (!g) {
        const R = [(t[0] + n[0]) / 2, (t[1] + n[1]) / 2], E = this.transformInv_(R);
        let m;
        f ? m = (Xt(r[0], d) + Xt(a[0], d)) / 2 - Xt(E[0], d) : m = (r[0] + a[0]) / 2 - E[0];
        const y = (r[1] + a[1]) / 2 - E[1];
        g = m * m + y * y > this.errorThresholdSquared_;
      }
      if (g) {
        if (Math.abs(t[0] - n[0]) <= Math.abs(t[1] - n[1])) {
          const R = [(e[0] + n[0]) / 2, (e[1] + n[1]) / 2], E = this.transformInv_(R), m = [(s[0] + t[0]) / 2, (s[1] + t[1]) / 2], y = this.transformInv_(m);
          this.addQuad_(
            t,
            e,
            R,
            m,
            r,
            o,
            E,
            y,
            h - 1
          ), this.addQuad_(
            m,
            R,
            n,
            s,
            y,
            E,
            a,
            l,
            h - 1
          );
        } else {
          const R = [(t[0] + e[0]) / 2, (t[1] + e[1]) / 2], E = this.transformInv_(R), m = [(n[0] + s[0]) / 2, (n[1] + s[1]) / 2], y = this.transformInv_(m);
          this.addQuad_(
            t,
            R,
            m,
            s,
            r,
            E,
            y,
            l,
            h - 1
          ), this.addQuad_(
            R,
            e,
            n,
            m,
            E,
            o,
            a,
            y,
            h - 1
          );
        }
        return;
      }
    }
    if (f) {
      if (!this.canWrapXInSource_)
        return;
      this.wrapsXInSource_ = !0;
    }
    _ & 11 || this.addTriangle_(t, n, s, r, a, l), _ & 14 || this.addTriangle_(t, n, e, r, a, o), _ && (_ & 13 || this.addTriangle_(e, s, t, o, l, r), _ & 7 || this.addTriangle_(e, s, n, o, l, a));
  }
  /**
   * Calculates extent of the `source` coordinates from all the triangles.
   *
   * @return {import("../extent.js").Extent} Calculated extent.
   */
  calculateSourceExtent() {
    const t = St();
    return this.triangles_.forEach(function(e, n, s) {
      const r = e.source;
      le(t, r[0]), le(t, r[1]), le(t, r[2]);
    }), t;
  }
  /**
   * @return {Array<Triangle>} Array of the calculated triangles.
   */
  getTriangles() {
    return this.triangles_;
  }
}
let Fe;
const ut = [];
function Vn(i, t, e, n, s) {
  i.beginPath(), i.moveTo(0, 0), i.lineTo(t, e), i.lineTo(n, s), i.closePath(), i.save(), i.clip(), i.fillRect(0, 0, Math.max(t, n) + 1, Math.max(e, s)), i.restore();
}
function be(i, t) {
  return Math.abs(i[t * 4] - 210) > 2 || Math.abs(i[t * 4 + 3] - 0.75 * 255) > 2;
}
function Xr() {
  if (Fe === void 0) {
    const i = at(6, 6, ut);
    i.globalCompositeOperation = "lighter", i.fillStyle = "rgba(210, 0, 0, 0.75)", Vn(i, 4, 5, 4, 0), Vn(i, 4, 5, 0, 5);
    const t = i.getImageData(0, 0, 3, 3).data;
    Fe = be(t, 0) || be(t, 4) || be(t, 8), qt(i), ut.push(i.canvas);
  }
  return Fe;
}
function Ee(i, t, e, n) {
  const s = ci(e, t, i);
  let r = Sn(
    t,
    n,
    e
  );
  const o = t.getMetersPerUnit();
  o !== void 0 && (r *= o);
  const a = i.getMetersPerUnit();
  a !== void 0 && (r /= a);
  const l = i.getExtent();
  if (!l || xe(l, s)) {
    const h = Sn(i, r, s) / r;
    isFinite(h) && h > 0 && (r /= h);
  }
  return r;
}
function vi(i, t, e, n) {
  const s = Tt(e);
  let r = Ee(
    i,
    t,
    s,
    n
  );
  return (!isFinite(r) || r <= 0) && oi(e, function(o) {
    return r = Ee(
      i,
      t,
      o,
      n
    ), isFinite(r) && r > 0;
  }), r;
}
function dn(i, t, e, n, s, r, o, a, l, h, c, u, d, f) {
  const g = at(
    Math.round(e * i),
    Math.round(e * t),
    ut
  );
  if (u || (g.imageSmoothingEnabled = !1), l.length === 0)
    return g.canvas;
  g.scale(e, e);
  function _(p) {
    return Math.round(p * e) / e;
  }
  g.globalCompositeOperation = "lighter";
  const R = St();
  l.forEach(function(p, w, v) {
    ds(R, p.extent);
  });
  let E;
  const m = e / n, y = (u ? 1 : 1 + Math.pow(2, -24)) / m;
  if (!d || l.length !== 1 || h !== 0) {
    if (E = at(
      Math.round(P(R) * m),
      Math.round(U(R) * m),
      ut
    ), u || (E.imageSmoothingEnabled = !1), s && f) {
      const p = (s[0] - R[0]) * m, w = -(s[3] - R[3]) * m, v = P(s) * m, I = U(s) * m;
      E.rect(p, w, v, I), E.clip();
    }
    l.forEach(function(p, w, v) {
      if (p.image.width > 0 && p.image.height > 0) {
        if (p.clipExtent) {
          E.save();
          const b = (p.clipExtent[0] - R[0]) * m, F = -(p.clipExtent[3] - R[3]) * m, C = P(p.clipExtent) * m, G = U(p.clipExtent) * m;
          E.rect(
            u ? b : Math.round(b),
            u ? F : Math.round(F),
            u ? C : Math.round(b + C) - Math.round(b),
            u ? G : Math.round(F + G) - Math.round(F)
          ), E.clip();
        }
        const I = (p.extent[0] - R[0]) * m, M = -(p.extent[3] - R[3]) * m, D = P(p.extent) * m, L = U(p.extent) * m;
        E.drawImage(
          p.image,
          h,
          h,
          p.image.width - 2 * h,
          p.image.height - 2 * h,
          u ? I : Math.round(I),
          u ? M : Math.round(M),
          u ? D : Math.round(I + D) - Math.round(I),
          u ? L : Math.round(M + L) - Math.round(M)
        ), p.clipExtent && E.restore();
      }
    });
  }
  const T = At(o);
  return a.getTriangles().forEach(function(p, w, v) {
    const I = p.source, M = p.target;
    let D = I[0][0], L = I[0][1], b = I[1][0], F = I[1][1], C = I[2][0], G = I[2][1];
    const A = _((M[0][0] - T[0]) / r), V = _(
      -(M[0][1] - T[1]) / r
    ), J = _((M[1][0] - T[0]) / r), tt = _(
      -(M[1][1] - T[1]) / r
    ), N = _((M[2][0] - T[0]) / r), j = _(
      -(M[2][1] - T[1]) / r
    ), k = D, dt = L;
    D = 0, L = 0, b -= k, F -= dt, C -= k, G -= dt;
    const It = [
      [b, F, 0, 0, J - A],
      [C, G, 0, 0, N - A],
      [0, 0, b, F, tt - V],
      [0, 0, C, G, j - V]
    ], rt = $i(It);
    if (!rt)
      return;
    if (g.save(), g.beginPath(), Xr() || !u) {
      g.moveTo(J, tt);
      const H = 4, gt = A - J, Ct = V - tt;
      for (let lt = 0; lt < H; lt++)
        g.lineTo(
          J + _((lt + 1) * gt / H),
          tt + _(lt * Ct / (H - 1))
        ), lt != H - 1 && g.lineTo(
          J + _((lt + 1) * gt / H),
          tt + _((lt + 1) * Ct / (H - 1))
        );
      g.lineTo(N, j);
    } else
      g.moveTo(J, tt), g.lineTo(A, V), g.lineTo(N, j);
    g.clip(), g.transform(
      rt[0],
      rt[2],
      rt[1],
      rt[3],
      A,
      V
    ), g.translate(
      R[0] - k,
      R[3] - dt
    );
    let q;
    if (E)
      q = E.canvas, g.scale(y, -y);
    else {
      const H = l[0], gt = H.extent;
      q = H.image, g.scale(
        P(gt) / q.width,
        -U(gt) / q.height
      );
    }
    g.drawImage(q, 0, 0), g.restore();
  }), E && (qt(E), ut.push(E.canvas)), c && (g.save(), g.globalCompositeOperation = "source-over", g.strokeStyle = "black", g.lineWidth = 1, a.getTriangles().forEach(function(p, w, v) {
    const I = p.target, M = (I[0][0] - T[0]) / r, D = -(I[0][1] - T[1]) / r, L = (I[1][0] - T[0]) / r, b = -(I[1][1] - T[1]) / r, F = (I[2][0] - T[0]) / r, C = -(I[2][1] - T[1]) / r;
    g.beginPath(), g.moveTo(L, b), g.lineTo(M, D), g.lineTo(F, C), g.closePath(), g.stroke();
  }), g.restore()), g.canvas;
}
class zr extends ke {
  /**
   * @param {Options} options Tile options.
   */
  constructor(t) {
    super({
      tileCoord: t.tileCoord,
      loader: () => Promise.resolve(new Uint8ClampedArray(4)),
      interpolate: t.interpolate,
      transition: t.transition
    }), this.pixelRatio_ = t.pixelRatio, this.gutter_ = t.gutter, this.reprojData_ = null, this.reprojError_ = null, this.reprojSize_ = void 0, this.sourceTileGrid_ = t.sourceTileGrid, this.targetTileGrid_ = t.targetTileGrid, this.wrappedTileCoord_ = t.wrappedTileCoord || t.tileCoord, this.sourceTiles_ = [], this.sourcesListenerKeys_ = null, this.sourceZ_ = 0;
    const e = t.sourceProj, n = e.getExtent(), s = t.sourceTileGrid.getExtent();
    this.clipExtent_ = e.canWrapX() ? s ? Q(n, s) : n : s;
    const r = this.targetTileGrid_.getTileCoordExtent(
      this.wrappedTileCoord_
    ), o = this.targetTileGrid_.getExtent();
    let a = this.sourceTileGrid_.getExtent();
    const l = o ? Q(r, o) : r;
    if (Kt(l) === 0) {
      this.state = x.EMPTY;
      return;
    }
    n && (a ? a = Q(a, n) : a = n);
    const h = this.targetTileGrid_.getResolution(
      this.wrappedTileCoord_[0]
    ), c = t.targetProj, u = vi(
      e,
      c,
      l,
      h
    );
    if (!isFinite(u) || u <= 0) {
      this.state = x.EMPTY;
      return;
    }
    const d = t.errorThreshold !== void 0 ? t.errorThreshold : cn;
    if (this.triangulation_ = new un(
      e,
      c,
      l,
      a,
      u * d,
      h
    ), this.triangulation_.getTriangles().length === 0) {
      this.state = x.EMPTY;
      return;
    }
    this.sourceZ_ = this.sourceTileGrid_.getZForResolution(u);
    let f = this.triangulation_.calculateSourceExtent();
    if (a && (e.canWrapX() ? (f[1] = z(
      f[1],
      a[1],
      a[3]
    ), f[3] = z(
      f[3],
      a[1],
      a[3]
    )) : f = Q(f, a)), !Kt(f))
      this.state = x.EMPTY;
    else {
      let g = 0, _ = 0;
      e.canWrapX() && (g = P(n), _ = Math.floor(
        (f[0] - n[0]) / g
      )), ai(
        f.slice(),
        e,
        !0
      ).forEach((E) => {
        const m = this.sourceTileGrid_.getTileRangeForExtentAndZ(
          E,
          this.sourceZ_
        ), y = t.getTileFunction;
        for (let T = m.minX; T <= m.maxX; T++)
          for (let p = m.minY; p <= m.maxY; p++) {
            const w = y(this.sourceZ_, T, p, this.pixelRatio_);
            if (w) {
              const v = _ * g;
              this.sourceTiles_.push({ tile: w, offset: v });
            }
          }
        ++_;
      }), this.sourceTiles_.length === 0 && (this.state = x.EMPTY);
    }
  }
  /**
   * Get the tile size.
   * @return {import('../size.js').Size} Tile size.
   * @override
   */
  getSize() {
    return this.reprojSize_;
  }
  /**
   * Get the data for the tile.
   * @return {import("../DataTile.js").Data} Tile data.
   * @override
   */
  getData() {
    return this.reprojData_;
  }
  /**
   * Get any loading error.
   * @return {Error} Loading error.
   * @override
   */
  getError() {
    return this.reprojError_;
  }
  /**
   * @private
   */
  reproject_() {
    const t = [];
    let e = !1;
    if (this.sourceTiles_.forEach((g) => {
      var V;
      const _ = g.tile;
      if (!_ || _.getState() !== x.LOADED)
        return;
      const R = _.getSize(), E = this.gutter_;
      let m;
      const y = Ar(_.getData());
      y ? m = y : (e = !0, m = Or(Re(_.getData())));
      const T = [R[0] + 2 * E, R[1] + 2 * E], p = m instanceof Float32Array, w = T[0] * T[1], v = p ? Float32Array : Uint8ClampedArray, I = new v(m.buffer), M = v.BYTES_PER_ELEMENT, D = M * I.length / w, L = I.byteLength / T[1], b = Math.floor(
        L / M / T[0]
      ), F = w * b;
      let C = I;
      if (I.length !== F) {
        C = new v(F);
        let J = 0, tt = 0;
        const N = T[0] * b;
        for (let j = 0; j < T[1]; ++j) {
          for (let k = 0; k < N; ++k)
            C[J++] = I[tt + k];
          tt += L / M;
        }
      }
      const G = this.sourceTileGrid_.getTileCoordExtent(_.tileCoord);
      G[0] += g.offset, G[2] += g.offset;
      const A = (V = this.clipExtent_) == null ? void 0 : V.slice();
      A && (A[0] += g.offset, A[2] += g.offset), t.push({
        extent: G,
        clipExtent: A,
        data: new Uint8ClampedArray(C.buffer),
        dataType: v,
        bytesPerPixel: D,
        pixelSize: T
      });
    }), this.sourceTiles_.length = 0, t.length === 0) {
      this.state = x.ERROR, this.changed();
      return;
    }
    const n = this.wrappedTileCoord_[0], s = this.targetTileGrid_.getTileSize(n), r = typeof s == "number" ? s : s[0], o = typeof s == "number" ? s : s[1], a = this.targetTileGrid_.getResolution(n), l = this.sourceTileGrid_.getResolution(this.sourceZ_), h = this.targetTileGrid_.getTileCoordExtent(
      this.wrappedTileCoord_
    );
    let c, u;
    const d = t[0].bytesPerPixel, f = Math.ceil(d / 3);
    for (let g = f - 1; g >= 0; --g) {
      const _ = [];
      for (let p = 0, w = t.length; p < w; ++p) {
        const v = t[p], I = v.data, M = v.pixelSize, D = M[0], L = M[1], b = at(D, L, ut), F = b.createImageData(D, L), C = F.data;
        let G = g * 3;
        for (let A = 0, V = C.length; A < V; A += 4)
          C[A] = I[G], C[A + 1] = I[G + 1], C[A + 2] = I[G + 2], C[A + 3] = 255, G += d;
        b.putImageData(F, 0, 0), _.push({
          extent: v.extent,
          clipExtent: v.clipExtent,
          image: b.canvas
        });
      }
      const R = dn(
        r,
        o,
        this.pixelRatio_,
        l,
        this.sourceTileGrid_.getExtent(),
        a,
        h,
        this.triangulation_,
        _,
        this.gutter_,
        !1,
        !1,
        !1
      );
      for (let p = 0, w = _.length; p < w; ++p) {
        const I = _[p].image.getContext("2d");
        qt(I), ut.push(I.canvas);
      }
      const E = R.getContext("2d"), m = E.getImageData(0, 0, R.width, R.height);
      qt(E), ut.push(R), c || (u = new Uint8ClampedArray(
        d * m.width * m.height
      ), c = new t[0].dataType(u.buffer));
      const y = m.data;
      let T = g * 3;
      for (let p = 0, w = y.length; p < w; p += 4)
        y[p + 3] === 255 ? (u[T] = y[p], u[T + 1] = y[p + 1], u[T + 2] = y[p + 2]) : (u[T] = 0, u[T + 1] = 0, u[T + 2] = 0), T += d;
    }
    if (e) {
      const g = at(r, o), _ = new ImageData(c, r);
      g.putImageData(_, 0, 0), this.reprojData_ = g.canvas;
    } else
      this.reprojData_ = c;
    this.reprojSize_ = [
      Math.round(r * this.pixelRatio_),
      Math.round(o * this.pixelRatio_)
    ], this.state = x.LOADED, this.changed();
  }
  /**
   * Load not yet loaded URI.
   * @override
   */
  load() {
    if (this.state !== x.IDLE && this.state !== x.ERROR)
      return;
    this.state = x.LOADING, this.changed();
    let t = 0;
    this.sourcesListenerKeys_ = [], this.sourceTiles_.forEach(({ tile: e }) => {
      const n = e.getState();
      if (n !== x.IDLE && n !== x.LOADING)
        return;
      t++;
      const s = ct(e, B.CHANGE, () => {
        const r = e.getState();
        (r == x.LOADED || r == x.ERROR || r == x.EMPTY) && (st(s), t--, t === 0 && (this.unlistenSources_(), this.reproject_()));
      });
      this.sourcesListenerKeys_.push(s);
    }), t === 0 ? setTimeout(this.reproject_.bind(this), 0) : this.sourceTiles_.forEach(function({ tile: e }) {
      e.getState() == x.IDLE && e.load();
    });
  }
  /**
   * @private
   */
  unlistenSources_() {
    this.sourcesListenerKeys_.forEach(st), this.sourcesListenerKeys_ = null;
  }
}
class We extends hn {
  /**
   * @param {import("../proj/Projection.js").default} sourceProj Source projection.
   * @param {import("../tilegrid/TileGrid.js").default} sourceTileGrid Source tile grid.
   * @param {import("../proj/Projection.js").default} targetProj Target projection.
   * @param {import("../tilegrid/TileGrid.js").default} targetTileGrid Target tile grid.
   * @param {import("../tilecoord.js").TileCoord} tileCoord Coordinate of the tile.
   * @param {import("../tilecoord.js").TileCoord} wrappedTileCoord Coordinate of the tile wrapped in X.
   * @param {number} pixelRatio Pixel ratio.
   * @param {number} gutter Gutter of the source tiles.
   * @param {FunctionType} getTileFunction
   *     Function returning source tiles (z, x, y, pixelRatio).
   * @param {number} [errorThreshold] Acceptable reprojection error (in px).
   * @param {boolean} [renderEdges] Render reprojection edges.
   * @param {import("../Tile.js").Options} [options] Tile options.
   */
  constructor(t, e, n, s, r, o, a, l, h, c, u, d) {
    super(r, x.IDLE, d), this.renderEdges_ = u !== void 0 ? u : !1, this.pixelRatio_ = a, this.gutter_ = l, this.canvas_ = null, this.sourceTileGrid_ = e, this.targetTileGrid_ = s, this.wrappedTileCoord_ = o || r, this.sourceTiles_ = [], this.sourcesListenerKeys_ = null, this.sourceZ_ = 0, this.clipExtent_ = t.canWrapX() ? t.getExtent() : void 0;
    const f = s.getTileCoordExtent(
      this.wrappedTileCoord_
    ), g = this.targetTileGrid_.getExtent();
    let _ = this.sourceTileGrid_.getExtent();
    const R = g ? Q(f, g) : f;
    if (Kt(R) === 0) {
      this.state = x.EMPTY;
      return;
    }
    const E = t.getExtent();
    E && (_ ? _ = Q(_, E) : _ = E);
    const m = s.getResolution(
      this.wrappedTileCoord_[0]
    ), y = vi(
      t,
      n,
      R,
      m
    );
    if (!isFinite(y) || y <= 0) {
      this.state = x.EMPTY;
      return;
    }
    const T = c !== void 0 ? c : cn;
    if (this.triangulation_ = new un(
      t,
      n,
      R,
      _,
      y * T,
      m
    ), this.triangulation_.getTriangles().length === 0) {
      this.state = x.EMPTY;
      return;
    }
    this.sourceZ_ = e.getZForResolution(y);
    let p = this.triangulation_.calculateSourceExtent();
    if (_ && (t.canWrapX() ? (p[1] = z(
      p[1],
      _[1],
      _[3]
    ), p[3] = z(
      p[3],
      _[1],
      _[3]
    )) : p = Q(p, _)), !Kt(p))
      this.state = x.EMPTY;
    else {
      let w = 0, v = 0;
      t.canWrapX() && (w = P(E), v = Math.floor(
        (p[0] - E[0]) / w
      )), ai(
        p.slice(),
        t,
        !0
      ).forEach((M) => {
        const D = e.getTileRangeForExtentAndZ(
          M,
          this.sourceZ_
        );
        for (let L = D.minX; L <= D.maxX; L++)
          for (let b = D.minY; b <= D.maxY; b++) {
            const F = h(this.sourceZ_, L, b, a);
            if (F) {
              const C = v * w;
              this.sourceTiles_.push({ tile: F, offset: C });
            }
          }
        ++v;
      }), this.sourceTiles_.length === 0 && (this.state = x.EMPTY);
    }
  }
  /**
   * Get the HTML Canvas element for this tile.
   * @return {HTMLCanvasElement} Canvas.
   */
  getImage() {
    return this.canvas_;
  }
  /**
   * @private
   */
  reproject_() {
    const t = [];
    if (this.sourceTiles_.forEach((e) => {
      var s;
      const n = e.tile;
      if (n && n.getState() == x.LOADED) {
        const r = this.sourceTileGrid_.getTileCoordExtent(n.tileCoord);
        r[0] += e.offset, r[2] += e.offset;
        const o = (s = this.clipExtent_) == null ? void 0 : s.slice();
        o && (o[0] += e.offset, o[2] += e.offset), t.push({
          extent: r,
          clipExtent: o,
          image: n.getImage()
        });
      }
    }), this.sourceTiles_.length = 0, t.length === 0)
      this.state = x.ERROR;
    else {
      const e = this.wrappedTileCoord_[0], n = this.targetTileGrid_.getTileSize(e), s = typeof n == "number" ? n : n[0], r = typeof n == "number" ? n : n[1], o = this.targetTileGrid_.getResolution(e), a = this.sourceTileGrid_.getResolution(
        this.sourceZ_
      ), l = this.targetTileGrid_.getTileCoordExtent(
        this.wrappedTileCoord_
      );
      this.canvas_ = dn(
        s,
        r,
        this.pixelRatio_,
        a,
        this.sourceTileGrid_.getExtent(),
        o,
        l,
        this.triangulation_,
        t,
        this.gutter_,
        this.renderEdges_,
        this.interpolate
      ), this.state = x.LOADED;
    }
    this.changed();
  }
  /**
   * Load not yet loaded URI.
   * @override
   */
  load() {
    if (this.state == x.IDLE) {
      this.state = x.LOADING, this.changed();
      let t = 0;
      this.sourcesListenerKeys_ = [], this.sourceTiles_.forEach(({ tile: e }) => {
        const n = e.getState();
        if (n == x.IDLE || n == x.LOADING) {
          t++;
          const s = ct(e, B.CHANGE, (r) => {
            const o = e.getState();
            (o == x.LOADED || o == x.ERROR || o == x.EMPTY) && (st(s), t--, t === 0 && (this.unlistenSources_(), this.reproject_()));
          });
          this.sourcesListenerKeys_.push(s);
        }
      }), t === 0 ? setTimeout(this.reproject_.bind(this), 0) : this.sourceTiles_.forEach(function({ tile: e }, n, s) {
        e.getState() == x.IDLE && e.load();
      });
    }
  }
  /**
   * @private
   */
  unlistenSources_() {
    this.sourcesListenerKeys_.forEach(st), this.sourcesListenerKeys_ = null;
  }
  /**
   * Remove from the cache due to expiry
   * @override
   */
  release() {
    this.canvas_ && (qt(this.canvas_.getContext("2d")), ut.push(this.canvas_), this.canvas_ = null), super.release();
  }
}
class gn {
  /**
   * @param {number} minX Minimum X.
   * @param {number} maxX Maximum X.
   * @param {number} minY Minimum Y.
   * @param {number} maxY Maximum Y.
   */
  constructor(t, e, n, s) {
    this.minX = t, this.maxX = e, this.minY = n, this.maxY = s;
  }
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {boolean} Contains tile coordinate.
   */
  contains(t) {
    return this.containsXY(t[1], t[2]);
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Contains.
   */
  containsTileRange(t) {
    return this.minX <= t.minX && t.maxX <= this.maxX && this.minY <= t.minY && t.maxY <= this.maxY;
  }
  /**
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @return {boolean} Contains coordinate.
   */
  containsXY(t, e) {
    return this.minX <= t && t <= this.maxX && this.minY <= e && e <= this.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Equals.
   */
  equals(t) {
    return this.minX == t.minX && this.minY == t.minY && this.maxX == t.maxX && this.maxY == t.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   */
  extend(t) {
    t.minX < this.minX && (this.minX = t.minX), t.maxX > this.maxX && (this.maxX = t.maxX), t.minY < this.minY && (this.minY = t.minY), t.maxY > this.maxY && (this.maxY = t.maxY);
  }
  /**
   * @return {number} Height.
   */
  getHeight() {
    return this.maxY - this.minY + 1;
  }
  /**
   * @return {import("./size.js").Size} Size.
   */
  getSize() {
    return [this.getWidth(), this.getHeight()];
  }
  /**
   * @return {number} Width.
   */
  getWidth() {
    return this.maxX - this.minX + 1;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Intersects.
   */
  intersects(t) {
    return this.minX <= t.maxX && this.maxX >= t.minX && this.minY <= t.maxY && this.maxY >= t.minY;
  }
}
function Ft(i, t, e, n, s) {
  return s !== void 0 ? (s.minX = i, s.maxX = t, s.minY = e, s.maxY = n, s) : new gn(i, t, e, n);
}
function pe(i, t, e, n) {
  return n !== void 0 ? (n[0] = i, n[1] = t, n[2] = e, n) : [i, t, e];
}
function Zr(i, t, e) {
  return i + "/" + t + "/" + e;
}
function Yr(i) {
  return Ur(i[0], i[1], i[2]);
}
function Ur(i, t, e) {
  return (t << i) + e;
}
function kr(i, t) {
  const e = i[0], n = i[1], s = i[2];
  if (t.getMinZoom() > e || e > t.getMaxZoom())
    return !1;
  const r = t.getFullTileRange(e);
  return r ? r.containsXY(n, s) : !0;
}
function Wr(i, t, e) {
  return e === void 0 && (e = [0, 0]), e[0] = i[0] * t + 0.5 | 0, e[1] = i[1] * t + 0.5 | 0, e;
}
function pt(i, t) {
  return Array.isArray(i) ? i : (t === void 0 ? t = [i, i] : (t[0] = i, t[1] = i), t);
}
function De(i, t, e, n) {
  return `${i},${Zr(t, e, n)}`;
}
function Ge(i, t, e) {
  if (!(e in i))
    return i[e] = /* @__PURE__ */ new Set([t]), !0;
  const n = i[e], s = n.has(t);
  return s || n.add(t), !s;
}
function Kr(i, t, e) {
  const n = i[e];
  return n ? n.delete(t) : !1;
}
function Hn(i, t) {
  const e = i.layerStatesArray[i.layerIndex];
  e.extent && (t = Q(
    t,
    ht(e.extent, i.viewState.projection)
  ));
  const n = (
    /** @type {import("../../source/Tile.js").default} */
    e.layer.getRenderSource()
  );
  if (!n.getWrapX()) {
    const s = n.getTileGridForProjection(i.viewState.projection).getExtent();
    s && (t = Q(t, s));
  }
  return t;
}
class Vr extends Ii {
  /**
   * @param {LayerType} tileLayer Tile layer.
   * @param {Options} [options] Options.
   */
  constructor(t, e) {
    super(t), e = e || {}, this.extentChanged = !0, this.renderComplete = !1, this.renderedExtent_ = null, this.renderedPixelRatio, this.renderedProjection = null, this.renderedRevision, this.renderedTiles = [], this.renderedSourceKey_, this.renderedSourceRevision_, this.tempExtent = St(), this.tempTileRange_ = new gn(0, 0, 0, 0), this.tempTileCoord_ = pe(0, 0, 0);
    const n = e.cacheSize !== void 0 ? e.cacheSize : 512;
    this.tileCache_ = new Nr(n), this.renderedProjection_ = void 0, this.maxStaleKeys = n * 0.5;
  }
  /**
   * @return {LRUCache} Tile cache.
   */
  getTileCache() {
    return this.tileCache_;
  }
  /**
   * Get a tile from the cache or create one if needed.
   *
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {import("../../Tile.js").default|null} Tile (or null if outside source extent).
   * @protected
   */
  getOrCreateTile(t, e, n, s) {
    const r = this.tileCache_, a = this.getLayer().getSource(), l = De(a.getKey(), t, e, n);
    let h;
    if (r.containsKey(l))
      h = r.get(l);
    else {
      if (h = a.getTile(
        t,
        e,
        n,
        s.pixelRatio,
        s.viewState.projection
      ), !h)
        return null;
      r.set(l, h);
    }
    return h;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {import("../../Tile.js").default|null} Tile (or null if outside source extent).
   * @protected
   */
  getTile(t, e, n, s) {
    const r = this.getOrCreateTile(t, e, n, s);
    return r || null;
  }
  /**
   * @param {import("../../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray} Data at the pixel location.
   * @override
   */
  getData(t) {
    const e = this.frameState;
    if (!e)
      return null;
    const n = this.getLayer(), s = nt(
      e.pixelToCoordinateTransform,
      t.slice()
    ), r = n.getExtent();
    if (r && !xe(r, s))
      return null;
    const o = e.viewState, a = n.getRenderSource(), l = a.getTileGridForProjection(o.projection), h = a.getTilePixelRatio(e.pixelRatio);
    for (let c = l.getZForResolution(o.resolution); c >= l.getMinZoom(); --c) {
      const u = l.getTileCoordForCoordAndZ(s, c), d = this.getTile(c, u[1], u[2], e);
      if (!d || d.getState() !== x.LOADED)
        continue;
      const f = l.getOrigin(c), g = pt(l.getTileSize(c)), _ = l.getResolution(c);
      let R;
      if (d instanceof Mi || d instanceof We)
        R = d.getImage();
      else if (d instanceof ke) {
        if (R = Re(d.getData()), !R)
          continue;
      } else
        continue;
      const E = Math.floor(
        h * ((s[0] - f[0]) / _ - u[1] * g[0])
      ), m = Math.floor(
        h * ((f[1] - s[1]) / _ - u[2] * g[1])
      ), y = Math.round(
        h * a.getGutterForProjection(o.projection)
      );
      return this.getImageData(R, E + y, m + y);
    }
    return null;
  }
  /**
   * Determine whether render should be called.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   * @override
   */
  prepareFrame(t) {
    this.renderedProjection_ ? t.viewState.projection !== this.renderedProjection_ && (this.tileCache_.clear(), this.renderedProjection_ = t.viewState.projection) : this.renderedProjection_ = t.viewState.projection;
    const e = this.getLayer().getSource();
    if (!e)
      return !1;
    const n = e.getRevision();
    return this.renderedRevision_ ? this.renderedRevision_ !== n && (this.renderedRevision_ = n, this.renderedSourceKey_ === e.getKey() && this.tileCache_.clear()) : this.renderedRevision_ = n, !0;
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("../../extent.js").Extent} extent The extent to be rendered.
   * @param {number} initialZ The zoom level.
   * @param {TileLookup} tilesByZ Lookup of tiles by zoom level.
   * @param {number} preload Number of additional levels to load.
   */
  enqueueTiles(t, e, n, s, r) {
    const o = t.viewState, a = this.getLayer(), l = a.getRenderSource(), h = l.getTileGridForProjection(o.projection), c = it(l);
    c in t.wantedTiles || (t.wantedTiles[c] = {});
    const u = t.wantedTiles[c], d = a.getMapInternal(), f = Math.max(
      n - r,
      h.getMinZoom(),
      h.getZForResolution(
        Math.min(
          a.getMaxResolution(),
          d ? d.getView().getResolutionForZoom(Math.max(a.getMinZoom(), 0)) : h.getResolution(0)
        ),
        l.zDirection
      )
    );
    for (let g = n; g >= f; --g) {
      const _ = h.getTileRangeForExtentAndZ(
        e,
        g,
        this.tempTileRange_
      ), R = h.getResolution(g);
      for (let E = _.minX; E <= _.maxX; ++E)
        for (let m = _.minY; m <= _.maxY; ++m) {
          const y = this.getTile(g, E, m, t);
          if (!y || !Ge(s, y, g))
            continue;
          const p = y.getKey();
          if (u[p] = !0, y.getState() === x.IDLE && !t.tileQueue.isKeyQueued(p)) {
            const w = pe(g, E, m, this.tempTileCoord_);
            t.tileQueue.enqueue([
              y,
              c,
              h.getTileCoordCenter(w),
              R
            ]);
          }
        }
    }
  }
  /**
   * Look for tiles covering the provided tile coordinate at an alternate
   * zoom level.  Loaded tiles will be added to the provided tile texture lookup.
   * @param {import("../../tilecoord.js").TileCoord} tileCoord The target tile coordinate.
   * @param {TileLookup} tilesByZ Lookup of tiles by zoom level.
   * @return {boolean} The tile coordinate is covered by loaded tiles at the alternate zoom level.
   * @private
   */
  findStaleTile_(t, e) {
    const n = this.tileCache_, s = t[0], r = t[1], o = t[2], a = this.getStaleKeys();
    for (let l = 0; l < a.length; ++l) {
      const h = De(a[l], s, r, o);
      if (n.containsKey(h)) {
        const c = n.get(h);
        if (c.getState() === x.LOADED)
          return c.endTransition(it(this)), Ge(e, c, s), !0;
      }
    }
    return !1;
  }
  /**
   * Look for tiles covering the provided tile coordinate at an alternate
   * zoom level.  Loaded tiles will be added to the provided tile texture lookup.
   * @param {import("../../tilegrid/TileGrid.js").default} tileGrid The tile grid.
   * @param {import("../../tilecoord.js").TileCoord} tileCoord The target tile coordinate.
   * @param {number} altZ The alternate zoom level.
   * @param {TileLookup} tilesByZ Lookup of tiles by zoom level.
   * @return {boolean} The tile coordinate is covered by loaded tiles at the alternate zoom level.
   * @private
   */
  findAltTiles_(t, e, n, s) {
    const r = t.getTileRangeForTileCoordAndZ(
      e,
      n,
      this.tempTileRange_
    );
    if (!r)
      return !1;
    let o = !0;
    const a = this.tileCache_, h = this.getLayer().getRenderSource().getKey();
    for (let c = r.minX; c <= r.maxX; ++c)
      for (let u = r.minY; u <= r.maxY; ++u) {
        const d = De(h, n, c, u);
        let f = !1;
        if (a.containsKey(d)) {
          const g = a.get(d);
          g.getState() === x.LOADED && (Ge(s, g, n), f = !0);
        }
        f || (o = !1);
      }
    return o;
  }
  /**
   * Render the layer.
   *
   * The frame rendering logic has three parts:
   *
   *  1. Enqueue tiles
   *  2. Find alt tiles for those that are not yet loaded
   *  3. Render loaded tiles
   *
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   * @override
   */
  renderFrame(t, e) {
    this.renderComplete = !0;
    const n = t.layerStatesArray[t.layerIndex], s = t.viewState, r = s.projection, o = s.resolution, a = s.center, l = t.pixelRatio, h = this.getLayer(), c = h.getSource(), u = c.getRevision(), d = c.getTileGridForProjection(r), f = d.getZForResolution(o, c.zDirection), g = d.getResolution(f), _ = c.getKey();
    this.renderedSourceKey_ ? this.renderedSourceKey_ !== _ && (this.prependStaleKey(this.renderedSourceKey_), this.renderedSourceKey_ = _) : this.renderedSourceKey_ = _;
    let R = t.extent;
    const E = c.getTilePixelRatio(l);
    this.prepareContainer(t, e);
    const m = this.context.canvas.width, y = this.context.canvas.height, T = n.extent && ht(n.extent);
    T && (R = Q(
      R,
      ht(n.extent)
    ));
    const p = g * m / 2 / E, w = g * y / 2 / E, v = [
      a[0] - p,
      a[1] - w,
      a[0] + p,
      a[1] + w
    ], I = {};
    this.renderedTiles.length = 0;
    const M = h.getPreload();
    if (t.nextExtent) {
      const N = d.getZForResolution(
        s.nextResolution,
        c.zDirection
      ), j = Hn(t, t.nextExtent);
      this.enqueueTiles(t, j, N, I, M);
    }
    const D = Hn(t, R);
    if (this.enqueueTiles(t, D, f, I, 0), M > 0 && setTimeout(() => {
      this.enqueueTiles(
        t,
        D,
        f - 1,
        I,
        M - 1
      );
    }, 0), !(f in I))
      return this.container;
    const L = it(this), b = t.time;
    for (const N of I[f]) {
      const j = N.getState();
      if ((N instanceof We || N instanceof zr) && j === x.EMPTY)
        continue;
      const k = N.tileCoord;
      if (j === x.LOADED && N.getAlpha(L, b) === 1) {
        N.endTransition(L);
        continue;
      }
      if (this.renderComplete = !1, this.findStaleTile_(k, I)) {
        Kr(I, N, f), t.animate = !0;
        continue;
      }
      if (this.findAltTiles_(
        d,
        k,
        f + 1,
        I
      ))
        continue;
      const rt = d.getMinZoom();
      for (let q = f - 1; q >= rt && !this.findAltTiles_(
        d,
        k,
        q,
        I
      ); --q)
        ;
    }
    const F = g / o * l / E, C = this.getRenderContext(t);
    Vt(
      this.tempTransform,
      m / 2,
      y / 2,
      F,
      F,
      0,
      -m / 2,
      -y / 2
    ), n.extent && this.clipUnrotated(C, t, T), c.getInterpolate() || (C.imageSmoothingEnabled = !1), this.preRender(C, t);
    const G = Object.keys(I).map(Number);
    G.sort(Ve);
    let A;
    const V = [], J = [];
    for (let N = G.length - 1; N >= 0; --N) {
      const j = G[N], k = c.getTilePixelSize(
        j,
        l,
        r
      ), It = d.getResolution(j) / g, rt = k[0] * It * F, q = k[1] * It * F, H = d.getTileCoordForCoordAndZ(
        At(v),
        j
      ), gt = d.getTileCoordExtent(H), Ct = nt(this.tempTransform, [
        E * (gt[0] - v[0]) / g,
        E * (v[3] - gt[3]) / g
      ]), lt = E * c.getGutterForProjection(r);
      for (const Yt of I[j]) {
        if (Yt.getState() !== x.LOADED)
          continue;
        const mn = Yt.tileCoord, Rn = H[1] - mn[1], Ni = Math.round(Ct[0] - (Rn - 1) * rt), En = H[2] - mn[2], ji = Math.round(Ct[1] - (En - 1) * q), ft = Math.round(Ct[0] - Rn * rt), _t = Math.round(Ct[1] - En * q), ee = Ni - ft, ne = ji - _t, pn = G.length === 1;
        let Me = !1;
        A = [ft, _t, ft + ee, _t, ft + ee, _t + ne, ft, _t + ne];
        for (let ie = 0, Xi = V.length; ie < Xi; ++ie)
          if (!pn && j < J[ie]) {
            const $ = V[ie];
            Zt(
              [ft, _t, ft + ee, _t + ne],
              [$[0], $[3], $[4], $[7]]
            ) && (Me || (C.save(), Me = !0), C.beginPath(), C.moveTo(A[0], A[1]), C.lineTo(A[2], A[3]), C.lineTo(A[4], A[5]), C.lineTo(A[6], A[7]), C.moveTo($[6], $[7]), C.lineTo($[4], $[5]), C.lineTo($[2], $[3]), C.lineTo($[0], $[1]), C.clip());
          }
        V.push(A), J.push(j), this.drawTile(Yt, t, ft, _t, ee, ne, lt, pn), Me && C.restore(), this.renderedTiles.unshift(Yt), this.updateUsedTiles(t.usedTiles, c, Yt);
      }
    }
    this.renderedRevision = u, this.renderedResolution = g, this.extentChanged = !this.renderedExtent_ || !si(this.renderedExtent_, v), this.renderedExtent_ = v, this.renderedPixelRatio = l, this.renderedProjection = r, this.postRender(this.context, t), n.extent && C.restore(), C.imageSmoothingEnabled = !0;
    const tt = (N, j) => {
      const k = it(c), dt = j.wantedTiles[k], It = dt ? Object.keys(dt).length : 0;
      this.updateCacheSize(It), this.tileCache_.expireCache();
    };
    return t.postRenderFunctions.push(tt), this.container;
  }
  /**
   * Increases the cache size if needed
   * @param {number} tileCount Minimum number of tiles needed.
   */
  updateCacheSize(t) {
    this.tileCache_.highWaterMark = Math.max(
      this.tileCache_.highWaterMark,
      t * 2
    );
  }
  /**
   * @param {import("../../Tile.js").default} tile Tile.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {number} x Left of the tile.
   * @param {number} y Top of the tile.
   * @param {number} w Width of the tile.
   * @param {number} h Height of the tile.
   * @param {number} gutter Tile gutter.
   * @param {boolean} transition Apply an alpha transition.
   * @protected
   */
  drawTile(t, e, n, s, r, o, a, l) {
    let h;
    if (t instanceof ke) {
      if (h = Re(t.getData()), !h)
        throw new Error("Rendering array data is not yet supported");
    } else
      h = this.getTileImage(
        /** @type {import("../../ImageTile.js").default} */
        t
      );
    if (!h)
      return;
    const c = this.getRenderContext(e), u = it(this), d = e.layerStatesArray[e.layerIndex], f = d.opacity * (l ? t.getAlpha(u, e.time) : 1), g = f !== c.globalAlpha;
    g && (c.save(), c.globalAlpha = f), c.drawImage(
      h,
      a,
      a,
      h.width - 2 * a,
      h.height - 2 * a,
      n,
      s,
      r,
      o
    ), g && c.restore(), f !== d.opacity ? e.animate = !0 : l && t.endTransition(u);
  }
  /**
   * @return {HTMLCanvasElement} Image
   */
  getImage() {
    const t = this.context;
    return t ? t.canvas : null;
  }
  /**
   * Get the image from a tile.
   * @param {import("../../ImageTile.js").default} tile Tile.
   * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
   * @protected
   */
  getTileImage(t) {
    return t.getImage();
  }
  /**
   * @param {!Object<string, !Object<string, boolean>>} usedTiles Used tiles.
   * @param {import("../../source/Tile.js").default} tileSource Tile source.
   * @param {import('../../Tile.js').default} tile Tile.
   * @protected
   */
  updateUsedTiles(t, e, n) {
    const s = it(e);
    s in t || (t[s] = {}), t[s][n.getKey()] = !0;
  }
}
class Ne extends Sr {
  /**
   * @param {import("./BaseTile.js").Options<TileSourceType>} [options] Tile layer options.
   */
  constructor(t) {
    super(t);
  }
  /**
   * @override
   */
  createRenderer() {
    return new Vr(this, {
      cacheSize: this.getCacheSize()
    });
  }
}
const je = {
  /**
   * Triggered when a tile starts loading.
   * @event module:ol/source/Tile.TileSourceEvent#tileloadstart
   * @api
   */
  TILELOADSTART: "tileloadstart",
  /**
   * Triggered when a tile finishes loading, either when its data is loaded,
   * or when loading was aborted because the tile is no longer needed.
   * @event module:ol/source/Tile.TileSourceEvent#tileloadend
   * @api
   */
  TILELOADEND: "tileloadend",
  /**
   * Triggered if tile loading results in an error. Note that this is not the
   * right place to re-fetch tiles. See {@link module:ol/ImageTile~ImageTile#load}
   * for details.
   * @event module:ol/source/Tile.TileSourceEvent#tileloaderror
   * @api
   */
  TILELOADERROR: "tileloaderror"
};
class Si extends Te {
  /**
   * @param {Options} options Source options.
   */
  constructor(t) {
    super(), this.projection = K(t.projection), this.attributions_ = qn(t.attributions), this.attributionsCollapsible_ = t.attributionsCollapsible ?? !0, this.loading = !1, this.state_ = t.state !== void 0 ? t.state : "ready", this.wrapX_ = t.wrapX !== void 0 ? t.wrapX : !1, this.interpolate_ = !!t.interpolate, this.viewResolver = null, this.viewRejector = null;
    const e = this;
    this.viewPromise_ = new Promise(function(n, s) {
      e.viewResolver = n, e.viewRejector = s;
    });
  }
  /**
   * Get the attribution function for the source.
   * @return {?Attribution} Attribution function.
   * @api
   */
  getAttributions() {
    return this.attributions_;
  }
  /**
   * @return {boolean} Attributions are collapsible.
   * @api
   */
  getAttributionsCollapsible() {
    return this.attributionsCollapsible_;
  }
  /**
   * Get the projection of the source.
   * @return {import("../proj/Projection.js").default|null} Projection.
   * @api
   */
  getProjection() {
    return this.projection;
  }
  /**
   * @param {import("../proj/Projection").default} [projection] Projection.
   * @return {Array<number>|null} Resolutions.
   */
  getResolutions(t) {
    return null;
  }
  /**
   * @return {Promise<import("../View.js").ViewOptions>} A promise for view-related properties.
   */
  getView() {
    return this.viewPromise_;
  }
  /**
   * Get the state of the source, see {@link import("./Source.js").State} for possible states.
   * @return {import("./Source.js").State} State.
   * @api
   */
  getState() {
    return this.state_;
  }
  /**
   * @return {boolean|undefined} Wrap X.
   */
  getWrapX() {
    return this.wrapX_;
  }
  /**
   * @return {boolean} Use linear interpolation when resampling.
   */
  getInterpolate() {
    return this.interpolate_;
  }
  /**
   * Refreshes the source. The source will be cleared, and data from the server will be reloaded.
   * @api
   */
  refresh() {
    this.changed();
  }
  /**
   * Set the attributions of the source.
   * @param {AttributionLike|undefined} attributions Attributions.
   *     Can be passed as `string`, `Array<string>`, {@link module:ol/source/Source~Attribution},
   *     or `undefined`.
   * @api
   */
  setAttributions(t) {
    this.attributions_ = qn(t), this.changed();
  }
  /**
   * Set the state of the source.
   * @param {import("./Source.js").State} state State.
   */
  setState(t) {
    this.state_ = t, this.changed();
  }
}
function qn(i) {
  return i ? typeof i == "function" ? i : (Array.isArray(i) || (i = [i]), (t) => i) : null;
}
const bt = [0, 0, 0], Rt = 5;
class Ai {
  /**
   * @param {Options} options Tile grid options.
   */
  constructor(t) {
    this.minZoom = t.minZoom !== void 0 ? t.minZoom : 0, this.resolutions_ = t.resolutions, Y(
      ki(
        this.resolutions_,
        /**
         * @param {number} a First resolution
         * @param {number} b Second resolution
         * @return {number} Comparison result
         */
        (s, r) => r - s
      ),
      "`resolutions` must be sorted in descending order"
    );
    let e;
    if (!t.origins) {
      for (let s = 0, r = this.resolutions_.length - 1; s < r; ++s)
        if (!e)
          e = this.resolutions_[s] / this.resolutions_[s + 1];
        else if (this.resolutions_[s] / this.resolutions_[s + 1] !== e) {
          e = void 0;
          break;
        }
    }
    this.zoomFactor_ = e, this.maxZoom = this.resolutions_.length - 1, this.origin_ = t.origin !== void 0 ? t.origin : null, this.origins_ = null, t.origins !== void 0 && (this.origins_ = t.origins, Y(
      this.origins_.length == this.resolutions_.length,
      "Number of `origins` and `resolutions` must be equal"
    ));
    const n = t.extent;
    n !== void 0 && !this.origin_ && !this.origins_ && (this.origin_ = At(n)), Y(
      !this.origin_ && this.origins_ || this.origin_ && !this.origins_,
      "Either `origin` or `origins` must be configured, never both"
    ), this.tileSizes_ = null, t.tileSizes !== void 0 && (this.tileSizes_ = t.tileSizes, Y(
      this.tileSizes_.length == this.resolutions_.length,
      "Number of `tileSizes` and `resolutions` must be equal"
    )), this.tileSize_ = t.tileSize !== void 0 ? t.tileSize : this.tileSizes_ ? null : Be, Y(
      !this.tileSize_ && this.tileSizes_ || this.tileSize_ && !this.tileSizes_,
      "Either `tileSize` or `tileSizes` must be configured, never both"
    ), this.extent_ = n !== void 0 ? n : null, this.fullTileRanges_ = null, this.tmpSize_ = [0, 0], this.tmpExtent_ = [0, 0, 0, 0], t.sizes !== void 0 ? this.fullTileRanges_ = t.sizes.map((s, r) => {
      const o = new gn(
        Math.min(0, s[0]),
        Math.max(s[0] - 1, -1),
        Math.min(0, s[1]),
        Math.max(s[1] - 1, -1)
      );
      if (n) {
        const a = this.getTileRangeForExtentAndZ(n, r);
        o.minX = Math.max(a.minX, o.minX), o.maxX = Math.min(a.maxX, o.maxX), o.minY = Math.max(a.minY, o.minY), o.maxY = Math.min(a.maxY, o.maxY);
      }
      return o;
    }) : n && this.calculateTileRanges_(n);
  }
  /**
   * Call a function with each tile coordinate for a given extent and zoom level.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} zoom Integer zoom level.
   * @param {function(import("../tilecoord.js").TileCoord): void} callback Function called with each tile coordinate.
   * @api
   */
  forEachTileCoord(t, e, n) {
    const s = this.getTileRangeForExtentAndZ(t, e);
    for (let r = s.minX, o = s.maxX; r <= o; ++r)
      for (let a = s.minY, l = s.maxY; a <= l; ++a)
        n([e, r, a]);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {function(number, import("../TileRange.js").default): boolean} callback Callback.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary import("../extent.js").Extent object.
   * @return {boolean} Callback succeeded.
   */
  forEachTileCoordParentTileRange(t, e, n, s) {
    let r, o, a, l = null, h = t[0] - 1;
    for (this.zoomFactor_ === 2 ? (o = t[1], a = t[2]) : l = this.getTileCoordExtent(t, s); h >= this.minZoom; ) {
      if (o !== void 0 && a !== void 0 ? (o = Math.floor(o / 2), a = Math.floor(a / 2), r = Ft(o, o, a, a, n)) : r = this.getTileRangeForExtentAndZ(
        l,
        h,
        n
      ), e(h, r))
        return !0;
      --h;
    }
    return !1;
  }
  /**
   * Get the extent for this tile grid, if it was configured.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent() {
    return this.extent_;
  }
  /**
   * Get the maximum zoom level for the grid.
   * @return {number} Max zoom.
   * @api
   */
  getMaxZoom() {
    return this.maxZoom;
  }
  /**
   * Get the minimum zoom level for the grid.
   * @return {number} Min zoom.
   * @api
   */
  getMinZoom() {
    return this.minZoom;
  }
  /**
   * Get the origin for the grid at the given zoom level.
   * @param {number} z Integer zoom level.
   * @return {import("../coordinate.js").Coordinate} Origin.
   * @api
   */
  getOrigin(t) {
    return this.origin_ ? this.origin_ : this.origins_[t];
  }
  /**
   * Get the resolution for the given zoom level.
   * @param {number} z Integer zoom level.
   * @return {number} Resolution.
   * @api
   */
  getResolution(t) {
    return this.resolutions_[t];
  }
  /**
   * Get the list of resolutions for the tile grid.
   * @return {Array<number>} Resolutions.
   * @api
   */
  getResolutions() {
    return this.resolutions_;
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary import("../extent.js").Extent object.
   * @return {import("../TileRange.js").default|null} Tile range.
   */
  getTileCoordChildTileRange(t, e, n) {
    if (t[0] < this.maxZoom) {
      if (this.zoomFactor_ === 2) {
        const r = t[1] * 2, o = t[2] * 2;
        return Ft(
          r,
          r + 1,
          o,
          o + 1,
          e
        );
      }
      const s = this.getTileCoordExtent(
        t,
        n || this.tmpExtent_
      );
      return this.getTileRangeForExtentAndZ(
        s,
        t[0] + 1,
        e
      );
    }
    return null;
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {number} z Integer zoom level.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @return {import("../TileRange.js").default|null} Tile range.
   */
  getTileRangeForTileCoordAndZ(t, e, n) {
    if (e > this.maxZoom || e < this.minZoom)
      return null;
    const s = t[0], r = t[1], o = t[2];
    if (e === s)
      return Ft(
        r,
        o,
        r,
        o,
        n
      );
    if (this.zoomFactor_) {
      const l = Math.pow(this.zoomFactor_, e - s), h = Math.floor(r * l), c = Math.floor(o * l);
      if (e < s)
        return Ft(h, h, c, c, n);
      const u = Math.floor(l * (r + 1)) - 1, d = Math.floor(l * (o + 1)) - 1;
      return Ft(h, u, c, d, n);
    }
    const a = this.getTileCoordExtent(t, this.tmpExtent_);
    return this.getTileRangeForExtentAndZ(a, e, n);
  }
  /**
   * Get a tile range for the given extent and integer zoom level.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} z Integer zoom level.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary tile range object.
   * @return {import("../TileRange.js").default} Tile range.
   */
  getTileRangeForExtentAndZ(t, e, n) {
    this.getTileCoordForXYAndZ_(t[0], t[3], e, !1, bt);
    const s = bt[1], r = bt[2];
    this.getTileCoordForXYAndZ_(t[2], t[1], e, !0, bt);
    const o = bt[1], a = bt[2];
    return Ft(s, o, r, a, n);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {import("../coordinate.js").Coordinate} Tile center.
   */
  getTileCoordCenter(t) {
    const e = this.getOrigin(t[0]), n = this.getResolution(t[0]), s = pt(this.getTileSize(t[0]), this.tmpSize_);
    return [
      e[0] + (t[1] + 0.5) * s[0] * n,
      e[1] - (t[2] + 0.5) * s[1] * n
    ];
  }
  /**
   * Get the extent of a tile coordinate.
   *
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary extent object.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getTileCoordExtent(t, e) {
    const n = this.getOrigin(t[0]), s = this.getResolution(t[0]), r = pt(this.getTileSize(t[0]), this.tmpSize_), o = n[0] + t[1] * r[0] * s, a = n[1] - (t[2] + 1) * r[1] * s, l = o + r[0] * s, h = a + r[1] * s;
    return Jt(o, a, l, h, e);
  }
  /**
   * Get the tile coordinate for the given map coordinate and resolution.  This
   * method considers that coordinates that intersect tile boundaries should be
   * assigned the higher tile coordinate.
   *
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @api
   */
  getTileCoordForCoordAndResolution(t, e, n) {
    return this.getTileCoordForXYAndResolution_(
      t[0],
      t[1],
      e,
      !1,
      n
    );
  }
  /**
   * Note that this method should not be called for resolutions that correspond
   * to an integer zoom level.  Instead call the `getTileCoordForXYAndZ_` method.
   * @param {number} x X.
   * @param {number} y Y.
   * @param {number} resolution Resolution (for a non-integer zoom level).
   * @param {boolean} reverseIntersectionPolicy Instead of letting edge
   *     intersections go to the higher tile coordinate, let edge intersections
   *     go to the lower tile coordinate.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @private
   */
  getTileCoordForXYAndResolution_(t, e, n, s, r) {
    const o = this.getZForResolution(n), a = n / this.getResolution(o), l = this.getOrigin(o), h = pt(this.getTileSize(o), this.tmpSize_);
    let c = a * (t - l[0]) / n / h[0], u = a * (l[1] - e) / n / h[1];
    return s ? (c = Et(c, Rt) - 1, u = Et(u, Rt) - 1) : (c = Gt(c, Rt), u = Gt(u, Rt)), pe(o, c, u, r);
  }
  /**
   * Although there is repetition between this method and `getTileCoordForXYAndResolution_`,
   * they should have separate implementations.  This method is for integer zoom
   * levels.  The other method should only be called for resolutions corresponding
   * to non-integer zoom levels.
   * @param {number} x Map x coordinate.
   * @param {number} y Map y coordinate.
   * @param {number} z Integer zoom level.
   * @param {boolean} reverseIntersectionPolicy Instead of letting edge
   *     intersections go to the higher tile coordinate, let edge intersections
   *     go to the lower tile coordinate.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @private
   */
  getTileCoordForXYAndZ_(t, e, n, s, r) {
    const o = this.getOrigin(n), a = this.getResolution(n), l = pt(this.getTileSize(n), this.tmpSize_);
    let h = (t - o[0]) / a / l[0], c = (o[1] - e) / a / l[1];
    return s ? (h = Et(h, Rt) - 1, c = Et(c, Rt) - 1) : (h = Gt(h, Rt), c = Gt(c, Rt)), pe(n, h, c, r);
  }
  /**
   * Get a tile coordinate given a map coordinate and zoom level.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} z Integer zoom level, e.g. the result of a `getZForResolution()` method call
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @api
   */
  getTileCoordForCoordAndZ(t, e, n) {
    return this.getTileCoordForXYAndZ_(
      t[0],
      t[1],
      e,
      !1,
      n
    );
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {number} Tile resolution.
   */
  getTileCoordResolution(t) {
    return this.resolutions_[t[0]];
  }
  /**
   * Get the tile size for a zoom level. The type of the return value matches the
   * `tileSize` or `tileSizes` that the tile grid was configured with. To always
   * get an {@link import("../size.js").Size}, run the result through {@link module:ol/size.toSize}.
   * @param {number} z Z.
   * @return {number|import("../size.js").Size} Tile size.
   * @api
   */
  getTileSize(t) {
    return this.tileSize_ ? this.tileSize_ : this.tileSizes_[t];
  }
  /**
   * @param {number} z Zoom level.
   * @return {import("../TileRange.js").default|null} Extent tile range for the specified zoom level.
   */
  getFullTileRange(t) {
    return this.fullTileRanges_ ? this.fullTileRanges_[t] : this.extent_ ? this.getTileRangeForExtentAndZ(this.extent_, t) : null;
  }
  /**
   * @param {number} resolution Resolution.
   * @param {number|import("../array.js").NearestDirectionFunction} [opt_direction]
   *     If 0, the nearest resolution will be used.
   *     If 1, the nearest higher resolution (lower Z) will be used. If -1, the
   *     nearest lower resolution (higher Z) will be used. Default is 0.
   *     Use a {@link module:ol/array~NearestDirectionFunction} for more precise control.
   *
   * For example to change tile Z at the midpoint of zoom levels
   * ```js
   * function(value, high, low) {
   *   return value - low * Math.sqrt(high / low);
   * }
   * ```
   * @return {number} Z.
   * @api
   */
  getZForResolution(t, e) {
    const n = ye(
      this.resolutions_,
      t,
      e || 0
    );
    return z(n, this.minZoom, this.maxZoom);
  }
  /**
   * The tile with the provided tile coordinate intersects the given viewport.
   * @param {import('../tilecoord.js').TileCoord} tileCoord Tile coordinate.
   * @param {Array<number>} viewport Viewport as returned from {@link module:ol/extent.getRotatedViewport}.
   * @return {boolean} The tile with the provided tile coordinate intersects the given viewport.
   */
  tileCoordIntersectsViewport(t, e) {
    return pi(
      e,
      0,
      e.length,
      2,
      this.getTileCoordExtent(t)
    );
  }
  /**
   * @param {!import("../extent.js").Extent} extent Extent for this tile grid.
   * @private
   */
  calculateTileRanges_(t) {
    const e = this.resolutions_.length, n = new Array(e);
    for (let s = this.minZoom; s < e; ++s)
      n[s] = this.getTileRangeForExtentAndZ(t, s);
    this.fullTileRanges_ = n;
  }
}
function Pi(i) {
  let t = i.getDefaultTileGrid();
  return t || (t = $r(i), i.setDefaultTileGrid(t)), t;
}
function Hr(i, t, e) {
  const n = t[0], s = i.getTileCoordCenter(t), r = fn(e);
  if (!xe(r, s)) {
    const o = P(r), a = Math.ceil(
      (r[0] - s[0]) / o
    );
    return s[0] += o * a, i.getTileCoordForCoordAndZ(s, n);
  }
  return t;
}
function qr(i, t, e, n) {
  n = n !== void 0 ? n : "top-left";
  const s = Oi(i, t, e);
  return new Ai({
    extent: i,
    origin: fs(i, n),
    resolutions: s,
    tileSize: e
  });
}
function Br(i) {
  const t = i || {}, e = t.extent || K("EPSG:3857").getExtent(), n = {
    extent: e,
    minZoom: t.minZoom,
    tileSize: t.tileSize,
    resolutions: Oi(
      e,
      t.maxZoom,
      t.tileSize,
      t.maxResolution
    )
  };
  return new Ai(n);
}
function Oi(i, t, e, n) {
  t = t !== void 0 ? t : ts, e = pt(e !== void 0 ? e : Be);
  const s = U(i), r = P(i);
  n = n > 0 ? n : Math.max(r / e[0], s / e[1]);
  const o = t + 1, a = new Array(o);
  for (let l = 0; l < o; ++l)
    a[l] = n / Math.pow(2, l);
  return a;
}
function $r(i, t, e, n) {
  const s = fn(i);
  return qr(s, t, e, n);
}
function fn(i) {
  i = K(i);
  let t = i.getExtent();
  if (!t) {
    const e = 180 * $e.degrees / i.getMetersPerUnit();
    t = Jt(-e, -e, e, e);
  }
  return t;
}
class Qr extends Si {
  /**
   * @param {Options} options SourceTile source options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      attributionsCollapsible: t.attributionsCollapsible,
      projection: t.projection,
      state: t.state,
      wrapX: t.wrapX,
      interpolate: t.interpolate
    }), this.on, this.once, this.un, this.tilePixelRatio_ = t.tilePixelRatio !== void 0 ? t.tilePixelRatio : 1, this.tileGrid = t.tileGrid !== void 0 ? t.tileGrid : null;
    const e = [256, 256];
    this.tileGrid && pt(this.tileGrid.getTileSize(this.tileGrid.getMinZoom()), e), this.tmpSize = [0, 0], this.key_ = t.key || it(this), this.tileOptions = {
      transition: t.transition,
      interpolate: t.interpolate
    }, this.zDirection = t.zDirection ? t.zDirection : 0;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {number} Gutter.
   */
  getGutterForProjection(t) {
    return 0;
  }
  /**
   * Return the key to be used for all tiles in the source.
   * @return {string} The key for all tiles.
   */
  getKey() {
    return this.key_;
  }
  /**
   * Set the value to be used as the key for all tiles in the source.
   * @param {string} key The key for tiles.
   * @protected
   */
  setKey(t) {
    this.key_ !== t && (this.key_ = t, this.changed());
  }
  /**
   * @param {import("../proj/Projection").default} [projection] Projection.
   * @return {Array<number>|null} Resolutions.
   * @override
   */
  getResolutions(t) {
    const e = t ? this.getTileGridForProjection(t) : this.tileGrid;
    return e ? e.getResolutions() : null;
  }
  /**
   * @abstract
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {TileType|null} Tile.
   */
  getTile(t, e, n, s, r) {
    return X();
  }
  /**
   * Return the tile grid of the tile source.
   * @return {import("../tilegrid/TileGrid.js").default|null} Tile grid.
   * @api
   */
  getTileGrid() {
    return this.tileGrid;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
   */
  getTileGridForProjection(t) {
    return this.tileGrid ? this.tileGrid : Pi(t);
  }
  /**
   * Get the tile pixel ratio for this source. Subclasses may override this
   * method, which is meant to return a supported pixel ratio that matches the
   * provided `pixelRatio` as close as possible.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Tile pixel ratio.
   */
  getTilePixelRatio(t) {
    return this.tilePixelRatio_;
  }
  /**
   * @param {number} z Z.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../size.js").Size} Tile size.
   */
  getTilePixelSize(t, e, n) {
    const s = this.getTileGridForProjection(n), r = this.getTilePixelRatio(e), o = pt(s.getTileSize(t), this.tmpSize);
    return r == 1 ? o : Wr(o, r, this.tmpSize);
  }
  /**
   * Returns a tile coordinate wrapped around the x-axis. When the tile coordinate
   * is outside the resolution and extent range of the tile grid, `null` will be
   * returned.
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../proj/Projection.js").default} [projection] Projection.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate to be passed to the tileUrlFunction or
   *     null if no tile URL should be created for the passed `tileCoord`.
   */
  getTileCoordForTileUrlFunction(t, e) {
    e = e !== void 0 ? e : this.getProjection();
    const n = this.getTileGridForProjection(e);
    return this.getWrapX() && e.isGlobal() && (t = Hr(n, t, e)), kr(t, n) ? t : null;
  }
  /**
   * Remove all cached reprojected tiles from the source. The next render cycle will create new tiles.
   * @api
   */
  clear() {
  }
  /**
   * @override
   */
  refresh() {
    this.clear(), super.refresh();
  }
}
class Jr extends Bt {
  /**
   * @param {string} type Type.
   * @param {import("../Tile.js").default} tile The tile.
   */
  constructor(t, e) {
    super(t), this.tile = e;
  }
}
function Li(i, t) {
  const e = [];
  Object.keys(t).forEach(function(s) {
    t[s] !== null && t[s] !== void 0 && e.push(s + "=" + encodeURIComponent(t[s]));
  });
  const n = e.join("&");
  return i = i.replace(/[?&]$/, ""), i += i.includes("?") ? "&" : "?", i + n;
}
const to = /\{z\}/g, eo = /\{x\}/g, no = /\{y\}/g, io = /\{-y\}/g;
function so(i, t, e, n, s) {
  return i.replace(to, t.toString()).replace(eo, e.toString()).replace(no, n.toString()).replace(io, function() {
    if (s === void 0)
      throw new Error(
        "If the URL template has a {-y} placeholder, the grid extent must be known"
      );
    return (s - n).toString();
  });
}
function ro(i) {
  const t = [];
  let e = /\{([a-z])-([a-z])\}/.exec(i);
  if (e) {
    const n = e[1].charCodeAt(0), s = e[2].charCodeAt(0);
    let r;
    for (r = n; r <= s; ++r)
      t.push(i.replace(e[0], String.fromCharCode(r)));
    return t;
  }
  if (e = /\{(\d+)-(\d+)\}/.exec(i), e) {
    const n = parseInt(e[2], 10);
    for (let s = parseInt(e[1], 10); s <= n; s++)
      t.push(i.replace(e[0], s.toString()));
    return t;
  }
  return t.push(i), t;
}
function oo(i, t) {
  return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    function(e, n, s) {
      if (!e)
        return;
      let r;
      const o = e[0];
      if (t) {
        const a = t.getFullTileRange(o);
        a && (r = a.getHeight() - 1);
      }
      return so(i, o, e[1], e[2], r);
    }
  );
}
function ao(i, t) {
  const e = i.length, n = new Array(e);
  for (let s = 0; s < e; ++s)
    n[s] = oo(i[s], t);
  return lo(n);
}
function lo(i) {
  return i.length === 1 ? i[0] : (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    function(t, e, n) {
      if (!t)
        return;
      const s = Yr(t), r = Xt(s, i.length);
      return i[r](t, e, n);
    }
  );
}
class _n extends Qr {
  /**
   * @param {Options} options Image tile options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      projection: t.projection,
      state: t.state,
      tileGrid: t.tileGrid,
      tilePixelRatio: t.tilePixelRatio,
      wrapX: t.wrapX,
      transition: t.transition,
      interpolate: t.interpolate,
      key: t.key,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection
    }), this.generateTileUrlFunction_ = this.tileUrlFunction === _n.prototype.tileUrlFunction, this.tileLoadFunction = t.tileLoadFunction, t.tileUrlFunction && (this.tileUrlFunction = t.tileUrlFunction), this.urls = null, t.urls ? this.setUrls(t.urls) : t.url && this.setUrl(t.url), this.tileLoadingKeys_ = {};
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Return the tile load function of the source.
   * @return {import("../Tile.js").LoadFunction} TileLoadFunction
   * @api
   */
  getTileLoadFunction() {
    return this.tileLoadFunction;
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Return the tile URL function of the source.
   * @return {import("../Tile.js").UrlFunction} TileUrlFunction
   * @api
   */
  getTileUrlFunction() {
    return Object.getPrototypeOf(this).tileUrlFunction === this.tileUrlFunction ? this.tileUrlFunction.bind(this) : this.tileUrlFunction;
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Return the URLs used for this source.
   * When a tileUrlFunction is used instead of url or urls,
   * null will be returned.
   * @return {!Array<string>|null} URLs.
   * @api
   */
  getUrls() {
    return this.urls;
  }
  /**
   * Handle tile change events.
   * @param {import("../events/Event.js").default} event Event.
   * @protected
   */
  handleTileChange(t) {
    const e = (
      /** @type {import("../Tile.js").default} */
      t.target
    ), n = it(e), s = e.getState();
    let r;
    s == x.LOADING ? (this.tileLoadingKeys_[n] = !0, r = je.TILELOADSTART) : n in this.tileLoadingKeys_ && (delete this.tileLoadingKeys_[n], r = s == x.ERROR ? je.TILELOADERROR : s == x.LOADED ? je.TILELOADEND : void 0), r != null && this.dispatchEvent(new Jr(r, e));
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Set the tile load function of the source.
   * @param {import("../Tile.js").LoadFunction} tileLoadFunction Tile load function.
   * @api
   */
  setTileLoadFunction(t) {
    this.tileLoadFunction = t, this.changed();
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Set the tile URL function of the source.
   * @param {import("../Tile.js").UrlFunction} tileUrlFunction Tile URL function.
   * @param {string} [key] Optional new tile key for the source.
   * @api
   */
  setTileUrlFunction(t, e) {
    this.tileUrlFunction = t, typeof e < "u" ? this.setKey(e) : this.changed();
  }
  /**
   * Set the URL to use for requests.
   * @param {string} url URL.
   * @api
   */
  setUrl(t) {
    const e = ro(t);
    this.urls = e, this.setUrls(e);
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Set the URLs to use for requests.
   * @param {Array<string>} urls URLs.
   * @api
   */
  setUrls(t) {
    this.urls = t;
    const e = t.join(`
`);
    this.generateTileUrlFunction_ ? this.setTileUrlFunction(ao(t, this.tileGrid), e) : this.setKey(e);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {string|undefined} Tile URL.
   */
  tileUrlFunction(t, e, n) {
  }
}
class ho extends _n {
  /**
   * @param {!Options} options Image tile options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      projection: t.projection,
      state: t.state,
      tileGrid: t.tileGrid,
      tileLoadFunction: t.tileLoadFunction ? t.tileLoadFunction : co,
      tilePixelRatio: t.tilePixelRatio,
      tileUrlFunction: t.tileUrlFunction,
      url: t.url,
      urls: t.urls,
      wrapX: t.wrapX,
      transition: t.transition,
      interpolate: t.interpolate !== void 0 ? t.interpolate : !0,
      key: t.key,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection
    }), this.crossOrigin = t.crossOrigin !== void 0 ? t.crossOrigin : null, this.tileClass = t.tileClass !== void 0 ? t.tileClass : Mi, this.tileGridForProjection = {}, this.reprojectionErrorThreshold_ = t.reprojectionErrorThreshold, this.renderReprojectionEdges_ = !1;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {number} Gutter.
   * @override
   */
  getGutterForProjection(t) {
    return this.getProjection() && t && !Wt(this.getProjection(), t) ? 0 : this.getGutter();
  }
  /**
   * @return {number} Gutter.
   */
  getGutter() {
    return 0;
  }
  /**
   * Return the key to be used for all tiles in the source.
   * @return {string} The key for all tiles.
   * @override
   */
  getKey() {
    let t = super.getKey();
    return this.getInterpolate() || (t += ":disable-interpolation"), t;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
   * @override
   */
  getTileGridForProjection(t) {
    const e = this.getProjection();
    if (this.tileGrid && (!e || Wt(e, t)))
      return this.tileGrid;
    const n = it(t);
    return n in this.tileGridForProjection || (this.tileGridForProjection[n] = Pi(t)), this.tileGridForProjection[n];
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {string} key The key set on the tile.
   * @return {!ImageTile} Tile.
   * @private
   */
  createTile_(t, e, n, s, r, o) {
    const a = [t, e, n], l = this.getTileCoordForTileUrlFunction(
      a,
      r
    ), h = l ? this.tileUrlFunction(l, s, r) : void 0, c = new this.tileClass(
      a,
      h !== void 0 ? x.IDLE : x.EMPTY,
      h !== void 0 ? h : "",
      this.crossOrigin,
      this.tileLoadFunction,
      this.tileOptions
    );
    return c.key = o, c.addEventListener(B.CHANGE, this.handleTileChange.bind(this)), c;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!(ImageTile|ReprojTile)} Tile.
   * @override
   */
  getTile(t, e, n, s, r) {
    const o = this.getProjection();
    if (!o || !r || Wt(o, r))
      return this.getTileInternal(
        t,
        e,
        n,
        s,
        o || r
      );
    const a = [t, e, n], l = this.getKey(), h = this.getTileGridForProjection(o), c = this.getTileGridForProjection(r), u = this.getTileCoordForTileUrlFunction(
      a,
      r
    ), d = new We(
      o,
      h,
      r,
      c,
      a,
      u,
      this.getTilePixelRatio(s),
      this.getGutter(),
      (f, g, _, R) => this.getTileInternal(f, g, _, R, o),
      this.reprojectionErrorThreshold_,
      this.renderReprojectionEdges_,
      this.tileOptions
    );
    return d.key = l, d;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {!import("../proj/Projection.js").default} projection Projection.
   * @return {!ImageTile} Tile.
   * @protected
   */
  getTileInternal(t, e, n, s, r) {
    const o = this.getKey();
    return this.createTile_(t, e, n, s, r, o);
  }
  /**
   * Sets whether to render reprojection edges or not (usually for debugging).
   * @param {boolean} render Render the edges.
   * @api
   */
  setRenderReprojectionEdges(t) {
    this.renderReprojectionEdges_ != t && (this.renderReprojectionEdges_ = t, this.changed());
  }
  /**
   * Sets the tile grid to use when reprojecting the tiles to the given
   * projection instead of the default tile grid for the projection.
   *
   * This can be useful when the default tile grid cannot be created
   * (e.g. projection has no extent defined) or
   * for optimization reasons (custom tile size, resolutions, ...).
   *
   * @param {import("../proj.js").ProjectionLike} projection Projection.
   * @param {import("../tilegrid/TileGrid.js").default} tilegrid Tile grid to use for the projection.
   * @api
   */
  setTileGridForProjection(t, e) {
    const n = K(t);
    if (n) {
      const s = it(n);
      s in this.tileGridForProjection || (this.tileGridForProjection[s] = e);
    }
  }
}
function co(i, t) {
  i.getImage().src = t;
}
class Xe extends ho {
  /**
   * @param {Options} [options] XYZ options.
   */
  constructor(t) {
    t = t || {};
    const e = t.projection !== void 0 ? t.projection : "EPSG:3857", n = t.tileGrid !== void 0 ? t.tileGrid : Br({
      extent: fn(e),
      maxResolution: t.maxResolution,
      maxZoom: t.maxZoom,
      minZoom: t.minZoom,
      tileSize: t.tileSize
    });
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      crossOrigin: t.crossOrigin,
      interpolate: t.interpolate,
      projection: e,
      reprojectionErrorThreshold: t.reprojectionErrorThreshold,
      tileGrid: n,
      tileLoadFunction: t.tileLoadFunction,
      tilePixelRatio: t.tilePixelRatio,
      tileUrlFunction: t.tileUrlFunction,
      url: t.url,
      urls: t.urls,
      wrapX: t.wrapX !== void 0 ? t.wrapX : !0,
      transition: t.transition,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection
    }), this.gutter_ = t.gutter !== void 0 ? t.gutter : 0;
  }
  /**
   * @return {number} Gutter.
   * @override
   */
  getGutter() {
    return this.gutter_;
  }
}
function Ke(i) {
  return Array.isArray(i) ? Math.min(...i) : i;
}
class uo extends Ci {
  /**
   * @param {import("../proj/Projection.js").default} sourceProj Source projection (of the data).
   * @param {import("../proj/Projection.js").default} targetProj Target projection.
   * @param {import("../extent.js").Extent} targetExtent Target extent.
   * @param {number} targetResolution Target resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {FunctionType} getImageFunction
   *     Function returning source images (extent, resolution, pixelRatio).
   * @param {boolean} interpolate Use linear interpolation when resampling.
   */
  constructor(t, e, n, s, r, o, a) {
    let l = t.getExtent();
    l && t.canWrapX() && (l = l.slice(), l[0] = -1 / 0, l[2] = 1 / 0);
    let h = e.getExtent();
    h && e.canWrapX() && (h = h.slice(), h[0] = -1 / 0, h[2] = 1 / 0);
    const c = h ? Q(n, h) : n, u = Tt(c), d = Ee(
      t,
      e,
      u,
      s
    ), f = cn, g = new un(
      t,
      e,
      c,
      l,
      d * f,
      s
    ), _ = g.calculateSourceExtent(), R = te(_) ? null : o(_, d, r), E = R ? O.IDLE : O.EMPTY, m = R ? R.getPixelRatio() : 1;
    super(n, s, m, E), this.targetProj_ = e, this.maxSourceExtent_ = l, this.triangulation_ = g, this.targetResolution_ = s, this.targetExtent_ = n, this.sourceImage_ = R, this.sourcePixelRatio_ = m, this.interpolate_ = a, this.canvas_ = null, this.sourceListenerKey_ = null;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.state == O.LOADING && this.unlistenSource_(), super.disposeInternal();
  }
  /**
   * @return {HTMLCanvasElement} Image.
   * @override
   */
  getImage() {
    return this.canvas_;
  }
  /**
   * @return {import("../proj/Projection.js").default} Projection.
   */
  getProjection() {
    return this.targetProj_;
  }
  /**
   * @private
   */
  reproject_() {
    const t = this.sourceImage_.getState();
    if (t == O.LOADED) {
      const e = P(this.targetExtent_) / this.targetResolution_, n = U(this.targetExtent_) / this.targetResolution_;
      this.canvas_ = dn(
        e,
        n,
        this.sourcePixelRatio_,
        Ke(this.sourceImage_.getResolution()),
        this.maxSourceExtent_,
        this.targetResolution_,
        this.targetExtent_,
        this.triangulation_,
        [
          {
            extent: this.sourceImage_.getExtent(),
            image: this.sourceImage_.getImage()
          }
        ],
        0,
        void 0,
        this.interpolate_,
        !0
      );
    }
    this.state = t, this.changed();
  }
  /**
   * Load not yet loaded URI.
   * @override
   */
  load() {
    if (this.state == O.IDLE) {
      this.state = O.LOADING, this.changed();
      const t = this.sourceImage_.getState();
      t == O.LOADED || t == O.ERROR ? this.reproject_() : (this.sourceListenerKey_ = ct(
        this.sourceImage_,
        B.CHANGE,
        (e) => {
          const n = this.sourceImage_.getState();
          (n == O.LOADED || n == O.ERROR) && (this.unlistenSource_(), this.reproject_());
        }
      ), this.sourceImage_.load());
    }
  }
  /**
   * @private
   */
  unlistenSource_() {
    st(
      /** @type {!import("../events.js").EventsKey} */
      this.sourceListenerKey_
    ), this.sourceListenerKey_ = null;
  }
}
const yt = 4, ze = {
  /**
   * Triggered when an image starts loading.
   * @event module:ol/source/Image.ImageSourceEvent#imageloadstart
   * @api
   */
  IMAGELOADSTART: "imageloadstart",
  /**
   * Triggered when an image finishes loading.
   * @event module:ol/source/Image.ImageSourceEvent#imageloadend
   * @api
   */
  IMAGELOADEND: "imageloadend",
  /**
   * Triggered if image loading results in an error.
   * @event module:ol/source/Image.ImageSourceEvent#imageloaderror
   * @api
   */
  IMAGELOADERROR: "imageloaderror"
};
class go extends Bt {
  /**
   * @param {string} type Type.
   * @param {import("../Image.js").default} image The image.
   */
  constructor(t, e) {
    super(t), this.image = e;
  }
}
class fo extends Si {
  /**
   * @param {Options} options Single image source options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      projection: t.projection,
      state: t.state,
      interpolate: t.interpolate !== void 0 ? t.interpolate : !0
    }), this.on, this.once, this.un, this.loader = t.loader || null, this.resolutions_ = t.resolutions !== void 0 ? t.resolutions : null, this.reprojectedImage_ = null, this.reprojectedRevision_ = 0, this.image = null, this.wantedExtent_, this.wantedResolution_, this.static_ = t.loader ? t.loader.length === 0 : !1, this.wantedProjection_ = null;
  }
  /**
   * @return {Array<number>|null} Resolutions.
   * @override
   */
  getResolutions() {
    return this.resolutions_;
  }
  /**
   * @param {Array<number>|null} resolutions Resolutions.
   */
  setResolutions(t) {
    this.resolutions_ = t;
  }
  /**
   * @protected
   * @param {number} resolution Resolution.
   * @return {number} Resolution.
   */
  findNearestResolution(t) {
    const e = this.getResolutions();
    if (e) {
      const n = ye(e, t, 0);
      t = e[n];
    }
    return t;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../Image.js").default} Single image.
   */
  getImage(t, e, n, s) {
    const r = this.getProjection();
    if (!r || !s || Wt(r, s))
      return r && (s = r), this.getImageInternal(t, e, n, s);
    if (this.reprojectedImage_) {
      if (this.reprojectedRevision_ == this.getRevision() && Wt(this.reprojectedImage_.getProjection(), s) && this.reprojectedImage_.getResolution() == e && si(this.reprojectedImage_.getExtent(), t))
        return this.reprojectedImage_;
      this.reprojectedImage_.dispose(), this.reprojectedImage_ = null;
    }
    return this.reprojectedImage_ = new uo(
      r,
      s,
      t,
      e,
      n,
      (o, a, l) => this.getImageInternal(o, a, l, r),
      this.getInterpolate()
    ), this.reprojectedRevision_ = this.getRevision(), this.reprojectedImage_;
  }
  /**
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../Image.js").default} Single image.
   * @protected
   */
  getImageInternal(t, e, n, s) {
    if (this.loader) {
      const r = Fi(t, e, n, 1), o = this.findNearestResolution(e);
      if (this.image && (this.static_ || this.wantedProjection_ === s && (this.wantedExtent_ && de(this.wantedExtent_, r) || de(this.image.getExtent(), r)) && (this.wantedResolution_ && Ke(this.wantedResolution_) === o || Ke(this.image.getResolution()) === o)))
        return this.image;
      this.wantedProjection_ = s, this.wantedExtent_ = r, this.wantedResolution_ = o, this.image = new Ci(
        r,
        o,
        n,
        this.loader
      ), this.image.addEventListener(
        B.CHANGE,
        this.handleImageChange.bind(this)
      );
    }
    return this.image;
  }
  /**
   * Handle image change events.
   * @param {import("../events/Event.js").default} event Event.
   * @protected
   */
  handleImageChange(t) {
    const e = (
      /** @type {import("../Image.js").default} */
      t.target
    );
    let n;
    switch (e.getState()) {
      case O.LOADING:
        this.loading = !0, n = ze.IMAGELOADSTART;
        break;
      case O.LOADED:
        this.loading = !1, n = ze.IMAGELOADEND;
        break;
      case O.ERROR:
        this.loading = !1, n = ze.IMAGELOADERROR;
        break;
      default:
        return;
    }
    this.hasListener(n) && this.dispatchEvent(new go(n, e));
  }
}
function _o(i, t) {
  i.getImage().src = t;
}
function Fi(i, t, e, n) {
  const s = t / e, r = Tt(i), o = Et(P(i) / s, yt), a = Et(U(i) / s, yt), l = Et((n - 1) * o / 2, yt), h = o + 2 * l, c = Et((n - 1) * a / 2, yt), u = a + 2 * c;
  return Je(r, s, 0, [
    h,
    u
  ]);
}
const bi = "1.3.0", Bn = [101, 101];
function Di(i, t, e, n, s) {
  s.WIDTH = e[0], s.HEIGHT = e[1];
  const r = n.getAxisOrientation(), o = li(s.VERSION, "1.3") >= 0;
  s[o ? "CRS" : "SRS"] = n.getCode();
  const a = o && r.startsWith("ne") ? [t[1], t[0], t[3], t[2]] : t;
  return s.BBOX = a.join(","), Li(i, s);
}
function mo(i, t, e, n, s, r, o) {
  r = Object.assign({ REQUEST: "GetMap" }, r);
  const a = t / e, l = [
    Tn(P(i) / a, yt),
    Tn(U(i) / a, yt)
  ];
  if (e != 1)
    switch (o) {
      case "geoserver":
        const c = 90 * e + 0.5 | 0;
        "FORMAT_OPTIONS" in r ? r.FORMAT_OPTIONS += ";dpi:" + c : r.FORMAT_OPTIONS = "dpi:" + c;
        break;
      case "mapserver":
        r.MAP_RESOLUTION = 90 * e;
        break;
      case "carmentaserver":
      case "qgis":
        r.DPI = 90 * e;
        break;
      default:
        throw new Error("Unknown `serverType` configured");
    }
  return Di(s, i, l, n, r);
}
function Gi(i, t) {
  return Object.assign(
    {
      REQUEST: t,
      SERVICE: "WMS",
      VERSION: bi,
      FORMAT: "image/png",
      STYLES: "",
      TRANSPARENT: !0
    },
    i
  );
}
function Ro(i) {
  const t = i.hidpi === void 0 ? !0 : i.hidpi, e = K(i.projection || "EPSG:3857"), n = i.ratio || 1.5, s = i.load || wi, r = i.crossOrigin ?? null;
  return (o, a, l) => {
    o = Fi(o, a, l, n), l != 1 && (!t || i.serverType === void 0) && (l = 1);
    const h = mo(
      o,
      a,
      l,
      e,
      i.url,
      Gi(i.params, "GetMap"),
      i.serverType
    ), c = new Image();
    return c.crossOrigin = r, s(c, h).then((u) => ({ image: u, extent: o, pixelRatio: l }));
  };
}
function Eo(i, t, e) {
  if (i.url === void 0)
    return;
  const n = K(i.projection || "EPSG:3857"), s = Je(
    t,
    e,
    0,
    Bn
  ), r = {
    QUERY_LAYERS: i.params.LAYERS,
    INFO_FORMAT: "application/json"
  };
  Object.assign(
    r,
    Gi(i.params, "GetFeatureInfo"),
    i.params
  );
  const o = Gt((t[0] - s[0]) / e, yt), a = Gt((s[3] - t[1]) / e, yt), l = li(r.VERSION, "1.3") >= 0;
  return r[l ? "I" : "X"] = o, r[l ? "J" : "Y"] = a, Di(
    i.url,
    s,
    Bn,
    n,
    r
  );
}
function po(i, t) {
  if (i.url === void 0)
    return;
  const e = {
    SERVICE: "WMS",
    VERSION: bi,
    REQUEST: "GetLegendGraphic",
    FORMAT: "image/png"
  };
  if (t !== void 0) {
    const n = K(i.projection || "EPSG:3857").getMetersPerUnit() || 1, s = 28e-5;
    e.SCALE = t * n / s;
  }
  if (Object.assign(e, i.params), i.params !== void 0 && e.LAYER === void 0) {
    const n = e.LAYERS;
    if (!(!Array.isArray(n) || n.length !== 1))
      return;
    e.LAYER = n;
  }
  return Li(i.url, e);
}
class yo extends fo {
  /**
   * @param {Options} [options] ImageWMS options.
   */
  constructor(t) {
    t = t || {}, super({
      attributions: t.attributions,
      interpolate: t.interpolate,
      projection: t.projection,
      resolutions: t.resolutions
    }), this.crossOrigin_ = t.crossOrigin !== void 0 ? t.crossOrigin : null, this.url_ = t.url, this.imageLoadFunction_ = t.imageLoadFunction !== void 0 ? t.imageLoadFunction : _o, this.params_ = Object.assign({}, t.params), this.serverType_ = t.serverType, this.hidpi_ = t.hidpi !== void 0 ? t.hidpi : !0, this.renderedRevision_ = 0, this.ratio_ = t.ratio !== void 0 ? t.ratio : 1.5, this.loaderProjection_ = null;
  }
  /**
   * Return the GetFeatureInfo URL for the passed coordinate, resolution, and
   * projection. Return `undefined` if the GetFeatureInfo URL cannot be
   * constructed.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {import("../proj.js").ProjectionLike} projection Projection.
   * @param {!Object} params GetFeatureInfo params. `INFO_FORMAT` at least should
   *     be provided. If `QUERY_LAYERS` is not provided then the layers specified
   *     in the `LAYERS` parameter will be used. `VERSION` should not be
   *     specified here.
   * @return {string|undefined} GetFeatureInfo URL.
   * @api
   */
  getFeatureInfoUrl(t, e, n, s) {
    const r = K(n), o = this.getProjection();
    o && o !== r && (e = Ee(
      o,
      r,
      t,
      e
    ), t = ci(t, r, o));
    const a = {
      url: this.url_,
      params: {
        ...this.params_,
        ...s
      },
      projection: o || r
    };
    return Eo(a, t, e);
  }
  /**
   * Return the GetLegendGraphic URL, optionally optimized for the passed
   * resolution and possibly including any passed specific parameters. Returns
   * `undefined` if the GetLegendGraphic URL cannot be constructed.
   *
   * @param {number} [resolution] Resolution. If set to undefined, `SCALE`
   *     will not be calculated and included in URL.
   * @param {Object} [params] GetLegendGraphic params. If `LAYER` is set, the
   *     request is generated for this wms layer, else it will try to use the
   *     configured wms layer. Default `FORMAT` is `image/png`.
   *     `VERSION` should not be specified here.
   * @return {string|undefined} GetLegendGraphic URL.
   * @api
   */
  getLegendUrl(t, e) {
    return po(
      {
        url: this.url_,
        params: {
          ...this.params_,
          ...e
        }
      },
      t
    );
  }
  /**
   * Get the user-provided params, i.e. those passed to the constructor through
   * the "params" option, and possibly updated using the updateParams method.
   * @return {Object} Params.
   * @api
   */
  getParams() {
    return this.params_;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../Image.js").default} Single image.
   * @override
   */
  getImageInternal(t, e, n, s) {
    return this.url_ === void 0 ? null : ((!this.loader || this.loaderProjection_ !== s) && (this.loaderProjection_ = s, this.loader = Ro({
      crossOrigin: this.crossOrigin_,
      params: this.params_,
      projection: s,
      serverType: this.serverType_,
      hidpi: this.hidpi_,
      url: this.url_,
      ratio: this.ratio_,
      load: (r, o) => (this.image.setImage(r), this.imageLoadFunction_(this.image, o), wi(r))
    })), super.getImageInternal(t, e, n, s));
  }
  /**
   * Return the image load function of the source.
   * @return {import("../Image.js").LoadFunction} The image load function.
   * @api
   */
  getImageLoadFunction() {
    return this.imageLoadFunction_;
  }
  /**
   * Return the URL used for this WMS source.
   * @return {string|undefined} URL.
   * @api
   */
  getUrl() {
    return this.url_;
  }
  /**
   * Set the image load function of the source.
   * @param {import("../Image.js").LoadFunction} imageLoadFunction Image load function.
   * @api
   */
  setImageLoadFunction(t) {
    this.imageLoadFunction_ = t, this.changed();
  }
  /**
   * Set the URL to use for requests.
   * @param {string|undefined} url URL.
   * @api
   */
  setUrl(t) {
    t != this.url_ && (this.url_ = t, this.loader = null, this.changed());
  }
  /**
   * Update the user-provided params.
   * @param {Object} params Params.
   * @api
   */
  updateParams(t) {
    Object.assign(this.params_, t), this.changed();
  }
  /**
   * @override
   */
  changed() {
    this.image = null, super.changed();
  }
}
const Mt = class Mt {
  constructor(t = "0f2b24825c004c4f2179d093c9bf2f7b") {
    Mt.TDT_TOKEN = t;
  }
  /**
   * 创建天地图矢量图层
   * TODO: 需要实现具体逻辑
   */
  static createTdtVecLayer() {
    return new Ne({
      source: new Xe({
        url: `http://t{0-7}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${Mt.TDT_TOKEN}`
      }),
      maxZoom: 18
    });
  }
  static createTdtImageLayer() {
    return new Ne({
      source: new Xe({
        url: `http://t{0-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${Mt.TDT_TOKEN}`
      }),
      maxZoom: 18
    });
  }
  static createTdtImageAnoLayer() {
    return new Ne({
      source: new Xe({
        url: `http://t{0-7}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${Mt.TDT_TOKEN}`
      }),
      maxZoom: 18
    });
  }
  static createGeoserverWMSLayer(t) {
    const {
      url: e = "http://36.134.229.118:8081/geoserver/wms",
      layerName: n,
      workspace: s = "publicuse",
      sourceOptions: r = {},
      layerOptions: o = {}
    } = t;
    return new Wn({
      source: new yo({
        url: e,
        params: {
          LAYERS: `${s}:${n}`,
          TILED: !0,
          SRS: "EPSG:4490",
          ...r.params
        },
        serverType: "geoserver",
        ...r
      }),
      opacity: 0.5,
      ...o
    });
  }
  static createGeoserverWMTSLayer() {
    return new Wn({});
  }
};
ve(Mt, "TDT_TOKEN", "0f2b24825c004c4f2179d093c9bf2f7b");
let $n = Mt;
export {
  $n as LayerUtil
};

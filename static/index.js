(() => {
  // node_modules/.pnpm/@sudodevnull+datastar@0.18.4/node_modules/@sudodevnull/datastar/dist/datastar.js
  function We(t) {
    return t instanceof HTMLElement || t instanceof SVGElement ? t : null;
  }
  function se() {
    throw new Error("Cycle detected");
  }
  function dt() {
    throw new Error("Computed cannot have side-effects");
  }
  var ht = Symbol.for("preact-signals");
  var k = 1;
  var x = 2;
  var U = 4;
  var F = 8;
  var B = 16;
  var I = 32;
  function re() {
    q++;
  }
  function oe() {
    if (q > 1) {
      q--;
      return;
    }
    let t, e = false;
    for (; W !== void 0; ) {
      let n = W;
      for (W = void 0, de++; n !== void 0; ) {
        const s = n._nextBatchedEffect;
        if (n._nextBatchedEffect = void 0, n._flags &= ~x, !(n._flags & F) && Je(n))
          try {
            n._callback();
          } catch (r) {
            e || (t = r, e = true);
          }
        n = s;
      }
    }
    if (de = 0, q--, e)
      throw t;
  }
  function pt(t) {
    if (q > 0)
      return t();
    re();
    try {
      return t();
    } finally {
      oe();
    }
  }
  var E;
  var W;
  var q = 0;
  var de = 0;
  var te = 0;
  function qe(t) {
    if (E === void 0)
      return;
    let e = t._node;
    if (e === void 0 || e._target !== E)
      return e = {
        _version: 0,
        _source: t,
        _prevSource: E._sources,
        _nextSource: void 0,
        _target: E,
        _prevTarget: void 0,
        _nextTarget: void 0,
        _rollbackNode: e
      }, E._sources !== void 0 && (E._sources._nextSource = e), E._sources = e, t._node = e, E._flags & I && t._subscribe(e), e;
    if (e._version === -1)
      return e._version = 0, e._nextSource !== void 0 && (e._nextSource._prevSource = e._prevSource, e._prevSource !== void 0 && (e._prevSource._nextSource = e._nextSource), e._prevSource = E._sources, e._nextSource = void 0, E._sources._nextSource = e, E._sources = e), e;
  }
  function T(t) {
    this._value = t, this._version = 0, this._node = void 0, this._targets = void 0;
  }
  T.prototype.brand = ht;
  T.prototype._refresh = function() {
    return true;
  };
  T.prototype._subscribe = function(t) {
    this._targets !== t && t._prevTarget === void 0 && (t._nextTarget = this._targets, this._targets !== void 0 && (this._targets._prevTarget = t), this._targets = t);
  };
  T.prototype._unsubscribe = function(t) {
    if (this._targets !== void 0) {
      const e = t._prevTarget, n = t._nextTarget;
      e !== void 0 && (e._nextTarget = n, t._prevTarget = void 0), n !== void 0 && (n._prevTarget = e, t._nextTarget = void 0), t === this._targets && (this._targets = n);
    }
  };
  T.prototype.subscribe = function(t) {
    const e = this;
    return ze(function() {
      const n = e.value, s = this._flags & I;
      this._flags &= ~I;
      try {
        t(n);
      } finally {
        this._flags |= s;
      }
    });
  };
  T.prototype.valueOf = function() {
    return this.value;
  };
  T.prototype.toString = function() {
    return this.value + "";
  };
  T.prototype.toJSON = function() {
    return this.value;
  };
  T.prototype.peek = function() {
    return this._value;
  };
  Object.defineProperty(T.prototype, "value", {
    get() {
      const t = qe(this);
      return t !== void 0 && (t._version = this._version), this._value;
    },
    set(t) {
      if (E instanceof $ && dt(), t !== this._value) {
        de > 100 && se(), this._value = t, this._version++, te++, re();
        try {
          for (let e = this._targets; e !== void 0; e = e._nextTarget)
            e._target._notify();
        } finally {
          oe();
        }
      }
    }
  });
  function Ue(t) {
    return new T(t);
  }
  function Je(t) {
    for (let e = t._sources; e !== void 0; e = e._nextSource)
      if (e._source._version !== e._version || !e._source._refresh() || e._source._version !== e._version)
        return true;
    return false;
  }
  function Ge(t) {
    for (let e = t._sources; e !== void 0; e = e._nextSource) {
      const n = e._source._node;
      if (n !== void 0 && (e._rollbackNode = n), e._source._node = e, e._version = -1, e._nextSource === void 0) {
        t._sources = e;
        break;
      }
    }
  }
  function Ke(t) {
    let e = t._sources, n;
    for (; e !== void 0; ) {
      const s = e._prevSource;
      e._version === -1 ? (e._source._unsubscribe(e), s !== void 0 && (s._nextSource = e._nextSource), e._nextSource !== void 0 && (e._nextSource._prevSource = s)) : n = e, e._source._node = e._rollbackNode, e._rollbackNode !== void 0 && (e._rollbackNode = void 0), e = s;
    }
    t._sources = n;
  }
  function $(t) {
    T.call(this, void 0), this._compute = t, this._sources = void 0, this._globalVersion = te - 1, this._flags = U;
  }
  $.prototype = new T();
  $.prototype._refresh = function() {
    if (this._flags &= ~x, this._flags & k)
      return false;
    if ((this._flags & (U | I)) === I || (this._flags &= ~U, this._globalVersion === te))
      return true;
    if (this._globalVersion = te, this._flags |= k, this._version > 0 && !Je(this))
      return this._flags &= ~k, true;
    const t = E;
    try {
      Ge(this), E = this;
      const e = this._compute();
      (this._flags & B || this._value !== e || this._version === 0) && (this._value = e, this._flags &= ~B, this._version++);
    } catch (e) {
      this._value = e, this._flags |= B, this._version++;
    }
    return E = t, Ke(this), this._flags &= ~k, true;
  };
  $.prototype._subscribe = function(t) {
    if (this._targets === void 0) {
      this._flags |= U | I;
      for (let e = this._sources; e !== void 0; e = e._nextSource)
        e._source._subscribe(e);
    }
    T.prototype._subscribe.call(this, t);
  };
  $.prototype._unsubscribe = function(t) {
    if (this._targets !== void 0 && (T.prototype._unsubscribe.call(this, t), this._targets === void 0)) {
      this._flags &= ~I;
      for (let e = this._sources; e !== void 0; e = e._nextSource)
        e._source._unsubscribe(e);
    }
  };
  $.prototype._notify = function() {
    if (!(this._flags & x)) {
      this._flags |= U | x;
      for (let t = this._targets; t !== void 0; t = t._nextTarget)
        t._target._notify();
    }
  };
  $.prototype.peek = function() {
    if (this._refresh() || se(), this._flags & B)
      throw this._value;
    return this._value;
  };
  Object.defineProperty($.prototype, "value", {
    get() {
      this._flags & k && se();
      const t = qe(this);
      if (this._refresh(), t !== void 0 && (t._version = this._version), this._flags & B)
        throw this._value;
      return this._value;
    }
  });
  function mt(t) {
    return new $(t);
  }
  function Ye(t) {
    const e = t._cleanup;
    if (t._cleanup = void 0, typeof e == "function") {
      re();
      const n = E;
      E = void 0;
      try {
        e();
      } catch (s) {
        throw t._flags &= ~k, t._flags |= F, ye(t), s;
      } finally {
        E = n, oe();
      }
    }
  }
  function ye(t) {
    for (let e = t._sources; e !== void 0; e = e._nextSource)
      e._source._unsubscribe(e);
    t._compute = void 0, t._sources = void 0, Ye(t);
  }
  function gt(t) {
    if (E !== this)
      throw new Error("Out-of-order effect");
    Ke(this), E = t, this._flags &= ~k, this._flags & F && ye(this), oe();
  }
  function K(t) {
    this._compute = t, this._cleanup = void 0, this._sources = void 0, this._nextBatchedEffect = void 0, this._flags = I;
  }
  K.prototype._callback = function() {
    const t = this._start();
    try {
      if (this._flags & F || this._compute === void 0)
        return;
      const e = this._compute();
      typeof e == "function" && (this._cleanup = e);
    } finally {
      t();
    }
  };
  K.prototype._start = function() {
    this._flags & k && se(), this._flags |= k, this._flags &= ~F, Ye(this), Ge(this), re();
    const t = E;
    return E = this, gt.bind(this, t);
  };
  K.prototype._notify = function() {
    this._flags & x || (this._flags |= x, this._nextBatchedEffect = W, W = this);
  };
  K.prototype._dispose = function() {
    this._flags |= F, this._flags & k || ye(this);
  };
  function ze(t) {
    const e = new K(t);
    try {
      e._callback();
    } catch (n) {
      throw e._dispose(), n;
    }
    return e._dispose.bind(e);
  }
  var Ze = class {
    get value() {
      return pe(this);
    }
    set value(e) {
      pt(() => vt(this, e));
    }
    peek() {
      return pe(this, { peek: true });
    }
  };
  var he = (t) => Object.assign(
    new Ze(),
    Object.entries(t).reduce(
      (e, [n, s]) => {
        if (["value", "peek"].some((r) => r === n))
          throw new Error(`${n} is a reserved property name`);
        return typeof s != "object" || s === null || Array.isArray(s) ? e[n] = Ue(s) : e[n] = he(s), e;
      },
      {}
    )
  );
  var vt = (t, e) => Object.keys(e).forEach((n) => t[n].value = e[n]);
  var pe = (t, { peek: e = false } = {}) => Object.entries(t).reduce(
    (n, [s, r]) => (r instanceof T ? n[s] = e ? r.peek() : r.value : r instanceof Ze && (n[s] = pe(r, { peek: e })), n),
    {}
  );
  function Xe(t, e) {
    if (typeof e != "object" || Array.isArray(e) || !e)
      return e;
    if (typeof e == "object" && e.toJSON !== void 0 && typeof e.toJSON == "function")
      return e.toJSON();
    let n = t;
    return typeof t != "object" && (n = { ...e }), Object.keys(e).forEach((s) => {
      n.hasOwnProperty(s) || (n[s] = e[s]), e[s] === null ? delete n[s] : n[s] = Xe(n[s], e[s]);
    }), n;
  }
  var j = "datastar-event";
  var bt = "[a-zA-Z_$][0-9a-zA-Z_$.]+";
  function we(t, e, n) {
    return new RegExp(`(?<whole>\\${t}(?<${e}>${bt})${n})`, "g");
  }
  var yt = {
    regexp: we("$", "signal", "(?<method>\\([^\\)]*\\))?"),
    replacer: (t) => {
      const { signal: e, method: n } = t, s = "ctx.store()";
      if (!n?.length)
        return `${s}.${e}.value`;
      const r = e.split("."), o = r.pop(), i = r.join(".");
      return `${s}.${i}.value.${o}${n}`;
    }
  };
  var wt = {
    regexp: we("$\\$", "action", "(?<call>\\((?<args>.*)\\))?"),
    replacer: ({ action: t, args: e }) => {
      const n = ["ctx"];
      e && n.push(...e.split(",").map((r) => r.trim()));
      const s = n.join(",");
      return `ctx.actions.${t}(${s})`;
    }
  };
  var _t = {
    regexp: we("~", "ref", ""),
    replacer({ ref: t }) {
      return `document.querySelector(ctx.store()._dsPlugins.refs.${t})`;
    }
  };
  var Et = [wt, yt, _t];
  var St = {
    prefix: "store",
    preprocessors: {
      pre: [
        {
          regexp: /(?<whole>.+)/g,
          replacer: (t) => {
            const { whole: e } = t;
            return `Object.assign({...ctx.store()}, ${e})`;
          }
        }
      ]
    },
    allowedModifiers: /* @__PURE__ */ new Set(["local", "session", "ifmissing"]),
    onLoad: (t) => {
      let e = "";
      const n = (f) => {
        const m = t.store(), l = JSON.stringify(m);
        l !== e && (window.localStorage.setItem(H, l), e = l);
      }, s = t.modifiers.has("local");
      if (s) {
        window.addEventListener(j, n);
        const f = window.localStorage.getItem(H) || "{}", m = JSON.parse(f);
        t.mergeStore(m);
      }
      const r = t.modifiers.has("session"), o = (f) => {
        const m = t.store(), l = JSON.stringify(m);
        window.sessionStorage.setItem(H, l);
      };
      if (r) {
        window.addEventListener(j, o);
        const f = window.sessionStorage.getItem(H) || "{}", m = JSON.parse(f);
        t.mergeStore(m);
      }
      const i = t.expressionFn(t), c = et(t.store(), i, t.modifiers.has("ifmissing"));
      return t.mergeStore(c), delete t.el.dataset[t.rawKey], () => {
        s && window.removeEventListener(j, n), r && window.removeEventListener(j, o);
      };
    }
  };
  var Tt = {
    prefix: "ref",
    mustHaveEmptyKey: true,
    mustNotEmptyExpression: true,
    bypassExpressionFunctionCreation: () => true,
    onLoad: (t) => {
      t.upsertIfMissingFromStore("_dsPlugins.refs", {});
      const { el: e, expression: n } = t, r = {
        _dsPlugins: {
          refs: {
            ...t.store()._dsPlugins.refs.value,
            [n]: Qe(e)
          }
        }
      };
      return t.mergeStore(r), () => {
        const o = t.store(), i = { ...o._dsPlugins.refs.value };
        delete i[n], o._dsPlugins.refs = i;
      };
    }
  };
  var At = [St, Tt];
  function Qe(t) {
    if (!t)
      return "null";
    if (typeof t == "string")
      return t;
    if (t instanceof Window)
      return "Window";
    if (t instanceof Document)
      return "Document";
    if (t.tagName === "BODY")
      return "BODY";
    const e = [];
    for (; t.parentElement && t.tagName !== "BODY"; ) {
      if (t.id) {
        e.unshift("#" + t.getAttribute("id"));
        break;
      } else {
        let n = 1, s = t;
        for (; s.previousElementSibling; s = s.previousElementSibling, n++)
          ;
        e.unshift(t.tagName + ":nth-child(" + n + ")");
      }
      t = t.parentElement;
    }
    return e.join(">");
  }
  function et(t, e, n) {
    const s = {};
    if (!n)
      Object.assign(s, e);
    else
      for (const r in e) {
        const o = t[r]?.value;
        o == null && (s[r] = e[r]);
      }
    return s;
  }
  var H = "datastar";
  var P = `${H}-`;
  var Nt = class {
    constructor(e = {}, ...n) {
      if (this.plugins = [], this.store = he({ _dsPlugins: {} }), this.actions = {}, this.refs = {}, this.reactivity = {
        signal: Ue,
        computed: mt,
        effect: ze
      }, this.parentID = "", this.missingIDNext = 0, this.removals = /* @__PURE__ */ new Map(), this.mergeRemovals = new Array(), this.actions = Object.assign(this.actions, e), n = [...At, ...n], !n.length)
        throw new Error("No plugins provided");
      const s = /* @__PURE__ */ new Set();
      for (const r of n) {
        if (r.requiredPluginPrefixes) {
          for (const o of r.requiredPluginPrefixes)
            if (!s.has(o))
              throw new Error(`${r.prefix} requires ${o}`);
        }
        this.plugins.push(r), s.add(r.prefix);
      }
    }
    run() {
      new MutationObserver((n, s) => {
        N("core", "dom", "mutation", document.body, document.body.outerHTML);
      }).observe(document.body, { attributes: true, childList: true, subtree: true }), this.plugins.forEach((n) => {
        n.onGlobalInit && (n.onGlobalInit({
          actions: this.actions,
          reactivity: this.reactivity,
          mergeStore: this.mergeStore.bind(this),
          store: this.store
        }), N("core", "plugins", "registration", "BODY", `On prefix ${n.prefix}`));
      }), this.applyPlugins(document.body);
    }
    cleanupElementRemovals(e) {
      const n = this.removals.get(e);
      if (n) {
        for (const s of n.set)
          s();
        this.removals.delete(e);
      }
    }
    mergeStore(e) {
      this.mergeRemovals.forEach((s) => s()), this.mergeRemovals = this.mergeRemovals.slice(0);
      const n = Xe(this.store.value, e);
      this.store = he(n), this.mergeRemovals.push(
        this.reactivity.effect(() => {
          N("core", "store", "merged", "STORE", JSON.stringify(this.store.value));
        })
      );
    }
    upsertIfMissingFromStore(e, n) {
      const s = e.split(".");
      let r = this.store;
      for (let i = 0; i < s.length - 1; i++) {
        const c = s[i];
        r[c] || (r[c] = {}), r = r[c];
      }
      const o = s[s.length - 1];
      r[o] || (r[o] = this.reactivity.signal(n), N("core", "store", "upsert", e, n));
    }
    signalByName(e) {
      return this.store[e];
    }
    applyPlugins(e) {
      const n = /* @__PURE__ */ new Set();
      this.plugins.forEach((s, r) => {
        this.walkDownDOM(e, (o) => {
          r || this.cleanupElementRemovals(o);
          for (const i in o.dataset) {
            const c = o.dataset[i] || "";
            let f = c;
            if (!i.startsWith(s.prefix))
              continue;
            if (o.id.length === 0 && (o.id = `ds-${this.parentID}-${this.missingIDNext++}`), n.clear(), s.allowedTagRegexps) {
              const u = o.tagName.toLowerCase();
              if (![...s.allowedTagRegexps].some((b) => u.match(b)))
                throw new Error(
                  `'${o.tagName}' not allowed for '${i}', allowed ${[
                    [...s.allowedTagRegexps].map((b) => `'${b}'`)
                  ].join(", ")}`
                );
            }
            let m = i.slice(s.prefix.length), [l, ...d] = m.split(".");
            if (s.mustHaveEmptyKey && l.length > 0)
              throw new Error(`'${i}' must have empty key`);
            if (s.mustNotEmptyKey && l.length === 0)
              throw new Error(`'${i}' must have non-empty key`);
            l.length && (l = l[0].toLowerCase() + l.slice(1));
            const a = d.map((u) => {
              const [v, ...b] = u.split("_");
              return { label: v, args: b };
            });
            if (s.allowedModifiers) {
              for (const u of a)
                if (!s.allowedModifiers.has(u.label))
                  throw new Error(`'${u.label}' is not allowed`);
            }
            const p = /* @__PURE__ */ new Map();
            for (const u of a)
              p.set(u.label, u.args);
            if (s.mustHaveEmptyExpression && f.length)
              throw new Error(`'${i}' must have empty expression`);
            if (s.mustNotEmptyExpression && !f.length)
              throw new Error(`'${i}' must have non-empty expression`);
            const y = /;|\n/, h = [...s.preprocessors?.pre || [], ...Et, ...s.preprocessors?.post || []];
            for (const u of h) {
              if (n.has(u))
                continue;
              n.add(u);
              const v = f.split(y), b = [];
              v.forEach((_) => {
                let A = _;
                const S = [...A.matchAll(u.regexp)];
                if (S.length)
                  for (const L of S) {
                    if (!L.groups)
                      continue;
                    const { groups: D } = L, { whole: V } = D;
                    A = A.replace(V, u.replacer(D));
                  }
                b.push(A);
              }), f = b.join("; ");
            }
            const g = {
              store: () => this.store,
              mergeStore: this.mergeStore.bind(this),
              upsertIfMissingFromStore: this.upsertIfMissingFromStore.bind(this),
              applyPlugins: this.applyPlugins.bind(this),
              cleanupElementRemovals: this.cleanupElementRemovals.bind(this),
              walkSignals: this.walkSignals.bind(this),
              actions: this.actions,
              reactivity: this.reactivity,
              el: o,
              rawKey: i,
              key: l,
              rawExpression: c,
              expression: f,
              expressionFn: () => {
                throw new Error("Expression function not created");
              },
              modifiers: p,
              sendDatastarEvent: N
            };
            if (!s.bypassExpressionFunctionCreation?.(g) && !s.mustHaveEmptyExpression && f.length) {
              const u = f.split(y).map((_) => _.trim()).filter((_) => _.length);
              u[u.length - 1] = `return ${u[u.length - 1]}`;
              const v = u.map((_) => `  ${_}`).join(`;
`), b = `
try {
  const _datastarExpression = () => {
${v}
  }
  const _datastarReturnVal = _datastarExpression()
  ctx.sendDatastarEvent('core', 'attributes', 'expr_eval', ctx.el, '${i} equals ' + JSON.stringify(_datastarReturnVal))
  return _datastarReturnVal
} catch (e) {
 const msg = \`
Error evaluating Datastar expression:
${v.replaceAll("`", "\\`")}

Error: \${e.message}

Check if the expression is valid before raising an issue.
\`.trim()
 ctx.sendDatastarEvent('core', 'attributes', 'expr_eval_err', ctx.el, msg)
 console.error(msg)
 debugger
}
            `;
              try {
                const _ = new Function("ctx", b);
                g.expressionFn = _;
              } catch (_) {
                const A = new Error(`Error creating expression function for '${b}', error: ${_}`);
                N("core", "attributes", "expr_construction_err", g.el, String(A)), console.error(A);
                debugger;
              }
            }
            const w = s.onLoad(g);
            w && (this.removals.has(o) || this.removals.set(o, { id: o.id, set: /* @__PURE__ */ new Set() }), this.removals.get(o).set.add(w));
          }
        });
      });
    }
    walkSignalsStore(e, n) {
      const s = Object.keys(e);
      for (let r = 0; r < s.length; r++) {
        const o = s[r], i = e[o], c = i instanceof T, f = typeof i == "object" && Object.keys(i).length > 0;
        if (c) {
          n(o, i);
          continue;
        }
        f && this.walkSignalsStore(i, n);
      }
    }
    walkSignals(e) {
      this.walkSignalsStore(this.store, e);
    }
    walkDownDOM(e, n, s = 0) {
      if (!e)
        return;
      const r = We(e);
      if (r)
        for (n(r), s = 0, e = e.firstElementChild; e; )
          this.walkDownDOM(e, n, s++), e = e.nextElementSibling;
    }
  };
  var tt = (t) => t.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (e, n) => (n ? "-" : "") + e.toLowerCase());
  var Lt = {
    prefix: "bind",
    mustNotEmptyKey: true,
    mustNotEmptyExpression: true,
    onLoad: (t) => t.reactivity.effect(async () => {
      const e = tt(t.key), n = t.expressionFn(t);
      let s;
      typeof n == "string" ? s = n : s = JSON.stringify(n), !s || s === "false" || s === "null" || s === "undefined" ? t.el.removeAttribute(e) : t.el.setAttribute(e, s);
    })
  };
  var Mt = /^data:(?<mime>[^;]+);base64,(?<contents>.*)$/;
  var Y = ["change", "input", "keydown"];
  var kt = {
    prefix: "model",
    mustHaveEmptyKey: true,
    preprocessors: {
      post: [
        {
          regexp: /(?<whole>.+)/g,
          replacer: (t) => {
            const { whole: e } = t;
            return `ctx.store().${e}`;
          }
        }
      ]
    },
    allowedTagRegexps: /* @__PURE__ */ new Set(["input", "textarea", "select", "checkbox", "radio"]),
    // bypassExpressionFunctionCreation: () => true,
    onLoad: (t) => {
      const { el: e, expression: n } = t, s = t.expressionFn(t), r = e.tagName.toLowerCase();
      if (n.startsWith("ctx.store().ctx.store()"))
        throw new Error(`Model attribute on #${e.id} must have a signal name, you probably prefixed with $ by accident`);
      const o = r.includes("input"), i = r.includes("select"), c = r.includes("textarea"), f = e.getAttribute("type"), m = r.includes("checkbox") || o && f === "checkbox", l = r.includes("radio") || o && f === "radio", d = o && f === "file";
      if (!o && !i && !c && !m && !l)
        throw new Error("Element must be input, select, textarea, checkbox or radio");
      const a = n.replaceAll("ctx.store().", "");
      l && (e.getAttribute("name")?.length || e.setAttribute("name", a));
      const p = () => {
        if (!s)
          throw new Error(`Signal ${a} not found`);
        const u = "value" in e, v = s.value;
        if (m || l) {
          const b = e;
          m ? b.checked = v : l && (b.checked = `${v}` === b.value);
        } else
          d || (u ? e.value = `${v}` : e.setAttribute("value", `${v}`));
      }, y = t.reactivity.effect(p), h = async () => {
        if (d) {
          const b = [...e?.files || []], _ = [], A = [], S = [];
          await Promise.all(
            b.map((Ee) => new Promise((ft) => {
              const R = new FileReader();
              R.onload = () => {
                if (typeof R.result != "string")
                  throw new Error(`Invalid result type: ${typeof R.result}`);
                const ae = R.result.match(Mt);
                if (!ae?.groups)
                  throw new Error(`Invalid data URI: ${R.result}`);
                _.push(ae.groups.contents), A.push(ae.groups.mime), S.push(Ee.name);
              }, R.onloadend = () => ft(void 0), R.readAsDataURL(Ee);
            }))
          ), s.value = _;
          const L = t.store(), D = `${a}Mimes`, V = `${a}Names`;
          D in L && (L[`${D}`].value = A), V in L && (L[`${V}`].value = S);
          return;
        }
        const u = s.value, v = e;
        if (typeof u == "number")
          s.value = Number(v.value);
        else if (typeof u == "string")
          s.value = v.value;
        else if (typeof u == "boolean")
          m ? s.value = v.checked : s.value = !!v.value;
        else if (!(typeof u > "u"))
          if (typeof u == "bigint")
            s.value = BigInt(v.value);
          else
            throw console.log(typeof u), new Error("Unsupported type");
      }, g = e.tagName.split("-");
      if (g.length > 1) {
        const u = g[0].toLowerCase();
        Y.forEach((v) => {
          Y.push(`${u}-${v}`);
        });
      }
      return Y.forEach((u) => e.addEventListener(u, h)), () => {
        y(), Y.forEach((u) => e.removeEventListener(u, h));
      };
    }
  };
  var Pt = {
    prefix: "text",
    mustHaveEmptyKey: true,
    onLoad: (t) => {
      const { el: e, expressionFn: n } = t;
      if (!(e instanceof HTMLElement))
        throw new Error("Element is not HTMLElement");
      return t.reactivity.effect(() => {
        const s = n(t);
        e.textContent = `${s}`;
      });
    }
  };
  var Se = "";
  var $t = /* @__PURE__ */ new Set(["window", "once", "passive", "capture", "debounce", "throttle", "remote", "outside"]);
  var Ot = {
    prefix: "on",
    mustNotEmptyKey: true,
    mustNotEmptyExpression: true,
    onLoad: (t) => {
      const { el: e, key: n, expressionFn: s } = t;
      let r = t.el;
      t.modifiers.get("window") && (r = window);
      let o = (d) => {
        N("plugin", "event", n, r, "triggered"), s(t);
      };
      const i = t.modifiers.get("debounce");
      if (i) {
        const d = me(i), a = z(i, "leading", false), p = z(i, "noTrail", true);
        o = Ct(o, d, a, p);
      }
      const c = t.modifiers.get("throttle");
      if (c) {
        const d = me(c), a = z(c, "noLead", true), p = z(c, "noTrail", false);
        o = Dt(o, d, a, p);
      }
      const f = {
        capture: true,
        passive: false,
        once: false
      };
      t.modifiers.has("capture") || (f.capture = false), t.modifiers.has("passive") && (f.passive = true), t.modifiers.has("once") && (f.once = true), [...t.modifiers.keys()].filter((d) => !$t.has(d)).forEach((d) => {
        const a = t.modifiers.get(d) || [], p = o;
        o = () => {
          const g = event[d];
          let w;
          if (typeof g == "function")
            w = g(...a);
          else if (typeof g == "boolean")
            w = g;
          else if (typeof g == "string") {
            const u = a.join("");
            w = g === u;
          } else {
            const u = `Invalid value for ${d} modifier on ${n} on ${e}`;
            console.error(u);
            debugger;
            throw new Error(u);
          }
          w && p();
        };
      });
      const l = tt(n).toLowerCase();
      switch (l) {
        case "load":
          return o(), delete t.el.dataset.onLoad, () => {
          };
        case "raf":
          let d;
          const a = () => {
            o(), d = requestAnimationFrame(a);
          };
          return d = requestAnimationFrame(a), () => {
            d && cancelAnimationFrame(d);
          };
        case "store-change":
          return t.reactivity.effect(() => {
            let h = t.store().value;
            t.modifiers.has("remote") && (h = ie(h));
            const g = JSON.stringify(h);
            Se !== g && (Se = g, o());
          });
        default:
          if (t.modifiers.has("outside")) {
            r = document;
            const y = o;
            let h = false;
            o = (w) => {
              const u = w?.target;
              if (!u)
                return;
              !(e.id === u.id) && !h && (y(w), h = true);
            };
          }
          return r.addEventListener(l, o, f), () => {
            r.removeEventListener(l, o);
          };
      }
    }
  };
  function ie(t) {
    const e = {};
    for (const [n, s] of Object.entries(t))
      n.startsWith("_") || (typeof s == "object" && !Array.isArray(s) ? e[n] = ie(s) : e[n] = s);
    return e;
  }
  var It = [
    Lt,
    kt,
    Pt,
    Ot
  ];
  var Rt = {
    remote: async (t) => ie(t.store().value)
  };
  function me(t) {
    if (!t || t?.length === 0)
      return 0;
    for (const e of t) {
      if (e.endsWith("ms"))
        return Number(e.replace("ms", ""));
      if (e.endsWith("s"))
        return Number(e.replace("s", "")) * 1e3;
      try {
        return parseFloat(e);
      } catch {
      }
    }
    return 0;
  }
  function z(t, e, n = false) {
    return t ? t.includes(e) || n : false;
  }
  function Ct(t, e, n = false, s = true) {
    let r;
    const o = () => r && clearTimeout(r);
    return function(...c) {
      o(), n && !r && t(...c), r = setTimeout(() => {
        s && t(...c), o();
      }, e);
    };
  }
  function Dt(t, e, n = true, s = false) {
    let r = false, o = null;
    return function(...c) {
      r ? o = c : (r = true, n ? t(...c) : o = c, setTimeout(() => {
        s && o && (t(...o), o = null), r = false;
      }, e));
    };
  }
  function Ht(t, {
    signal: e,
    headers: n,
    onopen: s,
    onmessage: r,
    onclose: o,
    onerror: i,
    openWhenHidden: c,
    ...f
  }) {
    return new Promise((m, l) => {
      let d = 0;
      const a = { ...n };
      a.accept || (a.accept = ge);
      let p;
      function y() {
        p.abort(), document.hidden || v();
      }
      c || document.addEventListener("visibilitychange", y);
      let h = Te, g = 0;
      function w() {
        document.removeEventListener("visibilitychange", y), window.clearTimeout(g), p.abort();
      }
      e?.addEventListener("abort", () => {
        w(), m();
      });
      const u = s ?? Vt;
      async function v() {
        p = new AbortController();
        try {
          const b = await fetch(t, {
            ...f,
            headers: a,
            signal: p.signal
          });
          await u(b), await jt(
            b.body,
            Bt(
              Wt(
                (_) => {
                  _ ? a[Ae] = _ : delete a[Ae];
                },
                (_) => {
                  h = _;
                },
                r
              )
            )
          ), o?.(), w(), m();
        } catch (b) {
          if (!p.signal.aborted)
            try {
              const _ = i?.(b) ?? h;
              window.clearTimeout(g), g = window.setTimeout(v, _), h *= 1.5, h = Math.min(h, xt), d++, d >= Ft ? (w(), l(new Error("Max retries hit, check your server or network connection."))) : console.error(`Error fetching event source, retrying in ${_}ms`);
            } catch (_) {
              w(), l(_);
            }
        }
      }
      h = Te, v();
    });
  }
  var ge = "text/event-stream";
  var Te = 100;
  var xt = 1e4;
  var Ft = 10;
  var Ae = "last-event-id";
  function Vt(t) {
    const e = t.headers.get("content-type");
    if (!e?.startsWith(ge))
      throw new Error(`Expected content-type to be ${ge}, Actual: ${e}`);
  }
  async function jt(t, e) {
    const n = t.getReader();
    for (; ; ) {
      const s = await n.read();
      if (s.done)
        break;
      e(s.value);
    }
  }
  function Bt(t) {
    let e, n, s, r = false;
    return function(i) {
      e === void 0 ? (e = i, n = 0, s = -1) : e = qt(e, i);
      const c = e.length;
      let f = 0;
      for (; n < c; ) {
        r && (e[n] === 10 && (f = ++n), r = false);
        let m = -1;
        for (; n < c && m === -1; ++n)
          switch (e[n]) {
            case 58:
              s === -1 && (s = n - f);
              break;
            case 13:
              r = true;
            case 10:
              m = n;
              break;
          }
        if (m === -1)
          break;
        t(e.subarray(f, m), s), f = n, s = -1;
      }
      f === c ? e = void 0 : f !== 0 && (e = e.subarray(f), n -= f);
    };
  }
  function Wt(t, e, n) {
    let s = Ne();
    const r = new TextDecoder();
    return function(i, c) {
      if (i.length === 0)
        n?.(s), s = Ne();
      else if (c > 0) {
        const f = r.decode(i.subarray(0, c)), m = c + (i[c + 1] === 32 ? 2 : 1), l = r.decode(i.subarray(m));
        switch (f) {
          case "data":
            s.data = s.data ? s.data + `
` + l : l;
            break;
          case "event":
            s.event = l;
            break;
          case "id":
            t(s.id = l);
            break;
          case "retry":
            const d = parseInt(l, 10);
            isNaN(d) || e(s.retry = d);
            break;
        }
      }
    };
  }
  function qt(t, e) {
    const n = new Uint8Array(t.length + e.length);
    return n.set(t), n.set(e, t.length), n;
  }
  function Ne() {
    return {
      data: "",
      event: "",
      id: "",
      retry: void 0
    };
  }
  var Q = /* @__PURE__ */ new WeakSet();
  function Ut(t, e, n = {}) {
    t instanceof Document && (t = t.documentElement);
    let s;
    typeof e == "string" ? s = zt(e) : s = e;
    const r = Zt(s), o = Gt(t, r, n);
    return nt(t, r, o);
  }
  function nt(t, e, n) {
    if (n.head.block) {
      const s = t.querySelector("head"), r = e.querySelector("head");
      if (s && r) {
        const o = rt(r, s, n);
        Promise.all(o).then(() => {
          nt(
            t,
            e,
            Object.assign(n, {
              head: {
                block: false,
                ignore: true
              }
            })
          );
        });
        return;
      }
    }
    if (n.morphStyle === "innerHTML")
      return st(e, t, n), t.children;
    if (n.morphStyle === "outerHTML" || n.morphStyle == null) {
      const s = Qt(e, t, n);
      if (!s)
        throw new Error("Could not find best match");
      const r = s?.previousSibling, o = s?.nextSibling, i = ee(t, s, n);
      return s ? Xt(r, i, o) : [];
    } else
      throw "Do not understand how to morph style " + n.morphStyle;
  }
  function ee(t, e, n) {
    if (!(n.ignoreActive && t === document.activeElement))
      if (e == null) {
        if (n.callbacks.beforeNodeRemoved(t) === false)
          return;
        t.remove(), n.callbacks.afterNodeRemoved(t);
        return;
      } else {
        if (ne(t, e))
          return n.callbacks.beforeNodeMorphed(t, e) === false ? void 0 : (t instanceof HTMLHeadElement && n.head.ignore || (e instanceof HTMLHeadElement && t instanceof HTMLHeadElement && n.head.style !== "morph" ? rt(e, t, n) : (Jt(e, t), st(e, t, n))), n.callbacks.afterNodeMorphed(t, e), t);
        if (n.callbacks.beforeNodeRemoved(t) === false || n.callbacks.beforeNodeAdded(e) === false)
          return;
        if (!t.parentElement)
          throw new Error("oldNode has no parentElement");
        return t.parentElement.replaceChild(e, t), n.callbacks.afterNodeAdded(e), n.callbacks.afterNodeRemoved(t), e;
      }
  }
  function st(t, e, n) {
    let s = t.firstChild, r = e.firstChild, o;
    for (; s; ) {
      if (o = s, s = o.nextSibling, r == null) {
        if (n.callbacks.beforeNodeAdded(o) === false)
          return;
        e.appendChild(o), n.callbacks.afterNodeAdded(o), C(n, o);
        continue;
      }
      if (ot(o, r, n)) {
        ee(r, o, n), r = r.nextSibling, C(n, o);
        continue;
      }
      let i = Kt(t, e, o, r, n);
      if (i) {
        r = Le(r, i, n), ee(i, o, n), C(n, o);
        continue;
      }
      let c = Yt(t, o, r, n);
      if (c) {
        r = Le(r, c, n), ee(c, o, n), C(n, o);
        continue;
      }
      if (n.callbacks.beforeNodeAdded(o) === false)
        return;
      e.insertBefore(o, r), n.callbacks.afterNodeAdded(o), C(n, o);
    }
    for (; r !== null; ) {
      let i = r;
      r = r.nextSibling, it(i, n);
    }
  }
  function Jt(t, e) {
    let n = t.nodeType;
    if (n === 1) {
      for (const s of t.attributes)
        e.getAttribute(s.name) !== s.value && e.setAttribute(s.name, s.value);
      for (const s of e.attributes)
        t.hasAttribute(s.name) || e.removeAttribute(s.name);
    }
    if ((n === Node.COMMENT_NODE || n === Node.TEXT_NODE) && e.nodeValue !== t.nodeValue && (e.nodeValue = t.nodeValue), t instanceof HTMLInputElement && e instanceof HTMLInputElement && t.type !== "file")
      e.value = t.value || "", Z(t, e, "value"), Z(t, e, "checked"), Z(t, e, "disabled");
    else if (t instanceof HTMLOptionElement)
      Z(t, e, "selected");
    else if (t instanceof HTMLTextAreaElement && e instanceof HTMLTextAreaElement) {
      const s = t.value, r = e.value;
      s !== r && (e.value = s), e.firstChild && e.firstChild.nodeValue !== s && (e.firstChild.nodeValue = s);
    }
  }
  function Z(t, e, n) {
    const s = t.getAttribute(n), r = e.getAttribute(n);
    s !== r && (s ? e.setAttribute(n, s) : e.removeAttribute(n));
  }
  function rt(t, e, n) {
    const s = [], r = [], o = [], i = [], c = n.head.style, f = /* @__PURE__ */ new Map();
    for (const l of t.children)
      f.set(l.outerHTML, l);
    for (const l of e.children) {
      let d = f.has(l.outerHTML), a = n.head.shouldReAppend(l), p = n.head.shouldPreserve(l);
      d || p ? a ? r.push(l) : (f.delete(l.outerHTML), o.push(l)) : c === "append" ? a && (r.push(l), i.push(l)) : n.head.shouldRemove(l) !== false && r.push(l);
    }
    i.push(...f.values());
    const m = [];
    for (const l of i) {
      const d = document.createRange().createContextualFragment(l.outerHTML).firstChild;
      if (!d)
        throw new Error("could not create new element from: " + l.outerHTML);
      if (n.callbacks.beforeNodeAdded(d)) {
        if (d.hasAttribute("href") || d.hasAttribute("src")) {
          let a;
          const p = new Promise((y) => {
            a = y;
          });
          d.addEventListener("load", function() {
            a(void 0);
          }), m.push(p);
        }
        e.appendChild(d), n.callbacks.afterNodeAdded(d), s.push(d);
      }
    }
    for (const l of r)
      n.callbacks.beforeNodeRemoved(l) !== false && (e.removeChild(l), n.callbacks.afterNodeRemoved(l));
    return n.head.afterHeadMorphed(e, {
      added: s,
      kept: o,
      removed: r
    }), m;
  }
  function O() {
  }
  function Gt(t, e, n) {
    return {
      target: t,
      newContent: e,
      config: n,
      morphStyle: n.morphStyle,
      ignoreActive: n.ignoreActive,
      idMap: sn(t, e),
      deadIds: /* @__PURE__ */ new Set(),
      callbacks: Object.assign(
        {
          beforeNodeAdded: O,
          afterNodeAdded: O,
          beforeNodeMorphed: O,
          afterNodeMorphed: O,
          beforeNodeRemoved: O,
          afterNodeRemoved: O
        },
        n.callbacks
      ),
      head: Object.assign(
        {
          style: "merge",
          shouldPreserve: (s) => s.getAttribute("im-preserve") === "true",
          shouldReAppend: (s) => s.getAttribute("im-re-append") === "true",
          shouldRemove: O,
          afterHeadMorphed: O
        },
        n.head
      )
    };
  }
  function ot(t, e, n) {
    return !t || !e ? false : t.nodeType === e.nodeType && t.tagName === e.tagName ? t?.id?.length && t.id === e.id ? true : J(n, t, e) > 0 : false;
  }
  function ne(t, e) {
    return !t || !e ? false : t.nodeType === e.nodeType && t.tagName === e.tagName;
  }
  function Le(t, e, n) {
    for (; t !== e; ) {
      const s = t;
      if (t = t?.nextSibling, !s)
        throw new Error("tempNode is null");
      it(s, n);
    }
    return C(n, e), e.nextSibling;
  }
  function Kt(t, e, n, s, r) {
    const o = J(r, n, e);
    let i = null;
    if (o > 0) {
      i = s;
      let c = 0;
      for (; i != null; ) {
        if (ot(n, i, r))
          return i;
        if (c += J(r, i, t), c > o)
          return null;
        i = i.nextSibling;
      }
    }
    return i;
  }
  function Yt(t, e, n, s) {
    let r = n, o = e.nextSibling, i = 0;
    for (; r && o; ) {
      if (J(s, r, t) > 0)
        return null;
      if (ne(e, r))
        return r;
      if (ne(o, r) && (i++, o = o.nextSibling, i >= 2))
        return null;
      r = r.nextSibling;
    }
    return r;
  }
  var Me = new DOMParser();
  function zt(t) {
    const e = t.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim, "");
    if (e.match(/<\/html>/) || e.match(/<\/head>/) || e.match(/<\/body>/)) {
      const n = Me.parseFromString(t, "text/html");
      if (e.match(/<\/html>/))
        return Q.add(n), n;
      {
        let s = n.firstChild;
        return s ? (Q.add(s), s) : null;
      }
    } else {
      const s = Me.parseFromString(`<body><template>${t}</template></body>`, "text/html").body.querySelector("template")?.content;
      if (!s)
        throw new Error("content is null");
      return Q.add(s), s;
    }
  }
  function Zt(t) {
    if (t == null)
      return document.createElement("div");
    if (Q.has(t))
      return t;
    if (t instanceof Node) {
      const e = document.createElement("div");
      return e.append(t), e;
    } else {
      const e = document.createElement("div");
      for (const n of [...t])
        e.append(n);
      return e;
    }
  }
  function Xt(t, e, n) {
    const s = [], r = [];
    for (; t; )
      s.push(t), t = t.previousSibling;
    for (; s.length > 0; ) {
      const o = s.pop();
      r.push(o), e?.parentElement?.insertBefore(o, e);
    }
    for (r.push(e); n; )
      s.push(n), r.push(n), n = n.nextSibling;
    for (; s.length; )
      e?.parentElement?.insertBefore(s.pop(), e.nextSibling);
    return r;
  }
  function Qt(t, e, n) {
    let s = t.firstChild, r = s, o = 0;
    for (; s; ) {
      let i = en(s, e, n);
      i > o && (r = s, o = i), s = s.nextSibling;
    }
    return r;
  }
  function en(t, e, n) {
    return ne(t, e) ? 0.5 + J(n, t, e) : 0;
  }
  function it(t, e) {
    C(e, t), e.callbacks.beforeNodeRemoved(t) !== false && (t.remove(), e.callbacks.afterNodeRemoved(t));
  }
  function tn(t, e) {
    return !t.deadIds.has(e);
  }
  function nn(t, e, n) {
    return t.idMap.get(n)?.has(e) || false;
  }
  function C(t, e) {
    const n = t.idMap.get(e);
    if (n)
      for (const s of n)
        t.deadIds.add(s);
  }
  function J(t, e, n) {
    const s = t.idMap.get(e);
    if (!s)
      return 0;
    let r = 0;
    for (const o of s)
      tn(t, o) && nn(t, o, n) && ++r;
    return r;
  }
  function ke(t, e) {
    const n = t.parentElement, s = t.querySelectorAll("[id]");
    for (const r of s) {
      let o = r;
      for (; o !== n && o; ) {
        let i = e.get(o);
        i == null && (i = /* @__PURE__ */ new Set(), e.set(o, i)), i.add(r.id), o = o.parentElement;
      }
    }
  }
  function sn(t, e) {
    const n = /* @__PURE__ */ new Map();
    return ke(t, n), ke(e, n), n;
  }
  var le = "display";
  var Pe = "none";
  var ce = "important";
  var $e = "duration";
  var rn = "show";
  var ue = `${P}showing`;
  var fe = `${P}hiding`;
  var Oe = `${P}show-transition-style`;
  var on = {
    prefix: rn,
    allowedModifiers: /* @__PURE__ */ new Set([ce, $e]),
    onLoad: (t) => {
      const { el: e, modifiers: n, expressionFn: s, reactivity: r } = t, i = n.has(ce) ? ce : void 0;
      let c, f;
      const m = t.modifiers.get($e);
      if (m) {
        let l = document.getElementById(Oe);
        if (!l) {
          l = document.createElement("style"), l.id = Oe, document.head.appendChild(l);
          const a = me(m) || "300";
          l.innerHTML = `
          .${ue} {
            visibility: visible;
            transition: opacity ${a}ms linear;
          }
          .${fe} {
            visibility: hidden;
            transition: visibility 0s ${a}ms, opacity ${a}ms linear;
          }
        `;
        }
        const d = (a) => (p) => {
          p.target === e && (e.classList.remove(a), e.removeEventListener("transitionend", d(a)));
        };
        c = () => {
          e.addEventListener("transitionend", d(ue)), e.classList.add(ue), requestAnimationFrame(() => {
            e.style.setProperty("opacity", "1", i);
          });
        }, f = () => {
          e.addEventListener("transitionend", d(fe)), e.classList.add(fe), requestAnimationFrame(() => {
            e.style.setProperty("opacity", "0", i);
          });
        };
      } else
        c = () => {
          e.style.length === 1 && e.style.display === Pe ? e.style.removeProperty(le) : e.style.setProperty(le, "", i);
        }, f = () => {
          e.style.setProperty(le, Pe, i);
        };
      return r.effect(async () => {
        !!await s(t) ? c() : f();
      });
    }
  };
  var an = "intersects";
  var Ie = "once";
  var Re = "half";
  var Ce = "full";
  var ln = {
    prefix: an,
    allowedModifiers: /* @__PURE__ */ new Set([Ie, Re, Ce]),
    mustHaveEmptyKey: true,
    onLoad: (t) => {
      const { modifiers: e } = t, n = { threshold: 0 };
      e.has(Ce) ? n.threshold = 1 : e.has(Re) && (n.threshold = 0.5);
      const s = new IntersectionObserver((r) => {
        r.forEach((o) => {
          o.isIntersecting && (t.expressionFn(t), e.has(Ie) && (s.disconnect(), delete t.el.dataset[t.rawKey]));
        });
      }, n);
      return s.observe(t.el), () => s.disconnect();
    }
  };
  var De = "prepend";
  var He = "append";
  var xe = new Error("Target element must have a parent if using prepend or append");
  var cn = {
    prefix: "teleport",
    allowedModifiers: /* @__PURE__ */ new Set([De, He]),
    allowedTagRegexps: /* @__PURE__ */ new Set(["template"]),
    bypassExpressionFunctionCreation: () => true,
    onLoad: (t) => {
      const { el: e, modifiers: n, expression: s } = t;
      if (!(e instanceof HTMLTemplateElement))
        throw new Error("el must be a template element");
      const r = document.querySelector(s);
      if (!r)
        throw new Error(`Target element not found: ${s}`);
      if (!e.content)
        throw new Error("Template element must have content");
      const o = e.content.cloneNode(true);
      if (We(o)?.firstElementChild)
        throw new Error("Empty template");
      if (n.has(De)) {
        if (!r.parentNode)
          throw xe;
        r.parentNode.insertBefore(o, r);
      } else if (n.has(He)) {
        if (!r.parentNode)
          throw xe;
        r.parentNode.insertBefore(o, r.nextSibling);
      } else
        r.appendChild(o);
    }
  };
  var un = {
    prefix: "scrollIntoView",
    mustHaveEmptyKey: true,
    mustHaveEmptyExpression: true,
    allowedModifiers: /* @__PURE__ */ new Set([
      "smooth",
      "instant",
      "auto",
      "hstart",
      "hcenter",
      "hend",
      "hnearest",
      "vstart",
      "vcenter",
      "vend",
      "vnearest",
      "focus"
    ]),
    onLoad: ({ el: t, modifiers: e, rawKey: n }) => {
      t.tabIndex || t.setAttribute("tabindex", "0");
      const s = {
        behavior: "smooth",
        block: "center",
        inline: "center"
      };
      return e.has("smooth") && (s.behavior = "smooth"), e.has("instant") && (s.behavior = "instant"), e.has("auto") && (s.behavior = "auto"), e.has("hstart") && (s.inline = "start"), e.has("hcenter") && (s.inline = "center"), e.has("hend") && (s.inline = "end"), e.has("hnearest") && (s.inline = "nearest"), e.has("vstart") && (s.block = "start"), e.has("vcenter") && (s.block = "center"), e.has("vend") && (s.block = "end"), e.has("vnearest") && (s.block = "nearest"), ct(t, s, e.has("focus")), delete t.dataset[n], () => {
      };
    }
  };
  var at = document;
  var lt = !!at.startViewTransition;
  var fn = {
    prefix: "viewTransition",
    onGlobalInit() {
      let t = false;
      if (document.head.childNodes.forEach((e) => {
        e instanceof HTMLMetaElement && e.name === "view-transition" && (t = true);
      }), !t) {
        const e = document.createElement("meta");
        e.name = "view-transition", e.content = "same-origin", document.head.appendChild(e);
      }
    },
    onLoad: (t) => {
      if (!lt) {
        console.error("Browser does not support view transitions");
        return;
      }
      return t.reactivity.effect(() => {
        const { el: e, expressionFn: n } = t;
        let s = n(t);
        if (!s)
          return;
        const r = e.style;
        r.viewTransitionName = s;
      });
    }
  };
  var dn = [
    on,
    ln,
    cn,
    un,
    fn
  ];
  var hn = {
    scroll: async (t, e, n) => {
      const s = Object.assign(
        { behavior: "smooth", vertical: "center", horizontal: "center", shouldFocus: true },
        n
      ), r = document.querySelector(e);
      ct(r, s);
    }
  };
  function ct(t, e, n = true) {
    if (!(t instanceof HTMLElement || t instanceof SVGElement))
      throw new Error("Element not found");
    t.tabIndex || t.setAttribute("tabindex", "0"), t.scrollIntoView(e), n && t.focus();
  }
  var pn = "Content-Type";
  var mn = `${H}-request`;
  var gn = "application/json";
  var vn = "true";
  var bn = `${P}fragment`;
  var yn = `${P}signal`;
  var Fe = `${P}signal-ifmissing`;
  var G = `${P}indicator`;
  var ve = `${G}-loading`;
  var Ve = `${P}settling`;
  var X = `${P}swapping`;
  var wn = "self";
  var _n = "get";
  var En = "post";
  var Sn = "put";
  var Tn = "patch";
  var An = "delete";
  var Nn = ["selector", "merge", "settle", "fragment", "redirect", "error", "vt"];
  var M = {
    MorphElement: "morph_element",
    InnerElement: "inner_element",
    OuterElement: "outer_element",
    PrependElement: "prepend_element",
    AppendElement: "append_element",
    BeforeElement: "before_element",
    AfterElement: "after_element",
    DeleteElement: "delete_element",
    UpsertAttributes: "upsert_attributes"
  };
  var Ln = {
    prefix: "fetchIndicator",
    mustHaveEmptyKey: true,
    mustNotEmptyExpression: true,
    onGlobalInit: () => {
      const t = document.createElement("style");
      t.innerHTML = `
.${G}{
 opacity:0;
 transition: opacity 300ms ease-out;
}
.${ve} {
 opacity:1;
 transition: opacity 300ms ease-in;
}
`, document.head.appendChild(t);
    },
    onLoad: (t) => t.reactivity.effect(() => {
      t.upsertIfMissingFromStore("_dsPlugins.fetch.indicatorElements", {}), t.upsertIfMissingFromStore("_dsPlugins.fetch.indicatorsVisible", []);
      const e = t.reactivity.computed(() => `${t.expressionFn(t)}`), n = t.store(), s = document.querySelectorAll(e.value);
      if (s.length === 0)
        throw new Error("No indicator found");
      return s.forEach((r) => {
        r.classList.add(G);
      }), n._dsPlugins.fetch.indicatorElements[t.el.id] = t.reactivity.signal(s), () => {
        delete n._dsPlugins.fetch.indicatorElements[t.el.id];
      };
    })
  };
  var Mn = [Ln];
  async function kn(t, e, n, s = true) {
    const r = n.store();
    if (!e)
      throw new Error(`No signal for ${t} on ${e}`);
    let o = { ...r.value };
    s && (o = ie(o));
    const i = JSON.stringify(o), c = n.el;
    N(
      "plugin",
      "backend",
      "fetch_start",
      c,
      JSON.stringify({ method: t, urlExpression: e, onlyRemote: s, storeJSON: i })
    );
    const f = r?._dsPlugins?.fetch?.indicatorElements ? r._dsPlugins.fetch.indicatorElements[c.id]?.value || [] : [], m = r?._dsPlugins.fetch?.indicatorsVisible;
    f.forEach((a) => {
      if (!a || !m)
        return;
      const p = m.value.findIndex((y) => y ? a.isSameNode(y.el) : false);
      if (p > -1) {
        const y = m.value[p], h = [...m.value];
        delete h[p], m.value = [
          ...h.filter((g) => !!g),
          { el: a, count: y.count + 1 }
        ];
      } else
        a.classList.remove(G), a.classList.add(ve), m.value = [...m.value, { el: a, count: 1 }];
    });
    const l = new URL(e, window.location.origin);
    t = t.toUpperCase();
    const d = {
      method: t,
      headers: {
        [pn]: gn,
        [mn]: vn
      },
      onmessage: (a) => {
        if (a.event) {
          if (!a.event.startsWith(P)) {
            console.log(`Unknown event: ${a.event}`);
            debugger;
          }
        } else
          return;
        if (a.event === yn || a.event === Fe) {
          const p = ` return Object.assign({...ctx.store()}, ${a.data})`;
          try {
            const h = new Function("ctx", p)(n), g = et(
              n.store(),
              h,
              a.event === Fe
            );
            n.mergeStore(g), n.applyPlugins(document.body);
          } catch (y) {
            console.log(p), console.error(y);
            debugger;
          }
        } else {
          let p = "", y = "morph_element", h = false, g = "", w = 500, u = true;
          const v = a.event === bn, b = a.data.trim().split(`
`);
          let _ = "";
          for (let A = 0; A < b.length; A++) {
            let S = b[A];
            if (!S?.length)
              continue;
            const L = S.split(" ", 1)[0];
            if (Nn.includes(L) && L !== _)
              switch (_ = L, S = S.slice(L.length + 1), _) {
                case "selector":
                  g = S;
                  break;
                case "merge":
                  if (y = S, h = Object.values(M).includes(y), !h)
                    throw new Error(`Unknown merge option: ${y}`);
                  break;
                case "settle":
                  w = parseInt(S);
                  break;
                case "fragment":
                  break;
                case "redirect":
                  N("plugin", "backend", "redirect", "WINDOW", S), window.location.href = S;
                  return;
                case "error":
                  throw N("plugin", "backend", "error", "WINDOW", S), new Error(S);
                case "vt":
                  u = S === "true";
                  break;
                default:
                  throw new Error("Unknown data type");
              }
            _ === "fragment" && (p += S + `
`);
          }
          v && (p?.length || (p = "<div></div>"), Pn(n, g, y, p, w, u), N(
            "plugin",
            "backend",
            "merge",
            g,
            JSON.stringify({ fragment: p, settleTime: w, useViewTransition: u })
          ));
        }
      },
      onerror: (a) => {
        console.error(a);
      },
      onclose: () => {
        try {
          const a = n.store(), p = a?._dsPlugins?.fetch?.indicatorsVisible || [], y = a?._dsPlugins?.fetch?.indicatorElements ? a._dsPlugins.fetch.indicatorElements[c.id]?.value || [] : [], h = [];
          y.forEach((g) => {
            if (!g || !p)
              return;
            const w = p.value, u = w.findIndex((b) => b ? g.isSameNode(b.el) : false), v = w[u];
            v && (v.count < 2 ? (h.push(
              new Promise(
                () => setTimeout(() => {
                  g.classList.remove(ve), g.classList.add(G);
                }, 300)
              )
            ), delete w[u]) : u > -1 && (w[u].count = w[u].count - 1), p.value = w.filter((b) => !!b));
          }), Promise.all(h);
        } catch (a) {
          console.error(a);
          debugger;
        } finally {
          N("plugin", "backend", "fetch_end", c, JSON.stringify({ method: t, urlExpression: e }));
        }
      }
    };
    if (t === "GET") {
      const a = new URLSearchParams(l.search);
      a.append("datastar", i), l.search = a.toString();
    } else
      d.body = i;
    Ht(l, d);
  }
  var je = document.createElement("template");
  function Pn(t, e, n, s, r, o) {
    const { el: i } = t;
    je.innerHTML = s.trim();
    const c = je.content.firstChild;
    if (!(c instanceof Element))
      throw new Error("No fragment found");
    const f = e === wn;
    let m;
    if (f)
      m = [i];
    else {
      const a = e || `#${c.getAttribute("id")}`;
      if (m = document.querySelectorAll(a) || [], !m)
        throw new Error(`No targets found for ${a}`);
    }
    const l = [...m];
    if (!l.length)
      throw new Error(`No targets found for ${e}`);
    const d = (a) => {
      for (const p of a) {
        p.classList.add(X);
        const y = p.outerHTML;
        let h = p;
        switch (n) {
          case M.MorphElement:
            const w = Ut(h, c, {
              callbacks: {
                beforeNodeRemoved: (v, b) => (t.cleanupElementRemovals(v), true)
              }
            });
            if (!w?.length)
              throw new Error("No morph result");
            h = w[0];
            break;
          case M.InnerElement:
            h.innerHTML = c.innerHTML;
            break;
          case M.OuterElement:
            h.replaceWith(c);
            break;
          case M.PrependElement:
            h.prepend(c);
            break;
          case M.AppendElement:
            h.append(c);
            break;
          case M.BeforeElement:
            h.before(c);
            break;
          case M.AfterElement:
            h.after(c);
            break;
          case M.DeleteElement:
            setTimeout(() => h.remove(), r);
            break;
          case M.UpsertAttributes:
            c.getAttributeNames().forEach((v) => {
              const b = c.getAttribute(v);
              h.setAttribute(v, b);
            });
            break;
          default:
            throw new Error(`Unknown merge type: ${n}`);
        }
        t.cleanupElementRemovals(h), h.classList.add(X), t.applyPlugins(document.body), setTimeout(() => {
          p.classList.remove(X), h.classList.remove(X);
        }, r);
        const g = h.outerHTML;
        y !== g && (h.classList.add(Ve), setTimeout(() => {
          h.classList.remove(Ve);
        }, r));
      }
    };
    lt && o ? at.startViewTransition(() => d(l)) : d(l);
  }
  var $n = [_n, En, Sn, Tn, An].reduce(
    (t, e) => (t[e] = (n, s, r) => {
      const o = ["true", true, void 0].includes(r);
      kn(e, s, n, o);
    }, t),
    {
      isFetching: (t, e) => {
        const n = [...document.querySelectorAll(e)], r = t.store()?._dsPlugins?.fetch.indicatorsVisible?.value || [];
        return n.length ? n.some((o) => r.filter((i) => !!i).some((i) => i.el.isSameNode(o) && i.count > 0)) : false;
      }
    }
  );
  var Be = "0.18.4";
  var _e = (t, e, n, s, r, o) => (e - n) / (s - n) * (o - r) + r;
  var On = (t, e, n, s, r, o) => Math.round(_e(t, e, n, s, r, o));
  var ut = (t, e, n, s, r, o) => Math.max(r, Math.min(o, _e(t, e, n, s, r, o)));
  var In = (t, e, n, s, r, o) => Math.round(ut(t, e, n, s, r, o));
  var Rn = {
    setAll: (t, e, n) => {
      const s = new RegExp(e);
      t.walkSignals((r, o) => s.test(r) && (o.value = n));
    },
    toggleAll: (t, e) => {
      const n = new RegExp(e);
      t.walkSignals((s, r) => n.test(s) && (r.value = !r.value));
    },
    clipboard: (t, e) => {
      if (!navigator.clipboard)
        throw new Error("Clipboard API not available");
      navigator.clipboard.writeText(e);
    },
    fit: _e,
    fitInt: On,
    clampFit: ut,
    clampFitInt: In
  };
  function Cn(t = {}, ...e) {
    const n = new Nt(t, ...e);
    return n.run(), n;
  }
  function Dn(t = {}, ...e) {
    const n = Object.assign(
      {},
      Rn,
      Rt,
      $n,
      hn,
      t
    ), s = [...Mn, ...dn, ...It, ...e];
    return Cn(n, ...s);
  }
  var Hn = {
    bubbles: true,
    cancelable: true,
    composed: true
  };
  var be = window;
  var N = (t, e, n, s, r, o = Hn) => {
    be.dispatchEvent(
      new CustomEvent(
        j,
        Object.assign(
          {
            detail: {
              time: /* @__PURE__ */ new Date(),
              category: t,
              subcategory: e,
              type: n,
              target: Qe(s),
              message: r
            }
          },
          o
        )
      )
    );
  };
  be.ds || setTimeout(() => {
    N("core", "init", "start", document.body, `Datastar v${Be} loading`);
    const t = performance.now();
    be.ds = Dn();
    const e = performance.now();
    N(
      "core",
      "init",
      "end",
      document.body,
      `Datastar v${Be} loaded and attached to all DOM elements in ${(e - t).toFixed(2)}ms`
    );
    const n = document.createElement("style");
    n.innerHTML = `
.datastar-inspector-highlight {
 border: 2px solid blue;
}
`, document.head.appendChild(n), window.addEventListener("datastar-inspector-event", (s) => {
      if ("detail" in s && typeof s.detail == "object" && s.detail) {
        const { detail: r } = s;
        if ("script" in r && typeof r.script == "string")
          try {
            new Function(r.script)();
          } catch (o) {
            console.error(o);
          }
      }
    });
  }, 0);

  // views/ts/index.ts
  Dn();
})();

import { jsx as v, jsxs as H, Fragment as ae } from "react/jsx-runtime";
import { useMemo as G, useRef as R, createContext as se, useCallback as h, useEffect as L, useContext as ce, useState as ie, forwardRef as le, useImperativeHandle as ue, memo as C, Fragment as ye } from "react";
import { Globe as fe, BeautifulObjectLayer as de, ConstellationLayer as F, TouchLayer as Le, RollLayer as me, ZoomLayer as be, PanLayer as he, EsoMilkyWayLayer as ge, Layer as N, GridLayer as pe, HipparcosCatalogLayer as ve, hips as we, MarkerLayer as Ce, ClickableMarkerLayer as ke, PathLayer as j, overlayAlpha as $e, TextLayer as Me, TractTileLayer as E, glMatrix as xe } from "@stellar-globe/stellar-globe";
function q(e) {
  const t = G(e, []);
  return R(t).current;
}
function Re() {
  return R({}).current;
}
function Ge({
  jsdomTest: e,
  projection: t = "STEREOGRAPHIC",
  retina: o = !1,
  preserveBuffer: s,
  noDefaultLayers: i,
  cameraParams: c,
  onInit: r,
  onRelease: l
}) {
  const d = R(null), n = q(() => ({
    globe: void 0,
    layers: /* @__PURE__ */ new Map(),
    layerFactories: /* @__PURE__ */ new Map()
  })), a = R({
    retina: o,
    noDefaultLayers: i,
    cameraParams: c,
    projection: t
  }), { layers: u, layerFactories: f } = n, p = h((y, m, b, M) => {
    if (n.globe) {
      const x = M(n.globe);
      u.set(y, { layer: x, el: m }), b && n.globe.addLayer(x);
    } else
      f.set(y, { factory: M, el: m, visible: b });
  }, [f, u, n]), w = h((y, m) => {
    const b = /* @__PURE__ */ new Map();
    for (const [, { el: M, layer: x }] of u)
      b.set(x, M);
    return Pe(b.get(y), b.get(m));
  }, [u]);
  return L(function() {
    n.globe && n.globe.camera.jumpTo({ mode: t });
  }, [t, n]), L(function() {
    n.globe && n.globe.camera.setRetina(o);
  }, [o, n]), L(function() {
    n.globe && c && (Object.assign(n.globe.camera, Fe(c)), n.globe.requestRefresh());
  }, [c, n.globe]), L(function() {
    const m = new fe(d.current, {
      jsdomTest: e,
      preserveBuffer: s,
      viewOptions: {
        ...a.current.cameraParams,
        retina: a.current.retina,
        mode: a.current.projection
      },
      noDefaultLayers: a.current.noDefaultLayers
    });
    r == null || r(m), m.layerSorter.setSortFunc(w), n.globe = m;
    for (const [b, { factory: M, el: x, visible: T }] of f)
      p(b, x, T, M);
    return f.clear(), () => {
      for (const [, { layer: b }] of Array.from(u).reverse())
        b.release();
      if (u.clear(), l == null || l(m), m.release(), f.size > 0)
        throw console.error(f), new Error("layerFactories is not empty");
      n.globe = void 0;
    };
  }, [w, e, f, u, r, l, s, p, n]), G(() => ({
    state: n,
    containerRef: d,
    registerLayer: p
  }), [p, n]);
}
const W = se(void 0);
function Z() {
  const e = ce(W);
  if (e === void 0)
    throw new Error("use of useGlobeContext outside <$Globe />");
  return e;
}
function Oe() {
  const e = Z();
  return h(() => {
    if (e.state.globe === void 0)
      throw new Error("globe has not been set up yet");
    return e.state.globe;
  }, [e]);
}
function k(e, t) {
  const o = Re(), { state: s, registerLayer: i } = Z(), { layerFactories: c, layers: r } = s, l = R(null);
  L(function() {
    const a = r.get(o);
    if (a) {
      const { layer: u } = a;
      t ? u.globe.addLayer(u) : u.globe.removeLayer(u);
    }
  }, [o, r, t]), L(
    function() {
      return i(o, l.current, t, e), () => {
        c.delete(o), r.has(o) && (r.get(o).layer.release(), r.delete(o));
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      e,
      o,
      c,
      r,
      i
    ]
  );
  const d = h((n) => {
    const a = r.get(o);
    if (a) {
      const { layer: u } = a;
      return n(u);
    }
  }, [o, r]);
  return {
    node: /* @__PURE__ */ v("div", { ref: l }),
    ifLayerReady: d
  };
}
function $(e, t) {
  return (o) => {
    const { [t]: s = !0, ...i } = o, c = h(
      (l) => e(l, o),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...Object.keys(i), ...Object.values(i)]
    ), { node: r } = k(c, s);
    return r;
  };
}
function Te(e, t) {
  return function(s) {
    const { [t]: i = !0 } = s, [c, r] = ie(i);
    return L(() => {
      i && r(!0);
    }, [i]), c && /* @__PURE__ */ v(e, { ...s });
  };
}
function g(e) {
  for (const t of Object.keys(e))
    e[t].displayName = t;
}
function Pe(e, t) {
  if (e && t) {
    const s = e.compareDocumentPosition(t);
    return (s & 2) !== 0 ? 1 : (s & 4) !== 0 ? -1 : 0;
  }
  const o = 1;
  return e ? o : t ? -o : 0;
}
function Fe(e) {
  const { theta: t, phi: o, za: s, zd: i, zp: c, fovy: r, roll: l } = e;
  return { theta: t, phi: o, za: s, zd: i, zp: c, fovy: r, roll: l };
}
const B = le(function({
  children: t,
  ...o
}, s) {
  const i = Ge(o), { containerRef: c, state: { globe: r } } = i;
  return ue(s, () => () => i.state.globe, [i.state]), L(() => {
    r == null || r.layerSorter.sort();
  }), /* @__PURE__ */ v(W.Provider, { value: i, children: /* @__PURE__ */ v("div", { ref: c, style: { height: "100%", position: "relative" }, children: t }) });
});
g({ Globe: B });
const qe = B, We = C(function({
  min: t,
  max: o,
  a: s = 1,
  nStep: i = 1e4,
  value: c,
  onInput: r,
  className: l,
  style: d
}) {
  const n = (y) => Math.sinh(s * y) / Math.sinh(s), a = h((y) => Math.asinh(y * Math.sinh(s)) / s, [s]), u = G(() => a(t), [a, t]), f = G(() => a(o), [a, o]), p = G(() => (a(c) - u) / (f - u) * i, [a, i, c, f, u]), w = (y) => {
    const m = y / i, b = u + m * (f - u);
    r(n(b));
  };
  return /* @__PURE__ */ v(
    "input",
    {
      type: "range",
      min: 0,
      max: i,
      step: 1,
      value: p,
      onChange: (y) => w(Number(y.target.value)),
      className: l,
      style: d
    }
  );
}), O = $((e, { which: t }) => new de(e, t), "visible"), D = C(({ visible: e }) => /* @__PURE__ */ H(ae, { children: [
  /* @__PURE__ */ v(O, { visible: e, which: "m31" }),
  /* @__PURE__ */ v(O, { visible: e, which: "m42" }),
  /* @__PURE__ */ v(O, { visible: e, which: "m45" }),
  /* @__PURE__ */ v(O, { visible: e, which: "m101" }),
  /* @__PURE__ */ v(O, { visible: e, which: "perseus" })
] }));
g({ BeautifulObjectLayer: D });
const Ze = D, A = C((e) => {
  const { visible: t = !0, ...o } = { ...F.defaultOptions(), ...e }, {
    lang: s,
    nameColor: i,
    nameFont: c,
    showLines: r,
    showNames: l
  } = o, d = h((u) => new F(u, o), [s, i, c]), { node: n, ifLayerReady: a } = k(d, t);
  return L(() => {
    a((u) => {
      u.showLines = r, u.showNames = l, u.globe.requestRefresh();
    });
  }, [a, r, l]), n;
});
g({ ConstellationLayer: A });
const Be = A, V = $((e) => new he(e), "enabled"), I = $((e) => new be(e), "enabled"), U = $((e) => new me(e), "enabled"), K = $((e) => new Le(e), "enabled");
g({ PanLayer: V, ZoomLayer: I, RollLayer: U, TouchLayer: K });
const De = V, Ae = I, Ve = U, Ie = K, X = $((e, t) => new ge(e, t), "visible");
g({ EsoMilkyWayLayer: X });
const Ue = X;
class je extends N {
}
const P = {
  onPointerDown: "pointer-down",
  onPointerUp: "pointer-up",
  onPointerMove: "pointer-move",
  onCameraModeChange: "camera-mode-change",
  onCameraMoveStart: "camera-move-start",
  onCameraMove: "camera-move",
  onCameraMoveEnd: "camera-move-end",
  onImageLoaded: "imageloadend",
  onResize: "resize"
}, Y = C((e) => {
  const t = q(() => /* @__PURE__ */ new Map()), o = (r, l) => {
    var n;
    (n = t.get(l)) == null || n(), t.delete(l);
    const d = e[l];
    if (d) {
      const a = r.on(P[l], d);
      t.set(l, a);
    }
  }, s = h(
    (r) => {
      for (const l of Object.keys(P))
        o(r, l);
      return new je(r);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  ), { node: i, ifLayerReady: c } = k(s, !0);
  for (const r of Object.keys(P))
    L(
      () => {
        c((l) => o(l.globe, r));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [e[r]]
    );
  return i;
});
g({ GlobeEventLayer: Y });
const Ke = Y, _ = $(
  (e, { optionsManipulate: t }) => new pe(e, t),
  "visible"
);
g({ GridLayer: _ });
const Xe = _, J = $(
  (e) => new ve(e),
  "visible"
);
g({ HipparcosCatalogLayer: J });
const Ye = J, Q = $(
  (e, { baseUrl: t, animationLod: o }) => new we.SimpleImageLayer(e, t, { animationLod: o }),
  "visible"
);
g({ HipsSimpleLayer: Q });
const _e = Q, ee = C((e) => {
  const { visible: t = !0, ...o } = e, s = h((f) => new Ce(f, o), []), { node: i, ifLayerReady: c } = k(s, t), { defaultColor: r, defaultType: l, markers: d, baseColor: n, markerSize: a, markerWidth: u } = o;
  return L(() => {
    c((f) => {
      f.update({ defaultColor: r, defaultType: l, markers: d, markerSize: a, markerWidth: u });
    });
  }, [r, l, c, a, u, d]), L(() => {
    c((f) => {
      f.baseColor = n, f.globe.requestRefresh();
    });
  }, [n, c]), i;
});
g({ MarkerLayer: ee });
const Je = ee, te = C((e) => {
  const { visible: t = !0, ...o } = e, s = h((y) => new ke(y, o), []), { node: i, ifLayerReady: c } = k(s, t), { defaultColor: r, defaultType: l, markers: d, dimmAlpha: n, onClick: a, onHoverChange: u, baseColor: f, markerSize: p, markerWidth: w } = o;
  return L(() => {
    c((y) => {
      y.update({ defaultColor: r, defaultType: l, markers: d, markerSize: p, markerWidth: w });
    });
  }, [r, l, c, d, n, p, w]), L(() => {
    c((y) => {
      y.dimmAlpha = n, y.baseColor = f, y.onClick = a, y.onHoverChange = u, y.globe.requestRefresh();
    });
  }, [f, n, c, a, u]), i;
});
g({ ClickableMarkerLayer: te });
const Qe = te, oe = C((e) => {
  const { visible: t = !0, ...o } = e, s = h((a) => new j(a, o), []), { node: i, ifLayerReady: c } = k(s, t), { paths: r, blendMode: l, dimOnZoom: d, darkenNarrowLine: n } = o;
  return L(() => {
    c((a) => {
      a.paths = r;
    });
  }, [c, r]), L(() => {
    c((a) => {
      const u = j.defaultOptions();
      a.blendeMode = l ?? u.blendMode, a.dimOnZoom = d ?? u.dimOnZoom, a.darkenNarrowLine = n ?? u.darkenNarrowLine;
    });
  }, [l, n, d, c]), i;
});
g({ PathLayer: oe });
const et = oe, re = C((e) => {
  const { visible: t = !0, ...o } = e, {
    defaultColor: s,
    defaultFont: i,
    texts: c,
    alphaFunc: r = $e
  } = o, l = h((a) => new Me(a, o), []), { node: d, ifLayerReady: n } = k(l, t);
  return L(() => {
    n((a) => {
      a.update({
        texts: c,
        defaultColor: s ?? null,
        defaultFont: s ?? null
      });
    });
  }, [n, c, s, i]), L(() => {
    n((a) => {
      a.alphaFunc = r, a.globe.requestRefresh();
    });
  }, [r, n]), d;
});
g({ TextLayer: re });
const tt = re;
function ot() {
  return 1;
}
const ne = Te(C((e) => {
  const {
    baseUrl: t,
    colorParams: o = E.defaultParams({ type: "sdssTrueColor" }),
    outline: s = !1,
    visible: i = !0,
    magFilter: c = "linear",
    filterNameDictionary: r
  } = e, l = h(
    (a) => new E(a, {
      ...e,
      colorParams: S(o, r)
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  ), { node: d, ifLayerReady: n } = k(l, i);
  return L(() => {
    n((a) => {
      a.outline = s, a.globe.requestRefresh();
    });
  }, [n, s]), L(() => {
    n((a) => {
      a.setParams(S(o, r));
    });
  }, [o, r, n]), L(() => {
    n((a) => {
      a.setMagFilter(c);
    });
  }, [n, c]), d;
}), "visible");
g({ TractTileLayer: ne });
const rt = ne;
function S(e, t) {
  if (t) {
    const o = e.filters.map((s) => t[s] ?? s);
    return { ...e, filters: o };
  }
  return e;
}
const { vec4: z } = xe;
class Ee extends N {
  constructor(t, o) {
    super(t), this.shared = o;
  }
  render(t) {
    const s = z.transformMat4(z.create(), [...this.shared.position, 1], t.mvp.pv), i = s[0] / s[3], c = s[1] / s[3], r = s[2] / s[3], l = -1 <= i && i <= 1 && -1 <= c && c <= 1 && -1 <= r && r <= 1;
    this.shared.onProject({
      x: i,
      y: c,
      visible: l
    });
  }
}
function Se({
  children: e,
  position: t,
  offset: o = [0, 0],
  visible: s = !0
}) {
  const i = Oe(), c = h(({ visible: f, x: p, y: w }) => {
    if (u.current)
      if (f) {
        const y = i(), { width: m, height: b } = y.gl.canvas.getBoundingClientRect(), M = `${m * (p + 1) / 2 + o[0]}px`, x = `${b * (1 - (w + 1) / 2) + o[1]}px`, T = `translateX(${M}) translateY(${x})`;
        Object.assign(u.current.style, {
          display: "block",
          left: 0,
          top: 0,
          transform: T
        });
      } else
        Object.assign(u.current.style, {
          display: "none"
        });
  }, [i, o]), r = R({ position: t, onProject: c }), l = h((f) => new Ee(f, r.current), []), { node: d, ifLayerReady: n } = k(l, s), a = G(() => ({ position: t, onProject: c }), [c, t]);
  L(() => {
    n((f) => {
      f.shared = a, f.globe.requestRefresh();
    });
  }, [n, a]);
  const u = R(null);
  return /* @__PURE__ */ H(ye, { children: [
    d,
    /* @__PURE__ */ v("div", { ref: u, style: {
      position: "absolute"
    }, children: e })
  ] });
}
const nt = Se;
export {
  D as BeautifulObjectLayer,
  Ze as BeautifulObjectLayer$,
  te as ClickableMarkerLayer,
  Qe as ClickableMarkerLayer$,
  A as ConstellationLayer,
  Be as ConstellationLayer$,
  Se as DomLayer,
  nt as DomLayer$,
  X as EsoMilkyWayLayer,
  Ue as EsoMilkyWayLayer$,
  B as Globe,
  qe as Globe$,
  Y as GlobeEventLayer,
  Ke as GlobeEventLayer$,
  _ as GridLayer,
  Xe as GridLayer$,
  J as HipparcosCatalogLayer,
  Ye as HipparcosCatalogLayer$,
  Q as HipsSimpleLayer,
  _e as HipsSimpleLayer$,
  We as LogScaleRange,
  ee as MarkerLayer,
  Je as MarkerLayer$,
  V as PanLayer,
  De as PanLayer$,
  oe as PathLayer,
  et as PathLayer$,
  U as RollLayer,
  Ve as RollLayer$,
  re as TextLayer,
  tt as TextLayer$,
  K as TouchLayer,
  Ie as TouchLayer$,
  ne as TractTileLayer,
  rt as TractTileLayer$,
  I as ZoomLayer,
  Ae as ZoomLayer$,
  ot as alwaysOne,
  $ as makePureLayerComponent,
  Te as mountOndemand,
  Oe as useGetGlobe,
  k as useLayerBind
};
//# sourceMappingURL=react-stellar-globe.es.js.map

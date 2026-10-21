// ==========================================================================
// The valley in 3D, drawn from the simulation, on What the Water Brings' renderer.
//
// Built the way What the Water Brings builds its valley (PKValley): the ground in 32 m tiles
// (a height grid with a paint per cell, one material per paint), water as ribbons along the
// channels with their flow, depth and shore, plants and stones as merged batches, near tiles
// at full detail streamed within a time budget, and a light far version of every tile always
// there. The difference: nothing here is fixed. The ground's shape comes from the creek model,
// its colour from the water table (green, straw, dust; marsh; worn paths), the water from each
// creek point's own level and the floor's water table, the trees and stones from the
// simulation's plants and materials, the homes and dams from what the creekfolk have built.
// Tiles rebuild when what they show has changed.
//
// Coordinates are the simulation's: x across the valley (0..VW), z along it (0..VL, the creek
// flows toward +z), y up, metres.
// ==========================================================================

var CF2Valley = (function () {
  // ---- paints (shadow, mid, light) --------------------------------------------
  var PAINT = {
    grass: ["#557f48", "#6e9c5b", "#8fb86f"],
    grassL: ["#6e9c5b", "#8fb86f", "#a3c47e"],
    grassD: ["#3f6b3f", "#4f7f4a", "#5f9255"],
    straw: ["#8a8146", "#ab9f5c", "#c8bd7a"],
    strawL: ["#a3975a", "#c4b674", "#ddd296"],
    dust: ["#86704e", "#a48a62", "#bfa67c"],
    marsh: ["#3e5a44", "#4f7052", "#668a62"],
    mud: ["#6a5238", "#8a6c48", "#a8895f"],
    clay: ["#6b4a33", "#8f6a48", "#a8845c"],
    gravel: ["#9a8a70", "#bfae8c", "#d9cba8"],
    bed: ["#3f5a5a", "#4a6a6a", "#5a7a78"],
    lime: ["#9b968a", "#c2bcae", "#dedad0"],
    limeD: ["#86806f", "#a8a290", "#c4bea8"],
    limeBed: ["#b4ae9e", "#d4cebe", "#ece8dc"],
    moss: ["#3a5a30", "#4f7a3e", "#6a9a4e"],
    path: ["#8f7650", "#b59a6d", "#cfb889"],
    pathE: ["#6e7a4a", "#8f9a5e", "#aab47a"],
    soil: ["#4e3a28", "#6a503a", "#86684c"],
    water: ["#3f6f8a", "#5d93ad", "#86b6c6"],
    waterC: ["#3f8a92", "#62aab2", "#94d0d2"],
    pond: ["#465f4a", "#5c7c5e", "#7c9c7a"],
    mudW: ["#6a5238", "#8a6c48", "#a8895f"],
    trunk: ["#4a3828", "#6b4a33", "#8f7650"],
    syc: ["#a59f92", "#cfc9bc", "#ece8de"],
    oak: ["#2f5233", "#3f6b3f", "#4f7f4a"],
    oak2: ["#3f6b3f", "#4f7f4a", "#5f9255"],
    elm: ["#47703f", "#5f9255", "#8fb86f"],
    cedar: ["#24402f", "#2f5a3e", "#3f7050"],
    willow: ["#55703a", "#708e48", "#90aa60"],
    pecan: ["#3a5a35", "#4f7444", "#6a8e52"],
    gold: ["#a8642a", "#d08a36", "#e8b050"],
    bush: ["#2f5233", "#47703f", "#5f9255"],
    berry: ["#6a1e34", "#9a2e48", "#c84a64"],
    blue: ["#2a3a6a", "#3e5694", "#6a82be"],
    reed: ["#47703f", "#6e9c5b", "#8fb86f"],
    cattail: ["#4a3828", "#6b4a33", "#6b4a33"],
    rock: ["#5f625f", "#8d8f8a", "#b2b3ab"],
    wood: ["#6a4c34", "#8d6646", "#a8836a"],
    post: ["#5a4a3a", "#7a6450", "#9a8268"],
    weave: ["#5e5030", "#7e6c40", "#9e8a58"],
    thatch: ["#8a7442", "#b0985a", "#d0ba78"],
    mudwall: ["#7a6044", "#9a7c58", "#b89a70"],
    tile: ["#7a3a2a", "#a24e38", "#c06a4e"],
    stone: ["#6a6a64", "#908e86", "#b2b0a6"],
    pod: ["#6a5a2a", "#8e7a3a", "#b29c52"],
    glow: ["#8ac8a8", "#bff0d6", "#eafff4"],
    foam: ["#d4e9ec", "#eef6f6", "#eef6f6"],
    fblue: ["#3d63b8", "#6f8fd8", "#6f8fd8"],
    fred: ["#b2361f", "#d2402f", "#ea7a2a"],
    fyel: ["#c08f3e", "#efc067", "#fde4a2"],
    fern: ["#2f5233", "#3f6b3f", "#5f9255"],
    mush: ["#bfae8c", "#d9cba8", "#efe6cc"],
    stem: ["#cdbf9e", "#efe6cc", "#fffaf0"],
    leafR: ["#7e3f1c", "#a55727", "#c87038"],
    tuftS: ["#8a8146", "#b3a35e", "#d0c27e"],
    // overlays (dev): wetness, worn paths, stages, land capacity
    ovA: ["#7a5032", "#7a5032", "#7a5032"],
    ovB: ["#c8a050", "#c8a050", "#c8a050"],
    ovC: ["#50a0c8", "#50a0c8", "#50a0c8"],
    ovD: ["#2858c0", "#2858c0", "#2858c0"],
    ovE: ["#c04838", "#c04838", "#c04838"],
    ovF: ["#e0c040", "#e0c040", "#e0c040"],
    ovG: ["#60b050", "#60b050", "#60b050"],
  };
  var FOAM = { water: "#eef6f6", waterC: "#eef6f6", pond: "#b4ccb0", mudW: "#d9cba8" };
  var REFL = { water: "#a9ccd8", waterC: "#acdad8", pond: "#a2c2c4", mudW: "#9caaa8" };
  var VARY = { grass: 0.12, grassL: 0.11, grassD: 0.11, straw: 0.1, strawL: 0.1, dust: 0.1, marsh: 0.12, path: 0.08, pathE: 0.1, clay: 0.07, gravel: 0.08, bed: 0.08, lime: 0.05, limeBed: 0.06, moss: 0.1, soil: 0.08, mud: 0.08 };
  var SWAYK = { oak: 0.45, oak2: 0.3, elm: 0.45, pecan: 0.45, gold: 0.45, cedar: 0.2, willow: 0.6, bush: 0.3 };
  var mats = {};
  // canopies and roofs open a round hole round the creekfolk being followed, when they stand
  // between it and the camera (screen space; What the Water Brings does this for the king)
  var CUT = { p: { value: new THREE.Vector2(9, 9) }, z: { value: 0 }, r: { value: 0.0 }, res: { value: new THREE.Vector2(1, 1) }, a: { value: 1 } };
  function cutout(m) {
    var base = m.onBeforeCompile;
    m.onBeforeCompile = function (sh, r) {
      base.call(this, sh, r);
      sh.uniforms.uCutP = CUT.p;
      sh.uniforms.uCutZ = CUT.z;
      sh.uniforms.uCutR = CUT.r;
      sh.uniforms.uCutRes = CUT.res;
      sh.uniforms.uCutA = CUT.a;
      sh.fragmentShader =
        "uniform vec2 uCutP; uniform float uCutZ; uniform float uCutR; uniform vec2 uCutRes; uniform float uCutA;\n" +
        sh.fragmentShader.replace("void main() {", "void main() {\n  vec2 cutN = gl_FragCoord.xy / uCutRes * 2.0 - 1.0;\n  if (gl_FragCoord.z < uCutZ && length((cutN - uCutP) * vec2(uCutA, 1.0)) < uCutR) discard;");
    };
    var key0 = m.customProgramCacheKey.call(m);
    m.customProgramCacheKey = function () {
      return key0 + "|cf2-cut";
    };
  }
  function paint(key, o) {
    o = o || {};
    var id = key + (o.flat ? ":f" : "") + (o.cut ? ":c" : "") + (o.side ? ":d" : "") + (o.soft ? ":s" : "") + (o.glow ? ":g" : "") + (o.earth ? ":e" : "") + (o.sway ? ":w" : "") + (o.water ? ":a" : "");
    if (mats[id]) return mats[id];
    var t = PAINT[key];
    if (!t) throw new Error("no paint " + key);
    var wat = !!o.water;
    if (wat && REFL[key]) t = [t[0], t[1], REFL[key]];
    var m = PKToon.rampMat(t[0], t[1], t[2], { flat: o.flat, side: o.side ? THREE.DoubleSide : undefined, sway: !!o.sway, vary: o.earth ? VARY[key] || 0 : 0, water: wat, foam: FOAM[key] || "#eef6f6", spark: "#fff6d0" });
    if (o.soft) m.opacity = 0.5; // the pixel pass draws no ink outline round it
    if (o.glow) m.opacity = 0.25; // no outline, and night does not darken it
    if (o.cut) cutout(m);
    m.name = "CF2_" + id;
    mats[id] = m;
    return m;
  }
  function palette() {
    var out = [];
    for (var k in PAINT) out.push.apply(out, PAINT[k]);
    for (var f in FOAM) out.push(FOAM[f]);
    for (var r in REFL) out.push(REFL[r]);
    out.push("#fff6d0", "#3a2c20");
    return out;
  }

  // ---- small geometry helpers (from What the Water Brings) ------------------------
  function rnd(seed) {
    seed = seed >>> 0;
    return function () {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }
  function hash2(x, z) {
    var h = (x * 374761393 + z * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return (h ^ (h >>> 16)) >>> 0;
  }
  function sst(a, b, x) {
    var t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }
  var _m4 = new THREE.Matrix4(),
    _q = new THREE.Quaternion(),
    _e = new THREE.Euler(),
    _s = new THREE.Vector3(),
    _p = new THREE.Vector3();
  function bake(geo, x, y, z, rx, ry, rz, sx, sy, sz) {
    var g = geo.index ? geo.toNonIndexed() : geo.clone();
    if (g.attributes.uv) g.deleteAttribute("uv");
    _e.set(rx || 0, ry || 0, rz || 0);
    _q.setFromEuler(_e);
    _s.set(sx == null ? 1 : sx, sy == null ? (sx == null ? 1 : sx) : sy, sz == null ? (sx == null ? 1 : sx) : sz);
    _p.set(x, y, z);
    _m4.compose(_p, _q, _s);
    g.applyMatrix4(_m4);
    return g;
  }
  function merge(list, sway, s0) {
    var n = 0;
    list.forEach(function (g) {
      n += g.attributes.position.count;
    });
    var pos = new Float32Array(n * 3),
      nor = new Float32Array(n * 3),
      sw = sway ? new Float32Array(n) : null,
      o = 0;
    list.forEach(function (g) {
      var a = g.attributes.position.array,
        c = g.attributes.position.count;
      pos.set(a, o * 3);
      if (g.attributes.normal) nor.set(g.attributes.normal.array, o * 3);
      if (sw) {
        var y0 = 1e9,
          y1 = -1e9,
          i;
        for (i = 0; i < c; i++) {
          var y = a[i * 3 + 1];
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
        var hh = Math.max(0.01, y1 - y0);
        for (i = 0; i < c; i++) sw[o + i] = (s0 || 0) + ((1 - (s0 || 0)) * (a[i * 3 + 1] - y0)) / hh;
      }
      o += c;
      g.dispose();
    });
    var out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    if (sw) out.setAttribute("sway", new THREE.BufferAttribute(sw, 1));
    out.computeBoundingSphere();
    return out;
  }
  function Batch() {
    this.parts = {};
  }
  Batch.prototype.add = function (key, g) {
    (this.parts[key] = this.parts[key] || []).push(g);
  };
  Batch.prototype.build = function (grp, opt) {
    for (var key in this.parts) {
      var k = key.split("|"),
        sw = SWAYK[k[0]],
        m = new THREE.Mesh(merge(this.parts[key], sw != null, sw), paint(k[0], { flat: k[1] === "f", cut: k[2] === "c", sway: sw != null, glow: k[1] === "g", soft: k[1] === "s" }));
      m.castShadow = !(opt && opt.noShadow);
      m.receiveShadow = true;
      m.name = "Batch_" + key;
      grp.add(m);
    }
    this.parts = {};
  };
  function lumpy(g, amp, RN) {
    var P = g.attributes.position,
      a = RN() * 6,
      b = RN() * 6,
      c = RN() * 6;
    for (var q = 0; q < P.count; q++) {
      var x = P.getX(q),
        y = P.getY(q),
        z = P.getZ(q),
        l = Math.sqrt(x * x + y * y + z * z) || 1,
        nx = x / l,
        ny = y / l,
        nz = z / l,
        f = 1 + amp * (1.6 * Math.sin(3.1 * nx + a) * Math.sin(2.7 * ny + b) * Math.sin(3.3 * nz + c) + 0.35 * Math.sin(7.3 * nx + 5.1 * nz + a + b));
      P.setXYZ(q, x * f, y * f, z * f);
    }
    g.computeVertexNormals();
    return g;
  }
  var box = (w, h, d) => new THREE.BoxGeometry(w, h, d),
    cyl = (rt, rb, h, n) => new THREE.CylinderGeometry(rt, rb, h, n || 8);

  // ---- the valley ------------------------------------------------------------------
  var TILE = 32,
    TX0 = -4,
    TX1 = Math.ceil(VW / TILE) + 4,
    TZ0 = -3,
    TZ1 = Math.ceil(VL / TILE) + 3;
  var TYPES = ["grass", "grassL", "grassD", "straw", "strawL", "dust", "marsh", "mud", "clay", "gravel", "bed", "lime", "limeD", "limeBed", "moss", "path", "pathE", "soil", "ovA", "ovB", "ovC", "ovD", "ovE", "ovF", "ovG"];
  var TI = {};
  TYPES.forEach((t, i) => (TI[t] = i));

  function create(vw, opts) {
    opts = opts || {};
    var T = vw.T,
      grp = new THREE.Group(),
      W = { group: grp, overlay: null, detail: clamp(opts.detail || 3, 1, 6) };
    grp.name = "Valley";
    var landMats = TYPES.map((t) => paint(t, { earth: true }));
    var FARG = new THREE.Group(),
      NEARG = new THREE.Group(),
      THINGS = new THREE.Group();
    FARG.name = "Far";
    NEARG.name = "Near";
    THINGS.name = "Things";
    grp.add(FARG, NEARG, THINGS);
    // solid earth under everything, so a view cut open shows soil, not sky
    var fl = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200).rotateX(-Math.PI / 2), paint("soil", { side: true }));
    fl.position.set(VW / 2, -6, VL / 2);
    grp.add(fl);

    // the ground's height: smooth (Catmull-Rom over the simulation's 1 m grid) inside the
    // valley, the simulation's own height function outside it
    var H = () => T.h,
      N1 = VW + 1;
    function cr(p0, p1, p2, p3, t) {
      return p1 + 0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)));
    }
    // past the valley the simulation's hills keep rising without end; drawn, they round off
    // into wooded ridges a few tens of metres high (inside the valley they are never this high)
    function hillCap(h) {
      return h < 32 ? h : 32 + 14 * (1 - Math.exp(-(h - 32) / 14));
    }
    function height(x, z) {
      if (x < 1 || z < 1 || x > VW - 1 || z > VL - 1) {
        if (x >= 0 && z >= 0 && x <= VW && z <= VL) return T.heightAt(x, z);
        return hillCap(T.heightRaw(x, z));
      }
      var h = H(),
        ix = Math.floor(x),
        iz = Math.floor(z),
        fx = x - ix,
        fz = z - iz,
        r = [];
      for (var j = -1; j <= 2; j++) {
        var zz = clamp(iz + j, 0, VL) * N1;
        r.push(cr(h[zz + clamp(ix - 1, 0, VW)], h[zz + ix], h[zz + clamp(ix + 1, 0, VW)], h[zz + clamp(ix + 2, 0, VW)], fx));
      }
      var v = cr(r[0], r[1], r[2], r[3], fz),
        lo = Math.min(r[1], r[2]) - 0.15;
      return v < lo ? lo : v; // no dips below the grid (they would hold water that isn't there)
    }
    W.height = height;

    // what the ground is at (x, z), from the simulation's state
    var G = () => vw.grids,
      soilWet = () => (vw.soil != null ? vw.soil : 0.7);
    function nodeAt(z) {
      var ns = vw.nodes,
        f = clamp((z - CREEK.z0) / CREEK.ds, 0, ns.length - 1.0001),
        i = Math.floor(f);
      return ns[f - i < 0.5 ? i : i + 1];
    }
    function noiseN(x, z) {
      return Math.sin(x * 0.37 + 1.3) * Math.cos(z * 0.41 - 0.6) + 0.6 * Math.sin(x * 0.11 - z * 0.19);
    }
    function grassBy(gr, x, z) {
      // green, straw, dust: where the ground stands between two, a fine dither of both, so
      // the change reads as pixels rather than blocks
      var d = (hash2(Math.floor(x * 3), Math.floor(z * 3)) % 1000) / 1000 - 0.5,
        n = noiseN(x * 0.5, z * 0.5),
        g = gr + 0.1 * d + 0.06 * n;
      if (g > 0.66) return n > 1.0 ? TI.grassL : n < -1.1 ? TI.grassD : TI.grass;
      if (g > 0.42) return TI.strawL;
      if (g > 0.24) return TI.straw;
      return TI.dust;
    }
    function typeAt(x, z, h, slope) {
      var inside = x >= 0 && z >= 0 && x < VW && z < VL;
      if (!inside) {
        // beyond the valley: the hills dry out with the topsoil, like the terraces inside
        if (T.bluffAt(x, z) > 0.06 && T.bluffAt(x, z) < 0.97 && slope > 0.7) return Math.floor(h * 1.45) % 3 === 1 ? TI.limeD : TI.lime;
        if (slope > 1.6) return TI.limeD;
        var gh = grassBy(soilWet(), x, z);
        return gh === TI.grass ? TI.grassD : gh;
      }
      var vi = Math.round(z) * N1 + Math.round(x),
        k = Math.floor(z) * VW + Math.floor(x),
        g = G(),
        ov = W.overlay;
      if (ov && g) {
        if (ov === "wet") return g.wet[k] > 0.66 ? TI.ovD : g.wet[k] > 0.35 ? TI.ovC : g.wet[k] > 0.05 ? TI.ovB : TI.ovA;
        if (ov === "wear") return g.wear[k] > 6 ? TI.ovE : g.wear[k] > 2 ? TI.ovF : g.wear[k] > 0.5 ? TI.ovB : TI.ovA;
        if (ov === "stage" && T.floorWeight(x, z) > 0.5) {
          var st = nodeAt(z).stage;
          return st === "0" ? TI.ovD : st === "I" || st === "V" ? TI.ovG : st === "IV" ? TI.ovF : TI.ovE;
        }
        if (ov === "cap" && T.floorWeight(x, z) > 0.5) return g.green[k] > 0.66 ? TI.ovG : g.green[k] > 0.33 ? TI.ovF : TI.ovE;
      }
      var rock = T.rock[vi];
      if (rock === 1 && slope > 0.5) return Math.floor(h * 1.45 + 0.15 * Math.sin(x * 0.5)) % 3 === 1 ? TI.limeD : TI.lime;
      if (rock === 2) return TI.limeBed;
      // in the creek's trench
      if (T.cut[vi] > 0.06 && vw.nodes) {
        var n = nodeAt(z),
          wl = n.wl;
        if (h < wl - 0.02) return TI.bed;
        if (h < n.bed + 0.1) return n.q > 2e-5 || wl > n.bed + 0.01 ? TI.gravel : TI.gravel;
        if (n.bw > 0.05 && Math.abs(h - n.bz) < 0.08) return n.veg > 0.5 ? TI.grassD : TI.gravel;
        return n.veg > 0.62 ? TI.grassD : slope > 0.6 ? TI.clay : TI.mud;
      }
      // in a branch's channel
      if (T.brCut[vi] > 0.08) {
        var sp = T.branches.spring.head;
        if (Math.hypot(x - sp.x, z - sp.z) < 4) return TI.moss;
        return T.brCut[vi] > 0.25 ? TI.gravel : TI.moss;
      }
      if (!g) return TI.grass;
      if (g.wear[k] > 5) return TI.path;
      if (g.wear[k] > 2.2) return TI.pathE;
      if (g.wt[k] > h + 0.02) return TI.mud; // under standing water (drawn over it)
      if (g.wet[k] > 0.55) return (hash2(Math.floor(x * 2), Math.floor(z * 2)) & 7) < 2 ? TI.mud : TI.grassD;
      if (g.wet[k] > 0.25) return TI.marsh;
      if (slope > 1.1) return TI.clay;
      return grassBy(g.green[k], x, z);
    }

    // ---- ground tiles ----------------------------------------------------------------
    var CSD = [0.5, 0.4, 0.32, 0.25, 0.2, 0.2],
      TIL = [];
    for (var tj = TZ0; tj < TZ1; tj++)
      for (var ti = TX0; ti < TX1; ti++) {
        let x0 = ti * TILE,
          z0 = tj * TILE,
          inner = ti >= 0 && tj >= 0 && x0 < VW && z0 < VL;
        TIL.push({ i: ti, j: tj, x0, z0, inner, far: null, near: null, job: null, key: "", thingsKey: "", things: null });
      }
    W.tiles = TIL;
    function groundMesh(Tl, cs) {
      var n = Math.round(TILE / cs),
        N = n + 3,
        Hh = new Float32Array(N * N),
        ty = new Uint8Array(n * n),
        x0 = Tl.x0 - cs,
        z0 = Tl.z0 - cs;
      for (var r = 0; r < N; r++) for (var i = 0; i < N; i++) Hh[r * N + i] = height(x0 + i * cs, z0 + r * cs);
      for (var j = 0; j < n; j++)
        for (i = 0; i < n; i++) {
          var a = Hh[(j + 1) * N + i + 1],
            b = Hh[(j + 1) * N + i + 2],
            c = Hh[(j + 2) * N + i + 1],
            d = Hh[(j + 2) * N + i + 2],
            h = (a + b + c + d) / 4,
            slope = Math.hypot((b + d - a - c) / 2, (c + d - a - b) / 2) / cs;
          ty[j * n + i] = typeAt(Tl.x0 + (i + 0.5) * cs, Tl.z0 + (j + 0.5) * cs, h, slope);
        }
      var V1 = n + 1,
        nv = V1 * V1 + 4 * V1,
        pos = new Float32Array(nv * 3),
        nor = new Float32Array(nv * 3),
        k = 0;
      for (j = 0; j <= n; j++)
        for (i = 0; i <= n; i++, k++) {
          var y = Hh[(j + 1) * N + i + 1],
            dx = (Hh[(j + 1) * N + i + 2] - Hh[(j + 1) * N + i]) / (2 * cs),
            dz = (Hh[(j + 2) * N + i + 1] - Hh[j * N + i + 1]) / (2 * cs),
            l = Math.sqrt(dx * dx + 1 + dz * dz);
          pos[k * 3] = Tl.x0 + i * cs;
          pos[k * 3 + 1] = y;
          pos[k * 3 + 2] = Tl.z0 + j * cs;
          nor[k * 3] = -dx / l;
          nor[k * 3 + 1] = 1 / l;
          nor[k * 3 + 2] = -dz / l;
        }
      // skirts: the four edges again, 0.8 m lower, to hide seams between tiles of different detail
      var edges = [];
      for (var e = 0; e < 4; e++) {
        var list = [];
        for (var q = 0; q <= n; q++) {
          var vi = e === 0 ? q : e === 1 ? n * V1 + q : e === 2 ? q * V1 : q * V1 + n;
          list.push([vi, k]);
          pos[k * 3] = pos[vi * 3];
          pos[k * 3 + 1] = pos[vi * 3 + 1] - 0.8;
          pos[k * 3 + 2] = pos[vi * 3 + 2];
          nor[k * 3] = nor[vi * 3];
          nor[k * 3 + 1] = nor[vi * 3 + 1];
          nor[k * 3 + 2] = nor[vi * 3 + 2];
          k++;
        }
        edges.push(list);
      }
      var cnt = new Int32Array(TYPES.length);
      for (j = 0; j < n * n; j++) cnt[ty[j]] += 6;
      var tri = TYPES.map((_, m) => ({ a: new Uint32Array(cnt[m] + 12 * n), n: 0 }));
      for (j = 0; j < n; j++)
        for (i = 0; i < n; i++) {
          var A = j * V1 + i,
            B = A + 1,
            C = A + V1,
            Dd = C + 1,
            L = tri[ty[j * n + i]];
          L.a[L.n++] = A;
          L.a[L.n++] = C;
          L.a[L.n++] = B;
          L.a[L.n++] = B;
          L.a[L.n++] = C;
          L.a[L.n++] = Dd;
        }
      var push = (L, ...v) => v.forEach((x) => (L.a[L.n++] = x));
      for (q = 0; q < n; q++) {
        var t0 = edges[0][q],
          t1 = edges[0][q + 1];
        push(tri[ty[q]], t0[0], t1[0], t0[1], t1[0], t1[1], t0[1]);
        var b0 = edges[1][q],
          b1 = edges[1][q + 1];
        push(tri[ty[(n - 1) * n + q]], b0[0], b0[1], b1[0], b1[0], b0[1], b1[1]);
        var l0 = edges[2][q],
          l1 = edges[2][q + 1];
        push(tri[ty[q * n]], l0[0], l0[1], l1[0], l1[0], l0[1], l1[1]);
        var r0 = edges[3][q],
          r1 = edges[3][q + 1];
        push(tri[ty[q * n + n - 1]], r0[0], r1[0], r0[1], r1[0], r1[1], r0[1]);
      }
      var total = 0;
      tri.forEach((L) => (total += L.n));
      var idx = new Uint32Array(total),
        off = 0,
        geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
      tri.forEach((L, m) => {
        if (L.n) geo.addGroup(off, L.n, m), idx.set(L.a.subarray(0, L.n), off);
        off += L.n;
      });
      geo.setIndex(new THREE.BufferAttribute(idx, 1));
      geo.computeBoundingSphere();
      var mesh = new THREE.Mesh(geo, landMats);
      mesh.receiveShadow = true;
      mesh.name = "Land";
      mesh.userData.ty = ty;
      mesh.userData.n = n;
      mesh.userData.cs = cs;
      return mesh;
    }

    // ---- water --------------------------------------------------------------------
    function waterGeo(pos, idx, flo, dep, edg, uvs) {
      var g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      g.setAttribute("aFlow", new THREE.Float32BufferAttribute(flo, 2));
      g.setAttribute("aUV", new THREE.Float32BufferAttribute(uvs, 2));
      g.setAttribute("aEdge", new THREE.Float32BufferAttribute(edg, 1));
      g.setAttribute("aDeep", new THREE.Float32BufferAttribute(dep, 1));
      g.computeBoundingSphere();
      return g;
    }
    // the creek: a ribbon across its water at each point's own level, where there is water
    // standing or running in the trench (water over the floor is the floor's)
    function creekRibbon(Tl, into, step, wc) {
      if (!vw.nodes) return;
      var pos = [],
        idx = [],
        flo = [],
        dep = [],
        edg = [],
        uvs = [],
        nsec = 0,
        open = false;
      for (var z = Math.max(-24, Tl.z0); z <= Math.min(VL + 24, Tl.z0 + TILE) + 1e-6; z += step) {
        var cx = T.creekX(z),
          f = clamp((z - CREEK.z0) / CREEK.ds, 0, vw.nodes.length - 1.0001),
          i = Math.floor(f),
          t = f - i,
          a = vw.nodes[i],
          b = vw.nodes[i + 1],
          lerp = (k) => a[k] + (b[k] - a[k]) * t,
          bed = lerp("bed"),
          wl = lerp("wl"),
          fp = lerp("fp"),
          q = lerp("q"),
          wet = wl > bed + 0.008 && wl < fp + 0.02,
          inX = cx >= Tl.x0 - 3 && cx < Tl.x0 + TILE + 3;
        if (!wet || !inX) {
          open = false;
          continue;
        }
        var y = wl - bed,
          n = { wb: lerp("wb"), m: lerp("m"), fp, bed, bw: lerp("bw"), bz: lerp("bz") },
          hw = 0.5 * creekWidthAt(n, y) + 0.12,
          dir = T.creekX(z + 0.5) - T.creekX(z - 0.5),
          L = Math.hypot(dir, 1),
          tx = dir / L,
          tz = 1 / L,
          sp = clamp(Math.sqrt(q / 0.002), 0, 1.2) * 0.75;
        for (var k = 0; k < wc; k++) {
          var u = (k / (wc - 1)) * 2 - 1,
            x = cx + tz * u * hw,
            zz = z - tx * u * hw,
            d = clamp(wl - height(x, zz), -0.3, 3);
          pos.push(x, wl, zz);
          flo.push(tx * sp * (1 - 0.55 * u * u), tz * sp * (1 - 0.55 * u * u));
          dep.push(d);
          edg.push(clamp(1 - d / 0.16, 0, 1));
          uvs.push(z, u * hw);
        }
        nsec++;
        if (open) {
          var s1 = (nsec - 1) * wc,
            s0 = s1 - wc;
          for (k = 0; k < wc - 1; k++) idx.push(s0 + k, s0 + k + 1, s1 + k, s0 + k + 1, s1 + k + 1, s1 + k);
        }
        open = true;
      }
      if (!idx.length) return;
      var m = new THREE.Mesh(waterGeo(pos, idx, flo, dep, edg, uvs), paint(vw.flood ? "mudW" : "water", { water: true }));
      m.receiveShadow = true;
      m.name = "Creek";
      into.add(m);
    }
    // water standing on the floor: ponds that rose over their banks, marsh pools, side channels
    function floorWater(Tl, into) {
      var g = G();
      if (!g || !Tl.inner) return;
      var x0 = Tl.x0,
        z0 = Tl.z0,
        n = TILE,
        V1 = n + 1,
        wetC = new Uint8Array(n * n),
        any = false;
      for (var j = 0; j < n; j++)
        for (var i = 0; i < n; i++) {
          var cx = x0 + i,
            cz = z0 + j;
          if (cx >= VW || cz >= VL) continue;
          var k = cz * VW + cx,
            vi = cz * N1 + cx,
            hc = 0.25 * (T.h[vi] + T.h[vi + 1] + T.h[vi + N1] + T.h[vi + N1 + 1]);
          if (g.wt[k] > hc + 0.01 && !(T.cut[vi] > 0.1 && g.wt[k] < T.fpAt(cz + 0.5) - 0.02)) (wetC[j * n + i] = 1), (any = true);
        }
      if (!any) return;
      var pos = [],
        idx = [],
        flo = [],
        dep = [],
        edg = [],
        uvs = [],
        vid = new Int32Array(V1 * V1).fill(-1);
      function vert(i, j) {
        var key = j * V1 + i;
        if (vid[key] >= 0) return vid[key];
        // the water's level at a corner: the mean of the wet cells round it
        var s = 0,
          c = 0;
        for (var dj = -1; dj <= 0; dj++)
          for (var di = -1; di <= 0; di++) {
            var ii = i + di,
              jj = j + dj;
            if (ii < 0 || jj < 0 || ii >= n || jj >= n || !wetC[jj * n + ii]) continue;
            s += g.wt[(z0 + jj) * VW + x0 + ii];
            c++;
          }
        var x = x0 + i,
          z = z0 + j,
          y = s / c,
          d = clamp(y - height(x, z), -0.3, 3);
        pos.push(x, y, z);
        flo.push(0, 0);
        dep.push(d);
        edg.push(clamp(1 - d / 0.12, 0, 1));
        uvs.push(x, z);
        return (vid[key] = pos.length / 3 - 1);
      }
      // the margin: dry cells next to wet ones (the ground rising out of the water hides the rest)
      var draw = wetC.slice();
      for (j = 0; j < n; j++)
        for (i = 0; i < n; i++)
          if (wetC[j * n + i])
            for (var dj2 = -1; dj2 <= 1; dj2++)
              for (var di2 = -1; di2 <= 1; di2++) {
                var ii2 = i + di2,
                  jj2 = j + dj2;
                if (ii2 >= 0 && jj2 >= 0 && ii2 < n && jj2 < n && !draw[jj2 * n + ii2]) draw[jj2 * n + ii2] = 2;
              }
      function anyWetAround(i, j) {
        for (var dj = -1; dj <= 0; dj++)
          for (var di = -1; di <= 0; di++) {
            var ii = i + di,
              jj = j + dj;
            if (ii >= 0 && jj >= 0 && ii < n && jj < n && wetC[jj * n + ii]) return true;
          }
        return false;
      }
      function vertNear(i, j) {
        if (anyWetAround(i, j)) return vert(i, j);
        // a corner with no wet cell round it: the level of the nearest wet cell beside it
        var key = j * V1 + i;
        if (vid[key] >= 0) return vid[key];
        var best = null;
        for (var dj = -2; dj <= 1 && best == null; dj++)
          for (var di = -2; di <= 1; di++) {
            var ii = i + di,
              jj = j + dj;
            if (ii >= 0 && jj >= 0 && ii < n && jj < n && wetC[jj * n + ii]) {
              best = g.wt[(z0 + jj) * VW + x0 + ii];
              break;
            }
          }
        var x = x0 + i,
          z = z0 + j,
          y = best == null ? height(x, z) - 0.05 : best,
          d = clamp(y - height(x, z), -0.3, 3);
        pos.push(x, y, z);
        flo.push(0, 0);
        dep.push(d);
        edg.push(clamp(1 - d / 0.12, 0, 1));
        uvs.push(x, z);
        return (vid[key] = pos.length / 3 - 1);
      }
      for (j = 0; j < n; j++)
        for (i = 0; i < n; i++) {
          if (!draw[j * n + i]) continue;
          var A = vertNear(i, j),
            B = vertNear(i + 1, j),
            C = vertNear(i, j + 1),
            Dd = vertNear(i + 1, j + 1);
          idx.push(A, C, B, B, C, Dd);
        }
      var m = new THREE.Mesh(waterGeo(pos, idx, flo, dep, edg, uvs), paint("pond", { water: true }));
      m.receiveShadow = true;
      m.name = "FloorWater";
      into.add(m);
    }
    // the branches' water
    function branchWater(Tl, into, wc) {
      var Wb = { terrain: T, creek: { br: vw.br, flood: vw.flood }, t: vw.t };
      if (!vw.br) return;
      for (var b of Object.values(T.branches)) {
        var pos = [],
          idx = [],
          flo = [],
          dep = [],
          edg = [],
          uvs = [],
          nsec = 0,
          open = false;
        for (var i = 0; i < b.n; i++) {
          var x = b.X[i],
            z = b.Z[i];
          if (x < Tl.x0 - 1 || x >= Tl.x0 + TILE + 1 || z < Tl.z0 - 1 || z >= Tl.z0 + TILE + 1) {
            open = false;
            continue;
          }
          var ws = cf2BranchWater(Wb, b, i);
          if (ws == null) {
            open = false;
            continue;
          }
          var i0 = Math.max(0, i - 1),
            i1 = Math.min(b.n - 1, i + 1),
            dx = b.X[i1] - b.X[i0],
            dz = b.Z[i1] - b.Z[i0],
            L = Math.hypot(dx, dz) || 1,
            tx = dx / L,
            tz = dz / L,
            hw = b.HW[i] * 0.85,
            sp = b.id === "dry" ? (vw.br.dry.state === "running" ? 1.0 : 0.05) : 0.5;
          for (var k = 0; k < wc; k++) {
            var u = (k / (wc - 1)) * 2 - 1,
              px = x + tz * u * hw,
              pz = z - tx * u * hw,
              d = clamp(ws - height(px, pz), -0.3, 2);
            pos.push(px, ws, pz);
            flo.push(tx * sp, tz * sp);
            dep.push(d);
            edg.push(clamp(1 - d / 0.12, 0, 1));
            uvs.push(b.S[i], u * hw);
          }
          nsec++;
          if (open) {
            var s1 = (nsec - 1) * wc,
              s0 = s1 - wc;
            for (k = 0; k < wc - 1; k++) idx.push(s0 + k, s0 + k + 1, s1 + k, s0 + k + 1, s1 + k + 1, s1 + k);
          }
          open = true;
        }
        if (!idx.length) continue;
        var m = new THREE.Mesh(waterGeo(pos, idx, flo, dep, edg, uvs), paint(b.id === "spring" ? "waterC" : "water", { water: true }));
        m.receiveShadow = true;
        m.name = "Branch_" + b.id;
        into.add(m);
      }
    }

    // ---- trees, plants and materials, from the simulation ----------------------------
    // What the Water Brings' trees (its valley.js: trunk, blob, buildTree, farTree), carried
    // over whole, for the simulation's trees: oak to its live oaks, birch to its pale-trunked
    // sycamore, pine to its cedar, the seed-pod tree to its spreading pecan, and a willow of
    // Creekfolk 2's own (drooping, by the water). In autumn the oaks and pecans turn gold.
    function trunk(B, key, x, h, z, tw, th, TR, lean, Dd) {
      if (Dd < 2) return B.add(key + "|f", bake(box(tw, th + 0.3, tw), x, h + th / 2 - 0.1, z, 0, TR() * 3, lean));
      var sides = [0, 6, 9, 12, 14, 16][Dd - 1];
      B.add(key + "|f", bake(new THREE.CylinderGeometry(tw * 0.42, tw * 0.62, th + 0.3, sides, Dd > 4 ? 4 : Dd > 2 ? 3 : 1, true), x, h + th / 2 - 0.1, z, 0, TR() * 3, lean));
      B.add(key + "|f", bake(new THREE.CylinderGeometry(tw * 0.6, tw * 1.0, 0.35, sides, 1, true), x, h + 0.12, z, 0, TR() * 3, 0));
      var nr = [0, 0, 3, 4, 5, 5][Dd - 1];
      for (var q = 0; q < nr; q++) {
        var a = (q / nr) * 6.28 + TR();
        B.add(key + "|f", bake(new THREE.CylinderGeometry(tw * 0.08, tw * 0.22, tw * 1.4, 5, 1, true), x + Math.cos(a) * tw * 0.55, h + 0.05, z + Math.sin(a) * tw * 0.55, Math.sin(a) * 1.25, 0, -Math.cos(a) * 1.25));
      }
    }
    function blob(B, key, r, x, y, z, TR, sy, Dd) {
      if (Dd > 2) {
        var g = lumpy(new THREE.IcosahedronGeometry(r * 0.94, Dd > 5 && r > 1.45 ? 3 : Dd > 4 ? (r > 0.55 ? 2 : 1) : Dd > 3 && r > 0.95 ? 2 : r > 0.45 ? 1 : 0), 0.1, TR);
        return B.add(key + "|f|c", bake(g, x, y, z, TR() * 3, TR() * 3, TR() * 3, 1, sy || 0.8, 1));
      }
      B.add(key + "|f|c", bake(new THREE.IcosahedronGeometry(r, Dd > 1 && r > 1.0 ? 1 : 0), x, y, z, TR() * 3, TR() * 3, TR() * 3, 1, sy || 0.8, 1));
    }
    function treeKindOf(r) {
      var v = r.kind === "podtree" ? "pod" : r.variant || "oak";
      return v === "pine" ? "cedar" : v === "birch" ? "syc" : v === "willow" ? "willow" : v === "pod" ? "pecan" : v === "gold" ? "gold" : v === "elm" ? "elm" : "oak";
    }
    function treeSize(r) {
      if (r.kind === "grove") return clamp(0.35 + 0.18 * (r.size || r.stage || r.age || 1), 0.35, 1.9); // grove trees grow all their lives
      return 0.85 + ((r.id * 2654435761) % 1000) / 2000 + (r.kind === "podtree" ? 0.25 : 0);
    }
    function buildTree(B, r, Dd) {
      var TR = rnd(r.id * 7919 + 13),
        x = r.x,
        z = r.z,
        h = height(x, z),
        sz = treeSize(r),
        kind = treeKindOf(r),
        autumn = vw.season === "autumn";
      if (kind === "cedar") {
        var th0 = 0.5 * sz,
          tiers = Dd < 3 ? 3 : Dd < 5 ? 4 : 5,
          sides = [7, 9, 11, 14, 16, 18][Dd - 1];
        trunk(B, "trunk", x, h, z, 0.18 * sz, th0, TR, 0, Dd);
        for (var q = 0; q < tiers; q++) {
          var f = q / (tiers - 1);
          B.add("cedar|f|c", bake(new THREE.ConeGeometry((0.95 - f * 0.5) * sz, (1.3 - f * 0.3) * sz, sides, Math.min(Dd, 4)), x, h + th0 + (0.55 + f * 1.5) * sz, z, 0, TR() * 3, 0));
        }
        return;
      }
      if (kind === "syc") {
        var th = (2.2 + TR() * 0.6) * sz,
          cr = 1.05 * sz;
        trunk(B, "syc", x, h, z, 0.26 * sz, th, TR, (TR() - 0.5) * 0.12, Dd);
        for (var k = 0; k < 3; k++) {
          var a = (k / 3) * 6.28 + TR(),
            rad = k ? cr * 0.6 : 0;
          blob(B, autumn ? "gold" : "elm", cr * (k ? 0.7 : 1), x + Math.cos(a) * rad, h + th + cr * 0.5 + (k ? 0.3 : 0.2), z + Math.sin(a) * rad, TR, 0.85, Dd);
        }
        return;
      }
      if (kind === "willow") {
        var thw = (1.3 + TR() * 0.4) * sz,
          crw = 1.5 * sz;
        trunk(B, "trunk", x, h, z, 0.3 * sz, thw, TR, (TR() - 0.5) * 0.2, Dd);
        for (q = 0; q < 4; q++) {
          var aw = (q / 4) * 6.28 + TR();
          blob(B, "willow", crw * (q ? 0.65 : 0.9), x + Math.cos(aw) * crw * (q ? 0.5 : 0), h + thw + crw * 0.45, z + Math.sin(aw) * crw * (q ? 0.5 : 0), TR, 0.7, Dd);
        }
        // the hanging curtain of thin branches
        var ns = Dd < 3 ? 8 : 16;
        for (q = 0; q < ns; q++) {
          var ah = (q / ns) * 6.28 + TR() * 0.3,
            rh = crw * (0.85 + TR() * 0.25),
            len = thw * (0.7 + TR() * 0.4);
          B.add("willow|f|c", bake(box(0.12, len, 0.12), x + Math.cos(ah) * rh, h + thw + crw * 0.3 - len / 2, z + Math.sin(ah) * rh, (TR() - 0.5) * 0.1, 0, (TR() - 0.5) * 0.1));
        }
        return;
      }
      var leaf = kind === "pecan" ? "pecan" : kind === "elm" ? "elm" : "oak",
        th2 = (1.5 + TR() * 0.7) * sz * (kind === "pecan" ? 1.15 : 1),
        tw2 = (0.28 + TR() * 0.1) * sz;
      if (autumn && (kind === "pecan" || (kind === "oak" && TR() < 0.45))) leaf = "gold";
      trunk(B, "trunk", x, h, z, tw2, th2, TR, (TR() - 0.5) * 0.08, Dd);
      var nbr = [1, 1, 2, 3, 3, 4][Dd - 1];
      for (var b = 0; b < nbr; b++) {
        var br = Dd < 2 ? box(tw2 * 0.5, th2 * 0.6, tw2 * 0.5) : new THREE.CylinderGeometry(tw2 * 0.16, tw2 * 0.28, th2 * 0.6, 6),
          ba = TR() * 6;
        B.add("trunk|f", bake(br, x + Math.cos(ba) * th2 * 0.18, h + th2 * 0.88, z + Math.sin(ba) * th2 * 0.18, Math.sin(ba) * 0.6, 0, -Math.cos(ba) * 0.6));
      }
      var nb = 3 + ((TR() * 3) | 0),
        cr2 = (1.15 + TR() * 0.45) * sz * (kind === "pecan" ? 1.1 : 1);
      for (var q2 = 0; q2 < nb; q2++) {
        var a2 = (q2 / nb) * 6.28 + TR(),
          rad2 = q2 === 0 ? 0 : cr2 * (0.55 + TR() * 0.25),
          r2 = cr2 * (q2 === 0 ? 1 : 0.62 + TR() * 0.25);
        blob(B, q2 % 2 && leaf === "oak" ? "oak2" : leaf, r2, x + Math.cos(a2) * rad2, h + th2 + cr2 * 0.55 + (q2 ? TR() * 0.4 * sz : 0.3 * sz), z + Math.sin(a2) * rad2, TR, null, Dd);
      }
      // the seed pods the creekfolk wait for, hanging under the pod tree's canopy
      if (r.kind === "podtree" && r.pods) for (q = 0; q < Math.min(6, r.pods); q++) B.add("pod|f", bake(new THREE.IcosahedronGeometry(0.22, 0), x + (TR() - 0.5) * cr2, h + th2 + 0.1, z + (TR() - 0.5) * cr2));
    }
    function farTree(B, r) {
      var h = height(r.x, r.z),
        sz = treeSize(r),
        kind = treeKindOf(r);
      if (kind === "cedar") return B.add("cedar|f", bake(new THREE.ConeGeometry(0.9 * sz, 2.6 * sz, 6), r.x, h + 1.55 * sz, r.z));
      var leaf = kind === "syc" ? "elm" : kind === "willow" ? "willow" : kind === "pecan" ? (vw.season === "autumn" ? "gold" : "pecan") : kind === "elm" ? "elm" : "oak",
        th = (kind === "syc" ? 2.4 : 1.8) * sz,
        cr = (kind === "syc" ? 1.1 : kind === "willow" ? 1.6 : 1.4) * sz;
      B.add((kind === "syc" ? "syc" : "trunk") + "|f", bake(box(0.3 * sz, th, 0.3 * sz), r.x, h + th / 2, r.z));
      B.add(leaf + "|f", bake(new THREE.IcosahedronGeometry(cr, 0), r.x, h + th + cr * 0.6, r.z, 0, r.id % 7, 0, 1.15, 0.8, 1.15));
    }
    function addTree(B, r, det, far) {
      return far ? farTree(B, r) : buildTree(B, r, det);
    }
    function addThing(B, r, det, far) {
      var R = rnd(r.id * 104729 + 7),
        h0 = height(r.x, r.z);
      switch (r.kind) {
        case "tree":
        case "podtree":
        case "grove":
          return addTree(B, r, det, far);
        case "bush": {
          var nb = far ? 1 : 3,
            sz = 0.55 + 0.1 * (r.max || 6) * 0.1;
          for (var q = 0; q < nb; q++) {
            var a = R() * 6.28,
              d = q ? sz * 0.6 : 0;
            B.add("bush|f", bake(det > 2 && !far ? lumpy(new THREE.IcosahedronGeometry(sz * (q ? 0.75 : 1), 1), 0.12, R) : new THREE.IcosahedronGeometry(sz, 0), r.x + Math.cos(a) * d, h0 + sz * 0.55, r.z + Math.sin(a) * d, 0, R() * 3, 0, 1, 0.75, 1));
          }
          if (!far && r.amt > 0) for (q = 0; q < Math.min(8, r.amt); q++) B.add((r.food === "bluberry" ? "blue" : "berry") + "|f", bake(box(0.09, 0.09, 0.09), r.x + (R() - 0.5) * sz * 1.4, h0 + sz * (0.4 + R() * 0.6), r.z + (R() - 0.5) * sz * 1.4));
          return;
        }
        case "reeds": {
          if (far) return B.add("reed|f", bake(cyl(0.6, 0.7, 0.8, 5), r.x, h0 + 0.4, r.z));
          var n = 6 + Math.min(10, r.amt || 0);
          for (q = 0; q < n; q++) B.add("reed|f", bake(box(0.05, 1, 0.05), r.x + (R() - 0.5) * 1.6, h0 + 0.5 * (0.8 + R() * 0.6), r.z + (R() - 0.5) * 1.6, (R() - 0.5) * 0.3, 0, (R() - 0.5) * 0.3, 1, 0.8 + R() * 0.6, 1));
          return;
        }
        case "stones":
        case "boulder": {
          var big = r.kind === "boulder",
            k2 = big ? 1 : Math.min(8, Math.ceil((r.amt || 4) / 2));
          for (q = 0; q < (far ? 1 : k2); q++) {
            var rr = big ? 0.55 * (r.size || 1) : 0.18 + R() * 0.14;
            B.add("rock|f", bake(new THREE.DodecahedronGeometry(rr, 0), r.x + (q ? (R() - 0.5) * 1.4 : 0), h0 + rr * 0.3, r.z + (q ? (R() - 0.5) * 1.4 : 0), R() * 3, R() * 3, R() * 3, 1, 0.62, 1));
          }
          return;
        }
        case "clay":
          return B.add("clay|f", bake(new THREE.SphereGeometry(0.9, far ? 5 : 8, far ? 3 : 5, 0, 6.28, 0, Math.PI / 2), r.x, h0 - 0.1, r.z, 0, 0, 0, 1.3, 0.35 + 0.02 * (r.amt || 8), 0.9));
        case "log":
          return B.add("wood|f", bake(cyl(0.22, 0.24, 2.4, far ? 5 : 8), r.x, h0 + 0.2, r.z, 0, r.rot || 0, Math.PI / 2));
        case "snag":
          for (q = 0; q < 4; q++) B.add("wood|f", bake(cyl(0.07, 0.09, 1.8, 5), r.x + (R() - 0.5), h0 + 0.1, r.z + (R() - 0.5), 0, R() * 3, Math.PI / 2));
          return;
        case "glowcap":
          if (far) return;
          for (q = 0; q < Math.max(1, r.amt || 0); q++) B.add("glow|g", bake(new THREE.SphereGeometry(0.07, 6, 3, 0, 6.28, 0, Math.PI / 2), r.x + (R() - 0.5) * 0.8, h0 + 0.05, r.z + (R() - 0.5) * 0.8));
          return;
        default:
          if (!far) B.add("rock|f", bake(box(0.2, 0.2, 0.2), r.x, h0 + 0.1, r.z));
      }
    }
    // scenery: woods on the hills round the rim, where nobody walks (only drawn; nothing in
    // the simulation knows about them)
    var SCENERY = [];
    (function () {
      var R = rnd(hash2(VW, VL) ^ (String(vw.seed).length * 977)),
        id = -1;
      for (var q = 0; q < 2600; q++) {
        var x = -60 + R() * (VW + 120),
          z = -60 + R() * (VL + 120),
          r = T.valleyR(x, z);
        if (r < 0.93 || Math.abs(x - T.creekX(z)) < 6) continue;
        if (T.bluffAt(x, z) > 0.05 && T.bluffAt(x, z) < 0.95) continue;
        if (q % 3 === 0 && R() < 0.4) continue;
        var k = R();
        SCENERY.push({ id: id--, kind: "tree", variant: k < 0.4 ? "pine" : k < 0.75 ? "oak" : k < 0.88 ? "elm" : "birch", x, z });
      }
    })();
    function tileOf(x, z) {
      var i = Math.floor(x / TILE) - TX0,
        j = Math.floor(z / TILE) - TZ0;
      if (i < 0 || j < 0 || i >= TX1 - TX0 || j >= TZ1 - TZ0) return null;
      return TIL[j * (TX1 - TX0) + i];
    }

    // ---- the small life of a near tile: What the Water Brings' plants ----------------
    // Soft (no outline, no shadow), in clumps and drifts, placed by what the simulation says
    // the ground is: grass tufts on the grass (straw-coloured in the dry season), flowers in
    // spring and summer, reeds on the wet banks and the marsh, cattails at the water's edge,
    // pebbles on gravel and the Dry Fork's bed, ferns and mushrooms under the trees, and
    // fallen leaves under them in autumn.
    var bladeGeo = new THREE.BoxGeometry(0.03, 1, 0.03);
    bladeGeo.translate(0, 0.5, 0);
    var tuftGeo = (function () {
      var tp = [];
      [
        [0, 0, 0, 1],
        [0.025, 0.3, 0.012, 0.8],
        [-0.022, -0.35, -0.01, 0.9],
      ].forEach(function (q, i) {
        var w = 0.022,
          top = new THREE.Vector3(0, q[3], 0),
          b = [0, 1, 2].map((k) => new THREE.Vector3(Math.cos((k / 3) * 6.283 + i) * w, 0, Math.sin((k / 3) * 6.283 + i) * w)),
          m = new THREE.Matrix4().makeRotationY(i * 2.1).multiply(new THREE.Matrix4().makeRotationZ(q[1])),
          tr = new THREE.Vector3(q[0], 0, q[2]);
        [
          [0, 1],
          [1, 2],
          [2, 0],
        ].forEach((e) => [b[e[1]], b[e[0]], top].forEach((v) => {
          var u = v.clone().applyMatrix4(m).add(tr);
          tp.push(u.x, u.y, u.z);
        }));
      });
      var g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(tp, 3));
      g.computeVertexNormals();
      return g;
    })();
    var fernGeo = (function () {
      var fp = [];
      for (var fr = 0; fr < 6; fr++) {
        var fa = (fr / 6) * 6.283 + (fr % 2) * 0.3,
          ca2 = Math.cos(fa),
          sa2 = Math.sin(fa),
          FL = fr % 2 ? 0.42 : 0.5,
          NS = 5,
          P = [];
        for (var si = 0; si <= NS; si++) {
          var tf = si / NS,
            rr3 = FL * tf,
            yy3 = 0.24 * Math.sin(tf * Math.PI * 0.8) - 0.04 * tf * tf,
            wf = 0.075 * Math.pow(Math.sin(Math.min(1, tf * 1.15) * Math.PI), 0.7) * (1 - 0.35 * tf);
          P.push([rr3, yy3 + 0.018 * (1 - tf), 0], [rr3, yy3, wf], [rr3, yy3, -wf]);
        }
        var rot = (p3) => [p3[0] * ca2 - p3[2] * sa2, p3[1], p3[0] * sa2 + p3[2] * ca2];
        for (si = 0; si < NS; si++) {
          var m0 = P[si * 3],
            l0 = P[si * 3 + 1],
            r0 = P[si * 3 + 2],
            m1 = P[si * 3 + 3],
            l1 = P[si * 3 + 4],
            r1 = P[si * 3 + 5];
          [
            [m0, l0, m1],
            [l0, l1, m1],
            [m0, m1, r0],
            [r0, m1, r1],
          ].forEach((t3) => t3.forEach((v3) => fp.push(...rot(v3))));
        }
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(fp, 3));
      g.computeVertexNormals();
      return g;
    })();
    var flowerGeo = new THREE.CylinderGeometry(0.045, 0.016, 0.03, 5),
      pebGeo = new THREE.OctahedronGeometry(1, 0),
      leafGeo = box(0.09, 0.008, 0.06),
      capGeo = new THREE.SphereGeometry(1, 8, 4, 0, 6.29, 0, Math.PI / 2),
      stemGeo = new THREE.CylinderGeometry(0.012, 0.016, 0.06, 6),
      catGeo = box(0.05, 0.13, 0.05);
    stemGeo.translate(0, 0.03, 0);
    function swayBy(g, k, all) {
      var P = g.attributes.position,
        y0 = 1e9,
        y1 = -1e9,
        i;
      for (i = 0; i < P.count; i++) (y0 = Math.min(y0, P.getY(i))), (y1 = Math.max(y1, P.getY(i)));
      var a = new Float32Array(P.count);
      for (i = 0; i < P.count; i++) a[i] = all ? k : (k * (P.getY(i) - y0)) / Math.max(1e-4, y1 - y0);
      g.setAttribute("sway", new THREE.BufferAttribute(a, 1));
    }
    swayBy(tuftGeo, 0.45);
    swayBy(bladeGeo, 1.0);
    swayBy(fernGeo, 0.35);
    swayBy(flowerGeo, 0.4, true);
    swayBy(catGeo, 1.0, true);
    function instIn(Tl, into, geo, key, list, set) {
      if (!list.length) return;
      var g = geo.clone();
      g.boundingSphere = new THREE.Sphere(new THREE.Vector3(Tl.x0 + TILE / 2, list[0].y || 0, Tl.z0 + TILE / 2), TILE * 0.75 + 4);
      var im = new THREE.InstancedMesh(g, paint(key, { soft: true, sway: !!g.attributes.sway }), list.length),
        o = new THREE.Object3D();
      for (var q = 0; q < list.length; q++) set(o, list[q]), o.updateMatrix(), im.setMatrixAt(q, o.matrix);
      im.instanceMatrix.needsUpdate = true;
      im.computeBoundingSphere();
      if (im.boundingSphere) im.boundingSphere.radius += 2; // room for the sway
      im.castShadow = false;
      im.receiveShadow = true;
      im.name = "Plants_" + key;
      into.add(im);
    }
    function plants(Tl, into, land) {
      var ty = land.userData.ty,
        n = land.userData.n,
        cs = land.userData.cs,
        GR = rnd(hash2(Tl.i * 7 + 3, Tl.j * 13 + 5) ^ (vw.waterV & 0xff)),
        K = [0.45, 0.6, 0.85, 1.0, 1.2, 1.45][W.detail - 1],
        season = vw.season,
        dry = season === "summer" || season === "autumn";
      var at = (x, z) => {
        var i = Math.floor((x - Tl.x0) / cs),
          j = Math.floor((z - Tl.z0) / cs);
        return i < 0 || j < 0 || i >= n || j >= n ? -1 : ty[j * n + i];
      };
      var grassy = (t) => t === TI.grass || t === TI.grassL || t === TI.grassD || t === TI.strawL || t === TI.straw,
        wetBank = (t) => t === TI.marsh || t === TI.mud || (t === TI.grassD && T.floorWeight(0, 0) >= 0);
      var nearTree = (x, z, r) => {
        for (var q of thingsHere) if ((q.kind === "tree" || q.kind === "podtree" || q.kind === "grove") && Math.hypot(q.x - x, q.z - z) < r) return true;
        return false;
      };
      var thingsHere = [];
      for (var r0 of vw.list("res").values()) if (r0.x >= Tl.x0 - 3 && r0.x < Tl.x0 + TILE + 3 && r0.z >= Tl.z0 - 3 && r0.z < Tl.z0 + TILE + 3) thingsHere.push(r0);
      var blocked = (x, z) => {
        for (var s of vw.list("structures").values()) if (Math.hypot(s.x - x, s.z - z) < ((STRUCTURES[s.kind] || {}).radius || 1.5) + 0.3) return true;
        return false;
      };
      function clumps(nC, per, spread, ok) {
        var out = [],
          guard = 0;
        while (out.length < nC * per && guard++ < nC * 10) {
          var cx = Tl.x0 + GR() * TILE,
            cz = Tl.z0 + GR() * TILE;
          if (!ok(at(cx, cz), cx, cz)) continue;
          var m = Math.max(2, Math.round(per * (0.6 + GR() * 0.8))),
            s0 = 0.75 + GR() * 0.5;
          for (var e = 0; e < m; e++) {
            var a = GR() * 6.28,
              rr = Math.sqrt(GR()) * spread,
              x = cx + Math.cos(a) * rr,
              z = cz + Math.sin(a) * rr;
            if (x < Tl.x0 || x >= Tl.x0 + TILE || z < Tl.z0 || z >= Tl.z0 + TILE || !ok(at(x, z), x, z) || blocked(x, z)) continue;
            out.push({ x, z, y: height(x, z), s: s0 * (0.8 + GR() * 0.4), r1: GR(), r2: GR(), r3: GR(), t: at(x, z) });
          }
        }
        return out;
      }
      var g = G();
      // grass tufts: green in the wet season, straw in the dry
      var tufts = clumps(Math.round(90 * K), 12, 0.7, (t) => grassy(t));
      ["grassD", "grassL", "tuftS"].forEach(function (key, q) {
        var L = tufts.filter((it) => (it.t === TI.straw || it.t === TI.strawL ? 2 : it.r3 < 0.5 ? 0 : 1) === q);
        instIn(Tl, into, tuftGeo, key, L, (o, it) => {
          o.position.set(it.x, it.y - 0.01, it.z);
          o.rotation.set((it.r1 - 0.5) * 0.35, it.r2 * 6.28, (it.r3 - 0.5) * 0.35);
          o.scale.set(1.25, 0.1 + 0.12 * it.s, 1.25);
        });
      });
      if (season === "spring" || season === "summer")
        ["fblue", "fred", "fyel"].forEach(function (key, q) {
          var L = clumps(Math.round((q ? 4 : 6) * K), 16, 0.9, (t, x, z) => (t === TI.grass || t === TI.grassL) && Math.sin(x * 0.07 + q) * Math.cos(z * 0.06 - q) > 0.2);
          instIn(Tl, into, flowerGeo, key, L, (o, it) => {
            o.position.set(it.x, it.y + 0.1 + it.r1 * 0.05, it.z);
            o.rotation.set(0, it.r2 * 3, 0);
            o.scale.setScalar(0.9 + it.r3 * 0.5);
          });
        });
      // reeds on the marsh and wet banks; cattails where the ground meets standing water
      var reeds = clumps(Math.round(60 * K), 10, 0.45, (t) => t === TI.marsh || t === TI.mud);
      instIn(Tl, into, tuftGeo, dry ? "tuftS" : "reed", reeds, (o, it) => {
        o.position.set(it.x, it.y - 0.02, it.z);
        o.rotation.set((it.r1 - 0.5) * 0.3, it.r2 * 6.28, (it.r3 - 0.5) * 0.3);
        o.scale.set(1.3, 0.45 + 0.5 * it.s, 1.3);
      });
      if (g) {
        var cats = clumps(Math.round(16 * K), 6, 0.35, (t, x, z) => {
          var k = Math.floor(z) * VW + Math.floor(x);
          return Tl.inner && x >= 0 && z >= 0 && x < VW && z < VL && Math.abs(g.wt[k] - height(x, z)) < 0.12 && (t === TI.marsh || t === TI.mud || t === TI.grassD);
        });
        instIn(Tl, into, bladeGeo, "reed", cats, (o, it) => {
          o.position.set(it.x, it.y, it.z);
          o.rotation.set((it.r1 - 0.5) * 0.15, it.r2 * 6, 0);
          o.scale.set(0.8, 0.6 + it.s * 0.2, 0.8);
        });
        instIn(Tl, into, catGeo, "cattail", cats, (o, it) => {
          o.position.set(it.x, it.y + 0.6 + it.s * 0.2, it.z);
          o.rotation.set(0, it.r2 * 6, 0);
        });
      }
      // pebbles
      ["lime", "rock"].forEach(function (key, q) {
        var L = clumps(Math.round((q ? 18 : 26) * K), 9, 0.4, (t) => t === TI.gravel || t === TI.limeBed || t === TI.bed);
        instIn(Tl, into, pebGeo, key, L, (o, it) => {
          var r = 0.03 + it.r1 * 0.05;
          o.position.set(it.x, it.y + r * 0.2, it.z);
          o.rotation.set(it.r2 * 3, it.r3 * 3, it.r1 * 3);
          o.scale.set(r * 1.3, r * 0.6, r);
        });
      });
      // under the trees: ferns, mushrooms, and the leaves of autumn
      var shade = clumps(Math.round(10 * K), 5, 0.6, (t, x, z) => grassy(t) && nearTree(x, z, 2.2));
      instIn(Tl, into, fernGeo, "fern", shade.filter((it) => it.r3 < 0.6), (o, it) => {
        o.position.set(it.x, it.y - 0.01, it.z);
        o.rotation.set((it.r1 - 0.5) * 0.2, it.r2 * 6.28, (it.r3 - 0.5) * 0.2);
        o.scale.setScalar(0.75 + it.s * 0.5);
      });
      var mush = shade.filter((it) => it.r3 >= 0.6);
      instIn(Tl, into, stemGeo, "stem", mush, (o, it) => {
        o.position.set(it.x, it.y, it.z);
        o.scale.setScalar(0.8 + it.r1 * 0.6);
      });
      instIn(Tl, into, capGeo, "mush", mush, (o, it) => {
        var k2 = 0.8 + it.r1 * 0.6;
        o.position.set(it.x, it.y + 0.058 * k2, it.z);
        o.scale.set(0.04 * k2, 0.025 * k2, 0.04 * k2);
      });
      if (season === "autumn") {
        var leaves = clumps(Math.round(24 * K), 14, 0.9, (t, x, z) => nearTree(x, z, 2.6));
        ["gold", "leafR"].forEach((key, q) =>
          instIn(Tl, into, leafGeo, key, leaves.filter((it) => (it.r3 < 0.55 ? 0 : 1) === q), (o, it) => {
            o.position.set(it.x, it.y + 0.01, it.z);
            o.rotation.set((it.r1 - 0.5) * 0.4, it.r2 * 6.28, (it.r3 - 0.5) * 0.4);
            o.scale.setScalar(0.85 + it.r1 * 0.5);
          }),
        );
      }
    }

    // ---- structures ---------------------------------------------------------------
    // Homes, stores, gardens and the rest at the size the simulation gives them, level by
    // level; dams as real beaver dam analogs: willow posts a metre tall across the creek,
    // branches woven between them, mud and stones packed on the upstream face.
    function addStructure(B, s, far) {
      var def = STRUCTURES[s.kind] || {},
        R = rnd(s.id * 31 + 7),
        rad = def.radius || 1.5,
        h0 = height(s.x, s.z),
        lv = s.level || 0,
        bl = s.building,
        progress = bl ? clamp((bl.stage + (bl.labor || 0) / Math.max(1, stageLaborNeeded(s) || 1)) / Math.max(1, (levelDef(s, bl.level) || { stages: [1] }).stages.length), 0, 1) : 1,
        show = Math.max(lv, bl ? bl.level + progress * 0.999 : 0),
        rot = s.rot || 0;
      if (s.kind === "dam") return addDam(B, s, far);
      if (s.kind === "home") {
        if (show <= 0.05) return;
        if (show < 1.5) {
          // a nest: a ring of branches and a bed of reeds
          for (var q = 0; q < (far ? 4 : 10); q++) {
            var a = (q / 10) * 6.28;
            B.add("wood|f", bake(cyl(0.05, 0.06, 1.2, 4), s.x + Math.cos(a) * rad * 0.6, h0 + 0.12, s.z + Math.sin(a) * rad * 0.6, 0, -a, Math.PI / 2));
          }
          B.add("thatch|f", bake(cyl(rad * 0.55, rad * 0.6, 0.12, 8), s.x, h0 + 0.06, s.z));
          if (show >= 1.0) for (q = 0; q < 4; q++) B.add("post|f", bake(cyl(0.05, 0.06, 2.0, 4), s.x + Math.cos(q * 1.57 + rot) * rad * 0.7, h0 + 1, s.z + Math.sin(q * 1.57 + rot) * rad * 0.7));
          if (show >= 1.4) B.add("thatch|f", bake(new THREE.ConeGeometry(rad * 0.95, 1.1, far ? 5 : 8), s.x, h0 + 2.3, s.z));
          return;
        }
        // a hut: round mud walls, a thatched or tiled roof, a door facing its way
        var wallH = 1.7,
          wr = rad * 0.82;
        B.add("mudwall|f", bake(cyl(wr * 0.95, wr, wallH, far ? 6 : 12), s.x, h0 + wallH / 2, s.z));
        B.add((lv >= 4 || show >= 4 ? "tile" : "thatch") + "|f", bake(new THREE.ConeGeometry(wr * 1.25, 1.6, far ? 6 : 12), s.x, h0 + wallH + 0.75, s.z));
        if (!far) {
          var dx = Math.sin(rot) * wr,
            dz = Math.cos(rot) * wr;
          B.add("wood|f", bake(box(0.75, 1.25, 0.12), s.x + dx * 1.01, h0 + 0.62, s.z + dz * 1.01, 0, rot, 0));
        }
        if (show >= 5 && !far) B.add("wood|f", bake(cyl(wr + 0.3, wr + 0.3, 0.2, 12), s.x, h0 + 0.1, s.z));
        if (show >= 6) B.add("mudwall|f", bake(cyl(wr * 0.6, wr * 0.65, wallH * 0.85, far ? 6 : 10), s.x + Math.cos(rot + 1.6) * wr * 1.3, h0 + wallH * 0.42, s.z + Math.sin(rot + 1.6) * wr * 1.3));
        return;
      }
      if (s.kind === "garden") {
        // beds of dark soil, more of them as it grows, with rows of green when planted
        var beds = clamp(Math.ceil(show), 1, 4);
        for (q = 0; q < beds; q++) {
          var bx = s.x + ((q % 2) - 0.5) * rad * 0.9,
            bz = s.z + (Math.floor(q / 2) - 0.5) * rad * 0.9;
          B.add("soil|f", bake(box(rad * 0.8, 0.14, rad * 0.8), bx, height(bx, bz) + 0.05, bz));
          if (!far && (s.grow || s.amt || show >= 1)) for (var rw = 0; rw < 4; rw++) B.add("grass|f", bake(box(rad * 0.7, 0.16, 0.12), bx, height(bx, bz) + 0.16, bz - rad * 0.3 + rw * rad * 0.2));
        }
        return;
      }
      if (s.kind === "store") {
        if (show >= 1.5)
          for (q = 0; q < Math.min(6, Math.ceil(show * 1.5)); q++) {
            var a2 = (q / 6) * 6.28;
            B.add("weave|f", bake(cyl(0.35, 0.3, 0.6, far ? 5 : 8), s.x + Math.cos(a2) * rad * 0.45, h0 + 0.3, s.z + Math.sin(a2) * rad * 0.45));
          }
        if (show >= 2.5) {
          for (q = 0; q < 4; q++) B.add("post|f", bake(cyl(0.07, 0.08, 2.2, 5), s.x + Math.cos(q * 1.57 + 0.78) * rad * 0.8, h0 + 1.1, s.z + Math.sin(q * 1.57 + 0.78) * rad * 0.8));
          B.add((show >= 3.5 ? "tile" : "thatch") + "|f", bake(new THREE.ConeGeometry(rad * 1.25, 1.0, 4), s.x, h0 + 2.6, s.z, 0, 0.78, 0));
        }
        return;
      }
      if (s.kind === "meeting") {
        B.add("stone|f", bake(new THREE.DodecahedronGeometry(0.7, far ? 0 : 1), s.x, h0 + 0.35, s.z, 0, 0, 0, 1.2, 0.7, 1));
        if (show >= 1.5) for (q = 0; q < 6; q++) B.add("wood|f", bake(cyl(0.2, 0.22, 1.5, 6), s.x + Math.cos(q * 1.05) * rad * 0.75, h0 + 0.2, s.z + Math.sin(q * 1.05) * rad * 0.75, 0, -q * 1.05, Math.PI / 2));
        if (show >= 2.5 && !far) for (q = 0; q < 4; q++) B.add("post|f", bake(cyl(0.05, 0.05, 1.6, 4), s.x + Math.cos(q * 1.57 + 0.4) * rad * 0.95, h0 + 0.8, s.z + Math.sin(q * 1.57 + 0.4) * rad * 0.95));
        if (show >= 3.5) {
          B.add("mudwall|f", bake(cyl(rad * 0.95, rad, 2.0, far ? 6 : 14), s.x, h0 + 1.0, s.z));
          B.add("tile|f", bake(new THREE.ConeGeometry(rad * 1.25, 1.8, far ? 6 : 14), s.x, h0 + 2.9, s.z));
        }
        return;
      }
      if (s.kind === "crossing") {
        // stepping stones, then a log bridge, then rails, across the creek
        var e = s.ends || [
            { x: s.x - 2, z: s.z },
            { x: s.x + 2, z: s.z },
          ],
          ax = e[0].x,
          az = e[0].z,
          bx2 = e[1].x,
          bz2 = e[1].z,
          len = Math.hypot(bx2 - ax, bz2 - az),
          ang = Math.atan2(bx2 - ax, bz2 - az);
        if (show < 1.5) {
          for (q = 0; q <= 4; q++) {
            var f = q / 4,
              px2 = ax + (bx2 - ax) * f,
              pz2 = az + (bz2 - az) * f;
            B.add("stone|f", bake(new THREE.DodecahedronGeometry(0.28, 0), px2, height(px2, pz2) + 0.12, pz2, 0, 0, 0, 1, 0.5, 1));
          }
        } else {
          var y2 = Math.max(height(ax, az), height(bx2, bz2)) + 0.2;
          for (q = -1; q <= 1; q += 2) B.add("wood|f", bake(cyl(0.16, 0.18, len + 0.6, 6), (ax + bx2) / 2 + Math.cos(ang) * q * 0.22, y2, (az + bz2) / 2 - Math.sin(ang) * q * 0.22, Math.PI / 2, ang, 0));
          if (show >= 2.5 && !far) for (q = -1; q <= 1; q += 2) B.add("wood|f", bake(box(0.06, 0.06, len), (ax + bx2) / 2 + Math.cos(ang) * q * 0.55, y2 + 0.8, (az + bz2) / 2 - Math.sin(ang) * q * 0.55, 0, ang, 0));
        }
        return;
      }
      // the rest (workshop, chimes, lookout, ...): a simple post-and-roof or cairn
      if (s.kind === "lookout") {
        for (q = 0; q < 5; q++) B.add("stone|f", bake(new THREE.DodecahedronGeometry(0.5 - q * 0.07, 0), s.x, h0 + 0.3 + q * 0.42, s.z, R() * 3, R() * 3, 0));
        if (show >= 1.5) B.add("wood|f", bake(box(2.2, 0.15, 2.2), s.x, h0 + 2.6, s.z));
        return;
      }
      if (s.kind === "chimes") {
        B.add("post|f", bake(box(0.1, 2, 0.1), s.x - 0.6, h0 + 1, s.z));
        B.add("post|f", bake(box(0.1, 2, 0.1), s.x + 0.6, h0 + 1, s.z));
        B.add("wood|f", bake(box(1.4, 0.1, 0.1), s.x, h0 + 2, s.z));
        if (!far) for (q = 0; q < Math.ceil(show * 2); q++) B.add("stone|f", bake(box(0.08, 0.5, 0.04), s.x - 0.45 + q * 0.18, h0 + 1.6, s.z));
        return;
      }
      if (show > 0.05) {
        B.add("wood|f", bake(box(rad * 0.9, 0.8, rad * 0.45), s.x, h0 + 0.4, s.z, 0, rot, 0));
        if (show >= 2.5) {
          for (q = 0; q < 4; q++) B.add("post|f", bake(cyl(0.06, 0.07, 2.2, 5), s.x + Math.cos(q * 1.57 + 0.78) * rad * 0.8, h0 + 1.1, s.z + Math.sin(q * 1.57 + 0.78) * rad * 0.8));
          B.add((show >= 3.5 ? "tile" : "thatch") + "|f", bake(new THREE.ConeGeometry(rad * 1.2, 0.9, 4), s.x, h0 + 2.5, s.z, 0, 0.78, 0));
        }
      }
    }
    function addDam(B, s, far) {
      var cd = vw.dams && vw.dams[s.id],
        i = creekNodeIndex(s.z),
        n = vw.nodes ? vw.nodes[i] : null;
      if (!n) return;
      var z = n.z,
        cx = T.creekX(z),
        bed = n.bed,
        crest = cd ? cd.crest : bed + 0.3,
        hw = 0.5 * creekTopWidth(n) + 0.4,
        dir = T.creekX(z + 0.5) - T.creekX(z - 0.5),
        ang = Math.atan2(dir, 1) + Math.PI / 2,
        lv = s.level || 0,
        bl = s.building,
        stage = bl ? bl.stage : 9,
        R = rnd(s.id * 13 + 1),
        nPost = Math.max(3, Math.round((2 * hw) / 0.45));
      // the posts, a metre tall, hammered into the bed
      for (var q = 0; q < nPost; q++) {
        var u = (q / (nPost - 1)) * 2 - 1,
          px = cx + Math.cos(ang) * u * hw,
          pz = z - Math.sin(ang) * u * hw,
          gy = Math.max(bed, height(px, pz)),
          top = Math.max(crest + 0.25, gy + 0.6);
        B.add("post|f", bake(cyl(0.05, 0.06, top - gy + 0.3, far ? 4 : 6), px, (top + gy - 0.3) / 2, pz, (R() - 0.5) * 0.08, 0, (R() - 0.5) * 0.08));
      }
      if (lv < 1 && stage < 1) return;
      // the weave between them, and the mud and stones packed against the upstream face
      var span = 2 * hw,
        wy = (bed + crest) / 2;
      B.add("weave|f", bake(box(span, Math.max(0.15, crest - bed), 0.16), cx, wy, z, 0, ang - Math.PI / 2, 0));
      if (lv >= 2 || stage >= 3) B.add("mud|f", bake(box(span * 0.98, Math.max(0.12, crest - bed - 0.04), 0.5), cx - Math.sin(ang - Math.PI / 2) * 0.3, wy - 0.02, z - 0.3, 0, ang - Math.PI / 2, 0));
      if (s.apron || (cd && cd.apron) || lv >= 2) for (q = 0; q < (far ? 2 : 6); q++) B.add("stone|f", bake(new THREE.DodecahedronGeometry(0.16, 0), cx + (R() - 0.5) * span * 0.8, bed + 0.05, z + 0.5 + R() * 0.5, R() * 3, R() * 3, 0));
      if (lv >= 3 && !far)
        for (q = 0; q < 5; q++) {
          var a = R() * 6.28,
            dd = hw + 0.6 + R() * 1.5;
          B.add("willow|f", bake(new THREE.IcosahedronGeometry(0.45, 0), cx + Math.cos(a) * dd, height(cx + Math.cos(a) * dd, z - 1 - R() * 3) + 0.4, z - 1 - R() * 3));
        }
    }

    // ---- the jobs: build what each tile shows, inside a time budget ---------------------
    var JOBS = [],
      focus = { x: VW / 2, z: VL / 2, r: 60 };
    function thingsKey(Tl) {
      var parts = [];
      for (var r of vw.list("res").values()) if (tileOf(r.x, r.z) === Tl) parts.push(r.id + ":" + r.kind + ":" + (r.amt > 0 ? Math.ceil(r.amt / 3) : 0) + ":" + (r.pods || 0) + ":" + (r.stage || r.size || ""));
      for (var s of vw.list("structures").values()) if (tileOf(s.x, s.z) === Tl) parts.push(s.id + ":" + s.kind + ":" + s.level + ":" + (s.building ? s.building.level + "." + s.building.stage + "." + Math.floor((s.building.labor || 0) / 60) : "") + ":" + (s.kind === "dam" && vw.dams[s.id] ? vw.dams[s.id].crest.toFixed(2) : ""));
      return parts.join("|");
    }
    function buildThings(Tl, far) {
      var g = new THREE.Group(),
        B = new Batch(),
        det = W.detail;
      for (var r of vw.list("res").values()) if (tileOf(r.x, r.z) === Tl) addThing(B, r, det, far);
      for (var sc of SCENERY) if (tileOf(sc.x, sc.z) === Tl) addTree(B, sc, det, far);
      for (var s of vw.list("structures").values()) if (tileOf(s.x, s.z) === Tl) addStructure(B, s, far);
      B.build(g, { noShadow: far });
      return g;
    }
    function groundKey(Tl) {
      return vw.creekV + "|" + vw.waterV + "|" + W.overlay + "|" + vw.season;
    }
    function farTile(Tl) {
      var g = new THREE.Group();
      g.name = "Far_" + Tl.i + "_" + Tl.j;
      var land = groundMesh(Tl, Tl.inner ? 1 : 4);
      land.receiveShadow = false;
      g.add(land);
      if (Tl.inner) {
        creekRibbon(Tl, g, 2, 3);
        floorWater(Tl, g);
        branchWater(Tl, g, 3);
      }
      g.add(buildThings(Tl, true));
      g.traverse((o) => o.isMesh && (o.castShadow = false));
      return g;
    }
    function nearTile(Tl) {
      var g = new THREE.Group();
      g.name = "Near_" + Tl.i + "_" + Tl.j;
      var land = groundMesh(Tl, CSD[W.detail - 1]);
      g.add(land);
      plants(Tl, g, land);
      creekRibbon(Tl, g, 0.5, [5, 7, 9, 11, 12, 13][W.detail - 1]);
      floorWater(Tl, g);
      branchWater(Tl, g, 5);
      g.add(buildThings(Tl, false));
      return g;
    }
    function dispose(g) {
      if (g) g.traverse((o) => o.isMesh && o.geometry.dispose());
    }
    function tileDist(Tl, x, z) {
      var dx = Math.max(Tl.x0 - x, 0, x - (Tl.x0 + TILE)),
        dz = Math.max(Tl.z0 - z, 0, z - (Tl.z0 + TILE));
      return Math.hypot(dx, dz);
    }
    // which tiles need (re)building: far ones whenever what they show has changed, near ones
    // round the focus when the view is close enough to need them
    function plan() {
      JOBS.length = 0;
      for (var Tl of TIL) {
        var gk = groundKey(Tl),
          tk = Tl.inner ? thingsKey(Tl) : "scenery",
          key = gk + "#" + tk,
          d = tileDist(Tl, focus.x, focus.z),
          wantNear = Tl.inner && focus.r < 90 && d < focus.r;
        Tl.dist = d;
        if (Tl.farKey !== key) JOBS.push({ T: Tl, far: true, key, d });
        if (wantNear && (Tl.nearKey !== key || !Tl.near)) JOBS.push({ T: Tl, far: false, key, d });
        if (!wantNear && Tl.near && d > focus.r + 30) {
          NEARG.remove(Tl.near);
          dispose(Tl.near);
          Tl.near = null;
          Tl.nearKey = "";
          if (Tl.far) Tl.far.visible = true;
        }
      }
      JOBS.sort((a, b) => (a.far === b.far ? a.d - b.d : a.far ? (a.T.far ? 1 : -1) : -1));
    }
    function run(budget) {
      var t0 = performance.now();
      while (JOBS.length && performance.now() - t0 < budget) {
        var J = JOBS.shift(),
          Tl = J.T;
        if (J.far) {
          var g = farTile(Tl);
          if (Tl.far) FARG.remove(Tl.far), dispose(Tl.far);
          Tl.far = g;
          Tl.farKey = J.key;
          FARG.add(g);
          g.visible = !Tl.near;
        } else {
          var gn = nearTile(Tl);
          if (Tl.near) NEARG.remove(Tl.near), dispose(Tl.near);
          Tl.near = gn;
          Tl.nearKey = J.key;
          NEARG.add(gn);
          if (Tl.far) Tl.far.visible = false;
        }
      }
      return JOBS.length;
    }
    var lastPlan = 0;
    W.stream = function (x, z, r, budget) {
      focus.x = x;
      focus.z = z;
      focus.r = r;
      if (performance.now() - lastPlan > 500 || !JOBS.length) (lastPlan = performance.now()), plan();
      return run(budget == null ? 6 : budget);
    };
    W.ensure = function () {
      plan();
      while (JOBS.length) run(1e9);
    };
    // the water's surface at (x, z), or null where it is dry: the creek in its trench, water
    // standing on the floor, the branches (for the creatures, the mist and the rain's rings)
    W.water = function (x, z) {
      if (vw.nodes && z > -24 && z < VL + 24) {
        var f = clamp((z - CREEK.z0) / CREEK.ds, 0, vw.nodes.length - 1.0001),
          i = Math.floor(f),
          t = f - i,
          a = vw.nodes[i],
          b = vw.nodes[i + 1],
          lerp = (k) => a[k] + (b[k] - a[k]) * t,
          bed = lerp("bed"),
          wl = lerp("wl");
        if (wl > bed + 0.008) {
          var n = { wb: lerp("wb"), m: lerp("m"), fp: lerp("fp"), bed, bw: lerp("bw"), bz: lerp("bz") };
          if (Math.abs(x - T.creekX(z)) < 0.5 * creekWidthAt(n, wl - bed) && wl > height(x, z) + 0.01) return wl;
        }
      }
      var g = G();
      if (g && x >= 0 && z >= 0 && x < VW && z < VL) {
        var k = Math.floor(z) * VW + Math.floor(x);
        if (g.wt[k] > height(x, z) + 0.01) return g.wt[k];
      }
      if (vw.br)
        for (var br of Object.values(T.branches)) {
          var d = cf2BranchDist(br, x, z);
          if (!d || d.o > br.HW[d.i] * 0.85) continue;
          var ws = cf2BranchWater({ terrain: T, creek: { br: vw.br, flood: vw.flood }, t: vw.t }, br, d.i);
          if (ws != null && ws > height(x, z) + 0.01) return ws;
        }
      return null;
    };
    W.CUT = CUT;
    W.setOverlay = function (o) {
      W.overlay = o;
    };
    W.busy = () => JOBS.length;
    W.paint = paint;
    W.palette = palette;
    return W;
  }

  return { create, paint, palette, PAINT, TILE };
})();

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
    tile2: ["#7a4a2a", "#a2683c", "#c08a5a"], // a browner clay
    tile3: ["#6a3428", "#8a4434", "#a85a46"], // a darker one
    thatch2: ["#7a6a3e", "#9e8a52", "#c0aa6e"], // older, greyer thatch
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
  // the owners' colours, for their doors (Creekfolk 1's 3C), and what the grove's logs grow
  CF2_FUR.forEach((r, i) => (PAINT["fur" + i] = r));
  PAINT.lodge = ["#4e3a28", "#5e4630", "#7a5c40"];
  PAINT.hearth = ["#e8a040", "#ffd27a", "#fff0c0"]; // windows lit at night
  var FOAM = { water: "#eef6f6", waterC: "#eef6f6", pond: "#b4ccb0", mudW: "#d9cba8" };
  var REFL = { water: "#a9ccd8", waterC: "#acdad8", pond: "#729480", mudW: "#9caaa8" };
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
    TX0 = -8,
    TX1 = Math.ceil(VW / TILE) + 8,
    TZ0 = -7,
    TZ1 = Math.ceil(VL / TILE) + 7,
    RING = 4; // tiles more than this many from the valley are the distant hills: coarse, bare of things
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
    var fl = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400).rotateX(-Math.PI / 2), paint("soil", { side: true }));
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
    // The branches' channels are narrower than the simulation's metre grid, which draws them as
    // staircases; drawn, they are carved again from their own smooth lines, the same way
    // cf2CarveBranches carves the grid (a bed D deep and HW wide, banks about as steep as tall).
    var BRL = Object.values(T.branches);
    function branchNear(x, z) {
      var best = null;
      for (var b of BRL) {
        var bx = b.box;
        if (x < bx[0] - 7 || x > bx[2] + 7 || z < bx[1] - 7 || z > bx[3] + 7) continue;
        var d = cf2BranchDist(b, x, z);
        if (d && d.o < 6 && (!best || d.o - b.HW[d.i] < best.o - best.hw)) best = { b, i: d.i, o: d.o, hw: b.HW[d.i], D: b.D[d.i] };
      }
      return best;
    }
    function branchCut(bn) {
      return bn ? Math.max(0, bn.D - Math.max(0, bn.o - bn.hw) / 0.9) : 0;
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
        bn = sampV(T.brCut, x, z) > 0 || branchBoxed(x, z) ? branchNear(x, z) : null,
        C = bn ? T.brCut : null,
        at = (k) => (C ? h[k] + C[k] : h[k]),
        r = [];
      for (var j = -1; j <= 2; j++) {
        var zz = clamp(iz + j, 0, VL) * N1;
        r.push(cr(at(zz + clamp(ix - 1, 0, VW)), at(zz + ix), at(zz + clamp(ix + 1, 0, VW)), at(zz + clamp(ix + 2, 0, VW)), fx));
      }
      var v = cr(r[0], r[1], r[2], r[3], fz),
        lo = Math.min(r[1], r[2]) - 0.15;
      v = v < lo ? lo : v; // no dips below the grid (they would hold water that isn't there)
      return bn ? v - branchCut(bn) : v;
    }
    // near a branch's channel at all (the grid's carving reaches about a metre past its banks)
    function branchBoxed(x, z) {
      var ix = Math.floor(x),
        iz = Math.floor(z);
      for (var dz = -1; dz <= 2; dz++) for (var dx = -1; dx <= 2; dx++) if (T.brCut[clamp(iz + dz, 0, VL) * N1 + clamp(ix + dx, 0, VW)] > 0) return true;
      return false;
    }
    W.height = height;

    // what the ground is at (x, z), from the simulation's state. The simulation's grids hold a
    // metre to a cell; read cell by cell they draw the land in squares. Read smoothly between
    // cells, with a little wandering noise on every edge, the same state draws as patches,
    // drifts and shores.
    var G = () => vw.grids,
      soilWet = () => (vw.soil != null ? vw.soil : 0.7),
      NZ = T.noise;
    function nodeAt(z) {
      var ns = vw.nodes,
        f = clamp((z - CREEK.z0) / CREEK.ds, 0, ns.length - 1.0001),
        i = Math.floor(f);
      return ns[f - i < 0.5 ? i : i + 1];
    }
    // the creek's levels at z, between its points
    var NL = { wl: 0, bed: 0, bz: 0, bw: 0, veg: 0 };
    function levelsAt(z) {
      var ns = vw.nodes,
        f = clamp((z - CREEK.z0) / CREEK.ds, 0, ns.length - 1.0001),
        i = Math.floor(f),
        t = f - i,
        a = ns[i],
        b = ns[i + 1];
      NL.wl = a.wl + (b.wl - a.wl) * t;
      NL.bed = a.bed + (b.bed - a.bed) * t;
      NL.bz = a.bz + (b.bz - a.bz) * t;
      NL.bw = t < 0.5 ? a.bw : b.bw;
      NL.veg = a.veg + (b.veg - a.veg) * t;
      return NL;
    }
    // a grid of cells (VW x VL), read between cell centres
    function samp(a, x, z) {
      var fx = clamp(x - 0.5, 0, VW - 1.0001),
        fz = clamp(z - 0.5, 0, VL - 1.0001),
        i = Math.floor(fx),
        j = Math.floor(fz),
        u = fx - i,
        v = fz - j,
        k = j * VW + i;
      return (a[k] + (a[k + 1] - a[k]) * u) * (1 - v) + (a[k + VW] + (a[k + VW + 1] - a[k + VW]) * u) * v;
    }
    // the same, smoother (Catmull-Rom, held between the four nearest cells so it never overshoots):
    // for the water table, whose cells meet in steps
    function sampC(a, x, z) {
      var fx = clamp(x - 0.5, 0, VW - 1.0001),
        fz = clamp(z - 0.5, 0, VL - 1.0001),
        i = Math.floor(fx),
        j = Math.floor(fz),
        u = fx - i,
        v = fz - j,
        row = (jj) => {
          var k = clamp(jj, 0, VL - 1) * VW;
          return cr(a[k + clamp(i - 1, 0, VW - 1)], a[k + i], a[k + Math.min(i + 1, VW - 1)], a[k + clamp(i + 2, 0, VW - 1)], u);
        },
        val = cr(row(j - 1), row(j), row(j + 1), row(j + 2), v),
        k0 = j * VW + i,
        lo = Math.min(a[k0], a[k0 + 1], a[k0 + VW], a[k0 + VW + 1]),
        hi = Math.max(a[k0], a[k0 + 1], a[k0 + VW], a[k0 + VW + 1]);
      return val < lo ? lo : val > hi ? hi : val;
    }
    // a grid of vertices ((VW + 1) x (VL + 1)), read between them
    function sampV(a, x, z) {
      var fx = clamp(x, 0, VW - 0.0001),
        fz = clamp(z, 0, VL - 0.0001),
        i = Math.floor(fx),
        j = Math.floor(fz),
        u = fx - i,
        v = fz - j,
        k = j * N1 + i;
      return (a[k] + (a[k + 1] - a[k]) * u) * (1 - v) + (a[k + N1] + (a[k + N1 + 1] - a[k + N1]) * u) * v;
    }
    // wandering noise, -1..1: broad patches, and a finer grain for their edges
    function blobN(x, z) {
      return 2 * NZ.fbm(x * 0.09 + 31, z * 0.09 + 17, 3) - 1;
    }
    function fineN(x, z) {
      return 2 * NZ.get(x * 0.9 + 5.5, z * 0.9 + 9.5) - 1;
    }
    // the woods on the hills round the rim, where nobody walks: 0 open .. 1 deep in them
    function woodsAt(x, z) {
      var r = T.valleyR(x, z);
      if (r < 0.88) return 0;
      return sst(0.88, 1.0, r) * sst(0.4, 0.6, NZ.fbm(x * 0.028 + 3, z * 0.028 + 71, 2));
    }
    W.woodsAt = woodsAt;
    function grassBy(gr, x, z) {
      // green, straw, dust: patches with ragged edges, never squares
      var g = gr + 0.1 * blobN(x, z) + 0.05 * fineN(x, z);
      if (g > 0.66) {
        var v = NZ.get(x * 0.21 + 50, z * 0.21 + 50) + 0.1 * fineN(x * 1.3, z * 1.3);
        return v > 0.8 && x > -2 && x < VW + 2 ? TI.grassL : v < 0.17 ? TI.grassD : TI.grass;
      }
      if (g > 0.44) return TI.strawL;
      if (g > 0.26) return TI.straw;
      return TI.dust;
    }
    function typeAt(x, z, h, slope) {
      var inside = x >= 0 && z >= 0 && x < VW && z < VL,
        g = G(),
        ov = W.overlay;
      if (ov && g && inside) {
        var k = Math.floor(z) * VW + Math.floor(x);
        if (ov === "wet") return g.wet[k] > 0.66 ? TI.ovD : g.wet[k] > 0.35 ? TI.ovC : g.wet[k] > 0.05 ? TI.ovB : TI.ovA;
        if (ov === "wear") return g.wear[k] > 6 ? TI.ovE : g.wear[k] > 2 ? TI.ovF : g.wear[k] > 0.5 ? TI.ovB : TI.ovA;
        if (ov === "stage" && T.floorWeight(x, z) > 0.5) {
          var st = nodeAt(z).stage;
          return st === "0" ? TI.ovD : st === "I" || st === "V" ? TI.ovG : st === "IV" ? TI.ovF : TI.ovE;
        }
        if (ov === "cap" && T.floorWeight(x, z) > 0.5) return g.green[k] > 0.66 ? TI.ovG : g.green[k] > 0.33 ? TI.ovF : TI.ovE;
      }
      // the bluff's face, and any ground as steep: limestone in layers
      var bl = T.bluffAt(x, z);
      if ((bl > 0.03 && slope > 0.55) || (!inside && slope > 1.9)) {
        if (slope < 0.9) return TI.limeD;
        // in layers where the cells are fine enough to show them; plain rock from farther off
        return CELL > 0.6 || Math.floor(h * 1.45 + 0.15 * Math.sin(x * 0.5 + z * 0.23)) % 3 !== 1 ? TI.lime : TI.limeD;
      }
      var wd = woodsAt(x, z);
      if (!inside) {
        // beyond the valley: the hills, green or dry with the topsoil, dark under the woods
        if (wd > 0.5) return fineN(x * 0.7, z * 0.7) > 0.35 ? TI.moss : TI.grassD;
        return grassBy(soilWet(), x, z);
      }
      // in the creek's trench: the bed under the water, gravel at its foot and on the bars,
      // the bench, bare mud and clay up the banks until plants hold them
      if (vw.nodes && sampV(T.cut, x, z) > 0.05) {
        var n = levelsAt(z);
        if (Math.abs(z - T.zLedge) < 0.9 + 0.35 * fineN(x * 1.5, z) && h < n.wl + 0.15) return TI.limeBed;
        if (h < n.wl - 0.02) return TI.bed;
        if (h < n.bed + 0.1 + 0.03 * fineN(x * 2, z * 2)) return TI.gravel;
        if (n.bw > 0.05 && Math.abs(h - n.bz) < 0.08) return n.veg > 0.5 ? TI.grassD : TI.gravel;
        return n.veg > 0.62 ? TI.grassD : slope > 0.6 ? TI.clay : TI.mud;
      }
      // in a branch's channel: the Dry Fork's pale bed, the spring's moss and gravel
      var bn = branchBoxed(x, z) ? branchNear(x, z) : null,
        bc = branchCut(bn);
      if (bc > 0.06) {
        var sp = T.branches.spring.head,
          e = bn.o - bn.hw + 0.08 * fineN(x * 1.7, z * 1.7);
        if (Math.hypot(x - sp.x, z - sp.z) < 4 + 0.6 * fineN(x, z)) return TI.moss;
        if (bn.b.id === "dry") return e < 0.1 ? TI.limeBed : e < 0.6 ? TI.lime : TI.gravel;
        return e < 0 ? TI.gravel : TI.moss;
      }
      if (!g) return TI.grass;
      var wear = samp(g.wear, x, z) * (1 + 0.22 * fineN(x * 1.6, z * 1.6));
      if (wear > 5) return TI.path;
      if (wear > 2.2) return TI.pathE;
      if (samp(g.wt, x, z) > h + 0.02) return TI.mud; // under standing water (drawn over it)
      var wet = samp(g.wet, x, z) + 0.07 * blobN(x * 2.2, z * 2.2) + 0.04 * fineN(x, z);
      if (wet > 0.55) return fineN(x * 1.4 + 3, z * 1.4) < -0.4 ? TI.mud : TI.grassD;
      if (wet > 0.25) return TI.marsh;
      if (slope > 1.1) return T.valleyR(x, z) > 0.88 ? (slope > 1.9 ? TI.limeD : TI.grassD) : TI.clay;
      if (wd > 0.5) return fineN(x * 0.7, z * 0.7) > 0.35 ? TI.moss : TI.grassD;
      return grassBy(samp(g.green, x, z), x, z);
    }

    // ---- ground tiles ----------------------------------------------------------------
    var CSD = [0.5, 0.4, 0.32, 0.25, 0.2, 0.2],
      TIL = [];
    for (var tj = TZ0; tj < TZ1; tj++)
      for (var ti = TX0; ti < TX1; ti++) {
        let x0 = ti * TILE,
          z0 = tj * TILE,
          inner = ti >= 0 && tj >= 0 && x0 < VW && z0 < VL,
          ring = Math.max(-ti, ti - (Math.ceil(VW / TILE) - 1), -tj, tj - (Math.ceil(VL / TILE) - 1), 0),
          distant = ring > RING;
        TIL.push({ i: ti, j: tj, x0, z0, inner, distant, far: null, near: null, job: null, key: "", thingsKey: "", things: null });
      }
    W.tiles = TIL;
    var CELL = 1; // the size of the cells being typed now (layers of rock show only in fine ones)
    function groundMesh(Tl, cs) {
      CELL = cs;
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
    // water standing on the floor: ponds that rose over their banks, marsh pools, side channels,
    // and the water along the branches. A sheet at the water table's level (read smoothly between
    // the simulation's cells) wherever it stands above the ground somewhere in a quad; where it
    // runs below the ground the ground hides it, so the shore follows the ground's own curves.
    // The creek's trench is the creek's (its ribbon), except where the floor's water stands over it.
    var BRW = [null, T.branches.spring, T.branches.dry];
    function branchOf(x, z) {
      var bn = branchBoxed(x, z) ? branchNear(x, z) : null;
      if (!bn || bn.o > bn.hw + 0.5) return 0;
      return bn.b.id === "spring" ? 1 : 2;
    }
    function floorWater(Tl, into, cs) {
      var g = G();
      if (!g || !Tl.inner) return;
      var n = Math.round(TILE / cs),
        V1 = n + 1,
        L = new Float32Array(V1 * V1),
        D = new Float32Array(V1 * V1),
        any = false,
        i,
        j;
      for (j = 0; j <= n; j++)
        for (i = 0; i <= n; i++) {
          var x = Tl.x0 + i * cs,
            z = Tl.z0 + j * cs,
            k = j * V1 + i;
          if (x > VW || z > VL) {
            D[k] = -9;
            continue;
          }
          L[k] = sampC(g.wt, x, z);
          D[k] = L[k] - height(x, z);
          // in the creek's trench, below the floor: that water is the creek's
          if (D[k] > -0.02 && sampV(T.cut, x, z) > 0.1 && L[k] < T.fpAt(z) - 0.02) D[k] = -9;
          if (D[k] > 0.005) any = true;
        }
      if (!any) return;
      var pos = [],
        flo = [],
        dep = [],
        edg = [],
        uvs = [],
        vid = new Int32Array(V1 * V1).fill(-1),
        idxK = [[], [], []],
        spD = vw.br && vw.br.dry && vw.br.dry.state === "running" ? 1.0 : 0.04;
      function vert(i, j) {
        var k = j * V1 + i;
        if (vid[k] >= 0) return vid[k];
        var x = Tl.x0 + i * cs,
          z = Tl.z0 + j * cs,
          d = clamp(D[k], -0.3, 3),
          kb = branchOf(x, z),
          fx = 0,
          fz = 0;
        if (kb) {
          var br = BRW[kb],
            dd = cf2BranchDist(br, x, z),
            i0 = Math.max(0, dd.i - 1),
            i1 = Math.min(br.n - 1, dd.i + 1),
            tx = br.X[i1] - br.X[i0],
            tz = br.Z[i1] - br.Z[i0],
            l = Math.hypot(tx, tz) || 1,
            sp = kb === 1 ? 0.45 : spD;
          fx = (tx / l) * sp;
          fz = (tz / l) * sp;
        }
        pos.push(x, L[k], z);
        flo.push(fx, fz);
        dep.push(d);
        edg.push(clamp(1 - d / 0.12, 0, 1));
        uvs.push(x, z);
        return (vid[k] = pos.length / 3 - 1);
      }
      for (j = 0; j < n; j++)
        for (i = 0; i < n; i++) {
          var a0 = j * V1 + i,
            dmax = Math.max(D[a0], D[a0 + 1], D[a0 + V1], D[a0 + V1 + 1]);
          if (dmax <= 0.005 || Math.min(D[a0], D[a0 + 1], D[a0 + V1], D[a0 + V1 + 1]) < -8) continue;
          var A = vert(i, j),
            B = vert(i + 1, j),
            C = vert(i, j + 1),
            Dd = vert(i + 1, j + 1);
          idxK[branchOf(Tl.x0 + (i + 0.5) * cs, Tl.z0 + (j + 0.5) * cs)].push(A, C, B, B, C, Dd);
        }
      ["pond", "waterC", vw.flood || spD > 0.5 ? "mudW" : "water"].forEach(function (key, kc) {
        if (!idxK[kc].length) return;
        var m = new THREE.Mesh(waterGeo(pos, idxK[kc], flo, dep, edg, uvs), paint(key, { water: true }));
        m.receiveShadow = true;
        m.name = "FloorWater_" + key;
        into.add(m);
      });
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
      var v = r.kind === "podtree" ? "pod" : r.tk || r.variant || "oak";
      return v === "pine" ? "cedar" : v === "birch" ? "syc" : v === "willow" ? "willow" : v === "pod" ? "pecan" : v === "gold" ? "gold" : v === "elm" ? "elm" : "oak";
    }
    function treeSize(r) {
      if (r.kind === "grove") return clamp(0.62 * groveSize(vw, r), 0.2, 3.2); // grove trees grow all their lives, the founders' into giants
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
      // winter: the birches, elms and pecans stand bare (the live oaks and cedars keep theirs)
      if (vw.season === "winter" && (kind === "syc" || kind === "elm" || kind === "pecan")) return bareTree(B, kind, x, h, z, sz, TR, Dd);
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
    // a tree in winter: the trunk and its limbs, forking twice toward the sky, a few twigs
    function bareTree(B, kind, x, h, z, sz, TR, Dd) {
      var bark = kind === "syc" ? "syc" : "trunk",
        th = (kind === "syc" ? 2.2 : 1.6) * sz,
        tw = (kind === "syc" ? 0.24 : 0.28) * sz;
      trunk(B, bark, x, h, z, tw, th, TR, (TR() - 0.5) * 0.1, Dd);
      var limbs = 3 + ((TR() * 2) | 0);
      for (var q = 0; q < limbs; q++) {
        var a = (q / limbs) * 6.28 + TR(),
          tilt = 0.45 + TR() * 0.35,
          len = (1.1 + TR() * 0.5) * sz,
          bx = x + Math.cos(a) * Math.sin(tilt) * len * 0.5,
          bz = z + Math.sin(a) * Math.sin(tilt) * len * 0.5,
          by = h + th + Math.cos(tilt) * len * 0.5 - 0.1;
        B.add(bark + "|f", bake(cyl(tw * 0.22, tw * 0.4, len, Dd > 2 ? 5 : 4), bx, by, bz, Math.sin(a) * tilt, 0, -Math.cos(a) * tilt));
        if (Dd > 2)
          for (var f = 0; f < 2; f++) {
            var a2 = a + (f ? 0.6 : -0.6),
              t2 = tilt + 0.25,
              l2 = len * 0.6,
              ex = x + Math.cos(a) * Math.sin(tilt) * len,
              ez = z + Math.sin(a) * Math.sin(tilt) * len,
              ey = h + th + Math.cos(tilt) * len - 0.15;
            B.add(bark + "|f", bake(cyl(tw * 0.1, tw * 0.2, l2, 4), ex + Math.cos(a2) * Math.sin(t2) * l2 * 0.5, ey + Math.cos(t2) * l2 * 0.5, ez + Math.sin(a2) * Math.sin(t2) * l2 * 0.5, Math.sin(a2) * t2, 0, -Math.cos(a2) * t2));
          }
      }
    }
    function farTree(B, r) {
      var h = height(r.x, r.z),
        sz = treeSize(r),
        kind = treeKindOf(r);
      if (kind === "cedar") return B.add("cedar|f", bake(new THREE.ConeGeometry(0.9 * sz, 2.6 * sz, 6), r.x, h + 1.55 * sz, r.z));
      if (vw.season === "winter" && (kind === "syc" || kind === "elm" || kind === "pecan")) {
        B.add((kind === "syc" ? "syc" : "trunk") + "|f", bake(box(0.25 * sz, 2.2 * sz, 0.25 * sz), r.x, h + 1.1 * sz, r.z));
        return B.add("trunk|f", bake(new THREE.ConeGeometry(1.0 * sz, 1.6 * sz, 5, 1, true), r.x, h + 2.6 * sz, r.z, Math.PI, r.id % 7, 0));
      }
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
      for (var q = 0; q < 5200; q++) {
        var x = -120 + R() * (VW + 240),
          z = -90 + R() * (VL + 180),
          r = T.valleyR(x, z),
          wd = woodsAt(x, z);
        if (r < 0.92 || Math.abs(x - T.creekX(z)) < 6) continue;
        if (T.bluffAt(x, z) > 0.03 && T.bluffAt(x, z) < 0.985) continue;
        if (R() > 0.1 + 0.9 * wd) continue;
        // pines and oaks deep in the woods, elms and pale birches at their edges and in the open
        var k = R() + 0.35 * (1 - wd);
        SCENERY.push({ id: id--, kind: "tree", variant: k < 0.42 ? "pine" : k < 0.85 ? "oak" : k < 1.08 ? "elm" : "birch", x, z });
      }
    })();
    // the bluff (What the Water Brings' way): slabs of limestone standing out of its face and
    // blocks fallen at its foot; and the ledge across the creek, where the cutting-down stopped
    var ROCKS = [];
    (function () {
      var R = rnd(hash2(VL, 77) ^ 0x5bd1),
        prev = null;
      for (var z = 54; z < 216; z += 0.8) {
        var ax = T.axisX(z),
          hw = T.halfWAt(z),
          xf = null,
          xt = null;
        for (var x = ax + 0.72 * hw; x < ax + 1.0 * hw; x += 0.2) {
          var b = T.bluffAt(x, z);
          if (xf == null && b > 0.05) xf = x;
          if (xf != null && b > 0.95) {
            xt = x;
            break;
          }
        }
        if (xf == null || xt == null) {
          prev = null;
          continue;
        }
        var foot = height(xf - 0.3, z),
          top = height(xt + 0.3, z),
          H = top - foot,
          yaw = prev == null ? 0 : -Math.atan2(xf - prev, 0.8);
        prev = xf;
        if (H < 1.5) continue;
        if (R() < 0.6) {
          var f = 0.12 + R() * 0.8;
          ROCKS.push({ x: xf + f * (xt - xf) - 0.2, y: foot + f * H, z, w: 0.8 + R() * 1.6, h: 0.16 + R() * 0.16, d: 0.5 + R() * 0.5, yaw, rz: (R() - 0.5) * 0.12, key: R() < 0.5 ? "limeD" : "lime", slab: true });
        }
        if (R() < 0.28) {
          var o = 0.3 + R() * 1.2,
            r = 0.22 + R() * 0.42;
          ROCKS.push({ x: xf - o, y: height(xf - o, z), z: z + (R() - 0.5) * 0.6, r, key: R() < 0.6 ? "lime" : "limeD", rx: R() * 3, ry: R() * 3 });
        }
      }
      // the ledge: a lip of pale rock across the bed, and its broken edges up both banks
      if (vw.nodes) {
        var zl = T.zLedge,
          i = creekNodeIndex(zl),
          n = vw.nodes[i],
          cx = T.creekX(zl),
          wv = 0.5 * creekTopWidth(n);
        for (var u = -wv - 0.6; u <= wv + 0.6; u += 0.45) {
          var lx = cx + u,
            ly = Math.max(n.bed, height(lx, zl));
          ROCKS.push({ x: lx, y: ly - 0.06, z: zl + (R() - 0.5) * 0.3, w: 0.55, h: 0.18, d: 0.5 + R() * 0.4, yaw: (R() - 0.5) * 0.3, rz: (R() - 0.5) * 0.1, key: R() < 0.5 ? "limeBed" : "lime", slab: true });
        }
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
    // level, and while a level is being built it shows how far the work has got: walls rise,
    // then the roof goes on. (show runs from 0 to the number of levels: between n - 1 and n,
    // level n is going up.) Dams are beaver dam analogs: willow posts a metre tall across the
    // creek, branches woven between them, mud and stones packed on the upstream face.
    function addStructure(B, s, far) {
      var def = STRUCTURES[s.kind] || {},
        R = rnd(s.id * 31 + 7),
        rad = def.radius || 1.5,
        h0 = height(s.x, s.z),
        lv = s.level || 0,
        bl = s.building,
        progress = bl ? clamp((bl.stage + (bl.labor || 0) / Math.max(1, stageLaborNeeded(s) || 1)) / Math.max(1, (levelDef(s, bl.level) || { stages: [1] }).stages.length), 0, 1) : 1,
        show = Math.max(lv, bl ? bl.level + progress * 0.999 : 0),
        rot = s.rot || 0,
        seg = far ? 7 : 14,
        q,
        a;
      // how far level n has got: 0 not started .. 1 done
      var up = (n) => clamp(show - (n - 1), 0, 1);
      if (s.kind === "dam") return addDam(B, s, far);
      if (s.kind === "home") return addHome(B, s, far, show, up, R, rad, h0, rot, seg);
      if (s.kind === "skycal") return addSkycal(B, s, show, far);
      if (s.kind === "garden") {
        // beds of dark soil in wooden edging, planted in rows; a compost heap, a channel from
        // the water, a nursery of seedlings, a third bed
        var beds = s.beds || [],
          nb = show >= 5.05 ? 3 : show >= 1.05 ? 2 : 1;
        for (q = 0; q < nb; q++) {
          var bx = s.x + (q - (nb - 1) / 2) * rad * 0.62,
            bz = s.z,
            bh = height(bx, bz),
            bw = rad * 0.5,
            bd = rad * 1.3,
            f = q === 0 ? up(1) : q === 1 ? up(2) : up(6);
          if (f <= 0) continue;
          B.add("soil|f", bake(box(bw, 0.16, bd * f), bx, bh + 0.05, bz - bd * (1 - f) * 0.5, 0, rot, 0));
          if (!far && f >= 1) {
            for (var e = -1; e <= 1; e += 2) B.add("wood|f", bake(box(0.07, 0.2, bd + 0.07), bx + e * (bw / 2 + 0.03), bh + 0.07, bz, 0, rot, 0));
            var bed = beds[q],
              grow = !bed ? 0 : bed.state === "ready" ? 1 : bed.state === "growing" ? 0.25 + 0.6 * (bed.grow || 0) : 0;
            if (grow > 0)
              for (var rw = 0; rw < 4; rw++)
                for (var pl = 0; pl < 5; pl++) {
                  var pz = bz - bd * 0.4 + pl * bd * 0.2,
                    pxx = bx - bw * 0.3 + rw * bw * 0.2;
                  B.add((bed.state === "ready" && (rw + pl) % 3 === 0 ? "fyel" : "grass") + "|f", bake(new THREE.IcosahedronGeometry(0.07 + 0.08 * grow, 0), pxx, bh + 0.14 + 0.06 * grow, pz, R() * 3, R() * 3, 0, 1, 0.8 + grow, 1));
                }
          }
        }
        if (show > 2.05) {
          var cx2 = s.x + Math.cos(rot) * rad * 0.95,
            cz2 = s.z - Math.sin(rot) * rad * 0.95;
          B.add("mud|f", bake(new THREE.SphereGeometry(0.42, far ? 5 : 8, 4, 0, 6.28, 0, Math.PI / 2), cx2, height(cx2, cz2), cz2, 0, 0, 0, 1, 0.55 + 0.35 * up(3), 1));
          if (!far && show >= 3) for (q = 0; q < 6; q++) B.add("weave|f", bake(box(0.06, 0.4, 0.06), cx2 + Math.cos(q * 1.05) * 0.5, height(cx2, cz2) + 0.18, cz2 + Math.sin(q * 1.05) * 0.5));
        }
        if (show > 3.05 && !far) {
          var len = rad * 1.6 * up(4);
          B.add("bed|f", bake(box(0.22, 0.05, len), s.x - Math.cos(rot) * rad * 0.95, h0 + 0.01, s.z + Math.sin(rot) * rad * 0.95 - (rad * 1.6 - len) / 2, 0, rot, 0));
        }
        if (show > 4.05 && !far)
          for (q = 0; q < Math.ceil(6 * up(5)); q++) {
            var nx = s.x + (q - 2.5) * 0.3,
              nz = s.z + rad * 0.95;
            B.add("clay|f", bake(cyl(0.08, 0.06, 0.12, 6), nx, height(nx, nz) + 0.06, nz));
            B.add("grass|f", bake(new THREE.IcosahedronGeometry(0.08, 0), nx, height(nx, nz) + 0.2, nz, 0, R() * 3, 0, 1, 1.3, 1));
          }
        return;
      }
      if (s.kind === "store") {
        // a cleared ring of stakes, woven bins, a roof over them on posts, then a granary up
        // on legs with its own cone of thatch
        if (!far) for (q = 0; q < Math.ceil(8 * up(1)); q++) B.add("post|f", bake(cyl(0.03, 0.04, 0.5, 4), s.x + Math.cos(q * 0.785) * rad * 0.9, h0 + 0.2, s.z + Math.sin(q * 0.785) * rad * 0.9));
        for (q = 0; q < Math.ceil(5 * up(2)); q++) {
          a = (q / 5) * 6.28 + 0.3;
          B.add("weave|f", bake(cyl(0.33, 0.27, 0.62, far ? 5 : 9), s.x + Math.cos(a) * rad * 0.42, h0 + 0.31, s.z + Math.sin(a) * rad * 0.42));
          if (!far) B.add("thatch|f", bake(cyl(0.3, 0.33, 0.06, 9), s.x + Math.cos(a) * rad * 0.42, h0 + 0.64, s.z + Math.sin(a) * rad * 0.42));
        }
        if (show > 2.05) {
          var ph = 2.0 * up(3);
          for (q = 0; q < 4; q++) B.add("post|f", bake(cyl(0.07, 0.08, ph, 5), s.x + Math.cos(q * 1.57 + 0.78) * rad * 0.8, h0 + ph / 2, s.z + Math.sin(q * 1.57 + 0.78) * rad * 0.8));
          if (show >= 2.75) B.add((show >= 4 ? "tile" : "thatch") + "|f", bake(new THREE.ConeGeometry(rad * 1.2, 1.1, 4), s.x, h0 + 2.5, s.z, 0, 0.78, 0));
        }
        if (show > 3.05) {
          // the granary
          var gx = s.x - Math.sin(rot) * rad * 1.15,
            gz = s.z - Math.cos(rot) * rad * 1.15,
            gh = height(gx, gz),
            fg = up(4);
          for (q = 0; q < 4; q++) B.add("post|f", bake(cyl(0.06, 0.07, 0.7, 5), gx + Math.cos(q * 1.57) * 0.55, gh + 0.35, gz + Math.sin(q * 1.57) * 0.55));
          B.add("stone|f", bake(cyl(0.75, 0.75, 0.1, seg), gx, gh + 0.72, gz));
          if (fg > 0.3) B.add("mudwall|f", bake(cyl(0.68, 0.62, 1.0 * fg, seg), gx, gh + 0.77 + 0.5 * fg, gz));
          if (fg >= 1) B.add("thatch|f", bake(new THREE.ConeGeometry(0.95, 1.1, seg), gx, gh + 2.3, gz));
        }
        return;
      }
      if (s.kind === "meeting") {
        // the meeting stone, logs to sit on round it, lanterns on posts, then an open hall:
        // a ring of posts under one great roof (no walls, so it's still the meeting place)
        B.add("stone|f", bake(new THREE.DodecahedronGeometry(0.7, far ? 0 : 1), s.x, h0 + 0.35, s.z, 0, 0, 0, 1.2, 0.7, 1));
        for (q = 0; q < Math.ceil(6 * up(2)); q++) B.add("wood|f", bake(cyl(0.2, 0.22, 1.5, 6), s.x + Math.cos(q * 1.05) * rad * 0.75, h0 + 0.2, s.z + Math.sin(q * 1.05) * rad * 0.75, 0, -q * 1.05, Math.PI / 2));
        if (show > 2.05)
          for (q = 0; q < Math.ceil(4 * up(3)); q++) {
            var lx = s.x + Math.cos(q * 1.57 + 0.4) * rad * 0.98,
              lz = s.z + Math.sin(q * 1.57 + 0.4) * rad * 0.98;
            B.add("post|f", bake(cyl(0.05, 0.05, 1.6, 4), lx, h0 + 0.8, lz));
            if (!far) B.add("glow|g", bake(box(0.16, 0.18, 0.16), lx, h0 + 1.68, lz));
          }
        if (show > 3.05) {
          var fh = up(4),
            np = 8;
          for (q = 0; q < np; q++) B.add("post|f", bake(cyl(0.09, 0.1, 2.3 * fh, 6), s.x + Math.cos((q / np) * 6.28) * rad * 0.92, h0 + 1.15 * fh, s.z + Math.sin((q / np) * 6.28) * rad * 0.92));
          if (fh >= 1) {
            var re = rad * 1.08;
            B.add("thatch|f", bake(cyl(re * 0.64, re, 1.2, seg + 4), s.x, h0 + 2.85, s.z));
            B.add("thatch|f", bake(cyl(re * 0.32, re * 0.68, 1.1, seg + 4), s.x, h0 + 3.85, s.z));
            B.add("thatch|f", bake(new THREE.ConeGeometry(re * 0.36, 1.3, seg + 4), s.x, h0 + 4.95, s.z));
            B.add("wood|f", bake(cyl(0.05, 0.1, 0.4, 6), s.x, h0 + 5.7, s.z));
          }
        }
        return;
      }
      if (s.kind === "crossing") {
        // stepping stones, then a log bridge, then rails, across the creek
        var en = s.ends || [
            { x: s.x - 2, z: s.z },
            { x: s.x + 2, z: s.z },
          ],
          ax = en[0].x,
          az = en[0].z,
          bx2 = en[1].x,
          bz2 = en[1].z,
          ln = Math.hypot(bx2 - ax, bz2 - az),
          ang = Math.atan2(bx2 - ax, bz2 - az);
        if (show < 2) {
          var ns = Math.ceil(6 * up(1));
          for (q = 0; q < ns; q++) {
            var fq = (q + 0.5) / 6,
              px2 = ax + (bx2 - ax) * fq,
              pz2 = az + (bz2 - az) * fq;
            B.add("stone|f", bake(new THREE.DodecahedronGeometry(0.3, 0), px2, Math.max(height(px2, pz2), W.water(px2, pz2) || -9) + 0.04, pz2, R() * 3, R() * 3, 0, 1, 0.5, 1));
          }
        }
        if (show > 1.05) {
          var y2 = Math.max(height(ax, az), height(bx2, bz2)) + 0.2;
          for (q = -1; q <= 1; q += 2) if (show >= 1.5 || q < 0) B.add("wood|f", bake(cyl(0.16, 0.18, ln + 0.6, 6), (ax + bx2) / 2 + Math.cos(ang) * q * 0.22, y2, (az + bz2) / 2 - Math.sin(ang) * q * 0.22, Math.PI / 2, ang, 0));
          if (show > 2.05 && !far)
            for (q = -1; q <= 1; q += 2) {
              B.add("wood|f", bake(box(0.06, 0.06, ln * up(3)), (ax + bx2) / 2 + Math.cos(ang) * q * 0.55, y2 + 0.8, (az + bz2) / 2 - Math.sin(ang) * q * 0.55, 0, ang, 0));
              for (var pq = 0; pq <= 2; pq++) {
                var fp2 = pq / 2;
                B.add("post|f", bake(box(0.06, 0.8, 0.06), ax + (bx2 - ax) * fp2 + Math.cos(ang) * q * 0.55, y2 + 0.4, az + (bz2 - az) * fp2 - Math.sin(ang) * q * 0.55));
              }
            }
        }
        return;
      }
      if (s.kind === "lookout") {
        // a cairn of stones, then a platform on top of it
        for (q = 0; q < Math.ceil(5 * up(1)); q++) B.add("stone|f", bake(new THREE.DodecahedronGeometry(0.5 - q * 0.07, 0), s.x, h0 + 0.3 + q * 0.42, s.z, R() * 3, R() * 3, 0));
        if (show > 1.05) {
          for (q = 0; q < 4; q++) B.add("post|f", bake(cyl(0.05, 0.06, 2.6, 4), s.x + Math.cos(q * 1.57 + 0.78) * 0.95, h0 + 1.3, s.z + Math.sin(q * 1.57 + 0.78) * 0.95));
          if (show >= 1.6) B.add("wood|f", bake(box(2.2, 0.15, 2.2), s.x, h0 + 2.6, s.z));
        }
        return;
      }
      if (s.kind === "chimes") {
        // a frame, then plates, pipes and bells hung from it
        if (show > 0.05) {
          B.add("post|f", bake(box(0.1, 2, 0.1), s.x - 0.7, h0 + 1, s.z, 0, rot, 0));
          B.add("post|f", bake(box(0.1, 2, 0.1), s.x + 0.7, h0 + 1, s.z, 0, rot, 0));
          B.add("wood|f", bake(box(1.6, 0.1, 0.1), s.x, h0 + 2, s.z, 0, rot, 0));
        }
        if (!far)
          for (q = 0; q < 7; q++) {
            var kq = show > 3.05 && q % 2 ? "bell" : show > 2.05 && q % 3 === 1 ? "pipe" : "plate";
            if (q >= Math.ceil(7 * up(2)) && kq === "plate") continue;
            var hx = s.x - 0.54 + q * 0.18;
            if (kq === "plate") B.add("stone|f", bake(box(0.09, 0.32, 0.03), hx, h0 + 1.6, s.z, 0, rot, 0));
            else if (kq === "pipe") B.add("wood|f", bake(cyl(0.03, 0.03, 0.55, 6), hx, h0 + 1.55, s.z));
            else B.add("clay|f", bake(new THREE.ConeGeometry(0.08, 0.16, 8, 1, true), hx, h0 + 1.65, s.z));
          }
        return;
      }
      // the workshop and the rest: a bench, a drying rack, a roof on posts, then a tiled one
      if (show > 0.05) {
        B.add("wood|f", bake(box(rad * 0.9, 0.12, rad * 0.4), s.x, h0 + 0.72, s.z, 0, rot, 0));
        if (!far) for (q = 0; q < 4; q++) B.add("post|f", bake(box(0.08, 0.7, 0.08), s.x + ((q & 1) - 0.5) * rad * 0.8, h0 + 0.35, s.z + ((q >> 1) - 0.5) * rad * 0.3, 0, rot, 0));
        if (show > 1.05 && !far) {
          var rx2 = s.x - Math.sin(rot) * rad * 0.7,
            rz2 = s.z - Math.cos(rot) * rad * 0.7;
          B.add("post|f", bake(box(0.07, 1.4, 0.07), rx2 - 0.6, h0 + 0.7, rz2, 0, rot, 0));
          B.add("post|f", bake(box(0.07, 1.4, 0.07), rx2 + 0.6, h0 + 0.7, rz2, 0, rot, 0));
          for (q = 0; q < Math.ceil(3 * up(2)); q++) B.add("wood|f", bake(box(1.3, 0.05, 0.05), rx2, h0 + 0.6 + q * 0.35, rz2, 0, rot, 0));
        }
        if (show > 2.05) {
          var ph2 = 2.2 * up(3);
          for (q = 0; q < 4; q++) B.add("post|f", bake(cyl(0.06, 0.07, ph2, 5), s.x + Math.cos(q * 1.57 + 0.78) * rad * 0.8, h0 + ph2 / 2, s.z + Math.sin(q * 1.57 + 0.78) * rad * 0.8));
          if (show >= 2.75) B.add((show >= 3.6 ? "tile" : "thatch") + "|f", bake(new THREE.ConeGeometry(rad * 1.2, 1.0, 4), s.x, h0 + 2.6, s.z, 0, 0.78, 0));
        }
      }
    }
    // A home: a sleeping nest, a rain canopy over it on four posts, then a round mud hut with a
    // steep roof of thatch in three courses (clay tiles later), a deck round it (the raised
    // floor), and a smaller room on one side. A door with a frame, a window, a pot and a
    // woodpile by the wall.
    function addHome(B, s, far, show, up, R, rad, h0, rot, seg) {
      if (show <= 0.05) return;
      var wr = rad * 0.66,
        dx = Math.sin(rot),
        dz = Math.cos(rot),
        q,
        a,
        wallH = 1.35 + R() * 0.2,
        Hr = 2.15 + R() * 0.45,
        re = wr + 0.38;
      if (show < 3) {
        var nb = far ? 6 : 12,
          ring = show < 2.05 ? wr * 0.75 : wr * 0.45;
        for (q = 0; q < Math.ceil(nb * up(1)); q++) {
          a = (q / nb) * 6.28;
          B.add("wood|f", bake(cyl(0.05, 0.06, 1.0, 4), s.x + Math.cos(a) * ring, h0 + 0.1, s.z + Math.sin(a) * ring, 0, -a, Math.PI / 2));
        }
        if (show >= 0.6) B.add("thatch|f", bake(cyl(ring * 0.95, ring, 0.14, seg), s.x, h0 + 0.07, s.z));
        if (show > 1.05 && show < 2.6) {
          var ph = 2.0 * clamp((show - 1) / 0.6, 0.15, 1);
          for (q = 0; q < 4; q++) B.add("post|f", bake(cyl(0.05, 0.06, ph, 4), s.x + Math.cos(q * 1.57 + rot) * wr * 0.8, h0 + ph / 2, s.z + Math.sin(q * 1.57 + rot) * wr * 0.8));
          if (show >= 1.75) B.add("thatch|f", bake(new THREE.ConeGeometry(wr * 1.15, 0.95, seg), s.x, h0 + 2.4, s.z));
        }
        if (show > 2.05) {
          // the hut's walls going up round the nest
          var fw = clamp((show - 2) / 0.85, 0.08, 1);
          B.add("stone|f", bake(cyl(wr + 0.06, wr + 0.1, 0.28, seg), s.x, h0 + 0.1, s.z));
          B.add("mudwall|f", bake(cyl(wr * 0.95, wr, wallH * fw, seg), s.x, h0 + 0.05 + (wallH * fw) / 2, s.z));
        }
        return;
      }
      // each home's clay or reeds came from its own pit or patch: one of a few tones
      var roofK = show >= 3.6 ? ["tile", "tile2", "tile3"][s.id % 3] : s.id % 2 ? "thatch2" : "thatch";
      // the deck round it (the raised floor), plank by plank
      if (show > 4.05) {
        var nd = far ? 8 : 22,
          nk = Math.ceil(nd * up(5));
        for (q = 0; q < nk; q++) {
          a = (q / nd) * 6.28;
          B.add("wood|f", bake(box(0.46, 0.1, 0.62), s.x + Math.cos(a) * (wr + 0.3), h0 + 0.18, s.z + Math.sin(a) * (wr + 0.3), 0, -a, 0));
          if (!far && q % 3 === 0) B.add("post|f", bake(box(0.08, 0.2, 0.08), s.x + Math.cos(a) * (wr + 0.52), h0 + 0.06, s.z + Math.sin(a) * (wr + 0.52)));
        }
      }
      // walls on a stone footing
      B.add("stone|f", bake(cyl(wr + 0.06, wr + 0.1, 0.28, seg), s.x, h0 + 0.1, s.z));
      B.add("mudwall|f|c", bake(cyl(wr * 0.95, wr, wallH, seg), s.x, h0 + 0.05 + wallH / 2, s.z));
      // the roof: three courses stepping in to a knot at the top
      var y0 = h0 + 0.05 + wallH;
      B.add(roofK + "|f|c", bake(cyl(re * 0.66, re, Hr * 0.4, seg), s.x, y0 + Hr * 0.2 - 0.05, s.z));
      B.add(roofK + "|f|c", bake(cyl(re * 0.36, re * 0.7, Hr * 0.36, seg), s.x, y0 + Hr * 0.58 - 0.1, s.z));
      B.add(roofK + "|f|c", bake(new THREE.ConeGeometry(re * 0.4, Hr * 0.42, seg), s.x, y0 + Hr * 0.97 - 0.15, s.z));
      if (!far) {
        B.add("wood|f", bake(cyl(0.04, 0.08, 0.32, 6), s.x, y0 + Hr * 1.18 - 0.12, s.z));
        // the door (dark inside, a frame of wood), a step, a window
        var ox = s.x + dx * wr * 0.97,
          oz = s.z + dz * wr * 0.97;
        // the door in its owner's colour (Creekfolk 1's 3C); a dark doorway while nobody lives there
        var own = s.owner != null ? vw.creature(s.owner) : null;
        B.add((own && own.look ? "fur" + furIndex(own.look) : "soil") + "|f", bake(box(0.62, 1.12, 0.14), ox, h0 + 0.05 + 0.56, oz, 0, rot, 0));
        B.add("wood|f", bake(box(0.08, 1.2, 0.18), ox + dz * 0.35, h0 + 0.65, oz - dx * 0.35, 0, rot, 0));
        B.add("wood|f", bake(box(0.08, 1.2, 0.18), ox - dz * 0.35, h0 + 0.65, oz + dx * 0.35, 0, rot, 0));
        B.add("wood|f", bake(box(0.82, 0.1, 0.2), ox, h0 + 1.25, oz, 0, rot, 0));
        B.add("stone|f", bake(box(0.7, 0.1, 0.4), s.x + dx * (wr + 0.3), h0 + 0.03, s.z + dz * (wr + 0.3), 0, rot, 0));
        var wa = rot - 1.75, // the side away from the extra room
          wx = s.x + Math.sin(wa) * wr * 0.97,
          wz = s.z + Math.cos(wa) * wr * 0.97;
        B.add("soil|f", bake(box(0.32, 0.28, 0.12), wx, h0 + 0.95, wz, 0, wa, 0));
        if (LB) LB.add("hearth|g", bake(box(0.26, 0.22, 0.04), wx + Math.sin(wa) * 0.05, h0 + 0.95, wz + Math.cos(wa) * 0.05, 0, wa, 0));
        B.add("wood|f", bake(box(0.42, 0.06, 0.18), wx, h0 + 0.79, wz, 0, wa, 0));
        // a pot by the door, a woodpile against the wall
        var pa = rot + 0.55;
        B.add("clay|f", bake(cyl(0.15, 0.11, 0.3, 8), s.x + Math.sin(pa) * (wr + 0.25), h0 + 0.15, s.z + Math.cos(pa) * (wr + 0.25)));
        var ka = rot - 1.3,
          kr = wr + (show > 4.05 ? 0.85 : 0.22); // clear of the deck, once there is one
        for (q = 0; q < 5; q++) {
          var kx = s.x + Math.sin(ka) * kr,
            kz = s.z + Math.cos(ka) * kr;
          B.add("wood|f", bake(cyl(0.07, 0.07, 0.8, 6), kx, h0 + 0.08 + (q > 2 ? 0.13 : 0), kz, Math.PI / 2, ka + Math.PI / 2, 0, 1, 1, 1));
        }
      }
      // the front porch: two posts and a little roof over the door
      if (show > 6.05) {
        var fp = up(7),
          px0 = s.x + dx * (wr + 0.95),
          pz0 = s.z + dz * (wr + 0.95);
        for (q = -1; q <= 1; q += 2) B.add("post|f", bake(cyl(0.05, 0.06, 1.75 * fp, 5), px0 + dz * q * 0.55, h0 + 0.875 * fp, pz0 - dx * q * 0.55));
        if (fp >= 0.5) B.add(roofK + "|f|c", bake(box(1.5, 0.08, 1.25), s.x + dx * (wr + 0.5), h0 + 1.82, s.z + dz * (wr + 0.5), -0.28, rot, 0, 1, 1, 1));
        if (!far && fp >= 1) B.add("wood|f", bake(box(1.1, 0.06, 0.32), px0 - dx * 0.1 + dz * 0.25, h0 + 0.38, pz0 - dz * 0.1 - dx * 0.25, 0, rot, 0));
        // a lantern hung from the porch, lit at night
        if (!far && fp >= 1 && LB) {
          B.add("post|f", bake(box(0.03, 0.2, 0.03), px0 + dz * 0.55, h0 + 1.62, pz0 - dx * 0.55));
          LB.add("hearth|g", bake(box(0.13, 0.16, 0.13), px0 + dz * 0.55, h0 + 1.45, pz0 - dx * 0.55));
        }
      }
      // the stone hearth, and its chimney up the wall at the back
      if (show > 7.05) {
        var fh = up(8),
          ca = rot + Math.PI * 0.85,
          chx = s.x + Math.sin(ca) * (wr + 0.12),
          chz = s.z + Math.cos(ca) * (wr + 0.12),
          chH = (wallH + Hr * 0.75) * fh;
        for (q = 0; q < Math.ceil(7 * fh); q++) B.add((q % 2 ? "stone" : "rock") + "|f", bake(box(0.55 - q * 0.02, chH / 7 + 0.02, 0.5 - q * 0.02), chx, h0 + (q + 0.5) * (chH / 7), chz, 0, ca + (q % 2) * 0.08, 0));
      }
      // the things by the door that the owner put there, from what they love (3C's homes.js)
      if (!far && s.deco && s.deco.list) {
        var shown = s.deco.list.filter((d) => d.at <= vw.t);
        if (s.deco.old) shown.push(s.deco.old);
        // where they stand round the home (the door faces local +z), at this valley's size
        var SL = [
          [1.1, 1.02],
          [1.55, -0.14],
          [-0.95, 1.26],
          [1.02, -1.18],
        ];
        shown.slice(0, SL.length).forEach(function (d, j) {
          var k3 = wr / 1.05,
            lx = SL[j][0] * k3,
            lz = SL[j][1] * k3,
            wx = s.x + lx * Math.cos(rot) + lz * Math.sin(rot),
            wz = s.z - lx * Math.sin(rot) + lz * Math.cos(rot);
          addDecor(B, d.k, wx, wz, height(wx, wz), d.h || j, Math.atan2(wx - s.x, wz - s.z), own);
        });
      }
      // the extra room on one side
      if (show > 5.05) {
        var ra = rot + 2.0,
          rx = s.x + Math.sin(ra) * wr * 1.35,
          rz = s.z + Math.cos(ra) * wr * 1.35,
          rh = height(rx, rz),
          r2 = wr * 0.58,
          fr = up(6);
        B.add("stone|f", bake(cyl(r2 + 0.05, r2 + 0.08, 0.24, seg), rx, rh + 0.08, rz));
        B.add("mudwall|f", bake(cyl(r2 * 0.95, r2, wallH * 0.85 * fr, seg), rx, rh + 0.05 + (wallH * 0.85 * fr) / 2, rz));
        if (fr >= 1) {
          B.add(roofK + "|f|c", bake(cyl(r2 * 0.5, r2 + 0.35, Hr * 0.4, seg), rx, rh + wallH * 0.85 + Hr * 0.2, rz));
          B.add(roofK + "|f|c", bake(new THREE.ConeGeometry(r2 * 0.55, Hr * 0.45, seg), rx, rh + wallH * 0.85 + Hr * 0.58, rz));
        }
      }
    }
    // One thing by a home's door (3C's homes-view, at this valley's size): flowers in pots, a
    // stack of smooth stones, chimes, a basin of creek water, a little carved figure, a streamer
    // on a pole, a log bench. It faces away from the home (ry).
    function addDecor(B, k, x, z, y, h, ry, own) {
      var S = CF2_SCALE.build,
        cs = Math.cos(ry),
        sn = Math.sin(ry),
        at = (lx, lz) => [x + lx * cs + lz * sn, z - lx * sn + lz * cs],
        P = (key, g, lx, ly, lz, rx, ryy, rz) => {
          var q = at(lx * S, lz * S);
          B.add(key + "|f", bake(g, q[0], y + ly * S, q[1], rx || 0, ry + (ryy || 0), rz || 0, S, S, S));
        },
        FL = ["fred", "fblue", "fyel", "mush", "berry", "gold"];
      switch (k) {
        case "flowers":
          for (var j = 0; j < 3; j++) {
            var fx = (j - 1) * 0.18,
              fz = (j % 2) * 0.09;
            P("clay", cyl(0.075, 0.055, 0.11, 6), fx, 0.055, fz);
            P("grass", cyl(0.012, 0.012, 0.2, 3), fx, 0.2, fz);
            P(FL[(h + j * 2) % FL.length], new THREE.IcosahedronGeometry(0.07, 0), fx, 0.32, fz);
          }
          break;
        case "stones":
          [
            [0.14, 0.08, "rock"],
            [0.11, 0.2, "stone"],
            [0.085, 0.3, "rock"],
            [0.065, 0.38, "lime"],
          ].forEach((st, j2) => P(st[2], new THREE.DodecahedronGeometry(st[0], 0).scale(1, 0.62, 1), 0, st[1], 0, 0, j2 * 0.9, 0));
          break;
        case "chimes":
          P("post", cyl(0.025, 0.032, 0.9, 4), 0, 0.45, 0);
          P("post", box(0.34, 0.03, 0.03), 0.15, 0.88, 0);
          [0.24, 0.18, 0.13].forEach((len, j2) => P(h % 2 ? "clay" : "reed", cyl(0.016, 0.016, len, 4), 0.08 + j2 * 0.09, 0.86 - len / 2, 0));
          break;
        case "basin":
          P("clay", cyl(0.21, 0.15, 0.16, 8), 0, 0.08, 0);
          P("waterC", cyl(0.18, 0.18, 0.02, 8), 0, 0.155, 0);
          for (var j3 = 0; j3 < 3; j3++) P("reed", cyl(0.012, 0.012, 0.42, 3), 0.24 + j3 * 0.03, 0.21, -0.05 + j3 * 0.04, 0, 0, (j3 - 1) * 0.12);
          break;
        case "carving":
          P("post", cyl(0.07, 0.08, 0.24, 6), 0, 0.12, 0);
          P("wood", new THREE.IcosahedronGeometry(0.13, 1).scale(1, 1.15, 1), 0, 0.34, 0);
          P("wood", new THREE.IcosahedronGeometry(0.095, 1), 0, 0.53, 0);
          P("post", new THREE.ConeGeometry(0.035, 0.11, 4), -0.055, 0.64, 0);
          P("post", new THREE.ConeGeometry(0.035, 0.11, 4), 0.055, 0.64, 0);
          break;
        case "pennant":
          P("trunk", cyl(0.02, 0.026, 1.6, 4), 0, 0.8, 0);
          P(own && own.look ? "fur" + furIndex(own.look) : "fred", new THREE.ConeGeometry(0.1, 0.46, 3), 0.23, 1.48, 0, 0, 0, -Math.PI / 2);
          P(FL[h % FL.length], new THREE.ConeGeometry(0.06, 0.3, 3), 0.15, 1.28, 0, 0, 0, -Math.PI / 2 - 0.2);
          break;
        case "bench":
          P("trunk", cyl(0.085, 0.085, 0.72, 6), 0, 0.22, 0, 0, 0, Math.PI / 2);
          P("wood", box(0.6, 0.03, 0.12), 0, 0.31, 0);
          P("post", cyl(0.07, 0.085, 0.16, 5), -0.24, 0.08, 0);
          P("post", cyl(0.07, 0.085, 0.16, 5), 0.24, 0.08, 0);
          break;
      }
    }
    // A tree of the grove that has fallen: a nurse log, mossing over, ferns and saplings on it,
    // sinking back into the ground as it rots (Creekfolk 1's 3C).
    function addNurseLog(B, lg, far) {
      var R = rnd(lg.id * 977 + 5),
        d = groveLogDecay(vw, lg),
        len = (lg.len || 4) * 1.5,
        r = (lg.r || 0.25) * 1.5 * (1 - 0.35 * d),
        y = height(lg.x, lg.z) + r * (0.75 - 0.6 * d),
        a = lg.rot || 0,
        dx = Math.cos(a),
        dz = Math.sin(a);
      B.add("wood|f", bake(cyl(r, r * 1.1, len, far ? 6 : 10), lg.x, y, lg.z, Math.PI / 2, -a + Math.PI / 2, 0));
      if (far) return;
      // the root plate at its foot
      B.add("soil|f", bake(cyl(r * 2.2, r * 2.2, r * 0.6, 9), lg.x - (dx * len) / 2, y + r * 0.2, lg.z - (dz * len) / 2, Math.PI / 2, -a + Math.PI / 2, 0));
      var nm = 3 + Math.round(6 * d);
      for (var q = 0; q < nm; q++) {
        var f = R() - 0.5;
        B.add("moss|f", bake(new THREE.IcosahedronGeometry(r * (0.45 + 0.3 * R()), 0), lg.x + dx * f * len, y + r * 0.75, lg.z + dz * f * len, 0, R() * 3, 0, 1.4, 0.4, 1));
      }
      for (q = 0; q < 2 + Math.round(3 * d); q++) {
        var f2 = R() - 0.5,
          g = fernGeo.clone();
        g.scale(0.9, 0.9, 0.9);
        B.add("fern|f", bake(g, lg.x + dx * f2 * len + (R() - 0.5) * r * 2, y + r * 0.6, lg.z + dz * f2 * len + (R() - 0.5) * r * 2, 0, R() * 6, 0));
      }
      // young trees growing from it
      for (q = 0; q < Math.round(2 * d); q++) {
        var f3 = R() - 0.5,
          sx = lg.x + dx * f3 * len,
          sz = lg.z + dz * f3 * len;
        B.add("trunk|f", bake(cyl(0.025, 0.035, 0.9, 5), sx, y + r + 0.4, sz));
        B.add((lg.tk === "pine" ? "cedar" : lg.tk === "willow" ? "willow" : "elm") + "|f", bake(new THREE.IcosahedronGeometry(0.32, 0), sx, y + r + 0.95, sz, 0, R() * 3, 0, 1, 1.2, 1));
      }
    }
    // The beavers' lodge: a dome of sticks in the pond, growing as the sticks come in; and
    // their little stick dams across the side channels on the floor.
    function addLodge(B, L, far) {
      var R = rnd(7331),
        sz = (0.55 + 0.6 * (L.size || 0.5)) * 1.3,
        w = W.water(L.x, L.z),
        y = (w == null ? height(L.x, L.z) : w) - 0.2;
      B.add("lodge|f", bake(new THREE.SphereGeometry(0.9 * sz, far ? 7 : 10, far ? 4 : 6, 0, 6.29, 0, Math.PI / 2), L.x, y, L.z, 0, 0, 0, 1, 1.0, 1));
      if (far) return;
      for (var q = 0; q < 28; q++) {
        var a = (q / 28) * Math.PI * 2 * 2.3 + R() * 0.5,
          el = 0.15 + (q / 28) * 1.05,
          rr = 0.92 * sz * Math.cos(el),
          yy = 0.9 * sz * Math.sin(el);
        B.add((q % 3 ? "wood" : "post") + "|f", bake(box(0.8 * sz * Math.max(0.35, Math.cos(el)), 0.05, 0.05), L.x + Math.cos(a) * rr, y + yy + 0.02, L.z + Math.sin(a) * rr, 0, -(a + Math.PI / 2) + (R() - 0.5) * 0.5, (R() - 0.5) * 0.3));
      }
    }
    function addSideDam(B, sd, j) {
      var R = rnd(j * 131 + 17),
        y = height(sd.x, sd.z);
      for (var q = 0; q < 8; q++) B.add((q % 2 ? "wood" : "post") + "|f", bake(cyl(0.03, 0.035, 1.1, 4), sd.x + (q - 3.5) * 0.15, y + 0.07 + (q % 3) * 0.05, sd.z + (R() - 0.5) * 0.25, 0, (R() - 0.5) * 0.6, Math.PI / 2));
      B.add("mud|f", bake(box(1.1, 0.1, 0.25), sd.x, y + 0.03, sd.z - 0.12));
    }
    // The sky stones: a sighting stone, and a fan of markers toward the sunrise, the tallest
    // where the midwinter sun comes up (local +z), then a ring of pebbles.
    function addSkycal(B, s, show, far) {
      // local +z is the way the creekfolk look for the midwinter sunrise (skycal.js: along
      // SUNRISE_DIR as x = cos, z = sin); local +x is to its right
      var Dx = Math.cos(SUNRISE_DIR),
        Dz = Math.sin(SUNRISE_DIR),
        Rr = 2.2 * CF2_SCALE.build,
        part = (k) => clamp(show * 6 - k, 0, 1),
        toW = (lx, lz) => [s.x + lz * Dx + lx * Dz, s.z + lz * Dz - lx * Dx],
        h0 = height(s.x, s.z),
        face = Math.atan2(Dx, Dz);
      if (part(0)) B.add("stone|f", bake(box(0.6, 0.8 * part(0), 0.55), s.x, h0 + 0.4 * part(0), s.z, 0, face, 0));
      [
        [1, 0, 1.8],
        [2, 0.5, 1.25],
        [3, 1.1, 1.35],
        [4, 0.62, 1.25],
      ].forEach(function (m) {
        var p = part(m[0]);
        if (!p) return;
        var q = toW(Math.sin(m[1]) * Rr, Math.cos(m[1]) * Rr);
        B.add("stone|f", bake(box(0.34, m[2] * p, 0.28), q[0], height(q[0], q[1]) + (m[2] * p) / 2, q[1], 0, face - m[1], 0));
      });
      if (part(5) && !far)
        for (var i = 0; i < Math.round(18 * part(5)); i++) {
          var px = s.x + Math.cos(i * 0.349) * Rr * 1.3,
            pz = s.z + Math.sin(i * 0.349) * Rr * 1.3;
          B.add((i % 2 ? "stone" : "lime") + "|f", bake(new THREE.DodecahedronGeometry(0.13, 0), px, height(px, pz) + 0.04, pz, i, i * 2, 0, 1, 0.6, 1));
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
      for (var r of vw.list("res").values()) if (tileOf(r.x, r.z) === Tl) parts.push(r.id + ":" + r.kind + ":" + (r.amt > 0 ? Math.ceil(r.amt / 3) : 0) + ":" + (r.pods || 0) + ":" + (r.kind === "grove" ? Math.floor(groveSize(vw, r) * 6) : r.stage || r.size || ""));
      for (var lg of vw.groveLogs || []) if (tileOf(lg.x, lg.z) === Tl) parts.push("log" + lg.id + ":" + Math.floor(groveLogDecay(vw, lg) * 5));
      var Bv = vw.beavers;
      if (Bv && Bv.lodge && tileOf(Bv.lodge.x, Bv.lodge.z) === Tl) parts.push("lodge" + Math.round((Bv.lodge.size || 0) * 10));
      if (Bv) for (var sd of Bv.small || []) if (tileOf(sd.x, sd.z) === Tl) parts.push("sd" + sd.x + "," + sd.z);
      for (var s of vw.list("structures").values())
        if (tileOf(s.x, s.z) === Tl && s.kind === "home")
          parts.push("h" + s.id + ":" + s.owner + ":" + (vw.creature(s.owner) ? furIndex(vw.creature(s.owner).look || {}) : "") + ":" + (s.deco && s.deco.list ? s.deco.list.filter((d) => d.at <= vw.t).length + (s.deco.old ? "o" : "") : ""));
      for (var s of vw.list("structures").values()) if (tileOf(s.x, s.z) === Tl) parts.push(s.id + ":" + s.kind + ":" + s.level + ":" + (s.building ? s.building.level + "." + s.building.stage + "." + Math.floor((s.building.labor || 0) / 60) : "") + ":" + (s.kind === "dam" && vw.dams[s.id] ? vw.dams[s.id].crest.toFixed(2) : "") + ":" + (s.beds ? s.beds.map((b) => b.state[0] + Math.floor((b.grow || 0) * 3)).join("") : ""));
      return parts.join("|");
    }
    var LB = null, // the batch the lights of the tile being built go into (near tiles only)
      LIGHTS = new Set(),
      nightOn = false;
    function buildThings(Tl, far) {
      var g = new THREE.Group(),
        B = new Batch(),
        det = W.detail;
      LB = far ? null : new Batch();
      for (var r of vw.list("res").values()) if (tileOf(r.x, r.z) === Tl) addThing(B, r, det, far);
      for (var sc of SCENERY) if (tileOf(sc.x, sc.z) === Tl) addTree(B, sc, det, far);
      for (var rk of ROCKS)
        if (tileOf(rk.x, rk.z) === Tl) {
          if (rk.slab) B.add(rk.key + "|f", bake(box(rk.d, rk.h, rk.w), rk.x, rk.y, rk.z, 0, rk.yaw, rk.rz));
          else if (!far || rk.r > 0.4) B.add(rk.key + "|f", bake(new THREE.DodecahedronGeometry(rk.r, 0), rk.x, rk.y + rk.r * 0.3, rk.z, rk.rx, rk.ry, 0, 1, 0.7, 1));
        }
      for (var s of vw.list("structures").values()) if (tileOf(s.x, s.z) === Tl) addStructure(B, s, far);
      for (var lg of vw.groveLogs || []) if (tileOf(lg.x, lg.z) === Tl) addNurseLog(B, lg, far);
      var Bv = vw.beavers;
      if (Bv && Bv.lodge && tileOf(Bv.lodge.x, Bv.lodge.z) === Tl) addLodge(B, Bv.lodge, far);
      if (Bv && !far) Bv.small.forEach((sd, j) => tileOf(sd.x, sd.z) === Tl && addSideDam(B, sd, j));
      B.build(g, { noShadow: far });
      if (LB) {
        var lg2 = new THREE.Group();
        lg2.name = "Lights";
        LB.build(lg2, { noShadow: true });
        lg2.visible = nightOn;
        g.add(lg2);
        LIGHTS.add(lg2);
        LB = null;
      }
      return g;
    }
    function groundKey(Tl) {
      return vw.creekV + "|" + vw.waterV + "|" + W.overlay + "|" + vw.season;
    }
    function farTile(Tl) {
      var g = new THREE.Group();
      g.name = "Far_" + Tl.i + "_" + Tl.j;
      var land = groundMesh(Tl, Tl.inner ? 1 : Tl.distant ? 8 : 2);
      land.receiveShadow = false;
      g.add(land);
      if (Tl.distant) return g;
      if (Tl.inner) {
        creekRibbon(Tl, g, 2, 3);
        floorWater(Tl, g, 1);
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
      floorWater(Tl, g, Math.max(0.25, CSD[W.detail - 1]));
      branchWater(Tl, g, 5);
      g.add(buildThings(Tl, false));
      return g;
    }
    function dispose(g) {
      if (g) g.traverse((o) => (o.isMesh && o.geometry.dispose(), o.name === "Lights" && LIGHTS.delete(o)));
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
    // after dusk the windows and lanterns are lit
    W.setNight = function (on) {
      if (on === nightOn) return;
      nightOn = on;
      for (var l of LIGHTS) l.visible = on;
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

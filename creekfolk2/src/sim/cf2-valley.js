// ==========================================================================
// Creekfolk 2: the new valley, at real scale.
//
// 160 m across (x) by 224 m along the creek (z); the creek flows toward +z, from the old
// valley upstream to the next one downstream. One height function, as in What the Water
// Brings, built the way Creekfolk 1's Terrain is (heights on the 1 m grid's vertices,
// rebuilt from the creek model after every change), with the same interface, so the
// rest of the simulation uses it unchanged. Across the valley, from the creek outward:
//   - the creek's trench, from the creek model (src/sim/creek.js)
//   - the valley floor, the bottomland that can turn to wetland (about 40 m wide)
//   - a rise of about two metres to the terraces, where the village lives
//   - hills at the rim; on the east side, along the middle of the valley, a limestone
//     bluff instead, with the Dry Fork coming down through a notch in it
// and two branches with fixed channels and their own water (src/sim/cf2-branches.js):
//   - the Dry Fork: a pale limestone bed from the plateau over the Dry Falls, across the
//     east terrace and floor; dry most days, a torrent in a storm
//   - the spring branch: out of a spring at the foot of the west terrace, near where the
//     village starts; clear and cold, it never dries
// Along the creek, a limestone ledge crosses the bed. The cutting-down stopped there: above
// it the creek is only a little below its floor, below it the trench is deep, and the
// water drops over the ledge in a little fall.
//
// Replaces Creekfolk 1's Terrain (core.js); see docs/MERGE.md.
// ==========================================================================

var CF2_VALLEY = {
  halfW: 70, // m from the valley's axis to the rim (walkable to about 0.9 of it)
  floorHW: 20.5, // m: half the width of the valley floor, on average
  terrace: 1.9, // m: the rise from the floor to the terraces
  bluffH: 6.5, // m: the limestone bluff on the east side
  hillK: 70, // how steeply the hills rise past the rim
  fpTop: 2.6, // m: the valley floor's level where the creek comes in ...
  fpSlope: 0.0072, // ... and how fast it falls along the valley
  cutAbove: 0.6, // m: how far the creek has cut below its floor above the ledge ...
  cutBelow: 1.12, // ... and below it
  ledgeDrop: 0.42, // m: the fall over the ledge
};

Terrain = class {
  constructor(seed) {
    let e = new Rng(seed + ":terrain"),
      V = CF2_VALLEY;
    this.noise = new ValueNoise(e);
    this.ax0 = VW / 2 + e.range(-3, 3);
    this.aa = e.range(3, 6);
    this.af = (2 * Math.PI) / e.range(190, 270);
    this.ap = e.range(0, 6.28);
    this.fw0 = V.floorHW + e.range(-1.5, 1.5);
    this.fwa = e.range(2, 3.5);
    this.fwf = (2 * Math.PI) / e.range(70, 120);
    this.fwp = e.range(0, 6.28);
    this.cOff = e.range(4, 7); // the creek runs a little east of the axis, leaving the west side more floor
    this.ma1 = e.range(2.6, 4.2);
    this.mf1 = (2 * Math.PI) / e.range(46, 72);
    this.mp1 = e.range(0, 6.28);
    this.ma2 = e.range(0.5, 1.0);
    this.mf2 = (2 * Math.PI) / e.range(16, 24);
    this.mp2 = e.range(0, 6.28);
    this.zKnee = -1e9; // Creekfolk 1's steeper upper stretch: none here (the ledge takes its place)
    this.zLedge = Math.round(e.range(98, 112) / CREEK.ds) * CREEK.ds;
    this.zSpring = e.range(52, 64); // where the spring comes out, at the foot of the west terrace
    this.zDry = e.range(146, 162); // where the Dry Fork comes down off the bluff
    this.rimSeed = e.range(0, 100);
    this.radiusNoiseSeed = this.rimSeed;
    this.cutP1 = e.range(0, 6.28);
    this.cutP2 = e.range(0, 6.28);
    this.version = 0;
    // look-up tables along z, from 40 m above the valley to 40 m below it
    this.lz0 = -40;
    this.lutN = Math.round((VL + 80) * 8);
    this.lut = new Float64Array((this.lutN + 1) * 4); // creekX, creekHW, axisX, floorHW
    this.rimLut = new Float64Array(this.lutN + 1); // 1 / the rim's half-width, by z
    this.dzLut = new Float64Array(this.lutN + 1); // dz^4, rounding the valley's ends
    for (let n = 0; n <= this.lutN; n++) {
      let z = this.lz0 + n / 8,
        dz = (z - VL / 2) / (VL / 2 - 1);
      this.lut[n * 4] = this.creekXRaw(z);
      this.lut[n * 4 + 1] = 1.2;
      this.lut[n * 4 + 2] = this.axisXRaw(z);
      this.lut[n * 4 + 3] = this.floorHWRaw(z);
      this.rimLut[n] = 1 / (V.halfW + 2.5 * Math.sin(z * 0.035 + this.rimSeed) + 1.5 * Math.sin(z * 0.09 + this.rimSeed * 2));
      this.dzLut[n] = dz * dz * dz * dz;
    }
    // the branches, laid out once (their channels never change)
    this.branches = cf2LayBranches(this, e);
    // the parts of the height field that never change
    let N = (VW + 1) * (VL + 1);
    this.N = VW + 1;
    this.h = new Float32Array(N);
    this.micro = new Float32Array(N);
    this.terr = new Float32Array(N);
    this.wF = new Float32Array(N);
    this.hill = new Float32Array(N);
    this.brCut = new Float32Array(N); // how deep the branches are cut into the ground here
    this.rock = new Uint8Array(N); // limestone at the surface: 1 the bluff, 2 the Dry Fork's bed, 3 the ledge
    for (let z = 0; z <= VL; z++)
      for (let x = 0; x <= VW; x++) {
        let k = z * (VW + 1) + x,
          b = this.baseAt(x, z);
        this.micro[k] = b.micro;
        this.terr[k] = b.terr;
        this.wF[k] = b.wF;
        this.hill[k] = b.hill;
        let bl = this.bluffAt(x, z);
        if (bl > 0.06 && bl < 0.97) this.rock[k] = 1; // the bluff's face (its top has a little soil)
      }
    cf2CarveBranches(this);
    this.initNodes = cf2BuildNodes(this, seed);
    this.setCreek({ nodes: this.initNodes, chan: null });
  }
  axisXRaw(z) {
    return this.ax0 + this.aa * Math.sin(z * this.af + this.ap);
  }
  floorHWRaw(z) {
    return this.fw0 + this.fwa * Math.sin(z * this.fwf + this.fwp);
  }
  creekXRaw(z) {
    // fairly straight (a cut-down creek has been straightened by its own floods), with
    // gentle bends about a line a little east of the valley's axis
    return this.axisXRaw(z) + this.cOff + this.ma1 * Math.sin(z * this.mf1 + this.mp1) + this.ma2 * Math.sin(z * this.mf2 + this.mp2);
  }
  lookup(z, k) {
    let n = (z - this.lz0) * 8;
    if (n <= 0) n = 0;
    if (n >= this.lutN) n = this.lutN - 1e-6;
    let s = Math.floor(n),
      r = n - s,
      o = this.lut[s * 4 + k],
      a = this.lut[s * 4 + 4 + k];
    return o + (a - o) * r;
  }
  creekX(z) {
    return this.lookup(z, 0);
  }
  creekHW(z) {
    return this.lookup(z, 1);
  }
  axisX(z) {
    return this.lookup(z, 2);
  }
  floorHW(z) {
    return this.lookup(z, 3);
  }
  halfWAt(z) {
    let n = (z - this.lz0) * 8;
    n = n <= 0 ? 0 : n >= this.lutN ? this.lutN : Math.round(n);
    return 1 / this.rimLut[n];
  }
  // the old valley floor's level along the valley
  fp0(z) {
    return CF2_VALLEY.fpTop - CF2_VALLEY.fpSlope * z;
  }
  edgeDist(t, e) {
    return Math.abs(t - this.creekX(e)) - this.creekHW(e);
  }
  side(t, e) {
    return t < this.creekX(e) ? 0 : 1;
  }
  isWater(t, e) {
    return this.edgeDist(t, e) < 0;
  }
  // 0 in the middle of the valley, 1 at the rim (a rounded rectangle: walkable below
  // 0.9, hills rising above 0.82)
  valleyR(t, e) {
    let n = (e - this.lz0) * 8;
    n = n <= 0 ? 0 : n >= this.lutN ? this.lutN : Math.round(n);
    let dx = (t - this.lut[n * 4 + 2]) * this.rimLut[n],
      d2 = dx * dx;
    return Math.sqrt(Math.sqrt(d2 * d2 + this.dzLut[n]));
  }
  // the limestone bluff on the east side: 0 none .. 1 on top of it
  bluffAt(x, z) {
    let ax = this.axisX(z),
      ex = (x - ax) / this.halfWAt(z);
    if (ex < 0.7) return 0;
    let fade = smoothstep(58, 84, z) * (1 - smoothstep(192, 212, z)),
      wob = 0.012 * Math.sin(z * 0.31 + this.rimSeed) + 0.007 * Math.sin(z * 0.83),
      b = smoothstep(0.826, 0.858, ex + wob) * fade;
    // the notch the Dry Fork has cut through it
    let df = this.branches && this.branches.dry;
    if (b > 0 && df && Math.abs(z - this.zDry) < 14) {
      let d = cf2BranchDist(df, x, z);
      if (d) b *= smoothstep(1.6, 4.2, d.o);
    }
    return b;
  }
  // the fixed parts of the ground at (x, z): floor relief, terraces, the bluff, hills
  baseAt(x, z) {
    let V = CF2_VALLEY,
      n = this.noise,
      d = Math.abs(x - this.axisX(z)),
      fhw = this.floorHW(z),
      // the floor's relief: long shallow swales down the valley (old channel scars),
      // smaller hummocks and a little roughness, about +-0.17 m, so water held a hand
      // above the floor spreads along the hollows instead of straight across
      micro =
        0.02 +
        0.38 * (2 * n.fbm(x * 0.11 + 7, z * 0.035 + 3, 3) - 1) +
        0.07 * (2 * n.fbm(x * 0.25 + 1, z * 0.25 + 5, 2) - 1) +
        0.025 * (2 * n.get(x * 0.7, z * 0.7 + 11) - 1),
      rise =
        V.terrace * smoothstep(fhw - 1, fhw + 7, d) +
        0.016 * Math.max(0, d - fhw - 7) +
        0.6 * (n.fbm(x * 0.06 + 20, z * 0.06, 3) - 0.5) * smoothstep(fhw, fhw + 8, d),
      terr = this.fp0(z) + rise,
      wF = 1 - smoothstep(fhw - 1.5, fhw + 2.5, d),
      hill = 0,
      r = this.valleyR(x, z);
    if (r > 0.82) {
      let lg = smoothstep(1.5, 9, Math.abs(x - this.creekXRaw(z)) - 2);
      hill = Math.pow(r - 0.82, 1.6) * V.hillK * (0.65 + 0.7 * n.fbm(x * 0.07 + 9, z * 0.07 + 3)) * lg;
    }
    let bl = this.bluffAt(x, z);
    if (bl > 0) {
      // a limestone face, then a plateau that rises gently back from its edge
      let ex = (x - this.axisX(z)) / this.halfWAt(z);
      hill = Math.max(hill * (1 - bl), bl * (V.bluffH + 0.5 * (n.fbm(x * 0.2, z * 0.2 + 40, 2) - 0.5) + 9 * Math.max(0, ex - 0.86)));
    }
    return { micro, terr, wF, hill };
  }
  // the creek's cross-section at z, offset o from its centre line
  section(z, o) {
    let ns = this._nodes,
      f = clamp((z - CREEK.z0) / CREEK.ds, 0, ns.length - 1.0001),
      i = Math.floor(f),
      t = f - i,
      a = this.secOf(ns[i], o),
      b = this.secOf(ns[i + 1], o);
    return a + (b - a) * t;
  }
  secOf(n, o) {
    let hw = n.wb / 2;
    if (o <= hw) return n.bed;
    let Ht = Math.max(n.fp - n.bed, 0.05),
      m = n.m,
      Hz = n.bw > 0.05 ? clamp(n.bz - n.bed, 0, Ht - 0.03) : 0;
    if (Hz > 0) {
      let x1 = hw + m * Hz;
      if (o <= x1) return n.bed + (o - hw) / m;
      let x3 = x1 + n.bw / 2;
      if (o <= x3) return n.bed + Hz;
      let edge = x3 + m * (Ht - Hz);
      return o <= edge ? n.bed + Hz + (o - x3) / m : n.fp + (o - edge) * 1.5;
    }
    let edge = hw + m * Ht;
    return o <= edge ? n.bed + (o - hw) / m : n.fp + (o - edge) * 1.5;
  }
  fpAt(z) {
    let ns = this._nodes,
      f = clamp((z - CREEK.z0) / CREEK.ds, 0, ns.length - 1.0001),
      i = Math.floor(f),
      t = f - i;
    return ns[i].fp + (ns[i + 1].fp - ns[i].fp) * t;
  }
  // the ground before the creek is cut into it: floor, terraces, hills, and the branches
  groundAt(k, fp, ch = 0) {
    let floor = fp + this.micro[k] - ch,
      w = this.wF[k];
    return w * floor + (1 - w) * Math.max(this.terr[k], floor) + this.hill[k] - this.brCut[k];
  }
  // the creek has changed: rebuild the heights, the creek's half-width and the version
  setCreek(cr) {
    this._nodes = cr.nodes;
    let chan = cr.chan;
    for (let n = 0; n <= this.lutN; n++) {
      let z = this.lz0 + n / 8,
        f = clamp((z - CREEK.z0) / CREEK.ds, 0, cr.nodes.length - 1.0001),
        i = Math.floor(f),
        t = f - i,
        hwA = this.hwOf(cr.nodes[i]),
        hwB = this.hwOf(cr.nodes[i + 1]);
      this.lut[n * 4 + 1] = hwA + (hwB - hwA) * t;
    }
    this.cut || (this.cut = new Float32Array(this.h.length));
    for (let z = 0; z <= VL; z++) {
      let fp = this.fpAt(z),
        cx = this.creekX(z);
      for (let x = 0; x <= VW; x++) {
        let k = z * (VW + 1) + x,
          h = this.groundAt(k, fp, chan ? chan[k] : 0),
          s = this.section(z, Math.abs(x - cx));
        this.h[k] = s < h ? s : h;
        this.cut[k] = s < h ? h - s : 0; // how deep the creek has cut here (for drawing)
      }
    }
    this.version++;
  }
  hwOf(n) {
    let Ht = Math.max(n.fp - n.bed, 0.05),
      y = Math.min(Ht, 0.6),
      Hz = n.bw > 0.05 ? clamp(n.bz - n.bed, 0, Ht - 0.03) : 0,
      w = n.wb + 2 * n.m * y + (n.bw > 0.05 && y > Hz ? n.bw : 0);
    return clamp(w / 2, 0.6, 2.6);
  }
  // heights outside the grid (the hills and the creek's gorges round the valley)
  heightRaw(t, e) {
    let b = this.baseAt(t, e),
      fp = this._nodes ? this.fpAt(e) : this.fp0(e),
      floor = fp + b.micro,
      h = b.wF * floor + (1 - b.wF) * Math.max(b.terr, floor) + b.hill;
    if (this._nodes) {
      let s = this.section(e, Math.abs(t - this.creekX(e)));
      if (s < h) h = s;
    }
    return h;
  }
  heightAt(t, e) {
    let n = this.N,
      s = clamp(t, 0, VW - 0.001),
      r = clamp(e, 0, VL - 0.001),
      o = Math.floor(s),
      a = Math.floor(r),
      l = s - o,
      c = r - a,
      h = this.h[a * n + o],
      d = this.h[a * n + o + 1],
      u = this.h[(a + 1) * n + o],
      f = this.h[(a + 1) * n + o + 1];
    return (h + (d - h) * l) * (1 - c) + (u + (f - u) * l) * c;
  }
  // the ground at (x, z) as if the creek's trench were not there (for drawing the
  // trench as its own smooth mesh): bilinear over the grid like the ground itself
  uncarvedAt(t, e) {
    if (t < 0 || e < 0 || t >= VW || e >= VL || !this.cut) {
      let b = this.baseAt(t, e),
        fp = this._nodes ? this.fpAt(e) : this.fp0(e),
        floor = fp + b.micro;
      return b.wF * floor + (1 - b.wF) * Math.max(b.terr, floor) + b.hill;
    }
    let n = this.N,
      o = Math.floor(t),
      a = Math.floor(e),
      l = t - o,
      c = e - a,
      H = this.h,
      C = this.cut,
      v = (k) => H[k] + C[k],
      h = v(a * n + o),
      d = v(a * n + o + 1),
      u = v((a + 1) * n + o),
      f = v((a + 1) * n + o + 1);
    return (h + (d - h) * l) * (1 - c) + (u + (f - u) * l) * c;
  }
  // on the valley floor (the bottomland that can turn to wetland): 0..1
  floorWeight(t, e) {
    let d = Math.abs(t - this.axisX(e)),
      f = this.floorHW(e);
    return 1 - smoothstep(f - 1, f + 2, d);
  }
  walkable(t, e) {
    return (
      t > 1 &&
      e > 1 &&
      t < VW - 1 &&
      e < VL - 1 &&
      this.valleyR(t, e) < 0.9 &&
      this.edgeDist(t, e) > 0.2 &&
      this.bluffAt(t, e) < 0.08 &&
      !cf2InSpringPool(this, t, e)
    );
  }
  bankPoint(t, e, n = 0.55) {
    e = clamp(e, 4, VL - 4);
    let s = this.creekX(e),
      r = this.creekHW(e);
    return { x: t === 0 ? s - r - n : s + r + n, z: e };
  }
  randomPoint(t, e = {}) {
    for (let n = 0; n < 400; n++) {
      let s = t.range(3, VW - 3),
        r = t.range(3, VL - 3);
      if (!this.walkable(s, r) || (e.side !== void 0 && this.side(s, r) !== e.side)) continue;
      let o = this.edgeDist(s, r);
      if (
        !(e.minEdge !== void 0 && o < e.minEdge) &&
        !(e.maxEdge !== void 0 && o > e.maxEdge) &&
        !(e.maxR !== void 0 && this.valleyR(s, r) > e.maxR) &&
        !(e.minR !== void 0 && this.valleyR(s, r) < e.minR) &&
        !(e.zMin !== void 0 && r < e.zMin) &&
        !(e.zMax !== void 0 && r > e.zMax) &&
        !(e.offFloor && this.floorWeight(s, r) > 0.2) &&
        !(e.onFloor && this.floorWeight(s, r) < 0.8) &&
        !(e.near && Math.hypot(s - e.near.x, r - e.near.z) > e.near.r) &&
        !(e.avoid && e.avoid.some((a) => Math.hypot(s - a.x, r - a.z) < (a.r ?? 2)))
      )
        return { x: s, z: r };
    }
    return null;
  }
  waterSpan(t, e, n, s) {
    let r = Math.max(8, Math.ceil(Math.hypot(n - t, s - e) * 2)),
      o = -1,
      a = -1;
    for (let l = 0; l <= r; l++) {
      let c = l / r;
      this.isWater(t + (n - t) * c, e + (s - e) * c) && (o < 0 && (o = c), (a = c));
    }
    return o < 0 ? null : [Math.max(0, o - 0.5 / r), Math.min(1, a + 0.5 / r)];
  }
};

// The creek's starting nodes: Creekfolk 1's, with this valley's cutting-down (shallow
// above the ledge, deep below it), the ledge itself (limestone: the bed there can't go
// lower, and never has), and the branches' drained area added where they join.
function cf2BuildNodes(T, seed) {
  let V = CF2_VALLEY,
    nodes = creekBuildNodes(T, seed);
  for (let n of nodes) {
    let below = n.z > T.zLedge,
      wob = 0.5 + 0.5 * Math.sin(n.z * 0.031 + T.cutP1),
      D = below ? V.cutBelow + 0.2 * (wob - 0.5) + 0.07 * Math.sin(n.z * 0.083 + T.cutP2) : V.cutAbove + 0.08 * (wob - 0.5);
    // the cut deepens over a few metres below the ledge (the fall), and shallows toward
    // where the creek comes in through its gap
    if (below) D -= (V.cutBelow - V.cutAbove - V.ledgeDrop) * Math.exp(-(n.z - T.zLedge) / 10);
    if (n.z < 10) D -= 0.15 * (1 - n.z / 10);
    n.bed = n.fp - D;
    if (Math.abs(n.z - T.zLedge) < 0.01) n.rock = 1;
  }
  for (let i = nodes.length - 2; i >= 0; i--) {
    let a = nodes[i],
      b = nodes[i + 1];
    if (a.bed < b.bed + 0.003 * CREEK.ds) a.bed = b.bed + 0.003 * CREEK.ds;
  }
  // drained area: the branches add theirs where they come in
  for (let b of Object.values(T.branches)) {
    let j = creekNodeIndex(b.joinZ);
    nodes[j].aLat = +(nodes[j].aLat + b.area).toFixed(6);
    for (let i = j; i < nodes.length; i++) nodes[i].A = +(nodes[i].A + b.area).toFixed(5);
  }
  for (let n of nodes) {
    n.bed = +n.bed.toFixed(4);
    n.g = +(n.bed + 0.1).toFixed(4);
    n.wl = n.bed;
    n.yBed = n.bed;
    n.bedMin = n.bed;
  }
  return nodes;
}

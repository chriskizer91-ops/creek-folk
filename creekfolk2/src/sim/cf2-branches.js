// ==========================================================================
// Creekfolk 2: the creek's two branches, the Dry Fork and the spring branch.
//
// Their channels are fixed (laid out from the seed, like the creek's centre line) and
// carved into the valley's one height function. Their water is their own:
//   - the spring branch runs out of a spring at the foot of the west terrace, all year,
//     a little more in the wet season. Where it joins the creek its water goes into the
//     creek. In a cut-down valley that water soon sinks into the creek's gravel (the
//     creek "loses" it to a low water table, Creekfolk 1's bedLoss); as the floor's
//     water table rises, the spring's water carries further.
//   - the Dry Fork drains the plateau behind the bluff. Rain fills it and it empties
//     fast: dry most days, pools for a while after rain, a torrent in a storm. Its
//     drained area joins the creek's, so floods below it are bigger and it brings gravel
//     down to where it comes in.
// State: world.creek.br (saved with the creek). Everything is seeded; nothing random.
// ==========================================================================

var CF2_BRANCH = {
  springQ: 0.0008, // m3/s from the spring in the dry season (more in the wet season)
  springWet: 0.6, // ... up to this much more at the height of the wet season
  springArea: 0.004, // km2 the spring branch drains
  dryArea: 0.03, // km2 the Dry Fork drains (the plateau behind the bluff)
  dryFill: 0.9, // storage gained per valley day of rain (relative units)
  dryTau: 0.22, // valley days for the Dry Fork to run out
  dryQ: 0.05, // m3/s per unit of storage
  dryRunning: 0.004, // m3/s: above this it runs; below, it stands in pools, then dries
};

// Catmull-Rom through the control points, then even samples every `step` metres.
function cf2Spline(pts, step) {
  let fine = [];
  for (let i = 0; i < pts.length - 1; i++) {
    let p0 = pts[Math.max(0, i - 1)],
      p1 = pts[i],
      p2 = pts[i + 1],
      p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < 24; k++) {
      let t = k / 24,
        t2 = t * t,
        t3 = t2 * t,
        f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      fine.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  fine.push(pts[pts.length - 1]);
  let S = [0];
  for (let i = 1; i < fine.length; i++) S.push(S[i - 1] + Math.hypot(fine[i][0] - fine[i - 1][0], fine[i][1] - fine[i - 1][1]));
  let L = S[S.length - 1],
    n = Math.max(2, Math.ceil(L / step)),
    out = { X: [], Z: [], S: [], L, n: n + 1 },
    j = 0;
  for (let i = 0; i <= n; i++) {
    let s = (L * i) / n;
    while (j < fine.length - 2 && S[j + 1] < s) j++;
    let u = (s - S[j]) / Math.max(1e-9, S[j + 1] - S[j]);
    out.X.push(+(fine[j][0] + (fine[j + 1][0] - fine[j][0]) * u).toFixed(3));
    out.Z.push(+(fine[j][1] + (fine[j + 1][1] - fine[j][1]) * u).toFixed(3));
    out.S.push(+s.toFixed(3));
  }
  return out;
}

// Lay the branches out (called from the Terrain's constructor, before any heights exist).
function cf2LayBranches(T, rng) {
  let gauss = (x, s) => Math.exp(-(x * x) / (s * s)),
    br = {};
  // the spring branch: from the spring at the foot of the west terrace, across the
  // floor in a lazy S, to the creek a little downstream
  {
    let z0 = T.zSpring,
      x0 = T.axisXRaw(z0) - T.floorHWRaw(z0) - 0.6,
      z1 = z0 + rng.range(10, 15),
      x1 = T.creekXRaw(z1) - 0.8,
      pts = [[x0, z0]];
    let sw = rng.range(0, 6.28);
    for (let k = 1; k < 5; k++) {
      let f = k / 5,
        z = z0 + (z1 - z0) * f + rng.range(-1, 1),
        x = x0 + (x1 - x0) * f + 3.2 * Math.sin(sw + f * 6.28) * Math.sin(f * Math.PI);
      pts.push([x, z]);
    }
    pts.push([x1, z1], [x1 + 1.5, z1 + 0.8]);
    let c = cf2Spline(pts, 0.5);
    c.id = "spring";
    c.name = "the spring branch";
    c.area = CF2_BRANCH.springArea;
    c.joinZ = z1;
    c.HW = c.S.map((s) => +(0.45 + 0.08 * Math.sin(s * 0.4) + 1.35 * gauss(s - 0.6, 1.5)).toFixed(3)); // the round pool at the spring
    c.D = c.S.map((s) => +(0.34 + 0.04 * Math.sin(s * 0.5) + 0.38 * gauss(s - 0.6, 1.3)).toFixed(3));
    c.WD = c.S.map((s) => +(0.12 + 0.03 * Math.sin(s * 0.5) + 0.36 * gauss(s - 0.6, 1.2)).toFixed(3)); // water depth
    c.head = { x: c.X[1], z: c.Z[1], r: 1.6 };
    br.spring = c;
  }
  // the Dry Fork: off the plateau, through its notch in the bluff (over the Dry Falls),
  // across the east terrace and floor to the creek
  {
    let zt = T.zDry,
      hw = (z) => 1 / (CF2_VALLEY.halfW + 2.5 * Math.sin(z * 0.035 + T.rimSeed) + 1.5 * Math.sin(z * 0.09 + T.rimSeed * 2)),
      at = (ex, z) => T.axisXRaw(z) + ex / hw(z),
      zj = zt - rng.range(6, 10),
      pts = [
        [at(0.98, zt + 9), zt + 9],
        [at(0.91, zt + 3), zt + 3],
        [at(0.842, zt), zt], // the falls
        [at(0.78, zt - 1.5), zt - 1.5],
        [T.axisXRaw(zt - 3) + T.floorHWRaw(zt - 3) + 9, zt - 3.5],
        [T.axisXRaw(zj + 1) + T.floorHWRaw(zj + 1) - 2, zj + 2],
        [T.creekXRaw(zj) + 4, zj + 0.6],
        [T.creekXRaw(zj) + 0.6, zj],
      ],
      c = cf2Spline(pts, 0.5);
    c.id = "dry";
    c.name = "the Dry Fork";
    c.area = CF2_BRANCH.dryArea;
    c.joinZ = zj;
    c.falls = { x: at(0.842, zt), z: zt };
    let plunge = c.S[c.X.reduce((b, x, i) => (Math.abs(c.Z[i] - zt) + Math.abs(x - c.falls.x) < Math.abs(c.Z[b] - zt) + Math.abs(c.X[b] - c.falls.x) ? i : b), 0)] + 3;
    c.HW = [];
    c.D = [];
    c.WD = [];
    for (let i = 0; i < c.n; i++) {
      let x = c.X[i],
        z = c.Z[i],
        s = c.S[i],
        ex = (x - T.axisXRaw(z)) * hw(z),
        d = Math.abs(x - T.axisXRaw(z)) - T.floorHWRaw(z),
        // cut 0.7 m into the plateau, a metre into the terrace, less across the floor
        D = ex > 0.86 ? 0.7 : d > 3 ? 1.05 : 0.45 + 0.6 * clamp(d / 3, 0, 1),
        pool = gauss(s - plunge, 2.2); // the plunge pool below the falls always holds water
      c.HW.push(+(1.25 + 0.3 * Math.sin(s * 0.21) + 0.9 * pool).toFixed(3));
      c.D.push(+(D + 0.55 * pool).toFixed(3));
      c.WD.push(+(0.5 * pool).toFixed(3));
    }
    c.plunge = plunge;
    br.dry = c;
  }
  for (let b of Object.values(br)) {
    let x0 = Math.min(...b.X),
      x1 = Math.max(...b.X),
      z0 = Math.min(...b.Z),
      z1 = Math.max(...b.Z);
    b.box = [x0, z0, x1, z1];
  }
  return br;
}

// Nearest point of a branch's centre line: { i (sample), o (distance) }, or null when
// (x, z) is more than 8 m from its bounding box.
function cf2BranchDist(b, x, z) {
  let [x0, z0, x1, z1] = b.box;
  if (x < x0 - 8 || x > x1 + 8 || z < z0 - 8 || z > z1 + 8) return null;
  let bi = 0,
    bd = 1e18;
  for (let i = 0; i < b.n; i++) {
    let dx = x - b.X[i],
      dz = z - b.Z[i],
      d = dx * dx + dz * dz;
    if (d < bd) (bd = d), (bi = i);
  }
  return { i: bi, o: Math.sqrt(bd) };
}

// Carve the branches into the fixed part of the ground, and note which cells lie along
// them (for their water).
function cf2CarveBranches(T) {
  let W1 = VW + 1,
    cells = [];
  for (let b of Object.values(T.branches)) {
    let [x0, z0, x1, z1] = b.box;
    for (let z = Math.max(0, Math.floor(z0 - 5)); z <= Math.min(VL, Math.ceil(z1 + 5)); z++)
      for (let x = Math.max(0, Math.floor(x0 - 5)); x <= Math.min(VW, Math.ceil(x1 + 5)); x++) {
        let d = cf2BranchDist(b, x, z);
        if (!d || d.o > 6) continue;
        let i = d.i,
          over = Math.max(0, d.o - b.HW[i]),
          cut = Math.max(0, b.D[i] - over / 0.9), // banks about as steep as they are tall
          k = z * W1 + x;
        if (cut > T.brCut[k]) T.brCut[k] = +cut.toFixed(4);
        if (b.id === "dry" && cut > 0.2 && d.o < b.HW[i] + 0.3) T.rock[k] = 2;
      }
    for (let cz = Math.max(0, Math.floor(z0 - 4)); cz < Math.min(VL, Math.ceil(z1 + 4)); cz++)
      for (let cx = Math.max(0, Math.floor(x0 - 4)); cx < Math.min(VW, Math.ceil(x1 + 4)); cx++) {
        let d = cf2BranchDist(b, cx + 0.5, cz + 0.5);
        if (d && d.o < 4) cells.push({ k: cz * VW + cx, b: b.id, i: d.i, o: +d.o.toFixed(3) });
      }
  }
  // a cell near both branches belongs to the nearer one
  let best = new Map();
  for (let c of cells) if (!best.has(c.k) || best.get(c.k).o > c.o) best.set(c.k, c);
  T.brCells = [...best.values()].sort((a, b) => a.k - b.k);
}

function cf2InSpringPool(T, x, z) {
  let h = T.branches && T.branches.spring && T.branches.spring.head;
  return !!h && (x - h.x) * (x - h.x) + (z - h.z) * (z - h.z) < h.r * h.r;
}

// ---- water --------------------------------------------------------------

function cf2BranchState(cr) {
  return cr.br || (cr.br = { spring: { q: CF2_BRANCH.springQ }, dry: { st: 0, q: 0, state: "dry" } });
}

// One hydrology step for the branches (before the creek's own, in creekHydro).
function cf2BranchStep(w, dtD, rain, s, init) {
  let B = cf2BranchState(w.creek),
    C = CF2_BRANCH;
  B.spring.q = +(C.springQ * (1 + C.springWet * s.wet)).toFixed(6);
  let d = B.dry;
  if (!init) {
    d.st += rain * C.dryFill * dtD;
    let out = d.st * (1 - Math.exp(-dtD / C.dryTau));
    d.st = +(d.st - out).toFixed(6);
  }
  // in a flood the plateau sends its share down at once
  let fk = 0;
  if (w.creek.flood) fk = w.creek.flood.k * Math.exp(-((w.t - w.creek.flood.t0) / VALLEY_DAY) / CREEK.floodTau);
  d.q = +(C.dryQ * (d.st / C.dryTau) + (fk > 0.02 ? fk * Math.pow(C.dryArea, 0.8) : 0)).toFixed(6);
  d.state = d.q > C.dryRunning ? "running" : d.q > C.dryRunning * 0.08 || d.st > 0.02 ? "pools" : "dry";
}

// What the branches add to the creek's flow at node i (m3/s).
function cf2BranchIn(w, i) {
  let T = w.terrain,
    B = w.creek.br;
  if (!B) return 0;
  if (!T._brJoin) T._brJoin = Object.fromEntries(Object.values(T.branches).map((b) => [b.id, creekNodeIndex(b.joinZ)]));
  let q = 0;
  if (i === T._brJoin.spring) q += B.spring.q;
  if (i === T._brJoin.dry) q += B.dry.q;
  return q;
}

// The water surface in a branch at sample i (for drawing and for the cells beside it),
// or null where it's dry.
function cf2BranchWater(w, b, i) {
  let T = w.terrain,
    B = cf2BranchState(w.creek),
    bed = T.heightAt(b.X[i], b.Z[i]);
  if (b.id === "spring") return bed + b.WD[i];
  let d = B.dry,
    run = d.state === "running" ? clamp(0.12 + 0.35 * Math.sqrt(d.q / 0.05), 0.12, 0.6) : 0;
  if (b.WD[i] > 0.05) return bed + Math.max(b.WD[i] * (d.state === "dry" ? 0.7 : 1), run);
  return run > 0 ? bed + run : d.state === "pools" && Math.sin(b.S[i] * 1.7) > 0.55 ? bed + 0.08 : null;
}

// After the creek's own pass over the cells: the ground along a branch with water in it
// stays wet. (Wraps Creekfolk 1's creekCellWater; see docs/MERGE.md.)
var cf2CellWaterBase = creekCellWater;
creekCellWater = function (w, dtD, s) {
  let T = w.terrain,
    cells = T.brCells || [],
    prev = cf2CellWaterBase.prev && cf2CellWaterBase.prev.length === cells.length ? cf2CellWaterBase.prev : (cf2CellWaterBase.prev = new Float32Array(cells.length));
  if (w.wet) for (let j = 0; j < cells.length; j++) prev[j] = w.wet[cells[j].k];
  cf2CellWaterBase(w, dtD, s);
  if (!cells.length || !w.creek) return;
  let c = creekCells(w),
    cr = w.creek,
    wt = w.wt,
    green = w.green,
    wet = w.wet,
    up = dtD > 0 ? 1 - Math.exp(-dtD / 0.8) : 1,
    down = dtD > 0 ? 1 - Math.exp(-dtD / 3) : 1,
    dWet = 0,
    dGreen = 0,
    nf = c.nFloor || 1,
    lv = {};
  for (let b of Object.values(T.branches)) lv[b.id] = b;
  for (let j = 0; j < cells.length; j++) {
    let e = cells[j],
      b = lv[e.b],
      ws = cf2BranchWater(w, b, e.i);
    if (ws == null) continue;
    let k = e.k,
      table = ws - 0.12 * Math.max(0, e.o - b.HW[e.i]);
    if (table <= wt[k]) continue;
    let wasWet = wet[k] > 0.35,
      wasGreen = green[k] > 0.5;
    wt[k] = table;
    let dw = c.h[k] - table,
      gr = Math.max(cr.soil, dw < 0.55 ? 1 : dw < CREEK.root ? 1 - (dw - 0.55) / (CREEK.root - 0.55) : 0),
      target = dw < 0.02 ? 1 : dw < 0.32 ? 1 - (dw - 0.02) / 0.3 : 0;
    green[k] = Math.max(green[k], gr);
    if (dtD > 0) {
      let cur = prev[j],
        nw = target > cur ? cur + (target - cur) * up : cur - (cur - target) * down;
      if (nw > wet[k]) wet[k] = nw < 0.01 ? 0 : nw;
      if (c.floor[k]) (dWet += (wet[k] > 0.35) - wasWet), (dGreen += (green[k] > 0.5) - wasGreen);
    }
  }
  if (dtD > 0) {
    cr.wetNow = +(cr.wetNow + dWet / nf).toFixed(4);
    cr.greenNow = +(cr.greenNow + dGreen / nf).toFixed(4);
  }
};

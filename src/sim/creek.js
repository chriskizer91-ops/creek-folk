// ==========================================================================
// The creek (Phase 3A).
//
// Creek Care's river model (ref/creek-care-river-core.js), ported and rescaled
// for a small stream, plus what Creekfolk needs on top of it:
//
//   SHAPE      The creek is a chain of nodes 2 m apart along the valley (z). Each
//              node has a bed, an old valley floor it has cut down below (fp), a
//              trench (bottom width wb, side slope m), maybe an inset bench (bw, bz),
//              plants (veg) and a water table under the floor beside it (g).
//   FLOODS     Each storm is one flood. Flow from the drained area (Q = k(T) A^0.8),
//              depth from Manning's equation in the compound channel. Behind a dam
//              the water is deeper than the flow needs, so the energy slope (and the
//              force on the bed) drops: that is how ponds trap gravel and mud.
//   ONLY BUILDS  The author's settled rule: floods reshape the creek only in ways that
//              build. Gravel and mud settle; nothing is scoured; banks don't retreat;
//              dams never wash out. The bed stays a little below the floor.
//   STAGE 0    Where floods go over the bank, the water is routed across the valley
//              floor and wears shallow side channels that reinforce themselves, so a
//              healed valley floor becomes many channels, ponds and marsh.
//   WATER      Every 10 minutes: the spring and the hills feed the creek; the creek and
//              the floor's water table trade water; a deep trench drains the floor;
//              ponds fill, spill, evaporate and seep; plants draw the water table down
//              in the dry season. From the water table each cell of the valley gets
//              its depth to water, which makes it open water, marsh, green or brown.
//   DAMS       A dam is a crest on one node. It can hold water at most CREEK.dropMax
//              above the water just below it; higher than that the water digs under
//              and the pond barely holds. That is where "build downstream first" comes
//              from: nothing scripted, just the drop.
//
// Units: metres, seconds, m3/s, Pa. x across the valley, z along it (downstream is +z).
// Everything random comes from the creek's own seeded generator (saved with the world).
// ==========================================================================

var VW = 80, // valley grid: cells across
  VL = 160, // cells along the creek
  CELLS = VW * VL,
  VERTS = (VW + 1) * (VL + 1);

var CREEK = {
  ds: 2, // metres between nodes
  z0: -24, // the model runs a little beyond both ends of the valley
  z1: VL + 24,
  A0: 0.05, // km2 drained at the upstream end (the spring and the hills above it)
  lam: 0.1, // km2 more per km of valley
  D50: 0.016, // gravel size (m)
  // sediment brought by a valley year of floods, per km2 drained (m3 of solid)
  gravelYield: 30,
  fineYield: 800,
  stormsPerYear: 8, // expected storms (floods) in one valley year
  pondTrap: 0.03, // share of the passing mud that settles in each node of a pond
  // dams
  crest: [0, 0.3, 0.55, 0.55], // crest above the bed by dam level (weir, mud dam, planted banks)
  dropMax: 0.42, // the most a dam holds above the water just below it
  pipeHold: 0.18, // what a dam with too big a drop still holds above the water below
  raiseStep: 0.12, // a silted-up dam is raised this much at a time
  raiseAbove: 0.1, // ... up to this far above the valley floor
  siltGap: 0.12, // a pond counts as silted up when the bed behind is this close to the crest
  // hydrology (rates per valley day unless named otherwise)
  springQ: 0.0004, // m3/s the spring gives in the dry season (more in the wet season)
  upFill: 0.55, // upstream storage gained per valley day of rain (relative units)
  upTau: 2.2, // valley days for the upstream storage to drain
  upQ: 0.05, // m3/s per unit of upstream storage
  latRun: 0.00003, // m3/s per metre of valley while it rains (runoff from the sides)
  soilWet: 1.2, // topsoil moisture gained per valley day of rain
  soilDry: 0.018, // lost per valley day at full warmth
  rech: 0.05, // m of water-table rise per valley day of rain
  et: 0.004, // m of water-table fall per valley day at full warmth with roots in reach
  root: 1.3, // m: how deep roots reach
  tauDeep: 2.5, // valley days for a deep, cut-down trench to drain the floor
  tauShallow: 40, // ... and a creek near the top of its floor
  bedLoss: 1.6e-5, // m/s of water lost into a bed sitting above the water table
  deep: 0.016, // m/valley day the water table sinks into the gravel below a bare bed
  evap: 0.0011, // m/valley day off open water at full warmth
  pondSeep: 0.0004, // m/valley day a pond loses into drier ground around it
  lambda: 3, // m: how far the creek's water level reaches into the floor's water table
  hillFill: 0.03, // m of water-table rise the hills store per valley day of rain ...
  hillTau: 70, // ... and give back to the floor slowly, over this many valley days
  floodTau: 0.12, // valley days for a flood to drain away
};

var CREEK_PHYS = { g: 9.81, rho: 1000, srel: 1.65, por: 0.35 };

// Saves from another build are refused with the author's wording.
var OTHER_BUILD_TEXT = "This valley was made in an earlier version of Creekfolk and can't be opened here";

var CREEK_STAGES = {
  0: { name: "Stage 0: valley-floor wetland", text: "The creek has filled its trench and spread across the valley floor in many small channels, ponds and marsh." },
  I: { name: "Stage I: steady", text: "The creek reaches its floor, so floods spread out and lose their punch." },
  II: { name: "Stage II: cut down", text: "The creek sits in a trench below its old floor. Floods can't spread out, and the floor beside it dries." },
  III: { name: "Stage III: banks falling in", text: "The banks are too tall to stand." },
  IV: { name: "Stage IV: refilling", text: "Gravel and mud are piling up and the bed is rising; a new floor is growing inside the old trench." },
  V: { name: "Stage V: healed", text: "A new floor has built up inside the trench and plants hold it. Floods can spread out again." },
};

// ---- Creek Care's hydraulics, unchanged in substance ----------------------

// Peak flow per km2^0.8 for a flood of return period T (years).
function creekKofT(T) {
  if (T <= 1) return 5.4 * Math.max(T, 0.05);
  let lt = Math.log10(T);
  return lt <= 1 ? 5.4 + 10.4 * lt : 15.8 + 14.2 * (lt - 1);
}
function creekDurH(T) {
  return T < 1 ? 12 : T < 2 ? 10 : T < 10 ? 8 : 6;
}
// The natural bankfull channel for a drained area: width and depth (m).
function creekNatural(A) {
  let Q = creekKofT(1.5) * Math.pow(Math.max(A, 0.005), 0.8);
  return { Q, w: 2.7 * Math.sqrt(Q), d: 0.3 * Math.cbrt(Q) };
}
var creekTrench = (n) => Math.max(n.fp - n.bed, 0.05);
var creekBenchDepth = (n) => (n.bw > 0.05 ? clamp(n.bz - n.bed, 0, creekTrench(n) - 0.03) : 0);
var creekTopWidth = (n) => n.wb + 2 * n.m * creekTrench(n) + n.bw;
function creekWidthAt(n, y) {
  let Ht = creekTrench(n),
    Hz = creekBenchDepth(n),
    yy = Math.min(y, Ht),
    w = n.wb + 2 * n.m * yy;
  if (n.bw > 0.05 && yy > Hz) w += n.bw;
  if (y > Ht) w = Math.max(n.Wv || 20, creekTopWidth(n));
  return w;
}
function creekConveyance(n, y, S, o) {
  let Ht = creekTrench(n),
    Hz = creekBenchDepth(n),
    m = n.m,
    sq = Math.sqrt(1 + m * m),
    sS = Math.sqrt(S),
    y1 = Math.min(y, Ht),
    A,
    P,
    Qb = 0,
    Qf = 0;
  if (Hz > 0) {
    let wch = n.wb + 2 * m * Hz,
      yb = Math.min(y1, Hz);
    A = n.wb * yb + m * yb * yb + (y1 > Hz ? wch * (y1 - Hz) : 0);
    P = n.wb + 2 * yb * sq;
    if (y1 > Hz) {
      let Ab = n.bw * (y1 - Hz),
        Pb = n.bw + (y1 - Hz);
      Qb = (Ab * Math.pow(Ab / Pb, 2 / 3) * sS) / n.nB;
    }
  } else {
    A = n.wb * y1 + m * y1 * y1;
    P = n.wb + 2 * y1 * sq;
  }
  if (y > Ht) {
    let yo = y - Ht,
      wt = creekTopWidth(n);
    A += wt * yo;
    let Wf = Math.max((n.Wv || 20) - wt, 4);
    Qf = (Math.pow(yo, 5 / 3) * Wf * sS) / n.nF;
  }
  let Qc = ((A * Math.cbrt(A * A)) / Math.cbrt(P * P) * sS) / n.nC;
  if (o) (o.A = A), (o.P = P), (o.Qc = Qc), (o.Qb = Qb), (o.Qf = Qf);
  return Qc + Qb + Qf;
}
function creekSolveDepth(n, Q, S) {
  let lo = 0.001,
    hi = 0,
    y = clamp(Math.pow((Q * n.nC) / (Math.max(n.wb, 0.3) * Math.sqrt(S)), 0.6), 0.005, 20);
  for (let it = 0; it < 40; it++) {
    let f = creekConveyance(n, y, S) - Q;
    f < 0 ? (lo = y) : (hi = y);
    if (Math.abs(f) < 1e-4 * Q) return y;
    let dy = Math.max(1e-3 * y, 1e-5),
      d = (creekConveyance(n, y + dy, S) - Q - f) / dy,
      yn = d > 1e-12 ? y - f / d : hi ? 0.5 * (lo + hi) : y * 1.6;
    if (yn <= lo || (hi && yn >= hi) || !(yn > 0)) yn = hi ? 0.5 * (lo + hi) : Math.max(y * 1.6, lo * 2);
    if (Math.abs(yn - y) < 1e-6) return yn;
    y = yn;
  }
  return y;
}
function creekHydraulics(n, Q, S) {
  let o = {},
    y = creekSolveDepth(n, Q, S);
  creekConveyance(n, y, S, o);
  let R = o.A / Math.max(o.P, 0.05),
    share = o.Qf / Math.max(o.Qc + o.Qb + o.Qf, 1e-12),
    tau = CREEK_PHYS.rho * CREEK_PHYS.g * Math.min(R, y) * S * Math.sqrt(Math.max(1 - 0.8 * share, 0.2));
  return { y, yo: Math.max(y - creekTrench(n), 0), tau, R, share, Qf: o.Qf };
}
function creekRough(n) {
  n.nC = 0.03 * Math.pow(n.D50 / 0.03, 1 / 6) + 0.012 * n.veg;
  n.nB = 0.045 + 0.05 * n.veg;
  n.nF = 0.06 + 0.07 * n.veg;
  return n;
}
// Depth of a small flow in the bottom of the channel (wide-rectangle Manning).
function creekLowDepth(n, q, S) {
  if (q <= 1e-6) return 0;
  return Math.pow((q * n.nC) / (Math.max(n.wb, 0.3) * Math.sqrt(Math.max(S, 2e-4))), 0.6);
}

// ---- building the creek for a new valley ---------------------------------

// The creek on day one, from the terrain's fixed shape and the seed. Incised:
// the bed sits about a metre below the old valley floor in a narrow trench.
function creekBuildNodes(terrain, seed) {
  let rng = new Rng(seed + ":creek-build"),
    p1 = rng.range(0, 6.28),
    p2 = rng.range(0, 6.28),
    nodes = [];
  for (let z = CREEK.z0; z <= CREEK.z1 + 1e-6; z += CREEK.ds) {
    let A = CREEK.A0 + (CREEK.lam * (z - CREEK.z0)) / 1000,
      nat = creekNatural(A),
      fp = terrain.fp0(z),
      // how far it has cut down: deeper in the middle reaches, a little more on the steep upper stretch
      D = 0.98 + 0.22 * (0.5 + 0.5 * Math.sin(z * 0.031 + p1)) + 0.1 * Math.sin(z * 0.083 + p2) + (z < terrain.zKnee ? 0.12 : 0),
      n = {
        z: +z.toFixed(2),
        x: +terrain.creekX(z).toFixed(3),
        A: +A.toFixed(5),
        aLat: +(z === CREEK.z0 ? CREEK.A0 : (CREEK.lam * CREEK.ds) / 1000).toFixed(6),
        len: CREEK.ds,
        fp,
        bed: fp - D,
        wb: +(0.78 * nat.w).toFixed(3),
        m: 0.62,
        bw: 0,
        bz: -1e9,
        D50: CREEK.D50,
        veg: 0.28,
        vegT: 0.28,
        g: 0,
        wl: 0,
        q: 0,
        emaBed: 0,
        yBed: 0,
        stage: "II",
        spread: 0,
      };
    nodes.push(n);
  }
  // the bed always falls downstream
  for (let i = nodes.length - 2; i >= 0; i--) {
    let a = nodes[i],
      b = nodes[i + 1];
    if (a.bed < b.bed + 0.003 * CREEK.ds) a.bed = b.bed + 0.003 * CREEK.ds;
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

// A new valley's creek state (world.creek).
function creekInit(w) {
  let T = w.terrain,
    nodes = T.initNodes.map((n) => ({ ...n }));
  let cr = {
    v: 1,
    rng: new Rng(w.seed + ":creek").getState(),
    nodes,
    dams: {},
    soil: 0.9,
    up: 1.2,
    hill: 0.6,
    flood: null,
    floods: 0,
    sIdx: -1,
    yearNo: 1,
    minWet: 1,
    minGreen: 1,
    driest: [],
    wetNow: 0,
    greenNow: 0,
    flowLen: 0,
    notes: {},
    chan: new Float32Array(VERTS),
    init: nodes.map((n) => [n.bed, n.fp, n.wb]),
  };
  w.creek = cr;
  creekDerive(w);
  creekHydro(w, true);
  return cr;
}

// ---- derived values (rebuilt after a load and after the shape changes) ----

// Per-node slope, roughness and floor width; per-cell lookups for the water table.
function creekDerive(w) {
  let cr = w.creek,
    ns = cr.nodes,
    T = w.terrain;
  for (let n of ns) {
    n.Wv = 2 * T.floorHW(n.z);
    creekRough(n);
  }
  creekSlopes(cr);
  T.setCreek(cr);
  creekCellIndex(w);
}

// Bed slope at each node from the effective bed (a dam's crest counts as bed).
function creekSlopes(cr) {
  let ns = cr.nodes,
    N = ns.length,
    eb = ns.map((n, i) => creekEffBed(cr, i)),
    raw = ns.map((n, i) => (i < N - 1 ? (eb[i] - eb[i + 1]) / CREEK.ds : (eb[i - 1] - eb[i]) / CREEK.ds));
  for (let i = 0; i < N; i++) {
    let s = 0,
      c = 0,
      a = Math.max(0, i - 2),
      b = Math.min(N - 1, i + 2);
    for (let j = a; j <= b; j++) (s += raw[j]), c++;
    // the reach's slope, but never much less than the valley floor's own (smooth)
    // slope: a bumpy bed must not make its own humps look flat, or they keep growing
    let fpS = (ns[a].fp - ns[b].fp) / ((b - a) * CREEK.ds),
      wide = Math.max(s / c, 0.5 * fpS, 3e-4);
    ns[i]._S = clamp(raw[i], 0.3 * wide, 2.5 * wide);
    ns[i]._Sw = wide;
  }
}

function creekDamAt(cr, i) {
  for (let id in cr.dams) if (cr.dams[id].i === i) return cr.dams[id];
  return null;
}
function creekEffBed(cr, i) {
  let n = cr.nodes[i],
    d = cr._damAt ? cr._damAt[i] : creekDamAt(cr, i);
  return d ? Math.max(n.bed, d.crest) : n.bed;
}
function creekNodeIndex(z) {
  return clamp(Math.round((z - CREEK.z0) / CREEK.ds), 0, Math.round((CREEK.z1 - CREEK.z0) / CREEK.ds));
}
// Interpolated node values at z (for drawing and lookups).
function creekAt(cr, z, key) {
  let f = clamp((z - CREEK.z0) / CREEK.ds, 0, cr.nodes.length - 1.0001),
    i = Math.floor(f),
    t = f - i,
    a = cr.nodes[i],
    b = cr.nodes[i + 1];
  return a[key] + (b[key] - a[key]) * t;
}

// Static per-cell lookups: which node, distance from the trench edge, floor weight.
var creekCellCache = new WeakMap();
function creekCellIndex(w) {
  let T = w.terrain,
    cr = w.creek,
    c = creekCellCache.get(cr);
  if (!c) {
    c = {
      node: new Int16Array(CELLS),
      d: new Float32Array(CELLS),
      floor: new Uint8Array(CELLS),
      h: new Float32Array(CELLS),
      nFloor: 0,
    };
    creekCellCache.set(cr, c);
  }
  let nf = 0;
  for (let cz = 0; cz < VL; cz++) {
    let z = cz + 0.5,
      i = creekNodeIndex(z),
      n = cr.nodes[i],
      cx = T.creekX(z),
      half = 0.5 * creekTopWidth(n),
      fhw = T.floorHW(z),
      ax = T.axisX(z);
    for (let cxI = 0; cxI < VW; cxI++) {
      let k = cz * VW + cxI,
        x = cxI + 0.5;
      c.node[k] = i;
      c.d[k] = Math.max(0, Math.abs(x - cx) - half);
      // the valley floor: the bottomland, with the creek in it
      let fl = (Math.abs(x - ax) < fhw - 0.5 || Math.abs(x - cx) <= half) && T.valleyR(x, z) < 0.9 && z > 0 && z < VL ? 1 : 0;
      c.floor[k] = fl;
      nf += fl;
      c.h[k] = 0.25 * (T.h[cz * (VW + 1) + cxI] + T.h[cz * (VW + 1) + cxI + 1] + T.h[(cz + 1) * (VW + 1) + cxI] + T.h[(cz + 1) * (VW + 1) + cxI + 1]);
    }
  }
  c.nFloor = nf;
  return c;
}
function creekCells(w) {
  return creekCellCache.get(w.creek) || creekCellIndex(w);
}

// ---- dams ----------------------------------------------------------------

// Bring the model's dams in line with the dam structures (call when one is built,
// raised or removed, and after a load).
function creekSyncDams(w) {
  let cr = w.creek,
    seen = {};
  for (let s of w.structures) {
    if (s.kind !== "dam" || !(s.level > 0)) continue;
    seen[s.id] = 1;
    let d = cr.dams[s.id];
    if (!d) {
      let i = creekNodeIndex(s.z);
      d = cr.dams[s.id] = { id: s.id, i, crest: cr.nodes[i].bed + CREEK.crest[s.level], lv: s.level, pl: cr.nodes[i].bed, plMax: cr.nodes[i].bed, hold: 1, raised: 0 };
    }
    if (s.level > d.lv) {
      // a new level: mud-packing the weir makes it taller
      if (CREEK.crest[s.level] > CREEK.crest[d.lv]) d.crest = Math.max(d.crest + CREEK.crest[s.level] - CREEK.crest[d.lv], cr.nodes[d.i].bed + CREEK.crest[s.level]);
      d.lv = s.level;
    }
    d.cond = s.cond ?? 1;
    // willow-planted banks: plants take hold along the pond
    if (s.level >= 3 && !d.planted) {
      d.planted = 1;
      for (let i = Math.max(0, d.i - 6); i <= Math.min(cr.nodes.length - 1, d.i + 2); i++) cr.nodes[i].vegT = Math.max(cr.nodes[i].vegT, 0.85);
    }
  }
  for (let id in cr.dams) if (!seen[id]) delete cr.dams[id];
  creekRefresh(w);
}

// Everything derived from the creek's saved state, brought up to date. Called after
// every change to the creek (and after a load), so a reloaded valley is exactly the
// valley that was saved.
function creekRefresh(w) {
  let cr = w.creek;
  creekDamIndex(cr);
  creekSlopes(cr); // a dam's crest counts as bed for the slope
  creekPondLevels(cr);
  creekPondNow(cr);
  creekCellWater(w, 0, seasonAt(w));
}

// Would this dam still hold its pond if it were built `add` higher? (What someone who
// knows "downstream" can judge by eye: is there water standing at its foot?)
function creekSafeToRaise(w, s, add) {
  let cr = w.creek,
    d = cr && cr.dams[s.id];
  if (!d) return true;
  if (d.tail === undefined) creekPondLevels(cr);
  return d.crest + add - d.tail <= CREEK.dropMax;
}

// A silted-up dam built up a hand higher (the tending chore). Returns true if it rose.
function creekRaiseDam(w, s, who) {
  let cr = w.creek,
    d = cr && cr.dams[s.id];
  s.raise = 0;
  s.siltNoted = 0;
  if (!d) return false;
  let n = cr.nodes[d.i],
    top = n.fp + CREEK.raiseAbove;
  if (d.crest >= top - 0.01) return false;
  // someone who knows the water must stand at its foot won't build it up into a leak.
  // If no dam below holds water against it, they lay a stone apron below it first, so
  // the water below stands higher: the series climbs from the bottom up.
  let apron = false;
  if (who && who.know && who.know.downstream && !creekSafeToRaise(w, s, CREEK.raiseStep)) {
    let N = cr.nodes.length,
      below = false;
    for (let j = d.i + 1; j <= Math.min(N - 1, d.i + 4); j++) if (cr._damAt && cr._damAt[j]) below = true;
    if (below) return false;
    let target = d.crest + CREEK.raiseStep - CREEK.dropMax + 0.02;
    for (let j = d.i + 1; j < N; j++) {
      let n2 = cr.nodes[j],
        want = target - 0.14 * (j - d.i - 1);
      if (want <= n2.bed + 0.005) break;
      want = Math.min(want, n2.fp - 0.1);
      n2.bed = n2.bedMin = +want.toFixed(5);
    }
    apron = true;
  }
  d.crest = +Math.min(top, d.crest + CREEK.raiseStep).toFixed(4);
  d.apron = (d.apron || 0) + (apron ? 1 : 0);
  d.raised = (d.raised || 0) + 1;
  s.raised = d.raised;
  s.cond = 1;
  w.stats.raises = (w.stats.raises || 0) + 1;
  logEvent(
    w,
    w.stats.raises === 1 ? 2 : 1,
    d.crest > n.fp ?
    `${who.name} built the ${builtLevelDef(s).label} up above the valley floor. Its pond will spread out over the floor now.` :
    apron ?
    `${who.name} laid a stone apron below the ${builtLevelDef(s).label} and built it up a hand higher, over the silt.` :
    s.silted ?
    `${who.name} built the ${builtLevelDef(s).label} up a hand higher, over the silt.` :
    `${who.name} built the ${builtLevelDef(s).label} up a hand higher, so the pond above it can rise too.`,
    [who.id],
    s,
    "wetland"
  );
  if (apron) creekDerive(w);
  creekRefresh(w);
  return true;
}
function creekDamIndex(cr) {
  let at = new Array(cr.nodes.length).fill(null);
  for (let id in cr.dams) at[cr.dams[id].i] = cr.dams[id];
  cr._damAt = at;
  cr._damIds = Object.keys(cr.dams).sort((a, b) => cr.dams[b].i - cr.dams[a].i); // downstream first
}

// Full-pond levels: what each dam can hold, judged from the water standing below it.
// Fills cr._pond (the full-pond level over each node, or -1e9), cr._pondOwner (the dam
// whose basin a node lies in, or -1) and each dam's plMax, tail and hold.
function creekPondLevels(cr) {
  let ns = cr.nodes,
    N = ns.length,
    full = cr._pondFull && cr._pondFull.length === N ? cr._pondFull : (cr._pondFull = new Float64Array(N)),
    owner = cr._pondOwner && cr._pondOwner.length === N ? cr._pondOwner : (cr._pondOwner = new Int32Array(N));
  full.fill(-1e9);
  owner.fill(-1);
  if (!cr._damIds) creekDamIndex(cr);
  for (let id of cr._damIds) {
    let d = cr.dams[id],
      j = d.i,
      below = Math.min(N - 1, j + 1),
      tail = Math.max(ns[below].bed + 0.05, full[below]),
      leak = 0.3 * Math.pow(1 - clamp(d.cond ?? 1, 0, 1), 1.5),
      top = d.crest - leak,
      max = top - tail <= CREEK.dropMax ? top : Math.min(top, tail + CREEK.pipeHold);
    d.plMax = +max.toFixed(5);
    d.tail = +tail.toFixed(5);
    d.hold = top - tail <= CREEK.dropMax ? 1 : 0; // 0: the water digs under it
    d.drowned = 0;
    for (let i = j; i >= 0; i--) {
      if (i < j && cr._damAt[i] && cr._damAt[i].crest >= max) break;
      if (ns[i].bed >= max) break;
      if (max > full[i]) {
        if (i < j && cr._damAt[i]) cr._damAt[i].drowned = 1;
        full[i] = max;
        owner[i] = +id;
      }
    }
  }
  return full;
}

// The water standing in each pond now (ponds shrink in the dry season): cr._pondNow[i]
// is the owning pond's level where it is above the bed, or -1e9.
function creekPondNow(cr) {
  let ns = cr.nodes,
    N = ns.length,
    now = cr._pondNow && cr._pondNow.length === N ? cr._pondNow : (cr._pondNow = new Float64Array(N)),
    owner = cr._pondOwner;
  if (!owner) creekPondLevels(cr), (owner = cr._pondOwner);
  for (let i = 0; i < N; i++) {
    let o = owner[i],
      d = o >= 0 ? cr.dams[o] : null;
    now[i] = d && d.pl > ns[i].bed ? d.pl : -1e9;
  }
  return now;
}

// ---- floods --------------------------------------------------------------

// Expected sum of k^1.5 * duration over a valley year's storms, so each flood can
// carry its fair share of the year's sediment.
var creekYearWork = (() => {
  let s = 0,
    n = 4000;
  for (let k = 0; k < n; k++) {
    let u = (k + 0.5) / n,
      T = Math.min(200, 1 / (CREEK.stormsPerYear * u));
    s += Math.pow(creekKofT(T), 1.5) * creekDurH(T);
  }
  return (s / n) * CREEK.stormsPerYear;
})();

// A storm has begun: one flood. Returns the flood's return period.
function creekStorm(w, Tforce) {
  let cr = w.creek;
  if (!cr) return 0;
  let rng = new Rng(1);
  rng.setState(cr.rng);
  let T = Tforce || Math.min(200, Math.max(0.15, 1 / (CREEK.stormsPerYear * Math.max(rng.next(), 1e-4))));
  let seed = rng.next();
  cr.rng = rng.getState();
  creekFloodWork(w, T, seed);
  cr.floods++;
  cr.flood = { t0: w.t, k: creekKofT(T), T: +T.toFixed(2) };
  return T;
}

function creekFloodWork(w, T, seed) {
  let cr = w.creek,
    ns = cr.nodes,
    N = ns.length,
    P = CREEK_PHYS,
    k = creekKofT(T),
    durS = creekDurH(T) * 3600,
    share = (Math.pow(k, 1.5) * creekDurH(T)) / creekYearWork,
    full = creekPondLevels(cr),
    spills = [];
  creekSlopes(cr);
  // A. flow, depth and the force on the bed. Water can't stand lower than the water just
  // below it, so a pool behind a hump of gravel (or a dam's pond) is slack water: pools
  // fill and humps don't, which keeps the bed from growing into a sawtooth.
  let hyd = new Array(N),
    surf = new Float64Array(N);
  for (let i = N - 1; i >= 0; i--) {
    let n = ns[i],
      Q = k * Math.pow(n.A, 0.8),
      S = Math.max(n._S, 1e-4),
      h = creekHydraulics(n, Q, S);
    hyd[i] = h;
    surf[i] = Math.max(n.bed + h.y, full[i], i < N - 1 && !(cr._damAt && cr._damAt[i]) ? surf[i + 1] : -1e9);
  }
  for (let i = 0; i < N; i++) {
    let n = ns[i],
      Q = k * Math.pow(n.A, 0.8),
      S = Math.max(n._S, 1e-4),
      h = hyd[i],
      y = h.y,
      tau = h.tau,
      ws = n.bed + y;
    if (surf[i] > n.bed + y + 1e-4) {
      // the water is deeper than the flow needs: slack water
      let yp = surf[i] - n.bed,
        Se = S * Math.pow(y / yp, 10 / 3);
      tau = P.rho * P.g * Math.min(h.R * (yp / y), yp) * Se;
      ws = surf[i];
    }
    n._tau = tau;
    n._ws = ws;
    n._y = ws - n.bed;
    n._ob = ws > n.fp ? h.Qf + (full[i] > n.fp ? 0.3 * Q : 0) : 0;
    n.ob = +(ws > n.fp ? Math.min(1, (ws - n.fp) / 0.2) : 0).toFixed(3);
    if (n._ob > 0 && n.z > 0 && n.z < VL) spills.push(i);
  }
  // B. gravel: moves where the force is enough, settles where it is not. A flood can
  // carry on gravel that an earlier, smaller flood dropped loose on the bed, but it
  // never digs below what has settled for good (bedMin): the creek only builds.
  let qgUp = 0,
    deposit = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let n = ns[i],
      qgIn = qgUp + (CREEK.gravelYield * n.aLat * share) / durS,
      th = n._tau / (P.srel * P.rho * P.g * n.D50),
      qb = th > 0.045 ? 8 * Math.pow(th - 0.045, 1.5) * Math.sqrt(P.srel * P.g * Math.pow(n.D50, 3)) : 0,
      cap = qb * Math.max(n.wb, 0.5),
      f = 1 - Math.exp(-n.len / Math.max(8, 8 * n.wb)),
      qgOut = cap * f + qgIn * (1 - f),
      area = (1 - P.por) * Math.max(n.wb, 0.5) * n.len;
    if (qgOut > qgIn) {
      let loose = Math.max(0, n.bed - (n.bedMin ?? n.bed)) * area;
      qgOut = qgIn + Math.min(qgOut - qgIn, loose / durS);
    }
    deposit[i] += (qgIn - qgOut) * durS;
    qgUp = Math.max(0, qgOut);
  }
  // C. mud: settles in ponds, among plants, and on the floor when the water goes over the bank
  let qfUp = 0,
    floorDep = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let n = ns[i],
      qfIn = qfUp + (CREEK.fineYield * n.aLat * share) / durS,
      pondy = full[i] > n.bed ? clamp((full[i] - n.bed) / 0.5, 0, 1) : 0,
      slow = clamp(1 - n._tau / 15, 0, 1),
      trap = clamp(CREEK.pondTrap * pondy + slow * (0.03 * Math.max(0, n.veg - 0.3) + (n.bw > 0.05 ? 0.015 : 0)), 0, 0.4),
      dep = trap * qfIn;
    deposit[i] += dep * durS;
    let over = n.ob > 0 ? clamp(0.18 * n.ob, 0, 0.25) : 0,
      fdep = over * (qfIn - dep);
    floorDep[i] = fdep * durS;
    qfUp = Math.max(0, qfIn - dep - fdep);
  }
  // A flood lays gravel and mud down as a sheet over a stretch of creek, not on one
  // node: left on one node, a deposit starves the node above it of slope, that node
  // fills too, and since deposits never wash out again the bed grows into a sawtooth.
  // So each node's deposit is shared with its neighbours (never across a dam), and the
  // mud left on the floor spreads further, along the valley.
  creekShareDeposit(cr, deposit, 3, true);
  creekShareDeposit(cr, floorDep, 6, false);
  // D. the bed and the floor rise
  let rose = 0;
  for (let i = 0; i < N; i++) {
    let n = ns[i],
      wWet = deposit[i] < 0 ? Math.max(n.wb, 0.5) : Math.max(n.wb + n.m * Math.min(creekTrench(n), Math.max(n._y, 0.1)), 0.5),
      dz = deposit[i] / ((1 - P.por) * wWet * n.len),
      cap = Math.min(n.fp - 0.05, Math.max(full[i], n.bed + 0.3)),
      floor0 = n.bedMin ?? n.bed;
    dz = clamp(dz, floor0 - n.bed, Math.max(0, cap - n.bed));
    dz = Math.min(dz, 0.12);
    n.bed = +(n.bed + dz).toFixed(5);
    rose += dz;
    // loose deposits settle for good: quickly in still water or among plants
    let k = full[i] > n.bed + 0.05 ? 0.5 : n.veg > 0.55 ? 0.2 : 0.03;
    n.bedMin = +(floor0 + Math.max(0, n.bed - floor0) * k).toFixed(5);
    let fw = Math.max(n.Wv - creekTopWidth(n), 6),
      dfp = floorDep[i] / ((1 - P.por) * fw * n.len);
    if (dfp > 0) n.fp = +(n.fp + Math.min(dfp, 0.02)).toFixed(5);
    // a bench buried by the rising bed is gone
    if (n.bw > 0.05 && n.bz <= n.bed + 0.05) (n.bw = 0), (n.bz = -1e9);
    // a bench rises with the mud that floods leave on it
    if (n.bw > 0.05 && n._ws > n.bz) {
      let nat = creekNatural(n.A);
      n.bz = Math.min(n.fp - 0.05, n.bz + clamp(0.004 + 0.01 * n.veg, 0, 0.02) * Math.min(1, (n._ws - n.bz) / 0.2) * (n.bz - n.bed < nat.d ? 1.5 : 1));
    }
  }
  // E. water over the floor wears side channels
  if (spills.length) creekSpread(w, spills, seed);
  cr.lastRise = +rose.toFixed(4);
  creekDerive(w);
  creekRefresh(w);
  creekNotes(w);
}

// Share each node's positive deposit (m3) with its neighbours within R nodes, weighted
// by closeness (a triangle). With byDam, a deposit never crosses a dam: the break is
// between a dam's node and the node below it. Volume is kept; scour (negative) stays put.
function creekShareDeposit(cr, dep, R, byDam) {
  let N = dep.length,
    at = cr._damAt,
    seg = new Int32Array(N),
    out = new Float64Array(N);
  for (let i = 1; i < N; i++) seg[i] = seg[i - 1] + (byDam && at && at[i - 1] ? 1 : 0);
  for (let i = 0; i < N; i++) {
    let v = dep[i];
    if (v <= 0) {
      out[i] += v;
      continue;
    }
    let lo = Math.max(0, i - R),
      hi = Math.min(N - 1, i + R),
      sw = 0;
    for (let j = lo; j <= hi; j++) if (seg[j] === seg[i]) sw += R + 1 - Math.abs(j - i);
    for (let j = lo; j <= hi; j++) if (seg[j] === seg[i]) out[j] += (v * (R + 1 - Math.abs(j - i))) / sw;
  }
  dep.set(out);
}

// How bumpy the creek is from node to node inside the valley: the mean size of the
// second difference of the bed (leaving out the steps at dams) and of the floor (m).
// A healthy creek has pools, riffles and steps at dams, but no sawtooth.
function creekBumpiness(w) {
  let cr = w.creek,
    ns = cr.nodes,
    at = cr._damAt || [],
    rb = 0,
    cb = 0,
    rf = 0,
    cf = 0;
  for (let i = 1; i < ns.length - 1; i++) {
    if (ns[i - 1].z < 0 || ns[i + 1].z > VL) continue;
    rf += Math.abs(ns[i + 1].fp - 2 * ns[i].fp + ns[i - 1].fp);
    cf++;
    if (at[i] || at[i - 1]) continue;
    rb += Math.abs(ns[i + 1].bed - 2 * ns[i].bed + ns[i - 1].bed);
    cb++;
  }
  return { bed: +(rb / Math.max(1, cb)).toFixed(3), floor: +(rf / Math.max(1, cf)).toFixed(3) };
}

// ---- Stage 0: water spreading over the valley floor ------------------------

// Route each spill across the floor and wear the ground it crosses a little deeper.
// Each thread of water starts at the bank, heads out across the floor and then down
// the valley, turning a little at each step toward lower ground (the floor's hollows,
// and the channels earlier floods wore), so its course curves the way water does.
// Paths that carry water get deeper and draw the next flood's water into them, so side
// channels form, branch, join and persist.
function creekSpread(w, spills, seed) {
  let cr = w.creek,
    T = w.terrain,
    ns = cr.nodes,
    chan = cr.chan,
    W1 = VW + 1,
    flow = creekSpread.flow || (creekSpread.flow = new Float32Array(VERTS)),
    s = Math.floor(seed * 1e6) | 0,
    rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  flow.fill(0);
  let onFloor = (x, z) => x >= 1 && z >= 1 && x < VW - 1 && z < VL - 1 && Math.abs(x - T.axisX(z)) < T.floorHW(z) + 0.8 && T.valleyR(x, z) < 0.9,
    inCreek = (x, z) => Math.abs(x - T.creekX(z)) < 0.5 * creekTopWidth(ns[creekNodeIndex(z)]) + 0.2,
    hAt = (x, z) => T.heightAt(x, z);
  for (let i of spills) {
    let n = ns[i],
      cx = T.creekX(n.z),
      half = 0.5 * creekTopWidth(n);
    for (let side = -1; side <= 1; side += 2)
      for (let lane = 0; lane < 3; lane++) {
        let x = cx + side * (half + 0.7 + lane * 0.9),
          z = n.z + (rnd() - 0.5) * 1.5,
          // heading, measured from straight down the valley (+z) toward +x
          th = side * (0.7 + 0.5 * rnd()),
          q = n._ob / 6,
          last = -1;
        for (let step = 0; step < 140 && onFloor(x, z); step++) {
          let v = Math.round(z) * W1 + Math.round(x);
          if (v !== last) (flow[v] += q), (last = v);
          let best = null,
            bs = 1e9;
          for (let dt of [-0.55, -0.28, 0, 0.28, 0.55]) {
            let t2 = clamp(th + dt, -1.35, 1.35), // never back up the valley
              nx = x + 0.8 * Math.sin(t2),
              nz = z + 0.8 * Math.cos(t2);
            if (!onFloor(nx, nz)) continue;
            if (inCreek(nx, nz)) {
              if (step < 5) continue;
              best = null; // back into the creek: this thread rejoins it
              bs = -1e9;
              break;
            }
            let sc = hAt(nx, nz) + 0.012 * Math.abs(dt) + 0.02 * rnd();
            if (sc < bs) (bs = sc), (best = [nx, nz, t2]);
          }
          if (!best) break;
          if (best[0] !== undefined && bs - hAt(x, z) > 0.04) {
            // a hollow it can't climb out of: the water ponds here and deepens it a little
            let k = Math.round(z) * W1 + Math.round(x);
            chan[k] = Math.min(0.3, chan[k] + 0.008);
            break;
          }
          [x, z, th] = best;
          // drift back toward straight down the valley, slowly
          th *= 0.97;
        }
      }
  }
  let carved = 0;
  for (let v = 0; v < VERTS; v++) {
    let f = flow[v];
    if (f <= 0) continue;
    let add = Math.min(0.03, 0.004 + 0.06 * Math.sqrt(f));
    let was = chan[v];
    chan[v] = Math.min(0.3, was + add);
    // the edges of a thread are worn a little too
    for (let o of [-1, 1, -W1, W1]) {
      let u = v + o;
      if (u >= 0 && u < VERTS && chan[u] < chan[v] * 0.4) chan[u] = Math.min(0.3, chan[u] + add * 0.25);
    }
    carved += chan[v] - was;
  }
  cr.carved = (cr.carved || 0) + carved;
}

// ---- water through the year ---------------------------------------------

var CREEK_HYDRO_DT = 600; // seconds between hydrology steps

// One hydrology step. With init true, settle levels without advancing anything.
function creekHydro(w, init = false) {
  let cr = w.creek;
  if (!cr) return;
  let ns = cr.nodes,
    N = ns.length,
    s = seasonAt(w),
    dtS = init ? 0 : CREEK_HYDRO_DT,
    dtD = dtS / VALLEY_DAY,
    rain = w.weather ? w.weather.rain || 0 : 0,
    warm = 0.25 + 0.75 * s.warmth,
    cloudy = w.weather && (w.weather.state === "cloudy" || rain > 0) ? 0.55 : 1,
    sy = 0.2;
  if (!cr._damIds) creekDamIndex(cr);
  // the topsoil, the same everywhere: rain wets it, warmth dries it
  cr.soil = clamp(cr.soil + rain * CREEK.soilWet * dtD - CREEK.soilDry * warm * cloudy * dtD * (0.4 + 0.6 * cr.soil), 0, 1);
  // what comes down from the spring and the hills above the valley
  cr.up += rain * CREEK.upFill * dtD;
  let rel = cr.up * (1 - Math.exp(-dtD / CREEK.upTau));
  cr.up -= rel;
  let Qin = CREEK.springQ * (0.3 + 1.7 * s.wet) + CREEK.upQ * (cr.up / CREEK.upTau);
  // the hills soak up the wet season's rain and give it back to the floor slowly, all
  // through the dry season. A cut-down creek drains it straight away; a healed floor
  // holds it, which is why a healed valley stays wet (and its creek keeps running)
  cr.hill = (cr.hill ?? 0.6) + rain * CREEK.hillFill * dtD;
  let hillOut = cr.hill * (1 - Math.exp(-dtD / CREEK.hillTau));
  cr.hill -= hillOut;
  // a flood drains away over a few valley hours
  let fk = 0;
  if (cr.flood) {
    let age = (w.t - cr.flood.t0) / VALLEY_DAY;
    fk = cr.flood.k * Math.exp(-age / CREEK.floodTau);
    if (fk < 0.02) (cr.flood = null), (fk = 0);
  }
  // ponds: what each dam can hold now, and which basin each node drains into
  creekPondLevels(cr);
  let owner = cr._pondOwner;
  for (let id in cr.dams) cr.dams[id]._in = 0;
  let q = Qin,
    flowLen = 0;
  for (let i = 0; i < N; i++) {
    let n = ns[i],
      S = Math.max(n._S || 0.005, 2e-4),
      d = owner[i] >= 0 ? cr.dams[owner[i]] : null,
      wetPond = !!d && d.pl > n.bed;
    q += rain * CREEK.latRun * n.len;
    let level = wetPond ? d.pl : n.bed + creekLowDepth(n, q, S),
      fw = Math.max(n.Wv - creekTopWidth(n), 6) * n.len; // floor area beside this node
    if (!init) {
      // the floor's water table and the creek trade water: a deep trench drains the
      // floor quickly, a creek near the top of its floor slowly
      let tau = CREEK.tauDeep + (CREEK.tauShallow - CREEK.tauDeep) * Math.pow(1 - clamp((n.fp - level) / 1.1, 0, 1), 2),
        dg = 0;
      if (n.g > level) {
        let out = (n.g - level) * (1 - Math.exp(-dtD / tau)), // m of water table
          gain = (out * sy * fw) / dtS;
        dg -= out;
        if (wetPond) d._in += gain;
        else q += gain;
      } else if (wetPond) {
        // a pond seeps slowly into the ground around it (mud seals its bottom)
        let seep = (CREEK.pondSeep * clamp((level - n.g) / 0.5, 0, 1) * Math.max(creekWidthAt(n, level - n.bed), 0.5) * n.len) / VALLEY_DAY;
        d._in -= seep;
        dg += (seep * dtS) / (sy * fw);
      } else if (q > 0) {
        // a flowing creek loses water into a bed that sits above the water table
        let lost = Math.min(q, CREEK.bedLoss * Math.max(n.wb, 0.5) * n.len * clamp((level - n.g) / 0.3, 0, 1) * (n.g < n.bed ? 1 : 0.35));
        q -= lost;
        dg += (lost * dtS) / (sy * fw);
      }
      // rain soaks in; roots draw water up in the warm months; a bare gravel bed lets
      // water sink away below it
      dg += rain * CREEK.rech * dtD + hillOut;
      let depth = n.fp - n.g;
      if (depth < CREEK.root) dg -= CREEK.et * warm * cloudy * (1 - depth / CREEK.root) * dtD;
      let fill = clamp((n.bed - (cr.init[i] ? cr.init[i][0] : n.bed)) / 0.6, 0, 1); // mud in the bed seals it
      if (n.g > n.bed - 1) dg -= CREEK.deep * (1 - 0.85 * fill) * (1 - 0.7 * n.veg * fill) * dtD;
      n.g = clamp(n.g + dg, n.bed - 1.6, n.fp);
    }
    // the water surface for drawing: the pond, the flood, or the flow
    let wl = wetPond ? d.pl : q > 2e-5 ? n.bed + creekLowDepth(n, q, S) : Math.min(n.bed - 0.05, n.g);
    if (fk > 0) {
      let fh = creekHydraulics(n, fk * Math.pow(n.A, 0.8) + q, S);
      wl = Math.max(wl, n.bed + fh.y);
    }
    if (q > 2e-5 && n.z >= 0 && n.z <= VL) flowLen += CREEK.ds;
    // water reaching a pond's basin goes into the pond
    if (d) (d._in += q), (q = 0);
    let D = cr._damAt[i];
    if (D && !D.drowned) {
      // the dam: a reservoir; it spills over the crest once it is full
      let area = creekPondArea(w, D);
      if (!init) D.pl += ((D._in - (CREEK.evap * warm * cloudy * area) / VALLEY_DAY) * dtS) / area;
      if (D.pl >= D.plMax) {
        if (!init) q += Math.max(0, ((D.pl - D.plMax) * area) / dtS);
        D.pl = D.plMax;
      }
      D.pl = +Math.max(D.pl, n.bed).toFixed(5);
      if (D.pl > n.bed) wl = Math.max(wl, D.pl);
    }
    n.q = +q.toFixed(6);
    n.wl = +wl.toFixed(4);
  }
  creekPondNow(cr);
  cr.flowLen = flowLen;
  cr.Qin = +Qin.toFixed(6);
  creekCellWater(w, init ? 0 : dtD, s);
  if (!init) creekSeason(w, s);
}

// Surface area of a dam's pond at its present level (m2).
function creekPondArea(w, d) {
  let cr = w.creek,
    ns = cr.nodes,
    owner = cr._pondOwner,
    id = d.id,
    a = 0;
  for (let i = d.i; i >= 0; i--) {
    if (owner[i] !== id) break;
    let n = ns[i];
    if (n.bed >= d.pl) continue;
    let y = d.pl - n.bed;
    a += (y > creekTrench(n) ? creekTopWidth(n) + (n.Wv - creekTopWidth(n)) * clamp((d.pl - n.fp + 0.12) / 0.24, 0, 1) : creekWidthAt(n, y)) * n.len;
  }
  return Math.max(a, 0.5);
}

// Each cell of the valley: water table, depth to water, marsh and green.
//   world.wt[k]     water table (m)
//   world.green[k]  0 brown .. 1 green
//   world.wet[k]    marsh (lagged: soaks in over a day, dries over a few)
function creekCellWater(w, dtD, s) {
  let cr = w.creek,
    c = creekCells(w),
    ns = cr.nodes,
    T = w.terrain;
  if (!w.wt || w.wt.length !== CELLS) w.wt = new Float32Array(CELLS);
  if (!w.green || w.green.length !== CELLS) w.green = new Float32Array(CELLS);
  if (!w.wet || w.wet.length !== CELLS) w.wet = new Float32Array(CELLS);
  let wt = w.wt,
    green = w.green,
    wet = w.wet,
    soil = cr.soil,
    pondNow = cr._pondNow,
    lam = CREEK.lambda,
    up = dtD > 0 ? 1 - Math.exp(-dtD / 0.8) : 1,
    down = dtD > 0 ? 1 - Math.exp(-dtD / 3) : 1,
    nWet = 0,
    nGreen = 0,
    nf = 0;
  let pf = creekPondFloor(w, c);
  let decay = new Float32Array(32);
  for (let j = 0; j < 32; j++) decay[j] = 1 - Math.exp(-j / 2 / lam); // d in half-metre steps
  // the creek's level and the water table are blended between the two nodes either
  // side of each row of cells, so the floor's water changes smoothly down the valley
  let rowLv = 0,
    rowG = 0;
  for (let k = 0; k < CELLS; k++) {
    if (k % VW === 0) {
      let fz = ((k / VW) + 0.5 - CREEK.z0) / CREEK.ds,
        i0 = Math.min(ns.length - 2, Math.floor(fz)),
        tz = fz - i0,
        a = ns[i0],
        b = ns[i0 + 1],
        la = pondNow[i0] > a.wl ? pondNow[i0] : a.wl,
        lb = pondNow[i0 + 1] > b.wl ? pondNow[i0 + 1] : b.wl;
      rowLv = la + (lb - la) * tz;
      rowG = a.g + (b.g - a.g) * tz;
    }
    let d = c.d[k],
      lv = rowLv,
      g = rowG,
      f = d >= 15.5 ? 1 : decay[Math.floor(d * 2)],
      table = lv + (g - lv) * f;
    if (pf[k] > table) table = pf[k];
    wt[k] = table;
    let dw = c.h[k] - table,
      gr = Math.max(soil, dw < 0.55 ? 1 : dw < CREEK.root ? 1 - (dw - 0.55) / (CREEK.root - 0.55) : 0),
      target = dw < 0.02 ? 1 : dw < 0.32 ? 1 - (dw - 0.02) / 0.3 : 0;
    // well away from the floor there is no water table to speak of
    if (!c.floor[k] && d > 8) (gr = soil), (target = 0);
    green[k] = gr;
    if (dtD <= 0) continue;
    let cur = wet[k];
    wet[k] = target > cur ? cur + (target - cur) * up : cur - (cur - target) * down;
    if (wet[k] < 0.01) wet[k] = 0;
    if (c.floor[k]) {
      nf++;
      if (wet[k] > 0.35) nWet++;
      if (gr > 0.5) nGreen++;
    }
  }
  if (dtD > 0) {
    cr.wetNow = +(nWet / Math.max(1, nf)).toFixed(4);
    cr.greenNow = +(nGreen / Math.max(1, nf)).toFixed(4);
  }
}

// Where a pond stands higher than the valley floor, its water spreads out over every
// cell it can reach that lies lower than its surface: across hollows and into side
// channels, so its shape follows the ground (and a pond can branch like a wetland).
// Returns the pond level reaching each cell, or -1e9.
function creekPondFloor(w, c) {
  let cr = w.creek,
    ns = cr.nodes,
    T = w.terrain,
    pf = creekPondFloor.a && creekPondFloor.a.length === CELLS ? creekPondFloor.a : (creekPondFloor.a = new Float32Array(CELLS)),
    seen = creekPondFloor.s || (creekPondFloor.s = new Int32Array(CELLS)),
    queue = creekPondFloor.q || (creekPondFloor.q = new Int32Array(CELLS)),
    owner = cr._pondOwner;
  pf.fill(-1e9);
  if (!owner) return pf;
  let mark = (creekPondFloor.m || 0) + 1;
  for (let id in cr.dams) {
    let D = cr.dams[id];
    if (D.drowned) continue;
    // the pond's nodes that stand under water higher than the floor beside them
    let qn = 0,
      zLo = 1e9,
      zHi = -1e9;
    mark++;
    for (let i = D.i; i >= 0 && owner[i] === D.id; i--) {
      let n = ns[i];
      if (D.pl <= n.bed) continue;
      zLo = Math.min(zLo, n.z - 1);
      zHi = Math.max(zHi, n.z + 1);
      if (D.pl < n.fp - 0.15) continue;
      let cz = Math.floor(n.z),
        cx = Math.floor(T.creekX(n.z));
      if (cz < 0 || cz >= VL || cx < 0 || cx >= VW) continue;
      let k = cz * VW + cx;
      if (seen[k] !== mark) (seen[k] = mark), (queue[qn++] = k);
    }
    if (!qn) continue;
    // spread over connected cells lower than the pond's surface (a little way past its ends)
    for (let h = 0; h < qn; h++) {
      let k = queue[h];
      if (D.pl > pf[k]) pf[k] = D.pl;
      let x = k % VW,
        z = (k / VW) | 0;
      for (let j = 0; j < 4; j++) {
        let nx = j === 0 ? x + 1 : j === 1 ? x - 1 : x,
          nz = j === 2 ? z + 1 : j === 3 ? z - 1 : z;
        if (nx < 0 || nz < 0 || nx >= VW || nz >= VL || nz < zLo - 4 || nz > zHi + 1) continue;
        let m = nz * VW + nx;
        if (seen[m] === mark || !c.floor[m] || c.h[m] >= D.pl) continue;
        seen[m] = mark;
        queue[qn++] = m;
      }
    }
  }
  creekPondFloor.m = mark;
  return pf;
}

// Seasonal bookkeeping: the driest point of each valley year, plants, stages.
function creekSeason(w, s) {
  let cr = w.creek;
  if (!s.wetSeason) {
    cr.minWet = Math.min(cr.minWet, cr.wetNow);
    cr.minGreen = Math.min(cr.minGreen, cr.greenNow);
  }
  if (cr.sIdx === s.idx) return;
  let was = cr.sIdx;
  cr.sIdx = s.idx;
  if (was < 0) return;
  // the first winter rains: the dry season is over; record its driest point
  if (s.idx === 3) {
    cr.driest.push({ year: s.year, wet: +cr.minWet.toFixed(4), green: +cr.minGreen.toFixed(4), t: Math.round(w.t) });
    if (cr.driest.length > 60) cr.driest.splice(0, cr.driest.length - 60);
    cr.minWet = 1;
    cr.minGreen = 1;
  }
  // plants grow through spring and summer (benches change the creek's shape)
  if (s.idx === 1 || s.idx === 2) creekPlants(w), creekDerive(w), creekRefresh(w);
  // a new valley year: stages from the year's change
  if (s.idx === 0) {
    for (let n of cr.nodes) {
      let dz = n.bed - n.yBed;
      n.emaBed = +(0.6 * n.emaBed + 0.4 * dz).toFixed(5);
      n.yBed = n.bed;
    }
    cr.yearNo = s.year;
  }
  creekClassify(w);
}

// Plants: reeds and willows creep into a wet, quiet channel; a dry trench stays grassy.
// Plants only ever increase (the creek only gets better), toward a target set by water.
function creekPlants(w) {
  let cr = w.creek,
    pondNow = cr._pondNow || [];
  for (let i = 0; i < cr.nodes.length; i++) {
    let n = cr.nodes[i],
      wetish = n.q > 2e-5 || pondNow[i] > n.bed || n.g > n.bed + 0.1,
      target = Math.max(n.vegT, wetish ? 0.72 : 0.32);
    n.veg = +Math.min(1, n.veg + Math.max(0, target - n.veg) * 0.12).toFixed(3);
    // a quiet, planted trench traps mud along its edges and starts a bench
    let nat = creekNatural(n.A),
      Ht = creekTrench(n);
    if (Ht > Math.max(1.2 * nat.d, nat.d + 0.3) && n.veg > 0.45 && Ht > 0.6) {
      if (n.bw < 0.05) (n.bz = n.bed + clamp(0.3 * Ht, 0.2, 0.45)), (n.bw = 0.3);
      else n.bw = +Math.min(n.bw + 0.12 * (n.veg - 0.3), 1.6 * Math.max(n.wb, 1)).toFixed(3);
    }
    creekRough(n);
  }
}

// Channel evolution stages per node (Creek Care's rules, with Stage 0 added).
function creekClassify(w) {
  let cr = w.creek,
    c = creekCells(w);
  // how much of the floor beside each node carries water
  let wetBy = new Float32Array(cr.nodes.length),
    nBy = new Float32Array(cr.nodes.length);
  for (let k = 0; k < CELLS; k++) {
    if (!c.floor[k]) continue;
    nBy[c.node[k]]++;
    if (w.wet[k] > 0.5) wetBy[c.node[k]]++;
  }
  for (let i = 0; i < cr.nodes.length; i++) {
    let n = cr.nodes[i],
      nat = creekNatural(n.A),
      Ht = creekTrench(n),
      Hz = creekBenchDepth(n),
      spread = nBy[i] ? wetBy[i] / nBy[i] : 0,
      incised = Ht > Math.max(1.5 * nat.d, nat.d + 0.35);
    n.spread = +spread.toFixed(3);
    let st;
    if (!incised) st = spread > 0.3 ? "0" : "I";
    else if (n.bw > 0.6 * n.wb && Hz > 0.5 * nat.d && Math.abs(n.emaBed) < 0.01 && n.veg > 0.45) st = "V";
    else if (n.emaBed > 0.004 || n.bw > 0.3 * n.wb) st = "IV";
    else st = "II";
    n.stage = st;
  }
}

// ---- what the rest of the game asks ---------------------------------------

// Water surface at a point, or null where it's dry.
function creekWaterAt(w, x, z) {
  if (!w.creek || !w.wt) return null;
  let cx = Math.floor(x),
    cz = Math.floor(z);
  if (cx < 0 || cz < 0 || cx >= VW || cz >= VL) return null;
  let k = cz * VW + cx,
    h = w.terrain.heightAt(x, z);
  return w.wt[k] > h ? w.wt[k] : null;
}

// What the land can feed: about 20 in a cut-down valley, up to 36 when it's healed.
function creekFeed(w) {
  let cr = w.creek;
  if (!cr) return LIFE.maxCapacity;
  let d = cr.driest.length ? cr.driest[cr.driest.length - 1].wet : 0,
    healed = 0,
    L = 0;
  for (let n of cr.nodes) {
    if (n.z < 0 || n.z > VL) continue;
    L++;
    if (n.stage === "V" || n.stage === "0" || n.stage === "I") healed++;
    else if (n.stage === "IV") healed += 0.35;
  }
  let ponds = 0;
  for (let id in cr.dams) if (cr.dams[id].pl > cr.nodes[cr.dams[id].i].bed + 0.15) ponds++;
  let health = clamp(0.55 * Math.min(1, d / 0.6) + 0.25 * (healed / Math.max(1, L)) + 0.2 * Math.min(1, ponds / 6), 0, 1);
  cr.health = +health.toFixed(3);
  return Math.round(20 + 16 * health);
}

// Share of the valley floor that stayed wet at the driest point of the last valley year.
function creekDriest(w) {
  let cr = w.creek;
  return cr && cr.driest.length ? cr.driest[cr.driest.length - 1] : null;
}

// Plain words for a share of the floor: a short word ("a quarter"), or how much of
// the floor (subject of a sentence: "About a quarter of the valley floor").
function creekShareWords(f) {
  return f <= 0.004 ? "none" : f < 0.04 ? "a pool or two" : f < 0.15 ? "a little" : f < 0.3 ? "a quarter" : f < 0.42 ? "a third" : f < 0.6 ? "half" : f < 0.7 ? "two thirds" : f < 0.8 ? "three quarters" : f < 0.9 ? "most" : f < 0.97 ? "nearly all" : "all";
}
function creekShareOfFloor(f) {
  return f <= 0.004 ? "none of the valley floor" : f < 0.04 ? "only a pool or two" : f < 0.15 ? "a little of the valley floor" : f < 0.3 ? "about a quarter of the valley floor" : f < 0.42 ? "about a third of the valley floor" : f < 0.6 ? "about half the valley floor" : f < 0.7 ? "about two thirds of the valley floor" : f < 0.8 ? "about three quarters of the valley floor" : f < 0.9 ? "most of the valley floor" : f < 0.97 ? "nearly all the valley floor" : "all of the valley floor";
}

// Stage of the creek at z (for the dev overlay and the panel).
function creekStageAt(w, z) {
  return w.creek ? w.creek.nodes[creekNodeIndex(z)].stage : "II";
}

// Milestones worth a line in the valley's history.
function creekNotes(w) {
  let cr = w.creek,
    nt = cr.notes,
    inValley = cr.nodes.filter((n) => n.z > 4 && n.z < VL - 4);
  if (!nt.over && inValley.some((n) => n.ob > 0.2)) {
    nt.over = 1;
    logEvent(w, 3, "For the first time anyone can remember, the flood spilled over the banks and spread across the valley floor.", [], null, "wetland");
  }
  if (!nt.chan && (cr.carved || 0) > 2) {
    nt.chan = 1;
    logEvent(w, 2, "The floods have worn little side channels across the valley floor.", [], null, "wetland");
  }
  let filled = inValley.filter((n) => creekTrench(n) < 0.5).length / Math.max(1, inValley.length);
  if (!nt.fill1 && filled > 0.15) {
    nt.fill1 = 1;
    logEvent(w, 3, "Behind the dams the creek has filled its old trench almost to the top.", [], null, "wetland");
  }
  if (!nt.fill2 && filled > 0.6) {
    nt.fill2 = 1;
    logEvent(w, 3, "Most of the creek has climbed back up to its valley floor.", [], null, "wetland");
  }
}

// ---- saving -------------------------------------------------------------

function creekSave(cr) {
  let o = {};
  for (let k in cr) if (k[0] !== "_" && k !== "chan" && k !== "nodes" && k !== "dams") o[k] = cr[k];
  o.nodes = cr.nodes.map((n) => {
    let m = {};
    for (let k in n) if (k[0] !== "_" && k !== "Wv" && k !== "nC" && k !== "nB" && k !== "nF") m[k] = n[k];
    return m;
  });
  o.dams = {};
  for (let id in cr.dams) {
    let d = {};
    for (let k in cr.dams[id]) if (k[0] !== "_") d[k] = cr.dams[id][k];
    o.dams[id] = d;
  }
  o.chanS = sparseToB64(cr.chan);
  return o;
}
function creekLoad(w, o) {
  let cr = { ...o };
  delete cr.chanS;
  cr.chan = o.chanS !== void 0 ? b64ToSparse(o.chanS, VERTS) : new Float32Array(VERTS);
  w.creek = cr;
  creekDamIndex(cr);
  creekDerive(w);
  creekRefresh(w);
  return cr;
}

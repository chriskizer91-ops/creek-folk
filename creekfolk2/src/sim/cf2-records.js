// ==========================================================================
// Creekfolk 2: what happened, written in the land.
//
// Mud layers: every flood that leaves something in the creek's bed lays a band, recorded at
// each point of the creek inside the valley (`w.records.mud[node]`): gravel where the water ran
// fast, dark mud in the wet season and pale silt in the dry where it stood still, behind the
// dams. The mud a flood leaves on the floor is a band too. Bands thinner than a few
// millimetres wait until there's enough to see; a point keeps at most `RECORDS.bands`, the
// thinnest neighbours of a kind merged first, so the record stays small but its thickness
// is always the real one. The dams are kept beside it (when each was built, each time it was
// built up), so the bank shows the first dam at the bottom.
//
// Wraps creekFloodWork (creek.js) and lifeTick (life.js); see docs/MERGE.md.
// ==========================================================================

var RECORDS = {
  bands: 48,   // bands kept at one point of the creek
  minMM: 2,    // a band is drawn once it is this thick
};

function recordsOf(w) {
  return (w.records = w.records || { mud: {}, dams: {} });
}

function mudCode(w, ponded) {
  if (!ponded) return 0; // gravel: the water ran
  return w.cycle && seasonAt(w).wetSeason ? 1 : 2; // dark wet-season mud, pale dry-season silt
}

function addBand(list, t10, mm, code) {
  let last = list[list.length - 1];
  if (last && last[0] === t10 && last[2] === code) last[1] += mm;
  else list.push([t10, mm, code]);
  if (list.length <= RECORDS.bands) return;
  // merge the thinnest pair of neighbours (of the same kind if there is one)
  let best = -1,
    bs = 1e9;
  for (let pass = 0; pass < 2 && best < 0; pass++)
    for (let j = 0; j < list.length - 2; j++) {
      if (pass === 0 && list[j][2] !== list[j + 1][2]) continue;
      let s = list[j][1] + list[j + 1][1];
      if (s < bs) (bs = s), (best = j);
    }
  let a = list[best],
    b = list[best + 1];
  list.splice(best, 2, [a[0], a[1] + b[1], a[1] >= b[1] ? a[2] : b[2]]);
}

function layMud(w, before) {
  let cr = w.creek,
    R = recordsOf(w),
    t10 = Math.round(w.t / 8640);
  for (let i = 0; i < cr.nodes.length; i++) {
    let n = cr.nodes[i];
    if (n.z < 0 || n.z > VL) continue;
    let dBed = (n.bed - before[i][0]) * 1000,
      dFp = (n.fp - before[i][1]) * 1000;
    if (dBed <= 0.01 && dFp <= 0.01) continue;
    let r = (R.mud[i] = R.mud[i] || { b: [], f: [], p: 0, pf: 0 }),
      code = mudCode(w, before[i][2] > before[i][0] + 0.1);
    if (dBed > 0.01) {
      r.p += dBed;
      if (r.p >= RECORDS.minMM) addBand(r.b, t10, Math.round(r.p * 10) / 10, code), (r.p = 0);
      else r.p = Math.round(r.p * 100) / 100;
    }
    if (dFp > 0.01) {
      r.pf += dFp;
      if (r.pf >= RECORDS.minMM) addBand(r.f, t10, Math.round(r.pf * 10) / 10, mudCode(w, true)), (r.pf = 0);
      else r.pf = Math.round(r.pf * 100) / 100;
    }
  }
}

var cf2RecordsFloodWork = creekFloodWork;
creekFloodWork = function (w, T, seed) {
  let before = w.creek.nodes.map((n) => [n.bed, n.fp, n.wl]),
    r = cf2RecordsFloodWork(w, T, seed);
  if (w.t != null) layMud(w, before);
  return r;
};

// The dams beside the record: when each was built and built up, and where.
function recordDams(w) {
  let cr = w.creek;
  if (!cr || !cr.dams) return;
  let R = recordsOf(w),
    t10 = Math.round(w.t / 8640);
  for (let id in cr.dams) {
    let d = cr.dams[id],
      r = R.dams[id];
    if (!r) {
      r = R.dams[id] = { i: d.i, z: cr.nodes[d.i].z, t: t10, base: +cr.nodes[d.i].bed.toFixed(3), up: [] };
    }
    let last = r.up.length ? r.up[r.up.length - 1][1] : null;
    if (last == null || Math.abs(d.crest - last) > 0.01) r.up.push([t10, +d.crest.toFixed(3)]);
    if (r.up.length > 24) r.up.splice(1, 1);
  }
}

var cf2RecordsLifeTick = lifeTick;
lifeTick = function (w) {
  cf2RecordsLifeTick(w);
  recordDams(w);
};

// Repairs that show: every time a home or building is patched up, it keeps the patch
// (`s.patches`, drawn as fresher mud on the wall).
var cf2RecordsRepairEnd = ACTIONS.repair.end;
ACTIONS.repair.end = function (w, c, a, step) {
  let s = w.byId[a.sid],
    before = s ? s.cond ?? 1 : 1,
    r = cf2RecordsRepairEnd.call(this, w, c, a, step);
  if (s && s.kind !== "dam" && before < 0.95 && (s.cond ?? 1) >= 0.95) s.patches = Math.min(12, (s.patches || 0) + 1);
  return r;
};

// ---- reading the record (for the page) -----------------------------------------------

// The bank at one point of the creek, oldest first: what was there on the first day, the
// bands since, the dams.
function bankAt(w, z) {
  let cr = w.creek,
    i = creekNodeIndex(z),
    n = cr.nodes[i],
    R = recordsOf(w),
    r = R.mud[i] || { b: [], f: [] },
    init = cr.init && cr.init[i] ? cr.init[i] : [n.bed, n.fp, n.wb],
    dams = Object.entries(R.dams)
      .filter(([, d]) => d.i === i)
      .map(([id, d]) => ({ id, ...d, now: cr.dams[id] || null }));
  return { i, z: n.z, n, bed0: init[0], fp0: init[1], bed: n.bed, fp: n.fp, wl: n.wl, bands: r.b, floor: r.f, dams, buried: r.tr || [] };
}

// The point of the creek with the deepest record behind the oldest dam (for the Land tab).
function firstDamBank(w) {
  let R = recordsOf(w),
    first = Object.values(R.dams).sort((a, b) => a.t - b.t)[0];
  if (!first) return null;
  // the deepest mud in its pond: a few points upstream of the dam
  let best = first.i,
    bd = -1;
  for (let i = first.i; i >= Math.max(0, first.i - 6); i--) {
    let n = w.creek.nodes[i],
      d = n.bed - (w.creek.init[i] ? w.creek.init[i][0] : n.bed);
    if (d > bd) (bd = d), (best = i);
  }
  return bankAt(w, w.creek.nodes[best].z);
}

// Thickness in plain words.
function depthWords(m) {
  if (m < 0.004) return "a skin";
  if (m < 0.025) return "a finger's width";
  if (m < 0.06) return "two fingers";
  if (m < 0.14) return "a hand";
  if (m < 0.3) return "two hands";
  if (m < 0.55) return "a forearm";
  if (m < 0.9) return "knee-deep on a creekfolk";
  if (m < 1.4) return "waist-deep on a creekfolk";
  return "as deep as a creekfolk is tall";
}

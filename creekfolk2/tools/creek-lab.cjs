// The creek on its own: weather, floods, water and a series of dams, with no creekfolk.
// For tuning the healing arc (docs/phase2-plan.md) without waiting for whole valleys.
// Development only: never shipped.
//
//   node tools/creek-lab.cjs [--days 32] [--seed cf2-1] [--dams arc|none|<save.json>]
//                            [--every 2] (or --dams healed) [--json runs/creek-lab.json] [--save runs/lab.json] [--fixed-weather [--wx tag]]
//
// --dams arc lays a scripted series, bottom of the creek first, a weir then a mud dam
// at each site; --dams <save.json> replays the dams of a saved valley (from
// tools/month.cjs --save) at the times they were built there. Silted dams are built up
// at once, by someone who knows to build from the bottom up (as the founders do).
// Prints a line every --every days and the driest point of each valley year.
// CREEK='{"fineYield":2000}', CF2_CREEK='{..}' and CF2_VALLEY='{..}' (JSON) override tunables; SIM=<file> runs a frozen
// copy of the simulation.
"use strict";
const path = require("node:path");
const fs = require("node:fs");
const S = require(process.env.SIM ? path.resolve(process.env.SIM) : path.join(__dirname, "../dist/sim.cjs"));
const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i >= 0 ? process.argv[i + 1] : d;
};
const days = +arg("days", 32),
  seed = arg("seed", "cf2-1"),
  scen = arg("dams", "arc"),
  every = +arg("every", 2),
  jsonOut = arg("json", null),
  verbose = process.argv.includes("--nodes"),
  bands = process.argv.includes("--bands");
if (process.env.CREEK) Object.assign(S.CREEK, JSON.parse(process.env.CREEK));
if (process.env.CF2_CREEK && S.CF2_CREEK) Object.assign(S.CF2_CREEK, JSON.parse(process.env.CF2_CREEK));
if (process.env.CF2_VALLEY) Object.assign(S.CF2_VALLEY, JSON.parse(process.env.CF2_VALLEY));

// A valley with no creekfolk: keep only the world ticks and the weather.
let w = S.newValley(seed, { calStart: Date.parse("2026-10-20T15:00:00Z"), tzMin: 300 });
let j = JSON.parse(S.saveWorld(w));
j.creatures = [];
j.events = j.events.filter((e) => e.k === "W" || e.k === "R");
// --dams healed: the creek as if already healed (bed just under the floor, plants), with a
// dam every 10 m at the floor: what the hydrology gives a healed valley in this weather
if (scen === "healed") j.creek.nodes.forEach((n) => { if (!n.rock) (n.bed = n.bedMin = n.fp - 0.08), (n.veg = n.vegT = 0.8); n.g = n.fp - 0.1; });
w = S.loadWorld(j);
const D = 86400;
// --fixed-weather: the weather draws from its own generator (seeded from the seed), not the
// world's, so the storms don't change when the creek does (the world's draws depend on it)
const fixedWeather = process.argv.includes("--fixed-weather"),
  wxRng = new w.rng.constructor(seed + ":lab-weather" + arg("wx", ""));

// The dams: [real day, z, level]
let DAMS;
if (scen === "healed") {
  DAMS = [];
  for (let z = 206; z >= 16; z -= 10) DAMS.push([0, z, 3]);
} else if (scen === "arc" || scen === "none") {
  DAMS = [];
  if (scen === "arc") {
    // from the bottom of the creek up, one site every 10 m, a weir then a mud dam a day later
    let zs = [];
    for (let z = 206; z >= 20; z -= 10) zs.push(z);
    zs.forEach((z, k) => {
      let d0 = 1.5 + k * 0.7;
      DAMS.push([d0, z, 1], [d0 + 1, z, 2], [d0 + 5, z, 3]);
    });
  }
} else {
  const sv = JSON.parse(fs.readFileSync(scen, "utf8"));
  DAMS = [];
  for (const s of sv.structures || []) if (s.kind === "dam") for (const b of s.built || []) DAMS.push([b.t / D, s.z, b.lv]);
}
DAMS.sort((a, b) => a[0] - b[0]);
const byZ = {};
function placeDam(z, level) {
  let s = byZ[z];
  if (!s) {
    const T = w.terrain,
      u = T.bankPoint(0, z, 0.4),
      f = T.bankPoint(1, z, 0.4);
    s = { id: w.nextId++, kind: "dam", x: +T.creekX(z).toFixed(2), z, rot: 0, level: 0, cond: 1, t: Math.round(w.t), building: null, contrib: {}, spare: {}, pond: 0, built: [], ends: [{ x: +u.x.toFixed(2), z: +u.z.toFixed(2) }, { x: +f.x.toFixed(2), z: +f.z.toFixed(2) }] };
    w.byId[s.id] = s;
    w.structures.push(s);
    byZ[z] = s;
  }
  s.level = Math.max(s.level, level);
  S.creekSyncDams(w);
}

const rows = [];
let di = 0,
  lastDriest = 0;
const t0 = Date.now();
const lab = { name: "Lab", id: 0, know: { downstream: 1 } };
const stageCount = () => {
  const c = {};
  for (const n of w.creek.nodes) if (n.z >= 0 && n.z <= S.VL) c[n.stage] = (c[n.stage] || 0) + 1;
  return Object.entries(c).sort().map(([k, v]) => `${k}:${v}`).join(" ");
};
const fp0 = w.creek.nodes.map((n) => n.fp);
for (let day = 0; day < days; day += 0.25) {
  while (di < DAMS.length && DAMS[di][0] <= day) placeDam(DAMS[di][1], DAMS[di][2]), di++;
  if (fixedWeather) {
    // the weather from its own generator, so variants of the creek see the same storms
    const end = (day + 0.25) * D;
    for (let ev = w.heap.peek(); ev && ev.t <= end; ev = w.heap.peek()) {
      if (ev.k === "R") {
        const keep = w.rng;
        w.rng = wxRng;
        S.runUntil(w, ev.t);
        w.rng = keep;
      } else S.runUntil(w, ev.t);
    }
    S.runUntil(w, end);
  } else S.runUntil(w, (day + 0.25) * D);
  // tending: dams are kept in repair, and silted ponds are built up
  for (const s of w.structures) {
    if (s.kind !== "dam") continue;
    if ((s.cond ?? 1) < 0.7 && !s.raise) s.cond = 1;
    if (s.raise) S.creekRaiseDam(w, s, lab, { quiet: true });
  }
  const cr = w.creek;
  if (bands && Math.abs(((day + 0.25) % 8) - 6) < 1e-9) {
    // just before the winter rains: how wet each 16 m stretch of the floor is
    const c = S.creekCells(w),
      out = [];
    for (let z0 = 0; z0 < S.VL; z0 += 16) {
      let n = 0,
        wet = 0;
      for (let z = z0; z < z0 + 16; z++) for (let x = 0; x < S.VW; x++) if (c.floor[z * S.VW + x]) n++, (wet += w.wet[z * S.VW + x] > 0.35);
      out.push(String(Math.round((100 * wet) / Math.max(1, n))).padStart(3));
    }
    console.log(`  day ${day + 0.25} wet by 16 m from the top: ${out.join("")}`);
  }
  if (cr.driest.length > lastDriest) {
    const d = cr.driest[cr.driest.length - 1];
    lastDriest = cr.driest.length;
    console.log(`  driest point of valley year ${d.year} (day ${(d.t / D).toFixed(1)}): wet ${(d.wet * 100).toFixed(1)}% green ${(d.green * 100).toFixed(1)}% of the floor`);
  }
  if (Math.abs(day + 0.25 - Math.round(day + 0.25)) < 1e-9 && Math.round(day + 0.25) % every === 0) {
    const s = S.seasonAt(w),
      idx = cr.nodes.map((n, i) => i).filter((i) => cr.nodes[i].z >= 0 && cr.nodes[i].z <= S.VL),
      inV = idx.map((i) => cr.nodes[i]),
      Ht = inV.reduce((a, n) => a + (n.fp - n.bed), 0) / inV.length,
      fpUp = idx.reduce((a, i) => a + (cr.nodes[i].fp - fp0[i]), 0) / idx.length,
      gDepth = inV.reduce((a, n) => a + (n.fp - n.g), 0) / inV.length,
      near = inV.filter((n) => n.fp - n.bed < 0.3).length / inV.length,
      bump = S.creekBumpiness(w),
      chan = cr.chan.reduce((a, v) => a + v, 0),
      chanN = cr.chan.reduce((a, v) => a + (v > 0.05 ? 1 : 0), 0),
      ponds = Object.values(cr.dams).sort((a, b) => a.i - b.i).map((d) => `${(d.crest - cr.nodes[d.i].fp).toFixed(2)}${d.hold ? "" : "!"}`).join(","),
      row = { day: Math.round(day + 0.25), year: s.year, season: s.name, wet: cr.wetNow, green: cr.greenNow, Ht: +Ht.toFixed(3), fpUp: +fpUp.toFixed(3), gDepth: +gDepth.toFixed(3), floods: cr.floods, feed: S.creekFeed(w), stages: stageCount(), roughBed: bump.bed, roughFloor: bump.floor, chan: +chan.toFixed(1), chanN };
    rows.push(row);
    console.log(
      `day ${String(row.day).padStart(3)} y${s.year} ${s.name.padEnd(6)} wet ${(cr.wetNow * 100).toFixed(1).padStart(5)}%  green ${(cr.greenNow * 100).toFixed(0).padStart(3)}%  trench ${Ht.toFixed(2)}m  fp+${fpUp.toFixed(3)}  g-${gDepth.toFixed(2)}  near ${(near * 100).toFixed(0)}%  floods ${cr.floods}  feed ${row.feed}  rough ${row.roughBed}/${row.roughFloor}  chan ${row.chan}/${chanN}  [${stageCount()}]  crests ${ponds}`,
    );
    if (verbose)
      for (let i = 0; i < cr.nodes.length; i += 4) {
        const n = cr.nodes[i];
        if (n.z < 0 || n.z > S.VL) continue;
        console.log(`    z ${n.z.toFixed(0).padStart(3)} fp ${n.fp.toFixed(2)} bed ${(n.bed - n.fp).toFixed(2)} g ${(n.g - n.fp).toFixed(2)} wl ${(n.wl - n.fp).toFixed(2)} spread ${n.spread} ${n.stage}${cr._damAt[i] ? " DAM " + (cr._damAt[i].crest - n.fp).toFixed(2) : ""}`);
      }
  }
}
console.log(`\n${days} days in ${((Date.now() - t0) / 1000).toFixed(1)} s; storms ${w.creek.floods} (${(w.creek.floods / (days / 8)).toFixed(1)} per valley year); dams ${Object.keys(w.creek.dams).length}`);
const saveOut = arg("save", null);
if (saveOut) fs.mkdirSync(path.dirname(saveOut), { recursive: true }), fs.writeFileSync(saveOut, S.saveWorld(w));
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ seed, scen, rows, driest: w.creek.driest }, null, 1));

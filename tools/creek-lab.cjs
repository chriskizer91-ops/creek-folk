// The creek on its own: weather, floods, water and a scripted series of dams, with
// no creekfolk. For tuning the creek model against the year arc in
// docs/PHASE3-CHANGES.md (section 4) without waiting for the whole valley.
//
//   node tools/creek-lab.cjs [--days 120] [--seed lab-1] [--dams arc|none|one|high]
//                            [--every 2] [--json runs/creek-lab.json] [--save runs/worlds/lab.json]
//
// Prints one line every --every real days, and the driest point of each valley year.
"use strict";
const path = require("node:path");
const fs = require("node:fs");
const S = require(path.join(__dirname, "../dist/sim.cjs"));
const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i >= 0 ? process.argv[i + 1] : d;
};
const days = +arg("days", 120),
  seed = arg("seed", "lab-1"),
  scen = arg("dams", "arc"),
  every = +arg("every", 2),
  jsonOut = arg("json", null);
if (process.env.CREEK) Object.assign(S.CREEK, JSON.parse(process.env.CREEK));
if (process.env.WEATHER) Object.assign(S.WEATHER, JSON.parse(process.env.WEATHER));

// A valley with no creekfolk: keep only world ticks and weather.
let w = S.newValley(seed, { calStart: Date.parse("2026-10-20T15:00:00Z"), tzMin: 300 });
let j = JSON.parse(S.saveWorld(w));
j.creatures = [];
j.events = j.events.filter((e) => e.k === "W" || e.k === "R");
w = S.loadWorld(j);

// The dams the creekfolk might build: [real day, z, level]
const DAMS = {
  none: [],
  one: [[7, 30, 1], [12, 30, 2]],
  high: [[7, 30, 2]],
  arc: [
    [7, 30, 1], [12, 30, 2], [16, 40, 1], [20, 40, 2], [24, 50, 1], [27, 50, 2], [30, 60, 1], [33, 60, 2],
    [36, 70, 1], [40, 70, 2], [44, 80, 1], [48, 80, 2], [52, 90, 1], [56, 90, 2], [60, 100, 1], [64, 100, 2],
    [68, 110, 1], [72, 110, 2], [76, 120, 1], [80, 120, 2], [84, 130, 1], [88, 130, 2], [92, 140, 1], [96, 140, 2],
    [40, 30, 3], [48, 40, 3], [56, 50, 3], [64, 60, 3], [72, 70, 3], [80, 80, 3], [90, 90, 3], [100, 100, 3],
    [24, 22, 1], [30, 22, 2],
  ],
}[scen];
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

const D = 86400,
  rows = [];
let di = 0,
  lastDriest = 0;
const t0 = Date.now();
const stageCount = () => {
  const c = {};
  for (const n of w.creek.nodes) if (n.z >= 0 && n.z <= S.VL) c[n.stage] = (c[n.stage] || 0) + 1;
  return Object.entries(c).sort().map(([k, v]) => `${k}:${v}`).join(" ");
};
for (let day = 0; day < days; day += 0.25) {
  while (di < DAMS.length && DAMS[di][0] <= day) placeDam(DAMS[di][1], DAMS[di][2]), di++;
  S.runUntil(w, (day + 0.25) * D);
  // tending: dams are kept in repair, and silted ponds are built up
  for (const s of w.structures) {
    if (s.kind !== "dam") continue;
    if ((s.cond ?? 1) < 0.7 && !s.raise) s.cond = 1;
    if (s.raise) S.creekRaiseDam(w, s, { name: "Lab", id: 0, know: { downstream: 1 } });
  }
  const cr = w.creek;
  if (cr.driest.length > lastDriest) {
    const d = cr.driest[cr.driest.length - 1];
    lastDriest = cr.driest.length;
    console.log(`  driest point of valley year ${d.year}: wet ${(d.wet * 100).toFixed(1)}% green ${(d.green * 100).toFixed(1)}% of the floor`);
  }
  if (Math.abs(day + 0.25 - Math.round(day + 0.25)) < 1e-9 && Math.round(day + 0.25) % every === 0) {
    const s = S.seasonAt(w),
      inV = cr.nodes.filter((n) => n.z >= 0 && n.z <= S.VL),
      Ht = inV.reduce((a, n) => a + (n.fp - n.bed), 0) / inV.length,
      near = inV.filter((n) => n.fp - n.bed < 0.5).length / inV.length,
      ponds = Object.values(cr.dams).map((d) => `${(d.pl - cr.nodes[d.i].bed).toFixed(2)}${d.hold ? "" : "!"}${d.crest > cr.nodes[d.i].fp ? "^" : ""}`).join(","),
      row = { day: Math.round(day + 0.25), year: s.year, season: s.name, flow: cr.flowLen, wet: cr.wetNow, green: cr.greenNow, soil: +cr.soil.toFixed(2), Qin: cr.Qin, Ht: +Ht.toFixed(3), near: +near.toFixed(3), floods: cr.floods, feed: S.creekFeed(w), stages: stageCount() };
    rows.push(row);
    console.log(
      `day ${String(row.day).padStart(3)} y${s.year} ${s.name.padEnd(6)} flow ${String(cr.flowLen).padStart(3)}m  wet ${(cr.wetNow * 100).toFixed(1).padStart(5)}%  green ${(cr.greenNow * 100).toFixed(0).padStart(3)}%  soil ${cr.soil.toFixed(2)}  trench ${Ht.toFixed(2)}m  filled ${(near * 100).toFixed(0)}%  floods ${cr.floods}  feed ${row.feed}  [${stageCount()}]  ponds ${ponds}`,
    );
  }
}
console.log(`\n${days} days in ${((Date.now() - t0) / 1000).toFixed(1)} s; storms ${w.creek.floods} (${(w.creek.floods / (days / 8)).toFixed(1)} per valley year)`);
const saveOut = arg("save", null);
if (saveOut) fs.mkdirSync(path.dirname(saveOut), { recursive: true }), fs.writeFileSync(saveOut, S.saveWorld(w));
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ seed, scen, rows, driest: w.creek.driest }, null, 1));

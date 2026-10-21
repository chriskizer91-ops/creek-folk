// The creek of a saved valley in numbers, node by node: floor, bed, water table, water,
// how much of the floor beside it is wet, and the dams. Development only.
//
//   node tools/creek-look.cjs runs/month/cf2-1-day30.json [--step 4]
"use strict";
const path = require("node:path");
const fs = require("node:fs");
const S = require(process.env.SIM ? path.resolve(process.env.SIM) : path.join(__dirname, "../dist/sim.cjs"));
const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i >= 0 ? process.argv[i + 1] : d;
};
const w = S.loadWorld(JSON.parse(fs.readFileSync(process.argv[2], "utf8")));
const cr = w.creek,
  step = +arg("step", 4),
  dams = {};
for (const s of w.structures) if (s.kind === "dam") dams[s.id] = s;
const at = {};
for (const id in cr.dams) at[cr.dams[id].i] = cr.dams[id];
console.log(`day ${(w.t / 86400).toFixed(1)} ${S.seasonAt(w).name}  wet ${(cr.wetNow * 100).toFixed(1)}%  floods ${cr.floods}  driest ${cr.driest.map((d) => (d.wet * 100).toFixed(0)).join(" ")}`);
{
  const c = S.creekCells(w),
    out = [];
  for (let z0 = 0; z0 < S.VL; z0 += 16) {
    let n = 0,
      wet = 0;
    for (let z = z0; z < z0 + 16; z++) for (let x = 0; x < S.VW; x++) if (c.floor[z * S.VW + x]) n++, (wet += w.wet[z * S.VW + x] > 0.35);
    out.push(String(Math.round((100 * wet) / Math.max(1, n))).padStart(3));
  }
  console.log(`  wet by 16 m from the top: ${out.join("")}   (ledge ${w.terrain.zLedge}, Dry Fork joins ${w.terrain.branches.dry.joinZ.toFixed(0)}, spring branch ${w.terrain.branches.spring.joinZ.toFixed(0)})`);
}
for (let i = 0; i < cr.nodes.length; i++) {
  const n = cr.nodes[i],
    d = at[i];
  if (n.z < 0 || n.z > S.VL) continue;
  if (i % step && !d) continue;
  const s = d && dams[d.id];
  console.log(
    `  z ${n.z.toFixed(0).padStart(3)} fp ${n.fp.toFixed(2)} (+${(n.fp - cr.init[i][1]).toFixed(3)}) bed ${(n.bed - n.fp).toFixed(2)} g ${(n.g - n.fp).toFixed(2)} wl ${(n.wl - n.fp).toFixed(2)} veg ${n.veg.toFixed(2)} spread ${n.spread.toFixed(2)} ${n.stage}` +
      (d ? `  DAM lv${s ? s.level : "?"} crest ${(d.crest - n.fp).toFixed(2)} pond ${(d.pl - n.fp).toFixed(2)}${d.hold ? "" : " LEAKS"} raised ${d.raised || 0}${d.apron ? " apron" : ""} built ${s && s.built ? s.built.map((b) => (b.t / 86400).toFixed(1)).join("/") : ""}` : ""),
  );
}

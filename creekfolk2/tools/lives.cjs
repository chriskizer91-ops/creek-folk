// The founders' arc in lives, from saved valleys: when the founders paired and passed, the
// first child, grandchild and great-grandchild, generations, who left. Development only.
//
//   node tools/lives.cjs runs/month/cf2-1-day32.json [more saves...]
"use strict";
const path = require("node:path");
const fs = require("node:fs");
const S = require(process.env.SIM ? path.resolve(process.env.SIM) : path.join(__dirname, "../dist/sim.cjs"));
const D = 86400,
  d = (t) => (t == null ? "-" : (t / D).toFixed(1));
for (const f of process.argv.slice(2)) {
  const w = S.loadWorld(JSON.parse(fs.readFileSync(f, "utf8")));
  const L = Object.values(w.lineage || {}),
    founders = L.filter((r) => r.gen === 0 && !r.traveler),
    firstOf = (g) => L.filter((r) => r.gen === g).reduce((m, r) => Math.min(m, r.born), Infinity),
    passed = founders.filter((r) => r.died != null).map((r) => r.died).sort((a, b) => a - b),
    pairs = w.log.filter((e) => / have paired up\./.test(e.text)).map((e) => e.t),
    maxGen = L.reduce((m, r) => Math.max(m, r.gen || 0), 0),
    alive = w.creatures.filter((c) => !c.visitor),
    gens = {};
  for (const c of alive) gens[c.gen || 0] = (gens[c.gen || 0] || 0) + 1;
  const g2 = firstOf(2);
  console.log(
    `${path.basename(f)}: day ${d(w.t)}  pop ${alive.length}  founders left ${alive.filter((c) => c.founder).length}\n` +
      `  founders passed: ${passed.map(d).join(" ")}\n` +
      `  first pairs: ${pairs.slice(0, 4).map(d).join(" ")}  first child ${d(firstOf(1))}  grandchild ${d(g2)} (grown ${g2 < Infinity ? d(g2 + 7 * D) : "-"})  great-grandchild ${d(firstOf(3))}  generations ever ${maxGen + 1}\n` +
      `  alive by generation: ${Object.entries(gens).map(([g, n]) => `g${g}:${n}`).join(" ")}  births ${w.stats.births || 0}  passings ${w.stats.passings || 0}  went downstream ${w.stats.departed || 0}  travelers ${L.filter((r) => r.traveler).length}`,
  );
}

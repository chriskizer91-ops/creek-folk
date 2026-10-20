// Smoke test for Phase 3B: one valley, every gift in turn every 12 hours, printing what
// the creekfolk make of it.   node tools/gift-smoke.cjs [days] [seed]
"use strict";
const path = require("node:path");
const S = require(path.join(__dirname, "../dist/sim.cjs"));
const days = +(process.argv[2] || 20),
  seed = process.argv[3] || "smoke-1";
const w = S.newValley(seed, { calStart: Date.parse("2026-10-20T15:00:00Z"), tzMin: 300 });
const kinds = Object.keys(S.GIFT_KINDS);
let k = 0, seenLog = 0;
const show = new Set(["gift", "belief", "temple", "request", "spring", "offering", "carving", "place"]);
const t0 = Date.now();
for (let h = 12; h <= days * 24; h += 12) {
  S.runUntil(w, h * 3600);
  const r = S.giveGift(w, kinds[k % kinds.length]);
  k++;
  if (!r) console.log(`  day ${(h / 24).toFixed(1)}: gift ${kinds[(k - 1) % kinds.length]} refused`);
  for (const e of w.hist.slice(seenLog)) if (show.has(e.kind)) console.log(`  day ${(e.t / 86400).toFixed(2)} [${e.kind}] ${e.text}`);
  seenLog = w.hist.length;
}
const alive = w.creatures.filter((c) => !c.visitor);
console.log(`\n${days} days in ${((Date.now() - t0) / 1000).toFixed(1)} s; ${alive.length} creekfolk, believers ${S.believers(w).length}; errors ${w.stats.errors || 0}`);
console.log("fauna", JSON.stringify({ ...w.fauna, goats: (w.fauna || {}).goats?.length }));
console.log("temple", JSON.stringify(w.temple || null));
console.log("offerings", JSON.stringify(w.offerings || null));
console.log("spring", JSON.stringify(w.spring || null), "rhythm", JSON.stringify(w.giftRhythm || null));

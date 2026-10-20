// Proves that a replayed stretch of time ends in exactly the same state as a live one.
//
//   node tools/determinism.cjs [days=4] [seed=det-1]
//
// Three runs of the same valley to the same moment:
//   A. one call to runUntil (how a catch-up replays a gap)
//   B. hundreds of small, uneven slices (how the page runs it live, frame by frame)
//   C. slices with a save and reload in between, several times (closing and reopening the game)
// The saved state of all three must hash identically.
"use strict";
const crypto = require("node:crypto");
const path = require("node:path");
const S = require(path.join(__dirname, "../dist/sim.cjs"));
const days = +(process.argv[2] || 4),
  seed = process.argv[3] || "det-1";
const T = days * 86400,
  opts = { calStart: Date.parse("2026-10-20T15:00:00Z"), tzMin: 300 };
// The player gives gifts at the same moments in every run.
const GIFTS = [];
for (let d = 0; d < days; d++) GIFTS.push([d * 86400 + 9.3 * 3600, ["rain", "seeds", "warm", "found"][d % 4]], [d * 86400 + 21.7 * 3600, ["found", "warm", "seeds", "rain"][d % 4]]);
function runWithGifts(w, to) {
  for (const [t, k] of GIFTS) if (t > w.t && t <= to) { S.runUntil(w, t); S.giveGift(w, k); }
  S.runUntil(w, to);
}
const hash = (w) => crypto.createHash("sha256").update(S.saveWorld(w)).digest("hex").slice(0, 16);

let t0 = Date.now();
const A = S.newValley(seed, opts);
runWithGifts(A, T);
const hA = hash(A);
console.log(`A  one replay        ${hA}  (${Date.now() - t0} ms, ${A.creatures.length} creekfolk, born ${A.stats.births || 0}, passed ${A.stats.passings || 0})`);

t0 = Date.now();
const B = S.newValley(seed, opts);
let r = 12345;
const rnd = () => ((r = (r * 1103515245 + 12345) % 2147483648) / 2147483648);
for (let t = 0; t < T; ) {
  t = Math.min(T, t + 0.016 + rnd() * 600); // from a single frame to ten minutes
  runWithGifts(B, t);
}
const hB = hash(B);
console.log(`B  uneven slices     ${hB}  (${Date.now() - t0} ms)`);

t0 = Date.now();
let C = S.newValley(seed, opts);
const stops = [0.37, 1.1, 2.05, 2.9].map((d) => d * 86400).filter((x) => x < T);
for (const s of stops) {
  runWithGifts(C, s);
  C = S.loadWorld(S.saveWorld(C)); // close and reopen
}
runWithGifts(C, T);
const hC = hash(C);
console.log(`C  save and reload   ${hC}  (${Date.now() - t0} ms, reloaded ${stops.length} times)`);

const ok = hA === hB && hB === hC;
console.log(ok ? "PASS: identical" : "FAIL: the runs differ");
process.exit(ok ? 0 : 1);

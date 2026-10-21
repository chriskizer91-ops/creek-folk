// How belief holds when the player stops giving. Gives a gift every other day (the one the
// valley needs most) until day GIVE_UNTIL, then nothing; prints believers every few days.
//   node tools/away-test.cjs [seed] [giveUntil=60] [endDay=130]
"use strict";
const path = require("node:path");
const S = require(process.env.SIM ? path.resolve(process.env.SIM) : path.join(__dirname, "../dist/sim.cjs"));
const D = 86400;
const [seed = "away-1", until = 60, end = 130] = process.argv.slice(2);
const w = S.newValley(seed, { calStart: Date.parse("2026-10-20T12:00:00Z"), tzMin: 300 });
const kinds = Object.keys(S.GIFT_KINDS);
for (let t = 0.5 * D; t < +until * D; t += 2 * D) {
  S.runUntil(w, t);
  S.giveGift(w, kinds.slice().sort((a, b) => S.giftNeed(w, b) - S.giftNeed(w, a))[0]);
}
for (let d = +until; d <= +end; d += 4) {
  S.runUntil(w, d * D);
  const alive = w.creatures.filter((c) => !c.visitor);
  const wait = Object.values(w.stories || {}).filter((s) => s.kind === "temple-wait");
  console.log(`day ${d}: believers ${S.believers(w).length}/${alive.length}` + `, resting ${w.giftsStopped ? "since day " + (w.giftsStopped / D).toFixed(1) : "no"}, lantern ${w.lantern ? "lit" : "-"}` + `, temple ${w.temple ? w.temple.state + " (" + w.temple.parts + " parts)" : "-"}` + `, the waiting story told by ${wait.map((s) => alive.filter((c) => c.lore && c.lore[s.id]).length).join(",") || "-"}`);
}

// Development only: a valley whose temple rises as fast as its builders can work (each
// part is unlocked as soon as the last one is done), with every living gift given early,
// for looking at the temple and the gifts.   node tools/temple-preview.cjs [days] [seed]
// Saves runs/worlds/preview-day<N>.json every 30 days.
"use strict";
const path = require("node:path");
const fs = require("node:fs");
const S = require(path.join(__dirname, "../dist/sim.cjs"));
const days = +(process.argv[2] || 90),
  seed = process.argv[3] || "preview-1";
const w = S.newValley(seed, { calStart: Date.parse("2026-10-20T15:00:00Z"), tzMin: 300 });
const first = ["warm", "rain", "flowers", "fruit", "goats", "bees", "bird", "fish", "flowers", "bird", "stones", "greattree", "clay", "fish", "flowers", "bird"];
let n = 0;
const kinds = Object.keys(S.GIFT_KINDS);
fs.mkdirSync(path.join(__dirname, "../runs/worlds"), { recursive: true });
for (let h = 12; h <= days * 24; h += 12) {
  S.runUntil(w, h * 3600);
  let k = n < first.length ? first[n] : kinds.slice().sort((a, b) => S.giftNeedWhy(w, b).need - S.giftNeedWhy(w, a).need)[0];
  S.giveGift(w, k);
  n++;
  if (w.temple && w.temple.state === "waiting") w.temple.feel = Math.max(w.temple.feel, 0.999);
  if (h % (24 * 30) === 0) {
    fs.writeFileSync(path.join(__dirname, `../runs/worlds/preview-day${h / 24}.json`), S.saveWorld(w));
    console.log(`day ${h / 24}: temple ${w.temple ? w.temple.parts + "/36 " + w.temple.state : "-"}, ${w.creatures.length} creekfolk, offerings ${(w.offerings || {}).total || 0}, errors ${w.stats.errors || 0}`);
  }
}

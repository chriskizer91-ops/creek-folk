// Run a saved valley forward with the current simulation and save it on given days, to
// look at the grove, the goats and the wetland's life with tools/view-world.mjs.
//
//   node tools/grove-scene.cjs <save.json> <out-prefix> <day,day,...>
//   e.g. node tools/grove-scene.cjs runs/worlds/3c/e48-year-1-day300.json runs/grove/e48 300.2,304.6,306
//
// Nothing is changed by hand: the valley simply lives on (an old grove is upgraded at the
// first life check, its oldest trees fall, kids are born in spring). Prints what the grove
// and the herd look like at each save.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const S = require(path.join(__dirname, "../dist/sim.cjs"));
const [file, prefix, daysArg] = process.argv.slice(2);
if (!file || !prefix || !daysArg) {
  console.log("usage: node tools/grove-scene.cjs <save.json> <out-prefix> <day,day,...>");
  process.exit(1);
}
const w = S.loadWorld(fs.readFileSync(file, "utf8"));
const lines = [];
w.onLog = (o) => (o.kind === "grove" || o.kind === "goats" || (o.kind === "passing" && /grove/.test(o.text))) && lines.push(`  day ${(w.t / 86400).toFixed(2)}: ${o.text}`);
fs.mkdirSync(path.dirname(prefix), { recursive: true });
for (const d of daysArg.split(",").map(Number)) {
  const t0 = Date.now();
  S.runUntil(w, d * 86400);
  const trees = w.res.filter((r) => r.kind === "grove"),
    kinds = trees.reduce((a, r) => ((a[r.tk || "?"] = (a[r.tk || "?"] || 0) + 1), a), {}),
    f = w.fauna || { goats: [] },
    kids = f.goats.filter((g) => g.mom && (w.t - g.born) / 86400 < 4).length,
    s = S.seasonAt(w),
    out = `${prefix}-day${d}.json`;
  fs.writeFileSync(out, S.saveWorld(w));
  console.log(`day ${d} (${s.name}, ${S.dateText(w)}; ran in ${((Date.now() - t0) / 1000).toFixed(0)} s): ${trees.length} trees ${JSON.stringify(kinds)}, ${w.grove && w.grove.logs ? w.grove.logs.length : 0} logs, goats ${f.goats.length} (${kids} kids), wet ${w.creek.wetNow} -> ${out}`);
  console.log(lines.splice(0).slice(-12).join("\n"));
}

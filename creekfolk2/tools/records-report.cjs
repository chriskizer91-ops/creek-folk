// What a saved valley holds of the founders' culture and the records of time, in numbers:
// the old words still said, the customs, the old valley's stories (and how far they have
// drifted), carvings by material, the mud in the bank, the chronicle. For the phase reports.
//
//   node tools/build.mjs && node tools/records-report.cjs <save.json> [more saves...]
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const S = require(path.join(__dirname, "../dist/sim.cjs"));
for (const f of process.argv.slice(2)) {
  const w = S.loadWorld(fs.readFileSync(f, "utf8"));
  const alive = w.creatures.filter((c) => !c.visitor),
    ov = w.oldValley || { words: {} },
    say = (k) => {
      const n = {};
      for (const c of alive) {
        const e = c.lex[k];
        if (!e) continue;
        let b = null, bs = -1;
        for (const x in e) if (e[x] > bs) (bs = e[x]), (b = x);
        if (b) n[b] = (n[b] || 0) + 1;
      }
      return Object.entries(n).sort((a, b) => b[1] - a[1])[0];
    };
  let kept = 0, changed = 0, lost = 0;
  for (const k in ov.words) {
    const top = say(k);
    if (!top) lost++;
    else if (top[0] === ov.words[k]) kept++;
    else changed++;
  }
  const old = Object.values(w.stories || {}).filter((s) => s.old),
    held = (s) => alive.filter((c) => c.lore && c.lore[s.id]),
    K = w.carvings || [],
    mud = w.records ? Object.values(w.records.mud) : [],
    bands = mud.reduce((a, r) => a + r.b.length, 0),
    deep = mud.reduce((a, r) => Math.max(a, r.b.reduce((s, x) => s + x[1], 0)), 0),
    founders = alive.filter((c) => c.founder).length;
  console.log(`\n${path.basename(f)}: day ${(w.t / 86400).toFixed(1)}, ${alive.length} creekfolk, ${founders} of the eight living${w.lastFounder ? `; the last of the eight, ${w.lastFounder.name}, passed on day ${(w.lastFounder.t / 86400).toFixed(1)}` : ""}`);
  console.log(`  old words: ${kept} said the old way, ${changed} changed, ${lost} no one says (of ${Object.keys(ov.words).length})`);
  console.log(`  customs: ${Object.entries(w.customs || {}).map(([k, v]) => k + (v.old ? " (old)" : "")).join(", ")}; the creek thanked ${(w.culture && w.culture.thanks) || 0} times`);
  for (const s of old) {
    const hs = held(s), same = hs.filter((c) => S.storyText(w, s, c.lore[s.id].v) === S.storyText(w, s, s.truth)).length;
    console.log(`  ${s.kind.padEnd(11)} told by ${String(hs.length).padStart(2)}, ${same} of them as it happened${w.myths && w.myths[s.id] ? "; a myth" : ""}${s.legend ? "; a legend" : ""}`);
  }
  console.log(`  carvings: ${K.filter((k) => k.mat === "stone" && k.done >= 1).length} stones standing (${K.filter((k) => k.mat === "stone" && k.done < 1).length} being cut, ${K.filter((k) => k.recut && k.recut.length).length} recut, ${K.filter((k) => k.recut && k.recut.some((r) => r[2])).length} "corrected"), ${K.filter((k) => k.mat === "clay" && !k.gone).length} clay tablets (${K.filter((k) => k.mat === "clay" && k.gone).length} crumbled, ${K.filter((k) => k.copyOf).length} copies), ${K.filter((k) => k.mat === "sand").length} sand drawings kept`);
  console.log(`  the bank: ${bands} bands at ${mud.length} points, the deepest ${(deep / 1000).toFixed(2)} m; ${Object.keys((w.records || {}).dams || {}).length} dams on record`);
  console.log(`  the chronicle: ${(w.chronicle && w.chronicle.days.length) || 0} days; ${(JSON.stringify(w.chronicle || {}).length / 1024).toFixed(0)} KB, records ${(JSON.stringify(w.records || {}).length / 1024).toFixed(0)} KB, carvings ${(JSON.stringify(K).length / 1024).toFixed(0)} KB`);
}

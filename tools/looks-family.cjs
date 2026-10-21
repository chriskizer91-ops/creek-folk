// Looks you can trace through families (Phase 3C): run a valley headless, then print
// its families with their looks, how often children look like a parent, and save it.
//
//   node tools/looks-family.cjs [days=30] [seed=looks-1]      (build first: node tools/build.mjs --dev)
//   node tools/looks-family.cjs --load <save.json>             (just print a saved valley)
//   node tools/looks-family.cjs --from <save.json> <toDay>     (carry on a saved valley to toDay)
//
// The player gives a gift every real day (what is needed most), and every fourth
// one is something to find, so some believers have a treasure to wear.
// Writes runs/looks/<seed>-day<days>.json (a 3C save tools/view-world.mjs and
// tools/looks-shots.mjs can show).
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");

// dist/sim.cjs exports CreekSim; also take the looks helpers out of the same scope.
const file = path.join(__dirname, "../dist/sim.cjs");
const src = fs
  .readFileSync(file, "utf8")
  .replace("module.exports = CreekSim;", "module.exports = Object.assign({}, CreekSim, { looksOf, looksText, looksPassion, looksWearsTreasure, LOOKS, LOOKS_FUR, LOOKS_FUR_NAMES, LOOKS_WEAR_NAMES });");
const m = new Module(file);
m.paths = module.paths;
m._compile(src, file);
const S = m.exports;

const D = 86400;
let w, days, seed;
const args = process.argv.slice(2);
const looksAt = {}; // id -> look, kept after they pass so parents can be compared
const snap = (w) => {
  for (const c of w.creatures) looksAt[c.id] = { ...S.looksOf(w, c), name: c.name };
};
if (args[0] === "--load") {
  w = S.loadWorld(fs.readFileSync(args[1], "utf8"));
  days = w.t / D;
  seed = path.basename(args[1], ".json");
  snap(w);
} else {
  const from = args[0] === "--from";
  days = +(from ? args[2] : args[0] || 30);
  seed = from ? path.basename(args[1], ".json").replace(/-day[0-9.]+$/, "") : args[1] || "looks-1";
  w = from ? S.loadWorld(fs.readFileSync(args[1], "utf8")) : S.newValley(seed, { calStart: Date.parse("2026-10-20T15:00:00Z"), tzMin: 300 });
  const kinds = Object.keys(S.GIFT_KINDS),
    every = from ? 2 : 4; // carrying on: something to find every other gift
  let n = 0,
    t0 = Date.now();
  for (let h = Math.ceil((w.t / 3600 - 9) / 24) * 24 + 9; h < days * 24; h += 24) {
    S.runUntil(w, h * 3600);
    snap(w);
    const k = ++n % every === 0 ? "found" : kinds.slice().sort((a, b) => S.giftNeed(w, b) - S.giftNeed(w, a))[0];
    S.giveGift(w, k);
  }
  S.runUntil(w, days * D);
  snap(w);
  console.log(`ran ${days} days in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}

const name = (id) => (w.byId[id] ? w.byId[id].name : w.lineage && w.lineage[id] ? w.lineage[id].name + "†" : "?");
const line = (c) => {
  const l = S.looksOf(w, c),
    st = S.stageOf(w, c),
    age = S.ageDays(w, c).toFixed(1);
  return `${c.name.padEnd(9)} #${String(c.id).padEnd(4)} gen ${String(c.gen || 0).padEnd(2)} ${st.padEnd(6)} ${age.padStart(5)}d  fur ${String(l.fur).padStart(2)} ${S.LOOKS_FUR_NAMES[l.fur].padEnd(10)} ${l.pat.padEnd(8)} ${l.pale ? "pale" : "dark"} ${l.face.padEnd(5)} ${l.socks ? "socks" : "     "} dye ${l.dye} ${(l.wear || "-").padEnd(8)}${c.treasure ? ` treasure "${c.treasure}"${S.looksWearsTreasure(c) ? " (worn)" : " (kept)"}` : ""}  parents: ${(c.parents || []).map(name).join(" + ") || "-"}`;
};

console.log(`\n${seed}: day ${days.toFixed(1)}, ${w.creatures.length} creekfolk\n`);
const alive = w.creatures.filter((c) => !c.visitor).sort((a, b) => (a.gen || 0) - (b.gen || 0) || a.id - b.id);
for (const c of alive) console.log(line(c));

// How children compare with their parents (everyone ever born in this run whose parents we saw).
let kids = 0,
  furSame = 0,
  furNear = 0,
  patSame = 0,
  faceSame = 0,
  socksSame = 0;
const ring = S.LOOKS_FUR.length;
for (const id in looksAt) {
  const c = w.byId[id] || (w.lineage && w.lineage[id]);
  const ps = (c && c.parents) || [];
  if (ps.length !== 2 || !looksAt[ps[0]] || !looksAt[ps[1]]) continue;
  const l = looksAt[id],
    a = looksAt[ps[0]],
    b = looksAt[ps[1]];
  const d = (x, y) => Math.min((((x - y) % ring) + ring) % ring, (((y - x) % ring) + ring) % ring);
  kids++;
  if (l.fur === a.fur || l.fur === b.fur) furSame++;
  if (Math.min(d(l.fur, a.fur), d(l.fur, b.fur)) <= 1) furNear++;
  if (l.pat === a.pat || l.pat === b.pat) patSame++;
  if (l.face === a.face || l.face === b.face) faceSame++;
  if (l.socks === a.socks || l.socks === b.socks) socksSame++;
}
const pc = (x) => (kids ? Math.round((100 * x) / kids) + "%" : "-");
console.log(`\nchildren seen: ${kids}; fur the same as a parent's ${pc(furSame)}, within one shade ${pc(furNear)}; coat pattern ${pc(patSame)}; face ${pc(faceSame)}; paws ${pc(socksSame)}`);
const furs = {};
for (const c of alive) furs[S.LOOKS_FUR_NAMES[S.looksOf(w, c).fur]] = (furs[S.LOOKS_FUR_NAMES[S.looksOf(w, c).fur]] || 0) + 1;
console.log("fur colours alive:", JSON.stringify(furs));
const wears = {};
for (const c of alive) wears[c.look.wear || "-"] = (wears[c.look.wear || "-"] || 0) + 1;
console.log("worn:", JSON.stringify(wears), " treasures worn:", alive.filter((c) => S.looksWearsTreasure(c)).length);

// Families: the living with living children or grandchildren.
console.log("\nfamilies (living elders or adults with living descendants):");
for (const c of alive) {
  const kidsAlive = (c.children || []).map((k) => w.byId[k]).filter(Boolean);
  if (!kidsAlive.length) continue;
  const grand = kidsAlive.flatMap((k) => (k.children || []).map((g) => w.byId[g]).filter(Boolean));
  if (S.stageOf(w, c) === "child") continue;
  console.log(`  ${c.name}#${c.id} (${S.stageOf(w, c)}) -> ${kidsAlive.map((k) => `${k.name}#${k.id}`).join(", ")}${grand.length ? `  => ${grand.map((g) => `${g.name}#${g.id}`).join(", ")}` : ""}`);
}

// The look survives a save and reload.
const back = S.loadWorld(S.saveWorld(w));
const same = w.creatures.every((c) => JSON.stringify(c.look) === JSON.stringify(back.byId[c.id].look));
console.log(`\nsave and reload keeps every look: ${same ? "yes" : "NO"}`);

if (args[0] !== "--load") {
  fs.mkdirSync(path.join(__dirname, "../runs/looks"), { recursive: true });
  const out = path.join(__dirname, `../runs/looks/${seed}-day${days}.json`);
  fs.writeFileSync(out, S.saveWorld(w));
  console.log("saved", out);
}

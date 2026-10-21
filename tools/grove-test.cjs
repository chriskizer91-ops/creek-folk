// The memorial grove and the goats over a long time, without running the whole valley.
//
//   node tools/grove-test.cjs [save=runs/worlds/3c/e48-year-1-day300.json] [years=3]
//
// Loads a saved valley with the current source, upgrades its grove (kinds, fall times),
// then plants trees for made-up passings (about as often as a real valley has them,
// children of recent passings so families exist), with the grove's life check every
// 600 s of valley time, for several years. Prints the standing trees, the logs and the
// size of the grove's saved state as it goes, how well families cluster, and checks:
//   - the standing trees and the logs stay under their bounds and level off,
//   - the grove's saved state stays flat,
//   - a save and reload keeps the grove exactly,
//   - goats: kids are born in spring, the herd stays within its bound, blankets are made.
// The simulation is compiled from src/ (the files and order of tools/build.mjs), so the
// grove's internal functions can be called directly.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const build = fs.readFileSync(path.join(root, "tools/build.mjs"), "utf8");
const files = [...build.match(/SIM_FILES = \[([\s\S]*?)\];/)[1].matchAll(/^\s*'([^']+)',/gm)].map((m) => m[1]);
const code =
  '"use strict";\nvar BUILD_VERSION = "3c", DEV_BUILD = false;\n' +
  files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n") +
  "\nreturn { CreekSim, groveOf, groveTick, grovePlant, groveSize, groveWords, groveLogDecay, GROVE, GOATS, lineageRecord, seasonAt, DAY_S, Rng, goatTick, giveGoats, faunaOf, faunaMinute, groveLast: () => groveLastNear, groveLogDist };";
const S = new Function(code)();

const file = process.argv[2] || path.join(root, "runs/worlds/3c/e48-year-1-day300.json");
const years = +(process.argv[3] || 3);
let ok = true;
const check = (cond, what) => {
  console.log(`${cond ? "ok  " : "FAIL"} ${what}`);
  if (!cond) ok = false;
};

const w = S.CreekSim.loadWorld(fs.readFileSync(file, "utf8"));
const day = () => (w.t / 86400).toFixed(1);
const grove = () => w.res.filter((r) => r.kind === "grove");
const groveBytes = () => JSON.stringify({ g: w.grove, t: grove(), tk: Object.values(w.lineage).map((r) => r.tk || 0) }).length;
const kinds = () => grove().reduce((a, r) => ((a[r.tk] = (a[r.tk] || 0) + 1), a), {});

// Families cluster: how often a tree's four nearest neighbours are the same kind,
// against what the mix of kinds alone would give.
function clustering() {
  let t = grove(),
    same = 0,
    all = 0;
  for (let a of t) {
    let near = t.filter((b) => b !== a).map((b) => [(a.x - b.x) ** 2 + (a.z - b.z) ** 2, b]).sort((p, q) => p[0] - q[0]).slice(0, 4);
    for (let [, b] of near) (all++, b.tk === a.tk && same++);
  }
  let k = kinds(),
    n = t.length,
    chance = Object.values(k).reduce((a, c) => a + (c / n) ** 2, 0);
  return { same: +(same / Math.max(1, all)).toFixed(2), chance: +chance.toFixed(2) };
}

console.log(`${path.basename(file)}: day ${day()}, ${grove().length} memorial trees (before the upgrade)`);
S.groveTick(w);
let g = S.groveOf(w);
console.log(`after the upgrade: ${grove().length} standing, ${g.logs.length} logs, kinds ${JSON.stringify(kinds())}, founders ${g.founders.length}`);
let cl = clustering();
console.log(`nearest neighbour the same kind: ${cl.same} (the mix alone would give ${cl.chance})`);
let sizes = grove().map((r) => S.groveSize(w, r)).sort((a, b) => b - a);
console.log(`sizes: largest ${sizes[0].toFixed(2)}, median ${sizes[sizes.length >> 1].toFixed(2)}, smallest ${sizes[sizes.length - 1].toFixed(2)}`);
let founderTrees = grove().filter((r) => g.founders.includes(r.who));
console.log(`founders' trees standing: ${founderTrees.length}, sizes ${founderTrees.map((r) => S.groveSize(w, r).toFixed(2)).join(" ")}`);

// Made-up passings: about as many as a real valley (~0.75 a day), each a child of a pair
// of recent passings; a pair has two to four children (siblings), so the grove has
// families to cluster.
const rng = new S.Rng("grove-test");
const SIGS = ["water", "building", "growing", "collecting", "sound", "exploring", "social"];
let recent = Object.values(w.lineage).filter((r) => r.died).sort((a, b) => a.died - b.died).slice(-40);
let nextId = 9e6,
  planted = 0,
  maxStanding = 0,
  maxLogs = 0,
  rows = [],
  plantMs = 0,
  lines = [],
  modes = {},
  pairs = [];
w.onLog = (o) => {
  if (o.kind === "grove" || o.kind === "passing" || o.kind === "goats") lines.push(`day ${day()}: ${o.text}`);
};
const T0 = w.t,
  T1 = w.t + years * 365 * 86400;
let nextPass = w.t;
for (let t = w.t; t < T1; t += 600) {
  w.t = t;
  while (w.t >= nextPass) {
    // a pair has two to four children, who pass on around the same time (siblings)
    pairs = pairs.filter((p) => p.left > 0);
    if (pairs.length < 6 && recent.length >= 2) pairs.push({ ps: [rng.pick(recent).id, rng.pick(recent).id], left: rng.int(2, 4) });
    let pair = pairs.length ? rng.pick(pairs) : null,
      ps = pair ? [...new Set(pair.ps)] : [];
    if (pair) pair.left--;
    let c = { id: nextId++, name: "F" + nextId, born: Math.round(w.t - 30 * 86400), gen: 30, sig: rng.pick(SIGS), parents: ps, look: { hue: rng.next() }, counts: {} };
    let rec = S.lineageRecord(w, c);
    let t0 = process.hrtime.bigint();
    let tree = S.grovePlant(w, c);
    plantMs += Number(process.hrtime.bigint() - t0) / 1e6;
    if (tree) {
      rec.tree = tree.id;
      planted++;
      modes[S.groveLast().mode] = (modes[S.groveLast().mode] || 0) + 1;
      if (planted <= 3) lines.push(`day ${day()}: (made-up passing)${S.groveWords(w, tree)}`);
    }
    rec.died = Math.round(w.t);
    recent.push(rec);
    if (recent.length > 40) recent.shift();
    nextPass += rng.range(0.5, 2.17) * 86400; // about 0.75 a day, as in the year runs
  }
  S.groveTick(w);
  let n = grove().length;
  maxStanding = Math.max(maxStanding, n);
  maxLogs = Math.max(maxLogs, g.logs.length);
  if ((t - T0) % (30 * 86400) < 600) rows.push({ day: +day(), standing: n, logs: g.logs.length, fallen: g.fallen, bytes: groveBytes(), kinds: kinds() });
}
console.log("\nday     standing  logs  fallen  grove bytes  kinds");
for (const r of rows) console.log(`${String(r.day).padEnd(8)}${String(r.standing).padEnd(10)}${String(r.logs).padEnd(6)}${String(r.fallen).padEnd(8)}${String(r.bytes).padEnd(13)}${JSON.stringify(r.kinds)}`);
console.log(`\nplanted ${planted} trees over ${years} years (${(plantMs / Math.max(1, planted)).toFixed(2)} ms each); most standing ${maxStanding}, most logs ${maxLogs}`);
console.log(`where they were planted: ${JSON.stringify(modes)}`);
cl = clustering();
console.log(`nearest neighbour the same kind: ${cl.same} (the mix alone would give ${cl.chance})`);
{
  // how close a tree stands to the tree it took after
  let ds = [],
    inNear = 0,
    n = 0;
  for (let t of grove()) {
    let k = t.kin != null && w.lineage[t.kin] && w.byId[w.lineage[t.kin].tree];
    if (!k || k.kind !== "grove") continue;
    n++;
    ds.push(Math.hypot(t.x - k.x, t.z - k.z));
    let near = grove().filter((b) => b !== t).sort((p, q) => (p.x - t.x) ** 2 + (p.z - t.z) ** 2 - ((q.x - t.x) ** 2 + (q.z - t.z) ** 2)).slice(0, 4);
    if (near.includes(k)) inNear++;
  }
  ds.sort((a, b) => a - b);
  console.log(`trees whose parent's tree still stands: ${n}; distance to it: median ${(ds[n >> 1] || 0).toFixed(1)} m, 90% ${(ds[Math.floor(n * 0.9)] || 0).toFixed(1)} m; among its 4 nearest: ${(inNear / Math.max(1, n)).toFixed(2)}`);
}
let far = Math.max(...grove().map((r) => Math.hypot(r.x - g.x, r.z - g.z)));
console.log(`farthest tree from the grove's centre: ${far.toFixed(1)} m`);
console.log("\nsome log lines:\n  " + [...lines.slice(0, 8), "...", ...lines.filter((l) => /first five/.test(l)).slice(0, 3)].join("\n  "));

if (process.env.MAP) {
  // a map of the grove: o oak, p pine, w willow, b birch, = log (capitals: the first five's)
  let ch = { oak: "o", pine: "p", willow: "w", birch: "b" },
    rows = [];
  for (let z = Math.floor(g.z - 21); z <= g.z + 21; z += 1) {
    let row = "";
    for (let x = Math.floor(g.x - 21); x <= g.x + 21; x += 0.5) {
      let t = grove().find((r) => Math.abs(r.x - x) < 0.25 && Math.abs(r.z - z) < 0.5),
        l = !t && g.logs.find((l) => S.groveLogDist(l, x, z) < 0.05);
      row += t ? (g.founders.includes(t.who) ? ch[t.tk].toUpperCase() : ch[t.tk]) : l ? "=" : !w.terrain.walkable(x, z) ? "~" : ".";
    }
    rows.push(row);
  }
  console.log(rows.join("\n"));
}
check(maxStanding <= S.GROVE.maxStanding, `standing trees never above ${S.GROVE.maxStanding} (most ${maxStanding})`);
check(maxLogs <= S.GROVE.maxLogs, `logs never above ${S.GROVE.maxLogs} (most ${maxLogs})`);
let late = rows.slice(-Math.min(12, rows.length >> 1));
let spread = Math.max(...late.map((r) => r.standing)) - Math.min(...late.map((r) => r.standing));
check(spread < 60, `standing trees level off over the last year (range ${spread})`);
let bytes = late.map((r) => r.bytes);
check(Math.max(...bytes) < 1.25 * Math.min(...bytes) + 2000, `grove state stays flat over the last year (${Math.min(...bytes)}..${Math.max(...bytes)} bytes, plus lineage kinds)`);
check(cl.same > cl.chance + 0.1, `families cluster (same-kind neighbours ${cl.same} vs ${cl.chance} by chance)`);

// a save and reload keeps the grove exactly
let w2 = S.CreekSim.loadWorld(S.CreekSim.saveWorld(w));
let a = JSON.stringify({ g: w.grove, t: grove() }),
  b = JSON.stringify({ g: w2.grove, t: w2.res.filter((r) => r.kind === "grove") });
check(a === b, "save and reload keep the grove exactly");

// goats: a herd from one gift, run through two valley years of life checks
const v = S.CreekSim.loadWorld(fs.readFileSync(file, "utf8"));
const f = S.faunaOf(v);
f.goats = [];
f.pasture = null;
S.giveGoats(v);
let herdMax = 0,
  kidsSeen = 0,
  glines = [];
v.onLog = (o) => o.kind === "goats" && glines.push(`day ${(v.t / 86400).toFixed(1)}: ${o.text}`);
for (let t = v.t, end = v.t + 120 * 86400; t < end; t += 60) {
  v.t = t;
  S.faunaMinute(v);
  if (t % 600 < 60) {
    S.goatTick(v);
    f.wool = Math.min(60, (f.wool || 0) + 0.3); // brushing, roughly as often as a real valley
    S.groveTick(v);
  }
  herdMax = Math.max(herdMax, f.goats.length);
  for (let k of f.goats) if (k.mom) kidsSeen = Math.max(kidsSeen, k.id);
  // a kid stays near its mother
  for (let k of f.goats) {
    let m = k.mom && f.goats.find((o) => o.id === k.mom);
    if (m && (v.t - k.born) / 86400 < S.GOATS.kidDays && v.t > k.tn && Math.hypot(k.x - m.x, k.z - m.z) > 3) {
      check(false, `kid ${k.name} wandered ${Math.hypot(k.x - m.x, k.z - m.z).toFixed(1)} m from its mother`);
      break;
    }
  }
}
console.log("\ngoats over 120 days:\n  " + glines.slice(0, 10).join("\n  ") + (glines.length > 10 ? `\n  ... (${glines.length} lines)` : ""));
check((f.kids || 0) > 0, `kids were born (${f.kids || 0} in 120 days)`);
check(herdMax <= Math.max(S.GOATS.herdMax, 2), `the herd stayed within ${S.GOATS.herdMax} (most ${herdMax})`);
check((f.blanketsMade || 0) > 0 && f.wool <= S.GOATS.woolMax, `wool became blankets (${f.blanketsMade || 0} made, ${Object.keys(f.blankets || {}).length} in use, wool kept ${f.wool})`);
console.log(ok ? "PASS: the grove and the goats stay bounded" : "FAIL");
process.exit(ok ? 0 : 1);

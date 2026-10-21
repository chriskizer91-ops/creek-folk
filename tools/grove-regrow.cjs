// Regrow a saved valley's memorial grove under the 3C rules, from the valley's own
// lineage, to see what a 3C valley's grove looks like at that age (an old valley's trees
// were planted by the old rules, in a tight spiral with no kinds).
//
//   node tools/grove-regrow.cjs <save.json> <out.json>
//
// Every creekfolk who passed on (w.lineage, in the order they passed, with their real
// parents and loves) gets a tree with grovePlant at the moment they passed, and the
// grove's life check (falls, logs rotting) runs every 600 s in between. Only the grove
// changes (the trees, w.grove, and lineage tree/tk fields); the rest of the valley is
// left as saved. For looking at, not for playing on.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const build = fs.readFileSync(path.join(root, "tools/build.mjs"), "utf8");
const files = [...build.match(/SIM_FILES = \[([\s\S]*?)\];/)[1].matchAll(/^\s*'([^']+)',/gm)].map((m) => m[1]);
const S = new Function(
  '"use strict";\nvar BUILD_VERSION = "3c", DEV_BUILD = false;\n' +
    files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n") +
    "\nreturn { CreekSim, grovePlant, groveTreesTick, removeThing, hash01s };",
)();
const [file, out] = process.argv.slice(2);
if (!file || !out) {
  console.log("usage: node tools/grove-regrow.cjs <save.json> <out.json>");
  process.exit(1);
}
const w = S.CreekSim.loadWorld(fs.readFileSync(file, "utf8"));
const T = w.t;
for (const r of w.res.filter((r) => r.kind === "grove")) S.removeThing(w, r, w.res);
w.grove = { x: w.grove.x, z: w.grove.z, n: 0 };
const recs = Object.values(w.lineage);
for (const r of recs) delete r.tk, delete r.tree;
const passed = recs.filter((r) => r.how === "passed" && r.died != null).sort((a, b) => a.died - b.died || a.id - b.id);
let t = passed.length ? passed[0].died : T,
  planted = 0;
for (const r of passed) {
  for (; t < r.died; t += 600) (w.t = t), S.groveTreesTick(w);
  w.t = r.died;
  const c = { id: r.id, name: r.name, parents: r.parents || [], sig: r.sig, born: r.born, gen: r.gen, look: { hue: S.hash01s(r.id) } };
  const tree = S.grovePlant(w, c);
  if (tree) (r.tree = tree.id), planted++;
}
for (; t < T; t += 600) (w.t = t), S.groveTreesTick(w);
w.t = T;
S.groveTreesTick(w);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, S.CreekSim.saveWorld(w));
const trees = w.res.filter((r) => r.kind === "grove"),
  kinds = trees.reduce((a, r) => ((a[r.tk] = (a[r.tk] || 0) + 1), a), {}),
  sizes = trees.map((r) => [r.name, ((T - r.planted) / 86400).toFixed(0)]).sort((a, b) => b[1] - a[1]);
console.log(`regrew ${planted} trees for ${passed.length} passings: ${trees.length} standing ${JSON.stringify(kinds)}, ${w.grove.logs.length} logs, ${w.grove.fallen} fallen; oldest standing: ${sizes.slice(0, 6).map((s) => `${s[0]} (${s[1]} days)`).join(", ")} -> ${out}`);

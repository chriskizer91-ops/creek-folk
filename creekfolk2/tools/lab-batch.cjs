// Runs tools/creek-lab.cjs for several variants and seeds, a few at a time, and prints the
// driest point of each valley year side by side. Development only.
//
//   node tools/lab-batch.cjs variants.json [--jobs 2] [--days 31] [--seeds cf2-1,cf2-2,cf2-3]
//                            [--dams arc | "runs/r4/{seed}-day32.json"] [--wx a,b,c]
//
// The weather is fixed per seed (creek-lab --fixed-weather), so variants are compared on the
// same storms. variants.json: [{ "name": "a", "CREEK": {...}, "CF2_CREEK": {...}, "CF2_VALLEY": {...} }, ...]
"use strict";
const { execFile } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i >= 0 ? process.argv[i + 1] : d;
};
const variants = JSON.parse(fs.readFileSync(process.argv[2], "utf8")),
  jobs = +arg("jobs", 2),
  days = arg("days", "31"),
  seeds = arg("seeds", "cf2-1,cf2-2,cf2-3").split(","),
  dams = arg("dams", "arc");
const todo = [];
// --wx a,b,c: run each seed in several weathers (the lab's fixed weather, tagged)
const wxs = arg("wx", "").split(",");
for (const v of variants) for (const s of seeds) for (const x of wxs) todo.push({ v, s, x });
const out = {};
let running = 0,
  next = 0;
function launch() {
  if (next >= todo.length) return;
  const { v, s, x } = todo[next++];
  running++;
  const env = { ...process.env };
  for (const k of ["CREEK", "CF2_CREEK", "CF2_VALLEY"]) if (v[k]) env[k] = JSON.stringify(v[k]);
  execFile("node", [path.join(__dirname, "creek-lab.cjs"), "--seed", s, "--days", days, "--every", "1000", "--dams", dams.replace("{seed}", s), "--fixed-weather", "--wx", x], { env, maxBuffer: 1 << 24 }, (err, stdout) => {
    running--;
    const dr = [...stdout.matchAll(/day ([\d.]+)\): wet ([\d.]+)%/g)].map((m) => m[2].padStart(5));
    const st = (stdout.match(/storms (\d+)/) || [])[1];
    (out[v.name] = out[v.name] || {})[s + (x ? "/" + x : "")] = `${dr.join(" ")}  (${st} floods)`;
    if (next < todo.length) launch();
    else if (!running)
      for (const v2 of variants) {
        console.log(v2.name);
        for (const k of Object.keys(out[v2.name]).sort()) console.log(`  ${k.padEnd(10)} ${out[v2.name][k]}`);
      }
  });
}
for (let j = 0; j < jobs; j++) launch();

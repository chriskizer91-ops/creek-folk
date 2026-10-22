// How long one more day takes to simulate, from saved valleys of different ages: does catch-up
// slow down as a valley grows old? Each save is loaded and run on for a day (the same code path
// as a catch-up), one at a time, measuring this process's CPU time. Development only.
//
//   node tools/dayspeed.cjs runs/x/cf2-1-day30.json runs/x/cf2-1-day92.json ... [--days 1]
//
// SIM=<file> runs a frozen copy of the simulation. A save from an earlier build of the same
// simulation is opened anyway (a tool, not the game).
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const S = require(process.env.SIM ? path.resolve(process.env.SIM) : path.join(__dirname, "../dist/sim.cjs"));
const i = process.argv.indexOf("--days"),
  days = i >= 0 ? +process.argv[i + 1] : 1,
  files = process.argv.slice(2).filter((f, k, a) => f !== "--days" && a[k - 1] !== "--days");
for (const f of files) {
  const w = S.loadWorld(fs.readFileSync(f, "utf8").replace(/"build":"[^"]*"/, `"build":${JSON.stringify(S.BUILD_VERSION)}`));
  const pop0 = w.creatures.filter((c) => !c.visitor).length,
    d0 = w.t / 86400,
    c0 = process.cpuUsage(),
    t0 = Date.now();
  S.runUntil(w, w.t + days * 86400);
  const c = process.cpuUsage(c0),
    cpu = (c.user + c.system) / 1e6 / days,
    pop = (pop0 + w.creatures.filter((c) => !c.visitor).length) / 2;
  console.log(`${path.basename(f).padEnd(22)} day ${d0.toFixed(0).padStart(3)} -> ${(w.t / 86400).toFixed(0).padStart(3)}: ${cpu.toFixed(1)} s of CPU a day (${((Date.now() - t0) / 1000 / days).toFixed(1)} s wall), ${pop.toFixed(1)} creekfolk, ${(cpu / pop).toFixed(3)} s a creekfolk-day; ${w.res.length} things in the valley, save ${Math.round(S.saveWorld(w).length / 1024)} KB`);
}

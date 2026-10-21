// Headless month runner. Runs whole valleys in full detail, as fast as the CPU allows,
// and prints how the valley and its creek are doing. Development only: never shipped.
//
//   node tools/month.cjs [--seeds 2] [--days 30] [--every 3] [--jobs 2] [--save 10,20,30] [--out runs/month]
//
// Each seed runs in its own process. LIFE='{"pairBirthDays":4}' (JSON) tunes lives;
// SIM=<file> runs a frozen copy of the simulation.
"use strict";
const { fork } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i >= 0 ? process.argv[i + 1] : d;
};
const D = 86400;

if (process.argv[2] === "--child") {
  const S = require(process.env.SIM ? path.resolve(process.env.SIM) : path.join(__dirname, "../dist/sim.cjs"));
  if (process.env.LIFE) Object.assign(S.LIFE, JSON.parse(process.env.LIFE));
  const [seed, days, every, saveAt, out] = [process.argv[3], +process.argv[4], +process.argv[5], process.argv[6], process.argv[7]];
  const saves = new Set(saveAt ? saveAt.split(",").map(Number) : []);
  const w = S.newValley(seed, { calStart: Date.parse("2026-10-20T15:00:00Z"), tzMin: 300 });
  // the lives of the founders' arc, as they happen (the log itself keeps only its last 500 lines)
  const arc = { pairs: [], passed: [], firstGen: {} };
  w.onLog = (o) => {
    if (/ have paired up\./.test(o.text)) arc.pairs.push(+(o.t / D).toFixed(2));
    if (o.kind === "birth" && o.who && o.who[0] != null) {
      const c = w.byId[o.who[0]],
        g = c ? c.gen || 0 : 0;
      if (arc.firstGen[g] == null) arc.firstGen[g] = +(o.t / D).toFixed(2);
    }
  };
  const foundersAlive = () => w.creatures.filter((c) => c.founder && !c.visitor).map((c) => c.id);
  let fPrev = foundersAlive();
  const rows = [];
  const t0 = Date.now();
  let tPrev = t0;
  for (let d = 1; d <= days; d++) {
    for (let k = 1; k <= 8; k++) {
      S.runUntil(w, (d - 1 + k / 8) * D);
      const fNow = foundersAlive();
      for (const id of fPrev) if (!fNow.includes(id)) arc.passed.push(+(w.t / D).toFixed(2));
      fPrev = fNow;
    }
    if (d % every === 0 || d === days) {
      const sc = S.stageCounts(w),
        cr = w.creek,
        dr = S.creekDriest(w),
        inV = cr.nodes.filter((n) => n.z >= 0 && n.z <= S.VL),
        st = {};
      for (const n of inV) st[n.stage] = (st[n.stage] || 0) + 1;
      const now = Date.now();
      rows.push({
        day: d,
        pop: w.creatures.filter((c) => !c.visitor).length,
        ch: sc.child,
        ad: sc.adult,
        el: sc.elder,
        founders: w.creatures.filter((c) => c.founder && !c.visitor).length,
        cap: S.valleyCapacity(w),
        feed: S.creekFeed(w),
        births: w.stats.births || 0,
        passings: w.stats.passings || 0,
        departed: w.stats.departed || 0,
        wet: cr.wetNow,
        driest: dr ? dr.wet : null,
        trench: +(inV.reduce((a, n) => a + n.fp - n.bed, 0) / inV.length).toFixed(3),
        dams: w.structures.filter((s) => s.kind === "dam").map((s) => s.level + (s.leaks ? "!" : "")).join(""),
        floods: cr.floods,
        stages: st,
        dry: cr.br ? cr.br.dry.state : "",
        homes: w.structures.filter((s) => s.kind === "home" && s.level > 0).length,
        built: w.structures.filter((s) => s.level > 0).length,
        errors: w.stats.errors || 0,
        season: S.seasonAt(w).name,
        sec: +((now - tPrev) / 1000).toFixed(1),
        x: Math.round((every * D * 1000) / Math.max(1, now - tPrev)),
      });
      tPrev = now;
      process.send({ type: "row", seed, row: rows[rows.length - 1] });
    }
    if (saves.has(d)) {
      fs.mkdirSync(out, { recursive: true });
      fs.writeFileSync(path.join(out, `${seed}-day${d}.json`), S.saveWorld(w));
    }
  }
  const save = S.saveWorld(w);
  process.send({ type: "done", seed, rows, arc, ms: Date.now() - t0, saveKB: Math.round(save.length / 1024), log: w.log.slice(-40).map((e) => `${(e.t / D).toFixed(2)} ${e.text}`) });
  process.exit(0);
}

const nSeeds = +arg("seeds", 2),
  days = +arg("days", 30),
  every = +arg("every", 3),
  jobs = +arg("jobs", 2),
  saveAt = arg("save", ""),
  out = arg("out", "runs/month"),
  seeds = (arg("seed-list", "") || Array.from({ length: nSeeds }, (_, i) => `cf2-${i + 1}`).join(",")).split(",");
const results = {};
let next = 0,
  running = 0;
const fmt = (s, r) =>
  `${s.padEnd(7)} d${String(r.day).padStart(3)} ${r.season.padEnd(6)} pop ${String(r.pop).padStart(2)} (${r.ch}/${r.ad}/${r.el}) f${r.founders} cap ${r.cap} feed ${r.feed} b${r.births} p${r.passings} gone ${r.departed} | wet ${r.wet.toFixed(2)} driest ${r.driest == null ? "-" : r.driest.toFixed(2)} trench ${r.trench} dams ${r.dams || "-"} floods ${r.floods} ${Object.entries(r.stages).map(([k, v]) => k + ":" + v).join(" ")} dry ${r.dry} | homes ${r.homes} built ${r.built} err ${r.errors} | ${r.sec}s ${r.x}x`;
function launch() {
  if (next >= seeds.length) return;
  const seed = seeds[next++];
  running++;
  const child = fork(__filename, ["--child", seed, days, every, saveAt, out], { env: process.env });
  child.on("message", (m) => {
    if (m.type === "row") console.log(fmt(m.seed, m.row));
    else if (m.type === "done") {
      results[m.seed] = m;
      console.log(`${m.seed}: ${days} days in ${(m.ms / 1000).toFixed(0)} s (${Math.round((days * D * 1000) / m.ms)}x real time), save ${m.saveKB} KB`);
      const a = m.arc;
      console.log(`${m.seed}: first pairs on days ${a.pairs.slice(0, 4).join(" ")}; first of each generation born ${Object.entries(a.firstGen).map(([g, t]) => `g${g} ${t}`).join(", ")}; founders passed ${a.passed.join(" ")}`);
    }
  });
  child.on("exit", () => {
    running--;
    if (next < seeds.length) launch();
    else if (!running) {
      fs.mkdirSync(out, { recursive: true });
      fs.writeFileSync(path.join(out, "month.json"), JSON.stringify(results, null, 1));
      for (const s of seeds) if (results[s]) console.log(`\n${s} last log lines:\n  ` + results[s].log.slice(-12).join("\n  "));
    }
  });
}
for (let j = 0; j < Math.min(jobs, seeds.length); j++) launch();

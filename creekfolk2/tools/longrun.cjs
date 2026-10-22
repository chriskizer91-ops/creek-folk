// The living balance, measured: whole valleys run for months headless, printing every few
// days how many live there, how wet the creek is now and at the driest point of each valley
// year, how big the save is and what it is made of (every top-level field of the world, and
// the creekfolk's minds summed over everyone), how much memory the process holds, how long a
// day takes to simulate, and how the dam-tending is shared between creekfolk and beavers.
// At the end it checks that after day 35 nothing trends: the last third of the run against
// the middle third. Development only: never shipped.
//
//   node tools/longrun.cjs [--seeds 2] [--days 90] [--every 3] [--jobs 2] [--save 35,60,90]
//                          [--from "runs/x/{seed}-day32.json"] [--out runs/longrun] [--seed-list a,b]
//   node tools/longrun.cjs --check runs/longrun/longrun.json --days 90   (the summary again)
//
// Each seed runs in its own process. --from starts each seed from a saved valley instead of
// day 0 ({seed} is replaced). SIM=<file> runs a frozen copy of the simulation; TUNE=<json> sets
// tunables for the run, e.g. TUNE='{"BEAVER":{"smallDams":12},"BALANCE":{"goneDays":20}}'.
//
// The check (printed per seed, PASS or FAIL), after day 35, the rows of the middle third of
// the run (days N/3 to 2N/3, but not before 35) against those of the last third:
//   - population: the means differ by at most 12% (a few are born, pass or leave in a day, so
//     single rows swing by several);
//   - wet at the driest point (one value a valley year): the means differ by at most 0.06;
//   - save size: the means differ by at most 8%, and a straight line fitted to every row
//     after day 35 grows by less than 4% of the size per 30 days. The creekfolk's minds are
//     about 60% of the save and go up and down with how many live there, so also:
//   - the world's own records (the save without the creekfolk): the means differ by at most
//     6%, and the fitted line grows by less than 3% per 30 days;
//   - memory held by the process (after a garbage collection): the means differ by at most 10%;
//   - time to simulate a day (the process's own CPU time, and the wall clock): the last
//     third's mean at most 20% above the middle third's (reported, not failed on: the
//     machine may be shared).
// Dam-tending is sampled every 2 minutes of valley time: the share of grown-up creekfolk
// (awake, not visiting) whose plan is mending or building up a dam (and, separately,
// building a new one or its next level), by stretch of days.
"use strict";
const { fork } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i >= 0 ? process.argv[i + 1] : d;
};
const D = 86400;
const KB = (n) => Math.round(n / 1024);

if (process.argv[2] === "--child") {
  const S = require(process.env.SIM ? path.resolve(process.env.SIM) : path.join(__dirname, "../dist/sim.cjs"));
  // TUNE='{"BEAVER":{"smallDams":12}}' sets tunables (any object CreekSim exposes) for this run
  if (process.env.TUNE) for (const [k, v] of Object.entries(JSON.parse(process.env.TUNE))) Object.assign(S[k], v);
  const [seed, days, every, saveAt, out, from] = [process.argv[3], +process.argv[4], +process.argv[5], process.argv[6], process.argv[7], process.argv[8]];
  const saves = new Set(saveAt ? saveAt.split(",").map(Number) : []);
  // a save from an earlier build of the same simulation is opened anyway (a tool, not the game)
  const opened = (txt) => S.loadWorld(txt.replace(/"build":"[^"]*"/, `"build":${JSON.stringify(S.BUILD_VERSION)}`));
  const w = from && from !== "-" ? opened(fs.readFileSync(from.replace("{seed}", seed), "utf8")) : S.newValley(seed, { calStart: Date.parse("2026-10-20T15:00:00Z"), tzMin: 300 });
  const gc = typeof global.gc === "function" ? global.gc : () => {};
  // dam-tending samples, by day
  const dam = {}; // day -> { n: grown-up samples, tend, build, patch: dams mended by creekfolk, raise: built up by creekfolk, bmend, braise: by beavers }
  const dayOf = (t) => {
    const d = Math.floor(t / D);
    return dam[d] || (dam[d] = { n: 0, tend: 0, build: 0, patch: 0, raise: 0, bmend: 0, braise: 0 });
  };
  w.onLog = (o) => {
    if (o.kind === "repair" && o.who && o.who.length && w.structures.some((s) => s.kind === "dam" && Math.abs(s.x - o.x) < 0.01 && Math.abs(s.z - o.z) < 0.01)) dayOf(o.t).patch++;
    else if (o.kind === "wetland" && o.who && o.who.length && / built the .* (up a hand higher|up above the valley floor)/.test(o.text)) dayOf(o.t).raise++;
  };
  let bPrev = w.beavers ? { m: w.beavers.mended, r: w.beavers.raised } : { m: 0, r: 0 };
  const sample = () => {
    const e = dayOf(w.t),
      B = w.beavers;
    if (B) (e.bmend += B.mended - bPrev.m), (e.braise += B.raised - bPrev.r), (bPrev = { m: B.mended, r: B.raised });
    for (const c of w.creatures) {
      if (c.visitor || c.asleep || c.stage === "child") continue;
      e.n++;
      const p = c.plan;
      if (!p || p.goal !== "work") continue;
      const r = p.repair != null ? w.byId[p.repair] : null,
        s = p.sid != null ? w.byId[p.sid] : null;
      if (r && r.kind === "dam") e.tend++;
      else if (s && s.kind === "dam") e.build++;
    }
  };
  const rows = [];
  const t0 = Date.now();
  let cpuPrev = process.cpuUsage(),
    tPrev = t0,
    dayStart = Math.ceil(w.t / D - 1e-9);
  if (dayStart < 1) dayStart = 1;
  const drySeen = new Set();
  const driests = [];
  for (let d = dayStart; d <= days; d++) {
    while (w.t < d * D - 1) {
      S.runUntil(w, Math.min(d * D, Math.floor(w.t / 120 + 1) * 120));
      sample();
    }
    for (const r of w.creek.driest) if (!drySeen.has(r.t)) drySeen.add(r.t), driests.push({ day: +(r.t / D).toFixed(2), wet: r.wet });
    if (d % every === 0 || d === days) {
      const now = Date.now(),
        cpuNow = process.cpuUsage(cpuPrev),
        save = S.saveWorld(w),
        J = JSON.parse(save),
        fields = {};
      for (const k in J) fields[k] = JSON.stringify(J[k] === undefined ? null : J[k]).length;
      const cf = {};
      for (const c of J.creatures) for (const k in c) cf[k] = (cf[k] || 0) + JSON.stringify(c[k] === undefined ? null : c[k]).length;
      const alive = w.creatures.filter((c) => !c.visitor),
        sum = (f) => alive.reduce((a, c) => a + f(c), 0),
        dr = S.creekDriest(w),
        B = w.beavers;
      gc();
      const mem = process.memoryUsage();
      // dam-tending over the last `every` days
      let dn = 0,
        dt = 0,
        db = 0;
      for (let k = d - every; k < d; k++) if (dam[k]) (dn += dam[k].n), (dt += dam[k].tend), (db += dam[k].build);
      rows.push({
        day: d,
        pop: alive.length,
        st: S.stageCounts(w),
        cap: S.valleyCapacity(w),
        wet: +w.creek.wetNow.toFixed(3),
        driest: dr ? dr.wet : null,
        dams: w.structures.filter((s) => s.kind === "dam" && s.level > 0).length,
        saveKB: KB(save.length),
        fields,
        cf,
        minds: {
          mem: sum((c) => (c.mem || []).length),
          rel: sum((c) => Object.keys(c.rel || {}).length),
          relGone: sum((c) => Object.keys(c.rel || {}).filter((id) => !w.byId[id]).length),
          lore: sum((c) => Object.keys(c.lore || {}).length),
          lex: sum((c) => Object.keys(c.lex || {}).length),
          seen: sum((c) => Object.keys(c.seen || {}).length),
        },
        counts: {
          lineage: Object.keys(w.lineage || {}).length,
          stories: Object.keys(w.stories || {}).length,
          places: (w.placeNames || []).length,
          res: w.res.length,
          items: (w.items || []).length,
          structures: w.structures.length,
          downstream: (w.downstream || []).length,
          snaps: (w.downstream || []).filter((x) => x.snap).length,
          carvings: (w.carvings || []).length,
          chronicle: w.chronicle ? w.chronicle.days.length : 0,
          myths: Object.keys(w.myths || {}).length,
          pairs: w.mile ? Object.keys(w.mile.pairs || {}).length : 0,
          events: (J.events || []).length,
          lost: Object.keys(w.lost || {}).length,
        },
        heapMB: +(mem.heapUsed / 1048576).toFixed(1),
        damTend: dn ? +(dt / dn).toFixed(4) : 0,
        damBuild: dn ? +(db / dn).toFixed(4) : 0,
        beavers: B ? { n: B.list.length, kits: B.list.filter((b) => b.age === "kit").length, mended: B.mended, raised: B.raised, small: B.small.length, lodge: +B.lodge.size.toFixed(2) } : null,
        beaversDay: w.stats.beaversDay ?? null,
        raises: w.stats.raises || 0,
        repairs: w.stats.repairs || 0,
        errors: w.stats.errors || 0,
        secPerDay: +((now - tPrev) / 1000 / Math.max(1, d - (rows.length ? rows[rows.length - 1].day : dayStart - 1))).toFixed(1),
        cpuPerDay: +((cpuNow.user + cpuNow.system) / 1e6 / Math.max(1, d - (rows.length ? rows[rows.length - 1].day : dayStart - 1))).toFixed(1),
      });
      tPrev = Date.now();
      cpuPrev = process.cpuUsage();
      process.send({ type: "row", seed, row: rows[rows.length - 1] });
    }
    if (saves.has(d)) {
      fs.mkdirSync(out, { recursive: true });
      fs.writeFileSync(path.join(out, `${seed}-day${d}.json`), S.saveWorld(w));
    }
  }
  process.send({ type: "done", seed, rows, driests, dam, ms: Date.now() - t0, from: from && from !== "-" ? from : null });
  process.exit(0);
}

const nSeeds = +arg("seeds", 2),
  days = +arg("days", 90),
  every = +arg("every", 3),
  jobs = +arg("jobs", 2),
  saveAt = arg("save", ""),
  out = arg("out", "runs/longrun"),
  from = arg("from", "-"),
  seeds = (arg("seed-list", "") || Array.from({ length: nSeeds }, (_, i) => `cf2-${i + 1}`).join(",")).split(",");
const results = {};
let next = 0,
  running = 0;
const pct = (x) => (x == null ? "  -" : String(Math.round(x * 100)).padStart(3) + "%");
const fmt = (s, r) => {
  const f = r.fields,
    top = Object.entries(f)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([k, v]) => `${k} ${KB(v)}`)
      .join(", "),
    m = r.minds,
    cf = r.cf;
  return (
    `${s.padEnd(7)} d${String(r.day).padStart(3)} pop ${String(r.pop).padStart(2)} (${r.st.child}/${r.st.adult}/${r.st.elder}) cap ${r.cap} | wet ${pct(r.wet)} driest ${pct(r.driest)} dams ${r.dams} | save ${r.saveKB} KB heap ${r.heapMB} MB | ${r.secPerDay} s/day (cpu ${r.cpuPerDay}) | ` +
    `dam-tending ${(r.damTend * 100).toFixed(1)}% building ${(r.damBuild * 100).toFixed(1)}%` +
    (r.beavers ? ` | beavers ${r.beavers.n} (kits ${r.beavers.kits}) mended ${r.beavers.mended} raised ${r.beavers.raised} side dams ${r.beavers.small}` : "") +
    `\n          top: ${top}` +
    `\n          minds (KB): seen ${KB(cf.seen || 0)} rel ${KB(cf.rel || 0)} mem ${KB(cf.mem || 0)} lore ${KB(cf.lore || 0)} lex ${KB(cf.lex || 0)} explored ${KB(cf.explored || 0)} Q ${KB(cf.Q || 0)} places ${KB(cf.places || 0)}` +
    ` | entries: rel ${m.rel} (to the gone ${m.relGone}) mem ${m.mem} lore ${m.lore} lex ${m.lex} seen ${m.seen}` +
    `\n          counts: ${Object.entries(r.counts).map(([k, v]) => k + " " + v).join(", ")}`
  );
};
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
function slope(xs, ys) {
  const mx = mean(xs),
    my = mean(ys);
  let n = 0,
    d = 0;
  for (let i = 0; i < xs.length; i++) (n += (xs[i] - mx) * (ys[i] - my)), (d += (xs[i] - mx) ** 2);
  return d ? n / d : 0;
}
function check(seed, m) {
  const rows = m.rows.filter((r) => r.day > 35),
    lo = Math.max(35, days / 3),
    hi = (2 * days) / 3,
    mid = rows.filter((r) => r.day > lo && r.day <= hi),
    last = rows.filter((r) => r.day > hi),
    dMid = m.driests.filter((r) => r.day > lo && r.day <= hi).map((r) => r.wet),
    dLast = m.driests.filter((r) => r.day > hi).map((r) => r.wet);
  if (!mid.length || !last.length) return console.log(`${seed}: too short for the check (needs rows after day 35 in both the middle and the last third)`);
  const out = [];
  const one = (name, a, b, ok, unit = "") => out.push(`  ${ok ? "ok  " : "FAIL"} ${name}: middle ${a}${unit}, last ${b}${unit}`);
  const pm = mean(mid.map((r) => r.pop)),
    pl = mean(last.map((r) => r.pop));
  one("population", pm.toFixed(1), pl.toFixed(1), Math.abs(pl - pm) <= 0.12 * pm);
  const wm = mean(dMid),
    wl = mean(dLast);
  if (dMid.length && dLast.length) one("wet at the driest", wm.toFixed(3), wl.toFixed(3), Math.abs(wl - wm) <= 0.06);
  else out.push("  (no driest point recorded in one of the thirds)");
  const sm = mean(mid.map((r) => r.saveKB)),
    sl = mean(last.map((r) => r.saveKB));
  one("save size", Math.round(sm), Math.round(sl), Math.abs(sl - sm) <= 0.08 * sm, " KB");
  const sk = slope(rows.map((r) => r.day), rows.map((r) => r.saveKB)),
    per30 = (sk * 30) / mean(rows.map((r) => r.saveKB));
  one("save size trend after day 35 (per 30 days)", "", `${(sk * 30).toFixed(0)} KB (${(per30 * 100).toFixed(1)}%)`, Math.abs(per30) < 0.04);
  const wk = (r) => r.saveKB - r.fields.creatures / 1024,
    rm = mean(mid.map(wk)),
    wl2 = mean(last.map(wk));
  one("the world's records (the save without the creekfolk)", Math.round(rm), Math.round(wl2), Math.abs(wl2 - rm) <= 0.06 * rm, " KB");
  const wsk = slope(rows.map((r) => r.day), rows.map(wk)),
    wper30 = (wsk * 30) / mean(rows.map(wk));
  one("the world's records, trend after day 35 (per 30 days)", "", `${(wsk * 30).toFixed(0)} KB (${(wper30 * 100).toFixed(1)}%)`, Math.abs(wper30) < 0.03);
  const mk = (r) => r.fields.creatures / 1024 / Math.max(1, r.pop);
  out.push(`  (minds per creekfolk: middle ${mean(mid.map(mk)).toFixed(1)} KB, last ${mean(last.map(mk)).toFixed(1)} KB)`);
  const hm = mean(mid.map((r) => r.heapMB)),
    hl = mean(last.map((r) => r.heapMB));
  one("heap", hm.toFixed(0), hl.toFixed(0), Math.abs(hl - hm) <= 0.1 * hm, " MB");
  const tm = mean(mid.map((r) => r.secPerDay)),
    tl = mean(last.map((r) => r.secPerDay)),
    cm = mean(mid.map((r) => r.cpuPerDay ?? r.secPerDay)),
    cl = mean(last.map((r) => r.cpuPerDay ?? r.secPerDay));
  out.push(`  ${cl <= 1.2 * cm ? "ok  " : "slow"} time to simulate a day (reported, not failed): middle ${tm.toFixed(1)} s (cpu ${cm.toFixed(1)} s), last ${tl.toFixed(1)} s (cpu ${cl.toFixed(1)} s)`);
  const fail = out.some((l) => l.startsWith("  FAIL"));
  console.log(`${seed}: after day 35, days ${Math.round(lo)}-${Math.round(hi)} against ${Math.round(hi)}-${days}: ${fail ? "FAIL" : "PASS"}\n${out.join("\n")}`);
  // what grew most between the first row after day 35 and the last
  const a = rows[0],
    b = rows[rows.length - 1],
    grew = Object.keys(b.fields)
      .map((k) => [k, (b.fields[k] || 0) - (a.fields[k] || 0)])
      .sort((x, y) => Math.abs(y[1]) - Math.abs(x[1]))
      .slice(0, 10);
  console.log(`  fields that changed most from day ${a.day} to day ${b.day} (KB): ${grew.map(([k, v]) => `${k} ${v >= 0 ? "+" : ""}${KB(v)}`).join(", ")}`);
  return !fail;
}
function damSummary(seed, m) {
  const by = (d0, d1) => {
    let n = 0,
      t = 0,
      b = 0,
      e = { patch: 0, raise: 0, bmend: 0, braise: 0 },
      nd = 0;
    for (const k in m.dam)
      if (+k >= d0 && +k < d1) {
        const x = m.dam[k];
        (n += x.n), (t += x.tend), (b += x.build), nd++;
        for (const q in e) e[q] += x[q] || 0;
      }
    const per = (v) => (nd ? (v / nd).toFixed(1) : "-");
    return n ? `${((t / n) * 100).toFixed(2)}% of their time tending, ${((b / n) * 100).toFixed(2)}% building; a day: creekfolk mend ${per(e.patch)}, build up ${per(e.raise)}; beavers mend ${per(e.bmend)}, build up ${per(e.braise)}` : "-";
  };
  const last = m.rows[m.rows.length - 1],
    bd = last.beaversDay;
  const spans = [[0, 8], [8, 16], [16, 24], [24, 32], [32, 40], [40, 56], [56, 72], [72, 90], [90, 120], [120, 200]].filter(([a]) => a < days);
  console.log(`${seed}: beavers came on day ${bd ?? "-"}; grown-up creekfolk time on dams:\n  ` + spans.map(([a, b]) => `days ${a}-${Math.min(b, days)}: ${by(a, b)}`).join("\n  "));
  if (bd != null) {
    const b0 = Math.floor(bd);
    console.log(`  the 8 days before they came (days ${b0 - 8}-${b0}): ${by(b0 - 8, b0)}\n  the 8 days after (days ${b0 + 1}-${b0 + 9}): ${by(b0 + 1, b0 + 9)}${days > b0 + 9 ? `\n  days ${b0 + 9}-${days}: ${by(b0 + 9, days + 1)}` : ""}`);
  }
}
function launch() {
  if (next >= seeds.length) return;
  const seed = seeds[next++];
  running++;
  const child = fork(__filename, ["--child", seed, days, every, saveAt, out, from], { env: process.env, execArgv: ["--expose-gc", "--max-old-space-size=4096"] });
  child.on("message", (m) => {
    if (m.type === "row") console.log(fmt(m.seed, m.row));
    else if (m.type === "done") {
      results[m.seed] = m;
      console.log(`${m.seed}: to day ${days} in ${(m.ms / 1000).toFixed(0)} s${m.from ? " (from " + m.from.replace("{seed}", m.seed) + ")" : ""}`);
    }
  });
  child.on("exit", (code) => {
    running--;
    if (code) console.log(`${seed}: the run stopped with code ${code}`);
    if (next < seeds.length) launch();
    else if (!running) {
      fs.mkdirSync(out, { recursive: true });
      fs.writeFileSync(path.join(out, "longrun.json"), JSON.stringify(results));
      summary(seeds.filter((s) => results[s]));
    }
  });
}
function summary(list) {
  console.log("\nThe living balance (after day 35):");
  let all = true;
  for (const s of list) {
    damSummary(s, results[s]);
    console.log(`${s}: wet at the driest point of each valley year: ${results[s].driests.map((r) => `d${r.day} ${pct(r.wet).trim()}`).join(", ")}`);
    all = check(s, results[s]) !== false && all;
  }
  console.log(all ? "\nPASS: no trend after day 35" : "\nFAIL: something trends after day 35");
  process.exitCode = all ? 0 : 1;
}
// --check runs/x/longrun.json: the summary and the check again, from a finished run's results
if (arg("check", "")) {
  Object.assign(results, JSON.parse(fs.readFileSync(arg("check"), "utf8")));
  summary(Object.keys(results));
} else for (let j = 0; j < Math.min(jobs, seeds.length); j++) launch();

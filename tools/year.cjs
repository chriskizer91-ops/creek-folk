// Headless year runner. Runs whole valleys in full detail, as fast as the CPU allows,
// and checks them against the year's targets. Development only: never shipped.
//
//   node tools/year.cjs [--seeds 4] [--days 365] [--start 2026-10-20] [--jobs 2] [--out runs/year.json]
//
// Each seed runs in its own process. Progress prints once per simulated month.
"use strict";
const { fork } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i >= 0 ? process.argv[i + 1] : d;
};

if (process.argv[2] === "--child") {
  // ---- one valley ----
  const S = require(path.join(__dirname, "../dist/sim.cjs"));
  if (process.env.LIFE) Object.assign(S.LIFE, JSON.parse(process.env.LIFE)); // tuning experiments
  const [seed, days, startISO] = [process.argv[3], +process.argv[4], process.argv[5]];
  const calStart = Date.parse(startISO + "T12:00:00Z");
  const w = S.newValley(seed, { calStart, tzMin: 300 });
  const t0 = Date.now();
  const weeks = [];
  const D = 86400;
  let lastErr = 0;
  // A simulated player. GIFTS=regular (twice a day, choosing what's needed most),
  // none, irregular (now and then), or stop:<day> (regular, then never again).
  const policy = process.env.GIFTS || "none";
  const stopDay = policy.startsWith("stop:") ? +policy.slice(5) : Infinity;
  const kinds = ["rain", "seeds", "warm", "found"];
  let giftRng = 7;
  const rnd = () => ((giftRng = (giftRng * 16807) % 2147483647) / 2147483647);
  const give = () => {
    const k = kinds.slice().sort((a, b) => S.giftNeed(w, b) - S.giftNeed(w, a))[rnd() < 0.25 ? 3 : 0];
    S.giveGift(w, k);
  };
  for (let d = 1; d <= days; d++) {
    if (policy !== "none" && d < stopDay)
      for (const h of [9, 21]) {
        S.runUntil(w, (d - 1) * D + h * 3600 + Math.floor(rnd() * 3600));
        if (policy === "irregular" && rnd() > 0.2) continue;
        give();
      }
    S.runUntil(w, d * D);
    if (d % 7 === 0 || d === days) {
      const sc = S.stageCounts(w);
      weeks.push({
        day: d,
        pop: w.creatures.length,
        ...sc,
        cap: S.valleyCapacity(w),
        births: w.stats.births || 0,
        passings: w.stats.passings || 0,
        departed: w.stats.departed || 0,
        travelers: w.stats.travelers || 0,
        levels: w.stats.levels || 0,
        errors: w.stats.errors || 0,
        season: S.seasonAt(w).name,
        ms: Date.now() - t0,
      });
    }
    if (d % 30 === 0) process.send({ type: "progress", seed, day: d, pop: w.creatures.length, ms: Date.now() - t0 });
    if ((w.stats.errors || 0) > lastErr) lastErr = w.stats.errors;
  }
  const firsts = {};
  for (const e of w.hist) {
    const k = e.kind;
    if (["birth", "passing", "leaving", "season", "life", "built", "discovery"].includes(k) && !(k in firsts)) firsts[k] = { day: +(e.t / D).toFixed(2), text: e.text };
  }
  const lineage = Object.values(w.lineage || {});
  const firstPassing = lineage.filter((r) => r.died).reduce((m, r) => Math.min(m, r.died / D), Infinity);
  const out = {
    seed,
    days,
    ms: Date.now() - t0,
    weeks,
    firsts,
    firstPassingDay: isFinite(firstPassing) ? +firstPassing.toFixed(2) : null,
    maxGen: lineage.reduce((m, r) => Math.max(m, r.gen || 0), 0),
    lived: lineage.length,
    saveKB: Math.round(S.saveWorld(w).length / 1024),
    minds: {
      stories: Object.keys(w.stories || {}).length,
      myths: w.stats.myths || 0,
      places: (w.placeNames || []).map((p) => p.name),
      lost: w.stats.skillsLost || 0,
      relearned: w.hist.filter((e) => /has learned again/.test(e.text)).length,
      visits: w.stats.visits || 0,
      gifts: (w.gifts || []).length,
      believers: w.creatures.filter((c) => c.beliefs && c.beliefs.giver > 0.5).length,
      giver: S.giverName(w),
      customs: Object.keys(w.customs || {}).filter((k) => (k === "passing" ? w.customs[k].custom : k === "seasons" ? w.customs[k].n >= 2 : true)),
      firstMythDay: (w.hist.find((e) => e.kind === "myth") || { t: null }).t / D || null,
      samples: w.hist.filter((e) => ["myth", "custom", "belief", "visit", "lost", "place", "forgotten"].includes(e.kind)).slice(-14).map((e) => `${(e.t / D).toFixed(1)} ${e.text}`),
    },
    knowledge: Object.fromEntries(["mud", "planting", "clay", "glowcap", "tools", "dams"].map((k) => [k, w.creatures.filter((c) => c.know[k]).length])),
    structures: w.structures.map((s) => s.kind + ":" + s.level).sort().join(" "),
    errors: w.stats.errors || 0,
  };
  if (process.env.SAVE_WORLDS) {
    fs.mkdirSync(path.join(__dirname, "../runs/worlds"), { recursive: true });
    fs.writeFileSync(path.join(__dirname, `../runs/worlds/${seed}-day${days}.json`), S.saveWorld(w));
  }
  process.send({ type: "done", out });
  process.exit(0);
}

// ---- the coordinator ----
const seeds = +arg("seeds", 4),
  days = +arg("days", 365),
  start = arg("start", "2026-10-20"),
  jobs = +arg("jobs", 2),
  outFile = arg("out", "runs/year.json");
const queue = Array.from({ length: seeds }, (_, k) => `year-${k + 1}`);
const results = [];
let running = 0;
const t0 = Date.now();
function next() {
  if (!queue.length) {
    if (!running) finish();
    return;
  }
  const seed = queue.shift();
  running++;
  const ch = fork(__filename, ["--child", seed, String(days), start]);
  ch.on("message", (m) => {
    if (m.type === "progress") console.log(`  ${m.seed} day ${m.day}: ${m.pop} creekfolk (${(m.ms / 1000).toFixed(0)} s)`);
    if (m.type === "done") results.push(m.out);
  });
  ch.on("exit", (code) => {
    if (code) console.log(`  ${seed} exited with code ${code}`);
    running--;
    next();
  });
}
for (let k = 0; k < jobs; k++) next();

function finish() {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(results, null, 1));
  console.log(`\n${results.length} valleys, ${days} days each, in ${((Date.now() - t0) / 1000).toFixed(0)} s wall time\n`);
  for (const r of results) {
    const m = (d) => r.weeks.find((x) => x.day >= d) || r.weeks[r.weeks.length - 1];
    const months = [30, 60, 90, 120, 180, 240, 300, 365].filter((d) => d <= days).map((d) => `${d}d:${m(d).pop}`).join(" ");
    const full = r.weeks.find((x) => x.pop >= x.cap && x.cap >= 30);
    console.log(
      `${r.seed}: ${months} | births ${r.weeks.at(-1).births}, passings ${r.weeks.at(-1).passings}, downstream ${r.weeks.at(-1).departed}, generations ${r.maxGen}, errors ${r.errors}, ` +
        `first passing day ${r.firstPassingDay}, full by day ${full ? full.day : "-"}, sim ${(r.ms / 1000).toFixed(0)} s (${Math.round((days * 86400) / (r.ms / 1000))}x), save ${r.saveKB} KB`,
    );
  }
  for (const r of results) {
    const m = r.minds;
    console.log(`  ${r.seed} minds: ${m.stories} stories, ${m.myths} myths (first day ${m.firstMythDay ? m.firstMythDay.toFixed(1) : "-"}), ${m.places.length} places, skills lost ${m.lost} / relearned ${m.relearned}, visits ${m.visits}, gifts ${m.gifts}, believers ${m.believers}, giver ${m.giver}, customs ${m.customs.join(",") || "-"}`);
  }
  checkTargets(results, days);
}

// The year's targets: a sentence of intent plus a check.
function checkTargets(rs, days) {
  const T = [];
  const add = (why, pass, detail) => T.push({ why, pass, detail });
  add("No valley ever drops to zero.", rs.every((r) => r.weeks.every((w) => w.pop > 0)), rs.map((r) => Math.min(...r.weeks.map((w) => w.pop))).join(","));
  add("No simulation errors.", rs.every((r) => r.errors === 0), rs.map((r) => r.errors).join(","));
  add("The first passing happens after day 12.", rs.every((r) => r.firstPassingDay == null || r.firstPassingDay > 12), rs.map((r) => r.firstPassingDay).join(","));
  if (days >= 180) {
    const fills = rs.map((r) => {
      const f = r.weeks.find((w) => w.pop >= 30);
      return f ? f.day : null;
    });
    add("Most valleys reach 30 creekfolk between month 2 and month 6.", fills.filter((d) => d && d >= 50 && d <= 190).length >= Math.ceil(rs.length / 2), fills.join(","));
    add("Someone leaves downstream once the valley is full.", rs.every((r) => r.weeks.at(-1).departed > 0), rs.map((r) => r.weeks.at(-1).departed).join(","));
  }
  console.log("\nTargets:");
  for (const t of T) console.log(`  ${t.pass ? "PASS" : "FAIL"}  ${t.why}  [${t.detail}]`);
}

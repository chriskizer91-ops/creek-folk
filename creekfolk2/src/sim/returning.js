// Phase 3C: the procession path and the Returning, every midwinter, forever.
//
// When the temple is finished, the creekfolk spend three valley years laying a procession
// path from the temple, past the First Pool, up the creek to the head of the valley where
// the walk to the Spring begins: one stretch a season. The first Returning comes on the
// first midwinter after the path is done (month 12 for an every-other-day giver).
//
// On midwinter morning they meet on the temple steps: the sunrise lines up through the
// crown and the water on its steps turns gold (the view). By day they walk the path to the
// Spring and back. That night a run of softly glowing fish swims up the healed creek all
// the way to the spring; the village lines the channels with lanterns; the beavers and the
// fireflies are out; the one who believes in you looks up at the camera (the view).
// Each Returning adds a lantern on the pyramid for each creekfolk who passed since the
// last one, a new carving, and a new verse to their song.
//
// A valley with no temple still gets the fish run at midwinter once its creek has healed,
// without the sunrise through the crown or the festival. (A valley building one waits for
// its first Returning.)
//
// This file also gathers the 3C hooks: lifeTick3C, lifeOptions3C, devTrigger3C, partDone3C.

var RETURNING = {
  pathParts: 12, // stretches of the procession path, one a season
  partGap: 2 * 86400, // real days between stretches (a season)
  healed: 0.7, // driest share for the fish run in a valley with no temple
  verses: 12, // verses of their song kept word for word (the count goes on)
  pathStep: 2.4, // m between path stones
};

var pathPart = (name, mats, labor, o = {}) => stageDef(name, mats, labor, o);
STRUCTURES.path = {
  label: "procession path",
  concept: "path",
  radius: 0.8,
  great: "path",
  levels: [
    {
      name: "procession path",
      label: "procession path",
      stages: [
        pathPart("steps down from the temple", { stone: 4 }, 500, { heavy: !0 }),
        pathPart("stones across the meadow", { stone: 4 }, 500),
        pathPart("lantern posts by the temple", { branch: 3, stone: 1 }, 400),
        pathPart("the way down to the First Pool", { stone: 4 }, 500),
        pathPart("stepping stones at the First Pool", { stone: 5 }, 600, { heavy: !0 }),
        pathPart("lantern posts at the First Pool", { branch: 3, stone: 1 }, 400),
        pathPart("the bank path upstream", { stone: 4 }, 500),
        pathPart("stones through the reeds", { stone: 4 }, 500),
        pathPart("lantern posts along the creek", { branch: 3, stone: 1 }, 400),
        pathPart("the climb to the head of the valley", { stone: 5 }, 600, { heavy: !0 }),
        pathPart("the gate stones", { stone: 4 }, 600, { heavy: !0 }),
        pathPart("the last lantern", { branch: 2, clay: 1 }, 400),
      ],
    },
  ],
};

function returningOf(w) {
  return w.returning || (w.returning = { path: null, pathSid: null, pathStarted: null, pathDone: null, parts: 0, lastPart: null, count: 0, fishRuns: 0, lastYear: 0, active: null, lanterns: 0, passingsAt: null, verses: [], verseCount: 0, first: null, last: null });
}

// ---------------------------------------------------------------------------
// The 3C hooks
// ---------------------------------------------------------------------------

// Every life tick (600 s), from lifeTick in life.js.
function lifeTick3C(w) {
  beaverLifeTick(w);
  skycalTick(w);
  returningTick(w);
}

// Things creekfolk may choose to do (gift.js beliefOptions).
function lifeOptions3C(w, c) {
  let out = [],
    r = returningOption(w, c);
  if (r) out.push(["returning", r]);
  let s = skycalOption(w, c);
  if (s) out.push(["midwinter", s]);
  let b = beaverWatchOption(w, c);
  if (b) out.push(["beavers", b]);
  return out;
}

// A part of the sky stones or the path is done (temple.js greatPartDone).
function partDone3C(w, s, level, stage) {
  if (s.kind === "path") {
    let R = returningOf(w);
    R.parts = stage + 1;
    R.lastPart = Math.round(w.t);
    let st = STRUCTURES.path.levels[0].stages[stage];
    logEvent(w, 1, `They finished a stretch of the procession path: ${st.name}.`, [], s, "returning");
  }
}

function devTrigger3C(w, what) {
  if (what === "beavers") {
    if (w.beavers) return "the beavers are already here";
    return beaversArrive(w, true) ? "the beavers came" : "no pond for a lodge yet";
  }
  if (what === "skycal") {
    if (w.skycal) return w.skycal.done ? "the sky stones already stand" : "the sky stones are being built";
    skycalStart(w);
    return w.skycal ? "someone wants to mark the sunrise with stones" : "no place for the sky stones";
  }
  if (what === "returning") {
    let R = returningOf(w);
    if (!w.temple || w.temple.state !== "done") {
      // no temple: the fish run, tonight
      returningBegin(w, true, true);
      return "the fish run (no finished temple)";
    }
    returningPathFinish(w);
    returningBegin(w, false, true);
    return "the Returning, now";
  }
  if (what === "path") {
    if (!w.temple || w.temple.state !== "done") return "no finished temple";
    returningPathFinish(w);
    return "the procession path is laid";
  }
  return null;
}

// ---------------------------------------------------------------------------
// The procession path
// ---------------------------------------------------------------------------

// Points along the path: temple, the First Pool's bank, up the creek to the head of the valley.
function returningRoute(w) {
  let T = w.terrain,
    t = w.temple && w.byId[w.temple.sid],
    pts = [];
  if (!t) return pts;
  let pool = (w.placeNames || []).find((p) => p.kind === "pool"),
    gate = springGate(w),
    way = [{ x: t.x, z: t.z }];
  if (pool) {
    let i = creekNodeIndex(pool.z),
      n = w.creek.nodes[i],
      side = t.x < n.x ? -1 : 1;
    way.push({ x: n.x + side * (n.wb / 2 + 1.6), z: n.z });
  }
  // up the bank on the temple's side to the head of the valley
  let side = t.x < T.creekX(t.z) ? -1 : 1;
  for (let z = (pool ? pool.z : t.z) - 12; z > gate.z + 4; z -= 12) way.push({ x: T.creekX(z) + side * 5, z });
  way.push({ x: gate.x, z: gate.z });
  // sample every few metres, keeping to walkable ground where it can
  for (let k = 0; k < way.length - 1; k++) {
    let a = way[k],
      b = way[k + 1],
      d = dist2d(a.x, a.z, b.x, b.z),
      n = Math.max(1, Math.round(d / RETURNING.pathStep));
    for (let j = 0; j < n; j++) {
      let f = j / n,
        x = a.x + (b.x - a.x) * f,
        z = a.z + (b.z - a.z) * f;
      if (k === 0 && dist2d(x, z, t.x, t.z) < 6) continue; // the temple's own steps
      pts.push({ x: +x.toFixed(2), z: +z.toFixed(2) });
    }
  }
  pts.push({ x: +gate.x.toFixed(2), z: +gate.z.toFixed(2) });
  if (pts.length > 90) pts = pts.filter((p, i) => i % Math.ceil(pts.length / 90) === 0 || i === pts.length - 1);
  return pts;
}

// The pool behind the very first dam, named for ever (minds.js names it when it fills).
function returningPool(w) {
  let p = (w.placeNames || []).find((p) => p.kind === "pool");
  return p ? `${p.name}, the first pool they ever made` : "the first pool they ever made";
}

function returningPathFinish(w) {
  let R = returningOf(w);
  if (R.pathDone) return;
  returningPathStart(w);
  let s = w.byId[R.pathSid];
  if (s) {
    s.level = 1;
    s.building = null;
    R.parts = RETURNING.pathParts;
  }
  R.pathDone = Math.round(w.t);
}

function returningPathStart(w) {
  let R = returningOf(w);
  if (R.pathSid) return;
  let pts = returningRoute(w);
  if (pts.length < 2) return;
  R.path = pts;
  let at = pts[Math.min(pts.length - 1, 2)],
    s = register(w, {
      id: w.nextId++,
      kind: "path",
      x: at.x,
      z: at.z,
      rot: 0,
      owner: null,
      founder: null,
      level: 0,
      t: Math.round(w.t),
      building: { level: 0, stage: 0, delivered: {}, labor: 0, cureLeft: 0, cureUntil: null, started: w.t, by: null, locked: !1 },
      contrib: {},
      spare: {},
    });
  w.structures.push(s);
  R.pathSid = s.id;
  R.pathStarted = Math.round(w.t);
  R.lastPart = Math.round(w.t);
  logEvent(w, 3, `With the temple finished, the creekfolk have begun a path for a procession: from the temple, past ${returningPool(w)}, up the creek to where the way to the Spring begins. They say it will take three years, a stretch each season.`, [], s, "returning");
}

// ---------------------------------------------------------------------------
// Midwinter: the Returning
// ---------------------------------------------------------------------------

// When this year's midwinter morning is (seconds), and the festival's span.
function returningWindow(w, t = w.t) {
  let d = daysToMidwinter(w, t),
    dawn = t + d * VALLEY_DAY;
  // within a valley day after midwinter morning, it's still this one
  if (d > YEAR_DAYS - 1.05) dawn = t - (YEAR_DAYS - d) * VALLEY_DAY;
  return { dawn: Math.round(dawn), start: Math.round(dawn - 0.12 * VALLEY_DAY), end: Math.round(dawn + 1.0 * VALLEY_DAY) };
}

function returningActive(w) {
  return !!(w.returning && w.returning.active && !w.returning.active.fishOnly);
}

// Seconds until the next Returning begins (null if there won't be one yet).
function returningNext(w) {
  let R = w.returning;
  if (!R) return null;
  let canFestival = R.pathDone || (R.pathSid && R.parts >= RETURNING.pathParts - 1);
  if (!canFestival) return null;
  let win = returningWindow(w);
  if (w.t < win.start) return win.start - w.t;
  return win.start + YEAR_DAYS * VALLEY_DAY - w.t;
}

function returningTick(w) {
  let R = w.returning;
  // the path begins when the temple is done
  if (w.temple && w.temple.state === "done") {
    R = returningOf(w);
    if (!R.pathSid) returningPathStart(w);
    let s = R.pathSid && w.byId[R.pathSid];
    if (s && s.building && s.building.locked && w.t - (R.lastPart || 0) >= RETURNING.partGap) s.building.locked = !1;
    if (s && !s.building && s.level >= 1 && !R.pathDone) {
      R.pathDone = Math.round(w.t);
      logEvent(w, 3, "The procession path is finished, from the temple steps to the head of the valley, with lanterns along the way. At midwinter, they say, the creek's children come home.", [], s, "returning");
    }
  }
  // midwinter
  let win = returningWindow(w),
    yr = seasonAt(w, win.dawn).year;
  R = w.returning;
  if (R && R.active) {
    if (w.t >= R.active.end) returningEnd(w);
    else returningPhase(w);
    return;
  }
  if (w.t < win.start || w.t >= win.end) return;
  if (R && R.lastYear === yr) return;
  if (R && R.pathDone) returningBegin(w, false);
  else if (!w.temple) {
    // a valley with no temple (it never reached the giving threshold); a valley building
    // one waits for its first Returning to see the fish
    let dr = creekDriest(w);
    if (dr && dr.wet >= RETURNING.healed) returningBegin(w, true);
  }
}

function returningBegin(w, fishOnly, dev = false) {
  let R = returningOf(w),
    win = returningWindow(w);
  if (dev) win = { dawn: Math.round(w.t + 0.12 * VALLEY_DAY), start: Math.round(w.t), end: Math.round(w.t + 1.12 * VALLEY_DAY) };
  let dusk = win.dawn;
  while (!isNight(dusk) && dusk < win.end) dusk += 60;
  R.active = { fishOnly: !!fishOnly, start: win.start, dawn: win.dawn, dusk, end: win.end, phase: "dawn", n: fishOnly ? R.fishRuns + 1 : R.count + 1 };
  R.lastYear = seasonAt(w, win.dawn).year;
  if (fishOnly) return;
  R.count++;
  if (!R.first) R.first = Math.round(w.t);
  R.last = Math.round(w.t);
  let first = R.count === 1,
    t = w.temple && w.byId[w.temple.sid];
  logEvent(w, 3, first ? "It is midwinter morning, and the whole village is on the temple steps in the dark, waiting. This is the first Returning." : `It is midwinter, and the creekfolk are on the temple steps before dawn for the Returning${R.count > 2 ? ", as they are every year" : ""}.`, [], t || null, "returning");
}

// Things that happen as the festival goes on (one log line each).
function returningPhase(w) {
  let R = w.returning,
    A = R.active,
    t = w.temple && w.byId[w.temple.sid];
  if (A.fishOnly) {
    if (A.phase !== "night" && w.t >= A.dusk) {
      A.phase = "night";
      R.fishRuns++;
      logEvent(w, R.fishRuns === 1 ? 3 : 2, R.fishRuns === 1 ? `On midwinter night, fish that glowed softly like coals swam up the creek, past every pond, on up toward the old valley. ${oldStoryHeld(w, "ov-fish") ? "It was just as the stories of the old valley said." : "Nobody had ever seen it before."}` : "On midwinter night the glowing fish swam up the creek toward the old valley again.", [], null, "returning"); // CF2: the fish run swims up toward the old valley, as the old stories say (Creekfolk 1: "to the spring", "Nobody had ever seen it before")
      if (R.fishRuns === 1) newStory(w, "fishrun", {}, null, 2, w.creatures.filter((c) => !c.visitor && !c.asleep));
    }
    return;
  }
  if (A.phase === "dawn" && w.t >= A.dawn + 0.05 * VALLEY_DAY) {
    A.phase = "day";
    logEvent(w, 3, "The sun came up through the crown, and the water running down the temple steps turned to gold. Nobody said anything for a long time.", [], t || null, "returning");
  } else if (A.phase === "day" && w.t >= A.dawn + 0.15 * VALLEY_DAY && !A.walked) {
    A.walked = 1;
    logEvent(w, 2, `The procession set out from the temple: down past ${returningPool(w)} and up the creek to the head of the valley, and on to the Spring.`, [], t || null, "returning");
  } else if (A.phase === "day" && w.t >= A.dusk) {
    A.phase = "night";
    let first = R.count === 1;
    logEvent(w, 3, `That night the fish came: a run of softly glowing fish swimming up the healed creek, all the way to the spring. The creekfolk lined the channels with lanterns. ${w.beavers ? "The beavers were out, and the fireflies too." : "The fireflies were out too."}`, [], null, "returning");
    if (first) newStory(w, "returning", {}, t || null, 3, w.creatures.filter((c) => !c.visitor));
  }
}

function returningEnd(w) {
  let R = w.returning,
    A = R.active;
  R.active = null;
  if (A.fishOnly) return;
  // what this Returning adds
  let passed = R.passingsAt == null ? 0 : Math.max(0, (w.stats.passings || 0) - R.passingsAt);
  if (R.passingsAt == null) {
    // the first: everyone who passed since the temple was finished
    let since = w.temple && w.temple.done ? w.temple.done : 0;
    passed = Object.values(w.lineage || {}).filter((r) => r.died && r.died >= since).length;
  }
  R.passingsAt = w.stats.passings || 0;
  R.lanterns += passed;
  let t = w.temple && w.byId[w.temple.sid];
  if (t && w.temple) carveStory(w, t, w.temple);
  let verse = returningVerse(w, R);
  if (verse) {
    R.verses.push({ n: R.count, text: verse, t: Math.round(w.t) });
    R.verseCount++;
    if (R.verses.length > RETURNING.verses) R.verses.shift();
  }
  logEvent(w, 3, `The Returning is over.${passed ? ` They hung ${passed === 1 ? "a new lantern" : numberWord(passed) + " new lanterns"} on the pyramid, ${passed === 1 ? "for the one" : "one for each creekfolk"} who passed since the last.` : ""}${verse ? ` Their song has a new verse: ${verse}` : ""}`, [], t || null, "returning");
}

// A new verse: the story most of them tell from this year, or those who passed.
function returningVerse(w, R) {
  let since = R.last ? R.last - YEAR_DAYS * VALLEY_DAY : 0,
    tell = {};
  for (let c of w.creatures) if (!c.visitor) for (let k in c.lore || {}) tell[k] = (tell[k] || 0) + 1;
  let best = null;
  for (let k in tell) {
    let s = w.stories[k];
    if (!s || s.t < since || s.kind === "returning" || s.kind === "fishrun") continue;
    let sc = tell[k] * (s.weight || 1);
    if (!best || sc > best.sc) best = { s, sc };
  }
  if (best) return `"${cap(shortAbout(w, best.s))}."`;
  let names = Object.values(w.lineage || {}).filter((r) => r.died && r.died >= since).slice(-3).map((r) => r.name);
  return names.length ? `"For ${names.join(" and ")}."` : null;
}

function cap(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

// What creekfolk do during the Returning.
function returningOption(w, c) {
  let R = w.returning,
    A = R && R.active;
  if (!A || c.visitor) return null;
  if (c.needs.energy < 0.12 || c.needs.food < 0.1) return null;
  let t = w.temple && w.byId[w.temple.sid];
  if (A.fishOnly) {
    if (w.t < A.dusk || c.needs.energy < 0.3) return null;
    let p = returningBank(w, c);
    return p && { score: 0.9 + 0.5 * c.temp.curiosity, plan: { goal: "fish", steps: [{ do: "walk", x: p.x, z: p.z, near: 0.6 }, { do: "watchfish", dur: w.rng.range(240, 600), lx: p.lx, lz: p.lz }] } };
  }
  if (!t) return null;
  // dawn: on the temple steps, facing the sunrise through the crown
  if (w.t < A.dawn + 0.12 * VALLEY_DAY) {
    let a = w.rng.range(-0.9, 0.9),
      r = w.rng.range(5.5, 8.5),
      x = t.x - Math.cos(SUNRISE_DIR + a) * r,
      z = t.z - Math.sin(SUNRISE_DIR + a) * r;
    if (!w.terrain.walkable(x, z)) (x = t.x - Math.cos(SUNRISE_DIR) * 6), (z = t.z - Math.sin(SUNRISE_DIR) * 6);
    return { score: 2.6, plan: { goal: "returning", steps: [{ do: "walk", x, z, near: 0.8 }, { do: "watchsunrise", dur: w.rng.range(120, 260), lx: t.x + Math.cos(SUNRISE_DIR) * 30, lz: t.z + Math.sin(SUNRISE_DIR) * 30 }] } };
  }
  // by day: the procession up the path (the old and the small turn back at the First Pool)
  if (w.t < A.dusk - 0.06 * VALLEY_DAY) {
    if (c.counts.returnWalk === A.n) return null; // already walked it this year
    let pts = R.path || [];
    if (pts.length < 2) return null;
    let far = c.stage === "adult",
      end = far ? pts.length - 1 : Math.min(pts.length - 1, Math.round(pts.length * 0.35)),
      steps = [];
    for (let k = 0; k <= end; k += Math.max(1, Math.floor(end / 6))) steps.push({ do: "walk", x: pts[k].x, z: pts[k].z, near: 1.2 });
    steps.push({ do: "walk", x: pts[end].x, z: pts[end].z, near: 0.8 });
    steps.push({ do: far ? "pilgrim" : "watchsunrise", dur: far ? 0.12 * VALLEY_DAY : w.rng.range(120, 240), lx: pts[end].x, lz: pts[end].z - 10, n: A.n });
    return { score: 2.4, plan: { goal: "returning", steps } };
  }
  // night: a lantern by the water, then the fish
  let p = returningBank(w, c);
  if (!p) return null;
  return { score: 2.5, plan: { goal: "returning", steps: [{ do: "walk", x: p.x, z: p.z, near: 0.6 }, { do: "watchfish", dur: w.rng.range(300, 700), lx: p.lx, lz: p.lz, lantern: 1 }] } };
}

// A place on the bank to set a lantern and watch the water.
function returningBank(w, c) {
  let cr = w.creek,
    T = w.terrain;
  for (let k = 0; k < 20; k++) {
    let i = w.rng.int(Math.max(0, creekNodeIndex(c.z) - 15), Math.min(cr.nodes.length - 1, creekNodeIndex(c.z) + 15)),
      n = cr.nodes[i];
    if (n.z < 1 || n.z > VL - 1) continue;
    let side = w.rng.chance(0.5) ? -1 : 1,
      x = n.x + side * (n.wb / 2 + w.rng.range(0.8, 2.2));
    if (!T.walkable(x, n.z)) continue;
    return { x, z: n.z, lx: n.x, lz: n.z };
  }
  return null;
}

ACTIONS.pilgrim = {
  start(w, c, step) {
    c.counts.returnWalk = step.n;
    let at = springAt(w);
    return makeAct(w, c, "away", step.dur || 0.12 * getDayLength(), { lookX: at.x, lookZ: at.z });
  },
  end(w, c) {
    c.needs.food = Math.max(c.needs.food, 0.4);
    c.needs.social = clamp(c.needs.social + 0.2, 0, 1);
    feel(c, w, "joy", 0.35);
    if (!(c.counts.pilgrim > 0)) remember(w, c, "returning", "We walked the path all the way to the Spring at midwinter, singing.", 0.75);
    c.counts.pilgrim = (c.counts.pilgrim || 0) + 1;
    return true;
  },
};

ACTIONS.watchfish = {
  start(w, c, step) {
    return makeAct(w, c, "watch", step.dur || 300, { lookX: step.lx, lookZ: step.lz });
  },
  end(w, c) {
    c.needs.fun = clamp(c.needs.fun + 0.3, 0, 1);
    c.needs.social = clamp(c.needs.social + 0.1, 0, 1);
    feel(c, w, "joy", 0.45);
    if (!(c.counts.fishrun > 0)) remember(w, c, "returning", "The fish came up the creek glowing, all of them, on up toward the old valley. I sat on the bank and watched them go by.", 0.85); // CF2: toward the old valley, and no lanterns without the festival
    c.counts.fishrun = (c.counts.fishrun || 0) + 1;
    return true;
  },
};

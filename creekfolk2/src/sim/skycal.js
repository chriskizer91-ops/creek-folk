// Phase 3C: the sky calendar that finds their midwinter.
//
// After their first midwinter, someone who has been watching the sunrise notices that the
// sun comes up further along the hills each morning, stops, and turns back. They want to
// mark it. The village sets up the sky stones on the terrace: a sighting stone and a fan of
// markers to the east, the tallest where the midwinter sun comes up. Once it stands they
// can say how long it is until midwinter, and they meet there at dawn on midwinter morning.
// Target: usually finished before their second midwinter (about real day 15).

var SKYCAL = {
  startAfter: 0.4, // valley days after the first midwinter morning
  radius: 2.6,
};

var skycalPart = (name, mats, labor, o = {}) => stageDef(name, mats, labor, o);
STRUCTURES.skycal = {
  label: "sky stones",
  concept: "skycal",
  radius: 2.6,
  great: "skycal",
  levels: [
    {
      name: "sky stones",
      label: "sky stones",
      // the markers are set on the mornings the sun comes up behind them (doy: day of
      // their year), so the stones go up as the year turns: done by about real day 13
      stages: [
        skycalPart("sighting stone", { stone: 3 }, 400, { heavy: !0 }),
        skycalPart("midwinter stone", { stone: 4 }, 600, { heavy: !0 }),
        skycalPart("spring marker", { stone: 2 }, 300, { heavy: !0, doy: 24 }),
        skycalPart("midsummer marker", { stone: 2 }, 300, { heavy: !0, doy: 72 }),
        skycalPart("autumn marker", { stone: 2 }, 300, { heavy: !0, doy: 120 }),
        skycalPart("ring of pebbles", { stone: 3 }, 300),
      ],
    },
  ],
};
var SKYCAL_TEXT = { name: "sky stones", the: "the sky stones" };

function skycalOf(w) {
  return w.skycal || null;
}

// Every life tick (from lifeTick3C).
function skycalTick(w) {
  let K = w.skycal;
  if (!K) {
    // their first midwinter morning has passed
    let days = valleyDays(w);
    if (days < MIDWINTER_DOY + 0.22 + SKYCAL.startAfter) return;
    skycalStart(w);
    return;
  }
  if (K.done) return;
  let s = w.byId[K.sid];
  if (!s) return;
  if (s.building && s.building.locked) {
    // the next stone, as soon as the last is set; a marker waits for its sunrise
    let st = STRUCTURES.skycal.levels[0].stages[s.building.stage],
      doy = seasonAt(w).doy,
      off = st && st.doy != null ? (((doy - st.doy) % YEAR_DAYS) + YEAR_DAYS) % YEAR_DAYS : 0;
    if (!st || st.doy == null || off < 6) {
      s.building.locked = !1;
      if (st && st.doy != null) logEvent(w, 2, `This morning the sun came up in a new place over the hills, and the creekfolk set the ${st.name} where it rose.`, [], s, "skycal");
    }
  }
  if (!s.building && s.level >= STRUCTURES.skycal.levels.length) skycalDone(w, K, s);
}

function skycalStart(w) {
  let alive = w.creatures.filter((c) => !c.visitor && c.stage !== "child");
  if (!alive.length) return;
  let by = alive.slice().sort((a, b) => b.temp.curiosity + (b.stage === "elder" ? 0.3 : 0) - (a.temp.curiosity + (a.stage === "elder" ? 0.3 : 0)))[0],
    at = skycalSite(w);
  if (!at) return;
  let s = register(w, {
    id: w.nextId++,
    kind: "skycal",
    x: +at.x.toFixed(2),
    z: +at.z.toFixed(2),
    rot: +SUNRISE_DIR.toFixed(3),
    owner: null,
    founder: by.id,
    level: 0,
    t: Math.round(w.t),
    building: { level: 0, stage: 0, delivered: {}, labor: 0, cureLeft: 0, cureUntil: null, started: w.t, by: by.id, locked: !1 },
    contrib: {},
    spare: {},
  });
  w.structures.push(s);
  w.skycal = { sid: s.id, by: by.id, started: Math.round(w.t), done: null, gatherings: 0 };
  logEvent(w, 3, `${by.name} has been watching where the sun comes up over the hills. All year it came up further along every morning, then stopped at midwinter and turned back. ${by.name} wants to mark the place with stones, so they'll always know when midwinter is coming.`, [by.id], s, "skycal");
  remember(w, by, "idea", "The sun comes up in a different place every morning, and turns back at midwinter. We could mark it with stones.", 0.8);
}

// Open ground on the terrace near the village, with nothing standing to the east.
function skycalSite(w) {
  let T = w.terrain,
    near = villageCentre(w);
  for (let i = 0; i < 400; i++) {
    let p = T.randomPoint(w.rng, { near: { x: near.x, z: near.z, r: (8 + i / 8) * CF2_SCALE.build }, offFloor: true, minEdge: 3 }); // CF2: the village at real scale
    if (!p || !siteFor(w, p.x, p.z, i < 250 ? SKYCAL.radius + 1 : SKYCAL.radius, "skycal")) continue;
    return p;
  }
  return null;
}

function skycalDone(w, K, s) {
  K.done = Math.round(w.t);
  let by = w.byId[K.by];
  logEvent(w, 3, `From the sighting stone, the midwinter sun will come up right over the tallest of the sky stones. Now they can always tell how long it is until midwinter.`, by ? [by.id] : [], s, "skycal");
  newStory(w, "skycal", { who: by ? by.name : null }, s, 2, w.creatures.filter((c) => !c.visitor && dist2d(c.x, c.z, s.x, s.z) < 30 * CF2_SCALE.see)); // CF2: they see further
  if (!(w.placeNames || []).some((p) => p.kind === "skycal")) namePlace(w, "the Sky Stones", s, "skycal", 3, by || null);
}

// The parts of the sky stones that are done (for the view).
function skycalParts(w) {
  let K = w.skycal,
    s = K && w.byId[K.sid];
  if (!s) return 0;
  if (!s.building) return s.level >= 1 ? STRUCTURES.skycal.levels[0].stages.length : 0;
  return s.building.stage;
}

// Valley days until midwinter morning, if they can tell (the sky stones stand).
function skycalDaysToMidwinter(w) {
  return w.skycal && w.skycal.done ? daysToMidwinter(w) : null;
}

// Midwinter morning: they meet at the sky stones at dawn (when there's no Returning).
function skycalOption(w, c) {
  let K = w.skycal;
  if (!K || !K.done || c.visitor) return null;
  let d = daysToMidwinter(w);
  // from a little before dawn to a little after, on midwinter morning
  if (!(d > YEAR_DAYS - 0.12 || d < 0.08)) return null;
  if (typeof returningActive === "function" && returningActive(w)) return null; // the Returning has its own dawn
  let s = w.byId[K.sid];
  if (!s) return null;
  let a = w.rng.range(0, 6.28),
    r = w.rng.range(1.6, 3),
    x = s.x + (-Math.cos(SUNRISE_DIR) * 1.2 + Math.cos(a) * r * 0.5) * CF2_SCALE.build, // CF2: the stones at real scale
    z = s.z + (-Math.sin(SUNRISE_DIR) * 1.2 + Math.sin(a) * r * 0.5) * CF2_SCALE.build; // CF2
  if (!w.terrain.walkable(x, z)) (x = s.x - 2 * CF2_SCALE.build), (z = s.z); // CF2
  return { score: 1.6 + 0.3 * c.temp.curiosity, plan: { goal: "midwinter", steps: [{ do: "walk", x, z, near: 0.6 }, { do: "watchsunrise", dur: w.rng.range(150, 300), lx: s.x + Math.cos(SUNRISE_DIR) * 30, lz: s.z + Math.sin(SUNRISE_DIR) * 30 }] } };
}

ACTIONS.watchsunrise = {
  start(w, c, step) {
    if (step.n) c.counts.returnWalk = step.n; // the Returning's walk, done for this year
    return makeAct(w, c, "watch", step.dur || 200, { lookX: step.lx, lookZ: step.lz });
  },
  end(w, c) {
    c.needs.fun = clamp(c.needs.fun + 0.15, 0, 1);
    c.needs.social = clamp(c.needs.social + 0.15, 0, 1);
    feel(c, w, "joy", 0.3);
    let K = w.skycal;
    if (K && K.done && w.t - (K.lastGather || -1e9) > 3 * VALLEY_DAY) {
      K.lastGather = Math.round(w.t);
      K.gatherings = (K.gatherings || 0) + 1;
      if (!w.returning || !w.returning.count) logEvent(w, 2, "On midwinter morning the creekfolk met at the sky stones to watch the sun come up over the tallest marker.", [c.id], c, "skycal");
    }
    if (!(c.counts.midwinter > 0)) remember(w, c, "nature", "At midwinter the sun came up right over the tallest of the sky stones, just as they said it would.", 0.6);
    c.counts.midwinter = (c.counts.midwinter || 0) + 1;
    return true;
  },
};

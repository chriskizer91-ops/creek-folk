// ==========================================================================
// Connecting the calendar and lives to the original world.
// ==========================================================================

// A new valley: five founders, young adults of different ages, on the real calendar.
//   opts.calStart  epoch ms when the valley begins (the real "now")
//   opts.tzMin     the player's time-zone offset in minutes (Date#getTimezoneOffset)
function newValley(seed, opts = {}) {
  let w = createWorld(seed, LIFE.founders);
  w.calStart = opts.calStart ?? 0;
  w.tzMin = opts.tzMin ?? 0;
  w.cycle = { len: VALLEY_DAY, off: 0.27 };
  setDayCycle(w.cycle);
  LIFE.founderAges.forEach((age, k) => {
    let c = w.creatures[k];
    if (!c) return;
    initLife(w, c, -Math.round(age * DAY_S), { gen: 0 });
    c.founder = true;
  });
  w.lifeV = 1;
  w.season = seasonAt(w).name;
  schedule(w, LIFE.tick, "L");
  storyFounding(w); // MINDS: everyone remembers waking up
  return w;
}

// Bring any saved world up to date (also used for valleys saved by the first Creekfolk).
function upgradeWorld(w) {
  if (!w.lifeV) {
    // An old valley: its creatures become founders of different adult ages.
    w.calStart = w.calStart ?? (w.realStart != null ? w.realStart : 0);
    w.tzMin = w.tzMin ?? 0;
    w.creatures.forEach((c, k) => {
      let age = LIFE.founderAges[k % LIFE.founderAges.length];
      initLife(w, c, Math.round(w.t - age * DAY_S), { gen: 0 });
      c.founder = true;
    });
    w.lifeV = 1;
    w.season = seasonAt(w).name;
    schedule(w, w.t + LIFE.tick, "L");
  }
  w.cycle = { len: VALLEY_DAY, off: (w.cycle && w.cycle.off) ?? 0.27 };
  setDayCycle(w.cycle);
  for (let c of w.creatures) c.stage = stageOf(w, c);
  if (!w.stories) storyFounding(w); // MINDS: a valley from before stories
  return w;
}

// ---- developer triggers (the dev build's "make it happen now" buttons) -----
// These change the valley outside its own course of events, so they are only
// offered by the developer menu.
function devTrigger(w, what) {
  let alive = w.creatures.filter((c) => !c.visitor);
  if (what === "storm") {
    let e = w.weather;
    e.cum = rainTotal(w, w.t);
    e.cumT = w.t;
    e.tok = (e.tok || 0) + 1;
    let was = e.state;
    e.state = "storm";
    e.rain = 1.6;
    e.since = w.t;
    e.until = w.t + 900;
    schedule(w, e.until, "R", 0, e.tok);
    if (was !== "storm") storyStorm(w);
    logEvent(w, 2, "A storm rolled in over the valley.", [], null, "weather");
    let T = creekStorm(w);
    return `storm (a ${T.toFixed(1)}-year flood)`;
  }
  if (what === "flood") {
    let T = creekStorm(w, 25);
    return `a ${T}-year flood`;
  }
  if (what === "birth") {
    let adults = alive.filter((c) => stageOf(w, c) === "adult"),
      pair = adults.map((c) => [c, c.partner && w.byId[c.partner]]).find(([c, p]) => p && stageOf(w, p) === "adult");
    if (!pair && adults.length >= 2) pair = [adults[0], adults.find((c) => c !== adults[0] && !(adults[0].parents || []).includes(c.id))];
    if (!pair || !pair[1]) return "no two grown-ups to be parents";
    bear(w, pair[0], pair[1]);
    return `a child for ${pair[0].name} and ${pair[1].name}`;
  }
  if (what === "passing") {
    let c = alive.filter((c) => !c.farewell).sort((a, b) => a.born - b.born)[0];
    if (!c) return "nobody";
    c.lifespan = Math.max(0, Math.round(w.t - c.born));
    return `${c.name}'s time has come`;
  }
  if (what === "visitor") return visits(w, true) === false ? "nobody has gone downstream yet" : "a visitor is coming up the creek";
  return "unknown";
}

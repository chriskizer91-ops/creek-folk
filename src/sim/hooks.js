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

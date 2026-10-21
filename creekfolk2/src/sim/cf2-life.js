// ==========================================================================
// Creekfolk 2: lives across one real month.
//
// Eight founders, fresh young adults who left the first valley, arrive together. Life
// stages follow the brief's suggestion (child to day 7, adult to about 27, wise elder to
// about 36). The founders arrive aged seven to eleven days, about half a day apart, and
// live closer to the usual span than their descendants do (LIFE.founderSpread), so they
// pass one by one through the founders' fourth week, the first at about day 25 and the
// last at about day 29 or 30 (the brief: 28 to 32).
// ==========================================================================

Object.assign(LIFE, {
  founders: 8,
  founderAges: [7.0, 7.55, 8.1, 8.65, 9.2, 9.75, 10.3, 10.85],
  elderDays: 27,
  lifespanDays: 36.5,
  pairBirthDays: 4.5, // a pair with room has a child about this often (Creekfolk 1: 6), so the eight are about thirty by day 30
  founderSpread: 0.2, // days: how much a founder's span varies (everyone else: lifespanSpread)
});

// The founders' spans, drawn again with their own spread, so they don't pass all at once.
var cf2LifeSpanValleyBase = newValley;
newValley = function (seed, opts) {
  let w = cf2LifeSpanValleyBase(seed, opts);
  for (let c of w.creatures)
    if (c.founder) c.lifespan = Math.round((LIFE.lifespanDays + clamp(w.rng.normal() * LIFE.founderSpread, -2 * LIFE.founderSpread, 2 * LIFE.founderSpread)) * DAY_S);
  return w;
};

// They came down the creek from the valley they were born in (Decision 6), rather than waking
// from nowhere as in Creekfolk 1: the first line of the valley's history says so, and so does
// the story they tell of it (which drifts the way every story does: the number, the cause, the
// grandeur). Wraps newValley (hooks.js) and storyText (minds.js); see docs/MERGE.md.
var cf2NewValleyBase = newValley;
newValley = function (seed, opts) {
  let w = cf2NewValleyBase(seed, opts),
    n = numberWord(w.creatures.length);
  for (let e of w.log) if (e.kind === "start") e.text = `${n[0].toUpperCase() + n.slice(1)} young creekfolk came down the creek from the valley they were born in, and woke in a meadow by a spring.`;
  return w;
};
var cf2StoryTextBase = storyText;
storyText = function (w, s, v) {
  if (!s || s.kind !== "founding") return cf2StoryTextBase(w, s, v);
  let big = v.big || 0,
    why = v.why === "giver" ? `, sent by ${giverName(w)}` : v.why === "creek" ? ", because the creek wished it" : v.why === "elders" ? ", as the elders had said it would" : "";
  return `The first ${numberWord(v.n)} came down the creek from the old valley and woke in the meadow by the spring${why}${big ? (big >= 2 ? ", after a journey of a hundred days" : ", on the brightest morning there ever was") : ""}.`;
};

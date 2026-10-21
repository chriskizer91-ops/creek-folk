// ==========================================================================
// Creekfolk 2: lives across one real month.
//
// Eight founders, fresh young adults who left the first valley, arrive together. Life
// stages follow the brief's suggestion (child to day 7, adult to about 27, wise elder to
// about 36), so founders who arrive aged seven to nine and a half days pass in the
// founders' fourth week. Phase 2 tunes this so the last founder passes at about day 30.
// ==========================================================================

Object.assign(LIFE, {
  founders: 8,
  founderAges: [7.4, 7.7, 8.0, 8.3, 8.6, 8.9, 9.2, 9.5],
  elderDays: 27,
  lifespanDays: 36,
});

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

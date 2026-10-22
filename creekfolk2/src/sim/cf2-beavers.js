// ==========================================================================
// Creekfolk 2: the beavers come in week 4.
//
// Creekfolk 1's beavers (beavers.js, 3C) come in month 5 or later, once the floor stays wet
// through the dry season. In Creekfolk 2 the creek heals in the founders' month, and the
// beavers are its sign: they come in week 4, before the last founder passes (the brief).
//   - When. From day 22, once the floor stayed at least half wet at the driest point of the
//     year (recorded at the first winter rains, so day 22's record is the first that counts),
//     a young pair comes up the creek looking for a pond of its own. Young beavers leave home
//     in spring, so they come in the spring that follows (days 24 to 26), on a night of their
//     own choosing; after that spring, any night; and by day 28 whatever the creek. They come
//     in the night and are found at first light, as their line in the history says ("By
//     morning they had begun a lodge"): whoever is up and nearest the pond finds the lodge,
//     so the story of their coming has a witness. A pair that comes in spring has its first
//     kits the next spring.
//   - What they take over. Beavers mend a dam once it starts to wear (beavers.js: below 0.75)
//     and build up the silted ones, any time of year. Once they live in the valley, the
//     creekfolk leave the dams to them: they mend one only when it is badly worn (the beavers
//     have let it go, `CF2_BEAVER.leaveBelow`), and build up a silted one only where it would
//     leak unless a stone apron is laid below it first (beavers don't lay stones). New dams
//     and new levels are still the creekfolk's. So after the beavers come, the creekfolk spend
//     much less of their time on the dams (tools/longrun.cjs measures it).
// The beavers' lodge in the deepest pond, their kits (up to BEAVER.max), and their little side
// dams across the floor are 3C's; cf2-scale.js scales the side dams to the wider floor.
// Wraps beaverArrivalCheck and beaversArrive (beavers.js) and bestWork (core.js); sets
// BEAVER.earliestDay, driest and latestDay. See docs/MERGE.md.
// ==========================================================================

var CF2_BEAVER = {
  anyDay: 26, // after the spring that follows the creek being ready, they come any night
  dawnChance: 0.08, // chance that a given night was the night (checked once a valley day, at first light): about half a real day
  leaveBelow: 0.3, // with beavers in the valley, creekfolk mend only a dam worn below this
};

Object.assign(BEAVER, {
  earliestDay: 22, // not before week 4 (Creekfolk 1: 120) ...
  driest: 0.5, // ... and once half the floor stayed wet at the driest point (Creekfolk 1: 0.55) ...
  latestDay: 28, // ... and by day 28 whatever the creek (Creekfolk 1: 210)
});

// Every life tick (from beaverLifeTick): did the beavers come in the night? Looked at once a
// valley day, at the first life check after dawn, while someone is up to find them.
var cf2BeaverArrivalBase = beaverArrivalCheck;
beaverArrivalCheck = function (w) {
  if (w.beavers || !w.creek) return;
  let day = w.t / 86400;
  if (day < BEAVER.earliestDay || isNight(w.t) || !isNight(w.t - LIFE.tick)) return;
  if (!w.creatures.some((c) => !c.visitor && !c.asleep)) return;
  if (day < BEAVER.latestDay) {
    let dr = creekDriest(w);
    if (!(dr && dr.wet >= BEAVER.driest)) return;
    if (seasonAt(w).name !== "spring" && day < CF2_BEAVER.anyDay) return;
    if (!w.rng.chance(CF2_BEAVER.dawnChance)) return;
  }
  cf2BeaverArrivalBase(w);
};

// After they come: if nobody was near the pond to see the lodge begun, whoever is up and
// nearest it finds it that morning (the story of their coming has a witness, and the lodge's
// name a speaker). A pair that comes in spring is young: their first kits come the next spring.
var cf2BeaversArriveBase = beaversArrive;
beaversArrive = function (w, dev = false) {
  let B = cf2BeaversArriveBase(w, dev);
  if (!B) return B;
  let s = seasonAt(w);
  if (s.name === "spring") B.kitsYear = s.year;
  let st = w.stories && w.stories[w.storySeq],
    L = B.lodge;
  if (st && st.kind === "beavers" && !w.creatures.some((c) => c.lore && c.lore[st.id])) {
    let f = null,
      fd = 1e9;
    for (let c of w.creatures) {
      if (c.visitor || c.asleep) continue;
      let d = dist2d(c.x, c.z, L.x, L.z);
      if (d < fd) (fd = d), (f = c);
    }
    if (f) {
      learnStory(w, f, st, { ...st.truth }, 1, null, true);
      remember(w, f, "nature", "I found a beaver lodge in the pond this morning! Beavers have come to live in our ponds. They work the water the way we do.", 0.8);
      wordFor(w, f, "beaver");
      let p = (w.placeNames || []).find((p) => p.kind === "lodge");
      if (p) wordFor(w, f, "place:" + p.id);
    }
  }
  return B;
};

// Would the beavers see to this dam (so the creekfolk leave it to them)?
function cf2BeaversKeep(w, s) {
  if ((s.cond ?? 1) < CF2_BEAVER.leaveBelow) return false; // badly worn: the creekfolk step in
  if (s.raise && !creekSafeToRaise(w, s, CREEK.raiseStep)) return false; // it needs a stone apron below it first
  return true;
}

// The creekfolk's work (core.js bestWork): with grown beavers in the valley, the dams they
// see to are passed over, as dams a beaver is already mending are (`s.beaver`). The mark is
// set only for this one choice and put back as it was, so nothing is saved.
var cf2BestWorkBase = bestWork;
bestWork = function (i, t, e = !1) {
  let B = i.beavers;
  if (e || !B || !B.list.some((b) => b.age !== "kit")) return cf2BestWorkBase(i, t, e);
  let left = [];
  for (let s of i.structures) if (s.kind === "dam" && !s.beaver && s.level > 0 && !s.building && cf2BeaversKeep(i, s)) left.push([s, s.beaver]), (s.beaver = -1);
  try {
    return cf2BestWorkBase(i, t, e);
  } finally {
    for (let [s, was] of left) if (was === undefined) delete s.beaver;
    else s.beaver = was;
  }
};

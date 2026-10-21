// ==========================================================================
// Creekfolk 2: what the founders bring from the old valley.
//
// Creekfolk 1's founders woke knowing nothing and had to discover, one by one, that mud
// dries hard, that seeds grow, that a dam holds water, and (an elder working out why a
// high dam leaks) that dams must be built from the bottom of the creek up. Creekfolk 2's
// eight founders grew up in that valley and left it together, so:
//   - the craft: they arrive knowing what Creekfolk 1's creekfolk discovered for dams and
//     building (CF2_CRAFT.know). It is held the same way as anything learned here
//     (creature.know), taught to children the usual way, and lost if no one learns it.
//     Its time is CF2_CRAFT.oldValley (before the valley began), so it reads "knew it
//     from the old valley". This creek still has lessons of its own: the sticky clay
//     across it, and the mushrooms that glow at night.
//   - a creek to heal: they start wanting to dam it (CF2_CRAFT.damWish), and start their
//     first dams once their first homes are up (CF2_CRAFT.damAfter levels built in the
//     valley, where Creekfolk 1 waits for 28), so the first dams go in within days.
//   - each other: a travelling party, not strangers. Everyone starts with some warmth,
//     familiarity and trust toward everyone else (from how well their temperaments suit,
//     CF2_CRAFT.bond), and the best-suited two pairs are already close friends. No couples:
//     those form here, as in Creekfolk 1 (the first within the first hour or so, after a
//     chat or two, since a founder over nine days old pairs with a good friend).
// Wraps newValley (hooks.js, after cf2-life.js's wrapper) and projectReason (core.js); see
// docs/MERGE.md.
// ==========================================================================

var CF2_CRAFT = {
  know: ["dams", "mud", "downstream", "tools", "planting"],
  oldValley: -1, // the time they learned it: before the valley began
  damAfter: 10, // levels built in the valley before the first dam (Creekfolk 1: 28)
  damWish: [0.55, 0.4], // starting wish for a dam: base, plus this times their love of water
  bond: {
    warmth: [0.08, 0.05], // party warmth: base, plus this times how well they suit (0..1); a settled
    //   grown-up pairs with a good friend from 0.15 (LIFE.friendWarmth), so not on arrival
    fam: 0.45, // familiarity
    told: 2, // things each has told the other, all true (trust)
    helped: 2, // times each has asked the other for help, and been helped
    accepted: 1, // invitations, accepted
  },
  friends: 2, // close friendships, between the best-suited pairs
  friendWarmth: 0.3, // (pairing takes 0.4: they can become couples here, not before)
};

function cf2FounderCraft(w) {
  let founders = w.creatures.filter((c) => c.founder),
    C = CF2_CRAFT;
  for (let c of founders) {
    for (let k of C.know) c.know[k] = C.oldValley;
    c.desire.dam = +(C.damWish[0] + C.damWish[1] * c.interests.water).toFixed(3);
  }
  // nothing they brought counts as a first discovery here
  for (let k of C.know) w.stats["know_" + k] = founders.length;
  // the travelling party
  let B = C.bond,
    pairs = [];
  for (let a of founders)
    for (let b of founders) {
      if (a === b) continue;
      let suit = clamp((affinity(a, b) + 0.35) / 1.3, 0, 1),
        r = relation(a, b);
      r.warmth = +(B.warmth[0] + B.warmth[1] * suit).toFixed(3);
      r.fam = B.fam;
      r.told = r.toldTrue = B.told;
      r.asked = r.helped = B.helped;
      r.inv = r.acc = B.accepted;
      r.lastT = 0;
      if (a.id < b.id) pairs.push([a, b, suit]);
    }
  pairs.sort((p, q) => q[2] - p[2] || p[0].id - q[0].id || p[1].id - q[1].id);
  let close = new Set(),
    made = 0;
  for (let [a, b] of pairs) {
    if (made >= C.friends) break;
    if (close.has(a.id) || close.has(b.id)) continue;
    close.add(a.id), close.add(b.id), made++;
    for (let [x, y] of [[a, b], [b, a]]) {
      let r = relation(x, y);
      r.warmth = C.friendWarmth;
      r.fam = Math.max(r.fam, 0.7);
    }
  }
  if (founders.length)
    logEvent(
      w,
      2,
      "They brought the old valley's craft with them: how to dam a creek with posts, woven willow and mud, from the bottom of the creek up, and how to make tools and grow seeds.",
      founders.map((c) => c.id),
      w.meadow,
      "discovery"
    );
}

var cf2CraftNewValleyBase = newValley;
newValley = function (seed, opts) {
  let w = cf2CraftNewValleyBase(seed, opts);
  cf2FounderCraft(w);
  return w;
};

// Founders who know dams start them once their first homes are up.
var cf2ProjectReasonBase = projectReason;
projectReason = function (i, t, e, n, s) {
  if (e === "dam" && n >= CF2_CRAFT.damAfter && n < 28) n = 28;
  return cf2ProjectReasonBase(i, t, e, n, s);
};

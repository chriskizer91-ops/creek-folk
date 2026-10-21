// Phase 3C: looks you can trace through families (fur colours, coat patterns, things to
// wear, the treasure a believer found). Owner: helper "looks". See docs/phase3c-plan.md.
//
// Saved on each creature's `look` (plain JSON, a few small fields, filled in lazily by
// looksOf so founders, travelers and creatures from older saves get them too):
//   fur    0..23, the fur colour (LOOKS_FUR). Neighbours in the list look alike.
//   pat    the coat: "none", "spots", "stripes", "saddle", "patches" (look.spots is kept
//          equal to pat === "spots", for the original code)
//   pale   1 when the coat pattern is pale (cream), 0 when it is a darker shade
//   face   "none", "mask", "blaze"
//   socks  1 when the paws are pale
//   dye    0..7, the colour of what they wear (LOOKS_DYES); it runs in families
//   wear   what they wear for their passion (LOOKS_WEAR, from `sig`), or null (children)
//   lv     the version of these fields
//
// Children (looksInherit, called from bear() in life.js) take their fur from one parent,
// sometimes a shade towards the other parent's fur or a neighbouring shade; each part of
// the coat comes whole from one parent or the other, now and then something new. So a
// line keeps its colour and its markings over many generations.
//
// Randomness here comes from a local Rng built from the valley's seed and the creature's
// id, never from world.rng, so looks don't shift the valley's own random stream.
// The treasure a believer wears is `c.treasure` (set by the pickgift action in gift.js).

var LOOKS = {
  v: 1,
  furBlend: 0.15, // a child's fur is one shade from one parent's towards the other's
  furDrift: 0.06, // ... or the next shade along the ring from the parent's, either way
  patNew: 0.06, // a coat pattern that neither parent has
  faceNew: 0.05, // a face marking that neither parent has
  socksNew: 0.05, // pale paws that neither parent has (or none when both have them)
  dyeNew: 0.1, // a family's colour for what they wear changes
};

// 24 fur colours [hue 0..360, saturation, lightness], in a ring: each looks like its
// neighbours, so children who are a shade off still look like their family. The
// last number is how common it is among founders and travelers.
var LOOKS_FUR = [
  [36, 0.38, 0.87, 1.0], //  0 cream
  [38, 0.4, 0.76, 1.2], //   1 sand
  [32, 0.55, 0.7, 1.2], //   2 wheat
  [40, 0.62, 0.62, 1.2], //  3 honey
  [46, 0.72, 0.56, 1.0], //  4 golden
  [34, 0.58, 0.48, 1.2], //  5 ochre
  [24, 0.64, 0.55, 1.2], //  6 ginger
  [16, 0.62, 0.5, 1.2], //   7 copper
  [10, 0.6, 0.45, 1.0], //   8 rust
  [12, 0.46, 0.37, 1.2], //  9 chestnut
  [22, 0.42, 0.34, 1.2], // 10 brown
  [24, 0.3, 0.27, 1.0], //  11 cocoa
  [30, 0.12, 0.32, 1.0], // 12 dusky
  [0, 0.0, 0.42, 1.0], //   13 grey
  [38, 0.15, 0.58, 1.2], // 14 taupe
  [210, 0.08, 0.72, 1.0], // 15 silver
  [212, 0.18, 0.5, 1.0], // 16 slate
  [214, 0.3, 0.62, 0.8], // 17 blue-grey
  [218, 0.45, 0.58, 0.6], // 18 blue
  [192, 0.45, 0.5, 0.6], // 19 teal
  [240, 0.32, 0.68, 0.5], // 20 periwinkle
  [272, 0.4, 0.66, 0.6], // 21 lavender
  [342, 0.58, 0.72, 0.6], // 22 pink
  [12, 0.52, 0.8, 0.8], //  23 blush
];
var LOOKS_FUR_NAMES = ["cream", "sandy", "wheat", "honey", "golden", "ochre", "ginger", "copper", "rust", "chestnut", "brown", "cocoa", "dusky", "grey", "taupe", "silver", "slate", "blue-grey", "blue", "teal", "periwinkle", "lavender", "pink", "blush"];

// Coat patterns and face markings, with how common each is among founders and travelers.
var LOOKS_PATTERNS = { none: 0.45, stripes: 0.2, saddle: 0.15, patches: 0.2 }; // spots: as the original look says
var LOOKS_FACES = { none: 0.6, mask: 0.2, blaze: 0.2 };

// What they wear for the thing they love most, once they are grown.
var LOOKS_WEAR = {
  water: "lilypad", // a lily-pad hat
  building: "apron", // a builder's apron
  growing: "sunhat", // a straw sun hat with a sprig
  collecting: "satchel", // a satchel for what they find
  sound: "bells", // ribbons and a little bell on the ears
  exploring: "scarf", // an explorer's scarf
  social: "flower", // a flower behind the ear
};
var LOOKS_WEAR_NAMES = { lilypad: "a lily-pad hat", apron: "a builder's apron", sunhat: "a straw sun hat", satchel: "a satchel", bells: "bells on their ears", scarf: "an explorer's scarf", flower: "a flower behind the ear" };

// Colours for what they wear (sRGB), dyed from what grows in the valley.
var LOOKS_DYES = [0xc2453a, 0xe08a2e, 0xe8c547, 0x5c9e4f, 0x3f86b8, 0x7d5bb0, 0xd86a9a, 0xf2efe6];

function looksRng(w, c, what = "look") {
  return new Rng(w.seed + ":" + what + ":" + c.id);
}

// The founders' and travelers' fur follows their hue, through the weights above, so a
// valley from before Phase 3C keeps its families' (blended) colours close together.
function looksFurFromHue(h) {
  let total = 0;
  for (let f of LOOKS_FUR) total += f[3];
  let x = ((((h || 0) % 1) + 1) % 1) * total;
  for (let k = 0; k < LOOKS_FUR.length; k++) if ((x -= LOOKS_FUR[k][3]) < 0) return k;
  return LOOKS_FUR.length - 1;
}

function looksPick(r, table) {
  let keys = Object.keys(table);
  return r.weighted(keys, (k) => table[k]);
}

// Fill in any missing look fields (founders, travelers, creatures from older saves).
// Everything comes from the seed, the id and the old look, so it is the same whenever
// and wherever it is first asked for.
function looksOf(w, c) {
  let l = c.look;
  if (l.lv === LOOKS.v) return l;
  let r = looksRng(w, c);
  if (l.fur == null) l.fur = looksFurFromHue(l.hue);
  if (l.pat == null) l.pat = l.spots ? "spots" : looksPick(r, LOOKS_PATTERNS);
  if (l.pale == null) l.pale = r.chance(0.5) ? 1 : 0;
  if (l.face == null) l.face = looksPick(r, LOOKS_FACES);
  if (l.socks == null) l.socks = r.chance(0.25) ? 1 : 0;
  if (l.dye == null) l.dye = r.int(0, LOOKS_DYES.length - 1);
  if (l.wear === undefined) l.wear = null;
  l.spots = l.pat === "spots";
  l.lv = LOOKS.v;
  return l;
}

// One step along the ring of fur colours from `a` towards `b`.
function looksFurToward(a, b) {
  let n = LOOKS_FUR.length,
    d = (((b - a) % n) + n) % n;
  if (d === 0) return a;
  return d <= n / 2 ? (a + 1) % n : (a - 1 + n) % n;
}

// A child's look, from its parents. Called from bear() in life.js, after the original
// blend (size, ears, eyes and so on still blend from both parents as before).
function looksInherit(w, c, a, b) {
  let la = looksOf(w, a),
    lb = looksOf(w, b),
    l = c.look,
    r = looksRng(w, c),
    one = () => (r.chance(0.5) ? la : lb);
  // Fur: from one parent; sometimes a shade towards the other, or a neighbouring shade.
  let from = r.chance(0.5) ? la : lb,
    other = from === la ? lb : la;
  l.fur = from.fur;
  if (r.chance(LOOKS.furBlend)) l.fur = looksFurToward(from.fur, other.fur);
  else if (r.chance(LOOKS.furDrift)) l.fur = (l.fur + (r.chance(0.5) ? 1 : LOOKS_FUR.length - 1)) % LOOKS_FUR.length;
  // The coat: the pattern and its shade come together from one parent.
  let p = one();
  l.pat = p.pat;
  l.pale = p.pale;
  if (r.chance(LOOKS.patNew)) {
    l.pat = r.pick(["spots", "stripes", "saddle", "patches"].filter((k) => k !== la.pat && k !== lb.pat));
    l.pale = r.chance(0.5) ? 1 : 0;
  }
  l.face = one().face;
  if (r.chance(LOOKS.faceNew)) l.face = r.pick(Object.keys(LOOKS_FACES).filter((k) => k !== la.face && k !== lb.face)) || l.face;
  l.socks = one().socks;
  if (r.chance(LOOKS.socksNew)) l.socks = 1 - l.socks;
  l.dye = one().dye;
  if (r.chance(LOOKS.dyeNew)) l.dye = r.int(0, LOOKS_DYES.length - 1);
  l.wear = null;
  l.spots = l.pat === "spots";
  l.lv = LOOKS.v;
}

// The thing they love most. Their interests can't say: play raises every interest it
// touches, and within a few days six of the seven sit at 1 for nearly everyone. So it is
// their signature passion (`sig`, which the game already uses for what they offer and
// what they want to build), else their strongest interest.
function looksPassion(c) {
  if (c.sig && LOOKS_WEAR[c.sig]) return c.sig;
  let best = null,
    bv = -1;
  for (let k of INTERESTS) {
    let v = (c.interests && c.interests[k]) || 0;
    if (v > bv) (bv = v), (best = k);
  }
  return best;
}

// Run for every creekfolk at each life check (growUp in life.js): grown-ups wear
// something for the thing they love most, and change it if their passion changes.
function looksGrow(w, c, stage) {
  let l = looksOf(w, c);
  if (stage === "child") {
    l.wear = null;
    return;
  }
  let top = looksPassion(c);
  if (!top || LOOKS_WEAR[top] === l.wear) return;
  let was = l.wear;
  l.wear = LOOKS_WEAR[top];
  if (was && !c.visitor)
    logEvent(w, 1, `${c.name} has put away ${LOOKS_WEAR_NAMES[was]} and taken to wearing ${LOOKS_WEAR_NAMES[l.wear]}: ${INTEREST_LABELS[top]} is what they love most now.`, [c.id], c, "life");
}

// What they wear now, for the view: the saved choice, or (before their first life
// check, a few minutes at most) what it will be.
function looksWorn(w, c) {
  let l = looksOf(w, c);
  if (l.wear) return l.wear;
  if (ageDays(w, c) < LIFE.childDays) return null;
  return LOOKS_WEAR[looksPassion(c)] || null;
}

// Believers wear the treasure they found.
function looksWearsTreasure(c) {
  return !!(c.treasure && c.beliefs && c.beliefs.giver > 0.5);
}

// A short description in plain words, for panels: "ginger, with stripes and pale paws".
function looksText(w, c) {
  let l = looksOf(w, c),
    bits = [],
    shade = l.pale ? "pale " : "dark ";
  if (l.pat === "spots") bits.push(shade + "spots");
  else if (l.pat === "stripes") bits.push(shade + "stripes");
  else if (l.pat === "saddle") bits.push("a " + shade + "saddle");
  else if (l.pat === "patches") bits.push(shade + "patches");
  if (l.face === "mask") bits.push("a mask");
  else if (l.face === "blaze") bits.push("a blaze down the face");
  if (l.socks) bits.push("pale paws");
  let s = (LOOKS_FUR_NAMES[l.fur] || "soft") + " fur";
  if (bits.length) s += ", with " + (bits.length > 1 ? bits.slice(0, -1).join(", ") + " and " + bits[bits.length - 1] : bits[0]);
  return s;
}

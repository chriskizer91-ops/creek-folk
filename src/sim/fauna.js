// ==========================================================================
// Gifts that live (Phase 3B): new flowers, fruit trees, goats, bees, fish and
// birds. Each gift of a kind brings a new species the valley didn't have, so
// over a year every valley fills with the ones its player chose. Nothing here
// decides anyone's survival: flowers and birds are for joy, bees help the
// gardens, goats are tended for company (never for meat), fish live in the
// ponds the creekfolk made.
//
// State lives in world.fauna (plain data, saved with the world). Goats move a
// little every world tick; everything uses the world's seeded random numbers.
// ==========================================================================

var FAUNA_KINDS = {
  flower: [["bluebell", "bluebells"], ["poppy", "poppies"], ["marigold", "marigolds"], ["lupin", "lupins"], ["daisy", "daisies"], ["iris", "irises"]],
  fruit: [["plum", "plums"], ["apple", "apples"], ["pear", "pears"], ["cherry", "cherries"], ["quince", "quinces"]],
  bird: [["wren", "wrens"], ["swallow", "swallows"], ["kingfisher", "kingfishers"], ["finch", "finches"], ["lark", "larks"], ["owl", "owls"]],
  fish: [["minnow", "minnows"], ["trout", "trout"], ["sunfish", "sunfish"], ["loach", "loaches"]],
};

var FAUNA = {
  flowerPatches: 6,   // patches a new flower starts with
  flowerMax: 14,      // patches one kind can spread to
  flowerSpreadDays: 3, // about this often a flower spreads to a new patch
  goatSpeed: 0.35,    // m/s
  beeBoost: 1.25,     // garden growth near a hive
  beeRange: 20,       // m
};

function faunaOf(w) {
  return w.fauna || (w.fauna = { flowers: [], fruits: [], birds: [], fish: [], goats: [], hives: [], pasture: null, wool: 0 });
}

function faunaLabel(group, id) {
  let k = FAUNA_KINDS[group].find((e) => e[0] === id);
  return k ? k[1] : id;
}

// The next species of a group this valley doesn't have yet (or null when it has them all).
function faunaNext(w, group) {
  let f = faunaOf(w),
    have = { flower: f.flowers.map((x) => x.kind), fruit: f.fruits, bird: f.birds, fish: f.fish }[group],
    left = FAUNA_KINDS[group].filter((k) => !have.includes(k[0]));
  return left.length ? w.rng.pick(left)[0] : null;
}

// Somewhere pleasant near where they live: on the terrace, away from the water.
function faunaSpot(w, near, r, extra = {}) {
  let T = w.terrain,
    avoid = w.givingPlace ? [{ x: w.givingPlace.x, z: w.givingPlace.z, r: TEMPLE_ROOM }] : [];
  return T.randomPoint(w.rng, { near: { x: near.x, z: near.z, r }, offFloor: true, minEdge: 3, avoid, ...extra }) || T.randomPoint(w.rng, { near: { x: near.x, z: near.z, r: r * 1.6 }, minEdge: 2, avoid });
}
// The ground kept clear around the Giving Place for the temple (it reaches about 9 m
// toward their midwinter sunrise).
var TEMPLE_ROOM = 9.5;

function villageCentre(w) {
  let homes = w.structures.filter((s) => s.kind === "home" && s.level > 0);
  if (!homes.length) return w.meadow;
  return { x: homes.reduce((a, s) => a + s.x, 0) / homes.length, z: homes.reduce((a, s) => a + s.z, 0) / homes.length };
}

// ---------------------------------------------------------------------------
// The gifts. Each returns { what, spot } for the gift's log and story, or null.
// ---------------------------------------------------------------------------
function giveFlowers(w) {
  let kind = faunaNext(w, "flower"),
    f = faunaOf(w),
    centre = villageCentre(w);
  let fl = kind ? { kind, t: Math.round(w.t), patches: [] } : f.flowers.length ? w.rng.pick(f.flowers) : null;
  if (!fl) return null;
  if (kind) f.flowers.push(fl);
  let add = kind ? FAUNA.flowerPatches : 3;
  for (let i = 0; i < add && fl.patches.length < FAUNA.flowerMax + 4; i++) {
    let p = faunaSpot(w, i % 2 ? centre : w.meadow, 18);
    if (p) fl.patches.push({ x: +p.x.toFixed(2), z: +p.z.toFixed(2), r: +w.rng.range(0.8, 1.6).toFixed(2), n: w.rng.int(5, 9) });
  }
  let spot = fl.patches[0] || w.meadow;
  return { what: kind ? `seeds of ${faunaLabel("flower", kind)}` : `more ${faunaLabel("flower", fl.kind)}`, spot, kind: fl.kind, isNew: !!kind };
}

function giveFruitTree(w) {
  let kind = faunaNext(w, "fruit") || w.rng.pick(FAUNA_KINDS.fruit)[0],
    f = faunaOf(w),
    centre = villageCentre(w),
    first = null;
  if (!f.fruits.includes(kind)) f.fruits.push(kind);
  for (let i = 0; i < 3; i++) {
    let p = faunaSpot(w, centre, 14, { minEdge: 3.5 });
    if (!p) continue;
    let o = register(w, { id: w.nextId++, kind: "orchard", x: +p.x.toFixed(2), z: +p.z.toFixed(2), side: w.terrain.side(p.x, p.z), stage: 1, grow: 0, amt: 0, max: 5, canopy: 0.4, fruit: kind, gift: true });
    w.res.push(o);
    first = first || o;
  }
  if (!first) return null;
  return { what: `three young ${kind} trees`, spot: first, kind };
}

function giveGoats(w) {
  let f = faunaOf(w),
    centre = villageCentre(w);
  if (!f.pasture) {
    let p = faunaSpot(w, centre, 22, { minEdge: 5 });
    if (!p) return null;
    f.pasture = { x: +p.x.toFixed(2), z: +p.z.toFixed(2) };
  }
  let at = f.pasture,
    names = [];
  for (let i = 0; i < 2; i++) {
    let nm = newName(w, []).name,
      g = { id: (f.goatSeq = (f.goatSeq || 0) + 1), name: nm, x: +(at.x + w.rng.range(-1.5, 1.5)).toFixed(2), z: +(at.z + w.rng.range(-1.5, 1.5)).toFixed(2), coat: w.rng.int(0, 3), born: Math.round(w.t) };
    g.px = g.x;
    g.pz = g.z;
    g.pt = Math.round(w.t);
    g.tn = Math.round(w.t);
    f.goats.push(g);
    names.push(nm);
  }
  if (f.goats.length > 12) f.goats.splice(0, f.goats.length - 12);
  return { what: "a pair of goats", spot: at, names };
}

function giveBees(w) {
  let f = faunaOf(w),
    g = w.structures.find((s) => s.kind === "garden" && s.level > 0 && !f.hives.some((h) => dist2d(h.x, h.z, s.x, s.z) < 8)),
    near = g || villageCentre(w),
    p = faunaSpot(w, near, 5, { minEdge: 3 });
  if (!p) return null;
  f.hives.push({ x: +p.x.toFixed(2), z: +p.z.toFixed(2), t: Math.round(w.t) });
  if (f.hives.length > 6) f.hives.shift();
  return { what: "a hive of bees", spot: p };
}

function giveFish(w) {
  let kind = faunaNext(w, "fish") || w.rng.pick(FAUNA_KINDS.fish)[0],
    f = faunaOf(w);
  if (!f.fish.includes(kind)) f.fish.push(kind);
  let d = Object.values(w.creek.dams || {}).sort((a, b) => b.pl - w.creek.nodes[b.i].bed - (a.pl - w.creek.nodes[a.i].bed))[0];
  let z = d ? w.creek.nodes[d.i].z - 3 : VL * 0.4,
    spot = { x: w.terrain.creekX(z), z };
  return { what: faunaLabel("fish", kind), spot, kind, ponds: !!d };
}

function giveBird(w) {
  let kind = faunaNext(w, "bird") || w.rng.pick(FAUNA_KINDS.bird)[0],
    f = faunaOf(w);
  if (!f.birds.includes(kind)) f.birds.push(kind);
  return { what: faunaLabel("bird", kind), spot: null, kind };
}

// More of the valley's own materials, close to where they're needed.
function giveGreatTree(w) {
  let near = villageCentre(w),
    p = faunaSpot(w, near, 12, { minEdge: 3.5 });
  if (!p) return null;
  let o = register(w, { id: w.nextId++, kind: "greatlog", x: +p.x.toFixed(2), z: +p.z.toFixed(2), side: w.terrain.side(p.x, p.z), amt: 40, max: 40, timber: 14, ry: +w.rng.range(0, 3.14).toFixed(2), gift: true });
  w.res.push(o);
  return { what: "a great fallen tree", spot: o };
}

function giveClayBank(w) {
  let near = w.givingPlace ? { x: w.givingPlace.x, z: w.givingPlace.z } : villageCentre(w),
    p = faunaSpot(w, near, 14, { minEdge: 2 });
  if (!p) return null;
  let o = register(w, { id: w.nextId++, kind: "clay", x: +p.x.toFixed(2), z: +p.z.toFixed(2), side: w.terrain.side(p.x, p.z), amt: 36, max: 40, gift: true });
  w.res.push(o);
  return { what: "a bank of good clay", spot: o };
}

function giveStones(w) {
  let near = w.givingPlace ? { x: w.givingPlace.x, z: w.givingPlace.z } : villageCentre(w),
    p = faunaSpot(w, near, 13, { minEdge: 2.5 });
  if (!p) return null;
  let o = register(w, { id: w.nextId++, kind: "stones", x: +p.x.toFixed(2), z: +p.z.toFixed(2), side: w.terrain.side(p.x, p.z), amt: 36, max: 36, gift: true });
  w.res.push(o);
  return { what: "a pile of stones", spot: o };
}

// ---------------------------------------------------------------------------
// Living things over time
// ---------------------------------------------------------------------------

// Every world tick (60 s): goats wander and graze near their pasture; at night they
// settle close together.
function faunaMinute(w) {
  let f = w.fauna;
  if (!f || !f.goats.length || !f.pasture) return;
  let T = w.terrain,
    night = isNight(w.t);
  for (let g of f.goats) {
    if (w.t < g.tn) continue;
    let r = night ? 1.5 : 5.5,
      tx = f.pasture.x + w.rng.range(-r, r),
      tz = f.pasture.z + w.rng.range(-r, r);
    if (!T.walkable(tx, tz) || T.edgeDist(tx, tz) < 1.5) continue;
    let d = dist2d(g.x, g.z, tx, tz);
    g.px = g.x;
    g.pz = g.z;
    g.pt = Math.round(w.t);
    g.x = +tx.toFixed(2);
    g.z = +tz.toFixed(2);
    // walk there, then graze a while
    g.tn = Math.round(w.t + d / FAUNA.goatSpeed + w.rng.range(night ? 600 : 40, night ? 1500 : 220));
  }
}

// Every few valley hours (from the gift tick): flowers spread to new patches.
function faunaSlow(w) {
  let f = w.fauna;
  if (!f) return;
  for (let fl of f.flowers) {
    if (fl.patches.length >= FAUNA.flowerMax || !w.rng.chance(LIFE.tick / (FAUNA.flowerSpreadDays * 86400))) continue;
    let from = w.rng.pick(fl.patches),
      p = faunaSpot(w, from, 6);
    if (p) fl.patches.push({ x: +p.x.toFixed(2), z: +p.z.toFixed(2), r: +w.rng.range(0.7, 1.4).toFixed(2), n: w.rng.int(4, 8) });
  }
}

// Gardens near a hive grow faster.
function beeBoost(w, x, z) {
  let f = w.fauna;
  if (!f || !f.hives.length) return 1;
  for (let h of f.hives) if (dist2d(h.x, h.z, x, z) < FAUNA.beeRange) return FAUNA.beeBoost;
  return 1;
}

// A creekfolk who likes animals or growing things may go and tend the goats.
function goatOption(w, c) {
  let f = w.fauna;
  if (!f || !f.goats.length || isNight(w.t) || c.stage === "elder" && c.needs.energy < 0.5) return null;
  if (w.creatures.some((o) => o !== c && o.plan && o.plan.goal === "goats")) return null;
  let g = w.rng.pick(f.goats),
    like = 0.25 * c.interests.growing + 0.2 * c.temp.sociability + (c.stage === "child" ? 0.25 : 0),
    score = (0.08 + like) * clamp((0.8 - c.needs.fun) / 0.8, 0.2, 1);
  return {
    score,
    plan: { goal: "goats", steps: [{ do: "walk", x: g.x + 0.6, z: g.z + 0.6, near: 0.5, why: "goats" }, { do: "tendgoat", id: g.id }] },
  };
}

ACTIONS.tendgoat = {
  start(w, c, step) {
    let f = w.fauna,
      g = f && f.goats.find((x) => x.id === step.id);
    if (!g) return null;
    return makeAct(w, c, "groom", 25, { lookX: g.x, lookZ: g.z });
  },
  end(w, c, a, step) {
    let f = w.fauna,
      g = f && f.goats.find((x) => x.id === step.id);
    c.needs.fun = clamp(c.needs.fun + 0.18, 0, 1);
    c.needs.social = clamp(c.needs.social + 0.06, 0, 1);
    feel(c, w, "joy", 0.3);
    if (f) f.wool = +(f.wool + 0.05).toFixed(2);
    if (g && !(c.counts.goats > 0)) remember(w, c, "goats", `I brushed ${g.name} the goat. Soft, and a bit smelly.`, 0.5);
    c.counts.goats = (c.counts.goats || 0) + 1;
    return true;
  },
};

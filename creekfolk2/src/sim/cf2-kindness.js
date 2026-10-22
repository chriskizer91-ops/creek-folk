// ==========================================================================
// Creekfolk 2: everyday kindness.
//
// At any time the player can leave a little food near a home, a burrow or a path
// (`leaveFood`). The creekfolk never need it, and their lives run fine without it, but they
// notice. Whoever passes sees it, wonders who left it, and eats it if they like it. Over time
// they learn the spot where good things appear (`world.kindness.spots`), stop by it now and
// then on their way (a little bolder each time), and some leave something back: a pebble, a
// flower, a bead, whatever they love. A spot several of them know gets a name. This is the
// author's own habit with wild creatures: start feeding them when you see signs of a home.
//
// Nothing here is paced by the player or needed by anyone: food left too long simply spoils.
// Wraps lifeTick and lifeOptions3C; see docs/MERGE.md.
// ==========================================================================

var KIND = {
  piles: 3,        // piles out at once
  portions: 4,     // bites in a pile
  spotR: 5,        // m: food left within this of a known spot is that spot
  seeR: 9,         // m (times CF2_SCALE.see): how near they notice a pile
  spoilDays: 1.5,  // real days before a pile spoils
  keepLeft: 8,     // things left back kept at one spot
  spots: 24,       // spots remembered
  leaveGap: 3,     // real days between one creekfolk's thank-yous
};
var KIND_FOODS = {
  berry: { label: "A handful of berries", phrase: "a little heap of berries" },
  seeds: { label: "Some nuts", phrase: "a few nuts" },
  fruit: { label: "A piece of fruit", phrase: "a piece of ripe fruit" },
};
var KIND_SPOT_NAMES = ["the Little Table", "the Kindly Stone", "the Good Stump", "the Place Where Things Appear"];

function kindnessOf(w) {
  return (w.kindness = w.kindness || { seq: 0, piles: [], spots: [], left: [] });
}

// The player leaves food at (x, z). Returns the pile, or null (too many out, or nowhere to put it).
function leaveFood(w, x, z, food) {
  let K = kindnessOf(w),
    T = w.terrain;
  if (!KIND_FOODS[food] || K.piles.length >= KIND.piles || !T.walkable(x, z) || T.edgeDist(x, z) < 0.8) return null;
  let spot = K.spots.find((s) => dist2d(s.x, s.z, x, z) < KIND.spotR);
  if (!spot) {
    spot = { id: ++K.seq, x: +x.toFixed(2), z: +z.toFixed(2), t: Math.round(w.t), n: 0, by: [] };
    K.spots.push(spot);
    if (K.spots.length > KIND.spots) K.spots.splice(K.spots.findIndex((s) => !s.named) >>> 0, 1);
  }
  let p = { id: ++K.seq, x: +x.toFixed(2), z: +z.toFixed(2), food, n: KIND.portions, t: Math.round(w.t), spot: spot.id, seen: [] };
  K.piles.push(p);
  w.stats.foodLeft = (w.stats.foodLeft || 0) + 1;
  return p;
}

// Every life tick: piles spoil; those passing notice; the hungry or curious go and see.
function kindTick(w) {
  let K = w.kindness;
  if (!K || !K.piles.length) return;
  for (let j = K.piles.length - 1; j >= 0; j--) if (w.t - K.piles[j].t > KIND.spoilDays * 86400 || K.piles[j].n <= 0) K.piles.splice(j, 1);
  let r = KIND.seeR * CF2_SCALE.see;
  for (let p of K.piles) {
    if (p.claim != null) {
      let cc = w.byId[p.claim];
      if (cc && cc.plan && cc.plan.goal === "kindfood") continue;
      p.claim = null;
    }
    for (let c of w.creatures) {
      if (c.asleep || c.visitor || c.farewell || c.leaving || p.seen.includes(c.id) || dist2d(c.x, c.z, p.x, p.z) > r) continue;
      p.seen.push(c.id);
      if (p.seen.length > 40) p.seen.shift();
      let knows = c.kindKnow && c.kindKnow[p.spot],
        want = (1 - c.needs.food) * 0.8 + c.temp.curiosity * 0.5 + tasteValue(c, p.food) * 0.4 + (knows ? 0.4 : 0) - c.temp.caution * 0.3;
      if (want < 0.55 || !canBeInterrupted(c) || !w.rng.chance(0.7)) continue;
      p.claim = c.id;
      setPlan(w, c, { goal: "kindfood", steps: [{ do: "walk", x: p.x, z: p.z, near: 0.5, why: "kindfood" }, { do: "kindeat", id: p.id }], i: 0 });
      break;
    }
  }
}

ACTIONS.kindeat = {
  start(w, c, step) {
    let p = kindnessOf(w).piles.find((q) => q.id === step.id);
    if (!p || p.n <= 0) return "skip";
    return makeAct(w, c, "eat", 6, { lookX: p.x, lookZ: p.z });
  },
  end(w, c, a, step) {
    let K = kindnessOf(w),
      p = K.piles.find((q) => q.id === step.id);
    if (!p || p.n <= 0) return true;
    p.n--;
    p.claim = null;
    let F = FOODS[p.food],
      spot = K.spots.find((s) => s.id === p.spot),
      phrase = KIND_FOODS[p.food].phrase,
      place = spot && spot.named ? spot.named : null;
    c.needs.food = clamp(c.needs.food + F.nutrition * 1.5, 0, 1);
    if (typeof learnTaste === "function") learnTaste(w, c, p.food);
    feel(c, w, "joy", 0.35);
    c.kindSeen = (c.kindSeen || 0) + 1;
    c.kindKnow = c.kindKnow || {};
    let mine = (c.kindKnow[p.spot] = (c.kindKnow[p.spot] || 0) + 1);
    if (spot) {
      spot.n++;
      if (!spot.by.includes(c.id)) spot.by.push(c.id);
      if (spot.by.length > 30) spot.by.shift();
    }
    w.stats.foodEaten = (w.stats.foodEaten || 0) + 1;
    if (w.stats.foodEaten === 1) {
      logEvent(w, 3, `${c.name} found ${phrase} by the path, left by no one they could see. They ate it slowly, looking all around.`, [c.id], p, "kindness");
      remember(w, c, "kindness", `Someone left ${phrase} by the path. Who would do that?`, 0.8, { x: p.x, z: p.z, pv: 0.5 });
    } else if (mine === 1) {
      logEvent(w, 1, `${c.name} found ${phrase}${place ? ` at ${place}` : ""}, and ate it.`, [c.id], p, "kindness");
      remember(w, c, "kindness", `There was ${phrase}${place ? ` at ${place}` : ""}. Good things appear there.`, 0.6, { x: p.x, z: p.z, pv: 0.5 });
    } else if (mine === 3) {
      logEvent(w, 2, `${c.name} has started stopping by${place ? ` ${place}` : " the spot where food appears"} on the way past, in case something's there.`, [c.id], p, "kindness");
    }
    // they leave something back, now and then
    if (mine >= 3 && w.t - (c.kindLeft || -1e9) > KIND.leaveGap * 86400 && w.rng.chance(0.25)) {
      c.kindLeft = Math.round(w.t);
      let o = OFFERING_KINDS[c.sig] || OFFERING_KINDS.collecting;
      if (o[0] === "flower" && !(w.fauna && w.fauna.flowers.length) && w.rng.chance(0.5)) o = OFFERING_KINDS.collecting;
      let left = { id: ++K.seq, x: +(p.x + w.rng.range(-0.4, 0.4)).toFixed(2), z: +(p.z + w.rng.range(-0.4, 0.4)).toFixed(2), k: o[0], by: c.name, t: Math.round(w.t), spot: p.spot };
      K.left.push(left);
      let here = K.left.filter((l) => l.spot === p.spot);
      if (here.length > KIND.keepLeft) K.left.splice(K.left.indexOf(here[0]), 1);
      if (K.left.length > KIND.keepLeft * 4) K.left.shift();
      w.stats.leftBack = (w.stats.leftBack || 0) + 1;
      logEvent(w, w.stats.leftBack === 1 ? 3 : 1, `${c.name} left ${o[1]} where the food appears. A thank-you, perhaps.`, [c.id], left, "kindness");
      if (w.stats.leftBack === 1) remember(w, c, "kindness", `I left ${o[1]} for whoever brings the food.`, 0.7);
    }
    // a spot several of them know gets a name
    if (spot && !spot.named && spot.n >= 5 && spot.by.length >= 2) {
      let used = new Set((w.placeNames || []).map((q) => q.name)),
        name = KIND_SPOT_NAMES.find((n) => !used.has(n)) || "the Little Table";
      spot.named = name;
      namePlace(w, name, spot, "kindness", 3, c);
    }
    return true;
  },
};

// Those who know a spot stop by it now and then, more often the more often they found food there.
function kindVisitOption(w, c) {
  if (!c.kindKnow || c.visitor || c.leaving || c.farewell || isNight(w.t) || !canBeInterrupted(c)) return null;
  if (w.t - (c.kindCheck || -1e9) < 0.25 * 86400) return null;
  let K = w.kindness;
  if (!K) return null;
  let best = null;
  for (let s of K.spots) {
    let n = c.kindKnow[s.id];
    if (!n) continue;
    let d = dist2d(c.x, c.z, s.x, s.z);
    if (d > 40) continue;
    let score = 0.12 * Math.min(5, n) * (1 - d / 60) * (0.6 + c.temp.curiosity * 0.6);
    if (!best || score > best.score) best = { s, score };
  }
  if (!best || !w.rng.chance(0.15)) return null;
  c.kindCheck = Math.round(w.t);
  let pile = K.piles.find((p) => p.spot === best.s.id && p.n > 0 && p.claim == null);
  if (pile) pile.claim = c.id;
  return {
    score: best.score,
    plan: { goal: "kindfood", steps: [{ do: "walk", x: best.s.x, z: best.s.z, near: 0.8, why: "kindfood" }, pile ? { do: "kindeat", id: pile.id } : { do: "look", x: best.s.x, z: best.s.z, dur: 3 }] },
  };
}

var cf2KindOptions = lifeOptions3C;
lifeOptions3C = function (w, c) {
  let out = cf2KindOptions(w, c),
    k = kindVisitOption(w, c);
  if (k) out.push(["kindfood", k]);
  return out;
};

var cf2KindLifeTick = lifeTick;
lifeTick = function (w) {
  cf2KindLifeTick(w);
  kindTick(w);
};

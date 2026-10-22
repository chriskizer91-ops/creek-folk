// ==========================================================================
// Creekfolk 2: rare treasures, delivered by the creek.
//
// Every couple of real days the player may place a treasure in the water at the head of the
// valley (`placeTreasure`). It waits there until the rains (Decision 4): the next flood carries
// it down the creek the way geomorphologists' painted tracer stones travel. How far it goes
// depends on the flood and how heavy it is; it settles where the river model says: on a
// gravel bar where the water slackened, in a pond above a dam, or (light things) left on the
// floor at the flood's edge. It stays in the valley: the last stretch above the valley's foot
// catches what gets that far. Whoever walks by may notice it; after a storm, the believers go
// down to the creek to look (that becomes a custom). Whoever finds it takes it for a gift from
// the creek (doubters say it's luck), and it becomes part of the valley:
// - a creek stone is set into the crest of a dam, where everyone can see it;
// - a shell, a glass pebble, a feather is worn, and passed to a child (or laid at the
//   wearer's tree in the grove) when they pass on;
// - a crystal or an odd shell is kept on a windowsill at home;
// - a nut or a seed is planted, and grows into a tree;
// - one left in a pond too long is buried by the next flood's mud, a glint in the creek's bank
//   for good (`world.records.mud[node].tr`).
// The player can always see where each of their treasures is now (`treasureWhere`).
//
// Belief wakes with them (Creekfolk 1's `noticeGift`, gift.js): each find is news, believers
// thank the creek, leave offerings at the Giving Place, and after about ten treasures someone
// suspects they come from someone beyond the valley (Decision 6). Nothing waits on the player.
//
// Wraps creekFloodWork, lifeTick, lifeOptions3C, passOn, depart, storyText, shortAbout, and
// replaces beyondTick, watchOption and giftRequests; see docs/MERGE.md.
// ==========================================================================

var TREASURE = {
  every: 2 * 86400,    // one treasure every two real days
  keep: 300,           // treasures remembered (the oldest settled ones are dropped first)
  headZ: 3,            // where they are placed: the head of the valley
  findR: 7,            // m (times CF2_SCALE.see): how near a creekfolk has to pass to notice one
  findPond: 0.5,       // under water they're harder to see
  buryMM: 25,          // a pond that gets this much mud over a treasure buries it ...
  buryBar: 45,         // ... a bar, this much gravel and mud
  deep: 0.3,           // m of still water over a treasure before it is out of sight
  searchHours: 8,      // valley hours after a storm that searchers go looking
  growDays: 8,         // a planted nut grows into a young tree in about this long
  wonder: 0.8,         // how much a find moves them (Creekfolk 1's "need": a gift the valley needed)
};

// The kinds, in the four collections that inspired them (What the Water Brings' "Things the
// Water Rounded", "The Old Sea", "Glass and Light", "Seeds and Wood"). w: how heavy (0 floats,
// 1 small, 2 heavy). fate: what becomes of it once found.
var TREASURE_GROUPS = [
  ["round", "Things the water rounded"],
  ["sea", "The old sea"],
  ["glass", "Glass and light"],
  ["wood", "Seeds and wood"],
];
var TREASURE_KINDS = {
  roundstone: { group: "round", label: "A creek stone worn round", phrase: "a creek stone worn as round as an egg", w: 2, fate: "set", paint: "#a39a8e" },
  quartz: { group: "round", label: "A white quartz pebble", phrase: "a white pebble that holds the light", w: 1, fate: "wear", paint: "#efeee6" },
  agate: { group: "round", label: "A banded agate", phrase: "a stone banded red and cream like the sky at dusk", w: 2, fate: "set", paint: "#c4654a" },
  spiral: { group: "sea", label: "A stone spiral shell", phrase: "a spiral shell turned to stone, from a sea that was here before the valley", w: 1, fate: "keep", paint: "#cdb98f" },
  urchin: { group: "sea", label: "A fossil sea urchin", phrase: "a stone flower with five petals, from the bottom of an old sea", w: 1, fate: "wear", paint: "#d7c9a2" },
  sharktooth: { group: "sea", label: "A stone tooth", phrase: "a little stone tooth, sharp as the day it was lost", w: 1, fate: "wear", paint: "#5c5148" },
  greenglass: { group: "glass", label: "Green creek glass", phrase: "a pebble of green glass, frosted soft by the creek", w: 1, fate: "wear", paint: "#7fb89a" },
  blueglass: { group: "glass", label: "Blue glass", phrase: "a piece of glass as blue as a summer evening", w: 1, fate: "wear", paint: "#3f6fb0" },
  crystal: { group: "glass", label: "A clear crystal", phrase: "a clear stone that throws little rainbows", w: 1, fate: "keep", paint: "#e8f4f8" },
  pecan: { group: "wood", label: "A pecan", phrase: "a pecan, the nut of a tree the valley hasn't got", w: 0, fate: "plant", tree: "pecan", paint: "#8a5a34" },
  acorn: { group: "wood", label: "A bur oak acorn", phrase: "an acorn in a shaggy cap", w: 0, fate: "plant", tree: "oak", paint: "#9b7748" },
  sycball: { group: "wood", label: "A sycamore ball", phrase: "a sycamore's seed ball, a little round world", w: 0, fate: "plant", tree: "syc", paint: "#7d6b4f" },
  feather: { group: "wood", label: "A heron feather", phrase: "a long grey heron feather", w: 0, fate: "wear", paint: "#9aa3aa" },
};

function treasuresOf(w) {
  return (w.treasures = w.treasures || []);
}
function treasureReady(w) {
  return w.t - (w.lastTreasure ?? -1e9) >= TREASURE.every;
}
function treasureWait(w) {
  return Math.max(0, (w.lastTreasure ?? -1e9) + TREASURE.every - w.t);
}
// A treasure's state, with a short history of where it has been ([state, t, who]).
function treasureNote(tr, st, extra) {
  tr.st = st;
  (tr.h = tr.h || []).push([st, ...(extra || [])]);
  if (tr.h.length > 10) tr.h.splice(1, 1);
}
// "the lowest dam", "the third dam", "Ash's home": a structure in plain words, in the simulation.
var ORDINAL_WORDS = ["lowest", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
function treasureStructName(w, s) {
  if (s.kind === "dam") {
    let rank = w.structures.filter((d) => d.kind === "dam" && d.z > s.z).length;
    return rank < ORDINAL_WORDS.length ? `the ${ORDINAL_WORDS[rank]} dam` : "one of the high dams";
  }
  let o = s.owner != null && (w.byId[s.owner] || (w.lineage || {})[s.owner]);
  if (s.kind === "home") return o ? `${o.name}'s home` : "a home nobody lives in now";
  return (o ? o.name + "'s " : "the ") + structureLabel(s);
}

// The player places a treasure at the head of the valley. Returns it, or null if one was
// placed too recently.
function placeTreasure(w, kind) {
  if (!TREASURE_KINDS[kind] || !treasureReady(w)) return null;
  let cr = w.creek,
    i = creekNodeIndex(TREASURE.headZ),
    n = cr.nodes[i];
  w.treasureSeq = (w.treasureSeq || 0) + 1;
  let tr = { id: w.treasureSeq, k: kind, t: Math.round(w.t), st: "wait", i, x: +n.x.toFixed(2), z: +n.z.toFixed(2), h: [] };
  treasureNote(tr, "wait", [Math.round(w.t)]);
  treasuresOf(w).push(tr);
  w.lastTreasure = Math.round(w.t);
  w.stats.treasuresPlaced = (w.stats.treasuresPlaced || 0) + 1;
  boundTreasures(w);
  return tr;
}

function boundTreasures(w) {
  let L = treasuresOf(w);
  while (L.length > TREASURE.keep) {
    let j = L.findIndex((t) => ["set", "planted", "grove", "buried", "away"].includes(t.st));
    L.splice(j >= 0 ? j : 0, 1);
  }
}

// ---- the flood carries them ----------------------------------------------------------

var TREASURE_MOVE = [3, 8, 15]; // Pa of shear on the bed to set a light, small, heavy one moving
var TREASURE_STOP = [1.5, 5, 10]; // ... and below which it settles
var TREASURE_OVER = [0.85, 0.5, 0.15]; // chance a big flood lifts it over a dam
function carryTreasures(w, T) {
  let cr = w.creek,
    ns = cr.nodes,
    k = creekKofT(T),
    full = cr._pondFull,
    rng = w.rng,
    end = creekNodeIndex(VL - 8);
  for (let tr of treasuresOf(w)) {
    if (tr.st !== "wait" && tr.st !== "bar" && tr.st !== "pond") continue;
    let K = TREASURE_KINDS[tr.k],
      i = tr.i,
      n = ns[i],
      wt = K.w;
    if (tr.st !== "wait" && !((n._tau || 0) > TREASURE_MOVE[wt] || (wt === 0 && n.ob > 0.1))) continue;
    let budget = wt === 0 ? 30 + 12 * k : wt === 1 ? 15 + 6 * k : 8 + 3 * k,
      went = 0,
      j = i,
      st = "bar",
      fx = null;
    while (went < budget && j < end) {
      let nx = ns[j + 1];
      // a dam: what the flood can lift over its crest goes on (light things easily, heavy ones
      // only in the biggest floods); the rest stops in its pond
      if (cr._damAt && cr._damAt[j + 1] && !rng.chance(TREASURE_OVER[wt] * clamp((k - 5) / 20, 0, 1))) {
        st = full && full[j] - ns[j].bed > TREASURE.deep ? "pond" : "bar";
        break;
      }
      j++;
      went += nx.len;
      // where the flood runs into still water it drops what it carries: on the shallow delta at
      // the pond's head (a bar, easy to see), or out in deeper water
      let pond = full && full[j] > nx.bed + 0.15;
      if (pond && wt > 0) {
        st = full[j] - nx.bed > TREASURE.deep ? "pond" : "bar";
        break;
      }
      if (wt === 0 && nx.ob > 0.2 && rng.chance(0.06)) {
        st = "floor";
        break;
      }
      if ((nx._tau || 0) < TREASURE_STOP[wt] && rng.chance(0.5)) {
        st = "bar";
        break;
      }
    }
    n = ns[j];
    let side = rng.chance(0.5) ? 1 : -1,
      half = creekTopWidth(n) / 2;
    if (st === "floor") {
      let d = half + rng.range(1.5, 6),
        x = n.x + side * d;
      if (!w.terrain.walkable(x, n.z)) (st = "bar"), (x = null);
      else fx = x;
    }
    tr.i = j;
    tr.z = +n.z.toFixed(2);
    tr.x = +(fx != null ? fx : st === "pond" ? n.x + rng.range(-0.3, 0.3) * n.wb : n.x + side * Math.max(0.3, n.wb * 0.38)).toFixed(2);
    tr.claim = null;
    tr.moved = Math.round(w.t);
    treasureNote(tr, st, [Math.round(w.t)]);
    if (!w.stats.treasuresCarried) w.stats.treasuresCarried = 0;
    w.stats.treasuresCarried++;
  }
}

// Mud over a treasure in a pond or on a bar buries it, for good: a glint in the bank.
function buryTreasures(w, before) {
  let cr = w.creek,
    R = recordsOf(w);
  for (let tr of treasuresOf(w)) {
    if ((tr.st !== "pond" && tr.st !== "bar") || tr.moved === Math.round(w.t)) continue;
    let n = cr.nodes[tr.i],
      rise = (n.bed - before[tr.i]) * 1000;
    if (rise < (tr.st === "pond" ? TREASURE.buryMM : TREASURE.buryBar)) continue;
    let init = cr.init && cr.init[tr.i] ? cr.init[tr.i][0] : n.bed,
      r = (R.mud[tr.i] = R.mud[tr.i] || { b: [], f: [], p: 0, pf: 0 });
    (r.tr = r.tr || []).push([Math.round(w.t / 8640), tr.id, Math.round((before[tr.i] - init) * 1000)]);
    if (r.tr.length > 12) r.tr.shift();
    treasureNote(tr, "buried", [Math.round(w.t)]);
  }
}

var cf2TreasureFloodWork = creekFloodWork;
creekFloodWork = function (w, T, seed) {
  let before = w.creek.nodes.map((n) => n.bed),
    r = cf2TreasureFloodWork(w, T, seed);
  if (w.t != null && w.treasures && w.treasures.length) {
    carryTreasures(w, T);
    buryTreasures(w, before);
  }
  return r;
};

// ---- finding them --------------------------------------------------------------------

function treasureFinders(w) {
  let L = w.treasures;
  if (!L || !L.length) return;
  for (let tr of L) {
    if (tr.st !== "bar" && tr.st !== "pond" && tr.st !== "floor") continue;
    if (tr.claim != null) {
      let cc = w.byId[tr.claim];
      if (cc && cc.plan && cc.plan.goal === "treasure") continue;
      tr.claim = null; // they went off and did something else
    }
    let r = TREASURE.findR * CF2_SCALE.see * (tr.st === "pond" ? 0.6 : 1);
    for (let c of w.creatures) {
      if (c.asleep || c.visitor || c.farewell || c.leaving || (c.stage === "child" && ageDays(w, c) < 3) || !canBeInterrupted(c)) continue;
      if (Math.abs(c.x - tr.x) > r || Math.abs(c.z - tr.z) > r || dist2d(c.x, c.z, tr.x, tr.z) > r) continue;
      let p = 0.22 * (0.5 + c.temp.curiosity) * (1 + 0.8 * (c.interests.collecting || 0)) * (tr.st === "pond" ? TREASURE.findPond : 1) * (c.plan && c.plan.goal === "search" ? 3 : 1);
      if (!w.rng.chance(p)) continue;
      tr.claim = c.id;
      setPlan(w, c, { goal: "treasure", steps: [{ do: "walk", x: tr.x, z: tr.z, near: 0.5, why: "treasure" }, { do: "picktreasure", id: tr.id }], i: 0 });
      break;
    }
  }
}

ACTIONS.picktreasure = {
  start(w, c, step) {
    let tr = treasuresOf(w).find((t) => t.id === step.id);
    if (!tr || (tr.st !== "bar" && tr.st !== "pond" && tr.st !== "floor")) return "skip";
    return makeAct(w, c, "look", 4, { lookX: tr.x, lookZ: tr.z, icon: "eye" });
  },
  end(w, c, a, step) {
    let tr = treasuresOf(w).find((t) => t.id === step.id);
    if (!tr || (tr.st !== "bar" && tr.st !== "pond" && tr.st !== "floor")) return true;
    treasureFound(w, c, tr);
    return true;
  },
  abort(w, c, a) {
    for (let tr of treasuresOf(w)) if (tr.claim === c.id && tr.st !== "found") tr.claim = null;
  },
};

function treasureWhereWords(w, tr) {
  let pl = placeNear(w, tr.x, tr.z, 12),
    at = pl ? ` near ${pl.name}` : "";
  return tr.st === "pond" ? `in the shallows of a pond${at}` : tr.st === "floor" ? `in the grass where the flood had spread${at}` : `on a gravel bar${at}`;
}

function treasureFound(w, c, tr) {
  let K = TREASURE_KINDS[tr.k],
    spot = { x: tr.x, z: tr.z },
    where = treasureWhereWords(w, tr),
    first = !(w.stats.treasures > 0),
    b = beliefsOf(c),
    since = w.creek.flood ? (w.t - w.creek.flood.t0) / VALLEY_DAY : 99;
  tr.by = c.id;
  tr.byName = c.name;
  tr.foundT = Math.round(w.t);
  tr.foundAt = tr.i; // where things are found: the searchers remember
  tr.who = c.id;
  tr.whoName = c.name;
  treasureNote(tr, "found", [Math.round(w.t), c.name]);
  w.stats.treasures = (w.stats.treasures || 0) + 1;
  // as a gift, for Creekfolk 1's belief: the gifts list, the rhythm, the creek resting, the one who suspects
  w.stats.gifts = (w.stats.gifts || 0) + 1;
  w.gifts = w.gifts || [];
  w.gifts.push({ t: Math.round(w.t), kind: "treasure", what: K.phrase, need: 0.5 });
  if (w.gifts.length > 200) w.gifts.splice(0, w.gifts.length - 200);
  if (w.firstGiftAt == null) w.firstGiftAt = Math.round(w.t);
  w.giftLast = Math.round(w.t);
  if (w.giftsStopped) {
    w.giftsStopped = null;
    w.lantern = null;
    logEvent(w, 3, "The creek brought something again. Those who had kept the lantern lit said they had known it would.", [], w.givingPlace || null, "gift");
  }
  let sure = b.giver > 0.5,
    say = sure ? ` "The creek brought it," they said.` : b.giver < 0.2 && w.stats.treasures > 2 ? ` "Lucky," they said.` : "";
  logEvent(w, 3, `${c.name} found ${K.phrase} ${where}${since < 2 ? " after the storm" : ""}.${say}`, [c.id], spot, "treasure");
  if (first) namePlace(w, "the Place of the First Gift", spot, "firstgift", 2.5, c, true);
  remember(w, c, "treasure", `I found ${K.phrase}${since < 2 ? " after the storm" : ""}. The creek must have carried it down from somewhere.`, 0.9, { x: spot.x, z: spot.z, pv: 0.4 });
  feel(c, w, "joy", 0.7);
  emote(c, w, "star", 3);
  let seers = witnessesNear(w, spot, 12, [c]).filter((o) => !o.visitor);
  newStory(w, "treasure", { who: c.name, what: tr.k, where: placeNear(w, spot.x, spot.z, 6) ? placeNear(w, spot.x, spot.z, 6).name : null }, spot, first ? 3 : 2, seers);
  // everyone hears: belief wakes (Creekfolk 1's noticeGift), most in those who saw it
  for (let o of w.creatures) if (!o.visitor) noticeGift(w, o, "found", K.phrase, TREASURE.wonder, o === c ? 1.3 : seers.includes(o) ? 1 : o.asleep ? 0.5 : 0.7);
  // what they do with it
  treasureFate(w, c, tr);
}

// ---- what becomes of them ------------------------------------------------------------

function treasureFate(w, c, tr) {
  let K = TREASURE_KINDS[tr.k],
    fate = K.fate,
    steps = [];
  if (beliefsOf(c).giver >= 0.6 && beliefsOf(c).thanks) steps.push({ do: "gesture", g: beliefsOf(c).thanks, task: "thanks" });
  if (fate === "wear" && c.treasureId) fate = "keep"; // they wear one already
  if (fate === "keep" && (c.home == null || !w.byId[c.home])) fate = c.treasureId ? "keep" : "wear";
  if (fate === "set") {
    let dams = w.structures.filter((s) => s.kind === "dam" && s.level > 0 && w.creek.dams[s.id]);
    let d = dams.sort((a, b) => dist2d(a.x, a.z, tr.x, tr.z) - dist2d(b.x, b.z, tr.x, tr.z))[0];
    if (!d) fate = c.home != null && w.byId[c.home] ? "keep" : "wear";
    else steps.push({ do: "walk", x: d.x, z: d.z, near: 1.4 }, { do: "tfate", id: tr.id, fate: "set", sid: d.id, dur: 240 });
  }
  if (fate === "keep") {
    let h = w.byId[c.home] || null;
    if (h) steps.push({ do: "walk", x: h.x, z: h.z, near: STRUCTURES.home.radius + 0.6 }, { do: "tfate", id: tr.id, fate: "keep", sid: h.id, dur: 60 });
    else fate = "wear";
  }
  if (fate === "plant") {
    let p = treasureTreeSpot(w, c);
    if (p) steps.push({ do: "walk", x: p.x, z: p.z, near: 0.6 }, { do: "tfate", id: tr.id, fate: "plant", x: p.x, z: p.z, dur: 300 });
    else fate = "wear";
  }
  if (fate === "wear") steps.push({ do: "tfate", id: tr.id, fate: "wear", dur: 20 });
  setPlan(w, c, { goal: "treasure", steps, i: 0 });
}

// Where a nut the creek brought is planted: in the grove if there is one (a tree for the
// founders), otherwise near the water by the village.
function treasureTreeSpot(w, c) {
  let T = w.terrain,
    g = w.grove || null,
    at = g ? { x: g.x, z: g.z } : villageCentre(w);
  for (let k = 0; k < 40; k++) {
    let a = w.rng.range(0, 6.28),
      d = w.rng.range(4, 12) * CF2_SCALE.build,
      x = at.x + Math.cos(a) * d,
      z = at.z + Math.sin(a) * d;
    if (!T.walkable(x, z) || T.edgeDist(x, z) < 3) continue;
    if (w.structures.some((s) => (s.x - x) ** 2 + (s.z - z) ** 2 < (STRUCTURES[s.kind].radius + 1.5) ** 2)) continue;
    if (w.res.some((r) => (r.kind === "tree" || r.kind === "grove" || r.kind === "orchard" || r.kind === "podtree") && (r.x - x) ** 2 + (r.z - z) ** 2 < 9)) continue;
    return { x: +x.toFixed(2), z: +z.toFixed(2) };
  }
  return null;
}

ACTIONS.tfate = {
  start(w, c, step) {
    return makeAct(w, c, step.fate === "wear" ? "look" : "craft", step.dur || 60, {});
  },
  end(w, c, a, step) {
    let tr = treasuresOf(w).find((t) => t.id === step.id);
    if (!tr || tr.st !== "found" || tr.who !== c.id) return true;
    let K = TREASURE_KINDS[tr.k];
    if (step.fate === "set") {
      let d = w.byId[step.sid];
      if (!d) return (step.fate = "wear"), ACTIONS.tfate.end(w, c, a, step);
      tr.sid = d.id;
      treasureNote(tr, "set", [Math.round(w.t), c.name]);
      logEvent(w, 2, `${c.name} set ${K.phrase} into the crest of ${treasureStructName(w, d)}, where everyone would see it.`, [c.id], d, "treasure");
      remember(w, c, "treasure", `I set the stone the creek brought into the dam. It will be there long after me.`, 0.7);
    } else if (step.fate === "keep") {
      let h = w.byId[step.sid];
      tr.sid = h ? h.id : null;
      treasureNote(tr, "kept", [Math.round(w.t), c.name]);
      logEvent(w, 2, `${c.name} put ${K.phrase} on the windowsill at home.`, [c.id], h || c, "treasure");
    } else if (step.fate === "plant") {
      let r = register(w, { id: w.nextId++, kind: "tree", tk: K.tree, variant: K.tree, x: step.x, z: step.z, side: w.terrain.side(step.x, step.z), grow: 0.06, amt: 0, max: 2, canopy: 0.6, space: 2.6, planted: c.id, treasure: tr.id });
      w.res.push(r);
      tr.rid = r.id;
      tr.x = step.x;
      tr.z = step.z;
      treasureNote(tr, "planted", [Math.round(w.t), c.name]);
      logEvent(w, 2, `${c.name} planted ${K.phrase}${w.grove ? " in the grove" : " near the water"}.`, [c.id], r, "treasure");
      remember(w, c, "treasure", `I planted what the creek brought. Maybe it will grow into a tree.`, 0.7);
      if (typeof discover === "function" && !c.know.planting) discover(w, c, "planting", null);
    } else {
      wearTreasure(w, c, tr);
    }
    return true;
  },
};

function wearTreasure(w, c, tr) {
  let K = TREASURE_KINDS[tr.k];
  c.treasure = K.label.replace(/^A |^An /, "").toLowerCase();
  c.treasureId = tr.id;
  tr.who = c.id;
  tr.whoName = c.name;
  treasureNote(tr, "worn", [Math.round(w.t), c.name]);
}

// Every life tick: young trees grown from what the creek brought grow; a treasure someone
// found but never got round to placing is simply worn (or, if they're gone, lost with them).
function treasureTick(w) {
  for (let tr of w.treasures || []) {
    if (tr.st === "found" && w.t - tr.foundT > 0.5 * 86400) {
      let c = w.byId[tr.who];
      if (c && !c.visitor && !(c.plan && c.plan.goal === "treasure")) {
        if (TREASURE_KINDS[tr.k].fate === "plant" && !tr.replan) (tr.replan = 1), treasureFate(w, c, tr);
        else if (c.treasureId && c.home != null && w.byId[c.home]) (tr.sid = c.home), treasureNote(tr, "kept", [Math.round(w.t), c.name]);
        else if (!c.treasureId) wearTreasure(w, c, tr);
      } else if (!c) treasureNote(tr, "away", [Math.round(w.t), tr.whoName]);
      continue;
    }
    if (tr.st !== "planted" || tr.rid == null) continue;
    let r = w.byId[tr.rid];
    if (!r || r.grow == null) continue;
    r.grow = +Math.min(1, r.grow + LIFE.tick / (TREASURE.growDays * 86400)).toFixed(5);
    r.canopy = +(0.6 + 1.4 * r.grow).toFixed(2);
    if (r.grow >= 1) {
      delete r.grow;
      r.amt = 1;
      logEvent(w, 2, `The ${TREASURE_KINDS[tr.k].tree === "syc" ? "sycamore" : TREASURE_KINDS[tr.k].tree === "pecan" ? "pecan" : "oak"} that grew from what the creek brought is a young tree now.`, [], r, "treasure");
    }
  }
}

// When the one who wears a treasure passes on, a child wears it next, or it's laid at their
// tree in the grove; one who goes downstream takes it with them.
var cf2TreasurePassOn = passOn;
passOn = function (w, c) {
  let id = c.treasureId,
    kids = (c.children || []).map((k) => w.byId[k]).filter((k) => k && !k.visitor && !k.treasureId && !k.leaving);
  cf2TreasurePassOn(w, c);
  let tr = id != null && treasuresOf(w).find((t) => t.id === id);
  if (!tr || tr.st !== "worn") return;
  let heir = kids.sort((a, b) => (a.born ?? 0) - (b.born ?? 0))[0];
  if (heir) {
    wearTreasure(w, heir, tr);
    logEvent(w, 2, `${heir.name} wears ${c.name}'s ${heir.treasure} now.`, [heir.id], heir, "treasure");
    remember(w, heir, "treasure", `I wear ${c.name}'s ${heir.treasure}. The creek gave it to them.`, 0.8);
  } else {
    let rec = (w.lineage || {})[c.id],
      tree = rec && rec.tree != null ? w.byId[rec.tree] : null;
    tr.who = null;
    tr.rid = tree ? tree.id : null;
    if (tree) (tr.x = tree.x), (tr.z = tree.z);
    treasureNote(tr, "grove", [Math.round(w.t), c.name]);
  }
};
var cf2TreasureDepart = depart;
depart = function (w, c) {
  let tr = c.treasureId != null && treasuresOf(w).find((t) => t.id === c.treasureId);
  if (tr && tr.st === "worn") treasureNote(tr, "away", [Math.round(w.t), c.name]);
  return cf2TreasureDepart(w, c);
};

// ---- after a storm, they go and look ----------------------------------------------------

function searchOption(w, c) {
  let f = w.creek && w.creek.flood;
  if (!f || !(w.stats.treasures > 0) || c.visitor || c.leaving || c.farewell || c.asleep || isNight(w.t)) return null;
  let since = w.t - f.t0;
  if (since < 0.5 * VALLEY_DAY / 24 || since > TREASURE.searchHours * VALLEY_DAY / 24) return null;
  if ((c.searchedFlood || 0) === f.t0 || c.needs.energy < 0.3) return null;
  let b = beliefsOf(c),
    keen = b.giver * 0.8 + c.temp.curiosity * 0.4 + (c.interests.collecting || 0) * 0.3 + (w.customs && w.customs.search && w.customs.search.custom ? 0.3 : 0);
  if (keen < 0.6) return null;
  c.searchedFlood = f.t0;
  let ns = w.creek.nodes,
    lo = creekNodeIndex(4),
    hi = creekNodeIndex(VL - 8),
    near = creekNodeIndex(c.z),
    known = (w.treasures || []).filter((t) => t.foundT && t.h && t.h.some((e) => e[0] === "bar" || e[0] === "pond" || e[0] === "floor")).map((t) => t.foundAt).filter((i) => i != null),
    // they look where things were found before, and in the still water above the dams, where
    // they have learned the creek lets things go
    ponds = Object.values(w.creek.dams || {}).map((d) => d.i - 3),
    pick = w.rng.next(),
    from = known.length && pick < 0.4 ? w.rng.pick(known) : ponds.length && pick < 0.8 ? w.rng.pick(ponds) : near,
    a = clamp(from + w.rng.int(-6, 4), lo, hi),
    b2 = clamp(a + w.rng.int(8, 22), lo, hi),
    side = c.x < ns[a].x ? -1 : 1,
    pt = (i) => ({ x: ns[i].x + side * (creekTopWidth(ns[i]) / 2 + 0.8), z: ns[i].z });
  let p1 = pt(a),
    p2 = pt(b2);
  if (!w.terrain.walkable(p1.x, p1.z) || !w.terrain.walkable(p2.x, p2.z)) return null;
  return { score: 0.5 + keen * 0.6, plan: { goal: "search", steps: [{ do: "walk", x: p1.x, z: p1.z, near: 1.5, why: "search" }, { do: "walk", x: p2.x, z: p2.z, near: 1.5, why: "search" }, { do: "searched" }] } };
}

ACTIONS.searched = {
  start(w, c) {
    return makeAct(w, c, "look", 3, {});
  },
  end(w, c) {
    let cu = (w.customs = w.customs || {}),
      s = (cu.search = cu.search || { who: [], storms: [], custom: null });
    if (!s.who.includes(c.id)) s.who.push(c.id);
    if (s.who.length > 40) s.who.shift();
    let f = w.creek.flood ? w.creek.flood.t0 : 0;
    if (!s.storms.includes(f)) s.storms.push(f);
    if (s.storms.length > 6) s.storms.shift();
    if (!s.custom && s.who.length >= 4 && s.storms.length >= 3) {
      s.custom = Math.round(w.t);
      logEvent(w, 3, "After every storm now, some of the creekfolk walk the creek's banks to see what it has brought. It has become a custom.", [c.id], c, "custom");
    }
    return true;
  },
};

// Believers leave something at the Giving Place, now and then, after the creek has given.
function offerOption(w, c) {
  let b = c.beliefs;
  if (!b || b.giver < 0.6 || !w.givingPlace || c.visitor || c.leaving || c.farewell || isNight(w.t)) return null;
  if (b.offeredFor === w.giftLast || w.t - (w.giftLast || -1e9) > 2 * 86400) return null;
  if (!w.rng.chance(0.08)) return null;
  let gp = w.givingPlace;
  return { score: 0.45 + 0.3 * b.giver, plan: { goal: "offer", steps: [{ do: "walk", x: gp.x, z: gp.z, near: 1.2, why: "offer" }, { do: "offer" }] } };
}

var cf2TreasureOptions = lifeOptions3C;
lifeOptions3C = function (w, c) {
  let out = cf2TreasureOptions(w, c),
    s = searchOption(w, c),
    o = offerOption(w, c);
  if (s) out.push(["search", s]);
  if (o) out.push(["offer", o]);
  return out;
};

// ---- Creekfolk 1's belief, retuned for treasures ------------------------------------------

Object.assign(GIFT, {
  restDays: 10, // "the creek is resting" after about a valley year and a bit without a find
  beyondGifts: 10, // the one who suspects: after about ten treasures (Decision 6) ...
  beyondDays: 12, // ... and some days since the first
});
// No standing requests and no keeping watch for a gift that's due: treasures are rare and
// unpaced (the brief), they come with the floods.
giftRequests = function () {};
watchOption = function () {
  return null;
};
// Creekfolk 1 asks for seven gifts in the last fortnight; at a treasure every two days or more
// (and only when it floods), three is a steady giving.
beyondTick = function (w) {
  let total = w.stats.treasures || 0;
  if (total < GIFT.beyondGifts || w.t - (w.firstGiftAt ?? w.t) < GIFT.beyondDays * 86400) return;
  if (w.creatures.some((c) => !c.visitor && c.beliefs && c.beliefs.beyond)) return;
  let recent = (w.gifts || []).filter((g) => w.t - g.t < 14 * 86400).length;
  if (recent < 3) return;
  let pool = believers(w).filter((c) => c.stage !== "elder" && !c.farewell && !c.leaving && (c.stage === "adult" || ageDays(w, c) > 3));
  if (!pool.length) return;
  let c = pool.sort((a, b) => b.temp.curiosity + b.beliefs.giver + (b.kindSeen || 0) * 0.05 - (a.temp.curiosity + a.beliefs.giver + (a.kindSeen || 0) * 0.05))[0];
  becomeBeyond(w, c, null);
};

var cf2TreasureLifeTick = lifeTick;
lifeTick = function (w) {
  cf2TreasureLifeTick(w);
  treasureFinders(w);
  treasureTick(w);
};

// The dev build: a treasure can be placed now, without the wait.
var cf2TreasureDevTrigger = devTrigger;
devTrigger = function (w, what) {
  if (what === "treasureready") return void (w.lastTreasure = -1e9);
  return cf2TreasureDevTrigger(w, what);
};

// ---- stories ---------------------------------------------------------------------------

var cf2TreasureStoryText = storyText;
storyText = function (w, s, v) {
  if (!s || s.kind !== "treasure") return cf2TreasureStoryText(w, s, v);
  let K = TREASURE_KINDS[v.what] || TREASURE_KINDS[s.truth.what],
    big = v.big || 0,
    why = v.why === "giver" ? `; ${giverName(w)} sent it` : v.why === "creek" ? "; the creek wanted them to have it" : v.why === "elders" ? ", as the elders had said it would" : "";
  return `${v.who} found ${K ? K.phrase : "something"}${v.where ? ` at ${v.where}` : ""} after a storm${why}${big ? (big >= 2 ? ", and it glowed in the dark for three nights" : ", shining in the water like a star") : ""}.`;
};
var cf2TreasureShortAbout = shortAbout;
shortAbout = function (w, s) {
  return s.kind === "treasure" ? `what the creek brought ${s.truth.who}` : cf2TreasureShortAbout(w, s);
};

// ---- where each treasure is now, in plain words (for the page) --------------------------

function treasureWhere(w, tr) {
  let K = TREASURE_KINDS[tr.k],
    who = (id) => (w.byId[id] || (w.lineage || {})[id] || {}).name,
    pl = placeNear(w, tr.x, tr.z, 14),
    near = pl ? ` near ${pl.name}` : "";
  switch (tr.st) {
    case "wait":
      return "In the water at the head of the valley, waiting for the rains to carry it down.";
    case "bar":
      return `The flood left it on a gravel bar${near}. No one has found it yet.`;
    case "pond":
      return `It settled in the shallows of a pond${near}. No one has found it yet.`;
    case "floor":
      return `The flood left it in the grass beside the creek${near}. No one has found it yet.`;
    case "found":
      return `${tr.byName} found it, and has it with them.`;
    case "worn":
      return `${who(tr.who) || tr.whoName} wears it${tr.by !== tr.who ? `; ${tr.byName} found it` : ""}.`;
    case "kept": {
      let h = w.byId[tr.sid];
      return h ? `On the windowsill of ${treasureStructName(w, h)}; ${tr.byName} found it.` : `${tr.byName} kept it at home.`;
    }
    case "set": {
      let d = w.byId[tr.sid];
      return `Set into the crest of ${d ? treasureStructName(w, d) : "a dam"} by ${tr.byName}.`;
    }
    case "planted": {
      let r = w.byId[tr.rid];
      return r ? (r.grow != null ? `${tr.byName} planted it${w.grove ? " in the grove" : ""}; a sapling now.` : `${tr.byName} planted it${w.grove ? " in the grove" : ""}; it is a young tree now.`) : `${tr.byName} planted it.`;
    }
    case "grove": {
      let last = tr.h && tr.h[tr.h.length - 1];
      return `Laid at ${last && last[2] ? last[2] + "'s" : "a"} tree in the grove.`;
    }
    case "buried": {
      let last = tr.h && tr.h[tr.h.length - 1],
        when = last ? seasonAt(w, last[1]) : null;
      return `Buried in the mud of the creek's bank${near}, under ${when ? `a flood of ${when.name}, year ${when.year}` : "a flood"}. Tap the creek there to see it.`;
    }
    case "away": {
      let last = tr.h && tr.h[tr.h.length - 1];
      return `${last && last[2] ? last[2] : "Someone"} took it with them when they went on downstream.`;
    }
  }
  return "";
}

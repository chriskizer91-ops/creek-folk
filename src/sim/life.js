// ==========================================================================
// Lives: ages, stages, births, passings and leaving downstream.
//
// Every creekfolk lives about a real month. Children (first week) are small and
// learn by watching; adults (to day 24) build, pair up and raise children; wise
// elders (last week or so) slow down, rest and teach. Passing is peaceful and
// expected: the creekfolk goes to a place it loved, family and friends come to
// sit with it, and a tree is planted for it in the memorial grove.
//
// When the valley is full, young adults choose to go downstream. They leave the
// simulation, but the village remembers where they went (world.downstream).
//
// Everything here runs inside the event heap (event kind "L"), using the
// world's seeded random numbers, so a replayed stretch of time ends exactly
// where a live one would.
// ==========================================================================

var LIFE = {
  tick: 600,              // seconds between life checks (10 real minutes)
  childDays: 7,           // real days as a child
  elderDays: 24,          // age when a creekfolk becomes a wise elder
  lifespanDays: 30,       // average length of a life
  lifespanSpread: 0.8,    // standard deviation, days (clamped to +/- 1.6)
  pairBirthDays: 6.0,     // a pair with room has a child about this often (tuned by tools/year.cjs)
  pairWarmth: 0.4,        // mutual warmth needed to pair up
  settleDays: 2,          // after this many days grown, a good friend is enough
  friendWarmth: 0.15,     // ...meaning this much mutual warmth
  floorAdults: 4,
  roomFill: 0.75,         // below this share of capacity, births come a little faster ...
  roomBoost: 1.35,        // ... by this much (Phase 3A: capacity now grows as the creek heals)         // below this many adults, births speed up (the valley never empties)
  maxCapacity: 36,        // upper limit, set from the catch-up benchmark
  restlessDays: 3,        // when the valley is nearly full, someone chooses to leave about this often
  founders: 5,
  founderAges: [8, 9.5, 11, 12.5, 14],
};

var DAY_S = 86400;

function ageDays(w, c, t = w.t) {
  return (t - (c.born ?? 0)) / DAY_S;
}

function stageOf(w, c, t = w.t) {
  let a = ageDays(w, c, t);
  return a < LIFE.childDays ? "child" : a < LIFE.elderDays ? "adult" : "elder";
}

// Size of the body relative to a grown adult: children grow through their first week.
function bodyScale(w, c, t = w.t) {
  let a = ageDays(w, c, t);
  if (a >= LIFE.childDays) return 1;
  return 0.55 + 0.45 * smoothstep(0, LIFE.childDays, a);
}

// Names: the old founders' names first, then gentle made-up ones in the same spirit.
var NAME_START = ["Ash", "Bri", "Cal", "Dew", "Ell", "Fen", "Gil", "Hal", "Ivy", "Jun", "Kip", "Lin", "Mab", "Nell", "Oak", "Pim", "Quin", "Rill", "Sol", "Tam", "Umb", "Vel", "Wil", "Yar", "Zin", "Bram", "Cob", "Dill", "Fern", "Hap", "Lark", "Mo", "Nib", "Pell", "Rue", "Sky", "Tib", "Wick"];
var NAME_END = ["", "", "a", "o", "y", "ie", "et", "in", "en", "el", "ly", "wyn", "ble", "kin", "ra", "lo", "mo", "sy", "ter", "ow", "ley", "rin"];

function newName(w, parents = []) {
  let rng = w.rng,
    living = new Set(w.creatures.map((c) => c.name));
  // Sometimes a child is named for someone the parents loved who has passed.
  if (parents.length && rng.chance(0.18)) {
    let honored = [];
    for (let p of parents)
      for (let id in p.rel) {
        let gone = w.lineage && w.lineage[id];
        if (gone && gone.died && p.rel[id].warmth > 0.4 && !living.has(gone.name)) honored.push(gone);
      }
    if (honored.length) {
      let g = rng.pick(honored);
      return { name: g.name, honors: g.id };
    }
  }
  for (let k = 0; k < 40; k++) {
    let n = rng.pick(NAME_START) + rng.pick(NAME_END);
    n = n.slice(0, 8);
    if (!living.has(n) && !(w.usedNames || {})[n]) return { name: n };
  }
  for (let k = 0; ; k++) {
    let n = rng.pick(NAME_START) + rng.pick(NAME_END);
    if (!living.has(n)) return { name: n };
  }
}

// A permanent, compact record of everyone who has lived in the valley.
function lineageRecord(w, c) {
  w.lineage = w.lineage || {};
  let r = w.lineage[c.id];
  if (!r)
    r = w.lineage[c.id] = {
      id: c.id,
      name: c.name,
      born: Math.round(c.born ?? 0),
      parents: (c.parents || []).slice(),
      gen: c.gen || 0,
      sig: c.sig,
    };
  return r;
}

// Give a creature its life fields. Used for founders, births and old saves.
function initLife(w, c, born, opts = {}) {
  c.born = born;
  let spread = clamp(w.rng.normal() * LIFE.lifespanSpread, -1.6, 1.6);
  c.lifespan = Math.round((LIFE.lifespanDays + spread) * DAY_S);
  c.parents = opts.parents || [];
  c.children = [];
  c.partner = null;
  c.gen = opts.gen || 0;
  c.adultStrength = c.adultStrength || c.strength;
  c.stage = stageOf(w, c);
  lineageRecord(w, c);
  (w.usedNames = w.usedNames || {})[c.name] = 1;
}

// ---------------------------------------------------------------------------
// The life check: runs every LIFE.tick seconds as heap event "L".
// ---------------------------------------------------------------------------
function lifeTick(w) {
  let t = w.t;
  schedule(w, t + LIFE.tick, "L");
  noteSeason(w);
  for (let c of w.creatures.slice()) growUp(w, c);
  keepOnTheirWay(w);
  pairUp(w);
  travelers(w);
  births(w);
  farewells(w);
  leaving(w);
  housing(w);
  mindsTick(w); // stories, myths, visitors (minds.js)
  giftTick(w); // gifts that stopped, found objects (gift.js)
  templeTick(w); // BELIEF: the temple, the great project, the spring (temple.js)
  lifeTick3C(w); // 3C: beavers, the sky calendar, the Returning (returning.js)
  w.popLog = w.popLog || [];
  if (!w.popLog.length || t - w.popLog[w.popLog.length - 1].t >= DAY_S / 4) {
    let s = stageCounts(w);
    w.popLog.push({ t: Math.round(t), n: w.creatures.length, c: s.child, a: s.adult, e: s.elder, cap: valleyCapacity(w) });
    if (w.popLog.length > 1600) w.popLog.splice(0, w.popLog.length - 1600);
  }
}

function stageCounts(w) {
  let s = { child: 0, adult: 0, elder: 0 };
  for (let c of w.creatures) if (!c.visitor) s[stageOf(w, c)]++;
  return s;
}

function noteSeason(w) {
  let s = seasonAt(w);
  if (w.season !== s.name) {
    let first = !w.season;
    w.season = s.name;
    if (!first) w.gatherPending = { season: s.name, t: Math.round(w.t) }; // MINDS: they gather when the season turns
    if (!first)
      logEvent(w, 3, {
        spring: "Spring has come to the valley.",
        summer: "Summer has come to the valley.",
        autumn: "Autumn has come to the valley.",
        winter: "Winter has come to the valley.",
      }[s.name], [], null, "season");
  }
}

function growUp(w, c) {
  let st = stageOf(w, c);
  looksGrow(w, c, st); // 3C: grown-ups wear something for what they love (looks.js)
  if (st === "child") {
    // Strength grows with the body.
    c.strength = +(c.adultStrength * (0.35 + 0.65 * smoothstep(0, LIFE.childDays, ageDays(w, c)))).toFixed(3);
  }
  if (st === c.stage) return;
  let was = c.stage;
  c.stage = st;
  if (st === "adult" && was === "child") {
    c.strength = c.adultStrength;
    logEvent(w, 2, `${c.name} is all grown up.`, [c.id], c, "life");
    remember(w, c, "life", "I am grown now. I can build and carry like the others.", 0.6);
  } else if (st === "elder") {
    // Elders slow down and grow patient.
    c.temp.activity = +(c.temp.activity * 0.72).toFixed(3);
    c.temp.patience = +clamp(c.temp.patience + 0.2, 0, 1).toFixed(3);
    c.strength = +(c.adultStrength * 0.75).toFixed(3);
    logEvent(w, 2, `${c.name} has become one of the valley's wise elders.`, [c.id], c, "life");
    remember(w, c, "life", "My steps are slower now. There is more time for watching, and for telling.", 0.6);
  }
}

function isRelated(a, b) {
  if ((a.parents || []).includes(b.id) || (b.parents || []).includes(a.id)) return true;
  return (a.parents || []).some((p) => (b.parents || []).includes(p));
}

function pairUp(w) {
  let adults = w.creatures.filter((c) => stageOf(w, c) === "adult" && !c.partner && !c.leaving && !c.farewell && !c.visitor);
  if (adults.length < 2) return;
  let few = adults.length + w.creatures.filter((c) => c.partner).length < LIFE.floorAdults;
  for (let a of adults) {
    if (a.partner) continue;
    // Falling for someone takes real warmth; after a couple of days grown, a good friend will do.
    let settled = ageDays(w, a) > LIFE.childDays + LIFE.settleDays;
    let best = null,
      bestW = few ? 0.15 : settled ? LIFE.friendWarmth : LIFE.pairWarmth;
    for (let b of adults) {
      if (b === a || b.partner || isRelated(a, b)) continue;
      let ra = a.rel[b.id],
        rb = b.rel[a.id];
      if (!ra || !rb) continue;
      let m = Math.min(ra.warmth, rb.warmth);
      if (m > bestW) (bestW = m), (best = b);
    }
    if (best) {
      a.partner = best.id;
      best.partner = a.id;
      logEvent(w, 3, `${a.name} and ${best.name} have paired up.`, [a.id, best.id], a, "life");
      remember(w, a, "life", `${best.name} and I belong together now.`, 0.8, { who: best.id });
      remember(w, best, "life", `${a.name} and I belong together now.`, 0.8, { who: a.id });
      warmTo(a, best, 0.1);
      warmTo(best, a, 0.1);
    }
  }
}

// How many creekfolk the valley can hold right now: homes, food and room.
function valleyCapacity(w) {
  let homes = 0,
    food = 0;
  for (let s of w.structures) {
    if (s.kind === "home" && s.level > 0) homes++;
    if (s.kind === "store" && s.level > 0) food += Math.min(3, s.level);
    if (s.kind === "garden" && s.level > 0) food += Math.min(4, s.level);
  }
  let shelter = clamp(8 + 4 * homes + 2 * food, 8, LIFE.maxCapacity);
  // CREEK: and no more than the land can feed, which grows as the creek heals
  return Math.min(shelter, creekFeed(w));
}

// The two ceilings, for the village panel and the dev menu.
function capacityParts(w) {
  let homes = 0,
    food = 0;
  for (let s of w.structures) {
    if (s.kind === "home" && s.level > 0) homes++;
    if (s.kind === "store" && s.level > 0) food += Math.min(3, s.level);
    if (s.kind === "garden" && s.level > 0) food += Math.min(4, s.level);
  }
  return { shelter: clamp(8 + 4 * homes + 2 * food, 8, LIFE.maxCapacity), feed: creekFeed(w) };
}

function births(w) {
  let pairs = [];
  for (let c of w.creatures) {
    let p = c.partner && w.byId[c.partner];
    if (p && c.id < p.id && !c.visitor && stageOf(w, c) === "adult" && stageOf(w, p) === "adult" && !c.leaving && !p.leaving && !c.farewell && !p.farewell) pairs.push([c, p]);
  }
  let adults = w.creatures.filter((c) => !c.visitor && stageOf(w, c) === "adult").length,
    boost = adults < LIFE.floorAdults ? 2.5 : 1;
  // Births go on when the valley is full (young adults leave to make room), but pause
  // if it is badly overcrowded.
  let pop = w.creatures.filter((c) => !c.visitor).length;
  if (pop >= valleyCapacity(w) + 6) return;
  // Fewer births once the valley is nearly full: pairs have children about every
  // pairBirthDays until it is 85% full, then up to two and a half times less often.
  let fill = pop / valleyCapacity(w),
    crowd = 1 + 1.5 * clamp((fill - 0.85) / 0.15, 0, 1);
  // CREEK: room to grow (the land can feed more than live here): a few more children
  let room = fill < LIFE.roomFill ? LIFE.roomBoost : 1;
  let p = (LIFE.tick / (LIFE.pairBirthDays * crowd * DAY_S)) * boost * room;
  for (let [a, b] of pairs) if (w.rng.chance(p)) bear(w, a, b);
}

function mixTemp(w, a, b) {
  let out = {};
  for (let k in a.temp) out[k] = +clamp((a.temp[k] + b.temp[k]) / 2 + w.rng.normal() * 0.15, 0.08, 0.95).toFixed(3);
  return out;
}

function bear(w, a, b) {
  let home = homeOf(w, a) || homeOf(w, b),
    at = home ? { x: home.x + w.rng.range(-0.8, 0.8), z: home.z + w.rng.range(-0.8, 0.8) } : { x: a.x, z: a.z };
  if (!w.terrain.walkable(at.x, at.z)) at = { x: a.x, z: a.z };
  let nm = newName(w, [a, b]);
  let c = register(w, makeFolk(w, nm.name, at.x, at.z));
  // Inherit: temperament mixes both parents; accent comes from one of them; looks blend.
  c.temp = mixTemp(w, a, b);
  let src = w.rng.chance(0.5) ? a : b;
  c.accent = JSON.parse(JSON.stringify(src.accent));
  c.accent.pitch = +(c.accent.pitch * 1.18).toFixed(3); // small voices
  let la = a.look,
    lb = b.look;
  for (let k of ["sat", "light", "size", "ear", "earW", "hands", "belly", "eye"])
    c.look[k] = +clamp((la[k] + lb[k]) / 2 + w.rng.normal() * 0.05, 0.2, 1.5).toFixed(3);
  let dh = ((lb.hue - la.hue + 1.5) % 1) - 0.5;
  c.look.hue = +(((la.hue + dh * w.rng.range(0.3, 0.7) + w.rng.normal() * 0.03) % 1 + 1) % 1).toFixed(3);
  c.look.tail = w.rng.chance(0.5) ? la.tail : lb.tail;
  c.look.spots = w.rng.chance(0.5) ? la.spots : lb.spots;
  looksInherit(w, c, a, b); // 3C: fur, coat and markings from one parent or the other (looks.js)
  for (let k in c.interests) c.interests[k] = +clamp((a.interests[k] + b.interests[k]) / 2 + w.rng.normal() * 0.12, 0.05, 0.95).toFixed(3);
  c.fearWater = +clamp(0.35 + c.temp.caution * 0.4, 0.05, 0.9).toFixed(3);
  initLife(w, c, w.t, { parents: [a.id, b.id], gen: Math.max(a.gen || 0, b.gen || 0) + 1 });
  inheritBelief(w, c, a, b); // BELIEF: children grow up with their family's belief (gift.js)
  if (nm.honors) c.honors = nm.honors;
  c.home = null;
  c.sleepSpot = home ? { x: home.x, z: home.z } : null;
  // Family warmth from the start.
  for (let p of [a, b]) {
    let r = relation(c, p);
    r.warmth = 0.75;
    r.fam = 0.6;
    let q = relation(p, c);
    q.warmth = 0.85;
    q.fam = 0.6;
    p.children = p.children || [];
    p.children.push(c.id);
    remember(w, p, "life", `Our little one, ${c.name}, was born.`, 0.9, { who: c.id, x: at.x, z: at.z, pv: 0.4 });
  }
  for (let sid of new Set([...(a.children || []), ...(b.children || [])])) {
    let s = w.byId[sid];
    if (!s || s === c) continue;
    relation(c, s).warmth = 0.45;
    relation(s, c).warmth = Math.max(relation(s, c).warmth, 0.45);
    relation(c, s).fam = relation(s, c).fam = 0.3;
  }
  w.creatures.push(c);
  w.stats.births = (w.stats.births || 0) + 1;
  let honor = nm.honors && w.lineage[nm.honors] ? `, named for ${w.lineage[nm.honors].name}` : "";
  logEvent(w, 3, `A little one was born to ${a.name} and ${b.name}: ${c.name}${honor}.`, [c.id, a.id, b.id], at, "birth");
  // Wake up a minute later, like the founders did.
  c.asleep = true;
  c.act = { type: "nap", step: "nap", t0: w.t, t1: w.t + 60, x: c.x, z: c.z, tok: c.tok, rc0: rainTotal(w, w.t) };
  schedule(w, w.t + 60, "A", c.id, c.tok);
  return c;
}

// ---------------------------------------------------------------------------
// Passing.
// ---------------------------------------------------------------------------

// The place a creekfolk loved most: its warmest remembered spot, else home, else the creek.
function lovedPlace(w, c) {
  let best = null,
    v = 0.15;
  for (let k in c.places) {
    if (c.places[k] > v) {
      let [gx, gz] = k.split(",").map(Number);
      let p = { x: gx * 6 + 3, z: gz * 6 + 3 };
      if (w.terrain.walkable(p.x, p.z)) (v = c.places[k]), (best = p);
    }
  }
  if (best) return best;
  let h = homeOf(w, c);
  if (h && h.level > 0) return { x: h.x + 0.8, z: h.z + 0.6 };
  return w.terrain.bankPoint(w.terrain.side(c.x, c.z), clamp(c.z, 8, VL - 8), 1.4);
}

function canBeInterrupted(c) {
  return !c.act || !UNINTERRUPTIBLE.has(c.act.type) || c.act.type === "sleep";
}

function farewells(w) {
  for (let c of w.creatures) {
    if (c.farewell || c.leaving || c.visitor) continue;
    if (w.t - (c.born ?? 0) < c.lifespan) continue;
    if (c.asleep || !canBeInterrupted(c)) continue; // wait until it wakes, or finishes what it's doing
    let spot = lovedPlace(w, c);
    c.farewell = { t: w.t, x: +spot.x.toFixed(2), z: +spot.z.toFixed(2) };
    setPlan(w, c, {
      goal: "farewell",
      steps: [
        { do: "walk", x: spot.x, z: spot.z, near: 0.2, why: "farewell" },
        { do: "farewell" },
      ],
      i: 0,
    });
    // Family and close friends come to sit with them.
    for (let o of w.creatures) {
      if (o === c || o.farewell || o.leaving || o.visitor || o.asleep || !canBeInterrupted(o)) continue;
      let r = o.rel[c.id];
      let family = (c.children || []).includes(o.id) || (c.parents || []).includes(o.id) || c.partner === o.id;
      if (!family && !(r && r.warmth > 0.35)) continue;
      let a = w.rng.range(0, 6.28),
        d = w.rng.range(0.9, 1.6);
      let sx = spot.x + Math.cos(a) * d,
        sz = spot.z + Math.sin(a) * d;
      if (!w.terrain.walkable(sx, sz)) (sx = spot.x), (sz = spot.z);
      setPlan(w, o, {
        goal: "vigil",
        with: c.id,
        steps: [
          { do: "walk", x: sx, z: sz, near: 0.2, why: "vigil" },
          { do: "vigil", id: c.id },
        ],
        i: 0,
      });
    }
  }
}

function passOn(w, c) {
  let age = ageDays(w, c),
    near = w.creatures.filter((o) => o !== c && o.act && o.plan && o.plan.goal === "vigil" && o.plan.with === c.id);
  let rec = lineageRecord(w, c);
  w.lastPassing = Math.round(w.t);
  passBeyond(w, c); // BELIEF: the one who believes in you passes it on (gift.js)
  rec.died = Math.round(w.t);
  rec.age = +age.toFixed(1);
  rec.children = (c.children || []).slice();
  rec.partner = c.partner;
  rec.how = "passed";
  // The tree in the memorial grove.
  let tree = groveTree(w, c);
  if (tree) rec.tree = tree.id;
  // Memories for everyone who loved them.
  for (let o of w.creatures) {
    if (o === c) continue;
    let r = o.rel[c.id];
    let family = (c.children || []).includes(o.id) || (c.parents || []).includes(o.id) || c.partner === o.id;
    if (!family && !(r && r.warmth > 0.3)) continue;
    let sat = near.includes(o);
    let who = (c.parents || []).includes(o.id) ? `our child ${c.name}` : (c.children || []).includes(o.id) ? `my parent ${c.name}` : c.partner === o.id ? c.name : c.name;
    remember(
      w,
      o,
      "passing",
      sat ? `I sat with ${who} at the end. It was quiet, and it was all right.` : `${c.name[0].toUpperCase() + c.name.slice(1)} has passed on. I will miss them.`,
      family ? 0.95 : 0.7,
      { who: c.id, x: c.farewell ? c.farewell.x : c.x, z: c.farewell ? c.farewell.z : c.z, pv: 0.35 },
    );
    feel(o, w, "sad", family ? 0.4 : 0.25);
    if (o.partner === c.id) o.partner = null;
  }
  let words = near.length
    ? `, with ${nameList(w, near.map((o) => o.id))} beside them`
    : "";
  storyPassing(w, c, near); // MINDS
  let offer = passingOfferings(w, c, near); // MINDS: customs at a passing
  let kids = (c.children || []).length;
  logEvent(
    w,
    3,
    `${c.name} passed on peacefully${words}. They lived ${Math.round(age)} days${kids ? ` and leave ${kids} ${kids === 1 ? "child" : "children"}` : ""}. A young tree was planted for them in the grove.${offer}`,
    [c.id, ...near.map((o) => o.id)],
    c.farewell || c,
    "passing",
  );
  w.stats.passings = (w.stats.passings || 0) + 1;
  for (let o of near) if (o.plan && o.plan.goal === "vigil") o.plan.i = o.plan.steps.length;
  retire(w, c);
}

// Where the grove is: a gentle slope away from the village, chosen once.
function grovePlace(w) {
  if (w.grove) return w.grove;
  let T = w.terrain,
    best = null,
    bestS = -1e9,
    rng = new Rng(w.seed + ":grove");
  for (let k = 0; k < 200; k++) {
    let x = rng.range(6, VW - 6),
      z = rng.range(6, VL - 6);
    if (!T.walkable(x, z)) continue;
    let r = T.valleyR(x, z),
      e = T.edgeDist(x, z);
    // CREEK: on the terrace slopes, off the valley floor (which turns to wetland)
    if (r < 0.45 || r > 0.8 || e < 5 || T.floorWeight(x, z) > 0.05) continue;
    let crowd = 0;
    for (let s of w.structures) crowd += Math.max(0, 9 - Math.hypot(s.x - x, s.z - z));
    let s = -crowd - Math.abs(r - 0.68) * 20 - Math.hypot(x - w.meadow.x, z - w.meadow.z) * 0.12 + rng.range(0, 2);
    if (s > bestS) (bestS = s), (best = { x: +x.toFixed(2), z: +z.toFixed(2), n: 0 });
  }
  w.grove = best || { x: w.meadow.x + 8, z: w.meadow.z + 8, n: 0 };
  return w.grove;
}

function groveTree(w, c) {
  let g = grovePlace(w);
  // Trees spiral out from the center, a little apart, family near family.
  for (let k = 0; k < 60; k++) {
    let n = g.n++,
      a = n * 2.39996,
      r = 0.7 * Math.sqrt(n + 0.5);
    let x = g.x + Math.cos(a) * r,
      z = g.z + Math.sin(a) * r;
    if (!w.terrain.walkable(x, z)) continue;
    if (w.givingPlace && Math.hypot(x - w.givingPlace.x, z - w.givingPlace.z) < TEMPLE_ROOM) continue; // BELIEF: the temple's ground stays clear
    let hall = w.ancestors && w.byId[w.ancestors.sid];
    if (hall && Math.hypot(x - hall.x, z - hall.z) < 6.5) continue; // ... and the Hall of the Ancestors'
    let tree = register(w, {
      id: w.nextId++,
      kind: "grove",
      x: +x.toFixed(2),
      z: +z.toFixed(2),
      side: w.terrain.side(x, z),
      who: c.id,
      name: c.name,
      planted: Math.round(w.t),
      hue: c.look.hue,
    });
    w.res.push(tree);
    return tree;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Leaving downstream.
// ---------------------------------------------------------------------------
function leaving(w) {
  let cap = valleyCapacity(w),
    n = w.creatures.filter((c) => !c.leaving && !c.farewell && !c.visitor).length,
    over = n - cap;
  // Over capacity, someone must go. Nearly full, a restless young one may choose to,
  // about once every few days.
  if (over <= 0 && !(n >= cap * 0.85 && w.rng.chance(LIFE.tick / (LIFE.restlessDays * DAY_S)))) return;
  if (w.creatures.some((c) => c.leaving)) return; // one at a time
  let young = w.creatures.filter((c) => {
    let a = ageDays(w, c);
    return a >= LIFE.childDays && a < LIFE.childDays + 7 && !c.farewell && !c.visitor && !c.asleep && canBeInterrupted(c) && !(c.children || []).some((k) => w.byId[k] && stageOf(w, w.byId[k]) === "child");
  });
  if (!young.length && over > 2)
    young = w.creatures.filter((c) => stageOf(w, c) === "adult" && !c.visitor && !c.farewell && !c.asleep && canBeInterrupted(c) && !(c.children || []).some((k) => w.byId[k] && stageOf(w, w.byId[k]) === "child"));
  if (!young.length) return;
  let c = w.rng.weighted(young, (y) => 0.2 + y.temp.curiosity + y.interests.exploring + (y.partner ? -0.3 : 0.3));
  if (!c) return;
  let mate = c.partner && w.byId[c.partner];
  let edge = downstreamEdge(w, c);
  c.leaving = { t: w.t, x: edge.x, z: edge.z, with: mate && !mate.leaving && stageOf(w, mate) === "adult" && canBeInterrupted(mate) && !mate.asleep ? mate.id : null };
  let goers = [c];
  if (c.leaving.with) {
    mate.leaving = { t: w.t, x: edge.x + 0.6, z: edge.z, with: c.id };
    goers.push(mate);
  }
  for (let g of goers)
    setPlan(w, g, {
      goal: "leave",
      steps: [
        { do: "walk", x: g.leaving.x, z: g.leaving.z, near: 0.3, why: "leave" },
        { do: "depart" },
      ],
      i: 0,
    });
  // Family and friends walk with them to the edge of the valley.
  for (let o of w.creatures) {
    if (goers.includes(o) || o.farewell || o.leaving || o.asleep || !canBeInterrupted(o)) continue;
    let close = goers.some((g) => (o.rel[g.id] && o.rel[g.id].warmth > 0.45) || (g.parents || []).includes(o.id));
    if (!close) continue;
    let a = w.rng.range(0, 6.28);
    setPlan(w, o, {
      goal: "vigil",
      with: c.id,
      steps: [
        { do: "walk", x: edge.x + Math.cos(a) * 1.6, z: edge.z - 1.5 + Math.sin(a) * 0.8, near: 0.3, why: "sendoff" },
        { do: "vigil", id: c.id, dur: 40 },
      ],
      i: 0,
    });
  }
  logEvent(
    w,
    3,
    goers.length > 1
      ? `${c.name} and ${mate.name} have decided to follow the creek downstream, to see where it goes.`
      : `${c.name} has decided to follow the creek downstream, to see where it goes.`,
    goers.map((g) => g.id),
    c,
    "leaving",
  );
}

function downstreamEdge(w, c) {
  let T = w.terrain,
    side = T.side(c.x, c.z);
  for (let z = VL - 3; z > VL - 24; z -= 0.5) {
    let p = T.bankPoint(side, z, 1.2);
    if (T.walkable(p.x, p.z)) return { x: +p.x.toFixed(2), z: +p.z.toFixed(2) };
  }
  return { x: c.x, z: c.z };
}

function depart(w, c) {
  let near = w.creatures.filter((o) => o !== c && o.plan && o.plan.goal === "vigil" && (o.plan.with === c.id || (c.leaving && o.plan.with === c.leaving.with)));
  let rec = lineageRecord(w, c);
  rec.left = Math.round(w.t);
  passBeyond(w, c); // BELIEF: the one who believes in you passes it on before going
  rec.age = +ageDays(w, c).toFixed(1);
  rec.children = (c.children || []).slice();
  rec.partner = c.partner;
  rec.how = "downstream";
  w.downstream = w.downstream || [];
  w.downstream.push({ id: c.id, name: c.name, t: Math.round(w.t), with: c.leaving && c.leaving.with, snap: snapshotForVisits(w, c) });
  newStory(w, "leaving", { who: c.name }, c, 1, witnessesNear(w, c, 8, near)); // MINDS
  if (!(w.placeNames || []).some((p) => p.kind === "leaving")) namePlace(w, "the Leaving Bank", c, "leaving", 4, near[0] || null);
  if (w.downstream.length > 400) w.downstream.splice(0, w.downstream.length - 400);
  for (let o of w.creatures) {
    if (o === c) continue;
    let r = o.rel[c.id];
    if (!r || r.warmth < 0.3) continue;
    remember(w, o, "leaving", `${c.name} went downstream. I wonder what they will find.`, 0.75, { who: c.id, pv: 0.1 });
  }
  if (!c.leaving.logged) {
    let mate = c.leaving.with && w.byId[c.leaving.with];
    if (mate && mate.leaving) mate.leaving.logged = true;
    logEvent(
      w,
      3,
      `${mate ? c.name + " and " + mate.name : c.name} waved goodbye at the edge of the valley and went on downstream${near.length ? `. ${nameList(w, near.map((o) => o.id))} saw them off` : ""}.`,
      [c.id, ...(mate ? [mate.id] : []), ...near.map((o) => o.id)],
      c,
      "leaving",
    );
  }
  w.stats.departed = (w.stats.departed || 0) + 1;
  retire(w, c);
}

// ---------------------------------------------------------------------------
// Taking a creekfolk out of the simulation (passed on or gone downstream).
// ---------------------------------------------------------------------------
function retire(w, c) {
  checkLostSkills(w, c); // MINDS: was this the last one who knew how?
  // Hand on what they owned: to their partner, else a grown child, else an adult without a home.
  for (let s of w.structures) {
    if (s.owner !== c.id) continue;
    let heir = [c.partner, ...(c.children || [])].map((id) => w.byId[id]).find((h) => h && h !== c && !h.leaving && !h.farewell && !w.structures.some((x) => x.kind === s.kind && x.owner === h.id));
    if (!heir) heir = w.creatures.find((h) => h !== c && !h.leaving && !h.farewell && stageOf(w, h) !== "child" && !w.structures.some((x) => x.kind === s.kind && x.owner === h.id));
    if (heir && heir.visitor) heir = null;
    if (heir) {
      s.owner = heir.id;
      if (s.kind === "home") {
        heir.home = s.id;
        heir.sleepSpot = { x: s.x, z: s.z };
      }
    } else s.owner = null;
  }
  for (let o of w.creatures) {
    if (o === c) continue;
    if (o.partner === c.id) o.partner = null;
    if (o.attend && o.attend.id === c.id) o.attend = null;
    if (o.reply && o.reply.to === c.id) o.reply = null;
  }
  c.act = null;
  c.plan = null;
  c.tok++;
  let i = w.creatures.indexOf(c);
  if (i >= 0) w.creatures.splice(i, 1);
  delete w.byId[c.id];
}

// Homeless grown-ups move into an empty home if there is one.
function housing(w) {
  for (let s of w.structures) {
    if (s.kind !== "home" || s.owner || s.level < 1 || s.building) continue;
    let h = w.creatures.find((c) => stageOf(w, c) !== "child" && !c.visitor && !c.leaving && !c.farewell && (c.home == null || !w.byId[c.home]));
    if (!h) continue;
    s.owner = h.id;
    h.home = s.id;
    h.sleepSpot = { x: s.x, z: s.z };
    logEvent(w, 2, `${h.name} has moved into the empty home by the ${w.terrain.edgeDist(s.x, s.z) < 4 ? "creek" : "meadow"}.`, [h.id], s, "life");
  }
}

// ---------------------------------------------------------------------------
// New actions used above.
// ---------------------------------------------------------------------------
ACTIONS.farewell = {
  start(w, c) {
    return makeAct(w, c, "sit", 240, { lookX: c.x + Math.sin(c.face), lookZ: c.z + Math.cos(c.face), last: true });
  },
  end(w, c) {
    passOn(w, c);
    return false;
  },
};
ACTIONS.vigil = {
  start(w, c, step) {
    let o = w.byId[step.id];
    if (!o) return "skip";
    let p = positionAt(o, w.t);
    return makeAct(w, c, "sit", step.dur || 260, { lookX: p.x, lookZ: p.z, lookId: o.id });
  },
  end(w, c) {
    return true;
  },
};
ACTIONS.depart = {
  start(w, c) {
    return makeAct(w, c, "look", 6, { lookX: c.x, lookZ: c.z + 4, icon: "eye" });
  },
  end(w, c) {
    depart(w, c);
    return false;
  },
};

// ---------------------------------------------------------------------------
// Goals by stage: children play and learn rather than build; elders rest and teach.
// Called from decide() for every candidate goal.
// ---------------------------------------------------------------------------
var STAGE_GOALS = {
  child: { work: 0, found: 0, pod: 0.2, craft: 0, garden: 0.3, plant: 0.3, forage: 0.4, share: 0.3, deliver: 1, play: 1.5, social: 1.3, explore: 0.6, rest: 0.8 },
  adult: {},
  elder: { work: 0.55, found: 0.4, pod: 0.4, explore: 0.5, rest: 1.6, social: 1.35, play: 0.7, plant: 1.3, garden: 1.2 },
};
function lifeGoalFactor(w, c, goal) {
  let f = STAGE_GOALS[c.stage || "adult"][goal];
  return f === undefined ? 1 : f;
}

// Elders teach more readily; children learn more readily.
function teachFactor(teller, listener) {
  return (teller.stage === "elder" ? 2 : 1) * (listener.stage === "child" ? 1.6 : 1);
}

// Walking pace by stage.
function stageSpeed(c) {
  return c.stage === "child" ? 0.85 : c.stage === "elder" ? 0.8 : 1;
}

// How grown a memorial tree is: a sapling, a young tree, then a full tree after about six weeks.
function groveStage(w, tree) {
  let d = (w.t - (tree.planted || 0)) / DAY_S;
  return d < 6 ? 1 : d < 40 ? 2 : 3;
}

// A creekfolk on its last walk, or leaving, can be distracted (hunger, a friend asking
// for help). Put it back on its way; after two valley days of distraction, it goes anyway.
function keepOnTheirWay(w) {
  for (let c of w.creatures.slice()) {
    if (c.visitor) continue;
    let goal = c.farewell ? "farewell" : c.leaving ? "leave" : null;
    if (!goal || (c.plan && c.plan.goal === goal)) continue;
    let since = (c.farewell || c.leaving).t;
    if (w.t - since > VALLEY_DAY * 2) {
      if (c.farewell) passOn(w, c);
      else depart(w, c);
      continue;
    }
    if (c.asleep || !canBeInterrupted(c)) continue;
    let spot = c.farewell || c.leaving;
    setPlan(w, c, {
      goal,
      steps: [
        { do: "walk", x: spot.x, z: spot.z, near: 0.3, why: goal },
        { do: goal === "farewell" ? "farewell" : "depart" },
      ],
      i: 0,
    });
  }
}

// ---------------------------------------------------------------------------
// Travelers: the valley never empties. When there are too few grown-ups, or none
// who could pair (everyone left is family), a traveler comes up the creek from
// somewhere downstream and stays. They bring their own way of speaking.
// ---------------------------------------------------------------------------
function travelers(w) {
  let adults = w.creatures.filter((c) => stageOf(w, c) === "adult" && !c.leaving && !c.farewell && !c.visitor);
  let free = adults.filter((c) => !c.partner);
  let canPair = free.some((a) => free.some((b) => a !== b && !isRelated(a, b)));
  let paired = adults.some((c) => c.partner && w.byId[c.partner]);
  // Someone grown and unpaired, with nobody they could pair with (everyone left is family),
  // while the valley still has plenty of room.
  let stuck = free.length >= 1 && !canPair && w.creatures.length < valleyCapacity(w) * 0.6;
  let lonely = adults.length < LIFE.floorAdults || (!paired && !canPair) || stuck;
  if (!lonely) {
    w.lonelySince = null;
    return;
  }
  w.lonelySince = w.lonelySince ?? w.t;
  let wait = adults.length < 2 ? DAY_S * 0.25 : stuck && paired ? DAY_S * 1.5 : DAY_S;
  let spacing = adults.length < LIFE.floorAdults || !paired ? DAY_S * 1.5 : DAY_S * 4;
  if (w.t - w.lonelySince < wait || w.t - (w.lastTraveler || -1e9) < spacing) return;
  arriveTraveler(w);
  w.lastTraveler = w.t;
  w.lonelySince = null;
}

function arriveTraveler(w) {
  let T = w.terrain,
    side = w.rng.chance(0.5) ? 0 : 1,
    at = null;
  for (let z = VL - 4; z > VL - 24 && !at; z -= 0.5) {
    let p = T.bankPoint(side, z, 1.5);
    if (T.walkable(p.x, p.z)) at = p;
  }
  at = at || { x: w.meadow.x, z: w.meadow.z };
  let nm = newName(w, []);
  let c = register(w, makeFolk(w, nm.name, at.x, at.z));
  initLife(w, c, Math.round(w.t - w.rng.range(7.5, 10) * DAY_S), { gen: 0 });
  c.traveler = true;
  c.home = null;
  w.creatures.push(c);
  w.stats.travelers = (w.stats.travelers || 0) + 1;
  logEvent(w, 3, `A traveler came up the creek from somewhere downstream: ${c.name}. They looked around for a long while, and stayed.`, [c.id], at, "arrival");
  remember(w, c, "life", "I followed the creek upstream and found this valley. I think I will stay.", 0.9, { x: at.x, z: at.z, pv: 0.3 });
  newStory(w, "arrival", { who: c.name }, at, 2, witnessesNear(w, at, 14, [c])); // MINDS
  let spring = springNews(w, c); // BELIEF: a traveler may bring news of the spring
  if (spring) logEvent(w, 3, `${c.name} says that ${spring}.`, [c.id], at, "spring");
  c.asleep = false;
  c.act = { type: "look", step: "look", t0: w.t, t1: w.t + 8, x: c.x, z: c.z, tok: c.tok, rc0: rainTotal(w, w.t), lookX: w.meadow.x, lookZ: w.meadow.z };
  schedule(w, w.t + 8, "A", c.id, c.tok);
  return c;
}

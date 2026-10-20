// ==========================================================================
// The player's gift, and what the creekfolk come to believe about it.
//
// Once every 12 real hours the player may give the valley one gift: a gentle
// rain, a scatter of seeds, a warm day, or a found object. Gifts help things
// grow; they never decide whether anyone survives.
//
// The creekfolk notice. Each one explains a gift its own way (luck, the creek,
// or someone watching), and repeated gifts that arrive when they're needed make
// "someone" more likely. Believers coin a word for the giver (it spreads like
// any other word), thank it with a gesture that can become a village custom,
// notice when gifts come regularly, argue with doubters, and wonder what they
// did wrong when the gifts stop.
// ==========================================================================

var GIFT = {
  every: 12 * 3600, // seconds between gifts
  stopDays: 3,      // after this long without a gift (once there have been a few), it feels like they stopped
};

var FOUND_THINGS = [
  "a smooth blue stone",
  "a long white feather",
  "a tiny bell",
  "a carved wooden bead",
  "a spiral shell",
  "a piece of green glass",
  "a ring of braided grass",
  "a little copper key",
];

function giftText(what) {
  let t = { rain: "a gentle rain", seeds: "a scatter of seeds", warm: "a warm day" }[what] || what;
  return t[0].toUpperCase() + t.slice(1);
}

function giverName(w) {
  let believers = w.creatures.filter((c) => c.beliefs && c.beliefs.giver > 0.5).length;
  let v = vocabularySummary(w).find((e) => e.concept === "giver");
  return v && believers >= 2 && v.users >= Math.ceil(believers / 2) ? `"${v.word}"` : "the one who sends gifts";
}

function giftReady(w) {
  return w.t - (w.giftLast ?? -1e9) >= GIFT.every;
}

function giftWaitSeconds(w) {
  return Math.max(0, (w.giftLast ?? -1e9) + GIFT.every - w.t);
}

function beliefsOf(c) {
  return (c.beliefs = c.beliefs || { giver: 0, seen: 0, lastSeen: null, pattern: false, thanks: null });
}

// How much the valley needed this gift right now (0..1).
function giftNeed(w, kind) {
  let alive = w.creatures.filter((c) => !c.visitor);
  if (kind === "rain") {
    let dryFor = w.weather.rain > 0 ? 0 : w.t - (w.weather.since || 0);
    let thirsty = w.structures.some((s) => s.kind === "garden" && s.beds && s.beds.some((b) => b.state === "growing" && b.water < 0.35));
    return clamp(dryFor / (3 * VALLEY_DAY), 0, 1) * 0.6 + (thirsty ? 0.4 : 0);
  }
  if (kind === "seeds") {
    let food = alive.reduce((a, c) => a + c.needs.food, 0) / Math.max(1, alive.length);
    return clamp((0.6 - food) * 2.5, 0, 1);
  }
  if (kind === "warm") {
    let s = seasonAt(w),
      wet = alive.filter((c) => c.wet > 0.4).length / Math.max(1, alive.length);
    return clamp((1 - s.warmth) * 0.7 + wet * 0.6 + (w.weather.rain > 0 ? 0.2 : 0), 0, 1);
  }
  return 0.5;
}

// The gift arrives. Returns a short description for the player.
function giveGift(w, kind) {
  if (!giftReady(w)) return null;
  let need = giftNeed(w, kind),
    T = w.terrain,
    spot = null,
    alive = w.creatures.filter((c) => !c.visitor),
    what = kind;
  w.giftLast = w.t;
  w.gifts = w.gifts || [];
  if (kind === "rain") {
    let e = w.weather;
    e.cum = rainTotal(w, w.t);
    e.cumT = w.t;
    e.state = "rain";
    e.rain = 1;
    e.since = w.t;
    e.until = w.t + 0.4 * VALLEY_DAY;
    e.tok = (e.tok || 0) + 1;
    schedule(w, e.until, "R", 0, e.tok);
    logEvent(w, 2, "A gentle rain began to fall out of a clear sky.", [], null, "gift");
  } else if (kind === "seeds") {
    let g = findStructure(w, "garden", (s) => s.level > 0);
    let c = g ? { x: g.x, z: g.z } : w.meadow;
    spot = T.randomPoint(w.rng, { near: { x: c.x, z: c.z, r: 4 }, minEdge: 1 }) || { x: w.meadow.x, z: w.meadow.z };
    dropItem(w, "seeds", spot.x, spot.z, 10);
    for (let r of w.res) if (r.kind === "bush" && r.amt < r.max) r.amt = Math.min(r.max, r.amt + 2);
    logEvent(w, 2, "Seeds were found scattered in the grass, where there had been none.", [], spot, "gift");
  } else if (kind === "warm") {
    let e = w.weather;
    if (e.rain > 0) {
      e.cum = rainTotal(w, w.t);
      e.cumT = w.t;
      e.state = "clear";
      e.rain = 0;
      e.since = w.t;
      e.until = w.t + VALLEY_DAY;
      e.tok = (e.tok || 0) + 1;
      schedule(w, e.until, "R", 0, e.tok);
    }
    for (let c of w.creatures) (c.wet = 0), (c.needs.comfort = clamp(c.needs.comfort + 0.3, 0, 1)), (c.needs.fun = clamp(c.needs.fun + 0.1, 0, 1));
    for (let s of w.structures) if (s.kind === "garden" && s.beds) for (let b of s.beds) if (b.state === "growing") b.grow = Math.min(1, b.grow + 0.25);
    for (let r of w.res) if (r.kind === "orchard" && r.stage < 3) r.grow = Math.min(0.99, (r.grow || 0) + 0.15);
    logEvent(w, 2, `A warm, golden day settled over the valley${seasonAt(w).warmth < 0.4 ? ", though it was the cold time of year" : ""}.`, [], null, "gift");
  } else if (kind === "found") {
    what = w.rng.pick(FOUND_THINGS);
    spot = T.randomPoint(w.rng, { near: { x: w.meadow.x, z: w.meadow.z, r: 14 }, minEdge: 1.5 }) || { x: w.meadow.x, z: w.meadow.z };
    let it = dropItem(w, "gift", spot.x, spot.z, 1);
    it.thing = what;
    logEvent(w, 2, `Something glinted in the grass that hadn't been there before.`, [], spot, "gift");
  } else return null;

  w.gifts.push({ t: Math.round(w.t), kind, what, need: +need.toFixed(2) });
  if (w.gifts.length > 200) w.gifts.splice(0, w.gifts.length - 200);
  w.stats.gifts = (w.stats.gifts || 0) + 1;
  if (w.giftsStopped) {
    w.giftsStopped = null;
    logEvent(w, 3, "The gifts have come back! Even the doubters looked up.", [], null, "gift");
    for (let c of alive) if (beliefsOf(c).giver > 0.3) feel(c, w, "joy", 0.6), remember(w, c, "gift", "The gifts came back. We weren't forgotten after all.", 0.8);
  }

  // Who noticed, and what they made of it.
  let observers = kind === "rain" || kind === "warm" ? alive.filter((c) => !c.asleep) : witnessesNear(w, spot, 16).filter((c) => !c.visitor);
  for (let c of observers) noticeGift(w, c, kind, what, need);
  if (w.gifts.length === 1 || need > 0.55 || kind === "found")
    newStory(w, "gift", { what, needed: need > 0.5, where: spot && placeNear(w, spot.x, spot.z, 4) ? placeNear(w, spot.x, spot.z, 4).name : null }, spot, w.gifts.length === 1 ? 2 : 1, observers);
  noticePattern(w);
  thanksCustom(w);
  return { kind, what, need };
}

function noticeGift(w, c, kind, what, need) {
  let b = beliefsOf(c),
    t = c.temp,
    before = b.giver,
    // The curious look for reasons; the cautious and incurious shrug.
    openness = 0.5 + t.curiosity * 0.8 - t.caution * 0.35 + (c.stage === "child" ? 0.3 : 0),
    gain = (0.05 + 0.13 * need) * clamp(openness, 0.15, 1.5) * (1 + 0.15 * Math.min(4, b.seen));
  b.giver = +clamp(b.giver + gain * (1 - b.giver), 0, 1).toFixed(3);
  b.seen++;
  b.lastSeen = Math.round(w.t);
  let label = kind === "found" ? what : giftText(kind).toLowerCase();
  if (before < 0.5 && b.giver >= 0.5) {
    wordFor(w, c, "giver");
    remember(w, c, "belief", `${label[0].toUpperCase() + label.slice(1)}, just when we needed it. I think someone is watching over the valley.`, 0.85);
    emote(c, w, "idea", 3);
    w.stats.believers = (w.stats.believers || 0) + 1;
    if (!w.firstBeliever) {
      w.firstBeliever = c.id;
      logEvent(w, 3, `${c.name} has begun to wonder whether someone is watching over the valley, sending gifts.`, [c.id], c, "belief");
    }
  } else if (b.seen === 1) {
    remember(w, c, "gift", b.giver > 0.3 ? `${label[0].toUpperCase() + label.slice(1)} came out of nowhere. The creek must have wanted it.` : `${label[0].toUpperCase() + label.slice(1)} came. Lucky.`, 0.55);
  }
  // Believers say thank you.
  if (b.giver >= 0.6 && !c.asleep && canBeInterrupted(c) && !c.farewell && !c.leaving) {
    if (!b.thanks) {
      let others = w.creatures.map((o) => o.beliefs && o.beliefs.thanks).filter(Boolean),
        counts = {};
      for (let g of others) counts[g] = (counts[g] || 0) + 1;
      let common = Object.entries(counts).sort((a, x) => x[1] - a[1])[0];
      b.thanks = common && w.rng.chance(0.7) ? common[0] : w.rng.pick(GESTURES);
    }
    setPlan(w, c, { goal: "thanks", steps: [{ do: "gesture", g: b.thanks, task: "thanks" }], i: 0 });
  }
}

function noticePattern(w) {
  let g = w.gifts;
  if (g.length < 4 || w.giftPatternNoticed) return;
  let last = g.slice(-4),
    regular = last.every((x, i) => i === 0 || (x.t - last[i - 1].t > 10 * 3600 && x.t - last[i - 1].t < 16 * 3600));
  if (!regular) return;
  let c = w.creatures.filter((c) => !c.visitor && c.stage !== "child" && beliefsOf(c).giver > 0.5).sort((a, b) => b.temp.curiosity - a.temp.curiosity)[0];
  if (!c) return;
  w.giftPatternNoticed = Math.round(w.t);
  beliefsOf(c).pattern = true;
  logEvent(w, 3, `${c.name} has noticed that the gifts come about twice a day, as steady as breathing.`, [c.id], c, "belief");
  remember(w, c, "belief", "The gifts come twice a day. Whoever sends them keeps a rhythm.", 0.85);
}

function thanksCustom(w) {
  if (w.customs && w.customs.thanks) return;
  let bs = w.creatures.map((c) => c.beliefs && c.beliefs.giver >= 0.6 && c.beliefs.thanks).filter(Boolean);
  if (bs.length < 4) return;
  let counts = {};
  for (let g of bs) counts[g] = (counts[g] || 0) + 1;
  let [g, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (n < bs.length * 0.6) return;
  w.customs = w.customs || {};
  w.customs.thanks = { g, since: Math.round(w.t) };
  logEvent(w, 3, `It has become the custom to ${GESTURE_FIRST[g].replace(/my /, "your ")} when a gift arrives, to say thank you.`, [], null, "custom");
}

// The found object: someone wanders over and picks it up.
function claimFoundGifts(w) {
  for (let it of w.items) {
    if (it.kind !== "gift" || it.claimer) continue;
    let best = null,
      bd = 30;
    for (let c of w.creatures) {
      if (c.asleep || c.visitor || c.farewell || c.leaving || !canBeInterrupted(c)) continue;
      let d = dist2d(c.x, c.z, it.x, it.z);
      if (d < bd) (bd = d), (best = c);
    }
    if (!best) continue;
    it.claimer = best.id;
    setPlan(w, best, { goal: "treasure", steps: [{ do: "walk", x: it.x, z: it.z, near: 0.4, why: "treasure" }, { do: "pickgift", id: it.id }], i: 0 });
  }
}

ACTIONS.pickgift = {
  start(w, c, step) {
    let it = w.byId[step.id];
    if (!it) return null;
    return makeAct(w, c, "look", 4, { lookX: it.x, lookZ: it.z, icon: "eye" });
  },
  end(w, c, a, step) {
    let it = w.byId[step.id];
    if (!it) return false;
    c.treasure = it.thing;
    removeThing(w, it, w.items);
    logEvent(w, 3, `${c.name} found ${it.thing} in the grass. Nobody knows where it came from. ${c.name} is keeping it safe.`, [c.id], c, "gift");
    remember(w, c, "treasure", `I found ${it.thing}. Nobody knows where it came from. I'm keeping it.`, 0.9, { x: c.x, z: c.z, pv: 0.4 });
    noticeGift(w, c, "found", it.thing, 0.6);
    feel(c, w, "joy", 0.7);
    emote(c, w, "star", 3);
    beSeen(w, c, { x: c.x, z: c.z, onSee: (o) => noticeGift(w, o, "found", it.thing, 0.4) });
    return true;
  },
};

// Belief passes between friends, and believers and doubters sometimes argue.
function giftChat(w, a, b) {
  let ba = beliefsOf(a),
    bb = beliefsOf(b),
    diff = ba.giver - bb.giver;
  if (Math.abs(diff) < 0.05) return;
  let r = relation(b, a),
    trust = honestyRate(r) * (0.5 + clamp(r.warmth, 0, 1));
  bb.giver = +clamp(bb.giver + diff * 0.06 * trust * (b.stage === "child" ? 2 : 1), 0, 1).toFixed(3);
  if (ba.giver > 0.5 && bb.giver > 0.3) wordFor(w, b, "giver");
  if (Math.abs(diff) > 0.55 && a.stage !== "child" && b.stage !== "child" && w.rng.chance(0.12) && w.t - (w.lastArgument || -1e9) > 86400) {
    w.lastArgument = w.t;
    let believer = diff > 0 ? a : b,
      doubter = diff > 0 ? b : a;
    relation(a, b).annoy = Math.min(1, relation(a, b).annoy + 0.06);
    relation(b, a).annoy = Math.min(1, relation(b, a).annoy + 0.06);
    logEvent(w, 2, `${believer.name} and ${doubter.name} argued about whether anyone really sends the gifts. ${doubter.name} says it's only luck.`, [a.id, b.id], a, "belief");
  }
}

// Runs inside the life tick: missing gifts, and found objects waiting to be found.
function giftTick(w) {
  claimFoundGifts(w);
  let g = w.gifts || [];
  if (g.length >= 3 && !w.giftsStopped && w.t - w.giftLast > GIFT.stopDays * 86400) {
    w.giftsStopped = Math.round(w.t);
    let doubter = w.creatures.filter((c) => !c.visitor && c.stage !== "child").sort((a, b) => beliefsOf(a).giver - beliefsOf(b).giver)[0];
    logEvent(
      w,
      3,
      `The gifts have stopped coming. Some of the creekfolk wonder what they did wrong${doubter && beliefsOf(doubter).giver < 0.3 ? `; ${doubter.name} says there was never anyone at all` : ""}.`,
      [],
      null,
      "belief",
    );
    for (let c of w.creatures) if (beliefsOf(c).giver > 0.5) remember(w, c, "belief", "The gifts have stopped. I wonder if we did something wrong.", 0.8);
  }
  if (w.giftsStopped) for (let c of w.creatures) if (c.beliefs && c.beliefs.giver > 0.1) c.beliefs.giver = +Math.max(0.1, c.beliefs.giver - 0.00015 * (c.beliefs.seen > 10 ? 0.5 : 1)).toFixed(4);
}

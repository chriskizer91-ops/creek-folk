// ==========================================================================
// The player's gift, and what the creekfolk come to believe about it.
//
// Once every 12 real hours (twelve valley days) the player may give the valley
// one gift. Gifts help things grow; they never decide whether anyone survives.
//
// Phase 3B: the creekfolk come to believe the creek gives them. The feeling is
// gratitude and kinship ("the creek keeps us; we keep the creek"), not fear.
// Doubters say it's luck. Believers:
//   - say out loud what the valley needs (requests the player can read), and an
//     answered request strengthens belief more than a random gift;
//   - keep watch at the Giving Place when a gift is due, and leave small
//     offerings there for the giver, which collect over the year;
//   - mark each giving day with a notch on the Giving Stone, and notice the
//     rhythm ("the creek gives at dawn, every twenty-four days");
//   - when the gifts stop, say "the creek is resting" and leave a lantern lit.
// After about a hundred gifts, one of them becomes sure the gifts come from
// someone beyond the valley, and waves at the sky (the camera) when you look.
// ==========================================================================

var GIFT = {
  every: 12 * 3600, // seconds between gifts
  restDays: 3, // after this long without a gift (once there have been a few), the creek is resting
  requestLife: 24 * 3600, // a request stands until the next gift, or this long
  requestGap: 3 * 3600, // at least this long between requests
  watchGap: 2 * 3600, // a creekfolk keeps watch at most this often
  watchers: 3, // at most this many keep watch at once
  beyondGifts: 100, // gifts before one of them believes in someone beyond the valley
  offeringsShown: 40, // offerings drawn at the Giving Place
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

// The gifts the player can choose from, in four groups.
var GIFT_GROUPS = [
  ["weather", "Weather"],
  ["living", "Living things"],
  ["materials", "Materials"],
  ["wonder", "Wonder"],
];
var GIFT_KINDS = {
  rain: { group: "weather", label: "A gentle rain", hint: "waters the gardens and fills the ponds", phrase: "a gentle rain", all: true },
  warm: { group: "weather", label: "A warm day", hint: "dries everyone off and helps things grow", phrase: "a warm day", all: true },
  snow: { group: "weather", label: "A snow day", hint: "a day of snow to play in", phrase: "a snow day", all: true },
  stars: { group: "weather", label: "A starry night", hint: "a clear night full of stars", phrase: "a night full of stars", all: true },
  rainbow: { group: "weather", label: "A rainbow", hint: "a short shower, then a rainbow", phrase: "a rainbow", all: true, sign: 1.6 },
  seeds: { group: "living", label: "A scatter of seeds", hint: "something to plant, and something to eat", phrase: "a scatter of seeds" },
  flowers: { group: "living", label: "Flower seeds", hint: "a kind of flower the valley hasn't seen" },
  fruit: { group: "living", label: "A fruit tree", hint: "young trees of a new fruit" },
  goats: { group: "living", label: "A pair of goats", hint: "to tend and keep company" },
  bees: { group: "living", label: "Bees", hint: "a hive by the gardens" },
  fish: { group: "living", label: "Fish", hint: "a new kind of fish for the ponds" },
  bird: { group: "living", label: "A new bird", hint: "a kind of bird the valley hasn't heard", all: true },
  greattree: { group: "materials", label: "A fallen great tree", hint: "timber for something big" },
  clay: { group: "materials", label: "A bank of good clay", hint: "for walls, tiles and bells" },
  stones: { group: "materials", label: "A pile of stones", hint: "for building" },
  found: { group: "wonder", label: "Something to find", hint: "a small mystery in the grass" },
  dream: { group: "wonder", label: "A dream", hint: "one of them wakes with an idea", phrase: "a dream" },
};

function giftText(what) {
  let t = (GIFT_KINDS[what] && GIFT_KINDS[what].phrase) || what;
  return t[0].toUpperCase() + t.slice(1);
}

// What they call the one who gives: their own word for the creek-that-gives once it has
// spread among the believers, otherwise simply the creek.
function giverName(w) {
  let believers = w.creatures.filter((c) => c.beliefs && c.beliefs.giver > 0.5).length;
  let v = vocabularySummary(w).find((e) => e.concept === "giver");
  return v && believers >= 2 && v.users >= Math.ceil(believers / 2) ? `"${v.word}"` : "the creek";
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

function believers(w) {
  return w.creatures.filter((c) => !c.visitor && c.beliefs && c.beliefs.giver > 0.5);
}

// Most of the living believe the creek gives.
function mostBelieve(w) {
  let alive = w.creatures.filter((c) => !c.visitor).length;
  return alive > 0 && believers(w).length > alive / 2;
}

// ---------------------------------------------------------------------------
// What the valley needs (0..1), and how they would say it.
// ---------------------------------------------------------------------------
function giftNeed(w, kind) {
  return giftNeedWhy(w, kind).need;
}

function giftNeedWhy(w, kind) {
  let alive = w.creatures.filter((c) => !c.visitor),
    s = seasonAt(w),
    f = w.fauna || {},
    n = (need, why) => ({ need: clamp(need, 0, 1), why });
  switch (kind) {
    case "rain": {
      let dryFor = w.weather.rain > 0 ? 0 : w.t - (w.weather.since || 0),
        thirsty = w.structures.some((x) => x.kind === "garden" && x.beds && x.beds.some((b) => b.state === "growing" && b.water < 0.35)),
        stopped = w.creek && !s.wetSeason && w.creek.flowLen != null && w.creek.flowLen < VL * 0.6;
      return n(clamp(dryFor / (3 * VALLEY_DAY), 0, 1) * 0.45 + (thirsty ? 0.35 : 0) + (stopped ? 0.25 : 0), thirsty ? "the gardens are dry" : stopped ? "the creek has stopped running" : "it hasn't rained in a long time");
    }
    case "seeds": {
      let food = alive.reduce((a, c) => a + c.needs.food, 0) / Math.max(1, alive.length);
      return n((0.6 - food) * 2.5, "everyone is hungry");
    }
    case "warm": {
      let wet = alive.filter((c) => c.wet > 0.4).length / Math.max(1, alive.length);
      return n((1 - s.warmth) * 0.6 + wet * 0.6 + (w.weather.rain > 0 ? 0.15 : 0), wet > 0.3 ? "everyone is cold and wet" : "it's so cold");
    }
    case "snow":
      return n(0.12 + (s.name === "winter" ? 0.18 : 0) + 0.15 * clamp(alive.filter((c) => c.stage === "child").length / 4, 0, 1), "the little ones want to see snow");
    case "stars": {
      let grief = w.lastPassing && w.t - w.lastPassing < 12 * 3600;
      return n(0.1 + (grief ? 0.35 : 0), grief ? "someone has passed, and they want to see the stars" : "they'd like to see the stars");
    }
    case "rainbow": {
      let b = believers(w).length / Math.max(1, alive.length);
      return n(0.12 + (b > 0.15 && b < 0.5 ? 0.25 : 0), "they're hoping for a sign");
    }
    case "flowers":
      return n((f.flowers || []).length ? 0.1 : 0.3, "the meadow has no flowers");
    case "fruit": {
      let fruitTrees = w.res.filter((r) => r.kind === "orchard").length;
      return n((fruitTrees < 3 ? 0.3 : 0.08) + (alive.reduce((a, c) => a + c.needs.food, 0) / Math.max(1, alive.length) < 0.5 ? 0.15 : 0), "they want trees their grandchildren can pick from");
    }
    case "goats":
      return n((f.goats || []).length ? 0.05 : 0.2, "the children want animals to look after");
    case "bees":
      return n(w.structures.some((x) => x.kind === "garden" && x.level > 0) && !(f.hives || []).length ? 0.4 : 0.05, "the gardens need bees");
    case "fish":
      return n(Object.keys((w.creek && w.creek.dams) || {}).length >= 2 && !(f.fish || []).length ? 0.42 : 0.06, "there are no fish in the ponds");
    case "bird":
      return n((f.birds || []).length < 2 ? 0.16 : 0.05, "the mornings are quiet");
    case "greattree":
      return n(materialShort(w, "timber") ? 0.7 : 0.08, "the builders need timber");
    case "clay":
      return n(materialShort(w, "clay") ? 0.5 : 0.06, "the builders need clay");
    case "stones":
      return n(materialShort(w, "stone") ? 0.55 : 0.06, "the builders need stones");
    case "found":
      return n(0.2, "the children want something to find");
    case "dream": {
      let lost = Object.keys(w.lost || {}).length,
        waiting = w.temple && w.temple.state === "stopped";
      return n(lost ? 0.6 : waiting ? 0.45 : 0.1, lost ? "they have forgotten something they used to know" : waiting ? "they're waiting for a sign" : "they wish for an idea");
    }
  }
  return n(0.3, "");
}

// A building in progress is waiting on a material nobody can find.
function materialShort(w, mat) {
  for (let s of w.structures) {
    if (!s.building || s.building.locked || !currentStage(s)) continue;
    let need = stageNeeds(s)[mat];
    if (!need || (s.building.delivered[mat] || 0) >= need) continue;
    if (mat === "timber" && !w.res.some((r) => (r.kind === "greatlog" || (r.kind === "timbertree" && r.grow >= 1)) && r.amt > 0)) return true;
    if (mat !== "timber" && !w.res.some((r) => r.kind === SOURCE_KIND[mat] && r.amt >= 3)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// The gift arrives. Returns a short description for the player, or null.
// ---------------------------------------------------------------------------
function giveGift(w, kind) {
  if (!giftReady(w) || !GIFT_KINDS[kind]) return null;
  let info = giftNeedWhy(w, kind),
    need = info.need,
    T = w.terrain,
    spot = null,
    alive = w.creatures.filter((c) => !c.visitor),
    what = kind,
    extra = null,
    e = w.weather,
    setWeather = (state, rain, dur, force) => {
      e.cum = rainTotal(w, w.t);
      e.cumT = w.t;
      e.state = state;
      e.rain = rain;
      e.since = w.t;
      e.until = w.t + dur;
      e.tok = (e.tok || 0) + 1;
      e.force = force || null; // BELIEF: what the weather turns to next (changeWeather)
      schedule(w, e.until, "R", 0, e.tok);
    };
  if (kind === "rain") {
    setWeather("rain", 1, 0.4 * VALLEY_DAY);
    logEvent(w, 2, "A gentle rain began to fall out of a clear sky.", [], null, "gift");
  } else if (kind === "seeds") {
    let g = findStructure(w, "garden", (s) => s.level > 0);
    let c = g ? { x: g.x, z: g.z } : w.meadow;
    spot = T.randomPoint(w.rng, { near: { x: c.x, z: c.z, r: 4 }, minEdge: 1 }) || { x: w.meadow.x, z: w.meadow.z };
    dropItem(w, "seeds", spot.x, spot.z, 10);
    for (let r of w.res) if (r.kind === "bush" && r.amt < r.max) r.amt = Math.min(r.max, r.amt + 2);
    logEvent(w, 2, "Seeds were found scattered in the grass, where there had been none.", [], spot, "gift");
  } else if (kind === "warm") {
    if (e.rain > 0) setWeather("clear", 0, VALLEY_DAY);
    for (let c of w.creatures) (c.wet = 0), (c.needs.comfort = clamp(c.needs.comfort + 0.3, 0, 1)), (c.needs.fun = clamp(c.needs.fun + 0.1, 0, 1));
    for (let s of w.structures) if (s.kind === "garden" && s.beds) for (let b of s.beds) if (b.state === "growing") b.grow = Math.min(1, b.grow + 0.25);
    for (let r of w.res) if (r.kind === "orchard" && r.stage < 3) r.grow = Math.min(0.99, (r.grow || 0) + 0.15);
    logEvent(w, 2, `A warm, golden day settled over the valley${seasonAt(w).warmth < 0.4 ? ", though it was the cold time of year" : ""}.`, [], null, "gift");
  } else if (kind === "snow") {
    if (e.rain > 0 || e.state === "cloudy") setWeather("clear", 0, VALLEY_DAY);
    w.snow = { t0: Math.round(w.t), until: Math.round(w.t + VALLEY_DAY) };
    for (let c of w.creatures) c.needs.fun = clamp(c.needs.fun - 0.15, 0, 1); // everyone wants to go and play in it
    logEvent(w, 3, "Snow began to fall, soft and slow, and the whole valley turned white.", [], null, "gift");
  } else if (kind === "stars") {
    // the coming night (or this one) is clear, with every star out
    let now = dayPhase(w.t),
      toDusk = now < 0.82 ? (0.82 - now) * getDayLength() : 0,
      from = w.t + toDusk,
      until = from + (toDusk ? 0.38 : Math.max(0.05, (1.2 - now) % 1)) * getDayLength();
    setWeather("clear", 0, until - w.t);
    w.starry = { from: Math.round(from), until: Math.round(until) };
    logEvent(w, 2, toDusk ? "The sky cleared, and promised a night full of stars." : "The clouds rolled away, and the night filled with stars.", [], null, "gift");
  } else if (kind === "rainbow") {
    setWeather("rain", 0.6, 0.1 * VALLEY_DAY, "clear");
    w.rainbow = { from: Math.round(w.t + 0.1 * VALLEY_DAY), until: Math.round(w.t + 0.32 * VALLEY_DAY) };
    logEvent(w, 3, "A quick shower passed over the valley, and behind it a rainbow arched from one side to the other.", [], null, "gift");
  } else if (kind === "found") {
    what = w.rng.pick(FOUND_THINGS);
    spot = T.randomPoint(w.rng, { near: { x: w.meadow.x, z: w.meadow.z, r: 14 }, minEdge: 1.5 }) || { x: w.meadow.x, z: w.meadow.z };
    let it = dropItem(w, "gift", spot.x, spot.z, 1);
    it.thing = what;
    logEvent(w, 2, `Something glinted in the grass that hadn't been there before.`, [], spot, "gift");
  } else if (kind === "dream") {
    let r = giftDream(w);
    if (!r) return null;
    spot = r.spot;
    extra = r;
  } else {
    let r = { flowers: giveFlowers, fruit: giveFruitTree, goats: giveGoats, bees: giveBees, fish: giveFish, bird: giveBird, greattree: giveGreatTree, clay: giveClayBank, stones: giveStones }[kind](w);
    if (!r) return null;
    what = r.what;
    spot = r.spot;
    extra = r;
    logEvent(w, 3, giftArrivalText(w, kind, r), [], spot, "gift");
  }
  w.giftLast = w.t;
  w.gifts = w.gifts || [];

  // Was it what they asked for?
  let req = w.request && w.t < w.request.until && w.request.kind === kind ? w.request : null;
  if (w.request) (w.request = null), (w.lastRequest = w.t); // a gift settles the standing request
  w.gifts.push({ t: Math.round(w.t), kind, what, need: +need.toFixed(2), ...(req ? { asked: req.by } : {}) });
  if (w.gifts.length > 200) w.gifts.splice(0, w.gifts.length - 200);
  w.stats.gifts = (w.stats.gifts || 0) + 1;
  w.giftKinds = w.giftKinds || {};
  w.giftKinds[kind] = (w.giftKinds[kind] || 0) + 1;
  if (req) giftAnswered(w, req, kind);
  if (w.giftsStopped) {
    w.giftsStopped = null;
    w.lantern = null;
    logEvent(w, 3, "The creek gave again. Those who had kept the lantern lit said they had known it would.", [], w.givingPlace || null, "gift");
    for (let c of alive) if (beliefsOf(c).giver > 0.3) feel(c, w, "joy", 0.6), remember(w, c, "gift", "The creek was only resting. It gives again.", 0.8);
  }
  if (w.stats.gifts === 1 && spot) namePlace(w, "the Place of the First Gift", spot, "firstgift", 2.5, null, true);

  // Who noticed, and what they made of it. They all live by the creek: news of a gift
  // reaches everyone; those who saw it with their own eyes are moved most.
  let mult = (req ? 2 : 1) * (GIFT_KINDS[kind].sign || 1),
    seers = GIFT_KINDS[kind].all || !spot ? alive.filter((c) => !c.asleep) : witnessesNear(w, spot, 16).filter((c) => !c.visitor);
  for (let c of alive) noticeGift(w, c, kind, what, need, mult * (seers.includes(c) ? 1 : c.asleep ? 0.45 : 0.6));
  if (w.gifts.length === 1 || need > 0.55 || req || kind === "found" || kind === "rainbow" || extra && extra.isNew)
    newStory(w, "gift", { what, needed: need > 0.5 || !!req, where: spot && placeNear(w, spot.x, spot.z, 4) ? placeNear(w, spot.x, spot.z, 4).name : null }, spot, w.gifts.length === 1 ? 2 : 1, seers);
  // Those keeping watch at the Giving Place saw it come.
  for (let c of alive) if (c.plan && c.plan.goal === "watch" && !c.asleep) feel(c, w, "joy", 0.7), emote(c, w, "star", 4), (c.beliefs.watchedGift = (c.beliefs.watchedGift || 0) + 1);
  noticePattern(w);
  thanksCustom(w);
  if (typeof templeOnGift === "function") templeOnGift(w);
  return { kind, what, need, asked: req ? req.by : null };
}

function giftArrivalText(w, kind, r) {
  switch (kind) {
    case "flowers":
      return r.isNew ? `Flowers nobody had seen before came up near the homes: ${faunaLabel("flower", r.kind)}.` : `More ${faunaLabel("flower", r.kind)} came up around the valley.`;
    case "fruit":
      return `Three young ${r.kind} trees were standing near the homes in the morning, where there had been none.`;
    case "goats":
      return `Two goats wandered into the valley and stayed. The creekfolk named them ${r.names.join(" and ")}.`;
    case "bees":
      return "A hive of bees settled by the gardens, humming.";
    case "fish":
      return `There are fish in the water now: ${faunaLabel("fish", r.kind)}, flashing in the ${r.ponds ? "ponds" : "creek"}.`;
    case "bird":
      return `A new bird came to the valley: ${faunaLabel("bird", r.kind)}, singing in the trees.`;
    case "greattree":
      return "In the night a great tree came down near the village, as if it had chosen where to lie.";
    case "clay":
      return "A bank of fine, sticky clay was found near the village, where the ground had been ordinary yesterday.";
    case "stones":
      return "A pile of good stones lay in the grass near the village, as if someone had gathered them.";
  }
  return "Something new came to the valley.";
}

// A dream: one of them wakes with an idea that matters now.
function giftDream(w) {
  let pool = w.creatures.filter((c) => !c.visitor && c.stage !== "child" && !c.farewell && !c.leaving);
  if (!pool.length) return null;
  let c = pool.slice().sort((a, b) => (b.asleep ? 1 : 0) - (a.asleep ? 1 : 0) || b.temp.curiosity - a.temp.curiosity)[0],
    lost = Object.keys(w.lost || {});
  if (lost.length) {
    let k = w.rng.pick(lost);
    discover(w, c, k, null);
    storyDiscovery(w, c, k);
    logEvent(w, 3, `${c.name} dreamed of the old days, and woke knowing again how ${SKILL_TEXT[k]}.`, [c.id], c, "gift");
    remember(w, c, "dream", `I dreamed I knew how ${SKILL_TEXT[k]}. When I woke, I still did.`, 0.9);
    return { what: "a dream", spot: null, dreamer: c.id, idea: "skill" };
  }
  if (w.temple && typeof templeDream === "function" && templeDream(w, c)) return { what: "a dream", spot: null, dreamer: c.id, idea: "temple" };
  if (w.spring && !w.spring.found && !w.spring.journey) {
    w.spring.heard = w.spring.heard || Math.round(w.t);
    w.spring.dreamer = c.id;
    logEvent(w, 3, `${c.name} dreamed of the place where the creek begins: water rising out of the ground, cold and clear. They mean to go and find it.`, [c.id], c, "gift");
    remember(w, c, "dream", "I dreamed of where the creek begins. I have to go and see.", 0.9);
    return { what: "a dream", spot: null, dreamer: c.id, idea: "spring" };
  }
  let kinds = STRUCTURE_KINDS.filter((k) => !STRUCTURES[k].personal);
  let k = w.rng.pick(kinds);
  c.desire[k] = (c.desire[k] || 0) + 1;
  logEvent(w, 2, `${c.name} dreamed of the creek running through a valley full of flowers, and woke with plans.`, [c.id], c, "gift");
  remember(w, c, "dream", "I dreamed of the creek running through a valley full of flowers.", 0.7);
  feel(c, w, "joy", 0.5);
  return { what: "a dream", spot: null, dreamer: c.id, idea: "plans" };
}

// The curious look for reasons; the cautious and incurious shrug. Some never stop
// saying it's luck: how open they are caps how far they can believe.
function beliefOpenness(c) {
  let t = c.temp;
  return 0.5 + t.curiosity * 0.8 - t.caution * 0.35 + (c.stage === "child" ? 0.3 : 0);
}
function beliefCap(c) {
  return clamp(0.85 * beliefOpenness(c) - 0.11, 0.3, 1);
}

function noticeGift(w, c, kind, what, need, mult = 1) {
  let b = beliefsOf(c),
    t = c.temp,
    before = b.giver,
    // The curious look for reasons; the cautious and incurious shrug.
    openness = beliefOpenness(c),
    gain = (0.06 + 0.16 * need) * clamp(openness, 0.15, 1.5) * (1 + 0.2 * Math.min(5, b.seen)) * mult;
  b.giver = +clamp(Math.min(Math.max(b.giver, beliefCap(c)), b.giver + gain * (1 - b.giver)), 0, 1).toFixed(3);
  b.seen++;
  b.lastSeen = Math.round(w.t);
  let heard = mult < 0.7, // heard about it from the others
    label = kind === "found" ? what : (GIFT_KINDS[kind] && GIFT_KINDS[kind].phrase) || what;
  label = label[0].toUpperCase() + label.slice(1);
  if (before < 0.5 && b.giver >= 0.5) {
    wordFor(w, c, "giver");
    remember(w, c, "belief", `${label}${need > 0.45 ? ", just when we needed it" : ""}. The creek gives to us. I'm sure of it now.`, 0.85);
    if (!c.asleep) emote(c, w, "idea", 3);
    w.stats.believers = (w.stats.believers || 0) + 1;
    if (!w.firstBeliever) {
      w.firstBeliever = c.id;
      logEvent(w, 3, `${c.name} has come to believe that the creek gives them what they need. "The creek keeps us," they say, "and we keep the creek."`, [c.id], c, "belief");
      chooseGivingPlace(w, c);
    }
  } else if (b.seen === 1 && !heard) {
    remember(w, c, "gift", b.giver > 0.3 ? `${label} came out of nowhere. Maybe the creek wanted us to have it.` : `${label} came. Lucky.`, 0.55);
  }
  if (heard) return;
  // Believers say thank you.
  if (b.giver >= 0.6 && !c.asleep && canBeInterrupted(c) && !c.farewell && !c.leaving && !(c.plan && c.plan.goal === "journey")) {
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

// The creek bank nearest the village, on the terrace edge, with room for the temple.
function chooseGivingPlace(w, c) {
  if (w.givingPlace) return w.givingPlace;
  let T = w.terrain,
    home = villageCentre(w),
    side = T.side(home.x, home.z),
    best = null;
  for (let dz = 0; dz <= 30 && !best; dz += 2)
    for (let sg of [1, -1]) {
      let z = clamp(home.z + sg * dz, 10, VL - 10),
        x = T.axisX(z) + (side === 0 ? -1 : 1) * (T.floorHW(z) + 4.5);
      if (!T.walkable(x, z) || T.valleyR(x, z) > 0.84 || T.edgeDist(x, z) < 4) continue;
      if (w.structures.some((s) => (s.x - x) ** 2 + (s.z - z) ** 2 < (STRUCTURES[s.kind].radius + 6) ** 2)) continue;
      if (w.res.some((r) => (r.kind === "tree" || r.kind === "podtree") && (r.x - x) ** 2 + (r.z - z) ** 2 < 16)) continue;
      best = { x: +x.toFixed(2), z: +z.toFixed(2) };
      break;
    }
  best = best || { x: w.meadow.x, z: w.meadow.z };
  // the creek, seen from there (for facing the water)
  best.cx = +T.creekX(best.z).toFixed(2);
  w.givingPlace = best;
  namePlace(w, "the Giving Place", best, "giving", 4, c, true);
  logEvent(w, 3, `${c.name} went down to the creek's edge below the village to thank it. They have started calling that spot the Giving Place.`, [c.id], best, "place");
  return best;
}

// A request that was answered.
function giftAnswered(w, req, kind) {
  let c = w.byId[req.by];
  w.stats.answered = (w.stats.answered || 0) + 1;
  if (c) {
    logEvent(w, 3, `${c.name} asked the creek, and the creek answered: ${GIFT_KINDS[kind].phrase || giftArrivalPhrase(kind)}. ${c.name} told everyone.`, [c.id], c, "belief");
    remember(w, c, "belief", `I asked the creek, and it answered me.`, 0.95);
    feel(c, w, "joy", 0.9);
    emote(c, w, "star", 4);
    beliefsOf(c).answered = (beliefsOf(c).answered || 0) + 1;
  } else logEvent(w, 3, `They had asked the creek, and the creek answered.`, [], null, "belief");
}

function giftArrivalPhrase(kind) {
  return { flowers: "new flowers", fruit: "young fruit trees", goats: "two goats", bees: "bees", fish: "fish", bird: "a new bird", greattree: "a great fallen tree", clay: "good clay", stones: "stones", found: "something to find" }[kind] || "what they needed";
}

// ---------------------------------------------------------------------------
// The rhythm: gifts measured in valley days (one real hour each).
// ---------------------------------------------------------------------------
var NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
var TENS_WORDS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function numberWords(n) {
  n = Math.round(n);
  if (n < 20) return NUMBER_WORDS[n];
  if (n < 100) return TENS_WORDS[Math.floor(n / 10)] + (n % 10 ? "-" + NUMBER_WORDS[n % 10] : "");
  return String(n);
}
var HOUR_PHRASE = { dawn: "at dawn", morning: "in the morning", midday: "at midday", afternoon: "in the afternoon", dusk: "at dusk", night: "in the night" };

// The rhythm of the last few gifts, if there is one: { days, when } (when may be null).
function giftRhythm(w, n = 4) {
  let g = (w.gifts || []).slice(-(n + 1));
  if (g.length < n + 1) return null;
  let gaps = [];
  for (let i = 1; i < g.length; i++) gaps.push((g[i].t - g[i - 1].t) / getDayLength());
  let sorted = gaps.slice().sort((a, b) => a - b),
    mid = sorted[Math.floor(sorted.length / 2)];
  if (!gaps.every((x) => Math.abs(x - mid) <= Math.max(1.5, mid * 0.15))) return null;
  let names = g.slice(1).map((x) => timeOfDayName(x.t)),
    when = names.every((x) => x === names[0]) ? names[0] : null;
  return { days: Math.round(mid), when };
}

function rhythmText(r) {
  return `the creek gives${r.when ? " " + HOUR_PHRASE[r.when] : ""}, every ${numberWords(r.days)} days`;
}

function noticePattern(w) {
  let r = giftRhythm(w);
  if (!r) return;
  let key = r.days + ":" + (r.when || "");
  if (w.giftRhythm && w.giftRhythm.key === key) return;
  let c = believers(w).filter((c) => c.stage !== "child").sort((a, b) => b.temp.curiosity - a.temp.curiosity)[0];
  if (!c) return;
  let first = !w.giftRhythm;
  w.giftRhythm = { key, days: r.days, when: r.when, t: Math.round(w.t), by: c.id };
  w.giftPatternNoticed = w.giftPatternNoticed || Math.round(w.t);
  beliefsOf(c).pattern = true;
  let say = rhythmText(r);
  logEvent(w, 3, first ? `${c.name} has noticed that ${say}.` : `${c.name} says the creek keeps a new rhythm now: ${say.replace(/^the creek gives/, "it gives")}.`, [c.id], c, "belief");
  remember(w, c, "belief", `${say[0].toUpperCase() + say.slice(1)}. You can count on it.`, 0.85);
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
  logEvent(w, 3, `It has become the custom to ${GESTURE_FIRST[g].replace(/my /, "your ")} when the creek gives, to say thank you.`, [], null, "custom");
}

// ---------------------------------------------------------------------------
// Requests: a believer says out loud what the valley needs most.
// ---------------------------------------------------------------------------
function giftRequests(w) {
  if (w.request && w.t < w.request.until) return;
  if (w.request) w.request = null;
  if (w.t - (w.lastRequest || -1e9) < GIFT.requestGap || w.t - (w.giftLast ?? -1e9) < 2 * 3600) return;
  let bs = believers(w).filter((c) => c.stage !== "child" && !c.asleep);
  if (!bs.length) return;
  let best = null;
  for (let k in GIFT_KINDS) {
    let r = giftNeedWhy(w, k);
    if (!best || r.need > best.need) best = { kind: k, ...r };
  }
  if (!best || best.need < 0.45 || !best.why) return;
  let c = w.rng.pick(bs);
  w.request = { kind: best.kind, why: best.why, by: c.id, name: c.name, t: Math.round(w.t), until: Math.round(w.t + GIFT.requestLife) };
  w.lastRequest = w.t;
  w.stats.requests = (w.stats.requests || 0) + 1;
  let ask = { rain: "rain", seeds: "seeds", warm: "a warm day", snow: "snow", stars: "a night of stars", rainbow: "a sign", flowers: "flowers", fruit: "fruit trees", goats: "animals", bees: "bees", fish: "fish", bird: "birdsong", greattree: "timber", clay: "clay", stones: "stones", found: "something to find", dream: "a dream" }[best.kind];
  logEvent(w, 2, `${c.name} went down to the water and asked the creek for ${ask}. "${best.why[0].toUpperCase() + best.why.slice(1)}," they said.`, [c.id], c, "request");
  remember(w, c, "belief", `I asked the creek for ${ask}, because ${best.why}.`, 0.6);
}

// ---------------------------------------------------------------------------
// Keeping watch: when a gift is due, believers take turns at the Giving Place.
// ---------------------------------------------------------------------------
function watchOption(w, c) {
  let gp = w.givingPlace,
    b = c.beliefs;
  if (!gp || !b || b.giver < 0.55 || c.visitor || c.farewell || c.leaving || isNight(w.t)) return null;
  if (!giftReady(w) || w.t - (b.watched || -1e9) < GIFT.watchGap) return null;
  let watching = 0;
  for (let o of w.creatures) if (o.plan && o.plan.goal === "watch") watching++;
  if (watching >= GIFT.watchers) return null;
  // Once they know the rhythm, they gather when the gift is expected.
  let r = w.giftRhythm,
    expected = r && r.when ? timeOfDayName(w.t) === r.when : true,
    resting = !!w.giftsStopped,
    score = (0.2 + 0.55 * b.giver) * (expected ? 1.4 : 0.6) * (resting ? 0.35 : 1) * (c.stage === "child" ? 0.6 : 1);
  let a = w.rng.range(-1.2, 1.2) + Math.atan2(gp.cx - gp.x, 0.001),
    d = w.rng.range(1.6, 2.6),
    x = gp.x + Math.sin(a) * d,
    z = gp.z + Math.cos(a) * d;
  if (!w.terrain.walkable(x, z)) (x = gp.x), (z = gp.z);
  return {
    score,
    plan: {
      goal: "watch",
      steps: [
        { do: "walk", x, z, near: 0.4, why: "watch" },
        { do: "keepwatch", x: gp.cx, z: gp.z, dur: w.rng.range(140, 320) },
        { do: "offer" },
      ],
    },
  };
}

ACTIONS.keepwatch = {
  start(w, c, step) {
    beliefsOf(c).watched = Math.round(w.t);
    return makeAct(w, c, "watch", step.dur || 200, { lookX: step.x, lookZ: step.z });
  },
  end(w, c) {
    c.needs.social = clamp(c.needs.social + 0.08, 0, 1);
    feel(c, w, "warmth", 0.2);
    return true;
  },
};

// What each one leaves for the giver, by what they love.
var OFFERING_KINDS = {
  building: ["bead", "a carved bead"],
  growing: ["flower", "a flower"],
  collecting: ["pebble", "a pretty pebble"],
  social: ["ring", "a woven ring of grass"],
  exploring: ["feather", "a feather"],
  water: ["shell", "a creek shell"],
  sound: ["whistle", "a reed whistle"],
};

ACTIONS.offer = {
  start(w, c) {
    let b = beliefsOf(c);
    if (b.offeredFor === w.giftLast || !w.givingPlace) return "skip";
    b.offeredFor = w.giftLast; // one chance each time a gift is due
    if (!w.rng.chance(0.3)) return "skip";
    return makeAct(w, c, "give", 4, { lookX: w.givingPlace.x, lookZ: w.givingPlace.z });
  },
  end(w, c) {
    let b = beliefsOf(c),
      o = OFFERING_KINDS[c.sig] || OFFERING_KINDS.collecting;
    if (o[0] === "flower" && !(w.fauna && w.fauna.flowers.length) && w.rng.chance(0.5)) o = OFFERING_KINDS.collecting;
    if (o[0] === "bead" && c.know.clay && w.rng.chance(0.4)) o = ["figure", "a little clay figure"];
    b.offeredFor = w.giftLast;
    let of = (w.offerings = w.offerings || { n: {}, total: 0, recent: [] });
    of.n[o[0]] = (of.n[o[0]] || 0) + 1;
    of.total++;
    of.recent.push({ k: o[0], by: c.name, t: Math.round(w.t) });
    if (of.recent.length > GIFT.offeringsShown) of.recent.shift();
    if (of.total === 1) logEvent(w, 3, `${c.name} left ${o[1]} at the Giving Place, for the creek. It's the first thing anyone has left there.`, [c.id], w.givingPlace, "offering");
    else if (of.total % 50 === 0) logEvent(w, 2, `There are ${numberWords(of.total) === String(of.total) ? of.total : numberWords(of.total)} small gifts at the Giving Place now, left for the creek.`, [], w.givingPlace, "offering");
    if (!(c.counts.offered > 0)) remember(w, c, "belief", `I left ${o[1]} at the Giving Place for the creek.`, 0.6);
    c.counts.offered = (c.counts.offered || 0) + 1;
    return true;
  },
};

// ---------------------------------------------------------------------------
// The found object: someone wanders over and picks it up.
// ---------------------------------------------------------------------------
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
  bb.giver = +clamp(bb.giver + diff * 0.1 * trust * (b.stage === "child" ? 2 : 1), 0, diff > 0 ? Math.max(bb.giver, beliefCap(b)) : 1).toFixed(3);
  if (ba.giver > 0.5 && bb.giver > 0.3) wordFor(w, b, "giver");
  if (Math.abs(diff) > 0.55 && a.stage !== "child" && b.stage !== "child" && w.rng.chance(0.12) && w.t - (w.lastArgument || -1e9) > 86400) {
    w.lastArgument = w.t;
    let believer = diff > 0 ? a : b,
      doubter = diff > 0 ? b : a;
    relation(a, b).annoy = Math.min(1, relation(a, b).annoy + 0.06);
    relation(b, a).annoy = Math.min(1, relation(b, a).annoy + 0.06);
    logEvent(w, 2, `${believer.name} and ${doubter.name} argued about whether the creek really gives. ${doubter.name} says it's only luck.`, [a.id, b.id], a, "belief");
  }
  // The one who believes in someone beyond the valley tells their friends, who find it odd.
  if (ba.beyond && !bb.beyond && w.rng.chance(0.04)) beyondTalk(w, a, b);
}

// A child grows up with its family's belief.
function inheritBelief(w, c, a, b) {
  let g = ((a.beliefs ? a.beliefs.giver : 0) + (b.beliefs ? b.beliefs.giver : 0)) / 2;
  beliefsOf(c).giver = +Math.min(0.75 * g, beliefCap(c)).toFixed(3);
}

// ---------------------------------------------------------------------------
// The one who believes in you.
// ---------------------------------------------------------------------------
var BEYOND_LINES = [
  "The creek gives us life. But the gifts? Someone sends those. Someone far away, looking in.",
  "I think whoever sends the gifts lives somewhere else, beyond the hills. Somewhere we can't see.",
  "Sometimes I feel someone watching, kindly. Not the creek. Someone else.",
  "I wave, in case they're looking.",
];

function beyondTick(w) {
  let total = w.stats.gifts || 0;
  if (total < GIFT.beyondGifts) return;
  let have = w.creatures.filter((c) => !c.visitor && c.beliefs && c.beliefs.beyond);
  if (have.length >= 1) return; // one at a time; it can be passed on (up to two for a while)
  let recent = (w.gifts || []).filter((g) => w.t - g.t < 14 * 86400).length;
  if (recent < 7) return;
  let pool = believers(w).filter((c) => c.stage !== "elder" && !c.farewell && !c.leaving && (c.stage === "adult" || ageDays(w, c) > 3));
  if (!pool.length) return;
  let c = pool.sort((a, b) => b.temp.curiosity + b.beliefs.giver - (a.temp.curiosity + a.beliefs.giver))[0];
  becomeBeyond(w, c, null);
}

function becomeBeyond(w, c, from) {
  let b = beliefsOf(c);
  b.beyond = Math.round(w.t);
  w.beyondEver = w.beyondEver || [];
  w.beyondEver.push({ id: c.id, name: c.name, t: Math.round(w.t), from: from ? from.name : null });
  if (w.beyondEver.length > 40) w.beyondEver.shift();
  if (from) {
    logEvent(w, 3, `${c.name} has always listened to ${from.name}. Now they say it too: the gifts come from someone beyond the valley, someone who looks in on them.`, [c.id, from.id], c, "belief");
    remember(w, c, "belief", `${from.name} taught me to wave at the sky. Someone is there.`, 0.95);
  } else {
    logEvent(w, 3, `${c.name} has become sure that the gifts come from someone beyond the valley, from another place entirely. They still thank the creek, because the creek brings life. But when they think no one is looking, they wave at the sky.`, [c.id], c, "belief");
    remember(w, c, "belief", BEYOND_LINES[0], 0.95);
  }
  emote(c, w, "idea", 4);
}

function beyondTalk(w, a, b) {
  let r = relation(b, a);
  if (r.warmth > 0.4) feel(b, w, "warmth", 0.15);
  if (w.t - (w.lastBeyondTalk || -1e9) < 2 * 86400) return;
  w.lastBeyondTalk = w.t;
  logEvent(w, 2, `${a.name} told ${b.name}: "${w.rng.pick(BEYOND_LINES)}" ${b.name} thinks it's an odd idea, but is fond of ${a.name} all the same.`, [a.id, b.id], a, "belief");
}

// When the one who believes passes or leaves, the belief goes to one of its children
// or a young friend it taught.
function passBeyond(w, c) {
  if (!c.beliefs || !c.beliefs.beyond) return;
  let pool = w.creatures.filter((o) => o !== c && !o.visitor && !o.farewell && !o.leaving && o.beliefs && o.beliefs.giver > 0.4 && !o.beliefs.beyond);
  let kids = pool.filter((o) => (c.children || []).includes(o.id));
  let friends = pool.filter((o) => ageDays(w, o) < ageDays(w, c) - 4 && relation(c, o).warmth > 0.5).sort((x, y) => relation(c, y).warmth - relation(c, x).warmth);
  let heir = kids.sort((x, y) => relation(c, y).warmth - relation(c, x).warmth)[0] || friends[0];
  if (heir) becomeBeyond(w, heir, c);
}

// ---------------------------------------------------------------------------
// Runs inside the life tick (every 600 s).
// ---------------------------------------------------------------------------
function giftTick(w) {
  claimFoundGifts(w);
  // a snow day melts into the topsoil
  if (w.snow && w.t >= w.snow.until && !w.snow.melted) {
    w.snow.melted = 1;
    if (w.creek) w.creek.soil = +Math.min(1, w.creek.soil + 0.35).toFixed(3);
    logEvent(w, 1, "The snow melted away, and the ground drank it in.", [], null, "weather");
  }
  faunaSlow(w);
  giftRequests(w);
  beyondTick(w);
  let g = w.gifts || [];
  if (g.length >= 3 && !w.giftsStopped && w.t - w.giftLast > GIFT.restDays * 86400) {
    w.giftsStopped = Math.round(w.t);
    let c = believers(w).filter((c) => c.stage !== "child").sort((a, b) => b.beliefs.giver - a.beliefs.giver)[0];
    w.lantern = { t: Math.round(w.t), by: c ? c.id : null };
    logEvent(w, 3, c ? `The gifts haven't come for a while. "The creek is resting," ${c.name} says. They left a lantern burning at the Giving Place, so the creek will know where to find them.` : "The gifts haven't come for a while. The creek must be resting.", c ? [c.id] : [], w.givingPlace || null, "belief");
    for (let o of w.creatures) if (beliefsOf(o).giver > 0.5) remember(w, o, "belief", "The creek is resting. It will give again when it's ready.", 0.7);
  }
  // Faith fades only very slowly while the creek rests.
  if (w.giftsStopped) for (let c of w.creatures) if (c.beliefs && c.beliefs.giver > 0.3) c.beliefs.giver = +Math.max(0.3, c.beliefs.giver - 0.0001 * (c.beliefs.seen > 10 ? 0.5 : 1)).toFixed(4);
}

// What decide() can choose from this file: keeping watch, tending goats, the spring.
function beliefOptions(w, c) {
  let out = [];
  let a = watchOption(w, c);
  if (a) out.push(["watch", a]);
  let b = goatOption(w, c);
  if (b) out.push(["goats", b]);
  if (typeof springOption === "function") {
    let s = springOption(w, c);
    if (s) out.push(["journey", s]);
  }
  if (typeof starsOption === "function") {
    let s = starsOption(w, c);
    if (s) out.push(["stars", s]);
  }
  return out;
}

// A starry night: they lie out in the grass and look up. Snow: they play in it.
function starsOption(w, c) {
  if (w.starry && w.t >= w.starry.from && w.t < w.starry.until && isNight(w.t) && c.needs.energy > 0.35 && !c.visitor) {
    let p = w.terrain.randomPoint(w.rng, { near: { x: w.meadow.x, z: w.meadow.z, r: 6 }, minEdge: 2 }) || w.meadow;
    return { score: 1.2 + 0.4 * c.temp.curiosity, plan: { goal: "stars", steps: [{ do: "walk", x: p.x, z: p.z, near: 0.5 }, { do: "stargaze", dur: w.rng.range(200, 420) }] } };
  }
  if (w.snow && w.t < w.snow.until && !isNight(w.t) && c.stage !== "elder" && c.needs.energy > 0.3 && !c.visitor) {
    let p = w.terrain.randomPoint(w.rng, { near: { x: w.meadow.x, z: w.meadow.z, r: 8 }, minEdge: 2 }) || w.meadow;
    return { score: (c.stage === "child" ? 1.3 : 0.6) * clamp((0.9 - c.needs.fun) / 0.9, 0.2, 1), plan: { goal: "snow", steps: [{ do: "walk", x: p.x, z: p.z, near: 0.5, run: true }, { do: "snowplay" }] } };
  }
  return null;
}

ACTIONS.stargaze = {
  start(w, c, step) {
    return makeAct(w, c, "stargaze", step.dur || 300, {});
  },
  end(w, c) {
    c.needs.fun = clamp(c.needs.fun + 0.25, 0, 1);
    c.needs.social = clamp(c.needs.social + 0.1, 0, 1);
    feel(c, w, "joy", 0.4);
    if (!(c.counts.stars > 0)) remember(w, c, "stars", "We lay in the grass all night and counted the stars. There were more than anyone could count.", 0.75);
    c.counts.stars = (c.counts.stars || 0) + 1;
    if (!w.starsNoted || w.t - w.starsNoted > 86400) {
      w.starsNoted = w.t;
      logEvent(w, 2, "The creekfolk lay out in the meadow and watched the stars until they fell asleep.", [c.id], c, "gift");
    }
    return true;
  },
};

ACTIONS.snowplay = {
  start(w, c) {
    return makeAct(w, c, "play", 40, {});
  },
  end(w, c) {
    c.needs.fun = clamp(c.needs.fun + 0.35, 0, 1);
    feel(c, w, "joy", 0.5);
    if (!(c.counts.snow > 0)) remember(w, c, "snow", "Snow! It's cold and soft and you can throw it.", 0.8);
    c.counts.snow = (c.counts.snow || 0) + 1;
    return true;
  },
};

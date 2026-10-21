// ==========================================================================
// Creekfolk 2: the founders' culture.
//
// The eight grew up in Creekfolk 1's valley, so they arrive already holding its ways
// (docs/phase2-plan.md):
// - words: a shared stock of the old valley's words, said in its accent; now and then a
//   founder says one their own way. New words arise here, and the old ones drift as words do.
// - customs, established on day one rather than discovered: offerings at a passing,
//   gathering at the season's turn, and thanking the creek. In the old valley they thanked it
//   when it gave; here they thank it when the rains come back after the dry season, and the
//   habit outlives anyone who remembers why.
// - stories of the old valley, already drifted: the founders tell them, their children hear
//   them, and their grandchildren hear of a valley no one living has seen. They drift and turn
//   into myths like any story (minds.js); those who were there correct the young.
// Belief that the creek gives stays asleep (cf2-belief.js): the word for it comes with them,
// the faith does not wake without gifts.
//
// The old valley is made from its own random numbers (seed + ":old-valley"), so it doesn't
// change the rest of the new valley. Wraps newValley, storyText, shortAbout, retell, lower,
// hearWord and creekStorm; see docs/MERGE.md.
// ==========================================================================

var CULTURE = {
  // the old valley's words they bring (concepts in CONCEPT_LABELS)
  oldWords: ["creek", "rain", "stone", "mud", "home", "nest", "hut", "help", "come", "yes", "no", "friend", "play", "sleep", "berry", "pod", "tree", "sprout", "tool", "heavy", "dam", "pond", "frog", "garden", "store", "crossing", "meeting", "spring", "summer", "autumn", "winter", "giver", "oldvalley"],
  ownWay: 0.2,     // chance a founder says an old word in their own accent
  knowStory: 0.75, // chance a founder holds an old story they only heard
  thankNear: 45,   // how far from the creek they come down to thank it (m)
  childDrift: 0.06, // chance a child picking up a word says it a little differently
};
CONCEPT_LABELS.oldvalley = "the old valley";
CONCEPT_LABELS.giver = "the creek that gives";
// 3C's and 3B's buildings had no labels in the words list
Object.assign(CONCEPT_LABELS, { skycal: "the sky stones", path: "the path", temple: "the temple", ancestors: "the Hall of the Ancestors" });

// The stories of the old valley: when (days before the new valley), how much it matters, the
// truth, and whether the founders were there. `who` names one of the old valley's elders.
var OLD_STORIES = [
  { kind: "ov-leaving", days: 1, weight: 3, truth: { n: 0, who: 0 }, there: 1 },
  { kind: "ov-flood", days: 5, weight: 2, truth: { n: 3 }, there: 1 },
  { kind: "ov-fish", days: 3, weight: 2, truth: {}, there: 0.6 },
  { kind: "ov-marsh", days: 52, weight: 3, truth: { n: 6 }, there: 0 },
  { kind: "ov-dam", days: 44, weight: 2, truth: { who: 1 }, there: 0 },
  { kind: "ov-gifts", days: 30, weight: 2, truth: {}, there: 0 },
  { kind: "ov-wave", days: 20, weight: 2, truth: { who: 2 }, there: 0 },
];

function cultureOf(w) {
  return (w.culture = w.culture || {});
}

// Does anyone living still tell this story of the old valley?
function oldStoryHeld(w, kind) {
  return w.creatures.some((c) => !c.visitor && c.lore && Object.keys(c.lore).some((k) => w.stories[k] && w.stories[k].kind === kind));
}

function oldNumber(n) {
  return n > 12 ? "a great many" : numberWord(n);
}

// A founder's own way of saying an old word: one of its vowels in their accent.
function sayItMyWay(word, accent, rng) {
  let vs = [...word.matchAll(/oo|ee|ai|ou|[aeiou]/g)];
  if (!vs.length) return word;
  let m = rng.pick(vs),
    v = rng.pick(accent.vo.filter((x) => x !== m[0])) || m[0];
  return (word.slice(0, m.index) + v + word.slice(m.index + m[0].length)).slice(0, 9);
}

// One drift of an old story: the number grows, the deed moves (to another of the old valley's
// elders, or to the teller's own founder ancestor), a cause is added, the telling grows grander.
function driftOld(w, teller, s, v, rng) {
  let nv = { ...v },
    ops = ["why", "big", "big"],
    ov = w.oldValley;
  if (nv.n != null) ops.push("n");
  if (nv.who != null) ops.push("who", "who");
  let op = rng.pick(ops);
  if (op === "n") nv.n = Math.max(nv.n + 1, Math.round(nv.n * rng.range(1.3, 2)));
  else if (op === "big") nv.big = Math.min(3, (nv.big || 0) + 1);
  else if (op === "why") nv.why = teller && teller.stage === "elder" && rng.chance(0.4) ? "elders" : "creek";
  else if (op === "who") {
    let founders = teller ? ancestors(w, teller).filter((r) => r.founder && r.name !== nv.who) : [],
      others = ((ov && ov.names) || []).filter((n) => n !== nv.who);
    if (founders.length && rng.chance(0.6)) nv.who = rng.pick(founders).name;
    else if (others.length) nv.who = rng.pick(others);
    else return null;
  }
  return nv;
}

function makeOldValley(w, rng) {
  let accent = makeAccent(rng),
    words = {},
    taken = new Set(w.creatures.map((c) => c.name)),
    names = [];
  for (let k of CULTURE.oldWords) words[k] = inventWord(accent, rng);
  while (names.length < 5) {
    let n = (rng.pick(NAME_START) + rng.pick(NAME_END)).slice(0, 8);
    if (!taken.has(n)) taken.add(n), names.push(n);
  }
  return { accent, words, names, offering: rng.pick(Object.keys(OFFERINGS)), gesture: rng.pick(GESTURES) };
}

// Day one: the founders' words, customs and stories.
function arriveWithCulture(w) {
  let rng = new Rng(w.seed + ":old-valley"),
    ov = (w.oldValley = makeOldValley(w, rng)),
    founders = w.creatures.filter((c) => !c.visitor);
  for (let c of founders) {
    for (let k of CULTURE.oldWords) {
      let word = ov.words[k],
        mine = rng.chance(CULTURE.ownWay) ? sayItMyWay(word, c.accent, rng) : word;
      c.lex[k] = mine === word ? { [word]: +rng.range(1.6, 2.4).toFixed(2) } : { [mine]: 2, [word]: 1 };
    }
    beliefsOf(c).thanks = ov.gesture;
    c.founder = true;
    lineageRecord(w, c).founder = true;
  }
  // the words they all share aren't news ("Everyone now says ...", core.js socialTick)
  w.mile = w.mile || { pairs: {}, words: {} };
  for (let k of CULTURE.oldWords) w.mile.words[k] = ov.words[k];
  w.customs = w.customs || {};
  w.customs.passing = { counts: { [ov.offering]: 6 }, custom: ov.offering, since: 0, old: true };
  w.customs.seasons = { n: 2, old: true };
  w.customs.thanks = { g: ov.gesture, since: 0, old: true, rain: true };
  // the stories they bring
  for (let d of OLD_STORIES) {
    let truth = { ...d.truth };
    if (truth.n === 0) truth.n = founders.length;
    if (truth.who != null) truth.who = ov.names[truth.who];
    let s = newStory(w, d.kind, truth, null, d.weight, []);
    s.t = -Math.round(d.days * DAY_S);
    s.old = true;
    for (let c of founders) {
      let there = rng.chance(d.there);
      if (!there && !rng.chance(d.kind === "ov-marsh" ? 0.95 : CULTURE.knowStory)) continue;
      let v = { ...s.truth },
        drifts = there ? (rng.chance(0.3) ? 1 : 0) : rng.int(0, 2);
      for (let i = 0; i < drifts; i++) v = driftOld(w, null, s, v, rng) || v;
      learnStory(w, c, s, v, there ? rng.range(0.8, 1) : rng.range(0.55, 0.85), null, there);
    }
    // the oldest are legends already, kept in the version most of them tell
    if (d.days >= LEGEND.ageDays) {
      let counts = new Map();
      for (let c of founders) {
        let l = c.lore[s.id];
        if (!l) continue;
        let key = JSON.stringify([l.v.who, l.v.n, l.v.why, l.v.big || 0]),
          e = counts.get(key) || { n: 0, v: l.v };
        e.n++;
        counts.set(key, e);
      }
      let top = [...counts.values()].sort((a, b) => b.n - a.n)[0];
      s.legend = s.t;
      (w.legends = w.legends || []).push({ id: s.id, kind: s.kind, text: storyText(w, s, top ? top.v : s.truth), t: s.t, at: 0 });
    }
  }
  w.lastMythLog = 1; // the myths they brought aren't news on the first day
  for (let c of founders) remember(w, c, "story", `We left the old valley together. ${ov.names[0]} walked us to the edge.`, 0.7);
  logEvent(
    w,
    3,
    `They brought the old valley's ways with them: when someone passes they ${OFFERINGS[ov.offering][1]} for them, they gather when the season turns, and when the rains come back they ${GESTURE_FIRST[ov.gesture].replace(/my /, "their ")} to thank the creek. In their old words the creek is "${ov.words.creek}", and home is "${ov.words.home}".`,
    founders.map((c) => c.id),
    w.meadow,
    "custom",
  );
}

var cf2CultureNewValley = newValley;
newValley = function (seed, opts) {
  let w = cf2CultureNewValley(seed, opts);
  arriveWithCulture(w);
  return w;
};

// Thanking the creek: once each wet season, at its first storm (and at the first storm of all),
// those near the creek go down to the water and do the old gesture.
function thankTheCreek(w) {
  let cu = w.customs && w.customs.thanks,
    s = seasonAt(w);
  if (!cu || !cu.rain || !s.wetSeason) return;
  let wet = s.idx === 3 ? s.year : s.year - 1,
    C = cultureOf(w);
  if (C.thanked != null && C.thanked >= wet) return;
  let cr = w.creek,
    T = w.terrain,
    who = [];
  for (let c of w.creatures) {
    if (c.visitor || c.away || c.asleep || c.farewell || c.leaving || (c.plan && c.plan.goal === "journey") || !canBeInterrupted(c)) continue;
    let n = cr.nodes[creekNodeIndex(c.z)];
    if (!n || Math.abs(c.x - n.x) > CULTURE.thankNear) continue;
    let bx = n.x + (c.x < n.x ? -1 : 1) * (n.wb / 2 + 2.5),
      steps = T.walkable(bx, c.z) ? [{ do: "walk", x: bx, z: c.z, near: 1.2, why: "thanks" }] : [];
    steps.push({ do: "gesture", g: cu.g, task: "thanks" });
    setPlan(w, c, { goal: "thanks", steps, i: 0 });
    who.push(c);
  }
  if (!who.length) return;
  C.thanked = wet;
  C.thanks = (C.thanks || 0) + 1;
  let ran = cr.flowLen >= VL - 4,
    first = C.thanks === 1,
    why = oldStoryHeld(w, "ov-gifts"),
    founders = who.some((c) => c.founder),
    g = GESTURE_FIRST[cu.g].replace(/my /, "their ");
  logEvent(
    w,
    C.thanks <= 3 ? 3 : 2,
    first
      ? `The first storm came over the new valley. Those by the creek went down to the water to ${g} and thank it, as they did in the old valley.`
      : `The rains came back after the dry season. ${who.length === 1 ? who[0].name + " went" : numberWord(who.length).replace(/^./, (x) => x.toUpperCase()) + " creekfolk went"} down to the water to ${g} and thank the creek, ${founders ? "the old valley's way" : why ? "the way the first eight did" : "as creekfolk always have, though no one can say anymore why"}.`,
    who.map((c) => c.id),
    who[0],
    "custom",
  );
  for (let c of who) {
    remember(w, c, "custom", first ? "The first storm here. We thanked the creek the old way." : "The rain came back. We thanked the creek.", 0.45);
    wordFor(w, c, "creek");
  }
}

var cf2CultureStorm = creekStorm;
creekStorm = function (w, Tforce) {
  let r = cf2CultureStorm(w, Tforce);
  if (w.creatures) thankTheCreek(w);
  return r;
};

// The old stories as sentences.
var cf2CultureStoryText = storyText;
storyText = function (w, s, v) {
  if (!s || !s.kind || !s.kind.startsWith("ov-")) return cf2CultureStoryText(w, s, v);
  let big = v.big || 0,
    why = v.why === "creek" ? ", because the creek wished it" : v.why === "elders" ? ", as the elders had said it would" : v.why === "giver" ? `, with the blessing of ${giverName(w)}` : "";
  switch (s.kind) {
    case "ov-leaving":
      return `When the old valley was full, ${oldNumber(v.n)} of its young ones set off down the creek to find a valley of their own, and ${v.who} walked them to the edge${why}${big ? (big >= 2 ? "; the whole valley came out and sang them on their way" : ", and gave each of them a stone from the creek") : ""}.`;
    case "ov-flood":
      return `In the old valley, ${big >= 2 ? "the greatest flood there ever was" : big ? "a great flood" : "a flood"} came down the creek after ${oldNumber(v.n)} nights of rain${why}, and every dam held.`;
    case "ov-fish":
      return `In the old valley, on midwinter night, fish that glowed like coals swam up the creek to the spring${why}${big ? (big >= 2 ? ", so bright you could see your paws by them" : ", and nobody slept") : ""}.`;
    case "ov-marsh":
      return `In the old valley the creek was cut down deep and dry, and the creekfolk built dams for ${oldNumber(v.n)} years until it spread out into marsh again${why}${big ? (big >= 2 ? ", and the frogs came back the very same night" : ", and it never dried out again") : ""}.`;
    case "ov-dam":
      return `In the old valley, ${v.who} worked out why the dams kept leaking: you build them from the bottom of the creek up${why}${big ? (big >= 2 ? ", in a single night" : ", and their dams never leaked again") : ""}.`;
    case "ov-gifts":
      why = v.why === "creek" ? ", because it loved them" : v.why === "elders" ? ", whenever the elders asked" : why;
      return `In the old valley, the creek gave: rain when the land was dry, seeds, a great tree when they needed timber${why}${big ? (big >= 2 ? ", and they built it a house of stone" : ", every single day") : ""}.`;
    case "ov-wave":
      return `In the old valley, ${v.who} used to look up at the sky and wave, as if someone up there were watching over them${why}${big ? (big >= 2 ? ", and the creek gave whenever they did" : ", and sometimes, they said, someone waved back") : ""}.`;
  }
  return "Something happened in the old valley.";
};

var cf2CultureShortAbout = shortAbout;
shortAbout = function (w, s) {
  return (
    {
      "ov-leaving": "the leaving of the old valley",
      "ov-flood": "the flood in the old valley",
      "ov-fish": "the glowing fish of the old valley",
      "ov-marsh": "how the old valley healed",
      "ov-dam": "how dams should be built",
      "ov-gifts": "the creek that gave",
      "ov-wave": "the one who waved at the sky",
    }[s.kind] || cf2CultureShortAbout(w, s)
  );
};

// Old stories drift the way all stories do (same chance as minds.js's retell), in their own ways.
var cf2CultureRetell = retell;
retell = function (w, teller, listener, s, v) {
  if (!s.kind.startsWith("ov-")) return cf2CultureRetell(w, teller, listener, s, v);
  let rng = w.rng,
    l = teller.lore[s.id],
    age = (w.t - s.t) / 86400,
    p = MINDS.driftBase * (s.carved ? 0.5 : 1) * (l.first ? 0.5 : 1) * (1 + Math.min(1.5, age / 20)) * (listener.stage === "child" ? 1.4 : 1) * (teller.stage === "elder" ? 0.8 : 1) * (0.7 + 0.6 * teller.temp.curiosity);
  if (!rng.chance(p)) return v;
  return driftOld(w, teller, s, v, rng) || v;
};

// "Most of the valley now believes that in the old valley, ..."
var cf2CultureLower = lower;
lower = function (t) {
  return /^(In|When)\b/.test(t) ? t[0].toLowerCase() + t.slice(1) : cf2CultureLower(t);
};

// Old words drift: a child who picks up a word now and then says it a little differently
// (one vowel in their own accent), and the way they say it can spread like any word.
var cf2CultureHearWord = hearWord;
hearWord = function (w, speaker, listener, concept, word) {
  let had = listener.lex[concept] && listener.lex[concept][word] !== undefined,
    r = cf2CultureHearWord(w, speaker, listener, concept, word),
    lx = listener.lex[concept];
  if (!had && lx && lx[word] !== undefined && listener.stage === "child" && w.rng.chance(CULTURE.childDrift)) {
    let v = sayItMyWay(word, listener.accent, w.rng);
    if (v !== word && lx[v] === undefined) (lx[v] = lx[word]), delete lx[word];
  }
  return r;
};

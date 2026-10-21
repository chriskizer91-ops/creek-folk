// ==========================================================================
// Minds of the village: stories, myths, named places, customs, lost skills,
// proposals and visitors from downstream.
//
// STORIES. Notable events become stories (world.stories). Each creekfolk holds
// its own version of the stories it knows (creature.lore), with how sure it is.
// Those who were there know the truth. Everyone else heard it from someone, and
// each retelling can shift a detail: numbers grow, deeds move to more famous
// names (or to a teller's own ancestors), places get named, causes get added
// ("the creek wanted it", "the one who sends gifts"). Elders who were there
// correct the young, until they give up. When most of the living believe a
// version that isn't what happened, a myth has formed, and the log says so.
//
// Everything here uses the world's seeded random numbers.
// ==========================================================================

var MINDS = {
  loreMax: 24,          // stories one creekfolk can hold
  tellChance: 0.45,     // chance a chat includes a story (elders: much more)
  driftBase: 0.045,     // chance a retelling changes a detail
  mythEvery: 6 * 3600,  // how often the valley's beliefs are compared with the truth
  visitEveryDays: 6,    // a departed creekfolk comes back to visit about this often
};

var SKILL_TEXT = {
  mud: "mud dries hard enough to build with",
  planting: "seeds grow into plants",
  clay: "to find and shape the sticky clay",
  glowcap: "to find the mushrooms that glow",
  tools: "to make and use tools",
  dams: "to dam the creek",
  downstream: "to build dams from the bottom of the creek up",
};

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------
function newStory(w, kind, truth, at, weight, witnesses = []) {
  w.stories = w.stories || {};
  w.storySeq = (w.storySeq || 0) + 1;
  let s = {
    id: w.storySeq,
    kind,
    t: Math.round(w.t),
    truth: { big: 0, why: null, ...truth },
    x: at ? +(+at.x).toFixed(1) : null,
    z: at ? +(+at.z).toFixed(1) : null,
    weight,
  };
  w.stories[s.id] = s;
  for (let c of witnesses) learnStory(w, c, s, { ...s.truth }, 1, null, true);
  return s;
}

// Everyone awake within sight (plus any listed) witnesses it.
function witnessesNear(w, at, radius = 12, extra = []) {
  let out = new Set(extra.filter(Boolean));
  if (at)
    for (let c of w.creatures) if (!c.asleep && dist2d(c.x, c.z, at.x, at.z) < radius) out.add(c);
  return [...out];
}

function learnStory(w, c, s, v, conf, from, first) {
  c.lore = c.lore || {};
  let had = c.lore[s.id];
  c.lore[s.id] = { v, conf: +conf.toFixed(3), first: !!first, from: from ? from.id : null, heard: Math.round(w.t), told: had ? had.told : 0 };
  let keys = Object.keys(c.lore);
  if (keys.length > MINDS.loreMax) {
    // Forget the story that matters least to them now.
    let worst = null,
      ws = 1e9;
    for (let k of keys) {
      let st = w.stories[k],
        l = c.lore[k],
        score = (st ? st.weight : 0) * 2 + l.told * 0.3 + (l.first ? 1.5 : 0) - (w.t - l.heard) / 86400 / 10;
      if (+k !== s.id && score < ws) (ws = score), (worst = k);
    }
    if (worst) delete c.lore[worst];
  }
}

// Two versions that read the same are the same story, as far as anyone can tell.
function sameTold(w, s, a, b) {
  return storyText(w, s, a) === storyText(w, s, b);
}

function sameVersion(a, b) {
  return a.who === b.who && a.n === b.n && a.where === b.where && a.why === b.why && (a.big || 0) === (b.big || 0);
}

// Render a version of a story as a sentence.
function storyText(w, s, v) {
  let where = v.where ? ` at ${v.where}` : "",
    big = v.big || 0,
    sent = ["founding", "storm", "gift", "frogs", "spring"].includes(s.kind),
    why = v.why === "giver" ? (sent ? `, sent by ${giverName(w)}` : `, with the blessing of ${giverName(w)}`) : v.why === "creek" ? ", because the creek wished it" : v.why === "elders" ? ", as the elders had said it would" : "";
  switch (s.kind) {
    case "founding":
      return `The first ${numberWord(v.n)} woke in the meadow beside the creek${why}${big ? ", on the brightest morning there ever was" : ""}.`;
    case "discovery":
      return `${v.who} was the first to learn ${SKILL_TEXT[v.what] || v.what}${where}${why}${big >= 2 ? ", all in a single afternoon" : ""}.`;
    case "built":
      return `${v.who} built the first ${v.what}${where}${why}${big ? (big >= 2 ? ", with their own two paws and no help at all" : ", and it took no time at all") : ""}.`;
    case "passing":
      return `${v.who} passed on${where}${v.n ? ` after ${daysWord(v.n)}` : ""}${why}${big ? (big >= 2 ? "; they say the whole valley went quiet" : ", the oldest anyone could remember") : ""}.`;
    case "storm":
      return `${big >= 2 ? "The great storm" : big ? "A terrible storm" : "A storm"} came over the valley${v.n > 1 ? ` and the rain fell for ${numberWord(v.n)} nights` : ""}${why}.`;
    case "arrival":
      return `${v.who} came up the creek from somewhere downstream${why}${big ? ", carrying nothing at all" : ""}, and stayed.`;
    case "leaving":
      return `${v.who} went downstream to see where the creek goes${big ? (big >= 2 ? ", and found a lake as wide as the sky" : ", and never looked back") : ""}${why}.`;
    case "news":
      return `${v.who} came back from downstream and told us ${v.what}${big ? (big >= 2 ? ", and many more wonders besides" : ", bigger than anything here") : ""}.`;
    case "gift":
      return `${giftText(v.what)} came${v.needed ? " when the valley needed it" : ""}${where}${why}${big ? (big >= 2 ? ", and everyone who saw it was changed" : ", glowing") : ""}.`;
    case "frogs":
      return `The frogs came back to the marsh${where}${why}${big ? ", singing all at once on the same night" : ""}.`;
    case "lost":
      return `Once, long ago, the creekfolk knew ${SKILL_TEXT[v.what] || v.what}${v.who ? `; ${v.who} was the last who did` : ""}.`;
    // BELIEF (Phase 3B)
    case "temple":
      return `The creekfolk began the ${v.what}${v.where ? ` at ${v.where}` : ""}${why}${big ? (big >= 2 ? ", and the creek sang all night" : ", on the first warm morning of the year") : ""}.`;
    case "temple-wait":
      return `The ${v.what} stood half-built while the creek rested${why}${big ? (big >= 2 ? ", and not a single stone was lost" : ", and the lantern never went out") : ""}.`;
    case "temple-done":
      return `The ${v.what} was finished${v.n ? ` after ${daysWord(v.n)}` : ""}${why}${big ? (big >= 2 ? ", and the creek ran gold that evening" : ", and everyone slept on its steps") : ""}.`;
    case "spring":
      return `${v.who} walked up past the head of the valley and found the spring where the creek begins${why}${big ? (big >= 2 ? ", and drank from it, and came back a head taller" : ", and the water was warm as milk") : ""}.`;
    // 3C
    case "beavers":
      return `The beavers came up the creek and made their lodge in ${v.where || "the biggest pond"}${why}${big ? (big >= 2 ? ", and the water rose a whole hand that first night" : ", and slapped the water to say they had come") : ""}.`;
    case "skycal":
      return `${v.who ? v.who + " and the others" : "The elders"} set the sky stones to find midwinter${why}${big ? (big >= 2 ? ", and the sun came up exactly where they had said" : ", after watching every sunrise for a year") : ""}.`;
    case "returning":
      return `On the first Returning the sun came up through the crown and the fish swam home to the spring${why}${big ? (big >= 2 ? ", and the whole creek glowed from end to end" : ", and nobody slept that night") : ""}.`;
    case "fishrun":
      return `On midwinter night fish that glowed like coals swam up the creek, past every pond, all the way to the spring${why}${big ? (big >= 2 ? ", and the water shone for a week after" : ", and the frogs went quiet to watch") : ""}.`;
    case "returnee":
      return `${v.who} came home from downstream and stayed${why}${big ? (big >= 2 ? ", with news of a whole valley healing" : ", and knew everyone's name") : ""}.`;
  }
  return "Something happened, long ago.";
}

function numberWord(n) {
  return ["no one", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"][n] || (n > 40 ? "a great many" : String(n));
}
function daysWord(n) {
  return n >= 90 ? "a hundred days" : `${numberWord(Math.round(n))} days`;
}

// How well known a name is: how many living creekfolk hold stories about them.
function fameOf(w, name) {
  let f = 0;
  for (let c of w.creatures) for (let k in c.lore || {}) if (c.lore[k].v.who === name) f++;
  return f;
}

// A teller may change one detail. Returns a new version (or the same one).
function retell(w, teller, listener, s, v) {
  let rng = w.rng,
    l = teller.lore[s.id],
    age = (w.t - s.t) / 86400,
    p = MINDS.driftBase * (s.carved ? 0.5 : 1) * (l.first ? 0.5 : 1) * (1 + Math.min(1.5, age / 20)) * (listener.stage === "child" ? 1.4 : 1) * (teller.stage === "elder" ? 0.8 : 1) * (0.7 + 0.6 * teller.temp.curiosity);
  if (!rng.chance(p)) return v;
  let nv = { ...v },
    ops = [];
  if (nv.n != null) ops.push("n");
  if (nv.who != null && s.kind !== "founding") ops.push("who", "who");
  if (["founding", "storm", "gift", "frogs", "discovery", "built", "temple", "temple-done", "spring", "beavers", "skycal", "returning", "fishrun"].includes(s.kind)) ops.push("why");
  ops.push("big", "big");
  if (s.x != null) ops.push("where");
  let op = rng.pick(ops);
  if (op === "n") {
    if (s.kind === "founding") nv.n = rng.pick([3, 7, 12, 1]);
    else if (s.kind === "passing") nv.n = nv.n + rng.int(2, 6); // an old one grows older in the telling
    else nv.n = Math.max(nv.n + 1, Math.round(nv.n * rng.range(1.3, 2)));
  } else if (op === "who") {
    // Deeds drift to famous names, or to the teller's own family.
    let anc = ancestors(w, teller).filter((r) => r.name !== nv.who),
      famous = null,
      best = 2,
      fame = {};
    for (let c of w.creatures) for (let k in c.lore || {}) { let n = c.lore[k].v.who; if (n) fame[n] = (fame[n] || 0) + 1; }
    for (let n in fame) if (n !== nv.who && n !== "one of the first five" && fame[n] > best) (best = fame[n]), (famous = n);
    if (anc.length && rng.chance(0.5)) nv.who = rng.pick(anc).name;
    else if (famous) nv.who = famous;
    else if (s.t < 3 * 86400 && rng.chance(0.5)) nv.who = "one of the first five";
    else return v;
  } else if (op === "why") {
    let g = (teller.beliefs && teller.beliefs.giver) || 0;
    nv.why = g > 0.45 ? "giver" : teller.stage === "elder" && rng.chance(0.3) ? "elders" : "creek";
  } else if (op === "big") {
    nv.big = Math.min(3, (nv.big || 0) + 1);
  } else if (op === "where") {
    let pl = placeNear(w, s.x, s.z, 10) || (w.placeNames && w.placeNames.length ? rng.pick(w.placeNames) : null);
    if (!pl || pl.name === nv.where) return v;
    nv.where = pl.name;
  }
  return nv;
}

function ancestors(w, c) {
  let out = [],
    seen = new Set(),
    q = (c.parents || []).slice();
  while (q.length && out.length < 8) {
    let id = q.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    let r = (w.lineage || {})[id];
    if (!r) continue;
    out.push(r);
    for (let p of r.parents || []) q.push(p);
  }
  return out;
}

// Called after every chat: the teller may tell the listener a story.
function tellStory(w, teller, listener) {
  if (!teller.lore) return;
  let rng = w.rng,
    eager = (teller.stage === "elder" ? 2.2 : 1) * (listener.stage === "child" ? 1.5 : 1) * (0.6 + 0.6 * teller.temp.sociability);
  if (!rng.chance(Math.min(0.95, MINDS.tellChance * eager))) return;
  let keys = Object.keys(teller.lore).filter((k) => w.stories[k]);
  if (!keys.length) return;
  let k = +rng.weighted(keys, (k) => {
    let s = w.stories[k],
      known = listener.lore && listener.lore[k];
    return s.weight * (known ? (sameVersion(known.v, teller.lore[k].v) ? 0.15 : 0.8) : 1.6) * (1 + teller.lore[k].told * 0.1);
  });
  let s = w.stories[k],
    mine = teller.lore[k];
  mine.told++;
  let v = retell(w, teller, listener, s, mine.v);
  let theirs = listener.lore && listener.lore[k];
  if (!theirs) {
    learnStory(w, listener, s, v, Math.max(0.2, mine.conf * 0.88), teller, false);
    return;
  }
  if (sameVersion(theirs.v, v)) {
    theirs.conf = +Math.min(1, theirs.conf + 0.05).toFixed(3);
    return;
  }
  // They know it differently. Those who were there, or are sure, push back.
  let rel = relation(listener, teller),
    trust = honestyRate(rel) * (0.5 + clamp(rel.warmth, 0, 1)),
    tellerWeight = mine.conf * (teller.stage === "elder" ? 1.4 : 1) * trust,
    mineWeight = theirs.conf * (theirs.first ? 1.6 : 1) * (listener.stage === "elder" ? 1.3 : 1);
  if (theirs.first && listener.stage !== "child" && mineWeight > tellerWeight) {
    correct(w, listener, teller, s, theirs, mine);
  } else if (rng.chance(clamp(tellerWeight / (tellerWeight + mineWeight), 0.05, 0.95))) {
    listener.lore[k] = { ...theirs, v, conf: +Math.max(0.2, mine.conf * 0.85).toFixed(3), from: teller.id, first: false, heard: Math.round(w.t) };
  }
}

// Someone who was there corrects a retelling. The young often aren't convinced.
function correct(w, elder, teller, s, theirs, mine) {
  let rng = w.rng;
  elder.corrections = elder.corrections || {};
  let n = (elder.corrections[s.id] = (elder.corrections[s.id] || 0) + 1);
  if (n === 6) {
    logEvent(w, 2, `${elder.name} has given up correcting the young ones about ${shortAbout(w, s)}. "Let them tell it their way," they said.`, [elder.id], elder, "story");
    remember(w, elder, "story", `Nobody tells it the way it really happened anymore. Maybe that's all right.`, 0.6);
    return;
  }
  if (n > 6) return;
  let convinced = rng.chance(teller.stage === "child" ? 0.3 : 0.55);
  if (convinced) {
    teller.lore[s.id] = { ...mine, v: { ...theirs.v }, conf: +Math.max(mine.conf, 0.7).toFixed(3), from: elder.id };
  } else mine.conf = +Math.max(0.2, mine.conf - 0.1).toFixed(3);
  if (n === 1 || rng.chance(0.25))
    logEvent(
      w,
      1,
      `${teller.name} was telling how ${lower(storyText(w, s, mine.v)).replace(/\.$/, "")}. ${elder.name}, who was there, said it wasn't like that${convinced ? ", and " + teller.name + " listened." : `. ${teller.name} didn't seem convinced.`}`,
      [elder.id, teller.id],
      elder,
      "story",
    );
}

function shortAbout(w, s) {
  let v = s.truth;
  return {
    founding: "how the valley began",
    discovery: `who first learned ${SKILL_TEXT[v.what] || v.what}`,
    built: `who built the first ${v.what}`,
    passing: `${v.who}'s passing`,
    storm: "the storm",
    arrival: `how ${v.who} came`,
    leaving: `${v.who} going downstream`,
    news: "the news from downstream",
    gift: "the gift",
    frogs: "the frogs coming back",
    lost: "what was forgotten",
    temple: "how the great work began",
    "temple-wait": "the time the creek rested",
    beavers: "the coming of the beavers",
    skycal: "the sky stones",
    returning: "the first Returning",
    returnee: "the one who came home",
    fishrun: "the night of the glowing fish",
    "temple-done": "the great work's finishing",
    spring: "who found the spring",
  }[s.kind] || "the old days";
}

// Every few hours: has a myth formed? Has a story been forgotten?
function checkMyths(w) {
  w.myths = w.myths || {};
  let holders = {};
  for (let c of w.creatures) {
    if (c.visitor) continue;
    for (let k in c.lore || {}) (holders[k] = holders[k] || []).push(c.lore[k]);
  }
  for (let k in w.stories) {
    let s = w.stories[k],
      hs = holders[k];
    if (!hs || !hs.length) {
      if (s.weight >= 2 && !s.forgotten && w.t - s.t > 86400) {
        s.forgotten = Math.round(w.t);
        logEvent(w, 2, `No one in the valley remembers anymore that ${lower(storyText(w, s, s.truth))}`, [], s.x != null ? s : null, "forgotten");
      }
      if (w.t - s.t > 86400 * 3) delete w.stories[k];
      continue;
    }
    if (hs.length < 3) continue;
    storyLegend(w, s, hs); // 3C
    let counts = new Map();
    for (let h of hs) {
      let key = JSON.stringify([h.v.who, h.v.n, h.v.where, h.v.why, h.v.big || 0]);
      let e = counts.get(key) || { n: 0, v: h.v, first: 0 };
      e.n++;
      if (h.first) e.first++;
      counts.set(key, e);
    }
    let top = [...counts.values()].sort((a, b) => b.n - a.n)[0];
    if (top.n < hs.length * 0.5) continue;
    let key = JSON.stringify([top.v.who, top.v.n, top.v.where, top.v.why, top.v.big || 0]);
    if (sameTold(w, s, top.v, s.truth) || w.myths[k] === key) continue;
    if (!(k in w.myths)) w.stats.mythStories = (w.stats.mythStories || 0) + 1;
    if (w.stats.firstMyth == null) w.stats.firstMyth = Math.round(w.t);
    w.myths[k] = key;
    w.stats.myths = (w.stats.myths || 0) + 1;
    // Every myth shows in the village's stories; the important ones, at most one a day, in the history.
    if (s.weight < 2 || s.mythLogged || w.t - (w.lastMythLog || -1e9) < 3 * 86400) continue;
    s.mythLogged = true;
    w.lastMythLog = w.t;
    logEvent(w, 3, `Most of the valley now believes that ${lower(storyText(w, s, top.v))} It wasn't quite like that: ${lower(storyText(w, s, s.truth))}`, [], s.x != null ? s : null, "myth");
  }
}

// 3C: a story that has been told for a generation and more becomes a legend: it's kept in
// the valley's old tales (in the version most of them told), even after it's forgotten.
var LEGEND = { ageDays: 40, keep: 24 };
function storyLegend(w, s, hs) {
  if (s.legend || w.t - s.t < LEGEND.ageDays * 86400 || (s.weight || 1) < 2) return;
  let alive = w.creatures.filter((c) => !c.visitor).length;
  if (hs.length < alive / 3) return;
  let counts = new Map();
  for (let h of hs) {
    let key = JSON.stringify([h.v.who, h.v.n, h.v.where, h.v.why, h.v.big || 0]);
    let e = counts.get(key) || { n: 0, v: h.v };
    e.n++;
    counts.set(key, e);
  }
  let top = [...counts.values()].sort((a, b) => b.n - a.n)[0],
    text = storyText(w, s, top.v);
  s.legend = Math.round(w.t);
  w.legends = w.legends || [];
  w.legends.push({ id: s.id, kind: s.kind, text, t: Math.round(s.t), at: Math.round(w.t) });
  if (w.legends.length > LEGEND.keep) w.legends.shift();
  w.stats.legends = (w.stats.legends || 0) + 1;
  if (w.t - (w.lastLegendLog || -1e9) > 2 * 86400) {
    w.lastLegendLog = Math.round(w.t);
    logEvent(w, 2, `The story of ${shortAbout(w, s)} is so old now that it has become a legend: "${text}"`, [], s.x != null ? s : null, "myth");
  }
}

// Lower-case a sentence's first word, unless it's a name.
function lower(t) {
  return /^(The|A|An|Once|Something|Seeds|No)\b/.test(t) ? t[0].toLowerCase() + t.slice(1) : t;
}

// ---------------------------------------------------------------------------
// Named places
// ---------------------------------------------------------------------------
function placeNear(w, x, z, r = 4) {
  if (x == null) return null;
  let best = null,
    bd = r;
  for (let p of w.placeNames || []) {
    let d = dist2d(p.x, p.z, x, z);
    if (d < Math.max(bd, p.r)) (bd = d), (best = p);
  }
  return best;
}

function namePlace(w, name, at, kind, r = 3, by = null, silent = false) {
  w.placeNames = w.placeNames || [];
  let near = placeNear(w, at.x, at.z, r);
  if (near) return near;
  let p = { id: (w.placeSeq = (w.placeSeq || 0) + 1), name, x: +at.x.toFixed(1), z: +at.z.toFixed(1), r, kind, t: Math.round(w.t) };
  w.placeNames.push(p);
  // The namer coins a word for it in their own speech; it spreads like any other word.
  if (by) wordFor(w, by, "place:" + p.id);
  if (!silent) logEvent(w, 2, `The creekfolk have started calling ${kind === "rest" ? "the place where " + name.replace(/'s Rest$/, "") + " passed" : "it"} ${name}.`, by ? [by.id] : [], at, "place");
  return p;
}

// What a concept means, for the words list (places have ids).
function conceptLabel(w, concept) {
  if (concept.startsWith("place:")) {
    let p = (w.placeNames || []).find((p) => "place:" + p.id === concept);
    return p ? p.name : "a place";
  }
  return CONCEPT_LABELS[concept] || concept;
}

// ---------------------------------------------------------------------------
// Hooks called from the core and from life.js
// ---------------------------------------------------------------------------
function storyFounding(w) {
  newStory(w, "founding", { n: w.creatures.length }, w.meadow, 3, w.creatures);
  namePlace(w, "the Waking Meadow", w.meadow, "meadow", 5, null, true);
}

function storyDiscovery(w, c, skill) {
  if (w.lost && w.lost[skill]) {
    let days = Math.round((w.t - w.lost[skill]) / 86400);
    delete w.lost[skill];
    logEvent(w, 3, `${c.name} has learned again how ${SKILL_TEXT[skill] || skill}, ${days} days after the valley forgot.`, [c.id], c, "discovery");
    newStory(w, "discovery", { who: c.name, what: skill }, c, 2, witnessesNear(w, c, 10, [c]));
    return;
  }
  if ((w.stats["know_" + skill] || 0) !== 1) return;
  newStory(w, "discovery", { who: c.name, what: skill }, c, 2, witnessesNear(w, c, 10, [c]));
}

function storyBuilt(w, s, label, builders) {
  w.firstBuilt = w.firstBuilt || {};
  let key = s.kind + ":" + s.level;
  if (s.owner || w.firstBuilt[key]) return;
  w.firstBuilt[key] = Math.round(w.t);
  let lead = builders[0] && w.byId[builders[0]];
  if (!lead) return;
  newStory(w, "built", { who: lead.name, what: label }, s, s.level === 1 ? 2 : 1, witnessesNear(w, s, 12, builders.map((id) => w.byId[id])));
  if (s.kind === "dam" && s.level === 1 && !(w.placeNames || []).some((p) => p.kind === "pool")) namePlace(w, `${lead.name}'s Pool`, s, "pool", 4, lead);
  if (s.kind === "crossing" && s.level === 1) namePlace(w, s.level >= 2 ? "the Footbridge" : "the Stepping Stones", s, "crossing", 3, lead);
  if (s.kind === "meeting" && s.level === 1) namePlace(w, "the Meeting Stone", s, "meeting", 3, lead);
}

function storyPassing(w, c, near) {
  let notable = c.founder || c.traveler || (c.children || []).length >= 4 || !(w.stats.passings > 0);
  let at = c.farewell || c;
  let place = placeNear(w, at.x, at.z, 3);
  if (!place && notable) place = namePlace(w, `${c.name}'s Rest`, at, "rest", 2.5, near[0] || null);
  newStory(w, "passing", { who: c.name, n: Math.round(ageDays(w, c)), where: place ? place.name : null }, at, c.founder || c.traveler || !(w.stats.passings > 0) ? 2 : 1, witnessesNear(w, at, 8, near));
}

function storyStorm(w) {
  if (w.lastStormStory && w.t - w.lastStormStory < 3 * 86400) return;
  w.lastStormStory = w.t;
  newStory(w, "storm", { n: 1 }, null, 1, w.creatures.filter((c) => !c.visitor));
}

function storyFrogs(w, at) {
  newStory(w, "frogs", {}, at, 1, witnessesNear(w, at, 14));
}

// When the last creekfolk who knew a skill is gone.
function checkLostSkills(w, gone) {
  w.lost = w.lost || {};
  for (let k in SKILL_TEXT) {
    if (!gone.know || !gone.know[k] || w.lost[k]) continue;
    if (w.creatures.some((c) => c !== gone && c.know[k])) continue;
    w.lost[k] = Math.round(w.t);
    w.stats.skillsLost = (w.stats.skillsLost || 0) + 1;
    logEvent(w, 3, `No one left in the valley knows how ${SKILL_TEXT[k]}. ${gone.name} was the last.`, [], gone, "lost");
    newStory(w, "lost", { what: k, who: gone.name }, null, 2, w.creatures.filter((c) => c !== gone && !c.visitor && c.rel[gone.id]));
  }
}

// ---------------------------------------------------------------------------
// Customs: offerings at a passing, gatherings when the season turns
// ---------------------------------------------------------------------------
var OFFERINGS = {
  sound: ["hummed a low song", "hum a low song"],
  collecting: ["left a pretty pebble", "leave a pretty pebble"],
  growing: ["laid a flower", "lay a flower"],
  water: ["brought water from the creek", "bring water from the creek"],
  building: ["set a small stone", "set a small stone"],
  social: ["held paws in a circle", "hold paws in a circle"],
  exploring: ["told of far-off places", "tell of far-off places"],
};

function passingOfferings(w, c, near) {
  w.customs = w.customs || {};
  let cu = (w.customs.passing = w.customs.passing || { counts: {}, custom: null, since: null });
  let done = [];
  for (let o of near) {
    let pick = cu.custom && w.rng.chance(0.75) ? cu.custom : o.sig;
    cu.counts[pick] = (cu.counts[pick] || 0) + 1;
    done.push(pick);
  }
  let total = Object.values(cu.counts).reduce((a, b) => a + b, 0);
  if (!cu.custom) {
    for (let k in cu.counts)
      if (cu.counts[k] >= 4 && cu.counts[k] >= total * 0.4) {
        cu.custom = k;
        cu.since = Math.round(w.t);
        logEvent(w, 3, `It has become the custom, when someone passes, to ${OFFERINGS[k][1]} for them.`, [], c.farewell || c, "custom");
        break;
      }
  }
  if (!done.length) return "";
  let k = cu.custom && done.filter((d) => d === cu.custom).length >= done.length / 2 ? cu.custom : done[0];
  return ` They ${OFFERINGS[k][0]} for them.`;
}

function seasonGathering(w, season) {
  let meet = findStructure(w, "meeting", (s) => s.level > 0),
    at = meet ? { x: meet.x, z: meet.z } : w.meadow;
  let goers = w.creatures.filter((c) => !c.asleep && !c.farewell && !c.leaving && canBeInterrupted(c) && dist2d(c.x, c.z, at.x, at.z) < 30);
  if (goers.length < 3) return false;
  w.customs = w.customs || {};
  let g = (w.customs.seasons = w.customs.seasons || { n: 0 });
  g.n++;
  for (let c of goers) {
    let a = w.rng.range(0, 6.28),
      d = w.rng.range(1.2, 2.8);
    setPlan(w, c, { goal: "gather", steps: [{ do: "walk", x: at.x + Math.cos(a) * d, z: at.z + Math.sin(a) * d, near: 0.3, why: "gather" }, { do: "gather", x: at.x, z: at.z }], i: 0 });
  }
  let word = favoriteWord(goers[0], season) || null;
  let place = placeNear(w, at.x, at.z, 5);
  logEvent(
    w,
    3,
    g.n === 1
      ? `The creekfolk gathered at ${place ? place.name : "the meeting place"} to mark the coming of ${season}.`
      : g.n === 2
        ? `For the second time, the creekfolk gathered at ${place ? place.name : "the meeting place"} as the season turned. It is becoming a custom.`
        : `The creekfolk gathered at ${place ? place.name : "the meeting place"} for the turning of the season, as they always do${word ? `; they call it "${word}"` : ""}.`,
    goers.map((c) => c.id),
    at,
    "custom",
  );
  for (let c of goers) wordFor(w, c, season);
  return true;
}

// ---------------------------------------------------------------------------
// Proposals: when someone marks out a shared project, the others react.
// ---------------------------------------------------------------------------
function proposalReaction(w, by, kind, observer, out) {
  let r = relation(observer, by),
    agree = (observer.desire[kind] || 0) + 0.4 * clamp(r.warmth, -1, 1) - 0.3 * r.annoy + w.rng.range(-0.15, 0.15);
  if (agree > 0.25) {
    observer.desire[kind] = (observer.desire[kind] || 0) + 0.15;
    warmTo(observer, by, 0.02);
    out.yes.push(observer.id);
  } else if (agree < -0.05) {
    r.annoy = Math.min(1, r.annoy + 0.04);
    out.no.push(observer.id);
  }
}

function proposalLog(w, by, label, kind, at, out) {
  if (STRUCTURES[kind].personal || (!out.yes.length && !out.no.length)) return;
  let yes = out.yes.length ? `${nameList(w, out.yes)} liked the idea` : "",
    no = out.no.length ? `${nameList(w, out.no)} ${out.no.length > 1 ? "weren't" : "wasn't"} sure` : "";
  logEvent(w, 2, `${by.name} proposed ${withArticle(label)}. ${[yes, no].filter(Boolean).join("; ")}.`, [by.id, ...out.yes, ...out.no], at, "proposal");
}

// ---------------------------------------------------------------------------
// Visitors: someone who went downstream comes back for a little while, with news.
// ---------------------------------------------------------------------------
var DOWNSTREAM_NEWS = [
  // 3C: the craft goes downstream with the leavers
  "the next valley down is turning green: the ones who went down showed them how to build dams",
  "downstream they build from the bottom of the creek up, the way we do, and their floods don't run so wild",
  "there's a pond downstream with a beaver lodge in it, and the creekfolk there say our dams taught them",
  "the creek joins a river so wide you can't see the other side",
  "there is a still lake where the creek ends, full of sky",
  "other creekfolk live downstream, and they build their homes on stilts",
  "a fallen tree far below made a pool bigger than ours",
  "the hills open out into a meadow that goes on forever",
  "there are fish downstream as long as your arm",
  "far below, the creek runs under the ground and comes out singing",
  "the folk downstream have a different word for everything",
  "there are reeds downstream taller than our roofs",
  "at night, downstream, the whole marsh glows",
];

function snapshotForVisits(w, c) {
  let rels = Object.entries(c.rel)
    .sort((a, b) => b[1].warmth - a[1].warmth)
    .slice(0, 8);
  return {
    look: c.look,
    temp: c.temp,
    interests: c.interests,
    accent: c.accent,
    lex: Object.fromEntries(Object.entries(c.lex).slice(0, 30)),
    sig: c.sig,
    born: c.born,
    lifespan: c.lifespan,
    gen: c.gen,
    parents: c.parents,
    children: c.children,
    rel: Object.fromEntries(rels),
    strength: c.adultStrength,
  };
}

function visits(w, force = false) {
  if (w.creatures.some((c) => c.visitor)) return false;
  let cands = (w.downstream || []).filter((d) => d.snap && (force || (w.t - d.t > 2 * 86400 && w.t - (d.visited || 0) > 12 * 86400)) && d.snap.born + d.snap.lifespan - w.t > 2 * 86400);
  if (!cands.length || (!force && !w.rng.chance(LIFE.tick / (MINDS.visitEveryDays * 86400)))) return false;
  let d = w.rng.pick(cands);
  d.visited = Math.round(w.t);
  let edge = downstreamEdge(w, { x: w.terrain.creekX(VL - 6) + 2, z: VL - 6 });
  let c = makeFolk(w, d.name, edge.x, edge.z);
  let sn = d.snap;
  Object.assign(c, { id: d.id, look: sn.look, temp: sn.temp, interests: sn.interests, accent: sn.accent, lex: sn.lex, sig: sn.sig, rel: sn.rel, strength: sn.strength, adultStrength: sn.strength });
  Object.assign(c, { born: sn.born, lifespan: sn.lifespan, gen: sn.gen, parents: sn.parents || [], children: sn.children || [], partner: null });
  c.stage = stageOf(w, c);
  c.visitor = { until: Math.round(w.t + VALLEY_DAY * 2), x: edge.x, z: edge.z };
  register(w, c);
  w.creatures.push(c);
  w.stats.visits = (w.stats.visits || 0) + 1;
  let news = springNews(w, c) || w.rng.pick(DOWNSTREAM_NEWS); // BELIEF: news of the spring comes first
  logEvent(w, 3, `${c.name} came back up the creek to visit! They say ${news}.`, [c.id], edge, "visit");
  newStory(w, "news", { who: c.name, what: news }, edge, 2, [c]);
  for (let o of w.creatures) {
    let r = o.rel[c.id];
    if (o !== c && r && r.warmth > 0.3) remember(w, o, "visit", `${c.name} came back to visit. They say ${news}.`, 0.8, { who: c.id });
  }
  c.asleep = false;
  c.act = { type: "look", step: "look", t0: w.t, t1: w.t + 6, x: c.x, z: c.z, tok: c.tok, rc0: rainTotal(w, w.t), lookX: w.meadow.x, lookZ: w.meadow.z };
  schedule(w, w.t + 6, "A", c.id, c.tok);
}

function endVisits(w) {
  for (let c of w.creatures.slice()) {
    if (!c.visitor) continue;
    if (w.t > c.visitor.until + VALLEY_DAY * 2) {
      leaveAgain(w, c);
      continue;
    }
    if (w.t > c.visitor.until && !c.visitor.decided) {
      c.visitor.decided = 1;
      if (returneeStays(w, c)) continue; // 3C: home to stay
    }
    if (w.t > c.visitor.until && (!c.plan || c.plan.goal !== "goback") && !c.asleep && canBeInterrupted(c))
      setPlan(w, c, { goal: "goback", steps: [{ do: "walk", x: c.visitor.x, z: c.visitor.z, near: 0.4, why: "leave" }, { do: "goback" }], i: 0 });
  }
}

// 3C: now and then someone who comes back to visit stays for good, if there's room and
// someone here they love. Their mind starts fresh from here, but they keep their name,
// family, looks and old friends, and the craft they took downstream.
var RETURNEE = { chance: 0.15 };
function returneeStays(w, c) {
  let alive = w.creatures.filter((o) => !o.visitor);
  if (alive.length >= valleyCapacity(w) - 1) return false;
  if (!alive.some((o) => (c.rel[o.id] && c.rel[o.id].warmth > 0.4) || (c.parents || []).includes(o.id) || (o.parents || []).includes(c.id))) return false;
  if (!w.rng.chance(RETURNEE.chance)) return false;
  c.visitor = null;
  c.plan = null;
  c.mem = [];
  c.know = Object.assign(c.know || {}, { mud: true, planting: true, clay: true, dams: true, downstream: true });
  for (let k in c.needs) c.needs[k] = 0.7;
  let d = (w.downstream || []).find((x) => x.id === c.id);
  if (d) d.returned = Math.round(w.t);
  let L = w.lineage && w.lineage[c.id];
  if (L) L.returned = Math.round(w.t);
  w.stats.returnees = (w.stats.returnees || 0) + 1;
  logEvent(w, 3, `${c.name} has decided to stay. After everything downstream, they've come home.`, [c.id], c, "visit");
  newStory(w, "returnee", { who: c.name }, c, 2, alive.filter((o) => dist2d(o.x, o.z, c.x, c.z) < 25));
  for (let o of alive) {
    let r = o.rel[c.id];
    if (r && r.warmth > 0.3) remember(w, o, "visit", `${c.name} came home to stay!`, 0.85, { who: c.id });
  }
  remember(w, c, "visit", "I came home. The creek here is greener than I remember it.", 0.8);
  return true;
}

function leaveAgain(w, c) {
  logEvent(w, 2, `${c.name} went back downstream, home to wherever that is now.`, [c.id], c, "visit");
  for (let s of w.structures) if (s.owner === c.id) s.owner = null;
  for (let o of w.creatures) {
    if (o.partner === c.id) o.partner = null;
    if (o.attend && o.attend.id === c.id) o.attend = null;
  }
  c.act = null;
  c.plan = null;
  c.tok++;
  let i = w.creatures.indexOf(c);
  if (i >= 0) w.creatures.splice(i, 1);
  delete w.byId[c.id];
}

ACTIONS.gather = {
  start(w, c, step) {
    return makeAct(w, c, "sit", 150, { lookX: step.x, lookZ: step.z });
  },
  end(w, c) {
    c.needs.social = clamp(c.needs.social + 0.2, 0, 1);
    feel(c, w, "warmth", 0.3);
    return true;
  },
};

ACTIONS.goback = {
  start(w, c) {
    return makeAct(w, c, "look", 5, { lookX: w.meadow.x, lookZ: w.meadow.z });
  },
  end(w, c) {
    leaveAgain(w, c);
    return false;
  },
};

// Runs inside the life tick.
function mindsTick(w) {
  // Gather for the turning of the season once it's daytime (within a real day).
  let g = w.gatherPending;
  if (g && (w.t - g.t > 86400 || (!isNight(w.t) && seasonGathering(w, g.season)))) w.gatherPending = null;
  endVisits(w);
  visits(w);
  if (!w.lastMyth || w.t - w.lastMyth >= MINDS.mythEvery) {
    w.lastMyth = w.t;
    checkMyths(w);
  }
}

// ==========================================================================
// Creekfolk 2: customs around the founders.
//
// After the last of the eight has passed, the valley remembers them. Each valley year, on the
// day the last founder passed, the oldest of them leads whoever is about to the founders'
// standing stones (or to their trees in the grove, if none of them carved in stone), and
// there the old ones tell the young who the eight were: the founding, the old valley they came
// from, the last of them. They leave the valley's offering at each founder's tree. The first
// year it is one elder's idea, the second it is "becoming a custom", and from the third it is
// one, with its own word. As the years pass and nobody alive knew anyone who knew the eight,
// it goes on anyway ("though few remember anymore whose day it was"): a habit that outlives
// its reasons.
//
// Wraps lifeTick; see docs/MERGE.md.
// ==========================================================================

var FOUNDERS_DAY = {
  reach: 70,  // m: those within this of the place come
  sit: 900,   // seconds they stay
  tell: 3,    // stories the old ones tell each young one, at most
};
CONCEPT_LABELS.remembering = "the day they remember the eight";

function foundersPlace(w) {
  let stones = (w.carvings || []).filter((k) => k.mat === "stone" && k.done >= 1 && !k.gone && (w.lineage || {})[k.by] && w.lineage[k.by].founder);
  if (stones.length) {
    let x = stones.reduce((a, k) => a + k.x, 0) / stones.length,
      z = stones.reduce((a, k) => a + k.z, 0) / stones.length;
    return { x, z, what: "stones" };
  }
  if (w.grove) return { x: w.grove.x, z: w.grove.z, what: "grove" };
  return { x: w.meadow.x, z: w.meadow.z, what: "meadow" };
}

function foundersDayTick(w) {
  let F = w.lastFounder;
  if (!F) return;
  let C = ((w.customs = w.customs || {}).founders = w.customs.founders || { n: 0, lastYear: seasonAt(w, F.t).year }),
    s = seasonAt(w);
  if (C.lastYear >= s.year || s.doy < seasonAt(w, F.t).doy || isNight(w.t)) return;
  C.lastYear = s.year;
  let at = foundersPlace(w),
    goers = w.creatures.filter((c) => !c.visitor && !c.asleep && !c.farewell && !c.leaving && canBeInterrupted(c) && dist2d(c.x, c.z, at.x, at.z) < FOUNDERS_DAY.reach);
  if (goers.length < 3) return;
  C.n++;
  let leader = goers.slice().sort((a, b) => (a.born ?? 0) - (b.born ?? 0))[0];
  for (let c of goers) {
    let a = w.rng.range(0, 6.28),
      d = w.rng.range(1.6, 3.4);
    setPlan(w, c, { goal: "remember", steps: [{ do: "walk", x: at.x + Math.cos(a) * d, z: at.z + Math.sin(a) * d, near: 0.4, why: "remember" }, { do: "remember", x: at.x, z: at.z, dur: FOUNDERS_DAY.sit }], i: 0 });
  }
  // the old ones tell the young who the eight were
  let tellers = goers.filter((c) => c.stage === "elder" || c === leader),
    kinds = ["founding", "lastfounder", "ov-leaving", "ov-marsh"];
  for (let c of goers) {
    if (tellers.includes(c)) continue;
    let told = 0;
    for (let t of tellers) {
      for (let k in t.lore || {}) {
        let st = w.stories[k];
        if (!st || !kinds.includes(st.kind) || (c.lore && c.lore[k]) || told >= FOUNDERS_DAY.tell) continue;
        learnStory(w, c, st, retell(w, t, c, st, t.lore[k].v), Math.max(0.3, t.lore[k].conf * 0.85), t, false);
        told++;
      }
    }
  }
  // the valley's offering at each founder's tree
  for (let r of w.res) if (r.kind === "grove" && (w.lineage || {})[r.who] && w.lineage[r.who].founder) r.left = Math.min(12, (r.left || 0) + 1);
  let word = wordFor(w, leader, "remembering"),
    where = at.what === "stones" ? "the founders' standing stones" : at.what === "grove" ? "the founders' trees in the grove" : "the Waking Meadow",
    known = w.creatures.some((c) => !c.visitor && c.lore && Object.keys(c.lore).some((k) => w.stories[k] && w.stories[k].kind === "lastfounder")),
    offer = w.customs.passing && w.customs.passing.custom ? `, and ${OFFERINGS[w.customs.passing.custom][0]} for each of the eight` : "";
  if (C.n === 1) {
    logEvent(w, 3, `A year after ${F.name} passed, ${leader.name} led the young ones to ${where} and told them who the eight were${offer}.`, goers.map((c) => c.id), at, "custom");
  } else if (C.n === 2) {
    logEvent(w, 3, `For the second year, the creekfolk gathered at ${where} on the day ${F.name} passed, to remember the eight. It is becoming a custom.`, goers.map((c) => c.id), at, "custom");
  } else {
    if (!C.custom) (C.custom = Math.round(w.t)), (C.word = word);
    logEvent(w, C.n === 3 ? 3 : 2, `The creekfolk gathered at ${where} for "${C.word}", the day they remember the eight${known ? "" : ", though few remember anymore whose day it was"}.`, goers.map((c) => c.id), at, "custom");
  }
  for (let c of goers) remember(w, c, "custom", c === leader ? "I told the young ones about the eight. Someone has to." : "We remembered the eight who came down the creek.", 0.55);
}

ACTIONS.remember = {
  start(w, c, step) {
    return makeAct(w, c, "sit", step.dur || 600, { lookX: step.x, lookZ: step.z });
  },
  end(w, c) {
    c.needs.social = clamp(c.needs.social + 0.15, 0, 1);
    feel(c, w, "warmth", 0.3);
    return true;
  },
};

var cf2FoundersLifeTick = lifeTick;
lifeTick = function (w) {
  cf2FoundersLifeTick(w);
  foundersDayTick(w);
};

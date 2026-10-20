// ==========================================================================
// The temple to the creek (Phase 3B), the spring, and the great project for
// valleys with no giver.
//
// The temple starts once there have been at least 7 gifts in the last 14 real
// days, most of the village believes the creek gives, and the valley is at least
// a week old. It rises in three stages at the Giving Place (shrine, hall, crown),
// each of a dozen parts. A part unlocks when the village feels the creek has
// answered enough; that feeling builds from recent gifts at the pace below. Then
// they build the part with ordinary labour and materials, and the materials keep
// their own clocks: timber from a grove they plant, clay that cures, great stones
// moved only in the dry season.
//
//   giving                     pace
//   about every 4 days         0.5
//   every other day            1.0 (full speed)
//   daily                      1.2
//   twice a day                1.4
//   6 days with no gift        stops; nothing is lost
//
// A valley that hasn't started its temple by day 30 begins the Hall of the
// Ancestors by the memorial grove instead, at full speed on time alone, so every
// valley has a long build. The temple can still start later if gifts begin.
// ==========================================================================

var TEMPLE = {
  startGifts: 7, // gifts in the last startWindow days to begin
  startWindow: 14, // real days
  minDay: 7, // the temple can't begin before week 2
  feelPerPart: 7.8, // real days of "the creek has answered" per part, at full speed
  firstFeel: 0.7, // the first part comes sooner: they're eager
  stopDays: 6, // no gift for this long: the temple stops
  greatDay: 30, // a valley with no temple by now begins its own great project
  groveTrees: 8, // the temple wood
  groveDays: 30, // real days for a planted tree to give timber
  timberRegrow: 8 * 3600, // a grown tree gives another timber this often (up to 3)
  stuckDays: 5, // a part that hasn't moved in this long: they make do with what they have
};

// Materials: timber, from the temple wood and from great fallen trees.
MATERIAL_LABELS.timber = "timber";
HEAVY_MATERIALS.timber = !0;
SOURCE_KIND.timber = ["timbertree", "greatlog"];
GATHER_MATERIAL.timbertree = "timber";
GATHER_MATERIAL.greatlog = "timber";
GATHER_TIME.timbertree = 16;
GATHER_TIME.greatlog = 10;
REGROW_RATES.timbertree = 1 / 480;
UNINTERRUPTIBLE.add("away");

// A part: name, materials, labour, and flags (heavy, cure, dry, dryseason, carve, grove).
var templePart = (name, mats, labor, o = {}) => stageDef(name, mats, labor, o);
STRUCTURES.temple = {
  label: "temple",
  concept: "temple",
  radius: 5.5,
  great: "temple",
  levels: [
    {
      name: "shrine",
      label: "shrine",
      stages: [
        templePart("first stone", { stone: 3 }, 300, { heavy: !0 }),
        templePart("base course", { stone: 6 }, 600, { heavy: !0 }),
        templePart("second course", { stone: 6 }, 600, { heavy: !0 }),
        templePart("offering ledge", { stone: 4 }, 500),
        templePart("water bowl", { clay: 3 }, 400, { cure: 8000, dry: !0 }),
        templePart("temple wood", { seeds: 4 }, 600, { grove: !0 }),
        templePart("third course", { stone: 6 }, 700, { heavy: !0 }),
        templePart("lantern niche", { stone: 3, reeds: 2 }, 500),
        templePart("path to the water", { stone: 8 }, 900, { heavy: !0 }),
        templePart("standing stones", { stone: 8 }, 1200, { heavy: !0 }),
        templePart("carved marker", { branch: 2 }, 1500, { carve: !0 }),
        templePart("capstone", { stone: 4 }, 800, { heavy: !0 }),
      ],
    },
    {
      name: "hall",
      label: "hall",
      stages: [
        templePart("footings", { stone: 10 }, 1500, { heavy: !0 }),
        templePart("floor stones", { stone: 10 }, 1500),
        templePart("corner posts", { timber: 4 }, 1800, { heavy: !0 }),
        templePart("beams", { timber: 4 }, 1800, { heavy: !0 }),
        templePart("north wall", { mud: 12, clay: 4 }, 2000, { cure: 60000, dry: !0 }),
        templePart("south wall", { mud: 12, clay: 4 }, 2000, { cure: 60000, dry: !0 }),
        templePart("first carved panel", { clay: 3 }, 2400, { carve: !0, cure: 20000 }),
        templePart("second carved panel", { clay: 3 }, 2400, { carve: !0, cure: 20000 }),
        templePart("roof battens", { timber: 3, branch: 6 }, 1500),
        templePart("clay-tile roof", { tile: 8 }, 2000, { heavy: !0 }),
        templePart("third carved panel", { clay: 3 }, 2400, { carve: !0, cure: 20000 }),
        templePart("door and lanterns", { timber: 2, reeds: 6 }, 1500),
      ],
    },
    {
      name: "crown",
      label: "crown",
      stages: [
        templePart("first terrace", { stone: 8 }, 1500, { heavy: !0, dryseason: !0 }),
        templePart("second terrace", { stone: 8 }, 1500, { heavy: !0, dryseason: !0 }),
        templePart("third terrace", { stone: 7 }, 1500, { heavy: !0, dryseason: !0 }),
        templePart("fourth terrace", { stone: 6 }, 1400, { heavy: !0, dryseason: !0 }),
        templePart("fifth terrace", { stone: 5 }, 1300, { heavy: !0, dryseason: !0 }),
        templePart("top step", { stone: 4 }, 1200, { heavy: !0, dryseason: !0 }),
        templePart("channel lining", { clay: 6 }, 1500, { cure: 60000, dry: !0 }),
        templePart("cistern", { clay: 4, stone: 3 }, 1500, { cure: 40000, dry: !0 }),
        templePart("water stair", { mud: 6, stone: 3 }, 1500),
        templePart("sun gate posts", { timber: 3, stone: 4 }, 1500, { heavy: !0 }),
        templePart("sun gate", { timber: 2 }, 2000),
        templePart("crown stone", { stone: 3 }, 1500, { heavy: !0, dryseason: !0 }),
      ],
    },
  ],
};

// The great project of a valley with no giver: the Hall of the Ancestors, by the grove.
STRUCTURES.ancestors = {
  label: "Hall of the Ancestors",
  concept: "ancestors",
  radius: 4.5,
  great: "ancestors",
  levels: [
    {
      name: "stones",
      label: "ancestor stones",
      stages: [
        templePart("first stone", { stone: 3 }, 300, { heavy: !0 }),
        templePart("names of the first five", { stone: 2 }, 1500, { carve: !0 }),
        templePart("second stone", { stone: 3 }, 400, { heavy: !0 }),
        templePart("third stone", { stone: 3 }, 400, { heavy: !0 }),
        templePart("names of the elders", { stone: 2 }, 1500, { carve: !0 }),
        templePart("fourth stone", { stone: 3 }, 400, { heavy: !0 }),
        templePart("stone ring", { stone: 8 }, 900, { heavy: !0 }),
        templePart("hall wood", { seeds: 4 }, 600, { grove: !0 }),
        templePart("fifth stone", { stone: 3 }, 400, { heavy: !0 }),
        templePart("lamp stones", { stone: 4, reeds: 2 }, 600),
        templePart("names of the travelers", { stone: 2 }, 1500, { carve: !0 }),
        templePart("sixth stone", { stone: 3 }, 400, { heavy: !0 }),
      ],
    },
    {
      name: "hall",
      label: "hall",
      stages: [
        templePart("footings", { stone: 10 }, 1500, { heavy: !0 }),
        templePart("floor stones", { stone: 10 }, 1500),
        templePart("corner posts", { timber: 4 }, 1800, { heavy: !0 }),
        templePart("beams", { timber: 4 }, 1800, { heavy: !0 }),
        templePart("east wall", { mud: 12, clay: 4 }, 2000, { cure: 60000, dry: !0 }),
        templePart("west wall", { mud: 12, clay: 4 }, 2000, { cure: 60000, dry: !0 }),
        templePart("first carved panel", { clay: 3 }, 2400, { carve: !0, cure: 20000 }),
        templePart("second carved panel", { clay: 3 }, 2400, { carve: !0, cure: 20000 }),
        templePart("roof battens", { timber: 3, branch: 6 }, 1500),
        templePart("clay-tile roof", { tile: 8 }, 2000, { heavy: !0 }),
        templePart("third carved panel", { clay: 3 }, 2400, { carve: !0, cure: 20000 }),
        templePart("door and lanterns", { timber: 2, reeds: 6 }, 1500),
      ],
    },
    {
      name: "tower",
      label: "lantern tower",
      stages: [
        templePart("first ring", { stone: 8 }, 1500, { heavy: !0, dryseason: !0 }),
        templePart("second ring", { stone: 8 }, 1500, { heavy: !0, dryseason: !0 }),
        templePart("third ring", { stone: 7 }, 1500, { heavy: !0, dryseason: !0 }),
        templePart("fourth ring", { stone: 6 }, 1400, { heavy: !0, dryseason: !0 }),
        templePart("stair", { timber: 3 }, 1500),
        templePart("fifth ring", { stone: 5 }, 1300, { heavy: !0, dryseason: !0 }),
        templePart("lamp room floor", { timber: 3 }, 1500),
        templePart("lamp room walls", { clay: 6 }, 1500, { cure: 40000, dry: !0 }),
        templePart("lamp", { clay: 4, glowcap: 2 }, 1500, { cure: 20000 }),
        templePart("roof posts", { timber: 3, stone: 4 }, 1500, { heavy: !0 }),
        templePart("roof", { tile: 6 }, 2000, { heavy: !0 }),
        templePart("crown stone", { stone: 3 }, 1500, { heavy: !0, dryseason: !0 }),
      ],
    },
  ],
};

var GREAT_TEXT = {
  temple: { name: "temple", the: "the temple", levels: ["shrine", "hall", "crown"] },
  ancestors: { name: "Hall of the Ancestors", the: "the Hall of the Ancestors", levels: ["ancestor stones", "hall", "lantern tower"] },
};

// ---------------------------------------------------------------------------
// Pace
// ---------------------------------------------------------------------------

// Gifts per real day over the last `days` days (or since the first gift, if sooner).
function giftRate(w, days = TEMPLE.startWindow) {
  let g = w.gifts || [];
  if (!g.length) return 0;
  let n = g.filter((x) => w.t - x.t < days * 86400).length,
    span = clamp((w.t - g[0].t) / 86400 + 1, 1, days);
  return n / span;
}

// The pace table: straight lines between the author's points on a log scale.
function paceOfRate(r) {
  if (r <= 0) return 0;
  let L = Math.log2(r); // -2 every 4 days, -1 every other day, 0 daily, 1 twice a day
  if (L <= -2) return 0.4 + 0.1 * clamp((L + 2.585) / 0.585, 0, 1);
  if (L <= -1) return 0.5 + 0.5 * (L + 2);
  if (L <= 0) return 1 + 0.2 * (L + 1);
  return Math.min(1.4, 1.2 + 0.2 * L);
}

function templePace(w) {
  if (!(w.gifts || []).length || w.t - (w.giftLast ?? -1e9) > TEMPLE.stopDays * 86400) return 0;
  return paceOfRate(giftRate(w));
}

// ---------------------------------------------------------------------------
// The temple's life
// ---------------------------------------------------------------------------
function greatStructure(w, kind) {
  let g = kind === "temple" ? w.temple : w.ancestors;
  return g && g.sid ? w.byId[g.sid] : null;
}

function templeCanStart(w) {
  return !w.temple && w.givingPlace && w.t >= TEMPLE.minDay * 86400 && (w.gifts || []).filter((x) => w.t - x.t < TEMPLE.startWindow * 86400).length >= TEMPLE.startGifts && mostBelieve(w);
}

function foundGreat(w, kind, at, by) {
  let s = register(w, {
    id: w.nextId++,
    kind,
    x: +at.x.toFixed(2),
    z: +at.z.toFixed(2),
    rot: +(at.rot || 0).toFixed(3),
    owner: null,
    founder: by ? by.id : null,
    level: 0,
    t: Math.round(w.t),
    building: { level: 0, stage: 0, delivered: {}, labor: 0, cureLeft: 0, cureUntil: null, started: w.t, by: by ? by.id : null, locked: !0 },
    contrib: {},
    spare: {},
  });
  w.structures.push(s);
  let g = { kind, sid: s.id, started: Math.round(w.t), feel: kind === "temple" ? TEMPLE.firstFeel : 0.5, parts: 0, partTimes: [], stageTimes: [], carvings: [], state: "waiting", unlockedAt: null, made: 0 };
  if (kind === "temple") w.temple = g;
  else w.ancestors = g;
  return { s, g };
}

// The sunrise at their midwinter, seen from the Giving Place (for the crown's sun gate).
// The view draws the sun rising toward +x and a little +z.
var SUNRISE_DIR = Math.atan2(0.9, 0.45);

function startTemple(w) {
  let gp = w.givingPlace,
    by = believers(w).filter((c) => c.stage !== "child").sort((a, b) => b.beliefs.giver - a.beliefs.giver)[0] || null,
    { s } = foundGreat(w, "temple", { x: gp.x, z: gp.z, rot: SUNRISE_DIR }, by);
  logEvent(w, 3, `The creekfolk have begun a shrine at the Giving Place, to honour the creek that gives.${by ? ` ${by.name} set the first stone in place in their mind long before anyone lifted it.` : ""}`, by ? [by.id] : [], s, "temple");
  newStory(w, "temple", { what: "shrine", where: "the Giving Place" }, s, 2, witnessesNear(w, s, 20, by ? [by] : []));
  for (let c of believers(w)) remember(w, c, "temple", "We're building a shrine for the creek at the Giving Place.", 0.7, { x: s.x, z: s.z, pv: 0.4 });
}

function startAncestors(w) {
  let T = w.terrain,
    grove = w.res.filter((r) => r.kind === "grove"),
    near = grove.length ? { x: grove.reduce((a, r) => a + r.x, 0) / grove.length, z: grove.reduce((a, r) => a + r.z, 0) / grove.length } : villageCentre(w),
    at = null;
  for (let i = 0; i < 300 && !at; i++) {
    let p = T.randomPoint(w.rng, { near: { x: near.x, z: near.z, r: 8 + i / 15 }, offFloor: true, minEdge: 6 });
    if (p && siteFor(w, p.x, p.z, 4.5, "ancestors")) at = p;
  }
  if (!at) return false;
  let by = w.creatures.filter((c) => c.stage === "elder" && !c.visitor)[0] || w.creatures.find((c) => !c.visitor) || null,
    { s } = foundGreat(w, "ancestors", { x: at.x, z: at.z, rot: Math.atan2(near.x - at.x, near.z - at.z) }, by);
  logEvent(w, 3, `The creekfolk have begun a great work near the memorial grove: a Hall of the Ancestors, to honour the creek and everyone it has kept.${by ? ` ${by.name} chose the place.` : ""}`, by ? [by.id] : [], s, "temple");
  newStory(w, "temple", { what: "Hall of the Ancestors", where: null }, s, 2, witnessesNear(w, s, 20, by ? [by] : []));
  return true;
}

// Every life tick (600 s).
function templeTick(w) {
  if (templeCanStart(w)) startTemple(w);
  if (!w.ancestors && !w.temple && w.t >= TEMPLE.greatDay * 86400) startAncestors(w);
  if (w.temple) greatTick(w, w.temple, templePace(w));
  if (w.ancestors) greatTick(w, w.ancestors, 1);
  growTimber(w);
  springTick(w);
}

function greatTick(w, g, pace) {
  let s = w.byId[g.sid];
  if (!s || g.state === "done") return;
  let def = STRUCTURES[s.kind],
    txt = GREAT_TEXT[s.kind];
  // Between stages: begin the next one, waiting for the creek.
  if (!s.building) {
    if (s.level >= def.levels.length) return greatDone(w, g, s);
    s.building = { level: s.level, stage: 0, delivered: {}, labor: 0, cureLeft: 0, cureUntil: null, started: w.t, by: null, locked: !0 };
  }
  let b = s.building;
  if (b.locked) {
    // Stopped: no gift for six days. Nothing is lost.
    if (pace <= 0) {
      if (g.state !== "stopped") {
        g.state = "stopped";
        g.stoppedAt = Math.round(w.t);
        logEvent(w, 3, `No one has lifted a stone at ${txt.the} for days. "We'll wait for a sign," they say. They sweep the stones, leave small gifts there, and wait.`, [], s, "temple");
      } else if (!g.storied && w.t - g.stoppedAt > 4 * 86400) {
        g.storied = 1;
        newStory(w, "temple-wait", { what: txt.levels[Math.min(s.level, 2)] }, s, 1, believers(w));
      }
      return;
    }
    if (g.state === "stopped") {
      logEvent(w, 3, `The creek has given again, and the builders have taken up their tools at ${txt.the}.`, [], s, "temple");
      g.storied = 0;
    }
    g.state = "waiting";
    g.feel = +(g.feel + (pace * LIFE.tick) / (TEMPLE.feelPerPart * 86400)).toFixed(5);
    if (g.feel >= 1) {
      g.feel = +(g.feel - 1).toFixed(5);
      b.locked = !1;
      g.unlockedAt = Math.round(w.t);
      g.state = "building";
      let st = def.levels[b.level].stages[b.stage],
        lv = def.levels[b.level].label;
      let first = {
        temple: ["The creek has answered, the believers say: the first stone of the shrine can be laid.", "The creek has answered. The creekfolk have begun the hall of the temple, behind the shrine.", "The creek has answered. The creekfolk have begun the crown of the temple: a stepped pyramid behind the hall, to carry the creek's water down its steps."],
        ancestors: ["The first of the ancestor stones can be raised.", "The creekfolk have begun the hall of the Hall of the Ancestors, inside the ring of stones.", "The creekfolk have begun the lantern tower of the Hall of the Ancestors."],
      }[s.kind][b.level];
      if (b.stage === 0) logEvent(w, 3, first, [], s, "temple");
      else logEvent(w, 2, s.kind === "temple" ? `The creek has answered, the believers say. Next for the ${lv}: the ${st.name}.` : `Next for the ${lv} of the Hall of the Ancestors: the ${st.name}.`, [], s, "temple");
    }
    return;
  }
  g.state = "building";
  // A part that hasn't moved in days: they make do with what they have.
  if (g.unlockedAt && w.t - g.unlockedAt > TEMPLE.stuckDays * 86400 && !b.cureLeft) {
    let need = stageNeeds(s),
      made = 0;
    for (let m in need)
      if ((b.delivered[m] || 0) < need[m]) (b.delivered[m] = need[m]), made++;
    if (made) {
      g.made++;
      g.unlockedAt = Math.round(w.t);
      logEvent(w, 2, `The builders at ${txt.the} couldn't find what they needed, so they made do with what they had.`, [], s, "temple");
    }
  }
}

// Called by the core (stageDone) when a part of a great project is finished.
function greatPartDone(w, s, level, stage) {
  let g = s.kind === "temple" ? w.temple : w.ancestors,
    st = STRUCTURES[s.kind].levels[level].stages[stage];
  if (!g) return;
  g.parts++;
  g.partTimes.push(Math.round(w.t));
  g.unlockedAt = null;
  g.state = "waiting";
  if (st.grove) plantTimberGrove(w, s);
  if (st.carve) carveStory(w, s, g);
  if (stage === STRUCTURES[s.kind].levels[level].stages.length - 1) g.stageTimes.push(Math.round(w.t));
  else logEvent(w, 1, `The ${st.name} of the ${STRUCTURES[s.kind].levels[level].label} ${/s$/.test(st.name) ? "are" : "is"} done.`, [], s, "temple");
}

function greatDone(w, g, s) {
  g.state = "done";
  g.done = Math.round(w.t);
  let days = Math.round((g.done - g.started) / 86400);
  if (s.kind === "temple") {
    logEvent(w, 3, "The temple is finished. The crown stands over the shrine and the hall, the creek runs down its steps, and the sun gate faces their midwinter sunrise. The creekfolk sat together on the steps until dark.", [], s, "temple");
    newStory(w, "temple-done", { what: "temple", n: days }, s, 3, w.creatures.filter((c) => !c.visitor));
  } else {
    logEvent(w, 3, "The Hall of the Ancestors is finished. A lamp burns at the top of its tower, and every name the valley remembers is carved inside.", [], s, "temple");
    newStory(w, "temple-done", { what: "Hall of the Ancestors", n: days }, s, 3, w.creatures.filter((c) => !c.visitor));
  }
}

// A dream can bring the next part closer (gift.js).
function templeDream(w, c) {
  let g = w.temple,
    s = g && w.byId[g.sid];
  if (!s || g.state === "done" || !s.building || !s.building.locked) return false;
  g.feel = +Math.min(0.999, g.feel + 0.5).toFixed(5);
  let def = STRUCTURES.temple.levels[s.building.level];
  logEvent(w, 3, `${c.name} dreamed of the ${def.label} as it will be: the ${def.stages[s.building.stage].name}, every stone in its place. They told everyone at breakfast.`, [c.id], c, "gift");
  remember(w, c, "dream", `I dreamed of the ${def.stages[s.building.stage].name} of the ${def.label}, finished.`, 0.85);
  return true;
}

// A gift has come (gift.js): nothing to do here yet beyond what the pace reads.
function templeOnGift(w) {}

// ---------------------------------------------------------------------------
// Timber: the temple wood, planted as part of the shrine, grows for about a month.
// ---------------------------------------------------------------------------
function plantTimberGrove(w, s) {
  let T = w.terrain,
    n = 0;
  for (let i = 0; i < 80 && n < TEMPLE.groveTrees; i++) {
    let p = T.randomPoint(w.rng, { near: { x: s.x, z: s.z, r: 9 + i / 8 }, offFloor: true, minEdge: 4, avoid: [{ x: s.x, z: s.z, r: 6.5 }] });
    if (!p || w.res.some((r) => (r.x - p.x) ** 2 + (r.z - p.z) ** 2 < 4) || w.structures.some((o) => (o.x - p.x) ** 2 + (o.z - p.z) ** 2 < (STRUCTURES[o.kind].radius + 1.5) ** 2)) continue;
    let o = register(w, { id: w.nextId++, kind: "timbertree", x: +p.x.toFixed(2), z: +p.z.toFixed(2), side: T.side(p.x, p.z), planted: Math.round(w.t), grow: 0, amt: 0, max: 3, canopy: 0.4, variant: "pine", forGreat: s.kind });
    w.res.push(o);
    n++;
  }
  logEvent(w, 2, `The creekfolk planted ${numberWords(n)} young trees near ${s.kind === "temple" ? "the Giving Place" : "the Hall of the Ancestors"}. In a month or so they will be tall enough for beams.`, [], s, "temple");
}

function growTimber(w) {
  for (let r of w.res) {
    if (r.kind !== "timbertree") continue;
    if (r.grow < 1) {
      r.grow = +Math.min(1, r.grow + LIFE.tick / (TEMPLE.groveDays * 86400)).toFixed(5);
      r.canopy = +(0.4 + 1.6 * r.grow).toFixed(2);
      if (r.grow >= 1) {
        r.amt = 2;
        r.regrowAt = Math.round(w.t + TEMPLE.timberRegrow);
        if (!w.timberNoted) {
          w.timberNoted = 1;
          logEvent(w, 2, "The trees planted for the great work have grown tall enough to give timber.", [], r, "nature");
        }
      }
    } else if (r.amt < r.max && w.t >= (r.regrowAt || 0)) {
      r.amt++;
      r.regrowAt = Math.round(w.t + TEMPLE.timberRegrow);
    }
  }
}

// ---------------------------------------------------------------------------
// Carvings record the village's version of a story, as it is told now. A carved story
// drifts more slowly afterwards (minds.js).
// ---------------------------------------------------------------------------
function carveStory(w, s, g) {
  let tell = {};
  for (let c of w.creatures) if (!c.visitor) for (let k in c.lore || {}) (tell[k] = tell[k] || []).push(c.lore[k]);
  let best = null;
  for (let k in tell) {
    let st = w.stories[k];
    if (!st || st.carved) continue;
    let score = tell[k].length * (st.weight || 1);
    if (!best || score > best.score) best = { k, st, score };
  }
  if (!best) return;
  let counts = new Map();
  for (let l of tell[best.k]) {
    let key = JSON.stringify([l.v.who, l.v.n, l.v.where, l.v.why, l.v.big || 0]);
    let e = counts.get(key) || { n: 0, v: l.v };
    e.n++;
    counts.set(key, e);
  }
  let top = [...counts.values()].sort((a, b) => b.n - a.n)[0],
    text = storyText(w, best.st, top.v);
  best.st.carved = Math.round(w.t);
  g.carvings.push({ id: best.st.id, text, t: Math.round(w.t), true: sameTold(w, best.st, top.v, best.st.truth) });
  if (g.carvings.length > 60) g.carvings.shift();
  logEvent(w, 2, `They carved a story into ${s.kind === "temple" ? "the temple" : "the Hall of the Ancestors"}: "${text}"`, [], s, "carving");
}

// ---------------------------------------------------------------------------
// The spring where the creek begins: first heard of, then found, then visited.
// ---------------------------------------------------------------------------
var SPRING_NEWS = "the creek begins at a spring, up past the head of this valley, where the water comes up out of the ground under a mossy stone";

function springOf(w) {
  return w.spring || (w.spring = { heard: null, found: null, journey: null, visits: 0 });
}

// News of the spring arrives with a visitor or traveler, once the creek belief has taken hold.
function springNews(w, c) {
  let sp = springOf(w);
  if (sp.heard) return null;
  let alive = w.creatures.filter((o) => !o.visitor).length;
  if (believers(w).length < alive / 3) return null;
  sp.heard = Math.round(w.t);
  sp.from = c ? c.name : null;
  return SPRING_NEWS;
}

// Where the spring is: beyond the valley's upstream end, along the creek.
function springAt(w) {
  let z = -14;
  return { x: +w.terrain.creekX(z).toFixed(2), z };
}
// The head of the valley, where the walk out to the spring starts.
function springGate(w) {
  let T = w.terrain;
  for (let z = 2.5; z < 14; z += 0.5)
    for (let off of [2, 3, 4, 1.5]) {
      let x = T.creekX(z) + (T.side(w.meadow.x, w.meadow.z) === 0 ? -off : off);
      if (T.walkable(x, z)) return { x: +x.toFixed(2), z };
    }
  return { x: w.meadow.x, z: w.meadow.z };
}

function springTick(w) {
  let sp = springOf(w);
  // If no one brings the news, a curious elder wonders aloud where the creek comes from.
  if (!sp.heard && w.t > 60 * 86400 && believers(w).length > 2) {
    let c = w.creatures.filter((o) => !o.visitor && o.stage !== "child").sort((a, b) => b.temp.curiosity - a.temp.curiosity)[0];
    if (c) {
      sp.heard = Math.round(w.t);
      sp.from = c.name;
      sp.wondered = 1;
      logEvent(w, 3, `${c.name} has been wondering where the creek comes from. "It must start somewhere," they say, "up past the head of the valley."`, [c.id], c, "spring");
    }
  }
}

// Someone sets out for the spring: the first journey, or later a believer's visit.
function springOption(w, c) {
  let sp = w.spring;
  if (!sp || !sp.heard || c.visitor || c.farewell || c.leaving || c.stage !== "adult" || isNight(w.t)) return null;
  if (c.lifespan && c.born + c.lifespan - w.t < 3 * 86400) return null;
  if (w.creatures.some((o) => o.plan && o.plan.goal === "journey")) return null;
  let score;
  if (!sp.found) {
    if (w.t - sp.heard < 0.25 * 86400 && sp.dreamer !== c.id) return null; // they talk it over first
    score = sp.dreamer === c.id ? 1.6 : 0.15 + 0.6 * c.temp.curiosity * (0.5 + c.interests.exploring) + 0.3 * (c.beliefs ? c.beliefs.giver : 0);
  } else {
    // later visits: a believer goes now and then, about every few real days for the village
    if (w.t - (sp.lastVisit || sp.found) < 3 * 86400 || !(c.beliefs && c.beliefs.giver > 0.6)) return null;
    score = 0.12 + 0.4 * c.beliefs.giver * (0.5 + c.interests.exploring);
  }
  let gate = springGate(w);
  return { score, plan: { goal: "journey", steps: [{ do: "walk", x: gate.x, z: gate.z, near: 0.4, why: "spring" }, { do: "journey" }] } };
}

ACTIONS.journey = {
  start(w, c) {
    let sp = springOf(w);
    sp.journey = c.id;
    let at = springAt(w);
    if (!sp.found && !sp.setOut) {
      sp.setOut = 1;
      logEvent(w, 3, `${c.name} has set out from the head of the valley to find the spring where the creek begins.`, [c.id], c, "spring");
    }
    return makeAct(w, c, "away", sp.found ? 0.3 * getDayLength() : 0.5 * getDayLength(), { lookX: at.x, lookZ: at.z });
  },
  end(w, c) {
    let sp = springOf(w),
      at = springAt(w);
    sp.journey = null;
    c.needs.food = Math.max(c.needs.food, 0.35); // they ate on the way
    if (!sp.found) {
      sp.found = Math.round(w.t);
      sp.by = c.id;
      sp.byName = c.name;
      namePlace(w, "the Spring", at, "spring", 4, c, true);
      logEvent(w, 3, `${c.name} came back from beyond the head of the valley. They found it: the spring where the creek begins, water rising cold and clear out of the ground under a mossy stone. "That's where the creek's gifts come from," the believers say now. It is the holiest place they know.`, [c.id], c, "spring");
      newStory(w, "spring", { who: c.name }, at, 3, witnessesNear(w, c, 12, [c]));
      remember(w, c, "spring", "I found the spring where the creek begins. I drank from it. I'll never forget it.", 1, { x: at.x, z: at.z, pv: 0.8 });
      feel(c, w, "joy", 1);
      for (let o of w.creatures) if (o.beliefs && o.beliefs.giver > 0.4) o.beliefs.giver = +Math.min(Math.max(o.beliefs.giver, beliefCap(w, o)), o.beliefs.giver + 0.05).toFixed(3);
    } else {
      sp.visits++;
      sp.lastVisit = Math.round(w.t);
      let of = (w.offerings = w.offerings || { n: {}, total: 0, recent: [] });
      of.n.water = (of.n.water || 0) + 1;
      of.total++;
      of.recent.push({ k: "water", by: c.name, t: Math.round(w.t) });
      if (of.recent.length > GIFT.offeringsShown) of.recent.shift();
      if (sp.visits === 1 || sp.visits % 10 === 0) logEvent(w, 2, `${c.name} walked up to the Spring and brought back a little of its water for the Giving Place.`, [c.id], c, "spring");
      remember(w, c, "spring", "I went to the Spring. The water there is the coldest, clearest thing.", 0.8);
      feel(c, w, "joy", 0.6);
    }
    return true;
  },
};

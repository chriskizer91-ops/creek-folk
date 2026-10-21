// ==========================================================================
// Creekfolk 2: carvings, by material.
//
// A creekfolk carves what they want remembered, in the version they tell. What they carve
// it in depends on how much it matters to them:
// - sand by the creek: a few minutes' drawing, gone with the next flood (or the next day);
//   children do it most;
// - clay: a tablet pressed and set by their home, lasting about a season before it crumbles;
// - stone: days of cutting, a little at a time, with tools; it lasts for good, set in a row
//   of standing stones near the village (the Telling Stones), wearing slowly in the rain.
// Those who pass a carving read it now and then and learn its version (a worn one can be
// misread); a story kept in stone isn't lost when no one remembers it. Elders copy a crumbling
// clay tablet onto a new one (copies drift), and recut a worn stone, sometimes "correcting" it
// to the version they tell. The original wording of every recut is kept (`recut`).
//
// Wraps lifeOptions3C (returning.js), lifeTick (life.js), checkMyths (minds.js) and
// creekStorm (creek.js); see docs/MERGE.md.
// ==========================================================================

var CARVE = {
  keep: 90,             // carvings kept (worn-away ones are dropped first)
  gap: 3,               // days between carvings by one creekfolk (a day for drawing in sand)
  sandMin: 6, clayMin: 40, stoneSession: 45, stoneWork: 20, // minutes: sand, clay, a stone session; sessions in a stone
  sessionGap: 3,        // hours between one carver's sessions at a stone
  stonesAtOnce: 2,      // stones being cut at the same time
  stoneStartGap: 1.5,   // days between new stones begun
  clayDays: 2,          // a clay tablet lasts about a season
  stoneDays: 90,        // a stone wears smooth over about three months (twice as fast in the rain)
  readChance: 0.12,     // chance, each life tick, that someone near a carving reads it
  worthStone: 2.6,      // how much a story must matter to cut it in stone
  worthClay: 1.7,
};

function carvingsAll(w) {
  return (w.carvings = w.carvings || []);
}
function carvingsOf(w, sid) {
  return carvingsAll(w).filter((k) => k.s === sid && !k.gone && (k.mat !== "stone" || k.done >= 1));
}
function carveLabel(w, k) {
  let by = k.byName || "someone",
    when = `day ${Math.floor(k.t / 86400) + 1}`;
  if (k.mat === "sand") return `Drawn in the sand by ${by}, ${when}`;
  if (k.mat === "clay") return `${k.copyOf ? "Copied into clay" : "Pressed into clay"} by ${by}, ${when}${k.wear > 0.6 ? ", crumbling" : ""}`;
  let re = k.recut && k.recut.length ? `, recut by ${k.recut[k.recut.length - 1][1]}` : "";
  return `Cut in stone by ${by}, ${when}${re}${k.wear > 0.6 ? ", worn" : ""}`;
}

// How much a story they hold matters to them.
function carveWorth(w, c, s, l) {
  let own = l.first ? 1.3 : 1,
    old = s.old ? (c.founder ? 1.45 : 1.15) : 1,
    told = 1 + Math.min(1, l.told * 0.08);
  return (s.weight || 1) * l.conf * own * old * told * (0.8 + 0.4 * (c.interests.building || 0));
}

// Where the standing stones go: beside the meeting place, or the village's middle.
function tellingStonesAt(w) {
  if (w.tellingStones) return w.tellingStones;
  let meet = findStructure(w, "meeting", (s) => s.level > 0),
    at = meet ? { x: meet.x, z: meet.z } : villageCentre(w),
    T = w.terrain,
    best = null;
  for (let r = 7; r <= 16 && !best; r += 3)
    for (let k = 0; k < 12 && !best; k++) {
      let a = (k / 12) * Math.PI * 2,
        x = at.x + Math.cos(a) * r * CF2_SCALE.build,
        z = at.z + Math.sin(a) * r * CF2_SCALE.build;
      if (!T.walkable(x, z) || T.edgeDist(x, z) < 4) continue;
      if (w.structures.some((s) => (s.x - x) ** 2 + (s.z - z) ** 2 < (STRUCTURES[s.kind].radius + 3) ** 2)) continue;
      best = { x: +x.toFixed(2), z: +z.toFixed(2), a: +(a + Math.PI / 2).toFixed(3) };
    }
  return (w.tellingStones = best || { x: at.x + 6, z: at.z, a: 0 });
}
function stoneSpot(w, n) {
  let S = tellingStonesAt(w),
    row = Math.floor(n / 9),
    col = (n % 9) - 4,
    d = 1.5 * CF2_SCALE.build;
  return { x: +(S.x + Math.cos(S.a) * col * d - Math.sin(S.a) * row * d).toFixed(2), z: +(S.z + Math.sin(S.a) * col * d + Math.cos(S.a) * row * d).toFixed(2) };
}

function carveSite(w, c, mat) {
  let T = w.terrain;
  if (mat === "sand") {
    let n = w.creek.nodes[creekNodeIndex(c.z)],
      x = n.x + (c.x < n.x ? -1 : 1) * (n.wb / 2 + 0.9);
    return T.walkable(x, n.z) && Math.abs(c.x - n.x) < 45 ? { x, z: n.z } : null;
  }
  if (mat === "clay") {
    let h = c.home != null ? w.byId[c.home] : null,
      at = h || villageCentre(w),
      a = w.rng.range(0, 6.28),
      r = (h ? STRUCTURES.home.radius + 1.2 : 3) * 1;
    let p = { x: at.x + Math.cos(a) * r, z: at.z + Math.sin(a) * r };
    return T.walkable(p.x, p.z) ? p : { x: at.x, z: at.z };
  }
  return stoneSpot(w, carvingsAll(w).filter((k) => k.mat === "stone").length);
}

// What decide() can choose: carving, going on cutting a stone, copying or recutting one.
function carveOption(w, c) {
  if (c.visitor || c.leaving || c.farewell || c.asleep || isNight(w.t) || w.weather.rain > 0.3) return null;
  if (c.needs.energy < 0.35 || c.needs.food < 0.35) return null;
  let K = carvingsAll(w),
    elder = c.stage === "elder",
    child = c.stage === "child";
  // a stone they are cutting
  let mine = K.find((k) => k.mat === "stone" && k.by === c.id && k.done < 1 && !k.gone);
  if (mine) return w.t - (c.lastCut || -1e9) < CARVE.sessionGap * 3600 ? null : { score: 0.5 + (elder ? 0.3 : 0.1), plan: { goal: "carve", mat: "stone", steps: [{ do: "walk", x: mine.x, z: mine.z, near: 1.1 }, { do: "carve", cid: mine.id, dur: CARVE.stoneSession * 60 }] } };
  // (the founders don't all sit down to carve on the first morning)
  let last = c.lastCarve ?? (c.founder ? ((c.id % 6) * 0.5 - CARVE.gap) * 86400 : -1e9);
  if (w.t - last < (child ? 1 : CARVE.gap) * 86400) return null;
  if (!w.rng.chance(child ? 0.01 : elder ? 0.012 : c.founder ? 0.008 : 0.004)) return null;
  // a crumbling tablet or a worn stone of a story they tell: copy it, or recut it
  if (!child && w.rng.chance(0.35)) {
    let worn = K.find((k) => !k.gone && k.wear > (k.mat === "stone" ? 0.55 : 0.7) && k.mat !== "sand" && c.lore && c.lore[k.s] && (k.mat === "clay" ? !K.some((o) => o.copyOf === k.id) : !k.recutBy));
    if (worn) {
      let p = worn.mat === "clay" ? carveSite(w, c, "clay") : { x: worn.x, z: worn.z };
      if (p) return { score: 0.5 + (elder ? 0.4 : 0), plan: { goal: "carve", mat: worn.mat, steps: [{ do: "walk", x: p.x, z: p.z, near: 1.1 }, { do: "carve", fix: worn.id, x: p.x, z: p.z, dur: (worn.mat === "clay" ? CARVE.clayMin : CARVE.stoneSession) * 60 }] } };
    }
  }
  // a story of their own to carve
  let best = null;
  for (let k in c.lore || {}) {
    let s = w.stories[k],
      l = c.lore[k];
    if (!s || (s.weight || 1) < 2) continue;
    let worth = carveWorth(w, c, s, l),
      had = K.filter((x) => x.s === s.id && !x.gone);
    if (had.some((x) => x.mat === "stone")) worth *= 0.25; // already in stone
    if (had.some((x) => x.by === c.id)) worth *= 0.2;
    worth /= 1 + 0.5 * had.length; // something no one has carved yet
    if (!best || worth > best.worth) best = { s, l, worth };
  }
  if (!best) return null;
  let cutting = K.filter((k) => k.mat === "stone" && k.done < 1 && !k.gone),
    lastStone = K.reduce((a, k) => (k.mat === "stone" ? Math.max(a, k.t) : a), -1e9),
    canStone = cutting.length < CARVE.stonesAtOnce && w.t - lastStone > CARVE.stoneStartGap * 86400 && c.know && c.know.tools,
    mat = child ? "sand" : best.worth >= CARVE.worthStone && canStone ? "stone" : best.worth >= CARVE.worthClay ? "clay" : "sand",
    p = carveSite(w, c, mat);
  if (!p) return null;
  return {
    score: (child ? 0.3 : 0.15) + (elder ? 0.3 : 0) + (c.founder ? 0.1 : 0) + 0.05 * best.worth,
    plan: { goal: "carve", mat, steps: [{ do: "walk", x: p.x, z: p.z, near: 1.1 }, { do: "carve", sid: best.s.id, mat, x: p.x, z: p.z, dur: (mat === "sand" ? CARVE.sandMin : mat === "clay" ? CARVE.clayMin : CARVE.stoneSession) * 60 }] },
  };
}

var cf2CarveOptions = lifeOptions3C;
lifeOptions3C = function (w, c) {
  let out = cf2CarveOptions(w, c),
    o = carveOption(w, c);
  if (o) out.push(["carve", o]);
  return out;
};

ACTIONS.carve = {
  start(w, c, step) {
    if (step.mat === "stone" && step.sid != null) {
      let K = carvingsAll(w),
        s = w.stories[step.sid],
        l = c.lore && c.lore[step.sid];
      if (!s || !l || K.some((k) => k.s === step.sid && k.mat === "stone" && !k.gone)) return "skip";
      let k = addCarving(w, { s: s.id, kind: s.kind, v: { ...l.v }, by: c.id, byName: c.name, mat: "stone", x: +step.x.toFixed(2), z: +step.z.toFixed(2), done: 0 });
      step.cid = k.id;
      step.sid = null;
      logEvent(w, 2, `${c.name} has begun cutting a story into a standing stone: ${lower(k.text)}`, [c.id], k, "carving");
      if (!w.tellingStonesNamed) (w.tellingStonesNamed = 1), namePlace(w, "the Telling Stones", tellingStonesAt(w), "stones", 6, c, true);
      remember(w, c, "carving", "I've begun cutting a story into stone. It will take days, but it will last.", 0.7);
      s.carved = s.carved || Math.round(w.t);
    }
    return makeAct(w, c, "craft", step.dur || 600, { carve: 1 });
  },
  end(w, c, a, step) {
    let K = carvingsAll(w);
    c.needs.fun = clamp(c.needs.fun + 0.12, 0, 1);
    c.lastCarve = Math.round(w.t);
    if (step.cid != null) return cutMore(w, c, K.find((k) => k.id === step.cid));
    if (step.fix != null) return fixCarving(w, c, K.find((k) => k.id === step.fix), step);
    let s = w.stories[step.sid],
      l = c.lore && c.lore[step.sid];
    if (!s || !l) return true;
    let k = addCarving(w, { s: s.id, kind: s.kind, v: { ...l.v }, by: c.id, byName: c.name, mat: step.mat, x: +step.x.toFixed(2), z: +step.z.toFixed(2), done: 1 });
    if (step.mat === "clay") {
      logEvent(w, 1, `${c.name} pressed a story into a clay tablet by their home: ${lower(k.text)}`, [c.id], k, "carving");
      remember(w, c, "carving", "I pressed a story into clay, so it won't be forgotten. Not for a while, anyway.", 0.5);
    } else logEvent(w, 1, `${c.name} drew a story in the sand by the creek.`, [c.id], k, "carving");
    s.carved = s.carved || Math.round(w.t);
    return true;
  },
};

function addCarving(w, k) {
  let K = carvingsAll(w);
  w.carveSeq = (w.carveSeq || 0) + 1;
  let s = w.stories[k.s];
  k = { id: w.carveSeq, t: Math.round(w.t), wear: 0, recut: [], ...k, text: s ? storyText(w, s, k.v) : "" };
  K.push(k);
  if (K.length > CARVE.keep) {
    let j = K.findIndex((x) => x.gone);
    K.splice(j >= 0 ? j : K.findIndex((x) => x.mat !== "stone"), 1);
  }
  return k;
}

function cutMore(w, c, k) {
  if (!k || k.gone) return true;
  c.lastCut = Math.round(w.t);
  k.done = +Math.min(1, k.done + 1 / CARVE.stoneWork).toFixed(3);
  if (k.done >= 1) {
    let n = carvingsAll(w).filter((x) => x.mat === "stone" && x.done >= 1).length;
    logEvent(w, 3, `${c.name} has finished cutting a story into stone${n === 1 ? ", the first of the Telling Stones" : ` at the Telling Stones`}: "${k.text}"`, [c.id], k, "carving");
    remember(w, c, "carving", "The stone is finished. Long after I'm gone, they'll read it.", 0.85);
  }
  return true;
}

// Copying a crumbling tablet (the copy may drift), or recutting a worn stone (an elder may
// cut their own version over it).
function fixCarving(w, c, k, step) {
  if (!k || k.gone) return true;
  let s = w.stories[k.s],
    mine = c.lore && c.lore[k.s];
  if (k.mat === "clay") {
    if (carvingsAll(w).some((o) => o.copyOf === k.id)) return true; // someone already has
    let v = s ? retell(w, c, c, s, { ...k.v }) : k.v,
      n = addCarving(w, { s: k.s, kind: k.kind, v, by: c.id, byName: c.name, mat: "clay", x: +step.x.toFixed(2), z: +step.z.toFixed(2), done: 1, copyOf: k.id });
    if (!n.text) n.text = k.text;
    logEvent(w, 1, `${c.name} copied ${k.byName}'s crumbling clay tablet onto a new one${n.text !== k.text ? ", not quite word for word" : ""}.`, [c.id], n, "carving");
    return true;
  }
  let theirs = mine && s && !sameTold(w, s, mine.v, k.v) && (c.stage === "elder" || mine.first) && w.rng.chance(0.45);
  k.recut.push([Math.round(w.t), c.name, theirs ? k.text : null]);
  if (k.recut.length > 6) k.recut.splice(0, 1);
  k.recutBy = c.id;
  k.wear = 0.08;
  if (theirs) {
    k.v = { ...mine.v };
    k.text = storyText(w, s, k.v);
    logEvent(w, 2, `${c.name} recut the worn stone that ${k.byName} carved, and "corrected" it as they went: now it says ${lower(k.text)}`, [c.id], k, "carving");
  } else logEvent(w, 1, `${c.name} recut the worn letters on ${k.byName}'s stone at the Telling Stones.`, [c.id], k, "carving");
  return true;
}

// Every life tick: carvings wear; someone near one may read it.
function carveTick(w) {
  let K = w.carvings;
  if (!K || !K.length) return;
  let dt = LIFE.tick / 86400,
    rain = w.weather.rain > 0.2 ? 2 : 1;
  for (let k of K) {
    if (k.gone) continue;
    if (k.mat === "sand") k.wear = +(k.wear + dt).toFixed(4);
    else if (k.mat === "clay") k.wear = +(k.wear + (dt / CARVE.clayDays) * rain).toFixed(4);
    else if (k.done >= 1) {
      k.wear = +(k.wear + (dt / CARVE.stoneDays) * rain).toFixed(5);
      if (k.recutBy && k.wear > 0.3) k.recutBy = null;
    }
    if (k.mat !== "stone" && k.wear >= 1) (k.gone = Math.round(w.t)), k.mat === "clay" && logEvent(w, 1, `${k.byName}'s clay tablet has crumbled away.`, [], k, "carving");
  }
  // reading
  if (!w.rng.chance(0.5)) return;
  let open = K.filter((k) => !k.gone && (k.mat !== "stone" || k.done >= 1));
  if (!open.length) return;
  let k = w.rng.pick(open),
    s = w.stories[k.s];
  if (!s) return;
  for (let c of w.creatures) {
    if (c.asleep || c.visitor || c.stage === "child" && ageDays(w, c) < 4 || dist2d(c.x, c.z, k.x, k.z) > 6 * CF2_SCALE.see) continue;
    if (!w.rng.chance(CARVE.readChance * (k.mat === "stone" ? 1.5 : 1))) continue;
    let mine = c.lore && c.lore[k.s],
      v = k.wear > 0.7 && mine && w.rng.chance(0.5) ? retell(w, c, c, s, { ...k.v }) : { ...k.v };
    if (mine && sameVersion(mine.v, v)) {
      mine.conf = +Math.min(1, mine.conf + 0.1).toFixed(3);
      continue;
    }
    if (mine && mine.first) continue; // they were there; the stone is wrong, or they know better
    let had = !!mine;
    learnStory(w, c, s, v, mine ? Math.max(mine.conf, 0.75) : 0.75, null, false);
    if (!had && s.forgotten) {
      s.forgotten = null;
      logEvent(w, 2, `${c.name} read ${k.mat === "stone" ? "the old stone" : "an old tablet"} and learned a story no one remembered anymore: ${lower(k.text)}`, [c.id], k, "carving");
    }
    if (!had) remember(w, c, "carving", `I read the ${k.mat === "stone" ? "stone" : k.mat === "clay" ? "tablet" : "drawing in the sand"}. ${k.text}`, 0.5);
    break;
  }
}

var cf2CarveLifeTick = lifeTick;
lifeTick = function (w) {
  cf2CarveLifeTick(w);
  carveTick(w);
};

// The next flood washes the sand drawings away.
var cf2CarveStorm = creekStorm;
creekStorm = function (w, Tforce) {
  let T = cf2CarveStorm(w, Tforce);
  for (let k of w.carvings || []) if (k.mat === "sand" && !k.gone) k.gone = Math.round(w.t);
  return T;
};

// A story kept in stone is never dropped from the valley's stories, even when no one holds it.
var cf2CarveMyths = checkMyths;
checkMyths = function (w) {
  let keep = {};
  for (let k of w.carvings || []) if (!k.gone && k.mat === "stone" && k.done >= 1 && w.stories[k.s]) keep[k.s] = w.stories[k.s];
  cf2CarveMyths(w);
  for (let id in keep) if (!w.stories[id]) w.stories[id] = keep[id];
};

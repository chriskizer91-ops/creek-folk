// Phase 3C: the memorial grove (tree kinds, growth all year, nurse logs) and goats with
// kids and wool. Owner: helper "grove". See docs/phase3c-plan.md.
//
// The grove. Every creekfolk who passes on gets a tree (groveTree in life.js). Its kind
// (oak, pine, willow or birch) usually follows a parent's tree, so a family's trees
// match; otherwise it follows what the creekfolk loved most (their `sig`). A child's tree
// is planted beside the tree it takes after when there's room, else among trees of its
// own kind, so each kind (and the families it follows) keeps its own part of the grove.
// Trees grow all their lives (groveSize). An ordinary tree stands six to eight months, the
// five founders' trees well over a year, so theirs are the giants of the grove at the end
// of the first year. Then a tree falls (its own time, `fall`) and lies as a nurse log with
// moss, ferns and saplings on it, where new trees are gladly planted; logs go back to the
// soil after a while. About 160 trees stand at a time; standing trees and logs are both
// bounded (GROVE.maxStanding, GROVE.maxLogs), so the grove stays the same size year after
// year (tools/grove-test.cjs).
//
// Goats. A nanny has a kid (sometimes twins) in spring while the herd is small; kids
// follow their mothers (faunaMinute, fauna.js) and grow up in a few days; goats grow old
// and die in the pasture. Brushing them gives wool; in the evenings someone spins and
// weaves it into a warm blanket for a home, which makes winter nights in that home a
// little more comfortable (restBonusAt, wrapped below). It is never a job.
//
// Everything random here comes from a local Rng seeded by the world's seed and an id,
// so the grove and the goats never shift the valley's main random stream. State:
//   w.grove  { x, z, n, v, logs[], fallen, founders[] }  (the grove; created by grovePlace)
//   res entries of kind "grove" gain tk (kind), fall (time it falls), kin (lineage id)
//   w.lineage[id].tk      the kind of that creekfolk's tree
//   w.fauna.goats[]       gain doe, mom, dies, due, kidYear
//   w.fauna.blankets      { homeId: time made }, w.fauna.blanketsMade
// ==========================================================================

var GROVE = {
  kinds: ["oak", "pine", "willow", "birch"],
  inherit: 0.7,          // a tree takes after a parent's tree this often (otherwise: what they loved)
  space: 1.7,            // m between trunks
  reach: 19,             // m from the grove's centre that new trees stay within while there's room
  spanDays: [180, 240],  // how long a memorial tree stands (real days): about 160 stand at a time
  founderSpan: [400, 460], // the first five's trees stand longest, the giants of the grove after a year
  maxStanding: 240,      // never more standing than this: the oldest falls first
  logDays: 30,           // a fallen tree lies as a nurse log this long, then has gone back to the soil
  maxLogs: 24,           // never more logs than this: the most rotten goes first
  fallPerTick: 2,        // at most this many falls per life check (an old valley catching up)
  grow: 0.055,           // growth: size = 0.3 + grow * days^growPow (1 = a full young tree)
  growPow: 0.72,
  maxSize: 4.4,
};

// What they loved most decides a tree when it doesn't take after a parent's: willows for
// those who loved the water or company (willows lean over the water, where people meet),
// pines for explorers and builders (tall and straight), oaks or birches for those who
// grew and gathered things, birches for those who loved sound (their leaves rustle).
var GROVE_BY_LOVE = { water: "willow", social: "willow", exploring: "pine", building: "pine", growing: "oak", collecting: "oak", sound: "birch" };
var GROVE_WORDS = { oak: ["oak", "oaks"], pine: ["pine", "pines"], willow: ["willow", "willows"], birch: ["birch", "birches"] };

var GOATS = {
  herdMax: 8,            // kids are born only while the herd is smaller than this
  kidDays: 4,            // a kid grows up in about this many real days
  lifeDays: [42, 60],    // a goat lives this long (real days)
  kidChance: 0.6,        // chance a grown nanny has a kid in a given spring ...
  kidChanceSmall: 0.9,   // ... or while the herd is still small (three or fewer)
  twins: 0.3,
  woolPerBlanket: 12,    // brushings give 0.05 each (fauna.js)
  woolMax: 60,           // wool they keep; the rest stuffs bedding
  blanketDays: 40,       // a blanket wears thin after about this long and is replaced
  blanketRest: 0.15,     // extra rest at home on a winter night with a blanket
};

// ---------------------------------------------------------------------------
// The grove's state, created and upgraded lazily.
// ---------------------------------------------------------------------------
function groveOf(w) {
  let g = grovePlace(w);
  if (!g.v) groveUpgrade(w, g);
  return g;
}

// A grove from before 3C: give every tree a kind (in planting order, so a parent's tree
// is known before a child's), a time to fall, and an empty list of logs.
function groveUpgrade(w, g) {
  g.v = 1;
  g.logs = g.logs || [];
  g.fallen = g.fallen || 0;
  g.founders = g.founders || groveFounders(w);
  let trees = w.res.filter((r) => r.kind === "grove").sort((a, b) => a.planted - b.planted || a.id - b.id);
  for (let t of trees) {
    let rec = w.lineage && w.lineage[t.who];
    if (!t.tk) {
      let k = groveKindFor(w, rec, null);
      t.tk = k.tk;
      if (k.from) t.kin = k.from;
    }
    if (rec) rec.tk = t.tk;
    if (!t.fall) t.fall = groveFallTime(w, t);
  }
}

// The kinds an old grove's trees will get when it is upgraded, without changing anything
// (for the view, until the first life check upgrades it). Map of tree id -> kind.
function groveKindsPreview(w) {
  let tk = new Map(),
    byWho = new Map(),
    trees = w.res.filter((r) => r.kind === "grove").sort((a, b) => a.planted - b.planted || a.id - b.id);
  for (let t of trees) {
    let rec = w.lineage && w.lineage[t.who],
      k = t.tk || groveKindFor(w, rec, null, (r) => r.tk || byWho.get(r.id)).tk;
    tk.set(t.id, k);
    byWho.set(t.who, k);
  }
  return tk;
}

// The first five: the lowest gen-0 ids born before the valley began.
function groveFounders(w) {
  return Object.values(w.lineage || {})
    .filter((r) => !r.gen && r.born <= 0 && !(r.parents || []).length)
    .sort((a, b) => a.id - b.id)
    .slice(0, LIFE.founders)
    .map((r) => r.id);
}

// The kind of a creekfolk's tree, and whose tree it takes after (a lineage id, or null).
// tkOf reads the kind of a parent's tree (the view passes its own, to preview an old grove).
function groveKindFor(w, rec, c, tkOf = (r) => r.tk) {
  let id = rec ? rec.id : c ? c.id : 0,
    rng = new Rng(w.seed + ":grove:" + id),
    parents = (rec ? rec.parents : c && c.parents) || [],
    known = parents.map((p) => w.lineage && w.lineage[p]).filter((r) => r && tkOf(r)).map((r) => ({ id: r.id, tk: tkOf(r) }));
  if (known.length && rng.next() < GROVE.inherit) {
    let p = known[known.length > 1 ? rng.int(0, known.length - 1) : 0];
    return { tk: p.tk, from: p.id };
  }
  let sig = (c && c.sig) || (rec && rec.sig),
    tk = GROVE_BY_LOVE[sig] || GROVE.kinds[rng.int(0, GROVE.kinds.length - 1)];
  if ((sig === "growing" || sig === "collecting") && rng.next() < 0.4) tk = "birch";
  return { tk, from: null };
}

// When a tree falls: its own span, from its id.
function groveFallTime(w, tree) {
  let rng = new Rng(w.seed + ":grovefall:" + tree.id),
    g = w.grove,
    [a, b] = g && (g.founders || []).includes(tree.who) ? GROVE.founderSpan : GROVE.spanDays;
  return Math.round(tree.planted + rng.range(a, b) * DAY_S);
}

// How big a memorial tree is (1 = a full young tree; about 3.5 after ten months).
function groveSize(w, tree, t = w.t) {
  let d = Math.max(0, (t - (tree.planted || 0)) / DAY_S);
  return Math.min(GROVE.maxSize, 0.3 + GROVE.grow * Math.pow(d, GROVE.growPow));
}

function groveKindOf(tree) {
  return tree.tk || "oak";
}

// ---------------------------------------------------------------------------
// Where a new tree goes: beside the tree it takes after (or a parent's or grandparent's)
// when there is room close by; otherwise the free place in the grove most among trees of
// its own kind, near its family and the centre, and gladly beside a nurse log (where new
// growth starts); only if the grove is full, the first free place in a spiral beyond it.
// ---------------------------------------------------------------------------
function groveTreeOf(w, lineageId) {
  let rec = w.lineage && w.lineage[lineageId],
    t = rec && rec.tree != null ? w.byId[rec.tree] : null;
  return t && t.kind === "grove" ? t : null;
}

function groveSpotOK(w, g, x, z, trees, reach) {
  let T = w.terrain;
  if (x < 2 || z < 2 || x > VW - 2 || z > VL - 2 || !T.walkable(x, z) || T.edgeDist(x, z) < 1.5) return false;
  if (reach && Math.hypot(x - g.x, z - g.z) > reach) return false;
  if (w.givingPlace && Math.hypot(x - w.givingPlace.x, z - w.givingPlace.z) < TEMPLE_ROOM) return false; // BELIEF: the temple's ground stays clear
  let hall = w.ancestors && w.byId[w.ancestors.sid];
  if (hall && Math.hypot(x - hall.x, z - hall.z) < 6.5) return false; // ... and the Hall of the Ancestors'
  for (let s of w.structures) {
    let r = ((STRUCTURES[s.kind] && STRUCTURES[s.kind].radius) || 1) + 1.2 * CF2_SCALE.build; // CF2: the grove at real scale
    if ((s.x - x) ** 2 + (s.z - z) ** 2 < r * r) return false;
  }
  let sp2 = GROVE.space * GROVE.space;
  for (let t of trees) if ((t.x - x) ** 2 + (t.z - z) ** 2 < sp2) return false;
  for (let l of g.logs) if (groveLogDist(l, x, z) < 0.9 * CF2_SCALE.build) return false; // CF2
  return true;
}

// Distance from a point to a log (a segment from its foot along rot).
function groveLogDist(l, x, z) {
  let dx = Math.cos(l.rot),
    dz = Math.sin(l.rot),
    u = clamp((x - l.x) * dx + (z - l.z) * dz, 0, l.len);
  return Math.hypot(x - (l.x + dx * u), z - (l.z + dz * u)) - l.r;
}

function groveSpot(w, g, c, from, tk) {
  let trees = w.res.filter((r) => r.kind === "grove"),
    rng = new Rng(w.seed + ":grovespot:" + c.id),
    anchors = [],
    add = (t) => t && !anchors.includes(t) && anchors.push(t);
  add(from != null ? groveTreeOf(w, from) : null);
  for (let p of c.parents || []) add(groveTreeOf(w, p));
  for (let p of c.parents || []) for (let gp of (w.lineage && w.lineage[p] && w.lineage[p].parents) || []) add(groveTreeOf(w, gp));
  // beside the family's tree, if there is room close by
  let B = CF2_SCALE.build, // CF2: the grove at real scale (every length below is Creekfolk 1's times B)
    a = anchors[0],
    kin = (x, z) => {
      let s = 0;
      for (let t of trees) if ((t.x - x) ** 2 + (t.z - z) ** 2 < 10.2 * B * B) s += t.tk === tk ? -1 : 0.8; // CF2
      return s;
    };
  if (a) {
    let best = null,
      bestS = 1e9;
    for (let ri = 0; ri < 5; ri++) {
      let r = GROVE.space + (0.15 + ri * 0.55) * B, // CF2
        n = Math.max(10, Math.round((2 * Math.PI * r) / (0.7 * B))), // CF2
        a0 = rng.range(0, Math.PI * 2);
      for (let k = 0; k < n; k++) {
        let ang = a0 + (k / n) * Math.PI * 2,
          x = a.x + Math.cos(ang) * r,
          z = a.z + Math.sin(ang) * r;
        if (!groveSpotOK(w, g, x, z, trees, GROVE.reach)) continue;
        let s = (0.5 * r + 0.06 * Math.hypot(x - g.x, z - g.z)) / B + kin(x, z); // CF2
        if (s < bestS) (bestS = s), (best = { x, z, near: a });
      }
    }
    if (best) return best;
  }
  // otherwise the free place in the grove most among its own kind (so each kind, and the
  // families it follows, keeps its own part of the grove), near the family, toward the
  // centre; often that is where an old tree fell, beside its log
  let best = null,
    bestS = 1e9,
    step = 0.85 * B, // CF2
    ox = rng.range(0, step),
    oz = rng.range(0, step);
  for (let x = g.x - GROVE.reach + ox; x <= g.x + GROVE.reach; x += step)
    for (let z = g.z - GROVE.reach + oz; z <= g.z + GROVE.reach; z += step) {
      if (!groveSpotOK(w, g, x, z, trees, GROVE.reach)) continue;
      let s = kin(x, z) + (0.04 * Math.hypot(x - g.x, z - g.z) + (a ? 0.05 * Math.hypot(x - a.x, z - a.z) : 0)) / B, // CF2
        log = null;
      for (let l of g.logs) if (groveLogDist(l, x, z) < 1.6 * B) log = l; // CF2
      if (log) s -= 0.3; // where new growth starts
      if (s < bestS) (bestS = s), (best = { x, z, log, near: a && Math.hypot(x - a.x, z - a.z) < 4.5 * B ? a : null }); // CF2
    }
  if (best) return best;
  // the grove is full: the first free place in a spiral beyond it
  for (let reach of [0])
    for (let n = 0; n < 2400; n++) {
      let a = n * 2.39996,
        r = 0.95 * B * Math.sqrt(n + 0.5), // CF2
        x = g.x + Math.cos(a) * r,
        z = g.z + Math.sin(a) * r;
      if (groveSpotOK(w, g, x, z, trees, reach)) return { x, z };
    }
  return null;
}

// Plant a memorial tree (called from groveTree in life.js).
function grovePlant(w, c) {
  let g = groveOf(w),
    rec = lineageRecord(w, c),
    k = groveKindFor(w, rec, c),
    spot = groveSpot(w, g, c, k.from, k.tk);
  if (!spot) return null;
  g.n = (g.n || 0) + 1;
  let tree = register(w, {
    id: w.nextId++,
    kind: "grove",
    x: +spot.x.toFixed(2),
    z: +spot.z.toFixed(2),
    side: w.terrain.side(spot.x, spot.z),
    who: c.id,
    name: c.name,
    planted: Math.round(w.t),
    hue: c.look.hue,
    tk: k.tk,
  });
  if (k.from) tree.kin = k.from;
  tree.fall = groveFallTime(w, tree);
  rec.tk = k.tk;
  w.res.push(tree);
  groveLastNear = { id: tree.id, near: spot.near ? spot.near.who : spot.log ? -1 : null, mode: spot.near ? "family" : spot.log ? "log" : "spiral" }; // for the log line (groveWords) and tools/grove-test.cjs
  return tree;
}
var groveLastNear = null;

// "A young oak was planted for them in the grove, beside Tamsin's."
function groveWords(w, tree) {
  if (!tree) return "";
  let kind = GROVE_WORDS[groveKindOf(tree)][0],
    near = groveLastNear && groveLastNear.id === tree.id ? groveLastNear.near : null,
    rec = w.lineage && w.lineage[tree.who],
    nr = near > 0 && w.lineage && w.lineage[near],
    rel = !nr || !rec ? "" : (rec.parents || []).includes(near) ? "their parent " : (rec.parents || []).some((p) => w.lineage[p] && (w.lineage[p].parents || []).includes(near)) ? "their grandparent " : "",
    by = nr ? rel + nr.name : null;
  return ` A young ${kind} was planted for them in the grove${by ? `, beside ${by}'s` : near === -1 ? ", beside an old fallen tree" : ""}.`;
}

// ---------------------------------------------------------------------------
// Falling, and the nurse logs.
// ---------------------------------------------------------------------------
function groveFell(w, g, tree, quiet) {
  let rng = new Rng(w.seed + ":grovelog:" + tree.id),
    size = groveSize(w, tree),
    wide = Math.pow(size, 0.7),
    len = +(Math.min(7.5, 1.3 * size + 0.4) * CF2_SCALE.build).toFixed(2), // CF2: the grove at real scale
    r = +(0.2 * wide * CF2_SCALE.build).toFixed(2), // CF2
    trees = w.res.filter((o) => o.kind === "grove" && o !== tree),
    best = 0,
    bestS = -1e9,
    a0 = rng.range(0, Math.PI * 2);
  // it falls the way with the most room
  for (let k = 0; k < 10; k++) {
    let a = a0 + (k / 10) * Math.PI * 2,
      ex = tree.x + Math.cos(a) * len,
      ez = tree.z + Math.sin(a) * len,
      s = rng.range(0, 0.4);
    if (!w.terrain.walkable(ex, ez)) s -= 6;
    let probe = { x: tree.x, z: tree.z, rot: a, len, r };
    for (let o of trees) if (groveLogDist(probe, o.x, o.z) < 0.5 * CF2_SCALE.build) s -= 1; // CF2
    for (let l of g.logs) for (let u = 0.15; u < 1; u += 0.2) if (groveLogDist(l, tree.x + Math.cos(a) * len * u, tree.z + Math.sin(a) * len * u) < r + 0.15 * CF2_SCALE.build) s -= 1.5; // not across another log // CF2
    for (let o of w.structures) if (groveLogDist(probe, o.x, o.z) < ((STRUCTURES[o.kind] && STRUCTURES[o.kind].radius) || 1)) s -= 4;
    if (w.givingPlace && groveLogDist(probe, w.givingPlace.x, w.givingPlace.z) < TEMPLE_ROOM) s -= 3;
    if (s > bestS) (bestS = s), (best = a);
  }
  let log = { id: tree.id, x: tree.x, z: tree.z, rot: +best.toFixed(3), len, r, tk: groveKindOf(tree), who: tree.who, name: tree.name, planted: tree.planted, fell: Math.round(w.t) };
  g.logs.push(log);
  if (g.logs.length > GROVE.maxLogs) g.logs.splice(0, g.logs.length - GROVE.maxLogs);
  g.fallen = (g.fallen || 0) + 1;
  removeThing(w, tree, w.res);
  if (quiet) return log;
  let founder = (g.founders || []).includes(tree.who),
    kind = GROVE_WORDS[log.tk][0],
    days = Math.round((w.t - tree.planted) / DAY_S);
  if (founder)
    logEvent(w, 3, `The great ${kind} planted for ${tree.name}, one of the first ${numberWord(LIFE.founders)}, has fallen in the grove after ${days} days. Moss and ferns will cover it, and young trees will grow from it.`, [], log, "grove"); // CF2: eight founders (Creekfolk 1: "the first five")
  else logEvent(w, 1, `The old ${kind} planted for ${tree.name} fell in the grove. It will feed new growth.`, [], log, "grove");
  return log;
}

// Every life check (600 s), from lifeTick.
function groveTick(w) {
  groveTreesTick(w);
  goatTick(w);
  woolTick(w);
}

// Trees whose time has come fall; logs go back to the soil.
function groveTreesTick(w) {
  if (w.grove) {
    let g = groveOf(w),
      standing = [],
      due = [];
    for (let r of w.res)
      if (r.kind === "grove") {
        standing.push(r);
        if (w.t >= r.fall) due.push(r);
      }
    // never more than maxStanding: the oldest go first
    if (standing.length > GROVE.maxStanding) {
      standing.sort((a, b) => a.planted - b.planted || a.id - b.id);
      for (let t of standing.slice(0, standing.length - GROVE.maxStanding)) if (!due.includes(t)) due.push(t);
    }
    due.sort((a, b) => a.planted - b.planted || a.id - b.id);
    let quiet = due.length > 2 * GROVE.fallPerTick; // a valley catching up on many falls says nothing
    for (let t of due.slice(0, GROVE.fallPerTick)) groveFell(w, g, t, quiet);
    // the logs go back to the soil
    while (g.logs.length && w.t - g.logs[0].fell > GROVE.logDays * DAY_S) g.logs.shift();
  }
}

// How far a log has rotted, 0 (just fallen) .. 1 (gone).
function groveLogDecay(w, l, t = w.t) {
  return clamp((t - l.fell) / (GROVE.logDays * DAY_S), 0, 1);
}

// ---------------------------------------------------------------------------
// Goats: kids in spring, growing up, growing old.
// ---------------------------------------------------------------------------
function goatAge(w, g) {
  return (w.t - (g.born || 0)) / DAY_S;
}
function goatGrown(w, g) {
  return !g.mom || goatAge(w, g) >= GOATS.kidDays;
}

function goatTick(w) {
  let f = w.fauna;
  if (!f || !f.goats || !f.goats.length) return;
  let s = seasonAt(w);
  for (let g of f.goats) {
    if (g.doe === undefined) g.doe = g.id % 2 === 1; // the gift's pair: a nanny and a billy
    if (!g.dies) {
      let r = new Rng(w.seed + ":goat:" + g.id),
        life = r.range(GOATS.lifeDays[0], GOATS.lifeDays[1]) * DAY_S;
      g.dies = Math.round(Math.max(g.born + life, w.t + life * 0.5)); // goats from before 3C get a fair while yet
    }
  }
  // old goats die in the pasture
  for (let g of f.goats.slice()) if (w.t >= g.dies) goatDies(w, f, g);
  // each spring a grown nanny may have a kid, at a time of her own
  let billy = f.goats.some((g) => !g.doe && goatGrown(w, g) && goatAge(w, g) > GOATS.kidDays);
  for (let g of f.goats) {
    if (!g.doe || !goatGrown(w, g) || goatAge(w, g) < GOATS.kidDays * 1.5) continue;
    if (s.name === "spring" && g.kidYear !== s.year) {
      g.kidYear = s.year;
      let r = new Rng(w.seed + ":kid:" + g.id + ":" + s.year);
      if (billy && r.next() < (f.goats.length <= 3 ? GOATS.kidChanceSmall : GOATS.kidChance)) g.due = Math.round(w.t + r.range(0.05, 0.9) * (1 - s.progress) * SEASON_DAYS * VALLEY_DAY);
    }
    if (g.due && w.t >= g.due) {
      g.due = null;
      if (f.goats.length < GOATS.herdMax) goatKids(w, f, g);
    }
  }
}

function goatName(w, r) {
  let living = new Set(w.fauna.goats.map((g) => g.name));
  for (let k = 0; k < 20; k++) {
    let n = (NAME_START[r.int(0, NAME_START.length - 1)] + NAME_END[r.int(0, NAME_END.length - 1)]).slice(0, 8);
    if (!living.has(n)) return n;
  }
  return "Kid";
}

function goatKids(w, f, mom) {
  let r = new Rng(w.seed + ":kids:" + mom.id + ":" + Math.round(w.t)),
    n = r.next() < GOATS.twins && f.goats.length + 2 <= GOATS.herdMax ? 2 : 1,
    names = [];
  for (let i = 0; i < n; i++) {
    let x = +(mom.x + r.range(-0.6, 0.6)).toFixed(2),
      z = +(mom.z + r.range(-0.6, 0.6)).toFixed(2),
      kid = { id: (f.goatSeq = (f.goatSeq || 0) + 1), name: goatName(w, r), x, z, px: x, pz: z, pt: Math.round(w.t), tn: Math.round(w.t + 120), coat: r.next() < 0.7 ? mom.coat : r.int(0, 3), born: Math.round(w.t), doe: r.next() < 0.5, mom: mom.id };
    f.goats.push(kid);
    names.push(kid.name);
  }
  f.kids = (f.kids || 0) + n;
  let first = f.kids === n;
  logEvent(w, first ? 2 : 1, n === 2 ? `${mom.name} the goat had twins in the pasture. The children named them ${names[0]} and ${names[1]}.` : `${mom.name} the goat had a kid in the pasture. The children named it ${names[0]}.`, [], mom, "goats");
  // the children who love the goats remember it
  for (let c of w.creatures) if (!c.visitor && !c.asleep && (c.counts.goats || 0) > 2 && dist2d(c.x, c.z, mom.x, mom.z) < 30 * CF2_SCALE.see) remember(w, c, "goats", n === 2 ? `${mom.name} the goat had twins! They wobble about after her.` : `${mom.name} the goat had a kid. It wobbles about after her.`, 0.6, { x: mom.x, z: mom.z, pv: 0.3 }); // CF2: they notice from further off
}

function goatDies(w, f, g) {
  let i = f.goats.indexOf(g);
  if (i < 0) return;
  f.goats.splice(i, 1);
  for (let k of f.goats) if (k.mom === g.id && !goatGrown(w, k)) k.mom = null; // the herd looks after a kid that lost its mother
  let fond = w.creatures.filter((c) => !c.visitor && (c.counts.goats || 0) > 6).sort((a, b) => (b.counts.goats || 0) - (a.counts.goats || 0))[0];
  logEvent(w, 1, `Old ${g.name} the goat lay down in the pasture one last time.${fond ? ` ${fond.name}, who brushed them most, sat with them a while.` : ""}`, fond ? [fond.id] : [], g, "goats");
  if (fond) remember(w, fond, "goats", `Old ${g.name} the goat is gone. I brushed them so many times.`, 0.6);
}

// A kid trots after its mother (from faunaMinute in fauna.js): where she is going, a
// little to one side. No random numbers, so the valley's stream is untouched.
function goatFollow(w, f, g) {
  if (!g.mom || goatGrown(w, g)) return false;
  let m = f.goats.find((o) => o.id === g.mom);
  if (!m) return false;
  if (w.t < g.tn && dist2d(g.x, g.z, m.x, m.z) < 1.6) return true;
  let a = hash01s(g.id * 7.1 + Math.floor(w.t / 600)) * Math.PI * 2,
    d = 0.5 + 0.5 * hash01s(g.id * 3.3 + Math.floor(w.t / 900)),
    tx = m.x + Math.cos(a) * d,
    tz = m.z + Math.sin(a) * d;
  if (!w.terrain.walkable(tx, tz)) (tx = m.x), (tz = m.z);
  let dist = dist2d(g.x, g.z, tx, tz);
  g.px = g.x;
  g.pz = g.z;
  g.pt = Math.round(w.t);
  g.x = +tx.toFixed(2);
  g.z = +tz.toFixed(2);
  g.tn = Math.round(w.t + dist / FAUNA.goatSpeed + 30);
  return true;
}

// A small deterministic hash in 0..1 (integer arithmetic only, the same in every engine).
function hash01s(x) {
  let h = Math.imul(Math.round(x * 1000) ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

// ---------------------------------------------------------------------------
// Wool: spun and woven in the evenings into blankets for the homes.
// ---------------------------------------------------------------------------
function woolTick(w) {
  let f = w.fauna;
  if (!f) return;
  if (f.wool > GOATS.woolMax) f.wool = GOATS.woolMax;
  if (!f.blankets) {
    if (!(f.wool >= GOATS.woolPerBlanket)) return;
    f.blankets = {};
  }
  // blankets wear thin; homes that are gone don't need one
  for (let id in f.blankets) {
    let s = w.byId[id];
    if (!s || s.kind !== "home" || w.t - f.blankets[id] > GOATS.blanketDays * DAY_S) delete f.blankets[id];
  }
  if (f.wool < GOATS.woolPerBlanket) return;
  let ph = dayPhase(w.t);
  if (ph < 0.7 || ph > 0.86) return; // in the evening, by the fire
  let homes = w.structures.filter((s) => s.kind === "home" && s.level > 0 && !f.blankets[s.id]);
  if (!homes.length) return;
  let free = (c) => !c.visitor && !c.asleep && !c.farewell && !c.leaving && !(c.act && c.act.type === "away") && c.home != null,
    folk = w.creatures.filter(free).sort((a, b) => (b.stage === "elder") - (a.stage === "elder") || (b.counts.goats || 0) - (a.counts.goats || 0) || a.id - b.id),
    maker = folk[Math.floor(hash01s(f.blanketsMade || 0) * Math.min(3, folk.length))]; // one of those who love the goats most
  if (!maker) return;
  let home = homes.find((s) => s.id === maker.home) || homes.find((s) => s.owner && w.byId[s.owner] && maker.rel[s.owner] && maker.rel[s.owner].warmth > 0.3) || homes.sort((a, b) => a.id - b.id)[0];
  f.blankets[home.id] = Math.round(w.t);
  f.wool = +(f.wool - GOATS.woolPerBlanket).toFixed(2);
  f.blanketsMade = (f.blanketsMade || 0) + 1;
  let owner = home.owner && w.byId[home.owner],
    whose = !owner ? "an empty home" : owner === maker ? "their own home" : `${owner.name}'s home`;
  if (f.blanketsMade === 1) logEvent(w, 3, `${maker.name} spun the goats' wool by the fire and wove the valley's first warm blanket, for ${whose}. Winter nights will be easier there.`, [maker.id], home, "goats");
  else logEvent(w, 1, `${maker.name} wove a warm blanket from the goats' wool, for ${whose}.`, [maker.id], home, "goats");
  remember(w, maker, "goats", "I spun the goats' wool and wove a warm blanket.", 0.5);
  if (owner && owner !== maker) remember(w, owner, "goats", `${maker.name} wove us a wool blanket. Winter nights are warmer now.`, 0.55);
}

// Extra rest at a home with a blanket, on a winter night.
function woolWarmth(w, x, z) {
  let f = w.fauna;
  if (!f || !f.blankets || !isNight(w.t) || seasonAt(w).name !== "winter") return 0;
  for (let id in f.blankets) {
    let s = w.byId[id];
    if (s && (s.x - x) ** 2 + (s.z - z) ** 2 < 4) return GOATS.blanketRest;
  }
  return 0;
}

// 3C: a home with a wool blanket is a little more restful on a winter night.
restBonusAt = (function (orig) {
  return function (w, c, x, z) {
    let b = orig(w, c, x, z);
    return b > 0 ? b + woolWarmth(w, x, z) : b;
  };
})(restBonusAt);

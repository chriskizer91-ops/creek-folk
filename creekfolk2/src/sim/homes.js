// Phase 3C: homes (the door in the owner's colour, decorations from what they love, more
// home levels) and gardens. Owner: helper "homes". See docs/phase3c-plan.md.
//
// - Two more home levels, a front porch and a stone hearth: comfort (rest), never room.
//   valleyCapacity() counts homes, not levels, so the valley holds as many as before.
//   Begun one at a time in the valley by owners settled in (`ready`, below).
// - A fourth bed for every garden, and more than one garden once the village is big:
//   a second at 8 homes, a third at 14. From 7 homes the shelter ceiling is already full
//   (8 + 4 x 7 = 36), so a new garden adds food and work, never room; what the land can
//   feed stays the only other ceiling. Wanted mostly by those who love growing things.
// - Decorations by the door, chosen from what the owner loves, appearing one by one as
//   they settle in. Chosen with a local generator (never world.rng), stored on the home
//   (`s.deco`), created lazily by homesTick.
//
// Saved: `s.deco = { by, since, list: [{ k, at, h }], shown, old }` on homes (at most 3
// things and one kept from the home's last owner); `w.homeFirsts` (kind -> time the first
// of each decoration appeared, for the log). Both plain JSON, made when first needed.
//
// Core hooks are marked `// 3C:` in core.js: canBuildLevel (a level's `ready`),
// foundOption (the home threshold and homeFoundOption), markProject (homeGardenRoom),
// gardenOption (homeGardenFor) and worldTick (homesTick).

var HOMES = {
  garden2Homes: 8, // a second garden once there are this many homes
  garden3Homes: 14, // and a third
  maxGardens: 3,
  gardenGap: 24 * 3600, // a later garden's levels at least this far apart (real seconds)
  newGardenGap: 3 * 86400, // a new garden at least this long after the last garden work
  porchDays: 5, // a porch once the owner has lived in the home this long (real days)
  hearthDays: 10, // a hearth once they have lived there this long
  comfortGap: 8 * 3600, // the valley starts a porch or a hearth at most this often
  settleDays: [0.5, 1.6], // the first decoration appears this many days after moving in (range)
  nextDays: [0.8, 2.4], // and each next one this much later
  maxDeco: 3, // the owner's own things by the door
};

// ---- more home levels: comfort, not room ----------------------------------------------
// Begun only by someone settled in their home, one home at a time in the whole valley,
// so they come as a slow trickle and never crowd out the valley's other work.
function homeComfortReady(days) {
  return (w, s, c) => {
    let d = s.deco;
    if (!d || d.by !== s.owner || w.t - d.since < days * 86400) return !1;
    let S = w.structures,
      gap = HOMES.comfortGap;
    for (let k = 0; k < S.length; k++) {
      let h = S[k];
      if (h.kind !== "home") continue;
      if (h.building && h.building.level >= 6) return !1;
      // comfort levels are the last ones built, so only the newest two can be
      let B = h.built;
      if (B)
        for (let j = Math.max(0, B.length - 2); j < B.length; j++) {
          let b = B[j];
          if (b.lv >= 7 && w.t - (b.t - (b.took || 0)) < gap) return !1;
        }
    }
    // nor while someone else is on their way to begin one
    for (let o of w.creatures) {
      let p = o.plan;
      if (o === c || !p || p.goal !== "found" || !p.steps) continue;
      for (let st of p.steps) if (st.do === "mark" && st.kind === "home" && st.upgrade != null && (w.byId[st.upgrade]?.level ?? 0) >= 6) return !1;
    }
    return !0;
  };
}
STRUCTURES.home.levels.push(
  {
    name: "porch",
    label: "front porch",
    stages: [stageDef("posts", { branch: 4 }, 400), stageDef("roof", { reeds: 6 }, 400)],
    rest: 0.9,
    shelter: 1,
    warm: !0,
    ready: homeComfortReady(HOMES.porchDays),
  },
  {
    name: "hearth",
    label: "stone hearth",
    know: "mud",
    stages: [stageDef("hearth", { stone: 5, mud: 3 }, 600), stageDef("chimney", { stone: 4 }, 500)],
    rest: 0.95,
    shelter: 1,
    warm: !0,
    ready: homeComfortReady(HOMES.hearthDays),
  },
);

// ---- a fourth bed for every garden ------------------------------------------------------
STRUCTURES.garden.levels.push({
  name: "bed4",
  label: "fourth bed",
  beds: 16,
  growth: 1.35,
  autoWater: !0,
  nursery: !0,
  stages: [stageDef("dig", { branch: 6, stone: 4 }, 1200), stageDef("sow", { seeds: 4 }, 300)],
});

// ---- gardens ----------------------------------------------------------------------------
function homeCount(w) {
  let n = 0;
  for (let s of w.structures) if (s.kind === "home" && s.level > 0) n++;
  return n;
}
function homeGardenMax(w) {
  let h = homeCount(w);
  return Math.min(HOMES.maxGardens, 1 + (h >= HOMES.garden2Homes ? 1 : 0) + (h >= HOMES.garden3Homes ? 1 : 0));
}
// Room for one more garden: every garden finished, none being worked on, and the village
// big enough. (markProject asks this before it lets a second garden be marked out.)
function homeGardenRoom(w) {
  let g = w.structures.filter((s) => s.kind === "garden"),
    L = STRUCTURES.garden.levels.length;
  return g.length > 0 && g.length < homeGardenMax(w) && g.every((s) => s.level >= L && !s.building);
}
// The garden that needs them most: one with a harvest waiting, then one going dry, then
// one with an empty bed; the nearest of equals. With one garden it is that garden, as before.
function homeGardenFor(w, c) {
  let best = null,
    bs = -1e9,
    S = w.structures,
    dry = w.weather.rain <= 0;
  for (let k = 0; k < S.length; k++) {
    let s = S[k];
    if (s.kind !== "garden" || !(s.level > 0) || !s.beds) continue;
    let sc = 0;
    for (let b of s.beds) {
      let v = b.state === "ready" ? 3 : dry && b.state === "growing" && b.water < 0.3 ? 2 : b.state === "empty" ? 1 : 0;
      if (v > sc) sc = v;
    }
    sc -= dist2d(c.x, c.z, s.x, s.z) * 0.002;
    if (sc > bs) (bs = sc), (best = s);
  }
  return best;
}
// Founding choices the core can't make on its own: the fourth bed (the core's threshold
// for a sixth garden level is out of reach), the second and third gardens and their
// levels. Wanted by those who love growing things. Returns the better of this and `e`.
function homeFoundOption(w, c, e) {
  if (!c.know.planting || c.visitor) return e;
  // (interests fill up over a life, so it is mostly those who always loved growing things)
  let L = STRUCTURES.garden.levels.length,
    want = 0.4 + 0.9 * c.interests.growing + (c.sig === "growing" ? 0.5 : 0) + 0.15 * c.temp.generosity,
    o = 0.55 + 0.35 * c.temp.persistence + 0.25 * c.temp.curiosity,
    S = w.structures,
    best = null,
    n = 0,
    last = -1e9,
    allDone = !0;
  for (let k = 0; k < S.length; k++) {
    let s = S[k];
    if (s.kind !== "garden") continue;
    if (s.building) return e; // one garden project at a time
    let lw = s.built && s.built.length ? s.built[s.built.length - 1].t : s.t || 0;
    if (lw > last) last = lw;
    if (s.level < L) allDone = !1;
    // the first garden's first six levels are the core's own choice
    if ((n++ === 0 && s.level < 6) || s.level >= L || w.t - lw < HOMES.gardenGap) continue;
    let h = 1 + 0.1 * s.level;
    if (want < h || !canBuildLevel(w, s, s.level, c)) continue;
    let f = 0.35 + (want - h) * 1.2 * o;
    if (!best || f > best.score) best = { kind: "garden", score: f, upgrade: s, target: null };
  }
  if (!n) return e;
  // a new garden: tried in one quarter-hour of each hour per creekfolk, so a valley with
  // no room for it doesn't search for a site at every decision
  if (!best && allDone && ((w.t / 900) | 0) % 4 === c.id % 4 && w.t - last >= HOMES.newGardenGap && n < homeGardenMax(w)) {
    let h = 1.6 + 0.15 * (n - 1);
    if (want >= h) best = { kind: "garden", score: 0.35 + (want - h) * 1.2 * o, upgrade: null, target: "new" };
  }
  if (!best || (e && best.score <= e.score)) return e;
  let levelSum = 0;
  for (let k = 0; k < S.length; k++) levelSum += S[k].level;
  return openProjects(w) >= 2 + (levelSum > 14 ? 1 : 0) ? e : best;
}

// ---- decorations by the door, from what the owner loves ---------------------------------
var HOME_DECOR = {
  growing: "flowers",
  collecting: "stones",
  sound: "chimes",
  water: "basin",
  building: "carving",
  exploring: "pennant",
  social: "bench",
};
var HOME_DECOR_TEXT = {
  flowers: "planted flowers by their door",
  stones: "stacked smooth stones beside their door",
  chimes: "hung little chimes by their door",
  basin: "set a basin of creek water by their door",
  carving: "carved a little figure for their doorstep",
  pennant: "put up a streamer by their home, to watch the wind",
  bench: "dragged a log bench to their door, for visitors",
};

// What a creekfolk would put by their door: first the thing they have always loved most
// (`sig`, which never changes), then one or two of their other loves, the stronger ones
// likelier. (Interests grow with a life's doings until most are full, so they only
// weight the choice; the sig is what makes one home unlike the next.)
function homeDecorKinds(c, r) {
  let kinds = [c.sig],
    pool = INTERESTS.filter((k) => k !== c.sig),
    n = Math.min(HOMES.maxDeco, r.chance(0.6) ? 3 : 2);
  while (kinds.length < n && pool.length) {
    let k = r.weighted(pool, (k) => 0.15 + (c.interests[k] || 0) ** 2 + (k === "social" ? 0.5 * c.temp.sociability : 0));
    kinds.push(k);
    pool.splice(pool.indexOf(k), 1);
  }
  return kinds.map((k) => HOME_DECOR[k]);
}

// A home's decorations for its owner, made the first time they are needed and again when
// the home passes to someone else (who keeps one thing from before).
function homeDecorOf(w, s) {
  let o = s.owner != null ? w.byId[s.owner] : null;
  if (!o || !o.interests) return s.deco || null;
  let d = s.deco;
  if (d && d.by === o.id) return d;
  let r = new Rng(w.seed + ":home:" + s.id + ":" + o.id),
    // the first owner has lived here since it was begun (in an older valley, that may be
    // long ago); anyone who takes a home over is just moving in
    since = !d ? s.t || 0 : Math.round(w.t),
    kinds = homeDecorKinds(o, r),
    t = since + r.range(HOMES.settleDays[0], HOMES.settleDays[1]) * 86400,
    list = [];
  for (let k of kinds) {
    list.push({ k, at: Math.round(t), h: r.int(0, 999) });
    t += r.range(HOMES.nextDays[0], HOMES.nextDays[1]) * 86400;
  }
  let shown = list.filter((it) => it.at <= w.t).length,
    old = null;
  if (d && d.list) {
    let keep = d.list.find((it) => it.at <= w.t && !list.some((x) => x.k === it.k)) || (d.old && !list.some((x) => x.k === d.old.k) ? d.old : null);
    if (keep) old = { k: keep.k, h: keep.h, by: keep.by ?? d.by };
  }
  s.deco = { by: o.id, since: Math.round(since), list, shown, old };
  if (shown) {
    // already there when this valley first looked (an older valley): not news
    w.homeFirsts = w.homeFirsts || {};
    for (let it of list.slice(0, shown)) w.homeFirsts[it.k] = w.homeFirsts[it.k] || Math.round(w.t);
  }
  return s.deco;
}

// Every ten minutes: homes that changed hands get their new owner's things; a decoration
// whose time has come is noticed (the first of each kind in the valley goes in the log).
function homesTick(w) {
  for (let s of w.structures) {
    // damp garden soil is news once, not again for every new garden
    if (s.kind === "garden" && !s.dampNoted && w.structures.some((g) => g.kind === "garden" && g.dampNoted)) s.dampNoted = !0;
    if (s.kind !== "home" || !(s.level > 0)) continue;
    let d = homeDecorOf(w, s);
    if (!d) continue;
    while (d.shown < d.list.length && d.list[d.shown].at <= w.t) {
      let it = d.list[d.shown++],
        o = w.byId[d.by];
      w.homeFirsts = w.homeFirsts || {};
      if (!w.homeFirsts[it.k] && o) {
        w.homeFirsts[it.k] = Math.round(w.t);
        logEvent(w, 1, `${o.name} has ${HOME_DECOR_TEXT[it.k]}.`, [o.id], s, "home");
      }
    }
  }
}

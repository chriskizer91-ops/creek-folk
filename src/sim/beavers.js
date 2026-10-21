// Phase 3C: the beavers.
//
// When the valley floor is about as wet as it gets (around month 6), a pair of beavers comes
// up the creek and builds a lodge in the biggest pond. The creekfolk have been doing beaver
// work all along; now the beavers take over much of the dam-tending (mending worn dams,
// building silted ones up), and they hold the water a little higher than the creekfolk did.
// They have kits in spring, up to six beavers. They are not creekfolk: `world.beavers`.
//
// Movement is a few cheap legs per world tick along the creek (the view interpolates them).

var BEAVER = {
  earliestDay: 120, // real days: not before month 5 ...
  driest: 0.55, // ... and only once this much of the floor stays wet at the driest point
  latestDay: 210, // they come by month 7 whatever the creek
  max: 6, // beavers in the valley at most
  above: 0.25, // m above the valley floor the beavers will build a dam (the creekfolk stop at 0.1)
  raiseGap: 2 * 86400, // a dam is built up by beavers at most this often ...
  raiseEvery: 3 * 3600, // ... and the beavers build one up at most this often (all dams)
  speed: 0.4, // m/s swimming
  smallDams: 12, // little stick dams on the side channels across the floor ...
  smallHold: 0.2, // ... each holds water this far above the ground where it stands ...
  smallReach: 7, // ... over the low ground within this many metres, all year
  oldDays: 60, // real days a beaver lives, about
};

function beaversOf(w) {
  return w.beavers || null;
}

// Where the creek runs at z (the centre line), and a point beside it.
function beaverCreekPoint(w, i, side = 0) {
  let n = w.creek.nodes[clamp(i, 0, w.creek.nodes.length - 1)];
  return { x: +(n.x + side).toFixed(2), z: +clamp(n.z, 0.5, VL - 0.5).toFixed(2) };
}

// The biggest pond that holds: the dam with the deepest water standing in its pond (over
// the few nodes above it); a silted valley still has one somewhere.
function beaverBestPond(w) {
  let cr = w.creek,
    full = cr._pondFull,
    best = null,
    bd = -1e9;
  for (let id in cr.dams) {
    let d = cr.dams[id],
      s = w.byId[id];
    if (!s || !d.hold) continue;
    let n = cr.nodes[d.i];
    if (n.z < 6 || n.z > VL - 6) continue;
    let depth = -1;
    for (let j = Math.max(0, d.i - 6); j <= d.i; j++) if (full && full[j] > -1e8) depth = Math.max(depth, full[j] - cr.nodes[j].bed);
    depth -= Math.abs(n.z - VL * 0.45) / 400; // a little preference for the middle of the valley
    if (depth > bd) (bd = depth), (best = d);
  }
  return best;
}

// Every life tick: do the beavers come?
function beaverArrivalCheck(w) {
  if (w.beavers || !w.creek) return;
  let day = w.t / 86400;
  if (day < BEAVER.earliestDay) return;
  let dr = creekDriest(w),
    ready = (dr && dr.wet >= BEAVER.driest) || day >= BEAVER.latestDay;
  if (!ready) return;
  beaversArrive(w);
}

function beaversArrive(w, dev = false) {
  if (w.beavers) return null;
  let d = beaverBestPond(w);
  if (!d) return null; // no pond to live in yet: they'll come when there is one
  let cr = w.creek,
    li = Math.max(0, d.i - 2),
    n = cr.nodes[li],
    side = w.rng.chance(0.5) ? -1 : 1,
    off = side * (n.wb / 2 + 0.6),
    lodge = { i: li, x: +(n.x + off).toFixed(2), z: +n.z.toFixed(2), sid: d.id, size: 0.2, side },
    B = (w.beavers = { arrived: Math.round(w.t), lodge, list: [], next: 1, small: [], raised: 0, mended: 0, kitsYear: -1, noticed: 0 });
  for (let k = 0; k < 2; k++) beaverAdd(w, B, "adult", { i: Math.min(cr.nodes.length - 1, li + 6 + k), side: 0 });
  let pond = (w.placeNames || []).find((p) => p.kind === "pool" && dist2d(p.x, p.z, lodge.x, lodge.z) < 14);
  logEvent(w, 3, `Two beavers came up the creek in the night and looked the ponds over. By morning they had begun a lodge of sticks in ${pond ? pond.name : "the biggest pond"}.`, [], lodge, "beavers");
  let near = w.creatures.filter((c) => !c.visitor && !c.asleep && dist2d(c.x, c.z, lodge.x, lodge.z) < 25);
  newStory(w, "beavers", { where: pond ? pond.name : null }, lodge, 2, near);
  for (let c of near) {
    remember(w, c, "nature", "Beavers have come to live in our ponds! They work the water the way we do.", 0.8);
    wordFor(w, c, "beaver");
  }
  namePlace(w, "the Beaver Lodge", lodge, "lodge", 3, near[0] || null);
  w.stats.beaversDay = +(w.t / 86400).toFixed(2);
  return B;
}

function beaverAdd(w, B, age, at) {
  let p = beaverCreekPoint(w, at.i, at.side || 0),
    b = { id: B.next++, born: Math.round(w.t), age, i: at.i, x: p.x, z: p.z, px: p.x, pz: p.z, pt: Math.round(w.t), at: Math.round(w.t), task: "swim", ti: B.lodge.i, until: 0, sid: null };
  B.list.push(b);
  return b;
}

// Every world tick (60 s).
function beaverTick(w) {
  let B = w.beavers;
  if (!B || !B.list.length) return;
  let night = isNight(w.t),
    cr = w.creek;
  // the lodge grows as sticks come in
  for (let b of B.list) {
    if (w.t < b.until) continue;
    if (b.task === "swim") {
      // one leg along the creek toward the target node
      let step = Math.max(1, Math.round((BEAVER.speed * 60) / CREEK.ds)),
        ni = b.i < b.ti ? Math.min(b.ti, b.i + step) : Math.max(b.ti, b.i - step);
      beaverMove(w, b, ni, b.ti === B.lodge.i ? B.lodge.side * 0.5 : 0, 60);
      if (ni === b.ti) beaverArrive(w, B, b);
      continue;
    }
    if (b.task === "work") {
      beaverWorkDone(w, B, b);
      continue;
    }
    // resting in the lodge, chewing, playing: time to choose again
    beaverChoose(w, B, b, night);
  }
}

function beaverMove(w, b, ni, side, dur) {
  let p = beaverCreekPoint(w, ni, side);
  b.px = b.x;
  b.pz = b.z;
  b.pt = Math.round(w.t);
  b.x = p.x;
  b.z = p.z;
  b.i = ni;
  b.at = Math.round(w.t + dur);
}

function beaverArrive(w, B, b) {
  let night = isNight(w.t);
  if (b.job === "dam") {
    b.task = "work";
    b.until = Math.round(w.t + w.rng.range(400, 1000));
  } else if (b.job === "home") {
    b.task = "home";
    b.until = Math.round(w.t + (night ? w.rng.range(240, 600) : w.rng.range(900, 2400)));
    B.lodge.size = +Math.min(1, B.lodge.size + (b.carry ? 0.04 : 0.005)).toFixed(3);
    b.carry = 0;
  } else if (b.job === "chew") {
    b.task = "chew";
    b.until = Math.round(w.t + w.rng.range(300, 700));
    b.carry = 1;
  } else if (b.job === "small") {
    b.task = "work";
    b.until = Math.round(w.t + w.rng.range(400, 900));
  } else {
    b.task = "play";
    b.until = Math.round(w.t + w.rng.range(200, 700));
  }
}

// What a beaver does next. Busy at dusk, at night and at dawn; mostly in the lodge by day.
function beaverChoose(w, B, b, night) {
  let dusk = beaverDuskish(w),
    festival = w.returning && w.returning.active && w.t >= w.returning.active.dusk, // the beavers are out on the night of the Returning
    active = night || dusk || festival || w.rng.chance(0.2);
  if (b.age === "kit") active = active && w.rng.chance(0.6);
  if (!active) return beaverGo(w, b, B.lodge.i, "home");
  if (b.age !== "kit") {
    let s = beaverDamJob(w, B, b);
    if (s) {
      s.beaver = b.id;
      b.sid = s.id;
      return beaverGo(w, b, beaverDamNode(w, s), "dam");
    }
    if (b.carry) {
      // sticks go to the lodge, or now and then across a side channel
      let site = B.small.length < BEAVER.smallDams && w.rng.chance(0.25) ? beaverSmallSite(w, B) : null;
      if (site) {
        b.smallSite = site;
        return beaverGo(w, b, site.i, "small");
      }
      return beaverGo(w, b, B.lodge.i, "home");
    }
    if (w.rng.chance(0.45)) return beaverGo(w, b, clamp(B.lodge.i + w.rng.int(-10, 10), 0, w.creek.nodes.length - 1), "chew");
  }
  beaverGo(w, b, clamp(B.lodge.i + w.rng.int(-5, 5), 0, w.creek.nodes.length - 1), "play");
}

function beaverDamNode(w, s) {
  let d = w.creek.dams[s.id];
  return d ? Math.min(w.creek.nodes.length - 1, d.i + 1) : creekNodeIndex(s.z);
}

// The edges of the night, a little either side of dusk and dawn.
function beaverDuskish(w) {
  let L = w.cycle ? w.cycle.len : VALLEY_DAY;
  return isNight(w.t + 0.06 * L) !== isNight(w.t - 0.06 * L);
}

function beaverGo(w, b, ti, job) {
  b.ti = ti;
  b.job = job;
  if (ti === b.i) {
    beaverArrive(w, w.beavers, b);
    if (b.task === "home") b.x = w.beavers.lodge.x, b.z = w.beavers.lodge.z, b.px = b.x, b.pz = b.z, b.pt = Math.round(w.t), b.at = Math.round(w.t);
    return;
  }
  b.task = "swim";
  b.until = 0;
}

// A dam a beaver could work on: one that's worn, one asking to be built up, or one the
// beavers will build higher than the creekfolk did. Never one a creekfolk is mending.
function beaverDamJob(w, B, b) {
  let cr = w.creek,
    best = null,
    bs = 0;
  for (let s of w.structures) {
    if (s.kind !== "dam" || !(s.level > 0) || s.building) continue;
    if (s.beaver && s.beaver !== b.id && B.list.some((o) => o.id === s.beaver && o.sid === s.id)) continue;
    if (w.creatures.some((c) => c.plan && c.plan.repair === s.id)) continue;
    let d = cr.dams[s.id];
    if (!d) continue;
    let n = cr.nodes[d.i],
      score = 0,
      canRaise = w.t - (s.beaverRaised || -1e9) > BEAVER.raiseGap && w.t - (B.lastRaise || -1e9) > BEAVER.raiseEvery;
    if (s.raise) score = canRaise && creekSafeToRaise(w, s, CREEK.raiseStep) ? 3 : 0; // unsafe or too soon: the creekfolk see to it
    else if ((s.cond ?? 1) < 0.75) score = 2 + (0.75 - s.cond);
    else if (canRaise && d.crest < n.fp + BEAVER.above - 0.02 && creekSafeToRaise(w, s, CREEK.raiseStep) && s.pond > 0.6) score = 1;
    if (!score) continue;
    score /= 1 + Math.abs(d.i - b.i) / 40;
    if (score > bs) (bs = score), (best = s);
  }
  return best;
}

function beaverWorkDone(w, B, b) {
  if (b.job === "small") {
    let site = b.smallSite;
    if (site && B.small.length < BEAVER.smallDams) {
      B.small.push({ x: site.x, z: site.z, t: Math.round(w.t) });
      if (B.small.length === 1) logEvent(w, 2, "The beavers dammed one of the little side channels across the floor. The water spread out behind their sticks.", [], site, "beavers");
    }
    b.carry = 0;
    b.smallSite = null;
    return beaverGo(w, b, B.lodge.i, "home");
  }
  let s = b.sid && w.byId[b.sid];
  b.sid = null;
  if (s && s.kind === "dam" && s.beaver === b.id) {
    s.beaver = 0;
    let cr = w.creek,
      d = cr.dams[s.id],
      n = d && cr.nodes[d.i];
    if ((s.cond ?? 1) < 0.95) {
      s.cond = 1;
      s.wornNoted = !1;
      B.mended++;
    }
    let up = false;
    let canRaise = w.t - (s.beaverRaised || -1e9) > BEAVER.raiseGap && w.t - (B.lastRaise || -1e9) > BEAVER.raiseEvery;
    if (d && canRaise && (s.raise || d.crest < n.fp + BEAVER.above - 0.02) && creekSafeToRaise(w, s, CREEK.raiseStep)) up = creekRaiseDam(w, s, null, { above: BEAVER.above, quiet: true });
    if (up) {
      s.beaverRaised = B.lastRaise = Math.round(w.t);
      B.raised++;
      if (B.raised === 1) logEvent(w, 2, `The beavers built the ${builtLevelDef(s).label} up higher in the night. In the morning its pond was wider than the creekfolk had ever made it.`, [], s, "beavers");
    }
    beaverNotice(w, B);
  }
  beaverGo(w, b, B.lodge.i, "home");
}

// A spot for a little stick dam across a side channel: anywhere on the valley floor (the
// beavers range up and down the creek), where the ground still dries out ({ x, z, i } or null).
function beaverSmallSite(w, B) {
  let cr = w.creek,
    c = creekCells(w),
    best = null,
    bs = -1;
  for (let k = 0; k < 60; k++) {
    let z = w.rng.range(3, VL - 3),
      x = clamp(w.terrain.creekX(z) + w.rng.range(-18, 18), 1, VW - 1),
      ci = Math.floor(z) * VW + Math.floor(x);
    if (!c.floor[ci] || c.d[ci] < 2) continue;
    if (B.small.some((s) => dist2d(s.x, s.z, x, z) < 9)) continue;
    let vi = Math.round(z) * (VW + 1) + Math.round(x),
      sc = 1 - (w.wet ? w.wet[ci] : 0) + 0.6 * Math.min(1, (cr.chan ? cr.chan[vi] : 0) / 0.2);
    if (sc > bs) (bs = sc), (best = { x: +x.toFixed(2), z: +z.toFixed(2), i: creekNodeIndex(z) });
  }
  return bs > 0.5 ? best : null;
}

// The water the side dams hold, per cell (creek.js adds it to the water table): a dam holds
// water a little above the ground where it stands, over the low ground around it.
function beaverPondLevels(w, c) {
  let B = w.beavers;
  if (!B || !B.small.length) return null;
  let key = B.small.map((s) => s.x + ":" + s.z).join(",") + "|" + w.terrain.version,
    m = beaverPondCache.get(w.creek);
  if (m && m.key === key) return m.a;
  let a = new Float32Array(CELLS),
    R = BEAVER.smallReach;
  a.fill(-1e9);
  for (let s of B.small) {
    let L = w.terrain.heightAt(s.x, s.z) + BEAVER.smallHold;
    for (let cz = Math.max(0, Math.floor(s.z - R)); cz <= Math.min(VL - 1, Math.ceil(s.z + R)); cz++)
      for (let cx = Math.max(0, Math.floor(s.x - R)); cx <= Math.min(VW - 1, Math.ceil(s.x + R)); cx++) {
        let k = cz * VW + cx;
        if (!c.floor[k] || (cx + 0.5 - s.x) ** 2 + (cz + 0.5 - s.z) ** 2 > R * R || c.h[k] > L) continue;
        if (L > a[k]) a[k] = L;
      }
  }
  beaverPondCache.set(w.creek, { key, a });
  return a;
}
var beaverPondCache = new WeakMap();

// The creekfolk notice how much the beavers do.
function beaverNotice(w, B) {
  if (B.noticed || B.mended + B.raised < 6) return;
  B.noticed = Math.round(w.t);
  let c = w.creatures.filter((c) => !c.visitor && c.stage !== "child" && c.know && c.know.dams).sort((a, b) => b.temp.curiosity - a.temp.curiosity)[0];
  if (!c) return;
  logEvent(w, 2, `${c.name} says the beavers mend the dams better than anyone. There's more time now ${w.temple ? "for the temple" : "for other work"}.`, [c.id], c, "beavers");
  remember(w, c, "nature", "The beavers do the dam work now, at night, while we sleep.", 0.6);
}

// Every life tick: kits in spring, the old ones go, the lodge stays theirs.
function beaverLifeTick(w) {
  beaverArrivalCheck(w);
  let B = w.beavers;
  if (!B) return;
  let s = seasonAt(w),
    yr = s.year;
  for (let b of B.list) if (b.age === "kit" && w.t - b.born > 8 * 86400) b.age = "adult";
  if (s.name === "spring" && B.kitsYear !== yr && B.list.filter((b) => b.age === "adult").length >= 2) {
    B.kitsYear = yr;
    let n = Math.min(BEAVER.max - B.list.length, w.rng.int(1, 2));
    for (let k = 0; k < n; k++) beaverAdd(w, B, "kit", { i: B.lodge.i, side: B.lodge.side * 0.5 });
    if (n > 0 && !B.kitsNoted) {
      B.kitsNoted = Math.round(w.t);
      logEvent(w, 2, `There are beaver kits in the lodge: ${n === 1 ? "one small dark head" : "two small dark heads"} in the water at dusk.`, [], B.lodge, "beavers");
    }
  }
  // an old beaver goes off down the creek one night (and a young pair keeps the lodge)
  let old = B.list.filter((b) => b.age === "adult" && w.t - b.born > BEAVER.oldDays * 86400);
  if (old.length && B.list.length >= 3 && w.rng.chance(LIFE.tick / (4 * 86400))) {
    let b = old[0];
    B.list.splice(B.list.indexOf(b), 1);
    for (let st of w.structures) if (st.beaver === b.id) st.beaver = 0;
  }
  // the lodge moves if its pond is gone (a dam was rebuilt elsewhere)
  if (!w.creek.dams[B.lodge.sid]) {
    let d = beaverBestPond(w);
    if (d) B.lodge.sid = d.id;
  }
}

// Creekfolk go and watch the beavers at dusk (curious ones, children most).
function beaverWatchOption(w, c) {
  let B = w.beavers;
  if (!B || c.visitor || !beaverDuskish(w) || c.needs.energy < 0.3) return null;
  let p = w.terrain.randomPoint(w.rng, { near: { x: B.lodge.x - B.lodge.side * 4, z: B.lodge.z, r: 3 }, minEdge: 1.5 });
  if (!p) return null;
  let score = (0.25 + 0.6 * c.temp.curiosity + (c.stage === "child" ? 0.35 : 0)) * clamp((0.95 - c.needs.fun) / 0.9, 0.15, 1);
  return { score, plan: { goal: "beavers", steps: [{ do: "walk", x: p.x, z: p.z, near: 0.6 }, { do: "watchbeavers", dur: w.rng.range(180, 420), lx: B.lodge.x, lz: B.lodge.z }] } };
}

ACTIONS.watchbeavers = {
  start(w, c, step) {
    return makeAct(w, c, "watch", step.dur || 240, { lookX: step.lx, lookZ: step.lz });
  },
  end(w, c) {
    c.needs.fun = clamp(c.needs.fun + 0.22, 0, 1);
    feel(c, w, "joy", 0.25);
    wordFor(w, c, "beaver");
    if (!(c.counts.beavers > 0)) remember(w, c, "nature", c.stage === "child" ? "I watched the beavers slap the water with their tails! Splash!" : "We sat by the pond at dusk and watched the beavers at work.", 0.6);
    c.counts.beavers = (c.counts.beavers || 0) + 1;
    return true;
  },
};

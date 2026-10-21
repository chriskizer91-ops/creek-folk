// ==========================================================================
// Creekfolk 2: the creek heals in a month, and then lives on.
//
// Creekfolk 1's creek (src/sim/creek.js) heals over about five months; Creekfolk 2's
// founders have one lifetime, a month: four valley years, four wet seasons, twenty to thirty
// floods. The processes stay Creekfolk 1's and true in direction (DECISIONS.md 1 and 2); what
// changes is how much, where from, and when:
//   - the creek starts less deeply cut below the ledge (CF2_VALLEY.cutBelow), and each storm
//     brings more mud (CREEK.fineYield) that settles more readily in ponds (CREEK.pondTrap).
//   - the mud comes from this valley. The old valley upstream is healed, so its creek runs
//     clear and brings little (CF2_CREEK.mudUp); the mud that fills this creek washes in with
//     every storm off the bare hills along it (mudSides) and down the Dry Fork from the plateau
//     (mudDry), so every reach has its own and the upper ponds don't starve the lower creek.
//     (Creekfolk 1: most of it comes from above the valley.)
//   - dams are worked at low water. As in the old valley, the founders begin a dam, or its
//     next level, and build up a silted one, only in the dry season, when the creek is low;
//     through the wet season the floods fill the ponds with mud. So each pond is built up
//     about once a valley year and the creek heals a step a year, with the seasons, however
//     many hands there are. (cf2LowWater; the beavers keep their own hours.)
//   - the founders dam the whole valley, from the bottom of the creek up: the first dam at
//     the bottom of the valley, then each where the pond below has just reached its foot,
//     spaced along the creek, worth the walk from home (cf2DamSite), as many as a longer
//     valley takes (STRUCTURES.dam.multi), right down to its ends (damRim). No dam holds
//     water higher than the floor beside it lets it (the water would go round it).
//   - a healed floor holds its water. A pond above the floor's water table soaks sideways
//     into it as readily as the floor drains into the creek (pondSide), the bed is sealed
//     once a hand or two of mud has settled in it (sealRise), and the limestone hills give
//     the wet season's rain back through the dry season for longer (CREEK.hillTau), so a
//     healed valley stays wet through all but the driest years, as beaver meadows do.
//   - the valley floor settles instead of rising forever. Mud a flood leaves on the floor
//     thins out as the floor nears its settled level (floorSettle above where it started),
//     the way a floodplain builds until floods rarely top it. Mud layers keep forming,
//     thinner and thinner.
//   - side channels on the floor fill in with mud while new ones open elsewhere. Every
//     flood that spills over the bank leaves mud in the channels near the spill
//     (chanFill); the threads of water that carry the flood keep theirs open and wear new
//     ones, so the channels wander the way a real beaver meadow's do. Nothing the creekfolk
//     built is undone: the creek only ever builds.
//   - storms come in fronts. Creekfolk 1's weather turns rain to storm by chance alone, so
//     one wet season brings three storms and the next twelve; with only four wet seasons in
//     the founders' month, that alone would decide whether the creek heals. Here, just after
//     a storm another is less likely, and the longer the wet season goes without one the
//     likelier it gets (stormGap), so most wet seasons bring five to nine.
// Wraps creekFloodWork, creekSpread, creekSyncDams and creekRaiseDam (creek.js),
// changeWeather and projectReason (core.js) and cf2BuildNodes (cf2-valley.js); hooks in
// damSite, projectReason and bestWork (core.js) and creekHydro (creek.js) read CF2_CREEK.
// See docs/MERGE.md.
// ==========================================================================

var CF2_CREEK = {
  floorSettle: 0.3, // m above the old floor where the floor stops building
  settlePow: 1.5, // how sharply floor deposits thin out as it nears that level
  chanFill: 0.06, // share of a side channel's depth each spilling flood fills with mud
  chanReach: 10, // m along the valley either side of a spill that its mud reaches
  damSpacing: 12, // m: those who know build their dams at least about this far apart ...
  damDeep: 0.3, // ... and not where the pond below already stands deeper than this (the dam would drown)
  damWalk: 0.075, // how much less the walk to a site counts for them (Creekfolk 1: 0.08 a metre)
  damBottom: 0.25, // how much more a site below all the dams counts, a metre further down
  damRim: 0.88, // dams can go this near the valley's rounded ends (Creekfolk 1: 0.8; walkable to 0.9)
  damRest: 8, // hours after the last work on any dam before a new one is begun (Creekfolk 1: 30)
  stormGap: 8, // valley days: a storm this long after the last comes as readily as in Creekfolk 1 ...
  stormLo: 0.15, // ... just after one, this much as readily ...
  stormHi: 2.5, // ... and after a long wait, up to this much more
  mudUp: 0.25, // how much mud the creek brings from above the valley, against Creekfolk 1 ...
  mudSides: 3, // ... from the hills along the valley ...
  mudDry: 1, // ... down the Dry Fork ...
  mudSpring: 0.25, // ... and the spring branch (spring water runs clear)
  pondSide: 1, // how readily a pond soaks sideways into a floor whose water table is below it,
  //   against how readily the floor drains into the creek (Creekfolk 1: 0, only a seep)
  sealRise: 0.3, // m of mud in the bed that seals it, so the floor's water no longer sinks away
  //   through the gravel below (Creekfolk 1: 0.6, in a trench twice as deep)
};

STRUCTURES.dam.multi = 20; // Creekfolk 1: 14, for a valley 160 m long

Object.assign(CREEK, {
  fineYield: 2000, // m3 of mud a valley year of storms brings per km2 of hills (Creekfolk 1: 800)
  pondTrap: 0.06, // share of the passing mud that settles in each node of a pond (Creekfolk 1: 0.03)
  // the limestone hills hold the wet season's rain longer and give it back to the floor
  // through the dry season, so a healed floor stays wet through all but the driest years
  hillFill: 0.035, // (Creekfolk 1: 0.03)
  hillTau: 110, // (Creekfolk 1: 70)
});

// How much of a flood's floor deposit stays, at a floor `rise` m above where it started.
function cf2FloorTaper(rise) {
  let f = clamp(1 - rise / CF2_CREEK.floorSettle, 0, 1);
  return Math.pow(f, CF2_CREEK.settlePow);
}

var cf2FloodWorkBase = creekFloodWork;
creekFloodWork = function (w, T, seed) {
  let cr = w.creek,
    ns = cr.nodes,
    fp = new Float64Array(ns.length);
  for (let i = 0; i < ns.length; i++) fp[i] = ns[i].fp;
  cf2FloodWorkBase(w, T, seed);
  let changed = false;
  for (let i = 0; i < ns.length; i++) {
    let n = ns[i],
      d = n.fp - fp[i];
    if (d <= 0) continue;
    let base = cr.init && cr.init[i] ? cr.init[i][1] : fp[i],
      keep = cf2FloorTaper(fp[i] - base);
    n.fp = +(fp[i] + d * keep).toFixed(5);
    changed = true;
  }
  if (changed) creekDerive(w), creekRefresh(w);
};

// Mud settling in the side channels near where a flood spills.
function cf2ChannelsFill(w, spills) {
  let cr = w.creek,
    chan = cr.chan,
    ns = cr.nodes,
    W1 = VW + 1,
    R = CF2_CREEK.chanReach,
    k = CF2_CREEK.chanFill,
    rows = new Uint8Array(VL + 1);
  for (let i of spills) {
    let z = ns[i].z;
    for (let r = Math.max(0, Math.floor(z - R)); r <= Math.min(VL, Math.ceil(z + R)); r++) rows[r] = 1;
  }
  for (let z = 0; z <= VL; z++) {
    if (!rows[z]) continue;
    for (let v = z * W1, e = v + W1; v < e; v++) {
      let c = chan[v];
      if (c <= 0) continue;
      c -= k * c + 0.0005;
      chan[v] = c < 0.002 ? 0 : c;
    }
  }
}

var cf2SpreadBase = creekSpread;
creekSpread = function (w, spills, seed) {
  cf2ChannelsFill(w, spills);
  cf2SpreadBase(w, spills, seed);
};

// A new dam holds no higher than the floor beside it lets it (CREEK.raiseAbove above it),
// however tall it is built: Creekfolk 1's crest (the bed plus the dam's height) can stand
// far above the floor where the creek has filled its trench.
var cf2SyncDamsBase = creekSyncDams;
creekSyncDams = function (w) {
  let cr = w.creek,
    was = {};
  for (let id in cr.dams) was[id] = cr.dams[id].crest;
  cf2SyncDamsBase(w);
  let changed = false;
  for (let id in cr.dams) {
    let d = cr.dams[id],
      prev = was[id] ?? -1e9,
      top = cr.nodes[d.i].fp + CREEK.raiseAbove;
    if (d.crest > prev + 1e-9 && d.crest > top) (d.crest = +Math.max(prev, top).toFixed(4)), (changed = true);
  }
  if (changed) creekRefresh(w);
};

// Where someone who knows dams are built from the bottom up puts the next one (called
// from damSite with its score T for the site at z = h): the first at the bottom of the
// valley, then each a little way up the pond of the one below (where it reaches but isn't
// deep), worth the walk from home.
function cf2DamSite(w, c, at, h, T, why, knows, standing, dams) {
  if (!knows) return { T, why };
  let C = CF2_CREEK,
    near = 1e9,
    lowest = 0;
  for (let d of dams) (near = Math.min(near, Math.abs(d.z - h))), (lowest = Math.max(lowest, d.z));
  // the bottom of the creek first: a new series starts as far down the valley as they go
  if (h > lowest + 6) T += C.damBottom * (h - lowest);
  if (!dams.length) why = "at the bottom of the creek, so the water can stand from the bottom up";
  if (near < C.damSpacing) T -= 8 * clamp((C.damSpacing - near) / (C.damSpacing - 7), 0, 1);
  if (standing > C.damDeep) T -= 30 * (standing - C.damDeep);
  T += dist2d(w.terrain.creekX(h), h, at.x, at.z) * (0.08 - C.damWalk);
  return { T, why };
}

// Storms in fronts: the chance that rain turns to storm (WEATHER.storm) scaled by how long it
// has been since the last one, for this one change of weather.
var cf2ChangeWeatherBase = changeWeather;
changeWeather = function (w) {
  let e = w.weather,
    was = e.state,
    keep = WEATHER.storm,
    C = CF2_CREEK;
  if (was === "rain") WEATHER.storm = keep * clamp((w.t - (e.lastStorm ?? -1e9)) / (C.stormGap * VALLEY_DAY), C.stormLo, C.stormHi);
  try {
    cf2ChangeWeatherBase(w);
  } finally {
    WEATHER.storm = keep;
  }
  if (e.state === "storm" && was !== "storm") e.lastStorm = Math.round(w.t);
};

// Where the creek's mud comes from: each node's share of the sediment a storm brings
// (node.aLat, which only the sediment uses; the flow still comes from the drained area).
var cf2BuildNodesBase = cf2BuildNodes;
cf2BuildNodes = function (T, seed) {
  let nodes = cf2BuildNodesBase(T, seed),
    C = CF2_CREEK,
    join = {};
  for (let b of Object.values(T.branches)) join[creekNodeIndex(b.joinZ)] = (join[creekNodeIndex(b.joinZ)] || 0) + b.area * (b.id === "dry" ? C.mudDry : C.mudSpring);
  for (let i = 0; i < nodes.length; i++) nodes[i].aLat = +((i === 0 ? CREEK.A0 * C.mudUp : (CREEK.lam * CREEK.ds * C.mudSides) / 1000) + (join[i] || 0)).toFixed(6);
  return nodes;
};

// Low water: the dry season (summer and autumn), when dams are begun, built and raised.
function cf2LowWater(w) {
  return !seasonAt(w).wetSeason;
}
var cf2DamReasonBase = projectReason;
projectReason = function (i, t, e, n, s) {
  if (e === "dam" && !cf2LowWater(i)) return null;
  return cf2DamReasonBase(i, t, e, n, s);
};
// The creekfolk raise a silted dam only at low water (the beavers, who call it with no one,
// whenever they like). Wraps creekRaiseDam (creek.js).
var cf2RaiseDamBase = creekRaiseDam;
creekRaiseDam = function (w, s, who, opt) {
  if (who && !cf2LowWater(w)) return false;
  return cf2RaiseDamBase(w, s, who, opt);
};

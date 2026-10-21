// ==========================================================================
// Creekfolk 2: real scale.
//
// Creekfolk 1's creekfolk stand about 0.6 m tall beside a creek 2.4 m wide; Creekfolk 2's
// are person-sized (about 1.5 m) beside a creek of the same size, in a valley about three
// times the area. So the creek, its dams and its crossings keep their sizes, and what is
// built for bodies (homes, stores, gardens, the meeting place) is built bigger, the
// valley holds more trees and materials, and they notice things (and witness events)
// from further off. Applied once, when the simulation loads; see docs/MERGE.md.
// ==========================================================================

var CF2_SCALE = {
  build: 1.5, // homes, stores, gardens and the rest, against Creekfolk 1's
  res: 2.4, // trees, bushes, reeds, stones, clay and the rest, against Creekfolk 1's valley
  see: 1.5, // how far they notice things and who counts as a witness
  floor: 1.7, // how much wider the valley floor is (about 20.5 m from the axis to its edge, against 12.3)
};

for (let k in STRUCTURES) if (k !== "dam" && k !== "crossing") STRUCTURES[k].radius = +(STRUCTURES[k].radius * CF2_SCALE.build).toFixed(2);

// Creekfolk 1's 3C at real scale (see docs/MERGE.md). The memorial grove is laid out for
// person-sized creekfolk: trunks further apart, and the grove wider (grove.js scales the
// rest of its lengths, and its fallen logs, in place). The sky stones take the room their
// scaled structure needs. The beavers' little side dams: as many more as the bigger floor
// has room for (they look for sites across the wider floor in beavers.js).
GROVE.space = +(GROVE.space * CF2_SCALE.build).toFixed(2);
GROVE.reach = +(GROVE.reach * CF2_SCALE.build).toFixed(2);
SKYCAL.radius = STRUCTURES.skycal.radius;
BEAVER.smallDams = cf2Count(BEAVER.smallDams);

// How many of each thing a new valley starts with (createWorld's counts in Creekfolk 1).
function cf2Count(n) {
  return Math.round(n * CF2_SCALE.res);
}

// Where the village starts: up on the west terrace near the spring, a little upstream of it.
function cf2MeadowSpot(T, rng) {
  let sp = T.branches.spring.head,
    near = { x: sp.x - 9, z: sp.z - 9, r: 9 };
  return (
    T.randomPoint(rng, { side: 0, offFloor: true, minEdge: 14, near, maxR: 0.8 }) ||
    T.randomPoint(rng, { side: 0, offFloor: true, near: { ...near, r: 20 } }) || { x: sp.x - 8, z: sp.z - 8 }
  );
}

var cf2WitnessesBase = witnessesNear;
witnessesNear = function (w, at, radius = 12, extra = []) {
  return cf2WitnessesBase(w, at, radius * CF2_SCALE.see, extra);
};
var cf2LookAroundBase = lookAround;
lookAround = function (i, t, e = 10) {
  return cf2LookAroundBase(i, t, e * CF2_SCALE.see);
};

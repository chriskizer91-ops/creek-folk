// ==========================================================================
// Creekfolk 2: belief, and what it leaves out.
//
// Creekfolk 1's belief that the creek gives wakes in Creekfolk 2 from the treasures the
// player puts in the creek (cf2-treasure.js), not from gifts on a timer. Creekfolk 2 never
// builds the temple or the Hall of the Ancestors (nothing here is paced by the player),
// and the journey to the spring is Creekfolk 1's story (Creekfolk 2's founders came down
// the creek, and know where it comes from).
// Creekfolk 1's 3C (returning.js) lays a procession path and holds the Returning festival
// only once a temple is finished, so with no temple neither ever happens; what is left is
// its glowing fish run at midwinter once the creek has healed (Creekfolk 2's fish run).
// See docs/MERGE.md.
// ==========================================================================

templeCanStart = function () {
  return false;
};
TEMPLE.greatDay = 1e9; // no Hall of the Ancestors
springTick = function () {};

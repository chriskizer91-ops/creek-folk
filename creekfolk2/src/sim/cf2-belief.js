// ==========================================================================
// Creekfolk 2: belief, for now.
//
// Creekfolk 1's belief that the creek gives, its gifts and its temple are all here in the
// code, but in Phase 1 the player gives nothing, so belief stays asleep. Creekfolk 2 never
// builds the temple or the Hall of the Ancestors (nothing here is paced by the player),
// and the journey to the spring is Creekfolk 1's story (Creekfolk 2's founders came down
// the creek, and know where it comes from). Phase 3 brings treasures carried by floods.
// See docs/MERGE.md.
// ==========================================================================

templeCanStart = function () {
  return false;
};
TEMPLE.greatDay = 1e9; // no Hall of the Ancestors
springTick = function () {};

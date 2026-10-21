# Merging Creekfolk 1 into Creekfolk 2

Creekfolk 2's simulation (`src/sim/`) started as a copy of Creekfolk 1's at commit
`8e9ec93` (Phase 3B). When Creekfolk 1's 3C (or anything later) arrives, merge it as a
three-way merge per file, with `8e9ec93` as the base, Creekfolk 1's new version as theirs
and Creekfolk 2's as ours, e.g.

    git show 8e9ec93:src/sim/life.js > /tmp/base.js
    git merge-file creekfolk2/src/sim/life.js /tmp/base.js src/sim/life.js

Creekfolk 2 changes Creekfolk 1's files in two ways, both listed below:
- **Edits in place**, each marked `// CF2:` in the code. `git merge-file` handles these;
  check every conflict by hand.
- **Replacements**: a Creekfolk 1 function or value replaced from a Creekfolk 2 file loaded
  later in the same scope. A merge won't show a conflict for these, so for each one listed
  here, compare Creekfolk 1's new version of the function with the old one and carry the
  change into the replacement by hand.

After a merge: rebuild, run `tools/determinism.cjs` and the catch-up benchmark, and
report what was merged and what was left out.

## Edits in place

| File | Where | What and why |
|---|---|---|
| `creek.js` | `VW`, `VL` | The real-scale valley: 160 by 224 cells (was 80 by 160). |
| `creek.js` | `creekHydro`, before and in the node loop | `cf2BranchStep` runs the branches' water each step; `cf2BranchIn` adds a branch's flow where it joins the creek. |
| `core.js` | `obstacles`, `doorPoint` | A home's and the meeting place's footprint, and the door, scale with `CF2_SCALE.build`. |
| `core.js` | `createWorld` | The village starts by the spring (`cf2MeadowSpot`); counts of trees, bushes, reeds, stones, clay, glowcaps, logs and boulders scale with the valley (`cf2Count`); the "near the meadow" radii scale with `CF2_SCALE.build`; founders know what's within `15 * CF2_SCALE.see` m. |

## Replacements

| What | Replaced in | How | Why |
|---|---|---|---|
| `Terrain` (core.js) | `cf2-valley.js` | Whole class, same interface | The new valley: one height function at real scale, the bluff, the ledge, the branches carved in. Methods kept from Creekfolk 1 where the shape allows (`section`, `secOf`, `fpAt`, `hwOf`, `heightAt`, `uncarvedAt`, `randomPoint`, `waterSpan`); `walkable` also keeps off the bluff and out of the spring pool. A 3C change to Creekfolk 1's Terrain must be carried over by hand. |
| `creekBuildNodes` (creek.js) | `cf2-valley.js` (`cf2BuildNodes`) | Wraps it: Creekfolk 1's nodes, then this valley's cutting-down, the ledge, the branches' drained area | |
| `creekCellWater` (creek.js) | `cf2-branches.js` | Wraps it (runs it, then the cells along a branch with water stay wet) | The spring branch keeps its banks green all year. |
| `witnessesNear` (minds.js), `lookAround` (core.js) | `cf2-scale.js` | Wraps them (radius times `CF2_SCALE.see`) | Person-sized creekfolk see further. |
| `STRUCTURES[*].radius` (core.js) | `cf2-scale.js` | Times `CF2_SCALE.build` (not dams or crossings) | Homes and the rest for person-sized creekfolk. |
| `LIFE.founders`, `founderAges`, `elderDays`, `lifespanDays` (life.js) | `cf2-life.js` | Values | Eight founders; stages for the one-month arc (Phase 2 tunes them). |
| `templeCanStart`, `springTick` (temple.js), `TEMPLE.greatDay` | `cf2-belief.js` | No temple, no Hall of the Ancestors, no journey to the spring | Creekfolk 2 leaves the temple out; nothing is paced by the player. |
| `worker.js` | not used | Creekfolk 2's worker is `cf2-worker.js` | The simulation runs in the worker all the time, not only for catch-up. |

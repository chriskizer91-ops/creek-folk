# Merging Creekfolk 1 into Creekfolk 2

Creekfolk 2's simulation (`src/sim/`) started as a copy of Creekfolk 1's at commit
`8e9ec93` (Phase 3B), and Creekfolk 1's Phase 3C was merged in from commit
`59d5e4b758487c7dbe2812d5b2053ab55b138764` (branch `phase-3c`; see `docs/MERGE-3C.md`).
**The base for the next merge is `59d5e4b`.** Merge anything later from Creekfolk 1 as a
three-way merge per file, with `59d5e4b` as the base, Creekfolk 1's new version as theirs
and Creekfolk 2's as ours, e.g.

    git show 59d5e4b:src/sim/life.js > /tmp/base.js
    git show <new>:src/sim/life.js > /tmp/theirs.js
    git merge-file creekfolk2/src/sim/life.js /tmp/base.js /tmp/theirs.js

New Creekfolk 1 files are copied in unchanged where possible and added to `SIM_FILES` in
`tools/build.mjs` in Creekfolk 1's order, among Creekfolk 1's files (before the `cf2-*`
files and `api.js`).

Creekfolk 2 changes Creekfolk 1's files in two ways, both listed below:
- **Edits in place**, each marked `// CF2:` in the code. `git merge-file` handles these;
  check every conflict by hand.
- **Replacements**: a Creekfolk 1 function or value replaced from a Creekfolk 2 file loaded
  later in the same scope. A merge won't show a conflict for these, so for each one listed
  here, compare Creekfolk 1's new version of the function with the old one and carry the
  change into the replacement by hand.

After a merge: rebuild, run `tools/determinism.cjs` and `tools/month.cjs` (speed per 3
days against the same run on the code before the merge), look at `tools/map.cjs`
pictures, and report what was merged and what was left out.

## Edits in place

| File | Where | What and why |
|---|---|---|
| `creek.js` | `VW`, `VL` | The real-scale valley: 160 by 224 cells (was 80 by 160). |
| `creek.js` | `creekHydro`, before and in the node loop | `cf2BranchStep` runs the branches' water each step; `cf2BranchIn` adds a branch's flow where it joins the creek. |
| `core.js` | `obstacles`, `doorPoint` | A home's and the meeting place's footprint, and the door, scale with `CF2_SCALE.build`. |
| `core.js` | `createWorld` | The village starts by the spring (`cf2MeadowSpot`); counts of trees, bushes, reeds, stones, clay, glowcaps, logs and boulders scale with the valley (`cf2Count`); the "near the meadow" radii scale with `CF2_SCALE.build`; founders know what's within `15 * CF2_SCALE.see` m. |
| `grove.js` (3C) | `groveSpotOK`, `groveSpot`, `groveFell` | The memorial grove at real scale: every length is Creekfolk 1's times `CF2_SCALE.build` (clearance round structures, room round logs, the kin neighbourhood, the rings round a family's tree, the search grid, "beside a log", "near the family", the spiral when the grove is full, a fallen tree's length and girth and the room it looks for); the per-metre weights in the scores are divided by it, so the grove is the same layout, scaled. (`GROVE.space` and `GROVE.reach` are values, below.) |
| `grove.js` (3C) | `groveFell` | A founder's tree: "one of the first eight" (`numberWord(LIFE.founders)`; Creekfolk 1: "the first five"). |
| `grove.js` (3C) | `goatKids` | Who remembers a kid's birth: within `30 * CF2_SCALE.see` m. |
| `skycal.js` (3C) | `skycalSite` | The sky stones look for room `(8 + i/8) * CF2_SCALE.build` m from the village centre. |
| `skycal.js` (3C) | `skycalOption` | Where they stand on midwinter morning, behind the (scaled) stones: the offsets times `CF2_SCALE.build`. |
| `skycal.js` (3C) | `skycalDone` | Witnesses of the finished stones: within `30 * CF2_SCALE.see` m. |
| `beavers.js` (3C) | `beaversArrive` | Witnesses of the beavers' coming: within `25 * CF2_SCALE.see` m. |
| `beavers.js` (3C) | `beaverSmallSite` | Sites for the little side dams are looked for across the whole (wider) floor: the offset from the creek times `CF2_SCALE.floor`. |
| `minds.js` (3C part) | `returneeStays` | Witnesses of a homecoming: within `25 * CF2_SCALE.see` m. |
| `minds.js` (3C part) | `storyText`, case `fishrun` | The glowing fish swim "on up toward the old valley" (DECISIONS.md #5; Creekfolk 1: "all the way to the spring", which in Creekfolk 2 would be the spring branch inside the valley). |
| `returning.js` (3C) | `returningPhase` (fish only), `ACTIONS.watchfish` | The same, in the log lines and the memory; the memory says "I sat on the bank" (a fish run with no festival sets no lanterns). |

## Replacements

| What | Replaced in | How | Why |
|---|---|---|---|
| `Terrain` (core.js) | `cf2-valley.js` | Whole class, same interface | The new valley: one height function at real scale, the bluff, the ledge, the branches carved in. Methods kept from Creekfolk 1 where the shape allows (`section`, `secOf`, `fpAt`, `hwOf`, `heightAt`, `uncarvedAt`, `randomPoint`, `waterSpan`); `walkable` also keeps off the bluff and out of the spring pool. A change to Creekfolk 1's Terrain must be carried over by hand (3C changed nothing in it). |
| `creekBuildNodes` (creek.js) | `cf2-valley.js` (`cf2BuildNodes`) | Wraps it: Creekfolk 1's nodes, then this valley's cutting-down, the ledge, the branches' drained area | (3C changed nothing in it.) |
| `creekCellWater` (creek.js) | `cf2-branches.js` | Wraps it (runs it, then the cells along a branch with water stay wet) | The spring branch keeps its banks green all year. 3C added the beavers' side-dam water (`beaverPondLevels`) inside the original; the wrapper runs the original, so it is carried, and the branch only ever raises the table further. |
| `witnessesNear` (minds.js), `lookAround` (core.js) | `cf2-scale.js` | Wraps them (radius times `CF2_SCALE.see`) | Person-sized creekfolk see further. (3C changed neither; its own inline witness radii are scaled in place, above.) |
| `STRUCTURES[*].radius` (core.js and 3C's `skycal.js`, `returning.js`) | `cf2-scale.js` | Times `CF2_SCALE.build` (not dams or crossings) | Homes and the rest for person-sized creekfolk. 3C's sky stones (2.6 m, so 3.9) and procession path load before `cf2-scale.js`, so they are scaled too. 3C's new home and garden levels (porch, hearth, fourth bed) add levels, not sizes. |
| `SKYCAL.radius` (skycal.js) | `cf2-scale.js` | Value: the scaled `STRUCTURES.skycal.radius` | The room the stones look for matches the stones. |
| `GROVE.space`, `GROVE.reach` (grove.js) | `cf2-scale.js` | Values, times `CF2_SCALE.build` (2.55 m between trunks, 28.5 m from the centre) | The grove at real scale (with the edits in place above). |
| `BEAVER.smallDams` (beavers.js) | `cf2-scale.js` | Value, `cf2Count(12)` = 29 | The bigger floor has room for as many more of the beavers' little side dams as it has more of everything else. |
| `LIFE.founders`, `founderAges`, `elderDays`, `lifespanDays` (life.js) | `cf2-life.js` | Values | Eight founders; stages for the one-month arc (Phase 2 tunes them). 3C's grove takes "the founders" as the first `LIFE.founders` of generation 0, so all eight founders' trees are the grove's giants. |
| `newValley` (hooks.js), `storyText` (minds.js), case `founding` | `cf2-life.js` | Wraps them: the first line of the history, and the founding story, say they came down the creek from the old valley | Decision 6. Creekfolk 1's founders woke from nowhere ("small creatures woke up in a meadow"). The rest of `storyText` is Creekfolk 1's. |
| `templeCanStart`, `springTick` (temple.js), `TEMPLE.greatDay` | `cf2-belief.js` | No temple, no Hall of the Ancestors, no journey to the spring | Creekfolk 2 leaves the temple out; nothing is paced by the player. 3C's procession path and the Returning festival both need `w.temple.state === "done"`, so they never happen; what is left of the Returning is the glowing fish run at midwinter (`returningTick`'s "no temple" branch). |
| `worker.js` | not used | Creekfolk 2's worker is `cf2-worker.js` | The simulation runs in the worker all the time, not only for catch-up. |

## Merge history

### 3C (Creekfolk 1 `59d5e4b`, merged 2026-10-21)

Base `8e9ec93`, theirs `59d5e4b`. Full report: `docs/MERGE-3C.md`.

- **Three-way merges:** `core.js`, `creek.js`, `life.js`, `minds.js`, `fauna.js`, `gift.js`,
  `temple.js`, `hooks.js`, `api.js`. No conflicts: Creekfolk 2 had edited only `core.js`
  (obstacles, doorPoint, createWorld) and `creek.js` (VW/VL, creekHydro), and 3C touched
  other lines of both (`core.js`: a concept label, the sky stones' and path's materials, a
  level's `ready`, more than one garden, a dam a beaver is mending, the porch and hearth
  wanted like the room before them, `homeFoundOption`, `homeGardenFor`, upkeep of the
  great projects, `homesTick`, `beaverTick`; `creek.js`: `creekRaiseDam`'s options,
  `beaverPondLevels` in `creekCellWater`). The other seven were unchanged in Creekfolk 2,
  so they are now exactly 3C's (plus the `// CF2:` edits listed above in `minds.js`).
- **New files, copied:** `looks.js`, `homes.js`, `grove.js`, `beavers.js`, `skycal.js`,
  `returning.js` (3C's order, after `temple.js` and before `hooks.js`), with the `// CF2:`
  edits above in `grove.js`, `skycal.js`, `beavers.js` and `returning.js`; `looks.js` and
  `homes.js` unchanged.
- **Replacements checked** against 3C's versions: 3C changed none of `Terrain`,
  `creekBuildNodes`, `witnessesNear`, `lookAround`, `createWorld`, the `LIFE` values,
  `templeCanStart` or `springTick`; it changed `creekCellWater` (carried by the wrapper)
  and added two `STRUCTURES` (scaled by the existing loop).
- **Left out:** the temple, the Hall of the Ancestors, the procession path and the
  Returning festival (all still in the code, never started: see `cf2-belief.js`); 3C's
  view, sound and then-and-now (Creekfolk 2 has its own renderer); 3C's tools.

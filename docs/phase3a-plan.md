# Phase 3A plan: the land

The working design for Phase 3A ("the land" in `PHASE3-CHANGES.md` section 10). It turns the
author's requirements into numbers and interfaces so the work can be split between
instances. Where this plan and `PHASE3-CHANGES.md` disagree, the changes file wins; fix
this plan.

Status of each piece is kept in `docs/HANDOFF.md`, not here.

## What 3A has to deliver (from PHASE3-CHANGES.md)

1. Separate saves per build, and two files per build (`creekfolk.html`, `creekfolk-dev.html`)
   with the dev build's tools (section 1).
2. The 8-day valley year with a wet and a dry season, and drying that is real logic (section 2).
3. A valley 2-3 times longer and somewhat wider; the village at the upstream end on the side
   away from the water; the creek incised and fairly straight; the spring beyond the
   upstream edge (section 3).
4. Creek Care's river model ported and rescaled, with storms as floods, the rule that the
   creek only ever gets better, dams that never wash out, and the new Stage 0 spreading
   (section 3).
5. The creek drawn from the model's numbers; ponds that widen and branch (section 3).
6. "Build downstream first" learned from what the model does (section 3).
7. Capacity = min(shelter, what the land can feed); "the valley can feed about N" and
   "still wet at the driest point" in the village panel (sections 2 and 3).
8. Measurements: catch-up before and after the bigger valley, and on a phone.

Stop and show the author when 3A is done, before 3B.

## Decisions

### Saves and builds
- A build version string, `BUILD_VERSION` (3A uses `"3a"`), set by `tools/build.mjs`.
- IndexedDB name `creekfolk-<version>`; the dev build uses `creekfolk-<version>-dev`.
  Phase 1 and 2 builds used `creekfolk` and are left alone (they are in `releases/`).
- Every save carries `build: BUILD_VERSION`. Importing a file whose `build` differs is
  refused with: "This valley was made in an earlier version of Creekfolk and can't be
  opened here". (Use the same text for a later version; it is the author's wording.)
- The first-Creekfolk localStorage migration is dropped in 3A builds (they never read
  older saves).
- `tools/build.mjs` writes `dist/creekfolk.html` and `dist/creekfolk-dev.html`; the dev
  page defines `DEV_BUILD = true` before the view scripts.
- Dev build: a visible Dev button (works on touch); snapshot to an IndexedDB store
  `snapshots` before every jump (keep the last 10, restore from a list); jumps +1 day,
  +1 week, +1/+3/+6/+12 months, each replayed in full; gift now (ignores the 12-hour wait);
  trigger storm/flood, birth, passing, visitor (beavers and the Returning are added in 3C);
  overlays: wetness, worn paths, channel stage per stretch, land capacity; pause (holds
  `devNow()`); the mind reader (already exists). During long jumps: "keep the screen on"
  note, and a Screen Wake Lock request where the browser offers it. The dev menu shows the
  measured replay speed of the last jump, so the author can read the phone number off
  the phone.

### Time
- `VALLEY_DAY = 3600` s stays. `YEAR_DAYS = 192` valley days (8 real days). Seasons of 48
  valley days: spring (day 0-47), summer, autumn, winter. A new valley begins on the first
  morning of spring.
- Wet season: winter and spring. Dry season: summer and autumn. Rain chance and storm
  chance follow `seasonAt(w).wet` (0..1). Midwinter is day 168.
- `seasonAt(w)` returns `{ name, idx, progress, doy, year, warmth, wet, wetSeason }`.
- Dates read "Day 12 of spring, year 3".
- Each storm is one flood event for the creek model (sized by a return period drawn from
  the creek's own seeded generator).

### The valley grid
- `VW = 80` across (x), `VL = 160` along the creek (z), 1 m cells, `CELLS = VW * VL`.
  Heights on the (VW+1) x (VL+1) vertices. Water flows toward +z. All the old `64`, `63`,
  `65`, `4096` and `32` (centre) literals in `core.js`, `life.js`, `minds.js` and `view.js`
  become these constants.
- Cross-section from the valley axis outward: creek trench | valley floor (bottomland,
  half-width 10-15 m) | a 0.5-0.9 m rise to the terraces | terraces | hills at the rim.
  The "valley floor" in the author's sense is the bottomland. The village, gardens, grove
  and temple live on the terraces.
- `valleyR(x, z)` becomes a rounded-rectangle distance (superellipse, power 4) so the old
  thresholds (walkable < 0.9, hills from 0.82) keep their meaning. The creek passes out
  through gaps at both ends; the spring is upstream of z = 0.
- Village (`world.meadow`) on the terrace at the upstream end (z about 14-34), on the
  side with more room.
- Resources are spread over the longer valley with counts scaled about 2.5x, keeping the
  "near the meadow" ones near the meadow.

### The creek model (`src/sim/creek.js`)
Ported from `ref/creek-care-river-core.js` (`Model`, hydraulics, MPM bedload, Exner,
benches, plants, stages, structures). Not ported: `buildValley`, `CALIB`, `buildDem`,
tributaries, bank retreat that widens the trench, bed lowering, structure washout.

- One main stem, nodes every 2 m from z = -24 to z = VL + 24 (about 104 nodes). The
  centre line is fixed from the seed ("fairly straight": meander amplitude 1.5-2.5 m,
  wavelength 35-50 m). The main channel does not migrate in 3A; sinuosity comes from the
  Stage 0 side channels instead (say so to the author).
- Scale: drained area 0.05 km2 at the upstream end, about 0.065 km2 at the outlet, so the
  natural bankfull channel is about 2.4 m wide and 0.3 m deep. Starting trench 0.95-1.4 m
  deep (incised, Stage II/III), bed slope about 1.4% in the upper third and 0.7% lower down.
- Floods: `Q = k(T) * A^0.8` (Creek Care's `kOfT`), depth from Manning's equation in the
  compound channel. Behind a dam the water is deeper than normal depth, so the energy slope
  drops as (normal depth / pond depth)^(10/3); that is what makes ponds trap gravel.
- **Only builds.** The bed may rise (gravel deposition, fines settling in ponds and on
  vegetated benches) and never fall. No bank retreat. The floodplain rises with overbank
  mud. The bed stays at least 5 cm under the floodplain. Dams never wash out.
- Sediment supply per flood: a valley-year yield of gravel and fines from upstream and the
  valley sides, shared among the year's floods by `k^1.5 * duration`. The yields are the
  main tuning knob for the year arc.
- Benches and plants: Creek Care's vegetated-bar rule and bench growth; willow-planted dam
  banks raise the plant target nearby.
- Stages I-V per node as in Creek Care, plus **0** (Cluer and Thorne 2014) where the bed is
  within about 1.2 natural depths of the floodplain and side channels carry water on the
  floor at that point.

### Dams
- A `dam` structure sits on the node nearest it. Crest above the bed: weir 0.30 m,
  mud-packed dam 0.55 m; willow-planted banks add plants. `multi` goes from 3 to about 14.
- **The drop rule** (where "build downstream first" comes from): a dam can hold water at
  most `dropMax` (0.40 m) above the water just below it. Higher than that, water digs under
  and the pond only fills to `tail + dropMax`. A tall dam on a steep, cut-down stretch with
  nothing below it leaks; once a dam below backs water up to its foot, it holds.
  Creekfolk notice ("the pond won't fill; the water slips out under the dam"), an elder can
  work out why, and the knowledge `downstream` is taught and can be lost. With it they
  choose sites that have water standing below them and raise dams from the bottom of a
  series up.
- **Aging and tending:** dams lose condition as before and leak a little as they wear;
  repair restores them. When the pond behind a dam has silted up (the bed just upstream
  within 12 cm of the crest) the next repair raises the crest 0.12 m, up to 0.35 m above
  the floodplain. Raising above the floodplain is what spreads water across the floor.

### Water through the year (hydrology step every 10 minutes)
- Valley-wide topsoil moisture (rain wets it, warmth dries it): keeps everything green in
  the wet season and nothing in the dry season.
- Inflow from the spring and the upper watershed: a storage that rain fills and that drains
  slowly, plus a small spring flow.
- Per node: channel water level, and the water table under the floor `g`. The incised
  channel is a drain: `g` relaxes toward the channel level fast when the trench is deep and
  slowly when it is shallow. Rain recharges `g`; plants draw it down in the dry season.
  Where `g` is below the bed the creek loses water into its bed, which is why it stops
  flowing in the dry season early on and flows all year once the bed is raised.
- Ponds are reservoirs: inflow fills them, they spill over the crest when full, and they
  lose water to evaporation and seepage in the dry season. A pond in a drained valley
  shrinks to a small pool by the end of the dry season.
- Per cell: water table `WT = wl + (g - wl)(1 - e^(-d/3 m))` (d = distance from the
  channel edge). A pond above the floodplain floods the floor at its level. Depth to water
  `dw = ground - WT` gives open water (dw < 0), marsh (< 0.15 m), green (< about 1 m with
  roots), otherwise green only while the topsoil is moist. `world.wet` (marsh, lagged as
  before) and a derived greenness grid drive the colours.
- "Still wet at the driest point": the lowest share of valley-floor cells that are marsh
  or open water during each valley year's dry season, recorded at the first winter rains.

### Stage 0 spreading (the biggest new piece)
- On every flood, where the water goes over the bank, the overbank flow is routed across
  the floor cell by cell (steepest descent down-valley on the floor surface, seeded
  tie-breaks) and each cell's flow is added up. Cells that carry flow are carved a little
  deeper (`chan`, up to 0.3 m), so paths reinforce themselves into side channels; mud is
  left where the flow is slow.
- Because the floor has micro-relief (about plus or minus 0.12 m) and carved channels, a
  rising water table shows first as threads of water in the channels, then ponds in the
  hollows, then marsh across the floor. That is the multi-channel valley-floor wetland.

### Capacity
`valleyCapacity = min(shelter, feed)`. Shelter is the current formula. Feed starts at 20 and
rises to 36 with the creek's health: still-wet-at-driest share, healed share of the creek
(stages V and 0), full ponds, and gardens within reach of the water table. The village
panel shows "the valley can feed about N".

### Drawing (`view.js`)
- Ground: heights come from `terrain.h`, rebuilt from the model after each flood
  (`terrain.version` bumps). Cell colours from cell type (bed, cut bank, floor, terrace,
  hills) crossed with greenness, marsh and wear.
- Water: the main channel as a ribbon whose width and height come from each node's water
  level (no water where the creek has stopped); ponds as flat water at the pond level; water
  on the floor as one mesh over the cells where the water table is above the ground, so the
  shoreline follows the micro-relief and the carved channels.
- Camera limits, shadow camera and fog follow the bigger valley.

### Year arc to tune against (PHASE3-CHANGES section 4)

| Real time | Creek | Still wet at the driest point | Village |
|---|---|---|---|
| Week 1 | incised, stops flowing each dry season | nothing | 5 founders |
| Weeks 1-3 | first dam, a pool survives the dry season | one pool and a little green | |
| Months 1-2 | several dams and ponds, bed starts filling | pools only | about 20 |
| Months 2-4 | floodplain reconnects in stretches | patches of marsh | |
| Months 4-6 | most of the floor is wetland | most of it | close to 36 |
| Months 6-9 | many channels | the whole floor, all year | |

A real year is about 45 valley years and, at about 8 storms per wet season, about 350 floods.

## Interfaces (for splitting the work)

- `creek.js` exports (shared scope): `VW, VL, CELLS`, `creekInit(world)`,
  `creekStorm(world)` (called when a storm starts), `creekHydro(world)` (every 10 minutes),
  `creekDamChanged(world, structure)`, `creekSave(creek)`, `creekLoad(obj)`,
  `creekWaterAt(world, x, z)` (water surface or null), `creekStageAt(world, z)`,
  `creekFeed(world)`, `creekDriest(world)`, and per-node data for drawing
  (`world.creek.nodes[i]`: `z, x, bed, fp, wb, m, bw, bz, wl, q, stage`).
- `Terrain` keeps its API (`creekX, creekHW, edgeDist, side, isWater, valleyR, heightAt,
  walkable, bankPoint, randomPoint, waterSpan`) and adds `setCreek(creek)` and `version`.
- Derived per-cell grids (not saved, rebuilt after load): `world.wt` (water table),
  `world.green`. Saved: `world.wet`, `world.wear`, `world.creek` (with `chan` as a sparse
  grid).
- `seasonAt(world)` as above.

## Measurements to report
- Catch-up: 30 valley-days of a full valley (36) in the browser, Phase 2 build vs 3A build
  (`tools/bench-browser.mjs`). Phase 1 measured 4.1 minutes.
- Phone: CPU-throttled Chromium as an estimate, clearly labelled, plus the number the dev
  build shows on the author's phone.
- Year arc: headless runs (`tools/year.cjs`) with the creek metrics per month.
- Determinism with floods and dams.

## What changed while building it
- **Loose gravel can move on.** With a strict "never scour" rule, small floods dropped
  gravel that big floods could never move, so an undammed creek filled itself up. Now a
  flood can carry on gravel an earlier flood left loose, but never digs below what has
  settled for good (`bedMin`; deposits settle quickly in still water or among plants).
  The creek still only gets better.
- **Ponds are reservoirs with their own basins.** Water reaching any node of a dam's
  basin goes into the pond; the pond spills when full and shrinks through the dry season
  (evaporation 1.1 mm and seepage 0.4 mm per valley day, chosen so a first pool survives).
- **The hills' slow water** (`CREEK.hillFill`, `hillTau`): the wet season's rain is given
  back to the floor over about 70 valley days. A cut-down creek drains it at once (and a
  bare gravel bed lets it sink away), so the valley still dries; a healed floor holds it,
  which is what lets it stay marshy through the dry season.
- **Climbing from the bottom.** A silted dam that would leak if raised asks the dam below
  it to be raised first; the lowest dam of a series gets a stone apron below it. Without
  this the bottom dam capped the whole series.
- **Raised ponds stay shallow over the floor** (`raiseAbove` 0.1 m): higher, the floor
  became a lake instead of a marsh.
- **Gardens** go at the edge of the valley floor near home; the old rule (within 7 m of
  the creek) found no sites in the new valley.
- **Determinism rule:** every change to the creek ends with `creekRefresh()`, and the
  world keeps the `build` key in a fixed place, so a reload is exact.
- **Deposits are shared along the creek** (`creekShareDeposit`). A flood used to drop up
  to 12 cm on a single 2 m node. Each node's slope comes from the node below it, so a
  bump starved the node above it, which filled too, and since deposits never wash out
  the bed grew into a sawtooth (the bed swinging 0.7 m node to node by day 210, the floor
  stepping in 2 m strips that drew as bands across the valley). Now each flood's gravel
  and mud are shared with the neighbouring nodes (3 either way, never across a dam) and
  the mud left on the floor with 6 either way. `creekBumpiness()` measures it; the lab
  and the year runner print it as `rough`/`bumpy` (bed / floor, metres).
- **The floor has relief** (about +-0.17 m: long swales down the valley, hummocks), ponds
  above the floor spread over connected lower ground by flood fill (`creekPondFloor`), and
  the floor's water table is blended between nodes, so water on the floor follows hollows
  instead of filling 2 m strips.
- **The real cause of the sawtooth** was the slope: each node's slope was clamped to
  0.3-2.5 times the five-node average, and a three-node sawtooth drives that average
  toward zero at its humps, so humps looked flat and caught more gravel while pools
  looked steep and never filled. Now the average never falls below half the floor's own
  (smooth) slope, and water can't stand lower than the water just below it, so a pool
  behind a hump is slack water like a dam's pond. Pools fill, humps don't, and a bumpy
  bed smooths itself out (the undammed lab: bed bumpiness 0.10 m at day 50, 0.002 m by
  day 200). A side effect: an undammed creek now heals slowly by itself (15% of the
  floor wet at the driest by day 200, against 82% with the lab's dams).

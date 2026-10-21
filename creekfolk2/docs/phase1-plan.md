# Phase 1 plan: the foundation

What Phase 1 delivers, from the brief: a plain-language account of how Creekfolk 1's minds
and creek work and what comes over; the new valley at real scale on What the Water Brings'
renderer; Creekfolk 1's simulation (creek, water, seasons, minds, saves, catch-up, dev
build) running on it; the zoom from dots to faces; offline only, with the clock guards;
catch-up benchmarked and determinism proven. `DECISIONS.md` wins over this plan.

## Layout

```
creekfolk2/
  CLAUDE.md, README.md, package.json (three 0.186.0, esbuild, playwright)
  docs/      BRIEF, DECISIONS, MERGE (every shared function changed), this plan, PHASE1 report
  src/sim/   Creekfolk 1's simulation, copied at commit 8e9ec93 (3B), plus Creekfolk 2's own files
  src/look/  What the Water Brings' renderer, ported to three.js r186
  src/view/  the valley drawn from the simulation, the zoom, HUD, panels, saves, dev menu, boot
  vendor/    three.js r186 as one classic script (built from npm three@0.186.0)
  tools/     build, determinism, month runner, benchmarks, screenshots, browser tests
  releases/  the playable build of each finished phase (never rebuilt)
```

## The simulation

- **Copied, then changed as little as possible.** Creekfolk 1's `src/sim/` comes over whole
  at `8e9ec93`. Small edits in place are marked `// CF2:`; a function replaced outright is
  replaced from a Creekfolk 2 file (loaded later in the same scope) and listed in
  `docs/MERGE.md`, so 3C can be merged with that commit as the base. Belief, gifts and the
  temple stay in the code but do nothing in Phase 1 (no gift is offered, the temple and the
  Hall of the Ancestors never start); Phase 3 turns belief into treasures.
- **The valley, at real scale.** The grid becomes 160 m across by 224 m along the creek
  (1 m cells; it was 80 by 160), about What the Water Brings' size. Same axes as
  Creekfolk 1 (x across, z along, the creek flows toward +z). A new `Terrain` (Creekfolk 2
  file) gives one height function: the creek's trench from the model, the valley floor,
  terraces, hills at the rim, a limestone ledge, and two branches:
  - **the Dry Fork**, a side channel off the hills: dry most days, a torrent in a storm;
  - **the spring branch**, fed by a spring under the valley side: it never dries.
  The branches have fixed channels and their own water (flow, level), and add their water
  and drained area to the main creek; the main creek is where healing happens.
- **Real-scale creekfolk.** Creekfolk 1's creekfolk are about 0.6 m tall beside a 2.4 m
  creek; Creekfolk 2's are person-sized (about 1.5 m) beside a creek of the same size. So
  the creek, dams and water keep their sizes; homes, gardens, the village's layout, how far
  they see and who counts as a witness are scaled up for bigger bodies and a bigger valley.
- **Eight founders** arrive as young adults (Phase 2 tunes life stages to the month and
  gives them their culture).
- **The simulation lives in a Web Worker.** The worker owns the world: it runs it live to
  the clock, catches up after a gap, saves to IndexedDB, and sends the page what it needs
  to draw (each creekfolk's current action and path, so the page moves them smoothly;
  structures, plants and materials when they change; the ground and creek after each
  flood; water and green every ten minutes; the weather; the log). Panels that read a
  whole mind (the mind reader, the village sheet) ask the worker for a copy of the world.

## The look

- **The port first.** What the Water Brings' renderer (`core`, `toon`, `toon2`, `skin`,
  `king3` rig and clips, `pixel3d`, `valley`, `life`) moves to three.js r186 in
  `src/look/`, checked by building What the Water Brings itself both ways and comparing
  screenshots of the same spots and hours until they match. Known traps are in
  `DECISIONS.md` (12).
- **Then the valley.** Ground from the simulation's height function plus fine detail that
  only the renderer adds; the creek's channel from the model's nodes (curves with
  cross-sections), its water at each node's own level; ponds, floor water and side
  channels from the water table; ground colour from green and wet; trees, plants and
  materials from the simulation; structures (simple shapes in Phase 1, at real scale).
  Near tiles at full detail, rebuilt within a time budget after floods; a light far
  version of the whole valley always there.
- **Creekfolk** built like the Sheet king (simple solids on the shared rig, the "Little
  king" proportions), with new clips (carry, build, sit, sleep, chat, wade).
- **The zoom.** From the air: the far valley with each creekfolk a dot in its family's
  colour. Nearer: small sprites. Close: the full creekfolk. Zoom changes only what is drawn.
  Follow one creekfolk; a slowly drifting ambient camera.

## The rules

- **Offline.** No network requests; fonts embedded from files kept in the repo.
- **Two files:** `creekfolk2.html` and `creekfolk2-dev.html` (a Dev button that works on a
  phone). Each build has its own IndexedDB database, `creekfolk2-<BUILD_VERSION>` (dev:
  `-dev`); other versions' saves and Creekfolk 1's are refused with a clear message.
- **The clock.** Backward: the valley waits until the clock passes its last moment. More
  than about 90 days forward: ask before replaying (or treat the clock as wrong and carry
  on from where the valley was). Settings: set the valley's clock (for a machine whose
  clock is wrong), export and import a backup file.
- **Dev build** as in Creekfolk 1: its own storage, a snapshot before every jump, jumps,
  events, overlays, pause, the mind reader, "30 days would take about N min here".

## Tests and measurements

- `tools/determinism.cjs`: live, replayed in uneven slices, and saved and reloaded give
  the same state hash.
- `tools/month.cjs`: whole months headless, every moment, with the numbers that matter.
- Catch-up of 30 days in Node and in the browser (laptop target well under 30 minutes;
  the phone figure is whatever the dev build reports on a phone, which I can't measure).
- Browser tests: a new valley, a jump through the worker, reload, the dev build's tools,
  the clock guards, import refusal.
- Screenshots of every zoom level, hour and season, looked at one by one.

## Order of work

1. Skeleton, build, sim copied, Node tests passing on Creekfolk 1's valley as it was.
2. In parallel: the r186 port with screenshot comparison (helper), and the new valley in
   the simulation (terrain, branches, scale, eight founders), with the month runner.
3. The live worker, saves, clock guards.
4. The valley view on the ported renderer; creekfolk; the zoom.
5. HUD, panels, dev menu, settings.
6. Benchmarks, browser tests, screenshots, the report (`docs/PHASE1.md`).

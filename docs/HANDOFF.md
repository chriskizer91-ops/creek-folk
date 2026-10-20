# Picking up Creekfolk

This file is for a Claude instance (or anyone) taking over part of the work. Keep the
"Where things stand" section current whenever you stop: it is how the next instance knows
what is done.

## Read first, in this order
1. `CLAUDE.md`: architecture, time model, saves, tests. Claude Code loads it automatically.
2. `docs/BRIEF.md`: the author's original brief and the phase plan.
3. `docs/PHASE1.md`, `docs/PHASE2.md`: what was built and measured in each phase.
4. `docs/PHASE3-CHANGES.md`: the author's changes before Phase 3. **It wins over the brief
   wherever they disagree.**
5. The plan for the part you are on, e.g. `docs/phase3a-plan.md`.

## Where things stand
_Last updated: 2026-10-20, Phase 3A built; being measured before showing the author._

| Part | State | Branch |
|---|---|---|
| Phase 1: foundation | done, shown to the author | `main` (`releases/creekfolk-phase1.html`) |
| Phase 2: minds | done, shown to the author | `main` (`releases/creekfolk-phase2.html`) |
| Phase 3A: the land | built; final measurements and report in progress | `phase-3a` |
| Phase 3B: belief and the temple | not started | |
| Phase 3C: life and the ending | not started | |
| Phase 4: visuals | not started | |
| Phase 5: year tests (two years) | not started | |

Phase 3A pieces (details in `docs/phase3a-plan.md`, results in `docs/PHASE3A.md`):

| Piece | State |
|---|---|
| Versioned saves, two builds, dev build tools | done (`store.js`, `dev.js`, `build.mjs`); tested in `tools/browser-dev.mjs` |
| 8-day year, wet and dry seasons, seasonal weather | done (`calendar.js`, `changeWeather`) |
| Bigger valley grid (80 x 160) and new terrain | done (`Terrain` in `core.js`) |
| Creek model port (`src/sim/creek.js`) and lab harness | done; `tools/creek-lab.cjs` |
| Hydrology: drying, ponds through the dry season, water table, wet-at-driest | done |
| Stage 0 spreading | done (`creekSpread`); look will be refined in Phase 4 |
| Dams on the model, drop rule, "downstream first" knowledge, raising, aprons | done |
| Capacity from the creek, village panel Land tab | done |
| Drawing the creek, ponds and floor water from the model | done (`src/view/land.js`) |
| Measurements, determinism, year-arc runs, screenshots, report | in progress |

Known gaps left for later parts: beavers and the Returning (3C; the dev menu has
disabled buttons for them), the sky calendar (no sky calendar exists yet;
`daysToMidwinter()` is ready for it), the creek's main channel does not migrate.

## Rules the author has set
- Finish a part, then **stop and show the author** before starting the next part.
- At each stop: the playable HTML (both files), what changed, what you'd do next, and what
  you couldn't test. Say what you tested directly and what you are inferring. Don't round up.
- The valley never fails. Gifts help, never gate. The creek only ever gets better.
- Every moment is simulated in full; no coarse mode, no fast-forward for the player.
- Each build has its own saves; never read an older build's saves.
- Plain language in anything the player reads; creekfolk are "they".
- One self-contained HTML file per build, no network requests.

## Splitting the work
The simulation is one shared scope (files concatenated by `tools/build.mjs`), so two people
editing the same file will collide. Split by file and agree interfaces first.

- One branch per piece, named `<part>/<piece>` (for example `3a/creek-model`), branched
  from and merged back into the part's branch (`phase-3a`). Merge `main` only when the
  author has seen the part.
- Before merging: `npm test` (build plus determinism) must pass. Add `node tools/year.cjs`
  runs when the change touches lives, minds, the creek or capacity.
- Pieces that can run in parallel in 3A, once the interfaces in the plan are fixed:
  - builds, saves and dev tools: `tools/build.mjs`, `src/view/store.js`, `src/view/dev.js`,
    `src/view/catchup.js`
  - the creek model and its lab harness: `src/sim/creek.js`, `tools/creek-lab.cjs` (Node
    only, no view)
  - calendar and weather: `src/sim/calendar.js`, `changeWeather` in `src/sim/core.js`
  - drawing: `src/view/view.js` (`GroundView`, `WaterView`), after the terrain API exists
- New recovered-file edits (`core.js`, `view.js`) are marked with a short comment naming the
  phase (`// LIFE:`, `// MINDS:`, `// CREEK:`), so the original code stays recognisable.

## Determinism contract
Everything random in the simulation comes from `world.rng` (or a seeded generator saved
with the world, like the creek's). Never use `Math.random()` or `Date.now()` in `src/sim/`.
`tools/determinism.cjs` replays a valley three ways and compares state hashes; run it after
any sim change.

## Commits
End commit messages with the trailer lines the session gives you (Co-Authored-By and the
session link). Write messages that say what changed for the valley, not just which file.

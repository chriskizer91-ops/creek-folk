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
_Last updated: 2026-10-21, Phase 3C done and shown to the author (`docs/PHASE3C.md`); Phase 4 not started._

| Part | State | Branch |
|---|---|---|
| Phase 1: foundation | done, shown to the author | `main` (`releases/creekfolk-phase1.html`) |
| Phase 2: minds | done, shown to the author | `main` (`releases/creekfolk-phase2.html`) |
| Phase 3A: the land | done, shown to the author (`docs/PHASE3A.md`); merged | `main` |
| Phase 3B: belief and the temple | done, shown to the author (`docs/PHASE3B.md`, plan and changes in `docs/phase3b-plan.md`); merged | `main` (`releases/creekfolk-phase3b.html`) |
| Phase 3C: life and the ending | done, shown to the author (`docs/PHASE3C.md`, plan and changes in `docs/phase3c-plan.md`); not merged until the author has seen it | `phase-3c` (`releases/creekfolk-phase3c.html`) |
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
| Measurements, determinism, year-arc runs, screenshots, report | done (`docs/PHASE3A.md`, `runs/p3a-arc7.txt`) |

Known gaps left for later parts: beavers and the Returning (3C; the dev menu has
disabled buttons for them), the sky calendar (no sky calendar exists yet;
`daysToMidwinter()` is ready for it), the creek's main channel does not migrate, the
population swings between about 17 and 31 while the land feeds 33 (births and leaving;
tune in 3C), phone catch-up not measured. After any change to `creek.js`, check
`creekBumpiness()` in the creek lab: a growing bed or floor number means a sawtooth.

Phase 3B pieces (details in `docs/phase3b-plan.md`, results in `docs/PHASE3B.md`):

| Piece | State |
|---|---|
| The creek as the giver, doubters, the Giving Place | done (`gift.js`) |
| Requests, keeping watch, offerings, notches, resting and the lantern, rhythm wording | done (`gift.js`); belief while away tested with `tools/away-test.cjs` |
| 17 gifts in four groups; living things (`fauna.js`) | done; every gift tested in the browser (`tools/browser-gifts.mjs`) |
| The temple: start rule, pace, 36 parts, timber, curing, dry season, carvings | done (`temple.js`); year runs for five rhythms plus slowing and pausing (`docs/runs-3b/`) |
| Hall of the Ancestors for valleys with no giver | done (`temple.js`) |
| The spring (news, the journey, water brought back) | done (`temple.js`) |
| The one who believes in you, the wave | done (`gift.js`, `belief-view.js`) |
| Drawing: the temple and hall by part, animals, flowers, offerings, lantern, snow, stars, rainbow; the Temple tab | done (`belief-view.js`); simple shapes, art is Phase 4 |

Known gaps after 3B: daily givers finish in month 9 rather than "about month 10" (the pace
table's 1.2; see the report); a player who only ever gives every four days gets the Hall of
the Ancestors, never the temple (the start rule); beavers, goats breeding, the Returning,
the sky calendar, then-and-now, the soundscape and two-year limits are 3C.

Phase 3C pieces (details in `docs/phase3c-plan.md`, results in `docs/PHASE3C.md`; built by
the lead and four helpers on branches `3c/looks`, `3c/homes`, `3c/sound`, `3c/grove`, all
merged into `phase-3c`):

| Piece | State |
|---|---|
| Looks traced through families, things to wear, the three ages, treasures | done (`looks.js`, `looks-view.js`); `tools/looks-family.cjs` |
| Homes: doors, decorations, porch and hearth, gardens, place markers, far scenery | done (`homes.js`, `homes-view.js`) |
| The grove (kinds by family, growth, nurse logs, bounded), goats' kids and wool, butterflies, herons, mist | done (`grove.js`, `life-view.js`); `tools/grove-test.cjs` |
| Soundscape that follows the wetland; then and now | done (`soundscape.js`, `thennow.js`); sound measured offline only |
| Beavers: arrival, lodge, kits, dam-tending, side dams that hold water | done (`beavers.js`, `beavers-view.js`) |
| The sky stones | done (`skycal.js`) |
| The procession path, the Returning every midwinter, lanterns, carvings, verses, the fish run without a temple | done (`returning.js`, `returning-view.js`) |
| Coming home, news of the next valley, legends | done (`minds.js`) |
| Year runs to day 390 (month 13), checks, benchmark, report | done (`docs/runs-3c/`, `docs/PHASE3C.md`) |

Known gaps after 3C: nobody has listened to the sound, and there are no beaver or Returning
sounds; the game's camera can't see the far scenery; verses are short labels; a valley given
a gift every four days gets only the fish run, never a Returning; catch-up is about a quarter
slower than 3B (6.7 min for 30 days from day 300, against 5.2); phones not measured; two-year
runs not made (to day 390 only). Pictures in `docs/img/3c-*.jpg`.

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

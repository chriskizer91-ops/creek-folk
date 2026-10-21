# Creekfolk 2: the Leavers

Eight young creekfolk leave the first valley, follow the creek downstream to a new one, and
spend one real month, their lifetime, healing its cut-down creek into a wetland. Then their
descendants live on in the finished valley, forever. The player mostly watches.

This folder is Creekfolk 2. The rest of the repository is Creekfolk 1 (`../CLAUDE.md`), whose
simulation Creekfolk 2 started from. Read, in this order: `docs/BRIEF.md` (the author's brief),
`docs/DECISIONS.md` (what was decided since; **it wins over the brief**), `docs/HOW-CREEKFOLK-WORKS.md`
(Creekfolk 1's minds and creek in plain words), the plan for the current phase (`docs/phase1-plan.md`),
and `docs/MERGE.md` before touching any of Creekfolk 1's files.

## Build and run

```
npm install                     # in this folder (esbuild, playwright, three 0.186.0)
node tools/build.mjs            # dist/creekfolk2.html, dist/creekfolk2-dev.html (minified), dist/sim.cjs
node tools/build.mjs --dev      # the same, unminified
node tools/vendor-three.mjs     # only to change three.js: vendor/three-r186.js from npm
```

Every build makes two self-contained pages: `creekfolk2.html` (the game; the dev menu is hidden
behind Ctrl+Shift+D or `#dev`) and `creekfolk2-dev.html` (a visible Dev button that works on a
phone, and its own saves). `BUILD_VERSION` in `tools/build.mjs` names the build (`cf2-1` is
Phase 1); bump it for every build handed to the author, because each build keeps its own saves.
No page ever makes a network request: three.js and the fonts (`assets/fonts`, OFL) are embedded.

## Architecture

All source files share one scope: the build concatenates them in the order listed in
`tools/build.mjs`, inside one function. Later files can use (and replace) names from earlier ones.

- **The worker** (`src/sim/*.js` + `src/sim/cf2-worker.js`, embedded in the page as `#sim-src`
  and started from a Blob) owns the valley. It runs it live to the clock, replays any gap in full,
  saves to IndexedDB, and sends the page what it needs to draw (`cwSendState`): each creekfolk's
  action with its path (the page moves them along it), structures/plants/materials when they
  change (JSON-compared, twice a second), the creek's shape when `terrain.version` bumps, the
  water every ten minutes, the weather and the log. It also answers `getWorld` with a whole save.
- **The page** (`src/view/*.js`, plus the same simulation files for the Terrain, the calendar and
  the panels' text, plus `vendor/three-r186.js`) never runs the simulation. `VWorld` is its copy of
  what to draw (it rebuilds the same ground from the same seed with the same code); the renderer
  draws it; `Hud` and `DevMenu` are the interface; the village and mind sheets load a full copy of
  the world (`app.worldCopy()`) with the simulation's own `loadWorld`.
- **Creekfolk 1's simulation** (`core.js`, `calendar.js`, `creek.js`, `life.js`, `minds.js`,
  `fauna.js`, `gift.js`, `temple.js`, `hooks.js`, `api.js`) was copied at commit `8e9ec93` (3B),
  and Creekfolk 1's 3C was merged in from commit `59d5e4b` (with its new files below; report in
  `docs/MERGE-3C.md`). Creekfolk 2's own logic goes in `src/sim/cf2-*.js`, loaded after them.
  Edits inside Creekfolk 1's files are marked `// CF2:`; replaced or wrapped functions are listed
  in `docs/MERGE.md`. Keep both lists exact: they are how anything later from Creekfolk 1 gets
  merged in (base `59d5e4b`).

| Creekfolk 1 file (from 3C) | What it is |
|---|---|
| `src/sim/looks.js` | Inherited looks: 24 fur colours in a ring, coat patterns, face markings, pale paws, the colour of what they wear, what grown-ups wear for their passion (`creature.look`, `looksOf`, `looksText`, `looksWorn`); believers wear their treasure (`c.treasure`). |
| `src/sim/homes.js` | Doors and decorations by the door from what the owner loves (`home.deco`), the porch and hearth levels (comfort, not room), the fourth garden bed, a second and third garden. |
| `src/sim/grove.js` | The memorial grove: tree kinds by family, growth all year (`groveSize`), nurse logs (`world.grove.logs`), bounded (240 standing, 24 logs); goats' kids, old goats, wool blankets. Scaled to real size in place (`// CF2:`). |
| `src/sim/beavers.js` | The beavers (`world.beavers`): arrival (3C's rule: after day 120 with 55% wet at the driest, or by day 210), the lodge in the deepest pond, kits, tending and raising dams, little side dams on the floor that hold water. |
| `src/sim/skycal.js` | The sky stones on the terrace after the first midwinter (`world.skycal`, structure `skycal`); meeting there on midwinter morning. |
| `src/sim/returning.js` | The Returning (needs a finished temple, so never in Creekfolk 2) and the glowing fish run at midwinter once the creek has healed (`world.returning`); the 3C hooks (`lifeTick3C`, `lifeOptions3C`, `devTrigger3C`, `partDone3C`). |

| Creekfolk 2 file | What it is |
|---|---|
| `src/sim/cf2-valley.js` | The real-scale valley (replaces Creekfolk 1's `Terrain`): 160 x 224 m, one height function, floor, terraces, the limestone bluff, the ledge across the creek, the creek's starting nodes. Tunables in `CF2_VALLEY`. |
| `src/sim/cf2-branches.js` | The Dry Fork and the spring branch: laid out, carved, their water (`world.creek.br`), the cells along them. Tunables in `CF2_BRANCH`. |
| `src/sim/cf2-scale.js` | Real scale: homes and the village for person-sized creekfolk, counts of things in the bigger valley, how far they notice; 3C's grove, sky stones and the beavers' side dams at this scale. `CF2_SCALE`. |
| `src/sim/cf2-life.js` | Eight founders; life stages for the one-month arc. |
| `src/sim/cf2-belief.js` | Belief asleep for now; no temple, no Hall of the Ancestors, no journey to the spring (so no procession path or Returning festival either). |
| `src/sim/cf2-api.js` | What Creekfolk 2 adds to `CreekSim`. |
| `src/sim/cf2-worker.js` | The worker: live running, catch-up, saves, the clock guards, messages. |
| `src/view/clock.js` | The page's clock: `devNow()`, the player's correction, the dev offset, the database name. |
| `src/view/vworld.js` | The page's copy of the valley. |
| `src/view/words.js`, `sheets.js` | Plain words about creekfolk (from Creekfolk 1's interface); the village and mind sheets. |
| `src/view/hud.js` | The interface: clock chip, log line, catching up, the clock's questions, settings, backups, sheets. |
| `src/view/dev.js` | The developer menu. |
| `src/view/mapview.js` | The valley from above on a 2D canvas: the fallback without WebGL2. |
| `src/view/look-glue.js` | How the view uses the ported renderer: colour management off, sRGB output, light intensities times pi (`CF2_LIGHT`). |
| `src/view/sprites.js` | Creekfolk as pixel sprites for the middle of the zoom (What the Map Forgot's letter grids): Creekfolk 1's 24 furs (`CF2_FUR`), coats, faces, pale paws, the dyes (`CF2_DYE`) and what they wear (`CF2_WEAR`), and each family line's cloth pattern (`clothOf`, view only). Also `familyColour` (dots, the map). |
| `src/view/valley3d.js` | The valley in 3D (`CF2Valley.create(vw)`), What the Water Brings' way: 32 m tiles (a far version always, near ones at full detail streamed round the view), ground typed from the simulation's grids read smoothly, the creek's ribbon, standing water as a smooth sheet, the branches carved from their own lines, trees and plants, the bluff's rock, homes and every other structure level by level (and while being built), dams, 3C's things (doors, porches, hearths, decorations, the grove and its nurse logs, sky stones, the lodge). `W.height`, `W.water`, `W.paint`. |
| `src/view/beasts3d.js` | The simulation's animals: the beavers swimming, the glowing fish run. |
| `src/view/folk3d.js` | Creekfolk close up, built like the Sheet king on the shared rig: their looks, the family's cloth (a pattern shader), what they wear, what they carry, and what they are doing laid over the rig's walk, sit and idle clips. |
| `src/view/view3d.js` | The 3D view: renderer, orthographic camera, input, the zoom (dots, sprites, close-up creekfolk), the light through the day and the weather (What the Water Brings' tables), the cut-out round a followed creekfolk. |
| `src/view/app.js`, `boot.js` | The worker connection and the drawing loop; start-up. |
| `src/look/` | What the Water Brings' renderer ported to three.js r186 (see `docs/R186-PORT.md`). Creekfolk 2 adds one thing, marked `// CF2:`: `PKPixel3D.create(.., { lut: true })` snaps colours with a table built once on the GPU instead of searching the palette per pixel. |
| `ref/` | The author's other games, kept whole as reference. Never edit; never build from. |

## The valley

- The grid is `VW` x `VL` = 160 x 224 cells of 1 m (x across, z along the creek, water flows toward
  +z, from the old valley upstream to the next one downstream). Heights live on the vertices.
- Across, from the creek out: the creek's trench (from the model), the valley floor (about 40 m
  wide: the bottomland that becomes wetland), a rise of about 2 m to the terraces, hills at the
  rim; on the east side, from about z = 70 to 200, a limestone bluff at the rim instead (not
  walkable; creekfolk route in straight lines with detours, so steep ground has to be off-limits).
- A limestone ledge crosses the creek at `terrain.zLedge` (about 100 to 112 m): the creek is cut
  about 0.6 m below its floor above it and about 1.1 m below it, with a little fall over it.
- The spring branch runs from a spring at the foot of the west terrace (`terrain.branches.spring`)
  to the creek, all year; the Dry Fork (`terrain.branches.dry`) comes over the bluff (the Dry Falls)
  and is dry most days. Both are fixed channels with their own water; they add their drained
  area and flow to the creek where they join.
- The village starts on the west terrace by the spring (`cf2MeadowSpot`).
- Creekfolk are person-sized (about 1.5 m). The creek, dams and crossings keep Creekfolk 1's sizes;
  homes and the rest are `CF2_SCALE.build` times bigger.
- Rule (from Creekfolk 1): every change to the creek ends with `creekRefresh()` (or
  `creekDerive()` when its shape changed), so derived state matches the saved state.

## The time model

As Creekfolk 1 (`../CLAUDE.md`, "The time model"): `world.t` is seconds of real time since the
valley began; events in a heap; `runUntil(world, t)`. One valley day = one real hour; the valley
year is 192 valley days (about 8 real days); winter and spring wet, summer and autumn dry. Every
moment is simulated in full. Everything random comes from `world.rng` (or a generator saved with
the world). Never `Math.random()` or `Date.now()` in `src/sim/`; `devNow()` on the page.

**The clock** (`cf2-worker.js`): valley time is `(now - world.calStart) / 1000`, where `now` is the
real clock plus the player's correction (Settings, `creekfolk2.clock.<build>` in localStorage) plus
the dev offset (`creekfolk2.dev.<build>`). Backward: the valley waits. More than 90 days ahead: the
page asks; "the clock is wrong" moves `world.calStart` (kept in `world.clockLog`). More than two
minutes behind: the worker replays the gap in 250 ms slices and reports progress ("Catching up").

## Saves

- IndexedDB, opened by the worker: database `creekfolk2-<n>` (from `BUILD_VERSION` `cf2-<n>`; the
  dev build `creekfolk2-<n>-dev`), stores `saves` (`main` every 20 s and when the page hides,
  `backup` at most every 10 minutes) and `snapshots` (dev build, before every jump, last ten).
- Format: Creekfolk 1's `saveWorld()` JSON (version 2) with `build: "cf2-<n>"`. A save from another
  build is refused: "This valley was made in Creekfolk 1, ..." or "... an earlier version of
  Creekfolk 2 ...". Export and import of a backup file are in Settings.

## The look

- **Three layers of zoom** (`view.hv`, metres of view top to bottom, 1.6 to 300): from the air
  (over 70 m) each creekfolk is a dot in its family's colour; in between, a sprite; close in (16 m
  and under), a full creekfolk. The ground has a far version of every tile always and near tiles
  at full detail within about 40 m of the view; tiles rebuild when what they show changes (their
  keys: the creek's and the water's versions, the season, the overlay, and what stands on them).
- **The palette.** The pixel pass snaps every colour to one palette, built in `View3D.onSync` from
  `CF2Valley.palette()`, `spritePalette()` and `folkPalette()`. A new colour anywhere has to be in
  one of those (a paint in `CF2Valley.PAINT` at load time is enough), or it comes out as its
  nearest neighbour. Alpha tags matter: soft things (`{ soft: true }`) get no ink outline, glowing
  ones (`{ glow: true }`) shine at night.
- **Looking at it.** `tools/shots.mjs` takes screenshots of a saved valley from named views;
  `tools/sprite-sheet.mjs` and `tools/folk-sheet.mjs` lay out the creekfolk art. Headless Chromium
  draws with SwiftShader (slow, and the machine may be shared): take the shots you need, then look
  at every one.

## Tests

```
node tools/build.mjs --dev && node tools/determinism.cjs 4    # live == replay == save/reload, by state hash
node tools/month.cjs --seeds 2 --days 30 --save 15,30            # whole months headless; prints the valley and creek
node tools/map.cjs <seed> <days> runs/map.png                    # the simulated valley from above, as a picture
node tools/build.mjs && node tools/browser-test.mjs              # the rules, in headless Chromium (no network allowed)
node tools/build.mjs --dev && node tools/tour.mjs runs/x.json   # the 3D view live (WebGL): zooms, follow, triggers, a jump
node tools/bench-browser.mjs runs/x.json 30                      # catch-up speed in the browser's worker
node tools/ui-shots.mjs runs/x.json runs/ui                      # the interface on a laptop and a phone
```

Screenshots: `node tools/shots.mjs <save.json | new> <out dir> [views.json | -] [w h]`; contact sheets:
`node tools/sprite-sheet.mjs runs/sprites.png`, `node tools/folk-sheet.mjs runs/folk.png`.

Results go to `runs/` (not committed).

## Conventions

- Plain language in anything the player reads. No numbers in the player's UI unless they mean
  something. Creekfolk are "they".
- One self-contained HTML file per page, no network requests.
- Say what was tested directly and what is inferred. Don't round up.

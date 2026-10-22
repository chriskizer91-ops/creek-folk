# Creekfolk 2: the Leavers

Eight young creekfolk leave the first valley, follow the creek downstream to a new one, and
spend one real month, their lifetime, healing its cut-down creek into a wetland. Then their
descendants live on in the finished valley, forever. The player mostly watches.

This folder is Creekfolk 2. The rest of the repository is Creekfolk 1 (`../CLAUDE.md`), whose
simulation Creekfolk 2 started from. Read, in this order: `docs/BRIEF.md` (the author's brief),
`docs/DECISIONS.md` (what was decided since; **it wins over the brief**), `docs/HOW-CREEKFOLK-WORKS.md`
(Creekfolk 1's minds and creek in plain words), the latest phase report (`docs/PHASE2.md`) and its plan (`docs/phase2-plan.md`),
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
Phase 1, `cf2-2` Phase 2, `cf2-3` Phase 3); bump it for every build handed to the author, because each build keeps its own saves.
No page ever makes a network request: three.js and the fonts (`assets/fonts`, OFL) are embedded.
`releases/` keeps the two files handed to the author at the end of each phase
(`creekfolk2-phase1*.html`, build `cf2-1`; `creekfolk2-phase2*.html`, build `cf2-2`;
`creekfolk2-phase3*.html`, build `cf2-3`); never rebuild them.

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
| `src/sim/beavers.js` | The beavers (`world.beavers`): arrival (3C's rule: after day 120 with 55% wet at the driest, or by day 210; Creekfolk 2 brings them in week 4, `cf2-beavers.js`), the lodge in the deepest pond, kits, tending and raising dams, little side dams on the floor that hold water. |
| `src/sim/skycal.js` | The sky stones on the terrace after the first midwinter (`world.skycal`, structure `skycal`); meeting there on midwinter morning. |
| `src/sim/returning.js` | The Returning (needs a finished temple, so never in Creekfolk 2) and the glowing fish run at midwinter once the creek has healed (`world.returning`); the 3C hooks (`lifeTick3C`, `lifeOptions3C`, `devTrigger3C`, `partDone3C`). |

| Creekfolk 2 file | What it is |
|---|---|
| `src/sim/cf2-valley.js` | The real-scale valley (replaces Creekfolk 1's `Terrain`): 160 x 224 m, one height function, floor, terraces, the limestone bluff, the ledge across the creek, the creek's starting nodes. Tunables in `CF2_VALLEY`. |
| `src/sim/cf2-branches.js` | The Dry Fork and the spring branch: laid out, carved, their water (`world.creek.br`), the cells along them. Tunables in `CF2_BRANCH`. |
| `src/sim/cf2-scale.js` | Real scale: homes and the village for person-sized creekfolk, counts of things in the bigger valley, how far they notice; 3C's grove, sky stones and the beavers' side dams at this scale. `CF2_SCALE`. |
| `src/sim/cf2-creek.js` | The healing arc (Phase 2): mud from the valley's own hills, a floor that settles, side channels that fill and reopen, dams spaced from the bottom of the creek up and worked at low water, ponds that soak into the floor, storms in fronts. Tunables in `CF2_CREEK` (and Creekfolk 1's `CREEK` values it changes). |
| `src/sim/cf2-life.js` | Eight founders; life stages for the one-month arc (`LIFE`). |
| `src/sim/cf2-craft.js` | What the founders bring from the old valley: the craft of healing a creek (`creature.know`, "knew it from the old valley"), a wish to dam it, and a travelling party's bonds. `CF2_CRAFT`. |
| `src/sim/cf2-culture.js` | The founders' culture: the old valley's words (`world.oldValley`, each founder with a chance of their own accent; children drift them), its customs on day one (`world.customs.*.old`), thanking the creek at the first storm of each wet season, and the old valley's stories (kinds `ov-*`, already drifted). `CULTURE`, `OLD_STORIES`. |
| `src/sim/cf2-records.js` | What happened, written in the land: a band in the creek's bank for every flood (`world.records.mud`), the dams' record (`world.records.dams`), patches from repairs (`s.patches`); `bankAt`, `firstDamBank`, `depthWords` for the page. `RECORDS`. |
| `src/sim/cf2-chronicle.js` | The chronicle, a page of facts for every real day (`world.chronicle`), and the last founder's passing (`world.lastFounder`, a story, a memory for everyone). `CHRONICLE`. |
| `src/sim/cf2-carve.js` | Carvings (`world.carvings`): sand by the creek, clay tablets by homes, standing stones at the Telling Stones; wear, reading, copying, recutting and "correcting". Goal and action `carve`. `CARVE`. |
| `src/sim/cf2-treasure.js` | Treasures delivered by the creek (`world.treasures`, `placeTreasure`, one every two real days): they wait at the head of the valley for a flood, travel like tracer stones, settle on bars, in ponds or on the floor, get found (or buried in the bank), and become something (set in a dam, kept, planted, worn, passed on). Belief wakes from them (Creekfolk 1's `noticeGift`); the search after a storm becomes a custom; the one who suspects. `TREASURE`, `TREASURE_KINDS`, `treasureWhere`. |
| `src/sim/cf2-kindness.js` | Everyday kindness (`world.kindness`, `leaveFood`): food the player leaves is noticed, eaten, learned as a spot, visited, answered with small things left back; a spot several know gets a name. `KIND`, `KIND_FOODS`. |
| `src/sim/cf2-founders.js` | Customs around the founders: the yearly day they remember the eight (`world.customs.founders`), at the founders' stones or trees. `FOUNDERS_DAY`. |
| `src/sim/cf2-beavers.js` | The beavers come in week 4 (Phase 3): from day 22, once half the floor stayed wet at the driest point, a young pair comes up the creek in the spring that follows (days 24 to 26; by day 28 whatever the creek), in the night, and is found at first light. Once they live there the creekfolk leave the dams to them, mending only a badly worn one and building up only where a stone apron is needed. `CF2_BEAVER`. |
| `src/sim/cf2-balance.js` | The living balance keeps its size (Phase 3): every six hours, `balanceWorld` lets go of what nothing needs any more (lineage records, after each keeps its family `line`; ties to those long gone; the work shares of the gone; noted pairs; the departed who have lived out their span; myths of forgotten stories; places named for a passing whose names fell out of use; Creekfolk 1's timeline and population log past 30 days), keeps grove trees out of `c.seen`, and gives a visitor from downstream its own copy of the mind it left with (Creekfolk 1 shared the objects, which broke save-and-reload determinism). `BALANCE`, counts in `world.balance`. |
| `src/sim/cf2-belief.js` | What Creekfolk 2 leaves out of Creekfolk 1's belief: no temple, no Hall of the Ancestors, no journey to the spring (so no procession path or Returning festival either). Belief itself wakes from treasures (`cf2-treasure.js`). |
| `src/sim/cf2-api.js` | What Creekfolk 2 adds to `CreekSim`. |
| `src/sim/cf2-worker.js` | The worker: live running, catch-up, saves, the clock guards, messages. |
| `src/view/clock.js` | The page's clock: `devNow()`, the player's correction, the dev offset, the database name. |
| `src/view/vworld.js` | The page's copy of the valley. |
| `src/view/words.js`, `sheets.js` | Plain words about creekfolk (from Creekfolk 1's interface); the village and mind sheets. |
| `src/view/records-view.js` | The records on the page: the creek's bank as a cross-section (`bankSheet`, opened by tapping the creek), the Ways and stories tab (customs, words, and for each story what happened, what was carved, what they say now), the Chronicle tab and its pages in "while you were away". |
| `src/view/care-view.js` | Care on the page: the Care sheet (leave food, then tap where; a treasure for the creek; where each of your treasures is now; what they make of it), and the one who suspects waving when the page opens (`Hud.waveHello`, `View3D.waveFor`). |
| `src/view/hud.js` | The interface: clock chip, log line, catching up, the clock's questions, settings, backups, sheets. |
| `src/view/dev.js` | The developer menu. |
| `src/view/mapview.js` | The valley from above on a 2D canvas: the fallback without WebGL2. |
| `src/view/look-glue.js` | How the view uses the ported renderer: colour management off, sRGB output, light intensities times pi (`CF2_LIGHT`). |
| `src/view/sprites.js` | Creekfolk as pixel sprites for the middle of the zoom (What the Map Forgot's letter grids): Creekfolk 1's 24 furs (`CF2_FUR`), coats, faces, pale paws, the dyes (`CF2_DYE`) and what they wear (`CF2_WEAR`), and each family line's cloth pattern (`clothOf`, view only). Also `familyColour` (dots, the map). |
| `src/view/valley3d.js` | The valley in 3D (`CF2Valley.create(vw)`), What the Water Brings' way: 32 m tiles (a far version always, near ones at full detail streamed round the view), ground typed from the simulation's grids read smoothly, the creek's ribbon, standing water as a smooth sheet, the branches carved from their own lines, trees and plants, the bluff's rock, homes and every other structure level by level (and while being built), dams, 3C's things (doors, porches, hearths, decorations, the grove and its nurse logs, sky stones, the lodge). `W.height`, `W.water`, `W.paint`. |
| `src/view/beasts3d.js` | The simulation's animals: the beavers swimming, the glowing fish run. |
| `src/view/life3d.js` | The valley's wild creatures (What the Water Brings' `life.js`, view only, their numbers from how wet and green the valley is): a heron fishing where there are fish, turtles basking on logs, minnows in pools, frogs at wet edges, dragonflies over still water in summer, butterflies over green meadow, teal on ponds in winter and spring. They react to creekfolk coming near. |
| `src/view/air3d.js` | The air (What the Water Brings' `main.js`): rain and storms with lightning (`flash`, added to the grade in `light()`), snow on the cold days of deep winter, mist on the water at dawn and after a storm, fireflies at summer dusks, falling leaves, swallows by day, rings on the water. |
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
  about 0.6 m below its floor above it and about 0.8 m below it, with a little fall over it.
- The spring branch runs from a spring at the foot of the west terrace (`terrain.branches.spring`)
  to the creek, all year; the Dry Fork (`terrain.branches.dry`) comes over the bluff (the Dry Falls)
  and is dry most days. Both are fixed channels with their own water; they add their drained
  area and flow to the creek where they join.
- The village starts on the west terrace by the spring (`cf2MeadowSpot`).
- Creekfolk are person-sized (about 1.5 m). The creek, dams and crossings keep Creekfolk 1's sizes;
  homes and the rest are `CF2_SCALE.build` times bigger.
- Rule (from Creekfolk 1): every change to the creek ends with `creekRefresh()` (or
  `creekDerive()` when its shape changed), so derived state matches the saved state.
- **The healing arc** (`cf2-creek.js`, Phase 2): the founders arrive knowing how to dam a creek
  from the bottom up (`cf2-craft.js`), begin at the bottom of the valley within a day or two, and
  work the dams only in the dry season; each wet season's floods fill the ponds with mud, and the
  next dry season the silted dams are built up a hand higher. So the creek heals about a step a
  valley year: wet at the driest point of each year (`creek.driest`, recorded at the first winter
  rains, days 6, 14, 22, 30) measured on six seeds at 1-2%, 5-37%, 50-79%, 70-91%, then 85-93%
  through day 46. The floor settles (deposits thin out 0.3 m above where it started) and side
  channels fill in while new ones open, so a healed valley keeps changing but never runs away.

## The founders' arc (Phase 2)

- They arrive with the old valley's ways (`cf2-culture.js`): its words, its customs (established,
  not discovered), and its stories, already drifted. Belief that the creek gives stays asleep.
- Three records of time, set side by side for the player: what happened, written in the land (the
  mud in the bank, the grove's rings, patches on the walls, then and now); what they told
  (carvings, stories); what they remember (habits that outlive their reasons, such as thanking
  the creek "though no one can say anymore why").
- **Then and now:** holding the clock-arrow button (or T) shows the valley as it was on its first
  morning from the same camera. The worker makes day one again from the seed
  (`cwThenWorld`: `newValley` is deterministic) and sends it as a `then` message; the page draws it
  as a second `CF2Valley` and hides today's land, creekfolk and creatures while it is held.
- **The last founder:** one quiet moment on the page (`Hud.moment`, the log line of kind
  `founders`): the view turns to where they passed, two lines come and go. No ending.

## The living balance (Phase 3: the beavers, bounded memory)

- **The beavers** (`cf2-beavers.js`) come in week 4: on four seeds with care on days 24.7 to
  28.0, in the spring after the creek was half wet at its driest (by day 28 whatever the creek).
  They keep the dams to the creekfolk's own standard (Decision 24): they mend a dam at the same
  wear (`BEAVER.mendAt` 0.6), build a silted one up no higher than 0.1 m over the floor
  (`above`) and dam a dozen of the floor's side channels (`smallDams`); the creekfolk then leave
  the dams to them (dam-tending, about 0.1% of grown-ups' waking time before, 0.00 to 0.01%
  after; new dams and levels stay the creekfolk's). A healed valley stays about 90 to 96% wet at
  its driest with them (Creekfolk 1's numbers gave 95 to 99%; without beavers, 81 to 92%). Up to
  six beavers (kits each spring, old ones leave after 60 days).
- **Bounded** (`cf2-balance.js`): everything that grew with every creekfolk who ever lived is let
  go or folded every six hours, keeping what it means; see the file's header for the list, and
  what still fills up slowly towards its cap (the bank's mud bands, the chronicle's 400 days, the
  grove's 240 trees and the lineage of those who rest there). `tools/longrun.cjs` measures it: two
  seeds to day 92 save 2.0 to 2.3 MB from day 36 on; the last third of the run against the middle
  third: population within 4%, wet at the driest within half a point, save size within 3%, the
  world's own records (without the minds) up 1 to 2%, memory within 3%;
  `tools/dayspeed.cjs` times a valley year from saves of different ages (no slowdown, day 30 to 100).

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
node tools/determinism.cjs 2 x runs/x.json                       # the same, from a saved valley (the beavers' coming, the balance letting go)
node tools/longrun.cjs --seeds 2 --days 92 --jobs 2 --save 60,92 # months headless: population, wet, save size and what it's made of, memory, time per day, dam-tending; checks that nothing trends after day 35
node tools/dayspeed.cjs --days 8 runs/x/a-day30.json runs/x/a-day92.json  # time to simulate a valley year from saves of different ages
node tools/month.cjs --seeds 2 --days 30 --save 15,30            # whole months headless; prints the valley and creek
node tools/map.cjs <seed> <days> runs/map.png                    # the simulated valley from above, as a picture
node tools/creek-lab.cjs --seed cf2-1 --dams arc --fixed-weather  # the creek alone, scripted or replayed dams (--dams <save>, healed, none)
node tools/lab-batch.cjs variants.json --dams "runs/x/{seed}-day32.json" --wx a,b,c  # creek variants side by side, same storms
node tools/creek-look.cjs runs/x.json                            # a saved valley's creek node by node, and how wet each stretch is
node tools/lives.cjs runs/x.json                                 # the founders' arc in lives: passings, generations
node tools/build.mjs && node tools/browser-test.mjs              # the rules, in headless Chromium (no network allowed)
node tools/build.mjs --dev && node tools/tour.mjs runs/x.json   # the 3D view live (WebGL): zooms, follow, triggers, a jump
node tools/bench-browser.mjs runs/x.json 30                      # catch-up speed in the browser's worker
node tools/ui-shots.mjs runs/x.json runs/ui                      # the interface on a laptop and a phone
node tools/records-shots.mjs runs/x.json runs/rec                # the bank, Ways and stories, the Chronicle, then and now, the last founder's moment
node tools/records-report.cjs runs/x.json                        # the culture and the records of a saved valley, in numbers
node tools/care-shots.mjs runs/x.json runs/care                   # the Care sheet, food and treasures where they lie, a worn treasure, the wave
```

Screenshots: `node tools/shots.mjs <save.json | new> <out dir> [views.json | -] [w h]`; contact sheets:
`node tools/sprite-sheet.mjs runs/sprites.png`, `node tools/folk-sheet.mjs runs/folk.png`.

Results go to `runs/` (not committed).

## Conventions

- Plain language in anything the player reads. No numbers in the player's UI unless they mean
  something. Creekfolk are "they".
- One self-contained HTML file per page, no network requests.
- Say what was tested directly and what is inferred. Don't round up.

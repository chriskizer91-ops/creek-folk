# Creekfolk

An ambient valley simulation: small creekfolk live beside a creek, learn from
each other, invent words, build, and slowly turn the creek into wetland. The
player mostly watches. This version is being turned into a valley that lives for
a full real year (see `docs/BRIEF.md`, and `docs/PHASE3-CHANGES.md`, which wins over
the brief where they disagree).

**Taking over, or splitting the work? Read `docs/HANDOFF.md` first.** It says where
things stand, the author's rules, and how to split work between instances.

Repository layout: `src/` (source), `tools/` (build, tests, benchmarks), `docs/`
(brief, phase reports, plans), `ref/` (code from the author's other games to port),
`releases/` (the playable build of each finished phase; never rebuild these).

## Build and run

```
npm install
node tools/build.mjs          # dist/creekfolk.html, dist/creekfolk-dev.html (minified), dist/sim.cjs
node tools/build.mjs --dev    # same, unminified, for debugging
```

Every build makes two self-contained pages from the same source: `creekfolk.html` (the
game; the dev menu is hidden behind Ctrl+Shift+D) and `creekfolk-dev.html` (a visible
Dev button that works on phones, and its own saves). `BUILD_VERSION` in
`tools/build.mjs` names the build (3A is `"3a"`); bump it for every build you hand to
the author, because each build keeps its own saves.

## Source layout

All source files share one scope: the build concatenates them, in the order
listed in `tools/build.mjs`, inside a single function. Later files can use any
name from earlier files.

| File | What it is |
|---|---|
| `src/sim/core.js` | The original simulation: minds, needs, language, rituals, building, water, weather. Recovered from the first Creekfolk's single-file build (prettified, top-level names restored with `tools/rename.cjs` + `tools/rename-map.json`). Local variables are still short (`i` is usually the world, `t` the creature). |
| `src/sim/calendar.js` | The valley's 8-day year: `seasonAt` (season, day, year, warmth, wetness), `dateText`, `daysToMidwinter`, `realStartText`. |
| `src/sim/creek.js` | The creek model (Phase 3A): nodes, floods, sediment that only builds, dams and the drop rule, ponds, the water table, drying, Stage 0 side channels, stages, wet-at-driest, what the land can feed. Tunables in `CREEK`. |
| `src/sim/life.js` | Ages, stages, pairing, births, passing, the memorial grove, leaving downstream, housing. Tunables in `LIFE`. |
| `src/sim/minds.js` | Stories and myths, named places, customs (passing offerings, season gatherings), lost skills, proposals, visitors from downstream. Tunables in `MINDS`. |
| `src/sim/gift.js` | The player's 12-hour gift (rain, seeds, warm day, found object) and beliefs about the giver. |
| `src/sim/hooks.js` | `newValley()` (five founders) and `upgradeWorld()` (runs on every load; migrates old saves). |
| `src/sim/api.js` | `CreekSim`, the surface used by Node tools. |
| `src/sim/worker.js` | Web Worker message handler (catch-up). Only in the worker build. |
| `src/vendor/three-r186.js` | three.js r186, as it was bundled in the original. Don't edit. |
| `src/view/view.js` | The original renderer, camera, HUD, sound and `App`. |
| `src/view/land.js` | The ground and the water drawn from the creek model (replaces the original `GroundView` and `WaterView`), and the village panel's Land tab. |
| `src/view/store.js` | IndexedDB saves (`ValleyStore`). |
| `src/view/catchup.js` | Long catch-ups in a Web Worker (`CatchupWorker`). |
| `src/view/dev.js` | Developer menu (hidden in the game, a Dev button in the dev build) and `devNow()`. |
| `src/view/patches.js` | View patches for lives (body size, elder fur, panel lines, activity text) and the background-tab timer. |
| `src/view/minds-view.js` | Gift button and sheet; Stories/Places/Customs in the village sheet; a creekfolk's Stories tab. |
| `src/view/boot.js` | Starts the app. |
| `src/page-head.html`, `src/page-tail.html` | The page around the scripts (CSS, fonts, HUD markup). |

Edits made inside the recovered files (`core.js`, `view.js`) are marked with a
`// LIFE:`, `// MINDS:` or `// CREEK:` comment. `tools/patch-view-phase1.py` records the
Phase 1 view edits; later edits were made directly.

## The time model

- Simulation time `world.t` is **seconds of real time** since the valley began.
  The simulation is event-driven: a heap of timed events (`schedule()`), and
  `runUntil(world, t)` processes every event up to `t`. Event kinds: `A` a
  creature's action ends, `W` world tick (every 60 s), `R` weather change,
  `L` life check (every 600 s, `lifeTick` in `life.js`).
- One valley day is one real hour (`VALLEY_DAY = 3600`, `world.cycle.len`).
  Night is roughly 38% of each valley day.
- **The valley year is 192 valley days, about 8 real days** (`YEAR_DAYS`); each season
  lasts 48 valley days (2 real days). A valley starts on the first morning of spring.
  Winter and spring are the wet season (rain and storms follow `seasonAt(w).wet`),
  summer and autumn the dry season. Midwinter is day 168 (`daysToMidwinter`). The real
  calendar is no longer used for seasons; `world.calStart` only records when the
  valley began.
- A creekfolk lives about 30 real days, about four valley years; a real year holds
  about 45 valley years and about 350 storms.
- **Every moment is simulated in full**, watched or not. There is no coarse mode.
- Live: each frame runs `runUntil` up to now. In a hidden tab a 1-second timer
  does the same. After a gap of more than 30 minutes, the page saves the world,
  replays the gap in a Web Worker with the same code, and loads the result
  (`src/view/catchup.js`). Gaps under 30 minutes replay on the page in 40 ms slices.
- Everything random comes from `world.rng` (seeded), so a replay is identical to
  a live run. `tools/determinism.cjs` proves it with a state hash.
- `devNow()` is real time plus the developer offset; use it, never `Date.now()`,
  for valley time in the app.

## The valley and the creek (Phase 3A)

- The grid is `VW` x `VL` = 80 x 160 cells of 1 m (x across, z along the creek, water
  flows toward +z). Heights live on the vertices (`terrain.h`). Across the valley: the
  creek's trench, the valley floor (bottomland, `terrain.floorWeight`), a rise to the
  terraces where the village lives, hills at the rim (`valleyR`, a rounded rectangle:
  walkable below 0.9). The village starts at the upstream end on the terrace; the
  spring is upstream of z = 0, outside the valley.
- The creek (`world.creek`, `src/sim/creek.js`) is a chain of nodes 2 m apart from
  z = -24 to VL + 24 with bed, floor (`fp`), trench width and slope, bench, plants and
  the water table beside it (`g`). The centre line is fixed by the seed; everything
  else comes from the model, and `terrain.setCreek()` rebuilds the heights after
  every change (`terrain.version` bumps).
- **Storms are floods** (`creekStorm`): Creek Care's hydraulics; gravel and mud settle
  and never scour (`bedMin`); mud settles in ponds and on the floor when floods go
  over the bank; where floods spill, `creekSpread` wears side channels (`creek.chan`)
  across the floor, which is the Stage 0 wetland.
- **Dams** (structures of kind `dam`, up to 14) are crests on nodes (`creek.dams`). The
  drop rule: a dam holds at most `CREEK.dropMax` above the water below it; higher, the
  water digs under and the pond barely fills (`leaks`). Creekfolk notice; an elder can
  work out why (knowledge `downstream`, taught and losable); with it they build from
  the bottom of the creek up and lay stone aprons under the lowest dam. Silted ponds
  are built up a hand higher as a chore. Dams never wash out.
- **Water** (`creekHydro`, every 10 minutes): topsoil moisture, inflow from the spring
  and hills, the creek trading water with the floor's water table (a deep trench
  drains it fast), ponds as reservoirs, plants drawing water down in the dry season.
  Per cell: `world.wt` (water table), `world.green` (0 brown .. 1 green), `world.wet`
  (marsh, lagged). The driest point of each valley year (share of the floor still wet)
  is in `creek.driest`.
- Capacity is `min(shelter, creekFeed(w))`: the land feeds about 20 in a cut-down
  valley and up to 36 as the creek heals (`capacityParts`).
- `tools/creek-lab.cjs` runs the creek alone with scripted dams, for tuning.
- Rule: every change to the creek ends with `creekRefresh()` (or `creekDerive()` when
  its shape changed), so derived state always matches the saved state and a reload
  continues exactly.

## Lives

- Founders: five young adults, real ages 8–14 days.
- Stages: child (days 0–7), adult (7–24), wise elder (24+). Life ≈ 30 days
  (± up to 1.6). `stageOf`, `ageDays`, `bodyScale`.
- Pairs form between unrelated adults (not parent/child, not siblings) with mutual
  warmth > `LIFE.pairWarmth`; after two days grown, a good friend will do
  (`LIFE.friendWarmth`). A pair has a child about every `LIFE.pairBirthDays` (6)
  days until the valley is 85% full, then up to 2.5 times less often.
- Children inherit a blend of temperament, interests and looks, and one parent's
  accent. They start knowing nothing and learn by watching and from chats
  (`shareNews`; elders teach twice as readily).
- Passing: at the end of its lifespan a creekfolk walks to the place it loved,
  family and close friends come and sit with it, and it passes on. A tree is
  planted for it in the memorial grove (`res` kind `grove`). Its home goes to its
  partner or a child. A permanent record stays in `world.lineage`.
- Room: `valleyCapacity()` comes from homes, stores and gardens, up to
  `LIFE.maxCapacity` (36). When the valley is over capacity, a curious young
  adult (sometimes with its partner) chooses to go downstream; friends walk them
  to the edge. Recorded in `world.downstream` and `world.lineage`.
- When the valley is at least 85% full, a restless young adult chooses to leave
  about every `LIFE.restlessDays` (3) days, so leaving is part of ordinary life.
- The valley never fails: with fewer than four adults, births speed up, and when
  there are too few grown-ups, or nobody unrelated to pair with, a traveler comes
  up the creek and stays (`travelers()`).
- Generation time is about two weeks (children are born to parents aged 7–24
  days), so a year holds roughly 25–30 generations.

## Minds (Phase 2)

- **Stories** (`world.stories`): notable events (founding, first discoveries, first of
  each thing built, notable passings, storms, travelers, leavings, news from visitors,
  gifts, frogs, lost skills). Each has the `truth` and a weight. Each creekfolk holds
  up to `MINDS.loreMax` versions in `creature.lore` (`v`, confidence, whether it was
  there, who told it). Witnesses know the truth.
- **Telling** (`tellStory`, after each chat): elders tell most, children listen
  most. Each retelling may change one detail (`retell`): numbers grow, a deed moves
  to a famous name or the teller's ancestor, a place name attaches, a cause is added
  (the creek, the elders, the giver), the telling grows grander. Someone who was
  there may correct the teller (`correct`); after six tries they give up.
- **Myths** (`checkMyths`, every 6 h): when most of the living tell a version that
  reads differently from the truth. Shown in the village's Stories tab; important
  ones logged at most once a day. Stories nobody holds are logged as forgotten.
- **Places** (`world.placeNames`): named after what happened there (the first pool,
  a notable passing, the first crossing, the meeting stone, the Leaving Bank). Each
  gets a word in their speech (concept `place:<id>`), which spreads like any word.
- **Customs**: offerings at a passing become a custom once one kind dominates;
  gatherings when the season turns (held in daytime); thanks for gifts.
- **Lost skills**: when the last creekfolk who knew a skill is gone it's logged;
  relearning it later is logged too.
- **Proposals**: shared projects get reactions (liked it / wasn't sure).
- **Visitors**: those who went downstream (snapshot in `world.downstream`) come back
  about every `MINDS.visitEveryDays` days for two valley days, with news. Visitors
  (`creature.visitor`) don't count for population, pairing or capacity.
- **The gift**: `giveGift(world, kind)` once per 12 h of valley time. Effects help
  growth, never survival. Rain changes the weather (weather events carry a token so
  stale ones are skipped). Observers update `creature.beliefs.giver` by how much the
  gift was needed and their temperament; believers coin a word for the giver
  (concept `giver`), thank it with a gesture (can become a custom), notice a regular
  rhythm, argue with doubters, and lose faith slowly if gifts stop for 3 days.
- The year runner can play the gift: `GIFTS=regular|irregular|none|stop:<day>`.

## Saves

- **Each build has its own saves**: IndexedDB database `creekfolk-<BUILD_VERSION>`
  (the dev build: `creekfolk-<BUILD_VERSION>-dev`), store `saves`, keys `main` (every
  20 s and on hide) and `backup` (at most every 10 minutes); the dev build also keeps
  `snapshots`. A build never reads another build's saves; importing one is refused
  with "This valley was made in an earlier version of Creekfolk and can't be opened
  here". Phase 1 and 2 builds used `creekfolk`; they are kept in `releases/`.
- Format: `saveWorld()` JSON (version 2, with `build`). The rng state, the event heap
  and the creek (`creekSave`, with the side channels as a sparse grid) are saved, so
  a load continues exactly. `upgradeWorld()` runs after every load.
- Bounded growth: memories 48 per creature, log 500, history 400, timeline 1440,
  population log 1600, downstream list 400. `lineage` grows by about 450 small
  records a year.
- Export/import of a backup file is in Settings.

## Developer menu

In the game: Ctrl+Shift+D (Cmd+Shift+D), or open the page with `#dev`. In the dev
build: the Dev button. Jumps of an hour, a day, a week, 1/3/6/12 months, or to a
chosen date; each is replayed in full (the same code path as a real absence), and the
menu shows the last jump's speed and what 30 days would take on this device. The dev
build snapshots the valley before every jump (last ten, with restore). Also: gifts with
no wait, storm / big flood / birth / passing / visitor (`devTrigger`), overlays
(wetness, worn paths, creek stage, land capacity), pause the valley's clock, the creek
in numbers, and any mind. The offset is stored per browser and per build in
localStorage (`creekfolk.dev.<build>`), never in the save. Long catch-ups show "keep
the screen on" and hold a screen wake lock where the browser allows it.

## Tests

```
node tools/build.mjs --dev
node tools/determinism.cjs 20            # replay == live == save/reload, by state hash
node tools/year.cjs --seeds 4 --days 365 # whole years headless, checks the year's targets
node tools/browser-test.mjs 3            # headless Chromium: new valley, dev jump via worker, reload
node tools/browser-dev.mjs               # the dev build: Dev button, jump + snapshot, triggers, pause, restore
node tools/creek-lab.cjs --days 200      # the creek alone with scripted dams (tuning the year arc)
node tools/view-world.mjs <save> shots/x # screenshots of a saved valley
node tools/bench-browser.mjs <save> 30   # catch-up benchmark in the browser
```

`year.cjs` also prints the creek each `EVERY` days (wet now, at the driest, trench,
dams, raises, feed) and saves worlds on the days in `SAVE_AT=30,60,...`.

`year.cjs` accepts `LIFE='{"pairBirthDays":4}'` in the environment for tuning.
Results go to `runs/`.

## Conventions

- Plain language in anything the player reads. No numbers in the player's UI
  unless they mean something (ages in days are fine).
- Gender-neutral: creekfolk are "they".
- Keep the page one self-contained HTML file with no network requests except the
  fonts already inlined.

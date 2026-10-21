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
`tools/build.mjs` names the build (3C is `"3c"`); bump it for every build you hand to
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
| `src/sim/fauna.js` | Gifts that live (Phase 3B): flowers, fruit trees, goats, bees, fish, birds (`world.fauna`); goats move each world tick. |
| `src/sim/gift.js` | The player's 12-hour gift (17 kinds in `GIFT_KINDS`), the belief that the creek gives, requests, keeping watch, offerings, rhythm, the one who believes in you. |
| `src/sim/temple.js` | The temple (`STRUCTURES.temple`, 3 stages x 12 parts) and its pace from giving, timber, carvings, the Hall of the Ancestors for valleys with no giver, the spring. Tunables in `TEMPLE`. |
| `src/sim/looks.js` | Phase 3C: 24 fur colours, coat patterns and markings, things to wear by passion, all inherited (`looksOf`, `looksInherit`; a local `Rng`, never `world.rng`). |
| `src/sim/homes.js` | Phase 3C: porches and hearths (paced), more gardens and beds, decorations by the door from what the owner loves. Tunables in `HOMES`. |
| `src/sim/grove.js` | Phase 3C: memorial tree kinds by family, growth all year, falls into nurse logs (bounded); goats' kids, wool blankets. Tunables in `GROVE`, `GOATS`. |
| `src/sim/beavers.js` | Phase 3C: the beavers (`world.beavers`): arrival, the lodge, dam-tending, kits. Tunables in `BEAVER`. |
| `src/sim/skycal.js` | Phase 3C: the sky stones that find their midwinter (`world.skycal`). |
| `src/sim/returning.js` | Phase 3C: the procession path and the Returning every midwinter (`world.returning`); also the 3C hooks `lifeTick3C`, `lifeOptions3C`, `devTrigger3C`, `partDone3C`. Tunables in `RETURNING`. |
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
| `src/view/minds-view.js` | Gift button and sheet (grouped gifts, the standing request, offerings); Stories/Places/Customs in the village sheet; a creekfolk's Stories tab. |
| `src/view/belief-view.js` | The temple and the Hall of the Ancestors drawn part by part; flowers, goats, bees, fish, birds; offerings and the lantern; stars in the water, the rainbow, snow; the wave; the village's Temple tab. `VIEW_EXTRAS`: later view files register drawing classes here. |
| `src/view/looks-view.js` | Phase 3C: coats, markings, worn things, ages at a glance, the treasure a believer wears; `looksFurColor`. |
| `src/view/homes-view.js` | Phase 3C: doors, decorations, porches and hearths, markers at named places, the land beyond the valley (lent to then-and-now). |
| `src/view/life-view.js` | Phase 3C: the memorial grove (instanced), nurse logs, goats' kids, butterflies, herons, dawn mist; Land tab lines. |
| `src/view/soundscape.js` | Phase 3C: frogs, birds and insects that grow fuller as the wetland heals (WebAudio, hangs off `Sound`). |
| `src/view/thennow.js` | Phase 3C: hold the button (or T) to see the valley as it was on day one, from the same camera. |
| `src/view/beavers-view.js` | Phase 3C: beavers, the lodge, stick dams. |
| `src/view/returning-view.js` | Phase 3C: the sky stones, the procession path, the Returning (gold water and the sun's road, glowing fish, lanterns, fireflies), the pyramid's lanterns, the Temple tab's 3C lines. |
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
  across the floor, which is the Stage 0 wetland. Each flood's deposits are shared with
  neighbouring nodes (`creekShareDeposit`, never across a dam), and water behind a hump
  of gravel stands as slack water, so pools fill and humps don't. Without this the bed
  grows a sawtooth that never washes out; `creekBumpiness()` measures it (printed by the
  creek lab and the year runner; healthy is under about 0.06 m for the bed, ~0 for the floor).
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

## Belief and the temple (Phase 3B)

- **The creek gives.** `creature.beliefs.giver` (0..1) is the belief that the creek
  gives; above 0.5 is a believer. Every gift is noticed by everyone awake (those who saw
  it most), answered requests count double, a rainbow is a sign. Children start with
  0.95 of their parents' belief (`GIFT.inherit`). The least open grown-ups of their valley (about one in
  seven, `doubtLine`) stay doubters ("it's only luck"). The first believer names the
  **Giving Place** (`world.givingPlace`): the terrace edge above the creek nearest the
  village, kept clear for the temple (`TEMPLE_ROOM`, 9.5 m).
- **The feedback loop** (`gift.js`): a believer voices the valley's top need as a
  standing request (`world.request`) until the next gift; giving it is an answered
  request. When a gift is due, believers keep watch at the Giving Place (goal `watch`)
  and sometimes leave an offering for the giver (`world.offerings`). Every gift is a
  notch on the Giving Stone (`stats.gifts`). After 3 days with no gift (or 1.5 times the
  rhythm they know, `restAfter`): "the creek is resting" and a lantern
  (`world.lantern`); while it rests, belief fades very slowly (`GIFT.restFade`) and doubters
  barely sway believers, so most still believe after a month away
  (`tools/away-test.cjs`). Rhythm is noticed in valley days and the valley hour (`giftRhythm`,
  `rhythmText`): "the creek gives at dawn, every twenty-four days".
- **Gifts**: 17 kinds in four groups (`GIFT_KINDS`, `giftNeedWhy`): weather (rain, warm
  day, snow day, starry night, rainbow), living things (seeds, flowers, fruit trees,
  goats, bees, fish, a new bird), materials (a fallen great tree, a bank of clay, a pile
  of stones), wonder (something to find, a dream). Living gifts add a new species each
  time (`FAUNA_KINDS`). Weather gifts use `weather.force` to set what comes next.
- **The temple** (`temple.js`): starts with 7 gifts in 14 real days, most believing, and
  the valley at least 7 days old. Pace from the gift rate over 14 days (`paceOfRate`:
  every 4 days 0.5, every other day 1, daily 1.2, twice a day 1.4; 6 days without a gift
  stops it). While the next part is locked (`building.locked`, no work is taken), the
  feeling "the creek has answered" builds at that pace; one part's worth
  (`TEMPLE.feelPerPart` real days) unlocks it, and it is built with ordinary labour and
  materials. Timber comes from trees planted as a shrine part (`timbertree`, about 30
  days to grow) or a fallen great tree (`greatlog`); clay walls cure; crown stones move
  only in the dry season (`dryseason`). Carved parts record the village's version of a
  story (`carveStory`); carved stories drift half as fast. A part stuck for 5 days is
  finished with what they have. A valley with no temple by day 30 builds the Hall of the
  Ancestors (`STRUCTURES.ancestors`) at full speed on time alone.
- **The spring**: news comes with a visitor or traveler once a third believe (or a curious
  elder wonders after day 60, or a dream); an explorer walks out past the head of the
  valley (action `journey`, act type `away`, hidden) and finds it; later believers go
  now and then and bring back spring water.
- **The one who believes in you**: after 100 gifts and about five months since the first
  (`GIFT.beyondGifts`, `GIFT.beyondDays`), with steady giving, one creekfolk
  (`beliefs.beyond`) is sure the gifts come from someone beyond the valley; it waves when
  the page opens (view only, `waveFor`). Passed to a child or young friend (`passBeyond`).
- Core hooks are marked `// BELIEF:`.

## Life and the ending (Phase 3C)

- **Looks** (`looks.js`): 24 fur colours in a ring (kin look alike), coat patterns and
  face markings each from one parent (5-6% new), a thing to wear by their signature passion
  (`c.sig`), children with big heads, elders grey with a cane; a believer wears the treasure
  they found. Looks use a local `Rng` so they never change what happens.
- **Homes** (`homes.js`): porch and hearth levels (rest only, no capacity; paced: one at a
  time, at most one every 8 hours), up to three gardens with four beds, decorations by the
  door; doors in the owner's fur colour; a marker at every named place.
- **The grove** (`grove.js`): tree kinds by family line (70%) or by what they loved; trees
  grow for life; ordinary trees fall after 180-240 days (founders' 400-460) into nurse logs
  (at most 24, 30 days each); at most 240 standing. Goats have kids in spring (herd at most 8),
  wool becomes blankets.
- **Beavers** (`beavers.js`): arrive after day 120 once the last year's driest share is 0.55
  (by day 210 whatever); a lodge in the deepest pond; they mend dams and build them up to
  0.25 m above the floor (the creekfolk stop at 0.1), within the drop rule, one dam at most
  every 3 hours; creekfolk skip a dam a beaver is seeing to (`s.beaver`).
- **The sky stones** (`skycal.js`): begun after their first midwinter; the markers go in on
  the mornings the sun rises behind them, so they're done about real day 13. Midwinter
  morning gathering there.
- **The Returning** (`returning.js`): when the temple is done, a procession path in 12
  stretches, one a season (24 real days); then every midwinter: dawn on the temple steps (the
  sunrise through the crown, gold water), the walk to the Spring, at night the glowing fish
  run and lanterns along the channels. Each adds lanterns on the pyramid (one per passing
  since the last), a carving and a verse (`RETURNING.verses` kept). A valley without a
  finished temple gets the fish run once its driest share is 0.7. `returningNext(w)`.
- **Coming home**: a visitor may stay (15%, if there's room and someone they love); a fresh
  mind, the same name, family, looks and friends, and the craft. **Legends**: stories over 40
  days old that a third still tell (`w.legends`, 24 kept). The First Pool is named in the
  procession.
- **Soundscape and then-and-now**: view only (`soundscape.js`, `thennow.js`).
- Core hooks are marked `// 3C:`.

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

`year.cjs` accepts `LIFE='{"pairBirthDays":4}'` in the environment for tuning, and
`GIFTS=every:<hours>` (every:48 is every other day) to play the gift on a rhythm; it
prints belief and the temple's progress and checks the temple targets. Also:
`tools/gift-smoke.cjs` (every gift in turn), `tools/temple-preview.cjs` (a temple that
rises as fast as its builders can work, for looking at it), `tools/ui-shots.mjs` (the
gift sheet and Temple tab), `tools/browser-gifts.mjs` (every gift and trigger in the dev
build), `tools/away-test.cjs` (how belief holds when the gifts stop). `GIFTS=sched:48@0,96@90`
changes the rhythm on given days (0 hours: no gifts); `SIM=<file>` runs a frozen copy of
the simulation.
Results go to `runs/`.

## Conventions

- Plain language in anything the player reads. No numbers in the player's UI
  unless they mean something (ages in days are fine).
- Gender-neutral: creekfolk are "they".
- Keep the page one self-contained HTML file with no network requests except the
  fonts already inlined.

# Creekfolk

An ambient valley simulation: small creekfolk live beside a creek, learn from
each other, invent words, build, and slowly turn the creek into wetland. The
player mostly watches. This version is being turned into a valley that lives for
a full real year (see `docs/BRIEF.md`).

## Build and run

```
npm install
node tools/build.mjs          # dist/creekfolk.html (minified) and dist/sim.cjs
node tools/build.mjs --dev    # same, unminified, for debugging
```

Open `dist/creekfolk.html` in a desktop browser. It is one self-contained file.

## Source layout

All source files share one scope: the build concatenates them, in the order
listed in `tools/build.mjs`, inside a single function. Later files can use any
name from earlier files.

| File | What it is |
|---|---|
| `src/sim/core.js` | The original simulation: minds, needs, language, rituals, building, water, weather. Recovered from the first Creekfolk's single-file build (prettified, top-level names restored with `tools/rename.cjs` + `tools/rename-map.json`). Local variables are still short (`i` is usually the world, `t` the creature). |
| `src/sim/calendar.js` | Real calendar: `valleyDate`, `seasonAt`, `dateText`. |
| `src/sim/life.js` | Ages, stages, pairing, births, passing, the memorial grove, leaving downstream, housing. Tunables in `LIFE`. |
| `src/sim/hooks.js` | `newValley()` (five founders) and `upgradeWorld()` (runs on every load; migrates old saves). |
| `src/sim/api.js` | `CreekSim`, the surface used by Node tools. |
| `src/sim/worker.js` | Web Worker message handler (catch-up). Only in the worker build. |
| `src/vendor/three-r186.js` | three.js r186, as it was bundled in the original. Don't edit. |
| `src/view/view.js` | The original renderer, camera, HUD, sound and `App`. |
| `src/view/store.js` | IndexedDB saves (`ValleyStore`). |
| `src/view/catchup.js` | Long catch-ups in a Web Worker (`CatchupWorker`). |
| `src/view/dev.js` | Hidden developer menu and `devNow()`. |
| `src/view/patches.js` | View patches for lives (body size, elder fur, panel lines, activity text) and the background-tab timer. |
| `src/view/boot.js` | Starts the app. |
| `src/page-head.html`, `src/page-tail.html` | The page around the scripts (CSS, fonts, HUD markup). |

Edits made inside the recovered files (`core.js`, `view.js`) are marked with a
`// LIFE:` comment. `tools/patch-view-phase1.py` records the view edits.

## The time model

- Simulation time `world.t` is **seconds of real time** since the valley began.
  The simulation is event-driven: a heap of timed events (`schedule()`), and
  `runUntil(world, t)` processes every event up to `t`. Event kinds: `A` a
  creature's action ends, `W` world tick (every 60 s), `R` weather change,
  `L` life check (every 600 s, `lifeTick` in `life.js`).
- One valley day is one real hour (`VALLEY_DAY = 3600`, `world.cycle.len`).
  Night is roughly 38% of each valley day.
- Dates are real: `world.calStart` (epoch ms at t = 0) and `world.tzMin` (the
  player's time-zone offset then). `seasonAt(world)` gives astronomical,
  Northern Hemisphere seasons.
- **Every moment is simulated in full**, watched or not. There is no coarse mode.
- Live: each frame runs `runUntil` up to now. In a hidden tab a 1-second timer
  does the same. After a gap of more than 30 minutes, the page saves the world,
  replays the gap in a Web Worker with the same code, and loads the result
  (`src/view/catchup.js`). Gaps under 30 minutes replay on the page in 40 ms slices.
- Everything random comes from `world.rng` (seeded), so a replay is identical to
  a live run. `tools/determinism.cjs` proves it with a state hash.
- `devNow()` is real time plus the developer offset; use it, never `Date.now()`,
  for valley time in the app.

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

## Saves

- IndexedDB database `creekfolk`, store `saves`, keys `main` (every 20 s and on
  hide) and `backup` (at most every 10 minutes). A first-Creekfolk save in
  localStorage is moved over on first load.
- Format: `saveWorld()` JSON (version 1). The rng state and the event heap are
  saved, so a load continues exactly. `upgradeWorld()` runs after every load.
- Bounded growth: memories 48 per creature, log 500, history 400, timeline 1440,
  population log 1600, downstream list 400. `lineage` grows by about 450 small
  records a year.
- Export/import of a backup file is in Settings.

## Developer menu

Ctrl+Shift+D (Cmd+Shift+D), or open the page with `#dev`. Jumps of an hour, a
day, a week or 1–12 months, or to a chosen date; each is replayed in full (it is
the same code path as a real absence). Shows population and reads any mind. The
offset is stored per browser in localStorage (`creekfolk.dev.v1`), never in the
save.

## Tests

```
node tools/build.mjs --dev
node tools/determinism.cjs 20            # replay == live == save/reload, by state hash
node tools/year.cjs --seeds 4 --days 365 # whole years headless, checks the year's targets
node tools/browser-test.mjs 3            # headless Chromium: new valley, dev jump via worker, reload
```

`year.cjs` accepts `LIFE='{"pairBirthDays":4}'` in the environment for tuning.
Results go to `runs/`.

## Conventions

- Plain language in anything the player reads. No numbers in the player's UI
  unless they mean something (ages in days are fine).
- Gender-neutral: creekfolk are "they".
- Keep the page one self-contained HTML file with no network requests except the
  fonts already inlined.

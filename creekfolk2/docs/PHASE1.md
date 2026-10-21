# Phase 1: the foundation

The playable files are `releases/creekfolk2-phase1.html` (the game) and
`releases/creekfolk2-phase1-dev.html` (the same game with a Dev button that works on a phone,
and its own saves). Each is one file that works offline. Open it in a browser, press **Follow
them**, and the valley begins: eight young creekfolk come down the creek from the old valley
and wake in a meadow by a spring.

Build `cf2-1`. Its saves live in the browser under `creekfolk2-1` (`creekfolk2-1-dev` for the dev
file). A Creekfolk 1 valley, or one from a later Creekfolk 2 build, is refused in plain words.

## What the brief asked for, and what there is

**1. How Creekfolk 1's minds and creek work, in plain words.** `docs/HOW-CREEKFOLK-WORKS.md`:
time, a mind (needs, temperament, learning by trying and by watching, trust, memories, words
and accents, stories that drift into myths), the creek (the drop rule, why sediment only builds,
how floods spread over the floor, the water table, "wet at the driest"), and what Creekfolk 2
changes. Everything comes over.

**2. The new valley at real scale, on What the Water Brings' renderer.**
- 160 m across and 224 m along the creek (Creekfolk 1's was 80 by 160), with the floor that can
  become wetland, terraces either side, hills at the rim, a limestone bluff on the east side, a
  limestone ledge across the creek where the cutting-down stopped (the creek is shallow above
  it and deep below, with a little fall), the Dry Fork coming down off the bluff over the Dry
  Falls (dry most days, a torrent in a storm), and a spring branch that never dries.
- Creekfolk are person-sized beside a creek of Creekfolk 1's size; homes and the village are
  built 1.5 times bigger, and they notice things from 1.5 times further.
- What the Water Brings' renderer is ported to three.js r186 (`docs/R186-PORT.md`: 22 of 28
  comparison views identical to the pixel, the rest differ by a few pixels on held props).
  The valley is drawn the way What the Water Brings draws its own: 32 m tiles, ground typed by
  material, the pixel pass with its palette, ink outlines, dithering, the light through the day.
  Everything it shows comes from the simulation: the ground's shape and colour (green, straw,
  dust, marsh, mud, worn paths) from the water table and the creek model, the creek's water at
  each point's own level, standing water as a sheet with real shores, trees and plants from the
  simulation's plants, every structure level by level, and while it is being built.

**3. Creekfolk 1's simulation, ported.** The simulation (creek, water, seasons, minds, lives,
stories, saves) is Creekfolk 1's own code, copied at 3B and then merged with 3C, with Creekfolk
2's changes in its own files and every edit to Creekfolk 1's files listed in `docs/MERGE.md`. It
runs in a Web Worker the whole time (live, catching up after a gap, saving); the page only draws.
From 3C: inherited looks, homes with porches, hearths and things by the door, the memorial grove,
the beavers, the sky stones and the glowing fish run. The temple, the Hall of the Ancestors and
gifts sleep for now (Creekfolk 2 has no giver).

**4. Zoom from dots to faces.** Wheel, pinch, or + and -; drag to move; right-drag (or two
fingers) to turn and tilt; tap a creekfolk to follow it. From the air each creekfolk is a dot in
its family's colour; nearer, a small pixel sprite built What the Map Forgot's way (letter grids);
close in, a full creekfolk built like What the Water Brings' Sheet king, on its rig. Both carry
Creekfolk 1's 3C looks (fur colour, stripes, saddle, patches or spots, a mask or a blaze, pale
paws, what they wear for what they love) and a cloth pattern that runs in each family line.

**Beyond the brief's Phase 1: the valley's life and air.** What the Water Brings' creatures
(heron, turtles, minnows, frogs, dragonflies, butterflies, teal) live where this valley gives
them a place, and their numbers follow how wet and green it is, so a cut-down creek has few and
a healed wetland has them everywhere; they scatter, plop in or fly off when a creekfolk comes
near. Its air: rain and storms with lightning, snow on the cold days of deep winter, mist on the
water at dawn, fireflies at summer dusks, falling leaves, swallows. The light follows the
valley's hour and its year (the sun rises far to the south-east at midwinter, where the sky
stones point). Trees go bare in winter and gold in autumn; windows and porch lanterns are lit at
night. All of this is drawing only: it never changes the simulation.

**5. Offline, with the clock guards.** No network requests (checked). If the clock goes back,
the valley waits. If it jumps more than 90 days ahead, the page asks whether to replay it all or
treat the clock as wrong. Settings can set the valley's clock and save or open a backup file.

**6. Catch-up benchmarked, determinism proven.** See below.

## What was measured

Everything here was run on this machine (a cloud container, shared with other work while
these ran, so speeds are on the slow side). Nothing was measured on a phone or a real GPU.

| What | Result |
|---|---|
| Determinism (`tools/determinism.cjs`): live, replayed in uneven slices, saved and reloaded | identical state hashes |
| A month headless, two valleys at once (`tools/month.cjs`) | 30 days in 316 s and 324 s (about 8,000 times real time), no errors; saves 1.2 and 1.3 MB |
| Catch-up of 30 days in the browser's worker, from a day-15 valley of 23 creekfolk (`tools/bench-browser.mjs`) | 7.8 minutes (5,520 times real time) |
| The rules in a browser (`tools/browser-test.mjs`): new valley, jumps, reload, the clock guards, pause, the sheets, refusing other builds' saves, no network | 20 of 20 pass |
| The 3D view live (`tools/tour.mjs`): every zoom, following, drifting, overlays, storm, flood, beavers, sky stones, fish run, a jump | 16 of 16 pass, no page errors |
| Screenshots of the valley from the air to a face, new and at a month, in all four seasons, at dawn, by day, at dusk and at night, in a storm; the creatures and the air; the interface on a laptop and a phone | looked at one by one; a selection is in `docs/img/phase1/` (`valley.jpg`, `close.jpg`, `life.jpg`) |

## What isn't right yet

- **The creek heals far too slowly.** At day 30 the two test valleys stayed 8% and 30% wet at
  their driest; the brief wants the floor mostly wet by week 4. This is the first thing Phase 2
  tunes (dam building, how fast trenches fill, how far floods spread).
- **The founders pass a few days early** (days 26 to 29); the brief wants the last founder to
  pass between days 28 and 32. Phase 2.
- **Standing water on the floor has straight edges along the valley** where the simulation's
  water table steps from one creek point to the next. The drawing smooths it; the cause is in
  the model.
- **The beavers come after day 120**, Creekfolk 1's rule; the brief puts them in Phase 3.
- **Close up, what creekfolk do is laid over three clips** (walk, sit, idle): sleeping curled up,
  working bent over, talking with their hands, hopping, eating, carrying what they carry. There
  are no hand-made clips for these yet.
- **The small creatures only read close in.** At real scale a frog, a minnow or a dragonfly is a
  few pixels until the view is down to about 6 to 12 m.
- **Snow falls but doesn't lie on the ground yet.**
- **The creatures' "a healed wetland is full of them"** has only been seen by pretending, on
  the page, that the floor had healed: the real test valleys are still dry (see the first point).
- **No sound.**

## What I couldn't test

- Speed on a phone, or on any real graphics card: the browser here draws with SwiftShader, in
  software, at one or two frames a second, so it says nothing about smoothness. The dev menu
  reports, after a jump, how long 30 days would take on the device it runs on.
- Touch on a real phone (the phone screenshots are an emulated phone).
- A valley left running for weeks in a real browser tab (memory over time).

## What I'd do next (Phase 2: the founders' arc)

Healing at the brief's pace, the founders' culture as they arrive, life stages tuned so the last
founder passes around day 30, homes and gardens through the month, and the three records of
time (mud layers, carvings, then-and-now, the chronicle).

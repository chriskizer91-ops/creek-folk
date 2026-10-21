# What the Water Brings: the polished version

A game made as a gift. The Philosopher King walks a creek valley picking up what the water has brought.

This public copy leaves out the character card's portrait (`src/card_assets.js` holds blank images in its place) and the names of the people the game was made for.

## Build

    python3 build.py        # writes out/game.html: one offline file, three.js inlined

The source was recovered from the published first draft (version 4 of the first-draft artifact): the page was split back
into its modules, and the build puts them together again byte for byte (checked when it was recovered, commit 91b9ddd).

- `src/template.html` the page, the HUD and the parchment sheets (`/*@@THREE@@*/` and `/*@@GAME@@*/` mark where the scripts go)
- `src/ORDER` the order the modules are joined in
- `src/core.js`, `skin.js`, `cloth.js`, `body3.js`, `wear.js`, `king3.js` the shared rig and the lifelike king (the rig and clips are used)
- `src/toon.js` the palette-ramp toon material every surface uses (PKToon.rampMat, PKToon.FX), and the first pixel king
- `src/toon2.js` the Sheet king, the one in the game
- `src/pixel3d.js` the pixel pass (palette snap, outlines, contact shading, grading, haze, sky, night glow, Easy to see pool)
- `src/card.js`, `card_assets.js` the character card
- `src/valley.js` the valley (terrain, creeks, water, trees, plants, landmarks, poem stops)
- `src/finds.js` all the words: finds, poems, commonplace lines, credits
- `src/life.js` the creatures
- `src/main.js` the game
- `vendor/three.min.js` three.js r128

## Tools

- `tools/shots.py out/game.html shots/x tools/look.json [w h]` scripted screenshots (spots, hours, storm, easy, phone)
- `tools/sheet.py dir out.png [cols scale]` a contact sheet of a folder of shots
- `tools/smoke.py` opens every poem stop and checks the pages
- `tools/perf.py a.html b.html` compares drawing cost (software rendering: only the ratio means anything)
- `tools/dbg.py "js" out.png` runs a snippet in the page and takes a picture

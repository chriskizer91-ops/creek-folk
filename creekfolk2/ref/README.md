# Reference sources

The author's other games, kept here whole, exactly as the author gave them, so their
source is saved openly and not only on a phone. They are reference: Creekfolk 2 copies
from them, but nothing here is part of its build. Don't edit them.

- `what-the-water-brings/`: What the Water Brings, the polished version. A pixel-art 3D walk
  through a North Texas creek valley, made by the author as a gift (three.js r128,
  `python3 build.py` builds it). Its renderer, valley and creatures are Creekfolk 2's
  starting look: `pixel3d.js`, `toon.js`, `toon2.js` with the rig and clips from `skin.js`
  and `king3.js`, `valley.js`, `life.js`, `cloth.js`, `core.js`, and `tools/shots.py`,
  `sheet.py`, `perf.py`. The lifelike king, the finds, the poems and the card belong to
  that game and its people and don't come into Creekfolk 2, and neither do their names.
  _Not added yet: waiting for the author to confirm it should be public in full,
  including the character card's portrait._
- `creek-care/`: Creek Care, a creek and stormwater sandbox. Creekfolk 1 already ported its
  river model (`src/river-core.js`, also in `../../ref/`). Useful for what that port left
  out (bends migrating and oxbows, `P._migrate` and `P._cutoffs`), its calibration
  (`tools/river-calibrate.js`) and its tests.

Also given with the brief, and already kept elsewhere in this repository: the Creekfolk 1
Phase 3B builds (`../../releases/creekfolk-phase3b.html` and `-dev.html`, the same files
byte for byte). What the Map Forgot, whose look the author also pointed to, has its own
repository (`chriskizer91-ops/what_the_map_forgot`).

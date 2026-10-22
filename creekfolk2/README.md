# Creekfolk 2: the Leavers

Eight young creekfolk leave the first valley and follow the creek downstream to a new
one, cut down and dry every summer, and spend one real month, their lifetime, healing it.

This folder is the home of Creekfolk 2. Everything else in this repository is Creekfolk 1
(see `../CLAUDE.md`); Creekfolk 2 descends from it, in its story and in its code.

Phase 1 (the foundation) is built: the new valley at real scale, Creekfolk 1's simulation
(with its 3C) running on it in a worker, drawn with What the Water Brings' pixel renderer,
from the air down to a creekfolk's face (`docs/PHASE1.md`). Phase 2 (the founders' arc) is
built: the creek heals in the founders' month, the eight arrive with the old valley's craft,
words, customs and stories, the last of them passes near day 30, and the valley keeps three
records of time (the mud in the creek's bank, carvings in sand, clay and stone, the
chronicle), with then and now (`docs/PHASE2.md`). The playable files are in `releases/`.

- `docs/BRIEF.md`: the author's brief for Creekfolk 2.
- `docs/DECISIONS.md`: what has been decided since the brief, and why. It wins over the
  brief where they disagree.
- `docs/HOW-CREEKFOLK-WORKS.md`: Creekfolk 1's minds and creek, in plain words.
- `CLAUDE.md`: how the code is laid out, built and tested.
- `ref/`: the source of the author's other games that Creekfolk 2 draws on, kept whole
  (see `ref/README.md`).

Build: `npm install`, then `node tools/build.mjs` (makes `dist/creekfolk2.html` and
`dist/creekfolk2-dev.html`, each one self-contained file that works offline).

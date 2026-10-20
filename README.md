# Creekfolk

A valley that lives for a real year. Small creekfolk live beside a creek: they learn from
each other, invent words, tell stories that drift into myths, build, pass on peacefully
and are remembered with a tree, and slowly turn a cut-down creek into a wetland. The
player mostly watches, and gives a gift every twelve hours. Every moment is simulated,
whether or not anyone is watching.

## Play
Open a build in a desktop browser (phones work too). Each build is one self-contained
HTML file and keeps its own saves.

- `releases/creekfolk-phase2.html`: the latest finished phase (minds, stories, the gift).
- `releases/creekfolk-phase1.html`: lives, the real calendar, catch-up.
- `releases/creekfolk-original.html`: the first Creekfolk, before this project.
- `dist/`: the build of whatever branch you are on.

## Build and test
```
npm install
npm run build          # dist/creekfolk.html (minified) and dist/sim.cjs
npm run build:dev      # unminified
npm test               # build + replay determinism
npm run test:year      # two valleys for 30 days, headless
```

## For contributors (and other Claude instances)
Start with `CLAUDE.md` (architecture) and `docs/HANDOFF.md` (where things stand, how to
split the work, the author's rules). The design for the current part is in `docs/`.

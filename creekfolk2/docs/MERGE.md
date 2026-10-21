# Merging Creekfolk 1 into Creekfolk 2

Creekfolk 2's simulation (`src/sim/`) started as a copy of Creekfolk 1's at commit
`8e9ec93` (Phase 3B). When Creekfolk 1's 3C (or anything later) arrives, merge it as a
three-way merge per file, with `8e9ec93` as the base, Creekfolk 1's new version as theirs
and Creekfolk 2's as ours, e.g.

    git show 8e9ec93:src/sim/life.js > /tmp/base.js
    git merge-file creekfolk2/src/sim/life.js /tmp/base.js src/sim/life.js

Creekfolk 2 changes Creekfolk 1's files in two ways, both listed below:
- **Edits in place**, each marked `// CF2:` in the code. `git merge-file` handles these;
  check every conflict by hand.
- **Replacements**: a Creekfolk 1 function or value replaced from a Creekfolk 2 file loaded
  later in the same scope. A merge won't show a conflict for these, so for each one listed
  here, compare Creekfolk 1's new version of the function with the old one and carry the
  change into the replacement by hand.

After a merge: rebuild, run `tools/determinism.cjs` and the catch-up benchmark, and
report what was merged and what was left out.

## Edits in place

_(none yet)_

## Replacements

_(none yet)_

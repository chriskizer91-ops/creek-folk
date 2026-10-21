# Creekfolk 1's 3C in Creekfolk 2

Merged 2026-10-21 from Creekfolk 1's branch `phase-3c` (commit `59d5e4b`, its report
`docs/PHASE3C.md` there), with `8e9ec93` (3B) as the base. Two commits: the merge as it
came, then Creekfolk 2's adaptations to its real-scale valley. Every edit and replacement is
listed in `docs/MERGE.md`; the base for the next merge is `59d5e4b`.

## What was merged

- **Looks** (`looks.js`, unchanged): 24 fur colours in a ring, coat patterns, face markings,
  pale paws, a family colour for what they wear, all inherited whole from one parent or the
  other with small chances of something new; grown-ups wear something for their passion
  (`sig`); believers wear their treasure (`c.treasure`, from gift.js). Drawn Creekfolk 2's way
  later; the sim only decides what is passed down.
- **Homes** (`homes.js`, unchanged): decorations by the door from what the owner loves, the
  porch and hearth (comfort, not room), a fourth garden bed, a second garden at 8 homes and a
  third at 14. Homes and gardens were already 1.5 times bigger (`STRUCTURES.radius`); 3C adds
  levels, not sizes, so nothing else needed scaling.
- **The memorial grove** (`grove.js`): kinds by family, growth all year, nurse logs, bounded
  (240 standing, 24 logs). Scaled to real size (below).
- **Goats with kids, old goats, wool blankets** (`grove.js`, and a hook in `fauna.js`).
- **The beavers** (`beavers.js`), with 3C's arrival rule kept for now (after day 120 once 55%
  of the floor stays wet at the driest, or by day 210 whatever; Creekfolk 2's Phase 2 moves it
  to week 4). The lodge, kits, tending and raising dams, and the little side dams on the floor
  whose water `creekCellWater` adds to the water table.
- **The sky stones** (`skycal.js`), and the midwinter-morning gathering there.
- **The glowing fish run** (`returning.js`): at midwinter, once at least 70% of the floor stays
  wet at the driest, in a valley with no temple. This is Creekfolk 2's fish run.
- **Coming home** (`minds.js`): a visitor sometimes stays, with a fresh mind but their own name,
  family, looks and ties, and the dam craft.
- **Legends** (`minds.js`): a story a third of the village still tells after 40 days is kept,
  24 at most. And the new news from downstream (the next valley turning green).
- **What keeps it bounded**: the grove's caps and logs, legends (24), beavers (6), side dams,
  goats (8), blankets (one a home), the home decorations (3 a home).

## What was left out, and why

- **The temple, the Hall of the Ancestors, the procession path and the Returning festival.**
  The code is there but never starts: `cf2-belief.js` already stops the temple and the Hall,
  and 3C's path and festival both wait for `w.temple.state === "done"`. The dev triggers say
  so ("returning" brings the fish run, "path" answers "no finished temple"). Checked: no
  temple, Hall or path appeared in any run, dev-triggered fish run or natural one.
- **3C's view, sound and then-and-now** (`src/view/*` in Creekfolk 1): Creekfolk 2 has its own
  renderer. Herons, butterflies and mist were view-only in 3C (rules below, for the renderer).
- **3C's tools** (year runner changes, grove and looks tests). I ran its `grove-test.cjs`
  against Creekfolk 2's sources from a scratch copy; it isn't in `tools/`.

## Conflicts

None in the text. Creekfolk 2 had edited only `core.js` and `creek.js`, on lines 3C didn't
touch; the other seven merged files were unchanged in Creekfolk 2 and are now exactly 3C's.
Of the replacements, 3C changed only `creekCellWater` (the beavers' side-dam water, inside
the original, which Creekfolk 2's wrapper runs) and added two `STRUCTURES` (sky stones and
path), which Creekfolk 2's scaling loop scales because they load before it.

## What worked differently in Creekfolk 2's valley

- **Real scale.** 3C's grove assumes Creekfolk 1's small creekfolk: 1.7 m between trunks, a
  19 m grove. Creekfolk 2 lays it out 1.5 times larger (2.55 m, 28.5 m), scaling every length
  in the placement and the fallen logs (`// CF2:` in `grove.js`), so the renderer should draw
  memorial trees and logs at 1.5 times Creekfolk 1's size. The sky stones (3.9 m, like the
  other structures) and where creekfolk stand at them are scaled the same way. 3C's own
  witness radii use `CF2_SCALE.see`, as `witnessesNear` does.
- **The wider floor.** The beavers looked for side-dam sites within 18 m of the creek, which
  covered Creekfolk 1's floor; Creekfolk 2's is about 1.7 times wider, so the search is too,
  and the floor (about 2.4 times the area) gets up to 29 side dams instead of 12.
- **Eight founders.** The grove's giants are the first `LIFE.founders` (eight); its log line
  said "the first five".
- **The fish run swims toward the old valley**, as DECISIONS.md #5 has it. 3C says "all the way
  to the spring", and in Creekfolk 2 the spring is the branch inside the valley, so the
  fish run's two log lines, its story and the memory say "on up toward the old valley".
- **Placement in this valley**, checked on day-30 saves: the grove's centre was on the west
  terrace 46 to 48 m from the meadow, every tree off the floor (floor weight 0) and 38 to 51 m
  from the spring branch, trunks 2.6 to 5 m apart; the sky stones on the terrace 23 and 64 m
  from the creek, overlapping nothing; the beavers' lodge (dev trigger) beside the deepest
  pond: on day 30 in both valleys in the deep trench just below the ledge (z 102 and 110), on
  day 20 in valley 2 at z 50; side dams spread across the floor 4 to 22 m either side of the
  creek. The creek is still cut down then, so the lodge stands on the bank 0.02 to 0.42 m
  above the pond; by 3C's arrival rule (day 120 and a wet floor) the ponds would be full.
- **Not from 3C, but seen in the maps:** in valley `cf2-2` a pond's water stands over a broad
  sheet of the upper floor with straight edges (around z 20 to 85). The pre-merge code does
  the same at day 20, so it is Creekfolk 2's creek model on its flat floor, not the merge.

## Tests

All on this machine, which other sessions were loading heavily (load average 9 to 17 on 4
cores), so single timings move by tens of percent.

- **Determinism** (`tools/determinism.cjs 6`): one replay, uneven slices, and four saves and
  reloads all end in hash `91d61907ce79012d` after 6 days. PASS. The new valley is
  byte-identical before and after the merge (same save hash at day 0), so the day-0 map is
  unchanged.
- **Browser** (`tools/browser-test.mjs`, minified build): all 20 checks pass (a day replayed
  through the worker in 7.3 s; no network requests, no page errors). It needs a Creekfolk 1
  save at `runs/cf1-save.json` (not in the repository); I made one with Creekfolk 1's
  `dist/sim.cjs`.
- **Month** (`tools/month.cjs --seeds 2 --days 30 --every 3`), no simulation errors in any run:

  | Day 30 | cf2-1 before | cf2-1 after | cf2-2 before | cf2-2 after |
  |---|---|---|---|---|
  | Creekfolk (children/adults/elders) | 19 (1/14/4) | 20 (4/14/2) | 15 (1/11/3) | 22 (4/15/3) |
  | Born, passed, gone downstream | 24, 8, 5 | 25, 8, 5 | 25, 8, 10 | 23, 8, 2 |
  | Land feeds | 27 | 27 | 29 | 30 |
  | Wet now / at the driest | 0.11 / 0.10 | 0.09 / 0.08 | 0.29 / 0.27 | 0.33 / 0.30 |
  | Homes, built things | 25, 42 | 23, 44 | 22, 40 | 24, 46 |
  | Save | 1233 KB | 1170 KB | 1116 KB | 1322 KB |

  The runs part at day 6 (3C changes what creekfolk choose: decorations, more gardens); the
  differences between them are of the size two seeds differ by.
- **Speed**, the code before and after the merge run side by side at the same time (four
  processes, 2 seeds each, Node, the load average falling from about 10 to 5 meanwhile):

  | 30 days | cf2-1 | cf2-2 | per 3 days, both |
  |---|---|---|---|
  | Before | 394 s (6,577 times real time) | 377 s (6,883) | 38.5 s |
  | After | 385 s (6,728) | 396 s (6,544) | 39.1 s |

  About 1% slower, which is inside the noise: single 3-day steps moved between 19 and 69 s.
  (Run alone earlier, at heavier load, before took 525 and 502 s and after 429 and 442 s; I
  don't count that as a speed-up.) Inside a month nothing 3C adds is costly: the beavers
  never come. **With the beavers** (dev trigger on the day-30 valleys, 3 days, run side by
  side with the same valley without them): 42.0 against 37.2 s and 30.6 against 24.0 s, but
  the valleys with beavers also ended with more creekfolk (25 against 24, 26 against 21: the
  wetter floor feeds more), so per creekfolk it is about 3 to 8% more. 3C names the
  beaver-watching check at dusk (`beaverWatchOption`, a `randomPoint` for each creekfolk's
  choice) as its main new cost; worth a look when Phase 2 brings the beavers in week 4. The
  browser test's one-day jump through the worker ran at 7,559 and 12,223 times real time
  (about 4 to 6 minutes for 30 days at that rate).
- **Features in this valley** (a scratch script on the day-20 and day-30 saves of both valleys):
  the sky stones are begun just after the first midwinter morning (day 7.0) and finished on
  day 13.0 in both valleys, with the midwinter-morning gatherings on days 15, 23 and 31; looks
  pass down (a child of fur 3 and fur 8 parents has fur 4; markings come whole from one
  parent); 39 decorations by day 20 (valley 2), 57 and 53 by day 30, one porch by day 30 in
  valley 1 (none in valley 2), three gardens in both by day 30; beavers brought by the dev
  trigger on day 20 or 30 make 13 to 25 mendings and 6 to 13 raisings in 2.2 days, build 14 to
  22 side dams, have kits when spring comes, and the floor's wetness goes
  from 0.09 to 0.48, 0.21 to 0.48 and 0.33 to 0.62 in those 2.2 days; a save and reload in the
  middle of it continues exactly; the fish run comes on midwinter night (day 31.03) once the
  creek counts as healed, and by dev trigger, with no temple, Hall or path; no errors.
- **The grove over two years** (3C's `grove-test.cjs` on Creekfolk 2's sources, from a day-30
  valley, about 0.75 made-up passings a day): about 150 to 170 trees stand after the first
  year (most 169), never more than 24 logs, the grove's saved state flat (31 to 35 KB), the
  farthest tree 28.5 m from the centre, families cluster (same-kind neighbours 0.67 against
  0.27 by chance), save and reload keep it exactly; goats: 15 kids in 120 days, the herd at
  most 8, blankets made. PASS.

## For the renderer (and the worker)

What the drawing will need from the simulation. `cf2-worker.js` already sends each creekfolk's
`look`, the structures and `res` (JSON-compared) and `w.fauna`, so some of it arrives now; the
rest isn't sent yet.

- **Looks**, arriving with `look`: `fur` (0..23, `LOOKS_FUR[fur]` = hue, saturation,
  lightness), `pat` (none, spots, stripes, saddle, patches), `pale`, `face` (none, mask,
  blaze), `socks`, `dye` (0..7, `LOOKS_DYES`), `wear` (lilypad, apron, sunhat, satchel, bells,
  scarf, flower; null for children). The ages: `stage`, `born`, `lifespan` (sent). Not sent:
  `c.treasure` and `beliefs.giver` (a believer wears the treasure: `looksWearsTreasure`).
- **Homes**, arriving with the structures: `deco = { by, since, list: [{ k, at, h }], shown,
  old }` (the first `shown` items are out; kinds flowers, stones, chimes, basin, carving,
  pennant, bench); the door in the owner's fur colour; levels 7 (porch) and 8 (hearth, its
  chimney smokes on cold evenings) of `STRUCTURES.home`; gardens have 7 levels (the fourth
  bed), and there can be three gardens.
- **The grove**: memorial trees are `res` of kind `grove` (sent) with `tk` (oak, pine, willow,
  birch), `planted`, `fall`, `kin`; size from `groveSize(w, tree)` (1 = a young full tree, up
  to 4.4). Draw them about 1.5 times Creekfolk 1's size. The nurse logs are `w.grove.logs`
  (`x, z, rot, len, r, tk, fell`; how rotten: `groveLogDecay(w, log)`), not sent yet.
- **Goats** (in `w.fauna`, sent): kids have `mom` and `born` (grown after 4 days), `doe`;
  `w.fauna.blankets` (home id: when made).
- **The beavers**, not sent yet: `w.beavers = { arrived, lodge: { i, x, z, sid, size, side },
  list: [{ id, age, x, z, px, pz, pt, at, task }], small: [{ x, z, t }], raised, mended }`;
  a beaver moves from (px, pz) at pt to (x, z) by at. The lodge sits at the pond's level.
- **The sky stones**: a structure of kind `skycal` (sent), `rot` = `SUNRISE_DIR`
  (atan2(0.9, 0.45): the midwinter sunrise toward +z and a little +x, from the 3B temple
  code); the parts done: `skycalParts(w)`. Creekfolk 2's sky should put the midwinter sunrise
  that way, or the constant should change. `w.skycal` isn't sent.
- **The fish run**, not sent yet: `w.returning.active = { fishOnly: true, dawn, dusk, end }`;
  the fish swim up the creek's nodes from the bottom of the valley toward the old valley
  between `dusk` and `end`; `w.returning.fishRuns` counts them.
- **Legends** (`w.legends`), returnees (`w.stats.returnees`, `lineage[id].returned`): for the
  sheets, which load a whole copy of the world.
- **Herons, butterflies, mist** (view-only in 3C's `life-view.js`): herons 0 to 4 by the
  floor's wetness now (none below 0.28, then one more at 0.45, 0.6, 0.75), standing where
  water is 3 to 30 cm deep on the floor, at least 14 m apart, re-chosen every half hour, not
  at night; butterflies on summer days (fading in late spring and early autumn), none at
  night, in rain or snow, up to 64 times the greenness over the flowers; mist at dawn over wet
  floor, more in the wet season and as the wetland grows, less in heavy rain.
- **New dev triggers** (`devTrigger`): `beavers`, `skycal`, `returning` (in Creekfolk 2, the
  fish run tonight). Creekfolk 2's dev menu doesn't list them yet.

## What I couldn't do, or didn't

- The beavers and the fish run don't happen on their own inside a month (the beavers by 3C's
  rule; the fish run because the floor isn't 70% wet at the driest by day 30 in these runs:
  0.08 and 0.30). I tested them by dev trigger and, for the fish run, with the creek's driest
  record set to 0.75 just before midwinter.
- `BUILD_VERSION` is still `cf2-1` (I changed only `SIM_FILES` in `build.mjs`). A save from
  before the merge loads and carries on (tried: a day-20 valley ran a day with no errors; its
  looks and decorations filled in, and its sky stones began at once, its first midwinter
  being past), but the next build handed to the author should be `cf2-2`.
- Nothing was drawn: the renderer and the worker's messages are not part of this merge.

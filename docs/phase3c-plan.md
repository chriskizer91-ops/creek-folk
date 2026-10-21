# Phase 3C plan: life and the ending

Source: `docs/PHASE3-CHANGES.md` sections 2 (the sky calendar), 4 (beavers), 7, 8 and 9.
Branch: `phase-3c` (from `main` after 3B was merged). Build version: `3c`.

The author's answers before 3C: keep the 3B tuning as it is; no two-year runs, but check
the valley keeps running smoothly into month 13.

## Pieces and who builds them

The work is split between helpers, each on its own branch and its own files, merged into
`phase-3c` by the lead. Shared files (`core.js`, `view.js`, `hooks.js`, `api.js`,
`dev.js`, `build.mjs`) get only small, marked edits.

| Piece | What | Owner | Files |
|---|---|---|---|
| Looks | more fur colours, coat patterns (stripes, mask, socks, spots), all inherited; things to wear that match their passions; children with bigger heads, elders greyer with a walking stick; believers wear the treasure they found | helper "looks" | `src/sim/looks.js`, `src/view/looks-view.js` |
| Homes and places | the door in the owner's colour; decorations from what they love (flowers, stacked stones, chimes); more home levels; more garden beds and more than one garden; a cairn or signpost at every named place; scenery beyond the valley (a lake downstream, hills on the horizon) | helper "homes" | `src/sim/homes.js`, `src/view/homes-view.js` |
| Sound and then-and-now | a soundscape that follows the wetland (frogs, birdsong, insects); hold-to-see the valley as it was on day one | helper "sound" | `src/view/soundscape.js`, `src/view/thennow.js` |
| Grove and animals | grove tree kinds by love or family line; trees that keep growing; the oldest fall and become nurse logs; goats with kids and wool; butterflies in summer, herons, mist at dawn | helper "grove" | `src/sim/grove.js`, `src/view/life-view.js` |
| Beavers | arrive when the floor is as wet as it gets (month 5 to 7); a lodge; they take over dam-tending and hold the water higher | lead | `src/sim/beavers.js`, `src/view/beavers-view.js` |
| The sky calendar | stones that find their midwinter, finished before the second midwinter | lead | `src/sim/skycal.js` |
| The Returning | the procession path, the first Returning, every midwinter forever, what each one adds, the fish run for valleys without a temple, "the next Returning is in 3 days" | lead | `src/sim/returning.js`, `src/view/returning-view.js` |
| Endless running | limits for stories (legends), carvings, verses, lanterns; checked into month 13 | lead | the files above, `minds.js` |
| Leaving and coming back | a returnee may stay (a fresh mind, but its name, family, looks and old friends); news of the next valley healing | lead | `minds.js` |
| The First Pool | named forever; the procession passes it | lead | `minds.js`, `returning.js` |

## Rules for everyone

- **One shared scope.** All files are concatenated by `tools/build.mjs` in the order listed
  there; top-level names must not clash. Prefix new top-level names with the piece
  (`looks…`, `home…`, `sound…`, `grove…`, `beaver…`, `skycal…`, `returning…`).
- **Determinism.** Everything random in the simulation comes from `world.rng` or from a
  local `new Rng(seedString)` built from the world's seed and an id. Never `Math.random()`
  or `Date.now()` in `src/sim/`. New randomness for looks, grove kinds and decorations
  should use a local `Rng` (for example `new Rng(w.seed + ":look:" + c.id)`) so it doesn't
  shift the valley's main random stream. `node tools/determinism.cjs 6` must pass.
- **Saves.** New state lives on the world or the creature and is created lazily where it
  is first needed (a `xxxOf(w)` helper), so `hooks.js` needn't change. Everything new must
  survive `saveWorld`/`loadWorld` (plain JSON, no functions, no cycles) and stay bounded.
- **The view** only reads the simulation. New drawing goes in the piece's own view file,
  hooked into the existing classes by wrapping prototype methods (as `patches.js` and
  `belief-view.js` do) rather than editing `view.js`, wherever that is possible.
- **Plain language** in anything the player reads; creekfolk are "they"; no numbers in the
  player's UI unless they mean something. One self-contained HTML file, no network.
- **Tests a helper runs:** `node tools/build.mjs --dev`, `node tools/determinism.cjs 6`,
  `node tools/browser-test.mjs 3`, and screenshots of their work (`tools/view-world.mjs`
  on a saved valley, or a small tool of their own). No long year runs: the machine has two
  cores and the lead runs those at the end. A single `year.cjs --seeds 1 --days 30` is fine.
- `runs/worlds/final/e48-year-1-day300.json` (and `-day330`) are valleys from the 3B runs,
  with a finished temple, that the 3C build can load for looking at things.

## Decisions (lead's pieces)

### Beavers
- Arrive at the first world tick after day 120 when the last valley year's driest share is
  at least 0.55, or on day 210 whatever the creek (target: month 5 to 7).
- A pair comes up the creek and builds a lodge (a mound of sticks) in the biggest pond;
  kits later, at most six beavers. They are not creekfolk (`w.beavers`, like the goats).
- They take over raising silted dams (the "raise" chore), and build small dams of their
  own on side channels. Ponds behind their work stand a little higher, which feeds the
  water on the temple's steps.
- The creekfolk notice: a log line, a story, a word for beavers, "the Beaver Lodge" as a
  named place.

### The sky calendar
- After their first midwinter, an elder notices the sun rises further along the hills each
  morning and starts a ring of sighting stones on the terrace (a structure, `skycal`, built
  with ordinary labour). Finished, it lets them say "midwinter is in N days", and the
  midwinter gathering is held there. Target: usually finished before their second
  midwinter (real day 15).

### The Returning
- When the temple is finished, they spend three valley years (24 real days) laying a
  procession path from the temple past the First Pool up the creek to the Spring (stones
  and lantern posts, built as labour). First Returning on the first midwinter after the
  path is done: month 12 for an every-other-day giver.
- At midwinter dawn the sunrise lines up through the crown and the water on its steps turns
  gold; that night glowing fish swim up the creek all the way to the spring, the village
  lines the channels with lanterns, the beavers and fireflies are out, and the one who
  believes in you looks up at the camera.
- It comes back every midwinter, forever. Each one adds a lantern on the pyramid for each
  creekfolk who passed since the last, a new carving, a new verse to their song.
- "The next Returning is in N days" in the Temple tab and the HUD.
- Valleys without a finished temple get the fish run at midwinter once the creek has
  healed (driest share at least 0.7), without the sunrise or the festival.

### Endless running
- Very old stories that few hold merge into a bounded list of legends. Carvings, verses,
  lanterns: kept as counts plus the most recent few. Checked by running a valley into
  month 13 (day 390) and comparing speed and save size with day 300.

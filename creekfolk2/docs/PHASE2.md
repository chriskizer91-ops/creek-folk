# Phase 2: the founders' arc

The playable files are `releases/creekfolk2-phase2.html` (the game) and
`releases/creekfolk2-phase2-dev.html` (with the Dev button). Build `cf2-2`: its saves live under
`creekfolk2-2` (`creekfolk2-2-dev`), so a Phase 1 valley is refused in plain words and Phase 2
starts a new one.

## What the brief asked for, and what there is

**The healing arc.** The creek now heals in the founders' month. Four test valleys (the final
code, `tools/month.cjs --seeds 4 --days 32`), wet at the driest point of each valley year:

| | by day 6 | by day 14 | by day 22 | by day 30 |
|---|---|---|---|---|
| plan | under 5% | 10 to 30% | 40 to 70% | 70 to 90% |
| cf2-1 | 2% | 30% | 65% | 76% |
| cf2-2 | 2% | 12% | 71% | 80% |
| cf2-3 | 2% | 11% | 75% | 89% |
| cf2-4 | 2% | 5% | 63% | 90% |

Day 30 is in range in all four. Days 14 and 22 swing with each valley's weather (a wet season
with many storms runs ahead, a slow one lags): day 14 is in range in three of four, day 22 in two
(the other two a little ahead, at 71 and 75%). A six-valley run of the arc alone (before the culture was merged), to
day 46, gave the same picture and showed the healed valley then holding at 85 to 93%. How it
moves fast and stays true:
- the mud comes off this valley's own hills and down the Dry Fork (the old valley upstream has
  healed, so its creek runs clear);
- dams are begun, built up and raised at low water, in the dry season, from the bottom of the
  creek up (about 4 dams by day 6, 8 by day 14, 13 by day 22, 16 to 18 by day 30);
- ponds soak sideways into the floor, so a healed floor holds its water through the dry season,
  and their water spreads onto any ground lower than it, so shores follow the ground;
- the floor settles (deposits taper off about 0.3 m above where it started), side channels fill
  near each spill while floods wear new ones;
- storms come in fronts (5 to 9 a wet season).

**Life stages tuned to the month.** In all four valleys: the founders pass between days 25.4 and
29.6, the last on day 29.3 to 29.6; the first child is born on day 0 to 1.7, the first grandchild
on day 10.6 to 13.3 (grown before the last founder passes), the first great-grandchild on day 18.7
to 24.2; 29 to 31 creekfolk live in the valley at day 30 (the land feeds 36). Couples form in the
first hour, as Creekfolk 1 allows any friend over 9 days old to pair.

**The founders arrive with their culture.**
- *The craft*: they know dams (from the bottom of the creek up), mud, tools and planting from the
  old valley ("knew it from the old valley" in a creekfolk's sheet); the first dam goes in on the
  first day. Clay and the glowing mushrooms are still this creek's to teach.
- *Each other*: a travelling party's bonds (warm, familiar, trusting; two close friendships).
- *Words*: 33 of the old valley's words in its accent; about one founder in five says a word their
  own way. Children say a word a little differently now and then, and invent their own before
  they hear the old one: at day 30 about one use in six is another word, though every old word
  but one is still said the old way by most. The Ways tab shows the words the young say
  differently.
- *Customs*, there on day one: an offering at a passing, gathering when the season turns, and
  thanking the creek when the rains come back (at the first storm here, then the first storm of
  each wet season). The history says why they do it while it can: "the old valley's way" while a
  founder is there, "the way the first eight did" while someone tells of the creek that gave,
  and after that "as creekfolk always have, though no one can say anymore why".
- *Stories of the old valley*, seven of them and already drifted: the leaving, a flood, the
  glowing fish, how the old valley healed, how dams should be built, the creek that gave, the one
  who waved at the sky. Their children hear them and retell them; deeds drift to the teller's
  own founder ancestor. At day 30, three to six of the seven are myths in each valley. When the
  glowing fish first run here, the history says "It was just as the stories of the old valley
  said" if anyone still tells it. Belief that the creek gives stays asleep: they bring the word
  for it, not the faith.

**Homes and gardens** come from Creekfolk 1's building, at this scale: 24 to 26 homes and 50 to
52 things built by day 30.

**The three records of time.**
1. *What happened, written in the land.*
   - Every flood lays a band in the creek's bank at every point of the creek: grey gravel where
     the water ran, dark wet-season mud and pale dry-season silt where it stood. The Land tab
     shows the bank behind the first dam, cut through, true to size beside a column of the bands
     thick enough to see, with the year marks and the dam; tap the creek anywhere to see its bank
     there. By day 30 the deepest pond holds 0.8 to 1.2 m of it.
   - The grove's oldest tree has a ring for every winter since it was planted (Land tab).
   - Every repair leaves a patch of fresher mud on the wall.
   - Where a pond stands over the floor, its dam carries on across the floor as a low bank of mud
     and sticks.
   - **Then and now:** hold the clock-arrow button (or T) and the valley is as it was on its
     first morning, from the same camera.
2. *What they told.* Carvings by material: children draw stories in the sand by the creek (gone
   with the next flood); clay tablets by their homes last about a season and are copied before
   they crumble (the copies drift); stone takes days of cutting, a session at a time, and stands
   for good in a row near the meeting place, the Telling Stones (8 to 12 by day 30). Those who
   pass read them, and a story kept in stone can be found again after everyone has forgotten it.
   Those who were there recut a stone that tells their story wrongly ("That isn't how it was, I
   was there"); later, the young recut worn letters, sometimes "correcting" them as they go. In
   one valley run to day 60, reading a stone cut true brought 12 of 20 tellers back to what
   really happened in the leaving of the old valley.
3. *What they remember.* Habits that outlive their reasons (thanking the creek, above). The
   **Ways and stories** tab lays the three side by side for each story that matters: what really
   happened, what was carved (by whom, when, in what, recut by whom), and what most of them say
   now.

**The chronicle**: a Chronicle tab with a page for every day (who was born, who passed on, who
went downstream or came up the creek, the storms, what was finished, the creek, how many lived
there, and the day's notable lines). After an absence of a day or more, "while you were away"
shows those pages.

**The last founder's passing**: when the last of the eight passes, the view turns to where they
were, two lines come and go ("... was the last of the eight who came down the creek." "The valley
goes on."), the history and the chronicle say so, everyone remembers it, and it becomes a story.
Then the valley simply goes on.

## What was measured

All on this machine (a shared cloud container), nothing on a phone or a real graphics card.

| What | Result |
|---|---|
| Determinism (`tools/determinism.cjs 4`): live, uneven slices, save and reload | identical state hashes |
| Four valleys to day 32 at once (`tools/month.cjs`) | 32 days in 302 to 313 s each (8,800 to 9,200 times real time; Phase 1 was about 13,000 with 20 creekfolk instead of 30, the same cost per creekfolk), no errors; saves 1.9 to 2.1 MB |
| One valley to day 60 (before the arc was merged) | saves 1.4 MB; carvings, the bank and the chronicle stay bounded |
| The culture and the records in each valley (`tools/records-report.cjs`) | as above |
| The rules in a browser (`tools/browser-test.mjs`) | 20 of 20 pass (on the release files) |
| The 3D view live on a day-30 valley (`tools/tour.mjs`) | 16 of 16 pass, no page errors (on the release files) |
| The records on the page (`tools/records-shots.mjs`): the bank, the Ways tab, the Chronicle, "while you were away" after a jump of a day and a half, then and now, the last founder's moment | looked at one by one, no page errors |

Pictures in `docs/img/phase2/`: `then-and-now.jpg` (a day-30 valley held against its first
morning, from the same camera), `healed.jpg` (the same valley from the air, and its wetland),
`records.jpg` (the bank behind the first dam, the Ways and stories tab, the Chronicle, the Telling
Stones), `last-founder.jpg` (the last founder's moment, shown on demand for the picture, so the
name in it is a living creekfolk's).

## What isn't right yet

- **Days 14 and 22 depend on the weather**: a valley with a stormy second wet season runs a
  little ahead of the plan, a dry one behind. Each month has only four wet seasons, so I'd
  rather report the spread than make the weather regular. (A smaller storm range in `CF2_CREEK`
  would tighten it.)
- **Founders sometimes pass close together** (two within a few hours of each other in some
  valleys), though always spread over four days.
- **The old words barely drift in a month**: by day 30 one valley in four had one word changed
  for most speakers; the rest only among some of the young. It is slow by design (sounds change
  through the children); over a year it should show more, but I haven't run a year.
- **The beavers still come after day 120** (Creekfolk 1's rule); the brief puts them in Phase 3.
- **What the ledge and the Dry Fork teach** isn't there yet.
- **The last 16 m at each end of the valley stay dry**, and dams stop at 17 or 18 of the 20
  allowed (the spacing rules leave no more sites).
- Everything the Phase 1 report listed under "What isn't right yet" that isn't mentioned here
  still stands (no sound, small creatures read only close in, snow doesn't lie, close-up actions
  laid over three clips).

## What I couldn't test

- Speed and touch on a real phone or graphics card (the browser here draws in software).
- A valley left running for weeks in a real tab.
- A whole year: the longest runs were 46 days (the arc) and 60 days (the culture and records).

## Decisions made in this phase

Recorded in `docs/DECISIONS.md` (13 to 18) for you to confirm: dams worked at low water, storms
in fronts, the mud from this valley's own hills, ponds that soak into the floor, the founders
arriving with their culture already made, carving by material.

## What I'd do next (Phase 3)

What the brief puts there: the treasures the floods bring (and belief waking), the beavers in
week 4 or later, and what the ledge and the Dry Fork teach; then a year's run to see the arc,
the words and the stories settle.

# Phase 3C report: life and the ending

Two files, as before: `creekfolk.html` (the game) and `creekfolk-dev.html` (the same game
with a Dev button and its own saves). This build is version `3c`; it keeps its valleys in
its own storage and doesn't open 3B valleys (those still open in the 3B files in
`releases/`).

Your answers before 3C: the 3B tuning stays as it is, and instead of two-year runs I checked
that a valley keeps running smoothly into month 13.

How it was built: I split 3C into pieces and had four helpers build the separate ones at the
same time, each on its own copy of the code (looks; homes and places; sound and
then-and-now; the grove and animals), while I built the pieces that depend on each other
(beavers, the sky stones, the Returning, coming home, legends) and then merged everything and
tested it together.

## What exists now

**Looks you can trace through families.** Twenty-four fur colours in a ring where neighbours
look alike, coat patterns (spots, stripes, a saddle, patches, pale or dark), face markings (a
mask, a blaze) and pale paws. A child takes its fur from one parent (sometimes a shade
toward the other) and each marking whole from one parent, with a small chance of something
new, so a family line is recognisable for generations. Grown-ups wear something for their
passion: a builder's apron, an explorer's scarf, a straw sun hat, a lily-pad hat, a satchel,
bells on their ears, a flower behind the ear. Children have big heads and big eyes; elders
are greyer, with pale brows, a stoop and a cane. A believer wears the treasure they found on
a cord. A creekfolk's panel says it in words: "Sandy fur, with a pale saddle and a mask."

**Homes.** The door is the owner's fur colour. Things by the door come from what the owner
loves: flowers in pots, stacked stones, chimes, a water basin, a carved figure, a streamer, a
bench; two or three per home, appearing as they settle in. Two new home levels, a front
porch and a stone hearth (its chimney smokes on cold evenings); they add comfort, not room,
and are paced so they don't crowd out other work. Every garden gets a fourth bed, and a
growing valley gets a second and third garden, mostly built by those who love growing
things.

**Named places** get a marker: a standing stone with flowers where someone passed, a cairn at
the spring and the place of the first gift, a signpost elsewhere.

**Beyond the valley.** Low hills and woods all round; downstream the creek runs on through a
gorge into a lake; upstream a ravine climbs into the hills. The far hills dry out and take
snow with the seasons.

**The memorial grove.** Pine, willow, oak and birch: a tree takes the kind of a parent's tree
most of the time, otherwise follows what they loved, and is planted beside its family's when
there's room, so lineages grow in clusters. Trees grow all their lives; the founders' trees
are the giants of the grove after a year. Old trees fall and become nurse logs with moss,
ferns and saplings, then are gone, so the grove stays bounded; a founder's tree falling is
remembered in the log.

**Goats** have kids in spring while the herd is small; the kids trot after their mothers.
Their wool is woven into blankets for a home (a little extra rest on winter nights); it is
never a job. **Butterflies** on summer days over the flowers, **herons** in the shallows as
the wetland heals (one to four), **mist** over wet ground at dawn.

**The beavers.** When the floor is about as wet as the creekfolk can make it (after day 120,
once at least 55% stays wet at the driest; by day 210 whatever), a pair comes up the creek in
the night and builds a lodge of sticks in the deepest pond. They have kits each spring (up to
six beavers). They take over the dam-tending: they mend worn dams and build dams up higher
than the creekfolk did (a hand above the floor, within the drop rule), mostly at dusk and in
the night; the creekfolk leave a dam alone while a beaver sees to it. They also dam the little
side channels across the floor with sticks, and those hold water through the dry season:
that's what turns the last dry patches into marsh. The creekfolk go to watch them at dusk,
coin a word for them, and say the beavers mend the dams better than anyone ("there's more
time now for the temple"). The water on the temple steps comes from the high ponds they keep.

**The sky stones.** After their first midwinter, someone who has been watching the sunrise
notices it comes up further along the hills each morning, stops, and turns back, and wants
to mark it. A sighting stone and a midwinter stone go up at once; the spring, midsummer and
autumn markers each go in on the morning the sun rises behind them, so the stones are done
around real day 13, before their second midwinter. From then on they can tell how long it is
until midwinter, and they meet at the stones on midwinter morning.

**The Returning.** When the temple is finished, the creekfolk spend three valley years laying
a procession path from the temple steps past the First Pool (named for whoever built the
first dam) up the creek to the head of the valley: one stretch a season, with lantern posts.
The first Returning comes on the first midwinter after the path is done.
- Before dawn the village is on the temple steps. The sun comes up through the crown's sun
  gate, the water running down the steps turns to gold, and a golden road of light runs from
  the gate toward the sunrise.
- By day the procession walks the path, past the First Pool, to the Spring and back (the
  old and the small walk part of the way).
- That night a run of softly glowing fish swims up the healed creek, all the way to the
  spring; the village sets lanterns along the creek and the little channels; the beavers
  are out, and the fireflies; the one who believes in you looks up and waves.
- It comes back every midwinter (every 8 real days), forever. Each one hangs a lantern on
  the pyramid for every creekfolk who passed since the last, carves a story into the temple,
  and adds a verse to their song (the Temple tab shows the newest).
- "The next Returning is in 3 days, on Saturday around 7 PM" in the Temple tab, and as a
  note when you open the game within two days of one.
- A valley with no temple at all still gets the glowing fish at midwinter once its creek
  has healed, without the sunrise through the crown or the festival.

**Coming home.** Sometimes a creekfolk who comes back to visit stays for good, if there's room
and someone here they love: a fresh mind, but their own name, family, looks and old friends,
and the dam craft they took downstream. Visitors also bring news of the next valley down
turning green, because the leavers took the craft with them.

**Legends.** A story that a third or more of the village still tells after forty days becomes a legend
and is kept, in the version they came to tell, in the Stories tab's Legends list (the newest
twenty-four), even after it's forgotten.

**The valley sounds as healthy as it is.** Frogs at night, a dawn chorus and morning birdsong,
crickets on warm evenings and insects on summer days, all synthesised, fuller as the wetland
heals: a few lonely calls on day one, full choruses once the floor is a marsh. Rain and
storms quiet them. Nothing plays until you turn sound on.

**Then and now.** Hold the round button at the bottom right (or the T key) to see the valley
as it was on its first day, from the same camera: the creek cut down in its trench, no
dams, no marsh, no homes, no temple. Let go and it's now again.

**In the dev menu**: beavers, sky stones, and "the Returning" (lays the path and starts one
now; in a valley with no temple, the fish run).

## Measured
Everything here was run on the final build unless it says otherwise. The year runs are
whole valleys, every moment simulated (`tools/year.cjs`; the printouts are in
`docs/runs-3c/`). The simulated player gives on a rhythm, three times in four whatever the
valley needs most, as in 3B.

**Into month 13** (every other day, two valleys, 390 days):

| | Valley 1 | Valley 2 |
|---|---|---|
| Sky stones finished | day 13 | day 13 |
| Beavers came | day 166 | day 120 |
| Wet at the driest, by valley year (every 5th) | 10%, 13%, 40%, 53%, **93%**, 95%, 95%, 94%, 95% | 10%, 25%, 62%, **97%**, 97%, 97%, 97%, 97%, 97% |
| Temple finished | day 314 | day 314 |
| Procession path | days 314 to 336 | days 314 to 336 |
| First Returning | **day 343 (month 12)** | **day 343 (month 12)** |
| Returnings by day 390 | 6 | 6 |
| Lanterns on the pyramid | 69 | 66 |
| Came home to stay | 2 | 3 |
| Legends | 39 | 38 |
| Population at day 300 / 365 | 32 / 30 | 32 / 29 |
| Births, passings, gone downstream | 394, 317, 57 | 405, 326, 60 |
| Simulation errors | 0 | 0 |

**Does it keep running smoothly?** Time to simulate each 30 days (Node, two valleys at once
on this two-core machine), months 10 to 13: 355, 370, 402, 403 s (valley 1) and 410, 397,
404, 421 s (valley 2): about flat, with the population flat at about 30. Save size at days
300, 330, 360, 390: 2.23, 2.32, 2.23, 2.31 MB (valley 1) and 2.21, 2.44, 2.39, 2.30 MB
(valley 2): flat. The runner's memory in use moved between 25 and 81 MB with no trend.
Everything new is bounded: grove trees (at most 240 standing, logs at most 24), legends (24
kept), verses (12 kept, the count goes on), lanterns (a count; 320 drawn), beavers (6), side
dams (12), goats (8), carvings (60). The lineage record still grows by about 450 small
entries a year, as before.

**The Returning by giving rhythm** (your expectations: month 12, about 10.5, about 9):

| Giving | Temple finished | First Returning | Returnings by day 330 |
|---|---|---|---|
| Every other day | day 314 | day 343, month 12 | (6 by day 390) |
| Daily | day 261.3 | day 287, month 10 (9.6 months in) | 6 |
| Twice a day | day 234 | day 263, month 9 (8.8 months in) | 9 |
| Every four days | no temple (the start rule); the Hall of the Ancestors, day 314.6 | none; the glowing fish come alone at midwinter | 23 fish runs |
| No giver | the Hall of the Ancestors, day 314.6 | none; the glowing fish come alone at midwinter | 21 fish runs |

The Returning comes on the first midwinter after the path is done, so it lands 3 to 8 days
after the path's last stretch. (Twice a day finished the temple on day 234 here against
day 220 in 3B: the simulated player happened to give no dreams this time; a dream brings a
part sooner.)

**The year's targets** (`year.cjs`), in all five runs: no valley drops to zero, no errors,
first passing after day 12, someone leaves downstream, the temple finishes in month 11 for
every other day, most believe; and the 3C ones: beavers arrive between month 5 and month 7
(days 120, 142, 150, 166), the sky stones are finished before their second midwinter (day
13 in every valley), most of the floor stays wet all year by month 9 (at least 80% at the
driest: 94% and 97% every other day, 96% daily, 95% twice a day, 97% every four days, 95%
with no giver), and an every-other-day giver
holds the first Returning in month 12 (day 343). The population target ("30 between month 2
and month 6") passed in every run this time.

**Checks on the final build** (the release build, whose simulation is byte for byte the one
the year runs used):
- `determinism.cjs 20`: one replay, uneven slices, and saving and reloading four times all
  end in the same state (hash `483384cec989cdd0`) after 20 days. PASS.
- `browser-test.mjs`: a new valley, a 3-day jump through the worker (7.3 s), a reload, the
  same valley; no warnings or errors.
- `browser-dev.mjs`: the dev build keeps its own saves (`creekfolk-3c-dev`); +1 day in 3.4 s;
  storm and birth; pause holds the clock (0.02 s in 3 s) and resume moves it; a snapshot
  restores; a Phase 2 save is refused with your wording; no errors.
- `browser-gifts.mjs`: all 17 gifts and every dev trigger, including the three new ones, with
  the valley drawn between them; no errors. (While checking this I changed the dev menu so a
  trigger that can't happen yet says "Not now: no pond for a lodge yet" rather than "Made it
  happen: no pond for a lodge yet". That's the only change after the year runs, and it's in
  the dev menu, not the simulation.)

**Catch-up speed** (headless Chromium on this machine, minified build, the same code path as
a real absence; both measured today, one after the other): 30 days from day 300 of the
every-other-day valley (32 creekfolk, the temple done) took **6.7 min** (6,400 times real
time). The 3B release on its own day-300 valley (30 creekfolk) took 5.2 min. So 3C is about
a quarter slower for the same stage of a valley, a little less per creekfolk (it had two
more). In a profile of the 3C valley (Node, 3 days), the new code itself is about 4% of the
time, nearly all of it creekfolk considering whether to go and watch the beavers at dusk;
the rest goes where it always has, into creekfolk choosing what to do and finding their way
around (there is more to do and more to walk to now). Phones are still not measured.

## Pictures
From the final every-other-day valley (`docs/img/`) unless it says otherwise. The Returning
pictures are the first midwinter after the path was finished (day 367 of a copy of valley 1).
- The first Returning at dawn: the sun comes through the crown's gate, the water on the steps
  turns gold, and a road of light runs out over the marsh. The village is gathered by the hall (right);
  "Fensy looked up at the sky and waved" is the one who believes in you.
  ![dawn](img/3c-returning-dawn.jpg)
- The procession by day setting out from the temple (bottom left), down past the First Pool
  ("Sorrel's Pool, the first pool they ever made"), with the healed marsh and the dams.
  ![procession](img/3c-procession-day.jpg)
- That night: the glowing fish swimming up the creek past the dams, lanterns along the creek
  and channels, fireflies.
  ![night](img/3c-returning-night.jpg)
- The beavers' lodge at night, with the glowing fish going by and lanterns all round.
  ![lodge](img/3c-lodge-night.jpg)
- The temple's pyramid with a lantern for each who has passed since the temple was finished
  (small, warm points on the steps; they are hard to see at this size).
  ![lanterns](img/3c-pyramid-lanterns.jpg)
- The sky stones on the terrace: the sighting stone (the block) and the standing markers.
  ![sky stones](img/3c-sky-stones.jpg)
- Then and now (hold the button): the healed valley at day 300, and the same view as it was on
  the first day; and closer, the bare trench.
  ![then and now](img/3c-then-and-now.jpg)
  ![then, close](img/3c-then-close.jpg)
- A family at the season's gathering: fur, masks and saddles you can follow from parent to
  child; lily-pad hats, aprons; the small one in front is a child.
  ![family](img/3c-family.jpg)
- What they wear for what they love: a flower, a straw sun hat, bells on the ears, a lily-pad
  hat. And elders with canes and pale brows, believers with their treasure on a cord.
  ![wardrobe](img/3c-wardrobe.jpg)
  ![treasures](img/3c-treasures.jpg)
- Homes: porches, coloured doors, things by the door (stacked stones, a bench, streamers,
  a basin); a porch and hearth closer (from a helper's run).
  ![homes](img/3c-homes.jpg)
  ![porch and hearth](img/3c-porch-hearth.jpg)
- A signpost at a named place (the first crossing), and beyond the valley: the creek running
  on through a gorge into the lake downstream (the camera can't go this high in the game).
  ![signpost](img/3c-signpost.jpg)
  ![downstream](img/3c-downstream-lake.jpg)
- The grove at day 300: pines, willows, oaks and birches in family clusters, the founders'
  trees tallest, fallen trees as nurse logs; and a nurse log close (moss, ferns, saplings).
  ![grove](img/3c-grove-day300.jpg)
  ![grove from above](img/3c-grove-day300-above.jpg)
  ![nurse log](img/3c-grove-nurse-log.jpg)
- A goat kid with its mother; a heron in the shallows in the dawn mist; mist over the marsh;
  butterflies over the summer flowers.
  ![goat kid](img/3c-goat-kid.jpg)
  ![heron](img/3c-heron-mist-dawn.jpg)
  ![mist](img/3c-mist-dawn.jpg)
  ![butterflies](img/3c-butterflies.jpg)

## Honest notes
- **What I looked at, and how.** Everything new was checked in screenshots from headless
  Chromium (software drawing, 1280 x 800) at chosen moments of saved valleys, and in the
  numbers. I didn't watch a whole Returning play out live in a real browser at real speed;
  the Returning pictures are a saved valley stepped to dawn, midday and night. Nothing was
  tried on a phone, and phone catch-up is still not measured.
- **Nobody has listened to the sound.** The helper who built it measured it offline (which
  voices play, and how loud, at each wetness, season and hour); neither of us heard it. There
  are no sounds yet for the beavers or for the Returning.
- **Your Returning months:** every other day lands where you wanted (day 343, month 12) and
  twice a day close to it (8.8 months against "about 9"). Daily comes about a month early
  (day 287, 9.6 months against "about 10.5"), because a daily giver's temple finishes in
  month 9, which you agreed to keep.
- **A valley given a gift every four days never has a Returning.** It never starts the temple
  (the 3B start rule), so it builds the Hall of the Ancestors and gets only the glowing fish at
  midwinter, like a valley with no giver. If you'd like Hall valleys to have a Returning of
  their own (a gathering at the Hall, a path through the grove), it's a small addition.
- **The beavers are now what makes the last of the floor wet.** Without them the floor stopped
  at about 79% wet at the driest; the brief has the whole floor marshy by months 6 to 9. So
  their side dams hold water, and the floor reaches 93 to 97% within a few valley years of
  their coming. In valley 1 they came late (day 166) and the floor went from 48% wet at the
  driest on day 150 to 92% on day 180.
- **The fish run alone is only for valleys with no temple at all.** A valley still building
  its temple waits for its first Returning; at first it had twenty fish runs before it.
- **The verses are short.** Each Returning adds a line naming the story they carved ("The
  storm.", "Dewin's passing."), not a line of poetry. Real verses are writing work I'd rather
  do with you.
- **Lanterns:** the first Returning hangs one for everyone who passed since the temple was
  finished, not since the valley began (69 and 66 by day 390). I chose that so the pyramid
  isn't full on the first night; easy to change.
- **The far scenery can't be seen from the game's camera.** The hills, the gorge and the lake
  are there, but the camera doesn't tilt up enough to see the horizon; the lake picture is
  from a test camera. Phase 4 could give the camera a way to look out.
- **Then and now** takes a moment the first time you hold it (0.35 to 2 seconds on this
  machine, building the first day's land); after that it's instant. It shows the land, the
  creek and the trees of the first day; the hills beyond the valley are the same in both.
- **Coming home** is rare by design (15% of visits, and only with room and someone they love):
  2 to 4 per valley in a year.
- **Looks follow the passion they're known for** (`sig`), not their strongest interest:
  interests fill up for nearly everyone within days, so they can't tell creekfolk apart.
- **The procession path** is built as labour like the temple, one stretch every two days,
  so it takes three valley years (22 real days in these runs).
- **Two-year runs weren't made**, as you said; the longest runs went to day 390. Months 10 to
  13 were steady (above). Phase 5's "memory stays flat through year 2" is still to show.
- **Twice a day finished the temple on day 234** here against day 220 in 3B. The simulated
  player happened to give no dreams this time (a dream brings a part sooner); the temple code
  didn't change.
- **The dev-menu test** (`browser-dev.mjs`) twice missed a click while the machine was busy
  with year runs; it passed every time on a quiet machine, including today.

## What I'd do next
**Phase 4, visuals**, as the brief has it: a one-page art bible (palettes per hour and season,
wet and dry looks for the 8-day year, scale, silhouettes for children, grown-ups and elders),
then a gallery page rendering the same valley at several hours, in all four seasons, early
and late in its history, with at least two rounds of strict critique and fixes before showing
you. Things I already know it should cover:
- art for everything that is still simple shapes: the temple and the hall, the beavers and
  their lodge, the sky stones, the procession path and its lanterns, the goats;
- the lanterns on the pyramid (hard to see), and the golden road at dawn seen from more
  angles;
- a camera that can look up and out to the hills, the gorge and the lake;
- sounds for the beavers and the Returning, and someone actually listening to the soundscape;
- real verses for the song, with you.

Before or alongside it, I'd win back some of the catch-up speed (about a quarter slower than
3B), starting with the beaver-watching check, and measure a phone.

**Phase 5**, the year tests over two years, with the rewritten targets from your changes
(memory flat through year 2 among them).

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
[[E96NONE]]

The Returning comes on the first midwinter after the path is done, so it lands 3 to 8 days
after the path's last stretch. (Twice a day finished the temple on day 234 here against
day 220 in 3B: the simulated player happened to give no dreams this time; a dream brings a
part sooner.)

**The year's targets** (`year.cjs`), in all five runs: no valley drops to zero, no errors,
first passing after day 12, someone leaves downstream, the temple finishes in month 11 for
every other day, most believe; and the 3C ones: beavers arrive between month 5 and month 7
(days 120, 142, 150, 166), the sky stones are finished before their second midwinter (day
13 in every valley), most of the floor stays wet all year by month 9 (at least 80% at the
driest: 94%, 97%, 96%, 95% in the giving valleys [[NONEWET]]), and an every-other-day giver
holds the first Returning in month 12 (day 343). The population target ("30 between month 2
and month 6") passed in every run this time.

[[CHECKS]]

## Pictures
_(filled in)_

## Honest notes
_(filled in)_

## What I'd do next
_(filled in)_

# Phase 3A report: the land

Two files: `creekfolk.html` (the game) and `creekfolk-dev.html` (the same game with a
Dev button and its own saves). This build is version `3a`; it keeps its valleys in its
own storage and never opens a Phase 1 or 2 valley (those still open in their own files
in `releases/`).

## What exists now

**A valley that dries out, and heals.**
- **The 8-day year.** A valley year is 192 valley days, about 8 real days: spring,
  summer, autumn and winter, two real days each. The clock reads "Day 12 of spring,
  year 3". Winter and spring are the wet season, with storms; summer and autumn are dry.
- **A bigger valley.** 160 m along the creek and 80 m across (it was 64 x 64): a valley
  floor along the creek, terraces on both sides where the village lives, hills at the
  rim, the creek leaving through gaps at both ends. The village starts at the upstream
  end, up on the terrace away from the water. The spring is beyond the upstream end.
- **The creek is a model, not a curve.** Creek Care's river model, ported and scaled
  down to a small stream (about 2.4 m wide when healthy): a chain of nodes every 2 m,
  each with a bed, the old valley floor it has cut down below, a trench, maybe an
  inset bench, plants and the water table beside it. It starts cut down about a metre
  below its floor and fairly straight.
- **Every storm is a flood** (about 8 a valley year, about 350 in a real year), sized
  and routed the way Creek Care does it (flow from drained area, Manning's equation,
  Meyer-Peter and Muller gravel transport, mud settling on the floor when water goes
  over the bank). **The creek only gets better:** gravel and mud settle and are never
  dug out again below what has settled; banks don't fall back; dams never wash out.
- **Wet and dry, as real logic.** Every 10 minutes the spring and the hills feed the
  creek, the creek trades water with the water table under the floor (a deep trench
  drains the floor fast; a creek near the top of its floor holds it up), ponds fill,
  spill, evaporate and seep, rain wets the topsoil and warmth dries it. Early on the
  creek stops flowing in the dry season and the whole valley goes from green to straw
  to dusty brown. A pond holds water through the dry season and keeps a green ring
  around it. As the creek fills its trench, the floor stays wet longer each year.
- **Dams and the drop rule.** A dam can hold water at most 0.42 m above the water just
  below it. A tall dam with nothing below it lets the water dig under and its pond
  barely fills (so a lone weir that is heightened into a mud dam gets a *smaller* pond).
  Creekfolk nearby notice ("the pond behind the mud-packed dam won't fill: the water
  slips out underneath it"); an elder can work out why, and that becomes knowledge
  they teach and can lose ("to build dams from the bottom of the creek up"). With it
  they pick sites where the pond below already holds water against the new dam's
  foot, don't heighten a weir that has no water below it, and lay a stone apron under
  the lowest dam before building it up. Silted-up ponds are built up a hand higher as
  an ordinary chore, up to a little above the floor. Up to 14 dams.
- **Stage 0.** Where floods spill over the bank, the water is routed across the floor
  and wears shallow side channels that deepen with every flood that follows them. A
  healed floor becomes channels, pools and marsh rather than one creek. Each stretch of
  creek is classed on the channel-evolution stages (II cut down, IV refilling, V healed,
  I steady, 0 valley-floor wetland).
- **What the land can feed.** Capacity is the lower of shelter (the old formula) and
  what the land can feed: about 20 in a cut-down valley, rising toward 36 as the creek
  heals (wet at the driest point, healed stretches, ponds).
- **In the game:** the village sheet has a new first tab, **Land**: "The valley can feed
  about N", "At the driest point of last year, about a quarter of the valley floor
  stayed wet", the last few years at their driest, and the creek now. Gardens go at the
  edge of the valley floor and stay damp from below once the creek heals.

**Drawing from the model.** The ground's heights come from the model and are rebuilt
after every flood. The creek's trench is its own smooth mesh along the centre line;
its water is a ribbon at each node's water level, so it narrows, stops and dries in the
dry season; water standing on the floor is drawn wherever the water table is above the
ground, so its edges follow the floor's hollows and side channels. The land fades from
green to straw to brown in the dry season, and marsh colours where it is wet.

**The dev build.** A Dev button that works on a phone; its own storage; a snapshot
before every jump (the last ten, each restorable); jumps of a day, a week, 1, 3, 6 or 12
months (all replayed in full); a gift with no wait; a storm, a big flood, a birth, a
passing, a visitor; overlays for wetness, worn paths, creek stage and land capacity;
pause; the creek in numbers; the mind reader. After each jump it shows how fast the
replay ran and how long 30 days would take on that device. During long catch-ups it
says "Keep the screen on until it's done" and holds a screen wake lock where the
browser allows it.

## Measured
_(filled in from the runs below)_

## Honest notes
- **The whole floor is not marshy all year by month 9.** The arc reaches "most of it" at
  the driest point around months 5 to 7 in my runs, and keeps rising slowly. Getting the
  last of the floor wet is what the beavers are for in 3C; without them a valley seems to
  level off somewhere between half and three quarters.
- **Dams come faster than the table.** Creekfolk build 11 to 14 dams by day 30 to 40
  (the table says "several by months 1 to 2"). The healing is still paced by mud and by
  building dams up, which is slow, so the arc keeps its shape; but the creek fills up with
  dams early. Easy to slow down if you'd rather.
- **The creek's main channel doesn't move.** Creek Care's bends migrate; here the main
  channel keeps its starting course (so it can never undercut a home), and the wandering
  comes from the side channels on the floor instead.
- **Time is compressed, so some rates are chosen, not measured.** A valley year is 8 real
  days. Flows are real (cubic metres per second) but evaporation, seepage and the slow
  water from the hills are set per valley day so the year behaves as the author's table
  asks: a first pool lasts through the dry season, a cut-down valley dries out, a healed
  one doesn't. Sediment yields are tuning knobs (`CREEK.fineYield`, `gravelYield`), not
  calibrated to a real watershed.
- **"Build downstream first" is learned fast and never lost.** An elder works it out in the
  first one or two weeks in every run, and it's taught to everyone. No skill was lost in
  any run again.
- **The population lags the land.** What the land can feed reaches 31 to 32 by month 6;
  the population moves between about 15 and 28 (with a little help, births are faster
  while there is room). "Close to 36 by months 4 to 6" isn't reached.
- **Looks are 3A-level.** The creek, ponds, marsh and side channels are drawn from the
  model, but the wet season can look more like a lake than a marsh, the water edges follow
  a 1 m grid, and the cut banks are simple. Phase 4 is the place for this.
- **Phones: not measured by me.** I have no phone here. The CPU-throttled number below is
  a stand-in; the dev build shows the real number on your phone after any jump ("30 days
  would take about N min here").
- **Not built yet (later parts):** beavers and the Returning (3C; disabled buttons in the
  dev menu), the sky calendar (there was none before; `daysToMidwinter()` is ready for it),
  then-and-now (the day-one creek is saved, ready for 3C).

## What I'd do next
- **3B: belief and the temple.** The creek as the giver; requests from `giftNeed`
  ("the gardens are dry"); believers gathering at the giving place when a gift is due;
  offerings left for you; "the creek gives at dawn, every twenty-four days"; the new
  gifts (goats, bees, fish, birds, flower and fruit seeds, snow day, starry night,
  rainbow, a fallen tree, clay, stones, a dream); the temple's three stages paced by your
  giving; the one who believes in you.
- Before that, if you want: slow the first dams down, or speed up the population so the
  valley gets closer to what the land can feed.

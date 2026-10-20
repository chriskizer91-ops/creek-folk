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
_(filled in)_

## What I'd do next
_(filled in)_

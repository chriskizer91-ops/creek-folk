# Merging Creekfolk 1 into Creekfolk 2

Creekfolk 2's simulation (`src/sim/`) started as a copy of Creekfolk 1's at commit
`8e9ec93` (Phase 3B), and Creekfolk 1's Phase 3C was merged in from commit
`59d5e4b758487c7dbe2812d5b2053ab55b138764` (branch `phase-3c`; see `docs/MERGE-3C.md`).
**The base for the next merge is `59d5e4b`.** Merge anything later from Creekfolk 1 as a
three-way merge per file, with `59d5e4b` as the base, Creekfolk 1's new version as theirs
and Creekfolk 2's as ours, e.g.

    git show 59d5e4b:src/sim/life.js > /tmp/base.js
    git show <new>:src/sim/life.js > /tmp/theirs.js
    git merge-file creekfolk2/src/sim/life.js /tmp/base.js /tmp/theirs.js

New Creekfolk 1 files are copied in unchanged where possible and added to `SIM_FILES` in
`tools/build.mjs` in Creekfolk 1's order, among Creekfolk 1's files (before the `cf2-*`
files and `api.js`).

Creekfolk 2 changes Creekfolk 1's files in two ways, both listed below:
- **Edits in place**, each marked `// CF2:` in the code. `git merge-file` handles these;
  check every conflict by hand.
- **Replacements**: a Creekfolk 1 function or value replaced from a Creekfolk 2 file loaded
  later in the same scope. A merge won't show a conflict for these, so for each one listed
  here, compare Creekfolk 1's new version of the function with the old one and carry the
  change into the replacement by hand.

After a merge: rebuild, run `tools/determinism.cjs` and `tools/month.cjs` (speed per 3
days against the same run on the code before the merge), look at `tools/map.cjs`
pictures, and report what was merged and what was left out.

## Edits in place

| File | Where | What and why |
|---|---|---|
| `creek.js` | `VW`, `VL` | The real-scale valley: 160 by 224 cells (was 80 by 160). |
| `creek.js` | `creekHydro`, before and in the node loop | `cf2BranchStep` runs the branches' water each step; `cf2BranchIn` adds a branch's flow where it joins the creek. |
| `core.js` | `obstacles`, `doorPoint` | A home's and the meeting place's footprint, and the door, scale with `CF2_SCALE.build`. |
| `core.js` | `createWorld` | The village starts by the spring (`cf2MeadowSpot`); counts of trees, bushes, reeds, stones, clay, glowcaps, logs and boulders scale with the valley (`cf2Count`); the "near the meadow" radii scale with `CF2_SCALE.build`; founders know what's within `15 * CF2_SCALE.see` m. |
| `grove.js` (3C) | `groveSpotOK`, `groveSpot`, `groveFell` | The memorial grove at real scale: every length is Creekfolk 1's times `CF2_SCALE.build` (clearance round structures, room round logs, the kin neighbourhood, the rings round a family's tree, the search grid, "beside a log", "near the family", the spiral when the grove is full, a fallen tree's length and girth and the room it looks for); the per-metre weights in the scores are divided by it, so the grove is the same layout, scaled. (`GROVE.space` and `GROVE.reach` are values, below.) |
| `grove.js` (3C) | `groveFell` | A founder's tree: "one of the first eight" (`numberWord(LIFE.founders)`; Creekfolk 1: "the first five"). |
| `grove.js` (3C) | `goatKids` | Who remembers a kid's birth: within `30 * CF2_SCALE.see` m. |
| `skycal.js` (3C) | `skycalSite` | The sky stones look for room `(8 + i/8) * CF2_SCALE.build` m from the village centre. |
| `skycal.js` (3C) | `skycalOption` | Where they stand on midwinter morning, behind the (scaled) stones: the offsets times `CF2_SCALE.build`. |
| `skycal.js` (3C) | `skycalDone` | Witnesses of the finished stones: within `30 * CF2_SCALE.see` m. |
| `beavers.js` (3C) | `beaversArrive` | Witnesses of the beavers' coming: within `25 * CF2_SCALE.see` m. |
| `beavers.js` (3C) | `beaverDamJob`, `BEAVER` | The point at which a beaver mends a dam is a value, `BEAVER.mendAt` (Creekfolk 1 wrote 0.75 in place); `cf2-beavers.js` sets it to 0.6. |
| `beavers.js` (3C) | `beaverSmallSite` | Sites for the little side dams are looked for across the whole (wider) floor: the offset from the creek times `CF2_SCALE.floor`. |
| `minds.js` (3C part) | `returneeStays` | Witnesses of a homecoming: within `25 * CF2_SCALE.see` m. |
| `minds.js` (3C part) | `storyText`, case `fishrun` | The glowing fish swim "on up toward the old valley" (DECISIONS.md #5; Creekfolk 1: "all the way to the spring", which in Creekfolk 2 would be the spring branch inside the valley). |
| `returning.js` (3C) | `returningPhase` (fish only), `ACTIONS.watchfish` | The same, in the log lines and the memory; the memory says "I sat on the bank" (a fish run with no festival sets no lanterns). |
| `returning.js` (3C) | `returningPhase` (fish only) | The first fish run: "It was just as the stories of the old valley said" while anyone still tells the old valley's story of the fish (`oldStoryHeld`, `cf2-culture.js`); otherwise Creekfolk 1's "Nobody had ever seen it before." |
| `core.js` | `socialTick` | "The creekfolk now call their home ..." (Creekfolk 1: "The creatures"). |
| `core.js` (`ACTIONS.repair.end`) | `cf2-records.js` | Wrapped: a finished repair adds a patch (`s.patches`, drawn on the wall). |
| `minds.js` | `retell`, op `who` | A deed in the first three days drifts to "one of the first eight" (`numberWord(LIFE.founders)`; Creekfolk 1: "one of the first five"). |
| `core.js` | `damSite`, in the site loop | Phase 2: a hook, `cf2DamSite` (cf2-creek.js), adjusts each site's score and reason for those who know dams are built from the bottom up: the first dam at the bottom of the valley, then up the pond of the one below, spaced, worth the walk. And sites reach the valley's rounded ends (`valleyR` up to `CF2_CREEK.damRim`, 0.88; Creekfolk 1: 0.8), so the bottom and top of the bigger valley can be dammed. |
| `core.js` | `projectReason`, the dam branch | Phase 2: hours since the last work on any dam before a new one is begun: `CF2_CREEK.damRest` (8; Creekfolk 1: 30). |
| `core.js` | `bestWork`, the repair loop | Phase 2: a dam waiting to be built up (`s.raise`) is seen to until its condition reaches 0.95, at low water (`cf2LowWater`). In Creekfolk 1 repairs start only below 0.6 and the raise happens only when one repair takes it to 0.95, which a single repair from 0.55 never does, so silted dams almost never rose. |
| `creek.js` | `creekHydro`, the floor's water table | Phase 2: the bed counts as sealed by mud after `CF2_CREEK.sealRise` m of it (0.3; Creekfolk 1: 0.6, in a trench twice as deep). And a pond above the floor's water table soaks sideways into it at the rate the floor drains into the creek (`CF2_CREEK.pondSide`, 1; Creekfolk 1 had only the seep through the pond's sealed bottom), so a healed floor holds its water through the dry season, as beaver ponds do in a drought. |
| `creek.js` | `creekPondFloor` | Phase 2 (the main session's request): a pond spreads onto any connected cell lower than its surface, not only onto the floor's mask, so its shore follows the ground instead of a straight line at the foot of the rise. |
| `creek.js` | `creekCellWater` | Phase 2: a cell off the floor that a pond stands over keeps its wetness (Creekfolk 1 made every cell more than 8 m off the floor dry). |
| `core.js` | `lookAround`, at the top of the resource loop | Phase 3 (`cf2-balance.js`): the grove's trees are skipped, so they are never noted in `c.seen`. Nothing reads grove trees there (the callers of `seenByKind`, `shareNews` and `expectedAmount` look at food and materials, and `noticeThing` does nothing for them), and the grove grows to about 240 trees over months: every mind would carry an entry for each, and every look around (about a fifth of the simulation's time) would slow as the valley ages. |

## Replacements

| What | Replaced in | How | Why |
|---|---|---|---|
| `Terrain` (core.js) | `cf2-valley.js` | Whole class, same interface | The new valley: one height function at real scale, the bluff, the ledge, the branches carved in. Methods kept from Creekfolk 1 where the shape allows (`section`, `secOf`, `fpAt`, `hwOf`, `heightAt`, `uncarvedAt`, `randomPoint`, `waterSpan`); `walkable` also keeps off the bluff and out of the spring pool. A change to Creekfolk 1's Terrain must be carried over by hand (3C changed nothing in it). |
| `creekBuildNodes` (creek.js) | `cf2-valley.js` (`cf2BuildNodes`) | Wraps it: Creekfolk 1's nodes, then this valley's cutting-down, the ledge, the branches' drained area | (3C changed nothing in it.) |
| `creekCellWater` (creek.js) | `cf2-branches.js` | Wraps it (runs it, then the cells along a branch with water stay wet) | The spring branch keeps its banks green all year. 3C added the beavers' side-dam water (`beaverPondLevels`) inside the original; the wrapper runs the original, so it is carried, and the branch only ever raises the table further. |
| `witnessesNear` (minds.js), `lookAround` (core.js) | `cf2-scale.js` | Wraps them (radius times `CF2_SCALE.see`) | Person-sized creekfolk see further. (3C changed neither; its own inline witness radii are scaled in place, above.) |
| `STRUCTURES[*].radius` (core.js and 3C's `skycal.js`, `returning.js`) | `cf2-scale.js` | Times `CF2_SCALE.build` (not dams or crossings) | Homes and the rest for person-sized creekfolk. 3C's sky stones (2.6 m, so 3.9) and procession path load before `cf2-scale.js`, so they are scaled too. 3C's new home and garden levels (porch, hearth, fourth bed) add levels, not sizes. |
| `SKYCAL.radius` (skycal.js) | `cf2-scale.js` | Value: the scaled `STRUCTURES.skycal.radius` | The room the stones look for matches the stones. |
| `GROVE.space`, `GROVE.reach` (grove.js) | `cf2-scale.js` | Values, times `CF2_SCALE.build` (2.55 m between trunks, 28.5 m from the centre) | The grove at real scale (with the edits in place above). |
| `BEAVER.smallDams` (beavers.js) | `cf2-scale.js` | Value, `cf2Count(12)` = 29 | The bigger floor has room for as many more of the beavers' little side dams as it has more of everything else. |
| `LIFE.founders`, `founderAges`, `elderDays`, `lifespanDays`, `pairBirthDays` (life.js); new `LIFE.founderSpread` | `cf2-life.js` | Values (Phase 2: ages 7 to 10.85 days, about half a day apart; elders from day 27; a life of 36.5 days; a pair's child about every 4.5 days, Creekfolk 1: 6) | Eight founders; stages for the one-month arc. 3C's grove takes "the founders" as the first `LIFE.founders` of generation 0, so all eight founders' trees are the grove's giants. |
| `newValley` (hooks.js) | `cf2-life.js` (a second wrapper) | Wraps it: each founder's span drawn again with `LIFE.founderSpread` (0.2 days) | So the founders pass one by one, the first at about day 25 and the last at about day 29 or 30. |
| `newValley` (hooks.js), `projectReason` (core.js) | `cf2-craft.js` | Wraps them: the founders arrive knowing `CF2_CRAFT.know` (dams, mud, downstream, tools, planting) with the time `-1` ("knew it from the old valley"), `stats.know_<k>` set so teaching a child isn't a first discovery, a wish for dams, a travelling party's bonds (warmth, familiarity, trust; two close friendships); a line in the log. A dam can be begun once `CF2_CRAFT.damAfter` levels are built (10; Creekfolk 1: 28). | Phase 2: the founders' craft. |
| `projectReason` (core.js), `creekRaiseDam` (creek.js) | `cf2-creek.js` | Wrap them: dams are begun and their next levels started, and silted dams raised by creekfolk, only in the dry season (`cf2LowWater`); the beavers (no `who`) raise whenever they like | Phase 2: the creek heals a step a year with the seasons, not with the number of hands. |
| `creekFloodWork` (creek.js) | `cf2-creek.js` | Wraps it: after the original, each node's floor deposit is scaled by `cf2FloorTaper` (to nothing `CF2_CREEK.floorSettle`, 0.3 m, above the starting floor), then `creekDerive`, `creekRefresh` | Decision 2: the floor settles instead of rising forever. If Creekfolk 1 changes how the floor builds, check the taper still applies to the change in `fp`. |
| `creekSpread` (creek.js) | `cf2-creek.js` | Wraps it: before the original wears new channels, mud fills the side channels within `chanReach` of the spill by `chanFill` of their depth | Decision 2: side channels fill in while new ones open. |
| `creekSyncDams` (creek.js) | `cf2-creek.js` | Wraps it: a crest that a new dam or a new level raises is capped at the floor plus `CREEK.raiseAbove` | Where the trench has filled, Creekfolk 1's crest (bed plus the dam's height) stood up to half a metre above the floor. |
| `changeWeather` (core.js) | `cf2-creek.js` | Wraps it: for one change of weather, `WEATHER.storm` is scaled by the time since the last storm (`stormGap`, `stormLo`, `stormHi`; `weather.lastStorm` is saved with the weather) | Storms in fronts: most wet seasons bring five to nine storms instead of three to twelve. |
| `cf2BuildNodes` (cf2-valley.js) | `cf2-creek.js` | Wraps it: `node.aLat` (used only for the sediment a storm brings) is weighted: little from above the valley (`mudUp`), more off the hills along it (`mudSides`), the Dry Fork's and the spring branch's own | The old valley upstream is healed and its creek runs clear. (A Creekfolk 2 function; listed because it changes what Creekfolk 1's `creekFloodWork` reads.) |
| `CREEK.fineYield`, `pondTrap`, `hillFill`, `hillTau` (creek.js) | `cf2-creek.js` | Values: 2000 (800), 0.06 (0.03), 0.035 (0.03), 110 (70) | More mud per storm, settling more readily in ponds; limestone hills that give the wet season's rain back through the dry season for longer. |
| `STRUCTURES.dam.multi` (core.js) | `cf2-creek.js` | Value: 20 (14) | A longer valley takes more dams. |
| `newValley` (hooks.js), `storyText` (minds.js), case `founding` | `cf2-life.js` | Wraps them: the first line of the history, and the founding story, say they came down the creek from the old valley | Decision 6. Creekfolk 1's founders woke from nowhere ("small creatures woke up in a meadow"). The rest of `storyText` is Creekfolk 1's. |
| `newValley` (hooks.js), `storyText`, `shortAbout`, `retell`, `lower` (minds.js), `hearWord` (core.js), `creekStorm` (creek.js) | `cf2-culture.js` | Wraps them: on day one the founders hold the old valley's words (each with a chance of their own accent), its customs (offerings at a passing, season gatherings, thanking the creek: `w.customs.*.old`) and its stories (kinds `ov-*`, dated before the valley began, already drifted; the oldest are legends); the old stories have their own sentences, short names and drift; `lower` lower-cases "In"/"When"; a child picking up a word sometimes says it with one vowel of their own accent (so the old words drift); after a storm, the first of each wet season brings those near the creek down to thank it with the old gesture | The founders' culture (docs/phase2-plan.md). Belief stays asleep (`beliefs.thanks` is set, `beliefs.giver` is not). `CONCEPT_LABELS.giver` reads "the creek that gives"; a new concept `oldvalley`. |
| `creekFloodWork` (creek.js), `lifeTick` (life.js) | `cf2-records.js` | Wraps them: after each flood, the rise of every point's bed and floor is laid down as a band in `w.records.mud` (gravel, wet-season mud or dry-season silt; thin ones wait until there's enough to see; at most 48 a point, the thinnest neighbours merged); each life tick notes when each dam was built and built up (`w.records.dams`) | The mud layers (docs/phase2-plan.md). Records only: nothing in the creek reads them. |
| `logEvent` (core.js), `lifeTick`, `passOn`, `depart` (life.js), `creekStorm` (creek.js), `storyText`, `shortAbout` (minds.js) | `cf2-chronicle.js` | Wraps them: every log line, storm and life tick feeds today's page of the chronicle (`w.chronicle`: births, passings, leavings, arrivals, storms, the day's important lines; at the day's end the population, the creek, what is built); after a founder's passing, the last of the eight gets a line, a story (`lastfounder`), a memory for everyone and `w.lastFounder` | The chronicle and the last founder's passing. |
| `lifeOptions3C` (returning.js), `lifeTick` (life.js), `checkMyths` (minds.js), `creekStorm` (creek.js) | `cf2-carve.js` | Wraps them: a new goal `carve` (action `carve`); carvings wear each life tick and are read by those nearby; a storm washes the sand drawings away; a story carved in stone is kept in `w.stories` even when nobody holds it | Carvings by material (docs/phase2-plan.md). |
| `creekFloodWork` (creek.js), `lifeTick`, `passOn`, `depart` (life.js), `lifeOptions3C` (returning.js), `storyText`, `shortAbout` (minds.js), `devTrigger` (hooks.js) | `cf2-treasure.js` | Wraps them: after a flood, treasures the player placed travel down the creek and settle (tracer stones), and mud buries those left in a pond or on a bar (`world.records.mud[node].tr`); each life tick, creekfolk passing near one notice it and go to pick it up (action `picktreasure`), then do what its kind calls for (action `tfate`: set into a dam, kept at home, planted, worn); a treasure worn by one who passes goes to a child or to their tree in the grove, by one who leaves goes with them; new goals `search` (after a storm, walking the banks) and `offer` (Creekfolk 1's `ACTIONS.offer` at the Giving Place after a find); story kind `treasure`; dev trigger `treasureready` | Phase 3, care: treasures delivered by the creek (the brief; Decisions 4 and 6). A find is a gift for Creekfolk 1's belief: `noticeGift`, `w.gifts`, `w.giftLast`, `w.stats.gifts`. |
| `beyondTick`, `watchOption`, `giftRequests` (gift.js); `GIFT.restDays`, `beyondGifts`, `beyondDays` | `cf2-treasure.js` | Replaced: the one who suspects after about ten treasures found and twelve days, with three in the last fortnight (Creekfolk 1: a hundred gifts, five months, seven in a fortnight); no keeping watch for a gift that's due and no standing requests (treasures are rare and unpaced); the creek "rests" after ten days without a find (Creekfolk 1: three) | Decision 6; the brief (requests only as information, optional: left out). |
| `lifeTick` (life.js), `lifeOptions3C` (returning.js) | `cf2-kindness.js` | Wraps them: food the player leaves (`leaveFood`, `world.kindness`) is noticed by those passing, eaten (action `kindeat`), learned as a spot they come back to (goal `kindfood`), answered with a small thing left back; a spot several know gets a name | Phase 3, care: everyday kindness. |
| `lifeTick` (life.js) | `cf2-founders.js` | Wraps it: each valley year, on the day the last founder passed, the oldest lead whoever is about to the founders' stones (or trees) to tell the young who the eight were, and leave the valley's offering at each founder's tree (`res.left`); it becomes a custom with its own word (`world.customs.founders`; concept `remembering`; action `remember`) | Phase 3: customs around the founders. |
| `templeCanStart`, `springTick` (temple.js), `TEMPLE.greatDay` | `cf2-belief.js` | No temple, no Hall of the Ancestors, no journey to the spring | Creekfolk 2 leaves the temple out; nothing is paced by the player. 3C's procession path and the Returning festival both need `w.temple.state === "done"`, so they never happen; what is left of the Returning is the glowing fish run at midwinter (`returningTick`'s "no temple" branch). |
| `BEAVER.earliestDay`, `driest`, `latestDay`, `mendAt`, `above`, `smallDams` (beavers.js) | `cf2-beavers.js` | Values: 22 (120), 0.5 (0.55), 28 (210); 0.6 (0.75), 0.1 m (0.25), 12 (`cf2-scale.js`: 29) | Phase 3: the beavers come in week 4, before the last founder passes (the brief), and keep the dams to the creekfolk's own standard so the healed floor still feels the dry season a little (with Creekfolk 1's numbers it stayed 95 to 99% wet at the driest). |
| `beaverArrivalCheck`, `beaversArrive` (beavers.js) | `cf2-beavers.js` | Wrap them: the check runs once a valley day, at the first life tick after dawn, while someone is up; before `latestDay` it also needs the driest point at `BEAVER.driest`, spring (or day 26 on: `CF2_BEAVER.anyDay`) and a chance (`dawnChance`) before calling the original. After the original: a pair that comes in spring has its first kits the next spring (`B.kitsYear`), and if nobody holds the story of their coming, the awake creekfolk nearest the lodge finds it (learns the story as a witness, a memory, the words for beaver and the lodge) | They come in the night and are found in the morning, as their line in the history says; Creekfolk 1's check had no time of day, and a night arrival had no witnesses, so the story was "forgotten" a day later. |
| `bestWork` (core.js) | `cf2-beavers.js` | Wraps it: with a grown beaver in the valley, every built dam the beavers see to (`cf2BeaversKeep`: not worn below `CF2_BEAVER.leaveBelow` 0.3, and no raise that needs a stone apron first) gets `s.beaver = -1` for this one call, put back exactly as it was after, so the repair loop passes it over as it does a dam a beaver is already mending | The beavers take over much of the dam-tending: creekfolk mend only a badly worn dam, and build up only where a stone apron is needed. In Creekfolk 1 they pass over only a dam a beaver is on its way to. If Creekfolk 1 changes the repair loop's skip test, check `s.beaver` is still how a dam is passed over. |
| `lifeTick` (life.js) | `cf2-balance.js` | Wraps it: every `BALANCE.every` (6 h) after the original, `balanceWorld` lets go of what nothing needs any more: lineage records (after caching each record's family line in `line`; records kept long after their creekfolk has gone lose `children`, `partner`, `age` and `how`, which follow from the others), Creekfolk 1's `w.timeline` and `w.popLog` beyond 30 days (nothing in Creekfolk 2 reads them), ties to those long gone (`c.rel`), the work shares of the gone (`s.contribAll`, folded into `s.contribPast`), noted pairs (`w.mile.pairs`), the departed who have lived out their span (`w.downstream`), myths of stories that are gone (`w.myths`), and places named for a passing whose names have fallen out of use (with their words in every lexicon and `w.mile.words`). Counts in `w.balance` | The equilibrium runs forever with a bounded save (the brief). Changes what Creekfolk 1 keeps for good: `w.lineage` (Creekfolk 1 never drops a record; readers that walk it, such as `ancestors`, grove kinds and `cwLine`, find what they need, see the file's header), `w.downstream` (Creekfolk 1 kept 400). A Creekfolk 1 change that reads old lineage records (or their `children`, `partner`, `age`, `how`), old ties, old places, the timeline or the population log must be checked against this. |
| `visits` (minds.js) | `cf2-balance.js` | Wraps it: after the original, a visitor whose `look`, `temp`, `interests`, `accent`, `lex`, `rel`, `parents` or `children` is the very object kept in its `w.downstream` snapshot gets a JSON copy of it | A bug in Creekfolk 1 (3C too): the visitor and the record of how it left share objects, so everything the visitor learns here changes the record, until a save and reload separates them; a reloaded valley then goes on differently from one that wasn't (`tools/determinism.cjs` from a day-22 save, seed cf2-3, failed on it). Worth fixing in Creekfolk 1's `visits` itself (copy the snapshot's objects in its two `Object.assign` calls); then this wrapper can go. |
| `worker.js` | not used | Creekfolk 2's worker is `cf2-worker.js` | The simulation runs in the worker all the time, not only for catch-up. |

## Merge history

### 3C (Creekfolk 1 `59d5e4b`, merged 2026-10-21)

Base `8e9ec93`, theirs `59d5e4b`. Full report: `docs/MERGE-3C.md`.

- **Three-way merges:** `core.js`, `creek.js`, `life.js`, `minds.js`, `fauna.js`, `gift.js`,
  `temple.js`, `hooks.js`, `api.js`. No conflicts: Creekfolk 2 had edited only `core.js`
  (obstacles, doorPoint, createWorld) and `creek.js` (VW/VL, creekHydro), and 3C touched
  other lines of both (`core.js`: a concept label, the sky stones' and path's materials, a
  level's `ready`, more than one garden, a dam a beaver is mending, the porch and hearth
  wanted like the room before them, `homeFoundOption`, `homeGardenFor`, upkeep of the
  great projects, `homesTick`, `beaverTick`; `creek.js`: `creekRaiseDam`'s options,
  `beaverPondLevels` in `creekCellWater`). The other seven were unchanged in Creekfolk 2,
  so they are now exactly 3C's (plus the `// CF2:` edits listed above in `minds.js`).
- **New files, copied:** `looks.js`, `homes.js`, `grove.js`, `beavers.js`, `skycal.js`,
  `returning.js` (3C's order, after `temple.js` and before `hooks.js`), with the `// CF2:`
  edits above in `grove.js`, `skycal.js`, `beavers.js` and `returning.js`; `looks.js` and
  `homes.js` unchanged.
- **Replacements checked** against 3C's versions: 3C changed none of `Terrain`,
  `creekBuildNodes`, `witnessesNear`, `lookAround`, `createWorld`, the `LIFE` values,
  `templeCanStart` or `springTick`; it changed `creekCellWater` (carried by the wrapper)
  and added two `STRUCTURES` (scaled by the existing loop).
- **Left out:** the temple, the Hall of the Ancestors, the procession path and the
  Returning festival (all still in the code, never started: see `cf2-belief.js`); 3C's
  view, sound and then-and-now (Creekfolk 2 has its own renderer); 3C's tools.

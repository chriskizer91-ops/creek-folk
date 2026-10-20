# Creekfolk: changes before Phase 3

Read this after BRIEF.md, PHASE1.md and PHASE2.md, and before you start Phase 3. I tested the Phase 2 build by jumping through a whole year with the dev menu, then spent a long session deciding what the year should become. This file is the result. Where it disagrees with BRIEF.md, this file wins; each override is marked **(overrides the brief)**. Everything else in the brief still stands, including its first instruction: put your heart and soul into it.

The short version: the valley becomes longer and wider, with a real creek model behind it. The creekfolk turn a cut-down, seasonal stream into a year-round wetland, and that is what lets the valley hold more of them. They come to believe the gifts come from the creek. A temple to the creek rises in three stages over the year, at a pace set by how faithfully the player gives. When the temple is finished, a festival called the Returning begins and comes back forever.

---

## 1. Builds, saves and the dev build

**Every new version has its own saves.** From now on, each build uses its own storage name (include the version in the IndexedDB database name). It never reads saves from earlier versions. The player keeps several separate valleys, one per version, and can go back to any of them. Importing a save file exported from a different version is refused with a clear message ("This valley was made in an earlier version of Creekfolk and can't be opened here"). Don't change old builds retroactively.

**Two files every time.** Every build makes two HTML files from the same source:
- `creekfolk.html`, the normal game. The hidden dev menu can stay, behind its key combination.
- `creekfolk-dev.html`: the same game plus a visible **Dev** button that works on a phone **(overrides "laptop only" in the brief)**.

The dev build:
- Uses its own storage, separate from the normal build's, so a dev jump can never touch a real valley.
- Saves a snapshot automatically before every jump, with a list to restore from.
- Options: jump forward (+1 day, +1 week, +1 month, +3 months, +6 months, +12 months; jumps replay every moment in full, as now); give a gift with no 12-hour wait; trigger events (storm or flood, birth, passing, visitor, beavers arriving, the Returning); overlays (wetness, worn paths, channel stage I–V on each stretch of creek, land capacity); pause time; the mind reader.
- Phones are slower, and they pause background tabs. Measure catch-up on a phone and report the numbers. Show a "keep the screen on" note during long jumps.

Both files should keep working on a phone (touch already works). Laptop is still the main target for performance.

## 2. Time and seasons **(overrides "seasons follow the real calendar")**

Keep: one valley day = one real hour; a life is about 30 real days; a gift every 12 real hours.

New: **one valley year is about 8 real days** (192 valley days; each season lasts 2 real days). Not exactly 7, so seasons drift across weekdays and a player who only plays at weekends still sees every season. A creekfolk lives about four valley years, and about 45 valley years pass in a real year.

Today the season is used only for the "Spring has come" message and the season gathering, so this is a small change to `seasonAt`. Then build the seasonal world on top of it.

**Wet and dry.** Winter and spring are the wet season, when storms come and the creek runs. Summer and autumn are the dry season.
- Early in the game, the creek **stops flowing** in the dry season and the **whole valley dries out and goes brown** by the end of it. Drying is real logic, not just a colour change.
- After the first dam, a small pool survives the dry season, and the ground around it stays green a few valley days longer. The rest of the valley still dries out.
- As dams multiply and the floodplain reconnects, more stays wet for longer each year.
- By about month 6–9 of real play, the whole valley floor stays marshy all year round.
- The measure of progress is how much of the valley is still wet at the driest point of the year. Show it in the village panel.

**The sky calendar** finds *their* midwinter, which comes once every valley year **(overrides "find the solstice on the real date")**.

## 3. The valley and the creek

**Bigger valley, same population cap.** Make the valley about 2–3 times longer along the creek and somewhat wider, so the creek has room to wander. The cap stays at 36. The extra space is for them to develop: plains and woods, several gardens, shrines, the temple. The current 64×64 grid is assumed by the terrain, worn paths, wetness map, valley edge and camera limits; change all of them. Measure catch-up before and after. I expect 30 days to go from about 4 minutes to roughly 6–10, but that's a guess.

**Where things start.** The village starts at the upstream end of the valley, on the edge away from the water. The creek starts **incised** (cut down below its floodplain) and **fairly straight** across the valley. The spring at its source lies upstream, beyond the edge of the valley: a place they hear about and later journey to.

**The creek model: port Creek Care's river model.** The author's other game, Creek Care, has a river-scale model in plain JavaScript. It runs on the processor, not the GPU, uses seeded randomness, runs in Node, and simulates decades in moments. It's attached as `creek-care-river-core.js` (cut from `creek-care.html`, the section that begins "River scale: the numbers behind the valley view"). Don't use Creek Care's ranch-map water engine: it runs on the GPU, can't be replayed deterministically, and is far too heavy.

What the river model already does:
- The creek is a chain of nodes, each with a bed, banks, a floodplain level, an inset bench, and gravel, soil and limestone layers.
- Floods are sized from drained area. Water depth comes from Manning's equation in a compound channel.
- Banks wear back and tall banks slump. Gravel moves (Meyer-Peter and Müller), and the bed rises and falls by mass balance (Exner). Mud settles on the floodplain when water goes overbank.
- Bends migrate, and pinched-off loops become oxbow lakes.
- Each stretch is classed on channel-evolution stages I–V (steady, cutting down, banks falling in, refilling, healed).
- It has structures: rock weir, beaver dam analog, headcut plug, silt pond.

How to adapt it:
- `Model` loads on its own. `buildValley` needs Creek Care's world generator (`Creek.ranchStreams`), so write Creekfolk's own valley builder in its place. The `CALIB` data is specific to Creek Care's valley; don't bring it over.
- **Scale.** Creek Care models a 6 × 15 km valley with nodes every 40 m. Creekfolk's creek is a small stream. Recalibrate the physics for that size; it should stay a toy with real physics in it.
- **Time.** Creek Care steps a year at a time with a few floods. In Creekfolk, each wet-season storm is one flood event. Tune storm frequency so the arc in section 4 takes the real year.
- **The creek only ever gets better** **(a settled rule)**. Floods may reshape the creek, but only in ways that build: dropping mud, filling the bed back up, opening side channels. Dams never wash out. Instead they age and the creekfolk tend them as an ordinary chore (later the beavers help). Nothing their work built is ever undone.
- **The missing last stage.** The model knows one main channel, plus oxbows. The end state we want is the multi-channel valley-floor wetland ("Stage 0", which Cluer and Thorne added to the evolution model in 2014): once the bed fills back up to the floodplain, water spreads across the valley floor in many small channels, ponds and marsh. Write this spreading. It's the biggest new piece of code, and it's what makes the late-year valley look completely different.
- **Drawing.** The creek's shape on screen comes from the model's numbers: width, bed, benches, and water spread over the floodplain. It is no longer a fixed curve. Ponds should widen the creek and branch out like a real wetland, not just tint the ground.
- **Learning from the creek.** "Build downstream first" should come from what the model does, not a script. For example, a dam high on a steep, cut-down stretch can't hold back a pond until the stretch below has been raised. Someone notices, an elder works out why, and it becomes knowledge they teach (and can lose). Use the model to make their discoveries real wherever you can.

**Capacity comes from the creek.** Today capacity = 8 + 4 per home + 2 per store and garden level, capped at 36. Make it the lower of two ceilings:
- **Shelter:** the current building formula.
- **What the land can feed:** starts at about 20 and rises toward 36 as the creek heals: ponded water, reconnected floodplain, healed stretches, gardens watered by seepage, fish and reeds.

How many creekfolk there are should show how healthy the creek is. Show "the valley can feed about N" in the village panel. The "never fails" rules still apply in full.

## 4. The year at a glance (real time)

| Real time | The creek | Still wet at the driest point | The village |
|---|---|---|---|
| Week 1 | Cut down, fairly straight, stops flowing every dry season | Nothing | 5 founders; first gifts |
| Weeks 1–3 | First dam; a pool survives the dry season | One pool and a little green around it | Gift beliefs forming |
| Week 2 or later | | | The temple can start (section 6) |
| Months 1–2 | Several dams and ponds; the bed starts filling back up | Pools, but the valley still dries out | About 20 creekfolk |
| Months 2–4 | Floodplain reconnects in stretches; side channels in the wet season | Patches of marsh survive | |
| Months 4–6 | Most of the valley floor is wetland | Most of it | Close to 36; **beavers arrive at about month 6** |
| Months 6–9 | Beavers and creekfolk build together; the creek splits into many channels | The whole floor stays marshy all year | Temple stage 2–3 |
| Months 10–12 | A fully grown wetland: willows, fish, herons | Everything | Temple finished; the Returning begins |

The wetland is driven by their work and the wet-season floods. Gifts like rain help, but they never gate it.

**The beavers.** When the valley is as much wetland as it can get (about month 6), real beavers arrive. The creekfolk have been doing beaver work all along, and now the beavers take over much of the dam-tending. That frees creekfolk to work on the temple, which is what makes stage 3 possible. The water running down the finished pyramid comes from the higher water the beavers hold up.

## 5. The gift and the creek

**The creek is the giver.** The player gives the gifts, and the creekfolk come to believe the creek gave them. The creek is their life-giver. The feeling is gratitude, care and kinship more than fearful worship: "the creek keeps us; we keep the creek." Caring for the creek is how they say thank you.
- "The creek gives" becomes the main belief. Doubters say it's just luck. Let "someone watching" fold into the creek belief: rain is creek water from the sky, so the one who sends it lives where the creek begins, at the spring.
- The spring becomes their holiest place, and finding it becomes a journey that means something. News of the spring can first arrive with a traveler.

**The feedback loop.** It should be warm, never guilt-driven:
- **They ask.** The simulation already knows which gift would help most (`giftNeed`). Believers say it out loud as requests the player can read ("the gardens are dry"). Answering a real request strengthens belief more than a random gift.
- **They expect you.** When a gift is due, believers gather at the giving place and leave small offerings. The player opens the game and finds them waiting.
- **They give back.** They leave things at the shrine for the player (a carved bead, a flower), and these collect over the year.
- **They remember.** Gifts become stories, giving days go on their calendar, and the place of the first gift gets a name.
- **When the player is away,** it stays gentle: "the creek is resting," a lantern left lit. Nothing like "what did we do wrong."

**Fix the rhythm wording.** One gift every 12 real hours is one every **12 valley days**, so they should never say gifts come "twice a day." Because a valley day is exactly one real hour, a player who always opens the game at the same minute arrives at the same valley hour each time. Let them notice ("the creek gives at dawn, every twenty-four days").

**What can be given.** Keep rain, seeds, a warm day and a found object. Add more, especially gifts that add something new to the valley:
- **Living things:** seeds of a new flower or fruit tree, a pair of goats, bees, fish for the ponds, a new kind of bird.
- **Weather:** rain (precious in the dry season), a snow day for play, a clear starry night, a rainbow.
- **Materials:** a fallen great tree, a bank of good clay, a pile of stones.
- **Wonder:** a found treasure, a dream that gives one creekfolk an idea.

Over a year, the valley fills with the species the player chose, so every valley looks different. Gifts still never decide survival. Beavers are not a gift; they come because the creek is healed.

**The one who believes in you.** After about 5 months of consistent giving (100 or more gifts), one creekfolk becomes convinced the gifts come from someone beyond the valley, from another place. It still honours the creek, because the creek brings life, but it insists the gifts come from someone else.
- When the player opens the game, it looks up at the camera and waves.
- At most one or two such creekfolk at a time. The others think it's odd but are fond of it.
- It can pass the belief to one child or apprentice, so it runs through a single family.
- This should be a small amount of code: a belief flag, a few lines of speech, a wave.

## 6. The temple

**What counts.** The creekfolk can't tell whether the game is open; they only see gifts arrive. So "consistent play" means gifts.

**When it starts:** when there have been at least 7 gifts in the last 14 real days (one every other day) *and* most of the village believes the creek gives. That's week 2 at the earliest. A player who starts giving later starts the temple later.

**Pace, set by the player's giving** (all real days):

| Giving | Pace |
|---|---|
| Every other day | Full speed |
| Daily | 1.2× |
| Twice a day | 1.4× |
| About every 4 days | Half speed |
| In between | Somewhere between half and full |
| 6 days with no gift | Stops. Nothing is lost; it restarts with the next gift |

While it's stopped, they tend the temple, leave offerings, and wait for a sign. A half-built temple stands, and stories grow up around it.

**How progress works.** Each stage has about a dozen parts. A part unlocks when the village feels the creek has answered enough. That feeling builds from recent gifts at the pace above. Then the creekfolk build the part with real labour and materials, and the materials keep their own clocks: timber from trees they planted, clay that has to cure, stones moved only in the dry season. Make sure labour and materials don't become the bottleneck at the fastest pace.

**Three stages.** Tune them so an every-other-day player finishes stage 3 in the middle of month 11:
1. **Shrine.** Stacked stone at the giving place, where offerings are left.
2. **Hall.** A clay-tile roof, with carved stories on the walls.
3. **Crown.** A stepped pyramid with creek water running down its steps, lined up so their midwinter sunrise shines through it.

Expected finish: every other day, mid month 11; daily, about month 10; twice a day, about month 8.5.

**Valleys that never reach the gift threshold** build a different great project to honour the creek (a spring house at the source, or a hall of the ancestors), at base speed on time alone. Every valley gets a long build, but only a valley with a giver builds the temple.

## 7. The Returning (the ending that never ends)

When the temple is finished, the creekfolk spend a few valley years preparing a procession path from the temple up to the spring. That puts the first Returning in month 12 for an every-other-day player (about month 10.5 for daily, about month 9 for twice a day).

On their midwinter morning, the sunrise lines up through the crown, and the water on the pyramid steps turns gold. That night, a run of softly glowing fish swims up the healed creek all the way to the spring. The whole village lines the channels with lanterns. The beavers are out, and the fireflies too. The one who believes in the player looks up at the camera.

**It comes back every midwinter (about every 8 real days), forever.**
- Each Returning adds something: a lantern on the pyramid for each creekfolk who passed since the last one, a new carving, a new verse to their song. The fiftieth looks fuller than the first.
- Show "the next Returning is in 3 days" so the player knows when to come back.
- Valleys without a finished temple still get the fish run once their creek heals, but not the sunrise through the crown or the festival.

**The game keeps going after a year.** Everything that piles up needs a limit or a way to fold old entries in: grove trees (the oldest fall and become nurse logs where new growth starts), stories (very old ones merge into legend), the history log, carvings, offerings and lanterns. Run the year tests over **two** years and show that memory and save size stay flat.

## 8. Creekfolk, homes and life

**Looks you can trace through families.**
- More fur colours than today's 12, plus coat patterns (stripes, masks, socks), all passed down so descendants are recognisable.
- Small things to wear that match their passions (a builder's apron, an explorer's scarf).
- **The three ages readable at a glance:** children with bigger heads and smaller bodies; elders greyer, with a walking stick.
- **Believers wear the treasure they found.**

**Homes.**
- The front door is the owner's (or builder's) colour.
- Decorations come from what they love: flowers, stacked stones, chimes.
- More home levels.
- More garden beds and more than one garden.
- Pacing is still Phase 4's job.

**The memorial grove.**
- Three or four tree kinds (the game already has pine, willow, oak and birch), chosen by what the creekfolk loved or by family line, so lineages grow in clusters.
- Trees keep growing all year, so the founders' trees are huge by the end. Today they stop at three sizes.

**Animals and life.**
- Goats (or a goat-like creature) tended for wool and company, never for meat. They can arrive as a gift.
- Birds, butterflies in summer, fish in the ponds, herons, mist on the marsh at dawn.
- The beavers (section 4).

**Leaving and coming back.** Once a creekfolk leaves downstream, nothing about it is simulated while it's gone.
- Travelers and returnees arrive with news (of the spring, or of the next valley healing because leavers took the craft with them).
- If a returnee stays, set up its mind fresh at that point. Keep its name, family, inherited looks and old relationships, so the village remembers it and the lineage still shows.

**Named places** get a cairn or signpost where they are. Scenery outside the walkable valley can get richer too: a distant lake downstream, hills on the horizon.

## 9. Three small additions (from the Claude who helped plan this)

- **Then and now.** Keep the valley's day-one state (the creek model's starting nodes are enough) and give the player a hold-to-see button showing the valley as it was. It works like repeat photography in stream restoration, and over a year it becomes the most moving thing in the game.
- **The valley sounds as healthy as it is.** Let the soundscape follow the wetland: the frog chorus, birdsong and insect hum should start sparse and grow fuller as the creek heals, so the valley's health can be heard with the screen off.
- **The First Pool.** The pool behind the very first dam becomes a named place forever. The Returning's procession passes it on the way from the temple to the spring.

## 10. Suggested order

Phase 3 is now much bigger. Split it, and stop to show the author after each part:
- **3A, the land:** the bigger valley, the ported river model and multi-channel wetland, the 8-day year with wet and dry, drying logic, capacity from the creek, the separate-saves rule, the dev build.
- **3B, belief and the temple:** the creek-as-giver belief, requests and the feedback loop, new gifts, the temple and its pacing, the one who believes in the player.
- **3C, life and the ending:** looks and inheritance, homes, the grove, goats, beavers, the Returning, endless running, the three additions.

Then Phase 4 (visuals: the art bible must cover the 8-day year and the wet and dry looks) and Phase 5 (year tests, run over two years).

**Phase 5 targets to rewrite.** "Most valleys fill between month 2 and month 6" depends now on the creek. "Most valleys build a kiln by month 3" needs re-checking against the new pacing. "The sky calendar is usually finished before the second solstice" must mean their solstice. Add:
- An every-other-day giver finishes the temple in month 11.
- A valley with no gifts finishes its own great project.
- The valley floor stays wet all year by month 9.
- Beavers arrive between month 5 and month 7.
- Memory stays flat through year 2.

Also from the Phase 2 report: no skill was ever lost in testing. The bigger valley and longer projects may change that. Check it again.

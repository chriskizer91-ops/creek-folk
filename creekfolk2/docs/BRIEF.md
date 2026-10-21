# Creekfolk 2: the Leavers

You're making a new game: Creekfolk 2. It descends from Creekfolk, in its story and in its code. Read this whole brief before you start. Then read the Creekfolk documents listed under "What you've been given" so you understand what came before.

The first Creekfolk was made when the author asked an instance of Claude to put its heart and soul into a game about a creek and the folk who live beside it. That instruction still applies, interpreted however you wish. Within the rules below, invent freely: names, customs, small moments. Make decisions yourself and tell the author what you decided.

## The idea in one paragraph

Eight young creekfolk leave the first valley and follow the creek downstream to a new one. Its creek is cut down and dries out every summer. They know how to heal a creek, because their valley taught them. Over one real month, the length of their lives, they build a village, raise children and grandchildren, and turn the creek into a living wetland. They carve what they want remembered. Then, one by one, they pass, and the story the game tells ends with the last of them. Their descendants inherit a finished valley and keep living in it, forever, whether or not anyone is watching.

## What the author cares about (read this first)

- **A story lived, not told.** Earlier games told stories. Creekfolk is an attempt at a story being lived. Nobody scripts the myths, names or events; they come out of the creekfolk living. The authors write only the conditions for a life.
- **Every moment actually happens, and keeps happening whether or not anyone is watching.** When the player comes back, nothing was skipped or faked. The missed time is replayed in full, deterministically, and the game shows it was ("Catching up").
- **Care, offered freely.** The creekfolk don't need the player. Offering care is always possible, always noticed, never required. The player is a neighbor, not a god or a warden. Nothing waits on the player, and nothing is paced by the player.
- **Built to last.** It's one self-contained HTML file meant to run for years on a computer that never goes online.
- **Real science, gently.** The author loves fluvial geomorphology: watching water move earth, erosion you can see, and caring for creeks the way beavers do. The creek should behave the way real creeks do, true in direction even when time is compressed.
- **Creekfolk are creatures that live in a digital space.** They aren't people. They're cute, low in detail, and descended from the first game's creekfolk.

## What you've been given

The author will give you these. If any are missing, ask for them before you start.

1. **Creekfolk 3A, the current version:** `creekfolk-source-3a.zip`. Its `CLAUDE.md` maps the source, `docs/HANDOFF.md` says where things stand, and `docs/` holds `BRIEF.md`, `PHASE1.md`, `PHASE2.md`, `PHASE3-CHANGES.md` and `PHASE3A.md`. `node tools/build.mjs` builds `creekfolk.html` and `creekfolk-dev.html`. **The simulation (time, minds, river model, wet and dry, the drop rule, Stage 0, capacity, saves, catch-up, dev build) is your starting code.** Creekfolk 3B and 3C are still being built. See "Starting before Creekfolk 3C is finished" below.
2. **What the Water Brings:** the source zip `what-the-water-brings-polished-source.zip` and the built `What_the_Water_Brings.html`. **Its renderer, valley and creatures are your starting look.** It's a pixel-art 3D walk through a North Texas creek valley, made by the author as a personal gift. `python3 build.py` joins the modules in `src/ORDER` into one file. The modules to carry over:
   - `pixel3d.js`: the pixel pass (palette snap, outlines, contact shading, grading, haze, sky, night glow).
   - `toon.js`: the palette-ramp material every surface uses (`PKToon.rampMat`, `PKToon.FX`).
   - `toon2.js`: the chunky "Sheet king". Model the creekfolk on how it's built. It uses the shared rig and clips from `skin.js` and `king3.js`.
   - `valley.js`: terrain, creeks as profiled curves, water, trees, plants, fords, tile streaming and the far version.
   - `life.js`: the creatures.
   - `cloth.js`: knit, tweed, gingham and other textures, for family clothing.
   - `core.js`: noise, canvas painting, lofted meshes, tapered tubes.
   - `tools/shots.py`, `sheet.py` and `perf.py`: scripted screenshots, contact sheets, drawing cost.

   Leave out the lifelike king (`body3.js`, `wear.js`, `card*.js`), the finds and the poems; they belong to that game and its people. Don't use the names Richard Sale, Tom Sale or the Philosopher King in Creekfolk 2.
3. **Creek Care:** `creek-care-source.zip`. Creekfolk 3A already ported its river model (`src/river-core.js`; also in Creekfolk's `ref/`), so this is reference only. It's useful for what 3A left out: bends migrating and oxbows (`P._migrate`, `P._cutoffs`), calibration (`tools/river-calibrate.js`), and its own tests.

**Joining the two codebases (watch this):**
- **three.js versions differ.** Creekfolk 3A uses three.js r186; What the Water Brings uses r128. Port What the Water Brings' rendering code to r186; don't ship two copies. Things that changed between those versions and will shift the look:
  - colour management: `outputEncoding`/`sRGBEncoding` became `outputColorSpace`/`colorSpace`, and colour management is on by default
  - light intensity units (physically based since r155)
  - some shader chunk names
- **Check the port with screenshots.** Render the same spots and hours before and after with `tools/shots.py`, and compare until the r186 version matches the r128 one.
- **Fonts.** `src/template.html` loads Google Fonts, which won't work offline. Embed the fonts or use system fonts.

## Starting before Creekfolk 3C is finished

Creekfolk 1 is partway through its Phase 3. 3A (the land) is done and is what you have. 3B (belief) and 3C (life and the ending) are being built in another session and will arrive as a new source zip (3C will include 3B) with their reports. **Start now with everything that doesn't depend on them, and structure the code so they can be merged in cleanly.**

**What to do before 3C arrives:**
- **The look:**
  - Port What the Water Brings' renderer, materials and valley to three.js r186.
  - Build the new real-scale valley.
  - Build the zoom from dots to faces.
- **The creek:** scale 3A's creek model up to the new valley, and add the Dry Fork and spring branch if you use them.
- **The rules:** offline-only, the clock guards, separate saves, the dev build, replay determinism and the catch-up benchmark.
- **The life stages** tuned to the one-month arc, and the founders arriving with their culture.
- **The three records of time,** the chronicle, and the two kinds of care.
- Everything in Phase 1 and most of Phase 2 below.

**How to keep it mergeable:**
- Copy Creekfolk's `src/sim/` layout and keep each module's role.
- Put Creekfolk 2's own logic in new files where you can, rather than editing the shared modules.
- Where you must edit a shared module, mark each edit with `// CF2:`. That way 3B and 3C can be merged by comparing their changes against 3A, not by hand.
- Keep a short `docs/MERGE.md` listing every shared function you changed and why.

**What 3B and 3C are planned to contain** (from Creekfolk's `docs/PHASE3-CHANGES.md` and `PHASE3A.md`; the reports when they arrive are what count). What Creekfolk 2 should take from each:

| Planned in Creekfolk 1 | Creekfolk 2 |
|---|---|
| **3B:** the creek as the giver (the main belief; luck as the doubters' view) | **Take it.** In Creekfolk 2, treasures literally arrive with floods. |
| **3B:** believers leave offerings for the player; gifts become stories; the place of the first gift gets a name | **Take it.** |
| **3B:** the one who believes in you: rare, waves at the camera when the game opens, passes the belief to one child | **Take it.** It's the author's own addition. |
| **3B:** new gift kinds (goats, bees, fish, birds, flower and fruit seeds, snow day, starry night, rainbow, fallen tree, clay, stones, a dream) | **Take the living ones as treasures or seeds** where they fit. Weather and material gifts are optional. |
| **3B:** requests the player can answer ("the gardens are dry"), believers gathering when a gift is due, "the creek gives at dawn" | **Optional, and only as information,** never as an obligation. Creekfolk 2's treasures are rare and unpaced. |
| **3B:** the temple, three stages paced by the player's giving | **Leave it out.** Nothing in Creekfolk 2 is paced by the player. |
| **3C:** inherited looks: more colours, coat patterns, things worn for passions, the three ages readable, believers wearing treasures, doors in the owner's colour | **Take the inheritance logic** (what's passed down and how). Draw it Creekfolk 2's way, with cloth patterns. |
| **3C:** more home levels and decorations from what they love; more garden beds | **Take it,** rescaled to real size. |
| **3C:** the memorial grove: tree kinds by lineage, trees growing all year, the oldest falling as nurse logs | **Take it.** Its rings are part of the land's record. |
| **3C:** goats tended for wool and company; birds, butterflies, fish, herons, mist | **Take it,** alongside What the Water Brings' creatures. |
| **3C:** beavers arriving once the valley is as wet as it can get, then tending dams | **Take it.** In Creekfolk 2 they arrive in week 4. |
| **3C:** the Returning: a festival every midwinter after the temple, with a glowing fish run to the spring | **Take the fish run** as a yearly event in the healed creek. The temple-linked festival stays in Creekfolk 1. |
| **3C:** running forever: caps or folding for the grove, stories, history, carvings, offerings | **Take it.** Creekfolk 2's equilibrium depends on it. |
| **3C:** then-and-now (the day-one creek is already saved in 3A); the soundscape following the wetland; the First Pool as a named place; cairns at named places | **Take it.** |
| **3C:** leavers with no simulation while away; returnees who stay get a fresh mind but keep name, family, looks and ties | **Take it.** |
| **Later:** the sky calendar (`daysToMidwinter()` exists in 3A) | **Optional.** |

**If 3C differs from this plan, its report wins.** Tell the author what changed and how it affects Creekfolk 2. When 3C arrives:
1. Read the reports.
2. Merge the sim changes.
3. Rerun the determinism and catch-up tests.
4. Report what you merged and what you left out.

## Settled decisions

These are the author's choices. Don't change them without asking.

### Platform and files
- One self-contained HTML file to play, built from readable source kept in a repo. The simulation runs in a Web Worker, separate from drawing.
- **Fully offline.** No network requests at all. Embed every font, sound and texture. (What the Water Brings loads Google Fonts; don't carry that over.)
- **Two files every build:** `creekfolk2.html`, and `creekfolk2-dev.html` with a visible Dev button that works on a phone. Carry over 3A's dev build: its own storage, a snapshot before each jump, jumps, events, overlays, pause, the mind reader, and the "30 days would take about N min here" readout.
- **Every version has its own saves.** Put the version in the IndexedDB name. Never read saves from earlier versions or from Creekfolk 1. Refuse imports from other versions with a clear message.
- Laptop and phone should both work. Measure catch-up on both if you can, and say plainly what you couldn't measure.

### Time
- **One valley day = one real hour.** Keep 3A's **8-day valley year** (192 valley days; wet season in winter and spring, dry season in summer and autumn).
- **The arc is one real month: one founder lifetime.** Tune the life stages so that **the last founder passes at about real day 30** (between day 28 and day 32). Founders arrive as fresh young adults. A suggestion: child 0 to 7 days, adult 7 to about 27, elder about 27 to about 36, with a day or two of natural variation. Children are born in week 1, grandchildren are grown by week 4, and great-grandchildren can arrive.
- **After the arc: a living balance.** The valley never freezes and never stops happening. It settles into a dynamic equilibrium, like a graded stream or a mature forest: seasons, floods, births, passings, festivals and repairs continue, but nothing trends any more. It must run indefinitely.
- Missed time is replayed in full, deterministically, with seeded randomness only. Write the state-hash test that proves a replay ends identical to a live run.
- **Clock safety on a machine that never connects:**
  - If the clock jumps backward, the valley waits; what happened can't un-happen.
  - If it jumps implausibly far forward (more than about 90 days), ask before replaying.
  - Let the player set the valley's clock in Settings.
  - Offer export and import of the valley as a backup file.

### Who they are
- **Founders: eight young adults who left Creekfolk 1's valley downstream.** Generate them; don't import a Creekfolk 1 save. They arrive carrying:
  - The craft of creek-healing (dams, building from the bottom of the creek up, tending ponds). This creek still has new lessons for them.
  - Their old valley's culture: a word for the creek that gives, the custom of thanking the creek, offerings at passings, gatherings at the season's turn, and stories of the old valley that have already drifted. Their grandchildren will hear about a valley no one living has seen.
  - Their accents and words. Expect new words to arise in the new valley and old ones to drift.
- **Minds:** start from Creekfolk 1's mind system, as of Phase 2 and 3A:
  - needs, temperament, interests and tastes
  - learning by trying and by watching
  - trust that tracks whether what someone said turned out true
  - memories that fade, and feelings about places
  - invented words and accents
  - teaching, and knowledge lost when no one was taught
  - stories that drift into myth, with elders who correct and then give up
  - named places, customs and proposals
  - friendships, feuds and making up
  - peaceful, celebrated passings

  Because the arc is a month, not a year, **give fewer creekfolk richer minds**. Spend the budget on depth. Keep catch-up of 30 days well under 30 minutes on a mid-range laptop, and report the phone figure.
- **Every creekfolk thinks at full depth all the time.** Nothing gets richer because the player is looking or zoomed in.
- **Population:** 8 founders, up to about 30 to 36. Keep 3A's rule that capacity is the lower of shelter and what the land can feed, with the land's share rising as the creek heals. When the valley is full, curious young adults leave downstream with a send-off. Once gone, nothing about them is simulated; a few come back as visitors with news. A returnee who stays gets a fresh mind but keeps its name, family, looks and old ties.
- **The valley never fails.** There are no die-offs, no starvation and no disasters that kill. If adults drop below about 4, births quietly increase.

### Scale and look
- **Creekfolk are about the height of the Philosopher King** in What the Water Brings: person-sized, but cute, rounder, low in detail and plainly not human. Build them the way What the Water Brings built its chunky pixel king (PKToon2: simple solids, three-tone colour ramps, outlines), not the fully rigged realistic figure.
- **The creek and valley are at real scale,** about the size of What the Water Brings' valley (roughly 220 × 150 m), with a small creek a couple of metres wide when healthy. Use What the Water Brings' approach throughout:
  - one height function
  - channels as curves with real cross-sections (pools, a limestone ledge, a spring)
  - fords worn gentle where paths cross
  - near tiles at full detail, streamed within a time budget, with a light far version of the whole valley always present
- **Its pixel renderer (PKPixel3D) is the look.** Carry over its creatures (heron, turtles, minnows, frogs, dragonflies, teal, butterflies) and its air (mist, fireflies, falling leaves, swallows).
- **One difference:** What the Water Brings' creeks are fixed, and Creekfolk 2's creek changes. Rebuild the affected tiles from the river model after floods and as ponds and channels change.
- **Zoom from the air down to faces.** From the air, the whole valley shows with each creekfolk as a dot in its family's colour. You see paths, water spreading and the village clustering. Zooming in, dots become small sprites, then full creekfolk with faces, clothes and what they carry. Zoom changes only what's drawn. Include follow-one-creekfolk and a slowly drifting ambient camera.
- **Looks you can trace through families:**
  - coat colours and patterns
  - clothing patterns, using What the Water Brings' cloth textures (knit, rib, cable, tweed, herringbone, gingham), passed down and made by them
  - small things worn for their passions
  - the three ages readable at a glance (children with big heads, elders greyer with a stick)
  - believers wearing treasures they found
  - front doors in the owner's colour
- **Easy to see (suggested, from What the Water Brings):** a mode with everything big, bold and high contrast, and text read aloud. The author built this for someone with low vision; keep it if it fits.

### The creek
- **Start from 3A's river model and its rules:**
  - the drop rule, so a dam holds water only so far above the water below it, and "build from the bottom up" can be learned
  - floods sized and routed as in Creek Care
  - mud and gravel settling
  - the water table trading with the creek, wet and dry seasons as real logic
  - Stage 0 side channels across the floor
  - creek stages from II through IV and V to 0
- **The creek only ever improves.** Floods reshape it only by building. Dams never wash out; they're tended.
- **It starts cut down and seasonal:** in the dry season it stops flowing and the valley goes from green to straw to brown. Consider a second channel like What the Water Brings' Dry Fork (dry most days, a torrent in a storm) and a spring-fed branch that never dries.
- **The dams are real beaver dam analogs at real scale:** posts about a metre tall with willow woven between them, then mud. Creekfolk 2 should look and work like real Stage 0 restoration.
- **Time is compressed, and true in direction.** The same processes as 3A, paced so the arc below takes a month.

### The arc (real time; tune to this, then report what you got)

| Real time | The creek | Wet at the driest point | The village |
|---|---|---|---|
| Week 1 | Cut down; the founders build the first dams within days | Almost none; a first pool | 8 founders; first homes; first children |
| Week 2 | Ponds hold through the dry season; beds start refilling | About 10–30% | Homes, gardens at the floor's edge; children growing |
| Week 3 | The floor reconnects; side channels open in the wet season | About 40–70% | Founders become elders, teach and carve; grandchildren |
| Week 4 | Mostly wetland: channels, pools, marsh | About 70–90% | Founders pass one by one; the last at about day 30 |
| After | A healed creek still moving: floods build, side channels shift, beavers tend | Holds steady, with a seasonal pulse | Descendants live in the finished valley; customs, births, passings |

**Two signs the valley is healed** (suggestions; the author liked both):
- **Beavers arrive** in week 4, before the last founder passes, and take over much of the dam-tending afterwards.
- **A fish run returns** up the healed creek every wet season after that. It's a recurring event the player can come back for.

**The end of the told story:** when the last founder passes, show one gentle moment marking it. After that there's no ending, only the valley going on. Make sure the equilibrium has recurring things worth coming back to: the fish run, seasonal gatherings, and whatever customs the descendants form around the founders' carvings and resting places.

### Three records of time

The author and six AI models from three companies independently put a physical record of time at the centre of this kind of world. Build three records, and let the player compare them.

1. **What happened, written in the land.** It never lies.
   - **Layers of mud behind each dam,** one per flood, coloured by season (dark wet-season mud, pale dry-season dust), so a cut bank or a cross-section view shows a band for every flood of the month, with the founders' first dam buried at the bottom.
   - **Grove trees with rings,** paths worn by feet, repairs that show (a narrowed doorway, a patched wall), and the day-one valley kept for a **then-and-now** view the player can hold up.
2. **What they told:** carvings, stories, songs. It drifts.
   - Founders carve what they want remembered. The material decides how long it lasts: sand marks gone by the next flood, clay that lasts a season, stone that takes days to cut and lasts for good. So they must choose what's worth carving deep. Over the years some carvings wear, copies drift, and someone recuts or "corrects" one.
   - Stories drift into myth, as in Creekfolk 1.
3. **What they remember:** habits and limited memory. It fades.
   - Descendants know the founders only through what was carved and told. Their habits outlive their reasons; one might keep doing something the founders did long after anyone remembers why.
   - The player, who saw it all, holds history the creekfolk have lost. Show the gaps: what really happened, what they carved, what they now say.

**A chronicle:** the valley keeps a readable record of every day, so the player's absence has contents ("While you were away" as something you can read, not just a count).

### Care: two kinds, both freely given

- **Everyday kindness.** At any time the player can leave a little food near a burrow, a home or a path. They never need it, and their lives run fine without it, but they notice. Over time they learn the spot where good things appear, grow a little bolder near it, and may leave something back. This is the author's real habit with wild creatures: start feeding the rabbits or raccoons when you see signs of a home nearby.
- **Rare treasures, delivered by the creek.** Every few real days (choose the pacing, perhaps one every two or three days), the player can place a treasure in the water upstream. The next flood carries it down, and the river model decides where it settles. After the storm a creekfolk finds it on a gravel bar, a gift from the creek.
  - **What treasures could be:** stones rounded by water, a fossil shell from an old sea, sea glass, a seed of a new plant or tree, a feather, a carved token. What the Water Brings' collections (Things the Water Rounded, The Old Sea, Glass and Light, Seeds and Wood) are good inspiration.
  - **What becomes of them:** a stone built into a dam or wall, a seed grown into a grove tree, a shell worn by a believer, something buried in the mud layers. The player can find their treasures years later.
- **Nothing is ever paced or gated by the player's care.** No progress stalls without gifts, and nothing is withheld. All six AI answers the author gathered, from three companies, avoided obligation, and so does the author.
- **Belief:** the creekfolk believe the creek gives, and in this game that's literally how gifts arrive. Doubters say it's chance.
  - **The one who suspects (the author's own addition, from Creekfolk 1):** after many treasures, one creekfolk becomes convinced they come from someone beyond the valley. It still honours the creek, but when the player opens the game, it looks up toward the camera and waves. At most one or two at a time; it can pass the belief to one child or apprentice.

## Pacing rules

Tie progress to things labour can't hurry:
- mud settling, one flood at a time
- trees growing
- clay curing
- stone taking days to carve
- dry seasons and wet seasons
- a discovery needing the right creekfolk to notice something and then teach it

More hands mustn't finish the month in a week.

## Phases

Finish each phase and stop to show the author before starting the next.

1. **Foundation.**
   - Tell the author in plain language how 3A's minds and creek work, and what you're carrying over.
   - Build the new valley at real scale on What the Water Brings' renderer and terrain approach.
   - Port 3A's simulation (creek, water, seasons, minds, saves, catch-up, dev build) to it.
   - Zoom from dots to faces.
   - Offline-only, with the clock guards.
   - Benchmark catch-up and prove determinism.
2. **The founders' arc.** Founders arriving with their culture, life stages tuned to the month, the dams and the healing arc, homes and gardens, the three records of time (mud layers, carvings by material, then-and-now, the chronicle), and the last founder's passing.
3. **Care and the living balance.** Everyday kindness, treasures carried by floods, belief and the one who suspects, beavers, the fish run, customs around the founders, and the equilibrium running indefinitely with bounded memory and save size.
4. **Visuals.**
   - Write a one-page art bible: palettes for each hour and for wet and dry seasons, scale, silhouettes for the three ages, family looks.
   - Build a gallery page rendering the valley at several hours, in wet and dry seasons, in weeks 1 to 4, and in equilibrium, from the air and close up.
   - Screenshot it, open every image, critique it like a strict art lead (at least 5 specific problems per round), fix the worst, and repeat for at least two rounds before showing the author.
5. **Tests.** Run many seeded months headless and check targets. Each target is a sentence of intent plus the check. Run at least three real months so the equilibrium is proven flat. Examples:
   - No valley ever empties.
   - The last founder passes between day 28 and day 32.
   - Grandchildren are adults before the last founder passes.
   - The floor is mostly wet at the driest point by week 4.
   - After day 35, wet share, population and save size stay level.
   - Treasures always settle somewhere reachable and are found.
   - Catch-up of 30 days stays under the target.
   - Replay determinism holds.

## Rules

- Keep a `CLAUDE.md` describing the architecture, the time model, the save format and how to run the tests.
- Say what you tested directly and what you're inferring. Don't round up.
- At each stop, give the author the playable HTML (both files), what changed, what you'd do next, and anything you couldn't test.
- If something in this brief turns out to fight the simulation, say so, propose the smallest change, and ask.

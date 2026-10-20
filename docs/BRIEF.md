# Creekfolk: the year-long valley

You're taking Creekfolk, a small ambient simulation, and turning it into a valley that lives for a full real year. Read this whole brief before you start. The game's author wrote the first version with one instruction: put your heart and soul into it, and interpret that however you wish. That still applies. Within the rules below, invent freely: names, customs, small moments. Make decisions yourself and tell me what you decided.

## What Creekfolk is now

Start from the current creekfolk.html (it's attached or in this repo; if readable source files exist anywhere, work from those and tell me where they are). It's a 3D world rendered at low resolution and scaled up to look like pixel art. Small folk live beside a creek. They learn by watching each other, tell each other what they've noticed, and the code keeps count of how often what someone said turned out to be true. Ideas come from noticing ("Wet mud dries hard in the sun. I could build with it."). They build weirs and dams like beavers that live on land, because they love the water, and the creek slowly becomes wetland: ponds, marsh, reeds, frogs, dragonflies. The valley keeps its clock while you're away and catches up when you return. The player mostly watches. It's an ant farm, a fish tank, for little minds.

Before changing anything, read it and tell me in plain language how their minds work today: what they want, how they choose, what they remember, how knowledge spreads.

## Settled decisions

These are the author's choices. Don't change them without asking.

**Platform**
- Laptop only. One self-contained HTML file for playing, built from readable source kept in the repo.
- The simulation runs in a Web Worker, separate from drawing.

**Time**
- Every moment is simulated in full, watched or not. Someone could sit and watch all of it, so all of it has to be there. No coarse "history mode."
- One valley day = one real hour.
- Seasons follow the real calendar date, Northern Hemisphere, a temperate four-season valley.
- While the page is open (even in a background tab), the valley runs live. Use the real clock, not timer counts, so browser throttling can't lose time.
- When the page opens after a gap, it replays the gap in full detail, deterministically, with a "Catching up" card. Seeded randomness only: a replayed stretch must end in exactly the same state as if it had run live. Write a test that proves this with a state hash.
- There is no fast-forward for players.

**Lives**
- A life lasts about 30 real days (720 valley days), with a little natural variation (a day or two either way) so passings aren't clockwork.
- Three stages, each with its own sprite and behaviour:
  - Child, real days 0–7: small, follows adults, plays, learns by watching.
  - Adult, days 7–24: builds, explores, pairs, has children, proposes projects.
  - Wise elder, days 24–30: slower, teaches, tells stories, keeps the old knowledge.
- Passing is peaceful, expected, and celebrated by the village. It's never a tragedy. One message of the game is that life continues; there's a pattern bigger than any one life.

**Population**
- Five founders, all young adults (real ages about 8 to 14 days at the start), so the first passing comes around day 16, after the player knows them.
- Target growth about 60% per generation: on average an adult has a child roughly every 13 real days. My model with this rate fills the valley in month 3–4 in most runs.
- Capacity: about 36, but set it from the benchmark below. Capacity should come from the valley itself (homes, food, room), not just a hard number.
- When the valley is full, births continue and curious young adults choose to leave downstream. Give them a send-off. Those who leave stay out of the simulation but live on as stories, and occasionally one comes back to visit with news.
- The valley never fails: no die-offs, no starvation, no disasters that kill. If adults drop below about 4, births quietly increase. Weather and seasons give rhythm (winter is for stories and making things indoors; a flood reshapes the creek but hurts no one), but there are no hard times.

**The player's gift**
- Once every 12 real hours, the player can give the valley one gift, chosen from a few (for example rain, seeds, a warm day, a found object). Gifts speed up growth and development. They never decide survival.
- The folk notice gifts and form beliefs about where they come from. With about 12 generations a year, those beliefs drift: from "the rain came when we needed it" to stories about the one who sends rain, to customs of thanks, maybe disagreements. If the gifts stop, they wonder why.

**Developer menu**
- Hidden behind a key combination and invisible to players.
- Set the date, and jump +1 through +12 months from the save. Jumps replay every moment in full, showing progress, so they are also a real test of catch-up.
- An inspector to read any folk's mind, memories and beliefs.

**Saves**
- Use IndexedDB, not localStorage.
- Memory must stay bounded over a year: folk forget details and keep stories. That's also a feature, because it's how myth forms.
- Add export/import of the valley as a backup file. A year is a long time to trust browser storage.

## What should deepen

**Minds**
- Personal wants plus village projects. Someone with an idea proposes a project; others join depending on trust and agreement.
- Projects need materials, knowledge and the right season. The best ones outlive whoever started them.
- Knowledge must be taught to survive a death. Untaught skills are lost and must be rediscovered.
- Culture drifts. Stories retold get slightly wrong; children who learn secondhand believe the newer version; elders may correct them or give up.
- Folk name places after what happened there, and develop small customs (lanterns, first frost, passings).
- Every folk thinks at the same depth all the time. Nothing gets richer because the player is looking.

**Pacing**
More hands mustn't finish the year by month four. Tie progress to things labour can't hurry: trees take months, marsh takes weeks to fill, clay takes days to cure, some work only happens in some seasons, and discoveries need the right person to notice something and then teach it.

**The project ladder**
Spread these across the year. Add your own.
- Water (what exists now): weirs, ponds, marsh, then welcoming animals back, noticing and celebrating each returning species.
- Gardens fed by pond seepage, then an orchard. Trees planted by one generation are harvested by their grandchildren.
- The memorial grove. Each folk who passes gets a tree. Expect around 300 over a year, so design it to grow across a hillside, perhaps in family clusters.
- Clay: kiln, tiles, jars, lamps.
- Reeds: weaving, baskets, mats, eventually rafts.
- Reaching further: bridges, mapping the valley, finding the spring at the creek's source.
- A water wheel, grinding seeds into flour.
- A sky calendar. Over generations they set stones marking where the sun rises, until they discover the year. They should find the solstice on the real date.
- Carved stories that record events and slow the drift of myth. Later generations can argue over what they mean.

**Visuals**
Every visual should tell the player something about their lives.
- Light: a palette for each valley hour (gold dawn, flat noon, blue hour, lantern-lit night) crossed with the real season.
- The land remembers them: paths wear in where they walk, gardens spread, trees grow over months, the wetland fills and brings frogs, fireflies, herons, fish.
- Bodies show what they're doing: carrying, building, children playing, elders by the water, small emotes.
- Gatherings are visible: lanterns at a passing, meals, festivals.
- Ambient mode: the interface fades, and the camera drifts slowly or follows one folk.

## Phases

Finish each phase and stop to show me before starting the next.

**1. Foundation.** Time rules, life stages, population, saves, catch-up, the developer menu and a headless year runner (Node, no rendering) that runs a full year in full detail. Benchmark it, and set capacity and mind depth so that 30 days away catches up in under 30 minutes on a mid-range laptop. Report the numbers and the trade-off you chose. Prove replay determinism.

**2. Minds.** Teaching and lost knowledge, trust, drift and myth, naming, projects, leaving, passings, beliefs about the gift.

**3. The ladder and the ecology.** The projects above, paced to the year.

**4. Visuals.** Write a one-page art bible (palettes per hour and season, scale, silhouettes for all three life stages). Build a gallery page that renders the same valley at several hours, in all four seasons, early and late in its history. Screenshot it, open every image, critique it like a strict art lead (at least 5 specific problems per round), fix the worst, and repeat for at least two rounds before showing me.

**5. Year tests.** Run many seeded years headless and check targets. Each target should be a sentence of intent plus the check. Examples:
- No valley ever drops to zero.
- Most valleys fill between month 2 and month 6.
- Someone leaves downstream within a week of the valley filling.
- The first passing happens after day 12.
- Most valleys build a kiln by month 3.
- The sky calendar is usually finished before the second solstice.
- At least one lost skill is rediscovered in most years.
- Myths about the gift appear in valleys where the player gives regularly.

## Rules

- Keep a CLAUDE.md describing the architecture, the time model, the save format and how to run the year tests.
- Say what you tested directly and what you're inferring. Don't round up.
- At each stop, give me the playable HTML, what changed, what you'd do next, and anything you couldn't test.

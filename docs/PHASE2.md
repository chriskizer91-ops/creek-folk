# Phase 2 report: minds

## What exists now
- **Stories that drift.** Notable events become stories: how the valley began, first discoveries, the first of each thing built, notable passings, storms, travelers, those who left, news brought back by visitors, gifts, the frogs returning, skills forgotten. Witnesses know the truth; everyone else hears it in chats. Elders tell the most, children listen the most. Each retelling can change one detail: numbers grow, deeds move to famous names or to the teller's own ancestors, places get named, causes get added (the creek, the elders, the giver), the telling grows grander.
- **Elders correct, then give up.** Someone who was there may correct a teller; the young often aren't convinced. After six tries the elder lets it go ("Let them tell it their way").
- **Myths.** When most of the living tell a version that differs from what happened, the village's Stories tab shows both; the important ones are logged (at most one every three days). Forgotten stories are noted.
- **Named places.** The Waking Meadow, the first pool ("Pebble's Pool"), the Stepping Stones, the Meeting Stone, the Leaving Bank, and resting places of notable creekfolk. Each gets a word in their own speech that spreads like any other word.
- **Customs.** An offering at passings (a song, a pebble, a flower...) becomes the custom once one kind dominates. They gather when the season turns, in daylight; by the second time it's a custom. Thanks for gifts can become a custom.
- **Lost skills.** If the last creekfolk who knew a skill dies, it's logged and the skill must be rediscovered (also logged). Children learn skills from elders, who teach twice as readily.
- **Proposals.** When someone marks out a shared project, the others react: some like the idea, some aren't sure.
- **Visitors.** Creekfolk who went downstream come back now and then for two valley days, with news ("the creek joins a river so wide you can't see the other side"), which becomes a story.
- **The gift.** A gift button in the top bar, once every 12 hours: a gentle rain, a scatter of seeds, a warm day, or something to find. Gifts help growth, never survival.
- **Beliefs about the gift.** Each creekfolk explains gifts its own way. Gifts that come when needed, and many of them, make "someone watching" more likely, more so for the curious and the young. Believers coin a word for the giver, which spreads until the village agrees on it; thank it with a gesture that can become a custom; notice when gifts come twice a day; argue with doubters; and, if the gifts stop for three days, wonder what they did wrong, and slowly lose faith.
- **In the game:** the gift sheet; Stories, Places and village Customs in the village sheet; a Stories tab on each creekfolk (their versions, where they heard them, what they believe about the gifts, any treasure they keep). The developer menu shows lore and beliefs.

## Measured
- Determinism holds with gifts, stories and myths (same state hash for one replay, uneven slices, and save/reload).
- Two full years with twice-daily gifts: never empty, no errors, 30+ creekfolk by day 63 and 112, 31-35 went downstream, 17-29 visits, 27-34 believers at year's end, each village settled on its own word for the giver ("chupla", "pli"), customs of thanks and season gatherings formed (and passing offerings in one).
- Without gifts: no believers, as expected; myths and customs still form. With gifts the valleys are busier: more births (141-150 vs 107-124 in 150 days) and many more leave downstream (20-29 vs 5-8).
- Gifts stopped at day 40: "The gifts have stopped coming. Some of the creekfolk wonder what they did wrong." A week later a new myth formed that a tiny bell had been "sent by the one who sends gifts".
- Catch-up of a full valley (36 creekfolk) for 30 days in the browser: 4.1 minutes (target under 30).

## Honest notes
- No skill was lost in any test year: teaching works too well for knowledge to die out. Lost-and-rediscovered will be rare unless Phase 3 makes skills harder to keep.
- Passing stories are the most common myths (ages grow in the telling); the log limits how often myths appear, but the Stories tab shows them all.
- The same few visitors can return several times a year.
- Season gatherings only happen four times a year by nature; the first test year showed the custom forming by the second gathering.

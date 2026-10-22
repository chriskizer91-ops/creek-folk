# Phase 3: care and the living balance

The playable files are `releases/creekfolk2-phase3.html` (the game) and
`releases/creekfolk2-phase3-dev.html` (with the Dev button). Build `cf2-3`: its saves live under
`creekfolk2-3`, so a Phase 2 valley is refused in plain words and Phase 3 starts a new one.

## What the brief asked for, and what there is

**Everyday kindness.** The heart button opens the Care sheet. Choose a handful of berries, some
nuts or a piece of fruit, then tap a spot near a home or a path. They never need it, and their
lives run fine without it, but they notice: whoever passes sees it, wonders who left it, and
eats it if they like it ("Someone left berries by the path. Who would do that?"). Those who find
food at a spot three times start stopping by on their way; now and then one leaves something
back (a pebble, a flower, a carved bead, whatever they love); a spot several of them know gets a
name ("the Little Table"). Food left too long spoils. Up to three piles at once.

**Rare treasures, delivered by the creek.** From the same sheet, every two real days: thirteen
kinds in four groups (things the water rounded, the old sea, glass and light, seeds and wood).
It goes into the water at the head of the valley and waits there for the rains; the next flood
carries it down like a geomorphologist's painted tracer stone, as far as that flood can carry
something that heavy, and the river model decides where it settles: on a gravel bar where the
water slackened, in a pond above a dam (a big flood lifts small and light things over), or, for
light things, in the grass where the flood spread. Whoever passes may notice it. What becomes of
it depends on what it is:
- a creek stone or an agate is set into the crest of a dam, where everyone can see it;
- a shell, a glass pebble, a feather, a stone tooth is worn on a cord (drawn close up), and passed
  to a child when the wearer passes on, or laid at their tree in the grove;
- a crystal or a spiral shell goes on a windowsill;
- a pecan, an acorn or a sycamore ball is planted (in the grove if there is one) and grows into a
  young tree in about eight days;
- one left in a pond or on a bar until the next flood's mud covers it is buried in the creek's
  bank for good: the bank's cross-section shows it glinting in the band of that flood.
The sheet lists every treasure you gave and where it is now, with "Show me" (or "Find them",
for one being worn).

**Belief and the one who suspects.** Each find is news to everyone; belief that the creek gives
wakes from it (Creekfolk 1's belief: those who saw it are moved most; the least open stay doubters
who say it's luck; children inherit most of their parents' belief). Believers thank the creek
with the old gesture and leave offerings at the Giving Place, named where the first treasure was
found. After a storm, some walk the banks to see what the creek brought; that becomes a custom.
After about ten treasures (Decision 6) one of them becomes sure the gifts come from someone beyond
the valley; when you open the page they turn to the camera and wave, and the belief passes to a
child or a young friend.

**Beavers in week 4.** A young pair comes up the creek in the spring of the fourth valley year
(days 24.7 to 28 in the test valleys), in the night, and is found at first light. They build a
lodge in one of the deepest ponds, have kits the next spring (up to six), mend the dams and build
up the silted ones, and dam a dozen of the floor's side channels. Once they live there the
creekfolk leave the dams to them (mending only a badly worn one, and building up only where a
stone apron is needed first).

**The fish run** (Creekfolk 1's 3C) comes up the healed creek every midwinter, from about day 23
to 39 on (it was already in Phase 2).

**Customs around the founders.** Each valley year, on the day the last founder passed, the oldest
lead whoever is about to the founders' standing stones (or their trees in the grove) to tell the
young who the eight were, and leave the valley's offering at each founder's tree (small stones
gather at their roots). The first year it is one elder's idea, the second "becoming a custom", from
the third a custom with its own word; once no one alive knew the last founder, it goes on
"though few remember anymore whose day it was".

**The living balance.** Every six hours the valley lets go of what nothing needs any more:
records of creekfolk long gone that nobody remembers, refers to or descends from closely (each
keeps its family line first), ties to those long gone, the departed who have lived out their span
downstream, myths of forgotten stories, names of places nobody uses. The save stops growing.

## What was measured

All on this machine (a shared cloud container), nothing on a phone or a real graphics card.
"Care" below means the month runner played the player's part (`CARE=1`): a treasure every two
real days and a little food now and then, as a player might.

| What | Result |
|---|---|
| Determinism (`tools/determinism.cjs`), now also from a saved valley with food and treasures placed | identical state hashes, live, in uneven slices and after save and reload |
| Four valleys to day 32 with care (`tools/month.cjs`, `runs/p3c`) | 32 days in 323 to 360 s each (7,700 to 8,600 times real time), no errors; saves 1.9 to 2.2 MB |
| Wet at the driest point of each valley year (days 6, 14, 22, 30) | 1–2%, 3–12%, 33–74%, 83–95% (the brief: almost none, 10–30, 40–70, 70–90) |
| The beavers | came on days 24.7, 24.7, 24.9 and 28.0 (the last by the "whatever the creek" date); kits the next spring in all four; each pair dammed 12 side channels and built up 8 to 18 dams |
| The founders | the last passed on days 29.3 to 29.6; 26 to 36 creekfolk on day 32 |
| Treasures | 16 placed in each valley: 13 to 16 found, 0 to 3 buried in the bank, none still waiting or lying unfound on day 32 |
| Belief | from the first find (day 2 or so) it wakes; on day 32, 27 to 33 believers in each valley; the one who suspects in all four (by day 24 in three, day 27 in the fourth) |
| Kindness | about 200 portions eaten in each valley over the month; spots learned, visited, things left back |
| The day they remember the eight (one valley run to day 48) | the first on day 37.5, the second on day 45.5 ("it is becoming a custom"); the one who suspects passed the belief to a young friend on day 40 |
| Catch-up of 30 days in the browser's worker, from a day-30 valley of 33 creekfolk (`tools/bench-browser.mjs`) | 8.7 minutes (5,000 times real time) |
| Months (`tools/longrun.cjs`, two valleys to day 92, before the beavers were retuned and without care) | the balance check passes: saves level at 2.0 to 2.3 MB from day 36 on, memory 25 to 27 MB, the last third of the run against the middle third within a few percent on every measure, no slowdown with age |
| The rules in a browser (`tools/browser-test.mjs`) | 20 of 20 pass (on the release files) |
| The 3D view live on a day-30 valley (`tools/tour.mjs`) | 16 of 16 pass, no page errors |
| Care on the page (`tools/care-shots.mjs`): the Care sheet, leaving food with a tap, placing a treasure, each treasure where it lies, a worn treasure, the wave | looked at one by one, no page errors |

Pictures in `docs/img/phase3/`: `care.jpg` (the Care sheet, and the list of your treasures with
where each is now), `little-table.jpg` (berries just left by a home, the small pile in the
middle, with the Telling Stones beside it), `beavers.jpg` (the lodge in its pond, and the healed
floor from above on day 30), `stones.jpg` (the Telling Stones on day 30: standing stones carved
by the founders and their children, and clay tablets).

## What isn't right yet

- **Weeks 2 and 3 vary with the weather.** Week 2 was below the brief's 10–30% in two of four
  valleys (3% and 6%), week 3 was 33% in one and 74% in another. A valley with few storms in its
  second year is simply slower; it catches up in week 4.
- **The healed floor hardly dries.** Week 4 was above the brief's 70–90% in two valleys (92%
  and 95%), and after it a healed floor stays about 90 to 96% wet at the driest point, so the
  "seasonal pulse" is small. This is Decision 24: tell me if you want a stronger one.
- **The bank rarely shows a treasure.** Most treasures are found within a storm or two; in two
  valleys none were buried at all, in the other two three each.
- **A stone set in a dam can drown.** Once the beavers raise a pond, a creek stone set into a
  lower dam's crest is under water and hard to see; the sheet still says where it is.
- **The wave can go unseen.** The camera doesn't turn to the one who suspects; a line says they
  waved, and you see it only if they are in view. Asleep, they don't wave at all that time;
  indoors, the line shows but they can't be seen.
- **The founders' day was seen in one valley only**, run to day 48 (the 32-day runs end before
  the first one, near day 37).
- **A worn treasure is small**: a dot on a cord, hard to make out even close up. And when the
  camera follows someone close up, they can sit near the edge of the picture rather than in the
  middle. Both are for Phase 4.
- **When the Telling Stones are full**, the most worn stone is the one that goes; nothing is
  carved over it.

## What I couldn't test

- Speed and touch on a real phone or graphics card.
- A valley left running for weeks in a real browser tab.
- Three real months (the longest runs were 92 days on two valleys, without the player's care).

## Decisions made in this phase

Recorded in `docs/DECISIONS.md` (19 to 24) for you to confirm.

## What I'd do next

Phase 4 (visuals: an art bible, a gallery page in all hours, seasons and weeks, and two rounds of
strict critique and fixes), then Phase 5 (tests: many seeded months against the targets, and
three real months to prove the balance flat). Also still to come: sound, the chalk lines for
what is only remembered, what the ledge and the Dry Fork teach, snow that settles.

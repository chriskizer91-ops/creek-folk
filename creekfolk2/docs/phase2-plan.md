# Phase 2 plan: the founders' arc

From the brief: founders arriving with their culture, life stages tuned to the month, the dams
and the healing arc, homes and gardens, the three records of time (mud layers, carvings by
material, then-and-now, the chronicle), and the last founder's passing. `DECISIONS.md` wins over
this plan.

## Where Phase 1 left it

At day 30, two test valleys were 8% and 30% wet at their driest (the brief: 70 to 90%), and the
founders passed on days 26 to 29 (the brief: the last at day 28 to 32). Everything else in the
arc follows from those two being right.

## The arc (what to tune to, and how it is checked)

The valley year is 8 real days; the dry season is its middle half (summer and autumn), so the
driest point of each year comes at the first winter rains: around days 6, 14, 22 and 30.

| By | The creek | Wet at the driest | The village |
|---|---|---|---|
| day 7 | first dams within days; a first pool | almost none (under 5%) | 8 founders, first homes, first children |
| day 14 | ponds hold through the dry season; beds refilling | 10 to 30% | homes, gardens at the floor's edge, children growing |
| day 22 | the floor reconnects; side channels open in the wet season | 40 to 70% | founders become elders, teach and carve; grandchildren |
| day 30 | mostly wetland: channels, pools, marsh | 70 to 90% | founders pass one by one; the last between days 28 and 32 |
| after | still moving: floods build, side channels shift | steady, with a seasonal pulse | descendants live on |

Lives: children born in week 1, grandchildren grown (7 days old) before the last founder
passes, great-grandchildren possible; 8 creekfolk rising to 30 to 36 as the land allows; never
fewer than about 4 grown-ups.

How it moves faster than Creekfolk 1 and stays true (Decisions 1 and 2): the creek starts less
deeply cut and each flood brings more mud; floor deposits taper off as the floor nears a
settled level; side channels fill in while new ones open. Pacing stays tied to what labour can't
hurry: mud settling one flood at a time, dry and wet seasons, curing, growing, discoveries.

## The founders' culture

They come from Creekfolk 1's valley, so they arrive already holding:
- **the craft:** dams, mud, building from the bottom of the creek up, tending ponds, planting,
  tools. (This creek still has lessons for them: its clay, the mushrooms that glow, and what the
  ledge and the Dry Fork teach.)
- **words:** a shared stock of words from the old valley (the creek that gives, water, dam, home,
  ...), each founder with their own accent; new words arise here, and old ones drift.
- **customs:** thanking the creek, offerings at a passing, gathering at the season's turn,
  already established (not discovered) on day one.
- **stories of the old valley,** already drifted: told by the founders, heard by their children,
  so that their grandchildren hear of a valley no one living has seen.

## The three records of time

1. **What happened, written in the land** (it never lies):
   - **mud layers** behind each dam, one band per flood, dark wet-season mud or pale dry-season
     silt, thinning as the floor settles, with the first dam at the bottom; shown as a
     cross-section of the creek bank (a panel the player opens at a dam or a point of the creek);
   - **grove rings** (a memorial tree's age, from 3C's grove), **paths worn by feet** (already
     drawn), **repairs that show** (a patched wall, a narrowed doorway);
   - **then and now:** hold a button and the valley is as it was on day one, from the same camera.
2. **What they told** (it drifts):
   - **carvings:** a founder carves what they want remembered. Sand by the creek is gone by the
     next flood, clay lasts about a season, stone takes days to cut and lasts for good, so they
     choose what is worth carving deep. Carvings wear; copies drift; someone recuts or
     "corrects" one;
   - **stories** drifting into myth (Creekfolk 1's).
3. **What they remember** (it fades): habits that outlive their reasons; what the player saw and
   they have lost. A record panel lays the three side by side for each thing that mattered: what
   really happened, what was carved, what they now say.

**The chronicle:** a readable record of every day, so "while you were away" can be read.

## The last founder's passing

One gentle moment when the last of the eight passes, then no ending: the valley goes on.

## Work

- The arc (creek healing, life stages, the founders' craft): a helper, in `cf2-creek.js`,
  `cf2-life.js` and `cf2-craft.js`, measured with `tools/month.cjs` against the table above.
- Culture, the three records, the chronicle, the last founder's passing, and their views: here, in
  `cf2-culture.js`, `cf2-records.js`, `cf2-carve.js` and the view.

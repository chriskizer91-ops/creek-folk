# Phase 3B plan: belief and the temple

Source: `docs/PHASE3-CHANGES.md` sections 5 and 6 (and the parts of 9 that touch them).
Branch: `phase-3b`. Build version: `3b`.

## What 3B covers
1. The creek is the giver: "the creek gives" becomes the main belief; doubters say luck;
   the spring becomes the holiest place, first heard of from a traveler, then found on a
   journey.
2. The feedback loop: requests, keeping watch when a gift is due, offerings left for the
   player, giving days remembered, gentle wording when the player is away.
3. The rhythm wording: gifts come every twelve valley days, never "twice a day"; they
   notice the valley hour and the interval ("the creek gives at dawn, every twenty-four
   days").
4. New gifts: living things, weather, materials, wonder.
5. The temple: start rule, pace set by giving, three stages of about a dozen parts, real
   labour and materials with their own clocks; a great project for valleys with no giver.
6. The one who believes in you.

Left for 3C: the Returning, beavers, the sky calendar, then-and-now, goats breeding and
richer animal life, the soundscape, endless-running limits beyond what 3B adds.

## Decisions

### Belief
- `creature.beliefs.giver` (0..1) now means "the creek gives". Same field, so the code
  and saves that use it carry over; all wording changes. Above 0.5 is a believer.
- Belief has to become the main belief by week 2-3 with steady giving (in the 3A runs only
  1 of 22 believed at day 30 with gifts twice a day). Faster: every gift is seen by
  everyone awake (they all live by the creek), answered requests count double, children
  take their parents' belief, and belief passes in chats more strongly.
- `giverName()`: their own word for the creek-that-gives once it spreads, otherwise "the
  creek".
- Story causes: "because the creek gave it" replaces "sent by the one who sends gifts".

### The giving place
- When the first creekfolk comes to believe, they go to the creek bank nearest the
  village to thank it. That spot becomes **the Giving Place** (a named place), reserved
  for the temple (other buildings keep clear of it). Watches, offerings and the shrine are
  there. The first gift's place is named too, if it had one (a found thing, seeds).

### Requests
- Every few valley hours a believer may say out loud what the valley needs most, from
  `giftNeed` (extended to every gift). A request lasts about a real hour unless answered.
  The gift sheet shows the current request and who asked. Giving what was asked is an
  answered request: belief grows about twice as much, and it is logged and remembered.

### Keeping watch (they expect you)
- When a gift is due (12 real hours since the last), believers take turns keeping watch at
  the Giving Place in daylight, two or three at a time, and leave small offerings. Once
  they know the rhythm they gather at the expected valley hour. When the gift comes while
  they watch, they celebrate.
- Offerings for the player (`w.offerings`): carved beads, flowers, pebbles, woven rings,
  feathers, clay figures, chosen by what each one loves. Counts are kept forever; at most
  40 are drawn at the shrine.
- Notches: each gift is marked with a notch on the Giving Stone (the giving days on their
  calendar). The count is kept; the stone shows up to 60.
- Away: after 3 real days with no gift the creekfolk say "the creek is resting" and leave a
  lantern lit at the Giving Place. Belief fades very slowly. No guilt.

### Rhythm
- Gaps are measured in valley days (one real hour each). After four gifts with similar
  gaps, a believer notices the interval; if the valley hours also match (within two), they
  notice the hour too: "the creek gives at dawn, every twenty-four days".

### New gifts (17 in all, in four groups)
| Group | Gift | What it does |
|---|---|---|
| Weather | rain, warm day (kept) | as before |
| | snow day | snow for a valley day; play; meltwater wets the topsoil |
| | starry night | the next night is clear and starry; they lie out and watch |
| | rainbow | a short rain, then a rainbow; a sign (belief grows more) |
| Living | seeds (kept) | food seeds |
| | flower seeds | a new kind of flower spreads in patches near the village |
| | fruit tree | three saplings of a new fruit near the village, fruit in a few weeks |
| | goats | a pair of goats; they graze and are tended (never for meat) |
| | bees | a hive by the gardens; gardens grow faster |
| | fish | a new kind of fish in the ponds |
| | a new bird | a new kind of bird in the valley |
| Materials | fallen great tree | a huge log: branches and timber |
| | bank of clay | a big clay bank near the village |
| | pile of stones | a big pile of stones near the Giving Place |
| Wonder | found treasure (kept) | as before |
| | a dream | one creekfolk dreams an idea: a lost skill, the next part of the temple, or the way to the spring |

Each living gift adds a new kind (six flowers, five fruits, six birds, four fish), so every
valley ends up different. Gifts still never decide survival.

### The spring
- Once at least a third of the village believe, the next traveler or visitor brings news
  of the spring where the creek begins, upstream beyond the valley. An explorer then walks
  up to the head of the valley and goes on, out of sight, for half a valley day, and comes
  back: the Spring is named and becomes the holiest place. Believers make the journey now
  and then and bring spring water back to the Giving Place.

### The temple
- Start: at least 7 gifts in the last 14 real days, most of the living believe, and the
  valley is at least 7 days old.
- Pace from the gift rate `r` (gifts per real day over the last 14 days):
  1/4 -> 0.5, 1/2 -> 1.0, 1 -> 1.2, 2 -> 1.4, straight lines between on a log scale; 0.4
  below 1/4. Six real days without a gift: pace 0 (stops; nothing lost).
- "The creek has answered": a feeling that builds at that pace while the next part is
  waiting. When it reaches one part's worth (`TEMPLE.feelPerPart` real days at full
  speed), the next part is unlocked and logged; then it is built with ordinary labour and
  materials in the existing building system.
- Three levels of the structure kind `temple`, 12 parts each:
  1. Shrine: stacked stone at the Giving Place, where offerings are left.
  2. Hall: timber frame, clay walls that cure, carved stories (each carving records the
     village's version of a story at the time), clay-tile roof.
  3. Crown: a stepped pyramid of stone moved only in the dry season, a clay-lined channel
     that carries creek water down the steps, a sun gate turned toward their midwinter
     sunrise.
- Materials keep their own clocks: timber comes from a grove of trees they plant when the
  temple starts (ready in about 40 real days) or a fallen great tree; clay walls cure;
  crown stones move only in summer and autumn. Labour and materials are sized so they
  never hold up a twice-a-day giver for long; checked in the year runs.
- Tuning target: every other day finishes stage 3 in mid month 11. Daily and twice a day
  follow from the pace table (expected about month 9-10 and 8-8.5).
- No giver: if the temple hasn't started by day 30, the village begins the Hall of the
  Ancestors by the memorial grove, the same machinery at pace 1.0 on time alone, finishing
  around month 11. If gifts start later, the temple can still start.

### The one who believes in you
- After 100 gifts, with at least 7 in the last 14 days, one creekfolk (curious, believing)
  becomes sure the gifts come from someone beyond the valley. At most two at a time. It
  still honours the creek. A few lines of speech; others find it odd but are fond of it.
  When the player opens the game it looks up and waves (view only). When it passes, the
  belief goes to one of its children or a young friend it taught.

## Interfaces
- `src/sim/gift.js`: gifts, beliefs, requests, watch, offerings, rhythm, the spring, the
  one who believes. `GIFT_KINDS` (id, group, label, need, give).
- `src/sim/temple.js` (new): `TEMPLE` tunables, `templeTick`, `templePace`, the parts,
  the great project.
- `src/sim/fauna.js` (new): goats, bees, fish, birds, flowers (state and movement only).
- Core hooks marked `// BELIEF:`.
- View: `src/view/gift-view.js` (gift sheet, Temple tab), `src/view/fauna-view.js`
  (animals, flowers, snow, stars, rainbow, offerings), `buildTempleView` in a new file.
- Year runner: `GIFTS=every:<hours>` with a little jitter; temple progress printed.

## Tests
- Determinism (20 days) with each gift given.
- A pace check in Node: the temple's feeling and unlock schedule for each giving rhythm.
- Year runs, 330 days: every other day, daily, twice a day, every four days, none.
- Browser: the gift sheet, every gift, the Temple tab, the dev menu.

## What changed while building it
- **Doubters are relative to their own valley.** A fixed openness threshold made one
  valley all believers and another almost none (temperaments differ between valleys).
  Now the least open grown-ups of each valley (about one in seven, `doubtLine`) stay
  doubters, and they talk themselves back down if they ever believed.
- **Locked parts take no work.** Work already under way when a part finished landed on
  the next, still-locked part and finished it at once (parts came in pairs). Labour, heavy
  lifts and the labour action now ignore a locked part.
- **The pace is sequential.** The feeling that the creek has answered builds only while
  the next part waits; building a part doesn't count toward the next. That is how the
  author's description reads, and it lets the material clocks (curing, the dry season)
  add a little fixed time to every pace, which brings daily and twice-a-day givers closer
  to the author's expected months.
- **One standing request at a time**, until the next gift (or a day), rather than a new
  one every hour.
- **Offerings are occasional** (about one watch in three), so a player who comes every
  other day finds a few new ones, not dozens.
- **The temple's ground is kept clear** (`TEMPLE_ROOM` 9.5 m around the Giving Place): its
  crown reaches about 9 m toward the sunrise, and gifts placed near the village (a hive)
  had ended up inside the hall.
- **Sky gifts are drawn where a top-down player can see them**: stars reflected in every
  pond and pool, a rainbow sized to the view just beyond what you're looking at.

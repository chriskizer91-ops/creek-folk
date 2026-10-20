# Phase 1 report: the foundation

## What exists now
- Readable source recovered from the original single-file Creekfolk (it was minified, with no source anywhere). Top-level names restored with a scope-aware renamer; local variables are still short.
- Time: one valley day = one real hour; dates and seasons follow the real calendar.
- Lives: five founders (young adults); child → grown → wise elder; about 30 days each. Pairing, births with inherited temperament, looks and accent; children learn everything by watching and from elders (elders teach twice as readily).
- Passing: the creekfolk walks to a place it loved, family and friends sit with it, it passes on, and a tree is planted in the memorial grove. Its home goes to its partner or a child.
- Leaving downstream: when the valley is nearly full a restless young adult (sometimes with its partner) chooses to go; friends walk them to the edge.
- Travelers: if there are too few grown-ups, or nobody unrelated to pair with, a traveler comes up the creek and stays. This is how the valley never empties.
- Saves in IndexedDB (main + 10-minute backup); old localStorage saves move over; export/import kept.
- Catch-up: gaps over 30 minutes replay in a Web Worker, every moment in full; shorter gaps replay on the page. A hidden tab keeps the valley running on a timer.
- Hidden developer menu (Ctrl+Shift+D or #dev): jumps of an hour, day, week, 1–12 months or to a date (replayed in full), population, and a mind reader.
- Tools: headless year runner with targets, determinism test, browser test, browser catch-up benchmark.

## Measured
- Determinism: one replay, ~hundreds of uneven slices, and four save/reloads end with the same state hash over 20 days (including births and passings).
- Speed (this cloud machine, 2.8 GHz Xeon): about 12,000–14,000× real time with 25–35 creekfolk; about 50,000× with 5.
- Browser catch-up of a full valley (28 creekfolk), 30 days, in the worker: 3.4 minutes. Target was under 30 minutes, so there is roughly 8× headroom for deeper minds in Phase 2.
- Two whole years headless, all targets pass: never empty, no errors, first passing on day 15–16, 30+ creekfolk by day 35 and day 70, 32–34 went downstream, about 330–380 born and 300–330 passed on per year, save 1.1–1.6 MB after a year.

## The trade-off chosen
Capacity stays at 36 (from homes, stores and gardens), and every creekfolk thinks at the original full depth, watched or not. The benchmark leaves room to make minds deeper rather than the valley bigger.

## Honest notes
- Generation time is about two weeks, not a month, so a year holds 25–30 generations, not 12.
- Late in the year the population drifted down (19 and 28 at day 365, from 30+). Capacity and pacing are Phase 3 work; worth watching.
- The original building ladder still finishes in the first days; pacing to a year is Phase 3.
- Children can still be asked to help with heavy building (charming, but light). Passing is shown by sitting; the creekfolk then simply disappears; a gentler visual is Phase 4.
- Not yet built (later phases): the 12-hour gift, beliefs and myths, naming places, the sky calendar, seasonal ecology, the art pass.

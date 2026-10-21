# Creekfolk 2: decisions since the brief

Read this after `BRIEF.md`. It records what the author and Claude decided while talking
the brief through, before anything was built. **Where it disagrees with the brief, this
file wins.** Add to it whenever something new is decided.

_Started 2026-10-21. Nothing is built yet; the author is bringing more material before
building starts._

## Where things stand when this was written

- **Creekfolk 1 is at 3B, not 3A.** The brief expects 3A, with 3B and 3C still being built.
  3B (belief and the temple) is finished and merged here (commit `8e9ec93`), so Creekfolk 2
  starts from 3B. Most of what the brief wants from 3B already exists as code: the creek
  as the giver and the doubters, the Giving Place, offerings, the one who believes in you
  and its wave, and the living gifts (`fauna.js`). The temple, the 12-hour gift and
  requests stay in Creekfolk 1, as the brief says. Only 3C is left to merge later.
- **Both games live in one repository.** Creekfolk 2's copy of the simulation is taken from
  Creekfolk 1 at a known commit, so when 3C lands it can be merged as an ordinary
  three-way merge (that commit as the base) rather than by hand. The `// CF2:` marks and
  `docs/MERGE.md` from the brief still apply.
- **The sources are kept whole and public** in `../ref/` (the author's wish: open source,
  and saved somewhere other than a phone). Every file the author gives goes into the
  repository.

## The creek

1. **The healing runs about five times faster than in Creekfolk 1.** Creekfolk 1 reaches
   about 10% of the floor wet at the driest point by day 30 and 54-84% by day 150;
   Creekfolk 2 needs 70-90% by about day 28. A month holds about 30 floods, all in the wet
   halves of each 8-day year. The processes stay the same and true in direction; the
   creek starts less deeply cut and each flood brings more mud.
2. **The floor settles instead of rising forever.** In Creekfolk 1 every flood over the
   bank leaves mud on the floor (up to 2 cm) and nothing ever stops it; at about 350
   floods a year the floor would rise without end. In Creekfolk 2:
   - floor deposits taper off as the floor nears a settled level;
   - side channels on the floor fill in while new ones open elsewhere, the way real beaver
     meadows stay alive. This removes nothing the creekfolk built, so it keeps "the creek
     only improves".
   - Mud layers keep forming, thinner as the floor settles.
3. **No bends migrating or oxbows.** Creek Care's bends move by eating into their banks,
   which breaks "floods only build" and could undercut homes (3A left them out for the
   same reason). The wandering comes from the side channels instead.
4. **Treasures wait for the rains.** Storms come only in the wet season, half of each
   valley year, so a treasure placed early in the dry season waits up to about four real
   days for a flood to carry it: "the creek keeps it until the rains". Treasures travel
   like the painted tracer stones geomorphologists follow down real creeks: the river model
   moves them during a flood and decides where they settle.
5. **The old valley is upstream.** The founders came down the creek, so the first valley
   lies upstream of this one. The treasures the player places come from the direction of
   their old home, and the fish run swims up toward it.

## Minds and lives

6. **The one who suspects can come in the first month.** Creekfolk 1 needs 100 gifts and
   five months; at one treasure every two or three days a month holds only 10 to 15. In
   Creekfolk 2 the bar is about ten treasures, so it most likely comes to a grandchild
   near the end of the founders' month: the founders believe in the creek, and a
   grandchild suspects someone beyond it.
7. **Population stays at the brief's 30 to 36.** That range is a settled decision in the
   brief, and how many creekfolk the land holds is how the valley shows its health.
   "Fewer creekfolk, richer minds" is read as spending the time budget on depth per mind.
   Catch-up gets measured early in Phase 1 (Creekfolk 1 took 5.5 minutes for 30 days with
   30 creekfolk; the new valley has 2.8 times the ground, and minds get richer). If it
   doesn't fit the target, Claude comes back to the author with the numbers before
   changing the range.

## The program

8. **The simulation lives in the Web Worker all the time**, as the brief says. Creekfolk 1
   runs it on the page and uses the worker only for catch-up; with a much heavier renderer,
   especially on phones, Creekfolk 2 moves it, and the page draws from what the worker
   sends.
9. **Three layers of drawing for the zoom.** What the Water Brings is a close-up renderer:
   its camera never shows more than about 12 m, and full-detail ground exists only within
   about 34 m (0.5 to 1.3 million triangles). So:
   - from the air: the whole valley as a light mesh, creekfolk as dots in their family's
     colour;
   - in between: small sprites, built the way What the Map Forgot builds its characters
     (letter grids that inherit from a parent by swapping colours and rows), which suits
     inherited looks;
   - close up: full What the Water Brings detail, creekfolk built like the Sheet king
     (simple solids on the shared rig, starting from its stubbier "Little king" variant).
10. **Cloth patterns are redrawn for the pixel look.** `cloth.js` paints fine, photo-like
    knit and tweed for the lifelike king; the pixel pass snaps them to the palette, and a
    creekfolk is a few dozen pixels tall, so they wouldn't read. Creekfolk 2 keeps the
    families of cloth (stripes, gingham checks, cable as chevrons, herringbone as zigzags,
    knit, rib, tweed) as bold pixel patterns, passed down in families.
11. **Wobbling chalk lines for what is only remembered.** What the Map Forgot draws its
    enemies as pencil lines that redraw several times a second. Creekfolk 2 uses that
    for things that exist only in memory: myths, the old valley in stories, those who
    have passed.
12. **Known traps in the three.js r128 to r186 port** (found by reading both versions, not
    yet tried):
    - the palette-ramp shading silently stops working (the shader line `toon.js` replaces
      is now `#include <opaque_fragment>`);
    - the alpha tags the pixel pass reads get forced to 1;
    - colours come out too dark (converted to linear twice);
    - lights come out about a third as bright (physical light units: multiply by pi);
    - the 371-colour palette is a shader uniform larger than some phones allow; it moves
      into a texture.

## Still open

- **What caught the author's eye in What the Map Forgot.** Asked; until the author says,
  Creekfolk 2 takes the two ideas above (the letter-grid sprites and the wobbling lines).
- **More material is coming** from the author before building starts.

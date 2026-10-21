# What the Water Brings' renderer on three.js r186

Creekfolk 2 draws with What the Water Brings' (WTWB) renderer: the palette-ramp toon
materials, the pixel pass, the valley builder, the creatures and the shared rig with its
clips. WTWB was written for three.js r128; Creekfolk 2 uses r186
(`vendor/three-r186.js`). This is the port: what changed and why, how it was checked,
and how to use the modules in a new page.

**In short.** The eight modules are in `src/look/`, each starting from WTWB's file with
every change marked `// R186:`. To check them, the harness in `tools/wtwb186/` builds WTWB
itself twice, once exactly as WTWB's `build.py` does (r128) and once on r186 with these
modules, and renders the same 28 views with both. **22 of the 28 pairs are pixel for
pixel the same, and 1,125 of 29.0 million pixels differ in all (0.0039%).** All but 18 of
those are on the
three held props that are lit `MeshStandardMaterial` rather than palette ramps (r186
shades standard materials differently, and blends translucent glass in linear light); the
other 18 are three art pixels sitting exactly on a tone threshold, where the last bit of
float rounding decides. Everything else (the ramp shading, outlines, contact shading,
grading through the day, sky and clouds, haze, the storm, glow and spill, the mist, the
cut-away earth, the halo, the cave ending, Easy to see, every quality level, a phone)
matches exactly.

## Contents

- [The files](#the-files)
- [Every change, and why](#every-change-and-why)
- [How it works now](#how-it-works-now): colour, light units, alpha tags, the palette texture
- [The comparison](#the-comparison): method, results, what each fix does
- [What still differs](#what-still-differs)
- [How to use these modules in a new page](#how-to-use-these-modules-in-a-new-page)
- [Running the harness](#running-the-harness)

## The files

| Path | What it is |
|---|---|
| `src/look/core.js` | `PKCore`: noise, canvases and textures, lofts, tubes, `col()` |
| `src/look/skin.js` | `PKSkin`: the bone rig, skin weights |
| `src/look/king3.js` | `PhilosopherKing`: `createRig()` (the rig, held props and the seven clips) and the lifelike king (`create()`, which needs WTWB's `PKBody3`, `PKFace` and `PKWear`, not ported) |
| `src/look/toon.js` | `PKToon`: `rampMat()`, the shared `FX` uniforms, the first pixel king |
| `src/look/toon2.js` | `PKToon2`: the Sheet king ('A') and the Little king ('B') |
| `src/look/pixel3d.js` | `PKPixel3D`: the pixel pass (palette snap, outlines, contact shading, grading, haze, sky, glow, spill, the Easy to see pool) |
| `src/look/valley.js` | `PKValley`: WTWB's valley (terrain, creeks, water, trees, plants, landmarks), `paint()` |
| `src/look/life.js` | `PKValleyLife`: the heron, turtles, minnows, frogs, dragonflies, butterflies, teal |
| `tools/wtwb186/build.mjs` | builds `out/r128/game.html` and `out/r186/game.html` |
| `tools/wtwb186/patches.mjs` | the string replacements WTWB's other files need on r186 (each must match exactly once) |
| `tools/wtwb186/shots.mjs` | the same views of both builds, seeded and paused |
| `tools/wtwb186/compare.mjs` | pairs, difference maps, numbers, a contact sheet |
| `tools/wtwb186/extra.json` | views beyond WTWB's own `look.json` and `easy.json` |
| `tools/wtwb186/ablate.mjs` | builds with one fix taken out, to show what each does |
| `tools/wtwb186/standalone.mjs` | a page of only r186 and `src/look`, with three checks |
| `docs/img/r186/` | the contact sheets |

`toon2.js` and `life.js` needed no changes (they only build geometry and paint through
`PKToon` and `PKValley`); they carry a header line saying so.

## Every change, and why

### In `src/look/`

| File | Change | Why |
|---|---|---|
| `toon.js` | `rampMat` replaces the whole `#include <opaque_fragment>` chunk with its tone code, instead of the line `gl_FragColor = vec4( outgoingLight, diffuseColor.a );` | Between r128 and r186 that line moved into the `opaque_fragment` chunk, so the old `replace` found nothing and every ramp material fell back to plain toon shading, with no error. Replacing the chunk also keeps the alpha tag (below). The line the ramp writes, `gl_FragColor = vec4( tone, diffuseColor.a );`, is kept word for word because `PKValley`'s earth paint replaces it in turn. A warning is logged if the chunk is ever missing. |
| `toon.js` | the sway and plain `project_vertex` replacements also apply `batchingMatrix` under `USE_BATCHING` | r186's `project_vertex`, which they replace, does; without it a `BatchedMesh` with a ramp material would draw every copy at the origin. Nothing in WTWB uses one. |
| `core.js` | `C.col(hex)` reads the hex as raw numbers (`setStyle`/`setHex` with `LinearSRGBColorSpace`, so nothing is converted), then converts sRGB to linear | In r128, `new Color(hex)` held the raw sRGB numbers. In r186, with colour management on (its default), `new Color(hex)` already converts to linear, so `.convertSRGBToLinear()` converted twice and every ramp colour came out far too dark. The new form gives linear(hex) whether colour management is on or off. |
| `king3.js` | its own `col()` uses `PKCore.col` | the same double conversion |
| `valley.js` | the earth colour (`EARTH`, inside cut-away ground) uses `PKCore.col` | the same |
| `core.js` | `C.tex`: `.encoding = sRGBEncoding` becomes `.colorSpace = SRGBColorSpace`; `format = RGBFormat` is dropped | renamed in r152; r186 only decodes sRGB textures stored as RGBA (an RGB one is sampled undecoded, with a warning). The canvases are opaque, so RGBA samples the same. (Only the lifelike king and the paper crown use `C.tex`.) |
| `pixel3d.js` | the scene target's texture is `SRGBColorSpace` (was `.encoding = sRGBEncoding`), and the pass turns what it reads back into sRGB numbers (`toSRGB`) | see [Colour](#colour) |
| `pixel3d.js` | the palette is a texture (`tPal`, read with `palAt(i)`), not `uniform vec3 pal[NP]` | see [The palette texture](#the-palette-texture) |
| `pixel3d.js` | new: `px.setPalette(list)` and `PKPixel3D.keepAlpha(material)` | a palette that can change and grow; a way to keep an alpha tag on materials other than the ramp's (below) |
| `valley.js` | each instanced plant batch gets the tile's sphere as its own `boundingSphere` | r186 culls an `InstancedMesh` by a sphere of its own, which it builds by moving the geometry's sphere to every copy. WTWB had already set the geometry's sphere to the tile's, in world space, so the copies' rotations and scales throw the computed sphere about: usually it still happens to cover the tile, but now and then a batch of plants is culled while in view (a clump of flowers by the trestle in view 07). The mesh now carries the tile's sphere, which is exactly what r128 culled with (and nothing has to be computed over every copy). |
| `skin.js` | `material.skinning = true` is commented out | removed in r129; a `SkinnedMesh` is skinned whatever its material says |
| `king3.js` | `BufferGeometryUtils.mergeBufferGeometries` becomes `THREE.mergeGeometries` | renamed in r151; Creekfolk 2's three.js build exports it on `THREE` (only the lifelike king's geodesic hat uses it) |
| `king3.js` | `var OUTFITS = Wr ? Wr.OUTFITS : {}` | so the rig and clips load without `PKWear`, which only the lifelike king needs (not an r186 matter; without it `king3.js` could not be used on its own) |

### In WTWB's other files (applied by the harness, `tools/wtwb186/patches.mjs`)

These are WTWB's game (`main.js`) and page (`template.html`). Nothing under `ref/` is
edited; the harness applies each replacement at build time and stops if one does not
match exactly once. `finds.js`, `card*.js`, `body3.js`, `wear.js` and `cloth.js` need
nothing.

| id | File | Change | Why |
|---|---|---|---|
| `colour-management-off` | `template.html` | `THREE.ColorManagement.enabled = false` before the game's script | r128 had no colour management: the game's own hex colours (its lights, the halo, the mist) were used as raw numbers and were tuned that way. |
| `output-colour-space` | `main.js` | `renderer.outputEncoding = sRGBEncoding` becomes `outputColorSpace = SRGBColorSpace` | renamed in r152 (sRGB is the default; the pass writes its numbers as they are either way) |
| `light-units`, `light-units-day`, `light-units-icons` | `main.js` | every light intensity times `Math.PI` (the sky and the sun, their changes through the day, the find icons' little scene) | see [Light units](#light-units) |
| `alpha-halo`, `alpha-mist`, `alpha-cave-shadows`, `alpha-easy-disc` | `main.js` | `PKPixel3D.keepAlpha(...)` round the four tagged `MeshBasicMaterial`s | see [Alpha tags](#alpha-tags). (The Easy to see disc is never shown in this version; its patch only keeps its tag right.) |

The rest of WTWB runs as it is. r186 logs one warning: `THREE.Clock` is deprecated (since
r183) in favour of `THREE.Timer`; it still works, so the harness leaves it.

## How it works now

### Colour

What the pixel pass needs is simple: the scene target must hold the **sRGB numbers** of
the designed colours (#6e9c5b as 110, 156, 91), because it compares what it reads with the
sRGB palette and snaps to the nearest. In r128 every material's shader encoded its linear
result to sRGB on the way into the target (`rt.texture.encoding = sRGBEncoding`), and the
ramp materials' linear tones (`C.col`, sRGB to linear) came back out as the exact hex.

r186 never encodes in the shader when drawing into a render target: materials write linear
light. Three ways to get the sRGB numbers back were weighed:

1. **The scene target is an sRGB texture** (chosen). With `rt.texture.colorSpace =
   SRGBColorSpace` the target is stored as `SRGB8_ALPHA8`: the GPU encodes linear to sRGB
   as each fragment is written, exactly the step r128 did in the shader, for every kind of
   material and texture, and decodes again when the pass samples it. The pass then turns
   the sample back into sRGB numbers (`toSRGB`, one line where it reads the colour). The
   alpha channel is stored as it is, so the tags survive. Nothing else needs to know.
2. A plain target, and the ramp writes the raw hex numbers directly. Exact for the ramp,
   but every other material (the MeshBasic glows, the props, textures) would then store
   linear numbers and come out too dark, each needing its own fix.
3. A plain target, and every material encodes in its own shader as r128 did (tried by
   overriding the `colorspace_fragment` chunk for the whole page: the `srgb-in-shader`
   variant below). It is the closest to r128 (translucent things blend in sRGB, as they did),
   but it changes every material in the page behind its back and breaks anything drawn
   straight to the screen with a built-in material.

`PKCore.col` gives linear(hex) whether colour management is on or off, so the modules
work either way. A page's own hex colours do depend on it: with colour management on (the
r186 default), `new THREE.Color('#fff2c8')` means that sRGB colour and is stored linear,
which with the sRGB target comes out as #fff2c8; with it off (as in the WTWB harness) it is
taken as raw numbers, as r128 did, and comes out brighter. WTWB's lights were tuned as raw
numbers: in a page with colour management on, give them as
`new THREE.Color().setHex(0xfffaf2, THREE.LinearSRGBColorSpace)` to get WTWB's light.

### Light units

r155 made physical light units the default and r165 removed the legacy mode. In r128's
legacy mode a light's irradiance was multiplied by π and the Lambert term divided by π;
now the π is gone, so every lit material (toon and standard alike) gets 1/π of the light,
and the ramp thresholds (`PKToon.TD` 0.78, `TL` 1.12, applied to the luma of the light
reaching the surface) put nearly everything in the dark tone. The fix is to give every light
**π times WTWB's intensity** (hemisphere 0.45π, sun 0.83π, and so on): r186's light then
equals r128's to the last rounding, the thresholds keep their meaning, and other lit
materials stay consistent. The shader is unchanged.

### Alpha tags

The pixel pass reads the scene target's alpha as a tag: 1 normal, 0.875 the king (dark
outline, no contact shading), 0.6 the inside of cut-away ground, 0.5 soft (no ink outline),
0.25 shines (no outline, not darkened at night, spills light). The tags are given as a
material's `opacity`, on materials that are not `transparent` (so nothing is blended).
r128 wrote `opacity` into the alpha. r186's `opaque_fragment` chunk sets alpha to 1 for
every non-transparent material (`#ifdef OPAQUE`), so every tag was lost:

- `PKToon.rampMat` replaces that chunk with its own code, which writes `opacity` again.
  Everything made with `rampMat` or `PKValley.paint` keeps its tag with no further step.
- Any other material that carries a tag goes through `PKPixel3D.keepAlpha(material)`, which
  replaces the chunk with its last line (`gl_FragColor = vec4( outgoingLight, diffuseColor.a );`).
  It chains with an existing `onBeforeCompile` and extends the program cache key. In WTWB
  that is the Easy to see halo, the morning mist, the shadows on the cave wall and the
  (unused) Easy to see disc, all `MeshBasicMaterial`s.

Making those materials `transparent` instead would also keep the alpha, but moves them to
the transparent pass (drawn after everything else, sorted), which breaks the halo: it must
draw after the valley and before the king.

### The palette texture

The pass searches the whole palette for the nearest colour at every art pixel. It was
`uniform vec3 pal[NP]`: WTWB's 367 colours are well past the 224 fragment uniform vectors
WebGL 2 promises, which some phones hold to, and Creekfolk 2 will add season and fur
colours. The palette is now a `DataTexture` (`tPal`): one texel per colour, 256 to a row,
RGBA8 holding the sRGB numbers as they are (no colour space), read with `texelFetch` by
index (`palAt(i)`; index 0 is the outline ink). `NP` (the count) and `PW` (the row width)
are still `#define`s, so the search loop is unchanged. Any number of colours fits. The
picture is identical: a palette padded to 900 colours gives the same pixels
(`standalone.mjs`).

`px.setPalette(list)` replaces the palette at any time; a new length rebuilds the pass's
shader once. Order matters only for ties and for index 0 (the ink).

## The comparison

### Method

`build.mjs` writes `out/r128/game.html` byte for byte as WTWB's `build.py` makes it
(checked with `cmp` against `build.py`'s own output), and `out/r186/game.html`: the same
template and module order with `vendor/three-r186.js`, the eight `src/look` modules and
the patches above.

`shots.mjs` takes the views of WTWB's `tools/shots.py` (spots, hours, storm, Easy to see,
from WTWB's `look.json` and `easy.json`) plus `extra.json` (close-up, held props, a storm
by day, the lantern, the find icons, the cave ending, low and high quality, big art
pixels, a phone), with headless Chromium rendering WebGL through SwiftShader. So that a
pair can only differ through the renderer:

- the page opens with `?paused`, so time moves only through `WWB.step` (fixed steps):
  the clock, wind, water, clouds and creatures are at the same moment in both builds;
- `Math.random` is seeded, with a separate stream for calls made from three.js's own
  code (it draws four numbers for every object's uuid, and r128 and r186 make different
  numbers of objects), found from the caller's line; the game's own draws were counted
  and are the same in both builds for every view;
- no sound (its noise buffers would draw random numbers too) and no network (the HUD's web
  fonts are refused);
- the picture is the WebGL canvas read back (`?shots` keeps the drawing buffer), so the
  HTML HUD is left out.

`compare.mjs` then gives, per pair, the mean absolute difference over R, G and B (0 to
255), the number and share of pixels that differ at all, the share that differ by more
than 24 in some channel, and where; it writes the side-by-side pair, a difference map and
a contact sheet.

### Results

All 28 views, 1280 x 720 unless noted (the phone is 390 x 844 CSS pixels at 3x, the icon
grid is 56 icons drawn 96 x 96 and shown at twice that):

| view | what it shows | size | pixels that differ | share | by > 24 | mean abs diff |
|---|---|---|---:|---:|---:|---:|
| 01-start-morning | the start, 8:30 | 1280x720 | 0 | 0% | 0% | 0 |
| 02-heron-morning | Heron Pool, 9:30 | 1280x720 | 0 | 0% | 0% | 0 |
| 03-bridge-midday | the bridge, 12:30 | 1280x720 | 0 | 0% | 0% | 0 |
| 04-falls-afternoon | the Dry Falls rock, 15:30 | 1280x720 | 0 | 0% | 0% | 0 |
| 05-lookout-evening | the lookout, 18:36 | 1280x720 | 2 | 0.000217% | 0% | 1.23e-05 |
| 06-pond-dusk | the pond, 19:36 | 1280x720 | 0 | 0% | 0% | 0 |
| 07-trestle-night | the trestle, 22:30 (fireflies, spill) | 1280x720 | 0 | 0% | 0% | 0 |
| 08-low-view-creek | low view along the creek (cut-away earth) | 1280x720 | 0 | 0% | 0% | 0 |
| 09-storm | storm at night (rain, glow) | 1280x720 | 0 | 0% | 0% | 0 |
| 10-fireflies | fireflies, 20:54 | 1280x720 | 0 | 0% | 0% | 0 |
| 11-mist | morning mist (MeshBasic with keepAlpha) | 1280x720 | 0 | 0% | 0% | 0 |
| 12-sky-lookout | low view at the sky: bands, clouds, sun | 1280x720 | 0 | 0% | 0% | 0 |
| e1-start-still | Easy to see: still | 1280x720 | 0 | 0% | 0% | 0 |
| e2-walking | Easy to see: walking | 1280x720 | 0 | 0% | 0% | 0 |
| e3-evening | Easy to see: evening (halo behind the bench) | 1280x720 | 0 | 0% | 0% | 0 |
| e4-night | Easy to see: night (halo behind the trestle) | 1280x720 | 0 | 0% | 0% | 0 |
| x01-closeup-face | close-up of his face | 1280x720 | 0 | 0% | 0% | 0 |
| x02-carry-bottle | holding the bottle (MeshStandard glass) | 1280x720 | 353 | 0.0383% | 0.00543% | 0.00471 |
| x03-hold-icosa | holding the icosahedron (MeshStandard) | 1280x720 | 645 | 0.07% | 0.000326% | 0.00515 |
| x04-storm-midday | storm by day (still holding it) | 1280x720 | 104 | 0.0113% | 0.0025% | 0.00101 |
| x05-lantern-night | the lantern at night (still holding it) | 1280x720 | 5 | 0.000543% | 0% | 3.62e-05 |
| x06-icons | all 56 find icons (their own pixel pass) | 1536x1344 | 16 | 0.000775% | 0.000775% | 0.0011 |
| x07-cave-ending | the ending: fire, shadows on the cave wall | 1280x720 | 0 | 0% | 0% | 0 |
| x08-low-quality | Low quality (no contact shading or spill) | 1280x720 | 0 | 0% | 0% | 0 |
| x09-high-quality | High quality (king and creek at detail 6) | 1280x720 | 0 | 0% | 0% | 0 |
| x10-chunky-pixels | big art pixels (2 x 2, the blit) | 1280x720 | 0 | 0% | 0% | 0 |
| x11-phone | a phone (390 x 844 at 3x) | 1170x2532 | 0 | 0% | 0% | 0 |
| x12-easy-storm | Easy to see in a storm | 1280x720 | 0 | 0% | 0% | 0 |

Pixels that differ, all views together: 1,125 of 28,988,424 (0.0039%). The game's own
`Math.random` draws matched in every view (for example 23,588 in the main page's 19 views,
in both builds).

- The contact sheet: [`docs/img/r186/r186-pairs.jpg`](img/r186/r186-pairs.jpg) (each
  pair as r128, r186 and a difference map; boxed where pixels differ).
- Full size, after a run: `tools/wtwb186/out/compare/all/r186/<view>-pair.png` (side by
  side), `<view>-diff.png` (difference map), `results.md`, and the pictures themselves in
  `tools/wtwb186/out/shots/all/{r128,r186}/`.

Every pair was looked at, at full size, and the differing ones also enlarged; the
differences are the ones described under [What still differs](#what-still-differs).

### What each fix does

`ablate.mjs` builds the r186 game with one fix taken out (or an alternative tried), takes
eight of the views with each, and compares them with r128. Share of pixels that differ:

| variant | 01-start-morning | 07-trestle-night | 09-storm | 11-mist | x02-carry-bottle | x03-hold-icosa | x07-cave-ending | e4-night |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| r186 | 0% | 0% | 0% | 0% | 0.0372% | 0.0828% | 0% | 0% |
| naive | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 91.5% |
| no-opaque-chunk-fix | 100% | 100% | 100% | 94.5% | 100% | 99.8% | 96.3% | 89.8% |
| colour-management-on | 4.41% | 0% | 0% | 7.42% | 3.85% | 1.04% | 0% | 1.71% |
| double-linear | 99.9% | 100% | 99.9% | 100% | 99.8% | 99.8% | 96.2% | 91.2% |
| no-light-units | 94.5% | 0% | 0% | 11.5% | 95.8% | 94.9% | 0% | 0% |
| linear-target | 99.9% | 100% | 99.9% | 100% | 99.8% | 99.8% | 99.9% | 91.2% |
| no-keep-alpha | 0% | 0% | 0% | 5.35% | 0.0372% | 0.0828% | 0% | 1.81% |
| no-instance-sphere | 0% | 0.00163% | 0% | 0% | 0.0372% | 0.0828% | 0% | 0% |
| srgb-in-shader | 0% | 0% | 0% | 0% | 0.0217% | 0.0828% | 0% | 0% |
| lf-nudge | 0.000651% | 0% | 0% | 0.000326% | 0.038% | 0.0828% | 0% | 0% |

(This run takes only these eight views in a fresh page, so its starting state differs from
the full run's; `r186` here is the port itself, for reference.)

- **naive**: grey and dark: the ramp is off (plain white toon material), the light is a
  third, and the target is linear.
- **no-opaque-chunk-fix**: the palette ramp silently does nothing: every surface is the
  white base colour under the light.
- **double-linear** and **linear-target**: every colour far too dark (linear values read
  as sRGB numbers); either alone spoils the whole picture.
- **no-light-units**: by day everything takes its shade tone (the light factor is a third
  of what the thresholds expect); at night it makes no difference, since everything is in
  its shade tone anyway.
- **colour-management-on**: the modules are unaffected, but the game's own hex light
  colours become linear (a little less light), so a few percent of pixels change tone;
  and the Easy to see halo turns a deeper cream (its hex is now read as sRGB).
- **no-keep-alpha**: the mist (11) and the halo (e4) lose their tags and get outlined and
  darkened at night. The cave-wall shadows (x07) show no change: their tag only removes the
  ink outline, and a sheet lying flat on the wall gets none.
- **no-instance-sphere**: one clump of flowers by the trestle is culled while in view (07);
  in the other views the misplaced sphere happened to cover the tile.
- **srgb-in-shader** (the alternative to the sRGB target): the same as the port everywhere
  except the translucent bottle, which it matches better (200 pixels differ instead of
  343): that part of the bottle's difference is the blending.
- **lf-nudge** (a probe): changing the light factor by one part in a million changes a few
  pixels per view (6 in 01, 3 in 11): that many pixels sit on a tone threshold, which is the
  size of the single-pixel differences in 05 and x06.

The sheet: [`docs/img/r186/r186-ablate.jpg`](img/r186/r186-ablate.jpg); after a run, every
pair is in `tools/wtwb186/out/compare/ablate/<build>/`.

## What still differs

Three things, all small; none can be seen without enlarging.

1. **The held props shade differently: x02, x03, x04, x05.** The bowl, the bottle and the
   icosahedron are the three finds he holds as `king3.js`'s own props, which are lit
   `MeshStandardMaterial` (vertex colours, roughness, glass), the only lit materials in the
   game that are not palette ramps. r186's physically based shading is not r128's even with
   the light units matched: direct diffuse light is now scaled by (1 - F), the Fresnel term
   (glTF's fresnel_mix: what the specular layer reflects does not reach the diffuse layer),
   direct specular gets a multiple-scattering compensation, and indirect diffuse a new
   energy conservation. The light on a face changes by a few percent, so some faces snap to
   the neighbouring palette colour (two faces of the icosahedron in x03, with their coloured
   outline; in x04 and x05 he is still holding it). Undoing this would mean rewriting r186's
   BRDF. For Creekfolk 2, paint held things with `PKValley.paint` / `PKToon.rampMat` (as all
   of WTWB's other finds are), and they match exactly.
2. **The glass bottle blends in linear light: x02.** On top of the shading, the bottle is
   translucent (opacity 0.3, blended). With the sRGB target the GPU blends in linear light,
   where r128 blended sRGB numbers, so the glass over his coat comes out a little paler
   (lighter in 82% of the pixels that differ) and snaps differently. The `srgb-in-shader`
   variant, which blends sRGB numbers as r128 did, cuts the bottle's difference from 343
   pixels to 200 (the rest is the shading). It was not chosen because it changes every
   material in the page through a global chunk override and breaks anything drawn straight
   to the screen with a built-in material; nothing in WTWB
   besides this prop and the unused lifelike king's glass is translucent. Creekfolk 2 should
   draw see-through things with dithering (as WTWB's mist does) or with a tag, not blending.
3. **Three art pixels on a tone threshold: 05 (2 pixels), x06 (one art pixel of the
   feather icon).** These are ordinary ramp materials. The light is the same number in both
   builds only up to float rounding (r186 multiplies by pi in JavaScript before uploading,
   r128 multiplied by pi in the shader), so a pixel whose light falls exactly on a tone
   threshold can go either way; in 05 two pixels near the end of a lying branch swap
   their two tones. The `lf-nudge` probe shows that a change of one part in a million
   moves a few pixels per view, so this is the expected size. It also means a real GPU, which may
   round its sRGB encoding or its lighting differently from SwiftShader in the last bit,
   can differ in a few such pixels.

Not a picture difference: r186 logs that `THREE.Clock` is deprecated (WTWB's `main.js` uses
it; it still works). The comparison ran on SwiftShader only; it says nothing about speed.

## How to use these modules in a new page

The modules are classic scripts that share globals, like WTWB's. Load, in this order,
after `vendor/three-r186.js` (which defines `THREE`): `core.js` (`PKCore`), `skin.js`
(`PKSkin`), `king3.js` (`PhilosopherKing`), `toon.js` (`PKToon`), `toon2.js` (`PKToon2`),
`pixel3d.js` (`PKPixel3D`), `valley.js` (`PKValley`), `life.js` (`PKValleyLife`). Each needs
only `THREE` and the ones before it. `tools/wtwb186/standalone.mjs` builds exactly such a
page (`out/standalone/page.html`) and is the shortest working example.

**Renderer.** WTWB's settings: `new THREE.WebGLRenderer({ canvas, antialias: false })`,
`setPixelRatio(min(devicePixelRatio, 3))`, `shadowMap.enabled = true`,
`shadowMap.type = THREE.BasicShadowMap`; the default output colour space (sRGB) and no tone
mapping. Colour management may stay on (see [Colour](#colour) for light colours).

**Lights.** WTWB's lights with π times its intensities: `HemisphereLight(0xfffaf2, 0xe4dccb,
0.45 * Math.PI)` (0.3 to 0.45 through the day, times π), a `DirectionalLight(0xfff6e8,
0.83 * Math.PI)` (0.35 to 0.83, times π) with `castShadow`, a 2048 map, `bias -0.002` and
a 28 m shadow box that follows the view.

**The pixel pass.**

```js
// the palette: the outline ink first, then every colour any material may be painted in
const pal = [PKToon.P.ink, ...Object.values(PKToon.P), ...PKToon2.extraPalette, ...PKValley.palette()];   // dedupe (lower case)
const px = PKPixel3D.create(renderer, { palette: pal, snapLow: true, softInk: true });
const cam = new THREE.OrthographicCamera(-1, 1, 3.6, -3.6, 0.5, 90);   // orthographic: the pass reads its depth linearly
// on resize: canvas size in device pixels, k device pixels per art pixel (it sets cam.left/right from the aspect)
px.setSize(canvasWidth, canvasHeight, k, cam);
// each frame: the shared toon uniforms, the look, then draw
PKToon.FX.uTime.value = t;              // also uWind, uCloud, uDith, uDay (see toon.js)
px.setGrade2(shade, light, lift); px.setFX({ ao: [1, 0.32], selOut: 1, sat: 1, skyTop, skyHor, haze, hazeZ, /* ... */ });
px.render(scene, cam);
```

`PKValley.palette()` lists the paints that exist when it is called: add new paints (to
`PKValley.PAINT`, as `life.js` does) before building the palette, or call
`px.setPalette()` again after. WTWB's `main.js` (`lookUpdate`, `skyUpdate`) shows how it
drives grading, sky, haze, glow and spill through the day; `PKValley.CUT` holds the
uniforms for the see-through hole in canopies round the player.

**Materials.** `PKToon.rampMat(dark, mid, light, { flat, side, sway, vary, water, foam,
spark })` takes three sRGB hex colours (shade, middle, light) and picks one per pixel from
the light; `PKValley.paint(key, { flat, cut, side, soft, glow, earth, sway, water })` makes
(and caches) one from the named paints in `PKValley.PAINT`. Tags go in `opacity` on
non-transparent materials: leave 1, or 0.875 for the hero (WTWB sets it on every `Toon_`
and `Toon2_` material of the king), 0.5 soft (`paint(key, { soft: true })`), 0.25 shines
(`{ glow: true }`). Any material other than `rampMat` that carries a tag needs
`PKPixel3D.keepAlpha(material)`. Keep everything in palette colours; `MeshStandardMaterial`
works but shades differently from r128 (see above) and is only snapped, not designed.

**The rig and clips.**

```js
const V = PKToon2.variant('B');                     // the Little king: Creekfolk 2's creekfolk start from these proportions
const k = PhilosopherKing.createRig({ dims: V.DIMS, rest: V.REST, props: false });
PKToon2.build(k, 'B', { detail: 3, merge: true }); // or hang your own solids on k.joints.Head, .Spine, .Thigh_L, ...
scene.add(k.root);
k.play('walk', 0.2);                                // idle, sit, walk, run, jump, hold-item, hold-up (k.clipNames)
k.actions.walk.timeScale = speed / 0.67;            // the clips' own speeds: walk 0.67 m/s, run 2.4 m/s (WTWB main.js)
k.mixer.update(dt);                                 // each frame
```

`createRig` builds a `THREE.Bone` skeleton (`k.joints` by name: `Hips`, `Spine`, `Neck`,
`Head`, `UpperArm_L`, `Forearm_L`, `Hand_L`, `Fingers_L`, the same on the right, `Thigh_*`,
`Shin_*`, `Foot_*`, and the `Slot_Head`, `Slot_Hand_*` groups), then makes the clips for
those proportions (`dims`) and rest posture (`rest`). `k.seek(name, time)` poses a clip
still; `k.setItem(id)` / `k.addHeld(id, object)` / `k.setItemMode('cradle' | 'carry')`
handle what is held in the right hand. The default props (`bowl`, `bottle`, `icosa`) are
`MeshStandardMaterial`; pass `props: false` and add held things painted with
`PKValley.paint` for an exact palette look. `PKToon2.merge` joins each joint's pieces into
one mesh per colour (far fewer draw calls).

## Running the harness

```
cd creekfolk2 && npm install
node tools/wtwb186/build.mjs          # out/r128/game.html and out/r186/game.html
node tools/wtwb186/shots.mjs          # out/shots/all/{r128,r186}/*.png (about 10 minutes with SwiftShader)
node tools/wtwb186/compare.mjs        # out/compare/all/r186/: *-pair.png, *-diff.png, sheet.jpg, results.md
node tools/wtwb186/ablate.mjs         # out/compare/ablate/summary.md (about an hour)
node tools/wtwb186/standalone.mjs     # the modules on their own; prints the three checks
```

`shots.mjs --only a,b` takes only some views (in a fresh page, so the state they start
from differs from a full run; compare only with a run made the same way, using `--set`).
`out/` is ignored by git. SwiftShader renders for looks only; it says nothing about speed.

## Added for Creekfolk 2 after the port

- **The palette look-up table** (`pixel3d.js`, marked `// CF2:`). `PKPixel3D.create(renderer,
  { lut: true })` builds, once per palette on the GPU, a 512 x 512 table of the nearest palette
  colour for every 64 x 64 x 64 step of red, green and blue, using the pass's own search, and
  the pass then reads that instead of searching every colour for every pixel (it searches up to
  four times a pixel; with about 400 colours that was the pass's whole cost). Without `lut` the
  pass is exactly as ported, so this comparison still holds. With it, a colour that sits within
  one step of another palette colour can come out as that one; on the screenshots compared so
  far nothing visible changed, and a Creekfolk 2 screenshot run took about a third of the time.

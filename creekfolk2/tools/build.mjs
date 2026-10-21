// Build Creekfolk 2: two self-contained HTML pages and a Node copy of the simulation.
//
//   node tools/build.mjs          -> dist/creekfolk2.html, dist/creekfolk2-dev.html (minified), dist/sim.cjs
//   node tools/build.mjs --dev    -> the same, unminified (easier to debug)
//
// The game and the dev build come from the same source: creekfolk2.html (the game; its
// dev menu is hidden) and creekfolk2-dev.html (a visible Dev button and its own saves).
// BUILD_VERSION names the build; each build keeps its valleys in its own IndexedDB
// database and never opens another build's, or Creekfolk 1's.
//
// As in Creekfolk 1, the source files share one scope: they are concatenated in the order
// below inside one function. The simulation runs in a Web Worker built from the same
// simulation files plus src/sim/worker.js; the page holds three.js, the renderer and the
// interface, and starts the worker from a copy of its source embedded in the page.
import fs from 'node:fs';
import path from 'node:path';
import { transform } from 'esbuild';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dev = process.argv.includes('--dev');
export const BUILD_VERSION = 'cf2-1';
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// Order matters: later files may use names from earlier ones. The first group is
// Creekfolk 1's simulation as of 3B (commit 8e9ec93); Creekfolk 2's own files follow it,
// and replace Creekfolk 1 functions where docs/MERGE.md says so.
export const SIM_FILES = [
  'src/sim/core.js',      // Creekfolk 1: the valley simulation (minds, building, water)
  'src/sim/calendar.js',  // Creekfolk 1: the 8-day year, seasons, wet and dry
  'src/sim/creek.js',     // Creekfolk 1: the creek model, floods, ponds, water table, Stage 0
  'src/sim/life.js',      // Creekfolk 1: ages, stages, births, passings, leaving downstream
  'src/sim/minds.js',     // Creekfolk 1: stories, myths, places, customs, lost skills, visitors
  'src/sim/fauna.js',     // Creekfolk 1: living gifts (flowers, fruit trees, goats, bees, fish, birds)
  'src/sim/gift.js',      // Creekfolk 1: the gift and beliefs about the giver
  'src/sim/temple.js',    // Creekfolk 1: the temple and the Hall of the Ancestors (not used in Creekfolk 2)
  'src/sim/hooks.js',     // Creekfolk 1: new valleys, upgrades, dev triggers
  // Creekfolk 2's own (after Creekfolk 1's, so they can replace parts of it; before
  // api.js, which takes its references when it loads)
  'src/sim/cf2-valley.js',   // the real-scale valley: terrain, the ledge, the bluff
  'src/sim/cf2-branches.js', // the Dry Fork and the spring branch
  'src/sim/cf2-scale.js',    // real scale: homes and the village for person-sized creekfolk
  'src/sim/cf2-life.js',     // eight founders; lives across one real month
  'src/sim/cf2-belief.js',   // belief asleep for now; no temple, no Hall of the Ancestors
  'src/sim/api.js',       // Creekfolk 1: the surface used by tools and the worker
  'src/sim/cf2-api.js',   // what Creekfolk 2 adds to it
];
const VENDOR_FILES = ['vendor/three-r186.js'];
// What the Water Brings' renderer, ported to r186 (docs/R186-PORT.md). These hang their names on
// window and read window.THREE, so the page sets that first.
const LOOK_FILES = ['src/look/core.js', 'src/look/skin.js', 'src/look/king3.js', 'src/look/toon.js', 'src/look/toon2.js', 'src/look/pixel3d.js'];
const VIEW_FILES = [
  'src/view/clock.js',    // the page's clock (the player's correction, the dev offset)
  'src/view/vworld.js',   // the page's copy of the valley, as the worker describes it
  'src/view/words.js',    // plain words about creekfolk (from Creekfolk 1's interface)
  'src/view/sheets.js',   // the village and mind sheets
  'src/view/hud.js',      // the interface
  'src/view/dev.js',      // the developer menu
  'src/view/mapview.js',  // the valley from above, on a 2D canvas (without WebGL)
  'src/view/look-glue.js', // how the view uses the ported renderer (colour, light units)
  'src/view/sprites.js',  // creekfolk as small pixel sprites, for the middle of the zoom
  'src/view/valley3d.js', // the valley in 3D, drawn from the simulation
  'src/view/life3d.js',   // its creatures: heron, turtles, minnows, frogs, dragonflies, butterflies, teal
  'src/view/air3d.js',    // its air: rain, lightning, snow, mist, fireflies, leaves, swallows
  'src/view/folk3d.js',   // creekfolk close up, on the shared rig
  'src/view/view3d.js',   // the 3D view: camera, light, the zoom from dots to faces
  'src/view/app.js',      // the worker, the drawing loop
  'src/view/boot.js',     // starts it
];

const join = (files) => files.map((f) => `// ==== ${f} ====\n` + read(f)).join('\n');
const flags = (devBuild) => `var BUILD_VERSION = ${JSON.stringify(BUILD_VERSION)}, DEV_BUILD = ${devBuild};\n`;
const sim = flags(false) + join(SIM_FILES);

async function min(code) {
  if (dev) return code;
  const r = await transform(code, { minify: true, target: 'es2020', legalComments: 'none' });
  return r.code;
}

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });

// Node copy for the headless runners and tests.
fs.writeFileSync(path.join(root, 'dist/sim.cjs'), `"use strict";\n${sim}\nmodule.exports = CreekSim;\n`);
console.log('dist/sim.cjs');

if (VIEW_FILES.length) {
  // the fonts, embedded so the page never loads anything from the network
  const font = (file, family, style, weight) =>
    `@font-face { font-family: '${family}'; font-style: ${style}; font-weight: ${weight}; font-display: block; src: url(data:font/woff2;base64,${fs.readFileSync(path.join(root, 'assets/fonts', file)).toString('base64')}) format('woff2'); }`;
  const fonts = [
    font('Gloock-normal-400.woff2', 'Gloock', 'normal', 400),
    font('HankenGrotesk-normal-400-600.woff2', 'Hanken Grotesk', 'normal', '400 600'),
    font('HankenGrotesk-italic-400.woff2', 'Hanken Grotesk', 'italic', 400),
    font('IBMPlexMono-normal-400.woff2', 'IBM Plex Mono', 'normal', 400),
    font('IBMPlexMono-normal-500.woff2', 'IBM Plex Mono', 'normal', 500),
  ].join('\n');
  const head = read('src/page-head.html').replace('/*@@FONTS@@*/', fonts);
  const tail = read('src/page-tail.html');
  const safe = (s) => s.replace(/<\/script/gi, '<\\/script');
  for (const devBuild of [false, true]) {
    const worker = await min(`(() => {\n${flags(devBuild)}${join(SIM_FILES)}\n${read('src/sim/cf2-worker.js')}\n})();`);
    const main = await min(`(() => {\n${flags(devBuild)}${join(SIM_FILES)}\n${join(VENDOR_FILES)}\nwindow.THREE = THREE;\n${join(LOOK_FILES)}\n${join(VIEW_FILES)}\n})();`);
    const title = devBuild ? 'Creekfolk 2 (dev)' : 'Creekfolk 2';
    const html =
      head.replace('<title>Creekfolk 2</title>', `<title>${title}</title>`) +
      `<script id="sim-src" type="text/plain">${safe(worker)}</script>\n` +
      `<script>${safe(main)}</script>` +
      tail;
    const out = devBuild ? 'dist/creekfolk2-dev.html' : 'dist/creekfolk2.html';
    fs.writeFileSync(path.join(root, out), html);
    console.log(`${out} ${(html.length / 1024).toFixed(0)} KB (sim ${(worker.length / 1024).toFixed(0)} KB, page ${(main.length / 1024).toFixed(0)} KB)`);
  }
}

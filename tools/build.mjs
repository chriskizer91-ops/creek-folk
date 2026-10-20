// Build Creekfolk into one self-contained HTML file, plus a Node copy of the simulation.
//
//   node tools/build.mjs            -> dist/creekfolk.html, dist/creekfolk-dev.html, dist/sim.cjs
//   node tools/build.mjs --dev      -> same, unminified (easier to debug)
//
// Every build makes two pages from the same source (PHASE3-CHANGES.md, section 1):
// creekfolk.html (the game) and creekfolk-dev.html (the same game with a visible Dev
// button and its own saves). BUILD_VERSION names the build; each build's saves live in
// their own IndexedDB database and a build never opens another build's saves.
//
// Everything shares one scope (the original game was a single bundle), so the source
// files are concatenated in a fixed order inside one function, then minified.
import fs from 'node:fs';
import path from 'node:path';
import { transform } from 'esbuild';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dev = process.argv.includes('--dev');
export const BUILD_VERSION = '3a';
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// Order matters: later files may use names from earlier ones.
export const SIM_FILES = [
  'src/sim/core.js',      // the original valley simulation (minds, building, water)
  'src/sim/calendar.js',  // the valley's 8-day year: dates, seasons, wet and dry
  'src/sim/creek.js',     // the creek model: floods, ponds, water table, Stage 0 wetland
  'src/sim/life.js',      // ages, stages, births, passings, leaving downstream
  'src/sim/minds.js',     // stories and myths, named places, customs, lost skills, visitors
  'src/sim/gift.js',      // the player's gift and beliefs about the giver
  'src/sim/hooks.js',     // small patches that connect life and calendar to the core
  'src/sim/api.js',       // the surface used by the app, the worker and the tests
];
const VENDOR_FILES = ['src/vendor/three-r186.js'];
const VIEW_FILES = [
  'src/view/view.js',     // the original renderer, HUD and app
  'src/view/land.js',     // the ground and the water, drawn from the creek model
  'src/view/store.js',    // IndexedDB saves
  'src/view/catchup.js',  // long catch-ups in a Web Worker
  'src/view/dev.js',      // hidden developer menu
  'src/view/patches.js',  // small patches that connect the new parts to the view
  'src/view/minds-view.js', // the gift button, stories, places, customs and beliefs in the HUD
  'src/view/boot.js',     // starts the app
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

// Node copy for the headless year runner and tests.
fs.writeFileSync(
  path.join(root, 'dist/sim.cjs'),
  `"use strict";\n${sim}\nmodule.exports = CreekSim;\n`,
);

// Worker copy: the simulation alone plus the message handler.
const worker = await min(`(() => {\n${sim}\n${read('src/sim/worker.js')}\n})();`);

// The pages: simulation, 3D library and view in one scope.
const head = read('src/page-head.html');
const tail = read('src/page-tail.html');
const safe = (s) => s.replace(/<\/script/gi, '<\\/script');
for (const devBuild of [false, true]) {
  const body = flags(devBuild) + join(SIM_FILES);
  const main = await min(`(() => {\n${body}\n${join(VENDOR_FILES)}\n${join(VIEW_FILES)}\n})();`);
  const html =
    head.replace('<title>Creekfolk</title>', devBuild ? '<title>Creekfolk (dev)</title>' : '<title>Creekfolk</title>') +
    `<script id="creek-sim-src" type="text/plain">${safe(worker)}</script>\n` +
    `<script>${safe(main)}</script>` +
    tail;
  const out = devBuild ? 'dist/creekfolk-dev.html' : 'dist/creekfolk.html';
  fs.writeFileSync(path.join(root, out), html);
  console.log(
    `${out} ${(html.length / 1024).toFixed(0)} KB` +
      ` (sim ${(worker.length / 1024).toFixed(0)} KB, page script ${(main.length / 1024).toFixed(0)} KB)`,
  );
}

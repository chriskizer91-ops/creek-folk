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
export const BUILD_VERSION = '1';
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
  'src/sim/api.js',       // Creekfolk 1: the surface used by tools and the worker
];
const VENDOR_FILES = ['vendor/three-r186.js'];
const VIEW_FILES = [];

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
  const head = read('src/page-head.html');
  const tail = read('src/page-tail.html');
  const safe = (s) => s.replace(/<\/script/gi, '<\\/script');
  for (const devBuild of [false, true]) {
    const worker = await min(`(() => {\n${flags(devBuild)}${join(SIM_FILES)}\n${read('src/sim/worker.js')}\n})();`);
    const main = await min(`(() => {\n${flags(devBuild)}${join(VENDOR_FILES)}\n${join(VIEW_FILES)}\n})();`);
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

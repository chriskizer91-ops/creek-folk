// Build Creekfolk into one self-contained HTML file, plus a Node copy of the simulation.
//
//   node tools/build.mjs            -> dist/creekfolk.html, dist/sim.cjs
//   node tools/build.mjs --dev      -> same, unminified (easier to debug)
//
// Everything shares one scope (the original game was a single bundle), so the source
// files are concatenated in a fixed order inside one function, then minified.
import fs from 'node:fs';
import path from 'node:path';
import { transform } from 'esbuild';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dev = process.argv.includes('--dev');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// Order matters: later files may use names from earlier ones.
export const SIM_FILES = [
  'src/sim/core.js',      // the original valley simulation (minds, building, water)
  'src/sim/calendar.js',  // real calendar: dates and seasons
  'src/sim/life.js',      // ages, stages, births, passings, leaving downstream
  'src/sim/hooks.js',     // small patches that connect life and calendar to the core
  'src/sim/api.js',       // the surface used by the app, the worker and the tests
];
const VENDOR_FILES = ['src/vendor/three-r186.js'];
const VIEW_FILES = [
  'src/view/view.js',     // the original renderer, HUD and app
  'src/view/store.js',    // IndexedDB saves
  'src/view/catchup.js',  // long catch-ups in a Web Worker
  'src/view/dev.js',      // hidden developer menu
  'src/view/patches.js',  // small patches that connect the new parts to the view
  'src/view/boot.js',     // starts the app
];

const join = (files) => files.map((f) => `// ==== ${f} ====\n` + read(f)).join('\n');
const sim = join(SIM_FILES);

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

// The page: simulation, 3D library and view in one scope.
const main = await min(`(() => {\n${sim}\n${join(VENDOR_FILES)}\n${join(VIEW_FILES)}\n})();`);

const head = read('src/page-head.html');
const tail = read('src/page-tail.html');
const safe = (s) => s.replace(/<\/script/gi, '<\\/script');
const html =
  head +
  `<script id="creek-sim-src" type="text/plain">${safe(worker)}</script>\n` +
  `<script>${safe(main)}</script>` +
  tail;
fs.writeFileSync(path.join(root, 'dist/creekfolk.html'), html);
console.log(
  `dist/creekfolk.html ${(html.length / 1024).toFixed(0)} KB` +
    ` (sim ${(worker.length / 1024).toFixed(0)} KB, page script ${(main.length / 1024).toFixed(0)} KB)`,
);

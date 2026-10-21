// Build three.js r186 as one classic script for the pages: `var THREE = {...}`.
//
//   node tools/vendor-three.mjs     -> vendor/three-r186.js
//
// The game is one self-contained HTML file whose scripts share one scope, so three.js
// comes in as a plain script that defines THREE, built from npm three@0.186.0 (pinned in
// package.json) and kept in the repository so a build never needs the network. Run this
// only to change the three.js version; What the Water Brings' r128 copy is not used.
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/three/package.json'), 'utf8'));
if (pkg.version !== '0.186.0') throw new Error(`expected three 0.186.0, found ${pkg.version}`);

const r = await build({
  stdin: {
    contents: `export * from 'three';\nexport { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';\n`,
    resolveDir: root,
  },
  bundle: true,
  format: 'iife',
  globalName: 'THREE',
  minify: true,
  target: 'es2020',
  legalComments: 'none',
  write: false,
});
const out = `/* three.js r${pkg.version.split('.')[1]} (npm three@${pkg.version}), MIT License, Copyright 2010-2025 three.js authors */\n` + r.outputFiles[0].text;
fs.writeFileSync(path.join(root, 'vendor/three-r186.js'), out);
console.log(`vendor/three-r186.js ${(out.length / 1024).toFixed(0)} KB`);

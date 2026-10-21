// Build What the Water Brings twice, to compare three.js r128 with the r186 port of its renderer:
//
//   node tools/wtwb186/build.mjs
//     -> tools/wtwb186/out/r128/game.html   the original, exactly as WTWB's build.py makes it (three.js r128)
//     -> tools/wtwb186/out/r186/game.html   the same game on vendor/three-r186.js, with creekfolk2/src/look/*.js in place of WTWB's
//                                           core, toon, toon2, skin, king3, pixel3d, valley and life, and the rest of WTWB taken
//                                           from ref/ with the string replacements in patches.mjs (each must match exactly once)
//
// Nothing under ref/ is written. See creekfolk2/docs/R186-PORT.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PATCHES } from './patches.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');                       // creekfolk2/
const ref = path.join(root, 'ref', 'what-the-water-brings');
const look = path.join(root, 'src', 'look');
const out = path.join(here, 'out');
const LOOK = ['core.js', 'toon.js', 'toon2.js', 'skin.js', 'king3.js', 'pixel3d.js', 'valley.js', 'life.js'];

const read = (p) => fs.readFileSync(p, 'utf8');
// build.py: '\n'.join(the modules in ORDER), then the template with /*@@THREE@@*/ and /*@@GAME@@*/ replaced once each
// (a function as the replacement, so '$' in the scripts is taken literally, as Python's str.replace does)
function assemble(tmpl, three, game) {
  if (!tmpl.includes('/*@@THREE@@*/') || !tmpl.includes('/*@@GAME@@*/')) throw new Error('template markers missing');
  return tmpl.replace('/*@@THREE@@*/', () => three).replace('/*@@GAME@@*/', () => game);
}
const ORDER = read(path.join(ref, 'src', 'ORDER')).split('\n');

function patched(name, text) {
  for (const p of PATCHES.filter((q) => q.file === name)) {
    const n = text.split(p.find).length - 1;
    if (n !== 1) throw new Error(`patch for ${name} matches ${n} times (must be once): ${p.find.slice(0, 90)}`);
    text = text.replace(p.find, () => p.replace);
  }
  return text;
}
for (const p of PATCHES) if (p.file !== 'template.html' && !ORDER.includes(p.file)) throw new Error('patch for an unknown file ' + p.file);
for (const f of LOOK) if (PATCHES.some((p) => p.file === f)) throw new Error(f + ' comes from src/look and must not be patched here');

function write(rel, html) {
  const p = path.join(out, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, html);
  console.log(path.relative(root, p), Buffer.byteLength(html), 'bytes');
}

// (a) r128: exactly what build.py writes to out/game.html
const tmpl = read(path.join(ref, 'src', 'template.html'));
write('r128/game.html', assemble(tmpl, read(path.join(ref, 'vendor', 'three.min.js')), ORDER.map((n) => read(path.join(ref, 'src', n))).join('\n')));

// (b) r186
const game186 = ORDER.map((n) => (LOOK.includes(n) ? read(path.join(look, n)) : patched(n, read(path.join(ref, 'src', n))))).join('\n');
write('r186/game.html', assemble(patched('template.html', tmpl), read(path.join(root, 'vendor', 'three-r186.js')), game186));
console.log(`${PATCHES.length} patches applied; from src/look: ${LOOK.join(' ')}`);

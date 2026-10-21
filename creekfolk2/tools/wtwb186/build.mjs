// Build What the Water Brings twice, to compare three.js r128 with the r186 port of its renderer:
//
//   node tools/wtwb186/build.mjs
//     -> tools/wtwb186/out/r128/game.html   the original, exactly as WTWB's build.py makes it (three.js r128)
//     -> tools/wtwb186/out/r186/game.html   the same game on vendor/three-r186.js, with creekfolk2/src/look/*.js in place of WTWB's
//                                           core, toon, toon2, skin, king3, pixel3d, valley and life, and the rest of WTWB taken
//                                           from ref/ with the string replacements in patches.mjs (each must match exactly once)
//
// Nothing under ref/ is written. ablate.mjs uses build186() to make variants with one fix taken out. See creekfolk2/docs/R186-PORT.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PATCHES } from './patches.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');                       // creekfolk2/
const ref = path.join(root, 'ref', 'what-the-water-brings');
const look = path.join(root, 'src', 'look');
const out = path.join(here, 'out');
export const LOOK = ['core.js', 'toon.js', 'toon2.js', 'skin.js', 'king3.js', 'pixel3d.js', 'valley.js', 'life.js'];

const read = (p) => fs.readFileSync(p, 'utf8');
// build.py: '\n'.join(the modules in ORDER), then the template with /*@@THREE@@*/ and /*@@GAME@@*/ replaced once each
// (a function as the replacement, so '$' in the scripts is taken literally, as Python's str.replace does)
function assemble(tmpl, three, game) {
  if (!tmpl.includes('/*@@THREE@@*/') || !tmpl.includes('/*@@GAME@@*/')) throw new Error('template markers missing');
  return tmpl.replace('/*@@THREE@@*/', () => three).replace('/*@@GAME@@*/', () => game);
}
const ORDER = read(path.join(ref, 'src', 'ORDER')).split('\n');

// replace each [find, replace] in text, each find exactly once
export function replaceOnce(name, text, list) {
  for (const [find, rep] of list) {
    const n = text.split(find).length - 1;
    if (n !== 1) throw new Error(`replacement in ${name} matches ${n} times (must be once): ${find.slice(0, 90)}`);
    text = text.replace(find, () => rep);
  }
  return text;
}
const patched = (name, text, skip, edits = {}) => replaceOnce(name, replaceOnce(name, text, PATCHES.filter((q) => q.file === name && !skip.includes(q.id)).map((q) => [q.find, q.replace])), edits[name] || []);
for (const p of PATCHES) if (p.file !== 'template.html' && !ORDER.includes(p.file)) throw new Error('patch for an unknown file ' + p.file);
for (const f of LOOK) if (PATCHES.some((p) => p.file === f)) throw new Error(f + ' comes from src/look and must not be patched here');

function write(rel, html) {
  const p = path.join(out, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, html);
  console.log(path.relative(root, p), Buffer.byteLength(html), 'bytes');
}

// (a) r128: exactly what build.py writes to out/game.html
export function build128() {
  write('r128/game.html', assemble(read(path.join(ref, 'src', 'template.html')), read(path.join(ref, 'vendor', 'three.min.js')), ORDER.map((n) => read(path.join(ref, 'src', n))).join('\n')));
}
// (b) r186. o.name: the folder under out/ (r186); o.lookEdits: {file: [[find, replace], ...]} applied to the src/look modules;
// o.refEdits: the same for WTWB's other files and the template, after the patches; o.skip: ids of patches to leave out;
// o.naive: WTWB's own modules and no patches at all, only three.js swapped
export function build186(o = {}) {
  const skip = o.naive ? PATCHES.map((p) => p.id) : o.skip || [], edits = o.lookEdits || {}, refEdits = o.refEdits || {};
  for (const id of skip) if (!PATCHES.some((p) => p.id === id)) throw new Error('no patch ' + id);
  const mod = (n) => LOOK.includes(n) && !o.naive ? replaceOnce(n, read(path.join(look, n)), edits[n] || []) : patched(n, read(path.join(ref, 'src', n)), skip, refEdits);
  write((o.name || 'r186') + '/game.html', assemble(patched('template.html', read(path.join(ref, 'src', 'template.html')), skip, refEdits), read(path.join(root, 'vendor', 'three-r186.js')), ORDER.map(mod).join('\n')));
  if (!o.name) console.log(`${PATCHES.length} patches applied; from src/look: ${LOOK.join(' ')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) { build128(); build186(); }

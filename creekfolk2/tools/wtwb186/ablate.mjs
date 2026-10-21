// What each part of the port does: build the r186 game with one fix taken out (or an alternative tried), take a few of the
// shots with each, and compare every one with r128. (After build.mjs, which makes out/r128 and out/r186.)
//
//   node tools/wtwb186/ablate.mjs [variant ...]      -> tools/wtwb186/out/compare/ablate/<variant>/ and out/compare/ablate/summary.md
//   node tools/wtwb186/ablate.mjs --sheet-only [--sheet path.jpg]   only redraw out/compare/ablate/sheet.jpg from the shots taken
//
// The variants are below; each is a build186() option set (see build.mjs). The shots are a subset chosen to show each fix.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { build186 } from './build.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const node = (script, args) => execFileSync(process.execPath, [path.join(here, script), ...args], { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8', maxBuffer: 1 << 26 });
const SHOTS = ['01-start-morning', '07-trestle-night', '09-storm', '11-mist', 'x02-carry-bottle', 'x03-hold-icosa', 'x07-cave-ending', 'e4-night'];
const pixelTarget = [["rt.texture.colorSpace = THREE.SRGBColorSpace;", ''], ['src.rgb = toSRGB(src.rgb);', '']];
export const VARIANTS = {
  'r186': { about: 'the port as it is', build: null },
  'naive': { about: 'three.js r186 swapped in, nothing else changed (WTWB\'s own modules, no patches)', build: { naive: true } },
  'no-opaque-chunk-fix': { about: 'rampMat replaces the r128 line again (not found in r186: the palette ramp is off)',
    build: { lookEdits: { 'toon.js': [["sh.fragmentShader.replace('#include <opaque_fragment>', body.join('\\n'))", "sh.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', body.join('\\n'))"]] } } },
  'colour-management-on': { about: 'r186\'s colour management left on (main.js\'s hex colours: the lights, halo, mist, become linear)', build: { skip: ['colour-management-off'] } },
  'double-linear': { about: 'colour management on and the r128 colour helpers (Color(hex).convertSRGBToLinear(): converted twice)',
    build: { skip: ['colour-management-off'], lookEdits: {
      'core.js': [["C.col = function (hex) { var c = new THREE.Color(); if (typeof hex === 'number') c.setHex(hex, THREE.LinearSRGBColorSpace); else c.setStyle(hex, THREE.LinearSRGBColorSpace); return c.convertSRGBToLinear(); };", 'C.col = function (hex) { return new THREE.Color(hex).convertSRGBToLinear(); };']],
      'king3.js': [['function col(hex) { return C.col(hex); }', 'function col(hex) { return new THREE.Color(hex).convertSRGBToLinear(); }']],
      'valley.js': [["EARTH = global.PKCore.col('#3a2c20');", "EARTH = new THREE.Color('#3a2c20').convertSRGBToLinear();"]] } } },
  'no-light-units': { about: 'light intensities as in WTWB (not x PI)', build: { skip: ['light-units', 'light-units-day', 'light-units-icons'] } },
  'linear-target': { about: 'the scene target left linear (r186 writes linear light into it; the pass compares that with the sRGB palette)', build: { lookEdits: { 'pixel3d.js': pixelTarget } } },
  'no-keep-alpha': { about: 'the MeshBasic halo, mist and cave shadows without PKPixel3D.keepAlpha (alpha forced to 1)', build: { skip: ['alpha-halo', 'alpha-mist', 'alpha-cave-shadows', 'alpha-easy-disc'] } },
  'no-instance-sphere': { about: 'instanced plants without the tile\'s culling sphere', build: { lookEdits: { 'valley.js': [['      im.boundingSphere = g.boundingSphere;\n', '']] } } },
  'srgb-in-shader': { about: 'alternative to the sRGB target: a plain target, and every material encodes to sRGB in its shader as r128 did (global chunk override)',
    build: { lookEdits: { 'pixel3d.js': pixelTarget }, refEdits: { 'template.html': [['THREE.ColorManagement.enabled = false;</script>', "THREE.ColorManagement.enabled = false; THREE.ShaderChunk.colorspace_fragment = 'gl_FragColor = sRGBTransferOETF( gl_FragColor );';</script>"]] } } },
  'lf-nudge': { about: 'probe, not a fix: the toon light factor Lf times 1.000001 (how many pixels sit on a tone threshold)',
    build: { lookEdits: { 'toon.js': [["'float Lf = dot( outgoingLight, vec3( 0.299, 0.587, 0.114 ) );',", "'float Lf = dot( outgoingLight, vec3( 0.299, 0.587, 0.114 ) ) * 1.000001;',"]] } } },
};

const argv = process.argv.slice(2), sheetOnly = argv.includes('--sheet-only'), sheetTo = argv.includes('--sheet') ? argv[argv.indexOf('--sheet') + 1] : null;
const names = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--sheet').length ? argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--sheet') : Object.keys(VARIANTS);
const buildOf = (n) => (VARIANTS[n].build ? 'ablate-' + n : 'r186');

// a contact sheet: r128 on the first row, then one row per variant, a few of the views each, with the share of pixels that differ
const SHEET = ['01-start-morning', '07-trestle-night', '11-mist', 'x07-cave-ending', 'e4-night'];
async function drawSheet() {
  const shots = path.join(here, 'out', 'shots', 'ablate'), rows = [['r128', 'r128', 'three.js r128 (the original)']].concat(names.map((n) => [n, buildOf(n), VARIANTS[n].about]));
  const data = rows.map(([n, b]) => SHEET.map((s) => { const p = path.join(shots, b, s + '.png'); return fs.existsSync(p) ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : null; }));
  const nums = rows.map(([n, b]) => { const p = path.join(here, 'out', 'compare', 'ablate', b, 'results.json'); if (n === 'r128' || !fs.existsSync(p)) return {}; return Object.fromEntries(JSON.parse(fs.readFileSync(p, 'utf8')).map((r) => [r.name, r.pixelsDifferShare])); });
  const browser = await chromium.launch(), pg = await browser.newPage();
  await pg.route('**/*', (r) => (r.request().url().startsWith('data:') ? r.continue() : r.abort()));
  const jpg = await pg.evaluate(async ({ rows, data, nums, SHEET }) => {
    const tw = 224, th = 126, lw = 190, lab = 16, c = document.createElement('canvas'); c.width = lw + SHEET.length * (tw + 4); c.height = 24 + rows.length * (th + lab + 6);
    const g = c.getContext('2d'); g.fillStyle = '#f4f1ea'; g.fillRect(0, 0, c.width, c.height); g.fillStyle = '#222'; g.font = 'bold 14px sans-serif';
    g.fillText('What each part of the port does: r186 with one fix taken out, against r128 (share of pixels that differ)', 6, 17);
    for (let r = 0; r < rows.length; r++) {
      const y = 24 + r * (th + lab + 6); g.fillStyle = '#222'; g.font = 'bold 13px sans-serif'; g.fillText(rows[r][0], 6, y + lab + 14);
      g.font = '11px sans-serif'; const words = rows[r][2].split(' '); let line = '', ly = y + lab + 30;
      for (const w of words) { if (g.measureText(line + w).width > lw - 12) { g.fillText(line, 6, ly); ly += 13; line = ''; } line += w + ' '; } g.fillText(line, 6, ly);
      for (let k = 0; k < SHEET.length; k++) {
        const x = lw + k * (tw + 4); g.font = '11px sans-serif'; g.fillStyle = '#222';
        g.fillText(r === 0 ? SHEET[k] : (nums[r][SHEET[k]] != null ? nums[r][SHEET[k]] + '% differ' : ''), x + 2, y + 12);
        if (!data[r][k]) continue; const im = new Image(); im.src = data[r][k]; await im.decode(); g.drawImage(im, x, y + lab, tw, th);
      }
    }
    return c.toDataURL('image/jpeg', 0.8);
  }, { rows, data, nums, SHEET });
  await browser.close();
  const buf = Buffer.from(jpg.split(',')[1], 'base64'), out = path.join(here, 'out', 'compare', 'ablate', 'sheet.jpg');
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, buf); if (sheetTo) fs.writeFileSync(sheetTo, buf);
  console.log('ablate sheet', buf.length, 'bytes');
}
if (sheetOnly) { await drawSheet(); process.exit(0); }
for (const n of names) { if (!VARIANTS[n]) throw new Error('no variant ' + n); if (VARIANTS[n].build) build186({ name: 'ablate-' + n, ...VARIANTS[n].build }); }
const builds = ['r128', ...names.map(buildOf)];
console.log(node('shots.mjs', ['--set', 'ablate', '--builds', builds.join(','), '--only', SHOTS.join(',')]).split('\n').filter((l) => /PAGEERROR|error:(?! Failed to load resource)/.test(l)).join('\n'));
const rows = [];
for (const n of names) {
  const b = buildOf(n);
  node('compare.mjs', ['--set', 'ablate', '--b', b]);
  const res = JSON.parse(fs.readFileSync(path.join(here, 'out', 'compare', 'ablate', b, 'results.json'), 'utf8'));
  rows.push([n, VARIANTS[n].about, Object.fromEntries(res.map((r) => [r.name, r]))]);
  console.log(n.padEnd(22), res.map((r) => r.name.slice(0, 3) + ' ' + r.pixelsDifferShare + '%').join('  '));
}
const md = ['| variant | ' + SHOTS.join(' | ') + ' |', '|---|' + SHOTS.map(() => '---:').join('|') + '|']
  .concat(rows.map(([n, , r]) => `| ${n} | ` + SHOTS.map((s) => (r[s] ? r[s].pixelsDifferShare + '%' : '-')).join(' | ') + ' |'))
  .concat(['', 'Share of pixels that differ from r128.', ''], rows.map(([n, about]) => `- ${n}: ${about}`));
fs.writeFileSync(path.join(here, 'out', 'compare', 'ablate', 'summary.md'), md.join('\n') + '\n');
console.log(md.join('\n'));
await drawSheet();

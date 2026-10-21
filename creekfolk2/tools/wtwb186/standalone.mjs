// The src/look modules on their own: a page with three.js r186 and only those eight files (none of WTWB's other code), which
// builds the valley, the creatures and the Sheet king on the rig, draws them through PKPixel3D, and checks:
//   1. every pixel is a palette colour (the palette ramp and the snap both work: with grading, haze and sky kept out of the picture)
//   2. the same picture with the palette padded to 900 colours (setPalette; far past WebGL 2's 224 guaranteed uniform vectors)
//   3. a MeshBasicMaterial glow given PKPixel3D.keepAlpha keeps its tag (no outline round it), and loses it without (outlined)
//
//   node tools/wtwb186/standalone.mjs   -> tools/wtwb186/out/standalone/page.html, look.png
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { LOOK } from './build.mjs';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '..', '..'), dir = path.join(here, 'out', 'standalone');
const order = ['core.js', 'skin.js', 'king3.js', 'toon.js', 'toon2.js', 'pixel3d.js', 'valley.js', 'life.js'];
if (order.slice().sort().join() !== LOOK.slice().sort().join()) throw new Error('module list out of date');

// the page's own code: what a new page needs to set up (see "How to use these modules" in docs/R186-PORT.md)
function main() {
  const W = 640, H = 400, canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
  renderer.setSize(W, H, false); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.BasicShadowMap;
  const scene = new THREE.Scene();
  const world = PKValley.create({ detail: 2 }); scene.add(world.group);
  const at = world.spots.start; world.ensure(at[0], at[1]);
  PKValleyLife.create(world, scene);
  const V = PKToon2.variant('A'), king = PhilosopherKing.createRig({ dims: V.DIMS, rest: V.REST });
  PKToon2.build(king, 'A', { detail: 3, merge: true });
  king.root.traverse((o) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; if (/^Toon2?_/.test(o.material.name || '')) o.material.opacity = 0.875; } });
  const y = world.height(at[0], at[1]); king.root.position.set(at[0], y, at[1]); scene.add(king.root);
  king.play('walk', 0); king.mixer.update(0.4);
  // a lantern-like glow: tagged 0.25 (shines: no ink, not graded) through keepAlpha
  const glow = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshBasicMaterial({ color: '#fff0b0', opacity: 0.25 }));
  PKPixel3D.keepAlpha(glow.material); glow.position.set(at[0] + 1.2, y + 0.6, at[1] + 0.4); scene.add(glow);
  // lights in r186's physical units: WTWB's intensities times PI
  scene.add(new THREE.HemisphereLight(new THREE.Color().setHex(0xfffaf2, THREE.LinearSRGBColorSpace), new THREE.Color().setHex(0xe4dccb, THREE.LinearSRGBColorSpace), 0.45 * Math.PI));
  const sun = new THREE.DirectionalLight(new THREE.Color().setHex(0xfff6e8, THREE.LinearSRGBColorSpace), 0.83 * Math.PI);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.002; Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 0.5, far: 60 });
  sun.position.set(at[0] - 6, y + 14, at[1] + 6); sun.target.position.set(at[0], y, at[1]); scene.add(sun, sun.target);
  // the palette: the outline ink first, then every designed colour
  const seen = {}, pal = [PKToon.P.ink].concat(Object.values(PKToon.P), PKToon2.extraPalette, PKValley.palette()).filter((c) => { c = c.toLowerCase(); return seen[c] ? false : (seen[c] = 1); });
  const px = PKPixel3D.create(renderer, { palette: pal, snapLow: true, softInk: true });
  const cam = new THREE.OrthographicCamera(-1, 1, 3.5, -3.5, 0.5, 90);
  px.setSize(W, H, 2, cam); px.setFX({ selOut: 1, ao: [1, 0.32] });
  cam.position.set(at[0] + 18, y + 34, at[1] + 22); cam.lookAt(at[0], y + 0.9, at[1]); cam.updateMatrixWorld();
  const read = () => { px.render(scene, cam); const g = renderer.getContext(), d = new Uint8Array(W * H * 4); g.readPixels(0, 0, W, H, g.RGBA, g.UNSIGNED_BYTE, d); return d; };
  const hex = (d, i) => '#' + [d[i], d[i + 1], d[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('');
  const a = read(), inPal = new Set(pal.map((c) => c.toLowerCase()));
  let off = 0, n = 0; const cols = new Set();
  for (let i = 0; i < a.length; i += 4) { n++; const h = hex(a, i); cols.add(h); if (!inPal.has(h)) off++; }
  const shot = canvas.toDataURL('image/png');
  px.setPalette(pal.concat(Array.from({ length: 900 - pal.length }, (_, i) => pal[1 + (i % (pal.length - 1))])));
  const b = read(); let same = 0; for (let i = 0; i < a.length; i++) if (a[i] === b[i]) same++;
  // the glow's tag: with keepAlpha its rim gets no ink; render it again without the tag (a fresh material, alpha forced to 1)
  px.setPalette(pal);
  const p = new THREE.Vector3().copy(glow.position).project(cam), gx = Math.round((p.x * 0.5 + 0.5) * W), gy = Math.round((p.y * 0.5 + 0.5) * H);
  // (with coloured outlines on, a rim is drawn in a darker shade of the shape: count the pixels round the glow that change, and
  // whether they get darker)
  const box = (d) => { const o = []; for (let x = gx - 14; x <= gx + 14; x++) for (let yy = gy - 14; yy <= gy + 14; yy++) { const i = (yy * W + x) * 4; o.push(d[i] + d[i + 1] + d[i + 2]); } return o; };
  const tagged = box(read());
  glow.material = new THREE.MeshBasicMaterial({ color: '#fff0b0', opacity: 0.25 }); const plain = box(read());
  let changed = 0, darker = 0; tagged.forEach((v, i) => { if (v !== plain[i]) { changed++; if (plain[i] < v) darker++; } });
  return { pixels: n, colours: cols.size, palette: pal.length, notInPalette: off, sameWith900: same === a.length, glowPixelsChangedWithoutTag: changed, ofThemDarker: darker, png: shot };
}

const parts = ['<!doctype html><html><head><meta charset=utf8><title>src/look on r186</title></head><body style="margin:0;background:#222"><canvas id="c" width="640" height="400"></canvas>',
  '<script>' + fs.readFileSync(path.join(root, 'vendor', 'three-r186.js'), 'utf8') + '</script>']
  .concat(order.map((f) => '<script>' + fs.readFileSync(path.join(root, 'src', 'look', f), 'utf8') + '</script>'))
  .concat(['<script>window.TEST = ' + main.toString() + ';</script></body></html>']);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'page.html'), parts.join('\n'));

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await browser.newPage();
const logs = []; pg.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.text()); }); pg.on('pageerror', (e) => logs.push('PAGEERROR ' + e.message));
await pg.route('**/*', (r) => (r.request().url().startsWith('file:') ? r.continue() : r.abort()));
await pg.goto('file://' + path.join(dir, 'page.html'));
const r = await pg.evaluate('TEST()');
fs.writeFileSync(path.join(dir, 'look.png'), Buffer.from(r.png.split(',')[1], 'base64')); delete r.png;
await browser.close();
console.log(JSON.stringify(r, null, 1)); for (const l of logs) console.log('  ', l.slice(0, 200));
const ok = r.notInPalette === 0 && r.sameWith900 && r.glowPixelsChangedWithoutTag > 10 && r.ofThemDarker === r.glowPixelsChangedWithoutTag && !logs.some((l) => /PAGEERROR/.test(l));
console.log(ok ? 'standalone: all checks pass' : 'standalone: CHECK FAILED'); process.exit(ok ? 0 : 1);

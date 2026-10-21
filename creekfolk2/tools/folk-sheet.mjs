// A contact sheet of close-up creekfolk: coats, faces and things to wear, through the pixel pass,
// for judging the 3D creekfolk without the valley.
//
//   node tools/build.mjs --dev && node tools/folk-sheet.mjs runs/folk.png
import { chromium } from 'playwright';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = process.argv[2] || path.join(root, 'runs/folk.png');
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await browser.newPage({ viewport: { width: 1200, height: 640 } });
const errs = [];
p.on('pageerror', (e) => errs.push(String(e)));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await p.route('**/*', (r) => (/^(file|blob|data):/.test(r.request().url()) ? r.continue() : r.abort()));
await p.goto('file://' + path.join(root, 'dist/creekfolk2-dev.html'));
await p.waitForFunction(() => window.__cf2 && window.__cf2.art);
await p.evaluate(() => {
  const A = window.__cf2.art,
    THREE = window.THREE,
    cv = document.createElement('canvas');
  cv.width = 1200;
  cv.height = 640;
  Object.assign(cv.style, { position: 'fixed', left: 0, top: 0, zIndex: 99999 });
  document.body.appendChild(cv);
  const r = new THREE.WebGLRenderer({ canvas: cv, antialias: false });
  A.cf2PrepareRenderer(r);
  r.shadowMap.enabled = true;
  const scene = new THREE.Scene(),
    hemi = new THREE.HemisphereLight(0xfffaf2, 0xe4dccb, 0.45 * A.CF2_LIGHT),
    sun = new THREE.DirectionalLight(0xfff6e8, 0.83 * A.CF2_LIGHT);
  sun.position.set(-3, 8, 6);
  sun.castShadow = true;
  scene.add(hemi, sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40).rotateX(-Math.PI / 2), A.PKToon.rampMat('#557f48', '#6e9c5b', '#8fb86f'));
  ground.receiveShadow = true;
  scene.add(ground);
  const pats = ['none', 'stripes', 'saddle', 'patches', 'spots'],
    faces = ['none', 'mask', 'blaze'],
    wears = [null, 'lilypad', 'sunhat', 'apron', 'satchel', 'bells', 'scarf', 'flower'];
  const models = [];
  for (let k = 0; k < 16; k++) {
    const look = { fur: (k * 5 + 3) % 24, pat: pats[k % 5], pale: k % 2, face: faces[k % 3], socks: k % 4 === 0 ? 1 : 0, dye: k % 8, belly: k % 3 === 0 ? 0.8 : 0.4, ear: 1, tail: k % 3 },
      acts = ['idle', 'labor', 'chat', 'sleep', 'play', 'eat', 'groom', 'call', 'idle', 'idle', 'watch', 'labor', 'idle', 'sit', 'play', 'idle'],
      c = { id: k + 1, stage: k === 14 ? 'child' : k === 15 ? 'elder' : 'adult', look, wear: wears[k % 8], line: [k + 1, k + 2], act: { type: acts[k] }, carry: k === 8 ? { k: 'branch' } : k === 9 ? { k: 'stone' } : k === 12 ? { k: 'reeds' } : null },
      m = A.Folk3D.build(c, null);
    A.Folk3D.pose(m, c, { x: (k % 8) * 1.1 - 3.85, y: 0, z: k < 8 ? -1.5 : 0.9, face: k % 2 ? 0.5 : -0.3, walking: false, dt: 0.01, clock: 0.6 });
    scene.add(m.root);
    models.push(m);
  }
  const cam = new THREE.OrthographicCamera(-4.7, 4.7, 2.5, -2.5, 0.1, 100);
  cam.position.set(0, 4.2, 9);
  cam.lookAt(0, 0.55, 0);
  const pal = [A.PKToon.P.ink].concat(A.spritePalette(), A.folkPalette(), ['#557f48', '#6e9c5b', '#8fb86f']);
  const px = A.PKPixel3D.create(r, { palette: pal, snapLow: true, softInk: true, lut: true });
  px.setSize(1200, 640, 2, cam);
  px.setFX({ ao: [1.0, 0.32], selOut: 1, dcell: 2, sat: 1 });
  px.render(scene, cam);
});
await p.waitForTimeout(500);
await p.screenshot({ path: out });
console.log(out, errs.length ? 'errors: ' + errs.slice(0, 5).join(' | ') : 'no errors');
await browser.close();

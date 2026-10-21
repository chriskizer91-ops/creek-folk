// A contact sheet of creekfolk sprites: every coat, face and thing to wear, in a few furs and
// dyes, blown up so each art pixel shows. For judging the sprite art without the valley.
//
//   node tools/build.mjs --dev && node tools/sprite-sheet.mjs runs/sprites.png
import { chromium } from 'playwright';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = process.argv[2] || path.join(root, 'runs/sprites.png');
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await p.route('**/*', (r) => (/^(file|blob|data):/.test(r.request().url()) ? r.continue() : r.abort()));
await p.goto('file://' + path.join(root, 'dist/creekfolk2-dev.html'));
await p.waitForFunction(() => window.__cf2 && window.__cf2.art);
await p.evaluate(() => {
  const A = window.__cf2.art,
    S = 5,
    cv = document.createElement('canvas');
  cv.width = 1400;
  cv.height = 1000;
  Object.assign(cv.style, { position: 'fixed', left: 0, top: 0, zIndex: 99999, background: '#7a9a62', imageRendering: 'pixelated' });
  document.body.appendChild(cv);
  const g = cv.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.fillStyle = '#7a9a62';
  g.fillRect(0, 0, cv.width, cv.height);
  const pats = ['none', 'stripes', 'saddle', 'patches', 'spots'],
    faces = ['none', 'mask', 'blaze'],
    wears = [null, 'lilypad', 'sunhat', 'apron', 'satchel', 'bells', 'scarf', 'flower'];
  let id = 1,
    x = 10,
    y = 10;
  const draw = (c, label) => {
    const sh = A.creekSprites(c);
    for (const [i, dir] of ['down', 'right', 'up'].entries()) {
      const f = sh.frames[dir][0];
      g.drawImage(sh.canvas, f.x, f.y, sh.w, sh.h, x + i * (sh.w * S + 4), y, sh.w * S, sh.h * S);
    }
    g.fillStyle = '#10140e';
    g.font = '11px sans-serif';
    g.fillText(label, x, y + 18 * S + 12);
    x += 3 * (16 * S + 4) + 14;
    if (x > 1400 - 3 * (16 * S + 4)) (x = 10), (y += 18 * S + 22);
  };
  for (let k = 0; k < 15; k++) {
    const look = { fur: (k * 5) % 24, pat: pats[k % 5], pale: k % 2, face: faces[k % 3], socks: k % 4 === 0 ? 1 : 0, dye: k % 8, belly: k % 3 === 0 ? 0.8 : 0.4 };
    draw({ id: id++, stage: k === 13 ? 'child' : k === 14 ? 'elder' : 'adult', look, wear: wears[k % 8], line: [k + 1, k + 2] }, `${look.pat} ${look.pale ? 'pale' : 'dark'} / ${look.face} / ${wears[k % 8] || '-'}${look.socks ? ' / socks' : ''}`);
  }
});
await p.screenshot({ path: out });
console.log(out);
await browser.close();

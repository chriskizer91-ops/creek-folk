// Compare the r128 and r186 pictures pair by pair (after shots.mjs):
//
//   node tools/wtwb186/compare.mjs [--set all] [--a r128] [--b r186] [--sheet path.jpg] [--thumb 320] [--quality 0.84]
//   (results in out/compare/<set>/<b>/)
//     -> .../<name>-pair.png          a (r128) on the left, b (r186) on the right
//     -> .../<name>-diff.png          where they differ: red by more than 24 (of 255) in some channel, orange by less,
//                                     the r128 picture dimmed where they are the same
//     -> .../sheet.jpg                 a contact sheet of every pair with its numbers (also to --sheet if given)
//     -> .../results.json, results.md
// The numbers per pair: mean absolute difference over R, G and B (0-255), the share of pixels that differ at all, and the share
// that differ by more than 24 in some channel. The images are decoded and drawn in a headless page's canvas (no network).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const arg = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const sheetArg = arg('--sheet', null), set = arg('--set', 'all'), an = arg('--a', 'r128'), bn = arg('--b', 'r186'), thumb = +arg('--thumb', 320), quality = +arg('--quality', 0.84);
const A = path.join(here, 'out', 'shots', set, an), B = path.join(here, 'out', 'shots', set, bn), O = path.join(here, 'out', 'compare', set, bn);
fs.mkdirSync(O, { recursive: true });
const names = fs.readdirSync(A).filter((f) => f.endsWith('.png') && fs.existsSync(path.join(B, f))).map((f) => f.slice(0, -4)).sort();
if (!names.length) throw new Error('no pairs: run shots.mjs first');
const url = (p) => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
const BIG = 24;

const browser = await chromium.launch();
const pg = await browser.newPage();
await pg.route('**/*', (r) => (r.request().url().startsWith('data:') ? r.continue() : r.abort()));
await pg.setContent('<!doctype html><body></body>');
const results = [];
for (const n of names) {
  const r = await pg.evaluate(async ({ a, b, BIG }) => {
    const load = (u) => new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = u; });
    const [ia, ib] = [await load(a), await load(b)], w = ia.width, h = ia.height;
    const cv = (cw, ch) => { const c = document.createElement('canvas'); c.width = cw; c.height = ch; return c; };
    const px = (im) => { const c = cv(w, h), g = c.getContext('2d'); g.drawImage(im, 0, 0); return g.getImageData(0, 0, w, h); };
    const da = px(ia), db = px(ib), d = cv(w, h), gd = d.getContext('2d'), out = gd.createImageData(w, h);
    let sum = 0, any = 0, big = 0, x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let i = 0; i < w * h; i++) {
      const k = i * 4, dr = Math.abs(da.data[k] - db.data[k]), dg = Math.abs(da.data[k + 1] - db.data[k + 1]), dbb = Math.abs(da.data[k + 2] - db.data[k + 2]), m = Math.max(dr, dg, dbb);
      sum += dr + dg + dbb; if (m > 0) { any++; const x = i % w, y = (i / w) | 0; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } if (m > BIG) big++;
      const L = (da.data[k] * 0.3 + da.data[k + 1] * 0.59 + da.data[k + 2] * 0.11) * 0.35 + 20;
      const c = m > BIG ? [255, 40, 40] : m > 0 ? [255, 170, 0] : [L, L, L];
      out.data[k] = c[0]; out.data[k + 1] = c[1]; out.data[k + 2] = c[2]; out.data[k + 3] = 255;
    }
    gd.putImageData(out, 0, 0);
    const p = cv(w * 2, h), gp = p.getContext('2d'); gp.drawImage(ia, 0, 0); gp.drawImage(ib, w, 0);
    window.__pairs = window.__pairs || []; window.__pairs.push([ia, ib, d]);
    return { w, h, mad: sum / (w * h * 3), n: any, any: any / (w * h), big: big / (w * h), box: any ? [x0, y0, x1, y1] : null, pair: p.toDataURL('image/png'), diff: d.toDataURL('image/png') };
  }, { a: url(path.join(A, n + '.png')), b: url(path.join(B, n + '.png')), BIG });
  fs.writeFileSync(path.join(O, n + '-pair.png'), Buffer.from(r.pair.split(',')[1], 'base64'));
  fs.writeFileSync(path.join(O, n + '-diff.png'), Buffer.from(r.diff.split(',')[1], 'base64'));
  const row = { name: n, size: r.w + 'x' + r.h, meanAbsDiff: +r.mad.toPrecision(3), pixelsDiffer: r.n, pixelsDifferShare: +(100 * r.any).toPrecision(3), pixelsDifferOver24Share: +(100 * r.big).toPrecision(3), where: r.box };
  results.push(row);
  console.log(n.padEnd(22), 'mean |d|', String(row.meanAbsDiff).padStart(9), '  pixels that differ', String(row.pixelsDiffer).padStart(7), ('(' + row.pixelsDifferShare + '%)').padStart(10), '  by >24', (row.pixelsDifferOver24Share + '%').padStart(8), r.box ? '  in x ' + r.box[0] + '-' + r.box[2] + ', y ' + r.box[1] + '-' + r.box[3] : '');
}
// the contact sheet: two pairs to a row, each as r128 | r186 | where they differ, with its numbers
const sheet = await pg.evaluate(({ results, an, bn, thumb, quality }) => {
  const P = window.__pairs, tw = thumb, th = Math.round(thumb * 9 / 16), lab = 22, per = 2, cols = per * 3, rows = Math.ceil(P.length / per);
  const c = document.createElement('canvas'); c.width = cols * tw + (per - 1) * 12; c.height = rows * (th + lab) + 28; const g = c.getContext('2d');
  g.fillStyle = '#f4f1ea'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = true;
  g.fillStyle = '#222'; g.font = 'bold 15px sans-serif'; g.fillText('What the Water Brings: ' + an + ' (left) | ' + bn + ' (middle) | where they differ (red > 24 of 255, orange less; boxed)', 8, 19);
  P.forEach((pr, i) => {
    const x0 = (i % per) * (3 * tw + 12), y0 = 28 + Math.floor(i / per) * (th + lab), r = results[i];
    g.fillStyle = '#222'; g.font = '13px sans-serif';
    g.fillText(r.name + '   mean |d| ' + r.meanAbsDiff + '   pixels that differ ' + r.pixelsDiffer + ' (' + r.pixelsDifferShare + '%)', x0 + 4, y0 + 15);
    const w = pr[0].width, h = pr[0].height, s = Math.min(tw / w, th / h), dx = (tw - w * s) / 2, dy = (th - h * s) / 2;
    pr.forEach((im, k) => g.drawImage(im, x0 + k * tw + dx, y0 + lab + dy, w * s, h * s));
    // a few differing pixels vanish at this size: box where they are
    if (r.where) { const b = r.where; g.strokeStyle = '#ff2020'; g.lineWidth = 2; g.strokeRect(x0 + 2 * tw + dx + b[0] * s - 4, y0 + lab + dy + b[1] * s - 4, (b[2] - b[0] + 1) * s + 8, (b[3] - b[1] + 1) * s + 8); }
  });
  return c.toDataURL('image/jpeg', quality);
}, { results, an, bn, thumb, quality });
const jpg = Buffer.from(sheet.split(',')[1], 'base64');
fs.writeFileSync(path.join(O, 'sheet.jpg'), jpg);
if (sheetArg) { fs.mkdirSync(path.dirname(path.resolve(sheetArg)), { recursive: true }); fs.writeFileSync(sheetArg, jpg); }
console.log('sheet.jpg', jpg.length, 'bytes');
await browser.close();
fs.writeFileSync(path.join(O, 'results.json'), JSON.stringify(results, null, 1));
const md = ['| pair | size | mean abs diff (0-255) | pixels that differ | share | share by > 24 |', '|---|---|---:|---:|---:|---:|']
  .concat(results.map((r) => `| ${r.name} | ${r.size} | ${r.meanAbsDiff} | ${r.pixelsDiffer} | ${r.pixelsDifferShare}% | ${r.pixelsDifferOver24Share}% |`));
fs.writeFileSync(path.join(O, 'results.md'), md.join('\n') + '\n');

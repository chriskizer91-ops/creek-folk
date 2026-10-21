// Catch-up benchmark in the browser: open a saved valley in the dev build, then replay N days
// in the worker, the same code path as a real absence. Prints the time, the speed, and what
// 30 days would take on this machine.
//
//   node tools/build.mjs && node tools/bench-browser.mjs runs/month/cf2-1-day15.json [days=30]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const saveFile = process.argv[2],
  days = +(process.argv[3] || 30);
if (!saveFile) throw new Error('usage: bench-browser.mjs <save.json> [days]');
const text = fs.readFileSync(saveFile, 'utf8'),
  meta = JSON.parse(text);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1000, height: 700 } });
await ctx.route('**/*', (r) => (/^(file|blob|data):/.test(r.request().url()) ? r.continue() : r.abort()));
const p = await ctx.newPage();
p.on('pageerror', (e) => console.log('page error', String(e)));
await p.goto('file://' + path.join(root, 'dist/creekfolk2-dev.html'));
await p.waitForTimeout(1200);
// the dev clock first, so the saved valley's own moment is "now" (else it would wait for the clock)
await p.evaluate(([cal, t]) => {
  const a = window.__cf2;
  a.Clock.setDev(cal + t * 1000 - Date.now() - a.Clock.fix);
  a.setClock();
}, [meta.calStart, meta.t]);
if (await p.isVisible('#vStart')) {
  await p.evaluate((t) => window.__cf2.post({ type: 'import', text: t }), text);
} else await p.evaluate((t) => window.__cf2.post({ type: 'import', text: t }), text);
await p.waitForFunction((t) => window.__cf2.vw.ready && window.__cf2.vw.seed && Math.abs(window.__cf2.vw.t - t) < 60, meta.t, { timeout: 60000 });
const n = await p.evaluate(() => [...window.__cf2.vw.cs.values()].filter((c) => !c.visitor && !c.away).length);
console.log(`${path.basename(saveFile)}: day ${(meta.t / 86400).toFixed(1)}, ${n} creekfolk; replaying ${days} days in the worker...`);
const wall = Date.now();
await p.evaluate((d) => {
  const a = window.__cf2;
  a.dev.jumping = { span: d * 86400, from: a.vw.t };
  a.Clock.setDev(a.Clock.dev + d * 86400 * 1000);
  a.setClock(true);
}, days);
let last = 0;
for (;;) {
  await p.waitForTimeout(5000);
  const s = await p.evaluate(() => ({ t: window.__cf2.vw.t, c: window.__cf2.catching }));
  const at = s.c ? s.c.t : s.t;
  if (Date.now() - last > 60000) (last = Date.now()), console.log(`  ${((Date.now() - wall) / 60000).toFixed(1)} min: day ${(at / 86400).toFixed(2)}`);
  if (!s.c && s.t >= meta.t + days * 86400 - 60) break;
}
const sec = (Date.now() - wall) / 1000;
const n2 = await p.evaluate(() => [...window.__cf2.vw.cs.values()].filter((c) => !c.visitor && !c.away).length);
const rate = (days * 86400) / sec;
console.log(`${days} days in ${(sec / 60).toFixed(1)} min (${Math.round(rate)}x real time); ${n} creekfolk at the start, ${n2} at the end; 30 days would take about ${((30 * 86400) / rate / 60).toFixed(1)} min here.`);
await browser.close();

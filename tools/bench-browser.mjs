// Catch-up benchmark in a real browser: load a saved valley, jump N days through the
// developer menu (replayed in full in the Web Worker), and time it.
//   node tools/bench-browser.mjs runs/worlds/year-1-day150.json 30
import { chromium } from 'playwright';
import fs from 'node:fs';
const [file, daysArg] = process.argv.slice(2);
const days = +(daysArg || 30);
const save = fs.readFileSync(file, 'utf8');
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const logs = [];
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`[${m.type()}] ${m.text()}`); });
await page.goto('file://' + process.cwd() + '/dist/creekfolk.html');
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 30000 });
await page.evaluate(async (s) => {
  const w = JSON.parse(s);
  w.realStart = Date.now() - w.t * 1000; w.skip = 0;
  await window.__creek.store.put('main', JSON.stringify(w));
}, save);
await page.reload();
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 60000 });
await page.waitForTimeout(2000);
const before = await page.evaluate(() => ({ day: +(__creek.world.t / 86400).toFixed(2), pop: __creek.world.creatures.length }));
console.log('loaded', before);
await page.screenshot({ path: 'shots/bench-before.png' });
const t0 = Date.now();
await page.evaluate((d) => __creek.dev.jump(d * 86400e3), days);
for (;;) {
  await page.waitForTimeout(2000);
  const st = await page.evaluate(() => ({ c: !!__creek.catching, t: __creek.world.t }));
  if (!st.c && st.t >= (before.day + days - 0.01) * 86400) break;
  if (Date.now() - t0 > 60 * 60e3) { console.log('timeout'); break; }
}
const secs = (Date.now() - t0) / 1000;
const after = await page.evaluate(() => { const w = __creek.world; return { day: +(w.t / 86400).toFixed(2), pop: w.creatures.length, errors: w.stats.errors || 0 }; });
console.log(`${days} days caught up in ${(secs / 60).toFixed(1)} min (${Math.round(days * 86400 / secs).toLocaleString()}x real time)`, after);
await page.evaluate(() => document.querySelectorAll('[data-go], .summary button').forEach((b) => b.click()));
await page.waitForTimeout(1500);
await page.screenshot({ path: 'shots/bench-after.png' });
console.log(logs.join('\n') || '(no errors)');
await browser.close();

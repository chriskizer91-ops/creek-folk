// Browser checks for the built page (headless Chromium):
//   node tools/browser-test.mjs [jumpDays]
// 1. a new valley starts with five founders and saves to IndexedDB
// 2. the dev menu opens and a jump is replayed through the worker
// 3. the page reloads into the same valley, caught up
// Screenshots go to shots/.
import { chromium } from 'playwright';
import fs from 'node:fs';
const jumpDays = +(process.argv[2] || 7);
fs.mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const logs = [];
page.on('console', (m) => { if (m.type() !== 'log') logs.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
const url = 'file://' + process.cwd() + '/dist/creekfolk.html';
await page.goto(url);
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 30000 });
await page.waitForTimeout(1500);
await page.evaluate(() => { const b = document.querySelector('[data-go]'); b && b.click(); });
const s0 = await page.evaluate(() => { const w = __creek.world; return { seed: w.seed, t: w.t, pop: w.creatures.length }; });
console.log('start', s0);
await page.waitForTimeout(21000); // let the 20-second save happen
await page.keyboard.press('Control+Shift+D');
await page.waitForTimeout(500);
await page.screenshot({ path: 'shots/p1-dev.png' });
const t0 = Date.now();
await page.evaluate((d) => __creek.dev.jump(d * 86400e3), jumpDays);
let sawWorker = false;
for (;;) {
  await page.waitForTimeout(1000);
  const st = await page.evaluate(() => ({ c: !!__creek.catching, w: !!(__creek.catching && __creek.catching.worker), t: __creek.world.t }));
  if (st.w) sawWorker = true;
  if (!st.c && st.t > 86400 * (jumpDays - 0.01)) break;
  if (Date.now() - t0 > 20 * 60e3) { console.log('timeout waiting for catch-up'); break; }
}
const secs = (Date.now() - t0) / 1000;
const s1 = await page.evaluate(() => { const w = __creek.world; return { t: +(w.t / 86400).toFixed(3), pop: w.creatures.length, births: w.stats.births || 0, passings: w.stats.passings || 0, errors: w.stats.errors || 0 }; });
console.log(`jump of ${jumpDays} days took ${secs.toFixed(1)} s (worker used: ${sawWorker})`, s1);
await page.waitForTimeout(1500);
await page.screenshot({ path: 'shots/p1-after-jump.png' });
// close the summary, inspect someone
await page.evaluate(() => { document.querySelectorAll('#summary button, .summary button, [data-go]').forEach((b) => b.click()); });
await page.evaluate(() => { const w = __creek.world; const c = w.creatures.find((x) => x.stage === 'child') || w.creatures[0]; __creek.dev.inspect = c.id; __creek.dev.render(true); __creek.select(c.id); });
await page.waitForTimeout(2500);
await page.screenshot({ path: 'shots/p1-inspect.png' });
// reload: the same valley comes back from IndexedDB
await page.evaluate(() => __creek.save());
await page.waitForTimeout(1500);
await page.reload();
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 30000 });
await page.waitForTimeout(2000);
const s2 = await page.evaluate(() => { const w = __creek.world; return { seed: w.seed, t: +(w.t / 86400).toFixed(3), pop: w.creatures.length }; });
console.log('after reload', s2, s2.seed === s0.seed ? 'same valley' : 'DIFFERENT VALLEY');
await page.screenshot({ path: 'shots/p1-reload.png' });
console.log(logs.slice(0, 30).join('\n') || '(no warnings or errors)');
await browser.close();

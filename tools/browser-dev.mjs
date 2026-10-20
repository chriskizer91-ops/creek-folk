// The dev build in headless Chromium: the Dev button, a jump with its snapshot,
// triggers, a gift, an overlay, pause and restore. Screenshots go to shots/dev-*.png.
//   node tools/browser-dev.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const logs = [];
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`[${m.type()}] ${m.text()}`); });
await page.goto('file://' + process.cwd() + '/dist/creekfolk-dev.html');
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 30000 });
await page.evaluate(() => document.querySelectorAll('[data-go]').forEach((b) => b.click()));
const db = await page.evaluate(async () => (await indexedDB.databases()).map((d) => d.name));
console.log('database:', db);
await page.click('#devbtn');
await page.waitForTimeout(500);
await page.click('#devmenu button[data-j="24"]');
const t0 = Date.now();
for (;;) {
  await page.waitForTimeout(1000);
  const st = await page.evaluate(() => ({ c: !!__creek.catching, t: __creek.world.t }));
  if (!st.c && st.t > 86000) break;
  if (Date.now() - t0 > 300e3) { console.log('timeout'); break; }
}
console.log(`+1 day replayed in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
await page.waitForTimeout(1500);
const snaps = await page.evaluate(() => __creek.dev.snaps);
console.log('snapshots:', snaps);
for (const sel of ['[data-trigger="storm"]', '[data-trigger="birth"]', '[data-gift="rain"]', '[data-overlay="stage"]']) {
  await page.click('#devmenu button' + sel);
  await page.waitForTimeout(400);
  console.log(sel, '->', await page.evaluate(() => __creek.dev.note));
}
await page.waitForTimeout(2500);
await page.screenshot({ path: 'shots/dev-overlay.png' });
await page.click('#devmenu button[data-overlay=""]');
await page.click('#devmenu button[data-pause="1"]');
const p1 = await page.evaluate(() => __creek.world.t);
await page.waitForTimeout(3000);
const p2 = await page.evaluate(() => __creek.world.t);
console.log('paused: clock moved', (p2 - p1).toFixed(2), 's in 3 s');
await page.click('#devmenu button[data-pause="0"]');
await page.waitForTimeout(1500);
const p3 = await page.evaluate(() => __creek.world.t);
console.log('resumed: clock moved', (p3 - p2).toFixed(2), 's in 1.5 s');
await page.screenshot({ path: 'shots/dev-menu.png' });
if (snaps.length) {
  await page.click(`#devmenu button[data-restore="${snaps[0]}"]`);
  await page.waitForTimeout(3000);
  console.log('restored to t =', await page.evaluate(() => __creek.world.t.toFixed(0)), '| note:', await page.evaluate(() => __creek.dev.note));
}
console.log(logs.join('\n') || '(no errors)');
await browser.close();

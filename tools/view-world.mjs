// Show a saved valley in headless Chromium and take screenshots from a few places.
//   node tools/view-world.mjs <save.json> <out-prefix> [views]
// views: semicolon-separated "x,z,dist,yaw,pitch" (default: three views along the valley)
// The world is loaded as it was saved (no catch-up), at the moment it was saved.
import { chromium } from 'playwright';
import fs from 'node:fs';
const [file, prefix = 'shots/view', viewsArg] = process.argv.slice(2);
const views = (viewsArg || '40,30,45,0.6,0.9;40,80,60,0.6,0.95;40,130,45,0.6,0.9').split(';').map((v) => v.split(',').map(Number));
const save = fs.readFileSync(file, 'utf8');
const page_ = process.env.PAGE || 'dist/creekfolk.html';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const logs = [];
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`[${m.type()}] ${m.text()}`); });
await page.goto('file://' + process.cwd() + '/' + page_);
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 30000 });
await page.evaluate(async (s) => {
  const w = JSON.parse(s);
  w.realStart = Date.now() - w.t * 1000; w.skip = 0;
  window.__creek.world = null;
  await window.__creek.store.put('main', JSON.stringify(w));
}, save);
await page.reload();
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 60000 });
await page.evaluate(() => document.querySelectorAll('[data-go], .summary button').forEach((b) => b.click()));
let k = 0;
for (const [x, z, dist, yaw, pitch] of views) {
  await page.evaluate(([x, z, dist, yaw, pitch]) => { const r = __creek.rig; r.follow = null; r.ambient = false; Object.assign(r.goal, { x, z, dist, yaw, pitch }); Object.assign(r.cur, { x, z, dist, yaw, pitch }); }, [x, z, dist, yaw, pitch]);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${prefix}-${++k}.png` });
}
const info = await page.evaluate(() => { const w = __creek.world; return { day: +(w.t / 86400).toFixed(2), wet: w.creek.wetNow, pop: w.creatures.length }; });
console.log(info);
console.log(logs.join('\n') || '(no errors)');
await browser.close();

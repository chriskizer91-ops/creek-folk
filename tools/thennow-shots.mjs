// Then and now: screenshots of a saved valley from the same camera, as it is and as it
// was on its first day (holding the then-and-now button), plus the HUD with the button.
//   node tools/thennow-shots.mjs <save.json> [out-prefix] [views]
// views: semicolon-separated "x,z,dist,yaw,pitch" (default: three views along the valley)
// Env: PAGE (default dist/creekfolk.html), W and H (viewport, default 1280x800).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const [file, prefix = 'shots/sound/thennow', viewsArg] = process.argv.slice(2);
const views = (viewsArg || '40,34,46,0.6,0.9;40,72,64,0.6,0.95;40,95,120,0.35,1.0').split(';').map((v) => v.split(',').map(Number));
const save = fs.readFileSync(file, 'utf8');
const W = +(process.env.W || 1280), H = +(process.env.H || 800);
fs.mkdirSync(path.dirname(prefix), { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const page = await (await browser.newContext({ viewport: { width: W, height: H } })).newPage();
const logs = [];
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.stack || e.message}`));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`[${m.type()}] ${m.text()}`); });
await page.goto('file://' + process.cwd() + '/' + (process.env.PAGE || 'dist/creekfolk.html'));
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 30000 });
await page.evaluate(async (s) => {
  const w = JSON.parse(s);
  w.realStart = Date.now() - w.t * 1000; w.skip = 0;
  window.__creek.world = null;
  await window.__creek.store.put('main', JSON.stringify(w));
}, save);
await page.reload();
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 60000 });
logs.length = 0; // errors before the reload come from blanking the old valley on purpose
await page.evaluate(() => document.querySelectorAll('[data-go], .summary button').forEach((b) => b.click()));
const btn = await page.$('.thennow');
if (!btn) throw new Error('no then-and-now button');
const box = await btn.boundingBox();
const out = [];
let k = 0;
for (const [x, z, dist, yaw, pitch] of views) {
  await page.evaluate(([x, z, dist, yaw, pitch]) => { const r = __creek.rig; r.follow = null; r.ambient = false; Object.assign(r.goal, { x, z, dist, yaw, pitch }); Object.assign(r.cur, { x, z, dist, yaw, pitch }); }, [x, z, dist, yaw, pitch]);
  k++;
  await page.evaluate(() => __creek.activeInput()); // out of ambient mode (it hides the HUD)
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${prefix}-${k}-now.png` });
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${prefix}-${k}-then.png` });
  const held = await page.evaluate(() => ({ held: __creek.thenNow.held, showing: __creek.thenNow.showing, catching: !!__creek.catching, buildMs: __creek.thenNow.buildMs, caption: document.querySelector('.thennow-cap').textContent }));
  await page.mouse.up();
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => __creek.thenNow.showing);
  out.push({ view: k, ...held, showingAfterRelease: after });
}
// the T key does the same
await page.keyboard.down('t');
await page.waitForTimeout(400);
const byKey = await page.evaluate(() => __creek.thenNow.showing);
await page.keyboard.up('t');
await page.waitForTimeout(200);
const afterKey = await page.evaluate(() => __creek.thenNow.showing);
// with sound on, the soundscape listens to the first day while the button is held
await page.evaluate(() => __creek.setSetting('sound', true));
await page.waitForTimeout(1500);
const soundNow = await page.evaluate(() => __creek.sound.scape && __creek.sound.scape.st && __creek.sound.scape.st.health);
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.waitForTimeout(1500);
const soundThen = await page.evaluate(() => __creek.sound.scape && __creek.sound.scape.st && __creek.sound.scape.st.health);
await page.mouse.up();
await page.waitForTimeout(1500);
const soundBack = await page.evaluate(() => __creek.sound.scape && __creek.sound.scape.st && __creek.sound.scape.st.health);
await page.evaluate(() => __creek.setSetting('sound', false));
console.log(JSON.stringify({ soundHealth: { now: soundNow, held: soundThen, released: soundBack } }));
// the live world is untouched: same time, same creek, same things
const check = await page.evaluate(() => { const w = __creek.world; return { day: +(w.t / 86400).toFixed(2), wet: w.creek.wetNow, structures: w.structures.length, pop: w.creatures.length }; });
console.log(JSON.stringify({ views: out, key: { held: byKey, released: !afterKey }, live: check }, null, 1));
console.log(logs.join('\n') || '(no errors)');
await browser.close();

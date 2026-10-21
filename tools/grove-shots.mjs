// Screenshots of the grove, the goats and the wetland's life in a saved valley.
//   node tools/grove-shots.mjs <save.json> <out-prefix> "<target>,dist,yaw,pitch;..."
// target: "x:z", "grove" (the grove's centre), "log:N" (the Nth nurse log), "goat:ID",
// "kid" (the youngest goat), "heron:N" (the Nth heron, wherever the view put it),
// "fly" (where the first few butterflies are).
// Like tools/view-world.mjs: the world is loaded as it was saved (no catch-up).
import { chromium } from 'playwright';
import fs from 'node:fs';
const [file, prefix = 'shots/grove/x', viewsArg = 'grove,40,0.6,1.2'] = process.argv.slice(2);
const views = viewsArg.split(';').map((v) => v.split(','));
const save = fs.readFileSync(file, 'utf8');
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
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
logs.length = 0;
await page.evaluate(() => document.querySelectorAll('[data-go], .summary button').forEach((b) => b.click()));
await page.waitForTimeout(1500);
let k = 0;
for (const [target, dist, yaw, pitch] of views) {
  const at = await page.evaluate((target) => {
    const w = __creek.world, L = __creek.life, [a, b] = target.split(':');
    if (a === 'grove') return w.grove && { x: w.grove.x, z: w.grove.z };
    if (a === 'log') { const l = w.grove && w.grove.logs[+b]; return l && { x: l.x + Math.cos(l.rot) * l.len / 2, z: l.z + Math.sin(l.rot) * l.len / 2 }; }
    if (a === 'goat') { const g = w.fauna.goats.find((g) => g.id === +b); return g && { x: g.x, z: g.z }; }
    if (a === 'kid') { const g = w.fauna.goats.slice().sort((p, q) => q.born - p.born)[0]; return g && { x: g.x, z: g.z }; }
    if (a === 'fly') return L && L.flyAt && { x: L.flyAt.x, z: L.flyAt.z };
    if (a === 'heron') { const h = L && L.herons[+b]; return h && h.x != null && { x: h.x, z: h.z }; }
    return { x: +a, z: +b };
  }, target);
  if (!at) { console.log(`${target}: not found`); continue; }
  await page.evaluate(([x, z, dist, yaw, pitch]) => { const r = __creek.rig; r.follow = null; r.ambient = false; Object.assign(r.goal, { x, z, dist, yaw, pitch }); Object.assign(r.cur, { x, z, dist, yaw, pitch }); }, [at.x, at.z, +dist, +yaw, +pitch]);
  await page.waitForTimeout(2500);
  const out = `${prefix}-${++k}.png`;
  await page.screenshot({ path: out });
  console.log(`${out}: ${target} at ${at.x.toFixed(1)},${at.z.toFixed(1)}`);
}
const info = await page.evaluate(() => { const w = __creek.world, L = __creek.life; return { day: +(w.t / 86400).toFixed(3), herons: L ? L.herons.filter((h) => h.root.visible).length : 0, butterflies: L ? L.wingL.count : 0, mist: L ? (L.mist.visible ? L.mist.count : 0) : 0, mistOpacity: L ? +L.mistMat.opacity.toFixed(2) : 0 }; });
console.log(info);
console.log(logs.join('\n') || '(no errors)');
await browser.close();

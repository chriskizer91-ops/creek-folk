// Screenshots of the records of time in a saved valley: the Land tab's bank behind the first
// dam, a tap on the creek (its bank), the Ways and stories tab, the Chronicle, "while you were
// away" after a jump, then and now (held), and the last founder's moment (shown on demand).
// Fails on any page error. For looking at.
//
//   node tools/build.mjs --dev && node tools/records-shots.mjs <save.json> <out dir>
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [src, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 1100, height: 760 } });
await ctx.route('**/*', (r) => (/^(file|blob|data):/.test(r.request().url()) ? r.continue() : r.abort()));
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(String(e.stack || e)));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
const shot = (n) => p.screenshot({ path: path.join(out, n + '.png'), timeout: 180000 });
await p.goto('file://' + path.join(root, 'dist/creekfolk2-dev.html'));
await p.waitForTimeout(1500);
const text = fs.readFileSync(src, 'utf8'),
  meta = JSON.parse(text);
await p.evaluate(([cal, t]) => {
  const a = window.__cf2;
  a.Clock.setDev(cal + t * 1000 - Date.now() - a.Clock.fix);
  a.setClock();
}, [meta.calStart, meta.t]);
await p.evaluate((t) => window.__cf2.post({ type: 'import', text: t }), text);
await p.waitForFunction(() => window.__cf2.vw.ready && window.__cf2.renderer && window.__cf2.renderer.ready, null, { timeout: 180000 });
await p.evaluate(() => window.__cf2.dev.pause(true));
// the sheets
await p.click('#bVillage');
await p.waitForSelector('#vSheet:not([hidden])', { timeout: 60000 });
await p.waitForTimeout(500);
await shot('land');
await p.evaluate(() => { const s = document.getElementById('sheet'); const h = [...s.querySelectorAll('h3')].find((x) => /bank/.test(x.textContent)); h && h.scrollIntoView(); });
await shot('land-bank');
for (const tab of ['ways', 'chronicle']) {
  await p.click(`[data-tab="${tab}"]`);
  await p.waitForTimeout(400);
  await shot(tab);
  await p.evaluate(() => (document.getElementById('sheet').scrollTop = 900));
  await shot(tab + '-2');
}
await p.click('#sheet .x');
// a point of the creek: the bank there
await p.evaluate(async () => {
  const a = window.__cf2, w = await a.worldCopy(), R = w.records, best = Object.entries(R.mud).sort((x, y) => y[1].b.length - x[1].b.length)[0];
  const z = best ? w.creek.nodes[+best[0]].z : 60;
  await a.hud.openBank(z);
});
await p.waitForTimeout(500);
await shot('bank');
await p.click('#sheet .x');
// then and now, from the same camera
await p.evaluate(() => Object.assign(window.__cf2.renderer.view.goal, { hv: 90 }));
await p.waitForFunction(() => window.__cf2.renderer.valley.busy() === 0, null, { timeout: 180000 }).catch(() => {});
await p.waitForTimeout(3000);
await shot('now');
await p.evaluate(() => window.__cf2.renderer.setThen(true));
await p.waitForFunction(() => window.__cf2.renderer.thenValley && window.__cf2.renderer.thenValley.busy() === 0, null, { timeout: 240000 }).catch(() => {});
await p.waitForTimeout(3000);
await shot('then');
await p.evaluate(() => window.__cf2.renderer.setThen(false));
// the last founder's moment, shown on demand
await p.evaluate(() => {
  const a = window.__cf2, c = [...a.vw.cs.values()][0];
  a.hud.moment({ text: `${c.name} was the last of the eight who came down the creek from the old valley. The valley goes on.`, x: c.x || 60, z: c.z || 60, kind: 'founders', imp: 3 });
});
await p.waitForTimeout(3500);
await shot('moment-1');
await p.waitForTimeout(5500);
await shot('moment-2');
console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no page errors');
await browser.close();
process.exit(errs.length ? 1 : 0);

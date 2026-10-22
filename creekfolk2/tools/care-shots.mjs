// Screenshots of care in a saved valley: the Care sheet, leaving food with a tap, placing a
// treasure, where the treasures are (each one's "Show me"), food and what was left back, the
// Giving Place, a creekfolk wearing a treasure close up, and the one who suspects waving.
// Fails on any page error. For looking at.
//
//   node tools/build.mjs --dev && node tools/care-shots.mjs <save.json> <out dir>
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
const settle = async (ms = 3000) => {
  await p.waitForFunction(() => window.__cf2.renderer.valley.busy() === 0, null, { timeout: 180000 }).catch(() => {});
  await p.waitForTimeout(ms);
};
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
// the Care sheet, ready for a treasure
await p.evaluate(() => window.__cf2.post({ type: 'trigger', what: 'treasureready' }));
await p.waitForTimeout(800);
await p.click('#bCare');
await p.waitForSelector('#vSheet:not([hidden])', { timeout: 60000 });
await p.waitForTimeout(600);
await shot('care-sheet');
await p.evaluate(() => (document.getElementById('sheet').scrollTop = 2000));
await shot('care-sheet-2');
// place a treasure from the sheet
await p.click('[data-tr="greenglass"]');
await p.waitForTimeout(1500);
await shot('care-placed');
await p.click('#sheet .x');
// leave food: choose it, then tap near a home
const home = await p.evaluate(() => {
  const h = [...window.__cf2.vw.list('structures').values()].find((s) => s.kind === 'home');
  return h ? { x: h.x, z: h.z } : null;
});
if (home) {
  await p.evaluate((h) => Object.assign(window.__cf2.renderer.view.goal, { x: h.x + 3, z: h.z + 2, hv: 9 }), home);
  await settle(2500);
  await p.evaluate((h) => {
    const a = window.__cf2;
    a.renderer.placing = 'berry';
    a.renderer.onPlace('berry', h.x + 3, h.z + 2);
    a.renderer.placing = null;
  }, home);
  await p.waitForTimeout(3000);
  await settle(2000);
  await shot('food');
}
// each kind of place a treasure can be: one view per state found in the valley
const spots = await p.evaluate(async () => {
  const w = await window.__cf2.worldCopy(),
    seen = {};
  for (const t of w.treasures || []) if (!seen[t.st] && ['bar', 'pond', 'floor', 'set', 'kept', 'planted', 'grove', 'wait'].includes(t.st)) seen[t.st] = { x: t.x, z: t.z, k: t.k };
  if (w.givingPlace) seen.givingplace = { x: w.givingPlace.x, z: w.givingPlace.z };
  const sp = w.kindness && w.kindness.spots.find((s) => s.named);
  if (sp) seen.kindspot = { x: sp.x, z: sp.z };
  return seen;
});
console.log('places:', JSON.stringify(spots));
for (const [st, s] of Object.entries(spots)) {
  await p.evaluate((s) => Object.assign(window.__cf2.renderer.view.goal, { x: s.x, z: s.z, hv: 5 }), s);
  await settle(2500);
  await shot('at-' + st);
}
// someone wearing a treasure, close up; and the one who suspects, waving
const wearer = await p.evaluate(() => {
  const c = [...window.__cf2.vw.cs.values()].find((c) => c.tr && !c.away);
  return c ? c.id : null;
});
if (wearer != null) {
  await p.evaluate((id) => (window.__cf2.renderer.follow(id), (window.__cf2.renderer.view.goal.hv = 3)), wearer);
  await settle(3000);
  await shot('wearing');
}
const waver = await p.evaluate(() => {
  const a = window.__cf2,
    c = [...a.vw.cs.values()].find((c) => c.beyond && !c.away) || [...a.vw.cs.values()].find((c) => !c.away && !c.asleep);
  a.renderer.follow(c.id);
  a.renderer.view.goal.hv = 3.5;
  return c.id;
});
await settle(3000);
await p.evaluate((id) => {
  const a = window.__cf2;
  a.renderer.waveFor = { id, until: performance.now() + 9000 };
  a.hud.toast('(the wave, shown on demand)', 6);
}, waver);
await p.waitForTimeout(2500);
await shot('wave');
console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no page errors');
await browser.close();
process.exit(errs.length ? 1 : 0);

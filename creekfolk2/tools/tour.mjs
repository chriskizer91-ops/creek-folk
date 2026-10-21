// The 3D view, live, through everything it does: a saved valley (or a new one) running in real
// time in headless Chromium with WebGL (SwiftShader), zoomed from the air to a face, following a
// creekfolk, drifting, with overlays, a storm, beavers, the fish run and a dev jump of an hour
// (replayed in the worker while the page keeps drawing). Fails on any page error, or if the 3D
// view isn't the one drawing. (tools/browser-test.mjs checks the rules without WebGL; this checks
// the drawing.)
//
//   node tools/build.mjs --dev && node tools/tour.mjs [save.json | new]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = process.argv[2] || 'new';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 900, height: 600 } });
const reqs = [];
await ctx.route('**/*', (r) => (/^(file|blob|data):/.test(r.request().url()) ? r.continue() : (reqs.push(r.request().url()), r.abort())));
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(String(e.stack || e)));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, more = '') => {
  results.push(ok);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${more ? '  ' + more : ''}`);
};
await p.goto('file://' + path.join(root, 'dist/creekfolk2-dev.html'));
await sleep(1200);
if (src === 'new') {
  if (await p.isVisible('#vStart')) await p.click('#bBegin');
} else {
  const text = fs.readFileSync(src, 'utf8'),
    meta = JSON.parse(text);
  await p.evaluate(([cal, t]) => {
    const a = window.__cf2;
    a.Clock.setDev(cal + t * 1000 - Date.now() - a.Clock.fix);
    a.setClock();
  }, [meta.calStart, meta.t]);
  await p.evaluate((t) => window.__cf2.post({ type: 'import', text: t }), text);
}
await p.waitForFunction(() => window.__cf2.vw.ready && window.__cf2.renderer && window.__cf2.renderer.ready, null, { timeout: 180000 });
// (the minified game renames classes, so the 3D view is known by what it has: a valley and a pixel pass)
const is3D = await p.evaluate(() => !!(window.__cf2.renderer.valley && window.__cf2.renderer.px));
check('the 3D view is drawing', is3D);
// frames drawn: counted from the page's own loop
await p.evaluate(() => {
  const R = window.__cf2.renderer,
    f0 = R.frame.bind(R);
  window.__frames = 0;
  R.frame = (t, dt) => (window.__frames++, f0(t, dt));
});
const frames = () => p.evaluate(() => window.__frames);
const goal = (o) => p.evaluate((o) => Object.assign(window.__cf2.renderer.view.goal, o), o);
const t0 = await p.evaluate(() => window.__cf2.vw.t);
for (const hv of [260, 120, 60, 30, 14, 6, 2.5]) {
  const f = await frames();
  await goal({ hv });
  await sleep(5000);
  check(`zoomed to ${hv} m`, (await frames()) > f && !errs.length, `${(await frames()) - f} frames`);
}
// follow someone, close in
await p.evaluate(() => {
  const a = window.__cf2,
    c = [...a.vw.cs.values()].find((c) => !c.away);
  a.renderer.follow(c.id);
  a.renderer.view.goal.hv = 8;
});
await sleep(8000);
check('following a creekfolk close in', !errs.length && (await p.evaluate(() => !!window.__cf2.renderer.followed)));
await p.evaluate(() => window.__cf2.renderer.follow(null));
// drifting
await p.evaluate(() => window.__cf2.renderer.setAmbient(true));
await goal({ hv: 50 });
await sleep(6000);
await p.evaluate(() => window.__cf2.renderer.setAmbient(false));
check('drifting over the valley', !errs.length);
// overlays
for (const o of ['wet', 'wear', 'stage', 'cap', null]) {
  await p.evaluate((o) => window.__cf2.renderer.setOverlay(o), o);
  await sleep(2500);
}
check('overlays on and off', !errs.length);
// things happening
for (const what of ['storm', 'beavers', 'skycal', 'returning', 'flood', 'birth', 'visitor']) {
  await p.evaluate((w) => window.__cf2.post({ type: 'trigger', what: w }), what);
  await sleep(2500);
}
await goal({ hv: 20 });
await sleep(6000);
check('a storm, beavers, sky stones, the fish run, a flood, a birth, a visitor', !errs.length);
// a jump of an hour, replayed in the worker while the page draws
const f1 = await frames(),
  tj = await p.evaluate(() => window.__cf2.vw.t);
await p.evaluate(() => window.__cf2.dev.jump(3600));
await p.waitForFunction((tj) => window.__cf2.vw.t > tj + 3500 && !window.__cf2.catching, tj, { timeout: 600000 }).catch(() => {});
await sleep(3000);
const t1 = await p.evaluate(() => window.__cf2.vw.t);
check('a jump of an hour', t1 > tj + 3500 && !errs.length && (await frames()) > f1, `valley moved ${((t1 - tj) / 60).toFixed(0)} min, ${(await frames()) - f1} frames`);
check('the valley kept running', t1 > t0, `${((t1 - t0) / 60).toFixed(1)} valley minutes in all`);
check('no network requests', !reqs.length, reqs.slice(0, 3).join(' '));
check('no errors on the page', !errs.length, errs.slice(0, 4).join('\n    '));
console.log(results.every(Boolean) ? `all ${results.length} passed` : `${results.filter((r) => !r).length} of ${results.length} failed`);
await browser.close();
process.exit(results.every(Boolean) ? 0 : 1);

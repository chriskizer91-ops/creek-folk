// The game in headless Chromium: the rules a player relies on.
//
//   node tools/build.mjs && node tools/browser-test.mjs [--keep]
//
// Checks, in order, printing PASS or FAIL for each:
//   - the page makes no network requests and logs no errors
//   - a new valley starts; the simulation runs in its worker, the page draws
//   - each build keeps its own database (game and dev)
//   - a dev jump of a day is replayed in full through the worker (catching up), and the
//     dev build takes a snapshot before it
//   - a reload opens the same valley, where it left off
//   - the clock going back: the valley waits
//   - the clock jumping 100 days ahead: the page asks; "the clock is wrong" carries on
//     from where the valley was, without replaying
//   - pause holds the valley's clock, and unpausing replays nothing
//   - a storm can be made to happen; the village and mind sheets open
//   - a Creekfolk 1 valley, and one from an earlier Creekfolk 2, are refused in plain words
//   - the game build hides the dev menu (Ctrl+Shift+D opens it)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
// this build's database, from BUILD_VERSION in tools/build.mjs ('cf2-2' keeps its valleys in 'creekfolk2-2')
const DB = 'creekfolk2-' + fs.readFileSync(path.join(root, 'tools/build.mjs'), 'utf8').match(/BUILD_VERSION = 'cf2-(\d+)'/)[1];
const DEVF = path.join(root, 'dist/creekfolk2-dev.html'),
  GAMEF = path.join(root, 'dist/creekfolk2.html');
const results = [];
const check = (name, ok, more = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${more ? '  ' + more : ''}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1100, height: 760 } });
const reqs = [],
  errs = [];
await ctx.route('**/*', (r) => {
  const u = r.request().url();
  if (/^(file|blob|data):/.test(u)) return r.continue();
  reqs.push(u);
  return r.abort();
});
const open = async (file) => {
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + file);
  return p;
};
const state = (p) =>
  p.evaluate(() => {
    const a = window.__cf2;
    return { ready: a.vw.ready, t: a.vw.t, seed: a.vw.seed, n: a.vw.cs.size, calStart: a.vw.calStart, catching: !!a.catching, paused: a.paused, weather: a.vw.weather.state };
  });
const until = async (p, fn, arg, ms = 60000) => p.waitForFunction(fn, arg, { timeout: ms, polling: 100 });

// ---- a new valley -----------------------------------------------------------
let p = await open(DEVF);
await sleep(1200);
if (await p.isVisible('#vStart')) await p.click('#bBegin');
await until(p, () => window.__cf2.vw.ready);
await sleep(2500);
let s = await state(p);
check('a new valley starts and the page draws it', s.ready && s.n === 8 && s.t > 0, `seed ${s.seed}, ${s.n} creekfolk, t ${s.t.toFixed(1)} s`);
const dbs = await p.evaluate(async () => (indexedDB.databases ? (await indexedDB.databases()).map((d) => d.name) : []));
check('the dev build keeps its own database', dbs.includes(DB + '-dev') && !dbs.includes(DB), JSON.stringify(dbs));

// ---- a dev jump of a day, through the worker -------------------------------
let t0 = s.t,
  wall = Date.now();
await p.evaluate(() => window.__cf2.dev.jump(86400));
await until(p, () => !!window.__cf2.catching, null, 20000).catch(() => {});
const sawCard = await p.isVisible('#vCatch');
await until(p, () => !window.__cf2.catching && window.__cf2.vw.t > 86400, null, 600000);
s = await state(p);
const jumpSec = (Date.now() - wall) / 1000;
check('a day is replayed in full through the worker', s.t >= t0 + 86400 - 5 && sawCard, `${jumpSec.toFixed(1)} s, catch-up card shown: ${sawCard}, t ${(s.t / 86400).toFixed(3)} days`);
await sleep(500);
const snaps = await p.evaluate(() => window.__cf2.ask({ type: 'snapshots' }, 'snapshots').then((m) => m.keys));
check('the dev build took a snapshot before the jump', snaps.length >= 1, `${snaps.length} snapshot(s)`);
const readout = await p.evaluate(() => window.__cf2.dev.readout);
console.log(`      speed: ${readout ? Math.round(readout.rate) + 'x real time; 30 days would take about ' + Math.round((30 * 86400) / readout.rate / 60) + ' min here' : 'none'}`);

// ---- reload ---------------------------------------------------------------
await p.evaluate(() => window.__cf2.post({ type: 'saveNow' }));
await sleep(800);
const before = await state(p);
await p.reload();
await until(p, () => window.__cf2 && window.__cf2.vw.ready, null, 60000);
await sleep(1500);
s = await state(p);
check('a reload opens the same valley where it left off', s.seed === before.seed && s.t >= before.t - 1 && s.t < before.t + 120, `t ${before.t.toFixed(0)} -> ${s.t.toFixed(0)}`);

// ---- the clock goes back: the valley waits ----------------------------------
await p.evaluate(() => {
  const a = window.__cf2;
  a._fix0 = a.Clock.fix;
  a.Clock.setFix(a.Clock.fix - 2 * 86400 * 1000);
  a.setClock();
});
await sleep(2500);
let w1 = await state(p);
await sleep(2000);
let w2 = await state(p);
const waitNote = await p.evaluate(() => !document.getElementById('sub').hidden && document.getElementById('sub').textContent);
check('the clock going back: the valley waits', Math.abs(w2.t - w1.t) < 0.5 && !!waitNote, `t held at ${w2.t.toFixed(1)}; "${waitNote}"`);
await p.evaluate(() => {
  const a = window.__cf2;
  a.Clock.setFix(a._fix0);
  a.setClock();
});
await sleep(2000);
s = await state(p);
check('and carries on when the clock catches up', s.t > w2.t + 0.5);

// ---- the clock jumps 100 days ahead: the page asks ---------------------------
const cal0 = (await state(p)).calStart;
await p.evaluate(() => {
  const a = window.__cf2;
  a.Clock.setFix(a.Clock.fix + 100 * 86400 * 1000);
  a.setClock();
});
await until(p, () => !document.getElementById('vGap').hidden, null, 10000).catch(() => {});
const asked = await p.isVisible('#vGap');
const gapTitle = asked ? await p.textContent('#gapTitle') : '';
if (asked) await p.click('#bGapWrong');
await sleep(2500);
s = await state(p);
check('100 days ahead: the page asks before replaying', asked, `"${gapTitle}"`);
check('"the clock is wrong" carries on from where the valley was', !s.catching && s.calStart - cal0 > 99 * 86400 * 1000, `calStart moved ${((s.calStart - cal0) / 86400000).toFixed(2)} days`);
await p.evaluate(() => {
  const a = window.__cf2;
  a.Clock.setFix(a._fix0);
});

// ---- pause ---------------------------------------------------------------
await p.evaluate(() => window.__cf2.dev.pause(true));
await sleep(500);
let pz1 = await state(p);
await sleep(3000);
let pz2 = await state(p);
await p.evaluate(() => window.__cf2.dev.pause(false));
await sleep(2000);
let pz3 = await state(p);
check('pause holds the valley’s clock', Math.abs(pz2.t - pz1.t) < 0.2, `moved ${(pz2.t - pz1.t).toFixed(2)} s in 3 s`);
check('unpausing replays nothing', !pz3.catching && pz3.t - pz2.t < 10, `then moved ${(pz3.t - pz2.t).toFixed(2)} s`);

// ---- a storm, the sheets -------------------------------------------------------
await p.evaluate(() => window.__cf2.post({ type: 'trigger', what: 'storm' }));
await sleep(1500);
s = await state(p);
check('a storm can be made to happen', s.weather === 'storm', s.weather);
await p.click('#bVillage');
await until(p, () => !document.getElementById('vSheet').hidden, null, 10000);
const land = await p.textContent('#sheet');
await p.click('#sheet [data-tab="people"]');
await sleep(300);
await p.click('#sheet [data-who]');
await sleep(800);
const mind = await p.textContent('#sheet');
check('the village sheet and a mind open', /can feed about/.test(land) && /Temperament/.test(mind), mind.slice(0, 80).replace(/\s+/g, ' '));
await p.keyboard.press('Escape');

// ---- refusals ---------------------------------------------------------------
const cf1 = fs.readFileSync(path.join(root, 'runs/cf1-save.json'), 'utf8');
const old = JSON.stringify({ ...JSON.parse(await p.evaluate(() => window.__cf2.ask({ type: 'getWorld' }, 'world').then((m) => m.save))), build: 'cf2-0' });
const refuse = async (text) => {
  await p.evaluate((t) => window.__cf2.post({ type: 'import', text: t }), text);
  await sleep(1500);
  return p.textContent('#setNote');
};
const r1 = await refuse(cf1),
  r2 = await refuse(old);
check('a Creekfolk 1 valley is refused in plain words', /Creekfolk 1/.test(r1), `"${r1}"`);
check('an earlier Creekfolk 2 valley is refused in plain words', /earlier version of Creekfolk 2/.test(r2), `"${r2}"`);
s = await state(p);
check('and the valley is still the same one', s.seed === before.seed);
await p.screenshot({ path: path.join(root, 'runs/browser-dev.png') });
await p.close();

// ---- the game build ------------------------------------------------------------
p = await open(GAMEF);
await sleep(1200);
if (await p.isVisible('#vStart')) await p.click('#bBegin');
await until(p, () => window.__cf2.vw.ready);
await sleep(1000);
const devHidden = !(await p.isVisible('#bDev'));
await p.keyboard.press('Control+Shift+D');
await sleep(400);
const devOpens = await p.isVisible('#vDev');
check('the game build hides the dev menu; Ctrl+Shift+D opens it', devHidden && devOpens);
const dbs2 = await p.evaluate(async () => (await indexedDB.databases()).map((d) => d.name));
check('the game keeps its valley in its own database', dbs2.includes(DB), JSON.stringify(dbs2));
await p.close();

check('no network requests', reqs.length === 0, reqs.slice(0, 3).join(' '));
check('no errors on the page', errs.length === 0, errs.slice(0, 3).join(' | '));
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(failed.length ? `${failed.length} FAILED` : `all ${results.length} passed`);
process.exit(failed.length ? 1 : 0);

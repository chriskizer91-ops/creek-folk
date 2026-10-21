// Measure the soundscape (src/view/soundscape.js) without listening: render each layer
// offline (OfflineAudioContext in headless Chromium) for the valley's first day and for
// a saved valley, at the same moments of the year and day, and print how loud each
// layer is, how much of the time something can be heard, and how many calls a minute.
// Then the same over a sweep of made-up health (0 cut down .. 1 healed), the game's own
// creek ambience for comparison, and a live check with sound turned on.
//   node tools/sound-measure.mjs <save.json> [seconds per render]
import { chromium } from 'playwright';
import fs from 'node:fs';
const [file, secsArg = '30'] = process.argv.slice(2);
const secs = +secsArg;
const save = fs.readFileSync(file, 'utf8');
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const page = await (await browser.newContext({ viewport: { width: 900, height: 600 } })).newPage();
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

const SCENES = [
  ['spring dawn', 24, 0.215],
  ['spring morning', 24, 0.33],
  ['summer midday', 72, 0.5],
  ['summer evening', 72, 0.84],
  ['spring night', 30, 0.9],
  ['winter night', 175, 0.95],
  ['dry-season night', 110, 0.95],
];
const res = await page.evaluate(async ({ SCENES, secs }) => {
  const S = window.__creekSound, live = window.__creek.world, d1 = S.dayOne();
  const tAt = (w, doy, ph) => { const off = w.cycle.off, vd = Math.floor((w.t / 3600 + off) / 192) * 192 + doy + ph; return (vd - off) * 3600; };
  const focus = { x: 40, z: 60, dist: 40, rain: 0, snow: 0 };
  const sum = (st) => ({ frogs: `${st.frogs.n} frogs, keen ${st.frogs.busy.toFixed(2)}, chorus ${st.frogs.bed.toFixed(2)}`, birds: `${Object.keys(st.birds.sing).length} kinds, ${Object.values(st.birds.sing).reduce((a, b) => a + b, 0)} birds, ${(st.birds.busy * 60).toFixed(1)}/min each${st.birds.owl > 0.001 ? ', owl' : ''}`, insects: `${st.insects.n} crickets ${st.insects.busy.toFixed(2)}, buzz ${st.insects.buzz.toFixed(2)}, hum ${st.insects.hum.toFixed(2)}, fly ${(st.insects.fly * 60).toFixed(1)}/min` });
  const out = { health: { day1: S.health(d1), now: S.health(live) }, worlds: {} };
  for (const k of ['health']) for (const h of Object.values(out.health)) delete h.hives;
  for (const [name, w] of [['day 1', d1], ['now', live]]) {
    const rows = [];
    for (const [scene, doy, ph] of SCENES) {
      const st = S.state(w, { ...focus, t: tAt(w, doy, ph) }), r = { scene, health: st.health, state: sum(st) };
      for (const layer of ['frogs', 'birds', 'insects', null]) r[layer || 'all'] = await S.render(st, secs, layer);
      rows.push(r);
    }
    out.worlds[name] = rows;
  }
  // a sweep of made-up health on the live valley's calendar
  out.sweep = [];
  for (const h of [0, 0.25, 0.5, 0.75, 1]) {
    const H = { wet: 0.8 * h, dWet: 0.75 * h, dGreen: 0.15 + 0.82 * h, wetland: h, marsh: h, woods: h, flowers: 0.5 * h, birds: [], hives: [] }, row = { h };
    for (const [scene, doy, ph, layer] of [['spring dawn', 24, 0.215, 'birds'], ['spring night', 30, 0.9, 'frogs'], ['summer evening', 72, 0.84, 'insects']]) row[layer] = await S.render(S.state(live, { ...focus, H, t: tAt(live, doy, ph) }), secs, layer);
    out.sweep.push(row);
  }
  out.reference = { creekNear: await S.reference(10, 1), creekFar: await S.reference(10, 0.3) };
  return out;
}, { SCENES, secs });

// live: turn sound on and let the page run it for a while
const liveCheck = await page.evaluate(async () => {
  const app = window.__creek;
  app.setSetting('sound', true);
  await new Promise((r) => setTimeout(r, 6000));
  const s = app.sound, sc = s.scape;
  if (!sc) return { error: 'no soundscape engine', ctx: s.ctx && s.ctx.state };
  let t = performance.now(), n = 0;
  for (let i = 0; i < 40; i++) {
    const now = s.ctx.currentTime;
    sc.apply(window.__creekSound.state(app.world, { x: app.rig.cur.x, z: app.rig.cur.z, dist: app.rig.cur.dist }), now);
    sc.run(now, now + 1.4);
    n++;
  }
  const ms = (performance.now() - t) / n;
  const out = { ctx: s.ctx.state, audioTime: +s.ctx.currentTime.toFixed(1), counts: { ...sc.count }, agents: sc.agents.length, msPerTick: +ms.toFixed(3) };
  app.setSetting('sound', false);
  await new Promise((r) => setTimeout(r, 1500));
  const c0 = { ...sc.count };
  await new Promise((r) => setTimeout(r, 2500));
  out.silentWhenOff = JSON.stringify(c0) === JSON.stringify(sc.count) && app.sound.on === false;
  return out;
});

const f = (r) => `${String(r.rmsDb).padStart(6)} dB rms ${String(r.peakDb).padStart(6)} peak ${String(Math.round(r.sounding * 100)).padStart(3)}% heard ${String(r.perMin).padStart(6)}/min`;
console.log(`Health (soundHealth):\n  day 1: ${JSON.stringify(res.health.day1)}\n  now:   ${JSON.stringify(res.health.now)}`);
for (const [name, rows] of Object.entries(res.worlds)) {
  console.log(`\n== ${name} (${secs} s renders; rms over the whole render, "heard" = share of 50 ms moments above -55 dBFS)`);
  for (const r of rows) {
    console.log(`  ${r.scene.padEnd(17)} health frogs ${r.health.frogs} birds ${r.health.birds} insects ${r.health.insects}`);
    for (const l of ['frogs', 'birds', 'insects']) console.log(`    ${l.padEnd(8)} ${f(r[l])}   (${r.state[l]})`);
    console.log(`    ${'all'.padEnd(8)} ${f(r.all)}`);
  }
}
console.log('\n== health sweep (the live valley\'s calendar, made-up health)');
for (const r of res.sweep) console.log(`  health ${r.h.toFixed(2)}  birds@dawn ${f(r.birds)} | frogs@spring night ${f(r.frogs)} | insects@summer evening ${f(r.insects)}`);
console.log(`\n== the game's creek ambience for comparison: near the creek ${f({ ...res.reference.creekNear, perMin: 0 })}; away from it ${f({ ...res.reference.creekFar, perMin: 0 })}`);
console.log(`\n== live, sound on: ${JSON.stringify(liveCheck)}`);
console.log(logs.join('\n') || '(no page errors)');
await browser.close();

// Screenshots of the 3D valley: open a saved valley (or a new one) in the dev build, set the
// camera to each view, let the tiles build, and save a picture of each.
//
//   node tools/build.mjs --dev && node tools/shots.mjs <save.json | new> <out dir> [views.json] [w h]
//
// A view: { name, x, z, hv (metres of view, top to bottom), el (0.12 low .. 1.5 overhead),
//   az (radians), follow (true: the nearest creekfolk), atHeron (true: where the heron is),
//   at ("frogs" | "schools" | "dflies" | "bflies" | "teal" | "basks": the nearest such place),
//   overlay ("wet" | "wear" | "stage" | "cap"), wait (ms), and, for the valley's life and air:
//   days    move the valley's clock this many valley days (real hours) ahead first
//   until   "snowy": then on a valley day at a time (at most eight) until it is a snow day
//   hour    then on to the next time it is this hour (0..24, What the Water Brings' clock)
//           (every move is replayed in full by the worker, as a dev jump is; views run in order,
//           and the clock only ever goes forward)
//   storm   true: make a storm happen (the dev menu's "A storm": a real flood)
//   weather "clear" | "cloudy" | "rain" | "storm": draw this weather (the page only; the
//           valley's own weather stays as it is)
//   heal    true: pretend the floor has healed (pools, channels and marsh on the page's copy
//           only, for seeing how the creatures fill a wetland; the worker's next water message,
//           every ten minutes, puts the real water back)
//   visit   true: a creekfolk comes to stand in the middle of the view (a copy of one, on the
//           page only), to see the creatures there take flight
//   frames  draw at least this many frames before the picture (weather eases in over frames)
//   flash   true: take the picture at a flash of lightning (in a storm) }
// Each view prints what the creatures and the air are showing.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [src, out, viewsFile, W = 1280, H = 800] = process.argv.slice(2);
const DEFAULT_VIEWS = [
  { name: 'air', hv: 260, el: 1.3, az: 0.0 },
  { name: 'air-low', hv: 200, el: 0.62, az: 0.5 },
  { name: 'village', hv: 60, el: 0.9, az: 0.6, atMeadow: true },
  { name: 'village-close', hv: 22, el: 0.8, az: 0.6, atMeadow: true },
  { name: 'folk', hv: 9, el: 0.6, az: 0.6, follow: true },
  { name: 'face', hv: 2.8, el: 0.35, az: 0.6, follow: true },
  { name: 'creek', hv: 30, el: 0.8, az: 1.2, atCreek: 70 },
  { name: 'ledge', hv: 26, el: 0.7, az: 1.6, atLedge: true },
  { name: 'dryfork', hv: 50, el: 0.8, az: -0.8, atDry: true },
];
const views = viewsFile && viewsFile !== '-' ? JSON.parse(fs.readFileSync(viewsFile, 'utf8')) : DEFAULT_VIEWS;
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: +W, height: +H } });
await ctx.route('**/*', (r) => (/^(file|blob|data):/.test(r.request().url()) ? r.continue() : r.abort()));
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(String(e)));
p.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && errs.push(m.type() + ': ' + m.text()));
await p.goto('file://' + path.join(root, 'dist/creekfolk2-dev.html'));
await p.waitForTimeout(1200);
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
await p.waitForFunction(() => window.__cf2.vw.ready && window.__cf2.renderer && window.__cf2.renderer.ready, null, { timeout: 120000 });
await p.evaluate(() => window.__cf2.dev.pause(true));
// count the frames drawn, and hold the picture still when asked (to catch a flash of lightning)
await p.evaluate(() => {
  const R = window.__cf2.renderer,
    f0 = R.frame;
  window.__frames = 0;
  R.frame = function (t, dt) {
    if (this.hold) return;
    const fl = this.air ? this.air.flash : 0; // what this frame's light() will use
    f0.call(this, t, dt);
    window.__frames++;
    if (this.holdAtFlash && fl > 0.6) this.hold = true;
  };
});
const info = await p.evaluate(() => ({ kind: window.__cf2.renderer.constructor.name, t: window.__cf2.vw.t, n: window.__cf2.vw.cs.size }));
console.log('renderer', info.kind, 'day', (info.t / 86400).toFixed(2), info.n, 'creekfolk');

// move the valley's clock forward to valley time tt, let the worker replay it, and pause again
async function moveTo(tt) {
  await p.evaluate((tt) => {
    const a = window.__cf2;
    if (a.paused) a.dev.pause(false);
    a.Clock.setDev(a.vw.calStart + tt * 1000 - Date.now() - a.Clock.fix);
    a.setClock(true);
  }, tt);
  await p.waitForFunction((tt) => !window.__cf2.catching && window.__cf2.vw.t >= tt - 3, tt, { timeout: 900000, polling: 500 });
  await p.evaluate(() => window.__cf2.dev.pause(true));
}
const frames = () => p.evaluate(() => window.__frames);
const atHour = (h) =>
  p.evaluate((h) => {
    // the valley time of the next moment it is hour h (cf2Hour in view3d.js, turned round)
    const vw = window.__cf2.vw,
      len = vw.cycle.len,
      off = vw.cycle.off,
      ph = h < 5.6 ? (h / 5.6) * 0.2 : h < 20.2 ? 0.2 + ((h - 5.6) / 14.6) * 0.62 : 0.82 + ((h - 20.2) / 3.8) * 0.18,
      p0 = (((vw.t / len + off) % 1) + 1) % 1;
    let dp = ph - p0;
    if (dp < 0.002) dp += 1;
    return vw.t + dp * len;
  }, h);

for (const v of views) {
  if (v.days) await moveTo((await p.evaluate(() => window.__cf2.vw.t)) + v.days * 3600);
  if (v.until === 'snowy')
    for (let i = 0; i < 8 && !(await p.evaluate(() => (window.__cf2.renderer.air || {}).snowy)); i++) {
      await moveTo((await p.evaluate(() => window.__cf2.vw.t)) + 3600);
      const f = await frames();
      await p.waitForFunction((f) => window.__frames > f + 1, f, { timeout: 120000 });
    }
  if (v.hour != null) await moveTo(await atHour(v.hour));
  if (v.storm) {
    await p.evaluate(() => window.__cf2.post({ type: 'trigger', what: 'storm' }));
    await p.waitForFunction(() => window.__cf2.vw.weather.state === 'storm', null, { timeout: 60000 });
  }
  if (v.weather) await p.evaluate((s) => (window.__cf2.vw.weather = { ...window.__cf2.vw.weather, state: s, rain: s === 'storm' ? 1.6 : s === 'rain' ? 1 : 0 }), v.weather);
  if (v.heal)
    await p.evaluate(() => {
      // a pretend healed floor, for looking only: much of it under shallow standing water in a
      // pattern of pools and channels, most of the rest marsh (the page's copy only)
      const vw = window.__cf2.vw,
        T = vw.T,
        g = vw.grids,
        VW = 160,
        VL = 224;
      for (let z = 0; z < VL; z++)
        for (let x = 0; x < VW; x++) {
          if (T.floorWeight(x + 0.5, z + 0.5) < 0.5) continue;
          const k = z * VW + x,
            n = Math.sin(x * 0.31 + 1.7) * Math.cos(z * 0.23) + 0.5 * Math.sin((x + z) * 0.13),
            h = Math.max(T.h[z * (VW + 1) + x], T.h[z * (VW + 1) + x + 1], T.h[(z + 1) * (VW + 1) + x], T.h[(z + 1) * (VW + 1) + x + 1]);
          if (n > 0.3) g.wt[k] = Math.max(g.wt[k], h + 0.1 + 0.25 * (n - 0.3));
          if (n > -0.35) g.wet[k] = 1;
          g.green[k] = 1;
        }
      vw.wetNow = 0.75;
      vw.waterV++;
    });
  await p.evaluate((v) => {
    const a = window.__cf2,
      R = a.renderer,
      vw = a.vw,
      T = vw.T,
      G = R.view.goal;
    R.follow(null);
    let x = v.x ?? G.x,
      z = v.z ?? G.z;
    if (v.atMeadow && vw.meadow) (x = vw.meadow.x + 4), (z = vw.meadow.z + 6);
    if (v.atCreek != null) (z = v.atCreek), (x = T.creekX(z));
    if (v.atLedge) (z = T.zLedge), (x = T.creekX(z));
    if (v.atDry) (z = T.zDry - 4), (x = T.branches.dry.X[Math.floor(T.branches.dry.n / 2)]);
    if (v.atHeron && R.life && R.life.counts.heron) (x = R.life.counts.heron[0] + 1.5), (z = R.life.counts.heron[1] + 1);
    if (v.follow) {
      let t = vw.tNow(),
        best = null,
        bd = 1e9;
      for (const c of vw.cs.values()) {
        if (c.away || !c.look) continue;
        const q = vw.posOf(c, t),
          d = Math.hypot(q.x - (vw.meadow ? vw.meadow.x : x), q.z - (vw.meadow ? vw.meadow.z : z));
        if (d < bd) (bd = d), (best = c);
      }
      if (best) R.follow(best.id);
    }
    Object.assign(G, { x, z, hv: v.hv ?? G.hv, el: v.el ?? G.el, az: v.az ?? G.az });
    Object.assign(R.view, { x: G.x, z: G.z, hv: G.hv, el: G.el, az: G.az });
    R.setOverlay(v.overlay || null);
  }, v);
  // the creatures read the water round the view a few rows a frame
  const settle = async () => {
    // (two frames first, so the creatures have seen where the view is now)
    const fs0 = await frames();
    await p.waitForFunction((n) => window.__frames >= n, fs0 + 2, { timeout: 600000, polling: 200 }).catch(() => {});
    await p.waitForFunction(() => window.__cf2.renderer.valley.busy() === 0, null, { timeout: 180000 }).catch(() => {});
    await p.waitForFunction(() => !window.__cf2.renderer.life || window.__cf2.renderer.life.counts.settled, null, { timeout: 180000, polling: 200 }).catch(() => {});
  };
  await settle();
  if (v.at) {
    // then onto the nearest of that kind (its readout is updated twice a second: a few frames)
    const f1 = await frames();
    await p.waitForFunction((n) => window.__frames >= n, f1 + 8, { timeout: 600000, polling: 200 }).catch(() => {});
    const at = await p.evaluate((k) => {
      const R = window.__cf2.renderer,
        a = R.life && R.life.counts.at && R.life.counts.at[k];
      if (a) Object.assign(R.view.goal, { x: a[0], z: a[1] }), Object.assign(R.view, { x: a[0], z: a[1] });
      return a || null;
    }, v.at);
    console.log('  at', v.at, JSON.stringify(at));
    await settle();
  }
  if (v.visit)
    await p.evaluate(() => {
      const a = window.__cf2,
        vw = a.vw,
        V = a.renderer.view,
        c = [...vw.cs.values()].find((c) => c.look && !c.away);
      if (c) vw.cs.set('visit-test', { ...c, id: 'visit-test', act: null, x: V.x + 0.3, z: V.z + 0.2 });
    });
  const f0 = await frames();
  await p.waitForFunction((n) => window.__frames >= n, f0 + (v.frames ?? 3), { timeout: 600000, polling: 200 }).catch(() => {});
  await p.waitForTimeout(v.wait ?? 1200);
  if (v.flash) {
    await p.evaluate(() => (window.__cf2.renderer.holdAtFlash = true));
    await p.waitForFunction(() => window.__cf2.renderer.hold, null, { timeout: 600000, polling: 100 }).catch(() => console.log('  (no flash came)'));
  }
  const file = path.join(out, `${v.name}.png`);
  await p.screenshot({ path: file, timeout: 180000 });
  const said = await p.evaluate(() => {
    const a = window.__cf2,
      R = a.renderer;
    R.hold = false;
    R.holdAtFlash = false;
    a.vw.cs.delete('visit-test');
    return { day: (a.vw.t / 86400).toFixed(3), season: a.vw.season, weather: a.vw.weather.state, hv: +R.view.hv.toFixed(1), frames: window.__frames, life: R.life ? R.life.counts : null, air: R.air ? R.air.said : null };
  });
  console.log(file, JSON.stringify(said));
}
console.log(errs.length ? 'errors:\n  ' + [...new Set(errs)].slice(0, 12).join('\n  ') : 'no errors');
await browser.close();

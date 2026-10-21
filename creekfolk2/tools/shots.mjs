// Screenshots of the 3D valley: open a saved valley (or a new one) in the dev build, set the
// camera to each view, let the tiles build, and save a picture of each.
//
//   node tools/build.mjs --dev && node tools/shots.mjs <save.json | new> <out dir> [views.json] [w h]
//
// A view: { name, x, z, hv (metres of view, top to bottom), el (0.12 low .. 1.5 overhead),
//   az (radians), hour (valley hour 0..24, optional), follow (true: the nearest creekfolk),
//   overlay ("wet" | "wear" | "stage" | "cap"), wait (ms) }
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
const info = await p.evaluate(() => ({ kind: window.__cf2.renderer.constructor.name, t: window.__cf2.vw.t, n: window.__cf2.vw.cs.size }));
console.log('renderer', info.kind, 'day', (info.t / 86400).toFixed(2), info.n, 'creekfolk');
for (const v of views) {
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
    if (v.hour != null) {
      // set the valley's clock to that hour of today (paused)
      const day = Math.floor((vw.t / 3600 + vw.cycle.off) / 24 ) * 0;
    }
  }, v);
  await p.waitForFunction(() => window.__cf2.renderer.valley.busy() === 0, null, { timeout: 180000 }).catch(() => {});
  await p.waitForTimeout(v.wait ?? 1200);
  const file = path.join(out, `${v.name}.png`);
  await p.screenshot({ path: file, timeout: 180000 });
  console.log(file);
}
console.log(errs.length ? 'errors:\n  ' + [...new Set(errs)].slice(0, 12).join('\n  ') : 'no errors');
await browser.close();

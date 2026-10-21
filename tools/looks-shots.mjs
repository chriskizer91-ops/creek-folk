// Pictures of creekfolk looks (Phase 3C): a saved valley in headless Chromium, with the
// valley's clock paused and chosen creekfolk stood together for a portrait.
//
//   node tools/looks-shots.mjs <save.json> <out-prefix> "<shot>;<shot>;..."
//
// shots:
//   family:ID[:dist]          the creekfolk ID, its partner, their living children and
//                             grandchildren, in rows by generation, facing the camera
//   lineup:ID+ID+...[:dist]   these creekfolk in a row, facing the camera
//   rows:ID+ID/ID+ID/...[:dist]  rows of creekfolk, the first row at the back
//   sit:ID+ID+...[:dist]      the same, sitting
//   walk:ID+ID...[:dist]      these creekfolk walking slowly across (the clock runs)
//   close:ID[:dist]           one creekfolk where it is (facing the camera)
//   follow:ID[:dist]          follow one creekfolk for a few seconds with the clock running
//   view:x,z,dist,yaw,pitch   anywhere
// The staging (positions, poses) only changes the page's copy of the valley, never the save.
// Build first (node tools/build.mjs --dev); it loads dist/creekfolk.html.
import { chromium } from 'playwright';
import fs from 'node:fs';
const [file, prefix = 'shots/looks/x', plan = ''] = process.argv.slice(2);
const save = fs.readFileSync(file, 'utf8');
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const logs = [];
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.stack || e.message}`));
page.on('console', (m) => { if (m.type() === 'error') logs.push(`[error] ${m.text()}`); });
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
await page.waitForTimeout(800);
// stop the valley's clock first, so nothing moves the creekfolk once they are stood together
await page.evaluate(() => { try { __creek.dev.pause(true); } catch (e) {} });
await page.waitForTimeout(1000);

let k = 0;
for (const shot of plan.split(';').filter(Boolean)) {
  const [kind, arg = '', distArg] = shot.split(':');
  const res = await page.evaluate(([kind, arg, distArg]) => {
    const app = __creek, w = app.world, r = app.rig;
    const pause = (on) => { try { app.dev.pause(on); } catch (e) {} };
    const cam = (x, z, dist, yaw, pitch) => { r.follow = null; r.ambient = false; Object.assign(r.goal, { x, z, dist, yaw, pitch }); Object.assign(r.cur, { x, z, dist, yaw, pitch }); };
    const yaw = 0.55, pitch = 0.32;
    // stand (or sit) creekfolk in rows facing the camera, at a flat open spot near the meadow
    const stage = (rows, sit) => {
      pause(true);
      const T = w.terrain, mx = w.meadow.x, mz = w.meadow.z;
      const STRUCTURES_R = { home: 3.5, store: 3.5, workshop: 4, meeting: 4, garden: 3, temple: 9, ancestors: 7, lookout: 3, chimes: 2, crossing: 2, dam: 2 };
      let best = null;
      for (let dx = -24; dx <= 24; dx += 2) for (let dz = -24; dz <= 24; dz += 2) {
        const x = mx + dx, z = mz + dz;
        if (!T.walkable(x, z) || T.isWater(x, z)) continue;
        let flat = 0, ok = true;
        for (let a = -2.5; a <= 2.5; a += 0.5) for (let b = -2; b <= 2; b += 0.5) {
          if (!T.walkable(x + a, z + b) || T.isWater(x + a, z + b)) ok = false;
          flat += Math.abs(T.heightAt(x + a, z + b) - T.heightAt(x, z));
        }
        // nothing built near the spot or between it and the camera, and nobody else in the way
        const near = (px, pz, r) => w.structures.some((s) => Math.hypot(s.x - px, s.z - pz) < r + ((STRUCTURES_R[s.kind]) || 1.5));
        const tall = { tree: 2.6, podtree: 2.6, orchard: 2.2, grove: 2.6, bush: 1.6, boulder: 1.6, snag: 2 };
        const trees = (px, pz, r) => w.res.some((t) => tall[t.kind] && Math.hypot(t.x - px, t.z - pz) < r + tall[t.kind]);
        let busy = near(x, z, 3) || trees(x, z, 2) || w.creatures.some((c) => !rows.flat().includes(c) && Math.hypot(c.x - x, c.z - z) < 4);
        for (const d of [2, 4, 6, 8, 10, 12]) busy = busy || near(x + Math.sin(yaw) * d, z + Math.cos(yaw) * d, 2) || trees(x + Math.sin(yaw) * d, z + Math.cos(yaw) * d, 1);
        const score = flat + 0.04 * Math.hypot(dx, dz);
        if (ok && !busy && (!best || score < best.score)) best = { x, z, score };
      }
      const at = best || { x: mx, z: mz };
      const right = [Math.cos(yaw), -Math.sin(yaw)], back = [-Math.sin(yaw), -Math.cos(yaw)];
      rows.forEach((row, ri) => row.forEach((c, i) => {
        const off = (i - (row.length - 1) / 2) * 0.95, dep = ((rows.length - 1) / 2 - ri) * 1.25;
        c.x = at.x + right[0] * off + back[0] * dep; c.z = at.z + right[1] * off + back[1] * dep;
        c.face = yaw; c.carry = null; c.asleep = false; c.attend = null; c.emo = null;
        c.act = sit ? { type: 'sit', step: 'sit', t0: w.t, t1: w.t + 1e5, x: c.x, z: c.z, tok: c.tok } : null;
      }));
      return at;
    };
    const fam = (id) => {
      const c = w.byId[id]; if (!c) return [];
      const g0 = [c, w.byId[c.partner]].filter(Boolean);
      const kids = [...new Set(g0.flatMap((p) => p.children || []))].map((i) => w.byId[i]).filter(Boolean);
      const grand = [...new Set(kids.flatMap((p) => [...(p.children || []), ...((w.byId[p.partner] || {}).children || [])]))].map((i) => w.byId[i]).filter(Boolean);
      const partners = kids.map((p) => w.byId[p.partner]).filter((p) => p && !kids.includes(p) && !g0.includes(p));
      return [g0, [...kids, ...partners], grand].filter((r) => r.length);
    };
    const FUR = ['cream', 'sandy', 'wheat', 'honey', 'golden', 'ochre', 'ginger', 'copper', 'rust', 'chestnut', 'brown', 'cocoa', 'dusky', 'grey', 'taupe', 'silver', 'slate', 'blue-grey', 'blue', 'teal', 'periwinkle', 'lavender', 'pink', 'blush'];
    const stageOf = (c) => { const a = (w.t - (c.born || 0)) / 86400; return a < 7 ? 'child' : a < 24 ? 'adult' : 'elder'; };
    const desc = (c) => `${c.name}#${c.id} ${stageOf(c)} ${FUR[c.look.fur]} ${c.look.pat}${c.look.face && c.look.face !== 'none' ? ' ' + c.look.face : ''}${c.look.socks ? ' socks' : ''} ${c.look.wear || ''}${c.treasure && c.beliefs && c.beliefs.giver > 0.5 ? ' +' + c.treasure : ''}`;
    if (kind === 'family' || kind === 'lineup' || kind === 'sit' || kind === 'rows') {
      const rows = kind === 'family' ? fam(+arg) : arg.split('/').map((r) => r.split('+').map((i) => w.byId[+i]).filter(Boolean));
      const at = stage(rows, kind === 'sit');
      const n = Math.max(...rows.map((r) => r.length));
      cam(at.x, at.z, +distArg || Math.max(4.5, n * 1.5 + rows.length * 1.2), yaw, rows.length > 1 ? 0.5 : pitch);
      return rows.map((r) => r.map(desc).join(' | ')).join('\n');
    }
    if (kind === 'walk') {
      // walk them slowly across in front of the camera, with the clock running
      const cs = arg.split('+').map((i) => w.byId[+i]).filter(Boolean);
      const at = stage([cs], false);
      pause(false);
      const right = [Math.cos(yaw), -Math.sin(yaw)];
      cs.forEach((c, i) => {
        const x0 = c.x - right[0] * 2.5, z0 = c.z - right[1] * 2.5, x1 = c.x + right[0] * 2.5, z1 = c.z + right[1] * 2.5;
        c.tok = (c.tok || 0) + 1; // the walk they were on ends quietly
        c.act = { type: 'walk', step: 'walk', t0: w.t, t1: w.t + 60, x: x1, z: z1, tok: c.tok, path: [{ x: x0, z: z0, t: w.t }, { x: x1, z: z1, t: w.t + 14 }] };
      });
      cam(at.x, at.z, +distArg || 4.5, yaw, pitch);
      return cs.map(desc).join(' | ');
    }
    if (kind === 'close') {
      pause(true);
      const c = w.byId[+arg]; c.face = yaw; c.attend = null;
      cam(c.x, c.z, +distArg || 3.5, yaw, pitch);
      return desc(c);
    }
    if (kind === 'follow') {
      pause(false);
      const c = w.byId[+arg]; r.ambient = false; r.follow = c.id; r.goal.dist = +distArg || 5; r.goal.pitch = pitch;
      return desc(c);
    }
    if (kind === 'view') { const [x, z, d, y, p] = arg.split(',').map(Number); cam(x, z, d, y, p); return 'view'; }
  }, [kind, arg, distArg]);
  await page.waitForTimeout(kind === 'follow' ? 6000 : 2500);
  const out = `${prefix}-${++k}.png`;
  await page.screenshot({ path: out });
  console.log(out, '\n  ' + String(res).replace(/\n/g, '\n  '));
}
console.log(logs.join('\n') || '(no errors)');
await browser.close();

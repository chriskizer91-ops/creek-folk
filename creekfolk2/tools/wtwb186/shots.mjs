// Scripted pictures of both builds, for comparing them pair by pair (after build.mjs):
//
//   node tools/wtwb186/shots.mjs [--builds r128,r186] [--size 1280x720] [scenario.json ...]
//     -> tools/wtwb186/out/shots/<build>/<name>.png      the WebGL canvas only (the HUD is HTML, the same in both)
//
// The scenarios default to WTWB's own tools/look.json (spots, hours, storm) and tools/easy.json (Easy to see). Each shot is the
// one tools/shots.py takes: {name, easy, hour, storm, at: [x, z] or a spot name, yaw, el, az, zoom, step, eval, quality}.
// Differences from shots.py, so the two builds can be compared picture by picture:
//   - the page opens with ?paused: nothing moves between shots except through WWB.step (fixed steps), so the game clock, the
//     wind, the water and the clouds are at the same moment in both builds;
//   - Math.random is seeded, with a separate stream for three.js itself (it draws on Math.random for every object's uuid, and
//     r128 and r186 make different numbers of objects), so the game's own random numbers come out the same in both;
//   - no sound (the noise buffers would draw on Math.random too) and no network (the HUD's web fonts are refused);
//   - the picture is read from the canvas (preserveDrawingBuffer, ?shots) rather than taken of the screen.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const ref = path.join(root, 'ref', 'what-the-water-brings');
const args = process.argv.slice(2);
function opt(name, def) { const i = args.indexOf(name); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; }
const builds = opt('--builds', 'r128,r186').split(',');
const [W, H] = opt('--size', '1280x720').split('x').map(Number);
const scen = args.length ? args : [path.join(ref, 'tools', 'look.json'), path.join(ref, 'tools', 'easy.json')];
const shots = scen.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')));

// the lines of game.html that hold three.js (its <script> is the template's /*@@THREE@@*/ line)
function threeLines(html) {
  const text = fs.readFileSync(html, 'utf8'), at = text.indexOf('<script>') + '<script>'.length;
  const end = text.indexOf('</script>', at), line = (i) => text.slice(0, i).split('\n').length;
  return [line(at), line(end)];
}

// runs in the page before any of its scripts
function prelude({ from, to, seed }) {
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const game = mulberry(seed), lib = mulberry(seed ^ 0x5bd1e995);
  const stats = window.__rand = { game: 0, lib: 0 };
  function random() {
    const keep = Error.prepareStackTrace; let line = -1;
    try { Error.prepareStackTrace = (e, cs) => cs; const o = {}; Error.captureStackTrace(o, random); const cs = o.stack; if (cs && cs[0] && /game\.html/.test(cs[0].getFileName() || '')) line = cs[0].getLineNumber(); }
    finally { Error.prepareStackTrace = keep; }
    if (line >= from && line <= to) { stats.lib++; return lib(); }
    stats.game++; return game();
  }
  Math.random = random;
  window.AudioContext = undefined; window.webkitAudioContext = undefined;
}

// the shot itself, as tools/shots.py does it
function take(s) {
  const W = window.WWB; W.pause(true);
  if (s.storm) W.startStorm(); else if (W.save.weather === 'storm') W.endStorm();
  W.resetView && W.resetView();
  if (s.hour != null) W.setHour(s.hour);
  let at = s.at;
  if (typeof at === 'string') { const sp = W.world.spots; const o = (sp.poems && sp.poems[at]) || sp[at]; at = o.seat ? [o.seat.x, o.seat.z] : (o.x != null ? [o.x, o.z] : [o[0], o[2] != null ? o[2] : o[1]]); }
  if (at) W.teleport(at[0], at[1], s.yaw || 0);
  if (s.az != null) { W.view.az = W.view.azGoal = s.az; }
  if (s.el != null) { W.view.el = W.view.elGoal = s.el; }
  if (s.zoom != null) { W.view.zoom = W.view.zoomGoal = s.zoom; }
  if (s.eval) eval(s.eval);
  W.step(s.step || 2.0, 20); W.snap(); W.render();
  return { P: [+W.P.x.toFixed(3), +W.P.z.toFixed(3)], hour: W.sky.hour, rand: window.__rand.game, png: W.renderer.domElement.toDataURL('image/png') };
}

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const summary = {};
for (const build of builds) {
  const html = path.join(here, 'out', build, 'game.html');
  if (!fs.existsSync(html)) throw new Error(html + ' is missing: run build.mjs first');
  const [from, to] = threeLines(html), dir = path.join(here, 'out', 'shots', build);
  fs.mkdirSync(dir, { recursive: true });
  const groups = new Map();
  for (const s of shots) { const k = JSON.stringify([!!s.easy, s.quality || 'medium', !!s.mobile]); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(s); }
  for (const [k, list] of groups) {
    const [easy, q, mobile] = JSON.parse(k), t0 = Date.now();
    const ctx = await browser.newContext({ viewport: { width: mobile ? 390 : W, height: mobile ? 844 : H }, deviceScaleFactor: mobile ? 3 : 1, isMobile: mobile, hasTouch: mobile });
    await ctx.route('**/*', (r) => (r.request().url().startsWith('file:') ? r.continue() : r.abort()));
    await ctx.addInitScript(prelude, { from, to, seed: 20260521 });
    const pg = await ctx.newPage(); pg.setDefaultTimeout(600000);
    const logs = [];
    pg.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text()); });
    pg.on('pageerror', (e) => logs.push('PAGEERROR: ' + e.message));
    await pg.goto('file://' + html + '?fresh&paused&shots&q=' + q + (easy ? '#easy' : ''));
    await pg.waitForFunction('window.WWB && WWB.ready', null, { timeout: 600000 });
    await pg.evaluate('WWB.start()');
    for (const s of list) {
      const r = await pg.evaluate(take, s);
      fs.writeFileSync(path.join(dir, s.name + '.png'), Buffer.from(r.png.split(',')[1], 'base64'));
      delete r.png; summary[build + '/' + s.name] = r;
      console.log(build, s.name, JSON.stringify(r));
    }
    console.log(`  ${build} ${k}: ${((Date.now() - t0) / 1000).toFixed(0)} s, Math.random calls ${JSON.stringify(await pg.evaluate('window.__rand'))}`);
    for (const l of [...new Set(logs)].slice(0, 12)) console.log('   ', l.slice(0, 300));
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(here, 'out', 'shots', 'summary.json'), JSON.stringify(summary, null, 1));

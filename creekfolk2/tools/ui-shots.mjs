// Screenshots of the interface over the valley: the start, the village sheet (its tabs), a
// creekfolk's mind, settings and the dev menu, on a laptop and on a phone. For looking at.
//
//   node tools/build.mjs --dev && node tools/ui-shots.mjs <save.json> <out dir>
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [src, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errs = [];
for (const [name, vp] of [
  ['laptop', { width: 1280, height: 800 }],
  ['phone', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor || 1, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
  await ctx.route('**/*', (r) => (/^(file|blob|data):/.test(r.request().url()) ? r.continue() : r.abort()));
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file://' + path.join(root, 'dist/creekfolk2-dev.html'));
  await p.waitForTimeout(1500);
  if (await p.isVisible('#vStart')) await p.screenshot({ path: path.join(out, `${name}-start.png`) });
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
  await p.waitForFunction(() => window.__cf2.renderer.valley.busy() === 0, null, { timeout: 180000 }).catch(() => {});
  await p.waitForTimeout(1500);
  await p.screenshot({ path: path.join(out, `${name}-valley.png`), timeout: 180000 });
  // the village sheet and each of its tabs
  await p.click('#bVillage');
  await p.waitForSelector('#vSheet:not([hidden])', { timeout: 60000 });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: path.join(out, `${name}-village.png`), timeout: 180000 });
  for (const tab of ['log', 'people']) {
    await p.click(`#sheet [data-tab="${tab}"]`);
    await p.waitForTimeout(800);
    await p.screenshot({ path: path.join(out, `${name}-village-${tab}.png`), timeout: 180000 });
  }
  // someone's mind, from the people tab
  const who = await p.$('#sheet .who');
  if (who) {
    await who.click();
    await p.waitForTimeout(1500);
    await p.screenshot({ path: path.join(out, `${name}-mind.png`), timeout: 180000 });
  }
  await p.keyboard.press('Escape');
  await p.evaluate(() => document.querySelectorAll('.veil').forEach((v) => (v.hidden = true)));
  await p.click('#bSettings');
  await p.waitForTimeout(800);
  await p.screenshot({ path: path.join(out, `${name}-settings.png`), timeout: 180000 });
  await p.evaluate(() => document.querySelectorAll('.veil').forEach((v) => (v.hidden = true)));
  await p.click('#bDev');
  await p.waitForTimeout(800);
  await p.screenshot({ path: path.join(out, `${name}-dev.png`), timeout: 180000 });
  await ctx.close();
}
console.log(errs.length ? 'errors:\n  ' + errs.slice(0, 8).join('\n  ') : 'no errors');
await browser.close();

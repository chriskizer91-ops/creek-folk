// The village panel's Land tab (with the grove and the goats) for a saved valley, as
// text and a screenshot.   node tools/grove-land.mjs <save.json> <out.png>
import { chromium } from 'playwright';
import fs from 'node:fs';
const [file, out] = process.argv.slice(2);
const save = fs.readFileSync(file, 'utf8');
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(`[pageerror] ${e.stack || e.message}`));
await page.goto('file://' + process.cwd() + '/dist/creekfolk.html');
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 30000 });
await page.evaluate(async (s) => { const w = JSON.parse(s); w.realStart = Date.now() - w.t * 1000; w.skip = 0; window.__creek.world = null; await window.__creek.store.put('main', JSON.stringify(w)); }, save);
await page.reload();
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 60000 });
errs.length = 0;
await page.evaluate(() => document.querySelectorAll('[data-go], .summary button').forEach((b) => b.click()));
await page.evaluate(() => __creek.hud.open('village'));
await page.waitForTimeout(1000);
await page.evaluate(() => { const b = [...document.querySelectorAll('[data-tab]')].find((b) => /:land$/.test(b.dataset.tab)); b && b.click(); });
await page.waitForTimeout(1500);
await page.evaluate(() => { const s = document.querySelector('.sh-body'); if (s) s.scrollTop = s.scrollHeight; });
await page.waitForTimeout(500);
const txt = await page.evaluate(() => document.querySelector('.sh-body')?.innerText || '');
console.log(txt.slice(txt.indexOf('The memorial grove') >= 0 ? txt.indexOf('The memorial grove') : 0));
await page.screenshot({ path: out });
console.log(errs.join('\n') || '(no errors)');
await browser.close();

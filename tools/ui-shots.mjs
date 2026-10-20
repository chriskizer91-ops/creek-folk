// Screenshots of the 3B interface for a saved valley: the gift sheet and the village's
// Temple tab.   node tools/ui-shots.mjs <save> <prefix>
import { chromium } from 'playwright';
import fs from 'node:fs';
const [file, prefix] = process.argv.slice(2);
const save = fs.readFileSync(file, 'utf8');
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(e.stack || e.message));
await page.goto('file://' + process.cwd() + '/dist/creekfolk.html');
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 30000 });
await page.evaluate(async (s) => { const w = JSON.parse(s); w.realStart = Date.now() - w.t * 1000; w.skip = 0; window.__creek.world = null; await window.__creek.store.put('main', JSON.stringify(w)); }, save);
await page.reload();
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 60000 });
errs.length = 0;
await page.evaluate(() => document.querySelectorAll('[data-go], .summary button').forEach((b) => b.click()));
await page.evaluate(() => __creek.hud.open('village'));
await page.waitForTimeout(500);
await page.evaluate(() => document.querySelector('[data-tab="v:temple"]')?.click());
await page.waitForTimeout(1200);
await page.screenshot({ path: `${prefix}-temple.png` });
console.log('---\n' + (await page.evaluate(() => document.querySelector('.sh-body')?.innerText || '')).slice(0, 1500));
await page.evaluate(() => { __creek.hud.close(); __creek.world.giftLast = -1e9; __creek.hud.open('gift'); }); // so the choices show
await page.waitForTimeout(1500);
await page.screenshot({ path: `${prefix}-gift.png` });
console.log((await page.evaluate(() => document.querySelector('.sh-body')?.innerText || '')).slice(0, 900));
console.log(errs.length ? errs.join('\n') : '(no errors)');
await browser.close();

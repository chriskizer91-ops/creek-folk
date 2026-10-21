// The dev build in headless Chromium: every gift and every belief trigger from the dev
// menu, with frames drawn between them; then the gift sheet and the Temple tab open.
//   node tools/browser-gifts.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
const logs = [];
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`[${m.type()}] ${m.text()}`); });
await page.goto('file://' + process.cwd() + '/dist/creekfolk-dev.html');
await page.waitForTimeout(1500);
await page.evaluate(() => document.querySelectorAll('[data-go]').forEach((b) => b.click()));
await page.waitForTimeout(800);
await page.click('#devbtn');
await page.waitForTimeout(300);
const gifts = await page.evaluate(() => [...document.querySelectorAll('#devmenu button[data-gift]')].map((b) => b.dataset.gift));
const triggers = await page.evaluate(() => [...document.querySelectorAll('#devmenu button[data-trigger]')].filter((b) => !b.disabled).map((b) => b.dataset.trigger));
for (const g of gifts) {
  await page.evaluate((g) => document.querySelector(`#devmenu button[data-gift="${g}"]`).click(), g); // the menu redraws often
  await page.waitForTimeout(400);
  console.log('gift', g.padEnd(8), '->', (await page.evaluate(() => __creek.dev.note)).slice(0, 100));
}
for (const t of triggers) {
  await page.evaluate((t) => document.querySelector(`#devmenu button[data-trigger="${t}"]`).click(), t);
  await page.waitForTimeout(400);
  console.log('trigger', t.padEnd(9), '->', (await page.evaluate(() => __creek.dev.note)).slice(0, 100));
}
await page.waitForTimeout(1500); // a few seconds of drawing with all of it in the valley
const w = await page.evaluate(() => ({ gifts: __creek.world.stats.gifts, temple: __creek.world.temple ? __creek.world.temple.state : null, errors: __creek.world.stats.errors || 0 }));
console.log('world:', JSON.stringify(w));
console.log(logs.join('\n') || '(no errors)');
await browser.close();

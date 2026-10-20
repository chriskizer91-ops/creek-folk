// Browser check for Phase 2: give gifts through the HUD, jump ahead, and screenshot
// the stories, places, customs and a creekfolk's own stories.
//   node tools/browser-minds.mjs [days=8]
import { chromium } from 'playwright';
import fs from 'node:fs';
const days = +(process.argv[2] || 8);
fs.mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const logs = [];
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`[${m.type()}] ${m.text()}`); });
await page.goto('file://' + process.cwd() + '/dist/creekfolk.html');
await page.waitForFunction(() => window.__creek && window.__creek.world, null, { timeout: 30000 });
await page.waitForTimeout(1500);
await page.evaluate(() => document.querySelector('[data-go]') && document.querySelector('[data-go]').click());
const waitIdle = async () => {
  for (;;) {
    await page.waitForTimeout(800);
    if (!(await page.evaluate(() => !!__creek.catching))) break;
  }
  await page.evaluate(() => document.querySelectorAll('#summary button').forEach((b) => b.click()));
};
const kinds = ['found', 'rain', 'seeds', 'warm'];
for (let d = 0; d < days; d++) {
  // Give a gift through the HUD, as a player would.
  await page.evaluate(() => __creek.hud.open('gift'));
  await page.waitForTimeout(300);
  const k = kinds[d % 4];
  const clicked = await page.evaluate((k) => { const b = document.querySelector(`[data-act="gift"][data-kind="${k}"]`); if (b) { b.click(); return true; } return false; }, k);
  if (d === 0) await page.screenshot({ path: 'shots/p2-gift-given.png' });
  await page.evaluate(() => __creek.dev.jump(12 * 3600e3));
  await waitIdle();
  await page.evaluate(() => __creek.hud.open('gift'));
  await page.waitForTimeout(200);
  await page.evaluate((k) => { const b = document.querySelector(`[data-act="gift"][data-kind="${k}"]`); b && b.click(); }, kinds[(d + 2) % 4]);
  await page.evaluate(() => __creek.dev.jump(12 * 3600e3));
  await waitIdle();
  if (!clicked) console.log('gift button missing on day', d);
}
const st = await page.evaluate(() => { const w = __creek.world; return { day: +(w.t / 86400).toFixed(1), pop: w.creatures.length, stories: Object.keys(w.stories).length, myths: w.stats.myths || 0, gifts: w.gifts.length, believers: w.creatures.filter((c) => c.beliefs && c.beliefs.giver > 0.5).length, places: (w.placeNames || []).map((p) => p.name), errors: w.stats.errors || 0 }; });
console.log(st);
for (const tab of ['stories', 'places', 'customs']) {
  await page.evaluate((tab) => { __creek.hud.tab.v = tab; __creek.hud.open('village'); __creek.hud.render(true); }, tab);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `shots/p2-village-${tab}.png` });
  await page.evaluate(() => __creek.hud.close());
}
await page.evaluate(() => { const w = __creek.world; const c = w.creatures.slice().sort((a, b) => Object.keys(b.lore || {}).length - Object.keys(a.lore || {}).length)[0]; __creek.hud.tab.c = 'stories'; __creek.select(c.id); });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'shots/p2-creature-stories.png' });
await page.evaluate(() => __creek.hud.open('gift'));
await page.waitForTimeout(500);
await page.screenshot({ path: 'shots/p2-gift-after.png' });
console.log(logs.slice(0, 20).join('\n') || '(no errors)');
await browser.close();

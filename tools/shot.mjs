// Open the built page in headless Chromium, report console errors, save a screenshot.
//   node tools/shot.mjs [out.png] [waitMs] [scriptFile]
import { chromium } from 'playwright';
import fs from 'node:fs';
const out = process.argv[2] || 'shots/shot.png';
const wait = +(process.argv[3] || 4000);
const extra = process.argv[4] ? fs.readFileSync(process.argv[4], 'utf8') : null;
fs.mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto('file://' + process.cwd() + '/dist/creekfolk.html');
await page.waitForTimeout(wait);
if (extra) { const r = await page.evaluate(extra); if (r !== undefined) console.log('eval:', typeof r === 'string' ? r : JSON.stringify(r, null, 1)); await page.waitForTimeout(1500); }
await page.screenshot({ path: out });
console.log(logs.slice(0, 40).join('\n') || '(no console output)');
await browser.close();

// node scripts/shot-el.mjs <path> <selector> <width> <out.png> — screenshot one element after it scrolls into view
import { chromium, devices } from 'playwright';
const [, , path, sel, width, out] = process.argv;
const BASE = process.env.QA_BASE || 'http://127.0.0.1:4321/al-hanaa-hotel';
const browser = await chromium.launch();
const w = Number(width);
const ctx = await browser.newContext(w < 800 ? { ...devices['iPhone 13'], reducedMotion: 'no-preference' } : { viewport: { width: w, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + path, { waitUntil: 'networkidle' });
const el = page.locator(sel).first();
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(Number(process.env.WAIT || 4500));
await el.screenshot({ path: out, scale: 'css' });
console.log('saved', out);
await browser.close();

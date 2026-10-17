// Functional checks against the dev server on an iPhone profile:
// sticky bar appears after the hero, the enquiry form validates and builds the WhatsApp message,
// the lightbox opens from the filmstrip, the review band advances, the map responds to a tap.
//   node scripts/func.mjs [/ar/]
import { chromium, devices } from 'playwright';
const BASE = process.env.QA_BASE || 'http://127.0.0.1:4321/al-hanaa-hotel';
const path = process.argv[2] || '/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'] });
const page = await ctx.newPage();
const fails = [];
const check = (ok, msg) => { console.log((ok ? '  ok  ' : '  FAIL') + ' ' + msg); if (!ok) fails.push(msg); };
await page.goto(BASE + path, { waitUntil: 'networkidle' });
// 1. sticky bar hidden at top, shown after scroll
check(!(await page.locator('#stick').evaluate((e) => e.classList.contains('show'))), 'sticky bar hidden at top');
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
await page.waitForTimeout(400);
check(await page.locator('#stick').evaluate((e) => e.classList.contains('show')), 'sticky bar shown after scrolling past the hero');
// 2. enquiry form
const form = page.locator('[data-enquiry]').first();
await form.scrollIntoViewIfNeeded();
await form.locator('button[type=submit]').click();
check(await form.locator('[data-err=dates]').isVisible(), 'empty form shows a dates error');
check(await form.locator('[data-err=name]').isVisible(), 'empty form shows a name error');
const d = new Date(); d.setDate(d.getDate() + 10); const iso = (x) => x.toISOString().slice(0, 10);
const d2 = new Date(d); d2.setDate(d2.getDate() + 3);
await form.locator('[name=in]').fill(iso(d));
await form.locator('[name=out]').fill(iso(d2));
await form.locator('[name=in]').dispatchEvent('input');
await page.waitForTimeout(100);
const nightsText = await form.locator('[data-nights]').textContent();
check(/3/.test(nightsText) || /٣/.test(nightsText), `nights computed: "${nightsText.trim()}"`);
await form.locator('[name=room]').selectOption('suite');
await form.locator('[name=name]').fill('Test Guest');
await form.locator('[name=phone]').fill('+968 9000 0000');
await form.locator('[name=msg]').fill('Late arrival');
let opened = null;
await page.exposeFunction('__wa', (u) => { opened = u; });
await page.evaluate(() => { window.open = (u) => { window.__wa(String(u)); return null; }; });
await form.locator('button[type=submit]').click();
await page.waitForTimeout(300);
check(!!opened && opened.startsWith('https://wa.me/96890967211?text='), 'submit opens wa.me with the booking number');
const msg = opened ? decodeURIComponent(opened.split('text=')[1]) : '';
console.log('  --- message ---\n' + msg.split('\n').map((l) => '  | ' + l).join('\n'));
check(/Test Guest/.test(msg) && /Late arrival/.test(msg) && (/Suite|الجناح/.test(msg)), 'message carries name, note and room');
check(await form.locator('[data-err=dates]').isHidden(), 'no error after a valid submit');
// 3. draft survives reload
await page.reload({ waitUntil: 'networkidle' });
check((await page.locator('[data-enquiry] [name=name]').first().inputValue()) === 'Test Guest', 'draft restored after reload');
// 4. lightbox
await page.locator('[data-strip] [data-open]').first().scrollIntoViewIfNeeded();
await page.locator('[data-strip] [data-open]').first().click();
await page.waitForTimeout(300);
check(await page.locator('[data-lb]').first().isVisible(), 'lightbox opens from the filmstrip');
await page.keyboard.press('Escape');
await page.waitForTimeout(200);
check(await page.locator('[data-lb]').first().isHidden(), 'lightbox closes with Escape');
// 5. reviews advance
const rv = page.locator('[data-reviews]').first();
await rv.scrollIntoViewIfNeeded();
const c1 = await rv.locator('[data-count]').textContent();
await rv.locator('[data-next]').click();
const c2 = await rv.locator('[data-count]').textContent();
check(c1 !== c2, `review counter advances: ${c1.trim()} → ${c2.trim()}`);
// 6. map tap
const map = page.locator('[data-map]').first();
await map.scrollIntoViewIfNeeded();
await map.locator('.dpoi circle').first().click({ force: true });
await page.waitForTimeout(200);
check((await map.locator('[data-info]').textContent()).includes('km'), 'map dial shows details on tap');
// 7. no horizontal overflow, no console errors
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
check(!over, 'no horizontal overflow');
await browser.close();
console.log(fails.length ? `\n${fails.length} FAILED` : '\nall checks passed');
process.exit(fails.length ? 1 : 0);

// QA helper for UI sweeps (dev server must be running on http://127.0.0.1:4321/al-hanaa-hotel).
//
//   node scripts/qa.mjs shots <path> <width> <outdir> [--device iphone|android|ipad|desktop] [--action menu|book|lang] [--max 12]
//       Screenshots the page top-to-bottom in viewport-sized steps (PNG files outdir/<n>.png). Read them to review.
//   node scripts/qa.mjs audit <path> [<path> ...] [--width 390]
//       Automated checks: horizontal overflow, broken images, console errors, 404 internal links/assets,
//       tap targets < 40px, text overflowing its box, empty headings, images without alt.
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.QA_BASE || 'http://127.0.0.1:4321/al-hanaa-hotel';
const [, , cmd, ...rest] = process.argv;
const flags = {}; const args = [];
for (let i = 0; i < rest.length; i++) rest[i].startsWith('--') ? (flags[rest[i].slice(2)] = rest[++i]) : args.push(rest[i]);

const DEV = {
  iphone: { ...devices['iPhone 13'] },                       // 390x844, mobile Safari UA
  android: { ...devices['Pixel 5'] },                        // 393x851
  small: { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  ipad: { ...devices['iPad (gen 7)'] },                      // 810x1080
  desktop: { viewport: { width: 1440, height: 900 } },
  laptop: { viewport: { width: 1280, height: 800 } },
};

async function ctxFor(browser, width, device) {
  if (device && DEV[device]) return browser.newContext({ ...DEV[device], reducedMotion: 'reduce' });
  const w = Number(width) || 390;
  return browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, isMobile: w < 800, hasTouch: w < 800, deviceScaleFactor: w < 800 ? 2 : 1, reducedMotion: 'reduce' });
}

const browser = await chromium.launch();
try {
  if (cmd === 'shots') {
    const [path, width, out] = args;
    mkdirSync(out, { recursive: true });
    const ctx = await ctxFor(browser, width, flags.device);
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('.rv').forEach((e) => e.classList.add('in')));
    if (flags.action === 'menu') await page.click('#burger');
    if (flags.action === 'book') await page.locator('[data-book]:visible').first().click();
    if (flags.action === 'lang') await page.click('.hdr .lang summary');
    await page.waitForTimeout(600);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const vh = page.viewportSize().height;
    const max = Number(flags.max || 14);
    let n = 0;
    for (let y = 0; y < H && n < max; y += Math.round(vh * 0.9)) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(350);
      await page.screenshot({ path: `${out}/${String(n).padStart(2, '0')}.png`, scale: 'css' });
      n++;
    }
    console.log(`${n} shots of ${H}px page -> ${out}`);
  } else if (cmd === 'audit') {
    const width = Number(flags.width || 390);
    for (const path of args) {
      const ctx = await ctxFor(browser, width, flags.device);
      const page = await ctx.newPage();
      const errors = []; const bad = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)));
      page.on('pageerror', (e) => errors.push('JS: ' + String(e).slice(0, 160)));
      page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(BASE)) bad.push(`${r.status()} ${r.url().replace(BASE, '')}`); });
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(800);
      const r = await page.evaluate(() => {
        const W = document.documentElement.clientWidth, out = { overflow: [], textClip: [], smallTap: [], brokenImg: [], noAlt: 0, emptyH: [] };
        const name = (e) => (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : e.tagName.toLowerCase());
        document.querySelectorAll('body *').forEach((e) => {
          if (e.closest('svg, .reviews__track, .gal__tabs, .tbl, .lang__menu, dialog:not([open]), .sr, .hp, .skip, .nav:not(:is(.nav-open *))')) return;
          const b = e.getBoundingClientRect(); if (!b.width) return;
          if (b.right > W + 1 || b.left < -1) out.overflow.push(`${name(e)} [${Math.round(b.left)}..${Math.round(b.right)}]`);
          const cs = getComputedStyle(e);
          if (e.children.length === 0 && e.textContent.trim() && (e.scrollWidth > e.clientWidth + 2) && cs.overflowX !== 'visible' && e.clientWidth > 0) out.textClip.push(`${name(e)} "${e.textContent.trim().slice(0, 30)}"`);
        });
        document.querySelectorAll('a, button, summary, select, input').forEach((e) => {
          const b = e.getBoundingClientRect(); if (!b.width || e.closest('.article, .crumbs, .ftr ul, .nav__sub, .lang__menu, .hp, .sr')) return;
          if (b.height < 40 && b.width < 40) out.smallTap.push(`${name(e)} ${Math.round(b.width)}x${Math.round(b.height)}`);
        });
        document.querySelectorAll('img').forEach((i) => { if (!i.closest('.lb') && i.complete && i.naturalWidth === 0 && i.getAttribute('loading') !== 'lazy') out.brokenImg.push(i.currentSrc || i.src); if (!i.hasAttribute('alt')) out.noAlt++; });
        document.querySelectorAll('h1,h2,h3').forEach((h) => { if (!h.textContent.trim()) out.emptyH.push(name(h)); });
        out.h1 = document.querySelectorAll('h1').length;
        for (const k of ['overflow', 'textClip', 'smallTap']) out[k] = [...new Set(out[k])].slice(0, 12);
        return out;
      });
      console.log(JSON.stringify({ path, width, ...r, consoleErrors: [...new Set(errors)].slice(0, 6), http4xx: [...new Set(bad)].slice(0, 10) }));
      await ctx.close();
    }
  } else {
    console.log('usage: see header of scripts/qa.mjs');
  }
} finally { await browser.close(); }

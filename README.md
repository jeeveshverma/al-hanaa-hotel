# Al Hanaa Hotel, Salalah — website

Bilingual (English / العربية) static site for **Al Hanaa Hotel** (فندق الهناء), 23rd July Street,
Salalah, Oman. Built with Astro 5, hosted on GitHub Pages, no backend: every "Enquire" button
opens WhatsApp with a structured message to the hotel's booking number.

Live: **https://jeeveshverma.github.io/al-hanaa-hotel/** · Arabic: `/ar/`

## What the site shows (and what it deliberately does not)

Only facts the hotel already publishes: the Google Maps listing (name, street, phone), the
Instagram bio (booking number, "rooms and flats daily / monthly / yearly"), real five-star Google
reviews quoted verbatim, and the hotel's own photos. **No prices, room counts, check-in times or
overall rating appear anywhere** — the enquiry form is the answer to "how much". Adding any of
those later is a one-line change in `src/data/site.ts` or the copy files.

## Where things live

| What | Where |
|---|---|
| Facts: name, phones, WhatsApp number, pin, Instagram | `src/data/site.ts` |
| Room styles and which photos belong to each | `src/data/site.ts` (`ROOMS`) |
| Photo catalogue: group, alt text EN/AR, captions | `src/data/photos.ts` |
| Landmarks with coordinates (distances are computed) | `src/data/places.ts` |
| Five-star Google reviews (verbatim) | `src/data/reviews.ts` |
| Instagram reels shown in the band | `src/data/reels.ts` |
| All wording, per language | `src/i18n/en.json`, `src/i18n/ar.json` |
| Pages | `src/views/*.astro`, routed by `src/pages/[...path].astro` |
| Components (hero, filmstrip, reviews, map, form…) | `src/components/` |
| Design tokens | `src/styles/global.css` (`:root`) |
| Photos (masters) | `src/assets/photos/*.jpg` |

Wording uses `t('key')` from `useT(lang)`; a missing Arabic string falls back to English.

## Editing

- **Change a fact** (phone, WhatsApp number, Instagram): edit `src/data/site.ts`.
- **Change wording**: edit the key in both `en.json` and `ar.json`.
- **Add a photo**: drop the JPG in `src/assets/photos/`, add an entry to `src/data/photos.ts`
  (group + alt text in both languages), then reference its id in `ROOMS` or a page.
- **Add / replace reviews**: `src/data/reviews.ts` — quote verbatim, keep the month, never add
  a score.
- **Add a landmark**: `src/data/places.ts` with its Google Maps coordinates; distance, bearing
  and minutes are computed at build time.
- **Prices or times, if the owner ever wants them public**: add fields to `ROOMS` / `SITE` and
  render them in `src/views/Room.astro`; nothing else needs touching.

## Photos

The masters were cut out of the hotel's Instagram designs (`work/source/`, not committed) by
`scripts/extract-photos.mjs` (finds each photo on the cream ground, splits collages, dedupes)
and finished by `scripts/finish-photos.mjs` (levels, light sharpen, contact sheet). They carry a
faint watermark from the designs; when the owner sends originals (WhatsApp → share as
*Document* to keep quality), replace the files with the same names and rebuild.

Share image and icons: `node scripts/og.mjs` → `public/og-image.jpg`, `public/apple-touch-icon.png`.

## Run locally

```
npm install
npm run dev        # http://127.0.0.1:4321/al-hanaa-hotel/
npm run build      # → dist/
```

QA helpers (dev server running): `node scripts/qa.mjs audit / /ar/ /rooms/ --device iphone`
(overflow, broken images, console errors, tap targets, alt text) and
`node scripts/qa.mjs shots /ar/ 390 work/shots/ar --device iphone` (page screenshots);
`node scripts/shot-el.mjs /salalah/ "#map" 390 out.png` (one element).

## Deploy

Pushing to `main` builds and deploys through `.github/workflows/deploy.yml` (GitHub Pages,
source "GitHub Actions"). The site lives under the `/al-hanaa-hotel` base path
(`astro.config.mjs`).

**Custom domain later**: set `site` in `astro.config.mjs` and `url` in `src/data/site.ts`,
remove `base`, add `public/CNAME` with the domain, then point DNS at GitHub Pages
(`A` records 185.199.108.153 / .109 / .110 / .111 for `@`, `CNAME www → jeeveshverma.github.io`)
and add the domain under Settings → Pages.

## Owner checklist (optional, none blocks the site)

Original photos and logo file · a daytime exterior shot · reception / breakfast photos · confirm
which number should receive WhatsApp enquiries (the site uses the one in the Instagram bio) ·
attach the site URL to the Google Business Profile · decide whether to publish prices or times.

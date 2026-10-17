// Renders public/og-image.jpg (1200×630): the night shopfront, darkened, with the gold mark and
// wordmark — what WhatsApp, X and Facebook show when the link is shared. Also writes the
// apple-touch-icon from the mark.   node scripts/og.mjs
import sharp from 'sharp';

const W = 1200, H = 630;
const photo = await sharp('src/assets/photos/exterior-night.jpg').resize(W, H, { fit: 'cover', position: 'attention' }).modulate({ brightness: 0.72 }).toBuffer();
const mark = `<g fill="none" stroke="#d4b56a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 92V19q0-9 9-9h18q9 0 9 9v73M70 92V19q0-9 9-9h18q9 0 9 9v73"/>
  <rect x="21" y="17" width="22" height="5" fill="#d4b56a" stroke="none"/><rect x="77" y="17" width="22" height="5" fill="#d4b56a" stroke="none"/>
  <path d="M22 41l10-10 10 10v29H22zM32 31v39M22 47h20M22 53h20M22 59h20M22 65h20M78 41l10-10 10 10v29H78zM88 31v39M78 47h20M78 53h20M78 59h20M78 65h20"/>
  <path d="M55 18v45M65 18v45M55 24h10M55 30h10M55 36h10M55 42h10M55 48h10M55 54h10M55 60h10" stroke-width="1.8"/>
  <path d="M40 92V66q0-3 3-3h34q3 0 3 3v26M51 78l9-8 9 8v14H51zM60 70v22M51 84h18M5 92h110"/></g>`;
const overlay = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f1a16" stop-opacity=".15"/><stop offset="1" stop-color="#1f1a16" stop-opacity=".85"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke="#d4b56a" stroke-opacity=".7"/>
  <g transform="translate(80 330) scale(1.1)">${mark}</g>
  <text x="230" y="400" font-family="Cormorant Garamond, Georgia, serif" font-size="92" font-weight="600" letter-spacing="6" fill="#f6f1e8">AL-HANAA</text>
  <text x="236" y="446" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="10" fill="#d4b56a">HOTEL · SALALAH</text>
  <text x="${W - 80}" y="430" font-family="Amiri, 'Noto Naskh Arabic', serif" font-size="64" fill="#f6f1e8" text-anchor="end">فندق الهناء</text>
  <text x="236" y="540" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#f6f1e8" fill-opacity=".9">23rd July Street · renovated rooms, suites and flats · enquire on WhatsApp</text>
</svg>`;
await sharp(photo).composite([{ input: Buffer.from(overlay) }]).jpeg({ quality: 86, mozjpeg: true }).toFile('public/og-image.jpg');

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#f6f1e8"/><g transform="translate(0 10)" fill="none" stroke="#b8963e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 92V19q0-9 9-9h18q9 0 9 9v73M70 92V19q0-9 9-9h18q9 0 9 9v73"/><rect x="21" y="17" width="22" height="5" fill="#b8963e" stroke="none"/><rect x="77" y="17" width="22" height="5" fill="#b8963e" stroke="none"/><path d="M22 41l10-10 10 10v29H22zM78 41l10-10 10 10v29H78zM55 18v45M65 18v45M40 92V66q0-3 3-3h34q3 0 3 3v26M51 78l9-8 9 8v14H51zM5 92h110"/></g></svg>`;
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(icon)).resize(512, 512).png().toFile('public/icon-512.png');
console.log('og-image.jpg, apple-touch-icon.png, icon-512.png written');

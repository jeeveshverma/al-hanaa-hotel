// Cuts every photo out of the Instagram designs in work/source/ (cream ground, gold logo header,
// 1–6 photos per design, some with white "polaroid" borders), writes each cut to work/cuts/,
// groups near-identical cuts and keeps the largest of each group in work/unique/, then renders
// work/contact-sheet.jpg so the catalogue can be checked by eye.
//
//   node scripts/extract-photos.mjs            # everything
//   node scripts/extract-photos.mjs --only 13  # one design number, verbose
import sharp from 'sharp';
import { readdirSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';

const SRC = 'work/source';
const CUTS = 'work/cuts';
const UNIQ = 'work/unique';
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;

const SCALE = 4;              // analyse at 1/4 resolution
const HEADER_Y = 232;         // below the logo + gold rule (full-res px)
const FOOTER_Y = 1268;        // above the bottom rule + page number
const MIN_AREA = 0.015;       // a photo covers at least 1.5 % of the design
const DIFF = 34;              // |r-bg|+|g-bg|+|b-bg| above this = not background

rmSync(CUTS, { recursive: true, force: true });
rmSync(UNIQ, { recursive: true, force: true });
mkdirSync(CUTS, { recursive: true });
mkdirSync(UNIQ, { recursive: true });

// style-3 designs are tilted "polaroid" copies of the same photos as style-1 → style-1 only
const files = readdirSync(SRC).filter((f) => /style-1\.jpe?g$/i.test(f)).sort()
  .filter((f) => !only || f.includes(`post-${only.padStart(2, '0')}-`));

const cuts = []; // { file, name, w, h, hash }

for (const file of files) {
  const img = sharp(join(SRC, file));
  const { width: W, height: H } = await img.metadata();
  const small = await img.clone().resize(Math.round(W / SCALE), Math.round(H / SCALE), { kernel: 'nearest' })
    .raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = small.info;
  const px = small.data;
  // background = median of the four corners
  const corner = (x, y) => [px[(y * w + x) * ch], px[(y * w + x) * ch + 1], px[(y * w + x) * ch + 2]];
  const cs = [corner(2, 2), corner(w - 3, 2), corner(2, h - 3), corner(w - 3, h - 3)];
  const bg = [0, 1, 2].map((i) => cs.map((c) => c[i]).sort((a, b) => a - b)[1]);
  const isFg = (x, y) => {
    const o = (y * w + x) * ch;
    return Math.abs(px[o] - bg[0]) + Math.abs(px[o + 1] - bg[1]) + Math.abs(px[o + 2] - bg[2]) > DIFF;
  };
  const top = Math.round(HEADER_Y / SCALE), bottom = Math.round(FOOTER_Y / SCALE);
  const mask = new Uint8Array(w * h);
  for (let y = top; y < bottom; y++) for (let x = 0; x < w; x++) if (isFg(x, y)) mask[y * w + x] = 1;

  // connected components (4-neighbour flood fill) → bounding boxes
  const seen = new Uint8Array(w * h);
  const boxes = [];
  const stack = [];
  for (let y = top; y < bottom; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (!mask[i] || seen[i]) continue;
    let x0 = x, x1 = x, y0 = y, y1 = y, n = 0;
    stack.push(i); seen[i] = 1;
    while (stack.length) {
      const j = stack.pop(); n++;
      const jx = j % w, jy = (j - jx) / w;
      if (jx < x0) x0 = jx; if (jx > x1) x1 = jx; if (jy < y0) y0 = jy; if (jy > y1) y1 = jy;
      for (const k of [j - 1, j + 1, j - w, j + w]) {
        if (k < 0 || k >= w * h || seen[k] || !mask[k]) continue;
        const kx = k % w; if (Math.abs(kx - jx) > 1) continue; // no row wrap
        seen[k] = 1; stack.push(k);
      }
    }
    const area = (x1 - x0 + 1) * (y1 - y0 + 1);
    if (area / (w * h) < MIN_AREA) continue;
    boxes.push({ x0, y0, x1, y1, fill: n / area });
  }
  // split blobs that contain internal gaps (the watermark bridges neighbouring photos)
  const GAP = 0.30, MINSEG = 24;
  const fgFrac = (x0, x1, y0, y1, axis, i) => { // fraction of fg pixels on row i (axis 'y') or column i (axis 'x')
    let n = 0, t = 0;
    if (axis === 'y') { for (let x = x0; x <= x1; x++) { t++; n += mask[i * w + x]; } }
    else { for (let y = y0; y <= y1; y++) { t++; n += mask[y * w + i]; } }
    return n / t;
  };
  const split = (b) => {
    for (const axis of ['y', 'x']) {
      const lo = axis === 'y' ? b.y0 : b.x0, hi = axis === 'y' ? b.y1 : b.x1;
      const segs = []; let start = null;
      for (let i = lo; i <= hi; i++) {
        const fg = fgFrac(b.x0, b.x1, b.y0, b.y1, axis, i) >= GAP;
        if (fg && start === null) start = i;
        if (!fg && start !== null) { segs.push([start, i - 1]); start = null; }
      }
      if (start !== null) segs.push([start, hi]);
      const good = segs.filter(([a, z]) => z - a + 1 >= MINSEG);
      if (good.length > 1) {
        return good.flatMap(([a, z]) => split(axis === 'y' ? { ...b, y0: a, y1: z } : { ...b, x0: a, x1: z }));
      }
    }
    return [b];
  };
  const boxes2 = boxes.flatMap(split).filter((b) => (b.x1 - b.x0 + 1) * (b.y1 - b.y0 + 1) / (w * h) >= MIN_AREA);
  boxes.length = 0; boxes.push(...boxes2);
  boxes.sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);

  // full-res raw for border trimming
  const full = await img.clone().raw().toBuffer({ resolveWithObject: true });
  const fpx = full.data, fch = full.info.channels;
  const bright = (x, y) => { const o = (y * W + x) * fch; return (fpx[o] + fpx[o + 1] + fpx[o + 2]) / 3; };
  const lineIsBorder = (x0, x1, y0, y1) => { // mean brightness of a thin line of pixels
    let s = 0, n = 0;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { s += bright(x, y); n++; }
    return s / n > 228;
  };

  let k = 0;
  for (const b of boxes) {
    let x0 = b.x0 * SCALE, y0 = b.y0 * SCALE, x1 = Math.min(W - 1, (b.x1 + 1) * SCALE - 1), y1 = Math.min(H - 1, (b.y1 + 1) * SCALE - 1);
    // trim white/cream borders (polaroid frames, antialiased edges): walk each edge inward
    const limit = 60;
    let t = 0; while (t < limit && lineIsBorder(x0, x1, y0, y0)) { y0++; t++; }
    t = 0; while (t < limit && lineIsBorder(x0, x1, y1, y1)) { y1--; t++; }
    t = 0; while (t < limit && lineIsBorder(x0, x0, y0, y1)) { x0++; t++; }
    t = 0; while (t < limit && lineIsBorder(x1, x1, y0, y1)) { x1--; t++; }
    // 2 px safety inset against antialiased edges
    x0 += 2; y0 += 2; x1 -= 2; y1 -= 2;
    const cw = x1 - x0 + 1, chh = y1 - y0 + 1;
    if (cw < 120 || chh < 120) continue;
    k++;
    const name = `${basename(file, '.jpg')}-${k}`;
    const out = join(CUTS, `${name}.jpg`);
    await img.clone().extract({ left: x0, top: y0, width: cw, height: chh }).jpeg({ quality: 95 }).toFile(out);
    const hash = await dhash(out);
    cuts.push({ file: out, name, w: cw, h: chh, hash, fill: b.fill });
    if (only) console.log(name, `${cw}x${chh}`, `fill ${b.fill.toFixed(2)}`, hash.toString(16));
  }
  console.log(`${file}: ${k} cut(s)`);
}

// --- dedupe: dHash on 9x8 grey, hamming ≤ 12 and similar aspect = same photo ---
async function dhash(file) {
  const d = await sharp(file).greyscale().resize(9, 8, { fit: 'fill' }).raw().toBuffer();
  let bits = 0n;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    bits = (bits << 1n) | (d[y * 9 + x] < d[y * 9 + x + 1] ? 1n : 0n);
  }
  return bits;
}
const ham = (a, b) => { let x = a ^ b, n = 0; while (x) { n += Number(x & 1n); x >>= 1n; } return n; };

const groups = [];
for (const c of cuts.sort((a, b) => b.w * b.h - a.w * a.h)) {
  const ar = c.w / c.h;
  const g = groups.find((g) => ham(g.rep.hash, c.hash) <= 12 && Math.abs(g.rep.w / g.rep.h - ar) < 0.25);
  if (g) g.members.push(c); else groups.push({ rep: c, members: [c] });
}
groups.sort((a, b) => b.members.length - a.members.length);

const manifest = [];
let gi = 0;
for (const g of groups) {
  gi++;
  const id = `u${String(gi).padStart(2, '0')}`;
  const out = join(UNIQ, `${id}.jpg`);
  await sharp(g.rep.file).jpeg({ quality: 95 }).toFile(out);
  manifest.push({ id, from: g.rep.name, size: `${g.rep.w}x${g.rep.h}`, copies: g.members.length, members: g.members.map((m) => m.name) });
}
writeFileSync('work/unique.json', JSON.stringify(manifest, null, 2));
console.log(`\n${cuts.length} cuts → ${groups.length} unique photos (work/unique/, work/unique.json)`);

// --- contact sheet: 5 per row, 300 px cells, label with id / size / copies ---
const CELL = 300, PAD = 14, COLS = 5, LABEL = 36;
const rows = Math.ceil(manifest.length / COLS);
const sheetW = COLS * (CELL + PAD) + PAD, sheetH = rows * (CELL + LABEL + PAD) + PAD;
const comps = [];
for (let i = 0; i < manifest.length; i++) {
  const m = manifest[i];
  const col = i % COLS, row = Math.floor(i / COLS);
  const x = PAD + col * (CELL + PAD), y = PAD + row * (CELL + LABEL + PAD);
  const thumb = await sharp(join(UNIQ, `${m.id}.jpg`)).resize(CELL, CELL, { fit: 'inside' }).toBuffer();
  const meta = await sharp(thumb).metadata();
  comps.push({ input: thumb, left: x + Math.round((CELL - meta.width) / 2), top: y + Math.round((CELL - meta.height) / 2) });
  const svg = `<svg width="${CELL}" height="${LABEL}"><text x="4" y="14" font-family="Helvetica, Arial" font-size="13" font-weight="bold" fill="#2B2520">${m.id}  ${m.size}</text><text x="4" y="30" font-family="Helvetica, Arial" font-size="11" fill="#6b625a">${m.copies} cop${m.copies === 1 ? 'y' : 'ies'} · ${m.from}</text></svg>`;
  comps.push({ input: Buffer.from(svg), left: x, top: y + CELL + 2 });
}
await sharp({ create: { width: sheetW, height: sheetH, channels: 3, background: '#F6F1E8' } })
  .composite(comps).jpeg({ quality: 88 }).toFile('work/contact-sheet.jpg');
console.log(`contact sheet: work/contact-sheet.jpg (${sheetW}x${sheetH})`);

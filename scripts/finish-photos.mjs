// Takes the chosen masters from work/unique/ (catalogued by eye in MASTERS below), gives them one
// consistent, gentle finish, writes them to src/assets/photos/<id>.jpg and renders
// work/masters-sheet.jpg for review.
//
//   node scripts/finish-photos.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

// id → [unique cut, group, note]. Groups: suite | twin | double | family | flat | spaces | bathroom | outside
export const MASTERS = {
  'exterior-night':   ['u04', 'outside',  'Night shopfront with the ALHANAA sign and arched entrance'],
  'corridor':         ['u18', 'spaces',   'Guest corridor, marble floor, LED strips, framed art'],
  'corridor-wide':    ['u37', 'spaces',   'Guest corridor, wide crop'],
  'stairwell':        ['u29', 'spaces',   'Stairwell with pendant lamps and gold wall discs'],
  'lounge-armchairs': ['u42', 'spaces',   'Two gold armchairs and a round table'],
  'suite-bed-a':      ['u10', 'suite',    'King bed, LED cove ceiling, door to the sitting room'],
  'suite-bed-wide':   ['u26', 'suite',    'Same king bed photo, landscape crop'],
  'suite-living-a':   ['u06', 'suite',    'Sitting room: clock, wingback armchair, round rug'],
  'suite-living-b':   ['u36', 'suite',    'Sitting room, second angle, wide'],
  'suite-sofa':       ['u38', 'suite',    'Sitting room with grey sofa, door to the bedroom'],
  'twin-a':           ['u11', 'twin',     'Twin beds, towel sets, geometric rug, wallpaper'],
  'twin-a-wardrobe':  ['u28', 'twin',     'Twin beds with the open wardrobe'],
  'twin-b':           ['u12', 'twin',     'Twin beds, white walls, desk with kettle'],
  'twin-b-mirror':    ['u17', 'twin',     'Twin beds, round mirror'],
  'double-chairs':    ['u24', 'double',   'Double bed with two tub chairs and a wooden table'],
  'double-velvet':    ['u25', 'double',   'Double bed, ribbed velvet headboard, curtains'],
  'double-grey':      ['u52', 'double',   'Double bed, grey headboard, gold runner, art'],
  'double-curtain':   ['u30', 'double',   'Double bed by the curtains, cove-lit wall, pouf'],
  'family-room':      ['u44', 'family',   'Large room: bed, stool, round table, doorway'],
  'flat-bedroom':     ['u27', 'flat',     'Bedroom with wood-panel wall and blue rug'],
  'flat-bedroom-tall':['u15', 'flat',     'Same bedroom, portrait'],
  'flat-living':      ['u40', 'flat',     'Living room: grey sofa, black coffee table, blue rug'],
  'flat-tv':          ['u45', 'flat',     'Living room with TV unit and bed behind'],
  'bathroom-shower':  ['u47', 'bathroom', 'Marble rain shower and WC'],
  'bathroom-basin':   ['u46', 'bathroom', 'Granite basin with the tea tray'],
};

const OUT = 'src/assets/photos';
mkdirSync(OUT, { recursive: true });
const done = [];
for (const [id, [u]] of Object.entries(MASTERS)) {
  const src = `work/unique/${u}.jpg`;
  const out = `${OUT}/${id}.jpg`;
  // gentle finish: stretch levels a touch (1–99 %), +4 % saturation, light unsharp mask
  await sharp(src).normalise({ lower: 1, upper: 99 }).modulate({ saturation: 1.04 })
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 1.5 }).jpeg({ quality: 92, mozjpeg: true }).toFile(out);
  const m = await sharp(out).metadata();
  done.push({ id, u, w: m.width, h: m.height });
}

const CELL = 300, PAD = 14, COLS = 5, LABEL = 36;
const rows = Math.ceil(done.length / COLS);
const W = COLS * (CELL + PAD) + PAD, H = rows * (CELL + LABEL + PAD) + PAD;
const comps = [];
for (let i = 0; i < done.length; i++) {
  const d = done[i];
  const x = PAD + (i % COLS) * (CELL + PAD), y = PAD + Math.floor(i / COLS) * (CELL + LABEL + PAD);
  const t = await sharp(`${OUT}/${d.id}.jpg`).resize(CELL, CELL, { fit: 'inside' }).toBuffer();
  const m = await sharp(t).metadata();
  comps.push({ input: t, left: x + Math.round((CELL - m.width) / 2), top: y + Math.round((CELL - m.height) / 2) });
  comps.push({ input: Buffer.from(`<svg width="${CELL}" height="${LABEL}"><text x="4" y="14" font-family="Helvetica" font-size="13" font-weight="bold" fill="#2B2520">${d.id}</text><text x="4" y="30" font-family="Helvetica" font-size="11" fill="#6b625a">${d.u} · ${d.w}x${d.h} · ${MASTERS[d.id][1]}</text></svg>`), left: x, top: y + CELL + 2 });
}
await sharp({ create: { width: W, height: H, channels: 3, background: '#F6F1E8' } }).composite(comps).jpeg({ quality: 88 }).toFile('work/masters-sheet.jpg');
console.log(`${done.length} masters → ${OUT}/ ; sheet work/masters-sheet.jpg (${W}x${H})`);

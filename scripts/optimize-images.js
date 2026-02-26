/**
 * Resize and convert portfolio images to WebP for faster loading.
 * Keeps originals; writes .webp alongside each file (max width 1200px, quality 85).
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets');
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 90;

function* walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walkDir(full);
    else if (e.isFile() && /\.(png|jpe?g)$/i.test(e.name)) yield full;
  }
}

async function optimize(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const base = filePath.slice(0, -ext.length);
  const outPath = base + '.webp';

  const meta = await sharp(filePath).metadata();
  const width = meta.width || 0;
  const needResize = width > MAX_WIDTH;

  const pipeline = sharp(filePath);
  if (needResize) pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });

  await pipeline
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(outPath);

  const origSize = fs.statSync(filePath).size;
  const newSize = fs.statSync(outPath).size;
  const pct = ((1 - newSize / origSize) * 100).toFixed(0);
  console.log(`${path.relative(ASSETS_DIR, filePath)} → .webp (${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB, -${pct}%)`);
}

async function main() {
  const files = [...walkDir(ASSETS_DIR)];
  console.log(`Optimizing ${files.length} images (max width ${MAX_WIDTH}px, WebP q${WEBP_QUALITY})...\n`);
  for (const f of files) {
    try {
      await optimize(f);
    } catch (err) {
      console.error(`Error ${f}:`, err.message);
    }
  }
  console.log('\nDone. Update HTML to use .webp sources.');
}

main();

/*
 * Turns a licensed stock original into a web-sized asset under public/images.
 *
 *   node scripts/prepareImage.mjs <source> <name> [width]
 *   node scripts/prepareImage.mjs ~/Downloads/shutterstock_2673565743.jpg banner-studio 2800
 *
 * Stock originals run to 8000px and 20MB; the site is a static export with
 * images.unoptimized, so nothing downscales them later. Anything shipped has to be
 * resized here first.
 *
 * Defaults to 1600px, which covers every slot except the banner — see DEMO-SLIKE.md
 * for the size each slot is drawn at.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [source, name, widthArg] = process.argv.slice(2);

if (!source || !name) {
  console.error("uporaba: node scripts/prepareImage.mjs <izvor> <ime> [sirina]");
  process.exit(1);
}

const width = Number(widthArg ?? 1600);
const outDir = path.join(process.cwd(), "public", "images");
const out = path.join(outDir, `${name}.webp`);

fs.mkdirSync(outDir, { recursive: true });

const before = await sharp(source).metadata();

await sharp(source)
  .resize({ width, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(out);

const after = await sharp(out).metadata();

console.log(
  `${before.width}x${before.height} ${(fs.statSync(source).size / 1024 / 1024).toFixed(1)} MB` +
    `  ->  ${after.width}x${after.height} ${(fs.statSync(out).size / 1024).toFixed(0)} kB` +
    `  public/images/${name}.webp`,
);

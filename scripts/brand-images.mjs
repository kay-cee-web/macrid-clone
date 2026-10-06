// Regenerates the link-preview image and the opaque app icons.
//   node scripts/brand-images.mjs
// Writes into public/image/:
// - share-preview.jpg: public/image.png (the app screenshot) as a 1200x600
//   baseline JPEG. The source is ~560 KB of PNG; WhatsApp drops images much
//   over 300 KB, and every scraper takes JPEG. `SHARE_IMAGE` in
//   src/lib/seo/site.ts points at it. 2:1 is the screenshot's own shape and X's
//   large-card ratio; Facebook and LinkedIn trim ~15px a side to reach 1.91:1.
// - apple-touch-icon.png and dexisphere-icon192.png.
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const at = (...parts) => join(ROOT, ...parts);

const SOURCE = "public/image.png";
const PREVIEW = { width: 1200, height: 600, maxBytes: 300 * 1024 };

async function preview() {
  const { width, height } = await sharp(at(SOURCE)).metadata();
  // The capture's top two rows hold a faint browser edge.
  const image = sharp(at(SOURCE))
    .extract({ left: 0, top: 2, width, height: height - 2 })
    .flatten({ background: "#ffffff" })
    .resize(PREVIEW.width, PREVIEW.height, { fit: "cover", position: "top", kernel: "lanczos3" })
    .sharpen({ sigma: 0.5 });
  // Highest quality that stays under the WhatsApp ceiling. Baseline, not
  // mozjpeg (which forces progressive); 4:4:4 keeps the UI text crisp.
  for (const quality of [88, 84, 80, 76, 72]) {
    const options = { quality, chromaSubsampling: "4:4:4", trellisQuantisation: true, optimiseCoding: true };
    const jpg = await image.clone().jpeg(options).toBuffer();
    if (jpg.length <= PREVIEW.maxBytes) {
      await writeFile(at("public/image/share-preview.jpg"), jpg);
      return console.log(`share preview: ${PREVIEW.width}x${PREVIEW.height}, q${quality}, ${Math.round(jpg.length / 1024)} KB`);
    }
  }
  throw new Error("share preview stays over 300 KB even at q72");
}

/** Home-screen icons can't be transparent (iOS fills the gaps with black), so the mark sits on white. */
async function icon(size, out) {
  const mark = await sharp(at("public/image/dexisphere-icon512.png")).resize(Math.round(size * 0.72)).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#ffffff" } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(at(out));
}

await preview();
await icon(180, "public/image/apple-touch-icon.png");
await icon(192, "public/image/dexisphere-icon192.png");

// Regenerates the share card and the opaque app icons from the real logo files.
//   node scripts/brand-images.mjs
// Writes into public/image/: share-card.jpg (1200x630 baseline JPEG — the format
// every link scraper accepts, WhatsApp included; `SHARE_IMAGE` in
// src/lib/seo/site.ts points at it), apple-touch-icon.png and
// dexisphere-icon192.png. Fonts are fetched from Google Fonts as TTF (Satori
// can't read woff2), so this needs a network connection.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og.js";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const at = (...parts) => join(ROOT, ...parts);

// Brand tokens from src/app/tokens.css (dark theme).
const NIGHT = "#070b1c";
const INK = "#f5f6fc";
const MUTED = "#9ba3bb";
const FROM = "#5b5bf7";
const TO = "#00c7ac";
const DOMAIN = "app.dexisphere.com";

async function googleFont(family, weight) {
  // A non-browser user agent gets one whole TTF instead of woff2 subsets.
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('(truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error(`No TTF for ${family} ${weight}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

const el = (type, style, children) => ({ type, props: { style: { display: "flex", ...style }, children } });
const dataUri = async (path) => `data:image/png;base64,${(await readFile(at(path))).toString("base64")}`;

async function card() {
  const [display, sans, sansMedium] = await Promise.all([
    googleFont("Bricolage+Grotesque", 700),
    googleFont("Geist", 400),
    googleFont("Geist", 500),
  ]);
  const wordmark = await dataUri("public/image/dexisphere-logo-white.png");
  const chip = (label) =>
    el("div", { padding: "10px 20px", borderRadius: 999, border: "1.5px solid rgba(245,246,252,0.18)", background: "rgba(245,246,252,0.05)", fontSize: 22, fontWeight: 500, color: INK }, label);

  const tree = el(
    "div",
    {
      width: "100%", height: "100%", flexDirection: "column", justifyContent: "space-between", padding: "56px 72px 60px",
      fontFamily: "Geist", color: INK, backgroundColor: NIGHT,
      backgroundImage: `radial-gradient(ellipse 60% 70% at 8% 0%, rgba(91,91,247,0.42), transparent 70%), radial-gradient(ellipse 50% 60% at 100% 100%, rgba(0,199,172,0.26), transparent 70%)`,
    },
    [
      { type: "img", props: { src: wordmark, width: 216, height: 72, style: { marginLeft: -12 } } },
      el("div", { flexDirection: "column", gap: 26 }, [
        el("div", { flexDirection: "column", fontFamily: "Bricolage", fontSize: 92, lineHeight: 1.02, letterSpacing: -2.5 }, [
          el("div", {}, "Your agent works."),
          el("div", { alignSelf: "flex-start", backgroundImage: `linear-gradient(90deg, ${FROM}, ${TO})`, backgroundClip: "text", color: "transparent" }, "You don't have to."),
        ]),
        el("div", { fontSize: 32, lineHeight: 1.35, color: MUTED, maxWidth: 900 }, "Tell an agent the job. It does the work and shows you a receipt for every change."),
      ]),
      el("div", { flexDirection: "column", gap: 30 }, [
        el("div", { alignItems: "center", justifyContent: "space-between" }, [
          el("div", { gap: 12 }, ["Prospecting", "Outreach", "CRM", "Records"].map(chip)),
          el("div", { fontSize: 26, fontWeight: 500, color: MUTED }, DOMAIN),
        ]),
        el("div", { height: 6, borderRadius: 3, backgroundImage: `linear-gradient(90deg, ${FROM}, ${TO})` }, []),
      ]),
    ],
  );

  const png = await new ImageResponse(tree, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Bricolage", data: display, weight: 700 },
      { name: "Geist", data: sans, weight: 400 },
      { name: "Geist", data: sansMedium, weight: 500 },
    ],
  }).arrayBuffer();
  const jpg = await sharp(Buffer.from(png)).flatten({ background: NIGHT }).jpeg({ quality: 88, chromaSubsampling: "4:4:4" }).toBuffer();
  await writeFile(at("public/image/share-card.jpg"), jpg);
  console.log(`share card: ${Math.round(jpg.length / 1024)} KB`);
}

/** Home-screen icons can't be transparent (iOS fills the gaps with black), so the mark sits on white. */
async function icon(size, out) {
  const mark = await sharp(at("public/image/dexisphere-icon512.png")).resize(Math.round(size * 0.72)).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#ffffff" } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(at(out));
}

await card();
await icon(180, "public/image/apple-touch-icon.png");
await icon(192, "public/image/dexisphere-icon192.png");

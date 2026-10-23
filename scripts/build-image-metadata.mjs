import fs from "fs";
import path from "path";
import sharp from "sharp";
import { BLOG_POSTS } from "../lib/blogData.ts";

const OUT_PATH = path.join(process.cwd(), "lib", "imageMetadata.json");

// WCAG relative luminance calculation
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// Adjust RGB color to ensure contrast ratio >= target against background
function adjustForContrast(r, g, b, bgR, bgG, bgB, targetContrast = 4.5) {
  const bgLum = getLuminance(bgR, bgG, bgB);
  let curR = r;
  let curG = g;
  let curB = b;
  let lum = getLuminance(curR, curG, curB);
  let contrast = getContrast(lum, bgLum);

  if (contrast >= targetContrast) {
    return rgbToHex(curR, curG, curB);
  }

  // If background is light (#FFF), darken color; if dark (#0A0A0A), lighten color
  const step = bgLum > 0.5 ? -4 : 4;
  for (let i = 0; i < 60; i++) {
    curR = Math.max(0, Math.min(255, curR + step));
    curG = Math.max(0, Math.min(255, curG + step));
    curB = Math.max(0, Math.min(255, curB + step));
    lum = getLuminance(curR, curG, curB);
    contrast = getContrast(lum, bgLum);
    if (contrast >= targetContrast) {
      break;
    }
  }

  return rgbToHex(curR, curG, curB);
}

async function processImage(post) {
  const url = post.featureImage;
  if (!url) return null;

  try {
    let buffer;
    if (url.startsWith("/")) {
      const localPath = path.join(process.cwd(), "public", url);
      if (!fs.existsSync(localPath)) {
        console.warn(`Local image not found: ${localPath}`);
        return null;
      }
      buffer = fs.readFileSync(localPath);
    } else {
      const res = await fetch(url, { headers: { "User-Agent": "WvrnerBuild/1.0" } });
      if (!res.ok) {
        console.warn(`Failed to fetch ${url} (HTTP ${res.status})`);
        return null;
      }
      buffer = Buffer.from(await res.arrayBuffer());
    }

    const img = sharp(buffer);
    const meta = await img.metadata();
    const stats = await img.stats();

    const width = meta.width || 1200;
    const height = meta.height || 630;
    const aspectRatio = Number((width / height).toFixed(4));

    // Generate tiny 16px wide webp blur-up placeholder
    const tinyHeight = Math.max(8, Math.round(16 * (height / width)));
    const tinyBuffer = await img
      .resize(16, tinyHeight, { fit: "cover" })
      .webp({ quality: 20 })
      .toBuffer();
    const blurDataUrl = `data:image/webp;base64,${tinyBuffer.toString("base64")}`;

    // Extract dominant color and calculate contrast-adjusted variants
    const dom = stats.dominant || { r: 22, g: 22, b: 23 };
    const rawColor = rgbToHex(dom.r, dom.g, dom.b);
    const accentLight = adjustForContrast(dom.r, dom.g, dom.b, 255, 255, 255, 4.5);
    const accentDark = adjustForContrast(dom.r, dom.g, dom.b, 10, 10, 10, 4.5);

    return {
      slug: post.slug,
      src: url,
      width,
      height,
      aspectRatio,
      blurDataUrl,
      dominantColor: rawColor,
      accentLight,
      accentDark,
    };
  } catch (err) {
    console.warn(`Error processing image for ${post.slug}:`, err.message);
    return null;
  }
}

async function run() {
  console.log("Generating build-time image metadata & blur-up placeholders...");

  let existing = {};
  if (fs.existsSync(OUT_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUT_PATH, "utf8"));
    } catch {}
  }

  const result = { ...existing };
  let count = 0;

  for (const post of BLOG_POSTS) {
    if (!post.featureImage) continue;

    // Use cached entry if URL hasn't changed
    if (result[post.slug] && result[post.slug].src === post.featureImage) {
      continue;
    }

    const meta = await processImage(post);
    if (meta) {
      result[post.slug] = meta;
      count++;
      console.log(`  ✓ [${post.slug}] aspect ${meta.aspectRatio}, accent: ${meta.accentLight}`);
    }
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2));
  console.log(`Saved ${Object.keys(result).length} image metadata records to lib/imageMetadata.json`);
}

run();

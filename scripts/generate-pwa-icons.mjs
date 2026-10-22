import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

function createSvgIcon(size, padding = 0) {
  const innerSize = size - padding * 2;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#0A0A0A" />
      <g transform="translate(${padding}, ${padding})">
        <text 
          x="${innerSize / 2}" 
          y="${innerSize / 2 + innerSize * 0.32}" 
          font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" 
          font-weight="900" 
          font-size="${innerSize * 0.72}" 
          fill="#FFFFFF" 
          text-anchor="middle"
          letter-spacing="-0.05em"
        >W</text>
      </g>
    </svg>
  `;
}

async function run() {
  console.log("Generating PWA icons...");

  // 192x192 icon
  const svg192 = Buffer.from(createSvgIcon(192, 16));
  await sharp(svg192).png().toFile(path.join(PUBLIC_DIR, "icon-192.png"));

  // 512x512 icon
  const svg512 = Buffer.from(createSvgIcon(512, 40));
  await sharp(svg512).png().toFile(path.join(PUBLIC_DIR, "icon-512.png"));

  // 512x512 maskable icon (has extra safe margin)
  const svgMaskable = Buffer.from(createSvgIcon(512, 80));
  await sharp(svgMaskable).png().toFile(path.join(PUBLIC_DIR, "icon-maskable.png"));

  // 180x180 Apple touch icon
  const svgApple = Buffer.from(createSvgIcon(180, 16));
  await sharp(svgApple).png().toFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"));

  console.log("PWA icons generated successfully in public/");
}

run();

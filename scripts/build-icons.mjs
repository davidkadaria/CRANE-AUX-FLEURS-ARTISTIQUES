// Generates the favicon / app-icon set from assets/icon.svg (the V3
// skull-with-bouquet mark, owner-approved 2026-07-31):
//
//   public/favicon.ico            16+32+48 multi-res (transparent)
//   public/icons/icon.svg         vector favicon (transparent)
//   public/icons/icon-{16,32,48,192,512}.png   transparent
//   public/icons/apple-touch-icon.png          180×180, cream bg (iOS renders
//                                              black behind transparency)
//   public/icons/maskable-{192,512}.png        full-bleed cream bg, artwork
//                                              scaled into the safe zone
//
// Run: npm run build:icons (chained into prebuild). Fast  no cache needed.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const root = (p) => fileURLToPath(new URL('../' + p, import.meta.url));
const PAGE = '#f5efdf';

const svgSource = readFileSync(root('assets/icon.svg'));
const iconsDir = root('public/icons/');
mkdirSync(iconsDir, { recursive: true });

// Transparent PNG at the given square size
function transparent(size) {
  return sharp(svgSource).resize(size, size).png().toBuffer();
}

// Solid paper background behind the artwork; scale < 1 shrinks the artwork
// into the center (maskable safe zone)
async function onPaper(size, scale = 1) {
  const art = await sharp(svgSource)
    .resize(Math.round(size * scale), Math.round(size * scale))
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: PAGE,
    },
  })
    .composite([{ input: art, gravity: 'center' }])
    .png()
    .toBuffer();
}

copyFileSync(root('assets/icon.svg'), iconsDir + 'icon.svg');

const pngSizes = [16, 32, 48, 192, 512];
for (const size of pngSizes) {
  writeFileSync(`${iconsDir}icon-${size}.png`, await transparent(size));
}

writeFileSync(iconsDir + 'apple-touch-icon.png', await onPaper(180, 0.86));
writeFileSync(iconsDir + 'maskable-192.png', await onPaper(192, 0.72));
writeFileSync(iconsDir + 'maskable-512.png', await onPaper(512, 0.72));

writeFileSync(
  root('public/favicon.ico'),
  await pngToIco([
    `${iconsDir}icon-16.png`,
    `${iconsDir}icon-32.png`,
    `${iconsDir}icon-48.png`,
  ]),
);

console.log('✓ built favicon.ico + icons/ (svg, 5 png, apple, 2 maskable)');

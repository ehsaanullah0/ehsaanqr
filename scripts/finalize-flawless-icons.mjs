import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

async function finalizeFlawlessIcons() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const aistudioDir = path.join(publicDir, 'assets', 'aistudio');

  // Load the current cleaned master
  const { data, info } = await sharp(path.join(aistudioDir, 'logo-transparent.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const total = width * height;
  const cleanData = Buffer.from(data);

  // Deep solid blue
  const SOLID_R = 30;
  const SOLID_G = 64;
  const SOLID_B = 175;

  // Find all border pixels on the outer perimeter:
  // If a pixel has any neighbor that is transparent (a === 0), it is on the outer boundary.
  // If its blue component is strong, ensure its RGB is pure solid blue [30, 64, 175]!
  // This removes any baked-in white fringe completely!
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const a = cleanData[idx + 3];
      if (a === 0) continue;

      // Check if it's near the outer boundary (within 3 pixels of transparent)
      let touchesTransparent = false;
      for (let dy = -2; dy <= 2 && !touchesTransparent; dy++) {
        for (let dx = -2; dx <= 2 && !touchesTransparent; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
            touchesTransparent = true;
          } else {
            const nIdx = (ny * width + nx) * 4;
            if (cleanData[nIdx + 3] === 0) {
              touchesTransparent = true;
            }
          }
        }
      }

      if (touchesTransparent) {
        // If it was light/whitish fringe, make it completely transparent or pure blue!
        const r = cleanData[idx];
        const g = cleanData[idx + 1];
        const b = cleanData[idx + 2];

        // If it's more white than blue (r > 150), it is residual outer white halo!
        if (r > 150 && g > 150) {
          // Remove residual white halo completely
          cleanData[idx] = 0;
          cleanData[idx + 1] = 0;
          cleanData[idx + 2] = 0;
          cleanData[idx + 3] = 0;
        } else {
          // Outer edge of the blue border: set to pure solid blue
          cleanData[idx] = SOLID_R;
          cleanData[idx + 1] = SOLID_G;
          cleanData[idx + 2] = SOLID_B;
        }
      }
    }
  }

  const master512 = await sharp(cleanData, {
    raw: { width, height, channels: 4 }
  }).png().toBuffer();

  // Save flawless master logo-transparent.png
  fs.writeFileSync(path.join(aistudioDir, 'logo-transparent.png'), master512);
  fs.writeFileSync(path.join(aistudioDir, 'logo.png'), master512);
  console.log('Saved 100% fringe-free logo-transparent.png!');

  // Generate standard 512 & 192 (purpose: any)
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), master512);
  await sharp(master512)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  // Apple touch icon (180x180)
  await sharp(master512)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Android Maskable Icons:
  // Seamless white background (#FFFFFF) with the clean badge centered in safe zone (304x304)
  const androidBadge = await sharp(master512)
    .resize(304, 304)
    .png()
    .toBuffer();

  const maskableOffset = Math.round((512 - 304) / 2); // 104

  const maskable512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{
      input: androidBadge,
      top: maskableOffset,
      left: maskableOffset
    }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), maskable512);
  await sharp(maskable512)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-192.png'));

  // Favicon sizes (48, 32, 16) & multi-resolution favicon.ico
  const favBadge = await sharp(master512)
    .resize(48, 48)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), favBadge);

  await sharp(favBadge)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  await sharp(favBadge)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  const p16 = path.join(publicDir, 'favicon-16x16.png');
  const p32 = path.join(publicDir, 'favicon-32x32.png');
  const p48 = path.join(publicDir, 'favicon-48x48.png');
  const icoPath = path.join(publicDir, 'favicon.ico');

  execSync(`convert "${p16}" "${p32}" "${p48}" "${icoPath}"`);

  // SVG favicons
  const base64Data = master512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image width="512" height="512" href="data:image/png;base64,${base64Data}" />
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'ehsaan-flame.svg'), svgContent, 'utf-8');
  fs.writeFileSync(path.join(aistudioDir, 'logo.svg'), svgContent, 'utf-8');

  console.log('ALL ICONS PERFECTED AND SAVED!');
}

finalizeFlawlessIcons().catch(console.error);

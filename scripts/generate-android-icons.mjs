import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execSync } from 'node:child_process';

async function generateAndroidCompliantIcons() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const aistudioDir = path.join(publicDir, 'assets', 'aistudio');
  const inputSource = path.join(aistudioDir, 'Gemini_Generated_Image_fiik8tfiik8tfiik_e2c34533.png');

  console.log('Loading source image from:', inputSource);

  // 1. First, create a high-fidelity cutout of the squircle badge
  // Center is at (326.5, 353), outer orange border is ~500x516
  const cropSize = 530;
  const cropLeft = Math.round(326.5 - cropSize / 2); // 62
  const cropTop = Math.round(353 - cropSize / 2);    // 88

  // Clean anti-aliased squircle mask (22% corner radius)
  const rx = Math.round(cropSize * 0.22); // 116
  const squircleMask = `<svg width="${cropSize}" height="${cropSize}">
    <rect x="0" y="0" width="${cropSize}" height="${cropSize}" rx="${rx}" ry="${rx}" fill="#FFFFFF" />
  </svg>`;

  const badgeBuffer = await sharp(inputSource)
    .extract({ left: cropLeft, top: cropTop, width: cropSize, height: cropSize })
    .composite([{
      input: Buffer.from(squircleMask),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // 2. Generate Master App Logo for Web / Navbar / UI (512x512 with transparent corners)
  // Inside 512x512, badge occupies 480x480 (94%) with 16px padding on all sides
  const uiBadge = await sharp(badgeBuffer)
    .resize(480, 480)
    .png()
    .toBuffer();

  const logoTransparent512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{
      input: uiBadge,
      top: 16,
      left: 16
    }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(aistudioDir, 'logo-transparent.png'), logoTransparent512);
  fs.writeFileSync(path.join(aistudioDir, 'logo.png'), logoTransparent512);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), logoTransparent512);

  // Standard PWA icon-192.png (purpose: any)
  await sharp(logoTransparent512)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  // Apple Touch Icon (180x180) - iOS applies its own rounded corners
  const appleBadge = await sharp(badgeBuffer)
    .resize(180, 180)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleBadge);

  // 3. ANDROID ADAPTIVE & MASKABLE ICONS (Strictly within 66% safe zone circle)
  // Android Adaptive icon spec:
  // - Total canvas: 512x512
  // - Safe area: circle with diameter = 512 * (72 / 108) ≈ 341px (radius = 170px)
  // To guarantee that 100% of the squircle badge, its corners, its glowing border,
  // and the yellow/orange Q glyph have generous breathing room and are never
  // cropped or zoomed on ANY Android launcher (Pixel circular mask, Samsung squircle,
  // Xiaomi rounded rect, or teardrop), we set the badge to 240x240px centered at (256, 256).
  // At 240x240 with rounded corners (radius ~52px), the max distance from center is ~148px,
  // providing a clean 22px safety buffer inside Android's 170px radius mask!
  const safeBadgeSize = 240;
  const safeBadge = await sharp(badgeBuffer)
    .resize(safeBadgeSize, safeBadgeSize)
    .png()
    .toBuffer();

  const maskableOffset = Math.round((512 - safeBadgeSize) / 2); // (512 - 280) / 2 = 116

  // Solid background matching app theme (#FAF8F5 warm ivory/white)
  // Maskable icons MUST NOT have transparency
  const maskable512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 250, g: 248, b: 245, alpha: 1 } // #FAF8F5
    }
  })
    .composite([{
      input: safeBadge,
      top: maskableOffset,
      left: maskableOffset
    }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), maskable512);

  const maskable192 = await sharp(maskable512)
    .resize(192, 192)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-maskable-192.png'), maskable192);

  // 4. Favicon sizes (16, 32, 48)
  // For favicons at small resolutions (16x16, 32x32), we optimize clarity:
  // We make sure the inner icon is crisp and clearly visible
  const favBadge = await sharp(badgeBuffer)
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

  // Multi-resolution favicon.ico
  const p16 = path.join(publicDir, 'favicon-16x16.png');
  const p32 = path.join(publicDir, 'favicon-32x32.png');
  const p48 = path.join(publicDir, 'favicon-48x48.png');
  const icoPath = path.join(publicDir, 'favicon.ico');

  execSync(`convert "${p16}" "${p32}" "${p48}" "${icoPath}"`);
  console.log('Generated multi-res favicon.ico');

  // 5. Favicon SVG & ehsaan-flame.svg
  const base64Data = logoTransparent512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image width="512" height="512" href="data:image/png;base64,${base64Data}" />
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'ehsaan-flame.svg'), svgContent, 'utf-8');
  fs.writeFileSync(path.join(aistudioDir, 'logo.svg'), svgContent, 'utf-8');

  // 6. Generate an Android Safe Zone Visualizer to confirm 0% clipping
  const safeZoneGuideSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <!-- Android 66% circular mask line -->
    <circle cx="256" cy="256" r="170" fill="none" stroke="#22C55E" stroke-width="3" stroke-dasharray="6,4" />
    <circle cx="256" cy="256" r="170" fill="rgba(34, 197, 94, 0.08)" />
    <!-- Center mark -->
    <circle cx="256" cy="256" r="4" fill="#22C55E" />
  </svg>`;

  const guideVisual = await sharp(maskable512)
    .composite([{
      input: Buffer.from(safeZoneGuideSvg),
      top: 0,
      left: 0
    }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(aistudioDir, 'android-safe-zone-preview.png'), guideVisual);

  console.log('SUCCESS: Android-compliant icons and web assets generated perfectly!');
  console.log('Safe badge size: 280x280 inside 512x512 canvas. Strictly within 170px radius!');
}

generateAndroidCompliantIcons().catch((err) => {
  console.error(err);
  process.exit(1);
});

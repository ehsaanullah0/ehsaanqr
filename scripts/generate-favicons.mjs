import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execSync } from 'node:child_process';

const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- Background Circle matching official app logo -->
  <circle cx="256" cy="256" r="256" fill="#A7B96D" />

  <!-- Outer Red Flame Body -->
  <path
    d="M 270 58
       C 260 85, 248 115, 244 145
       C 240 178, 252 205, 268 228
       C 285 205, 320 185, 365 160
       C 350 200, 335 250, 355 290
       C 385 270, 410 260, 430 275
       C 420 330, 385 395, 345 425
       C 310 448, 270 455, 235 450
       C 175 440, 115 395, 88 335
       C 76 305, 75 275, 78 260
       C 95 275, 125 285, 148 275
       C 138 240, 140 190, 160 140
       C 175 105, 205 75, 235 60
       C 250 54, 265 54, 270 58 Z"
    fill="#FF4B4B"
  />

  <!-- Middle Orange Flame Body -->
  <path
    d="M 212 205
       C 192 235, 170 275, 160 325
       C 152 365, 165 405, 195 430
       C 225 450, 265 452, 298 438
       C 325 425, 345 398, 348 368
       C 342 348, 335 330, 330 310
       C 335 295, 342 282, 348 270
       C 328 275, 305 282, 285 295
       C 272 265, 248 230, 212 205 Z"
    fill="#FF903E"
  />

  <!-- Inner Yellow Flame Core -->
  <path
    d="M 215 350
       C 200 375, 195 405, 212 428
       C 228 448, 258 452, 278 442
       C 298 430, 312 408, 312 385
       C 310 365, 295 352, 280 348
       C 255 340, 230 330, 215 350 Z"
    fill="#FFCA4B"
  />

  <!-- Main Flame Black Outlines -->
  <!-- Outer Outline -->
  <path
    d="M 270 58
       C 260 85, 248 115, 244 145
       C 240 178, 252 205, 268 228
       C 285 205, 320 185, 365 160
       C 350 200, 335 250, 355 290
       C 385 270, 410 260, 430 275
       C 420 330, 385 395, 345 425
       C 310 448, 270 455, 235 450
       C 175 440, 115 395, 88 335
       C 76 305, 75 275, 78 260
       C 95 275, 125 285, 148 275
       C 138 240, 140 190, 160 140
       C 175 105, 205 75, 235 60"
    stroke="#000000"
    stroke-width="18"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />

  <!-- Top Tip Hook Outline Accent -->
  <path
    d="M 218 74 C 235 60, 255 54, 270 58"
    stroke="#000000"
    stroke-width="18"
    stroke-linecap="round"
    fill="none"
  />

  <!-- Floating Black Dot Top-Left -->
  <circle cx="197" cy="88" r="8.5" fill="#000000" />

  <!-- Orange Flame Outline -->
  <path
    d="M 212 205
       C 192 235, 170 275, 160 325
       C 152 365, 165 405, 195 430
       C 225 450, 265 452, 298 438
       C 325 425, 345 398, 348 368
       C 342 348, 335 330, 330 310
       C 335 295, 342 282, 348 270
       C 328 275, 305 282, 285 295
       C 272 265, 248 230, 212 205 Z"
    stroke="#000000"
    stroke-width="17"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />

  <!-- Yellow Inner Core Outline -->
  <path
    d="M 215 350
       C 200 375, 195 405, 212 428
       C 228 448, 258 452, 278 442
       C 298 430, 312 408, 312 385
       C 310 365, 295 352, 280 348
       C 255 340, 230 330, 215 350 Z"
    stroke="#000000"
    stroke-width="16"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />

  <!-- Comic Accents on Lower-Right -->
  <circle cx="336" cy="348" r="8" fill="#000000" />
  <path
    d="M 334 380 C 333 392, 328 405, 322 416"
    stroke="#000000"
    stroke-width="16"
    stroke-linecap="round"
    fill="none"
  />
</svg>`;

async function main() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write clean standard SVG favicon files
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), SVG_CONTENT, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'ehsaan-flame.svg'), SVG_CONTENT, 'utf-8');
  console.log('Written favicon.svg and ehsaan-flame.svg');

  const svgBuffer = Buffer.from(SVG_CONTENT);

  // 2. Generate PNG sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
  ];

  for (const { name, size } of sizes) {
    const dest = path.join(publicDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(dest);
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // 3. Assemble multi-resolution favicon.ico containing 16x16, 32x32, and 48x48
  const p16 = path.join(publicDir, 'favicon-16x16.png');
  const p32 = path.join(publicDir, 'favicon-32x32.png');
  const p48 = path.join(publicDir, 'favicon-48x48.png');
  const icoPath = path.join(publicDir, 'favicon.ico');

  execSync(`convert "${p16}" "${p32}" "${p48}" "${icoPath}"`);
  console.log('Successfully generated favicon.ico with 16x16, 32x32, 48x48');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

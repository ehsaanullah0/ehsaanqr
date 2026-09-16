import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Standard App Icon (Transparent with circular badge)
const STANDARD_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- Circular Green Badge -->
  <circle cx="256" cy="256" r="248" fill="#9FB365" stroke="#879C4E" stroke-width="8" />

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
    fill="#FF3E3E"
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
    fill="#FF8A1E"
  />

  <!-- Inner Yellow Flame Core -->
  <path
    d="M 215 350
       C 200 375, 195 405, 212 428
       C 228 448, 258 452, 278 442
       C 298 430, 312 408, 312 385
       C 310 365, 295 352, 280 348
       C 255 340, 230 330, 215 350 Z"
    fill="#FFD23F"
  />

  <!-- Main Flame Black Outlines -->
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
    stroke="#111827"
    stroke-width="18"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />

  <!-- Top Tip Hook Outline Accent -->
  <path
    d="M 218 74 C 235 60, 255 54, 270 58"
    stroke="#111827"
    stroke-width="18"
    stroke-linecap="round"
    fill="none"
  />

  <!-- Floating Black Dot Top-Left -->
  <circle cx="197" cy="88" r="9" fill="#111827" />

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
    stroke="#111827"
    stroke-width="16"
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
    stroke="#111827"
    stroke-width="15"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />

  <!-- Comic Accents on Lower-Right -->
  <circle cx="336" cy="348" r="8.5" fill="#111827" />
  <path
    d="M 334 380 C 333 392, 328 405, 322 416"
    stroke="#111827"
    stroke-width="15"
    stroke-linecap="round"
    fill="none"
  />
</svg>`;

// PWA Maskable Icon (Full bleed background + flame scaled 76% to fit strictly in the safe zone)
const MASKABLE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- Full-bleed brand background -->
  <rect width="512" height="512" fill="#9FB365" />

  <!-- Centered, safe-zone scaled flame group (scale 0.78 centered at 256,256) -->
  <g transform="translate(256, 256) scale(0.80) translate(-256, -256)">
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
      fill="#FF3E3E"
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
      fill="#FF8A1E"
    />

    <!-- Inner Yellow Flame Core -->
    <path
      d="M 215 350
         C 200 375, 195 405, 212 428
         C 228 448, 258 452, 278 442
         C 298 430, 312 408, 312 385
         C 310 365, 295 352, 280 348
         C 255 340, 230 330, 215 350 Z"
      fill="#FFD23F"
    />

    <!-- Main Flame Black Outlines -->
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
      stroke="#111827"
      stroke-width="20"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />

    <!-- Top Tip Hook Outline Accent -->
    <path
      d="M 218 74 C 235 60, 255 54, 270 58"
      stroke="#111827"
      stroke-width="20"
      stroke-linecap="round"
      fill="none"
    />

    <!-- Floating Black Dot Top-Left -->
    <circle cx="197" cy="88" r="9.5" fill="#111827" />

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
      stroke="#111827"
      stroke-width="18"
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
      stroke="#111827"
      stroke-width="16"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />

    <!-- Comic Accents on Lower-Right -->
    <circle cx="336" cy="348" r="9" fill="#111827" />
    <path
      d="M 334 380 C 333 392, 328 405, 322 416"
      stroke="#111827"
      stroke-width="16"
      stroke-linecap="round"
      fill="none"
    />
  </g>
</svg>`;

// Apple Touch Icon (Solid off-white rounded squircle canvas with the badge)
const APPLE_TOUCH_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- Solid background for iOS Home Screen (iOS expects no transparency) -->
  <rect width="512" height="512" fill="#FAF8F5" />
  <circle cx="256" cy="256" r="236" fill="#9FB365" stroke="#879C4E" stroke-width="8" />

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
    fill="#FF3E3E"
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
    fill="#FF8A1E"
  />

  <!-- Inner Yellow Flame Core -->
  <path
    d="M 215 350
       C 200 375, 195 405, 212 428
       C 228 448, 258 452, 278 442
       C 298 430, 312 408, 312 385
       C 310 365, 295 352, 280 348
       C 255 340, 230 330, 215 350 Z"
    fill="#FFD23F"
  />

  <!-- Main Flame Black Outlines -->
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
    stroke="#111827"
    stroke-width="18"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />

  <path
    d="M 218 74 C 235 60, 255 54, 270 58"
    stroke="#111827"
    stroke-width="18"
    stroke-linecap="round"
    fill="none"
  />

  <circle cx="197" cy="88" r="9" fill="#111827" />

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
    stroke="#111827"
    stroke-width="16"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />

  <path
    d="M 215 350
       C 200 375, 195 405, 212 428
       C 228 448, 258 452, 278 442
       C 298 430, 312 408, 312 385
       C 310 365, 295 352, 280 348
       C 255 340, 230 330, 215 350 Z"
    stroke="#111827"
    stroke-width="15"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />

  <circle cx="336" cy="348" r="8.5" fill="#111827" />
  <path
    d="M 334 380 C 333 392, 328 405, 322 416"
    stroke="#111827"
    stroke-width="15"
    stroke-linecap="round"
    fill="none"
  />
</svg>`;

async function generateAllIcons() {
  const publicDir = path.resolve(process.cwd(), 'public');

  console.log('Generating high quality SVGs...');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), STANDARD_ICON_SVG);
  fs.writeFileSync(path.join(publicDir, 'ehsaan-flame.svg'), STANDARD_ICON_SVG);

  console.log('Rasterizing PNGs with sharp...');
  const stdBuffer = Buffer.from(STANDARD_ICON_SVG);
  const maskableBuffer = Buffer.from(MASKABLE_ICON_SVG);
  const appleBuffer = Buffer.from(APPLE_TOUCH_ICON_SVG);

  // 1. Favicons
  await sharp(stdBuffer).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
  await sharp(stdBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(stdBuffer).resize(48, 48).png().toFile(path.join(publicDir, 'favicon-48x48.png'));

  // 2. Apple Touch Icon (180x180)
  await sharp(appleBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 3. PWA Icons (192, 512, maskable)
  await sharp(stdBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(stdBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  await sharp(maskableBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon-maskable-512.png'));

  // 4. Also generate standard favicon.ico from 48x48 / 32x32 png
  await sharp(stdBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.ico'));

  console.log('All icons generated successfully!');
}

generateAllIcons().catch(err => {
  console.error(err);
  process.exit(1);
});

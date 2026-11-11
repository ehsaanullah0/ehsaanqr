import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Minimal Circular Logo SVG with Unique Character & Red Accent
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <!-- Background Gradient: Deep Obsidian to Slate -->
    <linearGradient id="bgGrad" x1="64" y1="64" x2="448" y2="448" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1E2230" />
      <stop offset="100%" stop-color="#0A0C10" />
    </linearGradient>

    <!-- Outer Rim Gradient -->
    <linearGradient id="rimGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#384158" />
      <stop offset="100%" stop-color="#181B24" />
    </linearGradient>

    <!-- Red Accent Gradient -->
    <linearGradient id="redAccentGrad" x1="330" y1="110" x2="410" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF385C" />
      <stop offset="100%" stop-color="#D90429" />
    </linearGradient>

    <!-- White Glyph Gradient -->
    <linearGradient id="glyphGrad" x1="120" y1="120" x2="380" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
  </defs>

  <!-- Circular Outer Disc -->
  <circle cx="256" cy="256" r="244" fill="url(#bgGrad)" stroke="url(#rimGrad)" stroke-width="12" />

  <!-- Inner Subtle Concentric Track for Precision & Depth -->
  <circle cx="256" cy="256" r="216" stroke="#252B3B" stroke-width="3" stroke-dasharray="8 6" opacity="0.6" />

  <!-- Unique Character: Stylized Minimalist "E" + QR Matrix Locator Glyph -->
  <!-- Outer Finder Frame (Stylized Rounded 'E' Contour) -->
  <path
    d="M 330 148
       L 194 148
       A 46 46 0 0 0 148 194
       L 148 318
       A 46 46 0 0 0 194 364
       L 330 364
       A 22 22 0 0 0 352 342
       L 352 342
       A 22 22 0 0 0 330 320
       L 204 320
       A 14 14 0 0 1 190 306
       L 190 206
       A 14 14 0 0 1 204 192
       L 330 192
       A 22 22 0 0 0 352 170
       L 352 170
       A 22 22 0 0 0 330 148 Z"
    fill="url(#glyphGrad)"
  />

  <!-- Center Crossbar of 'E' with QR Module Geometry -->
  <rect x="180" y="234" width="108" height="44" rx="14" fill="url(#glyphGrad)" />

  <!-- QR Inner Locator Eye / Core Module -->
  <rect x="246" y="242" width="28" height="28" rx="8" fill="#0E121B" />

  <!-- Vibrant Red Accent: The Energetic Spark / Flame Node (Unique Character Signature) -->
  <circle cx="376" cy="170" r="28" fill="url(#redAccentGrad)" />
  <!-- Micro Inner Highlight in Red Accent -->
  <circle cx="368" cy="162" r="9" fill="#FFA3B2" opacity="0.8" />

  <!-- Distinctive Mini Red Accent Dot near Bottom-Right for visual balance -->
  <circle cx="376" cy="342" r="10" fill="url(#redAccentGrad)" opacity="0.9" />
</svg>`;

async function generate() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const svgBuffer = Buffer.from(LOGO_SVG);

  // Write SVGs
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), LOGO_SVG);
  fs.writeFileSync(path.join(publicDir, 'ehsaan-flame.svg'), LOGO_SVG);

  console.log('Saved SVGs to public/');

  // Generate PNG sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
  ];

  for (const s of sizes) {
    await sharp(svgBuffer)
      .resize(s.size, s.size)
      .png()
      .toFile(path.join(publicDir, s.name));
    console.log(`Generated ${s.name} (${s.size}x${s.size})`);
  }

  // Generate Maskable Icon (with safe padding for maskable PWA specs)
  // Maskable icon requires safe area (central 80% circle)
  const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
    <rect width="512" height="512" fill="#0A0C10" />
    <g transform="translate(51.2, 51.2) scale(0.8)">
      ${LOGO_SVG.replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">', '').replace('</svg>', '')}
    </g>
  </svg>`;

  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));
  console.log('Generated icon-maskable-512.png');

  // Also copy 32x32 to favicon.ico if possible or write as png
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Updated favicon.ico');
}

generate().catch(console.error);

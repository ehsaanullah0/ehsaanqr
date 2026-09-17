import QRCode from 'qrcode';
import { QrStyleOptions, EyeStyle, PatternStyle, PupilStyle, LogoConfig, QrType, LogoType } from '../types';

// Preset Logo SVG definitions and data URLs for canvas and SVG embedding
// Cohesive, minimal-outline vector icon system (24x24 viewBox, stroke-width 2, optical balance)
export const URL_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10" />
  <line x1="2" y1="12" x2="22" y2="12" />
  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
</svg>`;

export const PHONE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
</svg>`;

export const WHATSAPP_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" stroke-width="1.8" />
</svg>`;

export const WIFI_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
  <line x1="12" y1="20" x2="12.01" y2="20" stroke-width="3" />
</svg>`;

export const EMAIL_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="20" height="16" x="2" y="4" rx="2" />
  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
</svg>`;

export const UPI_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="20" height="16" x="2" y="4" rx="2.5" />
  <path d="M6 8.5v3.5a1.5 1.5 0 0 0 3 0V8.5" />
  <path d="M11.5 15.5v-7h2a1.5 1.5 0 0 1 0 3h-2" />
  <line x1="16.5" y1="8.5" x2="16.5" y2="15.5" />
</svg>`;

export const PAYMENT_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="20" height="14" x="2" y="5" rx="2" />
  <line x1="2" y1="10" x2="22" y2="10" />
  <line x1="6" y1="15" x2="10" y2="15" />
</svg>`;

export const TEXT_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
  <polyline points="14 2 14 8 20 8" />
  <line x1="16" y1="13" x2="8" y2="13" />
  <line x1="16" y1="17" x2="8" y2="17" />
  <polyline points="10 9 9 9 8 9" />
</svg>`;

export const SMS_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  <line x1="8" y1="9" x2="16" y2="9" />
  <line x1="8" y1="13" x2="14" y2="13" />
</svg>`;

export const CALENDAR_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="18" height="18" x="3" y="4" rx="2" />
  <line x1="16" y1="2" x2="16" y2="6" />
  <line x1="8" y1="2" x2="8" y2="6" />
  <line x1="3" y1="10" x2="21" y2="10" />
  <circle cx="8" cy="14" r="0.9" fill="#111827" stroke="none" />
  <circle cx="12" cy="14" r="0.9" fill="#111827" stroke="none" />
  <circle cx="16" cy="14" r="0.9" fill="#111827" stroke="none" />
  <circle cx="8" cy="17.5" r="0.9" fill="#111827" stroke="none" />
  <circle cx="12" cy="17.5" r="0.9" fill="#111827" stroke="none" />
  <circle cx="16" cy="17.5" r="0.9" fill="#111827" stroke="none" />
</svg>`;

export const VCARD_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="18" height="18" x="3" y="3" rx="2.5" />
  <circle cx="12" cy="9.5" r="2.8" />
  <path d="M7 16.5c0-1.8 2.2-2.8 5-2.8s5 1 5 2.8" />
</svg>`;

export const LOCATION_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 10c0 5.2-7 11.5-8 12.3-.9-.8-8-7.1-8-12.3a8 8 0 0 1 16 0z" />
  <circle cx="12" cy="10" r="3" />
</svg>`;

export const URL_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(URL_LOGO_SVG)}`;
export const PHONE_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PHONE_LOGO_SVG)}`;
export const WHATSAPP_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(WHATSAPP_LOGO_SVG)}`;
export const WIFI_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(WIFI_LOGO_SVG)}`;
export const EMAIL_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(EMAIL_LOGO_SVG)}`;
export const UPI_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(UPI_LOGO_SVG)}`;
export const PAYMENT_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PAYMENT_LOGO_SVG)}`;
export const TEXT_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(TEXT_LOGO_SVG)}`;
export const SMS_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SMS_LOGO_SVG)}`;
export const CALENDAR_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(CALENDAR_LOGO_SVG)}`;
export const VCARD_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(VCARD_LOGO_SVG)}`;
export const LOCATION_LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LOCATION_LOGO_SVG)}`;

/**
 * Maps a QR code data type category to the most appropriate center logo icon
 */
export function getAutoLogoForCategory(category: QrType): LogoType {
  switch (category) {
    case 'url':
      return 'url';
    case 'phone':
      return 'phone';
    case 'whatsapp':
      return 'whatsapp';
    case 'wifi':
      return 'wifi';
    case 'email':
      return 'email';
    case 'upi':
      return 'upi';
    case 'text':
      return 'text';
    case 'sms':
      return 'sms';
    case 'calendar':
      return 'calendar';
    case 'vcard':
      return 'vcard';
    case 'location':
      return 'location';
    default:
      return 'none';
  }
}

export function getLogoSourceUrl(logo: LogoConfig): string | undefined {
  if (!logo || logo.type === 'none') return undefined;
  switch (logo.type) {
    case 'url':
      return URL_LOGO_DATA_URL;
    case 'phone':
      return PHONE_LOGO_DATA_URL;
    case 'whatsapp':
      return WHATSAPP_LOGO_DATA_URL;
    case 'wifi':
      return WIFI_LOGO_DATA_URL;
    case 'email':
      return EMAIL_LOGO_DATA_URL;
    case 'upi':
      return UPI_LOGO_DATA_URL;
    case 'payment':
      return PAYMENT_LOGO_DATA_URL;
    case 'text':
      return TEXT_LOGO_DATA_URL;
    case 'sms':
      return SMS_LOGO_DATA_URL;
    case 'calendar':
      return CALENDAR_LOGO_DATA_URL;
    case 'vcard':
      return VCARD_LOGO_DATA_URL;
    case 'location':
      return LOCATION_LOGO_DATA_URL;
    case 'custom':
      return logo.customUrl;
    default:
      return logo.customUrl;
  }
}

interface EyeLocation {
  row: number;
  col: number;
}

export function isPartOfFinder(row: number, col: number, size: number): boolean {
  // Top-Left: [0..6, 0..6]
  if (row < 7 && col < 7) return true;
  // Top-Right: [0..6, size-7..size-1]
  if (row < 7 && col >= size - 7) return true;
  // Bottom-Left: [size-7..size-1, 0..6]
  if (row >= size - 7 && col < 7) return true;
  return false;
}

function getEyeLocations(size: number): EyeLocation[] {
  return [
    { row: 0, col: 0 },
    { row: 0, col: size - 7 },
    { row: size - 7, col: 0 },
  ];
}

/**
 * Creates canvas color or gradient fillStyle
 */
function createFillStyle(
  ctx: CanvasRenderingContext2D,
  options: QrStyleOptions,
  canvasWidth: number,
  canvasHeight: number
): string | CanvasGradient {
  if (options.colorMode === 'linear-gradient') {
    const angleRad = (options.gradientAngle * Math.PI) / 180;
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    const len = Math.max(canvasWidth, canvasHeight) / 2;
    const x0 = cx - Math.cos(angleRad) * len;
    const y0 = cy - Math.sin(angleRad) * len;
    const x1 = cx + Math.cos(angleRad) * len;
    const y1 = cy + Math.sin(angleRad) * len;
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    grad.addColorStop(0, options.fgColor);
    grad.addColorStop(1, options.fgColorEnd);
    return grad;
  }

  if (options.colorMode === 'radial-gradient') {
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    const radius = Math.max(canvasWidth, canvasHeight) / 1.5;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, options.fgColor);
    grad.addColorStop(1, options.fgColorEnd);
    return grad;
  }

  return options.fgColor;
}

/**
 * Helper to draw a rounded rectangle on a canvas context
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Draws a single QR module according to the selected pattern
 */
function drawModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  pattern: PatternStyle
) {
  const cx = x + size / 2;
  const cy = y + size / 2;

  switch (pattern) {
    case 'circle':
    case 'dots': {
      const radius = size * 0.44;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'rounded': {
      const r = size * 0.30;
      roundRect(ctx, x + 0.5, y + 0.5, size - 1, size - 1, r);
      ctx.fill();
      break;
    }
    case 'squircle': {
      const r = size * 0.45;
      roundRect(ctx, x + 0.5, y + 0.5, size - 1, size - 1, r);
      ctx.fill();
      break;
    }
    case 'pill': {
      const pw = size * 0.88;
      const ph = size * 0.72;
      const px = x + (size - pw) / 2;
      const py = y + (size - ph) / 2;
      roundRect(ctx, px, py, pw, ph, ph / 2);
      ctx.fill();
      break;
    }
    case 'diamond': {
      ctx.beginPath();
      ctx.moveTo(cx, y + size * 0.04);
      ctx.lineTo(x + size * 0.96, cy);
      ctx.lineTo(cx, y + size * 0.96);
      ctx.lineTo(x + size * 0.04, cy);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'hexagon': {
      const r = size * 0.48;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'octagon': {
      const c = size * 0.28;
      ctx.beginPath();
      ctx.moveTo(x + c, y);
      ctx.lineTo(x + size - c, y);
      ctx.lineTo(x + size, y + c);
      ctx.lineTo(x + size, y + size - c);
      ctx.lineTo(x + size - c, y + size);
      ctx.lineTo(x + c, y + size);
      ctx.lineTo(x, y + size - c);
      ctx.lineTo(x, y + c);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'leaf': {
      const r = size * 0.48;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size, y + size - r);
      ctx.arcTo(x + size, y + size, x + size - r, y + size, r);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'flower': {
      const pr = size * 0.22;
      const d = size * 0.26;
      ctx.beginPath();
      ctx.arc(cx, cy - d, pr, 0, Math.PI * 2);
      ctx.arc(cx + d, cy, pr, 0, Math.PI * 2);
      ctx.arc(cx, cy + d, pr, 0, Math.PI * 2);
      ctx.arc(cx - d, cy, pr, 0, Math.PI * 2);
      ctx.arc(cx, cy, pr * 1.1, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'square':
    default:
      ctx.fillRect(x, y, size, size);
      break;
  }
}

/**
 * Draws an organic connected fluid liquid module.
 * Adjacent orthogonal modules connect seamlessly while exposed corners curve smoothly like liquid droplets.
 */
function drawLiquidModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  top: boolean,
  right: boolean,
  bottom: boolean,
  left: boolean
) {
  // If isolated (no connected neighbors), draw a smooth circular droplet
  if (!top && !right && !bottom && !left) {
    const r = size * 0.44;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, r, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Radius for outer exposed corners (smooth liquid droplet curve)
  const rTL = !top && !left ? size * 0.46 : 0;
  const rTR = !top && !right ? size * 0.46 : 0;
  const rBR = !bottom && !right ? size * 0.46 : 0;
  const rBL = !bottom && !left ? size * 0.46 : 0;

  ctx.beginPath();
  ctx.moveTo(x + rTL, y);
  ctx.lineTo(x + size - rTR, y);
  if (rTR > 0) {
    ctx.arcTo(x + size, y, x + size, y + rTR, rTR);
  }
  ctx.lineTo(x + size, y + size - rBR);
  if (rBR > 0) {
    ctx.arcTo(x + size, y + size, x + size - rBR, y + size, rBR);
  }
  ctx.lineTo(x + rBL, y + size);
  if (rBL > 0) {
    ctx.arcTo(x, y + size, x, y + size - rBL, rBL);
  }
  ctx.lineTo(x, y + rTL);
  if (rTL > 0) {
    ctx.arcTo(x, y, x + rTL, y, rTL);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Generates an SVG path for an organic fluid liquid module.
 */
function getLiquidModuleSvg(
  x: number,
  y: number,
  size: number,
  top: boolean,
  right: boolean,
  bottom: boolean,
  left: boolean,
  fillColor: string
): string {
  if (!top && !right && !bottom && !left) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = size * 0.44;
    return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="${fillColor}" />\n`;
  }

  const rTL = !top && !left ? size * 0.46 : 0;
  const rTR = !top && !right ? size * 0.46 : 0;
  const rBR = !bottom && !right ? size * 0.46 : 0;
  const rBL = !bottom && !left ? size * 0.46 : 0;

  let d = `M ${(x + rTL).toFixed(2)} ${y.toFixed(2)} `;
  d += `L ${(x + size - rTR).toFixed(2)} ${y.toFixed(2)} `;
  if (rTR > 0) {
    d += `A ${rTR.toFixed(2)} ${rTR.toFixed(2)} 0 0 1 ${(x + size).toFixed(2)} ${(y + rTR).toFixed(2)} `;
  }
  d += `L ${(x + size).toFixed(2)} ${(y + size - rBR).toFixed(2)} `;
  if (rBR > 0) {
    d += `A ${rBR.toFixed(2)} ${rBR.toFixed(2)} 0 0 1 ${(x + size - rBR).toFixed(2)} ${(y + size - rBR).toFixed(2)} `;
  }
  d += `L ${(x + rBL).toFixed(2)} ${(y + size).toFixed(2)} `;
  if (rBL > 0) {
    d += `A ${rBL.toFixed(2)} ${rBL.toFixed(2)} 0 0 1 ${x.toFixed(2)} ${(y + size - rBL).toFixed(2)} `;
  }
  d += `L ${x.toFixed(2)} ${(y + rTL).toFixed(2)} `;
  if (rTL > 0) {
    d += `A ${rTL.toFixed(2)} ${rTL.toFixed(2)} 0 0 1 ${(x + rTL).toFixed(2)} ${y.toFixed(2)} `;
  }
  d += 'Z';

  return `<path d="${d}" fill="${fillColor}" />\n`;
}

/**
 * Resolves pupil shape given the user's pupilStyle preference and eyeStyle
 */
export function resolvePupilShape(
  pupilStyle: PupilStyle | undefined,
  eyeStyle: EyeStyle
): Exclude<PupilStyle, 'auto'> {
  if (!pupilStyle || pupilStyle === 'auto') {
    if (eyeStyle === 'circle') return 'circle';
    if (eyeStyle === 'square') return 'square';
    if (eyeStyle === 'rounded') return 'rounded';
    if (eyeStyle === 'modern') return 'rounded';
    if (eyeStyle === 'leaf') return 'leaf';
    if (eyeStyle === 'outer-smooth') return 'rounded';
    if (eyeStyle === 'cut-corner') return 'chamfer';
    if (eyeStyle === 'hexagon') return 'hexagon';
    if (eyeStyle === 'star') return 'star';
    if (eyeStyle === 'flower') return 'circle';
    return 'rounded';
  }
  return pupilStyle;
}

/**
 * Draws the inner pupil core with various shape geometries on Canvas
 */
export function drawPupilCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: Exclude<PupilStyle, 'auto'>
) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const half = size / 2;

  switch (shape) {
    case 'square':
      ctx.beginPath();
      ctx.rect(x, y, size, size);
      ctx.fill();
      break;

    case 'rounded':
      roundRect(ctx, x, y, size, size, size * 0.28);
      ctx.fill();
      break;

    case 'circle':
      ctx.beginPath();
      ctx.arc(cx, cy, half, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(x + size, cy);
      ctx.lineTo(cx, y + size);
      ctx.lineTo(x, cy);
      ctx.closePath();
      ctx.fill();
      break;

    case 'chamfer': {
      const cut = size * 0.28;
      drawCutCornerPolygonCanvas(ctx, x, y, size, cut);
      break;
    }

    case 'leaf': {
      const r = size * 0.48;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size, y + size - r);
      ctx.arcTo(x + size, y + size, x + size - r, y + size, r);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'droplet': {
      const r = size * 0.48;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size - r, y);
      ctx.arcTo(x + size, y, x + size, y + r, r);
      ctx.lineTo(x + size, y + size - r);
      ctx.arcTo(x + size, y + size, x + size - r, y + size, r);
      ctx.lineTo(x + r, y + size);
      ctx.arcTo(x, y + size, x, y + size - r, r);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'star': {
      const d = size * 0.22;
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(cx + d, cy - d);
      ctx.lineTo(x + size, cy);
      ctx.lineTo(cx + d, cy + d);
      ctx.lineTo(cx, y + size);
      ctx.lineTo(cx - d, cy + d);
      ctx.lineTo(x, cy);
      ctx.lineTo(cx - d, cy - d);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'heart': {
      ctx.beginPath();
      ctx.moveTo(cx, y + size * 0.90);
      ctx.bezierCurveTo(x + size * 0.05, y + size * 0.60, x + size * 0.02, y + size * 0.15, cx - size * 0.22, y + size * 0.15);
      ctx.bezierCurveTo(cx - size * 0.06, y + size * 0.15, cx, y + size * 0.28, cx, y + size * 0.36);
      ctx.bezierCurveTo(cx, y + size * 0.28, cx + size * 0.06, y + size * 0.15, cx + size * 0.22, y + size * 0.15);
      ctx.bezierCurveTo(x + size * 0.98, y + size * 0.15, x + size * 0.95, y + size * 0.60, cx, y + size * 0.90);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'ring': {
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
      ctx.arc(cx, cy, size * 0.20, 0, Math.PI * 2, true);
      ctx.fill();
      break;
    }

    case 'hexagon': {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const px = cx + size * 0.48 * Math.cos(angle);
        const py = cy + size * 0.48 * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
  }
}

/**
 * Returns SVG string representation for an inner pupil
 */
export function getPupilSvg(
  x: number,
  y: number,
  size: number,
  shape: Exclude<PupilStyle, 'auto'>,
  fillColor: string
): string {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const half = size / 2;

  switch (shape) {
    case 'square':
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" fill="${fillColor}" />\n`;

    case 'rounded':
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" rx="${(size * 0.28).toFixed(2)}" fill="${fillColor}" />\n`;

    case 'circle':
      return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${half.toFixed(2)}" fill="${fillColor}" />\n`;

    case 'diamond':
      return `<polygon points="${cx.toFixed(2)},${y.toFixed(2)} ${(x + size).toFixed(2)},${cy.toFixed(2)} ${cx.toFixed(2)},${(y + size).toFixed(2)} ${x.toFixed(2)},${cy.toFixed(2)}" fill="${fillColor}" />\n`;

    case 'chamfer': {
      const cut = size * 0.28;
      return getCutCornerPolygonSvg(x, y, size, cut, fillColor);
    }

    case 'leaf': {
      const r = size * 0.48;
      return `<path d="M ${(x + r).toFixed(2)} ${y.toFixed(2)} L ${(x + size).toFixed(2)} ${y.toFixed(2)} L ${(x + size).toFixed(2)} ${(y + size - r).toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${(x + size - r).toFixed(2)} ${(y + size).toFixed(2)} L ${x.toFixed(2)} ${(y + size).toFixed(2)} L ${x.toFixed(2)} ${(y + r).toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${(x + r).toFixed(2)} ${y.toFixed(2)} Z" fill="${fillColor}" />\n`;
    }

    case 'droplet': {
      const r = size * 0.48;
      return `<path d="M ${x.toFixed(2)} ${y.toFixed(2)} L ${(x + size - r).toFixed(2)} ${y.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${(x + size).toFixed(2)} ${(y + r).toFixed(2)} L ${(x + size).toFixed(2)} ${(y + size - r).toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${(x + size - r).toFixed(2)} ${(y + size).toFixed(2)} L ${(x + r).toFixed(2)} ${(y + size).toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${x.toFixed(2)} ${(y + size - r).toFixed(2)} Z" fill="${fillColor}" />\n`;
    }

    case 'star': {
      const d = size * 0.22;
      return `<polygon points="${cx.toFixed(2)},${y.toFixed(2)} ${(cx + d).toFixed(2)},${(cy - d).toFixed(2)} ${(x + size).toFixed(2)},${cy.toFixed(2)} ${(cx + d).toFixed(2)},${(cy + d).toFixed(2)} ${(cx).toFixed(2)},${(y + size).toFixed(2)} ${(cx - d).toFixed(2)},${(cy + d).toFixed(2)} ${x.toFixed(2)},${cy.toFixed(2)} ${(cx - d).toFixed(2)},${(cy - d).toFixed(2)}" fill="${fillColor}" />\n`;
    }

    case 'heart': {
      return `<path d="M ${cx.toFixed(2)} ${(y + size * 0.90).toFixed(2)} C ${(x + size * 0.05).toFixed(2)} ${(y + size * 0.60).toFixed(2)}, ${(x + size * 0.02).toFixed(2)} ${(y + size * 0.15).toFixed(2)}, ${(cx - size * 0.22).toFixed(2)} ${(y + size * 0.15).toFixed(2)} C ${(cx - size * 0.06).toFixed(2)} ${(y + size * 0.15).toFixed(2)}, ${cx.toFixed(2)} ${(y + size * 0.28).toFixed(2)}, ${cx.toFixed(2)} ${(y + size * 0.36).toFixed(2)} C ${cx.toFixed(2)} ${(y + size * 0.28).toFixed(2)}, ${(cx + size * 0.06).toFixed(2)} ${(y + size * 0.15).toFixed(2)}, ${(cx + size * 0.22).toFixed(2)} ${(y + size * 0.15).toFixed(2)} C ${(x + size * 0.98).toFixed(2)} ${(y + size * 0.15).toFixed(2)}, ${(x + size * 0.95).toFixed(2)} ${(y + size * 0.60).toFixed(2)}, ${cx.toFixed(2)} ${(y + size * 0.90).toFixed(2)} Z" fill="${fillColor}" />\n`;
    }

    case 'ring': {
      const rOut = size * 0.48;
      const rIn = size * 0.20;
      return `<path d="M ${(cx + rOut).toFixed(2)} ${cy.toFixed(2)} A ${rOut.toFixed(2)} ${rOut.toFixed(2)} 0 1 0 ${(cx - rOut).toFixed(2)} ${cy.toFixed(2)} A ${rOut.toFixed(2)} ${rOut.toFixed(2)} 0 1 0 ${(cx + rOut).toFixed(2)} ${cy.toFixed(2)} Z M ${(cx + rIn).toFixed(2)} ${cy.toFixed(2)} A ${rIn.toFixed(2)} ${rIn.toFixed(2)} 0 1 1 ${(cx - rIn).toFixed(2)} ${cy.toFixed(2)} A ${rIn.toFixed(2)} ${rIn.toFixed(2)} 0 1 1 ${(cx + rIn).toFixed(2)} ${cy.toFixed(2)} Z" fill-rule="evenodd" fill="${fillColor}" />\n`;
    }

    case 'hexagon': {
      const points = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        return `${(cx + size * 0.48 * Math.cos(a)).toFixed(2)},${(cy + size * 0.48 * Math.sin(a)).toFixed(2)}`;
      }).join(' ');
      return `<polygon points="${points}" fill="${fillColor}" />\n`;
    }
  }
}

/**
 * Helper to draw a rectangle with individual corner radii on Canvas
 */
function drawCustomCornerRectCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rTL: number,
  rTR: number,
  rBR: number,
  rBL: number
) {
  ctx.beginPath();
  ctx.moveTo(x + rTL, y);
  ctx.lineTo(x + w - rTR, y);
  if (rTR > 0) ctx.arcTo(x + w, y, x + w, y + rTR, rTR);
  ctx.lineTo(x + w, y + h - rBR);
  if (rBR > 0) ctx.arcTo(x + w, y + h, x + w - rBR, y + h, rBR);
  ctx.lineTo(x + rBL, y + h);
  if (rBL > 0) ctx.arcTo(x, y + h, x, y + h - rBL, rBL);
  ctx.lineTo(x, y + rTL);
  if (rTL > 0) ctx.arcTo(x, y, x + rTL, y, rTL);
  ctx.closePath();
  ctx.fill();
}

/**
 * Helper to generate SVG path for a rectangle with individual corner radii
 */
function getCustomCornerRectSvg(
  x: number,
  y: number,
  w: number,
  h: number,
  rTL: number,
  rTR: number,
  rBR: number,
  rBL: number,
  fillColor: string
): string {
  let d = `M ${(x + rTL).toFixed(2)} ${y.toFixed(2)} `;
  d += `L ${(x + w - rTR).toFixed(2)} ${y.toFixed(2)} `;
  if (rTR > 0) d += `A ${rTR.toFixed(2)} ${rTR.toFixed(2)} 0 0 1 ${(x + w).toFixed(2)} ${(y + rTR).toFixed(2)} `;
  d += `L ${(x + w).toFixed(2)} ${(y + h - rBR).toFixed(2)} `;
  if (rBR > 0) d += `A ${rBR.toFixed(2)} ${rBR.toFixed(2)} 0 0 1 ${(x + w - rBR).toFixed(2)} ${(y + h).toFixed(2)} `;
  d += `L ${(x + rBL).toFixed(2)} ${(y + h).toFixed(2)} `;
  if (rBL > 0) d += `A ${rBL.toFixed(2)} ${rBL.toFixed(2)} 0 0 1 ${x.toFixed(2)} ${(y + h - rBL).toFixed(2)} `;
  d += `L ${x.toFixed(2)} ${(y + rTL).toFixed(2)} `;
  if (rTL > 0) d += `A ${rTL.toFixed(2)} ${rTL.toFixed(2)} 0 0 1 ${(x + rTL).toFixed(2)} ${y.toFixed(2)} `;
  d += 'Z';
  return `<path d="${d}" fill="${fillColor}" />\n`;
}

/**
 * Helper to draw a chamfered (cut-corner) polygon on Canvas
 */
function drawCutCornerPolygonCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  cut: number
) {
  const c = Math.min(cut, size / 2);
  ctx.beginPath();
  ctx.moveTo(x + c, y);
  ctx.lineTo(x + size - c, y);
  ctx.lineTo(x + size, y + c);
  ctx.lineTo(x + size, y + size - c);
  ctx.lineTo(x + size - c, y + size);
  ctx.lineTo(x + c, y + size);
  ctx.lineTo(x, y + size - c);
  ctx.lineTo(x, y + c);
  ctx.closePath();
  ctx.fill();
}

/**
 * Helper to generate SVG polygon for chamfered (cut-corner)
 */
function getCutCornerPolygonSvg(
  x: number,
  y: number,
  size: number,
  cut: number,
  fillColor: string
): string {
  const c = Math.min(cut, size / 2);
  const p = [
    `${(x + c).toFixed(2)},${y.toFixed(2)}`,
    `${(x + size - c).toFixed(2)},${y.toFixed(2)}`,
    `${(x + size).toFixed(2)},${(y + c).toFixed(2)}`,
    `${(x + size).toFixed(2)},${(y + size - c).toFixed(2)}`,
    `${(x + size - c).toFixed(2)},${(y + size).toFixed(2)}`,
    `${(x + c).toFixed(2)},${(y + size).toFixed(2)}`,
    `${x.toFixed(2)},${(y + size - c).toFixed(2)}`,
    `${x.toFixed(2)},${(y + c).toFixed(2)}`,
  ].join(' ');
  return `<polygon points="${p}" fill="${fillColor}" />\n`;
}

/**
 * Helper to draw a regular hexagon on Canvas
 */
function drawHexagonCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Helper to generate SVG polygon for a regular hexagon
 */
function getHexagonSvg(
  x: number,
  y: number,
  size: number,
  fillColor: string
): string {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    points.push(`${px.toFixed(2)},${py.toFixed(2)}`);
  }
  return `<polygon points="${points.join(' ')}" fill="${fillColor}" />\n`;
}

/**
 * Helper to draw a 4-pointed star / pinched frame on Canvas
 */
function drawStarFrameCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const pinch = size * 0.18;
  ctx.beginPath();
  ctx.moveTo(cx, y);
  ctx.quadraticCurveTo(cx + pinch, cy - pinch, x + size, cy);
  ctx.quadraticCurveTo(cx + pinch, cy + pinch, cx, y + size);
  ctx.quadraticCurveTo(cx - pinch, cy + pinch, x, cy);
  ctx.quadraticCurveTo(cx - pinch, cy - pinch, cx, y);
  ctx.closePath();
  ctx.fill();
}

/**
 * Helper to generate SVG path for a 4-pointed star / pinched frame
 */
function getStarFrameSvg(
  x: number,
  y: number,
  size: number,
  fillColor: string
): string {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const pinch = size * 0.18;
  const d =
    `M ${cx.toFixed(2)} ${y.toFixed(2)} ` +
    `Q ${(cx + pinch).toFixed(2)} ${(cy - pinch).toFixed(2)} ${(x + size).toFixed(2)} ${cy.toFixed(2)} ` +
    `Q ${(cx + pinch).toFixed(2)} ${(cy + pinch).toFixed(2)} ${cx.toFixed(2)} ${(y + size).toFixed(2)} ` +
    `Q ${(cx - pinch).toFixed(2)} ${(cy + pinch).toFixed(2)} ${x.toFixed(2)} ${cy.toFixed(2)} ` +
    `Q ${(cx - pinch).toFixed(2)} ${(cy - pinch).toFixed(2)} ${cx.toFixed(2)} ${y.toFixed(2)} Z`;
  return `<path d="${d}" fill="${fillColor}" />\n`;
}

/**
 * Helper to draw a 4-petal clover/flower frame on Canvas
 */
function drawFlowerFrameCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.38;
  ctx.beginPath();
  roundRect(ctx, x, y, size, size, size * 0.3);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, y + size * 0.22, r * 0.6, 0, Math.PI * 2);
  ctx.arc(x + size - size * 0.22, cy, r * 0.6, 0, Math.PI * 2);
  ctx.arc(cx, y + size - size * 0.22, r * 0.6, 0, Math.PI * 2);
  ctx.arc(x + size * 0.22, cy, r * 0.6, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Helper to generate SVG for a 4-petal flower frame
 */
function getFlowerFrameSvg(
  x: number,
  y: number,
  size: number,
  fillColor: string
): string {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.38;
  const rx = (size * 0.3).toFixed(2);
  return (
    `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" rx="${rx}" fill="${fillColor}" />\n` +
    `<circle cx="${cx.toFixed(2)}" cy="${(y + size * 0.22).toFixed(2)}" r="${(r * 0.6).toFixed(2)}" fill="${fillColor}" />\n` +
    `<circle cx="${(x + size - size * 0.22).toFixed(2)}" cy="${cy.toFixed(2)}" r="${(r * 0.6).toFixed(2)}" fill="${fillColor}" />\n` +
    `<circle cx="${cx.toFixed(2)}" cy="${(y + size - size * 0.22).toFixed(2)}" r="${(r * 0.6).toFixed(2)}" fill="${fillColor}" />\n` +
    `<circle cx="${(x + size * 0.22).toFixed(2)}" cy="${cy.toFixed(2)}" r="${(r * 0.6).toFixed(2)}" fill="${fillColor}" />\n`
  );
}

/**
 * Draws the eye frame shape onto Canvas
 */
function drawEyeFrameCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  style: EyeStyle,
  loc: EyeLocation,
  moduleSize: number,
  isOuter: boolean
) {
  switch (style) {
    case 'square':
      ctx.fillRect(x, y, size, size);
      break;
    case 'rounded': {
      const r = isOuter ? moduleSize * 2.2 : Math.max(0, moduleSize * 1.2);
      roundRect(ctx, x, y, size, size, r);
      ctx.fill();
      break;
    }
    case 'circle': {
      const cx = x + size / 2;
      const cy = y + size / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'modern': {
      const r = isOuter ? moduleSize * 1.6 : Math.max(0, moduleSize * 0.8);
      roundRect(ctx, x, y, size, size, r);
      ctx.fill();
      break;
    }
    case 'leaf': {
      const r = isOuter ? size * 0.46 : size * 0.42;
      drawCustomCornerRectCanvas(ctx, x, y, size, size, r, 0, r, 0);
      break;
    }
    case 'outer-smooth': {
      const r = isOuter ? size * 0.44 : size * 0.40;
      if (loc.row === 0 && loc.col === 0) {
        // Top-left eye: bottom-right corner is sharp towards center
        drawCustomCornerRectCanvas(ctx, x, y, size, size, r, r, 0, r);
      } else if (loc.row === 0 && loc.col > 0) {
        // Top-right eye: bottom-left corner is sharp towards center
        drawCustomCornerRectCanvas(ctx, x, y, size, size, r, r, r, 0);
      } else {
        // Bottom-left eye: top-right corner is sharp towards center
        drawCustomCornerRectCanvas(ctx, x, y, size, size, r, 0, r, r);
      }
      break;
    }
    case 'cut-corner': {
      const cut = isOuter ? moduleSize * 1.6 : moduleSize * 1.0;
      drawCutCornerPolygonCanvas(ctx, x, y, size, cut);
      break;
    }
    case 'hexagon': {
      drawHexagonCanvas(ctx, x, y, size);
      break;
    }
    case 'star': {
      drawStarFrameCanvas(ctx, x, y, size);
      break;
    }
    case 'flower': {
      drawFlowerFrameCanvas(ctx, x, y, size);
      break;
    }
    default:
      ctx.fillRect(x, y, size, size);
  }
}

/**
 * Returns SVG markup for an eye frame
 */
function getEyeFrameSvg(
  x: number,
  y: number,
  size: number,
  style: EyeStyle,
  loc: EyeLocation,
  moduleSize: number,
  fillColor: string,
  isOuter: boolean
): string {
  switch (style) {
    case 'square':
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" fill="${fillColor}" />\n`;
    case 'rounded': {
      const r = isOuter ? moduleSize * 2.2 : Math.max(0, moduleSize * 1.2);
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" rx="${r.toFixed(2)}" fill="${fillColor}" />\n`;
    }
    case 'circle': {
      const cx = x + size / 2;
      const cy = y + size / 2;
      return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${(size / 2).toFixed(2)}" fill="${fillColor}" />\n`;
    }
    case 'modern': {
      const r = isOuter ? moduleSize * 1.6 : Math.max(0, moduleSize * 0.8);
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" rx="${r.toFixed(2)}" fill="${fillColor}" />\n`;
    }
    case 'leaf': {
      const r = isOuter ? size * 0.46 : size * 0.42;
      return getCustomCornerRectSvg(x, y, size, size, r, 0, r, 0, fillColor);
    }
    case 'outer-smooth': {
      const r = isOuter ? size * 0.44 : size * 0.40;
      if (loc.row === 0 && loc.col === 0) {
        return getCustomCornerRectSvg(x, y, size, size, r, r, 0, r, fillColor);
      } else if (loc.row === 0 && loc.col > 0) {
        return getCustomCornerRectSvg(x, y, size, size, r, r, r, 0, fillColor);
      } else {
        return getCustomCornerRectSvg(x, y, size, size, r, 0, r, r, fillColor);
      }
    }
    case 'cut-corner': {
      const cut = isOuter ? moduleSize * 1.6 : moduleSize * 1.0;
      return getCutCornerPolygonSvg(x, y, size, cut, fillColor);
    }
    case 'hexagon': {
      return getHexagonSvg(x, y, size, fillColor);
    }
    case 'star': {
      return getStarFrameSvg(x, y, size, fillColor);
    }
    case 'flower': {
      return getFlowerFrameSvg(x, y, size, fillColor);
    }
    default:
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" fill="${fillColor}" />\n`;
  }
}

/**
 * Draws an Eye (Finder pattern) in specified style and pupil shape
 */
function drawEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  eyeSize: number, // 7 modules wide
  moduleSize: number,
  style: EyeStyle,
  pupilStyle: PupilStyle | undefined,
  outerColor: string | CanvasGradient,
  innerColor: string | CanvasGradient,
  bgColor: string,
  transparentBg: boolean,
  loc: EyeLocation
) {
  ctx.save();

  // 1. Draw outer 7x7 frame
  ctx.fillStyle = outerColor;
  drawEyeFrameCanvas(ctx, x, y, eyeSize, style, loc, moduleSize, true);

  // 2. Cut out 5x5 middle white frame
  const midX = x + moduleSize;
  const midY = y + moduleSize;
  const midSize = eyeSize - moduleSize * 2;

  ctx.fillStyle = transparentBg ? '#FFFFFF' : bgColor;
  drawEyeFrameCanvas(ctx, midX, midY, midSize, style, loc, moduleSize, false);

  // 3. Draw inner 3x3 pupil core with custom pupil shape
  const innerX = x + moduleSize * 2;
  const innerY = y + moduleSize * 2;
  const innerSize = moduleSize * 3;

  ctx.fillStyle = innerColor;
  const resolvedPupil = resolvePupilShape(pupilStyle, style);
  drawPupilCanvas(ctx, innerX, innerY, innerSize, resolvedPupil);

  ctx.restore();
}

/**
 * Loads an image async from a URL
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Main function to render QR code onto a canvas
 */
export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  payload: string,
  options: QrStyleOptions
): Promise<void> {
  if (!payload) return;

  const qr = QRCode.create(payload, {
    errorCorrectionLevel: options.errorCorrection,
  });

  const matrixSize = qr.modules.size;
  const marginModules = Math.max(0, options.margin);
  const totalModules = matrixSize + marginModules * 2;

  const targetSize = options.size;
  canvas.width = targetSize;
  canvas.height = targetSize;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, targetSize, targetSize);

  const isSmooth = options.cornerStyle === 'smooth';
  const qrRadius = isSmooth ? targetSize * 0.08 : 0;

  if (qrRadius > 0) {
    ctx.save();
    roundRect(ctx, 0, 0, targetSize, targetSize, qrRadius);
    ctx.clip();
  }

  // 1. Render Background
  if (!options.transparentBg) {
    ctx.fillStyle = options.bgColor;
    if (qrRadius > 0) {
      roundRect(ctx, 0, 0, targetSize, targetSize, qrRadius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, targetSize, targetSize);
    }
  }

  const modulePixelSize = targetSize / totalModules;
  const offset = marginModules * modulePixelSize;

  const fgFill = createFillStyle(ctx, options, targetSize, targetSize);
  ctx.fillStyle = fgFill;

  // 2. Identify center logo exclusion area if present
  let hasLogo = options.logo.type !== 'none';
  let logoPixelSize = 0;
  let logoCenterX = targetSize / 2;
  let logoCenterY = targetSize / 2;
  let logoExclusionLeft = 0;
  let logoExclusionRight = 0;
  let logoExclusionTop = 0;
  let logoExclusionBottom = 0;

  if (hasLogo) {
    logoPixelSize = targetSize * options.logo.sizeRatio;
    const pad = options.logo.padding;
    const badgeSize = logoPixelSize + pad * 2;
    logoExclusionLeft = logoCenterX - badgeSize / 2;
    logoExclusionRight = logoCenterX + badgeSize / 2;
    logoExclusionTop = logoCenterY - badgeSize / 2;
    logoExclusionBottom = logoCenterY + badgeSize / 2;
  }

  const isModuleActive = (row: number, col: number): boolean => {
    if (row < 0 || row >= matrixSize || col < 0 || col >= matrixSize) return false;
    if (isPartOfFinder(row, col, matrixSize)) return false;
    if (!qr.modules.get(row, col)) return false;
    if (hasLogo) {
      const mx = offset + col * modulePixelSize;
      const my = offset + row * modulePixelSize;
      if (
        mx + modulePixelSize > logoExclusionLeft &&
        mx < logoExclusionRight &&
        my + modulePixelSize > logoExclusionTop &&
        my < logoExclusionBottom
      ) {
        return false;
      }
    }
    return true;
  };

  // 3. Draw standard modules (skipping eyes and logo area)
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (isPartOfFinder(r, c, matrixSize)) continue;

      if (qr.modules.get(r, c)) {
        const x = offset + c * modulePixelSize;
        const y = offset + r * modulePixelSize;

        // Skip module if inside logo bounds to avoid noisy overlap
        if (
          hasLogo &&
          x + modulePixelSize > logoExclusionLeft &&
          x < logoExclusionRight &&
          y + modulePixelSize > logoExclusionTop &&
          y < logoExclusionBottom
        ) {
          continue;
        }

        if (options.patternStyle === 'liquid') {
          const top = isModuleActive(r - 1, c);
          const right = isModuleActive(r, c + 1);
          const bottom = isModuleActive(r + 1, c);
          const left = isModuleActive(r, c - 1);
          drawLiquidModule(ctx, x, y, modulePixelSize, top, right, bottom, left);
        } else {
          drawModule(ctx, x, y, modulePixelSize, options.patternStyle);
        }
      }
    }
  }

  // 4. Draw Eyes / Finders
  const eyeLocations = getEyeLocations(matrixSize);
  const outerEyeFill = options.customEyeColors ? options.eyeOuterColor : fgFill;
  const innerEyeFill = options.customEyeColors ? options.eyeInnerColor : fgFill;

  for (const loc of eyeLocations) {
    const x = offset + loc.col * modulePixelSize;
    const y = offset + loc.row * modulePixelSize;
    const eyeDimension = 7 * modulePixelSize;

    drawEye(
      ctx,
      x,
      y,
      eyeDimension,
      modulePixelSize,
      options.eyeStyle,
      options.pupilStyle,
      outerEyeFill,
      innerEyeFill,
      options.bgColor,
      options.transparentBg,
      loc
    );
  }

  // 5. Draw Center Logo
  if (hasLogo) {
    const pad = options.logo.padding;
    const badgeSize = logoPixelSize + pad * 2;
    const badgeX = logoCenterX - badgeSize / 2;
    const badgeY = logoCenterY - badgeSize / 2;

    ctx.save();
    // Background badge for logo
    let logoBgColor = '#FFFFFF';
    if (options.logo.background === 'match') {
      logoBgColor = options.bgColor;
    } else if (options.logo.background === 'custom') {
      logoBgColor = options.logo.customBgColor;
    }

    if (options.logo.background !== 'transparent') {
      ctx.fillStyle = logoBgColor;
      const radius = (options.logo.borderRadius / 100) * (badgeSize / 2);
      roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, radius);
      ctx.fill();

      // Subtle border on logo badge for contrast
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = Math.max(1, targetSize * 0.003);
      ctx.stroke();
    }

    // Clip to badge if radius is applied
    if (options.logo.borderRadius > 0) {
      const radius = (options.logo.borderRadius / 100) * (badgeSize / 2);
      roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, radius);
      ctx.clip();
    }

    // Draw the image
    const logoSrc = getLogoSourceUrl(options.logo);

    if (logoSrc) {
      try {
        const img = await loadImage(logoSrc);
        const imgX = logoCenterX - logoPixelSize / 2;
        const imgY = logoCenterY - logoPixelSize / 2;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, imgX, imgY, logoPixelSize, logoPixelSize);
      } catch (err) {
        console.warn('Failed to draw center logo onto QR canvas:', err);
      }
    }
    ctx.restore();
  }

  if (qrRadius > 0) {
    ctx.restore();
  }
}

/**
 * Generates an SVG string representation of the QR code
 */
export function generateQrSvg(payload: string, options: QrStyleOptions): string {
  if (!payload) return '';

  const qr = QRCode.create(payload, {
    errorCorrectionLevel: options.errorCorrection,
  });

  const matrixSize = qr.modules.size;
  const marginModules = Math.max(0, options.margin);
  const totalModules = matrixSize + marginModules * 2;
  const targetSize = options.size;
  const modulePixelSize = targetSize / totalModules;
  const offset = marginModules * modulePixelSize;

  let defs = '';
  let fgRef = options.fgColor;

  if (options.colorMode === 'linear-gradient') {
    const angleRad = (options.gradientAngle * Math.PI) / 180;
    const x1 = Math.round(50 - Math.cos(angleRad) * 50);
    const y1 = Math.round(50 - Math.sin(angleRad) * 50);
    const x2 = Math.round(50 + Math.cos(angleRad) * 50);
    const y2 = Math.round(50 + Math.sin(angleRad) * 50);
    defs += `
      <linearGradient id="qr-grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="0%" stop-color="${options.fgColor}" />
        <stop offset="100%" stop-color="${options.fgColorEnd}" />
      </linearGradient>
    `;
    fgRef = 'url(#qr-grad)';
  } else if (options.colorMode === 'radial-gradient') {
    defs += `
      <radialGradient id="qr-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${options.fgColor}" />
        <stop offset="100%" stop-color="${options.fgColorEnd}" />
      </radialGradient>
    `;
    fgRef = 'url(#qr-grad)';
  }

  const outerEyeColor = options.customEyeColors ? options.eyeOuterColor : fgRef;
  const innerEyeColor = options.customEyeColors ? options.eyeInnerColor : fgRef;

  let elements = '';

  const isSmooth = options.cornerStyle === 'smooth';
  const qrRadius = isSmooth ? targetSize * 0.08 : 0;

  if (qrRadius > 0) {
    defs += `
      <clipPath id="qr-smooth-clip">
        <rect width="${targetSize}" height="${targetSize}" rx="${qrRadius.toFixed(2)}" ry="${qrRadius.toFixed(2)}" />
      </clipPath>
    `;
  }

  // Background
  if (!options.transparentBg) {
    const rxAttr = qrRadius > 0 ? ` rx="${qrRadius.toFixed(2)}"` : '';
    elements += `<rect width="${targetSize}" height="${targetSize}"${rxAttr} fill="${options.bgColor}" />\n`;
  }

  // Modules
  const hasLogo = options.logo.type !== 'none';
  const logoPixelSize = hasLogo ? targetSize * options.logo.sizeRatio : 0;
  const badgeSize = logoPixelSize + options.logo.padding * 2;
  const logoLeft = (targetSize - badgeSize) / 2;
  const logoRight = (targetSize + badgeSize) / 2;
  const logoTop = (targetSize - badgeSize) / 2;
  const logoBottom = (targetSize + badgeSize) / 2;

  const isModuleActive = (row: number, col: number): boolean => {
    if (row < 0 || row >= matrixSize || col < 0 || col >= matrixSize) return false;
    if (isPartOfFinder(row, col, matrixSize)) return false;
    if (!qr.modules.get(row, col)) return false;
    if (hasLogo) {
      const mx = offset + col * modulePixelSize;
      const my = offset + row * modulePixelSize;
      if (
        mx + modulePixelSize > logoLeft &&
        mx < logoRight &&
        my + modulePixelSize > logoTop &&
        my < logoBottom
      ) {
        return false;
      }
    }
    return true;
  };

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (isPartOfFinder(r, c, matrixSize)) continue;

      if (qr.modules.get(r, c)) {
        const x = offset + c * modulePixelSize;
        const y = offset + r * modulePixelSize;

        if (
          hasLogo &&
          x + modulePixelSize > logoLeft &&
          x < logoRight &&
          y + modulePixelSize > logoTop &&
          y < logoBottom
        ) {
          continue;
        }

        if (options.patternStyle === 'liquid') {
          const top = isModuleActive(r - 1, c);
          const right = isModuleActive(r, c + 1);
          const bottom = isModuleActive(r + 1, c);
          const left = isModuleActive(r, c - 1);
          elements += getLiquidModuleSvg(x, y, modulePixelSize, top, right, bottom, left, fgRef);
        } else if (options.patternStyle === 'circle' || options.patternStyle === 'dots') {
          const cx = x + modulePixelSize / 2;
          const cy = y + modulePixelSize / 2;
          const r0 = modulePixelSize * 0.44;
          elements += `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r0.toFixed(2)}" fill="${fgRef}" />\n`;
        } else if (options.patternStyle === 'rounded') {
          const rx = modulePixelSize * 0.30;
          elements += `<rect x="${(x + 0.5).toFixed(2)}" y="${(y + 0.5).toFixed(2)}" width="${(modulePixelSize - 1).toFixed(2)}" height="${(modulePixelSize - 1).toFixed(2)}" rx="${rx.toFixed(2)}" fill="${fgRef}" />\n`;
        } else if (options.patternStyle === 'squircle') {
          const rx = modulePixelSize * 0.45;
          elements += `<rect x="${(x + 0.5).toFixed(2)}" y="${(y + 0.5).toFixed(2)}" width="${(modulePixelSize - 1).toFixed(2)}" height="${(modulePixelSize - 1).toFixed(2)}" rx="${rx.toFixed(2)}" fill="${fgRef}" />\n`;
        } else if (options.patternStyle === 'pill') {
          const pw = modulePixelSize * 0.88;
          const ph = modulePixelSize * 0.72;
          const px = x + (modulePixelSize - pw) / 2;
          const py = y + (modulePixelSize - ph) / 2;
          elements += `<rect x="${px.toFixed(2)}" y="${py.toFixed(2)}" width="${pw.toFixed(2)}" height="${ph.toFixed(2)}" rx="${(ph / 2).toFixed(2)}" fill="${fgRef}" />\n`;
        } else if (options.patternStyle === 'diamond') {
          const cx = x + modulePixelSize / 2;
          const cy = y + modulePixelSize / 2;
          const p = `${cx.toFixed(2)},${(y + modulePixelSize * 0.04).toFixed(2)} ${(x + modulePixelSize * 0.96).toFixed(2)},${cy.toFixed(2)} ${cx.toFixed(2)},${(y + modulePixelSize * 0.96).toFixed(2)} ${(x + modulePixelSize * 0.04).toFixed(2)},${cy.toFixed(2)}`;
          elements += `<polygon points="${p}" fill="${fgRef}" />\n`;
        } else if (options.patternStyle === 'hexagon') {
          const cx = x + modulePixelSize / 2;
          const cy = y + modulePixelSize / 2;
          const r0 = modulePixelSize * 0.48;
          const pts = Array.from({ length: 6 }, (_, i) => {
            const a = (Math.PI / 3) * i - Math.PI / 2;
            return `${(cx + r0 * Math.cos(a)).toFixed(2)},${(cy + r0 * Math.sin(a)).toFixed(2)}`;
          }).join(' ');
          elements += `<polygon points="${pts}" fill="${fgRef}" />\n`;
        } else if (options.patternStyle === 'octagon') {
          const c = modulePixelSize * 0.28;
          const pts = `${(x + c).toFixed(2)},${y.toFixed(2)} ${(x + modulePixelSize - c).toFixed(2)},${y.toFixed(2)} ${(x + modulePixelSize).toFixed(2)},${(y + c).toFixed(2)} ${(x + modulePixelSize).toFixed(2)},${(y + modulePixelSize - c).toFixed(2)} ${(x + modulePixelSize - c).toFixed(2)},${(y + modulePixelSize).toFixed(2)} ${(x + c).toFixed(2)},${(y + modulePixelSize).toFixed(2)} ${x.toFixed(2)},${(y + modulePixelSize - c).toFixed(2)} ${x.toFixed(2)},${(y + c).toFixed(2)}`;
          elements += `<polygon points="${pts}" fill="${fgRef}" />\n`;
        } else if (options.patternStyle === 'leaf') {
          const r0 = modulePixelSize * 0.48;
          elements += `<path d="M ${(x + r0).toFixed(2)} ${y.toFixed(2)} L ${(x + modulePixelSize).toFixed(2)} ${y.toFixed(2)} L ${(x + modulePixelSize).toFixed(2)} ${(y + modulePixelSize - r0).toFixed(2)} A ${r0.toFixed(2)} ${r0.toFixed(2)} 0 0 1 ${(x + modulePixelSize - r0).toFixed(2)} ${(y + modulePixelSize).toFixed(2)} L ${x.toFixed(2)} ${(y + modulePixelSize).toFixed(2)} L ${x.toFixed(2)} ${(y + r0).toFixed(2)} A ${r0.toFixed(2)} ${r0.toFixed(2)} 0 0 1 ${(x + r0).toFixed(2)} ${y.toFixed(2)} Z" fill="${fgRef}" />\n`;
        } else if (options.patternStyle === 'flower') {
          const cx = x + modulePixelSize / 2;
          const cy = y + modulePixelSize / 2;
          const pr = modulePixelSize * 0.22;
          const d = modulePixelSize * 0.26;
          elements += `<path d="M ${(cx + pr).toFixed(2)} ${(cy - d).toFixed(2)} A ${pr.toFixed(2)} ${pr.toFixed(2)} 0 1 0 ${(cx - pr).toFixed(2)} ${(cy - d).toFixed(2)} A ${pr.toFixed(2)} ${pr.toFixed(2)} 0 1 0 ${(cx + pr).toFixed(2)} ${(cy - d).toFixed(2)} Z M ${(cx + d + pr).toFixed(2)} ${cy.toFixed(2)} A ${pr.toFixed(2)} ${pr.toFixed(2)} 0 1 0 ${(cx + d - pr).toFixed(2)} ${cy.toFixed(2)} A ${pr.toFixed(2)} ${pr.toFixed(2)} 0 1 0 ${(cx + d + pr).toFixed(2)} ${cy.toFixed(2)} Z M ${(cx + pr).toFixed(2)} ${(cy + d).toFixed(2)} A ${pr.toFixed(2)} ${pr.toFixed(2)} 0 1 0 ${(cx - pr).toFixed(2)} ${(cy + d).toFixed(2)} A ${pr.toFixed(2)} ${pr.toFixed(2)} 0 1 0 ${(cx + pr).toFixed(2)} ${(cy + d).toFixed(2)} Z M ${(cx - d + pr).toFixed(2)} ${cy.toFixed(2)} A ${pr.toFixed(2)} ${pr.toFixed(2)} 0 1 0 ${(cx - d - pr).toFixed(2)} ${cy.toFixed(2)} A ${pr.toFixed(2)} ${pr.toFixed(2)} 0 1 0 ${(cx - d + pr).toFixed(2)} ${cy.toFixed(2)} Z M ${(cx + pr * 1.1).toFixed(2)} ${cy.toFixed(2)} A ${(pr * 1.1).toFixed(2)} ${(pr * 1.1).toFixed(2)} 0 1 0 ${(cx - pr * 1.1).toFixed(2)} ${cy.toFixed(2)} A ${(pr * 1.1).toFixed(2)} ${(pr * 1.1).toFixed(2)} 0 1 0 ${(cx + pr * 1.1).toFixed(2)} ${cy.toFixed(2)} Z" fill="${fgRef}" />\n`;
        } else {
          elements += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${modulePixelSize.toFixed(2)}" height="${modulePixelSize.toFixed(2)}" fill="${fgRef}" />\n`;
        }
      }
    }
  }

  // Eye Finders
  const eyeLocations = getEyeLocations(matrixSize);
  const bgFill = options.transparentBg ? '#FFFFFF' : options.bgColor;

  for (const loc of eyeLocations) {
    const x = offset + loc.col * modulePixelSize;
    const y = offset + loc.row * modulePixelSize;
    const eyeDim = 7 * modulePixelSize;
    const midX = x + modulePixelSize;
    const midY = y + modulePixelSize;
    const midDim = 5 * modulePixelSize;
    const inX = x + 2 * modulePixelSize;
    const inY = y + 2 * modulePixelSize;
    const inDim = 3 * modulePixelSize;

    elements += getEyeFrameSvg(
      x,
      y,
      eyeDim,
      options.eyeStyle,
      loc,
      modulePixelSize,
      outerEyeColor,
      true
    );
    elements += getEyeFrameSvg(
      midX,
      midY,
      midDim,
      options.eyeStyle,
      loc,
      modulePixelSize,
      bgFill,
      false
    );
    const resolvedPupil = resolvePupilShape(options.pupilStyle, options.eyeStyle);
    elements += getPupilSvg(inX, inY, inDim, resolvedPupil, innerEyeColor);
  }

  // Logo in SVG
  if (hasLogo) {
    const badgeX = (targetSize - badgeSize) / 2;
    const badgeY = (targetSize - badgeSize) / 2;
    const badgeR = (options.logo.borderRadius / 100) * (badgeSize / 2);
    let logoBg = '#FFFFFF';
    if (options.logo.background === 'match') logoBg = options.bgColor;
    else if (options.logo.background === 'custom') logoBg = options.logo.customBgColor;

    if (options.logo.background !== 'transparent') {
      elements += `<rect x="${badgeX.toFixed(2)}" y="${badgeY.toFixed(2)}" width="${badgeSize.toFixed(2)}" height="${badgeSize.toFixed(2)}" rx="${badgeR.toFixed(2)}" fill="${logoBg}" stroke="rgba(0,0,0,0.08)" stroke-width="1" />\n`;
    }

    const imgX = (targetSize - logoPixelSize) / 2;
    const imgY = (targetSize - logoPixelSize) / 2;
    const logoSrc = getLogoSourceUrl(options.logo);
    if (logoSrc) {
      elements += `<image href="${logoSrc}" x="${imgX.toFixed(2)}" y="${imgY.toFixed(2)}" width="${logoPixelSize.toFixed(2)}" height="${logoPixelSize.toFixed(2)}" />\n`;
    }
  }

  const wrappedElements =
    qrRadius > 0
      ? `<g clip-path="url(#qr-smooth-clip)">\n${elements}</g>`
      : elements;

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${targetSize} ${targetSize}" width="${targetSize}" height="${targetSize}">
  ${defs ? `<defs>${defs}</defs>` : ''}
  ${wrappedElements}
</svg>`;
}

import { ReadabilityReport, QrStyleOptions } from '../types';

interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  let clean = hex.replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance(rgb: RGB): number {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hexToRgb(hex1));
  const lum2 = getLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function analyzeReadability(options: QrStyleOptions): ReadabilityReport {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  const bgHex = options.transparentBg ? '#FFFFFF' : options.bgColor;
  const fgHex = options.fgColor;
  const fgEndHex = options.colorMode !== 'solid' ? options.fgColorEnd : fgHex;

  const ratioStart = getContrastRatio(fgHex, bgHex);
  const ratioEnd = getContrastRatio(fgEndHex, bgHex);
  const minRatio = Math.min(ratioStart, ratioEnd);

  const bgLum = getLuminance(hexToRgb(bgHex));
  const fgLum = getLuminance(hexToRgb(fgHex));
  const isDarkBg = bgLum < fgLum;

  // Evaluate contrast
  if (minRatio < 2.5) {
    warnings.push('Extremely low contrast between QR code and background.');
    recommendations.push('Increase the color contrast to at least 4.5:1 for reliable scanning across all camera sensors.');
  } else if (minRatio < 4.0) {
    warnings.push('Contrast is lower than recommended.');
    recommendations.push('Darker foreground modules or lighter background will improve quick focus on older mobile cameras.');
  }

  // Evaluate Inverted Mode (Dark background with light modules)
  if (isDarkBg) {
    warnings.push('Inverted QR code (light modules on dark background).');
    recommendations.push('Most modern smartphone camera apps scan inverted codes easily, but some legacy industrial barcode scanners expect dark-on-light.');
  }

  // Evaluate Quiet Zone / Margin
  if (options.margin < 1) {
    warnings.push('Zero quiet zone margin.');
    recommendations.push('Add at least 1-2 modules of quiet zone margin so scanner algorithms can cleanly isolate the code.');
  }

  // Evaluate Logo insertion
  if (options.logo.type !== 'none') {
    if (options.errorCorrection === 'L' || options.errorCorrection === 'M') {
      warnings.push('Center logo enabled with standard error correction.');
      recommendations.push('Switch error correction to "High (H)" or "Quartile (Q)" so data redundancy protects the obscured center.');
    }
    if (options.logo.sizeRatio > 0.28) {
      warnings.push('Large center logo covers more than 28% of the QR matrix.');
      recommendations.push('Keep logo size at or below 25% to prevent scanning failures.');
    }
  }

  let score: 'excellent' | 'good' | 'warning' | 'danger' = 'excellent';
  if (minRatio < 2.5 || (options.logo.type !== 'none' && options.logo.sizeRatio > 0.32)) {
    score = 'danger';
  } else if (warnings.length > 1 || minRatio < 4.0) {
    score = 'warning';
  } else if (warnings.length > 0) {
    score = 'good';
  }

  return {
    score,
    contrastRatio: Number(minRatio.toFixed(1)),
    isDarkBg,
    warnings,
    recommendations,
  };
}

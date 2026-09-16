import { QrStyleOptions, ReadabilityReport, ReadabilityLevel, ErrorCorrectionLevel } from '../types';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Convert Hex to RGB
 */
export function hexToRgb(hex: string): RGB {
  let clean = hex.replace(/^#/, '').trim();
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

/**
 * Convert RGB to Hex
 */
export function rgbToHex(rgb: RGB): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(rgb.r).toString(16).padStart(2, '0');
  const g = clamp(rgb.g).toString(16).padStart(2, '0');
  const b = clamp(rgb.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/**
 * Standard WCAG Relative Luminance
 */
export function getLuminance(rgb: RGB): number {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Perceptual Contrast Ratio between two hex colors
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hexToRgb(hex1));
  const lum2 = getLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Interpolate linear gradient color at normalized coordinates (u, v) [0..1]
 */
export function sampleGradientColor(
  startHex: string,
  endHex: string,
  angleDeg: number,
  u: number,
  v: number
): string {
  // Convert angle in degrees to radians (0 deg = top to bottom, 90 deg = left to right, 135 deg = top-left to bottom-right)
  const rad = (angleDeg * Math.PI) / 180;
  // Center coordinates around (0.5, 0.5)
  const cx = u - 0.5;
  const cy = v - 0.5;
  // Projection onto gradient vector
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const projection = cx * cos + cy * sin; // range approx -0.7 to 0.7
  const t = Math.max(0, Math.min(1, projection + 0.5));

  const rgb1 = hexToRgb(startHex);
  const rgb2 = hexToRgb(endHex);

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);

  return rgbToHex({ r, g, b });
}

/**
 * Estimate QR Matrix Size from payload length & Error Correction
 */
export function estimateQrMatrixSize(payloadLength: number, ec: ErrorCorrectionLevel): number {
  // Approximate QR version based on alphanumeric / byte payload length
  const ecCapacities: Record<ErrorCorrectionLevel, number[]> = {
    L: [17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425],
    M: [14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331],
    Q: [11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241],
    H: [7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177],
  };

  const capacities = ecCapacities[ec] || ecCapacities['M'];
  let version = 1;
  for (let i = 0; i < capacities.length; i++) {
    if (payloadLength <= capacities[i]) {
      version = i + 1;
      break;
    }
    if (i === capacities.length - 1) {
      version = Math.min(40, 13 + Math.ceil((payloadLength - capacities[i]) / 40));
    }
  }

  // Version 1 is 21x21; each version adds 4 modules per side
  return 21 + (version - 1) * 4;
}

/**
 * Comprehensive Intelligent Readability Analyzer
 */
export function analyzeReadability(
  options: QrStyleOptions,
  payload: string = 'https://ehsaan.odoo.com'
): ReadabilityReport {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  const bgHex = options.transparentBg ? '#FFFFFF' : options.bgColor;
  const fgHex = options.fgColor;
  const fgEndHex = options.colorMode !== 'solid' ? options.fgColorEnd : fgHex;

  const bgRgb = hexToRgb(bgHex);
  const fgRgb = hexToRgb(fgHex);
  const bgLum = getLuminance(bgRgb);
  const fgLum = getLuminance(fgRgb);
  const isDarkBg = bgLum < fgLum;

  // 1. FACTOR A: Global Foreground / Background Contrast
  const ratioStart = getContrastRatio(fgHex, bgHex);
  const ratioEnd = getContrastRatio(fgEndHex, bgHex);
  const globalMinRatio = Math.min(ratioStart, ratioEnd);

  let contrastScore = 100;
  if (globalMinRatio >= 7.0) {
    contrastScore = 100;
  } else if (globalMinRatio >= 4.5) {
    contrastScore = Math.round(85 + ((globalMinRatio - 4.5) / 2.5) * 15);
  } else if (globalMinRatio >= 3.2) {
    contrastScore = Math.round(65 + ((globalMinRatio - 3.2) / 1.3) * 20);
  } else if (globalMinRatio >= 2.2) {
    contrastScore = Math.round(35 + ((globalMinRatio - 2.2) / 1.0) * 30);
  } else {
    contrastScore = Math.max(5, Math.round((globalMinRatio / 2.2) * 35));
  }

  if (globalMinRatio < 2.5) {
    warnings.push(`Extremely low foreground/background contrast (${globalMinRatio.toFixed(1)}:1).`);
    recommendations.push('Increase the luminance difference between foreground modules and background to at least 4.5:1.');
  } else if (globalMinRatio < 3.8) {
    warnings.push(`Moderate color contrast (${globalMinRatio.toFixed(1)}:1).`);
    recommendations.push('A slightly darker foreground or lighter background will accelerate camera focus.');
  }

  // 2. FACTOR B: Multi-Region Local Contrast Analysis (7 key regions)
  const regions: Array<{ name: string; u: number; v: number }> = [
    { name: 'Top-Left (Finder 1)', u: 0.15, v: 0.15 },
    { name: 'Top-Center', u: 0.5, v: 0.15 },
    { name: 'Top-Right (Finder 2)', u: 0.85, v: 0.15 },
    { name: 'Center', u: 0.5, v: 0.5 },
    { name: 'Bottom-Left (Finder 3)', u: 0.15, v: 0.85 },
    { name: 'Bottom-Center', u: 0.5, v: 0.85 },
    { name: 'Bottom-Right', u: 0.85, v: 0.85 },
  ];

  let minRegionalContrast = globalMinRatio;
  let worstRegionName = 'Global';

  if (options.colorMode !== 'solid') {
    regions.forEach((reg) => {
      const sampledFg = sampleGradientColor(
        options.fgColor,
        options.fgColorEnd,
        options.gradientAngle,
        reg.u,
        reg.v
      );
      const regContrast = getContrastRatio(sampledFg, bgHex);
      if (regContrast < minRegionalContrast) {
        minRegionalContrast = regContrast;
        worstRegionName = reg.name;
      }
    });

    if (minRegionalContrast < 3.0 && minRegionalContrast < globalMinRatio - 0.5) {
      warnings.push(`${worstRegionName} gradient zone has reduced contrast (${minRegionalContrast.toFixed(1)}:1).`);
      recommendations.push('Adjust gradient start/end tones or angle so all four quadrants maintain clear separation.');
    }
  }

  let localContrastScore = 100;
  if (minRegionalContrast >= 7.0) {
    localContrastScore = 100;
  } else if (minRegionalContrast >= 4.5) {
    localContrastScore = Math.round(85 + ((minRegionalContrast - 4.5) / 2.5) * 15);
  } else if (minRegionalContrast >= 3.0) {
    localContrastScore = Math.round(60 + ((minRegionalContrast - 3.0) / 1.5) * 25);
  } else {
    localContrastScore = Math.max(10, Math.round((minRegionalContrast / 3.0) * 60));
  }

  // 3. FACTOR C: Module Clarity & Separation
  let moduleClarityScore = 96;
  switch (options.patternStyle) {
    case 'square':
      moduleClarityScore = 100;
      break;
    case 'rounded':
      moduleClarityScore = 96;
      break;
    case 'octagon':
      moduleClarityScore = 95;
      break;
    case 'squircle':
      moduleClarityScore = 94;
      break;
    case 'circle':
    case 'dots':
      moduleClarityScore = 92;
      break;
    case 'pill':
      moduleClarityScore = 91;
      break;
    case 'hexagon':
      moduleClarityScore = 90;
      break;
    case 'diamond':
      moduleClarityScore = 89;
      break;
    case 'leaf':
      moduleClarityScore = 89;
      break;
    case 'flower':
      moduleClarityScore = 88;
      break;
    case 'liquid':
      moduleClarityScore = 88;
      break;
    default:
      moduleClarityScore = 92;
  }

  // 4. FACTOR D: Finder Pattern Integrity
  let finderIntegrityScore = 98;
  const standardEyeFrames = ['square', 'rounded', 'circle', 'leaf', 'outer-smooth'];
  if (!standardEyeFrames.includes(options.eyeStyle)) {
    finderIntegrityScore -= 6;
  }

  if (options.customEyeColors) {
    const eyeOuterRatio = getContrastRatio(options.eyeOuterColor, bgHex);
    const eyeInnerRatio = getContrastRatio(options.eyeInnerColor, bgHex);
    const minEyeRatio = Math.min(eyeOuterRatio, eyeInnerRatio);

    if (minEyeRatio < 2.5) {
      finderIntegrityScore -= 30;
      warnings.push(`Corner finder eye colors have low contrast against background (${minEyeRatio.toFixed(1)}:1).`);
      recommendations.push('Ensure the outer eye frames and pupils have strong contrast against the background.');
    } else if (minEyeRatio < 3.8) {
      finderIntegrityScore -= 12;
      warnings.push(`Corner finder eye contrast is modest (${minEyeRatio.toFixed(1)}:1).`);
    }
  }
  finderIntegrityScore = Math.max(20, Math.min(100, finderIntegrityScore));

  // 5. FACTOR E: Quiet Zone
  let quietZoneScore = 100;
  if (options.margin >= 4) {
    quietZoneScore = 100;
  } else if (options.margin === 3) {
    quietZoneScore = 95;
  } else if (options.margin === 2) {
    quietZoneScore = 88;
  } else if (options.margin === 1) {
    quietZoneScore = 65;
    warnings.push('Compact 1-module quiet zone.');
    recommendations.push('If printing on textured or colored packaging, a 2+ module margin prevents boundary clipping.');
  } else {
    quietZoneScore = 35;
    warnings.push('Zero quiet zone margin.');
    recommendations.push('Add at least 1-2 modules of quiet zone margin so scanner edge-detection cleanly isolates the matrix.');
  }

  // 6. FACTOR F & G: Logo Coverage & Error Correction Synergy
  let logoCoveragePercent = 0;
  let logoImpactScore = 100;

  if (options.logo.type !== 'none') {
    // Area proportion covered by logo: sizeRatio^2, accounting for padding buffer
    const paddedRatio = options.logo.sizeRatio * (1 + (options.logo.padding || 0) / 80);
    logoCoveragePercent = Number((Math.min(0.45, Math.pow(paddedRatio, 2)) * 100).toFixed(1));

    const ecMaxSafeCoverage: Record<ErrorCorrectionLevel, number> = {
      L: 5.0,  // 7% capacity
      M: 10.0, // 15% capacity
      Q: 18.0, // 25% capacity
      H: 26.0, // 30% capacity
    };

    const maxSafe = ecMaxSafeCoverage[options.errorCorrection];
    if (logoCoveragePercent > maxSafe) {
      const excess = logoCoveragePercent - maxSafe;
      logoImpactScore = Math.max(20, Math.round(90 - excess * 5));
      warnings.push(
        `Logo covers approx ${logoCoveragePercent}% of data area, exceeding Error Correction ${options.errorCorrection} safe threshold (${maxSafe}%).`
      );
      recommendations.push(
        options.errorCorrection !== 'H'
          ? 'Upgrade Error Correction to "High (H)" or reduce logo size to protect data redundancy.'
          : 'Reduce logo size slightly to keep data obstruction within safe tolerance.'
      );
    } else {
      logoImpactScore = Math.round(98 - (logoCoveragePercent / maxSafe) * 10);
    }
  }

  // 7. FACTOR H & I: Matrix Density & Output Module Pixel Size
  const estimatedMatrixModules = estimateQrMatrixSize(payload.length || 20, options.errorCorrection);
  const totalModulesWithMargin = estimatedMatrixModules + options.margin * 2;
  const modulePixelSize = Number((options.size / totalModulesWithMargin).toFixed(1));

  if (modulePixelSize < 5 && options.size <= 256) {
    warnings.push(`High module density for ${options.size}px export (${modulePixelSize}px/module).`);
    recommendations.push('Export at 512px or 1024px to ensure crisp module boundaries on physical prints.');
  }

  // COMPOSITE OVERALL SCORE (0 - 100)
  // Weighted: Contrast (35%), Local Contrast (15%), Finder Integrity (20%), Module Clarity (10%), Quiet Zone (10%), Logo Impact (10%)
  const weightedScore =
    contrastScore * 0.35 +
    localContrastScore * 0.15 +
    finderIntegrityScore * 0.20 +
    moduleClarityScore * 0.10 +
    quietZoneScore * 0.10 +
    logoImpactScore * 0.10;

  const overallScore = Math.max(5, Math.min(100, Math.round(weightedScore)));

  // Tier classification:
  // 90-100: Excellent
  // 75-89: Good
  // 60-74: Moderate
  // 40-59: Risky
  // 0-39: Poor
  let level: ReadabilityLevel = 'excellent';
  if (overallScore >= 90) {
    level = 'excellent';
  } else if (overallScore >= 75) {
    level = 'good';
  } else if (overallScore >= 60) {
    level = 'moderate';
  } else if (overallScore >= 40) {
    level = 'risky';
  } else {
    level = 'poor';
  }

  let confidence: 'High' | 'Moderate' | 'Low' = 'High';
  if (minRegionalContrast < 3.0 || overallScore < 60) {
    confidence = 'Low';
  } else if (minRegionalContrast < 4.5 || overallScore < 75) {
    confidence = 'Moderate';
  }

  // Backward-compatible alias
  const legacyScore =
    level === 'excellent' ? 'excellent' : level === 'good' ? 'good' : level === 'moderate' ? 'warning' : 'danger';

  return {
    overallScore,
    level,
    confidence,
    contrastScore: Math.round(contrastScore),
    localContrastScore: Math.round(localContrastScore),
    moduleClarityScore: Math.round(moduleClarityScore),
    finderIntegrityScore: Math.round(finderIntegrityScore),
    quietZoneScore: Math.round(quietZoneScore),
    logoImpactScore: Math.round(logoImpactScore),
    logoCoveragePercent,
    contrastRatio: Number(globalMinRatio.toFixed(1)),
    minRegionalContrastRatio: Number(minRegionalContrast.toFixed(1)),
    modulePixelSize,
    estimatedMatrixModules,
    isDarkBg,
    warnings,
    recommendations,
    score: legacyScore,
  };
}

/**
 * Auto-Fix Generator: Computes the minimal surgical modifications to improve readability
 * while strictly preserving the user's artistic colors, themes, and choices.
 */
export function getImprovedReadabilityOptions(
  options: QrStyleOptions,
  report: ReadabilityReport
): { improvedOptions: Partial<QrStyleOptions>; fixesApplied: string[] } {
  const patch: Partial<QrStyleOptions> = {};
  const fixesApplied: string[] = [];

  const bgHex = options.transparentBg ? '#FFFFFF' : options.bgColor;
  const bgRgb = hexToRgb(bgHex);
  const bgHsl = rgbToHsl(bgRgb);
  const isLightBg = bgHsl.l >= 50;

  // 1. Surgical Contrast Boost if contrast is lower than 4.5:1
  if (report.contrastRatio < 4.5 || report.minRegionalContrastRatio < 4.0) {
    // Keep exact hue & saturation, only adjust lightness to create clear luminance distance
    const fgRgb = hexToRgb(options.fgColor);
    const fgHsl = rgbToHsl(fgRgb);

    let newFgL = fgHsl.l;
    if (isLightBg) {
      // Light BG -> Darken foreground to achieve safe contrast
      newFgL = Math.max(5, Math.min(22, fgHsl.l * 0.5));
    } else {
      // Dark BG -> Lighten foreground
      newFgL = Math.min(95, Math.max(78, 100 - (100 - fgHsl.l) * 0.4));
    }

    const newFg = rgbToHex(hslToRgb({ h: fgHsl.h, s: Math.max(25, fgHsl.s), l: newFgL }));
    patch.fgColor = newFg;
    fixesApplied.push(`Fine-tuned foreground luminance to achieve ${isLightBg ? 'deep' : 'luminous'} contrast`);

    if (options.colorMode !== 'solid') {
      const fgEndRgb = hexToRgb(options.fgColorEnd);
      const fgEndHsl = rgbToHsl(fgEndRgb);
      let newEndL = isLightBg
        ? Math.max(10, Math.min(28, fgEndHsl.l * 0.55))
        : Math.min(92, Math.max(74, 100 - (100 - fgEndHsl.l) * 0.45));
      patch.fgColorEnd = rgbToHex(hslToRgb({ h: fgEndHsl.h, s: Math.max(30, fgEndHsl.s), l: newEndL }));
    }
  }

  // 2. Quiet Zone Fix
  if (options.margin < 2) {
    patch.margin = 2;
    fixesApplied.push('Expanded quiet zone to 2 modules');
  }

  // 3. Logo & Error Correction Fix
  if (options.logo.type !== 'none') {
    if (options.errorCorrection === 'L' || options.errorCorrection === 'M') {
      patch.errorCorrection = 'H';
      fixesApplied.push('Upgraded Error Correction to High (H) for center logo redundancy');
    }
    if (options.logo.sizeRatio > 0.25) {
      patch.logo = {
        ...options.logo,
        sizeRatio: 0.22,
      };
      fixesApplied.push('Slightly scaled logo to 22% of matrix to clear data tracks');
    }
  }

  // 4. Eye Colors Contrast Fix (if enabled)
  if (options.customEyeColors) {
    const eyeOuterRatio = getContrastRatio(options.eyeOuterColor, bgHex);
    if (eyeOuterRatio < 3.5) {
      patch.eyeOuterColor = patch.fgColor || options.fgColor;
      patch.eyeInnerColor = patch.fgColor || options.fgColor;
      fixesApplied.push('Harmonized corner eye colors with foreground contrast');
    }
  }

  return { improvedOptions: patch, fixesApplied };
}

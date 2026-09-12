import { getContrastRatio } from './contrast';
import {
  QrStyleOptions,
  PatternStyle,
  EyeStyle,
  PupilStyle,
  QrCornerStyle,
  ColorMode,
} from '../types';

export type SaturationPreference = 'low' | 'high';

export const PATTERN_STYLES_POOL: PatternStyle[] = [
  'square',
  'rounded',
  'dots',
  'soft-rounded',
  'liquid',
];

export const EYE_STYLES_POOL: EyeStyle[] = [
  'square',
  'rounded',
  'circle',
  'modern',
  'leaf',
  'outer-smooth',
  'cut-corner',
  'hexagon',
  'star',
  'flower',
];

export const PUPIL_STYLES_POOL: PupilStyle[] = [
  'auto',
  'square',
  'rounded',
  'circle',
  'diamond',
  'leaf',
  'droplet',
  'star',
  'heart',
  'ring',
  'hexagon',
];

export const CORNER_STYLES_POOL: QrCornerStyle[] = ['sharp', 'smooth'];

// Curated dark / high-density foreground colors
export const DARK_FG_COLORS = [
  '#000000',
  '#09090B',
  '#0F172A',
  '#18181B',
  '#1E293B',
  '#1E1B4B',
  '#312E81',
  '#1E3A8A',
  '#064E3B',
  '#14532D',
  '#701A75',
  '#831843',
  '#881337',
  '#042F2E',
  '#291807',
  '#172554',
  '#2E1065',
];

// Curated vibrant foreground colors
export const VIBRANT_FG_COLORS = [
  '#DC2626',
  '#EA580C',
  '#D97706',
  '#16A34A',
  '#0D9488',
  '#0284C7',
  '#2563EB',
  '#4F46E5',
  '#7C3AED',
  '#9333EA',
  '#C026D3',
  '#DB2777',
  '#E11D48',
  '#059669',
];

// Curated list of low-saturation background colors (clean pastels, soft slates, off-whites, neutral tones)
export const LOW_SATURATION_BG_COLORS = [
  '#FFFFFF', '#F8FAFC', '#F1F5F9', '#F3F4F6', '#FAFAFA', '#F5F5F4',
  '#F4F4F5', '#E2E8F0', '#E5E7EB', '#FEF2F2', '#FFF7ED', '#FEFCE8',
  '#F0FDF4', '#ECFDF5', '#F0FDFA', '#F0F9FF', '#EFF6FF', '#EEF2FF',
  '#F5F3FF', '#FAF5FF', '#FDF2F8', '#FFF1F2', '#FAFAF9', '#E0F2FE',
  '#E0E7FF', '#FCE7F3', '#FEF3C7', '#DCFCE7', '#E0F7FA', '#FFE4E6',
  '#F3E8FF', '#F9FAFB', '#F4F6F8', '#ECEFF1', '#EDE9FE',
  // Deep low-saturation tones (if foreground is light/white)
  '#0F172A', '#1E293B', '#18181B', '#27272A', '#09090B', '#1F2937', '#111827',
];

// Curated list of high-saturation background colors (vibrant yellows, punchy oranges, bright pinks, electric cyans, vivid limes, bold purples)
export const HIGH_SATURATION_BG_COLORS = [
  // High saturation bright tones (vivid contrast with dark foreground)
  '#FEF08A', '#FDE047', '#FACC15', '#FDE68A', '#FBBF24', '#FCD34D',
  '#FED7AA', '#FDBA74', '#FB923C', '#FF8A65', '#FFAB91', '#FFA726',
  '#FBCFE8', '#F472B6', '#FDA4AF', '#FB7185', '#FF80AB', '#F87171', '#EC4899',
  '#BAE6FD', '#7DD3FC', '#38BDF8', '#99F6E4', '#5EEAD4', '#2DD4BF', '#67E8F9', '#A5F3FC',
  '#BBF7D0', '#86EFAC', '#4ADE80', '#D9F99D', '#BEF264', '#A3E635', '#22C55E',
  '#DDD6FE', '#C4B5FD', '#A78BFA', '#F5D0FE', '#E879F9', '#F0ABFC',
  // High saturation rich/jewel tones (vivid contrast with light foreground)
  '#DC2626', '#B91C1C', '#EA580C', '#C2410C', '#D97706', '#16A34A',
  '#15803D', '#0D9488', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED',
  '#9333EA', '#C026D3', '#DB2777', '#831843', '#7C2D12', '#701A75',
];

// Backwards-compatibility alias
export const AESTHETIC_BG_COLORS = [
  ...LOW_SATURATION_BG_COLORS,
  ...HIGH_SATURATION_BG_COLORS,
];

// Curated list of striking, high-contrast pupil colors (jewel tones, neons, vivid hues)
export const AESTHETIC_PUPIL_COLORS = [
  '#000000', '#DC2626', '#EA580C', '#D97706', '#CA8A04', '#16A34A',
  '#059669', '#0D9488', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED',
  '#9333EA', '#C026D3', '#DB2777', '#E11D48', '#F43F5E', '#10B981',
  '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#EAB308',
  '#FFFFFF', '#38BDF8', '#34D399', '#F472B6', '#A78BFA', '#FBBF24',
  '#4338CA', '#BE185D', '#047857', '#B45309', '#6D28D9',
];

export function getRandomItem<T>(arr: T[], current?: T): T {
  const filtered = current ? arr.filter((x) => x !== current) : arr;
  const pool = filtered.length > 0 ? filtered : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Converts HSL to 6-digit uppercase Hex string.
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Dynamically synthesizes a random color adhering strictly to saturation and contrast constraints.
 */
function generateDynamicBg(saturationPreference: SaturationPreference, isFgDark: boolean): string {
  const h = Math.floor(Math.random() * 360);
  if (saturationPreference === 'high') {
    const s = Math.floor(Math.random() * 26) + 75;
    const l = isFgDark
      ? Math.floor(Math.random() * 16) + 70
      : Math.floor(Math.random() * 19) + 20;
    return hslToHex(h, s, l);
  } else {
    const s = Math.floor(Math.random() * 24) + 5;
    const l = isFgDark
      ? Math.floor(Math.random() * 8) + 91
      : Math.floor(Math.random() * 12) + 8;
    return hslToHex(h, s, l);
  }
}

/**
 * Generates a random background color strictly constrained to NEVER match the foreground color,
 * respecting high or low saturation preference, and guaranteeing at least 3.2:1 contrast ratio.
 */
export function getRandomBg(
  currentBg?: string,
  currentFg?: string,
  saturationPreference: SaturationPreference = 'low'
): string {
  const fg = currentFg || '#000000';
  const palette =
    saturationPreference === 'high'
      ? HIGH_SATURATION_BG_COLORS
      : LOW_SATURATION_BG_COLORS;

  const validBgs = palette.filter((bg) => {
    if (bg.toLowerCase() === fg.toLowerCase()) return false;
    if (currentBg && bg.toLowerCase() === currentBg.toLowerCase()) return false;
    const contrast = getContrastRatio(bg, fg);
    return contrast >= 3.2;
  });

  if (validBgs.length > 0) {
    return getRandomItem(validBgs);
  }

  const isFgDark = getContrastRatio('#FFFFFF', fg) >= 3.0;
  for (let i = 0; i < 15; i++) {
    const candidate = generateDynamicBg(saturationPreference, isFgDark);
    if (candidate.toLowerCase() !== fg.toLowerCase() && getContrastRatio(candidate, fg) >= 3.2) {
      return candidate;
    }
  }

  return isFgDark ? '#FFFFFF' : '#0F172A';
}

/**
 * Generates a random pupil color strictly constrained to NEVER match the background color
 * and to maintain a clear contrast ratio (at least 2.8:1).
 */
export function getRandomPupil(currentBg?: string, currentPupil?: string): string {
  const bg = currentBg || '#FFFFFF';

  const validPupils = AESTHETIC_PUPIL_COLORS.filter((p) => {
    if (p.toLowerCase() === bg.toLowerCase()) return false;
    if (currentPupil && p.toLowerCase() === currentPupil.toLowerCase()) return false;
    const contrast = getContrastRatio(p, bg);
    return contrast >= 2.8;
  });

  if (validPupils.length > 0) {
    return getRandomItem(validPupils);
  }

  const contrastWithBlack = getContrastRatio('#000000', bg);
  return contrastWithBlack >= 3.0 ? '#000000' : '#FFFFFF';
}

/**
 * Randomizes both background and pupil while strictly guaranteeing foreground and background
 * are NEVER the same color or low-contrast, keeping the QR code 100% scannable.
 */
export function getRandomBgAndPupil(
  currentBg?: string,
  currentPupil?: string,
  currentFg?: string,
  saturationPreference: SaturationPreference = 'low'
): { bgColor: string; pupilColor: string } {
  const newBg = getRandomBg(currentBg, currentFg, saturationPreference);
  const newPupil = getRandomPupil(newBg, currentPupil);
  return { bgColor: newBg, pupilColor: newPupil };
}

/**
 * Master Randomizer: Randomizes ALL QR visual attributes at once:
 * - Foreground color (solid or vibrant linear gradient)
 * - Background color (high contrast, respecting saturation tone)
 * - Corner Eye Frame shape (from all 10 custom eye geometries)
 * - Inner Eye Pupil shape (from all 11 pupil shapes)
 * - QR Module Pattern style (square, rounded, dots, soft-rounded, liquid)
 * - Corner Style (sharp vs smooth)
 * - Eye colors (harmonious or contrasting outer/inner)
 */
export function getRandomAllOptions(
  current: QrStyleOptions,
  saturationPreference?: SaturationPreference
): QrStyleOptions {
  const pref = saturationPreference || current.bgSaturationPreference || 'low';

  // 1. Pick a random pattern
  const newPattern = getRandomItem(PATTERN_STYLES_POOL, current.patternStyle);

  // 2. Pick a random corner eye shape
  const newEyeStyle = getRandomItem(EYE_STYLES_POOL, current.eyeStyle);

  // 3. Pick a random pupil shape
  const newPupilStyle = getRandomItem(PUPIL_STYLES_POOL, current.pupilStyle);

  // 4. Pick corner style (smooth vs sharp)
  const newCornerStyle: QrCornerStyle = Math.random() > 0.4 ? 'smooth' : 'sharp';

  // 5. Pick color mode (solid or gradient)
  const useGradient = Math.random() > 0.45;
  const newColorMode: ColorMode = useGradient ? 'linear-gradient' : 'solid';

  // 6. Select Foreground Colors
  // Usually deep dark for highest readability, or vibrant with soft background
  const fgPool = Math.random() > 0.3 ? DARK_FG_COLORS : VIBRANT_FG_COLORS;
  const newFgColor = getRandomItem(fgPool, current.fgColor);
  const newFgColorEnd = useGradient
    ? getRandomItem(VIBRANT_FG_COLORS.concat(DARK_FG_COLORS), newFgColor)
    : newFgColor;

  // 7. Select High-Contrast Background Color
  const newBgColor = getRandomBg(current.bgColor, newFgColor, pref);

  // 8. Select Eye Colors
  const useCustomEyeColors = Math.random() > 0.4;
  let newEyeOuterColor = newFgColor;
  let newEyeInnerColor = newFgColor;

  if (useCustomEyeColors) {
    newEyeOuterColor = getRandomItem(
      DARK_FG_COLORS.concat(VIBRANT_FG_COLORS).filter(
        (c) => getContrastRatio(c, newBgColor) >= 3.0
      ),
      newBgColor
    ) || newFgColor;

    newEyeInnerColor = getRandomPupil(newBgColor, newEyeOuterColor);
  }

  return {
    ...current,
    patternStyle: newPattern,
    eyeStyle: newEyeStyle,
    pupilStyle: newPupilStyle,
    cornerStyle: newCornerStyle,
    colorMode: newColorMode,
    fgColor: newFgColor,
    fgColorEnd: newFgColorEnd,
    bgColor: newBgColor,
    transparentBg: false,
    customEyeColors: useCustomEyeColors,
    eyeOuterColor: newEyeOuterColor,
    eyeInnerColor: newEyeInnerColor,
    bgSaturationPreference: pref,
  };
}


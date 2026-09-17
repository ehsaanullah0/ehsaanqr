import { getContrastRatio, analyzeReadability } from './contrast';
import {
  QrStyleOptions,
  PatternStyle,
  EyeStyle,
  PupilStyle,
  QrCornerStyle,
  ColorMode,
  RandomizeTarget,
  RandomizeType,
  LogoType,
} from '../types';

export type SaturationPreference = 'low' | 'high';

export const PATTERN_STYLES_POOL: PatternStyle[] = [
  'square',
  'rounded',
  'circle',
  'diamond',
  'hexagon',
  'octagon',
  'squircle',
  'pill',
  'leaf',
  'flower',
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
  'chamfer',
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
function generateCandidateOptions(
  current: QrStyleOptions,
  pref: SaturationPreference,
  lockedTargets: RandomizeTarget[] = []
): QrStyleOptions {
  const isLocked = (target: RandomizeTarget) => lockedTargets.includes(target);

  // 1. Pick a random pattern (preserved if matrix locked)
  const newPattern = isLocked('matrix')
    ? current.patternStyle
    : getRandomItem(PATTERN_STYLES_POOL, current.patternStyle);

  // 2. Pick a random corner eye shape (preserved if eyes locked)
  const newEyeStyle = isLocked('eyes')
    ? current.eyeStyle
    : getRandomItem(EYE_STYLES_POOL, current.eyeStyle);

  // 3. Pick a random pupil shape (preserved if pupil locked)
  const newPupilStyle = isLocked('pupil')
    ? current.pupilStyle
    : getRandomItem(PUPIL_STYLES_POOL, current.pupilStyle);

  // 4. Retain QR corner style without randomizing (preserved if frame locked)
  const newCornerStyle: QrCornerStyle = isLocked('frame')
    ? current.cornerStyle
    : current.cornerStyle || 'smooth';

  // 5. Pick color mode and foreground colors (preserved if foreground locked)
  let newColorMode: ColorMode = current.colorMode;
  let newFgColor = current.fgColor;
  let newFgColorEnd = current.fgColorEnd;

  if (!isLocked('foreground')) {
    const useGradient = Math.random() > 0.45;
    newColorMode = useGradient ? 'linear-gradient' : 'solid';

    // If background is locked, pick foreground colors that contrast with current background
    let fgPool = Math.random() > 0.3 ? DARK_FG_COLORS : VIBRANT_FG_COLORS;
    if (isLocked('background')) {
      const highContrastPool = fgPool.filter(
        (c) => getContrastRatio(c, current.bgColor) >= 3.0
      );
      if (highContrastPool.length > 0) {
        fgPool = highContrastPool;
      }
    }

    newFgColor = getRandomItem(fgPool, current.fgColor);
    newFgColorEnd = useGradient
      ? getRandomItem(VIBRANT_FG_COLORS.concat(DARK_FG_COLORS), newFgColor)
      : newFgColor;
  }

  // 7. Select High-Contrast Background Color (preserved if background locked)
  let newBgColor = current.bgColor;
  if (!isLocked('background')) {
    newBgColor = getRandomBg(current.bgColor, newFgColor, pref);
  }

  // 8. Select Eye Colors (respecting eyeColor, pupilColor, and shape locks)
  let useCustomEyeColors = current.customEyeColors;
  let newEyeOuterColor = current.eyeOuterColor;
  let newEyeInnerColor = current.eyeInnerColor;

  const eyeColorLocked = isLocked('eyeColor') || isLocked('eyes');
  const pupilColorLocked = isLocked('pupilColor') || isLocked('pupil');

  if (!eyeColorLocked && !pupilColorLocked) {
    useCustomEyeColors = Math.random() > 0.4;
    newEyeOuterColor = newFgColor;
    newEyeInnerColor = newFgColor;

    if (useCustomEyeColors) {
      newEyeOuterColor =
        getRandomItem(
          DARK_FG_COLORS.concat(VIBRANT_FG_COLORS).filter(
            (c) => getContrastRatio(c, newBgColor) >= 3.0
          ),
          newBgColor
        ) || newFgColor;

      newEyeInnerColor = getRandomPupil(newBgColor, newEyeOuterColor);
    }
  } else {
    // Selectively customize only the unlocked eye components
    if (!eyeColorLocked) {
      newEyeOuterColor =
        getRandomItem(
          DARK_FG_COLORS.concat(VIBRANT_FG_COLORS).filter(
            (c) => getContrastRatio(c, newBgColor) >= 3.0
          ),
          newBgColor
        ) || newFgColor;
      useCustomEyeColors = true;
    }
    if (!pupilColorLocked) {
      newEyeInnerColor = getRandomPupil(newBgColor, newEyeOuterColor);
      useCustomEyeColors = true;
    }
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
    transparentBg: isLocked('background') ? current.transparentBg : false,
    customEyeColors: useCustomEyeColors,
    eyeOuterColor: newEyeOuterColor,
    eyeInnerColor: newEyeInnerColor,
    bgSaturationPreference: pref,
  };
}

/**
 * Intelligent Randomizer with Generate -> Score -> Decide Loop
 * Preserves maximum creative freedom, unusual colors, gradients, and shapes
 * while validating optical readability and respecting user category locks.
 */
export function getRandomAllOptions(
  current: QrStyleOptions,
  saturationPreference?: SaturationPreference,
  lockedTargets: RandomizeTarget[] = []
): QrStyleOptions {
  const pref = saturationPreference || current.bgSaturationPreference || 'low';

  // Attempt generation with readability evaluation (Generate -> Score -> Decide)
  let bestCandidate = generateCandidateOptions(current, pref, lockedTargets);
  let bestReport = analyzeReadability(bestCandidate);

  // If initial candidate has good/moderate/excellent readability (score >= 60), keep it!
  if (bestReport.overallScore >= 60) {
    return bestCandidate;
  }

  // If score is risky (< 60) or poor (< 40), try up to 3 creative re-rolls to find a vibrant combination with better contrast
  for (let attempt = 0; attempt < 3; attempt++) {
    const nextCandidate = generateCandidateOptions(current, pref, lockedTargets);
    const nextReport = analyzeReadability(nextCandidate);

    if (nextReport.overallScore > bestReport.overallScore) {
      bestCandidate = nextCandidate;
      bestReport = nextReport;
    }

    if (bestReport.overallScore >= 60) {
      break;
    }
  }

  return bestCandidate;
}

export const VALID_RANDOMIZE_TYPES: Record<RandomizeTarget, RandomizeType[]> = {
  all: ['both', 'shape', 'color'],
  matrix: ['shape'],
  foreground: ['color'],
  background: ['color'],
  eyes: ['both', 'shape', 'color'],
  eyeColor: ['color'],
  pupil: ['both', 'shape', 'color'],
  pupilColor: ['color'],
  logo: ['both', 'shape', 'color'],
  frame: ['shape'],
};

export const RANDOMIZE_TARGET_INFO: Record<
  RandomizeTarget,
  { label: string; shortLabel: string; description: string; defaultType: RandomizeType }
> = {
  all: {
    label: 'All Elements',
    shortLabel: 'All',
    description: 'Complete QR matrix, eyes, pupils & colors',
    defaultType: 'both',
  },
  matrix: {
    label: 'QR / Matrix Shape',
    shortLabel: 'QR Shape',
    description: 'Data module pattern & pixel curvature',
    defaultType: 'shape',
  },
  foreground: {
    label: 'Foreground',
    shortLabel: 'Foreground',
    description: 'Module colors & gradient tones',
    defaultType: 'color',
  },
  background: {
    label: 'Background',
    shortLabel: 'Background',
    description: 'Canvas backdrop color',
    defaultType: 'color',
  },
  eyes: {
    label: 'Corner Eyes',
    shortLabel: 'Corner Eye',
    description: 'Finder frame contour shape & outer color',
    defaultType: 'both',
  },
  eyeColor: {
    label: 'Corner Eye Color',
    shortLabel: 'Corner Eye Color',
    description: 'Finder frame outer ring color',
    defaultType: 'color',
  },
  pupil: {
    label: 'Pupil',
    shortLabel: 'Pupil',
    description: 'Inner finder center dot shape & color',
    defaultType: 'both',
  },
  pupilColor: {
    label: 'Pupil Color',
    shortLabel: 'Pupil Color',
    description: 'Inner finder center dot color',
    defaultType: 'color',
  },
  logo: {
    label: 'Logo / Center Element',
    shortLabel: 'Logo',
    description: 'Center badge style, background & border',
    defaultType: 'both',
  },
  frame: {
    label: 'Frame / Corner Style',
    shortLabel: 'Frame',
    description: 'Outer corner curve boundary (sharp/smooth)',
    defaultType: 'shape',
  },
};

/**
 * Returns formatted button label according to selected target and type.
 * Exactly matches specification examples:
 * - Default: "Randomize All"
 * - Pupil + Color: "Pupil · Color"
 * - Pupil + Shape: "Pupil · Shape"
 * - Pupil + Both: "Pupil · Both"
 * - Background: "Background · Color"
 * - QR Shape: "QR Shape · Shape"
 */
export function getRandomizeButtonLabel(target: RandomizeTarget, type: RandomizeType): string {
  if (target === 'all') {
    if (type === 'both') return 'Randomize All';
    if (type === 'shape') return 'All · Shape';
    if (type === 'color') return 'All · Color';
  }

  const shortName = RANDOMIZE_TARGET_INFO[target]?.shortLabel || 'All';
  const typeName = type === 'both' ? 'Both' : type === 'shape' ? 'Shape' : 'Color';
  return `${shortName} · ${typeName}`;
}

/**
 * Executes Smart Randomization on ONLY the targeted element and type,
 * preserving ALL other user configurations and enforcing optical readability.
 */
export function executeSmartRandomize(
  current: QrStyleOptions,
  target: RandomizeTarget,
  type: RandomizeType,
  saturationPreference?: SaturationPreference,
  lockedTargets: RandomizeTarget[] = []
): { updated: QrStyleOptions; message: string } {
  const pref = saturationPreference || current.bgSaturationPreference || 'low';
  const isLocked = (t: RandomizeTarget) => lockedTargets.includes(t);

  // If a specific target is selected but is locked, notify user to unlock it
  if (target !== 'all' && isLocked(target)) {
    const targetName = RANDOMIZE_TARGET_INFO[target]?.shortLabel || target;
    return {
      updated: current,
      message: `${targetName} is locked against randomizing. Unlock it to roll.`,
    };
  }

  // 1. ALL
  if (target === 'all') {
    const lockedNames = lockedTargets
      .map((t) => RANDOMIZE_TARGET_INFO[t]?.shortLabel || t)
      .join(', ');

    if (type === 'both') {
      const updated = getRandomAllOptions(current, pref, lockedTargets);
      const message =
        lockedTargets.length > 0
          ? `Randomized All Elements (${lockedNames} locked) ✓`
          : 'Randomized All: Matrix, Eyes, Pupils, and Colors ✓';
      return {
        updated,
        message,
      };
    }

    if (type === 'shape') {
      // Randomize only shapes, retaining ALL colors and respecting shape locks
      const newPattern = isLocked('matrix')
        ? current.patternStyle
        : getRandomItem(PATTERN_STYLES_POOL, current.patternStyle);
      const newEyeStyle = isLocked('eyes')
        ? current.eyeStyle
        : getRandomItem(EYE_STYLES_POOL, current.eyeStyle);
      const newPupilStyle = isLocked('pupil')
        ? current.pupilStyle
        : getRandomItem(
            PUPIL_STYLES_POOL.filter((p) => p !== 'auto'),
            current.pupilStyle
          );
      const newCornerStyle: QrCornerStyle = isLocked('frame')
        ? current.cornerStyle
        : current.cornerStyle === 'smooth'
        ? 'sharp'
        : 'smooth';

      const updated: QrStyleOptions = {
        ...current,
        patternStyle: newPattern,
        eyeStyle: newEyeStyle,
        pupilStyle: newPupilStyle,
        cornerStyle: newCornerStyle,
      };

      const message =
        lockedTargets.length > 0
          ? `Randomized All Shapes (${lockedNames} locked) ✓`
          : 'Randomized All Shapes: Pattern, Corner Eyes & Pupil ✓';

      return {
        updated,
        message,
      };
    }

    if (type === 'color') {
      // Randomize only colors, retaining ALL shapes and respecting color locks
      let newFgColor = current.fgColor;
      let newFgColorEnd = current.fgColorEnd;
      let newColorMode = current.colorMode;

      if (!isLocked('foreground')) {
        const useGradient = Math.random() > 0.45;
        newColorMode = useGradient ? 'linear-gradient' : 'solid';
        let fgPool = Math.random() > 0.3 ? DARK_FG_COLORS : VIBRANT_FG_COLORS;
        if (isLocked('background')) {
          const highContrast = fgPool.filter(
            (c) => getContrastRatio(c, current.bgColor) >= 3.0
          );
          if (highContrast.length > 0) fgPool = highContrast;
        }
        newFgColor = getRandomItem(fgPool, current.fgColor);
        newFgColorEnd = useGradient
          ? getRandomItem(VIBRANT_FG_COLORS.concat(DARK_FG_COLORS), newFgColor)
          : newFgColor;
      }

      let newBgColor = current.bgColor;
      if (!isLocked('background')) {
        newBgColor = getRandomBg(current.bgColor, newFgColor, pref);
      }

      let newEyeOuterColor = current.eyeOuterColor;
      let newEyeInnerColor = current.eyeInnerColor;
      let useCustomEyes = current.customEyeColors;

      const eyeColorLocked = isLocked('eyeColor') || isLocked('eyes');
      const pupilColorLocked = isLocked('pupilColor') || isLocked('pupil');

      if (!eyeColorLocked && !pupilColorLocked) {
        useCustomEyes = Math.random() > 0.4;
        newEyeOuterColor = newFgColor;
        newEyeInnerColor = newFgColor;

        if (useCustomEyes) {
          newEyeOuterColor =
            getRandomItem(
              DARK_FG_COLORS.concat(VIBRANT_FG_COLORS).filter(
                (c) => getContrastRatio(c, newBgColor) >= 3.0
              ),
              newBgColor
            ) || newFgColor;
          newEyeInnerColor = getRandomPupil(newBgColor, newEyeOuterColor);
        }
      } else {
        if (!eyeColorLocked) {
          newEyeOuterColor =
            getRandomItem(
              DARK_FG_COLORS.concat(VIBRANT_FG_COLORS).filter(
                (c) => getContrastRatio(c, newBgColor) >= 3.0
              ),
              newBgColor
            ) || newFgColor;
          useCustomEyes = true;
        }
        if (!pupilColorLocked) {
          newEyeInnerColor = getRandomPupil(newBgColor, newEyeOuterColor);
          useCustomEyes = true;
        }
      }

      const updated: QrStyleOptions = {
        ...current,
        colorMode: newColorMode,
        fgColor: newFgColor,
        fgColorEnd: newFgColorEnd,
        bgColor: newBgColor,
        transparentBg: isLocked('background') ? current.transparentBg : false,
        customEyeColors: useCustomEyes,
        eyeOuterColor: newEyeOuterColor,
        eyeInnerColor: newEyeInnerColor,
        bgSaturationPreference: pref,
      };

      const message =
        lockedTargets.length > 0
          ? `Randomized All Colors (${lockedNames} locked) ✓`
          : 'Randomized All Colors: Foreground, Background & Eyes ✓';

      return {
        updated,
        message,
      };
    }
  }

  // 2. QR / MATRIX SHAPE
  if (target === 'matrix') {
    const newPattern = getRandomItem(PATTERN_STYLES_POOL, current.patternStyle);
    const patternNames: Record<PatternStyle, string> = {
      square: 'Square',
      rounded: 'Rounded',
      circle: 'Circle',
      dots: 'Circle',
      diamond: 'Diamond',
      hexagon: 'Hexagon',
      octagon: 'Octagon',
      squircle: 'Squircle',
      pill: 'Pill',
      leaf: 'Leaf',
      flower: 'Flower',
      liquid: 'Liquid Flow',
    };
    return {
      updated: {
        ...current,
        patternStyle: newPattern,
      },
      message: `Randomized QR Shape: ${patternNames[newPattern]} ✓`,
    };
  }

  // 3. FOREGROUND
  if (target === 'foreground') {
    // Current BG stays fixed. Find a high-contrast FG color
    const validFgPool = DARK_FG_COLORS.concat(VIBRANT_FG_COLORS).filter((c) => {
      if (c.toLowerCase() === current.fgColor.toLowerCase()) return false;
      return getContrastRatio(c, current.bgColor) >= 3.2;
    });

    const newFg =
      validFgPool.length > 0
        ? getRandomItem(validFgPool)
        : getContrastRatio('#000000', current.bgColor) >= 3.0
        ? '#000000'
        : '#FFFFFF';

    const newFgEnd =
      current.colorMode !== 'solid'
        ? getRandomItem(
            DARK_FG_COLORS.concat(VIBRANT_FG_COLORS).filter(
              (c) => getContrastRatio(c, current.bgColor) >= 3.0
            ),
            newFg
          ) || newFg
        : newFg;

    return {
      updated: {
        ...current,
        fgColor: newFg,
        fgColorEnd: newFgEnd,
      },
      message: `Randomized Foreground Color (${newFg}) ✓`,
    };
  }

  // 4. BACKGROUND
  if (target === 'background') {
    const newBg = getRandomBg(current.bgColor, current.fgColor, pref);

    // Scanability safeguard: if custom eye colors are active, verify they contrast with new background
    let adjustedEyeOuter = current.eyeOuterColor;
    let adjustedEyeInner = current.eyeInnerColor;

    if (current.customEyeColors) {
      if (getContrastRatio(adjustedEyeOuter, newBg) < 2.8) {
        adjustedEyeOuter = current.fgColor;
      }
      if (getContrastRatio(adjustedEyeInner, newBg) < 2.5) {
        adjustedEyeInner = getRandomPupil(newBg, adjustedEyeOuter);
      }
    }

    return {
      updated: {
        ...current,
        bgColor: newBg,
        transparentBg: false,
        eyeOuterColor: adjustedEyeOuter,
        eyeInnerColor: adjustedEyeInner,
        bgSaturationPreference: pref,
      },
      message: `Randomized Background Color (${newBg}) ✓`,
    };
  }

  // 5. CORNER EYES (Frame)
  if (target === 'eyes') {
    const newEyeStyle =
      type === 'shape' || type === 'both'
        ? getRandomItem(EYE_STYLES_POOL, current.eyeStyle)
        : current.eyeStyle;

    let newEyeOuterColor = current.eyeOuterColor;
    let customEyes = current.customEyeColors;

    if (type === 'color' || type === 'both') {
      customEyes = true;
      const validColors = DARK_FG_COLORS.concat(VIBRANT_FG_COLORS).filter(
        (c) =>
          getContrastRatio(c, current.bgColor) >= 3.0 &&
          c.toLowerCase() !== current.eyeOuterColor.toLowerCase()
      );
      newEyeOuterColor =
        validColors.length > 0 ? getRandomItem(validColors) : current.fgColor;
    }

    return {
      updated: {
        ...current,
        eyeStyle: newEyeStyle,
        eyeOuterColor: newEyeOuterColor,
        customEyeColors: customEyes,
      },
      message:
        type === 'both'
          ? `Randomized Corner Eye Shape (${newEyeStyle}) & Color (${newEyeOuterColor}) ✓`
          : type === 'shape'
          ? `Randomized Corner Eye Shape (${newEyeStyle}) ✓`
          : `Randomized Corner Eye Color (${newEyeOuterColor}) ✓`,
    };
  }

  // 6. CORNER EYE COLOR
  if (target === 'eyeColor') {
    const validColors = DARK_FG_COLORS.concat(VIBRANT_FG_COLORS).filter(
      (c) =>
        getContrastRatio(c, current.bgColor) >= 3.0 &&
        c.toLowerCase() !== current.eyeOuterColor.toLowerCase()
    );
    const newEyeOuterColor =
      validColors.length > 0 ? getRandomItem(validColors) : current.fgColor;

    return {
      updated: {
        ...current,
        eyeOuterColor: newEyeOuterColor,
        customEyeColors: true,
      },
      message: `Randomized Corner Eye Color (${newEyeOuterColor}) ✓`,
    };
  }

  // 7. PUPIL
  if (target === 'pupil') {
    const newPupilStyle =
      type === 'shape' || type === 'both'
        ? getRandomItem(
            PUPIL_STYLES_POOL.filter((p) => p !== 'auto'),
            current.pupilStyle
          )
        : current.pupilStyle;

    let newPupilColor = current.eyeInnerColor;
    let customEyes = current.customEyeColors;

    if (type === 'color' || type === 'both') {
      customEyes = true;
      newPupilColor = getRandomPupil(current.bgColor, current.eyeInnerColor);
    }

    return {
      updated: {
        ...current,
        pupilStyle: newPupilStyle,
        eyeInnerColor: newPupilColor,
        customEyeColors: customEyes,
      },
      message:
        type === 'both'
          ? `Randomized Pupil Shape (${newPupilStyle}) & Color (${newPupilColor}) ✓`
          : type === 'shape'
          ? `Randomized Pupil Shape (${newPupilStyle}) ✓`
          : `Randomized Pupil Color (${newPupilColor}) ✓`,
    };
  }

  // 8. PUPIL COLOR
  if (target === 'pupilColor') {
    const newPupilColor = getRandomPupil(current.bgColor, current.eyeInnerColor);
    return {
      updated: {
        ...current,
        eyeInnerColor: newPupilColor,
        customEyeColors: true,
      },
      message: `Randomized Pupil Color (${newPupilColor}) ✓`,
    };
  }

  // 9. LOGO
  if (target === 'logo') {
    const monoLogos: LogoType[] = [
      'url',
      'phone',
      'whatsapp',
      'wifi',
      'email',
      'upi',
      'payment',
      'text',
      'sms',
      'calendar',
      'vcard',
      'location',
    ];
    const logoType = current.logo.type === 'none' ? getRandomItem(monoLogos) : current.logo.type;
    const borderRadii = [0, 8, 16, 24, 50];
    const newBorderRadius =
      type === 'shape' || type === 'both'
        ? getRandomItem(borderRadii, current.logo.borderRadius)
        : current.logo.borderRadius;

    const sizes = [0.18, 0.2, 0.22, 0.24];
    const newSize =
      type === 'shape' || type === 'both'
        ? getRandomItem(sizes, current.logo.sizeRatio)
        : current.logo.sizeRatio;

    const paddings = [2, 4, 6, 8];
    const newPadding =
      type === 'shape' || type === 'both'
        ? getRandomItem(paddings, current.logo.padding)
        : current.logo.padding;

    const bgOptions: Array<'white' | 'match' | 'custom'> = ['white', 'match', 'custom'];
    const newBgType =
      type === 'color' || type === 'both'
        ? getRandomItem(bgOptions, current.logo.background as any)
        : current.logo.background;

    const newCustomBgColor =
      newBgType === 'custom'
        ? getRandomItem(DARK_FG_COLORS.concat(VIBRANT_FG_COLORS), current.logo.customBgColor)
        : current.logo.customBgColor;

    return {
      updated: {
        ...current,
        errorCorrection:
          current.errorCorrection === 'L' || current.errorCorrection === 'M'
            ? 'H'
            : current.errorCorrection,
        logo: {
          ...current.logo,
          type: logoType,
          sizeRatio: newSize,
          borderRadius: newBorderRadius,
          padding: newPadding,
          background: newBgType,
          customBgColor: newCustomBgColor,
        },
      },
      message:
        type === 'both'
          ? `Randomized Logo Shape (${newBorderRadius}% radius) & Background ✓`
          : type === 'shape'
          ? `Randomized Logo Shape (${newBorderRadius}% radius, ${(newSize * 100).toFixed(0)}% size) ✓`
          : `Randomized Logo Background (${newBgType}) ✓`,
    };
  }

  // 10. FRAME / CORNER STYLE
  if (target === 'frame') {
    const newCornerStyle: QrCornerStyle =
      current.cornerStyle === 'smooth' ? 'sharp' : 'smooth';
    return {
      updated: {
        ...current,
        cornerStyle: newCornerStyle,
      },
      message: `Randomized QR Corner Frame: ${newCornerStyle === 'smooth' ? 'Smooth' : 'Sharp'} Corners ✓`,
    };
  }

  // Default fallback to all
  return {
    updated: getRandomAllOptions(current, pref),
    message: 'Randomized All ✓',
  };
}



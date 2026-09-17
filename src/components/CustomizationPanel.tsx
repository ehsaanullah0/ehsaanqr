import React, { useState } from 'react';
import {
  QrStyleOptions,
  PatternStyle,
  EyeStyle,
  PupilStyle,
  ColorMode,
  ErrorCorrectionLevel,
  CustomizationTabKey,
  LogoType,
  QrType,
} from '../types';
import {
  Palette,
  Shapes,
  Eye,
  Image as ImageIcon,
  Sliders,
  ArrowLeftRight,
  Upload,
  X,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Dices,
  Shuffle,
  Globe,
  Phone,
  MessageCircle,
  Wifi,
  Mail,
  CreditCard,
  QrCode,
  Check,
} from 'lucide-react';
import {
  resolvePupilShape,
  getAutoLogoForCategory,
  URL_LOGO_DATA_URL,
  PHONE_LOGO_DATA_URL,
  WHATSAPP_LOGO_DATA_URL,
  WIFI_LOGO_DATA_URL,
  EMAIL_LOGO_DATA_URL,
  UPI_LOGO_DATA_URL,
  PAYMENT_LOGO_DATA_URL,
  TEXT_LOGO_DATA_URL,
  SMS_LOGO_DATA_URL,
  CALENDAR_LOGO_DATA_URL,
  VCARD_LOGO_DATA_URL,
  LOCATION_LOGO_DATA_URL,
} from '../utils/qrRenderer';
import { SmartRandomizeController } from './SmartRandomizeController';
import { ColorPickerField } from './ColorPickerField';
import { ColorPalettePicker } from './ColorPalettePicker';
import {
  getRandomBg,
  getRandomPupil,
  getRandomBgAndPupil,
  getRandomAllOptions,
} from '../utils/colorRandomizer';
import { RandomizeTarget, RandomizeType } from '../types';

interface CustomizationPanelProps {
  options: QrStyleOptions;
  onChange: (options: QrStyleOptions) => void;
  selectedType?: QrType;
  activeTab?: CustomizationTabKey;
  onTabChange?: (tab: CustomizationTabKey) => void;
  selectedRandomizeTarget?: RandomizeTarget;
  selectedRandomizeType?: RandomizeType;
  onRandomizeTargetChange?: (target: RandomizeTarget) => void;
  onRandomizeTypeChange?: (type: RandomizeType) => void;
  lockedTargets?: RandomizeTarget[];
  onLockedTargetsChange?: (locks: RandomizeTarget[]) => void;
  onShowToast?: (msg: string) => void;
}

type TabKey = CustomizationTabKey;

export interface ColorPresetCombo {
  id: string;
  name: string;
  outer: string; // Outer swatch & background
  inner: string; // Inner dot & foreground / eye
}

// 28 curated color combos matching the reference design:
// Rows 1-4: 6 swatches each, Row 5: 4 swatches (total 28 presets)
const PRESET_COLOR_COMBOS: ColorPresetCombo[] = [
  // Row 1: Whites & Bright Cyans / Mints / Limes
  { id: 'p-01', name: 'White & Charcoal', outer: '#FFFFFF', inner: '#111827' },
  { id: 'p-02', name: 'Pastel Sky', outer: '#BAE6FD', inner: '#0F172A' },
  { id: 'p-03', name: 'Sky Cyan', outer: '#38BDF8', inner: '#082F49' },
  { id: 'p-04', name: 'Mint Seafoam', outer: '#A7F3D0', inner: '#064E3B' },
  { id: 'p-05', name: 'Vivid Mint', outer: '#6EE7B7', inner: '#064E3B' },
  { id: 'p-06', name: 'Lime Glow', outer: '#BEF264', inner: '#1A2E05' },

  // Row 2: Warm Creams, Yellows, Peaches & Salmons
  { id: 'p-07', name: 'Pale Butter', outer: '#FEF08A', inner: '#1F2937' },
  { id: 'p-08', name: 'Sunshine Gold', outer: '#FACC15', inner: '#1F2937' },
  { id: 'p-09', name: 'Bisque Tan', outer: '#FED7AA', inner: '#291807' },
  { id: 'p-10', name: 'Warm Apricot', outer: '#FDBA74', inner: '#271406' },
  { id: 'p-11', name: 'Soft Coral', outer: '#FCA5A5', inner: '#3F0E0E' },
  { id: 'p-12', name: 'Salmon Rose', outer: '#FDA4AF', inner: '#3B0B14' },

  // Row 3: Pinks, Magentas, Orchids & Purples
  { id: 'p-13', name: 'Bubblegum Pink', outer: '#F472B6', inner: '#31071B' },
  { id: 'p-14', name: 'Crimson Magenta', outer: '#F43F5E', inner: '#27040E' },
  { id: 'p-15', name: 'Light Orchid', outer: '#F0ABFC', inner: '#2E063B' },
  { id: 'p-16', name: 'Violet Purple', outer: '#C084FC', inner: '#27044A' },
  { id: 'p-17', name: 'Periwinkle Lilac', outer: '#DDD6FE', inner: '#1E0847' },
  { id: 'p-18', name: 'Lavender Violet', outer: '#A78BFA', inner: '#1D0845' },

  // Row 4: Blues, Cyans, Sage & Emerald Greens
  { id: 'p-19', name: 'Slate Lavender', outer: '#A5B4FC', inner: '#13103D' },
  { id: 'p-20', name: 'Powder Blue', outer: '#93C5FD', inner: '#0C1E3D' },
  { id: 'p-21', name: 'Ice Sky Blue', outer: '#7DD3FC', inner: '#08243D' },
  { id: 'p-22', name: 'Turquoise Aqua', outer: '#06B6D4', inner: '#03252A' },
  { id: 'p-23', name: 'Matcha Cream', outer: '#D9F99D', inner: '#14532D' },
  { id: 'p-24', name: 'Spring Emerald', outer: '#4ADE80', inner: '#052E16' },

  // Row 5: Deep & Inverted Contrasts
  { id: 'p-25', name: 'Silver Mist', outer: '#E2E8F0', inner: '#0F172A' },
  { id: 'p-26', name: 'Midnight Obsidian', outer: '#09090B', inner: '#FFFFFF' },
  { id: 'p-27', name: 'Night Indigo', outer: '#1E1B4B', inner: '#E9D5FF' },
  { id: 'p-28', name: 'Slate Steel Navy', outer: '#1E293B', inner: '#E0F2FE' },
];

export const PATTERN_STYLES_LIST: Array<{
  id: PatternStyle;
  label: string;
  desc: string;
}> = [
  { id: 'square', label: 'Square', desc: 'Sharp 90° box' },
  { id: 'rounded', label: 'Rounded', desc: 'Smooth 30% curve' },
  { id: 'circle', label: 'Circle', desc: 'Round dot' },
  { id: 'diamond', label: 'Diamond', desc: '45° Rhombus' },
  { id: 'hexagon', label: 'Hexagon', desc: '6-Sided polygon' },
  { id: 'octagon', label: 'Octagon', desc: '8-Sided chamfer' },
  { id: 'squircle', label: 'Squircle', desc: 'Superellipse' },
  { id: 'pill', label: 'Pill', desc: 'Capsule stadium' },
  { id: 'leaf', label: 'Leaf', desc: 'Dual curve' },
  { id: 'flower', label: 'Flower', desc: '4-Petal clover' },
  { id: 'liquid', label: 'Liquid', desc: 'Fluid droplet' },
];

export const PixelShapePreview: React.FC<{ styleId: PatternStyle }> = ({ styleId }) => {
  return (
    <div className="w-11 h-11 mb-2 flex items-center justify-center p-1.5 bg-[#FAF8F5] dark:bg-zinc-900 rounded-lg border border-[#EDE8DF] dark:border-zinc-700/80">
      {styleId === 'square' && (
        <div className="grid grid-cols-2 gap-1.5 w-6 h-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-2 h-2 bg-[#E7AC08]" />
          ))}
        </div>
      )}
      {styleId === 'rounded' && (
        <div className="grid grid-cols-2 gap-1.5 w-6 h-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-2 h-2 bg-[#E7AC08] rounded-xs" />
          ))}
        </div>
      )}
      {(styleId === 'circle' || styleId === 'dots') && (
        <div className="grid grid-cols-2 gap-1.5 w-6 h-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-2 h-2 bg-[#E7AC08] rounded-full" />
          ))}
        </div>
      )}
      {styleId === 'diamond' && (
        <div className="grid grid-cols-2 gap-1.5 w-6 h-6">
          {[0, 1, 2, 3].map((i) => (
            <svg key={i} viewBox="0 0 16 16" className="w-2 h-2 fill-[#E7AC08] mx-auto">
              <polygon points="8,0.5 15.5,8 8,15.5 0.5,8" />
            </svg>
          ))}
        </div>
      )}
      {styleId === 'hexagon' && (
        <div className="grid grid-cols-2 gap-1.5 w-6 h-6">
          {[0, 1, 2, 3].map((i) => (
            <svg key={i} viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-[#E7AC08] mx-auto">
              <polygon points="8,0.5 14.5,4.2 14.5,11.8 8,15.5 1.5,11.8 1.5,4.2" />
            </svg>
          ))}
        </div>
      )}
      {styleId === 'octagon' && (
        <div className="grid grid-cols-2 gap-1.5 w-6 h-6">
          {[0, 1, 2, 3].map((i) => (
            <svg key={i} viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-[#E7AC08] mx-auto">
              <polygon points="4.5,0.5 11.5,0.5 15.5,4.5 15.5,11.5 11.5,15.5 4.5,15.5 0.5,11.5 0.5,4.5" />
            </svg>
          ))}
        </div>
      )}
      {styleId === 'squircle' && (
        <div className="grid grid-cols-2 gap-1.5 w-6 h-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-2 h-2 bg-[#E7AC08] rounded-sm" />
          ))}
        </div>
      )}
      {styleId === 'pill' && (
        <div className="grid grid-cols-2 gap-1.5 w-6 h-6 items-center">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-2.5 h-1.5 bg-[#E7AC08] rounded-full mx-auto" />
          ))}
        </div>
      )}
      {styleId === 'leaf' && (
        <div className="grid grid-cols-2 gap-1.5 w-6 h-6">
          {[0, 1, 2, 3].map((i) => (
            <svg key={i} viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-[#E7AC08] mx-auto">
              <path d="M 7.5,0.5 L 15.5,0.5 L 15.5,8.5 A 7.5,7.5 0 0 1 8,15.5 L 0.5,15.5 L 0.5,8.5 A 7.5,7.5 0 0 1 7.5,0.5 Z" />
            </svg>
          ))}
        </div>
      )}
      {styleId === 'flower' && (
        <div className="grid grid-cols-2 gap-1.5 w-6 h-6">
          {[0, 1, 2, 3].map((i) => (
            <svg key={i} viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-[#E7AC08] mx-auto">
              <circle cx="8" cy="4" r="2.8" />
              <circle cx="12" cy="8" r="2.8" />
              <circle cx="8" cy="12" r="2.8" />
              <circle cx="4" cy="8" r="2.8" />
              <circle cx="8" cy="8" r="2.8" />
            </svg>
          ))}
        </div>
      )}
      {styleId === 'liquid' && (
        <div className="w-6 h-6 flex flex-col justify-between">
          <div className="w-full h-2 bg-[#E7AC08] rounded-full" />
          <div className="flex justify-between items-center">
            <div className="w-2 h-2 bg-[#E7AC08] rounded-full" />
            <div className="w-2 h-2 bg-[#E7AC08] rounded-tl-full rounded-br-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export const EYE_STYLES: Array<{
  id: EyeStyle;
  label: string;
  desc: string;
}> = [
  { id: 'square', label: 'Square', desc: 'Standard 90° frame' },
  { id: 'rounded', label: 'Rounded', desc: 'Soft uniform curvature' },
  { id: 'circle', label: 'Circle Ring', desc: 'Concentric circular rings' },
  { id: 'modern', label: 'Modern', desc: 'Fluid squircle silhouette' },
  { id: 'leaf', label: 'Leaf', desc: 'Diagonal organic curve' },
  { id: 'outer-smooth', label: 'Shield', desc: '3-Corner smooth outer chamfer' },
  { id: 'cut-corner', label: 'Cut Corner', desc: '45° Chamfered beveled' },
  { id: 'hexagon', label: 'Hexagon', desc: '6-Sided geometric' },
  { id: 'star', label: 'Pinch Star', desc: '4-Point concave flare' },
  { id: 'flower', label: 'Flower', desc: '4-Petal clover ring' },
];

export const EyeShapeIcon: React.FC<{
  shape: EyeStyle;
  className?: string;
}> = ({ shape, className = 'w-6 h-6' }) => {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none">
      {shape === 'square' && (
        <rect x="3" y="3" width="22" height="22" stroke="currentColor" strokeWidth="3" />
      )}
      {shape === 'rounded' && (
        <rect x="3" y="3" width="22" height="22" rx="7" stroke="currentColor" strokeWidth="3" />
      )}
      {shape === 'circle' && (
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="3" />
      )}
      {shape === 'modern' && (
        <rect x="3" y="3" width="22" height="22" rx="4.5" stroke="currentColor" strokeWidth="3" />
      )}
      {shape === 'leaf' && (
        <path
          d="M 14 3 L 25 3 L 25 14 A 11 11 0 0 1 14 25 L 3 25 L 3 14 A 11 11 0 0 1 14 3 Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}
      {shape === 'outer-smooth' && (
        <path
          d="M 12 3 L 16 3 A 10 10 0 0 1 25 12 L 25 25 L 12 25 A 10 10 0 0 1 3 16 L 3 12 A 10 10 0 0 1 12 3 Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}
      {shape === 'cut-corner' && (
        <polygon
          points="9,3 19,3 25,9 25,19 19,25 9,25 3,19 3,9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}
      {shape === 'hexagon' && (
        <polygon
          points="14,3 24.5,9 24.5,19 14,25 3.5,19 3.5,9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}
      {shape === 'star' && (
        <path
          d="M 14 3 Q 18 10 25 14 Q 18 18 14 25 Q 10 18 3 14 Q 10 10 14 3 Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}
      {shape === 'flower' && (
        <>
          <rect x="4" y="4" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="14" cy="5" r="3.5" fill="currentColor" />
          <circle cx="23" cy="14" r="3.5" fill="currentColor" />
          <circle cx="14" cy="23" r="3.5" fill="currentColor" />
          <circle cx="5" cy="14" r="3.5" fill="currentColor" />
        </>
      )}
    </svg>
  );
};

export const PUPIL_SHAPES: Array<{
  id: PupilStyle;
  label: string;
  desc: string;
}> = [
  { id: 'auto', label: 'Auto', desc: 'Match eye frame' },
  { id: 'square', label: 'Square', desc: 'Sharp 90° box' },
  { id: 'rounded', label: 'Rounded', desc: 'Soft squircle' },
  { id: 'circle', label: 'Circle', desc: 'Smooth dot' },
  { id: 'diamond', label: 'Diamond', desc: '45° Rhombus' },
  { id: 'leaf', label: 'Leaf', desc: 'Organic petal' },
  { id: 'droplet', label: 'Droplet', desc: 'Teardrop tip' },
  { id: 'star', label: 'Star', desc: '4-Point sparkle' },
  { id: 'heart', label: 'Heart', desc: 'Sweet heart' },
  { id: 'ring', label: 'Ring', desc: 'Target halo' },
  { id: 'hexagon', label: 'Hexagon', desc: '6-Sided geo' },
  { id: 'chamfer', label: 'Chamfer', desc: '45° Beveled' },
];

const PupilShapeIcon: React.FC<{
  shape: PupilStyle;
  eyeStyle: EyeStyle;
  className?: string;
}> = ({ shape, eyeStyle, className = 'w-6 h-6' }) => {
  const resolvedShape = resolvePupilShape(shape, eyeStyle);

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      {resolvedShape === 'square' && (
        <rect x="4.5" y="4.5" width="15" height="15" fill="currentColor" />
      )}
      {resolvedShape === 'rounded' && (
        <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" fill="currentColor" />
      )}
      {resolvedShape === 'circle' && (
        <circle cx="12" cy="12" r="7.5" fill="currentColor" />
      )}
      {resolvedShape === 'diamond' && (
        <polygon points="12,3.5 20.5,12 12,20.5 3.5,12" fill="currentColor" />
      )}
      {resolvedShape === 'chamfer' && (
        <polygon
          points="8,4.5 16,4.5 19.5,8 19.5,16 16,19.5 8,19.5 4.5,16 4.5,8"
          fill="currentColor"
        />
      )}
      {resolvedShape === 'leaf' && (
        <path
          d="M 12 3.5 L 20.5 3.5 L 20.5 12 A 8.5 8.5 0 0 1 12 20.5 L 3.5 20.5 L 3.5 12 A 8.5 8.5 0 0 1 12 3.5 Z"
          fill="currentColor"
        />
      )}
      {resolvedShape === 'droplet' && (
        <path
          d="M 4 4 L 13.5 4 A 7.5 7.5 0 0 1 21 11.5 L 21 13.5 A 7.5 7.5 0 0 1 13.5 21 L 11.5 21 A 7.5 7.5 0 0 1 4 13.5 Z"
          fill="currentColor"
        />
      )}
      {resolvedShape === 'star' && (
        <polygon
          points="12,3.5 14.5,9.5 20.5,12 14.5,14.5 12,20.5 9.5,14.5 3.5,12 9.5,9.5"
          fill="currentColor"
        />
      )}
      {resolvedShape === 'heart' && (
        <path
          d="M 12 20.2 C 5.5 15.2 4.2 10.2 7.2 6 C 9.5 3.2 12 5 12 6.5 C 12 5 14.5 3.2 16.8 6 C 19.8 10.2 18.5 15.2 12 20.2 Z"
          fill="currentColor"
        />
      )}
      {resolvedShape === 'ring' && (
        <path
          d="M 20.5 12 A 8.5 8.5 0 1 0 3.5 12 A 8.5 8.5 0 1 0 20.5 12 Z M 15.5 12 A 3.5 3.5 0 1 1 8.5 12 A 3.5 3.5 0 1 1 15.5 12 Z"
          fillRule="evenodd"
          fill="currentColor"
        />
      )}
      {resolvedShape === 'hexagon' && (
        <polygon
          points="12,3.5 19.4,7.7 19.4,16.3 12,20.5 4.6,16.3 4.6,7.7"
          fill="currentColor"
        />
      )}
    </svg>
  );
};

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  options,
  onChange,
  selectedType,
  activeTab: propActiveTab,
  onTabChange,
  selectedRandomizeTarget,
  selectedRandomizeType,
  onRandomizeTargetChange,
  onRandomizeTypeChange,
  lockedTargets,
  onLockedTargetsChange,
  onShowToast,
}) => {
  const [internalTab, setInternalTab] = useState<TabKey>('colors');
  const [internalRandTarget, setInternalRandTarget] = useState<RandomizeTarget>('all');
  const [internalRandType, setInternalRandType] = useState<RandomizeType>('both');
  const [activePaletteModal, setActivePaletteModal] = useState<{
    target: 'fgColor' | 'fgColorEnd' | 'bgColor' | 'eyeOuterColor' | 'eyeInnerColor';
    title: string;
    color: string;
  } | null>(null);

  const currentRandTarget = selectedRandomizeTarget ?? internalRandTarget;
  const currentRandType = selectedRandomizeType ?? internalRandType;
  const handleTargetChange = onRandomizeTargetChange ?? setInternalRandTarget;
  const handleTypeChange = onRandomizeTypeChange ?? setInternalRandType;

  const activeTab = propActiveTab ?? internalTab;
  const setActiveTab = (tab: TabKey) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const update = (partial: Partial<QrStyleOptions>) => {
    onChange({ ...options, ...partial });
  };

  const handleRandomizeAll = () => {
    const randomized = getRandomAllOptions(options, options.bgSaturationPreference || 'low');
    update(randomized);
  };

  const handleRandomizePattern = () => {
    const choices: PatternStyle[] = PATTERN_STYLES_LIST.map((i) => i.id);
    const filtered = choices.filter((p) => p !== options.patternStyle);
    const chosen = filtered[Math.floor(Math.random() * filtered.length)];
    if (chosen) update({ patternStyle: chosen });
  };

  const handleRandomizeEyeStyle = () => {
    const choices = EYE_STYLES.map((e) => e.id).filter((id) => id !== options.eyeStyle);
    const chosen = choices[Math.floor(Math.random() * choices.length)];
    if (chosen) update({ eyeStyle: chosen });
  };

  const swapColors = () => {
    update({
      fgColor: options.bgColor,
      bgColor: options.fgColor,
      transparentBg: false,
    });
  };

  const handleRandomizeBgAndPupil = () => {
    const { bgColor, pupilColor } = getRandomBgAndPupil(
      options.bgColor,
      options.eyeInnerColor,
      options.fgColor,
      options.bgSaturationPreference || 'low'
    );
    update({
      bgColor,
      eyeInnerColor: pupilColor,
      customEyeColors: true,
      transparentBg: false,
    });
  };

  const handleRandomizeBg = () => {
    const newBg = getRandomBg(
      options.bgColor,
      options.fgColor,
      options.bgSaturationPreference || 'low'
    );
    update({
      bgColor: newBg,
      transparentBg: false,
    });
  };

  const handleRandomizePupil = () => {
    const newPupil = getRandomPupil(options.bgColor, options.eyeInnerColor);
    update({
      eyeInnerColor: newPupil,
      customEyeColors: true,
    });
  };

  const handleRandomizePupilShape = () => {
    const choices = PUPIL_SHAPES.filter(
      (s) => s.id !== 'auto' && s.id !== (options.pupilStyle || 'auto')
    );
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    if (randomChoice) {
      update({ pupilStyle: randomChoice.id });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      update({
        logo: {
          ...options.logo,
          type: 'custom',
          customUrl: dataUrl,
        },
        // Recommend High error correction when logo is uploaded
        errorCorrection: options.errorCorrection === 'L' || options.errorCorrection === 'M' ? 'H' : options.errorCorrection,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      id="customization-panel"
      className="w-full bg-[#FDFCF9] dark:bg-zinc-900 rounded-2xl border border-[#EDE8DF] dark:border-zinc-800 shadow-xs transition-colors overflow-hidden scroll-mt-20"
    >
      {/* Category Tabs: Available on all viewports (mobile, tablet, desktop) */}
      <div className="p-1 sm:p-2 border-b border-[#EDE8DF] dark:border-zinc-800 bg-[#F8F6F0] dark:bg-zinc-950/40">
        <div className="grid grid-cols-5 gap-1">
          {[
            { id: 'colors', label: 'Colour', icon: Palette },
            { id: 'patterns', label: 'Pattern', icon: Shapes },
            { id: 'eyes', label: 'Eyes', icon: Eye },
            { id: 'logo', label: 'Logo', icon: ImageIcon },
            { id: 'quality', label: 'Quality', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-custom-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-1 sm:px-3 rounded-xl text-center transition-all focus:outline-none ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-[#0F172A] dark:text-amber-300 shadow-xs font-bold ring-1 ring-[#EDE8DF] dark:ring-zinc-700'
                    : 'text-[#64748B] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/40 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-[#E7AC08]' : ''}`} />
                <span className="text-[10px] sm:text-xs tracking-tight whitespace-nowrap">{tab.label}</span>
                {tab.id === 'logo' && options.logo.type !== 'none' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E7AC08] shrink-0 absolute top-1 right-1 sm:static" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Action Header with Smart Randomize Controller */}
      <div className="px-3.5 sm:px-5 py-2.5 bg-[#FAF8F5] dark:bg-zinc-900/50 border-b border-[#EDE8DF] dark:border-zinc-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-zinc-400 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-[#E7AC08] shrink-0" />
          <span className="font-semibold text-[#0F172A] dark:text-zinc-200 truncate">Customizer</span>
          <span className="hidden xs:inline">•</span>
          <span className="text-[11px] text-[#64748B] truncate hidden sm:inline">Fine-tune or roll designs</span>
        </div>
        <SmartRandomizeController
          options={options}
          onOptionsChange={update}
          onShowToast={(msg) => {
            if (onShowToast) onShowToast(msg);
          }}
          saturationPreference={options.bgSaturationPreference}
          selectedTarget={currentRandTarget}
          selectedType={currentRandType}
          onTargetChange={handleTargetChange}
          onTypeChange={handleTypeChange}
          lockedTargets={lockedTargets}
          onLockedTargetsChange={onLockedTargetsChange}
          idPrefix="panel-rand"
        />
      </div>

      <div className="p-3.5 sm:p-5">
        {/* TAB 1: COLORS */}
        {activeTab === 'colors' && (
          <div className="space-y-5">
            {/* Color Mode Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-2">
                Color Gradient Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['solid', 'linear-gradient', 'radial-gradient'] as ColorMode[]).map((mode) => (
                  <button
                    key={mode}
                    id={`color-mode-${mode}`}
                    type="button"
                    onClick={() => update({ colorMode: mode })}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                      options.colorMode === mode
                        ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 font-semibold ring-1 ring-[#E7AC08]/50 shadow-2xs'
                        : 'border-[#EDE8DF] dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/50 text-[#64748B] dark:text-zinc-400 hover:border-[#CBD5E1]'
                    }`}
                  >
                    {mode.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Foreground & Background Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Foreground */}
              <div className="p-3.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/30">
                <ColorPickerField
                  id="picker-fg-color"
                  label={options.colorMode === 'solid' ? 'QR Code Color' : 'Start Color'}
                  color={options.fgColor}
                  pickerTitle="QR Code Foreground Color"
                  onChange={(hex) => update({ fgColor: hex })}
                />
              </div>

              {/* End color if gradient, else Background color */}
              {options.colorMode !== 'solid' ? (
                <div className="p-3.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/30">
                  <ColorPickerField
                    id="picker-fg-end"
                    label="End Color"
                    color={options.fgColorEnd}
                    pickerTitle="Gradient End Color"
                    onChange={(hex) => update({ fgColorEnd: hex })}
                  />
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/30">
                  <ColorPickerField
                    id="picker-bg-color"
                    label="Background Color"
                    color={options.bgColor}
                    disabled={options.transparentBg}
                    disabledLabel="TRANSPARENT"
                    pickerTitle="QR Background Color"
                    extraAction={
                      <button
                        type="button"
                        id="btn-randomize-bg-inline"
                        onClick={handleRandomizeBg}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#B45309] dark:text-amber-400 hover:underline"
                        title="Randomize Background Color"
                      >
                        <Shuffle className="w-3 h-3" />
                        <span>Randomize</span>
                      </button>
                    }
                    onChange={(hex) => update({ bgColor: hex, transparentBg: false })}
                  />
                </div>
              )}
            </div>

            {/* Gradient Angle Slider (if linear gradient) */}
            {options.colorMode === 'linear-gradient' && (
              <div className="p-3.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-800/20">
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span>Gradient Angle</span>
                  <span className="font-mono text-[#64748B]">{options.gradientAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={options.gradientAngle}
                  onChange={(e) => update({ gradientAngle: Number(e.target.value) })}
                  className="w-full h-1.5 bg-[#EDE8DF] dark:bg-zinc-700 rounded-lg cursor-pointer accent-[#E7AC08]"
                />
              </div>
            )}

            {/* Background Settings, Randomize & Swap */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
              <div className="flex items-center gap-2">
                <input
                  id="checkbox-transparent-bg"
                  type="checkbox"
                  checked={options.transparentBg}
                  onChange={(e) => update({ transparentBg: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[#E7AC08] border-[#CBD5E1] focus:ring-[#E7AC08] accent-[#E7AC08]"
                />
                <label
                  htmlFor="checkbox-transparent-bg"
                  className="text-xs font-medium text-[#334155] dark:text-zinc-300 cursor-pointer"
                >
                  Transparent Background
                </label>
              </div>

              <button
                type="button"
                id="btn-swap-colors"
                onClick={swapColors}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 text-xs font-medium text-[#334155] dark:text-zinc-300 hover:bg-[#F8F6F0] dark:hover:bg-zinc-800 transition-colors"
                title="Swap foreground and background colors"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Swap Colors</span>
              </button>
            </div>

            {/* Curated Color Swatches & Presets (28 Combos matching reference) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#FAF8F5] dark:bg-zinc-800 text-[#0F172A] dark:text-zinc-200">
                    <Palette className="w-4 h-4 text-[#E7AC08]" />
                  </div>
                  <span className="text-xs font-bold tracking-wider uppercase text-[#0F172A] dark:text-zinc-100">
                    Presets
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#EDE8DF] dark:bg-zinc-800 text-[#334155] dark:text-zinc-300 border border-[#CBD5E1]/60 dark:border-zinc-700">
                  {PRESET_COLOR_COMBOS.length}
                </span>
              </div>

              {/* 6-Column Grid of 28 Rounded Swatches with centered dots */}
              <div className="grid grid-cols-6 gap-2 sm:gap-2.5 p-3 rounded-2xl bg-[#FAF8F5] dark:bg-zinc-900/60 border border-[#EDE8DF] dark:border-zinc-800">
                {PRESET_COLOR_COMBOS.map((combo, idx) => {
                  const isSelected =
                    options.bgColor.toUpperCase() === combo.outer.toUpperCase() &&
                    options.fgColor.toUpperCase() === combo.inner.toUpperCase();

                  return (
                    <button
                      key={combo.id}
                      id={`preset-color-${idx}`}
                      type="button"
                      title={`${combo.name} (BG: ${combo.outer}, FG: ${combo.inner})`}
                      onClick={() =>
                        update({
                          bgColor: combo.outer,
                          fgColor: combo.inner,
                          fgColorEnd: combo.inner,
                          eyeOuterColor: combo.inner,
                          eyeInnerColor: combo.inner,
                          customEyeColors: true,
                          transparentBg: false,
                          colorMode: 'solid',
                        })
                      }
                      className={`group relative flex flex-col items-center justify-center aspect-square rounded-2xl transition-all hover:scale-105 active:scale-95 border ${
                        isSelected
                          ? 'border-[#E7AC08] ring-2 ring-[#E7AC08] ring-offset-2 dark:ring-offset-zinc-900 shadow-xs'
                          : 'border-black/10 dark:border-white/10 hover:border-black/20'
                      }`}
                      style={{ backgroundColor: combo.outer }}
                    >
                      <div
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md shadow-2xs transition-transform group-hover:scale-110"
                        style={{ backgroundColor: combo.inner }}
                      />
                      {isSelected && (
                        <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#E7AC08]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 4 Quick Custom Swatch Buttons: Custom FG (default black), Custom BG, Eye, Pupil */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {/* Custom FG */}
                <button
                  type="button"
                  id="btn-quick-custom-fg"
                  onClick={() =>
                    setActivePaletteModal({
                      target: 'fgColor',
                      title: 'Custom Foreground Color',
                      color: options.fgColor || '#000000',
                    })
                  }
                  className="flex items-center gap-2 p-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#CBD5E1] dark:hover:border-zinc-700 text-xs font-semibold text-[#0F172A] dark:text-zinc-200 transition-all shadow-2xs hover:scale-[1.02] active:scale-98"
                >
                  <div
                    className="w-5 h-5 rounded-full border border-black/15 shadow-2xs shrink-0"
                    style={{ backgroundColor: options.fgColor || '#000000' }}
                  />
                  <span className="truncate">Custom FG</span>
                </button>

                {/* Custom BG with inline Randomize button */}
                <div className="flex items-center justify-between p-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#CBD5E1] dark:hover:border-zinc-700 text-xs font-semibold text-[#0F172A] dark:text-zinc-200 transition-colors shadow-2xs">
                  <button
                    type="button"
                    id="btn-quick-custom-bg"
                    onClick={() =>
                      setActivePaletteModal({
                        target: 'bgColor',
                        title: 'Custom Background Color',
                        color: options.bgColor || '#FFFFFF',
                      })
                    }
                    className="flex items-center gap-2 min-w-0 flex-1 text-left"
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-black/15 shadow-2xs shrink-0"
                      style={{ backgroundColor: options.transparentBg ? '#EDE8DF' : options.bgColor }}
                    />
                    <span className="truncate">Custom BG</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRandomizeBg}
                    title="Randomize Background Color"
                    className="p-1 rounded-md text-[#64748B] hover:text-[#B45309] dark:hover:text-amber-400 hover:bg-[#F8F6F0] dark:hover:bg-zinc-800 transition-colors shrink-0"
                  >
                    <Shuffle className="w-3 h-3" />
                  </button>
                </div>

                {/* Eye */}
                <button
                  type="button"
                  id="btn-quick-custom-eye"
                  onClick={() =>
                    setActivePaletteModal({
                      target: 'eyeOuterColor',
                      title: 'Outer Eye Ring Color',
                      color: options.eyeOuterColor || options.fgColor || '#000000',
                    })
                  }
                  className="flex items-center gap-2 p-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#CBD5E1] dark:hover:border-zinc-700 text-xs font-semibold text-[#0F172A] dark:text-zinc-200 transition-all shadow-2xs hover:scale-[1.02] active:scale-98"
                >
                  <div
                    className="w-5 h-5 rounded-full border border-black/15 shadow-2xs shrink-0"
                    style={{ backgroundColor: options.eyeOuterColor || options.fgColor || '#000000' }}
                  />
                  <span className="truncate">Eye</span>
                </button>

                {/* Pupil with inline Randomize button */}
                <div className="flex items-center justify-between p-2 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#CBD5E1] dark:hover:border-zinc-700 text-xs font-semibold text-[#0F172A] dark:text-zinc-200 transition-colors shadow-2xs">
                  <button
                    type="button"
                    id="btn-quick-custom-pupil"
                    onClick={() =>
                      setActivePaletteModal({
                        target: 'eyeInnerColor',
                        title: 'Inner Pupil Color',
                        color: options.eyeInnerColor || options.fgColor || '#000000',
                      })
                    }
                    className="flex items-center gap-2 min-w-0 flex-1 text-left"
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-black/15 shadow-2xs shrink-0"
                      style={{ backgroundColor: options.eyeInnerColor || options.fgColor || '#000000' }}
                    />
                    <span className="truncate">Pupil</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRandomizePupil}
                    title="Randomize Pupil Color"
                    className="p-1 rounded-md text-[#64748B] hover:text-[#B45309] dark:hover:text-amber-400 hover:bg-[#F8F6F0] dark:hover:bg-zinc-800 transition-colors shrink-0"
                  >
                    <Shuffle className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Readability contrast notice */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#FFFBEA] dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-[#92400E] dark:text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#E7AC08]" />
              <div>
                <span className="font-semibold block">Contrast Rule</span>
                Keep strong contrast between the QR code and background for reliable scanning on every mobile device.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PATTERNS */}
        {activeTab === 'patterns' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300">
                    Module Pixel Style
                  </label>
                  <p className="text-[11px] text-[#64748B] dark:text-zinc-400">
                    Choose distinctive geometric shapes for your QR code pixel matrix
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-zinc-400 capitalize hidden sm:inline">
                    {options.patternStyle === 'dots' ? 'Circle' : options.patternStyle.replace('-', ' ')}
                  </span>
                  <button
                    type="button"
                    onClick={handleRandomizePattern}
                    title="Pick random module pattern"
                    className="flex items-center gap-1.5 text-[11px] font-medium text-[#334155] hover:text-[#0F172A] dark:text-zinc-300 dark:hover:text-amber-300 px-2.5 py-1 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xs hover:bg-[#FAF8F5] transition-colors"
                  >
                    <Dices className="w-3.5 h-3.5 text-[#E7AC08]" />
                    <span>Random Pattern</span>
                  </button>
                </div>
              </div>

              {/* Pattern Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {PATTERN_STYLES_LIST.map((item) => {
                  const isSelected =
                    options.patternStyle === item.id ||
                    (item.id === 'circle' && options.patternStyle === 'dots');
                  return (
                    <button
                      key={item.id}
                      id={`pattern-${item.id}`}
                      type="button"
                      onClick={() => update({ patternStyle: item.id as PatternStyle })}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 ring-1 ring-[#E7AC08]/50 shadow-2xs'
                          : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/60 text-[#334155] dark:text-zinc-300 hover:border-[#CBD5E1]'
                      }`}
                    >
                      <PixelShapePreview styleId={item.id} />
                      <span className="text-xs font-bold leading-tight mb-0.5">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-[#64748B] dark:text-zinc-500 leading-tight">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QR Code Corner Selection (Sharp Corners vs Smooth Corners) */}
            <div className="pt-4 border-t border-[#EDE8DF] dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300">
                    QR Code Corners
                  </label>
                  <p className="text-[11px] text-[#64748B] dark:text-zinc-400">
                    Choose whether the overall QR code canvas has sharp or smooth outer corners
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-[#B45309] dark:text-amber-400 capitalize">
                  {options.cornerStyle === 'smooth' ? 'Smooth corners' : 'Sharp corners'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Sharp Corners */}
                <button
                  id="corner-style-sharp"
                  type="button"
                  onClick={() => update({ cornerStyle: 'sharp' })}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                    options.cornerStyle === 'sharp'
                      ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 ring-1 ring-[#E7AC08]/50 shadow-2xs'
                      : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/30 text-[#334155] dark:text-zinc-300 hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="w-10 h-10 shrink-0 bg-[#FAF8F5] dark:bg-zinc-900 rounded-none border-2 border-[#0F172A] dark:border-zinc-300 flex items-center justify-center shadow-2xs">
                    <div className="w-4 h-4 bg-[#E7AC08] rounded-none" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">
                      Sharp Corners
                    </span>
                    <span className="text-[11px] text-[#64748B] dark:text-zinc-400">
                      Classic 90° square boundary
                    </span>
                  </div>
                </button>

                {/* Smooth Corners */}
                <button
                  id="corner-style-smooth"
                  type="button"
                  onClick={() => update({ cornerStyle: 'smooth' })}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                    options.cornerStyle === 'smooth'
                      ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 ring-1 ring-[#E7AC08]/50 shadow-2xs'
                      : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/30 text-[#334155] dark:text-zinc-300 hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="w-10 h-10 shrink-0 bg-[#FAF8F5] dark:bg-zinc-900 rounded-2xl border-2 border-[#0F172A] dark:border-zinc-300 flex items-center justify-center shadow-2xs">
                    <div className="w-4 h-4 bg-[#E7AC08] rounded-full" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">
                      Smooth Corners
                    </span>
                    <span className="text-[11px] text-[#64748B] dark:text-zinc-400">
                      Modern rounded curved boundary
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EYES */}
        {activeTab === 'eyes' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300">
                    Corner Finder Pattern (Eye Frame) Style
                  </label>
                  <p className="text-[11px] text-[#64748B] dark:text-zinc-400">
                    Select the outer contour shape of the 3 positioning corner finders
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#B45309] dark:text-amber-400 capitalize hidden sm:inline">
                    {options.eyeStyle}
                  </span>
                  <button
                    type="button"
                    onClick={handleRandomizeEyeStyle}
                    title="Pick random eye frame style"
                    className="flex items-center gap-1.5 text-[11px] font-medium text-[#334155] hover:text-[#0F172A] dark:text-zinc-300 dark:hover:text-amber-300 px-2.5 py-1 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xs hover:bg-[#FAF8F5] transition-colors"
                  >
                    <Dices className="w-3.5 h-3.5 text-[#E7AC08]" />
                    <span>Random Frame</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {EYE_STYLES.map((eye) => {
                  const isSelected = options.eyeStyle === eye.id;
                  return (
                    <button
                      key={eye.id}
                      id={`eye-style-${eye.id}`}
                      type="button"
                      onClick={() => update({ eyeStyle: eye.id as EyeStyle })}
                      className={`group flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 ring-1 ring-[#E7AC08]/50 shadow-2xs'
                          : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/30 text-[#334155] dark:text-zinc-300 hover:border-[#CBD5E1] dark:hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 mb-2 flex items-center justify-center rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-[#E7AC08] text-[#0F172A] border-[#E7AC08] shadow-2xs'
                            : 'bg-[#FAF8F5] dark:bg-zinc-900 text-[#0F172A] border-[#EDE8DF] dark:border-zinc-700 group-hover:border-[#E7AC08]/50 dark:group-hover:border-amber-800'
                        }`}
                      >
                        <EyeShapeIcon shape={eye.id} className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold leading-tight truncate w-full">
                        {eye.label}
                      </span>
                      <span className="text-[10px] text-[#64748B] dark:text-zinc-500 block truncate w-full mt-0.5">
                        {eye.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pupil Shapes (Inner Eye) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300">
                    Inner Eye Pupil Shape
                  </label>
                  <p className="text-[11px] text-[#64748B] dark:text-zinc-400">
                    Choose the geometry of the inner core in each finder pattern
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#B45309] dark:text-amber-400 capitalize hidden sm:inline">
                    {options.pupilStyle && options.pupilStyle !== 'auto'
                      ? options.pupilStyle
                      : `Auto (${options.eyeStyle})`}
                  </span>
                  <button
                    type="button"
                    onClick={handleRandomizePupilShape}
                    title="Pick random pupil shape"
                    className="flex items-center gap-1.5 text-[11px] font-medium text-[#334155] hover:text-[#0F172A] dark:text-zinc-300 dark:hover:text-amber-300 px-2.5 py-1 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xs hover:bg-[#FAF8F5] transition-colors"
                  >
                    <Dices className="w-3.5 h-3.5 text-[#E7AC08]" />
                    <span>Random Shape</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {PUPIL_SHAPES.map((pupil) => {
                  const isSelected = (options.pupilStyle || 'auto') === pupil.id;
                  return (
                    <button
                      key={pupil.id}
                      id={`pupil-shape-${pupil.id}`}
                      type="button"
                      onClick={() => update({ pupilStyle: pupil.id })}
                      className={`group flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 ring-1 ring-[#E7AC08]/50 shadow-2xs'
                          : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/30 text-[#334155] dark:text-zinc-300 hover:border-[#CBD5E1] dark:hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-[#E7AC08] text-[#0F172A] border-[#E7AC08] shadow-2xs'
                            : 'bg-[#FAF8F5] dark:bg-zinc-900 text-[#0F172A] dark:text-zinc-300 border-[#EDE8DF] dark:border-zinc-700 group-hover:text-[#B45309] group-hover:border-[#E7AC08]/40 dark:group-hover:border-amber-900'
                        }`}
                      >
                        <PupilShapeIcon
                          shape={pupil.id}
                          eyeStyle={options.eyeStyle}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold block leading-tight truncate">
                          {pupil.label}
                        </span>
                        <span className="text-[10px] text-[#64748B] dark:text-zinc-500 block truncate">
                          {pupil.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Eye Colors */}
            <div className="p-4 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-800/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-[#0F172A] dark:text-zinc-200">
                    Independent Eye Colors
                  </label>
                  <p className="text-[11px] text-[#64748B]">
                    Customize the outer finder ring and inner pupil separately.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="checkbox-custom-eye-colors"
                  checked={options.customEyeColors}
                  onChange={(e) => update({ customEyeColors: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[#E7AC08] border-[#CBD5E1] focus:ring-[#E7AC08] accent-[#E7AC08]"
                />
              </div>

              {options.customEyeColors && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <ColorPickerField
                    id="picker-eye-outer"
                    label="Outer Eye Ring Color"
                    color={options.eyeOuterColor || options.fgColor || '#000000'}
                    pickerTitle="Outer Eye Ring Color"
                    onChange={(hex) => update({ eyeOuterColor: hex, customEyeColors: true })}
                    size="sm"
                  />

                  <ColorPickerField
                    id="picker-eye-inner"
                    label="Inner Eye Pupil Color"
                    color={options.eyeInnerColor || options.fgColor || '#000000'}
                    pickerTitle="Inner Eye Pupil Color"
                    extraAction={
                      <button
                        type="button"
                        onClick={handleRandomizePupil}
                        className="flex items-center gap-1 text-[10px] font-semibold text-[#B45309] dark:text-amber-400 hover:underline"
                        title="Randomize Pupil Color"
                      >
                        <Shuffle className="w-3 h-3" />
                        <span>Randomize</span>
                      </button>
                    }
                    onChange={(hex) => update({ eyeInnerColor: hex, customEyeColors: true })}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CENTER LOGO */}
        {activeTab === 'logo' && (
          <div className="space-y-5">
            {/* Auto-adaptation Toggle Banner (Refined Light Theme Visual Readiness) */}
            <div
              className={`p-4 rounded-2xl transition-all duration-200 border flex items-center justify-between gap-3.5 shadow-2xs ${
                Boolean(options.logo.autoAdapt)
                  ? 'border-amber-300/90 dark:border-amber-700/60 bg-gradient-to-r from-amber-50/95 via-[#FFFDF7] to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/20 ring-1 ring-amber-300/30 shadow-xs'
                  : 'border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    Boolean(options.logo.autoAdapt)
                      ? 'bg-[#E7AC08] text-white shadow-2xs'
                      : 'bg-[#EDE8DF] dark:bg-zinc-800 text-[#64748B] dark:text-zinc-400'
                  }`}
                >
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-zinc-100 tracking-tight">
                      Auto-adapt Icon to Category
                    </span>
                    {Boolean(options.logo.autoAdapt) && selectedType ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100/90 dark:bg-amber-900/50 text-[#92400E] dark:text-amber-200 border border-amber-200/80 dark:border-amber-700/50 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E7AC08] animate-pulse" />
                        Active: {selectedType}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#EDE8DF]/80 dark:bg-zinc-800 text-[#64748B] dark:text-zinc-400">
                        Manual Mode
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#475569] dark:text-zinc-400 mt-1 leading-relaxed">
                    Automatically pairs the center icon with your chosen QR category (e.g. Location, Wi-Fi, WhatsApp, Phone, UPI, URL).
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                id="toggle-auto-adapt-logo"
                role="switch"
                aria-checked={Boolean(options.logo.autoAdapt)}
                onClick={() => {
                  const nextVal = !options.logo.autoAdapt;
                  try {
                    localStorage.setItem('ehsaan_qr_auto_adapt_logo', String(nextVal));
                  } catch {
                    // ignore
                  }

                  if (nextVal) {
                    const autoLogo = selectedType ? getAutoLogoForCategory(selectedType) : 'none';
                    update({
                      logo: {
                        ...options.logo,
                        autoAdapt: true,
                        type: autoLogo,
                      },
                      errorCorrection:
                        autoLogo !== 'none' && (options.errorCorrection === 'L' || options.errorCorrection === 'M')
                          ? 'Q'
                          : options.errorCorrection,
                    });
                    onShowToast?.(
                      selectedType
                        ? `Auto-adapt enabled: set to ${selectedType.toUpperCase()} icon ✓`
                        : 'Auto-adapt enabled ✓'
                    );
                  } else {
                    update({
                      logo: {
                        ...options.logo,
                        autoAdapt: false,
                      },
                    });
                    onShowToast?.('Auto-adapt disabled: manual icon mode');
                  }
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/50 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
                  Boolean(options.logo.autoAdapt)
                    ? 'bg-[#E7AC08]'
                    : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
                title={
                  Boolean(options.logo.autoAdapt)
                    ? 'Click to disable auto-adaptation'
                    : 'Click to enable auto-adaptation'
                }
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    Boolean(options.logo.autoAdapt) ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#0F172A] dark:text-zinc-300">
                  Center Logo Asset
                </label>
                {Boolean(options.logo.autoAdapt) && (
                  <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-900/40 px-2 py-0.5 rounded">
                    Category Auto-Sync Enabled
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {/* None */}
                <button
                  type="button"
                  id="logo-type-none"
                  onClick={() => update({ logo: { ...options.logo, type: 'none' } })}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    options.logo.type === 'none'
                      ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 ring-1 ring-[#E7AC08]/50 shadow-2xs'
                      : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/60 hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg p-1.5 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[#64748B] dark:text-zinc-400 shrink-0 border border-zinc-200/70 dark:border-zinc-700/70">
                    <X className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">No Logo</span>
                    <span className="text-[10px] text-[#64748B] dark:text-zinc-500 block truncate">Clean matrix</span>
                  </div>
                </button>

                {/* Dedicated Monochrome Preset Logos */}
                {[
                  { id: 'url' as LogoType, label: 'URL', sub: 'Website', dataUrl: URL_LOGO_DATA_URL },
                  { id: 'phone' as LogoType, label: 'Phone', sub: 'Handset', dataUrl: PHONE_LOGO_DATA_URL },
                  { id: 'whatsapp' as LogoType, label: 'WhatsApp', sub: 'Chat', dataUrl: WHATSAPP_LOGO_DATA_URL },
                  { id: 'wifi' as LogoType, label: 'Wi-Fi', sub: 'Network', dataUrl: WIFI_LOGO_DATA_URL },
                  { id: 'email' as LogoType, label: 'Email', sub: 'Mailbox', dataUrl: EMAIL_LOGO_DATA_URL },
                  { id: 'upi' as LogoType, label: 'UPI', sub: 'Fast pay', dataUrl: UPI_LOGO_DATA_URL },
                  { id: 'payment' as LogoType, label: 'Payment', sub: 'Card / POS', dataUrl: PAYMENT_LOGO_DATA_URL },
                  { id: 'text' as LogoType, label: 'Text', sub: 'Plain text', dataUrl: TEXT_LOGO_DATA_URL },
                  { id: 'sms' as LogoType, label: 'SMS', sub: 'Message', dataUrl: SMS_LOGO_DATA_URL },
                  { id: 'calendar' as LogoType, label: 'Calendar', sub: 'Schedule', dataUrl: CALENDAR_LOGO_DATA_URL },
                  { id: 'vcard' as LogoType, label: 'Contact', sub: 'vCard', dataUrl: VCARD_LOGO_DATA_URL },
                  { id: 'location' as LogoType, label: 'Location', sub: 'Address pin', dataUrl: LOCATION_LOGO_DATA_URL },
                ].map((item) => {
                  const isSelected = options.logo.type === item.id;
                  const isAutoTarget =
                    Boolean(options.logo.autoAdapt) &&
                    selectedType &&
                    getAutoLogoForCategory(selectedType) === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`logo-type-${item.id}`}
                      onClick={() => {
                        update({
                          logo: { ...options.logo, type: item.id },
                          errorCorrection:
                            options.errorCorrection === 'L' || options.errorCorrection === 'M'
                              ? 'H'
                              : options.errorCorrection,
                        });
                      }}
                      className={`relative flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 ring-1 ring-[#E7AC08]/50 shadow-2xs'
                          : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/60 hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg p-1.5 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden border border-zinc-200/70 dark:border-zinc-700/70">
                        <img
                          src={item.dataUrl}
                          alt={item.label}
                          className="w-full h-full object-contain dark:invert"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold block truncate">{item.label}</span>
                          {isAutoTarget && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E7AC08] shrink-0" title="Category Match" />
                          )}
                        </div>
                        <span className="text-[10px] text-[#64748B] dark:text-zinc-500 block truncate">{item.sub}</span>
                      </div>
                    </button>
                  );
                })}

                {/* Custom Upload */}
                <button
                  type="button"
                  id="logo-type-custom"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    options.logo.type === 'custom'
                      ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 ring-1 ring-[#E7AC08]/50 shadow-2xs'
                      : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/60 hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg p-1.5 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden border border-zinc-200/70 dark:border-zinc-700/70 text-[#64748B] dark:text-zinc-300">
                    {options.logo.type === 'custom' && options.logo.customUrl ? (
                      <img
                        src={options.logo.customUrl}
                        alt="Logo"
                        className="w-full h-full object-contain rounded"
                      />
                    ) : (
                      <Upload className="w-4 h-4" strokeWidth={1.8} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">
                      {options.logo.type === 'custom' ? 'Uploaded' : 'Upload'}
                    </span>
                    <span className="text-[10px] text-[#64748B] dark:text-zinc-500 block truncate">PNG, SVG</span>
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Logo Settings */}
            {options.logo.type !== 'none' && (
              <div className="space-y-4 p-4 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-800/20">
                {/* Logo Size Ratio */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-[#334155] dark:text-zinc-300">Logo Size</span>
                    <span className="font-mono text-[#64748B]">
                      {Math.round(options.logo.sizeRatio * 100)}% of QR
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.14"
                    max="0.30"
                    step="0.02"
                    value={options.logo.sizeRatio}
                    onChange={(e) =>
                      update({
                        logo: { ...options.logo, sizeRatio: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-1.5 bg-[#EDE8DF] dark:bg-zinc-700 rounded-lg cursor-pointer accent-[#E7AC08]"
                  />
                  <span className="text-[10px] text-[#64748B] mt-1 block">
                    Recommended: 20-24% to maintain effortless scan reliability.
                  </span>
                </div>

                {/* Logo Padding */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-[#334155] dark:text-zinc-300">Background Badge Padding</span>
                    <span className="font-mono text-[#64748B]">
                      {options.logo.padding} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    step="1"
                    value={options.logo.padding}
                    onChange={(e) =>
                      update({
                        logo: { ...options.logo, padding: parseInt(e.target.value, 10) },
                      })
                    }
                    className="w-full h-1.5 bg-[#EDE8DF] dark:bg-zinc-700 rounded-lg cursor-pointer accent-[#E7AC08]"
                  />
                </div>

                {/* Logo Background badge color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#334155] dark:text-zinc-400 mb-1">
                      Logo Badge Background
                    </label>
                    <select
                      value={options.logo.background}
                      onChange={(e) =>
                        update({
                          logo: {
                            ...options.logo,
                            background: e.target.value as 'white' | 'match' | 'custom' | 'transparent',
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-[#0F172A] dark:text-zinc-100"
                    >
                      <option value="white">White Shield</option>
                      <option value="match">Match QR Background</option>
                      <option value="custom">Custom Color</option>
                      <option value="transparent">Transparent (None)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#334155] dark:text-zinc-400 mb-1">
                      Badge Corner Radius
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={options.logo.borderRadius}
                        onChange={(e) =>
                          update({
                            logo: {
                              ...options.logo,
                              borderRadius: parseInt(e.target.value, 10),
                            },
                          })
                        }
                        className="w-full h-1.5 bg-[#EDE8DF] dark:bg-zinc-700 rounded-lg cursor-pointer accent-[#E7AC08]"
                      />
                      <span className="text-xs font-mono text-[#64748B] shrink-0">
                        {options.logo.borderRadius}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Auto Error Correction advice */}
                <div className="p-3 rounded-lg bg-[#FFFBEA] dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-[#92400E] dark:text-amber-300 text-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#E7AC08]" />
                  <div>
                    <span className="font-semibold">Auto Error Correction Boost:</span> Center logos obscure QR modules. Error correction has been set to <strong>High ({options.errorCorrection})</strong> so scanners seamlessly recover 30% of covered pixels.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SIZE & QUALITY */}
        {activeTab === 'quality' && (
          <div className="space-y-5">
            {/* Resolution */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-2">
                Output Canvas Size (Resolution)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[256, 512, 1024, 2048].map((s) => (
                  <button
                    key={s}
                    id={`size-btn-${s}`}
                    type="button"
                    onClick={() => update({ size: s })}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      options.size === s
                        ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 font-bold ring-1 ring-[#E7AC08]/50 shadow-2xs'
                        : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/30 text-[#334155] dark:text-zinc-300 hover:border-[#CBD5E1]'
                    }`}
                  >
                    <span className="block font-bold">{s} × {s} px</span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">
                      {s === 256 && 'Web Thumbnail'}
                      {s === 512 && 'Standard Display'}
                      {s === 1024 && 'High Res Print'}
                      {s === 2048 && 'Ultra Poster 4K'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Margin / Quiet Zone */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="text-[#334155] dark:text-zinc-300">Margin / Quiet Zone (Modules)</span>
                <span className="font-mono text-[#64748B]">{options.margin} modules</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[
                  { m: 1, label: 'Small (1)' },
                  { m: 2, label: 'Medium (2)' },
                  { m: 4, label: 'Large (4)' },
                  { m: 6, label: 'Extra (6)' },
                ].map((item) => (
                  <button
                    key={item.m}
                    type="button"
                    onClick={() => update({ margin: item.m })}
                    className={`py-1.5 rounded-lg border text-xs transition-all ${
                      options.margin === item.m
                        ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 font-semibold ring-1 ring-[#E7AC08]/50 shadow-2xs'
                        : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/30 text-[#64748B] dark:text-zinc-400 hover:border-[#CBD5E1]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-zinc-400">
                A quiet zone of 2–4 modules helps camera lenses isolate the QR from surrounding page artwork.
              </p>
            </div>

            {/* Error Correction Level */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-zinc-300 mb-2">
                Error Correction Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    level: 'L' as ErrorCorrectionLevel,
                    name: 'Low (L)',
                    pct: '~7% recovery',
                    desc: 'Produces smallest, simplest matrix. Best for clean digital screens.',
                  },
                  {
                    level: 'M' as ErrorCorrectionLevel,
                    name: 'Medium (M)',
                    pct: '~15% recovery',
                    desc: 'Standard commercial balance of matrix density and reliability.',
                  },
                  {
                    level: 'Q' as ErrorCorrectionLevel,
                    name: 'Quartile (Q)',
                    pct: '~25% recovery',
                    desc: 'High resilience for merchandise packaging or subtle center logos.',
                  },
                  {
                    level: 'H' as ErrorCorrectionLevel,
                    name: 'High (H)',
                    pct: '~30% recovery',
                    desc: 'Best when inserting logos or when printed QR may face physical wear.',
                  },
                ].map((item) => {
                  const isSelected = options.errorCorrection === item.level;
                  return (
                    <button
                      key={item.level}
                      id={`ec-${item.level}`}
                      type="button"
                      onClick={() => update({ errorCorrection: item.level })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-200 ring-1 ring-[#E7AC08]/50 shadow-2xs'
                          : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-800/30 text-[#334155] dark:text-zinc-300 hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#0F172A] dark:text-zinc-100">{item.name}</span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-sm bg-[#EDE8DF] dark:bg-zinc-700 text-[#334155] dark:text-zinc-300">
                          {item.pct}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#64748B] dark:text-zinc-400 leading-tight block">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Direct Color Palette Selector Modal for Quick Swatches or Mobile triggers */}
      {activePaletteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setActivePaletteModal(null)}
        >
          <div
            className="w-full max-w-[320px] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <ColorPalettePicker
              color={activePaletteModal.color}
              onChange={(newHex) => {
                if (activePaletteModal.target === 'fgColor') {
                  update({ fgColor: newHex });
                } else if (activePaletteModal.target === 'fgColorEnd') {
                  update({ fgColorEnd: newHex });
                } else if (activePaletteModal.target === 'bgColor') {
                  update({ bgColor: newHex, transparentBg: false });
                } else if (activePaletteModal.target === 'eyeOuterColor') {
                  update({ eyeOuterColor: newHex, customEyeColors: true });
                } else if (activePaletteModal.target === 'eyeInnerColor') {
                  update({ eyeInnerColor: newHex, customEyeColors: true });
                }
                setActivePaletteModal((prev) => (prev ? { ...prev, color: newHex } : null));
              }}
              onClose={() => setActivePaletteModal(null)}
              title={activePaletteModal.title}
              className="mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

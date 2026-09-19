import React, { useState } from 'react';
import {
  X,
  Palette,
  Sparkles,
  Contact,
  Calendar,
  MapPin,
  Activity,
  Image as ImageIcon,
  Check,
  Lock,
  Mail,
  ArrowRight,
  Coins,
  ShieldCheck,
  Contrast,
  Sun,
  Moon,
  CheckCircle2,
  ExternalLink,
  Crown,
  FileCode,
} from 'lucide-react';
import { ExclusiveCrownBadge } from './ExclusiveCrownBadge';
import { AppTheme } from '../types';
import { useExclusiveAccess } from '../context/ExclusiveAccessContext';

interface PremiumFeaturesOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  onOpenCodeInput: () => void;
  onShowToast?: (msg: string) => void;
}

interface FeatureItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  category: string;
}

const EXCLUSIVE_FEATURES: FeatureItem[] = [
  {
    id: 'theme_options',
    icon: Palette,
    title: 'Theme Options',
    desc: 'Unrestricted real-time switching between all 4 handcrafted themes.',
    category: 'Interface',
  },
  {
    id: 'icon_auto_adapt',
    icon: Sparkles,
    title: 'Icon Auto Adapt',
    desc: 'Intelligent category emblem auto-placement with optical sizing.',
    category: 'Customization',
  },
  {
    id: 'vcard_category',
    icon: Contact,
    title: 'vCard QR Category',
    desc: 'Professional contact business card with instant one-tap phone saving.',
    category: 'QR Types',
  },
  {
    id: 'calendar_category',
    icon: Calendar,
    title: 'Calendar Event QR',
    desc: 'Full calendar schedule invite with venue, start/end time, and alarms.',
    category: 'QR Types',
  },
  {
    id: 'location_category',
    icon: MapPin,
    title: 'Location Pin QR',
    desc: 'Precise GPS geo-coordinates & Google Maps navigation generator.',
    category: 'QR Types',
  },
  {
    id: 'qr_intelligence',
    icon: Activity,
    title: 'QR Intelligence Analytics',
    desc: '7-zone local contrast heatmaps and geometry scanning diagnostics.',
    category: 'Analytics',
  },
  {
    id: '2048_quality',
    icon: ImageIcon,
    title: '2048 × 2048 Pixel Quality',
    desc: 'Lossless Ultra-HD vector & raster rendering for large-format billboard print.',
    category: 'Export',
  },
  {
    id: 'svg_vector_export',
    icon: FileCode,
    title: 'SVG Vector Format Export',
    desc: 'Scalable infinite-resolution vector graphics for precision print, signage, and design assets.',
    category: 'Export',
  },
];

const THEME_CARDS: {
  id: AppTheme;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  previewBg: string;
  previewBorder: string;
  textColor: string;
}[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Black & White Light',
    icon: Contrast,
    previewBg: '#FFFFFF',
    previewBorder: '#E4E4E7',
    textColor: '#18181B',
  },
  {
    id: 'light',
    name: 'Light',
    desc: 'Amber Cream Slate',
    icon: Sun,
    previewBg: '#FAF8F5',
    previewBorder: '#FDE68A',
    textColor: '#0F172A',
  },
  {
    id: 'dark',
    name: 'Dark',
    desc: 'Obsidian & Gold Slate',
    icon: Moon,
    previewBg: '#111318',
    previewBorder: '#3F3F46',
    textColor: '#F4F4F5',
  },
  {
    id: 'material',
    name: 'Material',
    desc: 'Indigo & Teal Dynamic',
    icon: Sparkles,
    previewBg: '#F8FAFC',
    previewBorder: '#C7D2FE',
    textColor: '#0F172A',
  },
];

export const PremiumFeaturesOverviewModal: React.FC<PremiumFeaturesOverviewModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  onOpenCodeInput,
  onShowToast,
}) => {
  const { isUnlocked, lockedFreeTheme, lockInFreeTheme } = useExclusiveAccess();
  const [selectedThemeChoice, setSelectedThemeChoice] = useState<AppTheme>(
    lockedFreeTheme || currentTheme
  );

  if (!isOpen) return null;

  const handleContactDeveloper = () => {
    const email = 'worsmon@Proton.me';
    const subject = encodeURIComponent('Request for Exclusive Access Code (₹20)');
    const body = encodeURIComponent(
      `Hello,\n\nI would like to purchase the exclusive developer access code (₹20) for the EHSAAN QR Suite.\n\nThank you!`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleApplyFreeTheme = (themeId: AppTheme) => {
    if (isUnlocked) {
      onSelectTheme(themeId);
      onShowToast?.(`Theme switched to ${themeId.toUpperCase()} ✓`);
      return;
    }

    if (lockedFreeTheme) {
      if (lockedFreeTheme === themeId) {
        onSelectTheme(themeId);
        onShowToast?.(`Applied your locked free theme (${themeId.toUpperCase()})`);
      } else {
        onShowToast?.(
          `Your free theme is locked to ${lockedFreeTheme.toUpperCase()}. Unlock Developer Access (₹20) to switch themes!`
        );
      }
      return;
    }

    // First time free theme selection: lock it in
    lockInFreeTheme(themeId);
    onSelectTheme(themeId);
    setSelectedThemeChoice(themeId);
    onShowToast?.(
      `Selected ${themeId.toUpperCase()} as your permanent free theme! Further switching requires Developer Access.`
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-overview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="premium-overview-modal-card"
        className="relative w-full max-w-[540px] my-auto bg-white dark:bg-zinc-900 rounded-3xl border border-[#FDE68A] dark:border-amber-900/60 shadow-2xl overflow-hidden transition-all duration-200"
      >
        {/* Soft Golden Header Gradient Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-[#FDE68A] via-[#E7AC08] to-[#FDE68A]" />

        {/* Close Button */}
        <button
          type="button"
          id="btn-close-premium-overview"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-[#FFFBEA] dark:hover:bg-zinc-800 transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7D9] dark:bg-amber-950/60 border border-[#FDE68A] dark:border-amber-800/80 text-[#B45309] dark:text-amber-300 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E7AC08]" />
              <span>EHSAAN Exclusive Suite</span>
            </div>

            <h3
              id="premium-overview-title"
              className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Exclusive Developer Features
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Unlock the complete suite of advanced QR creation, diagnostics, and unrestricted theme customization.
            </p>
          </div>

          {/* Pricing Notice Card (Consistent Light Yellow styling) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFDF5] dark:bg-amber-950/30 border border-[#FDE68A] dark:border-amber-900/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ExclusiveCrownBadge size="md" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFFBEA] dark:bg-amber-950/80 text-[#92400E] dark:text-amber-300 border border-[#FDE68A]/80 font-bold">
                One-time unlock
              </span>
            </div>

            {/* Direct Payment Note */}
            <div className="p-3 rounded-xl bg-[#FFF7D9] dark:bg-amber-950/60 border border-[#FDE68A] dark:border-amber-800/80 text-xs text-[#78350F] dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-[#92400E] dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-[#E7AC08] shrink-0" />
                <span>Important Note:</span>
              </div>
              <p className="leading-relaxed font-medium pl-5">
                Pay directly 20rs and send screenshot to the developer for code.
              </p>
            </div>

            {/* Direct Pay Action & Explanatory text */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-0.5">
              <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug">
                Click below to pay directly on our official checkout page:
              </p>
              <a
                id="btn-overview-pay-directly-banner"
                href="https://ehsaan.odoo.com/about-us"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] font-extrabold text-xs shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <span>PAY DIRECTLY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Feature List (Matching Mockup 6 style) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-200 px-1">
              <span>Included Exclusive Capabilities</span>
              <span className="text-[10px] font-mono text-[#B45309] dark:text-amber-400">
                {EXCLUSIVE_FEATURES.length} Features
              </span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-[#FAFAF8] dark:bg-zinc-800/40 overflow-hidden">
              {EXCLUSIVE_FEATURES.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.id}
                    className="p-2.5 sm:p-3 flex items-start justify-between gap-3 hover:bg-[#FFFDF7] dark:hover:bg-zinc-800/70 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-[#FFF7D9] dark:bg-amber-950/60 border border-[#FDE68A] dark:border-amber-800/70 text-[#D97706] dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {feat.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5">
                          {feat.desc}
                        </p>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFFBEA] dark:bg-amber-950/60 text-[#92400E] dark:text-amber-300 border border-[#FDE68A] dark:border-amber-800 text-[10px] font-bold">
                        <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <ExclusiveCrownBadge size="xs" showPrice={false} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theme Selection Section: 1 Free Theme or Unlocked Theme Switcher */}
          <div className="p-3.5 rounded-2xl bg-[#FFFDF5] dark:bg-zinc-800/50 border border-[#FDE68A] dark:border-zinc-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#D97706] dark:text-amber-400" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {isUnlocked
                    ? 'Theme Switcher (Unrestricted)'
                    : lockedFreeTheme
                    ? `Your Permanent Free Theme (${lockedFreeTheme.toUpperCase()})`
                    : 'Choose 1 Free Theme (Permanent)'}
                </span>
              </div>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                {isUnlocked ? 'Unlimited' : lockedFreeTheme ? 'Locked Free Choice' : '1 Free Choice'}
              </span>
            </div>

            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {isUnlocked
                ? 'Developer Access is unlocked! You can switch between all 4 themes freely anytime.'
                : lockedFreeTheme
                ? `You selected "${lockedFreeTheme.toUpperCase()}" as your free theme. It cannot be changed without unlocking Developer Access.`
                : 'Select 1 of the 4 themes below. Once applied, your chosen theme is locked permanently unless unlocked with developer access (₹20).'}
            </p>

            {/* 4 Theme Options Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {THEME_CARDS.map((tc) => {
                const Icon = tc.icon;
                const isSelected = isUnlocked
                  ? currentTheme === tc.id
                  : (lockedFreeTheme || selectedThemeChoice) === tc.id;
                const isUserLockedChoice = lockedFreeTheme === tc.id;

                return (
                  <button
                    key={tc.id}
                    type="button"
                    onClick={() => {
                      setSelectedThemeChoice(tc.id);
                      handleApplyFreeTheme(tc.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/60 ring-2 ring-[#E7AC08]/40 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 hover:border-[#FDE68A] hover:bg-[#FFFDF7]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: tc.previewBg,
                          border: `1px solid ${tc.previewBorder}`,
                          color: tc.textColor,
                        }}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E7AC08] shrink-0" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {tc.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {tc.desc}
                    </div>

                    {isUserLockedChoice && !isUnlocked && (
                      <span className="mt-1 inline-block text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                        Active Free
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="space-y-2 pt-1">
            {!isUnlocked ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  id="btn-overview-pay-directly"
                  href="https://ehsaan.odoo.com/about-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-2xl bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] font-extrabold text-xs sm:text-sm shadow-sm shadow-[#E7AC08]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <span>PAY DIRECTLY</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  id="btn-overview-contact"
                  onClick={handleContactDeveloper}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 rounded-2xl bg-[#FFFDF5] hover:bg-[#FFF7D9] dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-[#FDE68A] dark:border-zinc-700 text-[#92400E] dark:text-amber-300 font-bold text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Screenshot</span>
                </button>

                <button
                  type="button"
                  id="btn-overview-enter-code"
                  onClick={() => {
                    onClose();
                    onOpenCodeInput();
                  }}
                  className="py-2.5 sm:py-3 px-3.5 rounded-2xl bg-[#FFF7D9] hover:bg-[#FEF08A] dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-[#FDE68A] dark:border-zinc-700 text-[#92400E] dark:text-zinc-100 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Lock className="w-3.5 h-3.5 text-[#E7AC08]" />
                  <span>Enter Code</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>All Exclusive Features Unlocked & Active!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

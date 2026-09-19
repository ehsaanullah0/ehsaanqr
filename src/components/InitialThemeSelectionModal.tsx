import React, { useState, useEffect } from 'react';
import {
  Contrast,
  Sun,
  Moon,
  Sparkles,
  Check,
  X,
  Palette,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { AppTheme } from '../types';

interface InitialThemeSelectionModalProps {
  isOpen: boolean;
  onConfirm: (theme: AppTheme) => void;
  onSkip: () => void;
  currentTheme?: AppTheme;
}

interface ThemeCardData {
  id: AppTheme;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgPreview: string;
  borderPreview: string;
  textColor: string;
  previewChips: string[];
}

const THEME_OPTIONS: ThemeCardData[] = [
  {
    id: 'minimal',
    title: 'Minimal',
    tagline: 'Black & White Clean',
    description: 'High-contrast monochrome styling with zero distractions. Crisp black & white lines.',
    icon: Contrast,
    accentColor: '#000000',
    bgPreview: '#FFFFFF',
    borderPreview: '#E4E4E7',
    textColor: '#18181B',
    previewChips: ['#000000', '#71717A', '#FFFFFF'],
  },
  {
    id: 'light',
    title: 'Light',
    tagline: 'Warm Slate & Red',
    description: 'Daytime warm neutral canvas paired with refined stone slate and deep crimson accents.',
    icon: Sun,
    accentColor: '#B91C1C',
    bgPreview: '#FAF8F5',
    borderPreview: '#EDE8DF',
    textColor: '#0F172A',
    previewChips: ['#B91C1C', '#0F172A', '#FAF8F5'],
  },
  {
    id: 'material',
    title: 'Material',
    tagline: 'Warm Gold Accent',
    description: 'Signature warm yellow and gold tones with elevated card borders and rich styling.',
    icon: Sparkles,
    accentColor: '#E7AC08',
    bgPreview: '#FAF8F5',
    borderPreview: '#FDE68A',
    textColor: '#1E293B',
    previewChips: ['#E7AC08', '#1E293B', '#FAF8F5'],
  },
  {
    id: 'dark',
    title: 'Dark',
    tagline: 'Deep Obsidian Slate',
    description: 'Comfortable low-light dark mode with charcoal slate surfaces and crimson highlights.',
    icon: Moon,
    accentColor: '#DC2626',
    bgPreview: '#111318',
    borderPreview: '#27272A',
    textColor: '#F4F4F5',
    previewChips: ['#DC2626', '#F4F4F5', '#111318'],
  },
];

export const InitialThemeSelectionModal: React.FC<InitialThemeSelectionModalProps> = ({
  isOpen,
  onConfirm,
  onSkip,
  currentTheme = 'minimal',
}) => {
  const [selectedTheme, setSelectedTheme] = useState<AppTheme>(currentTheme);

  // Sync selected theme if prop updates
  useEffect(() => {
    if (isOpen) {
      setSelectedTheme(currentTheme || 'minimal');
    }
  }, [isOpen, currentTheme]);

  // Keyboard shortcut listener (Escape triggers skip/lock to minimal)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onSkip();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm(selectedTheme);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedTheme, onConfirm, onSkip]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-selection-title"
      className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSkip();
        }
      }}
    >
      <div
        id="initial-theme-modal-card"
        className="relative w-full max-w-xl bg-[#FAF8F5] dark:bg-zinc-900 rounded-3xl border border-[#EDE8DF] dark:border-zinc-800 shadow-2xl overflow-hidden transition-all flex flex-col max-h-[92vh]"
      >
        {/* Top Header Accent Banner */}
        <div className="h-1.5 w-full bg-gradient-to-r from-zinc-900 via-[#E7AC08] to-zinc-900" />

        {/* Close Button - Automatically locks to Minimal as requested */}
        <button
          type="button"
          id="btn-close-theme-modal"
          onClick={onSkip}
          className="absolute top-3.5 right-3.5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Skip and lock to Minimal theme"
          aria-label="Skip and lock to Minimal theme"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Header Introduction */}
          <div className="pr-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
              <Palette className="w-3 h-3 text-[#E7AC08]" />
              <span>Workspace Setup • Free Theme Choice</span>
            </div>
            <h2
              id="theme-selection-title"
              className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight"
            >
              Choose Your Interface Theme
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              Select one theme to lock in as your permanent free theme. If you skip this step, your interface will automatically lock to the <strong>Minimal</strong> theme.
            </p>
          </div>

          {/* Theme Options Cards (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedTheme === opt.id;

              return (
                <button
                  key={opt.id}
                  id={`select-theme-card-${opt.id}`}
                  type="button"
                  onClick={() => setSelectedTheme(opt.id)}
                  className={`relative p-3.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-800 border-[#0F172A] dark:border-white shadow-md ring-2 ring-[#0F172A] dark:ring-white scale-[1.01]'
                      : 'bg-white/80 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-white dark:hover:bg-zinc-800'
                  }`}
                >
                  {/* Card Header with Icon & Check */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
                          opt.id === 'minimal'
                            ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                            : opt.id === 'dark'
                            ? 'bg-[#18181B] text-white border-zinc-700'
                            : opt.id === 'material'
                            ? 'bg-[#FFFBEA] text-[#92400E] border-amber-300'
                            : 'bg-stone-100 text-stone-900 border-stone-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                          <span>{opt.title}</span>
                          {opt.id === 'minimal' && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                          {opt.tagline}
                        </span>
                      </div>
                    </div>

                    {/* Radio Indicator */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                          : 'border-zinc-300 dark:border-zinc-600 bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug">
                    {opt.description}
                  </p>

                  {/* Visual Palette Preview Chips */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-400">
                      Palette
                    </span>
                    <div className="flex items-center gap-1.5">
                      {opt.previewChips.map((chip, idx) => (
                        <div
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 shadow-2xs"
                          style={{ backgroundColor: chip }}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Guarantee Note */}
          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
            <ShieldCheck className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-bold">Permanent Choice:</span> Your selected theme is immediately unlocked and locked in as your active workspace style. You can also unlock all 4 themes anytime via Developer Access (₹20).
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Skip Button - Explicitly locks to Minimal */}
          <button
            type="button"
            id="btn-skip-theme-modal"
            onClick={onSkip}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 order-2 sm:order-1"
          >
            <span>Skip (Lock to Minimal)</span>
          </button>

          {/* Confirm Button */}
          <button
            type="button"
            id="btn-confirm-selected-theme"
            onClick={() => onConfirm(selectedTheme)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-black dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <span>Confirm {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} Theme</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

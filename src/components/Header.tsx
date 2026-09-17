import React, { useState, useRef, useEffect } from 'react';
import { AppTheme } from '../types';
import { EhsaanLogo } from './EhsaanLogo';
import {
  Sun,
  Moon,
  Sparkles,
  Contrast,
  ChevronDown,
  Check,
  ShieldCheck,
  QrCode,
  Layers,
} from 'lucide-react';

interface HeaderProps {
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onOpenHistory: () => void;
  onOpenScanner: () => void;
  onOpenChangelog: () => void;
  savedCount: number;
}

interface ThemeOption {
  id: AppTheme;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgPreview: string;
  borderPreview: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'light',
    label: 'Light',
    subtitle: 'Warm Cream & Deep Red',
    icon: Sun,
    accentColor: '#B91C1C',
    bgPreview: '#FAF8F5',
    borderPreview: '#EDE8DF',
  },
  {
    id: 'dark',
    label: 'Dark',
    subtitle: 'Deep Charcoal & Crimson Red',
    icon: Moon,
    accentColor: '#DC2626',
    bgPreview: '#111318',
    borderPreview: '#27272A',
  },
  {
    id: 'material',
    label: 'Material',
    subtitle: 'Warm Yellow & Gold',
    icon: Sparkles,
    accentColor: '#E7AC08',
    bgPreview: '#FAF8F5',
    borderPreview: '#FDE68A',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    subtitle: 'Black & White Light',
    icon: Contrast,
    accentColor: '#000000',
    bgPreview: '#FFFFFF',
    borderPreview: '#E4E4E7',
  },
];

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  onOpenHistory,
  onOpenScanner,
  onOpenChangelog,
  savedCount,
}) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setIsThemeOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsThemeOpen(false);
      }
    };

    if (isThemeOpen) {
      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('touchstart', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isThemeOpen]);

  const currentTheme = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];
  const CurrentIcon = currentTheme.icon;

  const handleSelectTheme = (newTheme: AppTheme) => {
    onThemeChange(newTheme);
    setIsThemeOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#FAF8F5]/95 dark:bg-[#111318]/95 border-b border-[#EDE8DF] dark:border-zinc-800/90 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <EhsaanLogo size={32} />
        </div>

        {/* Center / Privacy pill (hidden on small screens) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/30 border border-[#A7F3D0] dark:border-emerald-800/40 text-[#065F46] dark:text-emerald-300 text-xs font-medium shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#059669]" />
          <span>100% Client-side • Your data never leaves your browser</span>
        </div>

        {/* Right: Actions & Expandable Theme Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Test QR button */}
          <button
            id="header-test-qr-btn"
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border border-[#EDE8DF] dark:border-zinc-800 text-[#0F172A] dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-[#F5F2EA] dark:hover:bg-zinc-800 hover:border-[#E7AC08]/50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#E7AC08]/40 shadow-2xs active:scale-98"
            title="Test and validate current QR code"
            aria-label="Test QR code with barcode validator"
          >
            <QrCode className="w-3.5 h-3.5 text-[#E7AC08] shrink-0" />
            <span className="hidden sm:inline">Test QR</span>
          </button>

          {/* Changelog button (directly beside Test QR) */}
          <button
            id="header-changelog-btn"
            onClick={onOpenChangelog}
            className="hidden lg:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border border-[#E7AC08]/50 dark:border-[#E7AC08]/30 text-[#92400E] dark:text-amber-300 bg-[#FFF7D9] dark:bg-[#E7AC08]/15 hover:bg-[#FEF3C7] dark:hover:bg-[#E7AC08]/25 hover:border-[#E7AC08] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#E7AC08]/40 shadow-2xs active:scale-98"
            title="View Changelog & Release v1.1.5"
            aria-label="View changelog and releases"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E7AC08] shrink-0" />
            <span>v1.1.5</span>
          </button>

          {/* Saved Templates button */}
          <button
            id="header-saved-designs-btn"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border border-[#EDE8DF] dark:border-zinc-800 text-[#0F172A] dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-[#F5F2EA] dark:hover:bg-zinc-800 hover:border-[#E7AC08]/40 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#E7AC08]/40 shadow-2xs active:scale-98"
            title="View saved QR design templates"
            aria-label="View saved QR design templates"
          >
            <Layers className="w-3.5 h-3.5 text-[#64748B] dark:text-zinc-400 shrink-0" />
            <span className="hidden sm:inline">Templates</span>
            {savedCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-[#E7AC08] text-zinc-950">
                {savedCount}
              </span>
            )}
          </button>

          {/* Expandable Theme Switcher */}
          <div className="relative" ref={themeDropdownRef}>
            <button
              id="header-theme-toggle-btn"
              type="button"
              onClick={() => setIsThemeOpen((prev) => !prev)}
              aria-expanded={isThemeOpen}
              aria-haspopup="listbox"
              aria-label={`Current theme: ${currentTheme.label}. Click to expand theme options.`}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-98 focus:outline-hidden shadow-2xs ${
                isThemeOpen
                  ? theme === 'minimal'
                    ? 'border-black dark:border-white bg-white dark:bg-zinc-800 text-[#0F172A] dark:text-zinc-100 ring-2 ring-black/20 dark:ring-white/20'
                    : 'border-[#E7AC08] bg-white dark:bg-zinc-800 text-[#0F172A] dark:text-zinc-100 ring-2 ring-[#E7AC08]/20'
                  : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#0F172A] dark:text-zinc-200 hover:bg-[#F5F2EA] dark:hover:bg-zinc-800 hover:border-[#DDD7CC] dark:hover:border-zinc-700'
              } ${
                theme === 'minimal'
                  ? 'focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20'
                  : 'focus:ring-2 focus:ring-[#E7AC08]/40'
              }`}
            >
              <div className="flex items-center justify-center w-4 h-4">
                {theme === 'light' && <Sun className="w-3.5 h-3.5 text-[#D97706] stroke-[2.2]" />}
                {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-[#FBBF24] stroke-[2.2]" />}
                {theme === 'material' && (
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 stroke-[2.2]" />
                )}
                {theme === 'minimal' && (
                  <Contrast className="w-3.5 h-3.5 text-[#0F172A] dark:text-zinc-200 stroke-[2.2]" />
                )}
              </div>
              <span className="text-xs font-semibold">{currentTheme.label}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#64748B] dark:text-zinc-400 transition-transform duration-200 ${
                  isThemeOpen ? 'rotate-180 text-[#0F172A] dark:text-zinc-200' : ''
                }`}
              />
            </button>

            {/* Expandable Popover Dropdown Menu */}
            {isThemeOpen && (
              <div
                role="listbox"
                aria-label="Theme selection options"
                className="absolute right-0 mt-2 w-64 p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-[#EDE8DF] dark:border-zinc-800 shadow-xl shadow-zinc-950/10 dark:shadow-black/50 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right focus:outline-hidden"
              >
                <div className="px-2.5 py-1.5 mb-1 border-b border-[#EDE8DF]/70 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-zinc-400">
                    Appearance Theme
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-[#FAF8F5] dark:bg-zinc-800 text-[#0F172A] dark:text-zinc-300 font-medium">
                    4 styles
                  </span>
                </div>

                <div className="space-y-0.5">
                  {THEME_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        id={`theme-option-${opt.id}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectTheme(opt.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all duration-150 active:scale-98 ${
                          isSelected
                            ? 'bg-[#FAF8F5] dark:bg-zinc-800/90 border border-[#EDE8DF] dark:border-zinc-700 shadow-2xs font-semibold'
                            : 'hover:bg-[#FAF8F5]/80 dark:hover:bg-zinc-800/50 border border-transparent text-[#334155] dark:text-zinc-300 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-xl border transition-all ${
                              isSelected
                                ? opt.id === 'minimal'
                                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-2xs'
                                  : opt.id === 'material'
                                  ? 'bg-indigo-50 dark:bg-zinc-900 border-indigo-500/60 shadow-2xs'
                                  : 'bg-white dark:bg-zinc-900 border-[#E7AC08]/60 shadow-2xs'
                                : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200/70 dark:border-zinc-700/60'
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                isSelected && opt.id === 'minimal'
                                  ? 'text-white dark:text-black'
                                  : opt.id === 'light'
                                  ? 'text-[#D97706]'
                                  : opt.id === 'dark'
                                  ? 'text-[#FBBF24]'
                                  : opt.id === 'material'
                                  ? 'text-indigo-500'
                                  : 'text-zinc-900 dark:text-zinc-100'
                              }`}
                            />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#0F172A] dark:text-zinc-100 flex items-center gap-1.5">
                              <span>{opt.label}</span>
                              {opt.id === 'minimal' && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded-sm bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold uppercase">
                                  B&W
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#64748B] dark:text-zinc-400 block leading-tight">
                              {opt.subtitle}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                              opt.id === 'minimal'
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : opt.id === 'material'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-[#E7AC08] text-[#0F172A]'
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

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
  Coins,
  Settings,
  EyeOff,
  ChevronRight,
} from 'lucide-react';

interface HeaderProps {
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onOpenHistory: () => void;
  onOpenScanner: () => void;
  onOpenChangelog: () => void;
  onOpenSettings?: () => void;
  onStartHideCardsMode?: () => void;
  hiddenCardsCount?: number;
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
    subtitle: 'Amber Cream & Slate',
    icon: Sun,
    accentColor: '#E7AC08',
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
  onOpenSettings,
  onStartHideCardsMode,
  hiddenCardsCount = 0,
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

  const handleSelectTheme = (newTheme: AppTheme) => {
    onThemeChange(newTheme);
    setIsThemeOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#FAF8F5]/95 dark:bg-[#111318]/95 border-b border-[#EDE8DF] dark:border-zinc-800/90 transition-colors">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <EhsaanLogo size={30} />
        </div>

        {/* Center / Privacy pill (hidden on small screens) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/30 border border-[#A7F3D0] dark:border-emerald-800/40 text-[#065F46] dark:text-emerald-300 text-xs font-medium shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#059669]" />
          <span>100% Client-side • Your data never leaves your browser</span>
        </div>

        {/* Right: Actions & Expandable Theme Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Test QR button */}
          <button
            id="header-test-qr-btn"
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold border border-[#EDE8DF] dark:border-zinc-800 text-[#0F172A] dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-[#F5F2EA] dark:hover:bg-zinc-800 hover:border-[#FACC15] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#FACC15]/40 shadow-2xs active:scale-98 cursor-pointer shrink-0"
            title="Test and validate current QR code"
            aria-label="Test QR code with barcode validator"
          >
            <QrCode className="w-3.5 h-3.5 text-black dark:text-amber-400 shrink-0" />
            <span className="hidden md:inline">Test QR</span>
          </button>

          {/* Changelog button */}
          <button
            id="header-changelog-btn"
            onClick={onOpenChangelog}
            className="hidden lg:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border border-[#FACC15] text-black bg-[#FEF08A] hover:bg-[#FDE047] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#FACC15]/50 shadow-2xs active:scale-98 cursor-pointer shrink-0"
            title="View Changelog & Release v1.1.6"
            aria-label="View changelog and releases"
          >
            <Coins className="w-3.5 h-3.5 text-black shrink-0" />
            <span className="text-black font-bold">v1.1.6</span>
          </button>

          {/* Saved Templates button */}
          <button
            id="header-saved-designs-btn"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold border border-[#EDE8DF] dark:border-zinc-800 text-[#0F172A] dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-[#F5F2EA] dark:hover:bg-zinc-800 hover:border-[#FACC15] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#FACC15]/40 shadow-2xs active:scale-98 cursor-pointer shrink-0"
            title="View saved QR design templates"
            aria-label="View saved QR design templates"
          >
            <Layers className="w-3.5 h-3.5 text-[#475569] dark:text-zinc-400 shrink-0" />
            <span className="hidden md:inline">Templates</span>
            {savedCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 text-[10px] font-extrabold rounded-full bg-[#FDE047] dark:bg-[#FACC15] text-black border border-black/10">
                {savedCount}
              </span>
            )}
          </button>

          {/* Expandable Theme Switcher */}
          <div className="relative shrink-0" ref={themeDropdownRef}>
            <button
              id="header-theme-toggle-btn"
              type="button"
              onClick={() => setIsThemeOpen((prev) => !prev)}
              aria-expanded={isThemeOpen}
              aria-haspopup="listbox"
              aria-label={`Current theme: ${currentTheme.label}. Click to expand theme options.`}
              className={`flex items-center gap-1 sm:gap-1.5 py-1.5 px-2 sm:px-3 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-98 focus:outline-hidden shadow-2xs cursor-pointer shrink-0 ${
                isThemeOpen
                  ? theme === 'minimal'
                    ? 'border-black dark:border-white bg-white dark:bg-zinc-800 text-black dark:text-zinc-100 ring-2 ring-black/20 dark:ring-white/20'
                    : 'border-[#FACC15] bg-[#FEF9C3] dark:bg-zinc-800 text-black dark:text-zinc-100 ring-2 ring-[#FACC15]/30'
                  : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#0F172A] dark:text-zinc-200 hover:bg-[#F5F2EA] dark:hover:bg-zinc-800 hover:border-[#DDD7CC] dark:hover:border-zinc-700'
              } ${
                theme === 'minimal'
                  ? 'focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20'
                  : 'focus:ring-2 focus:ring-[#FACC15]/40'
              }`}
            >
              <div className="flex items-center justify-center w-4 h-4 shrink-0">
                {theme === 'light' && <Sun className="w-3.5 h-3.5 text-black dark:text-[#FBBF24] stroke-[2.2]" />}
                {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-[#FBBF24] stroke-[2.2]" />}
                {theme === 'material' && (
                  <Sparkles className="w-3.5 h-3.5 text-black dark:text-[#FACC15] stroke-[2.2]" />
                )}
                {theme === 'minimal' && (
                  <Contrast className="w-3.5 h-3.5 text-[#0F172A] dark:text-zinc-200 stroke-[2.2]" />
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">{currentTheme.label}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#475569] dark:text-zinc-400 transition-transform duration-200 shrink-0 ${
                  isThemeOpen ? 'rotate-180 text-black dark:text-zinc-200' : ''
                }`}
              />
            </button>

            {/* Expandable Popover Dropdown Menu */}
            {isThemeOpen && (
              <>
                {/* Mobile Backdrop for tap-away dismissal */}
                <div
                  className="fixed inset-0 z-40 bg-black/10 sm:hidden"
                  onClick={() => setIsThemeOpen(false)}
                />

                <div
                  role="listbox"
                  aria-label="Theme selection options"
                  className="absolute right-0 mt-2 w-[calc(100vw-1.25rem)] max-w-[272px] sm:w-68 p-2 rounded-2xl bg-white dark:bg-zinc-900 border border-[#FACC15]/60 dark:border-zinc-800 shadow-xl shadow-zinc-950/15 dark:shadow-black/50 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right focus:outline-hidden"
                >
                  <div className="px-2.5 py-1.5 mb-1.5 border-b border-[#EDE8DF]/70 dark:border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569] dark:text-zinc-400">
                      Appearance Theme
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-[#FEF08A] dark:bg-amber-950/60 text-black dark:text-amber-300 font-bold">
                      4 styles
                    </span>
                  </div>

                  <div className="space-y-1">
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
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all duration-150 active:scale-98 cursor-pointer ${
                            isSelected
                              ? 'bg-[#FEF9C3] dark:bg-amber-950/60 border border-[#FACC15] dark:border-amber-700 shadow-2xs font-semibold'
                              : 'hover:bg-[#FAF8F5]/80 dark:hover:bg-zinc-800/50 border border-transparent text-[#334155] dark:text-zinc-300 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-1">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-xl border shrink-0 transition-all ${
                                isSelected
                                  ? opt.id === 'minimal'
                                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-2xs'
                                    : 'bg-[#FEF08A] dark:bg-zinc-900 border-[#FACC15] shadow-2xs'
                                  : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200/70 dark:border-zinc-700/60'
                              }`}
                            >
                              <Icon
                                className={`w-4 h-4 ${
                                  isSelected && opt.id === 'minimal'
                                    ? 'text-white dark:text-black'
                                    : opt.id === 'light'
                                    ? 'text-black dark:text-[#FBBF24]'
                                    : opt.id === 'dark'
                                    ? 'text-[#FBBF24]'
                                    : opt.id === 'material'
                                    ? 'text-black dark:text-[#FACC15]'
                                    : 'text-zinc-900 dark:text-zinc-100'
                                }`}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-black dark:text-zinc-100 flex items-center gap-1.5 flex-wrap">
                                <span>{opt.label}</span>
                              </div>
                              <span className="text-[11px] text-[#475569] dark:text-zinc-400 block leading-tight truncate">
                                {opt.subtitle}
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#FDE047] text-black flex items-center justify-center shrink-0 shadow-2xs border border-black/10">
                              <Check className="w-3 h-3 stroke-[2.8] text-black" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Hide Cards Action Option in Theme Section */}
                  {onStartHideCardsMode && (
                    <div className="mt-2 pt-2 border-t border-[#EDE8DF]/90 dark:border-zinc-800">
                      <div className="px-2 pb-1.5 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569] dark:text-zinc-400">
                          Workspace Cards
                        </span>
                        {hiddenCardsCount > 0 ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 font-bold">
                            {hiddenCardsCount} hidden
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                            All visible
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        id="theme-hide-cards-trigger-btn"
                        onClick={() => {
                          setIsThemeOpen(false);
                          onStartHideCardsMode();
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left transition-all duration-150 hover:bg-[#FAF8F5] dark:hover:bg-zinc-800/80 border border-transparent hover:border-[#FACC15] group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-1">
                          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#FEF9C3] dark:bg-amber-950/60 border border-[#FACC15] shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                            <EyeOff className="w-4 h-4 text-black dark:text-amber-400 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-black dark:text-zinc-100 flex items-center gap-1.5">
                              <span>Hide Cards</span>
                            </div>
                            <span className="text-[11px] text-[#475569] dark:text-zinc-400 block leading-tight truncate">
                              Customize cards & workspace
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-black dark:group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    </div>
                  )}

                  {/* Bottom Settings shortcut in dropdown */}
                  {onOpenSettings && (
                    <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        id="header-dropdown-settings-btn"
                        onClick={() => {
                          setIsThemeOpen(false);
                          onOpenSettings();
                        }}
                        className="w-full py-2 px-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-[11px] font-bold text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#E7AC08] shrink-0" />
                        <span className="truncate">More Settings</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Settings Trigger Icon Button */}
          {onOpenSettings && (
            <button
              id="header-open-settings-btn"
              type="button"
              onClick={onOpenSettings}
              className="flex items-center justify-center p-2 rounded-full border border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-[#F5F2EA] dark:hover:bg-zinc-800 hover:border-[#FACC15] text-[#0F172A] dark:text-zinc-200 transition-colors shadow-2xs active:scale-98 cursor-pointer shrink-0"
              title="Settings & Layout Customization"
              aria-label="Open settings"
            >
              <Settings className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


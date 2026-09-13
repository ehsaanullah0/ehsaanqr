import React from 'react';
import { AppTheme } from '../types';
import { EhsaanLogo } from './EhsaanLogo';
import { Sun, Moon, Sparkles, ShieldCheck, History, QrCode, Layers } from 'lucide-react';

interface HeaderProps {
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onOpenHistory: () => void;
  onOpenScanner: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  onOpenHistory,
  onOpenScanner,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/95 dark:bg-zinc-950/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <EhsaanLogo size={32} />
        </div>

        {/* Center / Privacy pill (hidden on small screens) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>100% Client-side • Your data never leaves your browser</span>
        </div>

        {/* Right: Actions & Theme Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Test QR button */}
          <button
            id="header-test-qr-btn"
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/30"
            title="Test and validate current QR code"
            aria-label="Test QR code with barcode validator"
          >
            <QrCode className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="hidden sm:inline">Test QR</span>
          </button>

          {/* Saved Templates button */}
          <button
            id="header-saved-designs-btn"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/30"
            title="View saved QR design templates"
            aria-label="View saved QR design templates"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="hidden sm:inline">Templates</span>
            {savedCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-red-600 text-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* Theme Switcher: Light, Dark, Material Expressive, Colourful */}
          <div className="flex items-center p-1 rounded-full bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300/80 dark:border-zinc-800 shadow-2xs">
            <button
              id="theme-light-btn"
              onClick={() => onThemeChange('light')}
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs transition-all ${
                theme === 'light'
                  ? 'bg-white text-amber-600 shadow-xs border border-zinc-200 ring-2 ring-amber-400/40 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/60 dark:hover:bg-zinc-800'
              }`}
              title="Light theme"
              aria-label="Switch to Light Theme"
            >
              <Sun className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
            <button
              id="theme-dark-btn"
              onClick={() => onThemeChange('dark')}
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-800 text-indigo-300 shadow-xs border border-zinc-700 ring-2 ring-indigo-400/40 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-white/60 dark:hover:bg-zinc-800'
              }`}
              title="Dark theme"
              aria-label="Switch to Dark Theme"
            >
              <Moon className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
            <button
              id="theme-material-btn"
              onClick={() => onThemeChange('material')}
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs transition-all ${
                theme === 'material'
                  ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 text-white shadow-xs ring-2 ring-blue-400 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-zinc-800'
              }`}
              title="Material Expressive theme"
              aria-label="Switch to Material Expressive Theme"
            >
              <Sparkles className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

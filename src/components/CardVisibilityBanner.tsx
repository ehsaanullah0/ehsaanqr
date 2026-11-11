import React, { useEffect } from 'react';
import { Eye, EyeOff, Check, RotateCcw } from 'lucide-react';

interface CardVisibilityBannerProps {
  totalCards: number;
  visibleCount: number;
  onDone: () => void;
  onUnhideAll: () => void;
}

export const CardVisibilityBanner: React.FC<CardVisibilityBannerProps> = ({
  totalCards,
  visibleCount,
  onDone,
  onUnhideAll,
}) => {
  const hiddenCount = totalCards - visibleCount;

  // Handle Escape key to finish and close to normal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDone();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDone]);

  return (
    <div
      id="card-visibility-banner"
      role="region"
      aria-label="Card Visibility Toolbar"
      className="sticky top-14 sm:top-16 z-25 w-full bg-amber-50/95 dark:bg-zinc-900/95 border-b-2 border-[#FACC15] shadow-md backdrop-blur-md transition-all duration-200 animate-in slide-in-from-top-2"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Indicator & Guidance */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#FEF08A] dark:bg-amber-950/80 text-black dark:text-amber-300 border border-[#FACC15] shadow-2xs shrink-0">
            <EyeOff className="w-4 h-4 text-black dark:text-amber-300 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                Card Visibility Mode
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-amber-300/60 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 shadow-2xs">
                {visibleCount} of {totalCards} visible
              </span>
              {hiddenCount > 0 && (
                <span className="text-[10px] font-semibold text-red-600 dark:text-red-400">
                  ({hiddenCount} hidden)
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 hidden sm:block truncate">
              Click <strong className="text-red-600 dark:text-red-400 font-semibold">Hide</strong> on any card to hide it, or <strong className="text-amber-700 dark:text-amber-300 font-semibold">Unhide</strong> to bring it back.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
          {hiddenCount > 0 && (
            <button
              type="button"
              id="banner-unhide-all-btn"
              onClick={onUnhideAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="Unhide all cards"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>Unhide All</span>
            </button>
          )}

          {/* Done Button */}
          <button
            type="button"
            id="banner-done-btn"
            onClick={onDone}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black text-black bg-[#FACC15] hover:bg-[#EAB308] border border-black/10 shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
            title="Finish customizing cards and close to normal (Esc)"
          >
            <Check className="w-4 h-4 stroke-[2.8]" />
            <span>Done</span>
            <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.2 text-[9px] font-sans font-semibold rounded bg-black/10 text-black border border-black/15">
              Esc
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
};

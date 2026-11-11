import React from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import { HomePageCardId } from '../types';

interface CardVisibilityWrapperProps {
  cardId: HomePageCardId;
  cardTitle: string;
  cardDescription?: string;
  icon?: LucideIcon;
  isHideCardsMode: boolean;
  isVisible: boolean;
  onToggleVisibility: (cardId: HomePageCardId) => void;
  children: React.ReactNode;
  className?: string;
}

export const CardVisibilityWrapper: React.FC<CardVisibilityWrapperProps> = ({
  cardId,
  cardTitle,
  cardDescription,
  icon: Icon,
  isHideCardsMode,
  isVisible,
  onToggleVisibility,
  children,
  className = '',
}) => {
  // If card is not visible and not in hide-cards mode, hide completely
  if (!isVisible && !isHideCardsMode) {
    return null;
  }

  // If card is hidden and we ARE in hide-cards mode, show the interactive placeholder
  if (!isVisible && isHideCardsMode) {
    return (
      <div
        id={`card-placeholder-${cardId}`}
        className={`relative w-full rounded-2xl border-2 border-dashed border-amber-300 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-900/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 transition-all duration-200 animate-in fade-in zoom-in-98 ${className}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-100 dark:bg-zinc-800 border border-amber-200 dark:border-zinc-700 text-amber-700 dark:text-amber-400 shrink-0">
            {Icon ? <Icon className="w-4 h-4 stroke-[2]" /> : <EyeOff className="w-4 h-4 stroke-[2]" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                {cardTitle}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/40">
                Hidden
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              {cardDescription || 'Card is currently hidden from workspace'}
            </p>
          </div>
        </div>

        {/* Unhide Button at Top Corner / Right */}
        <button
          type="button"
          id={`btn-unhide-${cardId}`}
          onClick={() => onToggleVisibility(cardId)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FEF08A] hover:bg-[#FDE047] text-black border border-[#FACC15] shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer shrink-0 ml-auto sm:ml-0"
          title={`Unhide ${cardTitle} card`}
          aria-label={`Unhide ${cardTitle} card`}
        >
          <Eye className="w-3.5 h-3.5 stroke-[2.4] text-black" />
          <span>Unhide</span>
        </button>
      </div>
    );
  }

  // If card is visible and we ARE in hide-cards mode: show card with a stylish Hide button in the top corner
  if (isVisible && isHideCardsMode) {
    return (
      <div
        id={`card-wrapper-${cardId}`}
        className={`relative transition-all duration-200 ring-2 ring-dashed ring-amber-400/80 dark:ring-amber-500/70 rounded-2xl ${className}`}
      >
        {/* Hide Button in Top Corner */}
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-30">
          <button
            type="button"
            id={`btn-hide-${cardId}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(cardId);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 dark:bg-zinc-900/95 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800/80 hover:bg-red-50 dark:hover:bg-red-950/80 shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
            title={`Hide ${cardTitle} card`}
            aria-label={`Hide ${cardTitle} card`}
          >
            <EyeOff className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Hide</span>
          </button>
        </div>

        {children}
      </div>
    );
  }

  // Normal mode: render clean children
  return <div className={className}>{children}</div>;
};

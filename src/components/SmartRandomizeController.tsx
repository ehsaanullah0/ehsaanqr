import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  Sparkles,
  Shapes,
  Palette,
  Eye,
  CircleDot,
  Maximize2,
  Check,
  Image as ImageIcon,
  Dices,
  Info,
  Lock,
  Unlock,
} from 'lucide-react';
import {
  QrStyleOptions,
  RandomizeTarget,
  RandomizeType,
} from '../types';
import {
  executeSmartRandomize,
  getRandomizeButtonLabel,
  VALID_RANDOMIZE_TYPES,
  RANDOMIZE_TARGET_INFO,
  SaturationPreference,
} from '../utils/colorRandomizer';

interface SmartRandomizeControllerProps {
  options: QrStyleOptions;
  onOptionsChange: (newOpts: Partial<QrStyleOptions>) => void;
  onShowToast: (msg: string) => void;
  saturationPreference?: SaturationPreference;
  selectedTarget: RandomizeTarget;
  selectedType: RandomizeType;
  onTargetChange: (target: RandomizeTarget) => void;
  onTypeChange: (type: RandomizeType) => void;
  lockedTargets?: RandomizeTarget[];
  onLockedTargetsChange?: (locks: RandomizeTarget[]) => void;
  idPrefix?: string;
  className?: string;
  compact?: boolean;
}

interface TargetItemConfig {
  id: RandomizeTarget;
  label: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
}

interface PopoverCoords {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  openAbove: boolean;
}

export const SmartRandomizeController: React.FC<SmartRandomizeControllerProps> = ({
  options,
  onOptionsChange,
  onShowToast,
  saturationPreference,
  selectedTarget,
  selectedType,
  onTargetChange,
  onTypeChange,
  lockedTargets,
  onLockedTargetsChange,
  idPrefix = 'smart-rand',
  className = '',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [internalLocks, setInternalLocks] = useState<RandomizeTarget[]>(() => {
    try {
      const saved = localStorage.getItem('ehsaan_qr_rand_locks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const currentLocks = lockedTargets !== undefined ? lockedTargets : internalLocks;

  const handleToggleLock = (targetId: RandomizeTarget) => {
    const nextLocks = currentLocks.includes(targetId)
      ? currentLocks.filter((t) => t !== targetId)
      : [...currentLocks, targetId];

    if (onLockedTargetsChange) {
      onLockedTargetsChange(nextLocks);
    } else {
      setInternalLocks(nextLocks);
      try {
        localStorage.setItem('ehsaan_qr_rand_locks', JSON.stringify(nextLocks));
      } catch {}
    }

    const targetLabel = RANDOMIZE_TARGET_INFO[targetId]?.shortLabel || targetId;
    if (nextLocks.includes(targetId)) {
      onShowToast(`Locked ${targetLabel} (won't randomize with "All") 🔒`);
    } else {
      onShowToast(`Unlocked ${targetLabel} 🔓`);
    }
  };

  const handleUnlockAll = () => {
    if (onLockedTargetsChange) {
      onLockedTargetsChange([]);
    } else {
      setInternalLocks([]);
      try {
        localStorage.setItem('ehsaan_qr_rand_locks', JSON.stringify([]));
      } catch {}
    }
    onShowToast('All category locks cleared 🔓');
  };

  const [coords, setCoords] = useState<PopoverCoords>({
    left: 12,
    width: 340,
    maxHeight: 480,
    openAbove: false,
  });

  // Calculate smart, viewport-clamped positioning
  const updatePosition = () => {
    if (!containerRef.current) return;
    const triggerEl = containerRef.current;
    const rect = triggerEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Determine target width:
    // Large desktop & tablet: 520px (allows comfortable 2-column cards)
    // Small tablet / wide mobile (540px - 768px): min(480px, vw - 24px)
    // Mobile (< 540px): vw - 24px
    let targetWidth = 520;
    if (vw < 540) {
      targetWidth = Math.max(300, vw - 24);
    } else if (vw < 768) {
      targetWidth = Math.min(480, vw - 24);
    } else {
      targetWidth = 520;
    }

    const minMargin = 12;
    const maxLeft = Math.max(minMargin, vw - minMargin - targetWidth);

    // Prefer aligning with the left edge of the controller button
    // But clamp so it never overflows off the left (< minMargin) or right (> maxLeft)
    let left = rect.left;
    if (left > maxLeft) {
      left = maxLeft;
    }
    if (left < minMargin) {
      left = minMargin;
    }

    // Check vertical space
    const spaceBelow = vh - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const openAbove = spaceBelow < 300 && spaceAbove > spaceBelow;

    const availableHeight = openAbove ? spaceAbove - 12 : spaceBelow - 12;
    const maxHeight = Math.min(540, Math.max(260, availableHeight));

    setCoords({
      top: openAbove ? undefined : rect.bottom + 8,
      bottom: openAbove ? vh - rect.top + 8 : undefined,
      left,
      width: targetWidth,
      maxHeight,
      openAbove,
    });
  };

  // Update position on open and whenever viewport resizes / scrolls
  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true });

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (containerRef.current && containerRef.current.contains(target)) {
        return;
      }
      if (popoverRef.current && popoverRef.current.contains(target)) {
        return;
      }
      setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Execute currently selected randomization
  const handleExecuteRandomize = () => {
    const { updated, message } = executeSmartRandomize(
      options,
      selectedTarget,
      selectedType,
      saturationPreference,
      currentLocks
    );
    onOptionsChange(updated);
    onShowToast(message);
  };

  // Handle target selection
  const handleSelectTarget = (target: RandomizeTarget) => {
    onTargetChange(target);

    // Auto-adjust type if current type is not valid for new target
    const validTypes = VALID_RANDOMIZE_TYPES[target];
    if (!validTypes.includes(selectedType)) {
      onTypeChange(validTypes[0]);
    }
  };

  // Handle type selection
  const handleSelectType = (type: RandomizeType) => {
    onTypeChange(type);
  };

  const buttonLabel = getRandomizeButtonLabel(selectedTarget, selectedType);
  const validTypesForCurrentTarget = VALID_RANDOMIZE_TYPES[selectedTarget] || ['both'];

  const targetList: TargetItemConfig[] = [
    {
      id: 'all',
      label: 'All Elements',
      badge: 'Full QR',
      description: 'Pattern, eyes, pupils & color scheme',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#E7AC08]" />,
    },
    {
      id: 'matrix',
      label: 'QR / Matrix Shape',
      badge: 'Modules',
      description: 'Data module style (square, rounded, dots, liquid)',
      icon: <Shapes className="w-3.5 h-3.5 text-amber-600" />,
    },
    {
      id: 'foreground',
      label: 'Foreground',
      badge: 'Color',
      description: 'QR module colors & gradient transitions',
      icon: <Palette className="w-3.5 h-3.5 text-amber-700" />,
    },
    {
      id: 'background',
      label: 'Background',
      badge: 'Color',
      description: 'Canvas backdrop tone (high contrast)',
      icon: <Palette className="w-3.5 h-3.5 text-emerald-600" />,
    },
    {
      id: 'eyes',
      label: 'Corner Eyes',
      badge: 'Frame',
      description: 'Corner finder pattern frame shape & outer color',
      icon: <Eye className="w-3.5 h-3.5 text-[#E7AC08]" />,
    },
    {
      id: 'eyeColor',
      label: 'Corner Eye Color',
      badge: 'Color',
      description: 'Outer ring border color of finder corners',
      icon: <Palette className="w-3.5 h-3.5 text-orange-500" />,
    },
    {
      id: 'pupil',
      label: 'Pupil',
      badge: 'Inner Eye',
      description: 'Center dot geometry & color in finder eyes',
      icon: <CircleDot className="w-3.5 h-3.5 text-amber-600" />,
    },
    {
      id: 'pupilColor',
      label: 'Pupil Color',
      badge: 'Color',
      description: 'Finder center dot fill color',
      icon: <Palette className="w-3.5 h-3.5 text-amber-700" />,
    },
    {
      id: 'logo',
      label: 'Logo / Center Element',
      badge: 'Center',
      description: 'Center emblem radius, frame padding & backdrop',
      icon: <ImageIcon className="w-3.5 h-3.5 text-blue-500" />,
    },
    {
      id: 'frame',
      label: 'Frame / Pattern',
      badge: 'Corners',
      description: 'Outer QR boundary curve (sharp vs smooth)',
      icon: <Maximize2 className="w-3.5 h-3.5 text-teal-600" />,
    },
  ];

  // Popover content rendered via Portal into document.body to prevent clipping by parent overflow/stacking contexts
  const popoverContent = isOpen && (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="Smart Randomizer Configuration"
      style={{
        position: 'fixed',
        left: `${coords.left}px`,
        top: coords.top !== undefined ? `${coords.top}px` : undefined,
        bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
        width: `${coords.width}px`,
        maxHeight: `${coords.maxHeight}px`,
        zIndex: 9999,
      }}
      className="rounded-2xl bg-[#FDFCF9] dark:bg-zinc-900 border border-[#EDE8DF] dark:border-zinc-800 shadow-2xl p-3 sm:p-3.5 text-[#0F172A] dark:text-zinc-100 flex flex-col animate-in fade-in zoom-in-95 duration-150"
    >
      {/* 1. Header (shrink-0) */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EDE8DF] dark:border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#E7AC08]/15 text-[#92400E] dark:text-[#E7AC08] flex items-center justify-center shrink-0">
            <Dices className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-none text-[#0F172A] dark:text-zinc-100">
              Smart Randomizer
            </h4>
            <p className="text-[10px] text-[#64748B] dark:text-zinc-400 mt-0.5">
              Select element & mode
            </p>
          </div>
        </div>

        {/* Quick Actions in Header */}
        <div className="flex items-center gap-1.5">
          {currentLocks.length > 0 && (
            <button
              type="button"
              id={`${idPrefix}-unlock-all`}
              onClick={handleUnlockAll}
              title="Click to unlock all categories"
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/70 hover:bg-amber-200 dark:hover:bg-amber-900 px-1.5 py-0.5 rounded cursor-pointer transition-colors border border-amber-300/60 dark:border-amber-700/50"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>{currentLocks.length} locked</span>
              <span className="text-[9px] opacity-75 underline ml-0.5">clear</span>
            </button>
          )}

          {/* Quick Reset to All */}
          {selectedTarget !== 'all' && (
            <button
              type="button"
              id={`${idPrefix}-reset-all`}
              onClick={() => {
                handleSelectTarget('all');
                handleSelectType('both');
              }}
              className="text-[10px] font-semibold text-[#B45309] dark:text-amber-400 hover:underline px-1.5 py-0.5 rounded cursor-pointer"
            >
              Reset to All
            </button>
          )}
        </div>
      </div>

      {/* 2. Scrollable Middle Content (flex-1 overflow-y-auto) */}
      <div className="flex-1 overflow-y-auto pr-1 overscroll-contain space-y-2.5 focus:outline-none">
        {/* Section 1: Target Element Grid */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-zinc-500">
              1. What to randomize?
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">
              {targetList.length} options
            </span>
          </div>

          {/* Responsive CSS Grid: 2 columns on tablet/desktop, 1 column on mobile */}
          <div
            role="radiogroup"
            aria-label="Select target QR element"
            className="grid gap-1.5"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))',
              gap: '0.375rem',
            }}
          >
            {targetList.map((item) => {
              const isSelected = selectedTarget === item.id;
              const isLocked = currentLocks.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  id={`${idPrefix}-target-${item.id}`}
                  onClick={() => handleSelectTarget(item.id)}
                  className={`w-full group relative flex flex-col justify-between p-2 sm:p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#FFFBEA] dark:bg-amber-950/40 border-[#E7AC08] shadow-2xs ring-1 ring-[#E7AC08]/30'
                      : isLocked
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/70 dark:hover:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/40 text-[#334155] dark:text-zinc-300'
                      : 'bg-white dark:bg-zinc-800/40 hover:bg-[#FAF8F5] dark:hover:bg-zinc-800/80 border-[#EDE8DF] dark:border-zinc-800 text-[#334155] dark:text-zinc-300'
                  }`}
                >
                  <div className="w-full">
                    {/* Top Row: Radio/Check Indicator + Icon + Label + Badge + Lock Toggle */}
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {/* Consistent radio indicator */}
                        <div className="shrink-0 flex items-center justify-center">
                          {isSelected ? (
                            <div className="w-4 h-4 rounded-full bg-[#E7AC08] text-[#0F172A] flex items-center justify-center shadow-2xs font-bold">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-[#CBD5E1] dark:border-zinc-600 group-hover:border-[#E7AC08]/60 bg-white dark:bg-zinc-900 transition-colors" />
                          )}
                        </div>

                        {/* Feature Icon */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#E7AC08]/20 text-[#92400E] dark:text-[#E7AC08]'
                              : 'bg-[#F8F6F0] dark:bg-zinc-700/60 text-[#64748B] dark:text-zinc-400 shadow-2xs'
                          }`}
                        >
                          {item.icon}
                        </div>

                        {/* Label Title */}
                        <span
                          className={`text-xs font-semibold truncate leading-tight ${
                            isSelected
                              ? 'text-[#0F172A] dark:text-amber-100 font-bold'
                              : 'text-[#0F172A] dark:text-zinc-200'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>

                      {/* Right side: Badge and Minimal Lock Button */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 leading-none ${
                            isLocked
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-semibold'
                              : isSelected
                              ? 'bg-[#FEF3C7] dark:bg-amber-900/60 text-[#92400E] dark:text-amber-200'
                              : 'bg-[#EDE8DF] dark:bg-zinc-700/60 text-[#64748B] dark:text-zinc-400'
                          }`}
                        >
                          {isLocked ? 'Locked' : item.badge}
                        </span>

                        {item.id !== 'all' && (
                          <button
                            type="button"
                            id={`${idPrefix}-lock-${item.id}`}
                            aria-label={isLocked ? `Unlock ${item.label}` : `Lock ${item.label}`}
                            aria-pressed={isLocked}
                            title={
                              isLocked
                                ? `Locked: Won't randomize with "All" (Click to unlock)`
                                : `Lock ${item.label} to prevent it from randomizing`
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleToggleLock(item.id);
                            }}
                            className={`p-1 rounded-md transition-all cursor-pointer ${
                              isLocked
                                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-600 shadow-2xs ring-1 ring-amber-600/50'
                                : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700'
                            }`}
                          >
                            {isLocked ? (
                              <Lock className="w-3 h-3 stroke-[2.5]" />
                            ) : (
                              <Unlock className="w-3 h-3 stroke-[1.75]" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Description: Natural wrap without clipping */}
                    <p
                      className={`text-[10px] sm:text-[10.5px] leading-snug pl-[26px] mt-1 ${
                        isSelected
                          ? 'text-[#64748B] dark:text-amber-300/80 font-normal'
                          : 'text-[#64748B] dark:text-zinc-400'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Mode Selector (Shape / Color / Both) */}
        <div className="pt-2 border-t border-[#EDE8DF] dark:border-zinc-800/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-zinc-500">
              2. Apply to
            </span>
            <span className="text-[10px] text-[#64748B] dark:text-zinc-400">
              {validTypesForCurrentTarget.length === 1
                ? `${RANDOMIZE_TARGET_INFO[selectedTarget]?.shortLabel} supports ${validTypesForCurrentTarget[0]} only`
                : 'Select mode'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F8F6F0] dark:bg-zinc-800/60 rounded-xl">
            {/* Shape Option */}
            {validTypesForCurrentTarget.includes('shape') ? (
              <button
                type="button"
                id={`${idPrefix}-type-shape`}
                onClick={() => handleSelectType('shape')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedType === 'shape'
                    ? 'bg-white dark:bg-zinc-700 text-[#0F172A] dark:text-amber-400 shadow-xs ring-1 ring-[#EDE8DF] dark:ring-zinc-600'
                    : 'text-[#64748B] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-zinc-200'
                }`}
              >
                <Shapes className="w-3 h-3" />
                <span>Shape</span>
              </button>
            ) : (
              <div
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs text-zinc-400/50 dark:text-zinc-600 cursor-not-allowed select-none"
                title="Shape not applicable to this element"
              >
                <Shapes className="w-3 h-3 opacity-30" />
                <span>Shape</span>
              </div>
            )}

            {/* Color Option */}
            {validTypesForCurrentTarget.includes('color') ? (
              <button
                type="button"
                id={`${idPrefix}-type-color`}
                onClick={() => handleSelectType('color')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedType === 'color'
                    ? 'bg-white dark:bg-zinc-700 text-[#0F172A] dark:text-amber-400 shadow-xs ring-1 ring-[#EDE8DF] dark:ring-zinc-600'
                    : 'text-[#64748B] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-zinc-200'
                }`}
              >
                <Palette className="w-3 h-3" />
                <span>Color</span>
              </button>
            ) : (
              <div
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs text-zinc-400/50 dark:text-zinc-600 cursor-not-allowed select-none"
                title="Color not applicable to this element"
              >
                <Palette className="w-3 h-3 opacity-30" />
                <span>Color</span>
              </div>
            )}

            {/* Both Option */}
            {validTypesForCurrentTarget.includes('both') ? (
              <button
                type="button"
                id={`${idPrefix}-type-both`}
                onClick={() => handleSelectType('both')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedType === 'both'
                    ? 'bg-white dark:bg-zinc-700 text-[#0F172A] dark:text-amber-400 shadow-xs ring-1 ring-[#EDE8DF] dark:ring-zinc-600'
                    : 'text-[#64748B] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Both</span>
              </button>
            ) : (
              <div
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs text-zinc-400/50 dark:text-zinc-600 cursor-not-allowed select-none"
                title="Both not applicable for single-property element"
              >
                <Sparkles className="w-3 h-3 opacity-30" />
                <span>Both</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Action Footer (shrink-0) */}
      <div className="mt-2.5 pt-2 border-t border-[#EDE8DF] dark:border-zinc-800/80 flex items-center justify-between gap-2 bg-[#F8F6F0] dark:bg-zinc-800/50 p-2 sm:p-2.5 rounded-xl shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] text-[#334155] dark:text-zinc-300 min-w-0">
          <Info className="w-3.5 h-3.5 text-[#E7AC08] shrink-0" />
          <span className="truncate">
            Ready: <strong className="text-[#0F172A] dark:text-zinc-100 font-bold">{buttonLabel}</strong>
            {currentLocks.length > 0 && selectedTarget === 'all' && (
              <span className="ml-1 text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                ({currentLocks.length} locked)
              </span>
            )}
          </span>
        </div>

        <button
          type="button"
          id={`${idPrefix}-roll-now-btn`}
          onClick={() => {
            handleExecuteRandomize();
            setIsOpen(false);
          }}
          className="px-3 py-1.5 rounded-lg bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/40"
        >
          <span>Roll Now</span>
          <span className="text-xs leading-none">🎲</span>
        </button>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center select-none ${className}`}
    >
      {/* Split-style Upgraded Randomize Button */}
      <div
        className={`w-full inline-flex items-stretch rounded-xl shadow-xs border transition-all ${
          isOpen
            ? 'ring-2 ring-[#E7AC08]/40 border-[#E7AC08]'
            : 'border-[#D9A007] hover:border-[#C59206]'
        } bg-[#E7AC08] text-[#0F172A] overflow-hidden`}
      >
        {/* Main Action Area */}
        <button
          type="button"
          id={`${idPrefix}-action-btn`}
          onClick={handleExecuteRandomize}
          className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold tracking-tight bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] transition-colors focus:outline-none focus-visible:bg-[#D9A007] cursor-pointer"
          title={`Click to roll: ${buttonLabel}${currentLocks.length > 0 && selectedTarget === 'all' ? ` (${currentLocks.length} category locked)` : ''}`}
          aria-label={`Randomize action: ${buttonLabel}`}
        >
          <span
            role="img"
            aria-label="dice"
            className="text-xs sm:text-sm leading-none shrink-0"
          >
            🎲
          </span>
          <span className="truncate whitespace-nowrap">{buttonLabel}</span>
          {currentLocks.length > 0 && selectedTarget === 'all' && (
            <span
              className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-bold bg-amber-950/20 text-[#0F172A] shrink-0"
              title={`${currentLocks.length} category locked against randomize`}
            >
              <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
              <span>{currentLocks.length}</span>
            </span>
          )}
        </button>

        {/* Small Arrow Divider */}
        <div className="w-[1px] bg-[#C59206]/80 self-stretch my-1" />

        {/* Small Arrow Config Trigger */}
        <button
          ref={triggerRef}
          type="button"
          id={`${idPrefix}-dropdown-toggle`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Configure randomization elements and modes"
          title="Configure what to randomize"
          className={`flex items-center justify-center px-2 py-1.5 sm:py-2 bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] transition-colors focus:outline-none focus-visible:bg-[#D9A007] cursor-pointer shrink-0 ${
            isOpen ? 'bg-[#D9A007]' : ''
          }`}
        >
          <ChevronDown
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0F172A] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Render Popover via React Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(popoverContent, document.body)}
    </div>
  );
};

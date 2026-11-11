import React, { useState, useEffect, useMemo, useRef } from 'react';
import { QrType } from '../types';
import {
  Globe,
  AlignLeft,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Contact,
  CreditCard,
  Calendar,
  MapPin,
  Layers,
  ChevronDown,
  ChevronUp,
  Pin,
} from 'lucide-react';

interface TypeSelectorProps {
  selectedType: QrType;
  onSelectType: (type: QrType) => void;
  onShowToast?: (msg: string) => void;
}

interface TypeItem {
  id: QrType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
  pastelBg: string;
  iconColor: string;
}

const QR_TYPES: TypeItem[] = [
  { id: 'url', label: 'URL', icon: Globe, hint: 'Website link', pastelBg: 'bg-[#FFF7D9] dark:bg-amber-950/40', iconColor: 'text-[#D97706] dark:text-amber-400' },
  { id: 'text', label: 'Plain Text', icon: AlignLeft, hint: 'Note or message', pastelBg: 'bg-[#F1F5F9] dark:bg-slate-900/60', iconColor: 'text-[#475569] dark:text-slate-300' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, hint: 'Auto connect', pastelBg: 'bg-[#ECFDF5] dark:bg-emerald-950/40', iconColor: 'text-[#059669] dark:text-emerald-400' },
  { id: 'email', label: 'Email', icon: Mail, hint: 'Mail draft', pastelBg: 'bg-[#EEF2FF] dark:bg-indigo-950/40', iconColor: 'text-[#6366F1] dark:text-indigo-400' },
  { id: 'phone', label: 'Phone', icon: Phone, hint: 'Direct dial', pastelBg: 'bg-[#F0F9FF] dark:bg-sky-950/40', iconColor: 'text-[#0284C7] dark:text-sky-400' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, hint: 'Text message', pastelBg: 'bg-[#FFF1F2] dark:bg-rose-950/40', iconColor: 'text-[#E11D48] dark:text-rose-400' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, hint: 'Instant chat', pastelBg: 'bg-[#F0FDF4] dark:bg-emerald-950/40', iconColor: 'text-[#16A34A] dark:text-emerald-400' },
  { id: 'multi-url', label: 'Multi-URL', icon: Layers, hint: 'Link hub & list', pastelBg: 'bg-[#EFF6FF] dark:bg-blue-950/40', iconColor: 'text-[#2563EB] dark:text-blue-400' },
  { id: 'vcard', label: 'vCard', icon: Contact, hint: 'Digital contact', pastelBg: 'bg-[#F5F3FF] dark:bg-purple-950/40', iconColor: 'text-[#7C3AED] dark:text-purple-400' },
  { id: 'upi', label: 'UPI Pay', icon: CreditCard, hint: 'Payment request', pastelBg: 'bg-[#F0F9FF] dark:bg-cyan-950/40', iconColor: 'text-[#0284C7] dark:text-cyan-400' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, hint: 'Event invite', pastelBg: 'bg-[#FFF7ED] dark:bg-orange-950/40', iconColor: 'text-[#EA580C] dark:text-orange-400' },
  { id: 'location', label: 'Location', icon: MapPin, hint: 'Maps pin', pastelBg: 'bg-[#FEF2F2] dark:bg-rose-950/40', iconColor: 'text-[#E11D48] dark:text-rose-400' },
];

const COLLAPSED_VISIBLE_COUNT = 6;
const PINNED_STORAGE_KEY = 'ehsaan_qr_pinned_categories';
const EXPANDED_STORAGE_KEY = 'ehsaan_qr_categories_expanded';

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  selectedType,
  onSelectType,
  onShowToast,
}) => {
  // Load pinned categories from localStorage
  const [pinnedTypes, setPinnedTypes] = useState<QrType[]>(() => {
    try {
      const saved = localStorage.getItem(PINNED_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((id) => QR_TYPES.some((t) => t.id === id));
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Category expansion state (default collapsed to 6 to balance card height with ContentForm)
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(EXPANDED_STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // fallback
    }
    return false;
  });

  // Long-press detection refs for touch devices
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressActiveRef = useRef<boolean>(false);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Sort categories so pinned items float to the front
  const sortedTypes = useMemo(() => {
    const pinnedSet = new Set(pinnedTypes);
    const pinnedList = QR_TYPES.filter((t) => pinnedSet.has(t.id));
    const unpinnedList = QR_TYPES.filter((t) => !pinnedSet.has(t.id));
    return [...pinnedList, ...unpinnedList];
  }, [pinnedTypes]);

  // Toggle expansion state and persist
  const handleToggleExpand = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(EXPANDED_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Toggle category pin state
  const handleTogglePin = (typeId: QrType, e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setPinnedTypes((prev) => {
      const isCurrentlyPinned = prev.includes(typeId);
      let updated: QrType[];
      if (isCurrentlyPinned) {
        updated = prev.filter((id) => id !== typeId);
      } else {
        updated = [...prev, typeId];
      }

      try {
        localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }

      const typeObj = QR_TYPES.find((t) => t.id === typeId);
      const label = typeObj ? typeObj.label : typeId;
      if (onShowToast) {
        onShowToast(
          isCurrentlyPinned
            ? `Unpinned "${label}" from top categories`
            : `Pinned "${label}" to top categories 📌`
        );
      }

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(40);
        } catch {
          // ignore
        }
      }

      return updated;
    });
  };

  // Touch handlers for long-press pinning
  const handleTouchStart = (typeId: QrType, e: React.TouchEvent) => {
    isLongPressActiveRef.current = false;
    if (e.touches && e.touches[0]) {
      touchStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    longPressTimerRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      handleTogglePin(typeId);
    }, 450);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartPosRef.current.x);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartPosRef.current.y);
      // Cancel long press if user is scrolling
      if (deltaX > 10 || deltaY > 10) {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Standard category selection
  const handleTypeClick = (typeId: QrType) => {
    if (isLongPressActiveRef.current) {
      isLongPressActiveRef.current = false;
      return;
    }
    onSelectType(typeId);
  };

  const visibleTypes = isExpanded ? sortedTypes : sortedTypes.slice(0, COLLAPSED_VISIBLE_COUNT);
  const hiddenCount = sortedTypes.length - COLLAPSED_VISIBLE_COUNT;

  return (
    <div
      id="qr-type-selector-section"
      className="w-full bg-white dark:bg-zinc-900 rounded-2xl p-3.5 sm:p-5 border border-[#EDE8DF] dark:border-zinc-800 shadow-2xs transition-colors scroll-mt-20"
    >
      {/* Category Card Header: Title with arrow beside it */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0ECE1] dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E7AC08]" aria-hidden="true" />
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-[#0F172A] dark:text-zinc-100">
              QR Code Category
            </h2>
            {/* Arrow toggle directly beside QR Code Category text */}
            <button
              type="button"
              id="toggle-category-expand-btn"
              onClick={handleToggleExpand}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse extra categories' : 'Show all 12 categories'}
              title={isExpanded ? 'Collapse to top 6 categories' : 'Show all 12 categories'}
              className="inline-flex items-center justify-center p-1 rounded-lg text-[#0F172A] dark:text-zinc-200 hover:bg-[#FAF8F5] dark:hover:bg-zinc-800 border border-[#EDE8DF] dark:border-zinc-800 hover:border-[#FACC15] dark:hover:border-amber-400 transition-all cursor-pointer shadow-2xs group focus:outline-none focus:ring-2 focus:ring-[#FACC15]/50"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#D97706] dark:text-amber-400 transition-transform duration-300 group-hover:scale-110 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right side status badge and hint */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B] dark:text-zinc-400 font-medium">
            {isExpanded ? (
              <span>12 categories</span>
            ) : (
              <span>
                {pinnedTypes.length > 0 && (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold mr-1">
                    {pinnedTypes.length} pinned •
                  </span>
                )}
                {COLLAPSED_VISIBLE_COUNT} of 12
              </span>
            )}
          </span>

          {/* Quick hint badge for pinning */}
          <span
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#64748B] dark:text-zinc-400 bg-[#FAF8F5] dark:bg-zinc-800/80 px-2 py-0.5 rounded-full border border-[#EDE8DF] dark:border-zinc-800"
            title="Right-click any category card or long-press on mobile to pin/unpin it"
          >
            <Pin className="w-2.5 h-2.5 text-[#D97706] dark:text-amber-400 fill-current" />
            <span>Right-click to pin</span>
          </span>
        </div>
      </div>

      {/* Grid container: 3-column on mobile and desktop card */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-2.5">
        {visibleTypes.map((t) => {
          const Icon = t.icon;
          const isSelected = selectedType === t.id;
          const isPinned = pinnedTypes.includes(t.id);

          return (
            <button
              key={t.id}
              id={`type-select-${t.id}`}
              type="button"
              onClick={() => handleTypeClick(t.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleTogglePin(t.id, e);
              }}
              onTouchStart={(e) => handleTouchStart(t.id, e)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              title={`${t.label}: ${t.hint} • ${
                isPinned
                  ? 'Pinned to top (Right-click or hold to unpin)'
                  : 'Right-click or hold to pin to top'
              }`}
              className={`group relative flex-col items-start p-2 sm:p-3 rounded-2xl border text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/50 cursor-pointer w-full min-h-[76px] sm:min-h-[88px] select-none ${
                isSelected
                  ? 'border-[#FACC15] bg-[#FEF9C3] dark:bg-amber-950/40 text-black dark:text-zinc-100 shadow-xs ring-1 ring-[#FACC15]'
                  : 'border-[#EDE8DF] dark:border-zinc-800 bg-white dark:bg-zinc-900/70 text-[#0F172A] dark:text-zinc-200 hover:border-[#DDD7CC] dark:hover:border-zinc-700 hover:bg-[#FDFCF9] dark:hover:bg-zinc-800/50 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5 sm:mb-2">
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-[#FEF08A] text-black shadow-xs border border-[#FACC15]'
                      : `${t.pastelBg} ${t.iconColor} group-hover:scale-105 transition-transform`
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? 'text-black stroke-[2.4]' : ''}`} />
                </div>

                <div className="flex items-center gap-1">
                  {/* Pin button / status icon */}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => handleTogglePin(t.id, e)}
                    title={
                      isPinned
                        ? 'Pinned to top (Click or right-click to unpin)'
                        : 'Pin to top (Click or right-click to pin)'
                    }
                    aria-label={isPinned ? `Unpin ${t.label}` : `Pin ${t.label} to top`}
                    className={`p-0.5 rounded transition-all cursor-pointer ${
                      isPinned
                        ? 'text-[#D97706] dark:text-amber-400 opacity-100 scale-105'
                        : 'text-zinc-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-[#D97706] dark:hover:text-amber-400'
                    }`}
                  >
                    <Pin className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
                  </span>

                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-black ring-2 ring-[#FEF08A] shrink-0" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 w-full">
                <span
                  className={`text-[11px] sm:text-xs font-bold leading-tight line-clamp-1 ${
                    isSelected ? 'text-black dark:text-zinc-100' : 'text-[#0F172A] dark:text-zinc-100'
                  }`}
                >
                  {t.label}
                </span>
              </div>
              <span
                className={`text-[9px] sm:text-[10px] leading-tight mt-0.5 line-clamp-1 font-medium ${
                  isSelected ? 'text-zinc-800 dark:text-zinc-300' : 'text-[#64748B] dark:text-zinc-400'
                }`}
              >
                {t.hint}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expand / Collapse bottom toggle button for convenience */}
      <button
        type="button"
        id="toggle-category-expand-bottom-btn"
        onClick={handleToggleExpand}
        aria-expanded={isExpanded}
        className="w-full mt-2.5 py-1.5 px-3 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-900/80 hover:bg-[#F3EFEA] dark:hover:bg-zinc-800 text-[11px] font-semibold text-[#64748B] dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-98"
      >
        <span>
          {isExpanded
            ? 'Collapse to top 6 categories'
            : `Show all 12 categories (+${hiddenCount} more)`}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[#D97706] dark:text-amber-400 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
    </div>
  );
};

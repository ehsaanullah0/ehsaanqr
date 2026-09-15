import React, { useState, useRef, useEffect } from 'react';
import { ColorPalettePicker } from './ColorPalettePicker';
import { Palette, X } from 'lucide-react';

export interface ColorPickerFieldProps {
  id?: string;
  label?: string;
  color: string;
  onChange: (hex: string) => void;
  disabled?: boolean;
  disabledLabel?: string;
  pickerTitle?: string;
  extraAction?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  id,
  label,
  color,
  onChange,
  disabled = false,
  disabledLabel,
  pickerTitle,
  extraAction,
  className = '',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const safeColor = color || '#000000';

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('touchstart', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleManualHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#') && val.length > 0) {
      val = `#${val}`;
    }
    onChange(val);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Label and optional extra action row */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[#0F172A] dark:text-zinc-300">
            {label}
          </label>
          <div className="flex items-center gap-2">
            {extraAction}
            <span className="text-[10px] font-mono text-[#64748B] dark:text-zinc-400 uppercase">
              {disabled && disabledLabel ? disabledLabel : safeColor}
            </span>
          </div>
        </div>
      )}

      {/* Trigger Row: Swatch Button + Hex Text Input */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          id={id ? `${id}-swatch-btn` : undefined}
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          title={`Choose ${label || 'color'} with palette selector`}
          className={`relative group shrink-0 rounded-xl border border-[#CBD5E1] dark:border-zinc-700 p-0.5 transition-all shadow-2xs hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E7AC08] ${
            size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
          } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          style={{ backgroundColor: disabled ? '#E4E4E7' : safeColor }}
        >
          {/* Subtle overlay icon on hover */}
          {!disabled && (
            <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <Palette className="w-3.5 h-3.5 text-white drop-shadow-xs" />
            </div>
          )}
        </button>

        <input
          type="text"
          id={id ? `${id}-text-input` : undefined}
          disabled={disabled}
          value={disabled && disabledLabel ? disabledLabel : safeColor}
          onChange={handleManualHexChange}
          placeholder="#000000"
          className={`w-full rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FAF8F5] dark:bg-zinc-900 font-mono text-[#0F172A] dark:text-zinc-100 uppercase focus:outline-none focus:ring-1 focus:ring-[#E7AC08] transition-all ${
            size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs'
          } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        />
      </div>

      {/* Popover / Modal Color Palette Picker */}
      {isOpen && !disabled && (
        <>
          {/* Mobile Backdrop Modal (on screens below sm <640px) */}
          <div
            className="fixed inset-0 z-50 flex sm:hidden items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="w-full max-w-xs animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <ColorPalettePicker
                color={safeColor}
                onChange={onChange}
                onClose={() => setIsOpen(false)}
                title={pickerTitle || label || 'Color Palette Selector'}
                className="mx-auto"
              />
            </div>
          </div>

          {/* Desktop & Tablet Popover (on screens sm >=640px) */}
          <div
            className="hidden sm:block absolute left-0 top-full mt-2 z-50 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <ColorPalettePicker
              color={safeColor}
              onChange={onChange}
              onClose={() => setIsOpen(false)}
              title={pickerTitle || label || 'Color Palette Selector'}
            />
          </div>
        </>
      )}
    </div>
  );
};

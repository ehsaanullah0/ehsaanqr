import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pipette, ArrowUpDown, X, Check } from 'lucide-react';
import {
  hexToRgb,
  rgbToHex,
  hexToHsv,
  hsvToRgb,
  hsvToHex,
  RGB,
  HSV,
} from '../utils/colorConverter';

export interface ColorPalettePickerProps {
  color: string;
  onChange: (hex: string) => void;
  onClose?: () => void;
  title?: string;
  className?: string;
}

const QUICK_SWATCHES = [
  '#000000',
  '#18181B',
  '#3F3F46',
  '#71717A',
  '#A1A1AA',
  '#D4D4D8',
  '#F4F4F5',
  '#FFFFFF',
  '#E7AC08',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#8B5CF6',
  '#3B82F6',
  '#06B6D4',
  '#10B981',
];

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  color,
  onChange,
  onClose,
  title,
  className = '',
}) => {
  // Normalize input color to uppercase 6-digit hex
  const safeHex = (color && color.startsWith('#') ? color : `#${color || '000000'}`).toUpperCase();

  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(safeHex));
  const [format, setFormat] = useState<'hex' | 'rgb'>('rgb');
  const [rgbInput, setRgbInput] = useState<RGB>(() => hexToRgb(safeHex));
  const [hexInput, setHexInput] = useState<string>(safeHex);

  const satValBoxRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const isDraggingSatVal = useRef<boolean>(false);
  const isDraggingHue = useRef<boolean>(false);

  // Sync internal state if external color changes
  useEffect(() => {
    const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v);
    if (currentHex.toUpperCase() !== safeHex) {
      const newHsv = hexToHsv(safeHex);
      setHsv(newHsv);
      setRgbInput(hexToRgb(safeHex));
      setHexInput(safeHex);
    }
  }, [safeHex]);

  // Handle HSV change
  const handleHsvUpdate = useCallback(
    (newHsv: HSV) => {
      setHsv(newHsv);
      const newRgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      setRgbInput(newRgb);
      setHexInput(newHex);
      onChange(newHex);
    },
    [onChange]
  );

  // 2D Saturation / Value drag handler
  const updateSatValFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      if (!satValBoxRef.current) return;
      const rect = satValBoxRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const s = Math.round((x / rect.width) * 100);
      const v = Math.round((1 - y / rect.height) * 100);

      handleHsvUpdate({ ...hsv, s, v });
    },
    [hsv, handleHsvUpdate]
  );

  // Hue slider drag handler
  const updateHueFromEvent = useCallback(
    (clientX: number) => {
      if (!hueSliderRef.current) return;
      const rect = hueSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const h = Math.round((x / rect.width) * 360) % 360;

      handleHsvUpdate({ ...hsv, h });
    },
    [hsv, handleHsvUpdate]
  );

  // Global pointer event listeners during drag
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingSatVal.current) {
        updateSatValFromEvent(e.clientX, e.clientY);
      } else if (isDraggingHue.current) {
        updateHueFromEvent(e.clientX);
      }
    };

    const handlePointerUp = () => {
      isDraggingSatVal.current = false;
      isDraggingHue.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [updateSatValFromEvent, updateHueFromEvent]);

  // Touch fallback listeners for mobile/tablet compatibility
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingSatVal.current && e.touches[0]) {
        updateSatValFromEvent(e.touches[0].clientX, e.touches[0].clientY);
      } else if (isDraggingHue.current && e.touches[0]) {
        updateHueFromEvent(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      isDraggingSatVal.current = false;
      isDraggingHue.current = false;
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [updateSatValFromEvent, updateHueFromEvent]);

  // EyeDropper API Support
  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const pickedHex = result.sRGBHex.toUpperCase();
          const newHsv = hexToHsv(pickedHex);
          handleHsvUpdate(newHsv);
        }
      } catch {
        // User cancelled eye dropper
      }
    }
  };

  // RGB input changes
  const handleRgbChange = (channel: keyof RGB, value: string) => {
    const num = parseInt(value, 10);
    const validNum = isNaN(num) ? 0 : Math.max(0, Math.min(255, num));
    const newRgb = { ...rgbInput, [channel]: validNum };
    setRgbInput(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHexInput(newHex);
    setHsv(hexToHsv(newHex));
    onChange(newHex);
  };

  // HEX input changes
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = `#${val}`;
    setHexInput(val);

    const clean = val.replace(/^#/, '');
    if (clean.length === 6 && /^[0-9A-Fa-f]{6}$/.test(clean)) {
      const formatted = `#${clean.toUpperCase()}`;
      setHsv(hexToHsv(formatted));
      setRgbInput(hexToRgb(formatted));
      onChange(formatted);
    }
  };

  const currentColorHex = hsvToHex(hsv.h, hsv.s, hsv.v);
  const huePureColor = `hsl(${hsv.h}, 100%, 50%)`;
  const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window;

  return (
    <div
      id="color-palette-picker-container"
      className={`w-full max-w-[320px] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-[#EDE8DF] dark:border-zinc-800 p-3 select-none flex flex-col gap-3 transition-all ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Optional Header with title and close button */}
      {(title || onClose) && (
        <div className="flex items-center justify-between pb-1 border-b border-[#EDE8DF] dark:border-zinc-800">
          <span className="text-xs font-bold text-[#0F172A] dark:text-zinc-200 truncate">
            {title || 'Color Palette Selector'}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-zinc-200 hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close color picker"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 2D Saturation-Brightness Spectrum Box */}
      <div
        ref={satValBoxRef}
        id="color-spectrum-2d-box"
        className="relative w-full h-44 rounded-xl cursor-crosshair overflow-hidden touch-none shadow-inner border border-black/10 dark:border-white/10"
        style={{
          backgroundColor: huePureColor,
        }}
        onPointerDown={(e) => {
          isDraggingSatVal.current = true;
          updateSatValFromEvent(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          isDraggingSatVal.current = true;
          if (e.touches[0]) {
            updateSatValFromEvent(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
      >
        {/* Horizontal White to Transparent Gradient (Saturation) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
          }}
        />
        {/* Vertical Black to Transparent Gradient (Value / Brightness) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #000000 0%, rgba(0, 0, 0, 0) 100%)',
          }}
        />

        {/* Draggable Circle Ring Handle */}
        <div
          className="absolute w-5 h-5 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.6)] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform active:scale-125"
          style={{
            left: `${hsv.s}%`,
            top: `${100 - hsv.v}%`,
            backgroundColor: currentColorHex,
          }}
        />
      </div>

      {/* Controls Bar: EyeDropper + Color Swatch Preview + Rainbow Hue Slider */}
      <div className="flex items-center gap-2.5">
        {/* Eyedropper Tool */}
        <button
          type="button"
          id="btn-color-eyedropper"
          disabled={!hasEyeDropper}
          onClick={handleEyeDropper}
          title={hasEyeDropper ? 'Pick color from screen' : 'Eyedropper not supported in this browser'}
          className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
            hasEyeDropper
              ? 'border-[#EDE8DF] dark:border-zinc-700 bg-[#FAF8F5] dark:bg-zinc-800 text-[#0F172A] dark:text-zinc-200 hover:bg-[#F4F4F5] active:scale-95'
              : 'border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5]/50 dark:bg-zinc-800/40 text-[#A1A1AA] cursor-not-allowed opacity-50'
          }`}
        >
          <Pipette className="w-4 h-4" />
        </button>

        {/* Current Color Circle Preview */}
        <div
          id="color-preview-circle"
          className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-700 shadow-md shrink-0 transition-colors"
          style={{ backgroundColor: currentColorHex }}
        />

        {/* Rainbow Hue Slider Bar */}
        <div
          ref={hueSliderRef}
          id="color-hue-slider"
          className="relative flex-1 h-3.5 rounded-full cursor-pointer touch-none border border-black/10 shadow-inner"
          style={{
            background:
              'linear-gradient(to right, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)',
          }}
          onPointerDown={(e) => {
            isDraggingHue.current = true;
            updateHueFromEvent(e.clientX);
          }}
          onTouchStart={(e) => {
            isDraggingHue.current = true;
            if (e.touches[0]) {
              updateHueFromEvent(e.touches[0].clientX);
            }
          }}
        >
          {/* Draggable Hue Circle Handle */}
          <div
            className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${(hsv.h / 360) * 100}%`,
              backgroundColor: huePureColor,
            }}
          />
        </div>
      </div>

      {/* Inputs Section (RGB or HEX Mode) */}
      <div className="flex items-center gap-2 pt-0.5">
        {format === 'rgb' ? (
          <div className="grid grid-cols-3 gap-1.5 flex-1">
            {(['r', 'g', 'b'] as Array<keyof RGB>).map((channel) => (
              <div key={channel} className="flex flex-col items-center">
                <input
                  type="number"
                  min="0"
                  max="255"
                  id={`input-rgb-${channel}`}
                  value={rgbInput[channel]}
                  onChange={(e) => handleRgbChange(channel, e.target.value)}
                  className="w-full text-center px-1 py-1 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 bg-[#FAF8F5] dark:bg-zinc-800 text-xs font-mono font-semibold text-[#0F172A] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#E7AC08]"
                />
                <span className="text-[10px] uppercase font-bold text-[#71717A] mt-0.5">
                  {channel}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <input
              type="text"
              id="input-hex-formatted"
              value={hexInput}
              onChange={handleHexInputChange}
              className="w-full text-center px-2 py-1 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 bg-[#FAF8F5] dark:bg-zinc-800 text-xs font-mono font-semibold text-[#0F172A] dark:text-zinc-100 uppercase focus:outline-none focus:ring-1 focus:ring-[#E7AC08]"
            />
            <span className="text-[10px] text-center uppercase font-bold text-[#71717A] mt-0.5">
              HEX
            </span>
          </div>
        )}

        {/* Format Toggle Button (RGB <-> HEX) */}
        <button
          type="button"
          id="btn-toggle-color-format"
          onClick={() => setFormat((prev) => (prev === 'rgb' ? 'hex' : 'rgb'))}
          title={`Switch to ${format === 'rgb' ? 'HEX' : 'RGB'} format`}
          className="p-1.5 rounded-lg border border-[#EDE8DF] dark:border-zinc-700 text-[#71717A] hover:text-[#0F172A] dark:hover:text-zinc-200 hover:bg-[#FAF8F5] dark:hover:bg-zinc-800 transition-colors flex flex-col items-center justify-center mb-4"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Color Swatches Palette */}
      <div className="pt-1 border-t border-[#EDE8DF] dark:border-zinc-800">
        <div className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Quick Palette</span>
          <span className="font-mono text-[9px] uppercase">{currentColorHex}</span>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {QUICK_SWATCHES.map((swatchHex) => {
            const isSelected = currentColorHex.toUpperCase() === swatchHex.toUpperCase();
            return (
              <button
                key={swatchHex}
                type="button"
                title={swatchHex}
                onClick={() => {
                  const newHsv = hexToHsv(swatchHex);
                  handleHsvUpdate(newHsv);
                }}
                className={`w-6 h-6 rounded-md border transition-transform hover:scale-115 active:scale-95 flex items-center justify-center ${
                  isSelected
                    ? 'border-[#E7AC08] ring-2 ring-[#E7AC08] ring-offset-1 dark:ring-offset-zinc-900 scale-105'
                    : 'border-black/10 dark:border-white/10 hover:border-black/30'
                }`}
                style={{ backgroundColor: swatchHex }}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 ${
                      swatchHex === '#FFFFFF' || swatchHex === '#F4F4F5' || swatchHex === '#D4D4D8'
                        ? 'text-black'
                        : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Apply / Done Button for Mobile / Popover */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-full py-1.5 rounded-xl bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] text-xs font-bold hover:opacity-90 transition-opacity mt-1 shadow-sm"
        >
          Apply Color
        </button>
      )}
    </div>
  );
};

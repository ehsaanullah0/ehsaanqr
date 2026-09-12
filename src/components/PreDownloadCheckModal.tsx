import React, { useEffect } from 'react';
import { ExportFormat } from '../types';
import {
  X,
  ScanLine,
  Download,
  ShieldCheck,
} from 'lucide-react';

interface PreDownloadCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestQr: () => void;
  onProceedDownload: () => void;
  isExporting: boolean;
  format: ExportFormat;
  resolution: number;
  payload: string;
  dontShowAgain: boolean;
  onToggleDontShowAgain: (val: boolean) => void;
}

export const PreDownloadCheckModal: React.FC<PreDownloadCheckModalProps> = ({
  isOpen,
  onClose,
  onTestQr,
  onProceedDownload,
  isExporting,
  format,
  resolution,
  dontShowAgain,
  onToggleDontShowAgain,
}) => {
  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pre-download-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="pre-download-modal-card"
        className="relative w-full max-w-[360px] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden transition-all"
      >
        {/* Subtle Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500" />

        {/* Close Button */}
        <button
          type="button"
          id="btn-close-predownload-modal"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Header */}
          <div className="flex items-start gap-2.5 pr-5">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200/80 dark:border-red-900/50 flex items-center justify-center shrink-0">
              <ScanLine className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">
                <ShieldCheck className="w-3 h-3" />
                <span>Quick Check</span>
              </div>
              <h3
                id="pre-download-title"
                className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight"
              >
                Please test the QR code before download
              </h3>
            </div>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
            Run a quick test to ensure your custom style, contrast, and layout decode smoothly on all devices.
          </p>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {/* Primary: Test QR Code */}
            <button
              type="button"
              id="btn-modal-test-qr"
              onClick={onTestQr}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <ScanLine className="w-4 h-4" />
              <span>Test QR Code Now</span>
            </button>

            {/* Secondary: Direct Download */}
            <button
              type="button"
              id="btn-modal-proceed-download"
              disabled={isExporting}
              onClick={onProceedDownload}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>
                {isExporting ? 'Exporting...' : `Skip Test & Download (${format.toUpperCase()})`}
              </span>
            </button>
          </div>

          {/* Session Checkbox */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                id="checkbox-dont-show-test-prompt"
                checked={dontShowAgain}
                onChange={(e) => onToggleDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-600 text-red-600 focus:ring-red-500"
              />
              <span>Don't show again this session</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

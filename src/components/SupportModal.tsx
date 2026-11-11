import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Heart,
  X,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Coffee,
  Coins,
  ArrowLeft,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { EhsaanFlameIcon } from './EhsaanLogo';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string) => void;
  initialView?: 'note' | 'qr';
}

const UPI_ID = '9454989954@fam';
const UPI_PAY_URL = 'upi://pay?pa=9454989954%40fam&cu=INR';

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  initialView = 'note',
}) => {
  const [view, setView] = useState<'note' | 'qr'>('note');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset to initial view whenever opened
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setCopied(false);
    }
  }, [isOpen, initialView]);

  // Generate QR Code with high quality and custom center logo
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function generateQr() {
      try {
        const qrCanvas = document.createElement('canvas');
        await QRCode.toCanvas(qrCanvas, UPI_PAY_URL, {
          width: 340,
          margin: 1,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#0F172A',
            light: '#FFFFFF',
          },
        });

        const ctx = qrCanvas.getContext('2d');
        if (ctx) {
          const center = qrCanvas.width / 2;
          const radius = 32;

          // Outer circular white buffer to clear QR modules
          ctx.beginPath();
          ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          // Load and draw the official logo
          const logoImg = new Image();
          logoImg.src = '/assets/aistudio/logo-transparent.png?v=5.0.0';
          await new Promise<void>((resolve) => {
            logoImg.onload = () => {
              ctx.drawImage(logoImg, center - radius, center - radius, radius * 2, radius * 2);
              resolve();
            };
            logoImg.onerror = () => {
              // Fallback drawn logo
              ctx.beginPath();
              ctx.arc(center, center, radius, 0, Math.PI * 2);
              ctx.fillStyle = '#e9fa00';
              ctx.fill();
              ctx.fillStyle = '#FFFFFF';
              ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('Q', center, center + 1);
              resolve();
            };
          });
        }

        if (isMounted) {
          setQrDataUrl(qrCanvas.toDataURL('image/png'));
        }
      } catch (err) {
        console.error('Failed to generate UPI QR code:', err);
      }
    }

    generateQr();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    if (onShowToast) {
      onShowToast('UPI ID copied: ' + UPI_ID);
    }
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSupportViaUpi = () => {
    // Attempt UPI link
    window.location.href = UPI_PAY_URL;
    if (onShowToast) {
      onShowToast('Opening UPI payment app...');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="support-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      onClick={onClose}
    >
      {view === 'note' ? (
        /* NOTE VIEW (Exact match to Image 1) */
        <div
          id="support-note-modal-card"
          className="relative w-full max-w-[460px] bg-white dark:bg-zinc-900 rounded-[28px] p-5 sm:p-6 shadow-2xl border border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 transition-all transform scale-100 animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            id="support-modal-close-btn"
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF7E8] dark:bg-amber-950/40 border border-[#FDE68A]/80 dark:border-amber-800/60 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-[#F59E0B] fill-[#F59E0B]/10" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Support Ehsaan QR
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#EAB308] text-zinc-950 text-xs font-black tracking-wide shadow-2xs">
                  ₹20
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                Help keep this tool 100% free, private & mature
              </p>
            </div>
          </div>

          {/* Support Request Note Box */}
          <div className="mt-4 p-4 rounded-2xl bg-[#FFFDF7] dark:bg-amber-950/20 border border-[#FDE68A] dark:border-amber-900/50 space-y-2 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#B45309] dark:text-amber-400">
              <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>Support Request Note</span>
            </div>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-snug">
              Please support <span className="font-extrabold text-[#D97706] dark:text-amber-400">20 RS</span> to make this app free, fast, and mature!
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              Ehsaan QR runs completely in your browser without tracking, subscriptions, or ads. Your small support powers ongoing development, new format decoders, and lossless algorithms.
            </p>
          </div>

          {/* Value Prop Pills */}
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Zero server cost</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>100% Privacy</span>
            </div>
          </div>

          {/* UPI ID / Contribution Box */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold px-0.5">
              <span className="text-zinc-700 dark:text-zinc-300">UPI ID / Contribution</span>
              <span className="text-[#D97706] dark:text-amber-400 font-bold">₹20 or any amount</span>
            </div>
            <div className="flex items-center justify-between gap-2 p-1.5 pl-3 rounded-xl bg-[#F8FAFC] dark:bg-zinc-800/80 border border-zinc-200/90 dark:border-zinc-700">
              <div className="flex items-center gap-2 min-w-0">
                <Coins className="w-4 h-4 text-[#D97706] shrink-0" />
                <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                  {UPI_ID}
                </span>
              </div>
              <button
                id="btn-copy-upi-note"
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EAB308] hover:bg-[#CA8A04] active:bg-[#A16207] text-zinc-950 text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy UPI'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2.5 mt-5">
            <button
              id="btn-support-via-upi-app"
              type="button"
              onClick={handleSupportViaUpi}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E5A93C] hover:bg-[#D99A2D] active:bg-[#C2841A] text-zinc-950 font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Coffee className="w-4 h-4 shrink-0" />
              <span>Support via UPI App</span>
            </button>
            <button
              id="btn-support-close-note"
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Bottom Link to QR Window */}
          <div className="mt-4 text-center">
            <button
              id="btn-switch-to-qr"
              type="button"
              onClick={() => setView('qr')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B45309] dark:text-amber-400 hover:text-[#92400E] dark:hover:text-amber-300 transition-colors cursor-pointer group"
            >
              <QrCode className="w-4 h-4 text-[#D97706] group-hover:scale-110 transition-transform shrink-0" />
              <span>Direct payment not working?</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-normal">(Scan QR Code)</span>
            </button>
          </div>
        </div>
      ) : (
        /* QR SCAN WINDOW (Exact match to Image 2) */
        <div
          id="support-qr-modal-card"
          className="relative w-full max-w-[380px] bg-[#FFFDF7] dark:bg-zinc-900 rounded-[28px] p-6 shadow-2xl border-2 border-[#FDE68A] dark:border-amber-800/80 text-center text-zinc-900 dark:text-zinc-100 transition-all transform scale-100 animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            id="support-qr-close-btn"
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-amber-100/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5A93C] text-zinc-950 text-[11px] font-extrabold uppercase tracking-wide shadow-2xs mb-2">
            <QrCode className="w-3.5 h-3.5 shrink-0" />
            <span>UPI SCAN & PAY</span>
          </div>

          {/* Heading & Subtitle */}
          <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
            Scan to Support ₹20
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1 leading-snug px-2">
            Open Google Pay, PhonePe, Paytm, FamPay, or any UPI app
          </p>

          {/* QR Code Container with Frame */}
          <div className="my-4 p-3.5 rounded-3xl bg-white dark:bg-zinc-800 border border-amber-200/70 dark:border-zinc-700 shadow-sm inline-block">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="UPI Payment QR Code"
                className="w-56 h-56 sm:w-60 sm:h-60 mx-auto rounded-xl object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* UPI ID Row */}
          <div className="flex items-center justify-between gap-2 p-1.5 pl-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mb-4">
            <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
              {UPI_ID}
            </span>
            <button
              id="btn-copy-upi-qr"
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#EAB308] hover:bg-[#CA8A04] active:bg-[#A16207] text-zinc-950 text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Back to Support Note Button */}
          <button
            id="btn-back-to-support-note"
            type="button"
            onClick={() => setView('note')}
            className="w-full py-3 px-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 active:bg-zinc-900 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
          >
            Back to Support Note
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  X,
  ArrowRight,
  Check,
  Mail,
  Copy,
  AlertCircle,
  ArrowLeft,
  Coins,
  Sparkles,
  KeyRound,
  ExternalLink,
  Crown,
} from 'lucide-react';
import { ExclusiveCrownBadge } from './ExclusiveCrownBadge';
import { validateUnlockCode } from '../utils/exclusiveAccess';

interface ExclusiveAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
  featureName?: string;
  initialStep?: 'initial' | 'code';
  onOpenOverview?: () => void;
}

export const ExclusiveAccessModal: React.FC<ExclusiveAccessModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  featureName,
  initialStep = 'initial',
  onOpenOverview,
}) => {
  const [step, setStep] = useState<'initial' | 'code' | 'success'>(initialStep);
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep || 'initial');
      setDigits(['', '', '', '', '', '']);
      setErrorMessage('');
      setCopiedEmail(false);
    }
  }, [isOpen, initialStep]);

  useEffect(() => {
    if (step === 'code' && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    }
  }, [step]);

  // Handle ESC key
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

  const handleContactDeveloper = () => {
    const email = 'worsmon@Proton.me';
    const subject = encodeURIComponent('Request for Exclusive Access Code (₹20)');
    const body = encodeURIComponent(
      `Hello,\n\nI would like to get the exclusive access code (₹20) for your QR app. Please let me know.\n\nThank you!`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('worsmon@Proton.me');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/[^0-9]/g, '');
    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    if (cleanVal.length > 1) {
      // Pasted multiple digits
      const pastedDigits = cleanVal.slice(0, 6).split('');
      const newDigits = [...digits];
      pastedDigits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setDigits(newDigits);
      setErrorMessage('');
      const nextFocus = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanVal[cleanVal.length - 1];
    setDigits(newDigits);
    setErrorMessage('');

    // Advance to next box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setErrorMessage('Please enter all 6 digits of your access code.');
      return;
    }

    if (validateUnlockCode(fullCode)) {
      setErrorMessage('');
      setStep('success');
    } else {
      setErrorMessage('Invalid code. Please try again.');
    }
  };

  const handleCompleteUnlock = () => {
    onUnlockSuccess();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exclusive-modal-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'success') onClose();
      }}
    >
      <div
        id="exclusive-access-modal-card"
        className="relative w-full max-w-[390px] sm:max-w-[410px] bg-white dark:bg-zinc-900 rounded-3xl border border-[#FDE68A] dark:border-amber-900/60 shadow-2xl overflow-hidden transition-all duration-200"
      >
        {/* Soft Golden Header Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FDE68A] via-[#E7AC08] to-[#FDE68A]" />

        {/* Close Button */}
        <button
          type="button"
          id="btn-close-exclusive-modal"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-[#FFFBEA] dark:hover:bg-zinc-800 transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: INITIAL POPUP (FEATURE LOCKED) */}
        {step === 'initial' && (
          <div className="p-6 sm:p-7 text-center animate-in fade-in duration-200">
            {/* Top Amber Crown Icon Badge */}
            <div className="w-13 h-13 rounded-2xl bg-[#FFF7D9] dark:bg-amber-950/60 border border-[#FDE68A] dark:border-amber-800/80 flex items-center justify-center mx-auto text-[#D97706] dark:text-amber-400 shadow-xs mb-3.5">
              <Crown className="w-7 h-7 stroke-[2.2]" />
            </div>

            {/* Header Titles */}
            <h3
              id="exclusive-modal-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Exclusive Feature
            </h3>
            <p className="text-xs font-semibold text-[#B45309] dark:text-amber-400 mt-0.5">
              Unlock this feature
            </p>

            {featureName && (
              <div className="mt-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFFBEA] dark:bg-amber-950/40 text-[#92400E] dark:text-amber-300 border border-[#FDE68A] dark:border-amber-800/50 text-[10px] font-bold">
                  {featureName}
                </span>
              </div>
            )}

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed px-2">
              This feature is available exclusively through developer access.
            </p>

            {/* Subtle Price & Explanation Box with Light Yellow background */}
            <div className="my-4 p-3.5 rounded-2xl bg-[#FFFDF5] dark:bg-amber-950/30 border border-[#FDE68A] dark:border-amber-900/60 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <ExclusiveCrownBadge size="sm" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFFBEA] dark:bg-amber-950/80 text-[#92400E] dark:text-amber-300 border border-[#FDE68A]/80 font-bold">
                  One-time unlock
                </span>
              </div>

              {/* Direct Payment Note */}
              <div className="p-2.5 rounded-xl bg-[#FFF7D9] dark:bg-amber-950/60 border border-[#FDE68A] dark:border-amber-800/80 text-xs text-[#78350F] dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#92400E] dark:text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#E7AC08] shrink-0" />
                  <span>Important Note:</span>
                </div>
                <p className="leading-relaxed font-medium pl-5 text-[11px]">
                  Pay directly 20rs and send screenshot to the developer for code.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-0.5">
              <a
                id="btn-pay-directly"
                href="https://ehsaan.odoo.com/about-us"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] font-extrabold text-xs sm:text-sm shadow-sm shadow-[#E7AC08]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <span>PAY DIRECTLY</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                id="btn-contact-developer"
                onClick={handleContactDeveloper}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#FFFDF5] hover:bg-[#FFF7D9] dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-[#FDE68A] dark:border-zinc-700 text-[#92400E] dark:text-amber-300 font-bold text-xs transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Send Screenshot to Developer</span>
              </button>

              <button
                type="button"
                id="btn-show-code-input"
                onClick={() => setStep('code')}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#FFFBEA] hover:bg-[#FEF08A] dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-[#FDE68A] dark:border-zinc-700 text-[#92400E] dark:text-amber-300 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-400" />
                <span>Already have a code?</span>
              </button>
            </div>

            {/* Micro Email Helper & Overview Link */}
            <div className="mt-3.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-1.5 items-center text-[11px]">
              {onOpenOverview && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenOverview();
                  }}
                  className="inline-flex items-center gap-1 text-[#B45309] dark:text-amber-400 hover:text-[#92400E] dark:hover:text-amber-300 font-semibold cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#E7AC08]" />
                  <span>Explain all 8 exclusive features & theme choice →</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                <span className="font-mono">worsmon@Proton.me</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium cursor-pointer"
                >
                  {copiedEmail ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ENTER ACCESS CODE (OTP STYLE 6 BOXES) */}
        {step === 'code' && (
          <div className="p-6 sm:p-7 text-center animate-in fade-in duration-200">
            {/* Top Amber Lock Icon Badge */}
            <div className="w-13 h-13 rounded-2xl bg-[#FFF7D9] dark:bg-amber-950/60 border border-[#FDE68A] dark:border-amber-800/80 flex items-center justify-center mx-auto text-[#D97706] dark:text-amber-400 shadow-xs mb-3.5">
              <Lock className="w-6 h-6" />
            </div>

            {/* Header Titles */}
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Enter Access Code
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 px-3">
              Enter your 6-digit code to unlock all exclusive features.
            </p>

            {/* 6 Individual Code Boxes */}
            <form onSubmit={handleVerifyCode} className="mt-5 space-y-4">
              <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                    className={`h-12 w-full text-center text-lg sm:text-xl font-bold font-mono rounded-xl border transition-all duration-150 focus:outline-none ${
                      errorMessage
                        ? 'border-rose-400 dark:border-rose-600 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300'
                        : digit
                        ? 'border-[#E7AC08] dark:border-[#E7AC08] bg-[#FFFDF5] dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs ring-2 ring-[#E7AC08]/40'
                        : 'border-[#EDE8DF] dark:border-zinc-700 bg-[#FAF8F5]/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:border-[#E7AC08] focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-[#E7AC08]/30'
                    }`}
                  />
                ))}
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-center gap-1.5 font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                id="btn-verify-access-code"
                className="w-full py-3 px-4 rounded-2xl bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] font-bold text-xs sm:text-sm shadow-sm shadow-[#E7AC08]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                Verify Code
              </button>

              {/* Back Button */}
              <button
                type="button"
                id="btn-back-to-initial"
                onClick={() => {
                  setErrorMessage('');
                  setStep('initial');
                }}
                className="w-full py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS (FEATURES UNLOCKED) */}
        {step === 'success' && (
          <div className="p-7 sm:p-8 text-center animate-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Confetti Particles SVG graphics */}
            <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute top-1 left-2 w-2 h-2 rounded-full bg-[#E7AC08] animate-bounce" />
                <span className="absolute top-3 right-2 w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span className="absolute bottom-2 left-3 w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="absolute bottom-1 right-3 w-2 h-2 rounded-full bg-teal-400" />
                <span className="absolute top-0 right-6 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="absolute bottom-4 left-0 w-2 h-2 rounded-full bg-purple-400" />
              </div>

              {/* Big Green Circle with Checkmark */}
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
            </div>

            {/* Success Titles */}
            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Exclusive Access Unlocked!
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              All exclusive features are now available.
            </p>

            {/* Confirmation Pill */}
            <div className="my-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                Enjoy your exclusive access!
              </span>
            </div>

            {/* Got it CTA */}
            <button
              type="button"
              id="btn-complete-unlock-got-it"
              onClick={handleCompleteUnlock}
              className="w-full py-3 px-6 rounded-2xl bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] font-bold text-xs sm:text-sm shadow-sm shadow-[#E7AC08]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Download, Sparkles, Smartphone, Monitor, CheckCircle2, X, AlertCircle, Share2 } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { EhsaanFlameIcon } from './EhsaanLogo';

interface PwaInstallBannerProps {
  onShowToast?: (message: string) => void;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({ onShowToast }) => {
  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePwaInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // If already running as an installed PWA, do not render anything
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setInfoMessage(null);

    // If on iOS, show platform-appropriate instructions without pretending automatic install is available
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    if (isInstallable) {
      const result = await triggerInstall();
      if (result === 'accepted') {
        onShowToast?.('Ehsaan QR installed successfully!');
      } else if (result === 'dismissed') {
        onShowToast?.('Installation prompt was dismissed.');
      }
    } else {
      // Browser does not expose programmatic beforeinstallprompt (e.g. Firefox, or within iframe preview)
      setInfoMessage(
        'Direct installation is not supported by your current browser window or preview. Open in Chrome, Edge, or a supported browser tab to install.'
      );
      onShowToast?.('Direct installation is not supported in this browser window.');
    }
  };

  return (
    <section
      id="pwa-install-section"
      aria-label="Install Ehsaan QR App"
      className="relative overflow-hidden rounded-2xl border border-[#D5CEBF] dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 sm:p-5 shadow-sm transition-all hover:border-[#E7AC08] dark:hover:border-[#E7AC08]/50"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side: App identity & install description */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FFF8D6] dark:bg-amber-950/40 border border-[#E7AC08]/50 flex items-center justify-center shrink-0 shadow-xs">
            <EhsaanFlameIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-zinc-100 flex items-center gap-1.5">
                <span>Install Ehsaan QR</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7AC08]/20 text-[#854D0E] dark:text-amber-300 border border-[#E7AC08]/40">
                  PWA
                </span>
              </h3>
              <span className="hidden sm:inline-block text-zinc-400 dark:text-zinc-600">•</span>
              <span className="text-[11px] font-semibold text-[#334155] dark:text-zinc-300">
                Native app-like standalone experience
              </span>
            </div>
            <p className="mt-0.5 text-xs font-medium text-[#334155] dark:text-zinc-300 leading-relaxed">
              Install directly to your device for instant launch, distraction-free standalone window, and offline support.
            </p>
          </div>
        </div>

        {/* Right Side: Install Button & Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          <button
            id="pwa-install-app-btn"
            type="button"
            onClick={handleInstallClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-all shadow-sm active:scale-98 cursor-pointer group"
            title="Install Ehsaan QR directly on your device"
          >
            <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Install App</span>
          </button>
        </div>
      </div>

      {/* Unsupported browser or sandbox notification (clean, graceful inline message without breaking) */}
      {infoMessage && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs font-medium text-amber-950 dark:text-amber-200 flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setInfoMessage(null)}
            className="text-amber-900 dark:text-amber-300 hover:underline text-[11px] shrink-0 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Minimal iOS Safari Modal / Instruction Guide */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-2xl border border-zinc-300 dark:border-zinc-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFFBEA] dark:bg-zinc-800 border border-[#E7AC08]/40 flex items-center justify-center text-[#E7AC08]">
                  <Share2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-[#0F172A] dark:text-zinc-100">
                  Install on iOS Safari
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-medium text-[#334155] dark:text-zinc-300 leading-relaxed">
              Safari on iOS does not support one-click installation prompts, but you can easily add Ehsaan QR to your Home Screen:
            </p>

            <ol className="space-y-2 text-xs font-medium text-[#0F172A] dark:text-zinc-200">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                <span>Tap the <strong>Share</strong> button (box with an arrow) in the Safari toolbar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                <span>Tap <strong>Add</strong> at top right to complete installation.</span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-xs font-bold transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

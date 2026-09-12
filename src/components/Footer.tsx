import React, { useState } from 'react';
import { ShieldCheck, Info, MessageSquare, X } from 'lucide-react';
import { EhsaanFlameIcon } from './EhsaanLogo';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<'privacy' | 'about' | 'feedback' | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  return (
    <>
      <footer className="w-full mt-16 py-8 border-t border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <EhsaanFlameIcon size={20} />
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center flex-wrap gap-1.5">
                <span>Ehsaan QR</span>
                <span className="font-medium text-zinc-600 dark:text-zinc-300">
                  • Part of
                </span>
                <a
                  href="https://ehsaan.odoo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-0.5"
                >
                  ehsaan.odoo.com
                </a>
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5 font-medium">
                Built for simplicity. Designed for everyday use.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-700 dark:text-zinc-200">
            <a
              href="https://ehsaan.odoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 dark:text-red-400 hover:underline"
            >
              ehsaan.odoo.com
            </a>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <button
              onClick={() => setModalContent('privacy')}
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Privacy
            </button>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <button
              onClick={() => setModalContent('about')}
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              About
            </button>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <button
              onClick={() => setModalContent('feedback')}
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Feedback
            </button>
          </div>
        </div>
      </footer>

      {/* Info Modals */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                {modalContent === 'privacy' && 'Privacy Commitment'}
                {modalContent === 'about' && 'About Ehsaan QR'}
                {modalContent === 'feedback' && 'Send Feedback'}
              </h3>
              <button
                onClick={() => {
                  setModalContent(null);
                  setFeedbackSent(false);
                }}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalContent === 'privacy' && (
              <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Zero-Server Client-Side Guarantee</span>
                </div>
                <p>
                  Ehsaan QR generates all QR matrices, patterns, logos, and vector exports entirely in your web browser using client-side JavaScript and HTML5 Canvas.
                </p>
                <p>
                  Your Wi-Fi passwords, contact details, payment information, and URLs <strong>never leave your device</strong>. No analytics, tracking beacons, or third-party servers receive your data.
                </p>
              </div>
            )}

            {modalContent === 'about' && (
              <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                <p>
                  <strong>Ehsaan QR</strong> was crafted as a companion utility to the <em>Ehsaan Compressor</em> suite. It provides professionals, developers, and creators with a clean, unbloated, high-fidelity QR generator.
                </p>
                <p>
                  Engineered with pixel-precise SVG exports, high error correction resilience, and real ISO/IEC 18004 barcode validation.
                </p>
              </div>
            )}

            {modalContent === 'feedback' && (
              <div className="space-y-3 text-xs">
                {feedbackSent ? (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 text-center font-medium">
                    Thank you! Your feedback has been noted.
                  </div>
                ) : (
                  <>
                    <p className="text-zinc-500">
                      Have suggestions, format requests, or thoughts on Ehsaan QR?
                    </p>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
                    />
                    <button
                      onClick={() => setFeedbackSent(true)}
                      className="w-full py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors"
                    >
                      Submit Feedback
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setModalContent(null);
                  setFeedbackSent(false);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

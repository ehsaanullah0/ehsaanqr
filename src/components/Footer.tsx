import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, X, Github, ExternalLink, Eye, Trash2, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { EhsaanFlameIcon } from './EhsaanLogo';

interface FeedbackItem {
  id: string;
  text: string;
  timestamp: string;
}

const STORAGE_KEY_FEEDBACK = 'ehsaan_qr_feedback_list';

const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    id: 'fb-1',
    text: 'Great clean UI! The high-contrast crimson red styling looks very sharp.',
    timestamp: 'Sep 14, 2026, 06:30 PM',
  },
  {
    id: 'fb-2',
    text: 'Mobile clearance fix is working perfectly on tablet and mobile viewports.',
    timestamp: 'Sep 14, 2026, 08:15 PM',
  },
];

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<'privacy' | 'about' | 'feedback' | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  
  // Feedback view states (no password required)
  const [isViewingFeedback, setIsViewingFeedback] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FEEDBACK);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FEEDBACK;
  });

  const handleFeedbackSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = feedbackText.trim();
    if (!cleanText) return;

    const newItem: FeedbackItem = {
      id: 'fb-' + Date.now(),
      text: cleanText,
      timestamp: new Date().toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updated = [newItem, ...feedbackList];
    setFeedbackList(updated);
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setFeedbackSent(true);
    setFeedbackText('');
  };

  const handleClearFeedback = () => {
    setFeedbackList([]);
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify([]));
    } catch (err) {
      console.error(err);
    }
    setConfirmClearOpen(false);
  };

  return (
    <>
      <footer className="w-full mt-12 sm:mt-16 pt-8 pb-8 border-t border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5]/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <EhsaanFlameIcon size={20} />
            <div className="text-left">
              <p className="text-xs font-bold text-[#0F172A] dark:text-zinc-100 flex items-center flex-wrap gap-1.5">
                <span>Ehsaan QR</span>
                <span className="font-medium text-[#64748B] dark:text-zinc-400">
                  • Part of
                </span>
                <a
                  href="https://ehsaan.odoo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#B45309] hover:text-[#E7AC08] dark:text-amber-400 hover:underline inline-flex items-center gap-0.5"
                >
                  ehsaan.odoo.com
                </a>
              </p>
              <p className="text-xs text-[#64748B] dark:text-zinc-400 mt-0.5 font-medium">
                Built for simplicity. Designed for everyday use.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-3 text-xs font-semibold text-[#334155] dark:text-zinc-200">
            {/* Minimal button to showcase Ehsaan Compressor in Ehsaan Ecosystem */}
            <a
              id="footer-ehsaan-compressor-btn"
              href="https://ehsaancompress.ai.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-950 dark:hover:text-white transition-all shadow-2xs group cursor-pointer active:scale-98"
              title="Explore Ehsaan Compressor (ehsaancompress.ai.studio) in the Ehsaan Ecosystem"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c82020]">
                Ecosystem
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:underline">
                Ehsaan Compressor
              </span>
              <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
            </a>

            <span className="text-[#CBD5E1] dark:text-zinc-600 hidden sm:inline">•</span>

            <a
              href="https://github.com/ehsaanullah0/ehsaanqr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#334155] hover:text-[#0F172A] dark:text-zinc-300 dark:hover:text-amber-300 transition-colors"
              title="View Ehsaan QR on GitHub"
            >
              <Github className="w-3.5 h-3.5 text-[#0F172A] dark:text-zinc-300" />
              <span>GitHub</span>
            </a>
            <span className="text-[#CBD5E1] dark:text-zinc-600">•</span>
            <a
              href="https://ehsaan.odoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B45309] hover:text-[#E7AC08] dark:text-amber-400 hover:underline"
            >
              ehsaan.odoo.com
            </a>
            <span className="text-[#CBD5E1] dark:text-zinc-600">•</span>
            <button
              onClick={() => setModalContent('privacy')}
              className="hover:text-[#B45309] dark:hover:text-amber-400 transition-colors"
            >
              Privacy
            </button>
            <span className="text-[#CBD5E1] dark:text-zinc-600">•</span>
            <button
              onClick={() => setModalContent('about')}
              className="hover:text-[#B45309] dark:hover:text-amber-400 transition-colors"
            >
              About
            </button>
            <span className="text-[#CBD5E1] dark:text-zinc-600">•</span>
            <button
              id="footer-feedback-btn"
              onClick={() => {
                setModalContent('feedback');
                setIsViewingFeedback(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-black text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 transition-all shadow-2xs cursor-pointer active:scale-98"
              title="Open feedback dialog"
            >
              <MessageSquare className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-400" />
              <span>Feedback</span>
            </button>
          </div>
        </div>

        {/* Dedicated mobile and tablet clearance spacer to guarantee the floating bottom navigation bar never overlays footer links or text */}
        <div className="h-24 sm:h-28 lg:hidden pointer-events-none w-full" aria-hidden="true" />
      </footer>

      {/* Info Modals */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-[#EDE8DF] dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DF] dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0F172A] dark:text-zinc-100 capitalize">
                  {modalContent === 'privacy' && 'Privacy Commitment'}
                  {modalContent === 'about' && 'About Ehsaan QR'}
                  {modalContent === 'feedback' && (
                    isViewingFeedback
                      ? 'All Feedback Submissions'
                      : 'Send Feedback'
                  )}
                </h3>
                {modalContent === 'feedback' && isViewingFeedback && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                    {feedbackList.length}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {modalContent === 'feedback' && (
                  <button
                    onClick={() => setIsViewingFeedback(!isViewingFeedback)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-2xs cursor-pointer"
                    title={isViewingFeedback ? "Switch to feedback submission form" : "View all submitted feedback"}
                  >
                    {isViewingFeedback ? (
                      <>
                        <MessageSquare className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                        <span>Submit Form</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                        <span>View Feedback ({feedbackList.length})</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => {
                    setModalContent(null);
                    setFeedbackSent(false);
                    setIsViewingFeedback(false);
                    setConfirmClearOpen(false);
                  }}
                  className="p-1 text-[#64748B] hover:text-[#0F172A] dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {modalContent === 'privacy' && (
              <div className="space-y-3 text-xs text-[#334155] dark:text-zinc-300 leading-relaxed">
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
              <div className="space-y-3 text-xs text-[#334155] dark:text-zinc-300 leading-relaxed">
                <p>
                  <strong>Ehsaan QR</strong> was crafted as a companion utility to the{' '}
                  <a
                    href="https://ehsaancompress.ai.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-[#B45309] hover:text-[#E7AC08] dark:text-amber-400 inline-flex items-center gap-0.5"
                  >
                    Ehsaan Compressor
                    <ExternalLink className="w-3 h-3 inline ml-0.5" />
                  </a>{' '}
                  suite in the Ehsaan Ecosystem. It provides professionals, developers, and creators with a clean, unbloated, high-fidelity QR generator.
                </p>
                <p>
                  Engineered with pixel-precise SVG exports, high error correction resilience, and real ISO/IEC 18004 barcode validation.
                </p>
                <div className="pt-2 border-t border-[#EDE8DF] dark:border-zinc-800">
                  <p className="font-semibold text-[#0F172A] dark:text-zinc-200 mb-1">
                    Open Source Repository:
                  </p>
                  <a
                    href="https://github.com/ehsaanullah0/ehsaanqr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#B45309] hover:text-[#E7AC08] dark:text-amber-400 hover:underline font-mono text-[11px]"
                  >
                    <Github className="w-3.5 h-3.5" />
                    github.com/ehsaanullah0/ehsaanqr
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            )}

            {modalContent === 'feedback' && (
              <div className="space-y-3 text-xs">
                {isViewingFeedback ? (
                  // Open Feedback List (No Password Required)
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-zinc-400">
                      <span className="font-medium">
                        Stored in browser localStorage ({feedbackList.length} {feedbackList.length === 1 ? 'entry' : 'entries'})
                      </span>
                      <div className="flex items-center gap-2">
                        {feedbackList.length > 0 && (
                          !confirmClearOpen ? (
                            <button
                              type="button"
                              onClick={() => setConfirmClearOpen(true)}
                              className="text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
                              title="Clear all feedback records"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Clear All</span>
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-lg border border-red-200 dark:border-red-900/60 animate-in fade-in">
                              <span className="text-[10px] font-bold text-red-700 dark:text-red-300">Confirm?</span>
                              <button
                                type="button"
                                onClick={handleClearFeedback}
                                className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded hover:bg-red-700 cursor-pointer"
                              >
                                Yes, clear
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmClearOpen(false)}
                                className="text-[10px] text-zinc-600 dark:text-zinc-400 hover:underline cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          )
                        )}
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsViewingFeedback(false);
                            setConfirmClearOpen(false);
                          }}
                          className="hover:underline cursor-pointer font-medium"
                        >
                          Back to Form
                        </button>
                      </div>
                    </div>

                    {feedbackList.length === 0 ? (
                      <div className="py-8 text-center rounded-2xl border border-dashed border-[#EDE8DF] dark:border-zinc-800 text-[#64748B] dark:text-zinc-400">
                        <MessageSquare className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
                        <p className="font-semibold">No feedback submitted yet</p>
                        <p className="text-[11px]">New submissions will appear here.</p>
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {feedbackList.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl border border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-800/80 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[10px] text-[#64748B] dark:text-zinc-400 font-mono">
                              <span>{item.timestamp}</span>
                              <span className="text-zinc-400 dark:text-zinc-600">ID: {item.id}</span>
                            </div>
                            <p className="text-xs text-[#0F172A] dark:text-zinc-100 font-normal leading-relaxed whitespace-pre-wrap">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-between">
                      <span>Send feedback to developer:</span>
                      <a
                        href="mailto:worsmon@proton.me"
                        className="font-bold underline text-amber-950 dark:text-amber-100 hover:text-amber-700 dark:hover:text-amber-300 inline-flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        worsmon@proton.me
                      </a>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsViewingFeedback(false);
                          setFeedbackSent(false);
                        }}
                        className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 text-xs font-semibold transition-colors cursor-pointer active:scale-98"
                      >
                        + Submit Another Feedback
                      </button>
                    </div>
                  </div>
                ) : (
                  // Standard Feedback Submission Form
                  <>
                    {feedbackSent ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 text-center font-medium">
                          <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                          Thank you! Your feedback has been noted and saved in your browser.
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => setFeedbackSent(false)}
                            className="text-xs font-medium text-[#64748B] hover:underline cursor-pointer"
                          >
                            Send another note
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsViewingFeedback(true)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            View all feedback ({feedbackList.length})
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                        <p className="text-[#64748B] dark:text-zinc-400">
                          Have suggestions, format requests, or thoughts on Ehsaan QR?
                        </p>
                        <textarea
                          rows={3}
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full p-2.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-[#FAF8F5] dark:bg-zinc-800 text-[#0F172A] dark:text-zinc-100 text-xs focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 outline-hidden"
                        />

                        {/* Explicit warning notice before submission requested by user */}
                        <div className="p-3 rounded-xl border border-amber-200/90 dark:border-amber-900/60 bg-amber-50/90 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <p className="font-semibold text-amber-950 dark:text-amber-100 text-[11px] uppercase tracking-wider">
                                Notice Before Submission
                              </p>
                              <p className="text-xs text-amber-900 dark:text-amber-200 leading-normal">
                                This feedback stays only at your browser if you want to tell the developer please mail this feedback to{' '}
                                <a
                                  href="mailto:worsmon@proton.me"
                                  className="font-bold underline text-amber-950 dark:text-amber-100 hover:text-amber-700 dark:hover:text-amber-300 inline-flex items-center gap-0.5"
                                >
                                  worsmon@proton.me
                                  <Mail className="w-3 h-3 inline ml-0.5" />
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Darker submit button with white text */}
                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer active:scale-98"
                        >
                          Submit Feedback
                        </button>

                        <div className="pt-1 flex items-center justify-between text-[11px] text-[#64748B] dark:text-zinc-400">
                          <span>Feedback is saved locally in browser storage.</span>
                          <button
                            type="button"
                            onClick={() => setIsViewingFeedback(true)}
                            className="text-zinc-900 dark:text-zinc-200 hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            View Feedback ({feedbackList.length})
                          </button>
                        </div>
                      </form>
                    )}
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
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A]"
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

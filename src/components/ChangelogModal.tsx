import React from 'react';
import { X, Sparkles, Github, ExternalLink, Tag, CheckCircle2, GitCommit, ArrowRight } from 'lucide-react';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReleaseItem {
  version: string;
  date: string;
  isLatest?: boolean;
  title: string;
  highlights: string[];
  tagUrl?: string;
}

const RELEASES: ReleaseItem[] = [
  {
    version: 'v1.0.8',
    date: 'Latest Release',
    isLatest: true,
    title: 'Unified 1024px High-Res Default & Synced Multi-Window Export Engine',
    highlights: [
      'Fixed download fallback issue in Test QR modal: all download triggers are now strictly synced with the chosen resolution setting.',
      'Upgraded default QR code quality to 1024px ultra-sharp canvas rendering across the studio.',
      'Bidirectional resolution and format synchronization between Main Studio, Quality Panel, Pre-Download verification, and Scanner Modal.',
      'Added in-modal export resolution selector (256px, 512px, 1024px, 2048px) with real-time feedback toast.',
      'Optimized header responsiveness with cleaned mobile & tablet navigation layout.',
    ],
    tagUrl: 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.0.8',
  },
  {
    version: 'v1.0.7',
    date: 'Previous Release',
    title: 'Clean Minimal Input Flow & Showcase Polish',
    highlights: [
      'Clean default input behavior: all QR categories except URL now start with empty, unpolluted fields.',
      'Refined subtle placeholder hints to guide user input without pre-filling mock text.',
      'Seamless category switching with clean state reset for faster workflow.',
      'Updated Open Source showcase with bespoke #E9B553 styling and direct release navigation.',
      'Direct header changelog access and real-time release tracking.',
    ],
    tagUrl: 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.0.7',
  },
  {
    version: 'v1.0.6',
    date: 'Previous Release',
    title: 'Smart Randomize Engine & Accessibility Hardening',
    highlights: [
      'Added Smart Randomize Controller with customizable target scope (Colors, Patterns, or Both).',
      'Persistent randomization preferences stored across browsing sessions.',
      'Enhanced QR contrast analyzer with real-time WCAG AA readability feedback.',
      'Expanded SVG and vector export resolution options up to 4096px ultra HD.',
    ],
  },
  {
    version: 'v1.0.5',
    date: 'Feature Update',
    title: 'Multi-Pass Hardware Scanner & Template Code Exchange',
    highlights: [
      'Integrated in-browser camera validator with multi-engine ISO/IEC 18004 decoder.',
      'Multi-pass benchmark test running 10 rapid validation passes.',
      'Shareable JSON template code import/export for cross-device design sync.',
      'Added UPI payment and vCard format extensions with live QR generation.',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'Initial Release',
    title: 'Initial Open-Source Client-Side Release',
    highlights: [
      '100% client-side QR generation engine with zero telemetry.',
      '10 supported QR payload formats: URL, Text, Wi-Fi, Email, Phone, SMS, WhatsApp, vCard, UPI, Calendar.',
      'Dynamic styling suite: Liquid, Dots, Rounded, Soft-Rounded, and Square patterns with custom eye colors.',
      'Comprehensive export formats: PNG, SVG, WEBP, and JPEG.',
    ],
  },
];

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const latestReleaseUrl = 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.0.8';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="changelog-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl flex items-center justify-center text-zinc-950 font-bold"
              style={{ backgroundColor: '#E9B553' }}
            >
              <Sparkles className="w-4 h-4 text-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="changelog-modal-title"
                  className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100"
                >
                  Changelog & Releases
                </h2>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-zinc-950"
                  style={{ backgroundColor: '#E9B553' }}
                >
                  v1.0.7
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Track latest features, enhancements, and open-source updates.
              </p>
            </div>
          </div>

          <button
            id="changelog-modal-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Close changelog modal"
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Changelog List */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {RELEASES.map((rel, idx) => (
            <div
              key={rel.version}
              className={`relative rounded-2xl p-4 sm:p-5 transition-all ${
                rel.isLatest
                  ? 'border-2 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800/60 shadow-xs'
                  : 'border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40'
              }`}
              style={{
                borderColor: rel.isLatest ? '#E9B553' : undefined,
              }}
            >
              {/* Release Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      rel.isLatest
                        ? 'text-zinc-950 font-black'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                    style={{
                      backgroundColor: rel.isLatest ? '#E9B553' : undefined,
                    }}
                  >
                    <Tag className="w-3 h-3" />
                    {rel.version}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {rel.date}
                  </span>
                </div>

                {rel.isLatest && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Current Version
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {rel.title}
              </h3>

              {/* Highlights List */}
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                {rel.highlights.map((highlight, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2">
                    <CheckCircle2
                      className="w-3.5 h-3.5 shrink-0 mt-0.5"
                      style={{ color: '#E9B553' }}
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Direct link of changelog on GitHub at the end of the list */}
          <div
            id="changelog-github-direct-link-card"
            className="rounded-2xl p-4 sm:p-5 border text-center flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              borderColor: '#E9B553',
              backgroundColor: 'rgba(233, 181, 83, 0.08)',
            }}
          >
            <div className="text-left">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  Full Release Details on GitHub
                </h4>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                View commits, release notes, source diffs, and tagged assets on GitHub.
              </p>
            </div>

            <a
              id="btn-github-release-v108"
              href={latestReleaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-zinc-950 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm shrink-0"
              style={{
                backgroundColor: '#E9B553',
              }}
            >
              <Github className="w-4 h-4" />
              <span>View v1.0.8 on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 flex items-center justify-between shrink-0">
          <a
            href={latestReleaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1"
          >
            <span>github.com/ehsaanullah0/ehsaanqr/releases</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

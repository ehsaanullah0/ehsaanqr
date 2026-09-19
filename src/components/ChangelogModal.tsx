import React, { useState } from 'react';
import { X, Sparkles, Github, ExternalLink, Tag, CheckCircle2, GitCommit, ArrowRight, Mail, Copy, Check, FileText } from 'lucide-react';
import { AppTheme } from '../types';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: AppTheme;
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
    version: 'v1.1.5',
    date: 'Latest Release',
    isLatest: true,
    title: 'Interactive Quick Guide, Location Category & Quality Refinements',
    highlights: [
      'Interactive First-Time Quick Guide: Dynamic onboarding tour with element spotlighting, auto-scrolling category showcases, compact non-obstructive card design, skip warning protection, and footer quick-launch access.',
      'New Location Category: Added latitude, longitude & place name fields encoding directly into Google Maps URLs.',
      'Auto-Logo Toggle Fix: Fixed auto icon toggle preference and category selection to reliably persist on refresh.',
      'Improved Pre-Loaded Logo Quality: Upgraded SVG vector paths and enabled high-quality anti-aliasing for center logos.',
      'Colour Palette Fixes: Balanced 28 curated preset swatches with verified contrast and synchronized gradient fills.',
      'Light Theme Adaptive Section Polish: Enhanced visual readiness, mathematical corner radius, and radiant active badges.',
    ],
    tagUrl: 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.1.5',
  },
  {
    version: 'v1.1.4',
    date: 'Previous Release',
    isLatest: false,
    title: 'Monochrome Category Icons, Auto Icon Switch & Per-Category Randomize Locks',
    highlights: [
      'Selective Randomize Locks: Freeze specific attributes (matrix, eyes, pupils, colors) while rolling everything else.',
      'Lock Badges & Quick Unlock: Visual active lock count indicator with a one-click unlock shortcut in the header.',
      'Monochrome Category Icons: Clean minimalist mono icons across all QR types for balanced visual contrast.',
      'Auto Category Icon Option: Dedicated ON/OFF toggle switch for category-aware center icon adaptation.',
      'Refined Default QR Style: Warm amber cream background with crimson cut-corner eyes and liquid matrix.',
    ],
    tagUrl: 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.1.4',
  },
  {
    version: 'v1.1.3',
    date: 'Previous Release',
    isLatest: false,
    title: 'Progressive Web App (PWA) & Native Device Installation',
    highlights: [
      'One-Click Native App Installation: Install Ehsaan QR directly to your device via the browser\'s native PWA installation flow.',
      'Standalone Window Experience: Launch without browser URL bar and clutter for a distraction-free, native utility feel.',
      'Safe Network-First Caching: Modern Service Worker precaches key assets while prioritizing network-first delivery so you always run the latest version.',
      'Automatic Standalone Mode Detection: Automatically detects if the app is already installed and suppresses redundant prompts.',
      'Non-Intrusive Safari Guidance: Contextual 3-step guide for iOS Safari users (Share → Add to Home Screen) without fake prompts or settings redirects.',
      'Web App Manifest & Theme Integration: Verified 192px/512px icons, maskable support, and synchronized cream/dark theme backgrounds.',
    ],
    tagUrl: 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.1.3',
  },
  {
    version: 'v1.1.2',
    date: 'Previous Release',
    isLatest: false,
    title: 'Unified Crimson Red Tone System & Theme Isolation',
    highlights: [
      'Shared Crimson Red Palette: Light and Dark themes now share the unified deep red accent system (#B91C1C / #DC2626).',
      'Exclusive Material Theme: Warm Yellow/Gold (#E7AC08) tone is now reserved exclusively for Material theme.',
      'Mobile/Tablet Footer Clearance Fix: Fixed bug where floating bottom navigation bar overlapped the footer in mobile and tablet views.',
      'Ehsaan Ecosystem Showcase: Added minimal button to discover Ehsaan Compressor (ehsaancompress.ai.studio).',
      'Favicon & App Icon Synchronization: Updated favicon SVG, ICO, and PNG assets to match official circular flame logo.',
      'High-Priority Notice Indicator: Enhanced note button in Minimal theme with high-contrast red accent.',
    ],
    tagUrl: 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.1.2',
  },
  {
    version: 'v1.1.1',
    date: 'Previous Release',
    title: 'Cross-Device 2D Color Palette Selector & Screen Consistency',
    highlights: [
      'Universal Color Palette Selector: consistent across mobile, tablet, and desktop.',
      'Touch-friendly 2D Saturation/Brightness spectrum and smooth Hue slider.',
      'Precision RGB (0-255) and HEX format switcher with live preview circle.',
      'Quick swatch palette and integrated Eyedropper tool support.',
      'Note: The app reaches at level where every system works well and polished so the development is stopped till december 2026. Any bug report may fix with request on ~ worsmon@proton.me',
    ],
    tagUrl: 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.1.1',
  },
  {
    version: 'v1.1.0',
    date: 'Previous Release',
    title: 'Theme Engine, Minimal B&W Mode, Precision Pixels & Snappy UI',
    highlights: [
      'Expandable Theme Selector with live preview swatches.',
      'New Minimal Theme: crisp monochrome black & white layout.',
      'Refined Bottom Navigation: high-contrast grey icon visibility.',
      'New Pixel Styles: Chamfer (45° beveled), Diamond, and Squircle.',
      '45° Chamfered Pupil: precision beveled octagon finder core.',
      'Snappy UI: accelerated transitions and tactile press feedback.',
    ],
    tagUrl: 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.1.0',
  },
  {
    version: 'v1.0.9',
    date: 'Previous Release',
    title: 'Warm Minimalist Colour Philosophy & Gold Visual System',
    highlights: [
      'Warm cream surface aesthetic (#FAF8F5) across all views.',
      'Unified warm gold accent system (#E7AC08) for active tabs and controls.',
      'High-contrast navy typography with muted slate secondary text.',
      'Redesigned customization panels and live preview for warm aesthetic.',
    ],
    tagUrl: 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.0.9',
  },
  {
    version: 'v1.0.8',
    date: 'Previous Release',
    title: 'Brand Logo Identity, Transparent Badge & High-Res Engine',
    highlights: [
      'Integrated official circular flame logo across the studio.',
      'Transparent badge default for an unboxed matrix look.',
      'Upgraded default quality to ultra-sharp 1024px canvas.',
      'Synced resolution controls across all download modals.',
    ],
    tagUrl: 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.0.8',
  },
  {
    version: 'v1.0.7',
    date: 'Previous Release',
    title: 'Clean Minimal Input Flow & Showcase Polish',
    highlights: [
      'Clean default inputs: categories now start with unpolluted fields.',
      'Subtle placeholder hints guide input without mock data clutter.',
      'Fast category switching with clean state reset.',
      'Updated Open Source showcase with direct release navigation.',
    ],
    tagUrl: 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.0.7',
  },
  {
    version: 'v1.0.6',
    date: 'Previous Release',
    title: 'Smart Randomize Engine & Readability Hardening',
    highlights: [
      'Smart Randomize Controller with customizable target scope.',
      'Persistent randomize preferences saved across sessions.',
      'Real-time WCAG contrast analyzer with instant feedback.',
      'Ultra HD SVG and vector exports up to 4096px.',
    ],
  },
  {
    version: 'v1.0.5',
    date: 'Feature Update',
    title: 'Multi-Pass Hardware Scanner & Template Sync',
    highlights: [
      'In-browser camera validator with multi-engine ISO decoder.',
      '10-pass rapid benchmark scan test.',
      'Shareable JSON template code import and export.',
      'Added UPI payment and vCard format extensions.',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'Initial Release',
    title: 'Initial Open-Source Client-Side Release',
    highlights: [
      '100% client-side QR generation engine with zero tracking.',
      '10 payload formats: URL, Wi-Fi, vCard, UPI, Text, and more.',
      'Custom patterns: Liquid, Dots, Rounded, Soft-Rounded, and Square.',
      'High-resolution export in PNG, SVG, WEBP, and JPEG.',
    ],
  },
];

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  const isMinimal = theme === 'minimal' || (typeof document !== 'undefined' && document.documentElement.classList.contains('minimal'));
  const [copiedEmail, setCopiedEmail] = useState(false);
  const latestRelease = RELEASES[0];
  const latestReleaseUrl = latestRelease?.tagUrl || 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.1.5';
  const latestVersion = latestRelease?.version || 'v1.1.5';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('worsmon@proton.me');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="changelog-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-[#EDE8DF] dark:border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#EDE8DF] dark:border-zinc-800 shrink-0 bg-[#FAF8F5]/80 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl flex items-center justify-center font-bold ${
                isMinimal
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-[#E7AC08] text-[#0F172A]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="changelog-modal-title"
                  className="text-base sm:text-lg font-black tracking-tight text-[#0F172A] dark:text-zinc-100"
                >
                  Changelog & Releases
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    isMinimal
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-[#E7AC08] text-[#0F172A]'
                  }`}
                >
                  {latestVersion}
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-zinc-400">
                Track latest features, enhancements, and open-source updates.
              </p>
            </div>
          </div>

          <button
            id="changelog-modal-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Close changelog modal"
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:hover:text-zinc-200 hover:bg-[#EDE8DF] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Changelog List */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {/* Important Development & Support Note */}
          <div
            id="changelog-important-notice"
            className="p-4 sm:p-4.5 rounded-2xl border-2 border-red-500 dark:border-red-500 bg-red-50/90 dark:bg-red-950/40 text-red-950 dark:text-red-100 shadow-sm flex flex-col justify-between space-y-3 ring-1 ring-red-500/20"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                    Important Notice
                  </span>
                  <span className="text-xs font-bold text-red-900 dark:text-red-200">
                    Development Status Update
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300">
                  Through Dec 2026
                </span>
              </div>

              <p className="text-xs sm:text-[13px] leading-relaxed font-medium text-red-950 dark:text-red-100">
                The app reaches at level where every system works well and polished so the development is stopped till december 2026. Any bug report may fix with request on ~{' '}
                <a
                  href="mailto:worsmon@proton.me?subject=EHSAAN%20QR%20Bug%20Report"
                  className="font-bold underline text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
                >
                  worsmon@proton.me
                </a>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-red-200/60 dark:border-red-900/50">
              <a
                href="mailto:worsmon@proton.me?subject=EHSAAN%20QR%20Bug%20Report"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Bug Report</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  isMinimal
                    ? 'bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    : 'bg-white dark:bg-zinc-800 border border-red-300 dark:border-red-900/70 text-red-900 dark:text-red-200 hover:bg-red-50 dark:hover:bg-zinc-700 font-semibold'
                }`}
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className={`w-3.5 h-3.5 ${isMinimal ? 'text-zinc-600 dark:text-zinc-300' : 'text-red-600'}`} />
                    <span>Copy worsmon@proton.me</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {RELEASES.map((rel) => (
            <div
              key={rel.version}
              className={`relative rounded-2xl p-4 sm:p-5 transition-all ${
                rel.isLatest
                  ? isMinimal
                    ? 'border-2 border-black dark:border-white bg-zinc-50/90 dark:bg-zinc-800/60 shadow-xs'
                    : 'border-2 border-[#E7AC08] bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800/60 shadow-xs'
                  : 'border border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5]/60 dark:bg-zinc-900/40'
              }`}
            >
              {/* Release Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      rel.isLatest
                        ? isMinimal
                          ? 'bg-black text-white dark:bg-white dark:text-black font-black'
                          : 'bg-[#E7AC08] text-[#0F172A] font-black'
                        : 'bg-[#EDE8DF] dark:bg-zinc-800 text-[#334155] dark:text-zinc-300'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    {rel.version}
                  </span>
                  <span className="text-xs font-semibold text-[#64748B] dark:text-zinc-400">
                    {rel.date}
                  </span>
                </div>

                {rel.isLatest && (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                      isMinimal
                        ? 'text-zinc-900 dark:text-zinc-200'
                        : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Current Version
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-zinc-100 mb-2">
                {rel.title}
              </h3>

              {/* Highlights List */}
              <ul className="space-y-1.5 text-xs text-[#334155] dark:text-zinc-300">
                {rel.highlights.map((highlight, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                        isMinimal
                          ? 'text-black dark:text-white'
                          : 'text-[#E7AC08]'
                      }`}
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
            className={`rounded-2xl p-4 sm:p-5 border text-center flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isMinimal
                ? 'border-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50'
                : 'border-[#E7AC08] bg-[#E7AC08]/10 dark:bg-[#E7AC08]/15'
            }`}
          >
            <div className="text-left">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-[#0F172A] dark:text-zinc-100" />
                <h4 className="text-sm font-black text-[#0F172A] dark:text-zinc-100">
                  Full Release Details on GitHub
                </h4>
              </div>
              <p className="text-xs text-[#64748B] dark:text-zinc-400 mt-0.5">
                View commits, release notes, source diffs, and tagged assets on GitHub.
              </p>
            </div>

            <a
              id="btn-github-release-latest"
              href={latestReleaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm shrink-0 ${
                isMinimal
                  ? 'bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black border border-black dark:border-white'
                  : 'bg-[#E7AC08] hover:bg-[#D9A007] text-[#0F172A]'
              }`}
            >
              <Github className="w-4 h-4" />
              <span>View {latestVersion} on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5]/80 dark:bg-zinc-900/80 flex items-center justify-between gap-3 shrink-0">
          <a
            id="changelog-footer-github-btn"
            href="https://github.com/ehsaanullah0/ehsaanqr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-[#EDE8DF]/50 dark:hover:bg-zinc-700/80 text-xs font-bold text-[#0F172A] dark:text-zinc-200 transition-all shadow-2xs"
            title="Open GitHub Repository"
          >
            <Github className="w-3.5 h-3.5 text-[#0F172A] dark:text-zinc-100" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 text-[#64748B]" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

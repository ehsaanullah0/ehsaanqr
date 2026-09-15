import React, { useState } from 'react';
import { Github, ExternalLink, Star, Check, Copy, Heart, Sparkles, Tag } from 'lucide-react';

interface OpenSourceShowcaseProps {
  onShowToast?: (message: string) => void;
  onOpenChangelog?: () => void;
}

export const OpenSourceShowcase: React.FC<OpenSourceShowcaseProps> = ({
  onShowToast,
  onOpenChangelog,
}) => {
  const [copied, setCopied] = useState(false);
  const repoUrl = 'https://github.com/ehsaanullah0/ehsaanqr';
  const cleanUrl = 'github.com/ehsaanullah0/ehsaanqr';
  const changelogUrl = 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.1.3';

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(repoUrl);
    setCopied(true);
    onShowToast?.('Repository link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="opensource-showcase"
      aria-label="Open Source Project Showcase"
      className="relative overflow-hidden rounded-3xl border border-[#E7AC08]/40 dark:border-[#E7AC08]/30 bg-gradient-to-br from-[#FFFBEA]/70 via-[#FAF8F5] to-white dark:from-[#E7AC08]/10 dark:via-zinc-900/95 dark:to-zinc-950 p-6 sm:p-8 shadow-sm transition-all hover:shadow-md"
    >
      {/* Subtle decorative glow accents using #E7AC08 */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl opacity-20 dark:opacity-15 bg-[#E7AC08]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 w-52 h-52 rounded-full blur-3xl opacity-15 dark:opacity-10 bg-[#E7AC08]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Column: Information & Badges */}
        <div className="space-y-3.5 max-w-2xl">
          {/* Eyebrow / Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase text-[#0F172A] bg-[#E7AC08] shadow-xs"
            >
              <Github className="w-3.5 h-3.5" />
              Open Source Project
            </span>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#92400E] dark:text-[#E7AC08] bg-[#E7AC08]/15 border border-[#E7AC08]/40"
            >
              <Sparkles className="w-3 h-3 text-[#E7AC08]" />
              MIT Licensed
            </span>
            {/* Minimal button to showcase Ehsaan Compressor in Ehsaan Ecosystem */}
            <a
              id="showcase-ehsaan-compressor-btn"
              href="https://ehsaancompress.ai.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-[#EDE8DF] dark:border-zinc-700 hover:border-[#E7AC08] hover:text-[#0F172A] dark:hover:text-white transition-all shadow-2xs group"
              title="Explore Ehsaan Compressor in the Ehsaan Ecosystem (ehsaancompress.ai.studio)"
            >
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B] dark:text-zinc-400">Ecosystem</span>
              <span className="text-zinc-300 dark:text-zinc-600">•</span>
              <span className="font-bold text-[#0F172A] dark:text-zinc-100 group-hover:underline">Ehsaan Compressor</span>
              <ExternalLink className="w-3 h-3 text-[#64748B] group-hover:text-[#0F172A] dark:group-hover:text-zinc-200 ml-0.5" />
            </a>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#EDE8DF]/60 dark:bg-zinc-800 text-[#334155] dark:text-zinc-300 border border-[#EDE8DF] dark:border-zinc-700">
              100% Client-Side
            </span>
          </div>

          {/* Title & Pitch */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-zinc-50 flex items-center gap-2">
              <span>Ehsaan QR is Open Source</span>
              <Heart
                className="w-5 h-5 inline-block text-[#E7AC08] fill-[#E7AC08]/30"
              />
            </h2>
            <p className="mt-1 text-sm text-[#334155] dark:text-zinc-300 leading-relaxed">
              Designed for simplicity and built with privacy first. No tracking, no backend database,
              and zero vendor lock-in. Explore the codebase, star the project, or check the changelog.
            </p>
          </div>

          {/* Quick Perks / Spec tags */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-medium text-[#64748B] dark:text-zinc-400 pt-0.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Zero telemetry & tracking
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E7AC08]" />
              React + Vite + Tailwind
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Free forever for everyone
            </span>
          </div>
        </div>

        {/* Right Column: Interactive GitHub CTA Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Main GitHub Link Button */}
          <a
            id="github-repo-primary-link"
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-sm text-[#0F172A] bg-[#E7AC08] transition-all hover:brightness-105 active:brightness-95 shadow-md shadow-[#E7AC08]/20 hover:shadow-lg hover:shadow-[#E7AC08]/30 group cursor-pointer"
          >
            <Github className="w-4 h-4 transition-transform group-hover:scale-110 text-[#0F172A]" />
            <span>Star on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity ml-0.5" />
          </a>

          {/* Changelog Direct Link Button */}
          {onOpenChangelog ? (
            <button
              id="github-showcase-changelog-btn"
              type="button"
              onClick={onOpenChangelog}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold bg-white dark:bg-zinc-800/90 text-[#0F172A] dark:text-zinc-100 border border-[#E7AC08]/40 dark:border-[#E7AC08]/30 hover:bg-[#FFFBEA]/60 dark:hover:bg-[#E7AC08]/10 hover:border-[#E7AC08] transition-all cursor-pointer shadow-2xs group"
            >
              <Tag className="w-3.5 h-3.5 text-[#E7AC08]" />
              <span>v1.1.3 Changelog</span>
            </button>
          ) : (
            <a
              id="github-showcase-changelog-link"
              href={changelogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold bg-white dark:bg-zinc-800/90 text-[#0F172A] dark:text-zinc-100 border border-[#E7AC08]/40 dark:border-[#E7AC08]/30 hover:bg-[#FFFBEA]/60 dark:hover:bg-[#E7AC08]/10 hover:border-[#E7AC08] transition-all cursor-pointer shadow-2xs group"
            >
              <Tag className="w-3.5 h-3.5 text-[#E7AC08]" />
              <span>v1.1.3 Changelog</span>
              <ExternalLink className="w-3 h-3 text-[#64748B]" />
            </a>
          )}

          {/* Copy Clean Repo Link / Details */}
          <button
            id="github-repo-copy-button"
            type="button"
            onClick={handleCopyUrl}
            title="Click to copy repository URL"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold bg-white dark:bg-zinc-800/90 text-[#334155] dark:text-zinc-200 border border-[#EDE8DF] dark:border-zinc-800 hover:border-[#E7AC08]/60 hover:bg-[#FFFBEA]/40 dark:hover:bg-[#E7AC08]/10 transition-all cursor-pointer shadow-2xs group"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">Copied URL!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#B45309] dark:group-hover:text-[#E7AC08] transition-colors" />
                <span className="font-mono text-[11px] text-[#334155] dark:text-zinc-300">
                  {cleanUrl}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};


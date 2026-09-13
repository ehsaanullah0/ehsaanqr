import React, { useState } from 'react';
import { Github, ExternalLink, Star, GitFork, Check, Copy, Heart, Sparkles } from 'lucide-react';

interface OpenSourceShowcaseProps {
  onShowToast?: (message: string) => void;
}

export const OpenSourceShowcase: React.FC<OpenSourceShowcaseProps> = ({ onShowToast }) => {
  const [copied, setCopied] = useState(false);
  const repoUrl = 'https://github.com/ehsaanullah0/ehsaanqr';
  const cleanUrl = 'github.com/ehsaanullah0/ehsaanqr';

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
      className="relative overflow-hidden rounded-3xl border border-indigo-200/90 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/60 dark:from-indigo-950/40 dark:via-zinc-900/95 dark:to-violet-950/30 p-6 sm:p-8 shadow-sm transition-all hover:shadow-md"
    >
      {/* Subtle decorative glow accents for eye-catchy look */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-violet-500/10 dark:bg-violet-400/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Column: Information & Badges */}
        <div className="space-y-3.5 max-w-2xl">
          {/* Eyebrow / Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-indigo-600 text-white shadow-xs">
              <Github className="w-3.5 h-3.5" />
              Open Source Project
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
              <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
              MIT Licensed
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700">
              100% Client-Side
            </span>
          </div>

          {/* Title & Pitch */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <span>Ehsaan QR is Open Source</span>
              <Heart className="w-5 h-5 text-indigo-500 dark:text-indigo-400 fill-indigo-500/20 inline-block" />
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Designed for simplicity and built with privacy first. No tracking, no backend database,
              and zero vendor lock-in. Explore the codebase, star the project, or contribute on GitHub.
            </p>
          </div>

          {/* Quick Perks / Spec tags */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 pt-0.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Zero telemetry & tracking
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              React + Vite + Tailwind
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
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
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 group cursor-pointer"
          >
            <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Star on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity ml-0.5" />
          </a>

          {/* Copy Clean Repo Link / Details */}
          <button
            id="github-repo-copy-button"
            type="button"
            onClick={handleCopyUrl}
            title="Click to copy repository URL"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold bg-white dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-200 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer shadow-2xs group"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">Copied URL!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                <span className="font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
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

import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, Heart, Sparkles, Tag, Code2, X } from 'lucide-react';

interface OpenSourceShowcaseProps {
  onShowToast?: (message: string) => void;
  onOpenChangelog?: () => void;
  onOpenSupport?: () => void;
}

export const OpenSourceShowcase: React.FC<OpenSourceShowcaseProps> = ({
  onShowToast,
  onOpenChangelog,
  onOpenSupport,
}) => {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem('hide_github_showcase') !== 'true';
  });
  const repoUrl = 'https://github.com/ehsaanullah0/ehsaanqr';
  const changelogUrl = 'https://github.com/ehsaanullah0/ehsaanqr/releases/tag/v1.1.6';

  const handleHide = () => {
    setIsVisible(false);
    localStorage.setItem('hide_github_showcase', 'true');
  };

  if (!isVisible) return null;

  return (
    <section
      id="opensource-showcase"
      aria-label="Open Source Project Showcase"
      className="relative overflow-hidden rounded-2xl border border-[#E7AC08]/30 bg-white dark:bg-zinc-900 p-4 sm:p-5 shadow-2xs transition-colors space-y-3.5"
    >
      {/* Top Bar: Title Badge & GitHub Repo Link */}
      <div className="flex items-center justify-between gap-2 border-b border-[#EDE8DF] dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#0F172A] bg-[#E7AC08] shadow-2xs">
            <Github className="w-3 h-3" />
            Open Source
          </span>
          <span className="text-xs font-bold text-[#0F172A] dark:text-zinc-100">
            Ehsaan QR
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            id="github-repo-primary-link"
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-[#FAF8F5] dark:bg-zinc-800 border border-[#EDE8DF] dark:border-zinc-700 hover:border-[#E7AC08] dark:hover:border-amber-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <Code2 className="w-3 h-3 text-[#E7AC08]" />
            <span>GitHub</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
          <button
            onClick={handleHide}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Hide showcase"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description text across full width */}
      <p className="text-xs text-[#334155] dark:text-zinc-300 leading-relaxed font-medium">
        EHSAAN QR is 100% open source, free for everyone, and operates with zero tracking or telemetry. Inspect the code, star the repository, or contribute improvements.
      </p>

      {/* Action Buttons in a balanced grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <a
          id="github-showcase-star-btn"
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-[#0F172A] bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] transition-all shadow-2xs cursor-pointer group active:scale-98"
          title="Star repository on GitHub"
        >
          <Github className="w-3.5 h-3.5 shrink-0" />
          <span>STAR ON GITHUB</span>
          <ExternalLink className="w-3 h-3 opacity-80 shrink-0" />
        </a>

        {onOpenChangelog ? (
          <button
            id="github-showcase-changelog-btn"
            type="button"
            onClick={onOpenChangelog}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#FAF8F5] dark:bg-zinc-800/80 text-[#0F172A] dark:text-zinc-200 border border-[#EDE8DF] dark:border-zinc-700 hover:border-[#E7AC08] transition-all cursor-pointer shadow-2xs active:scale-98"
          >
            <Tag className="w-3.5 h-3.5 text-[#E7AC08]" />
            <span>Changelog & Updates</span>
          </button>
        ) : (
          <a
            id="github-showcase-changelog-link"
            href={changelogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#FAF8F5] dark:bg-zinc-800/80 text-[#0F172A] dark:text-zinc-200 border border-[#EDE8DF] dark:border-zinc-700 hover:border-[#E7AC08] transition-all cursor-pointer shadow-2xs active:scale-98"
          >
            <Tag className="w-3.5 h-3.5 text-[#E7AC08]" />
            <span>Changelog & Updates</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}
      </div>
    </section>
  );
};

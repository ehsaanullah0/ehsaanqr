import React, { useState } from 'react';
import {
  QrStyleOptions,
  ReadabilityReport,
  ReadabilityLevel,
} from '../types';
import { getImprovedReadabilityOptions } from '../utils/readabilityEngine';
import {
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Activity,
  Layers,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Info,
  Maximize2,
} from 'lucide-react';

interface ReadabilityDashboardProps {
  report: ReadabilityReport;
  options: QrStyleOptions;
  onOptionsChange?: (opts: Partial<QrStyleOptions>) => void;
  onOpenScanner?: () => void;
  onShowToast?: (msg: string) => void;
}

export const ReadabilityDashboard: React.FC<ReadabilityDashboardProps> = ({
  report,
  options,
  onOptionsChange,
  onOpenScanner,
  onShowToast,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Level Badge configuration
  const levelConfig: Record<
    ReadabilityLevel,
    { label: string; colorClass: string; bgClass: string; borderClass: string; icon: React.ReactNode; desc: string }
  > = {
    excellent: {
      label: 'Excellent',
      colorClass: 'text-emerald-700 dark:text-emerald-300',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      desc: 'Very strong visual readability under standard conditions.',
    },
    good: {
      label: 'Good',
      colorClass: 'text-emerald-700 dark:text-emerald-300',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      desc: 'Should generally be readable under normal scanning conditions.',
    },
    moderate: {
      label: 'Moderate',
      colorClass: 'text-amber-700 dark:text-amber-300',
      bgClass: 'bg-amber-50 dark:bg-amber-950/40',
      borderClass: 'border-amber-200 dark:border-amber-800',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      desc: 'Potential difficulty under poor lighting, distance, or lower-quality cameras.',
    },
    risky: {
      label: 'Risky',
      colorClass: 'text-orange-700 dark:text-orange-300',
      bgClass: 'bg-orange-50 dark:bg-orange-950/40',
      borderClass: 'border-orange-200 dark:border-orange-800',
      icon: <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />,
      desc: 'Design has measurable optical contrast or geometry weaknesses.',
    },
    poor: {
      label: 'Poor',
      colorClass: 'text-rose-700 dark:text-rose-300',
      bgClass: 'bg-rose-50 dark:bg-rose-950/40',
      borderClass: 'border-rose-200 dark:border-rose-900',
      icon: <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      desc: 'High probability of scanning difficulty on standard barcode readers.',
    },
  };

  const currentLevel = levelConfig[report.level] || levelConfig.good;

  // Handle Intelligent Auto-Fix
  const handleAutoImprove = () => {
    if (!onOptionsChange) return;

    const { improvedOptions, fixesApplied } = getImprovedReadabilityOptions(options, report);

    if (Object.keys(improvedOptions).length === 0) {
      if (onShowToast) {
        onShowToast('Design is already optimized for high readability!');
      }
      return;
    }

    onOptionsChange(improvedOptions);
    if (onShowToast) {
      onShowToast(`Readability improved: ${fixesApplied.slice(0, 2).join(', ')} ✓`);
    }
  };

  // Helper for progress bar color
  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-emerald-400';
    if (score >= 60) return 'bg-amber-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div
      id="qr-readability-dashboard"
      className="w-full bg-white dark:bg-zinc-900/90 rounded-2xl border border-[#EDE8DF] dark:border-zinc-800 shadow-2xs overflow-hidden transition-all"
    >
      {/* Header Bar */}
      <div className="p-3.5 sm:p-4 border-b border-[#EDE8DF] dark:border-zinc-800/80 bg-[#FAF8F5]/80 dark:bg-zinc-950/40 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-[#B45309] dark:text-amber-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold tracking-tight text-[#0F172A] dark:text-zinc-100">
                QR Readability Intelligence
              </h3>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#EDE8DF] dark:bg-zinc-800 text-[#334155] dark:text-zinc-400">
                Estimated
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-zinc-400">
              Multi-factor optical & geometric scan analysis
            </p>
          </div>
        </div>

        {/* Score & Tier Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${currentLevel.bgClass} ${currentLevel.borderClass} ${currentLevel.colorClass}`}
          >
            {currentLevel.icon}
            <span className="font-extrabold text-sm">{report.overallScore}</span>
            <span className="text-[11px] opacity-75">/ 100</span>
            <span className="text-[10px] uppercase font-bold tracking-wider ml-0.5">• {currentLevel.label}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-zinc-200 hover:bg-[#EDE8DF]/60 dark:hover:bg-zinc-800 transition-colors"
            title={isExpanded ? 'Collapse breakdown' : 'Expand full metrics'}
            aria-label="Toggle metrics breakdown"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-3.5 sm:p-4 space-y-3.5">
        {/* Metric Grid Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* 1. Contrast */}
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-zinc-800/50 border border-[#EDE8DF] dark:border-zinc-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B] dark:text-zinc-400 mb-1">
              <span>Contrast</span>
              <span className="font-mono text-[#0F172A] dark:text-zinc-200 font-bold">
                {report.contrastRatio}:1
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#EDE8DF] dark:bg-zinc-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  report.contrastScore
                )}`}
                style={{ width: `${report.contrastScore}%` }}
              />
            </div>
            <span className="text-[10px] text-[#64748B] dark:text-zinc-500 mt-1 block">
              {report.contrastScore}% score
            </span>
          </div>

          {/* 2. Local Regional Contrast */}
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-zinc-800/50 border border-[#EDE8DF] dark:border-zinc-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B] dark:text-zinc-400 mb-1">
              <span>Local Contrast</span>
              <span className="font-mono text-[#0F172A] dark:text-zinc-200 font-bold">
                {report.minRegionalContrastRatio}:1
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#EDE8DF] dark:bg-zinc-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  report.localContrastScore
                )}`}
                style={{ width: `${report.localContrastScore}%` }}
              />
            </div>
            <span className="text-[10px] text-[#64748B] dark:text-zinc-500 mt-1 block">
              7 zone analysis
            </span>
          </div>

          {/* 3. Module Clarity */}
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-zinc-800/50 border border-[#EDE8DF] dark:border-zinc-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B] dark:text-zinc-400 mb-1">
              <span>Module Clarity</span>
              <span className="font-mono text-[#0F172A] dark:text-zinc-200 font-bold">
                {report.moduleClarityScore}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#EDE8DF] dark:bg-zinc-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  report.moduleClarityScore
                )}`}
                style={{ width: `${report.moduleClarityScore}%` }}
              />
            </div>
            <span className="text-[10px] text-[#64748B] dark:text-zinc-500 mt-1 block capitalize">
              {options.patternStyle} style
            </span>
          </div>

          {/* 4. Finder Patterns */}
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-zinc-800/50 border border-[#EDE8DF] dark:border-zinc-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B] dark:text-zinc-400 mb-1">
              <span>Finder Eyes</span>
              <span className="font-mono text-[#0F172A] dark:text-zinc-200 font-bold">
                {report.finderIntegrityScore}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#EDE8DF] dark:bg-zinc-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  report.finderIntegrityScore
                )}`}
                style={{ width: `${report.finderIntegrityScore}%` }}
              />
            </div>
            <span className="text-[10px] text-[#64748B] dark:text-zinc-500 mt-1 block capitalize">
              {options.eyeStyle} frame
            </span>
          </div>

          {/* 5. Quiet Zone */}
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-zinc-800/50 border border-[#EDE8DF] dark:border-zinc-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B] dark:text-zinc-400 mb-1">
              <span>Quiet Zone</span>
              <span className="font-mono text-[#0F172A] dark:text-zinc-200 font-bold">
                {options.margin} mod
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#EDE8DF] dark:bg-zinc-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  report.quietZoneScore
                )}`}
                style={{ width: `${report.quietZoneScore}%` }}
              />
            </div>
            <span className="text-[10px] text-[#64748B] dark:text-zinc-500 mt-1 block">
              {report.quietZoneScore >= 85 ? 'Safe boundary' : 'Compact margin'}
            </span>
          </div>

          {/* 6. Logo Impact */}
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-zinc-800/50 border border-[#EDE8DF] dark:border-zinc-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B] dark:text-zinc-400 mb-1">
              <span>Logo Impact</span>
              <span className="font-mono text-[#0F172A] dark:text-zinc-200 font-bold">
                {options.logo.type !== 'none' ? `${report.logoCoveragePercent}%` : 'None'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#EDE8DF] dark:bg-zinc-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  report.logoImpactScore
                )}`}
                style={{ width: `${report.logoImpactScore}%` }}
              />
            </div>
            <span className="text-[10px] text-[#64748B] dark:text-zinc-500 mt-1 block">
              EC: {options.errorCorrection}
            </span>
          </div>
        </div>

        {/* Detailed Expanded Diagnostic View */}
        {isExpanded && (
          <div className="pt-2 border-t border-[#EDE8DF] dark:border-zinc-800 space-y-3 animate-in fade-in-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-zinc-800/40 border border-[#EDE8DF] dark:border-zinc-800">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">
                  Detection Confidence
                </span>
                <span className="font-bold text-[#0F172A] dark:text-zinc-200">
                  {report.confidence === 'High' ? '🟢 High Confidence' : report.confidence === 'Moderate' ? '🟡 Moderate' : '🔴 Low'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-zinc-800/40 border border-[#EDE8DF] dark:border-zinc-800">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">
                  Matrix Density & Module Size
                </span>
                <span className="font-bold font-mono text-[#0F172A] dark:text-zinc-200">
                  ~{report.estimatedMatrixModules}×{report.estimatedMatrixModules} ({report.modulePixelSize} px/module)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-zinc-800/40 border border-[#EDE8DF] dark:border-zinc-800">
                <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">
                  Background Polarity
                </span>
                <span className="font-bold text-[#0F172A] dark:text-zinc-200">
                  {report.isDarkBg ? 'Inverted (Dark BG / Light QR)' : 'Standard (Light BG / Dark QR)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Issues & Suggestions Section (If warnings exist) */}
        {report.warnings.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-900/60 text-amber-950 dark:text-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0" />
                <span>Readability Considerations Detected ({report.warnings.length})</span>
              </div>
              <span className="text-[10px] font-semibold text-[#B45309] dark:text-amber-400">
                Score Impact
              </span>
            </div>

            <ul className="space-y-1 text-[11px] text-amber-900 dark:text-amber-300 list-disc list-inside">
              {report.warnings.map((warn, idx) => (
                <li key={idx} className="leading-relaxed">
                  {warn}
                </li>
              ))}
            </ul>

            {report.recommendations.length > 0 && (
              <div className="pt-1.5 border-t border-amber-200/60 dark:border-amber-900/60 flex items-start gap-1.5 text-[11px] text-amber-800 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-[#E7AC08] shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">Suggested Fix:</strong> {report.recommendations.join(' ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Actions: Improve Readability & Test Scan */}
          <div className="flex flex-wrap items-center gap-2">
            {report.overallScore < 90 && (
              <button
                type="button"
                id="btn-improve-readability"
                onClick={handleAutoImprove}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E7AC08] hover:bg-[#d49e07] active:bg-[#c29006] disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-[#0F172A] font-bold text-xs shadow-xs hover:shadow-sm transition-all active:scale-[0.98]"
                title="Intelligently tweak only the properties affecting scan speed without altering overall theme"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Improve Readability</span>
              </button>
            )}

            {onOpenScanner && (
              <button
                type="button"
                id="btn-readability-test-scan"
                onClick={onOpenScanner}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#EDE8DF] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-[#FAF8F5] dark:hover:bg-zinc-700/80 text-[#0F172A] dark:text-zinc-200 font-semibold text-xs shadow-2xs transition-all active:scale-[0.98]"
              >
                <Camera className="w-3.5 h-3.5 text-[#E7AC08]" />
                <span>Test Scan</span>
              </button>
            )}
          </div>
        </div>

        {/* Nuanced Disclaimer (Never claiming 100% universal scanability) */}
        <div className="text-[10px] text-[#64748B] dark:text-zinc-500 flex items-center gap-1 pt-0.5">
          <Info className="w-3 h-3 shrink-0" />
          <span>
            Designed for reliable scanning under normal conditions. Readability score is an empirical estimate based on optical contrast and ISO standard geometry.
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import {
  QrStyleOptions,
  ExportFormat,
  ReadabilityReport,
  AppTheme,
  RandomizeTarget,
  RandomizeType,
} from '../types';
import { renderQrToCanvas } from '../utils/qrRenderer';
import {
  exportQrCode,
  copyQrImageToClipboard,
  shareQr,
} from '../utils/exportUtils';
import {
  Download,
  Copy,
  Share2,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  BookmarkPlus,
  QrCode,
  ChevronDown,
  ShieldCheck,
  Dices,
  Shuffle,
  Sparkles,
  Wand2,
  FileText,
  Mail,
  Check,
  X,
  Lock,
  Crown,
} from 'lucide-react';
import { ExclusiveCrownBadge } from './ExclusiveCrownBadge';
import { useExclusiveAccess } from '../context/ExclusiveAccessContext';
import { EhsaanFlameIcon } from './EhsaanLogo';
import { SmartRandomizeController } from './SmartRandomizeController';
import {
  getRandomBgAndPupil,
  getRandomBg,
  getRandomPupil,
  getRandomAllOptions,
  executeSmartRandomize,
  SaturationPreference,
} from '../utils/colorRandomizer';
import { PreDownloadCheckModal } from './PreDownloadCheckModal';

interface LivePreviewCardProps {
  payload: string;
  options: QrStyleOptions;
  readability: ReadabilityReport;
  onShowToast: (msg: string) => void;
  onOpenScanner: () => void;
  onOpenChangelog?: () => void;
  onSaveDesign: () => void;
  onOptionsChange?: (opts: Partial<QrStyleOptions>) => void;
  selectedRandomizeTarget?: RandomizeTarget;
  selectedRandomizeType?: RandomizeType;
  onRandomizeTargetChange?: (target: RandomizeTarget) => void;
  onRandomizeTypeChange?: (type: RandomizeType) => void;
  lockedTargets?: RandomizeTarget[];
  onLockedTargetsChange?: (locks: RandomizeTarget[]) => void;
  theme?: AppTheme;
}

export const LivePreviewCard: React.FC<LivePreviewCardProps> = ({
  payload,
  options,
  readability,
  onShowToast,
  onOpenScanner,
  onOpenChangelog,
  onSaveDesign,
  onOptionsChange,
  selectedRandomizeTarget,
  selectedRandomizeType,
  onRandomizeTargetChange,
  onRandomizeTypeChange,
  lockedTargets,
  onLockedTargetsChange,
  theme,
}) => {
  const { isUnlocked, openExclusiveModal, openOverviewModal } = useExclusiveAccess();
  const isMinimal = theme === 'minimal' || (typeof document !== 'undefined' && document.documentElement.classList.contains('minimal'));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [showExportSettings, setShowExportSettings] = useState(false);
  const [exportRes, setExportRes] = useState<number>(options.size || 1024);
  const [showPreDownloadCheck, setShowPreDownloadCheck] = useState(false);
  const [dontShowAgainPreDownload, setDontShowAgainPreDownload] = useState(false);
  const [bgSaturation, setBgSaturation] = useState<SaturationPreference>(
    options.bgSaturationPreference || 'low'
  );
  const [showDevNoteModal, setShowDevNoteModal] = useState(false);
  const [copiedDevEmail, setCopiedDevEmail] = useState(false);

  const handleCopyDevEmail = async () => {
    try {
      await navigator.clipboard.writeText('worsmon@proton.me');
      setCopiedDevEmail(true);
      onShowToast('Email address copied: worsmon@proton.me ✓');
      setTimeout(() => setCopiedDevEmail(false), 2000);
    } catch {
      onShowToast('Email address: worsmon@proton.me');
    }
  };

  useEffect(() => {
    if (options.bgSaturationPreference && options.bgSaturationPreference !== bgSaturation) {
      setBgSaturation(options.bgSaturationPreference);
    }
  }, [options.bgSaturationPreference]);

  useEffect(() => {
    setExportRes(options.size || 1024);
  }, [options.size]);

  const handleRandomizeAll = () => {
    if (!onOptionsChange) return;
    const { updated, message } = executeSmartRandomize(
      options,
      selectedRandomizeTarget || 'all',
      selectedRandomizeType || 'both',
      bgSaturation
    );
    onOptionsChange(updated);
    onShowToast(message);
  };

  const handleRandomizeBgAndPupil = () => {
    if (!onOptionsChange) return;
    const { bgColor, pupilColor } = getRandomBgAndPupil(
      options.bgColor,
      options.eyeInnerColor,
      options.fgColor,
      bgSaturation
    );
    onOptionsChange({
      bgColor,
      eyeInnerColor: pupilColor,
      customEyeColors: true,
      transparentBg: false,
      bgSaturationPreference: bgSaturation,
    });
    onShowToast(`Randomized ${bgSaturation === 'high' ? 'Vibrant' : 'Pastel'} BG (${bgColor}) & Pupil (${pupilColor})`);
  };

  const handleRandomizeBg = () => {
    if (!onOptionsChange) return;
    const newBg = getRandomBg(options.bgColor, options.fgColor, bgSaturation);
    onOptionsChange({
      bgColor: newBg,
      transparentBg: false,
      bgSaturationPreference: bgSaturation,
    });
    onShowToast(`Randomized ${bgSaturation === 'high' ? 'High' : 'Low'} Saturation BG (${newBg})`);
  };

  const handleSelectSaturation = (mode: SaturationPreference) => {
    setBgSaturation(mode);
    if (!onOptionsChange) return;
    const newBg = getRandomBg(options.bgColor, options.fgColor, mode);
    onOptionsChange({
      bgColor: newBg,
      transparentBg: false,
      bgSaturationPreference: mode,
    });
    onShowToast(
      mode === 'high'
        ? `High Saturation Mode: applied vibrant background (${newBg}) ✓`
        : `Low Saturation Mode: applied soft pastel background (${newBg}) ✓`
    );
  };

  const handleRandomizePupil = () => {
    if (!onOptionsChange) return;
    const newPupil = getRandomPupil(options.bgColor, options.eyeInnerColor);
    onOptionsChange({
      eyeInnerColor: newPupil,
      customEyeColors: true,
    });
    onShowToast(`Randomized Pupil (${newPupil})`);
  };

  useEffect(() => {
    if (!isUnlocked && options.size === 2048) {
      setExportRes(1024);
      onOptionsChange?.({ size: 1024 });
    } else {
      setExportRes(options.size);
    }
  }, [options.size, isUnlocked]);

  // Fallback if SVG was selected and user is not unlocked
  useEffect(() => {
    if (!isUnlocked && selectedFormat === 'svg') {
      setSelectedFormat('png');
    }
  }, [selectedFormat, isUnlocked]);

  // Re-render canvas whenever payload or options change
  useEffect(() => {
    if (!canvasRef.current) return;
    if (!payload) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return;
    }
    renderQrToCanvas(canvasRef.current, payload, options);
  }, [payload, options]);

  const executeDownload = async () => {
    if (!payload) {
      onShowToast('Please enter some QR content first');
      return;
    }
    if ((exportRes === 2048 || options.size === 2048) && !isUnlocked) {
      openExclusiveModal('2048 × 2048 Pixel Quality');
      return;
    }
    if (selectedFormat === 'svg' && !isUnlocked) {
      openExclusiveModal('SVG Vector Format Export');
      return;
    }
    setIsExporting(true);
    try {
      await exportQrCode(selectedFormat, payload, options, exportRes);
      onShowToast(`Downloaded ${selectedFormat.toUpperCase()} QR code ✓`);
      setShowPreDownloadCheck(false);
    } catch (err) {
      console.error(err);
      onShowToast('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadClick = () => {
    if (!payload) {
      onShowToast('Please enter some QR content first');
      return;
    }
    if ((exportRes === 2048 || options.size === 2048) && !isUnlocked) {
      openExclusiveModal('2048 × 2048 Pixel Quality');
      return;
    }
    if (selectedFormat === 'svg' && !isUnlocked) {
      openExclusiveModal('SVG Vector Format Export');
      return;
    }
    if (dontShowAgainPreDownload) {
      executeDownload();
    } else {
      setShowPreDownloadCheck(true);
    }
  };

  const handleCopyImage = async () => {
    if (!payload) return;
    const success = await copyQrImageToClipboard(payload, options);
    if (success) {
      setCopiedImage(true);
      onShowToast('QR image copied to clipboard ✓');
      setTimeout(() => setCopiedImage(false), 2000);
    } else {
      onShowToast('Unable to copy image in this browser. Try download.');
    }
  };

  const handleCopyContent = async () => {
    if (!payload) return;
    await navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    onShowToast('Encoded QR content copied ✓');
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleShare = async () => {
    if (!payload) return;
    const shared = await shareQr(payload, options, 'Ehsaan QR Code');
    if (shared) {
      onShowToast('Shared successfully ✓');
    }
  };

  const ecNames: Record<string, string> = {
    L: 'Low error correction (7%)',
    M: 'Medium error correction (15%)',
    Q: 'Quartile error correction (25%)',
    H: 'High error correction (30%)',
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-7 border border-[#EDE8DF] dark:border-zinc-800 shadow-sm transition-all">
      {/* Top Banner / Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 mb-4 sm:mb-5 border-b border-[#EDE8DF]/80 dark:border-zinc-800">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="shrink-0 flex items-center justify-center">
            <EhsaanFlameIcon size={20} />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-[#0F172A] dark:text-zinc-100">
              Live QR Preview
            </h2>
            <span className="text-[10px] sm:text-[11px] text-[#64748B] dark:text-zinc-400">
              Instant in-browser rendering
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Readability Score & Status Pill */}
          <div
            className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1 rounded-full border text-[11px] sm:text-xs font-bold transition-all flex-1 sm:flex-initial shrink min-w-0 ${
              !payload
                ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400'
                : readability.level === 'excellent' || readability.level === 'good'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                : readability.level === 'moderate'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
                : readability.level === 'risky'
                ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400'
            }`}
          >
            {!payload ? (
              <span className="truncate">Enter content</span>
            ) : (
              <>
                {readability.level === 'excellent' || readability.level === 'good' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate whitespace-nowrap">
                  {readability.overallScore}/100 • <span className="capitalize">{readability.level}</span>
                </span>
              </>
            )}
          </div>

          {/* Test QR Trigger Button */}
          <button
            id="btn-test-qr-validator-top"
            type="button"
            onClick={onOpenScanner}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-1 rounded-full border border-[#EDE8DF] dark:border-zinc-700 text-[#0F172A] dark:text-zinc-300 hover:text-[#92400E] dark:hover:text-amber-300 hover:border-[#E7AC08] text-[11px] sm:text-xs font-bold transition-all active:scale-95 shrink-0 whitespace-nowrap"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Test QR</span>
          </button>

          {/* Changelog Trigger Button */}
          {onOpenChangelog && (
            <button
              id="btn-changelog-top"
              type="button"
              onClick={onOpenChangelog}
              className="hidden lg:flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#E7AC08]/40 dark:border-[#E7AC08]/30 text-[#0F172A] dark:text-zinc-200 bg-[#FFFBEA] dark:bg-[#E7AC08]/10 hover:bg-[#FEF3C7] dark:hover:bg-[#E7AC08]/20 hover:border-[#E7AC08] text-[11px] sm:text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E7AC08]" />
              <span>Changelog</span>
            </button>
          )}

          {/* Exclusive Features Button - Styled with ExclusiveCrownBadge */}
          <ExclusiveCrownBadge
            asButton
            id="btn-live-preview-exclusive-suite"
            onClick={openOverviewModal}
            title="View Exclusive Features (₹20) & Unlock Details"
            className="cursor-pointer shrink-0 whitespace-nowrap"
          />
        </div>
      </div>

      {/* Hero Layout: QR Canvas on left, Download & Export Suite on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center">
        {/* Left Side: QR Canvas Box (5 cols on md+) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div id="qr-canvas-container" className="relative w-full max-w-[210px] sm:max-w-[280px] aspect-square p-3 sm:p-5 rounded-2xl bg-[#FDFCF9] dark:bg-zinc-950/60 border border-[#EDE8DF] dark:border-zinc-800/80 flex items-center justify-center overflow-hidden shadow-2xs group">
            {/* Subtle decorative grid background for contrast check */}
            <div
              className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Canvas Display */}
            <div
              className={`relative z-10 w-full h-full flex items-center justify-center overflow-hidden shadow-xs transition-transform duration-300 group-hover:scale-[1.02] ${
                options.cornerStyle === 'smooth' ? 'rounded-2xl' : 'rounded-none'
              }`}
            >
              <canvas
                ref={canvasRef}
                id="qr-code-canvas"
                className={`w-full h-full object-contain ${
                  options.cornerStyle === 'smooth' ? 'rounded-2xl' : 'rounded-none'
                } ${!payload ? 'hidden' : 'block'}`}
                style={{
                  imageRendering: 'pixelated',
                  backgroundColor: options.transparentBg ? 'transparent' : options.bgColor,
                }}
              />
              {!payload && (
                <div className="flex flex-col items-center justify-center p-4 text-center text-zinc-400 dark:text-zinc-500 select-none">
                  <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 mb-2">
                    <QrCode className="w-7 h-7 text-zinc-400 dark:text-zinc-500 stroke-[1.5]" />
                  </div>
                  <span className="text-xs font-semibold text-[#0F172A] dark:text-zinc-300">
                    Awaiting content
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-zinc-500 mt-0.5">
                    Enter details below to preview
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Subtitle */}
          <div className="flex items-center gap-2 mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {options.size} × {options.size} px
            </span>
            <span>•</span>
            <span>{ecNames[options.errorCorrection]}</span>
          </div>

          {/* Randomize Options: Smart Expandable Controller with quick actions */}
          {onOptionsChange && (
            <div className="w-full max-w-[260px] sm:max-w-[340px] mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-1.5 sm:gap-2">
              <div className="flex-1 min-w-0">
                <SmartRandomizeController
                  options={options}
                  onOptionsChange={onOptionsChange}
                  onShowToast={onShowToast}
                  saturationPreference={bgSaturation}
                  selectedTarget={selectedRandomizeTarget || 'all'}
                  selectedType={selectedRandomizeType || 'both'}
                  onTargetChange={onRandomizeTargetChange || (() => {})}
                  onTypeChange={onRandomizeTypeChange || (() => {})}
                  lockedTargets={lockedTargets}
                  onLockedTargetsChange={onLockedTargetsChange}
                  idPrefix="preview-rand"
                  compact
                  className="w-full"
                />
              </div>

              <button
                type="button"
                id="btn-randomize-bg-preview"
                onClick={handleRandomizeBg}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[10px] sm:text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors shadow-2xs shrink-0 cursor-pointer"
                title="Randomize background color only"
              >
                <Shuffle className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                <span>BG</span>
              </button>

              <button
                type="button"
                id="btn-randomize-pupil-preview"
                onClick={handleRandomizePupil}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[10px] sm:text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors shadow-2xs shrink-0 cursor-pointer"
                title="Randomize pupil color only"
              >
                <Shuffle className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                <span>Pupil</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Export & Actions Suite (7 cols on md+) */}
        <div className="md:col-span-7 space-y-3 sm:space-y-4">
          {/* Randomize Background Saturation Option for Randomize System */}
          <div
            id="randomize-bg-saturation-card"
            className="p-3 sm:p-3.5 rounded-2xl bg-[#FDFCF9] dark:bg-zinc-800/40 border border-[#EDE8DF] dark:border-zinc-700/70 transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Dices className="w-3.5 h-3.5 text-[#E7AC08] shrink-0" />
                <span className="text-xs font-bold text-[#0F172A] dark:text-zinc-100">
                  Randomize System
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EDE8DF] dark:bg-zinc-700/80 text-[#334155] dark:text-zinc-300 font-mono">
                {bgSaturation === 'high' ? 'High' : 'Low'} Saturation
              </span>
            </div>

            {/* Segmented Choice Buttons: Low Saturation vs High Saturation */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-bg-saturation-low"
                onClick={() => handleSelectSaturation('low')}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2 sm:p-2.5 rounded-xl border text-left transition-all ${
                  bgSaturation === 'low'
                    ? 'border-[#E7AC08] bg-white dark:bg-zinc-800 text-[#0F172A] dark:text-amber-100 ring-1 ring-[#E7AC08]/50 shadow-2xs font-bold'
                    : 'border-[#EDE8DF] dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/60 text-[#334155] dark:text-zinc-300 hover:border-[#CBD5E1] hover:bg-white dark:hover:bg-zinc-800'
                }`}
                title="Select Low Saturation (Soft, pastel & neutral background colors)"
              >
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">Low Saturation</span>
                  </div>
                  <span className="text-[10px] text-[#64748B] dark:text-zinc-400 block font-normal">
                    Soft, pastel & neutral
                  </span>
                </div>
                {/* Visual Swatches */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FAF8F5] border border-[#EDE8DF] dark:border-zinc-600" title="#FAF8F5" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FEF3C7] border border-amber-200 dark:border-amber-700" title="#FEF3C7" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#E0F2FE] border border-sky-200 dark:border-sky-700" title="#E0F2FE" />
                </div>
              </button>

              <button
                type="button"
                id="btn-bg-saturation-high"
                onClick={() => handleSelectSaturation('high')}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2 sm:p-2.5 rounded-xl border text-left transition-all ${
                  bgSaturation === 'high'
                    ? 'border-[#E7AC08] bg-white dark:bg-zinc-800 text-[#0F172A] dark:text-amber-100 ring-1 ring-[#E7AC08]/50 shadow-2xs font-bold'
                    : 'border-[#EDE8DF] dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/60 text-[#334155] dark:text-zinc-300 hover:border-[#CBD5E1] hover:bg-white dark:hover:bg-zinc-800'
                }`}
                title="Select High Saturation (Vibrant, rich & colorful background colors)"
              >
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">High Saturation</span>
                  </div>
                  <span className="text-[10px] text-[#64748B] dark:text-zinc-400 block font-normal">
                    Vibrant, rich & punchy
                  </span>
                </div>
                {/* Visual Swatches */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FDE047] border border-amber-300" title="#FDE047" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#38BDF8] border border-sky-300" title="#38BDF8" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F472B6] border border-pink-300" title="#F472B6" />
                </div>
              </button>
            </div>
          </div>

          {/* Format Selector Pills & Export Resolution */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-zinc-400">
              <span>Export Format</span>
              <button
                type="button"
                id="btn-toggle-export-settings"
                onClick={() => setShowExportSettings(!showExportSettings)}
                className="flex items-center gap-1 text-[11px] text-[#B45309] dark:text-amber-400 hover:text-[#92400E] font-medium"
              >
                <span>{exportRes}px resolution</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    showExportSettings ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {(['png', 'jpg', 'svg', 'pdf'] as ExportFormat[]).map((fmt) => {
                const isLockedFmt = fmt === 'svg' && !isUnlocked;
                return (
                  <button
                    key={fmt}
                    id={`format-btn-${fmt}`}
                    type="button"
                    onClick={() => {
                      if (isLockedFmt) {
                        openExclusiveModal('SVG Vector Format Export');
                        return;
                      }
                      setSelectedFormat(fmt);
                    }}
                    className={`relative py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl text-xs font-bold uppercase transition-all min-h-[34px] sm:min-h-[38px] flex items-center justify-center gap-1 cursor-pointer ${
                      selectedFormat === fmt
                        ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-xs ring-1 ring-[#0F172A] dark:ring-white'
                        : isLockedFmt
                        ? 'bg-[#FFFDF5] dark:bg-amber-950/20 text-[#78350F] dark:text-amber-300 hover:border-[#E7AC08]/50 border border-[#FDE68A] dark:border-amber-900/40'
                        : 'bg-[#F8F6F0] dark:bg-zinc-800 text-[#334155] dark:text-zinc-300 hover:bg-[#F1ECE1] dark:hover:bg-zinc-700 border border-[#EDE8DF] dark:border-zinc-700/60'
                    }`}
                  >
                    <span>{fmt}</span>
                    {isLockedFmt && (
                      <Crown className="w-2.5 h-2.5 text-[#D97706] dark:text-amber-400 stroke-[2.2] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Expandable Export Resolution Settings */}
            {showExportSettings && (
              <div className="p-3 rounded-xl bg-[#FDFCF9] dark:bg-zinc-800/40 border border-[#EDE8DF] dark:border-zinc-700/60 mt-2 space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#0F172A] dark:text-zinc-300">
                    Target Export Resolution
                  </span>
                  <span className="font-mono text-[#64748B] dark:text-zinc-400">{exportRes} px</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[256, 512, 1024, 2048].map((res) => {
                    const isLockedRes = res === 2048 && !isUnlocked;
                    return (
                      <button
                        key={res}
                        type="button"
                        onClick={() => {
                          if (isLockedRes) {
                            openExclusiveModal('2048 × 2048 Pixel Quality');
                            return;
                          }
                          setExportRes(res);
                          onOptionsChange?.({ size: res });
                        }}
                        className={`py-1.5 rounded-md text-[11px] font-mono border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          exportRes === res
                            ? 'border-[#E7AC08] bg-[#FFFBEA] dark:bg-amber-950/40 text-[#92400E] dark:text-amber-300 font-bold'
                            : 'border-[#EDE8DF] dark:border-zinc-700 text-[#64748B] dark:text-zinc-400 hover:border-zinc-300'
                        }`}
                      >
                        <span>{res}px</span>
                        {isLockedRes && (
                          <Crown className="w-2.5 h-2.5 text-[#D97706] dark:text-amber-400 stroke-[2.2]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Main Download CTA */}
          <div>
            <button
              id="main-download-qr-btn"
              type="button"
              disabled={isExporting || !payload}
              onClick={handleDownloadClick}
              className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 sm:px-6 min-h-[44px] sm:min-h-[48px] rounded-full bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] font-bold text-xs sm:text-sm shadow-md shadow-[#E7AC08]/25 hover:shadow-[#E7AC08]/35 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#E7AC08]/30"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>
                {isExporting
                  ? 'Generating Export...'
                  : `Download ${selectedFormat.toUpperCase()} (${exportRes}px)`}
              </span>
            </button>
          </div>

          {/* Secondary Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-0.5">
            {/* Copy Image */}
            <button
              id="btn-copy-image"
              type="button"
              onClick={handleCopyImage}
              className="flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2.5 min-h-[40px] sm:min-h-[44px] rounded-xl border border-[#EDE8DF] dark:border-zinc-700/80 bg-[#FDFCF9] dark:bg-zinc-800/90 text-[#0F172A] dark:text-zinc-100 hover:bg-[#F8F6F0] dark:hover:bg-zinc-700 active:scale-[0.98] transition-all text-center shadow-2xs font-semibold text-[11px] sm:text-xs"
              title="Copy QR image to clipboard"
            >
              <Copy className="w-3.5 h-3.5 shrink-0 text-[#64748B] dark:text-zinc-300" />
              <span>{copiedImage ? 'Copied ✓' : 'Copy Image'}</span>
            </button>

            {/* Copy Text */}
            <button
              id="btn-copy-payload"
              type="button"
              onClick={handleCopyContent}
              className="flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2.5 min-h-[40px] sm:min-h-[44px] rounded-xl border border-[#EDE8DF] dark:border-zinc-700/80 bg-[#FDFCF9] dark:bg-zinc-800/90 text-[#0F172A] dark:text-zinc-100 hover:bg-[#F8F6F0] dark:hover:bg-zinc-700 active:scale-[0.98] transition-all text-center shadow-2xs font-semibold text-[11px] sm:text-xs"
              title="Copy raw encoded data"
            >
              <FileCode className="w-3.5 h-3.5 shrink-0 text-[#64748B] dark:text-zinc-300" />
              <span>{copiedPayload ? 'Copied ✓' : 'Copy Data'}</span>
            </button>

            {/* Web Share */}
            <button
              id="btn-share-qr"
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2.5 min-h-[40px] sm:min-h-[44px] rounded-xl border border-[#EDE8DF] dark:border-zinc-700/80 bg-[#FDFCF9] dark:bg-zinc-800/90 text-[#0F172A] dark:text-zinc-100 hover:bg-[#F8F6F0] dark:hover:bg-zinc-700 active:scale-[0.98] transition-all text-center shadow-2xs font-semibold text-[11px] sm:text-xs"
              title="Share QR code"
            >
              <Share2 className="w-3.5 h-3.5 shrink-0 text-[#64748B] dark:text-zinc-300" />
              <span>Share QR</span>
            </button>

            {/* Save Template Locally */}
            <button
              id="btn-save-design"
              type="button"
              onClick={onSaveDesign}
              className="flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2.5 min-h-[40px] sm:min-h-[44px] rounded-xl border border-[#EDE8DF] dark:border-zinc-700/80 bg-[#FDFCF9] dark:bg-zinc-800/90 text-[#0F172A] dark:text-zinc-100 hover:bg-[#F8F6F0] dark:hover:bg-zinc-700 active:scale-[0.98] transition-all text-center shadow-2xs font-semibold text-[11px] sm:text-xs"
              title="Save visual styling as a reusable design template"
            >
              <BookmarkPlus className="w-3.5 h-3.5 shrink-0 text-[#E7AC08]" />
              <span>Save Template</span>
            </button>
          </div>

          {/* Readability Warnings if contrast or logo is risky */}
          {readability.warnings.length > 0 && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Readability Advisory (Contrast: {readability.contrastRatio}:1)</span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-400">
                {readability.warnings[0]} {readability.recommendations[0]}
              </p>
            </div>
          )}

          {/* Minimal Privacy Guarantee notice */}
          <div className="flex items-center gap-2 pt-0.5 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Generated locally in your browser. 100% private, no server upload.</span>
          </div>
        </div>
      </div>

      {/* Pre-Download Scannability Verification Modal Card */}
      <PreDownloadCheckModal
        isOpen={showPreDownloadCheck}
        onClose={() => setShowPreDownloadCheck(false)}
        onTestQr={() => {
          setShowPreDownloadCheck(false);
          onOpenScanner();
        }}
        onProceedDownload={executeDownload}
        isExporting={isExporting}
        format={selectedFormat}
        resolution={exportRes}
        payload={payload}
        dontShowAgain={dontShowAgainPreDownload}
        onToggleDontShowAgain={setDontShowAgainPreDownload}
      />

      {/* Dev Note Modal Dialog */}
      {showDevNoteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dev-note-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowDevNoteModal(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border-2 border-red-500/70 dark:border-red-600/60 shadow-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    id="dev-note-modal-title"
                    className="text-sm sm:text-base font-black text-[#0F172A] dark:text-zinc-100 tracking-tight"
                  >
                    Important Development Note
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isMinimal
                        ? 'text-zinc-900 dark:text-zinc-300'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    Status Update • Through Dec 2026
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDevNoteModal(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Close note dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2.5 leading-relaxed font-medium ${
                isMinimal
                  ? 'bg-zinc-50 dark:bg-zinc-800/90 border-2 border-black dark:border-zinc-700 text-zinc-950 dark:text-zinc-100'
                  : 'bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-100'
              }`}
            >
              <p>
                The app reaches at level where every system works well and polished so the development is stopped till december 2026.
              </p>
              <p>
                Any bug report may fix with request on ~{' '}
                <a
                  href="mailto:worsmon@proton.me?subject=EHSAAN%20QR%20Bug%20Report"
                  className={`font-bold underline ${
                    isMinimal
                      ? 'text-black dark:text-white'
                      : 'text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-white'
                  }`}
                >
                  worsmon@proton.me
                </a>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <a
                href="mailto:worsmon@proton.me?subject=EHSAAN%20QR%20Bug%20Report"
                className={`w-full sm:flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  isMinimal
                    ? 'bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black border-2 border-black dark:border-white shadow-xs'
                    : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-xs'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Bug Report</span>
              </a>

              <button
                type="button"
                onClick={handleCopyDevEmail}
                className={`w-full sm:w-auto py-2.5 px-3.5 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  isMinimal
                    ? 'border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                    : 'border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold'
                }`}
              >
                {copiedDevEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className={`w-3.5 h-3.5 ${isMinimal ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-500'}`} />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              {onOpenChangelog && (
                <button
                  type="button"
                  onClick={() => {
                    setShowDevNoteModal(false);
                    onOpenChangelog();
                  }}
                  className={`w-full sm:w-auto py-2.5 px-3 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                    isMinimal
                      ? 'border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                      : 'border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                  <span>Changelog</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

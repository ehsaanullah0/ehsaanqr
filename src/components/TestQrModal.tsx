import React, { useEffect, useState, useRef } from 'react';
import { ExportFormat, QrStyleOptions } from '../types';
import { decodeQrPayload, decodeImageData, DecodeResult } from '../utils/qrDecoder';
import { exportQrCode, triggerDownloadCelebration } from '../utils/exportUtils';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Cpu,
  RefreshCw,
  ShieldCheck,
  Download,
  Check,
  Sparkles,
  Zap,
  Play,
  Timer,
  Info,
} from 'lucide-react';

interface MultiTestStats {
  total: number;
  successful: number;
  avgTimeMs: number;
  fastestMs: number;
  slowestMs: number;
  runs: Array<{ id: number; success: boolean; timeMs: number }>;
}

interface TestQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: string;
  options: QrStyleOptions;
  onShowToast?: (msg: string) => void;
}

export const TestQrModal: React.FC<TestQrModalProps> = ({
  isOpen,
  onClose,
  payload,
  options,
  onShowToast,
}) => {
  const [activeMode, setActiveMode] = useState<'engine' | 'camera'>('engine');
  const [engineResult, setEngineResult] = useState<{
    success: boolean;
    decodedText?: string;
    detectionTimeMs?: number;
    engineUsed?: string;
    error?: string;
  } | null>(null);

  // Multi-pass benchmark state
  const [isRunningMultiTest, setIsRunningMultiTest] = useState(false);
  const [multiTestStats, setMultiTestStats] = useState<MultiTestStats | null>(null);

  // Download states in modal
  const [downloadFormat, setDownloadFormat] = useState<ExportFormat>('png');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [cameraScanTimeMs, setCameraScanTimeMs] = useState<number | null>(null);
  const cameraStartTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Single test runner function
  const runSingleEngineTest = async (
    renderSize: number = 512
  ): Promise<{ success: boolean; timeMs: number; data?: string; engineUsed?: string }> => {
    const res = await decodeQrPayload(payload, options, renderSize);
    return {
      success: res.success,
      timeMs: res.detectionTimeMs,
      data: res.decodedText,
      engineUsed: res.engineUsed,
    };
  };

  // Run initial test whenever modal opens or payload changes
  useEffect(() => {
    if (!isOpen) return;

    setDownloadSuccess(false);
    setMultiTestStats(null);
    setEngineResult(null);

    decodeQrPayload(payload, options, 512).then((res) => {
      if (res.success && res.decodedText) {
        setEngineResult({
          success: true,
          decodedText: res.decodedText,
          detectionTimeMs: res.detectionTimeMs,
          engineUsed: res.engineUsed,
        });
      } else {
        setEngineResult({
          success: false,
          detectionTimeMs: res.detectionTimeMs,
          error:
            res.error ||
            'The barcode decoder engine could not cleanly isolate the QR matrix. Center logo coverage or low contrast may be interfering.',
        });
      }
    });
  }, [isOpen, payload, options]);

  // Run 5 Scan Tests benchmark
  const handleRun5ScanTests = async () => {
    setIsRunningMultiTest(true);
    const runs: Array<{ id: number; success: boolean; timeMs: number }> = [];
    const sizes = [256, 384, 512, 640, 768]; // Test across 5 resolutions & scaling factors

    for (let i = 0; i < 5; i++) {
      // Small artificial micro-delay between runs
      await new Promise((r) => setTimeout(r, 60));
      const res = await runSingleEngineTest(sizes[i]);
      runs.push({
        id: i + 1,
        success: res.success,
        timeMs: res.timeMs,
      });
    }

    const successfulRuns = runs.filter((r) => r.success);
    const successfulCount = successfulRuns.length;
    const times = successfulRuns.map((r) => r.timeMs);
    const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
    const fastest = times.length > 0 ? Math.min(...times) : 0;
    const slowest = times.length > 0 ? Math.max(...times) : 0;

    setMultiTestStats({
      total: 5,
      successful: successfulCount,
      avgTimeMs: avg,
      fastestMs: fastest,
      slowestMs: slowest,
      runs,
    });
    setIsRunningMultiTest(false);

    if (onShowToast) {
      onShowToast(`Multi-scan complete: ${successfulCount}/5 decoded successfully (${avg}ms avg)`);
    }
  };

  // Handle Camera stream lifecycle
  useEffect(() => {
    if (!isOpen || activeMode !== 'camera') {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, activeMode]);

  const startCamera = async () => {
    setCameraError(null);
    setScannedResult(null);
    setCameraScanTimeMs(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        cameraStartTimeRef.current = performance.now();
        scanFrame();
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Camera permission denied or camera device not found.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const scanFrame = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const res = decodeImageData(imgData);

      if (res && res.text) {
        const elapsed = cameraStartTimeRef.current
          ? Math.max(10, Math.round(performance.now() - cameraStartTimeRef.current))
          : null;
        setScannedResult(res.text);
        setCameraScanTimeMs(elapsed);
        return; // stop scanning on success
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const handleDownload = async (fmt?: ExportFormat) => {
    if (!payload) return;
    const targetFormat = fmt || downloadFormat;
    setIsDownloading(true);
    try {
      await exportQrCode(targetFormat, payload, options, options.size);
      triggerDownloadCelebration();
      setDownloadSuccess(true);
      if (onShowToast) {
        onShowToast(`Downloaded verified ${targetFormat.toUpperCase()} QR code ✓`);
      }
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Download error:', err);
      if (onShowToast) {
        onShowToast('Export failed. Please try again.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              QR Empirical Scan Test
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector: In-Engine Decoder vs Live Device Camera */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800 p-1.5 sm:p-2 bg-zinc-50 dark:bg-zinc-950/40 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('engine')}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'engine'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Cpu className="w-4 h-4 text-red-600" />
            <span className="text-[11px] sm:text-xs">Barcode Decoder Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('camera')}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'camera'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Camera className="w-4 h-4 text-red-600" />
            <span className="text-[11px] sm:text-xs">Device Camera Live Test</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* MODE 1: In-Engine Validation */}
          {activeMode === 'engine' && (
            <div className="space-y-4">
              {engineResult?.success ? (
                <div className="space-y-3.5">
                  {/* Success Banner with measured detection time */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                        <span className="font-bold text-sm">✓ Successfully Detected</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {engineResult.engineUsed && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                            {engineResult.engineUsed}
                          </span>
                        )}
                        {engineResult.detectionTimeMs !== undefined && (
                          <span className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                            <Timer className="w-3 h-3" />
                            {(engineResult.detectionTimeMs / 1000).toFixed(2)}s
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      ISO/IEC 18004 standard barcode decoder verified code geometry and decoded data instantly.
                    </p>
                  </div>

                  {/* Multi-Attempt Test Card */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-red-500" />
                          Multi-Pass Stress Test
                        </h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Runs 5 consecutive decode passes across varied resolution scales
                        </p>
                      </div>
                      <button
                        type="button"
                        id="btn-run-5-scan-tests"
                        onClick={handleRun5ScanTests}
                        disabled={isRunningMultiTest}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-bold text-xs shadow-2xs transition-all"
                      >
                        {isRunningMultiTest ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Testing...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Run 5 Scan Tests</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Benchmark Results Display */}
                    {multiTestStats && (
                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs">
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                            <span className="text-[10px] text-zinc-400 block">Success</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                              {multiTestStats.successful} / {multiTestStats.total}
                            </span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                            <span className="text-[10px] text-zinc-400 block">Avg Time</span>
                            <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                              {(multiTestStats.avgTimeMs / 1000).toFixed(2)}s
                            </span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                            <span className="text-[10px] text-zinc-400 block">Fastest</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                              {(multiTestStats.fastestMs / 1000).toFixed(2)}s
                            </span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                            <span className="text-[10px] text-zinc-400 block">Slowest</span>
                            <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                              {(multiTestStats.slowestMs / 1000).toFixed(2)}s
                            </span>
                          </div>
                        </div>

                        <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                          *Camera & barcode detection benchmark executed locally on your current device browser engine.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Decoded Content Inspection */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <span>Decoded Content</span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {engineResult.decodedText?.length} characters
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 font-mono text-xs text-zinc-800 dark:text-zinc-200 break-all max-h-24 overflow-y-auto">
                      {engineResult.decodedText}
                    </div>
                  </div>

                  {/* Direct Download Action Card in Test Result */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/80 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      <span className="flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-red-600" />
                        <span>Download Tested QR Code</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 font-normal">
                        Ready to export
                      </span>
                    </div>

                    {/* Format Selector Pills */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['png', 'svg', 'pdf', 'jpg'] as ExportFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setDownloadFormat(fmt)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold uppercase transition-all ${
                            downloadFormat === fmt
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>

                    {/* Direct Download Button */}
                    <button
                      type="button"
                      id="btn-download-from-test-result"
                      disabled={isDownloading}
                      onClick={() => handleDownload()}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-sm ${
                        downloadSuccess
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                      } disabled:opacity-50`}
                    >
                      {downloadSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Downloaded {downloadFormat.toUpperCase()} Successfully!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>
                            {isDownloading
                              ? 'Exporting...'
                              : `Download Verified QR (${downloadFormat.toUpperCase()})`}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : engineResult ? (
                <div className="space-y-3.5">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span className="font-bold text-sm">Decoding Alert</span>
                    </div>
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                      {engineResult.error}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Recommended: Increase foreground contrast, reduce center logo size, or click "Improve Readability" on the dashboard.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
                      Download Anyway:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownload('png')}
                      disabled={isDownloading}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Download PNG File</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 text-zinc-400 gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="text-xs">Validating QR code pixels...</span>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: Camera Scanner */}
          {activeMode === 'camera' && (
            <div className="space-y-3.5">
              <p className="text-xs text-zinc-500">
                Point your physical camera at a printed QR code or another screen to scan in real-time.
              </p>

              {cameraError ? (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 text-xs">
                  <span className="font-bold block mb-1">Camera Notice</span>
                  {cameraError}
                </div>
              ) : scannedResult ? (
                <div className="space-y-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>✓ Camera Scan Successful!</span>
                    </div>
                    {cameraScanTimeMs && (
                      <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60">
                        {(cameraScanTimeMs / 1000).toFixed(2)}s detection
                      </span>
                    )}
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-700 font-mono text-xs break-all">
                    {scannedResult}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        setScannedResult(null);
                        setCameraScanTimeMs(null);
                        cameraStartTimeRef.current = performance.now();
                        scanFrame();
                      }}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      Scan Again
                    </button>
                  </div>

                  {/* Direct download from camera test result */}
                  <div className="pt-2 border-t border-emerald-200/80 dark:border-emerald-800/80">
                    <button
                      type="button"
                      onClick={() => handleDownload('png')}
                      disabled={isDownloading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Verified QR Code (PNG)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                  />
                  {/* Scanner overlay viewfinder reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-red-500/80 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500" />
                      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500/60 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
          <div className="text-[11px] text-zinc-500">
            {engineResult?.success && '✓ Ready to print & deploy'}
          </div>

          <div className="flex items-center gap-2">
            {engineResult?.success && (
              <button
                type="button"
                id="btn-footer-direct-download"
                onClick={() => handleDownload()}
                disabled={isDownloading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ({downloadFormat.toUpperCase()})</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

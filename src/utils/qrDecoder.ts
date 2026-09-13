import jsQR from 'jsqr';
import {
  MultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  RGBLuminanceSource,
  BinaryBitmap,
  HybridBinarizer,
  GlobalHistogramBinarizer,
} from '@zxing/library';
import { QrStyleOptions } from '../types';
import { renderQrToCanvas } from './qrRenderer';

export interface DecodeResult {
  success: boolean;
  decodedText?: string;
  detectionTimeMs: number;
  engineUsed?: string;
  error?: string;
}

// Pre-initialize ZXing reader with QR code hints
const hints = new Map();
hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
hints.set(DecodeHintType.TRY_HARDER, true);

const zxingReader = new MultiFormatReader();
zxingReader.setHints(hints);

/**
 * Parses Hex color to RGB
 */
function parseHexColor(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 255, g: 255, b: 255 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculates Otsu threshold from luminance histogram
 */
function calculateOtsuThreshold(grayData: Uint8ClampedArray): number {
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < grayData.length; i++) {
    histogram[grayData[i]]++;
  }

  const total = grayData.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let maxVariance = 0;
  let threshold = 128;

  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;

    sumB += t * histogram[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;

    const varianceBetween = wB * wF * (mB - mF) * (mB - mF);
    if (varianceBetween > maxVariance) {
      maxVariance = varianceBetween;
      threshold = t;
    }
  }

  return threshold;
}

/**
 * Creates color-distance binarized ImageData
 * Separates foreground elements from background based on Euclidean distance in RGB color space
 */
function createColorDistanceBinarized(
  imageData: ImageData,
  bgHex: string
): ImageData {
  const { width, height, data } = imageData;
  const bg = parseHexColor(bgHex);
  const out = new ImageData(new Uint8ClampedArray(data.length), width, height);

  // Compute average distance from background
  const distances = new Float32Array(width * height);
  let totalDist = 0;

  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a = data[i * 4 + 3];

    if (a < 128) {
      // Transparent is treated as background
      distances[i] = 0;
    } else {
      const dr = r - bg.r;
      const dg = g - bg.g;
      const db = b - bg.b;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      distances[i] = dist;
      totalDist += dist;
    }
  }

  const avgDist = totalDist / (width * height);
  const threshold = Math.max(25, avgDist * 0.7);

  for (let i = 0; i < width * height; i++) {
    const isFg = distances[i] > threshold;
    const val = isFg ? 0 : 255; // 0 = black (module), 255 = white (background)
    out.data[i * 4] = val;
    out.data[i * 4 + 1] = val;
    out.data[i * 4 + 2] = val;
    out.data[i * 4 + 3] = 255;
  }

  return out;
}

/**
 * Creates Otsu-binarized grayscale ImageData
 */
function createOtsuBinarized(imageData: ImageData): ImageData {
  const { width, height, data } = imageData;
  const grays = new Uint8ClampedArray(width * height);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    // Standard Rec. 709 luminance
    grays[i] = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
  }

  const threshold = calculateOtsuThreshold(grays);
  const out = new ImageData(new Uint8ClampedArray(data.length), width, height);

  for (let i = 0; i < width * height; i++) {
    const val = grays[i] < threshold ? 0 : 255;
    out.data[i * 4] = val;
    out.data[i * 4 + 1] = val;
    out.data[i * 4 + 2] = val;
    out.data[i * 4 + 3] = 255;
  }

  return out;
}

/**
 * Attempts decoding on a single ImageData using ZXing (Hybrid + Histogram) and jsQR
 */
export function decodeImageData(imageData: ImageData): { text: string; engine: string } | null {
  const { width, height, data } = imageData;

  // 1. Try ZXing with HybridBinarizer (Industry Standard)
  try {
    const luminances = new Uint8ClampedArray(width * height);
    for (let i = 0; i < width * height; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      luminances[i] = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    }

    const source = new RGBLuminanceSource(luminances, width, height);
    const bitmap = new BinaryBitmap(new HybridBinarizer(source));
    const result = zxingReader.decode(bitmap);
    if (result && result.getText()) {
      return { text: result.getText(), engine: 'ZXing Hybrid' };
    }
  } catch {
    // Continue to next pass
  }

  // 2. Try jsQR with native inversion attempts
  try {
    const code = jsQR(data, width, height, {
      inversionAttempts: 'attemptBoth',
    });
    if (code && code.data) {
      return { text: code.data, engine: 'jsQR Native' };
    }
  } catch {
    // Continue to next pass
  }

  // 3. Try ZXing with GlobalHistogramBinarizer
  try {
    const luminances = new Uint8ClampedArray(width * height);
    for (let i = 0; i < width * height; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      luminances[i] = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    }
    const source = new RGBLuminanceSource(luminances, width, height);
    const bitmap = new BinaryBitmap(new GlobalHistogramBinarizer(source));
    const result = zxingReader.decode(bitmap);
    if (result && result.getText()) {
      return { text: result.getText(), engine: 'ZXing Histogram' };
    }
  } catch {
    // Continue
  }

  return null;
}

/**
 * Robust Multi-Pass QR Decoder Engine
 * Renders and evaluates the QR code with multiple advanced adaptive passes:
 * 1. Native Rendered Pixels
 * 2. Color-Distance Normalized Binarization (handles custom colors, gradients, and shaped pupils)
 * 3. Otsu Dynamic Luminance Thresholding
 * 4. Multi-Resolution Fallbacks (e.g. 512px, 384px, 640px)
 */
export async function decodeQrPayload(
  payload: string,
  options: QrStyleOptions,
  preferredSize: number = 512
): Promise<DecodeResult> {
  const startTime = performance.now();

  const sizesToTry = [preferredSize, 400, 600];

  for (const size of sizesToTry) {
    try {
      const canvas = document.createElement('canvas');
      await renderQrToCanvas(canvas, payload, { ...options, size });
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      const rawImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Pass 1: Raw image with Dual Engine (ZXing + jsQR)
      const rawRes = decodeImageData(rawImageData);
      if (rawRes) {
        const elapsed = Math.max(1, Math.round(performance.now() - startTime));
        return {
          success: true,
          decodedText: rawRes.text,
          detectionTimeMs: elapsed,
          engineUsed: rawRes.engine,
        };
      }

      // Pass 2: Color-Distance Binarization (separates custom bg/fg/pupil hues)
      const bgHex = options.transparentBg ? '#FFFFFF' : options.bgColor;
      const colorBinarized = createColorDistanceBinarized(rawImageData, bgHex);
      const colorRes = decodeImageData(colorBinarized);
      if (colorRes) {
        const elapsed = Math.max(1, Math.round(performance.now() - startTime));
        return {
          success: true,
          decodedText: colorRes.text,
          detectionTimeMs: elapsed,
          engineUsed: `${colorRes.engine} (Color-Adaptive)`,
        };
      }

      // Pass 3: Otsu Dynamic Thresholding
      const otsuBinarized = createOtsuBinarized(rawImageData);
      const otsuRes = decodeImageData(otsuBinarized);
      if (otsuRes) {
        const elapsed = Math.max(1, Math.round(performance.now() - startTime));
        return {
          success: true,
          decodedText: otsuRes.text,
          detectionTimeMs: elapsed,
          engineUsed: `${otsuRes.engine} (Otsu-Adaptive)`,
        };
      }
    } catch (err) {
      console.warn('Decode pass attempt error:', err);
    }
  }

  const duration = Math.max(1, Math.round(performance.now() - startTime));
  return {
    success: false,
    detectionTimeMs: duration,
    error:
      'The multi-engine decoder could not isolate a valid QR matrix. Very low contrast or high center logo coverage (>30%) may be impeding recognition.',
  };
}

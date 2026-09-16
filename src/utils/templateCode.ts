import { SavedQrDesign, QrStyleOptions } from '../types';
import { renderQrToCanvas } from './qrRenderer';

export const TEMPLATE_CODE_PREFIX = 'EHSAAN-TPL-';
export const BUNDLE_CODE_PREFIX = 'EHSAAN-BUNDLE-';

/**
 * Generates an instant thumbnail for a template style using the live canvas renderer
 */
export async function generateTemplateThumbnail(style: QrStyleOptions): Promise<string | undefined> {
  try {
    if (typeof document === 'undefined') return undefined;
    const offscreen = document.createElement('canvas');
    await renderQrToCanvas(offscreen, 'https://ehsaan.io', {
      ...style,
      size: 120,
    });
    return offscreen.toDataURL('image/png');
  } catch (e) {
    console.warn('Could not generate template thumbnail', e);
    return undefined;
  }
}

export interface TemplateCodePayload {
  v: 1;
  type: 'ehsaan-template';
  name: string;
  timestamp?: number;
  style: QrStyleOptions;
  thumbnail?: string;
}

export interface BundleCodePayload {
  v: 1;
  type: 'ehsaan-bundle';
  exportedAt: number;
  templates: Array<{
    name: string;
    style: QrStyleOptions;
    timestamp?: number;
    thumbnail?: string;
  }>;
}

export interface ParseTemplateSuccess {
  success: true;
  isBundle: boolean;
  templates: SavedQrDesign[];
  summary: string;
}

export interface ParseTemplateError {
  success: false;
  error: string;
}

export type ParseTemplateResult = ParseTemplateSuccess | ParseTemplateError;

/**
 * UTF-8 safe base64 encoding (handles unicode, emojis, Arabic/Urdu, etc.)
 */
function toBase64Unicode(str: string): string {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch {
    return btoa(str);
  }
}

/**
 * UTF-8 safe base64 decoding
 */
function fromBase64Unicode(base64: string): string {
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return atob(base64);
  }
}

/**
 * Normalizes a partial style object into a complete, safe QrStyleOptions
 */
export function sanitizeStyleOptions(rawStyle: Partial<QrStyleOptions> | undefined): QrStyleOptions {
  const safe: Partial<QrStyleOptions> = rawStyle || {};

  return {
    colorMode: safe.colorMode === 'radial-gradient' || safe.colorMode === 'linear-gradient' ? safe.colorMode : 'solid',
    fgColor: typeof safe.fgColor === 'string' && safe.fgColor.trim() ? safe.fgColor : '#000000',
    fgColorEnd: typeof safe.fgColorEnd === 'string' && safe.fgColorEnd.trim() ? safe.fgColorEnd : '#1F2937',
    gradientAngle: typeof safe.gradientAngle === 'number' ? safe.gradientAngle : 135,
    bgColor: typeof safe.bgColor === 'string' && safe.bgColor.trim() ? safe.bgColor : '#FFFFFF',
    transparentBg: Boolean(safe.transparentBg),
    bgSaturationPreference: safe.bgSaturationPreference === 'high' ? 'high' : 'low',
    patternStyle:
      (safe.patternStyle as unknown as string) === 'chamfer'
        ? 'octagon'
        : (safe.patternStyle as unknown as string) === 'soft-rounded'
        ? 'squircle'
        : (safe.patternStyle as unknown as string) === 'dots'
        ? 'circle'
        : safe.patternStyle || 'square',
    cornerStyle: safe.cornerStyle || 'smooth',
    eyeStyle: safe.eyeStyle || 'rounded',
    pupilStyle: safe.pupilStyle || 'auto',
    customEyeColors: Boolean(safe.customEyeColors),
    eyeOuterColor: typeof safe.eyeOuterColor === 'string' && safe.eyeOuterColor.trim() ? safe.eyeOuterColor : '#000000',
    eyeInnerColor: typeof safe.eyeInnerColor === 'string' && safe.eyeInnerColor.trim() ? safe.eyeInnerColor : '#000000',
    logo: {
      type:
        safe.logo?.type === 'url' ||
        safe.logo?.type === 'phone' ||
        safe.logo?.type === 'whatsapp' ||
        safe.logo?.type === 'wifi' ||
        safe.logo?.type === 'email' ||
        safe.logo?.type === 'upi' ||
        safe.logo?.type === 'payment' ||
        safe.logo?.type === 'custom'
          ? safe.logo.type
          : 'none',
      customUrl: safe.logo?.customUrl || undefined,
      sizeRatio: typeof safe.logo?.sizeRatio === 'number' ? safe.logo.sizeRatio : 0.2,
      padding: typeof safe.logo?.padding === 'number' ? safe.logo.padding : 4,
      background: safe.logo?.background || 'transparent',
      customBgColor: safe.logo?.customBgColor || '#FFFFFF',
      borderRadius: typeof safe.logo?.borderRadius === 'number' ? safe.logo.borderRadius : 50,
      autoAdapt: typeof safe.logo?.autoAdapt === 'boolean' ? safe.logo.autoAdapt : true,
    },
    size: typeof safe.size === 'number' ? safe.size : 1024,
    margin: typeof safe.margin === 'number' ? safe.margin : 2,
    errorCorrection: safe.errorCorrection === 'H' || safe.errorCorrection === 'Q' || safe.errorCorrection === 'M' ? safe.errorCorrection : 'Q',
  };
}

/**
 * Encodes a single SavedQrDesign into an exportable EHSAAN-TPL-... code string
 */
export function encodeTemplateToCode(design: SavedQrDesign | { name: string; style: QrStyleOptions }): string {
  const payload: TemplateCodePayload = {
    v: 1,
    type: 'ehsaan-template',
    name: (design.name || 'Custom Template').trim(),
    timestamp: 'timestamp' in design && typeof design.timestamp === 'number' ? design.timestamp : Date.now(),
    style: sanitizeStyleOptions(design.style),
  };

  const json = JSON.stringify(payload);
  const base64 = toBase64Unicode(json);
  return `${TEMPLATE_CODE_PREFIX}${base64}`;
}

/**
 * Encodes a collection of SavedQrDesigns into an exportable EHSAAN-BUNDLE-... code string
 */
export function encodeBundleToCode(designs: SavedQrDesign[]): string {
  const payload: BundleCodePayload = {
    v: 1,
    type: 'ehsaan-bundle',
    exportedAt: Date.now(),
    templates: designs.map((d) => ({
      name: d.name,
      style: sanitizeStyleOptions(d.style),
      timestamp: d.timestamp,
    })),
  };

  const json = JSON.stringify(payload);
  const base64 = toBase64Unicode(json);
  return `${BUNDLE_CODE_PREFIX}${base64}`;
}

/**
 * Robust parser that handles:
 * - EHSAAN-TPL-[base64]
 * - EHSAAN-BUNDLE-[base64]
 * - Raw JSON objects or arrays
 * - Trims accidental whitespace, backticks, or quotes
 */
export function parseTemplateCode(rawInput: string): ParseTemplateResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return { success: false, error: 'Please enter or paste a template code.' };
  }

  let cleaned = rawInput.trim();
  // Strip accidental outer quotes or markdown code markers
  if (cleaned.startsWith('`') && cleaned.endsWith('`')) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // 1. Check for single EHSAAN-TPL- code
  if (cleaned.startsWith(TEMPLATE_CODE_PREFIX)) {
    const base64Part = cleaned.slice(TEMPLATE_CODE_PREFIX.length).trim();
    try {
      const json = fromBase64Unicode(base64Part);
      const parsed = JSON.parse(json);
      return parseSinglePayload(parsed);
    } catch (e) {
      return {
        success: false,
        error: 'Invalid template code. The code appears corrupted or improperly formatted.',
      };
    }
  }

  // 2. Check for bundle EHSAAN-BUNDLE- code
  if (cleaned.startsWith(BUNDLE_CODE_PREFIX)) {
    const base64Part = cleaned.slice(BUNDLE_CODE_PREFIX.length).trim();
    try {
      const json = fromBase64Unicode(base64Part);
      const parsed = JSON.parse(json);
      return parseBundlePayload(parsed);
    } catch (e) {
      return {
        success: false,
        error: 'Invalid bundle code. The code appears corrupted or improperly formatted.',
      };
    }
  }

  // 3. Fallback: Check if user pasted raw JSON
  if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parseArrayOfTemplates(parsed);
      }
      if (parsed.type === 'ehsaan-bundle' || Array.isArray(parsed.templates)) {
        return parseBundlePayload(parsed);
      }
      return parseSinglePayload(parsed);
    } catch {
      return {
        success: false,
        error: 'Invalid JSON format. Please verify the copied template data.',
      };
    }
  }

  // 4. Fallback: Raw base64 without prefix
  try {
    const json = fromBase64Unicode(cleaned);
    if (json.startsWith('{') || json.startsWith('[')) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        return parseArrayOfTemplates(parsed);
      }
      if (parsed.type === 'ehsaan-bundle' || Array.isArray(parsed.templates)) {
        return parseBundlePayload(parsed);
      }
      return parseSinglePayload(parsed);
    }
  } catch {
    // ignore
  }

  return {
    success: false,
    error: 'Unrecognized template format. Template codes begin with "EHSAAN-TPL-".',
  };
}

function parseSinglePayload(obj: any): ParseTemplateResult {
  if (!obj || typeof obj !== 'object') {
    return { success: false, error: 'Parsed content is not a valid template object.' };
  }

  const name = typeof obj.name === 'string' && obj.name.trim() ? obj.name.trim() : 'Imported Template';
  const rawStyle = obj.style || obj;
  const style = sanitizeStyleOptions(rawStyle);

  const design: SavedQrDesign = {
    id: 'template-imported-' + Date.now(),
    name,
    timestamp: typeof obj.timestamp === 'number' ? obj.timestamp : Date.now(),
    style,
    previewThumbnail: typeof obj.thumbnail === 'string' && obj.thumbnail.startsWith('data:image/') ? obj.thumbnail : undefined,
  };

  return {
    success: true,
    isBundle: false,
    templates: [design],
    summary: `Valid template: "${name}" (${style.patternStyle} pattern, ${style.colorMode} color)`,
  };
}

function parseBundlePayload(obj: any): ParseTemplateResult {
  const templatesList = Array.isArray(obj?.templates) ? obj.templates : [];
  if (templatesList.length === 0) {
    return { success: false, error: 'Bundle contains no templates.' };
  }

  const resultTemplates: SavedQrDesign[] = templatesList.map((item: any, idx: number) => {
    const name = typeof item?.name === 'string' && item.name.trim() ? item.name.trim() : `Imported Template #${idx + 1}`;
    const rawStyle = item?.style || item;
    const style = sanitizeStyleOptions(rawStyle);

    return {
      id: `template-bundle-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      timestamp: typeof item?.timestamp === 'number' ? item.timestamp : Date.now(),
      style,
      previewThumbnail: typeof item?.thumbnail === 'string' && item.thumbnail.startsWith('data:image/') ? item.thumbnail : undefined,
    };
  });

  return {
    success: true,
    isBundle: true,
    templates: resultTemplates,
    summary: `Bundle found with ${resultTemplates.length} templates.`,
  };
}

function parseArrayOfTemplates(arr: any[]): ParseTemplateResult {
  if (arr.length === 0) {
    return { success: false, error: 'List is empty.' };
  }

  const resultTemplates: SavedQrDesign[] = arr.map((item: any, idx: number) => {
    const name = typeof item?.name === 'string' && item.name.trim() ? item.name.trim() : `Imported Template #${idx + 1}`;
    const rawStyle = item?.style || item;
    const style = sanitizeStyleOptions(rawStyle);

    return {
      id: `template-arr-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      timestamp: typeof item?.timestamp === 'number' ? item.timestamp : Date.now(),
      style,
      previewThumbnail: typeof item?.previewThumbnail === 'string' && item.previewThumbnail.startsWith('data:image/')
        ? item.previewThumbnail
        : typeof item?.thumbnail === 'string' && item.thumbnail.startsWith('data:image/')
        ? item.thumbnail
        : undefined,
    };
  });

  return {
    success: true,
    isBundle: resultTemplates.length > 1,
    templates: resultTemplates,
    summary: `${resultTemplates.length} templates found in data.`,
  };
}

/**
 * Helper to trigger a local file download of template code
 */
export function downloadTextFile(filename: string, textContent: string) {
  try {
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Download failed', e);
  }
}

/**
 * Built-in sample template code for one-click testing
 */
export const SAMPLE_TEMPLATE_CODE = encodeTemplateToCode({
  name: 'Velvet Sunset (Linear Gradient)',
  style: {
    colorMode: 'linear-gradient',
    fgColor: '#F43F5E',
    fgColorEnd: '#8B5CF6',
    gradientAngle: 135,
    bgColor: '#FFFFFF',
    transparentBg: false,
    bgSaturationPreference: 'low',
    patternStyle: 'liquid',
    cornerStyle: 'smooth',
    eyeStyle: 'rounded',
    pupilStyle: 'auto',
    customEyeColors: true,
    eyeOuterColor: '#E11D48',
    eyeInnerColor: '#7C3AED',
    logo: {
      type: 'none',
      sizeRatio: 0.2,
      padding: 4,
      background: 'transparent',
      customBgColor: '#FFFFFF',
      borderRadius: 50,
    },
    size: 1024,
    margin: 2,
    errorCorrection: 'Q',
  },
});


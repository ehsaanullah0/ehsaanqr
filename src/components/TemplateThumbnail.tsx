import React, { useState, useEffect, useRef } from 'react';
import { QrStyleOptions } from '../types';
import { generateTemplateThumbnail } from '../utils/templateCode';
import { Layers } from 'lucide-react';

interface TemplateThumbnailProps {
  style: QrStyleOptions;
  thumbnailUrl?: string;
  alt?: string;
  className?: string;
  size?: number; // pixel dimension (default 48px)
  onGenerated?: (thumb: string) => void;
}

// In-memory cache for rendered thumbnails to prevent duplicate canvas operations
const thumbnailCache = new Map<string, string>();

function getStyleCacheKey(style: QrStyleOptions): string {
  try {
    return [
      style.patternStyle,
      style.colorMode,
      style.fgColor,
      style.fgColorEnd,
      style.bgColor,
      style.transparentBg,
      style.cornerStyle,
      style.eyeStyle,
      style.pupilStyle,
      style.customEyeColors,
      style.eyeOuterColor,
      style.eyeInnerColor,
      style.logo?.type,
      style.logo?.customUrl,
      style.margin,
    ].join('|');
  } catch {
    return Math.random().toString();
  }
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  style,
  thumbnailUrl,
  alt = 'Template Preview',
  className = 'w-12 h-12 rounded-xl object-contain bg-white border border-zinc-200 dark:border-zinc-700 p-0.5 shrink-0 shadow-2xs',
  size = 48,
  onGenerated,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(() => {
    if (thumbnailUrl && thumbnailUrl.startsWith('data:image/')) {
      return thumbnailUrl;
    }
    const cacheKey = getStyleCacheKey(style);
    return thumbnailCache.get(cacheKey) || null;
  });

  const [hasError, setHasError] = useState(false);
  const isGeneratingRef = useRef(false);

  useEffect(() => {
    // If external valid thumbnailUrl provided
    if (thumbnailUrl && thumbnailUrl.startsWith('data:image/')) {
      setCurrentSrc(thumbnailUrl);
      setHasError(false);
      return;
    }

    const cacheKey = getStyleCacheKey(style);
    const cached = thumbnailCache.get(cacheKey);
    if (cached) {
      setCurrentSrc(cached);
      setHasError(false);
      return;
    }

    // Otherwise, generate thumbnail on demand
    let isCancelled = false;
    isGeneratingRef.current = true;

    generateTemplateThumbnail(style)
      .then((dataUrl) => {
        if (!isCancelled && dataUrl) {
          thumbnailCache.set(cacheKey, dataUrl);
          setCurrentSrc(dataUrl);
          setHasError(false);
          onGenerated?.(dataUrl);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setHasError(true);
        }
      })
      .finally(() => {
        isGeneratingRef.current = false;
      });

    return () => {
      isCancelled = true;
    };
  }, [style, thumbnailUrl]);

  if (currentSrc && !hasError) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    );
  }

  // Graceful fallback while rendering or on failure
  return (
    <div
      className={`${className} flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400`}
      style={{ width: size, height: size }}
      title={alt}
    >
      <Layers className="w-5 h-5 text-zinc-400 animate-pulse" />
    </div>
  );
};

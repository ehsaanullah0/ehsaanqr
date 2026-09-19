import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Globe,
  Palette,
  QrCode,
  Sparkles,
  Download,
  Layers,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Dices,
  Sliders,
  Compass,
  ArrowRight,
  SunMedium,
} from 'lucide-react';

export const STORAGE_TOUR_KEY = 'ehsaan_qr_tour_completed';

export type PreferredPlacement = 'bottom' | 'top' | 'side' | 'center';

export interface TourStep {
  id: string;
  badge: string;
  title: string;
  description: string;
  targetId?: string;
  secondaryTargetId?: string;
  icon: React.ComponentType<{ className?: string }>;
  tip?: string;
  preferredPlacement?: PreferredPlacement;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    badge: 'Quick Guide',
    title: 'Welcome to EHSAAN QR',
    description:
      'A private, zero-server QR generation studio with deep customization, real-time scanning intelligence, and high-res export formats.',
    icon: Compass,
    preferredPlacement: 'center',
    tip: 'Take this quick 1-minute walkthrough to discover all features and pro tools.',
  },
  {
    id: 'qr-types',
    badge: 'Step 1 • Categories',
    title: '11 Specialized QR Types',
    description:
      'Choose from URLs, Phone, SMS, Wi-Fi, WhatsApp direct chat, Location maps, UPI, vCards, Calendar events, and Plain text.',
    targetId: 'qr-type-selector-section',
    secondaryTargetId: 'type-select-url',
    icon: Globe,
    preferredPlacement: 'bottom',
    tip: 'Each category automatically tailors inputs to standard protocol schemes.',
  },
  {
    id: 'app-themes',
    badge: 'Step 2 • Theming',
    title: '4 Refined App Themes',
    description:
      'Switch between Minimal (warm amber cream), Light, Dark, or Material themes anytime to adapt the app to your workspace.',
    targetId: 'header-theme-toggle-btn',
    icon: SunMedium,
    preferredPlacement: 'bottom',
    tip: 'Your active theme is remembered automatically across browser sessions.',
  },
  {
    id: 'qr-testing',
    badge: 'Step 3 • Verification',
    title: 'Real-Time QR Testing Scanner',
    description:
      'Validate your QR code right inside the browser using your device camera or uploaded test image to guarantee 100% scannability.',
    targetId: 'header-test-qr-btn',
    secondaryTargetId: 'btn-test-qr-validator-top',
    icon: QrCode,
    preferredPlacement: 'bottom',
    tip: 'Runs multi-pass decoders to simulate real-world hardware sensors.',
  },
  {
    id: 'live-preview',
    badge: 'Step 4 • Preview',
    title: 'Live QR Preview Matrix',
    description:
      'Watch your matrix update instantaneously as you type, style colors, adjust shapes, or customize center logos with zero latency.',
    targetId: 'qr-code-canvas',
    secondaryTargetId: 'qr-canvas-container',
    icon: QrCode,
    preferredPlacement: 'bottom',
    tip: 'Uses high-precision sub-pixel vector rendering for maximum sharpness.',
  },
  {
    id: 'readability-intelligence',
    badge: 'Step 5 • Intelligence',
    title: 'Readability Health & ISO Check',
    description:
      'Built-in scanning intelligence measures WCAG AA contrast ratio, module quiet zones, and error correction margin before print.',
    targetId: 'readability-dashboard-header',
    secondaryTargetId: 'qr-readability-dashboard',
    icon: ShieldCheck,
    preferredPlacement: 'top',
    tip: 'Aim for a score above 80/100 to ensure fast reads in low light.',
  },
  {
    id: 'saturation-engine',
    badge: 'Step 6 • Palette Control',
    title: 'Low & High Saturation Options',
    description:
      'Easily tune background saturation: Low Saturation delivers soft pastel palettes; High Saturation unlocks vivid color themes.',
    targetId: 'randomize-bg-saturation-card',
    secondaryTargetId: 'btn-bg-saturation-low',
    icon: Palette,
    preferredPlacement: 'top',
    tip: 'Seamlessly affects both manual presets and smart randomized styling.',
  },
  {
    id: 'smart-randomize',
    badge: 'Step 7 • Smart Randomize',
    title: 'Randomize & Selective Lock',
    description:
      'Roll new designer themes with 🎲, or expand the lock menu to freeze favorite colors or shapes while re-rolling the rest.',
    targetId: 'panel-rand-action-btn',
    secondaryTargetId: 'preview-rand-action-btn',
    icon: Dices,
    preferredPlacement: 'bottom',
    tip: 'Use category locks to protect your brand colors while experimenting.',
  },
  {
    id: 'customization-suite',
    badge: 'Step 8 • Customization',
    title: 'Colours, Patterns, Eyes & Quality',
    description:
      'Deeply style every element: solid or gradient colors, fluid liquid shapes, 45° cut-corner eyes, and adjustable error correction.',
    targetId: 'customization-panel-tabs',
    secondaryTargetId: 'customization-panel',
    icon: Sliders,
    preferredPlacement: 'bottom',
    tip: 'Includes 28 balanced color presets with verified optical contrast.',
  },
  {
    id: 'center-logo',
    badge: 'Step 9 • Center Logo',
    title: 'Center Logo & Auto-Adaptation',
    description:
      'Upload custom brand logos or toggle Auto-adapt to pair clean monochrome icons with your selected QR category.',
    targetId: 'tab-custom-logo',
    secondaryTargetId: 'customization-panel-tabs',
    icon: Sparkles,
    preferredPlacement: 'bottom',
    tip: 'When a center logo is active, Error Correction is boosted to preserve readability.',
  },
  {
    id: 'download-export',
    badge: 'Step 10 • Export Suite',
    title: 'Multi-Format Download & 4K Res',
    description:
      'Export finished designs in PNG, JPG, SVG vector, or PDF formats. Select resolutions up to 2048px or copy to clipboard.',
    targetId: 'main-download-qr-btn',
    secondaryTargetId: 'btn-toggle-export-settings',
    icon: Download,
    preferredPlacement: 'top',
    tip: 'SVG vectors are ideal for high-resolution print and branding (Exclusive feature).',
  },
  {
    id: 'templates-backup',
    badge: 'Step 11 • Templates & Backup',
    title: 'Design Templates & Backup System',
    description:
      'Save custom styling presets locally without an account. Export 1-click portable template codes or backup full bundles as text/JSON files to transfer designs across devices with zero server tracking.',
    targetId: 'header-saved-designs-btn',
    secondaryTargetId: 'btn-save-design',
    icon: Layers,
    preferredPlacement: 'bottom',
    tip: 'Click "Open Templates & Backup Window" or tap Templates in the header to view saved presets, paste codes, or download backups.',
  },
  {
    id: 'mobile-nav',
    badge: 'Step 12 • Reachability',
    title: 'Floating Bottom Navigation',
    description:
      'On phones and tablets, use the tactile floating bottom dock to jump between Colour, Pattern, Eyes, Logo, and Quality controls.',
    targetId: 'mobile-floating-nav',
    secondaryTargetId: 'customization-panel-tabs',
    icon: Smartphone,
    preferredPlacement: 'top',
    tip: 'Smoothly scrolls directly to the active customization section when tapped.',
  },
  {
    id: 'github-changelog',
    badge: 'Step 13 • Open Source',
    title: 'GitHub Repository & Changelog',
    description:
      'EHSAAN QR is free, client-side, and open source. Explore version release history (v1.1.5), review commit logs, or star on GitHub.',
    targetId: 'header-changelog-btn',
    secondaryTargetId: 'opensource-showcase',
    icon: Sparkles,
    preferredPlacement: 'bottom',
    tip: 'Check what is new in each release or contribute improvements on GitHub.',
  },
  {
    id: 'pwa-install',
    badge: 'Step 14 • Installability',
    title: 'Progressive Web App (PWA)',
    description:
      'Install EHSAAN QR to your desktop or mobile home screen as a standalone application that launches instantly and works offline.',
    targetId: 'pwa-install-app-btn',
    secondaryTargetId: 'pwa-install-section',
    icon: Smartphone,
    preferredPlacement: 'top',
    tip: 'Enjoy a windowed, browser-clutter-free workspace anytime.',
  },
  {
    id: 'ehsaan-ecosystem',
    badge: 'Step 15 • Ecosystem',
    title: 'EHSAAN Ecosystem (ehsaan.odoo.com)',
    description:
      'Visit ehsaan.odoo.com — the central home for all official EHSAAN applications, including Ehsaan Compressor and productivity utilities.',
    targetId: 'footer-ehsaan-odoo-link',
    secondaryTargetId: 'footer-ehsaan-compressor-btn',
    icon: ExternalLink,
    preferredPlacement: 'top',
    tip: 'Explore complementary tools built with the same client-side focus.',
  },
  {
    id: 'completed',
    badge: 'Ready to Create',
    title: "You're ready!",
    description: 'Now make your QR your way.',
    icon: CheckCircle2,
    preferredPlacement: 'center',
    tip: 'You can restart this tour anytime by clicking Tour at the bottom of the page.',
  },
];

interface ComputedPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  actualPlacement: 'top' | 'bottom' | 'side-left' | 'side-right' | 'center';
  arrowX?: number;
  arrowY?: number;
}

export interface UserGuideTourProps {
  isOpen: boolean;
  onClose: () => void;
  onTourFinish?: () => void;
  onShowToast?: (msg: string) => void;
  onSelectCustomTab?: (tab: 'colors' | 'patterns' | 'eyes' | 'logo' | 'quality') => void;
  onOpenTemplates?: () => void;
  onCloseTemplates?: () => void;
}

export const UserGuideTour: React.FC<UserGuideTourProps> = ({
  isOpen,
  onClose,
  onTourFinish,
  onShowToast,
  onSelectCustomTab,
  onOpenTemplates,
  onCloseTemplates,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [computedPos, setComputedPos] = useState<ComputedPosition>({
    left: 16,
    width: 320,
    actualPlacement: 'center',
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const step = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;
  const totalFeatureSteps = TOUR_STEPS.length - 2;
  const currentFeatureNumber = Math.max(1, Math.min(currentStepIndex, totalFeatureSteps));

  // Find target element by primary or secondary ID, checking visibility
  const getTargetElement = useCallback((): HTMLElement | null => {
    if (!step.targetId) return null;
    let el = document.getElementById(step.targetId);

    const isElementVisible = (node: HTMLElement | null): boolean => {
      if (!node) return false;
      const style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    // If primary is valid and visible, use it
    if (isElementVisible(el)) {
      return el;
    }

    // Otherwise try secondary target
    if (step.secondaryTargetId) {
      const alt = document.getElementById(step.secondaryTargetId);
      if (isElementVisible(alt)) {
        return alt;
      }
    }

    return el && window.getComputedStyle(el).display !== 'none' ? el : null;
  }, [step]);

  // Non-overlapping placement algorithm with compact dimensions
  const calculateNonOverlappingPosition = useCallback(
    (targetEl: HTMLElement | null, tRect: DOMRect | null, tooltipEl: HTMLDivElement | null): ComputedPosition => {
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

      // Reasonable, compact card dimensions for optimal background visibility
      const tooltipWidth = Math.min(320, windowWidth - 24);
      const measuredHeight = tooltipEl?.offsetHeight || 210;

      if (!tRect || step.preferredPlacement === 'center') {
        const centerWidth = Math.min(340, windowWidth - 24);
        return {
          left: Math.max(12, (windowWidth - centerWidth) / 2),
          width: centerWidth,
          actualPlacement: 'center',
        };
      }

      const gap = 12;
      const headerSafeY = 64; // Sticky header clearance
      const bottomSafeY = 12;
      const sideMargin = 12;

      // Check if target is inside sticky header or fixed bottom dock using DOM hierarchy
      const isHeaderElement = targetEl ? targetEl.closest('header') !== null : false;
      const isFixedBottomElement = targetEl
        ? targetEl.closest('#mobile-floating-nav') !== null || targetEl.id === 'mobile-floating-nav'
        : false;

      // Helper to check rectangle collision
      const boxesOverlap = (boxTop: number, boxHeight: number, boxLeft: number, boxWidth: number) => {
        const buffer = 4;
        const bBottom = boxTop + boxHeight;
        const bRight = boxLeft + boxWidth;
        const tTop = tRect.top - buffer;
        const tBottom = tRect.bottom + buffer;
        const tLeft = tRect.left - buffer;
        const tRight = tRect.right + buffer;

        return !(bRight < tLeft || boxLeft > tRight || bBottom < tTop || boxTop > tBottom);
      };

      // Calculate horizontal alignment (centered on target, clamped within screen)
      let idealLeft = tRect.left + tRect.width / 2 - tooltipWidth / 2;
      idealLeft = Math.max(sideMargin, Math.min(idealLeft, windowWidth - tooltipWidth - sideMargin));

      // Arrow alignment relative to target center
      const targetCenterX = tRect.left + tRect.width / 2;
      const arrowX = Math.max(16, Math.min(tooltipWidth - 16, targetCenterX - idealLeft));

      // 1. Force Placement for Fixed Elements:
      if (isHeaderElement) {
        const top = tRect.bottom + gap;
        return {
          top,
          left: idealLeft,
          width: tooltipWidth,
          actualPlacement: 'bottom',
          arrowX,
        };
      }

      if (isFixedBottomElement) {
        const top = Math.max(headerSafeY + 6, tRect.top - gap - measuredHeight);
        return {
          top,
          left: idealLeft,
          width: tooltipWidth,
          actualPlacement: 'top',
          arrowX,
        };
      }

      // 2. Candidate Placements Evaluation
      const spaceBelow = windowHeight - tRect.bottom - bottomSafeY;
      const spaceAbove = tRect.top - headerSafeY;
      const spaceRight = windowWidth - tRect.right - sideMargin;
      const spaceLeft = tRect.left - sideMargin;

      // Candidate Below
      const belowTop = tRect.bottom + gap;
      const canFitBelow = belowTop + measuredHeight <= windowHeight - bottomSafeY;
      const belowOverlaps = boxesOverlap(belowTop, measuredHeight, idealLeft, tooltipWidth);

      // Candidate Above
      const aboveTop = tRect.top - gap - measuredHeight;
      const canFitAbove = aboveTop >= headerSafeY;
      const aboveOverlaps = boxesOverlap(aboveTop, measuredHeight, idealLeft, tooltipWidth);

      // Candidate Side Right (for desktop/tablet >= 768px)
      const canFitSideRight = windowWidth >= 768 && spaceRight >= tooltipWidth + gap;
      const sideRightLeft = tRect.right + gap;
      const sideRightTop = Math.max(
        headerSafeY + 6,
        Math.min(windowHeight - measuredHeight - bottomSafeY, tRect.top)
      );

      // Candidate Side Left (for desktop/tablet >= 768px)
      const canFitSideLeft = windowWidth >= 768 && spaceLeft >= tooltipWidth + gap;
      const sideLeftLeft = tRect.left - gap - tooltipWidth;
      const sideLeftTop = Math.max(
        headerSafeY + 6,
        Math.min(windowHeight - measuredHeight - bottomSafeY, tRect.top)
      );

      // Preferred placement ordering
      const preferred = step.preferredPlacement || 'bottom';

      if (preferred === 'top') {
        if (canFitAbove && !aboveOverlaps) {
          return { top: aboveTop, left: idealLeft, width: tooltipWidth, actualPlacement: 'top', arrowX };
        }
        if (canFitBelow && !belowOverlaps) {
          return { top: belowTop, left: idealLeft, width: tooltipWidth, actualPlacement: 'bottom', arrowX };
        }
        if (canFitSideRight) {
          return { top: sideRightTop, left: sideRightLeft, width: tooltipWidth, actualPlacement: 'side-right' };
        }
        if (canFitSideLeft) {
          return { top: sideLeftTop, left: sideLeftLeft, width: tooltipWidth, actualPlacement: 'side-left' };
        }
      } else {
        if (canFitBelow && !belowOverlaps) {
          return { top: belowTop, left: idealLeft, width: tooltipWidth, actualPlacement: 'bottom', arrowX };
        }
        if (canFitAbove && !aboveOverlaps) {
          return { top: aboveTop, left: idealLeft, width: tooltipWidth, actualPlacement: 'top', arrowX };
        }
        if (canFitSideRight) {
          return { top: sideRightTop, left: sideRightLeft, width: tooltipWidth, actualPlacement: 'side-right' };
        }
        if (canFitSideLeft) {
          return { top: sideLeftTop, left: sideLeftLeft, width: tooltipWidth, actualPlacement: 'side-left' };
        }
      }

      // Safe Fallback: Pick whichever side has more room
      if (spaceBelow >= spaceAbove) {
        return {
          top: Math.min(windowHeight - measuredHeight - bottomSafeY, tRect.bottom + gap),
          left: idealLeft,
          width: tooltipWidth,
          actualPlacement: 'bottom',
          arrowX,
        };
      } else {
        return {
          top: Math.max(headerSafeY + 4, tRect.top - gap - measuredHeight),
          left: idealLeft,
          width: tooltipWidth,
          actualPlacement: 'top',
          arrowX,
        };
      }
    },
    [step]
  );

  // Update target rect and position
  const updateLayout = useCallback(() => {
    if (!isOpen) return;

    if (step.preferredPlacement === 'center' || !step.targetId) {
      setTargetRect(null);
      setComputedPos(calculateNonOverlappingPosition(null, null, tooltipRef.current));
      return;
    }

    const el = getTargetElement();
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      const pos = calculateNonOverlappingPosition(el, rect, tooltipRef.current);
      setComputedPos(pos);
    } else {
      setTargetRect(null);
      setComputedPos(calculateNonOverlappingPosition(null, null, tooltipRef.current));
    }
  }, [isOpen, step, getTargetElement, calculateNonOverlappingPosition]);

  // Auto-move and auto-scroll to the highlighted category/section in BOTH directions (up & down)
  useEffect(() => {
    if (!isOpen) return;

    // Auto-select relevant tab in customization panel for step 8 & 9
    if (step.id === 'customization-suite') {
      onSelectCustomTab?.('colors');
    } else if (step.id === 'center-logo') {
      onSelectCustomTab?.('logo');
    }

    if (step.preferredPlacement === 'center' || !step.targetId) {
      setTargetRect(null);
      setComputedPos(calculateNonOverlappingPosition(null, null, tooltipRef.current));
      // If intro step opened when scrolled deep down, smoothly return to top
      if (currentStepIndex === 0 && window.scrollY > 150) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const handleScrollAndPosition = () => {
      const el = getTargetElement();
      if (!el) {
        updateLayout();
        return;
      }

      // Check if element is inside sticky header or mobile fixed dock
      const isInsideHeader = el.closest('header') !== null;
      const isInsideMobileNav = el.closest('#mobile-floating-nav') !== null || el.id === 'mobile-floating-nav';

      if (isInsideHeader) {
        // Sticky header elements: if user has scrolled down, smooth scroll back up to top
        if (window.scrollY > 80) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        updateLayout();
        return;
      }

      if (isInsideMobileNav) {
        // Mobile fixed bottom dock is already pinned to screen
        updateLayout();
        return;
      }

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const isMobile = windowWidth < 1024;
      const topSafe = 70; // Header height clearance
      const bottomSafe = isMobile ? 80 : 24; // Mobile dock clearance / padding
      const safeViewportHeight = windowHeight - topSafe - bottomSafe;
      const idealViewportCenterY = topSafe + safeViewportHeight / 2;

      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY;
      const elementDocTop = currentScrollY + rect.top;
      const elementHeight = rect.height;
      const elementDocCenter = elementDocTop + elementHeight / 2;

      // Check if element is already comfortably centered in the safe viewport
      const currentElementCenterY = rect.top + rect.height / 2;
      const isAlreadyCentered = Math.abs(currentElementCenterY - idealViewportCenterY) < 70;
      const isFullyInSafeBounds = rect.top >= topSafe + 16 && rect.bottom <= windowHeight - bottomSafe - 16;

      if (isAlreadyCentered && isFullyInSafeBounds) {
        // Element is already clearly visible and centered, no scroll needed
        updateLayout();
        return;
      }

      // Determine ideal vertical position in safe viewport based on tooltip placement preference
      let targetViewportY = idealViewportCenterY;
      if (step.preferredPlacement === 'top') {
        targetViewportY = topSafe + safeViewportHeight * 0.58;
      } else if (step.preferredPlacement === 'bottom') {
        targetViewportY = topSafe + safeViewportHeight * 0.42;
      }

      let targetScrollY = elementDocCenter - targetViewportY;
      const maxScrollY = Math.max(0, document.documentElement.scrollHeight - windowHeight);
      targetScrollY = Math.max(0, Math.min(targetScrollY, maxScrollY));

      // Scroll smoothly in BOTH directions (down if target is below, up if target is above)
      if (Math.abs(targetScrollY - currentScrollY) > 5) {
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
      }

      // Continuously track layout across smooth scroll transition (~600ms)
      const startTime = performance.now();
      const trackDuringScroll = (time: number) => {
        updateLayout();
        if (time - startTime < 600) {
          animationFrameRef.current = requestAnimationFrame(trackDuringScroll);
        }
      };
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(trackDuringScroll);
    };

    // Execute immediately
    handleScrollAndPosition();

    // Also run after short frame delay to account for tab changes or dynamic DOM updates
    const timerFrame = setTimeout(() => {
      handleScrollAndPosition();
    }, 40);

    const timer1 = setTimeout(() => {
      updateLayout();
    }, 180);

    const timer2 = setTimeout(() => {
      updateLayout();
    }, 500);

    return () => {
      clearTimeout(timerFrame);
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, currentStepIndex, step, getTargetElement, calculateNonOverlappingPosition, updateLayout, onSelectCustomTab]);

  // Window resize & scroll listeners to stay pinned perfectly
  useEffect(() => {
    if (!isOpen) return;

    const handleResizeOrScroll = () => {
      updateLayout();
    };

    window.addEventListener('resize', handleResizeOrScroll, { passive: true });
    window.addEventListener('scroll', handleResizeOrScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
    };
  }, [isOpen, updateLayout]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSkipWarning) {
        if (e.key === 'Escape') {
          setShowSkipWarning(false);
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleInitiateSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, showSkipWarning]);

  // Finish tour and save to localStorage
  const handleCompleteTour = () => {
    try {
      localStorage.setItem(STORAGE_TOUR_KEY, 'true');
    } catch {
      // ignore
    }
    onCloseTemplates?.();
    onClose();
    onShowToast?.('Tour completed! Enjoy customizing your QR codes ✓');
    onTourFinish?.();
  };

  // Skip warning trigger
  const handleInitiateSkip = () => {
    setShowSkipWarning(true);
  };

  // Confirm skip
  const handleConfirmSkip = () => {
    try {
      localStorage.setItem(STORAGE_TOUR_KEY, 'true');
    } catch {
      // ignore
    }
    setShowSkipWarning(false);
    onCloseTemplates?.();
    onClose();
    onShowToast?.('Tour skipped. You can reopen it anytime from the footer!');
    onTourFinish?.();
  };

  // Navigation handlers
  const handleNext = () => {
    if (step.id === 'templates-backup') {
      onCloseTemplates?.();
    }
    if (isLastStep) {
      handleCompleteTour();
    } else {
      setCurrentStepIndex((prev) => Math.min(prev + 1, TOUR_STEPS.length - 1));
    }
  };

  const handlePrev = () => {
    if (step.id === 'templates-backup') {
      onCloseTemplates?.();
    }
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  if (!isOpen) return null;

  const IconComponent = step.icon;

  // Tooltip position style with smooth gliding transition
  const tooltipStyle: React.CSSProperties =
    computedPos.actualPlacement === 'center'
      ? {
          position: 'fixed',
          top: '50%',
          left: `${computedPos.left}px`,
          transform: 'translateY(-50%)',
          width: `${computedPos.width}px`,
          maxHeight: '85vh',
          transition: 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        }
      : {
          position: 'fixed',
          top: computedPos.top !== undefined ? `${computedPos.top}px` : undefined,
          bottom: computedPos.bottom !== undefined ? `${computedPos.bottom}px` : undefined,
          left: `${computedPos.left}px`,
          width: `${computedPos.width}px`,
          maxHeight: 'calc(100vh - 28px)',
          transition: 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        };

  return (
    <div className="fixed inset-0 z-50 select-none animate-in fade-in duration-150">
      {/* SVG Spotlight Mask Cutout Overlay */}
      {targetRect && computedPos.actualPlacement !== 'center' ? (
        <svg
          className="fixed inset-0 w-full h-full pointer-events-auto"
          aria-hidden="true"
          onClick={handleInitiateSkip}
        >
          <defs>
            <mask id="tour-spotlight-mask">
              {/* Dim backdrop */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {/* Clear spotlight cutout on the target element with smooth padding */}
              <rect
                x={Math.max(2, targetRect.left - 5)}
                y={Math.max(2, targetRect.top - 5)}
                width={targetRect.width + 10}
                height={targetRect.height + 10}
                rx="14"
                fill="black"
              />
            </mask>
          </defs>

          {/* Dimmed background using the spotlight mask */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.65)"
            mask="url(#tour-spotlight-mask)"
            className="transition-all duration-200"
          />

          {/* Glowing pulse ring around highlighted element */}
          <rect
            x={Math.max(2, targetRect.left - 5)}
            y={Math.max(2, targetRect.top - 5)}
            width={targetRect.width + 10}
            height={targetRect.height + 10}
            rx="14"
            fill="none"
            stroke="#E7AC08"
            strokeWidth="2.5"
            strokeDasharray="5 3"
            className="animate-pulse"
          />
        </svg>
      ) : (
        /* Dimmed backdrop for center screens (Welcome & Completed) */
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          onClick={handleInitiateSkip}
          aria-hidden="true"
        />
      )}

      {/* Interactive Tour Tooltip Card (Reasonable & Compact Size) */}
      <div
        ref={tooltipRef}
        id="user-guide-tour-card"
        style={tooltipStyle}
        className="z-50 bg-[#FAF8F5] dark:bg-zinc-900 border border-[#EDE8DF] dark:border-zinc-700/80 rounded-2xl shadow-2xl shadow-black/35 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={step.title}
      >
        {/* Directional Pointer Arrow */}
        {computedPos.actualPlacement === 'bottom' && computedPos.arrowX !== undefined && (
          <div
            className="absolute -top-1.5 w-3 h-3 bg-[#F4EFE6] dark:bg-zinc-800 border-t border-l border-[#EDE8DF] dark:border-zinc-700 rotate-45 pointer-events-none"
            style={{ left: `${computedPos.arrowX}px`, transform: 'translateX(-50%) rotate(45deg)' }}
          />
        )}
        {computedPos.actualPlacement === 'top' && computedPos.arrowX !== undefined && (
          <div
            className="absolute -bottom-1.5 w-3 h-3 bg-[#F8F6F0] dark:bg-zinc-800/80 border-b border-r border-[#EDE8DF] dark:border-zinc-700 rotate-45 pointer-events-none"
            style={{ left: `${computedPos.arrowX}px`, transform: 'translateX(-50%) rotate(45deg)' }}
          />
        )}

        {/* Compact Header Accent Banner */}
        <div className="px-3.5 py-2 border-b border-[#EDE8DF] dark:border-zinc-800 bg-[#F4EFE6]/70 dark:bg-zinc-800/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E7AC08] shrink-0 animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400E] dark:text-amber-300 truncate">
              {step.badge}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!isFirstStep && !isLastStep && (
              <span className="text-[10px] font-mono font-bold text-[#64748B] dark:text-zinc-400 bg-white/80 dark:bg-zinc-800/90 px-1.5 py-0.5 rounded-full border border-[#EDE8DF] dark:border-zinc-700">
                {currentFeatureNumber}/{totalFeatureSteps}
              </span>
            )}
            <button
              type="button"
              id="btn-tour-close-corner"
              onClick={handleInitiateSkip}
              className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-[#EDE8DF]/80 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Skip Quick Tour"
              aria-label="Skip tour"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Compact Content Body */}
        <div className="p-3.5 space-y-2.5 max-h-[55vh] overflow-y-auto">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E7AC08]/15 dark:bg-[#E7AC08]/25 text-[#92400E] dark:text-amber-300 flex items-center justify-center shrink-0 border border-[#E7AC08]/30">
              <IconComponent className="w-4 h-4 text-[#E7AC08]" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-zinc-100 leading-tight tracking-tight">
                {step.title}
              </h3>
              <p className="text-xs text-[#475569] dark:text-zinc-300 mt-1 leading-relaxed line-clamp-3">
                {step.description}
              </p>
            </div>
          </div>

          {/* Compact Pro Tip Box */}
          {step.tip && (
            <div className="p-2 rounded-lg bg-[#FFFBEA] dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/40 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E7AC08] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#78350F] dark:text-amber-200 leading-tight font-medium">
                {step.tip}
              </p>
            </div>
          )}

          {/* Step 11 Specific Action: Open Templates & Backup System Window */}
          {step.id === 'templates-backup' && onOpenTemplates && (
            <div className="pt-0.5">
              <button
                type="button"
                id="btn-tour-open-templates-modal"
                onClick={() => {
                  onOpenTemplates();
                  onShowToast?.('Templates & Backup window opened ✓');
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 border border-amber-500/35 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-98"
              >
                <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Open Templates & Backup Window</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              </button>
            </div>
          )}

          {/* Compact Step Progress Dots */}
          {!isFirstStep && !isLastStep && (
            <div className="flex items-center justify-center gap-1 pt-0.5">
              {TOUR_STEPS.slice(1, -1).map((s, idx) => {
                const stepNum = idx + 1;
                const isCurrent = stepNum === currentStepIndex;
                const isPast = stepNum < currentStepIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentStepIndex(stepNum)}
                    className={`h-1 rounded-full transition-all duration-200 ${
                      isCurrent
                        ? 'w-5 bg-[#E7AC08]'
                        : isPast
                        ? 'w-1.5 bg-[#E7AC08]/50'
                        : 'w-1 bg-[#EDE8DF] dark:bg-zinc-700'
                    }`}
                    title={`Go to step ${stepNum}: ${s.title}`}
                    aria-label={`Step ${stepNum}`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Compact Footer Actions */}
        <div className="px-3.5 py-2.5 bg-[#F8F6F0] dark:bg-zinc-800/50 border-t border-[#EDE8DF] dark:border-zinc-800 flex items-center justify-between gap-2">
          {/* Left Action: Skip or Back */}
          <div>
            {isFirstStep ? (
              <button
                type="button"
                id="btn-tour-skip-intro"
                onClick={handleInitiateSkip}
                className="px-2.5 py-1 text-xs font-semibold text-[#64748B] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Skip
              </button>
            ) : isLastStep ? (
              <button
                type="button"
                onClick={() => setCurrentStepIndex(1)}
                className="px-2.5 py-1 text-xs font-semibold text-[#64748B] dark:text-zinc-400 hover:text-[#0F172A] dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Restart
              </button>
            ) : (
              <button
                type="button"
                id="btn-tour-back"
                onClick={handlePrev}
                className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-xs font-bold text-[#0F172A] dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-[#EDE8DF] dark:border-zinc-700 hover:bg-[#F4EFE6] dark:hover:bg-zinc-750 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Right Action: Next / Finish / Start */}
          <div className="flex items-center gap-1.5">
            {!isFirstStep && !isLastStep && (
              <button
                type="button"
                id="btn-tour-skip-secondary"
                onClick={handleInitiateSkip}
                className="px-2 py-1 text-xs font-medium text-[#64748B] dark:text-zinc-400 hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                Skip
              </button>
            )}

            {isFirstStep ? (
              <button
                type="button"
                id="btn-tour-start"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] text-xs font-bold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/50"
              >
                <span>Start Tour</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : isLastStep ? (
              <button
                type="button"
                id="btn-tour-finish"
                onClick={handleCompleteTour}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] text-xs font-bold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/50"
              >
                <span>Start Creating →</span>
              </button>
            ) : (
              <button
                type="button"
                id="btn-tour-next"
                onClick={handleNext}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] text-xs font-bold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/50"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Skip Confirmation Modal Dialog */}
      {showSkipWarning && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="skip-tour-warning-title"
        >
          <div className="w-full max-w-sm bg-[#FAF8F5] dark:bg-zinc-900 border border-amber-300/80 dark:border-amber-700/60 rounded-2xl shadow-2xl p-4 sm:p-5 space-y-3.5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-300/60">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4
                  id="skip-tour-warning-title"
                  className="text-sm font-bold text-[#0F172A] dark:text-zinc-100"
                >
                  Skip Quick Tour?
                </h4>
                <p className="text-xs text-[#475569] dark:text-zinc-300 mt-0.5 leading-relaxed">
                  ⚠️ If you skip this, you might miss some features of this app.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                id="btn-tour-skip-anyway"
                onClick={handleConfirmSkip}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#0F172A] dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-[#EDE8DF]/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Skip Anyway
              </button>
              <button
                type="button"
                id="btn-tour-continue"
                onClick={() => setShowSkipWarning(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] text-xs font-bold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E7AC08]/50"
              >
                Continue Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  QrType,
  QrFormData,
  MultiUrlData,
  QrStyleOptions,
  AppTheme,
  SavedQrDesign,
  CustomizationTabKey,
  RandomizeTarget,
  RandomizeType,
} from './types';
import { DEFAULT_FORM_DATA, buildPayload, validatePayload } from './utils/qrPayloads';
import { analyzeReadability } from './utils/contrast';
import { renderQrToCanvas, getAutoLogoForCategory } from './utils/qrRenderer';
import { generateTemplateThumbnail } from './utils/templateCode';
import { Header } from './components/Header';
import { TypeSelector } from './components/TypeSelector';
import { ContentForm } from './components/ContentForm';
import { CustomizationPanel } from './components/CustomizationPanel';
import { LivePreviewCard } from './components/LivePreviewCard';
import { ReadabilityDashboard } from './components/ReadabilityDashboard';
import { TestQrModal } from './components/TestQrModal';
import { RecentDesignsModal } from './components/RecentDesignsModal';
import { ChangelogModal } from './components/ChangelogModal';
import { MobileFloatingNav } from './components/MobileFloatingNav';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { OpenSourceShowcase } from './components/OpenSourceShowcase';
import { useSettings } from './context/SettingsContext';
import { CardVisibilityBanner } from './components/CardVisibilityBanner';
import { CardVisibilityWrapper } from './components/CardVisibilityWrapper';
import {
  Sparkles,
  ShieldCheck,
  ExternalLink,
  QrCode,
  FileText,
  Layers,
  Activity,
  Palette,
  EyeOff,
} from 'lucide-react';

const STORAGE_THEME_KEY = 'ehsaan_qr_theme';
const STORAGE_SAVED_KEY = 'ehsaan_qr_saved_designs';
const STORAGE_AUTO_ADAPT_LOGO_KEY = 'ehsaan_qr_auto_adapt_logo';

const INITIAL_STYLE: QrStyleOptions = {
  colorMode: 'solid',
  fgColor: '#000000', // Default custom FG black
  fgColorEnd: '#1F2937',
  gradientAngle: 135,
  bgColor: '#fbf3c7', // Warm amber cream default background
  transparentBg: false,
  bgSaturationPreference: 'low',
  patternStyle: 'liquid', // Fluid liquid pixel matrix
  cornerStyle: 'smooth',
  eyeStyle: 'cut-corner', // 45° chamfered outer eye shape
  pupilStyle: 'hexagon', // Hexagon inner pupil
  customEyeColors: true,
  eyeOuterColor: '#881337', // Deep crimson wine outer eye ring
  eyeInnerColor: '#881337', // Deep crimson wine inner pupil
  logo: {
    type: 'none',
    autoAdapt: false,
    sizeRatio: 0.2,
    padding: 4,
    background: 'transparent',
    customBgColor: '#FFFFFF',
    borderRadius: 50,
  },
  size: 1024,
  margin: 2,
  errorCorrection: 'Q',
};

export default function App() {
  const { settings, toggleCardVisibility, setAllCardsVisibility } = useSettings();
  const [isHideCardsMode, setIsHideCardsMode] = useState(false);

  // Count visible and hidden cards
  const totalCards = 6;
  const visibleCardsCount = useMemo(() => {
    const vc = settings.visibleCards;
    return (
      (vc.preview !== false ? 1 : 0) +
      (vc.contentForm !== false ? 1 : 0) +
      (vc.typeSelector !== false ? 1 : 0) +
      (vc.readability !== false ? 1 : 0) +
      (vc.customization !== false ? 1 : 0) +
      (vc.opensource !== false ? 1 : 0)
    );
  }, [settings.visibleCards]);

  const hiddenCardsCount = totalCards - visibleCardsCount;

  const handleDoneHidingCards = useCallback(() => {
    setIsHideCardsMode(false);
    setToastMessage('Workspace layout saved ✓');
  }, []);

  const handleUnhideAllCards = useCallback(() => {
    setAllCardsVisibility(true);
    setToastMessage('All cards restored to workspace ✓');
  }, [setAllCardsVisibility]);

  // Theme state: saved theme or minimal default
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'material' || saved === 'minimal') {
      return saved;
    }
    return 'minimal';
  });

  // Active QR type (persisted across page refreshes)
  const [selectedType, setSelectedType] = useState<QrType>(() => {
    try {
      const saved = localStorage.getItem('ehsaan_qr_selected_type');
      if (
        saved &&
        ['url', 'text', 'email', 'phone', 'sms', 'wifi', 'whatsapp', 'vcard', 'upi', 'calendar', 'location', 'multi-url'].includes(saved)
      ) {
        return saved as QrType;
      }
    } catch {
      // fallback to url
    }
    return 'url';
  });

  // Form Data
  const [formData, setFormData] = useState<QrFormData>(DEFAULT_FORM_DATA);

  // Styling Options (with persisted autoAdapt preference across refresh)
  const [styleOptions, setStyleOptions] = useState<QrStyleOptions>(() => {
    let autoAdapt = false;
    try {
      const saved = localStorage.getItem(STORAGE_AUTO_ADAPT_LOGO_KEY);
      if (saved !== null) {
        autoAdapt = saved === 'true';
      }
    } catch {
      // fallback to false
    }

    let initialType: QrType = 'url';
    try {
      const savedType = localStorage.getItem('ehsaan_qr_selected_type');
      if (
        savedType &&
        ['url', 'text', 'email', 'phone', 'sms', 'wifi', 'whatsapp', 'vcard', 'upi', 'calendar', 'location', 'multi-url'].includes(savedType)
      ) {
        initialType = savedType as QrType;
      }
    } catch {
      // fallback
    }

    const initialLogo = autoAdapt ? getAutoLogoForCategory(initialType) : 'none';

    return {
      ...INITIAL_STYLE,
      logo: {
        ...INITIAL_STYLE.logo,
        autoAdapt,
        type: initialLogo,
      },
    };
  });

  // Sync auto logo adaptation preference to localStorage
  useEffect(() => {
    try {
      if (typeof styleOptions.logo?.autoAdapt === 'boolean') {
        localStorage.setItem(STORAGE_AUTO_ADAPT_LOGO_KEY, String(styleOptions.logo.autoAdapt));
      }
    } catch {
      // ignore
    }
  }, [styleOptions.logo?.autoAdapt]);

  // Sync selected QR category type to localStorage
  useEffect(() => {
    try {
      if (selectedType) {
        localStorage.setItem('ehsaan_qr_selected_type', selectedType);
      }
    } catch {
      // ignore
    }
  }, [selectedType]);

  // Active Customization Tab (synchronized across desktop in-panel tabs and mobile/tablet floating nav)
  const [activeCustomTab, setActiveCustomTab] = useState<CustomizationTabKey>('colors');

  // Smart Randomize Controller Persistent State
  const [selectedRandomizeTarget, setSelectedRandomizeTarget] = useState<RandomizeTarget>(() => {
    try {
      const saved = localStorage.getItem('ehsaan_qr_rand_target');
      return (saved as RandomizeTarget) || 'all';
    } catch {
      return 'all';
    }
  });

  const [selectedRandomizeType, setSelectedRandomizeType] = useState<RandomizeType>(() => {
    try {
      const saved = localStorage.getItem('ehsaan_qr_rand_type');
      return (saved as RandomizeType) || 'both';
    } catch {
      return 'both';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ehsaan_qr_rand_target', selectedRandomizeTarget);
    } catch {
      // ignore
    }
  }, [selectedRandomizeTarget]);

  useEffect(() => {
    try {
      localStorage.setItem('ehsaan_qr_rand_type', selectedRandomizeType);
    } catch {
      // ignore
    }
  }, [selectedRandomizeType]);

  // Locked elements for Smart Randomize
  const [lockedRandomizeTargets, setLockedRandomizeTargets] = useState<RandomizeTarget[]>(() => {
    try {
      const saved = localStorage.getItem('ehsaan_qr_rand_locks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ehsaan_qr_rand_locks', JSON.stringify(lockedRandomizeTargets));
    } catch {
      // ignore
    }
  }, [lockedRandomizeTargets]);

  // Saved designs in local storage
  const [savedDesigns, setSavedDesigns] = useState<SavedQrDesign[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modals & Toasts
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme changes to DOM root
  useEffect(() => {
    localStorage.setItem(STORAGE_THEME_KEY, theme);
    const root = document.documentElement;
    root.classList.remove('dark', 'material', 'minimal', 'colorful', 'colourful');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'material') {
      root.classList.add('material');
    } else if (theme === 'minimal') {
      root.classList.add('minimal');
    }
  }, [theme]);

  // Sync saved designs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedDesigns));
    } catch (e) {
      console.warn('Failed to save designs to localStorage:', e);
    }
  }, [savedDesigns]);

  // Self-healing thumbnail generator for any saved templates missing preview
  useEffect(() => {
    const missing = savedDesigns.filter((d) => !d.previewThumbnail);
    if (missing.length === 0) return;

    let isMounted = true;
    missing.forEach((item) => {
      generateTemplateThumbnail(item.style).then((thumb) => {
        if (isMounted && thumb) {
          setSavedDesigns((latest) =>
            latest.map((d) => (d.id === item.id ? { ...d, previewThumbnail: thumb } : d))
          );
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle form data change
  const handleFormChange = <K extends keyof QrFormData>(
    key: K,
    val: QrFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Handle QR category selection with smart logo auto-adaptation
  const handleSelectType = (newType: QrType) => {
    setSelectedType(newType);
    if (styleOptions.logo.autoAdapt === true) {
      const autoLogo = getAutoLogoForCategory(newType);
      setStyleOptions((prev) => ({
        ...prev,
        logo: {
          ...prev.logo,
          type: autoLogo,
        },
        errorCorrection:
          autoLogo !== 'none' && (prev.errorCorrection === 'L' || prev.errorCorrection === 'M')
            ? 'Q'
            : prev.errorCorrection,
      }));
    }
  };

  // Build current payload
  const currentPayload = useMemo(() => {
    return buildPayload(selectedType, formData);
  }, [selectedType, formData]);

  // Validate current payload
  const validation = useMemo(() => {
    return validatePayload(selectedType, formData);
  }, [selectedType, formData]);

  // Analyze readability
  const readability = useMemo(() => {
    return analyzeReadability(styleOptions, currentPayload);
  }, [styleOptions, currentPayload]);

  // Save current design template locally (styling only, no user data)
  // Save Multi-URL configuration as a Template
  const handleSaveMultiUrlTemplate = (data: MultiUrlData) => {
    const heading = (data.heroHeading || data.title || 'Multi-URL Link Hub').trim();
    const linkCount = (data.links || []).filter((l) => l.url && l.url.trim()).length;

    const newDesign: SavedQrDesign = {
      id: 'template-multiurl-' + Date.now(),
      name: `${heading} (${linkCount} Link${linkCount === 1 ? '' : 's'})`,
      timestamp: Date.now(),
      qrType: 'multi-url',
      formData: {
        'multi-url': data,
      },
      style: { ...styleOptions },
    };

    setSavedDesigns((prev) => [newDesign, ...prev.slice(0, 24)]);
    setToastMessage(`Saved Multi-URL HTML template "${heading}" to Templates ✓ (Code & Backup ready)`);
  };

  const handleSaveDesign = async () => {
    let thumbnail: string | undefined;
    const samplePayload = 'https://ehsaan.io';
    try {
      const offscreen = document.createElement('canvas');
      await renderQrToCanvas(offscreen, samplePayload, {
        ...styleOptions,
        size: 120,
      });
      thumbnail = offscreen.toDataURL('image/png');
    } catch (e) {
      console.warn('Could not generate template thumbnail', e);
    }

    const patternLabels: Record<string, string> = {
      square: 'Square',
      rounded: 'Rounded',
      circle: 'Circle',
      dots: 'Circle',
      diamond: 'Diamond',
      hexagon: 'Hexagon',
      octagon: 'Octagon',
      squircle: 'Squircle',
      pill: 'Pill',
      leaf: 'Leaf',
      flower: 'Flower',
      liquid: 'Liquid Flow',
    };

    const patternName = patternLabels[styleOptions.patternStyle] || 'Custom';
    const colorModeName =
      styleOptions.colorMode === 'solid'
        ? 'Solid'
        : styleOptions.colorMode === 'linear-gradient'
        ? 'Linear Gradient'
        : 'Radial Gradient';

    const newDesign: SavedQrDesign = {
      id: 'template-' + Date.now(),
      name: `${patternName} (${colorModeName}) - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: Date.now(),
      style: { ...styleOptions },
      previewThumbnail: thumbnail,
    };

    setSavedDesigns((prev) => [newDesign, ...prev.slice(0, 24)]);
    setToastMessage('Design template saved ✓ (Click "Code" under Templates to transfer)');
  };

  // Import templates from code (single or bundle)
  const handleImportDesigns = (imported: SavedQrDesign[], applyFirst = false) => {
    setSavedDesigns((prev) => {
      const existingIds = new Set(prev.map((d) => d.id));
      const fresh = imported.filter((item) => !existingIds.has(item.id));
      return [...fresh, ...prev];
    });

    // Asynchronously generate and persist thumbnails for any imported designs missing one
    imported.forEach((item) => {
      if (!item.previewThumbnail) {
        generateTemplateThumbnail(item.style).then((thumb) => {
          if (thumb) {
            setSavedDesigns((latest) =>
              latest.map((d) => (d.id === item.id ? { ...d, previewThumbnail: thumb } : d))
            );
          }
        });
      }
    });

    if (applyFirst && imported.length > 0) {
      handleLoadDesign(imported[0]);
    } else {
      setToastMessage(
        imported.length === 1
          ? `Template "${imported[0].name}" saved to Templates ✓`
          : `${imported.length} templates imported to Templates ✓`
      );
    }
  };

  // Apply a saved design template
  const handleLoadDesign = (design: SavedQrDesign) => {
    setStyleOptions((prev) => ({
      ...design.style,
      logo: {
        ...design.style.logo,
        autoAdapt:
          typeof design.style.logo?.autoAdapt === 'boolean'
            ? design.style.logo.autoAdapt
            : prev.logo.autoAdapt,
      },
    }));

    const isMultiUrl = design.qrType === 'multi-url' || Boolean(design.formData?.['multi-url']);
    if (isMultiUrl) {
      setSelectedType('multi-url');
      if (design.formData?.['multi-url']) {
        setFormData((prev) => ({
          ...prev,
          'multi-url': design.formData!['multi-url'],
        }));
      }
    } else if (design.qrType) {
      setSelectedType(design.qrType as QrType);
      if (design.formData) {
        setFormData((prev) => ({
          ...prev,
          ...design.formData,
        }));
      }
    }

    setToastMessage(`Applied "${design.name}" template ✓`);
  };

  // Duplicate design template
  const handleDuplicateDesign = (design: SavedQrDesign) => {
    const copy: SavedQrDesign = {
      ...design,
      id: 'template-' + Date.now(),
      name: `${design.name} (Copy)`,
      timestamp: Date.now(),
    };
    setSavedDesigns((prev) => [copy, ...prev]);
    setToastMessage('Template duplicated ✓');
  };

  // Delete design template
  const handleDeleteDesign = (id: string) => {
    setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
    setToastMessage('Template deleted');
  };

  // Clear all saved
  const handleClearAllSaved = () => {
    if (confirm('Clear all saved QR designs?')) {
      setSavedDesigns([]);
      setToastMessage('Saved designs cleared');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col selection:bg-red-500 selection:text-white transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-zinc-950 text-zinc-100'
          : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      {/* Refined Header */}
      <Header
        theme={theme}
        onThemeChange={setTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenChangelog={() => setIsChangelogOpen(true)}
        onStartHideCardsMode={() => setIsHideCardsMode(true)}
        hiddenCardsCount={hiddenCardsCount}
        savedCount={savedDesigns.length}
      />

      {/* Sticky Card Visibility Toolbar when Hide Cards Mode is Active */}
      {isHideCardsMode && (
        <CardVisibilityBanner
          totalCards={totalCards}
          visibleCount={visibleCardsCount}
          onDone={handleDoneHidingCards}
          onUnhideAll={handleUnhideAllCards}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-10 sm:pb-14 lg:pb-12">
        {/* Sub-header Landing & Quick Actions */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Create your QR code
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Choose a type, customize the design, and download it instantly.
            </p>
          </div>

          {/* Minimal ehsaan.odoo.com Official Portal Link */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              id="header-ehsaan-odoo-link"
              href="https://ehsaan.odoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 hover:border-red-500/50 dark:hover:border-red-500/50 text-xs text-zinc-600 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 shadow-2xs backdrop-blur-xs transition-all group focus:outline-none focus:ring-2 focus:ring-red-500/30"
              title="Visit official portal: ehsaan.odoo.com"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Powered by</span>
              <span className="text-zinc-400 dark:text-zinc-600 font-normal">•</span>
              <span className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400">
                ehsaan.odoo.com
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-500 transition-colors ml-0.5" />
            </a>
          </div>
        </div>

        {/* Empty state when all cards are hidden in normal mode */}
        {visibleCardsCount === 0 && !isHideCardsMode && (
          <div className="my-12 p-8 sm:p-12 text-center rounded-3xl border-2 border-dashed border-amber-300 dark:border-zinc-800 bg-amber-50/50 dark:bg-zinc-900/40 max-w-lg mx-auto animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF08A] dark:bg-amber-950/80 border border-[#FACC15] text-black dark:text-amber-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <EyeOff className="w-7 h-7 stroke-[2]" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-50">
              All workspace cards are hidden
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-sm mx-auto">
              You have hidden all 6 cards. Enter visibility mode anytime to choose which cards to display.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsHideCardsMode(true)}
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#FACC15] hover:bg-[#EAB308] text-black shadow-xs cursor-pointer transition-transform active:scale-95"
              >
                Customize Visible Cards
              </button>
              <button
                type="button"
                onClick={handleUnhideAllCards}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs cursor-pointer transition-transform active:scale-95"
              >
                Unhide All Cards
              </button>
            </div>
          </div>
        )}

        {/* 1. Main QR Code Preview & Instant Export */}
        {(isHideCardsMode || settings.visibleCards.preview) && (
          <section aria-label="Main QR Code Preview" className="w-full space-y-4">
            <CardVisibilityWrapper
              cardId="preview"
              cardTitle="QR Preview & Download"
              cardDescription="Interactive QR code preview, scanner validation, and format export suite"
              icon={QrCode}
              isHideCardsMode={isHideCardsMode}
              isVisible={settings.visibleCards.preview}
              onToggleVisibility={toggleCardVisibility}
            >
              <LivePreviewCard
                selectedType={selectedType}
                payload={currentPayload}
                options={styleOptions}
                readability={readability}
                onShowToast={setToastMessage}
                onOpenScanner={() => setIsScannerOpen(true)}
                onOpenChangelog={() => setIsChangelogOpen(true)}
                onSaveDesign={handleSaveDesign}
                onOptionsChange={(newOpts) =>
                  setStyleOptions((prev) => ({
                    ...prev,
                    ...newOpts,
                  }))
                }
                selectedRandomizeTarget={selectedRandomizeTarget}
                selectedRandomizeType={selectedRandomizeType}
                onRandomizeTargetChange={setSelectedRandomizeTarget}
                onRandomizeTypeChange={setSelectedRandomizeType}
                lockedTargets={lockedRandomizeTargets}
                onLockedTargetsChange={setLockedRandomizeTargets}
                theme={theme}
              />
            </CardVisibilityWrapper>
          </section>
        )}

        {/* 2. Both Category and Data Input Cards (Desktop: side-by-side with Input on the left of Category, Mobile: stacked) */}
        {(isHideCardsMode ||
          settings.visibleCards.contentForm ||
          settings.visibleCards.opensource ||
          settings.visibleCards.typeSelector) && (
          <section aria-label="QR Category and Data Configuration" className="w-full pt-4 sm:pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Content Input Card & GitHub Showcase */}
              {(isHideCardsMode ||
                settings.visibleCards.contentForm ||
                settings.visibleCards.opensource) && (
                <div
                  className={`${
                    !isHideCardsMode && !settings.visibleCards.typeSelector
                      ? 'lg:col-span-12'
                      : 'lg:col-span-6'
                  } space-y-6 order-2 lg:order-1`}
                >
                  <CardVisibilityWrapper
                    cardId="contentForm"
                    cardTitle="Content & Data Input"
                    cardDescription="Input data fields for URL, Wi-Fi, UPI Pay, Contact, Email, etc."
                    icon={FileText}
                    isHideCardsMode={isHideCardsMode}
                    isVisible={settings.visibleCards.contentForm}
                    onToggleVisibility={toggleCardVisibility}
                  >
                    <ContentForm
                      type={selectedType}
                      formData={formData}
                      onChange={handleFormChange}
                      validation={validation}
                      onSaveMultiUrlTemplate={handleSaveMultiUrlTemplate}
                      onOpenTemplates={() => setIsHistoryOpen(true)}
                    />
                  </CardVisibilityWrapper>

                  <CardVisibilityWrapper
                    cardId="opensource"
                    cardTitle="Open Source Community"
                    cardDescription="Community GitHub project, star badge, and open source showcase"
                    icon={Sparkles}
                    isHideCardsMode={isHideCardsMode}
                    isVisible={settings.visibleCards.opensource}
                    onToggleVisibility={toggleCardVisibility}
                  >
                    <OpenSourceShowcase
                      onShowToast={setToastMessage}
                      onOpenChangelog={() => setIsChangelogOpen(true)}
                    />
                  </CardVisibilityWrapper>
                </div>
              )}

              {/* Right Column: Category Selection Card */}
              {(isHideCardsMode || settings.visibleCards.typeSelector) && (
                <div
                  className={`${
                    !isHideCardsMode &&
                    !settings.visibleCards.contentForm &&
                    !settings.visibleCards.opensource
                      ? 'lg:col-span-12'
                      : 'lg:col-span-6'
                  } space-y-6 order-1 lg:order-2`}
                >
                  <CardVisibilityWrapper
                    cardId="typeSelector"
                    cardTitle="QR Code Category"
                    cardDescription="Select QR code type with quick pinning and hidden categories toggle"
                    icon={Layers}
                    isHideCardsMode={isHideCardsMode}
                    isVisible={settings.visibleCards.typeSelector}
                    onToggleVisibility={toggleCardVisibility}
                  >
                    <TypeSelector
                      selectedType={selectedType}
                      onSelectType={handleSelectType}
                      onShowToast={setToastMessage}
                    />
                  </CardVisibilityWrapper>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 3. Analytics Card (Readability & Scanning Diagnostics) */}
        {(isHideCardsMode || settings.visibleCards.readability) && (
          <section aria-label="QR Code Analytics" className="w-full pt-4 sm:pt-6">
            <CardVisibilityWrapper
              cardId="readability"
              cardTitle="QR Health & Analytics"
              cardDescription="Readability diagnostics, scan reliability score, and contrast analysis"
              icon={Activity}
              isHideCardsMode={isHideCardsMode}
              isVisible={settings.visibleCards.readability}
              onToggleVisibility={toggleCardVisibility}
            >
              <ReadabilityDashboard
                report={readability}
                options={styleOptions}
                onOpenScanner={() => setIsScannerOpen(true)}
                onShowToast={setToastMessage}
                onOptionsChange={(newOpts) =>
                  setStyleOptions((prev) => ({
                    ...prev,
                    ...newOpts,
                  }))
                }
              />
            </CardVisibilityWrapper>
          </section>
        )}

        {/* 4. Customization Card with Full Width */}
        {(isHideCardsMode || settings.visibleCards.customization) && (
          <section aria-label="QR Code Customization" className="w-full pt-4 sm:pt-6">
            <CardVisibilityWrapper
              cardId="customization"
              cardTitle="Design & Customization"
              cardDescription="Colors, shapes, frames, logo styling, and high-resolution export quality"
              icon={Palette}
              isHideCardsMode={isHideCardsMode}
              isVisible={settings.visibleCards.customization}
              onToggleVisibility={toggleCardVisibility}
            >
              <CustomizationPanel
                options={styleOptions}
                onChange={setStyleOptions}
                selectedType={selectedType}
                payload={currentPayload}
                readability={readability}
                activeTab={activeCustomTab}
                onTabChange={setActiveCustomTab}
                selectedRandomizeTarget={selectedRandomizeTarget}
                selectedRandomizeType={selectedRandomizeType}
                onRandomizeTargetChange={setSelectedRandomizeTarget}
                onRandomizeTypeChange={setSelectedRandomizeType}
                lockedTargets={lockedRandomizeTargets}
                onLockedTargetsChange={setLockedRandomizeTargets}
                onShowToast={setToastMessage}
              />
            </CardVisibilityWrapper>
          </section>
        )}
      </main>

      {/* Minimal Footer */}
      <Footer onShowToast={setToastMessage} />

      {/* Floating Bottom Navigation Bar: Mobile and Tablet format for reachability */}
      <MobileFloatingNav
        activeTab={activeCustomTab}
        onSelectTab={setActiveCustomTab}
        hasLogo={styleOptions.logo.type !== 'none'}
      />

      {/* QR Validation / Camera Scanner Modal */}
      <TestQrModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        payload={currentPayload}
        options={styleOptions}
        onOptionsChange={(newOpts) =>
          setStyleOptions((prev) => ({
            ...prev,
            ...newOpts,
          }))
        }
        onShowToast={setToastMessage}
      />

      {/* Recent / Saved Designs Modal */}
      <RecentDesignsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDesigns={savedDesigns}
        onLoadDesign={handleLoadDesign}
        onDuplicateDesign={handleDuplicateDesign}
        onDeleteDesign={handleDeleteDesign}
        onClearAll={handleClearAllSaved}
        onImportDesigns={handleImportDesigns}
        onShowToast={setToastMessage}
        currentStyle={styleOptions}
        onSaveCurrentAsTemplate={handleSaveDesign}
      />

      {/* Changelog & Releases Modal */}
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
        theme={theme}
      />

      {/* Micro-interaction Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

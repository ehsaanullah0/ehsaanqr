import React, { useState, useEffect, useMemo } from 'react';
import {
  QrType,
  QrFormData,
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
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';

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
  // Theme state: defaults to minimal theme
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
        ['url', 'text', 'email', 'phone', 'sms', 'wifi', 'whatsapp', 'vcard', 'upi', 'calendar', 'location'].includes(saved)
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
        ['url', 'text', 'email', 'phone', 'sms', 'wifi', 'whatsapp', 'vcard', 'upi', 'calendar', 'location'].includes(savedType)
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

  // Apply a saved design template (preserves user data & current QR type)
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
        savedCount={savedDesigns.length}
      />

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

          {/* Minimal ehsaan.odoo.com & Ehsaan Compressor Ecosystem Branding */}
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

            {/* Minimal button to showcase Ehsaan Compressor in Ehsaan Ecosystem */}
            <a
              id="header-ehsaan-compressor-link"
              href="https://ehsaancompress.ai.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-[#000000] hover:border-red-500/50 text-xs shadow-2xs backdrop-blur-xs transition-all group focus:outline-none focus:ring-2 focus:ring-red-500/30"
              title="Explore Ehsaan Compressor in the Ehsaan Ecosystem (ehsaancompress.ai.studio)"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffffff]">
                Ecosystem
              </span>
              <span className="text-zinc-600">•</span>
              <span className="font-semibold tracking-tight text-[#ffffff]">
                Ehsaan Compressor
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-500 transition-colors ml-0.5" />
            </a>
          </div>
        </div>

        {/* Top Hero Section: Main QR Code Preview & Instant Export */}
        <section aria-label="Main QR Code Preview" className="w-full space-y-4">
          <LivePreviewCard
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

          {/* Intelligent Readability Health Dashboard */}
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
        </section>

        {/* Settings Area (Below the QR Code Preview) */}
        <section aria-label="QR Code Settings" className="space-y-6 pt-2">
          {/* Section Heading */}
          <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Configure & Customize
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Select your data format, enter details, and style the matrix.
              </p>
            </div>
          </div>

          {/* Step 1: QR Type Selection */}
          <div>
            <TypeSelector
              selectedType={selectedType}
              onSelectType={handleSelectType}
            />
          </div>

          {/* Step 2 & 3: Content Form and Styling Panels in a Balanced Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Wing: Content Input Fields */}
            <div className="lg:col-span-6 space-y-6">
              <ContentForm
                type={selectedType}
                formData={formData}
                onChange={handleFormChange}
                validation={validation}
              />
            </div>

            {/* Right Wing: Customization Tabs */}
            <div className="lg:col-span-6 space-y-6">
              <CustomizationPanel
                options={styleOptions}
                onChange={setStyleOptions}
                selectedType={selectedType}
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
            </div>
          </div>
        </section>

        {/* Showcase Ehsaan QR Open Source Project */}
        <section className="pt-2">
          <OpenSourceShowcase
            onShowToast={setToastMessage}
            onOpenChangelog={() => setIsChangelogOpen(true)}
          />
        </section>

        {/* PWA Native App Installation */}
        <section className="pt-1">
          <PwaInstallBanner onShowToast={setToastMessage} />
        </section>
      </main>

      {/* Minimal Footer */}
      <Footer />

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

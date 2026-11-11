import React, { useState } from 'react';
import {
  X,
  Settings,
  Palette,
  LayoutGrid,
  PanelLeft,
  Sliders,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  Contrast,
  CheckCircle2,
  Layers,
  Activity,
  FileCode,
  QrCode,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { useSettings, DEFAULT_CARD_ORDER } from '../context/SettingsContext';
import { AppTheme, HomePageCardId, ErrorCorrectionLevel, ExportFormat } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

type SettingsTab = 'appearance' | 'cards' | 'sidebar' | 'defaults';

const CARD_METADATA: Record<
  HomePageCardId,
  { label: string; desc: string; icon: React.ComponentType<{ className?: string }> }
> = {
  preview: {
    label: 'Live QR Preview & Export',
    desc: 'Instant matrix preview, direct print, and high-res downloads',
    icon: QrCode,
  },
  readability: {
    label: 'Readability Health Diagnostics',
    desc: 'Contrast analysis, camera scannability metrics, and advisories',
    icon: Activity,
  },
  typeSelector: {
    label: 'QR Code Category Selector',
    desc: '12 standard formats (URL, Wi-Fi, vCard, Calendar, Location, etc.)',
    icon: Globe,
  },
  contentForm: {
    label: 'Content Input Editor',
    desc: 'Dynamic input forms with validation and quick presets',
    icon: FileCode,
  },
  customization: {
    label: 'Customization & Styling Panel',
    desc: 'Colors, liquid shapes, eyes, logo assets, and smart randomizer',
    icon: Palette,
  },
  opensource: {
    label: 'Open Source GitHub Showcase',
    desc: 'Repository link, changelog notes, and project details',
    icon: Layers,
  },
};

const THEMES: { id: AppTheme; name: string; desc: string; icon: React.ComponentType<{ className?: string }>; bg: string; border: string; text: string }[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Crisp Black & White Light (Clean studio)',
    icon: Contrast,
    bg: '#FFFFFF',
    border: '#E4E4E7',
    text: '#18181B',
  },
  {
    id: 'light',
    name: 'Light',
    desc: 'Amber Cream Slate (Warm parchment)',
    icon: Sun,
    bg: '#FAF8F5',
    border: '#FDE68A',
    text: '#0F172A',
  },
  {
    id: 'dark',
    name: 'Dark',
    desc: 'Deep Obsidian Slate & Crimson Red',
    icon: Moon,
    bg: '#111318',
    border: '#3F3F46',
    text: '#F4F4F5',
  },
  {
    id: 'material',
    name: 'Material',
    desc: 'Warm Gold & Amber Accent Dynamic',
    icon: Sparkles,
    bg: '#FAF8F5',
    border: '#FDE68A',
    text: '#0F172A',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const {
    settings,
    setTheme,
    setSidebarEnabled,
    setSidebarExpanded,
    toggleCardVisibility,
    setAllCardsVisibility,
    moveCard,
    setCardOrder,
    updateDefaults,
    resetToDefaults,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: 'all' | 'minimal' | 'designer') => {
    if (preset === 'all') {
      setAllCardsVisibility(true);
      onShowToast?.('All cards shown on home page ✓');
    } else if (preset === 'minimal') {
      setCardOrder(DEFAULT_CARD_ORDER);
      (Object.keys(settings.visibleCards) as HomePageCardId[]).forEach((id) => {
        const shouldShow = id === 'preview' || id === 'contentForm';
        if (settings.visibleCards[id] !== shouldShow) {
          toggleCardVisibility(id);
        }
      });
      onShowToast?.('Applied Minimalist preset (Preview + Content only) ✓');
    } else if (preset === 'designer') {
      setCardOrder(['preview', 'customization', 'contentForm', 'typeSelector', 'readability', 'opensource']);
      onShowToast?.('Applied Designer preset layout ✓');
    }
  };

  const visibleCount = Object.values(settings.visibleCards).filter(Boolean).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl my-auto bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden transition-all flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Accent Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-[#E7AC08] to-amber-500 shrink-0" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-[#D97706] dark:text-amber-400 flex items-center justify-center shadow-2xs shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-dialog-title" className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                Studio Settings & Tweaks
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Adjust themes, rearrange and toggle home page cards, and configure defaults.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-5 pt-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 py-2 px-3 rounded-t-xl text-xs font-bold transition-colors border-b-2 cursor-pointer shrink-0 ${
              activeTab === 'appearance'
                ? 'border-[#E7AC08] text-[#B45309] dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance & Theme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 py-2 px-3 rounded-t-xl text-xs font-bold transition-colors border-b-2 cursor-pointer shrink-0 ${
              activeTab === 'cards'
                ? 'border-[#E7AC08] text-[#B45309] dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Home Page Cards ({visibleCount}/6)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sidebar')}
            className={`flex items-center gap-2 py-2 px-3 rounded-t-xl text-xs font-bold transition-colors border-b-2 cursor-pointer shrink-0 ${
              activeTab === 'sidebar'
                ? 'border-[#E7AC08] text-[#B45309] dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <PanelLeft className="w-3.5 h-3.5" />
            <span>Navigation Sidebar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('defaults')}
            className={`flex items-center gap-2 py-2 px-3 rounded-t-xl text-xs font-bold transition-colors border-b-2 cursor-pointer shrink-0 ${
              activeTab === 'defaults'
                ? 'border-[#E7AC08] text-[#B45309] dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>QR Defaults</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Select Application Theme
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Choose your preferred visual presentation. 100% unrestricted for all users.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {THEMES.map((th) => {
                  const Icon = th.icon;
                  const isSelected = settings.theme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        setTheme(th.id);
                        onShowToast?.(`Applied ${th.name} theme ✓`);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#E7AC08] bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-[#E7AC08]/40 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: th.bg,
                          border: `1px solid ${th.border}`,
                          color: th.text,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {th.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#D97706] dark:text-amber-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                          {th.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: HOME PAGE CARDS (VISIBILITY & REARRANGING) */}
          {activeTab === 'cards' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Home Page Cards Management
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Hide unnecessary cards to clean up your workspace or reorder them up and down.
                  </p>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('all')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    Show All
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('minimal')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[#B45309] dark:text-amber-300 transition-colors cursor-pointer"
                  >
                    Minimal View
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCardOrder(DEFAULT_CARD_ORDER);
                      onShowToast?.('Reset card order to standard layout ✓');
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    Reset Order
                  </button>
                </div>
              </div>

              {/* Cards List with Visibility Toggles and Move Up / Down */}
              <div className="space-y-2 border border-zinc-200 dark:border-zinc-800 rounded-2xl divide-y divide-zinc-100 dark:divide-zinc-800/80 overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/40">
                {settings.cardOrder.map((cardId, index) => {
                  const meta = CARD_METADATA[cardId];
                  const Icon = meta.icon;
                  const isVisible = settings.visibleCards[cardId] ?? true;
                  const isFirst = index === 0;
                  const isLast = index === settings.cardOrder.length - 1;

                  return (
                    <div
                      key={cardId}
                      className={`p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-colors ${
                        isVisible
                          ? 'bg-white dark:bg-zinc-900'
                          : 'bg-zinc-100/60 dark:bg-zinc-900/30 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Sequence indicator */}
                        <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>

                        <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-[#D97706] dark:text-amber-400 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                              {meta.label}
                            </span>
                            {!isVisible && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                            {meta.desc}
                          </p>
                        </div>
                      </div>

                      {/* Controls: Reorder Up/Down & Toggle Hide */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => moveCard(cardId, 'up')}
                          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          title="Move card up"
                          aria-label={`Move ${meta.label} up`}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => moveCard(cardId, 'down')}
                          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          title="Move card down"
                          aria-label={`Move ${meta.label} down`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            toggleCardVisibility(cardId);
                            onShowToast?.(
                              isVisible ? `Hidden "${meta.label}" from home page` : `Restored "${meta.label}" to home page`
                            );
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isVisible
                              ? 'bg-amber-100/80 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-[#92400E] dark:text-amber-300 border border-amber-200/80 dark:border-amber-800'
                              : 'bg-zinc-200/80 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700'
                          }`}
                          title={isVisible ? 'Hide card from home page' : 'Show card on home page'}
                        >
                          {isVisible ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Hidden</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SIDEBAR SETTINGS */}
          {activeTab === 'sidebar' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Navigation Sidebar Settings
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Configure the vertical sidebar navigation and selective focus filters.
                </p>
              </div>

              {/* Sidebar On/Off Switch */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Enable Vertical Navigation Sidebar
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {settings.sidebarEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Shows an expandable vertical rail with links to all studio sections, templates, and scanner.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.sidebarEnabled}
                  onClick={() => {
                    const next = !settings.sidebarEnabled;
                    setSidebarEnabled(next);
                    onShowToast?.(next ? 'Sidebar enabled ✓' : 'Sidebar disabled');
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    settings.sidebarEnabled ? 'bg-[#E7AC08]' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      settings.sidebarEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Default Expansion State */}
              {settings.sidebarEnabled && (
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Default Sidebar State
                    </span>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Choose whether the sidebar starts expanded with labels or compact as an icon rail.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSidebarExpanded(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        !settings.sidebarExpanded
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
                      }`}
                    >
                      Icon Rail
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidebarExpanded(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        settings.sidebarExpanded
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900'
                      }`}
                    >
                      Expanded
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: QR DEFAULTS */}
          {activeTab === 'defaults' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  QR Studio Default Parameters
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Set baseline values for error correction and export preferences.
                </p>
              </div>

              <div className="space-y-3">
                {/* Default Error Correction */}
                <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Default Error Correction Level
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Level {settings.defaultErrorCorrection}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          updateDefaults({ defaultErrorCorrection: lvl });
                          onShowToast?.(`Default error correction set to ${lvl} ✓`);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          settings.defaultErrorCorrection === lvl
                            ? 'border-[#E7AC08] bg-amber-50 dark:bg-amber-950/50 text-[#B45309] dark:text-amber-300 ring-1 ring-[#E7AC08]'
                            : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50'
                        }`}
                      >
                        {lvl} ({lvl === 'L' ? '7%' : lvl === 'M' ? '15%' : lvl === 'Q' ? '25%' : '30%'})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Export Resolution */}
                <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Default Export Pixel Resolution
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {settings.defaultExportResolution} px
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[256, 512, 1024, 2048].map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => {
                          updateDefaults({ defaultExportResolution: res });
                          onShowToast?.(`Default export resolution set to ${res}px ✓`);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          settings.defaultExportResolution === res
                            ? 'border-[#E7AC08] bg-amber-50 dark:bg-amber-950/50 text-[#B45309] dark:text-amber-300 ring-1 ring-[#E7AC08]'
                            : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50'
                        }`}
                      >
                        {res}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Export Format */}
                <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Default Export Format
                    </span>
                    <span className="text-[10px] font-mono uppercase text-zinc-500">
                      {settings.defaultExportFormat}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['png', 'jpg', 'svg', 'pdf'] as ExportFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => {
                          updateDefaults({ defaultExportFormat: fmt });
                          onShowToast?.(`Default format set to ${fmt.toUpperCase()} ✓`);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold uppercase border transition-all cursor-pointer ${
                          settings.defaultExportFormat === fmt
                            ? 'border-[#E7AC08] bg-amber-50 dark:bg-amber-950/50 text-[#B45309] dark:text-amber-300 ring-1 ring-[#E7AC08]'
                            : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all card positions, visibility, and studio preferences to factory defaults?')) {
                resetToDefaults();
                onShowToast?.('Settings reset to factory defaults ✓');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Defaults</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E7AC08] hover:bg-[#D9A007] active:bg-[#C59206] text-[#0F172A] font-extrabold text-xs shadow-xs transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

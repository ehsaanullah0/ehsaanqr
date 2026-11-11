import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  QrCode,
  Activity,
  Globe,
  FileCode,
  Palette,
  Sliders,
  Settings,
  BookOpen,
  Camera,
  Coins,
  Filter,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { HomePageCardId } from '../types';

interface SidebarProps {
  savedCount: number;
  onOpenHistory: () => void;
  onOpenScanner: () => void;
  onOpenChangelog: () => void;
  onOpenTour?: () => void;
  onShowToast?: (msg: string) => void;
}

interface NavSectionItem {
  id: HomePageCardId | 'all';
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  targetDomId?: string;
}

const NAV_ITEMS: NavSectionItem[] = [
  {
    id: 'all',
    label: 'All Sections (Overview)',
    shortLabel: 'Overview',
    icon: Layers,
    description: 'Show complete workspace layout',
  },
  {
    id: 'preview',
    label: 'Live Preview & Export',
    shortLabel: 'Preview',
    icon: QrCode,
    description: 'Instant matrix and downloads',
    targetDomId: 'main-qr-preview-section',
  },
  {
    id: 'typeSelector',
    label: 'QR Code Types (12)',
    shortLabel: 'QR Types',
    icon: Globe,
    description: 'URL, Wi-Fi, vCard, Calendar, etc.',
    targetDomId: 'qr-type-selector-section',
  },
  {
    id: 'contentForm',
    label: 'Content Editor',
    shortLabel: 'Content',
    icon: FileCode,
    description: 'Payload data and form fields',
    targetDomId: 'content-input-section',
  },
  {
    id: 'customization',
    label: 'Styling & Customization',
    shortLabel: 'Styling',
    icon: Palette,
    description: 'Colors, liquid shapes, eyes, logo',
    targetDomId: 'customization-panel-section',
  },
  {
    id: 'readability',
    label: 'Readability Diagnostics',
    shortLabel: 'Diagnostics',
    icon: Activity,
    description: 'Contrast and scannability health',
    targetDomId: 'readability-dashboard-section',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  savedCount,
  onOpenHistory,
  onOpenScanner,
  onOpenChangelog,
  onOpenTour,
  onShowToast,
}) => {
  const { settings, toggleSidebar, setActiveFocusItem, openSettings } = useSettings();

  if (!settings.sidebarEnabled) return null;

  const isExpanded = settings.sidebarExpanded;
  const currentFocus = settings.activeFocusItem;

  const handleSelectNav = (item: NavSectionItem) => {
    setActiveFocusItem(item.id);
    if (item.id === 'all') {
      onShowToast?.('Showing all workspace sections');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onShowToast?.(`Focusing on: ${item.label}`);
      // Smooth scroll if element exists
      if (item.targetDomId) {
        setTimeout(() => {
          const el = document.getElementById(item.targetDomId!);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
      }
    }
  };

  return (
    <aside
      id="main-vertical-sidebar"
      aria-label="Navigation sidebar"
      className={`hidden lg:flex flex-col shrink-0 border-r border-[#EDE8DF] dark:border-zinc-800 bg-[#FAF8F5]/90 dark:bg-zinc-950/90 backdrop-blur-md transition-all duration-250 ease-in-out z-20 ${
        isExpanded ? 'w-60' : 'w-16'
      }`}
    >
      {/* Top Header / Collapse Toggle */}
      <div className="h-14 sm:h-16 flex items-center justify-between px-3.5 border-b border-[#EDE8DF] dark:border-zinc-800/80">
        {isExpanded ? (
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#E7AC08] shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100 truncate">
              Studio Rail
            </span>
          </div>
        ) : (
          <div className="mx-auto">
            <span className="w-2 h-2 rounded-full bg-[#E7AC08] block" />
          </div>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1.5 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Focus & Section Filter Navigation */}
      <div className="p-2 space-y-1 flex-1 overflow-y-auto no-scrollbar">
        {isExpanded && (
          <div className="px-2 pt-1 pb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#E7AC08]" />
              <span>Workspace Focus</span>
            </span>
            {currentFocus !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveFocusItem('all')}
                className="text-[10px] font-bold text-[#D97706] dark:text-amber-400 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isSelected = currentFocus === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectNav(item)}
              title={!isExpanded ? `${item.label} (Click to focus)` : undefined}
              className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#FEF08A] dark:bg-amber-950/60 border border-[#FACC15] dark:border-amber-700/80 text-black dark:text-amber-200 shadow-2xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 border border-transparent'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-black text-[#FEF08A] dark:bg-amber-400 dark:text-black'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {isExpanded && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate">{item.shortLabel}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-amber-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate font-normal">
                    {item.description}
                  </span>
                </div>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t border-zinc-200/80 dark:border-zinc-800" />

        {/* Modal Shortcuts */}
        {isExpanded && (
          <div className="px-2 pt-1 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Tools & Storage
            </span>
          </div>
        )}

        {/* Templates Button */}
        <button
          type="button"
          onClick={onOpenHistory}
          title={!isExpanded ? `Templates (${savedCount})` : undefined}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          {isExpanded && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="text-xs font-semibold truncate">Templates</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#FEF08A] text-black">
                  {savedCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Barcode Scanner Modal */}
        <button
          type="button"
          onClick={onOpenScanner}
          title={!isExpanded ? 'Test QR Scanner' : undefined}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-400">
            <Camera className="w-3.5 h-3.5" />
          </div>
          {isExpanded && (
            <span className="text-xs font-semibold truncate">Test QR Scanner</span>
          )}
        </button>

        {/* User Guide Tour */}
        {onOpenTour && (
          <button
            type="button"
            onClick={onOpenTour}
            title={!isExpanded ? 'Quick User Guide' : undefined}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-400">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            {isExpanded && (
              <span className="text-xs font-semibold truncate">User Guide</span>
            )}
          </button>
        )}

        {/* Changelog Modal */}
        <button
          type="button"
          onClick={onOpenChangelog}
          title={!isExpanded ? 'Changelog' : undefined}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-400">
            <Coins className="w-3.5 h-3.5" />
          </div>
          {isExpanded && (
            <span className="text-xs font-semibold truncate">Changelog</span>
          )}
        </button>
      </div>

      {/* Bottom Sticky Settings Trigger */}
      <div className="p-2 border-t border-[#EDE8DF] dark:border-zinc-800/80">
        <button
          type="button"
          id="sidebar-btn-open-settings"
          onClick={openSettings}
          title={!isExpanded ? 'Settings & Layout' : undefined}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#E7AC08] dark:hover:border-amber-500 text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#D97706] dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform duration-200">
            <Settings className="w-3.5 h-3.5" />
          </div>
          {isExpanded && (
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold block truncate text-zinc-900 dark:text-zinc-100">
                Settings
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
                Themes & Card Visibility
              </span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppSettings, HomePageCardId, AppTheme, ErrorCorrectionLevel, ExportFormat } from '../types';

export const STORAGE_SETTINGS_KEY = 'ehsaan_qr_app_settings';
export const STORAGE_THEME_KEY = 'ehsaan_qr_theme';

export const DEFAULT_CARD_ORDER: HomePageCardId[] = [
  'preview',
  'readability',
  'typeSelector',
  'contentForm',
  'customization',
  'opensource',
];

export const DEFAULT_VISIBLE_CARDS: Record<HomePageCardId, boolean> = {
  preview: true,
  readability: true,
  typeSelector: true,
  contentForm: true,
  customization: true,
  opensource: true,
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'minimal',
  sidebarEnabled: true,
  sidebarExpanded: false,
  activeFocusItem: 'all',
  visibleCards: DEFAULT_VISIBLE_CARDS,
  cardOrder: DEFAULT_CARD_ORDER,
  defaultErrorCorrection: 'Q',
  defaultExportResolution: 1024,
  defaultExportFormat: 'png',
  defaultAutoAdaptLogo: false,
};

interface SettingsContextType {
  settings: AppSettings;
  setTheme: (theme: AppTheme) => void;
  setSidebarEnabled: (enabled: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  setActiveFocusItem: (item: HomePageCardId | 'all') => void;
  toggleCardVisibility: (cardId: HomePageCardId) => void;
  setCardVisibility: (cardId: HomePageCardId, visible: boolean) => void;
  setAllCardsVisibility: (visible: boolean) => void;
  moveCard: (cardId: HomePageCardId, direction: 'up' | 'down') => void;
  setCardOrder: (order: HomePageCardId[]) => void;
  updateDefaults: (updates: Partial<Pick<AppSettings, 'defaultErrorCorrection' | 'defaultExportResolution' | 'defaultExportFormat' | 'defaultAutoAdaptLogo'>>) => void;
  resetToDefaults: () => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) as AppTheme | null;
      const savedRaw = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          theme: savedTheme || parsed.theme || DEFAULT_SETTINGS.theme,
          visibleCards: {
            ...DEFAULT_VISIBLE_CARDS,
            ...(parsed.visibleCards || {}),
          },
          cardOrder: Array.isArray(parsed.cardOrder) && parsed.cardOrder.length === DEFAULT_CARD_ORDER.length
            ? parsed.cardOrder
            : DEFAULT_CARD_ORDER,
        };
      }
      if (savedTheme) {
        return { ...DEFAULT_SETTINGS, theme: savedTheme };
      }
    } catch (e) {
      console.warn('Error loading settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
      localStorage.setItem(STORAGE_THEME_KEY, settings.theme);
    } catch (e) {
      console.warn('Error saving settings to localStorage', e);
    }
  }, [settings]);

  // Apply theme to DOM root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'material', 'minimal', 'colorful', 'colourful');
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'material') {
      root.classList.add('material');
    } else if (settings.theme === 'minimal') {
      root.classList.add('minimal');
    }
  }, [settings.theme]);

  const setTheme = useCallback((theme: AppTheme) => {
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  const setSidebarEnabled = useCallback((sidebarEnabled: boolean) => {
    setSettings((prev) => ({ ...prev, sidebarEnabled }));
  }, []);

  const setSidebarExpanded = useCallback((sidebarExpanded: boolean) => {
    setSettings((prev) => ({ ...prev, sidebarExpanded }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSettings((prev) => ({ ...prev, sidebarExpanded: !prev.sidebarExpanded }));
  }, []);

  const setActiveFocusItem = useCallback((activeFocusItem: HomePageCardId | 'all') => {
    setSettings((prev) => ({ ...prev, activeFocusItem }));
  }, []);

  const toggleCardVisibility = useCallback((cardId: HomePageCardId) => {
    setSettings((prev) => {
      const current = prev.visibleCards[cardId] ?? true;
      return {
        ...prev,
        visibleCards: {
          ...prev.visibleCards,
          [cardId]: !current,
        },
      };
    });
  }, []);

  const setCardVisibility = useCallback((cardId: HomePageCardId, visible: boolean) => {
    setSettings((prev) => ({
      ...prev,
      visibleCards: {
        ...prev.visibleCards,
        [cardId]: visible,
      },
    }));
  }, []);

  const setAllCardsVisibility = useCallback((visible: boolean) => {
    setSettings((prev) => {
      const updated: Record<HomePageCardId, boolean> = { ...prev.visibleCards };
      (Object.keys(updated) as HomePageCardId[]).forEach((key) => {
        updated[key] = visible;
      });
      return { ...prev, visibleCards: updated };
    });
  }, []);

  const moveCard = useCallback((cardId: HomePageCardId, direction: 'up' | 'down') => {
    setSettings((prev) => {
      const order = [...prev.cardOrder];
      const index = order.indexOf(cardId);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= order.length) return prev;

      const [removed] = order.splice(index, 1);
      order.splice(targetIndex, 0, removed);

      return { ...prev, cardOrder: order };
    });
  }, []);

  const setCardOrder = useCallback((cardOrder: HomePageCardId[]) => {
    setSettings((prev) => ({ ...prev, cardOrder }));
  }, []);

  const updateDefaults = useCallback(
    (
      updates: Partial<
        Pick<
          AppSettings,
          | 'defaultErrorCorrection'
          | 'defaultExportResolution'
          | 'defaultExportFormat'
          | 'defaultAutoAdaptLogo'
        >
      >
    ) => {
      setSettings((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const resetToDefaults = useCallback(() => {
    setSettings({
      ...DEFAULT_SETTINGS,
      theme: settings.theme, // keep user's current theme intact unless explicitly requested
    });
  }, [settings.theme]);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setTheme,
        setSidebarEnabled,
        setSidebarExpanded,
        toggleSidebar,
        setActiveFocusItem,
        toggleCardVisibility,
        setCardVisibility,
        setAllCardsVisibility,
        moveCard,
        setCardOrder,
        updateDefaults,
        resetToDefaults,
        isSettingsOpen,
        openSettings,
        closeSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

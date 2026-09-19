import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  isExclusiveAccessUnlocked,
  saveExclusiveUnlockStatus,
  getLockedFreeTheme,
  saveLockedFreeTheme,
  STORAGE_EXCLUSIVE_UNLOCKED_KEY,
  STORAGE_LOCKED_FREE_THEME_KEY,
} from '../utils/exclusiveAccess';
import { AppTheme } from '../types';
import { ExclusiveAccessModal } from '../components/ExclusiveAccessModal';

interface ExclusiveAccessContextType {
  isUnlocked: boolean;
  lockedFreeTheme: AppTheme | null;
  lockInFreeTheme: (theme: AppTheme) => void;
  openExclusiveModal: (featureName?: string, initialStep?: 'initial' | 'code') => void;
  closeExclusiveModal: () => void;
  isOverviewModalOpen: boolean;
  openOverviewModal: () => void;
  closeOverviewModal: () => void;
  unlockAll: () => void;
  lockAll: () => void;
}

const ExclusiveAccessContext = createContext<ExclusiveAccessContextType | undefined>(undefined);

export const ExclusiveAccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => isExclusiveAccessUnlocked());
  const [lockedFreeTheme, setLockedFreeThemeState] = useState<AppTheme | null>(() =>
    getLockedFreeTheme()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStep, setModalInitialStep] = useState<'initial' | 'code'>('initial');
  const [currentFeatureName, setCurrentFeatureName] = useState<string | undefined>(undefined);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);

  // Sync across tabs/windows or storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_EXCLUSIVE_UNLOCKED_KEY) {
        setIsUnlocked(e.newValue === 'true');
      }
      if (e.key === STORAGE_LOCKED_FREE_THEME_KEY) {
        setLockedFreeThemeState(getLockedFreeTheme());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const openExclusiveModal = useCallback(
    (featureName?: string, initialStep: 'initial' | 'code' = 'initial') => {
      setCurrentFeatureName(featureName);
      setModalInitialStep(initialStep);
      setIsModalOpen(true);
    },
    []
  );

  const closeExclusiveModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const openOverviewModal = useCallback(() => {
    setIsOverviewModalOpen(true);
  }, []);

  const closeOverviewModal = useCallback(() => {
    setIsOverviewModalOpen(false);
  }, []);

  const unlockAll = useCallback(() => {
    setIsUnlocked(true);
    saveExclusiveUnlockStatus(true);
  }, []);

  const lockAll = useCallback(() => {
    setIsUnlocked(false);
    saveExclusiveUnlockStatus(false);
  }, []);

  const lockInFreeTheme = useCallback((theme: AppTheme) => {
    saveLockedFreeTheme(theme);
    setLockedFreeThemeState(theme);
  }, []);

  return (
    <ExclusiveAccessContext.Provider
      value={{
        isUnlocked,
        lockedFreeTheme,
        lockInFreeTheme,
        openExclusiveModal,
        closeExclusiveModal,
        isOverviewModalOpen,
        openOverviewModal,
        closeOverviewModal,
        unlockAll,
        lockAll,
      }}
    >
      {children}
      <ExclusiveAccessModal
        isOpen={isModalOpen}
        onClose={closeExclusiveModal}
        onUnlockSuccess={unlockAll}
        featureName={currentFeatureName}
        initialStep={modalInitialStep}
        onOpenOverview={() => {
          closeExclusiveModal();
          openOverviewModal();
        }}
      />
    </ExclusiveAccessContext.Provider>
  );
};

export const useExclusiveAccess = (): ExclusiveAccessContextType => {
  const context = useContext(ExclusiveAccessContext);
  if (!context) {
    throw new Error('useExclusiveAccess must be used within an ExclusiveAccessProvider');
  }
  return context;
};


import { AppTheme } from '../types';
import { VALID_UNLOCK_CODES as SENSITIVE_UNLOCK_CODES, isCodeValid } from '../../sensitive docs/activationCodes';

export const STORAGE_EXCLUSIVE_UNLOCKED_KEY = 'ehsaan_qr_exclusive_unlocked';
export const STORAGE_LOCKED_FREE_THEME_KEY = 'ehsaan_qr_locked_free_theme';

export const VALID_UNLOCK_CODES = SENSITIVE_UNLOCK_CODES;

export function isExclusiveAccessUnlocked(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_EXCLUSIVE_UNLOCKED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function validateUnlockCode(inputCode: string): boolean {
  return isCodeValid(inputCode);
}

export function saveExclusiveUnlockStatus(unlocked: boolean): void {
  try {
    if (typeof window !== 'undefined') {
      if (unlocked) {
        localStorage.setItem(STORAGE_EXCLUSIVE_UNLOCKED_KEY, 'true');
      } else {
        localStorage.removeItem(STORAGE_EXCLUSIVE_UNLOCKED_KEY);
      }
    }
  } catch (e) {
    console.warn('Could not save unlock status to localStorage:', e);
  }
}

export function getLockedFreeTheme(): AppTheme | null {
  try {
    if (typeof window === 'undefined') return null;
    const val = localStorage.getItem(STORAGE_LOCKED_FREE_THEME_KEY);
    if (val === 'light' || val === 'dark' || val === 'material' || val === 'minimal') {
      return val;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveLockedFreeTheme(theme: AppTheme): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_LOCKED_FREE_THEME_KEY, theme);
    }
  } catch (e) {
    console.warn('Could not save locked free theme to localStorage:', e);
  }
}


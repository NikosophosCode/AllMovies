import { STORAGE_KEYS } from './constants';

/**
 * Get item from localStorage with type safety
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    
    if (!item) return defaultValue;
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set item to localStorage with type safety
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
};

/**
 * Clear all app-related storage
 */
export const clearAppStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    removeStorageItem(key);
  });
};

/**
 * Check if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

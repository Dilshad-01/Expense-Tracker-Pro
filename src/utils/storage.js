/**
 * Reusable localStorage utility functions with error handling.
 */

/**
 * Safely read and parse JSON from localStorage.
 * @param {string} key - Storage key
 * @param {*} defaultValue - Fallback when missing or invalid
 * @returns {*} Parsed value or default
 */
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely stringify and save to localStorage.
 * @param {string} key - Storage key
 * @param {*} value - Value to persist
 * @returns {boolean} Success status
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Remove a key from localStorage.
 * @param {string} key - Storage key
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Clear all app-related storage keys.
 * @param {string[]} keys - Keys to clear
 */
export function clearStorageKeys(keys) {
  keys.forEach((key) => removeFromStorage(key));
}

/**
 * Check if localStorage is available (SSR / private mode safe).
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

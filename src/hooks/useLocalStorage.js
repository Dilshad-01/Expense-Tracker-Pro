import { useState, useEffect, useCallback } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storage';

/**
 * Custom hook for persisting state in localStorage.
 * Syncs state with localStorage on every update.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value when storage is empty
 * @returns {[*, Function, boolean]} [value, setValue, isLoaded]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const value = getFromStorage(key, initialValue);
    setStoredValue(value);
    setIsLoaded(true);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        saveToStorage(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue, isLoaded];
}

/**
 * Generic Resilient LocalStorage React Hook
 * 
 * Synchronizes React state with browser local storage while providing
 * error resilience against corrupt JSON formatting or storage quotas.
 */

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

/**
 * Hook to persist and synchronize React state with `window.localStorage`.
 *
 * @template T - Type of the stored data structure
 * @param key - LocalStorage key name
 * @param initialValue - Default fallback value or initializer function if key is not found
 * @returns A tuple containing the current state value and a state setter function
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to parse stored JSON for key "${key}":`, error);
    }
    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to write item to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

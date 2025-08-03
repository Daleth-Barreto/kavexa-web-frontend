
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let value: T;
    try {
      const item = window.localStorage.getItem(key);
      // If item is null, undefined, or an empty array string, use initialValue.
      if (item && item !== 'undefined' && item !== 'null' && item !== '[]') {
        value = JSON.parse(item);
      } else {
        value = initialValue;
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      value = initialValue;
    }
    setStoredValue(value);
    setIsLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isLoaded];
}

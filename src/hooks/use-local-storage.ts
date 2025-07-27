'use client';

import { useState, useEffect, useCallback } from 'react';
import { mockTransactions, mockInventory, mockAlerts } from '@/lib/data';

function isMockData<T>(data: T, initial: T): boolean {
  if (initial === mockTransactions && Array.isArray(data) && data.length > 0 && data[0]?.id?.startsWith('txn-mock')) {
    return true;
  }
  if (initial === mockInventory && Array.isArray(data) && data.length > 0 && data[0]?.id?.startsWith('item-mock')) {
    return true;
  }
  if (initial === mockAlerts && Array.isArray(data) && data.length > 0 && data[0]?.id?.startsWith('alert-')) {
     const MOCK_ALERT_IDS = [
      "alert-1",
      "alert-2",
      "alert-3",
      "alert-4",
      "alert-5",
    ];
    return data.some((alert: any) => MOCK_ALERT_IDS.includes(alert.id));
  }
  return false;
}


export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let value: T;
    try {
      const item = window.localStorage.getItem(key);
      const parsedItem = item ? JSON.parse(item) : initialValue;
      
      if (isMockData(parsedItem, initialValue)) {
        value = initialValue;
        window.localStorage.removeItem(key); // Clean up mock data from storage
      } else {
        value = parsedItem;
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

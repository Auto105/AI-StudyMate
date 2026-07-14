'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SetStateAction } from 'react';

const LOCAL_STORAGE_CHANGE_EVENT = 'ai-studymate-local-storage-change';

interface LocalStorageChangeDetail<T> {
  key: string;
  value: T;
}

interface UseLocalStorageOptions<T> {
  getInitialValue?: () => T;
}

export function useLocalStorage<T>(key: string, initialValue: T, options: UseLocalStorageOptions<T> = {}) {
  const [value, setValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(key);

      setValue(storedValue ? (JSON.parse(storedValue) as T) : (options.getInitialValue?.() ?? initialValue));
    } catch {
      setValue(options.getInitialValue?.() ?? initialValue);
    } finally {
      setIsReady(true);
    }
  }, [initialValue, key, options.getInitialValue]);

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key !== key) {
        return;
      }

      try {
        setValue(event.newValue ? (JSON.parse(event.newValue) as T) : initialValue);
      } catch {
        setValue(initialValue);
      }
    }

    function handleLocalStorageChange(event: Event) {
      const customEvent = event as CustomEvent<LocalStorageChangeDetail<T>>;

      if (customEvent.detail.key !== key) {
        return;
      }

      setValue(customEvent.detail.value);
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalStorageChange);
    };
  }, [initialValue, key]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [isReady, key, value]);

  const setStoredValue = useCallback(
    (nextValue: SetStateAction<T>) => {
      setValue((currentValue) => {
        const resolvedValue =
          typeof nextValue === 'function' ? (nextValue as (currentValue: T) => T)(currentValue) : nextValue;

        window.localStorage.setItem(key, JSON.stringify(resolvedValue));
        window.dispatchEvent(
          new CustomEvent<LocalStorageChangeDetail<T>>(LOCAL_STORAGE_CHANGE_EVENT, {
            detail: { key, value: resolvedValue },
          }),
        );

        return resolvedValue;
      });
    },
    [key],
  );

  return [value, setStoredValue, isReady] as const;
}

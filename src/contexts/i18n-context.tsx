
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import es from '@/lib/locales/es.json';
import en from '@/lib/locales/en.json';

type Locale = 'es' | 'en';

const translations: Record<Locale, any> = { es, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}


export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useLocalStorage<Locale>('kavexa_locale', 'es');

  const toggleLocale = useCallback(() => {
    setLocale(prevLocale => (prevLocale === 'es' ? 'en' : 'es'));
  }, [setLocale]);

  const t = useCallback((key: string, replacements?: Record<string, string | number>) => {
      const value = getValue(translations[locale], key) || getValue(translations['es'], key) || key;

      if (!replacements) {
        return value;
      }
      
      return Object.entries(replacements).reduce((acc, [k, v]) => {
        return acc.replace(`{{${k}}}`, String(v));
      }, value);

  }, [locale]);
  
  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    toggleLocale
  }), [locale, setLocale, t, toggleLocale]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

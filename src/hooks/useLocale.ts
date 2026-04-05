'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Locale } from '@/lib/types';
import jaDict from '@/dictionaries/ja.json';
import enDict from '@/dictionaries/en.json';

const STORAGE_KEY = 'locale_preference';

type Dict = typeof jaDict;

const dictionaries: Record<Locale, Dict> = {
  ja: jaDict,
  en: enDict,
};

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>('ja');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && (stored === 'ja' || stored === 'en')) {
      setLocaleState(stored);
    } else {
      const browserLang = navigator.language;
      setLocaleState(browserLang.startsWith('ja') ? 'ja' : 'en');
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string, replacements?: Record<string, string | number>): string => {
      let value = getNestedValue(dictionaries[locale], key);
      if (replacements) {
        for (const [k, v] of Object.entries(replacements)) {
          value = value.replace(`{{${k}}}`, String(v));
        }
      }
      return value;
    },
    [locale]
  );

  return { locale, setLocale, t };
}

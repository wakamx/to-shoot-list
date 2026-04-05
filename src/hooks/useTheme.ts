'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme_preference';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored) setThemeState(stored);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const resolve = () => {
      const r = theme === 'system' ? (mq.matches ? 'dark' : 'light') : theme;
      setResolved(r);
      document.documentElement.classList.toggle('dark', r === 'dark');
    };
    resolve();
    mq.addEventListener('change', resolve);
    return () => mq.removeEventListener('change', resolve);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  }, []);

  return { theme, resolved, setTheme };
}

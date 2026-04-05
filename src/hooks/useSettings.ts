'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AIModel, AppSettings } from '@/lib/types';

const STORAGE_KEY = 'app_settings';

const defaultSettings: AppSettings = {
  ai_model: 'gpt-4o-mini',
  api_key: '',
  custom_model_name: '',
  custom_provider: 'openai',
  image_model: 'imagen-3.0-generate-002',
  custom_image_model_name: '',
  image_api_key: '',
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setModel = useCallback(
    (model: AIModel) => updateSettings({ ai_model: model }),
    [updateSettings]
  );

  const setApiKey = useCallback(
    (key: string) => updateSettings({ api_key: key }),
    [updateSettings]
  );

  const isConfigured = loaded && settings.api_key.length > 0;

  return { settings, loaded, isConfigured, setModel, setApiKey, updateSettings };
}

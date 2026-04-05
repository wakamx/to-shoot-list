'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AppScreen, InputFormData, Shot } from '@/lib/types';
import { useSettings } from '@/hooks/useSettings';
import { useShots } from '@/hooks/useShots';
import { useTheme, type Theme } from '@/hooks/useTheme';
import { useLocale } from '@/hooks/useLocale';
import type { Locale } from '@/lib/types';

interface AppContextType {
  // Screen navigation
  screen: AppScreen;
  setScreen: (s: AppScreen) => void;
  // Settings
  settings: ReturnType<typeof useSettings>['settings'];
  isConfigured: boolean;
  setModel: ReturnType<typeof useSettings>['setModel'];
  setApiKey: ReturnType<typeof useSettings>['setApiKey'];
  updateSettings: ReturnType<typeof useSettings>['updateSettings'];
  settingsLoaded: boolean;
  // Shots
  shots: Shot[];
  setFromAI: ReturnType<typeof useShots>['setFromAI'];
  toggleComplete: (id: string) => void;
  deleteShot: (id: string) => void;
  updateShot: (id: string, updates: Partial<Omit<Shot, 'id'>>) => void;
  addShotAfter: (afterId: string) => void;
  totalDuration: number;
  completedDuration: number;
  // Theme
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (t: Theme) => void;
  // Locale
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  // Settings modal
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  // Form data persistence for regeneration
  lastFormData: InputFormData | null;
  setLastFormData: (data: InputFormData) => void;
  // Generation
  generate: (formData: InputFormData) => Promise<void>;
  isGenerating: boolean;
  generationError: string | null;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<AppScreen>('input');
  const [showSettings, setShowSettings] = useState(false);
  const [lastFormData, setLastFormData] = useState<InputFormData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const { settings, loaded: settingsLoaded, isConfigured, setModel, setApiKey, updateSettings } = useSettings();
  const { shots, setFromAI, toggleComplete, deleteShot, updateShot, addShotAfter, totalDuration, completedDuration } = useShots();
  const { theme, resolved: resolvedTheme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();

  const generate = useCallback(
    async (formData: InputFormData) => {
      if (!settings.api_key) {
        setShowSettings(true);
        return;
      }
      setLastFormData(formData);
      setIsGenerating(true);
      setGenerationError(null);
      setScreen('loading');

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form: formData,
            model: settings.ai_model,
            apiKey: settings.api_key,
            customModelName: settings.custom_model_name,
            customProvider: settings.custom_provider,
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Generation failed');
        }
        setFromAI(data.shots);
        setScreen('shoot');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Generation failed';
        setGenerationError(message);
        setScreen('input');
      } finally {
        setIsGenerating(false);
      }
    },
    [settings, setFromAI, setScreen]
  );

  return (
    <AppContext.Provider
      value={{
        screen, setScreen,
        settings, isConfigured, setModel, setApiKey, updateSettings, settingsLoaded,
        shots, setFromAI, toggleComplete, deleteShot, updateShot, addShotAfter,
        totalDuration, completedDuration,
        theme, resolvedTheme, setTheme,
        locale, setLocale, t,
        showSettings, setShowSettings,
        lastFormData, setLastFormData,
        generate, isGenerating, generationError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

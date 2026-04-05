'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, Sun, Moon, Monitor, Globe } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import { AI_MODELS } from '@/lib/constants';
import type { AIModel, Locale } from '@/lib/types';
import type { Theme } from '@/hooks/useTheme';

export default function SettingsModal() {
  const {
    showSettings, setShowSettings,
    settings, setModel, setApiKey, updateSettings,
    theme, setTheme,
    locale, setLocale,
    t,
  } = useApp();

  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState('');
  const [localImageKey, setLocalImageKey] = useState('');
  const [saved, setSaved] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSettings) {
      setLocalKey(settings.api_key);
      setLocalImageKey(settings.image_api_key);
      setSaved(false);
    }
  }, [showSettings, settings.api_key, settings.image_api_key]);

  if (!showSettings) return null;

  const handleSave = () => {
    setApiKey(localKey);
    updateSettings({ image_api_key: localImageKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const themeOptions: { value: Theme; icon: React.ReactNode }[] = [
    { value: 'light', icon: <Sun size={16} /> },
    { value: 'system', icon: <Monitor size={16} /> },
    { value: 'dark', icon: <Moon size={16} /> },
  ];

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={(e) => {
        if (e.target === backdropRef.current) setShowSettings(false);
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-lg rounded-t-2xl p-6 pb-10 animate-slide-up"
        style={{ background: 'var(--card)' }}
      >
        {/* Handle */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />

        {/* Close */}
        <button
          onClick={() => setShowSettings(false)}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-6 mt-2">{t('settings.title')}</h2>

        {/* Theme */}
        <div className="mb-5">
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            {t('settings.theme')}
          </label>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg)' }}>
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  theme === opt.value
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {opt.icon}
                <span className="text-xs">{t(`settings.theme_${opt.value}`)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="mb-5">
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            <Globe size={14} className="inline mr-1" />
            {t('settings.language')}
          </label>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg)' }}>
            {(['ja', 'en'] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  locale === l
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {l === 'ja' ? '🇯🇵 日本語' : '🇬🇧 English'}
              </button>
            ))}
          </div>
        </div>

        {/* AI Model */}
        <div className="mb-5">
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            {t('settings.ai_model')}
          </label>
          <div className="flex flex-col gap-1.5">
            {AI_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all border ${
                  settings.ai_model === m.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                style={settings.ai_model !== m.id ? { background: 'var(--bg)' } : undefined}
              >
                {m.label}
              </button>
            ))}
            <button
              onClick={() => setModel('custom')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all border ${
                settings.ai_model === 'custom'
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300'
                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              style={settings.ai_model !== 'custom' ? { background: 'var(--bg)' } : undefined}
            >
              {t('settings.ai_model_custom')}
            </button>
          </div>

          {/* Custom Model Inputs */}
          {settings.ai_model === 'custom' && (
            <div className="mt-3 p-3 rounded-xl border space-y-3 animate-fade-in" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  {t('settings.custom_provider')}
                </label>
                <div className="flex gap-1">
                  {(['openai', 'google', 'anthropic'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateSettings({ custom_provider: p })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        settings.custom_provider === p
                          ? 'bg-brand-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p === 'openai' ? 'OpenAI' : p === 'google' ? 'Google' : 'Anthropic'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  {t('settings.custom_model_name')}
                </label>
                <input
                  type="text"
                  value={settings.custom_model_name || ''}
                  onChange={(e) => updateSettings({ custom_model_name: e.target.value })}
                  placeholder={t('settings.custom_model_placeholder')}
                  className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* API Key */}
        <div className="mb-5">
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            {t('settings.api_key')}
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder={t('settings.api_key_placeholder')}
              className="w-full px-4 py-3 pr-12 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              style={{
                background: 'var(--bg)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              style={{ color: 'var(--text-secondary)' }}
              type="button"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs mt-2 opacity-60">{t('settings.security_note')}</p>
        </div>

        {/* Image Generation API Key */}
        <div className="mb-5 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
          <label className="text-sm font-medium mb-2 block flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            {t('settings.image_generation')}
          </label>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
            {t('settings.image_api_key')}
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={localImageKey}
              onChange={(e) => setLocalImageKey(e.target.value)}
              placeholder={t('settings.api_key_placeholder')}
              className="w-full px-3 py-2.5 pr-10 rounded-lg text-xs border focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
            saved
              ? 'bg-accent-500 text-white'
              : 'bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98]'
          }`}
        >
          {saved ? t('settings.saved') : t('settings.save')}
        </button>
      </div>
    </div>
  );
}

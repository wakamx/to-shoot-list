'use client';

import { useState } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import { ORIENTATIONS, DURATIONS, CATEGORIES, COMPANIONS, TONES } from '@/lib/constants';
import type { InputFormData, VideoOrientation } from '@/lib/types';

export default function InputScreen() {
  const { t, setShowSettings, generate, generationError } = useApp();

  const [orientation, setOrientation] = useState<VideoOrientation>('9:16');
  const [duration, setDuration] = useState<number>(30);
  const [category, setCategory] = useState('cafe');
  const [companion, setCompanion] = useState('solo');
  const [tone, setTone] = useState('cinematic');
  const [memo, setMemo] = useState('');

  const handleGenerate = () => {
    const formData: InputFormData = {
      orientation,
      duration,
      category,
      companion,
      tone,
      memo,
    };
    generate(formData);
  };

  return (
    <div className="min-h-dvh flex flex-col animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            🎬 {t('app.title')}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {t('app.description')}
          </p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2.5 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Form */}
      <main className="flex-1 overflow-y-auto px-5 pb-32 space-y-6">
        {/* Orientation */}
        <section>
          <SectionLabel>{t('input.orientation')}</SectionLabel>
          <div className="flex gap-2">
            {ORIENTATIONS.map((o) => (
              <button
                key={o.id}
                onClick={() => setOrientation(o.id)}
                className={`chip flex-1 justify-center text-base ${orientation === o.id ? 'chip-selected' : ''}`}
              >
                <span className="text-lg">{o.icon}</span>
                <span className="text-xs">{o.id}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Duration */}
        <section>
          <SectionLabel>{t('input.duration')}</SectionLabel>
          <div className="flex gap-1.5 flex-wrap">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`chip ${duration === d ? 'chip-selected' : ''}`}
              >
                {t('input.duration_sec', { sec: d })}
              </button>
            ))}
          </div>
        </section>

        {/* Category */}
        <section>
          <SectionLabel>{t('input.category')}</SectionLabel>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`chip ${category === c.id ? 'chip-selected' : ''}`}
              >
                <span>{c.icon}</span>
                <span className="text-xs">{t(`input.categories.${c.id}`)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Companion */}
        <section>
          <SectionLabel>{t('input.companion')}</SectionLabel>
          <div className="flex gap-1.5 flex-wrap">
            {COMPANIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCompanion(c.id)}
                className={`chip ${companion === c.id ? 'chip-selected' : ''}`}
              >
                <span>{c.icon}</span>
                <span className="text-xs">{t(`input.companions.${c.id}`)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Tone */}
        <section>
          <SectionLabel>{t('input.tone')}</SectionLabel>
          <div className="flex gap-1.5 flex-wrap">
            {TONES.map((tn) => (
              <button
                key={tn.id}
                onClick={() => setTone(tn.id)}
                className={`chip ${tone === tn.id ? 'chip-selected' : ''}`}
              >
                <span>{tn.icon}</span>
                <span className="text-xs">{t(`input.tones.${tn.id}`)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Memo */}
        <section>
          <SectionLabel>{t('input.memo')}</SectionLabel>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder={t('input.memo_placeholder')}
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 resize-none"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          />
        </section>

        {/* Error */}
        {generationError && (
          <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {generationError}
          </div>
        )}
      </main>

      {/* Generate Button (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-5 pb-8" style={{ background: 'linear-gradient(transparent, var(--bg) 30%)' }}>
        <button
          onClick={handleGenerate}
          className="w-full py-4 rounded-2xl text-sm font-bold bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98] transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
        >
          <Sparkles size={18} />
          {t('input.generate')}
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </label>
  );
}

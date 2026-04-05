'use client';

import { Settings, RefreshCw, ArrowLeft } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import ShotCard, { AddShotDivider } from '@/components/shoot/ShotCard';

export default function ShootingScreen() {
  const {
    t, shots, totalDuration, completedDuration,
    lastFormData, generate, isGenerating,
    setShowSettings, setScreen,
  } = useApp();

  const orientation = lastFormData?.orientation ?? '9:16';
  const allCompleted = shots.length > 0 && shots.every((s) => s.is_completed);
  const progressPercent = totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0;

  const handleRegenerate = () => {
    if (lastFormData) {
      generate(lastFormData);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col animate-fade-in">
      {/* Sticky Header */}
      <header
        className="sticky top-0 z-30 px-5 pt-4 pb-3 backdrop-blur-xl"
        style={{
          background: 'color-mix(in oklch, var(--bg) 85%, transparent)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setScreen('input')}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label={t('shoot.back_to_input')}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40"
              style={{ borderColor: 'var(--border)' }}
            >
              <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
              {t('shoot.regenerate')}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: allCompleted
                  ? 'var(--color-accent-500)'
                  : 'var(--color-brand-500)',
              }}
            />
          </div>
          <span className="text-xs font-mono font-semibold min-w-[60px] text-right" style={{ color: 'var(--text-secondary)' }}>
            {allCompleted
              ? `✨ ${t('shoot.complete')}`
              : t('shoot.progress', { done: completedDuration, total: totalDuration })}
          </span>
        </div>
      </header>

      {/* Shot List */}
      <main className="flex-1 px-4 py-4 space-y-2 pb-8">
        {shots.map((shot, i) => (
          <div key={shot.id}>
            <ShotCard shot={shot} orientation={orientation} />
            {i < shots.length - 1 && <AddShotDivider afterId={shot.id} />}
          </div>
        ))}
      </main>
    </div>
  );
}

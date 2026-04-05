'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/components/AppProvider';
import { VLOG_TIPS } from '@/lib/constants';

export default function LoadingScreen() {
  const { t } = useApp();
  const [tipIndex, setTipIndex] = useState(0);
  const [dots, setDots] = useState('');

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % VLOG_TIPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const tip = VLOG_TIPS[tipIndex];

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 animate-fade-in">
      {/* Animated camera icon */}
      <div className="mb-8 relative">
        <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center animate-pulse-gentle">
          <span className="text-4xl animate-bounce-subtle">🎥</span>
        </div>
        {/* Shimmer ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-500/20 animate-pulse-gentle" />
      </div>

      {/* Generating text */}
      <h2 className="text-lg font-semibold mb-2">
        {t('loading.generating')}{dots}
      </h2>

      {/* Progress shimmer bar */}
      <div className="w-48 h-1.5 rounded-full overflow-hidden mb-10" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full shimmer-bg" style={{ width: '100%' }} />
      </div>

      {/* Tips */}
      <div
        className="w-full max-w-sm rounded-2xl p-5 text-center transition-all duration-500"
        style={{ background: 'var(--card)', boxShadow: 'var(--shadow-card)' }}
      >
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          {t('loading.tip_prefix')}
        </p>
        <div key={tipIndex} className="animate-fade-in">
          <span className="text-2xl mb-2 block">{tip.icon}</span>
          <p className="text-sm leading-relaxed">{t(`tips.${tip.key}`)}</p>
        </div>
      </div>
    </div>
  );
}

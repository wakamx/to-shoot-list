'use client';

import type { CameraAction, SubjectType, ShotSize } from '@/lib/types';
import { SUBJECT_TYPES } from '@/lib/constants';

interface Props {
  cameraAction: CameraAction;
  subjectType: SubjectType;
  shotSize: ShotSize;
}

const BG_COLORS: Record<SubjectType, { from: string; to: string }> = {
  person: { from: 'oklch(0.85 0.05 30)', to: 'oklch(0.75 0.08 50)' },
  landscape: { from: 'oklch(0.80 0.08 200)', to: 'oklch(0.70 0.10 170)' },
  food: { from: 'oklch(0.88 0.06 80)', to: 'oklch(0.78 0.08 60)' },
  item: { from: 'oklch(0.85 0.05 270)', to: 'oklch(0.75 0.07 250)' },
};

const SIZE_SCALE: Record<ShotSize, number> = {
  wide: 1,
  bust: 1.5,
  close_up: 2.2,
};

export default function PreviewView({ cameraAction, subjectType, shotSize }: Props) {
  const bg = BG_COLORS[subjectType];
  const baseScale = SIZE_SCALE[shotSize];
  const subjectIcon = SUBJECT_TYPES[subjectType].icon;

  // Background animation
  const bgAnimation = getBgAnimation(cameraAction);
  // Subject animation
  const subjectAnimation = getSubjectAnimation(cameraAction);

  return (
    <div
      className="guide-preview rounded-xl"
      style={{
        background: `linear-gradient(135deg, ${bg.from}, ${bg.to})`,
      }}
    >
      {/* Background elements for motion */}
      {(cameraAction === 'dolly_side' || cameraAction === 'pan_left' || cameraAction === 'pan_right') && (
        <div
          className="absolute inset-0 flex items-center gap-8 opacity-20"
          style={bgAnimation}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="text-3xl shrink-0">
              {subjectType === 'landscape' ? '🌳' : subjectType === 'food' ? '🍽️' : '🏛️'}
            </div>
          ))}
        </div>
      )}

      {/* Subject */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          transform: `scale(${baseScale})`,
          ...subjectAnimation,
        }}
      >
        <span className="text-3xl drop-shadow-lg">{subjectIcon}</span>
      </div>

      {/* Crosshair overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Rule of thirds lines */}
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/10" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/10" />
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white/30" />
      </div>

      {/* REC indicator */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 text-white/70">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-gentle" />
        <span className="text-[9px] font-mono font-bold tracking-wider">REC</span>
      </div>
    </div>
  );
}

function getSubjectAnimation(action: CameraAction): React.CSSProperties {
  switch (action) {
    case 'fixed':
      return {};
    case 'zoom_in':
      return { animation: 'zoom-in-preview 2.5s ease-in-out infinite' };
    case 'pan_right':
      return { animation: 'pan-flow 2.5s linear infinite', animationDirection: 'reverse' };
    case 'pan_left':
      return { animation: 'pan-flow 2.5s linear infinite' };
    case 'tilt_up':
      return { animation: 'move-forward 2.5s ease-in-out infinite' };
    case 'tilt_down':
      return { animation: 'move-forward 2.5s ease-in-out infinite', animationDirection: 'reverse' };
    case 'orbit':
      return { animation: 'orbit-subject 3s ease-in-out infinite' };
    case 'dolly_side':
      return {}; // Subject stays centered, bg moves
    default:
      return {};
  }
}

function getBgAnimation(action: CameraAction): React.CSSProperties {
  switch (action) {
    case 'dolly_side':
      return { animation: 'dolly-bg 1.5s linear infinite' };
    case 'pan_right':
      return { animation: 'dolly-bg 2.5s linear infinite', animationDirection: 'reverse' };
    case 'pan_left':
      return { animation: 'dolly-bg 2.5s linear infinite' };
    default:
      return {};
  }
}

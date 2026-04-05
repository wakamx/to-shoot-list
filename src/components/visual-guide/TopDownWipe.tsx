'use client';

import type { CameraAction, SubjectType } from '@/lib/types';

interface Props {
  cameraAction: CameraAction;
  subjectType: SubjectType;
}

export default function TopDownWipe({ cameraAction, subjectType }: Props) {
  const subjectEmoji = getSubjectEmoji(subjectType);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Subject (center) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg z-10">
        {subjectEmoji}
      </div>

      {/* Camera/Phone icon with animation */}
      <div style={getCameraAnimation(cameraAction)}>
        <div className="text-sm">📱</div>
      </div>

      {/* Arrow indicator */}
      <ArrowIndicator action={cameraAction} />
    </div>
  );
}

function getSubjectEmoji(type: SubjectType): string {
  switch (type) {
    case 'person': return '🧑';
    case 'landscape': return '⛰️';
    case 'food': return '🍰';
    case 'item': return '📦';
  }
}

function getCameraAnimation(action: CameraAction): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    zIndex: 5,
  };

  switch (action) {
    case 'fixed':
      return { ...base, bottom: '6px', left: '50%', transform: 'translateX(-50%)' };
    case 'zoom_in':
      return { ...base, bottom: '6px', left: '50%', transform: 'translateX(-50%)', animation: 'move-forward 2.5s ease-in-out infinite' };
    case 'pan_left':
    case 'pan_right':
      return { ...base, bottom: '6px', left: '50%', transform: 'translateX(-50%)' };
    case 'tilt_up':
    case 'tilt_down':
      return { ...base, bottom: '6px', left: '50%', transform: 'translateX(-50%)' };
    case 'orbit':
      return { ...base, top: '50%', left: '50%', marginTop: '-6px', marginLeft: '-6px', animation: 'orbit-rotate 3s linear infinite' };
    case 'dolly_side':
      return { ...base, bottom: '6px', left: '0', animation: 'dolly-bg 2s linear infinite', animationDirection: 'reverse' };
    default:
      return base;
  }
}

function ArrowIndicator({ action }: { action: CameraAction }) {
  const arrowClass = 'absolute text-[10px] opacity-50';

  switch (action) {
    case 'zoom_in':
      return <span className={`${arrowClass} bottom-5 left-1/2 -translate-x-1/2`}>⬆️</span>;
    case 'pan_left':
      return <span className={`${arrowClass} bottom-3 left-2`}>⬅️</span>;
    case 'pan_right':
      return <span className={`${arrowClass} bottom-3 right-2`}>➡️</span>;
    case 'tilt_up':
      return <span className={`${arrowClass} left-1/2 -translate-x-1/2 top-3`}>⬆️</span>;
    case 'tilt_down':
      return <span className={`${arrowClass} left-1/2 -translate-x-1/2 bottom-3`}>⬇️</span>;
    case 'orbit':
      return <span className={`${arrowClass} top-1 right-1`}>🔄</span>;
    case 'dolly_side':
      return <span className={`${arrowClass} bottom-1 left-1/2 -translate-x-1/2`}>↔️</span>;
    default:
      return null;
  }
}

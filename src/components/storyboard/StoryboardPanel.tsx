'use client';

import { useState } from 'react';
import type { CameraAction, SubjectType, ShotSize, VideoOrientation } from '@/lib/types';

interface Props {
  cameraAction: CameraAction;
  subjectType: SubjectType;
  shotSize: ShotSize;
  orientation: VideoOrientation;
}

/**
 * StoryboardPanel - SVG storyboard illustration component
 *
 * SVG file resolution:
 *   1. /public/storyboards/{subject}_{size}.svg  (user-provided file)
 *   2. Inline fallback SVG (built-in default)
 *
 * Camera action overlays (arrows, labels) are always drawn programmatically on top.
 */
export default function StoryboardPanel({ cameraAction, subjectType, shotSize, orientation }: Props) {
  const isVertical = orientation === '9:16';
  const svgPath = `/storyboards/${subjectType}_${shotSize}.svg`;
  const [hasCustomSvg, setHasCustomSvg] = useState(true); // optimistic

  const w = isVertical ? 270 : 480;
  const h = isVertical ? 480 : 270;

  return (
    <div
      className="w-full relative overflow-hidden rounded-xl"
      style={{
        aspectRatio: isVertical ? '9/16' : '16/9',
        maxHeight: isVertical ? '320px' : '200px',
        background: '#f5f0e8',
      }}
    >
      {/* Layer 1: Illustration (custom SVG file or inline fallback) */}
      {hasCustomSvg ? (
        <img
          src={svgPath}
          alt={`${subjectType} ${shotSize}`}
          className="w-full h-full object-contain"
          onError={() => setHasCustomSvg(false)}
        />
      ) : (
        <FallbackIllustration
          subject={subjectType}
          size={shotSize}
          isVertical={isVertical}
        />
      )}

      {/* Layer 2: Camera action overlay (always programmatic) */}
      {cameraAction !== 'fixed' && (
        <svg
          viewBox={`0 0 ${w} ${h}`}
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <CameraOverlay action={cameraAction} w={w} h={h} />
        </svg>
      )}
    </div>
  );
}


// ========== Fallback Inline Illustrations ==========

function FallbackIllustration({ subject, size, isVertical }: {
  subject: SubjectType;
  size: ShotSize;
  isVertical: boolean;
}) {
  const w = isVertical ? 270 : 480;
  const h = isVertical ? 480 : 270;
  const cx = w / 2;
  const cy = h / 2;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Paper background */}
      <rect width="100%" height="100%" fill="#f5f0e8" />

      {/* Storyboard frame border */}
      <rect
        x="8" y="8"
        width={w - 16} height={h - 16}
        fill="none" stroke="#b0a590" strokeWidth="1.5"
        strokeDasharray="4 2" rx="4"
      />

      {/* Subject illustration */}
      <SubjectIllustration subject={subject} size={size} cx={cx} cy={cy} w={w} h={h} />
    </svg>
  );
}


function SubjectIllustration({ subject, size, cx, cy, w, h }: {
  subject: SubjectType; size: ShotSize;
  cx: number; cy: number; w: number; h: number;
}) {
  const stroke = '#5a4a3a';
  const illustrations: Record<SubjectType, Record<ShotSize, React.ReactNode>> = {
    person: {
      wide: (
        <g>
          <path d={`M ${w*0.1} ${h*0.75} Q ${cx} ${h*0.72} ${w*0.9} ${h*0.75}`} fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.4" />
          <line x1={w*0.05} y1={h*0.4} x2={w*0.95} y2={h*0.4} stroke={stroke} strokeWidth="0.6" opacity="0.15" />
          <ellipse cx={cx} cy={h*0.42} rx={8} ry={10} fill="none" stroke={stroke} strokeWidth="1.8" />
          <line x1={cx} y1={h*0.46} x2={cx} y2={h*0.62} stroke={stroke} strokeWidth="1.8" />
          <line x1={cx} y1={h*0.5} x2={cx-15} y2={h*0.56} stroke={stroke} strokeWidth="1.5" />
          <line x1={cx} y1={h*0.5} x2={cx+15} y2={h*0.56} stroke={stroke} strokeWidth="1.5" />
          <line x1={cx} y1={h*0.62} x2={cx-10} y2={h*0.74} stroke={stroke} strokeWidth="1.5" />
          <line x1={cx} y1={h*0.62} x2={cx+10} y2={h*0.74} stroke={stroke} strokeWidth="1.5" />
          <line x1={w*0.15} y1={h*0.35} x2={w*0.15} y2={h*0.75} stroke={stroke} strokeWidth="1" opacity="0.3" />
          <ellipse cx={w*0.15} cy={h*0.32} rx={12} ry={15} fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.25" />
          <line x1={w*0.82} y1={h*0.38} x2={w*0.82} y2={h*0.75} stroke={stroke} strokeWidth="1" opacity="0.3" />
          <ellipse cx={w*0.82} cy={h*0.35} rx={10} ry={13} fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.25" />
        </g>
      ),
      bust: (
        <g>
          <ellipse cx={cx} cy={cy-h*0.12} rx={18} ry={22} fill="none" stroke={stroke} strokeWidth="2" />
          <circle cx={cx-7} cy={cy-h*0.14} r={2} fill={stroke} opacity="0.6" />
          <circle cx={cx+7} cy={cy-h*0.14} r={2} fill={stroke} opacity="0.6" />
          <path d={`M ${cx-6} ${cy-h*0.08} Q ${cx} ${cy-h*0.05} ${cx+6} ${cy-h*0.08}`} fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.5" />
          <line x1={cx} y1={cy} x2={cx} y2={cy+h*0.04} stroke={stroke} strokeWidth="2" />
          <path d={`M ${cx-40} ${cy+h*0.15} Q ${cx-25} ${cy+h*0.04} ${cx} ${cy+h*0.04} Q ${cx+25} ${cy+h*0.04} ${cx+40} ${cy+h*0.15}`} fill="none" stroke={stroke} strokeWidth="2" />
          <path d={`M ${cx-18} ${cy-h*0.18} Q ${cx-10} ${cy-h*0.28} ${cx} ${cy-h*0.26} Q ${cx+10} ${cy-h*0.28} ${cx+18} ${cy-h*0.18}`} fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
        </g>
      ),
      close_up: (
        <g>
          <ellipse cx={cx} cy={cy} rx={w*0.25} ry={h*0.28} fill="none" stroke={stroke} strokeWidth="2.5" />
          <ellipse cx={cx-w*0.08} cy={cy-h*0.04} rx={6} ry={4} fill="none" stroke={stroke} strokeWidth="1.5" />
          <circle cx={cx-w*0.08} cy={cy-h*0.04} r={2.5} fill={stroke} opacity="0.5" />
          <ellipse cx={cx+w*0.08} cy={cy-h*0.04} rx={6} ry={4} fill="none" stroke={stroke} strokeWidth="1.5" />
          <circle cx={cx+w*0.08} cy={cy-h*0.04} r={2.5} fill={stroke} opacity="0.5" />
          <path d={`M ${cx-12} ${cy+h*0.1} Q ${cx} ${cy+h*0.14} ${cx+12} ${cy+h*0.1}`} fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
          <path d={`M ${cx-w*0.25} ${cy-h*0.06} Q ${cx-w*0.15} ${cy-h*0.3} ${cx} ${cy-h*0.28} Q ${cx+w*0.15} ${cy-h*0.3} ${cx+w*0.25} ${cy-h*0.06}`} fill="none" stroke={stroke} strokeWidth="2" opacity="0.4" />
        </g>
      ),
    },
    landscape: {
      wide: (
        <g>
          <path d={`M 0 ${h*0.55} L ${w*0.15} ${h*0.3} L ${w*0.3} ${h*0.45} L ${w*0.45} ${h*0.2} L ${w*0.6} ${h*0.4} L ${w*0.75} ${h*0.25} L ${w} ${h*0.5}`} fill="none" stroke={stroke} strokeWidth="1.8" />
          <path d={`M 0 ${h*0.65} Q ${w*0.2} ${h*0.55} ${w*0.4} ${h*0.6} Q ${w*0.6} ${h*0.55} ${w*0.8} ${h*0.58} Q ${w*0.9} ${h*0.55} ${w} ${h*0.6}`} fill="none" stroke={stroke} strokeWidth="1" opacity="0.4" />
          <path d={`M 0 ${h*0.75} Q ${cx} ${h*0.7} ${w} ${h*0.75}`} fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.3" />
        </g>
      ),
      bust: (
        <g>
          <line x1={w*0.25} y1={h*0.35} x2={w*0.25} y2={h*0.7} stroke={stroke} strokeWidth="2" />
          <ellipse cx={w*0.25} cy={h*0.3} rx={25} ry={20} fill="none" stroke={stroke} strokeWidth="1.5" />
          <line x1={w*0.72} y1={h*0.38} x2={w*0.72} y2={h*0.7} stroke={stroke} strokeWidth="1.8" />
          <ellipse cx={w*0.72} cy={h*0.33} rx={22} ry={18} fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d={`M ${w*0.35} ${h*0.85} Q ${cx} ${h*0.65} ${w*0.65} ${h*0.85}`} fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.4" />
          <line x1={0} y1={h*0.72} x2={w} y2={h*0.72} stroke={stroke} strokeWidth="0.8" opacity="0.25" />
        </g>
      ),
      close_up: (
        <g>
          <circle cx={cx} cy={cy} r={15} fill="none" stroke={stroke} strokeWidth="2" />
          <circle cx={cx} cy={cy} r={6} fill={stroke} opacity="0.15" />
          {Array.from({ length: 7 }).map((_, i) => {
            const angle = (i * 360 / 7) * Math.PI / 180;
            const px = cx + Math.cos(angle) * 35;
            const py = cy + Math.sin(angle) * 35;
            return <ellipse key={i} cx={px} cy={py} rx={12} ry={18} fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.5" transform={`rotate(${i*360/7+90}, ${px}, ${py})`} />;
          })}
          <path d={`M ${cx} ${cy+35} Q ${cx+5} ${cy+h*0.25} ${cx-3} ${h*0.85}`} fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
        </g>
      ),
    },
    food: {
      wide: (
        <g>
          <path d={`M ${w*0.05} ${h*0.55} L ${w*0.95} ${h*0.55}`} fill="none" stroke={stroke} strokeWidth="1.5" />
          <ellipse cx={cx-w*0.15} cy={h*0.5} rx={30} ry={12} fill="none" stroke={stroke} strokeWidth="1.5" />
          <ellipse cx={cx+w*0.15} cy={h*0.5} rx={28} ry={11} fill="none" stroke={stroke} strokeWidth="1.5" />
          <rect x={cx-8} y={h*0.42} width={16} height={18} rx={3} fill="none" stroke={stroke} strokeWidth="1.2" />
        </g>
      ),
      bust: (
        <g>
          <ellipse cx={cx} cy={cy+h*0.06} rx={w*0.28} ry={h*0.15} fill="none" stroke={stroke} strokeWidth="2" />
          <ellipse cx={cx} cy={cy+h*0.04} rx={w*0.22} ry={h*0.11} fill="none" stroke={stroke} strokeWidth="1" opacity="0.3" />
          <path d={`M ${cx-20} ${cy-h*0.02} Q ${cx-10} ${cy-h*0.12} ${cx} ${cy-h*0.1} Q ${cx+10} ${cy-h*0.12} ${cx+20} ${cy-h*0.02}`} fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d={`M ${cx-5} ${cy-h*0.15} Q ${cx-8} ${cy-h*0.22} ${cx-3} ${cy-h*0.28}`} fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.2" />
          <path d={`M ${cx+5} ${cy-h*0.16} Q ${cx+8} ${cy-h*0.23} ${cx+3} ${cy-h*0.29}`} fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.2" />
        </g>
      ),
      close_up: (
        <g>
          <path d={`M ${cx-w*0.3} ${cy+h*0.1} Q ${cx-w*0.2} ${cy-h*0.2} ${cx} ${cy-h*0.18} Q ${cx+w*0.2} ${cy-h*0.2} ${cx+w*0.3} ${cy+h*0.1}`} fill="none" stroke={stroke} strokeWidth="2" />
          <path d={`M ${cx-w*0.15} ${cy+h*0.05} Q ${cx-w*0.05} ${cy-h*0.02} ${cx+w*0.05} ${cy+h*0.03} Q ${cx+w*0.12} ${cy-h*0.01} ${cx+w*0.18} ${cy+h*0.04}`} fill="none" stroke={stroke} strokeWidth="1" opacity="0.3" />
          <circle cx={cx-w*0.1} cy={cy+h*0.12} r={5} fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.25" />
          <circle cx={cx+w*0.12} cy={cy+h*0.08} r={3} fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.25" />
        </g>
      ),
    },
    item: {
      wide: (
        <g>
          <path d={`M ${w*0.08} ${h*0.6} L ${w*0.92} ${h*0.6}`} fill="none" stroke={stroke} strokeWidth="1.2" />
          <rect x={cx-20} y={h*0.38} width={40} height={35} rx={3} fill="none" stroke={stroke} strokeWidth="1.8" />
          <circle cx={w*0.25} cy={h*0.52} r={10} fill="none" stroke={stroke} strokeWidth="1" opacity="0.35" />
          <rect x={w*0.68} y={h*0.45} width={18} height={22} rx={2} fill="none" stroke={stroke} strokeWidth="1" opacity="0.35" />
        </g>
      ),
      bust: (
        <g>
          <rect x={cx-35} y={cy-30} width={70} height={60} rx={6} fill="none" stroke={stroke} strokeWidth="2" />
          <rect x={cx-20} y={cy-18} width={40} height={8} rx={2} fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.3" />
          <line x1={cx-15} y1={cy} x2={cx+15} y2={cy} stroke={stroke} strokeWidth="0.6" opacity="0.2" />
          <ellipse cx={cx} cy={cy+35} rx={35} ry={5} fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.15" />
        </g>
      ),
      close_up: (
        <g>
          <rect x={cx-w*0.3} y={cy-h*0.25} width={w*0.6} height={h*0.5} rx={8} fill="none" stroke={stroke} strokeWidth="2.5" />
          <rect x={cx-w*0.18} y={cy-h*0.15} width={w*0.36} height={h*0.12} rx={3} fill="none" stroke={stroke} strokeWidth="1" opacity="0.25" />
          <circle cx={cx} cy={cy+h*0.08} r={8} fill="none" stroke={stroke} strokeWidth="1" opacity="0.2" />
        </g>
      ),
    },
  };

  return <>{illustrations[subject][size]}</>;
}


// ========== Camera Action Overlays ==========

function CameraOverlay({ action, w, h }: { action: CameraAction; w: number; h: number }) {
  const cx = w / 2;
  const cy = h / 2;
  const c = '#8b4513';

  switch (action) {
    case 'fixed':
      return null;
    case 'pan_left':
      return (
        <g>
          <line x1={cx+40} y1={h-30} x2={cx-40} y2={h-30} stroke={c} strokeWidth="2" opacity="0.5" />
          <polygon points={`${cx-40},${h-30} ${cx-28},${h-35} ${cx-28},${h-25}`} fill={c} opacity="0.5" />
          <text x={cx} y={h-38} textAnchor="middle" fontSize="10" fill={c} opacity="0.45" fontFamily="monospace">PAN ←</text>
        </g>
      );
    case 'pan_right':
      return (
        <g>
          <line x1={cx-40} y1={h-30} x2={cx+40} y2={h-30} stroke={c} strokeWidth="2" opacity="0.5" />
          <polygon points={`${cx+40},${h-30} ${cx+28},${h-35} ${cx+28},${h-25}`} fill={c} opacity="0.5" />
          <text x={cx} y={h-38} textAnchor="middle" fontSize="10" fill={c} opacity="0.45" fontFamily="monospace">PAN →</text>
        </g>
      );
    case 'tilt_up':
      return (
        <g>
          <line x1={30} y1={cy+40} x2={30} y2={cy-40} stroke={c} strokeWidth="2" opacity="0.5" />
          <polygon points={`30,${cy-40} 25,${cy-28} 35,${cy-28}`} fill={c} opacity="0.5" />
          <text x={42} y={cy} textAnchor="start" fontSize="10" fill={c} opacity="0.45" fontFamily="monospace" transform={`rotate(-90, 42, ${cy})`}>TILT ↑</text>
        </g>
      );
    case 'tilt_down':
      return (
        <g>
          <line x1={30} y1={cy-40} x2={30} y2={cy+40} stroke={c} strokeWidth="2" opacity="0.5" />
          <polygon points={`30,${cy+40} 25,${cy+28} 35,${cy+28}`} fill={c} opacity="0.5" />
          <text x={42} y={cy} textAnchor="start" fontSize="10" fill={c} opacity="0.45" fontFamily="monospace" transform={`rotate(-90, 42, ${cy})`}>TILT ↓</text>
        </g>
      );
    case 'zoom_in':
      return (
        <g>
          <path d={`M ${cx-50} ${cy-35} L ${cx-50} ${cy-50} L ${cx-35} ${cy-50}`} fill="none" stroke={c} strokeWidth="2" opacity="0.4" />
          <path d={`M ${cx+35} ${cy-50} L ${cx+50} ${cy-50} L ${cx+50} ${cy-35}`} fill="none" stroke={c} strokeWidth="2" opacity="0.4" />
          <path d={`M ${cx-50} ${cy+35} L ${cx-50} ${cy+50} L ${cx-35} ${cy+50}`} fill="none" stroke={c} strokeWidth="2" opacity="0.4" />
          <path d={`M ${cx+35} ${cy+50} L ${cx+50} ${cy+50} L ${cx+50} ${cy+35}`} fill="none" stroke={c} strokeWidth="2" opacity="0.4" />
          <text x={cx} y={h-20} textAnchor="middle" fontSize="10" fill={c} opacity="0.45" fontFamily="monospace">ZOOM IN</text>
        </g>
      );
    case 'orbit':
      return (
        <g>
          <path d={`M ${cx-40} ${h-35} A 40 15 0 1 1 ${cx+40} ${h-35}`} fill="none" stroke={c} strokeWidth="2" opacity="0.5" />
          <polygon points={`${cx+40},${h-35} ${cx+30},${h-40} ${cx+32},${h-30}`} fill={c} opacity="0.5" />
          <text x={cx} y={h-50} textAnchor="middle" fontSize="10" fill={c} opacity="0.45" fontFamily="monospace">ORBIT</text>
        </g>
      );
    case 'dolly_side':
      return (
        <g>
          <line x1={cx-45} y1={h-30} x2={cx+45} y2={h-30} stroke={c} strokeWidth="2" opacity="0.5" />
          <polygon points={`${cx-45},${h-30} ${cx-33},${h-35} ${cx-33},${h-25}`} fill={c} opacity="0.5" />
          <polygon points={`${cx+45},${h-30} ${cx+33},${h-35} ${cx+33},${h-25}`} fill={c} opacity="0.5" />
          <text x={cx} y={h-38} textAnchor="middle" fontSize="10" fill={c} opacity="0.45" fontFamily="monospace">DOLLY ↔</text>
        </g>
      );
    default:
      return null;
  }
}

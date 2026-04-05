'use client';

import type { CameraAction, SubjectType, ShotSize, VideoOrientation } from '@/lib/types';
import PreviewView from './PreviewView';
import TopDownWipe from './TopDownWipe';

interface Props {
  cameraAction: CameraAction;
  subjectType: SubjectType;
  shotSize: ShotSize;
  orientation: VideoOrientation;
}

export default function VisualGuide({ cameraAction, subjectType, shotSize, orientation }: Props) {
  const isVertical = orientation === '9:16';

  return (
    <div
      className="guide-container w-full relative"
      style={{
        aspectRatio: isVertical ? '9/16' : '16/9',
        maxHeight: isVertical ? '280px' : '180px',
      }}
    >
      {/* Main Preview View */}
      <PreviewView
        cameraAction={cameraAction}
        subjectType={subjectType}
        shotSize={shotSize}
      />

      {/* Top-Down Wipe (PiP) */}
      <div className="guide-wipe topdown-bg-light">
        <TopDownWipe
          cameraAction={cameraAction}
          subjectType={subjectType}
        />
      </div>
    </div>
  );
}

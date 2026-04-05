'use client';

import { useState, useCallback } from 'react';
import type { Shot, CameraAction, ShotSize, SubjectType } from '@/lib/types';

export function useShots() {
  const [shots, setShots] = useState<Shot[]>([]);

  const setFromAI = useCallback((data: Omit<Shot, 'id' | 'is_completed'>[]) => {
    const withIds: Shot[] = data.map((s, i) => ({
      ...s,
      id: `shot-${Date.now()}-${i}`,
      is_completed: false,
    }));
    setShots(withIds);
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setShots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_completed: !s.is_completed } : s))
    );
  }, []);

  const deleteShot = useCallback((id: string) => {
    setShots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateShot = useCallback(
    (id: string, updates: Partial<Omit<Shot, 'id'>>) => {
      setShots((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
    },
    []
  );

  const addShotAfter = useCallback((afterId: string) => {
    setShots((prev) => {
      const idx = prev.findIndex((s) => s.id === afterId);
      const newShot: Shot = {
        id: `shot-${Date.now()}`,
        scene_description: '',
        subject_type_id: 'landscape' as SubjectType,
        shot_size_id: 'wide' as ShotSize,
        camera_action_id: 'fixed' as CameraAction,
        duration_sec: 3,
        is_completed: false,
      };
      const next = [...prev];
      next.splice(idx + 1, 0, newShot);
      return next;
    });
  }, []);

  const totalDuration = shots.reduce((sum, s) => sum + s.duration_sec, 0);
  const completedDuration = shots
    .filter((s) => s.is_completed)
    .reduce((sum, s) => sum + s.duration_sec, 0);

  return {
    shots,
    setShots,
    setFromAI,
    toggleComplete,
    deleteShot,
    updateShot,
    addShotAfter,
    totalDuration,
    completedDuration,
  };
}

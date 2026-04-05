'use client';

import { useState, useRef } from 'react';
import { Check, MoreVertical, Trash2, Pencil, Camera, Plus, ImageIcon, Loader2, Share } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import VisualGuide from '@/components/visual-guide/VisualGuide';
import { CAMERA_ACTIONS, SHOT_SIZES, SUBJECT_TYPES } from '@/lib/constants';
import type { Shot, CameraAction, ShotSize, SubjectType, VideoOrientation } from '@/lib/types';

interface ShotCardProps {
  shot: Shot;
  orientation: VideoOrientation;
}

export default function ShotCard({ shot, orientation }: ShotCardProps) {
  const { t, settings, setShowSettings, toggleComplete, deleteShot, updateShot } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [cameraFile, setCameraFile] = useState<File | null>(null);

  // Edit form state
  const [editDesc, setEditDesc] = useState(shot.scene_description);
  const [editDuration, setEditDuration] = useState(shot.duration_sec);
  const [editSubject, setEditSubject] = useState(shot.subject_type_id);
  const [editShotSize, setEditShotSize] = useState(shot.shot_size_id);
  const [editAction, setEditAction] = useState(shot.camera_action_id);

  const handleSaveEdit = () => {
    updateShot(shot.id, {
      scene_description: editDesc,
      duration_sec: editDuration,
      subject_type_id: editSubject,
      shot_size_id: editShotSize,
      camera_action_id: editAction,
    });
    setEditing(false);
  };

  const handleCameraOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!shot.is_completed) {
        toggleComplete(shot.id);
      }
      setCameraFile(file);
    }
  };

  const handleShareVideo = async (file: File) => {
    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Shot Video',
          text: 'Save your shot to device',
        });
      } else {
        // Fallback: trigger download
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `shot_${shot.id}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (err) {
      console.error('Error sharing/saving file:', err);
    }
  };

  const handleGenerateImage = async () => {
    if (!settings.image_api_key) {
      setShowSettings(true);
      return;
    }
    
    setIsGeneratingImage(true);
    try {
      // Create a prompt from shot details
      const sceneContent = shot.scene_description || t(`shoot.subjects.${shot.subject_type_id}`);
      const shotSize = t(`shoot.shot_sizes.${shot.shot_size_id}`);
      const cameraAction = t(`shoot.camera_actions.${shot.camera_action_id}`);
      const frameDesc = orientation === '9:16' 
        ? 'vertical 9:16 rectangular storyboard frame' 
        : 'landscape 16:9 rectangular storyboard frame';
        
      const prompt = `(Traditional animation storyboard process draft), highly rough hand-drawn pencil sketch, minimal pen and ink outlines, focus on emotion and dynamic composition.
[SCENE CONTENT]: ${sceneContent}
[SHOT SIZE]: ${shotSize}
[VISUAL STYLE]: Raw lines, messy but lively, quick expressive strokes. Minimalist cross-hatching shading. Soft monochrome. Cozyness and warm mood.
[META INFO]: Single panel contained in a ${frameDesc}. Off-white, slightly textured paper texture, showing pencil smudges and eraser marks.`;
      
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          apiKey: settings.image_api_key,
          model: settings.image_model,
          customModelName: settings.custom_image_model_name,
          aspectRatio: orientation,
        }),
      });
      
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error);
      
      updateShot(shot.id, { storyboard_image_url: data.imageUrl });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`${t('errors.generation_failed')}\n${msg}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (editing) {
    return (
      <div
        className="rounded-2xl p-4 space-y-4 animate-fade-in"
        style={{ background: 'var(--card)', boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-sm font-semibold">{t('shoot.edit_shot')}</h3>

        {/* Scene description */}
        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
            {t('shoot.scene_description')}
          </label>
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl text-sm border resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Duration */}
        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
            {t('shoot.duration_label', { sec: editDuration })}
          </label>
          <input
            type="range"
            min={2}
            max={6}
            value={editDuration}
            onChange={(e) => setEditDuration(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
        </div>

        {/* Subject type */}
        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
            {t('shoot.subject')}
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.entries(SUBJECT_TYPES) as [SubjectType, { icon: string }][]).map(([id, { icon }]) => (
              <button
                key={id}
                onClick={() => setEditSubject(id)}
                className={`chip text-xs ${editSubject === id ? 'chip-selected' : ''}`}
              >
                {icon} {t(`shoot.subjects.${id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Shot size */}
        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
            {t('shoot.shot_size')}
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.entries(SHOT_SIZES) as [ShotSize, { icon: string }][]).map(([id, { icon }]) => (
              <button
                key={id}
                onClick={() => setEditShotSize(id)}
                className={`chip text-xs ${editShotSize === id ? 'chip-selected' : ''}`}
              >
                {icon} {t(`shoot.shot_sizes.${id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Camera action */}
        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
            {t('shoot.camera_action')}
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.entries(CAMERA_ACTIONS) as [CameraAction, { icon: string }][]).map(([id, { icon }]) => (
              <button
                key={id}
                onClick={() => setEditAction(id)}
                className={`chip text-xs ${editAction === id ? 'chip-selected' : ''}`}
              >
                {icon} {t(`shoot.camera_actions.${id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(false)}
            className="flex-1 py-2.5 rounded-xl text-sm border transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
            style={{ borderColor: 'var(--border)' }}
          >
            {t('shoot.cancel')}
          </button>
          <button
            onClick={handleSaveEdit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 transition-all"
          >
            {t('shoot.save')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        shot.is_completed ? 'opacity-60 scale-[0.98]' : ''
      }`}
      style={{ background: 'var(--card)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* ShotHeader */}
      <div className="flex items-start gap-3 p-4 pb-2">
        {/* Completion checkbox */}
        <button
          onClick={() => toggleComplete(shot.id)}
          className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
            shot.is_completed
              ? 'bg-accent-500 border-accent-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-brand-400'
          }`}
        >
          {shot.is_completed && <Check size={14} strokeWidth={3} />}
        </button>

        {/* Scene description */}
        <p className={`flex-1 text-sm leading-relaxed ${shot.is_completed ? 'line-through' : ''}`}>
          {shot.scene_description}
        </p>

        {/* Kebab menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <MoreVertical size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-8 z-20 min-w-[160px] rounded-xl py-1 shadow-lg animate-fade-in border"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => { handleGenerateImage(); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <ImageIcon size={14} /> {t('shoot.generate_storyboard')}
              </button>
              <button
                onClick={() => { setEditing(true); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <Pencil size={14} /> {t('shoot.edit')}
              </button>
              <button
                onClick={() => { deleteShot(shot.id); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <Trash2 size={14} /> {t('shoot.delete')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tags row */}
      <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-700/50">
          {SUBJECT_TYPES[shot.subject_type_id].icon} {t(`shoot.subjects.${shot.subject_type_id}`)}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-700/50">
          {SHOT_SIZES[shot.shot_size_id].icon} {t(`shoot.shot_sizes.${shot.shot_size_id}`)}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-700/50">
          {CAMERA_ACTIONS[shot.camera_action_id].icon} {t(`shoot.camera_actions.${shot.camera_action_id}`)}
        </span>
      </div>

      {/* VisualGuide or Storyboard Image */}
      <div className="px-4 relative">
        {isGeneratingImage ? (
          <div className="w-full aspect-[16/9] flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
            <Loader2 size={24} className="animate-spin text-brand-500" />
          </div>
        ) : shot.storyboard_image_url ? (
          <img
            src={shot.storyboard_image_url}
            alt="Storyboard"
            className={`w-full rounded-xl object-cover shadow-sm ${orientation === '9:16' ? 'aspect-[9/16]' : 'aspect-[16/9]'}`}
          />
        ) : (
          <VisualGuide
            cameraAction={shot.camera_action_id}
            subjectType={shot.subject_type_id}
            shotSize={shot.shot_size_id}
            orientation={orientation}
          />
        )}
      </div>

      {/* ShotFooter */}
      <div className="flex items-center justify-between p-4 pt-3">
        <span className="text-sm font-bold text-brand-500">
          {t('shoot.duration_label', { sec: shot.duration_sec })}
        </span>

        <div className="flex items-center gap-2">
          {cameraFile && (
            <button
              onClick={() => handleShareVideo(cameraFile)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-all shadow-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              <Share size={16} />
              {t('shoot.share_video')}
            </button>
          )}
          <button
            onClick={handleCameraOpen}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 active:scale-95 transition-all shadow-sm"
          >
            <Camera size={16} />
            {cameraFile ? t('shoot.retake') : t('shoot.open_camera')}
          </button>
        </div>

        {/* Hidden file input for camera */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          className="hidden"
          onChange={handleFileCapture}
        />
      </div>
    </div>
  );
}

// AddShotDivider component
export function AddShotDivider({ afterId }: { afterId: string }) {
  const { addShotAfter, t } = useApp();
  return (
    <div className="flex items-center justify-center py-1">
      <button
        onClick={() => addShotAfter(afterId)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800 border"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        <Plus size={14} />
        {t('shoot.add_shot')}
      </button>
    </div>
  );
}

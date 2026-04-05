import type { AIModel, AIProvider, CameraAction, ShotSize, SubjectType, VideoOrientation } from './types';

// ===== Video Orientation =====
export const ORIENTATIONS: { id: VideoOrientation; icon: string }[] = [
  { id: '9:16', icon: '📱' },
  { id: '16:9', icon: '🖥️' },
];

// ===== Duration Options =====
export const DURATIONS = [15, 30, 60, 90, 180] as const;

// ===== Categories =====
export const CATEGORIES = [
  { id: 'travel', icon: '✈️' },
  { id: 'cafe', icon: '☕' },
  { id: 'daily', icon: '🌿' },
  { id: 'event', icon: '🎉' },
  { id: 'food', icon: '🍽️' },
  { id: 'nature', icon: '🏔️' },
  { id: 'city', icon: '🏙️' },
  { id: 'shopping', icon: '🛍️' },
] as const;

// ===== Companion =====
export const COMPANIONS = [
  { id: 'solo', icon: '🧍' },
  { id: 'friend', icon: '👯' },
  { id: 'partner', icon: '💑' },
  { id: 'family', icon: '👨‍👩‍👧' },
] as const;

// ===== Tone =====
export const TONES = [
  { id: 'cinematic', icon: '🎬' },
  { id: 'pop', icon: '⚡' },
  { id: 'chill', icon: '🌊' },
] as const;

// ===== Subject Types =====
export const SUBJECT_TYPES: Record<SubjectType, { icon: string }> = {
  person: { icon: '🧑' },
  landscape: { icon: '🏞️' },
  food: { icon: '🍰' },
  item: { icon: '📦' },
};

// ===== Shot Sizes =====
export const SHOT_SIZES: Record<ShotSize, { icon: string }> = {
  wide: { icon: '🔭' },
  bust: { icon: '👤' },
  close_up: { icon: '🔍' },
};

// ===== Camera Actions =====
export const CAMERA_ACTIONS: Record<CameraAction, { icon: string }> = {
  fixed: { icon: '📌' },
  pan_left: { icon: '⬅️' },
  pan_right: { icon: '➡️' },
  tilt_up: { icon: '⬆️' },
  tilt_down: { icon: '⬇️' },
  zoom_in: { icon: '🔎' },
  orbit: { icon: '🔄' },
  dolly_side: { icon: '🛤️' },
};

// ===== AI Models =====
export const AI_MODELS: { id: AIModel; provider: AIProvider; label: string }[] = [
  // OpenAI
  { id: 'gpt-4o', provider: 'openai', label: 'GPT-4o' },
  { id: 'gpt-4o-mini', provider: 'openai', label: 'GPT-4o mini' },
  { id: 'o1-mini', provider: 'openai', label: 'o1-mini' },
  // Google
  { id: 'gemini-2.0-flash', provider: 'google', label: 'Gemini 2.0 Flash' },
  { id: 'gemini-2.0-flash-lite-preview-02-05', provider: 'google', label: 'Gemini 2.0 Flash Lite' },
  // Anthropic
  { id: 'claude-3-7-sonnet-latest', provider: 'anthropic', label: 'Claude 3.7 Sonnet' },
  { id: 'claude-3-5-sonnet-latest', provider: 'anthropic', label: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-5-haiku-latest', provider: 'anthropic', label: 'Claude 3.5 Haiku' },
];

export function getProviderForModel(model: AIModel, customProvider?: AIProvider): AIProvider {
  if (model === 'custom' && customProvider) return customProvider;
  const found = AI_MODELS.find((m) => m.id === model);
  return found?.provider ?? 'openai';
}

// ===== Vlog Tips =====
export const VLOG_TIPS = [
  { icon: '📐', key: 'tip_rule_of_thirds' },
  { icon: '🤳', key: 'tip_stabilize' },
  { icon: '🌅', key: 'tip_golden_hour' },
  { icon: '🔇', key: 'tip_ambient_sound' },
  { icon: '✂️', key: 'tip_short_cuts' },
  { icon: '👀', key: 'tip_variety' },
  { icon: '🎵', key: 'tip_music' },
  { icon: '🔋', key: 'tip_battery' },
] as const;

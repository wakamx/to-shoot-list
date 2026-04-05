// ===== Shot Data Types =====
export interface Shot {
  id: string;
  scene_description: string;
  subject_type_id: SubjectType;
  shot_size_id: ShotSize;
  camera_action_id: CameraAction;
  duration_sec: number;
  is_completed: boolean;
}

export type SubjectType = 'person' | 'landscape' | 'food' | 'item';
export type ShotSize = 'wide' | 'bust' | 'close_up';
export type CameraAction =
  | 'fixed'
  | 'pan_left'
  | 'pan_right'
  | 'tilt_up'
  | 'tilt_down'
  | 'zoom_in'
  | 'orbit'
  | 'dolly_side';

// ===== Input Form Types =====
export type VideoOrientation = '9:16' | '16:9';

export interface InputFormData {
  orientation: VideoOrientation;
  duration: number;
  category: string;
  companion: string;
  tone: string;
  memo: string;
}

// ===== Settings Types =====
export type AIModel = 'gpt-4o-mini' | 'gemini-2.0-flash' | 'claude-3-5-haiku-20241022';
export type AIProvider = 'openai' | 'google' | 'anthropic';

export interface AppSettings {
  ai_model: AIModel;
  api_key: string;
}

// ===== Locale Types =====
export type Locale = 'ja' | 'en';

// ===== App State =====
export type AppScreen = 'input' | 'loading' | 'shoot';

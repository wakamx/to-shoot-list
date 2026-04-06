// ===== Shot Data Types =====
export interface Shot {
  id: string;
  scene_description: string;
  subject_type_id: SubjectType;
  shot_size_id: ShotSize;
  camera_action_id: CameraAction;
  duration_sec: number;
  is_completed: boolean;
  storyboard_image_url?: string;
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
export type AIModel = 'gpt-4o' | 'gpt-4o-mini' | 'o1-mini' | 'gemini-2.0-flash' | 'gemini-2.0-flash-lite-preview-02-05' | 'claude-3-7-sonnet-latest' | 'claude-3-5-sonnet-latest' | 'claude-3-5-haiku-latest' | 'custom' | string;

export type AIProvider = 'openai' | 'google' | 'anthropic';

export interface AppSettings {
  ai_model: AIModel;
  api_key: string;
  custom_model_name?: string;
  custom_provider?: AIProvider;
  image_provider: 'google' | 'fal';
  image_model: string;
  custom_image_model_name?: string;
  image_api_key: string;
  fal_api_key: string;
  fal_model: string;
}

// ===== Locale Types =====
export type Locale = 'ja' | 'en';

// ===== App State =====
export type AppScreen = 'input' | 'loading' | 'shoot';

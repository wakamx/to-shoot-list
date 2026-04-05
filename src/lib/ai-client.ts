import type { InputFormData } from './types';

export function buildSystemPrompt(): string {
  return `# Role
あなたはプロのVlog映像ディレクターです。ユーザーのラフな予定や条件をもとに、魅力的なVlogのカット割り（香盤表）を作成してください。

# Task
ユーザーの【Input】を読み解き、指定された【JSON Schema】と【Enum（許可されたID）】に厳密に従って、カット割りデータのJSON配列のみを出力してください。Markdown（\`\`\`json 等）や挨拶などのテキストは一切含めないでください。

# Constraints
1. 動画の総時間: 全カットの duration_sec の合計が、Inputの「全体の長さ」と一致するようにカット数を調整してください（1カット2〜6秒）。
2. アスペクト比の考慮: Inputの「動画の向き」が縦（9:16）の場合、横方向の移動（pan_right, pan_left, dolly_side）は被写体がフレームアウトしやすいため、多用を避けてください。
3. トーンの反映: 「エモい」なら fixed や orbit を長めに、「ポップ」なら zoom_in や pan を多用してテンポ良く、など工夫してください。

# Data Schema & Enum
出力するJSONの各オブジェクトは以下のプロパティを必須とします。指定されたID以外は絶対に使用しないでください。

- scene_description: (String) シーンの具体的な内容。簡潔に。
- subject_type_id: (String) "person" | "landscape" | "food" | "item"
- shot_size_id: (String) "wide" | "bust" | "close_up"
- camera_action_id: (String) "fixed" | "pan_right" | "pan_left" | "tilt_up" | "tilt_down" | "zoom_in" | "orbit" | "dolly_side"
- duration_sec: (Number) 2〜6の整数

# Example (Few-Shot)
【Input】向き: 縦(9:16), 長さ: 15秒, カテゴリ: カフェ, 誰と: 友達, トーン: エモい, メモ: プリンが美味しい店

【Output】
[
  { "scene_description": "カフェの看板を下から見上げる", "subject_type_id": "landscape", "shot_size_id": "wide", "camera_action_id": "tilt_up", "duration_sec": 3 },
  { "scene_description": "友達がドアを開けて店内に入る後ろ姿", "subject_type_id": "person", "shot_size_id": "wide", "camera_action_id": "fixed", "duration_sec": 3 },
  { "scene_description": "運ばれてきた固めプリン", "subject_type_id": "food", "shot_size_id": "close_up", "camera_action_id": "zoom_in", "duration_sec": 3 },
  { "scene_description": "プリンを一口食べる友達の笑顔", "subject_type_id": "person", "shot_size_id": "bust", "camera_action_id": "fixed", "duration_sec": 4 },
  { "scene_description": "コーヒーカップと窓際の風景", "subject_type_id": "item", "shot_size_id": "bust", "camera_action_id": "pan_right", "duration_sec": 2 }
]`;
}

const TONE_MAP: Record<string, string> = {
  cinematic: 'エモい（シネマティック）',
  pop: 'ポップ',
  chill: 'チル（ゆったり）',
};

const CATEGORY_MAP: Record<string, string> = {
  travel: '旅行',
  cafe: 'カフェ',
  daily: '日常',
  event: 'イベント',
  food: 'グルメ',
  nature: '自然',
  city: '街歩き',
  shopping: '買い物',
};

const COMPANION_MAP: Record<string, string> = {
  solo: '1人',
  friend: '友達',
  partner: '恋人',
  family: '家族',
};

export function buildUserPrompt(form: InputFormData): string {
  const orientation = form.orientation === '9:16' ? '縦(9:16)' : '横(16:9)';
  const category = CATEGORY_MAP[form.category] || form.category;
  const companion = COMPANION_MAP[form.companion] || form.companion;
  const tone = TONE_MAP[form.tone] || form.tone;
  const memo = form.memo ? `, メモ: ${form.memo}` : '';

  return `向き: ${orientation}, 長さ: ${form.duration}秒, カテゴリ: ${category}, 誰と: ${companion}, トーン: ${tone}${memo}`;
}

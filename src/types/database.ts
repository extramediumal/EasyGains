export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'sports' | 'other';
export type TriggerType = 'meal_prompt' | 'no_log_reminder' | 'encouragement' | 'weekly_summary';
export type ToneType = 'funny' | 'motivational' | 'chill' | 'sarcastic';
export type PersonalityTier = 'helpful' | 'unhinged';
export type NotificationLevel = 1 | 2 | 3 | 4 | 5;
export type TipCategory = 'protein' | 'nutrition' | 'supplements' | 'training' | 'recovery' | 'sleep' | 'mindset' | 'myth_busting' | 'hormones' | 'longevity' | 'mobility' | 'cardio' | 'hydration' | 'gut_health' | 'brain_health';
export type TipSource = 'mind_pump' | 'rhonda_patrick' | 'andy_galpin' | 'huberman';

export interface Profile {
  id: string;
  desired_weight_lbs: number;
  calorie_target: number;
  activity_target: number;
  notification_level: NotificationLevel;
  personality_tier: PersonalityTier;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  logged_at: string;
  meal_type: MealType;
  raw_input: string | null;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  created_at: string;
  updated_at: string;
}

export interface MealItem {
  id: string;
  meal_id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Workout {
  id: string;
  user_id: string;
  logged_at: string;
  workout_type: WorkoutType;
  raw_input: string | null;
  total_effort_score: number;
  total_duration_min: number;
  total_calories_burned: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  name: string;
  detail: string;
  duration_min: number;
  calories_burned: number;
  effort_score: number;
}

export interface NotificationSetting {
  id: string;
  user_id: string;
  meal_type: MealType;
  prompt_time: string;
  enabled: boolean;
}

export interface NotificationTemplate {
  id: string;
  trigger_type: TriggerType;
  tone: ToneType;
  message_title: string;
  message_body: string;
  meal_type: MealType | null;
  personality_tier: PersonalityTier;
  active: boolean;
}

export interface NotificationTip {
  id: string;
  category: TipCategory;
  source: TipSource;
  message_title: string;
  message_body: string;
  active: boolean;
}

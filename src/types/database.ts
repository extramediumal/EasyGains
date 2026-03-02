export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type TriggerType = 'meal_prompt' | 'no_log_reminder' | 'encouragement' | 'weekly_summary';
export type ToneType = 'funny' | 'motivational' | 'chill' | 'sarcastic';

export interface Profile {
  id: string;
  desired_weight_lbs: number;
  calorie_target: number;
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
  active: boolean;
}

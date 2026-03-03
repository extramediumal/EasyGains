-- Add activity target to profiles
ALTER TABLE profiles ADD COLUMN activity_target NUMERIC NOT NULL DEFAULT 5;

-- Workouts table (mirrors meals)
CREATE TYPE workout_type AS ENUM ('strength', 'cardio', 'flexibility', 'sports', 'other');

CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  workout_type workout_type NOT NULL,
  raw_input TEXT,
  total_effort_score NUMERIC NOT NULL DEFAULT 0,
  total_duration_min NUMERIC NOT NULL DEFAULT 0,
  total_calories_burned NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own workouts" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON workouts FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_workouts_user_logged ON workouts(user_id, logged_at DESC);

-- Workout exercises table (mirrors meal_items)
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  detail TEXT NOT NULL,
  duration_min NUMERIC NOT NULL DEFAULT 0,
  calories_burned NUMERIC NOT NULL DEFAULT 0,
  effort_score NUMERIC NOT NULL DEFAULT 0
);

ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own workout exercises" ON workout_exercises FOR SELECT
  USING (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY "Users can insert own workout exercises" ON workout_exercises FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY "Users can update own workout exercises" ON workout_exercises FOR UPDATE
  USING (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY "Users can delete own workout exercises" ON workout_exercises FOR DELETE
  USING (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid()));

-- Reuse existing updated_at trigger
CREATE TRIGGER workouts_updated_at BEFORE UPDATE ON workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

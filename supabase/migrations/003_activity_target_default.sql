-- Change default activity target from 5 to 4 (based on research: weekly avg of training + rest days = ~4.1)
ALTER TABLE profiles ALTER COLUMN activity_target SET DEFAULT 4;

-- Update existing users who still have the old default of 5
UPDATE profiles SET activity_target = 4 WHERE activity_target = 5;

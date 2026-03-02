INSERT INTO notification_templates (trigger_type, tone, message_title, message_body, meal_type) VALUES
-- Meal prompts: breakfast
('meal_prompt', 'funny', 'Rise and grind', 'Your muscles woke up hungry. Feed them.', 'breakfast'),
('meal_prompt', 'chill', 'Morning', 'What did you have for breakfast?', 'breakfast'),
('meal_prompt', 'motivational', 'Fuel up', 'Champions eat breakfast. What''s on the plate?', 'breakfast'),
-- Meal prompts: lunch
('meal_prompt', 'funny', 'Bro... did you eat?', 'Your muscles are literally begging for protein right now.', 'lunch'),
('meal_prompt', 'chill', 'Lunch check', 'What''s for lunch today?', 'lunch'),
('meal_prompt', 'sarcastic', 'Hello?', 'It''s lunch time. Or are we doing the "I forgot to eat" thing again?', 'lunch'),
-- Meal prompts: dinner
('meal_prompt', 'funny', 'Dinner time', 'Your protein target is staring at you. Stare back. Then eat.', 'dinner'),
('meal_prompt', 'chill', 'Evening', 'What did you have for dinner?', 'dinner'),
('meal_prompt', 'motivational', 'Last call', 'One more meal to hit your protein. You got this.', 'dinner'),
-- No-log reminders
('no_log_reminder', 'sarcastic', 'So...', 'We''re just pretending dinner didn''t happen?', NULL),
('no_log_reminder', 'funny', 'Tap tap tap', 'Is this thing on? Haven''t heard from you today.', NULL),
('no_log_reminder', 'chill', 'Quick check-in', 'You haven''t logged anything today. Want to catch up?', NULL),
-- Encouragement
('encouragement', 'motivational', 'Nice work', 'You''ve hit your protein 5 of 7 days this week. Solid.', NULL),
('encouragement', 'chill', 'Consistency', 'Another day logged. That''s how it''s done.', NULL),
('encouragement', 'funny', 'Gains incoming', 'Your muscles just sent a thank you card.', NULL),
-- Weekly summary
('weekly_summary', 'chill', 'Week in review', 'Here''s how your week went. Tap to see the breakdown.', NULL),
('weekly_summary', 'motivational', 'Weekly report', 'Another week in the books. Let''s see those numbers.', NULL);

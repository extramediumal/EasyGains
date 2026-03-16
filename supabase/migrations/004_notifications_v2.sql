-- Add notification_level and personality_tier to profiles
ALTER TABLE profiles
  ADD COLUMN notification_level INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN personality_tier TEXT NOT NULL DEFAULT 'helpful';

-- Add check constraints
ALTER TABLE profiles
  ADD CONSTRAINT chk_notification_level CHECK (notification_level BETWEEN 1 AND 5),
  ADD CONSTRAINT chk_personality_tier CHECK (personality_tier IN ('helpful', 'unhinged'));

-- Add personality_tier to notification_templates
ALTER TABLE notification_templates
  ADD COLUMN personality_tier TEXT NOT NULL DEFAULT 'helpful';

-- Notification tips table (proactive coaching library)
CREATE TABLE notification_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  source TEXT NOT NULL,
  message_title TEXT NOT NULL,
  message_body TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE notification_tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active tips" ON notification_tips FOR SELECT USING (active = TRUE);

CREATE INDEX idx_notification_tips_category ON notification_tips(category);
CREATE INDEX idx_notification_tips_source ON notification_tips(source);

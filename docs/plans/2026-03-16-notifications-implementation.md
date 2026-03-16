# Notification System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a two-tier notification system (Helpful Trainer + Coach AL Unhinged) with a single frequency slider and on-app-open reactive nudges.

**Architecture:** New DB migration adds `notification_level` and `personality_tier` to profiles, a `notification_tips` table for the 226-tip coaching library, and `personality_tier` column on existing templates. A `NotificationEngine` module reads user profile + recent logs on app open and determines which notifications to schedule. Settings UI replaces per-meal toggles with a single slider + personality unlock flow.

**Tech Stack:** React Native (Expo), Supabase (Postgres), expo-notifications, Claude Haiku (edge function for AI roasts)

**Design docs:**
- `docs/plans/2026-03-16-notifications-design.md`
- `docs/plans/2026-03-16-coach-al-voice-guide.md`
- `docs/research/notification-tips-research.md`

---

## Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/003_notifications_v2.sql`

**Step 1: Write the migration**

```sql
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
```

**Step 2: Verify migration syntax**

Run: `cat supabase/migrations/003_notifications_v2.sql` (visual review)
Expected: Valid SQL, no syntax errors

**Step 3: Commit**

```bash
git add supabase/migrations/003_notifications_v2.sql
git commit -m "feat: add notifications v2 migration — slider level, personality tier, tips table"
```

---

## Task 2: Update TypeScript Types

**Files:**
- Modify: `src/types/database.ts`

**Step 1: Update Profile interface and add new types**

Add to `src/types/database.ts`:

```typescript
// Add to existing ToneType — or keep as-is since we use personality_tier separately
export type PersonalityTier = 'helpful' | 'unhinged';
export type NotificationLevel = 1 | 2 | 3 | 4 | 5;
export type TipCategory = 'protein' | 'nutrition' | 'supplements' | 'training' | 'recovery' | 'sleep' | 'mindset' | 'myth_busting' | 'hormones' | 'longevity' | 'mobility' | 'cardio' | 'hydration' | 'gut_health' | 'brain_health';
export type TipSource = 'mind_pump' | 'rhonda_patrick' | 'andy_galpin' | 'huberman';
```

Update `Profile` interface:
```typescript
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
```

Add `NotificationTip` interface:
```typescript
export interface NotificationTip {
  id: string;
  category: TipCategory;
  source: TipSource;
  message_title: string;
  message_body: string;
  active: boolean;
}
```

Update `NotificationTemplate` interface:
```typescript
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
```

**Step 2: Commit**

```bash
git add src/types/database.ts
git commit -m "feat: update types for notification v2 — personality tier, tips, slider level"
```

---

## Task 3: Notification Engine — Core Logic

**Files:**
- Create: `src/lib/notificationEngine.ts`
- Create: `__tests__/lib/notificationEngine.test.ts`

**Step 1: Write failing tests**

```typescript
// __tests__/lib/notificationEngine.test.ts
import {
  getMaxNotifications,
  shouldSendReactiveNudge,
  pickRandomTip,
  buildNotificationPlan,
} from '../../src/lib/notificationEngine';

describe('getMaxNotifications', () => {
  it('returns 0 for level 1 (Ghost)', () => {
    expect(getMaxNotifications(1)).toBe(0);
  });
  it('returns 1 for level 2 (Chill)', () => {
    expect(getMaxNotifications(2)).toBe(1);
  });
  it('returns 2 for level 3 (Balanced)', () => {
    expect(getMaxNotifications(3)).toBe(2);
  });
  it('returns 4 for level 4 (Coached)', () => {
    expect(getMaxNotifications(4)).toBe(4);
  });
  it('returns 5 for level 5 (Spam Me)', () => {
    expect(getMaxNotifications(5)).toBe(5);
  });
});

describe('shouldSendReactiveNudge', () => {
  it('returns true when meal window passed and no meal logged', () => {
    const now = new Date('2026-03-16T13:00:00');
    const mealWindows = [
      { type: 'breakfast', hour: 8 },
      { type: 'lunch', hour: 12 },
    ];
    const loggedMealTypes = ['breakfast'];
    expect(shouldSendReactiveNudge(now, mealWindows, loggedMealTypes)).toEqual(
      [{ type: 'lunch', hour: 12 }]
    );
  });

  it('returns empty when all meals logged', () => {
    const now = new Date('2026-03-16T13:00:00');
    const mealWindows = [
      { type: 'breakfast', hour: 8 },
      { type: 'lunch', hour: 12 },
    ];
    const loggedMealTypes = ['breakfast', 'lunch'];
    expect(shouldSendReactiveNudge(now, mealWindows, loggedMealTypes)).toEqual([]);
  });

  it('ignores future meal windows', () => {
    const now = new Date('2026-03-16T10:00:00');
    const mealWindows = [
      { type: 'breakfast', hour: 8 },
      { type: 'lunch', hour: 12 },
    ];
    const loggedMealTypes = [];
    expect(shouldSendReactiveNudge(now, mealWindows, loggedMealTypes)).toEqual(
      [{ type: 'breakfast', hour: 8 }]
    );
  });
});

describe('pickRandomTip', () => {
  it('picks a tip from the provided array', () => {
    const tips = [
      { id: '1', message_title: 'Tip 1', message_body: 'Body 1' },
      { id: '2', message_title: 'Tip 2', message_body: 'Body 2' },
    ];
    const result = pickRandomTip(tips as any);
    expect(tips.map(t => t.id)).toContain(result.id);
  });

  it('returns null for empty array', () => {
    expect(pickRandomTip([])).toBeNull();
  });
});

describe('buildNotificationPlan', () => {
  it('returns empty plan for level 1', () => {
    const plan = buildNotificationPlan({
      level: 1,
      missedMeals: [{ type: 'lunch', hour: 12 }],
      tips: [],
      daysSinceWorkout: 0,
      weeklyProteinPct: 90,
    });
    expect(plan).toEqual([]);
  });

  it('prioritizes reactive nudges over tips', () => {
    const plan = buildNotificationPlan({
      level: 2, // max 1
      missedMeals: [{ type: 'lunch', hour: 12 }],
      tips: [{ id: '1', message_title: 'Tip', message_body: 'Body' }] as any,
      daysSinceWorkout: 0,
      weeklyProteinPct: 90,
    });
    expect(plan.length).toBe(1);
    expect(plan[0].type).toBe('reactive');
  });

  it('fills remaining slots with tips', () => {
    const plan = buildNotificationPlan({
      level: 3, // max 2
      missedMeals: [{ type: 'lunch', hour: 12 }],
      tips: [{ id: '1', message_title: 'Tip', message_body: 'Body' }] as any,
      daysSinceWorkout: 0,
      weeklyProteinPct: 90,
    });
    expect(plan.length).toBe(2);
    expect(plan[0].type).toBe('reactive');
    expect(plan[1].type).toBe('tip');
  });

  it('adds workout nudge when 3+ days since last workout', () => {
    const plan = buildNotificationPlan({
      level: 3,
      missedMeals: [],
      tips: [{ id: '1', message_title: 'Tip', message_body: 'Body' }] as any,
      daysSinceWorkout: 4,
      weeklyProteinPct: 90,
    });
    expect(plan.some(n => n.type === 'reactive' && n.trigger === 'no_workout')).toBe(true);
  });

  it('adds protein nudge when weekly protein below 75%', () => {
    const plan = buildNotificationPlan({
      level: 4,
      missedMeals: [],
      tips: [],
      daysSinceWorkout: 0,
      weeklyProteinPct: 60,
    });
    expect(plan.some(n => n.type === 'reactive' && n.trigger === 'low_protein')).toBe(true);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx jest __tests__/lib/notificationEngine.test.ts --no-coverage`
Expected: FAIL — module not found

**Step 3: Write the implementation**

```typescript
// src/lib/notificationEngine.ts
import { NotificationTip, NotificationLevel } from '../types/database';

interface MealWindow {
  type: string;
  hour: number;
}

interface PlannedNotification {
  type: 'reactive' | 'tip';
  trigger?: 'missed_meal' | 'no_workout' | 'low_protein' | 'streak';
  mealType?: string;
  title: string;
  body: string;
  hour: number;
  minute: number;
}

interface NotificationPlanInput {
  level: NotificationLevel;
  missedMeals: MealWindow[];
  tips: NotificationTip[];
  daysSinceWorkout: number;
  weeklyProteinPct: number;
}

const LEVEL_MAX: Record<number, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 4,
  5: 5,
};

export function getMaxNotifications(level: NotificationLevel): number {
  return LEVEL_MAX[level] ?? 0;
}

export function shouldSendReactiveNudge(
  now: Date,
  mealWindows: MealWindow[],
  loggedMealTypes: string[],
): MealWindow[] {
  const currentHour = now.getHours();
  return mealWindows.filter(
    (w) => w.hour <= currentHour && !loggedMealTypes.includes(w.type),
  );
}

export function pickRandomTip(tips: NotificationTip[]): NotificationTip | null {
  if (tips.length === 0) return null;
  return tips[Math.floor(Math.random() * tips.length)];
}

export function buildNotificationPlan(input: NotificationPlanInput): PlannedNotification[] {
  const max = getMaxNotifications(input.level);
  if (max === 0) return [];

  const plan: PlannedNotification[] = [];

  // Priority 1: Missed meal nudges
  for (const meal of input.missedMeals) {
    if (plan.length >= max) break;
    plan.push({
      type: 'reactive',
      trigger: 'missed_meal',
      mealType: meal.type,
      title: 'EasyGains',
      body: `Hey, no ${meal.type} logged — did you eat?`,
      hour: meal.hour + 1,
      minute: 30,
    });
  }

  // Priority 2: Workout nudge (3+ days)
  if (input.daysSinceWorkout >= 3 && plan.length < max) {
    plan.push({
      type: 'reactive',
      trigger: 'no_workout',
      title: 'EasyGains',
      body: "You gonna move today? Even a walk counts.",
      hour: 17,
      minute: 0,
    });
  }

  // Priority 3: Low protein nudge (<75% weekly)
  if (input.weeklyProteinPct < 75 && plan.length < max) {
    plan.push({
      type: 'reactive',
      trigger: 'low_protein',
      title: 'EasyGains',
      body: "You're behind on protein this week — maybe grab a shake?",
      hour: 15,
      minute: 0,
    });
  }

  // Fill remaining slots with tips
  const shuffled = [...input.tips].sort(() => Math.random() - 0.5);
  let tipIndex = 0;
  const tipHours = [10, 14, 16, 19, 20];
  let tipHourIndex = 0;
  while (plan.length < max && tipIndex < shuffled.length) {
    const tip = shuffled[tipIndex++];
    plan.push({
      type: 'tip',
      title: tip.message_title,
      body: tip.message_body,
      hour: tipHours[tipHourIndex++ % tipHours.length],
      minute: 0,
    });
  }

  return plan;
}
```

**Step 4: Run tests to verify they pass**

Run: `npx jest __tests__/lib/notificationEngine.test.ts --no-coverage`
Expected: All PASS

**Step 5: Commit**

```bash
git add src/lib/notificationEngine.ts __tests__/lib/notificationEngine.test.ts
git commit -m "feat: notification engine — plan builder with slider levels, reactive nudges, tips"
```

---

## Task 4: Unhinged Gating Logic

**Files:**
- Create: `src/lib/unhingedGating.ts`
- Create: `__tests__/lib/unhingedGating.test.ts`

**Step 1: Write failing tests**

```typescript
// __tests__/lib/unhingedGating.test.ts
import {
  checkSubmissionCount,
  UNHINGED_THRESHOLD,
  PROTECTOR_QUESTIONS,
  validateProtectorAnswers,
  validatePassphrase,
  DENIAL_MESSAGES,
} from '../../src/lib/unhingedGating';

describe('checkSubmissionCount', () => {
  it('returns false below threshold', () => {
    expect(checkSubmissionCount(99)).toBe(false);
  });
  it('returns true at threshold', () => {
    expect(checkSubmissionCount(100)).toBe(true);
  });
  it('returns true above threshold', () => {
    expect(checkSubmissionCount(250)).toBe(true);
  });
});

describe('validateProtectorAnswers', () => {
  it('returns true when all answers are correct', () => {
    const answers = PROTECTOR_QUESTIONS.map((q) => q.correctAnswer);
    expect(validateProtectorAnswers(answers)).toBe(true);
  });
  it('returns false when any answer is wrong', () => {
    const answers = PROTECTOR_QUESTIONS.map((q) => q.correctAnswer);
    answers[0] = 'wrong';
    expect(validateProtectorAnswers(answers)).toBe(false);
  });
});

describe('validatePassphrase', () => {
  it('returns true for correct passphrase (case insensitive)', () => {
    expect(validatePassphrase('GAINS OVER FEELINGS')).toBe(true);
    expect(validatePassphrase('gains over feelings')).toBe(true);
  });
  it('returns false for wrong passphrase', () => {
    expect(validatePassphrase('hello world')).toBe(false);
  });
});

describe('DENIAL_MESSAGES', () => {
  it('has at least 3 messages', () => {
    expect(DENIAL_MESSAGES.length).toBeGreaterThanOrEqual(3);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx jest __tests__/lib/unhingedGating.test.ts --no-coverage`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/lib/unhingedGating.ts
export const UNHINGED_THRESHOLD = 100;

export const PASSPHRASE = 'gains over feelings';

export interface ProtectorQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const PROTECTOR_QUESTIONS: ProtectorQuestion[] = [
  {
    question: 'Do you hate yourself?',
    options: ['Yes, absolutely', 'No, I love myself'],
    correctAnswer: 'Yes, absolutely',
  },
  {
    question: "If someone says 'fuck you,' do you get offended?",
    options: ['Yes, that\'s rude', 'Nah, I can take it'],
    correctAnswer: 'Nah, I can take it',
  },
  {
    question: 'Can you handle being roasted about your food choices?',
    options: ['Bring it on', 'I\'d rather not'],
    correctAnswer: 'Bring it on',
  },
];

export const DENIAL_MESSAGES = [
  'You are not ready, young grasshopper.',
  'You must prove yourself.',
  'Come back when you\'ve toughened up.',
  'The unhinged path is not for the faint of heart.',
  'Maybe try a meditation app instead.',
];

export function checkSubmissionCount(count: number): boolean {
  return count >= UNHINGED_THRESHOLD;
}

export function validateProtectorAnswers(answers: string[]): boolean {
  if (answers.length !== PROTECTOR_QUESTIONS.length) return false;
  return PROTECTOR_QUESTIONS.every((q, i) => answers[i] === q.correctAnswer);
}

export function validatePassphrase(input: string): boolean {
  return input.toLowerCase().trim() === PASSPHRASE;
}

export function getRandomDenialMessage(): string {
  return DENIAL_MESSAGES[Math.floor(Math.random() * DENIAL_MESSAGES.length)];
}
```

**Step 4: Run tests to verify they pass**

Run: `npx jest __tests__/lib/unhingedGating.test.ts --no-coverage`
Expected: All PASS

**Step 5: Commit**

```bash
git add src/lib/unhingedGating.ts __tests__/lib/unhingedGating.test.ts
git commit -m "feat: unhinged gating — submission threshold, protector questions, passphrase"
```

---

## Task 5: Notification Slider Component

**Files:**
- Create: `src/components/NotificationSlider.tsx`
- Create: `__tests__/components/NotificationSlider.test.tsx`

**Step 1: Write failing test**

```typescript
// __tests__/components/NotificationSlider.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NotificationSlider } from '../../src/components/NotificationSlider';

describe('NotificationSlider', () => {
  it('renders with current level', () => {
    const { getByTestId } = render(
      <NotificationSlider level={3} onLevelChange={() => {}} />,
    );
    expect(getByTestId('notification-slider')).toBeTruthy();
  });

  it('displays endpoint labels', () => {
    const { getByText } = render(
      <NotificationSlider level={3} onLevelChange={() => {}} />,
    );
    expect(getByText('🔕')).toBeTruthy();
    expect(getByText('📣')).toBeTruthy();
  });

  it('shows level indicator dots', () => {
    const { getAllByTestId } = render(
      <NotificationSlider level={3} onLevelChange={() => {}} />,
    );
    const dots = getAllByTestId(/slider-dot/);
    expect(dots.length).toBe(5);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/components/NotificationSlider.test.tsx --no-coverage`
Expected: FAIL

**Step 3: Write the component**

```typescript
// src/components/NotificationSlider.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radii } from '../lib/theme';
import { NotificationLevel } from '../types/database';

interface NotificationSliderProps {
  level: NotificationLevel;
  onLevelChange: (level: NotificationLevel) => void;
}

const LEVELS: NotificationLevel[] = [1, 2, 3, 4, 5];

export function NotificationSlider({ level, onLevelChange }: NotificationSliderProps) {
  return (
    <View testID="notification-slider" style={styles.container}>
      <Text style={styles.endpoint}>🔕</Text>
      <View style={styles.track}>
        {LEVELS.map((l) => (
          <TouchableOpacity
            key={l}
            testID={`slider-dot-${l}`}
            style={[
              styles.dot,
              l <= level ? styles.dotActive : styles.dotInactive,
            ]}
            onPress={() => onLevelChange(l)}
          />
        ))}
      </View>
      <Text style={styles.endpoint}>📣</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  endpoint: {
    fontSize: 20,
  },
  track: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
    height: 40,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    backgroundColor: Colors.chipBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npx jest __tests__/components/NotificationSlider.test.tsx --no-coverage`
Expected: All PASS

**Step 5: Commit**

```bash
git add src/components/NotificationSlider.tsx __tests__/components/NotificationSlider.test.tsx
git commit -m "feat: NotificationSlider component — 5-dot tap selector with endpoints"
```

---

## Task 6: Unhinged Protector Flow Component

**Files:**
- Create: `src/components/UnhingedGate.tsx`

**Step 1: Write the component**

```typescript
// src/components/UnhingedGate.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { Button } from './Button';
import { Colors, Radii, Spacing } from '../lib/theme';
import {
  PROTECTOR_QUESTIONS,
  validateProtectorAnswers,
  validatePassphrase,
  getRandomDenialMessage,
} from '../lib/unhingedGating';

interface UnhingedGateProps {
  visible: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

type Stage = 'protector' | 'passphrase' | 'denied' | 'unlocked';

export function UnhingedGate({ visible, onClose, onUnlocked }: UnhingedGateProps) {
  const [stage, setStage] = useState<Stage>('protector');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [passphrase, setPassphrase] = useState('');
  const [denialMessage, setDenialMessage] = useState('');

  function reset() {
    setStage('protector');
    setQuestionIndex(0);
    setAnswers([]);
    setPassphrase('');
    setDenialMessage('');
  }

  function handleAnswer(answer: string) {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (questionIndex < PROTECTOR_QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      if (validateProtectorAnswers(newAnswers)) {
        setStage('passphrase');
      } else {
        setDenialMessage(getRandomDenialMessage());
        setStage('denied');
      }
    }
  }

  function handlePassphrase() {
    if (validatePassphrase(passphrase)) {
      setStage('unlocked');
      onUnlocked();
    } else {
      setDenialMessage(getRandomDenialMessage());
      setStage('denied');
    }
  }

  function handleClose() {
    reset();
    onClose();
  }

  const question = PROTECTOR_QUESTIONS[questionIndex];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {stage === 'protector' && question && (
            <>
              <Text style={styles.title}>⚠️ Warning</Text>
              <Text style={styles.question}>{question.question}</Text>
              {question.options.map((opt) => (
                <View key={opt} style={styles.optionContainer}>
                  <Button
                    title={opt}
                    variant="secondary"
                    onPress={() => handleAnswer(opt)}
                  />
                </View>
              ))}
            </>
          )}

          {stage === 'passphrase' && (
            <>
              <Text style={styles.title}>🔐 Final Step</Text>
              <Text style={styles.question}>Enter the passphrase.</Text>
              <TextInput
                style={styles.input}
                value={passphrase}
                onChangeText={setPassphrase}
                placeholder="Type it here..."
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Button title="Submit" onPress={handlePassphrase} />
            </>
          )}

          {stage === 'denied' && (
            <>
              <Text style={styles.title}>❌</Text>
              <Text style={styles.denial}>{denialMessage}</Text>
              <Button title="OK" variant="ghost" onPress={handleClose} />
            </>
          )}

          {stage === 'unlocked' && (
            <>
              <Text style={styles.title}>🔓</Text>
              <Text style={styles.denial}>Coach AL has entered the chat.</Text>
              <Button title="Let's go" onPress={handleClose} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.screenPadding,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    padding: Spacing.cardPadding * 1.5,
    width: '100%',
    maxWidth: 360,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: Radii.input,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  denial: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: Colors.textSecondary,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/UnhingedGate.tsx
git commit -m "feat: UnhingedGate modal — protector questions, passphrase, denial messages"
```

---

## Task 7: Update useProfile Hook

**Files:**
- Modify: `src/hooks/useProfile.ts`

**Step 1: Add notification-related update methods**

The existing `useProfile` hook only reads. Add methods to update `notification_level` and `personality_tier`:

```typescript
// Add to useProfile return:
async function updateNotificationLevel(level: NotificationLevel) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from('profiles')
    .update({ notification_level: level })
    .eq('id', user.id);
  await refetch();
}

async function updatePersonalityTier(tier: PersonalityTier) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from('profiles')
    .update({ personality_tier: tier })
    .eq('id', user.id);
  await refetch();
}
```

Add imports for `NotificationLevel` and `PersonalityTier` from types.

Update return: `{ profile, loading, refetch, updateNotificationLevel, updatePersonalityTier }`

**Step 2: Commit**

```bash
git add src/hooks/useProfile.ts
git commit -m "feat: useProfile — add updateNotificationLevel and updatePersonalityTier"
```

---

## Task 8: Submission Count Hook

**Files:**
- Create: `src/hooks/useSubmissionCount.ts`

**Step 1: Write the hook**

```typescript
// src/hooks/useSubmissionCount.ts
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useSubmissionCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ count: mealCount }, { count: workoutCount }] = await Promise.all([
      supabase
        .from('meals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
      supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ]);

    setCount((mealCount || 0) + (workoutCount || 0));
    setLoading(false);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { count, loading, refetch };
}
```

**Step 2: Commit**

```bash
git add src/hooks/useSubmissionCount.ts
git commit -m "feat: useSubmissionCount hook — total meals + workouts for unhinged gating"
```

---

## Task 9: Update Settings Screen

**Files:**
- Modify: `app/(app)/(tabs)/settings.tsx`

**Step 1: Replace Reminders section with new notification UI**

Replace the existing `Reminders` section (lines 112-130) with:
- Notification slider (level 1-5)
- Teaser text for unhinged ("More notification styles unlock as you use the app...")
- Personality toggle (only visible at 100+ submissions)
- UnhingedGate modal trigger

The full settings screen should import and use:
- `NotificationSlider` component
- `UnhingedGate` component
- `useSubmissionCount` hook
- `checkSubmissionCount` from `unhingedGating`
- `updateNotificationLevel` and `updatePersonalityTier` from `useProfile`

Replace the Reminders section with:

```tsx
<Text style={styles.sectionTitle}>Notifications</Text>

<NotificationSlider
  level={profile?.notification_level ?? 3}
  onLevelChange={(level) => updateNotificationLevel(level)}
/>

{!showUnhinged && (
  <Text style={styles.teaser}>More notification styles unlock as you use the app...</Text>
)}

{showUnhinged && (
  <View style={styles.personalityRow}>
    <Text style={styles.notifLabel}>
      Mode: {profile?.personality_tier === 'unhinged' ? '🔥 Coach AL' : '💪 Helpful Trainer'}
    </Text>
    {profile?.personality_tier !== 'unhinged' ? (
      <Button
        title="Unlock"
        variant="ghost"
        onPress={() => setGateVisible(true)}
      />
    ) : (
      <Button
        title="Switch to Helpful"
        variant="ghost"
        onPress={() => updatePersonalityTier('helpful')}
      />
    )}
  </View>
)}

<UnhingedGate
  visible={gateVisible}
  onClose={() => setGateVisible(false)}
  onUnlocked={() => {
    updatePersonalityTier('unhinged');
    setGateVisible(false);
  }}
/>
```

Add state and computed values:
```tsx
const { count: submissionCount } = useSubmissionCount();
const [gateVisible, setGateVisible] = useState(false);
const showUnhinged = checkSubmissionCount(submissionCount);
```

Add `teaser` style:
```typescript
teaser: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic', marginTop: 4, marginBottom: 16 },
personalityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
```

**Step 2: Commit**

```bash
git add app/(app)/(tabs)/settings.tsx
git commit -m "feat: settings — notification slider, personality toggle, unhinged gate, teaser text"
```

---

## Task 10: On-App-Open Notification Check

**Files:**
- Create: `src/hooks/useNotificationCheck.ts`
- Modify: `app/(app)/(tabs)/index.tsx`

**Step 1: Write the hook**

```typescript
// src/hooks/useNotificationCheck.ts
import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, NotificationTip } from '../types/database';
import {
  shouldSendReactiveNudge,
  buildNotificationPlan,
} from '../lib/notificationEngine';
import { scheduleNotification, cancelAllNotifications } from '../lib/notifications';

const MEAL_WINDOWS = [
  { type: 'breakfast', hour: 9 },
  { type: 'lunch', hour: 13 },
  { type: 'dinner', hour: 19 },
];

export function useNotificationCheck(profile: Profile | null) {
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!profile || hasChecked.current) return;
    hasChecked.current = true;

    async function check() {
      if (profile!.notification_level === 1) {
        await cancelAllNotifications();
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      // Get today's logged meal types
      const { data: todayMeals } = await supabase
        .from('meals')
        .select('meal_type')
        .eq('user_id', user.id)
        .gte('logged_at', todayStart.toISOString());

      const loggedTypes = (todayMeals || []).map((m: any) => m.meal_type);

      // Get days since last workout
      const { data: lastWorkout } = await supabase
        .from('workouts')
        .select('logged_at')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(1);

      let daysSinceWorkout = 0;
      if (lastWorkout && lastWorkout.length > 0) {
        const lastDate = new Date(lastWorkout[0].logged_at);
        daysSinceWorkout = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );
      }

      // Get weekly protein percentage
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 7);
      const { data: weekMeals } = await supabase
        .from('meals')
        .select('total_protein')
        .eq('user_id', user.id)
        .gte('logged_at', weekStart.toISOString());

      const weeklyProtein = (weekMeals || []).reduce(
        (sum: number, m: any) => sum + (m.total_protein || 0), 0,
      );
      const weeklyProteinTarget = (profile!.desired_weight_lbs || 160) * 7;
      const weeklyProteinPct = weeklyProteinTarget > 0
        ? Math.round((weeklyProtein / weeklyProteinTarget) * 100)
        : 100;

      // Get random tips
      const { data: tips } = await supabase
        .from('notification_tips')
        .select('*')
        .eq('active', true)
        .limit(10);

      // Check missed meals
      const missedMeals = shouldSendReactiveNudge(now, MEAL_WINDOWS, loggedTypes);

      // Build plan
      const plan = buildNotificationPlan({
        level: profile!.notification_level as any,
        missedMeals,
        tips: tips || [],
        daysSinceWorkout,
        weeklyProteinPct,
      });

      // Cancel old and schedule new
      await cancelAllNotifications();
      for (const notification of plan) {
        await scheduleNotification({
          title: notification.title,
          body: notification.body,
          hour: notification.hour,
          minute: notification.minute,
        });
      }
    }

    check();
  }, [profile]);
}
```

**Step 2: Add hook to home screen**

In `app/(app)/(tabs)/index.tsx`, add after existing hooks:

```typescript
import { useNotificationCheck } from '../../../src/hooks/useNotificationCheck';

// Inside HomeScreen(), after useProfile:
useNotificationCheck(profile);
```

**Step 3: Commit**

```bash
git add src/hooks/useNotificationCheck.ts app/(app)/(tabs)/index.tsx
git commit -m "feat: on-app-open notification check — reactive nudges + scheduled tips"
```

---

## Task 11: Coach AL Reactive Templates

**Files:**
- Modify: `src/lib/notificationEngine.ts`

**Step 1: Add personality-aware message selection**

Add Coach AL versions of reactive messages to the notification engine:

```typescript
const REACTIVE_MESSAGES = {
  missed_meal: {
    helpful: [
      "Hey, no {meal} logged — did you eat?",
      "Don't forget to log your {meal}!",
      "Your {meal} is missing from today's log.",
    ],
    unhinged: [
      "No {meal}? Starving yourself isn't a diet strategy, genius.",
      "Did you forget to eat {meal} or forget to log it? Both are bad.",
      "Hello? {meal}? Anyone home?",
    ],
  },
  no_workout: {
    helpful: [
      "You gonna move today? Even a walk counts.",
      "Haven't seen a workout in a few days — how about some movement?",
      "Your body is made to move. Even 10 minutes helps.",
    ],
    unhinged: [
      "Your couch called. It said even IT is tired of you.",
      "Rest day #{days}. Impressive commitment to doing nothing.",
      "You haven't worked out since {lastDay}. Just saying.",
    ],
  },
  low_protein: {
    helpful: [
      "You're behind on protein this week — maybe grab a shake?",
      "Protein is running low this week. Time to catch up!",
    ],
    unhinged: [
      "Your muscles are literally eating themselves rn.",
      "Protein at {pct}% this week. That's not gonna build anything.",
    ],
  },
};
```

Update `buildNotificationPlan` to accept `personalityTier` and select messages accordingly.

**Step 2: Commit**

```bash
git add src/lib/notificationEngine.ts
git commit -m "feat: personality-aware reactive messages — helpful trainer + coach AL"
```

---

## Task 12: Coach AL AI Roast Edge Function

**Files:**
- Create: `supabase/functions/generate-roast/index.ts`

**Step 1: Write the edge function**

```typescript
// supabase/functions/generate-roast/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const COACH_AL_SYSTEM_PROMPT = `You are Coach AL, the creator of a fitness tracking app. You're roasting a user's food or workout choice.

Voice rules:
- Deadpan disappointment. Short and sharp. 1-2 sentences MAX.
- Tasteful cursing is fine (wtf, damn, hell, bro). Not gratuitous.
- You're a hypocrite about alcohol — you drink but still roast others.
- Roast the CHOICE, never the person's body, weight, appearance, or identity.
- Never reference eating disorders, body image, race, gender, sexuality.
- You can break the fourth wall — reference being an app, being "paid for."
- If the food is actually healthy, give a backhanded compliment: "Wow. Bare minimum. Nice."
- If it's alcohol, be self-aware: "Horrible for gains. ...I had three last night but that's not the point."

Examples of your voice:
- "Dominos? Should probably just uninstall now, bucko."
- "Cool. So we're just giving up then."
- "Literal poison. But you do you."
- "...was that so hard?"
- "A walk? That's not a workout, that's transportation."`;

Deno.serve(async (req: Request) => {
  try {
    const { text, type } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        system: COACH_AL_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `The user just logged: "${text}" (${type}). Give a Coach AL roast. One line only.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const roast = data.content?.[0]?.text || "I got nothing. That's how boring your food is.";

    return new Response(JSON.stringify({ roast }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ roast: "Even my roast generator gave up on you." }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }
});
```

**Step 2: Commit**

```bash
git add supabase/functions/generate-roast/index.ts
git commit -m "feat: generate-roast edge function — Coach AL AI roasts via Claude Haiku"
```

---

## Task 13: Seed Notification Tips

**Files:**
- Create: `supabase/seed-notification-tips.sql`

**Step 1: Create seed file**

Generate INSERT statements from the 226 tips in `docs/research/notification-tips-research.md`. Each tip becomes a row in `notification_tips` with:
- `category`: mapped from the tip's section (protein, supplements, training, etc.)
- `source`: 'mind_pump', 'rhonda_patrick', 'andy_galpin', or 'huberman'
- `message_title`: short title (source name or category)
- `message_body`: the notification text
- `active`: TRUE

This is a large seed file. Structure as:
```sql
INSERT INTO notification_tips (category, source, message_title, message_body) VALUES
('protein', 'mind_pump', 'Mind Pump', 'You don''t need 1g of protein per pound...'),
('supplements', 'mind_pump', 'Mind Pump', 'Creatine monohydrate. 3-5g a day...'),
-- ... all 226 tips
;
```

**Step 2: Commit**

```bash
git add supabase/seed-notification-tips.sql
git commit -m "feat: seed 226 research-backed notification tips from 4 sources"
```

---

## Task 14: Update Notification Hook

**Files:**
- Modify: `src/hooks/useNotificationSettings.ts`

**Step 1: Simplify to work with new slider system**

The current hook manages per-meal-type settings. Update it to work with the new `notification_level` on the profile instead. The old `notification_settings` table can remain for backward compatibility but the primary control is now the profile's `notification_level`.

Simplify `syncNotifications` to delegate to the notification engine rather than managing individual meal type schedules.

**Step 2: Commit**

```bash
git add src/hooks/useNotificationSettings.ts
git commit -m "refactor: simplify notification hook to use profile notification_level"
```

---

## Task 15: Integration Test — Full Flow

**Files:**
- Create: `__tests__/integration/notificationFlow.test.ts`

**Step 1: Write integration test**

```typescript
// __tests__/integration/notificationFlow.test.ts
import { getMaxNotifications, buildNotificationPlan } from '../../src/lib/notificationEngine';
import { checkSubmissionCount, validateProtectorAnswers, validatePassphrase, PROTECTOR_QUESTIONS } from '../../src/lib/unhingedGating';

describe('Notification System Integration', () => {
  describe('Ghost mode (level 1)', () => {
    it('produces zero notifications regardless of state', () => {
      const plan = buildNotificationPlan({
        level: 1,
        missedMeals: [{ type: 'breakfast', hour: 8 }, { type: 'lunch', hour: 12 }],
        tips: [{ id: '1', message_title: 'T', message_body: 'B' }] as any,
        daysSinceWorkout: 10,
        weeklyProteinPct: 20,
      });
      expect(plan).toEqual([]);
    });
  });

  describe('Spam Me mode (level 5)', () => {
    it('fills all 5 slots with mixed content', () => {
      const plan = buildNotificationPlan({
        level: 5,
        missedMeals: [{ type: 'breakfast', hour: 8 }],
        tips: Array.from({ length: 10 }, (_, i) => ({
          id: String(i),
          message_title: `Tip ${i}`,
          message_body: `Body ${i}`,
        })) as any,
        daysSinceWorkout: 5,
        weeklyProteinPct: 50,
      });
      expect(plan.length).toBe(5);
    });
  });

  describe('Unhinged unlock flow', () => {
    it('requires 100+ submissions', () => {
      expect(checkSubmissionCount(99)).toBe(false);
      expect(checkSubmissionCount(100)).toBe(true);
    });

    it('requires correct protector answers + passphrase', () => {
      const correctAnswers = PROTECTOR_QUESTIONS.map(q => q.correctAnswer);
      expect(validateProtectorAnswers(correctAnswers)).toBe(true);
      expect(validatePassphrase('gains over feelings')).toBe(true);
    });

    it('rejects wrong protector answers', () => {
      expect(validateProtectorAnswers(['wrong', 'wrong', 'wrong'])).toBe(false);
    });

    it('rejects wrong passphrase', () => {
      expect(validatePassphrase('let me in')).toBe(false);
    });
  });
});
```

**Step 2: Run all tests**

Run: `npx jest --no-coverage`
Expected: All PASS

**Step 3: Commit**

```bash
git add __tests__/integration/notificationFlow.test.ts
git commit -m "test: integration tests for notification system — all levels, unhinged gating"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | DB migration | `003_notifications_v2.sql` |
| 2 | TypeScript types | `database.ts` |
| 3 | Notification engine | `notificationEngine.ts` + tests |
| 4 | Unhinged gating logic | `unhingedGating.ts` + tests |
| 5 | Slider component | `NotificationSlider.tsx` + tests |
| 6 | Unhinged gate modal | `UnhingedGate.tsx` |
| 7 | Profile hook updates | `useProfile.ts` |
| 8 | Submission count hook | `useSubmissionCount.ts` |
| 9 | Settings screen | `settings.tsx` |
| 10 | On-app-open check | `useNotificationCheck.ts` + home screen |
| 11 | Coach AL templates | `notificationEngine.ts` |
| 12 | AI roast edge function | `generate-roast/index.ts` |
| 13 | Seed 226 tips | `seed-notification-tips.sql` |
| 14 | Simplify notification hook | `useNotificationSettings.ts` |
| 15 | Integration tests | `notificationFlow.test.ts` |

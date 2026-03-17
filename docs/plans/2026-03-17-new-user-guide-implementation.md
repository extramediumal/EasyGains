# New User Guide Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 5-popup new user guide that introduces the app during onboarding and on the home screen, then auto-navigates to Settings. Also update Settings helper text for clarity.

**Architecture:** A reusable `GuidePopup` component handles rendering (full-screen overlay or tooltip). A `useGuideState` hook tracks which step the user is on using AsyncStorage (persists across app restarts). The onboarding screen triggers popups 1-2 after saving, the home screen triggers popups 3-5 on first visit, and popup 5 auto-navigates to Settings.

**Tech Stack:** React Native, Expo Router, AsyncStorage (@react-native-async-storage/async-storage)

**Design doc:** `docs/plans/2026-03-17-new-user-guide-design.md`

---

## Task 1: Guide State Hook

**Files:**
- Create: `src/hooks/useGuideState.ts`
- Create: `__tests__/hooks/useGuideState.test.ts`

**Step 1: Write failing test**

```typescript
// __tests__/hooks/useGuideState.test.ts
import { renderHook, act } from '@testing-library/react-native';
import { useGuideState } from '../../src/hooks/useGuideState';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

describe('useGuideState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts at step 0 for new users', async () => {
    const { result } = renderHook(() => useGuideState());
    await act(async () => {});
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isGuideComplete).toBe(false);
  });

  it('advances to next step', async () => {
    const { result } = renderHook(() => useGuideState());
    await act(async () => {});
    await act(async () => { result.current.advanceStep(); });
    expect(result.current.currentStep).toBe(1);
  });

  it('marks guide complete after step 5', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
    const { result } = renderHook(() => useGuideState());
    await act(async () => {});
    expect(result.current.isGuideComplete).toBe(true);
  });

  it('persists step to AsyncStorage', async () => {
    const { result } = renderHook(() => useGuideState());
    await act(async () => {});
    await act(async () => { result.current.advanceStep(); });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('easygains_guide_step', '1');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/hooks/useGuideState.test.ts --no-coverage`
Expected: FAIL — module not found

**Step 3: Write implementation**

```typescript
// src/hooks/useGuideState.ts
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'easygains_guide_step';
const TOTAL_STEPS = 5;

export function useGuideState() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      setCurrentStep(stored ? parseInt(stored, 10) : 0);
      setLoading(false);
    }
    load();
  }, []);

  const advanceStep = useCallback(async () => {
    const next = currentStep + 1;
    setCurrentStep(next);
    await AsyncStorage.setItem(STORAGE_KEY, String(next));
  }, [currentStep]);

  const isGuideComplete = currentStep >= TOTAL_STEPS;

  return { currentStep, loading, isGuideComplete, advanceStep };
}
```

**Step 4: Run test to verify it passes**

Run: `npx jest __tests__/hooks/useGuideState.test.ts --no-coverage`
Expected: All PASS

**Step 5: Commit**

```bash
git add src/hooks/useGuideState.ts __tests__/hooks/useGuideState.test.ts
git commit -m "feat: useGuideState hook — tracks new user guide progress via AsyncStorage"
```

---

## Task 2: GuidePopup Component

**Files:**
- Create: `src/components/GuidePopup.tsx`
- Create: `__tests__/components/GuidePopup.test.tsx`

**Step 1: Write failing test**

```typescript
// __tests__/components/GuidePopup.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GuidePopup } from '../../src/components/GuidePopup';

describe('GuidePopup', () => {
  it('renders message and button', () => {
    const { getByText } = render(
      <GuidePopup
        visible={true}
        message="Welcome to EasyGains."
        buttonText="Got it"
        onDismiss={() => {}}
      />,
    );
    expect(getByText('Welcome to EasyGains.')).toBeTruthy();
    expect(getByText('Got it')).toBeTruthy();
  });

  it('calls onDismiss when button pressed', () => {
    const onDismiss = jest.fn();
    const { getByText } = render(
      <GuidePopup
        visible={true}
        message="Test"
        buttonText="Next"
        onDismiss={onDismiss}
      />,
    );
    fireEvent.press(getByText('Next'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <GuidePopup
        visible={false}
        message="Hidden"
        buttonText="OK"
        onDismiss={() => {}}
      />,
    );
    expect(queryByText('Hidden')).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/components/GuidePopup.test.tsx --no-coverage`
Expected: FAIL

**Step 3: Write component**

```typescript
// src/components/GuidePopup.tsx
import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { Button } from './Button';
import { Colors, Radii, Spacing } from '../lib/theme';

interface GuidePopupProps {
  visible: boolean;
  message: string;
  buttonText: string;
  onDismiss: () => void;
}

export function GuidePopup({ visible, message, buttonText, onDismiss }: GuidePopupProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.message}>{message}</Text>
          <Button title={buttonText} onPress={onDismiss} />
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
    padding: Spacing.cardPadding * 2,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
    color: Colors.textPrimary,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npx jest __tests__/components/GuidePopup.test.tsx --no-coverage`
Expected: All PASS

**Step 5: Commit**

```bash
git add src/components/GuidePopup.tsx __tests__/components/GuidePopup.test.tsx
git commit -m "feat: GuidePopup component — modal overlay for new user guide steps"
```

---

## Task 3: Guide Steps Config

**Files:**
- Create: `src/lib/guideSteps.ts`

**Step 1: Write the config**

```typescript
// src/lib/guideSteps.ts
export interface GuideStep {
  id: number;
  screen: 'onboarding' | 'home';
  message: string;
  buttonText: string;
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 0,
    screen: 'onboarding',
    message: "Welcome to EasyGains. Eat your protein, move your body, don't overthink the rest.",
    buttonText: 'Got it',
  },
  {
    id: 1,
    screen: 'onboarding',
    message: 'Just talk to us. Say what you ate or what workout you did. We figure out the rest.',
    buttonText: 'Cool',
  },
  {
    id: 2,
    screen: 'home',
    message: 'Tap the mic and say what you ate. That\'s it.',
    buttonText: 'Next',
  },
  {
    id: 3,
    screen: 'home',
    message: 'These rings fill up as you log your meals. Track your calories and macros at a glance.',
    buttonText: 'Next',
  },
  {
    id: 4,
    screen: 'home',
    message: 'Head to Settings to dial in your goals and ideal weight. Everything adjusts to you.',
    buttonText: 'Take me there',
  },
];
```

**Step 2: Commit**

```bash
git add src/lib/guideSteps.ts
git commit -m "feat: guide steps config — 5-step new user guide content"
```

---

## Task 4: Wire Guide into Onboarding Screen

**Files:**
- Modify: `app/(app)/onboarding.tsx`

**Step 1: Update onboarding**

Changes to make:
1. Import `useGuideState` from `../../src/hooks/useGuideState`
2. Import `GuidePopup` from `../../src/components/GuidePopup`
3. Import `GUIDE_STEPS` from `../../src/lib/guideSteps`
4. Add `const { currentStep, isGuideComplete, advanceStep } = useGuideState();`
5. Add state: `const [showGuide, setShowGuide] = useState(false);`
6. Modify `handleSave` — after the successful profile update, instead of immediately navigating, set `setShowGuide(true)`:

Replace:
```typescript
router.replace('/(app)/(tabs)');
```
With:
```typescript
setShowGuide(true);
```

7. Add a function to handle guide popup dismissal:
```typescript
async function handleGuideDismiss() {
  await advanceStep();
  // After step 1 (second onboarding popup), navigate to home
  if (currentStep >= 1) {
    router.replace('/(app)/(tabs)');
  }
}
```

8. Add GuidePopup at the bottom of the JSX (before closing `</View>`):

```tsx
{showGuide && !isGuideComplete && (
  <GuidePopup
    visible={currentStep <= 1}
    message={GUIDE_STEPS[currentStep]?.message || ''}
    buttonText={GUIDE_STEPS[currentStep]?.buttonText || 'Next'}
    onDismiss={handleGuideDismiss}
  />
)}
```

**Step 2: Commit**

```bash
git add app/(app)/onboarding.tsx
git commit -m "feat: wire guide popups 1-2 into onboarding — welcome + voice pitch"
```

---

## Task 5: Wire Guide into Home Screen

**Files:**
- Modify: `app/(app)/(tabs)/index.tsx`

**Step 1: Update home screen**

Changes to make:
1. Import `useGuideState` from `../../../src/hooks/useGuideState`
2. Import `GuidePopup` from `../../../src/components/GuidePopup`
3. Import `GUIDE_STEPS` from `../../../src/lib/guideSteps`
4. Import `router` from `expo-router` (already imported)
5. Add inside HomeScreen:
```typescript
const { currentStep, isGuideComplete, advanceStep } = useGuideState();
```

6. Add guide dismiss handler:
```typescript
async function handleGuideDismiss() {
  await advanceStep();
  // After step 4 (last popup), navigate to settings
  if (currentStep >= 4) {
    router.push('/(app)/(tabs)/settings');
  }
}
```

7. Add GuidePopup at the bottom of the JSX (before closing `</ScrollView>`):

```tsx
{!isGuideComplete && currentStep >= 2 && currentStep <= 4 && (
  <GuidePopup
    visible={true}
    message={GUIDE_STEPS[currentStep]?.message || ''}
    buttonText={GUIDE_STEPS[currentStep]?.buttonText || 'Next'}
    onDismiss={handleGuideDismiss}
  />
)}
```

**Step 2: Commit**

```bash
git add app/(app)/(tabs)/index.tsx
git commit -m "feat: wire guide popups 3-5 into home — mic, rings, settings redirect"
```

---

## Task 6: Update Settings Helper Text

**Files:**
- Modify: `app/(app)/(tabs)/settings.tsx`
- Modify: `app/(app)/onboarding.tsx`

**Step 1: Update settings.tsx hints**

Replace the hint below "Desired weight (lbs)" label (line 77):
```
Old: <Text style={styles.hint}>Protein target: {weight ? `${Math.round(parseFloat(weight))}g/day` : '—'}</Text>
New: <Text style={styles.hint}>Your goal weight. We use this to set your targets.</Text>
```

Replace the hint below "Daily calorie target" — add a hint line between the label (line 79) and the input (line 80):
```tsx
<Text style={styles.label}>Daily calorie target</Text>
<Text style={styles.hint}>We'll calculate this from your goal weight, or enter your own.</Text>
```

Replace the hint for "Daily effort target" (line 93):
```
Old: <Text style={styles.hint}>4 = avg across training + rest days. 6-7 = great workout days.</Text>
New: <Text style={styles.hint}>How hard you want to push this week, on a 1-10 scale. 4 = moderate, 7 = intense.</Text>
```

**Step 2: Update onboarding.tsx hints to match**

Replace the hint for desired weight (line 52):
```
Old: <Text style={styles.hint}>Your protein target will be 1g per pound</Text>
New: <Text style={styles.hint}>Your goal weight. We use this to set your targets.</Text>
```

Replace the hint for calorie target (line 63):
```
Old: <Text style={styles.hint}>A reasonable starting point for most people is 2000</Text>
New: <Text style={styles.hint}>We'll calculate this from your goal weight, or enter your own.</Text>
```

Replace the hint for effort target (line 78):
```
Old: <Text style={styles.hint}>4 = avg across training + rest days. 6-7 = great workout days.</Text>
New: <Text style={styles.hint}>How hard you want to push this week, on a 1-10 scale. 4 = moderate, 7 = intense.</Text>
```

**Step 3: Commit**

```bash
git add app/(app)/(tabs)/settings.tsx app/(app)/onboarding.tsx
git commit -m "feat: update settings and onboarding helper text — clear, simple, no jargon"
```

---

## Task 7: Integration Test

**Files:**
- Create: `__tests__/integration/newUserGuide.test.ts`

**Step 1: Write test**

```typescript
// __tests__/integration/newUserGuide.test.ts
import { GUIDE_STEPS } from '../../src/lib/guideSteps';

describe('New User Guide', () => {
  it('has exactly 5 steps', () => {
    expect(GUIDE_STEPS.length).toBe(5);
  });

  it('has 2 onboarding steps and 3 home steps', () => {
    const onboarding = GUIDE_STEPS.filter(s => s.screen === 'onboarding');
    const home = GUIDE_STEPS.filter(s => s.screen === 'home');
    expect(onboarding.length).toBe(2);
    expect(home.length).toBe(3);
  });

  it('steps are in sequential order', () => {
    GUIDE_STEPS.forEach((step, i) => {
      expect(step.id).toBe(i);
    });
  });

  it('onboarding steps come before home steps', () => {
    const lastOnboarding = Math.max(...GUIDE_STEPS.filter(s => s.screen === 'onboarding').map(s => s.id));
    const firstHome = Math.min(...GUIDE_STEPS.filter(s => s.screen === 'home').map(s => s.id));
    expect(lastOnboarding).toBeLessThan(firstHome);
  });

  it('last step button says "Take me there"', () => {
    const lastStep = GUIDE_STEPS[GUIDE_STEPS.length - 1];
    expect(lastStep.buttonText).toBe('Take me there');
  });

  it('all steps have non-empty messages', () => {
    GUIDE_STEPS.forEach((step) => {
      expect(step.message.length).toBeGreaterThan(10);
      expect(step.buttonText.length).toBeGreaterThan(0);
    });
  });
});
```

**Step 2: Run test**

Run: `npx jest __tests__/integration/newUserGuide.test.ts --no-coverage`
Expected: All PASS

**Step 3: Commit**

```bash
git add __tests__/integration/newUserGuide.test.ts
git commit -m "test: new user guide integration tests — step count, order, content"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Guide state hook | `useGuideState.ts` + tests |
| 2 | GuidePopup component | `GuidePopup.tsx` + tests |
| 3 | Guide steps config | `guideSteps.ts` |
| 4 | Wire into onboarding | `onboarding.tsx` |
| 5 | Wire into home screen | `index.tsx` |
| 6 | Update helper text | `settings.tsx` + `onboarding.tsx` |
| 7 | Integration tests | `newUserGuide.test.ts` |

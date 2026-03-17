# Subscription UX Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement free vs Pro UX gating — context-aware paywall, soft block on entry #4, locked notifications for free users, Coach AL behind Pro gate, webhook sync for server-side Pro status.

**Architecture:** The existing SubscriptionProvider + paywall + daily entry count hook provide the foundation. This plan adds context-aware routing to the paywall, a soft-block flow in voice-input (show parsed result but don't save), notification slider locking for free users, Coach AL Pro-gating, updated denial messages, passphrase removal, and a RevenueCat webhook edge function syncing `is_pro` to the profiles table.

**Tech Stack:** React Native (Expo), Supabase (Postgres + Edge Functions), RevenueCat, expo-router

**Design doc:** `docs/plans/2026-03-17-subscription-ux-design.md`

---

## Task 1: DB Migration — Add is_pro to Profiles

**Files:**
- Create: `supabase/migrations/006_is_pro.sql`

**Step 1: Write the migration**

```sql
ALTER TABLE profiles
  ADD COLUMN is_pro BOOLEAN NOT NULL DEFAULT FALSE;
```

**Step 2: Commit**

```bash
git add supabase/migrations/006_is_pro.sql
git commit -m "feat: add is_pro column to profiles for server-side subscription tracking"
```

---

## Task 2: Context-Aware Paywall

**Files:**
- Modify: `app/(app)/paywall.tsx`

**Step 1: Update paywall to accept source param**

The paywall is navigated to via `router.push('/(app)/paywall')`. Update it to read a `source` search param and display a context-aware subtitle.

Add at top of component:
```typescript
import { useLocalSearchParams } from 'expo-router';
```

Inside the component:
```typescript
const { source } = useLocalSearchParams<{ source?: string }>();

const SUBTITLES: Record<string, string> = {
  entry_limit: "You've used all 3 free entries today.",
  notifications: "Unlock custom reminders and coaching tips.",
  settings: "Unlimited entries, smarter tracking, and more.",
};
const subtitle = SUBTITLES[source || ''] || "Go Pro and get the most out of EasyGains.";
```

Replace the hardcoded subtitle:
```
Old: <Text style={styles.subtitle}>You've hit the free limit of 3 entries today.</Text>
New: <Text style={styles.subtitle}>{subtitle}</Text>
```

**Step 2: Update all navigation calls to pass source**

In `app/(app)/voice-input.tsx` (line 187):
```
Old: router.push('/(app)/paywall');
New: router.push('/(app)/paywall?source=entry_limit');
```

In `app/(app)/(tabs)/settings.tsx` (line 152):
```
Old: router.push('/(app)/paywall')
New: router.push('/(app)/paywall?source=settings')
```

**Step 3: Commit**

```bash
git add app/(app)/paywall.tsx app/(app)/voice-input.tsx app/(app)/(tabs)/settings.tsx
git commit -m "feat: context-aware paywall — subtitle changes based on entry point"
```

---

## Task 3: Soft Block — Show Parsed Result, Don't Save

**Files:**
- Modify: `app/(app)/voice-input.tsx`

**Step 1: Change the entry limit behavior**

Currently (lines 184-191), when a free user hits the limit, the app redirects to paywall BEFORE parsing. Change this to:
1. Let parsing happen normally
2. Show the parsed result
3. Replace the "Log it" button with a "Go Pro to save" button that opens the paywall

Find the entry limit check in `handleParse` and REMOVE it (lines 184-191):
```typescript
// REMOVE this block:
if (!isPro) {
  const todayCount = await fetchCount();
  if (todayCount !== null && todayCount >= FREE_DAILY_LIMIT) {
    router.push('/(app)/paywall');
    setState({ status: 'idle' });
    return;
  }
}
```

Instead, add an `isAtLimit` state that gets checked when displaying the confirmation UI:
```typescript
const [isAtLimit, setIsAtLimit] = useState(false);
```

Check the limit after parsing succeeds (add after setState calls for parsed_food, parsed_workout, parsed_both):
```typescript
if (!isPro) {
  const todayCount = await fetchCount();
  if (todayCount !== null && todayCount >= FREE_DAILY_LIMIT) {
    setIsAtLimit(true);
  }
}
```

Then in the JSX where the "Log it" / confirm buttons are rendered, check `isAtLimit`:
- If `isAtLimit` is true, show the parsed result as normal BUT replace the confirm button with:
```tsx
<View style={styles.limitBanner}>
  <Text style={styles.limitText}>You've used all 3 free entries today.</Text>
  <Button
    title="Go Pro to save this"
    onPress={() => router.push('/(app)/paywall?source=entry_limit')}
    variant="primary"
  />
  <Button title="Dismiss" onPress={() => router.back()} variant="ghost" />
</View>
```

Add styles:
```typescript
limitBanner: { marginTop: 16, alignItems: 'center', gap: 12 },
limitText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
```

**Step 2: Commit**

```bash
git add app/(app)/voice-input.tsx
git commit -m "feat: soft block — show parsed result but don't save when free limit hit"
```

---

## Task 4: Entry Limit Banner on Home Screen

**Files:**
- Modify: `app/(app)/(tabs)/index.tsx`

**Step 1: Add entry limit banner**

Import `useDailyEntryCount` and `useSubscription`:
```typescript
import { useDailyEntryCount } from '../../../src/hooks/useDailyEntryCount';
import { useSubscription } from '../../../src/providers/SubscriptionProvider';
```

Inside HomeScreen:
```typescript
const { isPro } = useSubscription();
const { count: dailyCount, fetchCount } = useDailyEntryCount();
```

Fetch count on focus:
```typescript
// Add fetchCount to the useFocusEffect callback
useFocusEffect(
  useCallback(() => {
    refetchProfile();
    refetchMeals();
    refetchWorkouts();
    if (!isPro) fetchCount();
  }, [refetchProfile, refetchMeals, refetchWorkouts, isPro, fetchCount])
);
```

Add banner JSX after the header, before ringsRow:
```tsx
{!isPro && dailyCount !== null && dailyCount >= 3 && (
  <View style={styles.limitBanner}>
    <Text style={styles.limitText}>
      You've used all 3 free entries today. Go Pro for unlimited.
    </Text>
    <Button
      title="Go Pro"
      onPress={() => router.push('/(app)/paywall?source=entry_limit')}
      variant="secondary"
    />
  </View>
)}
```

Add styles:
```typescript
limitBanner: { backgroundColor: Colors.cardBackground, borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center', gap: 8 },
limitText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
```

**Step 2: Commit**

```bash
git add app/(app)/(tabs)/index.tsx
git commit -m "feat: entry limit banner on home screen after 3 free entries"
```

---

## Task 5: Lock Notification Slider for Free Users

**Files:**
- Modify: `app/(app)/(tabs)/settings.tsx`
- Modify: `src/components/NotificationSlider.tsx`

**Step 1: Add disabled prop to NotificationSlider**

In `src/components/NotificationSlider.tsx`, add `disabled` prop:

```typescript
interface NotificationSliderProps {
  level: NotificationLevel;
  onLevelChange: (level: NotificationLevel) => void;
  disabled?: boolean;
}
```

Update component to accept and use it:
```typescript
export function NotificationSlider({ level, onLevelChange, disabled = false }: NotificationSliderProps) {
```

On each TouchableOpacity dot, add `disabled={disabled}`:
```tsx
<TouchableOpacity
  key={l}
  testID={`slider-dot-${l}`}
  style={[
    styles.dot,
    l <= level ? styles.dotActive : styles.dotInactive,
    disabled && styles.dotDisabled,
  ]}
  onPress={() => onLevelChange(l)}
  disabled={disabled}
/>
```

Add style:
```typescript
dotDisabled: {
  opacity: 0.4,
},
```

**Step 2: Update settings to lock slider for free users**

In `app/(app)/(tabs)/settings.tsx`, the `isPro` is already available. Update the NotificationSlider usage:

```tsx
<NotificationSlider
  level={isPro ? ((profile?.notification_level ?? 3) as any) : 2}
  onLevelChange={(level) => updateNotificationLevel(level)}
  disabled={!isPro}
/>
```

Add a lock indicator below the slider for free users:
```tsx
{!isPro && (
  <TouchableOpacity onPress={() => router.push('/(app)/paywall?source=notifications')}>
    <Text style={styles.lockedHint}>🔒 Pro — unlock custom notification levels</Text>
  </TouchableOpacity>
)}
```

Add style:
```typescript
lockedHint: { fontSize: 13, color: Colors.textMuted, marginTop: 4, marginBottom: 8 },
```

**Step 3: Commit**

```bash
git add src/components/NotificationSlider.tsx app/(app)/(tabs)/settings.tsx
git commit -m "feat: lock notification slider for free users — grayed out, tap for paywall"
```

---

## Task 6: Hide Coach AL for Free Users

**Files:**
- Modify: `app/(app)/(tabs)/settings.tsx`

**Step 1: Gate Coach AL behind Pro**

The current settings already has `showUnhinged` based on submission count. Add Pro check:

Replace:
```typescript
const showUnhinged = checkSubmissionCount(submissionCount);
```
With:
```typescript
const showUnhinged = isPro && checkSubmissionCount(submissionCount);
```

The teaser text also needs Pro gating. Replace:
```tsx
{!showUnhinged && (
  <Text style={styles.teaser}>More notification styles unlock as you use the app...</Text>
)}
```
With:
```tsx
{isPro && !showUnhinged && (
  <Text style={styles.teaser}>More notification styles unlock as you use the app...</Text>
)}
```

Free users see nothing about Coach AL — no teaser, no toggle.

**Step 2: Commit**

```bash
git add app/(app)/(tabs)/settings.tsx
git commit -m "feat: hide Coach AL for free users — require Pro subscription"
```

---

## Task 7: Update Denial Messages

**Files:**
- Modify: `src/lib/unhingedGating.ts`
- Modify: `__tests__/lib/unhingedGating.test.ts`

**Step 1: Replace denial messages**

In `src/lib/unhingedGating.ts`, replace `DENIAL_MESSAGES`:

```typescript
export const DENIAL_MESSAGES = [
  'Come back after you repress all your feelings.',
  "You look like I'll offend you. Try again.",
  'Full of happy thoughts? No thanks.',
  "Good vibes are stupid. You're not stupid... are you?",
  'Maybe try a meditation app instead.',
];
```

**Step 2: Update test**

In `__tests__/lib/unhingedGating.test.ts`, the existing test checks `DENIAL_MESSAGES.length >= 3`. This still passes. No changes needed.

**Step 3: Commit**

```bash
git add src/lib/unhingedGating.ts
git commit -m "feat: update denial messages — Coach AL energy instead of generic"
```

---

## Task 8: Remove Passphrase from Gating

**Files:**
- Modify: `src/lib/unhingedGating.ts`
- Modify: `src/components/UnhingedGate.tsx`
- Modify: `__tests__/lib/unhingedGating.test.ts`

**Step 1: Remove passphrase from unhingedGating.ts**

Remove:
- `export const PASSPHRASE = 'gains over feelings';`
- `export function validatePassphrase(input: string): boolean { ... }`

Keep everything else (checkSubmissionCount, PROTECTOR_QUESTIONS, validateProtectorAnswers, DENIAL_MESSAGES, getRandomDenialMessage).

**Step 2: Update UnhingedGate.tsx**

Remove the `passphrase` stage entirely. When protector answers pass, go straight to `unlocked`:

In `handleAnswer`, replace the success branch:
```typescript
// Old: setStage('passphrase');
// New:
setStage('unlocked');
onUnlocked();
```

Remove all passphrase-related state and JSX:
- Remove `const [passphrase, setPassphrase] = useState('');`
- Remove the `{stage === 'passphrase' && ...}` JSX block
- Remove `handlePassphrase` function
- Remove `validatePassphrase` import

Update the `reset` function to remove passphrase reset.

**Step 3: Update tests**

In `__tests__/lib/unhingedGating.test.ts`, remove the `validatePassphrase` tests:
```typescript
// Remove the entire describe('validatePassphrase', ...) block
```

Also remove the import of `validatePassphrase`.

In `__tests__/integration/notificationFlow.test.ts`, remove passphrase tests if they exist.

**Step 4: Run tests**

Run: `npx jest --no-coverage --testPathPattern="unhingedGating|notificationFlow"`
Expected: All PASS

**Step 5: Commit**

```bash
git add src/lib/unhingedGating.ts src/components/UnhingedGate.tsx __tests__/lib/unhingedGating.test.ts __tests__/integration/notificationFlow.test.ts
git commit -m "feat: remove passphrase from Coach AL gating — protector questions are the gate"
```

---

## Task 9: RevenueCat Webhook Edge Function

**Files:**
- Create: `supabase/functions/revenuecat-webhook/index.ts`

**Step 1: Write the edge function**

```typescript
// supabase/functions/revenuecat-webhook/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const REVENUECAT_WEBHOOK_SECRET = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');

Deno.serve(async (req: Request) => {
  // Verify webhook auth if secret is configured
  if (REVENUECAT_WEBHOOK_SECRET) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${REVENUECAT_WEBHOOK_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  try {
    const body = await req.json();
    const event = body.event;

    if (!event) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const appUserId = event.app_user_id;
    if (!appUserId) {
      return new Response(JSON.stringify({ ok: true, skipped: 'no app_user_id' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Events that grant Pro access
    const grantEvents = [
      'INITIAL_PURCHASE',
      'RENEWAL',
      'PRODUCT_CHANGE',
      'UNCANCELLATION',
    ];

    // Events that revoke Pro access
    const revokeEvents = [
      'EXPIRATION',
      'BILLING_ISSUE',
      'CANCELLATION',
    ];

    const eventType = event.type;
    let isPro: boolean | null = null;

    if (grantEvents.includes(eventType)) {
      isPro = true;
    } else if (revokeEvents.includes(eventType)) {
      isPro = false;
    }

    if (isPro !== null) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase
        .from('profiles')
        .update({ is_pro: isPro })
        .eq('id', appUserId);
    }

    return new Response(JSON.stringify({ ok: true, eventType, isPro }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

**Step 2: Commit**

```bash
git add supabase/functions/revenuecat-webhook/index.ts
git commit -m "feat: RevenueCat webhook edge function — syncs is_pro to profiles table"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | DB migration (is_pro) | `006_is_pro.sql` |
| 2 | Context-aware paywall | `paywall.tsx`, `voice-input.tsx`, `settings.tsx` |
| 3 | Soft block — show but don't save | `voice-input.tsx` |
| 4 | Entry limit banner on home | `index.tsx` |
| 5 | Lock notification slider | `NotificationSlider.tsx`, `settings.tsx` |
| 6 | Hide Coach AL for free | `settings.tsx` |
| 7 | Update denial messages | `unhingedGating.ts` |
| 8 | Remove passphrase | `unhingedGating.ts`, `UnhingedGate.tsx`, tests |
| 9 | RevenueCat webhook | `revenuecat-webhook/index.ts` |

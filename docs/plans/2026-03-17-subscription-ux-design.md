# Subscription UX Design — Free vs Pro, Gating, Admin

**Date:** 2026-03-17
**Status:** Approved

---

## Overview

Free tier is a fully functional calorie tracker (3 entries/day). Pro unlocks intelligence and attention: unlimited entries, accuracy mode, full notifications, and Coach AL. Gated features are visually locked with consistent treatment. One paywall screen with context-aware messaging. RevenueCat handles payments, webhook syncs status to Supabase for server-side queries and comp accounts.

---

## Free User Experience

### What free users get:
- Voice logging (3/day — meals + workouts combined)
- Full macro tracking (rings, daily view)
- Full weekly view
- Best-guess food parsing (no clarifying questions)
- 1 notification/day (locked to level 2, can't adjust)
- 1 generic tip/day

### Entry limit behavior:
- Entries 1-3: normal experience, no warnings, no nagging
- After entry #3: clear message on home screen — "You've used all 3 free entries today. Go Pro for unlimited."
- Entry #4 attempt: voice input works, parsed result is SHOWN but NOT saved. Paywall appears over the result.
- Free users can still browse all existing data, view weekly, use settings. They just can't log more today.

---

## Gated Feature Treatment

**Consistent visual language: grayed out + 🔒 icon + tap → paywall.**

| Feature | Free Treatment | Location |
|---------|---------------|----------|
| Notification slider | Grayed out, locked at level 2, 🔒 + "Pro" badge | Settings |
| Coach AL / personality | Not visible at all | Settings |
| Coach AL teaser | Hidden entirely for free users | Settings |
| Clarifying questions | Silently off — best guess only | Voice input (invisible) |
| AI roast generation | Not available | Background (invisible) |
| Entry limit message | Shows after 3rd entry | Home screen |

**Tapping any locked element opens the paywall with context-aware messaging.**

---

## Coach AL Unlock Flow (Pro Users Only)

### Requirements:
1. Must be a Pro subscriber (free users don't see any Coach AL UI)
2. Must have 100+ total food/workout submissions
3. Must pass protector questions

### Flow:
- Pro user, <100 submissions: teaser text — "More notification styles unlock as you use the app..."
- Pro user, 100+ submissions: personality toggle appears, tapping triggers protector flow
- Pass protectors: Coach AL activated
- Fail protectors: denial message, stays on Helpful Trainer

### No passphrase — protector questions are the gate.

### Updated Denial Messages (Coach AL energy):
- "Come back after you repress all your feelings."
- "You look like I'll offend you. Try again."
- "Full of happy thoughts? No thanks."
- "Good vibes are stupid. You're not stupid... are you?"
- "Maybe try a meditation app instead."

---

## Upgrade Flow & Paywall

### Entry points to paywall:
- Entry #4 attempt (after parsed result shown but not saved)
- Tapping locked notification slider in settings
- "Go Pro" button in settings (always visible for free users)

### Context-aware paywall subtitle:

| Source | Subtitle |
|--------|----------|
| `entry_limit` | "You've used all 3 free entries today." |
| `notifications` | "Unlock custom reminders and coaching tips." |
| `settings` | "Unlimited entries, smarter tracking, and more." |
| default | "Go Pro and get the most out of EasyGains." |

### Paywall screen structure:
1. "Go Pro" title
2. Context-aware subtitle (based on source param)
3. Feature list with checkmarks
4. Package cards (monthly $5.99 / annual $59)
5. "Restore purchases" ghost button
6. "Not now" ghost button

---

## Subscription Infrastructure

### RevenueCat (already configured)
- SubscriptionProvider wraps app, exposes `isPro` boolean
- Purchases SDK configured with API key
- User ID linked to Supabase auth ID
- Listener auto-updates on subscription state changes

### Webhook Sync (new)
- RevenueCat → Supabase edge function on: purchase, renewal, cancellation, expiry, billing issue
- Edge function updates `is_pro` boolean on `profiles` table
- Enables:
  - Server-side Pro status validation
  - Queryable subscriber data in own DB
  - Manual comp accounts via Supabase dashboard
  - Future analytics: Pro vs Free behavior

### Data model addition:
- `profiles` table: add `is_pro BOOLEAN NOT NULL DEFAULT FALSE`
- RevenueCat = source of truth, webhook keeps DB in sync
- Client-side: `isPro` from SubscriptionProvider used for UI gating
- Server-side: `is_pro` on profiles used for edge function validation

### Comp accounts:
- Option 1: RevenueCat dashboard → grant promotional entitlement → triggers webhook → syncs to DB
- Option 2: Manually set `is_pro = true` in Supabase dashboard
- Both work, RevenueCat method is cleaner for tracking

---

## Free vs Pro Summary

| Feature | Free | Pro |
|---------|------|-----|
| Voice entries | 3/day | Unlimited |
| Daily tracking (rings, today view) | Full | Full |
| Weekly view | Full | Full |
| Clarifying questions | Off (best guess) | On (accuracy mode) |
| Notifications | 1/day, locked at level 2 | Full slider (1-5) |
| Notification tips | 1 generic/day | Full persona-sourced library |
| Coach AL (unhinged) | Hidden | Unlockable at 100 submissions |
| AI roast generation | Hidden | Available with Coach AL |

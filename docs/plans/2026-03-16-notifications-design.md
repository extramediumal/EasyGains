# Notification System Design — Personality Tiers & Coaching

**Date:** 2026-03-16
**Status:** Approved

---

## Overview

Notification system combining MyFitnessPal-style tracking reminders with Duolingo-style coaching personality. Two personality tiers (Helpful Trainer default, Unhinged unlockable), frequency controlled by a single slider, content is a 50/50 mix of reactive nudges and proactive educational tips.

---

## Personality Tiers

### 1. Helpful Trainer (default)

Supportive, knowledgeable, casual. Gym buddy who reads studies. Covers both reactive nudges and proactive tips.

### 2. Unhinged (gated)

Roasts food choices, aggressive callouts, zero filter. Drill sergeant energy. Only affects reactive nudges — proactive tips stay helpful regardless of tier.

### Unhinged Gating — 3 Layers

1. **Usage gate:** 100+ total food/workout submissions. The personality option doesn't appear in settings until this threshold is met.
2. **Pop-up protectors:** 2-3 escalating screens when they tap to enable.
   - "Do you hate yourself?"
   - "If someone says 'fuck you,' do you get offended?"
   - Must answer the "right" way to proceed.
   - **Denied users get fun rejection messages:** "You are not ready, young grasshopper," "You must prove yourself," etc.
3. **Secret passphrase:** A specific phrase typed into a text field to activate. Final lock — feels like an easter egg, provides legal/liability cover for explicit opt-in.

If a user fails any gate, they stay on Helpful Trainer. No explanation, no hints.

---

## Notification Frequency: The Slider

One slider in settings. Unlabeled endpoints (muted icon on left, loud icon on right). Maps to a single integer (1-5) stored on the user profile. Users never configure individual notification types or times.

| Level | Internal Name | Approx Daily Max |
|-------|--------------|-----------------|
| 1 | Ghost | 0 (off) |
| 2 | Chill | 1 |
| 3 | Balanced | 2 |
| 4 | Coached | 3-4 |
| 5 | Spam Me | 5 |

- Reactive notifications scale with level — level 2 only nudges truly missed meals, level 5 checks every window.
- Proactive tips scale too — level 3 gets one tip/day, level 5 gets 2-3 spread throughout the day.
- **Hard cap: 5 notifications per day maximum.**

---

## Notification Content

### Reactive Nudges (behavior-triggered)

Triggered by checking logged entries against expected meal/workout windows.

**Helpful Trainer examples:**
- Missed meal: "Hey, no lunch logged — did you eat?"
- No workout in 3+ days: "You gonna move today? Even a walk counts."
- Protein behind for the week: "You're behind on protein this week — maybe grab a shake?"
- Streak acknowledgment: "3 days straight logging — nice consistency."

**Unhinged examples:**
- Missed meal: "Starving yourself isn't a diet strategy, genius"
- No workout: "Your couch called. It said even IT is tired of you"
- Protein behind: "Your muscles are literally eating themselves rn"

### Proactive Tips (scheduled, educational)

Rotating library of evidence-based, intermediate-level tips stored in Supabase. Not dumbed down — target user cares enough to download a macro tracker.

**Categories:**
- Protein & nutrition science
- Supplement basics (creatine, etc.)
- Training principles (progressive overload, recovery)
- Common myth-busting ("meal timing doesn't matter much")

**Unhinged does NOT affect proactive tips.** Tips stay helpful regardless of personality tier.

---

## Roast Content: Hybrid System

### Static roast library (Supabase table)

Templates with placeholders, tagged by trigger type:
- **Food roasts:** `"{food}? Might as well just mainline sugar directly"` — tagged by food category (fast food, dessert, high-carb, etc.)
- **Workout skips:** `"Rest day again? That's 4 in a row, champ"`
- **General:** `"You downloaded a fitness app to NOT use it?"`

### AI-generated roasts (Claude Haiku via edge function)

For inputs that don't match a template well. System prompt enforces:
- Funny, not cruel
- Food/fitness focused only (never personal appearance, identity, etc.)
- Short — one or two lines max

### Guardrails

Hard boundaries on AI roast generation: no comments about body image, weight, eating disorders, race, gender, or anything beyond the specific food/workout input. Roasts punch at the *choice*, never the *person*.

---

## Notification Delivery

### Phase 1: On app open (implement now)

When the user opens the app:
1. Check meal log gaps against expected meal windows
2. Show in-app nudge if gaps found
3. Schedule local catch-up notifications for upcoming windows via expo-notifications
4. Proactive tips scheduled as local daily notifications based on slider level

Simple, free, no push infrastructure beyond existing expo-notifications.

### Phase 2: Server-side cron (pinned for later)

Supabase Edge Function on a cron, checks each user's logs, sends push notifications via Expo Push API. Required for re-engaging users who aren't opening the app. Needs Expo push tokens and server-side sending infrastructure.

---

## Settings UI

### Notification section:
- **Slider** — minimal icons on endpoints. Single value 1-5.
- **Teaser text** — visible below the slider from day one: *"More notification styles unlock as you use the app..."* Disappears once unhinged is unlocked.
- **Personality toggle** — only visible after 100 submissions. Tapping triggers pop-up protector flow → passphrase input on success.
- **Active personality indicator** — small badge showing current mode.

### Data model additions:
- `profiles` table: add `notification_level` (int 1-5, default 3), `personality_tier` (enum: 'helpful' | 'unhinged', default 'helpful')
- New `notification_tips` table for proactive tip library
- Existing `notification_templates` table: add `personality_tier` column to tag helpful vs unhinged variants
- Submission count derived from existing `meals` + `workouts` tables (no new column)

---

## Content TODOs

1. **Unhinged voice calibration:** Dedicated session to absorb the creator's humor and roasting style through Q&A. Use that to write the static roast library and craft the AI roast system prompt. The unhinged voice should sound authentic, not generic internet humor.

2. **Research-backed tip library:** Pull from the fitness researchers/coaches referenced in previous research sessions to build the proactive tip content. Tips should be evidence-based, attributed to credible sources, and aligned with the app's "chill but knowledgeable" philosophy.

---

## Pinned for Later

- **Cron-based reactive push notifications (Phase 2)** — server-side nudges for users not opening the app
- **Grok API integration** — potential nuclear unhinged tier for users who want maximum chaos

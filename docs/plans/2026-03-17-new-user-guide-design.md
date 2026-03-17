# New User Guide Design

**Date:** 2026-03-17
**Status:** Approved

---

## Overview

5-popup guide for brand new users, split between onboarding (2 popups) and home screen (3 popups). Chill buddy tone throughout. After the guide, user auto-navigates to Settings to dial in their goals. Settings helper text updated to be crystal clear.

---

## Popup Flow

### Popup 1 — Welcome + Philosophy (Onboarding)

Appears after tapping "Let's Go" on the onboarding screen, before navigating to home.

Full screen overlay, centered text.

> "Welcome to EasyGains. Eat your protein, move your body, don't overthink the rest."

Button: **"Got it"**

### Popup 2 — Voice-First Pitch (Onboarding)

Immediately after dismissing popup 1.

> "Just talk to us. Say what you ate or what workout you did. We figure out the rest."

Button: **"Cool"**

*Navigates to home screen.*

### Popup 3 — Mic Button (Home)

Tooltip-style popup anchored to the floating mic button.

> "Tap this and say what you ate. That's it."

Button: **"Next"**

### Popup 4 — MacroTriforce Rings (Home)

Tooltip anchored to the rings area.

> "These fill up as you log your meals. Track your calories and macros at a glance."

Button: **"Next"**

### Popup 5 — Settings (Home)

Tooltip anchored to the Settings tab.

> "Head to Settings to dial in your goals and ideal weight. Everything adjusts to you."

Button: **"Take me there"**

*Auto-navigates to Settings screen.*

---

## Settings Helper Text Updates

| Field | New Hint |
|-------|----------|
| Desired weight (lbs) | "Your goal weight. We use this to set your targets." |
| Daily calorie target | "We'll calculate this from your goal weight, or enter your own." |
| Daily effort target (1-10) | "How hard you want to push this week, on a 1-10 scale. 4 = moderate, 7 = intense." |

---

## Implementation Notes

### Popup Tracking

- Store `has_seen_guide` boolean on the user profile (or AsyncStorage)
- Only show guide once per account
- If user dismisses early (background app, etc.), show remaining popups next time

### Popup Style

- Full-screen overlay with semi-transparent dark background
- Card-style popup (white, rounded corners, centered)
- For home screen tooltips: arrow/pointer anchored to the target element
- Chill buddy tone — casual, short, no jargon
- One button per popup, bottom of card

### Navigation Flow

```
Signup → Onboarding (weight/cal/effort)
  → Popup 1 (welcome)
  → Popup 2 (voice pitch)
  → Home Screen
  → Popup 3 (mic button)
  → Popup 4 (rings)
  → Popup 5 (settings tab)
  → Auto-navigate to Settings
```

### What This Does NOT Include

- No sample/demo data — user starts at zero
- No notification setup in guide — defaults to level 3 (Balanced), tips will educate over time
- No weekly tab callout — let them discover it naturally
- No protein-specific messaging — the notification tip system handles protein education over time

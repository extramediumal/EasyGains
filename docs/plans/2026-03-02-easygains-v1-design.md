# EasyGains V1 Design

## Product Philosophy

EasyGains exists because tracking calories shouldn't feel like a second job. The big apps make you scan barcodes, search databases, and weigh food on a scale. Most people quit within a week.

EasyGains has a point of view: **eat your protein, move your body, don't overthink the rest.**

- **Protein is king.** The #1 metric. 1g per pound of desired body weight. Hitting 75-80% is a win. Hitting 100% is celebrated.
- **Calories matter, but second.** Keep them in a reasonable range. No daily guilt.
- **Carbs and fat are tracked, not stressed.** Visible but never the focus. Gentle weekly notes if patterns emerge, never daily alarms.
- **Weekly intake is what matters.** Some days you eat out, some days you fast. A bad Tuesday doesn't ruin a good week. The rolling 7-day view is the primary metric.
- **Move your body.** The app nudges you to work out. Building muscle drives metabolism, which drives fat loss. Protein intake supports that cycle.
- **Chill buddy, not drill sergeant.** No red numbers. No guilt. Encouraging, funny, human tone.

## Target User

The everyday person who wants to get in shape but doesn't want to become a nutrition nerd. They work out or want to start. They know protein matters but don't track it. They've tried MyFitnessPal and quit because it was too much work.

## Core Value Proposition

**Just say what you ate.** Voice-first input. AI does the macro math. You confirm and move on with your life.

## Tech Stack

- **Client:** React Native (Expo)
- **Backend:** Supabase (Postgres + Auth + Edge Functions)
- **AI:** Claude API (food parsing, macro estimation, clarifying questions)
- **Speech-to-Text:** Device native STT (expo-speech / react-native-voice)

## MVP Features (V1)

### 1. Voice Input + AI Food Parsing

The core interaction loop:

1. User taps the mic button
2. User speaks naturally: "I had two eggs and toast for breakfast"
3. Device STT converts speech to text
4. Text is sent to Supabase Edge Function → Claude API
5. Claude returns structured meal data as JSON:
   ```json
   {
     "foods": [
       { "name": "Scrambled eggs", "portion": "2 large", "calories": 180, "protein": 12, "carbs": 2, "fat": 14 },
       { "name": "White toast", "portion": "1 slice", "calories": 80, "protein": 3, "carbs": 14, "fat": 1 }
     ]
   }
   ```
6. If Claude needs clarification, it returns quick-tap options:
   ```json
   {
     "clarification": "What kind of bread?",
     "options": ["White bread", "Wheat bread", "Sourdough", "Other"]
   }
   ```
7. User confirms → meal is saved

Claude's system prompt is tuned to estimate like a practical nutritionist. Good enough accuracy, not obsessive precision. Portions are described in everyday terms (a bowl, a plate, a handful) not grams.

### 2. Daily + Weekly Macro Dashboard

**Daily View (Home Screen):**
- Protein gets the hero position: large progress ring, "X of Y grams"
- Calories below, smaller but visible
- Carbs and fat: small number row at bottom, no progress indicators
- Today's meal cards in chronological order, tap to expand/edit

**Weekly View:**
- Weekly protein average: THE metric, big and top of screen
- 7-day bar chart showing daily protein intake
- Weekly calorie average below
- Carbs/fat weekly summary at the bottom, small

### 3. Periodic Prompts (Notifications)

Configurable meal-time notifications with personality:
- Rotated from a content library of messages with different tones
- Trigger types: meal prompts, no-log reminders, encouragement, weekly summaries
- Tones: funny, motivational, chill, sarcastic
- Example: "Bro... did you eat?" / "Your muscles are literally begging for protein right now"
- Workout nudges included: friendly reminders to move, not scoldings

### 4. Meal History with Edit/Delete

- Tap any meal from Home to see individual food items
- Tap an item to adjust portion or macros
- Swipe to delete an item
- Can re-voice corrections: "Actually it was brown rice not white"

## Database Schema

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | From Supabase auth |
| desired_weight_lbs | number | Drives protein target (1g/lb) |
| calorie_target | number | Daily goal. Weekly = daily x 7 |
| created_at | timestamp | |
| updated_at | timestamp | |

### `meals`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| logged_at | timestamp | When the meal happened |
| meal_type | enum | breakfast, lunch, dinner, snack |
| raw_input | text | Original voice transcript |
| total_calories | number | Aggregated from items |
| total_protein | number | |
| total_carbs | number | |
| total_fat | number | |
| created_at | timestamp | |
| updated_at | timestamp | |

### `meal_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| meal_id | uuid | FK → meals |
| name | text | "2 scrambled eggs" |
| portion | text | "2 large" |
| calories | number | |
| protein | number | |
| carbs | number | |
| fat | number | |

### `notification_settings`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| meal_type | enum | breakfast, lunch, dinner, snack |
| prompt_time | time | e.g., 12:30 |
| enabled | boolean | |

### `notification_templates`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| trigger_type | enum | meal_prompt, no_log_reminder, encouragement, weekly_summary |
| tone | enum | funny, motivational, chill, sarcastic |
| message_title | text | "Bro... did you eat?" |
| message_body | text | "Your muscles are literally begging for protein right now" |
| meal_type | enum (nullable) | null = works for any meal |
| active | boolean | |

Weekly aggregations are computed at query time from the `meals` table grouped by ISO week. No stored derived data.

## Key Screens

Five screens total.

### 1. Home (Daily View)
- Protein progress ring: big, center, hero position
- Calories: below protein, secondary emphasis
- Carbs/fat: small number row, no visual weight
- Meal cards: chronological, tappable to expand
- Floating mic button: bottom center, primary action

### 2. Weekly View
- Swipe from Home or tap tab
- Weekly protein average: top, large
- 7-day bar chart: one bar per day
- Weekly calorie average: below chart
- Carbs/fat: bottom summary, small

### 3. Voice Input (Modal)
- Full-screen modal on mic tap
- Pulsing mic icon while listening
- Live transcript as you speak
- Claude's parsed response with macros
- Clarifying questions as tappable chips
- "Log it" button to confirm

### 4. Meal Edit
- Tap meal from Home → item list
- Tap item to adjust portion/macros
- Swipe to delete
- Re-voice option for corrections

### 5. Profile / Settings
- Desired body weight
- Daily calorie target
- Notification schedule per meal
- Nothing else

## Data Flow

```
Voice → Device STT → Text → Supabase Edge Function → Claude API
→ Structured JSON (or clarifying questions) → App → User confirms → Save to Supabase
```

## V2+ Ideas (Not in Scope)

- Workout / exercise logging
- Sleep tracking
- Gains AI buddy personality (deeper conversational coaching)
- Streak tracking and gamification
- Social features
- Food photo input
- Integration with fitness wearables
- Meal suggestions based on remaining macros

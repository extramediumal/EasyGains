# EasyGains

Voice-first calorie & macro tracker. Protein is the hero metric. Weekly intake > daily.
Philosophy: "Eat your protein, move your body, don't overthink the rest." Chill buddy tone.

## Tech Stack
- React Native (Expo + Expo Router)
- Supabase (Postgres + Auth + Edge Functions)
- Claude API (Haiku for food parsing via edge function)
- expo-speech-recognition, react-native-gifted-charts, react-native-svg, expo-notifications
- Testing: jest-expo + @testing-library/react-native

## Current Status (as of March 2026)
- **V1 (Food Tracking):** Complete
- **V2 (Workout Tracking):** Complete — effort score hero metric, voice auto-detects food vs workout
- **V3 (MacroTriforce):** Complete — 3 rings (protein/carbs/fat) in triforce layout on home screen
- **V4 (iOS / App Store Prep):** IN PROGRESS

## V4 Next Steps
1. On Mac: `npm install && npx expo prebuild --platform ios`
2. Open `ios/*.xcworkspace` in Xcode
3. Set signing team in Signing & Capabilities
4. Build and run on simulator or device
5. Cleanup: delete `assets/assetsicon.png` and `assets/assetssplash-icon.png` (misnamed duplicates)

## Key Design Decisions
- Protein target = 1g per lb of desired body weight. 75-80% is a win.
- MacroTriforce: protein (black), carbs (amber #FF9500), fat (purple #AF52DE) — all turn green at 80%+
- Macro targets: protein=1g/lb, fat=0.3g/lb (clamped 20-35% cal), carbs=fill remaining
- Weekly view is the PRIMARY metric view, not daily
- Voice input → Claude parses → quick-tap clarifications → confirm → logged
- Bundle ID: `com.easygains.app`
- App icon: white dumbbell on matte black. Splash: triforce rings on #1C1C1E.

## Security TODO (DO NOT FORGET — before any real usage)
- **parse-food edge function**: JWT verification is OFF — TURN IT ON in Supabase dashboard
- **parse-workout edge function**: JWT verification is OFF — TURN IT ON in Supabase dashboard
- **RLS policies**: Verify all enabled for meals and workouts tables

## Monetization (documented, not implemented)
- Free: 3 voice entries/day, basic tracking, no clarifications, no reminders
- Pro: $5.99/mo or $59/yr, unlimited voice, accuracy mode, weekly analytics, reminders
- Details: `docs/plans/monetization-strategy.md`

## Key Files
- Design doc: `docs/plans/2026-03-02-easygains-v1-design.md`
- Supabase schema: `supabase/migrations/001_initial_schema.sql`
- Workout schema: `supabase/migrations/002_workouts.sql`
- Edge functions: `supabase/functions/parse-food/index.ts`, `supabase/functions/parse-workout/index.ts`
- MacroTriforce: `src/components/MacroTriforce.tsx`
- Macro targets: `src/lib/macroTargets.ts`

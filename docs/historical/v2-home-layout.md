# V2 Home Screen Layout (Preserved 2026-03-04)

Replaced by MacroTriforce layout in V3. Preserved for future reuse.

## Layout

Two 140px rings side-by-side in a `ringsRow` (`flexDirection: 'row', justifyContent: 'space-around'`), followed by a text-based MacroSummary.

```
  [ ProteinRing 140px ]    [ ActivityRing 140px ]
          Calories: 1,234 / 2,000
           Carbs: 180g   Fat: 52g
```

## Components

### ProteinRing (`src/components/ProteinRing.tsx`)

- Size: 140px, stroke: 10px, radius: 65px
- Color: black (default), green (`#34C759`) at >= 80% of target
- Center text: current value (32px bold), "of {target}g protein" (12px), message (12px green)
- Messages: "Let's eat" (< 50%), "Keep going" (50-79%), "Nice work" (80-99%), "Crushed it" (100%)
- SVG Circle with `strokeDasharray` / `strokeDashoffset` pattern

```tsx
<ProteinRing current={totals.protein} target={proteinTarget} />
```

### ActivityRing (`src/components/ActivityRing.tsx`)

- Size: 140px, stroke: 10px, radius: 65px
- Color: blue (`#007AFF`) default, green (`#34C759`) at >= 80%
- Center text: current value (32px bold), "of {target} effort" (12px), message (12px)
- Messages: "Rest day" (0%), "Nice start" (> 0%), "Keep it up" (50%), "Active day!" (80%), "Beast mode" (100%)

```tsx
<ActivityRing current={workoutTotals.effort_score} target={activityTarget} />
```

### MacroSummary (`src/components/MacroSummary.tsx`)

- Simple text-based calorie + macro display
- Calorie row: "Calories" label + "{current} / {target}" (16px, bold)
- Macro row: "Carbs: {carbs}g" + "Fat: {fat}g" (13px, #999)
- Centered, paddingHorizontal: 24

```tsx
<MacroSummary
  calories={totals.calories}
  calorieTarget={calorieTarget}
  carbs={totals.carbs}
  fat={totals.fat}
/>
```

## Home Screen Usage (`app/(app)/(tabs)/index.tsx`)

```tsx
<View style={styles.ringsRow}>
  <ProteinRing current={totals.protein} target={proteinTarget} />
  <ActivityRing current={workoutTotals.effort_score} target={activityTarget} />
</View>

<MacroSummary
  calories={totals.calories}
  calorieTarget={calorieTarget}
  carbs={totals.carbs}
  fat={totals.fat}
/>
```

Styles:
```typescript
ringsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 8 }
```

export interface MacroTargets {
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
}

export function computeMacroTargets(
  desiredWeightLbs: number,
  calorieTarget: number,
): MacroTargets {
  const protein = Math.round(desiredWeightLbs);

  // Fat: 0.3g per lb, clamped to 20-35% of calories
  let fat = Math.round(desiredWeightLbs * 0.3);
  const fatPct = (fat * 9) / calorieTarget;
  if (fatPct < 0.2) fat = Math.round((calorieTarget * 0.2) / 9);
  else if (fatPct > 0.35) fat = Math.round((calorieTarget * 0.35) / 9);

  // Carbs: fill remaining, minimum 50g
  const carbs = Math.max(
    50,
    Math.round((calorieTarget - protein * 4 - fat * 9) / 4),
  );

  return { protein, fat, carbs, calories: calorieTarget };
}

export type CalorieBudgetStatus = 'under' | 'approaching' | 'over';

export function getCalorieBudgetStatus(
  current: number,
  target: number,
): CalorieBudgetStatus {
  const pct = current / target;
  if (pct > 1.0) return 'over';
  if (pct >= 0.9) return 'approaching';
  return 'under';
}

import { NotificationTip, NotificationLevel } from '../types/database';

export interface MealWindow {
  type: string;
  hour: number;
}

export interface PlannedNotification {
  type: 'reactive' | 'tip';
  trigger?: 'missed_meal' | 'no_workout' | 'low_protein' | 'streak';
  mealType?: string;
  title: string;
  body: string;
  hour: number;
  minute: number;
}

export interface NotificationPlanInput {
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

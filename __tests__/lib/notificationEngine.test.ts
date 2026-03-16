import {
  getMaxNotifications,
  shouldSendReactiveNudge,
  pickRandomTip,
  buildNotificationPlan,
} from '../../src/lib/notificationEngine';

describe('getMaxNotifications', () => {
  it('returns 0 for level 1 (Ghost)', () => {
    expect(getMaxNotifications(1)).toBe(0);
  });
  it('returns 1 for level 2 (Chill)', () => {
    expect(getMaxNotifications(2)).toBe(1);
  });
  it('returns 2 for level 3 (Balanced)', () => {
    expect(getMaxNotifications(3)).toBe(2);
  });
  it('returns 4 for level 4 (Coached)', () => {
    expect(getMaxNotifications(4)).toBe(4);
  });
  it('returns 5 for level 5 (Spam Me)', () => {
    expect(getMaxNotifications(5)).toBe(5);
  });
});

describe('shouldSendReactiveNudge', () => {
  it('returns missed meals when window passed and no meal logged', () => {
    const now = new Date('2026-03-16T13:00:00');
    const mealWindows = [
      { type: 'breakfast', hour: 8 },
      { type: 'lunch', hour: 12 },
    ];
    const loggedMealTypes = ['breakfast'];
    expect(shouldSendReactiveNudge(now, mealWindows, loggedMealTypes)).toEqual(
      [{ type: 'lunch', hour: 12 }]
    );
  });

  it('returns empty when all meals logged', () => {
    const now = new Date('2026-03-16T13:00:00');
    const mealWindows = [
      { type: 'breakfast', hour: 8 },
      { type: 'lunch', hour: 12 },
    ];
    const loggedMealTypes = ['breakfast', 'lunch'];
    expect(shouldSendReactiveNudge(now, mealWindows, loggedMealTypes)).toEqual([]);
  });

  it('ignores future meal windows', () => {
    const now = new Date('2026-03-16T10:00:00');
    const mealWindows = [
      { type: 'breakfast', hour: 8 },
      { type: 'lunch', hour: 12 },
    ];
    const loggedMealTypes: string[] = [];
    expect(shouldSendReactiveNudge(now, mealWindows, loggedMealTypes)).toEqual(
      [{ type: 'breakfast', hour: 8 }]
    );
  });
});

describe('pickRandomTip', () => {
  it('picks a tip from the provided array', () => {
    const tips = [
      { id: '1', message_title: 'Tip 1', message_body: 'Body 1' },
      { id: '2', message_title: 'Tip 2', message_body: 'Body 2' },
    ];
    const result = pickRandomTip(tips as any);
    expect(tips.map(t => t.id)).toContain(result!.id);
  });

  it('returns null for empty array', () => {
    expect(pickRandomTip([])).toBeNull();
  });
});

describe('buildNotificationPlan', () => {
  it('returns empty plan for level 1', () => {
    const plan = buildNotificationPlan({
      level: 1,
      missedMeals: [{ type: 'lunch', hour: 12 }],
      tips: [],
      daysSinceWorkout: 0,
      weeklyProteinPct: 90,
    });
    expect(plan).toEqual([]);
  });

  it('prioritizes reactive nudges over tips', () => {
    const plan = buildNotificationPlan({
      level: 2,
      missedMeals: [{ type: 'lunch', hour: 12 }],
      tips: [{ id: '1', message_title: 'Tip', message_body: 'Body' }] as any,
      daysSinceWorkout: 0,
      weeklyProteinPct: 90,
    });
    expect(plan.length).toBe(1);
    expect(plan[0].type).toBe('reactive');
  });

  it('fills remaining slots with tips', () => {
    const plan = buildNotificationPlan({
      level: 3,
      missedMeals: [{ type: 'lunch', hour: 12 }],
      tips: [{ id: '1', message_title: 'Tip', message_body: 'Body' }] as any,
      daysSinceWorkout: 0,
      weeklyProteinPct: 90,
    });
    expect(plan.length).toBe(2);
    expect(plan[0].type).toBe('reactive');
    expect(plan[1].type).toBe('tip');
  });

  it('adds workout nudge when 3+ days since last workout', () => {
    const plan = buildNotificationPlan({
      level: 3,
      missedMeals: [],
      tips: [{ id: '1', message_title: 'Tip', message_body: 'Body' }] as any,
      daysSinceWorkout: 4,
      weeklyProteinPct: 90,
    });
    expect(plan.some(n => n.type === 'reactive' && n.trigger === 'no_workout')).toBe(true);
  });

  it('adds protein nudge when weekly protein below 75%', () => {
    const plan = buildNotificationPlan({
      level: 4,
      missedMeals: [],
      tips: [],
      daysSinceWorkout: 0,
      weeklyProteinPct: 60,
    });
    expect(plan.some(n => n.type === 'reactive' && n.trigger === 'low_protein')).toBe(true);
  });
});

import { getMaxNotifications, buildNotificationPlan } from '../../src/lib/notificationEngine';
import { checkSubmissionCount, validateProtectorAnswers, validatePassphrase, PROTECTOR_QUESTIONS } from '../../src/lib/unhingedGating';

describe('Notification System Integration', () => {
  describe('Ghost mode (level 1)', () => {
    it('produces zero notifications regardless of state', () => {
      const plan = buildNotificationPlan({
        level: 1,
        missedMeals: [{ type: 'breakfast', hour: 8 }, { type: 'lunch', hour: 12 }],
        tips: [{ id: '1', message_title: 'T', message_body: 'B' }] as any,
        daysSinceWorkout: 10,
        weeklyProteinPct: 20,
      });
      expect(plan).toEqual([]);
    });
  });

  describe('Spam Me mode (level 5)', () => {
    it('fills all 5 slots with mixed content', () => {
      const plan = buildNotificationPlan({
        level: 5,
        missedMeals: [{ type: 'breakfast', hour: 8 }],
        tips: Array.from({ length: 10 }, (_, i) => ({
          id: String(i),
          message_title: `Tip ${i}`,
          message_body: `Body ${i}`,
        })) as any,
        daysSinceWorkout: 5,
        weeklyProteinPct: 50,
      });
      expect(plan.length).toBe(5);
    });
  });

  describe('Personality affects messages', () => {
    it('uses helpful messages by default', () => {
      const plan = buildNotificationPlan({
        level: 2,
        missedMeals: [{ type: 'lunch', hour: 12 }],
        tips: [],
        daysSinceWorkout: 0,
        weeklyProteinPct: 90,
      });
      expect(plan.length).toBe(1);
      expect(plan[0].body).not.toContain('genius');
    });

    it('uses unhinged messages when personality is unhinged', () => {
      const plan = buildNotificationPlan({
        level: 2,
        personalityTier: 'unhinged',
        missedMeals: [{ type: 'lunch', hour: 12 }],
        tips: [],
        daysSinceWorkout: 0,
        weeklyProteinPct: 90,
      });
      expect(plan.length).toBe(1);
      // Unhinged messages should contain the meal type
      expect(plan[0].body.toLowerCase()).toContain('lunch');
    });
  });

  describe('Unhinged unlock flow', () => {
    it('requires 100+ submissions', () => {
      expect(checkSubmissionCount(99)).toBe(false);
      expect(checkSubmissionCount(100)).toBe(true);
    });

    it('requires correct protector answers + passphrase', () => {
      const correctAnswers = PROTECTOR_QUESTIONS.map(q => q.correctAnswer);
      expect(validateProtectorAnswers(correctAnswers)).toBe(true);
      expect(validatePassphrase('gains over feelings')).toBe(true);
    });

    it('rejects wrong protector answers', () => {
      expect(validateProtectorAnswers(['wrong', 'wrong', 'wrong'])).toBe(false);
    });

    it('rejects wrong passphrase', () => {
      expect(validatePassphrase('let me in')).toBe(false);
    });
  });

  describe('Notification level caps', () => {
    it.each([
      [1, 0],
      [2, 1],
      [3, 2],
      [4, 4],
      [5, 5],
    ])('level %i caps at %i notifications', (level, max) => {
      expect(getMaxNotifications(level as any)).toBe(max);
    });
  });
});

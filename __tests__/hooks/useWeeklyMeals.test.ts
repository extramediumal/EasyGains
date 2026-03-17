import { renderHook, waitFor } from '@testing-library/react-native';
import { useWeeklyMeals } from '../../src/hooks/useWeeklyMeals';

jest.mock('../../src/lib/supabase', () => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  return {
    supabase: {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          gte: jest.fn().mockReturnValue({
            lte: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: [
                  { logged_at: `${today}T12:00:00Z`, total_calories: 500, total_protein: 40, total_carbs: 50, total_fat: 20 },
                  { logged_at: `${today}T18:00:00Z`, total_calories: 700, total_protein: 50, total_carbs: 60, total_fat: 30 },
                  { logged_at: `${yesterday}T12:00:00Z`, total_calories: 600, total_protein: 45, total_carbs: 55, total_fat: 25 },
                ],
              }),
            }),
          }),
        }),
      }),
    },
  };
});

describe('useWeeklyMeals', () => {
  it('computes daily breakdowns and weekly averages', async () => {
    const { result } = renderHook(() => useWeeklyMeals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.weeklyAvg.protein).toBeGreaterThan(0);
    expect(result.current.dailyBreakdown.length).toBeGreaterThan(0);
  });
});

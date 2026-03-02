import { renderHook, waitFor } from '@testing-library/react-native';
import { useMealItems } from '../../src/hooks/useMealItems';

jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: [
            { id: '1', meal_id: 'm1', name: 'Eggs', portion: '2 large', calories: 180, protein: 12, carbs: 2, fat: 14 },
          ],
        }),
      }),
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
    }),
  },
}));

describe('useMealItems', () => {
  it('fetches meal items for a given meal id', async () => {
    const { result } = renderHook(() => useMealItems('m1'));
    await waitFor(() => expect(result.current.items.length).toBe(1));
    expect(result.current.items[0].name).toBe('Eggs');
  });
});

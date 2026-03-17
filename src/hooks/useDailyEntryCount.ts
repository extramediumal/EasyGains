import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useDailyEntryCount() {
  const [count, setCount] = useState<number | null>(null);

  const fetchCount = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return 0;

    const today = new Date().toISOString().split('T')[0];

    const [{ count: mealCount }, { count: workoutCount }] = await Promise.all([
      supabase
        .from('meals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('logged_at', `${today}T00:00:00Z`)
        .lte('logged_at', `${today}T23:59:59Z`),
      supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('logged_at', `${today}T00:00:00Z`)
        .lte('logged_at', `${today}T23:59:59Z`),
    ]);

    const total = (mealCount ?? 0) + (workoutCount ?? 0);
    setCount(total);
    return total;
  }, []);

  return { count, fetchCount };
}

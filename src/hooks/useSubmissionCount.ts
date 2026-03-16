import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useSubmissionCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ count: mealCount }, { count: workoutCount }] = await Promise.all([
      supabase
        .from('meals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
      supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ]);

    setCount((mealCount || 0) + (workoutCount || 0));
    setLoading(false);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { count, loading, refetch };
}

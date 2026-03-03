import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Workout } from '../types/database';

export function useTodayWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data } = await supabase
      .from('workouts')
      .select('*')
      .gte('logged_at', today.toISOString())
      .lt('logged_at', tomorrow.toISOString())
      .order('logged_at', { ascending: true });

    setWorkouts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const totals = workouts.reduce(
    (acc, w) => ({
      effort_score: acc.effort_score + w.total_effort_score,
      duration_min: acc.duration_min + w.total_duration_min,
      calories_burned: acc.calories_burned + w.total_calories_burned,
    }),
    { effort_score: 0, duration_min: 0, calories_burned: 0 }
  );

  return { workouts, totals, loading, refetch: fetchWorkouts };
}

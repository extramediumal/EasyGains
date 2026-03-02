import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Meal } from '../types/database';

export function useTodayMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = useCallback(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data } = await supabase
      .from('meals')
      .select('*')
      .gte('logged_at', today.toISOString())
      .lt('logged_at', tomorrow.toISOString())
      .order('logged_at', { ascending: true });

    setMeals(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.total_calories,
      protein: acc.protein + m.total_protein,
      carbs: acc.carbs + m.total_carbs,
      fat: acc.fat + m.total_fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return { meals, totals, loading, refetch: fetchMeals };
}

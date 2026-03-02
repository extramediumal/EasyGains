import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DayBreakdown {
  date: string;
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface WeeklyAvg {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function useWeeklyMeals() {
  const [dailyBreakdown, setDailyBreakdown] = useState<DayBreakdown[]>([]);
  const [weeklyAvg, setWeeklyAvg] = useState<WeeklyAvg>({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { data: meals } = await supabase
        .from('meals')
        .select('logged_at, total_calories, total_protein, total_carbs, total_fat')
        .gte('logged_at', sevenDaysAgo.toISOString())
        .lte('logged_at', now.toISOString())
        .order('logged_at', { ascending: true });

      if (!meals) {
        setLoading(false);
        return;
      }

      // Group by date
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const byDate: Record<string, DayBreakdown> = {};

      // Initialize all 7 days
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(sevenDaysAgo.getDate() + i);
        const key = d.toISOString().split('T')[0];
        byDate[key] = {
          date: key,
          label: dayLabels[d.getDay()],
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      }

      // Sum meals per day
      for (const meal of meals) {
        const key = new Date(meal.logged_at).toISOString().split('T')[0];
        if (byDate[key]) {
          byDate[key].calories += meal.total_calories;
          byDate[key].protein += meal.total_protein;
          byDate[key].carbs += meal.total_carbs;
          byDate[key].fat += meal.total_fat;
        }
      }

      const breakdown = Object.values(byDate);
      setDailyBreakdown(breakdown);

      // Compute averages
      const daysWithData = breakdown.filter((d) => d.calories > 0).length || 1;
      const totalProtein = breakdown.reduce((s, d) => s + d.protein, 0);
      const totalCalories = breakdown.reduce((s, d) => s + d.calories, 0);
      const totalCarbs = breakdown.reduce((s, d) => s + d.carbs, 0);
      const totalFat = breakdown.reduce((s, d) => s + d.fat, 0);

      setWeeklyAvg({
        protein: Math.round(totalProtein / daysWithData),
        calories: Math.round(totalCalories / daysWithData),
        carbs: Math.round(totalCarbs / daysWithData),
        fat: Math.round(totalFat / daysWithData),
      });

      setLoading(false);
    }
    fetch();
  }, []);

  return { dailyBreakdown, weeklyAvg, loading };
}

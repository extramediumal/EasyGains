import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DayBreakdown {
  date: string;
  label: string;
  effort_score: number;
  duration_min: number;
  calories_burned: number;
}

interface WeeklyAvg {
  effort_score: number;
  duration_min: number;
  calories_burned: number;
}

export function useWeeklyWorkouts() {
  const [dailyBreakdown, setDailyBreakdown] = useState<DayBreakdown[]>([]);
  const [weeklyAvg, setWeeklyAvg] = useState<WeeklyAvg>({ effort_score: 0, duration_min: 0, calories_burned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { data: workouts } = await supabase
        .from('workouts')
        .select('logged_at, total_effort_score, total_duration_min, total_calories_burned')
        .gte('logged_at', sevenDaysAgo.toISOString())
        .lte('logged_at', now.toISOString())
        .order('logged_at', { ascending: true });

      if (!workouts) {
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
          effort_score: 0,
          duration_min: 0,
          calories_burned: 0,
        };
      }

      // Sum workouts per day
      for (const workout of workouts) {
        const key = new Date(workout.logged_at).toISOString().split('T')[0];
        if (byDate[key]) {
          byDate[key].effort_score += workout.total_effort_score;
          byDate[key].duration_min += workout.total_duration_min;
          byDate[key].calories_burned += workout.total_calories_burned;
        }
      }

      const breakdown = Object.values(byDate);
      setDailyBreakdown(breakdown);

      // Compute averages
      const daysWithData = breakdown.filter((d) => d.effort_score > 0).length || 1;
      const totalEffort = breakdown.reduce((s, d) => s + d.effort_score, 0);
      const totalDuration = breakdown.reduce((s, d) => s + d.duration_min, 0);
      const totalCalories = breakdown.reduce((s, d) => s + d.calories_burned, 0);

      setWeeklyAvg({
        effort_score: Math.round((totalEffort / daysWithData) * 10) / 10,
        duration_min: Math.round(totalDuration / daysWithData),
        calories_burned: Math.round(totalCalories / daysWithData),
      });

      setLoading(false);
    }
    fetch();
  }, []);

  return { dailyBreakdown, weeklyAvg, loading };
}

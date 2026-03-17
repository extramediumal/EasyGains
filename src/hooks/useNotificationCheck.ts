import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, NotificationTip } from '../types/database';
import {
  shouldSendReactiveNudge,
  buildNotificationPlan,
} from '../lib/notificationEngine';
import { scheduleNotification, cancelAllNotifications } from '../lib/notifications';

const MEAL_WINDOWS = [
  { type: 'breakfast', hour: 9 },
  { type: 'lunch', hour: 13 },
  { type: 'dinner', hour: 19 },
];

export function useNotificationCheck(profile: Profile | null) {
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!profile || hasChecked.current) return;
    hasChecked.current = true;

    async function check() {
      if (profile!.notification_level === 1) {
        await cancelAllNotifications();
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const { data: todayMeals } = await supabase
        .from('meals')
        .select('meal_type')
        .eq('user_id', user.id)
        .gte('logged_at', todayStart.toISOString());

      const loggedTypes = (todayMeals || []).map((m: any) => m.meal_type);

      const { data: lastWorkout } = await supabase
        .from('workouts')
        .select('logged_at')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(1);

      let daysSinceWorkout = 0;
      if (lastWorkout && lastWorkout.length > 0) {
        const lastDate = new Date(lastWorkout[0].logged_at);
        daysSinceWorkout = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );
      }

      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 7);
      const { data: weekMeals } = await supabase
        .from('meals')
        .select('total_protein')
        .eq('user_id', user.id)
        .gte('logged_at', weekStart.toISOString());

      const weeklyProtein = (weekMeals || []).reduce(
        (sum: number, m: any) => sum + (m.total_protein || 0), 0,
      );
      const weeklyProteinTarget = (profile!.desired_weight_lbs || 160) * 7;
      const weeklyProteinPct = weeklyProteinTarget > 0
        ? Math.round((weeklyProtein / weeklyProteinTarget) * 100)
        : 100;

      const { data: tips } = await supabase
        .from('notification_tips')
        .select('*')
        .eq('active', true)
        .limit(10);

      const missedMeals = shouldSendReactiveNudge(now, MEAL_WINDOWS, loggedTypes);

      const plan = buildNotificationPlan({
        level: profile!.notification_level as any,
        personalityTier: profile!.personality_tier,
        missedMeals,
        tips: (tips || []) as NotificationTip[],
        daysSinceWorkout,
        weeklyProteinPct,
      });

      await cancelAllNotifications();
      for (const notification of plan) {
        await scheduleNotification({
          title: notification.title,
          body: notification.body,
          hour: notification.hour,
          minute: notification.minute,
        });
      }
    }

    check();
  }, [profile]);
}

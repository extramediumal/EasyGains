import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { NotificationSetting } from '../types/database';
import { scheduleNotification, cancelAllNotifications } from '../lib/notifications';

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('notification_settings')
        .select('*');
      setSettings(data || []);
      setLoading(false);
    }
    fetch();
  }, []);

  async function syncNotifications() {
    // Cancel all existing
    await cancelAllNotifications();

    // Fetch active settings
    const { data: activeSettings } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('enabled', true);

    if (!activeSettings) return;

    for (const setting of activeSettings) {
      // Pick a random template for this meal type
      const { data: templates } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('trigger_type', 'meal_prompt')
        .eq('active', true)
        .or(`meal_type.eq.${setting.meal_type},meal_type.is.null`);

      if (templates && templates.length > 0) {
        const template = templates[Math.floor(Math.random() * templates.length)];
        const [hourStr, minuteStr] = setting.prompt_time.split(':');
        await scheduleNotification({
          title: template.message_title,
          body: template.message_body,
          hour: parseInt(hourStr, 10),
          minute: parseInt(minuteStr, 10),
        });
      }
    }
  }

  async function updateSetting(mealType: string, promptTime: string, enabled: boolean) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('notification_settings')
      .upsert({
        user_id: user.id,
        meal_type: mealType,
        prompt_time: promptTime,
        enabled,
      }, { onConflict: 'user_id,meal_type' });

    // Re-sync
    await syncNotifications();
  }

  return { settings, loading, updateSetting, syncNotifications };
}

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, NotificationLevel, PersonalityTier } from '../types/database';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(data);
    setLoading(false);
  }, []);

  async function updateNotificationLevel(level: NotificationLevel) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ notification_level: level })
      .eq('id', user.id);
    await refetch();
  }

  async function updatePersonalityTier(tier: PersonalityTier) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ personality_tier: tier })
      .eq('id', user.id);
    await refetch();
  }

  useEffect(() => { refetch(); }, [refetch]);

  return { profile, loading, refetch, updateNotificationLevel, updatePersonalityTier };
}

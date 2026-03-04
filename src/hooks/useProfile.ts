import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/database';

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

  useEffect(() => { refetch(); }, [refetch]);

  return { profile, loading, refetch };
}

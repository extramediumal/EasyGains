import React, { createContext, useContext, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  isPasswordRecovery: boolean;
  clearPasswordRecovery: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  isPasswordRecovery: false,
  clearPasswordRecovery: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

async function handleDeepLink(url: string) {
  // Supabase recovery URLs look like: easygains://reset-password#access_token=...&type=recovery
  const fragment = url.split('#')[1];
  if (!fragment) return;
  const params = new URLSearchParams(fragment);
  const type = params.get('type');
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (type === 'recovery' && accessToken && refreshToken) {
    await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        }
      }
    );

    // Handle deep link when app opens cold from a recovery link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Handle deep link while app is running/backgrounded
    const linkingSub = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.unsubscribe();
      linkingSub.remove();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      loading,
      isPasswordRecovery,
      clearPasswordRecovery: () => setIsPasswordRecovery(false),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

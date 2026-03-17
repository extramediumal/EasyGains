import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';

export default function AuthLayout() {
  const { session, loading, isPasswordRecovery } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (session && isPasswordRecovery) {
      router.replace('/(auth)/reset-password');
    } else if (session && !isPasswordRecovery) {
      router.replace('/(app)');
    }
  }, [loading, session, isPasswordRecovery]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

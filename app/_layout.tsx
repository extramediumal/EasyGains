import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '../src/providers/AuthProvider';
import { setupNotifications } from '../src/lib/notifications';

export default function RootLayout() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

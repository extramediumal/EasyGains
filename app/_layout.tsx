import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '../src/providers/AuthProvider';
import { SubscriptionProvider } from '../src/providers/SubscriptionProvider';
import { setupNotifications } from '../src/lib/notifications';

export default function RootLayout() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Slot />
      </SubscriptionProvider>
    </AuthProvider>
  );
}

import { useCallback } from 'react';
import { cancelAllNotifications } from '../lib/notifications';

export function useNotificationSettings() {
  const resetNotifications = useCallback(async () => {
    await cancelAllNotifications();
  }, []);

  return { resetNotifications };
}

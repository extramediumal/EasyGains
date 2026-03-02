import { scheduleNotification, cancelAllNotifications } from '../../src/lib/notifications';

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
  AndroidImportance: { HIGH: 4 },
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
}));

jest.mock('expo-device', () => ({
  isDevice: true,
}));

describe('notifications', () => {
  it('schedules a notification', async () => {
    const Notifications = require('expo-notifications');
    const id = await scheduleNotification({
      title: 'Test',
      body: 'Test body',
      hour: 12,
      minute: 30,
    });
    expect(id).toBe('notification-id');
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('cancels all notifications', async () => {
    const Notifications = require('expo-notifications');
    await cancelAllNotifications();
    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
  });
});

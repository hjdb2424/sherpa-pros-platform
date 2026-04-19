import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior — show alerts, play sounds, update badge
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request permission and register for push notifications.
 * Returns the Expo push token string, or null if permission denied / not a device.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  // Check existing permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permission if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission denied');
    return null;
  }

  // Android requires a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00a9e0',
    });
  }

  // Get the Expo push token
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'sherpa-pros', // matches app.json slug
    });
    console.log('Push token:', tokenData.data);
    return tokenData.data;
  } catch (error) {
    console.error('Failed to get push token:', error);
    return null;
  }
}

/**
 * Schedule an immediate local notification.
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data ?? {},
      sound: 'default',
    },
    trigger: null, // null = immediate
  });
}

/**
 * Hook that listens for incoming notifications (foreground) and calls the callback.
 * Automatically cleans up the subscription on unmount.
 */
export function useNotificationListener(
  onReceived: (notification: Notifications.Notification) => void
): void {
  const callbackRef = useRef(onReceived);
  callbackRef.current = onReceived;

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        callbackRef.current(notification);
      }
    );

    return () => subscription.remove();
  }, []);
}

/**
 * Hook that listens for notification response (user tapped a notification).
 * Returns the notification data so the caller can navigate accordingly.
 */
export function useNotificationResponseListener(
  onResponse: (response: Notifications.NotificationResponse) => void
): void {
  const callbackRef = useRef(onResponse);
  callbackRef.current = onResponse;

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        callbackRef.current(response);
      }
    );

    return () => subscription.remove();
  }, []);
}

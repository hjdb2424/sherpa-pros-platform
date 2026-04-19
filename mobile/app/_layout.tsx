import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/lib/auth';
import {
  registerForPushNotifications,
  useNotificationResponseListener,
} from '@/lib/notifications';

export default function RootLayout() {
  const router = useRouter();

  // Register for push notifications on mount
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  // Navigate based on notification tap data
  useNotificationResponseListener((response) => {
    const data = response.notification.request.content.data;
    if (!data?.type) return;

    switch (data.type) {
      case 'new_job':
        router.push('/(pro)/jobs');
        break;
      case 'bid_accepted':
        router.push('/(client)/my-jobs');
        break;
      case 'dispatch_alert':
        router.push('/(emergency)/tracking');
        break;
      case 'message':
        router.push('/(pro)/messages');
        break;
    }
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(client)" />
          <Stack.Screen name="(pro)" />
          <Stack.Screen name="(emergency)" />
          <Stack.Screen name="notifications" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

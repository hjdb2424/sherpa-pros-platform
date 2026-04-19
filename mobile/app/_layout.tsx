import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/lib/auth';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(client)" />
            <Stack.Screen name="(pro)" />
            <Stack.Screen name="(emergency)" />
            <Stack.Screen name="notifications" />
          </Stack>
        </AuthProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

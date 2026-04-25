import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/lib/auth';
import { colors } from '@/lib/theme';

export default function RootIndex() {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (role === 'pro') {
    return <Redirect href="/(pro)" />;
  }

  if (role === 'pm') {
    return <Redirect href="/(pm)" />;
  }

  if (role === 'client') {
    return <Redirect href="/(client)" />;
  }

  // No role set — go to role selection
  return <Redirect href="/(auth)/select-role" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

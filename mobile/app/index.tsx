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

  // Authenticated but role missing or unrecognized — default to client.
  // Mirrors toMobileRole() in sign-in.tsx so role-picker is never an
  // automatic destination. Users can still reach /select-role manually
  // for role-switching from their profile screen.
  return <Redirect href="/(client)" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/lib/theme';

export default function MyJobsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Jobs</Text>
      <Text style={styles.subtitle}>Coming in Phase 2</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.heading, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },
});

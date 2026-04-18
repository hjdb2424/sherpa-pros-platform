import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/lib/auth';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import { colors, spacing, typography } from '@/lib/theme';

const TEST_USERS = [
  { name: 'John Smith', email: 'testclient@test.com', role: 'client' as const, badge: 'Standard User', initials: 'JS', color: colors.primary },
  { name: 'Sarah Johnson', email: 'promanager@test.com', role: 'pro' as const, badge: 'Pro Manager', initials: 'SJ', color: colors.success },
  { name: 'Mike Rodriguez', email: 'contractor@test.com', role: 'pro' as const, badge: 'Service Provider', initials: 'MR', color: colors.warning },
];

export default function SignInScreen() {
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleTestUser(user: typeof TEST_USERS[0]) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signIn(user.role, user.name, user.email);
    router.replace(user.role === 'client' ? '/(client)' : '/(pro)');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          <Text style={{ color: colors.text }}>SHERPA </Text>
          <Text style={{ color: colors.accent }}>PROS</Text>
        </Text>
        <Text style={styles.title}>Testing Environment</Text>
        <Text style={styles.subtitle}>Development & Field Testing Portal</Text>
        <View style={styles.badges}>
          <Badge label="Beta Testing" variant="primary" />
          <Badge label="Secure" variant="neutral" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Available Test Users</Text>
      {TEST_USERS.map((user) => (
        <Pressable key={user.email} onPress={() => handleTestUser(user)}>
          <Card style={styles.userCard} variant="outlined">
            <View style={styles.userRow}>
              <Avatar initials={user.initials} color={user.color} />
              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Badge label={user.badge} />
                </View>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
          </Card>
        </Pressable>
      ))}

      <Text style={styles.disclaimer}>
        This is a testing environment. No real accounts are used.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSecondary },
  content: { padding: spacing.xl, paddingTop: 80 },
  header: { alignItems: 'center', marginBottom: spacing.xxl },
  logo: { fontSize: 36, fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 20, fontWeight: '600', color: colors.text, marginTop: spacing.md },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.md },
  userCard: { marginBottom: spacing.md },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  userInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  userName: { fontSize: 15, fontWeight: '600', color: colors.text },
  userEmail: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  disclaimer: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});

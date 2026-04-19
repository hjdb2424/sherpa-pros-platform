import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/lib/auth';
import Card from '@/components/common/Card';
import { colors, spacing, typography, shadows } from '@/lib/theme';
import Logo from '@/components/brand/Logo';

export default function SelectRoleScreen() {
  const { switchRole } = useAuth();
  const router = useRouter();

  async function handleSelect(role: 'pro' | 'client') {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await switchRole(role);
    router.replace(role === 'client' ? '/(client)' : '/(pro)');
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Logo size="lg" />
      </View>
      <Text style={styles.subtitle}>How will you be using the platform?</Text>

      <View style={styles.cards}>
        <Pressable onPress={() => handleSelect('pro')} style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}>
          <Card style={styles.roleCard}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.iconText, { color: colors.primary }]}>&#x1f527;</Text>
            </View>
            <Text style={styles.roleTitle}>I'm a Pro</Text>
            <Text style={styles.roleDescription}>Find jobs, manage clients, and grow my business.</Text>
          </Card>
        </Pressable>

        <Pressable onPress={() => handleSelect('client')} style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}>
          <Card style={styles.roleCard}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.iconText, { color: colors.primary }]}>&#x1f3e0;</Text>
            </View>
            <Text style={styles.roleTitle}>I need a Pro</Text>
            <Text style={styles.roleDescription}>Post jobs, find contractors, and manage projects.</Text>
          </Card>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: spacing.xl },
  logoWrapper: { alignItems: 'center', marginBottom: spacing.xs },
  subtitle: { fontSize: 16, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xxl },
  cards: { gap: spacing.lg },
  cardPressable: {},
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  roleCard: { alignItems: 'center', paddingVertical: spacing.xxl },
  iconCircle: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  iconText: { fontSize: 28 },
  roleTitle: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  roleDescription: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});

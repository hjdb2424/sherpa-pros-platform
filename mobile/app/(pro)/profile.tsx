import { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Logo from '@/components/brand/Logo';

interface SettingsItem {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function ProProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userName, email, signOut, switchRole } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync('sherpa_onboarding_complete').then((val) => {
      setOnboardingComplete(val === 'true');
    });
  }, []);

  const initials = (userName ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSwitchRole = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await switchRole('client');
    router.replace('/(client)');
  }, [switchRole, router]);

  const handleSignOut = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  }, [signOut, router]);

  const settingsItems: SettingsItem[] = [
    { label: 'Notifications', iconName: 'notifications-outline', onPress: () => Alert.alert('Coming soon') },
    { label: 'Payment Methods', iconName: 'card-outline', onPress: () => Alert.alert('Coming soon') },
    { label: 'Help & Support', iconName: 'help-circle-outline', onPress: () => Alert.alert('Coming soon') },
    { label: 'About', iconName: 'information-circle-outline', onPress: () => Alert.alert('Sherpa Pros v1.0.0') },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {!onboardingComplete && (
        <Pressable
          style={styles.onboardingBanner}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/pro-onboarding');
          }}
        >
          <Ionicons name="alert-circle" size={20} color={colors.primary} />
          <Text style={styles.onboardingBannerText}>
            Complete your profile to start receiving jobs
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarRing}>
            <Avatar initials={initials} size={80} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{userName ?? 'User'}</Text>
          <Text style={styles.userEmail}>{email ?? ''}</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons key={s} name={s <= 4 ? 'star' : 'star-half'} size={16} color={colors.accent} />
            ))}
            <Text style={styles.ratingText}>4.9</Text>
          </View>
          <View style={styles.badgeRow}>
            <Badge label="Pro" variant="success" />
            <View style={styles.tierBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#b8860b" />
              <Text style={styles.tierText}>Gold Badge</Text>
            </View>
          </View>
          <Text style={styles.memberSince}>Member since April 2026</Text>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          {settingsItems.map((item, index) => (
            <Pressable
              key={item.label}
              style={[
                styles.settingsRow,
                index < settingsItems.length - 1 && styles.settingsRowBorder,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                item.onPress();
              }}
            >
              <Ionicons name={item.iconName} size={20} color={colors.textMuted} style={styles.settingsIconView} />
              <Text style={styles.settingsLabel}>{item.label}</Text>
              <Text style={styles.settingsChevron}>{'\u203A'}</Text>
            </Pressable>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Switch to Client"
            onPress={handleSwitchRole}
            variant="ghost"
            fullWidth
          />
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>

        <View style={styles.versionRow}>
          <Logo size="sm" />
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.text,
  },
  onboardingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  onboardingBannerText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 44,
    borderWidth: 2.5,
    borderColor: colors.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: '#fef3c7',
  },
  tierText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#b8860b',
  },
  memberSince: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  userName: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.md,
  },
  userEmail: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  settingsSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingsIconView: {
    marginRight: spacing.md,
  },
  settingsLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  settingsChevron: {
    fontSize: 24,
    color: colors.textMuted,
  },
  actionsSection: {
    gap: spacing.md,
  },
  signOutButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  signOutText: {
    ...typography.body,
    color: colors.danger,
    fontWeight: '600',
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  versionText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});

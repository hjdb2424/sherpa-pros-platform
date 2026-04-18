import { useCallback } from 'react';
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
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

interface SettingsItem {
  label: string;
  icon: string;
  onPress: () => void;
}

export default function ClientProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userName, email, signOut, switchRole } = useAuth();

  const initials = (userName ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSwitchRole = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await switchRole('pro');
    router.replace('/(pro)');
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
    { label: 'Notifications', icon: '\u{1F514}', onPress: () => Alert.alert('Coming soon') },
    { label: 'Payment Methods', icon: '\u{1F4B3}', onPress: () => Alert.alert('Coming soon') },
    { label: 'Help & Support', icon: '\u{2753}', onPress: () => Alert.alert('Coming soon') },
    { label: 'About', icon: '\u{2139}\uFE0F', onPress: () => Alert.alert('Sherpa Pros v1.0.0') },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        {/* User Info */}
        <View style={styles.userSection}>
          <Avatar initials={initials} size={80} color={colors.primary} />
          <Text style={styles.userName}>{userName ?? 'User'}</Text>
          <Text style={styles.userEmail}>{email ?? ''}</Text>
          <Badge label="Client" variant="primary" />
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
              <Text style={styles.settingsIcon}>{item.icon}</Text>
              <Text style={styles.settingsLabel}>{item.label}</Text>
              <Text style={styles.settingsChevron}>{'\u203A'}</Text>
            </Pressable>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Switch to Pro"
            onPress={handleSwitchRole}
            variant="ghost"
            fullWidth
          />
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
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
  settingsIcon: {
    fontSize: 20,
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
});

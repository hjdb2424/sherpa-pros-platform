import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Logo from '@/components/brand/Logo';

// ---------------------------------------------------------------------------
// Menu items
// ---------------------------------------------------------------------------

interface MenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  action?: 'signout';
  color?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Company Profile', icon: 'business-outline', route: '/(pro)/profile' },
  { label: 'Settings', icon: 'settings-outline' },
  { label: 'Team Management', icon: 'people-outline' },
  { label: 'Reports', icon: 'document-text-outline' },
  { label: 'Help & Support', icon: 'help-circle-outline' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut, userName, email } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Logo size="sm" />
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User info card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(userName ?? 'PM').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{userName ?? 'Property Manager'}</Text>
            <Text style={styles.userEmail}>{email ?? 'pm@example.com'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>Property Manager</Text>
            </View>
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (item.route) {
                  router.push(item.route as any);
                }
                // Stubs just have haptic feedback
              }}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        {/* Sign Out */}
        <Pressable
          style={({ pressed }) => [styles.signOutButton, pressed && styles.signOutPressed]}
          onPress={async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await signOut();
            router.replace('/(auth)/select-role');
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        {/* Version */}
        <Text style={styles.version}>Sherpa Pros v1.0.0</Text>
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
    paddingBottom: 100,
  },

  // User card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  userName: {
    ...typography.subheading,
    color: colors.text,
  },
  userEmail: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  roleBadge: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },

  // Menu
  menuSection: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuItemPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    flex: 1,
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.dangerLight,
    backgroundColor: colors.surface,
  },
  signOutPressed: {
    backgroundColor: colors.dangerLight,
  },
  signOutText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.danger,
  },

  // Version
  version: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

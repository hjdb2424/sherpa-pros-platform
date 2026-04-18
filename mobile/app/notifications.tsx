import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';

interface Notification {
  id: string;
  type: 'new_job' | 'bid_accepted' | 'dispatch_alert' | 'message' | 'payment' | 'rating';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const TYPE_CONFIG: Record<Notification['type'], { icon: string; color: string }> = {
  new_job: { icon: '\u{1F4CB}', color: '#00a9e0' },
  bid_accepted: { icon: '\u2705', color: '#10b981' },
  dispatch_alert: { icon: '\u{1F6A8}', color: '#dc2626' },
  message: { icon: '\u{1F4AC}', color: '#71717a' },
  payment: { icon: '\u{1F4B5}', color: '#10b981' },
  rating: { icon: '\u2B50', color: '#a855f7' },
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'dispatch_alert', title: 'Emergency Dispatch', description: 'Water damage emergency near your location. Respond now!', timestamp: '2m ago', read: false },
  { id: '2', type: 'bid_accepted', title: 'Bid Accepted!', description: 'John Davidson accepted your bid for Kitchen Faucet Replacement.', timestamp: '15m ago', read: false },
  { id: '3', type: 'message', title: 'New Message', description: 'Mike Rodriguez sent you a message about the plumbing job.', timestamp: '1h ago', read: false },
  { id: '4', type: 'new_job', title: 'New Job Nearby', description: 'Panel Upgrade 100A to 200A - $2,500 budget, 1.7 mi away.', timestamp: '2h ago', read: true },
  { id: '5', type: 'payment', title: 'Payment Received', description: 'You received $350.00 for Kitchen Faucet Replacement.', timestamp: '5h ago', read: true },
  { id: '6', type: 'rating', title: 'New Rating', description: 'Maria Santos rated you 5 stars! "Excellent work on the fence."', timestamp: '1d ago', read: true },
  { id: '7', type: 'new_job', title: 'New Job Nearby', description: 'Bathroom Remodel - $12,000 budget, 1.1 mi away.', timestamp: '1d ago', read: true },
  { id: '8', type: 'dispatch_alert', title: 'Dispatch Complete', description: 'Emergency dispatch for furnace repair was completed successfully.', timestamp: '2d ago', read: true },
  { id: '9', type: 'payment', title: 'Payment Received', description: 'You received $800.00 for Emergency Water Heater Repair.', timestamp: '3d ago', read: true },
  { id: '10', type: 'message', title: 'New Message', description: 'Sarah Chen sent you photos of the completed deck staining.', timestamp: '3d ago', read: true },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handlePress = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => {
      const config = TYPE_CONFIG[item.type];
      return (
        <Pressable
          style={[styles.notifRow, !item.read && styles.notifRowUnread]}
          onPress={() => handlePress(item.id)}
        >
          <View style={[styles.iconCircle, { backgroundColor: config.color + '1A' }]}>
            <Text style={styles.iconEmoji}>{config.icon}</Text>
          </View>
          <View style={styles.notifContent}>
            <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
              {item.title}
            </Text>
            <Text style={styles.notifDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.notifTimestamp}>{item.timestamp}</Text>
          </View>
        </Pressable>
      );
    },
    [handlePress],
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{'\u{1F514}'}</Text>
      <Text style={styles.emptyTitle}>No notifications yet</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 12,
  },
  backButton: {},
  backArrow: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    ...typography.heading,
    color: colors.text,
  },
  listContent: {
    paddingBottom: 100,
  },
  listContentEmpty: {
    flex: 1,
  },

  // Notification row
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  notifRowUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconEmoji: {
    fontSize: 18,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  notifTitleUnread: {
    fontWeight: '700',
  },
  notifDescription: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: 4,
  },
  notifTimestamp: {
    ...typography.caption,
    color: colors.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.lg + 40 + spacing.md,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.text,
  },
});

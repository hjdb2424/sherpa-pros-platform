import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';

interface MockJob {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  budgetMin: number;
  budgetMax: number;
  assignedPro: { name: string; initials: string } | null;
  postedAt: string;
  bidCount: number;
}

const MOCK_JOBS: MockJob[] = [
  {
    id: '1',
    title: 'Fix leaking kitchen faucet',
    category: 'Plumbing',
    categoryIcon: '\u{1F6BF}',
    status: 'in_progress',
    budgetMin: 200,
    budgetMax: 500,
    assignedPro: { name: 'Mike Thompson', initials: 'MT' },
    postedAt: '2 days ago',
    bidCount: 4,
  },
  {
    id: '2',
    title: 'Install recessed lighting in living room',
    category: 'Electrical',
    categoryIcon: '\u26A1',
    status: 'open',
    budgetMin: 800,
    budgetMax: 1500,
    assignedPro: null,
    postedAt: '1 day ago',
    bidCount: 2,
  },
  {
    id: '3',
    title: 'Deck staining and sealing',
    category: 'Painting',
    categoryIcon: '\u{1F3A8}',
    status: 'completed',
    budgetMin: 400,
    budgetMax: 800,
    assignedPro: { name: 'Sarah Chen', initials: 'SC' },
    postedAt: '2 weeks ago',
    bidCount: 6,
  },
  {
    id: '4',
    title: 'HVAC annual maintenance',
    category: 'HVAC',
    categoryIcon: '\u2744\uFE0F',
    status: 'open',
    budgetMin: 150,
    budgetMax: 300,
    assignedPro: null,
    postedAt: '3 hours ago',
    bidCount: 0,
  },
];

const STATUS_BADGE: Record<string, { label: string; variant: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' }> = {
  open: { label: 'Open', variant: 'primary' },
  in_progress: { label: 'In Progress', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'neutral' },
};

export default function MyJobsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [jobs] = useState<MockJob[]>(MOCK_JOBS);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const handleJobPress = useCallback((job: MockJob) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Coming soon', `Job detail for "${job.title}" is coming in the next update.`);
  }, []);

  const handlePostJob = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(client)/post-job');
  }, [router]);

  const renderJobCard = useCallback(
    ({ item }: { item: MockJob }) => {
      const badge = STATUS_BADGE[item.status];
      return (
        <Pressable onPress={() => handleJobPress(item)}>
          <Card style={styles.jobCard} variant="elevated">
            <View style={styles.cardHeader}>
              <Text style={styles.categoryIcon}>{item.categoryIcon}</Text>
              <View style={styles.cardHeaderText}>
                <Text style={styles.jobTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.jobCategory}>{item.category}</Text>
              </View>
              <Badge label={badge.label} variant={badge.variant} />
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>
                  ${item.budgetMin.toLocaleString()} - ${item.budgetMax.toLocaleString()}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Bids</Text>
                <Text style={styles.detailValue}>{item.bidCount}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Posted</Text>
                <Text style={styles.detailValue}>{item.postedAt}</Text>
              </View>
            </View>

            {item.assignedPro && (
              <View style={styles.proRow}>
                <Avatar initials={item.assignedPro.initials} size={28} />
                <Text style={styles.proName}>{item.assignedPro.name}</Text>
              </View>
            )}
          </Card>
        </Pressable>
      );
    },
    [handleJobPress],
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{'\u{1F4CB}'}</Text>
      <Text style={styles.emptyTitle}>No jobs yet</Text>
      <Text style={styles.emptyDescription}>
        Post your first job and get matched with verified local pros.
      </Text>
      <View style={styles.emptyCTA}>
        <Pressable style={styles.emptyButton} onPress={handlePostJob}>
          <Text style={styles.emptyButtonText}>Post a Job</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Jobs</Text>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          jobs.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmpty}
      />

      <Pressable
        style={[styles.fab, { bottom: insets.bottom + spacing.xl }]}
        onPress={handlePostJob}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
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
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  listContentEmpty: {
    flex: 1,
  },
  jobCard: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  cardHeaderText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  jobTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  jobCategory: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  proName: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
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
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyCTA: {
    width: '100%',
    maxWidth: 240,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  emptyButtonText: {
    color: colors.textInverse,
    fontWeight: '600',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primaryGlow,
  },
  fabIcon: {
    color: colors.textInverse,
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
});

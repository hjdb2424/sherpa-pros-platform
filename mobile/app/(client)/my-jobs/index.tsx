import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import SkeletonCard from '@/components/common/SkeletonCard';
import { apiFetch } from '@/lib/api';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Plumbing: 'water-outline',
  Electrical: 'flash-outline',
  HVAC: 'thermometer-outline',
  Painting: 'color-palette-outline',
  Roofing: 'home-outline',
  General: 'construct-outline',
  Carpentry: 'hammer-outline',
};

interface MockJob {
  id: string;
  title: string;
  category: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  budgetMin: number;
  budgetMax: number;
  assignedPro: { name: string; initials: string } | null;
  postedAt: string;
  bidCount: number;
}

const MOCK_JOBS: MockJob[] = [
  // OPEN — waiting for bids
  {
    id: '1',
    title: 'HVAC annual maintenance',
    category: 'HVAC',

    status: 'open',
    budgetMin: 150,
    budgetMax: 300,
    assignedPro: null,
    postedAt: '3 hours ago',
    bidCount: 0,
  },
  {
    id: '2',
    title: 'Install recessed lighting in living room',
    category: 'Electrical',

    status: 'open',
    budgetMin: 800,
    budgetMax: 1500,
    assignedPro: null,
    postedAt: '1 day ago',
    bidCount: 2,
  },
  {
    id: '3',
    title: 'Replace front door weatherstripping',
    category: 'General',

    status: 'open',
    budgetMin: 100,
    budgetMax: 250,
    assignedPro: null,
    postedAt: '5 hours ago',
    bidCount: 1,
  },
  // IN PROGRESS — various stages
  {
    id: '4',
    title: 'Fix leaking kitchen faucet',
    category: 'Plumbing',

    status: 'in_progress',
    budgetMin: 200,
    budgetMax: 500,
    assignedPro: { name: 'Mike Rodriguez', initials: 'MR' },
    postedAt: '2 days ago',
    bidCount: 4,
  },
  {
    id: '5',
    title: 'Bathroom remodel - tile and fixtures',
    category: 'General',

    status: 'in_progress',
    budgetMin: 8000,
    budgetMax: 15000,
    assignedPro: { name: 'Carlos Rivera', initials: 'CR' },
    postedAt: '2 weeks ago',
    bidCount: 7,
  },
  {
    id: '6',
    title: 'Panel upgrade 100A to 200A',
    category: 'Electrical',

    status: 'in_progress',
    budgetMin: 2000,
    budgetMax: 3500,
    assignedPro: { name: 'Sarah Chen', initials: 'SC' },
    postedAt: '5 days ago',
    bidCount: 3,
  },
  {
    id: '7',
    title: 'Emergency water heater replacement',
    category: 'Plumbing',

    status: 'in_progress',
    budgetMin: 1200,
    budgetMax: 2500,
    assignedPro: { name: 'Mike Rodriguez', initials: 'MR' },
    postedAt: '1 day ago',
    bidCount: 2,
  },
  // COMPLETED
  {
    id: '8',
    title: 'Deck staining and sealing',
    category: 'Painting',

    status: 'completed',
    budgetMin: 400,
    budgetMax: 800,
    assignedPro: { name: 'Diana Brooks', initials: 'DB' },
    postedAt: '2 weeks ago',
    bidCount: 6,
  },
  {
    id: '9',
    title: 'Furnace tune-up and filter replacement',
    category: 'HVAC',

    status: 'completed',
    budgetMin: 150,
    budgetMax: 250,
    assignedPro: { name: 'James Wilson', initials: 'JW' },
    postedAt: '1 month ago',
    bidCount: 3,
  },
  {
    id: '10',
    title: 'Gutter cleaning and repair',
    category: 'General',

    status: 'completed',
    budgetMin: 200,
    budgetMax: 400,
    assignedPro: { name: 'Tom Baker', initials: 'TB' },
    postedAt: '3 weeks ago',
    bidCount: 5,
  },
  {
    id: '11',
    title: 'Install smart thermostat',
    category: 'HVAC',

    status: 'completed',
    budgetMin: 200,
    budgetMax: 400,
    assignedPro: { name: 'Sarah Chen', initials: 'SC' },
    postedAt: '1 month ago',
    bidCount: 2,
  },
  // CANCELLED
  {
    id: '12',
    title: 'Roof inspection after storm',
    category: 'Roofing',

    status: 'cancelled',
    budgetMin: 300,
    budgetMax: 600,
    assignedPro: null,
    postedAt: '1 week ago',
    bidCount: 1,
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
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<MockJob[]>(MOCK_JOBS);

  useEffect(() => {
    apiFetch<any>('/jobs?role=client')
      .then((data) => {
        if (data.jobs?.length > 0) setJobs(data.jobs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    apiFetch<any>('/jobs?role=client')
      .then((data) => {
        if (data.jobs?.length > 0) setJobs(data.jobs);
      })
      .catch(() => {})
      .finally(() => setRefreshing(false));
  }, []);

  const handleJobPress = useCallback((job: MockJob) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/(client)/my-jobs/${job.id}`);
  }, [router]);

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
              <Ionicons
                name={CATEGORY_ICONS[item.category] ?? 'construct-outline'}
                size={28}
                color={colors.primary}
                style={styles.categoryIcon}
              />
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
      <Ionicons name="briefcase-outline" size={64} color={colors.textMuted} style={{ marginBottom: spacing.lg }} />
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

      {loading ? (
        <SkeletonCard count={4} />
      ) : (
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
      )}

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

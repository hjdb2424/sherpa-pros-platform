import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

type TabKey = 'available' | 'bids' | 'active' | 'completed';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'available', label: 'Available' },
  { key: 'bids', label: 'My Bids' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

interface AvailableJob {
  id: string;
  title: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  urgency: 'emergency' | 'standard' | 'flexible';
  distance: string;
}

interface BidJob {
  id: string;
  title: string;
  bidAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
}

interface ActiveJob {
  id: string;
  title: string;
  clientName: string;
  milestoneProgress: number;
  totalMilestones: number;
}

interface CompletedJob {
  id: string;
  title: string;
  finalAmount: number;
  rating: number;
}

const AVAILABLE_JOBS: AvailableJob[] = [
  { id: 'a1', title: 'Emergency: Burst pipe in basement', category: 'Plumbing', budgetMin: 500, budgetMax: 1500, urgency: 'emergency', distance: '0.8 mi' },
  { id: 'a2', title: 'Fix leaking kitchen faucet', category: 'Plumbing', budgetMin: 200, budgetMax: 500, urgency: 'standard', distance: '2.3 mi' },
  { id: 'a3', title: 'Install recessed lighting (6 cans)', category: 'Electrical', budgetMin: 800, budgetMax: 1500, urgency: 'standard', distance: '5.1 mi' },
  { id: 'a4', title: 'Deck staining and sealing - 400 sqft', category: 'Painting', budgetMin: 400, budgetMax: 800, urgency: 'flexible', distance: '8.7 mi' },
  { id: 'a5', title: 'Replace bathroom vanity + faucet', category: 'General', budgetMin: 600, budgetMax: 1200, urgency: 'standard', distance: '3.4 mi' },
  { id: 'a6', title: 'Furnace not heating - no heat emergency', category: 'HVAC', budgetMin: 300, budgetMax: 800, urgency: 'emergency', distance: '1.2 mi' },
  { id: 'a7', title: 'Install EV charger in garage (240V)', category: 'Electrical', budgetMin: 1200, budgetMax: 2500, urgency: 'flexible', distance: '6.5 mi' },
  { id: 'a8', title: 'Roof leak repair after storm', category: 'Roofing', budgetMin: 500, budgetMax: 2000, urgency: 'emergency', distance: '4.1 mi' },
  { id: 'a9', title: 'Interior painting - 3 bedrooms', category: 'Painting', budgetMin: 1500, budgetMax: 3000, urgency: 'flexible', distance: '7.3 mi' },
  { id: 'a10', title: 'Replace front door and frame', category: 'Carpentry', budgetMin: 800, budgetMax: 2000, urgency: 'standard', distance: '3.9 mi' },
];

const BID_JOBS: BidJob[] = [
  { id: 'b1', title: 'Kitchen sink installation', bidAmount: 450, status: 'pending' },
  { id: 'b2', title: 'Ceiling fan wiring', bidAmount: 280, status: 'accepted' },
  { id: 'b3', title: 'Drywall patch and paint', bidAmount: 350, status: 'rejected' },
  { id: 'b4', title: 'Toilet replacement (2 units)', bidAmount: 650, status: 'pending' },
  { id: 'b5', title: 'Outlet and switch replacement', bidAmount: 420, status: 'pending' },
  { id: 'b6', title: 'Basement waterproofing consult', bidAmount: 1800, status: 'accepted' },
];

const ACTIVE_JOBS: ActiveJob[] = [
  { id: 'c1', title: 'Bathroom remodel - Phase 1 demo', clientName: 'John D.', milestoneProgress: 3, totalMilestones: 5 },
  { id: 'c2', title: 'Fence repair - 40ft section', clientName: 'Maria S.', milestoneProgress: 1, totalMilestones: 3 },
  { id: 'c3', title: 'Panel upgrade 100A to 200A', clientName: 'Tom A.', milestoneProgress: 2, totalMilestones: 4 },
  { id: 'c4', title: 'Kitchen faucet + garbage disposal', clientName: 'Rachel K.', milestoneProgress: 1, totalMilestones: 2 },
  { id: 'c5', title: 'Water heater replacement (50 gal)', clientName: 'Lisa M.', milestoneProgress: 0, totalMilestones: 3 },
];

const COMPLETED_JOBS: CompletedJob[] = [
  { id: 'd1', title: 'Water heater replacement', finalAmount: 1200, rating: 5 },
  { id: 'd2', title: 'Garbage disposal install', finalAmount: 350, rating: 4 },
  { id: 'd3', title: 'Outdoor lighting setup (8 fixtures)', finalAmount: 950, rating: 5 },
  { id: 'd4', title: 'Sump pump installation', finalAmount: 1800, rating: 5 },
  { id: 'd5', title: 'Bathroom exhaust fan replacement', finalAmount: 275, rating: 4 },
  { id: 'd6', title: 'Whole house surge protector', finalAmount: 450, rating: 5 },
  { id: 'd7', title: 'Deck board replacement (12 boards)', finalAmount: 680, rating: 4 },
  { id: 'd8', title: 'Toilet repair - running toilet', finalAmount: 180, rating: 5 },
];

const URGENCY_BADGE: Record<string, { label: string; variant: 'danger' | 'warning' | 'success' }> = {
  emergency: { label: 'Urgent', variant: 'danger' },
  standard: { label: 'Standard', variant: 'warning' },
  flexible: { label: 'Flexible', variant: 'success' },
};

const BID_BADGE: Record<string, { label: string; variant: 'warning' | 'success' | 'neutral' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  accepted: { label: 'Accepted', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'neutral' },
};

export default function ProJobsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('available');
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleCardPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Job Detail', 'Coming in next update');
  }, []);

  const handleQuickBid = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Quick Bid', 'Bidding flow coming in next update');
  }, []);

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={i < count ? styles.starFilled : styles.starEmpty}>
        {'\u2605'}
      </Text>
    ));
  };

  const renderAvailableItem = ({ item }: { item: AvailableJob }) => {
    const urgency = URGENCY_BADGE[item.urgency];
    return (
      <Pressable onPress={handleCardPress}>
        <Card style={styles.jobCard} variant="elevated">
          <View style={styles.cardRow}>
            <View style={styles.cardContent}>
              <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.jobMeta}>{item.category} - {item.distance}</Text>
            </View>
            <Badge label={urgency.label} variant={urgency.variant} />
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.budgetText}>
              ${item.budgetMin.toLocaleString()} - ${item.budgetMax.toLocaleString()}
            </Text>
            <Button title="Quick Bid" onPress={handleQuickBid} size="sm" />
          </View>
        </Card>
      </Pressable>
    );
  };

  const renderBidItem = ({ item }: { item: BidJob }) => {
    const badge = BID_BADGE[item.status];
    return (
      <Pressable onPress={handleCardPress}>
        <Card style={styles.jobCard} variant="elevated">
          <View style={styles.cardRow}>
            <View style={styles.cardContent}>
              <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.bidAmount}>${item.bidAmount.toLocaleString()}</Text>
            </View>
            <Badge label={badge.label} variant={badge.variant} />
          </View>
        </Card>
      </Pressable>
    );
  };

  const renderActiveItem = ({ item }: { item: ActiveJob }) => {
    const progress = item.milestoneProgress / item.totalMilestones;
    return (
      <Pressable onPress={handleCardPress}>
        <Card style={styles.jobCard} variant="elevated">
          <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.jobMeta}>Client: {item.clientName}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {item.milestoneProgress}/{item.totalMilestones} milestones
            </Text>
          </View>
        </Card>
      </Pressable>
    );
  };

  const renderCompletedItem = ({ item }: { item: CompletedJob }) => (
    <Pressable onPress={handleCardPress}>
      <Card style={styles.jobCard} variant="elevated">
        <View style={styles.cardRow}>
          <View style={styles.cardContent}>
            <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.completedAmount}>${item.finalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.starsRow}>{renderStars(item.rating)}</View>
        </View>
      </Card>
    </Pressable>
  );

  const renderEmptyTab = (message: string) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{'\u{1F527}'}</Text>
      <Text style={styles.emptyTitle}>Nothing here yet</Text>
      <Text style={styles.emptyDescription}>{message}</Text>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'available':
        return (
          <FlatList
            data={AVAILABLE_JOBS}
            renderItem={renderAvailableItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => renderEmptyTab('No available jobs in your area right now.')}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          />
        );
      case 'bids':
        return (
          <FlatList
            data={BID_JOBS}
            renderItem={renderBidItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => renderEmptyTab('You haven\'t placed any bids yet.')}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          />
        );
      case 'active':
        return (
          <FlatList
            data={ACTIVE_JOBS}
            renderItem={renderActiveItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => renderEmptyTab('No active jobs. Bid on available jobs to get started.')}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          />
        );
      case 'completed':
        return (
          <FlatList
            data={COMPLETED_JOBS}
            renderItem={renderCompletedItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => renderEmptyTab('Completed jobs will appear here.')}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          />
        );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jobs</Text>
      </View>

      <View style={styles.segmentedControl}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[styles.segmentTab, active && styles.segmentTabActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab.key);
              }}
            >
              <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {renderContent()}
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
  },
  headerTitle: {
    ...typography.heading,
    color: colors.text,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: 3,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  segmentTabActive: {
    backgroundColor: colors.background,
    ...shadows.sm,
  },
  segmentLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  segmentLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  jobCard: {
    marginBottom: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  jobTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  jobMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  budgetText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  bidAmount: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
  completedAmount: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.success,
    marginTop: 4,
  },
  progressContainer: {
    marginTop: spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  starFilled: {
    fontSize: 16,
    color: colors.warning,
  },
  starEmpty: {
    fontSize: 16,
    color: colors.borderMedium,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

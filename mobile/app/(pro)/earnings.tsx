import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

interface ChartBar {
  month: string;
  value: number;
}

const CHART_DATA: ChartBar[] = [
  { month: 'Oct', value: 3200 },
  { month: 'Nov', value: 4100 },
  { month: 'Dec', value: 3800 },
  { month: 'Jan', value: 4500 },
  { month: 'Feb', value: 3900 },
  { month: 'Mar', value: 4850 },
];

const MAX_CHART_VALUE = Math.max(...CHART_DATA.map((d) => d.value));
const CHART_HEIGHT = 160;

interface Payout {
  id: string;
  date: string;
  amount: number;
  jobTitle: string;
  status: 'completed' | 'pending';
}

const PAYOUTS: Payout[] = [
  { id: 'p1', date: 'Mar 28, 2026', amount: 1200, jobTitle: 'Water heater replacement', status: 'completed' },
  { id: 'p2', date: 'Mar 22, 2026', amount: 850, jobTitle: 'Bathroom tile repair', status: 'completed' },
  { id: 'p3', date: 'Mar 15, 2026', amount: 450, jobTitle: 'Garbage disposal install', status: 'completed' },
  { id: 'p4', date: 'Mar 10, 2026', amount: 1350, jobTitle: 'Deck rebuild - Phase 2', status: 'pending' },
  { id: 'p5', date: 'Mar 5, 2026', amount: 1000, jobTitle: 'Fence staining', status: 'completed' },
];

export default function EarningsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleBarPress = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBar(selectedBar === index ? null : index);
  }, [selectedBar]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Stats Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          <Card style={styles.statCard} variant="elevated">
            <Text style={styles.statLabel}>This Month</Text>
            <View style={styles.statValueRow}>
              <Text style={[styles.statValue, { color: colors.success }]}>$4,850</Text>
              <Text style={styles.statArrow}>{'\u2191'}</Text>
            </View>
            <Text style={styles.statChange}>+12% vs last month</Text>
          </Card>

          <Card style={styles.statCard} variant="elevated">
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>$1,200</Text>
            <Text style={styles.statChange}>2 payouts processing</Text>
          </Card>

          <Card style={styles.statCard} variant="elevated">
            <Text style={styles.statLabel}>Completed Jobs</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
            <Text style={styles.statChange}>This month</Text>
          </Card>
        </ScrollView>

        {/* Bar Chart */}
        <Card style={styles.chartCard} variant="elevated">
          <Text style={styles.sectionTitle}>Earnings Trend</Text>
          <View style={styles.chartContainer}>
            {CHART_DATA.map((bar, index) => {
              const barHeight = (bar.value / MAX_CHART_VALUE) * CHART_HEIGHT;
              const isSelected = selectedBar === index;
              return (
                <Pressable
                  key={bar.month}
                  style={styles.barWrapper}
                  onPress={() => handleBarPress(index)}
                >
                  {isSelected && (
                    <View style={styles.barTooltip}>
                      <Text style={styles.barTooltipText}>
                        ${bar.value.toLocaleString()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: barHeight },
                        isSelected && styles.barFillSelected,
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, isSelected && styles.barLabelSelected]}>
                    {bar.month}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Recent Payouts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Payouts</Text>
        </View>

        {PAYOUTS.map((payout) => (
          <Card key={payout.id} style={styles.payoutCard} variant="elevated">
            <View style={styles.payoutRow}>
              <View style={styles.payoutContent}>
                <Text style={styles.payoutTitle} numberOfLines={1}>
                  {payout.jobTitle}
                </Text>
                <Text style={styles.payoutDate}>{payout.date}</Text>
              </View>
              <View style={styles.payoutRight}>
                <Text style={styles.payoutAmount}>
                  ${payout.amount.toLocaleString()}
                </Text>
                <Badge
                  label={payout.status === 'completed' ? 'Paid' : 'Pending'}
                  variant={payout.status === 'completed' ? 'success' : 'warning'}
                />
              </View>
            </View>
          </Card>
        ))}

        {/* Stripe Capital Card */}
        <View style={styles.capitalCard}>
          <Text style={styles.capitalTitle}>Need cash flow?</Text>
          <Text style={styles.capitalDescription}>
            Stripe Capital can advance funds based on your earnings history. Get access to working capital when you need it.
          </Text>
          <Pressable
            style={styles.capitalButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.capitalButtonText}>Learn More</Text>
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
    paddingBottom: 100,
  },
  statsRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    width: 160,
    minHeight: 100,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statArrow: {
    fontSize: 18,
    color: colors.success,
    fontWeight: '700',
  },
  statChange: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  chartCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 40,
    marginTop: spacing.lg,
    paddingTop: 24,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: 32,
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: colors.borderLight,
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  barFillSelected: {
    backgroundColor: colors.primaryDark,
  },
  barLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  barLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  barTooltip: {
    position: 'absolute',
    top: 0,
    backgroundColor: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    zIndex: 10,
  },
  barTooltipText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  payoutCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  payoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payoutContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  payoutTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  payoutDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  payoutRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  payoutAmount: {
    ...typography.subheading,
    color: colors.text,
  },
  capitalCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    ...shadows.primaryGlow,
  },
  capitalTitle: {
    ...typography.heading,
    color: colors.textInverse,
    marginBottom: spacing.sm,
  },
  capitalDescription: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: spacing.lg,
  },
  capitalButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  capitalButtonText: {
    color: colors.textInverse,
    fontWeight: '600',
    fontSize: 15,
  },
});

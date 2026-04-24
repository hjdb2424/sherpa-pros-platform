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
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Integer cents -> formatted display string */
function formatCents(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}.${String(remainder).padStart(2, '0')}`;
}

function formatDollars(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const TOP_CARDS = [
  {
    label: 'Monthly NOI',
    valueCents: 4_562_500,
    icon: 'trending-up' as const,
    iconColor: colors.success,
    change: '+8.2%',
    changePositive: true,
  },
  {
    label: 'Vacancy Cost',
    valueCents: 1_875_000,
    icon: 'home-outline' as const,
    iconColor: colors.warning,
    change: '9.1% rate',
    changePositive: false,
  },
  {
    label: 'Maint. Spend (MTD)',
    valueCents: 1_875_000,
    icon: 'construct-outline' as const,
    iconColor: colors.primary,
    change: '-3.4% vs last mo',
    changePositive: true,
  },
  {
    label: 'Budget Variance',
    valueCents: -312_500,
    icon: 'analytics-outline' as const,
    iconColor: colors.danger,
    change: '1.7% over budget',
    changePositive: false,
  },
];

interface PropertyBudget {
  name: string;
  spendCents: number;
  budgetCents: number;
}

const PORTFOLIO_SPEND: PropertyBudget[] = [
  { name: 'Maple Ridge', spendCents: 5_240_000, budgetCents: 5_500_000 },
  { name: '220 Main St', spendCents: 1_820_000, budgetCents: 1_700_000 },
  { name: 'Harbor View', spendCents: 1_480_000, budgetCents: 1_600_000 },
  { name: 'Student Housing', spendCents: 1_140_000, budgetCents: 1_200_000 },
];

const MAX_BUDGET = Math.max(...PORTFOLIO_SPEND.map((p) => Math.max(p.spendCents, p.budgetCents)));

interface Transaction {
  id: string;
  date: string;
  description: string;
  property: string;
  amountCents: number;
  category: 'CapEx' | 'OpEx';
}

const RECENT_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: 'Apr 22', description: 'HVAC repair Unit 305', property: 'Maple Ridge', amountCents: -285_000, category: 'OpEx' },
  { id: 't2', date: 'Apr 21', description: 'Kitchen remodel Unit 12', property: '220 Main St', amountCents: -1_200_000, category: 'CapEx' },
  { id: 't3', date: 'Apr 20', description: 'Rent collection - April', property: 'Harbor View', amountCents: 2_400_000, category: 'OpEx' },
  { id: 't4', date: 'Apr 19', description: 'Parking lot reseal', property: '220 Main St', amountCents: -850_000, category: 'CapEx' },
  { id: 't5', date: 'Apr 18', description: 'Pest control service', property: 'Student Housing', amountCents: -45_000, category: 'OpEx' },
  { id: 't6', date: 'Apr 17', description: 'LED lighting upgrade', property: 'All Properties', amountCents: -420_000, category: 'CapEx' },
  { id: 't7', date: 'Apr 16', description: 'Rent collection - April', property: 'Maple Ridge', amountCents: 7_200_000, category: 'OpEx' },
];

const QUICK_STATS = {
  occupiedUnits: 113,
  totalUnits: 123,
  avgRentCents: 1_525_00,
  delinquencyRate: 3.2,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FinanceScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance</Text>
        <Text style={styles.headerSubtitle}>Portfolio Overview</Text>
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
        {/* Top Summary Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          {TOP_CARDS.map((card) => (
            <Card key={card.label} style={styles.statCard} variant="elevated">
              <View style={styles.statIconRow}>
                <Ionicons name={card.icon} size={18} color={card.iconColor} />
                <Text style={styles.statLabel}>{card.label}</Text>
              </View>
              <Text style={[styles.statValue, { color: card.valueCents < 0 ? colors.danger : colors.text }]}>
                {formatDollars(card.valueCents)}
              </Text>
              <View style={styles.changeRow}>
                <Ionicons
                  name={card.changePositive ? 'arrow-up' : 'arrow-down'}
                  size={10}
                  color={card.changePositive ? colors.success : colors.danger}
                />
                <Text style={[styles.statChange, { color: card.changePositive ? colors.success : colors.danger }]}>
                  {card.change}
                </Text>
              </View>
            </Card>
          ))}
        </ScrollView>

        {/* Portfolio Spend vs Budget */}
        <Card style={styles.chartCard} variant="elevated">
          <Text style={styles.sectionTitle}>Spend vs Budget</Text>
          <Text style={styles.chartSubtitle}>By property, this month</Text>
          <View style={styles.barChartContainer}>
            {PORTFOLIO_SPEND.map((prop, index) => {
              const spendPct = (prop.spendCents / MAX_BUDGET) * 100;
              const budgetPct = (prop.budgetCents / MAX_BUDGET) * 100;
              const overBudget = prop.spendCents > prop.budgetCents;
              const isSelected = selectedBar === index;
              return (
                <Pressable
                  key={prop.name}
                  style={styles.barRow}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedBar(isSelected ? null : index);
                  }}
                >
                  <Text style={styles.barPropertyName} numberOfLines={1}>{prop.name}</Text>
                  <View style={styles.barTrackContainer}>
                    {/* Budget bar (background) */}
                    <View style={[styles.barBudgetTrack, { width: `${budgetPct}%` }]} />
                    {/* Spend bar (foreground) */}
                    <View
                      style={[
                        styles.barSpendFill,
                        { width: `${spendPct}%` },
                        overBudget && styles.barOverBudget,
                        isSelected && { opacity: 1 },
                      ]}
                    />
                  </View>
                  {isSelected && (
                    <View style={styles.barDetail}>
                      <Text style={styles.barDetailText}>
                        Spend: {formatDollars(prop.spendCents)} / Budget: {formatDollars(prop.budgetCents)}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Spend</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.borderMedium }]} />
              <Text style={styles.legendText}>Budget</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
              <Text style={styles.legendText}>Over Budget</Text>
            </View>
          </View>
        </Card>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>

        {RECENT_TRANSACTIONS.map((txn) => {
          const isIncome = txn.amountCents > 0;
          return (
            <Card key={txn.id} style={styles.txnCard} variant="elevated">
              <View style={styles.txnRow}>
                <View style={[styles.txnIcon, { backgroundColor: isIncome ? colors.successLight : colors.dangerLight }]}>
                  <Ionicons
                    name={isIncome ? 'arrow-down-outline' : 'arrow-up-outline'}
                    size={16}
                    color={isIncome ? colors.success : colors.danger}
                  />
                </View>
                <View style={styles.txnContent}>
                  <Text style={styles.txnDesc} numberOfLines={1}>{txn.description}</Text>
                  <Text style={styles.txnProperty}>{txn.property} {'\u00B7'} {txn.date}</Text>
                </View>
                <View style={styles.txnRight}>
                  <Text style={[styles.txnAmount, { color: isIncome ? colors.success : colors.text }]}>
                    {isIncome ? '+' : ''}{formatDollars(txn.amountCents)}
                  </Text>
                  <Badge
                    label={txn.category}
                    variant={txn.category === 'CapEx' ? 'primary' : 'neutral'}
                  />
                </View>
              </View>
            </Card>
          );
        })}

        {/* Quick Stats Row */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Portfolio Snapshot</Text>
        </View>

        <View style={styles.quickStatsGrid}>
          <Card style={styles.quickStatCard} variant="elevated">
            <Text style={styles.quickStatValue}>
              {QUICK_STATS.occupiedUnits}/{QUICK_STATS.totalUnits}
            </Text>
            <Text style={styles.quickStatLabel}>Units Occupied</Text>
            <View style={styles.occupancyBar}>
              <View
                style={[
                  styles.occupancyFill,
                  { width: `${(QUICK_STATS.occupiedUnits / QUICK_STATS.totalUnits) * 100}%` },
                ]}
              />
            </View>
          </Card>

          <Card style={styles.quickStatCard} variant="elevated">
            <Text style={styles.quickStatValue}>
              {formatCents(QUICK_STATS.avgRentCents)}
            </Text>
            <Text style={styles.quickStatLabel}>Average Rent</Text>
          </Card>

          <Card style={styles.quickStatCard} variant="elevated">
            <Text style={[styles.quickStatValue, { color: QUICK_STATS.delinquencyRate > 5 ? colors.danger : colors.warning }]}>
              {QUICK_STATS.delinquencyRate}%
            </Text>
            <Text style={styles.quickStatLabel}>Delinquency Rate</Text>
          </Card>

          <Card style={styles.quickStatCard} variant="elevated">
            <Text style={[styles.quickStatValue, { color: colors.success }]}>
              {((QUICK_STATS.occupiedUnits / QUICK_STATS.totalUnits) * 100).toFixed(1)}%
            </Text>
            <Text style={styles.quickStatLabel}>Occupancy Rate</Text>
          </Card>
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
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Stats row
  statsRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    width: 155,
    minHeight: 95,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: spacing.xs,
  },
  statChange: {
    ...typography.caption,
    fontWeight: '600',
  },

  // Chart
  chartCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  chartSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  barChartContainer: {
    gap: spacing.md,
  },
  barRow: {
    gap: 4,
  },
  barPropertyName: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  barTrackContainer: {
    height: 20,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSecondary,
    overflow: 'hidden',
    position: 'relative',
  },
  barBudgetTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 20,
    backgroundColor: colors.borderMedium,
    borderRadius: borderRadius.sm,
  },
  barSpendFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    opacity: 0.85,
  },
  barOverBudget: {
    backgroundColor: colors.danger,
  },
  barDetail: {
    marginTop: 2,
  },
  barDetailText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  legendRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },

  // Section
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
  },

  // Transactions
  txnCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txnIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  txnContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  txnDesc: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  txnProperty: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  txnRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  txnAmount: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Quick Stats
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickStatCard: {
    width: '48%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  quickStatLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  occupancyBar: {
    width: '80%',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderLight,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  occupancyFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
});

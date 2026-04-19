import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  FlatList,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import FinancingOptions from '@/components/pro/FinancingOptions';
import SkeletonCard from '@/components/common/SkeletonCard';
import { apiFetch } from '@/lib/api';

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

// ---------------------------------------------------------------------------
// Transaction History
// ---------------------------------------------------------------------------

interface Transaction {
  id: string;
  date: string;
  type: 'payout' | 'commission' | 'materials' | 'bonus';
  description: string;
  amount: number;
  status: 'completed' | 'deducted' | 'pending';
}

const TRANSACTIONS: Transaction[] = [
  { id: 't1', date: 'Apr 18', type: 'payout', description: 'Water heater replacement', amount: 1020, status: 'completed' },
  { id: 't2', date: 'Apr 17', type: 'commission', description: 'Platform commission (15%)', amount: -180, status: 'deducted' },
  { id: 't3', date: 'Apr 15', type: 'payout', description: 'Garbage disposal install', amount: 297, status: 'completed' },
  { id: 't4', date: 'Apr 14', type: 'materials', description: 'Materials reimbursement - Bathroom remodel', amount: 698, status: 'completed' },
  { id: 't5', date: 'Apr 12', type: 'commission', description: 'Platform commission (12%)', amount: -42, status: 'deducted' },
  { id: 't6', date: 'Apr 10', type: 'payout', description: 'Outdoor lighting setup', amount: 807, status: 'completed' },
  { id: 't7', date: 'Apr 8', type: 'bonus', description: 'Emergency dispatch bonus', amount: 75, status: 'completed' },
  { id: 't8', date: 'Apr 5', type: 'payout', description: 'Deck board replacement', amount: 578, status: 'pending' },
];

const TRANSACTION_ICONS: Record<Transaction['type'], keyof typeof Ionicons.glyphMap> = {
  payout: 'wallet-outline',
  commission: 'receipt-outline',
  materials: 'cube-outline',
  bonus: 'star-outline',
};

const TRANSACTION_TYPE_LABELS: Record<Transaction['type'], string> = {
  payout: 'Payout',
  commission: 'Commission',
  materials: 'Materials',
  bonus: 'Bonus',
};

// ---------------------------------------------------------------------------
// Invoice Data
// ---------------------------------------------------------------------------

interface Invoice {
  id: string;
  jobTitle: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'draft';
}

const INVOICES: Invoice[] = [
  { id: 'inv-001', jobTitle: 'Water heater replacement', clientName: 'Tom Anderson', amount: 1200, date: 'Apr 18', status: 'paid' },
  { id: 'inv-002', jobTitle: 'Garbage disposal install', clientName: 'Lisa Martinez', amount: 350, date: 'Apr 15', status: 'paid' },
  { id: 'inv-003', jobTitle: 'Bathroom remodel - Phase 1', clientName: 'John Davidson', amount: 8500, date: 'Apr 10', status: 'pending' },
  { id: 'inv-004', jobTitle: 'Outdoor lighting setup', clientName: 'Rachel Kim', amount: 950, date: 'Apr 8', status: 'paid' },
  { id: 'inv-005', jobTitle: 'Deck board replacement', clientName: 'Sarah Mitchell', amount: 680, date: 'Apr 5', status: 'draft' },
];

const INVOICE_STATUS_BADGE: Record<Invoice['status'], { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  paid: { label: 'Paid', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  draft: { label: 'Draft', variant: 'neutral' },
};

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

interface DashboardStats {
  thisMonth: string;
  pending: string;
  completedJobs: number;
  changePercent: string;
  pendingPayouts: number;
}

const DEFAULT_STATS: DashboardStats = {
  thisMonth: '$4,850',
  pending: '$1,200',
  completedJobs: 12,
  changePercent: '+12%',
  pendingPayouts: 2,
};

export default function EarningsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    apiFetch<any>('/dashboard')
      .then((data) => {
        if (data) {
          setStats({
            thisMonth: data.thisMonth ?? DEFAULT_STATS.thisMonth,
            pending: data.pending ?? DEFAULT_STATS.pending,
            completedJobs: data.completedJobs ?? DEFAULT_STATS.completedJobs,
            changePercent: data.changePercent ?? DEFAULT_STATS.changePercent,
            pendingPayouts: data.pendingPayouts ?? DEFAULT_STATS.pendingPayouts,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    apiFetch<any>('/dashboard')
      .then((data) => {
        if (data) {
          setStats({
            thisMonth: data.thisMonth ?? DEFAULT_STATS.thisMonth,
            pending: data.pending ?? DEFAULT_STATS.pending,
            completedJobs: data.completedJobs ?? DEFAULT_STATS.completedJobs,
            changePercent: data.changePercent ?? DEFAULT_STATS.changePercent,
            pendingPayouts: data.pendingPayouts ?? DEFAULT_STATS.pendingPayouts,
          });
        }
      })
      .catch(() => {})
      .finally(() => setRefreshing(false));
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
            <View style={styles.statIconRow}>
              <Ionicons name="wallet-outline" size={18} color={colors.success} />
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={[styles.statValue, { color: colors.success }]}>{stats.thisMonth}</Text>
              <Ionicons name="trending-up" size={16} color={colors.success} />
            </View>
            <Text style={styles.statChange}>{stats.changePercent} vs last month</Text>
          </Card>

          <Card style={styles.statCard} variant="elevated">
            <View style={styles.statIconRow}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.primary }]}>{stats.pending}</Text>
            <Text style={styles.statChange}>{stats.pendingPayouts} payouts processing</Text>
          </Card>

          <Card style={styles.statCard} variant="elevated">
            <View style={styles.statIconRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.text} />
              <Text style={styles.statLabel}>Completed Jobs</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.completedJobs}</Text>
              <Ionicons name="trending-up" size={16} color={colors.success} />
            </View>
            <Text style={styles.statChange}>This month</Text>
          </Card>
        </ScrollView>

        {/* Bar Chart */}
        <Card style={styles.chartCard} variant="elevated">
          <Text style={styles.sectionTitle}>Earnings Trend</Text>
          <View style={styles.chartContainer}>
            {/* Gridlines */}
            <View style={styles.gridLines}>
              {[0.25, 0.5, 0.75].map((pct) => (
                <View
                  key={pct}
                  style={[
                    styles.gridLine,
                    { bottom: pct * CHART_HEIGHT },
                  ]}
                />
              ))}
            </View>
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

        {/* View All Transactions */}
        <View style={styles.sectionHeader}>
          <Pressable
            style={styles.viewAllButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowTransactions(!showTransactions);
            }}
          >
            <Ionicons name="list-outline" size={18} color={colors.primary} />
            <Text style={styles.viewAllText}>
              {showTransactions ? 'Hide Transactions' : 'View All Transactions'}
            </Text>
            <Ionicons
              name={showTransactions ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.primary}
            />
          </Pressable>
        </View>

        {showTransactions && (
          <View style={styles.transactionList}>
            {TRANSACTIONS.map((txn) => {
              const isNegative = txn.amount < 0;
              return (
                <Pressable
                  key={txn.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({
                      pathname: '/(pro)/earnings-detail',
                      params: { transactionId: txn.id },
                    });
                  }}
                >
                  <Card style={styles.transactionCard} variant="elevated">
                    <View style={styles.transactionRow}>
                      <View style={[styles.transactionIcon, { backgroundColor: isNegative ? colors.dangerLight : colors.successLight }]}>
                        <Ionicons
                          name={TRANSACTION_ICONS[txn.type]}
                          size={18}
                          color={isNegative ? colors.danger : colors.success}
                        />
                      </View>
                      <View style={styles.transactionContent}>
                        <Text style={styles.transactionDesc} numberOfLines={1}>{txn.description}</Text>
                        <Text style={styles.transactionDate}>{txn.date}</Text>
                      </View>
                      <View style={styles.transactionRight}>
                        <Text style={[styles.transactionAmount, { color: isNegative ? colors.danger : colors.success }]}>
                          {isNegative ? '-' : '+'}${Math.abs(txn.amount).toLocaleString()}
                        </Text>
                        <Badge
                          label={txn.status === 'completed' ? 'Done' : txn.status === 'pending' ? 'Pending' : 'Deducted'}
                          variant={txn.status === 'completed' ? 'success' : txn.status === 'pending' ? 'warning' : 'neutral'}
                        />
                      </View>
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Invoices */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Invoices</Text>
        </View>

        {INVOICES.map((inv) => {
          const badge = INVOICE_STATUS_BADGE[inv.status];
          return (
            <Pressable
              key={inv.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert(
                  `Invoice ${inv.id}`,
                  `${inv.jobTitle}\nClient: ${inv.clientName}\n\nLine Items:\n- Labor: $${Math.round(inv.amount * 0.65)}\n- Materials: $${Math.round(inv.amount * 0.25)}\n- Platform fee: $${Math.round(inv.amount * 0.10)}\n\nTotal: $${inv.amount.toLocaleString()}\nStatus: ${badge.label}`,
                  [{ text: 'Close' }],
                );
              }}
            >
              <Card style={styles.invoiceCard} variant="elevated">
                <View style={styles.invoiceRow}>
                  <View style={styles.invoiceContent}>
                    <Text style={styles.invoiceTitle} numberOfLines={1}>{inv.jobTitle}</Text>
                    <Text style={styles.invoiceClient}>{inv.clientName}</Text>
                    <Text style={styles.invoiceDate}>{inv.date}</Text>
                  </View>
                  <View style={styles.invoiceRight}>
                    <Text style={styles.invoiceAmount}>${inv.amount.toLocaleString()}</Text>
                    <Badge label={badge.label} variant={badge.variant} />
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        })}

        {/* Stripe Capital / Financing Options */}
        <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <FinancingOptions />
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
    gap: spacing.lg,
  },
  statCard: {
    width: 160,
    minHeight: 100,
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
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    height: CHART_HEIGHT,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderStyle: 'dashed',
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
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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

  // View All Transactions button
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  viewAllText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.primary,
  },

  // Transactions
  transactionList: {
    marginTop: spacing.sm,
  },
  transactionCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  transactionContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  transactionDesc: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  transactionDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  transactionAmount: {
    ...typography.subheading,
    fontWeight: '700',
  },

  // Invoices
  invoiceCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invoiceContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  invoiceTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  invoiceClient: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  invoiceDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  invoiceRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  invoiceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
});

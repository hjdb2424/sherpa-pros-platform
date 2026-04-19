import { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

// ---------------------------------------------------------------------------
// Transaction Data (mirrors earnings.tsx)
// ---------------------------------------------------------------------------

interface Transaction {
  id: string;
  date: string;
  type: 'payout' | 'commission' | 'materials' | 'bonus';
  description: string;
  amount: number;
  status: 'completed' | 'deducted' | 'pending';
  time?: string;
  relatedJob?: string;
  relatedJobId?: string;
}

const TRANSACTIONS: Transaction[] = [
  { id: 't1', date: 'Apr 18', type: 'payout', description: 'Water heater replacement', amount: 1020, status: 'completed', time: '2:45 PM', relatedJob: 'Water heater replacement', relatedJobId: 'c1' },
  { id: 't2', date: 'Apr 17', type: 'commission', description: 'Platform commission (15%)', amount: -180, status: 'deducted', time: '11:30 AM', relatedJob: 'Water heater replacement', relatedJobId: 'c1' },
  { id: 't3', date: 'Apr 15', type: 'payout', description: 'Garbage disposal install', amount: 297, status: 'completed', time: '4:15 PM', relatedJob: 'Garbage disposal install', relatedJobId: 'c2' },
  { id: 't4', date: 'Apr 14', type: 'materials', description: 'Materials reimbursement - Bathroom remodel', amount: 698, status: 'completed', time: '9:00 AM', relatedJob: 'Bathroom Remodel - Phase 1', relatedJobId: 'c1' },
  { id: 't5', date: 'Apr 12', type: 'commission', description: 'Platform commission (12%)', amount: -42, status: 'deducted', time: '3:20 PM', relatedJob: 'Garbage disposal install', relatedJobId: 'c2' },
  { id: 't6', date: 'Apr 10', type: 'payout', description: 'Outdoor lighting setup', amount: 807, status: 'completed', time: '6:00 PM', relatedJob: 'Outdoor lighting setup', relatedJobId: 'c3' },
  { id: 't7', date: 'Apr 8', type: 'bonus', description: 'Emergency dispatch bonus', amount: 75, status: 'completed', time: '8:45 AM', relatedJob: 'Emergency pipe burst', relatedJobId: 'c4' },
  { id: 't8', date: 'Apr 5', type: 'payout', description: 'Deck board replacement', amount: 578, status: 'pending', time: '1:30 PM', relatedJob: 'Deck board replacement', relatedJobId: 'c5' },
];

const TYPE_LABELS: Record<Transaction['type'], string> = {
  payout: 'Payout',
  commission: 'Commission',
  materials: 'Materials',
  bonus: 'Bonus',
};

const TYPE_BADGE_VARIANT: Record<Transaction['type'], 'success' | 'neutral' | 'primary' | 'warning'> = {
  payout: 'success',
  commission: 'neutral',
  materials: 'primary',
  bonus: 'warning',
};

const TYPE_ICONS: Record<Transaction['type'], keyof typeof Ionicons.glyphMap> = {
  payout: 'wallet-outline',
  commission: 'receipt-outline',
  materials: 'cube-outline',
  bonus: 'star-outline',
};

// Materials breakdown for material-type transactions
const MATERIAL_ITEMS = [
  { name: 'Cement board (3x5)', qty: 4, price: 52 },
  { name: 'Waterproof membrane', qty: 1, price: 89 },
  { name: 'Subway tile (white 3x6)', qty: 80, price: 320 },
  { name: 'Thinset mortar', qty: 2, price: 48 },
  { name: 'Matte black shower valve', qty: 1, price: 189 },
];

// Status timeline steps
const STATUS_STEPS = [
  { key: 'submitted', label: 'Submitted', icon: 'document-outline' as keyof typeof Ionicons.glyphMap },
  { key: 'processing', label: 'Processing', icon: 'hourglass-outline' as keyof typeof Ionicons.glyphMap },
  { key: 'completed', label: 'Completed', icon: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap },
];

function getActiveStep(status: string): number {
  if (status === 'pending') return 1;
  if (status === 'completed' || status === 'deducted') return 2;
  return 0;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EarningsDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();

  const txn = TRANSACTIONS.find((t) => t.id === transactionId) ?? TRANSACTIONS[0];
  const isNegative = txn.amount < 0;
  const activeStep = getActiveStep(txn.status);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const handleJobTap = useCallback(() => {
    if (txn.relatedJobId) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push({ pathname: '/(pro)/jobs/[id]', params: { id: txn.relatedJobId } });
    }
  }, [txn.relatedJobId, router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Transaction Detail</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Amount Hero */}
        <Card style={styles.amountCard} variant="elevated">
          <View style={styles.amountCenter}>
            <View style={[styles.amountIconCircle, { backgroundColor: isNegative ? colors.dangerLight : colors.successLight }]}>
              <Ionicons
                name={TYPE_ICONS[txn.type]}
                size={28}
                color={isNegative ? colors.danger : colors.success}
              />
            </View>
            <Text style={[styles.amountValue, { color: isNegative ? colors.danger : colors.success }]}>
              {isNegative ? '-' : '+'}${Math.abs(txn.amount).toLocaleString()}
            </Text>
            <Badge label={TYPE_LABELS[txn.type]} variant={TYPE_BADGE_VARIANT[txn.type]} />
          </View>
        </Card>

        {/* Details */}
        <Card style={styles.detailCard} variant="elevated">
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{txn.description}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{txn.date}, 2026</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{txn.time ?? 'N/A'}</Text>
          </View>

          {txn.relatedJob && (
            <Pressable style={styles.detailRow} onPress={handleJobTap}>
              <Text style={styles.detailLabel}>Related Job</Text>
              <View style={styles.jobLink}>
                <Text style={styles.jobLinkText}>{txn.relatedJob}</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
              </View>
            </Pressable>
          )}
        </Card>

        {/* Commission Breakdown */}
        {txn.type === 'commission' && (
          <Card style={styles.detailCard} variant="elevated">
            <Text style={styles.sectionTitle}>Commission Breakdown</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Job Total</Text>
              <Text style={styles.breakdownValue}>${(Math.abs(txn.amount) / 0.15).toFixed(0)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Commission Rate</Text>
              <Text style={styles.breakdownValue}>{txn.description.includes('15%') ? '15%' : '12%'}</Text>
            </View>
            <View style={[styles.breakdownRow, styles.breakdownTotal]}>
              <Text style={styles.breakdownTotalLabel}>Commission Amount</Text>
              <Text style={[styles.breakdownTotalValue, { color: colors.danger }]}>
                -${Math.abs(txn.amount).toLocaleString()}
              </Text>
            </View>
          </Card>
        )}

        {/* Materials Breakdown */}
        {txn.type === 'materials' && (
          <Card style={styles.detailCard} variant="elevated">
            <Text style={styles.sectionTitle}>Materials Purchased</Text>
            {MATERIAL_ITEMS.map((item, idx) => (
              <View key={idx} style={styles.materialRow}>
                <View style={styles.materialInfo}>
                  <Text style={styles.materialName}>{item.name}</Text>
                  <Text style={styles.materialQty}>Qty: {item.qty}</Text>
                </View>
                <Text style={styles.materialPrice}>${item.price}</Text>
              </View>
            ))}
            <View style={[styles.breakdownRow, styles.breakdownTotal]}>
              <Text style={styles.breakdownTotalLabel}>Total</Text>
              <Text style={[styles.breakdownTotalValue, { color: colors.success }]}>
                ${MATERIAL_ITEMS.reduce((s, i) => s + i.price, 0).toLocaleString()}
              </Text>
            </View>
          </Card>
        )}

        {/* Status Timeline */}
        <Card style={styles.detailCard} variant="elevated">
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.timeline}>
            {STATUS_STEPS.map((step, idx) => {
              const isDone = idx <= activeStep;
              const isLast = idx === STATUS_STEPS.length - 1;
              return (
                <View key={step.key} style={styles.timelineStep}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, isDone && styles.timelineDotActive]}>
                      <Ionicons
                        name={step.icon}
                        size={16}
                        color={isDone ? colors.textInverse : colors.textMuted}
                      />
                    </View>
                    {!isLast && (
                      <View style={[styles.timelineLine, isDone && styles.timelineLineActive]} />
                    )}
                  </View>
                  <Text style={[styles.timelineLabel, isDone && styles.timelineLabelActive]}>
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },

  // Amount hero
  amountCard: {
    marginBottom: spacing.lg,
  },
  amountCenter: {
    alignItems: 'center',
    gap: spacing.md,
  },
  amountIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
  },

  // Detail card
  detailCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  detailValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    maxWidth: '60%',
    textAlign: 'right',
  },
  jobLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobLinkText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.primary,
  },

  // Breakdown
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  breakdownLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  breakdownValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  breakdownTotal: {
    borderBottomWidth: 0,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.borderMedium,
  },
  breakdownTotalLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  breakdownTotalValue: {
    ...typography.heading,
    fontWeight: '700',
  },

  // Materials
  materialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  materialQty: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  materialPrice: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },

  // Timeline
  timeline: {
    paddingLeft: spacing.sm,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotActive: {
    backgroundColor: colors.success,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: colors.borderLight,
  },
  timelineLineActive: {
    backgroundColor: colors.success,
  },
  timelineLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    paddingTop: spacing.sm,
  },
  timelineLabelActive: {
    color: colors.text,
    fontWeight: '600',
  },
});

import { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Share,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';
import Logo from '@/components/brand/Logo';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuoteData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  proName: string;
  proTrade: string;
  proPhone: string;
  proEmail: string;
  proLicense: string;
  clientName: string;
  clientAddress: string;
  jobTitle: string;
  lineItems: {
    category: string;
    description: string;
    qty: number;
    unit: string;
    unitPrice: number;
    total: number;
  }[];
  laborSubtotal: number;
  materialsSubtotal: number;
  otherSubtotal: number;
  subtotal: number;
  taxPct: number;
  taxAmount: number;
  discountPct: number;
  discountAmount: number;
  grandTotal: number;
  scopeOfWork: string;
  timeline: string;
  paymentTerms: string;
  notes: string;
}

interface EstimateDocumentProps {
  quote: QuoteData;
  onClose: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function groupByCategory(items: QuoteData['lineItems']) {
  const map: Record<string, QuoteData['lineItems']> = {};
  items.forEach((item) => {
    if (!map[item.category]) map[item.category] = [];
    map[item.category].push(item);
  });
  return map;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EstimateDocument({ quote, onClose, onAccept, onDecline }: EstimateDocumentProps) {
  const insets = useSafeAreaInsets();
  const grouped = groupByCategory(quote.lineItems);

  const handleShare = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const lines = [
      `ESTIMATE ${quote.quoteNumber}`,
      `Date: ${quote.date}`,
      ``,
      `From: ${quote.proName} - ${quote.proTrade}`,
      `To: ${quote.clientName}`,
      ``,
      `Re: ${quote.jobTitle}`,
      ``,
      ...quote.lineItems.map((li) => `  ${li.description} — ${li.qty} ${li.unit} x ${fmt(li.unitPrice)} = ${fmt(li.total)}`),
      ``,
      `Subtotal: ${fmt(quote.subtotal)}`,
      quote.taxPct > 0 ? `Tax (${quote.taxPct}%): ${fmt(quote.taxAmount)}` : '',
      quote.discountPct > 0 ? `Discount (${quote.discountPct}%): -${fmt(quote.discountAmount)}` : '',
      `GRAND TOTAL: ${fmt(quote.grandTotal)}`,
      ``,
      `Scope: ${quote.scopeOfWork}`,
      `Timeline: ${quote.timeline}`,
      `Payment: ${quote.paymentTerms}`,
      `Valid until: ${quote.validUntil}`,
      ``,
      `— Sherpa Pros`,
    ].filter(Boolean);

    await Share.share({ message: lines.join('\n'), title: `Estimate ${quote.quoteNumber}` });
  }, [quote]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Close button */}
      <Pressable
        style={styles.closeBtn}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onClose();
        }}
        hitSlop={12}
      >
        <Ionicons name="close" size={28} color={colors.text} />
      </Pressable>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* ── Document ────────────────────────────────────── */}
        <View style={styles.document}>
          {/* Logo */}
          <View style={styles.logoWrap}>
            <Logo size="lg" />
          </View>

          {/* ESTIMATE title */}
          <Text style={styles.docTitle}>ESTIMATE</Text>

          {/* Quote number + date */}
          <View style={styles.metaRow}>
            <Text style={styles.metaDate}>{quote.date}</Text>
            <Text style={styles.metaNumber}>{quote.quoteNumber}</Text>
          </View>

          <View style={styles.divider} />

          {/* From / To */}
          <View style={styles.partiesRow}>
            <View style={styles.partyCol}>
              <Text style={styles.partyLabel}>FROM</Text>
              <Text style={styles.partyName}>{quote.proName}</Text>
              <Text style={styles.partyDetail}>{quote.proTrade}</Text>
              <Text style={styles.partyDetail}>{quote.proPhone}</Text>
              <Text style={styles.partyDetail}>{quote.proEmail}</Text>
              <Text style={styles.partyDetail}>License: {quote.proLicense}</Text>
            </View>
            <View style={styles.partyCol}>
              <Text style={styles.partyLabel}>TO</Text>
              <Text style={styles.partyName}>{quote.clientName}</Text>
              <Text style={styles.partyDetail}>{quote.clientAddress}</Text>
            </View>
          </View>

          {/* Job Title */}
          <View style={styles.jobTitleWrap}>
            <Text style={styles.jobTitle}>Re: {quote.jobTitle}</Text>
          </View>

          {/* Line Items Table */}
          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Description</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>Unit</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: 'right' }]}>Price</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: 'right' }]}>Total</Text>
          </View>

          {Object.entries(grouped).map(([category, items], catIdx) => {
            const catTotal = items.reduce((sum, li) => sum + li.total, 0);
            return (
              <View key={category}>
                {/* Category header */}
                <View style={styles.catHeaderRow}>
                  <Text style={styles.catHeaderText}>{category.toUpperCase()}</Text>
                </View>
                {/* Items */}
                {items.map((li, idx) => (
                  <View
                    key={`${li.description}-${idx}`}
                    style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
                  >
                    <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={2}>
                      {li.description}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{li.qty}</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{li.unit}</Text>
                    <Text style={[styles.tableCell, { flex: 1.2, textAlign: 'right' }]}>{fmt(li.unitPrice)}</Text>
                    <Text style={[styles.tableCellBold, { flex: 1.2, textAlign: 'right' }]}>{fmt(li.total)}</Text>
                  </View>
                ))}
                {/* Category subtotal */}
                <View style={styles.catSubtotalRow}>
                  <Text style={styles.catSubtotalLabel}>{category} Subtotal</Text>
                  <Text style={styles.catSubtotalValue}>{fmt(catTotal)}</Text>
                </View>
              </View>
            );
          })}

          {/* Totals Section */}
          <View style={styles.totalsSection}>
            <View style={styles.totalsLine}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{fmt(quote.subtotal)}</Text>
            </View>
            {quote.taxPct > 0 && (
              <View style={styles.totalsLine}>
                <Text style={styles.totalsLabel}>Tax ({quote.taxPct}%)</Text>
                <Text style={styles.totalsValue}>{fmt(quote.taxAmount)}</Text>
              </View>
            )}
            {quote.discountPct > 0 && (
              <View style={styles.totalsLine}>
                <Text style={styles.totalsLabel}>Discount ({quote.discountPct}%)</Text>
                <Text style={[styles.totalsValue, { color: colors.danger }]}>-{fmt(quote.discountAmount)}</Text>
              </View>
            )}
            <View style={styles.grandTotalLine}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>{fmt(quote.grandTotal)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Scope of Work */}
          <Text style={styles.termHeading}>Scope of Work</Text>
          <Text style={styles.termBody}>{quote.scopeOfWork}</Text>

          {/* Timeline */}
          <Text style={styles.termHeading}>Timeline</Text>
          <Text style={styles.termBody}>Estimated Duration: {quote.timeline}</Text>

          {/* Payment Terms */}
          <Text style={styles.termHeading}>Payment Terms</Text>
          <Text style={styles.termBody}>{quote.paymentTerms}</Text>

          {/* Valid Until */}
          <View style={styles.validBox}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={styles.validText}>This estimate is valid until {quote.validUntil}</Text>
          </View>

          {/* Notes */}
          {quote.notes ? (
            <>
              <Text style={styles.termHeading}>Notes</Text>
              <Text style={styles.termBody}>{quote.notes}</Text>
            </>
          ) : null}

          <View style={styles.dividerThin} />

          {/* Footer */}
          <Text style={styles.footerThank}>Thank you for choosing Sherpa Pros</Text>
          <Text style={styles.footerFine}>This estimate is subject to on-site verification</Text>
        </View>
      </ScrollView>

      {/* ── Floating Action Bar ────────────────────────── */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          style={styles.shareBtn}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={20} color={colors.primary} />
          <Text style={styles.shareBtnText}>Share</Text>
        </Pressable>

        {onAccept && (
          <Pressable
            style={styles.acceptBtn}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onAccept();
            }}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.acceptBtnText}>Accept</Text>
          </Pressable>
        )}

        {onDecline && (
          <Pressable
            style={styles.declineBtn}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              onDecline();
            }}
          >
            <Text style={styles.declineBtnText}>Decline</Text>
          </Pressable>
        )}
      </View>
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
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scroll: {
    flex: 1,
  },

  // Document
  document: {
    backgroundColor: '#ffffff',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  docTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 6,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  metaDate: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  metaNumber: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    height: 2,
    backgroundColor: colors.primary,
    marginBottom: spacing.lg,
  },
  dividerThin: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.lg,
  },

  // Parties
  partiesRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    padding: spacing.lg,
  },
  partyCol: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  partyName: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  partyDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Job title
  jobTitleWrap: {
    marginBottom: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMedium,
  },
  jobTitle: {
    ...typography.subheading,
    color: colors.text,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // Table
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.text,
    borderRadius: borderRadius.sm,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  catHeaderRow: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.primaryLight,
    marginTop: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  catHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  tableRowAlt: {
    backgroundColor: '#fafbfc',
  },
  tableCell: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tableCellBold: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  catSubtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  catSubtotalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  catSubtotalValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  // Totals
  totalsSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 2,
    borderTopColor: colors.borderMedium,
    alignItems: 'flex-end',
  },
  totalsLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    paddingVertical: spacing.xs,
  },
  totalsLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  totalsValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  grandTotalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 2,
    borderTopColor: colors.text,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  grandTotalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },

  // Terms
  termHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  termBody: {
    ...typography.bodySmall,
    color: colors.text,
    lineHeight: 22,
  },
  validBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.sm,
  },
  validText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Footer
  footerThank: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  footerFine: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Action bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  shareBtnText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.primary,
  },
  acceptBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  acceptBtnText: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: '#ffffff',
  },
  declineBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  declineBtnText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

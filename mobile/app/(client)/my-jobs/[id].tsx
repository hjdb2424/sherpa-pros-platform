import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import MaterialsFlow from '@/components/checklist/MaterialsFlow';
import type { Material } from '@/components/checklist/MaterialsFlow';
import EstimateDocument from '@/components/quotes/EstimateDocument';
import type { QuoteData } from '@/components/quotes/EstimateDocument';
import { ReviewPrompt, WriteReviewScreen } from '@/components/reviews';
import type { Review } from '@/components/reviews';

// ---------------------------------------------------------------------------
// Mock data (inline)
// ---------------------------------------------------------------------------

interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  review: 'approved' | 'warning' | 'flagged';
}

const MOCK_JOB = {
  id: '5',
  title: 'Bathroom Remodel - Tile and Fixtures',
  category: 'General',
  status: 'in_progress' as const,
  budget: '$8,000 - $15,000',
  urgency: 'standard',
  location: '42 Maple St, Portsmouth, NH',
  description:
    'Full bathroom remodel including demo, tile, fixtures, and paint. Modern farmhouse style with subway tile and matte black fixtures.',
  assignedPro: {
    name: 'Carlos Rivera',
    initials: 'CR',
    rating: 4.9,
    trade: 'General Contractor',
    verified: true,
  },
  materials: [
    { id: 'm1', name: 'Cement board (3x5)', quantity: 4, unit: 'sheets', price: 52, review: 'approved' as const },
    { id: 'm2', name: 'Waterproof membrane', quantity: 1, unit: 'roll', price: 89, review: 'approved' as const },
    { id: 'm3', name: 'Subway tile (white 3x6)', quantity: 80, unit: 'sqft', price: 320, review: 'approved' as const },
    { id: 'm4', name: 'Thinset mortar', quantity: 2, unit: 'bags', price: 48, review: 'warning' as const },
    { id: 'm5', name: 'Matte black shower valve', quantity: 1, unit: 'each', price: 189, review: 'approved' as const },
  ] as MaterialItem[],
};

// Service fee is now handled inside MaterialsFlow

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Plumbing: 'water-outline',
  Electrical: 'flash-outline',
  HVAC: 'thermometer-outline',
  Painting: 'color-palette-outline',
  Roofing: 'home-outline',
  General: 'construct-outline',
  Carpentry: 'hammer-outline',
};

const REVIEW_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  approved: { label: 'Approved', variant: 'success' },
  warning: { label: 'Warning', variant: 'warning' },
  flagged: { label: 'Flagged', variant: 'danger' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Mock quote data (shown for job 'c1' or default)
// ---------------------------------------------------------------------------
const MOCK_QUOTE = {
  proName: 'Carlos Rivera',
  amount: 1088000, // cents = $10,880.00
  validUntil: 'May 15, 2026',
  lineItems: [
    { category: 'Labor', items: [
      { desc: 'Demolition & removal', total: 78000 },
      { desc: 'Rough plumbing', total: 117000 },
      { desc: 'Tile installation', total: 156000 },
      { desc: 'Fixture install & finish', total: 58500 },
    ]},
    { category: 'Materials', items: [
      { desc: 'Cement board (3x5)', total: 24960 },
      { desc: 'Waterproof membrane', total: 10680 },
      { desc: 'Subway tile (white 3x6)', total: 38400 },
      { desc: 'Matte black shower valve', total: 22680 },
    ]},
    { category: 'Equipment', items: [
      { desc: 'Dumpster rental (demo debris)', total: 38500 },
    ]},
    { category: 'Permits', items: [
      { desc: 'Plumbing permit', total: 15000 },
    ]},
  ],
  grandTotal: 1088000,
};

function formatQuoteCents(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

const ESTIMATE_DOC_DATA: QuoteData = {
  quoteNumber: '#QT-2026-001',
  date: 'April 21, 2026',
  validUntil: 'May 21, 2026',
  proName: 'Carlos Rivera',
  proTrade: 'General Contractor',
  proPhone: '(603) 555-0142',
  proEmail: 'carlos@riverabuilds.com',
  proLicense: 'NH-GC-2024-1847',
  clientName: 'John Davidson',
  clientAddress: '42 Maple St, Portsmouth, NH 03801',
  jobTitle: 'Bathroom Remodel \u2014 Phase 1',
  lineItems: [
    { category: 'Labor', description: 'Demolition & removal', qty: 8, unit: 'hrs', unitPrice: 9750, total: 78000 },
    { category: 'Labor', description: 'Rough plumbing', qty: 12, unit: 'hrs', unitPrice: 9750, total: 117000 },
    { category: 'Labor', description: 'Tile installation', qty: 16, unit: 'hrs', unitPrice: 9750, total: 156000 },
    { category: 'Labor', description: 'Fixture install & finish', qty: 6, unit: 'hrs', unitPrice: 9750, total: 58500 },
    { category: 'Materials', description: 'Cement board (3x5)', qty: 4, unit: 'sheets', unitPrice: 6240, total: 24960 },
    { category: 'Materials', description: 'Waterproof membrane', qty: 1, unit: 'roll', unitPrice: 10680, total: 10680 },
    { category: 'Materials', description: 'Subway tile (white 3x6)', qty: 80, unit: 'sqft', unitPrice: 480, total: 38400 },
    { category: 'Materials', description: 'Matte black shower valve', qty: 1, unit: 'each', unitPrice: 22680, total: 22680 },
    { category: 'Equipment', description: 'Dumpster rental (demo debris)', qty: 1, unit: 'each', unitPrice: 38500, total: 38500 },
    { category: 'Permits', description: 'Plumbing permit', qty: 1, unit: 'each', unitPrice: 15000, total: 15000 },
  ],
  laborSubtotal: 409500,
  materialsSubtotal: 96720,
  otherSubtotal: 53500,
  subtotal: 559720,
  taxPct: 0,
  taxAmount: 0,
  discountPct: 0,
  discountAmount: 0,
  grandTotal: 559720,
  scopeOfWork:
    'Full bathroom remodel including demolition of existing tile and fixtures, rough plumbing updates, cement board installation, waterproof membrane application, subway tile installation on walls and floor, matte black fixture installation, and final cleanup.',
  timeline: '5-7 business days',
  paymentTerms: '50% deposit upon acceptance, 50% upon completion',
  notes: 'Price includes all labor, materials, and debris removal. Client to select grout color before start date.',
};

export default function ClientJobDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showMaterialsFlow, setShowMaterialsFlow] = useState(false);
  const [quoteAccepted, setQuoteAccepted] = useState(false);
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  const [showEstimateDoc, setShowEstimateDoc] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewDismissed, setReviewDismissed] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const hasQuote = true; // Mock: always show for demo
  const isCompleted = true; // Mock: show review prompt for demo

  const job = MOCK_JOB; // In production, fetch by `id`

  const flowMaterials: Material[] = job.materials.map((m) => ({
    id: m.id,
    name: m.name,
    qty: m.quantity,
    unit: m.unit,
    price: m.price,
  }));

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const handleMessage = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Message', 'Messaging pro coming soon');
  }, []);

  const handleStartMaterialsFlow = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowMaterialsFlow(true);
  }, []);

  const handleMaterialsFlowComplete = useCallback(() => {
    setShowMaterialsFlow(false);
    Alert.alert('Success', 'Materials order placed successfully!');
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {job.title}
          </Text>
        </View>
        <Badge label="In Progress" variant="warning" />
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
      >
        {/* Review Prompt for completed jobs */}
        {isCompleted && !reviewDismissed && !reviewSubmitted && job.assignedPro && (
          <View style={{ marginBottom: spacing.lg }}>
            <ReviewPrompt
              proName={job.assignedPro.name}
              proInitials={job.assignedPro.initials}
              jobTitle={job.title}
              onReview={() => setShowWriteReview(true)}
              onDismiss={() => setReviewDismissed(true)}
            />
          </View>
        )}

        {/* Job Info Card */}
        <Card style={styles.section} variant="elevated">
          <View style={styles.infoRow}>
            <Ionicons
              name={CATEGORY_ICONS[job.category] ?? 'construct-outline'}
              size={32}
              color={colors.primary}
            />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>{job.title}</Text>
              <Text style={styles.infoCategory}>{job.category}</Text>
            </View>
          </View>

          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color={colors.textMuted} />
              <Text style={styles.detailLabel}>{job.budget}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={colors.textMuted} />
              <Text style={styles.detailLabel}>{job.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={colors.textMuted} />
              <Text style={styles.detailLabel}>
                {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.descriptionText}>{job.description}</Text>
        </Card>

        {/* Assigned Pro Card */}
        {job.assignedPro && (
          <Card style={styles.section} variant="elevated">
            <Text style={styles.sectionTitle}>Assigned Pro</Text>
            <View style={styles.proRow}>
              <Avatar initials={job.assignedPro.initials} size={48} />
              <View style={styles.proInfo}>
                <View style={styles.proNameRow}>
                  <Text style={styles.proName}>{job.assignedPro.name}</Text>
                  {job.assignedPro.verified && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  )}
                </View>
                <Text style={styles.proTrade}>{job.assignedPro.trade}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={colors.warning} />
                  <Text style={styles.ratingText}>{job.assignedPro.rating}</Text>
                </View>
              </View>
              <Button title="Message" onPress={handleMessage} variant="secondary" size="sm" />
            </View>
          </Card>
        )}

        {/* Quote Received Card */}
        {hasQuote && !quoteAccepted && (
          <Card style={styles.section} variant="elevated">
            <View style={styles.quoteHeader}>
              <Ionicons name="document-text" size={24} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.quoteTitle}>Quote Received</Text>
                <Text style={styles.quotePro}>From {MOCK_QUOTE.proName}</Text>
              </View>
              <Text style={styles.quoteAmount}>{formatQuoteCents(MOCK_QUOTE.amount)}</Text>
            </View>
            <Text style={styles.quoteValid}>Valid until {MOCK_QUOTE.validUntil}</Text>

            {showQuoteDetails && (
              <View style={styles.quoteDetails}>
                {MOCK_QUOTE.lineItems.map((group) => (
                  <View key={group.category} style={styles.quoteGroup}>
                    <Text style={styles.quoteGroupLabel}>{group.category}</Text>
                    {group.items.map((li) => (
                      <View key={li.desc} style={styles.quoteLineItem}>
                        <Text style={styles.quoteLineDesc}>{li.desc}</Text>
                        <Text style={styles.quoteLineTotal}>{formatQuoteCents(li.total)}</Text>
                      </View>
                    ))}
                  </View>
                ))}
                <View style={styles.quoteGrandRow}>
                  <Text style={styles.quoteGrandLabel}>Grand Total</Text>
                  <Text style={styles.quoteGrandValue}>{formatQuoteCents(MOCK_QUOTE.grandTotal)}</Text>
                </View>
              </View>
            )}

            <Pressable
              style={styles.quoteViewToggle}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowQuoteDetails((v) => !v);
              }}
            >
              <Text style={styles.quoteViewToggleText}>
                {showQuoteDetails ? 'Hide Details' : 'View Details'}
              </Text>
              <Ionicons
                name={showQuoteDetails ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.primary}
              />
            </Pressable>

            <Pressable
              style={styles.quoteFullDocBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowEstimateDoc(true);
              }}
            >
              <Ionicons name="document-text-outline" size={16} color={colors.primary} />
              <Text style={styles.quoteFullDocText}>View Full Estimate</Text>
            </Pressable>

            <View style={styles.quoteActions}>
              <Pressable
                style={styles.quoteAcceptBtn}
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  Alert.alert('Quote Accepted', 'Quote accepted! Pro will be notified.');
                  setQuoteAccepted(true);
                }}
              >
                <Text style={styles.quoteAcceptText}>Accept</Text>
              </Pressable>
              <Pressable
                style={styles.quoteDeclineBtn}
                onPress={() => {
                  Alert.prompt
                    ? Alert.prompt('Decline Quote', 'Reason for declining (optional):', (reason) => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        Alert.alert('Quote Declined', 'The pro has been notified.');
                      })
                    : Alert.alert('Decline Quote', 'Are you sure you want to decline?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Decline',
                          style: 'destructive',
                          onPress: () => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                            Alert.alert('Quote Declined', 'The pro has been notified.');
                          },
                        },
                      ]);
                }}
              >
                <Text style={styles.quoteDeclineText}>Decline</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.quoteChangesLink}
              onPress={() => {
                Alert.alert('Request Changes', 'This will notify the pro to revise the quote.', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Request',
                    onPress: () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      Alert.alert('Sent', 'Change request sent to the pro.');
                    },
                  },
                ]);
              }}
            >
              <Text style={styles.quoteChangesText}>Request Changes</Text>
            </Pressable>
          </Card>
        )}

        {hasQuote && quoteAccepted && (
          <Card style={{...styles.section, backgroundColor: colors.successLight}} variant="elevated">
            <View style={styles.quoteHeader}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.quoteTitle}>Quote Accepted</Text>
                <Text style={styles.quotePro}>{formatQuoteCents(MOCK_QUOTE.amount)}</Text>
              </View>
              <Badge label="Accepted" variant="success" />
            </View>
          </Card>
        )}

        {/* Materials Flow */}
        {job.materials.length > 0 && !showMaterialsFlow && (
          <>
            <Text style={styles.materialsSectionTitle}>Materials</Text>
            {job.materials.map((mat) => {
              const badge = REVIEW_BADGE[mat.review];
              return (
                <Card key={mat.id} style={styles.materialCard} variant="elevated">
                  <View style={styles.materialRow}>
                    <View style={styles.materialInfo}>
                      <Text style={styles.materialName}>{mat.name}</Text>
                      <Text style={styles.materialSpec}>
                        {mat.quantity} {mat.unit}
                      </Text>
                    </View>
                    <View style={styles.materialRight}>
                      <Badge label={badge.label} variant={badge.variant} />
                      <Text style={styles.materialPrice}>${mat.price}</Text>
                    </View>
                  </View>
                </Card>
              );
            })}

            <View style={{ marginTop: spacing.md }}>
              <Button
                title="Start Materials Order"
                onPress={handleStartMaterialsFlow}
                variant="primary"
                fullWidth
              />
            </View>
          </>
        )}

        {showMaterialsFlow && (
          <MaterialsFlow
            materials={flowMaterials}
            onComplete={handleMaterialsFlowComplete}
          />
        )}
      </ScrollView>

      {/* Full Estimate Document Modal */}
      <Modal visible={showEstimateDoc} animationType="slide" presentationStyle="fullScreen">
        <EstimateDocument
          quote={ESTIMATE_DOC_DATA}
          onClose={() => setShowEstimateDoc(false)}
          onAccept={() => {
            setShowEstimateDoc(false);
            setQuoteAccepted(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Quote Accepted', 'Quote accepted! Pro will be notified.');
          }}
          onDecline={() => {
            setShowEstimateDoc(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('Quote Declined', 'The pro has been notified.');
          }}
        />
      </Modal>

      {/* Write Review Modal */}
      <Modal visible={showWriteReview} animationType="slide" presentationStyle="fullScreen">
        <WriteReviewScreen
          proName={job.assignedPro?.name ?? 'Pro'}
          proInitials={job.assignedPro?.initials ?? 'P'}
          jobTitle={job.title}
          onSubmit={(review: Partial<Review>) => {
            setShowWriteReview(false);
            setReviewSubmitted(true);
            Alert.alert('Review Submitted', 'Thank you for your review!');
          }}
          onClose={() => setShowWriteReview(false)}
        />
      </Modal>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  headerCenter: {
    flex: 1,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },

  // Scroll
  scrollContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  // Sections
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },

  // Info card
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  infoText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  infoCategory: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  detailGrid: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  descriptionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  // Pro card
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  proNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  proName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  proTrade: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  ratingText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },

  // Materials
  materialsSectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  materialCard: {
    marginBottom: spacing.md,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  materialInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  materialName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  materialSpec: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  materialRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  materialPrice: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },

  // Quote received
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  quotePro: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  quoteAmount: {
    ...typography.subheading,
    color: colors.primary,
    fontWeight: '700',
  },
  quoteValid: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  quoteDetails: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  quoteGroup: {
    marginBottom: spacing.md,
  },
  quoteGroupLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  quoteLineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  quoteLineDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  quoteLineTotal: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  quoteGrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 2,
    borderTopColor: colors.borderMedium,
  },
  quoteGrandLabel: {
    ...typography.subheading,
    color: colors.text,
    fontSize: 16,
  },
  quoteGrandValue: {
    ...typography.subheading,
    color: colors.primary,
    fontSize: 16,
  },
  quoteViewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  quoteViewToggleText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  quoteActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  quoteAcceptBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  quoteAcceptText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textInverse,
  },
  quoteDeclineBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  quoteDeclineText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  quoteFullDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quoteFullDocText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
  },
  quoteChangesLink: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  quoteChangesText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});

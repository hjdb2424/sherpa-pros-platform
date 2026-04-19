import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
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

const SERVICE_FEE_PERCENT = 0.085; // 8.5%

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

export default function ClientJobDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'finance'>('card');

  const job = MOCK_JOB; // In production, fetch by `id`

  const materialsSubtotal = job.materials.reduce((sum, m) => sum + m.price, 0);
  const serviceFee = Math.round(materialsSubtotal * SERVICE_FEE_PERCENT);
  const grandTotal = materialsSubtotal + serviceFee;

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const handleMessage = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Message', 'Messaging pro coming soon');
  }, []);

  const handleApproveMaterials = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Approve Materials', 'Material approval flow coming soon');
  }, []);

  const handleSelectPayment = useCallback((method: 'card' | 'finance') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPayment(method);
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

        {/* Materials Section */}
        {job.materials.length > 0 && (
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

            {/* Materials Approval Card */}
            <Card style={styles.approvalCard} variant="elevated">
              <Text style={styles.sectionTitle}>Materials Approval</Text>

              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Subtotal</Text>
                <Text style={styles.costValue}>${materialsSubtotal.toLocaleString()}</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>
                  Sherpa Service Fee ({(SERVICE_FEE_PERCENT * 100).toFixed(1)}%)
                </Text>
                <Text style={styles.costValue}>${serviceFee.toLocaleString()}</Text>
              </View>
              <View style={[styles.costRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>${grandTotal.toLocaleString()}</Text>
              </View>

              <View style={{ marginTop: spacing.lg }}>
                <Button
                  title="Approve Materials"
                  onPress={handleApproveMaterials}
                  variant="primary"
                  fullWidth
                />
              </View>
            </Card>
          </>
        )}

        {/* Payment Method Selector */}
        <Text style={styles.materialsSectionTitle}>Payment Method</Text>

        <Pressable onPress={() => handleSelectPayment('card')}>
          <Card
            style={{
              ...styles.paymentCard,
              ...(selectedPayment === 'card' ? styles.paymentCardSelected : {}),
            }}
            variant="outlined"
          >
            <View style={styles.paymentRow}>
              <View style={styles.paymentIcon}>
                <Ionicons name="card-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Pay with Card</Text>
                <Text style={styles.paymentDescription}>
                  Credit or debit card via Stripe
                </Text>
              </View>
              <Ionicons
                name={selectedPayment === 'card' ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={selectedPayment === 'card' ? colors.primary : colors.textMuted}
              />
            </View>
          </Card>
        </Pressable>

        <Pressable onPress={() => handleSelectPayment('finance')}>
          <Card
            style={{
              ...styles.paymentCard,
              ...(selectedPayment === 'finance' ? styles.paymentCardSelected : {}),
            }}
            variant="outlined"
          >
            <View style={styles.paymentRow}>
              <View style={styles.paymentIcon}>
                <Ionicons name="wallet-outline" size={24} color={colors.success} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Finance with Wisetack</Text>
                <Text style={styles.paymentDescription}>
                  0% APR financing available. Pay over time.
                </Text>
              </View>
              <Ionicons
                name={selectedPayment === 'finance' ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={selectedPayment === 'finance' ? colors.primary : colors.textMuted}
              />
            </View>
          </Card>
        </Pressable>
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

  // Approval card
  approvalCard: {
    marginBottom: spacing.lg,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  costLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  costValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  totalLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  totalValue: {
    ...typography.heading,
    color: colors.primary,
  },

  // Payment
  paymentCard: {
    marginBottom: spacing.md,
  },
  paymentCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  paymentInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  paymentTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  paymentDescription: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});

import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  LayoutAnimation,
  Linking,
  StyleSheet,
  Platform,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatCents(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}.${String(remainder).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

interface WODetail {
  id: string;
  title: string;
  property: string;
  unit: string;
  category: string;
  priority: string;
  status: string;
  slaHours: number;
  created: string;
  estimatedCostCents: number;
  actualCostCents: number | null;
  capex: boolean;
  budgetLineItem: string | null;
  pro: { name: string; phone: string; rating: number } | null;
  dispatchedAt: string | null;
  timeline: { step: string; timestamp: string | null; by: string | null }[];
  notes: { author: string; text: string; timestamp: string }[];
  photos: { label: string; url: string | null }[];
  schedule: { name: string; frequency: string; nextDue: string } | null;
}

const DETAILS: Record<string, WODetail> = {
  'wo-5': {
    id: 'WO-101', title: 'Leaking faucet', property: 'Maple Ridge', unit: '204', category: 'Plumbing',
    priority: 'Routine', status: 'Completed', slaHours: 72, created: 'Apr 14, 2026',
    estimatedCostCents: 45000, actualCostCents: 38000, capex: false, budgetLineItem: 'MR-MAINT-2026-04',
    pro: { name: 'Mike Rodriguez', phone: '(603) 555-0142', rating: 4.9 },
    dispatchedAt: 'Apr 15, 2026 08:00',
    timeline: [
      { step: 'Created', timestamp: 'Apr 14 09:22', by: 'Lisa Park' },
      { step: 'Approved', timestamp: 'Apr 14 09:45', by: 'Lisa Park' },
      { step: 'Dispatched', timestamp: 'Apr 15 08:00', by: 'System' },
      { step: 'Started', timestamp: 'Apr 16 10:15', by: 'Mike Rodriguez' },
      { step: 'Completed', timestamp: 'Apr 17 14:30', by: 'Mike Rodriguez' },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [
      { author: 'Tenant (Unit 204)', text: 'Tenant reported leak under kitchen sink at 2pm', timestamp: 'Apr 14 14:00' },
      { author: 'Mike Rodriguez', text: 'P-trap corroded, replacement ordered', timestamp: 'Apr 16 10:30' },
      { author: 'Mike Rodriguez', text: 'Repair complete, no further leaks', timestamp: 'Apr 17 14:30' },
    ],
    photos: [
      { label: 'Before', url: null },
      { label: 'During', url: null },
      { label: 'After', url: null },
    ],
    schedule: null,
  },
};

// Default detail for any WO
const DEFAULT_DETAIL: WODetail = {
  id: 'WO-101', title: 'Leaking faucet', property: 'Maple Ridge', unit: '204', category: 'Plumbing',
  priority: 'Routine', status: 'Completed', slaHours: 72, created: 'Apr 14, 2026',
  estimatedCostCents: 45000, actualCostCents: 38000, capex: false, budgetLineItem: 'MR-MAINT-2026-04',
  pro: { name: 'Mike Rodriguez', phone: '(603) 555-0142', rating: 4.9 },
  dispatchedAt: 'Apr 15, 2026 08:00',
  timeline: [
    { step: 'Created', timestamp: 'Apr 14 09:22', by: 'Lisa Park' },
    { step: 'Approved', timestamp: 'Apr 14 09:45', by: 'Lisa Park' },
    { step: 'Dispatched', timestamp: 'Apr 15 08:00', by: 'System' },
    { step: 'Started', timestamp: 'Apr 16 10:15', by: 'Mike Rodriguez' },
    { step: 'Completed', timestamp: 'Apr 17 14:30', by: 'Mike Rodriguez' },
    { step: 'Invoiced', timestamp: null, by: null },
  ],
  notes: [
    { author: 'Tenant (Unit 204)', text: 'Tenant reported leak under kitchen sink at 2pm', timestamp: 'Apr 14 14:00' },
    { author: 'Mike Rodriguez', text: 'P-trap corroded, replacement ordered', timestamp: 'Apr 16 10:30' },
    { author: 'Mike Rodriguez', text: 'Repair complete, no further leaks', timestamp: 'Apr 17 14:30' },
  ],
  photos: [
    { label: 'Before', url: null },
    { label: 'During', url: null },
    { label: 'After', url: null },
  ],
  schedule: { name: 'HVAC Filter Changes', frequency: 'Quarterly', nextDue: 'Apr 30, 2026' },
};

/* ------------------------------------------------------------------ */
/* Collapsible Section                                                 */
/* ------------------------------------------------------------------ */

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const rotation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = !isOpen;
    setIsOpen(next);
    Animated.timing(rotation, {
      toValue: next ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isOpen, rotation]);

  const rotateZ = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.section}>
      <Pressable onPress={toggle} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Animated.View style={{ transform: [{ rotateZ }] }}>
          <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
        </Animated.View>
      </Pressable>
      {isOpen && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Detail Row                                                          */
/* ------------------------------------------------------------------ */

function DetailRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export default function WorkOrderDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const detail = DETAILS[params.id ?? ''] ?? DEFAULT_DETAIL;

  const varianceCents = detail.actualCostCents != null ? detail.estimatedCostCents - detail.actualCostCents : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{detail.id}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
      >
        {/* Section 1: Overview */}
        <CollapsibleSection title="Overview" defaultOpen>
          <Text style={styles.woTitle}>{detail.title}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>{detail.status}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.warningLight }]}>
              <Text style={[styles.badgeText, { color: colors.warning }]}>{detail.priority}</Text>
            </View>
          </View>
          <DetailRow label="Property" value={`${detail.property}, Unit ${detail.unit}`} />
          <DetailRow label="Category" value={detail.category} />
          <DetailRow label="Created" value={detail.created} />
          <DetailRow label="SLA" value={`${detail.slaHours} hours`} />
        </CollapsibleSection>

        {/* Section 2: Assignment */}
        <CollapsibleSection title="Assignment" defaultOpen>
          {detail.pro ? (
            <>
              <View style={styles.proRow}>
                <View>
                  <Text style={styles.proName}>{detail.pro.name}</Text>
                  <Text style={styles.proPhone}>{detail.pro.phone}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#f59e0b" />
                    <Text style={styles.ratingText}>{detail.pro.rating}</Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <Pressable
                    onPress={() => Linking.openURL(`tel:${detail.pro!.phone.replace(/\D/g, '')}`)}
                    style={styles.actionBtn}
                  >
                    <Ionicons name="call-outline" size={16} color={colors.primary} />
                    <Text style={styles.actionBtnText}>Call</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    style={[styles.actionBtn, styles.actionBtnFilled]}
                  >
                    <Ionicons name="chatbubble-outline" size={16} color={colors.textInverse} />
                    <Text style={[styles.actionBtnText, { color: colors.textInverse }]}>Message</Text>
                  </Pressable>
                </View>
              </View>
              {detail.dispatchedAt && (
                <Text style={styles.dispatchText}>Dispatched: {detail.dispatchedAt}</Text>
              )}
            </>
          ) : (
            <View style={styles.unassigned}>
              <Text style={styles.unassignedText}>No pro assigned yet</Text>
              <Pressable style={styles.assignBtn}>
                <Text style={styles.assignBtnText}>Assign Pro</Text>
              </Pressable>
            </View>
          )}
        </CollapsibleSection>

        {/* Section 3: Cost & Budget */}
        <CollapsibleSection title="Cost & Budget" defaultOpen>
          <DetailRow label="Estimated" value={formatCents(detail.estimatedCostCents)} />
          {detail.actualCostCents != null && (
            <>
              <DetailRow label="Actual" value={formatCents(detail.actualCostCents)} />
              <DetailRow
                label="Variance"
                value={`${varianceCents != null && varianceCents >= 0 ? 'Under ' : 'Over '}${formatCents(Math.abs(varianceCents ?? 0))}`}
                valueColor={varianceCents != null && varianceCents >= 0 ? colors.success : colors.danger}
              />
            </>
          )}
          <DetailRow label="Classification" value={detail.capex ? 'CapEx' : 'OpEx'} />
          {detail.budgetLineItem && <DetailRow label="Budget Line" value={detail.budgetLineItem} />}
        </CollapsibleSection>

        {/* Section 4: Timeline */}
        <CollapsibleSection title="Timeline">
          <View style={styles.timeline}>
            {detail.timeline.map((step, i) => {
              const done = step.timestamp != null;
              const isLast = i === detail.timeline.length - 1;
              return (
                <View key={step.step} style={styles.timelineRow}>
                  <View style={styles.timelineDotCol}>
                    <View style={[styles.timelineDot, done && styles.timelineDotDone]} />
                    {!isLast && (
                      <View style={[styles.timelineLine, done && styles.timelineLineDone]} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[styles.timelineStep, !done && styles.timelineStepPending]}>
                      {step.step}
                    </Text>
                    {done ? (
                      <Text style={styles.timelineMeta}>
                        {step.timestamp} {step.by ? `by ${step.by}` : ''}
                      </Text>
                    ) : (
                      <Text style={styles.timelinePending}>Pending</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </CollapsibleSection>

        {/* Section 5: Photos */}
        <CollapsibleSection title="Photos">
          {detail.photos.length === 0 ? (
            <Text style={styles.emptyText}>No photos yet</Text>
          ) : (
            <View style={styles.photoGrid}>
              {detail.photos.map((photo) => (
                <View key={photo.label} style={styles.photoSlot}>
                  <Ionicons name="image-outline" size={24} color={colors.borderMedium} />
                  <Text style={styles.photoLabel}>{photo.label}</Text>
                </View>
              ))}
            </View>
          )}
        </CollapsibleSection>

        {/* Section 6: Notes & Activity */}
        <CollapsibleSection title="Notes & Activity">
          {detail.notes.length === 0 ? (
            <Text style={styles.emptyText}>No notes yet</Text>
          ) : (
            <View style={styles.notesList}>
              {detail.notes.map((note, i) => (
                <View key={i} style={styles.noteCard}>
                  <View style={styles.noteHeader}>
                    <Text style={styles.noteAuthor}>{note.author}</Text>
                    <Text style={styles.noteTime}>{note.timestamp}</Text>
                  </View>
                  <Text style={styles.noteText}>{note.text}</Text>
                </View>
              ))}
            </View>
          )}
        </CollapsibleSection>

        {/* Section 7: Related Schedule */}
        {detail.schedule && (
          <CollapsibleSection title="Related Schedule">
            <DetailRow label="Schedule" value={detail.schedule.name} />
            <DetailRow label="Frequency" value={detail.schedule.frequency} />
            <DetailRow label="Next Due" value={detail.schedule.nextDue} />
          </CollapsibleSection>
        )}
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius.sm },
  headerTitle: { ...typography.heading, fontSize: 18, color: colors.text },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  // Sections
  section: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  sectionBody: { paddingBottom: spacing.lg },

  // WO title
  woTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },

  // Badges
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 3, borderRadius: borderRadius.full },
  badgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Detail rows
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  detailLabel: { ...typography.caption, color: colors.textMuted },
  detailValue: { ...typography.bodySmall, fontWeight: '600', color: colors.text },

  // Pro assignment
  proRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  proName: { fontSize: 15, fontWeight: '700', color: colors.text },
  proPhone: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  ratingText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  actionButtons: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  actionBtnFilled: { backgroundColor: colors.primary, borderColor: colors.primary },
  actionBtnText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  dispatchText: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  unassigned: { alignItems: 'center', paddingVertical: spacing.md },
  unassignedText: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.md },
  assignBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  assignBtnText: { fontSize: 14, fontWeight: '600', color: colors.textInverse },

  // Timeline
  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', gap: spacing.md },
  timelineDotCol: { alignItems: 'center', width: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors.borderMedium, backgroundColor: colors.background, marginTop: 2 },
  timelineDotDone: { borderColor: colors.primary, backgroundColor: colors.primary },
  timelineLine: { width: 2, flex: 1, minHeight: 20, backgroundColor: colors.borderLight },
  timelineLineDone: { backgroundColor: colors.primary },
  timelineContent: { flex: 1, paddingBottom: spacing.md },
  timelineStep: { fontSize: 12, fontWeight: '600', color: colors.text },
  timelineStepPending: { color: colors.textMuted },
  timelineMeta: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  timelinePending: { fontSize: 10, color: colors.textMuted, fontStyle: 'italic', marginTop: 1 },

  // Photos
  photoGrid: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  photoSlot: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoLabel: { fontSize: 10, color: colors.textMuted },

  // Notes
  notesList: { gap: spacing.sm },
  noteCard: { backgroundColor: colors.surfaceSecondary, borderRadius: borderRadius.sm, padding: spacing.md },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  noteAuthor: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  noteTime: { fontSize: 10, color: colors.textMuted },
  noteText: { ...typography.bodySmall, color: colors.textSecondary },

  // Empty
  emptyText: { ...typography.bodySmall, color: colors.textMuted, fontStyle: 'italic' },
});

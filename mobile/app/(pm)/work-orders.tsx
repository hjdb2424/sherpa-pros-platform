import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Animated,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDollars(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  return `$${dollars.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

type Priority = 'urgent' | 'high' | 'normal' | 'low';
type WOStatus = 'open' | 'in-progress' | 'completed';

interface WorkOrder {
  id: string;
  property: string;
  unit: string;
  description: string;
  status: WOStatus;
  priority: Priority;
  assignedPro: string | null;
  estimateCents: number;
  createdDate: string;
}

const WORK_ORDERS: WorkOrder[] = [
  { id: 'wo-1', property: '220 Main St', unit: '1B', description: 'Prep vacant unit for listing - paint, clean, minor repairs', status: 'open', priority: 'urgent', assignedPro: null, estimateCents: 285_000, createdDate: 'Apr 21' },
  { id: 'wo-2', property: 'Maple Ridge', unit: '305', description: 'Kitchen remodel for new tenant', status: 'in-progress', priority: 'high', assignedPro: 'Carlos Rivera', estimateCents: 1_200_000, createdDate: 'Apr 18' },
  { id: 'wo-3', property: 'Student Housing', unit: '18', description: 'Paint and clean for summer turnover', status: 'open', priority: 'urgent', assignedPro: null, estimateCents: 180_000, createdDate: 'Apr 21' },
  { id: 'wo-4', property: 'Student Housing', unit: '5', description: 'In-unit washer/dryer installation', status: 'in-progress', priority: 'high', assignedPro: 'James Wilson', estimateCents: 450_000, createdDate: 'Apr 20' },
  { id: 'wo-5', property: 'Maple Ridge', unit: '201', description: 'Leaking faucet in bathroom', status: 'open', priority: 'normal', assignedPro: 'Mike Rodriguez', estimateCents: 35_000, createdDate: 'Apr 22' },
  { id: 'wo-6', property: '220 Main St', unit: 'Exterior', description: 'Parking lot reseal - Phase 2', status: 'in-progress', priority: 'high', assignedPro: 'Carlos Rivera', estimateCents: 850_000, createdDate: 'Apr 15' },
  { id: 'wo-7', property: 'Harbor View', unit: 'Common', description: 'Pool filter maintenance', status: 'open', priority: 'normal', assignedPro: null, estimateCents: 22_000, createdDate: 'Apr 22' },
  { id: 'wo-8', property: 'Student Housing', unit: '12', description: 'Broken window latch replacement', status: 'open', priority: 'normal', assignedPro: null, estimateCents: 15_000, createdDate: 'Apr 22' },
  { id: 'wo-9', property: 'Maple Ridge', unit: '102', description: 'HVAC filter replacement', status: 'completed', priority: 'low', assignedPro: 'James Wilson', estimateCents: 12_000, createdDate: 'Apr 18' },
  { id: 'wo-10', property: '220 Main St', unit: '2A', description: 'Window caulking repair', status: 'open', priority: 'low', assignedPro: null, estimateCents: 8_500, createdDate: 'Apr 19' },
  { id: 'wo-11', property: 'Student Housing', unit: 'Common', description: 'Replace hallway light fixtures', status: 'completed', priority: 'low', assignedPro: 'Sarah Chen', estimateCents: 42_000, createdDate: 'Apr 10' },
];

const PRIORITY_FILTERS: ('All' | Priority)[] = ['All', 'urgent', 'high', 'normal', 'low'];

const PRIORITY_COLORS: Record<Priority, string> = {
  urgent: colors.danger,
  high: colors.accent,
  normal: colors.primary,
  low: colors.textMuted,
};

const PRIORITY_LABELS: Record<Priority, string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
};

const STATUS_BADGE: Record<WOStatus, { label: string; variant: 'success' | 'warning' | 'primary' }> = {
  open: { label: 'Open', variant: 'warning' },
  'in-progress': { label: 'In Progress', variant: 'primary' },
  completed: { label: 'Completed', variant: 'success' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WorkOrdersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | Priority>('All');
  const fabAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fabAnim, {
      toValue: 1,
      duration: 400,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const filtered = activeFilter === 'All'
    ? WORK_ORDERS
    : WORK_ORDERS.filter((wo) => wo.priority === activeFilter);

  // Sort: open first, then in-progress, then completed
  const sortOrder: Record<WOStatus, number> = { open: 0, 'in-progress': 1, completed: 2 };
  const sorted = [...filtered].sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Work Orders</Text>
        <Text style={styles.headerSubtitle}>
          {WORK_ORDERS.filter((wo) => wo.status === 'open').length} open {'\u00B7'}{' '}
          {WORK_ORDERS.filter((wo) => wo.status === 'in-progress').length} in progress
        </Text>
      </View>

      {/* Priority filter pills */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {PRIORITY_FILTERS.map((filter) => {
            const active = filter === activeFilter;
            const isUrgent = filter === 'urgent';
            return (
              <Pressable
                key={filter}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveFilter(filter);
                }}
                style={[
                  styles.filterPill,
                  active && styles.filterPillActive,
                  active && isUrgent && { backgroundColor: colors.danger },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    active && styles.filterPillTextActive,
                  ]}
                >
                  {filter === 'All' ? 'All' : PRIORITY_LABELS[filter]}
                </Text>
                {filter !== 'All' && (
                  <View style={[styles.filterCount, active && { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                    <Text style={[styles.filterCountText, active && { color: colors.textInverse }]}>
                      {WORK_ORDERS.filter((wo) => wo.priority === filter).length}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {sorted.map((wo) => {
          const statusBadge = STATUS_BADGE[wo.status];
          return (
            <Pressable
              key={wo.id}
              style={({ pressed }) => [pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Read-only detail - just show alert for now
              }}
            >
              <Card style={styles.woCard} variant="elevated">
                <View style={styles.woTopRow}>
                  <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[wo.priority] }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.woProperty}>{wo.property} {'\u00B7'} Unit {wo.unit}</Text>
                    <Text style={styles.woDesc} numberOfLines={2}>{wo.description}</Text>
                  </View>
                </View>

                <View style={styles.woBottomRow}>
                  <Badge label={statusBadge.label} variant={statusBadge.variant} />
                  <Badge label={PRIORITY_LABELS[wo.priority]} variant={wo.priority === 'urgent' ? 'danger' : wo.priority === 'high' ? 'warning' : 'neutral'} />

                  {wo.assignedPro ? (
                    <View style={styles.proTag}>
                      <Ionicons name="person-outline" size={10} color={colors.primary} />
                      <Text style={styles.proTagText}>{wo.assignedPro}</Text>
                    </View>
                  ) : (
                    <View style={styles.unassignedTag}>
                      <Text style={styles.unassignedText}>Unassigned</Text>
                    </View>
                  )}

                  <Text style={styles.woEstimate}>{formatDollars(wo.estimateCents)}</Text>
                  <Text style={styles.woDate}>{wo.createdDate}</Text>
                </View>
              </Card>
            </Pressable>
          );
        })}

        {sorted.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={48} color={colors.borderMedium} />
            <Text style={styles.emptyText}>No work orders matching filter</Text>
          </View>
        )}
      </ScrollView>

      {/* FAB: New Work Order */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            opacity: fabAnim,
            transform: [{ translateY: fabAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          },
        ]}
      >
        <Pressable
          style={styles.fab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // Navigate to create screen stub (would be a separate route)
          }}
        >
          <Ionicons name="add" size={22} color={colors.textInverse} />
          <Text style={styles.fabText}>New Work Order</Text>
        </Pressable>
      </Animated.View>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
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

  // Filters
  filterRow: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: spacing.md,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.textInverse,
  },
  filterCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },

  scrollContent: {
    paddingVertical: spacing.lg,
    paddingBottom: 120,
  },

  // Work Order Card
  woCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  woTopRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  woProperty: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  woDesc: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  woBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  proTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
  },
  proTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
  unassignedTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.dangerLight,
  },
  unassignedText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.danger,
  },
  woEstimate: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
  },
  woDate: {
    ...typography.caption,
    color: colors.textMuted,
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },

  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
    zIndex: 10,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    ...shadows.primaryGlow,
  },
  fabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textInverse,
  },
});

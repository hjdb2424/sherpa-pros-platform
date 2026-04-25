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
import Logo from '@/components/brand/Logo';

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
type ItemType = 'wo' | 'schedule';
type TabFilter = 'active' | 'scheduled' | 'all';

interface WorkOrder {
  id: string;
  type: ItemType;
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
  { id: 'wo-1', type: 'wo', property: '220 Main St', unit: '1B', description: 'Prep vacant unit for listing - paint, clean, minor repairs', status: 'open', priority: 'urgent', assignedPro: null, estimateCents: 285_000, createdDate: 'Apr 21' },
  { id: 'wo-2', type: 'wo', property: 'Maple Ridge', unit: '305', description: 'Kitchen remodel for new tenant', status: 'in-progress', priority: 'high', assignedPro: 'Carlos Rivera', estimateCents: 1_200_000, createdDate: 'Apr 18' },
  { id: 'wo-3', type: 'wo', property: 'Student Housing', unit: '18', description: 'Paint and clean for summer turnover', status: 'open', priority: 'urgent', assignedPro: null, estimateCents: 180_000, createdDate: 'Apr 21' },
  { id: 'wo-4', type: 'wo', property: 'Student Housing', unit: '5', description: 'In-unit washer/dryer installation', status: 'in-progress', priority: 'high', assignedPro: 'James Wilson', estimateCents: 450_000, createdDate: 'Apr 20' },
  { id: 'wo-5', type: 'wo', property: 'Maple Ridge', unit: '201', description: 'Leaking faucet in bathroom', status: 'open', priority: 'normal', assignedPro: 'Mike Rodriguez', estimateCents: 35_000, createdDate: 'Apr 22' },
  { id: 'wo-6', type: 'wo', property: '220 Main St', unit: 'Exterior', description: 'Parking lot reseal - Phase 2', status: 'in-progress', priority: 'high', assignedPro: 'Carlos Rivera', estimateCents: 850_000, createdDate: 'Apr 15' },
  { id: 'wo-7', type: 'wo', property: 'Harbor View', unit: 'Common', description: 'Pool filter maintenance', status: 'open', priority: 'normal', assignedPro: null, estimateCents: 22_000, createdDate: 'Apr 22' },
  { id: 'wo-8', type: 'wo', property: 'Student Housing', unit: '12', description: 'Broken window latch replacement', status: 'open', priority: 'normal', assignedPro: null, estimateCents: 15_000, createdDate: 'Apr 22' },
  { id: 'wo-9', type: 'wo', property: 'Maple Ridge', unit: '102', description: 'HVAC filter replacement', status: 'completed', priority: 'low', assignedPro: 'James Wilson', estimateCents: 12_000, createdDate: 'Apr 18' },
  { id: 'wo-10', type: 'wo', property: '220 Main St', unit: '2A', description: 'Window caulking repair', status: 'open', priority: 'low', assignedPro: null, estimateCents: 8_500, createdDate: 'Apr 19' },
  { id: 'wo-11', type: 'wo', property: 'Student Housing', unit: 'Common', description: 'Replace hallway light fixtures', status: 'completed', priority: 'low', assignedPro: 'Sarah Chen', estimateCents: 42_000, createdDate: 'Apr 10' },
];

const SCHEDULE_ITEMS: WorkOrder[] = [
  { id: 'sch-1', type: 'schedule', property: 'All Properties', unit: '--', description: 'HVAC Filter Changes (Quarterly)', status: 'open', priority: 'normal', assignedPro: 'James Wilson', estimateCents: 185_000, createdDate: 'Apr 30' },
  { id: 'sch-2', type: 'schedule', property: 'Maple Ridge, Harbor View', unit: '--', description: 'Gutter Cleaning (Spring)', status: 'open', priority: 'normal', assignedPro: null, estimateCents: 95_000, createdDate: 'Apr 25' },
  { id: 'sch-3', type: 'schedule', property: 'All Properties', unit: '--', description: 'Pest Control (Monthly) - OVERDUE', status: 'open', priority: 'urgent', assignedPro: 'Seacoast Pest Control', estimateCents: 45_000, createdDate: 'Apr 15' },
  { id: 'sch-4', type: 'schedule', property: 'Maple Ridge, Harbor View', unit: '--', description: 'Landscaping (Weekly)', status: 'in-progress', priority: 'low', assignedPro: 'Green Thumb', estimateCents: 35_000, createdDate: 'Apr 24' },
];

const ALL_ITEMS = [...WORK_ORDERS, ...SCHEDULE_ITEMS];

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

const TAB_FILTERS: { key: TabFilter; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'all', label: 'All' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WorkOrdersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabFilter>('active');
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

  // Filter by tab first
  const tabFiltered = activeTab === 'active'
    ? WORK_ORDERS
    : activeTab === 'scheduled'
      ? SCHEDULE_ITEMS
      : ALL_ITEMS;

  // Then filter by priority
  const filtered = activeFilter === 'All'
    ? tabFiltered
    : tabFiltered.filter((wo) => wo.priority === activeFilter);

  // Sort: open first, then in-progress, then completed
  const sortOrder: Record<WOStatus, number> = { open: 0, 'in-progress': 1, completed: 2 };
  const sorted = [...filtered].sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);

  const openCount = WORK_ORDERS.filter((wo) => wo.status === 'open').length;
  const inProgressCount = WORK_ORDERS.filter((wo) => wo.status === 'in-progress').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Logo size="sm" />
        <Text style={styles.headerTitle}>Maintenance</Text>
        <Text style={styles.headerSubtitle}>
          {openCount} open {'\u00B7'} {inProgressCount} in progress {'\u00B7'} {SCHEDULE_ITEMS.length} scheduled
        </Text>
      </View>

      {/* Tab pills: Active / Scheduled / All */}
      <View style={styles.tabRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
          {TAB_FILTERS.map((tab) => {
            const active = tab.key === activeTab;
            return (
              <Pressable
                key={tab.key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveTab(tab.key);
                }}
                style={[styles.tabPill, active && styles.tabPillActive]}
              >
                {tab.key === 'active' && (
                  <Ionicons name="construct-outline" size={12} color={active ? colors.textInverse : colors.textSecondary} />
                )}
                {tab.key === 'scheduled' && (
                  <Ionicons name="calendar-outline" size={12} color={active ? colors.textInverse : colors.textSecondary} />
                )}
                {tab.key === 'all' && (
                  <Ionicons name="list-outline" size={12} color={active ? colors.textInverse : colors.textSecondary} />
                )}
                <Text style={[styles.tabPillText, active && styles.tabPillTextActive]}>
                  {tab.label}
                </Text>
                <View style={[styles.tabCount, active && { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                  <Text style={[styles.tabCountText, active && { color: colors.textInverse }]}>
                    {tab.key === 'active' ? WORK_ORDERS.length : tab.key === 'scheduled' ? SCHEDULE_ITEMS.length : ALL_ITEMS.length}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Priority filter pills */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {(['All', 'urgent', 'high', 'normal', 'low'] as ('All' | Priority)[]).map((filter) => {
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
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {filter === 'All' ? 'All' : PRIORITY_LABELS[filter]}
                </Text>
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
          const isSchedule = wo.type === 'schedule';
          return (
            <Pressable
              key={wo.id}
              style={({ pressed }) => [pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push({ pathname: '/(pm)/work-order-detail', params: { id: wo.id } });
              }}
            >
              <Card style={styles.woCard} variant="elevated">
                <View style={styles.woTopRow}>
                  {isSchedule ? (
                    <Ionicons name="calendar" size={14} color={colors.warning} style={{ marginTop: 2 }} />
                  ) : (
                    <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[wo.priority] }]} />
                  )}
                  <View style={{ flex: 1 }}>
                    <View style={styles.typeRow}>
                      <Text style={styles.woProperty}>{wo.property} {'\u00B7'} Unit {wo.unit}</Text>
                      {isSchedule && (
                        <View style={styles.scheduleTag}>
                          <Text style={styles.scheduleTagText}>Schedule</Text>
                        </View>
                      )}
                    </View>
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
            <Text style={styles.emptyText}>No items matching filter</Text>
          </View>
        )}
      </ScrollView>

      {/* FAB: New Work Order — compact, bottom-right */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            bottom: insets.bottom + 90,
            opacity: fabAnim,
            transform: [{ translateY: fabAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          },
        ]}
      >
        <Pressable
          style={styles.fab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <Ionicons name="add" size={24} color={colors.textInverse} />
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
    paddingBottom: spacing.sm,
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

  // Tab pills (Active / Scheduled / All)
  tabRow: {
    backgroundColor: colors.background,
    paddingBottom: spacing.sm,
  },
  tabContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  tabPill: {
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
  tabPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabPillText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabPillTextActive: {
    color: colors.textInverse,
  },
  tabCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },

  // Priority filters
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
    paddingVertical: 6,
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
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.textInverse,
  },

  scrollContent: {
    paddingVertical: spacing.lg,
    paddingBottom: 160,
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
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scheduleTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
    backgroundColor: colors.warningLight,
  },
  scheduleTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.warning,
    textTransform: 'uppercase',
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

  // FAB - compact bottom-right (Material FAB pattern)
  fabContainer: {
    position: 'absolute',
    right: spacing.lg,
    alignItems: 'center',
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primaryGlow,
  },
});

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
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}`;
}

function formatCents(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}.${String(remainder).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

interface PropertyDetail {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  occupancyRate: number;
  avgRentPerSqft: number;
  maintCostPerUnit: number;
  avgDaysToFill: number;
  openWOs: number;
  avgResolutionHours: number;
  maintByCategory: { label: string; cents: number }[];
  units: Unit[];
  recentWOs: WorkOrder[];
}

interface Unit {
  id: string;
  number: string;
  tenant: string | null;
  rentCents: number;
  status: 'occupied' | 'vacant' | 'notice';
}

interface WorkOrder {
  id: string;
  unit: string;
  description: string;
  status: 'open' | 'in-progress' | 'completed';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  date: string;
}

const PROPERTIES_MAP: Record<string, PropertyDetail> = {
  'maple-ridge': {
    id: 'maple-ridge',
    name: 'Maple Ridge Apartments',
    address: '124 Maple Ridge Dr, Portsmouth, NH 03801',
    totalUnits: 48,
    occupancyRate: 93.8,
    avgRentPerSqft: 2.15,
    maintCostPerUnit: 1_062_50,
    avgDaysToFill: 18,
    openWOs: 3,
    avgResolutionHours: 36,
    maintByCategory: [
      { label: 'Plumbing', cents: 850_000 },
      { label: 'HVAC', cents: 620_000 },
      { label: 'Electrical', cents: 280_000 },
      { label: 'General', cents: 125_000 },
    ],
    units: [
      { id: 'u1', number: '101', tenant: 'Sarah Mitchell', rentCents: 1_450_00, status: 'occupied' },
      { id: 'u2', number: '102', tenant: 'Tom Anderson', rentCents: 1_525_00, status: 'occupied' },
      { id: 'u3', number: '103', tenant: null, rentCents: 1_400_00, status: 'vacant' },
      { id: 'u4', number: '201', tenant: 'Lisa Martinez', rentCents: 1_650_00, status: 'occupied' },
      { id: 'u5', number: '202', tenant: 'John Davidson', rentCents: 1_500_00, status: 'notice' },
      { id: 'u6', number: '203', tenant: 'Rachel Kim', rentCents: 1_475_00, status: 'occupied' },
      { id: 'u7', number: '301', tenant: 'Mike Chen', rentCents: 1_600_00, status: 'occupied' },
      { id: 'u8', number: '305', tenant: null, rentCents: 1_650_00, status: 'vacant' },
    ],
    recentWOs: [
      { id: 'wo1', unit: '305', description: 'Kitchen remodel for new tenant', status: 'in-progress', priority: 'high', date: 'Apr 20' },
      { id: 'wo2', unit: '201', description: 'Leaking faucet in bathroom', status: 'open', priority: 'normal', date: 'Apr 22' },
      { id: 'wo3', unit: '102', description: 'HVAC filter replacement', status: 'completed', priority: 'low', date: 'Apr 18' },
    ],
  },
  '220-main': {
    id: '220-main',
    name: '220 Main Street',
    address: '220 Main St, Austin, TX 78701',
    totalUnits: 15,
    occupancyRate: 86.7,
    avgRentPerSqft: 2.45,
    maintCostPerUnit: 1_213_00,
    avgDaysToFill: 24,
    openWOs: 5,
    avgResolutionHours: 48,
    maintByCategory: [
      { label: 'Plumbing', cents: 420_000 },
      { label: 'Electrical', cents: 380_000 },
      { label: 'Exterior', cents: 850_000 },
      { label: 'General', cents: 170_000 },
    ],
    units: [
      { id: 'u1', number: '1A', tenant: 'Main Street Coffee', rentCents: 2_800_00, status: 'occupied' },
      { id: 'u2', number: '1B', tenant: null, rentCents: 2_200_00, status: 'vacant' },
      { id: 'u3', number: '2A', tenant: 'James Wilson', rentCents: 1_400_00, status: 'occupied' },
      { id: 'u4', number: '2B', tenant: 'Diana Brooks', rentCents: 1_350_00, status: 'notice' },
    ],
    recentWOs: [
      { id: 'wo1', unit: 'Exterior', description: 'Parking lot reseal', status: 'in-progress', priority: 'high', date: 'Apr 15' },
      { id: 'wo2', unit: '1B', description: 'Prep vacant unit for listing', status: 'open', priority: 'urgent', date: 'Apr 21' },
      { id: 'wo3', unit: '2A', description: 'Window caulking repair', status: 'open', priority: 'normal', date: 'Apr 19' },
    ],
  },
  'harbor-view': {
    id: 'harbor-view',
    name: 'Harbor View Condos',
    address: '55 Harbor Rd, Denver, CO 80202',
    totalUnits: 24,
    occupancyRate: 95.8,
    avgRentPerSqft: 1.95,
    maintCostPerUnit: 750_00,
    avgDaysToFill: 12,
    openWOs: 1,
    avgResolutionHours: 24,
    maintByCategory: [
      { label: 'Plumbing', cents: 320_000 },
      { label: 'HVAC', cents: 180_000 },
      { label: 'Landscaping', cents: 280_000 },
    ],
    units: [
      { id: 'u1', number: 'A1', tenant: 'Carlos Rivera', rentCents: 1_800_00, status: 'occupied' },
      { id: 'u2', number: 'A2', tenant: 'Amy Foster', rentCents: 1_750_00, status: 'occupied' },
      { id: 'u3', number: 'B1', tenant: null, rentCents: 1_900_00, status: 'vacant' },
    ],
    recentWOs: [
      { id: 'wo1', unit: 'Common', description: 'Pool filter maintenance', status: 'open', priority: 'normal', date: 'Apr 22' },
    ],
  },
  'student-housing': {
    id: 'student-housing',
    name: 'College Park Housing',
    address: '89 College Rd, Atlanta, GA 30332',
    totalUnits: 36,
    occupancyRate: 88.9,
    avgRentPerSqft: 1.55,
    maintCostPerUnit: 316_67,
    avgDaysToFill: 8,
    openWOs: 7,
    avgResolutionHours: 18,
    maintByCategory: [
      { label: 'Plumbing', cents: 280_000 },
      { label: 'General', cents: 450_000 },
      { label: 'Appliances', cents: 410_000 },
    ],
    units: [
      { id: 'u1', number: '1', tenant: 'Jake Williams', rentCents: 1_100_00, status: 'occupied' },
      { id: 'u2', number: '5', tenant: null, rentCents: 950_00, status: 'vacant' },
      { id: 'u3', number: '12', tenant: 'Emma Lopez', rentCents: 1_050_00, status: 'occupied' },
      { id: 'u4', number: '18', tenant: null, rentCents: 1_100_00, status: 'vacant' },
    ],
    recentWOs: [
      { id: 'wo1', unit: '5', description: 'In-unit washer/dryer install', status: 'in-progress', priority: 'high', date: 'Apr 20' },
      { id: 'wo2', unit: '12', description: 'Broken window latch', status: 'open', priority: 'normal', date: 'Apr 22' },
      { id: 'wo3', unit: '18', description: 'Paint and clean for turnover', status: 'open', priority: 'urgent', date: 'Apr 21' },
    ],
  },
};

const STATUS_BADGE: Record<Unit['status'], { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  occupied: { label: 'Occupied', variant: 'success' },
  vacant: { label: 'Vacant', variant: 'danger' },
  notice: { label: 'Notice', variant: 'warning' },
};

const WO_STATUS_BADGE: Record<WorkOrder['status'], { label: string; variant: 'success' | 'warning' | 'primary' }> = {
  open: { label: 'Open', variant: 'warning' },
  'in-progress': { label: 'In Progress', variant: 'primary' },
  completed: { label: 'Completed', variant: 'success' },
};

const PRIORITY_COLORS: Record<WorkOrder['priority'], string> = {
  urgent: colors.danger,
  high: colors.accent,
  normal: colors.primary,
  low: colors.textMuted,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PropertyDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const property = PROPERTIES_MAP[id ?? ''] ?? PROPERTIES_MAP['maple-ridge'];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{property.name}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{property.address}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* KPIs */}
        <View style={styles.kpiGrid}>
          <Card style={styles.kpiCard} variant="elevated">
            <Text style={[styles.kpiValue, { color: colors.success }]}>{property.occupancyRate}%</Text>
            <Text style={styles.kpiLabel}>Occupancy</Text>
          </Card>
          <Card style={styles.kpiCard} variant="elevated">
            <Text style={styles.kpiValue}>${property.avgRentPerSqft.toFixed(2)}</Text>
            <Text style={styles.kpiLabel}>Avg Rent/SqFt</Text>
          </Card>
          <Card style={styles.kpiCard} variant="elevated">
            <Text style={styles.kpiValue}>{formatCents(property.maintCostPerUnit)}</Text>
            <Text style={styles.kpiLabel}>Maint/Unit</Text>
          </Card>
          <Card style={styles.kpiCard} variant="elevated">
            <Text style={styles.kpiValue}>{property.avgDaysToFill}d</Text>
            <Text style={styles.kpiLabel}>Time to Fill</Text>
          </Card>
        </View>

        {/* Maintenance Metrics */}
        <Card style={styles.sectionCard} variant="elevated">
          <Text style={styles.sectionTitle}>Maintenance Metrics</Text>
          <View style={styles.maintRow}>
            <View style={styles.maintStat}>
              <Text style={[styles.maintStatValue, property.openWOs > 3 && { color: colors.danger }]}>
                {property.openWOs}
              </Text>
              <Text style={styles.maintStatLabel}>Open Work Orders</Text>
            </View>
            <View style={styles.maintStat}>
              <Text style={styles.maintStatValue}>{property.avgResolutionHours}h</Text>
              <Text style={styles.maintStatLabel}>Avg Resolution</Text>
            </View>
          </View>
          <Text style={[styles.subsectionTitle, { marginTop: spacing.md }]}>Spend by Category</Text>
          {property.maintByCategory.map((cat) => {
            const maxCat = Math.max(...property.maintByCategory.map((c) => c.cents));
            const pct = (cat.cents / maxCat) * 100;
            return (
              <View key={cat.label} style={styles.catRow}>
                <Text style={styles.catLabel}>{cat.label}</Text>
                <View style={styles.catBarTrack}>
                  <View style={[styles.catBarFill, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.catAmount}>{formatDollars(cat.cents)}</Text>
              </View>
            );
          })}
        </Card>

        {/* Unit Directory */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Unit Directory</Text>
        </View>

        {property.units.map((unit) => {
          const badge = STATUS_BADGE[unit.status];
          return (
            <Card key={unit.id} style={styles.unitCard} variant="elevated">
              <View style={styles.unitRow}>
                <View style={styles.unitNumber}>
                  <Text style={styles.unitNumberText}>{unit.number}</Text>
                </View>
                <View style={styles.unitContent}>
                  <Text style={styles.unitTenant}>
                    {unit.tenant ?? 'Vacant'}
                  </Text>
                  <Text style={styles.unitRent}>{formatCents(unit.rentCents)}/mo</Text>
                </View>
                <Badge label={badge.label} variant={badge.variant} />
              </View>
            </Card>
          );
        })}

        {/* Recent Work Orders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Work Orders</Text>
        </View>

        {property.recentWOs.map((wo) => {
          const statusBadge = WO_STATUS_BADGE[wo.status];
          return (
            <Card key={wo.id} style={styles.woCard} variant="elevated">
              <View style={styles.woRow}>
                <View style={[styles.woPriorityDot, { backgroundColor: PRIORITY_COLORS[wo.priority] }]} />
                <View style={styles.woContent}>
                  <Text style={styles.woDesc} numberOfLines={1}>{wo.description}</Text>
                  <Text style={styles.woMeta}>Unit {wo.unit} {'\u00B7'} {wo.date}</Text>
                </View>
                <Badge label={statusBadge.label} variant={statusBadge.variant} />
              </View>
            </Card>
          );
        })}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  scrollContent: {
    paddingVertical: spacing.lg,
    paddingBottom: 100,
  },

  // KPIs
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  kpiCard: {
    width: '48%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  kpiLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Maintenance
  sectionCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  subsectionTitle: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  maintRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.md,
  },
  maintStat: {
    alignItems: 'center',
  },
  maintStatValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  maintStatLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  catLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 70,
  },
  catBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  catBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  catAmount: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
    width: 60,
    textAlign: 'right',
  },

  // Units
  unitCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitNumber: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  unitNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  unitContent: {
    flex: 1,
  },
  unitTenant: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  unitRent: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },

  // Work Orders
  woCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  woRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  woPriorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  woContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  woDesc: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  woMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
});

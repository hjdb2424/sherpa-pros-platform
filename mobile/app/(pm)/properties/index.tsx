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
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
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

function hashColor(name: string): string[] {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hue = hash % 360;
  return [`hsl(${hue}, 55%, 45%)`, `hsl(${(hue + 40) % 360}, 50%, 55%)`];
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

interface Property {
  id: string;
  name: string;
  address: string;
  occupiedUnits: number;
  totalUnits: number;
  monthlyNOICents: number;
  openWorkOrders: number;
  lastInspection: string;
}

const PROPERTIES: Property[] = [
  {
    id: 'maple-ridge',
    name: 'Maple Ridge Apartments',
    address: '124 Maple Ridge Dr, Portsmouth, NH 03801',
    occupiedUnits: 45,
    totalUnits: 48,
    monthlyNOICents: 1_960_000,
    openWorkOrders: 3,
    lastInspection: 'Apr 10, 2026',
  },
  {
    id: '220-main',
    name: '220 Main Street',
    address: '220 Main St, Austin, TX 78701',
    occupiedUnits: 13,
    totalUnits: 15,
    monthlyNOICents: 280_000,
    openWorkOrders: 5,
    lastInspection: 'Mar 28, 2026',
  },
  {
    id: 'harbor-view',
    name: 'Harbor View Condos',
    address: '55 Harbor Rd, Denver, CO 80202',
    occupiedUnits: 23,
    totalUnits: 24,
    monthlyNOICents: 920_000,
    openWorkOrders: 1,
    lastInspection: 'Apr 15, 2026',
  },
  {
    id: 'student-housing',
    name: 'College Park Housing',
    address: '89 College Rd, Atlanta, GA 30332',
    occupiedUnits: 32,
    totalUnits: 36,
    monthlyNOICents: 480_000,
    openWorkOrders: 7,
    lastInspection: 'Feb 20, 2026',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PropertiesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Properties</Text>
        <Text style={styles.headerSubtitle}>{PROPERTIES.length} properties in portfolio</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {PROPERTIES.map((property) => {
          const occupancyPct = (property.occupiedUnits / property.totalUnits) * 100;
          const [colorA, colorB] = hashColor(property.name);

          return (
            <Pressable
              key={property.id}
              style={({ pressed }) => [styles.propertyCard, pressed && styles.pressed]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push({ pathname: '/(pm)/properties/[id]', params: { id: property.id } });
              }}
            >
              {/* Photo placeholder gradient */}
              <View style={[styles.photoPlaceholder, { backgroundColor: colorA }]}>
                <View style={[styles.photoGradient, { backgroundColor: colorB }]} />
                <Ionicons name="business" size={28} color="rgba(255,255,255,0.6)" style={styles.photoIcon} />
              </View>

              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.propertyName} numberOfLines={1}>{property.name}</Text>
                    <Text style={styles.propertyAddress} numberOfLines={1}>{property.address}</Text>
                  </View>
                  {property.openWorkOrders > 0 && (
                    <View style={styles.woBadge}>
                      <Text style={styles.woBadgeText}>{property.openWorkOrders}</Text>
                    </View>
                  )}
                </View>

                {/* Occupancy bar */}
                <View style={styles.occupancyRow}>
                  <Text style={styles.occupancyLabel}>
                    {property.occupiedUnits}/{property.totalUnits} units
                  </Text>
                  <View style={styles.occupancyBar}>
                    <View
                      style={[
                        styles.occupancyFill,
                        {
                          width: `${occupancyPct}%`,
                          backgroundColor: occupancyPct > 90 ? colors.success : occupancyPct > 75 ? colors.warning : colors.danger,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.occupancyPct}>{occupancyPct.toFixed(0)}%</Text>
                </View>

                <View style={styles.cardBottomRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statItemLabel}>Monthly NOI</Text>
                    <Text style={[styles.statItemValue, { color: colors.success }]}>
                      {formatDollars(property.monthlyNOICents)}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statItemLabel}>Work Orders</Text>
                    <Text style={[styles.statItemValue, property.openWorkOrders > 3 && { color: colors.danger }]}>
                      {property.openWorkOrders} open
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statItemLabel}>Last Inspection</Text>
                    <Text style={styles.statItemValue}>{property.lastInspection}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
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
    paddingVertical: spacing.lg,
    paddingBottom: 100,
  },
  propertyCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.md,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },

  // Photo placeholder
  photoPlaceholder: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  photoGradient: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    opacity: 0.6,
  },
  photoIcon: {
    position: 'absolute',
  },

  // Card body
  cardBody: {
    padding: spacing.lg,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  propertyName: {
    ...typography.subheading,
    color: colors.text,
  },
  propertyAddress: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  woBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: spacing.sm,
  },
  woBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Occupancy
  occupancyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  occupancyLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 70,
  },
  occupancyBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  occupancyFill: {
    height: 6,
    borderRadius: 3,
  },
  occupancyPct: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
    width: 32,
    textAlign: 'right',
  },

  // Bottom stats
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statItemLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statItemValue: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
});

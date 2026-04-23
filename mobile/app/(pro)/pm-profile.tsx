import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Share,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Avatar from '@/components/common/Avatar';
import Logo from '@/components/brand/Logo';

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const PM_COMPANY = {
  name: 'Seacoast Property Management LLC',
  initials: 'SP',
  tagline: 'Managing 123 units across Greater Portsmouth since 2019',
  location: 'Portsmouth, NH',
  phone: '(603) 555-0190',
  email: 'info@seacoastpm.com',
};

const STATS = [
  { label: 'Properties', value: '4' },
  { label: 'Units', value: '123' },
  { label: 'Occupancy', value: '91.1%' },
  { label: 'Rating', value: '4.6' },
];

const PROPERTIES = [
  { id: 'maple-ridge', name: 'Maple Ridge Apartments', type: 'Multi-Family', units: 48, occupancy: 94, avgRent: 1850 },
  { id: '220-main', name: '220 Main St Mixed-Use', type: 'Mixed-Use', units: 15, occupancy: 87, avgRent: 2100 },
  { id: 'harbor-view', name: 'Harbor View Condos', type: 'Condo', units: 24, occupancy: 100, avgRent: 2450 },
  { id: 'elm-street', name: 'Elm Street Student Housing', type: 'Student Housing', units: 36, occupancy: 92, avgRent: 1200 },
];

const RECENT_ACTIVITY = [
  { id: 'a1', icon: 'construct-outline' as const, text: 'WO-101: Leaking faucet dispatched', time: '2h ago', color: colors.warning },
  { id: 'a2', icon: 'checkmark-circle-outline' as const, text: 'WO-080: Paint unit turnover completed', time: '5h ago', color: colors.success },
  { id: 'a3', icon: 'person-add-outline' as const, text: 'New lease signed: Unit 305', time: '1d ago', color: colors.primary },
  { id: 'a4', icon: 'alert-circle-outline' as const, text: 'Compliance: Boiler inspection due 5/12', time: '2d ago', color: colors.danger },
  { id: 'a5', icon: 'cash-outline' as const, text: 'Rent collected: $18,650 for April', time: '3d ago', color: colors.success },
];

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.statCard}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function PropertyRow({
  property,
  onPress,
}: {
  property: (typeof PROPERTIES)[0];
  onPress: () => void;
}) {
  const occupancyColor =
    property.occupancy >= 95
      ? colors.success
      : property.occupancy >= 90
        ? colors.primary
        : colors.warning;

  return (
    <Pressable
      style={s.propertyRow}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View style={s.propertyIcon}>
        <Ionicons name="business-outline" size={20} color={colors.primary} />
      </View>
      <View style={s.propertyInfo}>
        <Text style={s.propertyName}>{property.name}</Text>
        <Text style={s.propertyMeta}>
          {property.type} &middot; {property.units} units &middot; ${property.avgRent.toLocaleString()}/mo avg
        </Text>
      </View>
      <View style={s.propertyOccupancy}>
        <Text style={[s.occupancyText, { color: occupancyColor }]}>{property.occupancy}%</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

function ActivityRow({ item }: { item: (typeof RECENT_ACTIVITY)[0] }) {
  return (
    <View style={s.activityRow}>
      <View style={[s.activityDot, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={16} color={item.color} />
      </View>
      <View style={s.activityContent}>
        <Text style={s.activityText}>{item.text}</Text>
        <Text style={s.activityTime}>{item.time}</Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Main Screen                                                         */
/* ------------------------------------------------------------------ */

export default function PMProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleShareProfile = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Share.share({
      message: `Check out ${PM_COMPANY.name} on Sherpa Pros! https://thesherpapros.com/profile/seacoast-pm`,
    });
  }, []);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      {/* Header bar */}
      <View style={s.headerBar}>
        <Text style={s.headerTitle}>Company Profile</Text>
        <Pressable
          onPress={handleShareProfile}
          style={s.shareButton}
        >
          <Ionicons name="share-outline" size={18} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Company Info Header                                              */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.companyHeader}>
          <View style={s.avatarRing}>
            <Avatar initials={PM_COMPANY.initials} size={72} color={colors.primary} />
          </View>
          <Text style={s.companyName}>{PM_COMPANY.name}</Text>
          <Text style={s.companyTagline}>{PM_COMPANY.tagline}</Text>
          <View style={s.locationRow}>
            <Ionicons name="location-sharp" size={14} color={colors.textMuted} />
            <Text style={s.locationText}>{PM_COMPANY.location}</Text>
          </View>
          <View style={s.contactRow}>
            <Pressable
              style={s.contactPill}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Linking.openURL(`tel:${PM_COMPANY.phone}`);
              }}
            >
              <Ionicons name="call-outline" size={14} color={colors.primary} />
              <Text style={s.contactPillText}>Call</Text>
            </Pressable>
            <Pressable
              style={s.contactPill}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Linking.openURL(`mailto:${PM_COMPANY.email}`);
              }}
            >
              <Ionicons name="mail-outline" size={14} color={colors.primary} />
              <Text style={s.contactPillText}>Email</Text>
            </Pressable>
          </View>
          {/* Verified badges */}
          <View style={s.badgesRow}>
            {['Licensed PM', 'Insured', 'BBB A+'].map((badge) => (
              <View key={badge} style={s.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                <Text style={s.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Portfolio Stats                                                  */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.statsRow}>
          {STATS.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Properties List                                                  */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.sectionCard}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Properties</Text>
            <Text style={s.sectionCount}>{PROPERTIES.length}</Text>
          </View>
          {PROPERTIES.map((property, idx) => (
            <View key={property.id}>
              <PropertyRow
                property={property}
                onPress={() => {
                  // In production, this would navigate to property detail
                  // For now, just haptic feedback
                }}
              />
              {idx < PROPERTIES.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Recent Activity                                                  */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.sectionCard}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Recent Activity</Text>
          </View>
          {RECENT_ACTIVITY.map((item, idx) => (
            <View key={item.id}>
              <ActivityRow item={item} />
              {idx < RECENT_ACTIVITY.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Quick Actions                                                    */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.quickActionsRow}>
          <Pressable
            style={s.quickAction}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            <Text style={s.quickActionText}>Add Property</Text>
          </Pressable>
          <Pressable
            style={s.quickAction}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Ionicons name="bar-chart-outline" size={24} color={colors.primary} />
            <Text style={s.quickActionText}>View Financials</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Logo size="sm" />
          <Text style={s.footerText}>Read-only mobile view</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Company Header -------------------------------------------------------
  companyHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  companyName: {
    marginTop: spacing.md,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  companyTagline: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  locationText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  contactRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  contactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  contactPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.successLight,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.success,
  },

  // Stats ----------------------------------------------------------------
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },

  // Section card ---------------------------------------------------------
  sectionCard: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },

  // Property rows --------------------------------------------------------
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  propertyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  propertyMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  propertyOccupancy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  occupancyText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Activity rows --------------------------------------------------------
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  activityDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },

  // Quick Actions --------------------------------------------------------
  quickActionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.sm,
  },

  // Footer ---------------------------------------------------------------
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  footerText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});

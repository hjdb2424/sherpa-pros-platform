import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Modal, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/components/brand/Logo';
import MapScreen from '@/components/maps/MapScreen';
import { Circle } from 'react-native-maps';
import ProMarker from '@/components/maps/ProMarker';
import ProSheet from '@/components/sheets/ProSheet';
import type { SimpleBottomSheetRef } from '@/components/sheets/SimpleBottomSheet';
import { MOCK_PROS, SERVICE_AREA, type MockProLocation } from '@/lib/types';
import { getCurrentLocation } from '@/lib/location';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';

// Generate pros near a given location
function generateNearbyPros(centerLat: number, centerLng: number): MockProLocation[] {
  const placements = [
    { dLat: 0.003, dLng: -0.002, dist: '0.3 mi' },
    { dLat: -0.012, dLng: 0.008, dist: '1.2 mi' },
    { dLat: 0.025, dLng: -0.020, dist: '2.8 mi' },
    { dLat: 0.120, dLng: -0.100, dist: '9.2 mi' },
    { dLat: 0.015, dLng: 0.030, dist: '2.5 mi' },
    { dLat: -0.260, dLng: -0.110, dist: '18.4 mi' },
    { dLat: -0.080, dLng: -0.690, dist: '38.1 mi' },
    { dLat: -0.180, dLng: -0.400, dist: '25.3 mi' },
    { dLat: 0.230, dLng: -0.050, dist: '16.1 mi' },
    { dLat: 0.310, dLng: 0.120, dist: '22.4 mi' },
    { dLat: -0.140, dLng: -0.170, dist: '14.7 mi' },
    { dLat: 0.580, dLng: 0.500, dist: '42.8 mi' },
  ];
  return MOCK_PROS.map((pro, i) => ({
    ...pro,
    lat: centerLat + (placements[i]?.dLat ?? 0),
    lng: centerLng + (placements[i]?.dLng ?? 0),
    distance: placements[i]?.dist ?? pro.distance,
  }));
}

// ---------------------------------------------------------------------------
// Filter pills
// ---------------------------------------------------------------------------

const TRADE_FILTERS = ['All', 'Plumber', 'Electrician', 'HVAC', 'General', 'Painter'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProsMapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const sheetRef = useRef<SimpleBottomSheetRef>(null);
  const [userRegion, setUserRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | undefined>(undefined);
  const [locationDenied, setLocationDenied] = useState(false);
  const [nearbyPros, setNearbyPros] = useState(MOCK_PROS);

  useEffect(() => {
    getCurrentLocation().then((loc) => {
      if (loc) {
        setUserRegion({
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        });
        setNearbyPros(generateNearbyPros(loc.lat, loc.lng));
      } else {
        setLocationDenied(true);
      }
    });
  }, []);

  const filteredPros = activeFilter === 'All'
    ? nearbyPros
    : nearbyPros.filter((p) => p.trade.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {locationDenied && (
        <View style={styles.locationBanner}>
          <Text style={styles.locationBannerText}>Enable location for better results</Text>
        </View>
      )}

      <MapScreen initialRegion={userRegion}>
        <Circle
          center={{ latitude: SERVICE_AREA.center.lat, longitude: SERVICE_AREA.center.lng }}
          radius={72400}
          fillColor="rgba(0, 169, 224, 0.05)"
          strokeColor="rgba(0, 169, 224, 0.2)"
          strokeWidth={1}
        />
        {filteredPros.map((pro) => (
          <ProMarker
            key={pro.id}
            pro={pro}
            onPress={() => {
              setSelectedProId(pro.id);
              sheetRef.current?.snapTo('half');
            }}
          />
        ))}
      </MapScreen>

      {/* Header overlay */}
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <Logo size="sm" />
        <Text style={styles.topTitle}>Find Pros</Text>
      </View>

      {/* Filter pills */}
      <View style={[styles.filterRow, { top: insets.top + 48 }]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TRADE_FILTERS}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
          renderItem={({ item }) => {
            const active = item === activeFilter;
            return (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveFilter(item);
                }}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <ProSheet
        ref={sheetRef}
        pros={filteredPros}
        selectedId={selectedProId}
        onProSelect={(pro) => {
          setSelectedProId(pro.id);
          sheetRef.current?.snapTo('half');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  topBar: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  topTitle: {
    ...typography.heading,
    color: colors.text,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },

  filterRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  filterPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: '#ffffff',
    ...shadows.sm,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterPillText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.textInverse,
  },

  locationBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: colors.warningLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  locationBannerText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
  },
});

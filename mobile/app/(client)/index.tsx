import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '@/components/maps/MapScreen';
import { Circle } from 'react-native-maps';
import ProMarker from '@/components/maps/ProMarker';
import ProSheet from '@/components/sheets/ProSheet';
import type { SimpleBottomSheetRef } from '@/components/sheets/SimpleBottomSheet';
import { MOCK_PROS, SERVICE_AREA, type MockProLocation } from '@/lib/types';
import { getCurrentLocation } from '@/lib/location';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Logo from '@/components/brand/Logo';
import { scheduleLocalNotification } from '@/lib/notifications';

// Generate pros near a given location by offsetting from that center
function generateNearbyPros(centerLat: number, centerLng: number): MockProLocation[] {
  const offsets = [
    { dLat: 0.005, dLng: -0.003 }, // 0.3 mi
    { dLat: -0.008, dLng: 0.006 },  // 0.8 mi
    { dLat: 0.012, dLng: 0.010 },   // 1.2 mi
    { dLat: -0.015, dLng: -0.012 }, // 1.5 mi
    { dLat: 0.020, dLng: 0.018 },   // 2.1 mi
    { dLat: -0.025, dLng: -0.020 }, // 2.8 mi
    { dLat: 0.030, dLng: -0.025 },  // 3.4 mi
    { dLat: -0.035, dLng: 0.030 },  // 3.9 mi
    { dLat: 0.045, dLng: 0.040 },   // 5.2 mi
    { dLat: -0.060, dLng: -0.050 }, // 7.1 mi
    { dLat: 0.080, dLng: 0.060 },   // 9.0 mi
    { dLat: -0.100, dLng: -0.080 }, // 12.5 mi
  ];
  return MOCK_PROS.map((pro, i) => ({
    ...pro,
    lat: centerLat + (offsets[i]?.dLat ?? 0),
    lng: centerLng + (offsets[i]?.dLng ?? 0),
    distance: ['0.3 mi', '0.8 mi', '1.2 mi', '1.5 mi', '2.1 mi', '2.8 mi', '3.4 mi', '3.9 mi', '5.2 mi', '7.1 mi', '9.0 mi', '12.5 mi'][i] ?? pro.distance,
  }));
}

function NotificationBell() {
  const router = useRouter();
  return (
    <Pressable
      style={styles.bellButton}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/notifications');
      }}
    >
      <Ionicons name="notifications-outline" size={22} color={colors.text} />
      <View style={styles.bellDot} />
    </Pressable>
  );
}

export default function ClientMapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
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

  // Demo notification after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      scheduleLocalNotification(
        'Bid Received!',
        'Mike Rodriguez bid $450 on your Kitchen Faucet job.',
        { type: 'bid_accepted', jobId: '4' }
      );
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {locationDenied && (
        <View style={styles.locationBanner}>
          <Text style={styles.locationBannerText}>
            Enable location for better results
          </Text>
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
        {nearbyPros.map((pro) => (
          <ProMarker
            key={pro.id}
            pro={pro}
            onPress={() => { setSelectedProId(pro.id); sheetRef.current?.snapTo('half'); }}
          />
        ))}
      </MapScreen>

      {/* Logo + Search bar */}
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <View style={styles.logoContainer}>
          <Logo size="sm" />
        </View>
        <Pressable
          style={styles.searchBar}
          onPress={() => Alert.alert('Search coming soon')}
        >
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search for a pro or service...</Text>
        </Pressable>
      </View>

      {/* Notification bell */}
      <View style={[styles.bellWrapper, { top: insets.top + 12 }]}>
        <NotificationBell />
      </View>

      <ProSheet
        ref={sheetRef}
        pros={nearbyPros}
        selectedId={selectedProId}
        onProSelect={(pro) => { setSelectedProId(pro.id); sheetRef.current?.snapTo('half'); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Top bar with logo + search
  topBar: {
    position: 'absolute',
    left: 16,
    right: 72,
    zIndex: 10,
    gap: 8,
  },
  logoContainer: {
    marginBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...shadows.md,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: colors.textMuted,
    flex: 1,
  },

  // Bell
  bellWrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  bellIcon: {
    fontSize: 20,
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },

  // Location banner
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

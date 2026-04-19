import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '@/components/maps/MapScreen';
import ProMarker from '@/components/maps/ProMarker';
import ProSheet from '@/components/sheets/ProSheet';
import type { SimpleBottomSheetRef } from '@/components/sheets/SimpleBottomSheet';
import { MOCK_PROS } from '@/lib/types';
import { getCurrentLocation } from '@/lib/location';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Logo from '@/components/brand/Logo';
import { scheduleLocalNotification } from '@/lib/notifications';

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

  useEffect(() => {
    getCurrentLocation().then((loc) => {
      if (loc) {
        setUserRegion({
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        });
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
        {MOCK_PROS.map((pro) => (
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
        pros={MOCK_PROS}
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

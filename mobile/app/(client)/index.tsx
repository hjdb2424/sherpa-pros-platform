import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import MapScreen from '@/components/maps/MapScreen';
import ProMarker from '@/components/maps/ProMarker';
import ProSheet from '@/components/sheets/ProSheet';
import { MOCK_PROS } from '@/lib/types';
import { getCurrentLocation } from '@/lib/location';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';

function EmergencyFAB() {
  const router = useRouter();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.15,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  return (
    <Animated.View style={[styles.fabWrapper, { transform: [{ scale: pulse }] }]}>
      <Pressable
        style={styles.emergencyFab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          router.push('/(emergency)');
        }}
      >
        <Text style={styles.emergencyFabIcon}>{'\u26A1'}</Text>
      </Pressable>
    </Animated.View>
  );
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
      <Text style={styles.bellIcon}>{'\u{1F514}'}</Text>
      <View style={styles.bellDot} />
    </Pressable>
  );
}

export default function ClientMapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
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
            onPress={() => setSelectedProId(pro.id)}
          />
        ))}
      </MapScreen>

      {/* Notification bell */}
      <View style={[styles.bellWrapper, { top: insets.top + 12 }]}>
        <NotificationBell />
      </View>

      {/* Emergency FAB */}
      <EmergencyFAB />

      <ProSheet
        pros={MOCK_PROS}
        selectedId={selectedProId}
        onProSelect={(pro) => setSelectedProId(pro.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

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

  // Emergency FAB
  fabWrapper: {
    position: 'absolute',
    bottom: 160,
    right: 16,
    zIndex: 10,
  },
  emergencyFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  emergencyFabIcon: {
    fontSize: 24,
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

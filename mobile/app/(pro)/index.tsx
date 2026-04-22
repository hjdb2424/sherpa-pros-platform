import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '@/components/maps/MapScreen';
import { Circle } from 'react-native-maps';
import JobMarker from '@/components/maps/JobMarker';
import JobSheet from '@/components/sheets/JobSheet';
import type { SimpleBottomSheetRef } from '@/components/sheets/SimpleBottomSheet';
import { MOCK_JOBS, SERVICE_AREA, type MockJobLocation } from '@/lib/types';
import { getCurrentLocation } from '@/lib/location';

function generateNearbyJobs(centerLat: number, centerLng: number): MockJobLocation[] {
  const offsets = [
    { dLat: 0.004, dLng: -0.002 },
    { dLat: -0.006, dLng: 0.005 },
    { dLat: 0.010, dLng: 0.008 },
    { dLat: -0.013, dLng: -0.010 },
    { dLat: 0.018, dLng: 0.015 },
    { dLat: -0.022, dLng: -0.018 },
    { dLat: 0.035, dLng: 0.025 },
    { dLat: -0.045, dLng: -0.035 },
    { dLat: 0.060, dLng: 0.050 },
    { dLat: -0.080, dLng: -0.060 },
  ];
  return MOCK_JOBS.map((job, i) => ({
    ...job,
    lat: centerLat + (offsets[i]?.dLat ?? 0),
    lng: centerLng + (offsets[i]?.dLng ?? 0),
    distance: ['0.3 mi', '0.5 mi', '0.9 mi', '1.4 mi', '1.8 mi', '2.5 mi', '3.8 mi', '5.1 mi', '7.2 mi', '9.8 mi'][i] ?? job.distance,
  }));
}
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Logo from '@/components/brand/Logo';
import { scheduleLocalNotification } from '@/lib/notifications';
import DispatchModal from '@/components/pro/DispatchModal';

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

export default function ProMapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showDispatch, setShowDispatch] = useState(false);
  const sheetRef = useRef<SimpleBottomSheetRef>(null);
  const [userRegion, setUserRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | undefined>(undefined);
  const [locationDenied, setLocationDenied] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const [nearbyJobs, setNearbyJobs] = useState(MOCK_JOBS);

  useEffect(() => {
    SecureStore.getItemAsync('sherpa_onboarding_complete').then((val) => {
      setOnboardingComplete(val === 'true');
    });
  }, []);

  useEffect(() => {
    getCurrentLocation().then((loc) => {
      if (loc) {
        setUserRegion({
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        });
        setNearbyJobs(generateNearbyJobs(loc.lat, loc.lng));
      } else {
        setLocationDenied(true);
      }
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowDispatch(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Demo notification after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      scheduleLocalNotification(
        'New Job Available!',
        'Emergency plumbing \u2014 Burst pipe, 0.8 mi away. $500-$1,500.',
        { type: 'new_job', jobId: 'a1' }
      );
    }, 10000);
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
      {!onboardingComplete && (
        <Pressable
          style={[styles.onboardingBanner, { top: insets.top + 66 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/pro-onboarding');
          }}
        >
          <Ionicons name="alert-circle" size={18} color={colors.primary} />
          <Text style={styles.onboardingBannerText}>
            Complete your profile to start receiving jobs
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </Pressable>
      )}
      <MapScreen initialRegion={userRegion}>
        <Circle
          center={{ latitude: SERVICE_AREA.center.lat, longitude: SERVICE_AREA.center.lng }}
          radius={72400}
          fillColor="rgba(0, 169, 224, 0.05)"
          strokeColor="rgba(0, 169, 224, 0.2)"
          strokeWidth={1}
        />
        {nearbyJobs.map((job) => (
          <JobMarker
            key={job.id}
            job={job}
            onPress={() => { setSelectedJobId(job.id); sheetRef.current?.snapTo('half'); }}
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
          <Text style={styles.searchPlaceholder}>Search for jobs near you...</Text>
        </Pressable>
      </View>

      {/* Notification bell */}
      <View style={[styles.bellWrapper, { top: insets.top + 12 }]}>
        <NotificationBell />
      </View>

      <DispatchModal
        visible={showDispatch}
        category="Plumbing"
        severity="High"
        distance="2.4 mi"
        estimatedPayout="$350"
        onAccept={() => {
          setShowDispatch(false);
        }}
        onDecline={() => {
          setShowDispatch(false);
        }}
      />

      <JobSheet
        ref={sheetRef}
        jobs={nearbyJobs}
        selectedId={selectedJobId}
        onJobSelect={(job) => { setSelectedJobId(job.id); sheetRef.current?.snapTo('half'); }}
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

  // Onboarding banner
  onboardingBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.md,
  },
  onboardingBannerText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },
});

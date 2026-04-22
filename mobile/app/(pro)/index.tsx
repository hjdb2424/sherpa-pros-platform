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
  // Spread across full 45-mile radius covering NH, ME, MA
  const placements = [
    { dLat: 0.005, dLng: -0.003, dist: '0.4 mi' },     // Very close
    { dLat: -0.008, dLng: 0.006, dist: '0.6 mi' },      // Nearby
    { dLat: 0.015, dLng: 0.012, dist: '1.1 mi' },       // Close
    { dLat: -0.020, dLng: -0.015, dist: '1.7 mi' },     // Close
    { dLat: 0.010, dLng: 0.008, dist: '0.9 mi' },       // Nearby
    { dLat: -0.030, dLng: -0.025, dist: '3.2 mi' },     // Moderate
    { dLat: 0.120, dLng: -0.095, dist: '9.0 mi' },      // Dover area
    { dLat: 0.018, dLng: 0.025, dist: '1.8 mi' },       // Kittery area
    { dLat: -0.260, dLng: -0.105, dist: '18.6 mi' },    // Newburyport area
    { dLat: -0.082, dLng: -0.695, dist: '38.3 mi' },    // Manchester area
  ];
  return MOCK_JOBS.map((job, i) => ({
    ...job,
    lat: centerLat + (placements[i]?.dLat ?? 0),
    lng: centerLng + (placements[i]?.dLng ?? 0),
    distance: placements[i]?.dist ?? job.distance,
  }));
}
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Logo from '@/components/brand/Logo';
import { scheduleLocalNotification } from '@/lib/notifications';
import DispatchModal from '@/components/pro/DispatchModal';
import { AddPhotoSheet } from '@/components/portfolio';

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
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);

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

      {/* Camera FAB for quick photo capture */}
      <Pressable
        style={styles.cameraFab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setPhotoSheetVisible(true);
        }}
      >
        <Ionicons name="camera" size={22} color={colors.primary} />
      </Pressable>

      <AddPhotoSheet
        visible={photoSheetVisible}
        onClose={() => setPhotoSheetVisible(false)}
        onPhotosSelected={(uris) => {
          // On the map screen, photos go to portfolio silently
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert(
            'Added to Portfolio',
            `${uris.length} photo${uris.length !== 1 ? 's' : ''} added to your portfolio.`,
          );
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

  // Camera FAB
  cameraFab: {
    position: 'absolute',
    left: 16,
    bottom: 180,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...shadows.md,
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

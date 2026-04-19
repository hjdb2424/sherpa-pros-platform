import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '@/components/maps/MapScreen';
import JobMarker from '@/components/maps/JobMarker';
import JobSheet from '@/components/sheets/JobSheet';
import type { SimpleBottomSheetRef } from '@/components/sheets/SimpleBottomSheet';
import { MOCK_JOBS } from '@/lib/types';
import { getCurrentLocation } from '@/lib/location';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
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

  useEffect(() => {
    const timer = setTimeout(() => setShowDispatch(true), 5000);
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
        {MOCK_JOBS.map((job) => (
          <JobMarker
            key={job.id}
            job={job}
            onPress={() => { setSelectedJobId(job.id); sheetRef.current?.snapTo('half'); }}
          />
        ))}
      </MapScreen>

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
        jobs={MOCK_JOBS}
        selectedId={selectedJobId}
        onJobSelect={(job) => { setSelectedJobId(job.id); sheetRef.current?.snapTo('half'); }}
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

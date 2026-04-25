import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Modal, TextInput, FlatList, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';
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
import OnboardingWizardModal from '@/components/onboarding/OnboardingWizard';

// Generate pros near a given location by offsetting from that center
function generateNearbyPros(centerLat: number, centerLng: number): MockProLocation[] {
  // Spread across full 45-mile radius covering NH, ME, MA
  // Each offset roughly corresponds to a real town direction from center
  const placements = [
    { dLat: 0.003, dLng: -0.002, dist: '0.3 mi' },     // Very close
    { dLat: -0.012, dLng: 0.008, dist: '1.2 mi' },      // Nearby
    { dLat: 0.025, dLng: -0.020, dist: '2.8 mi' },      // Close
    { dLat: 0.120, dLng: -0.100, dist: '9.2 mi' },      // Dover direction (N)
    { dLat: 0.015, dLng: 0.030, dist: '2.5 mi' },       // Kittery direction (E)
    { dLat: -0.260, dLng: -0.110, dist: '18.4 mi' },    // Newburyport direction (S)
    { dLat: -0.080, dLng: -0.690, dist: '38.1 mi' },    // Manchester direction (W)
    { dLat: -0.180, dLng: -0.400, dist: '25.3 mi' },    // Derry direction (SW)
    { dLat: 0.230, dLng: -0.050, dist: '16.1 mi' },     // Rochester direction (N)
    { dLat: 0.310, dLng: 0.120, dist: '22.4 mi' },      // Kennebunk direction (NE)
    { dLat: -0.140, dLng: -0.170, dist: '14.7 mi' },    // Exeter direction (S)
    { dLat: 0.580, dLng: 0.500, dist: '42.8 mi' },      // Portland direction (NE far)
  ];
  return MOCK_PROS.map((pro, i) => ({
    ...pro,
    lat: centerLat + (placements[i]?.dLat ?? 0),
    lng: centerLng + (placements[i]?.dLng ?? 0),
    distance: placements[i]?.dist ?? pro.distance,
  }));
}

function NotificationBell() {
  const router = useRouter();
  return (
    <Pressable
      style={styles.bellButton}
      accessibilityLabel="Notifications"
      accessibilityRole="button"
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

function PostJobFAB() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.fabContainer, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
      <Pressable
        style={styles.fab}
        accessibilityLabel="What do you need done? Post a job"
        accessibilityRole="button"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/(client)/post-job');
        }}
      >
        <Ionicons name="construct-outline" size={20} color={colors.textInverse} />
        <Text style={styles.fabText}>What do you need done?</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function ClientMapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sheetRef = useRef<SimpleBottomSheetRef>(null);
  const [userRegion, setUserRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | undefined>(undefined);
  const [locationDenied, setLocationDenied] = useState(false);
  const [nearbyPros, setNearbyPros] = useState(MOCK_PROS);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('sherpa_onboarding_complete').catch(() => null).then((val) => {
      if (val !== 'true') setShowWizard(true);
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
      {showWizard && <OnboardingWizardModal role="client" onComplete={() => setShowWizard(false)} />}
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
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSearchVisible(true); setSearchQuery(''); }}
        >
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search for a pro or service...</Text>
        </Pressable>
      </View>

      {/* Notification bell */}
      <View style={[styles.bellWrapper, { top: insets.top + 12 }]}>
        <NotificationBell />
      </View>

      {/* Post a Job FAB — Uber-style floating action */}
      <PostJobFAB />

      <ProSheet
        ref={sheetRef}
        pros={nearbyPros}
        selectedId={selectedProId}
        onProSelect={(pro) => { setSelectedProId(pro.id); sheetRef.current?.snapTo('half'); }}
      />

      {/* Search Modal */}
      <Modal visible={searchVisible} animationType="slide" presentationStyle="fullScreen">
        <View style={[styles.searchModal, { paddingTop: insets.top }]}>
          <View style={styles.searchModalHeader}>
            <View style={styles.searchModalInputRow}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.searchModalInput}
                placeholder="Search pros or services..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
              />
            </View>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSearchVisible(false); }}
              hitSlop={12}
            >
              <Text style={styles.searchCancelText}>Cancel</Text>
            </Pressable>
          </View>
          <FlatList
            data={nearbyPros.filter((p) => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              return p.name.toLowerCase().includes(q) || p.trade.toLowerCase().includes(q);
            })}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.searchResultCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setSearchVisible(false);
                  setSelectedProId(item.id);
                  sheetRef.current?.snapTo('half');
                }}
              >
                <View style={styles.searchResultAvatar}>
                  <Text style={styles.searchResultInitials}>{item.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.searchResultName}>{item.name}</Text>
                  <Text style={styles.searchResultTrade}>{item.trade} {'\u00B7'} {item.distance}</Text>
                </View>
                <View style={styles.searchResultRating}>
                  <Ionicons name="star" size={12} color={colors.accent} />
                  <Text style={styles.searchResultRatingText}>{item.rating}</Text>
                </View>
              </Pressable>
            )}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingTop: 60 }}>
                <Ionicons name="search-outline" size={48} color={colors.borderMedium} />
                <Text style={{ ...typography.bodySmall, color: colors.textMuted, marginTop: spacing.md }}>No pros found</Text>
              </View>
            }
          />
        </View>
      </Modal>
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
    backgroundColor: colors.background,
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
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
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
    borderColor: colors.background,
  },

  // Post Job FAB
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    alignItems: 'center',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    ...shadows.primaryGlow,
  },
  fabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textInverse,
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

  // Search Modal
  searchModal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchModalInputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  searchModalInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  searchCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  searchResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
  },
  searchResultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  searchResultTrade: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  searchResultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  searchResultRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});

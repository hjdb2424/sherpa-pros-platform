import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  FadeInUp,
} from 'react-native-reanimated';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { MOCK_DISPATCH_ROUTE } from '@/lib/types';
import { colors, shadows, spacing, borderRadius, typography } from '@/lib/theme';
import Avatar from '@/components/common/Avatar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOTTOM_PANEL_HEIGHT = 280;

function PulsingAvatar() {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.8, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      true,
    );
    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      true,
    );
  }, [pulseScale, pulseOpacity]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={markerStyles.wrapper}>
      <Animated.View style={[markerStyles.ring, ringStyle]} />
      <View style={markerStyles.avatarOuter}>
        <Avatar initials="MR" size={36} color={colors.primary} />
      </View>
    </View>
  );
}

const markerStyles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', width: 60, height: 60 },
  ring: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarOuter: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffffff',
    overflow: 'hidden',
  },
});

function ClientDot() {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulseScale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={dotStyles.wrapper}>
      <Animated.View style={[dotStyles.ring, style]} />
      <View style={dotStyles.dot} />
    </View>
  );
}

const dotStyles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', width: 40, height: 40 },
  ring: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(249, 115, 22, 0.25)',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#f97316',
    borderWidth: 2,
    borderColor: '#dc2626',
  },
});

export default function TrackingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const { proStart, clientLocation, etaMinutes, distanceMiles } = MOCK_DISPATCH_ROUTE;

  const [eta, setEta] = useState(etaMinutes);
  const [proPosition, setProPosition] = useState(proStart);
  const [arrived, setArrived] = useState(false);

  const progress = Math.max(0, Math.min(1, 1 - eta / etaMinutes));

  // Simulated movement
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => {
        const next = prev - 0.5;
        if (next <= 0) {
          clearInterval(interval);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          setArrived(true);
          return 0;
        }
        return next;
      });

      setProPosition((prev) => {
        const t = 0.08; // lerp factor
        return {
          lat: prev.lat + (clientLocation.lat - prev.lat) * t,
          lng: prev.lng + (clientLocation.lng - prev.lng) * t,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [clientLocation]);

  const handleCancel = () => {
    Alert.alert('Cancel Dispatch', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => router.back(), style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Full-screen map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: (proStart.lat + clientLocation.lat) / 2,
          longitude: (proStart.lng + clientLocation.lng) / 2,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Pro marker */}
        <Marker
          coordinate={{ latitude: proPosition.lat, longitude: proPosition.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={true}
        >
          <PulsingAvatar />
        </Marker>

        {/* Client marker */}
        <Marker
          coordinate={{ latitude: clientLocation.lat, longitude: clientLocation.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={true}
        >
          <ClientDot />
        </Marker>
      </MapView>

      {/* Floating ETA pill */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(400)}
        style={[styles.etaPill, { top: insets.top + 16 }]}
      >
        <Text style={styles.etaNumber}>{Math.ceil(eta)}</Text>
        <Text style={styles.etaLabel}>MIN AWAY</Text>
      </Animated.View>

      {/* Arrived banner */}
      {arrived && (
        <Animated.View
          entering={FadeInUp.duration(400)}
          style={[styles.arrivedBanner, { top: insets.top + 80 }]}
        >
          <Text style={styles.arrivedText}>Pro has arrived!</Text>
        </Animated.View>
      )}

      {/* Bottom panel */}
      <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + 16 }]}>
        {/* ETA row */}
        <View style={styles.statusRow}>
          <View>
            <Text style={styles.statusEta}>
              {arrived ? 'Arrived' : `${Math.ceil(eta)} min`}
            </Text>
            <Text style={styles.statusDistance}>{distanceMiles} miles away</Text>
          </View>
          <View style={styles.enRouteBadge}>
            <Text style={styles.enRouteText}>
              {arrived ? 'ARRIVED' : 'EN ROUTE'}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        {/* Pro info */}
        <View style={styles.proRow}>
          <Avatar initials="MR" size={44} color={colors.primary} />
          <View style={styles.proInfo}>
            <Text style={styles.proName}>Mike Rodriguez</Text>
            <View style={styles.proMeta}>
              <Text style={styles.proRating}>{'\u2B50'} 4.9</Text>
              <Text style={styles.proDot}>{'\u00B7'}</Text>
              <Text style={styles.proTrade}>Plumber</Text>
            </View>
          </View>

          {/* Action buttons */}
          <Pressable
            style={styles.actionButton}
            onPress={() => Alert.alert('Calling...', 'Phone call feature coming soon.')}
          >
            <Text style={styles.actionIcon}>{'\u{1F4DE}'}</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.actionButtonGray]}
            onPress={() => Alert.alert('Messaging...', 'Chat feature coming soon.')}
          >
            <Text style={styles.actionIcon}>{'\u{1F4AC}'}</Text>
          </Pressable>
        </View>

        {/* Cancel link */}
        <Pressable style={styles.cancelLink} onPress={handleCancel}>
          <Text style={styles.cancelLinkText}>Cancel Dispatch</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ETA pill
  etaPill: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.full,
    paddingHorizontal: 24,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    ...shadows.lg,
  },
  etaNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  etaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#71717a',
    textTransform: 'uppercase',
  },

  // Arrived banner
  arrivedBanner: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: colors.success,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 24,
    paddingVertical: 12,
    ...shadows.lg,
  },
  arrivedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },

  // Bottom panel
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    ...shadows.lg,
  },

  // Status row
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusEta: {
    fontSize: 22,
    fontWeight: '700',
    color: '#18181b',
  },
  statusDistance: {
    fontSize: 14,
    color: '#71717a',
    marginTop: 2,
  },
  enRouteBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  enRouteText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
    textTransform: 'uppercase',
  },

  // Progress bar
  progressTrack: {
    height: 6,
    backgroundColor: '#f4f4f5',
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  // Pro row
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  proInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  proName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181b',
  },
  proMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  proRating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f97316',
  },
  proDot: {
    fontSize: 13,
    color: '#a1a1aa',
  },
  proTrade: {
    fontSize: 13,
    color: '#71717a',
  },

  // Action buttons
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  actionButtonGray: {
    backgroundColor: '#e4e4e7',
  },
  actionIcon: {
    fontSize: 18,
  },

  // Cancel
  cancelLink: {
    alignItems: 'center',
    paddingTop: 4,
  },
  cancelLinkText: {
    fontSize: 14,
    color: '#a1a1aa',
    fontWeight: '500',
  },
});

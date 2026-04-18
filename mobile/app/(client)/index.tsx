import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import MapScreen from '@/components/maps/MapScreen';
import ProMarker from '@/components/maps/ProMarker';
import ProSheet from '@/components/sheets/ProSheet';
import { MOCK_PROS } from '@/lib/types';
import { colors, shadows } from '@/lib/theme';

function EmergencyFAB() {
  const router = useRouter();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View style={[styles.fabWrapper, animatedStyle]}>
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapScreen>
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
});

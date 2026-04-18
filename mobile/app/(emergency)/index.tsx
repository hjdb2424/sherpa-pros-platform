import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
} from 'react-native-reanimated';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { DEFAULT_CENTER } from '@/lib/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ----- Step 1 categories -----
interface EmergencyCategory {
  id: string;
  icon: string;
  title: string;
}

const CATEGORIES: EmergencyCategory[] = [
  { id: 'water', icon: '\u{1F4A7}', title: 'Water Damage' },
  { id: 'fire', icon: '\u{1F525}', title: 'Fire / Smoke' },
  { id: 'storm', icon: '\u{26C8}\uFE0F', title: 'Storm Damage' },
  { id: 'hvac', icon: '\u{2744}\uFE0F', title: 'HVAC Emergency' },
  { id: 'electrical', icon: '\u{26A1}', title: 'Electrical' },
  { id: 'gas', icon: '\u{1F4A8}', title: 'Gas Leak' },
  { id: 'structural', icon: '\u{1F3D7}\uFE0F', title: 'Structural' },
  { id: 'other', icon: '\u{1F6A8}', title: 'Other' },
];

// ----- Step 2 severity levels -----
interface SeverityLevel {
  level: number;
  label: string;
  color: string;
  borderColor: string;
}

const SEVERITIES: SeverityLevel[] = [
  { level: 1, label: 'Minor', color: '#71717a', borderColor: '#71717a' },
  { level: 2, label: 'Low', color: '#a1a1aa', borderColor: '#a1a1aa' },
  { level: 3, label: 'Moderate', color: '#f59e0b', borderColor: '#f59e0b' },
  { level: 4, label: 'High', color: '#f97316', borderColor: '#f97316' },
  { level: 5, label: 'Critical', color: '#dc2626', borderColor: '#dc2626' },
];

// ----- Pulsing ring component for step 3 -----
function PulsingRing({ delay, size }: { delay: number; size: number }) {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      ),
    );
  }, [delay, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: '#f97316',
        },
        animatedStyle,
      ]}
    />
  );
}

export default function EmergencyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<number | null>(null);
  const [searchComplete, setSearchComplete] = useState(false);

  // Step 3: auto-advance after "finding" animation
  useEffect(() => {
    if (step !== 3) return;
    const timer = setTimeout(() => {
      setSearchComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const navTimer = setTimeout(() => {
        router.push('/(emergency)/tracking');
      }, 800);
      return () => clearTimeout(navTimer);
    }, 3000);
    return () => clearTimeout(timer);
  }, [step, router]);

  const handleCategorySelect = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCategory(id);
    setStep(2);
  }, []);

  const handleSeveritySelect = useCallback((level: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSeverity(level);
  }, []);

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(3);
  }, []);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  // ---------- STEP 1: Category selection ----------
  if (step === 1) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.title}>Emergency</Text>
          <Text style={styles.subtitle}>What type of emergency?</Text>
        </Animated.View>

        <View style={styles.grid}>
          {CATEGORIES.map((cat, i) => (
            <Animated.View
              key={cat.id}
              entering={FadeInDown.delay(i * 60).duration(300)}
              style={styles.gridItem}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.categoryCard,
                  pressed && styles.categoryCardPressed,
                ]}
                onPress={() => handleCategorySelect(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryTitle}>{cat.title}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  // ---------- STEP 2: Severity selection ----------
  if (step === 2) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.title}>Severity</Text>
          <Text style={styles.subtitle}>How urgent is this?</Text>
        </Animated.View>

        <View style={styles.severityRow}>
          {SEVERITIES.map((sev) => {
            const isSelected = selectedSeverity === sev.level;
            return (
              <Pressable
                key={sev.level}
                style={[
                  styles.severityPill,
                  isSelected && {
                    borderColor: sev.borderColor,
                    transform: [{ scale: 1.08 }],
                  },
                ]}
                onPress={() => handleSeveritySelect(sev.level)}
              >
                <Text
                  style={[
                    styles.severityNumber,
                    { color: isSelected ? sev.color : '#71717a' },
                  ]}
                >
                  {sev.level}
                </Text>
                <Text
                  style={[
                    styles.severityLabel,
                    { color: isSelected ? sev.color : '#a1a1aa' },
                  ]}
                >
                  {sev.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {selectedSeverity !== null && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.nextWrapper}>
            <Pressable
              style={({ pressed }) => [
                styles.nextButton,
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
          </Animated.View>
        )}

        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  // ---------- STEP 3: Location + Dispatch search ----------
  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: DEFAULT_CENTER.lat,
          longitude: DEFAULT_CENTER.lng,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        showsUserLocation={false}
        scrollEnabled={false}
        zoomEnabled={false}
      />

      {/* Dark overlay */}
      <View style={styles.mapOverlay} />

      {/* Center marker + rings */}
      <View style={styles.centerMarkerWrapper}>
        <PulsingRing delay={0} size={160} />
        <PulsingRing delay={600} size={240} />
        <PulsingRing delay={1200} size={320} />

        {/* Center dot */}
        <View style={styles.centerDot} />
      </View>

      {/* Status text */}
      <View style={[styles.searchTextWrapper, { top: insets.top + 80 }]}>
        <Animated.Text
          entering={FadeIn.duration(500)}
          style={styles.searchText}
        >
          {searchComplete ? 'Found!' : 'Finding nearby pros...'}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    marginBottom: 32,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridItem: {
    width: (SCREEN_WIDTH - 48 - 12) / 2,
  },
  categoryCard: {
    backgroundColor: 'rgba(63, 63, 70, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(113, 113, 122, 0.3)',
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  categoryCardPressed: {
    backgroundColor: 'rgba(63, 63, 70, 1)',
    borderColor: '#00a9e0',
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Severity
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 16,
  },
  severityPill: {
    flex: 1,
    backgroundColor: 'rgba(63, 63, 70, 0.6)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(113, 113, 122, 0.3)',
    paddingVertical: 20,
    alignItems: 'center',
    gap: 4,
  },
  severityNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  severityLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // Next
  nextWrapper: {
    marginTop: 32,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#00a9e0',
    borderRadius: 9999,
    paddingHorizontal: 48,
    paddingVertical: 16,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },

  // Cancel
  cancelButton: {
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
  },
  cancelText: {
    color: '#a1a1aa',
    fontSize: 16,
    fontWeight: '500',
  },

  // Step 3 map
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  centerMarkerWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -160,
    marginLeft: -160,
    width: 320,
    height: 320,
  },
  centerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f97316',
    borderWidth: 3,
    borderColor: '#dc2626',
  },
  searchTextWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  searchText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
});

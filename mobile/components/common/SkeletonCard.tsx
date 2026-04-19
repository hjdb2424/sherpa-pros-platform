import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';

interface SkeletonCardProps {
  count?: number;
}

function SingleSkeleton() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.lineWide, { opacity }]} />
      <Animated.View style={[styles.lineNarrow, { opacity }]} />
      <View style={styles.row}>
        <Animated.View style={[styles.badge, { opacity }]} />
        <Animated.View style={[styles.badge, { opacity }]} />
      </View>
    </View>
  );
}

export default function SkeletonCard({ count = 3 }: SkeletonCardProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, i) => (
        <SingleSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  lineWide: {
    height: 14,
    width: '80%',
    backgroundColor: colors.borderMedium,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  lineNarrow: {
    height: 10,
    width: '50%',
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    height: 24,
    width: 60,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.full,
  },
});

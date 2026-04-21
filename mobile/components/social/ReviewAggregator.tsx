import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';

interface PlatformReview {
  id: string;
  name: string;
  color: string;
  rating: number;
  reviewCount: number;
}

interface ReviewAggregatorProps {
  onImportReviews: () => void;
}

const PLATFORM_REVIEWS: PlatformReview[] = [
  { id: 'google', name: 'Google', color: '#4285F4', rating: 4.8, reviewCount: 18 },
  { id: 'yelp', name: 'Yelp', color: '#D32323', rating: 4.7, reviewCount: 12 },
];

function computeAggregate(reviews: PlatformReview[]) {
  const totalReviews = reviews.reduce((sum, p) => sum + p.reviewCount, 0);
  if (totalReviews === 0) return { averageRating: 0, totalReviews: 0, platformCount: 0 };
  const weightedSum = reviews.reduce((sum, p) => sum + p.rating * p.reviewCount, 0);
  return {
    averageRating: Math.round((weightedSum / totalReviews) * 10) / 10,
    totalReviews,
    platformCount: reviews.length,
  };
}

export default function ReviewAggregator({ onImportReviews }: ReviewAggregatorProps) {
  const { averageRating, totalReviews, platformCount } = computeAggregate(PLATFORM_REVIEWS);
  const maxReviews = Math.max(...PLATFORM_REVIEWS.map((p) => p.reviewCount));

  return (
    <View style={s.container}>
      {/* Aggregate header */}
      <View style={s.aggregateRow}>
        <View style={s.starIcon}>
          <Ionicons name="star" size={28} color={colors.accent} />
        </View>
        <View style={s.aggregateInfo}>
          <Text style={s.aggregateRating}>{averageRating}</Text>
          <Text style={s.aggregateSubtitle}>
            Based on {totalReviews} reviews across {platformCount} platforms
          </Text>
        </View>
      </View>

      {/* Platform breakdown */}
      <View style={s.breakdownSection}>
        {PLATFORM_REVIEWS.map((platform) => {
          const barWidth = maxReviews > 0 ? (platform.reviewCount / maxReviews) * 100 : 0;
          return (
            <View key={platform.id} style={s.breakdownRow}>
              <Text style={s.breakdownName}>{platform.name}</Text>
              <View style={s.barContainer}>
                <View style={[s.bar, { width: `${barWidth}%`, backgroundColor: platform.color }]} />
              </View>
              <Text style={s.breakdownStats}>
                <Ionicons name="star" size={11} color={colors.accent} /> {platform.rating} · {platform.reviewCount} reviews
              </Text>
            </View>
          );
        })}
      </View>

      {/* Import button */}
      <Pressable
        style={s.importButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onImportReviews();
        }}
      >
        <Ionicons name="download-outline" size={16} color={colors.primary} />
        <Text style={s.importButtonText}>Import Reviews</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  aggregateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  starIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aggregateInfo: {
    flex: 1,
  },
  aggregateRating: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  aggregateSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  breakdownSection: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  breakdownRow: {
    gap: 4,
  },
  breakdownName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  barContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceSecondary,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownStats: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  importButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

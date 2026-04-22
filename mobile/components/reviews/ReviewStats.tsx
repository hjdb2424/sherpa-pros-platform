import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';

interface ReviewStatsProps {
  averageRating: number;
  totalReviews: number;
  distribution: number[]; // 5-star down to 1-star
  responseRate: number;
  wouldHireAgainPct: number;
}

const BAR_COLORS = ['#00a9e0', '#4dc4eb', '#f59e0b', '#f97316', '#dc2626'];

export default function ReviewStats({
  averageRating,
  totalReviews,
  distribution,
  responseRate,
  wouldHireAgainPct,
}: ReviewStatsProps) {
  const maxCount = Math.max(...distribution, 1);

  return (
    <View style={s.container}>
      {/* Large rating display */}
      <View style={s.ratingHeader}>
        <Text style={s.ratingBig}>{averageRating.toFixed(1)}</Text>
        <Ionicons name="star" size={24} color={colors.accent} />
        <Text style={s.totalReviews}>({totalReviews} reviews)</Text>
      </View>

      {/* Distribution bars */}
      <View style={s.distributionSection}>
        {distribution.map((count, idx) => {
          const starNum = 5 - idx;
          const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
          return (
            <View key={starNum} style={s.distRow}>
              <Text style={s.distLabel}>{starNum}</Text>
              <Ionicons name="star" size={12} color={colors.accent} />
              <View style={s.barContainer}>
                <View
                  style={[
                    s.barFill,
                    {
                      width: `${barWidth}%`,
                      backgroundColor: BAR_COLORS[idx],
                    },
                  ]}
                />
              </View>
              <Text style={s.distCount}>{count}</Text>
              <Text style={s.distPct}>{pct}%</Text>
            </View>
          );
        })}
      </View>

      {/* Footer stats */}
      <View style={s.footerStats}>
        <View style={s.footerItem}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
          <Text style={s.footerText}>
            Responds to {responseRate}% of reviews
          </Text>
        </View>
        <View style={s.footerItem}>
          <Ionicons name="thumbs-up-outline" size={16} color={colors.success} />
          <Text style={s.footerText}>
            {wouldHireAgainPct}% would hire again
          </Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ratingBig: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
  },
  totalReviews: {
    fontSize: 14,
    color: colors.textMuted,
    marginLeft: 2,
  },
  distributionSection: {
    gap: spacing.sm,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  distLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    width: 12,
    textAlign: 'right',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  distCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    width: 28,
    textAlign: 'right',
  },
  distPct: {
    fontSize: 11,
    color: colors.textMuted,
    width: 32,
    textAlign: 'right',
  },
  footerStats: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});

import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';
import type { Review } from './types';
import ReviewCard from './ReviewCard';

type SortKey = 'recent' | 'highest' | 'lowest';
type FilterKey = 'all' | '5' | '4' | '3' | '2' | '1' | 'photos';

interface ReviewListProps {
  reviews: Review[];
  showFilters?: boolean;
  onLoadMore?: () => void;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Most Recent' },
  { key: 'highest', label: 'Highest' },
  { key: 'lowest', label: 'Lowest' },
];

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: '5', label: '5\u2605' },
  { key: '4', label: '4\u2605' },
  { key: '3', label: '3\u2605' },
  { key: '2', label: '2\u2605' },
  { key: '1', label: '1\u2605' },
  { key: 'photos', label: 'With Photos' },
];

export default function ReviewList({
  reviews,
  showFilters = true,
  onLoadMore,
}: ReviewListProps) {
  const [sort, setSort] = useState<SortKey>('recent');
  const [filter, setFilter] = useState<FilterKey>('all');

  const filteredAndSorted = useMemo(() => {
    let result = [...reviews];

    // Filter
    if (filter !== 'all') {
      if (filter === 'photos') {
        result = result.filter((r) => r.photos && r.photos.length > 0);
      } else {
        const starNum = parseInt(filter, 10);
        result = result.filter((r) => r.rating === starNum);
      }
    }

    // Sort
    if (sort === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }
    // 'recent' keeps original order

    return result;
  }, [reviews, sort, filter]);

  const handleSortChange = useCallback((key: SortKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSort(key);
  }, []);

  const handleFilterChange = useCallback((key: FilterKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilter(key);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Review }) => <ReviewCard review={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Review) => item.id, []);

  const renderEmpty = () => (
    <View style={s.emptyState}>
      <Ionicons name="chatbubble-outline" size={40} color={colors.borderMedium} />
      <Text style={s.emptyTitle}>No reviews yet</Text>
      <Text style={s.emptySubtitle}>Reviews will appear here once received</Text>
    </View>
  );

  const renderFooter = () => {
    if (!onLoadMore || filteredAndSorted.length === 0) return null;
    return (
      <Pressable
        style={s.loadMoreBtn}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onLoadMore();
        }}
      >
        <Text style={s.loadMoreText}>Load More</Text>
      </Pressable>
    );
  };

  const renderHeader = () => {
    if (!showFilters) return null;
    return (
      <View style={s.filtersContainer}>
        {/* Sort chips */}
        <View style={s.chipRow}>
          {SORT_OPTIONS.map((opt) => {
            const active = sort === opt.key;
            return (
              <Pressable
                key={opt.key}
                style={[s.chip, active && s.chipActive]}
                onPress={() => handleSortChange(opt.key)}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {/* Filter chips */}
        <View style={s.chipRow}>
          {FILTER_OPTIONS.map((opt) => {
            const active = filter === opt.key;
            return (
              <Pressable
                key={opt.key}
                style={[s.filterChip, active && s.filterChipActive]}
                onPress={() => handleFilterChange(opt.key)}
              >
                <Text style={[s.filterChipText, active && s.filterChipTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={filteredAndSorted}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      scrollEnabled={false}
      contentContainerStyle={s.listContent}
    />
  );
}

const s = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
  filtersContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: '#fff',
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  filterChipTextActive: {
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.subheading,
    color: colors.textMuted,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  loadMoreBtn: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

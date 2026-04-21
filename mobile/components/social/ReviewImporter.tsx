import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';

interface MockReview {
  id: string;
  reviewer: string;
  stars: number;
  text: string;
  date: string;
  imported: boolean;
}

const GOOGLE_REVIEWS: MockReview[] = [
  { id: 'gr1', reviewer: 'Sarah T.', stars: 5, text: 'Mike fixed our water heater in under an hour. Super professional and cleaned up after himself. Highly recommend!', date: 'Mar 28, 2026', imported: false },
  { id: 'gr2', reviewer: 'David L.', stars: 5, text: 'Called at 11pm with a burst pipe and Mike was here by midnight. Saved us from major damage. True emergency pro.', date: 'Mar 15, 2026', imported: false },
  { id: 'gr3', reviewer: 'Jennifer W.', stars: 4, text: 'Great work on our bathroom remodel plumbing. Came in on budget. Only took an extra day due to permit inspection delay.', date: 'Feb 22, 2026', imported: true },
  { id: 'gr4', reviewer: 'Robert M.', stars: 5, text: 'Best plumber in the seacoast area. Fair pricing, shows up on time, does quality work. What more could you ask for?', date: 'Feb 10, 2026', imported: false },
  { id: 'gr5', reviewer: 'Amanda K.', stars: 5, text: 'Mike installed our new kitchen faucet and garbage disposal. Quick, clean, and reasonably priced. Will call again.', date: 'Jan 30, 2026', imported: true },
  { id: 'gr6', reviewer: 'Chris P.', stars: 4, text: 'Solid work fixing our sump pump before the spring thaw. Explained everything clearly and gave us maintenance tips.', date: 'Jan 15, 2026', imported: false },
];

const YELP_REVIEWS: MockReview[] = [
  { id: 'yr1', reviewer: 'Michelle S.', stars: 5, text: 'I cannot say enough good things about Mike Rodriguez Plumbing. We had a complete sewer line backup that two other plumbers couldn\'t fix. Mike came out, diagnosed the issue in 20 minutes, and had it repaired by end of day. His price was fair and he even followed up the next week.', date: 'Apr 2, 2026', imported: false },
  { id: 'yr2', reviewer: 'Tom B.', stars: 5, text: 'We\'ve used Mike for three different projects now - water heater replacement, bathroom rough-in, and a kitchen sink install. Every time he\'s been punctual, professional, and his work is top-notch. He\'s our go-to plumber for life.', date: 'Mar 18, 2026', imported: false },
  { id: 'yr3', reviewer: 'Karen D.', stars: 4, text: 'Mike did a great job replacing our old galvanized pipes with PEX. The project took two days as estimated. My only minor gripe is scheduling took a bit since he\'s so busy, but worth the wait for quality work.', date: 'Mar 5, 2026', imported: true },
  { id: 'yr4', reviewer: 'Jason H.', stars: 5, text: 'Emergency call on a Saturday morning and Mike was here within 45 minutes. Fixed our leaking water line and charged a very reasonable rate. No price gouging for weekend work. Stand-up guy.', date: 'Feb 20, 2026', imported: false },
  { id: 'yr5', reviewer: 'Lisa G.', stars: 5, text: 'Hired Mike to do the plumbing for our new addition. He worked perfectly with our GC, pulled all permits, and passed every inspection first try. His attention to detail is impressive.', date: 'Feb 8, 2026', imported: false },
  { id: 'yr6', reviewer: 'Mark R.', stars: 4, text: 'Good work on our tankless water heater install. Mike explained the pros and cons of different models and helped us pick the right one for our household size. Took about 4 hours total.', date: 'Jan 25, 2026', imported: false },
];

interface ReviewImporterProps {
  platform: string;
  onImport: (count: number) => void;
  onClose?: () => void;
}

function getPlatformColor(platform: string): string {
  switch (platform) {
    case 'google': return '#4285F4';
    case 'yelp': return '#D32323';
    default: return colors.primary;
  }
}

function getPlatformName(platform: string): string {
  switch (platform) {
    case 'google': return 'Google';
    case 'yelp': return 'Yelp';
    default: return platform;
  }
}

export default function ReviewImporter({ platform, onImport, onClose }: ReviewImporterProps) {
  const baseReviews = platform === 'google' ? GOOGLE_REVIEWS : YELP_REVIEWS;
  const [reviews, setReviews] = useState<MockReview[]>(baseReviews);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const platformColor = getPlatformColor(platform);
  const platformName = getPlatformName(platform);

  const toggleSelect = useCallback((id: string) => {
    const review = reviews.find((r) => r.id === id);
    if (review?.imported) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [reviews]);

  const handleImport = useCallback(() => {
    if (selected.size === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = reviews.map((r) =>
      selected.has(r.id) ? { ...r, imported: true } : r,
    );
    setReviews(updated);
    Alert.alert('Imported', `Imported ${selected.size} reviews to your profile!`);
    onImport(selected.size);
    setSelected(new Set());
  }, [selected, reviews, onImport]);

  const renderReview = useCallback(
    ({ item }: { item: MockReview }) => {
      const isSelected = selected.has(item.id);
      return (
        <Pressable
          onPress={() => toggleSelect(item.id)}
          style={[s.reviewCard, isSelected && s.reviewCardSelected]}
          disabled={item.imported}
        >
          <View style={s.reviewTop}>
            {/* Checkbox */}
            <View style={[s.checkbox, item.imported && s.checkboxImported, isSelected && s.checkboxSelected]}>
              {(isSelected || item.imported) && (
                <Ionicons name="checkmark" size={12} color="#ffffff" />
              )}
            </View>

            {/* Stars */}
            <View style={s.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < item.stars ? 'star' : 'star-outline'}
                  size={13}
                  color={colors.accent}
                />
              ))}
            </View>

            {/* Date */}
            <Text style={s.reviewDate}>{item.date}</Text>
          </View>

          {/* Reviewer name + badge */}
          <View style={s.reviewerRow}>
            <Text style={s.reviewerName}>{item.reviewer}</Text>
            <View style={[s.platformBadge, { backgroundColor: platformColor + '18' }]}>
              <Text style={[s.platformBadgeText, { color: platformColor }]}>{platformName}</Text>
            </View>
            {item.imported && (
              <View style={s.importedBadge}>
                <Text style={s.importedBadgeText}>Imported</Text>
              </View>
            )}
          </View>

          {/* Review text */}
          <Text style={s.reviewText} numberOfLines={3}>
            {item.text}
          </Text>
        </Pressable>
      );
    },
    [selected, toggleSelect, platformColor, platformName],
  );

  const selectableCount = reviews.filter((r) => !r.imported).length;

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          {onClose && (
            <Pressable onPress={onClose} style={s.closeButton}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          )}
          <Text style={s.title}>{platformName} Reviews</Text>
        </View>
        <Text style={s.selectedCount}>{selected.size} of {selectableCount} selected</Text>
      </View>

      {/* List */}
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Import button */}
      <View style={s.footer}>
        <Pressable
          style={[s.importButton, selected.size === 0 && s.importButtonDisabled]}
          onPress={handleImport}
          disabled={selected.size === 0}
        >
          <Text style={s.importButtonText}>
            Import {selected.size > 0 ? `${selected.size} Reviews` : 'Reviews'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
  },
  selectedCount: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  listContainer: {
    padding: spacing.lg,
    paddingBottom: 100,
    gap: spacing.md,
  },
  reviewCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  reviewCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderMedium,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxImported: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
    flex: 1,
  },
  reviewDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 6,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  platformBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  platformBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  importedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.successLight,
  },
  importedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  reviewText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  importButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  importButtonDisabled: {
    backgroundColor: colors.borderMedium,
    shadowOpacity: 0,
  },
  importButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

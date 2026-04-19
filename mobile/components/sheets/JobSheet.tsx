import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useCallback, forwardRef } from 'react';
import SimpleBottomSheet, { type SimpleBottomSheetRef } from '@/components/sheets/SimpleBottomSheet';
import Badge from '@/components/common/Badge';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';
import type { MockJobLocation } from '@/lib/types';

const URGENCY_VARIANTS: Record<string, 'danger' | 'primary' | 'neutral'> = {
  emergency: 'danger',
  standard: 'primary',
  flexible: 'neutral',
};

interface JobSheetProps {
  jobs: MockJobLocation[];
  onJobSelect?: (job: MockJobLocation) => void;
  selectedId?: string | null;
}

const JobSheet = forwardRef<SimpleBottomSheetRef, JobSheetProps>(({ jobs, onJobSelect, selectedId }, ref) => {
  const renderJobCard = useCallback(({ item }: { item: MockJobLocation }) => (
    <Pressable onPress={() => onJobSelect?.(item)} style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
      <View style={[styles.card, selectedId === item.id && styles.cardSelected]}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Badge label={item.urgency} variant={URGENCY_VARIANTS[item.urgency]} />
        </View>
        <Text style={styles.meta}>{item.category} {'\u00B7'} {item.distance} {'\u00B7'} {item.postedAgo}</Text>
        <View style={styles.footer}>
          <Text style={styles.budget}>${item.budget.toLocaleString()}</Text>
          <View style={styles.bidBtn}>
            <Text style={styles.bidText}>Place Bid</Text>
          </View>
        </View>
      </View>
    </Pressable>
  ), [onJobSelect, selectedId]);

  return (
    <SimpleBottomSheet
      ref={ref}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <View style={styles.peekContent}>
        <Text style={styles.peekText}>{jobs.length} Jobs Available</Text>
      </View>
      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SimpleBottomSheet>
  );
});

JobSheet.displayName = 'JobSheet';
export default JobSheet;

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: colors.background },
  handle: { backgroundColor: colors.borderMedium, width: 40 },
  peekContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  peekText: { fontSize: 15, fontWeight: '600', color: colors.text },
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: 100 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
  title: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  budget: { fontSize: 20, fontWeight: '700', color: colors.text },
  bidBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  bidText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});

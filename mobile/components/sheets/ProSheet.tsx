import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useCallback, forwardRef } from 'react';
import SimpleBottomSheet, { type SimpleBottomSheetRef } from '@/components/sheets/SimpleBottomSheet';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';
import type { MockProLocation } from '@/lib/types';

interface ProSheetProps {
  pros: MockProLocation[];
  onProSelect?: (pro: MockProLocation) => void;
  selectedId?: string | null;
}

const ProSheet = forwardRef<SimpleBottomSheetRef, ProSheetProps>(({ pros, onProSelect, selectedId }, ref) => {
  const renderProCard = useCallback(({ item }: { item: MockProLocation }) => (
    <Pressable onPress={() => onProSelect?.(item)} style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
      <View style={[styles.card, selectedId === item.id && styles.cardSelected]}>
        <View style={styles.row}>
          <Avatar initials={item.initials} size={44} />
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
              {item.verified && <Badge label="Verified" variant="success" />}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.star}>{'\u2605'} {item.rating}</Text>
              <Text style={styles.meta}>{item.trade} {'\u00B7'} {item.distance}</Text>
            </View>
            <Text style={styles.response}>{item.responseTime} response</Text>
          </View>
        </View>
      </View>
    </Pressable>
  ), [onProSelect, selectedId]);

  return (
    <SimpleBottomSheet
      ref={ref}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <View style={styles.peekContent}>
        <Text style={styles.peekText}>{pros.length} Pros Nearby</Text>
      </View>
      <FlatList
        data={pros}
        renderItem={renderProCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SimpleBottomSheet>
  );
});

ProSheet.displayName = 'ProSheet';
export default ProSheet;

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
  row: { flexDirection: 'row', gap: spacing.md },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 4 },
  star: { fontSize: 13, color: colors.accent, fontWeight: '600' },
  meta: { fontSize: 13, color: colors.textMuted },
  response: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});

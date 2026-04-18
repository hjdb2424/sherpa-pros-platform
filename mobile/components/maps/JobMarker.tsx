import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { colors, borderRadius, shadows, spacing } from '@/lib/theme';
import Badge from '@/components/common/Badge';
import type { MockJobLocation } from '@/lib/types';

const URGENCY_COLORS: Record<string, string> = {
  emergency: colors.accent,
  standard: colors.primary,
  flexible: colors.textMuted,
};

const URGENCY_VARIANTS: Record<string, 'danger' | 'primary' | 'neutral'> = {
  emergency: 'danger',
  standard: 'primary',
  flexible: 'neutral',
};

interface JobMarkerProps {
  job: MockJobLocation;
  onPress?: () => void;
}

export default function JobMarker({ job, onPress }: JobMarkerProps) {
  const borderColor = URGENCY_COLORS[job.urgency] ?? colors.primary;
  const priceLabel = job.budget >= 1000 ? `$${(job.budget / 1000).toFixed(0)}k` : `$${job.budget}`;

  return (
    <Marker
      coordinate={{ latitude: job.lat, longitude: job.lng }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={[styles.pin, { borderColor }]}>
        <Text style={styles.price}>{priceLabel}</Text>
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
            <Badge label={job.urgency} variant={URGENCY_VARIANTS[job.urgency]} />
          </View>
          <Text style={styles.meta}>{job.category} {'\u00B7'} {job.distance} {'\u00B7'} {job.postedAgo}</Text>
          <View style={styles.footer}>
            <Text style={styles.budget}>${job.budget.toLocaleString()}</Text>
            <View style={styles.bidBtn}>
              <Text style={styles.bidText}>Bid</Text>
            </View>
          </View>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  price: { fontSize: 11, fontWeight: '700', color: colors.text },
  callout: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: 220,
    ...shadows.lg,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
  title: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1 },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  budget: { fontSize: 18, fontWeight: '700', color: colors.text },
  bidBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  bidText: { fontSize: 12, fontWeight: '600', color: '#fff' },
});

import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { colors, borderRadius, shadows, spacing } from '@/lib/theme';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import type { MockProLocation } from '@/lib/types';

interface ProMarkerProps {
  pro: MockProLocation;
  onPress?: () => void;
}

export default function ProMarker({ pro, onPress }: ProMarkerProps) {
  return (
    <Marker
      coordinate={{ latitude: pro.lat, longitude: pro.lng }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={styles.pin}>
        <Avatar initials={pro.initials} size={36} />
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <View style={styles.calloutRow}>
            <Avatar initials={pro.initials} size={32} />
            <View style={styles.calloutInfo}>
              <Text style={styles.calloutName}>{pro.name}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.star}>{'\u2605'} {pro.rating}</Text>
                <Text style={styles.trade}>{pro.trade}</Text>
              </View>
            </View>
          </View>
          <View style={styles.calloutFooter}>
            <Text style={styles.distance}>{pro.distance}</Text>
            <View style={styles.requestBtn}>
              <Text style={styles.requestText}>Request</Text>
            </View>
          </View>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    ...shadows.md,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  callout: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: 200,
    ...shadows.lg,
  },
  calloutRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  calloutInfo: { flex: 1 },
  calloutName: { fontSize: 14, fontWeight: '600', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 2 },
  star: { fontSize: 12, color: colors.accent, fontWeight: '600' },
  trade: { fontSize: 12, color: colors.textMuted },
  calloutFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  distance: { fontSize: 12, color: colors.textMuted },
  requestBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  requestText: { fontSize: 12, fontWeight: '600', color: '#fff' },
});

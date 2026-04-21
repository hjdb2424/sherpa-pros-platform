import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import {
  SocialConnections,
  PhotoImporter,
  ReviewAggregator,
  ReviewImporter,
} from '@/components/social';

const PHOTO_PLATFORMS = [
  { id: 'google', name: 'Google', color: '#4285F4' },
  { id: 'instagram', name: 'Instagram', color: '#E1306C' },
];

export default function SocialSyncScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [photoModal, setPhotoModal] = useState<{ platform: string; name: string } | null>(null);
  const [reviewModal, setReviewModal] = useState<string | null>(null);

  const handlePhotoImport = useCallback((count: number) => {
    setPhotoModal(null);
  }, []);

  const handleReviewImport = useCallback((count: number) => {
    setReviewModal(null);
  }, []);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={s.header}>
        <Pressable
          style={s.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={s.headerTitle}>Social Sync</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        {/* Connected Platforms */}
        <SocialConnections />

        {/* Import Photos Section */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Import Photos</Text>
          <Text style={s.sectionSubtitle}>Pull photos from your connected platforms into your portfolio</Text>
          <View style={s.chipRow}>
            {PHOTO_PLATFORMS.map((p) => (
              <Pressable
                key={p.id}
                style={[s.platformChip, { borderColor: p.color }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setPhotoModal({ platform: p.id, name: p.name });
                }}
              >
                <View style={[s.chipDot, { backgroundColor: p.color }]} />
                <Text style={[s.chipText, { color: p.color }]}>{p.name}</Text>
                <Ionicons name="chevron-forward" size={14} color={p.color} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Reviews Section */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Reviews</Text>
          <Text style={s.sectionSubtitle}>Aggregate rating across all connected review platforms</Text>
          <View style={s.reviewAggregatorWrapper}>
            <ReviewAggregator onImportReviews={() => setReviewModal('google')} />
          </View>
        </View>
      </ScrollView>

      {/* Photo Importer Modal */}
      <Modal
        visible={photoModal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPhotoModal(null)}
      >
        {photoModal && (
          <View style={[s.modalContainer, { paddingTop: insets.top }]}>
            <PhotoImporter
              platform={photoModal.platform}
              platformName={photoModal.name}
              onImport={handlePhotoImport}
              onClose={() => setPhotoModal(null)}
            />
          </View>
        )}
      </Modal>

      {/* Review Importer Modal */}
      <Modal
        visible={reviewModal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setReviewModal(null)}
      >
        {reviewModal && (
          <View style={[s.modalContainer, { paddingTop: insets.top }]}>
            <ReviewImporter
              platform={reviewModal}
              onImport={handleReviewImport}
              onClose={() => setReviewModal(null)}
            />
          </View>
        )}
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    backgroundColor: colors.background,
    ...shadows.sm,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewAggregatorWrapper: {
    marginTop: spacing.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';
import type { Review } from './types';

interface ReviewCardProps {
  review: Review;
  showResponse?: boolean;
  onHelpful?: () => void;
  onReport?: () => void;
}

export default function ReviewCard({
  review,
  showResponse = true,
  onHelpful,
  onReport,
}: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [fullScreenPhoto, setFullScreenPhoto] = useState<string | null>(null);
  const [helpfulPressed, setHelpfulPressed] = useState(false);

  const textNeedsExpand = review.text.length > 150;

  const handleHelpful = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHelpfulPressed(true);
    onHelpful?.();
  }, [onHelpful]);

  const handleReport = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onReport?.();
  }, [onReport]);

  return (
    <View style={s.card}>
      {/* Header: Avatar + Name + Verified + Date */}
      <View style={s.header}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{review.reviewerInitials}</Text>
        </View>
        <View style={s.headerInfo}>
          <View style={s.nameRow}>
            <Text style={s.reviewerName}>{review.reviewerName}</Text>
            {review.verified && (
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            )}
          </View>
          <Text style={s.date}>{review.date}</Text>
        </View>
      </View>

      {/* Star row */}
      <View style={s.starRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name={i < review.rating ? 'star' : 'star-outline'}
            size={16}
            color={colors.accent}
          />
        ))}
      </View>

      {/* Project type chip */}
      <View style={s.chipRow}>
        <View style={s.projectChip}>
          <Text style={s.projectChipText}>{review.projectType}</Text>
        </View>
      </View>

      {/* Review text */}
      <Text
        style={s.reviewText}
        numberOfLines={expanded ? undefined : 3}
      >
        {review.text}
      </Text>
      {textNeedsExpand && !expanded && (
        <Pressable onPress={() => setExpanded(true)}>
          <Text style={s.readMore}>Read more</Text>
        </Pressable>
      )}

      {/* Photo thumbnails */}
      {review.photos && review.photos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.photoRow}
        >
          {review.photos.map((uri, idx) => (
            <Pressable
              key={idx}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFullScreenPhoto(uri);
              }}
            >
              <Image source={{ uri }} style={s.photoThumb} />
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Would hire again */}
      <View style={s.hireAgainRow}>
        {review.wouldHireAgain ? (
          <>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={[s.hireAgainText, { color: colors.success }]}>
              Would hire again
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="close-circle" size={14} color={colors.danger} />
            <Text style={[s.hireAgainText, { color: colors.danger }]}>
              Would not hire again
            </Text>
          </>
        )}
      </View>

      {/* Helpful + Report */}
      <View style={s.actionsRow}>
        <Pressable
          style={[s.helpfulBtn, helpfulPressed && s.helpfulBtnActive]}
          onPress={handleHelpful}
          disabled={helpfulPressed}
        >
          <Ionicons
            name={helpfulPressed ? 'thumbs-up' : 'thumbs-up-outline'}
            size={14}
            color={helpfulPressed ? colors.primary : colors.textMuted}
          />
          <Text
            style={[
              s.helpfulText,
              helpfulPressed && { color: colors.primary, fontWeight: '600' },
            ]}
          >
            Helpful ({review.helpfulCount + (helpfulPressed ? 1 : 0)})
          </Text>
        </Pressable>
        <Pressable onPress={handleReport}>
          <Text style={s.reportText}>Report</Text>
        </Pressable>
      </View>

      {/* Pro response */}
      {showResponse && review.proResponse && (
        <View style={s.responseSection}>
          <View style={s.responseBadge}>
            <Ionicons name="chatbubble" size={10} color={colors.primary} />
            <Text style={s.responseBadgeText}>Pro Response</Text>
          </View>
          <Text style={s.responseText}>{review.proResponse.text}</Text>
          <Text style={s.responseDate}>{review.proResponse.date}</Text>
        </View>
      )}

      {/* Full screen photo modal */}
      <Modal visible={fullScreenPhoto !== null} transparent animationType="fade">
        <View style={s.photoModal}>
          <Pressable
            style={s.photoModalClose}
            onPress={() => setFullScreenPhoto(null)}
          >
            <Ionicons name="close-circle" size={36} color="#fff" />
          </Pressable>
          {fullScreenPhoto && (
            <Image
              source={{ uri: fullScreenPhoto }}
              style={s.photoModalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  projectChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
  },
  projectChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  reviewText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  readMore: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  photoRow: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  photoThumb: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.borderLight,
  },
  hireAgainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.md,
  },
  hireAgainText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  helpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  helpfulBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  helpfulText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  reportText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  responseSection: {
    marginTop: spacing.md,
    marginLeft: spacing.xl,
    paddingLeft: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  responseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  responseBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  responseText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  responseDate: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  photoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoModalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  photoModalImage: {
    width: '90%',
    height: '70%',
  },
});

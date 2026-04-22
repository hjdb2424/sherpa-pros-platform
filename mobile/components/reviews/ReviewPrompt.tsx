import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';

interface ReviewPromptProps {
  proName: string;
  proInitials: string;
  jobTitle: string;
  onReview: () => void;
  onDismiss: () => void;
}

export default function ReviewPrompt({
  proName,
  proInitials,
  jobTitle,
  onReview,
  onDismiss,
}: ReviewPromptProps) {
  const handleStarTap = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onReview();
  }, [onReview]);

  const handleDismiss = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
  }, [onDismiss]);

  return (
    <View style={s.card}>
      <Text style={s.prompt}>How was your experience with {proName}?</Text>

      <View style={s.proRow}>
        <View style={s.proAvatar}>
          <Text style={s.proAvatarText}>{proInitials}</Text>
        </View>
        <View>
          <Text style={s.proName}>{proName}</Text>
          <Text style={s.jobTitle}>{jobTitle}</Text>
        </View>
      </View>

      {/* Star row */}
      <View style={s.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={handleStarTap}>
            <Ionicons name="star-outline" size={32} color={colors.accent} />
          </Pressable>
        ))}
      </View>

      <Pressable style={s.reviewBtn} onPress={onReview}>
        <Text style={s.reviewBtnText}>Write a Review</Text>
      </Pressable>

      <Pressable onPress={handleDismiss}>
        <Text style={s.dismissText}>Maybe Later</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  prompt: {
    ...typography.subheading,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
  },
  proAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  proAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  proName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  jobTitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  starRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  reviewBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.md,
    ...shadows.primaryGlow,
  },
  reviewBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  dismissText: {
    fontSize: 13,
    color: colors.textMuted,
    paddingVertical: spacing.sm,
  },
});

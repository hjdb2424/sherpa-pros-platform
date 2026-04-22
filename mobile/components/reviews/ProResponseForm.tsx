import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import type { Review } from './types';

interface ProResponseFormProps {
  review: Review;
  onSubmit: (text: string) => void;
}

export default function ProResponseForm({ review, onSubmit }: ProResponseFormProps) {
  const [text, setText] = useState('');
  const charCount = text.length;
  const isValid = text.trim().length >= 5;

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSubmit(text.trim());
    setText('');
  }, [isValid, text, onSubmit]);

  return (
    <View style={s.container}>
      {/* Compact original review */}
      <View style={s.originalReview}>
        <View style={s.reviewHeader}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{review.reviewerInitials}</Text>
          </View>
          <View style={s.reviewInfo}>
            <Text style={s.reviewerName}>{review.reviewerName}</Text>
            <View style={s.starRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < review.rating ? 'star' : 'star-outline'}
                  size={12}
                  color={colors.accent}
                />
              ))}
            </View>
          </View>
        </View>
        <Text style={s.reviewText} numberOfLines={2}>
          {review.text}
        </Text>
      </View>

      {/* Response input */}
      <Text style={s.label}>Your Response</Text>
      <TextInput
        style={s.textArea}
        placeholder="Write your response..."
        placeholderTextColor={colors.textMuted}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={300}
        textAlignVertical="top"
      />
      <View style={s.counterRow}>
        <Text style={s.noteText}>Your response will be visible to everyone</Text>
        <Text style={[s.counter, charCount > 280 && { color: colors.danger }]}>
          {charCount}/300
        </Text>
      </View>

      <Pressable
        style={[s.submitBtn, !isValid && s.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={s.submitBtnText}>Post Response</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
  },
  originalReview: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  starRow: {
    flexDirection: 'row',
    gap: 1,
    marginTop: 1,
  },
  reviewText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textArea: {
    ...typography.bodySmall,
    color: colors.text,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  noteText: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  counter: {
    fontSize: 11,
    color: colors.textMuted,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  submitBtnDisabled: {
    backgroundColor: colors.borderMedium,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

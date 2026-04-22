import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import type { Review } from './types';
import ReviewCard from './ReviewCard';

interface WriteReviewScreenProps {
  proName: string;
  proInitials: string;
  jobTitle: string;
  onSubmit: (review: Partial<Review>) => void;
  onClose: () => void;
}

export default function WriteReviewScreen({
  proName,
  proInitials,
  jobTitle,
  onSubmit,
  onClose,
}: WriteReviewScreenProps) {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [wouldHireAgain, setWouldHireAgain] = useState<boolean | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [tipsText, setTipsText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const isValid = rating > 0 && reviewText.length >= 10 && wouldHireAgain !== null;
  const charCount = reviewText.length;

  const handleStarTap = useCallback((star: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRating(star);
  }, []);

  const handleAddPhotos = useCallback(async () => {
    if (photos.length >= 5) {
      Alert.alert('Limit reached', 'Maximum 5 photos per review.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permResult.granted) {
      Alert.alert('Permission needed', 'Allow photo access to add images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5 - photos.length,
    });
    if (!result.canceled && result.assets.length > 0) {
      const newUris = result.assets.map((a) => a.uri);
      setPhotos((prev) => [...prev, ...newUris].slice(0, 5));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [photos.length]);

  const handleRemovePhoto = useCallback((idx: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSubmit({
      rating,
      text: reviewText,
      wouldHireAgain: wouldHireAgain ?? false,
      photos: photos.length > 0 ? photos : undefined,
      projectType: jobTitle,
    });
  }, [isValid, rating, reviewText, wouldHireAgain, photos, jobTitle, onSubmit]);

  const previewReview: Review = {
    id: 'preview',
    reviewerName: 'You',
    reviewerInitials: 'YO',
    rating,
    text: reviewText,
    date: 'Just now',
    projectType: jobTitle,
    verified: true,
    photos: photos.length > 0 ? photos : undefined,
    helpfulCount: 0,
    wouldHireAgain: wouldHireAgain ?? false,
  };

  if (previewMode) {
    return (
      <View style={[s.container, { paddingTop: insets.top }]}>
        <View style={s.header}>
          <Text style={s.headerTitle}>Preview Your Review</Text>
          <Pressable onPress={() => setPreviewMode(false)}>
            <Text style={s.headerAction}>Edit</Text>
          </Pressable>
        </View>
        <ScrollView style={s.content} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
          <ReviewCard review={previewReview} showResponse={false} />
        </ScrollView>
        <View style={[s.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
          <Pressable
            style={[s.submitBtn, !isValid && s.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <Text style={s.submitBtnText}>Submit Review</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Review {proName}</Text>
        <Pressable onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView style={s.content} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {/* Pro info */}
        <View style={s.proRow}>
          <View style={s.proAvatar}>
            <Text style={s.proAvatarText}>{proInitials}</Text>
          </View>
          <View>
            <Text style={s.proName}>{proName}</Text>
            <Text style={s.jobTitle}>{jobTitle}</Text>
          </View>
        </View>

        {/* Star selector */}
        <Text style={s.label}>Your Rating</Text>
        <View style={s.starSelector}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => handleStarTap(star)}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={40}
                color={colors.accent}
              />
            </Pressable>
          ))}
        </View>

        {/* Would hire again */}
        <Text style={s.label}>Would you hire again?</Text>
        <View style={s.hireAgainRow}>
          <Pressable
            style={[
              s.hireAgainBtn,
              wouldHireAgain === true && s.hireAgainBtnActive,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setWouldHireAgain(true);
            }}
          >
            <Ionicons
              name="thumbs-up"
              size={20}
              color={wouldHireAgain === true ? '#fff' : colors.success}
            />
            <Text
              style={[
                s.hireAgainBtnText,
                wouldHireAgain === true && { color: '#fff' },
              ]}
            >
              Yes
            </Text>
          </Pressable>
          <Pressable
            style={[
              s.hireAgainBtn,
              wouldHireAgain === false && s.hireAgainBtnNo,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setWouldHireAgain(false);
            }}
          >
            <Ionicons
              name="thumbs-down"
              size={20}
              color={wouldHireAgain === false ? '#fff' : colors.danger}
            />
            <Text
              style={[
                s.hireAgainBtnText,
                wouldHireAgain === false && { color: '#fff' },
              ]}
            >
              No
            </Text>
          </Pressable>
        </View>

        {/* Review text */}
        <Text style={s.label}>Your Review</Text>
        <TextInput
          style={s.textArea}
          placeholder="Share your experience (min 10 characters)..."
          placeholderTextColor={colors.textMuted}
          value={reviewText}
          onChangeText={setReviewText}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
        <Text style={[s.charCounter, charCount > 480 && { color: colors.danger }]}>
          {charCount}/500
        </Text>

        {/* Add photos */}
        <Text style={s.label}>Photos (optional)</Text>
        <View style={s.photosSection}>
          {photos.map((uri, idx) => (
            <View key={idx} style={s.photoWrapper}>
              <Image source={{ uri }} style={s.photoPreview} />
              <Pressable style={s.photoRemove} onPress={() => handleRemovePhoto(idx)}>
                <Ionicons name="close-circle" size={22} color={colors.danger} />
              </Pressable>
            </View>
          ))}
          {photos.length < 5 && (
            <Pressable style={s.addPhotoBtn} onPress={handleAddPhotos}>
              <Ionicons name="camera-outline" size={24} color={colors.primary} />
              <Text style={s.addPhotoBtnText}>Add</Text>
            </Pressable>
          )}
        </View>

        {/* Tips */}
        <Text style={s.label}>Tips for others (optional)</Text>
        <TextInput
          style={s.tipsInput}
          placeholder="Any advice for future clients?"
          placeholderTextColor={colors.textMuted}
          value={tipsText}
          onChangeText={setTipsText}
          multiline
          maxLength={200}
          textAlignVertical="top"
        />

        {/* Preview button */}
        {isValid && (
          <Pressable
            style={s.previewBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPreviewMode(true);
            }}
          >
            <Ionicons name="eye-outline" size={16} color={colors.primary} />
            <Text style={s.previewBtnText}>Preview Review</Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Bottom submit */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          style={[s.submitBtn, !isValid && s.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={s.submitBtnText}>Submit Review</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  headerAction: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  proAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  proAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  proName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  jobTitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  starSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  hireAgainRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  hireAgainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
  },
  hireAgainBtnActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  hireAgainBtnNo: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  hireAgainBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  textArea: {
    ...typography.bodySmall,
    color: colors.text,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  charCounter: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  photosSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoWrapper: {
    position: 'relative',
  },
  photoPreview: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.borderLight,
  },
  photoRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 11,
  },
  addPhotoBtn: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  tipsInput: {
    ...typography.bodySmall,
    color: colors.text,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 60,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  previewBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  bottomBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  submitBtnDisabled: {
    backgroundColor: colors.borderMedium,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

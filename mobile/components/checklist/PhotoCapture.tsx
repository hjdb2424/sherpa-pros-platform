import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';

interface PhotoCaptureProps {
  onPhotoTaken: (uri: string) => void;
}

export default function PhotoCapture({ onPhotoTaken }: PhotoCaptureProps) {
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const launchCamera = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission',
        'Camera access is required to take checklist photos.',
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      setPreviewUri(result.assets[0].uri);
    }
  }, []);

  const launchLibrary = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Library Permission',
        'Photo library access is required to choose photos.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      setPreviewUri(result.assets[0].uri);
    }
  }, []);

  const handleRetake = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPreviewUri(null);
  }, []);

  const handleUsePhoto = useCallback(() => {
    if (!previewUri) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onPhotoTaken(previewUri);
    setPreviewUri(null);
  }, [previewUri, onPhotoTaken]);

  if (previewUri) {
    return (
      <View style={styles.card}>
        <Image source={{ uri: previewUri }} style={styles.preview} />
        <View style={styles.previewActions}>
          <Pressable style={styles.retakeButton} onPress={handleRetake}>
            <Text style={styles.retakeText}>Retake</Text>
          </Pressable>
          <Pressable style={styles.usePhotoButton} onPress={handleUsePhoto}>
            <Text style={styles.usePhotoText}>Use Photo</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Add Photo</Text>
      <Pressable style={styles.cameraButton} onPress={launchCamera}>
        <Text style={styles.cameraIcon}>{'\u{1F4F7}'}</Text>
        <Text style={styles.cameraText}>Take Photo</Text>
      </Pressable>
      <Pressable style={styles.libraryButton} onPress={launchLibrary}>
        <Text style={styles.libraryIcon}>{'\u{1F5BC}\uFE0F'}</Text>
        <Text style={styles.libraryText}>Choose from Library</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.sm,
    ...shadows.primaryGlow,
  },
  cameraIcon: {
    fontSize: 18,
  },
  cameraText: {
    ...typography.body,
    color: colors.textInverse,
    fontWeight: '600',
  },
  libraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  libraryIcon: {
    fontSize: 18,
  },
  libraryText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  previewActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  retakeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  retakeText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  usePhotoButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    ...shadows.primaryGlow,
  },
  usePhotoText: {
    ...typography.body,
    color: colors.textInverse,
    fontWeight: '600',
  },
});

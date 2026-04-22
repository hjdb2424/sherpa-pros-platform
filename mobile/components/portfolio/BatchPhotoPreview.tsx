import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COL_GAP = spacing.sm;
const GRID_PADDING = spacing.lg;
const THUMB_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - COL_GAP * 2) / 3;

interface BatchPhotoPreviewProps {
  visible: boolean;
  uris: string[];
  onClose: () => void;
  onApplyFilter: (uri: string) => void;
  onUpload: (uris: string[]) => void;
}

export default function BatchPhotoPreview({
  visible,
  uris: initialUris,
  onClose,
  onApplyFilter,
  onUpload,
}: BatchPhotoPreviewProps) {
  const [selectedUris, setSelectedUris] = useState<string[]>(initialUris);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Sync when uris change
  React.useEffect(() => {
    setSelectedUris(initialUris);
    setUploading(false);
    setUploadProgress(0);
  }, [initialUris]);

  const handleRemove = useCallback((uri: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedUris((prev) => {
      const next = prev.filter((u) => u !== uri);
      if (next.length === 0) {
        onClose();
      }
      return next;
    });
  }, [onClose]);

  const handleApplyFilter = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (selectedUris.length > 0) {
      onApplyFilter(selectedUris[0]);
    }
  }, [selectedUris, onApplyFilter]);

  const handleUpload = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUploading(true);
    setUploadProgress(0);

    // Mock upload: 1-second delay per photo
    for (let i = 0; i < selectedUris.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUploadProgress(i + 1);
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUploading(false);
    onUpload(selectedUris);
  }, [selectedUris, onUpload]);

  if (!visible || selectedUris.length === 0) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.title}>
              {selectedUris.length} photo{selectedUris.length !== 1 ? 's' : ''} selected
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Photo Grid */}
          <View style={styles.grid}>
            {selectedUris.map((uri) => (
              <View key={uri} style={styles.thumbContainer}>
                <Image source={{ uri }} style={styles.thumb} />
                <Pressable
                  style={styles.removeButton}
                  onPress={() => handleRemove(uri)}
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={22} color={colors.danger} />
                </Pressable>
              </View>
            ))}
          </View>

          {/* Upload Progress */}
          {uploading && (
            <View style={styles.progressRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.progressText}>
                Uploading {uploadProgress} of {selectedUris.length}...
              </Text>
              <View style={styles.progressBarOuter}>
                <View
                  style={[
                    styles.progressBarInner,
                    { width: `${(uploadProgress / selectedUris.length) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Actions */}
          {!uploading && (
            <View style={styles.actions}>
              <Pressable style={styles.filterButton} onPress={handleApplyFilter}>
                <Ionicons name="color-filter-outline" size={18} color={colors.primary} />
                <Text style={styles.filterButtonText}>Apply Filter to All</Text>
              </Pressable>

              <Pressable style={styles.uploadButton} onPress={handleUpload}>
                <Ionicons name="cloud-upload-outline" size={18} color={colors.textInverse} />
                <Text style={styles.uploadButtonText}>
                  Add {selectedUris.length} Photo{selectedUris.length !== 1 ? 's' : ''} to Portfolio
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: GRID_PADDING,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: COL_GAP,
    marginBottom: spacing.lg,
  },
  thumbContainer: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  thumb: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
    backgroundColor: colors.borderLight,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 11,
  },
  progressRow: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressBarOuter: {
    width: '100%',
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  actions: {
    gap: spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textInverse,
  },
});

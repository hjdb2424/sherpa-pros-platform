import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import {
  ColorMatrix,
  concatColorMatrices,
  brightness,
  contrast,
  saturate,
  hueRotate,
  sepia,
  grayscale,
  temperature,
  cool,
  warm,
  type Matrix,
} from 'react-native-color-matrix-image-filters';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';

interface PhotoFilterProps {
  imageUri: string;
  visible: boolean;
  onClose: () => void;
  onApply: (filteredUri: string, filterName: string) => void;
}

interface FilterDef {
  key: string;
  label: string;
  matrix: Matrix | null;
}

const FILTERS: FilterDef[] = [
  { key: 'original', label: 'Original', matrix: null },
  { key: 'cleanBuild', label: 'Clean Build', matrix: concatColorMatrices(brightness(1.1), contrast(1.15)) },
  { key: 'warmWood', label: 'Warm Wood', matrix: concatColorMatrices(temperature(0.1), saturate(1.2)) },
  { key: 'proShot', label: 'Pro Shot', matrix: concatColorMatrices(contrast(1.3), saturate(0.9)) },
  { key: 'blueprint', label: 'Blueprint', matrix: concatColorMatrices(cool(), saturate(0.85)) },
  { key: 'goldenHour', label: 'Golden Hour', matrix: concatColorMatrices(warm(), saturate(1.1), brightness(1.05)) },
  { key: 'crisp', label: 'Crisp', matrix: concatColorMatrices(contrast(1.25), brightness(1.08)) },
  { key: 'vintage', label: 'Vintage', matrix: concatColorMatrices(sepia(0.6), contrast(1.1)) },
  { key: 'bw', label: 'B&W', matrix: grayscale(1) },
  { key: 'moody', label: 'Moody', matrix: concatColorMatrices(brightness(0.85), contrast(1.35), saturate(0.8)) },
  { key: 'fresh', label: 'Fresh', matrix: concatColorMatrices(brightness(1.12), hueRotate(15), saturate(1.1)) },
  { key: 'sunset', label: 'Sunset', matrix: concatColorMatrices(temperature(0.2), saturate(1.15), brightness(1.05)) },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_SIZE = SCREEN_WIDTH - spacing.lg * 2;
const THUMB_SIZE = 72;

export default function PhotoFilter({
  imageUri,
  visible,
  onClose,
  onApply,
}: PhotoFilterProps) {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<string>('original');
  const [saving, setSaving] = useState(false);

  const handleSelectFilter = useCallback((key: string) => {
    Haptics.selectionAsync();
    setSelectedFilter(key);
  }, []);

  const handleApply = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);
    try {
      // For now, save the original image since color matrix filters are visual-only
      // In production, you would capture the filtered view as a screenshot
      const result = await manipulateAsync(
        imageUri,
        [],
        { compress: 0.9, format: SaveFormat.JPEG }
      );
      const filter = FILTERS.find((f) => f.key === selectedFilter);
      onApply(result.uri, filter?.label ?? 'Original');
    } catch {
      // Fallback: return original
      onApply(imageUri, 'Original');
    } finally {
      setSaving(false);
    }
  }, [imageUri, selectedFilter, onApply]);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFilter('original');
    onClose();
  }, [onClose]);

  const activeFilter = FILTERS.find((f) => f.key === selectedFilter);

  const renderFilterThumb = useCallback(
    ({ item }: { item: FilterDef }) => {
      const isSelected = item.key === selectedFilter;
      const thumb = (
        <Image source={{ uri: imageUri }} style={styles.thumbImage} />
      );

      return (
        <Pressable
          style={[styles.thumbItem, isSelected && styles.thumbItemSelected]}
          onPress={() => handleSelectFilter(item.key)}
        >
          <View style={[styles.thumbWrapper, isSelected && styles.thumbWrapperSelected]}>
            {item.matrix ? (
              <ColorMatrix matrix={item.matrix} style={styles.thumbFilter}>
                {thumb}
              </ColorMatrix>
            ) : (
              thumb
            )}
          </View>
          <Text
            style={[styles.thumbLabel, isSelected && styles.thumbLabelSelected]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
        </Pressable>
      );
    },
    [selectedFilter, imageUri, handleSelectFilter]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Apply Filter</Text>
          <Pressable
            onPress={handleApply}
            disabled={saving}
            style={[styles.applyButton, saving && styles.applyButtonDisabled]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.applyButtonText}>Apply</Text>
            )}
          </Pressable>
        </View>

        {/* Preview */}
        <View style={styles.previewContainer}>
          {activeFilter?.matrix ? (
            <ColorMatrix matrix={activeFilter.matrix}>
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            </ColorMatrix>
          ) : (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}
        </View>

        {/* Filter thumbnails */}
        <View style={[styles.filterBar, { paddingBottom: insets.bottom + spacing.md }]}>
          <FlatList
            horizontal
            data={FILTERS}
            keyExtractor={(item) => item.key}
            renderItem={renderFilterThumb}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    minWidth: 72,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.6,
  },
  applyButtonText: {
    ...typography.caption,
    color: '#ffffff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  previewImage: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: borderRadius.md,
  },
  filterBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  filterList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  thumbItem: {
    alignItems: 'center',
    width: THUMB_SIZE + 8,
    gap: 4,
  },
  thumbItemSelected: {},
  thumbWrapper: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbWrapperSelected: {
    borderColor: colors.primary,
  },
  thumbFilter: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  thumbImage: {
    width: THUMB_SIZE - 4,
    height: THUMB_SIZE - 4,
  },
  thumbLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: colors.textMuted,
    textAlign: 'center',
  },
  thumbLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
});

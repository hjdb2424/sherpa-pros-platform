import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_SIZE = 70;

interface PhotoFilterProps {
  imageUri: string;
  visible: boolean;
  onClose: () => void;
  onApply: (uri: string, filterName: string) => void;
}

// Simple filter definitions (visual-only, applied as tint overlays)
const FILTERS = [
  { id: 'original', name: 'Original', tint: null },
  { id: 'clean', name: 'Clean Build', tint: 'rgba(0, 169, 224, 0.08)' },
  { id: 'warm', name: 'Warm Wood', tint: 'rgba(255, 165, 0, 0.12)' },
  { id: 'pro', name: 'Pro Shot', tint: 'rgba(0, 0, 0, 0.1)' },
  { id: 'blueprint', name: 'Blueprint', tint: 'rgba(0, 100, 200, 0.15)' },
  { id: 'golden', name: 'Golden Hour', tint: 'rgba(255, 200, 50, 0.15)' },
  { id: 'crisp', name: 'Crisp', tint: 'rgba(255, 255, 255, 0.1)' },
  { id: 'vintage', name: 'Vintage', tint: 'rgba(180, 140, 80, 0.2)' },
  { id: 'bw', name: 'B&W', tint: 'rgba(128, 128, 128, 0.5)' },
  { id: 'moody', name: 'Moody', tint: 'rgba(30, 30, 50, 0.2)' },
  { id: 'fresh', name: 'Fresh', tint: 'rgba(100, 200, 100, 0.1)' },
  { id: 'sunset', name: 'Sunset', tint: 'rgba(255, 100, 50, 0.15)' },
];

export default function PhotoFilter({ imageUri, visible, onClose, onApply }: PhotoFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState('original');

  const handleSelect = useCallback((filterId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFilter(filterId);
  }, []);

  const handleApply = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const filter = FILTERS.find(f => f.id === selectedFilter);
    onApply(imageUri, filter?.name ?? 'Original');
  }, [imageUri, selectedFilter, onApply]);

  const currentFilter = FILTERS.find(f => f.id === selectedFilter);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Photo</Text>
          <Pressable onPress={handleApply} style={styles.applyBtn}>
            <Text style={styles.applyText}>Apply</Text>
          </Pressable>
        </View>

        {/* Preview */}
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
          {currentFilter?.tint && (
            <View style={[styles.filterOverlay, { backgroundColor: currentFilter.tint }]} />
          )}
        </View>

        {/* Filter thumbnails */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {FILTERS.map((filter) => (
            <Pressable
              key={filter.id}
              onPress={() => handleSelect(filter.id)}
              style={[
                styles.filterThumb,
                selectedFilter === filter.id && styles.filterThumbSelected,
              ]}
            >
              <View style={styles.filterPreview}>
                <Image source={{ uri: imageUri }} style={styles.filterImage} />
                {filter.tint && (
                  <View style={[styles.filterPreviewOverlay, { backgroundColor: filter.tint }]} />
                )}
              </View>
              <Text
                style={[
                  styles.filterName,
                  selectedFilter === filter.id && styles.filterNameSelected,
                ]}
                numberOfLines={1}
              >
                {filter.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  closeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#fff' },
  applyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  applyText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_WIDTH - 32,
    borderRadius: borderRadius.md,
  },
  filterOverlay: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    height: SCREEN_WIDTH - 32,
    borderRadius: borderRadius.md,
  },
  filterList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
    gap: spacing.md,
  },
  filterThumb: {
    alignItems: 'center',
    width: PREVIEW_SIZE,
  },
  filterThumbSelected: {},
  filterPreview: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterImage: {
    width: '100%',
    height: '100%',
  },
  filterPreviewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterName: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  filterNameSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});

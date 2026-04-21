import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 3;
const COLUMNS = 3;
const PHOTO_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - GRID_GAP * (COLUMNS - 1)) / COLUMNS;
const PHOTOS_PER_PLATFORM = 12;

interface PhotoImporterProps {
  platform: string;
  platformName: string;
  onImport: (count: number) => void;
  onClose?: () => void;
}

function getSeedBase(platform: string): number {
  switch (platform) {
    case 'google': return 100;
    case 'instagram': return 200;
    case 'facebook': return 300;
    case 'yelp': return 400;
    case 'nextdoor': return 500;
    default: return 600;
  }
}

export default function PhotoImporter({ platform, platformName, onImport, onClose }: PhotoImporterProps) {
  const seedBase = getSeedBase(platform);
  const photos = useMemo(
    () =>
      Array.from({ length: PHOTOS_PER_PLATFORM }, (_, i) => ({
        id: `${platform}-photo-${i}`,
        uri: `https://picsum.photos/300/300?random=${seedBase + i}`,
      })),
    [platform, seedBase],
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(new Set(photos.map((p) => p.id)));
  }, [photos]);

  const clearAll = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(new Set());
  }, []);

  const handleImport = useCallback(() => {
    if (selected.size === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Imported', `Imported ${selected.size} photos to your portfolio!`);
    onImport(selected.size);
  }, [selected, onImport]);

  const renderPhoto = useCallback(
    ({ item }: { item: { id: string; uri: string } }) => {
      const isSelected = selected.has(item.id);
      return (
        <Pressable onPress={() => toggleSelect(item.id)} style={s.photoWrapper}>
          <Image source={{ uri: item.uri }} style={s.photo} />
          <View style={[s.checkbox, isSelected && s.checkboxSelected]}>
            {isSelected && <Ionicons name="checkmark" size={14} color="#ffffff" />}
          </View>
          {isSelected && <View style={s.photoOverlay} />}
        </Pressable>
      );
    },
    [selected, toggleSelect],
  );

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          {onClose && (
            <Pressable onPress={onClose} style={s.closeButton}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          )}
          <Text style={s.title}>{platformName} Photos</Text>
        </View>
        <Text style={s.selectedCount}>{selected.size} selected</Text>
      </View>

      {/* Select / Clear buttons */}
      <View style={s.actionRow}>
        <Pressable style={s.actionPill} onPress={selectAll}>
          <Text style={s.actionPillText}>Select All</Text>
        </Pressable>
        <Pressable style={s.actionPill} onPress={clearAll}>
          <Text style={s.actionPillText}>Clear</Text>
        </Pressable>
      </View>

      {/* Grid */}
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        columnWrapperStyle={s.gridRow}
        contentContainerStyle={s.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Import button */}
      <View style={s.footer}>
        <Pressable
          style={[s.importButton, selected.size === 0 && s.importButtonDisabled]}
          onPress={handleImport}
          disabled={selected.size === 0}
        >
          <Text style={s.importButtonText}>
            Import {selected.size > 0 ? `${selected.size} Photos` : 'Photos'}
          </Text>
        </Pressable>
      </View>
    </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
  },
  selectedCount: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  actionPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  actionPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  gridContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  photoWrapper: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  checkbox: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 169, 224, 0.15)',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  importButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  importButtonDisabled: {
    backgroundColor: colors.borderMedium,
    shadowOpacity: 0,
  },
  importButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

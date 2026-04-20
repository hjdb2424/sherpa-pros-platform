import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/lib/theme';
import PhotoViewer from './PhotoViewer';
import type { PortfolioItem } from './types';

interface PortfolioGridProps {
  items: PortfolioItem[];
}

const GAP = 2;
const NUM_COLUMNS = 3;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CELL_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const handlePress = useCallback((item: PortfolioItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedItem(item);
    setViewerVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setViewerVisible(false);
    setSelectedItem(null);
  }, []);

  const handleToggleLike = useCallback((id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: PortfolioItem; index: number }) => {
      const isLastInRow = (index + 1) % NUM_COLUMNS === 0;
      return (
        <Pressable
          style={[
            styles.cell,
            { marginRight: isLastInRow ? 0 : GAP, marginBottom: GAP },
          ]}
          onPress={() => handlePress(item)}
        >
          <Image
            source={{ uri: item.imageUri }}
            style={styles.cellImage}
            resizeMode="cover"
          />

          {/* Like overlay */}
          <View style={styles.likeOverlay}>
            <Ionicons name="heart" size={10} color="#ffffff" />
            <Text style={styles.likeText}>{item.likes}</Text>
          </View>

          {/* Before/After badge */}
          {item.beforeUri && (
            <View style={styles.baBadge}>
              <Text style={styles.baBadgeText}>B/A</Text>
            </View>
          )}
        </Pressable>
      );
    },
    [handlePress]
  );

  const keyExtractor = useCallback((item: PortfolioItem) => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />

      <PhotoViewer
        item={selectedItem}
        visible={viewerVisible}
        onClose={handleClose}
        onToggleLike={handleToggleLike}
        isLiked={selectedItem ? likedIds.has(selectedItem.id) : false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  grid: {
    // no extra padding needed
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  cellImage: {
    width: '100%',
    height: '100%',
  },
  likeOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  likeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  baBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  baBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});

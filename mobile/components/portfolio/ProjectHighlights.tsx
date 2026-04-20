import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';
import { PORTFOLIO_CATEGORIES, type PortfolioItem } from './types';

interface ProjectHighlightsProps {
  items: PortfolioItem[];
  onAddPress: () => void;
}

const CIRCLE_SIZE = 70;
const STORY_AUTO_ADVANCE_MS = 3000;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface HighlightCategory {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  thumbnailUri: string | null;
  items: PortfolioItem[];
}

export default function ProjectHighlights({
  items,
  onAddPress,
}: ProjectHighlightsProps) {
  const [storyVisible, setStoryVisible] = useState(false);
  const [storyCategory, setStoryCategory] = useState<HighlightCategory | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  // Build category highlights from portfolio items
  const highlights: HighlightCategory[] = PORTFOLIO_CATEGORIES.map((cat) => {
    const catItems = items.filter((i) => i.category === cat.key);
    return {
      key: cat.key,
      label: cat.label,
      icon: cat.icon,
      thumbnailUri: catItems.length > 0 ? catItems[0].imageUri : null,
      items: catItems,
    };
  }).filter((cat) => cat.items.length > 0);

  // Auto-advance timer
  useEffect(() => {
    if (!storyVisible || !storyCategory) return;

    timerRef.current = setTimeout(() => {
      if (storyIndex < storyCategory.items.length - 1) {
        setStoryIndex((prev) => prev + 1);
      } else {
        setStoryVisible(false);
      }
    }, STORY_AUTO_ADVANCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [storyVisible, storyCategory, storyIndex]);

  const openStory = useCallback((cat: HighlightCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStoryCategory(cat);
    setStoryIndex(0);
    setStoryVisible(true);
  }, []);

  const handleStoryTap = useCallback(
    (side: 'left' | 'right') => {
      if (!storyCategory) return;
      if (timerRef.current) clearTimeout(timerRef.current);

      if (side === 'right') {
        if (storyIndex < storyCategory.items.length - 1) {
          setStoryIndex((prev) => prev + 1);
        } else {
          setStoryVisible(false);
        }
      } else {
        if (storyIndex > 0) {
          setStoryIndex((prev) => prev - 1);
        }
      }
    },
    [storyCategory, storyIndex]
  );

  const renderHighlight = useCallback(
    ({ item }: { item: HighlightCategory }) => (
      <Pressable style={styles.highlightItem} onPress={() => openStory(item)}>
        <View style={styles.highlightRing}>
          {item.thumbnailUri ? (
            <Image
              source={{ uri: item.thumbnailUri }}
              style={styles.highlightImage}
            />
          ) : (
            <View style={styles.highlightPlaceholder}>
              <Ionicons name={item.icon} size={28} color={colors.textMuted} />
            </View>
          )}
        </View>
        <Text style={styles.highlightLabel} numberOfLines={1}>
          {item.label}
        </Text>
      </Pressable>
    ),
    [openStory]
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={highlights}
        keyExtractor={(item) => item.key}
        renderItem={renderHighlight}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Pressable
            style={styles.highlightItem}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onAddPress();
            }}
          >
            <View style={styles.addCircle}>
              <Ionicons name="add" size={32} color="#ffffff" />
            </View>
            <Text style={styles.highlightLabel}>Add</Text>
          </Pressable>
        }
      />

      {/* Story viewer modal */}
      <Modal
        visible={storyVisible}
        animationType="fade"
        transparent
        statusBarTranslucent
        onRequestClose={() => setStoryVisible(false)}
      >
        <View style={styles.storyOverlay}>
          {storyCategory && storyCategory.items[storyIndex] && (
            <>
              {/* Progress bars */}
              <View style={[styles.progressRow, { top: insets.top + spacing.sm }]}>
                {storyCategory.items.map((_, idx) => (
                  <View key={idx} style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width:
                            idx < storyIndex
                              ? '100%'
                              : idx === storyIndex
                              ? '50%'
                              : '0%',
                        },
                      ]}
                    />
                  </View>
                ))}
              </View>

              {/* Category label + close */}
              <View style={[styles.storyHeader, { top: insets.top + spacing.xl }]}>
                <Text style={styles.storyTitle}>{storyCategory.label}</Text>
                <Pressable
                  onPress={() => setStoryVisible(false)}
                  hitSlop={12}
                >
                  <Ionicons name="close" size={28} color="#ffffff" />
                </Pressable>
              </View>

              {/* Story image */}
              <Image
                source={{ uri: storyCategory.items[storyIndex].imageUri }}
                style={styles.storyImage}
                resizeMode="cover"
              />

              {/* Title overlay */}
              <View style={[styles.storyFooter, { bottom: insets.bottom + spacing.xl }]}>
                <Text style={styles.storyItemTitle}>
                  {storyCategory.items[storyIndex].title}
                </Text>
                <Text style={styles.storyDate}>
                  {storyCategory.items[storyIndex].date}
                </Text>
              </View>

              {/* Tap zones */}
              <View style={styles.tapZones}>
                <Pressable
                  style={styles.tapZoneLeft}
                  onPress={() => handleStoryTap('left')}
                />
                <Pressable
                  style={styles.tapZoneRight}
                  onPress={() => handleStoryTap('right')}
                />
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  highlightItem: {
    alignItems: 'center',
    width: CIRCLE_SIZE + 8,
    gap: 4,
  },
  highlightRing: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2.5,
    borderColor: colors.primary,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightImage: {
    width: CIRCLE_SIZE - 8,
    height: CIRCLE_SIZE - 8,
    borderRadius: (CIRCLE_SIZE - 8) / 2,
  },
  highlightPlaceholder: {
    width: CIRCLE_SIZE - 8,
    height: CIRCLE_SIZE - 8,
    borderRadius: (CIRCLE_SIZE - 8) / 2,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  addCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Story viewer
  storyOverlay: {
    flex: 1,
    backgroundColor: '#000000',
  },
  progressRow: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    gap: 3,
    zIndex: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  storyHeader: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  storyTitle: {
    ...typography.subheading,
    color: '#ffffff',
  },
  storyImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  storyFooter: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
  },
  storyItemTitle: {
    ...typography.body,
    color: '#ffffff',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  storyDate: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  tapZones: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 5,
  },
  tapZoneLeft: {
    flex: 1,
  },
  tapZoneRight: {
    flex: 1,
  },
});

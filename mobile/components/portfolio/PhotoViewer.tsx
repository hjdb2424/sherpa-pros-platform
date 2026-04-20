import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';
import BeforeAfterSlider from './BeforeAfterSlider';
import type { PortfolioItem } from './types';

interface PhotoViewerProps {
  item: PortfolioItem | null;
  visible: boolean;
  onClose: () => void;
  onToggleLike: (id: string) => void;
  isLiked: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PhotoViewer({
  item,
  visible,
  onClose,
  onToggleLike,
  isLiked,
}: PhotoViewerProps) {
  const insets = useSafeAreaInsets();

  if (!item) return null;

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleLike(item.id);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const categoryColors: Record<string, string> = {
    kitchen: '#f59e0b',
    bathroom: '#3b82f6',
    deck: '#10b981',
    electrical: '#eab308',
    plumbing: '#6366f1',
    exterior: '#ec4899',
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Close button */}
        <Pressable
          style={[styles.closeButton, { top: insets.top + spacing.sm }]}
          onPress={handleClose}
          hitSlop={12}
        >
          <Ionicons name="close" size={28} color="#ffffff" />
        </Pressable>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 60, paddingBottom: insets.bottom + spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Main image */}
          <Image
            source={{ uri: item.imageUri }}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Title and category */}
          <View style={styles.infoRow}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{item.title}</Text>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: categoryColors[item.category] ?? colors.primary },
                ]}
              >
                <Text style={styles.categoryText}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={styles.date}>{item.date}</Text>
          </View>

          {/* Like button */}
          <Pressable style={styles.likeRow} onPress={handleLike}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={isLiked ? colors.danger : '#ffffff'}
            />
            <Text style={styles.likeCount}>{item.likes + (isLiked ? 1 : 0)}</Text>
          </Pressable>

          {/* Before/After slider */}
          {item.beforeUri && (
            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>Before / After Comparison</Text>
              <BeforeAfterSlider
                beforeUri={item.beforeUri}
                afterUri={item.imageUri}
                height={250}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  closeButton: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  mainImage: {
    width: SCREEN_WIDTH - spacing.lg * 2,
    height: SCREEN_WIDTH - spacing.lg * 2,
    borderRadius: borderRadius.md,
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
  },
  titleSection: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    ...typography.subheading,
    color: '#ffffff',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  date: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
    marginTop: spacing.lg,
  },
  likeCount: {
    ...typography.body,
    color: '#ffffff',
    fontWeight: '600',
  },
  sliderSection: {
    width: '100%',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  sliderLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

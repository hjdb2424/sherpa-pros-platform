import React, { useCallback } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { borderRadius } from '@/lib/theme';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TaggedWorkBadgeProps {
  taggedBy: string;
  role: 'client' | 'pro';
  description: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TaggedWorkBadge({
  taggedBy,
  role,
  description,
}: TaggedWorkBadgeProps) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      `Tagged by ${taggedBy}`,
      `${description}\n\nTagged as: ${role === 'pro' ? 'Collaborating Pro' : 'Client'}`,
    );
  }, [taggedBy, role, description]);

  return (
    <Pressable style={s.badge} onPress={handlePress}>
      <Ionicons
        name={role === 'pro' ? 'person' : 'people'}
        size={10}
        color="#ffffff"
      />
      <Text style={s.badgeText} numberOfLines={1}>
        Tagged by {taggedBy}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const s = StyleSheet.create({
  badge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
});

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Avatar from '@/components/common/Avatar';
import type { Tag } from './TaggingSystem';

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

export const PENDING_TAGS: Tag[] = [
  {
    id: 't1',
    taggedProId: 'me',
    taggedProName: 'Mike Rodriguez',
    taggedProInitials: 'MR',
    taggedByName: 'Tom Anderson',
    taggedByRole: 'client',
    description: 'Kitchen faucet replacement',
    status: 'pending',
    createdAt: 'Apr 18',
  },
  {
    id: 't2',
    taggedProId: 'me',
    taggedProName: 'Mike Rodriguez',
    taggedProInitials: 'MR',
    taggedByName: 'Sarah Chen',
    taggedByRole: 'pro',
    description: 'Collaborated on bathroom remodel \u2014 plumbing rough-in',
    status: 'pending',
    createdAt: 'Apr 15',
  },
  {
    id: 't3',
    taggedProId: 'me',
    taggedProName: 'Mike Rodriguez',
    taggedProInitials: 'MR',
    taggedByName: 'Lisa Martinez',
    taggedByRole: 'client',
    description: 'Emergency water heater replacement',
    status: 'pending',
    createdAt: 'Apr 12',
  },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TagApprovalListProps {
  tags: Tag[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TagApprovalList({ tags: initialTags }: TagApprovalListProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [expanded, setExpanded] = useState(false);

  const pendingTags = tags.filter((t) => t.status === 'pending');

  const handleApprove = useCallback((tagId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    Alert.alert('Tag Approved', 'This will appear on your portfolio.');
  }, []);

  const handleDecline = useCallback((tagId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTags((prev) => prev.filter((t) => t.id !== tagId));
  }, []);

  const handleToggleExpand = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded((prev) => !prev);
  }, []);

  if (pendingTags.length === 0) return null;

  // Collapsed: just show count banner
  if (!expanded) {
    return (
      <Pressable style={s.banner} onPress={handleToggleExpand}>
        <View style={s.bannerIconBox}>
          <Ionicons name="pricetags" size={18} color={colors.primary} />
        </View>
        <View style={s.bannerContent}>
          <Text style={s.bannerTitle}>
            {pendingTags.length} tag request{pendingTags.length !== 1 ? 's' : ''} pending
          </Text>
          <Text style={s.bannerSubtitle}>Tap to review</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
    );
  }

  // Expanded: show all pending tag cards
  return (
    <View style={s.container}>
      <Pressable style={s.headerRow} onPress={handleToggleExpand}>
        <View style={s.headerLeft}>
          <Ionicons name="pricetags" size={18} color={colors.primary} />
          <Text style={s.headerTitle}>
            Tag Requests ({pendingTags.length})
          </Text>
        </View>
        <Ionicons name="chevron-up" size={18} color={colors.textMuted} />
      </Pressable>

      {pendingTags.map((tag) => (
        <View key={tag.id} style={s.tagCard}>
          <View style={s.tagCardHeader}>
            <Avatar
              initials={tag.taggedByName
                .split(' ')
                .map((w) => w[0])
                .join('')}
              size={36}
              color={tag.taggedByRole === 'pro' ? colors.primary : colors.accent}
            />
            <View style={s.tagCardInfo}>
              <Text style={s.tagCardName}>{tag.taggedByName}</Text>
              <View style={s.tagCardMeta}>
                <View
                  style={[
                    s.roleBadge,
                    {
                      backgroundColor:
                        tag.taggedByRole === 'pro'
                          ? colors.primaryLight
                          : '#fef3c7',
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.roleBadgeText,
                      {
                        color:
                          tag.taggedByRole === 'pro'
                            ? colors.primary
                            : '#b8860b',
                      },
                    ]}
                  >
                    {tag.taggedByRole === 'pro' ? 'Pro' : 'Client'}
                  </Text>
                </View>
                <Text style={s.tagCardDate}>{tag.createdAt}</Text>
              </View>
            </View>
          </View>

          <Text style={s.tagCardDescription}>{tag.description}</Text>

          <View style={s.tagCardActions}>
            <Pressable
              style={s.approveButton}
              onPress={() => handleApprove(tag.id)}
            >
              <Ionicons name="checkmark" size={16} color="#ffffff" />
              <Text style={s.approveButtonText}>Approve</Text>
            </Pressable>
            <Pressable
              style={s.declineButton}
              onPress={() => handleDecline(tag.id)}
            >
              <Text style={s.declineButtonText}>Decline</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const s = StyleSheet.create({
  // Collapsed banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  bannerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },

  // Expanded container
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },

  // Tag card
  tagCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tagCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  tagCardInfo: {
    flex: 1,
  },
  tagCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tagCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  tagCardDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  tagCardDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },

  // Action buttons
  tagCardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#10b981',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  approveButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  declineButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  declineButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
});

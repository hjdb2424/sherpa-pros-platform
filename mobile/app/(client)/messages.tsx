import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';
import Avatar from '@/components/common/Avatar';

interface Conversation {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatarColor: string;
  isOnline?: boolean;
  isSentByMe?: boolean;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Mike Thompson',
    initials: 'MT',
    lastMessage: 'I\'ll be there tomorrow at 9am to start the faucet repair. Please make sure the water main...',
    timestamp: '2m ago',
    unreadCount: 2,
    avatarColor: colors.primary,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    initials: 'SC',
    lastMessage: 'The deck staining is complete! Here are some photos of the finished work.',
    timestamp: '1h ago',
    unreadCount: 0,
    avatarColor: colors.success,
    isOnline: true,
    isSentByMe: true,
  },
  {
    id: '3',
    name: 'Carlos Rodriguez',
    initials: 'CR',
    lastMessage: 'Thanks for accepting my bid. I can start the electrical work on Monday.',
    timestamp: '3h ago',
    unreadCount: 1,
    avatarColor: colors.warning,
    isOnline: false,
  },
  {
    id: '4',
    name: 'James Wilson',
    initials: 'JW',
    lastMessage: 'Sure, I can provide a detailed breakdown of the HVAC maintenance costs.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    avatarColor: colors.accent,
    isOnline: false,
    isSentByMe: true,
  },
];

export default function ClientMessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleConversationPress = useCallback((conversation: Conversation) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/(client)/chat',
      params: {
        conversationId: conversation.id,
        name: conversation.name,
        initials: conversation.initials,
      },
    });
  }, [router]);

  const renderConversation = useCallback(
    ({ item }: { item: Conversation }) => (
      <Pressable
        style={styles.conversationRow}
        onPress={() => handleConversationPress(item)}
      >
        <View style={styles.avatarContainer}>
          <Avatar initials={item.initials} size={48} color={item.avatarColor} />
          <View style={[styles.onlineDot, { backgroundColor: item.isOnline ? colors.success : colors.borderMedium }]} />
        </View>
        {item.unreadCount > 0 && <View style={styles.unreadDot} />}
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.conversationName, item.unreadCount > 0 && styles.conversationNameBold]}>{item.name}</Text>
            <Text style={styles.conversationTime}>{item.timestamp}</Text>
          </View>
          <View style={styles.conversationFooter}>
            <Text style={[styles.conversationMessage, item.unreadCount > 0 && styles.conversationMessageUnread]} numberOfLines={1}>
              {item.isSentByMe ? 'You: ' : ''}{item.lastMessage}
            </Text>
          </View>
        </View>
      </Pressable>
    ),
    [handleConversationPress],
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{'\u{1F4AC}'}</Text>
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptyDescription}>
        When you connect with a pro, your conversations will appear here.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <FlatList
        data={CONVERSATIONS}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          CONVERSATIONS.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.text,
  },
  listContent: {
    paddingBottom: 100,
  },
  listContentEmpty: {
    flex: 1,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.background,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 6,
  },
  conversationContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  conversationNameBold: {
    fontWeight: '700',
  },
  conversationTime: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.textMuted,
  },
  conversationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversationMessage: {
    ...typography.bodySmall,
    color: colors.textMuted,
    flex: 1,
    marginRight: spacing.sm,
  },
  conversationMessageUnread: {
    color: colors.text,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.lg + 48 + spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

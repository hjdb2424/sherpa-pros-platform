import { useState, useCallback, useEffect } from 'react';
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
import { colors, spacing, typography } from '@/lib/theme';
import Avatar from '@/components/common/Avatar';
import SkeletonCard from '@/components/common/SkeletonCard';
import { apiFetch } from '@/lib/api';

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
    name: 'John Davidson',
    initials: 'JD',
    lastMessage: 'Great, the bathroom remodel timeline works. Can you send the material list?',
    timestamp: '5m ago',
    unreadCount: 1,
    avatarColor: '#6366f1',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Maria Santos',
    initials: 'MS',
    lastMessage: 'The fence looks amazing! Thank you so much for the great work.',
    timestamp: '2h ago',
    unreadCount: 0,
    avatarColor: colors.success,
    isOnline: false,
    isSentByMe: true,
  },
  {
    id: '3',
    name: 'Robert Kim',
    initials: 'RK',
    lastMessage: 'When can you start on the kitchen cabinets?',
    timestamp: '5h ago',
    unreadCount: 3,
    avatarColor: colors.warning,
    isOnline: true,
  },
];

export default function ProMessagesScreen() {
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
      pathname: '/(pro)/chat',
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
        When a client accepts your bid, you can chat with them here.
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

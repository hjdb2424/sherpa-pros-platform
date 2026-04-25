import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
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
  jobTitle?: string;
  role?: string;
  deliveryMethod?: string;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    name: 'John Davidson',
    initials: 'JD',
    lastMessage: 'Looks amazing! Thank you so much. Left you a 5-star review.',
    timestamp: '5m',
    unreadCount: 1,
    avatarColor: '#0ea5e9',
    isOnline: true,
    jobTitle: 'Kitchen Faucet Replacement',
    role: 'Client',
  },
  {
    id: 'conv-6',
    name: 'John Davidson',
    initials: 'JD',
    lastMessage: "You'll need to be home for the inspection afterward.",
    timestamp: '12h',
    unreadCount: 0,
    avatarColor: '#0ea5e9',
    isOnline: true,
    isSentByMe: true,
    jobTitle: 'Electrical Panel Upgrade',
    role: 'Client',
  },
  {
    id: 'conv-7',
    name: 'Lisa Park',
    initials: 'LP',
    lastMessage: 'Can you send photos of the burst pipe for our records?',
    timestamp: '45m',
    unreadCount: 1,
    avatarColor: '#14b8a6',
    isOnline: true,
    jobTitle: 'Invoice Discussion #1247',
    role: 'PM',
  },
  {
    id: 'conv-2',
    name: 'Lisa Park',
    initials: 'LP',
    lastMessage: "Great work. I'll approve the invoice. Same rate as usual?",
    timestamp: '2h',
    unreadCount: 1,
    avatarColor: '#14b8a6',
    isOnline: true,
    jobTitle: 'WO: Leaking Faucet — 4B',
    role: 'PM',
  },
  {
    id: 'conv-3',
    name: 'Robert Kim',
    initials: 'RK',
    lastMessage: "Deal! When can you start?",
    timestamp: '1d',
    unreadCount: 0,
    avatarColor: '#f97316',
    isOnline: true,
    isSentByMe: false,
    jobTitle: 'Deck Staining — 400 sqft',
    role: 'Client',
  },
];

export default function ProMessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiFetch<any>('/chat?userId=pro-mike')
      .then((data) => {
        if (data.conversations?.length > 0) {
          const mapped = data.conversations.map((c: any) => ({
            id: c.id,
            name: c.otherParticipant?.name ?? c.jobTitle,
            initials: c.otherParticipant?.initials ?? c.jobTitle?.charAt(0) ?? '?',
            lastMessage: c.lastMessage?.text ?? 'No messages yet',
            timestamp: c.lastMessage ? formatRelative(c.lastMessage.timestamp) : '',
            unreadCount: c.unreadCount ?? 0,
            avatarColor: c.otherParticipant?.avatarColor ?? colors.primary,
            isOnline: c.otherParticipant?.isOnline ?? false,
            isSentByMe: c.lastMessage?.senderId === 'pro-mike',
            jobTitle: c.jobTitle,
            role: c.otherParticipant?.role === 'pm' ? 'PM' : 'Client',
            deliveryMethod: c.lastMessage?.deliveryMethod,
          }));
          setConversations(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    apiFetch<any>('/chat?userId=pro-mike')
      .then((data) => {
        if (data.conversations?.length > 0) {
          const mapped = data.conversations.map((c: any) => ({
            id: c.id,
            name: c.otherParticipant?.name ?? c.jobTitle,
            initials: c.otherParticipant?.initials ?? '?',
            lastMessage: c.lastMessage?.text ?? 'No messages yet',
            timestamp: c.lastMessage ? formatRelative(c.lastMessage.timestamp) : '',
            unreadCount: c.unreadCount ?? 0,
            avatarColor: c.otherParticipant?.avatarColor ?? colors.primary,
            isOnline: c.otherParticipant?.isOnline ?? false,
            isSentByMe: c.lastMessage?.senderId === 'pro-mike',
            jobTitle: c.jobTitle,
            role: c.otherParticipant?.role === 'pm' ? 'PM' : 'Client',
          }));
          setConversations(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setRefreshing(false));
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

  const filtered = search.trim()
    ? conversations.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.jobTitle?.toLowerCase().includes(search.toLowerCase()) ?? false),
      )
    : conversations;

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
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
              <Text style={[styles.conversationName, item.unreadCount > 0 && styles.conversationNameBold]} numberOfLines={1}>{item.name}</Text>
              {item.role && (
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{item.role}</Text>
                </View>
              )}
            </View>
            <Text style={styles.conversationTime}>{item.timestamp}</Text>
          </View>
          {item.jobTitle && (
            <Text style={styles.jobTitle} numberOfLines={1}>{item.jobTitle}</Text>
          )}
          <View style={styles.conversationFooter}>
            <Text style={[styles.conversationMessage, item.unreadCount > 0 && styles.conversationMessageUnread]} numberOfLines={1}>
              {item.isSentByMe ? 'You: ' : ''}{item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount > 99 ? '99+' : item.unreadCount}</Text>
              </View>
            )}
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

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#a1a1aa"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <SkeletonCard count={3} />
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            filtered.length === 0 && styles.listContentEmpty,
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
      )}
    </View>
  );
}

function formatRelative(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  if (hrs < 24) return `${hrs}h`;
  if (days === 1) return 'Yesterday';
  return `${days}d`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 0,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.text,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchInput: {
    backgroundColor: '#f4f4f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
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
  conversationContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  conversationName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
  },
  conversationNameBold: {
    fontWeight: '700',
  },
  roleBadge: {
    backgroundColor: '#f4f4f5',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#71717a',
  },
  conversationTime: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.textMuted,
    marginLeft: 8,
  },
  jobTitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
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
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#00a9e0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
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

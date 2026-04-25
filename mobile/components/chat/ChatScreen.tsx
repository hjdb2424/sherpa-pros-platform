import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Linking,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/lib/theme';
import Avatar from '@/components/common/Avatar';
import { apiFetch } from '@/lib/api';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
  deliveryMethod?: 'app' | 'sms' | 'both';
  senderName?: string;
  attachments?: { type: 'photo'; url: string; caption?: string }[];
}

interface ChatScreenProps {
  conversationId: string;
  recipientName: string;
  recipientInitials: string;
  recipientRole?: string;
  recipientPhone?: string;
  isOnline?: boolean;
}

function getInitialMessages(): ChatMessage[] {
  return [
    { id: '1', text: 'Hi, I saw your profile. Are you available for a kitchen faucet replacement this week?', sender: 'me', timestamp: '10:15 AM', deliveryMethod: 'both' },
    { id: '2', text: 'Hey! Yes I am. What kind of faucet are you looking at? Do you have one already or do you need me to source it?', sender: 'them', timestamp: '10:18 AM', deliveryMethod: 'both' },
    { id: '3', text: 'I already bought a Moen pull-down from Home Depot. I just need the install.', sender: 'me', timestamp: '10:20 AM', deliveryMethod: 'app' },
    { id: '4', text: 'Perfect, that makes it straightforward. I can come by Thursday around 2pm. Usually takes about an hour. $150 for the install.', sender: 'them', timestamp: '10:23 AM', deliveryMethod: 'sms' },
    { id: '5', text: 'Thursday at 2 works! Do I need to turn off the water beforehand?', sender: 'me', timestamp: '10:25 AM', deliveryMethod: 'app' },
    { id: '6', text: 'Nope, I\'ll handle everything. Just make sure the area under the sink is clear. See you Thursday!', sender: 'them', timestamp: '10:27 AM', deliveryMethod: 'both' },
  ];
}

export default function ChatScreen({
  conversationId,
  recipientName,
  recipientInitials,
  recipientRole,
  recipientPhone,
  isOnline = false,
}: ChatScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);
  const typingDots = useRef(new Animated.Value(0)).current;

  // Fetch messages from API
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    apiFetch<any>(`/chat/${conversationId}`)
      .then((data) => {
        if (data.messages?.length > 0) {
          const mapped: ChatMessage[] = data.messages.map((m: any) => ({
            id: m.id,
            text: m.text ?? m.body ?? '',
            sender: m.senderId?.includes('pro') ? 'them' : 'me',
            timestamp: new Date(m.timestamp ?? m.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            deliveryMethod: m.deliveryMethod,
            senderName: m.senderName,
            attachments: m.attachments,
          }));
          setMessages(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [conversationId]);

  const handleSend = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      text: trimmed,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryMethod: 'app',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Send via API
    apiFetch<any>(`/chat/${conversationId}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: 'current-user', body: trimmed }),
    }).catch(() => {});

    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [inputText, conversationId]);

  const handleCall = useCallback(() => {
    if (recipientPhone) {
      Linking.openURL(`tel:${recipientPhone}`);
    }
  }, [recipientPhone]);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isMine = item.sender === 'me';
      return (
        <View
          style={[
            styles.messageBubbleRow,
            isMine ? styles.messageBubbleRowRight : styles.messageBubbleRowLeft,
          ]}
        >
          <View style={{ maxWidth: '78%' }}>
            {/* Attachments placeholder */}
            {item.attachments?.map((att, i) => (
              <View
                key={i}
                style={[
                  styles.attachmentPlaceholder,
                  isMine ? { borderBottomRightRadius: 4 } : { borderBottomLeftRadius: 4 },
                ]}
              >
                <Text style={styles.attachmentText}>{att.caption ?? 'Photo'}</Text>
              </View>
            ))}

            {/* Message bubble */}
            <View
              style={[
                styles.messageBubble,
                isMine ? styles.messageBubbleMine : styles.messageBubbleTheirs,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isMine ? styles.messageTextMine : styles.messageTextTheirs,
                ]}
              >
                {item.text}
              </Text>
            </View>

            {/* Footer: time + delivery */}
            <View style={[styles.messageFooter, isMine ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]}>
              <Text
                style={[
                  styles.messageTimestamp,
                  isMine ? styles.messageTimestampMine : styles.messageTimestampTheirs,
                ]}
              >
                {item.timestamp}
              </Text>
              {item.deliveryMethod && item.deliveryMethod !== 'app' && (
                <View style={styles.smsBadge}>
                  <Text style={styles.smsBadgeText}>
                    {item.deliveryMethod === 'sms' ? 'SMS' : 'SMS synced'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      );
    },
    [],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </Pressable>
        <View style={styles.headerAvatarContainer}>
          <Avatar initials={recipientInitials} size={36} color={colors.primary} />
          <View style={[styles.headerOnlineDot, { backgroundColor: isOnline ? colors.success : colors.borderMedium }]} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{recipientName}</Text>
          {recipientRole && (
            <Text style={styles.headerRole}>{recipientRole}</Text>
          )}
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerAction} onPress={handleCall}>
            <Text style={styles.headerActionIcon}>{'\u{1F4DE}'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          listRef.current?.scrollToEnd({ animated: false });
        }}
      />

      {/* Input area */}
      <View style={[styles.inputArea, { paddingBottom: insets.bottom + 8 }]}>
        {/* Attach button */}
        <Pressable style={styles.attachButton}>
          <Text style={styles.attachIcon}>{'\u{1F4F7}'}</Text>
        </Pressable>

        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#a1a1aa"
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>{'\u2191'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
    gap: 10,
  },
  backButton: {
    marginRight: 4,
  },
  backArrow: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
  },
  headerAvatarContainer: {
    position: 'relative',
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.background,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  headerRole: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionIcon: {
    fontSize: 18,
  },

  // Messages
  messagesList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 6,
  },
  messageBubbleRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  messageBubbleRowRight: {
    justifyContent: 'flex-end',
  },
  messageBubbleRowLeft: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageBubbleMine: {
    backgroundColor: '#00a9e0',
    borderBottomRightRadius: 4,
  },
  messageBubbleTheirs: {
    backgroundColor: '#f4f4f5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextMine: {
    color: '#ffffff',
  },
  messageTextTheirs: {
    color: '#18181b',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  messageTimestamp: {
    fontSize: 10,
  },
  messageTimestampMine: {
    color: '#a1a1aa',
    textAlign: 'right',
  },
  messageTimestampTheirs: {
    color: '#a1a1aa',
  },
  smsBadge: {
    backgroundColor: '#f4f4f5',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  smsBadgeText: {
    fontSize: 8,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  attachmentPlaceholder: {
    width: 160,
    height: 100,
    backgroundColor: '#e4e4e7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  attachmentText: {
    fontSize: 11,
    color: '#a1a1aa',
  },

  // Input
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
    gap: 8,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  attachIcon: {
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f4f4f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00a9e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#d4d4d8',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});

import { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';
import Avatar from '@/components/common/Avatar';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

interface ChatScreenProps {
  conversationId: string;
  recipientName: string;
  recipientInitials: string;
}

function getInitialMessages(): ChatMessage[] {
  return [
    { id: '1', text: 'Hi, I saw your profile. Are you available for a kitchen faucet replacement this week?', sender: 'me', timestamp: '10:15 AM' },
    { id: '2', text: 'Hey! Yes I am. What kind of faucet are you looking at? Do you have one already or do you need me to source it?', sender: 'them', timestamp: '10:18 AM' },
    { id: '3', text: 'I already bought a Moen pull-down from Home Depot. I just need the install.', sender: 'me', timestamp: '10:20 AM' },
    { id: '4', text: 'Perfect, that makes it straightforward. I can come by Thursday around 2pm. Usually takes about an hour.', sender: 'them', timestamp: '10:23 AM' },
    { id: '5', text: 'That works! Do I need to turn off the water beforehand?', sender: 'me', timestamp: '10:25 AM' },
    { id: '6', text: 'Nope, I\'ll handle everything. Just make sure the area under the sink is clear. See you Thursday!', sender: 'them', timestamp: '10:27 AM' },
  ];
}

export default function ChatScreen({
  recipientName,
  recipientInitials,
}: ChatScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [inputText, setInputText] = useState('');
  const listRef = useRef<FlatList>(null);

  const handleSend = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Scroll to bottom
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [inputText]);

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
            <Text
              style={[
                styles.messageTimestamp,
                isMine ? styles.messageTimestampMine : styles.messageTimestampTheirs,
              ]}
            >
              {item.timestamp}
            </Text>
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
        <Avatar initials={recipientInitials} size={36} color={colors.primary} />
        <Text style={styles.headerName}>{recipientName}</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Input area */}
      <View style={[styles.inputArea, { paddingBottom: insets.bottom + 8 }]}>
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
  headerName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },

  // Messages
  messagesList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 8,
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
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageBubbleMine: {
    backgroundColor: colors.primary,
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
  messageTimestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  messageTimestampMine: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  messageTimestampTheirs: {
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
    backgroundColor: colors.primary,
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

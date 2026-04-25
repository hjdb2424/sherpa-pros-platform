import { useLocalSearchParams } from 'expo-router';
import ChatScreen from '@/components/chat/ChatScreen';

export default function PMChatScreen() {
  const { conversationId, name, initials } = useLocalSearchParams<{
    conversationId: string;
    name: string;
    initials: string;
  }>();

  return (
    <ChatScreen
      conversationId={conversationId ?? '1'}
      recipientName={name ?? 'Unknown'}
      recipientInitials={initials ?? '??'}
      recipientRole="Pro"
    />
  );
}

/**
 * Sherpa Pros Platform — Chat Service
 *
 * High-level chat service that wraps the communication service and provides
 * a unified API for the UI. Returns mock data when Twilio is not configured.
 */

import { communicationService } from './index';
import type {
  MockConversation,
  MockMessage,
  MockParticipant,
  DeliveryMethod,
} from '@/lib/mock-data/chat-data';
import {
  MOCK_CONVERSATIONS,
  MOCK_PARTICIPANTS,
  getConversationsForUser as getMockConversationsForUser,
  getOtherParticipant,
  getUnreadCount,
  getLastMessage,
} from '@/lib/mock-data/chat-data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatParticipant {
  id: string;
  name: string;
  initials: string;
  role: 'pro' | 'client' | 'pm';
  phone?: string;
  isOnline: boolean;
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'pro' | 'client' | 'pm';
  text: string;
  timestamp: string;
  readBy: string[];
  deliveryMethod: DeliveryMethod;
  attachments?: { type: 'photo'; url: string; caption?: string }[];
}

export interface ChatConversation {
  id: string;
  participants: ChatParticipant[];
  jobId: string;
  jobTitle: string;
  status: 'active' | 'closed' | 'archived';
  createdAt: string;
  lastMessage: ChatMessage | null;
  unreadCount: number;
  otherParticipant: ChatParticipant | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const isMockMode = !process.env.TWILIO_ACCOUNT_SID;

function toParticipant(p: MockParticipant): ChatParticipant {
  return { ...p };
}

function toMessage(m: MockMessage): ChatMessage {
  return {
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    senderName: m.senderName,
    senderRole: m.senderRole,
    text: m.text,
    timestamp: m.timestamp,
    readBy: m.readBy,
    deliveryMethod: m.deliveryMethod,
    attachments: m.attachments,
  };
}

function toConversationSummary(
  conv: MockConversation,
  userId: string,
): ChatConversation {
  const last = getLastMessage(conv);
  const other = getOtherParticipant(conv, userId);
  return {
    id: conv.id,
    participants: conv.participants.map(toParticipant),
    jobId: conv.jobId,
    jobTitle: conv.jobTitle,
    status: conv.status,
    createdAt: conv.createdAt,
    lastMessage: last ? toMessage(last) : null,
    unreadCount: getUnreadCount(conv, userId),
    otherParticipant: other ? toParticipant(other) : null,
  };
}

// ---------------------------------------------------------------------------
// In-memory store for new messages sent during this session (mock mode)
// ---------------------------------------------------------------------------

const sessionMessages = new Map<string, MockMessage[]>();

function getFullMessages(conversationId: string): MockMessage[] {
  const conv = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  const base = conv?.messages ?? [];
  const session = sessionMessages.get(conversationId) ?? [];
  return [...base, ...session];
}

// ---------------------------------------------------------------------------
// Chat Service API
// ---------------------------------------------------------------------------

/**
 * Get all conversations for a user.
 */
export async function getConversations(
  userId: string,
  _role?: string,
): Promise<ChatConversation[]> {
  if (isMockMode) {
    const convs = getMockConversationsForUser(userId);
    return convs.map((c) => toConversationSummary(c, userId));
  }

  // Production path — use the communication service
  const convs = await communicationService.getConversationsForUser(userId);
  return convs.map((c) => ({
    id: c.id,
    participants: [],
    jobId: c.jobId,
    jobTitle: `Job ${c.jobId}`,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    lastMessage: null,
    unreadCount: 0,
    otherParticipant: null,
  }));
}

/**
 * Get messages in a conversation.
 */
export async function getMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  if (isMockMode) {
    const messages = getFullMessages(conversationId);
    return messages.map(toMessage);
  }

  const msgs = await communicationService.getMessages(conversationId);
  return msgs.map((m) => ({
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    senderName: 'Unknown',
    senderRole: 'client' as const,
    text: m.body,
    timestamp: m.createdAt.toISOString(),
    readBy: m.readAt ? [m.senderId] : [],
    deliveryMethod: 'app' as DeliveryMethod,
  }));
}

/**
 * Send a message in a conversation. Also triggers Twilio SMS in production mode.
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string,
  attachments?: { type: 'photo'; url: string; caption?: string }[],
): Promise<ChatMessage> {
  if (isMockMode) {
    const sender = MOCK_PARTICIPANTS[senderId];
    const msg: MockMessage = {
      id: `msg-session-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      conversationId,
      senderId,
      senderName: sender?.name ?? 'You',
      senderRole: sender?.role ?? 'client',
      text,
      timestamp: new Date().toISOString(),
      readBy: [senderId],
      deliveryMethod: 'app',
      attachments,
    };

    const existing = sessionMessages.get(conversationId) ?? [];
    existing.push(msg);
    sessionMessages.set(conversationId, existing);

    return toMessage(msg);
  }

  // Production: send via communication service (which triggers Twilio)
  const result = await communicationService.sendMessage(
    conversationId,
    senderId,
    text,
  );

  return {
    id: result.id,
    conversationId: result.conversationId,
    senderId: result.senderId,
    senderName: 'You',
    senderRole: 'client',
    text: result.body,
    timestamp: result.createdAt.toISOString(),
    readBy: [result.senderId],
    deliveryMethod: 'both',
    attachments,
  };
}

/**
 * Create a new conversation between participants.
 */
export async function createConversation(
  participants: { id: string; role: string; name: string; phone?: string }[],
  jobId: string,
  jobTitle: string,
): Promise<ChatConversation> {
  if (isMockMode) {
    const newConv: MockConversation = {
      id: `conv-session-${Date.now()}`,
      participants: participants.map((p) => ({
        id: p.id,
        name: p.name,
        initials: p.name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        role: p.role as 'pro' | 'client' | 'pm',
        phone: p.phone,
        isOnline: true,
        avatarColor: '#6366f1',
      })),
      jobId,
      jobTitle,
      status: 'active',
      createdAt: new Date().toISOString(),
      messages: [],
    };

    // Add to the mock conversations list (runtime only)
    MOCK_CONVERSATIONS.push(newConv);

    return toConversationSummary(newConv, participants[0].id);
  }

  const pro = participants.find((p) => p.role === 'pro');
  const client = participants.find((p) => p.role === 'client' || p.role === 'pm');

  const conv = await communicationService.createConversation(
    jobId,
    pro?.id ?? participants[0].id,
    client?.id ?? participants[1].id,
  );

  return {
    id: conv.id,
    participants: participants.map((p) => ({
      id: p.id,
      name: p.name,
      initials: p.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2),
      role: p.role as 'pro' | 'client' | 'pm',
      phone: p.phone,
      isOnline: true,
      avatarColor: '#6366f1',
    })),
    jobId: conv.jobId,
    jobTitle,
    status: conv.status,
    createdAt: conv.createdAt.toISOString(),
    lastMessage: null,
    unreadCount: 0,
    otherParticipant: null,
  };
}

/**
 * Mark all messages in a conversation as read for a user.
 */
export async function markAsRead(
  conversationId: string,
  userId: string,
): Promise<void> {
  if (isMockMode) {
    // Mark in the original mock data
    const conv = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
    if (conv) {
      for (const msg of conv.messages) {
        if (!msg.readBy.includes(userId)) {
          msg.readBy.push(userId);
        }
      }
    }
    // Also mark session messages
    const session = sessionMessages.get(conversationId) ?? [];
    for (const msg of session) {
      if (!msg.readBy.includes(userId)) {
        msg.readBy.push(userId);
      }
    }
    return;
  }

  await communicationService.markRead(conversationId, userId);
}

/**
 * Sherpa Pros Platform — Communication Types
 *
 * Masked messaging system for Pro ↔ Client communication.
 * Real contact info is never exposed — participants see role labels only.
 */

// ---------------------------------------------------------------------------
// Conversation
// ---------------------------------------------------------------------------

export type ConversationStatus = 'active' | 'closed' | 'archived';

export interface Conversation {
  id: string;
  jobId: string;
  proUserId: string;
  clientUserId: string;
  /** Twilio Conversation SID (null in mock mode) */
  twilioSid: string | null;
  status: ConversationStatus;
  createdAt: Date;
  closedAt: Date | null;
}

// ---------------------------------------------------------------------------
// Message
// ---------------------------------------------------------------------------

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: Date;
  readAt: Date | null;
}

// ---------------------------------------------------------------------------
// Conversation Events (for real-time / webhook)
// ---------------------------------------------------------------------------

export type ConversationEventType =
  | 'new_message'
  | 'message_read'
  | 'conversation_closed'
  | 'conversation_archived'
  | 'typing_started'
  | 'typing_stopped';

export interface ConversationEvent {
  type: ConversationEventType;
  conversationId: string;
  payload: Record<string, unknown>;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Participant Role (masked identity)
// ---------------------------------------------------------------------------

export type ParticipantRole = 'pro' | 'client';

/** Resolve display label — never expose real names in masked mode */
export function roleLabel(role: ParticipantRole): string {
  return role === 'pro' ? 'Pro' : 'Client';
}

// ---------------------------------------------------------------------------
// Service Interface
// ---------------------------------------------------------------------------

export interface CommunicationService {
  createConversation(
    jobId: string,
    proId: string,
    clientId: string,
  ): Promise<Conversation>;

  sendMessage(
    conversationId: string,
    senderId: string,
    body: string,
  ): Promise<Message>;

  getMessages(
    conversationId: string,
    limit?: number,
    before?: string,
  ): Promise<Message[]>;

  getConversationsForUser(userId: string): Promise<Conversation[]>;

  closeConversation(conversationId: string): Promise<Conversation>;

  scheduleAutoClose(
    conversationId: string,
    delayDays: number,
  ): Promise<{ scheduledAt: Date }>;

  markRead(conversationId: string, userId: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// API Payloads
// ---------------------------------------------------------------------------

export interface CreateConversationPayload {
  jobId: string;
  proUserId: string;
  clientUserId: string;
}

export interface SendMessagePayload {
  senderId: string;
  body: string;
}

export interface ConversationListItem {
  conversation: Conversation;
  lastMessage: Message | null;
  unreadCount: number;
  otherPartyRole: ParticipantRole;
  jobTitle: string;
}

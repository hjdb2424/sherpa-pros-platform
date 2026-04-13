/**
 * Sherpa Pros Platform — Mock Communication Service
 *
 * Full in-memory implementation for development without a Twilio account.
 * Stores conversations and messages in Maps — resets on server restart.
 */

import type {
  CommunicationService,
  Conversation,
  Message,
} from './types';

// ---------------------------------------------------------------------------
// In-memory stores
// ---------------------------------------------------------------------------

const conversations = new Map<string, Conversation>();
const messages = new Map<string, Message[]>();
const autoCloseTimers = new Map<string, NodeJS.Timeout>();

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_mock_${idCounter}_${Date.now()}`;
}

// ---------------------------------------------------------------------------
// Mock Service
// ---------------------------------------------------------------------------

export const mockService: CommunicationService = {
  async createConversation(jobId, proId, clientId) {
    const id = nextId('conv');
    const conversation: Conversation = {
      id,
      jobId,
      proUserId: proId,
      clientUserId: clientId,
      twilioSid: null,
      status: 'active',
      createdAt: new Date(),
      closedAt: null,
    };
    conversations.set(id, conversation);
    messages.set(id, []);
    return conversation;
  },

  async sendMessage(conversationId, senderId, body) {
    const conversation = conversations.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }
    if (conversation.status !== 'active') {
      throw new Error(`Conversation is ${conversation.status}`);
    }

    const message: Message = {
      id: nextId('msg'),
      conversationId,
      senderId,
      body,
      createdAt: new Date(),
      readAt: null,
    };

    const list = messages.get(conversationId) ?? [];
    list.push(message);
    messages.set(conversationId, list);

    return message;
  },

  async getMessages(conversationId, limit = 50, before) {
    const list = messages.get(conversationId) ?? [];

    let filtered = [...list];

    if (before) {
      const idx = filtered.findIndex((m) => m.id === before);
      if (idx > 0) {
        filtered = filtered.slice(0, idx);
      }
    }

    // Return most recent messages first, limited
    return filtered.slice(-limit).reverse();
  },

  async getConversationsForUser(userId) {
    const result: Conversation[] = [];
    for (const conv of conversations.values()) {
      if (conv.proUserId === userId || conv.clientUserId === userId) {
        result.push(conv);
      }
    }
    return result.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  },

  async closeConversation(conversationId) {
    const conversation = conversations.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    conversation.status = 'closed';
    conversation.closedAt = new Date();

    // Clear any pending auto-close timer
    const timer = autoCloseTimers.get(conversationId);
    if (timer) {
      clearTimeout(timer);
      autoCloseTimers.delete(conversationId);
    }

    return conversation;
  },

  async scheduleAutoClose(conversationId, delayDays) {
    const conversation = conversations.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    // Clear existing timer if any
    const existing = autoCloseTimers.get(conversationId);
    if (existing) {
      clearTimeout(existing);
    }

    const delayMs = delayDays * 24 * 60 * 60 * 1000;
    const scheduledAt = new Date(Date.now() + delayMs);

    const timer = setTimeout(() => {
      const conv = conversations.get(conversationId);
      if (conv && conv.status === 'active') {
        conv.status = 'closed';
        conv.closedAt = new Date();
      }
      autoCloseTimers.delete(conversationId);
    }, delayMs);

    autoCloseTimers.set(conversationId, timer);

    return { scheduledAt };
  },

  async markRead(conversationId, userId) {
    const list = messages.get(conversationId) ?? [];
    const now = new Date();
    for (const msg of list) {
      if (msg.senderId !== userId && msg.readAt === null) {
        msg.readAt = now;
      }
    }
  },
};

// ---------------------------------------------------------------------------
// Test helpers — access the raw stores for assertions
// ---------------------------------------------------------------------------

export function _getStore() {
  return { conversations, messages };
}

export function _resetStore() {
  conversations.clear();
  messages.clear();
  for (const timer of autoCloseTimers.values()) {
    clearTimeout(timer);
  }
  autoCloseTimers.clear();
  idCounter = 0;
}

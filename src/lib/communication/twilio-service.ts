/**
 * Sherpa Pros Platform — Twilio Communication Service
 *
 * Production implementation using Twilio Conversations API.
 * Creates masked proxy conversations so Pro and Client never see
 * each other's real contact info.
 *
 * Requires env vars:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_MESSAGING_SERVICE_SID
 */

import Twilio from 'twilio';
import type {
  CommunicationService,
  Conversation,
  Message,
} from './types';

// ---------------------------------------------------------------------------
// Twilio client (lazy-initialized)
// ---------------------------------------------------------------------------

type TwilioClient = ReturnType<typeof Twilio>;

let cachedClient: TwilioClient | null = null;

function getTwilioClient(): TwilioClient {
  if (cachedClient) return cachedClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error(
      'Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.',
    );
  }

  cachedClient = Twilio(accountSid, authToken);
  return cachedClient;
}

// ---------------------------------------------------------------------------
// ID generation (would come from DB in production)
// ---------------------------------------------------------------------------

let idSeq = 0;
function generateId(prefix: string): string {
  idSeq += 1;
  return `${prefix}_${Date.now()}_${idSeq}`;
}

// ---------------------------------------------------------------------------
// In-memory cache (production would use DB)
// ---------------------------------------------------------------------------

const conversationCache = new Map<string, Conversation>();

// ---------------------------------------------------------------------------
// Twilio Service
// ---------------------------------------------------------------------------

export const twilioService: CommunicationService = {
  async createConversation(jobId, proId, clientId) {
    const client = getTwilioClient();
    const id = generateId('conv');

    const twilioConv = await client.conversations.v1.conversations.create({
      friendlyName: `Job ${jobId} — Pro ↔ Client`,
      uniqueName: id,
      attributes: JSON.stringify({ jobId, proId, clientId }),
    });

    // Add Pro as participant with masked identity
    await client.conversations.v1
      .conversations(twilioConv.sid)
      .participants.create({
        identity: proId,
        attributes: JSON.stringify({ role: 'pro', displayName: 'Pro' }),
      });

    // Add Client as participant with masked identity
    await client.conversations.v1
      .conversations(twilioConv.sid)
      .participants.create({
        identity: clientId,
        attributes: JSON.stringify({ role: 'client', displayName: 'Client' }),
      });

    const conversation: Conversation = {
      id,
      jobId,
      proUserId: proId,
      clientUserId: clientId,
      twilioSid: twilioConv.sid,
      status: 'active',
      createdAt: new Date(),
      closedAt: null,
    };

    conversationCache.set(id, conversation);
    return conversation;
  },

  async sendMessage(conversationId, senderId, body) {
    const client = getTwilioClient();
    const conversation = conversationCache.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }
    if (conversation.status !== 'active') {
      throw new Error(`Conversation is ${conversation.status}`);
    }
    if (!conversation.twilioSid) {
      throw new Error(`Conversation ${conversationId} has no Twilio SID`);
    }

    const twilioMsg = await client.conversations.v1
      .conversations(conversation.twilioSid)
      .messages.create({
        author: senderId,
        body,
      });

    const message: Message = {
      id: twilioMsg.sid,
      conversationId,
      senderId: twilioMsg.author ?? senderId,
      body: twilioMsg.body ?? body,
      createdAt: twilioMsg.dateCreated ?? new Date(),
      readAt: null,
    };

    return message;
  },

  async getMessages(conversationId, limit = 50, _before) {
    const _client = getTwilioClient();
    const conversation = conversationCache.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    // TODO: Actual Twilio API call with pagination
    // const result = await client.conversations.v1
    //   .conversations(conversation.twilioSid!)
    //   .messages.list({ limit, order: 'desc' });
    //
    // return result.map(m => ({
    //   id: m.sid,
    //   conversationId,
    //   senderId: m.author ?? 'unknown',
    //   body: m.body ?? '',
    //   createdAt: m.dateCreated ?? new Date(),
    //   readAt: null,
    // }));

    void limit;
    return [];
  },

  async getConversationsForUser(userId) {
    // TODO: Query from database, not cache
    const result: Conversation[] = [];
    for (const conv of conversationCache.values()) {
      if (conv.proUserId === userId || conv.clientUserId === userId) {
        result.push(conv);
      }
    }
    return result.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  },

  async closeConversation(conversationId) {
    const _client = getTwilioClient();
    const conversation = conversationCache.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    // TODO: Close the Twilio Conversation
    // await client.conversations.v1
    //   .conversations(conversation.twilioSid!)
    //   .update({ state: 'closed' });

    conversation.status = 'closed';
    conversation.closedAt = new Date();
    return conversation;
  },

  async scheduleAutoClose(conversationId, delayDays) {
    const conversation = conversationCache.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    const scheduledAt = new Date(
      Date.now() + delayDays * 24 * 60 * 60 * 1000,
    );

    // TODO: In production, schedule via a job queue (e.g., BullMQ, Vercel Cron)
    // rather than an in-process setTimeout.
    // await jobQueue.add('close-conversation', { conversationId }, {
    //   delay: delayDays * 24 * 60 * 60 * 1000,
    // });

    return { scheduledAt };
  },

  async markRead(conversationId, _userId) {
    const _client = getTwilioClient();
    const conversation = conversationCache.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    // TODO: Update last read message index in Twilio
    // await client.conversations.v1
    //   .conversations(conversation.twilioSid!)
    //   .participants(userId)
    //   .update({ lastReadMessageIndex: latestIndex });
  },
};

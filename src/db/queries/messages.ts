/**
 * Message & Conversation Query Helpers
 *
 * Database queries for the messaging system with graceful mock fallback.
 */

import { query } from "../connection";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConversationRow {
  id: string;
  job_id: string;
  pro_user_id: string;
  client_user_id: string;
  twilio_conversation_sid: string | null;
  status: string;
  created_at: string;
  closed_at: string | null;
  job_title?: string;
  last_message_body?: string | null;
  last_message_at?: string | null;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Mock fallback
// ---------------------------------------------------------------------------

function mockConversations(): ConversationRow[] {
  return [
    {
      id: "mock-conv-1",
      job_id: "mock-job-1",
      pro_user_id: "mock-pro-user-1",
      client_user_id: "mock-client-user-1",
      twilio_conversation_sid: null,
      status: "active",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      closed_at: null,
      job_title: "Kitchen Cabinet Installation",
      last_message_body: "I can start Monday morning at 8am. Does that work?",
      last_message_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "mock-conv-2",
      job_id: "mock-job-2",
      pro_user_id: "mock-pro-user-2",
      client_user_id: "mock-client-user-1",
      twilio_conversation_sid: null,
      status: "active",
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      closed_at: null,
      job_title: "Deck Repair & Staining",
      last_message_body: "Materials arrived. See you tomorrow.",
      last_message_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
}

function mockMessages(): MessageRow[] {
  return [
    {
      id: "mock-msg-1",
      conversation_id: "mock-conv-1",
      sender_user_id: "mock-pro-user-1",
      body: "Hi! I reviewed the job details and I'm available to start next week.",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "mock-msg-2",
      conversation_id: "mock-conv-1",
      sender_user_id: "mock-client-user-1",
      body: "That sounds great. What day works best?",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "mock-msg-3",
      conversation_id: "mock-conv-1",
      sender_user_id: "mock-pro-user-1",
      body: "I can start Monday morning at 8am. Does that work?",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * List conversations for a user (as either pro or client), with last message.
 */
export async function getConversations(
  userId: string,
): Promise<ConversationRow[]> {
  try {
    return await query<ConversationRow>(
      `SELECT c.id, c.job_id, c.pro_user_id, c.client_user_id,
              c.twilio_conversation_sid, c.status, c.created_at, c.closed_at,
              j.title AS job_title,
              lm.body AS last_message_body,
              lm.created_at AS last_message_at
         FROM conversations c
         JOIN jobs j ON j.id = c.job_id
         LEFT JOIN LATERAL (
           SELECT m.body, m.created_at
             FROM messages m
            WHERE m.conversation_id = c.id
            ORDER BY m.created_at DESC
            LIMIT 1
         ) lm ON true
        WHERE (c.pro_user_id = $1 OR c.client_user_id = $1)
          AND c.status = 'active'
        ORDER BY COALESCE(lm.created_at, c.created_at) DESC`,
      [userId],
    );
  } catch (error) {
    console.error(
      "[db/queries/messages] getConversations failed, returning mock:",
      error,
    );
    return mockConversations();
  }
}

/**
 * Get messages in a conversation, ordered oldest-first.
 */
export async function getMessages(
  conversationId: string,
  limit = 50,
  before?: string,
): Promise<MessageRow[]> {
  try {
    if (before) {
      return await query<MessageRow>(
        `SELECT id, conversation_id, sender_user_id, body, created_at
           FROM messages
          WHERE conversation_id = $1
            AND created_at < $2
          ORDER BY created_at ASC
          LIMIT $3`,
        [conversationId, before, limit],
      );
    }

    return await query<MessageRow>(
      `SELECT id, conversation_id, sender_user_id, body, created_at
         FROM messages
        WHERE conversation_id = $1
        ORDER BY created_at ASC
        LIMIT $2`,
      [conversationId, limit],
    );
  } catch (error) {
    console.error(
      "[db/queries/messages] getMessages failed, returning mock:",
      error,
    );
    return mockMessages().filter((m) => m.conversation_id === conversationId);
  }
}

/**
 * Send a message in a conversation.
 */
export async function sendMessage(
  conversationId: string,
  senderUserId: string,
  body: string,
): Promise<MessageRow> {
  try {
    const rows = await query<MessageRow>(
      `INSERT INTO messages (conversation_id, sender_user_id, body)
       VALUES ($1, $2, $3)
       RETURNING id, conversation_id, sender_user_id, body, created_at`,
      [conversationId, senderUserId, body],
    );
    return rows[0];
  } catch (error) {
    console.error(
      "[db/queries/messages] sendMessage failed, returning mock:",
      error,
    );
    return {
      id: `mock-msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_user_id: senderUserId,
      body,
      created_at: new Date().toISOString(),
    };
  }
}

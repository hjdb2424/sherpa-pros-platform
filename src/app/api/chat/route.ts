import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/communication';
import type { CreateConversationPayload } from '@/lib/communication';
import {
  getConversations as getChatConversations,
  createConversation as createChatConversation,
} from '@/lib/communication/chat-service';
import { getConversations as getDbConversations } from '@/db/queries/messages';

/**
 * GET /api/chat?userId=xxx
 * List conversations for the authenticated user.
 * Priority: chat-service mock data > DB > communication service fallback.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const role = searchParams.get('role') ?? undefined;

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId query parameter' },
      { status: 400 },
    );
  }

  try {
    // Use the chat service which handles mock mode automatically
    const conversations = await getChatConversations(userId, role);

    if (conversations.length > 0) {
      return NextResponse.json({ conversations });
    }

    // Fallback: Try DB-first approach with lateral join for last message
    const dbConversations = await getDbConversations(userId);

    if (dbConversations.length > 0) {
      const items = dbConversations.map((conv) => ({
        id: conv.id,
        participants: [],
        jobId: conv.job_id,
        jobTitle: conv.job_title ?? `Job ${conv.job_id}`,
        status: conv.status,
        createdAt: conv.created_at,
        lastMessage: conv.last_message_body
          ? {
              id: 'db-msg',
              conversationId: conv.id,
              senderId: '',
              senderName: '',
              senderRole: 'client',
              text: conv.last_message_body,
              timestamp: conv.last_message_at ?? conv.created_at,
              readBy: [],
              deliveryMethod: 'app',
            }
          : null,
        unreadCount: 0,
        otherParticipant: null,
      }));

      return NextResponse.json({ conversations: items });
    }

    // Final fallback: communication service
    const convs =
      await communicationService.getConversationsForUser(userId);

    const items = await Promise.all(
      convs.map(async (conv) => {
        const messages = await communicationService.getMessages(conv.id, 1);
        const allMessages = await communicationService.getMessages(conv.id, 100);
        const unreadCount = allMessages.filter(
          (m) => m.senderId !== userId && m.readAt === null,
        ).length;

        return {
          id: conv.id,
          participants: [],
          jobId: conv.jobId,
          jobTitle: `Job ${conv.jobId}`,
          status: conv.status,
          createdAt: conv.createdAt.toISOString(),
          lastMessage: messages[0]
            ? {
                id: messages[0].id,
                conversationId: conv.id,
                senderId: messages[0].senderId,
                senderName: '',
                senderRole: 'client',
                text: messages[0].body,
                timestamp:
                  messages[0].createdAt instanceof Date
                    ? messages[0].createdAt.toISOString()
                    : messages[0].createdAt,
                readBy: [],
                deliveryMethod: 'app',
              }
            : null,
          unreadCount,
          otherParticipant: null,
        };
      }),
    );

    return NextResponse.json({ conversations: items });
  } catch (err) {
    console.error('[api/chat] GET failed:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/chat
 * Create a new masked conversation between Pro and Client.
 */
export async function POST(request: Request) {
  let body: CreateConversationPayload & { jobTitle?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const { jobId, proUserId, clientUserId, jobTitle } = body;

  if (!jobId || !proUserId || !clientUserId) {
    return NextResponse.json(
      { error: 'Missing required fields: jobId, proUserId, clientUserId' },
      { status: 400 },
    );
  }

  try {
    const conversation = await createChatConversation(
      [
        { id: proUserId, role: 'pro', name: 'Pro' },
        { id: clientUserId, role: 'client', name: 'Client' },
      ],
      jobId,
      jobTitle ?? `Job ${jobId}`,
    );

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

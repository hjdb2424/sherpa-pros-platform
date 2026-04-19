import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/communication';
import type { CreateConversationPayload } from '@/lib/communication';
import { getConversations } from '@/db/queries/messages';

/**
 * GET /api/chat?userId=xxx
 * List conversations for the authenticated user.
 * Tries DB query first, falls back to communication service, then mock.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId query parameter' },
      { status: 400 },
    );
  }

  try {
    // Try DB-first approach with lateral join for last message
    const dbConversations = await getConversations(userId);

    if (dbConversations.length > 0) {
      const items = dbConversations.map((conv) => ({
        conversation: {
          id: conv.id,
          jobId: conv.job_id,
          proUserId: conv.pro_user_id,
          clientUserId: conv.client_user_id,
          status: conv.status,
          createdAt: conv.created_at,
        },
        lastMessage: conv.last_message_body
          ? { body: conv.last_message_body, createdAt: conv.last_message_at }
          : null,
        unreadCount: 0,
        otherPartyRole: conv.pro_user_id === userId ? 'client' : 'pro',
        jobTitle: conv.job_title ?? `Job ${conv.job_id}`,
      }));

      return NextResponse.json({ conversations: items });
    }

    // Fall back to communication service
    const conversations =
      await communicationService.getConversationsForUser(userId);

    const items = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await communicationService.getMessages(conv.id, 1);
        const allMessages = await communicationService.getMessages(conv.id, 100);
        const unreadCount = allMessages.filter(
          (m) => m.senderId !== userId && m.readAt === null,
        ).length;

        const otherPartyRole =
          conv.proUserId === userId ? 'client' : 'pro';

        return {
          conversation: conv,
          lastMessage: messages[0] ?? null,
          unreadCount,
          otherPartyRole,
          jobTitle: `Job ${conv.jobId}`,
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
  let body: CreateConversationPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const { jobId, proUserId, clientUserId } = body;

  if (!jobId || !proUserId || !clientUserId) {
    return NextResponse.json(
      { error: 'Missing required fields: jobId, proUserId, clientUserId' },
      { status: 400 },
    );
  }

  // TODO: Verify caller is either the pro or client on this job
  // TODO: Check for existing active conversation on this job to prevent duplicates

  try {
    const conversation = await communicationService.createConversation(
      jobId,
      proUserId,
      clientUserId,
    );

    return NextResponse.json(
      { conversation },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

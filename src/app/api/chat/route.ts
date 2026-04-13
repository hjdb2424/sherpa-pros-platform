import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/communication';
import type { CreateConversationPayload } from '@/lib/communication';

/**
 * GET /api/chat?userId=xxx
 * List conversations for the authenticated user.
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

  // TODO: Replace with actual auth — verify the caller owns this userId
  // const session = await auth();
  // if (session?.userId !== userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const conversations =
      await communicationService.getConversationsForUser(userId);

    // Build list items with last message + unread count
    // In production this would be a single DB query with joins
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
          jobTitle: `Job ${conv.jobId}`, // TODO: Resolve actual job title from DB
        };
      }),
    );

    return NextResponse.json({ conversations: items });
  } catch (err) {
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

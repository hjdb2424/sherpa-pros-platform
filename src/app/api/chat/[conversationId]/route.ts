import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/communication';

/**
 * GET /api/chat/[conversationId]
 * Paginated message history for a conversation.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;
  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    parseInt(searchParams.get('limit') ?? '50', 10),
    100,
  );
  const before = searchParams.get('before') ?? undefined;

  // TODO: Verify caller is a participant of this conversation
  // const session = await auth();
  // verify session.userId is proUserId or clientUserId on this conversation

  try {
    const messages = await communicationService.getMessages(
      conversationId,
      limit,
      before,
    );

    return NextResponse.json({ messages });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

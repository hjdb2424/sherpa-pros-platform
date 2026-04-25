import { NextResponse } from 'next/server';
import { markAsRead } from '@/lib/communication/chat-service';

/**
 * POST /api/chat/[conversationId]/read
 * Mark all messages as read for a user in a conversation.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;

  let body: { userId: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const { userId } = body;

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing required field: userId' },
      { status: 400 },
    );
  }

  try {
    await markAsRead(conversationId, userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

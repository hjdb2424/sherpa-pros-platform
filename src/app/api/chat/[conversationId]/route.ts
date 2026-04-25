import { NextResponse } from 'next/server';
import { getMessages } from '@/lib/communication/chat-service';

/**
 * GET /api/chat/[conversationId]
 * Full message history for a conversation.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;

  try {
    const messages = await getMessages(conversationId);
    return NextResponse.json({ messages });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

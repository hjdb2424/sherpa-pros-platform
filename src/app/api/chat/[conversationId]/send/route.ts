import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/communication';
import type { SendMessagePayload } from '@/lib/communication';

/**
 * POST /api/chat/[conversationId]/send
 * Send a message in a masked conversation.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;

  let body: SendMessagePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const { senderId, body: messageBody } = body;

  if (!senderId || !messageBody?.trim()) {
    return NextResponse.json(
      { error: 'Missing required fields: senderId, body' },
      { status: 400 },
    );
  }

  // TODO: Verify caller is senderId and is a participant of this conversation
  // const session = await auth();
  // if (session?.userId !== senderId) return 401;

  try {
    const message = await communicationService.sendMessage(
      conversationId,
      senderId,
      messageBody.trim(),
    );

    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    const status = errMsg.includes('not found')
      ? 404
      : errMsg.includes('closed')
        ? 409
        : 500;
    return NextResponse.json({ error: errMsg }, { status });
  }
}

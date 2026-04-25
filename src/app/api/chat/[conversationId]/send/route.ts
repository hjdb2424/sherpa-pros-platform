import { NextResponse } from 'next/server';
import { sendMessage } from '@/lib/communication/chat-service';

/**
 * POST /api/chat/[conversationId]/send
 * Send a message in a conversation (triggers Twilio SMS when configured).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;

  let body: { senderId: string; body: string };
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

  try {
    const message = await sendMessage(
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

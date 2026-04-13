import { NextResponse } from 'next/server';

/**
 * POST /api/chat/webhook
 * Twilio webhook for incoming conversation events.
 *
 * Twilio sends POST requests here when:
 * - A new message is added to a conversation
 * - A participant joins/leaves
 * - A conversation state changes
 *
 * In production, validate the X-Twilio-Signature header to ensure
 * the request actually came from Twilio.
 */
export async function POST(request: Request) {
  // TODO: Validate Twilio signature
  // const signature = request.headers.get('x-twilio-signature');
  // const url = request.url;
  // const params = await request.formData();
  // if (!twilio.validateRequest(authToken, signature, url, params)) {
  //   return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  // }

  let body: Record<string, unknown>;
  try {
    // Twilio sends form-encoded by default, but can be configured for JSON
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    }
  } catch {
    return NextResponse.json(
      { error: 'Could not parse webhook body' },
      { status: 400 },
    );
  }

  const eventType = body['EventType'] as string | undefined;

  switch (eventType) {
    case 'onMessageAdded': {
      // TODO: Persist message to database
      // TODO: Send push notification to the other participant
      // TODO: Update unread counts
      const conversationSid = body['ConversationSid'] as string;
      const author = body['Author'] as string;
      const messageBody = body['Body'] as string;

      console.log(
        `[webhook] New message in ${conversationSid} from ${author}: ${messageBody?.substring(0, 50)}`,
      );
      break;
    }

    case 'onConversationStateUpdated': {
      // TODO: Handle conversation close/archive
      const conversationSid = body['ConversationSid'] as string;
      const state = body['StateTo'] as string;
      console.log(
        `[webhook] Conversation ${conversationSid} state -> ${state}`,
      );
      break;
    }

    case 'onParticipantAdded':
    case 'onParticipantRemoved': {
      const conversationSid = body['ConversationSid'] as string;
      const identity = body['Identity'] as string;
      console.log(
        `[webhook] ${eventType} in ${conversationSid}: ${identity}`,
      );
      break;
    }

    default:
      console.log(`[webhook] Unhandled event: ${eventType}`);
  }

  // Twilio expects a 200 response to acknowledge the webhook
  return NextResponse.json({ received: true });
}

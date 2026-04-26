import { NextResponse } from 'next/server';
import Twilio from 'twilio';

/**
 * POST /api/chat/webhook
 * Twilio webhook for incoming Conversations events.
 *
 * Twilio posts here when:
 * - A new message is added (onMessageAdded)
 * - A participant joins/leaves
 * - A conversation state changes
 *
 * Signature is validated using Twilio.validateRequest. The shared secret
 * is TWILIO_AUTH_TOKEN. Bad signatures get 403.
 */
export async function POST(request: Request) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const signature = request.headers.get('x-twilio-signature');

  // Twilio sends form-encoded by default; capture raw body once.
  const contentType = request.headers.get('content-type') ?? '';
  let body: Record<string, unknown>;
  let paramsForSig: Record<string, string> = {};

  try {
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      const entries = Object.fromEntries(formData.entries());
      body = entries;
      paramsForSig = Object.fromEntries(
        Object.entries(entries).map(([k, v]) => [k, String(v)]),
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Could not parse webhook body' },
      { status: 400 },
    );
  }

  // Validate signature when token + signature are present.
  // In dev with no TWILIO_AUTH_TOKEN we skip (mock mode).
  if (authToken && signature) {
    const valid = Twilio.validateRequest(
      authToken,
      signature,
      request.url,
      paramsForSig,
    );
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }
  } else if (authToken && !signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 403 });
  }

  const eventType = body['EventType'] as string | undefined;

  switch (eventType) {
    case 'onMessageAdded': {
      const conversationSid = body['ConversationSid'] as string;
      const author = body['Author'] as string;
      const messageBody = body['Body'] as string;
      console.log(
        `[webhook] New message in ${conversationSid} from ${author}: ${messageBody?.substring(0, 50)}`,
      );
      // Persistence + push notifications land in followup plan (DB migration).
      break;
    }

    case 'onConversationStateUpdated': {
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

  return NextResponse.json({ received: true });
}

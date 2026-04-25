import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TremendousWebhookBody {
  id?: string;
  event?: string;
  payload?: {
    order?: {
      id: string;
      status: string;
    };
    [key: string]: unknown;
  };
}

// ---------------------------------------------------------------------------
// POST /api/rewards/webhook — handle Tremendous webhook events
//
// Webhook URL: https://thesherpapros.com/api/rewards/webhook
//
// Events:
//   ORDERS.ORDER.CREATED   — new order placed
//   ORDERS.ORDER.DELIVERED — reward delivered to recipient
//   ORDERS.ORDER.CANCELED  — order canceled
// ---------------------------------------------------------------------------

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as TremendousWebhookBody;
    const eventType = body.event ?? 'UNKNOWN';
    const orderId = body.payload?.order?.id ?? 'unknown';
    const orderStatus = body.payload?.order?.status ?? 'unknown';

    console.log(
      `[Tremendous Webhook] Event: ${eventType} | Order: ${orderId} | Status: ${orderStatus}`,
    );

    switch (eventType) {
      case 'ORDERS.ORDER.CREATED':
        console.log(`[Tremendous Webhook] Order created: ${orderId}`);
        // Future: store order record, notify admin
        break;

      case 'ORDERS.ORDER.DELIVERED':
        console.log(`[Tremendous Webhook] Order delivered: ${orderId}`);
        // Future: update redemption status in DB, notify pro
        break;

      case 'ORDERS.ORDER.CANCELED':
        console.log(`[Tremendous Webhook] Order canceled: ${orderId}`);
        // Future: refund points to pro, update DB
        break;

      default:
        console.log(`[Tremendous Webhook] Unhandled event: ${eventType}`);
        break;
    }

    // Always return 200 so Tremendous doesn't retry
    return NextResponse.json({ received: true, event: eventType });
  } catch (error) {
    console.error('[Tremendous Webhook] Error processing webhook:', error);
    // Still return 200 to prevent retries on parse errors
    return NextResponse.json({ received: true, error: 'Failed to process' });
  }
}

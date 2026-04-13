import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConnectRequestBody {
  proId: string;
  email: string;
}

interface ConnectSuccessResponse {
  connectAccountId: string;
  onboardingUrl: string;
}

interface ErrorResponse {
  error: string;
  code: string;
}

// ---------------------------------------------------------------------------
// POST /api/stripe/connect
// Creates a Stripe Connect Standard account for a Pro and returns the
// onboarding URL so the Pro can complete identity verification (KYC).
// ---------------------------------------------------------------------------

export async function POST(
  request: Request,
): Promise<NextResponse<ConnectSuccessResponse | ErrorResponse>> {
  try {
    const body = (await request.json()) as Partial<ConnectRequestBody>;

    if (!body.proId || !body.email) {
      return NextResponse.json(
        { error: 'proId and email are required', code: 'MISSING_FIELDS' },
        { status: 400 },
      );
    }

    const { proId, email } = body;

    // 1. Create the Stripe Connect Standard account
    const account = await stripe.accounts.create({
      type: 'standard',
      email,
      metadata: {
        proId,
        platform: 'sherpa_pros',
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // 2. Generate an account onboarding link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${baseUrl}/api/stripe/connect?refresh=true&proId=${proId}`,
      return_url: `${baseUrl}/api/stripe/connect/callback?accountId=${account.id}&proId=${proId}`,
      type: 'account_onboarding',
    });

    // TODO: Persist account.id to database
    // await db.update(pros).set({ stripeConnectId: account.id }).where(eq(pros.id, proId));

    return NextResponse.json({
      connectAccountId: account.id,
      onboardingUrl: accountLink.url,
    });
  } catch (err) {
    console.error('[Stripe Connect] Account creation failed:', err);

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: err.message, code: err.code ?? 'STRIPE_ERROR' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

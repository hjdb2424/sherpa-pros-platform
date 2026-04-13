import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AccountStatus = 'active' | 'pending' | 'restricted';

interface CallbackResult {
  accountId: string;
  proId: string;
  status: AccountStatus;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
}

// ---------------------------------------------------------------------------
// GET /api/stripe/connect/callback
// Handles the return from Stripe onboarding. Verifies the Connect account
// status and redirects the Pro to their payments page with the result.
// ---------------------------------------------------------------------------

export async function GET(
  request: NextRequest,
): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const accountId = searchParams.get('accountId');
  const proId = searchParams.get('proId');

  if (!accountId || !proId) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    return NextResponse.redirect(
      `${baseUrl}/pro/payments?error=missing_params`,
    );
  }

  try {
    // Retrieve the Connect account from Stripe to check onboarding status
    const account = await getStripe().accounts.retrieve(accountId);

    let status: AccountStatus = 'pending';
    if (account.charges_enabled && account.payouts_enabled) {
      status = 'active';
    } else if (account.requirements?.disabled_reason) {
      status = 'restricted';
    }

    const result: CallbackResult = {
      accountId: account.id,
      proId,
      status,
      chargesEnabled: account.charges_enabled ?? false,
      payoutsEnabled: account.payouts_enabled ?? false,
      detailsSubmitted: account.details_submitted ?? false,
    };

    // TODO: Update database with verified status
    // await db.update(pros).set({
    //   stripeConnectId: account.id,
    //   stripeConnectStatus: status,
    //   payoutsEnabled: account.payouts_enabled,
    // }).where(eq(pros.id, proId));

    void result;

    // Redirect to the Pro payments page with status
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    return NextResponse.redirect(
      `${baseUrl}/pro/payments?status=${status}&connected=true`,
    );
  } catch (err) {
    console.error('[Stripe Connect Callback] Verification failed:', err);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    return NextResponse.redirect(
      `${baseUrl}/pro/payments?error=verification_failed`,
    );
  }
}

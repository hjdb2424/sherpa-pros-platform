/**
 * Sherpa Pros Platform — Subscription API
 *
 * GET  /api/subscriptions  — current subscription status
 * POST /api/subscriptions  — create or upgrade subscription
 * DELETE /api/subscriptions — cancel subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getSubscriptionStatus,
  createSubscription,
  upgradeSubscription,
  cancelSubscription,
} from '@/lib/subscriptions/stripe-billing';
import { getPlanByTier, isValidUpgrade } from '@/lib/subscriptions/plans';
import type { SubscriptionTier } from '@/lib/subscriptions/types';

// ---------------------------------------------------------------------------
// GET — Current subscription status
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    // TODO: Get proId from authenticated session (Clerk)
    // const { userId } = auth();
    // if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const proId = request.nextUrl.searchParams.get('proId') ?? 'pro-001';

    const subscription = await getSubscriptionStatus(proId);

    return NextResponse.json({
      data: {
        subscription,
        tier: subscription?.tier ?? 'standard',
        isActive: subscription?.status === 'active',
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('GET /api/subscriptions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST — Create or upgrade subscription
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // TODO: Get proId from authenticated session (Clerk)
    // const { userId } = auth();
    // if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { proId, tier, paymentMethodId, action } = body as {
      proId: string;
      tier: SubscriptionTier;
      paymentMethodId?: string;
      action?: 'create' | 'upgrade';
    };

    if (!proId || !tier) {
      return NextResponse.json(
        { error: 'proId and tier are required' },
        { status: 400 },
      );
    }

    // Validate tier exists
    try {
      getPlanByTier(tier);
    } catch {
      return NextResponse.json(
        { error: `Invalid tier: ${tier}` },
        { status: 400 },
      );
    }

    if (action === 'upgrade') {
      // Check current subscription exists
      const current = await getSubscriptionStatus(proId);
      const currentTier = current?.tier ?? 'standard';

      if (!isValidUpgrade(currentTier, tier)) {
        return NextResponse.json(
          { error: `Cannot upgrade from ${currentTier} to ${tier}` },
          { status: 400 },
        );
      }

      const subscription = await upgradeSubscription(proId, tier);
      return NextResponse.json({
        data: { subscription },
        meta: { timestamp: new Date().toISOString() },
      });
    }

    // Create new subscription
    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'paymentMethodId is required to create a subscription' },
        { status: 400 },
      );
    }

    const subscription = await createSubscription(proId, tier, paymentMethodId);
    return NextResponse.json(
      {
        data: { subscription },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/subscriptions error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to create subscription';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE — Cancel subscription
// ---------------------------------------------------------------------------

export async function DELETE(request: NextRequest) {
  try {
    // TODO: Get proId from authenticated session (Clerk)
    // const { userId } = auth();
    // if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const proId = request.nextUrl.searchParams.get('proId');
    if (!proId) {
      return NextResponse.json(
        { error: 'proId is required' },
        { status: 400 },
      );
    }

    const subscription = await cancelSubscription(proId);

    return NextResponse.json({
      data: {
        subscription,
        message: 'Subscription will be canceled at the end of the billing period.',
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('DELETE /api/subscriptions error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to cancel subscription';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

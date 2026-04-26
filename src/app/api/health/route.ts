import { NextResponse } from 'next/server';

/**
 * GET /api/health
 *
 * Returns the status of every external service. Becomes the container
 * health probe when migrated off Vercel.
 *
 * Spec section 8: 2026-04-25-production-launch-hub-architecture-design.md
 */
export async function GET() {
  const services: Record<string, { status: 'up' | 'unconfigured'; mode?: string }> = {
    database: {
      status: process.env.DATABASE_URL ? 'up' : 'unconfigured',
    },
    stripe: {
      status: process.env.STRIPE_SECRET_KEY ? 'up' : 'unconfigured',
      mode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')
        ? 'live'
        : process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')
          ? 'test'
          : undefined,
    },
    twilio: {
      status: process.env.TWILIO_ACCOUNT_SID ? 'up' : 'unconfigured',
      mode: process.env.TWILIO_ACCOUNT_SID ? 'real' : 'mock',
    },
    zinc: {
      status: process.env.ZINC_API_KEY ? 'up' : 'unconfigured',
    },
    storage: {
      status: process.env.R2_ACCESS_KEY_ID ? 'up' : 'unconfigured',
    },
  };

  const allUp = Object.values(services).every((s) => s.status === 'up');

  return NextResponse.json(
    {
      status: allUp ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services,
    },
    { status: 200 },
  );
}

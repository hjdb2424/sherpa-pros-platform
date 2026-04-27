import Link from 'next/link';
import type { StripeAccountStatus } from '@/lib/services/payments/types';

interface Props {
  status: StripeAccountStatus;
}

export function StripeStatusBanner({ status }: Props) {
  if (status === 'active') return null;

  if (status === 'pending') {
    return (
      <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-4">
        <p className="text-sm text-amber-900">
          <strong>Verification in progress.</strong> Stripe is reviewing your info — this usually takes a few minutes.{' '}
          <Link href="/pro/onboarding/payouts" className="underline">Check status</Link>
        </p>
      </div>
    );
  }

  if (status === 'restricted') {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 mb-4">
        <p className="text-sm text-red-900">
          <strong>Stripe needs more info from you.</strong>{' '}
          <Link href="/pro/onboarding/payouts" className="underline">Complete verification →</Link>
        </p>
      </div>
    );
  }

  if (status === 'disabled') {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 mb-4">
        <p className="text-sm text-red-900">
          <strong>Your Stripe account is disabled.</strong> Contact support for assistance.
        </p>
      </div>
    );
  }

  // status === 'none' (default for new pros)
  return (
    <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-4">
      <p className="text-sm text-amber-900">
        <strong>Get verified to start earning.</strong>{' '}
        Pros must complete a one-time Stripe verification (~3 min) before accepting jobs.{' '}
        <Link href="/pro/onboarding/payouts" className="underline font-semibold">Verify now →</Link>
      </p>
    </div>
  );
}

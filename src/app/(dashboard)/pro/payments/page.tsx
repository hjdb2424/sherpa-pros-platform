import type { Metadata } from 'next';
import BalanceCard from '@/components/payments/BalanceCard';
import CommissionExplainer from '@/components/payments/CommissionExplainer';
import StripeConnectButton from '@/components/payments/StripeConnectButton';
import PayoutHistory from '@/components/payments/PayoutHistory';
import type { Payout } from '@/components/payments/PayoutHistory';
import EmptyState from '@/components/EmptyState';
import { BanknotesIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Payments',
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ConnectStatus = 'not_connected' | 'pending' | 'active';

interface ProPaymentData {
  connectStatus: ConnectStatus;
  proId: string;
  email: string;
  availableCents: number;
  pendingCents: number;
  totalEarnedCents: number;
  payouts: Payout[];
  totalPayoutCount: number;
}

// ---------------------------------------------------------------------------
// Data fetching (server-side)
// ---------------------------------------------------------------------------

async function getProPaymentData(): Promise<ProPaymentData> {
  // TODO: Replace with real database/auth queries
  // const user = await currentUser();
  // const pro = await db.query.pros.findFirst({ where: eq(pros.userId, user.id) });
  // const payouts = await db.query.payouts.findMany({ where: eq(...), limit: 5, orderBy: desc(...) });

  return {
    connectStatus: 'not_connected',
    proId: 'pro_placeholder',
    email: 'pro@example.com',
    availableCents: 0,
    pendingCents: 0,
    totalEarnedCents: 0,
    payouts: [],
    totalPayoutCount: 0,
  };
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function ConnectStatusBadge({ status }: { status: ConnectStatus }) {
  const config: Record<ConnectStatus, { label: string; className: string }> = {
    not_connected: {
      label: 'Not Connected',
      className:
        'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    },
    pending: {
      label: 'Pending Verification',
      className:
        'bg-sky-50 text-[#00a9e0] dark:bg-sky-900/30 dark:text-sky-400',
    },
    active: {
      label: 'Active',
      className:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'active'
            ? 'bg-emerald-500'
            : status === 'pending'
              ? 'bg-[#00a9e0]'
              : 'bg-zinc-400'
        }`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ProPaymentsPage() {
  const data = await getProPaymentData();

  return (
    <div className="flex-1 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Payments
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage your payment account, view balances, and track payouts.
          </p>
        </div>
        <ConnectStatusBadge status={data.connectStatus} />
      </div>

      {/* Connect CTA or Balance cards */}
      {data.connectStatus === 'not_connected' ? (
        <div className="mt-6 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800/50 sm:p-10">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
            />
          </svg>
          <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Set up your payment account
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
            Connect your bank account through Stripe to start receiving payments
            for completed jobs. The setup takes about 5 minutes.
          </p>
          <div className="mt-6 flex justify-center">
            <StripeConnectButton proId={data.proId} email={data.email} />
          </div>
          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
            Powered by Stripe. Your banking information is never stored on our
            servers.
          </p>
        </div>
      ) : data.connectStatus === 'pending' ? (
        <div className="mt-6 rounded-xl border border-[#00a9e0]/20 bg-sky-50 p-6 dark:border-sky-800/50 dark:bg-sky-900/20">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-[#00a9e0]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-[#00a9e0] dark:text-sky-300">
                Verification in progress
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Stripe is reviewing your account details. This usually takes 1-2
                business days. You will be able to receive payouts once
                verification is complete.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Balance cards — only show when connected or pending */}
      {data.connectStatus !== 'not_connected' && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <BalanceCard
            label="Available Balance"
            amountCents={data.availableCents}
            subtitle="Ready to withdraw"
            variant="highlight"
          />
          <BalanceCard
            label="Pending"
            amountCents={data.pendingCents}
            subtitle="Clearing in 2-5 business days"
          />
          <BalanceCard
            label="Total Earned"
            amountCents={data.totalEarnedCents}
            subtitle="Lifetime earnings on Sherpa Pros"
            variant="muted"
          />
        </div>
      )}

      {/* Payout history and commission explainer */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {data.payouts.length === 0 && data.totalPayoutCount === 0 ? (
            <EmptyState
              icon={<BanknotesIcon className="h-8 w-8" />}
              title="No payment history"
              description="Payments appear here after completed jobs. Connect Stripe to enable payouts."
              ctaLabel="Connect Stripe"
              ctaHref="/pro/payments"
            />
          ) : (
            <PayoutHistory
              initialPayouts={data.payouts}
              totalCount={data.totalPayoutCount}
            />
          )}
        </div>
        <div>
          <CommissionExplainer />
        </div>
      </div>
    </div>
  );
}

'use client';

/**
 * ClientSubscriptionContent — Client subscription management page.
 *
 * Sections:
 *   1. "Upgrade to Sherpa Plan" hero
 *   2. Current plan badge
 *   3. PricingTable for client plans
 *   4. Benefits comparison
 *   5. "Need help choosing?" CTA
 */

import PricingTable from '@/components/pricing/PricingTable';
import SubscriptionBadge from '@/components/pricing/SubscriptionBadge';
import Link from 'next/link';

export default function ClientSubscriptionContent() {
  // Mock: current plan is Free
  const currentPlan = 'free' as const;

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      {/* Upgrade Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-[#00a9e0] to-[#0ea5e9] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Upgrade to the Sherpa Plan
            </h1>
            <p className="mt-2 text-base leading-relaxed text-white/85">
              Get a dedicated Sherpa Client Pro, priority matching, and your first job fee-free
              — all for just $29/month.
            </p>
          </div>
          <div className="shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Your Current Plan
        </h2>
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <SubscriptionBadge tier={currentPlan} />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Basic marketplace access with 18% service fee
          </span>
        </div>
      </div>

      {/* Pricing Table */}
      <section>
        <h2 className="mb-6 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Choose Your Plan
        </h2>
        <PricingTable userType="client" />
      </section>

      {/* Benefits Comparison */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Why Upgrade?
        </h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                  Benefit
                </th>
                <th className="px-4 py-3 text-center font-semibold text-zinc-500 dark:text-zinc-400">
                  Free
                </th>
                <th className="px-4 py-3 text-center font-semibold text-[#00a9e0]">
                  Sherpa Plan
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { benefit: 'Post jobs', free: true, sherpa: true },
                { benefit: 'Browse verified pros', free: true, sherpa: true },
                { benefit: 'Marketplace payment protection', free: true, sherpa: true },
                { benefit: 'Service fee', free: '18%', sherpa: '12%' },
                { benefit: 'Dedicated Sherpa Client Pro', free: false, sherpa: true },
                { benefit: 'Priority matching', free: false, sherpa: true },
                { benefit: 'First job fee-free', free: false, sherpa: true },
                { benefit: 'Priority support', free: false, sherpa: true },
              ].map((row, i) => (
                <tr
                  key={row.benefit}
                  className={i % 2 === 0 ? 'bg-zinc-50/50 dark:bg-zinc-950/30' : ''}
                >
                  <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300">
                    {row.benefit}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {typeof row.free === 'string' ? (
                      <span className="text-zinc-500 dark:text-zinc-400">{row.free}</span>
                    ) : row.free ? (
                      <Check />
                    ) : (
                      <Dash />
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {typeof row.sherpa === 'string' ? (
                      <span className="font-semibold text-[#00a9e0]">{row.sherpa}</span>
                    ) : row.sherpa ? (
                      <Check />
                    ) : (
                      <Dash />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Need help choosing? */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Need help choosing?
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Our team can walk you through the benefits and help you pick the right plan.
        </p>
        <Link
          href="/client/messages"
          className="mt-4 inline-flex items-center rounded-full bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0ea5e9] hover:shadow-md"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Check() {
  return (
    <svg
      className="mx-auto h-5 w-5 text-emerald-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-label="Included"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Dash() {
  return (
    <svg
      className="mx-auto h-5 w-5 text-zinc-300 dark:text-zinc-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-label="Not included"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
  );
}

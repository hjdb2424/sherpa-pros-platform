/**
 * CommissionExplainer — Visual breakdown of the sliding commission scale.
 * Shows each tier as a horizontal bar with percentage and range labels.
 */

import { COMMISSION_TIERS } from '@/lib/payments';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

/** Widths for the visual bars — maps to the relative "weight" of each tier */
const TIER_WIDTHS = ['w-1/4', 'w-2/5', 'w-3/5', 'w-full'] as const;
const TIER_COLORS = [
  'bg-[#00a9e0]',
  'bg-[#0ea5e9]',
  'bg-sky-300',
  'bg-sky-200 dark:bg-sky-600',
] as const;

function formatTierRange(minCents: number, maxCents: number): string {
  const minDollars = minCents / 100;
  const fmt = (n: number) =>
    n >= 1000
      ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`
      : `$${n.toFixed(0)}`;

  if (maxCents === Infinity) {
    return `${fmt(minDollars)}+`;
  }
  return `${fmt(minDollars)} - ${fmt(maxCents / 100)}`;
}

export default function CommissionExplainer() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <ShieldCheckIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
        <span>All transactions are encrypted and PCI-compliant</span>
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        Commission Structure
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Platform commission decreases as job value increases. You keep more on
        bigger jobs.
      </p>

      <div className="mt-5 space-y-3">
        {COMMISSION_TIERS.map((tier, i) => (
          <div key={tier.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {formatTierRange(tier.minCents, tier.maxCents)}
              </span>
              <span className="font-bold text-[#00a9e0] dark:text-[#00a9e0]">
                {(tier.rate * 100).toFixed(0)}%
              </span>
            </div>
            <div className="mt-1 h-2.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={`h-2.5 rounded-full ${TIER_COLORS[i]} ${TIER_WIDTHS[i]}`}
                role="presentation"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          <strong className="text-zinc-700 dark:text-zinc-300">Example:</strong>{' '}
          On a $2,000 job, the platform commission is 12% ($240). You receive
          $1,760 directly to your connected bank account.
        </p>
      </div>
    </div>
  );
}

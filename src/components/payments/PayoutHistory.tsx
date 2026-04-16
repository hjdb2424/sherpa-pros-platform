'use client';

/**
 * PayoutHistory — Paginated list of Pro payouts with job reference,
 * amount, date, and status. All amounts stored as integer cents.
 */

import { useCallback, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Payout {
  id: string;
  jobReference: string;
  amountCents: number;
  commissionCents: number;
  netCents: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string; // ISO 8601
}

interface PayoutHistoryProps {
  initialPayouts: Payout[];
  pageSize?: number;
  totalCount: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const STATUS_STYLES: Record<Payout['status'], string> = {
  completed:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending:
    'bg-sky-50 text-[#00a9e0] dark:bg-sky-900/30 dark:text-sky-400',
  failed: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PayoutHistory({
  initialPayouts,
  pageSize = 5,
  totalCount,
}: PayoutHistoryProps) {
  const [payouts, setPayouts] = useState<Payout[]>(initialPayouts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(totalCount / pageSize);

  const loadPage = useCallback(
    async (nextPage: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/payments/payouts?page=${nextPage}&pageSize=${pageSize}`,
        );
        if (res.ok) {
          const data = await res.json();
          setPayouts(data.payouts);
          setPage(nextPage);
        }
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  if (payouts.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <svg
          className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
          />
        </svg>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          No payouts yet. Complete your first job to see your earnings here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Recent Payouts
        </h3>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800 sm:hidden">
        {payouts.map((payout) => (
          <div key={payout.id} className="px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {payout.jobReference}
              </span>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[payout.status]}`}
              >
                {payout.status}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                {formatDate(payout.createdAt)}
              </span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {formatCurrency(payout.netCents)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
              <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Date
              </th>
              <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Job
              </th>
              <th className="px-5 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                Gross
              </th>
              <th className="px-5 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                Commission
              </th>
              <th className="px-5 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                Net
              </th>
              <th className="px-5 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {payouts.map((payout) => (
              <tr key={payout.id} className={loading ? 'opacity-50' : ''}>
                <td className="whitespace-nowrap px-5 py-3 text-zinc-600 dark:text-zinc-400">
                  {formatDate(payout.createdAt)}
                </td>
                <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {payout.jobReference}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right text-zinc-600 dark:text-zinc-400">
                  {formatCurrency(payout.amountCents)}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right text-zinc-500 dark:text-zinc-500">
                  -{formatCurrency(payout.commissionCents)}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-50">
                  {formatCurrency(payout.netCents)}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[payout.status]}`}
                  >
                    {payout.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => loadPage(page - 1)}
              disabled={page <= 1 || loading}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label="Previous page"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => loadPage(page + 1)}
              disabled={page >= totalPages || loading}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

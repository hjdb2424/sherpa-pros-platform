'use client';

import { useState } from 'react';
import StatsCard from '@/components/pro/StatsCard';
import EarningsChart from '@/components/pro/EarningsChart';
import {
  mockEarningsSummary,
  mockMonthlyEarnings,
  mockTransactions,
  mockCommissionTier,
} from '@/lib/mock-data/pro-data';

const statusConfig = {
  released: { label: 'Released', classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  pending: { label: 'Pending', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  held: { label: 'Held', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function EarningsPageClient() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'released' | 'pending' | 'held'>('all');
  const summary = mockEarningsSummary;
  const tier = mockCommissionTier;

  const filteredTransactions = mockTransactions.filter(
    (tx) => statusFilter === 'all' || tx.status === statusFilter
  );

  const progressPct = Math.round((tier.totalEarned / (tier.totalEarned + tier.amountToNext)) * 100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Earnings</h1>

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="This Week"
          value={`$${summary.thisWeek.toLocaleString()}`}
          accentColor="text-emerald-600 dark:text-emerald-400"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
          }
        />
        <StatsCard
          label="This Month"
          value={`$${summary.thisMonth.toLocaleString()}`}
          accentColor="text-emerald-600 dark:text-emerald-400"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          }
        />
        <StatsCard
          label="This Year"
          value={`$${summary.thisYear.toLocaleString()}`}
          accentColor="text-amber-600 dark:text-amber-400"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
        <StatsCard
          label="All-Time"
          value={`$${summary.allTime.toLocaleString()}`}
          accentColor="text-[#1a1a2e] dark:text-amber-400"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
          }
        />
      </div>

      {/* Chart */}
      <EarningsChart data={mockMonthlyEarnings} />

      {/* Commission tier */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Commission Tier</h2>
          <span className="rounded-full bg-slate-300/30 px-3 py-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {tier.currentTier} &mdash; {tier.currentRate}%
          </span>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
            <span>{tier.currentTier} ({tier.currentRate}%)</span>
            <span>{tier.nextTier} ({tier.nextRate}%)</span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-slate-400 to-amber-400 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Earn <span className="font-semibold text-amber-600 dark:text-amber-400">${tier.amountToNext.toLocaleString()}</span> more to reach {tier.nextTier} tier ({tier.nextRate}% commission)
          </p>
        </div>
      </div>

      {/* Transaction history */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 sm:pb-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Transaction History</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="released">Released</option>
            <option value="pending">Pending</option>
            <option value="held">Held</option>
          </select>
        </div>

        {/* Mobile card list */}
        <div className="divide-y divide-zinc-100 sm:hidden dark:divide-zinc-800">
          {filteredTransactions.map((tx) => {
            const stCfg = statusConfig[tx.status];
            return (
              <div key={tx.id} className="px-4 py-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{tx.jobTitle}</p>
                    <p className="text-xs text-zinc-500">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${stCfg.classes}`}>
                    {stCfg.label}
                  </span>
                </div>
                <div className="mt-1 flex gap-4 text-xs text-zinc-500">
                  <span>Gross: ${tx.grossAmount.toLocaleString()}</span>
                  <span>Fee: ${tx.commission}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Net: ${tx.netAmount.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-zinc-100 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Job</th>
                <th className="px-6 py-3 text-right">Gross</th>
                <th className="px-6 py-3 text-right">Fee</th>
                <th className="px-6 py-3 text-right">Net</th>
                <th className="px-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredTransactions.map((tx) => {
                const stCfg = statusConfig[tx.status];
                return (
                  <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="whitespace-nowrap px-6 py-3 text-zinc-500">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-100">{tx.jobTitle}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-zinc-700 dark:text-zinc-300">${tx.grossAmount.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-zinc-500">-${tx.commission}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">${tx.netAmount.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${stCfg.classes}`}>{stCfg.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout settings */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Payout Settings</h2>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Manage your Stripe Connect payout account.</p>
          </div>
          <button
            type="button"
            className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#2a2a3e]"
          >
            Open Stripe Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

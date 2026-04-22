'use client';

import { useState, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtDollars(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  return `$${dollars.toLocaleString('en-US')}.${String(remainder).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Tax data                                                           */
/* ------------------------------------------------------------------ */

const QUARTERLY_DEADLINES = [
  { quarter: 'Q1', deadline: '2026-04-15', label: 'Apr 15, 2026' },
  { quarter: 'Q2', deadline: '2026-06-15', label: 'Jun 15, 2026' },
  { quarter: 'Q3', deadline: '2026-09-15', label: 'Sep 15, 2026' },
  { quarter: 'Q4', deadline: '2027-01-15', label: 'Jan 15, 2027' },
];

// Mock YTD data
const ytdNetIncomeCents = 11_170_000; // $111,700
const SE_TAX_RATE = 0.153;
const SE_INCOME_FACTOR = 0.9235;
const ESTIMATED_INCOME_TAX_RATE = 0.22; // 22% bracket

const seTaxCents = Math.round(ytdNetIncomeCents * SE_TAX_RATE * SE_INCOME_FACTOR);
const incomeTaxCents = Math.round(ytdNetIncomeCents * ESTIMATED_INCOME_TAX_RATE);
const totalAnnualTaxCents = seTaxCents + incomeTaxCents;
const quarterlyPaymentCents = Math.round(totalAnnualTaxCents / 4);

/* ------------------------------------------------------------------ */
/* Countdown helper                                                   */
/* ------------------------------------------------------------------ */

function getCountdown(deadline: string): { days: number; hours: number; isPast: boolean } {
  const now = new Date();
  const target = new Date(deadline + 'T23:59:59');
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, isPast: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours, isPast: false };
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function QuarterlyReminder() {
  const [expanded, setExpanded] = useState(false);
  const [remindToggle, setRemindToggle] = useState(true);

  const nextDeadline = useMemo(() => {
    const now = new Date();
    return QUARTERLY_DEADLINES.find((d) => new Date(d.deadline) >= now) ?? QUARTERLY_DEADLINES[QUARTERLY_DEADLINES.length - 1];
  }, []);

  const countdown = useMemo(() => getCountdown(nextDeadline.deadline), [nextDeadline]);

  const isUrgent = countdown.days <= 14 && !countdown.isPast;
  const borderColor = countdown.isPast
    ? 'border-red-300 dark:border-red-500/30'
    : isUrgent
      ? 'border-amber-300 dark:border-amber-500/30'
      : 'border-zinc-200 dark:border-zinc-800';

  return (
    <div className="space-y-4">
      {/* Main reminder card */}
      <div className={`rounded-xl border-2 bg-white p-6 shadow-sm dark:bg-zinc-900 ${borderColor}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Left: deadline + countdown */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Next Quarterly Payment ({nextDeadline.quarter})
            </p>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">{nextDeadline.label}</p>
            {!countdown.isPast ? (
              <div className="mt-3 flex items-center gap-3">
                <div className={`flex items-center gap-1.5 rounded-lg px-3 py-2 ${
                  isUrgent
                    ? 'bg-amber-50 dark:bg-amber-500/10'
                    : 'bg-zinc-50 dark:bg-zinc-800'
                }`}>
                  <span className={`text-2xl font-bold tabular-nums ${
                    isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-white'
                  }`}>
                    {countdown.days}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">days</span>
                </div>
                <span className="text-zinc-300 dark:text-zinc-600">:</span>
                <div className={`flex items-center gap-1.5 rounded-lg px-3 py-2 ${
                  isUrgent
                    ? 'bg-amber-50 dark:bg-amber-500/10'
                    : 'bg-zinc-50 dark:bg-zinc-800'
                }`}>
                  <span className={`text-2xl font-bold tabular-nums ${
                    isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-white'
                  }`}>
                    {countdown.hours}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">hrs</span>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-500/10">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <span className="text-sm font-bold text-red-700 dark:text-red-400">OVERDUE</span>
              </div>
            )}
          </div>

          {/* Right: amount due */}
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Amount Due
            </p>
            <p className="mt-1 text-3xl font-bold text-[#00a9e0]">
              {fmtDollars(quarterlyPaymentCents)}
            </p>
            <a
              href="https://www.irs.gov/payments/direct-pay"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#00a9e0] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0090c0]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Pay via IRS Direct Pay
            </a>
          </div>
        </div>

        {/* How this is calculated (expandable) */}
        <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            aria-expanded={expanded}
          >
            <span>How this is calculated</span>
            <svg
              className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {expanded && (
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                <table className="w-full" role="presentation">
                  <tbody>
                    <tr>
                      <td className="py-1.5 text-zinc-600 dark:text-zinc-400">YTD Net Income</td>
                      <td className="py-1.5 text-right font-mono tabular-nums font-medium text-zinc-900 dark:text-white">{fmtDollars(ytdNetIncomeCents)}</td>
                    </tr>
                    <tr className="border-t border-zinc-200 dark:border-zinc-700">
                      <td className="py-1.5 text-zinc-600 dark:text-zinc-400">SE Tax (15.3% x 92.35% of net)</td>
                      <td className="py-1.5 text-right font-mono tabular-nums text-zinc-700 dark:text-zinc-300">{fmtDollars(seTaxCents)}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-zinc-600 dark:text-zinc-400">Income Tax (est. 22% bracket)</td>
                      <td className="py-1.5 text-right font-mono tabular-nums text-zinc-700 dark:text-zinc-300">{fmtDollars(incomeTaxCents)}</td>
                    </tr>
                    <tr className="border-t border-zinc-200 dark:border-zinc-700">
                      <td className="py-1.5 font-bold text-zinc-900 dark:text-white">Total Estimated Annual Tax</td>
                      <td className="py-1.5 text-right font-mono tabular-nums font-bold text-zinc-900 dark:text-white">{fmtDollars(totalAnnualTaxCents)}</td>
                    </tr>
                    <tr className="border-t-2 border-[#00a9e0]/30">
                      <td className="py-1.5 font-bold text-[#00a9e0]">Quarterly Payment (Total / 4)</td>
                      <td className="py-1.5 text-right font-mono tabular-nums text-lg font-bold text-[#00a9e0]">{fmtDollars(quarterlyPaymentCents)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Reminder toggle */}
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Remind me 2 weeks before each deadline</span>
          <button
            type="button"
            role="switch"
            aria-checked={remindToggle}
            onClick={() => setRemindToggle(!remindToggle)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              remindToggle ? 'bg-[#00a9e0]' : 'bg-zinc-300 dark:bg-zinc-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${
                remindToggle ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* All deadlines */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">All Quarterly Deadlines</h3>
        </div>
        <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
          {QUARTERLY_DEADLINES.map((d) => {
            const cd = getCountdown(d.deadline);
            const isCurrent = d.quarter === nextDeadline.quarter;
            return (
              <div
                key={d.quarter}
                className={`flex items-center justify-between px-6 py-3 ${
                  isCurrent ? 'bg-[#00a9e0]/5 dark:bg-[#00a9e0]/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                    cd.isPast
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : isCurrent
                        ? 'bg-[#00a9e0]/10 text-[#00a9e0]'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}>
                    {d.quarter}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{d.label}</p>
                    {cd.isPast ? (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Paid</p>
                    ) : (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{cd.days} days remaining</p>
                    )}
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{fmtDollars(quarterlyPaymentCents)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

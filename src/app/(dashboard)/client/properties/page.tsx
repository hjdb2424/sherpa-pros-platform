'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ------------------------------------------------------------------ */
/* Property Owner Profile / Properties View                            */
/* ------------------------------------------------------------------ */

const propertiesOwned = [
  {
    id: 'coastal-duplex',
    name: 'Coastal Duplex',
    address: '14 Harbor Rd, Portsmouth, NH 03801',
    type: 'Duplex',
    pm: 'Seacoast Property Management LLC',
    pmSlug: 'seacoast-pm',
    noi: 2800,
    cashFlow: 1450,
    appreciation: 8.2,
    purchasePrice: 485000,
    currentValue: 542000,
    monthlyRent: 4200,
    taxes: { scheduleE: 33600 },
    improvements: [
      { name: 'New roof', cost: 18500, valueAdded: 24000, date: '2025-06', roi: 30 },
      { name: 'Kitchen remodel Unit A', cost: 12000, valueAdded: 18000, date: '2025-09', roi: 50 },
      { name: 'HVAC replacement', cost: 8500, valueAdded: 10000, date: '2026-01', roi: 18 },
    ],
  },
  {
    id: 'downtown-studio',
    name: 'Downtown Studio Building',
    address: '88 Congress St, Portsmouth, NH 03801',
    type: 'Multi-unit (4)',
    pm: 'Self-managed',
    pmSlug: null,
    noi: 5200,
    cashFlow: 3100,
    appreciation: 5.8,
    purchasePrice: 620000,
    currentValue: 656000,
    monthlyRent: 7800,
    taxes: { scheduleE: 62400 },
    improvements: [
      { name: 'Common area renovation', cost: 22000, valueAdded: 30000, date: '2025-04', roi: 36 },
      { name: 'Energy-efficient windows', cost: 16000, valueAdded: 20000, date: '2025-11', roi: 25 },
    ],
  },
];

const pmPerformance = {
  name: 'Seacoast Property Management LLC',
  overallRating: 4.8,
  metrics: [
    { label: 'Response Time', value: '<2 hrs', benchmark: '4 hrs avg', good: true },
    { label: 'Maintenance Cost', value: '$42/unit/mo', benchmark: '$54 market avg', good: true },
    { label: 'Tenant Retention', value: '87%', benchmark: '72% market avg', good: true },
    { label: 'Vacancy Rate', value: '6%', benchmark: '8% market avg', good: true },
  ],
};

/* ------------------------------------------------------------------ */
/* Stars Component                                                     */
/* ------------------------------------------------------------------ */

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-amber-500' : 'text-zinc-300 dark:text-zinc-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function PropertyOwnerPage() {
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);

  const totalNoi = propertiesOwned.reduce((sum, p) => sum + p.noi, 0);
  const totalCashFlow = propertiesOwned.reduce((sum, p) => sum + p.cashFlow, 0);
  const totalValue = propertiesOwned.reduce((sum, p) => sum + p.currentValue, 0);
  const totalScheduleE = propertiesOwned.reduce((sum, p) => sum + p.taxes.scheduleE, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">My Properties</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Your property portfolio, financial performance, and PM oversight.
        </p>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Portfolio Summary                                                 */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total NOI</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">${totalNoi.toLocaleString()}<span className="text-sm font-normal text-zinc-400">/mo</span></p>
        </div>
        <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Cash Flow</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">${totalCashFlow.toLocaleString()}<span className="text-sm font-normal text-zinc-400">/mo</span></p>
        </div>
        <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Portfolio Value</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">${(totalValue / 1000).toFixed(0)}K</p>
        </div>
        <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Schedule E (Annual)</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">${totalScheduleE.toLocaleString()}</p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Properties                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Properties Owned</h2>
        <div className="space-y-4">
          {propertiesOwned.map((prop) => {
            const isExpanded = expandedProperty === prop.id;
            return (
              <div
                key={prop.id}
                className="overflow-hidden rounded-xl border border-[#00a9e033] bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Property header */}
                <button
                  type="button"
                  onClick={() => setExpandedProperty(isExpanded ? null : prop.id)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{prop.name}</h3>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{prop.address}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-[#00a9e0]/10 px-2.5 py-0.5 text-xs font-medium text-[#00a9e0]">{prop.type}</span>
                      <span className="text-zinc-500 dark:text-zinc-400">
                        PM: {prop.pmSlug ? (
                          <Link href={`/profile/${prop.pmSlug}`} className="font-medium text-[#00a9e0] hover:underline" onClick={(e) => e.stopPropagation()}>
                            {prop.pm}
                          </Link>
                        ) : (
                          <span className="font-medium">{prop.pm}</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        ${prop.noi.toLocaleString()}/mo NOI
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        +{prop.appreciation}% appreciation
                      </p>
                    </div>
                    <svg
                      className={`h-5 w-5 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-zinc-100 px-5 pb-5 dark:border-zinc-800">
                    {/* Financial Summary */}
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Monthly Rent</p>
                        <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">${prop.monthlyRent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Cash Flow</p>
                        <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">${prop.cashFlow.toLocaleString()}/mo</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Purchase Price</p>
                        <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">${(prop.purchasePrice / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Current Value</p>
                        <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">${(prop.currentValue / 1000).toFixed(0)}K</p>
                      </div>
                    </div>

                    {/* Improvement ROI Tracker */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Improvement ROI Tracker</h4>
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                          <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800">
                              <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Improvement</th>
                              <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Cost</th>
                              <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Value Added</th>
                              <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">ROI</th>
                              <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                            {prop.improvements.map((imp) => (
                              <tr key={imp.name}>
                                <td className="py-2.5 text-sm font-medium text-zinc-900 dark:text-white">{imp.name}</td>
                                <td className="py-2.5 text-right text-sm text-zinc-600 dark:text-zinc-400">${imp.cost.toLocaleString()}</td>
                                <td className="py-2.5 text-right text-sm text-emerald-600 dark:text-emerald-400">${imp.valueAdded.toLocaleString()}</td>
                                <td className="py-2.5 text-right text-sm font-semibold text-emerald-600 dark:text-emerald-400">+{imp.roi}%</td>
                                <td className="py-2.5 text-right text-sm text-zinc-500 dark:text-zinc-400">{imp.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Tax Summary */}
                    <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Schedule E Annual Income</p>
                      <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">${prop.taxes.scheduleE.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* PM Performance Review                                             */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">PM Performance Review</h2>
        <div className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00a9e0]/10 text-sm font-bold text-[#00a9e0]">
              SP
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-900 dark:text-white">{pmPerformance.name}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <Stars rating={pmPerformance.overallRating} />
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{pmPerformance.overallRating}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {pmPerformance.metrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3 dark:border-zinc-800">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{metric.label}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Benchmark: {metric.benchmark}</p>
                </div>
                <span className={`text-sm font-bold ${metric.good ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

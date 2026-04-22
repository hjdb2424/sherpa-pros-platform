'use client';

import { useState } from 'react';

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

interface Vendor {
  name: string;
  trade: string;
  avgResponseHours: number;
  avgCostPerWO: number;
  completionRate: number;
  qualityRating: number;
  wosCompleted: number;
}

const vendors: Vendor[] = [
  { name: 'Mike Rodriguez', trade: 'Plumbing', avgResponseHours: 1.4, avgCostPerWO: 312, completionRate: 97, qualityRating: 4.8, wosCompleted: 23 },
  { name: 'Sarah Chen', trade: 'Electrical', avgResponseHours: 2.1, avgCostPerWO: 445, completionRate: 91, qualityRating: 4.5, wosCompleted: 18 },
  { name: 'James Wilson', trade: 'HVAC', avgResponseHours: 1.8, avgCostPerWO: 520, completionRate: 95, qualityRating: 4.7, wosCompleted: 15 },
  { name: 'Diana Brooks', trade: 'Painting', avgResponseHours: 3.2, avgCostPerWO: 680, completionRate: 89, qualityRating: 4.6, wosCompleted: 12 },
  { name: 'Carlos Rivera', trade: 'Carpentry', avgResponseHours: 2.5, avgCostPerWO: 390, completionRate: 93, qualityRating: 4.9, wosCompleted: 9 },
];

type SortKey = keyof Vendor;

/* ------------------------------------------------------------------ */
/* Star Rating                                                         */
/* ------------------------------------------------------------------ */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">{rating}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function VendorsPage() {
  const [sortKey, setSortKey] = useState<SortKey>('qualityRating');
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...vendors].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return String(aVal).localeCompare(String(bVal)) * (sortAsc ? 1 : -1);
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return (
      <svg className="ml-1 inline h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={sortAsc ? 'M4.5 15.75l7.5-7.5 7.5 7.5' : 'M19.5 8.25l-7.5 7.5-7.5-7.5'} />
      </svg>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Vendors</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {vendors.length} preferred vendors across your portfolio.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Preferred Vendor
        </button>
      </div>

      {/* Scorecard Table */}
      <div className="overflow-x-auto rounded-xl border border-[#00a9e033] bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              {[
                { key: 'name' as SortKey, label: 'Pro Name' },
                { key: 'trade' as SortKey, label: 'Trade' },
                { key: 'avgResponseHours' as SortKey, label: 'Avg Response' },
                { key: 'avgCostPerWO' as SortKey, label: 'Avg Cost/WO' },
                { key: 'completionRate' as SortKey, label: 'Completion' },
                { key: 'qualityRating' as SortKey, label: 'Quality' },
                { key: 'wosCompleted' as SortKey, label: 'WOs Done' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="cursor-pointer select-none px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  <SortIcon col={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {sorted.map((v) => (
              <tr
                key={v.name}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00a9e0]/10 text-xs font-bold text-[#00a9e0]">
                      {v.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="font-medium text-zinc-900 dark:text-white">{v.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                    {v.trade}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${v.avgResponseHours <= 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {v.avgResponseHours}hr
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">${v.avgCostPerWO}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${v.completionRate >= 95 ? 'text-emerald-600 dark:text-emerald-400' : v.completionRate >= 90 ? 'text-[#00a9e0]' : 'text-amber-600 dark:text-amber-400'}`}>
                    {v.completionRate}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StarRating rating={v.qualityRating} />
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{v.wosCompleted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

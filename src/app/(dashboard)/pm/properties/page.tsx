'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const PROPERTY_TYPES = ['All', 'Multi-Family', 'Mixed-Use', 'Condo', 'Student Housing'] as const;

const properties = [
  {
    id: 'maple-ridge',
    name: 'Maple Ridge Apartments',
    type: 'Multi-Family',
    units: 48,
    occupancy: 94,
    openWOs: 6,
    mtdSpend: 8100,
    budget: 7500,
  },
  {
    id: '220-main',
    name: '220 Main St Mixed-Use',
    type: 'Mixed-Use',
    units: 15,
    occupancy: 87,
    openWOs: 2,
    mtdSpend: 3400,
    budget: 3200,
  },
  {
    id: 'harbor-view',
    name: 'Harbor View Condos',
    type: 'Condo',
    units: 24,
    occupancy: 100,
    openWOs: 3,
    mtdSpend: 1800,
    budget: 2000,
  },
  {
    id: 'elm-street',
    name: 'College Park Student Housing',
    type: 'Student Housing',
    units: 36,
    occupancy: 92,
    openWOs: 1,
    mtdSpend: 900,
    budget: 1000,
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PropertiesPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filtered = properties.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Properties</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {properties.length} properties &middot; {properties.reduce((s, p) => s + p.units, 0)} total units
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filter by property type"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-700 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#00a9e033] bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Name</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Type</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">Units</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">Occupancy</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">Open WOs</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">MTD Spend</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">Budget</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map((p) => {
              const variance = ((p.mtdSpend - p.budget) / p.budget) * 100;
              const overBudget = variance > 0;
              return (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-4 py-3">
                    <Link href={`/pm/properties/${p.id}`} className="font-medium text-zinc-900 hover:text-[#00a9e0] dark:text-white">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[#00a9e0]/10 px-2.5 py-0.5 text-xs font-medium text-[#00a9e0]">
                      {p.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">{p.units}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${p.occupancy >= 95 ? 'text-emerald-600 dark:text-emerald-400' : p.occupancy >= 90 ? 'text-[#00a9e0]' : 'text-amber-600 dark:text-amber-400'}`}>
                      {p.occupancy}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${p.openWOs > 4 ? 'text-[#ff4500]' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      {p.openWOs}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">
                    ${p.mtdSpend.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${overBudget ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {overBudget ? '+' : ''}{variance.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-zinc-400">
                  No properties match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

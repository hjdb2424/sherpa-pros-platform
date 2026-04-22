'use client';

import { useState } from 'react';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface MakeReadyItem {
  id: string;
  unit: string;
  property: string;
  vacateDate: string;
  targetReadyDate: string;
  daysVacant: number;
  vacancyCostPerDay: number;
  punchListTotal: number;
  punchListDone: number;
  assignedPros: string[];
  totalCost: number;
  column: string;
}

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const initialItems: MakeReadyItem[] = [
  {
    id: 'MR-001',
    unit: 'Unit 305',
    property: 'Maple Ridge Apartments',
    vacateDate: 'Mar 28',
    targetReadyDate: 'Apr 18',
    daysVacant: 18,
    vacancyCostPerDay: 45,
    punchListTotal: 8,
    punchListDone: 3,
    assignedPros: ['Mike Rodriguez', 'Diana Brooks'],
    totalCost: 3200,
    column: 'in_progress',
  },
  {
    id: 'MR-002',
    unit: 'Unit 7A',
    property: 'Harbor View Condos',
    vacateDate: 'Apr 5',
    targetReadyDate: 'Apr 25',
    daysVacant: 10,
    vacancyCostPerDay: 65,
    punchListTotal: 6,
    punchListDone: 0,
    assignedPros: [],
    totalCost: 0,
    column: 'pending',
  },
  {
    id: 'MR-003',
    unit: 'Unit 2A',
    property: '220 Main St Mixed-Use',
    vacateDate: 'Apr 1',
    targetReadyDate: 'Apr 20',
    daysVacant: 14,
    vacancyCostPerDay: 55,
    punchListTotal: 10,
    punchListDone: 7,
    assignedPros: ['Sarah Chen', 'Carlos Rivera'],
    totalCost: 4100,
    column: 'punch_list',
  },
  {
    id: 'MR-004',
    unit: 'Unit 118',
    property: 'Maple Ridge Apartments',
    vacateDate: 'Apr 8',
    targetReadyDate: 'Apr 22',
    daysVacant: 7,
    vacancyCostPerDay: 45,
    punchListTotal: 5,
    punchListDone: 5,
    assignedPros: ['James Wilson'],
    totalCost: 1800,
    column: 'final_inspection',
  },
  {
    id: 'MR-005',
    unit: 'Unit 12',
    property: 'Elm Street Student Housing',
    vacateDate: 'Mar 20',
    targetReadyDate: 'Apr 10',
    daysVacant: 26,
    vacancyCostPerDay: 35,
    punchListTotal: 4,
    punchListDone: 4,
    assignedPros: ['Diana Brooks'],
    totalCost: 2900,
    column: 'ready',
  },
];

const columns = [
  { id: 'pending', label: 'Pending', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
  { id: 'punch_list', label: 'Punch List', color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' },
  { id: 'final_inspection', label: 'Final Inspection', color: 'bg-sky-100 text-[#00a9e0] dark:bg-[#00a9e0]/10' },
  { id: 'ready', label: 'Ready', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MakeReadyPage() {
  const [items, setItems] = useState(initialItems);

  function moveItem(itemId: string, direction: 'next' | 'prev') {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const colIdx = columns.findIndex((c) => c.id === item.column);
        const newIdx = direction === 'next' ? colIdx + 1 : colIdx - 1;
        if (newIdx < 0 || newIdx >= columns.length) return item;
        return { ...item, column: columns[newIdx].id };
      })
    );
  }

  // Stats
  const totalUnits = items.length;
  const avgDaysToReady = Math.round(items.reduce((sum, i) => sum + i.daysVacant, 0) / totalUnits);
  const totalVacancyCost = items.reduce((sum, i) => sum + i.daysVacant * i.vacancyCostPerDay, 0);
  const avgMakeReadyCost = Math.round(items.filter((i) => i.totalCost > 0).reduce((sum, i) => sum + i.totalCost, 0) / Math.max(items.filter((i) => i.totalCost > 0).length, 1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
          Make-Ready Pipeline
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Track unit turnovers from vacate to ready-to-lease.
        </p>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-3" style={{ minWidth: '1100px' }}>
          {columns.map((col) => {
            const colItems = items.filter((i) => i.column === col.id);
            return (
              <div
                key={col.id}
                className="w-56 shrink-0 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{col.label}</span>
                  <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${col.color}`}>
                    {colItems.length}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 p-2">
                  {colItems.length === 0 && (
                    <p className="py-6 text-center text-xs text-zinc-400">No units</p>
                  )}
                  {colItems.map((item) => {
                    const colIdx = columns.findIndex((c) => c.id === item.column);
                    const canMoveNext = colIdx < columns.length - 1;
                    const canMovePrev = colIdx > 0;

                    return (
                      <div
                        key={item.id}
                        className="rounded-lg border border-[#00a9e033] bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                      >
                        {/* Unit + Property */}
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.unit}</p>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{item.property}</p>
                          </div>
                          {item.daysVacant > 14 && (
                            <span className="inline-flex rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-500/20 dark:text-red-400">
                              {item.daysVacant}d
                            </span>
                          )}
                          {item.daysVacant <= 14 && (
                            <span className="inline-flex rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                              {item.daysVacant}d
                            </span>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                          <span>{item.vacateDate}</span>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                          <span>{item.targetReadyDate}</span>
                        </div>

                        {/* Vacancy cost */}
                        <p className="mt-1.5 text-[10px] text-amber-600 dark:text-amber-400">
                          ${(item.daysVacant * item.vacancyCostPerDay).toLocaleString()} vacancy loss
                        </p>

                        {/* Punch list progress */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-500 dark:text-zinc-400">Punch list</span>
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                              {item.punchListDone}/{item.punchListTotal}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                            <div
                              className="h-full rounded-full bg-[#00a9e0] transition-all"
                              style={{ width: `${item.punchListTotal > 0 ? (item.punchListDone / item.punchListTotal) * 100 : 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Assigned pros */}
                        {item.assignedPros.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.assignedPros.map((pro) => (
                              <span
                                key={pro}
                                className="inline-flex rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                              >
                                {pro.split(' ')[0]}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Total cost */}
                        {item.totalCost > 0 && (
                          <p className="mt-2 text-xs font-semibold text-zinc-900 dark:text-white">
                            ${item.totalCost.toLocaleString()}
                          </p>
                        )}

                        {/* Move actions */}
                        <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800">
                          <button
                            type="button"
                            onClick={() => moveItem(item.id, 'prev')}
                            disabled={!canMovePrev}
                            className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                            aria-label="Move to previous stage"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(item.id, 'next')}
                            disabled={!canMoveNext}
                            className="flex h-6 w-6 items-center justify-center rounded text-[#00a9e0] transition-colors hover:bg-[#00a9e0]/10 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Move to next stage"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[#00a9e033] bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Units in Pipeline
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{totalUnits}</p>
        </div>
        <div className="rounded-xl border border-[#00a9e033] bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Avg Days to Ready
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{avgDaysToReady}</p>
        </div>
        <div className="rounded-xl border border-[#00a9e033] bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Total Vacancy Cost
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">${totalVacancyCost.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[#00a9e033] bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Avg Make-Ready Cost
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">${avgMakeReadyCost.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

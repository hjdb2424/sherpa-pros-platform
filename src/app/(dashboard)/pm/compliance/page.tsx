'use client';

import { useState, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface ComplianceItem {
  id: string;
  property: string;
  item: string;
  type: string;
  dueDate: string;
  dueDateObj: Date;
  status: 'overdue' | 'due_soon' | 'current';
  statusLabel: string;
  daysOverdue: number | null;
  fineRisk: string | null;
  fineAmount: number;
}

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const complianceItems: ComplianceItem[] = [
  {
    id: 'C-001',
    property: '220 Main St',
    item: 'Fire Extinguisher Inspection',
    type: 'Safety',
    dueDate: 'Mar 15, 2026',
    dueDateObj: new Date(2026, 2, 15),
    status: 'overdue',
    statusLabel: 'OVERDUE',
    daysOverdue: 31,
    fineRisk: '$500/day',
    fineAmount: 500,
  },
  {
    id: 'C-002',
    property: 'Maple Ridge',
    item: 'Elevator Certification',
    type: 'Safety',
    dueDate: 'Apr 1, 2026',
    dueDateObj: new Date(2026, 3, 1),
    status: 'overdue',
    statusLabel: 'OVERDUE',
    daysOverdue: 14,
    fineRisk: '$1,000/day',
    fineAmount: 1000,
  },
  {
    id: 'C-003',
    property: 'Harbor View',
    item: 'Boiler Inspection',
    type: 'Mechanical',
    dueDate: 'May 12, 2026',
    dueDateObj: new Date(2026, 4, 12),
    status: 'due_soon',
    statusLabel: 'Due Soon',
    daysOverdue: null,
    fineRisk: '$250/day',
    fineAmount: 250,
  },
  {
    id: 'C-004',
    property: 'College Park Student Housing',
    item: 'Lead Paint Certification',
    type: 'Environmental',
    dueDate: 'May 30, 2026',
    dueDateObj: new Date(2026, 4, 30),
    status: 'due_soon',
    statusLabel: 'Due Soon',
    daysOverdue: null,
    fineRisk: '$1,500/day',
    fineAmount: 1500,
  },
  {
    id: 'C-005',
    property: 'Maple Ridge',
    item: 'Backflow Prevention Test',
    type: 'Plumbing',
    dueDate: 'Jun 15, 2026',
    dueDateObj: new Date(2026, 5, 15),
    status: 'due_soon',
    statusLabel: 'Due Soon',
    daysOverdue: null,
    fineRisk: '$200/day',
    fineAmount: 200,
  },
  {
    id: 'C-006',
    property: 'Harbor View',
    item: 'Fire Alarm System Test',
    type: 'Safety',
    dueDate: 'Aug 1, 2026',
    dueDateObj: new Date(2026, 7, 1),
    status: 'current',
    statusLabel: 'Current',
    daysOverdue: null,
    fineRisk: null,
    fineAmount: 0,
  },
  {
    id: 'C-007',
    property: '220 Main St',
    item: 'Elevator Certification',
    type: 'Safety',
    dueDate: 'Oct 15, 2026',
    dueDateObj: new Date(2026, 9, 15),
    status: 'current',
    statusLabel: 'Current',
    daysOverdue: null,
    fineRisk: null,
    fineAmount: 0,
  },
  {
    id: 'C-008',
    property: 'College Park Student Housing',
    item: 'Pest Inspection',
    type: 'Health',
    dueDate: 'Nov 1, 2026',
    dueDateObj: new Date(2026, 10, 1),
    status: 'current',
    statusLabel: 'Current',
    daysOverdue: null,
    fineRisk: null,
    fineAmount: 0,
  },
];

/* ------------------------------------------------------------------ */
/* Calendar helpers                                                    */
/* ------------------------------------------------------------------ */

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CompliancePage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'property' | 'fineAmount'>('dueDate');
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [calMonth, setCalMonth] = useState(3); // April 2026
  const [calYear] = useState(2026);

  const overdueCount = complianceItems.filter((i) => i.status === 'overdue').length;
  const dueSoonCount = complianceItems.filter((i) => i.status === 'due_soon').length;

  const properties = useMemo(() => {
    const set = new Set(complianceItems.map((i) => i.property));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    let result = complianceItems;
    if (statusFilter !== 'all') {
      result = result.filter((i) => i.status === statusFilter);
    }
    if (propertyFilter !== 'all') {
      result = result.filter((i) => i.property === propertyFilter);
    }
    result = [...result].sort((a, b) => {
      if (sortBy === 'dueDate') return a.dueDateObj.getTime() - b.dueDateObj.getTime();
      if (sortBy === 'property') return a.property.localeCompare(b.property);
      return b.fineAmount - a.fineAmount;
    });
    return result;
  }, [statusFilter, propertyFilter, sortBy]);

  function handleSchedule(item: ComplianceItem) {
    alert(`Scheduling ${item.item} for ${item.property}. A pro will be dispatched.`);
  }

  /* Calendar items for the current month */
  const calItems = complianceItems.filter((i) => {
    return i.dueDateObj.getMonth() === calMonth && i.dueDateObj.getFullYear() === calYear;
  });

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfWeek(calYear, calMonth);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
            Compliance Tracking
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Monitor inspections, certifications, and regulatory requirements.
          </p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setView('table')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              view === 'table'
                ? 'bg-[#00a9e0] text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Table
          </button>
          <button
            type="button"
            onClick={() => setView('calendar')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              view === 'calendar'
                ? 'bg-[#00a9e0] text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Alert Bars */}
      <div className="space-y-2">
        {overdueCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
              <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </span>
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              {overdueCount} overdue item{overdueCount > 1 ? 's' : ''} require immediate attention
            </p>
          </div>
        )}
        {dueSoonCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20">
              <svg className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {dueSoonCount} item{dueSoonCount > 1 ? 's' : ''} due in the next 30 days
            </p>
          </div>
        )}
      </div>

      {/* Table View */}
      {view === 'table' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'due_soon', label: 'Due Soon' },
                { value: 'current', label: 'Current' },
              ].map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setStatusFilter(f.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                    statusFilter === f.value
                      ? 'bg-[#00a9e0] text-white shadow-sm'
                      : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700 dark:hover:bg-zinc-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              aria-label="Filter by property"
            >
              <option value="all">All Properties</option>
              {properties.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              aria-label="Sort by"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="property">Sort by Property</option>
              <option value="fineAmount">Sort by Fine Risk</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Property</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Item</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Due Date</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Days Overdue</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Fine Risk</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{item.property}</td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{item.item}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{item.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.status === 'overdue'
                          ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                          : item.status === 'due_soon'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      }`}>
                        {item.statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.daysOverdue ? (
                        <span className="font-semibold text-red-600 dark:text-red-400">{item.daysOverdue} days</span>
                      ) : (
                        <span className="text-zinc-400">&mdash;</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.fineRisk ? (
                        <span className="font-medium text-zinc-900 dark:text-white">{item.fineRisk}</span>
                      ) : (
                        <span className="text-zinc-400">&mdash;</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.status === 'overdue' ? (
                        <button
                          type="button"
                          onClick={() => handleSchedule(item)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md"
                        >
                          Schedule Now
                        </button>
                      ) : item.status === 'due_soon' ? (
                        <button
                          type="button"
                          onClick={() => handleSchedule(item)}
                          className="rounded-lg bg-[#00a9e0] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md"
                        >
                          Schedule
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Month navigation */}
          <div className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCalMonth((m) => (m === 0 ? 11 : m - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              aria-label="Previous month"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {MONTH_NAMES[calMonth]} {calYear}
            </h2>
            <button
              type="button"
              onClick={() => setCalMonth((m) => (m === 11 ? 0 : m + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              aria-label="Next month"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-px">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="pb-2 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px">
            {/* Empty cells for days before the first */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px] rounded-lg bg-zinc-50 p-1 dark:bg-zinc-800/30" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayItems = calItems.filter((ci) => ci.dueDateObj.getDate() === day);
              const isToday = day === 15 && calMonth === 3; // Mock: Apr 15

              return (
                <div
                  key={day}
                  className={`min-h-[80px] rounded-lg border p-1.5 ${
                    isToday
                      ? 'border-[#00a9e0] bg-[#00a9e0]/5 dark:border-[#0ea5e9] dark:bg-[#0ea5e9]/5'
                      : 'border-transparent bg-zinc-50 dark:bg-zinc-800/30'
                  }`}
                >
                  <span className={`text-xs font-medium ${
                    isToday
                      ? 'text-[#00a9e0] dark:text-[#0ea5e9]'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayItems.map((ci) => (
                      <div
                        key={ci.id}
                        className={`rounded px-1 py-0.5 text-[9px] font-medium leading-tight truncate ${
                          ci.status === 'overdue'
                            ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                            : ci.status === 'due_soon'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        }`}
                        title={`${ci.item} — ${ci.property}`}
                      >
                        {ci.item.split(' ').slice(0, 2).join(' ')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Overdue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Due Soon
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Current
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

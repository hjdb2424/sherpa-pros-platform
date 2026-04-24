'use client';

import { useState, useMemo } from 'react';
import {
  CalendarDaysIcon,
  PlusIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */

function formatCents(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}.${String(remainder).padStart(2, '0')}`;
}

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type ScheduleStatus = 'on-track' | 'overdue' | 'upcoming';
type FilterTab = 'all' | 'overdue' | 'this-week' | 'this-month';

interface MaintenanceSchedule {
  id: string;
  taskName: string;
  frequency: string;
  properties: string[];
  nextDue: string;
  nextDueDaysOut: number;
  lastCompleted: string | null;
  estimatedCostCents: number;
  assignedVendor: string | null;
  status: ScheduleStatus;
  icon: string;
}

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const SCHEDULES: MaintenanceSchedule[] = [
  {
    id: 's1',
    taskName: 'HVAC Filter Changes',
    frequency: 'Quarterly',
    properties: ['Maple Ridge', '220 Main St', 'Harbor View', 'Student Housing'],
    nextDue: 'Apr 30, 2026',
    nextDueDaysOut: 8,
    lastCompleted: 'Jan 28, 2026',
    estimatedCostCents: 185_000,
    assignedVendor: 'James Wilson HVAC',
    status: 'upcoming',
    icon: '\u2744\uFE0F',
  },
  {
    id: 's2',
    taskName: 'Fire Extinguisher Inspections',
    frequency: 'Annual',
    properties: ['Maple Ridge', '220 Main St', 'Harbor View', 'Student Housing'],
    nextDue: 'Jun 15, 2026',
    nextDueDaysOut: 54,
    lastCompleted: 'Jun 15, 2025',
    estimatedCostCents: 320_000,
    assignedVendor: 'NH Fire Safety Co.',
    status: 'on-track',
    icon: '\uD83E\uDDEF',
  },
  {
    id: 's3',
    taskName: 'Gutter Cleaning',
    frequency: 'Bi-annual (Spring/Fall)',
    properties: ['Maple Ridge', 'Harbor View', 'Student Housing'],
    nextDue: 'Apr 25, 2026',
    nextDueDaysOut: 3,
    lastCompleted: 'Oct 12, 2025',
    estimatedCostCents: 95_000,
    assignedVendor: null,
    status: 'upcoming',
    icon: '\uD83C\uDF43',
  },
  {
    id: 's4',
    taskName: 'Pest Control Service',
    frequency: 'Monthly',
    properties: ['Maple Ridge', '220 Main St', 'Student Housing'],
    nextDue: 'Apr 15, 2026',
    nextDueDaysOut: -7,
    lastCompleted: 'Mar 15, 2026',
    estimatedCostCents: 45_000,
    assignedVendor: 'Seacoast Pest Control',
    status: 'overdue',
    icon: '\uD83D\uDC1B',
  },
  {
    id: 's5',
    taskName: 'Landscaping',
    frequency: 'Weekly (Apr-Oct)',
    properties: ['Maple Ridge', 'Harbor View'],
    nextDue: 'Apr 24, 2026',
    nextDueDaysOut: 2,
    lastCompleted: 'Apr 17, 2026',
    estimatedCostCents: 35_000,
    assignedVendor: 'Green Thumb Landscaping',
    status: 'on-track',
    icon: '\uD83C\uDF3F',
  },
  {
    id: 's6',
    taskName: 'Snow Removal',
    frequency: 'Seasonal (Nov-Mar)',
    properties: ['Maple Ridge', '220 Main St', 'Harbor View', 'Student Housing'],
    nextDue: 'Nov 1, 2026',
    nextDueDaysOut: 193,
    lastCompleted: 'Mar 22, 2026',
    estimatedCostCents: 250_000,
    assignedVendor: 'Northeast Plowing LLC',
    status: 'on-track',
    icon: '\u2744\uFE0F',
  },
  {
    id: 's7',
    taskName: 'Elevator Inspection',
    frequency: 'Annual',
    properties: ['220 Main St'],
    nextDue: 'May 10, 2026',
    nextDueDaysOut: 18,
    lastCompleted: 'May 10, 2025',
    estimatedCostCents: 180_000,
    assignedVendor: null,
    status: 'upcoming',
    icon: '\uD83D\uDEA1',
  },
  {
    id: 's8',
    taskName: 'Pool Maintenance',
    frequency: 'Weekly (May-Sep)',
    properties: ['Harbor View'],
    nextDue: 'May 1, 2026',
    nextDueDaysOut: 9,
    lastCompleted: 'Sep 30, 2025',
    estimatedCostCents: 28_000,
    assignedVendor: null,
    status: 'upcoming',
    icon: '\uD83C\uDFCA',
  },
];

/* ------------------------------------------------------------------ */
/* Status badge                                                        */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: ScheduleStatus }) {
  const styles = {
    'on-track': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    upcoming: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  };
  const labels = {
    'on-track': 'On Track',
    overdue: 'Overdue',
    upcoming: 'Upcoming',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SchedulesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs: { key: FilterTab; label: string; count: number }[] = useMemo(() => {
    const overdue = SCHEDULES.filter((s) => s.status === 'overdue').length;
    const thisWeek = SCHEDULES.filter((s) => s.nextDueDaysOut >= 0 && s.nextDueDaysOut <= 7).length;
    const thisMonth = SCHEDULES.filter((s) => s.nextDueDaysOut >= 0 && s.nextDueDaysOut <= 30).length;
    return [
      { key: 'all', label: 'All', count: SCHEDULES.length },
      { key: 'overdue', label: 'Overdue', count: overdue },
      { key: 'this-week', label: 'This Week', count: thisWeek },
      { key: 'this-month', label: 'This Month', count: thisMonth },
    ];
  }, []);

  const filtered = useMemo(() => {
    switch (activeTab) {
      case 'overdue':
        return SCHEDULES.filter((s) => s.status === 'overdue');
      case 'this-week':
        return SCHEDULES.filter((s) => s.nextDueDaysOut >= 0 && s.nextDueDaysOut <= 7);
      case 'this-month':
        return SCHEDULES.filter((s) => s.nextDueDaysOut >= 0 && s.nextDueDaysOut <= 30);
      default:
        return SCHEDULES;
    }
  }, [activeTab]);

  // Sort: overdue first, then by nextDueDaysOut ascending
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (b.status === 'overdue' && a.status !== 'overdue') return 1;
      return a.nextDueDaysOut - b.nextDueDaysOut;
    });
  }, [filtered]);

  const totalEstimatedAnnual = SCHEDULES.reduce((sum, s) => {
    const multiplier =
      s.frequency.toLowerCase().includes('weekly') ? 52 :
      s.frequency.toLowerCase().includes('monthly') ? 12 :
      s.frequency.toLowerCase().includes('quarterly') ? 4 :
      s.frequency.toLowerCase().includes('bi-annual') ? 2 : 1;
    return sum + s.estimatedCostCents * multiplier;
  }, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Schedules
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage recurring maintenance schedules across your portfolio.
            Estimated annual cost: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{formatCents(totalEstimatedAnnual)}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#00a9e0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0098cc]"
        >
          <PlusIcon className="h-4 w-4" />
          Create Schedule
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              activeTab === tab.key
                ? 'bg-[#00a9e0] text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700',
            )}
          >
            {tab.label}
            <span className={cn(
              'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold',
              activeTab === tab.key
                ? 'bg-white/20 text-white'
                : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400',
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Schedule Cards */}
      <div className="mt-6 space-y-4">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <CalendarDaysIcon className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              No schedules match this filter
            </p>
          </div>
        ) : (
          sorted.map((schedule) => (
            <div
              key={schedule.id}
              className={cn(
                'rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900',
                schedule.status === 'overdue'
                  ? 'border-red-200 dark:border-red-500/30'
                  : 'border-zinc-200 dark:border-zinc-800',
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Left: task info */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden="true">{schedule.icon}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        {schedule.taskName}
                      </h3>
                      <StatusBadge status={schedule.status} />
                    </div>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {schedule.frequency}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {schedule.properties.map((prop) => (
                        <span
                          key={prop}
                          className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {prop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: details */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:text-right">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Next Due
                    </p>
                    <p className={cn(
                      'font-semibold',
                      schedule.status === 'overdue'
                        ? 'text-red-600 dark:text-red-400'
                        : schedule.nextDueDaysOut <= 7
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-zinc-700 dark:text-zinc-300',
                    )}>
                      {schedule.nextDue}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Last Completed
                    </p>
                    <p className="font-medium text-zinc-600 dark:text-zinc-400">
                      {schedule.lastCompleted ?? 'Never'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Est. Cost
                    </p>
                    <p className="font-mono font-bold text-zinc-900 dark:text-white">
                      {formatCents(schedule.estimatedCostCents)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Vendor
                    </p>
                    {schedule.assignedVendor ? (
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">
                        {schedule.assignedVendor}
                      </p>
                    ) : (
                      <p className="font-medium text-red-500 dark:text-red-400">
                        Unassigned
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Overdue warning */}
              {schedule.status === 'overdue' && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-500/10">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                  <p className="text-xs font-medium text-red-700 dark:text-red-400">
                    This task is {Math.abs(schedule.nextDueDaysOut)} days overdue. Assign a vendor or reschedule.
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary row */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-5 w-5 text-[#00a9e0]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total Schedules</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{SCHEDULES.length}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-white p-4 dark:border-red-500/30 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Overdue</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
            {SCHEDULES.filter((s) => s.status === 'overdue').length}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-4 dark:border-amber-500/30 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Unassigned</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {SCHEDULES.filter((s) => !s.assignedVendor).length}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">On Track</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {SCHEDULES.filter((s) => s.status === 'on-track').length}
          </p>
        </div>
      </div>

      {/* Create Schedule Modal (Stub) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Create Schedule</h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex flex-col items-center py-8">
              <CalendarDaysIcon className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                Schedule creation is coming soon.
              </p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                You will be able to set task, frequency, properties, vendor, and cost.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="mt-2 w-full rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

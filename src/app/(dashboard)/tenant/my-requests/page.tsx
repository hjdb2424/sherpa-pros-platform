'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const requests = [
  {
    id: 'MR-1042',
    title: 'Kitchen faucet leaking',
    category: 'Plumbing',
    status: 'in_progress',
    statusLabel: 'In Progress',
    statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    submittedDate: 'Apr 13, 2026',
    assignedPro: 'Mike Rodriguez',
    scheduledDate: 'Apr 16, 2026 — 10:00 AM',
    timeline: [
      { date: 'Apr 13', event: 'Request submitted', done: true },
      { date: 'Apr 13', event: 'Approved by property manager', done: true },
      { date: 'Apr 14', event: 'Mike Rodriguez assigned', done: true },
      { date: 'Apr 16', event: 'Scheduled visit — 10:00 AM', done: false },
      { date: '', event: 'Work completed', done: false },
    ],
  },
  {
    id: 'MR-1041',
    title: 'Bathroom exhaust fan not working',
    category: 'Electrical',
    status: 'scheduled',
    statusLabel: 'Scheduled',
    statusColor: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    submittedDate: 'Apr 10, 2026',
    assignedPro: 'Sarah Chen',
    scheduledDate: 'Apr 18, 2026 — 2:00 PM',
    timeline: [
      { date: 'Apr 10', event: 'Request submitted', done: true },
      { date: 'Apr 11', event: 'Approved by property manager', done: true },
      { date: 'Apr 12', event: 'Sarah Chen assigned', done: true },
      { date: 'Apr 18', event: 'Scheduled visit — 2:00 PM', done: false },
    ],
  },
  {
    id: 'MR-1038',
    title: 'Dishwasher not draining',
    category: 'Appliance',
    status: 'completed',
    statusLabel: 'Completed',
    statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    submittedDate: 'Mar 28, 2026',
    assignedPro: 'Mike Rodriguez',
    scheduledDate: null,
    timeline: [
      { date: 'Mar 28', event: 'Request submitted', done: true },
      { date: 'Mar 28', event: 'Approved by property manager', done: true },
      { date: 'Mar 29', event: 'Mike Rodriguez assigned', done: true },
      { date: 'Mar 31', event: 'Work completed', done: true },
    ],
  },
  {
    id: 'MR-1035',
    title: 'Replace smoke detector battery',
    category: 'Safety',
    status: 'completed',
    statusLabel: 'Completed',
    statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    submittedDate: 'Mar 15, 2026',
    assignedPro: 'Carlos Rivera',
    scheduledDate: null,
    timeline: [
      { date: 'Mar 15', event: 'Request submitted', done: true },
      { date: 'Mar 15', event: 'Approved', done: true },
      { date: 'Mar 16', event: 'Work completed', done: true },
    ],
  },
  {
    id: 'MR-1030',
    title: 'Front door lock sticking',
    category: 'Lock / Key',
    status: 'completed',
    statusLabel: 'Completed',
    statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    submittedDate: 'Feb 22, 2026',
    assignedPro: 'James Wilson',
    scheduledDate: null,
    timeline: [
      { date: 'Feb 22', event: 'Request submitted', done: true },
      { date: 'Feb 23', event: 'Approved and assigned', done: true },
      { date: 'Feb 25', event: 'Work completed', done: true },
    ],
  },
  {
    id: 'MR-1025',
    title: 'Garbage disposal jammed',
    category: 'Plumbing',
    status: 'submitted',
    statusLabel: 'Submitted',
    statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    submittedDate: 'Apr 15, 2026',
    assignedPro: null,
    scheduledDate: null,
    timeline: [
      { date: 'Apr 15', event: 'Request submitted', done: true },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MyRequestsPage() {
  const [expandedId, setExpandedId] = useState<string | null>('MR-1042');
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? requests
    : requests.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            My Requests
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Track the status of your maintenance requests
          </p>
        </div>
        <Link
          href="/tenant/submit-request"
          className="flex items-center gap-2 rounded-lg bg-[#00a9e0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Request
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'submitted', label: 'Submitted' },
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' },
        ].map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-[#00a9e0] text-white shadow-sm'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700 dark:hover:bg-zinc-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Request list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
            No requests match this filter.
          </div>
        )}

        {filtered.map((req) => {
          const isExpanded = expandedId === req.id;
          return (
            <div
              key={req.id}
              className="rounded-xl border border-[#00a9e033] bg-white shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Card header */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : req.id)}
                className="flex w-full items-center justify-between p-4 text-left"
                aria-expanded={isExpanded}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {req.title}
                    </h3>
                    <span className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${req.statusColor}`}>
                      {req.statusLabel}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {req.id} &middot; {req.category} &middot; {req.submittedDate}
                  </p>
                </div>
                <svg
                  className={`ml-2 h-5 w-5 shrink-0 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-zinc-100 px-4 pb-4 pt-3 dark:border-zinc-800">
                  {/* Info row */}
                  <div className="mb-4 flex flex-wrap gap-4 text-sm">
                    {req.assignedPro && (
                      <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        {req.assignedPro}
                      </div>
                    )}
                    {req.scheduledDate && (
                      <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {req.scheduledDate}
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Timeline
                  </h4>
                  <ol className="relative border-l-2 border-zinc-200 pl-6 dark:border-zinc-700">
                    {req.timeline.map((step, i) => (
                      <li key={i} className="relative mb-4 last:mb-0">
                        <span
                          className={`absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                            step.done
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900'
                          }`}
                        >
                          {step.done && (
                            <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          )}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-zinc-900 dark:text-white">{step.event}</span>
                          {step.date && (
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">{step.date}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

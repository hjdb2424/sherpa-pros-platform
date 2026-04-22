'use client';

import Link from 'next/link';

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const activeRequest = {
  id: 'MR-1042',
  title: 'Kitchen faucet leaking',
  status: 'In Progress',
  statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  assignedPro: 'Mike Rodriguez',
  eta: 'Apr 16, 2026 — 10:00 AM',
  submitted: 'Apr 13, 2026',
};

const recentRequests = [
  {
    id: 'MR-1041',
    title: 'Bathroom exhaust fan not working',
    status: 'Scheduled',
    statusColor: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    date: 'Apr 10, 2026',
  },
  {
    id: 'MR-1038',
    title: 'Dishwasher not draining',
    status: 'Completed',
    statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    date: 'Mar 28, 2026',
  },
  {
    id: 'MR-1035',
    title: 'Replace smoke detector battery',
    status: 'Completed',
    statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    date: 'Mar 15, 2026',
  },
  {
    id: 'MR-1030',
    title: 'Front door lock sticking',
    status: 'Completed',
    statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    date: 'Feb 22, 2026',
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TenantDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Emergency Banner */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              Emergency?
            </p>
            <p className="mt-0.5 text-sm text-red-700 dark:text-red-400">
              Call 911 for life-threatening emergencies. For urgent maintenance (gas leak, flooding, no heat), call the emergency line at <span className="font-semibold">(603) 555-0199</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Welcome back, Alex
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Unit 102 &middot; Maple Ridge Apartments
        </p>
      </div>

      {/* Active Request Card */}
      {activeRequest && (
        <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Active Request
            </h2>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${activeRequest.statusColor}`}>
              {activeRequest.status}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {activeRequest.title}
          </h3>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span>Assigned: <span className="font-medium text-zinc-900 dark:text-white">{activeRequest.assignedPro}</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>ETA: <span className="font-medium text-zinc-900 dark:text-white">{activeRequest.eta}</span></span>
            </div>
          </div>
          <Link
            href={`/tenant/my-requests`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#00a9e0] transition-colors hover:text-[#0090c0]"
          >
            View details
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      )}

      {/* Submit New Request CTA */}
      <Link
        href="/tenant/submit-request"
        className="flex items-center justify-center gap-3 rounded-xl bg-[#00a9e0] px-6 py-5 text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md active:scale-[0.98]"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="text-lg font-semibold">Submit New Request</span>
      </Link>

      {/* Recent Requests */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Recent Requests
          </h2>
          <Link
            href="/tenant/my-requests"
            className="text-sm font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="space-y-3">
          {recentRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between rounded-xl border border-[#00a9e033] bg-white p-4 shadow-sm transition-all hover:border-[#00a9e0]/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {req.title}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {req.id} &middot; {req.date}
                </p>
              </div>
              <span className={`ml-3 shrink-0 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${req.statusColor}`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

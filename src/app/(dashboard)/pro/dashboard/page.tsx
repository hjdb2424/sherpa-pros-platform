import type { Metadata } from 'next';
import Link from 'next/link';
import StatsCard from '@/components/pro/StatsCard';
import BadgeTier from '@/components/pro/BadgeTier';
import DispatchAlert from '@/components/pro/DispatchAlert';
import MilestoneTracker from '@/components/pro/MilestoneTracker';
import {
  mockProProfile,
  mockDashboardStats,
  mockDispatch,
  mockActiveJobs,
  mockActivity,
} from '@/lib/mock-data/pro-data';

export const metadata: Metadata = {
  title: 'Dashboard',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const activityIcons: Record<string, { bg: string; icon: string }> = {
  dispatch: { bg: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', icon: '\u26A1' },
  bid_accepted: { bg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', icon: '\u2713' },
  payment: { bg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', icon: '$' },
  rating: { bg: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', icon: '\u2605' },
  bid_rejected: { bg: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400', icon: '\u2717' },
  job_completed: { bg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', icon: '\u2714' },
};

export default function ProDashboardPage() {
  const pro = mockProProfile;
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Welcome back, {pro.name.split(' ')[0]}
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Here is what is happening today.
          </p>
        </div>
        <BadgeTier tier={pro.badgeTier} size="lg" />
      </div>

      {/* Incoming dispatch alert */}
      <DispatchAlert dispatch={mockDispatch} />

      {/* Stats row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Active Jobs"
          value={String(stats.activeJobs)}
          trend={{ direction: 'up', label: '+1 this week' }}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.048.58.024 1.194-.14 1.743" />
            </svg>
          }
        />
        <StatsCard
          label="Pending Bids"
          value={String(stats.pendingBids)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          }
        />
        <StatsCard
          label="This Month"
          value={`$${stats.monthEarnings.toLocaleString()}`}
          trend={{ direction: 'up', label: '+12% vs last month' }}
          accentColor="text-emerald-600 dark:text-emerald-400"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
        <StatsCard
          label="Visibility Score"
          value={`${stats.visibilityScore}%`}
          trend={{ direction: 'up', label: '+3 pts' }}
          accentColor="text-[#1a1a2e] dark:text-amber-400"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          }
        />
      </div>

      {/* Active jobs */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Active Jobs</h2>
          <Link href="/pro/jobs" className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {mockActiveJobs.map((job) => {
            const completed = job.milestones.filter((m) => m.status === 'completed').length;
            const total = job.milestones.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <Link
                key={job.id}
                href={`/pro/jobs/${job.id}`}
                className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{job.title}</h3>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                      {job.clientName} &middot; {job.distanceMiles} mi &middot; Next: {job.milestones.find((m) => m.status === 'in_progress')?.title ?? 'N/A'}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    {pct}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Two-column: Activity + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Recent Activity</h2>
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800" role="list">
              {mockActivity.map((item) => {
                const iconCfg = activityIcons[item.type] ?? activityIcons.job_completed;
                return (
                  <li key={item.id} className="flex items-start gap-3 px-4 py-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${iconCfg.bg}`}
                      aria-hidden="true"
                    >
                      {iconCfg.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.description}</p>
                      {item.amount && (
                        <p className="mt-0.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">+${item.amount.toLocaleString()}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-zinc-400">{timeAgo(item.timestamp)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/pro/jobs"
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">View Available Jobs</p>
                <p className="text-xs text-zinc-500">Browse jobs matching your trades</p>
              </div>
            </Link>

            <Link
              href="/pro/profile"
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Update Availability</p>
                <p className="text-xs text-zinc-500">Set your weekly schedule</p>
              </div>
            </Link>

            <Link
              href="/pro/profile"
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Edit Profile</p>
                <p className="text-xs text-zinc-500">Update trades, portfolio, and certs</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

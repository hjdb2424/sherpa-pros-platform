'use client';

import Link from 'next/link';
import {
  CLIENT_STATS,
  MOCK_ACTIVITY,
  getActiveJobs,
  formatBudget,
  formatDate,
} from '@/lib/mock-data/client-data';
import { JobStatusBadge } from '@/components/client/JobStatusBadge';
import EmptyState from '@/components/EmptyState';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const ACTIVITY_ICONS: Record<string, { icon: string; bg: string }> = {
  bid_received: { icon: '📩', bg: 'bg-blue-100' },
  pro_assigned: { icon: '✅', bg: 'bg-emerald-100' },
  milestone_completed: { icon: '🎯', bg: 'bg-amber-100' },
  payment_released: { icon: '💸', bg: 'bg-emerald-100' },
  job_posted: { icon: '📋', bg: 'bg-indigo-100' },
  message: { icon: '💬', bg: 'bg-zinc-100' },
};

export function ClientDashboardContent() {
  const activeJobs = getActiveJobs();

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Welcome back, Phyrom</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Here is what is happening with your projects.
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500">Active Projects</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-zinc-900">{CLIENT_STATS.activeProjects}</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500">Completed</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-zinc-900">{CLIENT_STATS.completedProjects}</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500">In Escrow</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-zinc-900">${CLIENT_STATS.escrowBalance}</p>
          <p className="mt-0.5 text-xs text-zinc-400">Protected until you approve</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Active Jobs */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900">Active Jobs</h2>
            <Link href="/client/my-jobs" className="text-sm font-medium text-amber-600 hover:text-amber-700">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {activeJobs.length === 0 ? (
              <EmptyState
                icon={<ClipboardDocumentListIcon className="h-8 w-8" />}
                title="No projects yet"
                description="Post your first job and get matched with verified pros in your area. It takes less than 60 seconds."
                ctaLabel="Post a Job"
                ctaHref="/client/post-job"
                secondaryLabel="Browse Pros"
                secondaryHref="/client/find-pros"
              />
            ) : (
              activeJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/client/my-jobs/${job.id}`}
                  className="block rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{job.categoryIcon}</span>
                        <h3 className="truncate text-sm font-semibold text-zinc-900">
                          {job.title}
                        </h3>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <JobStatusBadge status={job.status} />
                        <span className="text-xs text-zinc-400">
                          {formatBudget(job.budget)}
                        </span>
                      </div>
                      {job.assignedPro && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a1a2e] text-[8px] font-bold text-white">
                            {job.assignedPro.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          {job.assignedPro.name}
                        </div>
                      )}
                      {job.nextMilestone && (
                        <p className="mt-1 text-xs text-zinc-400">
                          Next: {job.nextMilestone}
                        </p>
                      )}
                    </div>
                    <svg className="h-5 w-5 shrink-0 text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick actions */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-zinc-900">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/client/post-job"
                className="flex items-center gap-3 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 transition-colors hover:bg-amber-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Post a New Job</p>
                  <p className="text-xs text-amber-600">Get bids from verified Pros</p>
                </div>
              </Link>

              <Link
                href="/client/find-pros"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                  <svg className="h-5 w-5 text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800">Find a Pro</p>
                  <p className="text-xs text-zinc-500">Browse by trade and location</p>
                </div>
              </Link>

              <Link
                href="/client/messages"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                  <svg className="h-5 w-5 text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800">View Messages</p>
                  <p className="text-xs text-zinc-500">2 unread conversations</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-zinc-900">Recent Activity</h2>
            <div className="space-y-3">
              {MOCK_ACTIVITY.slice(0, 5).map((activity) => {
                const icon = ACTIVITY_ICONS[activity.type] ?? ACTIVITY_ICONS.message;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${icon.bg} text-sm`}>
                      {icon.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-800">{activity.title}</p>
                      <p className="text-xs text-zinc-500">{activity.description}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-400">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

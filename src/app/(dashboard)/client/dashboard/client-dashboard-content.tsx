'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CLIENT_STATS,
  MOCK_ACTIVITY,
  getActiveJobs,
  formatBudget,
  formatDate,
} from '@/lib/mock-data/client-data';
import { JobStatusBadge } from '@/components/client/JobStatusBadge';
import EmptyState from '@/components/EmptyState';
import NearbyProsMap from '@/components/client/NearbyProsMap';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { SCPBanner } from '@/components/ai';
import ClientOnboarding from '@/components/client/ClientOnboarding';
import ReviewPrompt from '@/components/reviews/ReviewPrompt';
import { getCurrentSession } from '@/lib/auth/session';
import { userStorage } from '@/lib/user-storage';

const ACTIVITY_ICONS: Record<string, { icon: string; bg: string }> = {
  bid_received: { icon: '📩', bg: 'bg-blue-100' },
  pro_assigned: { icon: '✅', bg: 'bg-emerald-100' },
  milestone_completed: { icon: '🎯', bg: 'bg-sky-100' },
  payment_released: { icon: '💸', bg: 'bg-emerald-100' },
  job_posted: { icon: '📋', bg: 'bg-indigo-100' },
  message: { icon: '💬', bg: 'bg-zinc-100' },
};

const SERVICE_CATEGORIES = [
  { label: 'Plumbing', icon: '🔧' },
  { label: 'Electrical', icon: '⚡' },
  { label: 'HVAC', icon: '❄️' },
  { label: 'Painting', icon: '🎨' },
  { label: 'Roofing', icon: '🏠' },
  { label: 'Landscaping', icon: '🌿' },
  { label: 'General Repair', icon: '🛠️' },
  { label: 'Emergency', icon: '🚨' },
];

export function ClientDashboardContent() {
  const router = useRouter();
  const session = getCurrentSession('client');
  const activeJobs = getActiveJobs();
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasPostedJob, setHasPostedJob] = useState(true); // default true to avoid flash

  // Check user-scoped storage for first-job-posted flag (demo/mock mode)
  useEffect(() => {
    const posted = userStorage.get<boolean>('first-job-posted');
    setHasPostedJob(posted === true);
  }, []);

  // First-visit redirect: send new clients with zero jobs to the post-job wizard
  useEffect(() => {
    const hasSeen = userStorage.get<boolean>('seen-dashboard');
    if (!hasSeen && CLIENT_STATS.activeProjects === 0) {
      router.replace('/client/post-job?from=dashboard');
    }
  }, [router]);

  // Determine if we should show the empty state
  const showEmptyState = CLIENT_STATS.activeProjects === 0 && !hasPostedJob;

  if (showOnboarding) {
    return <ClientOnboarding />;
  }

  // --- Empty state: no active jobs ---
  if (showEmptyState) {
    return (
      <div className="px-4 py-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Welcome, {session.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Let&apos;s get your first project started.
          </p>
        </div>

        {/* Hero card */}
        <div className="mx-auto mb-10 max-w-xl">
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#00a9e0]/20 bg-gradient-to-br from-sky-50 to-white p-8 text-center shadow-lg shadow-[#00a9e0]/5 dark:from-sky-950/30 dark:to-zinc-900 dark:border-[#00a9e0]/30">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00a9e0]/10">
              <svg className="h-8 w-8 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Post your first job in 60 seconds
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              Describe what you need, set your budget, and get matched with verified pros in your area.
            </p>
            <Link
              href="/client/post-job"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#00a9e0] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Post a Job
            </Link>

            {/* Simulate button for demo/dev */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  userStorage.set('first-job-posted', true);
                  setHasPostedJob(true);
                }}
                className="text-xs text-zinc-400 underline decoration-dashed underline-offset-2 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                Simulate: mark first job as posted
              </button>
            </div>
          </div>
        </div>

        {/* Quick category picker */}
        <div className="mx-auto mb-10 max-w-xl">
          <h3 className="mb-4 text-center text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Or pick a category to get started
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {SERVICE_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={`/client/post-job?category=${encodeURIComponent(cat.label)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-[#00a9e0]/40 hover:bg-sky-50 hover:text-[#00a9e0] hover:shadow-md active:scale-[0.97] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-[#00a9e0]/40 dark:hover:bg-sky-950/30"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Nearby pros map — builds confidence */}
        <div className="mx-auto max-w-xl">
          <NearbyProsMap />
        </div>
      </div>
    );
  }

  // --- Full dashboard: user has active jobs ---
  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Onboarding banner */}
      {!hasOnboarded && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border-2 border-[#00a9e0]/30 bg-sky-50 p-4 dark:border-[#00a9e0]/20 dark:bg-sky-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a9e0]/10">
              <svg className="h-5 w-5 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Complete your profile</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Set up your property and preferences to get better Pro matches.</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setShowOnboarding(true)}
              className="rounded-full bg-[#00a9e0] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0]"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={() => setHasOnboarded(true)}
              className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              aria-label="Dismiss onboarding banner"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Welcome back, {session.name}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Here is what is happening with your projects.
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500">Your Active Projects</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50">
              <svg className="h-5 w-5 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
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
        {/* Left column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Review prompt for completed jobs */}
          <ReviewPrompt
            proName="Marcus Rivera"
            jobTitle="Window Trim Installation"
            onStartReview={(rating) => {
              console.log('Start review with rating:', rating);
            }}
            onDismiss={() => {
              console.log('Review prompt dismissed');
            }}
          />

          {/* Sherpa Client Pro banner */}
          <SCPBanner clientName={session.name} isSubscribed={false} />

          {/* Active Jobs */}
          <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900">Active Jobs</h2>
            <Link href="/client/my-jobs" className="text-sm font-medium text-[#00a9e0] hover:text-[#0ea5e9]">
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
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00a9e0] text-[8px] font-bold text-white">
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
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Nearby pros map */}
          <NearbyProsMap />

          {/* Quick actions */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-zinc-900">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/client/post-job"
                className="flex items-center gap-3 rounded-xl border-2 border-[#00a9e0]/20 bg-sky-50 p-4 transition-colors hover:bg-sky-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00a9e0]">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#00a9e0]">Post a New Job</p>
                  <p className="text-xs text-zinc-600">Get bids from verified Pros</p>
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

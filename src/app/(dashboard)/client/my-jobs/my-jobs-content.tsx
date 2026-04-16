'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MOCK_JOBS,
  getActiveJobs,
  getJobsWithBids,
  getCompletedJobs,
  formatBudget,
  formatDate,
} from '@/lib/mock-data/client-data';
import { JobStatusBadge } from '@/components/client/JobStatusBadge';
import EmptyState from '@/components/EmptyState';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

type Tab = 'active' | 'bids' | 'completed';

const TABS: { key: Tab; label: string; count: number }[] = [
  { key: 'active', label: 'Active', count: getActiveJobs().length },
  { key: 'bids', label: 'Bids Received', count: getJobsWithBids().length },
  { key: 'completed', label: 'Completed', count: getCompletedJobs().length },
];

export function MyJobsContent() {
  const [tab, setTab] = useState<Tab>('active');

  const jobs =
    tab === 'active'
      ? getActiveJobs()
      : tab === 'bids'
        ? getJobsWithBids()
        : getCompletedJobs();

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Jobs</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track your projects from posting to completion.
          </p>
        </div>
        <Link
          href="/client/post-job"
          className="hidden items-center gap-2 rounded-lg bg-[#00a9e0] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-colors hover:bg-[#0ea5e9] sm:flex"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Post Job
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
            aria-current={tab === t.key ? 'page' : undefined}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                tab === t.key ? 'bg-sky-100 text-[#00a9e0]' : 'bg-zinc-200 text-zinc-500'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Job list */}
      {jobs.length === 0 ? (
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
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/client/my-jobs/${job.id}`}
              className="block rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{job.categoryIcon}</span>
                    <h3 className="truncate text-base font-semibold text-zinc-900">
                      {job.title}
                    </h3>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <JobStatusBadge status={job.status} />
                    <span>{job.category}</span>
                    <span className="text-zinc-300">|</span>
                    <span>{formatBudget(job.budget)}</span>
                    <span className="text-zinc-300">|</span>
                    <span>Posted {formatDate(job.postedAt)}</span>
                  </div>
                  {job.assignedPro && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00a9e0] text-[8px] font-bold text-white">
                        {job.assignedPro.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      {job.assignedPro.name}
                    </div>
                  )}
                  {tab === 'bids' && (
                    <div className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      {job.bidsCount} bid{job.bidsCount !== 1 ? 's' : ''} received
                    </div>
                  )}
                  {tab === 'completed' && !job.rated && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-[#ff4500]">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Leave a review
                    </div>
                  )}
                </div>
                <svg className="h-5 w-5 shrink-0 text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

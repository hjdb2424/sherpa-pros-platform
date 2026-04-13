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
          className="hidden items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 sm:flex"
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
                tab === t.key ? 'bg-amber-100 text-amber-700' : 'bg-zinc-200 text-zinc-500'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Job list */}
      {jobs.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          <p className="mt-4 text-sm font-medium text-zinc-600">No jobs in this category</p>
          <p className="mt-1 text-xs text-zinc-400">
            {tab === 'active' ? 'Post a job to get started.' : 'Check back later.'}
          </p>
          {tab === 'active' && (
            <Link
              href="/client/post-job"
              className="mt-4 inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Post a Job
            </Link>
          )}
        </div>
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
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a1a2e] text-[8px] font-bold text-white">
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
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
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

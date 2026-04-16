'use client';

import { useState } from 'react';
import Link from 'next/link';
import JobCard from '@/components/pro/JobCard';
import MilestoneTracker from '@/components/pro/MilestoneTracker';
import EmptyState from '@/components/EmptyState';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import {
  mockAvailableJobs,
  mockMyBids,
  mockActiveJobs,
  mockCompletedJobs,
} from '@/lib/mock-data/pro-data';

const tabs = [
  { id: 'available', label: 'Available', count: mockAvailableJobs.length },
  { id: 'bids', label: 'My Bids', count: mockMyBids.length },
  { id: 'active', label: 'Active', count: mockActiveJobs.length },
  { id: 'completed', label: 'Completed', count: mockCompletedJobs.length },
] as const;

type TabId = typeof tabs[number]['id'];

const bidStatusConfig = {
  pending: { label: 'Pending', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  accepted: { label: 'Accepted', classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  rejected: { label: 'Not Selected', classes: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
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

export default function JobsPageClient() {
  const [activeTab, setActiveTab] = useState<TabId>('available');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  const categories = ['all', ...new Set(mockAvailableJobs.map((j) => j.category))];
  const urgencies = ['all', 'low', 'medium', 'high', 'emergency'];

  const filteredAvailable = mockAvailableJobs.filter((job) => {
    if (categoryFilter !== 'all' && job.category !== categoryFilter) return false;
    if (urgencyFilter !== 'all' && job.urgency !== urgencyFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Jobs</h1>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800" role="tablist" aria-label="Job tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {tab.label}
            <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold ${
              activeTab === tab.id ? 'bg-amber-500 text-white' : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-600 dark:text-zinc-300'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters — only shown on Available tab */}
      {activeTab === 'available' && (
        <div className="flex flex-wrap gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            aria-label="Filter by category"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            aria-label="Filter by urgency"
          >
            {urgencies.map((u) => (
              <option key={u} value={u}>{u === 'all' ? 'All Urgencies' : u.charAt(0).toUpperCase() + u.slice(1)}</option>
            ))}
          </select>
        </div>
      )}

      {/* Tab content */}
      <div role="tabpanel" aria-label={`${activeTab} jobs`}>
        {/* Available */}
        {activeTab === 'available' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredAvailable.length > 0 ? (
              filteredAvailable.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={<BriefcaseIcon className="h-8 w-8" />}
                  title="No jobs available right now"
                  description="New jobs are posted daily. Make sure your profile is complete and your service area is set to get notified."
                  ctaLabel="Update Profile"
                  ctaHref="/pro/profile"
                />
              </div>
            )}
          </div>
        )}

        {/* My Bids */}
        {activeTab === 'bids' && (
          <div className="space-y-3">
            {mockMyBids.map((bid) => {
              const statusCfg = bidStatusConfig[bid.status];
              return (
                <Link
                  key={bid.id}
                  href={`/pro/jobs/${bid.jobId}`}
                  className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{bid.jobTitle}</h3>
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                        Bid: ${bid.amount.toLocaleString()} &middot; {bid.estimatedDuration} &middot; {timeAgo(bid.submittedAt)}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm text-zinc-400">{bid.message}</p>
                    </div>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${statusCfg.classes}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Active */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {mockActiveJobs.map((job) => (
              <Link
                key={job.id}
                href={`/pro/jobs/${job.id}`}
                className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{job.title}</h3>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                      {job.clientName} &middot; {job.address}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    Active
                  </span>
                </div>
                <div className="mt-3">
                  <MilestoneTracker milestones={job.milestones} compact />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Completed */}
        {activeTab === 'completed' && (
          <div className="space-y-3">
            {mockCompletedJobs.map((job) => (
              <Link
                key={job.id}
                href={`/pro/jobs/${job.id}`}
                className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{job.title}</h3>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                      {job.clientName} &middot; ${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {job.ratingReceived && (
                      <>
                        <svg className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-amber-600">{job.ratingReceived}</span>
                      </>
                    )}
                  </div>
                </div>
                {job.reviewText && (
                  <p className="mt-2 text-sm italic text-zinc-500 dark:text-zinc-400">
                    &ldquo;{job.reviewText}&rdquo;
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  getJobById,
  getBidsForJob,
  formatBudget,
  formatDate,
} from '@/lib/mock-data/client-data';
import { getChecklistForJob } from '@/lib/mock-data/checklist-data';
import { JobStatusBadge } from '@/components/client/JobStatusBadge';
import { BidCard } from '@/components/client/BidCard';
import { ProCard } from '@/components/client/ProCard';
import { RatingForm } from '@/components/client/RatingForm';
import { MaterialsList, MaterialsApproval } from '@/components/checklist';

interface JobDetailContentProps {
  jobId: string;
}

export function JobDetailContent({ jobId }: JobDetailContentProps) {
  const job = getJobById(jobId);
  const bids = getBidsForJob(jobId);
  const checklist = useMemo(() => getChecklistForJob(jobId), [jobId]);

  const [approved, setApproved] = useState(false);

  const handleApprove = useCallback(() => {
    setApproved(true);
  }, []);

  if (!job) {
    return (
      <div className="px-4 py-16 text-center lg:px-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Job not found</h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">This job may have been removed.</p>
        <Link
          href="/client/my-jobs"
          className="mt-4 inline-block rounded-full bg-[#00a9e0] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 hover:bg-[#0090c0]"
        >
          Back to My Jobs
        </Link>
      </div>
    );
  }

  const isBidding = ['open', 'bidding'].includes(job.status);
  const isActive = ['assigned', 'in_progress'].includes(job.status);
  const isCompleted = job.status === 'completed';

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500" aria-label="Breadcrumb">
        <Link href="/client/my-jobs" className="hover:text-zinc-600 dark:hover:text-zinc-300">
          My Jobs
        </Link>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="truncate text-zinc-600 dark:text-zinc-400">{job.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{job.categoryIcon}</span>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">{job.title}</h1>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <JobStatusBadge status={job.status} size="md" />
              <span>{job.category}</span>
              <span className="text-zinc-300 dark:text-zinc-600">|</span>
              <span>{formatBudget(job.budget)}</span>
              <span className="text-zinc-300 dark:text-zinc-600">|</span>
              <span>Posted {formatDate(job.postedAt)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Description</h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">{job.description}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
            <span>Location: {job.location}</span>
            <span>
              Urgency:{' '}
              {job.urgency === 'emergency'
                ? '⚡ Emergency'
                : job.urgency === 'standard'
                  ? 'Standard'
                  : 'Flexible'}
            </span>
          </div>
        </div>
      </div>

      {/* Bids section */}
      {isBidding && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Bids Received ({bids.length})
            </h2>
            {bids.length === 0 && (
              <span className="text-sm text-zinc-400 dark:text-zinc-500">Waiting for Pros to respond...</span>
            )}
          </div>

          {bids.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Your job is live</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Verified Pros in your area are reviewing your project. Expect bids within 24 hours.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bids.map((bid) => (
                <BidCard
                  key={bid.id}
                  bid={bid}
                  onAccept={() => {
                    /* placeholder */
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active job view */}
      {isActive && (
        <div className="space-y-6">
          {/* Pro info */}
          {job.assignedPro && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Assigned Pro</h2>
              <ProCard pro={job.assignedPro} compact />
              <button className="mt-3 flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                Message Pro
              </button>
            </div>
          )}

          {/* Milestones */}
          {job.milestones && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Milestone Tracker</h2>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
                {job.milestones.map((ms, idx) => (
                  <div key={ms.id} className="flex items-center gap-4 p-4">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          ms.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : ms.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-zinc-100 text-zinc-400'
                        }`}
                      >
                        {ms.status === 'paid' ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          idx + 1
                        )}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{ms.title}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {ms.status === 'paid'
                          ? 'Payment released'
                          : ms.status === 'in_progress'
                            ? 'In progress'
                            : 'Pending'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        ${ms.amount.toLocaleString()}
                      </p>
                      <span
                        className={`text-[10px] font-medium ${
                          ms.status === 'paid'
                            ? 'text-emerald-600'
                            : ms.status === 'in_progress'
                              ? 'text-amber-600'
                              : 'text-zinc-400'
                        }`}
                      >
                        {ms.status === 'paid'
                          ? 'Paid'
                          : ms.status === 'in_progress'
                            ? 'In Escrow'
                            : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1 px-1 text-xs text-zinc-400 dark:text-zinc-500">
                <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Escrow protected -- funds released only when you approve
              </div>
            </div>
          )}

          {/* Photo timeline placeholder */}
          <div>
            <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Photo Timeline</h2>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center">
              <svg className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Before, during, and after photos will appear here as the Pro uploads them.
              </p>
            </div>
          </div>

          {/* Materials & Approval Section */}
          {checklist ? (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Materials &amp; Approval</h2>

              {/* Success banner */}
              {approved && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                      Materials approved! Your Pro will be notified.
                    </p>
                  </div>
                </div>
              )}

              {/* Read-only materials list */}
              <MaterialsList materials={checklist.materials} editable={false} />

              {/* Approval widget */}
              {!approved && (
                <div className="mt-4">
                  <MaterialsApproval
                    materials={checklist.materials}
                    clientTier="one_time"
                    onApprove={handleApprove}
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Materials</h2>
              <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 p-8 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Materials list will be available once your Pro begins the project.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completed view */}
      {isCompleted && (
        <div className="space-y-6">
          {job.assignedPro && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Pro</h2>
              <ProCard pro={job.assignedPro} compact />
            </div>
          )}

          {/* Milestones (all paid) */}
          {job.milestones && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Payment Summary</h2>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
                {job.milestones.map((ms) => (
                  <div key={ms.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-sm text-zinc-800 dark:text-zinc-200">{ms.title}</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      ${ms.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-4">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Total Paid</span>
                  <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    $
                    {job.milestones
                      .reduce((sum, m) => sum + m.amount, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Materials summary for completed jobs */}
          {checklist ? (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Materials Used</h2>
              <MaterialsList materials={checklist.materials} editable={false} />
            </div>
          ) : (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Materials</h2>
              <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 p-8 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Materials list will be available once your Pro begins the project.</p>
              </div>
            </div>
          )}

          {/* Rating */}
          {!job.rated && job.assignedPro && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Leave a Review</h2>
              <RatingForm
                proName={job.assignedPro.name}
                jobTitle={job.title}
                onSubmit={(data) => {
                  console.log('Rating submitted:', data);
                }}
              />
            </div>
          )}

          {job.rated && (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-6 text-center">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                You already reviewed this job. Thank you!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  getJobById,
  getBidsForJob,
  formatBudget,
  formatDate,
} from '@/lib/mock-data/client-data';
import { getChecklistForJob } from '@/lib/mock-data/checklist-data';
import { calculateFeeBreakdown, formatCents } from '@/lib/pricing/fee-calculator';
import type { ClientTier } from '@/lib/pricing/fee-calculator';
import type { DeliveryTier } from '@/lib/services/zinc';
import { JobStatusBadge } from '@/components/client/JobStatusBadge';
import { BidCard } from '@/components/client/BidCard';
import { ProCard } from '@/components/client/ProCard';
import { RatingForm } from '@/components/client/RatingForm';
import WriteReview from '@/components/reviews/WriteReview';
import ReviewCard from '@/components/reviews/ReviewCard';
import InvoicePreview from '@/components/invoices/InvoicePreview';
import { getInvoiceByJobId, type Invoice } from '@/lib/services/invoices';
import {
  MaterialsList,
  MaterialsApproval,
  PaymentSelector,
  DeliverySelector,
  DeliveryTracker,
} from '@/components/checklist';
import QuotePreview from '@/components/quotes/QuotePreview';
import type { Quote } from '@/lib/services/quote-builder';

// ---------------------------------------------------------------------------
// Materials Flow State Machine
// ---------------------------------------------------------------------------

type MaterialsStep = 'review' | 'payment' | 'delivery' | 'ordered' | 'tracking' | 'complete';

const STEPS_CONFIG: { key: MaterialsStep; label: string }[] = [
  { key: 'review', label: 'Review' },
  { key: 'payment', label: 'Payment' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'ordered', label: 'Order' },
  { key: 'tracking', label: 'Track' },
  { key: 'complete', label: 'Complete' },
];

function getStepIndex(step: MaterialsStep): number {
  return STEPS_CONFIG.findIndex((s) => s.key === step);
}

// ---------------------------------------------------------------------------
// Progress Indicator
// ---------------------------------------------------------------------------

function StepProgressBar({ current }: { current: MaterialsStep }) {
  const currentIdx = getStepIndex(current);

  return (
    <nav className="mb-6" aria-label="Materials flow progress">
      <ol className="flex items-center gap-0">
        {STEPS_CONFIG.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isLast = idx === STEPS_CONFIG.length - 1;

          return (
            <li key={step.key} className="flex items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`
                    flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300
                    ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                          ? 'bg-[#00a9e0] text-white shadow-[0_0_0_3px_rgba(0,169,224,0.25)] animate-pulse'
                          : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500'
                    }
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isDone ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium leading-none whitespace-nowrap ${
                    isDone
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : isCurrent
                        ? 'text-[#00a9e0] font-semibold'
                        : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`mx-1 h-0.5 w-6 flex-shrink-0 sm:w-10 transition-colors duration-300 ${
                    idx < currentIdx ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface JobDetailContentProps {
  jobId: string;
}

export function JobDetailContent({ jobId }: JobDetailContentProps) {
  const job = getJobById(jobId);
  const bids = getBidsForJob(jobId);
  const checklist = useMemo(() => getChecklistForJob(jobId), [jobId]);

  // Materials flow state machine
  const [materialsStep, setMaterialsStep] = useState<MaterialsStep>('review');
  const [paymentResult, setPaymentResult] = useState<{ method: string; id: string } | null>(null);
  const [deliveryTier, setDeliveryTier] = useState<DeliveryTier | null>(null);
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const [orderConfirming, setOrderConfirming] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const clientInvoice: Invoice | undefined = useMemo(() => getInvoiceByJobId(jobId), [jobId]);

  // Quote state
  const [jobQuote, setJobQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [showFullQuote, setShowFullQuote] = useState(false);
  const [quoteAccepted, setQuoteAccepted] = useState(false);

  // Fetch quote for this job
  useEffect(() => {
    let cancelled = false;
    async function fetchQuote() {
      setQuoteLoading(true);
      try {
        const res = await fetch(`/api/quotes?jobId=${jobId}`);
        const data = await res.json();
        if (!cancelled && data.quotes?.length > 0) {
          setJobQuote(data.quotes[0]);
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    }
    fetchQuote();
    return () => { cancelled = true; };
  }, [jobId]);

  // Compute fee breakdown from checklist materials
  const feeBreakdown = useMemo(() => {
    if (!checklist) return null;
    const totalCents = checklist.materials.reduce(
      (sum, m) => sum + m.priceCents * m.quantity,
      0,
    );
    return calculateFeeBreakdown(totalCents, 'one_time' as ClientTier);
  }, [checklist]);

  // --- Callbacks ---

  const handleApprove = useCallback(() => {
    setMaterialsStep('payment');
  }, []);

  const handlePaymentComplete = useCallback(
    (result: { method: string; id: string }) => {
      setPaymentResult(result);
      setMaterialsStep('delivery');
    },
    [],
  );

  const handleDeliverySelect = useCallback((tier: DeliveryTier) => {
    setDeliveryTier(tier);
  }, []);

  const handleConfirmOrder = useCallback(async () => {
    if (!deliveryTier) return;
    setOrderConfirming(true);
    try {
      const res = await fetch('/api/materials/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryTier,
          paymentId: paymentResult?.id,
          paymentMethod: paymentResult?.method,
        }),
      });
      const data = await res.json();
      if (data.deliveryId) {
        setDeliveryId(data.deliveryId);
      }
      setMaterialsStep('ordered');

      // Auto-advance to tracking for gig deliveries
      if (deliveryTier === 'gig' && data.deliveryId) {
        setTimeout(() => setMaterialsStep('tracking'), 2000);
      }
    } catch {
      // Stay on delivery step if order fails — user can retry
    } finally {
      setOrderConfirming(false);
    }
  }, [deliveryTier, paymentResult]);

  const handleDelivered = useCallback(() => {
    setMaterialsStep('complete');
  }, []);

  // --- Guard: not found ---

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

  // --- Delivery label helpers ---

  const deliveryLabel: Record<string, string> = {
    bopis: 'Store Pickup (BOPIS)',
    hd_delivery: 'Home Depot Delivery',
    gig: 'Gig Delivery (Uber Connect)',
    pro_choice: 'Pro Pickup',
  };

  const deliveryEta: Record<string, string> = {
    bopis: 'Ready in 2 hours',
    hd_delivery: '2-5 business days',
    gig: '60-90 minutes',
    pro_choice: 'Pro will pick up',
  };

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

          {/* Quote Received */}
          {quoteLoading && (
            <div className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          )}
          {jobQuote && !showFullQuote && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Quote Received</h2>
              <div className="rounded-xl border border-[#00a9e0]/20 bg-white p-4 shadow-sm dark:border-sky-800 dark:bg-zinc-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {jobQuote.jobTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      From: Pro &middot; Valid until{' '}
                      {new Date(jobQuote.validUntil).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
                      {formatCents(jobQuote.totalCents)}
                    </p>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        jobQuote.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : jobQuote.status === 'declined'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                      }`}
                    >
                      {jobQuote.status.charAt(0).toUpperCase() + jobQuote.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFullQuote(true)}
                    className="rounded-full border border-[#00a9e0]/30 px-4 py-2 text-xs font-semibold text-[#00a9e0] transition-colors hover:bg-sky-50 dark:hover:bg-sky-900/20"
                  >
                    View Full Quote
                  </button>
                  {jobQuote.status === 'sent' && (
                    <>
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch(`/api/quotes/${jobQuote.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'accepted' }),
                          });
                          setJobQuote({ ...jobQuote, status: 'accepted' });
                          setQuoteAccepted(true);
                        }}
                        className="rounded-full bg-[#00a9e0] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] active:scale-[0.98]"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch(`/api/quotes/${jobQuote.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'declined' }),
                          });
                          setJobQuote({ ...jobQuote, status: 'declined' });
                        }}
                        className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0]"
                      >
                        Request Changes
                      </button>
                    </>
                  )}
                </div>

                {quoteAccepted && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20">
                    <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      Quote accepted! Your Pro will begin work soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {jobQuote && showFullQuote && (
            <div>
              <button
                type="button"
                onClick={() => setShowFullQuote(false)}
                className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Back to Job
              </button>
              <QuotePreview
                quote={jobQuote}
                mode="client"
                onAccept={() => {
                  setJobQuote({ ...jobQuote, status: 'accepted' });
                  setQuoteAccepted(true);
                  setShowFullQuote(false);
                }}
                onDecline={() => {
                  setJobQuote({ ...jobQuote, status: 'declined' });
                  setShowFullQuote(false);
                }}
              />
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

          {/* ================================================================ */}
          {/* Materials & Approval — Full Flow                                 */}
          {/* ================================================================ */}
          {checklist && feeBreakdown ? (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Materials &amp; Approval</h2>

              {/* Progress bar */}
              <StepProgressBar current={materialsStep} />

              {/* ----- Step: review ----- */}
              {materialsStep === 'review' && (
                <div>
                  <MaterialsList materials={checklist.materials} editable={false} />
                  <div className="mt-4">
                    <MaterialsApproval
                      materials={checklist.materials}
                      clientTier="one_time"
                      onApprove={handleApprove}
                    />
                  </div>
                </div>
              )}

              {/* ----- Step: payment ----- */}
              {materialsStep === 'payment' && (
                <div>
                  <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                        Materials approved! Choose how you would like to pay.
                      </p>
                    </div>
                  </div>
                  <PaymentSelector
                    amountCents={feeBreakdown.grandTotalCents}
                    clientTier="one_time"
                    onPaymentComplete={handlePaymentComplete}
                  />
                </div>
              )}

              {/* ----- Step: delivery ----- */}
              {materialsStep === 'delivery' && (
                <div>
                  <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                        Payment {paymentResult?.method === 'card_hold' ? 'authorized' : 'approved'}! Now choose delivery.
                      </p>
                    </div>
                  </div>

                  <DeliverySelector
                    materials={checklist.materials}
                    onSelect={handleDeliverySelect}
                    selectedTier={deliveryTier ?? undefined}
                  />

                  {/* Confirm Order button */}
                  <button
                    onClick={handleConfirmOrder}
                    disabled={!deliveryTier || orderConfirming}
                    className="mt-5 w-full rounded-full bg-[#00a9e0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
                  >
                    {orderConfirming ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Placing Order...
                      </span>
                    ) : (
                      'Confirm Order'
                    )}
                  </button>
                </div>
              )}

              {/* ----- Step: ordered ----- */}
              {materialsStep === 'ordered' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <svg className="h-7 w-7 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-emerald-800 dark:text-emerald-200">
                      Materials Ordered!
                    </h3>
                    <div className="mt-3 space-y-1 text-sm text-emerald-700 dark:text-emerald-300">
                      <p>{checklist.materials.length} items ordered</p>
                      <p>{deliveryTier ? deliveryLabel[deliveryTier] : 'Delivery'}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        {deliveryTier ? deliveryEta[deliveryTier] : ''}
                      </p>
                    </div>

                    {/* For non-gig tiers, show status info */}
                    {deliveryTier && deliveryTier !== 'gig' && (
                      <div className="mt-4 w-full rounded-lg bg-white/60 p-4 dark:bg-zinc-800/40">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                          {deliveryTier === 'bopis'
                            ? 'You will be notified when your materials are ready for pickup at the store.'
                            : deliveryTier === 'hd_delivery'
                              ? 'Home Depot will deliver to the job site. You will receive tracking information via email.'
                              : 'Your Pro will pick up the materials at their convenience.'}
                        </p>
                      </div>
                    )}

                    {/* For gig tier, show auto-advancing message */}
                    {deliveryTier === 'gig' && (
                      <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 animate-pulse">
                        Setting up live tracking...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ----- Step: tracking ----- */}
              {materialsStep === 'tracking' && deliveryId && (
                <DeliveryTracker
                  deliveryId={deliveryId}
                  provider="uber"
                  onDelivered={handleDelivered}
                />
              )}

              {/* ----- Step: complete ----- */}
              {materialsStep === 'complete' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <svg className="h-7 w-7 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-emerald-800 dark:text-emerald-200">
                      Materials Delivered!
                    </h3>
                    <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                      Your Pro can now begin work.
                    </p>
                    <div className="mt-4 w-full space-y-2 rounded-lg bg-white/60 p-4 text-left dark:bg-zinc-800/40">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Items</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {checklist.materials.length} materials
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Payment</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {paymentResult?.method === 'card_hold' ? 'Card' : 'Financed'} - {formatCents(feeBreakdown.grandTotalCents)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Delivery</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {deliveryTier ? deliveryLabel[deliveryTier] : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : checklist ? (
            /* Checklist exists but no fee breakdown (shouldn't happen, but safe fallback) */
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Materials &amp; Approval</h2>
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
              <WriteReview
                jobTitle={job.title}
                recipientName={job.assignedPro.name}
                onSubmit={(data) => {
                  console.log('Review submitted:', data);
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

          {/* Invoice */}
          {clientInvoice && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Invoice</h2>
              {!showInvoice ? (
                <button
                  type="button"
                  onClick={() => setShowInvoice(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#00a9e033] bg-white px-6 py-3.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:border-[#00a9e0]/40 hover:shadow-md dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <svg className="h-5 w-5 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  View Invoice
                </button>
              ) : (
                <InvoicePreview invoice={clientInvoice} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

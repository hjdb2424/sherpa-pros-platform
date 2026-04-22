'use client';

import { useEffect, useState, useMemo } from 'react';
import type { LifecycleEvent } from '@/lib/services/job-lifecycle';
import { getEventDescription } from '@/lib/services/job-lifecycle';

/* ------------------------------------------------------------------ */
/*  Event config (icons + colors by type)                              */
/* ------------------------------------------------------------------ */

interface EventStyle {
  iconBg: string;
  iconColor: string;
  dotBorder: string;
  icon: React.ReactNode;
}

const CHECK_ICON = (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const EVENT_STYLES: Record<LifecycleEvent['type'], EventStyle> = {
  bid_accepted: {
    iconBg: 'bg-[#00a9e0]',
    iconColor: 'text-white',
    dotBorder: 'border-[#00a9e0]',
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  checklist_generated: {
    iconBg: 'bg-violet-500',
    iconColor: 'text-white',
    dotBorder: 'border-violet-500',
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
      </svg>
    ),
  },
  materials_approved: {
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    dotBorder: 'border-amber-500',
    icon: CHECK_ICON,
  },
  materials_ordered: {
    iconBg: 'bg-orange-500',
    iconColor: 'text-white',
    dotBorder: 'border-orange-500',
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  work_started: {
    iconBg: 'bg-[#00a9e0]',
    iconColor: 'text-white',
    dotBorder: 'border-[#00a9e0]',
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.194-.14 1.743" />
      </svg>
    ),
  },
  milestone_completed: {
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    dotBorder: 'border-emerald-500',
    icon: CHECK_ICON,
  },
  job_completed: {
    iconBg: 'bg-emerald-600',
    iconColor: 'text-white',
    dotBorder: 'border-emerald-600',
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
  payment_captured: {
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    dotBorder: 'border-emerald-500',
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  review_requested: {
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    dotBorder: 'border-amber-500',
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
  review_posted: {
    iconBg: 'bg-sky-500',
    iconColor: 'text-white',
    dotBorder: 'border-sky-500',
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
  review_response_posted: {
    iconBg: 'bg-indigo-500',
    iconColor: 'text-white',
    dotBorder: 'border-indigo-500',
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
};

/* ------------------------------------------------------------------ */
/*  Time formatting                                                    */
/* ------------------------------------------------------------------ */

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/* ------------------------------------------------------------------ */
/*  Data detail renderers                                              */
/* ------------------------------------------------------------------ */

function getEventDetail(event: LifecycleEvent): string | null {
  const d = event.data;
  switch (event.type) {
    case 'bid_accepted': {
      const cents = d.bidAmountCents as number | undefined;
      return cents ? `Bid: $${(cents / 100).toLocaleString()} by ${d.proName}` : null;
    }
    case 'checklist_generated':
      return `${d.totalItems} items across ${(d.phases as string[])?.length ?? 0} phases`;
    case 'materials_approved':
      return `${d.itemCount} items ($${((d.materialsCostCents as number) / 100).toLocaleString()})`;
    case 'materials_ordered':
      return `${d.supplier} -- ${d.deliveryTier} delivery`;
    case 'milestone_completed':
      return (d.milestoneName as string) ?? null;
    case 'payment_captured': {
      const total = d.totalCents as number | undefined;
      const payout = d.proPayoutCents as number | undefined;
      if (total && payout) {
        return `Total: $${(total / 100).toLocaleString()} | Pro payout: $${(payout / 100).toLocaleString()}`;
      }
      return null;
    }
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface JobTimelineProps {
  jobId: string;
}

export default function JobTimeline({ jobId }: JobTimelineProps) {
  const [events, setEvents] = useState<LifecycleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/jobs/${jobId}/lifecycle`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!cancelled) setEvents(data.events ?? []);
      } catch {
        // Use empty state on error
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [jobId]);

  // Sort events chronologically (oldest first)
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [events],
  );

  const lastIndex = sortedEvents.length - 1;

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-bold text-zinc-700 dark:text-zinc-300">
          Job Timeline
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-2 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sortedEvents.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Timeline events will appear here once a bid is accepted.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-5 text-sm font-bold text-zinc-900 dark:text-zinc-50">
        Job Timeline
      </h3>

      <div className="relative" role="list" aria-label="Job lifecycle timeline">
        {sortedEvents.map((event, idx) => {
          const style = EVENT_STYLES[event.type];
          const isLast = idx === lastIndex;
          const isCurrent = isLast; // last event = current/active
          const detail = getEventDetail(event);

          return (
            <div
              key={`${event.type}-${event.timestamp}`}
              className="relative flex gap-3 pb-6 last:pb-0"
              role="listitem"
            >
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-[13px] top-7 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700" />
              )}

              {/* Icon dot */}
              <div className="relative z-10 flex shrink-0">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${style.iconBg} ${style.iconColor} ${
                    isCurrent ? 'ring-4 ring-[#00a9e0]/20' : ''
                  }`}
                >
                  {style.icon}
                </div>
                {/* Pulse animation for current event */}
                {isCurrent && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#00a9e0]/30" style={{ animationDuration: '2s' }} />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <p className={`text-sm font-medium ${isCurrent ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-700 dark:text-zinc-300'}`}>
                  {getEventDescription(event.type)}
                </p>
                {detail && (
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {detail}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500" title={formatTimestamp(event.timestamp)}>
                  {formatRelativeTime(event.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import Link from 'next/link';
import type { Job } from '@/lib/mock-data/pro-data';

const urgencyConfig = {
  low: { label: 'Low', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  medium: { label: 'Medium', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  high: { label: 'High', bg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  emergency: { label: 'Emergency', bg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
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

interface JobCardProps {
  job: Job;
  showBidButton?: boolean;
}

export default function JobCard({ job, showBidButton = true }: JobCardProps) {
  const urgency = urgencyConfig[job.urgency];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start gap-2">
        <span className="rounded-md bg-[#1a1a2e]/10 px-2 py-0.5 text-xs font-medium text-[#1a1a2e] dark:bg-zinc-700 dark:text-zinc-300">
          {job.category}
        </span>
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${urgency.bg}`}>
          {urgency.label}
        </span>
        {job.dispatchScore && job.dispatchScore >= 90 && (
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            Top Match
          </span>
        )}
      </div>

      <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {job.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
        {job.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          ${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
          </svg>
          {job.distanceMiles} mi
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          {timeAgo(job.postedAt)}
        </span>
        {job.clientRating !== null && (
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
            </svg>
            {job.clientRating}
          </span>
        )}
      </div>

      {showBidButton && (
        <div className="mt-4 flex gap-2">
          <Link
            href={`/pro/jobs/${job.id}`}
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            View Details
          </Link>
          <Link
            href={`/pro/jobs/${job.id}`}
            className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-600 active:scale-[0.98]"
          >
            {job.type === 'auto-dispatch' ? 'Respond' : 'Quick Bid'}
          </Link>
        </div>
      )}
    </div>
  );
}

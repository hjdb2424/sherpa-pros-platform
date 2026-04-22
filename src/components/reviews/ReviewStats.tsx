'use client';

import { useState, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ReviewStatsData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  responseRate: number;
  avgResponseTimeHours: number;
  wouldHireAgainPercent: number;
}

interface ReviewStatsProps {
  proId: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReviewStats({ proId }: ReviewStatsProps) {
  const [stats, setStats] = useState<ReviewStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const res = await fetch(`/api/reviews/stats?proId=${proId}`);
        const data = await res.json();
        if (!cancelled) setStats(data);
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchStats();
    return () => { cancelled = true; };
  }, [proId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-5 rounded bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No reviews yet</p>
      </div>
    );
  }

  const maxCount = Math.max(...Object.values(stats.ratingDistribution), 1);

  return (
    <div className="space-y-5">
      {/* Large rating display */}
      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {stats.averageRating.toFixed(1)}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(stats.averageRating)
                    ? 'text-[#00a9e0]'
                    : 'text-zinc-200 dark:text-zinc-600'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Rating distribution bar chart */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats.ratingDistribution[star] ?? 0;
          const pct = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3">
              <span className="w-12 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {star} star{star !== 1 ? 's' : ''}
              </span>
              <div className="flex-1">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                  <div
                    className="h-full rounded-full bg-[#00a9e0] transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              <span className="w-16 text-right text-xs text-zinc-400 dark:text-zinc-500">
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Response Rate</p>
          <p className="mt-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {stats.responseRate}%
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
            Responds to {stats.responseRate}% of reviews
          </p>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Would Hire Again</p>
          <p className="mt-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {stats.wouldHireAgainPercent}%
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
            of clients would hire again
          </p>
        </div>
      </div>
    </div>
  );
}

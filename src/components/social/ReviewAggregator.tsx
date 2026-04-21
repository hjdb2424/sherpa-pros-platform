'use client';

import { useState, useEffect } from 'react';
import type { SocialPlatform } from '@/lib/services/social-sync';
import { PlatformIcon, platformMeta } from './PlatformIcons';
import ReviewImporter from './ReviewImporter';

interface AggregateData {
  avg: number;
  total: number;
  byPlatform: Record<SocialPlatform, { avg: number; count: number }>;
}

export default function ReviewAggregator() {
  const [data, setData] = useState<AggregateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [importPlatform, setImportPlatform] = useState<SocialPlatform | null>(null);

  useEffect(() => {
    async function fetchAggregate() {
      try {
        const res = await fetch('/api/social/aggregate');
        const json = await res.json();
        setData(json);
      } catch {
        // empty
      } finally {
        setLoading(false);
      }
    }
    fetchAggregate();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-16 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
      </div>
    );
  }

  if (!data || data.total === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No reviews synced yet. Connect your social platforms to aggregate reviews.
        </p>
      </div>
    );
  }

  const platformsWithReviews = (Object.entries(data.byPlatform) as [SocialPlatform, { avg: number; count: number }][])
    .filter(([, v]) => v.count > 0)
    .sort((a, b) => b[1].count - a[1].count);

  const maxCount = Math.max(...platformsWithReviews.map(([, v]) => v.count), 1);

  return (
    <div className="space-y-4">
      {/* Aggregate score */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {/* Large star + score */}
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
              <svg className="h-9 w-9 text-amber-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{data.avg}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Based on {data.total} review{data.total !== 1 ? 's' : ''} across {platformsWithReviews.length} platform{platformsWithReviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Star display */}
          <div className="flex items-center gap-1 sm:ml-auto">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-6 w-6 ${
                  star <= Math.floor(data.avg)
                    ? 'text-amber-500'
                    : star <= data.avg
                      ? 'text-amber-300'
                      : 'text-zinc-200 dark:text-zinc-600'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
              </svg>
            ))}
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="mt-6 space-y-3">
          {platformsWithReviews.map(([platform, stats]) => {
            const meta = platformMeta[platform];
            const barWidth = Math.round((stats.count / maxCount) * 100);

            return (
              <div key={platform} className="flex items-center gap-3">
                <div className="flex w-8 shrink-0 items-center justify-center">
                  <PlatformIcon platform={platform} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{meta.label}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      <svg className="mr-0.5 inline h-3 w-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                      </svg>
                      {stats.avg} ({stats.count})
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%`, backgroundColor: meta.color }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setImportPlatform(platform)}
                  className="shrink-0 text-xs font-medium text-[#00a9e0] transition-colors hover:text-[#0098ca]"
                >
                  Import
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Import modal */}
      {importPlatform && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Import Reviews from {platformMeta[importPlatform].label}
              </h3>
              <button
                type="button"
                onClick={() => setImportPlatform(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              <ReviewImporter platform={importPlatform} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

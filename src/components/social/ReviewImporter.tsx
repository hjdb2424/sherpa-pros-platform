'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SocialReview, SocialPlatform } from '@/lib/services/social-sync';
import { PlatformBadge } from './PlatformIcons';

interface ReviewImporterProps {
  platform: SocialPlatform;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= rating ? 'text-amber-500' : 'text-zinc-200 dark:text-zinc-600'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewImporter({ platform }: ReviewImporterProps) {
  const [reviews, setReviews] = useState<SocialReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/social/reviews?platform=${platform}`);
      const data = await res.json();
      setReviews(data.reviews ?? []);
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  }, [platform]);

  useEffect(() => {
    fetchReviews();
    setSelected(new Set());
  }, [fetchReviews]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleToggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleImport = async () => {
    if (selected.size === 0) return;
    setImporting(true);
    try {
      const res = await fetch('/api/social/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (data.success) {
        setToast(`Imported ${data.imported} review${data.imported !== 1 ? 's' : ''}`);
        setSelected(new Set());
        await fetchReviews();
      }
    } catch {
      setToast('Import failed. Try again.');
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No reviews found on this platform.</p>
      </div>
    );
  }

  const selectableReviews = reviews.filter((r) => !r.imported);

  return (
    <div className="space-y-3">
      {/* Review list */}
      {reviews.map((review) => {
        const isSelected = selected.has(review.id);
        const isImported = review.imported;
        const formattedDate = new Date(review.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        return (
          <button
            key={review.id}
            type="button"
            onClick={() => !isImported && handleToggle(review.id)}
            disabled={isImported}
            className={`w-full rounded-xl border p-4 text-left transition-all ${
              isImported
                ? 'cursor-default border-zinc-100 bg-zinc-50 opacity-60 dark:border-zinc-800 dark:bg-zinc-800/50'
                : isSelected
                  ? 'border-[#00a9e0] bg-sky-50/50 ring-1 ring-[#00a9e0] dark:bg-sky-900/10'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                isImported
                  ? 'border-emerald-400 bg-emerald-100 dark:bg-emerald-900/30'
                  : isSelected
                    ? 'border-[#00a9e0] bg-[#00a9e0]'
                    : 'border-zinc-300 dark:border-zinc-600'
              }`}>
                {(isSelected || isImported) && (
                  <svg className={`h-3 w-3 ${isImported ? 'text-emerald-600 dark:text-emerald-400' : 'text-white'}`} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {review.reviewerName}
                  </span>
                  <StarDisplay rating={review.rating} />
                  <PlatformBadge platform={review.platform} />
                  {review.verified && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Verified Review
                    </span>
                  )}
                  {isImported && (
                    <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                      Imported
                    </span>
                  )}
                  <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">{formattedDate}</span>
                </div>

                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {review.text}
                </p>

                {review.responseText && (
                  <div className="mt-2 rounded-lg border-l-2 border-[#00a9e0] bg-sky-50/50 py-2 pl-3 pr-2 dark:bg-sky-900/10">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Owner response:</p>
                    <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">{review.responseText}</p>
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}

      {/* Import button */}
      {selectableReviews.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {selected.size} of {selectableReviews.length} selected
          </span>
          <button
            type="button"
            onClick={handleImport}
            disabled={importing || selected.size === 0}
            className="rounded-lg bg-[#00a9e0] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0098ca] disabled:opacity-50"
          >
            {importing
              ? 'Importing...'
              : `Import ${selected.size} Review${selected.size !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 bottom-20 z-50 animate-fade-slide-up rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900 lg:bottom-4">
          {toast}
        </div>
      )}
    </div>
  );
}

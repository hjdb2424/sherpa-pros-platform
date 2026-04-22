'use client';

import { useState, useEffect, useCallback } from 'react';
import ReviewCard from './ReviewCard';
import type { ProResponse, ReviewPhoto } from './ReviewCard';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ReviewData {
  id: string;
  reviewerName: string;
  rating: number;
  text: string;
  date: string;
  role: 'client' | 'pro';
  projectType?: string;
  verified?: boolean;
  photos?: ReviewPhoto[];
  response?: ProResponse | null;
  helpfulCount?: number;
  wouldHireAgain?: boolean | null;
  tipsForOthers?: string;
}

type SortOption = 'recent' | 'highest' | 'lowest';
type RatingFilter = 0 | 1 | 2 | 3 | 4 | 5;

interface ReviewListProps {
  proId: string;
  /** Show respond button on each review (for pro view) */
  showRespondButtons?: boolean;
  onRespondToReview?: (reviewId: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReviewList({
  proId,
  showRespondButtons = false,
  onRespondToReview,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('recent');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>(0);
  const [withPhotos, setWithPhotos] = useState(false);
  const [withResponse, setWithResponse] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ proId, sort });
      if (ratingFilter > 0) params.set('rating', String(ratingFilter));
      if (withPhotos) params.set('withPhotos', 'true');
      if (withResponse) params.set('withResponse', 'true');

      const res = await fetch(`/api/reviews?${params.toString()}`);
      const data = await res.json();
      setReviews(data.reviews ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [proId, sort, ratingFilter, withPhotos, withResponse]);

  useEffect(() => {
    fetchReviews();
    setVisibleCount(5);
  }, [fetchReviews]);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <div className="space-y-4">
      {/* Filter / Sort bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          aria-label="Sort reviews"
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>

        {/* Rating filter pills */}
        <div className="flex items-center gap-1">
          {([0, 5, 4, 3, 2, 1] as RatingFilter[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRatingFilter(r)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                ratingFilter === r
                  ? 'bg-[#00a9e0] text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600'
              }`}
              aria-pressed={ratingFilter === r}
            >
              {r === 0 ? 'All' : `${r} Star${r > 1 ? 's' : ''}`}
            </button>
          ))}
        </div>

        {/* Toggle filters */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWithPhotos(!withPhotos)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              withPhotos
                ? 'bg-[#00a9e0] text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600'
            }`}
            aria-pressed={withPhotos}
          >
            With Photos
          </button>
          <button
            type="button"
            onClick={() => setWithResponse(!withResponse)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              withResponse
                ? 'bg-[#00a9e0] text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600'
            }`}
            aria-pressed={withResponse}
          >
            With Response
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && reviews.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 p-8 text-center dark:border-zinc-700">
          <svg
            className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            No reviews yet — be the first!
          </p>
        </div>
      )}

      {/* Reviews */}
      {!loading && visibleReviews.length > 0 && (
        <div className="space-y-3">
          {visibleReviews.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              reviewerName={review.reviewerName}
              rating={review.rating}
              text={review.text}
              date={review.date}
              role={review.role}
              projectType={review.projectType}
              verified={review.verified}
              photos={review.photos}
              response={review.response}
              helpfulCount={review.helpfulCount}
              wouldHireAgain={review.wouldHireAgain}
              tipsForOthers={review.tipsForOthers}
              showRespondButton={showRespondButtons}
              onRespond={onRespondToReview}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {!loading && hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((c) => c + 5)}
          className="w-full rounded-full border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-600 transition-all hover:border-[#00a9e0] hover:text-[#00a9e0] dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-[#00a9e0] dark:hover:text-[#00a9e0]"
        >
          Load More Reviews ({reviews.length - visibleCount} remaining)
        </button>
      )}
    </div>
  );
}

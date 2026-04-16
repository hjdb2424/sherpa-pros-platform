'use client';

import { useState, useCallback } from 'react';

interface RatingFormProps {
  proName: string;
  jobTitle: string;
  onSubmit?: (data: RatingData) => void;
}

interface RatingData {
  overall: number;
  quality: number;
  communication: number;
  timeliness: number;
  value: number;
  review: string;
}

const CATEGORIES = [
  { key: 'overall', label: 'Overall Experience' },
  { key: 'quality', label: 'Quality of Work' },
  { key: 'communication', label: 'Communication' },
  { key: 'timeliness', label: 'Timeliness' },
  { key: 'value', label: 'Value for Money' },
] as const;

function StarSelector({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <div className="flex gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="min-h-[44px] min-w-[44px] p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <svg
              className={`h-7 w-7 ${
                star <= (hover || value) ? 'text-amber-400' : 'text-zinc-200'
              } transition-colors`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export function RatingForm({ proName, jobTitle, onSubmit }: RatingFormProps) {
  const [ratings, setRatings] = useState<RatingData>({
    overall: 0,
    quality: 0,
    communication: 0,
    timeliness: 0,
    value: 0,
    review: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleRatingChange = useCallback((key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = () => {
    if (ratings.overall === 0) return;
    onSubmit?.(ratings);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-emerald-900">Thank you for your review!</h3>
        <p className="mt-1 text-sm text-emerald-700">
          Your feedback helps other homeowners find great Pros.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-zinc-900">Rate your experience</h3>
      <p className="mt-1 text-sm text-zinc-500">
        How was working with {proName} on &ldquo;{jobTitle}&rdquo;?
      </p>

      <div className="mt-6 space-y-4">
        {CATEGORIES.map(({ key, label }) => (
          <StarSelector
            key={key}
            label={label}
            value={ratings[key as keyof RatingData] as number}
            onChange={(v) => handleRatingChange(key, v)}
          />
        ))}
      </div>

      <div className="mt-6">
        <label htmlFor="review-text" className="block text-sm font-medium text-zinc-700">
          Write a review (optional)
        </label>
        <textarea
          id="review-text"
          rows={4}
          value={ratings.review}
          onChange={(e) => setRatings((prev) => ({ ...prev, review: e.target.value }))}
          placeholder="Tell other homeowners about your experience..."
          className="mt-2 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 focus-visible:ring-amber-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={ratings.overall === 0}
        className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        Submit Review
      </button>
    </div>
  );
}

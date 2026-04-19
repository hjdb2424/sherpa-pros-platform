'use client';

import { useState, useCallback } from 'react';

interface WriteReviewProps {
  jobTitle: string;
  recipientName: string;
  onSubmit: (data: { rating: number; text: string }) => void;
}

export default function WriteReview({ jobTitle, recipientName, onSubmit }: WriteReviewProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleSubmit = useCallback(() => {
    if (rating === 0) return;
    setAnimating(true);
    // Haptic-style animation delay
    setTimeout(() => {
      onSubmit({ rating, text });
      setSubmitted(true);
      setAnimating(false);
    }, 600);
  }, [rating, text, onSubmit]);

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
          <svg
            className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">Review Submitted!</h3>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
          Thank you for reviewing {recipientName}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Write a Review</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        How was your experience with {recipientName} on &ldquo;{jobTitle}&rdquo;?
      </p>

      {/* Star rating selector */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Rating
        </label>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="min-h-[44px] min-w-[44px] rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0]"
              role="radio"
              aria-checked={star === rating}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              <svg
                className={`h-8 w-8 transition-colors ${
                  star <= (hover || rating) ? 'text-[#00a9e0]' : 'text-zinc-200 dark:text-zinc-600'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Text area */}
      <div className="mt-5">
        <label
          htmlFor="review-text-write"
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Your Review
        </label>
        <textarea
          id="review-text-write"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell others about your experience..."
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={rating === 0 || animating}
        className={`mt-4 w-full rounded-full bg-[#00a9e0] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30 disabled:cursor-not-allowed disabled:opacity-50 ${
          animating ? 'scale-95 opacity-70' : ''
        }`}
      >
        {animating ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
}

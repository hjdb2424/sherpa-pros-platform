'use client';

import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ReviewPromptProps {
  proName: string;
  jobTitle: string;
  onStartReview: (rating: number) => void;
  onDismiss: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReviewPrompt({
  proName,
  jobTitle,
  onStartReview,
  onDismiss,
}: ReviewPromptProps) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="rounded-xl border-2 border-[#00a9e0]/20 bg-gradient-to-br from-sky-50 to-white p-5 shadow-sm dark:border-[#00a9e0]/10 dark:from-sky-950/20 dark:to-zinc-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a9e0]/10">
            <svg className="h-5 w-5 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              How was your experience with {proName}?
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              for &ldquo;{jobTitle}&rdquo;
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setDismissed(true); onDismiss(); }}
          className="shrink-0 text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          aria-label="Dismiss review prompt"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Star selector */}
      <div className="mt-4 flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => { setSelected(star); onStartReview(star); }}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="min-h-[48px] min-w-[48px] rounded-lg p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0]"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <svg
              className={`h-8 w-8 transition-colors ${
                star <= (hover || selected)
                  ? 'text-[#00a9e0]'
                  : 'text-zinc-200 dark:text-zinc-600'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onStartReview(0)}
          className="rounded-full bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl"
        >
          Write a Review
        </button>
        <button
          type="button"
          onClick={() => { setDismissed(true); onDismiss(); }}
          className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}

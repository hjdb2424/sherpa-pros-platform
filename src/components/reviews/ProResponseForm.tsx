'use client';

import { useState, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProResponseFormProps {
  reviewId: string;
  reviewerName: string;
  reviewText: string;
  reviewRating: number;
  proName: string;
  onSubmit: (reviewId: string, text: string) => void;
  onCancel: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProResponseForm({
  reviewId,
  reviewerName,
  reviewText,
  reviewRating,
  proName,
  onSubmit,
  onCancel,
}: ProResponseFormProps) {
  const [text, setText] = useState('');
  const [previewing, setPreviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const MAX_CHARS = 300;
  const isValid = text.trim().length > 0 && text.length <= MAX_CHARS;

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      await fetch(`/api/reviews/${reviewId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), proName }),
      });
      onSubmit(reviewId, text.trim());
      setSubmitted(true);
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }, [isValid, reviewId, text, proName, onSubmit]);

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
        <svg className="mx-auto h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <p className="mt-2 text-sm font-medium text-emerald-800 dark:text-emerald-300">
          Response posted successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Respond to Review</h4>

      {/* Original review context */}
      <div className="mt-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {reviewerName}
          </span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                className={`h-3 w-3 ${s <= reviewRating ? 'text-[#00a9e0]' : 'text-zinc-200 dark:text-zinc-600'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3">{reviewText}</p>
      </div>

      {/* Preview mode */}
      {previewing ? (
        <div className="mt-4">
          <div className="rounded-lg border-l-2 border-[#00a9e0]/30 bg-sky-50 p-3 dark:bg-sky-900/10">
            <span className="rounded-full bg-[#00a9e0]/10 px-2 py-0.5 text-[10px] font-bold text-[#00a9e0] uppercase tracking-wider">
              Pro Response
            </span>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{text}</p>
            <p className="mt-1 text-xs font-medium text-zinc-500">&mdash; {proName}</p>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setPreviewing(false)}
              className="flex-1 rounded-full border border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 rounded-full bg-[#00a9e0] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Response'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Response textarea */}
          <div className="mt-4">
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your response..."
              maxLength={MAX_CHARS}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-zinc-400 dark:text-zinc-500">
                Your response will be visible to everyone
              </span>
              <span
                className={
                  text.length > MAX_CHARS * 0.9
                    ? text.length >= MAX_CHARS
                      ? 'text-red-500 font-medium'
                      : 'text-amber-500'
                    : 'text-zinc-400 dark:text-zinc-500'
                }
              >
                {text.length}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-full border border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setPreviewing(true)}
              disabled={!isValid}
              className="flex-1 rounded-full border border-[#00a9e0]/30 px-4 py-2.5 text-xs font-semibold text-[#00a9e0] transition-all hover:bg-sky-50 disabled:opacity-40 dark:hover:bg-sky-900/10"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="flex-1 rounded-full bg-[#00a9e0] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Response'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

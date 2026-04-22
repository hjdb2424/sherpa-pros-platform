'use client';

import { useState, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ReviewPhoto {
  id: string;
  url: string;
  alt: string;
}

export interface ProResponse {
  text: string;
  date: string;
  proName: string;
}

export interface ReviewCardProps {
  id?: string;
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
  /** Show respond button for pros */
  showRespondButton?: boolean;
  onRespond?: (reviewId: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'text-[#00a9e0]' : 'text-zinc-200 dark:text-zinc-600'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReviewCard({
  id,
  reviewerName,
  rating,
  text,
  date,
  role,
  projectType,
  verified = false,
  photos = [],
  response = null,
  helpfulCount = 0,
  wouldHireAgain,
  tipsForOthers,
  showRespondButton = false,
  onRespond,
}: ReviewCardProps) {
  const [localHelpful, setLocalHelpful] = useState(helpfulCount);
  const [hasVoted, setHasVoted] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const initials = reviewerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleHelpful = useCallback(() => {
    if (hasVoted) return;
    setLocalHelpful((c) => c + 1);
    setHasVoted(true);
  }, [hasVoted]);

  return (
    <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm transition-all hover:border-[#00a9e0]/40 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a9e0]/10 text-sm font-bold text-[#00a9e0] dark:bg-[#00a9e0]/20">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          {/* Name + badges + time row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {reviewerName}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                role === 'pro'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-sky-50 text-[#00a9e0] dark:bg-sky-900/20 dark:text-sky-400'
              }`}
            >
              {role === 'pro' ? 'Pro' : 'Client'}
            </span>
            {verified && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12Z" />
                </svg>
                Verified
              </span>
            )}
            {projectType && (
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-semibold text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
                {projectType}
              </span>
            )}
            <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
              {timeAgo(date)}
            </span>
          </div>

          {/* Stars */}
          <div className="mt-1">
            <StarDisplay rating={rating} />
          </div>

          {/* Review text */}
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{text}</p>

          {/* Tips */}
          {tipsForOthers && (
            <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-900/10">
              <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                <span className="font-bold">Tip:</span> {tipsForOthers}
              </p>
            </div>
          )}

          {/* Would hire again */}
          {wouldHireAgain !== null && wouldHireAgain !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              {wouldHireAgain ? (
                <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.727a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6.75a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6.75z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.73 5.5h1.035A7.465 7.465 0 0118 9.625a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12.125c0-2.848.992-5.464 2.649-7.521C4.537 4.122 5.136 3.875 5.754 3.875h2.017c.483 0 .964.078 1.423.23l3.114 1.04c.459.153.94.23 1.423.23zM21.669 13.773a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V7.023a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6.75z" />
                </svg>
              )}
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {wouldHireAgain ? 'Would hire again' : 'Would not hire again'}
              </span>
            </div>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700"
                >
                  <div
                    className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400 dark:text-zinc-500"
                    title={photo.alt}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions row */}
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={handleHelpful}
              disabled={hasVoted}
              className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
                hasVoted
                  ? 'text-[#00a9e0] font-medium'
                  : 'text-zinc-400 hover:text-[#00a9e0] dark:text-zinc-500 dark:hover:text-[#00a9e0]'
              }`}
            >
              <svg className="h-3.5 w-3.5" fill={hasVoted ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.727a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6.75a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6.75z" />
              </svg>
              Helpful{localHelpful > 0 ? ` (${localHelpful})` : ''}
            </button>

            <button
              type="button"
              onClick={() => setShowReport(true)}
              className="text-xs text-zinc-400 transition-colors hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400"
            >
              Report
            </button>

            {showRespondButton && !response && id && onRespond && (
              <button
                type="button"
                onClick={() => onRespond(id)}
                className="text-xs font-medium text-[#00a9e0] transition-colors hover:text-[#0090c0]"
              >
                Respond
              </button>
            )}
          </div>

          {/* Report confirmation */}
          {showReport && (
            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-900/20">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Review flagged for moderation. Our team will review within 24 hours.
              </p>
            </div>
          )}

          {/* Pro Response */}
          {response && (
            <div className="mt-4 ml-2 border-l-2 border-[#00a9e0]/30 pl-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#00a9e0]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#00a9e0] uppercase tracking-wider dark:bg-[#00a9e0]/20">
                  Pro Response
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {timeAgo(response.date)}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {response.text}
              </p>
              <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                &mdash; {response.proName}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface WriteReviewData {
  rating: number;
  text: string;
  wouldHireAgain: boolean | null;
  tipsForOthers: string;
  photos: File[];
}

interface WriteReviewProps {
  jobTitle: string;
  recipientName: string;
  projectType?: string;
  onSubmit: (data: WriteReviewData) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function WriteReview({
  jobTitle,
  recipientName,
  projectType,
  onSubmit,
}: WriteReviewProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [wouldHireAgain, setWouldHireAgain] = useState<boolean | null>(null);
  const [tipsForOthers, setTipsForOthers] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [previewing, setPreviewing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [animating, setAnimating] = useState(false);

  const MIN_CHARS = 10;
  const MAX_CHARS = 500;
  const MAX_PHOTOS = 5;

  const isValid = rating > 0 && text.trim().length >= MIN_CHARS && text.length <= MAX_CHARS;

  const handleAddPhotos = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      const remaining = MAX_PHOTOS - photos.length;
      const toAdd = files.slice(0, remaining);

      setPhotos((prev) => [...prev, ...toAdd]);
      const urls = toAdd.map((f) => URL.createObjectURL(f));
      setPhotoUrls((prev) => [...prev, ...urls]);

      // Reset input
      e.target.value = '';
    },
    [photos.length],
  );

  const handleRemovePhoto = useCallback(
    (idx: number) => {
      URL.revokeObjectURL(photoUrls[idx]);
      setPhotos((prev) => prev.filter((_, i) => i !== idx));
      setPhotoUrls((prev) => prev.filter((_, i) => i !== idx));
    },
    [photoUrls],
  );

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    setAnimating(true);
    setTimeout(() => {
      onSubmit({ rating, text: text.trim(), wouldHireAgain, tipsForOthers: tipsForOthers.trim(), photos });
      setSubmitted(true);
      setAnimating(false);
    }, 600);
  }, [isValid, rating, text, wouldHireAgain, tipsForOthers, photos, onSubmit]);

  /* ---- Success state ---- */
  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
          <svg className="h-7 w-7 text-emerald-600 dark:text-emerald-400 animate-[bounceIn_0.5s_ease-out]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">Review Submitted!</h3>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
          Thank you for reviewing {recipientName}. Your feedback helps the community.
        </p>
      </div>
    );
  }

  /* ---- Preview mode ---- */
  if (previewing) {
    return (
      <div className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Preview Your Review</h3>
          <button
            type="button"
            onClick={() => setPreviewing(false)}
            className="text-sm font-medium text-[#00a9e0] hover:text-[#0090c0]"
          >
            Edit
          </button>
        </div>

        {/* Preview card */}
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className={`h-5 w-5 ${s <= rating ? 'text-[#00a9e0]' : 'text-zinc-200 dark:text-zinc-600'}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            {projectType && (
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-semibold text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
                {projectType}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{text}</p>
          {tipsForOthers && (
            <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-900/10">
              <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                <span className="font-bold">Tip:</span> {tipsForOthers}
              </p>
            </div>
          )}
          {wouldHireAgain !== null && (
            <p className="mt-2 text-xs text-zinc-500">
              {wouldHireAgain ? 'Would hire again' : 'Would not hire again'}
            </p>
          )}
          {photoUrls.length > 0 && (
            <div className="mt-3 flex gap-2">
              {photoUrls.map((url, i) => (
                <div key={i} className="h-14 w-14 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-600">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={animating}
          className={`mt-4 w-full rounded-full bg-[#00a9e0] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 ${
            animating ? 'scale-95 opacity-70' : ''
          }`}
        >
          {animating ? 'Submitting...' : 'Confirm & Submit'}
        </button>
      </div>
    );
  }

  /* ---- Form ---- */
  return (
    <div className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Write a Review</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        How was your experience with {recipientName} on &ldquo;{jobTitle}&rdquo;?
      </p>

      {/* Project type auto-fill */}
      {projectType && (
        <div className="mt-3">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
            {projectType}
          </span>
        </div>
      )}

      {/* Star rating selector */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Rating <span className="text-red-500">*</span>
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

      {/* Text area with character count */}
      <div className="mt-5">
        <label
          htmlFor="review-text-write"
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-text-write"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell others about your experience..."
          maxLength={MAX_CHARS}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className={text.length > 0 && text.length < MIN_CHARS ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500'}>
            {text.length > 0 && text.length < MIN_CHARS
              ? `${MIN_CHARS - text.length} more characters needed`
              : `Min ${MIN_CHARS} characters`}
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

      {/* Would hire again toggle */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Would you hire {recipientName} again?
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setWouldHireAgain(wouldHireAgain === true ? null : true)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              wouldHireAgain === true
                ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500/30 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600'
            }`}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.727a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6.75a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6.75z" />
            </svg>
            Yes
          </button>
          <button
            type="button"
            onClick={() => setWouldHireAgain(wouldHireAgain === false ? null : false)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              wouldHireAgain === false
                ? 'bg-red-100 text-red-800 ring-2 ring-red-500/30 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600'
            }`}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.73 5.5h1.035A7.465 7.465 0 0118 9.625a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12.125c0-2.848.992-5.464 2.649-7.521C4.537 4.122 5.136 3.875 5.754 3.875h2.017c.483 0 .964.078 1.423.23l3.114 1.04c.459.153.94.23 1.423.23zM21.669 13.773a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V7.023a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6.75z" />
            </svg>
            No
          </button>
        </div>
      </div>

      {/* Tips for others */}
      <div className="mt-5">
        <label
          htmlFor="tips-for-others"
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Tips for others <span className="text-xs text-zinc-400">(optional)</span>
        </label>
        <input
          id="tips-for-others"
          type="text"
          value={tipsForOthers}
          onChange={(e) => setTipsForOthers(e.target.value)}
          placeholder="e.g., Have your paint color picked before the trim goes in..."
          maxLength={200}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      {/* Photo upload */}
      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Photos <span className="text-xs text-zinc-400">(optional, up to {MAX_PHOTOS})</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {photoUrls.map((url, i) => (
            <div key={i} className="group relative h-16 w-16 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-600">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemovePhoto(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove photo ${i + 1}`}
              >
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 transition-colors hover:border-[#00a9e0] hover:bg-sky-50 dark:border-zinc-600 dark:hover:border-[#00a9e0] dark:hover:bg-sky-900/10">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddPhotos}
                className="hidden"
              />
              <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </label>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setPreviewing(true)}
          disabled={!isValid}
          className="flex-1 rounded-full border border-[#00a9e0]/30 px-6 py-3.5 text-sm font-semibold text-[#00a9e0] transition-all hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-sky-900/20"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || animating}
          className={`flex-1 rounded-full bg-[#00a9e0] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30 disabled:cursor-not-allowed disabled:opacity-50 ${
            animating ? 'scale-95 opacity-70' : ''
          }`}
        >
          {animating ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
}

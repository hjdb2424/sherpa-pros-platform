'use client';

interface ReviewCardProps {
  reviewerName: string;
  rating: number;
  text: string;
  date: string;
  role: 'client' | 'pro';
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

export default function ReviewCard({ reviewerName, rating, text, date, role }: ReviewCardProps) {
  const initials = reviewerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm transition-all hover:border-[#00a9e0]/40 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a9e0]/10 text-sm font-bold text-[#00a9e0] dark:bg-[#00a9e0]/20">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          {/* Name + badge + date row */}
          <div className="flex items-center gap-2">
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
            <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">{formattedDate}</span>
          </div>

          {/* Stars */}
          <div className="mt-1">
            <StarDisplay rating={rating} />
          </div>

          {/* Review text */}
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{text}</p>
        </div>
      </div>
    </div>
  );
}

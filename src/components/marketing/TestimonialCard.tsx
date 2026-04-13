import { StarIcon } from '@heroicons/react/24/solid';

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
}

export default function TestimonialCard({
  name,
  role,
  quote,
  rating,
  initials,
}: TestimonialCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
      <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon
            key={i}
            className={`h-5 w-5 ${i < rating ? 'text-amber-500' : 'text-zinc-200'}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-zinc-700">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a2e] text-sm font-bold text-amber-500"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-900">{name}</div>
          <div className="text-xs text-zinc-500">{role}</div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
        {description}
      </p>
      {ctaLabel && ctaHref && (
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href={ctaHref}
            className="inline-flex items-center rounded-full bg-[#00a9e0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0ea5e9] hover:shadow-xl active:scale-[0.98]"
          >
            {ctaLabel}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

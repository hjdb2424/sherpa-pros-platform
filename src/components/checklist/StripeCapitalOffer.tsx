'use client';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StripeCapitalOfferProps {
  proName: string;
}

// ---------------------------------------------------------------------------
// Component — informational only, Stripe manages Capital offers automatically
// ---------------------------------------------------------------------------

export default function StripeCapitalOffer({
  proName,
}: StripeCapitalOfferProps) {
  return (
    <section
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900"
      aria-label="Stripe Capital offer"
    >
      <div className="flex items-start gap-3">
        {/* Stripe brand icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#635bff]/10">
          <svg
            className="h-5 w-5 text-[#635bff]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Need cash flow?
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {proName}, Stripe Capital can advance funds against your future
            earnings to help cover materials and crew costs.
          </p>

          <a
            href="https://dashboard.stripe.com/capital"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#635bff]/10 px-3.5 py-1.5 text-xs font-semibold text-[#635bff] transition-all hover:bg-[#635bff]/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
          >
            Learn More
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

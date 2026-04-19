import Link from 'next/link';
import StatsCounter from './StatsCounter';
import Logo from '@/components/brand/Logo';

interface HeroProps {
  /** Override stats displayed in the counter */
  stats?: { value: number; suffix: string; label: string }[];
}

export default function Hero({ stats }: HeroProps = {}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-zinc-50">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,169,224,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,169,224,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial glow */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00a9e0]/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8 lg:pb-32 lg:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <div className="animate-fade-slide-up mb-6 flex justify-center">
            <Logo size="xl" />
          </div>

          {/* Badge */}
          <div className="animate-fade-slide-up mb-8 inline-flex items-center gap-2 rounded-full border border-[#00a9e0]/20 bg-[#00a9e0]/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-xs font-medium text-[#00a9e0] sm:text-sm">
              Now serving New England
            </span>
          </div>

          <h1 className="animate-fade-slide-up stagger-1 text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            The Only Marketplace That Actually{' '}
            <span className="bg-gradient-to-r from-[#00a9e0] to-[#0ea5e9] bg-clip-text text-transparent">
              Understands Construction
            </span>
          </h1>

          <p className="animate-fade-slide-up stagger-2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 sm:text-xl">
            Every Pro verified. Every project validated. AI-powered matching
            that protects both sides.
          </p>

          {/* CTAs */}
          <div className="animate-fade-slide-up stagger-3 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/client/post-job"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#00a9e0] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0ea5e9] hover:shadow-xl hover:shadow-[#00a9e0]/30 active:scale-[0.98] sm:w-auto"
            >
              Post a Job
              <svg
                className="ml-2 h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="/for-pros"
              className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 px-8 py-3.5 text-base font-semibold text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.98] sm:w-auto"
            >
              Join as a Pro
            </Link>
          </div>

          {/* Login link */}
          <p className="animate-fade-slide-up stagger-4 mt-6 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="font-semibold text-[#00a9e0] transition-colors hover:text-[#0ea5e9]"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 max-w-xl">
          <StatsCounter stats={stats} />
        </div>
      </div>
    </section>
  );
}

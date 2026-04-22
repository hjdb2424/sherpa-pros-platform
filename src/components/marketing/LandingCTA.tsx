'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';

/**
 * Final CTA section on landing page — translated.
 * Extracted as client component so the landing page can remain a Server Component.
 */
export default function LandingCTA() {
  const { t } = useI18n();

  return (
    <section className="bg-[#00a9e0] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          {t('landing.readyToStart')}
        </h2>
        <p className="mt-4 text-lg text-white/80">
          {t('landing.readyDesc')}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/client/post-job"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#ff4500] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#ff4500]/25 transition-all hover:bg-[#e63e00] hover:shadow-xl sm:w-auto"
          >
            {t('hero.postJob')}
          </Link>
          <Link
            href="/for-pros"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10 sm:w-auto"
          >
            {t('hero.joinAsPro')}
          </Link>
        </div>
      </div>
    </section>
  );
}

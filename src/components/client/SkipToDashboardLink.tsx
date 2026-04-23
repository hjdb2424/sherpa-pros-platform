'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const STORAGE_KEY = 'sherpa-seen-dashboard';

/**
 * Shows a "Skip to Dashboard" link when the user was redirected here
 * from the dashboard (first-visit flow). Clicking it sets the localStorage
 * flag so the redirect won't happen again.
 */
export function SkipToDashboardLink() {
  const searchParams = useSearchParams();
  const fromDashboard = searchParams.get('from') === 'dashboard';

  if (!fromDashboard) return null;

  return (
    <Link
      href="/client/dashboard"
      onClick={() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, 'true');
        }
      }}
      className="shrink-0 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
    >
      Skip to Dashboard
    </Link>
  );
}

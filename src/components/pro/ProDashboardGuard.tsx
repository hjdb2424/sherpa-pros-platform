'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  UserCircleIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { userStorage } from '@/lib/user-storage';

const setupSteps = [
  { label: 'Complete Profile', key: 'profile' },
  { label: 'License Verification', key: 'license' },
  { label: 'First Job', key: 'first-job' },
] as const;

function WelcomeView() {
  return (
    <div className="space-y-8">
      {/* Welcome heading */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Welcome to Sherpa Pros
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Get set up in a few quick steps and start landing jobs in your area.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Complete Profile card */}
        <Link
          href="/pro/profile"
          className="group flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:border-[#00a9e0]/40 hover:shadow-lg hover:shadow-[#00a9e0]/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-sky-500/40"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00a9e0]/10 text-[#00a9e0] transition-transform group-hover:scale-110 dark:bg-sky-900/30 dark:text-sky-400">
            <UserCircleIcon className="h-8 w-8" />
          </span>
          <h2 className="mt-5 text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Add your trades, service area, and portfolio so clients can find you.
          </p>
          <span className="mt-6 inline-flex items-center rounded-full bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#00a9e0]/25 transition-all group-hover:shadow-lg group-hover:shadow-[#00a9e0]/30">
            Get Started
          </span>
        </Link>

        {/* Browse Jobs card */}
        <Link
          href="/pro/jobs"
          className="group flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500/40"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-emerald-900/30 dark:text-emerald-400">
            <BriefcaseIcon className="h-8 w-8" />
          </span>
          <h2 className="mt-5 text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Browse Available Jobs
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            See what jobs are open near you and submit your first bid.
          </p>
          <span className="mt-6 inline-flex items-center rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-all group-hover:border-emerald-300 group-hover:bg-emerald-50 group-hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:border-emerald-600 dark:group-hover:bg-emerald-900/20 dark:group-hover:text-emerald-400">
            Browse Jobs
          </span>
        </Link>
      </div>

      {/* Setup progress */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Setup Progress
        </h3>
        <div className="mt-4 space-y-4">
          {setupSteps.map((step, idx) => {
            const icons = [ClipboardDocumentCheckIcon, ShieldCheckIcon, BriefcaseIcon];
            const Icon = icons[idx];
            return (
              <div key={step.key} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-zinc-200 text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-5">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div className="h-full w-0 rounded-full bg-gradient-to-r from-[#00a9e0] to-emerald-500 transition-all" />
          </div>
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">0 of 3 steps complete</p>
        </div>
      </div>
    </div>
  );
}

interface ProDashboardGuardProps {
  children: ReactNode;
}

export default function ProDashboardGuard({ children }: ProDashboardGuardProps) {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const flag = userStorage.get<boolean>('pro-setup-complete');
    setIsSetupComplete(flag === true);
  }, []);

  // Avoid flash: render nothing until we know the state
  if (isSetupComplete === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-[#00a9e0]" />
      </div>
    );
  }

  if (!isSetupComplete) {
    return <WelcomeView />;
  }

  return <>{children}</>;
}

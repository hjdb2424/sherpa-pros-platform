'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Dispatch } from '@/lib/mock-data/pro-data';

interface DispatchAlertProps {
  dispatch: Dispatch;
}

export default function DispatchAlert({ dispatch }: DispatchAlertProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function updateCountdown() {
      const diff = new Date(dispatch.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft('Expired');
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [dispatch.expiresAt]);

  if (expired) return null;

  return (
    <div
      className="relative overflow-hidden rounded-xl border-2 border-red-500 bg-red-50 p-4 shadow-lg dark:border-red-400 dark:bg-red-950/30"
      role="alert"
      aria-live="assertive"
      aria-label="Incoming dispatch request"
    >
      <div className="absolute top-0 right-0 left-0 h-1 bg-red-500">
        <div
          className="h-full bg-red-300 animate-pulse"
          style={{ width: '100%' }}
        />
      </div>

      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500 text-white" aria-hidden="true">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-red-800 dark:text-red-300">
              Incoming Dispatch
            </h3>
            <span className="rounded-md bg-red-200 px-2 py-0.5 text-xs font-bold text-red-800 dark:bg-red-800 dark:text-red-200">
              {dispatch.urgency === 'emergency' ? 'EMERGENCY' : 'URGENT'}
            </span>
          </div>

          <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
            {dispatch.jobTitle}
          </p>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-zinc-600 dark:text-zinc-400">
            <span>{dispatch.distanceMiles} mi away</span>
            <span>Up to ${dispatch.budgetMax.toLocaleString()}</span>
            <span>{dispatch.address}</span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <Link
              href={`/pro/jobs/${dispatch.jobId}`}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800"
            >
              Accept Dispatch
            </Link>
            <button
              type="button"
              className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Decline
            </button>
            <div
              className="ml-auto flex items-center gap-1.5 text-lg font-bold tabular-nums text-red-600 dark:text-red-400"
              aria-label={`Time remaining: ${timeLeft}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {timeLeft}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

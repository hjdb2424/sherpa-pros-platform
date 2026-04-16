'use client';

import { useEffect, useState, useCallback } from 'react';
import type { EmergencyPro, EmergencyCategory } from '@/lib/mock-data/emergency-data';
import { EmergencyTips } from './EmergencyTips';

interface EnRouteTrackerProps {
  pro: EmergencyPro;
  category: EmergencyCategory;
  onCancel: () => void;
}

export function EnRouteTracker({ pro, category, onCancel }: EnRouteTrackerProps) {
  const [etaMinutes, setEtaMinutes] = useState(pro.responseTimeMinutes);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [proPosition, setProPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
      setProPosition((prev) => Math.min(prev + 8, 85));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCancelClick = useCallback(() => {
    setShowCancelConfirm(true);
  }, []);

  const handleCancelConfirm = useCallback(() => {
    setShowCancelConfirm(false);
    onCancel();
  }, [onCancel]);

  const handleCancelDismiss = useCallback(() => {
    setShowCancelConfirm(false);
  }, []);

  return (
    <div className="flex w-full flex-col gap-5">
      {/* ETA Header */}
      <div className="rounded-2xl border border-emerald-700/50 bg-emerald-950/40 p-5 text-center">
        <p className="mb-1 text-sm text-emerald-300/70">En Route</p>
        <p className="text-3xl font-black text-emerald-400">
          {pro.name.split(' ')[0]} arriving in ~{etaMinutes} min
        </p>
      </div>

      {/* Map placeholder with animated route */}
      <div className="relative h-48 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-800">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
        {/* Route line */}
        <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 rounded-full bg-zinc-600">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
            style={{ width: `${proPosition}%` }}
          />
        </div>
        {/* Pro dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
          style={{ left: `calc(${proPosition}% + 16px)` }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/40">
            {pro.initials}
          </div>
        </div>
        {/* Client pin */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm text-white">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        </div>
        {/* Labels */}
        <div className="absolute bottom-2 left-4 text-[10px] text-zinc-500">Pro</div>
        <div className="absolute bottom-2 right-4 text-[10px] text-zinc-500">You</div>
      </div>

      {/* Pro info card */}
      <div className="flex items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1a1a2e] text-lg font-bold text-amber-400">
          {pro.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white">{pro.name}</p>
          <div className="flex items-center gap-1 text-sm text-amber-400">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {pro.rating}
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`tel:${pro.phone}`}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label={`Call ${pro.name}`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </a>
          <button
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-700 text-white transition-colors hover:bg-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={`Message ${pro.name}`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Emergency Tips */}
      <EmergencyTips category={category} />

      {/* Cancel */}
      <button
        onClick={handleCancelClick}
        className="w-full py-3 text-center text-sm text-zinc-500 underline underline-offset-2 transition-colors hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
      >
        Cancel Dispatch
      </button>

      {/* Cancel confirmation dialog */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Cancel dispatch confirmation"
        >
          <div className="w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
            <h3 className="mb-2 text-lg font-bold text-white">Cancel dispatch?</h3>
            <p className="mb-5 text-sm text-zinc-400">
              {pro.name} is already on the way. Are you sure you want to cancel?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelDismiss}
                autoFocus
                className="w-full sm:w-auto flex-1 rounded-xl bg-zinc-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-800"
              >
                Keep Dispatch
              </button>
              <button
                onClick={handleCancelConfirm}
                className="w-full sm:w-auto flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-800"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

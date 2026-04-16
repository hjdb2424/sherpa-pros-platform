'use client';

import { useState, useCallback } from 'react';
import type { EmergencyPro, EmergencyCategory } from '@/lib/mock-data/emergency-data';
import { GoogleMapProvider, DispatchTracker } from '@/components/maps';
import { MOCK_PROS, MOCK_DISPATCH_ROUTE } from '@/lib/mock-data/map-data';

interface EnRouteTrackerProps {
  pro: EmergencyPro;
  category: EmergencyCategory;
  onCancel: () => void;
}

export function EnRouteTracker({ pro, category, onCancel }: EnRouteTrackerProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancelConfirm = useCallback(() => {
    setShowCancelConfirm(false);
    onCancel();
  }, [onCancel]);

  const handleCancelDismiss = useCallback(() => {
    setShowCancelConfirm(false);
  }, []);

  const handleArrived = useCallback(() => {
    // Pro has arrived — could trigger a notification or state change
  }, []);

  return (
    <GoogleMapProvider>
      <DispatchTracker
        pro={MOCK_PROS[0]}
        route={MOCK_DISPATCH_ROUTE}
        onCancel={() => setShowCancelConfirm(true)}
        onArrived={handleArrived}
      />

      {/* Cancel confirmation dialog — overlays on top of the map */}
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
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleCancelDismiss}
                autoFocus
                className="w-full flex-1 rounded-xl bg-zinc-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4500] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-800 sm:w-auto"
              >
                Keep Dispatch
              </button>
              <button
                onClick={handleCancelConfirm}
                className="w-full flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4500] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-800 sm:w-auto"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </GoogleMapProvider>
  );
}

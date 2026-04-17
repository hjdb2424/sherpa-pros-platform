'use client';

import { useState, useEffect, useCallback } from 'react';
import { PhoneIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import type { GigDeliveryResult } from '@/lib/services/uber-connect';

// ---------------------------------------------------------------------------
// Status timeline steps
// ---------------------------------------------------------------------------

const STEPS = [
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Driver Accepted' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

const STATUS_ORDER: Record<StepKey, number> = {
  pending: 0,
  accepted: 1,
  picked_up: 2,
  in_transit: 3,
  delivered: 4,
};

function getStepIndex(status: GigDeliveryResult['status']): number {
  if (status === 'mock') return 0; // treat mock as pending
  return STATUS_ORDER[status as StepKey] ?? 0;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DeliveryTrackerProps {
  deliveryId: string;
  provider: 'uber' | 'doordash';
  onDelivered?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DeliveryTracker({
  deliveryId,
  provider,
  onDelivered,
}: DeliveryTrackerProps) {
  const [delivery, setDelivery] = useState<GigDeliveryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  // ---- Fetch status ----
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/materials/delivery?id=${encodeURIComponent(deliveryId)}`,
      );
      if (!res.ok) throw new Error('Failed to fetch status');
      const data = (await res.json()) as GigDeliveryResult;
      setDelivery(data);

      if (data.status === 'delivered') {
        onDelivered?.();
      }
    } catch {
      setError('Unable to load delivery status');
    }
  }, [deliveryId, onDelivered]);

  // ---- Poll every 15 seconds ----
  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      if (!cancelled && delivery?.status !== 'delivered') {
        fetchStatus();
      }
    }, 15_000);

    return () => clearInterval(interval);
  }, [fetchStatus, cancelled, delivery?.status]);

  // ---- Cancel handler ----
  const handleCancel = async () => {
    try {
      const res = await fetch('/api/materials/delivery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId }),
      });
      if (res.ok) setCancelled(true);
    } catch {
      // silently fail cancel
    }
  };

  // ---- Derived state ----
  const currentStep = delivery ? getStepIndex(delivery.status) : 0;
  const isDelivered = delivery?.status === 'delivered';
  const canCancel = currentStep < STATUS_ORDER.picked_up && !cancelled;

  // ---- ETA countdown ----
  const etaText = delivery
    ? formatEta(delivery.estimatedDeliveryTime)
    : '--:--';

  // ---- Provider badge ----
  const providerLabel = provider === 'uber' ? 'Uber Connect' : 'DoorDash Drive';
  const providerColor =
    provider === 'uber'
      ? 'bg-black text-white'
      : 'bg-red-600 text-white';

  if (cancelled) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <XMarkIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Delivery cancelled</span>
        </div>
      </div>
    );
  }

  if (error && !delivery) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-950/30">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Gig Delivery
          </h4>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {deliveryId}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${providerColor}`}
        >
          {providerLabel}
        </span>
      </div>

      <div className="p-5">
        {/* Delivery celebration */}
        {isDelivered && (
          <div className="mb-5 flex items-center gap-3 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
            <CheckCircleIcon className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                Materials Delivered
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Your order has arrived at the job site
              </p>
            </div>
          </div>
        )}

        {/* ETA */}
        {!isDelivered && (
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Estimated delivery
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {etaText}
            </p>
          </div>
        )}

        {/* Status timeline */}
        <div className="mb-5 space-y-0">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep && !isDelivered;
            const isLast = idx === STEPS.length - 1;

            return (
              <div key={step.key} className="flex items-start gap-3">
                {/* Dot + connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      h-3 w-3 rounded-full border-2 transition-colors
                      ${
                        isDone || (isLast && isDelivered)
                          ? 'border-emerald-500 bg-emerald-500'
                          : isCurrent
                            ? 'border-[#00a9e0] bg-[#00a9e0] animate-pulse'
                            : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                      }
                    `}
                  />
                  {!isLast && (
                    <div
                      className={`h-6 w-0.5 ${
                        isDone
                          ? 'bg-emerald-500'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`-mt-0.5 text-sm ${
                    isDone || (isLast && isDelivered)
                      ? 'font-medium text-emerald-700 dark:text-emerald-400'
                      : isCurrent
                        ? 'font-semibold text-[#00a9e0]'
                        : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Driver info */}
        {delivery?.driverName && (
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Driver
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {delivery.driverName}
              </p>
            </div>
            {delivery.driverPhone && (
              <a
                href={`tel:${delivery.driverPhone}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a9e0] text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                aria-label={`Call driver ${delivery.driverName}`}
              >
                <PhoneIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        )}

        {/* Cancel link */}
        {canCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="mt-4 text-xs font-medium text-zinc-400 underline underline-offset-2 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Cancel delivery
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatEta(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();

  if (diffMs <= 0) return 'Arriving now';

  const diffMin = Math.round(diffMs / 60_000);

  if (diffMin < 60) return `${diffMin} min`;

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

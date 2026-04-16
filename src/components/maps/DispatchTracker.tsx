'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { PhoneIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { useGoogleMaps } from './GoogleMapProvider';
import type { MockProLocation, MockRoute } from '@/lib/mock-data/map-data';

interface DispatchTrackerProps {
  pro: MockProLocation;
  route: MockRoute;
  onCancel?: () => void;
  onArrived?: () => void;
}

export default function DispatchTracker({
  pro,
  route,
  onCancel,
  onArrived,
}: DispatchTrackerProps) {
  const { isReady, mapId } = useGoogleMaps();
  const [eta, setEta] = useState(route.etaMinutes);
  const [proPos, setProPos] = useState(route.proStart);
  const [progress, setProgress] = useState(0);

  // Linear interpolation toward client location every 3s
  useEffect(() => {
    const totalTicks = route.etaMinutes / 0.5;
    let tick = 0;

    const interval = setInterval(() => {
      tick++;
      const t = Math.min(tick / totalTicks, 1);

      setProPos({
        lat: route.proStart.lat + (route.clientLocation.lat - route.proStart.lat) * t,
        lng: route.proStart.lng + (route.clientLocation.lng - route.proStart.lng) * t,
      });
      setEta((prev) => Math.max(prev - 0.5, 0));
      setProgress(Math.min(t * 100, 100));

      if (t >= 1) {
        clearInterval(interval);
        onArrived?.();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [route, onArrived]);

  // Map center between pro and client
  const center = useMemo(
    () => ({
      lat: (proPos.lat + route.clientLocation.lat) / 2,
      lng: (proPos.lng + route.clientLocation.lng) / 2,
    }),
    [proPos, route.clientLocation],
  );

  const handleCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  // Stars array for rating display
  const stars = useMemo(() => {
    const full = Math.floor(pro.rating);
    return Array.from({ length: 5 }, (_, i) => i < full);
  }, [pro.rating]);

  if (!isReady) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-[#00a9e0]" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full">
      {/* Google Map */}
      <Map
        defaultCenter={center}
        defaultZoom={14}
        gestureHandling="greedy"
        disableDefaultUI
        mapId={mapId ?? undefined}
        className="h-full w-full"
      >
        {/* Pro marker with pulsing ring */}
        <AdvancedMarker position={proPos}>
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-2 animate-ping rounded-full bg-[#00a9e0]/30" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#00a9e0] text-xs font-bold text-white shadow-lg">
              {pro.initials}
            </div>
          </div>
        </AdvancedMarker>

        {/* Client marker with pulsing ring */}
        <AdvancedMarker position={route.clientLocation}>
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-2 animate-ping rounded-full bg-[#ff4500]/30" />
            <div className="relative h-4 w-4 rounded-full bg-[#ff4500] shadow-lg" />
          </div>
        </AdvancedMarker>
      </Map>

      {/* Floating ETA pill */}
      <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2">
        <div className="flex items-baseline gap-1.5 rounded-full bg-white px-5 py-2.5 shadow-lg dark:bg-zinc-800">
          <span className="text-2xl font-bold text-[#00a9e0]">
            {Math.ceil(eta)}
          </span>
          <span className="text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
            MIN AWAY
          </span>
        </div>
      </div>

      {/* Bottom info panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10 rounded-t-2xl bg-white px-5 pb-8 pt-5 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] dark:bg-zinc-900">
        {/* ETA + distance row */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              ETA {Math.ceil(eta)} min
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {route.distanceMiles} mi
            </span>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            EN ROUTE
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-[3px] w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00a9e0] to-emerald-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Pro info row */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white">
            {pro.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {pro.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-0.5">
                {stars.map((filled, i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${filled ? 'text-[#ff4500]' : 'text-zinc-300 dark:text-zinc-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-0.5">{pro.rating}</span>
              </span>
              <span className="text-zinc-300 dark:text-zinc-600">|</span>
              <span>{pro.trade}</span>
              <span className="text-zinc-300 dark:text-zinc-600">|</span>
              <span>{pro.jobsCompleted} jobs</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00a9e0] text-white transition-colors hover:bg-[#0090c0]"
              aria-label={`Call ${pro.name}`}
            >
              <PhoneIcon className="h-4 w-4" />
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              aria-label={`Message ${pro.name}`}
            >
              <ChatBubbleLeftIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cancel link */}
        <button
          onClick={handleCancel}
          className="mx-auto block text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          Cancel Dispatch
        </button>
      </div>
    </div>
  );
}

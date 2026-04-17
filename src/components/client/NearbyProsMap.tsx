'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GoogleMapProvider, MapView, ProMarker } from '@/components/maps';
import { MOCK_PROS, DEFAULT_CENTER } from '@/lib/mock-data/map-data';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function NearbyProsMap() {
  const [currentZoom, setCurrentZoom] = useState(12);
  const [selectedProId, setSelectedProId] = useState<string | null>(null);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Pros Near You
        </h2>
        <Link
          href="/client/find-pros"
          className="text-sm font-medium text-[#00a9e0] hover:text-[#0ea5e9] dark:text-sky-400"
        >
          View all
        </Link>
      </div>
      <GoogleMapProvider>
        <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800">
          <div className="h-[300px] sm:h-[350px]">
            <MapView
              center={DEFAULT_CENTER}
              zoom={11}
              className="h-full w-full"
              onZoomChanged={(z) => setCurrentZoom(z)}
            >
              {MOCK_PROS.map((pro) => (
                <ProMarker
                  key={pro.id}
                  pro={pro}
                  zoom={currentZoom}
                  selected={selectedProId === pro.id}
                  onClick={() => setSelectedProId(pro.id)}
                />
              ))}
            </MapView>
          </div>
          <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-zinc-900">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <MapPinIcon className="h-4 w-4 text-[#00a9e0]" aria-hidden="true" />
              <span>
                <strong className="text-zinc-900 dark:text-zinc-50">
                  {MOCK_PROS.length}
                </strong>{' '}
                verified pros nearby
              </span>
            </div>
            <Link
              href="/client/find-pros"
              className="rounded-full bg-[#00a9e0] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#0ea5e9] active:scale-[0.98]"
            >
              Find Pros
            </Link>
          </div>
        </div>
      </GoogleMapProvider>
    </section>
  );
}

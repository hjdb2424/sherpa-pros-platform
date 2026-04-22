'use client';

import GoogleMapProvider from '@/components/maps/GoogleMapProvider';
import MapView from '@/components/maps/MapView';
import ProMarker from '@/components/maps/ProMarker';
import { MOCK_PROS, DEFAULT_CENTER } from '@/lib/mock-data/map-data';
import { useState } from 'react';

export default function LandingMap() {
  const [zoom, setZoom] = useState(10);

  return (
    <GoogleMapProvider>
      <div className="h-[400px] w-full overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
        <MapView
          center={DEFAULT_CENTER}
          zoom={10}
          onZoomChanged={setZoom}
          className="h-full w-full"
        >
          {MOCK_PROS.map((pro) => (
            <ProMarker key={pro.id} pro={pro} zoom={zoom} />
          ))}
        </MapView>
      </div>
    </GoogleMapProvider>
  );
}

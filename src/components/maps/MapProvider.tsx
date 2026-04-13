'use client';

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

interface MapContextValue {
  mapboxToken: string;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
  lightStyle: string;
  darkStyle: string;
}

const MapContext = createContext<MapContextValue | null>(null);

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return ctx;
}

interface MapProviderProps {
  children: ReactNode;
  /** Override the default Mapbox token from env */
  mapboxToken?: string;
  /** Override default center (Portsmouth NH) */
  defaultCenter?: { lat: number; lng: number };
  /** Override default zoom level */
  defaultZoom?: number;
}

const PORTSMOUTH_NH = { lat: 43.0718, lng: -70.7626 };

export function MapProvider({
  children,
  mapboxToken,
  defaultCenter = PORTSMOUTH_NH,
  defaultZoom = 10,
}: MapProviderProps) {
  const token =
    mapboxToken ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

  const value = useMemo<MapContextValue>(
    () => ({
      mapboxToken: token,
      defaultCenter,
      defaultZoom,
      lightStyle: 'mapbox://styles/mapbox/light-v11',
      darkStyle: 'mapbox://styles/mapbox/dark-v11',
    }),
    [token, defaultCenter, defaultZoom],
  );

  if (!token) {
    return (
      <div
        role="alert"
        className="flex items-center justify-center rounded-lg border border-red-300 bg-red-50 p-6 text-sm text-red-700"
      >
        Mapbox token is missing. Set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> in
        your environment.
      </div>
    );
  }

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

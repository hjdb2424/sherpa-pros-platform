'use client';

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

interface GoogleMapsContextValue {
  apiKey: string | null;
  mapId: string | null;
  isReady: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextValue>({
  apiKey: null,
  mapId: null,
  isReady: false,
});

export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}

interface GoogleMapProviderProps {
  children: ReactNode;
}

export default function GoogleMapProvider({ children }: GoogleMapProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? null;

  const value = useMemo<GoogleMapsContextValue>(
    () => ({
      apiKey,
      mapId,
      isReady: !!apiKey,
    }),
    [apiKey, mapId],
  );

  if (!apiKey) {
    return (
      <GoogleMapsContext.Provider value={value}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <GoogleMapsContext.Provider value={value}>
      <APIProvider apiKey={apiKey}>{children}</APIProvider>
    </GoogleMapsContext.Provider>
  );
}

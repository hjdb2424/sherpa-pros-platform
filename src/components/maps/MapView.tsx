'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Map } from '@vis.gl/react-google-maps';
import { useGoogleMaps } from './GoogleMapProvider';
import MapPlaceholder from './MapPlaceholder';

const DARK_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0c4a6e' }],
  },
];

interface MapViewProps {
  center: { lat: number; lng: number };
  zoom?: number;
  onBoundsChanged?: (bounds: google.maps.LatLngBoundsLiteral) => void;
  onZoomChanged?: (zoom: number) => void;
  onListView?: () => void;
  className?: string;
  children?: ReactNode;
}

export default function MapView({
  center,
  zoom = 12,
  onBoundsChanged,
  onZoomChanged,
  onListView,
  className = '',
  children,
}: MapViewProps) {
  const { isReady, mapId } = useGoogleMaps();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!isReady) {
    return <MapPlaceholder onListView={onListView} className={className} />;
  }

  // Only apply JSON styles when no cloud mapId and dark mode is active
  const styles = !mapId && isDark ? DARK_STYLES : undefined;

  return (
    <div className={className}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId={mapId ?? undefined}
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
        styles={styles}
        colorScheme={isDark ? 'DARK' : undefined}
        onBoundsChanged={
          onBoundsChanged
            ? (ev) => {
                const bounds = ev.map.getBounds();
                if (bounds) {
                  onBoundsChanged(bounds.toJSON());
                }
              }
            : undefined
        }
        onZoomChanged={
          onZoomChanged
            ? (ev) => {
                const z = ev.map.getZoom();
                if (z != null) onZoomChanged(z);
              }
            : undefined
        }
      >
        {children}
      </Map>
    </div>
  );
}

'use client';

import { useCallback, useState } from 'react';
import type { ViewStateChangeEvent } from 'react-map-gl/mapbox';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface UseMapBoundsReturn {
  bounds: MapBounds | null;
  /** Pass this as onMove or onMoveEnd to your Map component */
  handleViewStateChange: (e: ViewStateChangeEvent) => void;
}

export function useMapBounds(): UseMapBoundsReturn {
  const [bounds, setBounds] = useState<MapBounds | null>(null);

  const handleViewStateChange = useCallback((e: ViewStateChangeEvent) => {
    const map = e.target;
    const b = map.getBounds();
    if (b) {
      setBounds({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    }
  }, []);

  return { bounds, handleViewStateChange };
}

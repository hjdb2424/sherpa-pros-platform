'use client';

import { useMemo } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl/mapbox';
import { MapMarker } from './MapMarker';
import { useMapContext } from './MapProvider';
import circle from '@turf/circle';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface HubMapItem {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  radius_km: number;
}

interface HubMapProps {
  hubs: HubMapItem[];
  /** Map height — accepts any CSS value. Default 500px */
  height?: string;
  /** Use dark map style */
  darkMode?: boolean;
}

/** Deterministic color per hub index */
const HUB_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#00a9e0', // sky blue
  '#ef4444', // red
  '#ec4899', // pink
  '#6366f1', // indigo
];

export function HubMap({
  hubs,
  height = '500px',
  darkMode = false,
}: HubMapProps) {
  const { mapboxToken, defaultCenter, defaultZoom, lightStyle, darkStyle } =
    useMapContext();

  const hubGeojson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: hubs.map((hub, idx) => {
        const feat = circle(
          [hub.center_lng, hub.center_lat],
          hub.radius_km,
          { steps: 64, units: 'kilometers' },
        );
        return {
          ...feat,
          properties: {
            ...feat.properties,
            id: hub.id,
            name: hub.name,
            color: HUB_COLORS[idx % HUB_COLORS.length],
          },
        };
      }),
    }),
    [hubs],
  );

  return (
    <div className="w-full overflow-hidden rounded-lg" style={{ height }}>
      <MapGL
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          latitude: defaultCenter.lat,
          longitude: defaultCenter.lng,
          zoom: defaultZoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={darkMode ? darkStyle : lightStyle}
      >
        {/* Hub boundary polygons */}
        <Source id="hubs" type="geojson" data={hubGeojson}>
          <Layer
            id="hubs-fill"
            type="fill"
            paint={{
              'fill-color': ['get', 'color'],
              'fill-opacity': 0.15,
            }}
          />
          <Layer
            id="hubs-border"
            type="line"
            paint={{
              'line-color': ['get', 'color'],
              'line-width': 2,
            }}
          />
        </Source>

        {/* Hub center markers with labels */}
        {hubs.map((hub, idx) => (
          <MapMarker
            key={hub.id}
            lat={hub.center_lat}
            lng={hub.center_lng}
            color={HUB_COLORS[idx % HUB_COLORS.length]}
            label={hub.name}
          >
            <div className="flex flex-col items-center">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold text-white shadow"
                style={{
                  backgroundColor: HUB_COLORS[idx % HUB_COLORS.length],
                }}
              >
                {hub.name}
              </span>
              <div
                className="mt-0.5 h-3 w-3 rotate-45 rounded-sm"
                style={{
                  backgroundColor: HUB_COLORS[idx % HUB_COLORS.length],
                }}
                aria-hidden="true"
              />
            </div>
          </MapMarker>
        ))}
      </MapGL>
    </div>
  );
}

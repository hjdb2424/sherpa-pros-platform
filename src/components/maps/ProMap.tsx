'use client';

import { useCallback, useMemo, useState } from 'react';
import MapGL, { Popup, Source, Layer } from 'react-map-gl/mapbox';
import { MapMarker } from './MapMarker';
import { useMapContext } from './MapProvider';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface ProMapItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  badge: 'gold' | 'silver' | 'bronze';
  rating: number;
  trades: string[];
  available: boolean;
}

interface ProMapProps {
  pros: ProMapItem[];
  /** Map height — accepts any CSS value. Default 500px */
  height?: string;
  /** Use dark map style */
  darkMode?: boolean;
  /** Show service radius (km) around selected pro */
  serviceRadiusKm?: number;
  onProClick?: (pro: ProMapItem) => void;
}

const BADGE_COLORS: Record<ProMapItem['badge'], string> = {
  gold: '#eab308',
  silver: '#9ca3af',
  bronze: '#b45309',
};

const BADGE_LABELS: Record<ProMapItem['badge'], string> = {
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

function buildRadiusCircle(
  lng: number,
  lat: number,
  radiusKm: number,
  steps = 64,
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dx = (radiusKm / 111.32) * Math.cos(angle);
    const dy =
      (radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);
    coords.push([lng + dy, lat + dx]);
  }
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [coords],
    },
  };
}

export function ProMap({
  pros,
  height = '500px',
  darkMode = false,
  serviceRadiusKm = 30,
  onProClick,
}: ProMapProps) {
  const { mapboxToken, defaultCenter, defaultZoom, lightStyle, darkStyle } =
    useMapContext();

  const [selectedPro, setSelectedPro] = useState<ProMapItem | null>(null);

  const handleMarkerClick = useCallback(
    (pro: ProMapItem) => {
      setSelectedPro(pro);
      onProClick?.(pro);
    },
    [onProClick],
  );

  const radiusGeoJson = useMemo(() => {
    if (!selectedPro) return null;
    return {
      type: 'FeatureCollection' as const,
      features: [
        buildRadiusCircle(selectedPro.lng, selectedPro.lat, serviceRadiusKm),
      ],
    };
  }, [selectedPro, serviceRadiusKm]);

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
        onClick={() => setSelectedPro(null)}
      >
        {/* Service radius overlay */}
        {radiusGeoJson && (
          <Source id="service-radius" type="geojson" data={radiusGeoJson}>
            <Layer
              id="service-radius-fill"
              type="fill"
              paint={{
                'fill-color': BADGE_COLORS[selectedPro!.badge],
                'fill-opacity': 0.1,
              }}
            />
            <Layer
              id="service-radius-border"
              type="line"
              paint={{
                'line-color': BADGE_COLORS[selectedPro!.badge],
                'line-width': 2,
                'line-dasharray': [3, 2],
              }}
            />
          </Source>
        )}

        {/* Pro markers */}
        {pros.map((pro) => (
          <MapMarker
            key={pro.id}
            lat={pro.lat}
            lng={pro.lng}
            color={BADGE_COLORS[pro.badge]}
            label={`${pro.name} — ${BADGE_LABELS[pro.badge]} tier`}
            onClick={() => handleMarkerClick(pro)}
          />
        ))}

        {/* Selected pro popup */}
        {selectedPro && (
          <Popup
            latitude={selectedPro.lat}
            longitude={selectedPro.lng}
            anchor="bottom"
            offset={36}
            closeOnClick={false}
            onClose={() => setSelectedPro(null)}
            className="[&_.mapboxgl-popup-content]:rounded-lg [&_.mapboxgl-popup-content]:p-0 [&_.mapboxgl-popup-content]:shadow-lg"
          >
            <div className="min-w-[220px] p-3">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  {selectedPro.name}
                </h3>
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{
                    backgroundColor: BADGE_COLORS[selectedPro.badge],
                  }}
                >
                  {BADGE_LABELS[selectedPro.badge]}
                </span>
              </div>

              <div className="mb-2 flex items-center gap-1">
                <span className="text-[#ff4500]" aria-hidden="true">
                  ★
                </span>
                <span className="text-xs font-medium text-slate-700">
                  {selectedPro.rating.toFixed(1)}
                </span>
                <span
                  className={`ml-2 inline-block h-2 w-2 rounded-full ${
                    selectedPro.available ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                  aria-label={
                    selectedPro.available ? 'Available' : 'Unavailable'
                  }
                />
                <span className="text-xs text-slate-500">
                  {selectedPro.available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedPro.trades.map((trade) => (
                  <span
                    key={trade}
                    className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600"
                  >
                    {trade}
                  </span>
                ))}
              </div>
            </div>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}

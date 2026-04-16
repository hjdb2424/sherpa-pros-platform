'use client';

import { useCallback, useMemo, useState } from 'react';
import MapGL, { Popup, Source, Layer, type ViewStateChangeEvent } from 'react-map-gl/mapbox';
import { useMapContext } from './MapProvider';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface JobMapItem {
  id: string;
  title: string;
  lat: number;
  lng: number;
  urgency: 'emergency' | 'standard' | 'flexible';
  budget_min: number;
  budget_max: number;
  category: string;
}

interface JobMapProps {
  jobs: JobMapItem[];
  /** Map height — accepts any CSS value. Default 500px */
  height?: string;
  /** Use dark map style */
  darkMode?: boolean;
  onJobClick?: (job: JobMapItem) => void;
}

const URGENCY_COLORS: Record<JobMapItem['urgency'], string> = {
  emergency: '#ef4444',
  standard: '#00a9e0',
  flexible: '#22c55e',
};

const URGENCY_LABELS: Record<JobMapItem['urgency'], string> = {
  emergency: 'Emergency',
  standard: 'Standard',
  flexible: 'Flexible',
};

function formatBudget(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

export function JobMap({
  jobs,
  height = '500px',
  darkMode = false,
  onJobClick,
}: JobMapProps) {
  const { mapboxToken, defaultCenter, defaultZoom, lightStyle, darkStyle } =
    useMapContext();

  const [selectedJob, setSelectedJob] = useState<JobMapItem | null>(null);

  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: jobs.map((job) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [job.lng, job.lat],
        },
        properties: {
          id: job.id,
          title: job.title,
          urgency: job.urgency,
          budget_min: job.budget_min,
          budget_max: job.budget_max,
          category: job.category,
          color: URGENCY_COLORS[job.urgency],
        },
      })),
    }),
    [jobs],
  );

  const handleClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const feature = e.features?.[0];
      if (!feature) {
        setSelectedJob(null);
        return;
      }
      const props = feature.properties;
      const job = jobs.find((j) => j.id === props.id);
      if (job) {
        setSelectedJob(job);
        onJobClick?.(job);
      }
    },
    [jobs, onJobClick],
  );

  const onViewStateChange = useCallback((_e: ViewStateChangeEvent) => {
    // Can hook into useMapBounds here
  }, []);

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
        interactiveLayerIds={['jobs-unclustered', 'jobs-clusters']}
        onClick={handleClick}
        onMove={onViewStateChange}
      >
        <Source
          id="jobs"
          type="geojson"
          data={geojson}
          cluster
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          {/* Cluster circles */}
          <Layer
            id="jobs-clusters"
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': '#1e3a5f',
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                10,
                30,
                50,
                40,
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#00a9e0',
            }}
          />

          {/* Cluster count labels */}
          <Layer
            id="jobs-cluster-count"
            type="symbol"
            filter={['has', 'point_count']}
            layout={{
              'text-field': '{point_count_abbreviated}',
              'text-size': 14,
            }}
            paint={{
              'text-color': '#ffffff',
            }}
          />

          {/* Individual job pins */}
          <Layer
            id="jobs-unclustered"
            type="circle"
            filter={['!', ['has', 'point_count']]}
            paint={{
              'circle-color': ['get', 'color'],
              'circle-radius': 8,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#1e293b',
            }}
          />
        </Source>

        {selectedJob && (
          <Popup
            latitude={selectedJob.lat}
            longitude={selectedJob.lng}
            anchor="bottom"
            offset={12}
            closeOnClick={false}
            onClose={() => setSelectedJob(null)}
            className="[&_.mapboxgl-popup-content]:rounded-lg [&_.mapboxgl-popup-content]:p-0 [&_.mapboxgl-popup-content]:shadow-lg"
          >
            <div className="min-w-[200px] p-3">
              <h3 className="mb-1 text-sm font-semibold text-slate-900">
                {selectedJob.title}
              </h3>
              <p className="mb-2 text-xs text-slate-500">
                {selectedJob.category}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{
                    backgroundColor: URGENCY_COLORS[selectedJob.urgency],
                  }}
                >
                  {URGENCY_LABELS[selectedJob.urgency]}
                </span>
                <span className="text-xs font-medium text-slate-700">
                  {formatBudget(selectedJob.budget_min, selectedJob.budget_max)}
                </span>
              </div>
            </div>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}

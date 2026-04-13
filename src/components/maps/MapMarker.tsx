'use client';

import { Marker } from 'react-map-gl/mapbox';
import { memo, type ReactNode } from 'react';

export interface MapMarkerProps {
  lat: number;
  lng: number;
  color?: string;
  size?: number;
  label?: string;
  onClick?: () => void;
  children?: ReactNode;
}

function MarkerPin({
  color = '#f59e0b',
  size = 32,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
        stroke="#1e293b"
        strokeWidth={1}
      />
      <circle cx="12" cy="9" r="3" fill="white" />
    </svg>
  );
}

export const MapMarker = memo(function MapMarker({
  lat,
  lng,
  color,
  size,
  label,
  onClick,
  children,
}: MapMarkerProps) {
  return (
    <Marker
      latitude={lat}
      longitude={lng}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick?.();
      }}
    >
      <button
        type="button"
        className="cursor-pointer border-none bg-transparent p-0"
        aria-label={label ?? `Map marker at ${lat}, ${lng}`}
        onClick={onClick}
      >
        {children ?? <MarkerPin color={color} size={size} />}
      </button>
    </Marker>
  );
});

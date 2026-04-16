# Google Maps Uber-Like Interface — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Mapbox with Google Maps and build an Uber-like map-first interface across Client Find Pros, Pro Browse Jobs, and Emergency Dispatch.

**Architecture:** Google Maps loaded via `@vis.gl/react-google-maps` with a shared provider. Hybrid layout — full-screen map + draggable bottom sheet on mobile, split panel on desktop. Progressive detail markers (clusters → avatars → mini-cards by zoom). Dark/light theme follows system preference. All views work with mock data when no API key or DB is configured.

**Tech Stack:** `@vis.gl/react-google-maps`, Google Maps JavaScript API, AdvancedMarkerElement, Directions API, CSS custom properties for theming.

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/components/maps/GoogleMapProvider.tsx` | API loader context, theme detection, API key guard |
| `src/components/maps/MapView.tsx` | Core map rendering, zoom tracking, bounds events |
| `src/components/maps/BottomSheet.tsx` | Draggable mobile sheet / desktop side panel |
| `src/components/maps/ProMarker.tsx` | Pro pins with progressive detail (cluster/avatar/card) |
| `src/components/maps/JobMarker.tsx` | Job pins with urgency colors and progressive detail |
| `src/components/maps/DispatchTracker.tsx` | Emergency live tracking with route, ETA, pro movement |
| `src/components/maps/MapPlaceholder.tsx` | Fallback UI when no API key |
| `src/lib/mock-data/map-data.ts` | Mock pros with lat/lng, mock jobs with lat/lng, mock route |

### Modified Files
| File | Change |
|------|--------|
| `package.json` | Add `@vis.gl/react-google-maps`, remove Mapbox packages |
| `src/components/maps/index.ts` | Update exports to new components |
| `src/app/(dashboard)/client/find-pros/find-pros-content.tsx` | Wire in MapView + BottomSheet, add MAP/LIST toggle |
| `src/app/(dashboard)/pro/jobs/JobsPageClient.tsx` | Wire in MapView + BottomSheet for job map |
| `src/app/(dashboard)/client/emergency/` | Wire DispatchTracker into emergency flow |

### Deleted Files
| File | Reason |
|------|--------|
| `src/components/maps/MapProvider.tsx` | Mapbox provider — replaced by GoogleMapProvider |
| `src/components/maps/HubMap.tsx` | Mapbox hub map — no longer needed |
| `src/components/maps/JobMap.tsx` | Mapbox job map — replaced by MapView + JobMarker |
| `src/components/maps/ProMap.tsx` | Mapbox pro map — replaced by MapView + ProMarker |
| `src/components/maps/MapMarker.tsx` | Mapbox marker — replaced by ProMarker/JobMarker |
| `src/components/maps/hooks/useMapBounds.ts` | Mapbox bounds hook — handled by MapView onBoundsChanged |

---

### Task 1: Remove Mapbox and Install Google Maps

**Files:**
- Modify: `package.json`
- Delete: `src/components/maps/MapProvider.tsx`
- Delete: `src/components/maps/HubMap.tsx`
- Delete: `src/components/maps/JobMap.tsx`
- Delete: `src/components/maps/ProMap.tsx`
- Delete: `src/components/maps/MapMarker.tsx`
- Delete: `src/components/maps/hooks/useMapBounds.ts`
- Modify: `src/components/maps/index.ts`

- [ ] **Step 1: Remove Mapbox packages**

```bash
cd ~/sherpa-pros-platform
npm uninstall mapbox-gl react-map-gl @turf/circle @deck.gl/layers @deck.gl/react @types/mapbox-gl
```

- [ ] **Step 2: Install Google Maps React library**

```bash
npm install @vis.gl/react-google-maps
```

- [ ] **Step 3: Delete old Mapbox component files**

```bash
rm src/components/maps/MapProvider.tsx
rm src/components/maps/HubMap.tsx
rm src/components/maps/JobMap.tsx
rm src/components/maps/ProMap.tsx
rm src/components/maps/MapMarker.tsx
rm -rf src/components/maps/hooks
```

- [ ] **Step 4: Update the maps barrel export**

Replace `src/components/maps/index.ts` with:

```typescript
export { AddressAutocomplete } from './AddressAutocomplete';
```

Only keep AddressAutocomplete — we'll add new exports as we build components.

- [ ] **Step 5: Verify build passes**

```bash
npm run build
```

Expected: Build passes. No pages import the deleted Mapbox components (verified — only internal map files referenced them).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove Mapbox dependencies, install @vis.gl/react-google-maps"
```

---

### Task 2: Mock Map Data

**Files:**
- Create: `src/lib/mock-data/map-data.ts`

- [ ] **Step 1: Create mock map data file**

```typescript
// src/lib/mock-data/map-data.ts

export interface MockProLocation {
  id: string;
  name: string;
  initials: string;
  trade: string;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  verified: boolean;
  distance: string;
  responseTime: string;
  jobsCompleted: number;
}

export interface MockJobLocation {
  id: string;
  title: string;
  category: string;
  budget: number;
  urgency: 'emergency' | 'standard' | 'flexible';
  lat: number;
  lng: number;
  distance: string;
  postedAgo: string;
}

export interface MockRoute {
  proStart: { lat: number; lng: number };
  clientLocation: { lat: number; lng: number };
  etaMinutes: number;
  distanceMiles: number;
}

// Portsmouth, NH area — default hub center
export const DEFAULT_CENTER = { lat: 43.0718, lng: -70.7626 };
export const DEFAULT_ZOOM = 12;

export const MOCK_PROS: MockProLocation[] = [
  { id: 'pro-1', name: 'Mike Rodriguez', initials: 'MR', trade: 'Plumber', rating: 4.9, reviewCount: 142, lat: 43.0766, lng: -70.7581, verified: true, distance: '0.3 mi', responseTime: '< 1 hr', jobsCompleted: 47 },
  { id: 'pro-2', name: 'Sarah Chen', initials: 'SC', trade: 'Electrician', rating: 4.8, reviewCount: 98, lat: 43.0654, lng: -70.7712, verified: true, distance: '0.8 mi', responseTime: '< 2 hr', jobsCompleted: 63 },
  { id: 'pro-3', name: 'James Wilson', initials: 'JW', trade: 'HVAC', rating: 4.7, reviewCount: 76, lat: 43.0821, lng: -70.7445, verified: true, distance: '1.2 mi', responseTime: '< 1 hr', jobsCompleted: 35 },
  { id: 'pro-4', name: 'Maria Santos', initials: 'MS', trade: 'General Contractor', rating: 5.0, reviewCount: 201, lat: 43.0588, lng: -70.7834, verified: true, distance: '1.5 mi', responseTime: 'Same day', jobsCompleted: 89 },
  { id: 'pro-5', name: 'Tom Baker', initials: 'TB', trade: 'Roofer', rating: 4.6, reviewCount: 54, lat: 43.0903, lng: -70.7392, verified: true, distance: '2.1 mi', responseTime: '< 4 hr', jobsCompleted: 28 },
  { id: 'pro-6', name: 'Linda Park', initials: 'LP', trade: 'Painter', rating: 4.9, reviewCount: 112, lat: 43.0512, lng: -70.7956, verified: true, distance: '2.8 mi', responseTime: '< 2 hr', jobsCompleted: 71 },
  { id: 'pro-7', name: 'Dave Nelson', initials: 'DN', trade: 'Carpenter', rating: 4.5, reviewCount: 43, lat: 43.0978, lng: -70.7289, verified: true, distance: '3.4 mi', responseTime: 'Next day', jobsCompleted: 19 },
  { id: 'pro-8', name: 'Ana Rivera', initials: 'AR', trade: 'Plumber', rating: 4.8, reviewCount: 87, lat: 43.0445, lng: -70.8067, verified: true, distance: '3.9 mi', responseTime: '< 1 hr', jobsCompleted: 56 },
];

export const MOCK_JOBS: MockJobLocation[] = [
  { id: 'job-1', title: 'Kitchen Faucet Replacement', category: 'Plumbing', budget: 350, urgency: 'standard', lat: 43.0734, lng: -70.7598, distance: '0.4 mi', postedAgo: '2h ago' },
  { id: 'job-2', title: 'Emergency Water Heater Leak', category: 'Plumbing', budget: 800, urgency: 'emergency', lat: 43.0689, lng: -70.7656, distance: '0.6 mi', postedAgo: '15m ago' },
  { id: 'job-3', title: 'Bathroom Remodel', category: 'General', budget: 12000, urgency: 'flexible', lat: 43.0812, lng: -70.7423, distance: '1.1 mi', postedAgo: '1d ago' },
  { id: 'job-4', title: 'Panel Upgrade 100A to 200A', category: 'Electrical', budget: 2500, urgency: 'standard', lat: 43.0567, lng: -70.7801, distance: '1.7 mi', postedAgo: '5h ago' },
  { id: 'job-5', title: 'Furnace Not Heating', category: 'HVAC', budget: 600, urgency: 'emergency', lat: 43.0623, lng: -70.7734, distance: '0.9 mi', postedAgo: '30m ago' },
  { id: 'job-6', title: 'Deck Staining & Repair', category: 'Carpentry', budget: 1800, urgency: 'flexible', lat: 43.0945, lng: -70.7312, distance: '3.2 mi', postedAgo: '3d ago' },
];

export const MOCK_DISPATCH_ROUTE: MockRoute = {
  proStart: { lat: 43.0766, lng: -70.7581 },
  clientLocation: { lat: 43.0689, lng: -70.7656 },
  etaMinutes: 8,
  distanceMiles: 2.3,
};
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/mock-data/map-data.ts
git commit -m "feat: add mock map data for pros, jobs, and dispatch route"
```

---

### Task 3: GoogleMapProvider + MapPlaceholder

**Files:**
- Create: `src/components/maps/GoogleMapProvider.tsx`
- Create: `src/components/maps/MapPlaceholder.tsx`
- Modify: `src/components/maps/index.ts`

- [ ] **Step 1: Create GoogleMapProvider**

```tsx
// src/components/maps/GoogleMapProvider.tsx
'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
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

  const value = useMemo(
    () => ({ apiKey, mapId, isReady: !!apiKey }),
    [apiKey, mapId]
  );

  if (!apiKey) {
    return (
      <GoogleMapsContext.Provider value={value}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMapsContext.Provider value={value}>
        {children}
      </GoogleMapsContext.Provider>
    </APIProvider>
  );
}
```

- [ ] **Step 2: Create MapPlaceholder**

```tsx
// src/components/maps/MapPlaceholder.tsx
import { MapPinIcon } from '@heroicons/react/24/outline';

interface MapPlaceholderProps {
  onListView?: () => void;
  className?: string;
}

export default function MapPlaceholder({ onListView, className = '' }: MapPlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50/30 to-slate-50 ${className}`}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#00a9e0]/10">
        <MapPinIcon className="h-10 w-10 text-[#00a9e0]" aria-hidden="true" />
      </div>
      <p className="mt-4 text-lg font-semibold text-zinc-900">Map View</p>
      <p className="mt-1 max-w-xs text-center text-sm text-zinc-500">
        Add a Google Maps API key to enable the interactive map experience.
      </p>
      {onListView && (
        <button
          onClick={onListView}
          className="mt-6 rounded-full border border-zinc-200 px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.98]"
        >
          View as List
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Update barrel exports**

```typescript
// src/components/maps/index.ts
export { AddressAutocomplete } from './AddressAutocomplete';
export { default as GoogleMapProvider, useGoogleMaps } from './GoogleMapProvider';
export { default as MapPlaceholder } from './MapPlaceholder';
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/maps/GoogleMapProvider.tsx src/components/maps/MapPlaceholder.tsx src/components/maps/index.ts
git commit -m "feat: add GoogleMapProvider with API key guard and MapPlaceholder fallback"
```

---

### Task 4: MapView Core Component

**Files:**
- Create: `src/components/maps/MapView.tsx`
- Modify: `src/components/maps/index.ts`

- [ ] **Step 1: Create the dark mode styles constant**

Create the file with the Google Maps dark mode JSON styles and the core MapView component:

```tsx
// src/components/maps/MapView.tsx
'use client';

import { useCallback, useEffect, useState, ReactNode } from 'react';
import { Map } from '@vis.gl/react-google-maps';
import { useGoogleMaps } from './GoogleMapProvider';
import MapPlaceholder from './MapPlaceholder';

const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c4a6e' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a2e1a' }] },
];

interface MapViewProps {
  center: { lat: number; lng: number };
  zoom?: number;
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void;
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

  const handleBoundsChanged = useCallback(
    (event: { detail: { bounds: google.maps.LatLngBounds } }) => {
      onBoundsChanged?.(event.detail.bounds);
    },
    [onBoundsChanged]
  );

  const handleZoomChanged = useCallback(
    (event: { detail: { zoom: number } }) => {
      onZoomChanged?.(event.detail.zoom);
    },
    [onZoomChanged]
  );

  if (!isReady) {
    return <MapPlaceholder onListView={onListView} className={className} />;
  }

  return (
    <Map
      defaultCenter={center}
      defaultZoom={zoom}
      mapId={mapId ?? undefined}
      styles={!mapId && isDark ? DARK_MAP_STYLES : undefined}
      gestureHandling="greedy"
      disableDefaultUI
      zoomControl
      onBoundsChanged={handleBoundsChanged}
      onZoomChanged={handleZoomChanged}
      className={className}
    >
      {children}
    </Map>
  );
}
```

- [ ] **Step 2: Update barrel exports**

Add to `src/components/maps/index.ts`:

```typescript
export { default as MapView } from './MapView';
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/maps/MapView.tsx src/components/maps/index.ts
git commit -m "feat: add MapView core component with dark mode and graceful fallback"
```

---

### Task 5: BottomSheet Component

**Files:**
- Create: `src/components/maps/BottomSheet.tsx`
- Modify: `src/components/maps/index.ts`

- [ ] **Step 1: Create BottomSheet**

```tsx
// src/components/maps/BottomSheet.tsx
'use client';

import { useRef, useState, useEffect, useCallback, ReactNode } from 'react';

type SnapPoint = 'peek' | 'half' | 'full';

const SNAP_HEIGHTS: Record<SnapPoint, string> = {
  peek: '80px',
  half: '50vh',
  full: '90vh',
};

interface BottomSheetProps {
  children: ReactNode;
  peekContent?: ReactNode;
  initialSnap?: SnapPoint;
  className?: string;
}

export default function BottomSheet({
  children,
  peekContent,
  initialSnap = 'peek',
  className = '',
}: BottomSheetProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [snap, setSnap] = useState<SnapPoint>(initialSnap);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleDragStart = useCallback((clientY: number) => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    dragRef.current = { startY: clientY, startHeight: sheet.offsetHeight };
  }, []);

  const handleDragEnd = useCallback((clientY: number) => {
    if (!dragRef.current) return;
    const delta = dragRef.current.startY - clientY;
    dragRef.current = null;

    if (delta > 60) {
      setSnap((prev) => (prev === 'peek' ? 'half' : 'full'));
    } else if (delta < -60) {
      setSnap((prev) => (prev === 'full' ? 'half' : 'peek'));
    }
  }, []);

  // Desktop: side panel
  if (isDesktop) {
    return (
      <div
        className={`fixed left-0 top-14 bottom-0 z-30 w-[400px] overflow-y-auto border-r border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
      >
        {children}
      </div>
    );
  }

  // Mobile: bottom sheet
  return (
    <div
      ref={sheetRef}
      className={`fixed inset-x-0 bottom-0 z-40 rounded-t-2xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-[height] duration-300 ease-out dark:bg-zinc-900 ${className}`}
      style={{ height: SNAP_HEIGHTS[snap] }}
    >
      {/* Drag handle */}
      <div
        className="flex cursor-grab items-center justify-center py-3 active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientY)}
        onMouseDown={(e) => handleDragStart(e.clientY)}
        onMouseUp={(e) => handleDragEnd(e.clientY)}
      >
        <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>

      {/* Peek summary (visible when collapsed) */}
      {snap === 'peek' && peekContent && (
        <div className="px-4 pb-2">{peekContent}</div>
      )}

      {/* Full content (visible when expanded) */}
      {snap !== 'peek' && (
        <div className="overflow-y-auto px-4 pb-20" style={{ maxHeight: 'calc(100% - 48px)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update barrel exports**

Add to `src/components/maps/index.ts`:

```typescript
export { default as BottomSheet } from './BottomSheet';
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/maps/BottomSheet.tsx src/components/maps/index.ts
git commit -m "feat: add BottomSheet with mobile drag + desktop side panel"
```

---

### Task 6: ProMarker + JobMarker

**Files:**
- Create: `src/components/maps/ProMarker.tsx`
- Create: `src/components/maps/JobMarker.tsx`
- Modify: `src/components/maps/index.ts`

- [ ] **Step 1: Create ProMarker**

```tsx
// src/components/maps/ProMarker.tsx
'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import type { MockProLocation } from '@/lib/mock-data/map-data';

interface ProMarkerProps {
  pro: MockProLocation;
  zoom: number;
  selected?: boolean;
  onClick?: () => void;
}

export default function ProMarker({ pro, zoom, selected, onClick }: ProMarkerProps) {
  // Cluster level
  if (zoom < 10) return null; // handled by parent cluster logic

  // Avatar level
  if (zoom <= 14 && !selected) {
    return (
      <AdvancedMarker position={{ lat: pro.lat, lng: pro.lng }} onClick={onClick}>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white shadow-md transition-transform ${
            selected ? 'scale-110 ring-2 ring-[#00a9e0] ring-offset-2' : ''
          }`}
          style={{ border: '3px solid white' }}
        >
          {pro.initials}
        </div>
      </AdvancedMarker>
    );
  }

  // Detail level (zoomed in or selected)
  return (
    <AdvancedMarker position={{ lat: pro.lat, lng: pro.lng }} onClick={onClick}>
      <div
        className={`w-48 rounded-xl border bg-white p-3 shadow-lg transition-transform dark:border-zinc-700 dark:bg-zinc-800 ${
          selected ? 'scale-105 border-[#00a9e0]' : 'border-zinc-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">
            {pro.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 truncate text-sm font-semibold text-zinc-900 dark:text-white">
              {pro.name}
              {pro.verified && (
                <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="text-[#ff4500]">★ {pro.rating}</span>
              <span>·</span>
              <span>{pro.trade}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{pro.distance}</span>
          <button className="rounded-full bg-[#00a9e0] px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#0ea5e9] active:scale-[0.98]">
            Request
          </button>
        </div>
      </div>
    </AdvancedMarker>
  );
}
```

- [ ] **Step 2: Create JobMarker**

```tsx
// src/components/maps/JobMarker.tsx
'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import type { MockJobLocation } from '@/lib/mock-data/map-data';

const URGENCY_COLORS = {
  emergency: { border: '#ff4500', bg: 'bg-red-50', text: 'text-red-700', label: 'URGENT' },
  standard: { border: '#00a9e0', bg: 'bg-sky-50', text: 'text-sky-700', label: 'Standard' },
  flexible: { border: '#94a3b8', bg: 'bg-zinc-50', text: 'text-zinc-600', label: 'Flexible' },
};

interface JobMarkerProps {
  job: MockJobLocation;
  zoom: number;
  selected?: boolean;
  onClick?: () => void;
}

export default function JobMarker({ job, zoom, selected, onClick }: JobMarkerProps) {
  const urgency = URGENCY_COLORS[job.urgency];

  if (zoom < 10) return null;

  // Pin level
  if (zoom <= 14 && !selected) {
    return (
      <AdvancedMarker position={{ lat: job.lat, lng: job.lng }} onClick={onClick}>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold shadow-md"
          style={{ border: `3px solid ${urgency.border}` }}
        >
          ${job.budget >= 1000 ? `${(job.budget / 1000).toFixed(0)}k` : job.budget}
        </div>
      </AdvancedMarker>
    );
  }

  // Detail level
  return (
    <AdvancedMarker position={{ lat: job.lat, lng: job.lng }} onClick={onClick}>
      <div
        className={`w-52 rounded-xl border bg-white p-3 shadow-lg transition-transform dark:border-zinc-700 dark:bg-zinc-800 ${
          selected ? 'scale-105' : ''
        }`}
        style={{ borderColor: selected ? urgency.border : undefined }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
            {job.title}
          </span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${urgency.bg} ${urgency.text}`}>
            {urgency.label}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{job.category}</span>
          <span>·</span>
          <span>{job.distance}</span>
          <span>·</span>
          <span>{job.postedAgo}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-bold text-zinc-900 dark:text-white">
            ${job.budget.toLocaleString()}
          </span>
          <button className="rounded-full bg-[#00a9e0] px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#0ea5e9] active:scale-[0.98]">
            Bid
          </button>
        </div>
      </div>
    </AdvancedMarker>
  );
}
```

- [ ] **Step 3: Update barrel exports**

Add to `src/components/maps/index.ts`:

```typescript
export { default as ProMarker } from './ProMarker';
export { default as JobMarker } from './JobMarker';
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/maps/ProMarker.tsx src/components/maps/JobMarker.tsx src/components/maps/index.ts
git commit -m "feat: add ProMarker and JobMarker with progressive detail levels"
```

---

### Task 7: Wire Client Find Pros Map

**Files:**
- Modify: `src/app/(dashboard)/client/find-pros/find-pros-content.tsx`

- [ ] **Step 1: Read the current find-pros-content.tsx**

Read the file to understand the current list-only implementation and its state/filter logic.

- [ ] **Step 2: Add map view with toggle**

Modify `find-pros-content.tsx` to add:

1. A `'map' | 'list'` view state toggle (segmented control in the header)
2. Wrap the page in `<GoogleMapProvider>`
3. When view is `'map'`:
   - Mobile: `<MapView>` full-screen with `<BottomSheet>` containing the pro list
   - Desktop: `<BottomSheet>` as side panel (left) + `<MapView>` (right)
4. `<ProMarker>` for each filtered pro
5. Track zoom via `onZoomChanged` and pass to markers
6. Track selected pro — clicking a marker opens the bottom sheet to that pro's card
7. Keep existing list view as the `'list'` state — unchanged
8. Import mock pros from `map-data.ts` and merge lat/lng into existing pro data (or use mock directly)

Key layout pattern for hybrid:

```tsx
{viewMode === 'map' ? (
  <div className="relative h-[calc(100dvh-56px)] lg:flex">
    {/* Desktop side panel / Mobile bottom sheet */}
    <BottomSheet
      peekContent={<p className="text-sm font-semibold">{filtered.length} Pros Nearby</p>}
    >
      {/* Existing pro list cards */}
    </BottomSheet>

    {/* Map fills remaining space */}
    <div className="h-full w-full lg:ml-[400px]">
      <MapView
        center={DEFAULT_CENTER}
        className="h-full w-full"
        onZoomChanged={setCurrentZoom}
      >
        {filtered.map((pro) => (
          <ProMarker
            key={pro.id}
            pro={pro}
            zoom={currentZoom}
            selected={selectedId === pro.id}
            onClick={() => setSelectedId(pro.id)}
          />
        ))}
      </MapView>
    </div>
  </div>
) : (
  // Existing list view — unchanged
)}
```

- [ ] **Step 3: Add MAP/LIST segmented toggle to the page header**

```tsx
<div className="flex items-center rounded-lg border border-zinc-200 p-0.5">
  <button
    onClick={() => setViewMode('map')}
    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
      viewMode === 'map'
        ? 'bg-[#00a9e0] text-white'
        : 'text-zinc-500 hover:text-zinc-700'
    }`}
  >
    Map
  </button>
  <button
    onClick={() => setViewMode('list')}
    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
      viewMode === 'list'
        ? 'bg-[#00a9e0] text-white'
        : 'text-zinc-500 hover:text-zinc-700'
    }`}
  >
    List
  </button>
</div>
```

- [ ] **Step 4: Verify build and test in browser**

```bash
npm run build
```

Then open `http://localhost:3001/client/find-pros` and verify:
- Toggle switches between map and list views
- Map shows placeholder if no API key, or renders Google Map if key is set
- Pro markers appear on map at correct positions
- Bottom sheet drags on mobile, side panel on desktop

- [ ] **Step 5: Commit**

```bash
git add src/app/(dashboard)/client/find-pros/find-pros-content.tsx
git commit -m "feat: wire Google Maps into Client Find Pros with map/list toggle"
```

---

### Task 8: Wire Pro Browse Jobs Map

**Files:**
- Modify: `src/app/(dashboard)/pro/jobs/JobsPageClient.tsx`

- [ ] **Step 1: Read the current JobsPageClient.tsx**

Read the file to understand the current list implementation.

- [ ] **Step 2: Add map view with toggle**

Same hybrid pattern as Task 7 but using `JobMarker` and `MOCK_JOBS`:

1. Add `viewMode` state and segmented toggle
2. Wrap in `GoogleMapProvider`
3. Map view: `MapView` with `JobMarker` for each job
4. Emergency jobs get `urgency: 'emergency'` which shows red border on pin
5. Bottom sheet shows job cards with category, budget, urgency badge
6. Tap a job marker → highlight in bottom sheet
7. Existing list view stays as `'list'` mode

- [ ] **Step 3: Verify build and test**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/(dashboard)/pro/jobs/JobsPageClient.tsx
git commit -m "feat: wire Google Maps into Pro Browse Jobs with job markers"
```

---

### Task 9: DispatchTracker + Emergency Flow

**Files:**
- Create: `src/components/maps/DispatchTracker.tsx`
- Modify: `src/components/maps/index.ts`
- Modify: `src/components/emergency/EnRouteTracker.tsx`

- [ ] **Step 1: Create DispatchTracker**

```tsx
// src/components/maps/DispatchTracker.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useGoogleMaps } from './GoogleMapProvider';
import { PhoneIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import type { MockProLocation, MockRoute } from '@/lib/mock-data/map-data';

interface DispatchTrackerProps {
  pro: MockProLocation;
  route: MockRoute;
  onCancel?: () => void;
  onArrived?: () => void;
}

export default function DispatchTracker({
  pro,
  route,
  onCancel,
  onArrived,
}: DispatchTrackerProps) {
  const { isReady } = useGoogleMaps();
  const [eta, setEta] = useState(route.etaMinutes);
  const [proPos, setProPos] = useState(route.proStart);
  const [progress, setProgress] = useState(0);

  // Simulate pro movement
  useEffect(() => {
    if (eta <= 0) {
      onArrived?.();
      return;
    }
    const interval = setInterval(() => {
      setEta((prev) => {
        const next = prev - 0.5;
        if (next <= 0) {
          clearInterval(interval);
          return 0;
        }
        return next;
      });
      setProgress((prev) => Math.min(prev + 100 / (route.etaMinutes * 2), 100));
      setProPos((prev) => ({
        lat: prev.lat + (route.clientLocation.lat - route.proStart.lat) / (route.etaMinutes * 2),
        lng: prev.lng + (route.clientLocation.lng - route.proStart.lng) / (route.etaMinutes * 2),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [eta, route, onArrived]);

  const center = {
    lat: (route.proStart.lat + route.clientLocation.lat) / 2,
    lng: (route.proStart.lng + route.clientLocation.lng) / 2,
  };

  return (
    <div className="relative h-[100dvh] w-full">
      {/* Map */}
      {isReady ? (
        <Map
          defaultCenter={center}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI
          className="h-full w-full"
        >
          {/* Pro marker */}
          <AdvancedMarker position={proPos}>
            <div className="relative">
              <div className="absolute -inset-2 animate-ping rounded-full bg-[#00a9e0]/30" />
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white shadow-lg" style={{ border: '3px solid white' }}>
                {pro.initials}
              </div>
            </div>
          </AdvancedMarker>

          {/* Client location */}
          <AdvancedMarker position={route.clientLocation}>
            <div className="relative">
              <div className="absolute -inset-1.5 animate-ping rounded-full bg-[#ff4500]/20" />
              <div className="h-4 w-4 rounded-full bg-[#ff4500] shadow-lg" style={{ border: '3px solid white' }} />
            </div>
          </AdvancedMarker>
        </Map>
      ) : (
        <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
          <p className="text-zinc-500">Map requires API key</p>
        </div>
      )}

      {/* Floating ETA pill */}
      <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white px-5 py-2 shadow-lg dark:bg-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#00a9e0]">{Math.ceil(eta)}</span>
          <span className="text-xs leading-tight text-zinc-500 dark:text-zinc-400">
            MIN
            <br />
            AWAY
          </span>
        </div>
      </div>

      {/* Bottom info panel */}
      <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-2xl bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:bg-zinc-900">
        {/* ETA + Status */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">{Math.ceil(eta)} min</span>
            <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">· {route.distanceMiles} mi away</span>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            EN ROUTE
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00a9e0] to-emerald-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Pro info */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white">
            {pro.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">
              {pro.name} · <span className="text-[#ff4500]">★ {pro.rating}</span>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {pro.trade} · {pro.jobsCompleted} jobs completed
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00a9e0] text-white shadow-sm transition-all hover:bg-[#0ea5e9] active:scale-95">
              <PhoneIcon className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-700 dark:text-zinc-400">
              <ChatBubbleLeftIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cancel */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 w-full text-center text-sm text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Cancel Dispatch
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update barrel exports**

Add to `src/components/maps/index.ts`:

```typescript
export { default as DispatchTracker } from './DispatchTracker';
```

- [ ] **Step 3: Wire into EnRouteTracker**

Read `src/components/emergency/EnRouteTracker.tsx`. Replace the mock progress bar / animated UI with `DispatchTracker`. Wrap in `GoogleMapProvider`. Pass the matched pro and mock route data. Keep the cancel confirmation dialog.

- [ ] **Step 4: Verify build and test**

```bash
npm run build
```

Then test the emergency flow at `http://localhost:3001/client/emergency`.

- [ ] **Step 5: Commit**

```bash
git add src/components/maps/DispatchTracker.tsx src/components/maps/index.ts src/components/emergency/EnRouteTracker.tsx
git commit -m "feat: add DispatchTracker with live ETA, route simulation, and pro tracking"
```

---

### Task 10: Final Cleanup + Build Verification

**Files:**
- Modify: `CLAUDE.md`
- Modify: `.env.local.example`

- [ ] **Step 1: Update .env.local.example**

Add the Google Maps env vars:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=optional_cloud_map_id
```

- [ ] **Step 2: Update CLAUDE.md**

Add to the Tech Stack section:
```
- **Maps:** Google Maps JavaScript API (@vis.gl/react-google-maps) — Uber-like map interface
```

Update the Integration Notes section to remove Mapbox references and add:
```
- Google Maps gracefully degrades — shows branded placeholder when API key is missing
- Maps use system theme preference (light/dark) automatically
```

- [ ] **Step 3: Full build verification**

```bash
npm run build
```

Expected: Clean build, all routes compile, zero errors.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md .env.local.example
git commit -m "docs: update CLAUDE.md and env example for Google Maps integration"
```

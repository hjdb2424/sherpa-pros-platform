# Google Maps Uber-Like Interface — Design Spec

## Overview

Replace all Mapbox dependencies with Google Maps to create an Uber-like map-first interface across three flows: Client Find Pros, Pro Browse Jobs, and Emergency Dispatch. The map is the primary interface — not a widget on a page.

## Decisions

| Decision | Choice |
|----------|--------|
| Scope | All three flows — client, pro, emergency |
| Map library | Google Maps only — remove Mapbox entirely |
| Layout | Hybrid — full-screen + bottom sheet on mobile, split panel on desktop |
| Markers | Progressive Detail — clusters → avatars → mini-cards by zoom level |
| Emergency UX | Rich bottom sheet — ETA, progress bar, pro details, call/message |
| Theme | System preference — respects `prefers-color-scheme`, no forced override |

## Dependencies

### Add
- `@vis.gl/react-google-maps` — React wrapper for Google Maps JavaScript API (Advanced Markers, Map ID support, theme-aware)

### Remove
- `mapbox-gl`
- `react-map-gl`
- `@turf/circle`
- `@deck.gl/layers`
- `@deck.gl/react`
- `@types/mapbox-gl`

### Keep
- `@googlemaps/js-api-loader` — already installed, used by AddressAutocomplete

## Environment Variables

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...    # Required for map rendering
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=...         # Optional: for cloud-based styling + AdvancedMarkerElement
```

Without `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, map areas show a branded placeholder with address search. All data and list views still work — the map is an enhancement, not a gate.

## Architecture

### New Components

#### 1. `src/components/maps/GoogleMapProvider.tsx`
Context provider that wraps the app (or map-containing routes) with the Google Maps API loader.

- Loads API via `@vis.gl/react-google-maps` `<APIProvider>`
- Passes `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and optional `mapId`
- Provides a `useGoogleMapsReady()` hook for children to check load state
- Handles missing API key gracefully — renders children without map capability

#### 2. `src/components/maps/MapView.tsx`
Core map component used across all three flows.

- Renders `<Map>` from `@vis.gl/react-google-maps`
- Props: `center`, `zoom`, `markers[]`, `onMarkerClick`, `selectedId`, `className`
- Theme-aware: applies dark map style when `prefers-color-scheme: dark`
- Supports clustering via `@googlemaps/markerclusterer` (or manual zoom-based logic)
- Full-screen on mobile (100dvh minus nav), split panel width on desktop
- Emits `onBoundsChanged` for list filtering by visible map area

#### 3. `src/components/maps/BottomSheet.tsx`
Draggable bottom sheet for mobile map overlay. On desktop, renders as a side panel instead.

- Three snap points: peek (80px — shows count/summary), half (50vh), full (90vh)
- Drag handle at top with pill indicator
- Touch-friendly: `touch-action: none` on handle, momentum scrolling in content
- Content slot receives list of pros/jobs/dispatch info
- Desktop: renders as `w-[400px]` fixed left panel with scroll, no drag behavior
- Uses `matchMedia('(min-width: 1024px)')` to switch between sheet and panel

#### 4. `src/components/maps/ProMarker.tsx`
Custom marker for pros on the map. Uses `AdvancedMarkerElement` for rich HTML content.

- **Cluster level (zoom < 10):** Numbered circle — `bg-[#00a9e0]`, white text, count of pros in area
- **Avatar level (zoom 10-14):** Circle with initials — `bg-[#00a9e0]`, white text, 40x40px, white border + shadow
- **Detail level (zoom > 14 or tapped):** Mini-card — white card with avatar, name, rating (orange-red stars), trade, distance, "Request" button in sky blue
- Props: `pro: { id, name, initials, rating, trade, lat, lng, verified }`, `zoom`, `selected`
- Selected state: scale up 1.1x, add blue ring

#### 5. `src/components/maps/JobMarker.tsx`
Custom marker for jobs on the map.

- **Cluster level:** Same as ProMarker clusters
- **Pin level:** Circle with price — white bg, blue border, `$450` text, 40x40px
- **Detail level:** Mini-card — white card with category icon, title, budget, urgency badge, distance, "Bid" button
- Urgency color coding: emergency = `#ff4500` border, standard = `#00a9e0` border, flexible = `#94a3b8` border
- Props: `job: { id, title, category, budget, urgency, lat, lng }`, `zoom`, `selected`

#### 6. `src/components/maps/DispatchTracker.tsx`
Emergency dispatch map with live pro tracking. Always full-screen regardless of device.

- Full-viewport Google Map with dark or light style (system preference)
- Route line: `google.maps.DirectionsRenderer` showing path from pro to client
- Pro marker: animated avatar circle with pulsing shadow ring (sky blue glow)
- Client marker: orange-red pulsing dot (your location)
- Floating ETA pill: centered at top — large number + "MIN AWAY" label
- Rich bottom sheet (always visible, not draggable on this screen):
  - ETA + distance text
  - Progress bar (gradient from `#00a9e0` to `#10b981`)
  - Pro avatar + name + rating + certifications
  - Call button (sky blue circle) + Message button (gray circle)
  - "Cancel Dispatch" text link at bottom
- Simulated movement: in mock mode, pro marker moves along route every 3 seconds
- Props: `proLocation: {lat, lng}`, `clientLocation: {lat, lng}`, `pro: ProInfo`, `eta: number`

#### 7. `src/components/maps/MapPlaceholder.tsx`
Fallback when no Google Maps API key is configured.

- Branded container matching the map area dimensions
- Sky blue gradient background with map pin icon
- "Add Google Maps API key to enable map view" message
- Address search input still functional (uses existing AddressAutocomplete)
- "View as List" button to switch to list-only mode

### Keep Existing
- `src/components/maps/AddressAutocomplete.tsx` — already uses `@googlemaps/js-api-loader`, no changes needed

### Remove
- `src/components/maps/MapProvider.tsx` — Mapbox provider, replaced by GoogleMapProvider
- `src/components/maps/HubMap.tsx` — Mapbox hub visualization
- `src/components/maps/JobMap.tsx` — Mapbox job map
- `src/components/maps/ProMap.tsx` — Mapbox pro map
- `src/components/maps/MapMarker.tsx` — Mapbox custom marker

## Page Integration

### 1. Client: Find Pros (`/client/find-pros`)

**Current:** List-only view with search and filters.
**New:** Map is the primary interface.

- **Mobile:** Full-screen map with bottom sheet. Sheet shows pro list (peek = "5 Pros Nearby", half = scrollable cards, full = detailed list with filters).
- **Desktop:** Split panel — pro list left (400px), map right (fills remaining).
- **Map behavior:**
  - Centers on user's location (via browser geolocation API)
  - Falls back to hub center (Portsmouth, NH) if location denied
  - Shows ProMarkers for all pros in visible bounds
  - `onBoundsChanged` filters the list panel to show only visible pros
  - Tap a pin → bottom sheet slides up with pro detail card
  - Trade filter pills overlay the map top (horizontal scroll)
- **MAP/LIST toggle:** On mobile navbar, segmented control lets user switch between map view and full list view.

### 2. Pro: Browse Jobs (`/pro/jobs`)

**Current:** List view of available jobs with filters.
**New:** Map + list hybrid.

- Same hybrid layout as Find Pros (full-screen + sheet on mobile, split on desktop)
- Shows JobMarkers with urgency color coding
- Bottom sheet shows job cards with category, budget, distance, urgency badge
- Tap a pin → sheet slides to that job's detail card with "Place Bid" button
- Emergency jobs pulse on the map (animated ring around pin)
- Filter by: trade, urgency, distance, budget range

### 3. Emergency: Dispatch (`/client/emergency`)

**Current:** Multi-step flow with mock radar and progress bars.
**New:** Map-first dispatch experience.

The existing category → severity → location flow stays. The map replaces the mock radar and en-route tracker:

- **Step: Matching** — Full-screen map centered on client location. Pulsing orange-red dot. Animated search radius expanding outward (concentric rings). "Finding nearby pros..." text overlay. When a match is found, pro marker appears on map with bounce animation.
- **Step: Dispatched** — DispatchTracker takes over. Route line drawn. ETA countdown. Pro marker moves along route (simulated in mock mode). Rich bottom sheet with pro details and call/message.
- **Step: Arrived** — Pro marker reaches client location. Celebration micro-animation. Sheet updates to "Pro has arrived" with job detail + emergency checklist link.

## Theme Support

### Light Mode (default)
- Standard Google Maps style (or custom Map ID with brand-tinted roads/water)
- White bottom sheet and panels
- Blue pins, dark text, standard shadows

### Dark Mode (`prefers-color-scheme: dark`)
- Google Maps dark style (via `mapId` or custom JSON styles array)
- Dark bottom sheet (`bg-zinc-900`) and panels
- Brighter blue pins (`#0ea5e9`), lighter text, adjusted shadows
- Route line stays sky blue (high contrast on dark map)

### Implementation
- `GoogleMapProvider` reads system preference via `matchMedia('(prefers-color-scheme: dark)')`
- Passes `colorScheme` prop to `MapView`
- `MapView` applies dark styles JSON when dark mode detected
- All overlay components (BottomSheet, markers, ETA pill) use CSS variables from globals.css which already support dark mode

## Mock Data

All three flows work with mock data when no database is connected:

- **Find Pros:** 8 mock pros around Portsmouth, NH with varied trades, ratings, distances
- **Browse Jobs:** 6 mock jobs with varied urgency, categories, budgets
- **Emergency Dispatch:** Pre-set mock route from pro location to client, 8-minute simulated ETA that counts down

Mock data lives in `src/lib/mock-data/` alongside existing mock files.

## Graceful Degradation

| Condition | Behavior |
|-----------|----------|
| No API key | MapPlaceholder shown. List views fully functional. Address search works. |
| API key set, no Map ID | Standard Google Map (no custom styling). AdvancedMarkerElement still works. |
| API key + Map ID | Full custom-styled map with cloud-based themes + dark mode. |
| Geolocation denied | Map centers on default hub (Portsmouth, NH 43.0718, -70.7626). |
| No database | Mock pro/job data populates all views. |

## File Changes Summary

### New Files (7)
- `src/components/maps/GoogleMapProvider.tsx`
- `src/components/maps/MapView.tsx`
- `src/components/maps/BottomSheet.tsx`
- `src/components/maps/ProMarker.tsx`
- `src/components/maps/JobMarker.tsx`
- `src/components/maps/DispatchTracker.tsx`
- `src/components/maps/MapPlaceholder.tsx`

### Modified Files (5)
- `src/app/(dashboard)/client/find-pros/` — wire in MapView + BottomSheet
- `src/app/(dashboard)/pro/jobs/` — wire in MapView + BottomSheet
- `src/app/(dashboard)/client/emergency/` — wire in DispatchTracker
- `src/lib/mock-data/` — add map-specific mock data (pro locations, job locations, routes)
- `package.json` — add `@vis.gl/react-google-maps`, remove Mapbox packages

### Deleted Files (5)
- `src/components/maps/MapProvider.tsx`
- `src/components/maps/HubMap.tsx`
- `src/components/maps/JobMap.tsx`
- `src/components/maps/ProMap.tsx`
- `src/components/maps/MapMarker.tsx`

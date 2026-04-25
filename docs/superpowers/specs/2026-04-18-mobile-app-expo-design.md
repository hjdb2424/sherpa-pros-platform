# Sherpa Pros Mobile App — Design Spec

## Overview

Native iOS + Android app built with Expo (React Native) that delivers an Uber/DoorDash-level map-first experience. One app with role switching (Client or Pro). Lives at `~/sherpa-pros-platform/mobile/` inside the existing monorepo. Consumes the web app's Vercel API routes. Shares TypeScript types from `../src/lib/`.

## Decisions

| Decision | Choice |
|----------|--------|
| Framework | Expo SDK 52 + expo-router |
| Repo structure | Monorepo — `mobile/` directory in existing repo |
| App model | One app, role switch (like Uber driver/rider) |
| MVP scope | Full workflow — 15 screens (map + business flow) |
| Maps | react-native-maps (native MapKit + Google Maps) |
| Bottom sheet | @gorhom/bottom-sheet (Uber-identical gestures) |
| Animations | react-native-reanimated (60fps native thread) |
| API | Existing Vercel routes via fetch |

## Tech Stack

### Core
- **Expo SDK 52** — managed workflow, EAS Build for App Store
- **expo-router v4** — file-based routing (same mental model as Next.js App Router)
- **TypeScript** — strict mode, shared types from `../src/lib/`
- **React Native 0.76+**

### Native Libraries
| Library | Purpose | Why |
|---------|---------|-----|
| `react-native-maps` | Google Maps rendering | Native MapKit/Google Maps, 60fps, custom markers |
| `@gorhom/bottom-sheet` | Draggable bottom sheets | Identical to Uber's gesture behavior |
| `react-native-reanimated` | Animations | Runs on native thread, 60fps guaranteed |
| `react-native-gesture-handler` | Touch handling | Native gesture recognition, not JS bridge |
| `expo-location` | GPS + background tracking | Foreground + background position updates |
| `expo-camera` | Photo capture | Checklist photo uploads |
| `expo-notifications` | Push notifications | Job alerts, dispatch, bid updates |
| `expo-secure-store` | Auth token storage | Encrypted keychain/keystore |
| `expo-image-picker` | Photo library access | Upload existing photos |
| `expo-haptics` | Haptic feedback | Button press, dispatch confirmed |

### API Communication
- **Base URL:** `https://www.thesherpapros.com/api` (production)
- **Dev URL:** `http://localhost:3001/api` (local development)
- **Auth:** Bearer token in headers (from Clerk or test portal localStorage equivalent)
- **Pattern:** Custom `useApi()` hook wrapping `fetch` with auth headers, error handling, loading state

## Directory Structure

```
mobile/
  app/
    _layout.tsx              — Root layout, auth check, role routing
    (auth)/
      sign-in.tsx            — Test portal / Clerk sign-in
      select-role.tsx        — Pro or Client role selection
    (client)/
      _layout.tsx            — Tab navigator (Map, Jobs, Messages, Profile)
      index.tsx              — Map: find pros (full-screen + bottom sheet)
      post-job/
        index.tsx            — Job wizard (multi-step)
      my-jobs/
        index.tsx            — Job list
        [id].tsx             — Job detail + materials flow
      messages.tsx           — Conversation list + chat
    (pro)/
      _layout.tsx            — Tab navigator (Map, Jobs, Earnings, Profile)
      index.tsx              — Map: browse jobs (full-screen + bottom sheet)
      jobs/
        index.tsx            — Job list with tabs
        [id].tsx             — Job detail + checklist tabs
      earnings.tsx           — Chart + payouts + Stripe Capital
      messages.tsx           — Conversation list + chat
    (emergency)/
      index.tsx              — Category → Severity → Dispatch
      tracking.tsx           — Full-screen live tracking
    profile.tsx              — User profile + settings
    notifications.tsx        — Push notification list
  components/
    maps/
      MapScreen.tsx          — Full-screen map wrapper
      ProMarker.tsx          — Custom pro marker (progressive detail)
      JobMarker.tsx          — Custom job marker (urgency colors)
      DispatchMap.tsx         — Emergency tracking map
    sheets/
      ProSheet.tsx           — Bottom sheet pro card list
      JobSheet.tsx           — Bottom sheet job card list
      ProDetailSheet.tsx     — Single pro detail in sheet
      JobDetailSheet.tsx     — Single job detail in sheet
    checklist/
      ScopeView.tsx          — Scope document native view
      ProcessTimeline.tsx    — Work process vertical timeline
      ChecklistView.tsx      — Interactive checklist with camera
      MaterialsView.tsx      — Materials list with review badges
      MaterialsApproval.tsx  — Fee breakdown + approve
      PaymentSheet.tsx       — Card hold vs Wisetack
      DeliveryPicker.tsx     — Delivery tier selection
      DeliveryTracker.tsx    — Gig delivery live tracking
    chat/
      ConversationList.tsx   — Message threads
      ChatScreen.tsx         — Individual chat
    common/
      Button.tsx             — Brand pill button
      Card.tsx               — Rounded card with border
      Badge.tsx              — Status badge
      EmptyState.tsx         — Empty state with icon + CTA
      LoadingScreen.tsx      — Skeleton shimmer
      Avatar.tsx             — User avatar circle
  lib/
    api.ts                   — useApi hook, fetch wrapper, auth headers
    auth.ts                  — Auth context, token storage, role management
    theme.ts                 — Brand colors, spacing, typography, shadows
    types.ts                 — Re-export shared types from ../src/lib/
  assets/
    icon.png                 — App icon (1024x1024)
    splash.png               — Splash screen
    adaptive-icon.png        — Android adaptive icon
  app.json                   — Expo config (name, slug, scheme, plugins)
  eas.json                   — EAS Build config (dev, preview, production)
  package.json
  tsconfig.json
```

## Screen Specifications

### 1. Sign In (`app/(auth)/sign-in.tsx`)
- Same logic as web: check for Clerk → if not configured, show test portal
- Test portal: logo (SHERPA + PROS in brand colors), role dropdown, test user cards
- On sign in: store token in `expo-secure-store`, redirect to role-appropriate tab navigator
- `expo-haptics` medium impact on successful sign-in

### 2. Role Select (`app/(auth)/select-role.tsx`)
- Two large cards: "I'm a Pro" (wrench icon) / "I need a Pro" (home icon)
- Sky blue hover/press states, orange-red "Get started" reveal on press
- Store role in secure store, navigate to `/(client)` or `/(pro)`

### 3. Client Map Home (`app/(client)/index.tsx`)
- **Full-screen `<MapView>`** from `react-native-maps`
  - Provider: `PROVIDER_GOOGLE` on Android, default (Apple Maps) on iOS — or force Google on both
  - Custom style JSON for brand-tinted map (subtle blue water, muted labels)
  - `showsUserLocation={true}` with custom blue dot
- **ProMarkers** — custom `<Marker>` components
  - Zoom < 10: cluster count circles
  - Zoom 10-14: avatar circles with initials
  - Zoom > 14 or selected: `<Callout>` with mini-card (name, rating, trade, Request button)
- **Bottom sheet** via `@gorhom/bottom-sheet`
  - Snap points: [80, '50%', '90%']
  - Peek shows: "{N} Pros Nearby" + horizontal trade filter chips
  - Half/full shows: scrollable FlatList of ProCard components
  - Tap a marker → sheet scrolls to that pro's card (animated)
- **Search bar** — absolute positioned at top, address autocomplete via Google Places
- **Trade filter chips** — horizontal ScrollView: All, Plumber, Electrician, HVAC, etc.
- **Map/List toggle** — segmented control in header

### 4. Post Job Wizard (`app/(client)/post-job/index.tsx`)
- Multi-step form with step indicator at top
- Step 1: CategoryGrid (2-column grid of trade icons)
- Step 2: Title + description (TextInput)
- Step 3: Budget range slider
- Step 4: Photos (expo-camera launch + expo-image-picker)
- Step 5: Location (map with draggable pin)
- Step 6: Review summary → Submit
- On submit: POST `/api/jobs`, haptic success, navigate to my-jobs
- Back button on each step, progress saves in local state

### 5. Client My Jobs (`app/(client)/my-jobs/index.tsx`)
- FlatList with job cards showing: title, status badge, budget, assigned pro avatar
- Pull-to-refresh
- Tap → navigate to `my-jobs/[id]`
- Empty state: "No projects yet" with "Post a Job" CTA

### 6. Client Job Detail (`app/(client)/my-jobs/[id].tsx`)
- ScrollView with:
  - Job header card (title, status, budget, assigned pro)
  - Materials flow state machine (same 6 steps as web):
    - review → payment → delivery → ordered → tracking → complete
  - Materials list (read-only)
  - MaterialsApproval with fee breakdown
  - PaymentSheet (card hold vs Wisetack)
  - DeliveryPicker (4 tiers)
  - DeliveryTracker (embedded map for gig delivery)
- Step progress bar at top of materials section

### 7. Pro Map Home (`app/(pro)/index.tsx`)
- Same architecture as Client Map but with JobMarkers
- Urgency color coding: emergency = red border, standard = blue, flexible = gray
- Emergency jobs pulse with animated ring (Reanimated)
- Bottom sheet with job cards: title, category, budget, urgency badge, distance
- Tap marker → sheet snaps to job card → "Place Bid" button
- Trade + urgency filter chips

### 8. Pro Job List (`app/(pro)/jobs/index.tsx`)
- Segmented tabs: Available | My Bids | Active | Completed
- FlatList per tab with appropriate cards
- Available: job card + quick bid button
- My Bids: job card + bid status (pending/accepted/rejected)
- Active: job card + milestone progress bar
- Completed: job card + rating + earnings

### 9. Pro Job Detail (`app/(pro)/jobs/[id].tsx`)
- Tab bar: Overview | Scope | Process | Checklist | Materials
- **Overview:** Job info, client info, milestone tracker
- **Scope:** ScopeView with code reference badges
- **Process:** ProcessTimeline with vertical steps + safety callouts
- **Checklist:** Interactive ChecklistView — native checkboxes, camera button per item (launches expo-camera), quality gate indicators
- **Materials:** MaterialsView (editable) + inline note inputs + "Get HD Pricing" button + DeliveryPicker + "Send to Client"

### 10. Pro Earnings (`app/(pro)/earnings.tsx`)
- Bar chart (react-native-chart-kit or victory-native)
- Stats row: This Month, Pending, Completed
- Payout history FlatList
- Stripe Capital offer card at bottom

### 11. Emergency Flow (`app/(emergency)/index.tsx`)
- Dark theme override for this screen
- Large category buttons (4x2 grid): Water, Fire, Storm, HVAC, Electrical, Gas, Structural, Other
- Severity slider (1-5) with color gradient
- Auto-detect location via expo-location
- "Finding nearby pros..." animation (pulsing concentric rings on map)
- Match found → pro card appears with bounce animation + haptic

### 12. Dispatch Tracker (`app/(emergency)/tracking.tsx`)
- Full-screen map, no tab bar (immersive)
- Pro marker with pulsing ring, animated along route polyline
- Client location as orange-red pulsing dot
- Floating ETA pill at top
- Bottom panel (not draggable): ETA, progress bar, pro info, call/message buttons
- Haptic on arrival
- Simulated movement in mock mode (same as web)

### 13-14. Messages (`messages.tsx` in both client and pro)
- Conversation list: FlatList with avatar, name, last message preview, timestamp, unread badge
- Chat screen: KeyboardAvoidingView + FlatList (inverted) + TextInput
- Sent = sky blue bubble (right), received = gray bubble (left)
- Auto-scroll on new message

### 15. Profile + Notifications
- Profile: avatar, name, email, role badge, sign out button
- Notification list: FlatList with type icon, message, timestamp, read/unread state
- Tap notification → deep link to relevant screen

## Native Integrations

### Push Notifications
- Register via `expo-notifications` on first launch
- Store push token to `/api/notifications/register`
- Notification types: new_job, bid_accepted, dispatch_alert, message, payment
- Deep linking: notification tap navigates to relevant screen

### Background Location (Pro)
- `expo-location` background task for active dispatch tracking
- Updates pro position every 5 seconds during active dispatch
- POST to `/api/dispatch/location` with lat/lng
- Stops when dispatch completes
- Requires iOS background modes + Android foreground service

### Camera
- `expo-camera` for live capture in checklist flow
- `expo-image-picker` for gallery selection
- Compress to 1024px max dimension before upload
- Upload to `/api/uploads` (or direct to cloud storage)

### Haptics
- `expo-haptics` for:
  - Button press: `impactAsync(ImpactFeedbackStyle.Light)`
  - Bid submitted: `notificationAsync(NotificationFeedbackType.Success)`
  - Dispatch confirmed: `impactAsync(ImpactFeedbackStyle.Heavy)`
  - Emergency category selected: `impactAsync(ImpactFeedbackStyle.Medium)`

## Brand Theme

```typescript
// mobile/lib/theme.ts
export const colors = {
  primary: '#00a9e0',
  primaryLight: '#e0f7ff',
  primaryDark: '#0ea5e9',
  accent: '#ff4500',
  accentLight: '#fff0eb',
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  background: '#ffffff',
  surface: '#ffffff',
  surfaceSecondary: '#f8fafc',
  text: '#18181b',
  textSecondary: '#52525b',
  textMuted: '#71717a',
  textInverse: '#ffffff',
  border: 'rgba(0, 169, 224, 0.2)',
  borderLight: '#f4f4f5',
  borderMedium: '#e4e4e7',
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48,
};

export const borderRadius = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 9999,
};

export const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  primaryGlow: { shadowColor: '#00a9e0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
};

export const typography = {
  heroDisplay: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  heading: { fontSize: 24, fontWeight: '700' as const },
  subheading: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' as const },
  badge: { fontSize: 11, fontWeight: '600' as const, textTransform: 'uppercase' as const },
};
```

## App Store Configuration

### app.json
```json
{
  "expo": {
    "name": "Sherpa Pros",
    "slug": "sherpa-pros",
    "scheme": "sherpapros",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": { "image": "./assets/splash.png", "backgroundColor": "#ffffff" },
    "ios": {
      "bundleIdentifier": "com.sherpapros.app",
      "supportsTablet": true,
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Sherpa Pros needs your location to find nearby pros and jobs.",
        "NSLocationAlwaysUsageDescription": "Sherpa Pros tracks your location during active dispatches to show clients your ETA.",
        "NSCameraUsageDescription": "Sherpa Pros needs camera access for checklist photo documentation."
      }
    },
    "android": {
      "package": "com.sherpapros.app",
      "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png", "backgroundColor": "#ffffff" },
      "permissions": ["ACCESS_FINE_LOCATION", "ACCESS_BACKGROUND_LOCATION", "CAMERA"]
    },
    "plugins": [
      "expo-location",
      "expo-camera",
      "expo-notifications",
      "expo-secure-store",
      "expo-haptics",
      "expo-image-picker"
    ]
  }
}
```

### eas.json
```json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": {}
  },
  "submit": {
    "production": {
      "ios": { "appleId": "poum@hjd.builders", "ascAppId": "TBD" },
      "android": { "serviceAccountKeyPath": "TBD" }
    }
  }
}
```

## Implementation Phases

### Phase 1 (Week 1-2): Foundation + Maps
- Expo init, expo-router setup, theme, auth flow
- Sign in + role select screens
- Client map home with ProMarkers + bottom sheet
- Pro map home with JobMarkers + bottom sheet
- Common components (Button, Card, Badge, Avatar, EmptyState)

### Phase 2 (Week 2-3): Business Flow
- Post job wizard (client)
- My jobs list + job detail (client)
- Job list + job detail with checklist tabs (pro)
- Materials list + approval flow
- Earnings page (pro)

### Phase 3 (Week 3-4): Emergency + Communication
- Emergency flow (category → severity → dispatch)
- Dispatch tracker with live map
- Messages (conversation list + chat)
- Push notifications
- Profile + notifications screen

### Phase 4 (Week 4): Polish + Ship
- Camera integration for checklist photos
- Background location for dispatch tracking
- Haptic feedback throughout
- App Store assets (screenshots, description, keywords)
- TestFlight + Play Store internal testing
- Bug fixes from beta testers

## Shared Code Strategy

| From Web App | How Mobile Uses It |
|-------------|-------------------|
| `src/lib/mock-data/*.ts` | Import directly via `../src/lib/mock-data/` |
| `src/lib/pricing/fee-calculator.ts` | Import directly |
| Type definitions (MockProLocation, MaterialItem, etc.) | Import via `../src/lib/` |
| API routes (`/api/*`) | Call via HTTP fetch from mobile |
| Services (SerpApi, Zinc, Stripe, Wisetack) | Stay server-side, consumed via API |
| DESIGN.md brand tokens | Translated to `mobile/lib/theme.ts` |

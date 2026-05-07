# Hiking with Kids — App Specification for Claude Code

## Project overview

A mobile-first web application that helps parents find and explore kid-friendly hiking trails. Built with React/TypeScript, ArcGIS Maps SDK for JavaScript, trail data hosted on Esri Location Platform, and deployed via Netlify.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Maps | ArcGIS Maps SDK for JavaScript (`@arcgis/core`) |
| Trail data | Esri Location Platform — Feature Layer (GeoJSON) |
| Styling | CSS Modules or Tailwind CSS (mobile-first) |
| Routing | React Router v6 |
| State | Zustand (lightweight global store) |
| Deployment | Netlify (with edge functions for env var protection) |
| Auth (v1) | Optional — localStorage for saved trails in v1 |

---

## Project structure

```
hiking-with-kids/
├── public/
├── src/
│   ├── components/
│   │   ├── TrailCard/
│   │   ├── TrailMap/          ← ArcGIS map component
│   │   ├── TrailDetail/
│   │   ├── BottomSheet/
│   │   ├── FilterChips/
│   │   ├── NavBar/
│   │   └── KidBadges/
│   ├── pages/
│   │   ├── Explore.tsx        ← Screen 1
│   │   ├── MapView.tsx        ← Screen 2
│   │   ├── TrailDetail.tsx    ← Screen 3
│   │   ├── Saved.tsx          ← Screen 4
│   │   └── Profile.tsx        ← Screen 5
│   ├── store/
│   │   └── useAppStore.ts     ← Zustand store
│   ├── hooks/
│   │   ├── useTrails.ts
│   │   └── useLocation.ts
│   ├── types/
│   │   └── trail.ts
│   ├── utils/
│   │   └── arcgis.ts
│   ├── App.tsx
│   └── main.tsx
├── netlify/
│   └── functions/             ← Edge functions if needed
├── .env.example
├── netlify.toml
└── vite.config.ts
```

---

## Data model

### Trail type (`src/types/trail.ts`)

```typescript
export type Difficulty = 'easy' | 'moderate' | 'hard';

export interface KidFeature {
  strollerFriendly: boolean;
  playground: boolean;
  waterFountain: boolean;
  picnicArea: boolean;
  dogFriendly: boolean;
  minRecommendedAge?: number;  // e.g. 6
}

export interface Trail {
  id: string;
  name: string;
  location: string;             // e.g. "Madrid"
  distanceKm: number;
  estimatedMinutes: number;
  elevationGainMeters: number;
  difficulty: Difficulty;
  kidFeatures: KidFeature;
  photos: string[];             // URLs
  geometry: GeoJSON.LineString; // route geometry from Esri Feature Layer
  lat: number;
  lng: number;
  lastUpdated: string;          // ISO date
}

export interface UserProfile {
  displayName: string;
  locationCity: string;
  kids: { name: string; age: number }[];
  preferences: {
    maxDifficulty: Difficulty;
    strollerOnly: boolean;
    searchRadiusKm: number;
  };
  savedTrailIds: string[];
  completedTrailIds: string[];
}
```

---

## Screens & components

### Screen 1 — Home / Explore (`/`)

**Purpose:** Discovery feed of nearby trails.

**Layout (mobile-first, 375px base):**
- Sticky top bar: app logo + notification bell icon
- Search bar: text input with search icon, placeholder "Search trails near you…"
- Filter chips row (horizontal scroll): `All` · `Easy` · `Moderate` · `Stroller` · `Dog-friendly`
- Section label: "Nearby trails"
- Vertical list of `<TrailCard>` components
- Bottom navigation bar (fixed)

**TrailCard component:**
- Thumbnail image (left, 36×56px rounded)
- Trail name (bold, 15px)
- Subtitle: `{distanceKm} km · {estimatedMinutes} min · {location}`
- Badge row: difficulty badge + kid feature badge (e.g. "Stroller OK", "Ages 6+")
- Heart icon (right) — toggles saved state

**Filter chip behavior:**
- `All` shows all trails
- `Easy` / `Moderate` filters by `difficulty`
- `Stroller` filters `kidFeatures.strollerFriendly === true`
- `Dog-friendly` filters `kidFeatures.dogFriendly === true`
- Active chip: teal background (`#E1F5EE`), teal border, teal text

**Badge color rules:**
- Easy → green background (`#c0dd97`), dark green text
- Moderate → amber background (`#FAC775`), dark amber text
- Stroller OK → teal background (`#9FE1CB`), dark teal text
- Ages X+ → blue background (`#B5D4F4`), dark blue text

---

### Screen 2 — Map View (`/map`)

**Purpose:** Geographic overview of all trails using ArcGIS.

**Layout:**
- Top bar: back arrow + "Trail map" title + filter icon
- Full-screen ArcGIS MapView (fills viewport minus top bar and bottom sheet)
- Color-coded pins on map: green = easy, orange = moderate
- Bottom sheet (always visible, 120px height, swipeable up to ~60% screen):
  - When no pin selected: legend (green = easy/stroller, orange = moderate) + hint text
  - When pin selected: trail name, badges, distance, "View trail details" CTA button

**ArcGIS integration:**
```typescript
// src/utils/arcgis.ts
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

// Feature Layer URL from Esri Location Platform
const TRAIL_LAYER_URL = process.env.VITE_ESRI_FEATURE_LAYER_URL;

export function initMap(container: HTMLDivElement) {
  const trailLayer = new FeatureLayer({
    url: TRAIL_LAYER_URL,
    outFields: ['*'],
    renderer: difficultyRenderer,  // color by difficulty field
  });

  const map = new Map({ basemap: 'arcgis/outdoor', layers: [trailLayer] });

  return new MapView({
    container,
    map,
    zoom: 11,
    center: [userLng, userLat],
  });
}
```

**Pin interaction:** clicking a pin populates the bottom sheet via a `hitTest` on the MapView click event.

---

### Screen 3 — Trail Detail (`/trail/:id`)

**Purpose:** Full information about a single trail.

**Layout (scrollable):**
1. Top bar: back arrow + "Trail detail" + share icon
2. Mini ArcGIS map (120px tall, non-interactive) showing route geometry as a dashed polyline overlay
3. Trail name (large, 17px bold) + location + last updated label
4. Stats row (4 equal columns): Distance · Est. time · Elevation gain · Difficulty
5. "Kid features" section: horizontal wrap of feature badges
6. "Photos" section: photo grid (masonry-style, first photo spans 2 rows)
7. Sticky bottom CTA: "Start trail" primary button (teal)

**Kid feature badges (full list):**
- 🚼 Stroller OK
- 🛝 Playground
- 💧 Water fountain
- 🧺 Picnic area
- 🐕 Dog-friendly
- 👶 Ages X+ (if `minRecommendedAge` set)

**"Start trail" action:** opens the system maps app via a deep link:
```typescript
const url = `https://maps.apple.com/?daddr=${trail.lat},${trail.lng}`;
// or Google Maps: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
window.open(url, '_blank');
```

---

### Screen 4 — Saved Trails (`/saved`)

**Purpose:** Bookmarked trails list.

**Layout:**
- Top bar: "Saved trails" + sort icon
- Count label: "X saved"
- Vertical list: trail name, thumbnail, difficulty badge, distance
- Filled heart icon (red) to unsave
- Empty state: icon + "No saved trails yet" + CTA to Explore

---

### Screen 5 — Profile (`/profile`)

**Purpose:** User identity, family config, and preferences.

**Layout:**
1. Top bar: "My profile" + settings icon
2. Avatar circle (initials) + display name + "X kids · City"
3. Stats row: hikes done · saved · total km
4. "Kids" section: pill per child showing name + age, "+ Add" pill (dashed border)
5. "Preferences" section (list rows with right-side value):
   - Max difficulty → dropdown/badge (Easy / Moderate / Hard)
   - Stroller-friendly only → toggle (On/Off)
   - Search radius → value in km (editable)

**Preferences persist to `localStorage` in v1** and drive the Explore feed filter defaults.

---

## Bottom navigation bar

Fixed, always visible. 4 items:

| Icon | Label | Route |
|---|---|---|
| `compass` | Explore | `/` |
| `map` | Map | `/map` |
| `bookmark` | Saved | `/saved` |
| `user` | Profile | `/profile` |

Active item: teal color (`#1D9E75`). Inactive: muted gray.

---

## Color tokens

```css
/* src/styles/tokens.css */
:root {
  --color-primary: #1D9E75;         /* teal — primary CTA, active nav */
  --color-primary-light: #E1F5EE;   /* teal light — active chip bg */
  --color-primary-mid: #9FE1CB;     /* teal mid — stroller badge bg */

  --color-easy: #c0dd97;            /* green — easy difficulty bg */
  --color-easy-text: #3B6D11;
  --color-moderate: #FAC775;        /* amber — moderate difficulty bg */
  --color-moderate-text: #854F0B;
  --color-age: #B5D4F4;             /* blue — age badge bg */
  --color-age-text: #185FA5;

  --color-heart: #D85A30;           /* coral — saved heart */

  --color-surface: #ffffff;
  --color-surface-secondary: #f5f5f3;
  --color-border: rgba(0,0,0,0.12);
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666660;
  --color-text-tertiary: #9e9e96;
}
```

---

## Esri Location Platform setup

1. Create a free account at [location.arcgis.com](https://location.arcgis.com)
2. Create a new **Feature Layer** with these fields:
   - `name` (string)
   - `location` (string)
   - `distance_km` (double)
   - `estimated_minutes` (integer)
   - `elevation_gain_m` (integer)
   - `difficulty` (string: easy/moderate/hard)
   - `stroller_friendly` (boolean)
   - `playground` (boolean)
   - `water_fountain` (boolean)
   - `picnic_area` (boolean)
   - `dog_friendly` (boolean)
   - `min_age` (integer, nullable)
   - `photos` (string — comma-separated URLs or JSON array)
3. Upload trail geometries as polylines (GPX/GeoJSON import)
4. Copy the Feature Layer REST URL → set as `VITE_ESRI_FEATURE_LAYER_URL` in `.env`

### Querying trails by bounding box

```typescript
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

async function queryTrailsInView(extent: __esri.Extent): Promise<Trail[]> {
  const layer = new FeatureLayer({ url: TRAIL_LAYER_URL });
  const result = await layer.queryFeatures({
    geometry: extent,
    spatialRelationship: 'intersects',
    outFields: ['*'],
    returnGeometry: true,
  });
  return result.features.map(featureToTrail);
}
```

---

## Environment variables

```bash
# .env.example
VITE_ARCGIS_API_KEY=your_arcgis_api_key
VITE_ESRI_FEATURE_LAYER_URL=https://services.arcgis.com/.../FeatureServer/0
```

Protect keys via Netlify environment variables — never commit `.env` to git.

---

## Netlify config

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Mobile-first CSS approach

- Base styles target 375px (iPhone SE)
- Breakpoints: `sm: 480px`, `md: 768px` (tablet), `lg: 1024px` (desktop optional)
- Bottom nav: `position: fixed; bottom: 0; left: 0; right: 0; z-index: 100`
- Safe area insets: `padding-bottom: env(safe-area-inset-bottom)` on bottom nav
- Map container: `height: calc(100dvh - topBarHeight - bottomNavHeight)`
- Bottom sheet: use CSS `transform: translateY()` for slide-up animation

---

## Zustand store shape

```typescript
// src/store/useAppStore.ts
interface AppState {
  trails: Trail[];
  filteredTrails: Trail[];
  activeFilter: 'all' | 'easy' | 'moderate' | 'stroller' | 'dog';
  savedTrailIds: Set<string>;
  userProfile: UserProfile;
  selectedTrail: Trail | null;

  setFilter: (filter: AppState['activeFilter']) => void;
  toggleSaved: (trailId: string) => void;
  setSelectedTrail: (trail: Trail | null) => void;
  setTrails: (trails: Trail[]) => void;
}
```

---

## Key decisions for v1

| Decision | v1 choice | Future option |
|---|---|---|
| Auth | None — localStorage only | Supabase / Netlify Identity |
| Trail data | Esri Location Platform Feature Layer | User-submitted trails |
| Navigation | Open external maps app | In-app ArcGIS routing |
| Offline | Not supported | ArcGIS offline maps |
| Photos | Static URLs in Feature Layer | User photo uploads (S3) |
| Language | Spanish (Madrid default) | i18n with `react-i18next` |

---

## Getting started prompt for Claude Code

> Build the "Hiking with Kids" React/TypeScript app described in this spec. Start with:
> 1. Vite + React/TS scaffold
> 2. Install `@arcgis/core`, `react-router-dom`, `zustand`
> 3. Set up CSS tokens from the color section
> 4. Build the bottom `NavBar` component and routing skeleton
> 5. Build the `Explore` page (Screen 1) with mock trail data
> 6. Build the `MapView` page (Screen 2) wiring up ArcGIS MapView with a placeholder Feature Layer URL
> 7. Continue with remaining screens in order

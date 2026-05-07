# Hiking with Kids

A mobile-first web app for finding family-friendly hiking trails. Browse trails by difficulty and kid features, view them on an interactive map, and get directions straight to the trailhead.

---

## Features

### Trail discovery
- **Explore list** — browse all trails sorted by distance from your location
- **Search** — filter by trail name in real time
- **Filter chips** — two rows of multi-select tags:
  - Difficulty: Easy, Moderate, Hard (OR logic — any selected difficulty shows)
  - Kid features: Stroller, Playground, Water, Picnic (AND logic — all selected features must be present)

### Trail detail
- Photos section at the top (full width)
- Stats grid: distance, estimated time, elevation gain, difficulty
- Recommended age badge
- Kid features badges: Stroller friendly, Playground, Water fountain, Picnic area
- Action buttons: **Show my location** (zooms map to show you and the trail) and **Directions to trailhead** (opens Google Maps)

### Interactive map
- ArcGIS basemap with trail routes drawn as coloured polylines (green/amber/red by difficulty)
- Trailhead dot markers, clickable to select a trail
- User location shown as a blue dot, updated in real time
- Tap a trail pin to select it; action buttons appear at the bottom

### Navigation
- **Mobile**: three bottom tabs — Explore, Details, Map
  - Explore → full-screen trail list
  - Details → trail detail page (grayed out until a trail is selected)
  - Map → full-screen map with action buttons
- **Desktop**: persistent two-panel layout
  - Left: 400px sidebar (Explore list or trail detail)
  - Right: always-visible ArcGIS map that zooms to the selected trail automatically
  - "← Back to list" appears in the header when viewing a trail detail

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 (config-free, `@theme` tokens in CSS) |
| Map | ArcGIS Maps SDK for JavaScript (`@arcgis/core` ^4.30.0) |
| State | Zustand v5 with persist middleware |
| Routing | React Router v6 |
| Icons | Lucide React |
| Hosting | Netlify |

---

## Project structure

```
src/
├── App.tsx                     # Root layout, routes, desktop top nav
├── index.css                   # Tailwind v4 @theme tokens + global reset
├── main.tsx
│
├── pages/
│   ├── Explore.tsx             # Trail list with search and filters
│   ├── MapView.tsx             # Full-screen mobile map
│   └── TrailDetail.tsx         # Trail detail page
│
├── components/
│   ├── BottomSheet/            # Action buttons panel in mobile map view
│   ├── DesktopMap/             # Persistent ArcGIS map (desktop only)
│   ├── FilterChips/            # Difficulty + kid feature tag cloud
│   ├── KidBadges/              # Kid feature badge row
│   ├── NavBar/                 # Mobile bottom nav (Explore / Details / Map)
│   └── TrailCard/              # Trail list item
│
├── store/
│   └── useAppStore.ts          # Zustand store (trails, filters, selected trail, location)
│
├── hooks/
│   └── useLocation.ts          # Browser geolocation → store
│
├── utils/
│   ├── arcgis.ts               # Map init, trail layer, fly-to functions
│   ├── featureLayer.ts         # Loads trails from ArcGIS FeatureServer
│   └── geo.ts                  # Haversine distance, format helpers
│
├── data/
│   └── mockTrails.ts           # Fallback trail data (used when no FeatureLayer URL set)
│
└── types/
    └── trail.ts                # Trail, KidFeature, UserProfile TypeScript types
```

---

## Getting started

### Prerequisites
- Node.js 18+
- An [ArcGIS Location Platform](https://location.arcgis.com) account for the API key

### Installation

```bash
git clone https://github.com/ManuelaKronen/hikingwithkids.git
cd hikingwithkids
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```
VITE_ARCGIS_API_KEY=your_arcgis_api_key_here
VITE_ESRI_FEATURE_LAYER_URL=https://services8.arcgis.com/your_org/arcgis/rest/services/Your_Layer/FeatureServer
```

> The app falls back to mock trail data if no `VITE_ESRI_FEATURE_LAYER_URL` is provided.

**ArcGIS API key setup:** In your ArcGIS Location Platform portal, add `http://localhost:5173` (and your production URL) as allowed referrer origins for the key.

### Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

---

## Trail data

Trails are loaded from an ArcGIS FeatureServer layer. Each trail record includes:

- Name, location, distance (km), estimated time (min), elevation gain (m)
- Difficulty: `easy` | `moderate` | `hard`
- Kid features: stroller friendly, playground, water fountain, picnic area, dog friendly, minimum recommended age
- Route geometry (LineString coordinates)
- Trailhead coordinates (lat/lng)

The FeatureLayer URL should point to the FeatureServer root — the app automatically appends `/0` for the layer index.

---

## Colour tokens

Defined in `src/index.css` using Tailwind v4's `@theme` block:

| Token | Value | Usage |
|---|---|---|
| `primary` | `#1D9E75` | Buttons, active nav, links |
| `easy` / `easy-text` | `#c0dd97` / `#3B6D11` | Easy difficulty badge |
| `moderate` / `moderate-text` | `#FAC775` / `#854F0B` | Moderate difficulty badge |
| `age` / `age-text` | `#B5D4F4` / `#185FA5` | Recommended age badge |

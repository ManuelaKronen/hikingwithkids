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
- Trail cards are colour-coded by difficulty (soft green / amber / blush)

### Trail cards
- Photo thumbnail pulled from the trail's `photos` field
- Trail name, location, distance, estimated time
- Distance from your current location
- Difficulty badge + kid feature badges (toned to match card colour)

### Trail detail
- Full-width photo at the top (falls back to placeholder if no photo)
- Stats grid: distance, estimated time, elevation gain, difficulty
- Recommended age badge
- Kid features badges: Stroller friendly, Playground, Water fountain, Picnic area
- Description (falls back to placeholder if not yet filled in)
- Action buttons: **Show my location** and **Directions to trailhead** (opens Google Maps)

### Interactive map
- ArcGIS FeatureLayer with trail routes coloured by difficulty via UniqueValueRenderer
- Trailhead dot markers — clickable to select a trail and open its detail view
- User location shown as a blue dot, updated in real time
- **Top-left**: Home, Zoom in/out (square buttons)
- **Top-right**: Search address, Basemap gallery (8 curated basemaps), Legend, Layer list (with checkbox visibility)
- **Bottom-left**: Metric scale bar
- **Bottom**: Esri attribution

### Navigation
- **Mobile**: three bottom tabs — Explore, Details, Map
  - Explore → full-screen trail list
  - Details → trail detail page (grayed out until a trail is selected)
  - Map → full-screen map with action buttons at the bottom
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
| Font | Nunito (Google Fonts) |
| Map | ArcGIS Maps SDK for JavaScript (`@arcgis/core` ^4.30.0) |
| State | Zustand v5 with persist middleware |
| Routing | React Router v6 |
| Icons | Lucide React |
| Hosting | Vercel |

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
│   └── TrailCard/              # Trail list item with photo thumbnail
│
├── store/
│   └── useAppStore.ts          # Zustand store (trails, filters, selected trail, location)
│
├── hooks/
│   └── useLocation.ts          # Browser geolocation → store
│
├── utils/
│   ├── arcgis.ts               # Map init, widgets, trail layer, fly-to functions
│   ├── featureLayer.ts         # Loads trails from ArcGIS FeatureServer
│   └── geo.ts                  # Haversine distance, format helpers
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

Trails are loaded from an ArcGIS FeatureServer layer. Each trail record uses the following field names:

| Field | Type | Notes |
|---|---|---|
| `name` | String | Trail name |
| `location` | String | Area or neighbourhood |
| `distance_km` | Number | Route length in km |
| `estimated_minutes` | Number | Estimated walking time |
| `elevation_gain_m` | Number | Elevation gain in metres |
| `difficulty` | String | `easy` / `moderate` / `hard` (lowercase) |
| `stroller_friendly` | Integer | 1 = yes, 0 = no |
| `playground` | Integer | 1 = yes, 0 = no |
| `water_fountain` | Integer | 1 = yes, 0 = no |
| `picnic_area` | Integer | 1 = yes, 0 = no |
| `dog_friendly` | Integer | 1 = yes, 0 = no |
| `min_age` | Integer | Minimum recommended age |
| `photos` | String | Comma-separated relative URLs (e.g. `/photo.jpg`) |
| `description` | String | Trail description text |
| `last_updated` | Date | Last updated timestamp |

Photos are served from the `public/` folder — add image files there and reference them as `/filename.jpg` in the `photos` field.

The FeatureLayer URL should point to the FeatureServer root — the app automatically appends `/0` for the layer index.

---

## Colour tokens

Defined in `src/index.css` using Tailwind v4's `@theme` block:

| Token | Value | Usage |
|---|---|---|
| `primary` | `#5BAE8A` | Active nav, distance label |
| `easy` / `easy-text` | `#D0E8C4` / `#386630` | Easy difficulty badge |
| `moderate` / `moderate-text` | `#FFE5A8` / `#875810` | Moderate difficulty badge |
| `hard` / `hard-text` | `#FBCFBB` / `#8A3620` | Hard difficulty badge |
| `kid` / `kid-text` | `#E0EDE6` / `#2D5A3D` | Kid feature badges |
| `surface` | `#FFFFFF` | Card and nav backgrounds |

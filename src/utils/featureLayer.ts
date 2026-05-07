import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import esriConfig from '@arcgis/core/config'
import { Trail, Difficulty } from '../types/trail'

function setupKey() {
  const key = import.meta.env.VITE_ARCGIS_API_KEY
  if (key) esriConfig.apiKey = key
}

function featureToTrail(feature: __esri.Graphic): Trail {
  const a = feature.attributes
  const geom = feature.geometry as __esri.Polyline

  // Use first vertex of polyline as trailhead lat/lng
  const first = geom?.paths?.[0]?.[0] ?? [0, 0]

  return {
    id: String(a.OBJECTID),
    name: a.name ?? '',
    location: a.location ?? '',
    distanceKm: a.distance_km ?? 0,
    estimatedMinutes: a.estimated_minutes ?? 0,
    elevationGainMeters: a.elevation_gain_m ?? 0,
    difficulty: (a.difficulty as Difficulty) ?? 'easy',
    kidFeatures: {
      strollerFriendly: a.stroller_friendly === 1,
      playground: a.playground === 1,
      waterFountain: a.water_fountain === 1,
      picnicArea: a.picnic_area === 1,
      dogFriendly: a.dog_friendly === 1,
      minRecommendedAge: a.min_age != null ? Number(a.min_age) : undefined,
    },
    photos: a.photos ? String(a.photos).split(',').filter(Boolean) : [],
    geometry: {
      type: 'LineString',
      coordinates: geom?.paths?.[0]?.map((p) => [p[0], p[1]] as [number, number]) ?? [],
    },
    lat: first[1],
    lng: first[0],
    lastUpdated: a.last_updated
      ? new Date(a.last_updated).toISOString().split('T')[0]
      : '',
  }
}

export async function fetchTrailsFromLayer(): Promise<Trail[]> {
  const url = import.meta.env.VITE_ESRI_FEATURE_LAYER_URL
  if (!url) return []

  setupKey()

  const layer = new FeatureLayer({ url })
  const result = await layer.queryFeatures({
    where: '1=1',
    outFields: ['*'],
    returnGeometry: true,
    outSpatialReference: { wkid: 4326 },
  })

  return result.features.map(featureToTrail)
}

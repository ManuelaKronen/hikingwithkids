import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Graphic from '@arcgis/core/Graphic'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer'
import Point from '@arcgis/core/geometry/Point'
import Polyline from '@arcgis/core/geometry/Polyline'
import esriConfig from '@arcgis/core/config'
import { setLocale } from '@arcgis/core/intl'
import Basemap from '@arcgis/core/Basemap'
import BasemapStyle from '@arcgis/core/support/BasemapStyle'
import Home from '@arcgis/core/widgets/Home'
import Zoom from '@arcgis/core/widgets/Zoom'
import Expand from '@arcgis/core/widgets/Expand'
import ScaleBar from '@arcgis/core/widgets/ScaleBar'
import Search from '@arcgis/core/widgets/Search'
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'
import Legend from '@arcgis/core/widgets/Legend'
import LayerList from '@arcgis/core/widgets/LayerList'
import { Trail } from '../types/trail'

const COLORS: Record<string, number[]> = {
  easy: [59, 109, 17, 255],
  moderate: [133, 79, 11, 255],
  hard: [185, 28, 28, 255],
}

function setupEsri() {
  const key = import.meta.env.VITE_ARCGIS_API_KEY
  if (key) esriConfig.apiKey = key
  setLocale('en')
}

// FeatureLayer with UniqueValueRenderer — feeds Legend and LayerList
function buildFeatureLayer(url: string): FeatureLayer {
  const fullUrl = /\/\d+$/.test(url.replace(/\/$/, '')) ? url : `${url.replace(/\/$/, '')}/0`
  return new FeatureLayer({
    url: fullUrl,
    id: 'trail-routes',
    title: 'Hiking Trails',
    outFields: ['*'],
    renderer: new UniqueValueRenderer({
      field: 'difficulty',
      uniqueValueInfos: [
        { value: 'easy',     label: 'Easy',     symbol: new SimpleLineSymbol({ color: COLORS.easy,     width: 3 }) },
        { value: 'moderate', label: 'Moderate', symbol: new SimpleLineSymbol({ color: COLORS.moderate, width: 3 }) },
        { value: 'hard',     label: 'Hard',     symbol: new SimpleLineSymbol({ color: COLORS.hard,     width: 3 }) },
      ],
    }),
  })
}

// GraphicsLayer with trailhead dots — used for click targets
function buildDotLayer(trails: Trail[]): GraphicsLayer {
  const layer = new GraphicsLayer({ id: 'trail-dots', listMode: 'hide' })
  trails.forEach((trail) => {
    const color = COLORS[trail.difficulty] ?? COLORS.easy
    layer.add(new Graphic({
      geometry: new Point({ longitude: trail.lng, latitude: trail.lat }),
      symbol: new SimpleMarkerSymbol({
        color,
        size: 12,
        outline: { color: [255, 255, 255, 255], width: 2 },
      }),
      attributes: { trailId: trail.id },
    }))
  })
  return layer
}

export function initMap(
  container: HTMLDivElement,
  trails: Trail[],
  center: [number, number] = [-3.7038, 40.4168]
): __esri.MapView {
  setupEsri()

  const featureLayerUrl = import.meta.env.VITE_ESRI_FEATURE_LAYER_URL
  const layers = featureLayerUrl
    ? [buildFeatureLayer(featureLayerUrl), buildDotLayer(trails)]
    : [buildDotLayer(trails)]

  const map = new Map({ basemap: 'arcgis/outdoor', layers })
  const view = new MapView({ container, map, zoom: 8, center, ui: { components: ['attribution'] } })

  view.when(() => {
    view.ui.add(new Home({ view }), 'top-left')
    view.ui.add(new Zoom({ view }), 'top-left')
    view.ui.add(new ScaleBar({ view, unit: 'metric' }), 'bottom-left')

    const group = 'top-right'
    view.ui.add([
      new Expand({ view, content: new Search({ view }), expandIcon: 'search', group }),
      (() => {
        const gallery = new BasemapGallery({
          view,
          source: [
            ['arcgis/outdoor',           'Outdoor'],
            ['arcgis/topographic',       'Topographic'],
            ['arcgis/streets',           'Streets'],
            ['arcgis/light-gray',        'Light Gray'],
            ['arcgis/dark-gray',         'Dark Gray'],
            ['arcgis/midcentury',        'Midcentury'],
          ].map(([id, title]) => new Basemap({ style: new BasemapStyle({ id }), title })),
        })
        const expand = new Expand({ view, expandIcon: 'basemap', group, content: gallery })
        gallery.watch('activeBasemap', () => expand.collapse())
        return expand
      })(),
      new Expand({ view, content: new Legend({ view }), expandIcon: 'legend', group }),
      new Expand({ view, content: new LayerList({ view, visibilityAppearance: 'checkbox' }), expandIcon: 'layers', group }),
    ], 'top-right')
  })

  return view
}

export function updateTrailLayer(view: __esri.MapView, trails: Trail[]) {
  if (!view.map) return
  const dots = view.map.findLayerById('trail-dots')
  if (dots) view.map.remove(dots)
  view.map.add(buildDotLayer(trails))
}

const USER_LAYER_ID = 'user-location'

export function updateUserLocationOnMap(view: __esri.MapView, lat: number, lng: number) {
  if (!view.map) return
  let layer = view.map.findLayerById(USER_LAYER_ID) as GraphicsLayer | undefined
  if (!layer) {
    layer = new GraphicsLayer({ id: USER_LAYER_ID, listMode: 'hide' })
    view.map.add(layer)
  }
  layer.removeAll()
  const point = new Point({ longitude: lng, latitude: lat })
  layer.addMany([
    new Graphic({
      geometry: point,
      symbol: new SimpleMarkerSymbol({
        color: [66, 133, 244, 35],
        size: 26,
        outline: { color: [66, 133, 244, 130], width: 2 },
      }),
    }),
    new Graphic({
      geometry: point,
      symbol: new SimpleMarkerSymbol({
        color: [66, 133, 244, 255],
        size: 10,
        outline: { color: [255, 255, 255, 255], width: 2 },
      }),
    }),
  ])
}

export function flyToTrailAndUser(
  view: __esri.MapView,
  trail: Trail,
  userLat: number,
  userLng: number
) {
  const userPoint = new Point({ longitude: userLng, latitude: userLat })
  const hasRoute = trail.geometry.coordinates.length > 1
  const targets: (Point | Polyline)[] = [userPoint]
  if (hasRoute) {
    targets.push(new Polyline({ paths: [trail.geometry.coordinates], spatialReference: { wkid: 4326 } }))
  } else {
    targets.push(new Point({ longitude: trail.lng, latitude: trail.lat }))
  }
  view.goTo(targets, { duration: 700 }).catch(() => {})
}

export function flyToTrail(view: __esri.MapView, trail: Trail) {
  const hasRoute = trail.geometry.coordinates.length > 1
  if (hasRoute) {
    const polyline = new Polyline({
      paths: [trail.geometry.coordinates],
      spatialReference: { wkid: 4326 },
    })
    if (polyline.extent) {
      view.goTo(polyline.extent.expand(1.6), { duration: 600 }).catch(() => {})
      return
    }
  }
  view.goTo({ center: [trail.lng, trail.lat], zoom: 15 }, { duration: 600 }).catch(() => {})
}

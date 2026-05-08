import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Graphic from '@arcgis/core/Graphic'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'
import Point from '@arcgis/core/geometry/Point'
import Polyline from '@arcgis/core/geometry/Polyline'
import esriConfig from '@arcgis/core/config'
import Home from '@arcgis/core/widgets/Home'
import Zoom from '@arcgis/core/widgets/Zoom'
import Expand from '@arcgis/core/widgets/Expand'
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
}

function buildTrailLayer(trails: Trail[]): GraphicsLayer {
  const layer = new GraphicsLayer({ id: 'trails' })
  trails.forEach((trail) => {
    const color = COLORS[trail.difficulty] ?? COLORS.easy

    // Route polyline
    if (trail.geometry.coordinates.length > 1) {
      const polyline = new Polyline({
        paths: [trail.geometry.coordinates],
        spatialReference: { wkid: 4326 },
      })
      layer.add(
        new Graphic({
          geometry: polyline,
          symbol: new SimpleLineSymbol({ color, width: 3 }),
          attributes: { trailId: trail.id },
        })
      )
    }

    // Trailhead dot for click target
    const point = new Point({ longitude: trail.lng, latitude: trail.lat })
    layer.add(
      new Graphic({
        geometry: point,
        symbol: new SimpleMarkerSymbol({
          color,
          size: 12,
          outline: { color: [255, 255, 255, 255], width: 2 },
        }),
        attributes: { trailId: trail.id },
      })
    )
  })
  return layer
}

export function initMap(
  container: HTMLDivElement,
  trails: Trail[],
  center: [number, number] = [-3.7038, 40.4168]
): __esri.MapView {
  setupEsri()
  const trailLayer = buildTrailLayer(trails)
  const map = new Map({ basemap: 'arcgis/outdoor', layers: [trailLayer] })
  const view = new MapView({ container, map, zoom: 8, center, ui: { components: ['attribution'] } })
  view.when(() => {
    view.ui.add(new Home({ view }), 'top-left')
    view.ui.add(new Zoom({ view }), 'top-left')

    const group = 'top-right'
    view.ui.add([
      new Expand({ view, content: new Search({ view }), expandIcon: 'search', group }),
      new Expand({ view, content: new BasemapGallery({ view }), expandIcon: 'basemap', group }),
      new Expand({ view, content: new Legend({ view }), expandIcon: 'legend', group }),
      new Expand({ view, content: new LayerList({ view }), expandIcon: 'layer-list', group }),
    ], 'top-right')
  })
  return view
}

export function updateTrailLayer(view: __esri.MapView, trails: Trail[]) {
  if (!view.map) return
  const existing = view.map.findLayerById('trails')
  if (existing) view.map.remove(existing)
  view.map.add(buildTrailLayer(trails))
}

const USER_LAYER_ID = 'user-location'

export function updateUserLocationOnMap(view: __esri.MapView, lat: number, lng: number) {
  if (!view.map) return
  let layer = view.map.findLayerById(USER_LAYER_ID) as GraphicsLayer | undefined
  if (!layer) {
    layer = new GraphicsLayer({ id: USER_LAYER_ID })
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


import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Graphic from '@arcgis/core/Graphic'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'
import Point from '@arcgis/core/geometry/Point'
import Polyline from '@arcgis/core/geometry/Polyline'
import esriConfig from '@arcgis/core/config'
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
    const point = new Point({ longitude: trail.lng, latitude: trail.lat })
    const color = COLORS[trail.difficulty] ?? COLORS.easy
    const symbol = new SimpleMarkerSymbol({
      color,
      size: 14,
      outline: { color: [255, 255, 255, 255], width: 2 },
    })
    layer.add(new Graphic({ geometry: point, symbol, attributes: { trailId: trail.id } }))
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
  return new MapView({ container, map, zoom: 11, center, ui: { components: [] } })
}

export function updateTrailLayer(view: __esri.MapView, trails: Trail[]) {
  if (!view.map) return
  const existing = view.map.findLayerById('trails')
  if (existing) view.map.remove(existing)
  view.map.add(buildTrailLayer(trails))
}

const USER_LAYER_ID = 'user-location'
const ROUTE_LAYER_ID = 'route-indicator'

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

export function drawRouteIndicator(
  view: __esri.MapView,
  userLat: number,
  userLng: number,
  trailLat: number,
  trailLng: number
) {
  if (!view.map) return
  let layer = view.map.findLayerById(ROUTE_LAYER_ID) as GraphicsLayer | undefined
  if (!layer) {
    layer = new GraphicsLayer({ id: ROUTE_LAYER_ID })
    view.map.add(layer)
  }
  layer.removeAll()
  const line = new Polyline({
    paths: [[[userLng, userLat], [trailLng, trailLat]]],
    spatialReference: { wkid: 4326 },
  })
  layer.add(
    new Graphic({
      geometry: line,
      symbol: new SimpleLineSymbol({ color: [66, 133, 244, 180], width: 2.5, style: 'dash' }),
    })
  )
}

export function clearRouteIndicator(view: __esri.MapView) {
  if (!view.map) return
  const layer = view.map.findLayerById(ROUTE_LAYER_ID) as GraphicsLayer | undefined
  if (layer) layer.removeAll()
}

export function initMiniMap(container: HTMLDivElement, trail: Trail): __esri.MapView {
  setupEsri()
  const routeLayer = new GraphicsLayer()
  const polyline = new Polyline({
    paths: [trail.geometry.coordinates],
    spatialReference: { wkid: 4326 },
  })
  const lineSymbol = new SimpleLineSymbol({
    color: [29, 158, 117, 220],
    width: 3,
    style: 'dash',
  })
  routeLayer.add(new Graphic({ geometry: polyline, symbol: lineSymbol }))

  const map = new Map({ basemap: 'arcgis/outdoor', layers: [routeLayer] })
  return new MapView({
    container,
    map,
    center: [trail.lng, trail.lat],
    zoom: 14,
    ui: { components: [] },
    navigation: {
      mouseWheelZoomEnabled: false,
      browserTouchPanEnabled: false,
    },
  })
}

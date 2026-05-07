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

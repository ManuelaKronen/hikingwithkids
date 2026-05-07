import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import {
  initMap,
  updateUserLocationOnMap,
  drawRouteIndicator,
  clearRouteIndicator,
} from '../utils/arcgis'
import BottomSheet from '../components/BottomSheet/BottomSheet'
import type { Trail } from '../types/trail'

export default function MapViewPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<__esri.MapView | null>(null)
  const navigate = useNavigate()

  const trails = useAppStore((s) => s.trails)
  const selectedTrail = useAppStore((s) => s.selectedTrail)
  const setSelectedTrail = useAppStore((s) => s.setSelectedTrail)
  const userLocation = useAppStore((s) => s.userLocation)

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || viewRef.current) return

    const center: [number, number] = userLocation
      ? [userLocation.lng, userLocation.lat]
      : [-3.7038, 40.4168]

    const view = initMap(mapRef.current, trails, center)
    viewRef.current = view

    view.when(() => {
      view.on('click', async (event) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await view.hitTest(event as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hit = response.results.find((r: any) => r.type === 'graphic') as any
        if (hit?.graphic?.attributes?.trailId) {
          const trail = trails.find((t: Trail) => t.id === hit.graphic.attributes.trailId)
          if (trail) {
            setSelectedTrail(trail)
            return
          }
        }
        setSelectedTrail(null)
      })
    })

    return () => {
      viewRef.current?.destroy()
      viewRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update user location dot
  useEffect(() => {
    if (!viewRef.current || !userLocation) return
    viewRef.current.when(() => {
      updateUserLocationOnMap(viewRef.current!, userLocation.lat, userLocation.lng)
    })
  }, [userLocation?.lat, userLocation?.lng]) // eslint-disable-line react-hooks/exhaustive-deps

  // Draw route line when trail selected
  useEffect(() => {
    if (!viewRef.current) return
    viewRef.current.when(() => {
      if (selectedTrail && userLocation) {
        drawRouteIndicator(
          viewRef.current!,
          userLocation.lat,
          userLocation.lng,
          selectedTrail.lat,
          selectedTrail.lng
        )
      } else {
        clearRouteIndicator(viewRef.current!)
      }
    })
  }, [selectedTrail?.id, userLocation?.lat, userLocation?.lng]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 z-10 shrink-0">
        <button onClick={() => navigate(-1)} className="p-0.5">
          <ArrowLeft size={22} strokeWidth={2} className="text-gray-700" />
        </button>
        <h1 className="flex-1 font-semibold text-gray-900">Mapa de rutas</h1>
      </div>

      <div ref={mapRef} className="flex-1 relative" />

      <BottomSheet selectedTrail={selectedTrail} onClear={() => setSelectedTrail(null)} />
    </div>
  )
}

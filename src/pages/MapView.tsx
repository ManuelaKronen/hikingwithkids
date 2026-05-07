import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import {
  initMap,
  updateTrailLayer,
  updateUserLocationOnMap,
  flyToTrail,
  flyToTrailAndUser,
} from '../utils/arcgis'
import BottomSheet from '../components/BottomSheet/BottomSheet'
import NavBar from '../components/NavBar/NavBar'
import type { Trail } from '../types/trail'

export default function MapViewPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<__esri.MapView | null>(null)
  const trails = useAppStore((s) => s.trails)
  const selectedTrail = useAppStore((s) => s.selectedTrail)
  const setSelectedTrail = useAppStore((s) => s.setSelectedTrail)
  const userLocation = useAppStore((s) => s.userLocation)
  const locationFocusCount = useAppStore((s) => s.locationFocusCount)

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

  // Refresh trail pins when data loads from Feature Layer
  useEffect(() => {
    if (!viewRef.current) return
    viewRef.current.when(() => updateTrailLayer(viewRef.current!, trails))
  }, [trails]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update user location dot
  useEffect(() => {
    if (!viewRef.current || !userLocation) return
    viewRef.current.when(() => {
      updateUserLocationOnMap(viewRef.current!, userLocation.lat, userLocation.lng)
    })
  }, [userLocation?.lat, userLocation?.lng]) // eslint-disable-line react-hooks/exhaustive-deps

  // Zoom to trail when selected
  useEffect(() => {
    if (!viewRef.current) return
    viewRef.current.when(() => {
      if (selectedTrail) flyToTrail(viewRef.current!, selectedTrail)
    })
  }, [selectedTrail?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Zoom to show both trail and user location on "Show my location"
  useEffect(() => {
    if (!viewRef.current || !selectedTrail || !userLocation || locationFocusCount === 0) return
    viewRef.current.when(() => {
      flyToTrailAndUser(viewRef.current!, selectedTrail, userLocation.lat, userLocation.lng)
    })
  }, [locationFocusCount]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-full flex flex-col">

      <div ref={mapRef} className="flex-1 relative" />

      {selectedTrail && (
        <BottomSheet selectedTrail={selectedTrail} onClear={() => setSelectedTrail(null)} />
      )}
      <NavBar />
    </div>
  )
}

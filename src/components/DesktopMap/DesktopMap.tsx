import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import {
  initMap,
  updateTrailLayer,
  updateUserLocationOnMap,
  flyToTrail,
  flyToTrailAndUser,
} from '../../utils/arcgis'
import type { Trail } from '../../types/trail'

export default function DesktopMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<__esri.MapView | null>(null)
  const navigate = useNavigate()

  const trails = useAppStore((s) => s.trails)
  const trailsRef = useRef(trails)
  trailsRef.current = trails
  const selectedTrail = useAppStore((s) => s.selectedTrail)
  const setSelectedTrail = useAppStore((s) => s.setSelectedTrail)
  const userLocation = useAppStore((s) => s.userLocation)
  const locationFocusCount = useAppStore((s) => s.locationFocusCount)

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || viewRef.current) return

    const view = initMap(mapRef.current, trails)
    viewRef.current = view

    view.when(() => {
      view.on('click', async (event) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await view.hitTest(event as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hit = response.results.find((r: any) => r.type === 'graphic') as any
        if (hit?.graphic?.attributes?.trailId) {
          const trail = trailsRef.current.find((t: Trail) => t.id === hit.graphic.attributes.trailId)
          if (trail) {
            setSelectedTrail(trail)
            navigate(`/trail/${trail.id}`)
          }
        } else {
          setSelectedTrail(null)
        }
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

  // Pan to trail + draw route line
  useEffect(() => {
    if (!viewRef.current) return
    viewRef.current.when(() => {
      if (selectedTrail) {
        flyToTrail(viewRef.current!, selectedTrail)
      }
    })
  }, [selectedTrail?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Zoom to show both trail and user location
  useEffect(() => {
    if (!viewRef.current || !selectedTrail || !userLocation || locationFocusCount === 0) return
    viewRef.current.when(() => {
      flyToTrailAndUser(viewRef.current!, selectedTrail, userLocation.lat, userLocation.lng)
    })
  }, [locationFocusCount]) // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={mapRef} className="w-full h-full" />
}

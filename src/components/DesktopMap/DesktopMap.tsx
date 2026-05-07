import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { initMap } from '../../utils/arcgis'
import type { Trail } from '../../types/trail'

export default function DesktopMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<__esri.MapView | null>(null)
  const navigate = useNavigate()

  const trails = useAppStore((s) => s.trails)
  const selectedTrail = useAppStore((s) => s.selectedTrail)
  const setSelectedTrail = useAppStore((s) => s.setSelectedTrail)

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
          const trail = trails.find((t: Trail) => t.id === hit.graphic.attributes.trailId)
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

  // Pan to selected trail
  useEffect(() => {
    if (!viewRef.current || !selectedTrail) return
    viewRef.current.goTo(
      { center: [selectedTrail.lng, selectedTrail.lat], zoom: 13 },
      { duration: 500 }
    )
  }, [selectedTrail?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={mapRef} className="w-full h-full" />
}

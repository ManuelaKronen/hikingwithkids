import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Share2, Clock, TrendingUp, Ruler, MapPin } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import KidBadges from '../components/KidBadges/KidBadges'
import NavBar from '../components/NavBar/NavBar'

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
}

const DIFFICULTY_CLASSES: Record<string, string> = {
  easy: 'text-easy-text',
  moderate: 'text-moderate-text',
  hard: 'text-red-800',
}

export default function TrailDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const trail = useAppStore((s) => s.trails.find((t) => t.id === id))
  const setSelectedTrail = useAppStore((s) => s.setSelectedTrail)
  const requestLocationFocus = useAppStore((s) => s.requestLocationFocus)
  const markCompleted = useAppStore((s) => s.markCompleted)

  // Keep selected trail in sync so the desktop map zooms to it
  useEffect(() => {
    if (trail) setSelectedTrail(trail)
    return () => setSelectedTrail(null)
  }, [trail?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!trail) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>Trail not found</p>
      </div>
    )
  }

  const handleStart = () => {
    markCompleted(trail.id)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${trail.lat},${trail.lng}`
    window.open(url, '_blank')
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-0.5">
          <ArrowLeft size={22} strokeWidth={2} className="text-gray-700" />
        </button>
        <h1 className="flex-1 font-semibold text-gray-900 truncate">{trail.name}</h1>
        <button className="p-0.5">
          <Share2 size={20} strokeWidth={1.8} className="text-gray-500" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Photos */}
        <div className="w-full bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center text-gray-400" style={{ height: 160 }}>
          <div className="text-center">
            <p className="text-3xl">📷</p>
            <p className="text-xs mt-1">Photos coming soon</p>
          </div>
        </div>

        <div className="px-4 pt-4">
          <h2 className="text-[17px] font-bold text-gray-900 leading-snug">{trail.name}</h2>
          <div className="flex items-center gap-1.5 mt-1 mb-4">
            <MapPin size={14} className="text-gray-400" strokeWidth={1.8} />
            <span className="text-sm text-gray-500">{trail.location}</span>
            <span className="text-gray-300 mx-1">·</span>
            <span className="text-xs text-gray-400">Updated {trail.lastUpdated}</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { icon: Ruler, label: 'Distance', value: `${trail.distanceKm} km` },
              { icon: Clock, label: 'Time', value: `${trail.estimatedMinutes} min` },
              { icon: TrendingUp, label: 'Elevation', value: `${trail.elevationGainMeters} m` },
              {
                icon: () => <span className="text-base">🏔</span>,
                label: 'Difficulty',
                value: DIFFICULTY_LABEL[trail.difficulty],
                valueClass: DIFFICULTY_CLASSES[trail.difficulty],
              },
            ].map(({ icon: Icon, label, value, valueClass }) => (
              <div
                key={label}
                className="bg-gray-50 rounded-xl p-2.5 flex flex-col items-center gap-1"
              >
                <Icon size={18} strokeWidth={1.8} className="text-gray-500" />
                <span className="text-[10px] text-gray-400">{label}</span>
                <span
                  className={`text-xs font-semibold text-center leading-tight ${valueClass ?? 'text-gray-800'}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Recommended age */}
          {trail.kidFeatures.minRecommendedAge && (
            <section className="mb-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Recommended age</h3>
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-age text-age-text">
                👶 {trail.kidFeatures.minRecommendedAge}+ yrs
              </span>
            </section>
          )}

          {/* Kid features */}
          <section className="mb-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Kid features</h3>
            <KidBadges features={trail.kidFeatures} size="md" />
          </section>

        </div>
      </div>

      {/* Sticky CTA — desktop only, mobile uses map view buttons */}
      <div className="hidden md:block shrink-0 px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="bg-white rounded-2xl shadow-sm p-3 flex flex-col gap-2">
          <button
            onClick={requestLocationFocus}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-[15px]"
          >
            Show my location
          </button>
          <button
            onClick={handleStart}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-[15px]"
          >
            Directions to trailhead
          </button>
        </div>
      </div>
      <NavBar />
    </div>
  )
}

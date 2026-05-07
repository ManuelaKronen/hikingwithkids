import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import FilterChips from '../components/FilterChips/FilterChips'
import TrailCard from '../components/TrailCard/TrailCard'
import NavBar from '../components/NavBar/NavBar'
import { haversineKm } from '../utils/geo'

export default function Explore() {
  const filteredTrails = useAppStore((s) => s.filteredTrails)
  const activeFilters = useAppStore((s) => s.activeFilters)
  const toggleFilter = useAppStore((s) => s.toggleFilter)
  const userLocation = useAppStore((s) => s.userLocation)
  const [query, setQuery] = useState('')

  const searched = query
    ? filteredTrails.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.location.toLowerCase().includes(query.toLowerCase())
      )
    : filteredTrails

  const displayed = useMemo(() => {
    if (!userLocation) return searched
    return [...searched].sort(
      (a, b) =>
        haversineKm(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        haversineKm(userLocation.lat, userLocation.lng, b.lat, b.lng)
    )
  }, [searched, userLocation])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sticky header */}
      <div className="shrink-0 bg-[#7A5230] px-4 pt-3 pb-3 border-b border-[#5A3A1A]">

        <div className="flex items-center gap-3 mb-3 md:hidden">
          <div className="w-9 h-9 rounded-full bg-[#F8F0E3] flex items-center justify-center text-lg shrink-0">
            🥾
          </div>
          <span className="font-bold text-[#F8F0E3] text-lg uppercase tracking-wide">Hiking with Kids</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4A882]"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search trail by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#8B6040] rounded-xl text-sm text-[#F8F0E3] placeholder:text-[#C4A882] border border-[#A07050] outline-none focus:border-[#F8F0E3] transition-colors"
          />
        </div>

        <FilterChips activeFilters={activeFilters} onToggleFilter={toggleFilter} />
      </div>

      {/* Scrollable trail list */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Nearby trails · {displayed.length} {displayed.length === 1 ? 'result' : 'results'}
        </p>
        {displayed.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No trails found</p>
            <p className="text-sm mt-1">Try a different filter or search</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((trail) => (
              <TrailCard
                key={trail.id}
                trail={trail}
                distanceFromUser={
                  userLocation
                    ? haversineKm(userLocation.lat, userLocation.lng, trail.lat, trail.lng)
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
      <NavBar />
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import FilterChips from '../components/FilterChips/FilterChips'
import TrailCard from '../components/TrailCard/TrailCard'
import { haversineKm } from '../utils/geo'

export default function Explore() {
  const filteredTrails = useAppStore((s) => s.filteredTrails)
  const activeFilter = useAppStore((s) => s.activeFilter)
  const setFilter = useAppStore((s) => s.setFilter)
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
      <div className="shrink-0 bg-white px-4 pt-4 pb-2 border-b border-gray-100">

        <p className="font-bold text-gray-900 text-lg mb-3 md:hidden">Hiking with Kids</p>

        {/* Search */}
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search trails near you…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:border-primary transition-colors"
          />
        </div>

        <FilterChips activeFilter={activeFilter} onFilterChange={setFilter} />
      </div>

      {/* Scrollable trail list */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Nearby trails · {displayed.length} results
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
    </div>
  )
}

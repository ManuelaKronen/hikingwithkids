import { useNavigate } from 'react-router-dom'
import { SortDesc } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import TrailCard from '../components/TrailCard/TrailCard'

export default function Saved() {
  const allTrails = useAppStore((s) => s.trails)
  const savedTrailIds = useAppStore((s) => s.savedTrailIds)
  const toggleSaved = useAppStore((s) => s.toggleSaved)
  const navigate = useNavigate()

  const savedTrails = allTrails.filter((t) => savedTrailIds.includes(t.id))

  return (
    <div className="pb-20 min-h-full">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100">
        <h1 className="flex-1 font-bold text-gray-900 text-lg">Rutas guardadas</h1>
        <button className="p-0.5">
          <SortDesc size={20} strokeWidth={1.8} className="text-gray-500" />
        </button>
      </div>

      <div className="px-4 pt-4">
        {savedTrails.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🤍</p>
            <p className="font-semibold text-gray-700 text-[15px]">Aún no hay rutas guardadas</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Toca el corazón en cualquier ruta para guardarla aquí
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm"
            >
              Explorar rutas
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">
              {savedTrails.length} {savedTrails.length === 1 ? 'ruta guardada' : 'rutas guardadas'}
            </p>
            <div className="space-y-3">
              {savedTrails.map((trail) => (
                <TrailCard
                  key={trail.id}
                  trail={trail}
                  isSaved={true}
                  onToggleSaved={() => toggleSaved(trail.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

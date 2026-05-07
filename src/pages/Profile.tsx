import { useState } from 'react'
import { Settings, Plus, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Difficulty } from '../types/trail'

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Fácil' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'hard', label: 'Difícil' },
]

export default function Profile() {
  const userProfile = useAppStore((s) => s.userProfile)
  const savedCount = useAppStore((s) => s.savedTrailIds.length)
  const allTrails = useAppStore((s) => s.trails)
  const updateProfile = useAppStore((s) => s.updateProfile)
  const addKid = useAppStore((s) => s.addKid)

  const [showAddKid, setShowAddKid] = useState(false)
  const [newKidName, setNewKidName] = useState('')
  const [newKidAge, setNewKidAge] = useState('')

  const completedCount = userProfile.completedTrailIds.length
  const totalKm = userProfile.completedTrailIds.reduce((sum, id) => {
    const trail = allTrails.find((t) => t.id === id)
    return sum + (trail?.distanceKm ?? 0)
  }, 0)

  const initials = userProfile.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleAddKid = () => {
    if (!newKidName.trim() || !newKidAge) return
    addKid({ name: newKidName.trim(), age: parseInt(newKidAge) })
    setNewKidName('')
    setNewKidAge('')
    setShowAddKid(false)
  }

  return (
    <div className="pb-20 min-h-full">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100">
        <h1 className="flex-1 font-bold text-gray-900 text-lg">Mi perfil</h1>
        <button className="p-0.5">
          <Settings size={20} strokeWidth={1.8} className="text-gray-500" />
        </button>
      </div>

      <div className="px-4 pt-5">
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{userProfile.displayName}</h2>
            <p className="text-sm text-gray-500">
              {userProfile.kids.length} {userProfile.kids.length === 1 ? 'peque' : 'peques'} ·{' '}
              {userProfile.locationCity}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: completedCount, label: 'Rutas hechas' },
            { value: savedCount, label: 'Guardadas' },
            { value: `${totalKm.toFixed(1)} km`, label: 'Total km' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-gray-50 rounded-2xl p-3 text-center">
              <p className="text-xl font-bold text-primary">{value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Kids section */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2.5">Mis peques</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.kids.map((kid, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5"
              >
                <span className="text-sm">👧</span>
                <span className="text-sm font-medium text-gray-800">{kid.name}</span>
                <span className="text-xs text-gray-400">{kid.age}a</span>
              </div>
            ))}
            {!showAddKid && (
              <button
                onClick={() => setShowAddKid(true)}
                className="flex items-center gap-1 border border-dashed border-gray-300 rounded-full px-3 py-1.5 text-sm text-gray-400"
              >
                <Plus size={14} />
                Añadir
              </button>
            )}
          </div>

          {showAddKid && (
            <div className="mt-3 flex gap-2 items-center">
              <input
                placeholder="Nombre"
                value={newKidName}
                onChange={(e) => setNewKidName(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                placeholder="Edad"
                type="number"
                min="0"
                max="18"
                value={newKidAge}
                onChange={(e) => setNewKidAge(e.target.value)}
                className="w-16 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                onClick={handleAddKid}
                className="bg-primary text-white rounded-xl px-3 py-2 text-sm font-medium"
              >
                OK
              </button>
              <button onClick={() => setShowAddKid(false)}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>
          )}
        </section>

        {/* Preferences */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2.5">Preferencias</h3>
          <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100">
            {/* Max difficulty */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-700">Dificultad máxima</span>
              <div className="flex gap-1.5">
                {DIFFICULTY_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() =>
                      updateProfile({
                        preferences: { ...userProfile.preferences, maxDifficulty: value },
                      })
                    }
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                      userProfile.preferences.maxDifficulty === value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stroller only */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-700">Solo rutas con carrito</span>
              <button
                onClick={() =>
                  updateProfile({
                    preferences: {
                      ...userProfile.preferences,
                      strollerOnly: !userProfile.preferences.strollerOnly,
                    },
                  })
                }
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  userProfile.preferences.strollerOnly ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    userProfile.preferences.strollerOnly ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Search radius */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Radio de búsqueda</span>
                <span className="text-sm font-semibold text-primary">
                  {userProfile.preferences.searchRadiusKm} km
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={userProfile.preferences.searchRadiusKm}
                onChange={(e) =>
                  updateProfile({
                    preferences: {
                      ...userProfile.preferences,
                      searchRadiusKm: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-primary"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

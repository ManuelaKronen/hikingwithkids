import { useNavigate } from 'react-router-dom'
import { Trail } from '../../types/trail'
import { useAppStore } from '../../store/useAppStore'

interface Props {
  selectedTrail: Trail
  onClear: () => void
}

export default function BottomSheet({ selectedTrail, onClear }: Props) {
  const navigate = useNavigate()
  const requestLocationFocus = useAppStore((s) => s.requestLocationFocus)

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedTrail.lat},${selectedTrail.lng}`
    window.open(url, '_blank')
  }

  return (
    <div
      className="shrink-0 bg-white border-t border-gray-100"
      style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}
    >
      <div className="px-4 pt-3 pb-2">
        {/* Trail name + close */}
        <div className="flex items-center justify-between mb-3">
          <h3
            className="font-semibold text-gray-900 text-[15px] leading-tight flex-1 cursor-pointer"
            onClick={() => navigate(`/trail/${selectedTrail.id}`)}
          >
            {selectedTrail.name}
          </h3>
          <button onClick={onClear} className="text-gray-400 text-xl leading-none ml-2">×</button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={requestLocationFocus}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold"
          >
            Show my location
          </button>
          <button
            onClick={handleDirections}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold"
          >
            Directions to trailhead
          </button>
        </div>
      </div>
    </div>
  )
}

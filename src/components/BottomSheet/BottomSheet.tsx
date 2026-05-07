import { Trail } from '../../types/trail'
import { useAppStore } from '../../store/useAppStore'

interface Props {
  selectedTrail: Trail
}

export default function BottomSheet({ selectedTrail }: Props) {
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
      <div className="px-4 py-3 flex gap-2">
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
  )
}

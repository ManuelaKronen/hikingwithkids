import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Trail } from '../../types/trail'
import { formatDistanceFromUser } from '../../utils/geo'

interface Props {
  trail: Trail
  isSaved: boolean
  onToggleSaved: () => void
  distanceFromUser?: number
}

const GRADIENTS: Record<string, string> = {
  easy: 'from-green-100 to-green-300',
  moderate: 'from-amber-100 to-amber-300',
  hard: 'from-red-100 to-red-300',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
}

const DIFFICULTY_CLASSES: Record<string, string> = {
  easy: 'bg-easy text-easy-text',
  moderate: 'bg-moderate text-moderate-text',
  hard: 'bg-red-100 text-red-800',
}

export default function TrailCard({ trail, isSaved, onToggleSaved, distanceFromUser }: Props) {
  const navigate = useNavigate()

  return (
    <div
      className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm active:opacity-80 cursor-pointer"
      onClick={() => navigate(`/trail/${trail.id}`)}
    >
      {/* Thumbnail */}
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${GRADIENTS[trail.difficulty] ?? GRADIENTS.easy} flex items-center justify-center shrink-0 text-2xl`}
      >
        🏞
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-[15px] leading-snug truncate">
          {trail.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {trail.distanceKm} km · {trail.estimatedMinutes} min · {trail.location}
        </p>
        {distanceFromUser !== undefined && (
          <p className="text-xs text-primary font-medium mt-0.5">
            📍 {formatDistanceFromUser(distanceFromUser)}
          </p>
        )}
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_CLASSES[trail.difficulty] ?? 'bg-gray-100 text-gray-600'}`}
          >
            {DIFFICULTY_LABEL[trail.difficulty] ?? trail.difficulty}
          </span>
          {trail.kidFeatures.strollerFriendly && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary-mid text-teal-800">
              🚼 Stroller
            </span>
          )}
          {trail.kidFeatures.minRecommendedAge && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-age text-age-text">
              👶 {trail.kidFeatures.minRecommendedAge}+
            </span>
          )}
        </div>
      </div>

      {/* Heart */}
      <button
        className="shrink-0 p-1.5"
        onClick={(e) => {
          e.stopPropagation()
          onToggleSaved()
        }}
      >
        <Heart
          size={20}
          fill={isSaved ? '#D85A30' : 'none'}
          stroke={isSaved ? '#D85A30' : '#9e9e96'}
          strokeWidth={1.8}
        />
      </button>
    </div>
  )
}

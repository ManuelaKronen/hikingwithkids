import { useNavigate } from 'react-router-dom'
import { Trail } from '../../types/trail'
import { formatDistanceFromUser } from '../../utils/geo'

interface Props {
  trail: Trail
  distanceFromUser?: number
}

const GRADIENTS: Record<string, string> = {
  easy: 'from-emerald-200 to-green-600',
  moderate: 'from-amber-200 to-amber-500',
  hard: 'from-orange-300 to-red-500',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
}

const DIFFICULTY_CLASSES: Record<string, string> = {
  easy: 'bg-easy text-easy-text',
  moderate: 'bg-moderate text-moderate-text',
  hard: 'bg-hard text-hard-text',
}

export default function TrailCard({ trail, distanceFromUser }: Props) {
  const navigate = useNavigate()

  return (
    <div
      className="flex items-center gap-3 bg-surface rounded-2xl p-3 shadow-sm active:opacity-80 cursor-pointer"
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
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_CLASSES[trail.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
            {DIFFICULTY_LABEL[trail.difficulty] ?? trail.difficulty}
          </span>
          {trail.kidFeatures.minRecommendedAge && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-age text-age-text">
              👶 {trail.kidFeatures.minRecommendedAge}+
            </span>
          )}
          {trail.kidFeatures.strollerFriendly && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary-mid text-teal-800">
              🚼 Stroller
            </span>
          )}
          {trail.kidFeatures.playground && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              🛝 Playground
            </span>
          )}
          {trail.kidFeatures.waterFountain && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              💧 Water
            </span>
          )}
          {trail.kidFeatures.picnicArea && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
              🧺 Picnic
            </span>
          )}
        </div>
      </div>

    </div>
  )
}

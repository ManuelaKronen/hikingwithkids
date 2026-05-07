import { useNavigate } from 'react-router-dom'
import { Trail } from '../../types/trail'
import { formatDistanceFromUser } from '../../utils/geo'

interface Props {
  trail: Trail
  distanceFromUser?: number
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
}

export default function TrailCard({ trail, distanceFromUser }: Props) {
  const navigate = useNavigate()

  return (
    <div
      className="flex items-stretch bg-[#EFF7F3] rounded-2xl shadow-sm overflow-hidden active:opacity-80 cursor-pointer"
      onClick={() => navigate(`/trail/${trail.id}`)}
    >
      {/* Photo thumbnail */}
      <div className="w-20 shrink-0 bg-gradient-to-br from-[#C8DDD4] to-[#8DB89E] flex items-center justify-center">
        {trail.photos[0]
          ? <img src={trail.photos[0]} alt={trail.name} className="w-full h-full object-cover" />
          : <span className="text-3xl">📷</span>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 p-3">
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
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-kid text-kid-text">
            {DIFFICULTY_LABEL[trail.difficulty] ?? trail.difficulty}
          </span>
          {trail.kidFeatures.minRecommendedAge && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-kid text-kid-text">
              👶 {trail.kidFeatures.minRecommendedAge}+
            </span>
          )}
          {trail.kidFeatures.strollerFriendly && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-kid text-kid-text">🚼 Stroller</span>
          )}
          {trail.kidFeatures.playground && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-kid text-kid-text">🛝 Playground</span>
          )}
          {trail.kidFeatures.waterFountain && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-kid text-kid-text">💧 Water</span>
          )}
          {trail.kidFeatures.picnicArea && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-kid text-kid-text">🧺 Picnic</span>
          )}
        </div>
      </div>
    </div>
  )
}

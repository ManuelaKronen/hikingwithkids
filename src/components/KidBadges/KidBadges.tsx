import { KidFeature } from '../../types/trail'

interface Props {
  features: KidFeature
  size?: 'sm' | 'md'
}

const BASE = 'inline-flex items-center gap-1 rounded-full font-medium'
const SM = 'text-[11px] px-2 py-0.5'
const MD = 'text-xs px-2.5 py-1'

export default function KidBadges({ features, size = 'sm' }: Props) {
  const cls = `${BASE} ${size === 'sm' ? SM : MD}`
  const badges: { show: boolean; emoji: string; label: string; style: string }[] = [
    {
      show: features.strollerFriendly,
      emoji: '🚼',
      label: 'Stroller',
      style: 'bg-primary-mid text-teal-800',
    },
    {
      show: features.playground,
      emoji: '🛝',
      label: 'Playground',
      style: 'bg-purple-100 text-purple-800',
    },
    {
      show: features.waterFountain,
      emoji: '💧',
      label: 'Water',
      style: 'bg-blue-100 text-blue-800',
    },
    {
      show: features.picnicArea,
      emoji: '🧺',
      label: 'Picnic',
      style: 'bg-yellow-100 text-yellow-800',
    },
    {
      show: !!features.minRecommendedAge,
      emoji: '👶',
      label: `${features.minRecommendedAge}+ yrs`,
      style: 'bg-age text-age-text',
    },
  ]

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges
        .filter((b) => b.show)
        .map((b) => (
          <span key={b.label} className={`${cls} ${b.style}`}>
            {b.emoji} {b.label}
          </span>
        ))}
    </div>
  )
}

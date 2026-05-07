import { FilterType } from '../../store/useAppStore'

interface Props {
  activeFilters: FilterType[]
  onToggleFilter: (filter: FilterType) => void
}

const allTags: { id: FilterType; label: string; size: 'md' | 'sm' }[] = [
  { id: 'easy',       label: '🟢 Easy',       size: 'md' },
  { id: 'moderate',   label: '🟡 Moderate',   size: 'md' },
  { id: 'hard',       label: '🔴 Hard',       size: 'md' },
  { id: 'stroller',   label: '🚼 Stroller',   size: 'sm' },
  { id: 'playground', label: '🛝 Playground', size: 'sm' },
  { id: 'water',      label: '💧 Water',      size: 'sm' },
  { id: 'picnic',     label: '🧺 Picnic',     size: 'sm' },
]

const difficultyIds = new Set(['easy', 'moderate', 'hard'])

export default function FilterChips({ activeFilters, onToggleFilter }: Props) {
  const difficulty = allTags.filter((t) => difficultyIds.has(t.id))
  const kids = allTags.filter((t) => !difficultyIds.has(t.id))

  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex gap-1.5">
        {difficulty.map(({ id, label, size }) => (
          <Chip key={id} id={id} label={label} size={size} activeFilters={activeFilters} onToggleFilter={onToggleFilter} />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {kids.map(({ id, label, size }) => (
          <Chip key={id} id={id} label={label} size={size} activeFilters={activeFilters} onToggleFilter={onToggleFilter} />
        ))}
      </div>
    </div>
  )
}

function Chip({ id, label, size, activeFilters, onToggleFilter }: {
  id: FilterType
  label: string
  size: 'md' | 'sm'
  activeFilters: FilterType[]
  onToggleFilter: (f: FilterType) => void
}) {
  const isActive = activeFilters.includes(id)
  return (
    <button
      onClick={() => onToggleFilter(id)}
      className={`rounded-full border transition-all ${
        size === 'md' ? 'text-sm px-3 py-1.5' : 'text-[11px] px-2.5 py-1'
      } ${
        isActive
          ? 'bg-[#C4975A] text-[#3A1F08] border-transparent font-semibold shadow-sm'
          : 'bg-[#E2CEAE] text-[#5A3A1A] border-[#C8A878] font-medium'
      }`}
    >
      {label}
    </button>
  )
}

import { FilterType } from '../../store/useAppStore'

interface Props {
  activeFilters: FilterType[]
  onToggleFilter: (filter: FilterType) => void
}

const difficultyTags: { id: FilterType; label: string; activeClass: string }[] = [
  { id: 'easy',     label: '🟢 Easy',     activeClass: 'bg-easy text-easy-text'         },
  { id: 'moderate', label: '🟡 Moderate', activeClass: 'bg-moderate text-moderate-text' },
  { id: 'hard',     label: '🔴 Hard',     activeClass: 'bg-red-100 text-red-800'         },
]

const kidTags: { id: FilterType; label: string; activeClass: string }[] = [
  { id: 'stroller',   label: '🚼 Stroller',   activeClass: 'bg-primary-mid text-teal-800'  },
  { id: 'playground', label: '🛝 Playground', activeClass: 'bg-purple-100 text-purple-800' },
  { id: 'water',      label: '💧 Water',      activeClass: 'bg-blue-100 text-blue-800'     },
  { id: 'picnic',     label: '🧺 Picnic',     activeClass: 'bg-yellow-100 text-yellow-800' },
]

function Tag({
  id,
  label,
  activeClass,
  size,
  activeFilters,
  onToggleFilter,
}: {
  id: FilterType
  label: string
  activeClass: string
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
          ? `${activeClass} border-transparent font-semibold shadow-sm`
          : 'bg-white border-gray-200 text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  )
}

export default function FilterChips({ activeFilters, onToggleFilter }: Props) {
  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex gap-1.5">
        {difficultyTags.map((t) => (
          <Tag key={t.id} {...t} size="md" activeFilters={activeFilters} onToggleFilter={onToggleFilter} />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {kidTags.map((t) => (
          <Tag key={t.id} {...t} size="sm" activeFilters={activeFilters} onToggleFilter={onToggleFilter} />
        ))}
      </div>
    </div>
  )
}

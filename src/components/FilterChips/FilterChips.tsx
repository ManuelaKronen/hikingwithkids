import { FilterType } from '../../store/useAppStore'

interface Props {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'easy', label: 'Easy' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'stroller', label: '🚼 Stroller' },
  { id: 'dog', label: '🐕 Dogs' },
]

export default function FilterChips({ activeFilter, onFilterChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 mt-3 scrollbar-none">
      {filters.map(({ id, label }) => {
        const isActive = activeFilter === id
        return (
          <button
            key={id}
            onClick={() => onFilterChange(id)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              isActive
                ? 'bg-primary-light border-primary text-primary'
                : 'bg-white border-gray-200 text-gray-600'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

import { FilterType } from '../../store/useAppStore'

interface Props {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

const tags: { id: FilterType; label: string; activeClass: string; size: 'md' | 'sm' }[] = [
  { id: 'easy',       label: '🟢 Easy',       activeClass: 'bg-easy text-easy-text',         size: 'md' },
  { id: 'moderate',   label: '🟡 Moderate',   activeClass: 'bg-moderate text-moderate-text', size: 'md' },
  { id: 'hard',       label: '🔴 Hard',       activeClass: 'bg-red-100 text-red-800',         size: 'md' },
  { id: 'stroller',   label: '🚼 Stroller',   activeClass: 'bg-primary-mid text-teal-800',    size: 'sm' },
  { id: 'playground', label: '🛝 Playground', activeClass: 'bg-purple-100 text-purple-800',   size: 'sm' },
  { id: 'water',      label: '💧 Water',      activeClass: 'bg-blue-100 text-blue-800',       size: 'sm' },
  { id: 'picnic',     label: '🧺 Picnic',     activeClass: 'bg-yellow-100 text-yellow-800',   size: 'sm' },
]

export default function FilterChips({ activeFilter, onFilterChange }: Props) {
  const handleClick = (id: FilterType) =>
    onFilterChange(activeFilter === id ? 'all' : id)

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {tags.map(({ id, label, activeClass, size }) => {
        const isActive = activeFilter === id
        return (
          <button
            key={id}
            onClick={() => handleClick(id)}
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
      })}
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trail } from '../../types/trail'

interface Props {
  selectedTrail: Trail | null
  onClear: () => void
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Fácil',
  moderate: 'Moderado',
  hard: 'Difícil',
}

const DIFFICULTY_CLASSES: Record<string, string> = {
  easy: 'bg-easy text-easy-text',
  moderate: 'bg-moderate text-moderate-text',
  hard: 'bg-red-100 text-red-800',
}

export default function BottomSheet({ selectedTrail, onClear }: Props) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const height = expanded ? '55vh' : '112px'

  return (
    <div
      className="shrink-0 bg-white overflow-hidden"
      style={{
        height,
        transition: 'height 0.3s cubic-bezier(0.4,0,0.2,1)',
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.10)',
      }}
    >
      {/* Drag handle */}
      <div
        className="flex justify-center pt-2.5 pb-2 cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="w-8 h-1 bg-gray-300 rounded-full" />
      </div>

      {selectedTrail ? (
        <div className="px-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-[15px] leading-tight flex-1">
              {selectedTrail.name}
            </h3>
            <button onClick={onClear} className="text-gray-400 text-lg leading-none">
              ×
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_CLASSES[selectedTrail.difficulty]}`}
            >
              {DIFFICULTY_LABEL[selectedTrail.difficulty]}
            </span>
            <span className="text-xs text-gray-500">
              {selectedTrail.distanceKm} km · {selectedTrail.estimatedMinutes} min
            </span>
          </div>
          <button
            onClick={() => navigate(`/trail/${selectedTrail.id}`)}
            className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold"
          >
            Ver detalles de la ruta
          </button>
        </div>
      ) : (
        <div className="px-4">
          <div className="flex gap-5 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#3B6D11' }} />
              <span className="text-xs text-gray-600">Fácil / Carrito</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#854F0B' }} />
              <span className="text-xs text-gray-600">Moderado</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">Toca un marcador para ver los detalles</p>
        </div>
      )}
    </div>
  )
}

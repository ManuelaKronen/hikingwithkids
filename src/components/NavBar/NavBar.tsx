import { NavLink, useNavigate, useMatch } from 'react-router-dom'
import { Compass, Info, Map } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export default function NavBar() {
  const selectedTrail = useAppStore((s) => s.selectedTrail)
  const navigate = useNavigate()
  const onDetailPage = useMatch('/trail/:id')

  return (
    <nav
      className="md:hidden shrink-0 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
              isActive ? 'text-primary' : 'text-gray-400'
            }`
          }
        >
          <Compass size={22} strokeWidth={1.8} />
          <span>Explore</span>
        </NavLink>

        <button
          onClick={() => selectedTrail && navigate(`/trail/${selectedTrail.id}`)}
          className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
            onDetailPage ? 'text-primary' : selectedTrail ? 'text-gray-400' : 'text-gray-200'
          }`}
        >
          <Info size={22} strokeWidth={1.8} />
          <span>Details</span>
        </button>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
              isActive ? 'text-primary' : 'text-gray-400'
            }`
          }
        >
          <Map size={22} strokeWidth={1.8} />
          <span>Map</span>
        </NavLink>
      </div>
    </nav>
  )
}

import { NavLink } from 'react-router-dom'
import { Compass, Map, Bookmark, User } from 'lucide-react'

const navItems = [
  { icon: Compass, label: 'Explorar', path: '/' },
  { icon: Map, label: 'Mapa', path: '/map' },
  { icon: Bookmark, label: 'Guardadas', path: '/saved' },
  { icon: User, label: 'Perfil', path: '/profile' },
]

export default function NavBar() {
  return (
    <nav
      className="md:hidden shrink-0 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-label-tertiary'
              }`
            }
          >
            <Icon size={22} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

import { NavLink } from 'react-router-dom'

export default function NavBar() {
  const cls = ({ isActive }: { isActive: boolean }) =>
    `flex-1 py-2.5 text-center text-sm font-semibold rounded-xl transition-colors ${
      isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
    }`

  return (
    <nav
      className="md:hidden shrink-0 bg-white border-t border-gray-100 px-3 py-2"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex gap-2">
        <NavLink to="/" end className={cls}>Explore</NavLink>
        <NavLink to="/map" className={cls}>Map</NavLink>
      </div>
    </nav>
  )
}

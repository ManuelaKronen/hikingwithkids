import { NavLink, BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import DesktopMap from './components/DesktopMap/DesktopMap'
import Explore from './pages/Explore'
import MapViewPage from './pages/MapView'
import TrailDetail from './pages/TrailDetail'
import Saved from './pages/Saved'
import Profile from './pages/Profile'
import { useLocation } from './hooks/useLocation'

function LocationInit() {
  useLocation()
  return null
}

function DesktopTopNav() {
  const cls = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
      isActive ? 'bg-primary-light text-primary' : 'text-gray-500 hover:text-gray-900'
    }`

  return (
    <div className="hidden md:flex items-center gap-1 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
      <span className="text-lg mr-1">🏔</span>
      <span className="font-bold text-gray-900 flex-1">Hiking with Kids</span>
      <NavLink to="/" end className={cls}>
        Explorar
      </NavLink>
      <NavLink to="/saved" className={cls}>
        Guardadas
      </NavLink>
      <NavLink to="/profile" className={cls}>
        Perfil
      </NavLink>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LocationInit />
      <div className="flex" style={{ height: '100dvh' }}>
        {/* Left panel — sidebar on desktop, full width on mobile */}
        <div className="flex flex-col w-full md:w-[400px] md:shrink-0 md:border-r md:border-gray-200 overflow-hidden">
          <DesktopTopNav />
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Explore />} />
              <Route path="/map" element={<MapViewPage />} />
              <Route path="/trail/:id" element={<TrailDetail />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          <NavBar />
        </div>

        {/* Right panel — persistent map, desktop only */}
        <div className="hidden md:flex flex-1">
          <DesktopMap />
        </div>
      </div>
    </BrowserRouter>
  )
}

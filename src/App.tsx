import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import DesktopMap from './components/DesktopMap/DesktopMap'
import Explore from './pages/Explore'
import MapViewPage from './pages/MapView'
import TrailDetail from './pages/TrailDetail'
import { useLocation } from './hooks/useLocation'
import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { fetchTrailsFromLayer } from './utils/featureLayer'

function LocationInit() {
  useLocation()
  return null
}

function TrailsInit() {
  const setTrails = useAppStore((s) => s.setTrails)

  useEffect(() => {
    if (!import.meta.env.VITE_ESRI_FEATURE_LAYER_URL) return
    fetchTrailsFromLayer()
      .then((trails) => { if (trails.length > 0) setTrails(trails) })
      .catch(console.error)
  }, [setTrails])

  return null
}

function DesktopTopNav() {
  return (
    <div className="hidden md:flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
      <span className="font-bold text-gray-900">Hiking with Kids</span>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LocationInit />
      <TrailsInit />
      <div className="flex" style={{ height: '100dvh' }}>
        {/* Left panel — sidebar on desktop, full width on mobile */}
        <div className="flex flex-col w-full md:w-[400px] md:shrink-0 md:border-r md:border-gray-200 overflow-hidden">
          <DesktopTopNav />
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Explore />} />
              <Route path="/map" element={<MapViewPage />} />
              <Route path="/trail/:id" element={<TrailDetail />} />
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

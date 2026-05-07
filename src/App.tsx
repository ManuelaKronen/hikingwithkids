import { BrowserRouter, Routes, Route, useNavigate, useMatch } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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
  const navigate = useNavigate()
  const onDetailPage = useMatch('/trail/:id')

  return (
    <div className="hidden md:flex items-center px-4 py-3 border-b border-[#5A3A1A] bg-[#7A5230] shrink-0">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-full bg-[#F8F0E3] flex items-center justify-center text-base shrink-0">
          🥾
        </div>
        <span className="font-bold text-[#F8F0E3] text-lg uppercase tracking-wide">Hiking with Kids</span>
      </div>
      {onDetailPage && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-[#C4A882] hover:text-[#F8F0E3] transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Back to list
        </button>
      )}
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
        </div>

        {/* Right panel — persistent map, desktop only */}
        <div className="hidden md:flex flex-1">
          <DesktopMap />
        </div>
      </div>
    </BrowserRouter>
  )
}

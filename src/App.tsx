import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import Explore from './pages/Explore'
import MapViewPage from './pages/MapView'
import TrailDetail from './pages/TrailDetail'
import Saved from './pages/Saved'
import Profile from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/map" element={<MapViewPage />} />
        <Route path="/trail/:id" element={<TrailDetail />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <NavBar />
    </BrowserRouter>
  )
}

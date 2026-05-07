import { useState, useEffect } from 'react'

interface GeoLocation {
  lat: number
  lng: number
}

const MADRID_DEFAULT: GeoLocation = { lat: 40.4168, lng: -3.7038 }

export function useLocation() {
  const [location, setLocation] = useState<GeoLocation>(MADRID_DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      () => setLoading(false),
      { timeout: 5000 }
    )
  }, [])

  return { location, loading }
}

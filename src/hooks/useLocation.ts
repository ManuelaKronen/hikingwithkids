import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

const MADRID_DEFAULT = { lat: 40.4168, lng: -3.7038 }

export function useLocation() {
  const setUserLocation = useAppStore((s) => s.setUserLocation)

  useEffect(() => {
    setUserLocation(MADRID_DEFAULT)

    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {},
      { timeout: 5000 }
    )
  }, [setUserLocation])
}

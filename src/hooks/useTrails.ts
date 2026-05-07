import { useAppStore } from '../store/useAppStore'

export function useTrails() {
  const trails = useAppStore((state) => state.filteredTrails)
  const allTrails = useAppStore((state) => state.trails)
  const savedIds = useAppStore((state) => state.savedTrailIds)
  const savedTrails = allTrails.filter((t) => savedIds.includes(t.id))
  return { trails, savedTrails, savedIds }
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Trail, UserProfile, Difficulty } from '../types/trail'
import { mockTrails } from '../data/mockTrails'

export type FilterType = 'easy' | 'moderate' | 'hard' | 'stroller' | 'playground' | 'water' | 'picnic'

const defaultProfile: UserProfile = {
  displayName: 'Lucía',
  locationCity: 'Madrid',
  kids: [
    { name: 'Pablo', age: 4 },
    { name: 'Sofía', age: 7 },
  ],
  preferences: {
    maxDifficulty: 'moderate' as Difficulty,
    strollerOnly: false,
    searchRadiusKm: 15,
  },
  savedTrailIds: [],
  completedTrailIds: [],
}

const initialTrails = import.meta.env.VITE_ESRI_FEATURE_LAYER_URL ? [] : mockTrails

const DIFFICULTY_SET = new Set<FilterType>(['easy', 'moderate', 'hard'])

function applyFilters(trails: Trail[], filters: FilterType[]): Trail[] {
  if (filters.length === 0) return trails
  const diff = filters.filter((f) => DIFFICULTY_SET.has(f))
  const kids = filters.filter((f) => !DIFFICULTY_SET.has(f))
  return trails.filter((t) => {
    const okDiff =
      diff.length === 0 ||
      diff.some((f) =>
        f === 'easy' ? t.difficulty === 'easy' :
        f === 'moderate' ? t.difficulty === 'moderate' :
        t.difficulty === 'hard'
      )
    const okKids = kids.every((f) =>
      f === 'stroller'   ? t.kidFeatures.strollerFriendly :
      f === 'playground' ? t.kidFeatures.playground :
      f === 'water'      ? t.kidFeatures.waterFountain :
      f === 'picnic'     ? t.kidFeatures.picnicArea :
      true
    )
    return okDiff && okKids
  })
}

export interface UserLocation {
  lat: number
  lng: number
}

interface AppState {
  trails: Trail[]
  filteredTrails: Trail[]
  activeFilters: FilterType[]
  userProfile: UserProfile
  selectedTrail: Trail | null
  userLocation: UserLocation | null

  locationFocusCount: number
  requestLocationFocus: () => void
  toggleFilter: (filter: FilterType) => void
  setSelectedTrail: (trail: Trail | null) => void
  setTrails: (trails: Trail[]) => void
  markCompleted: (trailId: string) => void
  setUserLocation: (loc: UserLocation) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      trails: initialTrails,
      filteredTrails: initialTrails,
      activeFilters: [],
      locationFocusCount: 0,
      userProfile: defaultProfile,
      selectedTrail: null,
      userLocation: null,

      requestLocationFocus: () =>
        set((state) => ({ locationFocusCount: state.locationFocusCount + 1 })),

      toggleFilter: (filter) =>
        set((state) => {
          const already = state.activeFilters.includes(filter)
          const next = already
            ? state.activeFilters.filter((f) => f !== filter)
            : [...state.activeFilters, filter]
          return { activeFilters: next, filteredTrails: applyFilters(state.trails, next) }
        }),

      setSelectedTrail: (trail) => set({ selectedTrail: trail }),

      setTrails: (trails) =>
        set((state) => ({
          trails,
          filteredTrails: applyFilters(trails, state.activeFilters),
        })),

      markCompleted: (trailId) =>
        set((state) => {
          if (state.userProfile.completedTrailIds.includes(trailId)) return state
          return {
            userProfile: {
              ...state.userProfile,
              completedTrailIds: [...state.userProfile.completedTrailIds, trailId],
            },
          }
        }),

      setUserLocation: (loc) => set({ userLocation: loc }),
    }),
    {
      name: 'hiking-with-kids-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
      }),
    }
  )
)

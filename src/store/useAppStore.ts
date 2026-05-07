import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Trail, UserProfile, Difficulty } from '../types/trail'
import { mockTrails } from '../data/mockTrails'

export type FilterType = 'all' | 'easy' | 'moderate' | 'stroller' | 'dog'

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

function applyFilter(trails: Trail[], filter: FilterType): Trail[] {
  switch (filter) {
    case 'easy':
      return trails.filter((t) => t.difficulty === 'easy')
    case 'moderate':
      return trails.filter((t) => t.difficulty === 'moderate')
    case 'stroller':
      return trails.filter((t) => t.kidFeatures.strollerFriendly)
    case 'dog':
      return trails.filter((t) => t.kidFeatures.dogFriendly)
    default:
      return trails
  }
}

interface AppState {
  trails: Trail[]
  filteredTrails: Trail[]
  activeFilter: FilterType
  savedTrailIds: string[]
  userProfile: UserProfile
  selectedTrail: Trail | null

  setFilter: (filter: FilterType) => void
  toggleSaved: (trailId: string) => void
  setSelectedTrail: (trail: Trail | null) => void
  setTrails: (trails: Trail[]) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  addKid: (kid: { name: string; age: number }) => void
  markCompleted: (trailId: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      trails: mockTrails,
      filteredTrails: mockTrails,
      activeFilter: 'all',
      savedTrailIds: [],
      userProfile: defaultProfile,
      selectedTrail: null,

      setFilter: (filter) =>
        set((state) => ({
          activeFilter: filter,
          filteredTrails: applyFilter(state.trails, filter),
        })),

      toggleSaved: (trailId) =>
        set((state) => {
          const isSaved = state.savedTrailIds.includes(trailId)
          return {
            savedTrailIds: isSaved
              ? state.savedTrailIds.filter((id) => id !== trailId)
              : [...state.savedTrailIds, trailId],
          }
        }),

      setSelectedTrail: (trail) => set({ selectedTrail: trail }),

      setTrails: (trails) =>
        set((state) => ({
          trails,
          filteredTrails: applyFilter(trails, state.activeFilter),
        })),

      updateProfile: (updates) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...updates },
        })),

      addKid: (kid) =>
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            kids: [...state.userProfile.kids, kid],
          },
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
    }),
    {
      name: 'hiking-with-kids-storage',
      partialize: (state) => ({
        savedTrailIds: state.savedTrailIds,
        userProfile: state.userProfile,
      }),
    }
  )
)

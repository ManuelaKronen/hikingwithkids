export type Difficulty = 'easy' | 'moderate' | 'hard'

export interface KidFeature {
  strollerFriendly: boolean
  playground: boolean
  waterFountain: boolean
  picnicArea: boolean
  dogFriendly: boolean
  minRecommendedAge?: number
}

export interface Trail {
  id: string
  name: string
  location: string
  distanceKm: number
  estimatedMinutes: number
  elevationGainMeters: number
  difficulty: Difficulty
  kidFeatures: KidFeature
  photos: string[]
  description: string
  geometry: {
    type: 'LineString'
    coordinates: [number, number][]
  }
  lat: number
  lng: number
  lastUpdated: string
}

export interface UserProfile {
  displayName: string
  locationCity: string
  kids: { name: string; age: number }[]
  preferences: {
    maxDifficulty: Difficulty
    strollerOnly: boolean
    searchRadiusKm: number
  }
  savedTrailIds: string[]
  completedTrailIds: string[]
}

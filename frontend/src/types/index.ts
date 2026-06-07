export interface User {
  id: number
  username: string
  name: string
}

export type PropertyStatus = 'viewing' | 'favorited' | 'signed'

export interface Property {
  id: number
  userId: number
  address: string
  area: string
  rent: number
  layout: string
  size: number
  photos: string
  landlordName: string
  landlordPhone: string
  status: PropertyStatus
  notes?: string
  createdAt: string
}

export interface ViewingNote {
  id: number
  propertyId: number
  date: string
  lighting: number
  noise: number
  transport: number
  amenities: number
  overallScore: number
  content: string
  createdAt: string
}

export interface Reminder {
  id: number
  userId: number
  propertyId: number
  type: string
  date: string
  note?: string
  active: boolean
  createdAt: string
}

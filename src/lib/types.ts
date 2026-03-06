export type ResourceCategory =
  | 'food'
  | 'health'
  | 'legal'
  | 'housing'
  | 'language'
  | 'education'
  | 'employment'
  | 'clothing'
  | 'hygiene'
  | 'wifi'
  | 'finance'
  | 'children'
  | 'elderly'
  | 'women'
  | 'addiction'
  | 'social'
  | 'admin'
  | 'emergency'
  | 'disability'
  | 'other'

export interface Resource {
  id: string
  name: string
  description: string
  category: ResourceCategory
  tags: string[]
  address: string
  latitude: number
  longitude: number
  phone: string | null
  email: string | null
  website: string | null
  opening_hours: Record<string, string>
  access_conditions: string | null
  target_audience: string | null
  languages_spoken: string[]
  wheelchair_accessible: boolean | null
  source: string | null
  verified: boolean
  featured: boolean
  upvotes: number
  seasonal?: { start_month: number; end_month: number }
  created_at: string
  updated_at: string
}

export interface Suggestion {
  id?: string
  type: 'new' | 'correction' | 'closed'
  resource_id?: string
  name: string
  description?: string
  category?: ResourceCategory
  address?: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  website?: string
  opening_hours?: Record<string, string>
  submitted_by?: string
  status?: 'pending' | 'approved' | 'rejected'
}

export interface Filters {
  categories: ResourceCategory[]
  search: string
  openNow: boolean
  wheelchairAccessible: boolean
  maxDistance: number | null
}

export type ReportReason = 'closed' | 'wrong_info' | 'wrong_location' | 'duplicate' | 'outdated' | 'other'

export interface Report {
  id: string
  resource_id: string
  resource_name: string
  reason: ReportReason
  message: string
  status: 'pending' | 'resolved' | 'dismissed'
  created_at: string
  resolved_at?: string
}

export interface AdminSession {
  authenticated: boolean
  loginTime: string
}

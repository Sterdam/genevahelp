import type { ResourceCategory } from './types'

const SUGGESTIONS_KEY = 'genevemap_suggestions'

export interface ResourceSuggestion {
  id: string
  // Core info
  name: string
  description: string
  category: ResourceCategory | ''
  // Location
  address: string
  // Contact (at least one required)
  phone: string
  email: string
  website: string
  // Details
  opening_hours: string
  target_audience: string
  access_conditions: string
  languages_spoken: string
  wheelchair_accessible: boolean | null
  // Submitter contact (mandatory)
  submitter_contact: string
  submitter_name: string
  submitter_relation: string
  // Meta
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  reviewed_at?: string
  admin_notes?: string
}

function generateId(): string {
  return `sug_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function getSuggestions(): ResourceSuggestion[] {
  try {
    const raw = localStorage.getItem(SUGGESTIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveSuggestions(suggestions: ResourceSuggestion[]): void {
  localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(suggestions))
}

export function addSuggestion(data: Omit<ResourceSuggestion, 'id' | 'status' | 'created_at'>): ResourceSuggestion {
  const suggestion: ResourceSuggestion = {
    ...data,
    id: generateId(),
    status: 'pending',
    created_at: new Date().toISOString(),
  }
  const suggestions = getSuggestions()
  suggestions.unshift(suggestion)
  saveSuggestions(suggestions)
  return suggestion
}

export function approveSuggestion(id: string, notes?: string): void {
  const suggestions = getSuggestions()
  const suggestion = suggestions.find((s) => s.id === id)
  if (suggestion) {
    suggestion.status = 'approved'
    suggestion.reviewed_at = new Date().toISOString()
    if (notes) suggestion.admin_notes = notes
    saveSuggestions(suggestions)
  }
}

export function rejectSuggestion(id: string, notes?: string): void {
  const suggestions = getSuggestions()
  const suggestion = suggestions.find((s) => s.id === id)
  if (suggestion) {
    suggestion.status = 'rejected'
    suggestion.reviewed_at = new Date().toISOString()
    if (notes) suggestion.admin_notes = notes
    saveSuggestions(suggestions)
  }
}

export function deleteSuggestion(id: string): void {
  const suggestions = getSuggestions().filter((s) => s.id !== id)
  saveSuggestions(suggestions)
}

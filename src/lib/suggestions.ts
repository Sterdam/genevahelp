import { supabase } from './supabase'
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

// --- Supabase helpers ---

function toDbRow(data: Omit<ResourceSuggestion, 'id' | 'status' | 'created_at'>) {
  return {
    name: data.name,
    description: data.description || '',
    category: data.category || null,
    address: data.address,
    phone: data.phone || '',
    email: data.email || '',
    website: data.website || '',
    opening_hours: data.opening_hours ? { text: data.opening_hours } : null,
    target_audience: data.target_audience || '',
    access_conditions: data.access_conditions || '',
    languages_spoken: data.languages_spoken || '',
    wheelchair_accessible: data.wheelchair_accessible,
    submitter_contact: data.submitter_contact,
    submitter_name: data.submitter_name || '',
    submitter_relation: data.submitter_relation || '',
    type: 'new',
    status: 'pending',
  }
}

function fromDbRow(row: Record<string, unknown>): ResourceSuggestion {
  const hours = row.opening_hours as Record<string, string> | null
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) || '',
    category: (row.category as ResourceCategory) || '',
    address: (row.address as string) || '',
    phone: (row.phone as string) || '',
    email: (row.email as string) || '',
    website: (row.website as string) || '',
    opening_hours: hours?.text || '',
    target_audience: (row.target_audience as string) || '',
    access_conditions: (row.access_conditions as string) || '',
    languages_spoken: (row.languages_spoken as string) || '',
    wheelchair_accessible: row.wheelchair_accessible as boolean | null,
    submitter_contact: (row.submitter_contact as string) || '',
    submitter_name: (row.submitter_name as string) || '',
    submitter_relation: (row.submitter_relation as string) || '',
    status: (row.status as 'pending' | 'approved' | 'rejected') || 'pending',
    created_at: (row.created_at as string) || new Date().toISOString(),
    reviewed_at: (row.reviewed_at as string) || undefined,
    admin_notes: (row.admin_notes as string) || undefined,
  }
}

// --- localStorage fallback ---

function getLocalSuggestions(): ResourceSuggestion[] {
  try {
    const raw = localStorage.getItem(SUGGESTIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalSuggestions(suggestions: ResourceSuggestion[]): void {
  localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(suggestions))
}

// --- Public API ---

export async function getSuggestions(): Promise<ResourceSuggestion[]> {
  if (!supabase) return getLocalSuggestions()

  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch suggestions:', error)
    return getLocalSuggestions()
  }

  return (data || []).map(fromDbRow)
}

export async function addSuggestion(
  data: Omit<ResourceSuggestion, 'id' | 'status' | 'created_at'>
): Promise<ResourceSuggestion | null> {
  if (!supabase) {
    const suggestion: ResourceSuggestion = {
      ...data,
      id: `sug_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    const suggestions = getLocalSuggestions()
    suggestions.unshift(suggestion)
    saveLocalSuggestions(suggestions)
    return suggestion
  }

  const { data: row, error } = await supabase
    .from('suggestions')
    .insert(toDbRow(data))
    .select()
    .single()

  if (error) {
    console.error('Failed to add suggestion:', error)
    return null
  }

  return fromDbRow(row)
}

export async function approveSuggestion(id: string, notes?: string): Promise<void> {
  if (!supabase) {
    const suggestions = getLocalSuggestions()
    const s = suggestions.find((s) => s.id === id)
    if (s) {
      s.status = 'approved'
      s.reviewed_at = new Date().toISOString()
      if (notes) s.admin_notes = notes
      saveLocalSuggestions(suggestions)
    }
    return
  }

  const update: Record<string, unknown> = {
    status: 'approved',
    reviewed_at: new Date().toISOString(),
  }
  if (notes) update.admin_notes = notes

  const { error } = await supabase.from('suggestions').update(update).eq('id', id)
  if (error) console.error('Failed to approve suggestion:', error)
}

export async function rejectSuggestion(id: string, notes?: string): Promise<void> {
  if (!supabase) {
    const suggestions = getLocalSuggestions()
    const s = suggestions.find((s) => s.id === id)
    if (s) {
      s.status = 'rejected'
      s.reviewed_at = new Date().toISOString()
      if (notes) s.admin_notes = notes
      saveLocalSuggestions(suggestions)
    }
    return
  }

  const update: Record<string, unknown> = {
    status: 'rejected',
    reviewed_at: new Date().toISOString(),
  }
  if (notes) update.admin_notes = notes

  const { error } = await supabase.from('suggestions').update(update).eq('id', id)
  if (error) console.error('Failed to reject suggestion:', error)
}

export async function deleteSuggestion(id: string): Promise<void> {
  if (!supabase) {
    const suggestions = getLocalSuggestions().filter((s) => s.id !== id)
    saveLocalSuggestions(suggestions)
    return
  }

  const { error } = await supabase.from('suggestions').delete().eq('id', id)
  if (error) console.error('Failed to delete suggestion:', error)
}

import type { Resource, ResourceCategory } from './types'
import { DEMO_RESOURCES } from './demo-data'

const HIDDEN_KEY = 'genevemap_hidden'
const DELETED_KEY = 'genevemap_deleted'
const EDITS_KEY = 'genevemap_edits'
const MANUAL_KEY = 'genevemap_manual'

// --- Getters ---

function getSet(key: string): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) || '[]'))
  } catch { return new Set() }
}

function getMap<T>(key: string): Record<string, T> {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch { return {} }
}

export function getHiddenIds(): Set<string> {
  return getSet(HIDDEN_KEY)
}

export function getDeletedIds(): Set<string> {
  return getSet(DELETED_KEY)
}

export function getEdits(): Record<string, Partial<Resource>> {
  return getMap(EDITS_KEY)
}

export function getManualResources(): Resource[] {
  try {
    return JSON.parse(localStorage.getItem(MANUAL_KEY) || '[]')
  } catch { return [] }
}

// --- All resources with admin modifications applied ---

export function getAllAdminResources(): Resource[] {
  const hidden = getHiddenIds()
  const deleted = getDeletedIds()
  const edits = getEdits()
  const manual = getManualResources()

  const base = [...DEMO_RESOURCES, ...manual]
    .filter((r) => !deleted.has(r.id))
    .map((r) => edits[r.id] ? { ...r, ...edits[r.id] } : r)

  return base.map((r) => ({
    ...r,
    _hidden: hidden.has(r.id),
  })) as (Resource & { _hidden?: boolean })[]
}

/** Resources visible to the public (not hidden, not deleted) */
export function getPublicResources(): Resource[] {
  const hidden = getHiddenIds()
  const deleted = getDeletedIds()
  const edits = getEdits()
  const manual = getManualResources()

  return [...DEMO_RESOURCES, ...manual]
    .filter((r) => !deleted.has(r.id) && !hidden.has(r.id))
    .map((r) => edits[r.id] ? { ...r, ...edits[r.id] } : r)
}

// --- Mutations ---

export function toggleHideResource(id: string): void {
  const hidden = getSet(HIDDEN_KEY)
  if (hidden.has(id)) {
    hidden.delete(id)
  } else {
    hidden.add(id)
  }
  localStorage.setItem(HIDDEN_KEY, JSON.stringify([...hidden]))
}

export function deleteResource(id: string): void {
  const deleted = getSet(DELETED_KEY)
  deleted.add(id)
  localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted]))

  // Also remove from manual if it was manual
  const manual = getManualResources().filter((r) => r.id !== id)
  localStorage.setItem(MANUAL_KEY, JSON.stringify(manual))
}

export function editResource(id: string, changes: Partial<Resource>): void {
  const edits = getEdits()
  edits[id] = { ...edits[id], ...changes }
  localStorage.setItem(EDITS_KEY, JSON.stringify(edits))
}

export function addResource(data: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'featured'>): Resource {
  const resource: Resource = {
    ...data,
    id: crypto.randomUUID(),
    upvotes: 0,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  const manual = getManualResources()
  manual.push(resource)
  localStorage.setItem(MANUAL_KEY, JSON.stringify(manual))
  return resource
}

export function restoreResource(id: string): void {
  // Remove from deleted
  const deleted = getSet(DELETED_KEY)
  deleted.delete(id)
  localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted]))
}

export const CATEGORY_OPTIONS: ResourceCategory[] = [
  'food', 'health', 'legal', 'housing', 'language', 'education',
  'employment', 'clothing', 'hygiene', 'wifi', 'finance', 'children',
  'elderly', 'women', 'addiction', 'social', 'admin', 'emergency', 'other',
]

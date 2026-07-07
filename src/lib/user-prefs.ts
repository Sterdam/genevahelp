import type { ResourceCategory } from './types'

const CATEGORIES_KEY = 'genevemap-categories'
const PREFS_EVENT = 'genevemap-prefs-changed'

export function getStoredCategories(): ResourceCategory[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function setStoredCategories(categories: ResourceCategory[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  window.dispatchEvent(new Event(PREFS_EVENT))
}

export function onPrefsChange(callback: () => void): () => void {
  window.addEventListener(PREFS_EVENT, callback)
  return () => window.removeEventListener(PREFS_EVENT, callback)
}

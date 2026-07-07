import { useState, useEffect, useMemo } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getPublicResources } from '../lib/resource-admin'
import { isOpenNow } from '../lib/opening-hours'
import type { Resource, ResourceCategory } from '../lib/types'
import { getDistance } from './useGeolocation'

interface UseResourcesOptions {
  categories?: ResourceCategory[]
  search?: string
  openNow?: boolean
  userLat?: number | null
  userLng?: number | null
}

export function useResources(options: UseResourcesOptions = {}) {
  const { categories = [], search = '', openNow = false, userLat, userLng } = options
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResources() {
      setLoading(true)
      setError(null)

      if (!isSupabaseConfigured) {
        setResources(getPublicResources())
        setLoading(false)
        return
      }

      try {
        const { data, error: fetchError } = await supabase!
          .from('resources')
          .select('*')
          .order('upvotes', { ascending: false })

        if (fetchError) throw fetchError
        setResources(data && data.length > 0 ? data : getPublicResources())
      } catch (err) {
        console.error('Failed to fetch resources:', err)
        setError('Failed to load resources')
        setResources(getPublicResources())
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  const filtered = useMemo(() => {
    let result = resources

    if (categories.length > 0) {
      result = result.filter((r) => categories.includes(r.category))
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.address.toLowerCase().includes(q)
      )
    }

    if (openNow) {
      result = result.filter((r) => isOpenNow(r.opening_hours) === true)
    }

    if (userLat != null && userLng != null) {
      result = result
        .map((r) => ({
          ...r,
          _distance: getDistance(userLat, userLng, r.latitude, r.longitude),
        }))
        .sort((a, b) => a._distance - b._distance)
    }

    return result
  }, [resources, categories, search, openNow, userLat, userLng])

  return { resources: filtered, allResources: resources, loading, error }
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useVisitCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    if (!supabase) return

    const counted = sessionStorage.getItem('genevahelp-counted')

    if (counted) {
      supabase
        .from('site_stats')
        .select('visit_count')
        .eq('id', 'global')
        .single()
        .then(({ data }) => {
          if (data) setCount(data.visit_count)
        })
    } else {
      supabase
        .rpc('increment_visits')
        .then(({ data, error }) => {
          if (!error && data != null) {
            setCount(data as number)
            sessionStorage.setItem('genevahelp-counted', '1')
          }
        })
    }
  }, [])

  return count
}

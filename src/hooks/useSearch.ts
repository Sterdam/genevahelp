import { useState, useCallback, useRef } from 'react'

export function useSearch() {
  const [query, setQuery] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const setSearchQuery = useCallback((value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      setQuery(value)
    }, 300)
  }, [])

  const clearSearch = useCallback(() => {
    setQuery('')
  }, [])

  return { query, setSearchQuery, clearSearch }
}

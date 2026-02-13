import { useState, useCallback } from 'react'
import { MapView } from '../components/map/MapView'
import { ResourceList } from '../components/resources/ResourceList'
import { ResourceDetail } from '../components/resources/ResourceDetail'
import { SearchBar } from '../components/filters/SearchBar'
import { CategoryFilter } from '../components/filters/CategoryFilter'
import { useResources } from '../hooks/useResources'
import { useGeolocation } from '../hooks/useGeolocation'
import { useSearch } from '../hooks/useSearch'
import type { Resource, ResourceCategory } from '../lib/types'

interface HomePageProps {
  mobileView: 'map' | 'list'
}

export function HomePage({ mobileView }: HomePageProps) {
  const [categories, setCategories] = useState<ResourceCategory[]>([])
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { query, setSearchQuery } = useSearch()
  const { latitude, longitude } = useGeolocation()

  const { resources, loading } = useResources({
    categories,
    search: query,
    userLat: latitude,
    userLng: longitude,
  })

  const handleSelectResource = useCallback((resource: Resource) => {
    setSelectedId(resource.id)
    setSelectedResource(resource)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedResource(null)
    setSelectedId(null)
  }, [])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Search & Filters */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 space-y-2.5 z-20 relative">
        <SearchBar onSearch={setSearchQuery} />
        <div className="flex items-center gap-2">
          <CategoryFilter selected={categories} onChange={setCategories} />
        </div>
        {/* Results count */}
        {!loading && (
          <p className="text-xs text-gray-400">
            {resources.length} {resources.length > 1 ? 'ressources' : 'ressource'}
            {categories.length > 0 && ` (${categories.length} filtre${categories.length > 1 ? 's' : ''})`}
          </p>
        )}
      </div>

      {/* Desktop: Split View */}
      <div className="flex-1 hidden sm:flex overflow-hidden">
        <div className="w-[380px] border-r border-gray-200 overflow-y-auto bg-gray-50 shrink-0">
          <ResourceList
            resources={resources}
            selectedId={selectedId}
            onSelectResource={handleSelectResource}
            loading={loading}
          />
        </div>
        <div className="flex-1 relative">
          <MapView
            resources={resources}
            selectedId={selectedId}
            onSelectResource={handleSelectResource}
            userLat={latitude}
            userLng={longitude}
          />
        </div>
      </div>

      {/* Mobile: Toggle Map/List */}
      <div className="flex-1 sm:hidden overflow-hidden relative">
        {mobileView === 'map' ? (
          <MapView
            resources={resources}
            selectedId={selectedId}
            onSelectResource={handleSelectResource}
            userLat={latitude}
            userLng={longitude}
          />
        ) : (
          <div className="h-full overflow-y-auto bg-gray-50 pb-16">
            <ResourceList
              resources={resources}
              selectedId={selectedId}
              onSelectResource={handleSelectResource}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* Resource Detail */}
      <ResourceDetail resource={selectedResource} onClose={handleCloseDetail} />
    </div>
  )
}

import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Siren } from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'
import { canonicalUrl } from '../lib/seo-utils'
import { MapView } from '../components/map/MapView'
import { ResourceList } from '../components/resources/ResourceList'
import { ResourceDetail } from '../components/resources/ResourceDetail'
import { SearchBar } from '../components/filters/SearchBar'
import { CategoryFilter } from '../components/filters/CategoryFilter'
import { useResources } from '../hooks/useResources'
import { useGeolocation } from '../hooks/useGeolocation'
import { useSearch } from '../hooks/useSearch'
import { useVisitCounter } from '../hooks/useVisitCounter'
import { useTranslatedResources, useTranslatedResource } from '../hooks/useTranslatedResource'
import { useTranslation } from 'react-i18next'
import type { Resource, ResourceCategory } from '../lib/types'

interface HomePageProps {
  mobileView: 'map' | 'list'
}

export function HomePage({ mobileView }: HomePageProps) {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<ResourceCategory[]>([])
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { query, setSearchQuery } = useSearch()
  const { latitude, longitude } = useGeolocation()
  const visitCount = useVisitCounter()

  const { resources, allResources, loading } = useResources({
    categories,
    search: query,
    userLat: latitude,
    userLng: longitude,
  })

  const translatedResources = useTranslatedResources(resources)
  const translatedSelected = useTranslatedResource(selectedResource)

  const handleSelectResource = useCallback((resource: Resource) => {
    setSelectedId(resource.id)
    setSelectedResource(resource)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedResource(null)
    setSelectedId(null)
  }, [])

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ResourceCategory, number>> = {}
    for (const r of allResources) {
      counts[r.category] = (counts[r.category] || 0) + 1
    }
    return counts as Record<ResourceCategory, number>
  }, [allResources])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <SEOHead
        title="GenevaHelp — Free Resources in Geneva | Interactive Map"
        description="Interactive map of all free resources in Geneva: food aid, health, housing, legal help, language courses and more. 178 verified resources in 32 languages."
        canonical={canonicalUrl('/')}
      />
      {/* Search & Filters */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 space-y-2.5 z-20 relative">
        <SearchBar onSearch={setSearchQuery} />
        <div className="flex items-center gap-2">
          <CategoryFilter selected={categories} onChange={setCategories} counts={categoryCounts} />
          <Link
            to="/emergency"
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Siren size={13} />
            {t('categories.emergency')}
          </Link>
        </div>
        {/* Results count */}
        {!loading && (
          <p className="text-xs text-gray-400 flex items-center gap-2">
            <span>
              {t('search.resultsCount', { count: resources.length })}
              {categories.length > 0 && ` (${t('filters.activeCount', { count: categories.length })})`}
            </span>
            {visitCount != null && (
              <span className="inline-flex items-center gap-1 text-gray-300">
                · <Eye size={10} /> {visitCount.toLocaleString()}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Desktop: Split View */}
      <div className="flex-1 hidden sm:flex overflow-hidden">
        <div className="w-[380px] border-r border-gray-200 overflow-y-auto bg-gray-50 shrink-0">
          <ResourceList
            resources={translatedResources}
            selectedId={selectedId}
            onSelectResource={handleSelectResource}
            loading={loading}
          />
        </div>
        <div className="flex-1 relative">
          <MapView
            resources={translatedResources}
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
            resources={translatedResources}
            selectedId={selectedId}
            onSelectResource={handleSelectResource}
            userLat={latitude}
            userLng={longitude}
          />
        ) : (
          <div className="h-full overflow-y-auto bg-gray-50 pb-16">
            <ResourceList
              resources={translatedResources}
              selectedId={selectedId}
              onSelectResource={handleSelectResource}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* Resource Detail */}
      <ResourceDetail resource={translatedSelected} onClose={handleCloseDetail} />

    </div>
  )
}

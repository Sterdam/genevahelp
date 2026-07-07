import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Clock, Eye, Siren } from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'
import { canonicalUrl } from '../lib/seo-utils'
import { MapView } from '../components/map/MapView'
import { ResourceList } from '../components/resources/ResourceList'
import { ResourceDetail } from '../components/resources/ResourceDetail'
import { SearchBar } from '../components/filters/SearchBar'
import { CategoryFilter } from '../components/filters/CategoryFilter'
import { CategorySheet } from '../components/filters/CategorySheet'
import { CATEGORY_CONFIG, CATEGORY_EMOJI } from '../lib/constants'
import { getStoredCategories, setStoredCategories, onPrefsChange } from '../lib/user-prefs'
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
  const [categories, setCategories] = useState<ResourceCategory[]>(getStoredCategories)
  const [openNow, setOpenNow] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Stay in sync with choices made elsewhere (welcome modal)
  useEffect(() => onPrefsChange(() => setCategories(getStoredCategories())), [])

  const updateCategories = useCallback((next: ResourceCategory[]) => {
    setCategories(next)
    setStoredCategories(next)
  }, [])
  const { query, setSearchQuery } = useSearch()
  const { latitude, longitude } = useGeolocation()
  const visitCount = useVisitCounter()

  const { resources, allResources, loading } = useResources({
    categories,
    search: query,
    openNow,
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
        description="Interactive map of all free resources in Geneva: food aid, health, housing, legal help, language courses and more. 255 verified resources in 32 languages."
        canonical={canonicalUrl('/')}
      />
      {/* Search & Filters */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 space-y-2.5 z-20 relative">
        <SearchBar onSearch={setSearchQuery} />
        <div className="flex items-center gap-2">
          {/* Mobile: big category button opening the grid sheet */}
          <button
            onClick={() => setSheetOpen(true)}
            className={`sm:hidden flex-1 min-w-0 flex items-center justify-between gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              categories.length === 1
                ? 'text-white'
                : 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            style={
              categories.length === 1
                ? {
                    backgroundColor: CATEGORY_CONFIG[categories[0]].color,
                    borderColor: CATEGORY_CONFIG[categories[0]].color,
                  }
                : undefined
            }
          >
            <span className="truncate flex items-center gap-1.5">
              {categories.length === 1 ? (
                <>
                  <span>{CATEGORY_EMOJI[categories[0]]}</span>
                  {t(`categories.${categories[0]}`)}
                </>
              ) : categories.length > 1 ? (
                `${t('filters.categories')} (${categories.length})`
              ) : (
                t('filters.categories')
              )}
            </span>
            <ChevronDown size={14} className="shrink-0 opacity-60" />
          </button>

          {/* Desktop: scrollable pills */}
          <div className="hidden sm:block min-w-0 flex-1">
            <CategoryFilter selected={categories} onChange={updateCategories} counts={categoryCounts} />
          </div>

          <button
            onClick={() => setOpenNow((v) => !v)}
            aria-pressed={openNow}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              openNow
                ? 'text-white bg-green-600 border-green-600'
                : 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
            }`}
          >
            <Clock size={13} />
            {t('filters.openNow')}
          </button>
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

      {/* Mobile category sheet */}
      <CategorySheet
        open={sheetOpen}
        selected={categories}
        counts={categoryCounts}
        onChange={updateCategories}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  )
}

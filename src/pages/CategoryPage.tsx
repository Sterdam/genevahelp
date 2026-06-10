import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'
import { ResourceCard } from '../components/resources/ResourceCard'
import { canonicalUrl } from '../lib/seo-utils'
import { buildCategoryJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from '../lib/json-ld'
import { CATEGORY_CONFIG, CATEGORY_EMOJI } from '../lib/constants'
import { CATEGORY_SEO } from '../lib/category-seo'
import { useResources } from '../hooks/useResources'
import { useTranslatedResources } from '../hooks/useTranslatedResource'
import type { ResourceCategory } from '../lib/types'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const category = slug as ResourceCategory
  const config = CATEGORY_CONFIG[category]
  const seo = CATEGORY_SEO[category]
  const { allResources, loading } = useResources()

  const categoryResources = useMemo(
    () => allResources.filter((r) => r.category === category),
    [allResources, category],
  )
  const translated = useTranslatedResources(categoryResources)

  if (!config || !seo) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-900 mb-2">Category not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            {t('common.backToMap')}
          </Link>
        </div>
      </div>
    )
  }

  const emoji = CATEGORY_EMOJI[category]
  const url = canonicalUrl(`/category/${category}`)

  const jsonLd = [
    buildCategoryJsonLd(category, seo.titleEn, categoryResources),
    buildBreadcrumbJsonLd([
      { name: 'GenevaHelp', url: canonicalUrl('/') },
      { name: seo.titleEn, url },
    ]),
    ...(seo.faqs ? [buildFaqJsonLd(seo.faqs)] : []),
  ]

  const handleSelect = () => {}

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 animate-fade-in">
      <SEOHead
        title={`Free ${seo.titleEn} in Geneva — ${categoryResources.length} Resources | GenevaHelp`}
        description={seo.descriptionEn}
        canonical={url}
        jsonLd={jsonLd}
      />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Back */}
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-4 transition-colors">
          <ArrowLeft size={14} />
          {t('common.backToMap')}
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${config.color}15` }}
            >
              {emoji}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {t(`categories.${category}`)}
              </h1>
              <p className="text-sm text-gray-500">
                {categoryResources.length} {t('search.resultsCount', { count: categoryResources.length }).replace(/^\d+ /, '')}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {seo.descriptionFr}
          </p>
        </div>

        {/* Resource list */}
        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">{t('common.loading')}</div>
        ) : (
          <div className="space-y-2 mb-8">
            {translated.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isSelected={false}
                onClick={handleSelect}
              />
            ))}
          </div>
        )}

        {/* FAQ section */}
        {seo.faqs && seo.faqs.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">FAQ</h2>
            <div className="space-y-4">
              {seo.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{faq.question}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

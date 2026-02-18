import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Mail,
  Clock,
  Navigation,
  ExternalLink,
  CheckCircle,
  Users,
  Info,
  Accessibility,
  Tag,
  Share2,
  Map,
} from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'
import { Badge } from '../components/ui/Badge'
import { ReportButton } from '../components/resources/ReportButton'
import { findResourceBySlug, resourceSlug, canonicalUrl } from '../lib/seo-utils'
import { buildResourceJsonLd, buildBreadcrumbJsonLd } from '../lib/json-ld'
import { CATEGORY_CONFIG } from '../lib/constants'
import { useResources } from '../hooks/useResources'
import { useTranslatedResource } from '../hooks/useTranslatedResource'

const DAY_ORDER = [
  { key: 'monday', aliases: ['monday', 'lundi'] },
  { key: 'tuesday', aliases: ['tuesday', 'mardi'] },
  { key: 'wednesday', aliases: ['wednesday', 'mercredi'] },
  { key: 'thursday', aliases: ['thursday', 'jeudi'] },
  { key: 'friday', aliases: ['friday', 'vendredi'] },
  { key: 'saturday', aliases: ['saturday', 'samedi'] },
  { key: 'sunday', aliases: ['sunday', 'dimanche'] },
]

export function ResourcePage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const { allResources, loading } = useResources()

  const resource = useMemo(
    () => (slug ? findResourceBySlug(allResources, slug) : null),
    [allResources, slug],
  )
  const translated = useTranslatedResource(resource)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 text-sm">{t('common.loading')}</div>
      </div>
    )
  }

  if (!resource || !translated) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-900 mb-2">{t('resource.notFound')}</h1>
          <p className="text-sm text-gray-500 mb-4">{t('resource.notFoundText')}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            {t('common.backToMap')}
          </Link>
        </div>
      </div>
    )
  }

  const config = CATEGORY_CONFIG[resource.category]
  const Icon = config.icon
  const url = canonicalUrl(`/resource/${resourceSlug(resource)}`)
  const hasHours = resource.opening_hours && Object.keys(resource.opening_hours).length > 0
  const hasContact = resource.phone || resource.email || resource.website

  const seoTitle = `${resource.name} — Free ${t(`categories.${resource.category}`)} in Geneva | GenevaHelp`
  const seoDesc = translated.description.slice(0, 155)

  const jsonLd = useMemo(() => [
    buildResourceJsonLd(resource),
    buildBreadcrumbJsonLd([
      { name: 'GenevaHelp', url: canonicalUrl('/') },
      { name: t(`categories.${resource.category}`), url: canonicalUrl(`/category/${resource.category}`) },
      { name: resource.name, url },
    ]),
  ], [resource, url, t])

  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${resource.latitude},${resource.longitude}`,
      '_blank',
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: resource.name, text: translated.description, url })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 animate-fade-in">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonical={url}
        ogType="place"
        jsonLd={jsonLd}
      />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
        {/* Back + Share */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
            <ArrowLeft size={14} />
            {t('common.backToMap')}
          </Link>
          <button
            onClick={handleShare}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            <Share2 size={14} />
            {t('resource.share')}
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${config.color}15` }}
            >
              <Icon size={28} style={{ color: config.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                {resource.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge color={config.color}>{t(`categories.${resource.category}`)}</Badge>
                {resource.verified && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle size={12} />
                    {t('resource.verified')}
                  </Badge>
                )}
                <Badge className="bg-emerald-100 text-emerald-700">
                  {t('resource.free')}
                </Badge>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mt-4">
            {translated.description}
          </p>
        </div>

        {/* Target audience */}
        {(resource.target_audience || resource.access_conditions) && (
          <div className="rounded-xl overflow-hidden mb-4" style={{ backgroundColor: `${config.color}08` }}>
            <div
              className="px-4 py-2.5 flex items-center gap-2"
              style={{ backgroundColor: `${config.color}15` }}
            >
              <Users size={15} style={{ color: config.color }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: config.color }}>
                {t('resource.forWhom')}
              </span>
            </div>
            <div className="px-4 py-3 space-y-2">
              {translated.target_audience && (
                <p className="text-sm text-gray-800 font-medium">{translated.target_audience}</p>
              )}
              {translated.access_conditions && (
                <p className="text-sm text-gray-600">{translated.access_conditions}</p>
              )}
            </div>
          </div>
        )}

        {/* Contact & Location */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <MapPin size={14} className="text-gray-400" />
            {t('resource.contact')}
          </h2>

          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-900">{resource.address}</p>
              <button
                onClick={openDirections}
                className="text-xs text-blue-600 hover:text-blue-700 mt-0.5 inline-flex items-center gap-1"
              >
                <Navigation size={11} />
                {t('resource.directions')}
              </button>
            </div>
          </div>

          {resource.phone && (
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-400 shrink-0" />
              <a href={`tel:${resource.phone}`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                {resource.phone}
              </a>
            </div>
          )}

          {resource.email && (
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <a href={`mailto:${resource.email}`} className="text-sm text-blue-600 hover:text-blue-700 truncate">
                {resource.email}
              </a>
            </div>
          )}

          {resource.website && (
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-gray-400 shrink-0" />
              <a
                href={resource.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 truncate"
              >
                {resource.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                <ExternalLink size={11} className="shrink-0" />
              </a>
            </div>
          )}

          {!hasContact && (
            <p className="text-xs text-gray-400 italic">{t('adminExtra.noContact')}</p>
          )}
        </div>

        {/* Opening Hours */}
        {hasHours && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              {t('resource.hours')}
            </h2>
            {DAY_ORDER.map(({ key, aliases }) => {
              const hours = aliases.reduce<string | undefined>(
                (found, alias) => found || resource.opening_hours[alias],
                undefined,
              )
              if (!hours) return null
              return (
                <div key={key} className="flex justify-between gap-4 text-sm py-0.5">
                  <span className="font-medium text-gray-500">{t(`days.${key}`)}</span>
                  <span className="text-gray-900 font-medium">{hours}</span>
                </div>
              )
            })}
            {resource.opening_hours.notes && (
              <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-100 pt-2">
                {resource.opening_hours.notes}
              </p>
            )}
          </div>
        )}

        {/* Practical Info */}
        {(resource.wheelchair_accessible != null ||
          (resource.languages_spoken?.length > 0) ||
          (resource.tags?.length > 0)) && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Info size={14} className="text-gray-400" />
              {t('resource.practicalInfo')}
            </h2>

            {resource.wheelchair_accessible != null && (
              <div className="flex items-center gap-2.5">
                <Accessibility size={16} className={resource.wheelchair_accessible ? 'text-green-500' : 'text-gray-400'} />
                <span className={`text-sm ${resource.wheelchair_accessible ? 'text-green-700' : 'text-gray-500'}`}>
                  {resource.wheelchair_accessible ? t('resource.wheelchairYes') : t('resource.wheelchairNo')}
                </span>
              </div>
            )}

            {resource.languages_spoken?.length > 0 && (
              <div className="flex items-center gap-2.5">
                <Globe size={16} className="text-gray-400 shrink-0" />
                <div className="flex gap-1.5 flex-wrap">
                  {resource.languages_spoken.map((lang) => (
                    <span key={lang} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md uppercase font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {translated.tags?.length > 0 && (
              <div className="flex items-start gap-2.5">
                <Tag size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <div className="flex gap-1.5 flex-wrap">
                  {translated.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Source */}
        {resource.source && (
          <p className="text-xs text-gray-400 mb-4">
            {t('resource.source')}: {resource.source}
          </p>
        )}

        {/* Report */}
        <div className="mb-4">
          <ReportButton resourceId={resource.id} resourceName={resource.name} />
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-30 safe-area-bottom">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Link
            to="/"
            className="py-2.5 px-4 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Map size={16} />
            {t('common.backToMap')}
          </Link>
          <button
            onClick={openDirections}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Navigation size={16} />
            {t('resource.directions')}
          </button>
          {resource.phone && (
            <a
              href={`tel:${resource.phone}`}
              className="py-2.5 px-4 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

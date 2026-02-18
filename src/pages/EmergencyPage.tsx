import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  Phone,
  Siren,
  Home,
  UtensilsCrossed,
  Heart,
  Shield,
} from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'
import { canonicalUrl } from '../lib/seo-utils'
import { buildBreadcrumbJsonLd } from '../lib/json-ld'
import { useResources } from '../hooks/useResources'
import { useTranslatedResources } from '../hooks/useTranslatedResource'
import { resourceSlug } from '../lib/seo-utils'

const EMERGENCY_NUMBERS = [
  { label: 'Police', number: '117', icon: Shield },
  { label: 'Ambulance', number: '144', icon: Heart },
  { label: 'Fire', number: '118', icon: Siren },
  { label: 'Domestic violence', number: '0800 110 110', icon: Phone },
]

export function EmergencyPage() {
  const { t } = useTranslation()
  const { allResources, loading } = useResources()

  const emergencyResources = useMemo(
    () => allResources.filter((r) =>
      r.category === 'emergency' ||
      r.tags.some((tag) => ['urgence', 'emergency', 'crise', 'crisis', 'abri', 'shelter', 'nuit', 'night'].includes(tag.toLowerCase())) ||
      (r.category === 'housing' && r.tags.some((tag) => ['urgence', 'emergency', 'nuit', 'night', 'abri', 'shelter'].includes(tag.toLowerCase())))
    ),
    [allResources],
  )

  // Also get shelters and crisis food specifically
  const shelters = useMemo(
    () => allResources.filter((r) => r.category === 'housing'),
    [allResources],
  )

  const crisisFood = useMemo(
    () => allResources.filter((r) => r.category === 'food'),
    [allResources],
  )

  const translatedEmergency = useTranslatedResources(emergencyResources)
  const translatedShelters = useTranslatedResources(shelters)
  const translatedFood = useTranslatedResources(crisisFood)

  const url = canonicalUrl('/emergency')
  const jsonLd = useMemo(() => [
    buildBreadcrumbJsonLd([
      { name: 'GenevaHelp', url: canonicalUrl('/') },
      { name: 'Emergency', url },
    ]),
  ], [url])

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 animate-fade-in">
      <SEOHead
        title="Emergency Help in Geneva — Free Shelters, Hotlines & Crisis Support | GenevaHelp"
        description="Emergency resources in Geneva: free shelters, crisis hotlines, food distribution, medical help. Find immediate help now."
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Siren size={24} className="text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-900">
                {t('emergency.title')}
              </h1>
              <p className="text-sm text-red-700">
                {t('emergency.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency numbers — large tap targets */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {EMERGENCY_NUMBERS.map((item) => {
            const EmIcon = item.icon
            return (
              <a
                key={item.number}
                href={`tel:${item.number.replace(/\s/g, '')}`}
                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-red-50 hover:border-red-200 transition-colors active:scale-[0.97]"
              >
                <EmIcon size={24} className="text-red-600" />
                <span className="text-xs text-gray-500 font-medium">{item.label}</span>
                <span className="text-lg font-bold text-red-700">{item.number}</span>
              </a>
            )
          })}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">{t('common.loading')}</div>
        ) : (
          <>
            {/* Emergency resources */}
            {translatedEmergency.length > 0 && (
              <ResourceSection
                title={t('emergency.crisisResources')}
                icon={<Siren size={16} className="text-red-500" />}
                resources={translatedEmergency}
                t={t}
              />
            )}

            {/* Shelters */}
            <ResourceSection
              title={t('emergency.shelters')}
              icon={<Home size={16} className="text-orange-500" />}
              resources={translatedShelters}
              t={t}
            />

            {/* Food */}
            <ResourceSection
              title={t('emergency.food')}
              icon={<UtensilsCrossed size={16} className="text-red-400" />}
              resources={translatedFood}
              t={t}
            />
          </>
        )}
      </div>
    </div>
  )
}

function ResourceSection({
  title,
  icon,
  resources,
  t,
}: {
  title: string
  icon: React.ReactNode
  resources: (import('../lib/types').Resource)[]
  t: (key: string) => string
}) {
  if (resources.length === 0) return null

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
        {icon}
        {title} ({resources.length})
      </h2>
      <div className="space-y-2">
        {resources.map((r) => (
          <Link
            key={r.id}
            to={`/resource/${resourceSlug(r)}`}
            className="block bg-white border border-gray-200 rounded-xl p-3 hover:border-red-200 hover:bg-red-50/30 transition-colors"
          >
            <h3 className="text-sm font-medium text-gray-900 mb-1">{r.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{r.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Phone size={11} />
                {r.phone || t('adminExtra.noContact')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

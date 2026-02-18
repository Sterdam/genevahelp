import { useTranslation } from 'react-i18next'
import { Heart, MapPin, Github, Users, Eye, Coffee } from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'
import { canonicalUrl } from '../lib/seo-utils'
import { useVisitCounter } from '../hooks/useVisitCounter'
import { STRIPE_DONATION_LINK } from '../lib/constants'

export function AboutPage() {
  const { t } = useTranslation()
  const visitCount = useVisitCounter()

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 animate-fade-in">
      <SEOHead
        title="About GenevaHelp — Free Resources in Geneva"
        description="GenevaHelp is a free, open-source interactive map of all free resources in Geneva. Food, health, housing, legal aid, language courses and more."
        canonical={canonicalUrl('/about')}
      />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('about.title')}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {t('about.mission')}
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('about.howItWorks')}
              </h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('about.howItWorksText')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Github size={20} className="text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('about.openSource')}
              </h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('about.openSourceText')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Coffee size={20} className="text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('about.coffeeTitle')}
              </h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {t('about.coffeeText')}
            </p>
            <a
              href={STRIPE_DONATION_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              {t('about.coffeeButton')}
            </a>
            <p className="text-xs text-gray-400 mt-3">
              {t('about.coffeeDisclaimer')}
            </p>
          </div>

          <div className="text-center text-sm text-gray-400 py-4 space-y-1">
            <p className="flex items-center justify-center gap-1">
              Made with <Heart size={14} className="text-red-500" /> for Geneva
            </p>
            {visitCount != null && (
              <p className="flex items-center justify-center gap-1.5 text-xs text-gray-300">
                <Eye size={12} />
                {visitCount.toLocaleString()} {t('stats.visits')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

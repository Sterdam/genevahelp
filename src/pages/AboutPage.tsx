import { useTranslation } from 'react-i18next'
import { Heart, MapPin, Github, Users } from 'lucide-react'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
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

          <div className="text-center text-sm text-gray-400 py-4">
            <p className="flex items-center justify-center gap-1">
              Made with <Heart size={14} className="text-red-500" /> for Geneva
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

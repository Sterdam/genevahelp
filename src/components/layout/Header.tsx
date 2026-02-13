import { useTranslation } from 'react-i18next'
import { MapPin, Plus, Info } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Header() {
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-30 relative">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <MapPin size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            {t('app.name')}
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block">
            {t('app.tagline')}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="px-2.5 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label="Toggle language"
        >
          {i18n.language === 'fr' ? 'EN' : 'FR'}
        </button>

        <Link
          to="/suggest"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          {t('nav.suggest')}
        </Link>

        <Link
          to="/about"
          className="hidden sm:inline-flex p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={t('nav.about')}
        >
          <Info size={20} />
        </Link>
      </div>
    </header>
  )
}

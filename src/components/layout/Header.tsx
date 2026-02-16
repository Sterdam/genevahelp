import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, Plus, Info, Coffee, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { languages } from '../../lib/i18n'
import { STRIPE_DONATION_LINK } from '../../lib/constants'

export function Header() {
  const { t, i18n } = useTranslation()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    setLangOpen(false)
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
        <div ref={langRef} className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Change language"
            aria-expanded={langOpen}
          >
            <span>{currentLang.flag}</span>
            <span className="hidden sm:inline">{currentLang.name}</span>
            <ChevronDown size={14} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 max-h-80 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                    lang.code === i18n.language
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

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

        <a
          href={STRIPE_DONATION_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex p-1.5 text-amber-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          aria-label={t('about.coffeeTitle')}
        >
          <Coffee size={20} />
        </a>
      </div>
    </header>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, Users, ChevronDown, ArrowRight } from 'lucide-react'
import { languages } from '../../lib/i18n'
import { DEMO_RESOURCES } from '../../lib/demo-data'
import { CategoryGrid } from '../filters/CategoryGrid'
import { setStoredCategories } from '../../lib/user-prefs'
import type { ResourceCategory } from '../../lib/types'

interface WelcomeModalProps {
  onClose: () => void
}

// The most common needs, shown as big tap targets on first visit
const MAIN_CATEGORIES: ResourceCategory[] = [
  'food', 'health', 'housing', 'legal',
  'language', 'admin', 'employment', 'social',
]

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const { t, i18n } = useTranslation()
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0]
  const resourceCount = DEMO_RESOURCES.length

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    setLangDropdownOpen(false)
  }

  const finish = () => {
    localStorage.setItem('genevemap-welcomed', '1')
    onClose()
  }

  const handleSelectNeed = (category: ResourceCategory) => {
    setStoredCategories([category])
    finish()
  }

  const handleExplore = () => {
    setStoredCategories([])
    finish()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Modal - mobile: bottom sheet, desktop: centered card */}
      <div className="relative w-full sm:w-auto sm:max-w-md mx-auto animate-slide-up sm:animate-fade-in">
        <div className="bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
          {/* Mobile drag indicator */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header with logo */}
          <div className="px-6 pt-4 sm:pt-6 pb-3 text-center">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-600/20">
              <MapPin size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('welcome.title')}
            </h1>
            <p className="text-sm text-blue-600 font-medium mt-1">
              {t('welcome.subtitle')}
            </p>
          </div>

          {/* Language selector */}
          <div className="px-6 pb-4">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
              {t('welcome.chooseLanguage')}
            </label>
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{currentLang.flag}</span>
                  <span>{currentLang.name}</span>
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10 max-h-48 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-start px-4 py-2.5 text-sm flex items-center gap-2.5 hover:bg-gray-50 transition-colors ${
                        lang.code === i18n.language
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* What do you need? */}
          <div className="px-6 pb-4">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
              {t('welcome.needQuestion')}
            </label>
            <CategoryGrid
              categories={MAIN_CATEGORIES}
              onSelect={handleSelectNeed}
            />
          </div>

          {/* For everyone, no conditions */}
          <div className="px-6 pb-4">
            <div className="bg-green-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <Users size={16} className="text-green-600 shrink-0" />
              <p className="text-xs text-green-800 leading-relaxed">
                <span className="font-bold">{t('welcome.forEveryone')}</span>
                {' — '}
                {t('welcome.forEveryoneText')}
              </p>
            </div>
          </div>

          {/* CTA: explore everything */}
          <div className="px-6 pb-6">
            <button
              onClick={handleExplore}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {t('welcome.explore')}
              <ArrowRight size={18} />
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              {t('welcome.resourceCount', { count: resourceCount })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, Heart, Users, MessageCircle, ChevronDown, ArrowRight } from 'lucide-react'
import { languages } from '../../lib/i18n'
import { DEMO_RESOURCES } from '../../lib/demo-data'

interface WelcomeModalProps {
  onClose: () => void
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const { t, i18n } = useTranslation()
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0]
  const resourceCount = DEMO_RESOURCES.length

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    setLangDropdownOpen(false)
  }

  const handleExplore = () => {
    localStorage.setItem('genevemap-welcomed', '1')
    onClose()
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
          <div className="px-6 pt-4 sm:pt-6 pb-4 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
              <MapPin size={32} className="text-white" />
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
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 hover:bg-gray-50 transition-colors ${
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

          {/* Content cards */}
          <div className="px-6 space-y-3 pb-4">
            {/* What is GenevaMap */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Heart size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {t('welcome.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* For everyone */}
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">
                    {t('welcome.forEveryone')}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('welcome.forEveryoneText')}
                  </p>
                </div>
              </div>
            </div>

            {/* Help us */}
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                    {t('welcome.helpUs')}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('welcome.helpUsText')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 pb-6 pt-2">
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

import i18n from 'i18next'
import type { BackendModule, ReadCallback } from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// French (default + fallback) is bundled for an instant first paint;
// every other language is fetched as its own chunk on demand.
import fr from '../locales/fr/translation.json'
import frResources from '../locales/fr/resources.json'

export const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ku', name: 'Kurdî', flag: '🇮🇶' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'so', name: 'Soomaali', flag: '🇸🇴' },
  { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
  { code: 'sr', name: 'Srpski', flag: '🇷🇸' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'ti', name: 'ትግርኛ', flag: '🇪🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
] as const

const SUPPORTED_CODES = languages.map((l) => l.code)

export const RTL_LANGUAGES = ['ar', 'fa', 'ur']

function applyDocumentDirection(lng: string) {
  document.documentElement.lang = lng
  document.documentElement.dir = RTL_LANGUAGES.includes(lng) ? 'rtl' : 'ltr'
}

i18n.on('languageChanged', applyDocumentDirection)

// Namespace names match the locale file names (translation.json / resources.json),
// so each language+namespace resolves to one lazily-imported Vite chunk.
const lazyBackend: BackendModule = {
  type: 'backend',
  init: () => {},
  read: (lng: string, ns: string, callback: ReadCallback) => {
    import(`../locales/${lng}/${ns}.json`)
      .then((mod) => callback(null, mod.default))
      .catch((err) => callback(err as Error, null))
  },
}

i18n
  .use(lazyBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr, resources: frResources },
    },
    partialBundledLanguages: true,
    supportedLngs: SUPPORTED_CODES,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    ns: ['translation', 'resources'],
    defaultNS: 'translation',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n

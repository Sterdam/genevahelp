import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import fr from '../locales/fr/translation.json'
import en from '../locales/en/translation.json'
import am from '../locales/am/translation.json'
import ar from '../locales/ar/translation.json'
import bg from '../locales/bg/translation.json'
import bn from '../locales/bn/translation.json'
import de from '../locales/de/translation.json'
import es from '../locales/es/translation.json'
import fa from '../locales/fa/translation.json'
import hi from '../locales/hi/translation.json'
import hr from '../locales/hr/translation.json'
import it from '../locales/it/translation.json'
import ja from '../locales/ja/translation.json'
import ko from '../locales/ko/translation.json'
import ku from '../locales/ku/translation.json'
import ne from '../locales/ne/translation.json'
import pl from '../locales/pl/translation.json'
import pt from '../locales/pt/translation.json'
import ro from '../locales/ro/translation.json'
import ru from '../locales/ru/translation.json'
import so from '../locales/so/translation.json'
import sq from '../locales/sq/translation.json'
import sr from '../locales/sr/translation.json'
import sw from '../locales/sw/translation.json'
import ta from '../locales/ta/translation.json'
import th from '../locales/th/translation.json'
import ti from '../locales/ti/translation.json'
import tr from '../locales/tr/translation.json'
import uk from '../locales/uk/translation.json'
import ur from '../locales/ur/translation.json'
import vi from '../locales/vi/translation.json'
import zh from '../locales/zh/translation.json'

import frResources from '../locales/fr/resources.json'
import enResources from '../locales/en/resources.json'
import amResources from '../locales/am/resources.json'
import arResources from '../locales/ar/resources.json'
import bgResources from '../locales/bg/resources.json'
import bnResources from '../locales/bn/resources.json'
import deResources from '../locales/de/resources.json'
import esResources from '../locales/es/resources.json'
import faResources from '../locales/fa/resources.json'
import hiResources from '../locales/hi/resources.json'
import hrResources from '../locales/hr/resources.json'
import itResources from '../locales/it/resources.json'
import jaResources from '../locales/ja/resources.json'
import koResources from '../locales/ko/resources.json'
import kuResources from '../locales/ku/resources.json'
import neResources from '../locales/ne/resources.json'
import plResources from '../locales/pl/resources.json'
import ptResources from '../locales/pt/resources.json'
import roResources from '../locales/ro/resources.json'
import ruResources from '../locales/ru/resources.json'
import soResources from '../locales/so/resources.json'
import sqResources from '../locales/sq/resources.json'
import srResources from '../locales/sr/resources.json'
import swResources from '../locales/sw/resources.json'
import taResources from '../locales/ta/resources.json'
import thResources from '../locales/th/resources.json'
import tiResources from '../locales/ti/resources.json'
import trResources from '../locales/tr/resources.json'
import ukResources from '../locales/uk/resources.json'
import urResources from '../locales/ur/resources.json'
import viResources from '../locales/vi/resources.json'
import zhResources from '../locales/zh/resources.json'

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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr, resources: frResources },
      en: { translation: en, resources: enResources },
      am: { translation: am, resources: amResources },
      ar: { translation: ar, resources: arResources },
      bg: { translation: bg, resources: bgResources },
      bn: { translation: bn, resources: bnResources },
      de: { translation: de, resources: deResources },
      es: { translation: es, resources: esResources },
      fa: { translation: fa, resources: faResources },
      hi: { translation: hi, resources: hiResources },
      hr: { translation: hr, resources: hrResources },
      it: { translation: it, resources: itResources },
      ja: { translation: ja, resources: jaResources },
      ko: { translation: ko, resources: koResources },
      ku: { translation: ku, resources: kuResources },
      ne: { translation: ne, resources: neResources },
      pl: { translation: pl, resources: plResources },
      pt: { translation: pt, resources: ptResources },
      ro: { translation: ro, resources: roResources },
      ru: { translation: ru, resources: ruResources },
      so: { translation: so, resources: soResources },
      sq: { translation: sq, resources: sqResources },
      sr: { translation: sr, resources: srResources },
      sw: { translation: sw, resources: swResources },
      ta: { translation: ta, resources: taResources },
      th: { translation: th, resources: thResources },
      ti: { translation: ti, resources: tiResources },
      tr: { translation: tr, resources: trResources },
      uk: { translation: uk, resources: ukResources },
      ur: { translation: ur, resources: urResources },
      vi: { translation: vi, resources: viResources },
      zh: { translation: zh, resources: zhResources },
    },
    ns: ['translation', 'resources'],
    defaultNS: 'translation',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Send,
  CheckCircle,
  MapPin,
  Phone,
  Globe,
  Mail,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Info,
  Accessibility,
  Languages,
  ArrowLeft,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { CATEGORY_CONFIG, CATEGORY_EMOJI } from '../lib/constants'
import type { ResourceCategory } from '../lib/types'
import { addSuggestion } from '../lib/suggestions'

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as ResourceCategory[]

interface FormState {
  name: string
  description: string
  category: ResourceCategory | ''
  address: string
  phone: string
  email: string
  website: string
  opening_hours: string
  target_audience: string
  access_conditions: string
  languages_spoken: string
  wheelchair_accessible: boolean | null
  submitter_contact: string
  submitter_name: string
  submitter_relation: string
}

const INITIAL_FORM: FormState = {
  name: '',
  description: '',
  category: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  opening_hours: '',
  target_audience: '',
  access_conditions: '',
  languages_spoken: '',
  wheelchair_accessible: null,
  submitter_name: '',
  submitter_contact: '',
  submitter_relation: '',
}

export function SuggestPage() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [contactError, setContactError] = useState(false)

  const update = (field: keyof FormState, value: string | boolean | null) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === 'submitter_contact') setContactError(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.submitter_contact.trim()) {
      setContactError(true)
      return
    }

    addSuggestion(form)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {t('suggest.thankYouTitle')}
          </h2>
          <p className="text-sm text-gray-500 mb-1">
            {t('suggest.thankYouRecorded')}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {t('suggest.thankYouReview')}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setForm(INITIAL_FORM); setSubmitted(false) }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('suggest.addAnother')}
            </button>
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t('suggest.viewMap')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 animate-fade-in">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-3 transition-colors">
            <ArrowLeft size={14} />
            {t('common.back')}
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {t('suggest.pageTitle')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('suggest.pageSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* === SECTION 1: Essential info === */}
          <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Info size={15} className="text-blue-500" />
              {t('suggest.sectionMain')}
            </h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('suggest.nameLabel')} *
              </label>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
                placeholder={t('suggest.namePlaceholder')}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
              />
            </div>

            {/* Category - visual grid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('suggest.typeLabel')} *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {CATEGORIES.map((cat) => {
                  const emoji = CATEGORY_EMOJI[cat]
                  const selected = form.category === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => update('category', selected ? '' : cat)}
                      className={`px-2 py-2 rounded-lg text-xs font-medium transition-all border ${
                        selected
                          ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-base">{emoji}</span>
                      <span className="block mt-0.5 truncate">
                        {t(`categories.${cat}`)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('suggest.description')}
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                placeholder={t('suggest.descriptionPlaceholder')}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-gray-300"
              />
            </div>
          </section>

          {/* === SECTION 2: Location & Contact === */}
          <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={15} className="text-red-500" />
              {t('suggest.sectionLocation')}
            </h2>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('suggest.address')} *
              </label>
              <input
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                required
                placeholder={t('suggest.addressPlaceholder')}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
              />
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Phone size={13} className="text-gray-400" />
                  {t('suggest.phone')}
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  type="tel"
                  placeholder="+41 22 ..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail size={13} className="text-gray-400" />
                  {t('suggest.email')}
                </label>
                <input
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  type="email"
                  placeholder="contact@..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                <Globe size={13} className="text-gray-400" />
                {t('suggest.website')}
              </label>
              <input
                value={form.website}
                onChange={(e) => update('website', e.target.value)}
                type="url"
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
              />
            </div>
          </section>

          {/* === SECTION 3: Optional details (expandable) === */}
          <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Clock size={15} className="text-amber-500" />
                {t('suggest.sectionDetails')}
              </span>
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showDetails && (
              <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                {/* Opening hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Clock size={13} className="text-gray-400" />
                    {t('suggest.hoursLabel')}
                  </label>
                  <textarea
                    value={form.opening_hours}
                    onChange={(e) => update('opening_hours', e.target.value)}
                    rows={3}
                    placeholder={t('suggest.hoursPlaceholder')}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-gray-300"
                  />
                </div>

                {/* Target audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Users size={13} className="text-gray-400" />
                    {t('suggest.audienceLabel')}
                  </label>
                  <input
                    value={form.target_audience}
                    onChange={(e) => update('target_audience', e.target.value)}
                    placeholder={t('suggest.audiencePlaceholder')}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
                  />
                </div>

                {/* Access conditions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('suggest.accessLabel')}
                  </label>
                  <input
                    value={form.access_conditions}
                    onChange={(e) => update('access_conditions', e.target.value)}
                    placeholder={t('suggest.accessPlaceholder')}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
                  />
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Languages size={13} className="text-gray-400" />
                    {t('suggest.languagesLabel')}
                  </label>
                  <input
                    value={form.languages_spoken}
                    onChange={(e) => update('languages_spoken', e.target.value)}
                    placeholder={t('suggest.languagesPlaceholder')}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
                  />
                </div>

                {/* Wheelchair */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <Accessibility size={13} className="text-gray-400" />
                    {t('suggest.wheelchairLabel')}
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: true, label: t('common.yes') },
                      { value: false, label: t('common.no') },
                      { value: null, label: t('suggest.notSure') },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => update('wheelchair_accessible', opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          form.wheelchair_accessible === opt.value
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* === SECTION 4: Your contact (mandatory) === */}
          <section className={`bg-white rounded-xl border p-4 space-y-4 ${
            contactError ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'
          }`}>
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Mail size={15} className="text-green-500" />
              {t('suggest.sectionContact')}
              <span className="text-xs font-normal text-gray-400">
                ({t('suggest.required')})
              </span>
            </h2>

            <p className="text-xs text-gray-500 -mt-2">
              {t('suggest.contactExplain')}
            </p>

            {/* Submitter name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('suggest.yourName')}
              </label>
              <input
                value={form.submitter_name}
                onChange={(e) => update('submitter_name', e.target.value)}
                placeholder={t('suggest.yourNamePlaceholder')}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
              />
            </div>

            {/* Submitter contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('suggest.contactLabel')} *
              </label>
              <input
                value={form.submitter_contact}
                onChange={(e) => update('submitter_contact', e.target.value)}
                placeholder={t('suggest.contactPlaceholder')}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 ${
                  contactError ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {contactError && (
                <p className="text-xs text-red-500 mt-1">
                  {t('suggest.contactRequired')}
                </p>
              )}
            </div>

            {/* Relation to place */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('suggest.relationLabel')}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'user', label: t('suggest.relationUser') },
                  { value: 'staff', label: t('suggest.relationStaff') },
                  { value: 'organization', label: t('suggest.relationOrg') },
                  { value: 'other', label: t('suggest.relationOther') },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update('submitter_relation', form.submitter_relation === opt.value ? '' : opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      form.submitter_relation === opt.value
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-700">
              {t('suggest.infoBanner')}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Send size={16} />
            {t('suggest.submitButton')}
          </button>
        </form>
      </div>
    </div>
  )
}

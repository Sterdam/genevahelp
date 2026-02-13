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

const RELATION_OPTIONS = [
  { value: 'user', labelFr: 'J\'utilise ce lieu', labelEn: 'I use this place' },
  { value: 'staff', labelFr: 'J\'y travaille / bénévole', labelEn: 'I work/volunteer there' },
  { value: 'organization', labelFr: 'Je représente cette organisation', labelEn: 'I represent this organization' },
  { value: 'other', labelFr: 'Autre', labelEn: 'Other' },
]

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
  const { t, i18n } = useTranslation()
  const isFr = i18n.language === 'fr'
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
            {isFr ? 'Merci pour votre contribution !' : 'Thank you for your contribution!'}
          </h2>
          <p className="text-sm text-gray-500 mb-1">
            {isFr
              ? 'Votre suggestion a bien été enregistrée.'
              : 'Your suggestion has been recorded.'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {isFr
              ? 'Un administrateur la vérifiera dans les plus brefs délais et vous contactera si besoin.'
              : 'An administrator will review it as soon as possible and contact you if needed.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setForm(INITIAL_FORM); setSubmitted(false) }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isFr ? 'Ajouter un autre lieu' : 'Add another place'}
            </button>
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isFr ? 'Voir la carte' : 'View map'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-3 transition-colors">
            <ArrowLeft size={14} />
            {t('common.back')}
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isFr ? 'Proposer un lieu' : 'Suggest a place'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isFr
              ? 'Vous connaissez une ressource gratuite à Genève ? Aidez-nous à compléter la carte !'
              : 'Know a free resource in Geneva? Help us complete the map!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* === SECTION 1: Essential info === */}
          <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Info size={15} className="text-blue-500" />
              {isFr ? 'Informations principales' : 'Main information'}
            </h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isFr ? 'Nom du lieu / de l\'organisation' : 'Place / organization name'} *
              </label>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
                placeholder={isFr ? 'ex: Caritas Genève, Croix-Rouge...' : 'e.g. Caritas Geneva, Red Cross...'}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
              />
            </div>

            {/* Category - visual grid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isFr ? 'Type de ressource' : 'Resource type'} *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {CATEGORIES.map((cat) => {
                  const cfg = CATEGORY_CONFIG[cat]
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
                        {isFr ? cfg.label : cfg.labelEn}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isFr ? 'Description' : 'Description'}
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                placeholder={isFr
                  ? 'Que propose ce lieu ? Quels services sont offerts ?'
                  : 'What does this place offer? What services are provided?'}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-gray-300"
              />
            </div>
          </section>

          {/* === SECTION 2: Location & Contact === */}
          <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={15} className="text-red-500" />
              {isFr ? 'Localisation & contact' : 'Location & contact'}
            </h2>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isFr ? 'Adresse' : 'Address'} *
              </label>
              <input
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                required
                placeholder={isFr ? 'ex: Rue du Marché 12, 1204 Genève' : 'e.g. Rue du Marché 12, 1204 Geneva'}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
              />
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Phone size={13} className="text-gray-400" />
                  {isFr ? 'Téléphone' : 'Phone'}
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
                  Email
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
                {isFr ? 'Site web' : 'Website'}
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
                {isFr ? 'Détails supplémentaires (optionnel)' : 'Additional details (optional)'}
              </span>
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showDetails && (
              <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                {/* Opening hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Clock size={13} className="text-gray-400" />
                    {isFr ? 'Horaires d\'ouverture' : 'Opening hours'}
                  </label>
                  <textarea
                    value={form.opening_hours}
                    onChange={(e) => update('opening_hours', e.target.value)}
                    rows={3}
                    placeholder={isFr
                      ? 'ex:\nLun-Ven: 9h-17h\nSamedi: 10h-14h\nDimanche: Fermé'
                      : 'e.g.:\nMon-Fri: 9am-5pm\nSaturday: 10am-2pm\nSunday: Closed'}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-gray-300"
                  />
                </div>

                {/* Target audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Users size={13} className="text-gray-400" />
                    {isFr ? 'Pour qui ?' : 'Who is it for?'}
                  </label>
                  <input
                    value={form.target_audience}
                    onChange={(e) => update('target_audience', e.target.value)}
                    placeholder={isFr
                      ? 'ex: Familles, réfugiés, personnes sans-abri...'
                      : 'e.g. Families, refugees, homeless...'}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
                  />
                </div>

                {/* Access conditions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isFr ? 'Conditions d\'accès' : 'Access conditions'}
                  </label>
                  <input
                    value={form.access_conditions}
                    onChange={(e) => update('access_conditions', e.target.value)}
                    placeholder={isFr
                      ? 'ex: Gratuit, sur rendez-vous, carte d\'identité...'
                      : 'e.g. Free, by appointment, ID required...'}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
                  />
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Languages size={13} className="text-gray-400" />
                    {isFr ? 'Langues parlées' : 'Languages spoken'}
                  </label>
                  <input
                    value={form.languages_spoken}
                    onChange={(e) => update('languages_spoken', e.target.value)}
                    placeholder={isFr
                      ? 'ex: Français, anglais, arabe...'
                      : 'e.g. French, English, Arabic...'}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
                  />
                </div>

                {/* Wheelchair */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <Accessibility size={13} className="text-gray-400" />
                    {isFr ? 'Accessible en fauteuil roulant ?' : 'Wheelchair accessible?'}
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: true, label: isFr ? 'Oui' : 'Yes' },
                      { value: false, label: isFr ? 'Non' : 'No' },
                      { value: null, label: isFr ? 'Je ne sais pas' : 'Not sure' },
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
              {isFr ? 'Vos coordonnées' : 'Your contact info'}
              <span className="text-xs font-normal text-gray-400">
                ({isFr ? 'obligatoire' : 'required'})
              </span>
            </h2>

            <p className="text-xs text-gray-500 -mt-2">
              {isFr
                ? 'Pour que l\'administrateur puisse vous contacter si besoin de vérification ou de précisions.'
                : 'So the administrator can contact you for verification or clarifications.'}
            </p>

            {/* Submitter name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isFr ? 'Votre nom / pseudo' : 'Your name / alias'}
              </label>
              <input
                value={form.submitter_name}
                onChange={(e) => update('submitter_name', e.target.value)}
                placeholder={isFr ? 'ex: Marie, Association XYZ...' : 'e.g. Marie, Association XYZ...'}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
              />
            </div>

            {/* Submitter contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isFr ? 'Email ou téléphone de contact' : 'Contact email or phone'} *
              </label>
              <input
                value={form.submitter_contact}
                onChange={(e) => update('submitter_contact', e.target.value)}
                placeholder={isFr ? 'email@exemple.com ou +41 79...' : 'email@example.com or +41 79...'}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 ${
                  contactError ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {contactError && (
                <p className="text-xs text-red-500 mt-1">
                  {isFr
                    ? 'Un moyen de contact est nécessaire pour valider votre suggestion.'
                    : 'A contact method is required to validate your suggestion.'}
                </p>
              )}
            </div>

            {/* Relation to place */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isFr ? 'Votre lien avec ce lieu' : 'Your relation to this place'}
              </label>
              <div className="flex flex-wrap gap-2">
                {RELATION_OPTIONS.map((opt) => (
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
                    {isFr ? opt.labelFr : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-700">
              {isFr
                ? '📋 Un administrateur examinera votre suggestion dans les plus brefs délais. Vous serez contacté(e) si des informations complémentaires sont nécessaires.'
                : '📋 An administrator will review your suggestion as soon as possible. You will be contacted if additional information is needed.'}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Send size={16} />
            {isFr ? 'Envoyer ma suggestion' : 'Submit my suggestion'}
          </button>
        </form>
      </div>
    </div>
  )
}

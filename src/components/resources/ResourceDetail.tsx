import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  Clock,
  Users,
  Accessibility,
  CheckCircle,
  Navigation,
  ExternalLink,
  X,
  Tag,
  Info,
  Shield,
} from 'lucide-react'
import { Badge } from '../ui/Badge'
import { ReportButton } from './ReportButton'
import { CATEGORY_CONFIG } from '../../lib/constants'
import type { Resource } from '../../lib/types'
import { formatDistance } from '../../hooks/useGeolocation'

interface ResourceDetailProps {
  resource: (Resource & { _distance?: number }) | null
  onClose: () => void
}

const DAY_ORDER = [
  { key: 'monday', aliases: ['monday', 'lundi'] },
  { key: 'tuesday', aliases: ['tuesday', 'mardi'] },
  { key: 'wednesday', aliases: ['wednesday', 'mercredi'] },
  { key: 'thursday', aliases: ['thursday', 'jeudi'] },
  { key: 'friday', aliases: ['friday', 'vendredi'] },
  { key: 'saturday', aliases: ['saturday', 'samedi'] },
  { key: 'sunday', aliases: ['sunday', 'dimanche'] },
]

export function ResourceDetail({ resource, onClose }: ResourceDetailProps) {
  const { t } = useTranslation()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!resource) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [resource, onClose])

  useEffect(() => {
    panelRef.current?.scrollTo(0, 0)
  }, [resource?.id])

  if (!resource) return null

  const config = CATEGORY_CONFIG[resource.category]
  const Icon = config.icon

  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${resource.latitude},${resource.longitude}`,
      '_blank'
    )
  }

  const callPhone = () => {
    if (resource.phone) window.location.href = `tel:${resource.phone}`
  }

  const openWebsite = () => {
    if (resource.website) window.open(resource.website, '_blank')
  }

  return (
    <>
      {/* Desktop: Side panel */}
      <div className="hidden sm:flex fixed right-0 top-0 bottom-0 w-[420px] z-40 pointer-events-none">
        <div className="w-full h-full bg-white shadow-2xl border-l border-gray-200 pointer-events-auto animate-slide-in-right flex flex-col">
          <DetailHeader resource={resource} config={config} Icon={Icon} t={t} onClose={onClose} />
          <div ref={panelRef} className="flex-1 overflow-y-auto">
            <DetailContent resource={resource} config={config} t={t} openDirections={openDirections} />
          </div>
          <ActionBar resource={resource} t={t} openDirections={openDirections} callPhone={callPhone} openWebsite={openWebsite} />
        </div>
      </div>

      {/* Mobile: Bottom sheet */}
      <div className="sm:hidden fixed inset-0 z-40 pointer-events-none">
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto animate-fade-in"
          onClick={onClose}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl ring-1 ring-black/5 pointer-events-auto animate-slide-up flex flex-col" style={{ maxHeight: 'min(85dvh, calc(100vh - env(safe-area-inset-top, 20px) - 20px))' }}>
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          <DetailHeader resource={resource} config={config} Icon={Icon} t={t} onClose={onClose} mobile />
          <div ref={panelRef} className="flex-1 overflow-y-auto">
            <DetailContent resource={resource} config={config} t={t} openDirections={openDirections} />
          </div>
          <ActionBar resource={resource} t={t} openDirections={openDirections} callPhone={callPhone} openWebsite={openWebsite} />
        </div>
      </div>
    </>
  )
}

interface DetailHeaderProps {
  resource: Resource & { _distance?: number }
  config: (typeof CATEGORY_CONFIG)[keyof typeof CATEGORY_CONFIG]
  Icon: typeof MapPin
  t: (key: string) => string
  onClose: () => void
  mobile?: boolean
}

function DetailHeader({ resource, config, Icon, t, onClose, mobile }: DetailHeaderProps) {
  const iconSize = mobile ? 10 : 12
  const headingClass = mobile ? 'text-base' : 'text-lg'

  return (
    <div className={`flex items-start gap-3 ${mobile ? 'px-4 pb-3' : 'p-4'} border-b border-gray-100`}>
      <div
        className={`shrink-0 ${mobile ? 'w-10 h-10 rounded-lg' : 'w-12 h-12 rounded-xl'} flex items-center justify-center`}
        style={{ backgroundColor: `${config.color}15` }}
      >
        <Icon size={mobile ? 20 : 24} style={{ color: config.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className={`${headingClass} font-semibold text-gray-900 leading-tight`}>
          {resource.name}
        </h2>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge color={config.color}>{t(`categories.${resource.category}`)}</Badge>
          {resource.verified && (
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle size={iconSize} />
              {t('resource.verified')}
            </Badge>
          )}
          <Badge className="bg-emerald-100 text-emerald-700">
            {t('resource.free')}
          </Badge>
          {resource._distance != null && (
            <span className="text-xs text-gray-400">
              {formatDistance(resource._distance)}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className={`shrink-0 ${mobile ? 'p-1' : 'p-1.5'} rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors`}
        aria-label={t('common.close')}
      >
        <X size={mobile ? 18 : 20} />
      </button>
    </div>
  )
}

interface DetailContentProps {
  resource: Resource
  config: (typeof CATEGORY_CONFIG)[keyof typeof CATEGORY_CONFIG]
  t: (key: string) => string
  openDirections: () => void
}

function DetailContent({ resource, config, t, openDirections }: DetailContentProps) {
  const hasAudience = resource.target_audience || resource.access_conditions
  const hasContact = resource.phone || resource.email || resource.website
  const hasHours = resource.opening_hours && Object.keys(resource.opening_hours).length > 0
  const hasPracticalInfo = resource.wheelchair_accessible != null ||
    (resource.languages_spoken && resource.languages_spoken.length > 0) ||
    (resource.tags && resource.tags.length > 0)

  return (
    <div className="px-4 py-3 space-y-4">
      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {resource.description}
      </p>

      {/* Pour qui / Who is it for - PROMINENT SECTION */}
      {hasAudience && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: `${config.color}08` }}>
          <div
            className="px-3.5 py-2 flex items-center gap-2"
            style={{ backgroundColor: `${config.color}15` }}
          >
            <Users size={15} style={{ color: config.color }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: config.color }}>
              {t('resource.forWhom')}
            </span>
          </div>
          <div className="px-3.5 py-3 space-y-2">
            {resource.target_audience && (
              <div className="flex items-start gap-2">
                <Shield size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-800 font-medium">{resource.target_audience}</p>
              </div>
            )}
            {resource.access_conditions && (
              <div className="flex items-start gap-2">
                <Info size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600">{resource.access_conditions}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact & Location */}
      <div className="space-y-1">
        <SectionHeader icon={MapPin} label={t('resource.contact')} />
        <div className="bg-gray-50 rounded-xl p-3 space-y-3">
          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{resource.address}</p>
              <button
                onClick={openDirections}
                className="text-xs text-blue-600 hover:text-blue-700 mt-0.5 inline-flex items-center gap-1"
              >
                <Navigation size={11} />
                {t('resource.directions')}
              </button>
            </div>
          </div>

          {/* Phone */}
          {resource.phone && (
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-400 shrink-0" />
              <a href={`tel:${resource.phone}`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                {resource.phone}
              </a>
            </div>
          )}

          {/* Email */}
          {resource.email && (
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <a href={`mailto:${resource.email}`} className="text-sm text-blue-600 hover:text-blue-700 truncate">
                {resource.email}
              </a>
            </div>
          )}

          {/* Website */}
          {resource.website && (
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-gray-400 shrink-0" />
              <a
                href={resource.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 truncate"
              >
                {resource.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                <ExternalLink size={11} className="shrink-0" />
              </a>
            </div>
          )}

          {/* No contact at all */}
          {!hasContact && (
            <p className="text-xs text-gray-400 italic">{t('adminExtra.noContact')}</p>
          )}
        </div>
      </div>

      {/* Opening Hours */}
      {hasHours && (
        <div className="space-y-1">
          <SectionHeader icon={Clock} label={t('resource.hours')} />
          <div className="bg-gray-50 rounded-xl p-3 space-y-1">
            {DAY_ORDER.map(({ key, aliases }) => {
              const hours = aliases.reduce<string | undefined>(
                (found, alias) => found || resource.opening_hours[alias],
                undefined
              )
              if (!hours) return null
              return (
                <div key={key} className="flex justify-between gap-4 text-xs py-0.5">
                  <span className="font-medium text-gray-500">{t(`days.${key}`)}</span>
                  <span className="text-gray-900 font-medium">{hours}</span>
                </div>
              )
            })}
            {resource.opening_hours.notes && (
              <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-200 pt-2">
                {resource.opening_hours.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Practical Info */}
      {hasPracticalInfo && (
        <div className="space-y-1">
          <SectionHeader icon={Info} label={t('resource.practicalInfo')} />
          <div className="space-y-2.5">
            {/* Wheelchair */}
            {resource.wheelchair_accessible != null && (
              <div className="flex items-center gap-2.5">
                <Accessibility size={16} className={resource.wheelchair_accessible ? 'text-green-500' : 'text-gray-400'} />
                <span className={`text-sm ${resource.wheelchair_accessible ? 'text-green-700' : 'text-gray-500'}`}>
                  {resource.wheelchair_accessible ? t('resource.wheelchairYes') : t('resource.wheelchairNo')}
                </span>
              </div>
            )}

            {/* Languages */}
            {resource.languages_spoken && resource.languages_spoken.length > 0 && (
              <div className="flex items-center gap-2.5">
                <Globe size={16} className="text-gray-400 shrink-0" />
                <div className="flex gap-1.5 flex-wrap">
                  {resource.languages_spoken.map((lang) => (
                    <span key={lang} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md uppercase font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex items-start gap-2.5">
                <Tag size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <div className="flex gap-1.5 flex-wrap">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Source */}
      {resource.source && (
        <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
          {t('resource.source')}: {resource.source}
        </p>
      )}

      {/* Report */}
      <div className="pt-1 border-t border-gray-100">
        <ReportButton resourceId={resource.id} resourceName={resource.name} />
      </div>

      {/* Bottom padding for mobile scroll */}
      <div className="h-2" />
    </div>
  )
}

function SectionHeader({ icon: IconComp, label }: { icon: typeof MapPin; label: string }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <IconComp size={14} className="text-gray-400" />
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</h3>
    </div>
  )
}

interface ActionBarProps {
  resource: Resource
  t: (key: string) => string
  openDirections: () => void
  callPhone: () => void
  openWebsite: () => void
}

function ActionBar({ resource, t, openDirections, callPhone, openWebsite }: ActionBarProps) {
  return (
    <div className="border-t border-gray-200 p-3 flex gap-2 bg-white safe-area-bottom">
      <button
        onClick={openDirections}
        className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <Navigation size={16} />
        {t('resource.directions')}
      </button>
      {resource.phone && (
        <button
          onClick={callPhone}
          className="py-2.5 px-4 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Phone size={16} />
          {t('resource.call')}
        </button>
      )}
      {resource.website && !resource.phone && (
        <button
          onClick={openWebsite}
          className="py-2.5 px-4 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Globe size={16} />
          {t('resource.seeWebsite')}
        </button>
      )}
    </div>
  )
}

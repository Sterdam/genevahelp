import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MapPin, CheckCircle, Users, ExternalLink } from 'lucide-react'
import { CATEGORY_CONFIG } from '../../lib/constants'
import { isOpenNow } from '../../lib/opening-hours'
import { resourceSlug } from '../../lib/seo-utils'
import type { Resource } from '../../lib/types'
import { formatDistance } from '../../hooks/useGeolocation'

interface ResourceCardProps {
  resource: Resource & { _distance?: number }
  isSelected: boolean
  onClick: () => void
}

export function ResourceCard({ resource, isSelected, onClick }: ResourceCardProps) {
  const { t } = useTranslation()
  const config = CATEGORY_CONFIG[resource.category]
  const Icon = config.icon
  const openNow = isOpenNow(resource.opening_hours)

  return (
    <button
      onClick={onClick}
      className={`w-full text-start p-3 rounded-xl border border-s-[3px] transition-all duration-150 active:scale-[0.98] active:bg-gray-50 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      style={{ borderInlineStartColor: config.color }}
    >
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <Icon size={20} style={{ color: config.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-medium text-gray-900 text-sm truncate">
              {resource.name}
            </h3>
            {resource.verified && (
              <CheckCircle size={14} className="text-green-500 shrink-0" />
            )}
            {resource._distance != null && (
              <span className="shrink-0 text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                {formatDistance(resource._distance)}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 line-clamp-2 mb-1.5">
            {resource.description}
          </p>

          {/* Target audience - prominent info */}
          {resource.target_audience && (
            <p className="text-xs text-gray-600 mb-1.5 flex items-center gap-1">
              <Users size={11} className="text-gray-400 shrink-0" />
              <span className="truncate">{resource.target_audience}</span>
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${config.color}10`, color: config.color }}
            >
              {t(`categories.${resource.category}`)}
            </span>

            {openNow != null && (
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  openNow ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    openNow ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                {openNow ? t('resource.open') : t('resource.closed')}
              </span>
            )}

            {resource._distance == null && isFinite(resource.latitude) && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} />
                {resource.address.split(',')[0]}
              </span>
            )}

            <Link
              to={`/resource/${resourceSlug(resource)}`}
              onClick={(e) => e.stopPropagation()}
              className="ms-auto inline-flex items-center gap-1 p-1.5 -m-1.5 text-gray-300 hover:text-blue-500 transition-colors"
              title={t('resource.viewPage')}
            >
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    </button>
  )
}

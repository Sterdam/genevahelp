import { useTranslation } from 'react-i18next'
import { MapPin, CheckCircle, Users } from 'lucide-react'
import { CATEGORY_CONFIG } from '../../lib/constants'
import type { Resource } from '../../lib/types'
import { formatDistance } from '../../hooks/useGeolocation'

interface ResourceCardProps {
  resource: Resource & { _distance?: number }
  isSelected: boolean
  onClick: () => void
}

export function ResourceCard({ resource, isSelected, onClick }: ResourceCardProps) {
  const { i18n } = useTranslation()
  const config = CATEGORY_CONFIG[resource.category]
  const Icon = config.icon
  const label = i18n.language === 'en' ? config.labelEn : config.label

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
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
              {label}
            </span>

            <span className="inline-flex items-center gap-1">
              <MapPin size={12} />
              {resource._distance != null
                ? formatDistance(resource._distance)
                : resource.address.split(',')[0]}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

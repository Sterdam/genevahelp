import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { CATEGORY_CONFIG, CATEGORY_EMOJI } from '../../lib/constants'
import type { Resource } from '../../lib/types'

interface ResourceMarkerProps {
  resource: Resource
  isSelected: boolean
  onClick: () => void
}

const iconCache = new Map<string, L.DivIcon>()

function getCategoryIcon(category: Resource['category'], isSelected: boolean) {
  const cacheKey = `${category}-${isSelected}`
  const cached = iconCache.get(cacheKey)
  if (cached) return cached

  const config = CATEGORY_CONFIG[category]
  const emoji = CATEGORY_EMOJI[category]
  const size = isSelected ? 44 : 34
  const emojiSize = isSelected ? 18 : 14

  const html = `<div style="
    background-color: ${config.color};
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s;
    ${isSelected ? 'transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 1000;' : ''}
  "><span style="font-size: ${emojiSize}px; line-height: 1;">${emoji}</span></div>`

  const icon = L.divIcon({
    html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })

  iconCache.set(cacheKey, icon)
  return icon
}

export function ResourceMarker({ resource, isSelected, onClick }: ResourceMarkerProps) {
  const icon = getCategoryIcon(resource.category, isSelected)

  return (
    <Marker
      position={[resource.latitude, resource.longitude]}
      icon={icon}
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{ click: onClick }}
    />
  )
}

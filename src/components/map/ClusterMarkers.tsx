import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import { CATEGORY_CONFIG, CATEGORY_EMOJI } from '../../lib/constants'
import type { Resource } from '../../lib/types'

interface ClusterMarkersProps {
  resources: Resource[]
  selectedId: string | null
  onSelectResource: (resource: Resource) => void
}

// Below this zoom markers group into clusters; at it and above all pins show,
// matching the zoom FlyToSelected uses so a selected pin is never hidden.
const UNCLUSTER_ZOOM = 16

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
    animation: fade-in 0.3s ease-out;
    ${isSelected ? 'transform: scale(1.15); animation: marker-pulse 1.5s ease-out infinite; z-index: 1000;' : ''}
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

function createClusterIcon(cluster: L.MarkerCluster) {
  const count = cluster.getChildCount()
  const size = count < 10 ? 40 : count < 50 ? 48 : 56
  return L.divIcon({
    html: `<div style="
      width: 100%;
      height: 100%;
      background-color: rgba(37, 99, 235, 0.92);
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: ${count < 100 ? 14 : 12}px;
    ">${count}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export function ClusterMarkers({ resources, selectedId, onSelectResource }: ClusterMarkersProps) {
  const map = useMap()
  const groupRef = useRef<L.MarkerClusterGroup | null>(null)

  useEffect(() => {
    const group = L.markerClusterGroup({
      maxClusterRadius: 60,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: UNCLUSTER_ZOOM,
      iconCreateFunction: createClusterIcon,
    })
    map.addLayer(group)
    groupRef.current = group
    return () => {
      map.removeLayer(group)
      groupRef.current = null
    }
  }, [map])

  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    group.clearLayers()
    const markers = resources
      .filter((r) => isFinite(r.latitude) && isFinite(r.longitude))
      .map((r) => {
        const marker = L.marker([r.latitude, r.longitude], {
          icon: getCategoryIcon(r.category, r.id === selectedId),
          zIndexOffset: r.id === selectedId ? 1000 : 0,
        })
        marker.on('click', () => onSelectResource(r))
        return marker
      })
    group.addLayers(markers)
  }, [resources, selectedId, onSelectResource])

  return null
}

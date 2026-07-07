import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import { MAP_CENTER, MAP_DEFAULT_ZOOM } from '../../lib/constants'
import { ClusterMarkers } from './ClusterMarkers'
import { UserLocationMarker } from './UserLocationMarker'
import type { Resource } from '../../lib/types'
import { useEffect } from 'react'
import { Locate } from 'lucide-react'

interface MapViewProps {
  resources: Resource[]
  selectedId: string | null
  onSelectResource: (resource: Resource) => void
  userLat?: number | null
  userLng?: number | null
}

function FlyToSelected({ resource }: { resource: Resource | null }) {
  const map = useMap()

  useEffect(() => {
    if (!resource || !isFinite(resource.latitude) || !isFinite(resource.longitude)) return

    // Delay to ensure map container is properly sized after mount/layout
    const timeoutId = setTimeout(() => {
      try {
        const size = map.getSize()
        if (size.x > 0 && size.y > 0) {
          map.flyTo([resource.latitude, resource.longitude], 16, { duration: 0.5 })
        } else {
          // Container not ready - use instant move instead
          map.setView([resource.latitude, resource.longitude], 16, { animate: false })
        }
      } catch {
        // Fallback if flyTo fails (Leaflet projection bug with 0-size containers)
        try {
          map.setView([resource.latitude, resource.longitude], 16, { animate: false })
        } catch {
          // Silently fail - map will just stay where it is
        }
      }
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [resource, map])

  return null
}

function RecenterButton({ userLat, userLng }: { userLat?: number | null; userLng?: number | null }) {
  const map = useMap()

  const handleRecenter = () => {
    try {
      if (userLat != null && userLng != null) {
        map.flyTo([userLat, userLng], 15, { duration: 0.5 })
      } else {
        map.flyTo([MAP_CENTER.lat, MAP_CENTER.lng], MAP_DEFAULT_ZOOM, { duration: 0.5 })
      }
    } catch {
      const target = userLat != null && userLng != null
        ? [userLat, userLng] as [number, number]
        : [MAP_CENTER.lat, MAP_CENTER.lng] as [number, number]
      map.setView(target, userLat != null ? 15 : MAP_DEFAULT_ZOOM, { animate: false })
    }
  }

  return (
    <div className="leaflet-bottom leaflet-right" style={{ marginBottom: 80, marginRight: 10 }}>
      <div className="leaflet-control">
        <button
          onClick={handleRecenter}
          className="w-11 h-11 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Recentrer"
          title="Recentrer"
        >
          <Locate size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  )
}

export function MapView({
  resources,
  selectedId,
  onSelectResource,
  userLat,
  userLng,
}: MapViewProps) {
  const selected = resources.find((r) => r.id === selectedId) || null

  return (
    <MapContainer
      center={[MAP_CENTER.lat, MAP_CENTER.lng]}
      zoom={MAP_DEFAULT_ZOOM}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ZoomControl position="bottomright" />

      <ClusterMarkers
        resources={resources}
        selectedId={selectedId}
        onSelectResource={onSelectResource}
      />

      {userLat != null && userLng != null && (
        <UserLocationMarker lat={userLat} lng={userLng} />
      )}

      <FlyToSelected resource={selected} />
      <RecenterButton userLat={userLat} userLng={userLng} />
    </MapContainer>
  )
}

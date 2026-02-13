import { CircleMarker } from 'react-leaflet'

interface UserLocationMarkerProps {
  lat: number
  lng: number
}

export function UserLocationMarker({ lat, lng }: UserLocationMarkerProps) {
  return (
    <>
      <CircleMarker
        center={[lat, lng]}
        radius={24}
        pathOptions={{
          color: 'transparent',
          fillColor: '#3B82F6',
          fillOpacity: 0.15,
        }}
      />
      <CircleMarker
        center={[lat, lng]}
        radius={8}
        pathOptions={{
          color: 'white',
          weight: 3,
          fillColor: '#3B82F6',
          fillOpacity: 1,
        }}
      />
    </>
  )
}

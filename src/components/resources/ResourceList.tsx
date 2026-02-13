import { useEffect, useRef } from 'react'
import type { Resource } from '../../lib/types'
import { ResourceCard } from './ResourceCard'
import { EmptyState } from '../ui/EmptyState'
import { Spinner } from '../ui/Spinner'

interface ResourceListProps {
  resources: Resource[]
  selectedId: string | null
  onSelectResource: (resource: Resource) => void
  loading?: boolean
}

export function ResourceList({
  resources,
  selectedId,
  onSelectResource,
  loading,
}: ResourceListProps) {
  const selectedRef = useRef<HTMLDivElement>(null)

  // Scroll selected card into view
  useEffect(() => {
    if (selectedId && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (resources.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {resources.map((resource) => (
        <div
          key={resource.id}
          ref={resource.id === selectedId ? selectedRef : undefined}
        >
          <ResourceCard
            resource={resource}
            isSelected={resource.id === selectedId}
            onClick={() => onSelectResource(resource)}
          />
        </div>
      ))}
    </div>
  )
}

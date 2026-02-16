import { useEffect, useRef } from 'react'
import type { Resource } from '../../lib/types'
import { ResourceCard } from './ResourceCard'
import { EmptyState } from '../ui/EmptyState'
import { SkeletonCard } from '../ui/SkeletonCard'

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
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (resources.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {resources.map((resource, index) => (
        <div
          key={resource.id}
          ref={resource.id === selectedId ? selectedRef : undefined}
          className="animate-card-enter"
          style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
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

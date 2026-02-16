export function SkeletonCard() {
  return (
    <div className="w-full p-3 rounded-xl border border-gray-200 bg-white">
      <div className="flex items-start gap-3">
        {/* Icon circle */}
        <div className="shrink-0 w-10 h-10 rounded-lg skeleton-shimmer" />

        <div className="flex-1 min-w-0 space-y-2">
          {/* Title bar */}
          <div className="h-4 w-3/4 rounded skeleton-shimmer" />
          {/* Description bars */}
          <div className="h-3 w-full rounded skeleton-shimmer" />
          <div className="h-3 w-2/3 rounded skeleton-shimmer" />
          {/* Tag row */}
          <div className="flex gap-2 pt-0.5">
            <div className="h-5 w-16 rounded skeleton-shimmer" />
            <div className="h-5 w-20 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  )
}

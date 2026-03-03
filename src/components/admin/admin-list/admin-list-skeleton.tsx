"use client"

interface AdminListSkeletonProps {
  count?: number
  itemHeight?: string
}

export function AdminListSkeleton({
  count = 4,
  itemHeight = "h-24",
}: AdminListSkeletonProps) {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <div key={i} className={`${itemHeight} rounded-xl bg-gray-200`} />
        ))}
      </div>
    </div>
  )
}

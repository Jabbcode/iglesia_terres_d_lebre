import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-foreground mt-2 text-3xl font-bold">{value}</p>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          )}
        </div>
        <div className="bg-amber/10 rounded-lg p-3">
          <Icon className="text-amber size-6" />
        </div>
      </div>
    </div>
  )
}

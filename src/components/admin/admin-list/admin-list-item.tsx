"use client"

import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { ReactNode } from "react"

interface AdminListItemProps {
  id: string
  editHref: string
  activo: boolean
  onToggleActivo: () => void
  onDelete: () => void
  children: ReactNode
  /** Extra content between main content and actions */
  extraActions?: ReactNode
}

export function AdminListItem({
  id,
  editHref,
  activo,
  onToggleActivo,
  onDelete,
  children,
  extraActions,
}: AdminListItemProps) {
  return (
    <div className="group border-border/50 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex-1">{children}</div>

      <div className="flex items-center gap-4">
        {extraActions}

        <div className="flex items-center gap-2">
          <Switch checked={activo} onCheckedChange={onToggleActivo} />
          <span className="text-muted-foreground w-16 text-xs">
            {activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        <div className="flex gap-1">
          <Link href={editHref}>
            <Button size="icon" variant="secondary" className="size-8">
              <Pencil className="size-4" />
            </Button>
          </Link>
          <Button
            size="icon"
            variant="destructive"
            className="size-8"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

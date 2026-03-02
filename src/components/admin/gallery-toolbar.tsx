"use client"

import {
  LayoutGrid,
  Eye,
  Save,
  RotateCcw,
  Square,
  RectangleVertical,
  RectangleHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ViewMode = "grid" | "preview"
export type FilterType = "all" | "normal" | "tall" | "wide"

interface GalleryToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  pendingChanges: number
  onSave: () => void
  onDiscard: () => void
  isSaving: boolean
}

const filterOptions: {
  value: FilterType
  label: string
  icon?: React.ElementType
}[] = [
  { value: "all", label: "Todos" },
  { value: "normal", label: "Normal", icon: Square },
  { value: "tall", label: "Vertical", icon: RectangleVertical },
  { value: "wide", label: "Horizontal", icon: RectangleHorizontal },
]

export function GalleryToolbar({
  viewMode,
  onViewModeChange,
  filter,
  onFilterChange,
  pendingChanges,
  onSave,
  onDiscard,
  isSaving,
}: GalleryToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-white p-3 shadow-sm">
      {/* View mode toggle */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "h-8 gap-1.5 px-3",
              viewMode === "grid" && "bg-amber hover:bg-amber-dark"
            )}
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="size-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
          <Button
            variant={viewMode === "preview" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "h-8 gap-1.5 px-3",
              viewMode === "preview" && "bg-amber hover:bg-amber-dark"
            )}
            onClick={() => onViewModeChange("preview")}
          >
            <Eye className="size-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
        </div>

        {/* Filter buttons */}
        <div className="hidden items-center gap-1 border-l pl-2 sm:flex">
          {filterOptions.map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.value}
                variant={filter === option.value ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-7 gap-1 px-2 text-xs",
                  filter === option.value && "bg-amber/10 text-amber"
                )}
                onClick={() => onFilterChange(option.value)}
              >
                {Icon && <Icon className="size-3.5" />}
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Pending changes badge */}
        {pendingChanges > 0 && (
          <span className="bg-amber/10 text-amber rounded-full px-3 py-1 text-sm font-medium">
            {pendingChanges} cambio{pendingChanges !== 1 && "s"} sin guardar
          </span>
        )}

        {/* Discard button */}
        {pendingChanges > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={onDiscard}
            disabled={isSaving}
          >
            <RotateCcw className="size-4" />
            <span className="hidden sm:inline">Descartar</span>
          </Button>
        )}

        {/* Save button */}
        <Button
          size="sm"
          className={cn(
            "gap-1.5",
            pendingChanges > 0
              ? "bg-amber hover:bg-amber-dark"
              : "bg-gray-300 text-gray-500"
          )}
          onClick={onSave}
          disabled={pendingChanges === 0 || isSaving}
        >
          <Save className="size-4" />
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  )
}

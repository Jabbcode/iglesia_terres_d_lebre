"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { SpanSelector } from "./span-selector"
import { cn } from "@/lib/utils"
import Link from "next/link"

export type SpanType = "normal" | "tall" | "wide"

export interface GalleryImage {
  id: string
  src: string
  alt: string
  span: SpanType
  order: number
  activo: boolean
}

interface GalleryItemProps {
  image: GalleryImage
  hasChanges: boolean
  onSpanChange: (span: SpanType) => void
  onToggleActive: () => void
  onDelete: () => void
  disabled?: boolean
}

export function GalleryItem({
  image,
  hasChanges,
  onSpanChange,
  onToggleActive,
  onDelete,
  disabled,
}: GalleryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all",
        isDragging && "ring-amber z-50 shadow-lg ring-2",
        hasChanges && "ring-amber/50 ring-2",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 flex size-8 cursor-grab items-center justify-center rounded-md bg-white/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-white active:cursor-grabbing"
        aria-label="Arrastrar para reordenar"
      >
        <GripVertical className="size-4 text-gray-500" />
      </button>

      {/* Image */}
      <div className="relative aspect-square">
        <img
          src={image.src}
          alt={image.alt || "Imagen de galeria"}
          className="size-full object-cover"
          draggable={false}
        />
        {/* Hidden overlay */}
        {!image.activo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded bg-black/60 px-2 py-1 text-xs text-white">
              Oculta
            </span>
          </div>
        )}
        {/* Changes indicator */}
        {hasChanges && (
          <div className="absolute top-2 right-2">
            <span className="bg-amber rounded-full px-2 py-0.5 text-xs font-medium text-white">
              Modificado
            </span>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="space-y-2 p-3">
        <p className="text-foreground truncate text-sm font-medium">
          {image.alt || "Sin descripcion"}
        </p>

        <div className="flex items-center justify-between gap-2">
          <SpanSelector
            value={image.span}
            onChange={onSpanChange}
            disabled={disabled}
          />
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">Visible</span>
            <Switch
              checked={image.activo}
              onCheckedChange={onToggleActive}
              disabled={disabled}
              aria-label="Mostrar en galería pública"
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Link href={`/admin/galeria/${image.id}`}>
          <Button size="icon" variant="secondary" className="size-8">
            <Pencil className="size-4" />
          </Button>
        </Link>
        <Button
          size="icon"
          variant="destructive"
          className="size-8"
          onClick={onDelete}
          disabled={disabled}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}

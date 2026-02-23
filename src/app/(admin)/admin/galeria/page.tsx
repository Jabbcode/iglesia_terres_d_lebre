"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, ImagePlus, CheckSquare, Square, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { EmptyState } from "@/components/admin/empty-state"
import { useConfirm } from "@/components/admin/confirm-dialog"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Imagen {
  id: string
  src: string
  alt: string
  span: "normal" | "tall" | "wide"
  order: number
  activo: boolean
}

export default function GaleriaPage() {
  const [imagenes, setImagenes] = useState<Imagen[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [deletingMultiple, setDeletingMultiple] = useState(false)
  const confirm = useConfirm()

  useEffect(() => {
    fetchImagenes()
  }, [])

  const fetchImagenes = async () => {
    try {
      const res = await fetch("/api/admin/galeria")
      const data = await res.json()
      setImagenes(data)
    } catch {
      console.error("Error fetching images")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Eliminar imagen",
      description:
        "¿Estas seguro de eliminar esta imagen? Esta accion no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    })

    if (!confirmed) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/galeria/${id}`, { method: "DELETE" })
      if (res.ok) {
        setImagenes(imagenes.filter((img) => img.id !== id))
      }
    } catch {
      console.error("Error deleting image")
    } finally {
      setDeleting(null)
    }
  }

  const handleDeleteMultiple = async () => {
    if (selectedIds.size === 0) return

    const confirmed = await confirm({
      title: "Eliminar imagenes",
      description: `¿Estas seguro de eliminar ${selectedIds.size} imagen(es)? Esta accion no se puede deshacer.`,
      confirmLabel: `Eliminar ${selectedIds.size}`,
      cancelLabel: "Cancelar",
      variant: "danger",
    })

    if (!confirmed) return

    setDeletingMultiple(true)
    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        fetch(`/api/admin/galeria/${id}`, { method: "DELETE" })
      )
      await Promise.all(deletePromises)
      setImagenes(imagenes.filter((img) => !selectedIds.has(img.id)))
      setSelectedIds(new Set())
      setIsSelectionMode(false)
    } catch {
      console.error("Error deleting images")
    } finally {
      setDeletingMultiple(false)
    }
  }

  const handleToggle = async (id: string, currentValue: boolean) => {
    setToggling(id)
    try {
      const res = await fetch(`/api/admin/galeria/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !currentValue }),
      })
      if (res.ok) {
        setImagenes(
          imagenes.map((img) =>
            img.id === id ? { ...img, activo: !currentValue } : img
          )
        )
      }
    } catch {
      console.error("Error toggling image")
    } finally {
      setToggling(null)
    }
  }

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const selectAll = () => {
    setSelectedIds(new Set(imagenes.map((img) => img.id)))
  }

  const deselectAll = () => {
    setSelectedIds(new Set())
  }

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setSelectedIds(new Set())
    }
    setIsSelectionMode(!isSelectionMode)
  }

  const spanLabels = {
    normal: "Normal",
    tall: "Vertical",
    wide: "Horizontal",
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Galeria</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las imagenes de la galeria
            {imagenes.length > 0 && ` (${imagenes.length} imagenes)`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {imagenes.length > 0 && (
            <Button
              variant={isSelectionMode ? "secondary" : "outline"}
              className="gap-2"
              onClick={toggleSelectionMode}
            >
              {isSelectionMode ? (
                <>
                  <X className="size-4" />
                  Cancelar
                </>
              ) : (
                <>
                  <CheckSquare className="size-4" />
                  Seleccionar
                </>
              )}
            </Button>
          )}
          <Link href="/admin/galeria/masiva">
            <Button variant="outline" className="gap-2">
              <ImagePlus className="size-4" />
              Subir multiples
            </Button>
          </Link>
          <Link href="/admin/galeria/nueva">
            <Button className="bg-amber hover:bg-amber-dark gap-2">
              <Plus className="size-4" />
              Agregar Imagen
            </Button>
          </Link>
        </div>
      </div>

      {/* Selection toolbar */}
      {isSelectionMode && imagenes.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-amber/30 bg-amber/5 p-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedIds.size} de {imagenes.length} seleccionadas
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                disabled={selectedIds.size === imagenes.length}
              >
                Seleccionar todas
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deselectAll}
                disabled={selectedIds.size === 0}
              >
                Deseleccionar
              </Button>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={handleDeleteMultiple}
            disabled={selectedIds.size === 0 || deletingMultiple}
          >
            <Trash2 className="size-4" />
            {deletingMultiple
              ? "Eliminando..."
              : `Eliminar (${selectedIds.size})`}
          </Button>
        </div>
      )}

      {imagenes.length === 0 ? (
        <EmptyState
          variant="galeria"
          title="Sin imagenes"
          description="Agrega fotos para mostrar los momentos especiales de tu comunidad en la galeria del sitio."
          ctaLabel="Agregar primera imagen"
          ctaHref="/admin/galeria/nueva"
        />
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {imagenes.map((imagen) => (
            <div
              key={imagen.id}
              className={cn(
                "group border-border/50 relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all",
                isSelectionMode && "cursor-pointer",
                selectedIds.has(imagen.id) && "ring-2 ring-amber ring-offset-2"
              )}
              onClick={() => isSelectionMode && toggleSelection(imagen.id)}
            >
              {/* Checkbox for selection */}
              {isSelectionMode && (
                <div className="absolute top-2 left-2 z-10">
                  <button
                    type="button"
                    className={cn(
                      "flex size-6 items-center justify-center rounded border-2 transition-colors",
                      selectedIds.has(imagen.id)
                        ? "border-amber bg-amber text-white"
                        : "border-white bg-white/80 text-gray-400 hover:border-amber"
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSelection(imagen.id)
                    }}
                  >
                    {selectedIds.has(imagen.id) ? (
                      <CheckSquare className="size-4" />
                    ) : (
                      <Square className="size-4" />
                    )}
                  </button>
                </div>
              )}

              {/* Image - uniform square */}
              <div className="relative aspect-square">
                <img
                  src={imagen.src}
                  alt={imagen.alt || "Imagen de galeria"}
                  className="size-full object-cover"
                />
                {/* Inactive overlay */}
                {!imagen.activo && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                      Inactiva
                    </span>
                  </div>
                )}
              </div>

              {/* Info bar */}
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {imagen.alt || "Sin descripcion"}
                    </p>
                    <span className="bg-amber/10 text-amber text-xs rounded px-1.5 py-0.5">
                      {spanLabels[imagen.span]}
                    </span>
                  </div>
                  {!isSelectionMode && (
                    <Switch
                      checked={imagen.activo}
                      onCheckedChange={() =>
                        handleToggle(imagen.id, imagen.activo)
                      }
                      disabled={toggling === imagen.id}
                    />
                  )}
                </div>
              </div>

              {/* Action buttons (only in non-selection mode) */}
              {!isSelectionMode && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link href={`/admin/galeria/${imagen.id}`}>
                    <Button size="icon" variant="secondary" className="size-8">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="size-8"
                    onClick={() => handleDelete(imagen.id)}
                    disabled={deleting === imagen.id}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

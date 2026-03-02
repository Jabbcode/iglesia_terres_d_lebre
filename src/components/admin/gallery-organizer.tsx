"use client"

import { useEffect } from "react"
import { Plus, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/admin/empty-state"
import { useConfirm } from "@/components/admin/confirm-dialog"
import { GalleryToolbar } from "./gallery-toolbar"
import { GalleryGrid } from "./gallery-grid"
import { GalleryPreview } from "./gallery-preview"
import { useGalleryOrganizer } from "@/hooks/use-gallery-organizer"
import Link from "next/link"

export function GalleryOrganizer() {
  const confirm = useConfirm()

  const {
    images,
    filteredImages,
    viewMode,
    filter,
    changedIds,
    pendingChanges,
    isSaving,
    isLoading,
    hasUnsavedChanges,
    setViewMode,
    setFilter,
    handleReorder,
    handleSpanChange,
    handleToggleActive,
    handleDelete,
    handleSave,
    handleDiscard,
  } = useGalleryOrganizer({
    onDeleteImage: async (id) => {
      const confirmed = await confirm({
        title: "Eliminar imagen",
        description:
          "¿Estas seguro de eliminar esta imagen? Esta accion no se puede deshacer.",
        confirmLabel: "Eliminar",
        cancelLabel: "Cancelar",
        variant: "danger",
      })

      if (!confirmed) {
        throw new Error("Cancelled")
      }

      const res = await fetch(`/api/admin/galeria/${id}`, { method: "DELETE" })
      if (!res.ok) {
        throw new Error("Error deleting image")
      }
    },
  })

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Handle discard with confirmation
  const handleDiscardWithConfirm = async () => {
    const confirmed = await confirm({
      title: "Descartar cambios",
      description: `¿Estas seguro de descartar ${pendingChanges} cambio${pendingChanges !== 1 ? "s" : ""}? Esta accion no se puede deshacer.`,
      confirmLabel: "Descartar",
      cancelLabel: "Cancelar",
      variant: "danger",
    })

    if (confirmed) {
      handleDiscard()
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-48 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-36 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
        {/* Toolbar skeleton */}
        <div className="h-14 animate-pulse rounded-lg bg-gray-200" />
        {/* Grid skeleton */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Galeria</h1>
          <p className="text-muted-foreground mt-1">
            Organiza las imagenes de la galeria
            {images.length > 0 && ` (${images.length} imagenes)`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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

      {images.length === 0 ? (
        <EmptyState
          variant="galeria"
          title="Sin imagenes"
          description="Agrega fotos para mostrar los momentos especiales de tu comunidad en la galeria del sitio."
          ctaLabel="Agregar primera imagen"
          ctaHref="/admin/galeria/nueva"
        />
      ) : (
        <>
          {/* Toolbar */}
          <GalleryToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filter={filter}
            onFilterChange={setFilter}
            pendingChanges={pendingChanges}
            onSave={handleSave}
            onDiscard={handleDiscardWithConfirm}
            isSaving={isSaving}
          />

          {/* Content based on view mode */}
          {viewMode === "grid" ? (
            <GalleryGrid
              images={filteredImages}
              changedIds={changedIds}
              onReorder={handleReorder}
              onSpanChange={handleSpanChange}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
              disabled={isSaving}
            />
          ) : (
            <GalleryPreview images={images} changedIds={changedIds} />
          )}

          {/* Filter info */}
          {filter !== "all" && (
            <p className="text-muted-foreground text-center text-sm">
              Mostrando {filteredImages.length} de {images.length} imagenes
            </p>
          )}
        </>
      )}
    </div>
  )
}

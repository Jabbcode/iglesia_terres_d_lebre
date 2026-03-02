"use client"

import { GalleryImage } from "./gallery-item"
import { cn } from "@/lib/utils"

interface GalleryPreviewProps {
  images: GalleryImage[]
  changedIds: Set<string>
}

export function GalleryPreview({ images, changedIds }: GalleryPreviewProps) {
  // Filter only active images for preview (like public gallery)
  const activeImages = images.filter((img) => img.activo)

  if (activeImages.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
        <p className="text-muted-foreground">
          No hay imagenes activas para mostrar
        </p>
      </div>
    )
  }

  return (
    <div className="bg-cream rounded-xl border p-4">
      <div className="mb-4 text-center">
        <span className="bg-amber/10 text-amber rounded-full px-3 py-1 text-sm font-medium">
          Vista previa (como se vera en la web)
        </span>
      </div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {activeImages.map((image) => (
          <div key={image.id} className="mb-4 break-inside-avoid">
            <div
              className={cn(
                "relative overflow-hidden rounded-xl",
                changedIds.has(image.id) && "ring-amber ring-2 ring-offset-2"
              )}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={cn(
                  "w-full object-cover",
                  image.span === "tall"
                    ? "aspect-[3/4]"
                    : image.span === "wide"
                      ? "aspect-[4/3]"
                      : "aspect-square"
                )}
              />
              {/* Hover overlay similar to public */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100">
                <p className="p-4 text-sm font-medium text-white">
                  {image.alt || "Sin descripcion"}
                </p>
              </div>
              {/* Modified indicator */}
              {changedIds.has(image.id) && (
                <div className="absolute top-2 right-2">
                  <span className="bg-amber rounded-full px-2 py-0.5 text-xs font-medium text-white">
                    Modificado
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

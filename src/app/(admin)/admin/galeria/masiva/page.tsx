"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MultiImageUpload } from "@/components/admin/multi-image-upload"

export default function SubidaMasivaPage() {
  const router = useRouter()
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleUploadComplete = (urls: string[]) => {
    setUploadedUrls((prev) => [...prev, ...urls])
    setError(null)
  }

  const handleError = (message: string) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }

  const handleCreateGalleryImages = async () => {
    if (uploadedUrls.length === 0) {
      setError("No hay imagenes para agregar a la galeria")
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const res = await fetch("/api/admin/galeria/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: uploadedUrls.map((url) => ({ src: url })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al crear registros")
      }

      const data = await res.json()
      setSuccess(`${data.count} imagen(es) agregadas a la galeria`)
      setUploadedUrls([])

      setTimeout(() => {
        router.push("/admin/galeria")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/galeria"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Volver a galeria
        </Link>
        <h1 className="text-foreground text-2xl font-bold">Subir imagenes</h1>
        <p className="text-muted-foreground mt-1">
          Sube hasta 10 imagenes a la vez. Todas quedaran inactivas por defecto.
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="size-5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle className="size-5 shrink-0" />
          {success}
        </div>
      )}

      <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
        <MultiImageUpload
          onUploadComplete={handleUploadComplete}
          onError={handleError}
          folder="galeria"
          maxFiles={10}
          maxSizeMB={5}
        />

        {/* Uploaded URLs summary */}
        {uploadedUrls.length > 0 && (
          <div className="border-border mt-6 border-t pt-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-foreground text-sm font-medium">
                {uploadedUrls.length} imagen(es) lista(s) para agregar a la
                galeria
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setUploadedUrls([])}
                className="text-red-600 hover:text-red-700"
              >
                Limpiar
              </Button>
            </div>

            <div className="mb-4 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
              {uploadedUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="aspect-square overflow-hidden rounded bg-gray-100"
                >
                  <img
                    src={url}
                    alt={`Uploaded ${idx + 1}`}
                    className="size-full object-cover"
                  />
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={handleCreateGalleryImages}
              disabled={isCreating}
              className="w-full gap-2 bg-green-600 hover:bg-green-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creando registros...
                </>
              ) : (
                <>
                  <ImagePlus className="size-5" />
                  Agregar {uploadedUrls.length} imagen(es) a la galeria
                </>
              )}
            </Button>

            <p className="text-muted-foreground mt-2 text-center text-xs">
              Las imagenes quedaran inactivas. Edita cada una para configurar
              alt, tipo y activarlas.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

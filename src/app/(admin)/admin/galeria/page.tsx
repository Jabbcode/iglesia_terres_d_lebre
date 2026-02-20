"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface Imagen {
  id: string
  src: string
  alt: string
  span: "normal" | "tall" | "wide"
  order: number
}

export default function GaleriaPage() {
  const [imagenes, setImagenes] = useState<Imagen[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

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
    if (!confirm("¿Estas seguro de eliminar esta imagen?")) return

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

  const spanLabels = {
    normal: "Normal",
    tall: "Vertical",
    wide: "Horizontal",
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Galeria</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las imagenes de la galeria
          </p>
        </div>
        <Link href="/admin/galeria/nueva">
          <Button className="bg-amber hover:bg-amber-dark gap-2">
            <Plus className="size-4" />
            Agregar Imagen
          </Button>
        </Link>
      </div>

      {imagenes.length === 0 ? (
        <div className="border-border/50 flex flex-col items-center justify-center rounded-xl border bg-white p-12 shadow-sm">
          <ImageIcon className="text-muted-foreground/50 size-12" />
          <p className="text-muted-foreground mt-4">
            No hay imagenes en la galeria
          </p>
          <Link href="/admin/galeria/nueva" className="mt-4">
            <Button variant="outline" className="gap-2">
              <Plus className="size-4" />
              Agregar primera imagen
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {imagenes.map((imagen) => (
            <div
              key={imagen.id}
              className="group border-border/50 relative overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <div className="relative aspect-video">
                <img
                  src={imagen.src}
                  alt={imagen.alt}
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-foreground truncate font-medium">
                  {imagen.alt}
                </p>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                  <span className="bg-amber/10 text-amber rounded px-2 py-0.5">
                    {spanLabels[imagen.span]}
                  </span>
                  <span>Orden: {imagen.order}</span>
                </div>
              </div>
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

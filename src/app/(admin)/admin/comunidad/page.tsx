"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TarjetaComunidad {
  id: string
  titulo: string
  descripcion: string
  imagen: string
  linkHref: string | null
  linkLabel: string | null
  order: number
  activo: boolean
}

export default function ComunidadPage() {
  const [tarjetas, setTarjetas] = useState<TarjetaComunidad[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchTarjetas()
  }, [])

  const fetchTarjetas = async () => {
    try {
      const res = await fetch("/api/admin/comunidad")
      const data = await res.json()
      setTarjetas(data)
    } catch {
      console.error("Error fetching community cards")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estas seguro de eliminar esta tarjeta?")) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/comunidad/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setTarjetas(tarjetas.filter((t) => t.id !== id))
      }
    } catch {
      console.error("Error deleting community card")
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Tarjetas de Comunidad
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las tarjetas de la seccion &quot;Nuestra Comunidad&quot;
          </p>
        </div>
        <Link href="/admin/comunidad/nueva">
          <Button className="bg-amber hover:bg-amber-dark gap-2">
            <Plus className="size-4" />
            Agregar Tarjeta
          </Button>
        </Link>
      </div>

      {tarjetas.length === 0 ? (
        <div className="border-border/50 flex flex-col items-center justify-center rounded-xl border bg-white p-12 shadow-sm">
          <Users className="text-muted-foreground/50 size-12" />
          <p className="text-muted-foreground mt-4">
            No hay tarjetas configuradas
          </p>
          <Link href="/admin/comunidad/nueva" className="mt-4">
            <Button variant="outline" className="gap-2">
              <Plus className="size-4" />
              Agregar primera tarjeta
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tarjetas.map((tarjeta) => (
            <div
              key={tarjeta.id}
              className="group border-border/50 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div
                  className="size-16 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url('${tarjeta.imagen}')` }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-foreground font-semibold">
                      {tarjeta.titulo}
                    </h3>
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        tarjeta.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tarjeta.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-1 text-sm">
                    {tarjeta.descripcion}
                  </p>
                  {tarjeta.linkLabel && (
                    <p className="text-amber mt-1 text-xs font-medium">
                      {tarjeta.linkLabel}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  Orden: {tarjeta.order}
                </span>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link href={`/admin/comunidad/${tarjeta.id}`}>
                    <Button size="icon" variant="secondary" className="size-8">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="size-8"
                    onClick={() => handleDelete(tarjeta.id)}
                    disabled={deleting === tarjeta.id}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

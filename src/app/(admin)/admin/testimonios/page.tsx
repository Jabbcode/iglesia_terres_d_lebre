"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { EmptyState } from "@/components/admin/empty-state"
import Link from "next/link"

interface Testimonio {
  id: string
  nombre: string
  descripcion: string
  videoUrl: string
  thumbnail: string
  order: number
  activo: boolean
}

export default function TestimoniosPage() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    fetchTestimonios()
  }, [])

  const fetchTestimonios = async () => {
    try {
      const res = await fetch("/api/admin/testimonios")
      const data = await res.json()
      setTestimonios(data)
    } catch {
      console.error("Error fetching testimonios")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estas seguro de eliminar este testimonio?")) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/testimonios/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setTestimonios(testimonios.filter((t) => t.id !== id))
      }
    } catch {
      console.error("Error deleting testimonio")
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleActivo = async (id: string, currentActivo: boolean) => {
    setToggling(id)
    try {
      const res = await fetch(`/api/admin/testimonios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !currentActivo }),
      })
      if (res.ok) {
        setTestimonios(
          testimonios.map((t) =>
            t.id === id ? { ...t, activo: !currentActivo } : t
          )
        )
      }
    } catch {
      console.error("Error toggling testimonio")
    } finally {
      setToggling(null)
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
          <h1 className="text-foreground text-2xl font-bold">Testimonios</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los testimonios de la pagina &quot;Nosotros&quot;
          </p>
        </div>
        <Link href="/admin/testimonios/nuevo">
          <Button className="bg-amber hover:bg-amber-dark gap-2">
            <Plus className="size-4" />
            Agregar Testimonio
          </Button>
        </Link>
      </div>

      {testimonios.length === 0 ? (
        <EmptyState
          variant="testimonios"
          title="Sin testimonios"
          description="Comparte las historias de fe y transformacion de los miembros de tu comunidad."
          ctaLabel="Agregar primer testimonio"
          ctaHref="/admin/testimonios/nuevo"
        />
      ) : (
        <div className="space-y-3">
          {testimonios.map((testimonio) => (
            <div
              key={testimonio.id}
              className="group border-border/50 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div
                  className="size-16 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url('${testimonio.thumbnail}')` }}
                />
                <div>
                  <h3 className="text-foreground font-semibold">
                    {testimonio.nombre}
                  </h3>
                  <p className="text-muted-foreground line-clamp-1 text-sm">
                    {testimonio.descripcion}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground text-sm">
                  Orden: {testimonio.order}
                </span>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={testimonio.activo}
                    onCheckedChange={() =>
                      handleToggleActivo(testimonio.id, testimonio.activo)
                    }
                    disabled={toggling === testimonio.id}
                  />
                  <span className="text-muted-foreground w-14 text-xs">
                    {testimonio.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link href={`/admin/testimonios/${testimonio.id}`}>
                    <Button size="icon" variant="secondary" className="size-8">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="size-8"
                    onClick={() => handleDelete(testimonio.id)}
                    disabled={deleting === testimonio.id}
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

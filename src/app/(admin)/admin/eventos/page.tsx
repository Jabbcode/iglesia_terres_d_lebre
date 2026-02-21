"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

interface Evento {
  id: string
  nombre: string
  descripcion: string | null
  fecha: string
  horaInicio: string
  horaFin: string | null
  ubicacion: string | null
  activo: boolean
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    fetchEventos()
  }, [])

  const fetchEventos = async () => {
    try {
      const res = await fetch("/api/admin/eventos")
      const data = await res.json()
      setEventos(data)
    } catch {
      console.error("Error fetching events")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estas seguro de eliminar este evento?")) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/eventos/${id}`, { method: "DELETE" })
      if (res.ok) {
        setEventos(eventos.filter((e) => e.id !== id))
      }
    } catch {
      console.error("Error deleting event")
    } finally {
      setDeleting(null)
    }
  }

  const handleToggle = async (id: string, currentValue: boolean) => {
    setToggling(id)
    try {
      const res = await fetch(`/api/admin/eventos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !currentValue }),
      })
      if (res.ok) {
        setEventos(
          eventos.map((e) =>
            e.id === id ? { ...e, activo: !currentValue } : e
          )
        )
      }
    } catch {
      console.error("Error toggling evento")
    } finally {
      setToggling(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
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
          <h1 className="text-foreground text-2xl font-bold">Eventos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los eventos de la iglesia
          </p>
        </div>
        <Link href="/admin/eventos/nuevo">
          <Button className="bg-amber hover:bg-amber-dark gap-2">
            <Plus className="size-4" />
            Agregar Evento
          </Button>
        </Link>
      </div>

      {eventos.length === 0 ? (
        <div className="border-border/50 flex flex-col items-center justify-center rounded-xl border bg-white p-12 shadow-sm">
          <Calendar className="text-muted-foreground/50 size-12" />
          <p className="text-muted-foreground mt-4">
            No hay eventos registrados
          </p>
          <Link href="/admin/eventos/nuevo" className="mt-4">
            <Button variant="outline" className="gap-2">
              <Plus className="size-4" />
              Agregar primer evento
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="group border-border/50 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex-1">
                <h3 className="text-foreground font-semibold">
                  {evento.nombre}
                </h3>
                {evento.descripcion && (
                  <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                    {evento.descripcion}
                  </p>
                )}
                <div className="text-muted-foreground mt-2 flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {formatDate(evento.fecha)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {evento.horaInicio}
                    {evento.horaFin && ` - ${evento.horaFin}`}
                  </span>
                  {evento.ubicacion && (
                    <span className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      {evento.ubicacion}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={evento.activo}
                  onCheckedChange={() => handleToggle(evento.id, evento.activo)}
                  disabled={toggling === evento.id}
                />
                <span className="text-muted-foreground w-16 text-xs">
                  {evento.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Link href={`/admin/eventos/${evento.id}`}>
                  <Button size="icon" variant="secondary" className="size-8">
                    <Pencil className="size-4" />
                  </Button>
                </Link>
                <Button
                  size="icon"
                  variant="destructive"
                  className="size-8"
                  onClick={() => handleDelete(evento.id)}
                  disabled={deleting === evento.id}
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

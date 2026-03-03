"use client"

import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { EmptyState } from "@/components/admin/empty-state"
import { useConfirm } from "@/components/admin/confirm-dialog"
import { useAdminData } from "@/hooks/use-admin-data"
import { formatearPeriodicidad } from "@/lib/event-utils"
import Link from "next/link"
import type { Evento } from "@/modules/eventos"
import { PERIODICIDAD } from "@/lib/constants"

export default function EventosPage() {
  const {
    data: eventos,
    isLoading,
    toggleField,
    deleteItem,
  } = useAdminData<Evento>({
    endpoint: "/api/admin/eventos",
  })
  const confirm = useConfirm()

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Eliminar evento",
      description:
        "¿Estas seguro de eliminar este evento? Esta accion no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    })

    if (!confirmed) return

    try {
      await deleteItem(id)
    } catch {
      console.error("Error deleting event")
    }
  }

  const handleToggle = (id: string, currentValue: boolean) => {
    toggleField(id, "activo", currentValue).catch(() => {
      console.error("Error toggling evento")
    })
  }

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (isLoading) {
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
        <EmptyState
          variant="eventos"
          title="Sin eventos"
          description="Crea eventos para mantener a tu comunidad informada sobre las proximas actividades y celebraciones."
          ctaLabel="Crear primer evento"
          ctaHref="/admin/eventos/nuevo"
        />
      ) : (
        <div className="space-y-3">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="group border-border/50 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground font-semibold">
                    {evento.nombre}
                  </h3>
                  {evento.periodicidad !== PERIODICIDAD.NINGUNA && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      <RefreshCw className="size-3" />
                      {formatearPeriodicidad(evento.periodicidad)}
                    </span>
                  )}
                </div>
                {evento.descripcion && (
                  <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                    {evento.descripcion}
                  </p>
                )}
                <div className="text-muted-foreground mt-2 flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {formatDate(evento.fecha)}
                    {evento.periodicidad !== PERIODICIDAD.NINGUNA &&
                      " (fecha base)"}
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

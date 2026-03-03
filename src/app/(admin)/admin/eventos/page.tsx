"use client"

import { Calendar, MapPin, Clock, RefreshCw } from "lucide-react"
import { EmptyState } from "@/components/admin/empty-state"
import {
  AdminListHeader,
  AdminListSkeleton,
  AdminListItem,
} from "@/components/admin/admin-list"
import { useAdminData } from "@/hooks/use-admin-data"
import { useDeleteConfirm } from "@/hooks/use-delete-confirm"
import { formatearPeriodicidad } from "@/lib/event-utils"
import type { Evento } from "@/modules/eventos"

const PERIODICIDAD = {
  NINGUNA: "ninguna",
  SEMANAL: "semanal",
  QUINCENAL: "quincenal",
  MENSUAL: "mensual",
  ANUAL: "anual",
} as const

export default function EventosPage() {
  const { data: eventos, isLoading, toggleField, deleteItem } =
    useAdminData<Evento>({
      endpoint: "/api/admin/eventos",
    })

  const { handleDelete } = useDeleteConfirm({
    title: "Eliminar evento",
    description:
      "¿Estas seguro de eliminar este evento? Esta accion no se puede deshacer.",
    onDelete: deleteItem,
  })

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
    return <AdminListSkeleton count={4} />
  }

  return (
    <div>
      <AdminListHeader
        title="Eventos"
        description="Gestiona los eventos de la iglesia"
        createHref="/admin/eventos/nuevo"
        createLabel="Agregar Evento"
      />

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
            <AdminListItem
              key={evento.id}
              id={evento.id}
              editHref={`/admin/eventos/${evento.id}`}
              activo={evento.activo}
              onToggleActivo={() => handleToggle(evento.id, evento.activo)}
              onDelete={() => handleDelete(evento.id)}
            >
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
            </AdminListItem>
          ))}
        </div>
      )}
    </div>
  )
}

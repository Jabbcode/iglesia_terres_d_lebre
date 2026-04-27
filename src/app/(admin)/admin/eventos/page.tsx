"use client"

import { Calendar, MapPin, Clock, RefreshCw, Edit, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/admin/empty-state"
import { AdminListHeader, AdminListSkeleton } from "@/components/admin/admin-list"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useAdminData } from "@/hooks/use-admin-data"
import { useDeleteConfirm } from "@/hooks/use-delete-confirm"
import { formatearPeriodicidad } from "@/lib/event-utils"
import { useRouter } from "next/navigation"
import type { Evento } from "@/modules/eventos"
import { PERIODICIDAD } from "@/lib/constants"

export default function EventosPage() {
  const router = useRouter()
  const {
    data: eventos,
    isLoading,
    toggleField,
    deleteItem,
  } = useAdminData<Evento>({
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
            <div
              key={evento.id}
              className="border-border/50 rounded-lg border bg-white shadow-sm"
            >
              <div className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="bg-amber/10 text-amber flex size-12 items-center justify-center rounded-lg flex-shrink-0">
                    <Calendar className="size-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-foreground font-semibold truncate">
                        {evento.nombre}
                      </h3>
                      {evento.periodicidad !== PERIODICIDAD.NINGUNA && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 flex-shrink-0">
                          <RefreshCw className="size-3" />
                          {formatearPeriodicidad(evento.periodicidad)}
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground mt-1 flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {formatDate(evento.fecha)}
                        {evento.periodicidad !== PERIODICIDAD.NINGUNA && " (base)"}
                        {" · "}
                        {evento.horaInicio}
                        {evento.horaFin && ` - ${evento.horaFin}`}
                      </span>
                      {evento.ubicacion && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {evento.ubicacion}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Switch
                    checked={evento.activo}
                    onCheckedChange={() => handleToggle(evento.id, evento.activo)}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/eventos/${evento.id}`)}
                      className="text-amber hover:bg-amber/10 hover:text-amber cursor-pointer"
                      title="Editar"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(evento.id)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

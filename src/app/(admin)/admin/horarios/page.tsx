"use client"

import {
  Clock,
  Church,
  BookOpen,
  HeartHandshake,
  Users,
  Music,
  Mic2,
  Sun,
  Moon,
  Star,
  Smile,
  Calendar,
  LucideIcon,
} from "lucide-react"
import { EmptyState } from "@/components/admin/empty-state"
import {
  AdminListHeader,
  AdminListSkeleton,
  AdminListItem,
} from "@/components/admin/admin-list"
import { useAdminData } from "@/hooks/use-admin-data"
import { useDeleteConfirm } from "@/hooks/use-delete-confirm"
import type { Horario } from "@/modules/horarios"

const iconMap: Record<string, LucideIcon> = {
  Church,
  BookOpen,
  HeartHandshake,
  Users,
  Music,
  Mic2,
  Sun,
  Moon,
  Star,
  Smile,
  Calendar,
  Clock,
}

export default function HorariosPage() {
  const { data: horarios, isLoading, toggleField, deleteItem } =
    useAdminData<Horario>({
      endpoint: "/api/admin/horarios",
    })

  const { handleDelete } = useDeleteConfirm({
    title: "Eliminar horario",
    description:
      "¿Estas seguro de eliminar este horario? Esta accion no se puede deshacer.",
    onDelete: deleteItem,
  })

  const handleToggle = (id: string, currentValue: boolean) => {
    toggleField(id, "activo", currentValue).catch(() => {
      console.error("Error toggling horario")
    })
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Clock
    return <IconComponent className="size-5" />
  }

  if (isLoading) {
    return <AdminListSkeleton count={4} itemHeight="h-20" />
  }

  return (
    <div>
      <AdminListHeader
        title="Horarios de Servicios"
        description="Gestiona los horarios de servicios de la iglesia"
        createHref="/admin/horarios/nuevo"
        createLabel="Agregar Horario"
      />

      {horarios.length === 0 ? (
        <EmptyState
          variant="horarios"
          title="Sin horarios"
          description="Configura los horarios de los servicios y actividades para que tu comunidad sepa cuando reunirse."
          ctaLabel="Agregar primer horario"
          ctaHref="/admin/horarios/nuevo"
        />
      ) : (
        <div className="space-y-3">
          {horarios.map((horario) => (
            <AdminListItem
              key={horario.id}
              id={horario.id}
              editHref={`/admin/horarios/${horario.id}`}
              activo={horario.activo}
              onToggleActivo={() => handleToggle(horario.id, horario.activo)}
              onDelete={() => handleDelete(horario.id)}
              extraActions={
                <span className="text-muted-foreground text-sm">
                  Orden: {horario.order}
                </span>
              }
            >
              <div className="flex items-center gap-4">
                <div className="bg-amber/10 text-amber flex size-12 items-center justify-center rounded-lg">
                  {getIcon(horario.icono)}
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">
                    {horario.titulo}
                  </h3>
                  {horario.descripcion && (
                    <p className="text-muted-foreground text-sm">
                      {horario.descripcion}
                    </p>
                  )}
                  <p className="text-muted-foreground mt-1 text-sm">
                    {horario.dia} - {horario.hora}
                  </p>
                </div>
              </div>
            </AdminListItem>
          ))}
        </div>
      )}
    </div>
  )
}

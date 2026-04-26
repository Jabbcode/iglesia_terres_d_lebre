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
import { useRouter } from "next/navigation"
import { EmptyState } from "@/components/admin/empty-state"
import { AdminListHeader } from "@/components/admin/admin-list"
import { useAdminData } from "@/hooks/use-admin-data"
import { useDeleteConfirm } from "@/hooks/use-delete-confirm"
import { DraggableHorarios } from "@/components/admin/draggable-horarios"
import { api } from "@/shared/api"
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
  const router = useRouter()
  const {
    data: horarios,
    isLoading,
    toggleField,
    deleteItem,
  } = useAdminData<Horario>({
    endpoint: "/api/admin/horarios",
  })

  const { handleDelete } = useDeleteConfirm({
    title: "Eliminar horario",
    description:
      "¿Estás seguro de eliminar este horario? Esta acción no se puede deshacer.",
    onDelete: deleteItem,
  })

  const handleToggle = (id: string, currentValue: boolean) => {
    console.log({ id, currentValue })
    toggleField(id, "activo", currentValue).catch(() => {
      console.error("Error toggling horario")
    })
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Clock
    return <IconComponent className="size-5" />
  }

  const handleReorder = async (newHorarios: Horario[]) => {
    try {
      await api.patch("/api/admin/horarios/reorder", {
        horarios: newHorarios.map((h) => ({
          id: h.id,
          order: h.order,
        })),
      })
    } catch (error) {
      console.error("Error al reordenar horarios:", error)
      throw error
    }
  }

  // Ordenar horarios por campo order
  const horariosOrdenados = [...horarios].sort((a, b) => a.order - b.order)

  return (
    <div>
      <AdminListHeader
        title="Horarios de Servicios"
        description="Arrastra para reordenar. El orden se mostrará en la página pública."
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
        <DraggableHorarios
          horarios={horariosOrdenados}
          isLoading={isLoading}
          getIcon={getIcon}
          onEdit={(id) => router.push(`/admin/horarios/${id}`)}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onReorder={handleReorder}
        />
      )}
    </div>
  )
}

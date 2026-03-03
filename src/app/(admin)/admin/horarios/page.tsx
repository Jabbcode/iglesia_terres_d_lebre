"use client"

import {
  Plus,
  Pencil,
  Trash2,
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
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { EmptyState } from "@/components/admin/empty-state"
import { useConfirm } from "@/components/admin/confirm-dialog"
import { useAdminData } from "@/hooks/use-admin-data"
import Link from "next/link"
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
  const {
    data: horarios,
    isLoading,
    toggleField,
    deleteItem,
  } = useAdminData<Horario>({
    endpoint: "/api/admin/horarios",
  })
  const confirm = useConfirm()

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Eliminar horario",
      description:
        "¿Estas seguro de eliminar este horario? Esta accion no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    })

    if (!confirmed) return

    try {
      await deleteItem(id)
    } catch {
      console.error("Error deleting schedule")
    }
  }

  const handleToggle = (
    id: string,
    field: "activo" | "mostrarDetalle",
    currentValue: boolean
  ) => {
    toggleField(id, field, currentValue).catch(() => {
      console.error("Error toggling horario")
    })
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Clock
    return <IconComponent className="size-5" />
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-200" />
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
            Horarios de Servicios
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los horarios de servicios de la iglesia
          </p>
        </div>
        <Link href="/admin/horarios/nuevo">
          <Button className="bg-amber hover:bg-amber-dark gap-2">
            <Plus className="size-4" />
            Agregar Horario
          </Button>
        </Link>
      </div>

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
            <div
              key={horario.id}
              className="group border-border/50 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
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
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={horario.activo}
                    onCheckedChange={() =>
                      handleToggle(horario.id, "activo", horario.activo)
                    }
                  />
                  <span className="text-muted-foreground w-16 text-xs">
                    {horario.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">
                  Orden: {horario.order}
                </span>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link href={`/admin/horarios/${horario.id}`}>
                    <Button size="icon" variant="secondary" className="size-8">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="size-8"
                    onClick={() => handleDelete(horario.id)}
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

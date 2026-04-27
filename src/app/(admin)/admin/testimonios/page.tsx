"use client"

import { MessageSquareQuote, Edit, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/admin/empty-state"
import { AdminListHeader, AdminListSkeleton } from "@/components/admin/admin-list"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useAdminData } from "@/hooks/use-admin-data"
import { useDeleteConfirm } from "@/hooks/use-delete-confirm"
import { useRouter } from "next/navigation"
import type { Testimonio } from "@/modules/testimonios"

export default function TestimoniosPage() {
  const router = useRouter()
  const {
    data: testimonios,
    isLoading,
    toggleField,
    deleteItem,
  } = useAdminData<Testimonio>({
    endpoint: "/api/admin/testimonios",
  })

  const { handleDelete } = useDeleteConfirm({
    title: "Eliminar testimonio",
    description: "¿Estas seguro de eliminar este testimonio? Esta accion no se puede deshacer.",
    onDelete: deleteItem,
  })

  const handleToggle = (id: string, currentValue: boolean) => {
    toggleField(id, "activo", currentValue).catch(() => {
      console.error("Error toggling testimonio")
    })
  }

  if (isLoading) {
    return <AdminListSkeleton count={3} />
  }

  return (
    <div>
      <AdminListHeader
        title="Testimonios"
        description='Gestiona los testimonios de la pagina "Nosotros"'
        createHref="/admin/testimonios/nuevo"
        createLabel="Agregar Testimonio"
      />

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
              className="border-border/50 rounded-lg border bg-white shadow-sm"
            >
              <div className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {testimonio.thumbnail ? (
                    <div
                      className="size-12 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url('${testimonio.thumbnail}')` }}
                    />
                  ) : (
                    <div className="bg-amber/10 text-amber flex size-12 items-center justify-center rounded-lg flex-shrink-0">
                      <MessageSquareQuote className="size-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-semibold truncate">
                      {testimonio.nombre}
                    </h3>
                    <p className="text-muted-foreground line-clamp-1 text-sm">
                      {testimonio.descripcion}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Switch
                    checked={testimonio.activo}
                    onCheckedChange={() => handleToggle(testimonio.id, testimonio.activo)}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/testimonios/${testimonio.id}`)}
                      className="text-amber hover:bg-amber/10 hover:text-amber cursor-pointer"
                      title="Editar"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(testimonio.id)}
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

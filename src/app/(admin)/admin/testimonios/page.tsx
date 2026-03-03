"use client"

import { EmptyState } from "@/components/admin/empty-state"
import {
  AdminListHeader,
  AdminListSkeleton,
  AdminListItem,
} from "@/components/admin/admin-list"
import { useAdminData } from "@/hooks/use-admin-data"
import { useDeleteConfirm } from "@/hooks/use-delete-confirm"
import type { Testimonio } from "@/modules/testimonios"

export default function TestimoniosPage() {
  const { data: testimonios, isLoading, toggleField, deleteItem } =
    useAdminData<Testimonio>({
      endpoint: "/api/admin/testimonios",
    })

  const { handleDelete } = useDeleteConfirm({
    title: "Eliminar testimonio",
    description:
      "¿Estas seguro de eliminar este testimonio? Esta accion no se puede deshacer.",
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
            <AdminListItem
              key={testimonio.id}
              id={testimonio.id}
              editHref={`/admin/testimonios/${testimonio.id}`}
              activo={testimonio.activo}
              onToggleActivo={() => handleToggle(testimonio.id, testimonio.activo)}
              onDelete={() => handleDelete(testimonio.id)}
              extraActions={
                <span className="text-muted-foreground text-sm">
                  Orden: {testimonio.order}
                </span>
              }
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
            </AdminListItem>
          ))}
        </div>
      )}
    </div>
  )
}

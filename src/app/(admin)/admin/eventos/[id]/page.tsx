"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const eventoSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string(),
  fecha: z.string().min(1, "Fecha requerida"),
  horaInicio: z.string().min(1, "Hora de inicio requerida"),
  horaFin: z.string(),
  ubicacion: z.string(),
  activo: z.boolean(),
})

type EventoForm = z.infer<typeof eventoSchema>

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

export default function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventoForm>({
    resolver: zodResolver(eventoSchema),
  })

  useEffect(() => {
    fetch("/api/admin/eventos")
      .then((res) => res.json())
      .then((data: Evento[]) => {
        const evento = data.find((e) => e.id === id)
        if (evento) {
          const fechaDate = new Date(evento.fecha)
          reset({
            nombre: evento.nombre,
            descripcion: evento.descripcion || "",
            fecha: fechaDate.toISOString().split("T")[0],
            horaInicio: evento.horaInicio,
            horaFin: evento.horaFin || "",
            ubicacion: evento.ubicacion || "",
            activo: evento.activo,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: EventoForm) => {
    setSaving(true)
    setError(null)

    try {
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        fecha: new Date(data.fecha).toISOString(),
        horaInicio: data.horaInicio,
        horaFin: data.horaFin || null,
        ubicacion: data.ubicacion || null,
        activo: data.activo,
      }

      const res = await fetch(`/api/admin/eventos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push("/admin/eventos")
      } else {
        setError("Error al actualizar el evento")
      }
    } catch {
      setError("Error de conexion")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Estas seguro de eliminar este evento?")) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/eventos/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/admin/eventos")
      }
    } catch {
      setError("Error al eliminar")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-96 max-w-2xl rounded-xl bg-gray-200" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/eventos"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Volver a eventos
        </Link>
        <h1 className="text-foreground text-2xl font-bold">Editar Evento</h1>
        <p className="text-muted-foreground mt-1">
          Modifica los datos del evento
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Nombre del Evento
              </label>
              <input
                {...register("nombre")}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Descripcion
              </label>
              <textarea
                {...register("descripcion")}
                rows={3}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Fecha
                </label>
                <input
                  {...register("fecha")}
                  type="date"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
                {errors.fecha && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.fecha.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Hora Inicio
                </label>
                <input
                  {...register("horaInicio")}
                  type="time"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
                {errors.horaInicio && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.horaInicio.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Hora Fin
                </label>
                <input
                  {...register("horaFin")}
                  type="time"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Ubicacion
              </label>
              <input
                {...register("ubicacion")}
                placeholder="Ej: Sala principal, Patio, etc."
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                {...register("activo")}
                type="checkbox"
                id="activo"
                className="border-border size-4 rounded"
              />
              <label
                htmlFor="activo"
                className="text-foreground text-sm font-medium"
              >
                Evento activo
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2"
          >
            <Trash2 className="size-4" />
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
          <div className="flex gap-3">
            <Link href="/admin/eventos">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="bg-amber hover:bg-amber-dark gap-2"
            >
              <Save className="size-4" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

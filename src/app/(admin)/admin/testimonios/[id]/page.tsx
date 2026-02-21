"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const testimonioSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string().min(1, "Descripcion requerida"),
  videoUrl: z.string().url("URL de video invalida"),
  thumbnail: z.string().url("URL de thumbnail invalida"),
  order: z.number().int(),
  activo: z.boolean(),
})

type TestimonioForm = z.infer<typeof testimonioSchema>

interface Testimonio {
  id: string
  nombre: string
  descripcion: string
  videoUrl: string
  thumbnail: string
  order: number
  activo: boolean
}

export default function EditarTestimonioPage({
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
  } = useForm<TestimonioForm>({
    resolver: zodResolver(testimonioSchema),
  })

  useEffect(() => {
    fetch(`/api/admin/testimonios/${id}`)
      .then((res) => res.json())
      .then((data: Testimonio) => {
        reset({
          nombre: data.nombre,
          descripcion: data.descripcion,
          videoUrl: data.videoUrl,
          thumbnail: data.thumbnail,
          order: data.order,
          activo: data.activo,
        })
      })
      .finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: TestimonioForm) => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/testimonios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push("/admin/testimonios")
      } else {
        setError("Error al actualizar el testimonio")
      }
    } catch {
      setError("Error de conexion")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Estas seguro de eliminar este testimonio?")) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/testimonios/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        router.push("/admin/testimonios")
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
          href="/admin/testimonios"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Volver a testimonios
        </Link>
        <h1 className="text-foreground text-2xl font-bold">
          Editar Testimonio
        </h1>
        <p className="text-muted-foreground mt-1">
          Modifica los datos del testimonio
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
                Nombre
              </label>
              <input
                {...register("nombre")}
                placeholder="Ej: Maria Garcia"
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
                Descripcion / Testimonio
              </label>
              <textarea
                {...register("descripcion")}
                rows={4}
                placeholder="El testimonio de la persona..."
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.descripcion.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                URL del Video (YouTube embed)
              </label>
              <input
                {...register("videoUrl")}
                placeholder="https://www.youtube.com/embed/..."
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Usa el formato embed de YouTube (ej:
                https://www.youtube.com/embed/VIDEO_ID)
              </p>
              {errors.videoUrl && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.videoUrl.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                URL del Thumbnail
              </label>
              <input
                {...register("thumbnail")}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {errors.thumbnail && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium">
                  Orden
                </label>
                <input
                  {...register("order", { valueAsNumber: true })}
                  type="number"
                  className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
                />
              </div>

              <div className="flex items-end pb-2">
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
                    Testimonio activo
                  </label>
                </div>
              </div>
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
            <Link href="/admin/testimonios">
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

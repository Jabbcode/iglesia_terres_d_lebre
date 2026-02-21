"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft } from "lucide-react"
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

export default function NuevoTestimonioPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestimonioForm>({
    resolver: zodResolver(testimonioSchema),
    defaultValues: {
      order: 0,
      activo: true,
    },
  })

  const onSubmit = async (data: TestimonioForm) => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/admin/testimonios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push("/admin/testimonios")
      } else {
        setError("Error al crear el testimonio")
      }
    } catch {
      setError("Error de conexion")
    } finally {
      setSaving(false)
    }
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
        <h1 className="text-foreground text-2xl font-bold">Nuevo Testimonio</h1>
        <p className="text-muted-foreground mt-1">
          Crea un nuevo testimonio para la pagina de Nosotros
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
                Usa el formato embed de YouTube (ej: https://www.youtube.com/embed/VIDEO_ID)
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

        <div className="flex justify-end gap-3">
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
            {saving ? "Guardando..." : "Crear Testimonio"}
          </Button>
        </div>
      </form>
    </div>
  )
}

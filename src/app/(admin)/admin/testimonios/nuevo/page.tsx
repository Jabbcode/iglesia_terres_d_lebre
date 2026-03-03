"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  FormHeader,
  FormSection,
  FormInput,
  FormTextarea,
  FormActions,
  FormError,
} from "@/components/admin/form"
import { ImageUpload } from "@/components/admin/image-upload"
import { FormField } from "@/components/admin/form"
import { api } from "@/shared/api"

const testimonioSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string().min(1, "Descripcion requerida"),
  videoUrl: z.string().url("URL de video invalida"),
  thumbnail: z.string().min(1, "Thumbnail requerido"),
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<TestimonioForm>({
    resolver: zodResolver(testimonioSchema),
    defaultValues: {
      thumbnail: "",
      order: 0,
      activo: true,
    },
  })

  const onSubmit = async (data: TestimonioForm) => {
    setSaving(true)
    setError(null)

    try {
      await api.post("/api/admin/testimonios", data)
      router.push("/admin/testimonios")
    } catch {
      setError("Error de conexion")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <FormHeader
        title="Nuevo Testimonio"
        description="Crea un nuevo testimonio para la pagina de Nosotros"
        backHref="/admin/testimonios"
        backLabel="Volver a testimonios"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <FormError message={error} />

        <FormSection>
          <FormInput
            label="Nombre"
            placeholder="Ej: Maria Garcia"
            error={errors.nombre?.message}
            {...register("nombre")}
          />

          <FormTextarea
            label="Descripcion / Testimonio"
            placeholder="El testimonio de la persona..."
            error={errors.descripcion?.message}
            {...register("descripcion")}
          />

          <FormInput
            label="URL del Video (YouTube)"
            placeholder="https://www.youtube.com/watch?v=..."
            hint="Puedes usar cualquier formato de URL de YouTube"
            error={errors.videoUrl?.message}
            {...register("videoUrl")}
          />

          <FormField label="Thumbnail" error={errors.thumbnail?.message}>
            <ImageUpload
              value={watch("thumbnail")}
              onChange={(url) => setValue("thumbnail", url)}
              folder="testimonios"
              placeholder="Subir imagen de portada del video"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Orden"
              type="number"
              {...register("order", { valueAsNumber: true })}
            />

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
        </FormSection>

        <FormActions
          cancelHref="/admin/testimonios"
          submitLabel="Crear Testimonio"
          isSubmitting={saving}
        />
      </form>
    </div>
  )
}

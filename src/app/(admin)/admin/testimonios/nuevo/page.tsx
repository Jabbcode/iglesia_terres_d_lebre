"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/admin/image-upload"
import { TranslationFields } from "@/components/admin/translation-fields"
import Link from "next/link"
import { api } from "@/shared/api"
import { uploadFile } from "@/lib/supabase"

const testimonioSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string().min(1, "Descripcion requerida"),
  videoUrl: z.string().url("URL de video invalida"),
  order: z.number().int(),
  activo: z.boolean(),
  // Traducciones Català
  ca_nombre: z.string(),
  ca_descripcion: z.string(),
  // Traducciones English
  en_nombre: z.string(),
  en_descripcion: z.string(),
})

type TestimonioForm = z.infer<typeof testimonioSchema>

export default function NuevoTestimonioPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [thumbnail, setThumbnail] = useState<string | File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestimonioForm>({
    resolver: zodResolver(testimonioSchema),
    defaultValues: {
      order: 0,
      activo: true,
      ca_nombre: "", ca_descripcion: "",
      en_nombre: "", en_descripcion: "",
    },
  })

  const onSubmit = async (data: TestimonioForm) => {
    setSaving(true)
    setError(null)

    try {
      let thumbnailUrl: string | null = null
      if (thumbnail instanceof File) {
        thumbnailUrl = await uploadFile(thumbnail, "testimonios")
        if (!thumbnailUrl) {
          setError("Error al subir la imagen")
          setSaving(false)
          return
        }
      } else if (typeof thumbnail === "string") {
        thumbnailUrl = thumbnail
      }

      if (!thumbnailUrl) {
        setError("Thumbnail requerido")
        setSaving(false)
        return
      }

      const translations = []
      if (data.ca_nombre || data.ca_descripcion) {
        translations.push({
          lang: "ca" as const,
          nombre: data.ca_nombre || data.nombre,
          descripcion: data.ca_descripcion || data.descripcion,
        })
      }
      if (data.en_nombre || data.en_descripcion) {
        translations.push({
          lang: "en" as const,
          nombre: data.en_nombre || data.nombre,
          descripcion: data.en_descripcion || data.descripcion,
        })
      }

      await api.post("/api/admin/testimonios", {
        nombre: data.nombre,
        descripcion: data.descripcion,
        videoUrl: data.videoUrl,
        order: data.order,
        activo: data.activo,
        thumbnail: thumbnailUrl,
        translations: translations.length > 0 ? translations : undefined,
      })
      router.push("/admin/testimonios")
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
                <p className="mt-1 text-sm text-red-500">{errors.nombre.message}</p>
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
                <p className="mt-1 text-sm text-red-500">{errors.descripcion.message}</p>
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
                <p className="mt-1 text-sm text-red-500">{errors.videoUrl.message}</p>
              )}
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Thumbnail
              </label>
              <ImageUpload
                value={thumbnail}
                onChange={setThumbnail}
                placeholder="Subir imagen de portada del video"
              />
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
                  <label htmlFor="activo" className="text-foreground text-sm font-medium">
                    Testimonio activo
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TranslationFields
          lang="ca"
          langName="Català"
          fields={[
            { name: "ca_nombre", label: "Nombre", placeholder: "Ej: Maria Garcia", register: register("ca_nombre") },
            { name: "ca_descripcion", label: "Testimonio", type: "textarea", rows: 4, placeholder: "El testimoni de la persona...", register: register("ca_descripcion") },
          ]}
        />

        <TranslationFields
          lang="en"
          langName="English"
          fields={[
            { name: "en_nombre", label: "Name", placeholder: "Ex: Maria Garcia", register: register("en_nombre") },
            { name: "en_descripcion", label: "Testimony", type: "textarea", rows: 4, placeholder: "The person's testimony...", register: register("en_descripcion") },
          ]}
        />

        <div className="flex justify-end gap-3">
          <Link href="/admin/testimonios">
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={saving} className="bg-amber hover:bg-amber-dark gap-2">
            <Save className="size-4" />
            {saving ? "Guardando..." : "Crear Testimonio"}
          </Button>
        </div>
      </form>
    </div>
  )
}

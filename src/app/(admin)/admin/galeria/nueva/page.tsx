"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/admin/image-upload"
import Link from "next/link"
import { api } from "@/shared/api"
import { uploadFile } from "@/lib/supabase"

const imagenSchema = z.object({
  alt: z.string().min(1, "Texto alternativo requerido"),
  span: z.enum(["normal", "tall", "wide"]),
})

type ImagenForm = z.infer<typeof imagenSchema>

export default function NuevaImagenPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagen, setImagen] = useState<string | File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImagenForm>({
    resolver: zodResolver(imagenSchema),
    defaultValues: {
      span: "normal",
    },
  })

  const onSubmit = async (data: ImagenForm) => {
    setSaving(true)
    setError(null)

    try {
      // Upload image if it's a File
      let imagenUrl: string | null = null
      if (imagen instanceof File) {
        imagenUrl = await uploadFile(imagen, "galeria")
        if (!imagenUrl) {
          setError("Error al subir la imagen")
          setSaving(false)
          return
        }
      } else if (typeof imagen === "string") {
        imagenUrl = imagen
      }

      if (!imagenUrl) {
        setError("Imagen requerida")
        setSaving(false)
        return
      }

      await api.post("/api/admin/galeria", {
        ...data,
        src: imagenUrl,
      })
      router.push("/admin/galeria")
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
          href="/admin/galeria"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Volver a galeria
        </Link>
        <h1 className="text-foreground text-2xl font-bold">Nueva Imagen</h1>
        <p className="text-muted-foreground mt-1">
          Agrega una nueva imagen a la galeria
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
                Imagen
              </label>
              <ImageUpload
                value={imagen}
                onChange={setImagen}
                placeholder="Subir imagen para la galería"
              />
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Texto Alternativo
              </label>
              <input
                {...register("alt")}
                placeholder="Descripcion de la imagen"
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              />
              {errors.alt && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.alt.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">
                Tipo de Imagen
              </label>
              <select
                {...register("span")}
                className="border-border focus:border-amber w-full rounded-lg border bg-white px-4 py-2 focus:outline-none"
              >
                <option value="normal">Normal</option>
                <option value="tall">Vertical (Alta)</option>
                <option value="wide">Horizontal (Ancha)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/galeria">
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
            {saving ? "Guardando..." : "Guardar Imagen"}
          </Button>
        </div>
      </form>
    </div>
  )
}

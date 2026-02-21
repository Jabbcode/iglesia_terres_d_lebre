"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/admin/image-upload"
import { useConfirm } from "@/components/admin/confirm-dialog"
import Link from "next/link"

const imagenSchema = z.object({
  src: z.string().min(1, "Imagen requerida"),
  alt: z.string().min(1, "Texto alternativo requerido"),
  span: z.enum(["normal", "tall", "wide"]),
  order: z.number().int(),
})

type ImagenForm = z.infer<typeof imagenSchema>

export default function EditarImagenPage({
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
  const confirm = useConfirm()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ImagenForm>({
    resolver: zodResolver(imagenSchema),
  })

  useEffect(() => {
    fetch(`/api/admin/galeria`)
      .then((res) => res.json())
      .then((data) => {
        const imagen = data.find(
          (img: ImagenForm & { id: string }) => img.id === id
        )
        if (imagen) {
          reset({
            src: imagen.src,
            alt: imagen.alt,
            span: imagen.span,
            order: imagen.order,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: ImagenForm) => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/galeria/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push("/admin/galeria")
      } else {
        setError("Error al actualizar la imagen")
      }
    } catch {
      setError("Error de conexion")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Eliminar imagen",
      description:
        "¿Estas seguro de eliminar esta imagen? Esta accion no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
    })

    if (!confirmed) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/galeria/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/admin/galeria")
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
        <div className="h-64 max-w-2xl rounded-xl bg-gray-200" />
      </div>
    )
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
        <h1 className="text-foreground text-2xl font-bold">Editar Imagen</h1>
        <p className="text-muted-foreground mt-1">
          Modifica los datos de la imagen
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
                value={watch("src") || ""}
                onChange={(url) => setValue("src", url)}
                folder="galeria"
                placeholder="Subir imagen para la galería"
              />
              {errors.src && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.src.message}
                </p>
              )}
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

            <div className="grid gap-4 sm:grid-cols-2">
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
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
